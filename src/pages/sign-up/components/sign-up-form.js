import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Form, Input, Icon, Button, Row, Col, Checkbox } from 'antd';
import { withTranslation } from 'react-i18next';
import '../index.less';

const FormItem = Form.Item;

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // confirm password
      confirmDirty: false,
      // captcha count
      count: 60
    };
    this.interval = null;
  }

  handleConfirmBlur = (e) => {
    const { confirmDirty } = this.state;
    const value = e.target.value;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(rule.message);
    } else {
      callback();
    }
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    const { confirmDirty } = this.state;
    if (value && confirmDirty) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  };

  checkTerm = (rule, value, callback) => {
    return callback(value ? undefined : rule.message);
  };

  countDown = () => {
    const { onEvent, disabled } = this.props;
    const { count } = this.state;
    if (disabled) {
      this.setState({ count: count - 1 });
      if (count < 1) {
        this.setState({
          count: 60,
        });
        onEvent('resetCaptchaButton', false)
      }
    }
  };

  handleCaptchaClick = (e) => {
    const { onEvent, form } = this.props;
    e.preventDefault();
    form.validateFields(['mobile'], (err, values) => {
      if (!err && values) {
        onEvent('signUpCaptchaSubmit', values)
      }
    });
  };

  handleClick = (e) => {
    e.preventDefault();
    const { form, onEvent } = this.props;

    form.validateFields((err, values) => {
      if (!err && values) {
        onEvent('signUpSubmit', values);
      }
    });
  };

  getForm = () => {
    const { t } = this.props;
    const { getFieldDecorator } = this.props.form;

    let formProps = [];
    formProps.name = getFieldDecorator('name', {
      rules: [
        { required: true, message: t('请输入用户名') },
        { pattern: /([a-zA-Z0-9]|[\u4E00-\u9FA5]){5,12}/, message: t('5-12个字符,只可包含数字和中英文字符') }
      ]
    });
    formProps.mobile = getFieldDecorator('mobile', {
      rules: [
        { required: true, message: t('请输入手机号码') },
        { pattern: /^1\d{10}$/, message: t('手机号码格式不正确') }
      ]
    });
    formProps.password = getFieldDecorator('password', {
      rules: [
        { required: true, message: t('请输入密码') },
        { pattern: /([a-zA-Z0-9_]){6,13}/, message: t('6-13个字符,只可包含数字字母下划线') },
        { validator: this.checkConfirm }
      ]
    });
    formProps.confirmPassword = getFieldDecorator('confirmPassword', {
      rules: [
        { required: true, message: t('请输入密码') },
        { validator: this.checkPassword, message: t('密码不一致') }
      ]
    });
    formProps.captcha = getFieldDecorator('captcha', {
      rules: [
        { required: true, message: t('请输入验证码') },
      ]
    });
    formProps.term = getFieldDecorator('term', {
      rules: [
        { validator: this.checkTerm, message: t('请勾选') }
      ]
    });

    return formProps;
  };

  componentDidMount() {
    this.interval = setInterval(this.countDown, 1000);
  }

  // uninstall the component to prevent the warning of setState of an unmounted component
  componentWillUnmount() {
    const { onEvent } = this.props;
    clearInterval(this.interval);
    onEvent('resetCaptchaButton', false)
  }

  render() {
    const { isLoading, disabled, t } = this.props;
    const { count } = this.state;
    const formProps = this.getForm();

    return (
      <Card className="login_card" title={t('登录')}>
        <Form>
          <FormItem className="form_item" label={null}>
            {formProps.name(
              <Input
                addonBefore={<Icon type="user" />}
                type="text"
                placeholder={t('请输入用户名')}
              />
            )}
          </FormItem>
          <FormItem className="form_item" label={null}>
            {formProps.mobile(
              <Input
                addonBefore={<Icon type="mobile" />}
                type="text"
                placeholder={t('请输入手机号码')}
              />
            )}
          </FormItem>
          <FormItem className="form_item" label={null}>
            {formProps.password(
              <Input
                addonBefore={<Icon type="lock" />}
                type="password"
                placeholder={t('请输入密码')}
                onBlur={this.handleConfirmBlur}
              />
            )}
          </FormItem>
          <FormItem className="form_item" label={null}>
            {formProps.confirmPassword(
              <Input
                addonBefore={<Icon type="lock" />}
                type="password"
                placeholder={t('请输入密码')}
              />
            )}
          </FormItem>
          <FormItem className="form_item" label={null}>
            <Row type="flex" justify="space-between" align="middle">
              <Col xs={12} sm={12} md={12}>
                {formProps.captcha(
                  <Input
                    addonBefore={<Icon type="mail" />}
                    type="text"
                    placeholder={t('请输入验证码')}
                  />
                )}
              </Col>
              <Col xs={10} sm={10} md={10}>
                <Button
                  className="captcha_button"
                  type="default"
                  onClick={this.handleCaptchaClick}
                  disabled={disabled}
                >
                  {!disabled
                    ? t('验证码')
                    : count}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem className="form_item" label={null}>
            {formProps.term(
              <Checkbox className="sign_up_check">
                {t('同意服务条款及隐私声明')}
              </Checkbox>
            )}
          </FormItem>
          <FormItem className="sign_up_button">
            <Button
              type="primary"
              onClick={this.handleClick}
              loading={isLoading}
            >
              {t('注册')}
            </Button>
          </FormItem>
        </Form>
        <Link className="sign_up_footer" to="/login">
          {t('已经注册？立即登录')}
        </Link>
      </Card>
    );
  }
}

export default Form.create()(withTranslation()(SignUpForm));
