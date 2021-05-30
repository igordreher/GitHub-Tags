import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { useState } from 'react';
import Editext from 'react-editext';
import styles from '../styles/search.module.scss';
import { getStarredRepos } from './api/starred';

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
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState([]);

  const togglePopup = () => { setPopupHidden(!popupHidden); };
  const toggleEditingTag = () => { setIsEditingTag(!isEditingTag); };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleTagSubmit = (event) => {
    if (event.key === 'Enter' && !tags.includes(inputValue)) {
      setTags(tags.concat(inputValue));
      setInputValue('');
      togglePopup();
    }
  };

  const deleteTag = (tagIndex: number) => {
    setTags(tags.filter((tag, index) => index !== tagIndex));
    toggleEditingTag();
  };

  const editTag = (tagName: string, tagIndex: number) => {
    setTags(tags.map((tag, index) => {
      if (index === tagIndex) return tagName;
      return tag;
    }));
    toggleEditingTag();
  };

  return (<li key={children.id}>
    <div className={styles.repoHeader}>
      <a href={children.url}>{children.name}</a>
      <ul className={styles.tags}>
        {tags.map((tag, index) => {
          return (<li key={tag}>
            <Editext
              value={tag}
              editOnViewClick={true}
              submitOnEnter={true}
              cancelOnEscape={true}
              cancelOnUnfocus={true}
              onEditingStart={toggleEditingTag}
              onCancel={toggleEditingTag}
              onSave={(value) => { editTag(value, index); }}
            />
            <div className={!isEditingTag && styles.hidden}>
              <button onMouseDown={() => { deleteTag(index); }} className={styles.deleteTag}>x</button>
            </div>
          </li>);
        })}
      </ul>
      <button onClick={togglePopup}>add @tag</button>
    </div>
    {
      !popupHidden &&
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
  </li >);
}

function Tag() {

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