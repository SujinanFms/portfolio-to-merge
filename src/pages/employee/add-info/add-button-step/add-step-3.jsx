import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  ButtonToolbar,
  Form,
  SelectPicker,
  Message,
  toaster,
  Schema,
  RadioGroup,
  Radio,
  Row,
  Col,
  Stack,
  Divider,
} from "rsuite";
import token from "../../../../token-apiurl/token";
import apiurl from "../../../../token-apiurl/apiurl";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const apiLanguage = "https://portfolio.blackphoenix.digital/getLanguage";

const Field = React.forwardRef((props, ref) => {
  const { name, message, label, accepter, error, ...rest } = props;
  return (
    <Form.Group controlId={""} ref={ref} className={error ? "has-error" : ""}>
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

const Radios = React.forwardRef((props, ref) => {
  const { name, message, label, accepter, error, ...rest } = props;
  return (
    <Form.Group controlId={``} ref={ref} className={error ? "has-error" : ""}>
      <Stack divider={<Divider vertical />}>
        <Form.ControlLabel>{label} </Form.ControlLabel>

        <Form.Control
          name={name}
          accepter={accepter}
          errorMessage={error}
          {...rest}
        />
      </Stack>

      <Form.HelpText>{message}</Form.HelpText>
    </Form.Group>
  );
});

const { NumberType } = Schema.Types;
const model = Schema.Model({
  language: NumberType().isRequired("กรุณาเลือกทักษะภาษา"),
  listening: NumberType().isRequired("กรุณาเลือกระดับการฟัง"),
  reading: NumberType().isRequired("กรุณาเลือกระดับการอ่าน"),
  writing: NumberType().isRequired("กรุณาเลือกระดับการเขียน"),
  speaking: NumberType().isRequired("กรุณาเลือกระดับการพูด"),
});

const AddStep3 = ({handleChildForm}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { id } = useParams();
  const [empPersonalSkillLanguage, setempPersonalSkillLanguage] = useState([]);
  const [editLanguage, setEditLanguage] = useState([]);
  const [count, setCount] = useState(0);
  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({
    language: "",
    listening: "",
    reading: "",
    writing: "",
    speaking: "",
  });

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiurl, { headers })
      .then((response) => response.json())
      .then((data) => setempPersonalSkillLanguage(data));
  }, []);

  let arrPersonal = [];
  for (let i = 0; i < empPersonalSkillLanguage.length; i++) {
    if (id == empPersonalSkillLanguage[i].employee_id) {
      // console.log(empPersonalSkillLanguage[i]);
      arrPersonal.push(empPersonalSkillLanguage[i]);
    }
  }

  let arr = [];
  for (let i = 0; i < arrPersonal.length; i++) {
    for (let j = 0; j < arrPersonal[i].languageSkill.length; j++) {
      arr.push(arrPersonal[i]?.languageSkill[j].language_id);
    }
  }
  // console.log("arr languageSkill : ", arr);

  //GET Language
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiLanguage, { headers })
      .then((response) => response.json())
      .then((data) => setEditLanguage(data));
  }, []);
  //  console.log("edit Language:", editLanguage)

  let language = [];
  language = editLanguage.filter((e) => {
    let res = true;
    // console.log("e : ", e);
    for (var i of arr) {
      res = res && i != e.language_id;
      // console.log(arr)
      // console.log("i: ",i)
      // console.log("res: ",res)
    }
    return res;
  });
  // console.log(language)

  const Langguagedata = language.map((item) => ({
    label: item.language_name,
    value: item.language_id,
  }));

  const handleChildtoParent =  () => { 
    if (!formRef.current.check()) {
      toaster.push(<Message type="error">Error</Message>);
      return;
    }

    // console.log("employee_Id:", id);
    console.log("language_id:", formValue.language);
    console.log("listening_rate:", formValue.listening);
    console.log("reading_rate:", formValue.reading);
    console.log("speaking_rate:", formValue.speaking);
    console.log("writing_rate:", formValue.writing);
    // console.log("update_user_id:", id);

    handleChildForm({...formValue });
    toaster.push(<Message type="success">Success</Message>);
    handleClose();
    formValue = ""
    // formValue.language = "",
    // formValue.listening = "",
    // formValue.reading = "",
    // formValue.speaking = "",
    // formValue.writing = ""
  
  }
    /*  await axios({
      method: "post",
      url: "https://portfolio.blackphoenix.digital/addLanguage_skill",
      headers: { "Content-Type": "application/json" },
      data: {
        employee_Id: id,
        language_id: formValue.language,
        listening_rate: formValue.listening,
        reading_rate: formValue.reading,
        speaking_rate: formValue.speaking,
        writing_rate: formValue.writing,
        update_user_id: id
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
      }); */
    
 

  return (
    <>
      <ButtonToolbar>
        <Button className="ButtonAdd" appearance="primary" onClick={handleOpen}>
          {" "}
          เพิ่มภาษา
        </Button>
      </ButtonToolbar>

      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          {/* <Modal.Title>Language Skills</Modal.Title> */}
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
                <Field
                  name="language"
                  label="ทักษะทางภาษา:"
                  accepter={SelectPicker}
                  error={formError.language}
                  style={{ display: "inline-block", width: 300 }}
                  data={Langguagedata}
                />
                <hr />

                <Radios
                  inline
                  name="listening"
                  dir="rtl"
                  // onChange={setListening}
                  label="&nbsp;ระดับการฟัง&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                  accepter={RadioGroup}
                >
                  <Radio value={4}>ดีมาก</Radio>&emsp;
                  <Radio value={3}>ดี</Radio>&emsp;
                  <Radio value={2}>พอใช้</Radio>&emsp;
                  <Radio value={1}>พื้นฐาน</Radio>&emsp;
                </Radios>

                <Radios
                  inline
                  name="speaking"
                  dir="rtl"
                  // onChange={setSpeaking}
                  label="&nbsp;ระดับการพูด&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                  accepter={RadioGroup}
                >
                  <Radio value={4}>ดีมาก</Radio>&emsp;
                  <Radio value={3}>ดี</Radio>&emsp;
                  <Radio value={2}>พอใช้</Radio>&emsp;
                  <Radio value={1}>พื้นฐาน</Radio>&emsp;
                </Radios>

                <Radios
                  inline
                  name="reading"
                  dir="rtl"
                  // onChange={setReading}
                  label="&nbsp;ระดับการอ่าน&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                  accepter={RadioGroup}
                >
                  <Radio value={4}>ดีมาก</Radio>&emsp;
                  <Radio value={3}>ดี</Radio>&emsp;
                  <Radio value={2}>พอใช้</Radio>&emsp;
                  <Radio value={1}>พื้นฐาน</Radio>&emsp;
                </Radios>

                <Radios
                  inline
                  name="writing"
                  dir="rtl"
                  // onChange={setWriting}
                  label="&nbsp;ระดับการเขียน&nbsp;&nbsp;&nbsp;&nbsp;"
                  accepter={RadioGroup}
                >
                  <Radio value={4}>ดีมาก</Radio>&emsp;
                  <Radio value={3}>ดี</Radio>&emsp;
                  <Radio value={2}>พอใช้</Radio>&emsp;
                  <Radio value={1}>พื้นฐาน</Radio>&emsp;
                </Radios>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleChildtoParent} appearance="primary">
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

