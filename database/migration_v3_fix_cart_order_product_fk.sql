-- Migration v3
-- Fix products, cart_items, and order_items compatibility

-- Products compatibility
ALTER TABLE products
ADD COLUMN IF NOT EXISTS price NUMERIC(12,2);

UPDATE products
SET price = base_price
WHERE price IS NULL AND base_price IS NOT NULL;

ALTER TABLE products
ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;

-- Fix cart_items product foreign key
ALTER TABLE cart_items
DROP CONSTRAINT IF EXISTS "FK_72679d98b31c737937b8932ebe6";

ALTER TABLE cart_items
DROP CONSTRAINT IF EXISTS cart_items_productId_products_id_fk;

ALTER TABLE cart_items
ADD CONSTRAINT cart_items_productId_products_id_fk
FOREIGN KEY ("productId")
REFERENCES products(id)
ON DELETE CASCADE;

-- Fix cart_items cart foreign key
ALTER TABLE cart_items
DROP CONSTRAINT IF EXISTS cart_items_cartId_carts_id_fk;

ALTER TABLE cart_items
ADD CONSTRAINT cart_items_cartId_carts_id_fk
FOREIGN KEY ("cartId")
REFERENCES carts(id)
ON DELETE CASCADE;

-- Fix order_items product foreign key
ALTER TABLE order_items
DROP CONSTRAINT IF EXISTS "FK_cdb99c05982d5191ac8465ac010";

ALTER TABLE order_items
DROP CONSTRAINT IF EXISTS order_items_productId_products_id_fk;

ALTER TABLE order_items
ADD CONSTRAINT order_items_productId_products_id_fk
FOREIGN KEY ("productId")
REFERENCES products(id)
ON DELETE CASCADE;

-- Fix order_items order foreign key
ALTER TABLE order_items
DROP CONSTRAINT IF EXISTS order_items_orderId_orders_id_fk;

ALTER TABLE order_items
ADD CONSTRAINT order_items_orderId_orders_id_fk
FOREIGN KEY ("orderId")
REFERENCES orders(id)
ON DELETE CASCADE;