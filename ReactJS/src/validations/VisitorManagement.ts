import { object, string, number, array, date, InferType } from "yup";
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export const VisitorEntryValidationSchema = object({
    // MobileNo: string()
    // // .matches(phoneRegExp, "Phone number is not valid")
    // .required("Please Enter Mobile No.")
    // .min(9, "Minimum Length is 9.")
    // .max(15, "Maximum Length Exceeded."),
})
export const visitorEntryBelongingDeatilValidationSchema  = object({
    
})
export const checkInCheckOutValidationSchema  = object({
    
})