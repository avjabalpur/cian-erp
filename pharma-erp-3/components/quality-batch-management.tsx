"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Plus,
  Edit,
  Eye,
  Filter,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Microscope,
  TrendingUp,
} from "lucide-react"

interface QCTest {
  id: string
  testCode: string
  testName: string
  testMethod: string
  specification: string
  result: string
  status: string
  analyst: string
  testDate: string
  equipment: string
  remarks: string
  retestRequired: boolean
  criticalParameter: boolean
}

interface BatchRecord {
  id: string
  batchNo: string
  productCode: string
  productName: string
  manufacturingDate: string
  expiryDate: string
  batchSize: number
  actualYield: number
  yieldPercentage: number
  status: string
  qcStatus: string
  releaseStatus: string
  supervisor: string
  qcAnalyst: string
  approvedBy: string
  approvalDate: string
  shelfLife: number
  storageConditions: string
  packagingDate: string
  lotNumbers: string[]
  tests: QCTest[]
  deviations: number
  capa: number
  stability: string
  regulatoryStatus: string
}

interface QCRequest {
  id: string
  requestNo: string
  requestType: string
  sampleType: string
  batchNo: string
  productCode: string
  productName: string
  requestDate: string
  requiredDate: string
  priority: string
  status: string
  analyst: string
  supervisor: string
  sampleQty: number
  testingLocation: string
  remarks: string
  tests: QCTest[]
  completionPercentage: number
}

const mockBatchRecords: BatchRecord[] = [
  {
    id: "1",
    batchNo: "B240115001",
    productCode: "CAP001",
    productName: "Paracetamol 500mg Capsules",
    manufacturingDate: "2024-01-15",
    expiryDate: "2026-01-15",
    batchSize: 100000,
    actualYield: 98500,
    yieldPercentage: 98.5,
    status: "Released",
    qcStatus: "Passed",
    releaseStatus: "Released",
    supervisor: "John Smith",
    qcAnalyst: "Dr. Sarah Wilson",
    approvedBy: "Dr. Michael Brown",
    approvalDate: "2024-01-20",
    shelfLife: 24,
    storageConditions: "Store below 25°C, protect from moisture",
    packagingDate: "2024-01-18",
    lotNumbers: ["LOT-240115-001", "LOT-240115-002"],
    deviations: 0,
    capa: 0,
    stability: "Ongoing",
    regulatoryStatus: "Approved",
    tests: [
      {
        id: "1",
        testCode: "ASY001",
        testName: "Assay (HPLC)",
        testMethod: "USP Method",
        specification: "95.0 - 105.0%",
        result: "99.8%",
        status: "Passed",
        analyst: "Dr. Sarah Wilson",
        testDate: "2024-01-16",
        equipment: "HPLC-001",
        remarks: "Within specification",
        retestRequired: false,
        criticalParameter: true,
      },
      {
        id: "2",
        testCode: "DIS001",
        testName: "Dissolution",
        testMethod: "USP <711>",
        specification: "NLT 80% in 30 min",
        result: "95.2% in 30 min",
        status: "Passed",
        analyst: "Dr. Sarah Wilson",
        testDate: "2024-01-16",
        equipment: "DIS-001",
        remarks: "Meets specification",
        retestRequired: false,
        criticalParameter: true,
      },
      {
        id: "3",
        testCode: "UNI001",
        testName: "Uniformity of Dosage Units",
        testMethod: "USP <905>",
        specification: "AV ≤ 15.0",
        result: "AV = 8.2",
        status: "Passed",
        analyst: "Dr. Sarah Wilson",
        testDate: "2024-01-17",
        equipment: "BAL-001",
        remarks: "Acceptable variation",
        retestRequired: false,
        criticalParameter: true,
      },
    ],
  },
  {
    id: "2",
    batchNo: "B240116001",
    productCode: "TAB002",
    productName: "Aspirin 75mg Tablets",
    manufacturingDate: "2024-01-16",
    expiryDate: "2026-01-16",
    batchSize: 50000,
    actualYield: 49200,
    yieldPercentage: 98.4,
    status: "Under QC",
    qcStatus: "In Progress",
    releaseStatus: "Quarantine",
    supervisor: "Lisa Davis",
    qcAnalyst: "Dr. Mark Johnson",
    approvedBy: "",
    approvalDate: "",
    shelfLife: 24,
    storageConditions: "Store below 25°C, protect from light",
    packagingDate: "2024-01-19",
    lotNumbers: ["LOT-240116-001"],
    deviations: 1,
    capa: 0,
    stability: "Not Started",
    regulatoryStatus: "Pending",
    tests: [],
  },
]

