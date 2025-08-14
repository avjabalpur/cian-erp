import { useEffect, useMemo, useState } from "react";
import { I_SalesOrderApproval } from "./EditSalesOrderApproval";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Margin, usePDF } from "react-to-pdf";
import axios from "axios";
import { Button, Dropdown, Input, InputNumber, Select, Spin, Table } from "antd";
import { IoIosArrowDown } from "react-icons/io";
import MyPortal from "../../Components/MyPortal";
import InputWithLabel from "../../Components/InputWithLabel";
import dayjs from "dayjs";
import toWords from "number-to-words";

interface I_CreatePerformaInvoicePermissions {
  edit?: boolean;
}

interface I_CreatePerformaInvoiceProps {
  permissions?: I_CreatePerformaInvoicePermissions;
  id?: number;
  username?: string;
}

interface I_ProductData extends I_SalesOrderApproval {
  sales_order_approval_id: number;
}
interface I_PerformaInvoiceDetails {
  exporter_name: keyof typeof PICompanyDetails;
  manufacturer_name: keyof typeof PICompanyDetails;

  consignee_name: string;
  consignee_contact_details: string;
  consignee_address: string;

  performa_invoice_number: string;
  performa_invoice_date: string;
  exporters_reference_number: string;
  other_references: string;
  other_buyer_name: string;
  country_of_origin: string;
  country_of_final_destination: string;

  prepration: string;
  port_of_discharge: string;
  place_of_receipt_by_pre_carrier: string;
  final_destination: string;

  terms_of_delivery: string;
  payment_terms: string;

  shipment_mode: string;
  port_of_loading: string;
}

interface I_ComputedTotals {
  product_calculations: { total: number }[];

  final_total: number;
}

interface I_AdditionalCharges {
  id: number;
  name: string;
  amount: number;
}

const DEFAULT_INVOICE_NUMBER = "*********";

