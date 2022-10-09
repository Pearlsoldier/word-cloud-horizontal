import { kuromoji } from "https://code4fukui.github.io/kuromoji-es/kuromoji.js";
import { ignoreWords } from "./ignoreWords.js";

const tokenizer = await kuromoji.createTokenizer();

export const getWords = (text) => {
  if (Array.isArray(text)) {
    text = text.join("。");
  }
  //const TARGET_POS = ['名詞', '動詞', '形容詞'];
  const TARGET_POS = ["名詞"];
  const NO_CONTENT = "*"; // kuromoji.jsの解析結果の値で特に値がない場合 "*" が設定される
  const tokens = tokenizer.tokenize(text); // テキストを引数にして形態素解析
  const words = tokens
    .filter(t => t.basic_form != NO_CONTENT && TARGET_POS.includes(t.pos) && !ignoreWords.includes(t.basic_form))
    // 単語を抽出(basic_formかsurface_formに単語が存在する)
    .map(t => t.basic_form)
    // [{text: 単語, value: 出現回数}]の形にReduce
    .reduce((data, text) => {
      const target = data.find(c => c.text === text)
      if (target) {
        target.value++;
      } else {
        data.push({ text, value: 1 });
      }
      return data
    }, [])
    .sort((a, b) => b.value - a.value);
  return words;
};
