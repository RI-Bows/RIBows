/* eslint-disable arrow-body-style */

import EditClubForm from '@/components/EditClubForm';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditClubPage({ params }: PageProps) {
  // Await params if using Next.js 15+
  const { id } = await params;

  // Get the current user session
  const session = await getServerSession();

  console.log(session?.user?.email);
  if (!session?.user?.email) {
    redirect('/auth/signin'); // Redirect to login if not authenticated
  }

  const rio = await prisma.rio.findUnique({
    where: { id: Number(id) },
    include: { RioInterest: true },
  });

  if (!rio) {
    return <div>RIO not found.</div>;
  }

  if (!session.user || session.user.role !== 'CLUB') {
    return <div>Unauthorized: Only clubs can edit RIOs.</div>;
  }

  if (rio.email !== session.user.email) {
    return <div>Unauthorized: You can only edit your own club.</div>;
  }

  return <EditClubForm rio={rio} />;
}
