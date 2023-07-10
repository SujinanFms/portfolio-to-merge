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
  Row,
  Col,
  Stack,
  TagPicker,
  Tag,
} from "rsuite";
import token from "../../../../token-apiurl/token";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import apiurl from "../../../../token-apiurl/apiurl";

const apiCategory = "https://portfolio.blackphoenix.digital/getCategory";
const apiFramework = "https://portfolio.blackphoenix.digital/getFramework";

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
  skill: NumberType().isRequired("กรุณาเลือกทักษะ"),
});

const AddStep4 = ({ handleChildForm }) => {
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [empPersonalSkillCom, setempPersonalSkillCom] = useState([]);
  const [editCategory, setEditCategory] = useState([]);
  const [editFramework, setEditFramework] = useState([]);
  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [frameworkValue, setFrameworkValue] = useState([]);
  const [formValue, setFormValue] = React.useState({
    skill: ""
  });

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiurl, { headers })
      .then((response) => response.json())
      .then((data) => setempPersonalSkillCom(data));
  }, []);

  //GET Category
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiCategory, { headers })
      .then((response) => response.json())
      .then((data) => setEditCategory(data));
  }, []);
  // console.log("edit Category:", editCategory);

  //GET Framework
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiFramework, { headers })
      .then((response) => response.json())
      .then((data) => setEditFramework(data));
  }, []);

  // console.log("edit Framework:", editFramework);

  //Employee by ID
  let arrPersonal = [];
  for (let i = 0; i < empPersonalSkillCom.length; i++) {
    if (id == empPersonalSkillCom[i].employee_id) {
      // console.log(empPersonalSkillCom[i]);
      arrPersonal.push(empPersonalSkillCom[i]);
    }
  }

  //data Technical skill รายบุคคล (Technical skill by ID)
  let arr = [];
  for (let i = 0; i < arrPersonal.length; i++) {
    for (let j = 0; j < arrPersonal[i].technicalSkill.length; j++) {
      // console.log(arr);
      arr.push(arrPersonal[i]?.technicalSkill[j].category_id);
    }
  }
  // console.log('editCategory : ',editCategory);

  let category = [];
  category = editCategory.filter((e) => {
    let res = true;
    // console.log('e : ',e)
    for (var i of arr) {
      res = res && i != e.category_id;
      // console.log(arr)
      // console.log("i: ",i)
      // console.log("res: ",res)
    }
    return res;
  });

  // console.log(category)

  const data = category.map((item) => ({
    label: item.category_name,
    value: item.category_id,
  }));

  // console.log("Category ID : ",formValue.skill)
  // console.log("formValue: ",editFramework)

  //GET Framework by ID
  let arrFrameWorkID = [];
  for (let i = 0; i < editFramework.length; i++) {
    if (formValue.skill == editFramework[i].category_id) {
      arrFrameWorkID.push(editFramework[i]); //framework name ทั้งหมด ตาม category
    }
  }
  //  console.log("data Framework by ID :", arrFrameWorkID);

  //ชุดข้อมูลทักษะที่แสดงใน TagPicker ตาม category
  const fData = arrFrameWorkID.map((item) => ({
    label: item.framework_name,
    value: item.framework_id,
  }));
  // console.log("id ที่เลือก: ",frameworkValue)

  const handleChildtoParent = () => {
    if (!formRef.current.check()) {
      toaster.push(<Message type="error">Error</Message>);
      return;
    }
    handleChildForm({ formValue, frameworkValue });
    toaster.push(<Message type="success">Success</Message>);
    handleClose();
    formValue.skill = "";
  };

  // const handleSubmit = async () => {
  //   /* if (!formRef.current.check()) {
  //     toaster.push(<Message type="error">Error</Message>);
  //     return;
  //   }
  //   toaster.push(<Message type="success">Success</Message>); */

  //   for (let i = 0; i < frameworkValue.length; i++) {
  //     // console.log("value : ", frameworkValue[i]);
  //     for (let j = 0; j < arrFrameWorkID.length; j++) {
  //       // console.log("itemFramework : ", arrFrameWorkID[j]);
  //       if (frameworkValue[i] == arrFrameWorkID[j].framework_id) {
  //         // console.log("ค่าที่ตรงกัน : ", arrFrameWorkID[j]);
  //         // console.log("\n");
  //         // console.log("employee_Id: ",id);
  //         // console.log("category_id: ",arrFrameWorkID[j].category_id);
  //         // console.log("framework_id: ", arrFrameWorkID[j].framework_id);
  //         // console.log("\n");

  //         await axios({
  //           method: "post",
  //           url: "https://portfolio.blackphoenix.digital/appendTechSkills",
  //           headers: { "Content-Type": "application/json" },
  //           data: {
  //             employee_Id: id,
  //             category_id: arrFrameWorkID[j].category_id,
  //             framework_id: arrFrameWorkID[j].framework_id,
  //           },
  //         })
  //           .then(function (response) {
  //             console.log(response);
  //             if (response.status == 200) {
  //               Swal.fire("เพิ่มทักษะ!", "สำเร็จ").then(() => {
  //                 window.location.reload();
  //               });
  //             }
  //           })
  //           .catch(function (error) {
  //             Swal.fire("เพิ่มทักษะ!", "ไม่สำเร็จ").then(() => {
  //               window.location.reload();
  //             });
  //             console.log(error);
  //           });
  //       }
  //     }
  //   }
  // };

  return (
    <>
      <ButtonToolbar>
        <Button className="ButtonAdd" appearance="primary" onClick={handleOpen}>
          เพิ่มกลุ่มทักษะ
        </Button>
      </ButtonToolbar>

      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>ทักษะทางคอมพิวเตอร์</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            ref={formRef}
            onChange={setFormValue}
            onCheck={setFormError}
            formValue={formValue}
            model={model}
          >
            <hr />

            <Stack spacing={8}>
              <Tag size="md">กลุ่มทักษะ:</Tag>
              <br />
              <Field
                name="skill"
                // label={<Tag size="md">กลุ่มทักษะ:</Tag>}
                accepter={SelectPicker}
                error={formError.skill}
                style={{ display: "inline-block", width: 300 }}
                data={data}
              />
            </Stack>

            <Stack spacing={18}>
              <Tag size="md">ทักษะ:</Tag>
              <br />
              <TagPicker
                name="framework"
                data={fData}
                value={frameworkValue}
                block
                // style={{ width: 400 }}
                style={{ display: "inline-block", width: 300 }}
                onChange={(newValue) => setFrameworkValue(newValue)}
              />
            </Stack>
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

export default AddStep4;

// import React, { useEffect, useState } from "react";
// import {
//   Modal,
//   Button,
//   ButtonToolbar,
//   Form,
//   SelectPicker,
//   Schema,
//   Row,
//   Col,
//   Stack,
//   TagPicker,
//   Tag,
// } from "rsuite";
// import token from "../../../../token-apiurl/token";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import Swal from "sweetalert2";

// const apiCategory = "https://portfolio.blackphoenix.digital/getCategory";
// const apiFramework = "https://portfolio.blackphoenix.digital/getFramework";

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
//         name={name}
//         accepter={accepter}
//         errorMessage={error}
//         {...rest}
//       />
//       <Form.HelpText>{message}</Form.HelpText>
//     </Form.Group>
//   );
// });

// const { ArrayType, NumberType } = Schema.Types;
// const model = Schema.Model({
//   skill: NumberType().isRequired("กรุณาเลือกทักษะ"),
//   // framework: ArrayType().minLength(1, 'อย่างน้อย 1 ทักษะ').isRequired("กรุณาเลือกชุดคำสั่ง/เครื่องมือ"),
// });

// const AddStep4 = () => {
//   const { id } = useParams();
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const [editCategory, setEditCategory] = useState([]);
//   const [editFramework, setEditFramework] = useState([]);
//   const formRef = React.useRef();
//   const [formError, setFormError] = React.useState({});
//   const [formValue, setFormValue] = React.useState({
//     skill: "",
//   });
//   const [frameworkValue, setFrameworkValue] = useState([]);
//   const [count, setCount] = useState(0);

//   //GET Category
//   useEffect(() => {
//     const headers = { Authorization: `Bearer ${token}` };
//     fetch(apiCategory, { headers })
//       .then((response) => response.json())
//       .then((data) => setEditCategory(data));
//   }, []);
//   // console.log("edit Category:", editCategory);

//   //GET Framework
//   useEffect(() => {
//     const headers = { Authorization: `Bearer ${token}` };
//     fetch(apiFramework, { headers })
//       .then((response) => response.json())
//       .then((data) => setEditFramework(data));
//   }, []);

//   // console.log("edit Framework:", editFramework);

//   const data = editCategory.map((item) => ({
//     label: item.category_name,
//     value: item.category_id,
//   }));

//   // console.log("Category ID : ",formValue.skill)
//   // console.log("formValue: ",editFramework)

//   //GET Framework by ID
//   let arrFrameWorkID = [];
//   for (let i = 0; i < editFramework.length; i++) {
//     if (formValue.skill == editFramework[i].category_id) {
//       arrFrameWorkID.push(editFramework[i]); //framework name ทั้งหมด ตาม category
//     }
//   }
//   //  console.log("data Framework by ID :", arrFrameWorkID);

//   //ชุดข้อมูลทักษะที่แสดงใน TagPicker ตาม category
//   const fData = arrFrameWorkID.map((item) => ({
//     label: item.framework_name,
//     value: item.framework_id,
//   }));
//   // console.log("id ที่เลือก: ",frameworkValue)

//   const handleSubmit = () => {
//     /* if (!formRef.current.check()) {
//       toaster.push(<Message type="error">Error</Message>);
//       return;
//     }
//     toaster.push(<Message type="success">Success</Message>); */

//     for (let i = 0; i < arrFrameWorkID.length; i++) {
//       // console.log("arrFrameWorkID ทั้งหมด ", arrFrameWorkID[i]);
//       // console.log("Framework Value[i]  id: ",frameworkValue)

//       // console.log('skill[i]',skill[i])
//       if (arrFrameWorkID[i].framework_id == frameworkValue[i]) {
//         // console.log("itemFramework ", arrFrameWorkID[i]);

//         try {
//           axios({
//             method: "post",
//             url: "https://portfolio.blackphoenix.digital/appendTechSkills",
//             headers: { "Content-Type": "application/json" },
//             data: {
//               employee_Id: id,
//               category_id: arrFrameWorkID[i].category_id,
//               framework_id: arrFrameWorkID[i].framework_id,
//             },
//           })
//             .then(function (response) {
//               console.log(response);
//               if (response.status == 200) {
//                 Swal.fire("เพิ่มทักษะ!", "สำเร็จ");
//                 const countTimer = setInterval(() => {
//                   setCount((prevCount) => prevCount + 1);
//                   // ทุก 1000 milliseconds
//                 }, 1500);
//                 window.location.reload(true);
//               }
//             })
//             .catch(function (error) {
//               console.log(error);
//             });
//         } catch (error) {
//           // Swal.fire("เพิ่มทักษะ ไม่สำเร็จ!");
//         }
//       }
//     }
//   };

//   return (
//     <>
//       <ButtonToolbar>
//         <Button className="ButtonAdd" appearance="primary" onClick={handleOpen}>
//           เพิ่มกลุ่มทักษะ
//         </Button>
//       </ButtonToolbar>

//       <Modal open={open} onClose={handleClose}>
//         <Modal.Header>
//           <Modal.Title>Technical Skills</Modal.Title>
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
//                   name="skill"
//                   label={<Tag size="md">กลุ่มทักษะ:</Tag>}
//                   accepter={SelectPicker}
//                   error={formError.skill}
//                   style={{ display: "inline-block", width: 300 }}
//                   data={data}
//                 />

//                 <Stack spacing={6}>
//                   <Tag size="md">ทักษะ:</Tag>
//                   <TagPicker
//                     name="framework"
//                     data={fData}
//                     value={frameworkValue}
//                     block
//                     // style={{ width: 400 }}
//                     style={{ display: "inline-block", width: 300 }}
//                     onChange={(newValue) => setFrameworkValue(newValue)}
//                   />
//                 </Stack>
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

// export default AddStep4;
