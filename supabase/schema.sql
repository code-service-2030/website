-- SQL Schema Definition for Code Services (Supabase PostgreSQL)

-- 1. Create CUSTOMERS table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create CATEGORIES table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(100) PRIMARY KEY,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    desc_ar TEXT NULL,
    desc_en TEXT NULL,
    icon VARCHAR(100) DEFAULT 'Briefcase',
    visible BOOLEAN DEFAULT TRUE,
    "order" INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create SERVICES table
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(100) PRIMARY KEY,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    desc_ar TEXT NULL,
    desc_en TEXT NULL,
    category_id VARCHAR(100) REFERENCES categories(id) ON DELETE CASCADE,
    price VARCHAR(100) NULL,
    docs_ar TEXT NULL,
    docs_en TEXT NULL,
    completion_time_ar VARCHAR(100) NULL,
    completion_time_en VARCHAR(100) NULL,
    keywords TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT FALSE,
    featured_order INT DEFAULT 1,
    visible BOOLEAN DEFAULT TRUE,
    "order" INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create ORDERS table (Requests)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY, -- e.g. REQ-123456
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255) NULL,
    contact_method VARCHAR(50) DEFAULT 'whatsapp', -- whatsapp, call, email
    preferred_time VARCHAR(50) DEFAULT 'afternoon', -- morning, afternoon, evening
    general_notes TEXT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create ORDER_ITEMS table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(100) REFERENCES orders(id) ON DELETE CASCADE,
    service_id VARCHAR(100) REFERENCES services(id) ON DELETE SET NULL,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    price VARCHAR(100) NULL,
    quantity INT DEFAULT 1,
    notes TEXT NULL
);

-- 6. Create ANNOUNCEMENTS table
CREATE TABLE IF NOT EXISTS announcements (
    id VARCHAR(100) PRIMARY KEY,
    text_ar TEXT NOT NULL,
    text_en TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    bg_color VARCHAR(100) DEFAULT 'bg-primary',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create FAQ table
CREATE TABLE IF NOT EXISTS faq (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    q_ar TEXT NOT NULL,
    q_en TEXT NOT NULL,
    a_ar TEXT NOT NULL,
    a_en TEXT NOT NULL,
    visible BOOLEAN DEFAULT TRUE,
    "order" INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create GALLERY table
CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    src VARCHAR(512) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    desc_ar TEXT NULL,
    desc_en TEXT NULL,
    tags VARCHAR(100)[] DEFAULT '{}',
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Create REVIEWS table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    text_ar TEXT NOT NULL,
    text_en TEXT NOT NULL,
    rating INT DEFAULT 5,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Create ADMIN_USERS table (Auth credentials)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_faq_order ON faq("order");

-- 11. Create INQUIRIES table (Contact messages)
CREATE TABLE IF NOT EXISTS inquiries (
    id VARCHAR(100) PRIMARY KEY, -- e.g. KD-2026-000125
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NULL,
    service VARCHAR(100) NULL,
    message TEXT NOT NULL,
    appointment_date VARCHAR(50) NULL,
    appointment_time VARCHAR(50) NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

-- Enable RLS and Create Policies for Public Access
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public operations for clients & admin dashboard
CREATE POLICY "Allow public insert on customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on customers" ON customers FOR SELECT USING (true);

CREATE POLICY "Allow public select on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public select on services" ON services FOR SELECT USING (true);

CREATE POLICY "Allow public insert on orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public update on orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on orders" ON orders FOR DELETE USING (true);

CREATE POLICY "Allow public insert on order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on order_items" ON order_items FOR SELECT USING (true);

CREATE POLICY "Allow public select on faq" ON faq FOR SELECT USING (true);
CREATE POLICY "Allow public select on announcements" ON announcements FOR SELECT USING (true);

CREATE POLICY "Allow public insert on inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on inquiries" ON inquiries FOR SELECT USING (true);
CREATE POLICY "Allow public update on inquiries" ON inquiries FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on inquiries" ON inquiries FOR DELETE USING (true);

