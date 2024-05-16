import { Routes, Route } from "react-router-dom";
import { LoginPage, DashboardPage, ImageGrid, SignupPage } from "../pages";
import * as routes from "./router";

const App = () => {
  return (
    <Routes>
      <Route path={routes.LOGIN} element={<LoginPage />} />
      <Route path={routes.SIGNUP} element={<SignupPage />} />
      <Route path={routes.INDEX} element={<DashboardPage />} />
      <Route path={routes.GALLERY} element={<ImageGrid />} />
    </Routes>
  );
};

export default App;
