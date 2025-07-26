
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "default"
    case "inactive":
      return "secondary"
    case "suspended":
      return "destructive"
    case "pending":
      return "outline"
    default:
      return "secondary"
  }
}
