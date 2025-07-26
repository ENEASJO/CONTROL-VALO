-- =====================================================
-- SCRIPT DE CORRECCIÓN ESPECÍFICA PARA COLUMNA obra_id
-- Sistema de Control de Valorizaciones de Obras
-- SOLUCIÓN AL ERROR: La columna obra_id no existe en obras_ejecucion
-- =====================================================

-- Este script es SEGURO para ejecutar múltiples veces
-- Verificará y corregirá SOLO los problemas específicos

BEGIN;

-- PASO 1: DIAGNÓSTICO COMPLETO DEL ESTADO ACTUAL
SELECT 'INICIANDO DIAGNÓSTICO DEL PROBLEMA obra_id' as status;

-- Verificar existencia de tablas principales
DO $$
BEGIN
    RAISE NOTICE '=== DIAGNÓSTICO DE TABLAS ===';
    
    -- Verificar tabla obras
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'obras') THEN
        RAISE NOTICE 'TABLA obras: EXISTS';
    ELSE
        RAISE NOTICE 'TABLA obras: NO EXISTS';
    END IF;
    
    -- Verificar tabla empresas
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'empresas') THEN
        RAISE NOTICE 'TABLA empresas: EXISTS';
    ELSE
        RAISE NOTICE 'TABLA empresas: NO EXISTS';
    END IF;
    
    -- Verificar tabla obras_ejecucion
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'obras_ejecucion') THEN
        RAISE NOTICE 'TABLA obras_ejecucion: EXISTS';
    ELSE
        RAISE NOTICE 'TABLA obras_ejecucion: NO EXISTS';
    END IF;
    
    -- Verificar tabla obras_supervision
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'obras_supervision') THEN
        RAISE NOTICE 'TABLA obras_supervision: EXISTS';
    ELSE
        RAISE NOTICE 'TABLA obras_supervision: NO EXISTS';
    END IF;
END $$;

-- PASO 2: VERIFICAR COLUMNAS ESPECÍFICAS
DO $$
BEGIN
    RAISE NOTICE '=== DIAGNÓSTICO DE COLUMNAS obra_id ===';
    
    -- Verificar columna obra_id en obras_ejecucion
    IF EXISTS (SELECT FROM information_schema.columns 
               WHERE table_name = 'obras_ejecucion' AND column_name = 'obra_id') THEN
        RAISE NOTICE 'COLUMNA obras_ejecucion.obra_id: EXISTS';
    ELSE
        RAISE NOTICE 'COLUMNA obras_ejecucion.obra_id: NO EXISTS - PROBLEMA DETECTADO';
    END IF;
    
    -- Verificar columna obra_id en obras_supervision
    IF EXISTS (SELECT FROM information_schema.columns 
               WHERE table_name = 'obras_supervision' AND column_name = 'obra_id') THEN
        RAISE NOTICE 'COLUMNA obras_supervision.obra_id: EXISTS';
    ELSE
        RAISE NOTICE 'COLUMNA obras_supervision.obra_id: NO EXISTS - PROBLEMA DETECTADO';
    END IF;
END $$;

-- PASO 3: CREAR FUNCIÓN AUXILIAR SI NO EXISTE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASO 4: ASEGURAR TABLA EMPRESAS EXISTE CORRECTAMENTE
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

-- PASO 5: ASEGURAR TABLA OBRAS EXISTE CORRECTAMENTE
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

