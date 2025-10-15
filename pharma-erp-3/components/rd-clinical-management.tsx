"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, FileText, Users, Calendar, Beaker } from "lucide-react"

export default function RDClinicalManagement() {
  const [activeTab, setActiveTab] = useState("rd-projects")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const rdProjects = [
    {
      id: "RD001",
      name: "Analgesic Tablet Development",
      phase: "Phase II",
      status: "Active",
      lead: "Dr. Smith",
      startDate: "2024-01-15",
      budget: "$2.5M",
      completion: 65,
    },
    {
      id: "RD002",
      name: "Antibiotic Suspension Formula",
      phase: "Phase I",
      status: "On Hold",
      lead: "Dr. Johnson",
      startDate: "2024-03-01",
      budget: "$1.8M",
      completion: 30,
    },
    {
      id: "RD003",
      name: "Cardiovascular Capsule",
      phase: "Phase III",
      status: "Active",
      lead: "Dr. Williams",
      startDate: "2023-11-20",
      budget: "$4.2M",
      completion: 85,
    },
  ]

  const clinicalTrials = [
    {
      id: "CT001",
      title: "Efficacy Study - Analgesic Tablet",
      phase: "Phase II",
      status: "Recruiting",
      sites: 12,
      enrolled: 145,
      target: 200,
      sponsor: "Internal",
      startDate: "2024-02-01",
    },
    {
      id: "CT002",
      title: "Safety Study - Antibiotic Suspension",
      phase: "Phase I",
      status: "Completed",
      sites: 3,
      enrolled: 50,
      target: 50,
      sponsor: "External",
      startDate: "2023-12-15",
    },
    {
      id: "CT003",
      title: "Long-term Safety - Cardiovascular",
      phase: "Phase III",
      status: "Active",
      sites: 25,
      enrolled: 890,
      target: 1000,
      sponsor: "Internal",
      startDate: "2023-08-10",
    },
  ]

  const limsData = [
    {
      id: "LIM001",
      sampleId: "S2024001",
      testType: "Stability",
      product: "Analgesic Tablet",
      batch: "AT240115",
      status: "In Progress",
      analyst: "Lab Tech 1",
      dueDate: "2024-01-25",
    },
    {
      id: "LIM002",
      sampleId: "S2024002",
      testType: "Dissolution",
      product: "Antibiotic Suspension",
      batch: "AS240120",
      status: "Completed",
      analyst: "Lab Tech 2",
      dueDate: "2024-01-22",
    },
    {
      id: "LIM003",
      sampleId: "S2024003",
      testType: "Assay",
      product: "Cardiovascular Capsule",
      batch: "CC240118",
      status: "Pending",
      analyst: "Lab Tech 3",
      dueDate: "2024-01-28",
    },
  ]

  const regulatorySubmissions = [
    {
      id: "REG001",
      type: "IND Application",
      product: "Analgesic Tablet",
      status: "Submitted",
      agency: "FDA",
      submissionDate: "2024-01-10",
      responseDate: "2024-02-10",
      priority: "High",
    },
    {
      id: "REG002",
      type: "NDA Filing",
      product: "Cardiovascular Capsule",
      status: "In Preparation",
      agency: "FDA",
      submissionDate: "2024-03-15",
      responseDate: "",
      priority: "Critical",
    },
    {
      id: "REG003",
      type: "ANDA Submission",
      product: "Generic Antibiotic",
      status: "Under Review",
      agency: "FDA",
      submissionDate: "2023-12-20",
      responseDate: "2024-01-30",
      priority: "Medium",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-emerald-800">R&D & Clinical Management</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search projects, trials..." className="pl-8 w-64" />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-1" />
            New Project
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rd-projects">R&D Projects</TabsTrigger>
          <TabsTrigger value="clinical-trials">Clinical Trials</TabsTrigger>
          <TabsTrigger value="lims">LIMS Integration</TabsTrigger>
          <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
        </TabsList>

        <TabsContent value="rd-projects">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                Research & Development Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-2 font-medium">Project ID</th>
                      <th className="text-left p-2 font-medium">Project Name</th>
                      <th className="text-left p-2 font-medium">Phase</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Lead Researcher</th>
                      <th className="text-left p-2 font-medium">Start Date</th>
                      <th className="text-left p-2 font-medium">Budget</th>
                      <th className="text-left p-2 font-medium">Completion</th>
                      <th className="text-left p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rdProjects.map((project) => (
                      <tr key={project.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-xs">{project.id}</td>
                        <td className="p-2 font-medium">{project.name}</td>
                        <td className="p-2">
                          <Badge variant="outline" className="text-xs">
                            {project.phase}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant={project.status === "Active" ? "default" : "secondary"} className="text-xs">
                            {project.status}
                          </Badge>
                        </td>
                        <td className="p-2">{project.lead}</td>
                        <td className="p-2 text-xs">{project.startDate}</td>
                        <td className="p-2 font-medium">{project.budget}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-emerald-600 h-2 rounded-full"
                                style={{ width: `${project.completion}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{project.completion}%</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <Button variant="ghost" size="sm">
                            Edit
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

        <TabsContent value="clinical-trials">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Clinical Trials Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-2 font-medium">Trial ID</th>
                      <th className="text-left p-2 font-medium">Title</th>
                      <th className="text-left p-2 font-medium">Phase</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Sites</th>
                      <th className="text-left p-2 font-medium">Enrollment</th>
                      <th className="text-left p-2 font-medium">Sponsor</th>
                      <th className="text-left p-2 font-medium">Start Date</th>
                      <th className="text-left p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clinicalTrials.map((trial) => (
                      <tr key={trial.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-xs">{trial.id}</td>
                        <td className="p-2 font-medium">{trial.title}</td>
                        <td className="p-2">
                          <Badge variant="outline" className="text-xs">
                            {trial.phase}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge
                            variant={
                              trial.status === "Active" || trial.status === "Recruiting" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {trial.status}
                          </Badge>
                        </td>
                        <td className="p-2">{trial.sites}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs">
                              {trial.enrolled}/{trial.target}
                            </span>
                            <div className="w-12 bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{ width: `${(trial.enrolled / trial.target) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2">{trial.sponsor}</td>
                        <td className="p-2 text-xs">{trial.startDate}</td>
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

        <TabsContent value="lims">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Laboratory Information Management System (LIMS)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-2 font-medium">LIMS ID</th>
                      <th className="text-left p-2 font-medium">Sample ID</th>
                      <th className="text-left p-2 font-medium">Test Type</th>
                      <th className="text-left p-2 font-medium">Product</th>
                      <th className="text-left p-2 font-medium">Batch</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Analyst</th>
                      <th className="text-left p-2 font-medium">Due Date</th>
                      <th className="text-left p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {limsData.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-xs">{item.id}</td>
                        <td className="p-2 font-mono text-xs">{item.sampleId}</td>
                        <td className="p-2">{item.testType}</td>
                        <td className="p-2">{item.product}</td>
                        <td className="p-2 font-mono text-xs">{item.batch}</td>
                        <td className="p-2">
                          <Badge
                            variant={
                              item.status === "Completed"
                                ? "default"
                                : item.status === "In Progress"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-2">{item.analyst}</td>
                        <td className="p-2 text-xs">{item.dueDate}</td>
                        <td className="p-2">
                          <Button variant="ghost" size="sm">
                            Results
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

        <TabsContent value="regulatory">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Regulatory Submissions & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-2 font-medium">Submission ID</th>
                      <th className="text-left p-2 font-medium">Type</th>
                      <th className="text-left p-2 font-medium">Product</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Agency</th>
                      <th className="text-left p-2 font-medium">Submission Date</th>
                      <th className="text-left p-2 font-medium">Response Date</th>
                      <th className="text-left p-2 font-medium">Priority</th>
                      <th className="text-left p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regulatorySubmissions.map((submission) => (
                      <tr key={submission.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-xs">{submission.id}</td>
                        <td className="p-2 font-medium">{submission.type}</td>
                        <td className="p-2">{submission.product}</td>
                        <td className="p-2">
                          <Badge
                            variant={
                              submission.status === "Submitted"
                                ? "default"
                                : submission.status === "Under Review"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {submission.status}
                          </Badge>
                        </td>
                        <td className="p-2">{submission.agency}</td>
                        <td className="p-2 text-xs">{submission.submissionDate}</td>
                        <td className="p-2 text-xs">{submission.responseDate || "Pending"}</td>
                        <td className="p-2">
                          <Badge
                            variant={
                              submission.priority === "Critical"
                                ? "destructive"
                                : submission.priority === "High"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {submission.priority}
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
      </Tabs>
    </div>
  )
}
