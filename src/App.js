import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import SignUp from "./pages/SignUp";
import Category from "./pages/Category";
import SearchPage from "./pages/SearchPage";
import MyVideos from "./pages/MyVideos";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthorizedRoute from "./components/AuthorizedRoute";
import SessionExpiryDialog from "./components/SessionExpiryDialog";
import { AppContextProvider } from "./store/AppContext";

import 'react-toastify/dist/ReactToastify.css';

import './App.scss';

const routes = [
  {
    path: '/',
    Component: Home
  },
  {
    path: '/home',
    Component: Home
  },
  {
    path: '/category',
    Component: Category
  },
  {
    path: '/search-page',
    Component: SearchPage
  }
];

const authorizedRoutes = [
  {
    path: '/admin',
    Component: Admin
  },
  {
    path: '/videos',
    Component: MyVideos
  },
];

const renderToaster = () => {
  return <ToastContainer
    position="bottom-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
  />
};

function App() {
  return (
    <div className="App">
      <AppContextProvider>
        <Routes>
          <Route path={"/login"} element={<Login />} />
          {routes.map(({ path, Component }) => <Route path={path} element={<Header>{<div><Component/><Footer/></div>}</Header>} />)}
          <Route path={"/"} element={<AuthorizedRoute/>}>
            {authorizedRoutes.map(({ path, Component }) => (
              <Route path={path} element={<Component />} />
            ))}
          </Route>
          <Route path={"signup"} element={<SignUp />} />
        </Routes>
      </AppContextProvider>
      <SessionExpiryDialog />
      {renderToaster()}
    </div>
  )
}

export default App;
