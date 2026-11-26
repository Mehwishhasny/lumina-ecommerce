-- LUMINA / Additional product catalog
-- Safe to run once or repeatedly after the products table exists.
-- Does not modify existing products, prices, orders, or stock.

INSERT INTO public.products
  (id, name, category, description, image_url, price, stock, featured, active)
VALUES
  ('032d088f-83c4-5ad6-aa17-c12539e48005', 'Linen Cushion Cover', 'Home', 'An understated accent for relaxed spaces.', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=85', 89, 23, true, true),
  ('c222896b-148b-52c1-ac1d-f55361badcac', 'Ceramic Coffee Mug', 'Home', 'A simple favorite for the daily ritual.', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85', 75, 30, false, true),
  ('86c3d7d3-8be5-58a2-b35a-eefa7543c7d7', 'Scented Candle', 'Home', 'Warm notes for calmer evenings.', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85', 99, 24, true, true),
  ('575071e6-4c2d-54a3-89d4-7b5918666062', 'Everyday Backpack', 'Accessories', 'Practical design for days on the move.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85', 199, 17, false, true),
  ('1c37c85f-855e-552d-9c21-04f0ac6e5d37', 'Classic Sunglasses', 'Accessories', 'A timeless finishing touch.', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85', 149, 21, false, true),
  ('742bc757-9e82-5f0d-978a-c3af07d46b0c', 'Crossbody Bag', 'Accessories', 'Compact and effortless for every day.', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85', 239, 13, true, true),
  ('f3595ec4-79db-57fe-a17b-1a24c2f4c4bf', 'Face Care Essentials', 'Beauty', 'A gentle addition to your skincare shelf.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=85', 139, 25, false, true),
  ('2f8808e4-9bf8-5b06-a69d-15ee16973d50', 'Evening Fragrance', 'Beauty', 'A warm, refined scent for after dark.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85', 229, 14, true, true),
  ('be7eb0aa-8a7f-50a6-ab3b-7ae8ece25b17', 'Everyday Camera', 'Tech', 'Capture the moments worth keeping.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85', 499, 8, false, true),
  ('8bdf2e5e-b08a-52ac-b368-0e2154d6be90', 'Wireless Speaker', 'Tech', 'Compact audio for every corner.', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85', 279, 12, false, true),
  ('8feacc48-68b2-5883-b35b-89db16faabd0', 'Canvas Trainers', 'Lifestyle', 'A casual essential you will reach for.', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=85', 179, 26, false, true),
  ('9769e411-c5df-59d1-ba54-17e69b5b1084', 'Weekend Jacket', 'Lifestyle', 'An easy layer for changing days.', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85', 319, 10, false, true)
ON CONFLICT (id) DO NOTHING;

SELECT COUNT(*) AS active_products FROM public.products WHERE active IS TRUE;
