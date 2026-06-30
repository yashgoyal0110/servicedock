import { Category, PrismaClient, Status, UploadStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('\nStarting database seed...\n')

  await prisma.product.deleteMany()
  await prisma.logo.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.store.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.user.deleteMany()

  const locations = {
    austin: {
      citySlug: 'austin',
      cityName: 'Austin',
      province: 'Texas',
      latitude: 30.2672,
      longitude: -97.7431,
    },
    denver: {
      citySlug: 'denver',
      cityName: 'Denver',
      province: 'Colorado',
      latitude: 39.7392,
      longitude: -104.9903,
    },
    tampa: {
      citySlug: 'tampa',
      cityName: 'Tampa',
      province: 'Florida',
      latitude: 27.9506,
      longitude: -82.4572,
    },
  } as const

  const stores = [
    {
      name: 'Northline Property Care',
      address: '4108 North Lamar Blvd, Austin, TX',
      phone: '+15125550148',
      description:
        'Residential repair, inspection, and maintenance packages for busy property managers.',
      ...locations.austin,
      slug: 'northline-property-care',
      status: Status.ACTIVE,
      logo: {
        create: {
          name: 'northline-logo',
          key: 'northline-logo',
          url: '/images/service-ops-background.png',
          status: UploadStatus.SUCCESS,
        },
      },
      banner: {
        create: {
          name: 'northline-banner',
          key: 'northline-banner',
          url: '/images/service-ops-background.png',
          status: UploadStatus.SUCCESS,
        },
      },
      user: {
        create: {
          email: 'owner@northline.example',
          name: 'Morgan Lee',
          userId: 'seed_northline',
          imageUrl: 'https://source.unsplash.com/random/150x150?portrait',
        },
      },
      products: {
        create: [
          {
            name: 'HVAC diagnostic visit',
            price: 89,
            description: 'Same-day inspection with written findings.',
            category: Category.Repairs,
          },
          {
            name: 'Leak detection',
            price: 120,
            description: 'Pressure test, camera check, and next-step quote.',
            category: Category.Repairs,
          },
          {
            name: 'Monthly maintenance plan',
            price: 220,
            description: 'Filters, safety checks, and priority scheduling.',
            category: Category.Plans,
          },
          {
            name: 'Photo report add-on',
            price: 35,
            description: 'Before and after proof for property managers.',
            category: Category.AddOns,
          },
        ],
      },
    },
    {
      name: 'Peak Home Systems',
      address: '1550 Wewatta St, Denver, CO',
      phone: '+13035550182',
      description:
        'Appliance, electrical, and seasonal home-system services with clear packaged pricing.',
      ...locations.denver,
      slug: 'peak-home-systems',
      status: Status.ACTIVE,
      logo: {
        create: {
          name: 'peak-logo',
          key: 'peak-logo',
          url: '/images/service-ops-background.png',
          status: UploadStatus.SUCCESS,
        },
      },
      banner: {
        create: {
          name: 'peak-banner',
          key: 'peak-banner',
          url: '/images/service-ops-background.png',
          status: UploadStatus.SUCCESS,
        },
      },
      user: {
        create: {
          email: 'dispatch@peak.example',
          name: 'Riley Carter',
          userId: 'seed_peak',
          imageUrl: 'https://source.unsplash.com/random/150x150?operator',
        },
      },
      products: {
        create: [
          {
            name: 'Appliance troubleshooting',
            price: 95,
            description: 'On-site diagnosis for washers, dryers, and ranges.',
            category: Category.Repairs,
          },
          {
            name: 'Seasonal safety check',
            price: 180,
            description: 'Electrical, HVAC, and water-system checklist.',
            category: Category.Plans,
          },
          {
            name: 'Weekend dispatch',
            price: 75,
            description: 'Priority weekend arrival window.',
            category: Category.AddOns,
          },
        ],
      },
    },
    {
      name: 'Coastal Turnover Crew',
      address: '802 E Whiting St, Tampa, FL',
      phone: '+18135550144',
      description:
        'Move-out cleaning, rental turnover, and inspection packages for short-term rental hosts.',
      ...locations.tampa,
      slug: 'coastal-turnover-crew',
      status: Status.ACTIVE,
      logo: {
        create: {
          name: 'coastal-logo',
          key: 'coastal-logo',
          url: '/images/service-ops-background.png',
          status: UploadStatus.SUCCESS,
        },
      },
      banner: {
        create: {
          name: 'coastal-banner',
          key: 'coastal-banner',
          url: '/images/service-ops-background.png',
          status: UploadStatus.SUCCESS,
        },
      },
      user: {
        create: {
          email: 'hello@coastal.example',
          name: 'Taylor Morgan',
          userId: 'seed_coastal',
          imageUrl: 'https://source.unsplash.com/random/150x150?business',
        },
      },
      products: {
        create: [
          {
            name: 'Move-out clean',
            price: 260,
            description: 'Kitchen, baths, floors, and appliance wipe-down.',
            category: Category.Repairs,
          },
          {
            name: 'Host readiness plan',
            price: 340,
            description: 'Cleaning, linen reset, and final photo checklist.',
            category: Category.Plans,
          },
          {
            name: 'Same-day rush',
            price: 90,
            description: 'Accelerated turnaround for urgent guest arrivals.',
            category: Category.AddOns,
          },
        ],
      },
    },
  ]

  for (const store of stores) {
    const user = await prisma.user.create({
      data: store.user.create,
    })

    const storeData = {
      ...store,
      userId: user.userId,
      user: undefined,
    }

    await prisma.store.create({
      data: storeData,
    })
  }

  const storesCount = await prisma.store.count()
  const productsCount = await prisma.product.count()
  const usersCount = await prisma.user.count()

  console.log(`Seed complete:
  - ${storesCount} locations
  - ${productsCount} services
  - ${usersCount} users
  `)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error('Error seeding the database:', error)
    await prisma.$disconnect()
    process.exit(1)
  })
