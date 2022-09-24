import * as React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Maps, Modal } from '../enum';
import Viewport from './components/Viewport';
import NewGame from './components/NewGame';

export default () => {

  const state = useSelector((state:RState)=>state)

  const getModal = () => {
    switch(state.activeModal){
      case Modal.NewGame: return <NewGame/>
      default: return <span/>
    }
  }

  return (
    <div style={{position:'relative', height:'100vh', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center'}}>
      {state.activeModal && <div style={{position:'absolute', height:'fit-content', width:'500px', left:0,right:0,bottom:0,top:0, margin:'auto', zIndex:1}}>{getModal()}</div>}
      <div style={{position:'relative'}}>
        {state.activeModal !== Modal.NewGame && state.isLoaded && <ToolBar/>}
        <Viewport/>
        {state.activeModal !== Modal.NewGame && state.isLoaded && <SelectedBuilding {...state.selectedBuilding}/>}
      </div>
    </div>
  )
}
