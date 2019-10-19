import React from 'react';
import { Layout, Select } from 'antd';
import { withTranslation } from 'react-i18next';
import './index.less';

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class LayoutWithoutSidebar extends React.Component {
  handleChange = (value) => {
    const { i18n } = this.props;
    i18n.changeLanguage(value).then();
    localStorage.setItem('language', value);
  };

  render() {
    return (
      <Layout className="no_side_bar_layout">
        <Header className="header">
          <div className="logo_wrapper">
            <div className="logo" />
          </div>
          <Select
            defaultValue={localStorage.getItem('language') || 'zh_CN'}
            style={{ width: 120 }}
            onChange={this.handleChange}
          >
            <Option value="en_US">ENG</Option>
            <Option value="zh_CN">中文</Option>
          </Select>
        </Header>
        <Content className="content_wrapper">{this.props.children}</Content>
        <Footer className="footer">
          demo-react-admin @ https://github.com/mochen0505
        </Footer>
      </Layout>
    );
  }
}

export default withTranslation()(LayoutWithoutSidebar);
