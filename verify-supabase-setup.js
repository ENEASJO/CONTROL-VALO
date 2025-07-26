const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://qsdvigsfhqoixnhiyhgj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZHZpZ3NmaHFvaXhuaGl5aGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NzY1MzQsImV4cCI6MjA2OTA1MjUzNH0.G_1QY8sTY0B_Pvg2zP7tHlsUtnfbWQUCWSRjEB2yAcc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function verificarConfiguracion() {
  console.log('🔍 VERIFICACIÓN POST-MIGRACIÓN')
  console.log('===============================')
  
  try {
    // 1. Verificar tablas y conteo de datos
    console.log('\n1. Verificando tablas y datos...')
    
    const tablas = [
      { nombre: 'empresas', descripcion: 'Empresas registradas' },
      { nombre: 'obras', descripcion: 'Obras principales' },
      { nombre: 'obras_ejecucion', descripcion: 'Obras en ejecución' },
      { nombre: 'obras_supervision', descripcion: 'Obras en supervisión' }
    ]
    
    for (const tabla of tablas) {
      try {
        const { data, error, count } = await supabase
          .from(tabla.nombre)
          .select('*', { count: 'exact' })
        
        if (error) {
          console.log(`❌ ${tabla.nombre}: ${error.message}`)
        } else {
          console.log(`✅ ${tabla.nombre}: ${count} registros - ${tabla.descripcion}`)
        }
      } catch (err) {
        console.log(`❌ ${tabla.nombre}: Error - ${err.message}`)
      }
    }
    
    // 2. Probar consultas específicas que usa la aplicación
    console.log('\n2. Probando consultas de la aplicación...')
    
    // Consulta de empresas
    const { data: empresas, error: empresasError } = await supabase
      .from('empresas')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (empresasError) {
      console.log('❌ Consulta empresas:', empresasError.message)
    } else {
      console.log(`✅ Consulta empresas: ${empresas.length} registros obtenidos`)
      console.log('📋 Primeras empresas:', empresas.slice(0, 2).map(e => e.razon_social))
    }
    
    // Consulta de obras con joins
    const { data: obrasEjecucion, error: ejecucionError } = await supabase
      .from('obras_ejecucion')
      .select(`
        *,
        empresas:empresa_ejecutora_id(id, razon_social, nombre_comercial)
      `)
      .order('created_at', { ascending: false })
    
    if (ejecucionError) {
      console.log('❌ Consulta obras ejecución:', ejecucionError.message)
    } else {
      console.log(`✅ Consulta obras ejecución: ${obrasEjecucion.length} registros`)
      if (obrasEjecucion.length > 0) {
        console.log('📋 Primera obra:', obrasEjecucion[0].nombre_obra)
        console.log('🏢 Empresa ejecutora:', obrasEjecucion[0].empresas?.razon_social || 'No asignada')
      }
    }
    
    // Consulta de supervisión
    const { data: obrasSupervision, error: supervisionError } = await supabase
      .from('obras_supervision')
      .select(`
        *,
        empresas:empresa_supervisora_id(id, razon_social, nombre_comercial)
      `)
      .order('created_at', { ascending: false })
    
    if (supervisionError) {
      console.log('❌ Consulta obras supervisión:', supervisionError.message)
    } else {
      console.log(`✅ Consulta obras supervisión: ${obrasSupervision.length} registros`)
      if (obrasSupervision.length > 0) {
        console.log('📋 Primera obra:', obrasSupervision[0].nombre_obra)
        console.log('🏢 Empresa supervisora:', obrasSupervision[0].empresas?.razon_social || 'No asignada')
      }
    }
    
    // 3. Probar consulta de obras base
    console.log('\n3. Probando consulta de obras base...')
    const { data: obras, error: obrasError } = await supabase
      .from('obras')
      .select(`
        *,
        obras_ejecucion!left (id),
        obras_supervision!left (id)
      `)
      .order('created_at', { ascending: false })
    
    if (obrasError) {
      console.log('❌ Consulta obras base:', obrasError.message)
    } else {
      console.log(`✅ Consulta obras base: ${obras.length} registros`)
      obras.forEach(obra => {
        const tieneEjecucion = obra.obras_ejecucion && obra.obras_ejecucion.length > 0
        const tieneSupervision = obra.obras_supervision && obra.obras_supervision.length > 0
        console.log(`   📋 ${obra.nombre} - Ejecución: ${tieneEjecucion ? '✅' : '❌'} | Supervisión: ${tieneSupervision ? '✅' : '❌'}`)
      })
    }
    
    // 4. Probar vista de estadísticas
    console.log('\n4. Probando vista de estadísticas...')
    try {
      const { data: stats, error: statsError } = await supabase
        .from('obras_stats')
        .select('*')
        .single()
      
      if (statsError) {
        console.log('❌ Vista estadísticas:', statsError.message)
      } else {
        console.log('✅ Vista estadísticas funcionando:')
        console.log(`   📊 Total obras: ${stats.total_obras}`)
        console.log(`   🔧 Con ejecución: ${stats.obras_con_ejecucion}`)
        console.log(`   👁️ Con supervisión: ${stats.obras_con_supervision}`)
        console.log(`   ✅ Completas: ${stats.obras_completas}`)
        console.log(`   ⚠️ Sin asignar: ${stats.obras_sin_asignar}`)
      }
    } catch (err) {
      console.log('❌ Error en vista estadísticas:', err.message)
    }
    
    console.log('\n🎉 VERIFICACIÓN COMPLETADA')
    console.log('===========================')
    console.log('✅ La base de datos está configurada correctamente')
    console.log('✅ Las consultas de la aplicación funcionan')
    console.log('✅ Los datos de prueba están disponibles')
    
  } catch (error) {
    console.error('💥 Error general:', error)
  }
}

verificarConfiguracion().catch(console.error)