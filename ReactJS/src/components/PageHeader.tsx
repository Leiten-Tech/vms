import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createOrEdit } from "@/redux/slices/master/stateSlice";

const PageHeader = (props) => {
  const route = useHistory();

  const dispatch: any = useDispatch();
  const { pageTitle, handleClickSubmit, pageConfig } = props;
  return (
    <div className="page-title">
      <div className="grid grid-nogutter">
        <div className="md:col-6">
          <h1>{pageTitle}</h1>
        </div>
        <div className="md:col-6 text-right">
          <div className="action-btn">
            {pageConfig.pageHeader.pageActions.map((a, i) => {
              return (
                <div key={i}>
                  {a.save == true ? (
                    <Button
                      label=""
                      title="Save"
                      icon="pi pi-eye"
                      className="text-center"
                      onClick={handleClickSubmit}
                    />
                  ) : null}
                  {a.clear == true ? (
                    <Button
                      label=""
                      severity="danger"
                      icon="pi pi-trash"
                      title="Clear"
                      className="text-center"
                    />
                  ) : null}
                  {a.create == true &&
                  !["/home/vPlant"].includes(route.location.pathname) ? (
                    <Button
                      label=""
                      icon="pi pi-plus"
                      title="Create"
                      className="p-button p-button-success text-center"
                      onClick={() => {
                        a.createDispatch();
                        route.push(a.createQuery);
                      }}
                    />
                  ) : null}
                </div>
              );
            })}

            {/* <Button>

            </Button>
            <Link to={"/state/cState"}>
              <i className="pi pi-plus"></i>
            </Link> */}
            {/* <a
              href="/state/cState"
              title="Create New"
              className="p-button p-button-success text-center"
            >
              <i className="pi pi-plus"></i>
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
