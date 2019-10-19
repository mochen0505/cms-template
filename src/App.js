import React from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { configsNeedAuth, configsNoAuth } from './configs/routes';
import { selectToken } from './redux/selectors';
import LayoutWithSidebar from './pages/components/layout-w-side-bar';
import LayoutWithoutSidebar from './pages/components/layout-wo-side-bar';
import Layout404 from './pages/components/layout-404';
import NoMatch from './pages/no-match';
import 'nprogress/nprogress.css';

const mapStateToProps = (state) => {
  return {
    isAuthenticated: selectToken(state)
  };
};

class App extends React.Component {
  render() {
    const { isAuthenticated } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    return (
      <Switch>
        {configsNeedAuth.map(({ path, exact, component: Comp }, index) => (
          <Route
            key
            path={path}
            exact={exact}
            render={(props) =>
              isAuthenticated ? (
                <LayoutWithSidebar {...props}>
                  <Comp {...props} />
                </LayoutWithSidebar>
              ) : (
                <Redirect
                  to={{ pathname: '/login', state: { from: props.location } }}
                />
              )
            }
          />
        ))}
        {configsNoAuth.map(({ path, exact, component: Comp }, index) => (
          <Route
            key
            path={path}
            exact={exact}
            render={(props) =>
              !isAuthenticated ? (
                <LayoutWithoutSidebar {...props}>
                  <Comp {...props} />
                </LayoutWithoutSidebar>
              ) : (
                <Redirect to={from} />
              )
            }
          />
        ))}
        <Redirect from="/" to="/home" exact />
        <Layout404>
          <Route component={NoMatch} />
        </Layout404>
      </Switch>
    );
  }
}

export default withRouter(connect(mapStateToProps)(App));
