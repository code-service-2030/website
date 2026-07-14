-- ========================================================
-- RUN THIS SQL IN YOUR SUPABASE SQL EDITOR TO FIX DATA FLOW
-- ========================================================

-- 1. Create Required Table: staff (if not exists)
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT '',
    whatsapp VARCHAR(50) DEFAULT '',
    email VARCHAR(255) DEFAULT '',
    photo_url TEXT DEFAULT '',
    active BOOLEAN DEFAULT true,
    signature TEXT DEFAULT '',
    role VARCHAR(100) DEFAULT 'staff',
    department VARCHAR(100) DEFAULT 'services',
    permissions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Required Table: message_templates (if not exists, with VARCHAR ID)
CREATE TABLE IF NOT EXISTS message_templates (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Required Table: order_history (if not exists, with NOT NULL "action" column)
CREATE TABLE IF NOT EXISTS order_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(100) NOT NULL,
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    staff_name TEXT DEFAULT '',
    action VARCHAR(100) NOT NULL, -- e.g. contact_customer, status_changed
    action_type VARCHAR(100) DEFAULT '',
    template_name TEXT DEFAULT '',
    details TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Re-create faq Table (Drop and re-create with VARCHAR ID to fix 400 Bad Request UUID error)
DROP TABLE IF EXISTS faq CASCADE;
CREATE TABLE IF NOT EXISTS faq (
    id VARCHAR(100) PRIMARY KEY,
    q_ar TEXT NOT NULL,
    q_en TEXT NOT NULL,
    a_ar TEXT NOT NULL,
    a_en TEXT NOT NULL,
    visible BOOLEAN DEFAULT TRUE,
    "order" INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Required Table: system_settings (if not exists, with defaults)
CREATE TABLE IF NOT EXISTS system_settings (
    id VARCHAR(100) PRIMARY KEY, -- e.g. 'communication'
    company_email VARCHAR(255) DEFAULT 'eyadk0444@gmail.com',
    primary_phone VARCHAR(50) DEFAULT '+966537073161',
    whatsapp_number VARCHAR(50) DEFAULT '+966537073161',
    support_name VARCHAR(100) DEFAULT 'Support Agent',
    support_department VARCHAR(100) DEFAULT 'Customer Care',
    office_hours VARCHAR(100) DEFAULT '9:00 AM - 5:00 PM',
    email_subject VARCHAR(255) DEFAULT 'New Service Request - {Request ID}',
    email_template TEXT DEFAULT 'Name: {Customer Name}\nPhone: {Phone Number}\nServices: {Requested Services}\nCategory: {Category}\nNotes: {Notes}\nContact Method: {Preferred Contact Method}\nRequest ID: {Request ID}',
    whatsapp_template TEXT DEFAULT 'New Request: {Request ID}\nName: {Customer Name}\nPhone: {Phone Number}\nServices: {Requested Services}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed default settings row if not exists
INSERT INTO system_settings (id, company_email, primary_phone, whatsapp_number, support_name, support_department, office_hours, email_subject, email_template, whatsapp_template)
VALUES ('communication', 'eyadk0444@gmail.com', '+966537073161', '+966537073161', 'Support Agent', 'Customer Care', '9:00 AM - 5:00 PM', 'New Service Request - {Request ID}', 'Name: {Customer Name}\nPhone: {Phone Number}\nServices: {Requested Services}\nCategory: {Category}\nNotes: {Notes}\nContact Method: {Preferred Contact Method}\nRequest ID: {Request ID}', 'New Request: {Request ID}\nName: {Customer Name}\nPhone: {Phone Number}\nServices: {Requested Services}')
ON CONFLICT (id) DO NOTHING;

-- 6. Fix orders (Requests) Table Columns (including Payment Integration columns)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS assigned_staff_id UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_country VARCHAR(100) DEFAULT 'Saudi Arabia';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_country_code VARCHAR(50) DEFAULT '+966';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'unpaid';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'ar';

-- Payment Integration Architecture Fields
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100) DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(255) DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_date VARCHAR(100) DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gateway_name VARCHAR(100) DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS amount_paid NUMERIC DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'SAR';

-- 7. Fix order_items Table Columns (including category_id for verification)
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS category_id VARCHAR(100) DEFAULT 'general';

-- 8. Fix inquiries Table Columns
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS assigned_staff_id UUID;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Saudi Arabia';
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS country_code VARCHAR(50) DEFAULT '+966';

-- 9. Foreign Key References
ALTER TABLE orders DROP CONSTRAINT IF EXISTS fk_orders_assigned_staff;
ALTER TABLE orders ADD CONSTRAINT fk_orders_assigned_staff 
  FOREIGN KEY (assigned_staff_id) REFERENCES staff(id) ON DELETE SET NULL;

ALTER TABLE inquiries DROP CONSTRAINT IF EXISTS fk_inquiries_assigned_staff;
ALTER TABLE inquiries ADD CONSTRAINT fk_inquiries_assigned_staff 
  FOREIGN KEY (assigned_staff_id) REFERENCES staff(id) ON DELETE SET NULL;

-- 10. Enable RLS and Create Policies for Public Access
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read categories" ON categories;
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write categories" ON categories;
CREATE POLICY "Allow public write categories" ON categories FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read services" ON services;
CREATE POLICY "Allow public read services" ON services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write services" ON services;
CREATE POLICY "Allow public write services" ON services FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read faq" ON faq;
CREATE POLICY "Allow public read faq" ON faq FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write faq" ON faq;
CREATE POLICY "Allow public write faq" ON faq FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read announcements" ON announcements;
CREATE POLICY "Allow public read announcements" ON announcements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write announcements" ON announcements;
CREATE POLICY "Allow public write announcements" ON announcements FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read orders" ON orders;
CREATE POLICY "Allow public read orders" ON orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write orders" ON orders;
CREATE POLICY "Allow public write orders" ON orders FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read order_items" ON order_items;
CREATE POLICY "Allow public read order_items" ON order_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write order_items" ON order_items;
CREATE POLICY "Allow public write order_items" ON order_items FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read inquiries" ON inquiries;
CREATE POLICY "Allow public read inquiries" ON inquiries FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write inquiries" ON inquiries;
CREATE POLICY "Allow public write inquiries" ON inquiries FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read staff" ON staff;
CREATE POLICY "Allow public read staff" ON staff FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write staff" ON staff;
CREATE POLICY "Allow public write staff" ON staff FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read message_templates" ON message_templates;
CREATE POLICY "Allow public read message_templates" ON message_templates FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write message_templates" ON message_templates;
CREATE POLICY "Allow public write message_templates" ON message_templates FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE order_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read order_history" ON order_history;
CREATE POLICY "Allow public read order_history" ON order_history FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write order_history" ON order_history;
CREATE POLICY "Allow public write order_history" ON order_history FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read system_settings" ON system_settings;
CREATE POLICY "Allow public read system_settings" ON system_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write system_settings" ON system_settings;
CREATE POLICY "Allow public write system_settings" ON system_settings FOR ALL USING (true) WITH CHECK (true);