export default AddStep3;

// import React, { useEffect, useState } from "react";

// import {
//   Modal,
//   Button,
//   ButtonToolbar,
//   Form,
//   SelectPicker,
//   Message,
//   toaster,
//   Schema,
//   RadioGroup,
//   Radio,
//   Row,
//   Col,
//   Stack,
//   Divider,
// } from "rsuite";
// import token from "../../../../token-apiurl/token";

// const apiLanguage = "https://portfolio.blackphoenix.digital/getLanguage";

// /* const data = ["ไทย", "อังกฤษ", "จีน"].map((item) => ({
//   label: item,
//   value: item,
// })); */

// const Field = React.forwardRef((props, ref) => {
//   const { name, message, label, accepter, error, ...rest } = props;
//   return (
//     <Form.Group
//       controlId={''}
//       ref={ref}
//       className={error ? "has-error" : ""}
//     >
//       <Form.ControlLabel>{label} </Form.ControlLabel>
//       <Form.Control
//         name={name}
//         accepter={accepter}
//         errorMessage={error}
//         {...rest}
//       />
//       <Form.HelpText>{message}</Form.HelpText>
//     </Form.Group>
//   );
// });

// const Radios = React.forwardRef((props, ref) => {
//   const { name, message, label, accepter, error, ...rest } = props;
//   return (
//     <Form.Group
//       controlId={``}
//       ref={ref}
//       className={error ? "has-error" : ""}
//     >
//       <Stack divider={<Divider vertical />}>
//         <Form.ControlLabel>{label} </Form.ControlLabel>

