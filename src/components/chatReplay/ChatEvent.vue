<template>
    <span v-if="rechatEvent.type == RechatEventType.Message">
        <span class="time">{{rechatEvent.displayTime}}</span>
        <span v-if="isContinuationMessage">
            <span class="continue">
                <i class="fa fa-angle-right"></i>
            </span>
        </span>
        <span v-else>
            <span class="modes">
                <div v-if="rechatEvent.userSubscriptionMonths > 0 && jadiscoBadgesInfo != null" class="mode">
                    <a href="https://www.poorchat.net/subscriptions/jadisco" target="_blank">
                        <img :src="`https://static.poorchat.net/badges/${getSubscriptionBadgedName(rechatEvent.userSubscriptionMonths)}/1x`">
                    </a>
                </div>
                <div v-for="mode in rechatEvent.userModes" v-bind:key="mode" class="mode">
                    <img :src="`https://static.poorchat.net/badges/${USER_MODES_TO_LETTER_MAPPING.get(mode)}/1x`">
                </div>
            </span>
            <span class="user" :style="{color: rechatEvent.userColor || getRandomUserColor(rechatEvent.user)}">{{rechatEvent.user}}</span>
            <span>:</span>
        </span>
        <span class="text">
            <span>
                <template v-for="(frag, index) in insertEmoticons(rechatEvent.message)">
                    <template v-if="typeof frag == 'string'">
                        {{frag}}
                    </template>
                    <template v-else>
                        <img class="emoticon" :src="`https://static.poorchat.net/emoticons/${frag.fileName}/1x`" :alt="frag.name" :tooltip="frag.name" v-bind:key="index"/>
                    </template>
                </template>
            </span>
        </span>
    </span>
</template>
<script lang="ts">
import Vue from "vue"
import Chance from 'chance'
import { Component, Prop } from 'vue-property-decorator'
import { UserMode, RechatEvent, RechatEventType, EmoticonViewData } from "../../helpers/chatReplay"

@Component
export default class extends Vue {
    readonly USER_MODES_TO_LETTER_MAPPING = new Map<UserMode, string>([
        ['admin', 'a'],
        ['globalModerator', 'm'],
        ['owner', 'q'],
        ['moderator', 'o'],
        ['vip', 'h'],
    ])
    readonly USER_COLORS = ["#FF0000", "#FF8000", "#FFFF00", "#80FF00", "#008000", "#00FF80", "#00FFFF", "#0080FF", "#0000FF", "#8000FF", "#FF00FF", "#FF0080"]
    readonly RechatEventType = RechatEventType
    
    @Prop()
    rechatEvent: RechatEvent
    @Prop()
    isContinuationMessage: boolean
    @Prop()
    emoticonsInfo: any
    @Prop()
    jadiscoBadgesInfo: any
    

    private insertEmoticons(msg): (string | EmoticonViewData)[] | null{
        /*  if(this.rechatEvent.type != RechatEventType.Message)
                return null */
            
        let fragments: (string | EmoticonViewData)[] = [msg]
        
        if(this.emoticonsInfo == null)
            return fragments
        
        for(const emo of this.emoticonsInfo){
            const emoRegex = new RegExp('\\b' + emo.name + '\\b')
            const newFragments: (string | EmoticonViewData)[] = []
            
            for(const oldFrag of fragments){
                if(typeof oldFrag == 'string'){
                    const textFragments = oldFrag.split(emoRegex)
                    
                    for(let i = 0; i < textFragments.length; i++){
                        const textFrag = textFragments[i]
                        if(textFrag.length > 0)
                            newFragments.push(textFrag)
                        
                        if(i != textFragments.length - 1)
                            newFragments.push({name: emo.name, fileName: emo.file})
                    }
                } else {
                    newFragments.push(oldFrag)
                }
            }
                
            fragments = newFragments
        }
        
        return fragments
    }
    
    private getSubscriptionBadgedName (months): string {
        const ret = this.jadiscoBadgesInfo.subscriber
            .filter(x => x.months <= months).slice(-1)[0].file
        return ret
    }
    
    private getRandomUserColor(nick: string): string{
        const rng = new Chance(nick)
        return this.USER_COLORS[rng.integer({min: 0, max: this.USER_COLORS.length-1})]
    }
}
</script>