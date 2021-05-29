import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { getStarredRepos } from './api/starred';
import styles from '../styles/search.module.scss';

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

interface RepositoryProps {
  children: Repository;
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

function Repository({ children }: RepositoryProps) {
  const [popupHidden, setPopupHidden] = useState(true);
  const togglePopup = () => { setPopupHidden(!popupHidden); };

  return (<li key={children.id}>
    <a href={children.url}>{children.name}</a>
    <button onClick={togglePopup}>add @tag</button>
    {!popupHidden &&
      <div className={styles.popup}>
        <input type="text" autoFocus={true} placeholder="@tag" />
      </div>
    }
    <p>{children.description}</p>
  </li>);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const starredRepos = await getStarredRepos(ctx);

  return {
    props: {
      searchResults: starredRepos
    }
  };
};