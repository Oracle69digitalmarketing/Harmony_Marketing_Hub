'''use client'''

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface ComplianceCheck {
  checkId: string;
  checkName: string;
  status: 'Passed' | 'Failed' | 'In Progress';
  lastChecked: string;
  details: string;
}

export default function CompliancePage() {
  const [checks, setChecks] = useState<ComplianceCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/compliance');
        if (!response.ok) {
          throw new Error('Failed to fetch compliance data');
        }
        const data = await response.json();
        setChecks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'Passed':
        return <Badge variant="default" className="bg-green-500">Passed</Badge>;
      case 'Failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'In Progress':
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>

            <Card>
              <CardHeader>
                <CardTitle>Data Privacy & Regulation Status</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading && <p>Loading compliance checks...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!isLoading && !error && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Check</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead className="text-right">Last Checked</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {checks.length > 0 ? (
                        checks.map((check) => (
                          <TableRow key={check.checkId}>
                            <TableCell className="font-medium">{check.checkName}</TableCell>
                            <TableCell>{getStatusBadge(check.status)}</TableCell>
                            <TableCell className="text-muted-foreground">{check.details}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{new Date(check.lastChecked).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">No compliance checks found.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
