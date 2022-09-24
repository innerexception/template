import { Scene } from "phaser";
import { SceneNames } from "../../../enum";
import { resources } from "../../assets/Assets";
import { onShowNewGame } from "../../common/Thunks";

export default class LoadingScene extends Scene {

    preload = () =>
    {
        resources.forEach(asset=>{
            (this.load[asset.type] as any)(asset.key, asset.resource, asset.data)
        })
        const loadbar = this.add.graphics()
        loadbar.fillStyle(0xffffff)
        this.load.on('progress', (value) => {
            loadbar.fillRect(this.cameras.main.centerX-50, this.cameras.main.centerY, value*100, 25)
        });
        this.load.on('complete', () => {
            
        });
    }

    create = () =>
    {
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'logo').setScale(1)
        this.input.mouse.disableContextMenu()
        this.time.addEvent({
            delay:3000,
            callback: () => {
                this.scene.transition({
                    target: SceneNames.Intro,
                    duration: 3000,
                    sleep: true,
                    remove: true,
                    allowInput: false,
                    moveAbove: true,
                    data: null
                })
                onShowNewGame()
            }
        })
    }
}