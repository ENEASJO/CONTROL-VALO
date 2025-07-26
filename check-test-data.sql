-- =====================================================
-- SCRIPT DE VERIFICACIÓN DE DATOS DE PRUEBA
-- Sistema de Control de Valorizaciones de Obras
-- =====================================================

-- 1. VERIFICAR CONTEOS DE REGISTROS EN TODAS LAS TABLAS
SELECT 
    'RESUMEN DE DATOS EN TABLAS' as status,
    '=============================' as separator;

SELECT 
    'EMPRESAS' as tabla,
    COUNT(*) as total_registros,
    COUNT(CASE WHEN estado = 'ACTIVO' THEN 1 END) as activas,
    COUNT(CASE WHEN es_consorcio = true THEN 1 END) as consorcios
FROM empresas
UNION ALL
SELECT 
    'OBRAS' as tabla,
    COUNT(*) as total_registros,
    COUNT(CASE WHEN estado = 'EN_PROCESO' THEN 1 END) as en_proceso,
    COUNT(CASE WHEN estado = 'PLANIFICACION' THEN 1 END) as planificacion
FROM obras
UNION ALL
SELECT 
    'OBRAS_EJECUCION' as tabla,
    COUNT(*) as total_registros,
    COUNT(CASE WHEN estado = 'EN_EJECUCION' THEN 1 END) as en_ejecucion,
    COUNT(CASE WHEN estado = 'PROGRAMADA' THEN 1 END) as programadas
FROM obras_ejecucion
UNION ALL
SELECT 
    'OBRAS_SUPERVISION' as tabla,
    COUNT(*) as total_registros,
    COUNT(CASE WHEN estado = 'EN_SUPERVISION' THEN 1 END) as en_supervision,
    COUNT(CASE WHEN estado = 'PROGRAMADA' THEN 1 END) as programadas
FROM obras_supervision;

-- 2. VERIFICAR DATOS EN TABLA EMPRESAS
SELECT 
    '--- DATOS EN EMPRESAS ---' as status,
    '=========================' as separator;

SELECT 
    id,
    ruc,
    razon_social,
    nombre_comercial,
    es_consorcio,
    estado,
    representante_legal
FROM empresas 
ORDER BY id;

-- 3. VERIFICAR DATOS EN TABLA OBRAS
SELECT 
    '--- DATOS EN OBRAS ---' as status,
    '======================' as separator;

SELECT 
    id,
    nombre,
    codigo,
    ubicacion,
    estado,
    created_at::date as fecha_creacion
FROM obras 
ORDER BY id;

-- 4. VERIFICAR DATOS EN OBRAS_EJECUCION CON RELACIONES
SELECT 
    '--- DATOS EN OBRAS_EJECUCION ---' as status,
    '================================' as separator;

SELECT 
    oe.id,
    o.nombre as obra_base,
    oe.numero_contrato,
    e.razon_social as empresa_ejecutora,
    oe.monto_contrato,
    oe.fecha_inicio,
    oe.estado,
    oe.porcentaje_avance
FROM obras_ejecucion oe
LEFT JOIN obras o ON oe.obra_id = o.id
LEFT JOIN empresas e ON oe.empresa_ejecutora_id = e.id
ORDER BY oe.id;

-- 5. VERIFICAR DATOS EN OBRAS_SUPERVISION CON RELACIONES
SELECT 
    '--- DATOS EN OBRAS_SUPERVISION ---' as status,
    '===================================' as separator;

SELECT 
    os.id,
    o.nombre as obra_base,
    os.numero_contrato,
    e.razon_social as empresa_supervisora,
    os.monto_contrato,
    os.fecha_inicio,
    os.estado,
    os.porcentaje_avance
FROM obras_supervision os
LEFT JOIN obras o ON os.obra_id = o.id
LEFT JOIN empresas e ON os.empresa_supervisora_id = e.id
ORDER BY os.id;

-- 6. VERIFICAR RELACIONES Y CONSISTENCIA
SELECT 
    '--- VERIFICACIÓN DE RELACIONES ---' as status,
    '===================================' as separator;

-- Obras que tienen ejecución y supervisión
SELECT 
    'OBRAS_COMPLETAS' as tipo,
    COUNT(*) as cantidad
FROM obras o
WHERE EXISTS (SELECT 1 FROM obras_ejecucion oe WHERE oe.obra_id = o.id)
  AND EXISTS (SELECT 1 FROM obras_supervision os WHERE os.obra_id = o.id)

UNION ALL

-- Obras que solo tienen ejecución
SELECT 
    'OBRAS_SOLO_EJECUCION' as tipo,
    COUNT(*) as cantidad
FROM obras o
WHERE EXISTS (SELECT 1 FROM obras_ejecucion oe WHERE oe.obra_id = o.id)
  AND NOT EXISTS (SELECT 1 FROM obras_supervision os WHERE os.obra_id = o.id)

UNION ALL

