import { Scene, GameObjects, Tilemaps, Geom, Time } from "phaser";
import { store } from "../../..";
import { BuildingSpriteIndex, BuildingType, BuildingZone, CarSpriteIndex, DECAY_CHANCE, DoodadIndexes, IconIndexes, Layers, LayerStack, SceneNames, SoundEffect, SoundEffectCategory, SoundEffects, StartingWaterIndexs, UIReducerActions, VineIndexes1, VineIndexes2 } from "../../../enum";
import{ v4 }from 'uuid'
import { defaultCursor, FONT_DEFAULT, invalidCursor } from "../../assets/Assets";
import { onSelectBuilding, onShowEnding, onUpdateActiveMap, onWarnArkDelete } from "../../common/Thunks";
import BuildingSprite from "../sprites/BuildingSprite";
import { getActiveMap, transitionIn, transitionOut, updatePollution } from "../../common/Utils";
import { BuildingData } from "../../../BuildingData";
import CarSprite from "../sprites/CarSprite";
const TILE_DIM=16
const TILE_RADIUS=6
export default class MapScene extends Scene {

    unsubscribeRedux: Function
    selectIcon: GameObjects.Image
    selectedTile: Tilemaps.Tile
    map: Tilemaps.Tilemap
    buildings: Array<BuildingSprite>
    errorTimer: Time.TimerEvent
    selectedHandle: GameObjects.DOMElement
    origDragPoint: Phaser.Math.Vector2
    g:GameObjects.Graphics
    sounds: {[key:string]:Phaser.Sound.BaseSound}
    traffic: Array<CarSprite>

    constructor(config){
        super(config)
        this.buildings = []
        this.traffic = []
        this.sounds = {}
        this.unsubscribeRedux = store.subscribe(this.onReduxUpdate)
    }
    
    onReduxUpdate = () => {
        const uiState = store.getState()
        let engineEvent = uiState.engineEvent
        if(engineEvent)
            switch(engineEvent){
                case UIReducerActions.NEXT_MAP:
                // this.sounds[SoundEffects.Intro].stop()
                // this.sounds[SoundEffects.Clunk].play()
                transitionOut(this, SceneNames.Intro, ()=>transitionIn(this.scene.get(SceneNames.Intro)as any))
                break
            }
    }

