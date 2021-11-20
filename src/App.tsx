import Layout from './features/common/Layout';
import Login from './features/auth/Login';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import ProtectedRoute from './features/common/ProtectedRoute';
import Navbar from './features/common/Navbar';

function App() {
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
