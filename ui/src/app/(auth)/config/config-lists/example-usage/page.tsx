"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ConfigListSelect, ConfigListMultiSelect } from "@/components/shared/config-list-select";

export default function ConfigListSelectExample() {
  const [selectedValue, setSelectedValue] = useState<string>();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Config List Select Examples</h1>
        <p className="text-muted-foreground">
          Examples of using the shared config list select components
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Single Select Example */}
        <Card>
          <CardHeader>
            <CardTitle>Single Select</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="single-select">Select HSN Type</Label>
              <ConfigListSelect
                listCode="hsn_type"
                value={selectedValue}
                onChange={setSelectedValue}
                placeholder="Select HSN type..."
                showCode={true}
                showOrder={true}
                allowClear={true}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Selected: {selectedValue || "None"}
            </div>
          </CardContent>
        </Card>

        {/* Multi Select Example */}
        <Card>
          <CardHeader>
            <CardTitle>Multi Select</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="multi-select">Select Multiple Values</Label>
              <ConfigListMultiSelect
                listCode="gs_id"
                value={selectedValues}
                onChange={setSelectedValues}
                placeholder="Select multiple values..."
                maxItems={5}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Selected: {selectedValues.length > 0 ? selectedValues.join(", ") : "None"}
            </div>
          </CardContent>
        </Card>

        {/* Basic Select Example */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Select</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="basic-select">Basic Selection</Label>
              <ConfigListSelect
                listCode="payment_methods"
                value={selectedValue}
                onChange={setSelectedValue}
                placeholder="Select payment method..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Disabled Select Example */}
        <Card>
          <CardHeader>
            <CardTitle>Disabled Select</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="disabled-select">Disabled Selection</Label>
              <ConfigListSelect
                listCode="status_types"
                value={selectedValue}
                onChange={setSelectedValue}
                placeholder="This is disabled..."
                disabled={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <h4>Props:</h4>
            <ul>
              <li><strong>listCode</strong>: The code of the config list to fetch values from</li>
              <li><strong>value</strong>: Current selected value(s)</li>
              <li><strong>onChange</strong>: Callback when selection changes</li>
              <li><strong>placeholder</strong>: Placeholder text</li>
              <li><strong>disabled</strong>: Whether the select is disabled</li>
              <li><strong>showCode</strong>: Show the value code as a badge</li>
              <li><strong>showOrder</strong>: Show the display order as a badge</li>
              <li><strong>allowClear</strong>: Allow clearing the selection</li>
              <li><strong>maxItems</strong>: Maximum items for multi-select</li>
            </ul>
            
            <h4>Features:</h4>
            <ul>
              <li>Automatic caching (5 minutes stale time, 10 minutes cache time)</li>
              <li>Error handling with toast notifications</li>
              <li>Loading states with skeletons</li>
              <li>Search functionality</li>
              <li>Only shows active values by default</li>
              <li>Responsive design</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 