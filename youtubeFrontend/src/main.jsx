import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import Loader from './components/Loader/Loader.jsx'
import Landing from './pages/Landing.jsx'
const SignIn = lazy(() => import('./pages/SignIn.jsx'))
const SignUp = lazy(() => import('./pages/SignUp.jsx'))
const Channel = lazy(() => import('./pages/Channel.jsx'))
import ErrorPage from './pages/ErrorPage.jsx'
import { ThemeProvider } from './utilities/theme-provider.jsx'
const VideoPage = lazy(() => import('./pages/Watch.jsx'))
import { Provider } from 'react-redux'
import store from './redux/store.js'
const SelfChannel = lazy(() => import('./pages/SelfChannel.jsx'))



const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Landing />,
      },
      {
        path: '/channel',
        element: <Suspense fallback={<Loader />}><SelfChannel /></Suspense>,
      },
      {
        path: '/channel/:handle',
        element: <Suspense fallback={<Loader />}><Channel /></Suspense>,
      },
      {
        path: "/watch/:videoId",
        element: <Suspense fallback={<Loader />}><VideoPage /></Suspense>,
      }
    ],
    errorElement: <ErrorPage />,
  },
  {
    path: '/sign-in',
    element: <Suspense fallback={<Loader />}><SignIn /></Suspense>,
    errorElement: <ErrorPage />,
  },
  {
    path: '/sign-up',
    element: <Suspense fallback={<Loader />}><SignUp /></Suspense>,
    errorElement: <ErrorPage />,
  },

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
