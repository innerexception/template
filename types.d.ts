interface PhaserResource {
    key:string
    resource: any
    type: string
    data?: any
}

interface RState {
    activeModal: import('./enum').Modal
    engineEvent: import('./enum').UIReducerActions
    isLoaded:boolean
}