const mockQCRequests: QCRequest[] = [
  {
    id: "1",
    requestNo: "QCR-2024-001",
    requestType: "Release Testing",
    sampleType: "Finished Product",
    batchNo: "B240115001",
    productCode: "CAP001",
    productName: "Paracetamol 500mg Capsules",
    requestDate: "2024-01-15",
    requiredDate: "2024-01-18",
    priority: "High",
    status: "Completed",
    analyst: "Dr. Sarah Wilson",
    supervisor: "Dr. Michael Brown",
    sampleQty: 100,
    testingLocation: "QC Lab A",
    remarks: "Rush testing for customer order",
    completionPercentage: 100,
    tests: [
      {
        id: "1",
        testCode: "ASY001",
        testName: "Assay (HPLC)",
        testMethod: "USP Method",
        specification: "95.0 - 105.0%",
        result: "99.8%",
        status: "Passed",
        analyst: "Dr. Sarah Wilson",
        testDate: "2024-01-16",
        equipment: "HPLC-001",
        remarks: "Within specification",
        retestRequired: false,
        criticalParameter: true,
      },
    ],
  },
  {
    id: "2",
    requestNo: "QCR-2024-002",
    requestType: "Stability Testing",
    sampleType: "Finished Product",
    batchNo: "B240116001",
    productCode: "TAB002",
    productName: "Aspirin 75mg Tablets",
    requestDate: "2024-01-16",
    requiredDate: "2024-01-20",
    priority: "Medium",
    status: "In Progress",
    analyst: "Dr. Mark Johnson",
    supervisor: "Dr. Michael Brown",
    sampleQty: 200,
    testingLocation: "Stability Chamber",
    remarks: "3-month stability study",
    completionPercentage: 45,
    tests: [],
  },
]

