import { Route, Redirect, useHistory } from "react-router-dom";

const PrivateRoute = (props) => {
  let { children, render, auth, ...rest } = props;
  const route = useHistory();

  // if (
  //   localStorage["data_tranStatus"] &&
  //   localStorage["data_tranStatus"] != ""
  // ) {
  //   if (!auth && JSON.parse(localStorage["data_tranStatus"]).result == true) {
  //     route.push("/");
  //   }
  // } else {
  //   route.push("/");
  // }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth ? (
          <props.component />
        ) : (
          <Redirect
            {...rest}
            to={{ pathname: "/", state: { from: location } }}
          />
        )
      }
    />
  );
};
export default PrivateRoute;
