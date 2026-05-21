"use strict";
function convertMarkdown() {
    const input = document.querySelector("#markdown-input");
    if (!input)
        return "";
    const markdown = input.value;
    return markdown
        .split("\n")
        .map((line) => line
        .replace(/^(#{1,6})\s+(.+)$/, (_, hashes, text) => {
        const level = hashes.length;
        return `<h${level}>${text}</h${level}>`;
    })
        .replace(/!\[(.+?)\]\((.+?)\)/g, '<img alt="$1" src="$2">')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
        .replace(/^>\s+(.+)$/, "<blockquote>$1</blockquote>")
        .replace(/\*\*(.+)\*\*/g, "<strong>$1</strong>")
        .replace(/__(.+?)__/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/_(.+?)_/g, "<em>$1</em>"))
        .join("");
}
// expose on window for FreeCodeCamp tests
window.convertMarkdown = convertMarkdown;
const markdownInput = document.querySelector("#markdown-input");
if (markdownInput) {
    markdownInput.addEventListener("input", () => {
        const html = convertMarkdown();
        const htmlOutput = document.querySelector("#html-output");
        if (htmlOutput)
            htmlOutput.textContent = html;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const preview = document.querySelector("#preview");
        if (preview)
            preview.replaceChildren(...doc.body.childNodes);
    });
}
