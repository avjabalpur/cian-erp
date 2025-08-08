import { useEffect, useMemo, useState } from "react";
import { I_LayoutDetailsInfo, I_SalesOrderApproval } from "./EditSalesOrderApproval";
import {
  I_ArtworkTokens,
  I_MrpTokens,
  I_PackTokens,
  I_PoStatusTokens,
  decodeTokensFromString,
} from "../MachineWisePlanning/MachineWisePlanning";
import axios from "axios";
import { Alert, Table } from "antd";
import { I_SOApprovalPermissions } from "../../RoleInterfaces";

export interface I_CompareWithProgenTabProps {
  id: number;
  details: I_SalesOrderApproval;
  permissions?: I_SOApprovalPermissions;
  layoutDetailsInfo?: I_LayoutDetailsInfo;
  progenCompareAllowedKeys: (keyof I_SalesOrderApproval)[];
}

export const CompareWithProgenTab: React.FC<I_CompareWithProgenTabProps> = ({
  details,
  permissions,
  layoutDetailsInfo,
  progenCompareAllowedKeys,
}) => {
  const curretDetails = useMemo(() => {
    return { ...details };
    // return { ...details, ...modifiedDetails };
    // }, [details, modifiedDetails]);
  }, [details]);

  const [options, setOptions] = useState({
    progen_so_details: {} as I_SalesOrderApproval,
  });
  const setOptionsKey = (key: keyof typeof options, value: any) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };
  const [loading, setLoading] = useState({
    progen_so_details: true,
  });
  const setLoadingKey = (key: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  const getSoDetailsFromProgen = async () => {
    setLoadingKey("progen_so_details", true);
    // setSelectedKey("keys", []);
    setOptionsKey("progen_so_details", {});
    await axios
      .get("/get-so-details-for-soid", {
        params: {
          soid: details.sono,
        },
      })
      .then((res) => {
        const data = res.data.data;

        const pack_tokens: I_PackTokens = decodeTokensFromString(data.pack);
        const po_status_tokens: I_PoStatusTokens = decodeTokensFromString(data.postatus);
        const artwork_code_tokens: I_ArtworkTokens = decodeTokensFromString(data.artworkcode);
        // const mrp_tokens: I_MrpTokens = decodeTokensFromString(data.mrp);

        // console.log("pack_tokens", Object.keys(pack_tokens));
        // console.log('po_status_tokens', po_status_tokens);
        // console.log('artwork_code_tokens', (artwork_code_tokens));
        setOptions((prev) => ({
          ...prev,
          progen_so_details: {
            manufacturer_name: data.loccd === "DRK" ? "DR. SMITH" : "CIAN HEALTHCARE",
            customer_name: data.custname,
            payment_term: data.paytermcd,
            hsn_code: data.hsn_code,
            product_cast: pack_tokens?.PCAST?.value,
            product_name: data.itemname,
            product_code: data.itemcd,
            division: data.division,
            design_under: data.division,
            composition: data.composition,
            p_colour: pack_tokens?.COLOR?.value,
            p_shelf_life: data.shelflife,
            p_pack_short: pack_tokens?.PSHORT?.value,
            packing_style_description: pack_tokens?.PSTYLE?.value,
            p_tablet_type: pack_tokens?.FORM?.value,
            p_tablet_size: pack_tokens?.SIZE?.value,
            p_change_part: pack_tokens?.CPART?.value,
            p_capsule_size: pack_tokens?.SIZE?.value,
            p_shipper_size: pack_tokens?.SHIPPER?.value,
            p_qty_per_shipper: pack_tokens?.SHIPPERQTY?.value,
            // p_no_of_shipper: ,
            p_flavour: pack_tokens?.FLAVOUR?.value,
            p_quantity: data.poqty,
            // p_mrp: data.mrp,
            p_mrp: parseFloat(data?.mrp || "0"),
            p_billing_rate: data.rate,
            p_costing: parseInt(artwork_code_tokens?.cost?.value || "0"),
            p_inventory_charges: po_status_tokens?.INVCHRG?.value,
            p_cylinder_charge: po_status_tokens?.CYLCHRG?.value,
            p_domino: po_status_tokens?.domino?.value?.length ? "DOMINO" : "STEREO",
            p_shipper_drawing_ref_code: artwork_code_tokens?.shprcd?.value,
            ctn_outer_drawing_ref_no: artwork_code_tokens?.outctncd?.value,
            ctn_inner_drawing_ref_no: artwork_code_tokens?.inctncd?.value,
            foil_drawing_ref_no: artwork_code_tokens?.foilcode?.value,
            leaflet_drawing_ref_no: artwork_code_tokens?.leafletcd?.value,
            label_drawing_ref_no: artwork_code_tokens?.lblcode?.value,
            tube_drawing_ref_no: artwork_code_tokens?.tubecd?.value,
            pm_outer_ctn_stock: data.pm_outer_ctn_stock,
            pm_inner_ctn_stock: data.pm_inner_ctn_stock,
            pm_foil_stock: data.pm_foil_stock,
            pm_leaflet_stock: data.pm_leaflet_stock,
            pm_tube_stock: data.pm_tube_stock,
            pm_label_stock: data.pm_label_stock,
            drug_approval_under: data.loccd === "DRK" ? "DR. SMITH" : "CIAN HEALTHCARE",
          },
        }));
      })
      .catch((err) => {
        setOptionsKey("progen_so_details", {});
        err.handleGlobally?.("Previous SO Details");
      });
    setLoadingKey("progen_so_details", false);
  };

  useEffect(() => {
    if (!details.sono) return;
    getSoDetailsFromProgen();
  }, [details.sono]);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", paddingBottom: "50px" }}>
      {details?.sono !== undefined && !details?.sono?.length ? (
        // <div style={{ color: "red", fontSize: "24px", fontWeight: "bold" }}>SO ID is required to compare with Progen</div>
        <Alert
          message="Invalid Progen Id"
          description="Wither the data is not added in Progen or the SO ID is invalid. Please check and try again."
          type="error"
          showIcon
          style={{ width: "900px" }}
        />
      ) : (
        <Table
            loading={loading.progen_so_details}
            columns={[
              {
                title: "Field",
                key: "field",
                dataIndex: "field",
                width: "200px",
              },
              {
                title: "Current Value",
                key: "current_value",
                dataIndex: "current_value",
                // onCell: () => {
                //   return {
                //     style: { color: "red", textDecoration: "line-through", fontWeight: "bold" },
                //   };
                // },
                width: "200px",
              },
              {
                width: "200px",
                title: "Progen Value",
                key: "progen_value",
                dataIndex: "progen_value",
                // onCell: () => {
                //   return {
                //     style: { color: "green", fontWeight: "bold" },
                //   };
                // },
              },
            ]}
            dataSource={progenCompareAllowedKeys?.map((key) => {
              let currentValue = curretDetails?.[key];
              if (key === "p_quantity") {
                currentValue = (parseInt(`${curretDetails?.p_quantity}`) || 0) + (parseInt(`${curretDetails?.p_foc_qty}`) || 0);
              }
              return {
                key,
                field: layoutDetailsInfo?.[key]?.title || key,
                current_value: currentValue,
                progen_value: options.progen_so_details?.[key],
              };
            })}
          size="small"
            pagination={false}
            rowKey={(record) => record.key}
            bordered
            style={{ width: "900px" }}
            onRow={(record) => {
              let isDiff = false;
              const curr_val = record?.current_value?.toString()?.trim();
              const progen_val = record?.progen_value?.toString()?.trim();
              if (curr_val !== progen_val) {
                isDiff = true;
              }
              if (!curr_val?.length && !progen_val?.length) {
                isDiff = false;
              }
              return {
                style: {
                  background: isDiff ? "#F1B9B8" : "",
                },
              };
            }}
            // scroll={{ y: "calc(100vh - 250px)" }}
          />
      )}
    </div>
  );
};
