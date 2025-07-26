-- =====================================================
-- SCRIPT DE SOLUCIÓN COMPLETA
-- Sistema de Control de Valorizaciones de Obras
-- =====================================================
--
-- RESUELVE EL ERROR:
-- ERROR: 42703: column oe.porcentaje_avance does not exist
--
-- ACCIONES:
-- 1. Agrega columnas faltantes (porcentaje_avance, monto_ejecutado)
-- 2. Crea datos de prueba de forma segura
-- 3. Verifica que todo funcione correctamente
--
-- EJECUCIÓN SEGURA:
-- - Idempotente (se puede ejecutar múltiples veces)
-- - Detecta automáticamente qué se necesita
-- - No afecta datos existentes
-- =====================================================

SELECT 'INICIANDO CORRECCIÓN DE COLUMNAS Y DATOS...' as status;

-- FASE 1: AGREGAR COLUMNAS FALTANTES
DO $$
BEGIN
    RAISE NOTICE '=== FASE 1: VERIFICACIÓN Y CORRECCIÓN DE ESTRUCTURA ===';
    
    -- Agregar porcentaje_avance a obras_ejecucion si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_ejecucion' AND column_name = 'porcentaje_avance'
    ) THEN
        ALTER TABLE obras_ejecucion 
        ADD COLUMN porcentaje_avance DECIMAL(5,2) DEFAULT 0 
        CHECK (porcentaje_avance >= 0 AND porcentaje_avance <= 100);
        RAISE NOTICE '✓ Agregada porcentaje_avance a obras_ejecucion';
    ELSE
        RAISE NOTICE '✓ porcentaje_avance ya existe en obras_ejecucion';
    END IF;
    
    -- Agregar monto_ejecutado a obras_ejecucion si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_ejecucion' AND column_name = 'monto_ejecutado'
    ) THEN
        ALTER TABLE obras_ejecucion 
        ADD COLUMN monto_ejecutado DECIMAL(15,2) DEFAULT 0;
        RAISE NOTICE '✓ Agregada monto_ejecutado a obras_ejecucion';
    ELSE
        RAISE NOTICE '✓ monto_ejecutado ya existe en obras_ejecucion';
    END IF;
    
    -- Agregar porcentaje_avance a obras_supervision si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_supervision' AND column_name = 'porcentaje_avance'
    ) THEN
        ALTER TABLE obras_supervision 
        ADD COLUMN porcentaje_avance DECIMAL(5,2) DEFAULT 0 
        CHECK (porcentaje_avance >= 0 AND porcentaje_avance <= 100);
        RAISE NOTICE '✓ Agregada porcentaje_avance a obras_supervision';
    ELSE
        RAISE NOTICE '✓ porcentaje_avance ya existe en obras_supervision';
    END IF;
    
    -- Agregar monto_ejecutado a obras_supervision si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_supervision' AND column_name = 'monto_ejecutado'
    ) THEN
        ALTER TABLE obras_supervision 
        ADD COLUMN monto_ejecutado DECIMAL(15,2) DEFAULT 0;
        RAISE NOTICE '✓ Agregada monto_ejecutado a obras_supervision';
    ELSE
        RAISE NOTICE '✓ monto_ejecutado ya existe en obras_supervision';
    END IF;
    
    -- Agregar otras columnas útiles si no existen
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_ejecucion' AND column_name = 'observaciones'
    ) THEN
        ALTER TABLE obras_ejecucion ADD COLUMN observaciones TEXT;
        RAISE NOTICE '✓ Agregada observaciones a obras_ejecucion';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_supervision' AND column_name = 'observaciones'
    ) THEN
        ALTER TABLE obras_supervision ADD COLUMN observaciones TEXT;
        RAISE NOTICE '✓ Agregada observaciones a obras_supervision';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_ejecucion' AND column_name = 'fecha_fin'
    ) THEN
        ALTER TABLE obras_ejecucion ADD COLUMN fecha_fin DATE;
        RAISE NOTICE '✓ Agregada fecha_fin a obras_ejecucion';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras_supervision' AND column_name = 'fecha_fin'
    ) THEN
        ALTER TABLE obras_supervision ADD COLUMN fecha_fin DATE;
        RAISE NOTICE '✓ Agregada fecha_fin a obras_supervision';
    END IF;
END $$;

-- FASE 2: VERIFICAR Y CREAR DATOS DE PRUEBA
DO $$
DECLARE
    empresas_count INTEGER;
    obras_count INTEGER;
    ejecucion_count INTEGER;
    supervision_count INTEGER;
