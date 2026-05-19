// SuspiciousHoursDetector -- flags push events between 14:00 and 16:00

import { Detector } from "./Detector";
import { Alert,GitHubEvent } from "../types";

export class SuspiciousHoursDetector extends Detector {


    canHandle(eventType: string): boolean {
        // returns true if eventType is "push"
        if (eventType === "push"){
            return true; 
        }
        return false; 
    }

    detect(event: GitHubEvent): Alert | null {
        // changed to account for pushing timezone; github timestamp already include committer's timezone 
        const pushedAt = event.payload.head_commit?.timestamp; 
        if(!pushedAt) return null; 
        // const currentHour = new Date().getHours();
        const hour = new Date(pushedAt).getHours(); 
        if(hour >= 14 && hour < 16 ) {
            
            return { eventType: event.type, 
                description: "Suspicous push detected during restricted hours 14:00-16:00 ",
                detectedAt: new Date().toISOString(),
                payload: event.payload  }; 
        }; 
        return null; 
    }
}