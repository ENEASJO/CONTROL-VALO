import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://qsdvigsfhqoixnhiyhgj.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZHZpZ3NmaHFvaXhuaGl5aGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NzY1MzQsImV4cCI6MjA2OTA1MjUzNH0.G_1QY8sTY0B_Pvg2zP7tHlsUtnfbWQUCWSRjEB2yAcc'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos para las tablas de Supabase
export interface Empresa {
  id: number
  ruc: string
  razon_social: string
  nombre_comercial?: string
  direccion?: string
  telefono?: string
  email?: string
  representante_legal?: string
  es_consorcio: boolean
  estado: string
  created_at: string
  updated_at: string
}

export interface ObraEjecucion {
  id: number
  nombre_obra: string
  numero_contrato: string
  numero_expediente?: string
  periodo_valorizado?: string
  fecha_inicio: string
  plazo_ejecucion: number
  empresa_ejecutora_id?: number
  descripcion?: string
  ubicacion?: string
  monto_contrato?: number
  estado: string
  created_at: string
  updated_at: string
  empresas?: Empresa
}

export interface ObraSupervision {
  id: number
  nombre_obra: string
  numero_contrato: string
  numero_expediente?: string
  periodo_valorizado?: string
  fecha_inicio: string
  plazo_ejecucion: number
  empresa_supervisora_id?: number
  descripcion?: string
  ubicacion?: string
  monto_contrato?: number
  estado: string
  created_at: string
  updated_at: string
  empresas?: Empresa
}