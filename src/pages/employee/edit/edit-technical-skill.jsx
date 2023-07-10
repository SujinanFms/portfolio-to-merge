import React, { useEffect, useRef, useState } from "react";
import "../../../css/style.css";
import token from "../../../token-apiurl/token";
import apiUrl from "../../../token-apiurl/apiurl";
import { useParams } from "react-router-dom";
import AddTechnical from "./add-in-edit/add-technical";
import { Modal, Button, Tag, TagPicker, Stack, Form } from "rsuite";
import axios from "axios";
import Swal from "sweetalert2";

const EditTechnical = () => {
  const { id } = useParams();
  const [empPersonalSkillCom, setempPersonalSkillCom] = useState([]);

  const [editCategory, setEditCategory] = useState([]);
  const [editFramework, setEditFramework] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedID, setEditedID] = useState("");
  const [editedName, setEditedName] = useState("");
  const [itemFramework, setItemFramework] = useState([]);
  const [value, setValue] = useState([]);
  const [frameworkTotal, setframeworkTotal] = useState([]);
  const [count, setCount] = useState(0);

  const UpdateCategory_id = useRef();

  const apiCategory = "https://portfolio.blackphoenix.digital/getCategory";
  const apiFramework = "https://portfolio.blackphoenix.digital/getFramework";

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiUrl, { headers })
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
  //  console.log("edit Language:" , editCategory)

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
      arr.push(arrPersonal[i]?.technicalSkill[j]);
    }
  }
  // console.log("arr technicalSkill : ", arr);

  let skill = arr;
  let arrSkill = [];
  skill.forEach((val, index) => {
    if (arrSkill.find((v, i) => v.cate == val.category_name)) {
      let i = arrSkill.findIndex((v, i) => v.cate == val.category_name);
      arrSkill[i].val.push(val.framework_name);
    } else
      arrSkill.push({
        id: val.category_id,
        val: [val.framework_name],
        cate: [val.category_name],
      });
  });
  // console.log("arrSkill", arrSkill);

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  // };
  let framework = [];
  const skillById = (data) => {
    // console.log("data.id: ", data.id);           //category by ID
    // console.log("data.cate: ", data.cate);       // category name by ID
    // console.log("data.val: ", data.val);
    setEditModalOpen(true);

    //เช็คค่าที่ catagory_id ตรงกัน แล้วเก็บค่า category_id, category_name ไว้ใน usestate เพื่อเรียกไปใช้งาน ใน Modal
    for (let i = 0; i < editCategory.length; i++) {
      if (data.id == editCategory[i].category_id) {
        setEditedID(editCategory[i].category_id);
        // console.log(editCategory[i].category_id);
        setEditedName(editCategory[i].category_name);
      }
    }

    //GET Framework by ID
    let arrFrameWorkID = [];
    for (let i = 0; i < editFramework.length; i++) {
      if (data.id == editFramework[i].category_id) {
        arrFrameWorkID.push(editFramework[i]); //framework name ทั้งหมด ตาม category
      }
    }
    setframeworkTotal(arrFrameWorkID);
    // console.log("arrFrameWorkID by ID :", arrFrameWorkID);

    let skill = data.val; //framework name by id ตาม category
    // console.log("skill", skill)

    framework = arrFrameWorkID.filter((e) => {
      let res = true;
      for (var i of skill) {
        res = res && i != e.framework_name;
      }
      return res;
    });
    setItemFramework(framework);
  };

  //data framework name ใน TagPicker
  let frameworkName = [];
  frameworkName = itemFramework;
  // console.log("frameworkName post: ", frameworkName);
  const fData = frameworkName.map((item, idF) => ({
    label: item.framework_name,
    value: item.framework_id,
  }));

  //delete
  const removeTag = (tag) => {
    const deleteTags = skill.filter((item) => item.framework_name == tag);
    Swal.fire({
      title: `คุณต้องการลบทักษะ ${tag}`,
      // text: tag,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit(deleteTags);
      }
    });

    const handleSubmit = async (deleteTags) => {
      try {
        axios({
          method: "delete",
          url: "https://portfolio.blackphoenix.digital/deleteTechnicalSkill",
          headers: { "Content-Type": "application/json" },
          data: {
            employeeId: id,
            technicalSkillId: deleteTags[0].technical_skill_id,
            category_id: deleteTags[0].category_id,
            framework_id: deleteTags[0].framework_id,
          },
        })
          .then(function (response) {
            if (response.status == 200) {
              Swal.fire("ลบทักษะ", "สำเร็จ").then(() => {
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
        console.error(error.response);
        Swal.fire("ไม่สำเร็จ!").then(() => {
          window.location.reload();
        });
      }
    };
  };

  const formHandler = async () => {
    for (let i = 0; i < value.length; i++) {
      for (let j = 0; j < frameworkTotal.length; j++) {
        if (value[i] == frameworkTotal[j].framework_id) {
          await axios({
            method: "post",
            url: "https://portfolio.blackphoenix.digital/appendTechSkills",
            headers: { "Content-Type": "application/json" },
            data: {
              employee_Id: id,
              category_id: frameworkTotal[j].category_id,
              framework_id: frameworkTotal[j].framework_id,
            },
          })
            .then(function (response) {
              if (response.status == 200) {
                Swal.fire("เพิ่มทักษะ!", "สำเร็จ").then(() => {
                  window.location.reload();
                });
              } else {
                Swal.fire("เพิ่มทักษะ!", "ไม่สำเร็จ").then(() => {
                  window.location.reload();
                });
              }
            })
            .catch(function (error) {
              console.log(error);
              Swal.fire("เพิ่มทักษะ!", "ไม่สำเร็จ").then(() => {
                window.location.reload();
              });
            });
        }
      }
    }
  };


  return (
    <div>
      <AddTechnical />
      <table className="table custom-header">
        <thead className="table-primary">
          <tr>
            <th scope="col" style={{ textAlign: "center" }}>
              ลำดับ
            </th>
            <th scope="col">ประเภท</th>
            <th scope="col">ทักษะ</th>
            <th scope="col" style={{ textAlign: "center" }}>
              แก้ไข
            </th>
          </tr>
        </thead>
        {arrSkill.map((item, index) => (
          <tbody key={index}>
            <tr>
              <th scope="row" style={{ textAlign: "center" }}>
                {index + 1}
              </th>
              <td>{item.cate}</td>
              <td>
                {item.val.map((skill, i) => (
                  <Tag
                    color="violet"
                    closable
                    onClick={() => removeTag(skill)}
                    key={i}
                  >
                    {skill}
                  </Tag>
                ))}
              </td>

              <td width={50}>
                <Button onClick={() => skillById(item)}>เพิ่มทักษะ</Button>
              </td>
            </tr>
          </tbody>
        ))}
      </table>

      <Modal
        open={editModalOpen}
        onClose={closeEditModal}
        // onSubmit={formHandler()}
      >
        <Modal.Header>
          <Modal.Title>แก้ไขทักษะทางคอมพิวเตอร์</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <hr />
            <Form>
              <Stack spacing={6}>
                <Tag size="md">กลุ่มทักษะ:</Tag>
                <p value={editedID} ref={UpdateCategory_id}>
                  {editedName}
                </p>
              </Stack>
              <br />
              <Stack spacing={6}>
                <Tag size="md">ทักษะ:</Tag>
                <TagPicker
                  data={fData}
                  value={value}
                  block
                  style={{ width: 400 }}
                  required
                  onChange={(newValue) => setValue(newValue)}
                />
              </Stack>
            </Form>
            <hr />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" appearance="primary" onClick={formHandler}>
            Ok
          </Button>
          <Button onClick={closeEditModal} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditTechnical;
