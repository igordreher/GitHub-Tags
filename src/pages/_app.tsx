import { Provider } from 'next-auth/client';
import Header from 'components/Header';

import 'styles/globals.scss';

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session} options={{ clientMaxAge: 60 * 60 }}>
      <Header />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
