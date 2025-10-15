"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, Download, Eye, Edit, CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react"

export default function QualityControlComprehensive() {
  const [activeTab, setActiveTab] = useState("qc-requests")

  // QC Request data
  const qcRequests = [
    {
      id: "QCR-2024-001",
      itemCode: "API-001",
      batchNo: "B240101",
      requestType: "Raw Material",
      priority: "High",
      status: "Pending",
      requestDate: "2024-01-15",
      requester: "John Smith",
    },
    {
      id: "QCR-2024-002",
      itemCode: "FG-001",
      batchNo: "B240102",
      requestType: "Finished Product",
      priority: "Medium",
      status: "In Progress",
      requestDate: "2024-01-14",
      requester: "Sarah Johnson",
    },
    {
      id: "QCR-2024-003",
      itemCode: "PKG-001",
      batchNo: "B240103",
      requestType: "Packaging",
      priority: "Low",
      status: "Completed",
      requestDate: "2024-01-13",
      requester: "Mike Wilson",
    },
  ]

  // QC Test Results data
  const testResults = [
    {
      id: "QCT-2024-001",
      requestId: "QCR-2024-001",
      testMethod: "HPLC-001",
      parameter: "Assay",
      result: "99.2%",
      specification: "98.0-102.0%",
      status: "Pass",
      analyst: "Dr. Smith",
      testDate: "2024-01-16",
    },
    {
      id: "QCT-2024-002",
      requestId: "QCR-2024-001",
      testMethod: "KF-001",
      parameter: "Water Content",
      result: "0.8%",
      specification: "≤1.0%",
      status: "Pass",
      analyst: "Dr. Johnson",
      testDate: "2024-01-16",
    },
    {
      id: "QCT-2024-003",
      requestId: "QCR-2024-002",
      testMethod: "DT-001",
      parameter: "Dissolution",
      result: "85%",
      specification: "≥80%",
      status: "Pass",
      analyst: "Dr. Wilson",
      testDate: "2024-01-15",
    },
  ]

  // QC Inspections data
  const inspections = [
    {
      id: "QCI-2024-001",
      area: "Production Line A",
      inspectionType: "GMP Audit",
      inspector: "Jane Doe",
      scheduledDate: "2024-01-20",
      status: "Scheduled",
      findings: 0,
    },
    {
      id: "QCI-2024-002",
      area: "Warehouse",
      inspectionType: "Storage Conditions",
      inspector: "Bob Smith",
      scheduledDate: "2024-01-18",
      status: "In Progress",
      findings: 2,
    },
    {
      id: "QCI-2024-003",
      area: "QC Lab",
      inspectionType: "Equipment Calibration",
      inspector: "Alice Johnson",
      scheduledDate: "2024-01-15",
      status: "Completed",
      findings: 1,
    },
  ]

  // QC Approvals data
  const approvals = [
    {
      id: "QCA-2024-001",
      documentType: "Batch Record",
      batchNo: "B240101",
      product: "Paracetamol 500mg",
      approver: "QA Manager",
      status: "Pending",
      submittedDate: "2024-01-16",
    },
    {
      id: "QCA-2024-002",
      documentType: "CoA",
      batchNo: "B240102",
      product: "Ibuprofen 200mg",
      approver: "QC Manager",
      status: "Approved",
      submittedDate: "2024-01-15",
    },
    {
      id: "QCA-2024-003",
      documentType: "Deviation Report",
      batchNo: "B240103",
      product: "Aspirin 100mg",
      approver: "QA Director",
      status: "Under Review",
      submittedDate: "2024-01-14",
    },
  ]

  // Non-Conformance data
  const nonConformances = [
    {
      id: "NC-2024-001",
      type: "Product",
      description: "Color variation in tablets",
      severity: "Major",
      batchNo: "B240101",
      reportedBy: "Production",
      status: "Open",
      reportDate: "2024-01-15",
    },
    {
      id: "NC-2024-002",
      type: "Process",
      description: "Temperature deviation",
      severity: "Minor",
      batchNo: "B240102",
      reportedBy: "QA",
      status: "Closed",
      reportDate: "2024-01-14",
    },
    {
      id: "NC-2024-003",
      type: "Documentation",
      description: "Missing signature",
      severity: "Critical",
      batchNo: "B240103",
      reportedBy: "QC",
      status: "Investigation",
      reportDate: "2024-01-13",
    },
  ]

  // Deviations data
  const deviations = [
    {
      id: "DEV-2024-001",
      title: "Mixing time exceeded",
      category: "Process",
      impact: "High",
      batchNo: "B240101",
      initiator: "Production",
      status: "Investigation",
      createdDate: "2024-01-15",
    },
    {
      id: "DEV-2024-002",
      title: "Equipment malfunction",
      category: "Equipment",
      impact: "Medium",
      batchNo: "B240102",
      initiator: "Maintenance",
      status: "CAPA",
      createdDate: "2024-01-14",
    },
    {
      id: "DEV-2024-003",
      title: "Raw material variance",
      category: "Material",
      impact: "Low",
      batchNo: "B240103",
      initiator: "QC",
      status: "Closed",
      createdDate: "2024-01-13",
    },
  ]

  // Stability Tests data
  const stabilityTests = [
    {
      id: "ST-2024-001",
      product: "Paracetamol 500mg",
      batchNo: "B240101",
      condition: "25°C/60% RH",
      timePoint: "3 months",
      status: "Ongoing",
      nextTest: "2024-04-15",
      chamber: "Chamber-01",
    },
    {
      id: "ST-2024-002",
      product: "Ibuprofen 200mg",
      batchNo: "B240102",
      condition: "40°C/75% RH",
      timePoint: "6 months",
      status: "Completed",
      nextTest: "2024-07-15",
      chamber: "Chamber-02",
    },
    {
      id: "ST-2024-003",
      product: "Aspirin 100mg",
      batchNo: "B240103",
      condition: "25°C/60% RH",
      timePoint: "12 months",
      status: "Scheduled",
      nextTest: "2024-01-25",
      chamber: "Chamber-03",
    },
  ]

  // Analytical Methods data
  const analyticalMethods = [
    {
      id: "AM-001",
      methodName: "HPLC Assay for Paracetamol",
      technique: "HPLC",
      version: "1.2",
      status: "Active",
      validatedBy: "Dr. Smith",
      validationDate: "2023-12-01",
      nextReview: "2024-12-01",
    },
    {
      id: "AM-002",
      methodName: "Dissolution Test for Tablets",
      technique: "UV-Vis",
      version: "2.1",
      status: "Active",
      validatedBy: "Dr. Johnson",
      validationDate: "2023-11-15",
      nextReview: "2024-11-15",
    },
    {
      id: "AM-003",
      methodName: "Water Content by KF",
      technique: "Karl Fischer",
      version: "1.0",
      status: "Under Review",
      validatedBy: "Dr. Wilson",
      validationDate: "2023-10-01",
      nextReview: "2024-10-01",
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      "In Progress": { color: "bg-blue-100 text-blue-800", icon: Clock },
      Completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      Pass: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      Fail: { color: "bg-red-100 text-red-800", icon: XCircle },
      Approved: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      "Under Review": { color: "bg-blue-100 text-blue-800", icon: Clock },
      Open: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
      Closed: { color: "bg-gray-100 text-gray-800", icon: CheckCircle },
      Investigation: { color: "bg-orange-100 text-orange-800", icon: AlertTriangle },
      CAPA: { color: "bg-purple-100 text-purple-800", icon: AlertTriangle },
      Ongoing: { color: "bg-blue-100 text-blue-800", icon: Clock },
      Scheduled: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      Active: { color: "bg-green-100 text-green-800", icon: CheckCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-100 text-gray-800",
      icon: Clock,
    }
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quality Control Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8 max-w-6xl">
          <TabsTrigger value="qc-requests">QC Requests</TabsTrigger>
          <TabsTrigger value="test-results">Test Results</TabsTrigger>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="non-conformance">Non-Conformance</TabsTrigger>
          <TabsTrigger value="deviations">Deviations</TabsTrigger>
          <TabsTrigger value="stability">Stability Tests</TabsTrigger>
          <TabsTrigger value="methods">Analytical Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="qc-requests" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>QC Requests</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search requests..." className="pl-8 w-64" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Request ID</th>
                      <th className="text-left p-2">Item Code</th>
                      <th className="text-left p-2">Batch No</th>
                      <th className="text-left p-2">Request Type</th>
                      <th className="text-left p-2">Priority</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Request Date</th>
                      <th className="text-left p-2">Requester</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qcRequests.map((request) => (
                      <tr key={request.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{request.id}</td>
                        <td className="p-2">{request.itemCode}</td>
                        <td className="p-2">{request.batchNo}</td>
                        <td className="p-2">{request.requestType}</td>
                        <td className="p-2">
                          <Badge
                            variant={
                              request.priority === "High"
                                ? "destructive"
                                : request.priority === "Medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {request.priority}
                          </Badge>
                        </td>
                        <td className="p-2">{getStatusBadge(request.status)}</td>
                        <td className="p-2">{request.requestDate}</td>
                        <td className="p-2">{request.requester}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test-results" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>QC Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Test ID</th>
                      <th className="text-left p-2">Request ID</th>
                      <th className="text-left p-2">Test Method</th>
                      <th className="text-left p-2">Parameter</th>
                      <th className="text-left p-2">Result</th>
                      <th className="text-left p-2">Specification</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Analyst</th>
                      <th className="text-left p-2">Test Date</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testResults.map((result) => (
                      <tr key={result.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{result.id}</td>
                        <td className="p-2">{result.requestId}</td>
                        <td className="p-2">{result.testMethod}</td>
                        <td className="p-2">{result.parameter}</td>
                        <td className="p-2 font-medium">{result.result}</td>
                        <td className="p-2">{result.specification}</td>
                        <td className="p-2">{getStatusBadge(result.status)}</td>
                        <td className="p-2">{result.analyst}</td>
                        <td className="p-2">{result.testDate}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inspections" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>QC Inspections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Inspection ID</th>
                      <th className="text-left p-2">Area</th>
                      <th className="text-left p-2">Inspection Type</th>
                      <th className="text-left p-2">Inspector</th>
                      <th className="text-left p-2">Scheduled Date</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Findings</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspections.map((inspection) => (
                      <tr key={inspection.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{inspection.id}</td>
                        <td className="p-2">{inspection.area}</td>
                        <td className="p-2">{inspection.inspectionType}</td>
                        <td className="p-2">{inspection.inspector}</td>
                        <td className="p-2">{inspection.scheduledDate}</td>
                        <td className="p-2">{getStatusBadge(inspection.status)}</td>
                        <td className="p-2">
                          <Badge variant={inspection.findings > 0 ? "destructive" : "secondary"}>
                            {inspection.findings} findings
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>QC Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Approval ID</th>
                      <th className="text-left p-2">Document Type</th>
                      <th className="text-left p-2">Batch No</th>
                      <th className="text-left p-2">Product</th>
                      <th className="text-left p-2">Approver</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Submitted Date</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvals.map((approval) => (
                      <tr key={approval.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{approval.id}</td>
                        <td className="p-2">{approval.documentType}</td>
                        <td className="p-2">{approval.batchNo}</td>
                        <td className="p-2">{approval.product}</td>
                        <td className="p-2">{approval.approver}</td>
                        <td className="p-2">{getStatusBadge(approval.status)}</td>
                        <td className="p-2">{approval.submittedDate}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="non-conformance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Non-Conformance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">NC ID</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Description</th>
                      <th className="text-left p-2">Severity</th>
                      <th className="text-left p-2">Batch No</th>
                      <th className="text-left p-2">Reported By</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Report Date</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nonConformances.map((nc) => (
                      <tr key={nc.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{nc.id}</td>
                        <td className="p-2">{nc.type}</td>
                        <td className="p-2">{nc.description}</td>
                        <td className="p-2">
                          <Badge
                            variant={
                              nc.severity === "Critical"
                                ? "destructive"
                                : nc.severity === "Major"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {nc.severity}
                          </Badge>
                        </td>
                        <td className="p-2">{nc.batchNo}</td>
                        <td className="p-2">{nc.reportedBy}</td>
                        <td className="p-2">{getStatusBadge(nc.status)}</td>
                        <td className="p-2">{nc.reportDate}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deviations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>QC Deviations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Deviation ID</th>
                      <th className="text-left p-2">Title</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-left p-2">Impact</th>
                      <th className="text-left p-2">Batch No</th>
                      <th className="text-left p-2">Initiator</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Created Date</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deviations.map((deviation) => (
                      <tr key={deviation.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{deviation.id}</td>
                        <td className="p-2">{deviation.title}</td>
                        <td className="p-2">{deviation.category}</td>
                        <td className="p-2">
                          <Badge
                            variant={
                              deviation.impact === "High"
                                ? "destructive"
                                : deviation.impact === "Medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {deviation.impact}
                          </Badge>
                        </td>
                        <td className="p-2">{deviation.batchNo}</td>
                        <td className="p-2">{deviation.initiator}</td>
                        <td className="p-2">{getStatusBadge(deviation.status)}</td>
                        <td className="p-2">{deviation.createdDate}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stability" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Stability Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Study ID</th>
                      <th className="text-left p-2">Product</th>
                      <th className="text-left p-2">Batch No</th>
                      <th className="text-left p-2">Condition</th>
                      <th className="text-left p-2">Time Point</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Next Test</th>
                      <th className="text-left p-2">Chamber</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stabilityTests.map((test) => (
                      <tr key={test.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{test.id}</td>
                        <td className="p-2">{test.product}</td>
                        <td className="p-2">{test.batchNo}</td>
                        <td className="p-2">{test.condition}</td>
                        <td className="p-2">{test.timePoint}</td>
                        <td className="p-2">{getStatusBadge(test.status)}</td>
                        <td className="p-2">{test.nextTest}</td>
                        <td className="p-2">{test.chamber}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytical Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Method ID</th>
                      <th className="text-left p-2">Method Name</th>
                      <th className="text-left p-2">Technique</th>
                      <th className="text-left p-2">Version</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Validated By</th>
                      <th className="text-left p-2">Validation Date</th>
                      <th className="text-left p-2">Next Review</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticalMethods.map((method) => (
                      <tr key={method.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{method.id}</td>
                        <td className="p-2">{method.methodName}</td>
                        <td className="p-2">{method.technique}</td>
                        <td className="p-2">{method.version}</td>
                        <td className="p-2">{getStatusBadge(method.status)}</td>
                        <td className="p-2">{method.validatedBy}</td>
                        <td className="p-2">{method.validationDate}</td>
                        <td className="p-2">{method.nextReview}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
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
