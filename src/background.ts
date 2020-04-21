'use strict'

import {app, protocol, BrowserWindow, Menu} from 'electron'
import {createProtocol, installVueDevtools} from 'vue-cli-plugin-electron-builder/lib'

import {menuTemplate} from "@/elbackend/menu"
import {ElectronAPI, Windows} from "@/elbackend/ipcsetup"


import * as ty from "@/support/timertypes"
import * as ws from "@/elbackend/windowconfig"


const isDevelopment = process.env.NODE_ENV !== 'production'

let mainwin: BrowserWindow | null


let global_windows: Windows = {}


let eapi: ElectronAPI | null

protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}])


export function createWindow(config: any, exist_on_close: boolean = false) {

    if (global_windows[config.name]) {
        global_windows[config.name]?.show()
        return
    }

    const win = new BrowserWindow({
        ...config.window,
        webPreferences: {
            nodeIntegration: true
        }
    })

    global_windows[config.name] = win

    if (process.env.WEBPACK_DEV_SERVER_URL) {

        const url = process.env.WEBPACK_DEV_SERVER_URL as string + config.filename
        win.loadURL(url)
        if (!process.env.IS_TEST && ws.DEVMODE) {
            win.webContents.openDevTools()
        }
    } else {
        createProtocol('app')

        win.loadURL('app://./' + config.filename)
    }

    win.on('closed', () => {
        global_windows[config.name] = null
        if (exist_on_close) {
            app.quit()
        }
    })
}

app.on('window-all-closed', () => {
    app.quit()
})

app.on('activate', () => {
    if (global_windows[ws.WINDOW_MAINWIN] === null) {
        createWindow(ws.mainConfig)
    }
})

app.on('ready', async () => {

        app.setAboutPanelOptions({
            applicationName: "Eviact Timer",
            applicationVersion: "1.0",
            credits: `hello\nworld\this is me`,
            authors: ["Stefan Baerisch"]
        })


        if (isDevelopment && !process.env.IS_TEST) {
            try {
                await installVueDevtools()
            } catch (e) {
                console.error('Vue Devtools failed to install:', e.toString())
            }
        }

        createWindow(ws.mainConfig, true)


        eapi = new ElectronAPI(global_windows) as ElectronAPI
        const send = (m: ty.TimerIPCMessage) => {
            console.log(m)
            if (m.op == "SHOW_THIRDPARTY") {
                createWindow(ws.thirdpartyConfig)
            } else if (m.op == "SHOW_HELP") {
                createWindow(ws.helpConfig)
            }  else {
                eapi!.ipc_send_to_timer(m)
            }
        }

        const build_menu = () => {
            const template = menuTemplate(send, eapi!.state)
            const menu = Menu.buildFromTemplate(template as any);
            Menu.setApplicationMenu(menu);
        }

        eapi.refresh_menu = build_menu
        build_menu()
    }
)


if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
