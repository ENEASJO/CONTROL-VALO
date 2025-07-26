-- =====================================================
-- SCRIPT DE CORRECCIÓN: AGREGAR COLUMNAS FALTANTES
-- Sistema de Control de Valorizaciones de Obras
-- =====================================================
-- 
-- Este script corrige el error:
-- ERROR: 42703: column oe.porcentaje_avance does not exist
-- 
-- PROBLEMA DETECTADO:
-- - Las tablas obras_ejecucion y obras_supervision pueden no tener las columnas:
--   * porcentaje_avance
--   * monto_ejecutado
-- 
-- SOLUCIÓN:
-- - Script idempotente que agrega las columnas solo si no existen
-- - Seguro para ejecutar múltiples veces
-- =====================================================

-- VERIFICACIÓN INICIAL
DO $$
DECLARE
    col_exists_oe_porcentaje BOOLEAN;
    col_exists_oe_monto BOOLEAN;
    col_exists_os_porcentaje BOOLEAN;  
    col_exists_os_monto BOOLEAN;
BEGIN
    RAISE NOTICE '=== VERIFICANDO COLUMNAS EXISTENTES ===';
    
    -- Verificar columnas en obras_ejecucion
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_ejecucion' 
        AND column_name = 'porcentaje_avance'
    ) INTO col_exists_oe_porcentaje;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_ejecucion' 
        AND column_name = 'monto_ejecutado'
    ) INTO col_exists_oe_monto;
    
    -- Verificar columnas en obras_supervision
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_supervision' 
        AND column_name = 'porcentaje_avance'
    ) INTO col_exists_os_porcentaje;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_supervision' 
        AND column_name = 'monto_ejecutado'
    ) INTO col_exists_os_monto;
    
    -- Reportar estado actual
    RAISE NOTICE 'obras_ejecucion.porcentaje_avance: %', 
        CASE WHEN col_exists_oe_porcentaje THEN 'EXISTE' ELSE 'FALTA' END;
    RAISE NOTICE 'obras_ejecucion.monto_ejecutado: %', 
        CASE WHEN col_exists_oe_monto THEN 'EXISTE' ELSE 'FALTA' END;
    RAISE NOTICE 'obras_supervision.porcentaje_avance: %', 
        CASE WHEN col_exists_os_porcentaje THEN 'EXISTE' ELSE 'FALTA' END;
    RAISE NOTICE 'obras_supervision.monto_ejecutado: %', 
        CASE WHEN col_exists_os_monto THEN 'EXISTE' ELSE 'FALTA' END;
END $$;

-- AGREGAR COLUMNAS FALTANTES EN OBRAS_EJECUCION
DO $$
BEGIN
    -- Agregar porcentaje_avance si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_ejecucion' 
        AND column_name = 'porcentaje_avance'
    ) THEN
        ALTER TABLE obras_ejecucion 
        ADD COLUMN porcentaje_avance DECIMAL(5,2) DEFAULT 0 
        CHECK (porcentaje_avance >= 0 AND porcentaje_avance <= 100);
        
        RAISE NOTICE '✓ Agregada columna porcentaje_avance a obras_ejecucion';
    ELSE
        RAISE NOTICE '✓ La columna porcentaje_avance ya existe en obras_ejecucion';
    END IF;
    
    -- Agregar monto_ejecutado si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_ejecucion' 
        AND column_name = 'monto_ejecutado'
    ) THEN
        ALTER TABLE obras_ejecucion 
        ADD COLUMN monto_ejecutado DECIMAL(15,2) DEFAULT 0;
        
        RAISE NOTICE '✓ Agregada columna monto_ejecutado a obras_ejecucion';
    ELSE
        RAISE NOTICE '✓ La columna monto_ejecutado ya existe en obras_ejecucion';
    END IF;
END $$;

