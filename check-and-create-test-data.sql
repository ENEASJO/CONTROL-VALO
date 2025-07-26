-- =====================================================
-- SCRIPT COMPLETO: VERIFICAR Y CREAR DATOS DE PRUEBA
-- Sistema de Control de Valorizaciones de Obras
-- =====================================================

-- Este script:
-- 1. Verifica si existen datos de prueba
-- 2. Si no existen, los crea automáticamente
-- 3. Muestra un reporte final del estado

-- PASO 1: VERIFICACIÓN INICIAL
DO $$
DECLARE
    empresas_count INTEGER;
    obras_count INTEGER;
    ejecucion_count INTEGER;
    supervision_count INTEGER;
BEGIN
    -- Contar registros existentes
    SELECT COUNT(*) INTO empresas_count FROM empresas;
    SELECT COUNT(*) INTO obras_count FROM obras;
    SELECT COUNT(*) INTO ejecucion_count FROM obras_ejecucion;
    SELECT COUNT(*) INTO supervision_count FROM obras_supervision;
    
    RAISE NOTICE '=== VERIFICACIÓN INICIAL ===';
    RAISE NOTICE 'Empresas: %', empresas_count;
    RAISE NOTICE 'Obras: %', obras_count;
    RAISE NOTICE 'Contratos Ejecución: %', ejecucion_count;
    RAISE NOTICE 'Contratos Supervisión: %', supervision_count;
    
    -- Determinar si necesitamos insertar datos
    IF empresas_count = 0 OR obras_count = 0 OR (ejecucion_count = 0 AND supervision_count = 0) THEN
        RAISE NOTICE 'DETECTADO: Faltan datos de prueba. Procediendo a insertarlos...';
        
        -- INSERTAR EMPRESAS SI NO EXISTEN
        IF empresas_count = 0 THEN
            INSERT INTO empresas (ruc, razon_social, nombre_comercial, direccion, telefono, email, representante_legal, es_consorcio, estado) VALUES 
                ('20123456789', 'CONSTRUCTORA DEMO S.A.C.', 'CONSTRUCTORA DEMO', 'Av. Construcción 123, Lima', '01-234-5678', 'info@constructorademo.com', 'Juan Pérez García', false, 'ACTIVO'),
                ('20987654321', 'SUPERVISORA INGENIEROS S.A.', 'SUPERVISORA ING', 'Jr. Ingeniería 456, Lima', '01-987-6543', 'contacto@supervisoraing.com', 'María González López', false, 'ACTIVO'),
                ('20555666777', 'CONSORCIO OBRAS PUBLICAS', 'CONSORCIO OP', 'Av. República 789, Lima', '01-555-6677', 'consorcio@obraspublicas.com', 'Carlos Mendoza Silva', true, 'ACTIVO'),
                ('20888999111', 'INGENIERIA AVANZADA S.A.', 'ING AVANZADA', 'Jr. Tecnología 321, Lima', '01-888-9911', 'contacto@ingavanzada.com', 'Ana Torres Ruiz', false, 'ACTIVO'),
                ('20444555666', 'CONSTRUCTORA NORTE S.R.L.', 'CONST NORTE', 'Av. Norte 987, Lima', '01-444-5556', 'admin@constnorte.com', 'Roberto Silva Díaz', false, 'ACTIVO'),
                ('20777888999', 'SUPERVISION ESPECIALIZADA S.A.C.', 'SUP ESPECIALIZADA', 'Jr. Control 654, Lima', '01-777-8889', 'info@supespecializada.com', 'Patricia Morales Vega', false, 'ACTIVO')
            ON CONFLICT (ruc) DO NOTHING;
            RAISE NOTICE 'Empresas insertadas correctamente';
        END IF;
        
        -- INSERTAR OBRAS SI NO EXISTEN
        IF obras_count = 0 THEN
            INSERT INTO obras (nombre, descripcion, codigo, ubicacion, estado) VALUES 
                ('Construcción de Puente Metropolitano', 'Construcción de puente vehicular de 200m de longitud sobre río principal', 'OBRA-2024-001', 'Av. Principal - Distrito Central', 'EN_PROCESO'),
                ('Mejoramiento de Carretera Central', 'Mejoramiento y asfaltado de 15km de carretera con señalización', 'OBRA-2024-002', 'Carretera Central Km 25-40', 'EN_PROCESO'),
                ('Ampliación de Hospital Nacional', 'Construcción de nueva ala de emergencias y UCI', 'OBRA-2024-003', 'Hospital Nacional - Lima', 'PLANIFICACION'),
                ('Construcción de Centro Educativo', 'Nuevo colegio de 3 niveles para 600 alumnos', 'OBRA-2024-004', 'Distrito San Juan - Lima', 'PLANIFICACION'),
                ('Remodelación de Plaza Principal', 'Remodelación integral de plaza cívica con áreas verdes', 'OBRA-2024-005', 'Plaza de Armas - Centro Histórico', 'EN_PROCESO'),
                ('Construcción de Centro de Salud', 'Centro de salud comunitario con 20 consultorios', 'OBRA-2024-006', 'Distrito Los Olivos - Lima', 'PLANIFICACION'),
                ('Mejoramiento de Parque Zonal', 'Mejoramiento de infraestructura deportiva y recreativa', 'OBRA-2024-007', 'Parque Zonal Sur - Lima', 'EN_PROCESO'),
                ('Construcción de Biblioteca Municipal', 'Biblioteca de 4 niveles con salas de estudio', 'OBRA-2024-008', 'Centro de la ciudad - Lima', 'PLANIFICACION')
            ON CONFLICT (nombre) DO NOTHING;
            RAISE NOTICE 'Obras insertadas correctamente';
        END IF;
        
    ELSE
        RAISE NOTICE 'DETECTADO: Ya existen datos de prueba en el sistema';
    END IF;
