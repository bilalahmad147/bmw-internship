import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import Home from "./pages/home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DetailsPage from "./pages/detailsPage";

function App() {
  ModuleRegistry.registerModules([AllCommunityModule]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<DetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
