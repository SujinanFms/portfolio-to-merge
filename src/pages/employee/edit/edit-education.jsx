import React, { useEffect, useState } from "react";
import "../../../css/style.css";
import AddEducation from "../edit/add-in-edit/add-education";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Schema,
  SelectPicker,
} from "rsuite";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import token from "../../../token-apiurl/token";
import apiUrl from "../../../token-apiurl/apiurl";
import Swal from "sweetalert2";
import axios from "axios";

const Field = React.forwardRef((props, ref) => {
  const { name, message, label, accepter, error, ...rest } = props;
  return (
    <Form.Group
      controlId={`${name}-10`}
      ref={ref}
      className={error ? "has-error" : ""}
    >
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control
        name={name}
        accepter={accepter}
        errorMessage={error}
        {...rest}
      />
      <Form.HelpText>{message}</Form.HelpText>
    </Form.Group>
  );
});

const { NumberType } = Schema.Types;
const model = Schema.Model({
  degree: NumberType().isRequired("กรุณาเลือกวุฒิการศึกษา"),
  gpax: NumberType()
    .isRequired("กรุณากรอกเกรดเฉลี่ย")
    .pattern(/^[0-4][.][0-9][0-9]{1}$/, "กรุณากรอกเกรดเฉลี่ยการศึกษา"),
  education_name: NumberType().isRequired("กรุณาเลือกสถานศึกษา"),
  faculty: NumberType().isRequired("กรุณาเลือกคณะ"),
  major: NumberType().isRequired("กรุณาเลือกสาขา"),
});

