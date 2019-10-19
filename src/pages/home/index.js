import React from 'react';
import { Row, Col, Card } from 'antd';
import './index.less';

class Home extends React.Component {
  render() {
    const dashCards = [{}, {}, {}, {}];
    return (
      <div className="home_content">
        <Row type="flex" justify="space-between" gutter={16}>
          {dashCards.map((item, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card bordered={false} className="dashboard_card">
                <Row
                  type="flex"
                  justify="space-between"
                  gutter={16}
                  className="card_content"
                >
                  <Col xs={12} sm={12} md={12} className="left" />
                  <Col xs={12} sm={12} md={12} className="right" />
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
        <Row type="flex" justify="space-between" gutter={16}>
          <Col xs={24} sm={24} md={18}>
            <Card bordered={false} className="chart" />
          </Col>
          <Col xs={24} sm={24} md={6}>
            <Card bordered={false} className="upper" />
            <Card bordered={false} className="lower" />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
