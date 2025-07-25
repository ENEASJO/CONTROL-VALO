# Documento de Requisitos - Control de Valorizaciones de Obras

## Introducción

El sistema de Control de Valorizaciones de Obras es una aplicación web diseñada para gestionar y registrar las valorizaciones tanto de ejecución como de supervisión de proyectos de construcción. El sistema permitirá a los usuarios registrar, consultar y administrar información detallada sobre obras, incluyendo datos contractuales, empresas involucradas, personal profesional y sus respectivas participaciones.

## Requisitos

### Requisito 1

**Historia de Usuario:** Como administrador de obras, quiero registrar información básica de proyectos de construcción, para poder llevar un control organizado de todas las obras en ejecución.

#### Criterios de Aceptación

1. CUANDO el usuario acceda al módulo de registro ENTONCES el sistema DEBERÁ mostrar un formulario con los campos: nombre de la obra, número de contrato, número de expediente, período valorizado, fecha de inicio y plazo de ejecución
2. CUANDO el usuario complete todos los campos obligatorios ENTONCES el sistema DEBERÁ validar que los datos sean correctos antes de permitir el guardado
3. CUANDO se ingrese un número de contrato ENTONCES el sistema DEBERÁ verificar que sea único en el sistema
4. CUANDO se ingrese una fecha de inicio ENTONCES el sistema DEBERÁ validar que sea una fecha válida y no futura

### Requisito 2

**Historia de Usuario:** Como administrador de obras, quiero registrar las empresas ejecutoras y supervisoras de cada proyecto, para poder identificar claramente los responsables de cada obra.

#### Criterios de Aceptación

1. CUANDO el usuario registre una obra ENTONCES el sistema DEBERÁ permitir seleccionar o registrar la empresa ejecutora
2. CUANDO el usuario registre una obra ENTONCES el sistema DEBERÁ permitir seleccionar o registrar la empresa supervisora
3. CUANDO se registre una nueva empresa ENTONCES el sistema DEBERÁ solicitar nombre, RUC y datos de contacto
4. CUANDO se seleccione una empresa existente ENTONCES el sistema DEBERÁ mostrar sus datos para confirmación

### Requisito 3

**Historia de Usuario:** Como administrador de obras, quiero registrar el plantel profesional con sus cargos y porcentajes de participación, para poder documentar la estructura del equipo técnico.

#### Criterios de Aceptación

1. CUANDO el usuario registre profesionales ENTONCES el sistema DEBERÁ permitir agregar múltiples profesionales por obra
2. CUANDO se agregue un profesional ENTONCES el sistema DEBERÁ solicitar nombre completo, cargo y porcentaje de participación
3. CUANDO se ingrese un porcentaje de participación ENTONCES el sistema DEBERÁ validar que sea un número entre 0 y 100
4. CUANDO se registren múltiples profesionales ENTONCES el sistema DEBERÁ validar que la suma de porcentajes no exceda el 100%
5. CUANDO se elimine un profesional ENTONCES el sistema DEBERÁ recalcular automáticamente los porcentajes restantes

### Requisito 4

**Historia de Usuario:** Como usuario del sistema, quiero tener módulos separados para ejecución y supervisión, para poder gestionar independientemente cada tipo de valorización.

#### Criterios de Aceptación

1. CUANDO el usuario acceda al sistema ENTONCES el sistema DEBERÁ mostrar dos módulos claramente diferenciados: "Ejecución" y "Supervisión"
2. CUANDO el usuario seleccione el módulo de ejecución ENTONCES el sistema DEBERÁ mostrar solo los registros y formularios relacionados con ejecución de obras
3. CUANDO el usuario seleccione el módulo de supervisión ENTONCES el sistema DEBERÁ mostrar solo los registros y formularios relacionados con supervisión de obras
4. CUANDO se registre información en un módulo ENTONCES el sistema DEBERÁ mantener los datos independientes del otro módulo
5. CUANDO se navegue entre módulos ENTONCES el sistema DEBERÁ mantener el contexto y estado de cada módulo por separado

### Requisito 5

**Historia de Usuario:** Como usuario del sistema, quiero una interfaz elegante y moderna, para poder trabajar de manera eficiente y agradable.

#### Criterios de Aceptación

