import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/middleware-auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get dashboard statistics
    const stats = await getDashboardStats(user.id, user.role)
    const recentPayments = await getRecentPayments(user.id, user.role)
    const maintenanceRequests = await getMaintenanceRequests(user.id, user.role)
    const upcomingRent = await getUpcomingRent(user.id, user.role)

    return NextResponse.json({
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        email: user.email,
      },
      stats,
      recentPayments,
      maintenanceRequests,
      upcomingRent,
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function getDashboardStats(userId: string, role: string) {
  try {
    let whereClause = ""
    if (role !== "admin") {
      whereClause = `WHERE p.landlord_id = '${userId}'`
    }

    const [propertiesResult, tenantsResult, revenueResult, maintenanceResult] = await Promise.all([
      // Total properties
      sql`
        SELECT COUNT(*) as total 
        FROM properties p 
        ${role !== "admin" ? sql`WHERE p.landlord_id = ${userId}` : sql``}
      `,

      // Total tenants
      sql`
        SELECT COUNT(*) as total 
        FROM tenants t 
        JOIN properties p ON t.property_id = p.id 
        ${role !== "admin" ? sql`WHERE p.landlord_id = ${userId}` : sql``}
      `,

      // Monthly revenue
      sql`
        SELECT COALESCE(SUM(amount), 0) as total 
        FROM payments pay
        JOIN tenants t ON pay.tenant_id = t.id
        JOIN properties p ON t.property_id = p.id
        WHERE pay.status = 'completed' 
        AND pay.created_at >= date_trunc('month', CURRENT_DATE)
        ${role !== "admin" ? sql`AND p.landlord_id = ${userId}` : sql``}
      `,

      // Pending maintenance
      sql`
        SELECT COUNT(*) as total 
        FROM maintenance_requests mr
        JOIN properties p ON mr.property_id = p.id
        WHERE mr.status IN ('pending', 'in_progress')
        ${role !== "admin" ? sql`AND p.landlord_id = ${userId}` : sql``}
      `,
    ])

    // Calculate occupancy rate
    const occupiedUnits = await sql`
      SELECT COUNT(*) as occupied
      FROM tenants t
      JOIN properties p ON t.property_id = p.id
      WHERE t.lease_end_date > CURRENT_DATE
      ${role !== "admin" ? sql`AND p.landlord_id = ${userId}` : sql``}
    `

    const totalUnits = propertiesResult[0]?.total || 0
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits[0]?.occupied / totalUnits) * 100) : 0

    // Calculate collection rate (payments received vs expected this month)
    const expectedRevenue = await sql`
      SELECT COALESCE(SUM(t.rent_amount), 0) as total
      FROM tenants t
      JOIN properties p ON t.property_id = p.id
      WHERE t.lease_end_date > CURRENT_DATE
      ${role !== "admin" ? sql`AND p.landlord_id = ${userId}` : sql``}
    `

    const actualRevenue = revenueResult[0]?.total || 0
    const expected = expectedRevenue[0]?.total || 0
    const collectionRate = expected > 0 ? Math.round((actualRevenue / expected) * 100) : 100

    return {
      totalProperties: Number.parseInt(propertiesResult[0]?.total || 0),
      totalTenants: Number.parseInt(tenantsResult[0]?.total || 0),
      monthlyRevenue: Number.parseFloat(revenueResult[0]?.total || 0),
      pendingMaintenance: Number.parseInt(maintenanceResult[0]?.total || 0),
      occupancyRate,
      collectionRate,
    }
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    return {
      totalProperties: 0,
      totalTenants: 0,
      monthlyRevenue: 0,
      pendingMaintenance: 0,
      occupancyRate: 0,
      collectionRate: 0,
    }
  }
}

async function getRecentPayments(userId: string, role: string) {
  try {
    const payments = await sql`
      SELECT 
        p.id,
        CONCAT(u.first_name, ' ', u.last_name) as tenant_name,
        p.amount,
        p.created_at as date,
        p.status
      FROM payments p
      JOIN tenants t ON p.tenant_id = t.id
      JOIN users u ON t.user_id = u.id
      JOIN properties prop ON t.property_id = prop.id
      WHERE p.status = 'completed'
      ${role !== "admin" ? sql`AND prop.landlord_id = ${userId}` : sql``}
      ORDER BY p.created_at DESC
      LIMIT 5
    `

    return payments.map((payment) => ({
      id: payment.id,
      tenant_name: payment.tenant_name,
      amount: Number.parseFloat(payment.amount),
      date: payment.date,
      status: payment.status,
    }))
  } catch (error) {
    console.error("Error getting recent payments:", error)
    return []
  }
}

async function getMaintenanceRequests(userId: string, role: string) {
  try {
    const requests = await sql`
      SELECT 
        mr.id,
        p.address as property_address,
        mr.description,
        mr.priority,
        mr.status,
        mr.created_at
      FROM maintenance_requests mr
      JOIN properties p ON mr.property_id = p.id
      WHERE mr.status IN ('pending', 'in_progress')
      ${role !== "admin" ? sql`AND p.landlord_id = ${userId}` : sql``}
      ORDER BY 
        CASE mr.priority 
          WHEN 'high' THEN 1 
          WHEN 'medium' THEN 2 
          WHEN 'low' THEN 3 
        END,
        mr.created_at DESC
      LIMIT 5
    `

    return requests
  } catch (error) {
    console.error("Error getting maintenance requests:", error)
    return []
  }
}

async function getUpcomingRent(userId: string, role: string) {
  try {
    const upcomingRent = await sql`
      SELECT 
        t.id,
        CONCAT(u.first_name, ' ', u.last_name) as tenant_name,
        p.address as property_address,
        t.rent_amount as amount,
        t.rent_due_date as due_date
      FROM tenants t
      JOIN users u ON t.user_id = u.id
      JOIN properties p ON t.property_id = p.id
      WHERE t.rent_due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
      AND t.lease_end_date > CURRENT_DATE
      ${role !== "admin" ? sql`AND p.landlord_id = ${userId}` : sql``}
      ORDER BY t.rent_due_date ASC
      LIMIT 6
    `

    return upcomingRent.map((rent) => ({
      id: rent.id,
      tenant_name: rent.tenant_name,
      property_address: rent.property_address,
      amount: Number.parseFloat(rent.amount),
      due_date: rent.due_date,
    }))
  } catch (error) {
    console.error("Error getting upcoming rent:", error)
    return []
  }
}
