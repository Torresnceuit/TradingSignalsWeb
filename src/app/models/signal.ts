
export class Signal {
    Id: string
    Currency: string
    Type: SignalType
    //Lots: number
    OpenPrice: number
    ClosePrice: number
    //Comment: string
    State: SignalState
    Profit: number
    OpenTime: Date
    CloseTime: Date
    Expire: Date
}

export enum SignalType {
    Buy,
    Sell,
    BuyLimit,
    SellLimit,
    BuyStop,
    SellStop
}


export enum SignalState {
    Pending = <any>"Pending",
    Opening = <any>"Opening",
    Closed = <any>"Closed"
}