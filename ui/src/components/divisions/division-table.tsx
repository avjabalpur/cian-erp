import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface DivisionTableProps {
  divisions: any[]
  departments: any[]
  onEdit: (division: any) => void
  onDelete?: (division: any) => void
  isLoading?: boolean
}

export default function DivisionTable({ divisions, departments, onEdit, onDelete, isLoading }: DivisionTableProps) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Conversion Factor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">Loading...</TableCell>
            </TableRow>
          ) : divisions.length > 0 ? (
            divisions.map((division: any) => {
              const department = departments.find((d: any) => d.id === division.departmentId)
              return (
                <TableRow key={division.id}>
                  <TableCell>{division.code}</TableCell>
                  <TableCell>{division.name}</TableCell>
                  <TableCell>{division.description}</TableCell>
                  <TableCell>{department ? department.name : '-'}</TableCell>
                  <TableCell>{division.unit}</TableCell>
                  <TableCell>{division.conversionFactor}</TableCell>
                  <TableCell>{division.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(division)}
                    >
                      Edit
                    </Button>
                    {onDelete && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(division)}
                        className="ml-2"
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                No divisions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
} 