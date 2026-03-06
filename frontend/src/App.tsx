import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SignDocument from "./pages/SignDocument"; // new page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* secure signing link route */}
        <Route path="/sign/:documentId" element={<SignDocument />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;