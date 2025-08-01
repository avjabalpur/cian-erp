export const getStatusColor = (status: boolean) => {
  switch (status) {
    case true:
      return "default"
    case false:
      return "secondary"
  }
}

export const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

