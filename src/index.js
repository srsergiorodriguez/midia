const { app, BrowserWindow, Menu, shell } = require('electron');
const { join } = require("path");
const dgram = require('dgram');

function createWindow() {
  const win = new BrowserWindow({
    width: 330,
    height: 900,
    webPreferences: {
      preload: join(__dirname, "./preload.js")
    }
  })

  if (process.env.NODE_ENV !== 'development') {
    win.loadFile(`${__dirname}/renderer/dist/index.html`);
  } else {
    console.log('Development mode');
    win.webContents.openDevTools();
    win.loadURL('http://localhost:3000/');
  }

  // UDP

  const server = dgram.createSocket('udp4');
  server.on('message', (msg, rinfo) => {
    // console.log(msg, ""+msg)
    win.webContents.send("udpReceive", ""+msg);
  });

  server.bind(49161);
}

app.whenReady()
  .then(() => {
    createWindow();

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
  })

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// MENU

const menu = [
  {label: '*', submenu: [
    {
      label: "About",
      click: () => shell.openExternal('https://srsergiorodriguez.github.io/'),
    },
    {
      label: "SRG's portfolio",
      click: () => shell.openExternal('https://srsergiorodriguez.github.io/'),
    },
    { type: 'separator' },
    { role: 'toggledevtools' },
    { type: 'separator' },
    { role: 'hide' },
    { role: 'togglefullscreen' },
    { role: 'reload' },
    { role: 'quit' }
  ]},
  {label: 'Edit', submenu: [
    {role: 'copy'},
    {role: 'paste'},
    {type: 'separator'},
    {label: 'Test1', click: () => {console.log("TEST")}},
    {label: 'Test2', click: () => {console.log("TEST")}},
  ]},
  {label: 'Midi', submenu: [
    {label: 'Test1', click: () => {console.log("TEST")}},
    {label: 'Test2', click: () => {console.log("TEST")}},
  ]}
]


