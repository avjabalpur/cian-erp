import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Save, Copy, X } from "lucide-react";
import { SOInfoForm } from "./so-info-form";
import { ProductInfoForm } from "./product-info-form";
import { ApprovalButtons } from "./approval-buttons";
import { ReferenceDocuments } from "./reference-documents";
import { ChatSidebar } from "./chat-sidebar";
import { UserLookup } from "@/components/shared/lookups/user-lookup";
import { useSalesOrderById } from "@/hooks/sales-order/use-sales-orders";
import { useUpdateSalesOrder } from "@/hooks/sales-order/use-sales-orders";
import { useChatMessagesBySalesOrder } from "@/hooks/sales-order/use-sales-order-chat";
import { useCreateSalesOrderChatMessage } from "@/hooks/sales-order/use-sales-order-chat";
import { useCommentsBySalesOrder } from "@/hooks/sales-order/use-sales-order-comments";
import { useCreateSalesOrderComment } from "@/hooks/sales-order/use-sales-order-comments";
import { useDocumentsBySalesOrder } from "@/hooks/sales-order/use-sales-order-documents";
import { useSaveTransactionsBySalesOrder } from "@/hooks/sales-order/use-sales-order-save-transactions";
import { useCustomerById } from "@/hooks/customers/use-customers";
import { useItemById } from "@/hooks/items/use-items";
import { useUserById } from "@/hooks/use-users";
import { salesOrderUpdateSchema, type SalesOrderUpdateFormValues } from "@/validations/sales-order";
import { currentStatusOptions } from "@/lib/utils/sales-order-utils";
import type { 
  SalesOrder, 
  SalesOrderChat, 
  SalesOrderComment,
  SalesOrderDocument, 
  SalesOrderSaveTransaction,
  UpdateSalesOrderData 
} from "@/types/sales-order-extended";
