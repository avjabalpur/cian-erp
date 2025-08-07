"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCustomerAddresses, useCreateCustomerAddress, useUpdateCustomerAddress, useDeleteCustomerAddress } from "@/hooks/customers/use-customer-addresses";
import { CustomerAddress } from "@/types/customer-address";
import { CustomerAddressDialog } from "./customer-address-dialog";

interface CustomerAddressFormProps {
  customerId?: number;
}

export function CustomerAddressForm({ customerId }: CustomerAddressFormProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(null);

  const { data: addresses = [], isLoading, refetch } = useCustomerAddresses(customerId || 0);
  const createAddressMutation = useCreateCustomerAddress();
  const updateAddressMutation = useUpdateCustomerAddress();
  const deleteAddressMutation = useDeleteCustomerAddress();

  const handleCreateAddress = () => {
    setSelectedAddress(null);
    setIsDialogOpen(true);
  };

  const handleEditAddress = (address: CustomerAddress) => {
    setSelectedAddress(address);
    setIsDialogOpen(true);
  };

  const handleDeleteAddress = async (address: CustomerAddress) => {
    if (!customerId) return;

    try {
      await deleteAddressMutation.mutateAsync({ customerId, addressId: address.id });
      toast({
        title: "Success",
        description: "Address deleted successfully",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete address",
        variant: "destructive",
      });
    }
  };

  const handleSaveAddress = async (data: any) => {
    if (!customerId) return;

    try {
      if (selectedAddress) {
        await updateAddressMutation.mutateAsync({
          customerId,
          addressId: selectedAddress.id,
          data: { ...data, customerId }
        });
        toast({
          title: "Success",
          description: "Address updated successfully",
        });
      } else {
        await createAddressMutation.mutateAsync({
          customerId,
          data: { ...data, customerId }
        });
        toast({
          title: "Success",
          description: "Address created successfully",
        });
      }
      setIsDialogOpen(false);
      setSelectedAddress(null);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save address",
        variant: "destructive",
      });
    }
  };

  if (!customerId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
          <CardDescription>
            Customer addresses will be available after saving the customer
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Addresses</CardTitle>
            <CardDescription>
              Manage customer addresses and contact information
            </CardDescription>
          </div>
          <Button onClick={handleCreateAddress} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading addresses...</div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No addresses found. Click "Add Address" to create one.
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">
                        {address.contactPerson || "No Contact Person"}
                      </h4>
                      {address.isPrimary && (
                        <Badge variant="default">Primary</Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {address.addressLine1 && <div>{address.addressLine1}</div>}
                      {address.addressLine2 && <div>{address.addressLine2}</div>}
                      {address.addressLine3 && <div>{address.addressLine3}</div>}
                      <div>
                        {[address.city, address.stateCode, address.zipCode, address.country]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mt-2">
                        {address.telephoneNumber && (
                          <div>📞 {address.telephoneNumber}</div>
                        )}
                        {address.mobileNumber && (
                          <div>📱 {address.mobileNumber}</div>
                        )}
                        {address.emailId && (
                          <div>✉️ {address.emailId}</div>
                        )}
                        {address.website && (
                          <div>🌐 {address.website}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAddress(address)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CustomerAddressDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedAddress(null);
        }}
        address={selectedAddress}
        onSave={handleSaveAddress}
      />
    </Card>
  );
}
