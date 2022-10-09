import { createWordCloud } from "./createWordCloud.js";
import { getWords } from "./getWords.js";
const IMPORT_XML = "https://js.sabae.cc/XML.js";

export class WordCloud extends HTMLElement {
  constructor(data) {
    super();
    const src = this.getAttribute("src");
    if (src) {
      this.load(src);
    } else {
      const s = data || this.textContent;
      this.textContent = "";
      const words = getWords(s);
      console.log(s, words)
      createWordCloud(this, words);
    }
  }
  async load(src) {
    if (src.endsWith(".xml")) {
      const { XML } = await import(IMPORT_XML);
      const xml = await (await fetch(src)).text();
      const data = XML.toJSON(xml);
      //console.log(data);
      const items = data?.rss?.channel?.item;
      if (items) {
        //console.log(items);
        const list = [];
        //for (const item of items) {
        for (let i = 0; i < Math.min(items.length, 100); i++) {
          const item = items[i];
          list.push(item.title["#text"]);
          list.push(item.description["#text"]);
        }
        const words = getWords(list);
        //console.log(words)
        createWordCloud(this, words);
      } else {
        throw new Error("not RSS");
      }
    } else if (src.endsWith(".json")) {
      const data = await (await fetch(src)).json();
      const list = data.map(d => d.title + "。" + d.body);
      const words = getWords(list);
      //console.log(list, words);
      createWordCloud(this, words);
    } else {
      throw new Error("not supported type: " + src);
    }
  }
}

customElements.define("word-cloud", WordCloud);
