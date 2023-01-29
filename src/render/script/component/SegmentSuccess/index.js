import React from 'react';
import style from './index.module.css';
import Format from '~/render/script/component/Format';

class SegmentSuccess extends React.Component {
  render() {
    const { serial, } = this.props;
    return ([
      <div key={0} className={style.title}>
        <div className={style.titleContent}>
          <b className={style.bold}>Stdout:{serial}</b>
        </div>
      </div>,
      <div key={1} className={style.content}>
        <Format content={this.props.content} />
      </div>,
    ]);
  }
}

export default SegmentSuccess;
