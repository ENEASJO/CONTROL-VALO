-- =====================================================
-- SCRIPT COMPLETO DE DATOS DE PRUEBA ROBUSTOS
-- Sistema de Control de Valorizaciones de Obras
-- =====================================================
--
-- OBJETIVO: Llenar TODOS los módulos con datos abundantes
-- - 10 empresas variadas (constructoras, supervisoras, consorcios)
-- - 12 obras diferentes (puentes, carreteras, hospitales, colegios, etc.)
-- - 10 contratos de ejecución
-- - 10 contratos de supervisión
-- - Datos realistas con montos, avances y fechas coherentes
--
-- CARACTERÍSTICAS:
-- ✅ Idempotente (se puede ejecutar múltiples veces)
-- ✅ Verificaciones para no duplicar datos
-- ✅ Datos realistas y variados
-- ✅ Relaciones correctas entre todas las tablas
-- ✅ Estados y avances diversos para demostración
-- =====================================================

BEGIN;

SELECT 'INICIANDO CREACIÓN DE DATOS DE PRUEBA COMPLETOS...' as status;

-- =====================================================
-- FASE 1: VERIFICAR Y CREAR EMPRESAS ROBUSTAS
-- =====================================================
DO $$
DECLARE
    empresas_existentes INTEGER;
BEGIN
    SELECT COUNT(*) INTO empresas_existentes FROM empresas;
    
    RAISE NOTICE '=== FASE 1: EMPRESAS ===';
    RAISE NOTICE 'Empresas existentes: %', empresas_existentes;
    
    -- Crear 10 empresas variadas si no existen suficientes
    IF empresas_existentes < 10 THEN
        RAISE NOTICE 'Insertando empresas de prueba...';
        
        INSERT INTO empresas (ruc, razon_social, nombre_comercial, direccion, telefono, email, representante_legal, es_consorcio, estado) VALUES 
            -- EMPRESAS CONSTRUCTORAS/EJECUTORAS
            ('20123456789', 'CONSTRUCTORA METROPOLITANA S.A.C.', 'CONST METROPOLITANA', 'Av. Javier Prado 2580, San Borja, Lima', '01-234-5678', 'info@constmetropolitana.com', 'Juan Carlos Pérez García', false, 'ACTIVO'),
            ('20987654321', 'CONSORCIO OBRAS MAYORES', 'CONSORCIO OM', 'Av. República de Panamá 3145, San Isidro, Lima', '01-987-6543', 'consorcio@obrasmayor.com', 'María Elena González López', true, 'ACTIVO'),
            ('20555666777', 'CONSTRUCTORA NORTE PACÍFICO S.A.', 'CONST NORTE PAC', 'Jr. Las Begonias 475, San Isidro, Lima', '01-555-6677', 'contacto@nortepacifico.com', 'Carlos Roberto Mendoza Silva', false, 'ACTIVO'),
            ('20444555666', 'INGENIERÍA Y CONSTRUCCIÓN ANDINA S.R.L.', 'ING CONST ANDINA', 'Av. El Sol 890, Cusco', '084-444-555', 'admin@ingandina.com', 'Roberto Silva Díaz', false, 'ACTIVO'),
            ('20333444555', 'CONSORCIO INFRAESTRUCTURA NACIONAL', 'CONSORCIO INFRA NAC', 'Av. Venezuela 1420, Breña, Lima', '01-333-4445', 'info@infraestructuranac.com', 'Ana Patricia Torres Ruiz', true, 'ACTIVO'),
            ('20888999111', 'CONSTRUCTORA COSTA VERDE S.A.C.', 'CONST COSTA VERDE', 'Malecón de la Reserva 610, Miraflores, Lima', '01-888-9911', 'ventas@costaverde.com', 'Luis Fernando Ramírez Castro', false, 'ACTIVO'),
            
            -- EMPRESAS SUPERVISORAS
            ('20777888999', 'SUPERVISIÓN ESPECIALIZADA S.A.', 'SUP ESPECIALIZADA', 'Jr. Lampa 545, Cercado de Lima', '01-777-8889', 'supervision@especializada.com', 'Patricia Morales Vega', false, 'ACTIVO'),
            ('20666777888', 'CONTROL Y CALIDAD INGENIEROS S.A.C.', 'CONTROL CALIDAD ING', 'Av. Arequipa 2825, Lince, Lima', '01-666-7778', 'control@calidadingenieros.com', 'Fernando Alejandro Castro Delgado', false, 'ACTIVO'),
            ('20222333444', 'ASESORÍA TÉCNICA METROPOLITANA S.R.L.', 'ASESORIA TEC METRO', 'Av. Universitaria 1801, San Miguel, Lima', '01-222-3334', 'asesoria@tecmetro.com', 'Sofía Elizabeth Herrera Moreno', false, 'ACTIVO'),
            ('20111222333', 'SUPERVISIÓN Y FISCALIZACIÓN PERÚ S.A.', 'SUP FISCAL PERU', 'Jr. Cusco 121, Cercado de Lima', '01-111-2223', 'fiscalizacion@supperu.com', 'Diego Alexander Vargas Pineda', false, 'ACTIVO')
        ON CONFLICT (ruc) DO NOTHING;
        
        RAISE NOTICE '✓ Empresas insertadas exitosamente';
    ELSE
        RAISE NOTICE '✓ Ya existen suficientes empresas';
    END IF;
