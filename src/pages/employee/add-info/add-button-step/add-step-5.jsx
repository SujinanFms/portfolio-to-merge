import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import {
  Modal,
  Button,
  ButtonToolbar,
  Form,
  Input,
  Message,
  toaster,
  Schema,
  Row,
  Col,
  DatePicker,
} from "rsuite";
import Swal from "sweetalert2";

const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));

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

const AddStep5 = () => {
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState();
  const handleOpen = (value) => {
    setSize(value);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const formRef = React.useRef();
  const [file, setFile] = useState(null);
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({
    course: "",
    organization: "",
    detail: "",
    // startdate: new Date(),
    // enddate: new Date(),
  });
  const [formstartdate, setFormStartdate] = React.useState({});
  const [formenddate, setFormEnddate] = React.useState({});

  //function set รูปภาพที่เลือก ไว้ใน usestate => setFile
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = () => {
    if (!formRef.current.check()) {
      toaster.push(<Message type="error">Error</Message>);
      return;
    }
    /*   toaster.push(<Message type="success">Success</Message>); */

    Swal.fire({
      title: `คุณต้องการเพิ่มข้อมูลการอบรม`,
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
      console.log("certificate_id ", "");
      console.log("certificate_name ", formValue.course);
      console.log("organization ", formValue.organization);
      console.log("certificate_detail", formValue.detail);
      console.log("start_date ", formstartdate);
      console.log("end_date ", formenddate);
      console.log("certificate_picture ", file);
      console.log("update_user_id ", id);

      var data = new FormData();
      data.append("employee_id", id);
      data.append("certificate_id", "");
      data.append("file", file);

      console.log("employee_id", id);
      console.log("certificate_id", "");
      console.log("file", file);

      const sDate = moment(formstartdate).format("YYYY-MM-DD");
      const eDate = moment(formenddate).format("YYYY-MM-DD");

      await axios({
        method: "post",
        url: "https://portfolio.blackphoenix.digital/appendCertificate",
        headers: { "Content-Type": "application/json" },
        data: {
          employee_id: id,
          certificate_id: "",
          certificate_name: formValue.course,
          organization: formValue.organization,
          certificate_detail: formValue.detail,
          start_date: sDate,
          end_date: eDate,
          certificate_picture: "",
          // update_user_id: id,
        },
      })
        .then(function (response) {
          const imgCert = response.data.certificate_id;

          var data = new FormData();
          data.append("employee_id", id);
          data.append("certificate_id", imgCert);
          data.append("file", file);

          console.log("employee_id", id);
          console.log("certificate_id", imgCert);
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
              // console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
              console.log(error);
            });

          if (response.status == 200) {
            Swal.fire(`เพิ่มข้อมูลการอบรม`, "สำเร็จ").then(() => {
              window.location.reload();
            });
            console.log(response);
          }
        })
        .catch(function (error) {
          Swal.fire(`เพิ่มข้อมูลการอบรม`, "ไม่สำเร็จ!").then(() => {
            window.location.reload();
          });
          console.log(error);
        });
    };
  };
  return (
    <>
      <ButtonToolbar>
        <Button
          className="ButtonAdd"
          appearance="primary"
          onClick={() => handleOpen("md")}
        >
          {" "}
          เพิ่มข้อมูลการอบรม
        </Button>
      </ButtonToolbar>

      <Modal size={size} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>เพิ่มข้อมูลการอบรม</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            ref={formRef}
            onChange={setFormValue}
            onCheck={setFormError}
            formValue={formValue}
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
                  label="หลักสูตร :"
                  accepter={Input}
                  error={formError.course}
                />

                <Field
                  name="organization"
                  label="สถาบันการฝึกอบรม :"
                  accepter={Input}
                  error={formError.organization}
                />
                <Row>
                  <Col>
                    <Field
                      name="startdate"
                      label="วันที่อบรม :"
                      accepter={DatePicker}
                      error={formError.startdate}
                      style={{ width: 145 }}
                      format="dd-MM-yyyy"
                      onChange={setFormStartdate}
                    />
                  </Col>
                  <Col>
                    <Field
                      name="enddate"
                      label="วันจบหลักสูตรอบรม :"
                      accepter={DatePicker}
                      error={formError.enddate}
                      style={{ width: 145 }}
                      format="dd-MM-yyyy"
                      onChange={setFormEnddate}
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Field
                  name="detail"
                  label="รายละเอียดการอบรม :"
                  accepter={Textarea}
                  error={formError.detail}
                  style={{ height: 144, width: 380 }}
                />

                <label style={{ marginBottom: 3, width: 145 }}>
                  ใบรับรองการอบรม :
                </label>
                <input
                  className="form-control"
                  id="pic"
                  type="file"
                  accept=".jpg, .png"
                  onChange={handleFileSelect}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} appearance="primary">
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

export default AddStep5;





// import React from "react";

// import {
//   Modal,
//   Button,
//   ButtonToolbar,
//   Form,
//   Input,
//   Message,
//   toaster,
//   Schema,
//   Row,
//   Col,
//   DatePicker,
//   Uploader,
// } from "rsuite";

// const Textarea = React.forwardRef((props, ref) => (
//   <Input {...props} as="textarea" ref={ref} />
// ));

// const Field = React.forwardRef((props, ref) => {
//   const { name, message, label, accepter, error, ...rest } = props;
//   return (
//     <Form.Group
//       controlId={`${name}-10`}
//       ref={ref}
//       className={error ? "has-error" : ""}
//     >
//       <Form.ControlLabel>{label} </Form.ControlLabel>
//       <Form.Control
//       type
//         name={name}
//         accepter={accepter}
//         errorMessage={error}
//         {...rest}
//       />
//       <Form.HelpText>{message}</Form.HelpText>
//     </Form.Group>
//   );
// });


// const { StringType, DateType } = Schema.Types;
// const model = Schema.Model({
//   course: StringType().isRequired("กรุณาเลือกหลักสูตร"),
//   organization: StringType().isRequired("กรุณาเลือกสถาบันการอบรม"),
//   startdate: DateType().isRequired("กรุณาเลือกวันที่เริ่มอบรม"),
//   enddate: DateType().isRequired("กรุณาเลือกวันที่สิ้นสุดการอบรม"),
// });

// const AddStep5 = () => {
//     const [open, setOpen] = React.useState(false);
//     const [size, setSize] = React.useState();
//     const handleOpen = value => {
//       setSize(value);
//       setOpen(true);
//     };
//     const handleClose = () => setOpen(false);


//   const formRef = React.useRef();
//   const [formError, setFormError] = React.useState({});
//   const [formValue, setFormValue] = React.useState({
//     course: "",
//     organization: "",
//     // startdate: new Date(),
//     // enddate: new Date(),
//   });

//   const handleSubmit = () => {
//     if (!formRef.current.check()) {
//       toaster.push(<Message type="error">Error</Message>);
//       return;
//     }
//     toaster.push(<Message type="success">Success</Message>);
//   };
//   return (
//     <>
//       <ButtonToolbar>
//         <Button className="ButtonAdd" appearance="primary" onClick={() => handleOpen('md')}> Add</Button>
//       </ButtonToolbar>

//       <Modal size={size} open={open} onClose={handleClose}>
//         <Modal.Header>
//           <Modal.Title>Certification</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form
//             ref={formRef}
//             onChange={setFormValue}
//             onCheck={setFormError}
//             formValue={formValue}
//             model={model}
//             style={{ display: "flex",
//             alignItems: "center",
//             justifyContent: "center"}}
//           >
//             <Row>
//               <Col>
//                 <Field
//                   name="course"
//                   label="Course:"
//                   accepter={Input}
//                   error={formError.course}
                 
//                 />

//                 <Field
//                   name="organization"
//                   label="Organization:"
//                   accepter={Input}
//                   error={formError.organization}
                  
//                 />
//                 <Row>
//                   <Col>
//                     <Field
//                       name="startdate"
//                       label="Start date:"
//                       accepter={DatePicker}
//                       error={formError.startdate}
//                       style={{ width: 145 }}
                      
//                       format="dd-MM-yyyy"
//                     />
//                   </Col>
//                   <Col>
//                     <Field
//                       name="enddate"
//                       label="End date:"
//                       accepter={DatePicker}
//                       error={formError.enddate}
//                       style={{ width: 145 }}
//                       format="dd-MM-yyyy"
//                     />
//                   </Col>
//                 </Row>
//               </Col>
//               <Col>
//                 <Field
//                   name="detail"
//                   label="Detail:"
//                   accepter={Textarea}
//                   error={formError.detail}
//                 />

//                 <Field
//                   name="certificate"
//                   label="Certificate Image:"
//                   accepter={Uploader}
//                   error={formError.certificate}
//                   style={{ width: 300 }}
//                   listType="picture-text"
//                   action="//jsonplaceholder.typicode.com/posts/"
//                 />
//               </Col>
//             </Row>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button onClick={handleSubmit} appearance="primary">
//             Ok
//           </Button>
//           <Button onClick={handleClose} appearance="subtle">
//             Cancel
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default AddStep5;
