import moment from "moment";

export interface TimeControlInterface {
    displayColor(part: number, total: number): string;
    angle(_part: number, _total: number): number;
    rotation(part: number, total: number): number;
    support_time(now: moment.Moment, time: number): [string, string,string];
}

const STARTANGLE = -90;

const pad = (v: number) => {
    const p = v >= 10 ? "" : "0"
    return `${p}${v}`
}

export class TimerControl {
    displayColor(part: number, total: number): string {
        const f = total == 0 ? 0 : (total - part) / total
        let color = "green"

        if (f > 0.70) {
            color = "yellow"
        }

        if (f > 0.80 || part <= 2) {
            color = "orange"
        }

        if (f > 0.95 || part <= 1) {
            color = "red"
        }
        return color
    }

    angle(part: number, total: number): number {
        const fraction = part / total || 0
        const result = 360 * fraction
        return result
    }

    rotation(part: number, total: number): number {
        const fraction = part / total || 0
        const result = (STARTANGLE - 360 * fraction)
        return result
    }

    support_time(now: moment.Moment, time: number): [string, string,string] {
        const then = now.add(time, 's')

        const hs = pad(then.get('hour'))
        const ms = pad(then.get('minute'))
        return [hs, ms, "until"]
    }
}


export class StopwatchControl {
    private readonly arc_width = 30

    displayColor(_part: number, _total: number): string {
        return "blue"
    }

    angle(_part: number, _total: number): number {
        return this.arc_width
    }

    rotation(part: number, total: number): number {
        const fraction = (part % total) / total || 0
        return STARTANGLE - this.arc_width / 2 + 360 * fraction
    }

    support_time(now: moment.Moment, time: number): [string, string,string] {
        const then = now.subtract(time, 's')
        const hs = pad(then.get('hour'))
        const ms = pad(then.get('minute'))
        return [hs, ms, "current"]
    }



}
