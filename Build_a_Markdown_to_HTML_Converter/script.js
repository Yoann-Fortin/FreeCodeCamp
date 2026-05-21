function convertMarkdown() {
	const markdown = document.querySelector("#markdown-input").value;
	return markdown
		.split("\n")
		.map((line) =>
			line.replace(/^(#{1,6})\s+(.+)$/, (_, hashes, text) => {
				const level = hashes.length;
				return `<h${level}>${text}</h${level}>`;
			}),
		)
		.join("");
}

document.querySelector("#markdown-input").addEventListener("input", () => {
	const html = convertMarkdown();
	document.querySelector("#html-output").textContent = html;
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");
	const preview = document.querySelector("#preview");
	preview.replaceChildren(...doc.body.childNodes);
});