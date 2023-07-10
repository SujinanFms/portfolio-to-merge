import React from "react";
import "../../../../css/style.css";
import { Button, Table } from "rsuite";
import { mockUsers } from "./mock";
import AddStep2 from "../add-button-step/add-step-2";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { Stack} from "@mui/material";
import {ColorButton} from "./button-nextstep";

//data education table
const data = mockUsers(1);
const { Column, HeaderCell, Cell } = Table;


// creating functional component ans getting props from app.js and destucturing them
const StepTwo = ({ nextStep, handleFormData, prevStep, values }) => {
  return (
    <>
      <div className="InfoStep2">
        <div className="addEducation">
          <AddStep2 />
        </div>
        {/* End addEducation */}
        <div className="showEducation">
          <Table
            height={400}
            data={data}
            onRowClick={(rowData) => {
              console.log(rowData);
            }}
          >
            <Column width={140} align="center" fixed>
              <HeaderCell>ลำดับ</HeaderCell>
              <Cell dataKey="" />
            </Column>

            <Column width={270}>
              <HeaderCell>วุฒิการศึกษา</HeaderCell>
              <Cell dataKey="" />
            </Column>

            <Column width={270}>
              <HeaderCell>มหาวิทยาลัย</HeaderCell>
              <Cell dataKey="" />
            </Column>

            <Column width={200}>
              <HeaderCell>คณะ</HeaderCell>
              <Cell dataKey="" />
            </Column>

            <Column width={200}>
              <HeaderCell>สาขา</HeaderCell>
              <Cell dataKey="" />
            </Column>

            <Column width={150}>
              <HeaderCell>เกรดเฉลี่ย</HeaderCell>
              <Cell dataKey="" />
            </Column>

          </Table>
        </div>
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
      </div>
      {/* End InfoStep2 */}
    </>
  );
};

export default StepTwo;
