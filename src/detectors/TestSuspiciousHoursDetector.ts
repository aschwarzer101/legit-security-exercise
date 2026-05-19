// Test SuspiciousHoursDetector -- flags push events between times apt to chagne 

import { Detector } from "./Detector";
import { Alert,GitHubEvent } from "../types";

export class TestSuspiciousHoursDetector extends Detector {


    canHandle(eventType: string): boolean {
        // returns true if eventType is "push"
        if (eventType === "push"){
            return true; 
        }
        return false; 
    }

    detect(event: GitHubEvent): Alert | null {
        const currentHour = new Date().getHours(); 
        if(currentHour >= 21 && currentHour < 23 ) {
            
            return { eventType: event.type, 
                description: "Suspicous push detected during restricted hours 14:00-16:00 ",
                detectedAt: new Date().toISOString(),
                payload: event.payload  }; 
        }; 
        return null; 
    }
}