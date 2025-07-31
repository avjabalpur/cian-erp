import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSelect } from "@/components/shared/forms/form-select"
import { FormSwitch } from "@/components/shared/forms/form-switch"

interface ItemOtherDetailsFormProps {
  control: any;
}

export function ItemOtherDetailsForm({ control }: ItemOtherDetailsFormProps) {
  const colorOptions = [
    { label: "Select color", value: "-1" },
    { label: "DRUG", value: "DRUG" },
    { label: "FOOD", value: "FOOD" },
    { label: "FOOD (NT)", value: "FOOD (NT)" },
    { label: "NULL", value: "NULL" },
    { label: "SOAP", value: "SOAP" },
  ];

  return (
    <div className="space-y-3">
      {/* Basic Properties */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Basic Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormInput
              control={control}
              name="packShort"
              label="PACKSHORT"
              placeholder="Enter pack short"
            />
            <FormInput
              control={control}
              name="productCast"
              label="PRODUCT CAST"
              placeholder="Enter product cast"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormInput
              control={control}
              name="pvcColor"
              label="PVC COLOR"
              placeholder="Enter PVC color"
            />
            <FormSelect
              control={control}
              name="color"
              label="COLOR"
              options={colorOptions}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormInput
              control={control}
              name="flavour"
              label="FLAVOUR"
              placeholder="Enter flavour"
            />
            <FormInput
              control={control}
              name="fragrance"
              label="FRAGRANCE"
              placeholder="Enter fragrance"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormInput
              control={control}
              name="form"
              label="FORM"
              placeholder="Enter form"
            />
            <FormInput
              control={control}
              name="packagingStyle"
              label="PACKAGING STYLE"
              placeholder="Enter packaging style"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormInput
              control={control}
              name="changePart"
              label="CHANGE PART"
              placeholder="Enter change part"
            />
            <FormInput
              control={control}
              name="size"
              label="SIZE"
              placeholder="Enter size"
            />
          </div>
        </CardContent>
      </Card>

      {/* Accessories */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Accessories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormSwitch
              control={control}
              name="withLeaflet"
              label="WITH LEAFLET"
            />
            <FormSwitch
              control={control}
              name="withApplicator"
              label="WITH APPLICATOR"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormSwitch
              control={control}
              name="withWad"
              label="WITH WAD"
            />
            <FormSwitch
              control={control}
              name="withSilica"
              label="WITH SILICA"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormSwitch
              control={control}
              name="withCotton"
              label="WITH COTTON"
            />
            <FormSwitch
              control={control}
              name="withMeasuringCap"
              label="WITH MEASURING CAP"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormSwitch
              control={control}
              name="withSpoon"
              label="WITH SPOON"
            />
          </div>
        </CardContent>
      </Card>

      {/* Packing Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Packing Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormInput
              control={control}
              name="packingNp"
              label="PACKING NP"
              placeholder="Enter packing NP"
            />
            <FormInput
              control={control}
              name="packingNpQty"
              label="PACKING NP QTY"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormInput
              control={control}
              name="packingStylePtd"
              label="PACKING STYLE PTD"
              placeholder="Enter packing style PTD"
            />
            <FormInput
              control={control}
              name="packingStylePtdQty"
              label="PACKING STYLE PTD QTY"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormInput
              control={control}
              name="notePerStrip"
              label="NOTE PER STRIP"
              placeholder="Enter note per strip"
            />
            <FormInput
              control={control}
              name="packShortPtdSpec"
              label="PACK SHORT PTD SPEC"
              placeholder="Enter pack short PTD spec"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormInput
              control={control}
              name="packShortPtdSize"
              label="PACK SHORT PTD SIZE"
              placeholder="Enter pack short PTD size"
            />
            <FormInput
              control={control}
              name="packShortPtdQty"
              label="PACK SHORT PTD QTY"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormInput
              control={control}
              name="packingStyleNpSize"
              label="PACKING STYLE NP SIZE"
              placeholder="Enter packing style NP size"
            />
            <FormInput
              control={control}
              name="packingStyleNpQty"
              label="PACKING STYLE NP QTY"
              placeholder="0"
              inputProps={{ type: "number" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Outer Packing */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Outer Packing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormInput
              control={control}
              name="noteForCtn"
              label="NOTE FOR CTN"
              placeholder="Enter note for CTN"
            />
            <FormInput
              control={control}
              name="outerSize"
              label="OUTER SIZE"
              placeholder="Enter outer size"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
              placeholder="Enter shrink"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormInput
              control={control}
              name="shrinkPacking"
              label="SHRINK PACKING"
              placeholder="Enter shrink packing"
            />
            <FormInput
              control={control}
              name="shipperSize"
              label="SHIPPER SIZE"
              placeholder="Enter shipper size"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
              placeholder="Enter shipper note"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 