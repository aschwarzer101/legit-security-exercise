import { Notifier } from "./Notifier";
import { Alert } from "../types";

export class WebSocketNotifier implements Notifier{
    private broadcast: (data: object) => void; 

    constructor(broadcast: (data: object) => void ) {
        this.broadcast = broadcast; 
    }

    notify(alert: Alert): void {
        this.broadcast(alert); 
    }
}