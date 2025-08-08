import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import "./SalesOrderApproval.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import InputWithLabel from "../../Components/InputWithLabel";
import { AutoComplete, Button, DatePicker, Divider, Input, InputNumber, Select, Spin, Tabs, Tag } from "antd";
import { toast } from "react-toastify";
import SalesOrderSaveDiff from "./SalesOrderSaveDiff";
import usePageTitle from "../../Components/usePageTitle";
import { DocumentsUpload } from "./DocumentsUpload";
import { I_ApprovalCardProps, ApprovalCard } from "./ApprovalCard";
import { AddedToProgenStatus, ApprovalTools, CancelForm, MailSentButton, RequestChanges } from "./ApprovalTools";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { SOApprovalOptionsMaster } from "./OptionMasters";
import SoApprovalChatComments from "./SoApprovalChatComments";
import SoApprovalRelatedQuotations from "./SoApprovalRelatedQuotations";
import { I_AuthUser } from "../../Reducers/authReducer";
import MyPortal from "../../Components/MyPortal";
import { copyDataToClipboard } from "../../Components/Functions";
import { CompareWithProgenTab } from "./CompareWithProgenTab";
import { I_SOApprovalPermissions } from "../../RoleInterfaces";
import SoApprovalRelatedPerformaInvoices from "./SoApprovalRelatedPerformaInvoices";

export interface I_SalesOrderApproval {
  id?: number;
  created_by?: number;
  created_by_username?: string;
  created_time?: string;
  updated_by?: string;
  updated_time?: string;
  current_status?: string;
  comments?: string;
  is_submitted?: number;
  is_deleted?: number;
  assigned_designer?: number;
  costing_approved?: number;
  qa_approved?: number;
  is_final_authorized?: number;
  designer_approved?: number;
  final_qa_approved?: number;
  pm_approved?: number;
  plant_email_sent?: number;
  sono?: string;
  so_date?: string;
  so_status?: string;
  manufacturer_name?: string;
  country?: string;
  customer_name?: string;
  customer_gst_no?: string;
  payment_term?: string;
  quotation_date?: string;
  quotation_no?: string;
  hsn_code?: string;
  product_code?: string;
  product_cast?: string;
  product_name?: string;
  dosage_name?: string;
  division?: string;
  design_under?: string;
  packing_style_description?: string;
  composition?: string;
  p_colour?: string;
  p_shelf_life?: string;
  p_pack_short?: string;
  p_tablet_type?: string;
  p_tablet_size?: string;
  p_change_part?: string;
  p_capsule_size?: string;
  p_shipper_size?: string;
  p_qty_per_shipper?: string;
  p_no_of_shipper?: string;
  p_flavour?: string;
  p_fragrance?: string;
  p_quantity?: number;
  p_foc_qty?: number;
  p_mrp?: number;
  p_billing_rate?: number;
  p_costing?: number;
  p_inventory_charges?: string;
  p_cylinder_charge?: string;
  p_palte_charges?: string;
  p_domino?: string;
  p_stereo?: string;
  p_shipper_drawing_ref_code?: string;
  ctn_outer_drawing_ref_no?: string;
  ctn_inner_drawing_ref_no?: string;
  foil_drawing_ref_no?: string;
  leaflet_drawing_ref_no?: string;
  tube_drawing_ref_no?: string;
  label_drawing_ref_no?: string;
  pm_outer_ctn_stock?: string;
  pm_inner_ctn_stock?: string;
  pm_foil_stock?: string;
  pm_leaflet_stock?: string;
  pm_tube_stock?: string;
  pm_label_stock?: string;
  drug_approval_under?: string;
}
export type I_SalesOrderApprovalKeys = keyof I_SalesOrderApproval;


interface I_EditSalesOrderApprovalProps {
  id: number;
  permissions?: I_SOApprovalPermissions;
  homePage?: string;
  user?: I_AuthUser;
}

// Define a type for the keys of permissions
export type PermissionKey = keyof I_SOApprovalPermissions;

export interface I_ColumnInfo {
  title?: string;
  key?: keyof I_SalesOrderApproval;
  type?: "info" | "input" | "input-number" | "input-autocomplete" | "select" | "textarea" | "date" | "component" | "none";
  width?: string;
  editAllowRoles?: PermissionKey[]; // Use PermissionKey type here
  blockForBD?: boolean;
  showIfDosage?: any;
  component?: any;

  extraComponent?: any;
  // If type is select, then options are required
  allowPreviousCopy?: boolean | undefined;
  allowProgenCompare?: boolean | undefined;
  options?: { label: string; value: string | number; color?: string; disabled?: boolean, is_deleted?: boolean }[];
}

export type I_LayoutDetailsInfo = {
  [key in keyof I_SalesOrderApproval]: I_ColumnInfo;
};

