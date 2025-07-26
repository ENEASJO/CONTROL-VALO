-- =====================================================
-- SCRIPT CORREGIDO: VERIFICAR Y CREAR DATOS DE PRUEBA
-- Sistema de Control de Valorizaciones de Obras
-- =====================================================
--
-- CORRIGE EL ERROR: column oe.porcentaje_avance does not exist
--
-- Este script:
-- 1. Detecta automáticamente qué columnas existen
-- 2. Adapta los INSERTs según la estructura actual
-- 3. Verifica si existen datos de prueba
-- 4. Si no existen, los crea automáticamente
-- 5. Muestra un reporte final del estado
-- =====================================================

-- PASO 0: VERIFICACIÓN DE ESTRUCTURA DE TABLAS
DO $$
DECLARE
    has_oe_porcentaje BOOLEAN;
    has_oe_monto_ejecutado BOOLEAN;
    has_oe_observaciones BOOLEAN;
    has_oe_fecha_fin BOOLEAN;
    has_os_porcentaje BOOLEAN;
    has_os_monto_ejecutado BOOLEAN;
    has_os_observaciones BOOLEAN;
    has_os_fecha_fin BOOLEAN;
BEGIN
    RAISE NOTICE '=== VERIFICACIÓN DE ESTRUCTURA DE TABLAS ===';
    
    -- Verificar columnas en obras_ejecucion
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_ejecucion' AND column_name = 'porcentaje_avance'
    ) INTO has_oe_porcentaje;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_ejecucion' AND column_name = 'monto_ejecutado'
    ) INTO has_oe_monto_ejecutado;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_ejecucion' AND column_name = 'observaciones'
    ) INTO has_oe_observaciones;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_ejecucion' AND column_name = 'fecha_fin'
    ) INTO has_oe_fecha_fin;
    
    -- Verificar columnas en obras_supervision
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_supervision' AND column_name = 'porcentaje_avance'
    ) INTO has_os_porcentaje;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_supervision' AND column_name = 'monto_ejecutado'
    ) INTO has_os_monto_ejecutado;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_supervision' AND column_name = 'observaciones'
    ) INTO has_os_observaciones;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_supervision' AND column_name = 'fecha_fin'
    ) INTO has_os_fecha_fin;
    
    -- Reportar estructura
    RAISE NOTICE 'obras_ejecucion: porcentaje_avance=%, monto_ejecutado=%, observaciones=%, fecha_fin=%', 
        has_oe_porcentaje, has_oe_monto_ejecutado, has_oe_observaciones, has_oe_fecha_fin;
    RAISE NOTICE 'obras_supervision: porcentaje_avance=%, monto_ejecutado=%, observaciones=%, fecha_fin=%', 
        has_os_porcentaje, has_os_monto_ejecutado, has_os_observaciones, has_os_fecha_fin;
        
    -- Verificar si faltan columnas críticas
    IF NOT has_oe_porcentaje OR NOT has_os_porcentaje THEN
        RAISE NOTICE '❌ ADVERTENCIA: Faltan columnas porcentaje_avance';
        RAISE NOTICE '💡 SOLUCIÓN: Ejecutar primero add-missing-columns.sql';
    END IF;
    
    IF NOT has_oe_monto_ejecutado OR NOT has_os_monto_ejecutado THEN
        RAISE NOTICE '❌ ADVERTENCIA: Faltan columnas monto_ejecutado';
        RAISE NOTICE '💡 SOLUCIÓN: Ejecutar primero add-missing-columns.sql';
    END IF;
END $$;

-- PASO 1: VERIFICACIÓN INICIAL DE DATOS
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
    
    RAISE NOTICE '=== VERIFICACIÓN INICIAL DE DATOS ===';
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

-- PASO 2: INSERTAR CONTRATOS ADAPTATIVO SEGÚN ESTRUCTURA
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
    -- Flags para columnas disponibles
    has_oe_porcentaje BOOLEAN;
    has_oe_monto_ejecutado BOOLEAN;
    has_oe_observaciones BOOLEAN;
    has_oe_fecha_fin BOOLEAN;
    has_os_porcentaje BOOLEAN;
    has_os_monto_ejecutado BOOLEAN;
    has_os_observaciones BOOLEAN;
    has_os_fecha_fin BOOLEAN;