export default function CreatePerformaInvoice({ permissions = { edit: true }, id, username = "" }: I_CreatePerformaInvoiceProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState<I_ProductData[]>([]);
  const [additionalCharges, setAdditionalCharges] = useState<I_AdditionalCharges[]>([
    { name: "Extra Charges", amount: 0, id: 1 },
  ]);
  // const generateRandomPerformaInvoiceNumber = () => {
  //   return `PIV-${dayjs().format("YY")}${Math.floor(Math.random() * 100)}-${Math.floor(Math.random() * 10000)}`;
  // };

  const [details, setDetails] = useState<I_PerformaInvoiceDetails>({
    exporter_name: "CIAN",
    manufacturer_name: "CIAN",

    consignee_name: "Customer Name",
    consignee_contact_details: "Contact Person - Contact Number - Email",
    consignee_address: "Customer Address",

    performa_invoice_number: DEFAULT_INVOICE_NUMBER,
    performa_invoice_date: dayjs().format("YYYY-MM-DD"),
    exporters_reference_number: "-",
    other_references: "-",
    other_buyer_name: "-",
    country_of_origin: "INDIA",
    country_of_final_destination: "-",

    prepration: "-",
    port_of_discharge: "-",
    place_of_receipt_by_pre_carrier: "-",
    final_destination: "-",

    terms_of_delivery: "-",
    payment_terms: "-",

    shipment_mode: "-",
    port_of_loading: "-",
  });
  const setDetailsFromKey = (key: keyof I_PerformaInvoiceDetails, value: any) => {
    if (!permissions?.edit) {
      toast.info("Edit Permission Required");
      return;
    }
    setDetails((prev) => ({ ...prev, [key]: value }));
  };
  const [loading, setLoading] = useState(false);
  const { toPDF, targetRef } = usePDF({
    filename: `PerformaInvoice-${details.performa_invoice_number}.pdf`,
    page: { orientation: "landscape", margin: Margin.SMALL },
    // overrides: { pdf: { compress: true } },
  });

  const exporterDetails = useMemo(() => PICompanyDetails[details.exporter_name], [details.exporter_name]);
  const manufacturerDetails = useMemo(() => PICompanyDetails[details.manufacturer_name], [details.manufacturer_name]);

  const exporterOptions = Object.keys(PICompanyDetails).map((key) => ({ value: key, label: key }));
  const manufacturerOptions = Object.keys(PICompanyDetails).map((key) => ({ value: key, label: key }));

  // const setProductDataFromId = async (id: number, key: keyof I_ProductData, value: any) => {
  //   if (!permissions?.edit) {
  //     toast.info("Edit Permission Required");
  //     return;
  //   }
  //   setProductData((prev) => {
  //     const data: I_ProductData[] = [...prev];
  //     const index = data.findIndex((item) => item.id === id);
  //     data[index][key] = value as never; // Fix: Typecast value as 'never'
  //     return data;
  //   });
  // };

  const getCustomerDetails = async (consignee_name: string) => {
    if (!permissions?.edit) {
      toast.info("Edit Permission Required");
      return;
    }
    await axios
      .get("/get-customer-details", {
        params: {
          customer_name: consignee_name,
        },
      })
      .then((res) => {
        const data: any = res.data.data;
        setDetails((prev) => ({
          ...prev,
          consignee_name: consignee_name,
          consignee_contact_details: `${data.contact_person} - ${data.contact_number} - ${data.email}`,
          consignee_address: data.address,
          payment_terms: productData[0]?.payment_term || "",
        }));
      })
      .catch((error) => {
        error.handleGlobally("Customer Details");
      });
  };

  useEffect(() => {
    if (productData.length === 1 && permissions?.edit) {
      getCustomerDetails(productData[0]?.customer_name || "");
    }
  }, [productData, permissions?.edit]);

  const getPerformaInvoiceDetails = async (performa_invoice_id: number) => {
    setLoading(true);
    await axios
      .get("/get-sales-order-approval-performa-invoice-by-id", {
        params: {
          performa_invoice_id: performa_invoice_id,
        },
      })
      .then((res) => {
        const data: any = res.data.data;
        setDetails((prev) => ({
          ...prev,
          exporter_name: data.exporter_name,
          manufacturer_name: data.manufacturer_name,
          consignee_name: data.consignee_name,
          consignee_contact_details: data.consignee_contact_details,
          consignee_address: data.consignee_address,
          performa_invoice_number: data.performa_invoice_number,
          performa_invoice_date: data.performa_invoice_date,
          exporters_reference_number: data.exporters_reference_number,
          other_references: data.other_references,
          other_buyer_name: data.other_buyer_name,
          country_of_origin: data.country_of_origin,
          country_of_final_destination: data.country_of_final_destination,
          prepration: data.prepration,
          port_of_discharge: data.port_of_discharge,
          place_of_receipt_by_pre_carrier: data.place_of_receipt_by_pre_carrier,
          final_destination: data.final_destination,
          terms_of_delivery: data.terms_of_delivery,
          payment_terms: data.payment_terms,
          shipment_mode: data.shipment_mode,
          port_of_loading: data.port_of_loading,
        }));
        setProductData(data.products);
        setAdditionalCharges(data.additionalCharges);
      })
      .catch((error) => {
        error.handleGlobally("Performa Invoice Details");
        navigate("/sales-order-approval/performa-invoices");
      });
    setLoading(false);
  };
  useEffect(() => {
    if (id) {
      getPerformaInvoiceDetails(id);
    }
  }, [id]);

  useEffect(() => {
    if (searchParams.get("print") === "true" && details.performa_invoice_number !== DEFAULT_INVOICE_NUMBER) {
      toPDF();
      searchParams.delete("print");
      setSearchParams(searchParams);
    }
  }, [details.performa_invoice_number, searchParams, setSearchParams, toPDF]);

  const getPerformaInvoiceDetailsToCreateNew = async (performa_invoice_id: number) => {
    setLoading(true);
    await axios
      .get("/get-sales-order-approval-performa-invoice-by-id", {
        params: {
          performa_invoice_id: performa_invoice_id,
        },
      })
      .then(async (res) => {
        const data: any = res.data.data;
        setDetails((prev) => ({
          ...prev,
          exporter_name: data.exporter_name,
          manufacturer_name: data.manufacturer_name,
          consignee_name: data.consignee_name,
          consignee_contact_details: data.consignee_contact_details,
          consignee_address: data.consignee_address,
          // Optionally generate a new invoice number and date
          performa_invoice_number: DEFAULT_INVOICE_NUMBER,
          performa_invoice_date: dayjs().format("YYYY-MM-DD"),
          exporters_reference_number: data.exporters_reference_number,
          other_references: data.other_references,
          other_buyer_name: data.other_buyer_name,
          country_of_origin: data.country_of_origin,
          country_of_final_destination: data.country_of_final_destination,
          prepration: data.prepration,
          port_of_discharge: data.port_of_discharge,
          place_of_receipt_by_pre_carrier: data.place_of_receipt_by_pre_carrier,
          final_destination: data.final_destination,
          terms_of_delivery: data.terms_of_delivery,
          payment_terms: data.payment_terms,
          shipment_mode: data.shipment_mode,
          port_of_loading: data.port_of_loading,
        }));
        setAdditionalCharges(data.additionalCharges);
        const products = data.products;
        let productData: I_ProductData[] = [];
        const promises: Promise<any>[] = [];
        products.forEach((product: I_ProductData) => {
          promises.push(
            axios
              .get("/get-sales-order-approval-by-id", {
                params: {
                  id: product.sales_order_approval_id,
                },
              })
              .then((res) => {
                const data: I_ProductData = res.data.data;
                return {
                  ...data,
                  p_pack_short: (data?.p_pack_short || "") + " " + (data?.packing_style_description || ""),
                  sales_order_approval_id: product.sales_order_approval_id,
                };
              })
              .catch((error) => {
                error.handleGlobally("Product Data");
                return {};
              })
          );
        });
        productData = await Promise.all(promises);
        setProductData(productData);
      })
      .catch((error) => {
        error.handleGlobally("Copy Performa Invoice");
      });
    setLoading(false);
  };

  useEffect(() => {
    if (searchParams.get("copy_from_id")) {
      getPerformaInvoiceDetailsToCreateNew(parseInt(searchParams.get("copy_from_id") || "0"));
    }
  }, [searchParams.get("copy_from_id")]);

  const ComputeTotals: I_ComputedTotals = useMemo(() => {
    let final_total = 0;
    const product_calculations: I_ComputedTotals["product_calculations"][0][] = [];

    productData.forEach((product) => {
      const amount = (product.p_billing_rate || 0) * (product.p_quantity || 0);
      final_total += amount;
      product_calculations.push({ total: amount });
    });

    additionalCharges.forEach((charge) => {
      final_total += charge.amount;
    });

    return {
      product_calculations: product_calculations,
      final_total: final_total,
    };
  }, [productData, additionalCharges]);

  const columns = [
    {
      title: "",
      key: "action",
      // dataIndex: "action",
      width: "10px",
      render: (_: any, record: any) => (
        <Dropdown
          // trigger={["click"]}
          menu={{
            items: [
              {
                key: "remove",
                label: "Remove",
                danger: true,
                onClick: () => {
                  setProductData(productData.filter((item) => item.sales_order_approval_id !== record.sales_order_approval_id));
                },
                disabled: !permissions?.edit,
              },
              {
                key: "edit",
                label: (
                  <Link to={`/sales-order-approval/edit/${record.sales_order_approval_id}`} target="_blank">
                    Edit
                  </Link>
                ),
              },
            ],
          }}
        >
          <IoIosArrowDown />
        </Dropdown>
      ),
    },
    {
      title: "Id",
      key: "id",
      dataIndex: "sales_order_approval_id",
    },
    {
      title: "Product Name",
      key: "product_name",
      dataIndex: "product_name",
      // width: "210px",
    },
    {
      title: "Composition",
      key: "composition",
      dataIndex: "composition",
      // width: "500px",
    },
    {
      title: "P-Type",
      key: "dosage_name",
      dataIndex: "dosage_name",
      width: "75px",
    },
    {
      title: "P-Cast",
      key: "product_cast",
      dataIndex: "product_cast",
      width: "75px",
    },

    {
      title: "Packing",
      key: "p_pack_short",
      dataIndex: "p_pack_short",
    },
    {
      title: "Quantity",
      key: "p_quantity",
      dataIndex: "p_quantity",
      width: "75px",
    },
    {
      title: "FOC",
      key: "p_foc_qty",
      dataIndex: "p_foc_qty",
      width: "75px",
    },
    {
      title: "Price in USD (CIF)",
      key: "p_billing_rate",
      dataIndex: "p_billing_rate",
      width: "140px",
    },
    {
      title: "Total ($)",
      key: "total",
      dataIndex: "total",
      render: (_: any, _record: any, index: number) => ComputeTotals.product_calculations[index].total,
      width: "90px",
      // onCell: () => {
      //   return {
      //     style: { fontWeight: "bold" },
      //   };
      // },
      // align: "center"
    },
  ];

  const additionalChargesColumns = [
    {
      title: "",
      key: "action",
      // dataIndex: "action",
      width: "10px",
      render: (_: any, record: any) => (
        <Dropdown
          // trigger={["click"]}
          menu={{
            items: [
              {
                key: "remove",
                label: "Remove",
                danger: true,
                onClick: () => {
                  setAdditionalCharges(additionalCharges.filter((item) => item.id !== record.id));
                },
                disabled: !permissions?.edit,
              },
            ],
          }}
        >
          <IoIosArrowDown />
        </Dropdown>
      ),
    },
    {
      title: "Additional Charges",
      key: "name",
      dataIndex: "name",
      render: (_: any, record: any, index: number) => {
        return (
          <Input
            value={record.name}
            onChange={(e) => {
              const data = [...additionalCharges];
              data[index].name = e.target.value;
              setAdditionalCharges(data);
            }}
            disabled={!permissions?.edit}
          />
        );
      },
    },
    {
      title: "",
      key: "amount",
      dataIndex: "amount",
      render: (_: any, record: any, index: number) => {
        return (
          <InputNumber
            value={record.amount}
            onChange={(value) => {
              const data = [...additionalCharges];
              data[index].amount = value || 0;
              setAdditionalCharges(data);
            }}
            disabled={!permissions?.edit}
            style={{ width: "100%" }}
            controls={false}
          />
        );
      },
      width: "90px",
    },
  ];

  const RandomId = () => {
    return Math.floor(Math.random() * 1000000000);
  };

  // New: Function to create the Performa Invoice and print it
  const createPerformaInvoiceAndPrint = async () => {
    if (productData.length === 0) {
      toast.error("Cannot create Performa Invoice without products!");
      return;
    }
    setLoading(true);
    await axios
      .post("/create-performa-invoice", {
        exporter_name: details.exporter_name,
        manufacturer_name: details.manufacturer_name,
        consignee_name: details.consignee_name,
        consignee_contact_details: details.consignee_contact_details,
        consignee_address: details.consignee_address,
        // performa_invoice_number: details.performa_invoice_number,
        performa_invoice_date: details.performa_invoice_date,
        exporters_reference_number: details.exporters_reference_number,
        other_references: details.other_references,
        other_buyer_name: details.other_buyer_name,
        country_of_origin: details.country_of_origin,
        country_of_final_destination: details.country_of_final_destination,
        prepration: details.prepration,
        port_of_discharge: details.port_of_discharge,
        place_of_receipt_by_pre_carrier: details.place_of_receipt_by_pre_carrier,
        final_destination: details.final_destination,
        terms_of_delivery: details.terms_of_delivery,
        payment_terms: details.payment_terms,
        shipment_mode: details.shipment_mode,
        port_of_loading: details.port_of_loading,

        additionalCharges: additionalCharges,
        total_amount: ComputeTotals.final_total,
        previous_performa_invoice_id: parseInt(searchParams.get("copy_from_id") || "0"),

        products: productData.map((item) => ({
          sales_order_approval_id: item.id,
          product_name: item.product_name,
          composition: item.composition || "",
          dosage_name: item.dosage_name,
          product_cast: item.product_cast,
          p_pack_short: item.p_pack_short,
          p_quantity: item.p_quantity,
          p_foc_qty: item.p_foc_qty,
          p_billing_rate: item.p_billing_rate,
        })),
      })
      .then((res) => {
        toast.success("Performa Invoice Created");
        navigate(`/sales-order-approval/performa-invoices/${res.data.performa_invoice_id}?print=true`);
      })
      .catch((error) => {
        error.handleGlobally("Performa Invoice");
      });
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      {permissions?.edit && (
        <MyPortal id="navbar-portal">
          <div className="my-form-flex row" style={{ alignItems: "center" }}>
            <InputWithLabel
              label="Expoter"
              isInline={true}
              labelStyle={{ width: "45px", fontSize: "14px" }}
              divStyle={{ marginRight: "20px" }}
            >
              <Select
                value={details.exporter_name}
                onChange={(value) => {
                  setDetailsFromKey("exporter_name", value);
                }}
                style={{ width: "120px" }}
                options={exporterOptions}
                disabled={!permissions?.edit}
              />
            </InputWithLabel>
            <InputWithLabel
              label="Manufacturer"
              isInline={true}
              labelStyle={{ width: "80px", fontSize: "14px" }}
              divStyle={{ marginRight: "80px" }}
            >
              <Select
                value={details.manufacturer_name}
                onChange={(value) => {
                  setDetailsFromKey("manufacturer_name", value);
                }}
                style={{ width: "120px" }}
                options={manufacturerOptions}
                disabled={!permissions?.edit}
              />
            </InputWithLabel>

            <AddAnotherProduct
              productData={productData}
              addToProductData={(data: any) => setProductData([...productData, data])}
              permissions={permissions}
            />
            <Button
              type="primary"
              onClick={() => {
                setAdditionalCharges([...additionalCharges, { name: "Name", amount: 10, id: RandomId() }]);
              }}
              style={{ marginLeft: "10px" }}
              disabled={!permissions?.edit}
            >
              Add Charges
            </Button>
            {/* New Button to create and print performa invoice */}
            <Button
              type="primary"
              danger
              onClick={createPerformaInvoiceAndPrint}
              style={{ marginLeft: "10px" }}
              disabled={!permissions?.edit}
            >
              Create Performa Invoice and Print
            </Button>
          </div>
        </MyPortal>
      )}
      {!permissions?.edit && (
        <div className="my-form-flex row" style={{ justifyContent: "center", marginBottom: "10px" }}>
          <Button
            type="primary"
            onClick={() => {
              toPDF();
            }}
            style={{ marginBottom: "0px" }}
          >
            Print
          </Button>
        </div>
      )}
      <div ref={targetRef} style={{ border: "3px solid black", padding: "" }}>
        <div className="my-form-flex column">
          <img src={exporterDetails?.cover_image} alt="logo" className="logo" style={{ width: "100%" }} />
        </div>
        <div
          className="my-form-flex column bt bb"
          style={{
            alignItems: "center",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Performa Invoice
        </div>
        <div className="my-form-flex row bb gp0 w100">
          <div className="my-form-flex column br" style={{ width: "65%", alignItems: "flex-start", fontSize: "14px" }}>
            <div className="my-form-flex column pl4 pr4 w100" style={{ gap: "1px", justifyContent: "flex-start" }}>
              <span className="fwb" style={{ fontSize: "16px" }}>
                Exporter
              </span>
              <span>{exporterDetails.name}</span>
              <span>{exporterDetails.address}</span>
              <span>{exporterDetails.phone}</span>
              <span>{exporterDetails.email}</span>
              {/* <span>{exporterDetails.website}</span> */}
            </div>
            <div className="my-form-flex column pl4 pr4 bt w100" style={{ gap: "1px" }}>
              <span className="fwb" style={{ fontSize: "16px" }}>
                Manufacturer
              </span>
              <span>{manufacturerDetails.name}</span>
              <span>{manufacturerDetails.address}</span>
              <span>{manufacturerDetails.phone}</span>
              <span>{manufacturerDetails.email}</span>
              {/* <span>{manufacturerDetails.website}</span> */}
            </div>
            <div className="my-form-flex column pl4 pr4 bt w100" style={{ gap: "1px" }}>
              <span className="fwb" style={{ fontSize: "16px" }}>
                Customer
              </span>
              <Input
                value={details.consignee_name}
                onChange={(e) => setDetailsFromKey("consignee_name", e.target.value)}
                variant="underlined"
                style={{ padding: "0" }}
              />
              <Input.TextArea
                id="consignee_address"
                value={details.consignee_address}
                onChange={(e) => setDetailsFromKey("consignee_address", e.target.value)}
                variant="underlined"
                style={{ padding: "0" }}
                autoSize={{ minRows: 1, maxRows: 5 }}
              />
              <Input
                value={details.consignee_contact_details}
                onChange={(e) => setDetailsFromKey("consignee_contact_details", e.target.value)}
                variant="underlined"
                style={{ padding: "0" }}
              />
            </div>
          </div>
          <div className="my-form-flex column gp0" style={{ fontSize: "16px", width: "35%" }}>
            <div className="my-form-flex row w100 gp0">
              <div className="my-form-flex column w100 gp0 br bb pa3">
                <span className="fwb">Performa Invoice No</span>
                <span>{details.performa_invoice_number}</span>
              </div>
              <div className="my-form-flex column w100 gp0 bb pa3">
                <span className="fwb">Date</span>
                <span>{details.performa_invoice_date}</span>
              </div>
            </div>
            <div className="my-form-flex column w100 gp0 bb pa3">
              <span className="fwb">Exporters Ref</span>
              <span>
                <Input.TextArea
                  id="exporters_reference_number"
                  value={details.exporters_reference_number}
                  onChange={(e) => setDetailsFromKey("exporters_reference_number", e.target.value)}
                  autoSize={{ minRows: 1, maxRows: 5 }}
                />
              </span>
            </div>

            <div className="my-form-flex column w100 gp0 bb pa3 ">
              <span className="fwb">Other Reference (s)</span>
              <span>
                <Input.TextArea
                  id="other_references"
                  value={details.other_references}
                  onChange={(e) => setDetailsFromKey("other_references", e.target.value)}
                  autoSize={{ minRows: 1, maxRows: 5 }}
                />
              </span>
            </div>
            <div className="my-form-flex column w100 gp0 pa3">
              <span className="fwb">Buyer (If other than consignee)</span>
              <span>
                <Input.TextArea
                  id="other_buyer_name"
                  value={details.other_buyer_name}
                  onChange={(e) => setDetailsFromKey("other_buyer_name", e.target.value)}
                  autoSize={{ minRows: 1, maxRows: 5 }}
                />
              </span>
            </div>
          </div>
        </div>
        <div className="my-form-flex row bb gp0 w100">
          <div className="my-form-flex row gp0 " style={{ width: "65%" }}>
            <div className="my-form-flex column gp0 " style={{ width: "45%" }}>
              <div className="my-form-flex column w100 gp0 bb br pa3">
                <span className="fwb">Pre-carriage by</span>
                <span>
                  <Input value={details.prepration} onChange={(e) => setDetailsFromKey("prepration", e.target.value)} />
                </span>
              </div>
              <div className="my-form-flex column w100 gp0 bb br pa3">
                <span className="fwb">Port of Discharge</span>
                <span>
                  <Input
                    value={details.port_of_discharge}
                    onChange={(e) => setDetailsFromKey("port_of_discharge", e.target.value)}
                  />
                </span>
              </div>
            </div>
            <div className="my-form-flex column gp0 br" style={{ width: "55%" }}>
              <div className="my-form-flex column w100 gp0 bb pa3">
                <span className="fwb">Place of Receipt by Pre-Carrier</span>
                <span>
                  <Input
                    // className="tac"
                    value={details.place_of_receipt_by_pre_carrier}
                    onChange={(e) => setDetailsFromKey("place_of_receipt_by_pre_carrier", e.target.value)}
                  />
                </span>
              </div>
              <div className="my-form-flex column w100 gp0 bb pa3">
                <span className="fwb">Final Destination</span>
                <span>
                  <Input
                    // className="tac"
                    value={details.final_destination}
                    onChange={(e) => setDetailsFromKey("final_destination", e.target.value)}
                  />
                </span>
              </div>
            </div>
          </div>

          <div className="my-form-flex column gp0" style={{ width: "35%" }}>
            <div className="my-form-flex row bb">
              <div className="my-form-flex column w100 gp0 pa3 br">
                <span className="fwb">Country-Origin</span>
                <span>
                  <Input
                    value={details.country_of_origin}
                    onChange={(e) => setDetailsFromKey("country_of_origin", e.target.value)}
                  />
                </span>
              </div>
              <div className="my-form-flex column w100 gp0 pa3">
                <span className="fwb">Country-Final Destination</span>
                <span>
                  <Input
                    value={details.country_of_final_destination}
                    onChange={(e) => setDetailsFromKey("country_of_final_destination", e.target.value)}
                  />
                </span>
              </div>
            </div>

            <div className="my-form-flex row bb">
              <div className="my-form-flex column w100 gp0 pa3 br">
                <span className="fwb">Terms of Delivery</span>
                <span>
                  <Input
                    value={details.terms_of_delivery}
                    onChange={(e) => setDetailsFromKey("terms_of_delivery", e.target.value)}
                  />
                </span>
              </div>
              <div className="my-form-flex column w100 gp0 pa3">
                <span className="fwb">Payment Terms</span>
                <span>
                  <Input value={details.payment_terms} onChange={(e) => setDetailsFromKey("payment_terms", e.target.value)} />
                </span>
              </div>
            </div>

            <div className="my-form-flex row">
              <div className="my-form-flex column w100 gp0 pa3 br">
                <span className="fwb">Shipment Mode</span>
                <span>
                  <Input value={details.shipment_mode} onChange={(e) => setDetailsFromKey("shipment_mode", e.target.value)} />
                </span>
              </div>
              <div className="my-form-flex column w100 gp0 pa3">
                <span className="fwb">Port of Loading</span>
                <span>
                  <Input value={details.port_of_loading} onChange={(e) => setDetailsFromKey("port_of_loading", e.target.value)} />
                </span>
              </div>
            </div>
          </div>
        </div>

        <Table size="small" columns={columns} dataSource={productData} pagination={false} bordered={true} />
        {additionalCharges.length > 0 && (
          <Table
            size="small"
            columns={additionalChargesColumns}
            dataSource={additionalCharges}
            pagination={false}
            bordered={true}
          />
        )}

        <div className="my-form-flex row">
          <div
            className="my-form-flex row w100 bb pa3"
            style={{ fontSize: "26px", padding: "20px", justifyContent: "space-between" }}
          >
            <div className="my-form-flex row">
              <span className="fwb">Total</span>
              <span style={{ marginLeft: "20px" }}>
                {toWords.toWords(ComputeTotals.final_total).replace(/^\w/, (c: any) => c.toUpperCase())} US Dollars Only
              </span>
            </div>
            <div className="my-form-flex row">
              <span className="fwb">$ {ComputeTotals.final_total}</span>
            </div>
          </div>
        </div>

        <div className="my-form-flex row bb gp0 w100">
          <div className="my-form-flex column br" style={{ width: "65%", alignItems: "flex-start", fontSize: "14px" }}>
            <div className="my-form-flex column w100 gp0 bb pa3">
              <span className="fwb">Declaration</span>
              <span>
                We declare that this invoice shows the actual price of the goods described and that all particulars are true and
                correct. E & OE
              </span>
            </div>
            <div className="my-form-flex column w100 gp0 pa3">
              <span className="fwb">Bank Details</span>
              <span className="fwb">{exporterDetails.name}</span>
              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ width: "120px" }}>Bank Name</span>
                <span>: {exporterDetails.account_details.bank_name}</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ width: "120px" }}>Account Number</span>
                <span>: {exporterDetails.account_details.account_number}</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ width: "120px" }}>IFSC Code</span>
                <span>: {exporterDetails.account_details.ifsc_code}</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ width: "120px" }}>Swift Code</span>
                <span>: {exporterDetails.account_details.swift_code}</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ width: "120px" }}>Branch</span>
                <span>: {exporterDetails.account_details.branch}</span>
              </div>
            </div>
          </div>
          <div
            className="my-form-flex column gp0"
            style={{ fontSize: "16px", width: "35%", display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <img
              src={exporterDetails?.stamp_image}
              alt="logo"
              className="logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </Spin>
  );
}