export function EditSalesOrderApproval({
  id,
  permissions = { admin: true },
  homePage = "/sales-order-approval",
  user,
}: I_EditSalesOrderApprovalProps) {
  usePageTitle(id.toString() + " | Edit Sales Order Approval | Cian", ["Sales Order Approval", id.toString()]);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(true);
  const [details, setDetails] = useState<I_SalesOrderApproval>({});
  const [modifiedDetails, setModifiedDetails] = useState<I_SalesOrderApproval>({});
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const previousVisitTime = useMemo(() => {
    return getLastVisitedTimeForSOApprovalFromLocalStorage(id) || "2024-01-01T00:00:00+05:30"
  }, [id]);

  useEffect(() => {
    saveTheCurrentTimeForSOApprovalInLocalStorage(id);
  }, [id]);


  const getDetails = async () => {
    setLoading(true);
    await axios
      .get("/get-sales-order-approval-by-id", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const data: any = res.data.data;
        setDetails(data);
      })
      .catch((error) => {
        error.handleGlobally("SO Approval Details");
        navigate(homePage);
      });
    setLoading(false);
  };

  useEffect(() => {
    getDetails();
  }, []);

  const [refetchOptionsFromDB, setRefetchOptionsFromDB] = useState(false);
  // UseQuery For all the backend options
  const { data: backendOptionsData, isLoading: backendOptionsLoading } = useQuery({
    queryKey: ["so-approval-backend-options", refetchOptionsFromDB],
    queryFn: async () => {
      const response = await axios
        .get("/sales-order-approval-all-field-options", {
          params: {
            refetch_from_db: refetchOptionsFromDB,
          },
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          err.handleGlobally?.("Get Field Options");
          throw err;
        });
      return response.data.data;
    },
  });

  const addEmptyOption = (options?: any[]) => {
    return options ? [{ label: "", value: "" }, ...options] : [];
  };

  const fieldOptions = useMemo(() => {
    return {
      current_status: SOApprovalOptionsMaster.current_status,
      assigned_designer: SOApprovalOptionsMaster.assigned_designer,
      so_status: SOApprovalOptionsMaster.so_status,
      manufacturer_name: SOApprovalOptionsMaster.manufacturer_name,
      customer_name: backendOptionsData?.customer_name || [],
      payment_term: addEmptyOption(backendOptionsData?.payment_term),
      hsn_code: backendOptionsData?.["HSNCODE"] || [],
      product_cast: backendOptionsData?.["PCAST"] || [],
      product_name: backendOptionsData?.["product_name"] || [],
      dosage_name: SOApprovalOptionsMaster.dosage_name,
      division_and_design_under: backendOptionsData?.["division_and_design_under"] || [],
      p_colour: backendOptionsData?.["PVC COLOUR"] || [],
      p_shelf_life: SOApprovalOptionsMaster.p_shelf_life,
      // p_tablet_type: backendOptionsData?.["TABCOATINGTYPE"] || [],
      p_tablet_type: backendOptionsData?.["FORM"] || [],
      p_tablet_size: backendOptionsData?.["SIZE"] || [],
      p_change_part: backendOptionsData?.["CHANGEPART"] || [],
      p_capsule_size: backendOptionsData?.["SIZE"] || [],
      p_shipper_size: backendOptionsData?.["SHIPPER SIZE"] || [],
      p_flavour: backendOptionsData?.["FLAVOUR"] || [],
      p_fragrance: backendOptionsData?.["FRAGRANCE"] || [],
      p_domino: addEmptyOption(SOApprovalOptionsMaster.p_domino),
    };
  }, [backendOptionsData]);

  const layoutDetailsInfo: I_LayoutDetailsInfo =
    // useMemo(() => { return
    {
      id: {
        title: "ID",
        key: "id",
        type: "info",
      },
      created_by: {
        title: "Created By",
        key: "created_by",
        type: "info",
      },
      created_time: {
        title: "Created Time",
        key: "created_time",
        type: "info",
      },
      updated_by: {
        title: "Updated By",
        key: "updated_by",
        type: "info",
      },
      updated_time: {
        title: "Updated Time",
        key: "updated_time",
        type: "info",
      },
      current_status: {
        title: "Current Status",
        key: "current_status",
        type: "select",
        options: fieldOptions.current_status,
        // editAllowRoles: ["admin"],
      },
      comments: {
        title: "Comments",
        key: "comments",
        type: "textarea",
        allowProgenCompare: true,
      },
      is_submitted: {
        title: "Is Submitted",
        key: "is_submitted",
        type: "info",
      },
      is_deleted: {
        title: "Is Deleted",
        key: "is_deleted",
        type: "info",
      },
      assigned_designer: {
        title: "Assigned Designer",
        key: "assigned_designer",
        type: "info",
        blockForBD: true,
        editAllowRoles: ["design_admin"],
        options: fieldOptions.assigned_designer,
      },
      costing_approved: {
        title: "Costing Approved",
        key: "costing_approved",
        type: "info",
      },
      qa_approved: {
        title: "QA Approved",
        key: "qa_approved",
        type: "info",
      },
      is_final_authorized: {
        title: "Is Final Authorized",
        key: "is_final_authorized",
        type: "info",
      },
      designer_approved: {
        title: "Designer Approved",
        key: "designer_approved",
        type: "info",
      },
      final_qa_approved: {
        title: "Final QA Approved",
        key: "final_qa_approved",
        type: "info",
      },
      pm_approved: {
        title: "PM Approved",
        key: "pm_approved",
        type: "info",
      },
      plant_email_sent: {
        title: "Email Sent",
        key: "plant_email_sent",
        type: "info",
      },
      sono: {
        title: "SONO",
        key: "sono",
        type: "info",
        // Progen, non editable
      },
      so_date: {
        title: "SO Date",
        key: "so_date",
        type: "info",
        // Progen, non editable
      },
      so_status: {
        title: "SO Status",
        key: "so_status",
        type: "select",
        options: fieldOptions.so_status,
        // Progen, non editable
      },
      manufacturer_name: {
        title: "Manufacturer Name",
        key: "manufacturer_name",
        type: "select",
        // editAllowRoles: ["admin"],
        allowPreviousCopy: true,
        options: fieldOptions.manufacturer_name,
        // Progen, non editable
      },
      country: {
        title: "Country",
        key: "country",
        type: "info",
        // allowPreviousCopy: true,
        // Progen, non editable
      },
      customer_name: {
        title: "Customer Name",
        key: "customer_name",
        type: "select",
        options: fieldOptions.customer_name,
        allowPreviousCopy: true,
        // Progen, non editable
      },
      customer_gst_no: {
        title: "Customer GST No",
        key: "customer_gst_no",
        type: "info",
        // allowPreviousCopy: true,
        // Progen, non editable
      },
      payment_term: {
        title: "Payment Term",
        key: "payment_term",
        type: "select",
        options: fieldOptions.payment_term,
        allowPreviousCopy: true,
        // Progen, editable, Options Selection
      },
      // TODO: Think on this
      quotation_date: {
        title: "Quotation Date",
        key: "quotation_date",
        type: "info",
        // Progen, non editable
      },
      quotation_no: {
        title: "Quotation No",
        key: "quotation_no",
        type: "info",
        // Progen, non editable
      },
      hsn_code: {
        title: "HSN Code",
        key: "hsn_code",
        type: "input-autocomplete",
        options: fieldOptions.hsn_code,
        allowPreviousCopy: true,
        allowProgenCompare: true,
        // Progen, non editable
      },
      product_code: {
        title: "Product Code",
        key: "product_code",
        type: "info",
        allowProgenCompare: true,
        // allowPreviousCopy: true,
        // Progen, non editable
      },
      product_cast: {
        title: "Product Cast",
        key: "product_cast",
        type: "select",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        options: fieldOptions.product_cast,
        // Progen, non editable
      },
      product_name: {
        title: "Product Name",
        key: "product_name",
        type: "input-autocomplete",
        options: fieldOptions.product_name,
        allowPreviousCopy: true,
        allowProgenCompare: true,
        // Progen, non editable
      },
      dosage_name: {
        title: "Dosage Name",
        key: "dosage_name",
        type: "select",
        options: fieldOptions.dosage_name,
        // allowPreviousCopy: true,
        // Progen, non editable
      },
      division: {
        title: "Division",
        key: "division",
        type: "input-autocomplete",
        options: fieldOptions.division_and_design_under,
        allowPreviousCopy: true,
        allowProgenCompare: true,
        editAllowRoles: ["design_admin"],
        blockForBD: true,
        // Progen, non editable
      },
      design_under: {
        title: "Design Under",
        key: "design_under",
        type: "input-autocomplete",
        options: fieldOptions.division_and_design_under,
        allowPreviousCopy: true,
        allowProgenCompare: true,
        editAllowRoles: ["design_admin"],
        blockForBD: true,
        // Progen, editable, input
      },
      composition: {
        title: "Composition",
        key: "composition",
        type: "textarea",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        // Progen, not editable, input
      },
      p_colour: {
        title: "P Colour",
        key: "p_colour",
        type: "input-autocomplete",
        options: fieldOptions.p_colour,
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          // GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          // CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["costing_admin"],
        // Progen, editable, Option Selection
      },
      p_shelf_life: {
        title: "P Shelf Life",
        key: "p_shelf_life",
        type: "select",
        options: fieldOptions.p_shelf_life,
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["costing_admin"],
        // Progen, editable, Option Selection
      },
      p_pack_short: {
        title: "P Pack Short",
        key: "p_pack_short",
        type: "input",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        // Progen, editable, Option editable
      },
      packing_style_description: {
        title: "Packing Style Description",
        key: "packing_style_description",
        type: "input",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        // Progen, editable, input
      },
      p_tablet_type: {
        title: "P Tablet Type",
        key: "p_tablet_type",
        type: "input-autocomplete",
        options: fieldOptions.p_tablet_type,
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          // GEL: true,
          // CAPSULE: true,
          // LIQUID: true,
          // OINTMENT: true,
          // POWDER: true,
          // CREAM: true,
          // SOFTGEL: true,
        },
        // Progen, editable, Option Selection
      },
      p_tablet_size: {
        title: "P Tablet Size",
        key: "p_tablet_size",
        type: "input-autocomplete",
        options: fieldOptions.p_tablet_size,
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          // GEL: true,
          // CAPSULE: true,
          // LIQUID: true,
          // OINTMENT: true,
          // POWDER: true,
          // CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["costing_admin"],
        // Progen, editable, Option Selection
      },
      p_change_part: {
        title: "P Change Part",
        key: "p_change_part",
        type: "input-autocomplete",
        options: fieldOptions.p_change_part,
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          // GEL: true,
          CAPSULE: true,
          // LIQUID: true,
          // OINTMENT: true,
          // POWDER: true,
          // CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["costing_admin"],
        // Progen, editable, Option Selection
      },
      p_capsule_size: {
        title: "P Capsule Size",
        key: "p_capsule_size",
        type: "input-autocomplete",
        options: fieldOptions.p_capsule_size,
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          // TABLET: true,
          // GEL: true,
          CAPSULE: true,
          // LIQUID: true,
          // OINTMENT: true,
          // POWDER: true,
          // CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["costing_admin"],
        // Progen, editable, Option Selection
      },
      p_shipper_size: {
        title: "P Shipper Size",
        key: "p_shipper_size",
        type: "select",
        options: fieldOptions.p_shipper_size,
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["progen_data_entry"],
        blockForBD: true,
        // Progen, editable, Option editable
      },
      p_qty_per_shipper: {
        title: "P Qty Per Shipper",
        key: "p_qty_per_shipper",
        type: "input-number",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["progen_data_entry"],
        blockForBD: true,
        // Progen, editable, Option editable
      },
      p_no_of_shipper: {
        title: "P No Of Shipper",
        key: "p_no_of_shipper",
        type: "input-number",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["progen_data_entry"],
        blockForBD: true,
        // Progen, editable, Option editable
      },
      p_flavour: {
        title: "P Flavour",
        key: "p_flavour",
        type: "input-autocomplete",
        options: fieldOptions.p_flavour,
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          // GEL: true,
          // CAPSULE: true,
          LIQUID: true,
          // OINTMENT: true,
          POWDER: true,
          // CREAM: true,
          // SOFTGEL: true,
        },
        // Progen, editable, Option Selection
      },
      // p_fragrance: {
      //   title: "P Fragrance",
      //   key: "p_fragrance",
      //   type: "input",
      //   showIfDosage: {
      //     TABLET: true,
      //     // GEL: true,
      //     // CAPSULE: true,
      //     LIQUID: true,
      //     // OINTMENT: true,
      //     // POWDER: true,
      //     // CREAM: true,
      //     SOFTGEL: true,
      //   },
      // },
      p_quantity: {
        title: "P Quantity",
        key: "p_quantity",
        type: "input-number",
        width: "100px",
        // allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        // Progen, editable, input
      },
      p_foc_qty: {
        title: "P FOC Qty",
        key: "p_foc_qty",
        type: "input-number",
        width: "100px",
        // allowPreviousCopy: true,
        // allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        // Progen, editable, input
      },
      p_mrp: {
        title: "P MRP",
        key: "p_mrp",
        type: "input-number",
        width: "100px",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        // Progen, editable, input
      },
      p_billing_rate: {
        title: "P Billing Rate",
        key: "p_billing_rate",
        type: "input-number",
        width: "100px",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        // Progen, editable, input
      },
      p_costing: {
        title: "P Costing",
        key: "p_costing",
        type: "input-number",
        extraComponent: () => {
          const p_quantity = parseInt(`${modifiedDetails.p_quantity ? modifiedDetails.p_quantity : details.p_quantity}`) || 0;
          const p_foc_qty = parseInt(`${modifiedDetails.p_foc_qty ? modifiedDetails.p_foc_qty : details.p_foc_qty}`) || 0;
          const p_billing_rate = parseFloat(`${modifiedDetails.p_billing_rate ? modifiedDetails.p_billing_rate : details.p_billing_rate}`) || 0;
          const p_costing = parseFloat(`${modifiedDetails.p_costing ? modifiedDetails.p_costing : details.p_costing}`) || 0;
          const value = p_billing_rate * p_quantity;
          const cost = p_costing * (p_quantity + p_foc_qty);
          const profit = value - cost;
          const margin_percent = ((profit / value) * 100) || 0;

          return (
            <>
              <InputWithLabel label="Margin %" divStyle={{ marginLeft: "40px" }} tooltip="Profit Margin % = ((Profit / Value) * 100)">
                <b>{margin_percent.toFixed(2)}%</b>
              </InputWithLabel>
              <InputWithLabel label="Value" divStyle={{ marginLeft: "40px" }} tooltip="Value = Billing Rate * Quantity">
                <b>{value.toFixed(2)}</b>
              </InputWithLabel>
              <InputWithLabel label="Profit" divStyle={{ marginLeft: "40px" }} tooltip="Profit = Value - (Costing * (Quantity + FOC Quantity))">
                <b>{profit.toFixed(2)}</b>
              </InputWithLabel>
            </>
          );
        },
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["costing_admin"],
        // Progen, editable, input
      },
      p_inventory_charges: {
        title: "P Inventory Charges",
        key: "p_inventory_charges",
        type: "input-number",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        // Progen, editable, input
      },
      p_cylinder_charge: {
        title: "Cylinder / Plate Charges",
        key: "p_cylinder_charge",
        type: "input-number",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        // Progen, editable, input
      },
      // p_palte_charges: {
      //   title: "P Palte Charges",
      //   key: "p_palte_charges",
      //   type: "input",
      //   showIfDosage: {
      //     // TABLET: true,
      //     GEL: true,
      //     // CAPSULE: true,
      //     // LIQUID: true,
      //     OINTMENT: true,
      //     // POWDER: true,
      //     // CREAM: true,
      //     // SOFTGEL: true,
      //   },
      // },
      p_domino: {
        title: "Domino / Stereo",
        key: "p_domino",
        type: "select",
        options: fieldOptions.p_domino,
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["progen_data_entry"],
        blockForBD: true,
        // Progen, editable, Select Option (Domino, Stereo) => Default: Stereo
      },
      // p_stereo: {
      //   title: "P Stereo",
      //   key: "p_stereo",
      //   type: "input",
      //   showIfDosage: {
      //     TABLET: true,
      //     // GEL: true,
      //     // CAPSULE: true,
      //     // LIQUID: true,
      //     // OINTMENT: true,
      //     // POWDER: true,
      //     // CREAM: true,
      //     // SOFTGEL: true,
      //   },
      // },
      p_shipper_drawing_ref_code: {
        title: "P Shipper Drawing Ref Code",
        key: "p_shipper_drawing_ref_code",
        type: "input",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["design_admin", "qa_admin"],
        blockForBD: true,
        // Progen, editable, input
      },
      ctn_outer_drawing_ref_no: {
        title: "CTN Outer Drawing Ref No",
        key: "ctn_outer_drawing_ref_no",
        type: "input",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["design_admin", "qa_admin"],
        blockForBD: true,
        // Progen, editable, input
      },
      ctn_inner_drawing_ref_no: {
        title: "CTN Inner Drawing Ref No",
        key: "ctn_inner_drawing_ref_no",
        type: "input",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["design_admin", "qa_admin"],
        blockForBD: true,
        // Progen, editable, input
      },
      foil_drawing_ref_no: {
        title: "Foil Drawing Ref No",
        key: "foil_drawing_ref_no",
        type: "input",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          // GEL: true,
          CAPSULE: true,
          // LIQUID: true,
          // OINTMENT: true,
          // POWDER: true,
          // CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["design_admin", "qa_admin"],
        blockForBD: true,
        // Progen, editable, input
      },
      leaflet_drawing_ref_no: {
        title: "Leaflet Drawing Ref No",
        key: "leaflet_drawing_ref_no",
        type: "input",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["design_admin", "qa_admin"],
        blockForBD: true,
        // Progen, editable, input
        // Progen, editable, input
      },
      tube_drawing_ref_no: {
        title: "Tube Drawing Ref No",
        key: "tube_drawing_ref_no",
        type: "input",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          // TABLET: true,
          GEL: true,
          // CAPSULE: true,
          // LIQUID: true,
          OINTMENT: true,
          // POWDER: true,
          CREAM: true,
          // SOFTGEL: true,
        },
        editAllowRoles: ["design_admin", "qa_admin"],
        blockForBD: true,
        // Progen, editable, input
      },
      label_drawing_ref_no: {
        title: "Label Drawing Ref No",
        key: "label_drawing_ref_no",
        type: "input",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["design_admin", "qa_admin"],
        blockForBD: true,
        // Progen, editable, input
      },
      pm_outer_ctn_stock: {
        title: "PM Outer CTN Stock",
        key: "pm_outer_ctn_stock",
        type: "input-number",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["pm_admin"],
        blockForBD: true,
        // Progen, editable, input
      },
      pm_inner_ctn_stock: {
        title: "PM Inner CTN Stock",
        key: "pm_inner_ctn_stock",
        type: "input-number",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["pm_admin"],
        blockForBD: true,
        // Progen, editable, input
      },
      pm_foil_stock: {
        title: "PM Foil Stock",
        key: "pm_foil_stock",
        type: "input-number",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          // GEL: true,
          CAPSULE: true,
          // LIQUID: true,
          // OINTMENT: true,
          // POWDER: true,
          // CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["pm_admin"],
        blockForBD: true,
      },
      pm_leaflet_stock: {
        title: "PM Leaflet Stock",
        key: "pm_leaflet_stock",
        type: "input-number",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["pm_admin"],
        blockForBD: true,
      },
      pm_tube_stock: {
        title: "PM Tube Stock",
        key: "pm_tube_stock",
        type: "input-number",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          // TABLET: true,
          GEL: true,
          // CAPSULE: true,
          // LIQUID: true,
          OINTMENT: true,
          // POWDER: true,
          CREAM: true,
          // SOFTGEL: true,
        },
        editAllowRoles: ["pm_admin"],
        blockForBD: true,
      },
      pm_label_stock: {
        title: "PM Label Stock",
        key: "pm_label_stock",
        type: "input-number",
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
        editAllowRoles: ["pm_admin"],
        blockForBD: true,
      },
      drug_approval_under: {
        title: "Drug Approval Under",
        key: "drug_approval_under",
        type: "select",
        options: fieldOptions.manufacturer_name,
        allowPreviousCopy: true,
        allowProgenCompare: true,
        showIfDosage: {
          TABLET: true,
          GEL: true,
          CAPSULE: true,
          LIQUID: true,
          OINTMENT: true,
          POWDER: true,
          CREAM: true,
          SOFTGEL: true,
        },
      },
    };
  // }, [fieldOptions, details?.current_status]);

  const layout: { title: string; children: (keyof typeof layoutDetailsInfo)[][] }[] = [
    {
      title: "So Info",
      children: [
        // ["comments"],
        ["sono", "so_date", "so_status"],
        ["manufacturer_name", "country"],
        ["customer_name", "customer_gst_no"],
        // ["quotation_date", "quotation_no"],
        ["payment_term", "hsn_code"],
        ["product_name", "product_code", "product_cast"],
        ["dosage_name", "division", "design_under"],
        ["composition"],
      ],
    },
    {
      title: "Product Info",
      children: [
        ["p_quantity", "p_foc_qty", "p_billing_rate", "p_mrp"],
        ["p_costing"],
        ["p_colour", "p_shelf_life"],
        ["p_pack_short", "packing_style_description"],
        ["p_tablet_type", "p_tablet_size", "p_capsule_size", "p_change_part"],
        ["p_shipper_size", "p_qty_per_shipper", "p_no_of_shipper"],
        ["p_flavour", "p_fragrance"],
        ["p_inventory_charges", "p_cylinder_charge", "p_palte_charges"],
        ["p_domino", "p_stereo"],
        ["p_shipper_drawing_ref_code", "drug_approval_under"],
        ["ctn_outer_drawing_ref_no", "pm_outer_ctn_stock"],
        ["ctn_inner_drawing_ref_no", "pm_inner_ctn_stock"],
        ["foil_drawing_ref_no", "pm_foil_stock"],
        ["leaflet_drawing_ref_no", "pm_leaflet_stock"],
        ["tube_drawing_ref_no", "pm_tube_stock"],
        ["label_drawing_ref_no", "pm_label_stock"],
      ],
    },
    {
      title: "Other",
      children: [["comments"]],
    },
  ];

  const setModifiedDetailsKey = <K extends keyof I_SalesOrderApproval>(key: K, value: I_SalesOrderApproval[K]) => {
    if (value === details?.[key]) {
      setModifiedDetails((prev) => {
        const newDetails = { ...prev };
        delete newDetails[key];
        return newDetails;
      });
      return;
    }
    setModifiedDetails((prev) => ({ ...prev, [key]: value }));
  };

  /************************ Dependent UseEffects START*********************************************/
  useEffect(() => {
    if (modifiedDetails?.customer_name) {
      // Find the customer and set its country and gst no
      const customer = fieldOptions?.customer_name.find((c: any) => c.value === modifiedDetails?.customer_name);
      if (customer) {
        setModifiedDetailsKey("country", customer.country);
        setModifiedDetailsKey("customer_gst_no", customer.gst_no);
      }
    }
  }, [modifiedDetails?.customer_name]);

  useEffect(() => {
    if (modifiedDetails?.product_name) {
      // Find the product and set its code
      console.log("modifiedDetails?.product_name", modifiedDetails?.product_name, fieldOptions?.product_name);
      const product = fieldOptions?.product_name?.find((c: any) => c.value === modifiedDetails?.product_name);
      console.log("product", product);
      if (product) {
        setModifiedDetailsKey("product_code", product.item_code);
      } else {
        setModifiedDetailsKey("product_code", "");
      }
    }
  }, [modifiedDetails?.product_name]);
  /************************ Dependent UseEffects END *********************************************/

  const isEditDisabled = <K extends keyof typeof layoutDetailsInfo>(key: K, checkStatus=true) => {
    // Disable Edit if already submitted or if no permissions
    if (!permissions) return true;
    if (checkStatus && details?.current_status === "ADDED-TO-PROGEN") return true;
    if (permissions?.admin) return false;
    const colInfo = layoutDetailsInfo[key];
    if (permissions?.bd && details?.created_by === user?.userId) {
      if (colInfo?.blockForBD) {
        return true;
      } else {
        return false;
      }
    }

    return !colInfo?.editAllowRoles?.some((role) => permissions[role]);
  };

  const isColumnVisible = <K extends keyof typeof layoutDetailsInfo>(key: K) => {
    const colInfo = layoutDetailsInfo[key];
    if (!colInfo?.showIfDosage) return true;

    const dosage = details?.dosage_name;
    // const dosage = modifiedDetails?.dosage_name;
    // console.log("dosage", dosage, key, colInfo?.showIfDosage);
    return dosage && colInfo?.showIfDosage[dosage];
  };

  const finalLayout = useMemo(() => {
    const fl = [];
    // Fo loop on [{ title, children: [[], []] }]
    for (const section of layout) {
      const children = [];
      // For loop on [[], []]
      for (const row of section.children) {
        const cols = [];
        // For loop on []
        for (const col of row) {
          if (isColumnVisible(col)) {
            cols.push(col);
          }
        }

        if (cols.length > 0) {
          children.push(cols);
        }
      }
      if (children.length > 0) {
        fl.push({ ...section, children });
      }
    }
    // console.log("finalLayout", fl);
    return fl;
  }, [details?.dosage_name, modifiedDetails]);


  const saveDetails = async (updatedDetails = modifiedDetails) => {
    setLoading(true);
    // If no changes, then return
    if (Object.keys(updatedDetails).length === 0) {
      toast.info("No changes to save");
      setLoading(false);
      return;
    }
    const data: any = {
      ...updatedDetails,
      id: id,
      save_diff: {},
    };
    for (const key in updatedDetails) {
      data.save_diff[key] = {
        p: details?.[key as keyof I_SalesOrderApproval] || "",
        n: updatedDetails?.[key as keyof I_SalesOrderApproval] || "",
      };
    }
    console.log(details, modifiedDetails, updatedDetails);
    await axios
      .post("/save-sales-order-approval", data)
      .then(async () => {
        setModifiedDetails({});

        queryClient.invalidateQueries({ queryKey: ["CHAT-so-approval-save-history"] });
        queryClient.invalidateQueries({ queryKey: ["SAVEDIFF-so-approval-save-history"] });
        await getDetails();
        toast.success("Details saved successfully");
        saveTheCurrentTimeForSOApprovalInLocalStorage(id);
      })
      .catch((error) => {
        error.handleGlobally("Save SO Approval Details");
      });
    setLoading(false);
  };

  // These should only be visible if the current status is SO-CONFIRMED, ADDED-TO-PROGEN, REQUEST-CHANGES
  const allApprovalCardsVisible = ["SO-CONFIRMED", "ADDED-TO-PROGEN", "REQUEST-CHANGES"].includes(details?.current_status || "");
  const approvalCards: I_ApprovalCardProps[] = [
    {
      title: "Costing Approval",
      approval_type: "costing_approval",
      keyName: "costing_approved",
      requiredRoles: ["costing_admin", "admin"],
      visible: allApprovalCardsVisible,
    },
    {
      title: "QA Approval",
      approval_type: "qa_approval",
      keyName: "qa_approved",
      requiredRoles: ["qa_admin", "admin"],
      visible: details?.costing_approved ? true : false,
    },
    {
      title: "Final Authorization",
      approval_type: "final_authorization",
      keyName: "is_final_authorized",
      requiredRoles: ["final_authorization_admin", "admin"],
      visible: details?.qa_approved ? true : false,
    },
    {
      title: "Designer Approval",
      approval_type: "designer_approval",
      keyName: "designer_approved",
      requiredRoles: ["design_admin", "admin"],
      visible: details?.is_final_authorized ? true : false,
    },
    {
      title: "Final QA Approval",
      approval_type: "final_qa_approval",
      keyName: "final_qa_approved",
      requiredRoles: ["final_qa_admin", "admin"],
      visible: details?.designer_approved ? true : false,
    },
    {
      title: "PM Approval",
      approval_type: "pm_approval",
      keyName: "pm_approved",
      requiredRoles: ["pm_admin", "admin"],
      visible: details?.final_qa_approved ? true : false,
    },
  ];

  return (
    <div className="my-form-outer">
      <MyPortal id="navbar-portal">
        <Button type="primary" onClick={() => copyDataToClipboard(window.location.href)}>
          Copy Link
        </Button>
      </MyPortal>

      {/* TODO: Chnage To items */}
      {/* {JSON.stringify(permissions)} */}
      <Tabs
        size="large"
        // defaultActiveKey="1"
        activeKey={searchParams?.get("tab") || "basic-info"}
        onChange={(key) => {
          searchParams.set("tab", key);
          setSearchParams(searchParams);
        }}
        className="my-form-tabs"
        tabBarExtraContent={
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <InputWithLabel label="Assigned Designer" isInline={true} labelStyle={{ width: "max-content" }} divStyle={{borderRight: "2px solid #000", paddingRight: "10px"}}>
              <Select
                value={modifiedDetails?.assigned_designer || details?.assigned_designer}
                disabled={isEditDisabled("assigned_designer", false)}
                style={{ width: "120px" }}
                onChange={(value) => {
                  setModifiedDetailsKey("assigned_designer", value);
                }}
                status={modifiedDetails?.assigned_designer ? "warning" : ""}
              >
                {layoutDetailsInfo?.["assigned_designer"]?.options?.map((option) => {
                  return (
                    <Select.Option value={option.value} key={option.value}>
                      {option.label}
                    </Select.Option>
                  );
                }
                )}
              </Select>
            </InputWithLabel>
            <InputWithLabel label="Created By" isInline={true} labelStyle={{ width: "max-content" }} divStyle={{borderRight: "2px solid #000", paddingRight: "10px"}}>
              <Input value={details?.created_by_username} disabled style={{ width: "80px" }} />
            </InputWithLabel>
            <ApprovalTools
              id={id}
              details={details}
              modifiedDetails={modifiedDetails}
              setModifiedDetails={setModifiedDetails}
              permissions={permissions}
              previousCopyAllowedKeys={
                Object.keys(layoutDetailsInfo).filter((key) => {
                  return (
                    layoutDetailsInfo[key as keyof I_SalesOrderApproval]?.allowPreviousCopy &&
                    isColumnVisible(key as keyof I_SalesOrderApproval) &&
                    !isEditDisabled(key as keyof I_SalesOrderApproval)
                  );
                }) as (keyof I_SalesOrderApproval)[]
              }
              layoutDetailsInfo={layoutDetailsInfo}
              refetchOptionsFromDB={refetchOptionsFromDB}
              setRefetchOptionsFromDB={setRefetchOptionsFromDB}
            />
            <Link to={homePage}>
              <Button type="default">Back</Button>
            </Link>
            <Button
              onClick={() => {
                saveDetails();
              }}
              type="primary"
              disabled={Object.keys(modifiedDetails).length === 0}
              loading={loading}
            >
              Save
            </Button>
            {/* <Button onClick={() => setModifiedDetailsKey("manufacturer_name", "Testing")} type="primary">
              Test
            </Button>
            <Button onClick={() => console.log(modifiedDetails)} type="primary">
              Test 2
            </Button> */}
          </div>
        }
        items={[
          {
            key: "basic-info",
            label: "Basic Info",
            children: (
              <Spin spinning={loading || backendOptionsLoading}>
                <div
                  style={{
                    display: "inline-flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "calc(100vh - 130px)",
                    gap: "10px",
                  }}
                >
                  <div style={{ width: "100%", height: "100%", overflow: "auto", padding: "0px 10px" }}>
                    <div className="my-form-flex" style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div className="my-form-flex" style={{ justifyContent: "flex-start", alignItems: "flex-end" }}>
                        <InputWithLabel
                          label={layoutDetailsInfo?.["current_status"]?.title || ""}
                          divStyle={{ width: "max-content" }}
                          labelWidth="300px"
                        >
                          <Select
                            value={modifiedDetails?.current_status || details?.current_status}
                            disabled={
                              isEditDisabled("current_status") ||
                              details?.current_status === "ADDED-TO-PROGEN" ||
                              details?.current_status === "REQUEST-CHANGES"
                            }
                            style={{ width: "300px" }}
                            onChange={(value) => {
                              setModifiedDetailsKey("current_status", value);
                            }}
                          >
                            {layoutDetailsInfo?.["current_status"]?.options?.map((option) => {
                              return (
                                <Select.Option
                                  value={option.value}
                                  key={option.value}
                                  style={{ color: option.color }}
                                  disabled={option.disabled}
                                >
                                  <Tag color={option.color}>{option.value}</Tag>
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </InputWithLabel>
                        {/* TODO: Change this to Only be visible when all approved */}
                        {permissions?.progen_data_entry &&
                        details?.costing_approved &&
                        details?.qa_approved &&
                        details?.is_final_authorized &&
                        // && details?.designer_approved
                        // && details?.final_qa_approved
                        // && details?.pm_approved
                        (details?.current_status == "SO-CONFIRMED" || details?.current_status == "REQUEST-CHANGES") ? (
                          <AddedToProgenStatus
                            details={details}
                            modifiedDetails={modifiedDetails}
                            setModifiedDetailsKey={setModifiedDetailsKey}
                            saveDetails={saveDetails}
                          />
                        ) : null}
                        {(permissions?.bd && details?.current_status === "ADDED-TO-PROGEN") ||
                        (permissions?.design_admin && details?.current_status === "ADDED-TO-PROGEN") ||
                        (permissions?.pm_admin && details?.current_status === "ADDED-TO-PROGEN") ? (
                          <RequestChanges
                            details={details}
                            modifiedDetails={modifiedDetails}
                            setModifiedDetailsKey={setModifiedDetailsKey}
                            saveDetails={saveDetails}
                          />
                        ) : null}
                      </div>
                      <div>
                        {permissions?.bd &&
                        (details?.current_status === "ADDED-TO-PROGEN" || details?.current_status === "REQUEST-CHANGES") ? (
                          <CancelForm
                            details={details}
                            modifiedDetails={modifiedDetails}
                            setModifiedDetailsKey={setModifiedDetailsKey}
                            saveDetails={saveDetails}
                          />
                        ) : null}
                        {permissions?.progen_data_entry ? (
                          <MailSentButton
                            details={details}
                            modifiedDetails={modifiedDetails}
                            setModifiedDetailsKey={setModifiedDetailsKey}
                            saveDetails={saveDetails}
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="my-form-flex" style={{ gap: "50px", margin: "10px 0px", flexWrap: "wrap" }}>
                      {approvalCards.map((approval) => {
                        return (
                          <ApprovalCard
                            id={id}
                            title={approval.title}
                            approval_type={approval.approval_type}
                            approved={!!details?.[approval.keyName]}
                            approval_key={approval.keyName}
                            keyName={approval.keyName}
                            permissions={permissions}
                            requiredRoles={approval.requiredRoles}
                            details={details}
                            modifiedDetails={modifiedDetails}
                            getDetails={getDetails}
                            visible={approval.visible}
                            user={user}
                            saveDetails={saveDetails}
                          />
                        );
                      })}
                    </div>
                    <div>
                      <Divider style={{ margin: "5px 0px" }} orientation="left">
                        Reference Documents
                      </Divider>
                      <DocumentsUpload id={id} details={details} user={user} />
                    </div>
                    <CreateLayout
                      details={details}
                      modifiedDetails={modifiedDetails}
                      // setModifiedDetails={setModifiedDetails}
                      setModifiedDetailsKey={setModifiedDetailsKey}
                      isEditDisabled={isEditDisabled}
                      layoutDetailsInfo={layoutDetailsInfo}
                      layout={finalLayout}
                    />
                  </div>
                  <div style={{ width: "max(500px, 30%)", height: "100%", overflow: "auto" }}>
                    {/* <span style={{fontSize: '20px', fontWeight: 'bold'}}>Comments</span> */}
                    <SoApprovalChatComments id={id} layoutDetailsInfo={layoutDetailsInfo} lastReadTime={previousVisitTime} />
                  </div>
                </div>
              </Spin>
            ),
          },
          {
            key: "compare-with-progen",
            label: "Comapre With Progen",
            children: (
              <CompareWithProgenTab
                id={id}
                details={details}
                layoutDetailsInfo={layoutDetailsInfo}
                progenCompareAllowedKeys={
                  Object.keys(layoutDetailsInfo).filter((key) => {
                    return layoutDetailsInfo[key as keyof I_SalesOrderApproval]?.allowProgenCompare
                    && isColumnVisible(key as keyof I_SalesOrderApproval)
                  }) as (keyof I_SalesOrderApproval)[]
                }
              />
            ),
          },
          {
            key: "quotations",
            label: "Quotations",
            children: <SoApprovalRelatedQuotations id={id} />,
          },
          {
            key: "performa-invoice",
            label: "Performa Invoice",
            children: <SoApprovalRelatedPerformaInvoices id={id} />,
          },
          {
            key: "save-history",
            label: "Save History",
            children: <SalesOrderSaveDiff id={id} layoutDetailsInfo={layoutDetailsInfo} />,
          },
        ]}
      />
    </div>
  );
}

interface I_CreateLayoutProps {
  details: I_SalesOrderApproval;
  modifiedDetails: I_SalesOrderApproval;
  // setModifiedDetails?: React.Dispatch<React.SetStateAction<I_SalesOrderApproval>>;
  setModifiedDetailsKey: <K extends keyof I_SalesOrderApproval>(key: K, value: I_SalesOrderApproval[K]) => void;
  isEditDisabled: <K extends keyof I_SalesOrderApproval>(key: K) => boolean;
  layoutDetailsInfo?: { [key: string]: I_ColumnInfo };
  layout?: { title?: string; children?: string[][] }[];
}
function CreateLayout({
  details,
  modifiedDetails,
  // setModifiedDetails,
  setModifiedDetailsKey,
  isEditDisabled,
  layoutDetailsInfo,
  layout,
}: I_CreateLayoutProps) {
  return (
    <div className="my-form-flex column" style={{ paddingBottom: "150px" }}>
      {layout?.map((row, idx1) => {
        return (
          <>
            <Divider key={idx1} style={{ margin: "0px" }} orientation="left">
              {row?.title}
            </Divider>
            <div className="my-form-flex column">
              {row?.children?.map((cols, idx2) => {
                return (
                  <div className="my-form-flex" style={{ gap: "50px" }} key={idx2}>
                    {cols?.map((col: any, idx: any) => {
                      const colInfo = layoutDetailsInfo?.[col];
                      if (!colInfo) return null;

                      return (
                        <div className="my-form-flex" key={idx}>
                          <CreateComponent
                            key={idx}
                            details={details}
                            modifiedDetails={modifiedDetails}
                            // setModifiedDetails={setModifiedDetails}
                            setModifiedDetailsKey={setModifiedDetailsKey}
                            componentData={colInfo}
                            isEditDisabled={isEditDisabled(col)}
                          />
                          {colInfo?.extraComponent?.()}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </>
        );
      })}
    </div>
  );
}

interface I_CreateComponentProps {
  details?: I_SalesOrderApproval;
  modifiedDetails?: I_SalesOrderApproval;
  // setModifiedDetails?: React.Dispatch<React.SetStateAction<I_SalesOrderApproval>>;
  setModifiedDetailsKey?: <K extends keyof I_SalesOrderApproval>(key: K, value: I_SalesOrderApproval[K]) => void;
  componentData?: I_ColumnInfo;
  isEditDisabled?: boolean;
}
export const CreateComponent = ({
  details,
  modifiedDetails,
  // setModifiedDetails,
  setModifiedDetailsKey,
  componentData,
  isEditDisabled,
}: I_CreateComponentProps) => {
  if (!componentData) return null;

  const modifiedDetailsValue = modifiedDetails?.[componentData?.key as keyof I_SalesOrderApproval];
  const detailsValue = details?.[componentData?.key as keyof I_SalesOrderApproval];
  const value = modifiedDetailsValue || modifiedDetailsValue === "" ? modifiedDetailsValue : detailsValue;
  const displayValue = value;

  const inputWidth = componentData?.width || {
    "-": "300px",
    textarea: "300px",
    input: "300px",
    "input-number": "300px",
    "input-autocomplete": "300px",
    date: "300px",
    component: "300px",
    select: "300px",
    info: "300px",
    none: "0px",
  }[componentData?.type || "-"];

  if (!componentData?.type || componentData?.type === "info") {
    return (
      <InputWithLabel label={componentData?.title || ""} labelWidth={inputWidth}>
        <Input value={displayValue} disabled={true} />
      </InputWithLabel>
    );
  } else if (componentData?.type === "textarea") {
    return (
      <InputWithLabel label={componentData?.title || ""} labelWidth={inputWidth}>
        <Input.TextArea
          value={displayValue}
          autoSize={{ minRows: 2, maxRows: 5 }}
          style={{ width: "400px" }}
          onChange={(e) => {
            setModifiedDetailsKey?.(componentData?.key as keyof I_SalesOrderApproval, e.target.value);
          }}
          disabled={isEditDisabled}
          status={modifiedDetailsValue || modifiedDetailsValue === "" ? "warning" : ""}
        />
      </InputWithLabel>
    );
  } else if (componentData?.type === "input") {
    return (
      <InputWithLabel label={componentData?.title || ""} labelWidth={inputWidth}>
        <Input
          value={displayValue}
          style={{ width: "100%" }}
          onChange={(e) => {
            setModifiedDetailsKey?.(componentData?.key as keyof I_SalesOrderApproval, e.target.value);
          }}
          disabled={isEditDisabled}
          status={
            modifiedDetails?.[componentData?.key as keyof I_SalesOrderApproval] ||
            modifiedDetails?.[componentData?.key as keyof I_SalesOrderApproval] === ""
              ? "warning"
              : ""
          }
        />
      </InputWithLabel>
    );
  } else if (componentData?.type === "input-autocomplete") {
    return (
      <InputWithLabel label={componentData?.title || ""} labelWidth={inputWidth}>
        <AutoComplete
          value={displayValue}
          style={{ width: "100%" }}
          onChange={(e: any) => {
            setModifiedDetailsKey?.(componentData?.key as keyof I_SalesOrderApproval, e);
          }}
          disabled={isEditDisabled}
          status={
            modifiedDetails?.[componentData?.key as keyof I_SalesOrderApproval] ||
            modifiedDetails?.[componentData?.key as keyof I_SalesOrderApproval] === ""
              ? "warning"
              : ""
          }
          options={componentData?.options || []}
            filterOption={(inputValue, option) => option!.value?.toString().toUpperCase().indexOf(inputValue.toString().toUpperCase()) !== -1}
        />
      </InputWithLabel>
    );
  } else if (componentData?.type === "input-number") {
    return (
      <InputWithLabel label={componentData?.title || ""} labelWidth={inputWidth}>
        <InputNumber
          value={displayValue}
          style={{ width: "100%" }}
          min={0}
          onChange={(e: any) => {
            setModifiedDetailsKey?.(componentData?.key as keyof I_SalesOrderApproval, e);
          }}
          disabled={isEditDisabled}
          status={
            modifiedDetails?.[componentData?.key as keyof I_SalesOrderApproval] ||
            modifiedDetails?.[componentData?.key as keyof I_SalesOrderApproval] === ""
              ? "warning"
              : ""
          }
        />
      </InputWithLabel>
    );
  } else if (componentData?.type === "date") {
    return (
      <InputWithLabel label={componentData?.title || ""} labelWidth={inputWidth}>
        <DatePicker
          value={dayjs(displayValue, "YYYY-MM-DD").isValid() ? dayjs(displayValue, "YYYY-MM-DD") : undefined}
          style={{ width: "100%" }}
          onChange={(e) => {
            setModifiedDetailsKey?.(componentData?.key as keyof I_SalesOrderApproval, e?.format("YYYY-MM-DD"));
          }}
          disabled={isEditDisabled}
          status={
            modifiedDetails?.[componentData?.key as keyof I_SalesOrderApproval] ||
            modifiedDetails?.[componentData?.key as keyof I_SalesOrderApproval] === ""
              ? "warning"
              : ""
          }
        />
        {/* {displayValue} */}
      </InputWithLabel>
    );
  } else if (componentData?.type === "select") {
    return (
      <InputWithLabel label={componentData?.title || ""} labelWidth={inputWidth}>
        <Select
          style={{ width: "100%" }}
          value={displayValue}
          options={componentData?.options}
          onChange={(value) => {
            setModifiedDetailsKey?.(componentData?.key as keyof I_SalesOrderApproval, value);
          }}
          showSearch={true}
          disabled={isEditDisabled}
          status={
            modifiedDetails?.[componentData?.key as keyof I_SalesOrderApproval] ||
            modifiedDetails?.[componentData?.key as keyof I_SalesOrderApproval] === ""
              ? "warning"
              : ""
          }
        />
      </InputWithLabel>
    );
  } else if (componentData?.type === "component") {
    return componentData?.component;
  } else if (componentData?.type === "none") {
    return null;
  }

  return null;
};

export default function EditSalesOrderApprovalWrapper({
  permissions = {},
  user,
}: {
  permissions?: I_SOApprovalPermissions;
  user?: I_AuthUser;
}) {
  const { id } = useParams<{ id?: string }>();
  // console.log("id", id);
  return <EditSalesOrderApproval id={parseInt(id || "0")} permissions={permissions} user={user} />;
}

export const saveTheCurrentTimeForSOApprovalInLocalStorage = (id: number) => {
  let prev_details: any = {};
  if (localStorage.getItem("so_approval_details_last_visited")) {
    prev_details = JSON.parse(localStorage.getItem("so_approval_details_last_visited") || "{}");
  }
  prev_details[id] = {
    last_visited: dayjs().format(),
  };
  localStorage.setItem("so_approval_details_last_visited", JSON.stringify(prev_details));
};

export const getLastVisitedTimeForSOApprovalFromLocalStorage = (id: number) => {
  let prev_details: any = {};
  if (localStorage.getItem("so_approval_details_last_visited")) {
    prev_details = JSON.parse(localStorage.getItem("so_approval_details_last_visited") || "{}");
  }
  return prev_details[id]?.last_visited;
};
