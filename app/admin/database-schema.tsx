"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DatabaseSchemaPage() {
  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const sqlSchema = `-- Database Schema for PropertyPro Management System

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Property Manager', 'Maintenance Staff', 'Tenant')),
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    phone VARCHAR(20),
    last_login TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Properties Table
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    manager_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Units Table
CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id),
    unit_number VARCHAR(20) NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms DECIMAL(3,1) NOT NULL,
    square_feet INTEGER NOT NULL,
    rent_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Occupied', 'Maintenance', 'Reserved')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (property_id, unit_number)
);

-- Tenants Table
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    unit_id INTEGER REFERENCES units(id),
    lease_start_date DATE NOT NULL,
    lease_end_date DATE NOT NULL,
    monthly_rent DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Past', 'Evicted')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP,
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Paid', 'Pending', 'Overdue')),
    payment_method VARCHAR(50),
    reference_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Requests Table
CREATE TABLE maintenance_requests (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    unit_id INTEGER NOT NULL REFERENCES units(id),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
    status VARCHAR(20) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Scheduled', 'Completed')),
    assigned_to INTEGER REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Updates Table
CREATE TABLE maintenance_updates (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES maintenance_requests(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    notes TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Announcements Table
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL REFERENCES users(id),
    pinned BOOLEAN NOT NULL DEFAULT FALSE,
    category VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Community Posts Table
CREATE TABLE community_posts (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    content TEXT NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Comments Table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    post_id INTEGER REFERENCES community_posts(id),
    announcement_id INTEGER REFERENCES announcements(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK ((post_id IS NOT NULL AND announcement_id IS NULL) OR (post_id IS NULL AND announcement_id IS NOT NULL))
);

-- Likes Table
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    post_id INTEGER REFERENCES community_posts(id),
    announcement_id INTEGER REFERENCES announcements(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK ((post_id IS NOT NULL AND announcement_id IS NULL) OR (post_id IS NULL AND announcement_id IS NOT NULL)),
    UNIQUE (user_id, post_id, announcement_id)
);

-- Documents Table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    tenant_id INTEGER REFERENCES tenants(id),
    property_id INTEGER REFERENCES properties(id),
    unit_id INTEGER REFERENCES units(id),
    uploaded_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Settings Table
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_group VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_properties_manager_id ON properties(manager_id);
CREATE INDEX idx_units_property_id ON units(property_id);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_tenants_user_id ON tenants(user_id);
CREATE INDEX idx_tenants_unit_id ON tenants(unit_id);
CREATE INDEX idx_payments_tenant_id ON payments(tenant_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_maintenance_requests_tenant_id ON maintenance_requests(tenant_id);
CREATE INDEX idx_maintenance_requests_unit_id ON maintenance_requests(unit_id);
CREATE INDEX idx_maintenance_requests_status ON maintenance_requests(status);
CREATE INDEX idx_announcements_property_id ON announcements(property_id);
CREATE INDEX idx_community_posts_tenant_id ON community_posts(tenant_id);
`

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Database Schema</h1>
        <p className="text-muted-foreground">Reference database schema for the PropertyPro system.</p>
      </div>

      <Tabs defaultValue="schema" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schema">SQL Schema</TabsTrigger>
          <TabsTrigger value="diagram">Entity Relationship</TabsTrigger>
        </TabsList>

        <TabsContent value="schema">
          <Card>
            <CardHeader>
              <CardTitle>SQL Database Schema</CardTitle>
              <CardDescription>PostgreSQL schema for the PropertyPro management system.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="max-h-[600px] overflow-auto rounded-md bg-muted p-4 text-sm">
                  <code>{sqlSchema}</code>
                </pre>
                <div className="absolute bottom-4 right-4">
                  <Button onClick={() => handleDownload(sqlSchema, "propertypro-schema.sql")}>Download SQL</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagram">
          <Card>
            <CardHeader>
              <CardTitle>Entity Relationship Diagram</CardTitle>
              <CardDescription>Visual representation of the database structure.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="bg-muted p-6 rounded-md text-center">
                <p className="text-muted-foreground mb-4">
                  Entity Relationship Diagram would be displayed here in a real implementation.
                </p>
                <p className="text-sm text-muted-foreground">
                  The diagram would show the relationships between Users, Properties, Units, Tenants, Payments, and
                  Maintenance Requests.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
