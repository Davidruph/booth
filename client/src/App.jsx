import { BrowserRouter as Router } from "react-router-dom";
import RouterConfig from "./routes/Config";

function App() {
  return (
    <>
      <Router>
        <RouterConfig />
      </Router>
    </>
  );
}

export default App;
