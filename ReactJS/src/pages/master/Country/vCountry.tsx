import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import {
  createOrEdit,
  createInit,
  fetchCountries,
  deleteCountries,
} from "@/redux/slices/master/countrySlice";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { confirmation } from "@/components/UtilityComp";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { permissionService } from "@/services/PermissionService";
import { ExportClass, exportServ } from "@/services/ExportService";
import AppAlert from "@/alert/alert";

const VCountry = () => {
  const [countrys, setCountrys] = useState(null);
  const route = useHistory();

  const dispatch: any = useDispatch();
  const allCountrys = useSelector((state: any) => state.country.CountryList);
  const loading = useSelector((state: any) => state.country.loading);
  const Country = useSelector((state: any) => state.country.Country);
  const [screenPermissions, setScreenPermissions] = useState<any>();
  const [tableActions, setTableActions] = useState([]);

  const [update, setUpdate] = useState(false);

  const toast = useRef<Toast>(null);

  useEffect(() => {
    pageLoadScript();
  });

  
  useEffect(() => {
    setScreenPermissions(permissionService({ screenId: 4 }));
  }, []);


  // Fetch Data from REDUX API CALL
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = () => {
    const country = {
      Countryid: 0,
      Taskname: "SEARCHINITIALIZE",
    };
    return dispatch(createInit(country));
  };

  useEffect(() => {
    setCountrys(allCountrys);
  }, [allCountrys]);

  useEffect(() => {
    
    

    if (
      screenPermissions?._View &&
      tableActions.filter((item) => item.name == "view").length == 0
    ) {
      
      setTableActions([
        ...tableActions,
        {
          title: "View",
          name: "view",
          disabled: false,
        },
      ]);
    }
    if (
      screenPermissions?._Update &&
      tableActions.filter((item) => item.name == "edit").length == 0
    ) {
      setTableActions([
        ...tableActions,
        {
          title: "Edit",
          name: "edit",
          disabled: false,
        },
      ]);
    }
    if (
      screenPermissions?._Delete &&
      tableActions.filter((item) => item.name == "delete").length == 0
    ) {
      setTableActions([
        ...tableActions,
        {
          title: "Delete",
          name: "delete",
          disabled: false,
        },
      ]);
    }
  if (screenPermissions?._View && screenPermissions?._Update && screenPermissions?._Delete) {
      setPageConfig({
        ...pageConfig,
        tableAction: true,
      });
    }
  }, [screenPermissions, tableActions]);

  useEffect(() => {
    if (
      screenPermissions?._Add &&
      !pageConfig.pageHeader.pageActions[0].create
    ) {
      
      
      setPageConfig((prevPageConfig) => {
        const updatedPageHeader = {
          ...prevPageConfig.pageHeader,
          pageActions: prevPageConfig.pageHeader.pageActions.map((action) => {
            return {
              ...action,
              create: screenPermissions?._Add ? true : false,
            };
          }),
        };
  
        return {
          ...prevPageConfig,
          pageHeader: updatedPageHeader,
        };
      });
    }
  }, [screenPermissions]);
  

  useEffect(() => {
    
    setPageConfig({
      ...pageConfig,
      tableActions: tableActions,
    });
  }, [tableActions]);


  const [selectedProducts, setSelectedProducts] = useState(null);

  const [pageConfig, setPageConfig] = useState({
    pageTitle: "Country",
    pageHeader: {
      pageActions: [
        {
          create: false,
          clear: false,
          save: false,
          createQuery: "/home/cCountry",
          createDispatch: () =>
            dispatch(
              createOrEdit({ data: null, isView: false, isCreate: true })
            ),
        },
      ],
    },
    tableCheckSelection: false,
    tableAction: true,
    tableActionStyle: {
      textAlign: "center",
    },
    tableRows: 10,
    tableRowsOptions: [5, 10, 25],
    tablePagination: true,
    tableActions:  tableActions,
    tableColumns: [
      {
        title: "Country Code",
        name: "CountryCode",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Country Name",
        name: "CountryName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Country Shortform",
        name: "CountryShortForm",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Nationality",
        name: "Nationality",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Created By",
        name: "CreatedByName",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Created On",
        name: "CreatedOn",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Modified By",
        name: "ModifiedByName",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Modified On",
        name: "ModifiedOn",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },

      {
        title: "Status",
        name: "StatusName",
        sort: true,
        avatar: false,
        badge: true,
        colStyle: { minWidth: "2rem", textAlign : "center"},
      },
    ],
    tableExport: (exportType: string) => {
      const data = fetchCountries();
      data.then((res: any) => {
        fetchDataForExport(res.payload.CountryList)
          .then((dataList: any) => {
            if (exportType === 'pdf') {
              exportServ.Export('Country', dataList, 'pdf');
            } else if (exportType === 'excel') {
              exportServ.Export('Country', dataList, 'excel');
            }
          })
          .catch((error) => {
            console.error(error.message);
          })
      })
    }
  });

  const fetchDataForExport = (vList) => {
    return new Promise((resolve, reject) => {
      let dataList = []
      if (vList.length > 0) {
        vList.forEach((element) => {
          let data = {
            "Country Code": element.CountryCode,
            "Country Name": element.CountryName,
            "Country ShortForm": element.CountryShortForm,
            "Nationality": element.Nationality,
            "Created By": element.CreatedByName,
            "Created On": element.CreatedOn,
            "Modified By": element.ModifiedByName,
            "Modified On": element.ModifiedOn,
            "Status": element.StatusName,
          };
          dataList.push(data);
        });
        resolve(dataList);
      } else {
        reject(new Error('No data available for export.'));
      }
    });
  }

  const handleActions = {
    view: (rowData) => {
      route.push(`/home/cCountry`);
      const data = {
        Countryid: rowData.data.CountryId,
        Taskname: "createInitIALIZE",
      };
      dispatch(createInit(data));
      dispatch(createOrEdit(rowData));
      setUpdate(true);
    },
    edit: (rowData) => {
      const data = {
        Countryid: rowData.data.CountryId,
        Taskname: "createInitIALIZE",
      };
      const updatedRes = dispatch(createInit(data));
      updatedRes
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            toast.current?.show({
              severity: "success",
              summary: "Success Message",
              detail: res.payload.transtatus.lstErrorItem[0].Message,
            });
            dispatch(createOrEdit(rowData));
            route.push(`/home/cCountry`);
          } else if (res.payload.transtatus.result == false) {
            toast.current?.show({
              severity: "error",
              summary: "Error Message",
              detail: res.payload.transtatus.lstErrorItem[0].Message,
            });
          }
        })
        .catch((err) => {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: JSON.stringify(err),
          });
        });
      },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this ${rowData.data.CountryName}?`,
        "Confirmation",
        () => {
          let StateFormData = {
            Countryid: rowData.data.CountryId,
          };
          const deletedRes = dispatch(deleteCountries(StateFormData));
          deletedRes
            .then((res) => {
              if (res.payload.transtatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                fetchCountries();
              } else if (res.payload.transtatus.result == false) {
                toast.current?.show({
                  severity: "error",
                  summary: "Error Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
              }
            })
            .catch((err) => {
              toast.current?.show({
                severity: "error",
                summary: "Error Message",
                detail: JSON.stringify(err),
              });
            });
        },
        () => {}
      );
    },
  };

  return (
    <>
      <div className="page-container">
        <div className="inner-page-container">
          <PageHeader
            pageTitle={pageConfig.pageTitle}
            pageConfig={pageConfig}
          />
          <div className="form-container scroll-y">
            <div className="white">
              <div className="widget-body">
                <div className="card">
                  <AppTable
                    handleActions={handleActions}
                    data={countrys}
                    loading={loading}
                    pageConfig={pageConfig}
                    screenPermissions={screenPermissions}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog />
      <AppAlert toast={toast} />
    </>
  );
};

export default VCountry;
