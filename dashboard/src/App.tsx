import { useEffect, useState } from "react";

interface Alert {
  eventType: string;
  description: string;
  detectedAt: string;
  payload: any;
}

const severityColor: Record<string, string> = {
  team: "#ef4444",
  push: "#f97316",
  repository: "#eab308",
};

function AlertCard({ alert }: { alert: Alert }) {
  const color = severityColor[alert.eventType] || "#6b7280";
  return (
    <div style={{
      border: `2px solid ${color}`,
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "12px",
      backgroundColor: "#1a1a1a",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ color, fontWeight: "bold", textTransform: "uppercase" }}>
          {alert.eventType}
        </span>
        <span style={{ color: "#9ca3af", fontSize: "12px" }}>
          {new Date(alert.detectedAt).toLocaleTimeString()}
        </span>
      </div>
      <p style={{ color: "#f3f4f6", margin: "0 0 8px 0" }}>{alert.description}</p>
      <details>
        <summary style={{ color: "#9ca3af", cursor: "pointer", fontSize: "12px" }}>
          View payload
        </summary>
        <pre style={{ color: "#9ca3af", fontSize: "11px", overflow: "auto", marginTop: "8px" }}>
          {JSON.stringify(alert.payload, null, 2)}
        </pre>
      </details>
    </div>
  );
}

function App() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (event) => {
      const alert: Alert = JSON.parse(event.data);
      setAlerts((prev) => [alert, ...prev]);
    };

    return () => ws.close();
  }, []);

  return (
    <div style={{
      backgroundColor: "#0f0f0f",
      minHeight: "100vh",
      padding: "32px",
      fontFamily: "monospace",
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h1 style={{ color: "#f3f4f6", margin: 0 }}>🔒 Security Monitor</h1>
          <span style={{
            backgroundColor: connected ? "#166534" : "#7f1d1d",
            color: connected ? "#4ade80" : "#f87171",
            padding: "4px 12px",
            borderRadius: "9999px",
            fontSize: "12px"
          }}>
            {connected ? "● LIVE" : "○ DISCONNECTED"}
          </span>
        </div>

        {alerts.length === 0 ? (
          <p style={{ color: "#6b7280", textAlign: "center", marginTop: "80px" }}>
            No alerts yet. Waiting for suspicious activity...
          </p>
        ) : (
          alerts.map((alert, i) => <AlertCard key={i} alert={alert} />)
        )}
      </div>
    </div>
  );
}

export default App;