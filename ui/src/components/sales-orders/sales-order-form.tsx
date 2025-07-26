"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { SalesOrder, CreateSalesOrderData, UpdateSalesOrderData } from "@/types/sales-order"
import { salesOrderApi } from "@/lib/api/sales-order"
import { toast } from "sonner"

const salesOrderSchema = z.object({
  soNumber: z.string().min(1, "SO Number is required"),
  soDate: z.string().optional(),
  soStatus: z.string().min(1, "Status is required"),
  organizationId: z.number().optional(),
  customerId: z.number().min(1, "Customer is required"),
  paymentTerm: z.string().optional(),
  quotationDate: z.string().optional(),
  quotationNo: z.string().optional(),
  hsnCode: z.string().optional(),
  itemId: z.number().optional(),
  dosageName: z.string().optional(),
  divisionId: z.number().optional(),
  designUnder: z.string().optional(),
  packingStyleDescription: z.string().optional(),
  composition: z.string().optional(),
  packShort: z.string().optional(),
  tabletType: z.string().optional(),
  tabletSize: z.string().optional(),
  changePart: z.string().optional(),
  capsuleSize: z.string().optional(),
  shipperSize: z.string().optional(),
  qtyPerShipper: z.string().optional(),
  noOfShipper: z.string().optional(),
  flavour: z.string().optional(),
  fragrance: z.string().optional(),
  quantity: z.string().optional(),
  focQty: z.string().optional(),
  mrp: z.string().optional(),
  billingRate: z.string().optional(),
  costing: z.string().optional(),
  inventoryCharges: z.string().optional(),
  cylinderCharge: z.string().optional(),
  plateCharges: z.string().optional(),
  domino: z.string().optional(),
  stereo: z.string().optional(),
  shipperDrawingRefCode: z.string().optional(),
  ctnOuterDrawingRefNo: z.string().optional(),
  ctnInnerDrawingRefNo: z.string().optional(),
  foilDrawingRefNo: z.string().optional(),
  leafletDrawingRefNo: z.string().optional(),
  tubeDrawingRefNo: z.string().optional(),
  labelDrawingRefNo: z.string().optional(),
  pmOuterCtnStock: z.string().optional(),
  pmInnerCtnStock: z.string().optional(),
  pmFoilStock: z.string().optional(),
  pmLeafletStock: z.string().optional(),
  pmTubeStock: z.string().optional(),
  pmLabelStock: z.string().optional(),
  drugApprovalUnder: z.string().optional(),
  currentStatus: z.string().optional(),
  comments: z.string().optional(),
  assignedDesigner: z.number().optional(),
  plantEmailSent: z.boolean().optional(),
})

interface SalesOrderFormProps {
  salesOrder?: SalesOrder
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function SalesOrderForm({ salesOrder, isOpen, onClose, onSuccess }: SalesOrderFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedSoNumber, setGeneratedSoNumber] = useState("")

  const form = useForm<z.infer<typeof salesOrderSchema>>({
    resolver: zodResolver(salesOrderSchema),
    defaultValues: {
      soNumber: "",
      soDate: "",
      soStatus: "Draft",
      organizationId: undefined,
      customerId: undefined,
      paymentTerm: "",
      quotationDate: "",
      quotationNo: "",
      hsnCode: "",
      itemId: undefined,
      dosageName: "",
      divisionId: undefined,
      designUnder: "",
      packingStyleDescription: "",
      composition: "",
      packShort: "",
      tabletType: "",
      tabletSize: "",
      changePart: "",
      capsuleSize: "",
      shipperSize: "",
      qtyPerShipper: "",
      noOfShipper: "",
      flavour: "",
      fragrance: "",
      quantity: "",
      focQty: "",
      mrp: "",
      billingRate: "",
      costing: "",
      inventoryCharges: "",
      cylinderCharge: "",
      plateCharges: "",
      domino: "",
      stereo: "",
      shipperDrawingRefCode: "",
      ctnOuterDrawingRefNo: "",
      ctnInnerDrawingRefNo: "",
      foilDrawingRefNo: "",
      leafletDrawingRefNo: "",
      tubeDrawingRefNo: "",
      labelDrawingRefNo: "",
      pmOuterCtnStock: "",
      pmInnerCtnStock: "",
      pmFoilStock: "",
      pmLeafletStock: "",
      pmTubeStock: "",
      pmLabelStock: "",
      drugApprovalUnder: "",
      currentStatus: "Draft",
      comments: "",
      assignedDesigner: undefined,
      plantEmailSent: false,
    },
  })

