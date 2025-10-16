'use client';

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
    { label: "Select product cast", value: "0" },
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
        <CardHeader>
          <CardTitle>Other Details for Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <FormInput
                control={control}
                name="packShort"
                label="Pack Short"
                placeholder="e.g., 60 ML"
              />

              <FormSelect
                control={control}
                name="productCast"
                label="Product Cast"
                options={productCastOptions}
                placeholder="Select product cast"
              />

              <FormInput
                control={control}
                name="pvcColor"
                label="PVC Color"
                placeholder="Enter PVC color"
              />

              <FormInput
                control={control}
                name="color"
                label="Color"
                placeholder="Enter color"
              />

              <FormInput
                control={control}
                name="flavour"
                label="Flavour"
                placeholder="Enter flavour"
              />

              <FormInput
                control={control}
                name="fragrance"
                label="Fragrance"
                placeholder="Enter fragrance"
              />

              <FormInput
                control={control}
                name="form"
                label="Form"
                placeholder="Enter form"
              />

              <FormInput
                control={control}
                name="packagingStyle"
                label="Packaging Style"
                placeholder="Enter packaging style"
              />

              <FormInput
                control={control}
                name="changePart"
                label="Change Part"
                placeholder="Enter change part"
              />

              <FormInput
                control={control}
                name="size"
                label="Size"
                placeholder="e.g., 60 ML"
              />

              {/* Switches Section */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 gap-3">
                  <FormSwitch
                    control={control}
                    name="withLeaflet"
                    label="With Leaflet"
                  />
                  <FormSwitch
                    control={control}
                    name="withApplicator"
                    label="With Applicator"
                  />
                  <FormSwitch
                    control={control}
                    name="withWad"
                    label="With Wad"
                  />
                  <FormSwitch
                    control={control}
                    name="withSilica"
                    label="With Silica"
                  />
                  <FormSwitch
                    control={control}
                    name="withCotton"
                    label="With Cotton"
                  />
                  <FormSwitch
                    control={control}
                    name="withMeasuringCap"
                    label="With Measuring Cap"
                  />
                  <FormSwitch
                    control={control}
                    name="withSpoon"
                    label="With Spoon"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <FormInput
                  control={control}
                  name="packShortPtdSpec"
                  label="Pack Short PTD Spec"
                  placeholder="Enter specification"
                />
                <FormInput
                  control={control}
                  name="packShortPtdSize"
                  label="Pack Short PTD Size"
                  placeholder="Enter size"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <FormInput
                control={control}
                name="packShortPtdQty"
                label="Pack Short PTD Qty"
                placeholder="0"
                inputProps={{ type: "number" }}
              />

              <FormInput
                control={control}
                name="packingStyleNpSize"
                label="Packing Style NP Size"
                placeholder="Enter size"
              />

              <FormInput
                control={control}
                name="packingStyleNpQty"
                label="Packing Style NP Qty"
                placeholder="0"
                inputProps={{ type: "number" }}
              />

              <FormInput
                control={control}
                name="noteForCtn"
                label="Note for CTN"
                placeholder="Enter note"
              />

              <FormInput
                control={control}
                name="outerSize"
                label="Outer Size"
                placeholder="Enter outer size"
              />

              <FormInput
                control={control}
                name="outerQty"
                label="Outer Qty"
                placeholder="0"
                inputProps={{ type: "number" }}
              />

              <FormInput
                control={control}
                name="shrink"
                label="Shrink"
                placeholder="Enter shrink"
              />

              <FormInput
                control={control}
                name="shrinkPacking"
                label="Shrink Packing"
                placeholder="Enter shrink packing"
              />

              <FormInput
                control={control}
                name="shipperSize"
                label="Shipper Size"
                placeholder="Enter shipper size"
              />

              <FormInput
                control={control}
                name="qtyPerShipper"
                label="Qty Per Shipper"
                placeholder="0"
                inputProps={{ type: "number" }}
              />

              <FormInput
                control={control}
                name="shipperNote"
                label="Shipper Note"
                placeholder="Enter shipper note"
              />

              <div className="space-y-4 pt-4">
                <FormInput
                  control={control}
                  name="packingNp"
                  label="Packing NP"
                  placeholder="Enter packing NP"
                />

                <FormInput
                  control={control}
                  name="packingNpQty"
                  label="Packing NP Qty"
                  placeholder="0"
                  inputProps={{ type: "number" }}
                />

                <FormInput
                  control={control}
                  name="packingStylePtd"
                  label="Packing Style PTD"
                  placeholder="Enter packing style PTD"
                />

                <FormInput
                  control={control}
                  name="packingStylePtdQty"
                  label="Packing Style PTD Qty"
                  placeholder="0"
                  inputProps={{ type: "number" }}
                />

                <FormInput
                  control={control}
                  name="notePerStrip"
                  label="Note Per Strip"
                  placeholder="Enter note per strip"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
