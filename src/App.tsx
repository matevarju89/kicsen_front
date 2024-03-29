import react, { Suspense } from 'react';
import Layout from './features/common/Layout';
import Login from './features/auth/Login';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { Spinner } from 'baseui/spinner';
import ProtectedRoute from './features/common/ProtectedRoute';
import Navbar from './features/common/Navbar';
import { RecipesDist } from './features/recipes/recipesDist';
import ScrollToTop from './features/common/ScrollToTop';
import About from './features/common/About';

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
          <Route exact path='/about'>
            <About />
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
                  <Suspense fallback={<Spinner color='#000' />}>
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
