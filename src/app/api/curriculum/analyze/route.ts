import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

const mockAnalysisResult = {
    skillsMatch: {
      matched: ['Object-Oriented Programming', 'Data Structures', 'Algorithms', 'Problem Solving'],
      missing: ['Cloud Computing (AWS/Azure)', 'CI/CD Pipelines', 'Machine Learning APIs', 'Containerization (Docker)'],
    },
    careerPathways: [
      { role: 'Cloud Solutions Architect', description: 'Design and deploy scalable applications on cloud platforms. Focus on AWS or Azure certifications.' },
      { role: 'DevOps Engineer', description: 'Automate software pipelines to bridge development and operations. Learn tools like Jenkins, GitLab CI, and Kubernetes.' },
      { role: 'AI/ML Engineer', description: 'Integrate machine learning models into applications. Gain experience with frameworks like TensorFlow or PyTorch.' },
    ],
    recommendations: [
      'Incorporate a course on "Cloud Fundamentals" covering core concepts of IaaS, PaaS, and SaaS.',
      'Add a project-based module where students build and deploy a simple CI/CD pipeline.',
      'Introduce an elective on "Applied Machine Learning" that focuses on using pre-trained models via APIs.',
      'Offer a workshop on Docker and containerization basics.',
    ],
  };

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ message: 'Invalid curriculum text provided' }, { status: 400 });
    }

    // --- AI Analysis Step (Mocked) ---
    // In a real application, you would make a call to the OpenAI API here.
    // Example:
    // import OpenAI from 'openai';
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const analysisResult = await openai.chat.completions.create({ ... });
    const analysisResult = mockAnalysisResult;

    // Save the analysis to the database
    const savedAnalysis = await prisma.curriculumAnalysis.create({
      data: {
        userId: userId,
        content: text,
        result: analysisResult,
      },
    });

    return NextResponse.json(savedAnalysis.result);

  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to analyze curriculum.', error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}