import { GetServerSideProps } from "next";
import { getSession } from 'next-auth/client';
import axios from 'axios';

export default function Search({ searchResult }) {

  return (
    <li>
      {JSON.stringify(searchResult)}
    </li>
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
    url: string;
  }

  const filter = q ? data.filter((repo: Repo) => {
    return repo.full_name.includes(q as string);
  }) : data;

  const result = filter.map((repo: Repo) => {
    return {
      id: repo.id,
      full_name: repo.full_name,
      description: repo.description,
      url: repo.url
    };
  });

  return {
    props: {
      searchResult: result
    }
  };
};