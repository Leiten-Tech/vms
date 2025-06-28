import { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import RouterCombiner from "./routes/RouteCombiner";
import PrivateRoute from "./routes/PrivateRoute";

import { PrimeReactProvider } from "primereact/api";

import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "line-awesome/dist/line-awesome/css/line-awesome.min.css";
import "jquery/dist/jquery.min.js";

import "../src/assets/css/style.css";

import { PageRoutes } from "./routes/PageRoutes";
import { Toast } from "./assets/css/prime-library";
import { pageLoadScript } from "@/assets/js/common-utilities";

const App = () => {
  const toastRef = useRef(null);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    pageLoadScript();
    if (
      localStorage.getItem("data_tranStatus") != null &&
      JSON.parse(localStorage["data_tranStatus"]).result == true
    ) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  });

  useEffect(() => {
    
  });

  return (
    <PrimeReactProvider>
      <div>
        <Router>
          <RouterCombiner
            routes={PageRoutes}
            PrivateRoute={PrivateRoute}
            auth={auth}
          />
        </Router>
      </div>
      <Toast ref={toastRef} />
    </PrimeReactProvider>
  );
};
export default App;
