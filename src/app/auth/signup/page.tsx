import { getInterests } from '@/lib/dbActions';
import type { Interest } from '@prisma/client';
import SignUp from './SignUp';

export default async function SignUpPage() {
  const interests: Interest[] = await getInterests();

  return <SignUp interests={interests} />;
}
