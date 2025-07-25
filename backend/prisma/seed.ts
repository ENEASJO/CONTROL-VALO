import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar datos existentes
  await prisma.profesionalEjecucion.deleteMany()
  await prisma.profesionalSupervision.deleteMany()
  await prisma.obraEjecucion.deleteMany()
  await prisma.obraSupervision.deleteMany()
  await prisma.empresa.deleteMany()

  // Crear empresas de ejemplo
  const empresas = await Promise.all([
    prisma.empresa.create({
      data: {
        nombre: 'Constructora San Martín S.A.C.',
        ruc: '20123456789',
        telefono: '01-234-5678',
        esConsorcio: false
      }
    }),
    prisma.empresa.create({
      data: {
        nombre: 'Consorcio Vial Norte',
        ruc: '20987654321',
        telefono: '01-876-5432',
        esConsorcio: true,
        integrantesConsorcio: {
          create: [
            {
              nombre: 'Constructora Lima S.A.',
              ruc: '20111222333',
              porcentajeParticipacion: 60.0
            },
            {
              nombre: 'Ingeniería del Norte E.I.R.L.',
              ruc: '20444555666',
              porcentajeParticipacion: 40.0
            }
          ]
        }
      }
    }),
    prisma.empresa.create({
      data: {
        nombre: 'Supervisión Técnica del Perú S.A.',
        ruc: '20456789123',
        telefono: '01-555-0123',
        esConsorcio: false
      }
    }),
    prisma.empresa.create({
      data: {
        nombre: 'Consorcio Infraestructura Sur',
        ruc: '20789123456',
        telefono: '044-123-456',
        esConsorcio: true,
        integrantesConsorcio: {
          create: [
            {
              nombre: 'Obras Civiles del Sur S.A.C.',
              ruc: '20777888999',
              porcentajeParticipacion: 45.0
            },
            {
              nombre: 'Constructora Arequipa S.R.L.',
              ruc: '20666777888',
              porcentajeParticipacion: 35.0
            },
            {
              nombre: 'Ingeniería Especializada S.A.',
              ruc: '20555666777',
              porcentajeParticipacion: 20.0
            }
          ]
        }
      }
    })
  ])

  console.log(`✅ Creadas ${empresas.length} empresas`)

  // Crear obras de ejecución de ejemplo
  const obraEjecucion1 = await prisma.obraEjecucion.create({
    data: {
      nombreObra: 'Construcción de Puente Peatonal Los Olivos',
      numeroContrato: 'CONT-EJE-2024-001',
      numeroExpediente: 'EXP-2024-001',
      periodoValorizado: 'Enero 2024',
      fechaInicio: new Date('2024-01-15'),
      plazoEjecucion: 180,
      empresaEjecutoraId: empresas[0].id,
      empresaSupervisoraId: empresas[2].id
    }
  })

  const obraEjecucion2 = await prisma.obraEjecucion.create({
    data: {
      nombreObra: 'Pavimentación Av. Los Incas - Sector 3',
      numeroContrato: 'CONT-EJE-2024-002',
      numeroExpediente: 'EXP-2024-002',
      periodoValorizado: 'Febrero 2024',
      fechaInicio: new Date('2024-02-01'),
      plazoEjecucion: 120,
      empresaEjecutoraId: empresas[3].id,
      empresaSupervisoraId: empresas[1].id
    }
  })

  // Crear obras de supervisión de ejemplo
  const obraSupervision1 = await prisma.obraSupervision.create({
    data: {
      nombreObra: 'Supervisión Edificio Multifamiliar San Borja',
      numeroContrato: 'CONT-SUP-2024-001',
      numeroExpediente: 'EXP-SUP-2024-001',
      periodoValorizado: 'Enero 2024',
      fechaInicio: new Date('2024-01-10'),
      plazoEjecucion: 240,
      empresaEjecutoraId: empresas[1].id,
      empresaSupervisoraId: empresas[2].id
    }
  })

  console.log('✅ Creadas obras de ejemplo')

  // Crear profesionales para obra de ejecución 1
  await Promise.all([
    prisma.profesionalEjecucion.create({
      data: {
        obraId: obraEjecucion1.id,
        nombreCompleto: 'Ing. Carlos Mendoza Ríos',
        cargo: 'Residente de Obra',
        porcentajeParticipacion: 40.00
      }
    }),
    prisma.profesionalEjecucion.create({
      data: {
        obraId: obraEjecucion1.id,
        nombreCompleto: 'Ing. María González Vega',
        cargo: 'Asistente Técnico',
        porcentajeParticipacion: 30.00
      }
    }),
    prisma.profesionalEjecucion.create({
      data: {
        obraId: obraEjecucion1.id,
        nombreCompleto: 'Arq. Luis Fernández Castro',
        cargo: 'Supervisor de Calidad',
        porcentajeParticipacion: 30.00
      }
    })
  ])

  // Crear profesionales para obra de ejecución 2
  await Promise.all([
    prisma.profesionalEjecucion.create({
      data: {
        obraId: obraEjecucion2.id,
        nombreCompleto: 'Ing. Ana Torres Morales',
        cargo: 'Jefe de Proyecto',
        porcentajeParticipacion: 50.00
      }
    }),
    prisma.profesionalEjecucion.create({
      data: {
        obraId: obraEjecucion2.id,
        nombreCompleto: 'Ing. Roberto Silva Paz',
        cargo: 'Especialista en Pavimentos',
        porcentajeParticipacion: 50.00
      }
    })
  ])

  // Crear profesionales para obra de supervisión
  await Promise.all([
    prisma.profesionalSupervision.create({
      data: {
        obraId: obraSupervision1.id,
        nombreCompleto: 'Ing. Patricia Herrera Lima',
        cargo: 'Supervisor Principal',
        porcentajeParticipacion: 60.00
      }
    }),
    prisma.profesionalSupervision.create({
      data: {
        obraId: obraSupervision1.id,
        nombreCompleto: 'Ing. Jorge Ramírez Soto',
        cargo: 'Supervisor de Estructuras',
        porcentajeParticipacion: 40.00
      }
    })
  ])

  console.log('✅ Creados profesionales de ejemplo')
  console.log('🎉 Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })