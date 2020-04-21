import {BufferData} from "@/support/timertypes"


export function secs2buffer(seconds: number): BufferData {
    const step = (m: number) => {
        const v = Math.ceil(seconds % m)
        seconds = (seconds - v) / m
        return v
    }
    const s0 = step(10)
    const s1 = step(6)
    const m0 = step(10)
    const m1 = step(6)
    const h0 = step(10)
    return [seconds, h0, m1, m0, s1, s0]
}

export function buffer2secs(buffer: BufferData): number {
    let r = 0
    const mults = [1, 10, 60, 600, 3600, 36000]
    for (const m of mults) {
        const v = buffer.pop()
        if (v != undefined) {
            r += v * m
        } else {
            throw new Error("Buffer value should be expected")
        }

    }
    return r
}

export function buffer2time(buffer: BufferData): [number, boolean] {
    const h = buffer[0] * 10 + buffer[1]
    const m = buffer[2] * 10 + buffer[3]
    const s = buffer[4] * 10 + buffer[5]

    const valid = (h <= 23) && (m <= 59) && (s <= 59)
    if (!valid) return [0, false]

    const now = new Date()

    const then = new Date()


    then.setHours(h)
    then.setMinutes(m)
    then.setSeconds(s)

    let diff = then.getTime() - now.getTime()
    if (diff < 0) {
        diff += 24 * 60 * 60 * 1000
    }

    const seconds = Math.ceil(diff / 1000)
    return [seconds, true]

}


export function buffer_change_hms(buffer: BufferData, idx: number, val: number): BufferData {
    const v_low = Math.floor(val % 10)
    const v_high = Math.floor(val / 10)
    buffer.splice(idx, 2, v_high, v_low)
    return buffer
}

export function buffer_append(buffer: BufferData, c: string): BufferData {
    const n = parseInt(c)
    buffer.push(n)
    buffer.shift()
    return buffer
}

export function buffer_remove(buffer: BufferData): BufferData {
    buffer.pop()
    buffer.unshift(0)
    return buffer
}


export function getBufferData(): BufferData {
    return [0, 0, 0, 0, 0, 0];
}