-- AGREGAR COLUMNAS FALTANTES EN OBRAS_SUPERVISION
DO $$
BEGIN
    -- Agregar porcentaje_avance si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_supervision' 
        AND column_name = 'porcentaje_avance'
    ) THEN
        ALTER TABLE obras_supervision 
        ADD COLUMN porcentaje_avance DECIMAL(5,2) DEFAULT 0 
        CHECK (porcentaje_avance >= 0 AND porcentaje_avance <= 100);
        
        RAISE NOTICE '✓ Agregada columna porcentaje_avance a obras_supervision';
    ELSE
        RAISE NOTICE '✓ La columna porcentaje_avance ya existe en obras_supervision';
    END IF;
    
    -- Agregar monto_ejecutado si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_supervision' 
        AND column_name = 'monto_ejecutado'
    ) THEN
        ALTER TABLE obras_supervision 
        ADD COLUMN monto_ejecutado DECIMAL(15,2) DEFAULT 0;
        
        RAISE NOTICE '✓ Agregada columna monto_ejecutado a obras_supervision';
    ELSE
        RAISE NOTICE '✓ La columna monto_ejecutado ya existe en obras_supervision';
    END IF;
END $$;

-- AGREGAR OTRAS COLUMNAS COMUNES SI FALTAN
DO $$
BEGIN
    -- Agregar observaciones a obras_ejecucion si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_ejecucion' 
        AND column_name = 'observaciones'
    ) THEN
        ALTER TABLE obras_ejecucion 
        ADD COLUMN observaciones TEXT;
        
        RAISE NOTICE '✓ Agregada columna observaciones a obras_ejecucion';
    END IF;
    
    -- Agregar observaciones a obras_supervision si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_supervision' 
        AND column_name = 'observaciones'
    ) THEN
        ALTER TABLE obras_supervision 
        ADD COLUMN observaciones TEXT;
        
        RAISE NOTICE '✓ Agregada columna observaciones a obras_supervision';
    END IF;
    
    -- Agregar fecha_fin a obras_ejecucion si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_ejecucion' 
        AND column_name = 'fecha_fin'
    ) THEN
        ALTER TABLE obras_ejecucion 
        ADD COLUMN fecha_fin DATE;
        
        RAISE NOTICE '✓ Agregada columna fecha_fin a obras_ejecucion';
    END IF;
    
    -- Agregar fecha_fin a obras_supervision si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_supervision' 
        AND column_name = 'fecha_fin'
    ) THEN
        ALTER TABLE obras_supervision 
        ADD COLUMN fecha_fin DATE;
        
        RAISE NOTICE '✓ Agregada columna fecha_fin a obras_supervision';
    END IF;
END $$;

-- VERIFICACIÓN FINAL
DO $$
DECLARE
    col_count_oe INTEGER;
    col_count_os INTEGER;
BEGIN
    RAISE NOTICE '=== VERIFICACIÓN FINAL ===';
    
    -- Contar columnas en obras_ejecucion
    SELECT COUNT(*) INTO col_count_oe 
    FROM information_schema.columns 
    WHERE table_name = 'obras_ejecucion';
    
    -- Contar columnas en obras_supervision
    SELECT COUNT(*) INTO col_count_os 
    FROM information_schema.columns 
    WHERE table_name = 'obras_supervision';
    
    RAISE NOTICE 'Columnas en obras_ejecucion: %', col_count_oe;
    RAISE NOTICE 'Columnas en obras_supervision: %', col_count_os;
    
    -- Verificar columnas críticas
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_ejecucion' 
        AND column_name = 'porcentaje_avance'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_supervision' 
        AND column_name = 'porcentaje_avance'
    ) THEN
        RAISE NOTICE '✅ ÉXITO: Todas las columnas necesarias están disponibles';
        RAISE NOTICE '✅ El script check-and-create-test-data.sql ahora debería funcionar';
    ELSE
        RAISE NOTICE '❌ ERROR: Aún faltan columnas críticas';
    END IF;
END $$;

-- MOSTRAR ESTRUCTURA ACTUAL DE LAS TABLAS
SELECT 
    '=== ESTRUCTURA ACTUAL: obras_ejecucion ===' as info;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'obras_ejecucion'
ORDER BY ordinal_position;

SELECT 
    '=== ESTRUCTURA ACTUAL: obras_supervision ===' as info;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'obras_supervision'
ORDER BY ordinal_position;

-- MENSAJE FINAL
SELECT 
    '🎯 CORRECCIÓN COMPLETADA' as resultado,
    'Ejecutar ahora: check-and-create-test-data.sql' as siguiente_paso;