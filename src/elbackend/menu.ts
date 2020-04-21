import {app, Menu, MenuItemConstructorOptions} from 'electron'
import * as ty from "@/support/timertypes";

import {ElectronAPI} from "@/elbackend/ipcsetup"


const isMac = process.platform === 'darwin'


export function menuTemplate(handle: (m: ty.TimerIPCMessage) => void, state: ty.ElectronState): any {

    const ipc = (chn: string, pl: any) => {
    }

    const appMenu = {
        label: app.name,
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {
                label: 'Preferences...',
                accelerator: "CmdOrCtrl+,",
                click() {
                    handle({op: "PREFERENCES"})
                }
            },
            {type: 'separator'},
            {role: 'services'},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'}
        ]
    }

    const timerMenu = {
        label: 'Timer',
        submenu: [
            {
                label: `Reset the ${state.state_is_timer ? "Timer" : "Stopwatch"}`,
                accelerator: "R",
                click() {
                    handle({op: "RESET"})
                }
            },
            {
                label: `${state.state_is_running ? "Pause" : "Start"} the ${state.state_is_timer ? "Timer" : "Stopwatch"}`,
                accelerator: "Space",
                click() {
                    handle({op: "PAUSE"})
                }
            },
            {
                label: `Switch To ${!state.state_is_timer ? "Timer" : "Stopwatch"}`,
                accelerator: "S",
                click() {
                    handle({op: "SWITCH"})
                }
            },
            {
                role: 'close',
                label: 'Close this Timer and exit'
            }
        ]
    }

    const viewMenu = {
        label: 'View',
        submenu: [

            {
                label: `${state.pref_ontop ? "Disable" : "Enable"} always on Top`,
                accelerator: "O",
                click() {
                    handle({op: "ONTOP", val: !state.pref_ontop})
                }
            },

        ]
    }

    const windowMenu = {
        label: 'Window',
        submenu: [
            {role: 'minimize'},
            {type: 'separator'},
            {role: 'front'},
            {type: 'separator'},
            {role: 'window'}
        ]
    }

    const helpMenu = {
        role: 'help',
        submenu: [
            {
                label: 'Documentation',
                click() {
                    handle({op: "SHOW_HELP"})
                }
            },
            {
                label: 'Third Party Software',
                click() {
                    handle({op: "SHOW_THIRDPARTY"})
                }
            },
        ]
    }

    return [appMenu, timerMenu, viewMenu, windowMenu, helpMenu]

}
