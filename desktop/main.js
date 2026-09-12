const { app, BrowserWindow } = require("electron");
const path = require("path");

app.setName("EXAPOS");

function createWindow() {
  const win = new BrowserWindow({
    width: 1366,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: "EXAPOS — Point of Sale",
    backgroundColor: "#0F172A",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile(path.join(__dirname, "app", "index.html"));
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => app.quit());
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
