import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  InputText,
  Sidebar,
} from "../assets/css/prime-library";
import { useHistory } from "react-router-dom";
import { NoResults } from "@/components/UtilityComp";
import {
  CVisitorInfo,
  CVistorDetail,
} from "@/pages/VisitorManagement/VisitorManage/cVisitorManagement";
import { overflow } from "html2canvas/dist/types/css/property-descriptors/overflow";
import AppAlert from "@/alert/alert";
import { json } from "stream/consumers";
import { FooterContent } from "@/components/PrintPass";

const ShowContDialog = (e: any, setVisible: any, setDetailData: any) => {
  return (
    <>
      <a
        style={{ color: "blue" }}
        onClick={() => {
          setDetailData(e);
          setVisible(true);
        }}
      >
        {e.VisitorName}
      </a>
    </>
  );
};

export const ContDetail = (props) => {
  const {
    dialogVisible,
    setDialogVisible,
    setVisible,
    contWorker,
    handlePassPreview,
    passData,
    selectedHost,
    selectedVisitor,
    tabConfig,
    itemTemplate,
    toast,
    handleClosePassPrev,
    setpassVisible,
    VisitorDocDetailList
  } = props;
  const routePage = useHistory();
  const openPrint = () => {
    window.print();
  };
  return (
    <Dialog
      visible={dialogVisible}
      onHide={() => handleClosePassPrev()}
      className="preview-container"
      style={{
        width: "80rem"
      }}
    >
      <div className="widget-body">
        <div className="grid">
          {/* FOR NTN  8- 3*/}
          <div className="col-5">
            <div className="white">
              {/* <div className="widget-body">
                <div className="grid">
                  <>
                    {contWorker?.length > 0 ? (
                      contWorker?.map((item) => (
                        <div
                          className="col-3 cursor-pointer"
                          key={item?.VisitorCode}
                          onClick={(e) => handlePassPreview(e, item, true)}
                        >
                          <div
                            className={`bg-blue-50 border-1 border-blue-100 br-5 white ${
                              item?.IsActive ? "select" : ""
                            }`}
                          >
                            <div className="widget-body">
                              <div className="visitor-name text-overflow-ellipsis white-space-nowrap overflow-hidden">
                                {item?.FirstName}
                              </div>
                              <div className="emp-id">{item?.VisitorCode}</div>
                              <div className="visitor-company">
                                {item?.VisitorCompany || "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <NoResults text={"No Workers/ Visitors Found"} />
                    )}
                  </>
                </div>
              </div> */}
              <CVisitorInfo
                tabConfig={tabConfig}
                itemTemplate={itemTemplate}
                passData={passData}
                sHost={selectedHost}
                sVisit={selectedVisitor}
                toast={toast}
                VisitorDocDetailList={VisitorDocDetailList}
              />
            </div>
          </div>
          {/* FOR NTN 6-9 */}

          <div className="col-7">
            <div className="white">
              {routePage?.location?.pathname != "/home/cVisitorManagement" ? (
                <FooterContent
                  openPrint={openPrint}
                  setpassVisible={setpassVisible}
                />
              ) : null}
              <CVistorDetail
                tabConfig={tabConfig}
                itemTemplate={itemTemplate}
                passData={passData}
                sHost={selectedHost}
                sVisit={selectedVisitor}
                toast={toast}
              />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export const BookedSearchBox = (props) => {
  const { itemBook, handleBookedVisitor, editData } = props;

  return (
    <div
      className="col-2 relative"
      key={itemBook?.VisitorDetailId}
      onClick={(e) => handleBookedVisitor(e, itemBook, false)}
    >
      <div className={`white ${itemBook?.IsActive ? "select" : ""}`}>
        <div className="widget-body">
          <strong>{itemBook.VisitorTypeName}</strong>
          <div className="visitor-name text-overflow-ellipsis white-space-nowrap overflow-hidden">
            {itemBook?.PersonName}
          </div>
          <div className="emp-id">{itemBook?.VisitorEntryCode}</div>
          <div className="visitor-company">{itemBook?.VisitorCompany}</div>
          {false && (
            <Button
              label=""
              severity="success"
              icon="pi pi-pencil"
              title="Edit"
              className="w-2rem h-2rem absolute bottom-50 mr-4 p-1 p-button p-button-icon-only p-button-info p-component right-0"
              disabled={false}
              onClick={(event) => {
                event.stopPropagation();
                editData(itemBook);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const VistorSearchBox = (props) => {
  const { config, lstItem } = props;

  const renderSearchResults = () => {
    if (config.searchId === "visit_search") {
      return (
        <>
          {lstItem.search.length > 0 ? (
            lstItem.search?.map((item) => (
              <div
                className="col-4 relative"
                key={item?.VisitorDetailId}
                onClick={(e) => lstItem.searchFunc(e, item)}
              >
                <div className={`white ${item?.IsActive ? "select" : ""}`}>
                  <div className="widget-body">
                    <div className="visitor-name text-overflow-ellipsis white-space-nowrap overflow-hidden">
                      {item?.FirstName} -{" "}
                      <span className="visitor-company text-overflow-ellipsis white-space-nowrap overflow-hidden">
                        {item.Status == 1 ? (
                          "Active"
                        ) : (
                          <span className="text-red-400">BlackListed</span>
                        )}
                      </span>
                    </div>
                    <div className="emp-id">
                      <strong>{item?.VisitorCode}</strong>
                    </div>
                    <div className="emp-id">
                      <strong>{item?.MobileNo}</strong>
                    </div>
                    <div className="visitor-company text-overflow-ellipsis white-space-nowrap overflow-hidden">
                      {" "}
                      {item?.VisitorCompany && item?.VisitorCompany != null
                        ? item?.VisitorCompany
                        : "-"}
                    </div>
                  </div>
                </div>
                {localStorage["data_userrolemapList"]  && JSON.parse(localStorage["data_userrolemapList"])?.some(r => r.role_name == "Admin" && r.Is_Default == true) && (
                  <Button
                    key={item?.VisitorId}
                    label=""
                    severity="success"
                    icon="pi pi-pencil"
                    title="Edit"
                    className="absolute h-2rem mr-4 mt-4 p-1 p-button p-button-icon-only p-button-info p-button-success p-component right-0 top-0 w-2rem"
                    disabled={false}
                    onClick={(event) => {
                      event.stopPropagation();
                      lstItem.editData(event, item);
                    }}
                  />
                )}
              </div>
            ))
          ) : (
            <NoResults text={"No Visitors Found"} />
          )}
        </>
      );
    } else if (config.searchId == "host_search") {
      return (
        <>
          {lstItem.search.length > 0 ? (
            lstItem.search?.map((item) => (
              <div
                className="col-4"
                key={item?.UserId}
                onClick={(e) => lstItem.searchFunc(e, item)}
              >
                <div className={`white ${item?.IsActive ? "select" : ""}`}>
                  <div className="widget-body">
                    <div className="visitor-name text-overflow-ellipsis white-space-nowrap overflow-hidden">
                      {item?.UserName}
                    </div>
                    <div className="emp-id">
                      <strong>{item?.UserCode ? item?.UserCode : "-"}</strong>
                    </div>
                    <div className="emp-id">
                      {" "}
                      <strong>{item?.UserTelNo ? item?.UserTelNo : "-"}</strong>
                    </div>
                    <div className="visitor-company text-overflow-ellipsis white-space-nowrap overflow-hidden">
                      {" "}
                      {item?.CompanyName ? item?.CompanyName : "-"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <NoResults text={"No Hosts Found"} />
          )}
        </>
      );
    } else if (config.searchId == "vehicle_search") {
      return (
        <>
          {lstItem.search.length > 0 ? (
            lstItem.search?.map((item, index) => (
              <div
                className="col-2 relative"
                key={index}
                onClick={(e) => lstItem.searchFunc(e, item)}
              >
                <div className={`white ${item?.IsActive ? "select" : ""}`}>
                  <div className="widget-body">
                    <div className="visitor-name text-overflow-ellipsis white-space-nowrap overflow-hidden">
                      {item?.VisitorEntryCode} -{" "}
                      <span className="visitor-company text-overflow-ellipsis white-space-nowrap overflow-hidden">
                        <span>{item?.VehicleTypeName}</span>
                      </span>
                    </div>
                    <div className=" emp-id">Vehicle No: {item?.VehicleNo}</div>
                    <div className=" emp-id text-overflow-ellipsis white-space-nowrap overflow-hidden">
                      Vehicle Model: {item?.VehicleModel || "-"}
                    </div>
                    <div className="visitor-company text-overflow-ellipsis white-space-nowrap overflow-hidden">
                      Driver: {item?.DriverName || "-"}
                    </div>
                  </div>
                </div>

                {/* {(item?.EntryTime === null || item?.ExitTime === null) &&
                !(item?.EntryTime === null && item?.ExitTime === null) ? ( */}
                  <Button
                    key={item?.VehicleId}
                    label="Print"
                    title="Print"
                    icon="pi pi-print"
                    className="no-print absolute h-2rem mr-4 mt-4 p-1 p-button p-button-icon-only p-button-info p-button-warning p-component right-0 top-0 w-2rem"
                    onClick={(event) => {
                      event.stopPropagation();
                      lstItem.printData(event, item);
                    }}
                  />
                {/* ) : null} */}
              </div>
            ))
          ) : (
            <NoResults text={"No Vehicles Found"} />
          )}
        </>
      );
    } else if (config.searchId == "work_permit_search") {
      return (
        <>
          {lstItem.search.length > 0 ? (
            lstItem.search?.map((item, index) => (
              <div
                className="col-2"
                key={index}
                onClick={(e) => lstItem.searchFunc(e, item)}
              >
                <div className={`white ${item?.IsActive ? "select" : ""}`}>
                  <div className="widget-body">
                    <div className="visitor-name text-overflow-ellipsis white-space-nowrap overflow-hidden">
                      {item?.ContractorName}
                    </div>
                    <div className="emp-id">{item?.WorkPermitCode}</div>
                    <div className="visitor-company">
                      {item?.WorkPermitDate}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <NoResults text={"No Approved Work Permits Found"} />
          )}
        </>
      );
    }
  };

  return <>{renderSearchResults()}</>;
};

export const HostSearchBox = (props) => {
  const { handleEmployeeSelect, itemEmp, item } = props;
  return (
    <div
      className={`${!item.isIndCon && !item.isVisitor ? "col-2" : "col-4"}`}
      key={itemEmp?.UserId}
      onClick={(e) => handleEmployeeSelect(e, itemEmp)}
    >
      <div className={`white ${itemEmp?.IsActive ? "select" : ""}`}>
        <div className="widget-body">
          <div className="visitor-name text-overflow-ellipsis white-space-nowrap overflow-hidden">
            {itemEmp?.UserName} -
          </div>
          <div className="emp-id">{itemEmp?.UserId}</div>
          <div className="visitor-company">{itemEmp?.CompanyId}</div>
        </div>
      </div>
    </div>
  );
};

export const AppointmentSearch = (props) => {
  const {
    handleSearchAction,
    VisitorEntryBooked,
    handleBookedVisitor,
    editData,
  } = props;
  return (
    <div className="grid">
      <div className="col-12">
        <div className="white">
          <div className="widget-body">
            <div className="normal-table visitor-table">
              <table>
                <tbody>
                  <tr>
                    <td colSpan={2}>
                      <InputText
                        id="appointment_search"
                        placeholder="Enter Appointment Number"
                        className="w-full visitor-search"
                        onChange={(e) => {
                          e.target.value = e.target.value.toUpperCase();
                          handleSearchAction(e);
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="search-container">
          <div className="grid">
            {VisitorEntryBooked && VisitorEntryBooked.length > 0 ? (
              VisitorEntryBooked.map((itemBook, index) => {
                return (
                  <BookedSearchBox
                    key={index}
                    itemBook={itemBook}
                    handleBookedVisitor={handleBookedVisitor}
                    editData={editData}
                  />
                );
              })
            ) : (
              <NoResults text={"No Appointments Found !!!"} />
            )}
          </div>
        </div>
        {/* <SearchConfigCont
              item={false}
              routePage={routePage}
              handleSearchAction={handleSearchAction}
              VisitorNameList={[]}
              VisitorEmployeeList={[]}
              VisitorEntryBooked={VisitorEntryBooked}
              handleVisitorSelect={handleVisitorSelect}
              handleEmployeeSelect={handleEmployeeSelect}
              handleBookedVisitor={handleBookedVisitor}
            /> */}
      </div>
    </div>
  );
};

export const SearchContainer = (props) => {
  const {
    checked,
    selectedData,
    setVisible,
    searchConfig,
    VisitorNameList,
    VisitorEmployeeList,
    VehicleList,
    handleSearchAction,
    handleVehicleSelect,
    VisitorEntryBooked,
    handleBookedVisitor,
    setSelectedVisitor,
    setSelectedHost,
    selectedHost,
    handleEmployeeSelect,
    handleVisitorSelect,
    isIndCon,
    visitorShow,
    setVisitorShow,
    setVehicleShow,
    setCheckedVehicle,
    setEmployeeShow,
    editData,
    searchTerm,
    handleSelectedPop,
    handleEditData,
    openPrint,
    handleWorkPermitSelect,
    handleVehEntryCreate,
    WorkPermitList,
    resetAllVehForm,
  } = props;
  const routePage = useHistory();

  const [config, setConfig] = useState([]);

  useEffect(() => {
    switch (selectedData?.selectedType) {
      case 35:
        setConfig([
          {
            key: 0,
            type: selectedData?.selectedType,
            changeClass: "col-6",
            changeVis: false,
            searchId: "visit_search",
            changeTitle: "Visitor Name",
            btnTitle: "Add New Visitor",
            createBtn: true,
            search: true,
            createLnk: function () {
              handleSelectedPop();
            },
            changeList: [
              {
                search: VisitorNameList,
                searchFunc: function (e, item) {
                  handleVisitorSelect(item);
                },
                editData: function (e, item) {
                  handleEditData(item);
                },
              },
            ],
          },
          {
            key: 1,
            type: selectedData?.selectedType,
            changeClass: "col-6",
            changeVis: false,
            searchId: "host_search",
            changeTitle: "Person to Visit",
            btnTitle: "Add New Employee",
            createBtn: false,
            search: true,
            createLnk: function () {
              setEmployeeShow(true);
            },
            changeList: [
              {
                search: VisitorEmployeeList,
                searchFunc: function (e, item) {
                  handleEmployeeSelect(item);
                },
              },
            ],
          },
        ]);
        break;
      case 36:
        setConfig([
          {
            key: 3,
            type: selectedData?.selectedType,
            changeClass: "col-6",
            changeVis: false,
            searchId: "visit_search",
            changeTitle: "Visitor Name",
            btnTitle: "Add New Visitor",
            createBtn: true,
            search: true,
            createLnk: function () {
              handleSelectedPop();
            },
            changeList: [
              {
                search: VisitorNameList,
                searchFunc: function (e, item) {
                  if (item.Status != 2) {
                    handleVisitorSelect(item);
                  }
                },
                editData: function (e, item) {
                  handleEditData(item);
                },
              },
            ],
          },
          {
            key: 4,
            type: selectedData?.selectedType,
            changeClass: "col-6",
            changeVis: false,
            searchId: "host_search",
            changeTitle: "Person to Visit",
            btnTitle: "Add New Employee",
            createBtn: false,
            search: true,
            createLnk: function () {
              setEmployeeShow(true);
            },
            changeList: [
              {
                search: VisitorEmployeeList,
                searchFunc: function (e, item) {
                  handleEmployeeSelect(item);
                },
              },
            ],
          },
        ]);
        break;
      case 65:
        setConfig([
          {
            key: 5,
            type: selectedData?.selectedType,
            changeClass: "col-12",
            changeVis: false,
            searchId: "invoice_search",
            changeTitle: "Invoice",
            createBtn: true,
            search: false,
            createLnk: function () {},
            changeList: [
              {
                search: VehicleList,
                searchFunc: function (e, item) {
                  handleVehicleSelect(e, item);
                },
              },
            ],
          },
        ]);
        break;
      case 64:
        setConfig([
          {
            key: 6,
            type: selectedData?.selectedType,
            changeClass: "col-12",
            changeVis: false,
            searchId: "vehicle_search",
            changeTitle: "Vehicle",
            createBtn: false,
            search: true,
            createLnk: function () {
              routePage.push("/home/cVehicle");
              // setVehicleShow(true);
              setCheckedVehicle(true);
              setVisible(true);
            },
            changeList: [
              {
                search: VehicleList,
                searchFunc: function (e, item) {
                  handleVehicleSelect(e, item);
                },
              },
            ],
          },
        ]);
        break;
      case 66:
        setConfig([
          {
            key: 7,
            type: selectedData?.selectedType,
            changeClass: "col-12",
            changeVis: false,
            searchId: "vehicle_search",
            changeTitle: "Vehicle",
            createBtn: true,
            search: true,
            createLnk: function () {
              // routePage.push("/home/cVehicle");
              // setVehicleShow(true);
              // setCheckedVehicle(true);
              // setVisible(true);
              handleVehEntryCreate();
            },
            changeList: [
              {
                search: VehicleList,
                searchFunc: function (e, item) {
                  handleVehicleSelect(e, item);
                },
                printData: function (e, item) {
                  openPrint(e, item);
                },
              },
            ],
          },
        ]);
        break;
      case 100:
        setConfig([
          {
            key: 8,
            type: selectedData?.selectedType,
            changeClass: "col-12",
            changeVis: false,
            searchId: "work_permit_search",
            changeTitle: "Vendor",
            createBtn: false,
            search: true,
            createLnk: function () {
              routePage.push("/home/cVehicle");
              // setVehicleShow(true);
            },
            changeList: [
              {
                search: WorkPermitList,
                searchFunc: function (e, item) {
                  handleWorkPermitSelect(e, item);
                },
              },
            ],
          },
        ]);
        break;
    }
  }, [
    selectedData,
    VisitorNameList,
    VisitorEmployeeList,
    VehicleList,
    WorkPermitList,
  ]);

  return (
    <>
      {checked && (
        <AppointmentSearch
          handleSearchAction={handleSearchAction}
          VisitorEntryBooked={VisitorEntryBooked}
          handleBookedVisitor={handleBookedVisitor}
          editData={editData}
        />
      )}

      {!checked && (
        <div className="grid">
          {config.map((itemConf, index) => {
            return (
              <SearchConfigCont
                key={index}
                selectedData={selectedData}
                config={itemConf}
                routePage={routePage}
                handleSearchAction={handleSearchAction}
                VisitorNameList={VisitorNameList}
                VisitorEntryBooked={VisitorEntryBooked}
                VisitorEmployeeList={VisitorEmployeeList}
                handleVisitorSelect={handleVisitorSelect}
                handleEmployeeSelect={handleEmployeeSelect}
                VehicleList={VehicleList}
                searchTerm={searchTerm}
                WorkPermitList={WorkPermitList}
              />
            );
          })}
        </div>
      )}
      {/* {!checked && (
          <div className="grid">
            {searchConfig &&
              searchConfig.map((item, index) => {
                return item.isVisitor ? (
                  <SearchConfigCont
                    key={index}
                    item={item}
                    routePage={routePage}
                    handleSearchAction={handleSearchAction}
                    VisitorNameList={VisitorNameList}
                    VisitorEntryBooked={VisitorEntryBooked}
                    VisitorEmployeeList={VisitorEmployeeList}
                    handleVisitorSelect={handleVisitorSelect}
                    handleEmployeeSelect={handleEmployeeSelect}
                    VehicleList={VehicleList}
                  />
                ) : (
                  <SearchConfigCont
                    key={index}
                    item={item}
                    routePage={routePage}
                    handleSearchAction={handleSearchAction}
                    VisitorNameList={VisitorNameList}
                    VisitorEmployeeList={VisitorEmployeeList}
                    VisitorEntryBooked={VisitorEntryBooked}
                    handleVisitorSelect={handleVisitorSelect}
                    handleEmployeeSelect={handleEmployeeSelect}
                    VehicleList={VehicleList}
                  />
                );
              })}
          </div>
        )} */}
    </>
  );
};

export const SearchConfigCont = (props) => {
  const {
    selectedData,
    config,
    handleSearchAction,
    searchTerm,
    routePage,
    VisitorNameList,
    VisitorEmployeeList,
    handleVisitorSelect,
    handleEmployeeSelect,
    VisitorEntryBooked,
    handleBookedVisitor,
    VehicleList,
    WorkPermitList,
  } = props;

  return (
    <div className={`${config?.changeClass}`} hidden={config?.changeVis}>
      <div className="white">
        {config?.search ? (
          <div className="widget-body">
            <div className="normal-table visitor-table">
              <table>
                <tbody>
                  <tr>
                    <td colSpan={2}>
                      <InputText
                        id={config?.searchId}
                        placeholder={`Search ${config?.changeTitle}`}
                        className={`${
                          config?.createBtn ? "" : "w-full"
                        } visitor-search`}
                        onChange={(e) => {
                          handleSearchAction(e);
                        }}
                      />

                      {config?.createBtn ? (
                        <Button
                          label=""
                          title={config?.btnTitle}
                          icon="pi pi-plus-circle"
                          onClick={() => config?.createLnk()}
                          className="visitor-add text-center"
                        />
                      ) : null}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
      <div className="search-container">
        <div className="grid">
          {config.changeList.map((lstItem, index) => {
            return (
              <VistorSearchBox
                key={index}
                lstItem={lstItem}
                config={config}
                // VisitorNameList={VisitorNameList}
                // VisitorEntryBooked={[]}
                // handleVisitorSelect={handleVisitorSelect}
                // VisitorEmployeeList={VisitorEmployeeList}
                // handleEmployeeSelect={handleEmployeeSelect}
                // handleBookedVisitor={handleBookedVisitor}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
