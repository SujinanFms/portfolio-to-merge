import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Stack, Tag } from "rsuite";
import token from "../../../../token-apiurl/token";
import apiUrl from "../../../../token-apiurl/apiurl";

function DetailSkillCom() {
  const { id } = useParams();
  const [empPersonalSkillCom, setempPersonalSkillCom] = useState([]);
  // const [category, setCategory] = useState([]);

  const apiCategory = "https://portfolio.blackphoenix.digital/getCategory";

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiUrl, { headers })
      .then((response) => response.json())
      .then((data) => setempPersonalSkillCom(data));
  }, []);

  let arrPersonal = [];
  for (let i = 0; i < empPersonalSkillCom.length; i++) {
    if (id == empPersonalSkillCom[i].employee_id) {
      // console.log(empPersonalSkillCom[i]);
      arrPersonal.push(empPersonalSkillCom[i]);
    }
  }

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
    if (arrSkill.find((v, i) => v.id == val.category_name)) {
      let i = arrSkill.findIndex((v, i) => v.id == val.category_name);
      arrSkill[i].val.push(val.framework_name);
    } else arrSkill.push({ id: val.category_name, val: [val.framework_name] });
  });
  // console.log("arrSkill", arrSkill);

  return (
    <div className="Content">
      <Tag> ทักษะทางคอมพิวเตอร์ :</Tag>
      <br />
      {arrSkill.map((v, i) => (
        <div key={i}>
          <Stack>
            {" "}
            <p>{v.id} :</p>
            {v.val.map((item, index) => (
              <Tag color="violet" style={{ margin: 4 }} key={index}>{item}</Tag>
            ))}
          </Stack>
        </div>
      ))}
    </div>
  );
}

export default DetailSkillCom;
