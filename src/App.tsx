import React, { useEffect } from 'react';
import { store } from './app/store';
import { useAppDispatch } from './app/hooks';
import { userIdentified } from './features/auth/authSlice';
import Layout from './features/common/Layout';
import Login from './features/auth/Login';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import ProtectedRoute from './features/common/ProtectedRoute';
import Navbar from './features/common/Navbar';
import setUser from './utility/setUser';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // check for token in LS when app first runs
    if (localStorage.user) {
      // if there is a token set axios headers for all requests
      const user = JSON.parse(localStorage.user);
      setUser(user);
      dispatch(userIdentified(user.username));
    }
    // try to fetch a user, if no token or invalid token we
    // will get a 401 response from our API
    //store.dispatch(loadUser());

    // log user out from all tabs if they log out in one tab
    /*window.addEventListener('storage', () => {
      if (!localStorage.token) store.dispatch({ type: LOGOUT });
    });*/
  }, []);

  return (
    <Router>
      <Navbar />
      <Layout>
        <Switch>
          <Route exact path='/'>
            <Login />
          </Route>
          <Route
            path='/recipes'
            render={() => (
              <ProtectedRoute element={<h1> This is the recipes path</h1>} />
            )}
          />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
