import { toast } from "react-toastify";
import { TOAST_TIMEOUT } from "../constants";
import "./alert.scss";

export const showAlert = (msg: string) => {
  toast(msg, {
    position: "top-center",
    type: "default",
    progress: 0,
    toastId: msg,
    closeOnClick: true,
    autoClose: TOAST_TIMEOUT,
    progressStyle: {
      background: "transparent",
      height: "0px",
    },
    style: {
      marginTop: "0.5em",
      border: "none",
      boxShadow: "none",
      boxSizing: "unset",
      borderRadius: "2px",
      textAlign: "center",
      fontWeight: "bolder",
      fontSize: "30px",
      padding: "0.1em",
      textShadow: 
      "1px 1px rgb(90, 45, 13), -1px -1px rgb(73, 38, 13), 1px -1px rgb(82, 42, 13), -1px 1px #8b4513",
      color: "var(--messageColor)",
      backgroundColor: "transparent",
      fontFamily: "'VintageFont', monospace",

    },
  });
};
