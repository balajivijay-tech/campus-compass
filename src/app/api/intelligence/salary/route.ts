import { NextResponse } from 'next/server';
import { PrismaClient, ExperienceLevel } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const regionName = searchParams.get('city');
    const roleTitle = searchParams.get('role');
    const experienceLevel = searchParams.get('experience') as ExperienceLevel;

    if (!regionName || !roleTitle || !experienceLevel) {
      return NextResponse.json({ message: 'Missing required query parameters' }, { status: 400 });
    }

    const region = await prisma.region.findUnique({ where: { name: regionName } });
    if (!region) {
      return NextResponse.json({ message: 'Region not found' }, { status: 404 });
    }

    const role = await prisma.role.findFirst({ where: { title: roleTitle, experienceLevel: experienceLevel } });
    if (!role) {
      return NextResponse.json({ message: 'Role not found' }, { status: 404 });
    }

    const salaryData = await prisma.job.aggregate({
      where: {
        regionId: region.id,
        roleId: role.id,
        experienceLevel: experienceLevel,
        salaryMin: { not: null },
        salaryMax: { not: null },
      },
      _avg: {
        salaryMin: true,
        salaryMax: true,
      },
      _min: {
        salaryMin: true,
      },
      _max: {
        salaryMax: true,
      },
    });

    if (salaryData._avg.salaryMin === null) {
        return NextResponse.json(null); // No data available
    }

    const result = {
      min: salaryData._min.salaryMin,
      max: salaryData._max.salaryMax,
      avg: (salaryData._avg.salaryMin! + salaryData._avg.salaryMax!) / 2,
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch salary data.', error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}