import { useUsers } from "@/hooks/use-users"
import { Autocomplete } from "../ui/autocomplete"

interface UserSelectorProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
}

export function UserSelector({
  value,
  onChange,
  disabled,
  error,
}: UserSelectorProps) {
  const { data: users, isLoading } = useUsers()
  const usersData = users || []
  const options = usersData.map((user) => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.id.toString(),
  })) || []

  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Select user"
      emptyText="No users found"
      disabled={disabled}
      loading={isLoading}
      error={error}
    />
  )
}
