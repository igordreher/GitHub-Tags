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

interface Props {
  starredRepos: Repository[];
}

export default function Search({ starredRepos }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [repos, setRepos] = useState<Repository[]>(starredRepos);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter')
      setIsOpen(false);
  };

  return (
    <div className={styles.container}>
      <ul className={styles.repoList}>
        <h3>{repos.length} repository results</h3>
        {repos.map(repo => {
          return (<li key={repo.id}>
            <a href={repo.url}>{repo.name}</a>
            <button onClick={toggleIsOpen}>add @tag</button>
            {isOpen && (
              <div className={styles.popup}>
                <input type="text" autoFocus={true} placeholder="@tag" onKeyDown={handleInputKeyDown} />
              </div>
            )}
            <p>{repo.description}</p>
          </li>);
        })}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const starredRepos = await getStarredRepos(ctx);

  return {
    props: {
      starredRepos
    }
  };
};