  useEffect(() => {
    if (salesOrder) {
      form.reset({
        soNumber: salesOrder.soNumber,
        soDate: salesOrder.soDate || "",
        soStatus: salesOrder.soStatus,
        organizationId: salesOrder.organizationId,
        customerId: salesOrder.customerId,
        paymentTerm: salesOrder.paymentTerm || "",
        quotationDate: salesOrder.quotationDate || "",
        quotationNo: salesOrder.quotationNo || "",
        hsnCode: salesOrder.hsnCode || "",
        itemId: salesOrder.itemId,
        dosageName: salesOrder.dosageName || "",
        divisionId: salesOrder.divisionId,
        designUnder: salesOrder.designUnder || "",
        packingStyleDescription: salesOrder.packingStyleDescription || "",
        composition: salesOrder.composition || "",
        packShort: salesOrder.packShort || "",
        tabletType: salesOrder.tabletType || "",
        tabletSize: salesOrder.tabletSize || "",
        changePart: salesOrder.changePart || "",
        capsuleSize: salesOrder.capsuleSize || "",
        shipperSize: salesOrder.shipperSize || "",
        qtyPerShipper: salesOrder.qtyPerShipper || "",
        noOfShipper: salesOrder.noOfShipper || "",
        flavour: salesOrder.flavour || "",
        fragrance: salesOrder.fragrance || "",
        quantity: salesOrder.quantity || "",
        focQty: salesOrder.focQty || "",
        mrp: salesOrder.mrp || "",
        billingRate: salesOrder.billingRate || "",
        costing: salesOrder.costing || "",
        inventoryCharges: salesOrder.inventoryCharges || "",
        cylinderCharge: salesOrder.cylinderCharge || "",
        plateCharges: salesOrder.plateCharges || "",
        domino: salesOrder.domino || "",
        stereo: salesOrder.stereo || "",
        shipperDrawingRefCode: salesOrder.shipperDrawingRefCode || "",
        ctnOuterDrawingRefNo: salesOrder.ctnOuterDrawingRefNo || "",
        ctnInnerDrawingRefNo: salesOrder.ctnInnerDrawingRefNo || "",
        foilDrawingRefNo: salesOrder.foilDrawingRefNo || "",
        leafletDrawingRefNo: salesOrder.leafletDrawingRefNo || "",
        tubeDrawingRefNo: salesOrder.tubeDrawingRefNo || "",
        labelDrawingRefNo: salesOrder.labelDrawingRefNo || "",
        pmOuterCtnStock: salesOrder.pmOuterCtnStock || "",
        pmInnerCtnStock: salesOrder.pmInnerCtnStock || "",
        pmFoilStock: salesOrder.pmFoilStock || "",
        pmLeafletStock: salesOrder.pmLeafletStock || "",
        pmTubeStock: salesOrder.pmTubeStock || "",
        pmLabelStock: salesOrder.pmLabelStock || "",
        drugApprovalUnder: salesOrder.drugApprovalUnder || "",
        currentStatus: salesOrder.currentStatus || "Draft",
        comments: salesOrder.comments || "",
        assignedDesigner: salesOrder.assignedDesigner,
        plantEmailSent: salesOrder.plantEmailSent || false,
      })
    } else {
      form.reset({
        soNumber: "",
        soDate: "",
        soStatus: "Draft",
        organizationId: undefined,
        customerId: undefined,
        paymentTerm: "",
        quotationDate: "",
        quotationNo: "",
        hsnCode: "",
        itemId: undefined,
        dosageName: "",
        divisionId: undefined,
        designUnder: "",
        packingStyleDescription: "",
        composition: "",
        packShort: "",
        tabletType: "",
        tabletSize: "",
        changePart: "",
        capsuleSize: "",
        shipperSize: "",
        qtyPerShipper: "",
        noOfShipper: "",
        flavour: "",
        fragrance: "",
        quantity: "",
        focQty: "",
        mrp: "",
        billingRate: "",
        costing: "",
        inventoryCharges: "",
        cylinderCharge: "",
        plateCharges: "",
        domino: "",
        stereo: "",
        shipperDrawingRefCode: "",
        ctnOuterDrawingRefNo: "",
        ctnInnerDrawingRefNo: "",
        foilDrawingRefNo: "",
        leafletDrawingRefNo: "",
        tubeDrawingRefNo: "",
        labelDrawingRefNo: "",
        pmOuterCtnStock: "",
        pmInnerCtnStock: "",
        pmFoilStock: "",
        pmLeafletStock: "",
        pmTubeStock: "",
        pmLabelStock: "",
        drugApprovalUnder: "",
        currentStatus: "Draft",
        comments: "",
        assignedDesigner: undefined,
        plantEmailSent: false,
      })
    }
  }, [salesOrder, form])

