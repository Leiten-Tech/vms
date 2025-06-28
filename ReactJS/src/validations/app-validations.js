import { object, string } from "yup";

export const UsersYup = object({
    name: string().required(),
    avatar: string().required(),
    username: string().required(),
    email: string().email().required(),
    phone: string().required(),
    website: string().required(),
    company: string().required(),
    address: string().required(),
})