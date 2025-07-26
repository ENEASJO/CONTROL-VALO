-- =====================================================
-- SCRIPT COMPLETO DE MIGRACIÓN PARA SUPABASE
-- Sistema de Control de Valorizaciones de Obras
-- =====================================================

-- 1. CREAR TABLA EMPRESAS PRIMERO (será referenciada por otras tablas)
CREATE TABLE IF NOT EXISTS empresas (
    id BIGSERIAL PRIMARY KEY,
    ruc VARCHAR(11) NOT NULL UNIQUE,
    razon_social VARCHAR(255) NOT NULL,
    nombre_comercial VARCHAR(255),
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100),
    representante_legal VARCHAR(255),
    es_consorcio BOOLEAN DEFAULT false,
    estado VARCHAR(20) DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO', 'SUSPENDIDO')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para empresas
CREATE INDEX IF NOT EXISTS idx_empresas_ruc ON empresas(ruc);
CREATE INDEX IF NOT EXISTS idx_empresas_estado ON empresas(estado);
CREATE INDEX IF NOT EXISTS idx_empresas_es_consorcio ON empresas(es_consorcio);

-- 2. CREAR TABLA OBRAS BASE
CREATE TABLE IF NOT EXISTS obras (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    codigo VARCHAR(50),
    ubicacion TEXT,
    estado VARCHAR(20) DEFAULT 'PLANIFICACION' CHECK (estado IN ('PLANIFICACION', 'EN_PROCESO', 'FINALIZADA', 'SUSPENDIDA')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para obras
CREATE INDEX IF NOT EXISTS idx_obras_nombre ON obras USING gin(to_tsvector('spanish', nombre));
CREATE INDEX IF NOT EXISTS idx_obras_estado ON obras(estado);
CREATE INDEX IF NOT EXISTS idx_obras_codigo ON obras(codigo) WHERE codigo IS NOT NULL;

-- 3. CREAR TABLA OBRAS_EJECUCION
CREATE TABLE IF NOT EXISTS obras_ejecucion (
    id BIGSERIAL PRIMARY KEY,
    obra_id BIGINT REFERENCES obras(id) ON DELETE CASCADE,
    nombre_obra VARCHAR(255) NOT NULL,
    numero_contrato VARCHAR(100) NOT NULL UNIQUE,
    numero_expediente VARCHAR(100),
    periodo_valorizado VARCHAR(10),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    plazo_ejecucion INTEGER NOT NULL, -- días
    empresa_ejecutora_id BIGINT REFERENCES empresas(id),
    descripcion TEXT,
    ubicacion TEXT,
    monto_contrato DECIMAL(15,2),
    monto_ejecutado DECIMAL(15,2) DEFAULT 0,
    porcentaje_avance DECIMAL(5,2) DEFAULT 0 CHECK (porcentaje_avance >= 0 AND porcentaje_avance <= 100),
    estado VARCHAR(20) DEFAULT 'PROGRAMADA' CHECK (estado IN ('PROGRAMADA', 'EN_EJECUCION', 'PARALIZADA', 'FINALIZADA', 'CANCELADA')),
    observaciones TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para obras_ejecucion
CREATE INDEX IF NOT EXISTS idx_obras_ejecucion_obra_id ON obras_ejecucion(obra_id);
CREATE INDEX IF NOT EXISTS idx_obras_ejecucion_empresa ON obras_ejecucion(empresa_ejecutora_id);
CREATE INDEX IF NOT EXISTS idx_obras_ejecucion_contrato ON obras_ejecucion(numero_contrato);
CREATE INDEX IF NOT EXISTS idx_obras_ejecucion_estado ON obras_ejecucion(estado);
CREATE INDEX IF NOT EXISTS idx_obras_ejecucion_fecha_inicio ON obras_ejecucion(fecha_inicio);

-- 4. CREAR TABLA OBRAS_SUPERVISION
CREATE TABLE IF NOT EXISTS obras_supervision (
    id BIGSERIAL PRIMARY KEY,
    obra_id BIGINT REFERENCES obras(id) ON DELETE CASCADE,
    nombre_obra VARCHAR(255) NOT NULL,
    numero_contrato VARCHAR(100) NOT NULL UNIQUE,
    numero_expediente VARCHAR(100),
    periodo_valorizado VARCHAR(10),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    plazo_ejecucion INTEGER NOT NULL, -- días
    empresa_supervisora_id BIGINT REFERENCES empresas(id),
    descripcion TEXT,
    ubicacion TEXT,
    monto_contrato DECIMAL(15,2),
    monto_ejecutado DECIMAL(15,2) DEFAULT 0,
    porcentaje_avance DECIMAL(5,2) DEFAULT 0 CHECK (porcentaje_avance >= 0 AND porcentaje_avance <= 100),
    estado VARCHAR(20) DEFAULT 'PROGRAMADA' CHECK (estado IN ('PROGRAMADA', 'EN_SUPERVISION', 'PARALIZADA', 'FINALIZADA', 'CANCELADA')),
    observaciones TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para obras_supervision
CREATE INDEX IF NOT EXISTS idx_obras_supervision_obra_id ON obras_supervision(obra_id);
CREATE INDEX IF NOT EXISTS idx_obras_supervision_empresa ON obras_supervision(empresa_supervisora_id);
CREATE INDEX IF NOT EXISTS idx_obras_supervision_contrato ON obras_supervision(numero_contrato);
CREATE INDEX IF NOT EXISTS idx_obras_supervision_estado ON obras_supervision(estado);
CREATE INDEX IF NOT EXISTS idx_obras_supervision_fecha_inicio ON obras_supervision(fecha_inicio);

-- 5. CREAR FUNCIÓN PARA ACTUALIZAR updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. APLICAR TRIGGERS PARA updated_at
CREATE TRIGGER update_empresas_updated_at 
    BEFORE UPDATE ON empresas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_obras_updated_at 
    BEFORE UPDATE ON obras
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_obras_ejecucion_updated_at 
    BEFORE UPDATE ON obras_ejecucion
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_obras_supervision_updated_at 
    BEFORE UPDATE ON obras_supervision
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. CREAR VISTA DE ESTADÍSTICAS
CREATE OR REPLACE VIEW obras_stats AS
SELECT 
    COUNT(DISTINCT o.id) as total_obras,
    COUNT(DISTINCT oe.obra_id) as obras_con_ejecucion,
    COUNT(DISTINCT os.obra_id) as obras_con_supervision,
    COUNT(DISTINCT CASE WHEN oe.obra_id IS NOT NULL AND os.obra_id IS NOT NULL THEN o.id END) as obras_completas,
    COUNT(DISTINCT CASE WHEN oe.obra_id IS NOT NULL AND os.obra_id IS NULL THEN o.id END) as obras_solo_ejecucion,
    COUNT(DISTINCT CASE WHEN oe.obra_id IS NULL AND os.obra_id IS NOT NULL THEN o.id END) as obras_solo_supervision,
    COUNT(DISTINCT CASE WHEN oe.obra_id IS NULL AND os.obra_id IS NULL THEN o.id END) as obras_sin_asignar
FROM obras o
LEFT JOIN obras_ejecucion oe ON o.id = oe.obra_id
LEFT JOIN obras_supervision os ON o.id = os.obra_id;

-- 8. CONFIGURAR ROW LEVEL SECURITY (RLS) - OPCIONAL
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE obras_ejecucion ENABLE ROW LEVEL SECURITY;
ALTER TABLE obras_supervision ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir todo por ahora - ajustar según necesidades)
CREATE POLICY "Enable all operations for empresas" ON empresas
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for obras" ON obras
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for obras_ejecucion" ON obras_ejecucion
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for obras_supervision" ON obras_supervision
    FOR ALL USING (true) WITH CHECK (true);

-- 9. INSERTAR DATOS DE PRUEBA
INSERT INTO empresas (ruc, razon_social, nombre_comercial, direccion, telefono, email, representante_legal, es_consorcio, estado) VALUES 
    ('20123456789', 'CONSTRUCTORA DEMO S.A.C.', 'CONSTRUCTORA DEMO', 'Av. Construcción 123, Lima', '01-234-5678', 'info@constructorademo.com', 'Juan Pérez García', false, 'ACTIVO'),
    ('20987654321', 'SUPERVISORA INGENIEROS S.A.', 'SUPERVISORA ING', 'Jr. Ingeniería 456, Lima', '01-987-6543', 'contacto@supervisoraing.com', 'María González López', false, 'ACTIVO'),
    ('20555666777', 'CONSORCIO OBRAS PUBLICAS', 'CONSORCIO OP', 'Av. República 789, Lima', '01-555-6677', 'consorcio@obraspublicas.com', 'Carlos Mendoza Silva', true, 'ACTIVO'),
    ('20888999111', 'INGENIERIA AVANZADA S.A.', 'ING AVANZADA', 'Jr. Tecnología 321, Lima', '01-888-9911', 'contacto@ingavanzada.com', 'Ana Torres Ruiz', false, 'ACTIVO')
ON CONFLICT (ruc) DO NOTHING;

INSERT INTO obras (nombre, descripcion, codigo, ubicacion, estado) VALUES 
    ('Construcción de Puente Metropolitano', 'Construcción de puente vehicular de 200m de longitud', 'OBRA-2024-001', 'Av. Principal - Distrito Central', 'EN_PROCESO'),
    ('Mejoramiento de Carretera Central', 'Mejoramiento y asfaltado de 15km de carretera', 'OBRA-2024-002', 'Carretera Central Km 25-40', 'EN_PROCESO'),
    ('Ampliación de Hospital Nacional', 'Construcción de nueva ala de emergencias', 'OBRA-2024-003', 'Hospital Nacional - Lima', 'PLANIFICACION'),
    ('Construcción de Centro Educativo', 'Nuevo colegio de 3 niveles para 600 alumnos', 'OBRA-2024-004', 'Distrito San Juan - Lima', 'PLANIFICACION'),
    ('Remodelación de Plaza Principal', 'Remodelación integral de plaza cívica', 'OBRA-2024-005', 'Plaza de Armas - Centro Histórico', 'EN_PROCESO')
ON CONFLICT (nombre) DO NOTHING;

-- Obtener IDs para relacionar datos
DO $$
DECLARE
    obra_puente_id BIGINT;
    obra_carretera_id BIGINT;
    obra_hospital_id BIGINT;
    empresa_constructora_id BIGINT;
    empresa_supervisora_id BIGINT;
    empresa_consorcio_id BIGINT;
BEGIN
    -- Obtener IDs de obras
    SELECT id INTO obra_puente_id FROM obras WHERE codigo = 'OBRA-2024-001';
    SELECT id INTO obra_carretera_id FROM obras WHERE codigo = 'OBRA-2024-002';
    SELECT id INTO obra_hospital_id FROM obras WHERE codigo = 'OBRA-2024-003';
    
    -- Obtener IDs de empresas
    SELECT id INTO empresa_constructora_id FROM empresas WHERE ruc = '20123456789';
    SELECT id INTO empresa_supervisora_id FROM empresas WHERE ruc = '20987654321';
    SELECT id INTO empresa_consorcio_id FROM empresas WHERE ruc = '20555666777';
    
    -- Insertar obras de ejecución
    INSERT INTO obras_ejecucion (obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado, fecha_inicio, plazo_ejecucion, empresa_ejecutora_id, descripcion, ubicacion, monto_contrato, estado) VALUES 
        (obra_puente_id, 'Construcción de Puente Metropolitano', 'CONT-EJE-2024-001', 'EXP-2024-001', '2024-01', '2024-01-15', 365, empresa_constructora_id, 'Construcción de puente vehicular de 200m', 'Av. Principal - Distrito Central', 2500000.00, 'EN_EJECUCION'),
        (obra_carretera_id, 'Mejoramiento de Carretera Central', 'CONT-EJE-2024-002', 'EXP-2024-002', '2024-02', '2024-02-01', 180, empresa_consorcio_id, 'Mejoramiento y asfaltado de carretera', 'Carretera Central Km 25-40', 1800000.00, 'EN_EJECUCION')
    ON CONFLICT (numero_contrato) DO NOTHING;
    
    -- Insertar obras de supervisión
    INSERT INTO obras_supervision (obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado, fecha_inicio, plazo_ejecucion, empresa_supervisora_id, descripcion, ubicacion, monto_contrato, estado) VALUES 
        (obra_puente_id, 'Supervisión Puente Metropolitano', 'CONT-SUP-2024-001', 'EXP-SUP-2024-001', '2024-01', '2024-01-15', 365, empresa_supervisora_id, 'Supervisión de construcción de puente', 'Av. Principal - Distrito Central', 125000.00, 'EN_SUPERVISION'),
        (obra_carretera_id, 'Supervisión Carretera Central', 'CONT-SUP-2024-002', 'EXP-SUP-2024-002', '2024-02', '2024-02-01', 180, empresa_supervisora_id, 'Supervisión de mejoramiento de carretera', 'Carretera Central Km 25-40', 90000.00, 'EN_SUPERVISION')
    ON CONFLICT (numero_contrato) DO NOTHING;
END $$;

-- 10. COMENTARIOS DE DOCUMENTACIÓN
COMMENT ON TABLE empresas IS 'Empresas registradas en el sistema (ejecutoras, supervisoras, consorcios)';
COMMENT ON TABLE obras IS 'Tabla principal de obras base del sistema';
COMMENT ON TABLE obras_ejecucion IS 'Obras en etapa de ejecución con sus contratos y empresas ejecutoras';
COMMENT ON TABLE obras_supervision IS 'Obras en supervisión con sus contratos y empresas supervisoras';
COMMENT ON VIEW obras_stats IS 'Vista con estadísticas de las obras y su estado de asignación';

-- Mostrar resumen
SELECT 'MIGRACIÓN COMPLETADA EXITOSAMENTE' as status;
SELECT 'Empresas creadas: ' || COUNT(*) as resultado FROM empresas;
SELECT 'Obras creadas: ' || COUNT(*) as resultado FROM obras;
SELECT 'Obras ejecución creadas: ' || COUNT(*) as resultado FROM obras_ejecucion;
SELECT 'Obras supervisión creadas: ' || COUNT(*) as resultado FROM obras_supervision;