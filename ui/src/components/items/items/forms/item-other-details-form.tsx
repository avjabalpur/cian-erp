import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSwitch } from "@/components/shared/forms/form-switch"
import { FormSelect } from "@/components/shared/forms/form-select"

interface ItemOtherDetailsFormProps {
  control: any;
  itemId?: number;
}

export function ItemOtherDetailsForm({ control, itemId }: ItemOtherDetailsFormProps) {
  
  const productCastOptions = [
    { label: "Select product cast", value: "-1" },
    { label: "DRUG", value: "DRUG" },
    { label: "FOOD", value: "FOOD" },
    { label: "FOOD (NT)", value: "FOOD_NT" },
    { label: "NULL", value: "NULL" },
    { label: "SOAP", value: "SOAP" },
  ];

  return (
    <div className="space-y-4">
      {/* Other Details for Items */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-xs">📄</span>
            </div>
            Other Details for Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <FormInput
                control={control}
                name="packShort"
                label="PACKSHORT"
                placeholder="60 ML"
              />

              <FormSelect
                control={control}
                name="productCast"
                label="PRODUCT CAST"
                options={productCastOptions}
              />

              <FormInput
                control={control}
                name="pvcColor"
                label="PVC COLOR"
                placeholder="Value"
              />

              <FormInput
                control={control}
                name="color"
                label="COLOR"
                placeholder=""
              />

              <FormInput
                control={control}
                name="flavour"
                label="FLAVOUR"
                placeholder=""
              />

              <FormInput
                control={control}
                name="fragrance"
                label="FRAGRANCE"
                placeholder=""
              />

              <FormInput
                control={control}
                name="form"
                label="FORM"
                placeholder=""
              />

              <FormInput
                control={control}
                name="packagingStyle"
                label="PACKAGING STYLE"
                placeholder=""
              />

              <FormInput
                control={control}
                name="changePart"
                label="CHANGE PART"
                placeholder=""
              />

              <FormInput
                control={control}
                name="size"
                label="SIZE"
                placeholder="60 ML"
              />

              {/* Checkboxes */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <FormSwitch
                    control={control}
                    name="withLeaflet"
                    label="WITH LEAFLET"
                  />
                  <span className="text-[12px] text-gray-600">Yes</span>
                </div>

                <div className="flex items-center space-x-3">
                  <FormSwitch
                    control={control}
                    name="withApplicator"
                    label="WITH APPLICATOR"
                  />
                  <span className="text-[12px] text-gray-600">Yes</span>
                </div>

                <div className="flex items-center space-x-3">
                  <FormSwitch
                    control={control}
                    name="withWad"
                    label="WITH WAD"
                  />
                  <span className="text-[12px] text-gray-600">Yes</span>
                </div>

                <div className="flex items-center space-x-3">
                  <FormSwitch
                    control={control}
                    name="withSilica"
                    label="WITH SILICA"
                  />
                  <span className="text-[12px] text-gray-600">Yes</span>
                </div>

                <div className="flex items-center space-x-3">
                  <FormSwitch
                    control={control}
                    name="withCotton"
                    label="WITH COTTON"
                  />
                  <span className="text-[12px] text-gray-600">Yes</span>
                </div>

                <div className="flex items-center space-x-3">
                  <FormSwitch
                    control={control}
                    name="withMeasuringCap"
                    label="WITH MEASURING CAP"
                  />
                  <span className="text-[12px] text-gray-600">Yes</span>
                </div>

                <div className="flex items-center space-x-3">
                  <FormSwitch
                    control={control}
                    name="withSpoon"
                    label="WITH SPOON"
                  />
                  <span className="text-[12px] text-gray-600">Yes</span>
                </div>
              </div>

              <FormInput
                control={control}
                name="packingNp"
                label="PACKING NP"
                placeholder=""
              />

              <FormInput
                control={control}
                name="packingNpQty"
                label="PACKING NP QTY"
                placeholder="0"
                inputProps={{ type: "number" }}
              />

              <FormInput
                control={control}
                name="packingStylePtd"
                label="PACKING STYLE PTD"
                placeholder=""
              />

              <FormInput
                control={control}
                name="packingStylePtdQty"
                label="PACKING STYLE PTD QTY"
                placeholder="0"
                inputProps={{ type: "number" }}
              />

              <FormInput
                control={control}
                name="notePerStrip"
                label="NOTE PER STRIP"
                placeholder=""
              />

              <FormInput
                control={control}
                name="packShortPtdSpec"
                label="PACK SHORT PTD SPEC"
                placeholder=""
              />

              <FormInput
                control={control}
                name="packShortPtdSize"
                label="PACK SHORT PTD SIZE"
                placeholder=""
              />

              <FormInput
                control={control}
                name="packShortPtdQty"
                label="PACK SHORT PTD QTY"
                placeholder="0"
                inputProps={{ type: "number" }}
              />

              <FormInput
                control={control}
                name="packingStyleNpSize"
                label="PACKING STYLE NP SIZE"
                placeholder=""
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <FormInput
                control={control}
                name="packingStyleNpQty"
                label="PACKING STYLE NP QTY"
                placeholder="0"
                inputProps={{ type: "number" }}
              />

              <FormInput
                control={control}
                name="noteForCtn"
                label="NOTE FOR CTN"
                placeholder=""
              />

              <FormInput
                control={control}
                name="outerSize"
                label="OUTER SIZE"
                placeholder=""
              />

              <FormInput
                control={control}
                name="outerQty"
                label="OUTER QTY"
                placeholder="0"
                inputProps={{ type: "number" }}
              />

              <FormInput
                control={control}
                name="shrink"
                label="SHRINK"
                placeholder=""
              />

              <FormInput
                control={control}
                name="shrinkPacking"
                label="SHRINK PACKING"
                placeholder=""
              />

              <FormInput
                control={control}
                name="shipperSize"
                label="SHIPPER SIZE"
                placeholder=""
              />

              <FormInput
                control={control}
                name="qtyPerShipper"
                label="QTY PER SHIPPER"
                placeholder="0"
                inputProps={{ type: "number" }}
              />

              <FormInput
                control={control}
                name="shipperNote"
                label="SHIPPER NOTE"
                placeholder=""
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 