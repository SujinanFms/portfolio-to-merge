import React from "react";
import { useNavigate } from "react-router-dom";

import AddStep6 from "../add-button-step/add-step-6";
import { mockUsers } from "./mock";
import { Button, Table, Stack } from "rsuite";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import {ColorButton} from "./button-nextstep";


//data education table
const data = mockUsers(1);
const { Column, HeaderCell, Cell } = Table;

// creating functional component ans getting props from app.js and destucturing them
const StepSix = ({ nextStep, handleFormData, prevStep, values }) => {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/Employee");
  }
  return (
    <>
      <div className="InfoStep6">
        <Stack spacing={5}>
          <div className="AddWorkExperience">
            <AddStep6 />
          </div>
          {/* <p>(กรุณากรอกข้อมูลโดยเริ่มจากงานปัจจุบัน)</p> */}
        </Stack>
        {/* End AddWorkExperience */}
        <div className="ShowWorkExperience">
          <Table
            height={400}
            data={data}
            onRowClick={(rowData) => {
              console.log(rowData);
            }}
          >
            <Column width={60} align="center" fixed>
              <HeaderCell>ลำดับ</HeaderCell>
              <Cell dataKey="" />
            </Column>

            <Column width={200}>
              <HeaderCell>ชื่อบริษัท</HeaderCell>
              <Cell dataKey="" />
            </Column>

            <Column width={150}>
              <HeaderCell>ตำแหน่ง</HeaderCell>
              <Cell dataKey="" />
            </Column>

            <Column width={100}>
              <HeaderCell>วันที่เริ่มทำงาน</HeaderCell>
              <Cell dataKey="" />
            </Column>

            <Column width={150}>
              <HeaderCell>วันสิ้นสุดการทำงาน</HeaderCell>
              <Cell dataKey="" />
            </Column>

            <Column width={150}>
              <HeaderCell> สถานะการทำงาน</HeaderCell>
              <Cell dataKey="" />
            </Column>

            <Column width={250}>
              <HeaderCell>ชื่อบริษัทลูกค้า</HeaderCell>
              <Cell dataKey="" />
            </Column>

            <Column width={300}>
              <HeaderCell> วันที่เริ่มทำงาน (บริษัทลูกค้า)</HeaderCell>
              <Cell dataKey="" />
            </Column>

            <Column width={300}>
              <HeaderCell>วันสิ้นสุดการทำงาน(บริษัทลูกค้า)</HeaderCell>
              <Cell dataKey="" />
            </Column>
          </Table>
        </div>{" "}
        {/* End ShowWorkExperience */}
        <Stack
          direction="row"
          spacing={18}
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <Button
            variant="outlined"
            startIcon={<SkipPreviousIcon />}
            color="secondary"
            onClick={prevStep}
          >
            ย้อนกลับ
          </Button>
           {/* <Navigate to="/dashboard" replace={true} ></Navigate> */}
          <ColorButton variant="contained" type="submit" endIcon={<SaveAltIcon />} onClick={handleClick}>
            บันทึก
          </ColorButton>
        </Stack>
        {/*  <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Button appearance="primary" onClick={prevStep}>
            ย้อนกลับ
          </Button>

          <Button appearance="primary" onClick={nextStep}>
            บันทึก
          </Button>
        </div> */}
      </div>{" "}
      {/* End InfoStep6 */}
    </>
  );
};

export default StepSix;
