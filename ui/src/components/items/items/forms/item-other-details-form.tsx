import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSwitch } from "@/components/shared/forms/form-switch"
import { FormTextarea } from "@/components/shared/forms/form-textarea"

interface ItemOtherDetailsFormProps {
  control: any;
  itemId?: number;
}

export function ItemOtherDetailsForm({ control, itemId }: ItemOtherDetailsFormProps) {
  return (
    <div className="space-y-4">
      {/* Product Characteristics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Product Characteristics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormInput
              control={control}
              name="packShort"
              label="Pack Short"
              placeholder="Enter pack short"
            />
            <FormInput
              control={control}
              name="productCast"
              label="Product Cast"
              placeholder="Enter product cast"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          </div>
        </CardContent>
      </Card>

      {/* Sensory Properties */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Sensory Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          </div>
        </CardContent>
      </Card>

      {/* Physical Properties */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Physical Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
              name="size"
              label="Size"
              placeholder="Enter size"
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FormInput
            control={control}
            name="changePart"
            label="Change Part"
            placeholder="Enter change part"
          />
        </CardContent>
      </Card>

      {/* Packing Accessories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Packing Accessories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormSwitch
              control={control}
              name="withSpoon"
              label="With Spoon"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 