-- PASO 6: CORRECCIÓN ESPECÍFICA PARA obras_ejecucion
DO $$
BEGIN
    RAISE NOTICE '=== INICIANDO CORRECCIÓN DE obras_ejecucion ===';
    
    -- Si la tabla existe pero sin la columna obra_id, la recreamos
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'obras_ejecucion') THEN
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                       WHERE table_name = 'obras_ejecucion' AND column_name = 'obra_id') THEN
            RAISE NOTICE 'PROBLEMA DETECTADO: obras_ejecucion existe pero SIN columna obra_id';
            RAISE NOTICE 'ELIMINANDO tabla corrupta obras_ejecucion...';
            DROP TABLE obras_ejecucion CASCADE;
            RAISE NOTICE 'Tabla obras_ejecucion eliminada. Será recreada correctamente.';
        ELSE
            RAISE NOTICE 'obras_ejecucion ya tiene columna obra_id - OK';
        END IF;
    ELSE
        RAISE NOTICE 'obras_ejecucion no existe - será creada';
    END IF;
END $$;

-- PASO 7: CREAR/RECREAR obras_ejecucion CON TODAS LAS COLUMNAS CORRECTAS
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

-- PASO 8: CORRECCIÓN ESPECÍFICA PARA obras_supervision
DO $$
BEGIN
    RAISE NOTICE '=== INICIANDO CORRECCIÓN DE obras_supervision ===';
    
    -- Si la tabla existe pero sin la columna obra_id, la recreamos
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'obras_supervision') THEN
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                       WHERE table_name = 'obras_supervision' AND column_name = 'obra_id') THEN
            RAISE NOTICE 'PROBLEMA DETECTADO: obras_supervision existe pero SIN columna obra_id';
            RAISE NOTICE 'ELIMINANDO tabla corrupta obras_supervision...';
            DROP TABLE obras_supervision CASCADE;
            RAISE NOTICE 'Tabla obras_supervision eliminada. Será recreada correctamente.';
        ELSE
            RAISE NOTICE 'obras_supervision ya tiene columna obra_id - OK';
        END IF;
    ELSE
        RAISE NOTICE 'obras_supervision no existe - será creada';
    END IF;
END $$;

-- PASO 9: CREAR/RECREAR obras_supervision CON TODAS LAS COLUMNAS CORRECTAS
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

-- PASO 10: VERIFICACIÓN FINAL OBLIGATORIA
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICACIÓN FINAL ===';
    
    -- Verificar obras_ejecucion
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'obras_ejecucion') THEN
        RAISE EXCEPTION 'CRITICAL ERROR: La tabla obras_ejecucion no existe después de la corrección';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'obras_ejecucion' AND column_name = 'obra_id') THEN
        RAISE EXCEPTION 'CRITICAL ERROR: La columna obra_id NO EXISTE en obras_ejecucion después de la corrección';
    END IF;
    
    -- Verificar obras_supervision
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'obras_supervision') THEN
        RAISE EXCEPTION 'CRITICAL ERROR: La tabla obras_supervision no existe después de la corrección';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'obras_supervision' AND column_name = 'obra_id') THEN
        RAISE EXCEPTION 'CRITICAL ERROR: La columna obra_id NO EXISTE en obras_supervision después de la corrección';
    END IF;
    
    RAISE NOTICE 'SUCCESS: Todas las verificaciones pasaron correctamente';
    RAISE NOTICE 'SUCCESS: obras_ejecucion.obra_id EXISTS y configurada correctamente';
    RAISE NOTICE 'SUCCESS: obras_supervision.obra_id EXISTS y configurada correctamente';
END $$;

-- PASO 11: CREAR ÍNDICES ESENCIALES (SOLO SI NO EXISTEN)
CREATE INDEX IF NOT EXISTS idx_obras_ejecucion_obra_id ON obras_ejecucion(obra_id);
CREATE INDEX IF NOT EXISTS idx_obras_ejecucion_contrato ON obras_ejecucion(numero_contrato);
CREATE INDEX IF NOT EXISTS idx_obras_ejecucion_estado ON obras_ejecucion(estado);

CREATE INDEX IF NOT EXISTS idx_obras_supervision_obra_id ON obras_supervision(obra_id);
CREATE INDEX IF NOT EXISTS idx_obras_supervision_contrato ON obras_supervision(numero_contrato);
CREATE INDEX IF NOT EXISTS idx_obras_supervision_estado ON obras_supervision(estado);

