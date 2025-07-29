"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCreateHsnMaster, useUpdateHsnMaster } from "@/hooks/items/use-hsn-master";
import { RightDrawer } from "@/components/shared/right-drawer";

const hsnMasterSchema = z.object({
  hsnCode: z.string().min(1, "HSN Code is required"),
  description: z.string().optional(),
  hsnType: z.string().optional(),
  taxRate: z.number().min(0).max(100).optional(),
  isActive: z.boolean().default(true),
});

type HsnMasterFormData = z.infer<typeof hsnMasterSchema>;

interface HsnMasterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  hsnCode?: any;
  onSuccess: () => void;
}

export default function HsnMasterDrawer({
  isOpen,
  onClose,
  hsnCode,
  onSuccess,
}: HsnMasterDrawerProps) {
  const { toast } = useToast();
  const createHsnMasterMutation = useCreateHsnMaster();
  const updateHsnMasterMutation = useUpdateHsnMaster();

  const form = useForm<HsnMasterFormData>({
    resolver: zodResolver(hsnMasterSchema),
    defaultValues: {
      hsnCode: "",
      description: "",
      hsnType: "",
      taxRate: undefined,
      isActive: true,
    },
  });

  useEffect(() => {
    if (hsnCode) {
      form.reset({
        hsnCode: hsnCode.hsnCode || "",
        description: hsnCode.description || "",
        hsnType: hsnCode.hsnType || "",
        taxRate: hsnCode.taxRate || undefined,
        isActive: hsnCode.isActive ?? true,
      });
    } else {
      form.reset({
        hsnCode: "",
        description: "",
        hsnType: "",
        taxRate: undefined,
        isActive: true,
      });
    }
  }, [hsnCode, form]);

  const onSubmit = async (data: HsnMasterFormData) => {
    try {
      if (hsnCode) {
        await updateHsnMasterMutation.mutateAsync({
          id: hsnCode.id,
          data,
        });
        toast({
          title: "Success",
          description: "HSN code updated successfully",
        });
      } else {
        await createHsnMasterMutation.mutateAsync(data);
        toast({
          title: "Success",
          description: "HSN code created successfully",
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: hsnCode 
          ? "Failed to update HSN code" 
          : "Failed to create HSN code",
        variant: "destructive",
      });
    }
  };

  const isLoading = createHsnMasterMutation.isPending || updateHsnMasterMutation.isPending;

  return (
    <RightDrawer isOpen={isOpen} onClose={onClose}
    title= {hsnCode ? "Edit HSN Code" : "Create New HSN Code"}
    description= {hsnCode 
      ? "Update the HSN code information below." 
      : "Fill in the information below to create a new HSN code."
    }
    >
    <div className="mx-auto w-full max-w-2xl">
      

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
              <FormField
                control={form.control}
                name="hsnCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HSN Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter HSN code (e.g., 3004)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the HSN (Harmonized System of Nomenclature) code
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter description (optional)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hsnType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HSN Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select HSN type (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">No type specified</SelectItem>
                        <SelectItem value="pharmaceutical">Pharmaceutical</SelectItem>
                        <SelectItem value="medical_device">Medical Device</SelectItem>
                        <SelectItem value="cosmetic">Cosmetic</SelectItem>
                        <SelectItem value="supplement">Supplement</SelectItem>
                        <SelectItem value="chemical">Chemical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter tax rate (0-100)"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : parseFloat(value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the applicable tax rate as a percentage
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this HSN code
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DrawerFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : hsnCode ? "Update HSN Code" : "Create HSN Code"}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
    </RightDrawer>
  );
} 