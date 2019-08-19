export function splitStringUpTo(str: string, separator: string, limit: number): string[]{
    const parts: string[] = []
    let prevSepIndex = 0
    
    for(let i = 0; i < limit; i++){
        const sepIndex = str.indexOf(separator, prevSepIndex)
        if(sepIndex == -1)
            break
            
        parts.push(str.substring(prevSepIndex, sepIndex))
        prevSepIndex = sepIndex + separator.length
    }
    
    parts.push(str.substring(prevSepIndex))
    return parts
}

export function parseIrcMessageTags(ircTagsStr: string): Map<string, string>{
    return new Map(ircTagsStr
        .split(';')
        .map(keyValuePair => <[string, string]>splitStringUpTo(keyValuePair, '=', 1))
        .map(entry => [entry[0], entry[1].replace('\\s', ' ')])) //todo: full escape
}

export function clamp(value: number, min: number, max: number){
    return Math.max(Math.min(value, max), min)
}