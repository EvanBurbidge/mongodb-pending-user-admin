import '@/styles/globals.css'
import { useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function App({ Component, pageProps }) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createPagesBrowserClient())
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <>
        <ToastContainer />
        <Component {...pageProps} />
      </>
    </SessionContextProvider>
  )
}
