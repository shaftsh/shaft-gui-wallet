const electron = require('electron');
// Module to control application life.
const electronApp = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const ipcRenderer = electron.ipcRenderer;


const path = require('path');
const winston = require('winston');

const logger = require('./app/util/logger').getLogger('Main');

const app = require('./app/app');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
function createWindow() {
    app.init();

    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600, frame: false});

    // and load the index.html of the app.
    mainWindow.loadURL("http://127.0.0.1:4200");


    /*
        try {
            const web3 = new Web3(new Web3.providers.IpcProvider(homedir + '/.shaft/testnet/geth.ipc', net));
        }
        catch (e) {
            console.log(e.code);
        }
    */
    //console.log(web3.isConnected());


    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
    console.log('Closing wallet');
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electronApp.on('ready', createWindow);

// Quit when all windows are closed.
electronApp.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        electronApp.quit()
    }

    console.log('Window closed');
});

electronApp.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
/*

const IPCRequestsMap =  {
    init : {
        request: "init_request",
        response: "init_response",
        description: "Init IPC layer. At now, just responses with actual map of request-response"
    },
    closeApp : {
        request: "close_app_request",
        response: "close_app_response",
        description: "Closing SHAFT-GUI"
    }
};


electron.ipcMain.on(IPCRequestsMap.init.request, (event, arg) => {
    //console.log('IPC: Request from client', event, arg);
    event.sender.send(IPCRequestsMap.init.response, {map: IPCRequestsMap})
});*/

