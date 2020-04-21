import * as ty from "@/support/timertypes"
import axios from "axios"

export class Backend {

    callbacks: any;

    constructor() {
        this.callbacks = {}
    }

    push_to_server(msg: any, callback: any = null) {
        console.log("SERVER REQ", msg, callback)
        axios.post('http://localhost:5000/api', msg)
            .then(function (response) {
                console.log("SERVER RES", response)
                if (callback) {
                    callback(response.data)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    on(channel: string, callback: any) {
        this.callbacks[channel] = callback
        console.log("ON " + channel)
    }

    send(channel: string, msg: any) {
        if (channel == "TIMERAPI") {
            const op = msg.op

            if (op == ty.VALUECHANGE) {
                const mm = msg as ty.MsgVALUECHANGE
                this.push_to_server(mm)
            } else if (op == ty.ONTOP) {
                const _ = "Ignore Ontop message"
            } else {
                throw new Error(`OP ${op} is unknown`)
            }
        } else if (channel == "TIMERSTATE") {
            if (msg.op == ty.STATEREQUEST) {
                this.push_to_server(msg, (res: any) => {
                    const callback = this.callbacks["TIMERSTATE"]
                    callback("WEBEVENT", res)
                })
            } else if (msg.op == ty.STATEPUSH) {
                this.push_to_server(msg)
            } else throw new Error("Unknown Message Type in Main IPC, TIMERSTATE")
        }
        console.log(`SEND ${channel}`, msg)
    }

    is_electron() {
        return false
    }
}


