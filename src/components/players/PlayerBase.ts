import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// @ts-ignore
@Component
abstract class PlayerBaseAbstract extends Vue {
    @Prop()
    videoId: string
    
    @Prop({default: () => {}})
    playerStateNotifyCallback: () => void
    
    stateNotifyCallback: () => void = () => {}
    
    abstract getPlayerTime(): number
    
    abstract getIsPlaying(): boolean
}

// @ts-ignore
@Component()
export default class extends PlayerBaseAbstract { }