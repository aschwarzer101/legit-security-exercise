// RepeLifecycleDetector - flags repos created and deleted within 10 minutes
import { Detector } from "./Detector";
import { Alert,GitHubEvent } from "../types";

export class RepoLifecycleDetector extends Detector { 

    // in-memory store of repo creation times
    // key: repo name, value: timestamp when key repo was created 

    private repoCreationTime: Map<string, number> = new Map(); 

    // returns true if event type is "repository"
    canHandle(eventType: string): boolean {
        return eventType === "repository"; 
    }

    // detects if creation and deletion actions occur within 10 minutes of each other
    // note: Date.now returns in miliseconds, difference checking: 10 min = 600000 ms
    detect(event: GitHubEvent): Alert | null {
        
        const repoName = event.payload.repository.name; 
        const action = event.payload.action; 

        if (action === "created") {
            this.repoCreationTime.set(repoName, Date.now()); 
        }

        if (action === "deleted") {
            // change: if creation not tracked in Map then will pull created at time from event payload instead
            const createdAt = this.repoCreationTime.get(repoName)
                ?? new Date(event.payload.repository.created_at).getTime();
            this.repoCreationTime.delete(repoName); 
            if (createdAt && Date.now() - createdAt < 600000) {
               
                    return {
                        eventType: event.type,
                        description: "Repository deleted wthin 10 minutes of creation",
                        detectedAt: new Date().toISOString(), 
                        payload: event.payload
                    }
                
            }
        }
        return null; 
    }


}