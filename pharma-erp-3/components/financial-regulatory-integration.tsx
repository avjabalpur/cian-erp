"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Edit,
  Eye,
  Filter,
  Download,
  Upload,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield,
} from "lucide-react"

interface FinancialTransaction {
  id: string
  transactionNo: string
  transactionType: string
  date: string
  batchNo: string
  productCode: string
  description: string
  debitAccount: string
  creditAccount: string
  amount: number
  currency: string
  costCenter: string
  reference: string
  status: string
  approvedBy: string
  approvalDate: string
}

interface RegulatorySubmission {
  id: string
  submissionNo: string
  submissionType: string
  productCode: string
  productName: string
  regulatoryBody: string
  country: string
  submissionDate: string
  targetApprovalDate: string
  actualApprovalDate?: string
  status: string
  priority: string
  assignedTo: string
  documents: number
  fees: number
  currency: string
  milestones: RegulatoryMilestone[]
  comments: string
}

interface RegulatoryMilestone {
  id: string
  milestone: string
  targetDate: string
  actualDate?: string
  status: string
  responsible: string
  documents: string[]
}

interface CostAnalysis {
  id: string
  batchNo: string
  productCode: string
  productName: string
  batchSize: number
  totalCost: number
  materialCost: number
  laborCost: number
  overheadCost: number
  qcCost: number
  packagingCost: number
  costPerUnit: number
  standardCost: number
  variance: number
  variancePercentage: number
  profitMargin: number
}

const mockFinancialTransactions: FinancialTransaction[] = [
  {
    id: "1",
    transactionNo: "FT-2024-001",
    transactionType: "Material Issue",
    date: "2024-01-15",
    batchNo: "B240115001",
    productCode: "CAP001",
    description: "Raw material consumption for Paracetamol batch",
    debitAccount: "WIP-CAP001",
    creditAccount: "RM-Inventory",
    amount: 25000,
    currency: "USD",
    costCenter: "CC-MFG-001",
    reference: "MO-2024-001",
    status: "Posted",
    approvedBy: "John Smith",
    approvalDate: "2024-01-15",
  },
  {
    id: "2",
    transactionNo: "FT-2024-002",
    transactionType: "Labor Cost",
    date: "2024-01-16",
    batchNo: "B240115001",
    productCode: "CAP001",
    description: "Direct labor cost allocation",
    debitAccount: "WIP-CAP001",
    creditAccount: "Labor-Payroll",
    amount: 8500,
    currency: "USD",
    costCenter: "CC-MFG-001",
    reference: "MO-2024-001",
    status: "Posted",
    approvedBy: "Lisa Davis",
    approvalDate: "2024-01-16",
  },
]

const mockRegulatorySubmissions: RegulatorySubmission[] = [
  {
    id: "1",
    submissionNo: "REG-2024-001",
    submissionType: "New Drug Application (NDA)",
    productCode: "CAP001",
    productName: "Paracetamol 500mg Capsules",
    regulatoryBody: "FDA",
    country: "USA",
    submissionDate: "2024-01-10",
    targetApprovalDate: "2024-07-10",
    status: "Under Review",
    priority: "High",
    assignedTo: "Dr. Sarah Wilson",
    documents: 45,
    fees: 250000,
    currency: "USD",
    comments: "Priority review requested",
    milestones: [
      {
        id: "1",
        milestone: "Pre-submission Meeting",
        targetDate: "2023-12-15",
        actualDate: "2023-12-18",
        status: "Completed",
        responsible: "Dr. Sarah Wilson",
        documents: ["Pre-sub-meeting-minutes.pdf"],
      },
      {
        id: "2",
        milestone: "NDA Submission",
        targetDate: "2024-01-10",
        actualDate: "2024-01-10",
        status: "Completed",
        responsible: "Dr. Sarah Wilson",
        documents: ["NDA-submission-package.pdf"],
      },
      {
        id: "3",
        milestone: "FDA Review",
        targetDate: "2024-07-10",
        status: "In Progress",
        responsible: "FDA",
        documents: [],
      },
    ],
  },
  {
    id: "2",
    submissionNo: "REG-2024-002",
    submissionType: "Marketing Authorization Application (MAA)",
    productCode: "TAB002",
    productName: "Aspirin 75mg Tablets",
    regulatoryBody: "EMA",
    country: "EU",
    submissionDate: "2024-01-20",
    targetApprovalDate: "2024-11-20",
    status: "Preparation",
    priority: "Medium",
    assignedTo: "Dr. Mark Johnson",
    documents: 32,
    fees: 180000,
    currency: "EUR",
    comments: "Centralized procedure",
    milestones: [],
  },
]

