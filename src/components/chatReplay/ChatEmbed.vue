<template>
    <div v-if="embedData.type === 'image'" class="embed" ref="embedEl">
        <a :href="embedData.url" rel="noreferrer noopener" target="_blank">
            <img v-if="isMounted" ref="sizedEl" class="embed-media embed-media-image" alt="" :src="embedData.image[0].url" :style="getSizeStyle(embedData.image[0])">
        </a>
    </div>
</template>
<script lang="ts">
import Vue from "vue"
import { Component, Prop } from 'vue-property-decorator'

@Component({
    name: 'ChatEmbed'
})
export default class extends Vue {
    @Prop() embedData: any
    
    isMounted = false
    
    private getSizeStyle({width: orgWidth, height: orgHeight} : {width?: number, height?: number}): any {
        /* const elem = <HTMLElement>this.$refs.sizedEl
        console.log(elem)
        if(!orgWidth)
            orgWidth = (<HTMLImageElement>elem).naturalWidth
            
        if(!orgHeight)
            orgHeight = (<HTMLImageElement>elem).naturalHeight */
    
        const parent = this.$refs.embedEl as HTMLElement //todo: or embedInner
        if(!parent)
            return {}
        
        const parentWidth = this.getElemWidth(parent)
        
        let maxWidth = Math.min(352, parentWidth)
        let maxHeight = maxWidth / (16 / 9);
        orgWidth = orgWidth || maxWidth
        orgHeight = orgHeight || maxHeight
        
        if(orgWidth < maxWidth && orgHeight < maxHeight){
            maxWidth = orgWidth
            maxHeight = orgHeight
        }
        
        const scale = Math.min(maxWidth / orgWidth, maxHeight / orgHeight)
        return {
            width: orgWidth * scale + "px",
            height: orgHeight * scale + "px"
        }
    }
    
    private getElemWidth(elem: HTMLElement): number{
        return Math.max(elem.clientWidth, elem.scrollWidth, elem.offsetWidth)
    }
    
    mounted() {
        this.isMounted = true
    }
}
</script>