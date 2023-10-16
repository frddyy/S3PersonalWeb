import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard";
import Users from "./pages/users/Users";
import AddUser from "./pages/users/AddUser";
import EditUser from "./pages/users/EditUser";
import Identities from "./pages/identities/Identities";
import AddIdentity from "./pages/identities/AddIdentity";
import EditIdentity from "./pages/identities/EditIdentity";
import Educations from "./pages/educations/Educations";
import AddEducation from "./pages/educations/AddEducation";
import EditEducation from "./pages/educations/EditEducation";
import Organizations from "./pages/organizations/Organizations";
import AddOrganization from "./pages/organizations/AddOrganization";
import EditOrganization from "./pages/organizations/EditOrganization";
import Skills from "./pages/skills/Skills";
import AddSkill from "./pages/skills/AddSkill";
import EditSkill from "./pages/skills/EditSkill";
import Portfolios from "./pages/portfolios/Portfolios";
import AddPortfolio from "./pages/portfolios/AddPortfolio";
import EditPortfolio from "./pages/portfolios/EditPortfolio";
import LandingPage from "./pages/landing";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/edit/:userId" element={<EditUser />} />
          <Route path="/identities" element={<Identities />} />
          <Route path="/identities/add" element={<AddIdentity />} />
          <Route
            path="/identities/edit/:identityId"
            element={<EditIdentity />}
          />
          <Route path="/educations" element={<Educations />} />
          <Route path="/educations/add" element={<AddEducation />} />
          <Route
            path="/educations/edit/:educationId"
            element={<EditEducation />}
          />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/organizations/add" element={<AddOrganization />} />
          <Route
            path="/organizations/edit/:organizationId"
            element={<EditOrganization />}
          />
          <Route path="/skills" element={<Skills />} />
          <Route path="/skills/add" element={<AddSkill />} />
          <Route path="/skills/edit/:skillId" element={<EditSkill />} />
          <Route path="/portfolios" element={<Portfolios />} />
          <Route path="/portfolios/add" element={<AddPortfolio />} />
          <Route
            path="/portfolios/edit/:portfolioId"
            element={<EditPortfolio />}
          />
          <Route path="/landing" element={<LandingPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
