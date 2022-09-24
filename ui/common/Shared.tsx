import * as React from 'react'
// import { btnDown, btnUp, downCursor, iconSheet, modalLeftCap, modalRepeat, modalRightCap } from '../assets/Assets'
import { IconIndexes } from '../../enum'
import { iconSheet } from '../assets/Assets'
import AppStyles from '../styles/AppStyles'
import Tooltip from 'rc-tooltip'

export const TopBar = (text:string|JSX.Element) => 
    <div style={AppStyles.topBar}>
        <div style={{width:'33%'}}><hr style={AppStyles.hr}/><hr style={AppStyles.hr}/><hr style={AppStyles.hr}/><hr style={AppStyles.hr}/></div>
            {text}
        <div style={{width:'33%'}}><hr style={AppStyles.hr}/><hr style={AppStyles.hr}/><hr style={AppStyles.hr}/><hr style={AppStyles.hr}/></div>
    </div>

interface ButtonProps {
    enabled:boolean, handler:Function, text:JSX.Element | string, style?:object, icon?: IconIndexes
}

export const Button = (props:ButtonProps) => 
    <div style={{...props.style, ...AppStyles.buttonOuter, pointerEvents: props.enabled ? 'all' : 'none'}} 
        onClick={()=>props.handler()}>
        <div style={{...AppStyles.buttonInner, opacity: props.enabled ? 1 : 0.5}}>
            {props.icon && <span style={{marginRight:'0.5em'}}>{CssIcon(props.icon, true)}</span>}
            {props.text}
        </div>
    </div>

// export const SmallButton = (enabled:boolean, handler:Function, index:number, selected?:boolean) => 
//     <div className="smlbtn" style={{position:'relative', height:'40px', width:'40px', backgroundImage: 'url('+(selected ? btnDown : btnUp)+')', backgroundSize:'contain', display:'flex', justifyContent:"center", alignItems:'center'}} 
//          onClick={enabled ? ()=>{handler()} : null}>
//         <div style={{marginRight:'4px', marginTop:'3px'}}>{CssIcon('', index)}</div>
//         {!enabled && <div style={{position:'absolute', top:4, left:4}}>{CssIcon('', IconIndexes.disabled)}</div>}
//     </div>
    
// export const Modal = (content:JSX.Element) => 
//     <div style={{...AppStyles.modal}}>
//         <div style={{height:'288px', width:'32px', backgroundImage: 'url('+modalLeftCap+')', backgroundSize:'32px',}}/>
//         <div style={{position:'relative', backgroundImage:'url('+modalRepeat+')', backgroundSize:'304px', padding:'40px 10px', maxWidth:'835px'}}>
//             {content}
//             <div style={{position:'absolute', bottom:0, right:-64, width:'64px', height:'64px', cursor:'url('+downCursor+'), auto',}} onClick={()=>{onHideModal(); onCancelPlayerAction();}}/>
//         </div>
//         <div style={{width:'64px', backgroundImage: 'url('+modalRightCap+')', backgroundSize:'64px'}}/>
//     </div>

export const ToggleButton = (state:boolean, handler:any, text:JSX.Element | string) => 
    <div style={{...AppStyles.buttonOuter, color:state ? 'white' : 'black', background:state?'black':'white'}} 
        onClick={handler}>
        <div style={{...AppStyles.buttonInner}}>{text}</div>
    </div>

// export const LightButton = (enabled:boolean, handler:any, text:string, tab?:boolean) => 
//     <div style={{position:'relative'}}>
//         <div onClick={handler} style={{...AppStyles.buttonInner, pointerEvents: enabled ? 'all' : 'none', 
//              textAlign:'center', borderBottom: tab && !enabled ? '1px dashed':'1px solid', borderBottomLeftRadius: tab?0:'3px', borderBottomRightRadius:tab?0:'3px', marginBottom: tab ? '-1px' : 0}}>{text}</div>
//         {!enabled && <div style={{position:'absolute', top:4, left:4}}>{CssIcon('', IconIndexes.disabled)}</div>}
//     </div>
    
// export const NumericInput = (value:number, onValueChange:Function, max?:number, min?:number) => 
//     <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
//         {LightButton(min || min===0 ? value > min:true, ()=>onValueChange(value-1),'<')}
//         <div style={{width:'2em', textAlign:"center"}}>{value}</div>
//         {LightButton(max ? value < max:true, ()=>onValueChange(value+1),'>')}
//     </div>

// export const Select = (value:any, onValueChange:Function, values: Array<any>) => 
//     <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
//         {LightButton(values.findIndex(v=>v===value) > 0, ()=>onValueChange(values[values.findIndex(v=>v===value)-1]),'<')}
//         <div style={{textAlign:"center", backgroundColor:value}}>{value}</div>
//         {LightButton(values.findIndex(v=>v===value) < values.length-1, ()=>onValueChange(values[values.findIndex(v=>v===value)+1]),'>')}
//     </div>

