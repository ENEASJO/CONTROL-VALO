-- CONFIGURACIÓN DE POLÍTICAS RLS PARA ACCESO PÚBLICO
-- Este script debe ejecutarse en el SQL Editor de Supabase

-- 1. CONFIGURAR POLÍTICAS PARA TABLA OBRAS
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura
CREATE POLICY "Permitir lectura pública de obras" ON obras
FOR SELECT USING (true);

-- Políticas de escritura
CREATE POLICY "Permitir inserción pública de obras" ON obras
FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir actualización pública de obras" ON obras
FOR UPDATE USING (true);

CREATE POLICY "Permitir eliminación pública de obras" ON obras
FOR DELETE USING (true);

-- 2. CONFIGURAR POLÍTICAS PARA TABLA EMPRESAS
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura
CREATE POLICY "Permitir lectura pública de empresas" ON empresas
FOR SELECT USING (true);

-- Políticas de escritura
CREATE POLICY "Permitir inserción pública de empresas" ON empresas
FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir actualización pública de empresas" ON empresas
FOR UPDATE USING (true);

CREATE POLICY "Permitir eliminación pública de empresas" ON empresas
FOR DELETE USING (true);

-- 3. CONFIGURAR POLÍTICAS PARA TABLA OBRAS_EJECUCION
ALTER TABLE obras_ejecucion ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura
CREATE POLICY "Permitir lectura pública de obras_ejecucion" ON obras_ejecucion
FOR SELECT USING (true);

-- Políticas de escritura
CREATE POLICY "Permitir inserción pública de obras_ejecucion" ON obras_ejecucion
FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir actualización pública de obras_ejecucion" ON obras_ejecucion
FOR UPDATE USING (true);

CREATE POLICY "Permitir eliminación pública de obras_ejecucion" ON obras_ejecucion
FOR DELETE USING (true);

-- 4. CONFIGURAR POLÍTICAS PARA TABLA OBRAS_SUPERVISION
ALTER TABLE obras_supervision ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura
CREATE POLICY "Permitir lectura pública de obras_supervision" ON obras_supervision
FOR SELECT USING (true);

-- Políticas de escritura
CREATE POLICY "Permitir inserción pública de obras_supervision" ON obras_supervision
FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir actualización pública de obras_supervision" ON obras_supervision
FOR UPDATE USING (true);

CREATE POLICY "Permitir eliminación pública de obras_supervision" ON obras_supervision
FOR DELETE USING (true);

-- 5. VERIFICAR POLÍTICAS CREADAS
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- NOTA: Ejecuta este script completo en el SQL Editor de Supabase
-- para habilitar el acceso público a todas las tablas