import React, { useEffect, useState } from "react";

import {
  Modal,
  Button,
  ButtonToolbar,
  Form,
  Input,
  Message,
  toaster,
  Schema,
  Row,
  Col,
  DatePicker,
  SelectPicker,
  Toggle,
} from "rsuite";
import token from "../../../../token-apiurl/token";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";

const apiPosition = "https://portfolio.blackphoenix.digital/getPosition";
const apiCustomer = "https://portfolio.blackphoenix.digital/getCustomer";

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

const { StringType, DateType, NumberType } = Schema.Types;
const model = Schema.Model({
  company: StringType().isRequired("กรุณาเลือกบริษัท"),
  position: NumberType().isRequired("กรุณาเลือกตำแหน่ง"),
  startdateWexp: DateType().isRequired("กรุณาเลือกวันที่เริ่มงาน"),
  //   startdateWexp: DateType().max(new Date(),"กรุณาเลือกวันที่เริ่มงาน"),
  enddateWexp: DateType().isRequired("กรุณาเลือกวันที่สิ้นสุดการทำงาน"),
  // customer: NumberType().isRequired("กรุณาเลือกบริษัท"),
  // startdateStatus: DateType().isRequired("กรุณาเลือกวันที่เริ่มงาน"),
  // enddateStatus: DateType().isRequired("กรุณาเลือกวันที่สิ้นสุดการทำงาน"),
});

