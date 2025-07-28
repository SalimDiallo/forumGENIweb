
CREATE TABLE blog_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#10B981',
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_slug (slug),
    KEY idx_is_active (is_active)
);

-- Articles de blog (gérés par admin)
CREATE TABLE blog_posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    featured_image VARCHAR(500),
    author_name VARCHAR(200) NOT NULL, -- Nom de l'auteur (pas de relation)
    author_position VARCHAR(200), -- Poste de l'auteur
    category_id BIGINT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    read_time_minutes INT DEFAULT 5,
    views_count BIGINT DEFAULT 0,
    likes_count BIGINT DEFAULT 0,
    meta_title VARCHAR(300),
    meta_description VARCHAR(500),
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE RESTRICT,
    KEY idx_slug (slug),
    KEY idx_status (status),
    KEY idx_is_featured (is_featured),
    KEY idx_published_at (published_at)
);

-- Tags pour les articles
CREATE TABLE blog_tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#10B981',
    usage_count BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_slug (slug)
);

-- Relation many-to-many entre articles et tags
CREATE TABLE blog_post_tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES blog_tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_tag (post_id, tag_id)
);

-- Événements (consultation + inscription simple)
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    featured_image VARCHAR(500),
    event_type ENUM('forum', 'workshop', 'conference', 'networking', 'webinar', 'other') NOT NULL,
    location VARCHAR(300),
    is_virtual BOOLEAN DEFAULT FALSE,
    virtual_link VARCHAR(500),
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    registration_start DATETIME,
    registration_end DATETIME,
    max_participants INT,
    current_participants INT DEFAULT 0,
    is_free BOOLEAN DEFAULT TRUE,
    price DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'MAD',
    status ENUM('draft', 'published', 'ongoing', 'completed', 'cancelled') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    organizer_name VARCHAR(200) NOT NULL, -- Nom organisateur (pas de relation)
    agenda JSON, -- Programme détaillé
    speakers JSON, -- Liste des intervenants
    sponsors JSON, -- Liste des sponsors
    requirements TEXT,
    what_to_bring TEXT,
    meta_title VARCHAR(300),
    meta_description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    KEY idx_slug (slug),
    KEY idx_event_type (event_type),
    KEY idx_start_date (start_date),
    KEY idx_status (status),
    KEY idx_is_featured (is_featured)
);

-- Inscriptions aux événements (formulaire simple)
CREATE TABLE event_registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    organization VARCHAR(200),
    position VARCHAR(100),
    experience_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    expectations TEXT,
    dietary_restrictions TEXT,
    special_needs TEXT,
    newsletter_consent BOOLEAN DEFAULT FALSE,
    registration_status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'refunded', 'exempted') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    qr_code VARCHAR(500),
    ip_address VARCHAR(45),
    user_agent TEXT,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    attended_at TIMESTAMP NULL,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    KEY idx_event_id (event_id),
    KEY idx_email (email),
    KEY idx_registration_status (registration_status)
);

-- Offres d'emploi et stages (consultation uniquement)
CREATE TABLE job_offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    company_name VARCHAR(200) NOT NULL, -- Nom entreprise direct
    company_logo VARCHAR(500),
    company_website VARCHAR(500),
    industry VARCHAR(100),
    job_type ENUM('stage', 'cdi', 'cdd', 'freelance', 'alternance') NOT NULL,
    location VARCHAR(200),
    is_remote BOOLEAN DEFAULT FALSE,
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    salary_currency VARCHAR(3) DEFAULT 'MAD',
    salary_period ENUM('hour', 'day', 'month', 'year') DEFAULT 'month',
    description LONGTEXT NOT NULL,
    requirements LONGTEXT,
    benefits TEXT,
    application_email VARCHAR(255), -- Email pour candidater
    application_url VARCHAR(500), -- URL externe pour candidater
    application_phone VARCHAR(20), -- Téléphone pour candidater
    application_deadline DATE,
    experience_required ENUM('none', 'junior', 'senior', 'expert') DEFAULT 'none',
    education_level ENUM('bac', 'bac+2', 'bac+3', 'bac+5', 'phd') DEFAULT 'bac+3',
    contract_duration VARCHAR(100),
    start_date DATE,
    skills_required JSON,
    languages_required JSON,
    status ENUM('draft', 'published', 'closed', 'filled') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    views_count BIGINT DEFAULT 0,
    published_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    KEY idx_slug (slug),
    KEY idx_job_type (job_type),
    KEY idx_location (location),
    KEY idx_status (status),
    KEY idx_company_name (company_name),
    KEY idx_published_at (published_at)
);

