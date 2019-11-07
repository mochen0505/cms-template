import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import { withTranslation } from 'react-i18next';
import { selectLoading, selectCaptchaButton } from '../../redux/selectors';
import { handleCaptcha, disableCaptcha, handleSignUp } from '../../redux/actions/authAction';
import SignUpForm from './components/sign-up-form';
import utils from '../../libs/utils';
import './index.less';

const mapStateToProps = (state) => {
  return {
    isLoading: selectLoading(state),
    isDisabled: selectCaptchaButton(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleCaptcha: (params) => dispatch(handleCaptcha(params)),
    handleCaptchaButton: (params) => dispatch(disableCaptcha(params)),
    handleSignUp: (params) => dispatch(handleSignUp(params))
  };
};

class SignUp extends React.Component {
  onEvent = (type, params) => {
    const { handleCaptcha, handleCaptchaButton, handleSignUp, t } = this.props;

    switch (type) {
      case 'signUpCaptchaSubmit':
        handleCaptcha(params)
          .then((res) => {
            if (res === -1) {
              utils.nMessage.error(t('获取验证码失败'));
            } else {
              utils.nMessage.success(t('验证码已发送'));
            }
          })
          .catch((err) => {
            utils.nMessage.error(t('获取验证码失败'));
          });
        break;
      case 'resetCaptchaButton':
        handleCaptchaButton(false);
        break;
      case 'signUpSubmit':
        handleSignUp(params)
          .then((res) => {
            res === -1
              ? utils.nMessage.error(t('注册失败'))
              : utils.nMessage.success(t('注册成功'));
          })
          .catch((err) => {
            utils.nMessage.error(t('注册失败'));
          });
        break;
      default:
        break;
    }
  };

  render() {
    const { isDisabled, isLoading } = this.props;

    return (
      <Row type="flex" justify="space-around" className="sign_up_content">
        <Col xs={18} sm={12} md={6} className="sign_up_wrapper">
          <SignUpForm
            onEvent={this.onEvent} isLoading={isLoading} disabled={isDisabled}
          />
        </Col>
      </Row>
    );
  }
}

export default
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(SignUp))
;
