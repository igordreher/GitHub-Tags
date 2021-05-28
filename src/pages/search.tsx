import { GetServerSideProps } from "next";
import { getSession } from 'next-auth/client';
import axios from 'axios';

import SearchResult from '../components/SearchResult';

export default function Search({ searchResult }) {
  return (
    <>
      <SearchResult >{searchResult}</SearchResult>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  const q = ctx.query.q;
  const name = session.user.name.replace(' ', '');

  const { data } = await axios.get(`https://api.github.com/users/${name}/starred`);

  interface Repo {
    id: number;
    full_name: string;
    description: string;
    svn_url: string;
  }

  const filter = q ? data.filter((repo: Repo) => {
    return repo.full_name.includes(q as string);
  }) : [];

  const result = filter.map((repo: Repo) => {
    const { id, description, full_name, svn_url } = repo;
    return { id, description, name: full_name, url: svn_url };
  });

  return {
    props: {
      searchResult: result
    }
  };
};