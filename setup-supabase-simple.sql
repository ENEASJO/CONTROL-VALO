-- =====================================================
-- SCRIPT SIMPLE Y ROBUSTO PARA SUPABASE
-- Sistema de Control de Valorizaciones de Obras
-- Ejecutar paso a paso para evitar errores
-- =====================================================

-- PASO 1: ELIMINAR TABLAS EXISTENTES SI HAY PROBLEMAS (opcional)
-- Descomentar solo si hay problemas con tablas corruptas
-- DROP TABLE IF EXISTS obras_supervision CASCADE;
-- DROP TABLE IF EXISTS obras_ejecucion CASCADE;
-- DROP TABLE IF EXISTS obras CASCADE;
-- DROP TABLE IF EXISTS empresas CASCADE;

-- PASO 2: CREAR FUNCIÓN AUXILIAR PARA TIMESTAMPS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASO 3: CREAR TABLA EMPRESAS PRIMERO
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

-- Verificar que la tabla empresas se creó correctamente
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'empresas') THEN
        RAISE EXCEPTION 'ERROR: La tabla empresas no se pudo crear';
    END IF;
    RAISE NOTICE 'SUCCESS: Tabla empresas creada correctamente';
END $$;

-- PASO 4: CREAR TABLA OBRAS BASE
CREATE TABLE IF NOT EXISTS obras (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    codigo VARCHAR(50) UNIQUE,
    ubicacion TEXT,
    estado VARCHAR(20) DEFAULT 'PLANIFICACION' CHECK (estado IN ('PLANIFICACION', 'EN_PROCESO', 'FINALIZADA', 'SUSPENDIDA')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verificar que la tabla obras se creó correctamente
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'obras') THEN
        RAISE EXCEPTION 'ERROR: La tabla obras no se pudo crear';
    END IF;
    RAISE NOTICE 'SUCCESS: Tabla obras creada correctamente';
END $$;

-- PASO 5: CREAR TABLA OBRAS_EJECUCION (CON REFERENCIA CORRECTA)
CREATE TABLE IF NOT EXISTS obras_ejecucion (
    id BIGSERIAL PRIMARY KEY,
    obra_id BIGINT NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
    nombre_obra VARCHAR(255) NOT NULL,
    numero_contrato VARCHAR(100) NOT NULL UNIQUE,
    numero_expediente VARCHAR(100),
    periodo_valorizado VARCHAR(20),
    fecha_inicio DATE,
    plazo_ejecucion INTEGER,
    empresa_ejecutora_id BIGINT REFERENCES empresas(id),
    descripcion TEXT,
    ubicacion TEXT,
    monto_contrato DECIMAL(15,2),
    estado VARCHAR(20) DEFAULT 'EN_PROCESO' CHECK (estado IN ('EN_PROCESO', 'PARALIZADA', 'FINALIZADA', 'RESUELTO')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verificar que la tabla obras_ejecucion se creó correctamente
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'obras_ejecucion') THEN
        RAISE EXCEPTION 'ERROR: La tabla obras_ejecucion no se pudo crear';
    END IF;
    
    -- Verificar que la columna obra_id existe y tiene la referencia correcta
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'obras_ejecucion' AND column_name = 'obra_id') THEN
        RAISE EXCEPTION 'ERROR: La columna obra_id no existe en obras_ejecucion';
    END IF;
    
    RAISE NOTICE 'SUCCESS: Tabla obras_ejecucion creada correctamente con referencia a obras(id)';
END $$;

-- PASO 6: CREAR TABLA OBRAS_SUPERVISION (CON REFERENCIA CORRECTA)
CREATE TABLE IF NOT EXISTS obras_supervision (
    id BIGSERIAL PRIMARY KEY,
    obra_id BIGINT NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
    nombre_obra VARCHAR(255) NOT NULL,
    numero_contrato VARCHAR(100) NOT NULL UNIQUE,
    numero_expediente VARCHAR(100),
    periodo_valorizado VARCHAR(20),
    fecha_inicio DATE,
    plazo_ejecucion INTEGER,
    empresa_supervisora_id BIGINT REFERENCES empresas(id),
    descripcion TEXT,
    ubicacion TEXT,
    monto_contrato DECIMAL(15,2),
    estado VARCHAR(20) DEFAULT 'EN_PROCESO' CHECK (estado IN ('EN_PROCESO', 'PARALIZADA', 'FINALIZADA', 'RESUELTO')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verificar que la tabla obras_supervision se creó correctamente
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'obras_supervision') THEN
        RAISE EXCEPTION 'ERROR: La tabla obras_supervision no se pudo crear';
    END IF;
    
    -- Verificar que la columna obra_id existe y tiene la referencia correcta
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'obras_supervision' AND column_name = 'obra_id') THEN
        RAISE EXCEPTION 'ERROR: La columna obra_id no existe en obras_supervision';
    END IF;
    
    RAISE NOTICE 'SUCCESS: Tabla obras_supervision creada correctamente con referencia a obras(id)';
END $$;

-- PASO 7: CREAR ÍNDICES ESENCIALES
CREATE INDEX IF NOT EXISTS idx_empresas_ruc ON empresas(ruc);
CREATE INDEX IF NOT EXISTS idx_empresas_estado ON empresas(estado);

CREATE INDEX IF NOT EXISTS idx_obras_codigo ON obras(codigo) WHERE codigo IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_obras_estado ON obras(estado);

CREATE INDEX IF NOT EXISTS idx_obras_ejecucion_obra_id ON obras_ejecucion(obra_id);
CREATE INDEX IF NOT EXISTS idx_obras_ejecucion_contrato ON obras_ejecucion(numero_contrato);
CREATE INDEX IF NOT EXISTS idx_obras_ejecucion_estado ON obras_ejecucion(estado);

CREATE INDEX IF NOT EXISTS idx_obras_supervision_obra_id ON obras_supervision(obra_id);
CREATE INDEX IF NOT EXISTS idx_obras_supervision_contrato ON obras_supervision(numero_contrato);
CREATE INDEX IF NOT EXISTS idx_obras_supervision_estado ON obras_supervision(estado);

-- PASO 8: CREAR TRIGGERS PARA UPDATED_AT
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

-- PASO 9: CONFIGURAR ROW LEVEL SECURITY (RLS)
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE obras_ejecucion ENABLE ROW LEVEL SECURITY;
ALTER TABLE obras_supervision ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir todo por ahora)
CREATE POLICY "Enable all operations for empresas" ON empresas
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for obras" ON obras
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for obras_ejecucion" ON obras_ejecucion
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for obras_supervision" ON obras_supervision
    FOR ALL USING (true) WITH CHECK (true);

