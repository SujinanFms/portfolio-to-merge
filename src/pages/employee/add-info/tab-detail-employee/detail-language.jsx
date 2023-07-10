import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Tag } from "rsuite";
import token from "../../../../token-apiurl/token";
import apiUrl from "../../../../token-apiurl/apiurl";
import DetailSkillCom from "./detail-skillCom";
import { Row } from "react-bootstrap";

function DetailSkillLanguage() {
  const { id } = useParams();
  const [empPersonalSkillLanguage, setempPersonalSkillLanguage] = useState([]);

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

  return (
    <div className="Content" style={{ textAlign: "left" }}>
      <Row style={{ textAlign: "left" }}>
        {arr.map((ItemPersonalSkillLanguage, indexC) => (
          <Col style={{ paddingBottom: 1 }} key={indexC}>
            <div>
              <p className="card-text">
                <Tag> ทักษะภาษา :</Tag>{" "}
                <b>{ItemPersonalSkillLanguage.language_name}</b>
              </p>
              <Col>
                <p>
                  การฟัง :{" "}
                  {checkRateLanguge(ItemPersonalSkillLanguage.listening_rate)}
                  <br />
                  การพูด :{" "}
                  {checkRateLanguge(ItemPersonalSkillLanguage.speaking_rate)}
                </p>
              </Col>
              <Col>
                <p>
                  การอ่าน :{" "}
                  {checkRateLanguge(ItemPersonalSkillLanguage.reading_rate)}
                  <br />
                  การเขียน :{" "}
                  {checkRateLanguge(ItemPersonalSkillLanguage.writing_rate)}
                </p>

                <p></p>
                <br />
              </Col>
            </div>
          </Col>
        ))}

        <Col>
          <DetailSkillCom />
        </Col>
      </Row>
    </div>
  );
}

export default DetailSkillLanguage;
