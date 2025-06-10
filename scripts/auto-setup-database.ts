#!/usr/bin/env node

/**
 * Automated Database Setup Script
 * This script automatically sets up the database schema and initial data
 */

import { Client } from "pg"
import bcrypt from "bcryptjs"

interface DatabaseConfig {
  connectionString: string
}

class AutoDatabaseSetup {
  private client: Client
  private isConnected = false

  constructor(config: DatabaseConfig) {
    this.client = new Client({
      connectionString: config.connectionString,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    })
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect()
      this.isConnected = true
      console.log("✅ Connected to database")
    } catch (error) {
      console.error("❌ Database connection failed:", error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.end()
      this.isConnected = false
      console.log("✅ Disconnected from database")
    }
  }

  async createTables(): Promise<void> {
    console.log("📋 Creating database tables...")

    const queries = [
      // Enable UUID extension
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,

      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'tenant',
        phone VARCHAR(20),
        avatar_url TEXT,
        email_verified BOOLEAN DEFAULT FALSE,
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        two_factor_secret VARCHAR(255),
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // Properties table
      `CREATE TABLE IF NOT EXISTS properties (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(50) NOT NULL,
        zip_code VARCHAR(20) NOT NULL,
        property_type VARCHAR(50) NOT NULL,
        total_units INTEGER NOT NULL DEFAULT 1,
        landlord_id UUID REFERENCES users(id) ON DELETE CASCADE,
        description TEXT,
        amenities TEXT[],
        images TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // Units table
      `CREATE TABLE IF NOT EXISTS units (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
        unit_number VARCHAR(50) NOT NULL,
        bedrooms INTEGER NOT NULL DEFAULT 1,
        bathrooms DECIMAL(2,1) NOT NULL DEFAULT 1.0,
        square_feet INTEGER,
        rent_amount DECIMAL(10,2) NOT NULL,
        security_deposit DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'available',
        description TEXT,
        amenities TEXT[],
        images TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(property_id, unit_number)
      );`,

      // Leases table
      `CREATE TABLE IF NOT EXISTS leases (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
        tenant_id UUID REFERENCES users(id) ON DELETE CASCADE,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        rent_amount DECIMAL(10,2) NOT NULL,
        security_deposit DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        lease_terms TEXT,
        signed_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // Payments table
      `CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        lease_id UUID REFERENCES leases(id) ON DELETE CASCADE,
        tenant_id UUID REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        payment_type VARCHAR(50) NOT NULL DEFAULT 'rent',
        payment_method VARCHAR(50) NOT NULL,
        stripe_payment_intent_id VARCHAR(255),
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        due_date DATE NOT NULL,
        paid_date TIMESTAMP,
        late_fee DECIMAL(10,2) DEFAULT 0,
        description TEXT,
        receipt_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // Maintenance requests table
      `CREATE TABLE IF NOT EXISTS maintenance_requests (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
        tenant_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        priority VARCHAR(50) NOT NULL DEFAULT 'medium',
        status VARCHAR(50) NOT NULL DEFAULT 'open',
        category VARCHAR(100),
        assigned_to UUID REFERENCES users(id),
        estimated_cost DECIMAL(10,2),
        actual_cost DECIMAL(10,2),
        scheduled_date TIMESTAMP,
        completed_date TIMESTAMP,
        images TEXT[],
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // Bulletin categories table
      `CREATE TABLE IF NOT EXISTS bulletin_categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        color VARCHAR(7) DEFAULT '#3B82F6',
        icon VARCHAR(50) DEFAULT 'MessageSquare',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // Bulletin posts table
      `CREATE TABLE IF NOT EXISTS bulletin_posts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category_id UUID REFERENCES bulletin_categories(id) ON DELETE SET NULL,
        author_id UUID REFERENCES users(id) ON DELETE CASCADE,
        property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
        is_pinned BOOLEAN DEFAULT FALSE,
        is_published BOOLEAN DEFAULT TRUE,
        expires_at TIMESTAMP,
        images TEXT[],
        attachments TEXT[],
        views_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // Notifications table
      `CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        action_url TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
    ]

    for (const query of queries) {
      try {
        await this.client.query(query)
      } catch (error) {
        console.error("❌ Error creating table:", error)
        throw error
      }
    }

    console.log("✅ Database tables created successfully")
  }

  async createIndexes(): Promise<void> {
    console.log("📊 Creating database indexes...")

    const indexes = [
      "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);",
      "CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);",
      "CREATE INDEX IF NOT EXISTS idx_properties_landlord ON properties(landlord_id);",
      "CREATE INDEX IF NOT EXISTS idx_units_property ON units(property_id);",
      "CREATE INDEX IF NOT EXISTS idx_units_status ON units(status);",
      "CREATE INDEX IF NOT EXISTS idx_leases_tenant ON leases(tenant_id);",
      "CREATE INDEX IF NOT EXISTS idx_leases_unit ON leases(unit_id);",
      "CREATE INDEX IF NOT EXISTS idx_leases_status ON leases(status);",
      "CREATE INDEX IF NOT EXISTS idx_payments_lease ON payments(lease_id);",
      "CREATE INDEX IF NOT EXISTS idx_payments_tenant ON payments(tenant_id);",
      "CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);",
      "CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);",
      "CREATE INDEX IF NOT EXISTS idx_maintenance_unit ON maintenance_requests(unit_id);",
      "CREATE INDEX IF NOT EXISTS idx_maintenance_tenant ON maintenance_requests(tenant_id);",
      "CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_requests(status);",
      "CREATE INDEX IF NOT EXISTS idx_bulletin_posts_category ON bulletin_posts(category_id);",
      "CREATE INDEX IF NOT EXISTS idx_bulletin_posts_property ON bulletin_posts(property_id);",
      "CREATE INDEX IF NOT EXISTS idx_bulletin_posts_published ON bulletin_posts(is_published);",
      "CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);",
      "CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);",
    ]

    for (const index of indexes) {
      try {
        await this.client.query(index)
      } catch (error) {
        console.error("❌ Error creating index:", error)
        // Continue with other indexes
      }
    }

    console.log("✅ Database indexes created successfully")
  }

  async createTriggers(): Promise<void> {
    console.log("⚡ Creating database triggers...")

    try {
      // Create updated_at trigger function
      await this.client.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql';
      `)

      // Add triggers to all tables with updated_at column
      const tables = [
        "users",
        "properties",
        "units",
        "leases",
        "payments",
        "maintenance_requests",
        "bulletin_categories",
        "bulletin_posts",
      ]

      for (const table of tables) {
        await this.client.query(`
          DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
          CREATE TRIGGER update_${table}_updated_at 
          BEFORE UPDATE ON ${table} 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `)
      }

      console.log("✅ Database triggers created successfully")
    } catch (error) {
      console.error("❌ Error creating triggers:", error)
      // Continue anyway
    }
  }

  async insertInitialData(): Promise<void> {
    console.log("📝 Inserting initial data...")

    try {
      // Create root admin user
      const hashedPassword = await bcrypt.hash("root", 12)

      await this.client.query(
        `
        INSERT INTO users (name, email, password, role, email_verified) 
        VALUES ($1, $2, $3, $4, $5) 
        ON CONFLICT (email) DO NOTHING
      `,
        ["Root Administrator", "root@admin.com", hashedPassword, "admin", true],
      )

      // Insert default bulletin categories
      const categories = [
        {
          name: "General",
          description: "General announcements and information",
          color: "#3B82F6",
          icon: "MessageSquare",
        },
        { name: "Maintenance", description: "Maintenance updates and schedules", color: "#F59E0B", icon: "Wrench" },
        { name: "Events", description: "Community events and activities", color: "#10B981", icon: "Calendar" },
        { name: "Safety", description: "Safety notices and alerts", color: "#EF4444", icon: "Shield" },
        { name: "Amenities", description: "Amenity updates and information", color: "#8B5CF6", icon: "Star" },
      ]

      for (const category of categories) {
        await this.client.query(
          `
          INSERT INTO bulletin_categories (name, description, color, icon) 
          VALUES ($1, $2, $3, $4) 
          ON CONFLICT (name) DO NOTHING
        `,
          [category.name, category.description, category.color, category.icon],
        )
      }

      console.log("✅ Initial data inserted successfully")
    } catch (error) {
      console.error("❌ Error inserting initial data:", error)
      throw error
    }
  }

  async setupComplete(): Promise<void> {
    try {
      await this.connect()
      await this.createTables()
      await this.createIndexes()
      await this.createTriggers()
      await this.insertInitialData()
      console.log("🎉 Database setup completed successfully!")
    } catch (error) {
      console.error("❌ Database setup failed:", error)
      throw error
    } finally {
      await this.disconnect()
    }
  }
}

// Auto-detect database URL and run setup
async function main() {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL

  if (!databaseUrl) {
    console.error("❌ No database URL found. Please set DATABASE_URL environment variable.")
    process.exit(1)
  }

  console.log("🚀 Starting automated database setup...")

  const setup = new AutoDatabaseSetup({ connectionString: databaseUrl })
  await setup.setupComplete()
}

if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Setup failed:", error)
    process.exit(1)
  })
}

export { AutoDatabaseSetup }
