import Lexer from './Lexer';

let singleQuoteClose = 0;
let doubleQuoteClose = 0;
let bigBracketStartDuplicate = 0;
let bigBracketEndDuplicate = 0;
let smallBracketEndDuplicate = 0;
let commaDuplicate = 0;
let semicolonDuplicate = 0;

class JavascriptLexer extends Lexer {
  constructor(...params) {
    super(...params);
  }

  scan(char) {
    switch (this.status) {
      case 0: {
        switch (char) {
          case '.':
            this.ans.push(this.makeLexer('.'));
            return this.quit();
          case '(':
            this.ans.push(this.makeLexer('smallBracket', '('));
            return this.quit();
          case ')':
            if (smallBracketEndDuplicate === 0) {
              this.ans.push(this.makeLexer('smallBracket', ')'));
              smallBracketEndDuplicate = 1;
              return this.quit();
            } else {
              smallBracketEndDuplicate = 0;
              break;
            }
          case '{':
            if (bigBracketStartDuplicate === 0) {
              this.ans.push(this.makeLexer('bigBracket', '{'));
              bigBracketStartDuplicate = 1;
              return this.quit();
            } else {
              bigBracketStartDuplicate = 0;
              break;
            }
          case '}':
            if (bigBracketEndDuplicate === 0) {
              this.ans.push(this.makeLexer('bigBracket', '}'));
              bigBracketEndDuplicate = 1
              return this.quit();
            } else {
              bigBracketEndDuplicate = 0;
              break;
            }
          case ';':
            if (semicolonDuplicate === 0) {
              this.ans.push(this.makeLexer(';'));
              semicolonDuplicate = 1;
              return this.quit();
            } else {
              semicolonDuplicate = 0;
              break;
            }
          case ':':
            this.ans.push(this.makeLexer(':'));
            return this.quit();
          case ',':
            if (commaDuplicate === 0) {
              this.ans.push(this.makeLexer(','));
              commaDuplicate = 1;
              return this.quit();
            } else {
              commaDuplicate = 0;
              break;
            }
          case '"':
            if (doubleQuoteClose === 0) {
              this.elem = [];
              this.ans.push(this.makeLexer('"'));
              this.status = 2;
              return;
            } else {
              doubleQuoteClose = 0;
            }
          case "'": {
            if (singleQuoteClose === 0) {
              this.elem = [];
              this.ans.push(this.makeLexer("'"));
              this.status = 3;
              return;
            } else {
              singleQuoteClose = 0;
            }
            break;
          }
        }
        const code = char.charCodeAt(0);
        if (
          (code >= 97 && code <= 122) ||
          (code >= 65 && code <= 90) || (code === 95)
        ) {
          this.elem = [];
          this.elem.push(char);
          this.status = 1;
          return;
        }
        break;
      }
      case 1: {
        const code = char.charCodeAt(0);
        if (
          (code >= 97 && code <= 122) ||
          (code >= 65 && code <= 90) ||
          (code > 58 && code <= 64) || (code === 95)
        ) {
          this.elem.push(char);
        } else {
          this.ans.push(this.makeLexer('identifer', this.elem.join('')));
          return this.quit();
        }
        break;
      }
      case 2: {
        if (char === '"') {
          this.ans.push(this.makeLexer('string', this.elem.join('')))
          this.ans.push(this.makeLexer('"'));
          doubleQuoteClose = 1;
          return this.quit();
        } else {
          this.elem.push(char);
        }
        break;
      }
      case 3: {
        if (char === "'") {
          this.ans.push(this.makeLexer('string', this.elem.join('')))
          this.ans.push(this.makeLexer("'"));
          singleQuoteClose = 1;
          return this.quit();
        } else {
          this.elem.push(char);
        }
        break;
      }
      default:
        return this.quit();
    }
  }
}

export default JavascriptLexer;
