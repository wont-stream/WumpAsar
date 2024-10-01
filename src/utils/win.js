module.exports = (o, n) => {
	const w = new (require("electron").BrowserWindow)({
		frame: false,
		resizable: false,
		center: true,
		backgroundColor: "#2f3136",
		webPreferences: {
			preload: require("node:path").join(__dirname, "..", n, "preload.js"),
		},
		...o,
	});

	const c = w.webContents;
	c.once("dom-ready", () => {
		if (oaConfig.themeSync !== false)
			try {
				c.insertCSS(
					JSON.parse(
						require("node:fs").readFileSync(
							require("node:path").join(
								require("../paths").getUserData(),
								"userDataCache.json",
							),
							"utf8",
						),
					).openasarSplashCSS,
				);
			} catch {}
	});

	w.loadURL(`https://cdn.openasar.dev/${n}`);

	return w;
};
