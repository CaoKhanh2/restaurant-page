-- ============================================================
-- Admin Dashboard Schema
-- Import via phpMyAdmin on Hostinger
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Admin users
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Menu categories
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_key VARCHAR(50) UNIQUE NOT NULL,
  title_fr VARCHAR(100) NOT NULL,
  title_en VARCHAR(100),
  display_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dishes
CREATE TABLE IF NOT EXISTS dishes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name_fr VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  price DECIMAL(6,2) NOT NULL,
  description_fr TEXT,
  image_path VARCHAR(500),
  is_featured TINYINT(1) DEFAULT 0,
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Gallery images
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_path VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Banners / announcements
CREATE TABLE IF NOT EXISTS banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  message TEXT NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  starts_at DATETIME DEFAULT NULL,
  ends_at DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  objet VARCHAR(255),
  message TEXT,
  nb_personnes INT DEFAULT NULL,
  reservation_date DATE DEFAULT NULL,
  status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Analytics (page visit log)
CREATE TABLE IF NOT EXISTS analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_url VARCHAR(500),
  referrer VARCHAR(500),
  ip_hash VARCHAR(64),
  visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_visited_at (visited_at),
  INDEX idx_page_url (page_url(100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- Seed: default admin user
-- Username: admin  |  Password: change_me_123
-- CHANGE PASSWORD IMMEDIATELY after first login!
-- ============================================================
INSERT INTO admin_users (username, password_hash) VALUES
('admin', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeGhEGH1PqELCFv.6');
-- Hash above = password_hash('change_me_123', PASSWORD_BCRYPT)

-- Seed: menu categories (matching src/data/menu.js menuOrder)
INSERT INTO categories (category_key, title_fr, title_en, display_order) VALUES
('potages',        'Potages / Soups',                   'Soups',        1),
('entrees',        'Entrées / Starters',                'Starters',     2),
('dimsum',         'Dim Sum (Vapeur)',                   'Dim Sum',      3),
('nouilles',       'Nouilles / Noodles',                'Noodles',      4),
('vegetariens',    'Plats végétariens / Vegetarian',    'Vegetarian',   5),
('poulet',         'Poulet / Chicken',                  'Chicken',      6),
('porc',           'Porc / Pork',                       'Pork',         7),
('boeuf',          'Bœuf / Beef',                       'Beef',         8),
('canard',         'Canard / Duck',                     'Duck',         9),
('crevettes',      'Crevettes / Shrimps',               'Shrimps',     10),
('poisson',        'Poisson / Fish',                    'Fish',        11),
('accompagnements','Accompagnements / Side Dishes',     'Sides',       12);
