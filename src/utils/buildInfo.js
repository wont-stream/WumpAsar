// Use JSON parse for vaguely more security-ish
module.exports = JSON.parse(
	require("node:fs").readFileSync(
		require("node:path").join(process.resourcesPath, "build_info.json"),
		"utf8",
	),
);
