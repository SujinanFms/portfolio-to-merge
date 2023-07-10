import React, { useEffect, useState } from "react";
import "../../../css/style.css";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Input,
  SelectPicker,
  DatePicker,
  Toggle,
  Schema,
} from "rsuite";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import token from "../../../token-apiurl/token";
import apiUrl from "../../../token-apiurl/apiurl";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import AddWorkExp from "./add-in-edit/add-workexp";
import Swal from "sweetalert2";

const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));

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

const Toggles = React.forwardRef((props, ref) => {
  const { name, message, label, accepter, error, ...rest } = props;
  return (
    <Form.Group
      controlId={`${name}-10`}
      ref={ref}
      className={error ? "has-error" : ""}
    >
      <Row>
        <Col>
          <Form.ControlLabel>{label} </Form.ControlLabel>
        </Col>
        <Col>
          <Form.Control
            name={name}
            accepter={accepter}
            errorMessage={error}
            {...rest}
          />
        </Col>
      </Row>

      <Form.HelpText>{message}</Form.HelpText>
    </Form.Group>
  );
});

//model การเช็ค validation
const { StringType, DateType, NumberType } = Schema.Types;
const model = Schema.Model({
  company: StringType().isRequired("กรุณาเลือกบริษัท"),
  position: NumberType().isRequired("กรุณาเลือกตำแหน่ง"),
  startdateWexp: DateType().isRequired("กรุณาเลือกวันที่เริ่มงาน"),
  enddateWexp: DateType().isRequired("กรุณาเลือกวันที่สิ้นสุดการทำงาน"),

});

