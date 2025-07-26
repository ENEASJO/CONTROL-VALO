-- SCRIPT CON VALORES DE ESTADO SEGUROS
-- Usar valores comunes que suelen estar permitidos

-- 1. Primero insertar empresas
INSERT INTO empresas (ruc, razon_social, nombre_comercial, direccion, telefono, email, representante_legal, es_consorcio, estado) VALUES
('20123456789', 'CONSTRUCTORA LIMA SAC', 'Constructora Lima', 'Av. Javier Prado 1234, San Isidro', '01-2345678', 'info@constructoralima.com', 'Juan Pérez García', false, 'ACTIVO'),
('20987654321', 'INGENIERÍA Y CONSTRUCCIÓN DEL PERÚ EIRL', 'IC Perú', 'Av. Arequipa 5678, Miraflores', '01-8765432', 'contacto@icperu.com', 'María González López', false, 'ACTIVO'),
('20456789123', 'CONSORCIO INFRAESTRUCTURA MODERNA', 'Consorcio IM', 'Av. El Sol 999, San Borja', '01-4567891', 'gerencia@consorcioim.com', 'Carlos Ruiz Mendoza', true, 'ACTIVO'),
('20789123456', 'SUPERVISION TÉCNICA AVANZADA SAC', 'STA SAC', 'Jr. Lampa 456, Lima', '01-7891234', 'supervision@sta.com.pe', 'Ana Torres Silva', false, 'ACTIVO'),
('20321654987', 'EMPRESA SUPERVISORA INTEGRAL EIRL', 'ESI EIRL', 'Av. República de Panamá 2345, San Isidro', '01-3216549', 'integral@esi.com.pe', 'Roberto Vega Castro', false, 'ACTIVO')
ON CONFLICT (ruc) DO NOTHING;

-- 2. Insertar obras base
DO $$
DECLARE
    obra_id_1 INTEGER;
    obra_id_2 INTEGER;
    obra_id_3 INTEGER;
    obra_id_4 INTEGER;
    obra_id_5 INTEGER;
