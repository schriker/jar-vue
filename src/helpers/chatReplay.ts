import * as Utils from './utils'
import { appAPI } from './axiosInstances'

export enum ReplayEventType{
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

interface ReplayEventBase{
    type: ReplayEventType
    printable: boolean
    eventUid: number
    msgid?: string
    playerTimeMs: number
}

export type UserMode = "vip" | "moderator" | "globalModerator" | "owner" | "admin"

export interface ReplayMessageEvent extends ReplayEventBase {
    type: ReplayEventType.Message
    user: string
    userColor: string | undefined
    userSubscriptionMonths: number
    userGiftedSubscriptionMonths: number
    userModes: UserMode[]
    message: string
}

export interface ReplayEmbedEvent extends ReplayEventBase {
    type: ReplayEventType.Embed
    embedData: any
}

export type ReplayEvent = ReplayMessageEvent | ReplayEmbedEvent

export interface EmoticonViewData{
    name: string,
    fileName: string
}

let lastGlobalReplayEventId = 0
export async function fetchReplayEvents(streamingService: string, streamId: string): 
    Promise<{events: ReplayEvent[], streamStartTime: Date}>{
    const req = appAPI.get(`/${streamId}`, {transformResponse: data => data}) // force axios not to parse JSON. How stupid..
    const resp = <string>(await req).data
    const [metedataStr, ...eventLines] = resp.split('\n')
    const metadata = JSON.parse(metedataStr)
    const streamStartTime = new Date(metadata.streamStartTime)
    
    const replayEvents = <ReplayEvent[]>eventLines
        .map(eventString => parseReplayEvent(eventString, streamStartTime))
        .filter(event => event)
    
    if(replayEvents.length > 0)
        console.log('fetchReplayEvents: first ' + replayEvents[0].playerTimeMs + ' last: ' + replayEvents.slice(-1)[0].playerTimeMs)        
    else 
        console.log('fetchReplayEvents: no events fetched')
    
    return { events: replayEvents,
        streamStartTime
        /* availableTimeFrom: metadata.availableFrom,
        availableTimeTo: metadata.availableTo */
    }
}

function parseReplayEvent(eventString: string, streamStartTime: Date): ReplayEvent | null{
    if(!eventString || eventString.length == 0)
        return null
    
    const [playerTimeStr, eventType, ircTagsStr, eventContent] = Utils.splitStringUpTo(eventString, ' ', 3)
    const playerTimeMs = parseInt(playerTimeStr)
    const ircTags = Utils.parseIrcMessageTags(ircTagsStr.substring(1))
    
    const eventCommonData = {
        eventUid: lastGlobalReplayEventId++,
        msgid: ircTags.get('msgid'),
        playerTimeMs
    }
    
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
                type: ReplayEventType.Message,
                printable: true,
                user,
                userModes,
                userColor,
                userSubscriptionMonths,
                userGiftedSubscriptionMonths,
                message
            }
        case 'embed':
            return { ...eventCommonData,
                type: ReplayEventType.Embed,
                printable: false, // This is not displayed as event, but included in message event
                embedData: JSON.parse(eventContent)
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