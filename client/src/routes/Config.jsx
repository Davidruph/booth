import { Routes, Route } from "react-router-dom";
import { LoginPage, DashboardPage, ImageGrid } from "../pages";
import * as routes from "./router";

const App = () => {
  return (
    <Routes>
      <Route path={routes.INDEX} element={<LoginPage />} />
      <Route path={routes.WELCOME} element={<DashboardPage />} />
      <Route path={routes.GALLERY} element={<ImageGrid />} />
    </Routes>
  );
};

export default App;