  const generateSoNumber = async () => {
    try {
      const response = await salesOrderApi.generateSoNumber()
      setGeneratedSoNumber(response.soNumber)
      form.setValue("soNumber", response.soNumber)
    } catch (error) {
      toast.error("Failed to generate SO number")
    }
  }

  const onSubmit = async (values: z.infer<typeof salesOrderSchema>) => {
    setIsLoading(true)
    try {
      if (salesOrder) {
        await salesOrderApi.update({ ...values, id: salesOrder.id })
        toast.success("Sales order updated successfully")
      } else {
        await salesOrderApi.create(values)
        toast.success("Sales order created successfully")
      }
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {salesOrder ? "Edit Sales Order" : "Create Sales Order"}
          </DialogTitle>
          <DialogDescription>
            {salesOrder ? "Update sales order details" : "Create a new sales order"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="product">Product Details</TabsTrigger>
                <TabsTrigger value="packaging">Packaging</TabsTrigger>
                <TabsTrigger value="drawings">Drawings</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Enter the basic sales order information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="soNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SO Number</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input {...field} placeholder="SO Number" />
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={generateSoNumber}
                                disabled={isLoading}
                              >
                                Generate
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="soDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SO Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="soStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Submitted">Submitted</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customerId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Customer</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                placeholder="Customer ID"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="paymentTerm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Term</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Payment term" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quotationNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quotation Number</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Quotation number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quotationDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quotation Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="comments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comments</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Enter comments" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="product" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>Enter product specifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="itemId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Item</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                placeholder="Item ID"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hsnCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>HSN Code</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="HSN Code" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dosageName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dosage Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Dosage name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="composition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Composition</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Composition" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Quantity" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="focQty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>FOC Quantity</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="FOC quantity" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mrp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>MRP</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="MRP" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="billingRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Billing Rate</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Billing rate" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="costing"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Costing</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Costing" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="packaging" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Packaging Details</CardTitle>
                    <CardDescription>Enter packaging specifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="packingStyleDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Packing Style Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Packing style description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="packShort"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pack Short</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Pack short" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tabletType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tablet Type</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Tablet type" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tabletSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tablet Size</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Tablet size" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="capsuleSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Capsule Size</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Capsule size" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="shipperSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shipper Size</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Shipper size" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="qtyPerShipper"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qty Per Shipper</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Quantity per shipper" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="noOfShipper"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>No. of Shipper</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Number of shipper" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="flavour"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Flavour</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Flavour" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fragrance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fragrance</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Fragrance" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="drawings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Drawing References</CardTitle>
                    <CardDescription>Enter drawing reference numbers</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="shipperDrawingRefCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shipper Drawing Ref Code</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Shipper drawing reference" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ctnOuterDrawingRefNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CTN Outer Drawing Ref No</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="CTN outer drawing reference" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ctnInnerDrawingRefNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CTN Inner Drawing Ref No</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="CTN inner drawing reference" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="foilDrawingRefNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Foil Drawing Ref No</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Foil drawing reference" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="leafletDrawingRefNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Leaflet Drawing Ref No</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Leaflet drawing reference" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tubeDrawingRefNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tube Drawing Ref No</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Tube drawing reference" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="labelDrawingRefNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Label Drawing Ref No</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Label drawing reference" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : salesOrder ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 