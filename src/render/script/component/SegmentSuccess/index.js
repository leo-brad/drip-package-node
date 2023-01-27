import React from 'react';
import style from './index.module.css';
import Format from '~/render/script/component/Format';

class SegmentSuccess extends React.Component {
  render() {
    const { serial, } = this.props;
    let content;
    switch (serial) {
      case 1:
        content =
          <div key={1} className={[style.content, style.contentFirst].join(' ')}>
            <Format content={this.props.content} />
          </div>
        break;
      default:
        content =
          <div key={1} className={style.content}>
            <Format content={this.props.content} />
          </div>
        break;
    }
    return ([
      <div key={0} className={style.title}>
        <div className={style.titleContent}>
          <b className={style.bold}>Stdout:{serial}</b>
        </div>
      </div>,
      content,
    ]);
  }
}

export default SegmentSuccess;
