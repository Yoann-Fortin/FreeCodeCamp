"use strict";
(() => {
  // Build_a_Markdown_to_HTML_Converter/src/adapters/dom-html-renderer.ts
  var DomHtmlRenderer = class {
    constructor(rawSelector, previewSelector) {
      const raw = document.querySelector(rawSelector);
      const prev = document.querySelector(previewSelector);
      if (!raw) throw new Error(`Element not found: ${rawSelector}`);
      if (!prev) throw new Error(`Element not found: ${previewSelector}`);
      this.rawOutput = raw;
      this.preview = prev;
    }
    renderRaw(html) {
      this.rawOutput.textContent = html;
    }
    renderPreview(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      this.preview.replaceChildren(...doc.body.childNodes);
    }
  };

  // Build_a_Markdown_to_HTML_Converter/src/adapters/dom-markdown-reader.ts
  var DomMarkdownReader = class {
    constructor(selector) {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Element not found: ${selector}`);
      this.input = element;
    }
    read() {
      return this.input.value;
    }
  };

  // Build_a_Markdown_to_HTML_Converter/src/domain/converter-builder.ts
  var ConverterBuilder = class {
    constructor() {
      this.rules = [];
    }
    withRule(rule) {
      this.rules.push(rule);
      return this;
    }
    build() {
      const rules = [...this.rules];
      return (input) => input.split("\n").map(
        (line) => rules.reduce((result, rule) => rule.apply(result), line)
      ).join("");
    }
  };

  // Build_a_Markdown_to_HTML_Converter/src/domain/rules/rule.ts
  var RegexRule = class {
    apply(line) {
      return line.replace(this.pattern, this.replacement);
    }
  };

  // Build_a_Markdown_to_HTML_Converter/src/domain/rules/blockquote.ts
  var BlockquoteRule = class extends RegexRule {
    constructor() {
      super(...arguments);
      this.pattern = /^>\s+(.+)$/;
      this.replacement = "<blockquote>$1</blockquote>";
    }
  };

  // Build_a_Markdown_to_HTML_Converter/src/domain/rules/bold.ts
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

  // Build_a_Markdown_to_HTML_Converter/src/domain/rules/composite.ts
  var CompositeRule = class {
    constructor(...rules) {
      this.rules = rules;
    }
    apply(line) {
      return this.rules.reduce((result, rule) => rule.apply(result), line);
    }
  };

  // Build_a_Markdown_to_HTML_Converter/src/domain/rules/heading.ts
  var HeadingRule = class {
    apply(line) {
      return line.replace(/^(#{1,6})\s+(.+)$/, (_, hashes, text) => {
        const level = hashes.length;
        return `<h${level}>${text}</h${level}>`;
      });
    }
  };

  // Build_a_Markdown_to_HTML_Converter/src/domain/rules/image.ts
  var ImageRule = class extends RegexRule {
    constructor() {
      super(...arguments);
      this.pattern = /!\[(.+?)\]\((.+?)\)/g;
      this.replacement = '<img alt="$1" src="$2">';
    }
  };

  // Build_a_Markdown_to_HTML_Converter/src/domain/rules/italic.ts
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

  // Build_a_Markdown_to_HTML_Converter/src/domain/rules/link.ts
  var LinkRule = class extends RegexRule {
    constructor() {
      super(...arguments);
      this.pattern = /\[(.+?)\]\((.+?)\)/g;
      this.replacement = '<a href="$2">$1</a>';
    }
  };

  // Build_a_Markdown_to_HTML_Converter/src/script.ts
  var reader = new DomMarkdownReader("#markdown-input");
  var renderer = new DomHtmlRenderer("#html-output", "#preview");
  var convert = new ConverterBuilder().withRule(new HeadingRule()).withRule(new ImageRule()).withRule(new LinkRule()).withRule(new BlockquoteRule()).withRule(new CompositeRule(new AsteriskBoldRule(), new UnderscoreBoldRule())).withRule(new CompositeRule(new AsteriskItalicRule(), new UnderscoreItalicRule())).build();
  function convertMarkdown() {
    return convert(reader.read());
  }
  window.convertMarkdown = convertMarkdown;
  var markdownInput = document.querySelector("#markdown-input");
  if (markdownInput) {
    markdownInput.addEventListener("input", () => {
      const html = convertMarkdown();
      renderer.renderRaw(html);
      renderer.renderPreview(html);
    });
  }
})();
