import react, { Suspense, useEffect } from 'react';
import Layout from './features/common/Layout';
import Login from './features/auth/Login';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { StyledSpinnerNext } from 'baseui/spinner';
import ProtectedRoute from './features/common/ProtectedRoute';
import Navbar from './features/common/Navbar';
import { RecipesDist } from './features/recipes/recipesDist';
import { getUser } from './utility/setUser';
import ScrollToTop from './features/common/ScrollToTop';

const User = react.lazy(() => import('./features/user/user'));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Layout>
        <Switch>
          <Route exact path='/'>
            <Login />
          </Route>
          <Route
            path='/recipes'
            render={() => <ProtectedRoute element={<RecipesDist />} />}
          />
          <Route
            path='/user'
            render={() => (
              <ProtectedRoute
                element={
                  <Suspense fallback={<StyledSpinnerNext color='#000' />}>
                    <User />
                  </Suspense>
                }
              />
            )}
          ></Route>
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