-- PASO 10: INSERTAR DATOS DE PRUEBA
INSERT INTO empresas (ruc, razon_social, nombre_comercial, direccion, telefono, email, representante_legal, es_consorcio, estado) VALUES 
    ('20123456789', 'CONSTRUCTORA LIMA SAC', 'CONSTRUCTORA LIMA', 'Av. Lima 123, Lima', '01-234-5678', 'contacto@constructoralima.com', 'Juan Pérez García', false, 'ACTIVO'),
    ('20987654321', 'INGENIEROS Y ARQUITECTOS SAC', 'ING & ARQ', 'Av. Arquitectura 456, Lima', '01-987-6543', 'info@ingarq.com', 'María González López', false, 'ACTIVO'),
    ('20555666777', 'CONSORCIO OBRAS PUBLICAS', 'CONSORCIO OP', 'Av. República 789, Lima', '01-555-6677', 'consorcio@obraspublicas.com', 'Carlos Mendoza Silva', true, 'ACTIVO')
ON CONFLICT (ruc) DO NOTHING;

INSERT INTO obras (nombre, descripcion, codigo, ubicacion, estado) VALUES 
    ('CONSTRUCCIÓN PUENTE PEATONAL', 'Construcción de puente peatonal de 50 metros de longitud', 'OBRA-2024-001', 'Av. Principal - Distrito Lima', 'EN_PROCESO'),
    ('MEJORAMIENTO CARRETERA RURAL', 'Mejoramiento de 10 km de carretera rural con pavimento rígido', 'OBRA-2024-002', 'Comunidad San José - Provincia Huancayo', 'EN_PROCESO'),
    ('CONSTRUCCIÓN CENTRO DE SALUD', 'Construcción de centro de salud tipo I-3 con equipamiento completo', 'OBRA-2024-003', 'Distrito San Juan - Provincia Ica', 'PLANIFICACION')
ON CONFLICT (codigo) DO NOTHING;

-- PASO 11: INSERTAR DATOS RELACIONADOS (CON VERIFICACIÓN)
DO $$
DECLARE 
    obra_puente_id BIGINT;
    obra_carretera_id BIGINT;
    obra_hospital_id BIGINT;
    empresa_constructora_id BIGINT;
    empresa_ingenieros_id BIGINT;
    empresa_consorcio_id BIGINT;
