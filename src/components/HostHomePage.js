import React from "react";
import { Tabs, List, Card, message, Typography, Button, Tooltip, Modal, Image, Space, Carousel } from "antd";
import { InfoCircleOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { deleteStay, getReservationsByStay, getStaysByHost } from "../utils";
import UploadStay from "./UploadStay";

const { Text } = Typography;
const { TabPane } = Tabs;
 
 
class ReservationList extends React.Component {
    state = {
      loading: false,
      reservations: [],
    };
  
    componentDidMount() {
      this.loadData();
    }
  
    //Get reservations by stay from back end
    loadData = async () => {
      this.setState({
        loading: true,
      });
  
      try {
        const resp = await getReservationsByStay(this.props.stayId);
        this.setState({
          reservations: resp,
        });
      } catch (error) {
        message.error(error.message);
      } finally {
        this.setState({
          loading: false,
        });
      }
    };
  
    render() {
      const { loading, reservations } = this.state;
  
      return (
        <List
          loading={loading}
          dataSource={reservations}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<Text>Guest Name: {item.guest.username}</Text>}
                description={
                  <>
                    <Text>Checkin Date: {item.checkin_date}</Text>
                    <br />
                    <Text>Checkout Date: {item.checkout_date}</Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      );
    }
}


class ViewReservationsButton extends React.Component {
    state = {
      modalVisible: false,
    };
  
  //Set modal visibility to true -> open pop up window
    openModal = () => {
      this.setState({
        modalVisible: true,
      });
    };
  
  //Set modal visibility to false -> close pop up window
    handleCancel = () => {
      this.setState({
        modalVisible: false,
      });
    };
  
    render() {
      const { stay } = this.props;
      const { modalVisible } = this.state;
  
      const modalTitle = `Reservations of ${stay.name}`;
  
      return (
        <>
          <Button onClick={this.openModal} shape="round">
            View Reservations
          </Button>
          {/* Create a model when the modalVisible is true */}
          {modalVisible && (
            <Modal
              title={modalTitle}
              centered={true}
              visible={modalVisible}
              closable={false}
              footer={null}
              onCancel={this.handleCancel}
              destroyOnClose={true}
            >
              <ReservationList stayId={stay.id} />
            </Modal>
          )}
        </>
      );
    }
}

class RemoveStayButton extends React.Component {
    state = {
      loading: false,
    };
   
    //Delete a stay from back end, if success, also remove from front end
    handleRemoveStay = async () => {
      const { stayId, onRemoveSuccess } = this.props;
      this.setState({
        loading: true,
      });
   
      try {
        await deleteStay(stayId);
        onRemoveSuccess();  //Call Mystays's loadData to refresh stays
      } catch (error) {
        message.error(error.message);
      } finally {
        this.setState({
          loading: false,
        });
      }
    };
   
    render() {
      return (
        <Button
          loading={this.state.loading}
          onClick={this.handleRemoveStay}
          danger={true}
          shape="round"
          type="primary"
        >
          Delete
        </Button>
      );
    }
}
  
export class StayDetailInfoButton extends React.Component {
    state = {
      modalVisible: false,
    };
   
    //Set modal visibility to true -> open pop up window
    openModal = () => {
      this.setState({
        modalVisible: true,
      });
    };
   
    //Set modal visibility to false -> close pop up window
    handleCancel = () => {
      this.setState({
        modalVisible: false,
      });
    };
   
    render() {
      const { stay } = this.props;
      const { name, description, address, guest_number } = stay;
      const { modalVisible } = this.state;
      return (
        <>
          <Tooltip title="View Stay Details">
            <Button
              onClick={this.openModal}
              style={{ border: "none" }}
              size="large"
              icon={<InfoCircleOutlined />}
            />
          </Tooltip>
          {/* Create a model when the modalVisible is true */}
          {modalVisible && (
            <Modal
              title={name}
              centered={true}
              visible={modalVisible}
              closable={false}
              footer={null}
              onCancel={this.handleCancel}
            >
              <Space direction="vertical">
                <Text strong={true}>Description</Text>
                <Text type="secondary">{description}</Text>
                <Text strong={true}>Address</Text>
                <Text type="secondary">{address}</Text>
                <Text strong={true}>Guest Number</Text>
                <Text type="secondary">{guest_number}</Text>
              </Space>
            </Modal>
          )}
        </>
      );
    }
}


class MyStays extends React.Component {
    state = {
      loading: false,
      data: [],
    };
   
    componentDidMount() {
      this.loadData();
    }
   
    //Get stay data by host from back end
    loadData = async () => {
      this.setState({
        loading: true,
      });
   
      try {
        const resp = await getStaysByHost();
        this.setState({
          data: resp,
        });
      } catch (error) {
        message.error(error.message);
      } finally {
        this.setState({
          loading: false,
        });
      }
    };
   
    render() {
      return (
        <List
          loading={this.state.loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 3,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={this.state.data}
          renderItem={(item) => (
            <List.Item>
              <Card
                key={item.id}
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Text ellipsis={true} style={{ maxWidth: 350 }}>
                      {item.name}
                    </Text>
                    <StayDetailInfoButton stay={item} />
                  </div>
                }
                actions={[<ViewReservationsButton stay={item} />]}
                extra={
                    <RemoveStayButton
                      stayId={item.id}
                      onRemoveSuccess={() => this.loadData()}
                    />
                }
              >
                {
                  <Carousel
                    dots={false}
                    arrows={true}
                    prevArrow={<LeftOutlined />}
                    nextArrow={<RightOutlined />}
                  >
                    {item.images.map((image, index) => (
                      <div key={index}>
                        <Image src={image.url} width="100%" />
                      </div>
                    ))}
                  </Carousel>
                }
              </Card>
            </List.Item>
          )}
        />
      );
    }
}
  

class HostHomePage extends React.Component {
  render() {
    return (
      <Tabs defaultActiveKey="1" destroyInactiveTabPane={true}>
        <TabPane tab="My Stays" key="1">
          <MyStays />
        </TabPane>
        <TabPane tab="Upload Stay" key="2">
          <UploadStay />
        </TabPane>
      </Tabs>
    );
  }
}
 
export default HostHomePage;