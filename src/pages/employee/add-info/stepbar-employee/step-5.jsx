import React from "react";
import AddStep5 from "../add-button-step/add-step-5";
import { mockUsers } from "./mock";
import { Button, Table } from "rsuite";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { Stack} from "@mui/material";
import {ColorButton} from "./button-nextstep";

//data education table
const data = mockUsers(1);
const { Column, HeaderCell, Cell } = Table;

// creating functional component ans getting props from app.js and destucturing them
const StepFive = ({ nextStep, handleFormData, prevStep, values }) => {
  return (
    <>
      <div className="InfoStep5">
        <div className="AddCertification">
          <AddStep5 />
        </div>
        {/* End AddCertification */}
        <div className="ShowCertification">
          <Table
            height={400}
            data={data}
            onRowClick={(rowData) => {
              console.log(rowData);
            }}
          >
            <Column width={80} align="center" fixed>
              <HeaderCell>ลำดับ</HeaderCell>
              <Cell dataKey="" />
            </Column>

            <Column width={240}>
              <HeaderCell>หลักสูตร</HeaderCell>
              <Cell dataKey="" />
            </Column>

            <Column width={320}>
              <HeaderCell>สถาบันการฝึกอบรม</HeaderCell>
              <Cell dataKey="" />
            </Column>

            <Column width={300}>
              <HeaderCell>วันที่อบรม</HeaderCell>
              <Cell dataKey="" />
            </Column>

            <Column width={300}>
              <HeaderCell>วันจบหลักสูตรการอบรม</HeaderCell>
              <Cell dataKey="" />
            </Column>
          </Table>
        </div>
        {/* End ShowCertification */}
        <Stack
          direction="row"
          spacing={2}
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
          <ColorButton
            variant="contained"
            type="submit"
            endIcon={<SkipNextIcon />}
            onClick={nextStep}
          >
            ถัดไป
          </ColorButton>
        </Stack>
      </div>{" "}
      {/* End InfoStep5 */}
    </>
  );
};

export default StepFive;
