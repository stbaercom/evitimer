
import {ipcRenderer} from "electron"


export class Backend {
    on(channel: string, callback: any) {
        ipcRenderer.on(channel,callback)
    }

    send(channel: string, msg: any) {
        ipcRenderer.send(channel,msg)
    }

    is_electron() {
        return true
    }
}
