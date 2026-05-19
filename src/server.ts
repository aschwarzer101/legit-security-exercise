import express from "express"; 
import { createServer } from "http"; 
import { DetectionEngine } from "./DetectionEngine";
import { WebSocketServer, WebSocket } from "ws";
import { SuspiciousHoursDetector } from "./detectors/SuspiciousHoursDetector";
import { TestSuspiciousHoursDetector } from "./detectors/TestSuspiciousHoursDetector";
import { HackerTeamDetector } from "./detectors/HackerTeamDetector";
import { RepoLifecycleDetector } from "./detectors/RepoLifecycleDetector";
import { ConsoleNotifier } from "./notifiers/ConsoleNotifier";
import { WebSocketNotifier } from "./notifiers/WebSocketNotifier";
import { GitHubEvent } from "./types";

const app = express(); 

app.use(express.json()); 

// http sever with websocket sever attatched
const httpServer = createServer(app); 
const wss = new WebSocketServer({server: httpServer }); 

// track connected clients 
const clients: Set<WebSocket> = new Set(); 

wss.on("connection", (ws) => {
    clients.add(ws);
    console.log("Dashboard connected"); 
    ws.on("close", () => clients.delete(ws)); 
}); 

//broadcast function - sends alert to all connected dashboard clients
export function broadcast(data: object) {
    const message = JSON.stringify(data);
    clients.forEach((client) => {
        if(client.readyState === WebSocket.OPEN){
            client.send(message); 
        }
    }); 
}


const detectors = [ 
    new SuspiciousHoursDetector(), 
    new HackerTeamDetector(), 
    new RepoLifecycleDetector(),
   // new TestSuspiciousHoursDetector() // just for testing outside of normal hours
]; 
const notifiers = [new ConsoleNotifier(), new WebSocketNotifier(broadcast)]; 
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
httpServer.listen(PORT, () => {
    console.log(`Webhook server listening on port ${PORT}`); 
}); 