-- Al-Amin Perfumes — core schema.
-- Products keep the storefront's stable slug ids (used in #perfume/<id> links).

CREATE TABLE products (
  id            TEXT PRIMARY KEY CHECK (length(id) BETWEEN 2 AND 80 AND id NOT GLOB '*[^a-z0-9-]*'),
  name          TEXT NOT NULL DEFAULT '',            -- Arabic display name
  name_en       TEXT NOT NULL DEFAULT '',
  house         TEXT NOT NULL,                       -- brand the perfume is inspired by
  label         TEXT NOT NULL DEFAULT '',            -- e.g. نيش / ديزاينر
  is_new        INTEGER NOT NULL DEFAULT 0 CHECK (is_new IN (0, 1)),
  category      TEXT NOT NULL CHECK (category IN ('men', 'women', 'unisex')),   -- also the quiz audience
  intensity     TEXT NOT NULL CHECK (intensity IN ('light', 'medium', 'strong')),
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  family        TEXT NOT NULL DEFAULT '',
  year          INTEGER CHECK (year IS NULL OR year BETWEEN 1800 AND 2200),
  perfumer      TEXT NOT NULL DEFAULT '',
  notes_top     TEXT NOT NULL DEFAULT '',
  notes_heart   TEXT NOT NULL DEFAULT '',
  notes_base    TEXT NOT NULL DEFAULT '',
  notes_all     TEXT NOT NULL DEFAULT '',
  sort_order    INTEGER NOT NULL,                    -- manual catalog order (1 = first)
  featured_rank INTEGER CHECK (featured_rank IS NULL OR featured_rank > 0),  -- NULL = not in "الأكثر طلبًا"
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CHECK (name <> '' OR name_en <> '')
);
CREATE INDEX idx_products_status_order ON products (status, sort_order);
CREATE INDEX idx_products_order ON products (sort_order);
CREATE INDEX idx_products_featured ON products (featured_rank) WHERE featured_rank IS NOT NULL;

CREATE TABLE product_variants (
  product_id TEXT NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  size_ml    INTEGER NOT NULL CHECK (size_ml BETWEEN 1 AND 1000),
  price      INTEGER NOT NULL CHECK (price > 0),      -- EGP, before the size discount
  PRIMARY KEY (product_id, size_ml)
) WITHOUT ROWID;

-- Image binaries live in R2; D1 stores only the object key + metadata.
CREATE TABLE product_images (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id TEXT NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  object_key TEXT NOT NULL UNIQUE,
  alt_text   TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,              -- 0 = primary image
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_product_images_product ON product_images (product_id, sort_order);

-- Quiz tags (taxonomy of the storefront quiz). Audience = products.category,
-- intensity = products.intensity (single value). Order matters for scents:
-- position 0 is the primary family.
CREATE TABLE product_tags (
  product_id TEXT NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  tag_group  TEXT NOT NULL CHECK (tag_group IN ('scent', 'occasion')),
  tag        TEXT NOT NULL,
  position   INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, tag_group, tag),
  CHECK (
    (tag_group = 'scent' AND tag IN ('fresh', 'sweet', 'woody', 'fruity')) OR
    (tag_group = 'occasion' AND tag IN ('daily', 'evening', 'occasion'))
  )
) WITHOUT ROWID;
CREATE INDEX idx_product_tags_tag ON product_tags (tag_group, tag);

-- Site settings & homepage content (JSON documents), ready for content editing.
CREATE TABLE site_kv (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL CHECK (json_valid(value)),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Admin sessions: only a SHA-256 hash of the session token is stored.
CREATE TABLE admin_sessions (
  token_hash TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  user_agent TEXT NOT NULL DEFAULT ''
);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions (expires_at);

-- Failed-login counter per client IP (rate limiting).
CREATE TABLE login_attempts (
  ip           TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  count        INTEGER NOT NULL
);
