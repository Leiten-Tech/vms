import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";

import {
  createInit,
  createMaterial,
  updateMaterial,
  OnChangeMaterialType,
  OnChangeMaterialCatagory,
  OnChangeMaterialSubCatagory,
  OnChangeBrand,
} from "@/redux/slices/master/materialSlice";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { MaterialValidationSchema } from "@/validations/Master";
import { Toast } from "@/assets/css/prime-library";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { AppProgressSpinner } from "@/components/UtilityComp";
import AppAlert from "@/alert/alert";
import { IMAGES } from "@/assets/images/Images";
import { tLDS } from "@/utils/utilFunc";

const CMaterial = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const autoCompleteRef = useRef<any>(null);
  const toast = useRef<Toast>(null);
  const [disableSave, setDisableSave] = useState(false);

  const [MaterialTypeIdSelected, setMaterialTypeIdSelected] = useState();

  useEffect(() => {
    if (HdrTable == null) {
      const data = {
        MaterialId: 0,
      };
      dispatch(createInit(data));
    }
  }, []);
  const [itemType, setItemType] = useState<any[]>([]);

  const [filteritemType, setFilterItemType] = useState<any[]>([]);
  const [filteritemCatg, setFilterItemCatg] = useState<any[]>([]);
  const [filteritemSubCatg, setFilterSubCatg] = useState<any[]>([]);
  const [filteritemBrand, setFilterBrand] = useState<any[]>([]);

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoName, setPhotoName] = useState();
  const [imageUrl, setImageUrl] = useState<string>(
    IMAGES.NO_IMG
  );
  const search = (event: any) => {
    let _filteredItemType;

    if (!event.query.trim().length) {
      _filteredItemType = [...itemType];
    } else {
      _filteredItemType = itemType.filter((item) => {
        return item.MaterialTypeName.toLowerCase().startsWith(
          event.query.toLowerCase()
        );
      });

      // Check if the entered value is not in the suggestions
      const inputValue = event.query.trim();
      if (
        !itemType.some(
          (item) =>
            item.MaterialTypeName.toLowerCase() === inputValue.toLowerCase()
        )
      ) {
        _filteredItemType.push({ MaterialTypeName: inputValue }); // Add the new value to the suggestions
      }
    }

    setFilterItemType(_filteredItemType);
  };

  //
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    CountryStatus,
    MaterialList,
    Country,
    HdrTable,
    MaterialCategoryList,
    MaterialSubCategoryList,
    MaterialTypeList,
    StatusList,
    OnChangeBrand,
    UomList,
    NumberingSchema,
    reload,
    createOrEdit,
    transtatus,
  } = useSelector((state: any) => state.material);

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    if (transtatus != null) {
      if (autoCompleteRef.current) {
        autoCompleteRef.current.focus();
        // setItemType(UomList)
      }
    }
  }, [transtatus]);
  useEffect(() => {
    // Fetch the image data as Blob and create a File object
    if (HdrTable != null) {
      fetchBlobFromUrl(HdrTable.ImageUrl)
        .then((blob) => {
          const file = new File([blob], HdrTable.ImageName, {
            type: "image/*",
            lastModified: 1695716506050,
          });
          setPhoto(file);
          setPhotoName(HdrTable.ImageName);
          setImageUrl(HdrTable.MaterialImageUrl);
        })
        .catch((error) => {
         });
    }
  }, []);
  async function fetchBlobFromUrl(url: string): Promise<Blob> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    return await response.blob();
  }
  const getMaterialTypeNameById = (
    materialTypeId: number
  ): string | undefined => {
    const foundItem = MaterialTypeList.find(
      (item) => item.MaterialTypeId === materialTypeId
    );
    return foundItem ? foundItem.MaterialTypeName : "";
  };
  const getMaterialTypeIdByName = (materialTypeName: any) => {
    const foundItem = MaterialTypeList.find(
      (item) => item.MaterialTypeName === materialTypeName
    );
    return foundItem ? foundItem.MaterialTypeId : "";
  };
  const getMaterialCategoryNameById = (
    MaterialCategoryId: number
  ): string | undefined => {
    const foundItem = MaterialCategoryList.find(
      (item) => item.MaterialCategoryId === MaterialCategoryId
    );
    return foundItem ? foundItem.MaterialCategoryName : "";
  };
  const getMaterialSubCategoryNameById = (
    MaterialSubCategoryId: number
  ): string | undefined => {
    const foundItem = MaterialSubCategoryList.find(
      (item) => item.MaterialSubCategoryId === MaterialSubCategoryId
    );
    return foundItem ? foundItem.MaterialSubCategoryName : "";
  };
  

  const formik: any = useFormik({
    initialValues: {
      MaterialType:
        HdrTable != null ? getMaterialTypeNameById(HdrTable.MaterialType) : 0,
      MaterialCategory:
        HdrTable != null
          ? getMaterialCategoryNameById(HdrTable.MaterialCategoryId)
          : "",
      MaterialSubCategory:
        HdrTable != null
          ? getMaterialSubCategoryNameById(HdrTable.MaterialSubCategoryId)
          : "",
      MaterialName: HdrTable != null ? HdrTable.MaterialName : "",
      BrandName: HdrTable != null ? HdrTable.BrandName : "",
      Uom: HdrTable != null ? HdrTable.Uom : null,
      Status: HdrTable != null ? HdrTable.Status : 1,
    },
    validationSchema: MaterialValidationSchema,
    onSubmit: async (values: any, { resetForm }) => {
      setDisableSave(true);
      while (formik.isValidating) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100 milliseconds
      }
      if (!values.MaterialType) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: "Please Enter Material Type",
        });
        setDisableSave(false);

        return;
      }
      if (!values.MaterialCategory) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: "Please Enter Material Category",
        });
        setDisableSave(false);

        return;
      }
      if (!values.MaterialSubCategory) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: "Please Enter Material Sub Category",
        });
        setDisableSave(false);

        return;
        
      }
      const formData = new FormData();
    let materialValue = {
        Material: {
          MaterialId: HdrTable != null ? HdrTable.MaterialId : 0,
          MaterialCode: HdrTable != null ? HdrTable.MaterialCode : "",
          MaterialType: HdrTable != null ? HdrTable.MaterialType : 0,
          MaterialCategoryId:
            HdrTable != null ? HdrTable.MaterialCategoryId : 0,
          MaterialSubCategoryId:
            HdrTable != null ? HdrTable.MaterialSubCategoryId : 0,
          MaterialName: values.MaterialName,
          BrandName: values.BrandName,
          Uom: values.Uom,
          PurchasePrice: 2,
          MaterialImageName: photoName,
          MaterialImageUrl: photoName,
          Status: values.Status,
          CreatedBy:
            HdrTable != null ? HdrTable.CreatedBy : localStorage["UserId"],
          CreatedOn: HdrTable != null ? tLDS(HdrTable.CreatedOn) : tLDS(new Date()),
          ModifiedBy: HdrTable != null ? localStorage["UserId"] : null,
          ModifiedOn: HdrTable != null ? tLDS(new Date()) : null,
        },
        MaterialTypeName:
          typeof values.MaterialType == "object"
            ? values.MaterialType.MaterialTypeName
            : values.MaterialType,
        MaterialCategoryName:
          typeof values.MaterialCategory == "object"
            ? values.MaterialCategory.MaterialCategoryName
            : values.MaterialCategory,
        MaterialSubCategoryName:
          typeof values.MaterialSubCategory == "object"
            ? values.MaterialSubCategory.MaterialSubCategoryName
            : values.MaterialSubCategory,
      };
      let addedValueStringify: string = JSON.stringify(materialValue);
      formData.append("input", addedValueStringify);
      formData.append("webfile", photo);
     

  if (HdrTable != null) {
    if (HdrTable.isCreate != false) {
      try {
        const updateRes = dispatch(updateMaterial(formData));
        updateRes.then((res) => {
          if (res.payload != null || !res.payload) {
            if (res.payload.transtatus.result == true) {
              toast.current?.show({
                severity: "success",
                summary: "Success Message",
                detail: res.payload.transtatus.lstErrorItem[0].Message,
              });
              resetForm();
              setTimeout(() => {
                route.push("/home/vMaterial");
              }, 800);
            } else if (res.payload.transtatus.result == false) {
              toast.current?.show({
                severity: "error",
                summary: "Error Message",
                detail: res.payload.transtatus.lstErrorItem[0].Message,
              });
              setDisableSave(false);
            }
          }
        });
      } catch (err) {
        toast.current?.show({
          severity: "warn",
          summary: "Error Message",
          detail: err,
        });
      }
    }
  } else {
    try {
      const createRes = dispatch(createMaterial(formData));
      createRes
        .then((res) => {
          setDisableSave(true);
          if (res.payload != null || !res.payload) {
            if (res.payload.transtatus.result == true) {
              setDisableSave(false);
              toast.current?.show({
                severity: "success",
                summary: "Success Message",
                detail: res.payload.transtatus.lstErrorItem[0].Message,
              });
              resetForm();
            } else if (res.payload.transtatus.result == false) {
             setDisableSave(false);

              toast.current?.show({
                severity: "warn",
                summary: "Error Message",
                detail: res.payload.transtatus.lstErrorItem[0].Message,
              });
            }
          }
        })
        .catch((err) => {
          toast.current?.show({
            severity: "warn",
            summary: "Error Message",
            detail: JSON.stringify(err.payload),
          });
        });
    } catch (err) {
      toast.current?.show({
        severity: "warn",
        summary: "Error Message",
        detail: JSON.stringify(err.payload),
      });
    }
  }
},
});

  const resetAllForm = () => {
    formik.resetForm();
  };

  const handleSelect = (name, other, value) => {
   formik.setFieldValue(name, value);
  };

  const onChangeMatType = (e) => {
    let matChange = {
      MaterialTypeName: e.query,
    };
    dispatch(OnChangeMaterialType(matChange));
  };
  const onChangeMatCatgType = (e) => {
    let matCatgChange = {
      MaterialCategoryName: e.query,
    };
    dispatch(OnChangeMaterialCatagory(matCatgChange));
  };
  const onChangeMatSubCatgType = (e) => {
    let matSubCatgChange = {
      MaterialSubCategoryName: e.query,
    };
    dispatch(OnChangeMaterialSubCatagory(matSubCatgChange));
  };

  const onChangeBrand = (e) => {
    let brandChange = {
      Brand: e.query,
    };
    dispatch(OnChangeBrand(brandChange));
  };

  useEffect(() => {
    setFilterItemType(MaterialTypeList);
  }, [MaterialTypeList]);
  useEffect(() => {
    setFilterItemCatg(MaterialCategoryList);
  }, [MaterialCategoryList]);
  useEffect(() => {
    setFilterSubCatg(MaterialSubCategoryList);
  }, [MaterialSubCategoryList]);
  useEffect(() => {
    setFilterBrand(OnChangeBrand);
  }, [OnChangeBrand]);

  const itemTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const onUpload = (e) => {
    setPhoto(e.files[0]);
    setPhotoName(e.files[0].name);
    const uploadedImageUrl = URL.createObjectURL(e.files[0]);
    setImageUrl(uploadedImageUrl);
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
                  <h1>Material</h1>
                </div>
                <div className="md:col-6 text-right">
                  <div className="action-btn">
                    <>
                      <Button
                        label=""
                        title="Save"
                        icon="pi pi-save"
                        className="text-center"
                        type="submit"
                        disabled={isView || disableSave ? true : false}
                        onClick={() => formik.handleSubmit()}
                      />
                      <Button
                        label=""
                        severity="danger"
                        icon="pi pi-trash"
                        title="Clear"
                        className="text-center"
                        disabled={isView || isCreate == false ? true : false}
                        onClick={() => resetAllForm()}
                      />
                    </>
                    <Button
                      label=""
                      icon="pi pi-search"
                      title="Back to Search"
                      className="p-button p-button-success text-center"
                      onClick={() => {
                        route.push("/home/vMaterial");
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-container scroll-y">
              <form>
                <div className="white">
                  <div className="widget-body">
                    <div className="normal-table">
                      <div className="grid">
                        {!loading ? (
                          <>
                           <div className="col-12 md:col-12">
                              <div className="grid">
                                <FormFields
                                  type={"autocomplete"}
                                  name={"MaterialType"}
                                  label={"Material Type"}
                                  show={true}
                                  required={true}
                                  disable={isView || !isCreate}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleChange={(e) => {
                                    handleSelect(
                                      "MaterialType",
                                      formik.values["MaterialType"],
                                      e.target.value
                                    );
                                    setMaterialTypeIdSelected(
                                      e.target.value.MaterialTypeId
                                    );
                                  }}
                                  fldStyle={"col-12 md:col-3"}
                                  formik={formik}
                                  autoSearch={onChangeMatType}
                                  autoCompleteRef={autoCompleteRef}
                                  autoSuggestions={filteritemType}
                                  autoCompleteLbl={"MaterialTypeName"}
                                  field={"MaterialTypeId"}
                                  maxLength={100}
                                />
                                <FormFields
                                  type={"autocomplete"}
                                  name={"MaterialCategory"}
                                  label={"Material Category"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={isView || !isCreate}
                                  fldStyle={"col-12 md:col-3"}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={handleSelect}
                                  handleChange={(e) => {
                                    handleSelect(
                                      "MaterialCategory",
                                      formik.values["MaterialCategory"],
                                      e.target.value
                                    );
                                  }}
                                  formik={formik}
                                  autoSearch={onChangeMatCatgType}
                                  autoCompleteRef={autoCompleteRef}
                                  autoSuggestions={filteritemCatg}
                                  autoCompleteLbl={"MaterialCategoryName"}
                                  field={"MaterialCategoryId"}
                                  maxLength={100}
                                />
                                <FormFields
                                  type={"autocomplete"}
                                  name={"MaterialSubCategory"}
                                  label={"Material Sub Category"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={isView || !isCreate}
                                  optionLabel={""}
                                  fldStyle={"col-12 md:col-3"}
                                  optionValue={""}
                                  handleChange={(e) => {
                                    handleSelect(
                                      "MaterialSubCategory",
                                      formik.values["MaterialSubCategory"],
                                      e.target.value
                                    );
                                  }}
                                  formik={formik}
                                  autoSearch={onChangeMatSubCatgType}
                                  autoCompleteRef={autoCompleteRef}
                                  autoSuggestions={filteritemSubCatg}
                                  autoCompleteLbl={"MaterialSubCategoryName"}
                                  field={"MaterialSubCategoryId"}
                                  maxLength={100}
                                />
                                <FormFields
                                  type={"autocomplete"}
                                  name={"MaterialName"}
                                  label={"Material Name"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={""}
                                  fldStyle={"col-12 md:col-3"}
                                  optionValue={""}
                                  handleSelect={handleSelect}
                                  handleChange={(e) => {
                                    handleSelect(
                                      "MaterialName",
                                      formik.values["MaterialName"],
                                      e.target.value
                                    );
                                  }}
                                  formik={formik}
                                  maxLength={100}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"BrandName"}
                                  label={"Brand Name"}
                                  options={""}
                                  show={true}
                                  required={false}
                                  disable={isView ? true : false}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-3"}
                                  maxLength={"100"}
                                />
                                <FormFields
                                  type={"select"}
                                  name={"Uom"}
                                  label={"UOM"}
                                  options={UomList}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionValue={"MetaSubId"}
                                  optionLabel={"MetaSubDescription"}
                                  fldStyle={"col-12 md:col-3"}
                                  handleSelect={handleSelect}
                                  formik={formik}
                                />
                                <FormFields
                                  type={"select"}
                                  name={"Status"}
                                  label={"Status"}
                                  options={StatusList}
                                  show={true}
                                  required={true}
                                  disable={isView || isCreate ? true : false}
                                  optionLabel={"MetaSubDescription"}
                                  fldStyle={"col-12 md:col-3"}
                                  optionValue={"MetaSubId"}
                                  handleSelect={handleSelect}
                                  formik={formik}
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <AppProgressSpinner />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Formik>
      <AppAlert toast={toast} />
    </>
  );
};

export default CMaterial;
