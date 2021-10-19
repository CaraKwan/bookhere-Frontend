import { Layout, Dropdown, Menu, Button, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import LoginPage from "./components/LoginPage";
import HostHomePage from "./components/HostHomePage";
import GuestHomePage from "./components/GuestHomePage";
import background from "./pic.jpg";
 
const { Header, Content } = Layout;
const { Title } = Typography;
 
class App extends React.Component {
  state = {
    authed: false,
    asHost: false,
  };
 
  //Get and set authentication and authorization 
  componentDidMount() {
    //Use localStorage to perform login persistence
    const authToken = localStorage.getItem("authToken");
    const asHost = localStorage.getItem("asHost") === "true";
    this.setState({
      authed: authToken !== null,
      asHost,
    });
  }
 
  //Store token informaton and set authed and asHost if logged in
  handleLoginSuccess = (token, asHost) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("asHost", asHost);
    this.setState({
      authed: true,
      asHost,
    });
  };
 
  //Remove token and set authed if logged out
  handleLogOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("asHost");
    this.setState({
      authed: false,
    });
  };
 
  //Display different content based on log in or not and different authorization
  renderContent = () => {
    if (!this.state.authed) {
      return <div >
        <LoginPage handleLoginSuccess={this.handleLoginSuccess} />
      </div>;
    }
 
    if (this.state.asHost) {
      return <HostHomePage />;
    }
 
    return <GuestHomePage />;
  };
 
  userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={this.handleLogOut}>
        Log Out
      </Menu.Item>
    </Menu>
  );
 
  render() {
    return (
      <Layout style={{ height: "100vh" }}>
        <Header style={{ display: "flex", justifyContent: "space-between" }}>
          <Title
            level={2}
            style={{ color: "white", lineHeight: "inherit", marginBottom: 0 }}
          >
            bookhere
          </Title>
          {/* Displace dropdown if authed */}
          {this.state.authed && (
            <div>
              <Dropdown trigger="click" overlay={this.userMenu}>
                <Button icon={<UserOutlined />} shape="circle" />
              </Dropdown>
            </div>
          )}
        </Header>
        <Content
          style={{ backgroundImage: `url(${background})`, height: "100%", margin: 0, width:"100", overflow: "auto" }}
        >
          {this.renderContent()}
        </Content>
      </Layout>
    );
  }
}
 
export default App;