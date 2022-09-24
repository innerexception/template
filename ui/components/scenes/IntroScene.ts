import { Scene, Tilemaps } from "phaser";
import { store } from "../../..";
import { Layers, LayerStack, SceneNames, SoundEffects, UIReducerActions } from "../../../enum";
import { transitionIn, transitionOut } from "../../common/Utils";

export default class IntroScene extends Scene {

    sounds: any
    map:Tilemaps.Tilemap
    unsubscribe: Function

    onReduxUpdate = () => {
        const uiState = store.getState()
        let engineEvent = uiState.engineEvent
        if(engineEvent)
            switch(engineEvent){
                case UIReducerActions.NEW:
                    // this.sounds[SoundEffects.Intro].stop()
                    // this.sounds[SoundEffects.Clunk].play()
                    transitionOut(this, SceneNames.Main, ()=>transitionIn(this.scene.get(SceneNames.Main)as any))
                break
            }
    }

    create = () =>
    {
        this.unsubscribe = store.subscribe(this.onReduxUpdate)
        this.sounds = {}
        this.add.tileSprite(0,0,this.cameras.main.displayWidth,this.cameras.main.displayHeight*2, 'grass').setOrigin(0,0).setScale(1)
        
        this.map = this.add.tilemap(store.getState().mySave.activeMap.map)
        let grass = this.map.addTilesetImage('Tileset', 'tiles', 8,8,1,2)
        const offset = {x:0,y:0}
        LayerStack.forEach(l=>this.map.createLayer(l, grass, offset.x,offset.y))
        
        this.cameras.main.setZoom(2)
        this.cameras.main.setScroll(0,0)
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
    
        this.input.mouse.disableContextMenu()
        // this.sounds[SoundEffects.Intro] = this.sound.add(SoundEffects.Intro)
        // this.sounds[SoundEffects.Clunk] = this.sound.add(SoundEffects.Clunk)
        // this.sounds[SoundEffects.Intro].play({loop: true, volume: 0.2})
    }
    onTransitionIn = () => {
    }
}