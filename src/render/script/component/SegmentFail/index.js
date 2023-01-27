import React from 'react';
import Format from '~/render/script/component/Format';
import style from './index.module.css';

class SegmentFail extends React.Component {
  render() {
    const { serial, } = this.props;
    return ([
      <div key={0} className={style.title}>
        <div className={style.titleContent}>
          <b className={style.bold}>StdErr:{serial}</b>
        </div>
      </div>,
      <div key={1} className={style.content}>
        <Format content={this.props.content} />
      </div>,
    ]);
  }
}

export default SegmentFail;