END $$;

-- PASO 2: INSERTAR CONTRATOS DE EJECUCIÓN Y SUPERVISIÓN
DO $$
DECLARE
    ejecucion_actual INTEGER;
    supervision_actual INTEGER;
    obra_puente_id BIGINT;
    obra_carretera_id BIGINT;
    obra_hospital_id BIGINT;
    obra_colegio_id BIGINT;
    obra_plaza_id BIGINT;
    obra_centro_salud_id BIGINT;
    obra_parque_id BIGINT;
    obra_biblioteca_id BIGINT;
    empresa_constructora_id BIGINT;
    empresa_supervisora_id BIGINT;
    empresa_consorcio_id BIGINT;
    empresa_ing_avanzada_id BIGINT;
    empresa_const_norte_id BIGINT;
    empresa_sup_especializada_id BIGINT;
BEGIN
    -- Verificar contratos existentes
    SELECT COUNT(*) INTO ejecucion_actual FROM obras_ejecucion;
    SELECT COUNT(*) INTO supervision_actual FROM obras_supervision;
    
    -- Solo insertar si no hay contratos
    IF ejecucion_actual = 0 OR supervision_actual = 0 THEN
        -- Obtener IDs necesarios
        SELECT id INTO obra_puente_id FROM obras WHERE codigo = 'OBRA-2024-001';
        SELECT id INTO obra_carretera_id FROM obras WHERE codigo = 'OBRA-2024-002';
        SELECT id INTO obra_hospital_id FROM obras WHERE codigo = 'OBRA-2024-003';
        SELECT id INTO obra_colegio_id FROM obras WHERE codigo = 'OBRA-2024-004';
        SELECT id INTO obra_plaza_id FROM obras WHERE codigo = 'OBRA-2024-005';
        SELECT id INTO obra_centro_salud_id FROM obras WHERE codigo = 'OBRA-2024-006';
        SELECT id INTO obra_parque_id FROM obras WHERE codigo = 'OBRA-2024-007';
        SELECT id INTO obra_biblioteca_id FROM obras WHERE codigo = 'OBRA-2024-008';
        
        SELECT id INTO empresa_constructora_id FROM empresas WHERE ruc = '20123456789';
        SELECT id INTO empresa_supervisora_id FROM empresas WHERE ruc = '20987654321';
        SELECT id INTO empresa_consorcio_id FROM empresas WHERE ruc = '20555666777';
        SELECT id INTO empresa_ing_avanzada_id FROM empresas WHERE ruc = '20888999111';
        SELECT id INTO empresa_const_norte_id FROM empresas WHERE ruc = '20444555666';
        SELECT id INTO empresa_sup_especializada_id FROM empresas WHERE ruc = '20777888999';
        
        -- Insertar contratos de ejecución si no existen
        IF ejecucion_actual = 0 THEN
            INSERT INTO obras_ejecucion (
                obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado, 
                fecha_inicio, fecha_fin, plazo_ejecucion, empresa_ejecutora_id, descripcion, 
                ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
            ) VALUES 
                (obra_puente_id, 'Construcción de Puente Metropolitano', 'CONT-EJE-2024-001', 'EXP-2024-001', '2024-01', 
                 '2024-01-15', '2025-01-15', 365, empresa_constructora_id, 'Construcción de puente vehicular de 200m de longitud', 
                 'Av. Principal - Distrito Central', 2500000.00, 875000.00, 35.00, 'EN_EJECUCION', 'Proyecto avanzando según cronograma'),
                
                (obra_carretera_id, 'Mejoramiento de Carretera Central', 'CONT-EJE-2024-002', 'EXP-2024-002', '2024-02', 
                 '2024-02-01', '2024-07-30', 180, empresa_consorcio_id, 'Mejoramiento y asfaltado de 15km de carretera', 
                 'Carretera Central Km 25-40', 1800000.00, 1080000.00, 60.00, 'EN_EJECUCION', 'Obra en etapa de asfaltado'),
                
                (obra_plaza_id, 'Remodelación de Plaza Principal', 'CONT-EJE-2024-005', 'EXP-2024-005', '2024-03', 
                 '2024-03-01', '2024-08-30', 180, empresa_const_norte_id, 'Remodelación integral de plaza cívica', 
                 'Plaza de Armas - Centro Histórico', 450000.00, 225000.00, 50.00, 'EN_EJECUCION', 'Avance según lo programado'),
                
                (obra_parque_id, 'Mejoramiento de Parque Zonal', 'CONT-EJE-2024-007', 'EXP-2024-007', '2024-04', 
                 '2024-04-01', '2024-10-30', 210, empresa_ing_avanzada_id, 'Mejoramiento de infraestructura deportiva', 
                 'Parque Zonal Sur - Lima', 320000.00, 64000.00, 20.00, 'EN_EJECUCION', 'Inicio de trabajos de infraestructura'),
                
                (obra_hospital_id, 'Ampliación de Hospital Nacional', 'CONT-EJE-2024-003', 'EXP-2024-003', '2024-05', 
                 '2024-05-15', '2025-05-15', 365, empresa_consorcio_id, 'Construcción de nueva ala de emergencias', 
                 'Hospital Nacional - Lima', 3200000.00, 0.00, 0.00, 'PROGRAMADA', 'Esperando entrega de terreno'),
                
                (obra_colegio_id, 'Construcción de Centro Educativo', 'CONT-EJE-2024-004', 'EXP-2024-004', '2024-06', 
                 '2024-06-01', '2025-03-31', 300, empresa_constructora_id, 'Nuevo colegio de 3 niveles', 
                 'Distrito San Juan - Lima', 1200000.00, 0.00, 0.00, 'PROGRAMADA', 'Pendiente de inicio')
            ON CONFLICT (numero_contrato) DO NOTHING;
            RAISE NOTICE 'Contratos de ejecución insertados correctamente';
        END IF;
        
        -- Insertar contratos de supervisión si no existen
        IF supervision_actual = 0 THEN
            INSERT INTO obras_supervision (
                obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado, 
                fecha_inicio, fecha_fin, plazo_ejecucion, empresa_supervisora_id, descripcion, 
                ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
            ) VALUES 
                (obra_puente_id, 'Supervisión Puente Metropolitano', 'CONT-SUP-2024-001', 'EXP-SUP-2024-001', '2024-01', 
                 '2024-01-15', '2025-01-15', 365, empresa_supervisora_id, 'Supervisión de construcción de puente vehicular', 
                 'Av. Principal - Distrito Central', 125000.00, 43750.00, 35.00, 'EN_SUPERVISION', 'Supervisión activa del proyecto'),
                
                (obra_carretera_id, 'Supervisión Carretera Central', 'CONT-SUP-2024-002', 'EXP-SUP-2024-002', '2024-02', 
                 '2024-02-01', '2024-07-30', 180, empresa_supervisora_id, 'Supervisión de mejoramiento de carretera', 
                 'Carretera Central Km 25-40', 90000.00, 54000.00, 60.00, 'EN_SUPERVISION', 'Control de calidad continuo'),
                
                (obra_plaza_id, 'Supervisión Plaza Principal', 'CONT-SUP-2024-005', 'EXP-SUP-2024-005', '2024-03', 
                 '2024-03-01', '2024-08-30', 180, empresa_sup_especializada_id, 'Supervisión de remodelación de plaza', 
                 'Plaza de Armas - Centro Histórico', 22500.00, 11250.00, 50.00, 'EN_SUPERVISION', 'Seguimiento de especificaciones'),
                
                (obra_parque_id, 'Supervisión Parque Zonal', 'CONT-SUP-2024-007', 'EXP-SUP-2024-007', '2024-04', 
                 '2024-04-01', '2024-10-30', 210, empresa_sup_especializada_id, 'Supervisión de mejoramiento deportivo', 
                 'Parque Zonal Sur - Lima', 16000.00, 3200.00, 20.00, 'EN_SUPERVISION', 'Verificación de normas deportivas'),
                
                (obra_hospital_id, 'Supervisión Hospital Nacional', 'CONT-SUP-2024-003', 'EXP-SUP-2024-003', '2024-05', 
                 '2024-05-15', '2025-05-15', 365, empresa_supervisora_id, 'Supervisión de ampliación hospitalaria', 
                 'Hospital Nacional - Lima', 160000.00, 0.00, 0.00, 'PROGRAMADA', 'Esperando inicio de obra'),
                
                (obra_centro_salud_id, 'Supervisión Centro de Salud', 'CONT-SUP-2024-006', 'EXP-SUP-2024-006', '2024-07', 
                 '2024-07-01', '2025-01-31', 210, empresa_sup_especializada_id, 'Supervisión de centro de salud comunitario', 
                 'Distrito Los Olivos - Lima', 35000.00, 0.00, 0.00, 'PROGRAMADA', 'Pendiente de asignación de ejecutor'),
                
                (obra_biblioteca_id, 'Supervisión Biblioteca Municipal', 'CONT-SUP-2024-008', 'EXP-SUP-2024-008', '2024-08', 
                 '2024-08-01', '2025-02-28', 210, empresa_supervisora_id, 'Supervisión de biblioteca municipal', 
                 'Centro de la ciudad - Lima', 42000.00, 0.00, 0.00, 'PROGRAMADA', 'En proceso de licitación de ejecutor')
            ON CONFLICT (numero_contrato) DO NOTHING;
            RAISE NOTICE 'Contratos de supervisión insertados correctamente';
        END IF;
        
    ELSE
        RAISE NOTICE 'Ya existen contratos en el sistema';
    END IF;
