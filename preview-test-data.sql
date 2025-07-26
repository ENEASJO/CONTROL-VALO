-- =====================================================
-- PREVIEW DE DATOS DE PRUEBA QUE SE VAN A CREAR
-- Sistema de Control de Valorizaciones de Obras
-- =====================================================
--
-- Este script muestra exactamente qué datos se van a crear
-- sin ejecutar ninguna inserción. Es solo para verificación.
--
-- =====================================================

SELECT 'PREVIEW DE DATOS QUE SE CREARÁN EN EL SISTEMA' as titulo;

-- =====================================================
-- MÓDULO EMPRESAS - 10 empresas variadas
-- =====================================================
SELECT 
    'MÓDULO EMPRESAS - Se crearán 10 empresas' as seccion,
    '==========================================' as separador
UNION ALL
SELECT 'TIPO', 'EMPRESA'
UNION ALL
SELECT 'Constructora', 'CONSTRUCTORA METROPOLITANA S.A.C.'
UNION ALL
SELECT 'Consorcio', 'CONSORCIO OBRAS MAYORES'
UNION ALL
SELECT 'Constructora', 'CONSTRUCTORA NORTE PACÍFICO S.A.'
UNION ALL
SELECT 'Constructora', 'INGENIERÍA Y CONSTRUCCIÓN ANDINA S.R.L.'
UNION ALL
SELECT 'Consorcio', 'CONSORCIO INFRAESTRUCTURA NACIONAL'
UNION ALL
SELECT 'Constructora', 'CONSTRUCTORA COSTA VERDE S.A.C.'
UNION ALL
SELECT 'Supervisora', 'SUPERVISIÓN ESPECIALIZADA S.A.'
UNION ALL
SELECT 'Supervisora', 'CONTROL Y CALIDAD INGENIEROS S.A.C.'
UNION ALL
SELECT 'Supervisora', 'ASESORÍA TÉCNICA METROPOLITANA S.R.L.'
UNION ALL
SELECT 'Supervisora', 'SUPERVISIÓN Y FISCALIZACIÓN PERÚ S.A.';

-- =====================================================
-- MÓDULO OBRAS - 12 obras de diferentes tipos
-- =====================================================
SELECT 
    '', ''
UNION ALL
SELECT 'MÓDULO OBRAS - Se crearán 12 obras variadas', ''
UNION ALL
SELECT '=========================================', ''
UNION ALL
SELECT 'TIPO', 'OBRA'
UNION ALL
SELECT 'Infraestructura', 'Puente Metropolitano Los Olivos'
UNION ALL
SELECT 'Infraestructura', 'Mejoramiento Carretera Central Tramo 1'
UNION ALL
SELECT 'Infraestructura', 'Viaducto San Juan de Lurigancho'
UNION ALL
SELECT 'Infraestructura', 'Ampliación Autopista Norte'
UNION ALL
SELECT 'Salud', 'Ampliación Hospital Nacional Dos de Mayo'
UNION ALL
SELECT 'Salud', 'Centro de Salud Villa El Salvador'
UNION ALL
SELECT 'Educación', 'I.E. Secundaria San Martín de Porres'
UNION ALL
SELECT 'Educación', 'Mejoramiento I.E. Primaria José Olaya'
UNION ALL
SELECT 'Espacio Público', 'Remodelación Plaza de Armas Pueblo Libre'
UNION ALL
SELECT 'Espacio Público', 'Parque Zonal Villa María del Triunfo'
UNION ALL
SELECT 'Comercial', 'Terminal Terrestre Interprovincial'
UNION ALL
SELECT 'Comercial', 'Mejoramiento Mercado Central';

-- =====================================================
-- MÓDULO EJECUCIÓN - 10 contratos con diferentes estados
-- =====================================================
SELECT 
    '', ''
UNION ALL
SELECT 'MÓDULO EJECUCIÓN - Se crearán 10 contratos', ''
UNION ALL
SELECT '==========================================', ''
UNION ALL
SELECT 'ESTADO', 'AVANCE'
UNION ALL
SELECT 'EN_EJECUCION', '35% - Puente Metropolitano'
UNION ALL
SELECT 'EN_EJECUCION', '60% - Carretera Central'
UNION ALL
SELECT 'EN_EJECUCION', '25% - Hospital Dos de Mayo'
UNION ALL
SELECT 'EN_EJECUCION', '45% - Colegio San Martín'
UNION ALL
SELECT 'EN_EJECUCION', '70% - Plaza Pueblo Libre'
UNION ALL
SELECT 'EN_EJECUCION', '15% - Mercado Central'
UNION ALL
SELECT 'FINALIZADA', '100% - I.E. José Olaya'
UNION ALL
SELECT 'PROGRAMADA', '0% - Viaducto SJL'
UNION ALL
SELECT 'PROGRAMADA', '0% - Centro Salud VES'
UNION ALL
SELECT 'PROGRAMADA', '0% - Autopista Norte';

