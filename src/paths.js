const { join, dirname, basename } = require("node:path");
const fs = require("node:fs");
const { app } = require("electron");

const buildInfo = require("./utils/buildInfo");

let userData;
let userDataVersioned;
let resourcesPath;
let moduleData;
let exeDir;
let installPath;

exports.getUserData = () => userData;
exports.getUserDataVersioned = () => userDataVersioned;

exports.getResources = () => resourcesPath;
exports.getModuleDataPath = () => moduleData;
exports.getInstallPath = () => installPath;

exports.getExeDir = () => exeDir;

exports.init = () => {
	const appDir = `discord${buildInfo.releaseChannel === "stable" ? "" : buildInfo.releaseChannel}`; // Clean channel naming up later to util?
	userData =
		process.env.DISCORD_USER_DATA_DIR ?? join(app.getPath("appData"), appDir);
	userDataVersioned = join(userData, buildInfo.version);

	exeDir = dirname(app.getPath("exe"));
	if (basename(exeDir).startsWith("app-")) installPath = join(exeDir, "..");

	moduleData = buildInfo.newUpdater
		? join(userData, "module_data")
		: join(userDataVersioned, "modules");
	resourcesPath = join(process.resourcesPath);

	global.moduleDataPath = moduleData; // Global because discord
	app.setPath("userData", userData); // Set userData properly because electron
};
