

export const DEVMODE = process.env.WEBPACK_DEV_SERVER_URL

export const WINDOW_MAINWIN = 'WINDOW_MAINWIN';
export const WINDOW_HELP = "WINDOW_HELP"
export const WINDOW_THIRDPARTY = "WINDOW_THIRDPARTY"

export const mainConfig = {
    name: WINDOW_MAINWIN,
    filename: "index.html",
    window: {
        width: DEVMODE ? 800 : 200,
        height: DEVMODE ? 800 : 200,
        resizable: DEVMODE ? true : false,
        titleBarStyle: DEVMODE ? "default" : "hidden"
    }
}





export const helpConfig = {
    name: WINDOW_HELP,
    filename: "help.html",
    window: {
        width: 800,
        height: 600,
        resizable: true,
        frame: true
    }
}


export const thirdpartyConfig = {
    name: WINDOW_THIRDPARTY,
    filename: "thirdparty.html",
    window: {
        width: 800,
        height: 600,
        resizable: true,
        frame: true
    }
}
