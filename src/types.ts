// interfaces used across app 

export interface GitHubEvent {
    type: string; 
    payload: any; 
}

export interface Alert{ 
    eventType: string; 
    description: string; 
    detectedAt: string; 
    payload: any; 
}