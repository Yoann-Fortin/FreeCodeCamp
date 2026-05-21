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
  var BoldRule = class {
    apply(line) {
      return line.replace(/\*\*(.+)\*\*/g, "<strong>$1</strong>").replace(/__(.+?)__/g, "<strong>$1</strong>");
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
  var ItalicRule = class {
    apply(line) {
      return line.replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/_(.+?)_/g, "<em>$1</em>");
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
  var rules = [
    new HeadingRule(),
    new ImageRule(),
    new LinkRule(),
    new BlockquoteRule(),
    new BoldRule(),
    new ItalicRule()
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
