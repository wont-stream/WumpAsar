const { writeFileSync, readFileSync, readdirSync } = require("node:fs");
const { join } = require("node:path");

const stripCode = (code) =>
	code
		.replace(/(^| )\/\/.*$/gm, "")
		.replaceAll("const ", "const~")
		.replaceAll("let ", "let~")
		.replaceAll("var ", "var~")
		.replaceAll("class ", "class~")
		.replace(/get [^=}]/g, (_) => _.replaceAll(" ", "~"))
		.replaceAll("delete ", "delete~")
		.replaceAll(" extends ", "~extends~")
		.replaceAll("typeof ", "typeof~")
		.replaceAll(" of ", "~of~")
		.replaceAll(" in ", "~in~")
		.replaceAll("case ", "case~")
		.replaceAll("await ", "await~")
		.replaceAll("new ", "new~")
		.replaceAll("return ", "return~")
		.replaceAll("function ", "function~")
		.replaceAll("void ", "void~")
		.replaceAll("throw ", "throw~")
		.replaceAll("async ", "async~")
		.replaceAll("else ", "else~")
		.replace("/([0-9]+) files/", "/([0-9]+)~files/")
		// .replaceAll('false', '!1')
		// .replaceAll('true', '!0')
		.replace(/((['"`])[\s\S]*?\2)|[ \n]/g, (_, g1) => g1 || "")
		.replaceAll("~", " ")
		.replaceAll("? ?", "??");

const fixHtml = (code) =>
	code
		.replaceAll(" loop", "~loop")
		.replaceAll(" autoplay", "~autoplay")
		.replaceAll(" src", "~src")
		.replaceAll(" id", "~id");

const stripJs = (path) =>
	writeFileSync(path, stripCode(readFileSync(path, "utf8")));
const stripHtml = (path) =>
	writeFileSync(path, stripCode(fixHtml(readFileSync(path, "utf8"))));

const minJson = (data) => {
	if (data.description) data.description = undefined;

	return data;
};

const stripJson = (path) =>
	writeFileSync(
		path,
		JSON.stringify(minJson(JSON.parse(readFileSync(path, "utf8")))),
	);

const tree = (dirPath) => {
	const files = readdirSync(dirPath);
	for (const x of files) {
		const path = join(dirPath, x);
		console.log(path);

		if (x.endsWith(".js")) {
			stripJs(path);
			continue;
		}
		if (x.endsWith(".json")) {
			stripJson(path);
			continue;
		}
		if (x.endsWith(".html")) {
			stripHtml(path);
			continue;
		}
		if (!x.includes(".")) {
			tree(path);
		}
	}
};

tree(join(__dirname, "..", "src"));
