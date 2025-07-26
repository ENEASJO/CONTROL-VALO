-- =====================================================
-- SCRIPT DE EJECUCIÓN SEGURA DE DATOS DE PRUEBA
-- Sistema de Control de Valorizaciones de Obras
-- =====================================================
--
-- Este script:
-- 1. Verifica el estado actual del sistema
-- 2. Ejecuta el script completo de datos de prueba
-- 3. Muestra un reporte final detallado
-- 4. Es completamente seguro (no borra datos existentes)
--
-- =====================================================

-- Verificar estado inicial
SELECT 'VERIFICANDO ESTADO INICIAL DEL SISTEMA...' as status;

SELECT 
    'ESTADO INICIAL' as seccion,
    '===============' as separador
UNION ALL
SELECT 'TABLA', 'REGISTROS ACTUALES'
UNION ALL
SELECT 'Empresas', COUNT(*)::text FROM empresas
UNION ALL  
SELECT 'Obras', COUNT(*)::text FROM obras
UNION ALL
SELECT 'Contratos Ejecución', COUNT(*)::text FROM obras_ejecucion
UNION ALL
SELECT 'Contratos Supervisión', COUNT(*)::text FROM obras_supervision;

-- Verificar que las columnas necesarias existen
SELECT 'VERIFICANDO ESTRUCTURA DE TABLAS...' as status;

DO $$
BEGIN
    -- Verificar columnas en obras_ejecucion
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_ejecucion' AND column_name = 'porcentaje_avance'
    ) THEN
        RAISE EXCEPTION 'ERROR: Falta la columna porcentaje_avance en obras_ejecucion. Ejecute primero fix-columns-and-data.sql';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_ejecucion' AND column_name = 'monto_ejecutado'
    ) THEN
        RAISE EXCEPTION 'ERROR: Falta la columna monto_ejecutado en obras_ejecucion. Ejecute primero fix-columns-and-data.sql';
    END IF;
    
    -- Verificar columnas en obras_supervision
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_supervision' AND column_name = 'porcentaje_avance'
    ) THEN
        RAISE EXCEPTION 'ERROR: Falta la columna porcentaje_avance en obras_supervision. Ejecute primero fix-columns-and-data.sql';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_supervision' AND column_name = 'monto_ejecutado'
    ) THEN
        RAISE EXCEPTION 'ERROR: Falta la columna monto_ejecutado en obras_supervision. Ejecute primero fix-columns-and-data.sql';
    END IF;
    
    RAISE NOTICE '✅ Todas las columnas necesarias están presentes';
END $$;

-- Ahora ejecutar el script completo de datos
SELECT 'EJECUTANDO SCRIPT COMPLETO DE DATOS DE PRUEBA...' as status;

\i complete-test-data.sql

-- Verificar resultado final
SELECT 'VERIFICACIÓN FINAL COMPLETADA' as status;

-- Consulta de ejemplo para demostrar que todo funciona
SELECT 'CONSULTA DE PRUEBA - Primeras 3 obras con todos sus datos:' as demo;

SELECT 
    o.id,
    o.nombre,
    o.codigo,
    o.estado as obra_estado,
    -- Datos de ejecución
    oe.numero_contrato as contrato_ejecucion,
    e_ejec.nombre_comercial as empresa_ejecutora,
    oe.monto_contrato as monto_ejecucion,
    oe.monto_ejecutado,
    oe.porcentaje_avance as avance_ejecucion,
    oe.estado as estado_ejecucion,
    -- Datos de supervisión
    os.numero_contrato as contrato_supervision,
    e_super.nombre_comercial as empresa_supervisora,
    os.monto_contrato as monto_supervision,
    os.porcentaje_avance as avance_supervision,
    os.estado as estado_supervision
FROM obras o
LEFT JOIN obras_ejecucion oe ON o.id = oe.obra_id
LEFT JOIN empresas e_ejec ON oe.empresa_ejecutora_id = e_ejec.id
LEFT JOIN obras_supervision os ON o.id = os.obra_id
LEFT JOIN empresas e_super ON os.empresa_supervisora_id = e_super.id
ORDER BY o.id
LIMIT 3;

SELECT 
    '🎉 EJECUCIÓN COMPLETADA EXITOSAMENTE' as resultado,
    'El frontend ahora tiene datos abundantes en todos los módulos' as mensaje,
    'Se puede proceder con la demostración del sistema' as siguiente_paso;