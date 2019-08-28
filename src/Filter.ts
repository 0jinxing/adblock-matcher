import CommentFilter from "./CommentFilter";
import RegExpFilter from "./RegExpFilter";

export default class Filter {
  subscriptions: string[] = [];

  static knownFilters = Object.create(null);
  static elemhideRegExp = /^([^\/\*\|\@"!]*?)#(\@)?(?:([\w\-]+|\*)((?:\([\w\-]+(?:[$^*]?=[^\(\)"]*)?\))*)|#([^{}]+))$/;
  static regexpRegExp = /^(@@)?\/.*\/(?:\$~?[\w\-]+(?:=[^,\s]+)?(?:,~?[\w\-]+(?:=[^,\s]+)?)*)?$/;
  static optionsRegExp = /\$(~?[\w\-]+(?:=[^,\s]+)?(?:,~?[\w\-]+(?:=[^,\s]+)?)*)$/;

  constructor(public text: string) {}

  toString() {
    return this.text;
  }

  static fromText(text: string) {
    if (text in Filter.knownFilters) {
      return Filter.knownFilters[text];
    }
    let ret: Filter;
    if (text.charAt(0) == "!") {
      ret = new CommentFilter(text);
    } else {
      ret = RegExpFilter.fromText(text);
    }
    Filter.knownFilters[ret.text] = ret;
    return ret;
  }
}
