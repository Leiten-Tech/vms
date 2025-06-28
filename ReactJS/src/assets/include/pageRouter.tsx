
import {BrowserRouter as Router,Switch,Routes,Route,Link,Outlet} from 'react-router-dom';
// import LoginPage from '../../components/login/login';
// import CEmployeeMaster from '../../components/masters/EmployeeMaster/cEmployeeMaster';
// import VEmployeeMaster from '../../components/masters/EmployeeMaster/vEmployeeMaster';
// import VVisitorManagement from '../../components/VisitorManagement/vVisitorManagement';
// import CVisitorManagement from '../../components/VisitorManagement/cVisitorManagement';

const pageRouter = () => {
  return (
    <div>
      <Router>
        <Switch>
          {/* <Route exact path="/" key="1"><LoginPage /></Route> */}
          {/* <Route exact path="/cEmployeeMaster" key="2"><CEmployeeMaster /></Route>
          <Route exact path="/vEmployeeMaster" key="3"><VEmployeeMaster /></Route>
          <Route exact path="/cVisitorManagement" key="4"><CVisitorManagement /></Route>
          <Route exact path="/vVisitorManagement" key="5"><VVisitorManagement /></Route> */}
        </Switch>
      </Router>
    </div>
    
   );
}
 
export default pageRouter;