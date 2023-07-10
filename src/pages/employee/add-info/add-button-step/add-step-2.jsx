/* import React, { useEffect, useState } from "react";
import token from "../../../../token-apiurl/token";
import {
  Modal,
  Button,
  ButtonToolbar,
  Form,
  SelectPicker,
  Message,
  toaster,
  Schema,
  Input,
  Row,
  Col,
  Uploader,
} from "rsuite";

const apiEdu = "https://portfolio.blackphoenix.digital/getDegree";
const apiUniversity = "https://portfolio.blackphoenix.digital/getUniversity";
const apiFaculty = "https://portfolio.blackphoenix.digital/getFaculty";
const apiMajor = "https://portfolio.blackphoenix.digital/getMajor";


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

const AddStep2 = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [editDegree, setEditDegree] = useState([]);
  const [editUniversity, setEditUniversity] = useState([]);
  const [editFaculty, setEditFaculty] = useState([]);
  const [editMajor, setEditMajor] = useState([]);

  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({
    degree: "",
    gpax: "",
    education_name: "",
    faculty: "",
    major: "",
  });

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
  // console.log("edit University:", editUniversity)

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

  const edu_Degree = editDegree.map((item) => ({
    label: item.degree_name,
    value: item.degree_id,
  }));

  const edu_University = editUniversity.map((item) => ({ 
    label: item.university_name, value: item.university_id 
  }));

  const edu_Faculty = editFaculty.map(
    (item) => ({ label: item.faculty_name, value: item.faculty_id })
  );
  
  const edu_Major = editMajor.map((item) => ({
    label: item.major_name,
    value: item.major_id,
  }));

  const handleSubmit = () => {
    if (!formRef.current.check()) {
      toaster.push(<Message type="error">Error</Message>);
      return;
    }
    toaster.push(<Message type="success">Success</Message>);
  };

  return (
    <>
      <ButtonToolbar>
        <Button className="ButtonAdd" appearance="primary" onClick={handleOpen}>
          {" "}
          Add
        </Button>
      </ButtonToolbar>

      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>การศึกษา</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            ref={formRef}
            onChange={setFormValue}
            onCheck={setFormError}
            formValue={formValue}
            model={model}
          >
            <Row>
              <Col>
                <Row>
                  <Col>
                    <Field
                      name="degree"
                      label="วุฒิการศึกษา:"
                      accepter={SelectPicker}
                      error={formError.degree}
                      style={{ display: "inline-block", width: 200 }}
                      data={edu_Degree}
                    />
                  </Col>
                  <Col>
                    <Field
                      name="gpax"
                      label="GPAX:"
                      accepter={Input}
                      error={formError.gpax}
                      style={{ width: 200 }}
                    />
                  </Col>
                </Row>

                <Field
                  name="education_name"
                  label="School/University:"
                  accepter={SelectPicker}
                  error={formError.education_name}
                  style={{ display: "inline-block", width: 200 }}
                  data={edu_University}
                />
                <Row>
                  <Col>
                    <Field
                      name="faculty"
                      label="Faculty:"
                      accepter={SelectPicker}
                      error={formError.faculty}
                      style={{ display: "inline-block", width: 200 }}
                      data={edu_Faculty}
                    />
                  </Col>
                  <Col>
                    <Field
                      name="major"
                      label="Major:"
                      accepter={SelectPicker}
                      error={formError.major}
                      style={{ display: "inline-block", width: 200 }}
                      data={edu_Major}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr />
            <Uploader
              listType="picture-text"
              action="//jsonplaceholder.typicode.com/posts/"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>

          <Button onClick={handleSubmit} appearance="primary">
            Ok
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddStep2;
 */

import React, { useEffect, useState } from "react";
import token from "../../../../token-apiurl/token";
import {
  Modal,
  Button,
  ButtonToolbar,
  Form,
  SelectPicker,
  Schema,
  Input,
  Row,
  Col,
  toaster,
  Message,
} from "rsuite";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import apiurl from "../../../../token-apiurl/apiurl";
import axios from "axios";

const apiEdu = "https://portfolio.blackphoenix.digital/getDegree";
const apiUniversity = "https://portfolio.blackphoenix.digital/getUniversity";
const apiFaculty = "https://portfolio.blackphoenix.digital/getFaculty";
const apiMajor = "https://portfolio.blackphoenix.digital/getMajor";

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
  university: NumberType().isRequired("กรุณาเลือกสถานศึกษา"),
  faculty: NumberType().isRequired("กรุณาเลือกคณะ"),
  major: NumberType().isRequired("กรุณาเลือกสาขา"),
});

