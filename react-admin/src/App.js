import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./components/auth/SignIn"
import Dashboard from "./pages/dashboard";
import Users from "./pages/users/Users";
import AddUser from "./pages/users/AddUser";
import EditUser from "./pages/users/EditUser";
import Identities from "./pages/identities/Identities";

function App() {
 
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn/>}/>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/users" element={<Users/>} />
          <Route path="/users/add" element={<AddUser/>} />
          <Route path="/users/edit/:userId" element={<EditUser/>} />
          <Route path="/identities" element={<Identities/>} />
          {/* <Route path="/identities/add" element={<AddIdentity/>} />
          <Route path="/identities/edit/:id" element={<EditIdentity/>} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