// export const ColorSelect = (value:string, onValueChange:Function, values: Array<string>) => 
//     <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
//         {LightButton(values.findIndex(v=>v===value) > 0, ()=>onValueChange(values[values.findIndex(v=>v===value)-1]),'<')}
//         <div style={{backgroundColor:value, width:'2em', height:'2em'}}/>
//         {LightButton(values.findIndex(v=>v===value) < values.length-1, ()=>onValueChange(values[values.findIndex(v=>v===value)+1]),'>')}
//     </div>

// export const IconSelect = (value:IconNames, onValueChange:Function, values: Array<IconNames>) => 
//     <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
//         {LightButton(values.findIndex(v=>v===value) > 0, ()=>onValueChange(values[values.findIndex(v=>v===value)-1]),'<')}
//         {Icon(value ? value : values[0], false)}
//         {LightButton(values.findIndex(v=>v===value) < values.length-1, ()=>onValueChange(values[values.findIndex(v=>v===value)+1]),'>')}
//     </div>

export const ProgressBar = (value:number, max:number, bg:string) => 
    <div style={{width:'98px', height:'36px',  position:'relative', padding:'2px'}}>
        <div style={{background:'url('+bg+')', backgroundSize:'32px', width:Math.round((value/max)*100)+'%', height:'100%'}}/>
    </div>

export const VerticalProgressBar = (value:number, max:number, bg:string) => 
    <div style={{width:'36px', height:'84px', border:'2px solid white', position:'relative'}}>
        <div style={{background:'url('+bg+')', backgroundSize:'32px', height:Math.round((value/max)*100)+'%', width:'100%',position:"absolute", bottom:'10%'}}/>
    </div>

export const CssIcon = (spriteIndex:IconIndexes, noTooltip?:boolean) => {
    let backgroundImage = 'url('+iconSheet+')'
    let sheetWidth = 10

    return noTooltip ? <div style={{
        width:'16px', 
        height: '16px',
        marginLeft:'10px', 
        marginRight:'10px',
        backgroundImage, 
        backgroundPosition: -(spriteIndex % sheetWidth)*16+'px '+-(Math.floor(spriteIndex/sheetWidth))*16+'px', 
        backgroundRepeat:'no-repeat',
        transform:'scale(2)',
        display:'inline-block'}}/> : 
        <Tooltip overlay={<div><h4>{getDescription(spriteIndex)}</h4></div>}>
            <div style={{
                width:'16px', 
                height: '16px',
                marginLeft:'10px', 
                marginRight:'10px',
                backgroundImage, 
                backgroundPosition: -(spriteIndex % sheetWidth)*16+'px '+-(Math.floor(spriteIndex/sheetWidth))*16+'px', 
                backgroundRepeat:'no-repeat',
                transform:'scale(2)',
                display:'inline-block'}}/>
        </Tooltip>
} 
        
const getDescription = (index:IconIndexes) => {
    switch(index){
        case IconIndexes.Com: return <div>{CssIcon(IconIndexes.COM, true)} buildings generate trash when near {CssIcon(IconIndexes.IND, true)} buildings</div>
        case IconIndexes.Credits: return <div>{CssIcon(IconIndexes.Demolish, true)} credit is used to destroy buildings</div>
        case IconIndexes.Demolish: return <div>{CssIcon(IconIndexes.Demolish, true)} credit used to destroy buildings.</div>
        case IconIndexes.Ind: return <div>{CssIcon(IconIndexes.IND, true)} buildings generate trash when near {CssIcon(IconIndexes.COM, true)} buildings</div>
        case IconIndexes.Jobs: return <div>Jobs {CssIcon(IconIndexes.Jobs, true)} lost cause {CssIcon(IconIndexes.citizens, true)} to be uploaded to the metaverse</div>
        case IconIndexes.Trash: return <div>{CssIcon(IconIndexes.Trash, true)} credits are awarded based on the trash production of the building</div>
        case IconIndexes.Res: return <div>{CssIcon(IconIndexes.RES, true)} buildings generate trash when near {CssIcon(IconIndexes.COM, true)} buildings</div>
        case IconIndexes.citizens: return <div>Buildings with {CssIcon(IconIndexes.citizens, true)} cannot be deleted. {CssIcon(IconIndexes.citizens, true)} are uploaded when Jobs {CssIcon(IconIndexes.Jobs, true)} are destroyed</div>
        case IconIndexes.Power: return <div>Buildings without {CssIcon(IconIndexes.Power, true)} generate less trash</div>
        case IconIndexes.RES: return 'Residential Building'
        case IconIndexes.IND: return 'Industrial Building'
        case IconIndexes.COM: return 'Commercial Building'
        case IconIndexes.Police: return 'Number of citizens uploaded to the metaverse'
        case IconIndexes.Temple: return <div>Unemployed {CssIcon(IconIndexes.citizens, true)} are uploaded here to awaken later.</div>
    }
}
