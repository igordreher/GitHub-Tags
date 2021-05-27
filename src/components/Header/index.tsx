import { useSession, signOut, signIn } from 'next-auth/client';
import styles from './styles.module.scss';

export default function Header() {
  const [session] = useSession();

  return (
    <header className={styles.headerContainer}>
      {session ? (<>
        <form action="/search">
          <input type="search" name="q" id="" alt="Search Repo" />
        </form>
        <details className={styles.detailsOverlay}>
          <summary>
            <img src={session.user.image} alt="User Avatar" className={styles.userAvatar} sizes="20" />
          </summary>
          <menu className={styles.detailsMenu}>
            <div className={styles.menuItem}>Signed in as {session.user.name}</div>
            <div className={styles.menuDivider}></div>
            <button className={styles.menuItem} onClick={() => signOut()} >Sign out</button>
          </menu>
        </details>
      </>) : (<>
        <button onClick={() => signIn('github')}>Sign in</button>
      </>)
      }
    </header>
  );
}