BEGIN
    -- Insertar obras y obtener IDs
    INSERT INTO obras (nombre) VALUES ('MEJORAMIENTO DE INFRAESTRUCTURA VIAL SECTOR NORTE')
    ON CONFLICT DO NOTHING;
    SELECT id INTO obra_id_1 FROM obras WHERE nombre = 'MEJORAMIENTO DE INFRAESTRUCTURA VIAL SECTOR NORTE';
    
    INSERT INTO obras (nombre) VALUES ('CONSTRUCCIÓN DE CENTRO DE SALUD TIPO II')
    ON CONFLICT DO NOTHING;
    SELECT id INTO obra_id_2 FROM obras WHERE nombre = 'CONSTRUCCIÓN DE CENTRO DE SALUD TIPO II';
    
    INSERT INTO obras (nombre) VALUES ('AMPLIACIÓN DE SISTEMA DE AGUA POTABLE')
    ON CONFLICT DO NOTHING;
    SELECT id INTO obra_id_3 FROM obras WHERE nombre = 'AMPLIACIÓN DE SISTEMA DE AGUA POTABLE';
    
    INSERT INTO obras (nombre) VALUES ('REHABILITACIÓN DE INSTITUCIÓN EDUCATIVA PRIMARIA')
    ON CONFLICT DO NOTHING;
    SELECT id INTO obra_id_4 FROM obras WHERE nombre = 'REHABILITACIÓN DE INSTITUCIÓN EDUCATIVA PRIMARIA';
    
    INSERT INTO obras (nombre) VALUES ('CONSTRUCCIÓN DE PUENTE VEHICULAR')
    ON CONFLICT DO NOTHING;
    SELECT id INTO obra_id_5 FROM obras WHERE nombre = 'CONSTRUCCIÓN DE PUENTE VEHICULAR';

    -- 3. Insertar obras_ejecucion con estados seguros
    IF NOT EXISTS (SELECT 1 FROM obras_ejecucion WHERE numero_contrato = 'CONTR-EJE-2025-001') THEN
        INSERT INTO obras_ejecucion (
            obra_id, numero_contrato, nombre_obra, numero_expediente, periodo_valorizado, 
            fecha_inicio, plazo_ejecucion, empresa_ejecutora_id, monto_contrato, 
            ubicacion, descripcion, estado
        ) VALUES (
            obra_id_1, 'CONTR-EJE-2025-001', 'MEJORAMIENTO DE INFRAESTRUCTURA VIAL SECTOR NORTE', 'EXP-2025-001', '2025-07', 
            '2025-08-01', 180, 1, 850000.00, 
            'Distrito de Villa El Salvador', 'Mejoramiento de 2.5 km de vías con asfalto y veredas', 'ACTIVO'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM obras_ejecucion WHERE numero_contrato = 'CONTR-EJE-2025-002') THEN
        INSERT INTO obras_ejecucion (
            obra_id, numero_contrato, nombre_obra, numero_expediente, periodo_valorizado, 
            fecha_inicio, plazo_ejecucion, empresa_ejecutora_id, monto_contrato, 
            ubicacion, descripcion, estado
        ) VALUES (
            obra_id_2, 'CONTR-EJE-2025-002', 'CONSTRUCCIÓN DE CENTRO DE SALUD TIPO II', 'EXP-2025-002', '2025-07', 
            '2025-09-01', 240, 2, 1200000.00, 
            'Distrito de San Juan de Lurigancho', 'Centro de salud de 800 m2 con consultorios y emergencia', 'PLANIFICACION'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM obras_ejecucion WHERE numero_contrato = 'CONTR-EJE-2025-003') THEN
        INSERT INTO obras_ejecucion (
            obra_id, numero_contrato, nombre_obra, numero_expediente, periodo_valorizado, 
            fecha_inicio, plazo_ejecucion, empresa_ejecutora_id, monto_contrato, 
            ubicacion, descripcion, estado
        ) VALUES (
            obra_id_3, 'CONTR-EJE-2025-003', 'AMPLIACIÓN DE SISTEMA DE AGUA POTABLE', 'EXP-2025-003', '2025-07', 
            '2025-08-15', 150, 3, 650000.00, 
            'Distrito de Ate', 'Ampliación de red para 500 nuevas conexiones', 'ACTIVO'
        );
    END IF;

    -- 4. Insertar obras_supervision con estados seguros
    IF NOT EXISTS (SELECT 1 FROM obras_supervision WHERE numero_contrato = 'CONTR-SUP-2025-001') THEN
        INSERT INTO obras_supervision (
            obra_id, numero_contrato, nombre_obra, numero_expediente, periodo_valorizado, 
            fecha_inicio, plazo_ejecucion, empresa_supervisora_id, monto_contrato, 
            ubicacion, descripcion, estado
        ) VALUES (
            obra_id_1, 'CONTR-SUP-2025-001', 'MEJORAMIENTO DE INFRAESTRUCTURA VIAL SECTOR NORTE', 'EXP-2025-001', '2025-07', 
            '2025-08-01', 180, 4, 85000.00, 
            'Distrito de Villa El Salvador', 'Supervisión de mejoramiento vial', 'ACTIVO'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM obras_supervision WHERE numero_contrato = 'CONTR-SUP-2025-002') THEN
        INSERT INTO obras_supervision (
            obra_id, numero_contrato, nombre_obra, numero_expediente, periodo_valorizado, 
            fecha_inicio, plazo_ejecucion, empresa_supervisora_id, monto_contrato, 
            ubicacion, descripcion, estado
        ) VALUES (
            obra_id_4, 'CONTR-SUP-2025-002', 'REHABILITACIÓN DE INSTITUCIÓN EDUCATIVA PRIMARIA', 'EXP-2025-004', '2025-07', 
            '2025-09-15', 120, 5, 45000.00, 
            'Distrito de Comas', 'Supervisión de rehabilitación de aulas', 'PLANIFICACION'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM obras_supervision WHERE numero_contrato = 'CONTR-SUP-2025-003') THEN
        INSERT INTO obras_supervision (
            obra_id, numero_contrato, nombre_obra, numero_expediente, periodo_valorizado, 
            fecha_inicio, plazo_ejecucion, empresa_supervisora_id, monto_contrato, 
            ubicacion, descripcion, estado
        ) VALUES (
            obra_id_5, 'CONTR-SUP-2025-003', 'CONSTRUCCIÓN DE PUENTE VEHICULAR', 'EXP-2025-005', '2025-07', 
            '2025-10-01', 300, 4, 120000.00, 
            'Distrito de Huarochirí', 'Supervisión de construcción de puente de 50m', 'PLANIFICACION'
        );
    END IF;

    -- Mostrar mensaje de éxito
    RAISE NOTICE 'Datos insertados exitosamente';
    RAISE NOTICE 'obra_id_1: %, obra_id_2: %, obra_id_3: %', obra_id_1, obra_id_2, obra_id_3;

END $$;

-- 5. Verificar resultados
SELECT 'EMPRESAS' as tabla, COUNT(*) as total FROM empresas
UNION ALL
SELECT 'OBRAS' as tabla, COUNT(*) as total FROM obras  
UNION ALL
SELECT 'OBRAS_EJECUCION' as tabla, COUNT(*) as total FROM obras_ejecucion
UNION ALL
SELECT 'OBRAS_SUPERVISION' as tabla, COUNT(*) as total FROM obras_supervision;

-- 6. Mostrar estados utilizados
SELECT 'ESTADOS EN EJECUCION' as info;
SELECT DISTINCT estado FROM obras_ejecucion;

SELECT 'ESTADOS EN SUPERVISION' as info;
SELECT DISTINCT estado FROM obras_supervision;