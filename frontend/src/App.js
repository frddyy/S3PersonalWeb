import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Users from "./pages/Users";
import Identities from "./pages/Identites";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import AddIdentity from "./pages/AddIdentities";
import EditIdentity from "./pages/EditIdentities";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/users" element={<Users/>} />
          <Route path="/users/add" element={<AddUser/>} />
          <Route path="/users/edit/:id" element={<EditUser />} />
          <Route path="/identities" element={<Identities/>} />
          <Route path="/identities/add" element={<AddIdentity/>} />
          <Route path="/identities/edit/:id" element={<EditIdentity/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
