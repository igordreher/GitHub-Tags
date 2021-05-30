import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import styles from '../styles/search.module.scss';
import { getStarredRepos } from './api/starred';
import Repository from '../components/Repository';
import { getTags } from './api/tags';
import filterRepos from '../utils/filterRepos';


interface Repository {
  id: number;
  name: string;
  description: string;
  url: string;
  tags?: string[];
}

interface SearchProps {
  searchResults: Repository[];
}

export default function Search({ searchResults }: SearchProps) {

  return (
    <div className={styles.container}>
      {searchResults ?
        <ul className={styles.repoList}>
          <h3>{searchResults.length} repository results</h3>
          {searchResults.map(repo => {
            return (
              <li key={repo.id}>
                <Repository >{repo}</Repository>
              </li>
            );
          })}
        </ul>
        : <span>Search for starred and tagged repositories</span>
      }
    </div>
  );
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    };
  }
  const q = ctx.query.q as string;

  if (q) {
    const starredRepos = await getStarredRepos(ctx);
    const tags = await getTags(ctx);
    const tagName = q.startsWith('@') ? q.substr(1) : '';
    const result = filterRepos(starredRepos, tags, tagName);

    return {
      props: {
        searchResults: result
      }
    };
  }

  else {
    return {
      props: {
        searchResults: null
      }
    };
  }
};