import React, { useRef, useState } from "react";
import AddStep3 from "../add-button-step/add-step-3";
import { mockUsers } from "./mock";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { Button, Table } from "rsuite";
import { Stack } from "@mui/material";
import { ColorButton } from "./button-nextstep";
import axios from "axios";
import Swal from "sweetalert2";

//data education table
const data = mockUsers(1);
const { Column, HeaderCell, Cell } = Table;

// creating functional component ans getting props from app.js and destucturing them
const StepThree = ({
  nextStep,
  handleFormDatah,
  handleTableDataStep3,
  sendTableData,
  prevStep,
  values,
}) => {

  //for rerender
  const [rerender, setRerender] = useState({
    num: 0,
  });

  let formArray = useRef([]);
  let tableData = useRef(JSON.parse(JSON.stringify(sendTableData)));

  const handleChildForm = (childForm) => {
    formArray.current.push(childForm);
    tableData.current.push(childForm);
    console.log("form array of step 3", formArray);

    setRerender((prevState) => ({
      ...prevState,
      num: rerender.num + 1,
    }));
  };

  const handleSubmit = async () => {
    for (let i = 0; i < formArray.current.length; i++) {
      const {
        language,
        listening,
        reading,
        speaking,
        writing,
      } = formArray.current[i];
      console.log(formArray.current[i]);
      handleTableDataStep3(formArray.current[i]);

      await axios({
        method: "post",
        url: "https://portfolio.blackphoenix.digital/addLanguage_skill",
        headers: { "Content-Type": "application/json" },
        data: {
          employee_Id: "5",
          language_id: language,
          listening_rate: listening,
          reading_rate: reading,
          speaking_rate: speaking,
          writing_rate: writing,
          update_user_id: "",
        },
      })
        .then(function (response) {
          console.log(response);
          if (response.status == 200) {
            console.log(response)
            Swal.fire("เพิ่มทักษะทางภาษา!", "สำเร็จ").then(() => {
              window.location.reload();
            });
          }
        })
        .catch(function (error) {
          console.log(error)
          Swal.fire("เพิ่มทักษะทางภาษา!", "ไม่สำเร็จ").then(() => {
            window.location.reload();
          });
          console.log(error);
        });
    }
    nextStep();
  };

  return (
    <>
      <div className="InfoStep3">
        <div className="AddLanguageSkill">
          <AddStep3 handleChildForm={handleChildForm} />
        </div>
        {/* End AddLanguageSkill */}
        <div className="ShowLanguageSkill">
          <Table
            height={400}
            data={tableData.current}
            onRowClick={(rowData) => {
              console.log(rowData);
            }}
          >
            <Column width={100} align="center" fixed>
              <HeaderCell>ลำดับ</HeaderCell>
              <Cell dataKey="employee_id" />
            </Column>

            <Column width={230}>
              <HeaderCell>ภาษา</HeaderCell>
              <Cell dataKey="language" />
            </Column>

            <Column width={230}>
              <HeaderCell>การฟัง</HeaderCell>
              <Cell dataKey="listening" />
            </Column>

            <Column width={230}>
              <HeaderCell>การพูด</HeaderCell>
              <Cell dataKey="speaking" />
            </Column>

            <Column width={230}>
              <HeaderCell>การอ่าน</HeaderCell>
              <Cell dataKey="reading" />
            </Column>

            <Column width={220}>
              <HeaderCell>การเขียน</HeaderCell>
              <Cell dataKey="writing" />
            </Column>
          </Table>
        </div>
        {/* End ShowLanguageSkill */}
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
            // onClick={nextStep}
            onClick={handleSubmit}
          >
            ถัดไป
          </ColorButton>
        </Stack>
      </div>

      {/* End InfoStep3 */}
    </>
  );
};

export default StepThree;
