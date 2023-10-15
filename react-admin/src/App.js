import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./components/auth/SignIn"
import Dashboard from "./pages/dashboard";
import Users from "./pages/users/Users";
import AddUser from "./pages/users/AddUser";
import EditUser from "./pages/users/EditUser";
import Identities from "./pages/identities/Identities";
import Organizations from "./pages/organizations/Organizations";
import AddOrganization from "./pages/organizations/AddOrganization";
import EditOrganization from "./pages/organizations/EditOrganization";
import Skills from "./pages/skills/Skills";
import AddSkill from "./pages/skills/AddSkill";
import EditSkill from "./pages/skills/EditSkill";


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
          <Route path="/organizations" element={<Organizations/>} />
          <Route path="/organizations/add" element={<AddOrganization/>} />
          <Route path="/organizations/edit/:organizationId" element={<EditOrganization/>} />
          <Route path="/skills" element={<Skills/>} />
          <Route path="/skills/add" element={<AddSkill/>} />
          <Route path="/skills/edit/:skillId" element={<EditSkill/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
