import React from 'react';
import {
  Button,
  Form,
  Input,
  Radio,
  DatePicker,
  Cascader,
} from 'antd';
import { withTranslation } from 'react-i18next';
import '../index.less';
import localeData from './data';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 }
  }
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 7
    }
  }
};

class ProfileForm extends React.Component {
  handleClick = (e) => {
    e.preventDefault();
    const { form, onEvent } = this.props;

    form.validateFields((err, values) => {
      if (!err && values) {
        const params = {
          gender: values['gender'],
          birthday: values['birthday']
            ? values['birthday'].format('YYYY-MM-DD')
            : null,
          province: values['address'][0] || null,
          city: values['address'][1] || null,
          district: values['address'][2] || null,
          county: values['address'][3] || null,
        };
        onEvent('profileSubmit', params);
      }
    });
  };

  getForm = () => {
    const { form, profile } = this.props;
    const {
      name,
      mobile,
      balance,
      gender,
      birthday,
      province,
      city,
      district,
      county,
    } = profile;
    const { getFieldDecorator } = form;

    let formProps = [];
    formProps.name = getFieldDecorator('name', {
      initialValue: name
    });
    formProps.mobile = getFieldDecorator('mobile', {
      initialValue: mobile
    });
    formProps.balance = getFieldDecorator('balance', {
      initialValue: String(balance)
    });
    formProps.gender = getFieldDecorator('gender', {
      initialValue: gender
    });
    formProps.birthday = getFieldDecorator('birthday', {
      initialValue: birthday ? moment(birthday, 'YYYY-MM-DD') : null
    });
    formProps.address = getFieldDecorator('address', {
      initialValue: [province, city, district, county]
    });

    return formProps;
  };

  render() {
    const { t } = this.props;
    const formProps = this.getForm();

    return (
      <Form>
        <FormItem label={t('姓名')} {...formItemLayout}>
          {formProps.name(
            <Input disabled={true}/>
          )}
        </FormItem>
        <FormItem label={t('手机号码')} {...formItemLayout}>
          {formProps.mobile(
            <Input disabled={true}/>
          )}
        </FormItem>
        <FormItem label={t('余额')} {...formItemLayout}>
          {formProps.balance(
            <Input disabled={true}/>
          )}
        </FormItem>
        <FormItem label={t('性别')} {...formItemLayout}>
          {formProps.gender(
            <RadioGroup>
              <Radio value="male">{t('男')}</Radio>
              <Radio value="female">{t('女')}</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem label={t('生日')} {...formItemLayout}>
          {formProps.birthday(
            <DatePicker
              placeholder={t('选择日期')}
              style={{ width: '100%' }}
            />
          )}
        </FormItem>
        <FormItem label={t('所在省市')} {...formItemLayout}>
          {formProps.address(
            <Cascader
              placeholder={t('选择所在省市')}
              options={localeData}
            />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" onClick={this.handleClick}>
            {t('保存')}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(withTranslation()(ProfileForm));
