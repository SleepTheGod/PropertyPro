-- Create bulletin categories table
CREATE TABLE IF NOT EXISTS bulletin_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color code
    icon VARCHAR(50) DEFAULT 'folder',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO bulletin_categories (name, description, color, icon, sort_order) VALUES
('General', 'General announcements and information', '#3B82F6', 'megaphone', 1),
('Maintenance', 'Maintenance requests and updates', '#EF4444', 'wrench', 2),
('Events', 'Community events and activities', '#10B981', 'calendar', 3),
('Safety', 'Safety notices and alerts', '#F59E0B', 'shield-alert', 4),
('Amenities', 'Pool, gym, and facility updates', '#8B5CF6', 'dumbbell', 5)
ON CONFLICT (name) DO NOTHING;

-- Add category_id to bulletin_posts table if it doesn't exist
ALTER TABLE bulletin_posts 
ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES bulletin_categories(id) DEFAULT 1;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_bulletin_posts_category_id ON bulletin_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_bulletin_categories_active ON bulletin_categories(is_active);
