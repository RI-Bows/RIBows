import { getRios, RioType, getInterests } from '@/lib/dbActions';
import { Interest } from '@prisma/client';
import Search from './Search';

export default async function SearchPage() {
  const rios: RioType[] = await getRios();
  const interests: Interest[] = await getInterests();

  return <Search rioList={rios} interests={interests} />;
}
