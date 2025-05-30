var timeMultipliers: any = {
    "s": 1000,
    "m": 1000*60,
    "h": 1000*60*60,
    "d": 1000*60*60*24,
    "w": 1000*60*60*24*7,
    "M": 1000*60*60*24*7*30,
    "y": 1000*60*60*24*7*365
}

export function parseTime(time: string): number {
    const parts = time.split(" ")
    let parsedTime = 0
    for (const part of parts){
        const timeUnit: string = part.charAt(part.length-1)
        const duartionString: string = part.split(timeUnit)[0]
        const duration: number = parseInt(duartionString)
        if (duration.toString() !== duartionString) throw Error()
        parsedTime += timeMultipliers[timeUnit] * duration
    }
    return parsedTime
}