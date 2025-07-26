import ItemDetailPage from "@/components/items/item-detail-page"

export default function AdminItemDetailPage({ params }: { params: { id: string } }) {
  return <ItemDetailPage itemId={Number.parseInt(params.id)} />
}
