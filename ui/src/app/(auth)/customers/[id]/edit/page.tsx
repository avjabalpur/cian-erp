import CustomerEditPage from "@/components/customers/customer-edit-page"

export default function AdminCustomerEditPage({ params }: { params: { id: string } }) {
  return <CustomerEditPage customerId={Number.parseInt(params.id)} />
}
