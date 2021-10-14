'use strict'

import { app, BrowserWindow, Tray, nativeImage, Menu, shell } from 'electron'
import '../renderer/store'
import { createServer, stopServer } from '../server/createServer'
import AutoLaunch from 'auto-launch'
import path from 'path'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow
let tray
let autoLauncher = new AutoLaunch({
  name: 'Sjoeff printer server'
})

if (process.env.NODE_ENV !== 'development') {
  autoLauncher
    .isEnabled()
    .then(function(isEnabled) {
      if (isEnabled) return
      autoLauncher.enable()
    })
    .catch(function(err) {
      throw err
    })
}

const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 600,
    title: 'Sjoeff printer server'
  })

  const iconPath = path.join(__dirname, '../../build/icons/logo@4x.png')
  console.log('Icon path: ' + iconPath)
  tray = new Tray(nativeImage.createFromPath(iconPath))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show()
      }
    },
    {
      label: 'Sjoef panel',
      type: 'normal',
      click: () => shell.openExternal('http://www.verzendbeheer-toplock.nl')
    },
    // {
    //   label: 'Print', type: "normal", click: () => {
    //     ptp.print('test.pdf')
    //       .then(console.log)
    //       .catch(console.log);
    //     // win.webContents.print(options, (success, errorType) => {
    //     //   if (!success) console.log(errorType)
    //     // })
    //   }
    // },
    { type: 'separator' },
    {
      label: 'Quit',
      type: 'normal',
      click: () => {
        app.isQuiting = true
        app.quit()
      }
    }
  ])
  tray.setToolTip('Sjoeff printer server.')
  tray.setContextMenu(contextMenu)
  console.log(tray)
  mainWindow.loadURL(winURL)

  createServer()

  mainWindow.on('closed', () => {
    mainWindow = null
    stopServer()
  })
  mainWindow.on('minimize', function(event) {
    event.preventDefault()
    mainWindow.hide()
  })

  mainWindow.on('close', function(event) {
    if (!app.isQuiting) {
      event.preventDefault()
      mainWindow.hide()
    }

    return false
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    stopServer()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
