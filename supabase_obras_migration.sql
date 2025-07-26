-- Migración para crear el módulo de Obras en Supabase
-- Ejecutar en la consola SQL de Supabase

-- 1. Crear tabla de obras base
CREATE TABLE IF NOT EXISTS obras (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crear índice para búsquedas
CREATE INDEX IF NOT EXISTS idx_obras_nombre ON obras USING gin(to_tsvector('spanish', nombre));

-- 3. Crear trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a la tabla obras
CREATE TRIGGER update_obras_updated_at BEFORE UPDATE ON obras
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Agregar columna obra_id a tabla obras_ejecucion (si existe)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'obras_ejecucion') THEN
        -- Agregar columna obra_id si no existe
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'obras_ejecucion' AND column_name = 'obra_id') THEN
            ALTER TABLE obras_ejecucion ADD COLUMN obra_id BIGINT REFERENCES obras(id);
        END IF;
        
        -- Crear índice
        CREATE INDEX IF NOT EXISTS idx_obras_ejecucion_obra_id ON obras_ejecucion(obra_id);
    END IF;
END $$;

-- 5. Agregar columna obra_id a tabla obras_supervision (si existe)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'obras_supervision') THEN
        -- Agregar columna obra_id si no existe
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'obras_supervision' AND column_name = 'obra_id') THEN
            ALTER TABLE obras_supervision ADD COLUMN obra_id BIGINT REFERENCES obras(id);
        END IF;
        
        -- Crear índice
        CREATE INDEX IF NOT EXISTS idx_obras_supervision_obra_id ON obras_supervision(obra_id);
    END IF;
END $$;

-- 6. Configurar Row Level Security (RLS) - Opcional
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;

-- Política básica para permitir todas las operaciones (ajustar según necesidades de seguridad)
CREATE POLICY "Enable all operations for obras" ON obras
    FOR ALL USING (true) WITH CHECK (true);

-- 7. Insertar datos de ejemplo (opcional)
INSERT INTO obras (nombre) VALUES 
    ('Construcción de Puente Metropolitano'),
    ('Mejoramiento de Carretera Central'),
    ('Ampliación de Hospital Nacional')
ON CONFLICT DO NOTHING;

-- 8. Crear vista para estadísticas
CREATE OR REPLACE VIEW obras_stats AS
SELECT 
    COUNT(*) as total_obras,
    COUNT(oe.obra_id) as obras_con_ejecucion,
    COUNT(os.obra_id) as obras_con_supervision,
    COUNT(CASE WHEN oe.obra_id IS NOT NULL AND os.obra_id IS NOT NULL THEN 1 END) as obras_completas,
    COUNT(CASE WHEN oe.obra_id IS NOT NULL AND os.obra_id IS NULL THEN 1 END) as obras_solo_ejecucion,
    COUNT(CASE WHEN oe.obra_id IS NULL AND os.obra_id IS NOT NULL THEN 1 END) as obras_solo_supervision,
    COUNT(CASE WHEN oe.obra_id IS NULL AND os.obra_id IS NULL THEN 1 END) as obras_sin_asignar
FROM obras o
LEFT JOIN obras_ejecucion oe ON o.id = oe.obra_id
LEFT JOIN obras_supervision os ON o.id = os.obra_id;

-- Comentarios para documentación
COMMENT ON TABLE obras IS 'Tabla principal de obras base del sistema';
COMMENT ON COLUMN obras.nombre IS 'Nombre descriptivo de la obra';
COMMENT ON VIEW obras_stats IS 'Vista con estadísticas de las obras y su estado de asignación';