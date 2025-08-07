"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormTextArea } from "@/components/shared/forms/form-text-area";
import { FormCheckbox } from "@/components/shared/forms/form-checkbox";
import { CustomerAddress } from "@/types/customer-address";
import { AddressFormData, addressSchema } from "@/validations/customer";

interface CustomerAddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  address?: CustomerAddress | null;
  onSave: (data: AddressFormData) => void;
}

export function CustomerAddressDialog({
  isOpen,
  onClose,
  address,
  onSave,
}: CustomerAddressDialogProps) {
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      city: "",
      zipCode: "",
      country: "",
      stateCode: "",
      gstStateCode: "",
      contactPerson: "",
      telephoneNumber: "",
      mobileNumber: "",
      faxNumber: "",
      emailId: "",
      website: "",
      isPrimary: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (address) {
        form.reset({
          addressLine1: address.addressLine1 || "",
          addressLine2: address.addressLine2 || "",
          addressLine3: address.addressLine3 || "",
          city: address.city || "",
          zipCode: address.zipCode || "",
          country: address.country || "",
          stateCode: address.stateCode || "",
          gstStateCode: address.gstStateCode || "",
          contactPerson: address.contactPerson || "",
          telephoneNumber: address.telephoneNumber || "",
          mobileNumber: address.mobileNumber || "",
          faxNumber: address.faxNumber || "",
          emailId: address.emailId || "",
          website: address.website || "",
          isPrimary: address.isPrimary,
        });
      } else {
        form.reset({
          addressLine1: "",
          addressLine2: "",
          addressLine3: "",
          city: "",
          zipCode: "",
          country: "",
          stateCode: "",
          gstStateCode: "",
          contactPerson: "",
          telephoneNumber: "",
          mobileNumber: "",
          faxNumber: "",
          emailId: "",
          website: "",
          isPrimary: false,
        });
      }
    }
  }, [isOpen, address, form]);

  const onSubmit = (data: AddressFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {address ? "Edit Address" : "Add Address"}
          </DialogTitle>
          <DialogDescription>
            {address ? "Update the address information" : "Add a new address for the customer"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={form.control}
              name="contactPerson"
              label="Contact Person"
              placeholder="Enter contact person name"
            />

            <FormInput
              control={form.control}
              name="telephoneNumber"
              label="Telephone Number"
              placeholder="Enter telephone number"
            />

            <FormInput
              control={form.control}
              name="mobileNumber"
              label="Mobile Number"
              placeholder="Enter mobile number"
            />

            <FormInput
              control={form.control}
              name="emailId"
              label="Email"
              placeholder="Enter email address"
              inputProps={{ type: "email" }}
            />

            <FormInput
              control={form.control}
              name="website"
              label="Website"
              placeholder="Enter website URL"
            />

            <FormInput
              control={form.control}
              name="faxNumber"
              label="Fax Number"
              placeholder="Enter fax number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="addressLine1"
              label="Address Line 1"
              placeholder="Enter address line 1"
            />

            <FormInput
              control={form.control}
              name="addressLine2"
              label="Address Line 2"
              placeholder="Enter address line 2"
            />

            <FormInput
              control={form.control}
              name="addressLine3"
              label="Address Line 3"
              placeholder="Enter address line 3"
            />

            <FormInput
              control={form.control}
              name="city"
              label="City"
              placeholder="Enter city"
            />

            <FormInput
              control={form.control}
              name="stateCode"
              label="State Code"
              placeholder="Enter state code"
            />

            <FormInput
              control={form.control}
              name="zipCode"
              label="ZIP Code"
              placeholder="Enter ZIP code"
            />

            <FormInput
              control={form.control}
              name="country"
              label="Country"
              placeholder="Enter country"
            />

            <FormInput
              control={form.control}
              name="gstStateCode"
              label="GST State Code"
              placeholder="Enter GST state code"
            />
          </div>

          <FormCheckbox
            control={form.control}
            name="isPrimary"
            label="Primary Address"
            description="Mark this as the primary address for the customer"
            className="rounded-md border p-4"
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {address ? "Update Address" : "Add Address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}