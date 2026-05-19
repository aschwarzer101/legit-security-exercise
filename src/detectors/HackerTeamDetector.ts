// Hacker team detector- detects if team is created with prefix "hacker"
import { Detector } from "./Detector";
import { Alert,GitHubEvent } from "../types";

export class HackerTeamDetector extends Detector{
    
    // will return true if eventType is "team"
    canHandle(eventType: string): boolean {
        return eventType === "team" 
    }

    // detect if event.payload.team.name starts with hacker
    detect(event: GitHubEvent): Alert | null {
        if (event.payload.team.name.startsWith("hacker")){
            return {
                eventType: event.type,
                description: "Team created with Hacker prefix", 
                detectedAt: new Date().toISOString(),
                payload: event.payload
            }
        }; 
        return null; 
    }
}