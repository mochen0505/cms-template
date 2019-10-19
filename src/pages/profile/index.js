import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  Input,
  Radio,
  DatePicker,
  Cascader,
  Upload,
  Icon
} from 'antd';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import {
  handleProfile,
  handleEditProfile
} from '../../redux/actions/profileAction';
import { selectProfile } from '../../redux/selectors';
import options from './locale-data';
import utils from '../../libs/utils';
import { baseURL } from '../../configs/url';
import './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const mapStateToProps = (state) => {
  return {
    profile: selectProfile(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleProfile: () => dispatch(handleProfile()),
    handleEditProfile: (params) => dispatch(handleEditProfile(params))
  };
};

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      picLoading: false
    };
  }

  handleClick = (e) => {
    const { t } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err && values) {
        const params = {
          gender: values['gender'],
          birthday: values['birthday']
            ? values['birthday'].format('YYYY-MM-DD')
            : null,
          province: values['provinceAndCity'][0] || null,
          city: values['provinceAndCity'][1] || null
        };
        this.props
          .handleEditProfile(params)
          .then((res) => {
            res === -1
              ? utils.nMessage.error(t('保存失败'))
              : utils.nMessage.success(t('保存成功'));
          })
          .catch((err) => {
            utils.nMessage.error(t('保存失败'));
          });
      }
    });
  };

  preProcessingLocale = (options) => {
    for (let province of options) {
      if (province.children) {
        for (let city of province.children) {
          if (city.children && city.children.length === 0) {
            delete city.children;
          }
        }
      }
    }
    return options;
  };

  beforeUpload = (file) => {
    const { t } = this.props;
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      utils.nMessage.error(t('只能上传JPG'));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      utils.nMessage.error(t('超过2MB'));
    }
    return isJPG && isLt2M;
  };

  handleChange = (info) => {
    const { t } = this.props;
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          imageUrl,
          loading: false
        })
      );
      utils.nMessage.success(t('上传成功'));
      this.props.handleProfile();
    }
    if (info.file.status === 'error') {
      utils.nMessage.error(t('上传失败'));
    }
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  componentDidMount() {
    this.props.handleProfile();
  }

  render() {
    const { t } = this.props;
    const {
      name,
      mobile,
      balance,
      gender,
      birthday,
      province,
      city,
      avatar
    } = this.props.profile;
    const { getFieldDecorator } = this.props.form;
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
    const formItems = [
      {
        label: t('姓名'),
        key: 'name',
        initialValue: name,
        disabled: true
      },
      {
        label: t('手机号码'),
        key: 'mobile',
        initialValue: mobile,
        disabled: true
      },
      {
        label: t('余额'),
        key: 'balance',
        initialValue: String(balance),
        disabled: true
      }
    ];
    const uploadButton = (
      <div>
        <Icon type={this.state.picLoading ? 'loading' : 'plus'} />
        <div>{t('上传')}</div>
      </div>
    );
    return (
      <Card bordered={false} className="profile">
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={8}>
            <Form>
              {formItems.map((item, i) => (
                <FormItem key={i} label={item.label} {...formItemLayout}>
                  {getFieldDecorator(item.key, {
                    initialValue: item.initialValue,
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
                          { pattern: item.pattern, message: item.errorMessage },
                          { validator: item.validator, message: item.vMessage }
                        ]
                      }
                    ]
                  })(
                    <Input
                      type={item.type}
                      placeholder={item.placeholder}
                      disabled={item.disabled}
                    />
                  )}
                </FormItem>
              ))}
              <FormItem label={t('性别')} {...formItemLayout}>
                {getFieldDecorator('gender', {
                  initialValue: gender
                })(
                  <RadioGroup>
                    <Radio value="male">{t('男')}</Radio>
                    <Radio value="female">{t('女')}</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              <FormItem label={t('生日')} {...formItemLayout}>
                {getFieldDecorator('birthday', {
                  initialValue: birthday ? moment(birthday, 'YYYY-MM-DD') : null
                })(
                  <DatePicker
                    placeholder={t('选择日期')}
                    style={{ width: '100%' }}
                  />
                )}
              </FormItem>
              <FormItem label={t('所在省市')} {...formItemLayout}>
                {getFieldDecorator('provinceAndCity', {
                  initialValue: [province, city]
                })(
                  <Cascader
                    placeholder={t('选择所在省市')}
                    options={this.preProcessingLocale(options)}
                  />
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" onClick={this.handleClick}>
                  {t('保存')}
                </Button>
              </FormItem>
            </Form>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar"
              showUploadList={false}
              action={baseURL + 'users/avatarEdit'}
              headers={{
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }}
              beforeUpload={this.beforeUpload}
              onChange={this.handleChange}
            >
              {avatar ? <img src={baseURL + avatar} alt="" /> : uploadButton}
            </Upload>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default Form.create()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(Profile))
);
