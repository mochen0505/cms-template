import React from 'react';
import { connect } from 'react-redux';
import {
  Card,
  Row,
  Col,
  Form,
  Upload,
  Icon
} from 'antd';
import { withTranslation } from 'react-i18next';
import {
  handleProfile,
  handleEditProfile
} from '../../redux/actions/profileAction';
import { selectProfile } from '../../redux/selectors';
import utils from '../../libs/utils';
import { baseURL } from '../../configs/url';
import { matchExtension } from '../../libs/regExp';
import './index.less';
import ProfileForm from './components/profile-form';

const uploadConfigs = {
  fileSize: 2,
  fileType: [ 'png', 'jpeg', 'jpg' ]
};

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

  onEvent = (type, params) => {
    const { handleEditProfile, t } = this.props;
    switch (type) {
      case 'profileSubmit':
        handleEditProfile(params)
          .then((res) => {
            res === -1
              ? utils.nMessage.error(t('保存失败'))
              : utils.nMessage.success(t('保存成功'));
          })
          .catch((err) => {
            utils.nMessage.error(t('保存失败'));
          });
        break;
      default:
        break;
    }
  };

  beforeUpload = (file) => new Promise((resolve, reject) => {
    const { t } = this.props;
    const isLtSize = file.size / 1024 / 1024 < uploadConfigs.fileSize;
    const extension = file.name && file.name.match(matchExtension) && file.name.match(matchExtension)[1];
    if (!isLtSize) {
      utils.nMessage.error(t('超过2MB'));
      reject(file);

    } else if (!uploadConfigs.fileType.includes(extension)) {
      utils.nMessage.error(t('格式错误'));
      reject(file)
    } else {
      resolve(file)
    }
  });

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
    const { profile, t } = this.props;
    const {
      avatar
    } = this.props.profile;

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
            <ProfileForm onEvent={this.onEvent} profile={profile}/>
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
