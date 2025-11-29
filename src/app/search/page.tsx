import { getRios } from '@/lib/dbActions';
import SearchClient from './SearchClient';

export default async function SearchPage() {
  const rios = await getRios();

  return (
    <SearchClient initialRios={rios} />
  );
}
