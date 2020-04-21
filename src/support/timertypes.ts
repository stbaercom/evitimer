export interface VStyle {
    [key: string]: string;
}

export interface StringMap {
    [key: string]: string;
}

export interface NumberMap {
    [key: string]: number;
}


export interface TimeState {
    "part": number;
    "total": number;
}


export type BufferData = number[]

export type KeyInputEvent = {
    [key: string]: string;
}

export type MenuAction = {
    op: string;
    value?: number;
}

export interface FullState {
    // Preferences
    pref_default_timer_length: number;
    pref_alarm: boolean;
    pref_ring: boolean;
    pref_after_timer_end: string;
    pref_ontop: boolean;
    pref_low_energy: boolean;

    // State
    state_stopwatch_time: number;
    state_timer_starttime: number;
    state_timer_timeleft: number;
    state_is_timer: boolean;
    state_is_running: boolean;
}


export interface TimerIPC {
    send(ch: string, pl: TimerIPCMessage): void;
}


export class DummyIPC {
    send(ch: string, pl: TimerIPCMessage): void {
        //TODO implement some logging
    }
}


export const ONTOP = "ONTOP"

export interface MsgONTOP {
    op: "ONTOP";
    val: boolean;
}


export interface MsgLOG {
    op: "LOG";
    val: string;
}



export const SWITCH = "SWITCH"

export interface MsgSWITCH {
    op: "SWITCH";
}

export const PAUSE = "PAUSE"

export interface MsgPAUSE {
    op: "PAUSE";
}

export const RESET = "RESET"

export interface MsgRESET {
    op: "RESET";
}

export const PREFERENCES = "PREFERENCES"

export interface MsgPREFERENCES {
    op: "PREFERENCES";
}

export const VALUECHANGE = "VALUECHANGE"

export interface MsgVALUECHANGE {
    op: "VALUECHANGE";
    name: string;
    val: boolean | number | string;
}


export const STATEREQUEST = "STATEREQUEST"

export interface MsgSTATEREQUEST {
    op: "STATEREQUEST";
}


export const STATEREPLY = "STATEREPLY"

export interface MsgSTATEREPLY {
    op: "STATEREPLY";
    ok: boolean;
    state: FullState | null;
}


export const STATEPUSH = "STATEPUSH"

export interface MsgSTATEPUSH {
    op: "STATEPUSH";
    state: FullState;
}


export type TimerIPCMessage = (
    MsgONTOP |
    MsgLOG |
    MsgSWITCH |
    MsgPAUSE |
    MsgRESET |
    MsgPREFERENCES |
    MsgVALUECHANGE |
    MsgSTATEREQUEST |
    MsgSTATEREPLY |
    MsgSTATEPUSH |
    { op: "SHOW_HELP" } |
    { op: "SHOW_THIRDPARTY" }
    )


export class ElectronState {
    public pref_ontop = false
    public pref_low_energy = false
    public state_is_timer = true
    public state_is_running = false
}
