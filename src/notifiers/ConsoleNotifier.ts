// Console Notifier - logs alert details  to console 
import { Notifier } from "./Notifier";
import { Alert } from "../types";

export class ConsoleNotifier implements Notifier {

    notify(alert: Alert): void {
        console.log(
            
            `SUSPICIOUS ACTIVITY DETECTED  
            Event: ${alert.eventType}
            Description:  ${alert.description}
            Detected At: ${alert.detectedAt} 
            Payload: ${JSON.stringify(alert.payload, null, 2)}
            `); 
    }
}