// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Card, Form, Input, Icon, Button } from 'antd';
import { withTranslation } from 'react-i18next';
import '../index.less';

const FormItem = Form.Item;

type Props = {
  form: Object,
  onEvent: Function,
  isLoading: boolean,
  t: Function
};

class LoginForm extends React.Component<Props> {
  handleClick = (e) => {
    e.preventDefault();
    const { form, onEvent } = this.props;

    form.validateFields((err, values) => {
      if (!err && values) {
        onEvent('loginSubmit', values);
      }
    });
  };

  getForm = () => {
    const { form, t } = this.props;
    const { getFieldDecorator } = form;

    let formProps = {};
    formProps.mobile = getFieldDecorator('mobile', {
      rules: [
        { required: true, message: t('请输入手机号码') },
        { pattern: /^1\d{10}$/, message: t('手机号码格式不正确') }
      ]
    });

    formProps.password = getFieldDecorator('password', {
      rules: [{ required: true, message: t('请输入密码') }]
    });

    return formProps;
  };

  render() {
    const { isLoading, t } = this.props;
    const formProps = this.getForm();

    return (
      <Card className="login_card" title={t('登录')}>
        <Form>
          <FormItem className="form_item" label={null}>
            {formProps.mobile(
              <Input
                addonBefore={<Icon type="mobile" />}
                type="text"
                placeholder={t('请输入手机号码')}
                onPressEnter={this.handleClick}
              />
            )}
          </FormItem>
          <FormItem className="form_item" label={null}>
            {formProps.password(
              <Input
                addonBefore={<Icon type="lock" />}
                type="password"
                placeholder={t('请输入密码')}
                onPressEnter={this.handleClick}
              />
            )}
          </FormItem>
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
    );
  }
}

export default Form.create()(withTranslation()(LoginForm));
