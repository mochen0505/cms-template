import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, Card, Form, Input, Icon, Button } from 'antd';
import { withTranslation } from 'react-i18next';
import { selectLoading } from '../../redux/selectors';
import { handleSignIn } from '../../redux/actions/authAction';
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
    handleSignIn: (params) => dispatch(handleSignIn(params))
  };
};

class Login extends React.Component {
  handleClick = (e) => {
    const { t } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err && values) {
        this.props
          .handleSignIn(values)
          .then((res) => {
            res === -1
              ? utils.nMessage.error(t('登录失败'))
              : utils.nMessage.success(t('登录成功'));
          })
          .catch((err) => {
            utils.nMessage.error(t('登录失败'));
          });
      }
    });
  };

  render() {
    const { isLoading, t } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        key: 'mobile',
        required: true,
        emptyMessage: t('请输入手机号码'),
        pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
        errorMessage: t('手机号码格式不正确'),
        icon: 'mobile',
        type: 'text',
        placeholder: t('请输入手机号码')
      },
      {
        key: 'password',
        required: true,
        emptyMessage: t('请输入密码'),
        pattern: '',
        errorMessage: '',
        icon: 'lock',
        type: 'password',
        placeholder: t('请输入密码')
      }
    ];
    return (
      <Row type="flex" justify="space-around" className="login_content">
        <Col xs={0} sm={0} md={10} className="login_intro">
          <h2>DEMO REACT ADMIN</h2>
          <p>demo react admin</p>
        </Col>
        <Col xs={18} sm={12} md={6} className="login_wrapper">
          <Card className="login_card" title={t('登录')}>
            <Form>
              {formItems.map((item, i) => (
                <FormItem
                  className="form_item"
                  key={i}
                  label={null /*item.label*/}
                >
                  {getFieldDecorator(item.key, {
                    validate: [
                      {
                        trigger: ['onBlur'],
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
                          { pattern: item.pattern, message: item.errorMessage }
                        ]
                      }
                    ]
                  })(
                    <Input
                      addonBefore={<Icon type={item.icon} />}
                      type={item.type}
                      placeholder={item.placeholder}
                      onPressEnter={this.handleClick}
                    />
                  )}
                </FormItem>
              ))}
              <FormItem className="login_button">
                <Button
                  type="primary"
                  onClick={this.handleClick}
                  loading={isLoading}
                >
                  {t('登录')}
                </Button>
              </FormItem>
            </Form>
            <Link className="login_footer" to="/signup">
              {t('免费注册')}
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
  )(withTranslation()(Login))
);
