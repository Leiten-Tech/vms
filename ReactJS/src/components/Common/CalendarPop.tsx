import React from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const CalendarPop = ({ visible, setVisible, handleclick, selectedEvent }) => {
  const { PersonName, start, end, MobileNo, Mail_Id, VisitorCompany } = selectedEvent || {};
  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">Event Details</span>
    </div>
  );
  const footerContent = (
    <div>
      <Button label="Ok" icon="pi pi-check" onClick={handleclick} autoFocus />
    </div>
  );
  return (
    <div>
      <div className="card flex justify-content-center">
        <Dialog
          visible={visible}
          modal
          header={headerElement}
          footer={footerContent}
          style={{ width: "50rem" }}
          onHide={() => setVisible(false)}
        >
          {selectedEvent ? (
            <p className="m-0">
              <div className="normal-table">
                <table className="dtl">
                  <tbody>
                    <tr>
                      <td style={{ width: "30%" }}>Visitor Name: </td>
                      <td style={{ width: "70%" }}>
                        <strong className="font-bold">{PersonName || "-"}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "30%" }}>Mobile No: </td>
                      <td style={{ width: "70%" }}>
                        <strong className="font-bold">{MobileNo || "-"}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "30%" }}>EmailID: </td>
                      <td style={{ width: "70%" }}>
                        <strong className="font-bold">{Mail_Id || "-"}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "30%" }}>Visitor Company: </td>
                      <td style={{ width: "70%" }}>
                        <strong className="font-bold">{VisitorCompany || "-"}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "30%" }}>Valid From: </td>
                      <td style={{ width: "70%" }}>
                        <strong className="font-bold">{start ? new Date(start).toLocaleString() : "N/A"}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "30%" }}>Valid To: </td>
                      <td style={{ width: "70%" }}>
                        <strong className="font-bold">{end ? new Date(end).toLocaleString() : "N/A"}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </p>
          ) : (
            <p>No event selected</p>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default CalendarPop;