    create = () =>
    {
        this.g = this.add.graphics().setDefaultStyles({ lineStyle: { width:1, color:0xfff }}).setDepth(7)
        this.add.tileSprite(0,0,this.cameras.main.displayWidth,this.cameras.main.displayHeight*2, 'grass').setOrigin(0,0).setScale(1)
        this.createSelectIcon()
        this.input.mouse.disableContextMenu()
        this.setCursor(defaultCursor);
        this.enableInputEvents()

        Object.keys(BuildingSpriteIndex).forEach(key=>{
            this.anims.create({
                key,
                frames: this.anims.generateFrameNumbers(key, { start: 0, end: 2 }),
                frameRate: 2,
                repeat: -1
            });
        })

        this.anims.create({
            key: 'nopower',
            frames: this.anims.generateFrameNumbers('nopower', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'empty',
            frames: this.anims.generateFrameNumbers('empty', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });

        SoundEffects.forEach(s=>this.sounds[s.soundName] = this.sound.add(s.soundName))
        this.time.addEvent({
            delay: Phaser.Math.Between(10000, 30000),
            callback: () => {
                let nextAmbientSound:Array<SoundEffectMetaData>
                if(Phaser.Math.Between(0,1)===1)
                    nextAmbientSound= SoundEffects.filter(s=>s.category === SoundEffectCategory.Nature)
                else nextAmbientSound = SoundEffects.filter(s=>s.category === SoundEffectCategory.City)
                this.sounds[nextAmbientSound[Phaser.Math.Between(0, nextAmbientSound.length-1)].soundName].play({
                    volume: 0.3
                })
            },
            loop: true
        })
        this.sound.volume = 0.3
        this.initMap()
    }

    initMap = () => {
        
        const mySave= store.getState().mySave.activeMap
        this.map?.destroy()
        this.map = this.add.tilemap(mySave.map)
        let grass = this.map.addTilesetImage('Tileset', 'tiles', 8,8,1,2)
        LayerStack.forEach(l=>this.map.createLayer(l, grass))

        this.buildings.forEach(e=>e.destroy())
        this.buildings = []
        mySave.buildings.forEach(t=>{
            this.buildings.push(new BuildingSprite(this, this.map.tileToWorldX(t.tileX), this.map.tileToWorldY(t.tileY), t.sprite, t.id))
        })
        if(mySave.buildings.length === 0){
            this.initNewMap()
        } 
        
        this.cameras.main.setZoom(2)
        this.cameras.main.setScroll(0,0)
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.map.setLayer(Layers.Water).forEachTile(t=>{
                    if(t.index !== -1){
                        if(StartingWaterIndexs.includes(t.index-t.tileset.firstgid))
                            t.index+=5
                        else t.index-=5
                    }
                })
            }
        })
    }

    initNewMap = () => {
        const save = store.getState().mySave
        const buildings = new Array<BuildingState>()
        this.map.setLayer(Layers.Buildings).forEachTile(t=>{
            const spriteName = t.index - t.tileset?.firstgid
            const type = +Object.keys(BuildingData).find(b=>BuildingData[b].sprites.includes(spriteName))
            const dat = BuildingData[type] as BuildingMetaData
            if(dat){
                const bld = {
                    id:v4(),
                    tileX:t.x,
                    tileY:t.y,
                    isPowered: true,
                    kind: type,
                    citizens: dat.maxcitizens,
                    sprite: spriteName
                }
                buildings.push(bld)
                this.buildings.push(new BuildingSprite(this, this.map.tileToWorldX(bld.tileX), this.map.tileToWorldY(bld.tileY), bld.sprite, bld.id))
            }
        })
        save.activeMap.buildings = buildings
        save.activeMap.startingBuildingCount = buildings.length
        onUpdateActiveMap(save)
    }

    createSelectIcon = () => {
        this.selectIcon = this.add.image(0, 0, 'selected').setDepth(3).setVisible(false)
        this.add.tween({
            targets: this.selectIcon,
            scale: 0.5,
            duration: 1000,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [3],
            yoyo: true
        })
    }

    enableInputEvents = () => {
        this.input.on('pointermove', (event, gameObjects:Array<Phaser.GameObjects.GameObject>) => {
            let tile = this.map?.getTileAtWorldXY(this.input.activePointer.worldX, this.input.activePointer.worldY, false, undefined, Layers.Land)
            if(tile && gameObjects.length > 0){
                const bld = gameObjects[0] as BuildingSprite
                if(bld.id !== store.getState().selectedBuilding?.id){
                    const ctr = bld.getCenter()
                    this.selectIcon.setPosition(ctr.x, ctr.y)
                    this.selectIcon.setVisible(true)
                    const b = getActiveMap().buildings.find(b=>b.id === bld.id)
                    onSelectBuilding(b, this.getBuildingReward(b))
                    this.selectedHandle = this.add.dom(ctr.x, ctr.y+15, '#selected-building').setScale(0.5).setDepth(6).setOrigin(1)
                }
            }
            else if(tile) {
                if(!this.selectedTile) this.selectedTile = tile
                else if(this.selectedTile.x !== tile.x || this.selectedTile.y !== tile.y){
                    this.selectedTile = tile
                    onSelectBuilding(null)
                    this.selectIcon.setVisible(false)
                    try{
                        this.selectedHandle.destroy()
                    }catch(e){}
                }
            }
            if (this.game.input.activePointer.isDown) {
                if (this.origDragPoint) {
                    // move the camera by the amount the mouse has moved since last update
                    this.cameras.main.scrollX +=
                        (this.origDragPoint.x - this.game.input.activePointer.position.x);
                    this.cameras.main.scrollY +=
                        (this.origDragPoint.y - this.game.input.activePointer.position.y);
                } // set new drag origin to current position
                this.origDragPoint = this.game.input.activePointer.position.clone();
            } 
            else {
                this.origDragPoint = null;
            }
        })

        this.input.on('pointerdown', (event, GameObjects:Array<Phaser.GameObjects.GameObject>) => {
            if(GameObjects[0]){
                const bld = (GameObjects[0] as BuildingSprite)
                this.tryDemolishBuilding(bld)
            }
        })
    }

    setCursor = (assetUrl:string) => {
        this.input.setDefaultCursor('url('+assetUrl+'), pointer');
    }

    floatResource = (x:number, y:number, index:number, color:string, text?:string) => {
        let icon = this.add.image(x, y, 'items', index).setDepth(4)
        let targets = [icon]
        if(text) {
            let txt = this.add.text(x+7, y-8, text, {...FONT_DEFAULT, color}).setDepth(4).setStroke('0x000', 2)
            targets.push(txt as any)
        }
        this.tweens.add({
            targets,
            y: y-20,
            duration: 2000,
            onComplete: ()=>{
                targets.forEach(t=>t.destroy())
            }
        })
    }

    showErrorText = (message:string, cursor?:string) => {
        const t = this.add.text(this.input.activePointer.worldX+20, this.input.activePointer.worldY, message, FONT_DEFAULT).setStroke('0x000', 2).setDepth(3)
        if(cursor) this.input.setDefaultCursor(invalidCursor)
        this.sounds[SoundEffect.Error].play()
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                t.destroy()
                if(cursor) this.input.setDefaultCursor(cursor)
            }
        })
    }

    onTransitionIn = () => {
        this.time.addEvent({
            delay:1000,
            callback: this.initMap
        })
    }
}