import { GetVisitor } from "@/redux/slices/DashBoard/DashBoardSlice";
import { NoImg } from "../../assets/css/img-library";
import { Toast } from "primereact/toast";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const VisitorDashboard = () => {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [VisitorList, setVisitorList] = useState([]);
  const [VechicleList, setVechicleList] = useState([]);

  const query = useQuery();
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);

  const fetchVisitor = () => {
    const obj = {
      UserId: +localStorage["UserId"],
      type: "",
      CompanyId: +localStorage["CompanyId"],
      PlantId: +localStorage["PlantId"],
      RoleId: +localStorage["DefaultRoleId"],
    };

    var result = dispatch(GetVisitor(obj));
    result
      .then((res) => {
        if (res.payload.transtatus.result) {
          const VisitorList = res.payload.VisitorList;
          const VechicleList = res.payload.VechicleList;

          setVisitorList(VisitorList);
          setVechicleList(VechicleList);
        } else {
          toast.current?.show({
            severity: "error",
            detail: "Error",
            summary:
              res.payload.transtatus?.lstErrorItem?.[0]?.Message ??
              "Unknown error",
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          detail: "Error",
          summary: JSON.stringify(error),
        });
      });
  };

  useEffect(() => {
    // Add body class
    document.body.classList.add("tv-bg");

    // Function to update time
    const updateDateTime = () => {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, "0");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = monthNames[now.getMonth()];
      const year = now.getFullYear();

      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const formattedHours = hours.toString().padStart(2, "0");

      const formattedDateTime = `${day} ${month} ${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
      setCurrentDateTime(formattedDateTime);
    };

    // Initial call
    updateDateTime();

    fetchVisitor();

    // Start timer
    const interval = setInterval(updateDateTime, 1000);
    const intervalId = setInterval(fetchVisitor, 60000); // 60000 ms = 1 minute

    // Cleanup
    return () => {
      document.body.classList.remove("tv-bg");
      clearInterval(interval);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="page-container tv-container">
      <div className="p20">
        <div className="grid">
          <div className="col-3">
            <h3>Leiten Smart VMS</h3>
          </div>
          <div className="col-6 text-center">
            <h2>Visitor Entry Dashboard</h2>
          </div>
          <div className="col-3 text-end">
            <h4>{currentDateTime}</h4> {/* ✅ Live date & time here */}
          </div>
        </div>
        <div className="grid">
          <div className="col-12 text-end">
            <div className="visitor-legend p10">
              <div className="visitor-legend-text inline-block vertical-align-middle uppercase mr20"></div>
            </div>
          </div>
        </div>
        {/* VISITOR SECTION */}
        {VisitorList?.length > 0 && (
          <>
            <div className="col-3">
              <div className="visitor-status visitor-status02 inline-block vertical-align-middle mr20">
                &nbsp;
              </div>
              <h4 className="visitor-legend-text inline-block vertical-align-middle uppercase mr20">
                Visitor Entry :
              </h4>
            </div>

            <div className="grid">
              {VisitorList.map((visitor, index) => (
                <div className="col-4" key={index}>
                  <div className="visitor-container p10">
                    <div className="visitor-tv-photo mr25">
                      <img
                        src={visitor.VisitorImageUrl || NoImg}
                        alt={visitor.VisitorImageUrl}
                        className="w-full"
                      />
                      {visitor.VisitorTypeName && (
                        <div
                          className={`visitor-status ${
                            visitor.VisitorTypeId === 66
                              ? "visitor-status03"
                              : "visitor-status02"
                          } uppercase inline-block p510 mb5`}
                        >
                          {visitor.VisitorTypeName}
                        </div>
                      )}
                    </div>
                    <div className="visitor-tv-info">
                      <div className="visitor-status visitor-status01 inline-block p510 mb5">
                        {visitor.VisitorEntryCode}
                      </div>
                      <div className="visitor-time inline-block">
                        {visitor.ValidFrom}
                      </div>
                      <div
                        className="visitor-tv-name ellipsis mb10"
                        style={{ width: "320px" }}
                      >
                        {/* {visitor.PersonLabel} : {visitor.PersonName} */}
                        {visitor.PersonName}
                      </div>
                      {visitor.VisitedEmployeeName && (
                        <div className="host-tv-name ellipsis mb10">
                          {visitor.HostLabel} : {visitor.VisitedEmployeeName}
                        </div>
                      )}
                      {visitor.AreaToVisitName && (
                        <div className="host-tv-name ellipsis mb10">
                          {visitor.AreaLabel} : {visitor.AreaToVisitName}
                        </div>
                      )}

                      <div className="tv-pass-type tv-pass-type01 text-center p5 uppercase">
                        {visitor.PurposeOfVisitName}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* VEHICLE SECTION */}
        {VechicleList?.length > 0 && (
          <>
            <div className="col-3">
              <div className="visitor-status visitor-status03 inline-block vertical-align-middle mr20">
                &nbsp;
              </div>
              <h4 className="visitor-legend-text inline-block vertical-align-middle uppercase mr20">
                Vehicle Entry :
              </h4>
            </div>
            <div className="grid">
              {VechicleList.map((visitor, index) => (
                <div className="col-4" key={index}>
                  <div className="visitor-container p10">
                    <div className="visitor-tv-photo mr25">
                      <img
                        src={visitor.VisitorImageUrl || NoImg}
                        alt={visitor.VisitorImageUrl}
                        className="w-full"
                      />
                      {visitor.VisitorTypeName && (
                        <div
                          className={`visitor-status ${
                            visitor.VisitorTypeId === 66
                              ? "visitor-status03"
                              : "visitor-status02"
                          } uppercase inline-block p510 mb5`}
                        >
                          {visitor.VisitorTypeName}
                        </div>
                      )}
                    </div>
                    <div className="visitor-tv-info">
                      <div className="visitor-status visitor-status01 inline-block p510 mb5">
                        {visitor.VisitorEntryCode}
                      </div>
                      <div className="visitor-time inline-block">
                        {visitor.ValidFrom}
                      </div>
                      <div
                        className="visitor-tv-name ellipsis mb10"
                        style={{ width: "320px" }}
                      >
                        {/* {visitor.PersonLabel} : {visitor.PersonName} */}
                        {visitor.PersonName}
                      </div>
                      {visitor.VisitedEmployeeName && (
                        <div className="host-tv-name ellipsis mb10">
                          {visitor.HostLabel} : {visitor.VisitedEmployeeName}
                        </div>
                      )}
                      {visitor.AreaToVisitName && (
                        <div className="host-tv-name ellipsis mb10">
                          {visitor.AreaLabel} : {visitor.AreaToVisitName}
                        </div>
                      )}
                      <div className="tv-pass-type tv-pass-type01 text-center p5 uppercase">
                        {visitor.PurposeOfVisitName}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* NO ENTRY FALLBACK */}
        {!VisitorList?.length && !VechicleList?.length && (
          <div className="grid">
            <div className="col-4"></div>
            <div className="col-4">
              <div className="visitor-container p10">
                <div className="visitor-tv-container mr25 text-center">
                  <h4>NO ENTRY FOUND.</h4>
                </div>
              </div>
            </div>
            <div className="col-4"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorDashboard;