export default function QualityBatchManagement() {
  const [activeTab, setActiveTab] = useState("batch-records")
  const [selectedBatch, setSelectedBatch] = useState<BatchRecord | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<QCRequest | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [qcStatusFilter, setQcStatusFilter] = useState("all")

  const filteredBatches = mockBatchRecords.filter((batch) => {
    const matchesSearch =
      batch.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.productCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || batch.status === statusFilter
    const matchesQcStatus = qcStatusFilter === "all" || batch.qcStatus === qcStatusFilter
    return matchesSearch && matchesStatus && matchesQcStatus
  })

  const filteredRequests = mockQCRequests.filter((request) => {
    const matchesSearch =
      request.requestNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.productName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Passed":
      case "Released":
      case "Completed":
        return <CheckCircle className="w-3 h-3 text-green-600" />
      case "Failed":
      case "Rejected":
        return <XCircle className="w-3 h-3 text-red-600" />
      case "In Progress":
      case "Under QC":
        return <Clock className="w-3 h-3 text-blue-600" />
      case "Quarantine":
      case "Pending":
        return <AlertTriangle className="w-3 h-3 text-orange-600" />
      default:
        return <Clock className="w-3 h-3 text-gray-600" />
    }
  }

  const BatchRecordForm = ({ batch, isEdit = false }: { batch?: BatchRecord; isEdit?: boolean }) => (
    <div className="space-y-4">
      {/* Batch Header */}
      <div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 rounded">
        <div>
          <label className="text-xs font-medium text-gray-600">Batch No</label>
          <Input className="h-8" defaultValue={batch?.batchNo} placeholder="Auto-generated" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Product Code</label>
          <Select defaultValue={batch?.productCode}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CAP001">CAP001</SelectItem>
              <SelectItem value="TAB002">TAB002</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Manufacturing Date</label>
          <Input type="date" className="h-8" defaultValue={batch?.manufacturingDate} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Expiry Date</label>
          <Input type="date" className="h-8" defaultValue={batch?.expiryDate} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Batch Size</label>
          <Input type="number" className="h-8" defaultValue={batch?.batchSize} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Actual Yield</label>
          <Input type="number" className="h-8" defaultValue={batch?.actualYield} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Yield %</label>
          <Input type="number" step="0.1" className="h-8" defaultValue={batch?.yieldPercentage} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Shelf Life (months)</label>
          <Input type="number" className="h-8" defaultValue={batch?.shelfLife} />
        </div>
      </div>

      {/* Personnel and Status */}
      <div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 rounded">
        <div>
          <label className="text-xs font-medium text-gray-600">Supervisor</label>
          <Select defaultValue={batch?.supervisor}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="John Smith">John Smith</SelectItem>
              <SelectItem value="Lisa Davis">Lisa Davis</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">QC Analyst</label>
          <Select defaultValue={batch?.qcAnalyst}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dr. Sarah Wilson">Dr. Sarah Wilson</SelectItem>
              <SelectItem value="Dr. Mark Johnson">Dr. Mark Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Status</label>
          <Select defaultValue={batch?.status}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Under QC">Under QC</SelectItem>
              <SelectItem value="Released">Released</SelectItem>
              <SelectItem value="Quarantine">Quarantine</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">QC Status</label>
          <Select defaultValue={batch?.qcStatus}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Passed">Passed</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Release Status</label>
          <Select defaultValue={batch?.releaseStatus}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Quarantine">Quarantine</SelectItem>
              <SelectItem value="Released">Released</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Packaging Date</label>
          <Input type="date" className="h-8" defaultValue={batch?.packagingDate} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Stability Status</label>
          <Select defaultValue={batch?.stability}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Regulatory Status</label>
          <Select defaultValue={batch?.regulatoryStatus}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Storage Conditions */}
      <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 rounded">
        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-600">Storage Conditions</label>
          <Input className="h-8" defaultValue={batch?.storageConditions} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Deviations</label>
          <Input type="number" className="h-8" defaultValue={batch?.deviations} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">CAPA</label>
          <Input type="number" className="h-8" defaultValue={batch?.capa} />
        </div>
      </div>

      {/* QC Tests Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Quality Control Tests</h3>
          <Button size="sm" className="h-7">
            <Plus className="w-3 h-3 mr-1" />
            Add Test
          </Button>
        </div>

        <div className="border rounded">
          <div className="grid grid-cols-12 gap-1 p-2 bg-gray-50 text-xs font-medium border-b">
            <div>Test Code</div>
            <div className="col-span-2">Test Name</div>
            <div>Method</div>
            <div>Specification</div>
            <div>Result</div>
            <div>Status</div>
            <div>Analyst</div>
            <div>Test Date</div>
            <div>Equipment</div>
            <div>Critical</div>
            <div>Actions</div>
          </div>

          {(batch?.tests || []).map((test) => (
            <div key={test.id} className="grid grid-cols-12 gap-1 p-2 text-xs border-b hover:bg-gray-50">
              <div className="font-medium">{test.testCode}</div>
              <div className="col-span-2">{test.testName}</div>
              <div>{test.testMethod}</div>
              <div>{test.specification}</div>
              <div className="font-medium">{test.result}</div>
              <div className="flex items-center gap-1">
                {getStatusIcon(test.status)}
                <Badge variant={test.status === "Passed" ? "default" : "destructive"} className="text-xs">
                  {test.status}
                </Badge>
              </div>
              <div>{test.analyst}</div>
              <div>{test.testDate}</div>
              <div>{test.equipment}</div>
              <div>
                {test.criticalParameter && (
                  <Badge variant="destructive" className="text-xs">
                    Critical
                  </Badge>
                )}
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={() => setActiveTab("batch-records")}>
          Cancel
        </Button>
        <Button variant="outline">Save Draft</Button>
        <Button>Save & Submit for Approval</Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList className="grid w-auto grid-cols-4">
            <TabsTrigger value="batch-records">Batch Records</TabsTrigger>
            <TabsTrigger value="qc-requests">QC Requests</TabsTrigger>
            <TabsTrigger value="stability">Stability Studies</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button size="sm" variant="outline">
              <Upload className="w-4 h-4 mr-1" />
              Import
            </Button>
          </div>
        </div>

        <TabsContent value="batch-records" className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 rounded">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Under QC">Under QC</SelectItem>
                <SelectItem value="Released">Released</SelectItem>
                <SelectItem value="Quarantine">Quarantine</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={qcStatusFilter} onValueChange={setQcStatusFilter}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All QC Status</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Passed">Passed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" className="h-8" placeholder="From Date" />
            <Input type="date" className="h-8" placeholder="To Date" />
            <Select>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CAP001">CAP001</SelectItem>
                <SelectItem value="TAB002">TAB002</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" className="h-8">
              <Filter className="w-4 h-4 mr-1" />
              Apply
            </Button>
            <Button size="sm" variant="outline" className="h-8 bg-transparent">
              <TrendingUp className="w-4 h-4 mr-1" />
              Analytics
            </Button>
          </div>

          {/* Batch Records Table */}
          <div className="border rounded">
            <div className="grid grid-cols-16 gap-1 p-2 bg-gray-50 text-xs font-medium border-b">
              <div>Batch No</div>
              <div className="col-span-2">Product</div>
              <div>Mfg Date</div>
              <div>Exp Date</div>
              <div>Batch Size</div>
              <div>Yield %</div>
              <div>Status</div>
              <div>QC Status</div>
              <div>Release Status</div>
              <div>Supervisor</div>
              <div>QC Analyst</div>
              <div>Deviations</div>
              <div>Stability</div>
              <div>Regulatory</div>
              <div>Actions</div>
            </div>

            {filteredBatches.map((batch) => (
              <div key={batch.id} className="grid grid-cols-16 gap-1 p-2 text-xs border-b hover:bg-gray-50">
                <div className="font-medium text-blue-600">{batch.batchNo}</div>
                <div className="col-span-2">
                  <div className="font-medium">{batch.productCode}</div>
                  <div className="text-gray-600">{batch.productName}</div>
                </div>
                <div>{batch.manufacturingDate}</div>
                <div>{batch.expiryDate}</div>
                <div>{batch.batchSize.toLocaleString()}</div>
                <div className="font-medium">{batch.yieldPercentage}%</div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(batch.status)}
                  <Badge
                    variant={
                      batch.status === "Released"
                        ? "default"
                        : batch.status === "Under QC"
                          ? "secondary"
                          : batch.status === "Quarantine"
                            ? "outline"
                            : "destructive"
                    }
                    className="text-xs"
                  >
                    {batch.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(batch.qcStatus)}
                  <Badge variant={batch.qcStatus === "Passed" ? "default" : "secondary"} className="text-xs">
                    {batch.qcStatus}
                  </Badge>
                </div>
                <Badge
                  variant={
                    batch.releaseStatus === "Released"
                      ? "default"
                      : batch.releaseStatus === "Quarantine"
                        ? "outline"
                        : "destructive"
                  }
                  className="text-xs"
                >
                  {batch.releaseStatus}
                </Badge>
                <div>{batch.supervisor}</div>
                <div>{batch.qcAnalyst}</div>
                <div>
                  {batch.deviations > 0 ? (
                    <Badge variant="destructive" className="text-xs">
                      {batch.deviations}
                    </Badge>
                  ) : (
                    <span>0</span>
                  )}
                </div>
                <Badge
                  variant={
                    batch.stability === "Completed"
                      ? "default"
                      : batch.stability === "Ongoing"
                        ? "secondary"
                        : "outline"
                  }
                  className="text-xs"
                >
                  {batch.stability}
                </Badge>
                <Badge variant={batch.regulatoryStatus === "Approved" ? "default" : "outline"} className="text-xs">
                  {batch.regulatoryStatus}
                </Badge>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      setSelectedBatch(batch)
                      setActiveTab("create")
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <FileText className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Total Batches</div>
                <div className="text-lg font-bold">{filteredBatches.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Released</div>
                <div className="text-lg font-bold text-green-600">
                  {filteredBatches.filter((b) => b.status === "Released").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Under QC</div>
                <div className="text-lg font-bold text-blue-600">
                  {filteredBatches.filter((b) => b.status === "Under QC").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Quarantine</div>
                <div className="text-lg font-bold text-orange-600">
                  {filteredBatches.filter((b) => b.status === "Quarantine").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Avg Yield</div>
                <div className="text-lg font-bold">
                  {(filteredBatches.reduce((sum, b) => sum + b.yieldPercentage, 0) / filteredBatches.length).toFixed(1)}
                  %
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Deviations</div>
                <div className="text-lg font-bold text-red-600">
                  {filteredBatches.reduce((sum, b) => sum + b.deviations, 0)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="qc-requests" className="space-y-4">
          {/* QC Requests Table */}
          <div className="border rounded">
            <div className="grid grid-cols-12 gap-1 p-2 bg-gray-50 text-xs font-medium border-b">
              <div>Request No</div>
              <div>Request Type</div>
              <div>Batch No</div>
              <div className="col-span-2">Product</div>
              <div>Request Date</div>
              <div>Required Date</div>
              <div>Priority</div>
              <div>Status</div>
              <div>Progress</div>
              <div>Analyst</div>
              <div>Actions</div>
            </div>

            {filteredRequests.map((request) => (
              <div key={request.id} className="grid grid-cols-12 gap-1 p-2 text-xs border-b hover:bg-gray-50">
                <div className="font-medium text-blue-600">{request.requestNo}</div>
                <div>{request.requestType}</div>
                <div className="font-medium">{request.batchNo}</div>
                <div className="col-span-2">
                  <div className="font-medium">{request.productCode}</div>
                  <div className="text-gray-600">{request.productName}</div>
                </div>
                <div>{request.requestDate}</div>
                <div>{request.requiredDate}</div>
                <Badge
                  variant={
                    request.priority === "High"
                      ? "destructive"
                      : request.priority === "Medium"
                        ? "default"
                        : "secondary"
                  }
                  className="text-xs"
                >
                  {request.priority}
                </Badge>
                <div className="flex items-center gap-1">
                  {getStatusIcon(request.status)}
                  <Badge variant={request.status === "Completed" ? "default" : "secondary"} className="text-xs">
                    {request.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Progress value={request.completionPercentage} className="h-2" />
                  <div className="text-xs text-center">{request.completionPercentage}%</div>
                </div>
                <div>{request.analyst}</div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Microscope className="w-5 h-5" />
                Stability Studies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Stability studies management interface would be implemented here with long-term testing protocols,
                storage conditions monitoring, and regulatory compliance tracking.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedBatch ? `Edit Batch Record: ${selectedBatch.batchNo}` : "Create New Batch Record"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BatchRecordForm batch={selectedBatch || undefined} isEdit={!!selectedBatch} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
