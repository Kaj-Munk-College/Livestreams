"use strict";

import { app, protocol, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win, secondWin;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

function createWindow(devPath, prodPath) {
  // Create the browser window.
  const window = new BrowserWindow({
    show: true,
    width: devPath == "" ? 800 : 600,
    height: devPath == "" ? 600 : 600,
    minWidth: devPath == "" ? 700 : 200,
    minHeight: devPath == "" ? 500 : 200,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
    },
    titleBarStyle: devPath == "" ? "hiddenInset" : "default",
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    window.loadURL(process.env.WEBPACK_DEV_SERVER_URL + devPath);
    if (!process.env.IS_TEST) window.webContents.openDevTools();
  } else {
    // Load the index.html when not in development
    window.loadURL(`app://./${prodPath}`);
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  } else {
    win = null;
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    win = createWindow("", "index.html");
  }
  // if (secondWin === null) {
  //   secondWin = createWindow("subpage", "subpage.html");
  // }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  if (!process.env.WEBPACK_DEV_SERVER_URL) {
    createProtocol("app");
  }
  win = createWindow("", "index.html");
  // secondWin = createWindow("subpage", "subpage.html");
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
