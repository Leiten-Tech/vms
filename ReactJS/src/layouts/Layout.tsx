import AppAlert from "@/alert/alert";
import Alert from "../components/UtilityComp";
import Header from "./Header";
import LeftComponent from "./left-component";

export const Layouts = {
  AppLayout: ({ children }) => (
    <div>
      <Header />
      <LeftComponent />
      <div>{children}</div>
    </div>
  ),
  AuthLayout: ({ children }) => (
    <div>
      <div>{children}</div>
    </div>
  ),
  HomeLayout: ({ children }) => <div>{children}</div>,
};
