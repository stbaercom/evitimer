import {ipcMain, BrowserWindow} from "electron"

import * as ty from "@/support/timertypes"
import * as ws from "@/elbackend/windowconfig"

import {FullState} from "@/support/timertypes";


import settings from 'electron-settings';


import {createWindow} from "@/background";

export type Windows = {
    [key: string]: BrowserWindow | null;
}


export class ElectronAPI {

    private global_windows: Windows = {}
    private handlers: any
    public state: ty.ElectronState = new ty.ElectronState()
    public refresh_menu: () => void

    constructor(global_windows: Windows) {
        this.refresh_menu = () => {
        }
        this.global_windows = global_windows
        this.handlers = {
            [ty.ONTOP]: (m: ty.TimerIPCMessage) => {
                const mm = m as ty.MsgONTOP
                this.global_windows[ws.WINDOW_MAINWIN]?.setAlwaysOnTop(mm.val)
            }
        }
        ipcMain.on('TIMERAPI', (_event, arg: ty.TimerIPCMessage) => {
            this.handle(arg)
        })

        ipcMain.on("TIMERSTATE", (event: any, arg: ty.TimerIPCMessage) => {

            if (arg.op == ty.STATEREQUEST) {
                const state = get_fullstate()
                let result

                if (state) {
                    result = {op: "STATEREPLY", ok: true, state,}
                } else {
                    result = {op: "STATEREPLY", ok: false, state,}
                }

                this.global_windows[ws.WINDOW_MAINWIN]?.webContents.send('TIMERSTATE', result)
            } else if (arg.op = ty.STATEPUSH) {
                const m = arg as ty.MsgSTATEPUSH
                const state = m.state
                set_fullstate(state)
            } else throw new Error("Unknown Message Type in Main IPC, TIMERSTATE")
        })
    }

    ipc_send_to_timer(m: ty.TimerIPCMessage) {
        this.global_windows[ws.WINDOW_MAINWIN]?.webContents.send('TIMERAPI', m)
    }

    handle(m: ty.TimerIPCMessage) {
        const op = m.op

        if (op == ty.VALUECHANGE) {
            const mm = m as ty.MsgVALUECHANGE
            this.handleValueChange(mm.name, mm.val)
        } else if (op == ty.ONTOP) {
            const mm = m as ty.MsgONTOP
            this.global_windows[ws.WINDOW_MAINWIN]?.setAlwaysOnTop(mm.val)

        }  else throw new Error(`OP ${op} is unknown`)
    }

    handleValueChange(name: string, val: string | number | boolean) {
        if (name == "pref_ontop") {
            const vv = val as boolean
            this.state.pref_ontop = vv
        } else if (name == "pref_low_energy") {
            const vv = val as boolean
            this.state.pref_low_energy = vv
        } else if (name == "state_is_running") {
            const vv = val as boolean
            this.state.state_is_running = vv
        } else if (name == "state_is_timer") {
            const vv = val as boolean
            this.state.state_is_timer = vv
        }  else throw new Error(`Support for Change in of ${name} is not supported`)

        if (this.refresh_menu) {
            this.refresh_menu()
        }
    }
}

const FULLSTATE = "fullstate";

export function get_fullstate(): ty.FullState | null {
    if (settings.has(FULLSTATE)) {
        try {
            return settings.get(FULLSTATE) as unknown as ty.FullState
        } catch (e) {
            //Retry
            try {
                return settings.get(FULLSTATE) as unknown as ty.FullState
            } catch (e) {
                return null
            }
        }
    } else {
        return null
    }
}

export function set_fullstate(data: ty.FullState) {
    try {
        settings.set(FULLSTATE, data as any)
    } catch (e) {
        try {
            settings.set(FULLSTATE, data as any)
        } catch (e) {
            return
        }
    }
}
