import { Button, Dropdown, Modal, Popconfirm, Select, Switch, Table } from "antd";
import {
  CreateComponent,
  I_LayoutDetailsInfo,
  I_SalesOrderApproval,
  I_SalesOrderApprovalKeys,
} from "./EditSalesOrderApproval";
import { FaTools } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import {
  I_ArtworkTokens,
  I_PackTokens,
  I_PoStatusTokens,
  decodeTokensFromString,
} from "../MachineWisePlanning/MachineWisePlanning";
import InputWithLabel from "../../Components/InputWithLabel";
import { I_SOApprovalPermissions } from "../../RoleInterfaces";

export interface I_ApprovalToolsProps {
  id?: number;
  details?: I_SalesOrderApproval;
  modifiedDetails?: I_SalesOrderApproval;
  setModifiedDetails?: React.Dispatch<React.SetStateAction<I_SalesOrderApproval>>;
  permissions?: I_SOApprovalPermissions;
  previousCopyAllowedKeys?: (keyof I_SalesOrderApproval)[];
  layoutDetailsInfo?: I_LayoutDetailsInfo;
  refetchOptionsFromDB?: boolean;
  setRefetchOptionsFromDB?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ApprovalTools: React.FC<I_ApprovalToolsProps> = ({
  id,
  details,
  modifiedDetails,
  setModifiedDetails,
  permissions,
  previousCopyAllowedKeys,
  layoutDetailsInfo,
  refetchOptionsFromDB,
  setRefetchOptionsFromDB,
}) => {
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "get-previous-details",
            label: (
              <GetPreviousSODetails
                id={id}
                details={details}
                modifiedDetails={modifiedDetails}
                setModifiedDetails={setModifiedDetails}
                previousCopyAllowedKeys={previousCopyAllowedKeys}
                layoutDetailsInfo={layoutDetailsInfo}
                permissions={permissions}
              />
            ),
            hidden: false,
          },
          {
            key: "refresh-options",
            label: (
              <Button
                type="link"
                onClick={() => {
                  setRefetchOptionsFromDB?.(false);
                  setRefetchOptionsFromDB?.(true);
                }}
              >
                Hard Refresh Options
              </Button>
            ),
            hidden: refetchOptionsFromDB,
          },
        ].filter((item) => !item.hidden),
      }}
    >
      <Button type="link">
        <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <FaTools /> Tools <IoIosArrowDown />
        </div>
      </Button>
    </Dropdown>
  );
};