//         <Form.Control
//           name={name}
//           accepter={accepter}
//           errorMessage={error}
//           {...rest}
//         />
//       </Stack>

//       <Form.HelpText>{message}</Form.HelpText>
//     </Form.Group>
//   );
// });

// const { StringType, NumberType } = Schema.Types;
// const model = Schema.Model({
//   language: NumberType().isRequired("กรุณาเลือกทักษะภาษา"),
//   listening: StringType().isRequired("กรุณาเลือกระดับการฟัง"),
//   reading: StringType().isRequired("กรุณาเลือกระดับการอ่าน"),
//   writing: StringType().isRequired("กรุณาเลือกระดับการเขียน"),
//   speaking: StringType().isRequired("กรุณาเลือกระดับการพูด"),
// });

// const AddStep3 = () => {
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const [editLanguage, setEditLanguage] = useState([]);
//   const formRef = React.useRef();
//   const [formError, setFormError] = React.useState({});
//   const [formValue, setFormValue] = React.useState({
//     language: "",
//     listening: "",
//     reading: "",
//     writing: "",
//     speaking: "",
//   });

//    //GET Language
//    useEffect(() => {
//     const headers = { Authorization: `Bearer ${token}` };
//     fetch(apiLanguage, { headers })
//       .then((response) => response.json())
//       .then((data) => setEditLanguage(data));
//   }, []);
//   //  console.log("edit Language:", editLanguage)

//   const data = editLanguage.map((item) => ({
//     label: item.language_name,
//     value: item.language_id,
//   }));

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
//         <Button className="ButtonAdd" appearance="primary" onClick={handleOpen}>
//           {" "}
//           Add
//         </Button>
//       </ButtonToolbar>

//       <Modal open={open} onClose={handleClose}>
//         <Modal.Header>
//           <Modal.Title>Language Skills</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form
//             ref={formRef}
//             onChange={setFormValue}
//             onCheck={setFormError}
//             formValue={formValue}
//             model={model}
//           >
//             <Row>
//               <Col>
//                 <Field
//                   name="language"
//                   label="Language:"
//                   accepter={SelectPicker}
//                   error={formError.language}
//                   style={{ display: "inline-block", width: 300 }}
//                   data={data}
//                 />

//                 <Radios
//                   name="listening"
//                   label="Listening:"
//                   accepter={RadioGroup}
//                   error={formError.listening}
//                   inline
//                 >
//                   <Radio value={"Very Good"}>Very Good</Radio>
//                   <Radio value={"Good"}>Good</Radio>
//                   <Radio value={"Fair"}>Fair</Radio>
//                   <Radio value={"Poor"}> Poor </Radio>
//                 </Radios>

//                 <Radios
//                   name="speaking"
//                   label="Speaking:"
//                   accepter={RadioGroup}
//                   error={formError.speaking}
//                   inline
//                 >
//                   <Radio value={"Very Good"}>Very Good</Radio>
//                   <Radio value={"Good"}>Good</Radio>
//                   <Radio value={"Fair"}>Fair</Radio>
//                   <Radio value={"Poor"}> Poor </Radio>
//                 </Radios>

//                 <Radios
//                   name="reading"
//                   label="Reading:"
//                   accepter={RadioGroup}
//                   error={formError.reading}
//                   inline
//                 >
//                   <Radio value={"Very Good"}>Very Good</Radio>
//                   <Radio value={"Good"}>Good</Radio>
//                   <Radio value={"Fair"}>Fair</Radio>
//                   <Radio value={"Poor"}> Poor </Radio>
//                 </Radios>

//                 <Radios
//                   name="writing"
//                   label="Writing:"
//                   accepter={RadioGroup}
//                   error={formError.writing}
//                   inline
//                 >
//                   <Radio value={"Very Good"}>Very Good</Radio>
//                   <Radio value={"Good"}>Good</Radio>
//                   <Radio value={"Fair"}>Fair</Radio>
//                   <Radio value={"Poor"}> Poor </Radio>
//                 </Radios>
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

// export default AddStep3;
