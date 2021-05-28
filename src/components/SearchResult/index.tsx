import styles from './styles.module.scss';

interface Repository {
  id: number;
  name: string;
  description: string;
  url: string;
}

interface Props {
  children: Repository[];
}


export default function SearchResult({ children }: Props) {

  return (
    <div className={styles.container}>
      <ul className={styles.repoList}>
        <h3>{children.length} repository results</h3>
        {children.map(repo => {
          return (<li key={repo.id}>
            <a href={repo.url}>{repo.name}</a>
            <p>{repo.description}</p>
          </li>);
        })}
      </ul>
    </div>
  );
}