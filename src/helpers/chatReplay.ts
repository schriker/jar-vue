import * as Utils from './utils'
import { appAPI } from './axiosInstances'

export enum RechatEventType{
    Message,
    ActionMessage,
    Embed,
    /*UserModeChanged,
    UserJoins,
    UserParts,
    UserList,*/
    Notice,
    TitleChanged,
}

interface RechatEventBase{
    type: RechatEventType
    printable: boolean
    id: number
    playerTimeMs: number
}

export type UserMode = "vip" | "moderator" | "globalModerator" | "owner" | "admin"

export interface RechatMessageEvent extends RechatEventBase {
    type: RechatEventType.Message
    user: string
    userColor: string | undefined
    userSubscriptionMonths: number
    userGiftedSubscriptionMonths: number
    userModes: UserMode[]
    displayTime: string
    message: string
}

export type RechatEvent = RechatMessageEvent

export interface EmoticonViewData{
    name: string,
    fileName: string
}

let lastGlobalRechatEventId = 0
export async function fetchRechatEvents(streamingService: string, streamId: string): 
    Promise<{events: RechatEvent[], availableTimeFrom: number | null, availableTimeTo: number | null}>{
    const req = appAPI.get(`/${streamId}`, {transformResponse: data => data}) // force axios not to parse JSON. How stupid..
    const resp = <string>(await req).data
    const [metedataStr, ...eventLines] = resp.split('\n')
    const metadata = JSON.parse(metedataStr)
    const streamStartTime = new Date(metadata.streamStartTime)
    
    const rechatEvents = <RechatEvent[]>eventLines
        .map(eventString => parseRechatEvent(eventString, streamStartTime))
        .filter(event => event)
    
    if(rechatEvents.length > 0)
        console.log('fetchRechatEvents: first ' + rechatEvents[0].playerTimeMs + ' last: ' + rechatEvents.slice(-1)[0].playerTimeMs)        
    else 
        console.log('fetchRechatEvents: no events fetched')
    
    return { events: rechatEvents, 
        availableTimeFrom: metadata.availableFrom,
        availableTimeTo: metadata.availableTo
    }
}

function parseRechatEvent(eventString: string, streamStartTime: Date): RechatEvent | null{
    if(!eventString || eventString.length == 0)
        return null
    
    const [playerTimeStr, eventType, ircTagsStr, eventContent] = Utils.splitStringUpTo(eventString, ' ', 3)
    const playerTimeMs = parseInt(playerTimeStr)
    
    const eventCommonData = {
        id: lastGlobalRechatEventId++,
        playerTimeMs
    }
    
    const ircTags = Utils.parseIrcMessageTags(ircTagsStr.substring(1))
    const displayTime = new Date(streamStartTime)
    displayTime.setTime(displayTime.getTime() + playerTimeMs)
    const displayTimeStr = displayTime.getHours().toString().padStart(2, '0') + ':' + displayTime.getMinutes().toString().padStart(2, '0')
    
    switch(eventType){
        case 'msg':
            const [userWithModes, message] = Utils.splitStringUpTo(eventContent, ' ', 1)    
            const [userIrcModes, user] = Utils.splitStringUpTo(userWithModes, ':', 1)    
        
            const userColor = ircTags.get('poorchat.net/color')
            const userSubscriptionStr = ircTags.get('poorchat.net/subscription')
            const userSubscriptionMonths = userSubscriptionStr ? JSON.parse(userSubscriptionStr).months : 0
            const userGiftedSubscriptionStr = ircTags.get('poorchat.net/subscriptiongifter')
            const userGiftedSubscriptionMonths = userGiftedSubscriptionStr ? JSON.parse(userGiftedSubscriptionStr).months : 0    
        
            const userModes = <UserMode[]>userIrcModes.split('')
                .map(ircMode => IRC_TO_POORCHAT_USER_MODES_MAPPING.get(ircMode))
                .filter(mode => mode)
                
            return { ...eventCommonData,
                type: RechatEventType.Message,
                printable: true,
                user,
                userModes,
                userColor,
                userSubscriptionMonths,
                userGiftedSubscriptionMonths,
                displayTime: displayTimeStr,
                message
            }
        default:
            return null
    }
}

const IRC_TO_POORCHAT_USER_MODES_MAPPING = new Map<string, UserMode | null>([
    ['!', 'admin'],
    ['*', 'globalModerator'],
    ['@', 'moderator'],
    ['~', 'owner'],
    ['%', 'vip'],
    ['+', null], // subscriber
])