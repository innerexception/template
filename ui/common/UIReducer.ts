import { BuildingType, Maps, MapSequence, Modal, UIReducerActions } from "../../enum";
import { getInitialState, getNewMapState } from "./Utils";

interface DispatchAction {
    type: UIReducerActions
    data?: any
}

const appReducer = (state:RState = getInitialState(), action: DispatchAction): RState => {
    state.engineEvent = null
    switch (action.type) {
        case UIReducerActions.UPDATE:
            localStorage.setItem('degrowth_save', JSON.stringify(action.data))
            return { ...state, mySave: action.data }
        default:
            return state
    }
};

export default appReducer;