BEGIN
    RAISE NOTICE '=== FASE 2: VERIFICACIÓN DE DATOS EXISTENTES ===';
    
    SELECT COUNT(*) INTO empresas_count FROM empresas;
    SELECT COUNT(*) INTO obras_count FROM obras;
    SELECT COUNT(*) INTO ejecucion_count FROM obras_ejecucion;
    SELECT COUNT(*) INTO supervision_count FROM obras_supervision;
    
    RAISE NOTICE 'Empresas: %, Obras: %, Ejecución: %, Supervisión: %', 
        empresas_count, obras_count, ejecucion_count, supervision_count;
    
    -- Insertar empresas si no existen
    IF empresas_count = 0 THEN
        INSERT INTO empresas (ruc, razon_social, nombre_comercial, direccion, telefono, email, representante_legal, es_consorcio, estado) VALUES 
            ('20123456789', 'CONSTRUCTORA DEMO S.A.C.', 'CONSTRUCTORA DEMO', 'Av. Construcción 123, Lima', '01-234-5678', 'info@constructorademo.com', 'Juan Pérez García', false, 'ACTIVO'),
            ('20987654321', 'SUPERVISORA INGENIEROS S.A.', 'SUPERVISORA ING', 'Jr. Ingeniería 456, Lima', '01-987-6543', 'contacto@supervisoraing.com', 'María González López', false, 'ACTIVO'),
            ('20555666777', 'CONSORCIO OBRAS PUBLICAS', 'CONSORCIO OP', 'Av. República 789, Lima', '01-555-6677', 'consorcio@obraspublicas.com', 'Carlos Mendoza Silva', true, 'ACTIVO'),
            ('20888999111', 'INGENIERIA AVANZADA S.A.', 'ING AVANZADA', 'Jr. Tecnología 321, Lima', '01-888-9911', 'contacto@ingavanzada.com', 'Ana Torres Ruiz', false, 'ACTIVO'),
            ('20444555666', 'CONSTRUCTORA NORTE S.R.L.', 'CONST NORTE', 'Av. Norte 987, Lima', '01-444-5556', 'admin@constnorte.com', 'Roberto Silva Díaz', false, 'ACTIVO'),
            ('20777888999', 'SUPERVISION ESPECIALIZADA S.A.C.', 'SUP ESPECIALIZADA', 'Jr. Control 654, Lima', '01-777-8889', 'info@supespecializada.com', 'Patricia Morales Vega', false, 'ACTIVO')
        ON CONFLICT (ruc) DO NOTHING;
        RAISE NOTICE '✓ Empresas insertadas';
    END IF;
    
    -- Insertar obras si no existen
    IF obras_count = 0 THEN
        INSERT INTO obras (nombre, descripcion, codigo, ubicacion, estado) VALUES 
            ('Construcción de Puente Metropolitano', 'Construcción de puente vehicular de 200m de longitud sobre río principal', 'OBRA-2024-001', 'Av. Principal - Distrito Central', 'EN_PROCESO'),
            ('Mejoramiento de Carretera Central', 'Mejoramiento y asfaltado de 15km de carretera con señalización', 'OBRA-2024-002', 'Carretera Central Km 25-40', 'EN_PROCESO'),
            ('Ampliación de Hospital Nacional', 'Construcción de nueva ala de emergencias y UCI', 'OBRA-2024-003', 'Hospital Nacional - Lima', 'PLANIFICACION'),
            ('Construcción de Centro Educativo', 'Nuevo colegio de 3 niveles para 600 alumnos', 'OBRA-2024-004', 'Distrito San Juan - Lima', 'PLANIFICACION'),
            ('Remodelación de Plaza Principal', 'Remodelación integral de plaza cívica con áreas verdes', 'OBRA-2024-005', 'Plaza de Armas - Centro Histórico', 'EN_PROCESO')
        ON CONFLICT (nombre) DO NOTHING;
        RAISE NOTICE '✓ Obras insertadas';
    END IF;
END $$;

-- FASE 3: INSERTAR CONTRATOS CON TODAS LAS COLUMNAS
DO $$
DECLARE
    ejecucion_actual INTEGER;
    supervision_actual INTEGER;
    obra_puente_id BIGINT;
    obra_carretera_id BIGINT;
    obra_hospital_id BIGINT;
    obra_colegio_id BIGINT;
    obra_plaza_id BIGINT;
    empresa_constructora_id BIGINT;
    empresa_supervisora_id BIGINT;
    empresa_consorcio_id BIGINT;
    empresa_ing_avanzada_id BIGINT;
    empresa_const_norte_id BIGINT;
    empresa_sup_especializada_id BIGINT;
