// Notifier.ts - interface for all notification methods
// implement this in adding new ways of alerting (email, Slack, etc); 

import { Alert } from "../types"; 

export interface Notifier {
    notify(alert: Alert) : void; 
}