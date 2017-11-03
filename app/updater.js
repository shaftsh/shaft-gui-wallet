const {app, dialog} = require('electron');
const path = require("path");
const logger = require('./util/logger').getLogger("Auto-Updater");
const {autoUpdater} = require("electron-updater");

function init(mainWindow) {
    logger.info("Starting auto updater");

    autoUpdater.on('checking-for-update', (a,b) => {
        logger.info('Checking for update...');
    });

    autoUpdater.on('update-available', (ev, info) => {
        logger.info('Update available.');
        dialog.showMessageBox({
            type: 'info',
            title: 'Found Updates',
            message: 'Found updates, do you want update now?',
            buttons: ['Sure', 'No']
        }, (buttonIndex) => {
            if (buttonIndex === 0) {
                autoUpdater.downloadUpdate()
            }
            else {
            }
        })
    });
    autoUpdater.on('update-not-available', (ev, info) => {
        logger.info('Update not available.');
    });
    autoUpdater.on('error', (ev, err) => {
        logger.error('Error in auto-updater.');
    });
    autoUpdater.on('download-progress', (ev, progressObj) => {
        logger.info('Download progress...');
    });
    autoUpdater.on('update-downloaded', (ev, info) => {
        logger.info('Update downloaded; will install in 5 seconds');
    });

    autoUpdater.checkForUpdates();
}

module.exports = {
    init: init,
    getAutoUpdater: () => {
        return autoUpdater
    }
};