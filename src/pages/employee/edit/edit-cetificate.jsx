import React, { useEffect, useState } from "react";
import "../../../css/style.css";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Schema,
} from "rsuite";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

import token from "../../../token-apiurl/token";
import apiUrl from "../../../token-apiurl/apiurl";
import { useParams } from "react-router-dom";
import moment from "moment";
import AddCertificate from "./add-in-edit/add-certificate";
import Swal from "sweetalert2";
import axios from "axios";

const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));

const Field = React.forwardRef((props, ref) => {
  const { name, message, label, accepter, error, ...rest } = props;
  return (
    <Form.Group ref={ref} className={error ? "has-error" : ""}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control
        type
        name={name}
        accepter={accepter}
        errorMessage={error}
        {...rest}
      />
      <Form.HelpText>{message}</Form.HelpText>
    </Form.Group>
  );
});

const { StringType, DateType } = Schema.Types;
const model = Schema.Model({
  course: StringType().isRequired("กรุณาเลือกหลักสูตร"),
  organization: StringType().isRequired("กรุณาเลือกสถาบันการอบรม"),
  startdate: DateType().isRequired("กรุณาเลือกวันที่เริ่มอบรม"),
  enddate: DateType().isRequired("กรุณาเลือกวันที่สิ้นสุดการอบรม"),
});

