import React from "react";
import { Field, ErrorMessage } from "formik";
import {
  Calendar,
  Dropdown,
  InputText,
  InputTextarea,
  RadioButton,
  MultiSelect,
  Checkbox,
  AutoComplete,
  InputNumber,
  Button,
  InputSwitch,
} from "@/assets/css/prime-library";
import { Password } from "primereact/password";
import QRCode from "react-qr-code";

export const AppDrownDown = (props) => {
  const {
    name,
    label,
    type,
    show,
    required,
    disable,
    formik,
    optionLable,
    optionValue,
    handleSelect,
    handleChange,
    options,
    formName,
    ...rest
  } = props;
  return (
    <>
      <div
        style={
          show
            ? null
            : {
                display: "none",
              }
        }
        className="col-12 md:col-3"
        key={name}
      >
        <label className="form-label">
          {label}
          {required ? <span className="hlt-txt">*</span> : null}
        </label>
        <Dropdown
          value={formik.values[name] ?? formik.values[formName][name]}
          options={options}
          optionLabel={optionLable}
          optionValue={optionValue}
          placeholder={label}
          className="w-full"
          onBlur={formik.handleBlur}
          onChange={(e) =>
            handleSelect(name, formik.values[formName][name], e.target.value)
          }
        />
        <small className="p-error text-sm">
          {formik.touched[name] && formik.errors[name]}
        </small>
      </div>
    </>
  );
};

