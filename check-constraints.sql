-- CONSULTAR CONSTRAINTS Y VALORES PERMITIDOS

-- 1. Ver constraints de la tabla obras_ejecucion
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'obras_ejecucion' 
    AND tc.constraint_type = 'CHECK';

-- 2. Ver constraints de la tabla obras_supervision
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'obras_supervision' 
    AND tc.constraint_type = 'CHECK';

-- 3. Ver estructura de columnas para ver tipos ENUM o CHECK
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('obras_ejecucion', 'obras_supervision')
    AND column_name = 'estado'
ORDER BY table_name, ordinal_position;

-- 4. Intentar ver datos existentes para entender valores válidos
SELECT DISTINCT estado FROM obras_ejecucion;
SELECT DISTINCT estado FROM obras_supervision;

-- 5. Ver algunos registros existentes para referencia
SELECT estado, COUNT(*) as cantidad 
FROM obras_ejecucion 
GROUP BY estado;

SELECT estado, COUNT(*) as cantidad 
FROM obras_supervision 
GROUP BY estado;