import React, { useRef, useState } from "react";
import AddStep4 from "../add-button-step/add-step-4";
import { mockUsers } from "./mock";
import { Button, Table } from "rsuite";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { Stack } from "@mui/material";
import { ColorButton } from "./button-nextstep";
import axios from "axios";
import Swal from "sweetalert2";

//data education table
const data = mockUsers(1);
const { Column, HeaderCell, Cell } = Table;

// creating functional component ans getting props from app.js and destucturing them
const StepFour = ({
  nextStep,
  handleFormData,
  handleTableDataStep4,
  sendTableData,
  prevStep,
  values,
}) => {
  //for rerender
  const [rerender, setRerender] = useState({
    num: 0,
  });

  let formArray = useRef([]);
  let childFormSkill = [];
  let childFormFrame = [];
  let tableData = useRef(JSON.parse(JSON.stringify(sendTableData)));
 

  const handleChildForm = (childForm) => {
    const skillForm = childForm.formValue.skill;
    const frameworkForm = childForm.frameworkValue;
    console.log("formValue", childForm.formValue.skill, "skillForm: ",  skillForm);
    console.log("frameworkValue", childForm.frameworkValue, "frameworkForm: ", frameworkForm);
    formArray.current.push(childForm);
    childFormSkill.push(skillForm);
    childFormFrame.push(frameworkForm);
    tableData.current.push(childForm.formValue.skill, childFormFrame);
    console.log("form childFormSkill of step 4", childFormSkill);
    console.log("form childFormFrame of step 4", childFormFrame);
    console.log("form value of step 4", formArray);

    setRerender((prevState) => ({
      ...prevState,
      num: rerender.num + 1,
    }));
  };

  /*   const handleSubmit = async () => {
    for (let i = 0; i < formArray.current.length; i++) {
      const {
        skill, frameworkValue
      } = formArray.current[i];
      console.log(formArray.current[i]);
      handleTableDataStep4(formArray.current[i]);

      await axios({
        method: "post",
            url: "https://portfolio.blackphoenix.digital/appendTechSkills",
            headers: { "Content-Type": "application/json" },
            data: {
              employee_Id: "",
              category_id: childFormSkill,
              framework_id: childFormFrame,
            },
      })
        .then(function (response) {
          console.log(response);
          if (response.status == 200) {
            Swal.fire("เพิ่มทักษะทางภาษา!", "สำเร็จ").then(() => {
              window.location.reload();
            });
          }
        })
        .catch(function (error) {
          Swal.fire("เพิ่มทักษะทางภาษา!", "ไม่สำเร็จ").then(() => {
            window.location.reload();
          });
          console.log(error);
        });
    }
    nextStep();
  }; */

  return (
    <>
      <div className="InfoStep4">
        <div className="AddTechnicalSkill">
          <AddStep4 handleChildForm={handleChildForm} />
        </div>
        {/* End AddTechnicalSkill */}
        <div className="ShowTechnicalSkill">
          <Table
            height={400}
            data={tableData.current}
            onRowClick={(rowData) => {
              console.log(rowData);
            }}
          >
            <Column width={80} align="center" fixed>
              <HeaderCell>ลำดับ</HeaderCell>
              <Cell dataKey="1" />
            </Column>

            <Column width={310}>
              <HeaderCell>ประเภท</HeaderCell>
              <Cell dataKey="formValue.skill" />
            </Column>

            <Column width={850}>
              <HeaderCell>ทักษะ</HeaderCell>
              <Cell dataKey="childFormFrame" />
            </Column>
          </Table>
        </div>{" "}
        {/* End ShowTechnicalSkill */}
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
            // onClick={handleSubmit}
          >
            ถัดไป
          </ColorButton>
        </Stack>
      </div>

      {/* End InfoStep4 */}
    </>
  );
};

export default StepFour;
