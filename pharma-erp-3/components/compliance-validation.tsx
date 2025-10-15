"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Shield, FileCheck, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export default function ComplianceValidation() {
  const [activeTab, setActiveTab] = useState("electronic-signatures")

  const electronicSignatures = [
    {
      id: "ES001",
      document: "Batch Record BR-2024-001",
      signer: "John Smith",
      role: "Production Manager",
      timestamp: "2024-01-20 14:30:25",
      status: "Signed",
      reason: "Batch Release Approval",
    },
    {
      id: "ES002",
      document: "QC Test Result QT-2024-045",
      signer: "Sarah Johnson",
      role: "QC Analyst",
      timestamp: "2024-01-20 16:45:12",
      status: "Pending",
      reason: "Test Result Verification",
    },
    {
      id: "ES003",
      document: "Deviation Report DEV-2024-003",
      signer: "Mike Wilson",
      role: "Quality Manager",
      timestamp: "2024-01-19 11:20:08",
      status: "Signed",
      reason: "Deviation Investigation Closure",
    },
  ]

  const auditTrails = [
    {
      id: "AT001",
      user: "admin@pharma.com",
      action: "Record Modified",
      module: "Batch Records",
      record: "BR-2024-001",
      timestamp: "2024-01-20 14:30:25",
      ipAddress: "192.168.1.100",
      details: "Updated batch yield from 98.5% to 98.7%",
    },
    {
      id: "AT002",
      user: "qc.analyst@pharma.com",
      action: "Test Result Entered",
      module: "Quality Control",
      record: "QT-2024-045",
      timestamp: "2024-01-20 16:45:12",
      ipAddress: "192.168.1.105",
      details: "Entered dissolution test results",
    },
    {
      id: "AT003",
      user: "prod.manager@pharma.com",
      action: "Batch Released",
      module: "Production",
      record: "BR-2024-001",
      timestamp: "2024-01-20 17:15:30",
      ipAddress: "192.168.1.102",
      details: "Batch approved for distribution",
    },
  ]

  const validationRecords = [
    {
      id: "VR001",
      system: "Manufacturing Execution System",
      type: "IQ/OQ/PQ",
      status: "Validated",
      validationDate: "2024-01-15",
      expiryDate: "2025-01-15",
      validator: "Validation Team A",
      riskLevel: "High",
    },
    {
      id: "VR002",
      system: "LIMS Integration",
      type: "Computer System Validation",
      status: "In Progress",
      validationDate: "",
      expiryDate: "",
      validator: "Validation Team B",
      riskLevel: "Medium",
    },
    {
      id: "VR003",
      system: "ERP Financial Module",
      type: "GxP Assessment",
      status: "Validated",
      validationDate: "2023-12-20",
      expiryDate: "2024-12-20",
      validator: "External Consultant",
      riskLevel: "Low",
    },
  ]

  const cfr21Part11 = [
    {
      id: "CFR001",
      requirement: "Electronic Signatures",
      status: "Compliant",
      lastAudit: "2024-01-10",
      nextAudit: "2024-07-10",
      findings: 0,
      actions: 0,
    },
    {
      id: "CFR002",
      requirement: "Audit Trails",
      status: "Compliant",
      lastAudit: "2024-01-08",
      nextAudit: "2024-07-08",
      findings: 0,
      actions: 0,
    },
    {
      id: "CFR003",
      requirement: "System Access Controls",
      status: "Minor Deviation",
      lastAudit: "2024-01-12",
      nextAudit: "2024-07-12",
      findings: 2,
      actions: 1,
    },
    {
      id: "CFR004",
      requirement: "Data Integrity",
      status: "Compliant",
      lastAudit: "2024-01-05",
      nextAudit: "2024-07-05",
      findings: 0,
      actions: 0,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-emerald-800">Compliance & Validation</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search compliance records..." className="pl-8 w-64" />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-1" />
            New Validation
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="electronic-signatures">E-Signatures</TabsTrigger>
          <TabsTrigger value="audit-trails">Audit Trails</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="cfr21-part11">21 CFR Part 11</TabsTrigger>
        </TabsList>

        <TabsContent value="electronic-signatures">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Electronic Signatures Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-2 font-medium">Signature ID</th>
                      <th className="text-left p-2 font-medium">Document</th>
                      <th className="text-left p-2 font-medium">Signer</th>
                      <th className="text-left p-2 font-medium">Role</th>
                      <th className="text-left p-2 font-medium">Timestamp</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Reason</th>
                      <th className="text-left p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {electronicSignatures.map((signature) => (
                      <tr key={signature.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-xs">{signature.id}</td>
                        <td className="p-2 font-medium">{signature.document}</td>
                        <td className="p-2">{signature.signer}</td>
                        <td className="p-2">{signature.role}</td>
                        <td className="p-2 text-xs font-mono">{signature.timestamp}</td>
                        <td className="p-2">
                          <Badge variant={signature.status === "Signed" ? "default" : "secondary"} className="text-xs">
                            {signature.status === "Signed" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {signature.status}
                          </Badge>
                        </td>
                        <td className="p-2">{signature.reason}</td>
                        <td className="p-2">
                          <Button variant="ghost" size="sm">
                            Verify
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit-trails">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Audit Trail Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-2 font-medium">Trail ID</th>
                      <th className="text-left p-2 font-medium">User</th>
                      <th className="text-left p-2 font-medium">Action</th>
                      <th className="text-left p-2 font-medium">Module</th>
                      <th className="text-left p-2 font-medium">Record</th>
                      <th className="text-left p-2 font-medium">Timestamp</th>
                      <th className="text-left p-2 font-medium">IP Address</th>
                      <th className="text-left p-2 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditTrails.map((trail) => (
                      <tr key={trail.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-xs">{trail.id}</td>
                        <td className="p-2 text-xs">{trail.user}</td>
                        <td className="p-2 font-medium">{trail.action}</td>
                        <td className="p-2">{trail.module}</td>
                        <td className="p-2 font-mono text-xs">{trail.record}</td>
                        <td className="p-2 text-xs font-mono">{trail.timestamp}</td>
                        <td className="p-2 text-xs font-mono">{trail.ipAddress}</td>
                        <td className="p-2 text-xs max-w-xs truncate">{trail.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                System Validation Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-2 font-medium">Validation ID</th>
                      <th className="text-left p-2 font-medium">System</th>
                      <th className="text-left p-2 font-medium">Type</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Validation Date</th>
                      <th className="text-left p-2 font-medium">Expiry Date</th>
                      <th className="text-left p-2 font-medium">Validator</th>
                      <th className="text-left p-2 font-medium">Risk Level</th>
                      <th className="text-left p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validationRecords.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-xs">{record.id}</td>
                        <td className="p-2 font-medium">{record.system}</td>
                        <td className="p-2">{record.type}</td>
                        <td className="p-2">
                          <Badge variant={record.status === "Validated" ? "default" : "secondary"} className="text-xs">
                            {record.status}
                          </Badge>
                        </td>
                        <td className="p-2 text-xs">{record.validationDate || "Pending"}</td>
                        <td className="p-2 text-xs">{record.expiryDate || "N/A"}</td>
                        <td className="p-2">{record.validator}</td>
                        <td className="p-2">
                          <Badge
                            variant={
                              record.riskLevel === "High"
                                ? "destructive"
                                : record.riskLevel === "Medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {record.riskLevel}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cfr21-part11">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                21 CFR Part 11 Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-2 font-medium">Requirement ID</th>
                      <th className="text-left p-2 font-medium">Requirement</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Last Audit</th>
                      <th className="text-left p-2 font-medium">Next Audit</th>
                      <th className="text-left p-2 font-medium">Findings</th>
                      <th className="text-left p-2 font-medium">Open Actions</th>
                      <th className="text-left p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cfr21Part11.map((requirement) => (
                      <tr key={requirement.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-xs">{requirement.id}</td>
                        <td className="p-2 font-medium">{requirement.requirement}</td>
                        <td className="p-2">
                          <Badge
                            variant={requirement.status === "Compliant" ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {requirement.status === "Compliant" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 mr-1" />
                            )}
                            {requirement.status}
                          </Badge>
                        </td>
                        <td className="p-2 text-xs">{requirement.lastAudit}</td>
                        <td className="p-2 text-xs">{requirement.nextAudit}</td>
                        <td className="p-2 text-center">
                          <Badge variant={requirement.findings > 0 ? "destructive" : "secondary"} className="text-xs">
                            {requirement.findings}
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          <Badge variant={requirement.actions > 0 ? "default" : "secondary"} className="text-xs">
                            {requirement.actions}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Button variant="ghost" size="sm">
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