END $$;

-- =====================================================
-- FASE 2: VERIFICAR Y CREAR OBRAS VARIADAS
-- =====================================================
DO $$
DECLARE
    obras_existentes INTEGER;
BEGIN
    SELECT COUNT(*) INTO obras_existentes FROM obras;
    
    RAISE NOTICE '=== FASE 2: OBRAS ===';
    RAISE NOTICE 'Obras existentes: %', obras_existentes;
    
    -- Crear 12 obras variadas si no existen suficientes
    IF obras_existentes < 12 THEN
        RAISE NOTICE 'Insertando obras de prueba...';
        
        INSERT INTO obras (nombre, descripcion, codigo, ubicacion, estado) VALUES 
            -- INFRAESTRUCTURA VIAL
            ('Construcción de Puente Metropolitano Los Olivos', 'Construcción de puente vehicular de 250m de longitud sobre río Rímac con 4 carriles', 'OBRA-2024-001', 'Av. Alfredo Mendiola - Los Olivos, Lima', 'EN_PROCESO'),
            ('Mejoramiento de Carretera Central Tramo 1', 'Mejoramiento y asfaltado de 18km de carretera con señalización y obras de arte', 'OBRA-2024-002', 'Carretera Central Km 25-43, Huarochirí', 'EN_PROCESO'),
            ('Construcción de Viaducto San Juan de Lurigancho', 'Viaducto de 180m para descongestionar tráfico en zona comercial', 'OBRA-2024-003', 'Av. Próceres de la Independencia - SJL, Lima', 'PLANIFICACION'),
            ('Ampliación de Autopista Norte', 'Ampliación a 6 carriles de 12km de autopista con intercambios viales', 'OBRA-2024-004', 'Autopista Norte Km 15-27, Lima Norte', 'PLANIFICACION'),
            
            -- SALUD
            ('Ampliación de Hospital Nacional Dos de Mayo', 'Construcción de nueva ala de emergencias, UCI y consultorios externos', 'OBRA-2024-005', 'Hospital Nacional Dos de Mayo - Cercado de Lima', 'EN_PROCESO'),
            ('Construcción de Centro de Salud Villa El Salvador', 'Centro de salud tipo I-4 con capacidad para 50,000 habitantes', 'OBRA-2024-006', 'Distrito Villa El Salvador, Lima Sur', 'PLANIFICACION'),
            
            -- EDUCACIÓN
            ('Construcción de I.E. Secundaria San Martín de Porres', 'Nuevo colegio de 4 niveles para 800 alumnos con laboratorios y biblioteca', 'OBRA-2024-007', 'Distrito San Martín de Porres, Lima Norte', 'EN_PROCESO'),
            ('Mejoramiento de I.E. Primaria José Olaya', 'Rehabilitación integral de infraestructura y construcción de aulas nuevas', 'OBRA-2024-008', 'Distrito Chorrillos, Lima Sur', 'FINALIZADA'),
            
            -- ESPACIOS PÚBLICOS
            ('Remodelación de Plaza de Armas de Pueblo Libre', 'Remodelación integral con áreas verdes, pileta y mobiliario urbano', 'OBRA-2024-009', 'Plaza de Armas - Pueblo Libre, Lima', 'EN_PROCESO'),
            ('Construcción de Parque Zonal Villa María del Triunfo', 'Parque de 5 hectáreas con canchas deportivas y áreas recreativas', 'OBRA-2024-010', 'Villa María del Triunfo, Lima Sur', 'PLANIFICACION'),
            
            -- OBRAS ESPECIALES
            ('Construcción de Terminal Terrestre Interprovincial', 'Terminal con 24 andenes y servicios complementarios', 'OBRA-2024-011', 'Distrito Santa Anita, Lima Este', 'PLANIFICACION'),
            ('Mejoramiento de Mercado Central de Abastecimiento', 'Modernización integral con sistemas contra incendios y refrigeración', 'OBRA-2024-012', 'Mercado Central - Cercado de Lima', 'EN_PROCESO')
        ON CONFLICT (nombre) DO NOTHING;
        
        RAISE NOTICE '✓ Obras insertadas exitosamente';
    ELSE
        RAISE NOTICE '✓ Ya existen suficientes obras';
    END IF;
