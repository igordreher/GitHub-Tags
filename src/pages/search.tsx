import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { getStarredRepos } from './api/starred';
import styles from '../styles/search.module.scss';
import { getSession } from 'next-auth/client';

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
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState([]);

  const togglePopup = () => { setPopupHidden(!popupHidden); };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleTagSubmit = (event) => {
    if (event.key === 'Enter')
      setTags(tags.concat(inputValue));
  };

  return (<li key={children.id}>
    <div className={styles.repoHeader}>
      <a href={children.url}>{children.name}</a>
      <ul className={styles.tags}>
        {tags.map((tag, index) => {
          return (<li key={index}>
            <button>{tag}</button>
            <span>x</span>
          </li>);
        })}
      </ul>
      <button onClick={togglePopup}>add @tag</button>
    </div>
    {!popupHidden &&
      <div className={styles.popup}>
        <input type="text"
          autoFocus={true}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleTagSubmit}
        />
      </div>
    }
    <p>{children.description}</p>
  </li>);
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