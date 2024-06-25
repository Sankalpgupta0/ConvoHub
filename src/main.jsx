import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from 'web-vitals'
import { RouterProvider } from 'react-router-dom';
// import router from './routes/index.js';
import { Provider } from 'react-redux'
import { store } from './redux/store';
import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "./pages/Register.jsx";
import CheckEmailPage from "./pages/CheckEmail.jsx";
import CheckPasswordPage from "./pages/CheckPassword.jsx";
import Home from "./pages/Home.jsx";
import MessagePage from "./components/MessagePage.jsx";
import AuthLayouts from "./helper/AuthLayout.jsx";
import Forgotpassword from "./pages/ForgotPassword.jsx";
import GroupPage from './components/GroupPage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/register",
        element: <AuthLayouts>
          <RegisterPage />
        </AuthLayouts>
      },
      {
        path: '/email',
        element: <AuthLayouts>
          <CheckEmailPage />
        </AuthLayouts>
      },
      {
        path: '/password',
        element: <AuthLayouts>
          <CheckPasswordPage />
        </AuthLayouts>
      },
      {
        path: '/forgot-password',
        element: <AuthLayouts>
          <Forgotpassword />
        </AuthLayouts>
      },
      {
        path: "/",
        element: <Home />,
        children: [
          {
            path: '/:userId',
            element: <MessagePage />
          },
          {
            path: '/group/:groupId',
            element: <GroupPage />
          },
        ]
      }
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);

// reportWebVitals();
