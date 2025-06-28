import { AppProgressSpinner } from "@/components/UtilityComp";
import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";

const RouteCombiner = ({ PrivateRoute, routes, auth }) => {
  const RoutesMap = routes.map(
    ({
      Private,
      exact = true,
      Layout = ({ children }) => <>{children}</>,
      modules,
      Component,
      path,
      rest,
    }) => {
      const ComponentWithLayout = () => {
        return (
          <Layout>
            <Suspense fallback={<AppProgressSpinner />}>
              <Component />
            </Suspense>
          </Layout>
        );
      };

      return Private
        ? [
            <PrivateRoute
              key={path}
              exact={exact}
              component={ComponentWithLayout}
              path={path}
              auth={auth}
            />,
            modules &&
              modules.map((childrenProps) => (
                <PrivateRoute
                  key={childrenProps.path}
                  exact={childrenProps.exact}
                  component={() => (
                    <Layout>
                      <Suspense fallback={<AppProgressSpinner />}>
                        <childrenProps.Component />
                      </Suspense>
                    </Layout>
                  )}
                  path={path + childrenProps.path}
                  auth={auth}
                />
              )),
          ]
        : [
            <Route
              key={path}
              exact={exact}
              component={ComponentWithLayout}
              path={path}
              {...rest}
            />,
            modules &&
              modules.map((childrenProps) => (
                <Route
                  key={childrenProps.path}
                  exact={childrenProps.exact}
                  component={() => (
                    <Layout>
                      <Suspense fallback={<AppProgressSpinner />}>
                        <childrenProps.Component />
                      </Suspense>
                    </Layout>
                  )}
                  path={path + childrenProps.path}
                  {...rest}
                />
              )),
          ];
    }
  );

  return <Switch> {RoutesMap}</Switch>;
};

export default RouteCombiner;
