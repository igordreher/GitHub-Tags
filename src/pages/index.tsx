import Head from 'next/head';
import { signIn, signOut, useSession } from 'next-auth/client';

export default function Home() {
  const [session] = useSession();

  return (
    <div>
      <Head>
        <title>Github Tags</title>
      </Head>
      {!session ? (
        <button onClick={() => signIn()}> Login with GitHub</button>
      ) : (
          <button onClick={() => signOut()}> Sign Out</button>
        )
      }
    </div>
  );
}
