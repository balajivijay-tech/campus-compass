import { NextResponse } from 'next/server';
import { PrismaClient, ExperienceLevel } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('Start seeding ...');

    // Clean up existing data
    await prisma.job.deleteMany();
    await prisma.company.deleteMany();
    await prisma.role.deleteMany();
    await prisma.industry.deleteMany();
    await prisma.region.deleteMany();

    // Create Regions
    await prisma.region.createMany({
      data: [
        { name: 'San Francisco Bay Area' },
        { name: 'New York City' },
        { name: 'Austin, TX' },
      ],
    });
    const regions = await prisma.region.findMany();

    // Create Industries
    await prisma.industry.createMany({
      data: [
        { name: 'Technology' },
        { name: 'Finance' },
        { name: 'Healthcare' },
        { name: 'Education' },
      ],
    });
    const industries = await prisma.industry.findMany();

    // Create Roles
    await prisma.role.createMany({
      data: [
        { title: 'Software Engineer', experienceLevel: ExperienceLevel.FRESHER },
        { title: 'Software Engineer', experienceLevel: ExperienceLevel.EXPERIENCED },
        { title: 'Data Scientist', experienceLevel: ExperienceLevel.FRESHER },
        { title: 'Data Scientist', experienceLevel: ExperienceLevel.EXPERIENCED },
        { title: 'Product Manager', experienceLevel: ExperienceLevel.EXPERIENCED },
        { title: 'Financial Analyst', experienceLevel: ExperienceLevel.FRESHER },
      ],
    });
    const roles = await prisma.role.findMany();

    // Create Companies
    await prisma.company.createMany({
      data: [
        {
          name: 'Innovate Inc.',
          description: 'A leading tech company focused on innovation.',
          website: 'https://innovate-inc.com',
          industryId: industries.find(i => i.name === 'Technology')!.id,
          regionId: regions.find(r => r.name === 'San Francisco Bay Area')!.id
        },
        {
          name: 'DataDriven Corp.',
          description: 'Pioneering data analytics and business intelligence.',
          website: 'https://datadriven.com',
          industryId: industries.find(i => i.name === 'Technology')!.id,
          regionId: regions.find(r => r.name === 'New York City')!.id
        },
        {
          name: 'FinanceFirst Bank',
          description: 'A trusted partner in financial services.',
          website: 'https://financefirst.com',
          industryId: industries.find(i => i.name === 'Finance')!.id,
          regionId: regions.find(r => r.name === 'New York City')!.id
        },
        {
          name: 'HealthWell Group',
          description: 'Dedicated to improving healthcare outcomes.',
          website: 'https://healthwell.com',
          industryId: industries.find(i => i.name === 'Healthcare')!.id,
          regionId: regions.find(r => r.name === 'Austin, TX')!.id
        },
      ],
    });
    const companies = await prisma.company.findMany();

    // Create Jobs
    const jobData = [];
    const today = new Date();

    for (let i = 0; i < 50; i++) {
      const company = companies[i % companies.length];
      const role = roles[i % roles.length];
      const postedAt = new Date(today.getTime() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000);
      const salaryMin = 50000 + Math.floor(Math.random() * 20000);
      const salaryMax = salaryMin + Math.floor(Math.random() * 30000);

      jobData.push({
        title: role.title,
        description: `Seeking a ${role.title} to join our team at ${company.name}.`,
        companyId: company.id,
        roleId: role.id,
        regionId: company.regionId,
        experienceLevel: role.experienceLevel, // Use the role's experience level
        postedAt: postedAt,
        salaryMin: salaryMin,
        salaryMax: salaryMax,
      });
    }

    await prisma.job.createMany({
      data: jobData,
    });

    console.log('Seeding finished.');
    return NextResponse.json({ message: 'Seeding completed successfully.' });
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Seeding failed.', error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}