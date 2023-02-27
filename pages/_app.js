import '@/styles/globals.css'
import StoreProvider from '@/storage/store-context';

export default function App({ Component, pageProps }) {
  return (
  <div>
    <StoreProvider>
    <Component {...pageProps} />
    </StoreProvider>
  </div>
  );
}
