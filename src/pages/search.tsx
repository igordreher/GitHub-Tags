import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { useState } from 'react';
import styles from '../styles/search.module.scss';
import { getStarredRepos } from './api/starred';
import Repository from '../components/Repository';


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
  const [repos, setRepos] = useState<Repository[]>(searchResults);

  return (
    <div className={styles.container}>
      <ul className={styles.repoList}>
        <h3>{repos.length} repository results</h3>
        {repos.map(repo => {
          return <Repository >{repo}</Repository>;
        })}
      </ul>
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
  const starredRepos = await getStarredRepos(ctx);

  return {
    props: {
      searchResults: starredRepos
    }
  };
};