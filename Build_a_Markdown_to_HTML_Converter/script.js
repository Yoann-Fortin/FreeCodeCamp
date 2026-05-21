function convertMarkdown() {
	const markdown = document.querySelector("#markdown-input").value;
	return markdown.replace(/^(#{1})\s+(.+)$/gm, "<h1>$2</h1>");
}

document.querySelector("#markdown-input").addEventListener("input", () => {
	const html = convertMarkdown();
	document.querySelector("#html-output").textContent = html;
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");
	const preview = document.querySelector("#preview");
	preview.replaceChildren(...doc.body.childNodes);
});