"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Download,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Shield,
  FileText,
  Calendar,
  User,
  Award,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface QualityTest {
  id: string
  testNumber: string
  batchNumber: string
  productName: string
  testType: "identity" | "purity" | "potency" | "dissolution" | "microbial" | "stability"
  testDate: string
  completedDate?: string
  status: "pending" | "in-progress" | "passed" | "failed" | "retest"
  priority: "routine" | "urgent" | "critical"
  technician: string
  results: Array<{
    parameter: string
    specification: string
    result: string
    status: "pass" | "fail" | "pending"
  }>
  notes?: string
  approvedBy?: string
  approvalDate?: string
}

interface ComplianceRecord {
  id: string
  recordType: "audit" | "inspection" | "deviation" | "capa" | "change-control"
  title: string
  description: string
  createdDate: string
  dueDate: string
  completedDate?: string
  status: "open" | "in-progress" | "closed" | "overdue"
  severity: "low" | "medium" | "high" | "critical"
  assignedTo: string
  department: string
  regulatoryBody?: string
  documents: Array<{
    name: string
    type: string
    uploadDate: string
  }>
}

interface Audit {
  id: string
  auditNumber: string
  auditType: "internal" | "external" | "regulatory" | "customer"
  title: string
  auditor: string
  auditDate: string
  department: string
  status: "scheduled" | "in-progress" | "completed" | "follow-up"
  findings: number
  criticalFindings: number
  majorFindings: number
  minorFindings: number
  complianceScore: number
}

const mockQualityTests: QualityTest[] = [
  {
    id: "QT001",
    testNumber: "QT-ACE-240815-001",
    batchNumber: "ACE-CAP-240815-001",
    productName: "Acetaminophen 500mg Capsules",
    testType: "potency",
    testDate: "2024-12-08",
    completedDate: "2024-12-08",
    status: "passed",
    priority: "routine",
    technician: "Sarah Chen",
    results: [
      { parameter: "Assay", specification: "95.0-105.0%", result: "98.5%", status: "pass" },
      { parameter: "Content Uniformity", specification: "85.0-115.0%", result: "102.1%", status: "pass" },
      { parameter: "Dissolution", specification: "≥80% in 30 min", result: "89.2%", status: "pass" },
    ],
    approvedBy: "Dr. Michael Rodriguez",
    approvalDate: "2024-12-08",
  },
  {
    id: "QT002",
    testNumber: "QT-IBU-240810-002",
    batchNumber: "IBU-TAB-240810-002",
    productName: "Ibuprofen 200mg Tablets",
    testType: "microbial",
    testDate: "2024-12-07",
    status: "in-progress",
    priority: "urgent",
    technician: "James Wilson",
    results: [
      { parameter: "Total Aerobic Count", specification: "≤1000 CFU/g", result: "Pending", status: "pending" },
      { parameter: "Yeast & Mold", specification: "≤100 CFU/g", result: "Pending", status: "pending" },
      { parameter: "E. coli", specification: "Absent", result: "Pending", status: "pending" },
    ],
  },
  {
    id: "QT003",
    testNumber: "QT-COD-240814-003",
    batchNumber: "COD-LIQ-240814-004",
    productName: "Cough Syrup 120ml",
    testType: "identity",
    testDate: "2024-12-06",
    completedDate: "2024-12-07",
    status: "failed",
    priority: "critical",
    technician: "Lisa Park",
    results: [
      { parameter: "IR Spectrum", specification: "Match Reference", result: "No Match", status: "fail" },
      { parameter: "HPLC Retention Time", specification: "±2% of Reference", result: "5.2% deviation", status: "fail" },
    ],
    notes: "Raw material identity issue suspected. Batch on hold pending investigation.",
  },
]