export const GetPreviousSODetails: React.FC<I_ApprovalToolsProps> = ({
  // id,
  details,
  modifiedDetails,
  setModifiedDetails,
  previousCopyAllowedKeys,
  layoutDetailsInfo,
  permissions,
}) => {
  const curretDetails = useMemo(() => {
    return { ...details, ...modifiedDetails };
  }, [details, modifiedDetails]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({
    product_name: "" as string,
    keys: previousCopyAllowedKeys as I_SalesOrderApprovalKeys[],
  });
  const setSelectedKey = (key: keyof typeof selected, value: any) => {
    setSelected((prev) => ({ ...prev, [key]: value }));
  };

  const [options, setOptions] = useState({
    product_name: [],
    prev_so_data: {} as I_SalesOrderApproval,
  });
  const setOptionsKey = (key: keyof typeof options, value: any) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const [loading, setLoading] = useState({
    product_name: true,
    prev_so_data: false,
  });
  const setLoadingKey = (key: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  const handleGetAllProductOptions = async () => {
    setLoadingKey("product_name", true);
    await axios
      .get("/get-all-product-options")
      .then((res) => {
        const data = res.data.data;
        setOptionsKey("product_name", data);
        const defaultProductName = modifiedDetails?.product_name || details?.product_name || "";
        setSelectedKey("product_name", defaultProductName);
      })
      .catch((err) => {
        setOptionsKey("product_name", [
          // { value: "Product Name Options Error", label: "Product Name Options Error" },
          // { value: "Product Name Options Error2", label: "Product Name Options Error2" },
        ]);
        err.handleGlobally?.("Product Name Options");
      });
    setLoadingKey("product_name", false);
  };

  useEffect(() => {
    if (open && options.product_name.length === 0) {
      handleGetAllProductOptions();
    }
  }, [open]);

  const getPreviousSODetailsForProduct = async (product_name: string, item_code: string) => {
    if (!product_name?.length) return;
    setLoadingKey("prev_so_data", true);
    // setSelectedKey("keys", []);
    setOptionsKey("prev_so_data", {});
    await axios
      .get("/get-previous-so-details-for-product", {
        params: {
          // TODO: Change this to id
          // product_name: "CLINOX-150",
          product_name: product_name,
          item_code: item_code,
        },
      })
      .then((res) => {
        const data = res.data.data;

        const pack_tokens: I_PackTokens = decodeTokensFromString(data.pack);
        const po_status_tokens: I_PoStatusTokens = decodeTokensFromString(data.postatus);
        const artwork_code_tokens: I_ArtworkTokens = decodeTokensFromString(data.artworkcode);
        // const mrp_tokens: I_MrpTokens = decodeTokensFromString(data.mrp);

        console.log("pack_tokens", Object.keys(pack_tokens));
        // console.log('po_status_tokens', po_status_tokens);
        // console.log('artwork_code_tokens', (artwork_code_tokens));
        setOptions((prev) => ({
          ...prev,
          prev_so_data: {
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
        setOptionsKey("prev_so_data", {});
        err.handleGlobally?.("Previous SO Details");
      });
    setLoadingKey("prev_so_data", false);
  };

  useEffect(() => {
    if (selected.product_name?.length) {
      getPreviousSODetailsForProduct(
        selected.product_name,
        (options?.product_name as { value: string; item_code: string }[])?.find((item) => item?.value === selected?.product_name)
          ?.item_code || ""
      );
    } else {
      setOptionsKey("prev_so_data", {});
    }
  }, [selected.product_name]);
  // console.log('previousCopyAllowedKeys 2', modifiedDetails);

  const handleOk = () => {
    setModifiedDetails?.((prev: any) => {
      const newModifiedDetails = { ...prev };
      selected.keys.forEach((key) => {
        newModifiedDetails[key] = options.prev_so_data[key] || "";
      });
      return newModifiedDetails;
    });
    toast.success("Ok");
    setOpen(false);
  };

  return (
    <>
      <Button type="text" onClick={() => setOpen(true)} disabled={false}>
        Get Product Details from Previous Sales Order
      </Button>
      <Modal
        title="Get Product Details from Previous Sales Order"
        open={open}
        onCancel={() => setOpen(false)}
        style={{ minWidth: "min(95%, 750px)", top: "30px" }}
        footer={[
          <Button key="back" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Popconfirm
            key="confirm"
            title="Are you sure? This will overwrite the current values for the selected fields."
            onConfirm={handleOk}
            okText="Yes"
            cancelText="No"
            disabled={selected.keys.length === 0 || loading.prev_so_data || loading.product_name}
          >
            <Button key="submit" type="primary">
              Ok
            </Button>
          </Popconfirm>,
        ]}
      >
        <div className="my-form-flex" style={{ gap: "10px", marginBottom: "10px" }}>
          <Select
            loading={loading.product_name}
            value={selected.product_name}
            onChange={(value) => setSelectedKey("product_name", value)}
            style={{ width: "100%" }}
            options={options.product_name}
            showSearch={true}
            disabled={loading.product_name || loading.prev_so_data}
          />
          {/* <Button type="default" onClick={() => {}}>
            Get Details
          </Button> */}
        </div>
        <Table
          loading={loading.prev_so_data}
          columns={[
            {
              title: "Field",
              key: "field",
              dataIndex: "field",
            },
            {
              title: "Current Value",
              key: "current_value",
              dataIndex: "current_value",
              onCell: () => {
                return {
                  style: { color: "red", textDecoration: "line-through", fontWeight: "bold" },
                };
              },
            },
            {
              title: "New Value",
              key: "new_value",
              dataIndex: "new_value",
              onCell: () => {
                return {
                  style: { color: "green", fontWeight: "bold" },
                };
              },
            },
          ]}
          dataSource={previousCopyAllowedKeys?.map((key) => {
            return {
              key,
              field: layoutDetailsInfo?.[key]?.title || key,
              current_value: curretDetails?.[key],
              new_value: options.prev_so_data?.[key],
            };
          })}
          size="small"
          pagination={false}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selected.keys,
            onChange: (keys) => {
              setSelectedKey("keys", keys);
            },
          }}
          rowKey={(record) => record.key}
          scroll={{ y: "calc(100vh - 250px)" }}
        />
      </Modal>
    </>
  );
};

interface I_AddedToProgenStatusProps {
  details?: I_SalesOrderApproval;
  modifiedDetails?: I_SalesOrderApproval;
  setModifiedDetailsKey?: <K extends keyof I_SalesOrderApproval>(key: K, value: I_SalesOrderApproval[K]) => void;
  saveDetails?: (details: I_SalesOrderApproval) => void;
}
export const AddedToProgenStatus: React.FC<I_AddedToProgenStatusProps> = ({
  details,
  modifiedDetails,
  setModifiedDetailsKey,
  saveDetails,
}) => {
  const [open, setOpen] = useState(false);

  const onOk = () => {
    saveDetails?.({ ...modifiedDetails, current_status: "ADDED-TO-PROGEN" });
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        {/* <Tag color="blue"> */}
        Added to Progen
        {/* </Tag> */}
      </Button>
      <Modal
        open={open}
        title="Change Status to 'Added to Progen'"
        onCancel={() => setOpen(false)}
        style={{ minWidth: "min(95%, 750px)" }}
        footer={[
          <Button key="back" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={onOk}>
            Change Status And Save
          </Button>,
        ]}
      >
        <div className="my-form-flex" style={{ gap: "10px", marginBottom: "10px" }}>
          <CreateComponent
            componentData={{
              title: "So Number",
              key: "sono",
              type: "input",
            }}
            isEditDisabled={false}
            details={details}
            modifiedDetails={modifiedDetails}
            setModifiedDetailsKey={setModifiedDetailsKey}
          />
          <CreateComponent
            componentData={{
              title: "SO Date",
              key: "so_date",
              type: "date",
            }}
            isEditDisabled={false}
            details={details}
            modifiedDetails={modifiedDetails}
            setModifiedDetailsKey={setModifiedDetailsKey}
          />
        </div>
      </Modal>
    </>
  );
};

interface I_RequestChangesProps {
  details?: I_SalesOrderApproval;
  modifiedDetails?: I_SalesOrderApproval;
  setModifiedDetailsKey?: <K extends keyof I_SalesOrderApproval>(key: K, value: I_SalesOrderApproval[K]) => void;
  saveDetails?: (details: I_SalesOrderApproval) => void;
}
export const RequestChanges: React.FC<I_RequestChangesProps> = ({
  details,
  modifiedDetails,
  setModifiedDetailsKey,
  saveDetails,
}) => {
  const onOk = () => {
    saveDetails?.({ ...modifiedDetails, current_status: "REQUEST-CHANGES", plant_email_sent: 0 });
  };

  return (
    <>
      <Popconfirm
        title="Are you sure you want to change the status to 'Request Changes'?"
        onConfirm={onOk}
        okText="Yes"
        cancelText="No"
      >
        <Button type="primary">Request Changes</Button>
      </Popconfirm>
    </>
  );
};

interface I_CancelStatusProps {
  details?: I_SalesOrderApproval;
  modifiedDetails?: I_SalesOrderApproval;
  setModifiedDetailsKey?: <K extends keyof I_SalesOrderApproval>(key: K, value: I_SalesOrderApproval[K]) => void;
  saveDetails?: (details: I_SalesOrderApproval) => void;
}
export const CancelForm: React.FC<I_CancelStatusProps> = ({
  details,
  modifiedDetails,
  setModifiedDetailsKey,
  saveDetails,
}) => {
  const onOk = () => {
    saveDetails?.({ ...modifiedDetails, current_status: "CANCEL" });
  };

  return (
    <>
      <Popconfirm
        title="Are you sure you want to 'CANCEL' this form ? You will have to inform manually for any changes to progen."
        onConfirm={onOk}
        okText="Yes"
        cancelText="No"
      >
        <Button type="dashed" danger>CANCEl FORM</Button>
      </Popconfirm>
    </>
  );
};


interface I_MailSentProps {
  details?: I_SalesOrderApproval;
  modifiedDetails?: I_SalesOrderApproval;
  setModifiedDetailsKey?: <K extends keyof I_SalesOrderApproval>(key: K, value: I_SalesOrderApproval[K]) => void;
  saveDetails?: (details: I_SalesOrderApproval) => void;
}
export const MailSentButton: React.FC<I_MailSentProps> = ({
  details,
  modifiedDetails,
  setModifiedDetailsKey,
  saveDetails,
}) => {
  const onOk = () => {
    const plant_email_sent = details?.plant_email_sent === 1 ? 0 : 1;
    saveDetails?.({ ...modifiedDetails, plant_email_sent: plant_email_sent });
  };

  const isEnabled = useMemo(() => {
    return details?.current_status === "ADDED-TO-PROGEN" || details?.current_status === "REQUEST-CHANGES";
  }, [details?.current_status]);

  // console.log('isEnabled', isEnabled);
  return (
    <>
        {/* <Button type="dashed" danger>Email Sent</Button> */}
        <InputWithLabel label="Email Sent" isInline={true} divStyle={{marginLeft: '10px'}}>
          <Popconfirm
            title={details?.plant_email_sent === 1 ? "Are you sure you want to mark the email as not sent?" : "Are you sure you want to mark the email as sent?"}
            onConfirm={onOk}
            okText="Yes"
            cancelText="No"
            disabled={!isEnabled}
          >
              <Switch checked={details?.plant_email_sent === 1} disabled={!isEnabled} />
          </Popconfirm>
        </InputWithLabel>
    </>
  );
};
