import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {  Tag } from "rsuite";
import token from "../../../../token-apiurl/token";
import apiUrl from "../../../../token-apiurl/apiurl";
import moment from "moment";
import { FaBookReader } from "react-icons/fa";

function DetailCert() {
  const { id } = useParams();
  const [empPersonalCert, setempPersonalCert] = useState([]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiUrl, { headers })
      .then((response) => response.json())
      .then((data) => setempPersonalCert(data));
  }, []);

  let arrPersonal = [];

  for (let i = 0; i < empPersonalCert.length; i++) {
    if (id == empPersonalCert[i].employee_id) {
      // console.log(empPersonalCert[i]);
      arrPersonal.push(empPersonalCert[i]);
    }
  }

  let arr = [];
  for (let i = 0; i < arrPersonal.length; i++) {
    for (let j = 0; j < arrPersonal[i].cerTificate.length; j++) {
      arr.push(arrPersonal[i]?.cerTificate[j]);
    }
  }
  // console.log("arr cerTificate : ", arr);

  return (
    <div className="Content" style={{textAlign: "left"}}>
      <Tag> การอบรม :</Tag>
      <br />
      {arr.map((ItemPersonalCert, index) => (
        <div className="card-body" key={index}>
          <p className="card-text">
             <FaBookReader /> {" "} {ItemPersonalCert.certificate_name} 
            <br/>
            {ItemPersonalCert.organization}
            <br/>
            {moment(ItemPersonalCert.start_date).format("DD/MM/YYYY")} - {moment(ItemPersonalCert.end_date).format("DD/MM/YYYY")}
            <br/>
          </p>
         {/*  <p className="card-text">
            ใบรับรองการฝึกอบรม : {ItemPersonalCert.certificate_picture}
          </p> */}
        </div>
      ))}
    </div>
  );
}

export default DetailCert;
