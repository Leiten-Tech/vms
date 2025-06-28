import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { RoleWiseScreenValidationSchema } from "@/validations/Master";

import {
  AutoComplete,
  Button,
  FilterMatchMode,
  InputSwitch,
  InputText,
  Toast,
} from "@/assets/css/prime-library";
import { DataTable } from "primereact/datatable";
import { Column, ColumnEditorOptions, ColumnEvent } from "primereact/column";
import PageHeader from "@/components/PageHeader";

import AppAlert from "../../../alert/alert";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { AutoCompleteCompleteEvent } from "primereact/autocomplete";
import AppGridTable from "@/components/AppGridTable";
import {
  Create,
  CreateInit,
  fetch,
  FilterCategory,
  update,
} from "@/redux/slices/master/categorySlice";
import { tLDS } from "@/utils/utilFunc";

const CCategoryCPMapping = () => {
  const [selectedData, setSelectedData] = useState([]);
  const route = useHistory();
  const [tableGroupBy, setTableGroupBy] = useState("CategoryId");
  const [savedCategory, setSavedCategory] = useState([]);
  const [categoryName, setCategoryName] = useState<any>();
  const [statusList, setStatusList] = useState();
  const [suggestions, setSuggestions] = useState([]);
  const [category, setCategory] = useState<any>([
    {
      "S.No": 1,
      Action: true,
      CategoryName: "",
      CategoryId: "1",
      Suggestions: [],
      isEditing: false,
      CheckPoints: "",
    },
  ]);
  const [newCategory, setNewCategory] = useState([]);

  const [listForCreate, setListForCreate] = useState([]);
  const [globalFilter, setGlobalFilter] = useState();
  const [modules, setModules] = useState([]);
  const CategoryRef = useRef(null);
  const [allcategory, setAllcategory] = useState([]);

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    if (createEditData != null) {
      const data = {
        CategoryId: createEditData.CategoryId,
        Taskname: "CREATEINITIALIZE",
      };
      var result = dispatch(CreateInit(data));

      result
        .then((res) => {
          if (res.payload.tranStatus.result) {
            setStatusList(res.payload.StatusList);
            if (
              res.payload.CategoryMapList &&
              res.payload.CategoryMapList.length > 0
            ) {
              setCategoryName(res.payload.CategoryMapList[0].CategoryName);
              
            }
            if(res.payload.CategoryMapDetailList &&
              res.payload.CategoryMapDetailList.length > 0
            ){
              loadTableGrid(res.payload.CategoryMapDetailList);
            }
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error Message",
              detail: res.payload.tranStatus.lstErrorItem[0].Message,
            });
          }
        })
        .catch((error) => {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: JSON.stringify(error),
          });
        });
    } else {
      const data = {
        RoleId: localStorage["DefaultRoleId"],
        CompanyId: localStorage["CompanyId"],
        Taskname: "CreateInitialize",
        CategoryId: 0,
      };
      var result = dispatch(CreateInit(data));
      result
        .then((res) => {
          if (res.payload.tranStatus.result) {
            let tempcategorylist = res.payload.CategoryMapList;
            setStatusList(res.payload.StatusList);
            if (tempcategorylist && tempcategorylist.length > 0) {
              loadTableGrid(tempcategorylist);
            }
            //  else {
            //   toast.current?.show({
            //     severity: "warn",
            //     summary: "Warning Message",
            //     detail: res.payload.tranStatus.lstErrorItem[0].Message,
            //   });
            // }
            // } else {
            //   toast.current?.show({
            //     severity: "error",
            //     summary: "Error Message",
            //     detail: res.payload.tranStatus.lstErrorItem[0].Message,
            //   });
          }
        })
        .catch((error) => {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: JSON.stringify(error),
          });
        });
      // const data = {
      //   CategoryId: 0,
      //   Taskname: "CREATEINITIALIZE",
      // };
      // dispatch(CreateInit(data));
    }
  }, []);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const TableHeader = () => {
    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      let _filters = { ...filters };

      _filters["global"].value = value;

      setFilters(_filters);
      setGlobalFilterValue(value);
    };

    return (
      <div className="flex justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
          />
        </span>
      </div>
    );
  };
  const {
    ModuleList,
    RoleMasterList,
    RolewiseScreenMappingViewList,
    AllScreens,
    isCreate,
    FunctionRoleMapList,
    createEditData,
    isView,
    loading,
  } = useSelector((state: any) => state.category);

  const toast = useRef<Toast>(null);
  const dispatch: any = useDispatch();

  const resetForm = () => {
    formik.resetForm();
    setCategoryName(null);
    setCategory([
      {
        "S.No": 1,
        Action: true,
        CategoryName: "",
        CategoryId: "",
        Suggestions: [],
        isEditing: false,
        CheckPoints: "",
      },
    ]);
  };

  const formik: any = useFormik({
    initialValues: {
      CPMapId: createEditData != null ? createEditData.CPMapId : 0,
      CategoryId: createEditData != null ? createEditData.CategoryId : null,
      CategoryName: createEditData != null ? createEditData.CategoryName : null,
      Status: createEditData != null ? createEditData.Status : 1,
      CreatedBy:
        createEditData != null
          ? createEditData.CreatedBy
          : +localStorage["UserId"],
      CreatedOn:
        createEditData != null ? createEditData.CreatedOn : tLDS(new Date()),
      ModifiedBy: createEditData != null ? createEditData.ModifiedBy : null,
      ModifiedOn: createEditData != null ? createEditData.ModifiedOn : null,
      IsSysGenerated:
        createEditData != null ? createEditData.IsSysGenerated : 0,
    },
    validationSchema: RoleWiseScreenValidationSchema,
    onSubmit: (values: any, { resetForm }) => {},
  });

  const handleClick = (event, rowData) => {
    
    if (isView) return;
    const updatedCategory = category.map((item) => {
      if (
        item["S.No"] === rowData["S.No"]
      ) {
        return { ...item, isEditing: true };
      }
      return item;
    });

    setCategory(updatedCategory);
  };
  const handleBlur = (event, rowData) => {
    
    const updatedCategory = category.map((item) => {
      if (
        item.CategoryName === rowData.CategoryName &&
        item["S.No"] === rowData["S.No"]
      ) {
        return { ...item, isEditing: false };
      }
      return item;
    });

    setCategory(updatedCategory);
  };

  const handleChange = (event, rowData) => {
    const updatedCategory = category.map((item) => {
      if (
        item.CategoryName === rowData.CategoryName &&
        item["S.No"] === rowData["S.No"]
      ) {
        return { ...item, CheckPoints: event.target.value };
      }
      return item;
    });

    setCategory(updatedCategory);
  };
  const resetAllForm = () => {
    formik.resetForm();
    setListForCreate([]);
  };

  useEffect(() => {
    setSelectedData(RolewiseScreenMappingViewList);
  }, [RolewiseScreenMappingViewList]);

  const handleModuleSelect = (name, other, value) => {
    formik.setFieldValue("Module", value);
    formik.setFieldValue(name, value);
    let FilteredList = AllScreens.filter((f) =>
      value.some((x) => x == f.ModuleId)
    );
  };

  const [pageConfig, setPageConfig] = useState({
    pageTitle: "Category CheckPoints Mapping",
    pageHeader: {
      pageActions: [
        {
          create: false,
          clear: true,
          save: true,
          createQuery: " ",
        },
      ],
    },
    tableCheckSelection: false,
    tableAction: true,
    tableActionStyle: {
      maxWidth: "4.5rem",
      textAlign: "center",
      justifySelf: "center",
    },
    tableRows: 50,
    tableRowsOptions: [25, 50, 100],
    tablePagination: true,
    tableActions: [
      {
        title: "View",
        name: "view",
      },
      {
        title: "Edit",
        name: "edit",
      },
      {
        title: "Delete",
        name: "delete",
      },
    ],
    tableColumns: [
      {
        title: "Action",
        name: "Action",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "16rem",
        },
      },
      {
        title: "Category Name",
        name: "CategoryName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "CheckPoints",
        name: "CheckPoints",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
    ],
  });

  const handleAdd = (event, rowData) => {
    event.stopPropagation();
    //setTableGroupBy("CategoryName");

    // Create a new row with the same GrpId and CategoryName as rowData
    const newRow = {
      "S.No": category.length + 1,
      Id: category.length + 1,
      GrpId: rowData.GrpId, // Use the same GrpId
      CategoryName: rowData.CategoryName, // Use the same CategoryName
      CategoryId: `New Cat: ${category.length + 1}`,
      isEditing: true,
      Action: true,
      Suggestions: [],
      CheckPoints: "",
      IsSysGenerated: 0
    };

    // Add the new row to the category state
    setCategory([...category, newRow]);
  };

  // Function to delete the row at a specific index
  const handleDelete = (event, index) => {
    event.stopPropagation();

    if (category.length > 1) {
      const updatedCategories = [...category];
      updatedCategories.splice(index.rowIndex, 1);
      setCategory(updatedCategories);
    }
  };

  const loadActions = (rowData, rowIndex) => {
    return <InputMapping rowData={rowData} rowIndex={rowIndex} />;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const searchCategory = (event: any) => {
    

    // Example logic for filtering items
    let obj = {
      CategoryName: event.query.toLowerCase(),
    };

    var result = dispatch(FilterCategory(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result) {
          if (
            res.payload.CategoryList &&
            res.payload.CategoryList.length &&
            res.payload.CategoryList.length > 0
          ) {
            let catList = res.payload.CategoryList;
            setSuggestions(catList);
          } else {
            toast.current?.show({
              severity: "warn",
              summary: "Warning Message",
              detail: res.payload.tranStatus.lstErrorItem[0].Message,
            });
          }
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: JSON.stringify(error),
        });
      });
  };

  const handleCatAuto = (e) => {
    setCategoryName(e.target.value);

    const CatCPMap = {
      CategoryId: 0,
      Taskname: "SEARCHINITIALIZE",
    };
    var result = dispatch(fetch(CatCPMap));

    result
      .then((res) => {
        if (res.payload.tranStatus.result) {
          if (
            res.payload.CategoryCPMapList &&
            res.payload.CategoryCPMapList.length &&
            res.payload.CategoryCPMapList.length > 0
          ) {
            let catList = res.payload.CategoryCPMapList;
            if (createEditData == null) {
              const existingCategory = catList.find(
                (cat) => cat.CategoryId === e.target.value.CategoryId
              );

              if (existingCategory) {
                toast.current?.show({
                  severity: "warn",
                  summary: "Warning Message",
                  detail: "Category Already Exists.",
                });
                setCategoryName(null);
                setAllcategory(catList);
                return;
              }
            }
          }
          formik.setFieldValue("CategoryId", e.value.CategoryId);
          formik.setFieldValue("CategoryName", e.value.CategoryName);
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: JSON.stringify(error),
        });
      });


  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const InputMapping = (data) => {
    

    return (
      <div className="flex justify-content-center align-items-center gap-2">
        <div className="action-btn flex justify-content-center align-items-center">
          <Button
            icon="pi pi-plus"
            onClick={(event) => handleAdd(event, data.rowData)}
            title="Add"
            className="text-center"
            disabled={isView}
          />
          <Button
            icon="pi pi-times"
            onClick={(event) => handleDelete(event, data.rowIndex)}
            severity="danger"
            title="Clear"
            className="text-center"
            disabled={isView}
          />
        </div>
        <div>{data.rowData?.CheckPoint}</div>
      </div>
    );
  };

  const onCellEditComplete = (e: ColumnEvent) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    if (rowData.CheckPoints && rowData.CheckPoints.trim().length > 0) {
      const updatedCategory = category.map((item) =>
        item["S.No"] === rowData["S.No"]
          ? { ...item, [field]: rowData.CheckPoints, isEditing: false }
          : item
      );
      setCategory(updatedCategory);
    } else {
      event.preventDefault();
    }
  };

  const loadTableGrid = (tempcat) => {
    
    const transformedBackToCategory = tempcat.map((item, index) => ({
      "S.No": index + 1,
      Id: item.CategoryDetailId,
      CategoryCPMapDetailId: item.CategoryCPMapDetailId,
      CPMapId: item.CPMapId,
      // Action: item.Status === 1,
      CategoryId: item.CategoryId,
      CategoryName: item.CategoryName,
      Suggestions: [],
      isEditing: false,
      CheckPoints: item.Description,
      IsSysGenerated: item.IsSysGenerated,
    }));

    setCategory(transformedBackToCategory);
  };

  const handleSubmit = () => {
    if (categoryName == null || categoryName == "") {
      toast.current?.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Please select Category.",
      });
      return;
    }
    let CategoryCPMap = formik.values;
    const transformedCategories = category.map((item: any, index) => ({
      CategoryCPMapDetailId:
        createEditData == null ? 0 : item.CategoryCPMapDetailId || 0,
      CPMapId: createEditData == null ? 0 : item.CPMapId || 0,
      CategoryId:formik.values.CategoryId,
      Description:
        createEditData == null ? item.CheckPoints : item.CheckPoints || "",
      Status: createEditData == null ? item.Status : 1,
      CreatedBy:
        createEditData == null ? item.CreatedBy : +localStorage["UserId"],
      CreatedOn: createEditData == null ? item.CreatedOn : tLDS(new Date()),
      ModifiedBy:
        createEditData == null ? item.ModifiedBy : +localStorage["UserId"],
      ModifiedOn: createEditData == null ? item.ModifiedOn : tLDS(new Date()),
      IsSysGenerated: createEditData == null ? 0 : item.IsSysGenerated,
    }));

    setNewCategory(transformedCategories);
    if(createEditData == null) {

      if(suggestions.length < 1 || !suggestions.some(item =>categoryName.hasOwnProperty("CategoryName") ?
      item?.CategoryName.toLowerCase() === categoryName?.CategoryName.toLowerCase() : item?.CategoryName.toLowerCase() === categoryName.toLowerCase())) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning Message",
        detail: "Please Enter Valid Category.",
      });
      return
    }
  }
    
    
    if(category &&
      category.filter(item => item?.CheckPoints === "").length > 0 
      ){
      toast.current?.show({
        severity: "warn",
        summary: "Warning Message",
        detail: "Please Enter Valid Check Point.",
      });
      return
    }
    if(category.some((item, index, arr) => 
      arr.findIndex(inner => inner?.CheckPoints === item?.CheckPoints) !== index)){
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: "Duplicate CheckPoints found. Please use unique Point.",
        });
        return
    }
    let Category = {
      CategoryMap: CategoryCPMap,
      CategoryMapDetail: transformedCategories,
    };
    

    var createRes;
    if (createEditData == null) {
      createRes = dispatch(Create(Category));
    } else {
      createRes = dispatch(update(Category));
    }
    createRes
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          toast.current?.show({
            severity: "success",
            summary: "Success Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
          resetForm()
          setTimeout(() => {
            route.push("/home/vCheckPointMapping");
          }, 800);
          return;
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((err) => {
        toast.current?.show({
          severity: "warn",
          summary: "Error Message",
          detail: JSON.stringify(err.payload),
        });
      });
  };

  const handleSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
  };

  return (
    <>
      <Formik
        initialValues={formik.initialValues}
        validationSchema={formik.validationSchema}
        onSubmit={formik.handleSubmit}
      >
        <div className="page-container">
          <div className="inner-page-container">
            <div className="page-title">
              <div className="grid grid-nogutter">
                <div className="md:col-6">
                  <h1>Category CheckPoints Mapping</h1>
                </div>
                <div className="md:col-6 text-right">
                  <div className="action-btn">
                    <>
                      <Button
                        label=""
                        title="Save"
                        icon="pi pi-save"
                        className="text-center"
                        onClick={() => handleSubmit()}
                        disabled={isView}
                      />
                      <Button
                        label=""
                        severity="danger"
                        icon="pi pi-trash"
                        title="Clear"
                        className="text-center"
                        onClick={() => resetForm()}
                        disabled={isView}
                      />
                      <Button
                        label=""
                        icon="pi pi-search"
                        title="Back to Search"
                        className="p-button p-button-success text-center"
                        onClick={() => {
                          route.push("/home/vCheckPointMapping");
                        }}
                      />
                    </>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-container scroll-y">
              <div className="white">
                <div className="widget-body">
                  <form>
                    <div className="normal-table">
                      <div className="grid">
                        <div className="col-12 md:col-3">
                          <label className="form-label">
                            Category<span className="hlt-txt">*</span>
                          </label>
                          <AutoComplete
                            name={"CategoryName"}
                            field={"CategoryName"}
                            value={categoryName}
                            suggestions={suggestions}
                            completeMethod={(event) => searchCategory(event)}
                            onChange={(e) => handleCatAuto(e)}
                            dropdown
                            className="text-center w-full"
                            placeholder={"Select Category"}
                            disabled={isView || createEditData != null}
                          />
                        </div>
                        <FormFields
                          type={"select"}
                          name={"Status"}
                          label={"Status"}
                          options={statusList}
                          show={true}
                          required={true}
                          disable={isView || createEditData == null || createEditData.CategoryId == 1}
                          optionLabel={"MetaSubDescription"}
                          optionValue={"MetaSubId"}
                          handleSelect={handleSelect}
                          formik={formik}
                          fldStyle={"col-12 md:col-3"}
                        />
                      </div>
                    </div>
                  </form>
                  {/* <AppGridTable /> */}
                  <div className="card">
                    {!loading ? (
                      <DataTable
                        value={category}
                        showGridlines
                        filters={filters}
                        loading={loading}
                        selection={selectedData}
                        editMode="cell"
                        emptyMessage={"No Data Found"}
                        style={{
                          minWidth: "50rem",
                          textAlign: "center",
                        }}
                        dataKey="Id"
                        paginator={pageConfig.tablePagination}
                        rows={pageConfig.tableRows}
                        rowsPerPageOptions={pageConfig.tableRowsOptions}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Entries"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        globalFilter={globalFilter}
                        header={TableHeader}
                      >
                        {category && category.length > 0
                          ? Object.keys(category[0]).map((key, index) => {
                              if (key === "CheckPoints") {
                                return (
                                  <Column
                                    key={key}
                                    field={key}
                                    style={{
                                      height: "35px",
                                      minHeight: "35px",
                                      maxHeight: "35px",
                                    }}
                                    header="Check Points"
                                    body={(rowData, rowIndex) => (
                                      <div
                                        key={index}
                                        onClick={(event) =>
                                          handleClick(event, rowData)
                                        }
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {loadActions(rowData, rowIndex)}
                                        <div
                                          style={{ marginLeft: "8px" }}
                                          className="w-full"
                                        >
                                          {rowData.isEditing ? (
                                            <InputText
                                              className="p-input p-component w-full"
                                              value={rowData.CheckPoints}
                                              onBlur={(event) =>
                                                handleBlur(event, rowData)
                                              }
                                              onChange={(event) =>
                                                handleChange(event, rowData)
                                              }
                                              onKeyDown={(event) => {
                                                if (event.key === "Enter") {
                                                  handleChange(event, rowData);
                                                }
                                              }}
                                              autoFocus
                                            />
                                          ) : (
                                            <span>{rowData.CheckPoints}</span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    onCellEditComplete={onCellEditComplete}
                                  />
                                );
                              } 
                              // else if (key === "S.No") {
                              //   return (
                              //     <Column
                              //       key={index}
                              //       field={key}
                              //       header={key}
                              //       style={{
                              //         width: "5rem",
                              //         minWidth: "5rem",
                              //         maxWidth: "5rem",
                              //         textAlign: "center",
                              //       }}
                              //       body={(rowData) => (
                              //         <div>{rowData[key]}</div>
                              //       )}
                              //     ></Column>
                              //   );
                              // }
                            })
                          : null}
                      </DataTable>
                    ) : (
                      <AppProgressSpinner />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Formik>
      <AppAlert toast={toast} />
    </>
  );
};

export default CCategoryCPMapping;
