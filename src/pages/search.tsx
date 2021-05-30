import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { useState } from 'react';
import styles from '../styles/search.module.scss';
import { getStarredRepos } from './api/starred';
import Repository from '../components/Repository';
import { getTags } from './api/tags';


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
      {searchResults ?
        <ul className={styles.repoList}>
          <h3>{repos.length} repository results</h3>
          {repos.map(repo => {
            return (
              <li key={repo.id}>
                <Repository >{repo}</Repository>;
              </li>
            );
          })}
        </ul>
        : <span>Search for starred and tagged repositories</span>
      }
    </div>
  );
}

export const filterRepos = (starredRepos, tags, tagName: string) => {
  const regex = RegExp(`^(${tagName}).*`, 'i');

  if (tags.length == 0) return starredRepos;

  const filter = starredRepos.filter(repo => {
    return tags.some(tag => {
      return tag.repoId === repo.id && tag.tagName.match(regex);
    });
  });

  const tagRepos = () => {
    return filter.map(repo => {
      const repoTags = [];
      tags.forEach(tag => {
        if (tag.repoId == repo.id)
          repoTags.push(tag.tagName);
      });

      return { ...repo, tags: repoTags };
    });
  };
  return tagRepos();
};


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