import * as React from "react";
import "../../../css/style.css";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import EditEmployee from "./edit-employee";
import EditEducation from "./edit-education";
import EditLanguage from "./edit-languege-skill";
import EditTechnical from "./edit-technical-skill";
import EditCertificate from "./edit-cetificate";
import EditWorkExp from "./edit-workexperience";

const Edit = () => {
  const [value, setValue] = React.useState(
    localStorage.getItem("activeTab") || "personal"
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTabChange = (newValue) => {
    localStorage.setItem("activeTab", newValue);
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            // aria-label="lab API tabs example"
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab
              label="ข้อมูลพนักงาน"
              value="personal"
              onClick={() => handleTabChange("personal")}
            />
            <Tab
              label="การศึกษา"
              value="edu"
              onClick={() => handleTabChange("edu")}
            />
            <Tab
              label="ทักษะทางภาษา"
              value="language"
              onClick={() => handleTabChange("language")}
            />
            <Tab
              label="ทักษะทางคอมพิวเตอร์"
              value="technicalSkill"
              onClick={() => handleTabChange("technicalSkill")}
            />
            <Tab
              label="การอบรม"
              value="certification"
              onClick={() => handleTabChange("certification")}
            />
            <Tab
              label="ประสบการณ์ทำงาน"
              value="workExperience"
              onClick={() => handleTabChange("workExperience")}
            />
          </TabList>
        </Box>
        <TabPanel value="personal">
          {value === "personal" && <EditEmployee />}
        </TabPanel>
        <TabPanel value="edu">{value === "edu" && <EditEducation />}</TabPanel>
        <TabPanel value="language">
          {value === "language" && <EditLanguage />}
        </TabPanel>
        <TabPanel value="technicalSkill">
          {value === "technicalSkill" && <EditTechnical />}
        </TabPanel>
        <TabPanel value="certification">
          {value === "certification" && <EditCertificate />}
        </TabPanel>
        <TabPanel value="workExperience">
          {value === "workExperience" && <EditWorkExp />}
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default Edit;
