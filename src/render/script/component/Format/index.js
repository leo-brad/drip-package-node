import React from 'react';
import style from './index.module.css';

class Format extends React.Component {
  render() {
    const { content, } = this.props;
    const lines = content.split('\n').map((line, key) => {
      return (
        <div className={style.format} key={key}>
          {line}
        </div>
      );
    });
    return lines;
  }
}

export default Format;
