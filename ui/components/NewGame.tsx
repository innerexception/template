import * as React from 'react'
import { useEffect } from 'react'
import { Maps } from '../../enum';
import { Button } from '../common/Shared';
import { onContinue, onShowMaps } from '../common/Thunks';
import { getNewMapState } from '../common/Utils';
import AppStyles from '../styles/AppStyles';

export default () => {
    useEffect(()=>{
        const save = JSON.parse(localStorage.getItem('degrowth_save')) as MapSave
        if(!save){
            localStorage.setItem('degrowth_save', JSON.stringify(getNewMapState(Maps.map1, [], 0)))
        } 
    },[])
    return (
        <div style={{...AppStyles.modal, margin:'auto'}}>
            <h3 style={{textAlign:'center', marginBottom:'0.5em'}}>DEGROWTH</h3>
            <div style={{marginBottom:'0.5em'}}>
                <Button text="Continue" enabled={true} handler={onContinue} style={{border:'1px solid white', padding:'5px'}}/>
            </div>
            <div style={{marginBottom:'0.5em'}}>
                <Button text="New" enabled={true} handler={onShowMaps} style={{border:'1px solid white', padding:'5px'}}/>
            </div>
        </div>
    )
}
    