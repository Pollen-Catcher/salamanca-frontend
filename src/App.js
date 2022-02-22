import Paperbase from "./components/Paperbase";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Firestore from "./pages/Firestore/index";

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Paperbase />}/>
            <Route path="sheets/:sheetId" element={<Firestore/>}/>
        </Routes>
    </Router>
  );
}

export default App;