END $$;

-- PASO 3: MOSTRAR REPORTE FINAL DETALLADO
SELECT 
    '=====================================' as separador,
    'REPORTE FINAL DE DATOS DE PRUEBA' as titulo,
    '=====================================' as separador2;

-- Conteos generales
SELECT 
    'TABLA' as tipo,
    'REGISTROS' as cantidad,
    'ESTADO' as observacion;

SELECT 
    'EMPRESAS' as tipo,
    COUNT(*)::text as cantidad,
    CASE 
        WHEN COUNT(*) = 0 THEN 'ERROR: Sin datos'
        WHEN COUNT(*) < 4 THEN 'WARNING: Pocos datos'
        ELSE 'OK: Datos suficientes'
    END as observacion
FROM empresas

UNION ALL

SELECT 
    'OBRAS' as tipo,
    COUNT(*)::text as cantidad,
    CASE 
        WHEN COUNT(*) = 0 THEN 'ERROR: Sin datos'
        WHEN COUNT(*) < 5 THEN 'WARNING: Pocos datos'
        ELSE 'OK: Datos suficientes'
    END as observacion
FROM obras

UNION ALL

SELECT 
    'EJECUCION' as tipo,
    COUNT(*)::text as cantidad,
    CASE 
        WHEN COUNT(*) = 0 THEN 'ERROR: Sin contratos'
        WHEN COUNT(*) < 3 THEN 'WARNING: Pocos contratos'
        ELSE 'OK: Contratos disponibles'
    END as observacion
