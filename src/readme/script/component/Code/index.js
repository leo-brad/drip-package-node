import React from 'react';
import style from './index.module.css';
import formateJavascript from '~/readme/script/lib/formateJavascript';

class Code extends React.Component {
  render() {
    return(
      <code className={style.code}>
        {formateJavascript(this.props.children)}
      </code>
    );
  }
}

export default Code;
