import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search');

    const whereClause = searchTerm
      ? {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        }
      : {};

    const employers = await prisma.company.findMany({
      where: whereClause,
      include: {
        industry: true,
        region: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    const formattedEmployers = employers.map(e => ({
        id: e.id,
        name: e.name,
        industry: e.industry.name,
        region: e.region.name,
        description: e.description,
        website: e.website,
    }));

    return NextResponse.json(formattedEmployers);
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch employers.', error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}