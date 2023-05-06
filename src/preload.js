const { contextBridge, ipcRenderer } = require("electron");

ipcRenderer.removeAllListeners("udpReceive");

const API = {
  onUdpReceive: callback => ipcRenderer.on("udpReceive", (e, args) => {
    callback(args);
  })
}

contextBridge.exposeInMainWorld("api", API);