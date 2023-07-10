import React, { useEffect, useState, useRef, useCallback } from "react";

import "../../../css/style.css";
import { useParams } from "react-router-dom";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import moment from "moment";

import token from "../../../token-apiurl/token";
import apiUrl from "../../../token-apiurl/apiurl";
import { styled } from "@mui/material";
import { purple } from "@mui/material/colors";
import axios from "axios";
import Swal from "sweetalert2";

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  "&:hover": {
    backgroundColor: purple[700],
  },
}));

export default function EditEmployee() {
  const { id } = useParams();
  const [empPersonal, setEmpPersonal] = useState("");
  const [validated, setValidated] = useState(false);

  const updateFullname = useRef();
  const updateEmailEmp = useRef();
  const updateBirthdayEmp = useRef();
  const updateTelEmp = useRef();
  const updateLineId = useRef();
  const updateCitizenId = useRef();
  const updateCitizenAddress = useRef();
  const updateCurrentAddress = useRef();
  const [file, setFile] = useState(null);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiUrl, { headers })
      .then((response) => response.json())
      .then((data) => setEmpPersonal(data));
  }, []);

  let arrPersonal = [];
  for (let i = 0; i < empPersonal.length; i++) {
    if (id == empPersonal[i].employee_id) {
      // console.log(empPersonal[i]);
      arrPersonal.push(empPersonal[i]);
    }
  }
  // console.log(arrPersonal);

  // เงื่อนไขเช็คกำหนดค่า default picture  ไว้ใน usesatate หากไม่มีการ onchange ให้ส่งค่าเดิมไป
  if (file == "") {
    setFile(arrPersonal[0].picture);
  }

  //function set รูปภาพที่เลือก ไว้ใน usestate => setFile
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  //Update Employee
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `https://portfolio.blackphoenix.digital/updateEmployee`,
        {
          employee_Id: id,
          employee_name: updateFullname.current?.value,
          birth_date: updateBirthdayEmp.current?.value,
          email: updateEmailEmp.current?.value,
          phone: updateTelEmp.current?.value,
          line: updateLineId.current?.value,
          citizen_id: updateCitizenId.current?.value,
          address_citizen: updateCitizenAddress.current?.value,
          address_current: updateCurrentAddress.current?.value,
          update_user_id: id,
        }
      );

      var data = new FormData();
      data.append("employee_id", id);
      data.append("file", file);

      console.log("employee_id", id);
      console.log("file", file);

      var config = {
        method: "post",
        url: "https://portfolio.blackphoenix.digital/uploadImageEmp",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          // Swal.fire(`เพิ่มข้อมูลการศึกษา`, "สำเร็จ");
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });

      Swal.fire("แก้ไขข้อมูลส่วนตัว", "สำเร็จ").then(() => {
        window.location.reload();
      });
      // console.log("success");
    } catch (error) {
      Swal.fire(`แก้ไขข้อมูลส่วนตัว`, "ไม่สำเร็จ!");
      // console.error("ไม่สำเร็จ", error.response.data.message);
      // console.log(error);
    }
  };

  return (
    <div className="m-3">
      {arrPersonal.map((ItemPersonal, index) => (
        <Card style={{ marginTop: 20, textAlign: "left" }} key={index}>
          <Card.Body>
            <Form
              noValidate
              validated={validated}
            >
              <Row>
                <Col>
                  <Row>
                    <Col>
                      <Row>
                        <Col>
                          <div className="form-group">
                            <center>
                              <img
                                alt={ItemPersonal.picture}
                                src={ItemPersonal.picture}
                                style={{
                                  width: 150,
                                  height: 150,
                                  borderRadius: 75,
                                }}
                              />
                            </center>
                          </div>
                        </Col>
                        <Col style={{ marginTop: 80 }}>
                          <div className="form-group">
                            <label>รูปโปรไฟล์</label>
                          </div>
                          <div className="form-group">
                            <input
                              className="form-control"
                              name="imageEmp"
                              placeholder="รูปโปรไฟล์"
                              id="pic"
                              type="file"
                              onChange={handleFileSelect}
                              required
                              style={{ width: 260 }}
                            />
                            <Form.Control.Feedback>
                              ข้อมูลถูกต้อง
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              กรุณาเลือก รูปโปรไฟล์
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Row>
                    </Col>

                    <div className="form-group m-3">
                      <label>ชื่อ-นามสกุล</label>
                      <input
                        className="form-control"
                        name="fullname"
                        id="fullname"
                        type="text"
                        defaultValue={ItemPersonal.employee_name}
                        ref={updateFullname}
                        required
                        style={{ width: 540 }}
                      />
                      <Form.Control.Feedback>
                        ข้อมูลถูกต้อง
                      </Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        กรุณากรอก ชื่อและนามสกุล
                      </Form.Control.Feedback>
                    </div>
                    <Col>
                      <div className="form-group m-3">
                        <label>อีเมล</label>
                        <input
                          className="form-control"
                          name="emailEmp"
                          defaultValue={ItemPersonal.email}
                          id="emailEmp"
                          type="email"
                          ref={updateEmailEmp}
                          required
                        />
                        <Form.Control.Feedback>
                          ข้อมูลถูกต้อง
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                          กรุณากรอก อีเมล
                        </Form.Control.Feedback>
                      </div>
                      <div className="form-group m-3">
                        <label>เบอร์ติดต่อ</label>
                        <input
                          className="form-control"
                          name="telEmp"
                          value={ItemPersonal.phone}
                          id="telEmp"
                          type="tel"
                          ref={updateTelEmp}
                          disabled
                        />
                      </div>
                    </Col>
                    <Col>
                      <div className="form-group m-3">
                        <label>วันเกิด</label>
                        <input
                          className="form-control"
                          name="birthdayEmp"
                          id="birthdayEmp"
                          type="date"
                          defaultValue={moment(ItemPersonal.birth_date).format(
                            "YYYY-MM-DD"
                          )}
                          ref={updateBirthdayEmp}
                          required
                        />
                        <Form.Control.Feedback>
                          ข้อมูลถูกต้อง
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                          กรุณากรอก วัน/เดือน/ปี เกิด
                        </Form.Control.Feedback>
                      </div>
                      <div className="form-group m-3">
                        <label>ไลน์</label>
                        <input
                          className="form-control"
                          name="lineId"
                          id="lineId"
                          type="text"
                          defaultValue={ItemPersonal.line}
                          ref={updateLineId}
                          required
                        />
                        <Form.Control.Feedback>
                          ข้อมูลถูกต้อง
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                          กรุณากรอก ไลน์ไอดี
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Row>
                </Col>

                <Col>
                  <Row>
                    <Col>
                      <div className="form-group m-3">
                        <label>เลขบัตรประชาชน</label>
                        <input
                          className="form-control"
                          name="CitizenId"
                          id="CitizenId"
                          type="text"
                          defaultValue={ItemPersonal.citizen_id}
                          ref={updateCitizenId}
                          required
                        />
                        <Form.Control.Feedback>
                          ข้อมูลถูกต้อง
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                          กรุณากรอก เลขบัตรประชาชาน
                        </Form.Control.Feedback>
                      </div>
                      <div className="form-group m-3">
                        <label>ที่อยู่ตามบัตรประชาชน</label>
                        <textarea
                          className="form-control"
                          name="CitizenAddress"
                          id="CitizenAddress"
                          rows="3"
                          defaultValue={ItemPersonal.address_citizen}
                          ref={updateCitizenAddress}
                          required
                          style={{ height: 130 }}
                        ></textarea>{" "}
                        <Form.Control.Feedback>
                          ข้อมูลถูกต้อง
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                          กรุณากรอก ที่อยู่ตามบัตรประชาชน
                        </Form.Control.Feedback>
                      </div>

                      <div className="form-group m-3">
                        <label>ที่อยู่ปัจจุบัน</label>
                        <textarea
                          className="form-control"
                          name="CurrentAddress"
                          id="CurrentAddress"
                          rows="3"
                          defaultValue={ItemPersonal.address_current}
                          ref={updateCurrentAddress}
                          required
                          style={{ height: 130 }}
                        ></textarea>{" "}
                        <Form.Control.Feedback>
                          ข้อมูลถูกต้อง
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                          กรุณากรอก ที่อยู่ปัจจุบัน
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Row>
                </Col>

                <div
                  className="form-group m-3"
                  style={{ textAlign: "center", color: "#d554bf" }}
                >
                  <ColorButton
                    type="submit"
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    {" "}
                    บันทึก
                  </ColorButton>
                </div>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