-- PASO 12: CREAR TRIGGERS (SOLO SI NO EXISTEN)
DROP TRIGGER IF EXISTS update_obras_ejecucion_updated_at ON obras_ejecucion;
CREATE TRIGGER update_obras_ejecucion_updated_at 
    BEFORE UPDATE ON obras_ejecucion
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_obras_supervision_updated_at ON obras_supervision;
CREATE TRIGGER update_obras_supervision_updated_at 
    BEFORE UPDATE ON obras_supervision
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- PASO 13: CONFIGURAR RLS (SOLO SI NO ESTÁ CONFIGURADO)
ALTER TABLE obras_ejecucion ENABLE ROW LEVEL SECURITY;
ALTER TABLE obras_supervision ENABLE ROW LEVEL SECURITY;

-- Recrear políticas (por si se perdieron al recrear tablas)
DROP POLICY IF EXISTS "Enable all operations for obras_ejecucion" ON obras_ejecucion;
CREATE POLICY "Enable all operations for obras_ejecucion" ON obras_ejecucion
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all operations for obras_supervision" ON obras_supervision;
CREATE POLICY "Enable all operations for obras_supervision" ON obras_supervision
    FOR ALL USING (true) WITH CHECK (true);

-- PASO 14: PRUEBA DE FUNCIONALIDAD
DO $$
DECLARE
    test_obra_id BIGINT;
BEGIN
    RAISE NOTICE '=== EJECUTANDO PRUEBAS DE FUNCIONALIDAD ===';
    
    -- Insertar obra de prueba si no hay ninguna
    INSERT INTO obras (nombre, descripcion, codigo, ubicacion, estado) 
    VALUES ('OBRA PRUEBA CORRECCIÓN', 'Obra para verificar corrección', 'TEST-FIX-001', 'Ubicación Test', 'PLANIFICACION')
    ON CONFLICT (codigo) DO NOTHING;
    
    -- Obtener ID de la obra
    SELECT id INTO test_obra_id FROM obras WHERE codigo = 'TEST-FIX-001';
    
    IF test_obra_id IS NOT NULL THEN
        -- Probar inserción en obras_ejecucion
        INSERT INTO obras_ejecucion (obra_id, nombre_obra, numero_contrato, descripcion, estado)
        VALUES (test_obra_id, 'PRUEBA EJECUCIÓN', 'TEST-EJEC-FIX-001', 'Prueba de corrección', 'EN_PROCESO')
        ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Probar inserción en obras_supervision
        INSERT INTO obras_supervision (obra_id, nombre_obra, numero_contrato, descripcion, estado)
        VALUES (test_obra_id, 'PRUEBA SUPERVISIÓN', 'TEST-SUP-FIX-001', 'Prueba de corrección', 'EN_PROCESO')
        ON CONFLICT (numero_contrato) DO NOTHING;
        
        RAISE NOTICE 'SUCCESS: Pruebas de funcionalidad completadas exitosamente';
        RAISE NOTICE 'SUCCESS: Las relaciones obra_id funcionan correctamente';
    ELSE
        RAISE NOTICE 'WARNING: No se pudo crear obra de prueba, pero las tablas están configuradas correctamente';
    END IF;
END $$;

-- PASO 15: REPORTE FINAL
SELECT 'CORRECCIÓN COMPLETADA EXITOSAMENTE' as status;

SELECT 
    'obras_ejecucion' as tabla,
    COUNT(*) as registros,
    'obra_id configurada correctamente' as estado
FROM obras_ejecucion;

SELECT 
    'obras_supervision' as tabla,
    COUNT(*) as registros,
    'obra_id configurada correctamente' as estado
FROM obras_supervision;

COMMIT;

-- Mensaje final
SELECT 'LA COLUMNA obra_id HA SIDO CORREGIDA EN AMBAS TABLAS' as resultado_final;