-- =====================================================
-- MÓDULO SUPERVISIÓN - 10 contratos vinculados
-- =====================================================
SELECT 
    '', ''
UNION ALL
SELECT 'MÓDULO SUPERVISIÓN - Se crearán 10 contratos', ''
UNION ALL
SELECT '=============================================', ''
UNION ALL
SELECT 'ESTADO', 'AVANCE'
UNION ALL
SELECT 'EN_SUPERVISION', '35% - Puente Metropolitano'
UNION ALL
SELECT 'EN_SUPERVISION', '60% - Carretera Central'
UNION ALL
SELECT 'EN_SUPERVISION', '25% - Hospital Dos de Mayo'
UNION ALL
SELECT 'EN_SUPERVISION', '45% - Colegio San Martín'
UNION ALL
SELECT 'EN_SUPERVISION', '70% - Plaza Pueblo Libre'
UNION ALL
SELECT 'EN_SUPERVISION', '15% - Mercado Central'
UNION ALL
SELECT 'FINALIZADA', '100% - I.E. José Olaya'
UNION ALL
SELECT 'PROGRAMADA', '0% - Viaducto SJL'
UNION ALL
SELECT 'PROGRAMADA', '0% - Centro Salud VES'
UNION ALL
SELECT 'PROGRAMADA', '0% - Terminal Terrestre';

-- =====================================================
-- ANÁLISIS FINANCIERO PROYECTADO
-- =====================================================
SELECT 
    '', ''
UNION ALL
SELECT 'ANÁLISIS FINANCIERO PROYECTADO', ''
UNION ALL
SELECT '==============================', ''
UNION ALL
SELECT 'CONCEPTO', 'VALOR APROXIMADO'
UNION ALL
SELECT 'Monto Total Ejecución', 'S/ 30,545,000.00'
UNION ALL
SELECT 'Monto Total Supervisión', 'S/ 1,254,500.00'
UNION ALL
SELECT 'Monto Ejecutado', 'S/ 6,605,000.00'
UNION ALL
SELECT 'Avance Promedio', '34.5%'
UNION ALL
SELECT 'Obras Activas', '6 de 10'
UNION ALL
SELECT 'Obras Finalizadas', '1 de 10'
UNION ALL
SELECT 'Obras Programadas', '3 de 10';

-- =====================================================
-- DISTRIBUCIÓN POR TIPOS DE OBRA
-- =====================================================
SELECT 
    '', ''
UNION ALL
SELECT 'DISTRIBUCIÓN POR TIPOS DE OBRA', ''
UNION ALL
SELECT '==============================', ''
UNION ALL
SELECT 'TIPO', 'CANTIDAD'
UNION ALL
SELECT 'Infraestructura Vial', '4 obras'
UNION ALL
SELECT 'Salud', '2 obras'
UNION ALL
SELECT 'Educación', '2 obras'
UNION ALL
SELECT 'Espacios Públicos', '2 obras'
UNION ALL
SELECT 'Comercial/Servicios', '2 obras';

SELECT 
    '', ''
UNION ALL
SELECT '📋 RESUMEN EJECUTIVO', ''
UNION ALL
SELECT '==================', ''
UNION ALL
SELECT '✅ 10 empresas (6 constructoras + 4 supervisoras)', ''
UNION ALL
SELECT '✅ 12 obras de diferentes tipos y complejidades', ''
UNION ALL
SELECT '✅ 10 contratos de ejecución con estados variados', ''
UNION ALL
SELECT '✅ 10 contratos de supervisión vinculados', ''
UNION ALL
SELECT '✅ Montos realistas desde S/650K hasta S/8.5M', ''
UNION ALL
SELECT '✅ Avances del 0% al 100% para demostración', ''
UNION ALL
SELECT '✅ Fechas coherentes y actuales', ''
UNION ALL
SELECT '✅ Relaciones correctas entre todas las tablas', ''
UNION ALL
SELECT '', ''
UNION ALL
SELECT '🎯 RESULTADO ESPERADO:', ''
UNION ALL
SELECT 'Frontend con datos abundantes en TODOS los módulos', ''
UNION ALL
SELECT 'Sistema listo para demostración completa', '';