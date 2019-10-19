import React from 'react';
import dizzy from '../../assets/svgs/dizzy.svg';
import './index.less';

class NoMatch extends React.Component {
  render() {
    return (
      <div className="no_match">
        <embed className="no_match_font" src={dizzy} />
        <div className="no_match_text">404 页面不存在</div>
      </div>
    );
  }
}

export default NoMatch;
