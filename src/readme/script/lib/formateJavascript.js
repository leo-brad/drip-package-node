import HighLight from '~/readme/script/class/HighLight';
import JavascriptLexer from '~/readme/script/class/lexer/JavascriptLexer';
import javascriptTemplate from '~/readme/script/lib/template/javascriptTemplate';

export default function formateJavascript(code) {
  const highLight = new HighLight();
  highLight.addLexer(JavascriptLexer);
  return highLight.parse(code).map((e) => javascriptTemplate(e));
}
