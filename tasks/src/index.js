import React from "react";
import ReactDOM from "react-dom/client"; // Cambiar a 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";

const clientId =
  "620787684491-us81869i1822t97vrnvdc70o6tdpdki9.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
);
