// Detector - abstract base class for all detectors 
// every new detector extend this class and implement both method

import { Alert, GitHubEvent } from "../types";

export abstract class Detector {
    //return true if detector knows how to handle given event type 
    abstract canHandle(eventType: string): boolean; 

    //analyzes the event and returns an Alert if suspicious, null or not 
    abstract detect(event: GitHubEvent): Alert | null; 
}