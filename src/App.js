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
        <Route path="/" element={<Navigate replace to="sheets" />} />
        <Route path="sheets/*" element={<Layout />} />
      </Routes>
    </Router>
  );
}

export default App;
