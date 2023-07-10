import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row,  Tag } from "rsuite";
import token from "../../../../token-apiurl/token";
import apiUrl from "../../../../token-apiurl/apiurl";
import moment from "moment";

var boxStyle = {
  height: 100,
  width: 100,
  borderRadius: 50,
};

function DetailPersonal() {
  const { id } = useParams();
  const [empPersonal, setempPersonal] = useState([]);
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiUrl, { headers })
      .then((response) => response.json())
      .then((data) => setempPersonal(data));
  }, []);

  let arrPersonal = [];

  for (let i = 0; i < empPersonal.length; i++) {
    if (id == empPersonal[i].employee_id) {
      // console.log(empPersonal[i]);
      arrPersonal.push(empPersonal[i]);
    }
  }


  return (
    <div className="Content">
      {arrPersonal.map((ItemPersonal, index) => (
        <Row style={{ textAlign: "left" }} key={index}>
          <Col>
            <img
              src={ItemPersonal.picture}
              style={boxStyle}
            />
          </Col>

          <Col xs={8}>
            <div>
              <Tag>ชื่อ-สกุล</Tag>
              <p>{ItemPersonal.employee_name}</p>
              <Tag>อีเมล</Tag>
              <p>{ItemPersonal.email}</p>
              <Tag>เบอร์โทรศัพท์</Tag>
              <p>{ItemPersonal.phone}</p>
            </div>
          </Col>

          <Col>
            <Col
              style={{
                width: "400px",
                wordWrap: "break-word",
                padding: "5px",
              }}
            >
              <Tag>วัน/เดือน/ปี เกิด</Tag>
              <p>{moment(ItemPersonal.birth_date).format("DD/MM/YYYY")}</p>
              <Tag>อายุ</Tag>
              <p>
                {moment(Date()).format("YYYY") -
                  moment(ItemPersonal.birth_date).format("YYYY")}
              </p>
              <Tag>ที่อยู่ปัจจุบัน</Tag>
              <p>{ItemPersonal.address_current}</p>
            </Col>
            <div></div>
          </Col>
        </Row>
      ))}
    </div>
  );
}

export default DetailPersonal;
