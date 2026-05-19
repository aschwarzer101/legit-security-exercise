// DetectionEngine - orchestrates detectors and notifiers

import { Detector } from "./detectors/Detector";
import { Notifier } from "./notifiers/Notifier";
import { GitHubEvent } from "./types";

export class DetectionEngine {

private detectors: Detector[];
private notifiers: Notifier[];

constructor (detectors: Detector[], notifiers: Notifier[]){
   this.detectors = detectors; 
   this.notifiers = notifiers; 
}

// loop through detectors, if it can handle the event, have it detect,
// then loop through notifiers to send alerts 
process(event: GitHubEvent): void {

    this.detectors.forEach(detector => {
        if(detector.canHandle(event.type)) {
            const alert = detector.detect(event); 
           if (alert != null) {
            this.notifiers.forEach(notifier => {
                notifier.notify(alert); 
            });
           }
        }
    });
}
}