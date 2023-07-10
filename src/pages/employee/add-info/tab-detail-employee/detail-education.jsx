import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tag } from "rsuite";

import token from "../../../../token-apiurl/token";
import apiUrl from "../../../../token-apiurl/apiurl";

function DetailEducation() {
  const { id } = useParams();
  const [empPersonalEducate, setempPersonalEducate] = useState([]);
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiUrl, { headers })
      .then((response) => response.json())
      .then((data) => setempPersonalEducate(data));
  }, []);

  let arrPersonal = [];

  for (let i = 0; i < empPersonalEducate.length; i++) {
    if (id == empPersonalEducate[i].employee_id) {
      // console.log(empPersonalEducate[i]);
      arrPersonal.push(empPersonalEducate[i]);
    }
  }

  let arr = [];
  for (let i = 0; i < arrPersonal.length; i++) {
    for (let j = 0; j < arrPersonal[i].eduCation.length; j++) {
      arr.push(arrPersonal[i]?.eduCation[j]);
    }
  }
  // console.log("arr Education : ", arr);

  return (
    <div className="Content">
      <Tag>การศึกษา</Tag><br/>
      {arr.map((ItemPersonalEducate, index) => (
        <div key={index}>
          {/* <p className="card-text">
                วุฒิการศึกษา : {ItemPersonalEducate.degree_name}
              </p> */}
          <p style={{ textAlign: "left" }}>
             {ItemPersonalEducate.major_name}
            {ItemPersonalEducate.faculty_name}
            {ItemPersonalEducate.university_name} <br />
            เกรดเฉลี่ย : {ItemPersonalEducate.gpax}
          </p>
        </div>
      ))}
    </div>
  );
}

export default DetailEducation;