const AddWorkExp = () => {
  const { id, EditTechnicId } = useParams();
  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState();
  const handleOpen = (value) => {
    setSize(value);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // const [statusValue, setStatusValue] = useState(false);
  const [editPosition, setEditPosition] = useState([]);
  const [editCustomer, setEditCustomer] = useState([]);
  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({
    company: "",
    position: "",
    department: "",
    detail: "",
    status: false,
  });
  const [startdateWexp, setStartdateWexp] = useState();
  const [enddateWexp, setEnddateWexp] = useState();
  const [startdateStatus, setStartdateStatus] = React.useState();
  const [enddateStatus, setEnddateStatus] = React.useState();
  const [customer, setCustomer] = React.useState();

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

  /*  const sendValue = (data) => {
    if (data.status == true) {
      return setFormValue("1");
      
    } else {
      return 0;
    }
  }; */

  const fornCustomer = (formError) => {
    return (
      <Form>
        <Field
          name="customer"
          label="Customer:"
          accepter={SelectPicker}
          error={formError.customer}
          style={{ display: "inline-block", width: 300 }}
          data={Customer}
          onChange={setCustomer}
        />
        <Row>
          <Col>
            {" "}
            <Field
              name="startdateStatus"
              label="Start date:"
              accepter={DatePicker}
              error={formError.startdateStatus}
              style={{ width: 145 }}
              placeholder="วว-ดด-ปปปป"
              format="dd-MM-yyyy"
              onChange={setStartdateStatus}
            />
          </Col>
          <Col>
            {" "}
            <Field
              name="enddateStatus"
              label="End date:"
              accepter={DatePicker}
              error={formError.enddateStatus}
              style={{ width: 145 }}
              placeholder="วว-ดด-ปปปป"
              format="dd-MM-yyyy"
              onChange={setEnddateStatus}
            />
          </Col>
        </Row>
      </Form>
    );
  };

  const submitUpdate = async () => {
    /* if (!formRef.current.check()) {
      toaster.push(<Message type="error">Error</Message>);
      return;
    }
    toaster.push(<Message type="success">Success</Message>); */

    Swal.fire({
      title: `<h4>คุณต้องการเพิ่มข้อมูลประสบการณ์ทำงาน</h4>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit(formValue);
      }
    });
    const toggleValue = formValue.status ? 1 : 0;
    const sDate = moment(startdateWexp).format("YYYY-MM-DD");
    const eDate = moment(enddateWexp).format("YYYY-MM-DD");
    // const csDate = moment(startdateStatus).format("YYYY-MM-DD");
    // const ceDate = moment(enddateStatus).format("YYYY-MM-DD");

    const handleSubmit = async (formValue) => {
      console.log("employee_Id: ", id);
      // console.log("work_exp_id: ", formValue);
      console.log("company_name: ", formValue.company);
      console.log("position_id: ", formValue.position);
      console.log("department_name: ", formValue.department);
      console.log("start_date: ", sDate);
      console.log("end_date: ", eDate);
      console.log("responsibility_detail: ", formValue.detail);
      console.log("onsite_status: ", toggleValue);
      console.log("customer_id: ", customer);
      console.log("customer_start_date: ", startdateStatus);
      console.log("customer_end_date: ", enddateStatus);
      console.log("update_user_id: ", id);

      await axios({
        method: "POST",
        url: "https://portfolio.blackphoenix.digital/appendWorkExperience",
        headers: { "Content-Type": "application/json" },
        data: {
          employee_Id: id,
          company_name: formValue.company,
          position_id: formValue.position,
          department_name: formValue.department,
          start_date: sDate,
          end_date: eDate,
          responsibility_detail: formValue.detail,
          onsite_status: toggleValue,
          customer_id: customer,
          customer_start_date: startdateStatus,
          customer_end_date: enddateStatus,
        },
      })
        .then(function (response) {
          if (response.status == 200) {
            Swal.fire(`เพิ่มข้อมูลประสบการณ์ทำงาน`, "สำเร็จ").then(() => {
              window.location.reload();
            });
          }
        })
        .catch(function (error) {
          Swal.fire(`เพิ่มข้อมูลประสบการณ์ทำงาน`, "ไม่สำเร็จ!").then(() => {
            window.location.reload();
          });
          console.log(error);
        });
    };
  };

  return (
    <>
      <ButtonToolbar>
        <Button
          className="ButtonAdd"
          appearance="primary"
          onClick={() => handleOpen("md")}
        >
          {" "}
          เพิ่มประสบการณ์ทำงาน
        </Button>
      </ButtonToolbar>

      <Modal size={size} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>เพิ่มข้อมูลประสบการณ์ทำงาน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            ref={formRef}
            onChange={setFormValue}
            onCheck={setFormError}
            // formValue={formValue}
            model={model}
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
                  // onChange={setFormValue.company}
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
                    />
                  </Col>
                  <Col>
                    <Field
                      name="department"
                      label="แผนก :"
                      accepter={Input}
                      error={formError.department}
                      style={{ width: 145 }}
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
                      placeholder="วว-ดด-ปปปป"
                      format="dd-MM-yyyy"
                      onChange={setStartdateWexp}
                    />
                  </Col>
                  <Col>
                    <Field
                      name="enddateWexp"
                      label="วันสิ้นสุดการทำงาน :"
                      accepter={DatePicker}
                      error={formError.enddate}
                      style={{ width: 145 }}
                      placeholder="วว-ดด-ปปปป"
                      format="dd-MM-yyyy"
                      onChange={setEnddateWexp}
                    />
                  </Col>
                </Row>
                <Field
                  name="detail"
                  label="รายละเอียดงาน :"
                  accepter={Textarea}
                  error={formError.detail}
                  // onChange={setDetail}
                />
              </Col>
              <Col>
                <Toggles
                  accepter={Toggle}
                  name="status"
                  label="สถานะการทำงาน :"
                  errorMessage={formError.status}
                  // defaultValue={sendValue(formValue)}
                  // formValue={sendValue(formValue)}
                  // onClick={(formValue) => setFormValue(formValue.status ? 1 : 0)}
                  onClick={() => setFormValue(!formValue.status)}
                />

                {formValue.status ? fornCustomer(formValue) : null}

                {/* <Form>
                  <Field
                    name="customer"
                    label="Customer:"
                    accepter={SelectPicker}
                    error={formError.customer}
                    style={{ display: "inline-block", width: 300 }}
                    data={Customer}
                  />
                  <Row>
                    <Col>
                      {" "}
                      <Field
                        name="startdateStatus"
                        label="Start date:"
                        accepter={DatePicker}
                        error={formError.startdateStatus}
                        style={{ width: 145 }}
                        format="dd-MM-yyyy"
                        onChange={setStartdateStatus}
                      />
                    </Col>
                    <Col>
                      {" "}
                      <Field
                        name="enddateStatus"
                        label="End date:"
                        accepter={DatePicker}
                        error={formError.enddateStatus}
                        style={{ width: 145 }}
                        format="dd-MM-yyyy"
                        onChange={setEnddateStatus}
                      />
                    </Col>
                  </Row>
                </Form> */}
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={submitUpdate} appearance="primary">
            บันทึก
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddWorkExp;
