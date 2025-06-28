import { DocPNG, DocJPG, DocPDF } from "@/assets/css/img-library";
import { Column, DataTable } from "@/assets/css/prime-library";
import AppGridTable from "@/components/AppGridTable";
import AppTable from "@/components/AppTable";
import { CGrid } from "@/components/Common/CGrid";
import FormFields from "@/components/FormFields";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";

export const WorkerDetails = (props) => {
  const { wdProp, wGProp } = props;

  return (
    <>
      <div className="tab-parent-container scroll-y">
        <div className="grid">
          <div className="md:col-6 appointment-left">
            <div className="white">
              <div className="">
                <div className="widget-hdr">
                  {/* <div className="sub-title">
                    <div className="grid">
                      <div className="md:col-6">
                        <h2>Worker Information</h2>
                      </div>
                    </div>
                  </div> */}
                </div>
                <div className="widget-body">
                  <div className="normal-table">
                    <div className="grid">
                      <div className="col-12 md:col-12">
                        <div className="grid">
                          <FormFields
                            type={"text"}
                            name={"WorkerName"}
                            label={"Worker Name "}
                            options={""}
                            show={true}
                            required={true}
                            disable={wdProp?.isView}
                            optionLabel={""}
                            optionValue={""}
                            handleSelect={""}
                            fldStyle={"col-12 md:col-6"}
                            maxLength={50}
                            formik={wdProp?.wdFormik}
                          />
                          <FormFields
                            type={"Calendar"}
                            name={"WpContractValidity"}
                            label={"Worker Validity "}
                            options={""}
                            show={true}
                            required={true}
                            disable={wdProp?.isView || false}
                            optionLabel={""}
                            optionValue={""}
                            handleChange={wdProp?.handleChange}
                            fldStyle={"col-12 md:col-6"}
                            formik={wdProp?.wdFormik}
                            minDate={
                              wdProp?.wdFormik?.values?.VendorValidity &&
                              wdProp?.wdFormik?.values?.VendorValidity.length >
                                0 &&
                              wdProp?.wdFormik?.values?.VendorValidity[0] &&
                              wdProp?.wdFormik?.values?.VendorValidity[0] !== ""
                                ? new Date(
                                    wdProp.wdFormik.values.VendorValidity[0]
                                  )
                                : wdProp?.wdFormik?.values?.ContractValidity &&
                                  wdProp?.wdFormik?.values?.ContractValidity
                                    .length > 0 &&
                                  wdProp?.wdFormik?.values
                                    ?.ContractValidity[0] &&
                                  wdProp?.wdFormik?.values
                                    ?.ContractValidity[0] !== ""
                                ? new Date(
                                    wdProp.wdFormik.values.ContractValidity[0]
                                  )
                                : new Date()
                            }
                            maxDate={
                              wdProp?.wdFormik?.values?.VendorValidity &&
                              wdProp?.wdFormik?.values?.VendorValidity.length >
                                1 &&
                              wdProp?.wdFormik?.values?.VendorValidity[1] &&
                              wdProp?.wdFormik?.values?.VendorValidity[1] !== ""
                                ? new Date(
                                    wdProp.wdFormik.values.VendorValidity[1]
                                  )
                                : wdProp?.wdFormik?.values?.ContractValidity &&
                                  wdProp?.wdFormik?.values?.ContractValidity
                                    .length > 1 &&
                                  wdProp?.wdFormik?.values
                                    ?.ContractValidity[1] &&
                                  wdProp?.wdFormik?.values
                                    ?.ContractValidity[1] !== ""
                                ? new Date(
                                    wdProp.wdFormik.values.ContractValidity[1]
                                  )
                                : null
                            }
                            selectionMode={"range"}
                          />
                          <FormFields
                            type={"text_title"}
                            name={"WorkerPhoneNo"}
                            label={"Phone No "}
                            options={wdProp?.phonenumber}
                            show={true}
                            required={true}
                            disable={wdProp?.isView}
                            optionLabel={"CountryCode"}
                            optionValue={"CountryCode"}
                            handleSelect={wdProp?.handleSelect}
                            handleKeyPress={wdProp?.updatePhoneNo}
                            optionDisable={true}
                            fldStyle={"col-12 md:col-6"}
                            formik={wdProp?.wdFormik}
                            keyfilter="int"
                            maxLength={10}
                            minLength={10}
                            titleInputName={"CountryCode"}
                          />
                          <FormFields
                            type={"text"}
                            name={"WorkerMailID"}
                            label={"Worker Mail ID "}
                            options={""}
                            show={true}
                            required={false}
                            disable={wdProp?.isView}
                            optionLabel={""}
                            optionValue={""}
                            handleSelect={""}
                            fldStyle={"col-12 md:col-6"}
                            maxLength={50}
                            formik={wdProp?.wdFormik}
                          />
                          <FormFields
                            type={"select"}
                            name={"WorkerStatus"}
                            label={"Worker Status "}
                            options={wdProp?.workerStatusList}
                            show={true}
                            required={false}
                            disable={wdProp?.isCreate || wdProp?.isView}
                            optionLabel={"MetaSubDescription"}
                            optionValue={"MetaSubId"}
                            handleSelect={wdProp?.handleSelect}
                            fldStyle={"col-12 md:col-6"}
                            formik={wdProp?.wdFormik}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="widget-hdr">
                  <div className="sub-title">
                    <div className="grid">
                      <div className="md:col-6">
                        <h2>Worker Documents</h2>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="widget-body">
                  <div className="normal-table">
                    <div className="grid">
                      <div className="col-12 md:col-4">
                        <div className="grid">
                          <FormFields
                            type={"select"}
                            name={"WorkerDocType"}
                            label={"Choose Doc Type "}
                            options={wdProp?.workDocTypes}
                            show={true}
                            required={true}
                            disable={wdProp?.isView}
                            optionLabel={"MetaSubDescription"}
                            optionValue={"MetaSubId"}
                            handleSelect={(name, other, value) =>
                              wdProp?.onChangeWorkerDocType(name, other, value)
                            }
                            fldStyle={"col-12"}
                            formik={wdProp?.wdFormik}
                          />
                          <FormFields
                            type={"text"}
                            name={"WorkerDocNumber"}
                            label={"Doc Number "}
                            options={""}
                            show={true}
                            required={true}
                            disable={wdProp?.isView}
                            optionLabel={""}
                            optionValue={""}
                            handleSelect={""}
                            fldStyle={"col-12"}
                            maxLength={30}
                            formik={wdProp?.wdFormik}
                          />
                          
                        </div>
                      </div>
                      <div className="col-12 md:col-3">
                        <div className="grid">
                          <div className="col-12">
                            <FileUpload
                              mode="basic"
                              name="WorkerFileUpload"
                              className="docs-upload"
                              chooseOptions={wdProp?.docUpload}
                              // accept="image/*"
                              auto
                              maxFileSize={1000000}
                              chooseLabel="Upload File"
                              customUpload
                              onSelect={(event) =>
                                wdProp?.workerDocUpload(event)
                              }
                              ref={wdProp?.WorkerDocRef}
                              disabled={
                                wdProp?.isView ||
                                wdProp?.wdFormik.values.WorkerDocType == null ||
                                wdProp?.wdFormik.values.WorkerDocType == "" ||
                                wdProp?.wdFormik.values.WorkerDocNumber ==
                                  null ||
                                wdProp?.wdFormik.values.WorkerDocNumber == ""
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 md:col-5">
                        <Tooltip target=".docs-preview-container.white" />
                        <div className="grid">
                          {wdProp?.workerTempDocs &&
                            wdProp?.workerTempDocs.length > 0 &&
                            wdProp?.workerTempDocs.map((item, index) => {
                              return (
                                <div className="col-12 text-center" key={index}>
                                  <div
                                    className="docs-preview-container bg-gray-300 p-2 white m-auto"
                                    onClick={() => wdProp?.previewFile(item)}
                                    data-pr-tooltip={item.DocumentType}
                                    data-pr-position="top"
                                  >
                                    <div className="flex gap-2">
                                      <img
                                        className="w-3rem h-3rem"
                                        src={
                                          item &&
                                          item.hasOwnProperty("file") &&
                                          item?.file?.type == "image/png"
                                            ? DocPNG
                                            : (item &&
                                                item.hasOwnProperty("file") &&
                                                item?.file?.type ==
                                                  "image/jpeg") ||
                                              (item &&
                                                item.hasOwnProperty("file") &&
                                                item?.file?.type == "image/jpg")
                                            ? DocJPG
                                            : DocPDF
                                        }
                                        alt="logo"
                                      />
                                      <div className="flex flex-column align-items-start">
                                        <div className="font-bold">
                                          {item?.WorkerDocTypeName}
                                        </div>
                                        <div>
                                          {item?.DocumentNo ||
                                            item?.WorkerDocRefNo}
                                        </div>
                                      </div>
                                    </div>
                                    <a
                                      className="img-preview-close"
                                      title="Delete"
                                      aria-disabled={wdProp?.isView}
                                      onClick={(e) =>
                                        wdProp?.deleteWorkerFile(item, e , index)
                                      }
                                    >
                                      <i className="las la-times-circle"></i>
                                    </a>
                                  </div>
                                </div>
                              );
                            })}
                          {/* <div className="col-4 md:col-4 text-center">
                            <div
                              className="docs-preview-container white m-auto"
                              onClick={() => setVisible(true)}
                              data-pr-tooltip="Registration Certificate"
                              data-pr-position="top"
                            >
                              <img src={DocPDF} alt="logo" />
                              <a className="img-preview-close" title="Delete">
                                <i className="las la-times-circle"></i>
                              </a>
                            </div>
                          </div>
                          <div className="col-4 md:col-4 text-center">
                            <div
                              className="docs-preview-container white m-auto"
                              onClick={() => setVisible(true)}
                              data-pr-tooltip="Aadhaar"
                              data-pr-position="top"
                            >
                              <img src={DocWord} alt="logo" />
                              <a className="img-preview-close" title="Delete">
                                <i className="las la-times-circle"></i>
                              </a>
                            </div>
                          </div>
                          <div className="col-4 md:col-4 text-center">
                            <div
                              className="docs-preview-container white m-auto"
                              onClick={() => setVisible(true)}
                              data-pr-tooltip="ESI Doc"
                              data-pr-position="top"
                            >
                              <img src={DocJPG} alt="logo" />
                              <a className="img-preview-close" title="Delete">
                                <i className="las la-times-circle"></i>
                              </a>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="widget-foot">
                  <div className="md:col-12 text-right border-top-1 border-gray-300 page-title pt-2">
                    <div className="">
                      <Button
                        label="Clear"
                        title="Clear"
                        severity="danger"
                        icon="pi pi-ban"
                        className="text-center"
                        disabled={wdProp?.isView}
                        onClick={() => wdProp?.resetWorker()}
                      />
                      <Button
                        label={wdProp && wdProp?.workerMode ? "Add" : "Update"}
                        severity="success"
                        icon="las la-arrow-right"
                        title={wdProp && wdProp?.workerMode ? "Add" : "Update"}
                        className="text-center"
                        disabled={wdProp?.isView}
                        onClick={(colItem) => wdProp?.addWorker(event, colItem)}
                        type="submit"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-6 appointment-right white">
            <div className="h-full align-content-start flex flex-column justify-content-between">
              <div>
                <div className="widget-hdr">
                  <div className="sub-title">
                    <div className="grid">
                      <div className="md:col-6">
                        <h2>Workers Details</h2>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="widget-body">
                  <div className="card">
                    <CGrid cgProp={wGProp}/>
                  </div>
                </div>
              </div>
              {wdProp.hasOwnProperty("handleWpDetailNext") ? (
                <div className="border-top-1 border-gray-300 page-title pt-2 mt-4">
                  <div className="text-right">
                    <Button
                      label="Next"
                      icon="pi pi-arrow-right"
                      onClick={() =>
                        wdProp.handleWpDetailNext({
                          index: 2,
                        })
                      }
                      autoFocus
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
    // <>
    //   <div className="grid">
    //     <div className="md:col-6 appointment-left">
    //       <div className="white">
    //         <div className="widget-hdr">
    //           <div className="sub-title">
    //             <div className="grid">
    //               <div className="md:col-6">
    //                 <h2>Worker Information</h2>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="widget-body">
    //           <div className="normal-table">
    //             <div className="grid">
    //               <div className="col-12 md:col-12">
    //                 <div className="grid">
    //                   <FormFields
    //                     type={"text"}
    //                     name={"WorkerName"}
    //                     label={"Worker Name "}
    //                     options={""}
    //                     show={true}
    //                     required={true}
    //                     disable={isView}
    //                     optionLabel={""}
    //                     optionValue={""}
    //                     handleSelect={""}
    //                     fldStyle={"col-12 md:col-6"}
    //                     formik={wdFormik}
    //                   />
    //                   <FormFields
    //                     type={"text_title"}
    //                     name={"WorkerPhoneNo"}
    //                     label={"Phone No "}
    //                     options={phonenumber}
    //                     show={true}
    //                     required={true}
    //                     disable={isView}
    //                     optionLabel={"CountryCode"}
    //                     optionValue={"CountryCode"}
    //                     handleSelect={handleSelect}
    //                     optionDisable={true}
    //                     fldStyle={"col-12 md:col-6"}
    //                     formik={wdFormik}
    //                     keyfilter="int"
    //                     maxLength={10}
    //                     minLength={10}
    //                     titleInputName={"CountryCode"}
    //                   />
    //                   <FormFields
    //                     type={"text"}
    //                     name={"WorkerMailID"}
    //                     label={"Worker Mail ID "}
    //                     options={""}
    //                     show={true}
    //                     required={false}
    //                     disable={isView}
    //                     optionLabel={""}
    //                     optionValue={""}
    //                     handleSelect={""}
    //                     fldStyle={"col-12 md:col-6"}
    //                     formik={wdFormik}
    //                   />
    //                   <FormFields
    //                     type={"select"}
    //                     name={"WorkerStatus"}
    //                     label={"Worker Status "}
    //                     options={workerStatusList}
    //                     show={true}
    //                     required={false}
    //                     disable={isCreate || isView}
    //                     optionLabel={"MetaSubDescription"}
    //                     optionValue={"MetaSubId"}
    //                     handleSelect={handleSelect}
    //                     fldStyle={"col-12 md:col-6"}
    //                     formik={wdFormik}
    //                   />
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="md:col-6 appointment-right">
    //       <div className="white">
    //         <div className="widget-hdr">
    //           <div className="sub-title">
    //             <div className="grid">
    //               <div className="md:col-6">
    //                 <h2>Worker Documents</h2>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="widget-body">
    //           <div className="normal-table">
    //             <div className="grid">
    //               <div className="col-12 md:col-4">
    //                 <div className="grid">
    //                   <FormFields
    //                     type={"select"}
    //                     name={"WorkerDocType"}
    //                     label={"Choose Doc Type "}
    //                     options={workDocTypes}
    //                     show={true}
    //                     required={true}
    //                     disable={isView}
    //                     optionLabel={"MetaSubDescription"}
    //                     optionValue={"MetaSubId"}
    //                     handleSelect={handleSelect}
    //                     fldStyle={"col-12"}
    //                     formik={wdFormik}
    //                   />
    //                   <FormFields
    //                     type={"text"}
    //                     name={"WorkerDocNumber"}
    //                     label={"Doc Number "}
    //                     options={""}
    //                     show={true}
    //                     required={true}
    //                     disable={isView}
    //                     optionLabel={""}
    //                     optionValue={""}
    //                     handleSelect={""}
    //                     fldStyle={"col-12"}
    //                     formik={wdFormik}
    //                   />
    //                 </div>
    //               </div>
    //               <div className="col-12 md:col-3">
    //                 <div className="grid">
    //                   <div className="col-12">
    //                     <FileUpload
    //                       mode="basic"
    //                       name="WorkerFileUpload"
    //                       className="docs-upload"
    //                       chooseOptions={docUpload}
    //                       // accept="image/*"
    //                       auto
    //                       maxFileSize={1000000}
    //                       chooseLabel="Upload File"
    //                       customUpload
    //                       onSelect={(event) => workerDocUpload(event)}
    //                       ref={WorkerDocRef}
    //                       disabled={
    //                         isView ||
    //                         wdFormik.values.WorkerDocType == null ||
    //                         wdFormik.values.WorkerDocType == "" ||
    //                         wdFormik.values.WorkerDocNumber == null ||
    //                         wdFormik.values.WorkerDocNumber == ""
    //                       }
    //                     />
    //                   </div>
    //                 </div>
    //               </div>
    //               <div className="col-12 md:col-5">
    //                 <Tooltip target=".docs-preview-container.white" />
    //                 <div className="grid">
    //                   {workerDocs &&
    //                     workerDocs.map((item) => {
    //                       return (
    //                         <div className="col-4 md:col-4 text-center">
    //                           <div
    //                             className="docs-preview-container white m-auto"
    //                             onClick={() => previewFile(item)}
    //                             data-pr-tooltip={item.CompanyDocType}
    //                             data-pr-position="top"
    //                           >
    //                             <img
    //                               src={
    //                                 item &&
    //                                 item.hasOwnProperty("file") &&
    //                                 item?.file?.type == "image/png"
    //                                   ? DocPNG
    //                                   : (item &&
    //                                       item.hasOwnProperty("file") &&
    //                                       item?.file?.type == "image/jpeg") ||
    //                                     (item &&
    //                                       item.hasOwnProperty("file") &&
    //                                       item?.file?.type == "image/jpg")
    //                                   ? DocJPG
    //                                   : DocPDF
    //                               }
    //                               alt="logo"
    //                             />
    //                             <a
    //                               className="img-preview-close"
    //                               title="Delete"
    //                               aria-disabled={isView}
    //                               onClick={(e) => deleteWorkerFile(item, e)}
    //                             >
    //                               <i className="las la-times-circle"></i>
    //                             </a>
    //                           </div>
    //                         </div>
    //                       );
    //                     })}
    //                   {/* <div className="col-4 md:col-4 text-center">
    //                         <div
    //                           className="docs-preview-container white m-auto"
    //                           onClick={() => setVisible(true)}
    //                           data-pr-tooltip="Registration Certificate"
    //                           data-pr-position="top"
    //                         >
    //                           <img src={DocPDF} alt="logo" />
    //                           <a className="img-preview-close" title="Delete">
    //                             <i className="las la-times-circle"></i>
    //                           </a>
    //                         </div>
    //                       </div>
    //                       <div className="col-4 md:col-4 text-center">
    //                         <div
    //                           className="docs-preview-container white m-auto"
    //                           onClick={() => setVisible(true)}
    //                           data-pr-tooltip="Aadhaar"
    //                           data-pr-position="top"
    //                         >
    //                           <img src={DocWord} alt="logo" />
    //                           <a className="img-preview-close" title="Delete">
    //                             <i className="las la-times-circle"></i>
    //                           </a>
    //                         </div>
    //                       </div>
    //                       <div className="col-4 md:col-4 text-center">
    //                         <div
    //                           className="docs-preview-container white m-auto"
    //                           onClick={() => setVisible(true)}
    //                           data-pr-tooltip="ESI Doc"
    //                           data-pr-position="top"
    //                         >
    //                           <img src={DocJPG} alt="logo" />
    //                           <a className="img-preview-close" title="Delete">
    //                             <i className="las la-times-circle"></i>
    //                           </a>
    //                         </div>
    //                       </div> */}
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="text-center mb-2">
    //     <Button
    //       label="Add"
    //       title="Save"
    //       icon="pi pi-save"
    //       className="text-center"
    //       onClick={() => addWorker()}
    //       disabled={isDisableSave || isView}
    //     />
    //     <Button
    //       label="Clear"
    //       severity="danger"
    //       icon="pi pi-trash"
    //       title="Clear"
    //       className="text-center"
    //       onClick={() => resetWorker()}
    //       disabled={isDisableSave || isView}
    //     />
    //   </div>
    //   <div className="white">
    //     <div className="widget-hdr">
    //       <div className="sub-title">
    //         <div className="grid">
    //           <div className="md:col-6">
    //             <h2>Workers List</h2>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="widget-body">
    //       <div className="card">
    //         <DataTable
    //           value={workPermitWorkers}
    //           showGridlines
    //           paginator
    //           filters={filters}
    //           filterDisplay="menu"
    //           globalFilterFields={[
    //             "WorkerName",
    //             "WorkerPhoneNo",
    //             "WorkerMailID",
    //             "WorkerStatus",
    //           ]}
    //           header={header}
    //           emptyMessage="No Data found."
    //           rows={50}
    //           rowsPerPageOptions={[5, 10, 25, 50, 100]}
    //           tableStyle={{ minWidth: "50rem" }}
    //         >
    //           <Column
    //             field={"Action"}
    //             header={"Action"}
    //             style={{
    //               textAlign: "center",
    //             }}
    //             body={actionBodyTemplate}
    //             headerClassName="text-center"
    //           ></Column>
    //           <Column
    //             sortable
    //             field="WorkerName"
    //             header="Visitor Name"
    //           ></Column>
    //           <Column
    //             sortable
    //             field="WorkerMailID"
    //             header="Worker Mail ID"
    //           ></Column>
    //           <Column sortable field="WorkerPhoneNo" header="Phone No"></Column>
    //           <Column
    //             sortable
    //             field="WorkerDocs"
    //             header="Worker Docs"
    //             body={filesContent}
    //           ></Column>
    //           <Column
    //             sortable
    //             field="WorkerStatus"
    //             header="Worker Status"
    //           ></Column>
    //           <Column sortable field="IsIncharge" header="Is Incharge"></Column>
    //         </DataTable>
    //       </div>
    //     </div>
    //   </div>
    // </>
  );
};
