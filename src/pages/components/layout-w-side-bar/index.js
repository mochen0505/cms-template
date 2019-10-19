import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout, Menu, Icon, Dropdown, Avatar, Select } from 'antd';
import { withTranslation } from 'react-i18next';
import { selectProfile } from '../../../redux/selectors';
import { handleSignOut } from '../../../redux/actions/authAction';
import { handleProfile } from '../../../redux/actions/profileAction';
import { baseURL } from '../../../configs/url';
import utils from '../../../libs/utils';
import history from '../../../libs/history';
import './index.less';

const mapStateToProps = (state) => {
  return {
    profile: selectProfile(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleSignOut: () => dispatch(handleSignOut()),
    handleProfile: () => dispatch(handleProfile())
  };
};

const { Header, Content, Sider, Footer } = Layout;
const { Option } = Select;

const navBar = [
  { linkTo: 'home', name: 'home', icon: 'home' },
  { linkTo: 'products', name: 'products', icon: 'book' }
];

class LayoutWithSidebar extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      collapsed: false
    };
  }

  handleToggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  handleChange = (value) => {
    const { i18n } = this.props;
    i18n.changeLanguage(value).then();
    localStorage.setItem('language', value);
  };

  handleSignOut = () => {
    const { t } = this.props;
    this.props
      .handleSignOut()
      .then((res) => {
        res === -1
          ? utils.nMessage.error(t('登出失败'))
          : utils.nMessage.success(t('登出成功'));
      })
      .catch((err) => {
        utils.nMessage.error(t('登出失败'));
      });
  };

  componentDidMount() {
    this.props.handleProfile();
  }

  render() {
    const { t } = this.props;
    const { name, avatar } = this.props.profile;
    const menu = (
      <Menu className="header_menu">
        <Menu.Item key="0" onClick={() => history.push('/profile')}>
          {t('个人资料')}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="1" onClick={this.handleSignOut}>
          {t('登出')}
        </Menu.Item>
      </Menu>
    );
    return (
      <Layout className="outer_layout">
        <Sider
          theme="dark"
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          className="nav_bar"
        >
          <div className="logo" />
          <Menu
            theme="dark"
            selectedKeys={navBar.map((item) => {
              if (this.props.location.pathname.split('/')[1] === item.linkTo) {
                return item.name;
              }
              return null;
            })}
            mode="inline"
            className="menu_items"
          >
            {navBar.map((item, index) => (
              <Menu.Item key={item.name}>
                <NavLink to={`/${item.linkTo}`}>
                  <Icon type={item.icon} />
                  <span>{item.name}</span>
                </NavLink>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout className="inner_layout">
          <Header className="header_bar">
            <div className="toggle_wrapper">
              <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.handleToggle}
              />
              <Select
                defaultValue={localStorage.getItem('language') || 'zh_CN'}
                style={{ width: 120 }}
                onChange={this.handleChange}
              >
                <Option value="en_US">ENG</Option>
                <Option value="zh_CN">中文</Option>
              </Select>
            </div>
            <div className="header_right">
              <Dropdown overlay={menu} trigger={['hover']}>
                <div className="user">
                  <div className="name">{name}</div>
                  {avatar ? (
                    <Avatar src={baseURL + avatar} />
                  ) : (
                    <Avatar>{name ? name.substr(0, 1) : ''}</Avatar>
                  )}
                </div>
              </Dropdown>
            </div>
          </Header>
          <Content className="content_wrapper">
            <div className="content">{this.props.children}</div>
          </Content>
          <Footer className="footer">
            demo-react-admin @ https://github.com/mochen0505
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(LayoutWithSidebar))
);
