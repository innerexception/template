import { GameObjects, Geom, Scene, Tilemaps } from "phaser"
import { store } from "../..";

export const drawCirclePercent = (x:number, y:number, g:GameObjects.Graphics, percent:number) => {
    let points = new Geom.Ellipse(x, y, 6, 4).getPoints(25)
    g.clear()
    g.lineStyle(4, 0xffffff)
    g.strokePoints(points.slice(0, Math.round(25*percent)))
    g.lineStyle(1, 0x000000)
    g.strokeEllipse(x, y, 10, 8)
    g.strokeEllipse(x, y, 4, 2)
}

const rect_dim = 32

export const transitionOut = (scene:Scene, nextScene:string, cb:Function) => {
    let rects = []
    let rows = scene.cameras.default.width/rect_dim
    let cols = scene.cameras.default.height/rect_dim
    for(var i=0; i<=rows*2; i++){
        for(var j=0; j<=cols*2; j++){
            let rect = scene.add.image(i*rect_dim, j*rect_dim, 'black')
            rect.setDisplaySize(rect_dim,rect_dim).setDepth(5).setVisible(false)
            rects.push(rect)
        } 
    }
    rects.forEach(r=>{
        scene.time.addEvent({
            delay: Phaser.Math.Between(250,750),
            callback: ()=>{
                r.setVisible(true)
            }
        })
    })
    scene.time.addEvent({
        delay: 800,
        callback:()=>{
            scene.scene.sendToBack(scene.scene.key)
            scene.scene.sleep(scene.scene.key)
            scene.scene.start(nextScene)
            scene.scene.bringToTop(nextScene)
            cb()
            scene.time.addEvent({
                delay:200,
                callback:()=>{
                    rects.forEach(r=>r.destroy())
                }
            })
        }
    })
}

export const transitionIn = (scene:Scene) => {
    let rects = []
    let rows = scene.cameras.default.width/rect_dim
    let cols = scene.cameras.default.height/rect_dim
    for(var i=0; i<=rows; i++){
        for(var j=0; j<=cols; j++){
            let rect = scene.add.image(i*rect_dim, j*rect_dim, 'black')
            rect.setDisplaySize(rect_dim,rect_dim).setDepth(5)
            rects.push(rect)
        } 
    }
    rects.forEach(r=>{
        scene.time.addEvent({
            delay: Phaser.Math.Between(250,750),
            callback: ()=>{
                r.destroy()
            }
        })
    });
    (scene as any).onTransitionIn()
}

export const DIRS = {
	4: [[0, -1], [-1, 0], [1, 0], [0, 1]],
	8: [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]],
	6: [[-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1], [-2, 0]]
};

export const Pollution = [174, 280, 175, 138, 173, 136, 174, 280, 208, 244, 66, 102, 64, 173, 65, 174]

export const updatePollution = (tileX:number, tileY:number, map:Tilemaps.Tilemap, shouldDelete:boolean) => {
    if(shouldDelete) map.removeTileAt(tileX, tileY, true, true, Layers.Pollution)
    else updatePollutionTileIndex(tileX, tileY, map)
    DIRS[4].forEach(tuple=>{
        const neighbor = map.getTileAt(tileX+tuple[0], tileY+tuple[1], false, Layers.Pollution)
        if(neighbor) updatePollutionTileIndex(neighbor.x, neighbor.y, map)
    })
}

const updatePollutionTileIndex = (tileX:number, tileY:number, map:Tilemaps.Tilemap) => {
    let index = 0
    DIRS[4].forEach((tuple,i)=>{
        const neighbor = map.getTileAt(tileX+tuple[0], tileY+tuple[1], false, Layers.Pollution)
        if(neighbor){
            index += Math.pow(2, i)
        }
    })
    map.putTileAt(Pollution[index]+1, tileX, tileY, true, Layers.Pollution)
}