BEGIN
    -- Verificar contratos existentes
    SELECT COUNT(*) INTO ejecucion_actual FROM obras_ejecucion;
    SELECT COUNT(*) INTO supervision_actual FROM obras_supervision;
    
    -- Verificar columnas disponibles
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'obras_ejecucion' AND column_name = 'porcentaje_avance') INTO has_oe_porcentaje;
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'obras_ejecucion' AND column_name = 'monto_ejecutado') INTO has_oe_monto_ejecutado;
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'obras_ejecucion' AND column_name = 'observaciones') INTO has_oe_observaciones;
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'obras_ejecucion' AND column_name = 'fecha_fin') INTO has_oe_fecha_fin;
    
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'obras_supervision' AND column_name = 'porcentaje_avance') INTO has_os_porcentaje;
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'obras_supervision' AND column_name = 'monto_ejecutado') INTO has_os_monto_ejecutado;
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'obras_supervision' AND column_name = 'observaciones') INTO has_os_observaciones;
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'obras_supervision' AND column_name = 'fecha_fin') INTO has_os_fecha_fin;
    
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
        
        -- Insertar contratos de ejecución usando INSERT dinámico
        IF ejecucion_actual = 0 THEN
            -- INSERT básico (columnas que siempre deberían existir)
            INSERT INTO obras_ejecucion (
                obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado, 
                fecha_inicio, plazo_ejecucion, empresa_ejecutora_id, descripcion, 
                ubicacion, monto_contrato, estado
            ) VALUES 
                (obra_puente_id, 'Construcción de Puente Metropolitano', 'CONT-EJE-2024-001', 'EXP-2024-001', '2024-01', 
                 '2024-01-15', 365, empresa_constructora_id, 'Construcción de puente vehicular de 200m de longitud', 
                 'Av. Principal - Distrito Central', 2500000.00, 'EN_EJECUCION'),
                
                (obra_carretera_id, 'Mejoramiento de Carretera Central', 'CONT-EJE-2024-002', 'EXP-2024-002', '2024-02', 
                 '2024-02-01', 180, empresa_consorcio_id, 'Mejoramiento y asfaltado de 15km de carretera', 
                 'Carretera Central Km 25-40', 1800000.00, 'EN_EJECUCION'),
                
                (obra_plaza_id, 'Remodelación de Plaza Principal', 'CONT-EJE-2024-005', 'EXP-2024-005', '2024-03', 
                 '2024-03-01', 180, empresa_const_norte_id, 'Remodelación integral de plaza cívica', 
                 'Plaza de Armas - Centro Histórico', 450000.00, 'EN_EJECUCION'),
                
                (obra_parque_id, 'Mejoramiento de Parque Zonal', 'CONT-EJE-2024-007', 'EXP-2024-007', '2024-04', 
                 '2024-04-01', 210, empresa_ing_avanzada_id, 'Mejoramiento de infraestructura deportiva', 
                 'Parque Zonal Sur - Lima', 320000.00, 'EN_EJECUCION'),
                
                (obra_hospital_id, 'Ampliación de Hospital Nacional', 'CONT-EJE-2024-003', 'EXP-2024-003', '2024-05', 
                 '2024-05-15', 365, empresa_consorcio_id, 'Construcción de nueva ala de emergencias', 
                 'Hospital Nacional - Lima', 3200000.00, 'PROGRAMADA'),
                
                (obra_colegio_id, 'Construcción de Centro Educativo', 'CONT-EJE-2024-004', 'EXP-2024-004', '2024-06', 
                 '2024-06-01', 300, empresa_constructora_id, 'Nuevo colegio de 3 niveles', 
                 'Distrito San Juan - Lima', 1200000.00, 'PROGRAMADA')
            ON CONFLICT (numero_contrato) DO NOTHING;
            
            -- Actualizar columnas adicionales si existen
            IF has_oe_fecha_fin THEN
                UPDATE obras_ejecucion SET fecha_fin = '2025-01-15' WHERE numero_contrato = 'CONT-EJE-2024-001';
                UPDATE obras_ejecucion SET fecha_fin = '2024-07-30' WHERE numero_contrato = 'CONT-EJE-2024-002';
                UPDATE obras_ejecucion SET fecha_fin = '2024-08-30' WHERE numero_contrato = 'CONT-EJE-2024-005';
                UPDATE obras_ejecucion SET fecha_fin = '2024-10-30' WHERE numero_contrato = 'CONT-EJE-2024-007';
                UPDATE obras_ejecucion SET fecha_fin = '2025-05-15' WHERE numero_contrato = 'CONT-EJE-2024-003';
                UPDATE obras_ejecucion SET fecha_fin = '2025-03-31' WHERE numero_contrato = 'CONT-EJE-2024-004';
            END IF;
            
            IF has_oe_monto_ejecutado THEN
                UPDATE obras_ejecucion SET monto_ejecutado = 875000.00 WHERE numero_contrato = 'CONT-EJE-2024-001';
                UPDATE obras_ejecucion SET monto_ejecutado = 1080000.00 WHERE numero_contrato = 'CONT-EJE-2024-002';
                UPDATE obras_ejecucion SET monto_ejecutado = 225000.00 WHERE numero_contrato = 'CONT-EJE-2024-005';
                UPDATE obras_ejecucion SET monto_ejecutado = 64000.00 WHERE numero_contrato = 'CONT-EJE-2024-007';
            END IF;
            
            IF has_oe_porcentaje THEN
                UPDATE obras_ejecucion SET porcentaje_avance = 35.00 WHERE numero_contrato = 'CONT-EJE-2024-001';
                UPDATE obras_ejecucion SET porcentaje_avance = 60.00 WHERE numero_contrato = 'CONT-EJE-2024-002';
                UPDATE obras_ejecucion SET porcentaje_avance = 50.00 WHERE numero_contrato = 'CONT-EJE-2024-005';
                UPDATE obras_ejecucion SET porcentaje_avance = 20.00 WHERE numero_contrato = 'CONT-EJE-2024-007';
            END IF;
            
            IF has_oe_observaciones THEN
                UPDATE obras_ejecucion SET observaciones = 'Proyecto avanzando según cronograma' WHERE numero_contrato = 'CONT-EJE-2024-001';
                UPDATE obras_ejecucion SET observaciones = 'Obra en etapa de asfaltado' WHERE numero_contrato = 'CONT-EJE-2024-002';
                UPDATE obras_ejecucion SET observaciones = 'Avance según lo programado' WHERE numero_contrato = 'CONT-EJE-2024-005';
                UPDATE obras_ejecucion SET observaciones = 'Inicio de trabajos de infraestructura' WHERE numero_contrato = 'CONT-EJE-2024-007';
                UPDATE obras_ejecucion SET observaciones = 'Esperando entrega de terreno' WHERE numero_contrato = 'CONT-EJE-2024-003';
                UPDATE obras_ejecucion SET observaciones = 'Pendiente de inicio' WHERE numero_contrato = 'CONT-EJE-2024-004';
            END IF;
            
            RAISE NOTICE 'Contratos de ejecución insertados correctamente (adaptativo)';
        END IF;
        
        -- Similar para contratos de supervisión
        IF supervision_actual = 0 THEN
            INSERT INTO obras_supervision (
                obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado, 
                fecha_inicio, plazo_ejecucion, empresa_supervisora_id, descripcion, 
                ubicacion, monto_contrato, estado
            ) VALUES 
                (obra_puente_id, 'Supervisión Puente Metropolitano', 'CONT-SUP-2024-001', 'EXP-SUP-2024-001', '2024-01', 
                 '2024-01-15', 365, empresa_supervisora_id, 'Supervisión de construcción de puente vehicular', 
                 'Av. Principal - Distrito Central', 125000.00, 'EN_SUPERVISION'),
                
                (obra_carretera_id, 'Supervisión Carretera Central', 'CONT-SUP-2024-002', 'EXP-SUP-2024-002', '2024-02', 
                 '2024-02-01', 180, empresa_supervisora_id, 'Supervisión de mejoramiento de carretera', 
                 'Carretera Central Km 25-40', 90000.00, 'EN_SUPERVISION'),
                
                (obra_plaza_id, 'Supervisión Plaza Principal', 'CONT-SUP-2024-005', 'EXP-SUP-2024-005', '2024-03', 
                 '2024-03-01', 180, empresa_sup_especializada_id, 'Supervisión de remodelación de plaza', 
                 'Plaza de Armas - Centro Histórico', 22500.00, 'EN_SUPERVISION'),
                
                (obra_parque_id, 'Supervisión Parque Zonal', 'CONT-SUP-2024-007', 'EXP-SUP-2024-007', '2024-04', 
                 '2024-04-01', 210, empresa_sup_especializada_id, 'Supervisión de mejoramiento deportivo', 
                 'Parque Zonal Sur - Lima', 16000.00, 'EN_SUPERVISION'),
                
                (obra_hospital_id, 'Supervisión Hospital Nacional', 'CONT-SUP-2024-003', 'EXP-SUP-2024-003', '2024-05', 
                 '2024-05-15', 365, empresa_supervisora_id, 'Supervisión de ampliación hospitalaria', 
                 'Hospital Nacional - Lima', 160000.00, 'PROGRAMADA'),
                
                (obra_centro_salud_id, 'Supervisión Centro de Salud', 'CONT-SUP-2024-006', 'EXP-SUP-2024-006', '2024-07', 
                 '2024-07-01', 210, empresa_sup_especializada_id, 'Supervisión de centro de salud comunitario', 
                 'Distrito Los Olivos - Lima', 35000.00, 'PROGRAMADA'),
                
                (obra_biblioteca_id, 'Supervisión Biblioteca Municipal', 'CONT-SUP-2024-008', 'EXP-SUP-2024-008', '2024-08', 
                 '2024-08-01', 210, empresa_supervisora_id, 'Supervisión de biblioteca municipal', 
                 'Centro de la ciudad - Lima', 42000.00, 'PROGRAMADA')
            ON CONFLICT (numero_contrato) DO NOTHING;
            
            -- Actualizar columnas adicionales para supervisión
            IF has_os_fecha_fin THEN
                UPDATE obras_supervision SET fecha_fin = '2025-01-15' WHERE numero_contrato = 'CONT-SUP-2024-001';
                UPDATE obras_supervision SET fecha_fin = '2024-07-30' WHERE numero_contrato = 'CONT-SUP-2024-002';
                UPDATE obras_supervision SET fecha_fin = '2024-08-30' WHERE numero_contrato = 'CONT-SUP-2024-005';
                UPDATE obras_supervision SET fecha_fin = '2024-10-30' WHERE numero_contrato = 'CONT-SUP-2024-007';
                UPDATE obras_supervision SET fecha_fin = '2025-05-15' WHERE numero_contrato = 'CONT-SUP-2024-003';
                UPDATE obras_supervision SET fecha_fin = '2025-01-31' WHERE numero_contrato = 'CONT-SUP-2024-006';
                UPDATE obras_supervision SET fecha_fin = '2025-02-28' WHERE numero_contrato = 'CONT-SUP-2024-008';
            END IF;
            
            IF has_os_monto_ejecutado THEN
                UPDATE obras_supervision SET monto_ejecutado = 43750.00 WHERE numero_contrato = 'CONT-SUP-2024-001';
                UPDATE obras_supervision SET monto_ejecutado = 54000.00 WHERE numero_contrato = 'CONT-SUP-2024-002';
                UPDATE obras_supervision SET monto_ejecutado = 11250.00 WHERE numero_contrato = 'CONT-SUP-2024-005';
                UPDATE obras_supervision SET monto_ejecutado = 3200.00 WHERE numero_contrato = 'CONT-SUP-2024-007';
            END IF;
            
            IF has_os_porcentaje THEN
                UPDATE obras_supervision SET porcentaje_avance = 35.00 WHERE numero_contrato = 'CONT-SUP-2024-001';
                UPDATE obras_supervision SET porcentaje_avance = 60.00 WHERE numero_contrato = 'CONT-SUP-2024-002';
                UPDATE obras_supervision SET porcentaje_avance = 50.00 WHERE numero_contrato = 'CONT-SUP-2024-005';
                UPDATE obras_supervision SET porcentaje_avance = 20.00 WHERE numero_contrato = 'CONT-SUP-2024-007';
            END IF;
            
            IF has_os_observaciones THEN
                UPDATE obras_supervision SET observaciones = 'Supervisión activa del proyecto' WHERE numero_contrato = 'CONT-SUP-2024-001';
                UPDATE obras_supervision SET observaciones = 'Control de calidad continuo' WHERE numero_contrato = 'CONT-SUP-2024-002';
                UPDATE obras_supervision SET observaciones = 'Seguimiento de especificaciones' WHERE numero_contrato = 'CONT-SUP-2024-005';
                UPDATE obras_supervision SET observaciones = 'Verificación de normas deportivas' WHERE numero_contrato = 'CONT-SUP-2024-007';
                UPDATE obras_supervision SET observaciones = 'Esperando inicio de obra' WHERE numero_contrato = 'CONT-SUP-2024-003';
                UPDATE obras_supervision SET observaciones = 'Pendiente de asignación de ejecutor' WHERE numero_contrato = 'CONT-SUP-2024-006';
                UPDATE obras_supervision SET observaciones = 'En proceso de licitación de ejecutor' WHERE numero_contrato = 'CONT-SUP-2024-008';
            END IF;
            
            RAISE NOTICE 'Contratos de supervisión insertados correctamente (adaptativo)';
        END IF;
        
    ELSE
        RAISE NOTICE 'Ya existen contratos en el sistema';
    END IF;