BEGIN
    RAISE NOTICE '=== FASE 3: INSERCIÓN DE CONTRATOS CON COLUMNAS COMPLETAS ===';
    
    SELECT COUNT(*) INTO ejecucion_actual FROM obras_ejecucion;
    SELECT COUNT(*) INTO supervision_actual FROM obras_supervision;
    
    IF ejecucion_actual = 0 OR supervision_actual = 0 THEN
        -- Obtener IDs
        SELECT id INTO obra_puente_id FROM obras WHERE codigo = 'OBRA-2024-001';
        SELECT id INTO obra_carretera_id FROM obras WHERE codigo = 'OBRA-2024-002';
        SELECT id INTO obra_hospital_id FROM obras WHERE codigo = 'OBRA-2024-003';
        SELECT id INTO obra_colegio_id FROM obras WHERE codigo = 'OBRA-2024-004';
        SELECT id INTO obra_plaza_id FROM obras WHERE codigo = 'OBRA-2024-005';
        
        SELECT id INTO empresa_constructora_id FROM empresas WHERE ruc = '20123456789';
        SELECT id INTO empresa_supervisora_id FROM empresas WHERE ruc = '20987654321';
        SELECT id INTO empresa_consorcio_id FROM empresas WHERE ruc = '20555666777';
        SELECT id INTO empresa_ing_avanzada_id FROM empresas WHERE ruc = '20888999111';
        SELECT id INTO empresa_const_norte_id FROM empresas WHERE ruc = '20444555666';
        SELECT id INTO empresa_sup_especializada_id FROM empresas WHERE ruc = '20777888999';
        
        -- Insertar contratos de ejecución CON TODAS LAS COLUMNAS
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
                 'Plaza de Armas - Centro Histórico', 450000.00, 225000.00, 50.00, 'EN_EJECUCION', 'Avance según lo programado')
            ON CONFLICT (numero_contrato) DO NOTHING;
            RAISE NOTICE '✓ Contratos de ejecución insertados con todas las columnas';
        END IF;
        
        -- Insertar contratos de supervisión CON TODAS LAS COLUMNAS
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
                 'Plaza de Armas - Centro Histórico', 22500.00, 11250.00, 50.00, 'EN_SUPERVISION', 'Seguimiento de especificaciones')
            ON CONFLICT (numero_contrato) DO NOTHING;
            RAISE NOTICE '✓ Contratos de supervisión insertados con todas las columnas';
        END IF;
    END IF;
END $$;

-- FASE 4: PRUEBA DE LA QUERY PROBLEMÁTICA
SELECT 'FASE 4: PRUEBA DE LA QUERY QUE CAUSABA ERROR' as status;

-- Esta es la query que causaba el error original, ahora debería funcionar
SELECT 
    o.id as obra_id,
    o.nombre as obra_nombre,
    o.codigo,
    o.estado as obra_estado,
    oe.numero_contrato as contrato_ejecucion,
    e_ejec.nombre_comercial as empresa_ejecutora,
    oe.porcentaje_avance as avance_ejecucion,  -- Esta línea causaba el error
    os.numero_contrato as contrato_supervision,
    e_super.nombre_comercial as empresa_supervisora,
    os.porcentaje_avance as avance_supervision   -- Esta línea también
FROM obras o
LEFT JOIN obras_ejecucion oe ON o.id = oe.obra_id
LEFT JOIN empresas e_ejec ON oe.empresa_ejecutora_id = e_ejec.id
LEFT JOIN obras_supervision os ON o.id = os.obra_id
LEFT JOIN empresas e_super ON os.empresa_supervisora_id = e_super.id
ORDER BY o.id;

-- REPORTE FINAL
SELECT 
    '🎉 CORRECCIÓN COMPLETADA EXITOSAMENTE' as resultado,
    'La query problemática ahora funciona correctamente' as confirmacion;

-- Conteos finales
SELECT 
    'TABLA' as tipo,
    'CANTIDAD' as registros
UNION ALL
SELECT 'Empresas', COUNT(*)::text FROM empresas
UNION ALL  
SELECT 'Obras', COUNT(*)::text FROM obras
UNION ALL
SELECT 'Contratos Ejecución', COUNT(*)::text FROM obras_ejecucion
UNION ALL
SELECT 'Contratos Supervisión', COUNT(*)::text FROM obras_supervision;

SELECT 
    '✅ ERROR RESUELTO: column oe.porcentaje_avance does not exist' as mensaje,
    '✅ Ahora check-and-create-test-data.sql debería funcionar' as siguiente_paso;