1. CUANDO el usuario acceda al sistema ENTONCES el sistema DEBERÁ mostrar una interfaz con diseño moderno y responsivo
2. CUANDO el usuario interactúe con formularios ENTONCES el sistema DEBERÁ proporcionar retroalimentación visual clara (validaciones, estados de carga, confirmaciones)
3. CUANDO el usuario navegue por el sistema ENTONCES el sistema DEBERÁ mantener una experiencia de usuario consistente en todas las pantallas
4. CUANDO el sistema se visualice en diferentes dispositivos ENTONCES el sistema DEBERÁ adaptarse correctamente a diferentes tamaños de pantalla
5. CUANDO se muestren listas de datos ENTONCES el sistema DEBERÁ incluir funcionalidades de búsqueda, filtrado y paginación

### Requisito 6

**Historia de Usuario:** Como administrador de obras, quiero consultar y gestionar los registros existentes, para poder revisar, actualizar o eliminar información de obras cuando sea necesario.

#### Criterios de Aceptación

1. CUANDO el usuario acceda a la lista de obras ENTONCES el sistema DEBERÁ mostrar todas las obras registradas con información resumida
2. CUANDO el usuario seleccione una obra específica ENTONCES el sistema DEBERÁ mostrar todos los detalles de la obra incluyendo empresas y profesionales
3. CUANDO el usuario solicite editar una obra ENTONCES el sistema DEBERÁ cargar el formulario con los datos actuales para modificación
4. CUANDO el usuario solicite eliminar una obra ENTONCES el sistema DEBERÁ solicitar confirmación antes de proceder
5. CUANDO se realicen cambios en una obra ENTONCES el sistema DEBERÁ registrar la fecha y hora de la última modificación

### Requisito 7

**Historia de Usuario:** Como usuario del sistema, quiero que los datos se validen correctamente, para evitar errores en la información registrada.

#### Criterios de Aceptación

1. CUANDO se ingresen datos en cualquier campo ENTONCES el sistema DEBERÁ validar el formato y tipo de dato correspondiente
2. CUANDO se detecte un error de validación ENTONCES el sistema DEBERÁ mostrar mensajes de error claros y específicos
3. CUANDO se intente guardar un registro incompleto ENTONCES el sistema DEBERÁ impedir el guardado y resaltar los campos faltantes
4. CUANDO se ingresen fechas ENTONCES el sistema DEBERÁ validar que sean fechas válidas y lógicas (fecha de inicio no posterior al plazo de ejecución)
5. CUANDO se ingresen números ENTONCES el sistema DEBERÁ validar que sean valores numéricos válidos y dentro de rangos apropiados

### Requisito 8

**Historia de Usuario:** Como usuario del sistema, quiero generar reportes de las obras registradas, para poder imprimir y compartir la información con mi equipo de trabajo.

#### Criterios de Aceptación

1. CUANDO el usuario solicite un reporte ENTONCES el sistema DEBERÁ permitir seleccionar el tipo de reporte (ejecución, supervisión o consolidado)
2. CUANDO se genere un reporte ENTONCES el sistema DEBERÁ incluir toda la información relevante: datos de obra, empresas, profesionales y porcentajes
3. CUANDO se visualice un reporte ENTONCES el sistema DEBERÁ mostrar el contenido en formato optimizado para impresión
4. CUANDO el usuario solicite imprimir ENTONCES el sistema DEBERÁ generar un documento PDF descargable
5. CUANDO se genere un reporte consolidado ENTONCES el sistema DEBERÁ incluir datos de ambos módulos (ejecución y supervisión)
6. CUANDO se apliquen filtros ENTONCES el sistema DEBERÁ permitir generar reportes por rango de fechas, empresa o estado de obra

### Requisito 9

**Historia de Usuario:** Como miembro del equipo de trabajo, quiero acceder a todos los registros del sistema, para poder consultar y descargar información registrada por otros usuarios.

#### Criterios de Aceptación

1. CUANDO cualquier usuario acceda al sistema ENTONCES el sistema DEBERÁ mostrar todos los registros sin restricciones de usuario
2. CUANDO se visualicen los registros ENTONCES el sistema DEBERÁ mostrar quién y cuándo se creó cada registro
3. CUANDO se descargue información ENTONCES el sistema DEBERÁ permitir exportar datos en formato Excel o PDF
4. CUANDO se consulten registros ENTONCES el sistema DEBERÁ mantener un historial de accesos para auditoría
5. CUANDO se modifique un registro ENTONCES el sistema DEBERÁ registrar quién realizó la modificación y cuándo