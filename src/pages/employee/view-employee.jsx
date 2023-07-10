import { Container, Panel, Stack, Row, Col, Grid, Divider, Tag } from "rsuite";
import DetailPersonal from "./add-info/tab-detail-employee/detail-employee";
import DetailEducation from "./add-info/tab-detail-employee/detail-education";
import DetailWorkExp from "./add-info/tab-detail-employee/detail-workexp";
import DetailCert from "./add-info/tab-detail-employee/detail-certificate";
import DetailSkillLanguage from "./add-info/tab-detail-employee/detail-language";

import token from "../../token-apiurl/token.jsx";
import apiUrl from "../../token-apiurl/apiurl.jsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const StyleCol = {
  backgroundColor: "rgb(250 ,250, 250 )",
  borderRadius: "25px",
  padding: "20px",
  margin: "10px",
};

function ViewEmployee() {
  const { id } = useParams();
  const [empViewPersonal, setViewPersonal] = useState([]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiUrl, { headers })
      .then((response) => response.json())
      .then((data) => setViewPersonal(data));
  }, []);

  let arrView = [];
  for (let i = 0; i < empViewPersonal.length; i++) {
    if (id == empViewPersonal[i].employee_id) {
      // console.log(empViewPersonal[i]);
      arrView.push(empViewPersonal[i]);
    }
  }

  // เช็คสถานะการทำงานเพื่อกำหนดสี
  const CheckStatus = (data) => {
    let arrWorkStatus = [];

    if (data.workExperience && data.workExperience.length > 0) {
      if (data.workExperience[0].onsite_status === 0) {
        arrWorkStatus.push("green");
      } else {
        arrWorkStatus.push("yellow");
      }
    } else {
      arrWorkStatus.push("red");
    }

    return arrWorkStatus;
  };

  // เช็คสถานะการทำงานเพื่อแสดงข้อความรายละเอียด
  const CheckStatusDetail = (data) => {
    let arrWorkStatusDetail = [];

    if (data.workExperience && data.workExperience.length > 0) {
      if (data.workExperience[0].onsite_status === "0") {
        arrWorkStatusDetail.push("อยู่บริษัท");
      } else {
        arrWorkStatusDetail.push("ไม่อยู่ที่บริษัท");
      }
    } else {
      arrWorkStatusDetail.push("รอสถานะ");
    }

    return arrWorkStatusDetail;
  };

  // เช็คข้อมูลลูกค้าหรือบริษัทที่ทำงาน
  const checkCustomer = (data) => {
    let arrCus = [];

    if (data.workExperience && data.workExperience.length > 0) {
      const v = data.workExperience[0];

      if (v.onsite_status === 0) {
        arrCus.push(v.company_name);
      } else if (v.onsite_status === 1) {
        arrCus.push(v.customer_name);
      }
    } else {
      arrCus.push("ไม่มีข้อมูล");
    }

    return arrCus;
  };

  // เช็ควันที่เริ่มและสิ้นสุดการทำงาน
  const checkDate = (data) => {
    let arrDate = [];

    if (data.workExperience && data.workExperience.length > 0) {
      const workExperience = data.workExperience[0];

      if (workExperience.onsite_status === "0") {
        if (
          (workExperience.start_date === null ||
            workExperience.start_date === "0000-00-00") &&
          (workExperience.end_date === null ||
            workExperience.end_date === "0000-00-00")
        ) {
          arrDate.push("ไม่มีข้อมูล");
        } else if (
          workExperience.start_date !== null &&
          workExperience.start_date !== "0000-00-00" &&
          (workExperience.end_date === null ||
            workExperience.end_date === "0000-00-00")
        ) {
          arrDate.push(
            dayjs(workExperience.start_date).format("DD/MM/YYYY"),
            " - ปัจจุบัน"
          );
        } else {
          arrDate.push(
            dayjs(workExperience.start_date).format("DD/MM/YYYY"),
            " - ",
            dayjs(workExperience.end_date).format("DD/MM/YYYY")
          );
        }
      } else {
        if (
          (workExperience.customer_start_date === null ||
            workExperience.customer_start_date === "0000-00-00") &&
          (workExperience.customer_end_date === null ||
            workExperience.customer_end_date === "0000-00-00")
        ) {
          arrDate.push("ไม่มีข้อมูล");
        } else if (
          workExperience.customer_start_date !== null &&
          workExperience.customer_start_date !== "0000-00-00" &&
          (workExperience.customer_end_date === null ||
            workExperience.customer_end_date === "0000-00-00")
        ) {
          arrDate.push(
            dayjs(workExperience.customer_start_date).format("DD/MM/YYYY"),
            " - ปัจจุบัน"
          );
        } else {
          arrDate.push(
            dayjs(workExperience.customer_start_date).format("DD/MM/YYYY"),
            " - ",
            dayjs(workExperience.customer_end_date).format("DD/MM/YYYY")
          );
        }
      }
    } else {
      arrDate.push("ไม่พบข้อมูล");
    }

    return arrDate;
  };

  return (
    <div className="Content">
      <Container>
        <div className="headEmployeeDetail">
          <Panel
            bordered
            header={
              <Stack justifyContent="space-between">
                <span>
                  {arrView.map((ItemPersonal, index) => (
                    <Row key={index}>
                      <Col>
                        <div>
                          <h4>คุณ{ItemPersonal.employee_name}</h4>
                          <p style={{ color: "#575757" }}>
                            {ItemPersonal.position_name}
                          </p>
                        </div>
                      </Col>
                      <Col>
                        <Stack>
                          <Tag color={(onchange = CheckStatus(ItemPersonal))}>
                            {(onchange = CheckStatusDetail(ItemPersonal))}
                          </Tag>
                          <Divider vertical />
                          <h6 style={{ color: "#575757" }}>
                            {(onchange = checkCustomer(ItemPersonal))}
                            <br />
                            {(onchange = checkDate(ItemPersonal))}
                          </h6>
                        </Stack>
                      </Col>
                    </Row>
                  ))}
                </span>
              </Stack>
            }
          >
            <Grid fluid>
              <Row className="show-grid">
                <Col xsHidden xs={16}>
                  <DetailPersonal />
                </Col>
                <Col xs={8}>
                  <DetailEducation />
                </Col>
              </Row>

              <Row className="show-grid" gutter={30}>
                <Col xsHidden xs={7} style={StyleCol}>
                  <DetailSkillLanguage />
                </Col>
                <Col xs={8} style={StyleCol}>
                  <DetailWorkExp />
                </Col>
                <Col xs={7} style={StyleCol}>
                  <DetailCert />
                </Col>
              </Row>
            </Grid>
          </Panel>
        </div>
      </Container>
    </div>
  );
}
export default ViewEmployee;