export const CreatePerformaInvoiceWrapper = ({
  permissions = {},
  username = "",
}: {
  permissions?: I_CreatePerformaInvoicePermissions;
  username?: string;
}) => {
  const invoice_id = useParams().invoice_id;
  return (
    <CreatePerformaInvoice permissions={permissions} id={invoice_id ? parseInt(invoice_id) : undefined} username={username} />
  );
};

const PICompanyDetails = {
  CIAN: {
    name: "Cian Healthcare Ltd.",
    address: "Office No.301, Konark Icon, Mundhwa - Kharadi Rd, Kirtane Baugh, Magarpatta, Hadapsar, Pune - 411028",
    phone: "020-4147 1234",
    email: "enquiry@cian.co",
    website: "www.cian.co",
    account_details: {
      bank_name: "IDBI Bank",
      account_number: "301102000000745",
      ifsc_code: "IBKL0000301",
      swift_code: "***********",
      branch: "Koregaon Park, Pune",
    },
    cover_image: "/assets/invoice_header/cian.jpg",
    stamp_image: "/assets/stamp/cian.jpg",
  },
  BAYBERRY: {
    name: "Bayberry Pharmaceuticals Pvt. Ltd.",
    address: "1315, Anant Apt., Shop No. 3, Nr. Perugate Police Chowky, Sadashiv Peth, Pune-411 030, India.",
    phone: "",
    email: "info@bayberry.co.in",
    website: "",
    account_details: {
      bank_name: "ICICI Bank",
      account_number: "003905030273",
      ifsc_code: "ICIC0000039",
      swift_code: "***********",
      branch: "Shivaji Nagar, Pune",
    },
    cover_image: "/assets/invoice_header/bayberry.jpg",
    stamp_image: "/assets/stamp/bayberry.jpg",
  },
  CELESTA: {
    name: "Celesta Healthcare Private Limited",
    address: "6, Gat No 1363, Shiv Rastha, NR. Meeth Godawon, Wadki, Tal Haveli, Dist Pune-412308",
    phone: "",
    email: "celestahealthcare@gmail.com",
    website: "",
    account_details: {
      bank_name: "IDFC First Bank",
      account_number: "10198932421",
      ifsc_code: "IDFB0041353",
      swift_code: "***********",
      branch: "Camp Pune",
    },
    cover_image: "/assets/invoice_header/celesta.jpg",
    stamp_image: "/assets/stamp/celesta.jpg",
  },
};

