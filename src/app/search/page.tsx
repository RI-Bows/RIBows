import { getRios, RioType, getInterests } from '@/lib/dbActions';
import { Interest } from '@prisma/client';
import Search from './Search';

type SearchPageProps = {
  // eslint-disable-next-line react/require-default-props
  searchParams?: {
    query?: string;
  };
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const rios: RioType[] = await getRios();
  const interests: Interest[] = await getInterests();

  const initialQuery = typeof searchParams?.query === 'string' ? searchParams.query : '';

  return (
    <Search
      rioList={rios}
      interests={interests}
      initialQuery={initialQuery}
    />
  );
}
