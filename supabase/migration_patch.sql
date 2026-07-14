-- ========================================================
-- RUN THIS SQL IN YOUR SUPABASE SQL EDITOR TO FIX DATA FLOW
-- ========================================================

-- 1. Fix orders (Requests) Table Columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS assigned_staff_id UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_country VARCHAR(100) DEFAULT 'Saudi Arabia';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_country_code VARCHAR(50) DEFAULT '+966';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'unpaid';

-- 2. Fix inquiries Table Columns
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS assigned_staff_id UUID;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Saudi Arabia';
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS country_code VARCHAR(50) DEFAULT '+966';

-- 3. Fix staff Table Columns
ALTER TABLE staff ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT '';
ALTER TABLE staff ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS permissions TEXT[] DEFAULT '{}';

-- 4. Fix order_history Table Columns
ALTER TABLE order_history ADD COLUMN IF NOT EXISTS staff_id UUID;
ALTER TABLE order_history ADD COLUMN IF NOT EXISTS staff_name TEXT DEFAULT '';
ALTER TABLE order_history ADD COLUMN IF NOT EXISTS action_type TEXT DEFAULT '';
ALTER TABLE order_history ADD COLUMN IF NOT EXISTS template_name TEXT DEFAULT '';

-- 5. Foreign Key References (Optional but recommended for data integrity)
-- Let's make sure orders and inquiries assigned_staff_id reference the staff table
ALTER TABLE orders DROP CONSTRAINT IF EXISTS fk_orders_assigned_staff;
ALTER TABLE orders ADD CONSTRAINT fk_orders_assigned_staff 
  FOREIGN KEY (assigned_staff_id) REFERENCES staff(id) ON DELETE SET NULL;

ALTER TABLE inquiries DROP CONSTRAINT IF EXISTS fk_inquiries_assigned_staff;
ALTER TABLE inquiries ADD CONSTRAINT fk_inquiries_assigned_staff 
  FOREIGN KEY (assigned_staff_id) REFERENCES staff(id) ON DELETE SET NULL;

-- 6. RLS Policies for New Tables
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
