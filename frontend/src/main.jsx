import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import store from "./store/store.js";
import { Provider } from "react-redux";
let persistor = persistStore(store);
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <ToastContainer />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
