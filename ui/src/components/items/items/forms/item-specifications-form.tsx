import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSelect } from "@/components/shared/forms/form-select"
import { FormTextArea } from "@/components/shared/forms/form-text-area"
import { Button } from "@/components/ui/button"
import { Search, FileText } from "lucide-react"
  
interface ItemSpecificationsFormProps {
  control: any;
  itemId?: number;
}

export function ItemSpecificationsForm({ control, itemId }: ItemSpecificationsFormProps) {

  return (
    <div className="space-y-2">
      {/* Item's Specification */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-lg">Item's Specification</CardTitle>
        </CardHeader>
        <CardContent>
          <FormTextArea
            control={control}
            name="itemSpecification"
            label="Item's Specification"
            placeholder="Enter detailed item specification..."
            rows={8}
          />
        </CardContent>
      </Card>

      {/* Substitute Item for */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-lg">Substitute Item for</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <FormInput
                control={control}
                name="substituteItemFor"
                label="Main Item"
                placeholder="Enter substitute item"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-6"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tariff/Commodity */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-lg">Tariff/Commodity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <FormInput
                  control={control}
                  name="customTariffNo"
                  label="Custom Tariff No."
                  placeholder="Enter custom tariff number"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-6"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <FormInput
                  control={control}
                  name="exciseTariffNo"
                  label="Excise Tariff No."
                  placeholder="Enter excise tariff number"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-6"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <FormInput
                  control={control}
                  name="vatCommCode"
                  label="VAT Comm. Code"
                  placeholder="Enter VAT commodity code"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-6"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <FormInput
                  control={control}
                  name="convFactor"
                  label="Conv. Factor"
                  placeholder="0.00000"
                  inputProps={{ type: "number", step: "0.00001" }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-lg">For Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <FormInput
                control={control}
                name="oldCode"
                label="Old Code"
                placeholder="P00533"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-6"
            >
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Standard Weight */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-lg">Standard Weight</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <FormInput
                control={control}
                name="standardWeight"
                label="Standard Weight (in Kgs.)"
                placeholder="0.00000"
                inputProps={{ type: "number", step: "0.00001" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
      {/* Costing Rate Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Costing Rate Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <FormInput
                  control={control}
                  name="standardConversionCostFactor"
                  label="Standard Conversion Cost Factor"
                  placeholder="1.00000"
                  inputProps={{ type: "number", step: "0.00001" }}
                />
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <span className="text-sm text-gray-500">0.00 %</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <FormInput
                  control={control}
                  name="standardPackingCostFactor"
                  label="Standard Packing Cost Factor"
                  placeholder="1.00000"
                  inputProps={{ type: "number", step: "0.00001" }}
                />
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <span className="text-sm text-gray-500">2.000 RS</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 