import React, { useEffect, useRef, useState } from "react";
import "../../../css/style.css";
import {
  Button,
  ButtonToolbar,
  Divider,
  Form,
  Modal,
  Radio,
  RadioGroup,
  Stack,
  Tag,
} from "rsuite";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import token from "../../../token-apiurl/token";
import apiUrl from "../../../token-apiurl/apiurl";
import { useParams } from "react-router-dom";
import AddLanguage from "./add-in-edit/add-language";
import Swal from "sweetalert2";
import axios from "axios";

const EditLanguage = () => {
  const { id } = useParams();
  const [empPersonalSkillLanguage, setempPersonalSkillLanguage] = useState([]);

  //modal Language skill
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedID, setEditedID] = useState("");
  const [editedName, setEditedName] = useState("");
  const [modalArrLangID, setModalArrLangID] = useState([]);

  //Update Language
  const [listening, setListening] = React.useState();
  const [speaking, setSpeaking] = React.useState();
  const [reading, setReading] = React.useState();
  const [writing, setWriting] = React.useState();
  const [checkCount, setcheckCount] = React.useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiUrl, { headers })
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
      arr.push(arrPersonal[i]?.languageSkill[j]);
    }
  }
  // console.log("arr languageSkill : ", arr);

  let arrLang = [];
  for (let i = 0; i < arr.length; i++) {
    if (id == arr[i].employee_id) {
      arrLang.push(arr[i]);
    }
  }
  // console.log("data languageSkill", arrLang);

  //รับค่ามาเช็ค ระดับทักษะทางภาษา
  const checkRateLanguge = (data) => {
    let arrRate = [];
    if (data == 1) {
      arrRate.push("พื้นฐาน");
    } else if (data == 2) {
      arrRate.push("พอใช้");
    } else if (data == 3) {
      arrRate.push("ดี");
    } else if (data == 4) {
      arrRate.push("ดีมาก");
    } else {
      arrRate.push("ไม่มีข้อมูล");
    }
    return arrRate;
  };

  // close Modal
  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  //ฟังก์ชันการแก้ไข ทักษะทางภาษา ใน modal
  const skillLanguageById = async (data) => {
    setEditModalOpen(true);

    let arrLangID = [];
    for (let i = 0; i < arrLang.length; i++) {
      if (data.language_skill_id == arrLang[i].language_skill_id) {
        setEditedID(arrLang[i].language_skill_id);
        setEditedName(arrLang[i].language_name);
        arrLangID.push(arrLang[i]);
        // console.log("arrLang", arrLang[i]);
      }
    }
    setModalArrLangID(arrLangID);

    //เงื่อนไขเช็คกำหนดค่า ระดับทักษะทางภาษาด้านต่างๆ ให้เป็นค่า defaultValue ไว้ใน usesatate หากไม่มี onchange ให้ส่งค่า default ไป
    if (checkCount == 0) {
      setListening(arrLangID[0].listening_rate);
      setSpeaking(arrLangID[0].speaking_rate);
      setReading(arrLangID[0].reading_rate);
      setWriting(arrLangID[0].writing_rate);
    } else {
      setcheckCount(1);
    }
  };

  //บันทึกการแก้ไขข้อมูล ทักษะทางภาษา
  const submitUpdate = async () => {
    Swal.fire({
      title: `คุณต้องการแก้ไขทักษะภาษา${editedName}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit(modalArrLangID);
        // console.log("modalArrLangID: ", modalArrLangID[0].language_id);
      }
    });

    const handleSubmit = async (modalArrLangID) => {
      // console.log("deleteTags", deleteTags)
      console.log("id ", id);
      console.log("language_skill_id ", modalArrLangID[0].language_skill_id);
      console.log("language_id ", modalArrLangID[0].language_id);
      console.log("listening_rate ", listening);
      console.log("speaking_rate ", speaking);
      console.log("reading_rate ", reading);
      console.log("writing_rate ", writing);
      console.log("update_user_id ", id);

      await axios({
        method: "put",
        url: "https://portfolio.blackphoenix.digital/updateLanguage_skill",
        headers: { "Content-Type": "application/json" },
        data: {
          employee_Id: id,
          language_skill_id: modalArrLangID[0].language_skill_id,
          language_id: modalArrLangID[0].language_id,
          listening_rate: listening,
          speaking_rate: speaking,
          reading_rate: reading,
          writing_rate: writing,
          update_user_id: id,
        },
      })
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire(`แก้ไขทักษะภาษา${editedName}`, "สำเร็จ");
            const countTimer = setInterval(() => {
              setCount((prevCount) => prevCount + 1);
              // every 1000 milliseconds
            }, 30000);
            window.location.reload();
          } else {
            Swal.fire(`แก้ไขทักษะภาษา${editedName}`, "ไม่สำเร็จ!").then(() => {
              window.location.reload();
            });
          }
        })
        .catch(function (error) {
          Swal.fire(`แก้ไขทักษะภาษา${editedName}`, "ไม่สำเร็จ!").then(() => {
            window.location.reload();
          });
          console.log(error);
        });
    };
  };

  //delete
  const remove = (Langid) => {
    const deleteLang = arr.filter((item) => item.language_skill_id == Langid);
    Swal.fire({
      title: `คุณต้องการลบทักษะทางภาษา`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit(deleteLang);
      }
    });

    const handleSubmit = async (deleteLang) => {
      console.log("deleteLang", deleteLang);
      console.log("id ", id);
      console.log("languageSkillId ", Langid);

      try {
        axios({
          method: "delete",
          url: "https://portfolio.blackphoenix.digital/deleteLanguageSkill",
          headers: { "Content-Type": "application/json" },
          data: {
            employeeId: id,
            languageSkillId: Langid,
          },
        })
          .then(function (response) {
            if (response.status == 200) {
              Swal.fire("ลบข้อมูลทักษะทางภาษา", "สำเร็จ").then(() => {
                window.location.reload();
              });
            } else {
              Swal.fire(`แก้ไขทักษะภาษา${editedName}`, "ไม่สำเร็จ!").then(
                () => {
                  window.location.reload();
                }
              );
            }
          })
          .catch(function (error) {
            console.log(error);
            Swal.fire(`แก้ไขทักษะภาษา${editedName}`, "ไม่สำเร็จ!").then(() => {
              window.location.reload();
            });
          });
      } catch (error) {
        console.error(error.response);
        Swal.fire(`แก้ไขทักษะภาษา${editedName}`, "ไม่สำเร็จ!").then(() => {
          window.location.reload();
        });
      }
    };
  };

  return (
    <div>
      <AddLanguage />
      <table className="table custom-header">
        <thead className="table-primary">
          <tr>
            <th scope="col" style={{ textAlign: "center" }}>
              ลำดับ
            </th>
            <th scope="col">ภาษา</th>
            <th scope="col">การฟัง</th>
            <th scope="col">การพูด</th>
            <th scope="col">การอ่าน</th>
            <th scope="col">การเขียน</th>
            <th scope="col">แก้ไข</th>
            <th scope="col">ลบ</th>
          </tr>
        </thead>
        {arr.map((item, index) => (
          <tbody key={index}>
            <tr>
              <th scope="row" style={{ textAlign: "center" }}>
                {item.language_skill_id}
              </th>
              <td>{item.language_name}</td>
              <td>{checkRateLanguge(item.listening_rate)}</td>
              <td>{checkRateLanguge(item.speaking_rate)}</td>
              <td>{checkRateLanguge(item.reading_rate)}</td>
              <td>{checkRateLanguge(item.writing_rate)}</td>
              <td width={50}>
                <ButtonToolbar>
                  <Button onClick={() => skillLanguageById(item)}>
                    <FaRegEdit />
                  </Button>
                </ButtonToolbar>
              </td>
              <td width={50}>
                <Button onClick={() => remove(item.language_skill_id)}>
                  <FaRegTrashAlt />
                </Button>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
      <Modal open={editModalOpen} onClose={closeEditModal}>
        <Modal.Header>
          {/* <Modal.Title>
            
          </Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          {/* <Tag size="lg"></Tag> */}
          <Tag size="lg">ทักษะ :</Tag>&nbsp;&nbsp;&nbsp;ภาษา{editedName}
          <hr />
          <Form>

            {modalArrLangID.map((val, index) => (
              <div key={index}>
                <Stack>
                  <label>
                    &nbsp;ระดับการฟัง&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </label>
                  {<Divider vertical />}
                  <RadioGroup
                    inline
                    name="radio-name"
                    defaultValue={val.listening_rate}
                    onChange={setListening}
                    dir="rtl"
                  >
                    <Radio value={4}>ดีมาก</Radio>&emsp;
                    <Radio value={3}>ดี</Radio>&emsp;
                    <Radio value={2}>พอใช้</Radio>&emsp;
                    <Radio value={1}>พื้นฐาน</Radio>&emsp;
                  </RadioGroup>
                </Stack>

                <Stack>
                  <label>
                    &nbsp;ระดับการพูด&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </label>
                  {<Divider vertical />}
                  <RadioGroup
                    inline
                    name="radio-name"
                    defaultValue={val.speaking_rate}
                    onChange={setSpeaking}
                    dir="rtl"
                  >
                    <Radio value={4}>ดีมาก</Radio>&emsp;
                    <Radio value={3}>ดี</Radio>&emsp;
                    <Radio value={2}>พอใช้</Radio>&emsp;
                    <Radio value={1}>พื้นฐาน</Radio>&emsp;
                  </RadioGroup>
                </Stack>

                <Stack>
                  <label>
                    &nbsp;ระดับการอ่าน&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </label>
                  {<Divider vertical />}
                  <RadioGroup
                    inline
                    name="radio-name"
                    defaultValue={val.reading_rate}
                    onChange={setReading}
                    dir="rtl"
                  >
                    <Radio value={4}>ดีมาก</Radio>&emsp;
                    <Radio value={3}>ดี</Radio>&emsp;
                    <Radio value={2}>พอใช้</Radio>&emsp;
                    <Radio value={1}>พื้นฐาน</Radio>&emsp;
                  </RadioGroup>
                </Stack>

                <Stack>
                  <label>&nbsp;ระดับการเขียน&nbsp;&nbsp;&nbsp;&nbsp;</label>
                  {<Divider vertical />}
                  <RadioGroup
                    inline
                    name="radio-name"
                    defaultValue={val.writing_rate}
                    onChange={setWriting}
                    dir="rtl"
                  >
                    <Radio value={4}>ดีมาก</Radio>&emsp;
                    <Radio value={3}>ดี</Radio>&emsp;
                    <Radio value={2}>พอใช้</Radio>&emsp;
                    <Radio value={1}>พื้นฐาน</Radio>&emsp;
                  </RadioGroup>
                </Stack>
              </div>
            ))}

            {/* <hr /> */}
          </Form>
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

export default EditLanguage;

