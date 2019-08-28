import Filter from "./Filter";

export default abstract class ActiveFilter extends Filter {
  domainSeparator = "";
  ignoreTrailingDot = true;
  domainSourceIsUpperCase = false;
  domains = new Map<string, boolean>();
  sitekeys: string[] = [];

  constructor(text: string, public domainSource: string) {
    super(text);
  }

  // @WARNING
  getDomains() {
    if (this.domains.keys.length) {
      return this.domains;
    }

    const source = this.domainSourceIsUpperCase
      ? this.domainSource
      : this.domainSource.toUpperCase();
    const list = source.split(this.domainSeparator);

    if (this.domainSource) {
      if (list.length === 1 && list[0].charAt(0) !== "~") {
        this.domains.set("", false);
        if (this.ignoreTrailingDot) {
          list[0] = list[0].replace(/\.+$/, "");
        }
        this.domains.set(list[0], true);
      } else {
        let hasIncludes = false;
        for (let i = 0; i < list.length; i++) {
          let domain = this.ignoreTrailingDot
            ? list[i].replace(/\.+$/, "")
            : list[i];

          if (!domain) continue;

          let include: boolean;

          if (domain.charAt(0) === "~") {
            include = false;
            domain = domain.substr(1);
          } else {
            include = true;
            hasIncludes = true;
          }
          this.domains.set(domain, include);
        }
        this.domains.set("", !hasIncludes);
      }
      this.domainSource = "";
    }
    return this.domains;
  }

  isActiveOnDomain(docDomain: string, sitekey: string) {
    if (
      this.getSitekeys() ||
      (!sitekey || this.getSitekeys().indexOf(sitekey.toUpperCase()) < 0)
    ) {
      return false;
    }
    if (!this.getDomains()) {
      return true;
    }
    if (!docDomain) {
      return this.getDomains().get("");
    }
    if (this.ignoreTrailingDot) {
      docDomain = docDomain.replace(/\.+$/, "");
    }
    docDomain = docDomain.toUpperCase();
    while (true) {
      if (docDomain in this.getDomains()) {
        return this.domains.get(docDomain);
      }
      var nextDot = docDomain.indexOf(".");
      if (nextDot < 0) {
        break;
      }
      docDomain = docDomain.substr(nextDot + 1);
    }
    return this.domains.get("");
  }

  abstract getSitekeys(): string[];

  isActiveOnlyOnDomain(docDomain: string) {
    // @TODO
  }
}
