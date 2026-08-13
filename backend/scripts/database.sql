-- =============================================================
-- Portfolio Database Schema (MySQL)
-- Generated automatically. You can import this with:
--   mysql -u root -p < database.sql
-- NOTE: the backend also creates these tables at startup.
-- =============================================================

CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;
;

CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'admin',
      avatar VARCHAR(500) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS about (
      id INT PRIMARY KEY DEFAULT 1,
      first_name VARCHAR(100) NOT NULL DEFAULT '',
      last_name VARCHAR(100) NOT NULL DEFAULT '',
      title_en VARCHAR(200) NOT NULL DEFAULT '',
      title_ar VARCHAR(200) NOT NULL DEFAULT '',
      bio_en TEXT,
      bio_ar TEXT,
      headline_en VARCHAR(300) DEFAULT '',
      headline_ar VARCHAR(300) DEFAULT '',
      location_en VARCHAR(200) DEFAULT '',
      location_ar VARCHAR(200) DEFAULT '',
      email VARCHAR(255) DEFAULT '',
      phone VARCHAR(100) DEFAULT '',
      resume_url VARCHAR(1000) DEFAULT '',
      avatar VARCHAR(500) DEFAULT '',
      avatar_alt_en VARCHAR(200) DEFAULT '',
      avatar_alt_ar VARCHAR(200) DEFAULT '',
      years_experience INT DEFAULT 0,
      projects_completed INT DEFAULT 0,
      clients_served INT DEFAULT 0,
      certification_count INT DEFAULT 0,
      available_for_hire TINYINT(1) NOT NULL DEFAULT 1,
      languages_en TEXT,
      languages_ar TEXT,
      hobbies_en TEXT,
      hobbies_ar TEXT,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `slides` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `title_en` VARCHAR(255) NOT NULL,
  `title_ar` VARCHAR(255) NOT NULL,
  `subtitle_en` VARCHAR(255) NOT NULL,
  `subtitle_ar` VARCHAR(255) NOT NULL,
  `image` VARCHAR(500) NULL NOT NULL,
  `link` VARCHAR(1000) NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `projects` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `title_en` VARCHAR(255) NOT NULL,
  `title_ar` VARCHAR(255) NOT NULL,
  `summary_en` TEXT NOT NULL,
  `summary_ar` TEXT NOT NULL,
  `description_en` TEXT,
  `description_ar` TEXT,
  `category` VARCHAR(255),
  `tech_stack` TEXT NULL NOT NULL,
  `image` VARCHAR(500) NULL,
  `gallery` JSON NULL,
  `github_url` VARCHAR(1000) NULL,
  `live_url` VARCHAR(1000) NULL,
  `start_date` DATE NULL,
  `end_date` DATE NULL,
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `published` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `experiences` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `role_en` VARCHAR(255) NOT NULL,
  `role_ar` VARCHAR(255) NOT NULL,
  `company` VARCHAR(255) NOT NULL,
  `company_logo` VARCHAR(500) NULL,
  `location_en` VARCHAR(255),
  `location_ar` VARCHAR(255),
  `description_en` TEXT NOT NULL,
  `description_ar` TEXT NOT NULL,
  `start_date` DATE NULL NOT NULL,
  `end_date` DATE NULL,
  `current` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `trophies` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `title_en` VARCHAR(255) NOT NULL,
  `title_ar` VARCHAR(255) NOT NULL,
  `description_en` TEXT,
  `description_ar` TEXT,
  `issuer` VARCHAR(255),
  `year` INT NULL,
  `image` VARCHAR(500) NULL,
  `sort_order` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `certificates` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `title_en` VARCHAR(255) NOT NULL,
  `title_ar` VARCHAR(255) NOT NULL,
  `issuer` VARCHAR(255) NOT NULL,
  `description_en` TEXT,
  `description_ar` TEXT,
  `image` VARCHAR(500) NULL,
  `credential_url` VARCHAR(1000) NULL,
  `issue_date` DATE NULL,
  `expiry_date` DATE NULL,
  `sort_order` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `participations` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `title_en` VARCHAR(255) NOT NULL,
  `title_ar` VARCHAR(255) NOT NULL,
  `event_type` VARCHAR(255),
  `role_en` VARCHAR(255),
  `role_ar` VARCHAR(255),
  `description_en` TEXT,
  `description_ar` TEXT,
  `location_en` VARCHAR(255),
  `location_ar` VARCHAR(255),
  `date` DATE NULL,
  `image` VARCHAR(500) NULL,
  `link` VARCHAR(1000) NULL,
  `sort_order` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `skills` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `name_en` VARCHAR(255) NOT NULL,
  `name_ar` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NULL NOT NULL,
  `icon` VARCHAR(255),
  `level` INT NULL,
  `sort_order` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `educations` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `degree_en` VARCHAR(255) NOT NULL,
  `degree_ar` VARCHAR(255) NOT NULL,
  `institution` VARCHAR(255) NOT NULL,
  `field_en` VARCHAR(255),
  `field_ar` VARCHAR(255),
  `description_en` TEXT,
  `description_ar` TEXT,
  `start_date` DATE NULL,
  `end_date` DATE NULL,
  `sort_order` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `services` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `title_en` VARCHAR(255) NOT NULL,
  `title_ar` VARCHAR(255) NOT NULL,
  `description_en` TEXT NOT NULL,
  `description_ar` TEXT NOT NULL,
  `icon` VARCHAR(255),
  `sort_order` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `testimonials` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `role_en` VARCHAR(255) NOT NULL,
  `role_ar` VARCHAR(255) NOT NULL,
  `company` VARCHAR(255),
  `content_en` TEXT NOT NULL,
  `content_ar` TEXT NOT NULL,
  `avatar` VARCHAR(500) NULL,
  `sort_order` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `posts` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `title_en` VARCHAR(255) NOT NULL,
  `title_ar` VARCHAR(255) NOT NULL,
  `excerpt_en` TEXT,
  `excerpt_ar` TEXT,
  `content_en` TEXT NOT NULL,
  `content_ar` TEXT NOT NULL,
  `category` VARCHAR(255),
  `image` VARCHAR(500) NULL,
  `published` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `social_links` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `label` VARCHAR(255) NOT NULL,
  `url` VARCHAR(1000) NULL NOT NULL,
  `icon` VARCHAR(255),
  `sort_order` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contact_messages` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NULL NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATE NULL NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