const FormFields = (props) => {
  const {
    name,
    label,
    type,
    show,
    id,

    required,
    disable,
    optionDisable,
    formik,
    optionLabel,
    optionValue,
    appendTo,
    handleSelect,
    handleKeyPress,
    maxLength,
    maxSelectedLabels,
    titleInputholder,
    titleInputName,
    minDate,
    maxDate,
    options,
    fldStyle,
    formName,
    autoSearch,
    autoSuggestions,
    autoCompleteLbl,
    autoComplete,
    showTime,
    hourFormat,
    timeOnly,
    handleChange,
    showFilter,
    showClear,
    minFractionDigits,
    maxFractionDigits,
    min,
    max,
    mode,
    qrValue,
    qrSize,
    btnClick,
    selectionMode,
    calShowIcon,
    placeHolder,
    optionDisabled,
    onkeyDown,
    dropdownAc,
    onBlur,
    autoFocus,
    ...rest
  } = props;
  const isMobile = window.innerWidth <= 768;
  switch (type) {
    case "text":
      return (
        <>
          <div
            style={
              show
                ? null
                : {
                    display: "none",
                  }
            }
            className={fldStyle}
            key={name}
          >
            <label className="form-label">
              {label}
              {required ? <span className="hlt-txt">*</span> : null}
            </label>

            <InputText
              id={name}
              type={type}
              className="w-full"
              label={label}
              name={
                formName && formName.length > 0
                  ? `${formName}.${name}`
                  : `${name}`
              }
              disabled={disable}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              onInput={handleKeyPress}
              value={
                formName && formName.length > 0
                  ? formik.values[formName][name]
                  : formik.values[name]
              }
              autoComplete="new-password"
              placeholder={placeHolder}
              maxLength={maxLength}
              {...rest}
            />

            <small className="p-error text-sm">
              {
                (formName && formName.length > 0
                  ? formik.touched &&
                    formik.touched[formName] &&
                    formik.touched[formName][name]
                  : formik.touched && formik.touched[name]) &&
                  (formName && formName.length > 0
                    ? formik.errors &&
                      formik.errors[formName] &&
                      formik.errors[formName][name]
                    : formik.errors && formik.errors[name])
                // (formName && formName.length > 0 ? (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[formName][name] : null) : (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[name] : null))
              }
            </small>
          </div>
        </>
      );

    case "number":
      return (
        <>
          <div
            style={
              show
                ? null
                : {
                    display: "none",
                  }
            }
            className={fldStyle}
            key={name}
          >
            <label className="form-label">
              {label}
              {required ? <span className="hlt-txt">*</span> : null}
            </label>

            <InputNumber
              id={name}
              className="w-full"
              label={label}
              name={name}
              disabled={disable}
              onBlur={formik.handleBlur}
              onValueChange={formik.handleChange}
              value={formik.values[name]}
              minFractionDigits={minFractionDigits}
              maxFractionDigits={maxFractionDigits}
              min={min}
              mode={mode}
              max={max}
              maxLength={maxLength}
              {...rest}
            />
            <small className="p-error text-sm">
              {
                (formName && formName.length > 0
                  ? formik.touched &&
                    formik.touched[formName] &&
                    formik.touched[formName][name]
                  : formik.touched && formik.touched[name]) &&
                  (formName && formName.length > 0
                    ? formik.errors &&
                      formik.errors[formName] &&
                      formik.errors[formName][name]
                    : formik.errors && formik.errors[name])
                // (formName && formName.length > 0 ? (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[formName][name] : null) : (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[name] : null))
              }
            </small>
          </div>
        </>
      );

    case "text_title":
      return (
        <>
          <div
            style={
              show
                ? null
                : {
                    display: "none",
                  }
            }
            className={fldStyle}
            key={name}
          >
            <label className="form-label">
              {label}
              {required ? <span className="hlt-txt">*</span> : null}
            </label>

            <div className="p-inputgroup flex-1">
              <Dropdown
                className="small-combo"
                id={optionLabel}
                name={
                  formName && formName.length > 0
                    ? `${formName}.${name}`
                    : `${name}`
                }
                value={
                  formName && formName.length > 0
                    ? formik.values[formName][name]
                    : formik.values[name]
                }
                options={options}
                onBlur={formik.handleBlur}
                optionLabel={optionLabel}
                optionValue={optionValue}
                disabled={optionDisable}
                onChange={(e) => {
                  handleSelect(
                    formName && formName.length > 0
                      ? `${formName}.${name}`
                      : name,
                    formName && formName.length > 0
                      ? formik.values[`${formName}.${name}`]
                      : name,
                    e.target.value
                  );
                }}
              />
              <InputText
                id={titleInputName}
                type={type}
                label={titleInputholder}
                name={
                  formName && formName.length > 0
                    ? `${formName}.${titleInputName}`
                    : `${titleInputName}`
                }
                disabled={disable}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                onInput={handleKeyPress}
                maxLength={maxLength}
                value={
                  formName && formName.length > 0
                    ? formik.values[formName][titleInputName]
                    : formik.values[titleInputName]
                }
                {...rest}
              />
            </div>
            <small className="p-error text-sm">
              {
                (formName && formName.length > 0
                  ? formik.touched &&
                    formik.touched[formName] &&
                    formik.touched[formName][titleInputName]
                  : formik.touched && formik.touched[titleInputName]) &&
                  (formName && formName.length > 0
                    ? formik.errors &&
                      formik.errors[formName] &&
                      formik.errors[formName][titleInputName]
                    : formik.errors && formik.errors[titleInputName])
                // (formName && formName.length > 0 ? (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[formName][name] : null) : (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[name] : null))
              }
            </small>
          </div>
        </>
      );

    case "password":
      return (
        <>
          <div
            style={
              show
                ? null
                : {
                    display: "none",
                  }
            }
            className={fldStyle}
            key={name}
          >
            <label className="form-label">
              {label}
              {required ? <span className="hlt-txt">*</span> : null}
            </label>
            <Password
              className="w-full"
              name={name}
              inputId="password"
              disabled={disable}
              value={formik.values[name]}
              onChange={formik.handleChange}
              autoComplete="new-password"
              {...rest}
            />
            <small className="p-error text-sm">
              {
                (formName && formName.length > 0
                  ? formik.touched &&
                    formik.touched[formName] &&
                    formik.touched[formName][name]
                  : formik.touched && formik.touched[name]) &&
                  (formName && formName.length > 0
                    ? formik.errors &&
                      formik.errors[formName] &&
                      formik.errors[formName][name]
                    : formik.errors && formik.errors[name])
                // (formName && formName.length > 0 ? (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[formName][name] : null) : (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[name] : null))
              }
            </small>
          </div>
        </>
      );

    case "textarea":
      return (
        <>
          <div
            style={
              show
                ? null
                : {
                    display: "none",
                  }
            }
            className={fldStyle}
            key={name}
          >
            <label className="form-label">
              {label}
              {required ? <span className="hlt-txt">*</span> : null}
            </label>
            <InputTextarea
              id={name}
              className="w-full"
              autoResize
              rows={5}
              disabled={disable}
              label={label}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              name={
                formName && formName.length > 0
                  ? `${formName}.${name}`
                  : `${name}`
              }
              value={
                formName && formName.length > 0
                  ? formik.values[formName][name]
                  : formik.values[name]
              }
              maxLength={maxLength}
              {...rest}
            />
            <small className="p-error text-sm">
              {
                (formName && formName.length > 0
                  ? formik.touched &&
                    formik.touched[formName] &&
                    formik.touched[formName][name]
                  : formik.touched && formik.touched[name]) &&
                  (formName && formName.length > 0
                    ? formik.errors &&
                      formik.errors[formName] &&
                      formik.errors[formName][name]
                    : formik.errors && formik.errors[name])
                // (formName && formName.length > 0 ? (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[formName][name] : null) : (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[name] : null))
              }
            </small>
          </div>
        </>
      );

    case "select":
      return (
        <>
          <div
            style={
              show
                ? null
                : {
                    display: "none",
                  }
            }
            className={fldStyle}
            key={name}
          >
            <label className="form-label">
              {label}
              {required ? <span className="hlt-txt">*</span> : null}
            </label>
            <Dropdown
              id={optionLabel}
              name={
                formName && formName.length > 0
                  ? `${formName}.${name}`
                  : `${name}`
              }
              value={
                formName && formName.length > 0
                  ? formik.values[formName][name]
                  : formik.values[name]
              }
              options={options}
              optionLabel={optionLabel}
              optionValue={optionValue}
              placeholder={label}
              className="w-full"
              onBlur={formik.handleBlur}
              disabled={disable}
              filter={showFilter || true}
              showClear={showClear || false}
              filterInputAutoFocus={isMobile ? false : true}
              onChange={(e) => {
                handleSelect(
                  formName && formName.length > 0
                    ? `${formName}.${name}`
                    : name,
                  formName && formName.length > 0
                    ? formik.values[`${formName}.${name}`]
                    : name,
                  e.target.value
                );
              }}
              appendTo={appendTo}
              // onChange={(e) => {
              //   handleSelect(formName.length > 0 ? `${formName}.${name}` : `${name}`,
              //     formName.length > 0 ? formik.values[formName][name] : formik.values[name],
              //     e.target.value);
              // }}
            />
            <small className="p-error text-sm">
              {(formik.touched?.[name] && formik.errors?.[name]) ?? null}
            </small>
          </div>
          {/* <Select
              labelId={name}
              id={name}
              label={label}
              name={name}
              disabled={disable}
              style={{ width: "100%" }}
              onBlur={formik.handleBlur}
              onChange={(e) =>
                handleSelect(name, formik.values[name], e.target.value)
              }
              value={formik.values[name]}
              error={formik.touched[name] && formik.errors[name]}
              {...rest}
            >
              {options &&
                options.map((option) => {
                  return (
                    <MenuItem
                      id={option.label}
                      key={option.value}
                      value={option.value}
                      style={{ width: "100%" }}
                    >
                      {option.label}
                    </MenuItem>
                  );
                })}
            </Select> */}
        </>
      );

    case "multi_select":
      return (
        <>
          <div
            style={
              show
                ? null
                : {
                    display: "none",
                  }
            }
            className={fldStyle}
            key={name}
          >
            <label className="form-label">
              {label}
              {required ? <span className="hlt-txt">*</span> : null}
            </label>
            <MultiSelect
              name={name}
              value={formik.values[name]}
              onChange={(e) => handleSelect(name, {}, e.target.value)}
              options={options}
              optionLabel={optionLabel}
              optionValue={optionValue}
              filter={true}
              onBlur={formik.handleBlur}
              placeholder={label}
              maxSelectedLabels={maxSelectedLabels}
              className="w-full"
              disabled={disable}
              filterInputAutoFocus={isMobile ? false : true}
              optionDisabled={optionDisabled}
            />
            <small className="p-error text-sm">
              {formik.touched &&
                formik.touched[name] &&
                formik.errors &&
                formik.errors[name]}
            </small>
          </div>
        </>
      );

    case "radiobox":
      return (
        <>
          <div
            style={
              show
                ? null
                : {
                    display: "none",
                  }
            }
            className={fldStyle}
            key={name}
          >
            <label id={name} className="form-label">
              {label}
              {required ? <span className="hlt-txt">*</span> : null}
            </label>
            <div className="flex flex-row gap-2">
              {options &&
                options.map((item, i) => {
                  return (
                    <div key={i} className="flex align-items-center">
                      <RadioButton
                        inputId={item.MetaSubCode}
                        name={name}
                        value={item.MetaSubId}
                        checked={formik.values[name] === item.MetaSubId}
                        onChange={handleChange}
                      />
                      <label htmlFor={item.MetaSubCode} className="ml-2">
                        {item.MetaSubDescription}
                      </label>
                    </div>
                  );
                })}
            </div>
            <small className="p-error text-sm">
              {
                (formName && formName.length > 0
                  ? formik.touched &&
                    formik.touched[formName] &&
                    formik.touched[formName][name]
                  : formik.touched && formik.touched[name]) &&
                  (formName && formName.length > 0
                    ? formik.errors &&
                      formik.errors[formName] &&
                      formik.errors[formName][name]
                    : formik.errors && formik.errors[name])
                // (formName && formName.length > 0 ? (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[formName][name] : null) : (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[name] : null))
              }
            </small>
          </div>
        </>
      );

    case "Calendar":
      return (
        <>
          <div
            style={
              show
                ? null
                : {
                    display: "none",
                  }
            }
            className={fldStyle}
            key={name}
          >
            <label id={name} className="form-label">
              {label}
              {required ? <span className="hlt-txt">*</span> : null}
            </label>

            <Calendar
              className="w-full"
              onChange={handleChange}
              minDate={minDate}
              maxDate={maxDate}
              name={
                formName && formName.length > 0
                  ? `${formName}.${name}`
                  : `${name}`
              }
              value={
                formName && formName.length > 0
                  ? formik.values[formName][name]
                  : formik.values[name] == null
                  ? null
                  : selectionMode == "range"
                  ? formik.values[name]
                  : new Date(formik.values[name])
              }
              disabled={disable}
              dateFormat={"dd/mm/yy"}
              showIcon
              showTime={showTime}
              hourFormat={hourFormat}
              timeOnly={timeOnly}
              selectionMode={selectionMode || "single"}
              readOnlyInput
            />
            <small className="p-error text-sm">
              {
                (formName && formName.length > 0
                  ? formik.touched &&
                    formik.touched[formName] &&
                    formik.touched[formName][name]
                  : formik.touched && formik.touched[name]) &&
                  (formName && formName.length > 0
                    ? formik.errors &&
                      formik.errors[formName] &&
                      formik.errors[formName][name]
                    : formik.errors && formik.errors[name])
                // (formName && formName.length > 0 ? (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[formName][name] : null) : (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[name] : null))
              }
            </small>
          </div>
        </>
      );

    case "checkbox":
      return (
        <>
          <div
            style={
              show
                ? null
                : {
                    display: "none",
                  }
            }
            className={fldStyle}
            key={name}
          >
            <label className="form-label">
              {/* {"label"}
          {required ? <span className="hlt-txt">*</span> : null} */}
              &nbsp;
            </label>
            <div className="flex align-items-center">
              <Checkbox
                inputId={name}
                id={id}
                name={name}
                checked={formik.values[name]}
                onChange={handleChange}
                disabled={disable}
                style={{
                  opacity: disable ? 0.5 : 1,
                  backgroundColor: disable ? "#c8c8c8" : "",
                }}
              />
              <label htmlFor={name} className="ml-2" style={{
                opacity: disable ? 0.5 : 1,
                color: disable ? "#1b1b1b" : "",
              }}>
                {label}
              </label>
            </div>
            <small className="p-error text-sm">
              {
                (formName && formName.length > 0
                  ? formik.touched &&
                    formik.touched[formName] &&
                    formik.touched[formName][name]
                  : formik.touched && formik.touched[name]) &&
                  (formName && formName.length > 0
                    ? formik.errors &&
                      formik.errors[formName] &&
                      formik.errors[formName][name]
                    : formik.errors && formik.errors[name])
                // (formName && formName.length > 0 ? (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[formName][name] : null) : (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[name] : null))
              }
            </small>
          </div>
        </>
      );

    case "qr_code":
      return (
        <>
          <div
            style={
              show
                ? null
                : {
                    display: "none",
                  }
            }
            className={fldStyle}
            key={name}
          >
            <label className="form-label">
              {label}
              {required ? <span className="hlt-txt">*</span> : null}
              &nbsp;
            </label>
            <div className="flex align-items-center">
              <QRCode value={formik.values[name] || ""} size={qrSize} />
              <Button
                label=""
                severity="warning"
                icon="pi pi-print"
                title="Print"
                className="ml-2 p-1"
                onClick={btnClick}
              />
            </div>
          </div>
        </>
      );
      break;

    case "toggle":
      return (
        <>
          <div
            style={
              show
                ? null
                : {
                    display: "none",
                  }
            }
            className={fldStyle}
            key={name}
          >
            <label className="form-label">
              {label}
              {required ? <span className="hlt-txt">*</span> : null}
              &nbsp;
            </label>
            <div className="flex align-items-center w-3rem">
              <InputSwitch
                id={name}
                type={type}
                className="w-full"
                label={label}
                name={
                  formName && formName.length > 0
                    ? `${formName}.${name}`
                    : `${name}`
                }
                disabled={disable}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                checked={
                  formName && formName.length > 0
                    ? formik.values[formName][name]
                    : formik.values[name]
                }
                {...rest}
              />
            </div>
          </div>
        </>
      );
      break;

    // case "toggle":
    //   return (
    //     <>
    //       <InputLabel id={name}>{label}</InputLabel>
    //       {options &&
    //         options.map((opt) => (
    //           <FormControlLabel
    //             key={opt.value}
    //             label={formik.values[name]}
    //             disabled={disable}
    //             checked={formik.values[name]}
    //             onChange={(e) => handleToggle(name, formik.values[name])}
    //             control={<Switch color="primary" />}
    //             labelPlacement="end"
    //           />
    //         ))}
    //       <div>{formik.touched[name] && formik.errors[name]}</div>
    //     </>
    //   );

    // case "image":
    //   return (
    //     <>
    //       <InputLabel id={name}>{label}</InputLabel>
    //       <Input
    //         disabled={disable}
    //         type="file"
    //         id="image-input"
    //         name="image" // Change "image" to the actual field name
    //         onChange={(event: any) => {
    //           formik.setFieldValue("file", event.target.files[0]);
    //         }}
    //         inputProps={{ "aria-label": "Select Image" }}
    //       />

    //       <div>{formik.touched[name] && formik.errors[name]}</div>
    //     </>
    //   );

    // case "imageview":
    //   return (
    //     <>
    //       <InputLabel id={name}>{label}</InputLabel>
    //       {formik.values[name] === "" && (
    //         <div>
    //           <InputLabel id={name}>{"Image not uploaded"}</InputLabel>{" "}
    //         </div>
    //       )}
    //       {formik.values[name] !== "" && (
    //         <>
    //           <div
    //             style={{
    //               display: "flex",
    //               flexDirection: "row",
    //               columnGap: "30px",
    //               alignItems: "center",
    //             }}
    //           >
    //             <img
    //               style={{
    //                 display: "block",
    //                 width: "120px",
    //                 height: "120px",
    //                 borderRadius: "20px",
    //                 borderWidth: "2px",
    //                 borderColor: "#14ADFF",
    //                 borderStyle: "solid",
    //                 padding: "5px",
    //               }}
    //               id={name}
    //               src={`data:image/png;base64, ${formik.values[name]}`}
    //               alt={label}
    //             />
    //             <Button
    //               variant="contained"
    //               onClick={() =>
    //                 setImgSource({
    //                   img: formik.values[name],
    //                   label: label,
    //                   show: true,
    //                 })
    //               }
    //             >
    //               Preview
    //             </Button>
    //           </div>
    //         </>
    //       )}
    //     </>
    //   );

    case "autocomplete":
      return (
        <>
          <div
            style={
              show
                ? null
                : {
                    display: "none",
                  }
            }
            className={fldStyle}
            key={name}
          >
            <label className="form-label">
              {label}
              {required ? <span className="hlt-txt">*</span> : null}
            </label>

            <AutoComplete
              id={optionLabel}
              name={optionLabel}
              value={formik.values[name]}
              suggestions={autoSuggestions}
              field={autoCompleteLbl}
              className="w-full"
              completeMethod={autoSearch}
              disabled={disable}
              onSelect={handleChange}
              maxLength={maxLength}
              placeholder={placeHolder}
              onKeyDown={onkeyDown}
              onBlur={onBlur}
              dropdown={dropdownAc}
              autoFocus={autoFocus}
            />
            <small className="p-error text-sm">
              {
                (formName && formName.length > 0
                  ? formik.touched &&
                    formik.touched[formName] &&
                    formik.touched[formName][name]
                  : formik.touched && formik.touched[name]) &&
                  (formName && formName.length > 0
                    ? formik.errors &&
                      formik.errors[formName] &&
                      formik.errors[formName][name]
                    : formik.errors && formik.errors[name])
                // (formName && formName.length > 0 ? (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[formName][name] : null) : (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[name] : null))
              }
            </small>
          </div>
        </>
      );

    default:
      return (
        <>
          <div
            style={
              show
                ? null
                : {
                    display: "none",
                  }
            }
            className={fldStyle}
            key={name}
          ></div>
        </>
      );
  }
};

export default FormFields;