-- Messages de contact
CREATE TABLE contact_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(300) NOT NULL,
    message TEXT NOT NULL,
    category ENUM('general', 'partnership', 'technical', 'press', 'event', 'career') DEFAULT 'general',
    status ENUM('new', 'in_progress', 'resolved', 'closed') DEFAULT 'new',
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    admin_notes TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    
    KEY idx_email (email),
    KEY idx_status (status),
    KEY idx_category (category),
    KEY idx_created_at (created_at)
);

-- Demandes de partenariat
CREATE TABLE partnership_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL,
    industry VARCHAR(100),
    company_size ENUM('startup', 'pme', 'eti', 'grande_entreprise') NOT NULL,
    website VARCHAR(500),
    contact_name VARCHAR(200) NOT NULL,
    contact_position VARCHAR(100),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    partnership_type ENUM('sponsor', 'recruiter', 'speaker', 'mentor', 'other') NOT NULL,
    budget_range VARCHAR(100),
    objectives TEXT,
    previous_partnerships TEXT,
    additional_info TEXT,
    status ENUM('pending', 'reviewing', 'approved', 'rejected', 'on_hold') DEFAULT 'pending',
    rejection_reason TEXT,
    admin_notes TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    approved_at TIMESTAMP NULL,
    
    KEY idx_status (status),
    KEY idx_partnership_type (partnership_type),
    KEY idx_company_name (company_name),
    KEY idx_submitted_at (submitted_at)
);

-- Galerie photos/vidéos
CREATE TABLE media_gallery (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    media_type ENUM('image', 'video') NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    alt_text VARCHAR(500),
    event_id BIGINT NULL, -- Peut être lié à un événement
    album VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    uploaded_by_name VARCHAR(200), -- Nom de l'uploader (admin)
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
    KEY idx_media_type (media_type),
    KEY idx_event_id (event_id),
    KEY idx_album (album),
    KEY idx_is_featured (is_featured)
);

-- Témoignages vidéo
CREATE TABLE video_testimonials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    position VARCHAR(200),
    company VARCHAR(200),
    graduation_year INT,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    quote TEXT,
    full_transcript TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    KEY idx_is_featured (is_featured),
    KEY idx_is_active (is_active),
    KEY idx_graduation_year (graduation_year)
);

-- Newsletter subscriptions (sans compte utilisateur)
CREATE TABLE newsletter_subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(200),
    categories JSON, -- Catégories d'intérêt
    frequency ENUM('daily', 'weekly', 'monthly') DEFAULT 'weekly',
    is_active BOOLEAN DEFAULT TRUE,
    confirmation_token VARCHAR(255),
    confirmed_at TIMESTAMP NULL,
    source VARCHAR(100), -- D'où vient l'inscription (contact_form, event_registration, etc.)
    ip_address VARCHAR(45),
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL,
    
    KEY idx_email (email),
    KEY idx_is_active (is_active),
    KEY idx_source (source)
);

-- Statistiques et analytics
CREATE TABLE site_analytics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    page_views BIGINT DEFAULT 0,
    unique_visitors BIGINT DEFAULT 0,
    newsletter_signups BIGINT DEFAULT 0,
    event_registrations BIGINT DEFAULT 0,
    contact_messages BIGINT DEFAULT 0,
    partnership_requests BIGINT DEFAULT 0,
    job_views BIGINT DEFAULT 0,
    blog_views BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_date (date),
    KEY idx_date (date)
);

-- Table admin pour la gestion du contenu
CREATE TABLE admin_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    role ENUM('super_admin', 'admin', 'editor') DEFAULT 'editor',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    KEY idx_username (username),
    KEY idx_email (email),
    KEY idx_role (role)
);

