-- =====================================================
-- SCRIPT DE DIAGNÓSTICO RÁPIDO
-- Sistema de Control de Valorizaciones de Obras
-- DIAGNÓSTICO DEL PROBLEMA: obra_id no existe
-- =====================================================

-- EJECUTAR ESTE SCRIPT PRIMERO para entender el problema exacto

SELECT 'INICIANDO DIAGNÓSTICO DEL PROBLEMA obra_id' as status;

-- 1. VERIFICAR EXISTENCIA DE TABLAS
SELECT 
    'TABLA: ' || table_name || ' - EXISTS' as estado
FROM information_schema.tables 
WHERE table_name IN ('empresas', 'obras', 'obras_ejecucion', 'obras_supervision')
ORDER BY table_name;

-- 2. VERIFICAR TODAS LAS COLUMNAS DE obras_ejecucion
SELECT 
    'obras_ejecucion - COLUMNA: ' || column_name || ' (' || data_type || ')' as columnas_actuales
FROM information_schema.columns 
WHERE table_name = 'obras_ejecucion'
ORDER BY ordinal_position;

-- 3. VERIFICAR TODAS LAS COLUMNAS DE obras_supervision
SELECT 
    'obras_supervision - COLUMNA: ' || column_name || ' (' || data_type || ')' as columnas_actuales
FROM information_schema.columns 
WHERE table_name = 'obras_supervision'
ORDER BY ordinal_position;

-- 4. VERIFICAR CONSTRAINTS Y FOREIGN KEYS
SELECT 
    'CONSTRAINT: ' || constraint_name || ' - TABLA: ' || table_name || ' - TIPO: ' || constraint_type as constraints_actuales
FROM information_schema.table_constraints 
WHERE table_name IN ('obras_ejecucion', 'obras_supervision')
ORDER BY table_name, constraint_name;

-- 5. VERIFICAR FOREIGN KEYS ESPECÍFICAS
SELECT 
    'FK: ' || tc.constraint_name || ' - ' || tc.table_name || '.' || kcu.column_name || 
    ' -> ' || ccu.table_name || '.' || ccu.column_name as foreign_keys_actuales
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('obras_ejecucion', 'obras_supervision');

-- 6. VERIFICAR EXISTENCIA ESPECÍFICA DE obra_id
DO $$
BEGIN
    -- Verificar obras_ejecucion.obra_id
    IF EXISTS (SELECT FROM information_schema.columns 
               WHERE table_name = 'obras_ejecucion' AND column_name = 'obra_id') THEN
        RAISE NOTICE 'COLUMNA obras_ejecucion.obra_id: ✅ EXISTS';
    ELSE
        RAISE NOTICE 'COLUMNA obras_ejecucion.obra_id: ❌ NO EXISTS - PROBLEMA CONFIRMADO';
    END IF;
    
    -- Verificar obras_supervision.obra_id
    IF EXISTS (SELECT FROM information_schema.columns 
               WHERE table_name = 'obras_supervision' AND column_name = 'obra_id') THEN
        RAISE NOTICE 'COLUMNA obras_supervision.obra_id: ✅ EXISTS';
    ELSE
        RAISE NOTICE 'COLUMNA obras_supervision.obra_id: ❌ NO EXISTS - PROBLEMA CONFIRMADO';
    END IF;
END $$;

-- 7. CONTAR REGISTROS ACTUALES
SELECT 
    'TABLA: empresas - REGISTROS: ' || COUNT(*) as conteo_actual
FROM empresas
UNION ALL
SELECT 
    'TABLA: obras - REGISTROS: ' || COUNT(*) as conteo_actual
FROM obras
UNION ALL
SELECT 
    'TABLA: obras_ejecucion - REGISTROS: ' || COUNT(*) as conteo_actual
FROM obras_ejecucion
UNION ALL
SELECT 
    'TABLA: obras_supervision - REGISTROS: ' || COUNT(*) as conteo_actual
FROM obras_supervision;

-- 8. VERIFICAR ESTRUCTURA ESPERADA vs ACTUAL
WITH expected_columns AS (
    SELECT 'obras_ejecucion' as table_name, 'obra_id' as column_name, 'bigint' as expected_type
    UNION ALL
    SELECT 'obras_supervision', 'obra_id', 'bigint'
),
actual_columns AS (
    SELECT table_name, column_name, data_type as actual_type
    FROM information_schema.columns 
    WHERE table_name IN ('obras_ejecucion', 'obras_supervision')
)
SELECT 
    CASE 
        WHEN ac.column_name IS NULL THEN 
            '❌ FALTA: ' || ec.table_name || '.' || ec.column_name || ' (' || ec.expected_type || ')'
        WHEN ac.actual_type != ec.expected_type THEN 
            '⚠️  TIPO INCORRECTO: ' || ec.table_name || '.' || ec.column_name || ' - Esperado: ' || ec.expected_type || ', Actual: ' || ac.actual_type
        ELSE 
            '✅ OK: ' || ec.table_name || '.' || ec.column_name || ' (' || ac.actual_type || ')'
    END as verificacion_estructura
FROM expected_columns ec
LEFT JOIN actual_columns ac ON ec.table_name = ac.table_name AND ec.column_name = ac.column_name
ORDER BY ec.table_name, ec.column_name;

SELECT 'DIAGNÓSTICO COMPLETADO' as status;
SELECT 'Si ves ❌ FALTA obra_id, ejecuta el script fix-obra-id-column.sql' as siguiente_paso;