const EditWorkExp = () => {
  //Update Framework Skill
  const [framework_id, setFramework_id] = useState("");

  const { id, EditTechnicId } = useParams();
  const [empPersonalWorkExp, setempPersonalWorkExp] = useState([]);

  //Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPosition, setEditPosition] = useState([]);
  const [editCustomer, setEditCustomer] = useState([]);
  const [modalArrWorkID, setModalArrWorkID] = useState([]);
  const [checkCount, setcheckCount] = React.useState(0);
  const [size, setSize] = React.useState("md");
  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});

  const [company, setCompany] = React.useState();
  const [position, setPosition] = React.useState();
  const [department, setDepartment] = React.useState();
  const [startdateWexp, setStartdateWexp] = React.useState();
  const [enddateWexp, setEnddateWexp] = React.useState();
  const [detail, setDetail] = React.useState();
  const [status, setStatus] = useState(false);
  const [customer, setCustomer] = React.useState();
  const [startdateStatus, setStartdateStatus] = React.useState();
  const [enddateStatus, setEnddateStatus] = React.useState();

  const apiPosition = "https://portfolio.blackphoenix.digital/getPosition";
  const apiCustomer = "https://portfolio.blackphoenix.digital/getCustomer";

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiUrl, { headers })
      .then((response) => response.json())
      .then((data) => setempPersonalWorkExp(data));
  }, []);

  //GET Position
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiPosition, { headers })
      .then((response) => response.json())
      .then((data) => setEditPosition(data));
  }, []);

  //GET Customer
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(apiCustomer, { headers })
      .then((response) => response.json())
      .then((data) => setEditCustomer(data));
  }, []);

  const Position = editPosition.map((item) => ({
    label: item.position_name,
    value: item.position_id,
  }));
  const Customer = editCustomer.map((item) => ({
    label: item.customer_name,
    value: item.customer_id,
  }));

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

  const CheckStatusDetail = (data) => {
    let arrWorkStatusDetail = [];
    if (data.workExperience != "") {
      if (data == 0) {
        arrWorkStatusDetail.push("อยู่ที่บริษัท");
      } else {
        arrWorkStatusDetail.push("ไม่อยู่ที่บริษัท");
      }
    } else {
      arrWorkStatusDetail.push("ไม่มีข้อมูล");
    }
    return arrWorkStatusDetail;
  };

  const CheckEndDate = (data) => {
    let newData = moment(data).format("YYYY-MM-DD");
    let arrEndDate = [];
    if (
      data === null ||
      newData === "0000-00-00" ||
      newData === "Invalid date"
    ) {
      arrEndDate.push("-");
    } else {
      arrEndDate.push(moment(newData).format("DD/MM/YYYY"));
    }
    return arrEndDate;
  };

  // close Modal
  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  let arrWorkExpId = [];
  const WorkExpById = (data) => {
    setEditModalOpen(true);

    if (data.customer_end_date == "0000-00-00") {
      data.customer_end_date = Date();
    }
    // console.log("data ", data);
    arrWorkExpId.push(data);
    setModalArrWorkID(arrWorkExpId);

    // เงื่อนไขเช็คกำหนดค่า default workExperience  ไว้ใน usesatate หากไม่มีการ onchange ให้ส่งค่าเดิมไป
    if (checkCount == 0) {
      // setFormDegree(arrEduId[0].degree_id);
      // console.log("company name: ",arrWorkExpId[0].company_name)
      setCompany(arrWorkExpId[0].company_name);
      setPosition(arrWorkExpId[0].position_id);
      setDepartment(arrWorkExpId[0].department_name);
      setStartdateWexp(arrWorkExpId[0].start_date);
      setEnddateWexp(arrWorkExpId[0].end_date);
      setDetail(arrWorkExpId[0].responsibility_detail);
      setStatus(arrWorkExpId[0].onsite_status);
      setCustomer(arrWorkExpId[0].customer_id);
      setStartdateStatus(arrWorkExpId[0].customer_start_date);
      setEnddateStatus(arrWorkExpId[0].customer_end_date);
    } else {
      setcheckCount(1);
    }
  };

  const submitUpdate = async (event) => {
    event.preventDefault();

    /* if (!formRef.current.check()) {
      toaster.push(<Message type="error">Error</Message>);
      return;
    } */
    Swal.fire({
      title: `<h4>คุณต้องการแก้ไขข้อมูลประสบการณ์ทำงาน</h4>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit(modalArrWorkID);
      }
    });
    const toggleValue = status ? "1" : "0";
    const sDate = moment(startdateWexp).format("YYYY-MM-DD");
    const eDate = moment(enddateWexp).format("YYYY-MM-DD");
    const csDate = moment(startdateStatus).format("YYYY-MM-DD");
    const ceDate = moment(enddateStatus).format("YYYY-MM-DD");

    console.log("employee_Id: ", id);
    console.log("work_exp_id: ", modalArrWorkID[0].work_exp_id);
    console.log("company_name: ", company);
    console.log("position_id: ", position);
    console.log("department_name: ", department);
    console.log("start_date: ", sDate);
    console.log("end_date: ", eDate);
    console.log("responsibility_detail: ", detail);
    console.log("onsite_status: ", toggleValue);
    console.log("customer_id: ", customer);
    console.log("customer_start_date: ", csDate);
    console.log("customer_end_date: ", ceDate);
    console.log("update_user_id: ", id);

    const handleSubmit = async (modalArrWorkID) => {
      await axios({
        method: "put",
        url: "https://portfolio.blackphoenix.digital/updateWork_experience",
        headers: { "Content-Type": "application/json" },
        data: {
          employee_Id: id,
          work_exp_id: modalArrWorkID[0].work_exp_id,
          company_name: company,
          position_id: position,
          department_name: department,
          start_date: sDate,
          end_date: eDate,
          responsibility_detail: detail,
          onsite_status: toggleValue,
          customer_id: customer,
          customer_start_date: csDate,
          customer_end_date: ceDate,
          update_user_id: id,
        },
      })
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire(`แก้ไขข้อมูลประสบการณ์ทำงาน`, "สำเร็จ").then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire(`แก้ไขข้อมูลประสบการณ์ทำงาน`, "ไม่สำเร็จ!").then(() => {
              window.location.reload();
            });
          }
        })
        .catch(function (error) {
          console.log(error);
          Swal.fire(`แก้ไขข้อมูลประสบการณ์ทำงาน`, "ไม่สำเร็จ!").then(() => {
            window.location.reload();
          });
        });

    };
  };
  const openWithStatus = (workExp) => {
    return (
      <Form>
        <Field
          name="customer"
          label="บริษัทลูกค้า:"
          accepter={SelectPicker}
          error={formError.customer}
          style={{ display: "inline-block", width: 300 }}
          data={Customer}
          defaultValue={workExp.customer_id}
          onChange={setCustomer}
        />
        <Row>
          <Col>
            {" "}
            <Field
              name="startdateStatus"
              label="วันเริ่มงาน (บริษัทลูกค้า):"
              accepter={DatePicker}
              error={formError.startdateStatus}
              style={{ width: 145 }}
              format="dd-MM-yyyy"
              defaultValue={new Date(workExp.customer_start_date)}
              onChange={setStartdateStatus}
            />
          </Col>
          <Col>
            {" "}
            <Field
              name="enddateStatus"
              label="วันสิ้นสุดการทำงาน (บริษัทลูกค้า):"
              accepter={DatePicker}
              error={formError.enddateStatus}
              style={{ width: 145 }}
              format="dd-MM-yyyy"
              defaultValue={new Date(workExp.customer_end_date)}
              onChange={setEnddateStatus}
            />
          </Col>
        </Row>
      </Form>
    );
  };

  //delete
  const remove = (Expid) => {
    const deleteExp = arr.filter((item) => item.work_exp_id == Expid);
    Swal.fire({
      title: `<h4>คุณต้องการลบข้อมูลประสบการณ์ทำงาน</h4>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit(deleteExp);
      }
    });

    const handleSubmit = async (deleteExp) => {
      console.log("deleteExp", deleteExp);
      console.log("id ", id);
      console.log("Expid ", Expid);

      try {
        axios({
          method: "delete",
          url: "https://portfolio.blackphoenix.digital/deleteWork_experience",
          headers: { "Content-Type": "application/json" },
          data: {
            employeeId: id,
            workExpId: Expid,
          },
        })
          .then(function (response) {
            if (response.status == 200) {
              Swal.fire("ลบข้อมูลประสบการณ์ทำงาน", "สำเร็จ").then(() => {
                window.location.reload();
              });
            } else {
              Swal.fire("ลบข้อมูลประสบการณ์ทำงาน", "ไม่สำเร็จ!").then(() => {
                window.location.reload();
              });
            }
          })
          .catch(function (error) {
            console.log(error);
            Swal.fire("ลบข้อมูลประสบการณ์ทำงาน", "ไม่สำเร็จ!").then(() => {
              window.location.reload();
            });
          });
      } catch (error) {
        Swal.fire("ลบข้อมูลประสบการณ์ทำงาน", "ไม่สำเร็จ!");
        console.error(error.response);
      }
    };
  };

  return (
    <div>
      <AddWorkExp />
      <table className="table custom-header">
        <thead className="table-primary" style={{ fontSize: 11 }}>
          <tr>
            <th scope="col" style={{ textAlign: "center" }}>
              ลำดับ
            </th>
            <th scope="col">ชื่อบริษัท</th>
            <th scope="col">ตำแหน่ง</th>
            <th scope="col" style={{ textAlign: "center" }}>
              วันที่เริ่มทำงาน
            </th>
            <th scope="col" style={{ textAlign: "center" }}>
              วันสิ้นสุด
              <br />
              การทำงาน
            </th>
            <th scope="col" style={{ textAlign: "center" }}>
              สถานะ
              <br />
              การทำงาน
            </th>
            <th scope="col" style={{ textAlign: "center" }}>
              ชื่อบริษัทลูกค้า
            </th>
            <th scope="col" style={{ textAlign: "center" }}>
              วันที่เริ่มทำงาน
              <br />
              (บริษัทลูกค้า)
            </th>
            <th scope="col" style={{ textAlign: "center" }}>
              วันสิ้นสุดการทำงาน
              <br />
              (บริษัทลูกค้า)
            </th>
            <th scope="col" style={{ textAlign: "center" }}>
              แก้ไข
            </th>
            <th scope="col" style={{ textAlign: "center" }}>
              ลบ
            </th>
          </tr>
        </thead>
        {arr.map((item, index) => (
          <tbody key={index}>
            <tr>
              <td style={{ textAlign: "center" }}>{item.work_exp_id}</td>
              <td>{item.company_name}</td>
              <td>{item.position_name}</td>
              <td>{CheckEndDate(item.start_date)}</td>
              <td>{CheckEndDate(item.end_date)}</td>
              <td>{CheckStatusDetail(item.onsite_status)}</td>
              <td>{item.customer_name}</td>
              <td>{CheckEndDate(item.customer_start_date)}</td>
              <td>{CheckEndDate(item.customer_end_date)}</td>
              {/* <td>{CheckEndDate(item.customer_end_date)}</td> */}
              <td width={50}>
                <Button onClick={() => WorkExpById(item)}>
                  <FaRegEdit />
                </Button>
              </td>
              <td width={50}>
                <Button onClick={() => remove(item.work_exp_id)}>
                  <FaRegTrashAlt />
                </Button>
              </td>
            </tr>
          </tbody>
        ))}
      </table>

      <Modal size={size} open={editModalOpen} onClose={closeEditModal}>
        <Modal.Header>
          <Modal.Title>Work Experience</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalArrWorkID.map((workExp, iexp) => (
            <Form
              key={iexp}
              ref={formRef}
              onCheck={setFormError}
              model={model}
              defaultValue={workExp}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Row>
                <Col>
                  <Field
                    name="company"
                    label="บริษัท :"
                    accepter={Input}
                    error={formError.company}
                    defaultValue={workExp.company_name}
                    onChange={setCompany}
                  />
                  <Row>
                    <Col>
                      <Field
                        name="position"
                        label="ตำแหน่ง :"
                        accepter={SelectPicker}
                        error={formError.position}
                        style={{ display: "inline-block", width: 145 }}
                        data={Position}
                        defaultValue={workExp.position_id}
                        onChange={setPosition}
                      />
                    </Col>
                    <Col>
                      <Field
                        name="department"
                        label="แผนก :"
                        accepter={Input}
                        error={formError.department}
                        style={{ width: 145 }}
                        defaultValue={workExp.department_name}
                        onChange={setDepartment}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Field
                        name="startdateWexp"
                        label="วันที่เริ่มงาน :"
                        accepter={DatePicker}
                        error={formError.startdateWexp}
                        style={{ width: 145 }}
                        format="dd-MM-yyyy"
                        defaultValue={new Date(workExp.start_date)}
                        onChange={setStartdateWexp}
                      />
                    </Col>
                    <Col>
                      <Field
                        name="enddateWexp"
                        label="วันสิ้นสุดการทำงาน :"
                        accepter={DatePicker}
                        error={formError.enddateWexp}
                        style={{ width: 145 }}
                        format="dd-MM-yyyy"
                        defaultValue={new Date(workExp.end_date)}
                        onChange={setEnddateWexp}
                      />
                    </Col>
                  </Row>
                  <Field
                    name="detail"
                    label="รายละเอียดงาน :"
                    accepter={Textarea}
                    error={formError.detail}
                    defaultValue={workExp.responsibility_detail}
                    onChange={setDetail}
                  />
                </Col>
                <Col>
                  <Toggles
                    accepter={Toggle}
                    name="status"
                    label="สถานะการทำงาน :"
                    errorMessage={formError.status}
                    defaultChecked={workExp.onsite_status == 0 ? false : true}
                    onClick={() => setStatus(!status)}
                  />

                  {/* เมื่อ onsite ให้แสดง form customer ใน function openWithStatus */}
                  {status ? openWithStatus(workExp) : null}

                </Col>
              </Row>
            </Form>
          ))}
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

export default EditWorkExp;