const mockComplianceRecords: ComplianceRecord[] = [
  {
    id: "CR001",
    recordType: "deviation",
    title: "Temperature Excursion in Cold Storage",
    description: "Temperature monitoring system recorded temperatures above 8°C for 2 hours in cold storage area B",
    createdDate: "2024-12-05",
    dueDate: "2024-12-15",
    status: "in-progress",
    severity: "medium",
    assignedTo: "Facilities Team",
    department: "Quality Assurance",
    documents: [
      { name: "Temperature_Log_120524.pdf", type: "PDF", uploadDate: "2024-12-05" },
      { name: "Investigation_Report_Draft.docx", type: "Word", uploadDate: "2024-12-06" },
    ],
  },
  {
    id: "CR002",
    recordType: "capa",
    title: "Implement Enhanced Cleaning Validation",
    description: "CAPA to address cleaning validation findings from FDA inspection",
    createdDate: "2024-11-20",
    dueDate: "2024-12-20",
    completedDate: "2024-12-08",
    status: "closed",
    severity: "high",
    assignedTo: "Validation Team",
    department: "Manufacturing",
    regulatoryBody: "FDA",
    documents: [
      { name: "CAPA_Plan_Enhanced_Cleaning.pdf", type: "PDF", uploadDate: "2024-11-20" },
      { name: "Validation_Protocol_Rev2.pdf", type: "PDF", uploadDate: "2024-12-01" },
      { name: "Completion_Report.pdf", type: "PDF", uploadDate: "2024-12-08" },
    ],
  },
  {
    id: "CR003",
    recordType: "audit",
    title: "Annual GMP Audit - Production Area",
    description: "Comprehensive GMP audit of production facilities and procedures",
    createdDate: "2024-12-01",
    dueDate: "2024-12-10",
    status: "open",
    severity: "low",
    assignedTo: "QA Manager",
    department: "Quality Assurance",
    documents: [{ name: "Audit_Checklist_2024.xlsx", type: "Excel", uploadDate: "2024-12-01" }],
  },
]

const mockAudits: Audit[] = [
  {
    id: "AUD001",
    auditNumber: "AUD-INT-2024-Q4-001",
    auditType: "internal",
    title: "Q4 2024 Internal GMP Audit",
    auditor: "Internal QA Team",
    auditDate: "2024-12-10",
    department: "Manufacturing",
    status: "scheduled",
    findings: 0,
    criticalFindings: 0,
    majorFindings: 0,
    minorFindings: 0,
    complianceScore: 0,
  },
  {
    id: "AUD002",
    auditNumber: "AUD-FDA-2024-001",
    auditType: "regulatory",
    title: "FDA Pre-Approval Inspection",
    auditor: "FDA District Office",
    auditDate: "2024-11-15",
    department: "All Departments",
    status: "completed",
    findings: 8,
    criticalFindings: 0,
    majorFindings: 2,
    minorFindings: 6,
    complianceScore: 85,
  },
  {
    id: "AUD003",
    auditNumber: "AUD-CUST-2024-003",
    auditType: "customer",
    title: "Customer Quality Audit - PharmaCorp",
    auditor: "PharmaCorp QA Team",
    auditDate: "2024-12-03",
    department: "Quality Control",
    status: "follow-up",
    findings: 3,
    criticalFindings: 0,
    majorFindings: 1,
    minorFindings: 2,
    complianceScore: 92,
  },
]

const getTestStatusIcon = (status: string) => {
  switch (status) {
    case "passed":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "failed":
      return <XCircle className="h-4 w-4 text-red-600" />
    case "in-progress":
      return <Clock className="h-4 w-4 text-blue-600" />
    case "pending":
      return <Clock className="h-4 w-4 text-gray-600" />
    case "retest":
      return <AlertTriangle className="h-4 w-4 text-orange-600" />
    default:
      return null
  }
}