BEGIN
    -- Obtener IDs de obras
    SELECT id INTO obra_puente_id FROM obras WHERE codigo = 'OBRA-2024-001';
    SELECT id INTO obra_carretera_id FROM obras WHERE codigo = 'OBRA-2024-002';
    SELECT id INTO obra_hospital_id FROM obras WHERE codigo = 'OBRA-2024-003';
    
    -- Obtener IDs de empresas
    SELECT id INTO empresa_constructora_id FROM empresas WHERE ruc = '20123456789';
    SELECT id INTO empresa_ingenieros_id FROM empresas WHERE ruc = '20987654321';
    SELECT id INTO empresa_consorcio_id FROM empresas WHERE ruc = '20555666777';
    
    -- Verificar que tenemos los IDs necesarios
    IF obra_puente_id IS NULL OR obra_carretera_id IS NULL OR empresa_constructora_id IS NULL THEN
        RAISE EXCEPTION 'ERROR: No se pudieron obtener los IDs necesarios para insertar datos relacionados';
    END IF;
    
    -- Insertar obras de ejecución (solo si no existen)
    INSERT INTO obras_ejecucion (obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado, fecha_inicio, plazo_ejecucion, empresa_ejecutora_id, descripcion, ubicacion, monto_contrato, estado) VALUES 
        (obra_puente_id, 'CONSTRUCCIÓN PUENTE PEATONAL', 'EJEC-2024-001', 'EXP-001-2024', '2024-01', '2024-01-15', 180, empresa_constructora_id, 'Ejecución de puente peatonal con estructura metálica', 'Av. Principal - Distrito Lima', 850000.00, 'EN_PROCESO'),
        (obra_carretera_id, 'MEJORAMIENTO CARRETERA RURAL', 'EJEC-2024-002', 'EXP-002-2024', '2024-02', '2024-02-01', 240, empresa_consorcio_id, 'Mejoramiento integral de carretera con pavimento rígido', 'Comunidad San José - Provincia Huancayo', 2500000.00, 'EN_PROCESO')
    ON CONFLICT (numero_contrato) DO NOTHING;
    
    -- Insertar obras de supervisión (solo si no existen)
    INSERT INTO obras_supervision (obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado, fecha_inicio, plazo_ejecucion, empresa_supervisora_id, descripcion, ubicacion, monto_contrato, estado) VALUES 
        (obra_puente_id, 'SUPERVISIÓN PUENTE PEATONAL', 'SUP-2024-001', 'EXP-001-2024', '2024-01', '2024-01-15', 180, empresa_ingenieros_id, 'Supervisión técnica de construcción de puente peatonal', 'Av. Principal - Distrito Lima', 85000.00, 'EN_PROCESO'),
        (obra_carretera_id, 'SUPERVISIÓN CARRETERA RURAL', 'SUP-2024-002', 'EXP-002-2024', '2024-02', '2024-02-01', 240, empresa_ingenieros_id, 'Supervisión integral de mejoramiento de carretera', 'Comunidad San José - Provincia Huancayo', 250000.00, 'EN_PROCESO')
    ON CONFLICT (numero_contrato) DO NOTHING;
    
    RAISE NOTICE 'SUCCESS: Datos de prueba insertados correctamente';
END $$;

-- PASO 12: CREAR VISTA DE ESTADÍSTICAS
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

-- PASO 13: VERIFICACIÓN FINAL Y REPORTES
SELECT 'VERIFICACIÓN FINAL DE TABLAS Y DATOS' as status;

SELECT 
    'Empresas: ' || COUNT(*) || ' registros' as resultado 
FROM empresas;

SELECT 
    'Obras: ' || COUNT(*) || ' registros' as resultado 
FROM obras;

SELECT 
    'Obras Ejecución: ' || COUNT(*) || ' registros' as resultado 
FROM obras_ejecucion;

SELECT 
    'Obras Supervisión: ' || COUNT(*) || ' registros' as resultado 
FROM obras_supervision;

-- Verificar que todas las relaciones funcionan correctamente
SELECT 
    'TEST RELACIONES: Obras con ejecución y supervisión' as test,
    o.nombre,
    oe.numero_contrato as contrato_ejecucion,
    os.numero_contrato as contrato_supervision,
    e1.razon_social as empresa_ejecutora,
    e2.razon_social as empresa_supervisora
FROM obras o
LEFT JOIN obras_ejecucion oe ON o.id = oe.obra_id
LEFT JOIN obras_supervision os ON o.id = os.obra_id
LEFT JOIN empresas e1 ON oe.empresa_ejecutora_id = e1.id
LEFT JOIN empresas e2 ON os.empresa_supervisora_id = e2.id
LIMIT 5;

-- Mostrar estadísticas finales
SELECT * FROM obras_stats;

SELECT 'MIGRACIÓN COMPLETADA EXITOSAMENTE' as status;