"use strict";
(() => {
  // Build_a_Markdown_to_HTML_Converter/src/rules/rule.ts
  var RegexRule = class {
    apply(line) {
      return line.replace(this.pattern, this.replacement);
    }
  };

  // Build_a_Markdown_to_HTML_Converter/src/rules/blockquote.ts
  var BlockquoteRule = class extends RegexRule {
    constructor() {
      super(...arguments);
      this.pattern = /^>\s+(.+)$/;
      this.replacement = "<blockquote>$1</blockquote>";
    }
  };

  // Build_a_Markdown_to_HTML_Converter/src/rules/bold.ts
  var AsteriskBoldRule = class extends RegexRule {
    constructor() {
      super(...arguments);
      this.pattern = /\*\*(.+)\*\*/g;
      this.replacement = "<strong>$1</strong>";
    }
  };
  var UnderscoreBoldRule = class extends RegexRule {
    constructor() {
      super(...arguments);
      this.pattern = /__(.+?)__/g;
      this.replacement = "<strong>$1</strong>";
    }
  };

  // Build_a_Markdown_to_HTML_Converter/src/rules/composite.ts
  var CompositeRule = class {
    constructor(...rules2) {
      this.rules = rules2;
    }
    apply(line) {
      return this.rules.reduce((result, rule) => rule.apply(result), line);
    }
  };

  // Build_a_Markdown_to_HTML_Converter/src/rules/heading.ts
  var HeadingRule = class {
    apply(line) {
      return line.replace(/^(#{1,6})\s+(.+)$/, (_, hashes, text) => {
        const level = hashes.length;
        return `<h${level}>${text}</h${level}>`;
      });
    }
  };

  // Build_a_Markdown_to_HTML_Converter/src/rules/image.ts
  var ImageRule = class extends RegexRule {
    constructor() {
      super(...arguments);
      this.pattern = /!\[(.+?)\]\((.+?)\)/g;
      this.replacement = '<img alt="$1" src="$2">';
    }
  };

  // Build_a_Markdown_to_HTML_Converter/src/rules/italic.ts
  var AsteriskItalicRule = class extends RegexRule {
    constructor() {
      super(...arguments);
      this.pattern = /\*(.+?)\*/g;
      this.replacement = "<em>$1</em>";
    }
  };
  var UnderscoreItalicRule = class extends RegexRule {
    constructor() {
      super(...arguments);
      this.pattern = /_(.+?)_/g;
      this.replacement = "<em>$1</em>";
    }
  };

  // Build_a_Markdown_to_HTML_Converter/src/rules/link.ts
  var LinkRule = class extends RegexRule {
    constructor() {
      super(...arguments);
      this.pattern = /\[(.+?)\]\((.+?)\)/g;
      this.replacement = '<a href="$2">$1</a>';
    }
  };

  // Build_a_Markdown_to_HTML_Converter/src/script.ts
  var boldRule = new CompositeRule(new AsteriskBoldRule(), new UnderscoreBoldRule());
  var italicRule = new CompositeRule(new AsteriskItalicRule(), new UnderscoreItalicRule());
  var rules = [
    new HeadingRule(),
    new ImageRule(),
    new LinkRule(),
    new BlockquoteRule(),
    boldRule,
    italicRule
  ];
  function convertMarkdown() {
    const input = document.querySelector("#markdown-input");
    if (!input) return "";
    return input.value.split("\n").map(
      (line) => rules.reduce((result, rule) => rule.apply(result), line)
    ).join("");
  }
  window.convertMarkdown = convertMarkdown;
  var markdownInput = document.querySelector("#markdown-input");
  if (markdownInput) {
    markdownInput.addEventListener("input", () => {
      const html = convertMarkdown();
      const htmlOutput = document.querySelector("#html-output");
      if (htmlOutput) htmlOutput.textContent = html;
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const preview = document.querySelector("#preview");
      if (preview) preview.replaceChildren(...doc.body.childNodes);
    });
  }
})();
