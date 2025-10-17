'''use client'''

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { PlayCircle, CheckCircle, Loader, AlertCircle } from "lucide-react"

// Define the structure for a log entry
interface LogEntry {
  id: number;
  text: string;
  status: 'pending' | 'in-progress' | 'done' | 'error';
}

// The list of steps the agent will perform, based on the documentation
const scenarioSteps = [
  "Analyzing user input",
  "Generating business plan & marketing strategy",
  "Integrating with external services (APIs, CRMs)",
  "Simulating campaign execution across channels",
  "Applying Budget Optimizer based on initial results",
  "Generating final report and analytics dashboard",
  "Scenario complete."
];

export default function ScenarioRunnerPage() {
  const [goal, setGoal] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunScenario = async () => {
    setIsRunning(true);
    // Initialize logs with all steps as pending
    const initialLog: LogEntry[] = scenarioSteps.map((step, index) => ({
      id: index,
      text: step,
      status: 'pending',
    }));
    setLog(initialLog);

    // Simulate the agent's workflow with delays
    for (let i = 0; i < scenarioSteps.length; i++) {
      // Update current step to 'in-progress'
      setLog(prevLog => prevLog.map(entry => entry.id === i ? { ...entry, status: 'in-progress' } : entry));
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate work

      // Update current step to 'done'
      setLog(prevLog => prevLog.map(entry => entry.id === i ? { ...entry, status: 'done' } : entry));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: LogEntry['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Loader className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
      default:
        return <PlayCircle className="h-5 w-5 text-gray-400" />;
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Scenario Runner</CardTitle>
                <CardDescription>Define a high-level goal and watch the autonomous agent execute the plan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., 'Launch a marketing campaign for a new artisanal coffee shop in San Francisco'"
                    className="mb-2"
                  />
                  <Button onClick={handleRunScenario} disabled={isRunning || !goal}>
                    {isRunning ? "Scenario in Progress..." : "Run Scenario"}
                  </Button>
                </div>

                {log.length > 0 && (
                  <div className="p-4 border rounded-lg bg-gray-900 text-white font-mono">
                    <h3 className="text-lg font-semibold mb-2">Live Agent Log</h3>
                    <div className="space-y-2">
                      {log.map((entry) => (
                        <div key={entry.id} className="flex items-center space-x-3">
                          {getStatusIcon(entry.status)}
                          <span className={`${entry.status === 'done' ? 'text-gray-400' : ''}`}>{entry.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
