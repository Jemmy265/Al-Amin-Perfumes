-- Discount rules + free shipping move to their own document (site_kv "pricing"),
-- edited from «الخصومات والشحن» in the admin.
-- The old single size discount (settings.sizeDiscount) becomes a normal rule and
-- settings.freeShippingMin becomes the free-shipping threshold, so what is live today
-- stays live. Safe to run more than once: an existing "pricing" row is kept.

INSERT OR IGNORE INTO site_kv (key, value)
SELECT 'pricing', json_object(
  'discounts',
    CASE
      WHEN COALESCE(json_extract(value, '$.sizeDiscount.percent'), 0) BETWEEN 1 AND 90
       AND COALESCE(json_extract(value, '$.sizeDiscount.size'), 0) >= 1
      THEN json_array(json_object(
        'id', 'legacy-size',
        'name', '',
        'percent', CAST(json_extract(value, '$.sizeDiscount.percent') AS INTEGER),
        'scope', json_object('kind', 'sizes', 'sizes', json_array(CAST(json_extract(value, '$.sizeDiscount.size') AS INTEGER))),
        'enabled', json('true'),
        'startDate', NULL,
        'endDate', NULL
      ))
      ELSE json_array()
    END,
  'freeShipping',
    CASE
      WHEN json_extract(value, '$.freeShippingMin') IS NULL
      THEN json_object('enabled', json('false'), 'min', 0)
      ELSE json_object('enabled', json('true'), 'min', CAST(json_extract(value, '$.freeShippingMin') AS INTEGER))
    END
)
FROM site_kv WHERE key = 'settings';

-- The old fields stay in "settings" for now, so this migration is safe to run before
-- or after deploying the new code (the new code ignores them; the next settings save
-- from the admin removes them).

-- Rebuild the public snapshot on its next read so it carries the rules.
DELETE FROM site_kv WHERE key = 'catalog';