FROM obras_ejecucion

UNION ALL

SELECT 
    'SUPERVISION' as tipo,
    COUNT(*)::text as cantidad,
    CASE 
        WHEN COUNT(*) = 0 THEN 'ERROR: Sin contratos'
        WHEN COUNT(*) < 3 THEN 'WARNING: Pocos contratos'
        ELSE 'OK: Contratos disponibles'
    END as observacion
FROM obras_supervision;

-- Vista resumida para el frontend
SELECT 
    '--- DATOS LISTOS PARA FRONTEND ---' as titulo;

SELECT 
    o.id as obra_id,
    o.nombre as obra_nombre,
    o.codigo,
    o.estado as obra_estado,
    oe.numero_contrato as contrato_ejecucion,
    e_ejec.nombre_comercial as empresa_ejecutora,
    oe.porcentaje_avance as avance_ejecucion,
    os.numero_contrato as contrato_supervision,
    e_super.nombre_comercial as empresa_supervisora,
    os.porcentaje_avance as avance_supervision
FROM obras o
LEFT JOIN obras_ejecucion oe ON o.id = oe.obra_id
LEFT JOIN empresas e_ejec ON oe.empresa_ejecutora_id = e_ejec.id
LEFT JOIN obras_supervision os ON o.id = os.obra_id
LEFT JOIN empresas e_super ON os.empresa_supervisora_id = e_super.id
ORDER BY o.id;

