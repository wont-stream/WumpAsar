const fs = require("fs");
const { join, resolve, basename } = require("path");

const Constants = require("./Constants");
const reg = (a, c) => require("child_process").execFile("reg.exe", a, c);

const exec = process.execPath;
const app = resolve(exec, "..");
const root = resolve(app, "..");

function updateShortcuts(u) {
  const o = join(app, "app.ico")
  const r = join(root, "app.ico")
  const f = `${Constants.APP_NAME_FOR_HUMANS}.lnk`;
  const P = [
    join(u.getKnownFolder("desktop"), f),
    join(u.getKnownFolder("programs"), Constants.APP_COMPANY, f)
  ];
  if (!fs.existsSync(r)) {
    fs.copyFileSync(o, r);
  }
  for (const p of P) {
    u.createShortcut({
      target_path: join(root, "Update.exe"),
      shortcut_path: p,
      arguments: `--processStart ${basename(exec)}`,
      icon_path: r,
      icon_index: 0,
      description: Constants.APP_DESCRIPTION,
      app_user_model_id: Constants.APP_ID,
      working_directory: app,
    });
  }
}

exports.do = (updater) => {
  const flag = join(app, ".first-run");
  if (fs.existsSync(flag)) return; // Already done, skip

  const proto = Constants.APP_PROTOCOL;
  const base = "HKCU\\Software\\Classes\\" + proto;

  for (const x of [
    [base, "/ve", "/d", `URL:${proto} Protocol`],
    [base, "/v", "URL Protocol"],
    [base + "\\DefaultIcon", "/ve", "/d", `"${exec}",-1`],
    [base + "\\shell\\open\\command", "/ve", "/d", `"${exec}" --url -- "%1"`],
  ])
    reg(["add", ...x, "/f"], (e) => {});

  updateShortcuts(updater);

  try {
    fs.writeFileSync(flag, "");
  } catch (e) {
    log("FirstRun", e);
  }
};