const EditCertificate = () => {
  const { id } = useParams();
  const [empPersonalCert, setempPersonalCert] = useState([]);

  //modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCertModal, setModalArrCertID] = useState([]);
  const [size, setSize] = React.useState("md");
  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [checkCount, setcheckCount] = React.useState(0);
  const [formCourse, setFormCourse] = React.useState();
  const [formOrg, setFormOrg] = React.useState();
  const [formStartdate, setFormStartdate] = React.useState();
  const [formEnddate, setFormEnddate] = React.useState();
  const [formDetail, setFormDetail] = React.useState();
  const [file, setFile] = React.useState();

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiUrl, { headers })
      .then((response) => response.json())
      .then((data) => setempPersonalCert(data));
  }, []);

  let arrPersonal = [];
  for (let i = 0; i < empPersonalCert.length; i++) {
    if (id == empPersonalCert[i].employee_id) {
      // console.log(empPersonalCert[i]);
      arrPersonal.push(empPersonalCert[i]);
    }
  }

  let arr = [];
  for (let i = 0; i < arrPersonal.length; i++) {
    for (let j = 0; j < arrPersonal[i].cerTificate.length; j++) {
      arr.push(arrPersonal[i]?.cerTificate[j]);
    }
  }
  // console.log("arr cerTificate : ", arr);

  // close Modal
  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  //function onchange Open Modal
  let arrCertId = [];
  const certById = (data) => {
    setEditModalOpen(true);
    // console.log(data);
    arrCertId.push(data);
    setModalArrCertID(arrCertId);
    // console.log(editCertModal);

    if (checkCount == 0) {
      setFormCourse(arrCertId[0].certificate_name);
      setFormOrg(arrCertId[0].organization);
      setFormDetail(arrCertId[0].certificate_detail);
      setFormStartdate(arrCertId[0].start_date);
      setFormEnddate(arrCertId[0].end_date);
      setFile(arrCertId[0].transcript);
    } else {
      setcheckCount(1);
    }
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  //บันทึกการแก้ไขข้อมูลการศึกษา
  const submitUpdate = async () => {
    Swal.fire({
      title: `คุณต้องการแก้ไขข้อมูลการอบรม`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit(editCertModal);
      }
    });

    const sDate = moment(formStartdate).format("YYYY-MM-DD");
    const eDate = moment(formEnddate).format("YYYY-MM-DD");

    const handleSubmit = async (editCertModal) => {
      console.log("id ", id);
      console.log("certificate_id ", editCertModal[0].certificate_id);
      console.log("certificate_name ", formCourse);
      console.log("organization ", formOrg);
      console.log("certificate_detail", formDetail);
      console.log("start_date ", sDate);
      console.log("end_date", eDate);
      console.log("update_user_id ", id);

      await axios({
        method: "put",
        url: "https://portfolio.blackphoenix.digital/updateCertificate",
        headers: { "Content-Type": "application/json" },
        data: {
          employee_Id: id,
          certificate_id: editCertModal[0].certificate_id,
          certificate_name: formCourse,
          organization: formOrg,
          certificate_detail: formDetail,
          start_date: sDate,
          end_date: eDate,
          update_user_id: id,
        },
      })
        .then(function (response) {
          if (response.status == 200) {
            console.log(response);
            // Swal.fire(`แก้ไขข้อมูลการศึกษา`, "สำเร็จ");
          }
        })
        .catch(function (error) {
          // Swal.fire(`แก้ไขข้อมูลการศึกษา`, "ไม่สำเร็จ!");
          console.log(error);
        });

      var data = new FormData();
      data.append("employee_id", id);
      data.append("certificate_id", editCertModal[0].certificate_id);
      data.append("file", file);

      console.log("employee_id", id);
      console.log("certificate_id", editCertModal[0].certificate_id);
      console.log("file", file);

      var config = {
        method: "post",
        url: "https://portfolio.blackphoenix.digital/uploadImageCer",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          if (response.status == 200) {
            Swal.fire(`แก้ไขข้อมูลการอบรม`, "สำเร็จ").then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire(`แก้ไขข้อมูลการอบรม`, "ไม่สำเร็จ!").then(() => {
              window.location.reload();
            });
          }
        })
        .catch(function (error) {
          console.log(error);
          Swal.fire(`แก้ไขข้อมูลการอบรม`, "ไม่สำเร็จ!").then(() => {
            window.location.reload();
          });
        });
    };
  };

  //delete
  const remove = (Certid) => {
    const deleteCert = arr.filter((item) => item.certificate_id == Certid);
    Swal.fire({
      title: `คุณต้องการลบข้อมูลการอบรม`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit(deleteCert);
      }
    });

    const handleSubmit = async (deleteCert) => {
      console.log("deleteCert", deleteCert);
      console.log("id ", id);
      console.log("Certid ", Certid);

      try {
        axios({
          method: "delete",
          url: "https://portfolio.blackphoenix.digital/deleteCertificateId",
          headers: { "Content-Type": "application/json" },
          data: {
            employeeId: id,
            certificateId: Certid,
          },
        })
          .then(function (response) {
            if (response.status == 200) {
              Swal.fire("ลบข้อมูลการอบรม", "สำเร็จ").then(() => {
                window.location.reload();
              });
            } else {
              Swal.fire("ไม่สำเร็จ!").then(() => {
                window.location.reload();
              });
            }
          })
          .catch(function (error) {
            console.log(error);
            Swal.fire("ไม่สำเร็จ!").then(() => {
              window.location.reload();
            });
          });
      } catch (error) {
        Swal.fire("ไม่สำเร็จ!");
        console.error(error.response);
      }
    };
  };

  return (
    <div>
      <AddCertificate />
      <table className="table custom-header">
        <thead className="table-primary">
          <tr>
            <th scope="col" style={{ textAlign: "center" }}>
              ลำดับ
            </th>
            <th scope="col">หลักสูตร</th>
            <th scope="col">สถาบันการฝึกอบรม</th>
            <th scope="col">วันที่อบรม</th>
            <th scope="col">วันจบหลักสูตรการอบรม</th>
            <th scope="col">แก้ไข</th>
            <th scope="col">ลบ</th>
          </tr>
        </thead>
        {arr.map((item, index) => (
          <tbody key={index}>
            <tr>
              <th scope="row" style={{ textAlign: "center" }}>
                {item.certificate_id}
              </th>
              <td>{item.certificate_name}</td>
              <td>{item.organization}</td>
              <td>{moment(item.start_date).format("DD/MM/YYYY")}</td>
              <td>{moment(item.end_date).format("DD/MM/YYYY")}</td>
              <td width={50}>
                <Button onClick={() => certById(item)}>
                  <FaRegEdit />
                </Button>
              </td>
              <td width={50}>
                <Button onClick={() => remove(item.certificate_id)}>
                  <FaRegTrashAlt />
                </Button>
              </td>
            </tr>
          </tbody>
        ))}
      </table>

      <Modal size={size} open={editModalOpen} onClose={closeEditModal}>
        <Modal.Header>
          <Modal.Title>แก้ไขข้อมูลการอบรม</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editCertModal.map((certItem, icert) => (
            <Form
              key={icert}
              ref={formRef}
              onCheck={setFormError}
              defaultValue={certItem}
              model={model}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Row>
                <Col>
                  <Field
                    name="course"
                    label="หลักสูตร:"
                    accepter={Input}
                    error={formError.course}
                    defaultValue={certItem.certificate_name}
                    onChange={setFormCourse}
                  />

                  <Field
                    name="organization"
                    label="สถาบันการฝึกอบรม:"
                    accepter={Input}
                    error={formError.organization}
                    defaultValue={certItem.organization}
                    onChange={setFormOrg}
                  />
                  <Row>
                    <Col>
                      <Field
                        name="startdate"
                        label="วันที่อบรม:"
                        accepter={DatePicker}
                        error={formError.startdate}
                        style={{ width: 145 }}
                        placeholder="วว-ดด-ปปปป"
                        format="dd-MM-yyyy"
                        defaultValue={new Date(certItem.start_date)}
                        onChange={setFormStartdate}
                      />
                    </Col>
                    <Col>
                      <Field
                        name="enddate"
                        label="วันจบหลักสูตรอบรม:"
                        accepter={DatePicker}
                        error={formError.enddate}
                        style={{ width: 145 }}
                        placeholder="วว-ดด-ปปปป"
                        format="dd-MM-yyyy"
                        defaultValue={new Date(certItem.end_date)}
                        onChange={setFormEnddate}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Field
                    name="detail"
                    label="รายละเอียดการอบรม:"
                    accepter={Textarea}
                    // error={formError.detail}
                    defaultValue={certItem.certificate_detail}
                    style={{ height: 144 }}
                    onChange={setFormDetail}
                  />

                  <label style={{ marginBottom: 3 }}>ใบรับรองการอบรม:</label>
                  <input
                    className="form-control 1"
                    id="pic"
                    type="file"
                    accept=".jpg, .png"
                    style={{ width: 300 }}
                    onChange={handleFileSelect}
                  />
                </Col>
              </Row>
            </Form>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={submitUpdate} appearance="primary">
            บันทึก
          </Button>
          <Button onClick={closeEditModal} appearance="subtle">
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditCertificate;
