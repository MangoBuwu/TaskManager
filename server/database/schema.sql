-- TaskManager Database Schema

-- Tabla de responsables/usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de actividades
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    requires_location BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ubicaciones
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de asignaciones diarias
CREATE TABLE IF NOT EXISTS daily_assignments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
    location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
    assigned_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(activity_id, location_id, assigned_date)
);

-- Tabla de historial de actividades
CREATE TABLE IF NOT EXISTS activity_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
    location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ausencias
CREATE TABLE IF NOT EXISTS absences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Insertar actividades por defecto
INSERT INTO activities (name, description, requires_location) VALUES
('Guadaña', 'Corte de césped y maleza', TRUE),
('Riego', 'Riego de plantas y jardines', TRUE),
('Barrido', 'Limpieza y barrido de áreas', TRUE),
('Servicios', 'Servicios generales de mantenimiento', FALSE)
ON CONFLICT (name) DO NOTHING;

-- Insertar ubicaciones por defecto
INSERT INTO locations (code, description) VALUES
('A01', 'Área A - Sector 01'),
('A02', 'Área A - Sector 02'),
('A03', 'Área A - Sector 03'),
('A04', 'Área A - Sector 04'),
('A05', 'Área A - Sector 05'),
('A06', 'Área A - Sector 06'),
('A07', 'Área A - Sector 07'),
('A08', 'Área A - Sector 08'),
('A09', 'Área A - Sector 09'),
('A10', 'Área A - Sector 10'),
('A11', 'Área A - Sector 11'),
('A12', 'Área A - Sector 12'),
('A13', 'Área A - Sector 13'),
('A14', 'Área A - Sector 14'),
('A15', 'Área A - Sector 15'),
('A16', 'Área A - Sector 16'),
('B01', 'Área B - Sector 01'),
('B02', 'Área B - Sector 02'),
('B03', 'Área B - Sector 03'),
('B04', 'Área B - Sector 04'),
('B05', 'Área B - Sector 05'),
('B06', 'Área B - Sector 06'),
('B07', 'Área B - Sector 07'),
('B08', 'Área B - Sector 08'),
('C01', 'Área C - Sector 01'),
('C02', 'Área C - Sector 02'),
('C03', 'Área C - Sector 03'),
('C04', 'Área C - Sector 04'),
('C05', 'Área C - Sector 05'),
('D01', 'Área D - Sector 01'),
('D02', 'Área D - Sector 02'),
('D03', 'Área D - Sector 03'),
('D04', 'Área D - Sector 04'),
('E01', 'Área E - Sector 01'),
('E02', 'Área E - Sector 02'),
('F01', 'Área F - Sector 01'),
('F02', 'Área F - Sector 02'),
('F03', 'Área F - Sector 03')
ON CONFLICT (code) DO NOTHING;

-- Insertar algunos usuarios de ejemplo
INSERT INTO users (name, email) VALUES
('Juan Pérez', 'juan@example.com'),
('María García', 'maria@example.com'),
('Carlos López', 'carlos@example.com'),
('Ana Martínez', 'ana@example.com')
ON CONFLICT (email) DO NOTHING;

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_daily_assignments_date ON daily_assignments(assigned_date);
CREATE INDEX IF NOT EXISTS idx_daily_assignments_user ON daily_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_assignments_activity ON daily_assignments(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_history_date ON activity_history(date);
CREATE INDEX IF NOT EXISTS idx_activity_history_user ON activity_history(user_id);
CREATE INDEX IF NOT EXISTS idx_absences_date ON absences(date);
CREATE INDEX IF NOT EXISTS idx_absences_user ON absences(user_id);