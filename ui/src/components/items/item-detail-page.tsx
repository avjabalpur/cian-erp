"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Package, AlertTriangle, TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useItems, type Item } from "@/hooks/use-items"

interface ItemDetailPageProps {
  itemId: number
}

export default function ItemDetailPage({ itemId }: ItemDetailPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { items, loading } = useItems()
  const [item, setItem] = useState<Item | null>(null)

  useEffect(() => {
    const foundItem = items.find((i) => i.id === itemId)
    if (foundItem) {
      setItem(foundItem)
    } else if (!loading) {
      toast({
        title: "Error",
        description: "Item not found",
        variant: "destructive",
      })
      router.push("/admin/items")
    }
  }, [items, itemId, loading, router, toast])

  if (loading || !item) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const getStockStatusBadge = (available: number, reorder: number) => {
    if (available <= reorder * 0.3) {
      return (
        <Badge variant="destructive" className="flex items-center">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Critical Stock
        </Badge>
      )
    } else if (available <= reorder) {
      return (
        <Badge variant="outline" className="flex items-center">
          <TrendingDown className="w-3 h-3 mr-1" />
          Low Stock
        </Badge>
      )
    } else {
      return (
        <Badge variant="default" className="flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" />
          Good Stock
        </Badge>
      )
    }
  }

  const getStockPercentage = (available: number, maxStock: number) => {
    return Math.min((available / maxStock) * 100, 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{item.itemName}</h1>
            <p className="mt-2 text-gray-600">
              {item.itemCode} • {item.shortName}
            </p>
          </div>
        </div>
        <Button onClick={() => router.push(`/admin/items/${item.id}/edit`)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Item
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Item Code</label>
                  <p className="text-lg font-semibold">{item.itemCode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Revision</label>
                  <p className="text-lg">{item.revNo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Item Type</label>
                  <p className="text-lg">{item.itemType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Unit of Measure</label>
                  <p className="text-lg">{item.unitOfMeasure}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Standard Rate</label>
                  <p className="text-lg font-semibold">₹{item.stdRate.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Shelf Life</label>
                  <p className="text-lg">{item.shelfLifeMonths} months</p>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-gray-500">Specification</label>
                <p className="text-base mt-1">{item.specification}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Properties</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.manufactured && <Badge variant="outline">Manufactured</Badge>}
                  {item.sold && <Badge variant="outline">Sold</Badge>}
                  {item.qcRequired && <Badge variant="outline">QC Required</Badge>}
                  {item.batchApplicable && <Badge variant="outline">Batch Applicable</Badge>}
                  <Badge variant={item.isActive ? "default" : "destructive"}>
                    {item.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pharmaceutical Information */}
          {item.composition && (
            <Card>
              <CardHeader>
                <CardTitle>Pharmaceutical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.composition && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Composition</label>
                      <p className="text-base">{item.composition}</p>
                    </div>
                  )}
                  {item.dosageForm && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Dosage Form</label>
                      <p className="text-base">{item.dosageForm}</p>
                    </div>
                  )}
                  {item.strength && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Strength</label>
                      <p className="text-base">{item.strength}</p>
                    </div>
                  )}
                  {item.packSize && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Pack Size</label>
                      <p className="text-base">{item.packSize}</p>
                    </div>
                  )}
                  {item.manufacturer && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Manufacturer</label>
                      <p className="text-base">{item.manufacturer}</p>
                    </div>
                  )}
                  {item.brand && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Brand</label>
                      <p className="text-base">{item.brand}</p>
                    </div>
                  )}
                </div>

                {item.storageConditions && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Storage Conditions</label>
                      <p className="text-base mt-1">{item.storageConditions}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Clinical Information */}
          {(item.contraindications || item.sideEffects || item.interactions || item.warnings) && (
            <Card>
              <CardHeader>
                <CardTitle>Clinical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {item.contraindications && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contraindications</label>
                    <p className="text-base mt-1">{item.contraindications}</p>
                  </div>
                )}
                {item.sideEffects && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Side Effects</label>
                    <p className="text-base mt-1">{item.sideEffects}</p>
                  </div>
                )}
                {item.interactions && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Drug Interactions</label>
                    <p className="text-base mt-1">{item.interactions}</p>
                  </div>
                )}
                {item.warnings && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Warnings</label>
                    <p className="text-base mt-1">{item.warnings}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stock Information & Metadata */}
        <div className="space-y-6">
          {/* Stock Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Stock Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{item.currentStock}</div>
                <div className="text-sm text-gray-500">Current Stock</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Stock Level</span>
                  <span>
                    {item.currentStock} / {item.maxStock}
                  </span>
                </div>
                <Progress value={getStockPercentage(item.currentStock, item.maxStock)} className="h-2" />
              </div>

              <div className="flex justify-center">{getStockStatusBadge(item.currentStock, item.reorderLevel)}</div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Reorder Level</span>
                  <span className="font-medium">{item.reorderLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Max Stock</span>
                  <span className="font-medium">{item.maxStock}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {item.hsn_code && (
                <div>
                  <label className="text-sm font-medium text-gray-500">HSN Code</label>
                  <p className="text-base">{item.hsn_code}</p>
                </div>
              )}
              {item.category && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p className="text-base">{item.category}</p>
                </div>
              )}
              {item.subCategory && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Sub Category</label>
                  <p className="text-base">{item.subCategory}</p>
                </div>
              )}

              <Separator />

              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-sm">
                  {item.createdAt} by {item.createdBy}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-sm">
                  {item.updatedAt} by {item.updatedBy}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
