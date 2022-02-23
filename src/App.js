import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { Layout } from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Layout />} />
        <Route path="/*" element={<Layout />} />
      </Routes>
    </Router>
  );
}

export default App;