END $$;

-- =====================================================
-- FASE 3: CREAR CONTRATOS DE EJECUCIÓN ROBUSTOS
-- =====================================================
DO $$
DECLARE
    ejecucion_existentes INTEGER;
    obra_id BIGINT;
    empresa_id BIGINT;
BEGIN
    SELECT COUNT(*) INTO ejecucion_existentes FROM obras_ejecucion;
    
    RAISE NOTICE '=== FASE 3: CONTRATOS DE EJECUCIÓN ===';
    RAISE NOTICE 'Contratos de ejecución existentes: %', ejecucion_existentes;
    
    IF ejecucion_existentes < 10 THEN
        RAISE NOTICE 'Insertando contratos de ejecución...';
        
        -- Contrato 1: Puente Metropolitano (EN EJECUCIÓN - 35% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-001';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20123456789';
        INSERT INTO obras_ejecucion (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_ejecutora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Construcción de Puente Metropolitano Los Olivos', 'CONT-EJE-2024-001', 'EXP-2024-001', '2024-01',
            '2024-01-15', '2025-03-15', 425, empresa_id, 'Construcción de puente vehicular de 250m con 4 carriles',
            'Av. Alfredo Mendiola - Los Olivos, Lima', 3200000.00, 1120000.00, 35.00, 'EN_EJECUCION', 
            'Obra avanzando según cronograma. Cimentación terminada, iniciando superestructura.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Contrato 2: Carretera Central (EN EJECUCIÓN - 60% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-002';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20987654321';
        INSERT INTO obras_ejecucion (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_ejecutora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Mejoramiento de Carretera Central Tramo 1', 'CONT-EJE-2024-002', 'EXP-2024-002', '2024-02',
            '2024-02-01', '2024-09-30', 240, empresa_id, 'Mejoramiento y asfaltado de 18km con señalización',
            'Carretera Central Km 25-43, Huarochirí', 2400000.00, 1440000.00, 60.00, 'EN_EJECUCION',
            'Obra en etapa de asfaltado. Avance adelantado al cronograma original.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Contrato 3: Hospital Dos de Mayo (EN EJECUCIÓN - 25% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-005';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20555666777';
        INSERT INTO obras_ejecucion (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_ejecutora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Ampliación de Hospital Nacional Dos de Mayo', 'CONT-EJE-2024-005', 'EXP-2024-005', '2024-03',
            '2024-03-01', '2025-05-30', 455, empresa_id, 'Nueva ala de emergencias, UCI y consultorios',
            'Hospital Nacional Dos de Mayo - Cercado de Lima', 5500000.00, 1375000.00, 25.00, 'EN_EJECUCION',
            'Movimiento de tierras completado. Iniciando estructuras de concreto armado.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Contrato 4: Colegio San Martín (EN EJECUCIÓN - 45% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-007';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20444555666';
        INSERT INTO obras_ejecucion (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_ejecutora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Construcción de I.E. Secundaria San Martín de Porres', 'CONT-EJE-2024-007', 'EXP-2024-007', '2024-04',
            '2024-04-01', '2025-01-30', 305, empresa_id, 'Colegio de 4 niveles para 800 alumnos',
            'Distrito San Martín de Porres, Lima Norte', 1800000.00, 810000.00, 45.00, 'EN_EJECUCION',
            'Estructura del primer y segundo nivel terminada. Avance según cronograma.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Contrato 5: Plaza Pueblo Libre (EN EJECUCIÓN - 70% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-009';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20333444555';
        INSERT INTO obras_ejecucion (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_ejecutora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Remodelación de Plaza de Armas de Pueblo Libre', 'CONT-EJE-2024-009', 'EXP-2024-009', '2024-04',
            '2024-04-15', '2024-10-15', 185, empresa_id, 'Remodelación integral con áreas verdes y pileta',
            'Plaza de Armas - Pueblo Libre, Lima', 650000.00, 455000.00, 70.00, 'EN_EJECUCION',
            'Obras de albañilería terminadas. Iniciando instalación de mobiliario urbano.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Contrato 6: Mercado Central (EN EJECUCIÓN - 15% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-012';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20888999111';
        INSERT INTO obras_ejecucion (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_ejecutora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Mejoramiento de Mercado Central de Abastecimiento', 'CONT-EJE-2024-012', 'EXP-2024-012', '2024-05',
            '2024-05-01', '2025-02-28', 305, empresa_id, 'Modernización con sistemas contra incendios',
            'Mercado Central - Cercado de Lima', 2200000.00, 330000.00, 15.00, 'EN_EJECUCION',
            'Fase inicial de diagnóstico y planificación completada. Iniciando demoliciones selectivas.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Contrato 7: I.E. José Olaya (FINALIZADA - 100% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-008';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20123456789';
        INSERT INTO obras_ejecucion (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_ejecutora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Mejoramiento de I.E. Primaria José Olaya', 'CONT-EJE-2024-008', 'EXP-2024-008', '2023-11',
            '2023-11-01', '2024-04-30', 180, empresa_id, 'Rehabilitación integral y nuevas aulas',
            'Distrito Chorrillos, Lima Sur', 950000.00, 950000.00, 100.00, 'FINALIZADA',
            'Obra entregada exitosamente. Conformidad total del expediente técnico.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Contrato 8: Viaducto SJL (PROGRAMADA - 0% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-003';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20987654321';
        INSERT INTO obras_ejecucion (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_ejecutora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Construcción de Viaducto San Juan de Lurigancho', 'CONT-EJE-2024-003', 'EXP-2024-003', '2024-08',
            '2024-08-01', '2025-05-30', 270, empresa_id, 'Viaducto de 180m para descongestionar tráfico',
            'Av. Próceres de la Independencia - SJL, Lima', 2800000.00, 0.00, 0.00, 'PROGRAMADA',
            'Contrato firmado. Pendiente entrega de terreno y inicio de obra.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Contrato 9: Centro Salud Villa El Salvador (PROGRAMADA - 0% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-006';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20444555666';
        INSERT INTO obras_ejecucion (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_ejecutora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Construcción de Centro de Salud Villa El Salvador', 'CONT-EJE-2024-006', 'EXP-2024-006', '2024-07',
            '2024-07-15', '2025-03-15', 245, empresa_id, 'Centro de salud tipo I-4 para 50,000 habitantes',
            'Distrito Villa El Salvador, Lima Sur', 1500000.00, 0.00, 0.00, 'PROGRAMADA',
            'En proceso de liberación del terreno. Expediente técnico aprobado.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Contrato 10: Autopista Norte (PROGRAMADA - 0% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-004';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20333444555';
        INSERT INTO obras_ejecucion (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_ejecutora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Ampliación de Autopista Norte', 'CONT-EJE-2024-004', 'EXP-2024-004', '2024-09',
            '2024-09-01', '2026-02-28', 545, empresa_id, 'Ampliación a 6 carriles con intercambios viales',
            'Autopista Norte Km 15-27, Lima Norte', 8500000.00, 0.00, 0.00, 'PROGRAMADA',
            'Contrato en proceso de perfeccionamiento. Estudio de impacto ambiental aprobado.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        RAISE NOTICE '✓ Contratos de ejecución insertados exitosamente';
    ELSE
        RAISE NOTICE '✓ Ya existen suficientes contratos de ejecución';
    END IF;
END $$;

-- =====================================================
-- FASE 4: CREAR CONTRATOS DE SUPERVISIÓN ROBUSTOS
-- =====================================================
DO $$
DECLARE
    supervision_existentes INTEGER;
    obra_id BIGINT;
    empresa_id BIGINT;
BEGIN
    SELECT COUNT(*) INTO supervision_existentes FROM obras_supervision;
    
    RAISE NOTICE '=== FASE 4: CONTRATOS DE SUPERVISIÓN ===';
    RAISE NOTICE 'Contratos de supervisión existentes: %', supervision_existentes;
    
    IF supervision_existentes < 10 THEN
        RAISE NOTICE 'Insertando contratos de supervisión...';
        
        -- Supervisión 1: Puente Metropolitano (35% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-001';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20777888999';
        INSERT INTO obras_supervision (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_supervisora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Supervisión Puente Metropolitano Los Olivos', 'CONT-SUP-2024-001', 'EXP-SUP-2024-001', '2024-01',
            '2024-01-15', '2025-03-15', 425, empresa_id, 'Supervisión de construcción de puente vehicular',
            'Av. Alfredo Mendiola - Los Olivos, Lima', 160000.00, 56000.00, 35.00, 'EN_SUPERVISION',
            'Supervisión técnica activa. Informes de avance mensuales al día.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Supervisión 2: Carretera Central (60% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-002';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20666777888';
        INSERT INTO obras_supervision (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_supervisora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Supervisión Carretera Central Tramo 1', 'CONT-SUP-2024-002', 'EXP-SUP-2024-002', '2024-02',
            '2024-02-01', '2024-09-30', 240, empresa_id, 'Supervisión de mejoramiento y asfaltado',
            'Carretera Central Km 25-43, Huarochirí', 120000.00, 72000.00, 60.00, 'EN_SUPERVISION',
            'Control de calidad de asfalto en proceso. Ensayos de laboratorio favorables.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Supervisión 3: Hospital Dos de Mayo (25% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-005';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20222333444';
        INSERT INTO obras_supervision (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_supervisora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Supervisión Hospital Nacional Dos de Mayo', 'CONT-SUP-2024-005', 'EXP-SUP-2024-005', '2024-03',
            '2024-03-01', '2025-05-30', 455, empresa_id, 'Supervisión de ampliación hospitalaria',
            'Hospital Nacional Dos de Mayo - Cercado de Lima', 275000.00, 68750.00, 25.00, 'EN_SUPERVISION',
            'Supervisión especializada en infraestructura hospitalaria. Cumplimiento de normas sanitarias verificado.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Supervisión 4: Colegio San Martín (45% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-007';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20111222333';
        INSERT INTO obras_supervision (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_supervisora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Supervisión I.E. Secundaria San Martín de Porres', 'CONT-SUP-2024-007', 'EXP-SUP-2024-007', '2024-04',
            '2024-04-01', '2025-01-30', 305, empresa_id, 'Supervisión de construcción educativa',
            'Distrito San Martín de Porres, Lima Norte', 90000.00, 40500.00, 45.00, 'EN_SUPERVISION',
            'Seguimiento de normas técnicas educativas. Verificación de especificaciones de laboratorios.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Supervisión 5: Plaza Pueblo Libre (70% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-009';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20777888999';
        INSERT INTO obras_supervision (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_supervisora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Supervisión Plaza de Armas Pueblo Libre', 'CONT-SUP-2024-009', 'EXP-SUP-2024-009', '2024-04',
            '2024-04-15', '2024-10-15', 185, empresa_id, 'Supervisión de remodelación urbana',
            'Plaza de Armas - Pueblo Libre, Lima', 32500.00, 22750.00, 70.00, 'EN_SUPERVISION',
            'Control de acabados y mobiliario urbano. Verificación de áreas verdes según diseño paisajístico.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Supervisión 6: Mercado Central (15% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-012';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20666777888';
        INSERT INTO obras_supervision (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_supervisora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Supervisión Mercado Central de Abastecimiento', 'CONT-SUP-2024-012', 'EXP-SUP-2024-012', '2024-05',
            '2024-05-01', '2025-02-28', 305, empresa_id, 'Supervisión de modernización comercial',
            'Mercado Central - Cercado de Lima', 110000.00, 16500.00, 15.00, 'EN_SUPERVISION',
            'Supervisión especializada en sistemas contra incendios y refrigeración comercial.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Supervisión 7: I.E. José Olaya (FINALIZADA - 100% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-008';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20222333444';
        INSERT INTO obras_supervision (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_supervisora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Supervisión I.E. Primaria José Olaya', 'CONT-SUP-2024-008', 'EXP-SUP-2024-008', '2023-11',
            '2023-11-01', '2024-04-30', 180, empresa_id, 'Supervisión de rehabilitación educativa',
            'Distrito Chorrillos, Lima Sur', 47500.00, 47500.00, 100.00, 'FINALIZADA',
            'Supervisión completada exitosamente. Liquidación del contrato aprobada.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Supervisión 8: Viaducto SJL (PROGRAMADA - 0% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-003';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20111222333';
        INSERT INTO obras_supervision (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_supervisora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Supervisión Viaducto San Juan de Lurigancho', 'CONT-SUP-2024-003', 'EXP-SUP-2024-003', '2024-08',
            '2024-08-01', '2025-05-30', 270, empresa_id, 'Supervisión de construcción de viaducto',
            'Av. Próceres de la Independencia - SJL, Lima', 140000.00, 0.00, 0.00, 'PROGRAMADA',
            'Contrato de supervisión suscrito. Pendiente inicio de obra para activar supervisión.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Supervisión 9: Centro Salud Villa El Salvador (PROGRAMADA - 0% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-006';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20777888999';
        INSERT INTO obras_supervision (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_supervisora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Supervisión Centro de Salud Villa El Salvador', 'CONT-SUP-2024-006', 'EXP-SUP-2024-006', '2024-07',
            '2024-07-15', '2025-03-15', 245, empresa_id, 'Supervisión de centro de salud',
            'Distrito Villa El Salvador, Lima Sur', 75000.00, 0.00, 0.00, 'PROGRAMADA',
            'Equipo de supervisión sanitaria designado. Esperando liberación de terreno.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        -- Supervisión 10: Terminal Terrestre (PROGRAMADA - 0% avance)
        SELECT id INTO obra_id FROM obras WHERE codigo = 'OBRA-2024-011';
        SELECT id INTO empresa_id FROM empresas WHERE ruc = '20666777888';
        INSERT INTO obras_supervision (
            obra_id, nombre_obra, numero_contrato, numero_expediente, periodo_valorizado,
            fecha_inicio, fecha_fin, plazo_ejecucion, empresa_supervisora_id, descripcion,
            ubicacion, monto_contrato, monto_ejecutado, porcentaje_avance, estado, observaciones
        ) VALUES (
            obra_id, 'Supervisión Terminal Terrestre Interprovincial', 'CONT-SUP-2024-011', 'EXP-SUP-2024-011', '2024-10',
            '2024-10-01', '2025-12-31', 455, empresa_id, 'Supervisión de terminal de transporte',
            'Distrito Santa Anita, Lima Este', 195000.00, 0.00, 0.00, 'PROGRAMADA',
            'Supervisión programada para iniciar con el proyecto ejecutivo del terminal.'
        ) ON CONFLICT (numero_contrato) DO NOTHING;
        
        RAISE NOTICE '✓ Contratos de supervisión insertados exitosamente';
    ELSE
        RAISE NOTICE '✓ Ya existen suficientes contratos de supervisión';
    END IF;
END $$;

-- =====================================================
-- FASE 5: VERIFICACIÓN Y PRUEBAS DEL SISTEMA
-- =====================================================
SELECT 'FASE 5: VERIFICACIÓN FINAL DEL SISTEMA' as status;

-- Prueba de la query principal que usa el frontend
SELECT 
    'PRUEBA DE QUERY PRINCIPAL - Debe mostrar todas las obras con sus contratos' as test_description;

SELECT 
    o.id as obra_id,
    o.nombre as obra_nombre,
    o.codigo,
    o.estado as obra_estado,
    oe.numero_contrato as contrato_ejecucion,
    e_ejec.nombre_comercial as empresa_ejecutora,
    oe.porcentaje_avance as avance_ejecucion,
    oe.monto_contrato as monto_ejecucion,
    oe.monto_ejecutado,
    os.numero_contrato as contrato_supervision,
    e_super.nombre_comercial as empresa_supervisora,
    os.porcentaje_avance as avance_supervision,
    os.monto_contrato as monto_supervision
FROM obras o
LEFT JOIN obras_ejecucion oe ON o.id = oe.obra_id
LEFT JOIN empresas e_ejec ON oe.empresa_ejecutora_id = e_ejec.id
LEFT JOIN obras_supervision os ON o.id = os.obra_id
LEFT JOIN empresas e_super ON os.empresa_supervisora_id = e_super.id
ORDER BY o.id
LIMIT 5;  -- Mostrar solo las primeras 5 para verificación

-- =====================================================
-- REPORTE FINAL - ESTADÍSTICAS COMPLETAS
-- =====================================================
SELECT 
    '🎉 DATOS DE PRUEBA COMPLETOS CREADOS EXITOSAMENTE' as resultado,
    'Todos los módulos tienen datos abundantes para demostración' as confirmacion;

-- Conteos detallados por módulo
SELECT 
    'RESUMEN FINAL POR MÓDULO' as seccion,
    '========================' as separador
UNION ALL
SELECT 'MÓDULO', 'CANTIDAD'
UNION ALL
SELECT '📋 Empresas Totales', COUNT(*)::text FROM empresas
UNION ALL  
SELECT '🏗️ Obras Totales', COUNT(*)::text FROM obras
UNION ALL
SELECT '⚙️ Contratos Ejecución', COUNT(*)::text FROM obras_ejecucion
UNION ALL
SELECT '👀 Contratos Supervisión', COUNT(*)::text FROM obras_supervision
UNION ALL
SELECT '', ''
UNION ALL
SELECT 'ESTADÍSTICAS DETALLADAS', '==================='
UNION ALL
SELECT '📊 Empresas Constructoras', (SELECT COUNT(*) FROM empresas WHERE ruc IN ('20123456789','20987654321','20555666777','20444555666','20333444555','20888999111'))::text
UNION ALL
SELECT '📊 Empresas Supervisoras', (SELECT COUNT(*) FROM empresas WHERE ruc IN ('20777888999','20666777888','20222333444','20111222333'))::text
UNION ALL
SELECT '📊 Obras EN_PROCESO', (SELECT COUNT(*) FROM obras WHERE estado = 'EN_PROCESO')::text
UNION ALL
SELECT '📊 Obras PLANIFICACION', (SELECT COUNT(*) FROM obras WHERE estado = 'PLANIFICACION')::text
UNION ALL
SELECT '📊 Obras FINALIZADA', (SELECT COUNT(*) FROM obras WHERE estado = 'FINALIZADA')::text
UNION ALL
SELECT '📊 Contratos EN_EJECUCION', (SELECT COUNT(*) FROM obras_ejecucion WHERE estado = 'EN_EJECUCION')::text
UNION ALL
SELECT '📊 Contratos EN_SUPERVISION', (SELECT COUNT(*) FROM obras_supervision WHERE estado = 'EN_SUPERVISION')::text
UNION ALL
SELECT '📊 Contratos PROGRAMADA', (SELECT COUNT(*) FROM obras_ejecucion WHERE estado = 'PROGRAMADA')::text
UNION ALL
SELECT '📊 Contratos FINALIZADA', (SELECT COUNT(*) FROM obras_ejecucion WHERE estado = 'FINALIZADA')::text;

-- Análisis de montos y avances
SELECT 
    'ANÁLISIS FINANCIERO' as seccion,
    '==================' as separador
UNION ALL
SELECT 'CONCEPTO', 'VALOR'
UNION ALL
SELECT '💰 Monto Total Contratos Ejecución', 'S/ ' || TO_CHAR(SUM(monto_contrato), 'FM999,999,999.00') FROM obras_ejecucion
UNION ALL
SELECT '💰 Monto Ejecutado Total', 'S/ ' || TO_CHAR(SUM(monto_ejecutado), 'FM999,999,999.00') FROM obras_ejecucion
UNION ALL
SELECT '💰 Monto Total Supervisión', 'S/ ' || TO_CHAR(SUM(monto_contrato), 'FM999,999,999.00') FROM obras_supervision
UNION ALL
SELECT '📈 Avance Promedio Ejecución', ROUND(AVG(porcentaje_avance), 2)::text || '%' FROM obras_ejecucion WHERE porcentaje_avance > 0
UNION ALL
SELECT '📈 Avance Promedio Supervisión', ROUND(AVG(porcentaje_avance), 2)::text || '%' FROM obras_supervision WHERE porcentaje_avance > 0;

-- Verificación de relaciones
SELECT 
    'VERIFICACIÓN DE RELACIONES' as seccion,
    '=========================' as separador
UNION ALL
SELECT 'RELACIÓN', 'ESTADO'
UNION ALL
SELECT '🔗 Obras con Ejecución', (SELECT COUNT(DISTINCT obra_id) FROM obras_ejecucion)::text
UNION ALL
SELECT '🔗 Obras con Supervisión', (SELECT COUNT(DISTINCT obra_id) FROM obras_supervision)::text
UNION ALL
SELECT '🔗 Obras con Ambos Contratos', (
    SELECT COUNT(DISTINCT oe.obra_id) 
    FROM obras_ejecucion oe 
    INNER JOIN obras_supervision os ON oe.obra_id = os.obra_id
)::text
UNION ALL
SELECT '🔗 Empresas con Contratos Ejecución', (SELECT COUNT(DISTINCT empresa_ejecutora_id) FROM obras_ejecucion WHERE empresa_ejecutora_id IS NOT NULL)::text
UNION ALL
SELECT '🔗 Empresas con Contratos Supervisión', (SELECT COUNT(DISTINCT empresa_supervisora_id) FROM obras_supervision WHERE empresa_supervisora_id IS NOT NULL)::text;

SELECT 
    '✅ SISTEMA COMPLETO Y FUNCIONAL' as mensaje_final,
    '✅ Frontend tendrá datos abundantes en todos los módulos' as frontend_status,
    '✅ Datos realistas para demostración completa' as demo_status;

COMMIT;