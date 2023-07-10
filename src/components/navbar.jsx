import { Navbar, Nav, Avatar, DatePicker } from "rsuite";
import NoticeIcon from "@rsuite/icons/Notice";

const navStyles = {
  boxShadow: "1px 2px 9px #d8d4dd",
  margin: "1em",
  borderRadius: "10px",
};

function NavApp() {
  return (
    <div className="Navbar">
      <Navbar appearance="subtle" style={navStyles}>
        <Nav pullRight>
          <Navbar.Brand>
            <DatePicker
              plaintext
              defaultValue={new Date()}
              format="dd/MM/yyyy"
            />
          </Navbar.Brand>
          <Nav.Item icon={<NoticeIcon />}></Nav.Item>
          <Nav.Item>Sujinan</Nav.Item>

          <Nav.Item>
            <Avatar
              size="md"
              circle
              src="https://avatars.githubusercontent.com/u/12592949"
              alt="@SevenOutman"
            />
          </Nav.Item>

          <Nav.Menu placement="bottomEnd">
            <Nav.Item>Setting</Nav.Item>
            <Nav.Item>Sign out</Nav.Item>
          </Nav.Menu>
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavApp;
