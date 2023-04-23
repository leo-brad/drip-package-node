import React from 'react';
import style from './index.module.css';

export default function javascriptTemplate(e) {
  const { type, elem, } = e;
  switch (type) {
    case 'identifer':
      return <span className={style.blue}>{elem}</span>
    case 'string':
      return <span className={style.black}>{elem}</span>
    case 'bigBracket':
      return <span className={style.red}>{elem}</span>
    case 'smallBracket':
      return <span className={style.yellow}>{elem}</span>
    case '.':
      return <span className={style.red}>.</span>
    case "'":
      return <span className={style.black}>'</span>
    case ':':
      return <span className={style.yellow}>:</span>
    case ';':
      return <span className={style.black}>;</span>
  }
}
