-- ========================================================
-- RUN THIS SQL IN YOUR SUPABASE SQL EDITOR TO FIX DATA FLOW
-- ========================================================

-- 1. Fix orders (Requests) Table Columns (including Payment Integration columns)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS assigned_staff_id UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_country VARCHAR(100) DEFAULT 'Saudi Arabia';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_country_code VARCHAR(50) DEFAULT '+966';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'unpaid';

-- Payment Integration Architecture Fields
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100) DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(255) DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_date VARCHAR(100) DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gateway_name VARCHAR(100) DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS amount_paid NUMERIC DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'SAR';

-- 2. Fix order_items Table Columns (including category_id for verification)
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS category_id VARCHAR(100) DEFAULT 'general';

-- 3. Fix inquiries Table Columns
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS assigned_staff_id UUID;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Saudi Arabia';
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS country_code VARCHAR(50) DEFAULT '+966';

-- 4. Fix staff Table Columns
ALTER TABLE staff ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT '';
ALTER TABLE staff ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS permissions TEXT[] DEFAULT '{}';

-- 5. Fix order_history Table Columns
ALTER TABLE order_history ADD COLUMN IF NOT EXISTS staff_id UUID;
ALTER TABLE order_history ADD COLUMN IF NOT EXISTS staff_name TEXT DEFAULT '';
ALTER TABLE order_history ADD COLUMN IF NOT EXISTS action_type TEXT DEFAULT '';
ALTER TABLE order_history ADD COLUMN IF NOT EXISTS template_name TEXT DEFAULT '';

-- 6. Create system_settings Table (Communication settings editable from Admin Dashboard)
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

-- 7. Foreign Key References
ALTER TABLE orders DROP CONSTRAINT IF EXISTS fk_orders_assigned_staff;
ALTER TABLE orders ADD CONSTRAINT fk_orders_assigned_staff 
  FOREIGN KEY (assigned_staff_id) REFERENCES staff(id) ON DELETE SET NULL;

ALTER TABLE inquiries DROP CONSTRAINT IF EXISTS fk_inquiries_assigned_staff;
ALTER TABLE inquiries ADD CONSTRAINT fk_inquiries_assigned_staff 
  FOREIGN KEY (assigned_staff_id) REFERENCES staff(id) ON DELETE SET NULL;

-- 8. RLS Policies for New Tables
-- Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read categories" ON categories;
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write categories" ON categories;
CREATE POLICY "Allow public write categories" ON categories FOR ALL USING (true) WITH CHECK (true);

-- Services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read services" ON services;
CREATE POLICY "Allow public read services" ON services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write services" ON services;
CREATE POLICY "Allow public write services" ON services FOR ALL USING (true) WITH CHECK (true);

-- FAQ
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read faq" ON faq;
CREATE POLICY "Allow public read faq" ON faq FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write faq" ON faq;
CREATE POLICY "Allow public write faq" ON faq FOR ALL USING (true) WITH CHECK (true);

-- Announcements
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read announcements" ON announcements;
CREATE POLICY "Allow public read announcements" ON announcements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write announcements" ON announcements;
CREATE POLICY "Allow public write announcements" ON announcements FOR ALL USING (true) WITH CHECK (true);

-- Orders & Order Items
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

-- Inquiries
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read inquiries" ON inquiries;
CREATE POLICY "Allow public read inquiries" ON inquiries FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write inquiries" ON inquiries;
CREATE POLICY "Allow public write inquiries" ON inquiries FOR ALL USING (true) WITH CHECK (true);

-- Staff
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read staff" ON staff;
CREATE POLICY "Allow public read staff" ON staff FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write staff" ON staff;
CREATE POLICY "Allow public write staff" ON staff FOR ALL USING (true) WITH CHECK (true);

-- Message Templates
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read message_templates" ON message_templates;
CREATE POLICY "Allow public read message_templates" ON message_templates FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write message_templates" ON message_templates;
CREATE POLICY "Allow public write message_templates" ON message_templates FOR ALL USING (true) WITH CHECK (true);

-- Order History
ALTER TABLE order_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read order_history" ON order_history;
CREATE POLICY "Allow public read order_history" ON order_history FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write order_history" ON order_history;
CREATE POLICY "Allow public write order_history" ON order_history FOR ALL USING (true) WITH CHECK (true);

-- System Settings
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read system_settings" ON system_settings;
CREATE POLICY "Allow public read system_settings" ON system_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write system_settings" ON system_settings;
CREATE POLICY "Allow public write system_settings" ON system_settings FOR ALL USING (true) WITH CHECK (true);
