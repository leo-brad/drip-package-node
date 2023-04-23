import React from 'react';
import style from './index.module.css';
import formateJavascript from '~/readme/script/lib/formateJavascript';

class Document extends React.Component {
  render() {
    return(
      <div className={style.document}>
        <h3 className={style.title}>Node</h3>
        <div className={style.description}>
          Node drip package use node script as execute script.Because node.js
          use javascript.Javascript is popular, fast and flexible.And node.js
          library is powerful and fast.
        </div>
        <div className={style.description}>
          You can write node script execute your own task.For example,unit test
          task.
        </div>
        <code className={style.code}>
          {formateJavascript("child_process.execSync('jest ./test', { stdio: 'inherit', });")}
        </code>
      </div>
    );
  }
}

export default Document;
