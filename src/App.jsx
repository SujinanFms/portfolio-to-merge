import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "./components/sidebar";
import DashBoard from "./pages/dashboard/dashboard";
import Employee from "./pages/employee/employee";
import Information from "./pages/employee/add-info/information";
import ViewEmployee from "./pages/employee/view-employee";
import EditEmployee from "./pages/employee/edit/edit";
import Edit from "./pages/employee/edit/edit-employee";
// // import EditFormEdu from "./pages/employee/edit/edit-form/edit-form-edu";
// import EditLanguageSkill from "./pages/employee/edit/edit-form/edit-form-langage";
// import EditTechnical from "./pages/employee/edit/edit-form/edit-form-technical";
// import EditCertificate from "./pages/employee/edit/edit-form/edit-form-cert";
// import EditWorkExp from "./pages/employee/edit/edit-form/edit-form-workexp";


function App() {
  return (
    <BrowserRouter>
    {/* <ModalEdit/> */}
      <SideBar>
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/Employee" element={<Employee />} />
          <Route path="/Information" element={<Information />} />
          <Route path="/ViewEmployee/:id" element={<ViewEmployee />} />
          <Route path="/EditEmployee/:id" element={<EditEmployee />} />
          {/* <Route path="/EditEmployee/:id/EditEducate/:EditEduId" element={<EditFormEdu />} /> */}
          {/* <Route path="/EditEmployee/:id/EditLanguageSkill/:EditLanguageId" element={<EditLanguageSkill />} />
          <Route path="/EditEmployee/:id/EditTechnical/:EditTechnicId" element={<EditTechnical />} />
          <Route path="/EditEmployee/:id/EditCertificate/:EditCertId" element={<EditCertificate />} />
          <Route path="/EditEmployee/:id/EditWorkExp/:EditWorkExpId" element={<EditWorkExp />} /> */}
          <Route path="/Edit" element={<Edit />} />
        </Routes>
      </SideBar>
    </BrowserRouter>
  );
}

export default App;