const mockCostAnalysis: CostAnalysis[] = [
  {
    id: "1",
    batchNo: "B240115001",
    productCode: "CAP001",
    productName: "Paracetamol 500mg Capsules",
    batchSize: 100000,
    totalCost: 45000,
    materialCost: 25000,
    laborCost: 8500,
    overheadCost: 7500,
    qcCost: 2500,
    packagingCost: 1500,
    costPerUnit: 0.45,
    standardCost: 0.42,
    variance: 3000,
    variancePercentage: 7.1,
    profitMargin: 35.5,
  },
  {
    id: "2",
    batchNo: "B240116001",
    productCode: "TAB002",
    productName: "Aspirin 75mg Tablets",
    batchSize: 50000,
    totalCost: 18500,
    materialCost: 10000,
    laborCost: 4500,
    overheadCost: 2800,
    qcCost: 800,
    packagingCost: 400,
    costPerUnit: 0.37,
    standardCost: 0.35,
    variance: 1000,
    variancePercentage: 5.7,
    profitMargin: 42.2,
  },
]

export default function FinancialRegulatoryIntegration() {
  const [activeTab, setActiveTab] = useState("financial")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Posted":
      case "Approved":
      case "Completed":
        return <CheckCircle className="w-3 h-3 text-green-600" />
      case "Under Review":
      case "In Progress":
        return <Clock className="w-3 h-3 text-blue-600" />
      case "Pending":
      case "Preparation":
        return <AlertTriangle className="w-3 h-3 text-orange-600" />
      default:
        return <Clock className="w-3 h-3 text-gray-600" />
    }
  }

  const FinancialTransactionForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 rounded">
        <div>
          <label className="text-xs font-medium text-gray-600">Transaction No</label>
          <Input className="h-8" placeholder="Auto-generated" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Transaction Type</label>
          <Select>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Material Issue">Material Issue</SelectItem>
              <SelectItem value="Labor Cost">Labor Cost</SelectItem>
              <SelectItem value="Overhead Allocation">Overhead Allocation</SelectItem>
              <SelectItem value="QC Cost">QC Cost</SelectItem>
              <SelectItem value="Finished Goods">Finished Goods</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Date</label>
          <Input type="date" className="h-8" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Batch No</label>
          <Select>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="B240115001">B240115001</SelectItem>
              <SelectItem value="B240116001">B240116001</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Product Code</label>
          <Select>
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
          <label className="text-xs font-medium text-gray-600">Amount</label>
          <Input type="number" step="0.01" className="h-8" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Currency</label>
          <Select defaultValue="USD">
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="INR">INR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Cost Center</label>
          <Select>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CC-MFG-001">CC-MFG-001</SelectItem>
              <SelectItem value="CC-MFG-002">CC-MFG-002</SelectItem>
              <SelectItem value="CC-QC-001">CC-QC-001</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 rounded">
        <div>
          <label className="text-xs font-medium text-gray-600">Debit Account</label>
          <Select>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WIP-CAP001">WIP-CAP001</SelectItem>
              <SelectItem value="WIP-TAB002">WIP-TAB002</SelectItem>
              <SelectItem value="FG-Inventory">FG-Inventory</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Credit Account</label>
          <Select>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RM-Inventory">RM-Inventory</SelectItem>
              <SelectItem value="Labor-Payroll">Labor-Payroll</SelectItem>
              <SelectItem value="Manufacturing-Overhead">Manufacturing-Overhead</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Reference</label>
          <Input className="h-8" placeholder="Reference document" />
        </div>
        <div className="col-span-1">
          <label className="text-xs font-medium text-gray-600">Description</label>
          <Input className="h-8" placeholder="Transaction description" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline">Cancel</Button>
        <Button variant="outline">Save Draft</Button>
        <Button>Post Transaction</Button>
      </div>
    </div>
  )

  const RegulatorySubmissionForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 rounded">
        <div>
          <label className="text-xs font-medium text-gray-600">Submission No</label>
          <Input className="h-8" placeholder="Auto-generated" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Submission Type</label>
          <Select>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NDA">New Drug Application (NDA)</SelectItem>
              <SelectItem value="MAA">Marketing Authorization Application (MAA)</SelectItem>
              <SelectItem value="ANDA">Abbreviated New Drug Application (ANDA)</SelectItem>
              <SelectItem value="IND">Investigational New Drug (IND)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Product Code</label>
          <Select>
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
          <label className="text-xs font-medium text-gray-600">Regulatory Body</label>
          <Select>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FDA">FDA (USA)</SelectItem>
              <SelectItem value="EMA">EMA (EU)</SelectItem>
              <SelectItem value="CDSCO">CDSCO (India)</SelectItem>
              <SelectItem value="Health Canada">Health Canada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Country</label>
          <Select>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USA">USA</SelectItem>
              <SelectItem value="EU">EU</SelectItem>
              <SelectItem value="India">India</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Submission Date</label>
          <Input type="date" className="h-8" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Target Approval</label>
          <Input type="date" className="h-8" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Priority</label>
          <Select defaultValue="Medium">
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 p-3 bg-gray-50 rounded">
        <div>
          <label className="text-xs font-medium text-gray-600">Assigned To</label>
          <Select>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dr. Sarah Wilson">Dr. Sarah Wilson</SelectItem>
              <SelectItem value="Dr. Mark Johnson">Dr. Mark Johnson</SelectItem>
              <SelectItem value="Dr. Lisa Davis">Dr. Lisa Davis</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Documents</label>
          <Input type="number" className="h-8" placeholder="Number of documents" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Fees</label>
          <Input type="number" step="0.01" className="h-8" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Currency</label>
          <Select defaultValue="USD">
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="INR">INR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-600">Comments</label>
          <Input className="h-8" placeholder="Additional comments" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline">Cancel</Button>
        <Button variant="outline">Save Draft</Button>
        <Button>Submit Application</Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList className="grid w-auto grid-cols-4">
            <TabsTrigger value="financial">Financial Transactions</TabsTrigger>
            <TabsTrigger value="regulatory">Regulatory Submissions</TabsTrigger>
            <TabsTrigger value="cost-analysis">Cost Analysis</TabsTrigger>
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

        <TabsContent value="financial" className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 rounded">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
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
                <SelectItem value="Posted">Posted</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Material Issue">Material Issue</SelectItem>
                <SelectItem value="Labor Cost">Labor Cost</SelectItem>
                <SelectItem value="Overhead Allocation">Overhead Allocation</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" className="h-8" placeholder="From Date" />
            <Input type="date" className="h-8" placeholder="To Date" />
            <Select>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Cost Center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CC-MFG-001">CC-MFG-001</SelectItem>
                <SelectItem value="CC-MFG-002">CC-MFG-002</SelectItem>
                <SelectItem value="CC-QC-001">CC-QC-001</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" className="h-8">
              <Filter className="w-4 h-4 mr-1" />
              Apply
            </Button>
            <Button size="sm" variant="outline" className="h-8 bg-transparent">
              <TrendingUp className="w-4 h-4 mr-1" />
              Reports
            </Button>
          </div>

          {/* Financial Transactions Table */}
          <div className="border rounded">
            <div className="grid grid-cols-14 gap-1 p-2 bg-gray-50 text-xs font-medium border-b">
              <div>Transaction No</div>
              <div>Type</div>
              <div>Date</div>
              <div>Batch No</div>
              <div>Product</div>
              <div>Description</div>
              <div>Debit Account</div>
              <div>Credit Account</div>
              <div>Amount</div>
              <div>Currency</div>
              <div>Cost Center</div>
              <div>Status</div>
              <div>Approved By</div>
              <div>Actions</div>
            </div>

            {mockFinancialTransactions.map((transaction) => (
              <div key={transaction.id} className="grid grid-cols-14 gap-1 p-2 text-xs border-b hover:bg-gray-50">
                <div className="font-medium text-blue-600">{transaction.transactionNo}</div>
                <div>{transaction.transactionType}</div>
                <div>{transaction.date}</div>
                <div className="font-medium">{transaction.batchNo}</div>
                <div>{transaction.productCode}</div>
                <div className="truncate" title={transaction.description}>
                  {transaction.description}
                </div>
                <div>{transaction.debitAccount}</div>
                <div>{transaction.creditAccount}</div>
                <div className="font-medium">${transaction.amount.toLocaleString()}</div>
                <div>{transaction.currency}</div>
                <div>{transaction.costCenter}</div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(transaction.status)}
                  <Badge variant={transaction.status === "Posted" ? "default" : "secondary"} className="text-xs">
                    {transaction.status}
                  </Badge>
                </div>
                <div>{transaction.approvedBy}</div>
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

          {/* Financial Summary Cards */}
          <div className="grid grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Total Transactions</div>
                <div className="text-lg font-bold">{mockFinancialTransactions.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Posted</div>
                <div className="text-lg font-bold text-green-600">
                  {mockFinancialTransactions.filter((t) => t.status === "Posted").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Total Amount</div>
                <div className="text-lg font-bold">
                  ${mockFinancialTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Material Costs</div>
                <div className="text-lg font-bold">
                  $
                  {mockFinancialTransactions
                    .filter((t) => t.transactionType === "Material Issue")
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Labor Costs</div>
                <div className="text-lg font-bold">
                  $
                  {mockFinancialTransactions
                    .filter((t) => t.transactionType === "Labor Cost")
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">This Month</div>
                <div className="text-lg font-bold">
                  $
                  {mockFinancialTransactions
                    .filter((t) => t.date.startsWith("2024-01"))
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regulatory" className="space-y-4">
          {/* Regulatory Submissions Table */}
          <div className="border rounded">
            <div className="grid grid-cols-14 gap-1 p-2 bg-gray-50 text-xs font-medium border-b">
              <div>Submission No</div>
              <div>Type</div>
              <div className="col-span-2">Product</div>
              <div>Regulatory Body</div>
              <div>Country</div>
              <div>Submission Date</div>
              <div>Target Approval</div>
              <div>Status</div>
              <div>Priority</div>
              <div>Assigned To</div>
              <div>Documents</div>
              <div>Fees</div>
              <div>Actions</div>
            </div>

            {mockRegulatorySubmissions.map((submission) => (
              <div key={submission.id} className="grid grid-cols-14 gap-1 p-2 text-xs border-b hover:bg-gray-50">
                <div className="font-medium text-blue-600">{submission.submissionNo}</div>
                <div>{submission.submissionType}</div>
                <div className="col-span-2">
                  <div className="font-medium">{submission.productCode}</div>
                  <div className="text-gray-600">{submission.productName}</div>
                </div>
                <div>{submission.regulatoryBody}</div>
                <div>{submission.country}</div>
                <div>{submission.submissionDate}</div>
                <div>{submission.targetApprovalDate}</div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(submission.status)}
                  <Badge
                    variant={
                      submission.status === "Approved"
                        ? "default"
                        : submission.status === "Under Review"
                          ? "secondary"
                          : "outline"
                    }
                    className="text-xs"
                  >
                    {submission.status}
                  </Badge>
                </div>
                <Badge
                  variant={
                    submission.priority === "High" || submission.priority === "Critical"
                      ? "destructive"
                      : submission.priority === "Medium"
                        ? "default"
                        : "secondary"
                  }
                  className="text-xs"
                >
                  {submission.priority}
                </Badge>
                <div>{submission.assignedTo}</div>
                <div>{submission.documents} docs</div>
                <div>
                  {submission.currency} {submission.fees.toLocaleString()}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
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

          {/* Regulatory Summary Cards */}
          <div className="grid grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Total Submissions</div>
                <div className="text-lg font-bold">{mockRegulatorySubmissions.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Under Review</div>
                <div className="text-lg font-bold text-blue-600">
                  {mockRegulatorySubmissions.filter((s) => s.status === "Under Review").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">High Priority</div>
                <div className="text-lg font-bold text-red-600">
                  {mockRegulatorySubmissions.filter((s) => s.priority === "High").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Total Fees</div>
                <div className="text-lg font-bold">
                  ${mockRegulatorySubmissions.reduce((sum, s) => sum + s.fees, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Documents</div>
                <div className="text-lg font-bold">
                  {mockRegulatorySubmissions.reduce((sum, s) => sum + s.documents, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Avg Timeline</div>
                <div className="text-lg font-bold">6.2 months</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cost-analysis" className="space-y-4">
          {/* Cost Analysis Table */}
          <div className="border rounded">
            <div className="grid grid-cols-14 gap-1 p-2 bg-gray-50 text-xs font-medium border-b">
              <div>Batch No</div>
              <div className="col-span-2">Product</div>
              <div>Batch Size</div>
              <div>Total Cost</div>
              <div>Material Cost</div>
              <div>Labor Cost</div>
              <div>Overhead Cost</div>
              <div>QC Cost</div>
              <div>Cost/Unit</div>
              <div>Standard Cost</div>
              <div>Variance</div>
              <div>Variance %</div>
              <div>Profit Margin</div>
            </div>

            {mockCostAnalysis.map((cost) => (
              <div key={cost.id} className="grid grid-cols-14 gap-1 p-2 text-xs border-b hover:bg-gray-50">
                <div className="font-medium text-blue-600">{cost.batchNo}</div>
                <div className="col-span-2">
                  <div className="font-medium">{cost.productCode}</div>
                  <div className="text-gray-600">{cost.productName}</div>
                </div>
                <div>{cost.batchSize.toLocaleString()}</div>
                <div className="font-medium">${cost.totalCost.toLocaleString()}</div>
                <div>${cost.materialCost.toLocaleString()}</div>
                <div>${cost.laborCost.toLocaleString()}</div>
                <div>${cost.overheadCost.toLocaleString()}</div>
                <div>${cost.qcCost.toLocaleString()}</div>
                <div className="font-medium">${cost.costPerUnit.toFixed(2)}</div>
                <div>${cost.standardCost.toFixed(2)}</div>
                <div className={cost.variance > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                  ${cost.variance.toLocaleString()}
                </div>
                <div
                  className={cost.variancePercentage > 5 ? "text-red-600 font-medium" : "text-green-600 font-medium"}
                >
                  {cost.variancePercentage.toFixed(1)}%
                </div>
                <div className="font-medium text-green-600">{cost.profitMargin.toFixed(1)}%</div>
              </div>
            ))}
          </div>

          {/* Cost Analysis Summary Cards */}
          <div className="grid grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Total Batches</div>
                <div className="text-lg font-bold">{mockCostAnalysis.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Total Production Cost</div>
                <div className="text-lg font-bold">
                  ${mockCostAnalysis.reduce((sum, c) => sum + c.totalCost, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Avg Cost/Unit</div>
                <div className="text-lg font-bold">
                  ${(mockCostAnalysis.reduce((sum, c) => sum + c.costPerUnit, 0) / mockCostAnalysis.length).toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Total Variance</div>
                <div className="text-lg font-bold text-red-600">
                  ${mockCostAnalysis.reduce((sum, c) => sum + c.variance, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Avg Profit Margin</div>
                <div className="text-lg font-bold text-green-600">
                  {(mockCostAnalysis.reduce((sum, c) => sum + c.profitMargin, 0) / mockCostAnalysis.length).toFixed(1)}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Material Cost %</div>
                <div className="text-lg font-bold">
                  {(
                    (mockCostAnalysis.reduce((sum, c) => sum + c.materialCost, 0) /
                      mockCostAnalysis.reduce((sum, c) => sum + c.totalCost, 0)) *
                    100
                  ).toFixed(1)}
                  %
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Tabs defaultValue="financial-form">
            <TabsList className="grid w-auto grid-cols-2">
              <TabsTrigger value="financial-form">Financial Transaction</TabsTrigger>
              <TabsTrigger value="regulatory-form">Regulatory Submission</TabsTrigger>
            </TabsList>

            <TabsContent value="financial-form">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Create Financial Transaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FinancialTransactionForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="regulatory-form">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Create Regulatory Submission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RegulatorySubmissionForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