-- Sessions admin
CREATE TABLE admin_sessions (
    id VARCHAR(128) PRIMARY KEY,
    admin_id BIGINT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE,
    KEY idx_admin_id (admin_id),
    KEY idx_expires_at (expires_at)
);

-- =====================================
-- VUES UTILES
-- =====================================

-- Vue pour les statistiques du dashboard admin
CREATE VIEW admin_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM events WHERE status = 'published' AND start_date > NOW()) as upcoming_events,
    (SELECT COUNT(*) FROM job_offers WHERE status = 'published' AND expires_at > NOW()) as active_jobs,
    (SELECT COUNT(*) FROM blog_posts WHERE status = 'published') as published_articles,
    (SELECT COUNT(*) FROM event_registrations WHERE registration_status = 'confirmed') as total_registrations,
    (SELECT COUNT(*) FROM contact_messages WHERE status = 'new') as pending_messages,
    (SELECT COUNT(*) FROM partnership_requests WHERE status = 'pending') as pending_partnerships,
    (SELECT COUNT(*) FROM newsletter_subscriptions WHERE is_active = TRUE) as newsletter_subscribers;

-- =====================================
-- DONNÉES D'EXEMPLE
-- =====================================

-- Catégories de blog par défaut
INSERT INTO blog_categories (name, slug, description, color, icon) VALUES
('Innovation', 'innovation', 'Articles sur les nouvelles technologies et innovations', '#3B82F6', 'Lightbulb'),
('Entrepreneuriat', 'entrepreneuriat', 'Conseils et histoires d\'entrepreneurs', '#10B981', 'TrendingUp'),
('Carrières', 'carrieres', 'Conseils carrière et opportunités professionnelles', '#8B5CF6', 'Briefcase'),
('Industrie', 'industrie', 'Actualités et analyses de l\'industrie', '#F59E0B', 'Factory'),
('Événements', 'evenements', 'Retours sur nos événements et annonces', '#EF4444', 'Calendar');

-- Tags par défaut
INSERT INTO blog_tags (name, slug, color) VALUES
('IA', 'ia', '#3B82F6'),
('Startup', 'startup', '#10B981'),
('Maroc', 'maroc', '#EF4444'),
('Technologie', 'technologie', '#8B5CF6'),
('Innovation', 'innovation', '#F59E0B'),
('Carrière', 'carriere', '#06B6D4'),
('Entrepreneuriat', 'entrepreneuriat', '#84CC16'),
('Digital', 'digital', '#F97316');

-- Utilisateur admin par défaut
INSERT INTO admin_users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@forumgenie.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin Forum', 'super_admin');

-- =====================================
-- TRIGGERS
-- =====================================

-- Incrémenter les vues d'articles
DELIMITER $$
CREATE TRIGGER increment_blog_views 
AFTER UPDATE ON blog_posts 
FOR EACH ROW 
BEGIN 
    IF NEW.views_count > OLD.views_count THEN
        INSERT INTO site_analytics (date, blog_views) 
        VALUES (CURDATE(), 1)
        ON DUPLICATE KEY UPDATE blog_views = blog_views + 1;
    END IF;
END$$

-- Incrémenter les vues d'offres d'emploi
CREATE TRIGGER increment_job_views 
AFTER UPDATE ON job_offers 
FOR EACH ROW 
BEGIN 
    IF NEW.views_count > OLD.views_count THEN
        INSERT INTO site_analytics (date, job_views) 
        VALUES (CURDATE(), 1)
        ON DUPLICATE KEY UPDATE job_views = job_views + 1;
    END IF;
END$$

-- Mettre à jour les participants d'événements
CREATE TRIGGER update_event_participants 
AFTER INSERT ON event_registrations 
FOR EACH ROW 
BEGIN 
    UPDATE events 
    SET current_participants = (
        SELECT COUNT(*) 
        FROM event_registrations 
        WHERE event_id = NEW.event_id 
        AND registration_status = 'confirmed'
    ) 
    WHERE id = NEW.event_id;
END$$

DELIMITER ;
