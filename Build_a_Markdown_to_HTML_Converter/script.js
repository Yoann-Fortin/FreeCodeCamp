function convertMarkdown() {
	const markdown = document.querySelector("#markdown-input").value;
	return markdown
		.split("\n")
		.map((line) =>
			line
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
				.replace(/_(.+?)_/g, "<em>$1</em>"),
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