const getStatusBadge = (status: string, type: "test" | "compliance" | "audit") => {
  if (type === "test") {
    const variants = {
      pending: "bg-gray-100 text-gray-800 border-gray-200",
      "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
      passed: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      retest: "bg-orange-100 text-orange-800 border-orange-200",
    }
    return (
      <Badge className={`${variants[status as keyof typeof variants]} text-xs font-medium`}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  if (type === "compliance") {
    const variants = {
      open: "bg-yellow-100 text-yellow-800 border-yellow-200",
      "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
      closed: "bg-green-100 text-green-800 border-green-200",
      overdue: "bg-red-100 text-red-800 border-red-200",
    }
    return (
      <Badge className={`${variants[status as keyof typeof variants]} text-xs font-medium`}>
        {status.replace("-", " ").toUpperCase()}
      </Badge>
    )
  }

  if (type === "audit") {
    const variants = {
      scheduled: "bg-blue-100 text-blue-800 border-blue-200",
      "in-progress": "bg-orange-100 text-orange-800 border-orange-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      "follow-up": "bg-yellow-100 text-yellow-800 border-yellow-200",
    }
    return (
      <Badge className={`${variants[status as keyof typeof variants]} text-xs font-medium`}>
        {status.replace("-", " ").toUpperCase()}
      </Badge>
    )
  }
}

const getSeverityBadge = (severity: string) => {
  const variants = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    critical: "bg-red-100 text-red-800 border-red-200",
  }

  return (
    <Badge className={`${variants[severity as keyof typeof variants]} text-xs font-medium`}>
      {severity.toUpperCase()}
    </Badge>
  )
}

const getPriorityBadge = (priority: string) => {
  const variants = {
    routine: "bg-gray-100 text-gray-800 border-gray-200",
    urgent: "bg-orange-100 text-orange-800 border-orange-200",
    critical: "bg-red-100 text-red-800 border-red-200",
  }

  return (
    <Badge className={`${variants[priority as keyof typeof variants]} text-xs font-medium`}>
      {priority.toUpperCase()}
    </Badge>
  )
}

export function QualityCompliance() {
  const [searchTerm, setSearchTerm] = useState("")
  const [testStatusFilter, setTestStatusFilter] = useState("all")
  const [complianceStatusFilter, setComplianceStatusFilter] = useState("all")

  const filteredTests = mockQualityTests.filter((test) => {
    const matchesSearch =
      test.testNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.productName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = testStatusFilter === "all" || test.status === testStatusFilter

    return matchesSearch && matchesStatus
  })

  const filteredCompliance = mockComplianceRecords.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = complianceStatusFilter === "all" || record.status === complianceStatusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6 bg-green-50/30 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quality Control & Compliance</h1>
          <p className="text-sm text-gray-600 mt-1">Testing protocols and regulatory compliance management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-green-700 hover:bg-green-800">
            <Plus className="h-4 w-4 mr-2" />
            New Test
          </Button>
        </div>
      </div>

      <Tabs defaultValue="quality-tests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="quality-tests">Quality Tests</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
        </TabsList>

        <TabsContent value="quality-tests" className="space-y-6">
          {/* Quality Test Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search tests, batches, products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={testStatusFilter} onValueChange={setTestStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="passed">Passed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="retest">Retest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Quality Tests Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Quality Tests ({filteredTests.length} active)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Test Info
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Product & Batch
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Test Results
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Technician
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Timeline
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTests.map((test, index) => {
                      const passedResults = test.results.filter((r) => r.status === "pass").length
                      const totalResults = test.results.length
                      const resultProgress = totalResults > 0 ? (passedResults / totalResults) * 100 : 0

                      return (
                        <tr
                          key={test.id}
                          className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                        >
                          <td className="p-3">
                            <div>
                              <div className="font-medium text-sm text-gray-900 font-mono">{test.testNumber}</div>
                              <div className="text-xs text-gray-500 capitalize">{test.testType} Test</div>
                              <div className="text-xs text-gray-400">ID: {test.id}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <div className="font-medium text-sm text-gray-900">{test.productName}</div>
                              <div className="text-xs text-gray-600 font-mono">{test.batchNumber}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>{passedResults} passed</span>
                                <span>{totalResults} total</span>
                              </div>
                              <Progress value={resultProgress} className="h-2" />
                              <div className="text-xs text-gray-500">{Math.round(resultProgress)}% complete</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                {getTestStatusIcon(test.status)}
                                {getStatusBadge(test.status, "test")}
                              </div>
                              {getPriorityBadge(test.priority)}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-900">{test.technician}</div>
                                {test.approvedBy && (
                                  <div className="text-xs text-green-600">Approved: {test.approvedBy}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Calendar className="h-3 w-3" />
                                <span>Started: {test.testDate}</span>
                              </div>
                              {test.completedDate && (
                                <div className="text-green-600 text-xs">Completed: {test.completedDate}</div>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Edit</span>
                                ✏️
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">View details</span>
                                👁️
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* Compliance Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search compliance records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={complianceStatusFilter} onValueChange={setComplianceStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Records Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Compliance Records ({filteredCompliance.length} records)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Record Info
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Assignment
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Timeline
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Documents
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCompliance.map((record, index) => (
                      <tr
                        key={record.id}
                        className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                      >
                        <td className="p-3">
                          <div>
                            <div className="font-medium text-sm text-gray-900">{record.title}</div>
                            <div className="text-xs text-gray-500 capitalize">
                              {record.recordType.replace("-", " ")}
                            </div>
                            <div className="text-xs text-gray-400">ID: {record.id}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{record.description}</div>
                          <div className="text-xs text-gray-500">{record.department}</div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-2">
                            {getStatusBadge(record.status, "compliance")}
                            {getSeverityBadge(record.severity)}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <div className="text-sm text-gray-900">{record.assignedTo}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">
                            <div className="text-gray-600">Created: {record.createdDate}</div>
                            <div className="text-gray-600">Due: {record.dueDate}</div>
                            {record.completedDate && <div className="text-green-600">Done: {record.completedDate}</div>}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{record.documents.length} files</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Edit</span>
                              ✏️
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">View details</span>
                              👁️
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

        <TabsContent value="audits" className="space-y-6">
          {/* Audits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockAudits.map((audit) => (
              <Card key={audit.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{audit.title}</CardTitle>
                    <Shield className="h-5 w-5 text-gray-600" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    {getStatusBadge(audit.status, "audit")}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="text-sm font-medium capitalize">{audit.auditType}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Auditor</span>
                    <span className="text-sm font-medium">{audit.auditor}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Date</span>
                    <span className="text-sm">{audit.auditDate}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Department</span>
                    <span className="text-sm">{audit.department}</span>
                  </div>

                  {audit.status === "completed" && (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Compliance Score</span>
                          <span className="font-medium">{audit.complianceScore}%</span>
                        </div>
                        <Progress value={audit.complianceScore} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center p-2 bg-red-50 rounded">
                          <div className="font-semibold text-red-600">{audit.criticalFindings}</div>
                          <div className="text-gray-600">Critical</div>
                        </div>
                        <div className="text-center p-2 bg-orange-50 rounded">
                          <div className="font-semibold text-orange-600">{audit.majorFindings}</div>
                          <div className="text-gray-600">Major</div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      View Report
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Tests Passed</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockQualityTests.filter((t) => t.status === "passed").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Tests Failed</p>
                <p className="text-2xl font-bold text-red-600">
                  {mockQualityTests.filter((t) => t.status === "failed").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Open Issues</p>
                <p className="text-2xl font-bold text-orange-600">
                  {mockComplianceRecords.filter((r) => r.status === "open" || r.status === "in-progress").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Avg Compliance</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(
                    mockAudits.filter((a) => a.complianceScore > 0).reduce((sum, a) => sum + a.complianceScore, 0) /
                      mockAudits.filter((a) => a.complianceScore > 0).length,
                  )}
                  %
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
