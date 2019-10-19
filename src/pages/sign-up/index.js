import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, Card, Form, Input, Icon, Button, Checkbox } from 'antd';
import { withTranslation } from 'react-i18next';
import { selectLoading } from '../../redux/selectors';
import { handleCaptcha, handleSignUp } from '../../redux/actions/authAction';
import utils from '../../libs/utils';
import './index.less';

const FormItem = Form.Item;

const mapStateToProps = (state) => {
  return {
    isLoading: selectLoading(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleCaptcha: (params) => dispatch(handleCaptcha(params)),
    handleSignUp: (params) => dispatch(handleSignUp(params))
  };
};

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // confirm password
      confirmDirty: false,
      // captcha button
      disabled: false,
      // captcha count
      count: 60
    };
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
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
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  };

  checkTerm = (rule, value, callback) => {
    return callback(value ? undefined : rule.message);
  };

  countDown = () => {
    if (this.state.disabled) {
      this.setState({ count: this.state.count - 1 });
      if (this.state.count < 1) {
        this.setState({
          count: 60,
          disabled: false
        });
      }
    }
  };

  handleCaptchaClick = (e) => {
    const { t } = this.props;
    e.preventDefault();
    this.props.form.validateFields(['mobile'], (err, values) => {
      if (!err && values) {
        this.props
          .handleCaptcha(values)
          .then((res) => {
            if (res === -1) {
              utils.nMessage.error(t('获取验证码失败'));
            } else {
              utils.nMessage.success(t('验证码已发送'));
              this.setState({ disabled: true });
            }
          })
          .catch((err) => {
            utils.nMessage.error(t('获取验证码失败'));
          });
      }
    });
  };

  handleClick = (e) => {
    const { t } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err && values) {
        this.props
          .handleSignUp(values)
          .then((res) => {
            res === -1
              ? utils.nMessage.error(t('注册失败'))
              : utils.nMessage.success(t('注册成功'));
          })
          .catch((err) => {
            utils.nMessage.error(t('注册失败'));
          });
      }
    });
  };

  componentDidMount() {
    this.interval = setInterval(this.countDown, 1000);
  }

  // uninstall the component to prevent the warning of setState of an unmounted component
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { isLoading, t } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        key: 'name',
        required: true,
        emptyMessage: t('请输入用户名'),
        pattern: /([a-zA-Z0-9]|[\u4E00-\u9FA5]){5,12}/,
        errorMessage: t('5-12个字符,只可包含数字和中英文字符'),
        icon: 'user',
        type: 'text',
        placeholder: t('请输入用户名'),
        layout: { sx: 24, sm: 24, md: 24 }
      },
      {
        key: 'mobile',
        required: true,
        emptyMessage: t('请输入手机号码'),
        pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
        errorMessage: t('手机号码格式不正确'),
        icon: 'mobile',
        type: 'text',
        placeholder: t('请输入手机号码'),
        layout: { sx: 24, sm: 24, md: 24 }
      },
      {
        key: 'password',
        required: true,
        emptyMessage: t('请输入密码'),
        pattern: /([a-zA-Z0-9_]){6,13}/,
        errorMessage: t('6-13个字符,只可包含数字字母下划线'),
        validator: this.checkConfirm,
        icon: 'lock',
        type: 'password',
        placeholder: t('请输入密码'),
        layout: { sx: 24, sm: 24, md: 24 }
      },
      {
        key: 'confirmPassword',
        required: true,
        emptyMessage: t('请输入密码'),
        validator: this.checkPassword,
        vMessage: t('密码不一致'),
        icon: 'lock',
        type: 'password',
        placeholder: t('请输入密码'),
        layout: { sx: 24, sm: 24, md: 24 }
      },
      {
        key: 'captcha',
        required: true,
        emptyMessage: t('请输入验证码'),
        icon: 'mail',
        type: 'text',
        placeholder: t('请输入验证码'),
        layout: { sx: 12, sm: 12, md: 12 }
      },
      {
        key: 'term',
        validator: this.checkTerm,
        vMessage: t('请勾选'),
        term: t('同意服务条款及隐私声明'),
        layout: { sx: 24, sm: 24, md: 24 }
      }
    ];
    return (
      <Row type="flex" justify="space-around" className="sign_up_content">
        <Col xs={18} sm={12} md={6} className="sign_up_wrapper">
          <Card className="sign_up_card" title={t('注册')}>
            <Form>
              {formItems.map((item, i) => (
                <FormItem
                  className="form_item"
                  key={i}
                  label={null /*item.label*/}
                >
                  <Row type="flex" justify="space-between" align="middle">
                    <Col
                      xs={item.layout.sx}
                      sm={item.layout.sm}
                      md={item.layout.md}
                    >
                      {item.key !== 'term'
                        ? getFieldDecorator(item.key, {
                            validate: [
                              {
                                trigger: 'onBlur',
                                rules: [
                                  {
                                    required: item.required,
                                    message: item.emptyMessage
                                  }
                                ]
                              },
                              {
                                trigger: ['onBlur', 'onChange'],
                                rules: [
                                  {
                                    pattern: item.pattern,
                                    message: item.errorMessage
                                  },
                                  {
                                    validator: item.validator,
                                    message: item.vMessage
                                  }
                                ]
                              }
                            ]
                          })(
                            <Input
                              prefix={<Icon type={item.icon} />}
                              type={item.type}
                              placeholder={item.placeholder}
                              onBlur={this.handleConfirmBlur}
                            />
                          )
                        : getFieldDecorator(item.key, {
                            validate: [
                              {
                                trigger: ['onBlur', 'onChange'],
                                rules: [
                                  {
                                    validator: item.validator,
                                    message: item.vMessage
                                  }
                                ]
                              }
                            ]
                          })(
                            <Checkbox className="sign_up_check">
                              {item.term}
                            </Checkbox>
                          )}
                    </Col>
                    {item.key === 'captcha' && (
                      <Col xs={10} sm={10} md={10}>
                        <Button
                          className="captcha_button"
                          type="default"
                          onClick={this.handleCaptchaClick}
                          disabled={this.state.disabled}
                        >
                          {!this.state.disabled
                            ? t('验证码')
                            : this.state.count}
                        </Button>
                      </Col>
                    )}
                  </Row>
                </FormItem>
              ))}
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
        </Col>
      </Row>
    );
  }
}

export default Form.create()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(Signup))
);