-- Estadísticas finales
SELECT 
    '--- ESTADÍSTICAS FINALES ---' as titulo;

WITH stats AS (
    SELECT 
        COUNT(DISTINCT o.id) as total_obras,
        COUNT(DISTINCT oe.obra_id) as obras_con_ejecucion,
        COUNT(DISTINCT os.obra_id) as obras_con_supervision,
        COUNT(DISTINCT CASE WHEN oe.obra_id IS NOT NULL AND os.obra_id IS NOT NULL THEN o.id END) as obras_completas,
        SUM(oe.monto_contrato) as monto_total_ejecucion,
        SUM(os.monto_contrato) as monto_total_supervision
    FROM obras o
    LEFT JOIN obras_ejecucion oe ON o.id = oe.obra_id
    LEFT JOIN obras_supervision os ON o.id = os.obra_id
)
SELECT 
    'Total de obras: ' || total_obras as estadistica
FROM stats
UNION ALL
SELECT 
    'Obras con ejecución: ' || obras_con_ejecucion as estadistica
FROM stats
UNION ALL
SELECT 
    'Obras con supervisión: ' || obras_con_supervision as estadistica
FROM stats
UNION ALL
SELECT 
    'Obras completas: ' || obras_completas as estadistica
FROM stats
UNION ALL
SELECT 
    'Monto total ejecución: S/ ' || COALESCE(monto_total_ejecucion, 0) as estadistica
FROM stats
UNION ALL
SELECT 
    'Monto total supervisión: S/ ' || COALESCE(monto_total_supervision, 0) as estadistica
FROM stats;

-- Mensaje final
SELECT 
    '✓ DATOS DE PRUEBA VERIFICADOS Y LISTOS' as mensaje_final,
    'El frontend ahora debería mostrar datos correctamente' as instruccion;