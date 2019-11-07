import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import { withTranslation } from 'react-i18next';
import { selectLoading } from '../../redux/selectors';
import { handleSignIn } from '../../redux/actions/authAction';
import LoginForm from './components/login-form';
import utils from '../../libs/utils';
import './index.less';

const mapStateToProps = (state) => {
  return {
    isLoading: selectLoading(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleSignIn: (params) => dispatch(handleSignIn(params))
  };
};

class Login extends React.Component {
  onEvent = (type, params) => {
    const { handleSignIn, t } = this.props;

    switch (type) {
      case 'loginSubmit':
        handleSignIn(params)
          .then((res) => {
            res === -1
              ? utils.nMessage.error(t('登录失败'))
              : utils.nMessage.success(t('登录成功'));
          })
          .catch((err) => {
            utils.nMessage.error(t('登录失败'));
          });
        break;
      default:
        break;
    }
  };

  render() {
    const { isLoading } = this.props;

    return (
      <Row type="flex" justify="space-around" className="login_content">
        <Col xs={0} sm={0} md={10} className="login_intro">
          <h2>DEMO REACT ADMIN</h2>
          <p>demo react admin</p>
        </Col>
        <Col xs={18} sm={12} md={6} className="login_wrapper">
          <LoginForm onEvent={this.onEvent} isLoading={isLoading} />
        </Col>
      </Row>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Login));