const EditEducation = () => {
  const { id } = useParams();
  const [empPersonalEducate, setempPersonalEducate] = useState([]);
  const [checkCount, setcheckCount] = React.useState(0);

  //modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});

  const [formDegree, setFormDegree] = React.useState();
  const [formGpax, setFormGpax] = React.useState();
  const [formUniversity, setFormUniversity] = React.useState();
  const [formFaculty, setFormFaculty] = React.useState();
  const [formMajor, setFormMajor] = React.useState();
  const [formTranscript, setFormTranscript] = React.useState();

  const [editDegree, setEditDegree] = useState([]);
  const [editUniversity, setEditUniversity] = useState([]);
  const [editFaculty, setEditFaculty] = useState([]);
  const [editMajor, setEditMajor] = useState([]);
  const [editEduModal, setModalArrEduID] = useState([]);
  const [majorID, setMajorByID] = useState([]);
  const [file, setFile] = useState(null);

  const apiEdu = "https://portfolio.blackphoenix.digital/getDegree";
  const apiUniversity = "https://portfolio.blackphoenix.digital/getUniversity";
  const apiFaculty = "https://portfolio.blackphoenix.digital/getFaculty";
  const apiMajor = "https://portfolio.blackphoenix.digital/getMajor";

  //GET Employee
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiUrl, { headers })
      .then((response) => response.json())
      .then((data) => setempPersonalEducate(data));
  }, []);

  //GET Degree
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiEdu, { headers })
      .then((response) => response.json())
      .then((data) => setEditDegree(data));
  }, []);
  // console.log("edit Degree:", editDegree)

  //GET University
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiUniversity, { headers })
      .then((response) => response.json())
      .then((data) => setEditUniversity(data));
  }, []);
  // console.log("edit University:", editUniversity);

  //GET Faculty
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiFaculty, { headers })
      .then((response) => response.json())
      .then((data) => setEditFaculty(data));
  }, []);
  // console.log("edit Faculty:", editFaculty)

  //GET Major
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiMajor, { headers })
      .then((response) => response.json())
      .then((data) => setEditMajor(data));
  }, []);
  // console.log("edit Major:", editMajor)

  //กำหนดเงื่อนไขเช็ค Employee By ID (ข้อมูลทั้งหมด)
  let arrPersonal = [];
  for (let i = 0; i < empPersonalEducate.length; i++) {
    if (id == empPersonalEducate[i].employee_id) {
      // console.log(empPersonalEducate[i]);
      arrPersonal.push(empPersonalEducate[i]);
    }
  }

  //ข้อมูล Education
  let arr = [];
  for (let i = 0; i < arrPersonal.length; i++) {
    for (let j = 0; j < arrPersonal[i].eduCation.length; j++) {
      arr.push(arrPersonal[i]?.eduCation[j]);
    }
  }
  // console.log("arr Education : ", arr);

  //ข้อมูล Education By ID
  let arrEdu = [];
  for (let i = 0; i < arr.length; i++) {
    if (id == arr[i].employee_id) {
      arrEdu.push(arr[i]);
    }
  }
  // console.log("data Edu",arrEdu)

  //map ข้อมูลใน editDegree กำหนกไว้ใน edu_Degree เพื่อนำไปใช้งานใน form modal เป็น data in SelectPicker [ชุดข้อมูล degree (วุฒิการศึกษา)]
  const edu_Degree = editDegree.map((item) => ({
    label: item.degree_name,
    value: item.degree_id,
  }));

  const edu_University = editUniversity.map((item) => ({
    label: item.university_name,
    value: item.university_id,
  }));

  const edu_Faculty = editFaculty.map((item) => ({
    label: item.faculty_name,
    value: item.faculty_id,
  }));

  // close Modal
  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  //function onchange Open Modal
  let arrEduId = [];
  let arrMajorID = [];
  const educationById = async (data) => {
    setEditModalOpen(true);
    arrEduId.push(data);
    setModalArrEduID(arrEduId);

    //GET Makor by ID
    for (let i = 0; i < editMajor.length; i++) {
      if (data.faculty_id == editMajor[i].faculty_id) {
        // setMajorByID(editMajor[i]);
        arrMajorID.push(editMajor[i]); //Major name ทั้งหมด ตาม faculty
        // console.log("Major by faculty ID :", editMajor[i]);
      }
    }
    setMajorByID(arrMajorID);

    // เงื่อนไขเช็คกำหนดค่า default education  ไว้ใน usesatate หากไม่มีการ onchange ให้ส่งค่าเดิมไป
    if (checkCount == 0) {
      setFormDegree(arrEduId[0].degree_id);
      setFormGpax(arrEduId[0].gpax);
      setFormUniversity(arrEduId[0].university_id);
      setFormFaculty(arrEduId[0].faculty_id);
      setFormMajor(arrEduId[0].major_id);
      setFormTranscript(arrEduId[0].transcript);
      setFile(arrEduId[0].transcript);
    } else {
      setcheckCount(1);
    }
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  //เช็คค่าที่แสดง ใน major ที่ faculty id ตรงกัน
  const majorByfaculty = (d) => {
    // console.log("d: ", d);
    for (let i = 0; i < editMajor.length; i++) {
      if (d == editMajor[i].faculty_id) {
        arrMajorID.push(editMajor[i]); //Major name ทั้งหมด ตาม faculty
      }
    }
    setFormFaculty(d);
    setMajorByID(arrMajorID);
  };

  // console.log("Major by faculty ID :", majorID);
  const edu_Major = majorID.map((item) => ({
    label: item.major_name,
    value: item.major_id,
  }));

  //บันทึกการแก้ไขข้อมูลการศึกษา
  const submitUpdate = async () => {
    Swal.fire({
      title: `คุณต้องการแก้ไขข้อมูลการศึกษา`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit(editEduModal);
      }
    });

    const handleSubmit = async (editEduModal) => {
      console.log("id ", id);
      console.log("education_id ", editEduModal[0].education_id);
      console.log("degree_id ", formDegree);
      console.log("university_id ", formUniversity);
      console.log("faculty_id", formFaculty);
      console.log("major_id ", formMajor);
      console.log("gpax ", formGpax);
      console.log("transcript ", formTranscript);
      console.log("update_user_id ", id);

      await axios({
        method: "put",
        url: "https://portfolio.blackphoenix.digital/updateEducation",
        headers: { "Content-Type": "application/json" },
        data: {
          employee_Id: id,
          education_id: editEduModal[0].education_id,
          degree_id: formDegree,
          university_id: formUniversity,
          major_id: formMajor,
          gpax: formGpax,
          faculty_id: formFaculty,
          update_user_id: id,
        },
      })
        .then(function (response) {
          if (response.status == 200) {
            console.log(response);
          }
        })
        .catch(function (error) {
          console.log(error);
        });

      var data = new FormData();
      data.append("employee_id", id);
      data.append("education_id", editEduModal[0].education_id);
      data.append("file", file);

      console.log("employee_id", id);
      console.log("education_id", editEduModal[0].education_id);
      console.log("file", file);

      var config = {
        method: "post",
        url: "https://portfolio.blackphoenix.digital/uploadImageEdu",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire("แก้ไขข้อมูลสำเร็จ").then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire(`แก้ไขข้อมูลการศึกษา`, "ไม่สำเร็จ!").then(() => {
              window.location.reload();
            });
          }
        })
        .catch(function (error) {
          console.log(error);
          Swal.fire(`แก้ไขข้อมูลการศึกษา`, "ไม่สำเร็จ!").then(() => {
            window.location.reload();
          });
        });
    };
  };

  //delete
  const remove = (Eid) => {
    const deleteEdu = editEduModal.filter((item) => item.education_id == Eid);
    Swal.fire({
      title: `คุณต้องการลบข้อมูลการศึกษา`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit(deleteEdu);
      }
    });

    const handleSubmit = async (deleteEdu) => {
      try {
        axios({
          method: "delete",
          url: "https://portfolio.blackphoenix.digital/deleteEducation",
          headers: { "Content-Type": "application/json" },
          data: {
            employeeId: id,
            educationId: Eid,
          },
        })
          .then(function (response) {
            if (response.status == 200) {
              Swal.fire("ลบข้อมูลการศึกษา", "สำเร็จ").then(() => {
                window.location.reload();
              });
            }
          })
          .catch(function (error) {
            Swal.fire("ไม่สำเร็จ!");
            console.log(error);
          });
      } catch (error) {
        Swal.fire("ไม่สำเร็จ!");
        console.error(error.response);
      }
    };
  };

  return (
    <div>
      <AddEducation />
      <table className="table custom-header">
        <thead className="table-primary">
          <tr>
            <th scope="col" style={{ textAlign: "center" }}>
              ลำดับ
            </th>
            <th scope="col">วุฒิการศึกษา</th>
            <th scope="col">สถานศึกษา</th>
            <th scope="col">คณะ</th>
            <th scope="col">สาขา</th>
            <th scope="col">เกรดเฉลี่ย</th>
            <th scope="col">แก้ไข</th>
            <th scope="col">ลบ</th>
          </tr>
        </thead>
        {arr.map((item, indexTb) => (
          <tbody key={indexTb}>
            <tr>
              <th scope="row" style={{ textAlign: "center" }}>
                {item.education_id}
              </th>
              <td>{item.degree_name}</td>
              <td>{item.university_name}</td>
              <td>{item.faculty_name}</td>
              <td>{item.major_name}</td>
              <td>{item.gpax}</td>
              <td width={50}>
                {
                  <Button onClick={() => educationById(item)}>
                    <FaRegEdit />
                  </Button>
                }
              </td>
              <td width={50}>
                <Button onClick={() => remove(item.education_id)}>
                  <FaRegTrashAlt />
                </Button>
              </td>
            </tr>
          </tbody>
        ))}
      </table>

      <Modal open={editModalOpen} onClose={closeEditModal}>
        <Modal.Header>
          <Modal.Title>แก้ไขข้อมูลการศึกษา</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editEduModal.map((eduItem, iedu) => (
            <Form
              key={iedu}
              ref={formRef}
              onCheck={setFormError}
              defaultValue={eduItem}
              model={model}
            >
              <Row>
                <Col>
                  <Row>
                    <Col>
                      <Field
                        name="degree"
                        label="วุฒิการศึกษา :"
                        accepter={SelectPicker}
                        error={formError.degree}
                        style={{ display: "inline-block", width: 200 }}
                        data={edu_Degree}
                        defaultValue={eduItem.degree_id}
                        onChange={setFormDegree}
                      />
                    </Col>
                    <Col>
                      <Field
                        name="gpax"
                        label="เกรดเฉลี่ย :"
                        accepter={Input}
                        error={formError.gpax}
                        style={{ width: 200 }}
                        defaultValue={eduItem.gpax}
                        onChange={setFormGpax}
                      />
                    </Col>
                  </Row>

                  <Field
                    name="university"
                    label="สถานศึกษา :"
                    accepter={SelectPicker}
                    error={formError.education_name}
                    style={{ display: "inline-block", width: 410 }}
                    data={edu_University}
                    defaultValue={eduItem.university_id}
                    onChange={setFormUniversity}
                  />
                  <Row>
                    <Col>
                      <Field
                        name="faculty"
                        label="คณะ :"
                        accepter={SelectPicker}
                        error={formError.faculty}
                        style={{ display: "inline-block", width: 200 }}
                        data={edu_Faculty}
                        defaultValue={eduItem.faculty_id}
                        onChange={(v) => majorByfaculty(v)}
                      />
                    </Col>
                    <Col>
                      <Field
                        name="major"
                        label="สาขา :"
                        accepter={SelectPicker}
                        error={formError.major}
                        style={{ display: "inline-block", width: 200 }}
                        data={edu_Major}
                        defaultValue={eduItem.major_id}
                        onChange={setFormMajor}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <hr />
              <label style={{ marginBottom: 3 }}>
                หนังสือรับรองผลการศึกษา :
              </label>
              <input
                className="form-control"
                id="pic"
                type="file"
                accept=".jpg, .png"
                onChange={handleFileSelect}
              />
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

export default EditEducation;
