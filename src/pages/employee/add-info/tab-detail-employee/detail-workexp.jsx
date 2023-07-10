import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Tag } from "rsuite";
import token from "../../../../token-apiurl/token";
import apiUrl from "../../../../token-apiurl/apiurl";

import moment from "moment";

function DetailWorkExp() {
  const { id } = useParams();
  const [empPersonalWorkExp, setempPersonalWorkExp] = useState([]);
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiUrl, { headers })
      .then((response) => response.json())
      .then((data) => setempPersonalWorkExp(data));
  }, []);

  let arrPersonal = [];

  for (let i = 0; i < empPersonalWorkExp.length; i++) {
    if (id == empPersonalWorkExp[i].employee_id) {
      // console.log(empPersonalWorkExp[i]);
      arrPersonal.push(empPersonalWorkExp[i]);
    }
  }

  let arr = [];
  for (let i = 0; i < arrPersonal.length; i++) {
    for (let j = 0; j < arrPersonal[i].workExperience.length; j++) {
      arr.push(arrPersonal[i]?.workExperience[j]);
    }
  }
  // console.log("arr workExperience  : ", arr);

  let arrZero = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].work_exp_id == 0) {
      arrZero.push(arr[i]);
    }
  }
  // console.log("arrZero workExperience (งานปัจจุบัน) : ", arrZero);

  let arrNotZero = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].work_exp_id != 0) {
      arrNotZero.push(arr[i]);
    }
  }
  // console.log("arrNotZero workExperience (ประสบกาณ์ทำงาน) :  ", arrNotZero);

  return (
    <div className="Content" style={{ textAlign: "left" }}>
      <Tag>ประสบการณ์ทำงาน :</Tag>

      <Row>
        <Col>
          {arr.map((ItemPersonalWorkExp, index) => (
            <div className="card-body" key={index}>
              <Col>
                <p className="card-text">
                  {ItemPersonalWorkExp.position_name},
                  {ItemPersonalWorkExp.department_name},
                  {ItemPersonalWorkExp.company_name}
                  {/* {ItemPersonalWorkExp.responsibility_detail} */}
                </p>
              </Col>
              <Col>
                <p className="card-text">
                  {moment(ItemPersonalWorkExp.start_date).format("DD/MM/YYYY")}-
                  {moment(ItemPersonalWorkExp.end_date).format("DD/MM/YYYY")}
                </p>
              </Col>
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
}

export default DetailWorkExp;