export const AddAnotherProduct = ({
  productData,
  addToProductData,
  permissions = {},
}: {
  productData: I_ProductData[];
  addToProductData: (data: any) => void;
  permissions?: I_CreatePerformaInvoicePermissions;
}) => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const handleAdd = async () => {
    if (!permissions?.edit) {
      toast.info("Edit Permission Required");
      return;
    }
    // Check if the id is already present
    if (productData.some((item) => item.id === value)) {
      toast.warning("Product already added");
      return;
    }

    setLoading(true);
    await axios
      .get("/get-sales-order-approval-by-id", {
        params: {
          id: value,
        },
      })
      .then((res) => {
        const data: I_ProductData = res.data.data;
        addToProductData({
          ...data,
          p_pack_short: (data?.p_pack_short || "") + " " + (data?.packing_style_description || ""),
          sales_order_approval_id: value,
        });
      })
      .catch((error) => {
        error.handleGlobally("Product Data");
      });
    setLoading(false);
  };

  return (
    <div className="my-form-flex row" style={{ alignItems: "center" }}>
      <InputWithLabel label="Id" isInline={true}>
        <InputNumber value={value} onChange={(value) => setValue(value || 0)} disabled={loading || !permissions?.edit} />
      </InputWithLabel>
      <Button type="primary" onClick={handleAdd} loading={loading} disabled={loading || !permissions?.edit}>
        Add More Products
      </Button>
    </div>
  );
};