const AddStep2 = () => {
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [editDegree, setEditDegree] = useState([]);
  const [editUniversity, setEditUniversity] = useState([]);
  const [editFaculty, setEditFaculty] = useState([]);
  const [editMajor, setEditMajor] = useState([]);

  const [majorID, setMajorByID] = useState([]);
  const [file, setFile] = useState(null);
  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({
    degree: "",
    gpax: "",
    university: "",
    faculty: "",
    major: "",
  });
  // const [eduId, setEduID] = React.useState();

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
  // console.log("edit University:", editUniversity)

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

  //ชุดข้อมูลวุฒิการศึกษา
  const edu_Degree = editDegree.map((item) => ({
    label: item.degree_name,
    value: item.degree_id,
  }));

  //ชุดข้อมูลมหาวิทยาลัย
  const edu_University = editUniversity.map((item) => ({
    label: item.university_name,
    value: item.university_id,
  }));

  //ชุดข้อมูลคณะ
  const edu_Faculty = editFaculty.map((item) => ({
    label: item.faculty_name,
    value: item.faculty_id,
  }));

  //เช็คค่าที่แสดง ใน major ที่ faculty id ตรงกัน
  let arrMajorID = [];
  const majorByfaculty = (data) => {
    // console.log("d: ", d);
    for (let i = 0; i < editMajor.length; i++) {
      if (data == editMajor[i].faculty_id) {
        arrMajorID.push(editMajor[i]); //Major name ทั้งหมด ตาม faculty
      }
    }
    setMajorByID(arrMajorID);
  };

  //ชุดข้อมูลสาขาวิชา by คณะ
  const edu_Major = majorID.map((item) => ({
    label: item.major_name,
    value: item.major_id,
  }));

  //function set รูปภาพที่เลือก ไว้ใน usestate => setFile
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  //function การบันทึกข้อมูล
  const submitUpdate = () => {
    if (!formRef.current.check()) {
      toaster.push(<Message type="error">Error</Message>);
      return;
    }

    Swal.fire({
      title: `คุณต้องการเพิ่มข้อมูลการศึกษา`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit(formValue);
      }
    });

    const handleSubmit = async (formValue) => {
      // console.log("formValue ", formValue);
      console.log("id ", id);
      console.log("degree_id ", formValue.degree);
      console.log("university_id ", formValue.university);
      console.log("faculty_id", formValue.faculty);
      console.log("major_id ", formValue.major);
      console.log("gpax ", formValue.gpax);
      console.log("update_user_id ", id);

      var data = new FormData();
          data.append("employee_id", id);
          data.append("education_id", "" );
          data.append("file", file);

          console.log("employee_id", id);
          console.log("education_id", "");
          console.log("file", file);

     /*  await axios({
        method: "post",
        url: "https://portfolio.blackphoenix.digital/appendEducation",
        headers: { "Content-Type": "application/json" },
        data: {
          employee_Id: id,
          degree_id: formValue.degree,
          university_id: formValue.university,
          faculty_id: formValue.faculty,
          major_id: formValue.major,
          gpax: formValue.gpax,
          // transcript: file,
        },
      })
        .then(function (response) {
          console.log(response.data.education_id);
          // let resData =[];
          //   resData.push(response.data.education_id)
          const eduId = response.data.education_id;
          console.log(eduId);

          var data = new FormData();
          data.append("employee_id", id);
          data.append("education_id", eduId);
          data.append("file", file);

          console.log("employee_id", id);
          console.log("education_id", eduId);
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
              console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
              console.log(error);
            });

          if (response.status == 200) {
            Swal.fire(`เพิ่มข้อมูลการศึกษา`, "สำเร็จ").then(() => {
              window.location.reload();
            });
          }
        })
        .catch(function (error) {
          Swal.fire(`เพิ่มข้อมูลการศึกษา`, "ไม่สำเร็จ!").then(() => {
            window.location.reload();
          });
          console.log(error);
        }); */
    };
  };

  return (
    <>
      <ButtonToolbar>
        <Button className="ButtonAdd" appearance="primary" onClick={handleOpen}>
          {" "}
          เพิ่มข้อมูลการศึกษา
        </Button>
      </ButtonToolbar>

      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>การศึกษา</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            ref={formRef}
            onChange={setFormValue}
            onCheck={setFormError}
            formValue={formValue}
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
                    />
                  </Col>
                  <Col>
                    <Field
                      name="gpax"
                      label="เกรดเฉลี่ย :"
                      accepter={Input}
                      error={formError.gpax}
                      style={{ width: 200 }}
                    />
                  </Col>
                </Row>

                <Field
                  name="university"
                  label="สถานศึกษา :"
                  accepter={SelectPicker}
                  error={formError.education_name}
                  style={{ display: "inline-block", width: 200 }}
                  data={edu_University}
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
              className="form-control 1"
              id="pic"
              type="file"
              accept=".jpg, .png"
              onChange={handleFileSelect}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={submitUpdate} appearance="primary">
            ยืนยัน
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddStep2;