END $$;

-- PASO 3: REPORTE FINAL ADAPTATIVO
SELECT 
    '=====================================' as separador,
    'REPORTE FINAL - DATOS DE PRUEBA' as titulo,
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

-- Vista para frontend (adaptativa)
SELECT 
    '--- DATOS PARA FRONTEND (ADAPTATIVO) ---' as titulo;

-- Query adaptativa que solo usa columnas que existen
DO $$
DECLARE
    has_oe_porcentaje BOOLEAN;
    has_os_porcentaje BOOLEAN;
    query_text TEXT;
BEGIN
    -- Verificar columnas de avance
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_ejecucion' AND column_name = 'porcentaje_avance'
    ) INTO has_oe_porcentaje;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_supervision' AND column_name = 'porcentaje_avance'
    ) INTO has_os_porcentaje;
    
    -- Construir query adaptativa
    query_text := 'SELECT 
        o.id as obra_id,
        o.nombre as obra_nombre,
        o.codigo,
        o.estado as obra_estado,
        oe.numero_contrato as contrato_ejecucion,
        e_ejec.nombre_comercial as empresa_ejecutora';
    
    IF has_oe_porcentaje THEN
        query_text := query_text || ',
        oe.porcentaje_avance as avance_ejecucion';
    ELSE
        query_text := query_text || ',
        NULL::decimal as avance_ejecucion';
    END IF;
    
    query_text := query_text || ',
        os.numero_contrato as contrato_supervision,
        e_super.nombre_comercial as empresa_supervisora';
    
    IF has_os_porcentaje THEN
        query_text := query_text || ',
        os.porcentaje_avance as avance_supervision';
    ELSE
        query_text := query_text || ',
        NULL::decimal as avance_supervision';
    END IF;
    
    query_text := query_text || '
    FROM obras o
    LEFT JOIN obras_ejecucion oe ON o.id = oe.obra_id
    LEFT JOIN empresas e_ejec ON oe.empresa_ejecutora_id = e_ejec.id
    LEFT JOIN obras_supervision os ON o.id = os.obra_id
    LEFT JOIN empresas e_super ON os.empresa_supervisora_id = e_super.id
    ORDER BY o.id';
    
    -- Ejecutar query adaptativa
    EXECUTE query_text;
END $$;

-- Mensaje final
SELECT 
    '✅ DATOS DE PRUEBA VERIFICADOS (MODO ADAPTATIVO)' as mensaje_final,
    'El script se adaptó automáticamente a la estructura actual' as info,
    'Si faltan columnas, ejecutar add-missing-columns.sql primero' as recomendacion;