-- Obras que solo tienen supervisión
SELECT 
    'OBRAS_SOLO_SUPERVISION' as tipo,
    COUNT(*) as cantidad
FROM obras o
WHERE NOT EXISTS (SELECT 1 FROM obras_ejecucion oe WHERE oe.obra_id = o.id)
  AND EXISTS (SELECT 1 FROM obras_supervision os WHERE os.obra_id = o.id)

UNION ALL

-- Obras sin asignar
SELECT 
    'OBRAS_SIN_ASIGNAR' as tipo,
    COUNT(*) as cantidad
FROM obras o
WHERE NOT EXISTS (SELECT 1 FROM obras_ejecucion oe WHERE oe.obra_id = o.id)
  AND NOT EXISTS (SELECT 1 FROM obras_supervision os WHERE os.obra_id = o.id);

-- 7. VERIFICAR MONTOS Y FECHAS
SELECT 
    '--- VERIFICACIÓN DE MONTOS ---' as status,
    '==============================' as separator;

SELECT 
    'EJECUCION' as tipo,
    COUNT(*) as total_contratos,
    SUM(monto_contrato) as monto_total,
    AVG(monto_contrato) as monto_promedio,
    MIN(fecha_inicio) as fecha_inicio_mas_antigua,
    MAX(fecha_inicio) as fecha_inicio_mas_reciente
FROM obras_ejecucion

UNION ALL

SELECT 
    'SUPERVISION' as tipo,
    COUNT(*) as total_contratos,
    SUM(monto_contrato) as monto_total,
    AVG(monto_contrato) as monto_promedio,
    MIN(fecha_inicio) as fecha_inicio_mas_antigua,
    MAX(fecha_inicio) as fecha_inicio_mas_reciente
FROM obras_supervision;

-- 8. VERIFICAR DATOS PARA EL FRONTEND
SELECT 
    '--- DATOS LISTOS PARA FRONTEND ---' as status,
    '===================================' as separator;

-- Vista completa para el dashboard
SELECT 
    o.id as obra_id,
    o.nombre as obra_nombre,
    o.codigo,
    o.estado as obra_estado,
    
    -- Datos de ejecución
    oe.id as ejecucion_id,
    oe.numero_contrato as contrato_ejecucion,
    e_ejec.razon_social as empresa_ejecutora,
    oe.monto_contrato as monto_ejecucion,
    oe.estado as estado_ejecucion,
    oe.porcentaje_avance as avance_ejecucion,
    
    -- Datos de supervisión  
    os.id as supervision_id,
    os.numero_contrato as contrato_supervision,
    e_super.razon_social as empresa_supervisora,
    os.monto_contrato as monto_supervision,
    os.estado as estado_supervision,
    os.porcentaje_avance as avance_supervision
    
FROM obras o
LEFT JOIN obras_ejecucion oe ON o.id = oe.obra_id
LEFT JOIN empresas e_ejec ON oe.empresa_ejecutora_id = e_ejec.id
LEFT JOIN obras_supervision os ON o.id = os.obra_id
LEFT JOIN empresas e_super ON os.empresa_supervisora_id = e_super.id
ORDER BY o.id;

-- 9. DIAGNÓSTICO FINAL
SELECT 
    '--- DIAGNÓSTICO FINAL ---' as status,
    '=========================' as separator;

WITH diagnostico AS (
    SELECT 
        (SELECT COUNT(*) FROM empresas) as total_empresas,
        (SELECT COUNT(*) FROM obras) as total_obras,
        (SELECT COUNT(*) FROM obras_ejecucion) as total_ejecuciones,
        (SELECT COUNT(*) FROM obras_supervision) as total_supervisiones
)
SELECT 
    CASE 
        WHEN total_empresas = 0 THEN 'ERROR: No hay empresas registradas'
        WHEN total_obras = 0 THEN 'ERROR: No hay obras registradas'  
        WHEN total_ejecuciones = 0 AND total_supervisiones = 0 THEN 'ERROR: No hay contratos de ejecución ni supervisión'
        WHEN total_ejecuciones > 0 AND total_supervisiones > 0 THEN 'SUCCESS: Datos de prueba completos y listos'
        WHEN total_ejecuciones > 0 THEN 'WARNING: Solo hay datos de ejecución, faltan supervisiones'
        WHEN total_supervisiones > 0 THEN 'WARNING: Solo hay datos de supervisión, faltan ejecuciones'
        ELSE 'UNKNOWN: Estado no identificado'
    END as diagnostico,
    total_empresas,
    total_obras,
    total_ejecuciones,
    total_supervisiones
FROM diagnostico;

-- 10. MOSTRAR ESTRUCTURA DE TABLA (útil para debug)
SELECT 
    '--- INFORMACIÓN DE ESQUEMA ---' as status,
    '==============================' as separator;

SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name IN ('empresas', 'obras', 'obras_ejecucion', 'obras_supervision')
ORDER BY table_name, ordinal_position;