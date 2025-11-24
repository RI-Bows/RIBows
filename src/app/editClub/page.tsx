/* eslint-disable arrow-body-style */

import EditClubForm from '@/components/EditClubForm';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function EditClubPage() {
  // Get the current user session
  const session = await getServerSession();

  console.log(session?.user?.email);
  if (!session?.user?.email) {
    redirect('/auth/signin'); // Redirect to login if not authenticated
  }

  console.log('Test email:', session.user.email);
  console.log('Test role:', session.user.role);
  // Check authorization first
  /*
  if (!session.user || (session.user.role !== 'CLUB' && session.user.role !== 'ADMIN')) {
    return <div>Unauthorized: Only clubs can edit RIOs.</div>;
  } */

  // Find the RIO by the logged-in user's email
  const rio = await prisma.rio.findFirst({
    where: { email: session.user.email },
    include: { RioInterest: true },
  });

  if (!rio) {
    return <div>RIO not found for your account.</div>;
  }

  return <EditClubForm rio={rio} />;
}
