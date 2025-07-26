import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface DepartmentTableProps {
  departments: any[]
  onEdit: (department: any) => void
  onDelete?: (department: any) => void
  isLoading?: boolean
}

export default function DepartmentTable({ departments, onEdit, onDelete, isLoading }: DepartmentTableProps) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>UOM for MIS</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
            </TableRow>
          ) : departments.length > 0 ? (
            departments.map((department: any) => (
              <TableRow key={department.id}>
                <TableCell>{department.code}</TableCell>
                <TableCell>{department.name}</TableCell>
                <TableCell>{department.description}</TableCell>
                <TableCell>{department.uomForMis}</TableCell>
                <TableCell>{department.isActive ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(department)}
                  >
                    Edit
                  </Button>
                  {onDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(department)}
                      className="ml-2"
                    >
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                No departments found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
} 