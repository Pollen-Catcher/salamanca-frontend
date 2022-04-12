import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { Layout } from "./pages";
import { LoginPage } from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Layout />} />
        <Route path="/*" element={<Layout />} />
        <Route path="/loginPage" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
