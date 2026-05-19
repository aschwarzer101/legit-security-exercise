import express from "express"; 
import { DetectionEngine } from "./DetectionEngine";
import { SuspiciousHoursDetector } from "./detectors/SuspiciousHoursDetector";
import { TestSuspiciousHoursDetector } from "./detectors/TestSuspiciousHoursDetector";
import { HackerTeamDetector } from "./detectors/HackerTeamDetector";
import { RepoLifecycleDetector } from "./detectors/RepoLifecycleDetector";
import { ConsoleNotifier } from "./notifiers/ConsoleNotifier";
import { GitHubEvent } from "./types";

const app = express(); 

app.use(express.json()); 

const detectors = [ 
    new SuspiciousHoursDetector(), 
    new HackerTeamDetector(), 
    new RepoLifecycleDetector(),
   //  new TestSuspiciousHoursDetector() just for testing outside of normal hours
]; 
const notifiers = [new ConsoleNotifier()]; 
const detectionEngine = new DetectionEngine(detectors, notifiers); 


// webhook endpoint - GitHub will Post all events here
app.post( "/webhook", (req, res) => {
    const eventType = req.headers["x-github-event"] as string; 
    const payload = req.body; 

    const event: GitHubEvent = {
        type: eventType, 
        payload: payload
    }; 

    // pass the event to the detection engine for processing 
    detectionEngine.process(event); 

    res.status(200).send("OK"); 
}); 

const PORT = 3000; 
app.listen(PORT, () => {
    console.log(`Webhook server listening on port ${PORT}`); 
}); 