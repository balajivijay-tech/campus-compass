import { NextResponse } from 'next/server';
import { PrismaClient, ExperienceLevel } from '@prisma/client';
import { subMonths, format } from 'date-fns';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const regionName = searchParams.get('region') || 'San Francisco Bay Area';
    const timeframe = searchParams.get('timeframe') || '12m';

    const months = { '3m': 3, '6m': 6, '12m': 12 }[timeframe] || 12;
    const startDate = subMonths(new Date(), months);

    const region = await prisma.region.findUnique({
      where: { name: regionName },
    });

    if (!region) {
      return NextResponse.json({ message: 'Region not found' }, { status: 404 });
    }

    // Hiring Velocity (monthly count)
    const jobs = await prisma.job.findMany({
      where: {
        regionId: region.id,
        postedAt: { gte: startDate },
      },
      select: { postedAt: true },
    });

    const monthlyCounts: Record<string, number> = {};
    for (let i = 0; i < months; i++) {
        const month = format(subMonths(new Date(), i), 'MMM yyyy');
        monthlyCounts[month] = 0;
    }

    jobs.forEach(job => {
        const month = format(job.postedAt, 'MMM yyyy');
        if(monthlyCounts.hasOwnProperty(month)) {
            monthlyCounts[month]++;
        }
    });

    const hiringVelocityLabels = Object.keys(monthlyCounts).reverse();
    const hiringVelocityData = Object.values(monthlyCounts).reverse();

    // Industry Distribution
    const industryData = await prisma.industry.findMany({
      select: {
        name: true,
        _count: {
          select: {
            companies: {
              where: {
                jobs: {
                  some: {
                    regionId: region.id,
                    postedAt: { gte: startDate },
                  },
                },
              },
            },
          },
        },
      },
    });

    const industryDistribution = {
      labels: industryData.map(i => i.name),
      data: industryData.map(i => i._count.companies),
    };

    // Experience Level
    const experienceLevelData = await prisma.job.groupBy({
      by: ['experienceLevel'],
      where: {
        regionId: region.id,
        postedAt: { gte: startDate },
      },
      _count: {
        id: true,
      },
    });

    const experienceLevel = {
      labels: experienceLevelData.map(d => d.experienceLevel.charAt(0).toUpperCase() + d.experienceLevel.slice(1).toLowerCase()),
      data: experienceLevelData.map(d => d._count.id),
    };

    // Top Roles
    const topRolesData = await prisma.job.groupBy({
      by: ['title'],
      where: {
        regionId: region.id,
        postedAt: { gte: startDate },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    });

    const topRoles = topRolesData.map(r => ({ title: r.title, openings: r._count.id }));

    // Top Employers
    const topEmployersData = await prisma.company.findMany({
      where: {
        regionId: region.id,
        jobs: {
          some: {
            postedAt: { gte: startDate },
          },
        },
      },
      select: {
        name: true,
        _count: {
          select: {
            jobs: {
              where: {
                postedAt: { gte: startDate },
              },
            },
          },
        },
      },
      orderBy: {
        jobs: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    const topEmployers = topEmployersData.map(c => ({ name: c.name, openings: c._count.jobs }));

    return NextResponse.json({
      hiringVelocity: { labels: hiringVelocityLabels, data: hiringVelocityData },
      industryDistribution,
      experienceLevel,
      topRoles,
      topEmployers,
    });
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch dashboard stats.', error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}