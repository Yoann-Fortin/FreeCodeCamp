function convertMarkdown() {
	const markdown = document.querySelector("#markdown-input").value;
	return markdown.replace(/^(#{1})\s+(.+)$/gm, "<h1>$2</h1>");
}