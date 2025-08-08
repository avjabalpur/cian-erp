  import { Button, Dropdown, InputNumber, Table, Input, Select, Divider, Spin } from "antd";
  import { I_SalesOrderApproval } from "./EditSalesOrderApproval";
  import { useEffect, useMemo, useState } from "react";
  import InputWithLabel from "../../Components/InputWithLabel";
  import axios from "axios";
  import { IoIosArrowDown, IoIosRemoveCircle } from "react-icons/io";
  import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
  import MyPortal from "../../Components/MyPortal";
  import dayjs from "dayjs";
  import { Margin, usePDF } from "react-to-pdf";
  import { toast } from "react-toastify";
  import { CompanyDetails } from "./OptionMasters";
  import usePageTitle from "../../Components/usePageTitle";

  interface I_AdditionalCharges {
    id: number;
    name: string;
    amount: number;
    tax_percent: number;
  }

  interface I_CreateQuotationPermissions {
    edit?: boolean;
  }
  interface I_CreateQuotationProps {
    permissions?: I_CreateQuotationPermissions;
    id?: number;
    username?: string
  }

  interface I_ProductData extends I_SalesOrderApproval {
    sales_order_approval_id: number;
    tax_percent: number;
    product_extra_charges: number;
    product_extra_charges_tax_percent: number;
  }

  interface I_QuotationDetails {
    company_name: "CIAN" | "DR SMITH" | "Bayberry" | "SHEFIATRIC LIFE SCIENCES" | "CELESTA HEALTHCARE PVT. LTD." | "JM LIFESCIENCES PVT. LTD.";
    quotation_number: string;
    quotation_date: string;
    customer_name: string;
    customer_contact_person: string;
    customer_mobile_number: string;
    customer_email: string;
    advance_percentage?: number;
    payment_term?: string;
  }

  interface I_ComputedTotals {
    product_calculations: { basic_amount: number; tax_on_basic: number; tax_on_charges: number; total: number }[];
    charges_calculations: { tax: number; total: number }[];

    products_basic_total: number;
    products_tax_total: number;
    products_final_total: number;

    extra_charges_basic_total: number;
    extra_charges_tax_total: number;
    extra_charges_final_total: number;

    final_total: number;
    advance_payment: number;
    balance_payment: number;

    product_basic_advance_payment: number;
    product_tax_advance_payment: number;
    extra_charges_basic_advance_payment: number;
    extra_charges_tax_advance_payment: number;
  }

  export default function CreateQuotation({ permissions = { edit: true }, id, username="" }: I_CreateQuotationProps) {
    usePageTitle(id ? `Quotation ${id} | Cian` : "Create Quotation | Cian", ["Quotation", id ? id.toString() : "Create"]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [productData, setProductData] = useState<I_ProductData[]>([]);
    const [additionalCharges, setAdditionalCharges] = useState<I_AdditionalCharges[]>([
      { name: "Inventory Charges", amount: 0, id: 1, tax_percent: 18 },
    ]);
    const generateRandomQuotationNumber = () => {
      return `QTD-${dayjs().format("YY")}${Math.floor(Math.random() * 100)}-${Math.floor(Math.random() * 10000)}`;
    };
    const [details, setDetails] = useState<I_QuotationDetails>({
      company_name: "CIAN", // CIAN | DR SMITH | Bayberry | SHEFIATRIC LIFE SCIENCES | CELESTA HEALTHCARE PVT. LTD. | JM LIFESCIENCES PVT. LTD.
      quotation_number: generateRandomQuotationNumber(),
      quotation_date: dayjs().format("YYYY-MM-DD"),
      customer_name: "Customer Name",
      customer_contact_person: "Shlok Zanwar",
      customer_mobile_number: "9998889998",
      customer_email: "abc@abc.com",
      advance_percentage: 50,
      payment_term: "",
    });
    const setDetailsFromKey = (key: keyof I_QuotationDetails, value: any) => {
      if (!permissions?.edit) {
        toast.info("Edit Permission Required");
        return;
      }
      setDetails((prev) => ({ ...prev, [key]: value }));
    };
    const [loading, setLoading] = useState(false);
    const { toPDF, targetRef } = usePDF({
      filename: `Quotation-${details.company_name}-${details.quotation_number}.pdf`,
      page: { orientation: "landscape", margin: Margin.SMALL },
      // overrides: { pdf: { compress: true } },
    });

    // TODO: Need to correct this
    const companyDetails = useMemo(() => {
      return CompanyDetails[details.company_name];
    }, [details.company_name]);

    const setProductDataFromId = async (id: number, key: keyof I_ProductData, value: any) => {
      if (!permissions?.edit) {
        toast.info("Edit Permission Required");
        return;
      }
      setProductData((prev) => {
        const data: I_ProductData[] = [...prev];
        const index = data.findIndex((item) => item.id === id);
        data[index][key] = value as never; // Fix: Typecast value as 'never'
        return data;
      });
    };

    const getCustomerDetails = async (customer_name: string) => {
      if (!permissions?.edit) {
        toast.info("Edit Permission Required");
        return;
      }
      await axios
        .get("/get-customer-details", {
          params: {
            customer_name: customer_name,
          },
        })
        .then((res) => {
          const data: any = res.data.data;
          setDetails((prev) => ({
            ...prev,
            customer_name: customer_name,
            customer_contact_person: data.contact_person,
            customer_mobile_number: data.contact_number,
            customer_email: data.email,
            payment_term: productData[0]?.payment_term,
          }));
        })
        .catch((error) => {
          error.handleGlobally("Customer Details");
        });
    };
    // We need to update the customer details when the first product is added
    useEffect(() => {
      if (productData.length === 1 && permissions?.edit) {
        getCustomerDetails(productData[0]?.customer_name || "");
      }
    }, [productData, permissions?.edit]);

    const getQuotationDetails = async (quotation_id: number) => {
      setLoading(true);
      await axios
        .get("/get-sales-order-approval-quotation-by-id", {
          params: {
            quotation_id: quotation_id,
          },
        })
        .then((res) => {
          const data: any = res.data.data;
          setDetails((prev) => ({
            ...prev,
            company_name: data.company_name,
            quotation_number: data.quotation_number,
            quotation_date: data.quotation_date,
            customer_name: data.customer_name,
            customer_contact_person: data.customer_contact_person,
            customer_mobile_number: data.customer_mobile_number,
            customer_email: data.customer_email,
            advance_percentage: data.advance_percentage,
            payment_term: data.payment_term,
          }));
          setProductData(data.products);
          setAdditionalCharges(data.charges);
        })
        .catch((error) => {
          error.handleGlobally("Quotation Details");
          navigate("/sales-order-approval/quotations");
        });
      setLoading(false);
    };
    useEffect(() => {
      if (id) {
        getQuotationDetails(id);
      }
    }, [id]);

    const getQuotationDetailsToCreateNew = async (quotation_id: number) => {
      setLoading(true);
      // alert("getQuotationDetailsToCreateNew + " + quotation_id);
      await axios
        .get("/get-sales-order-approval-quotation-by-id", {
          params: {
            quotation_id: quotation_id,
          },
        })
        .then(async (res) => {
          const data: any = res.data.data;
          setDetails((prev) => ({
            ...prev,
            company_name: data.company_name,
            quotation_number: generateRandomQuotationNumber(),
            quotation_date: dayjs().format("YYYY-MM-DD"),
            customer_name: data.customer_name,
            customer_contact_person: data.customer_contact_person,
            customer_mobile_number: data.customer_mobile_number,
            customer_email: data.customer_email,
            advance_percentage: data.advance_percentage,
            payment_term: data.payment_term
          }));
          setAdditionalCharges(data.charges);
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
                    // p_quantity: product.p_quantity,
                    // p_foc_qty: product.p_foc_qty,
                    // p_mrp: product.p_mrp,
                    // p_billing_rate: product.p_billing_rate,
                    tax_percent: product.tax_percent,
                    product_extra_charges: parseInt(data?.p_cylinder_charge || "0"),
                    product_extra_charges_tax_percent: product.product_extra_charges_tax_percent,
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
          error.handleGlobally("Prev Copy Quotation Details");
          // navigate("/sales-order-approval/quotations");
        });
      setLoading(false);
    };
    useEffect(() => {
      if (searchParams.get("copy_from_id")) {
        getQuotationDetailsToCreateNew(parseInt(searchParams.get("copy_from_id") || "0"));
      }
    }, [searchParams.get("copy_from_id")]);


    const ComputeTotals: I_ComputedTotals = useMemo(() => {
      let products_basic_total = 0;
      let products_tax_total = 0;
      let products_final_total = 0;
      let extra_charges_basic_total = 0;
      let extra_charges_tax_total = 0;
      let extra_charges_final_total = 0;
      let final_total = 0;
      const product_calculations: I_ComputedTotals["product_calculations"][0][] = [];
      const charges_calculations: I_ComputedTotals["charges_calculations"][0][] = [];
      productData.forEach((product) => {
        const basic_amount = (product.p_billing_rate || 0) * (product.p_quantity || 0);
        const tax_on_product = (basic_amount * product.tax_percent) / 100;
        const tax_on_charges = (product.product_extra_charges * product.product_extra_charges_tax_percent) / 100;
        const final_product_total =basic_amount + tax_on_product + product.product_extra_charges + tax_on_charges;

        product_calculations.push({
          basic_amount,
          tax_on_basic: Math.round(tax_on_product * 100) / 100,
          tax_on_charges: Math.round(tax_on_charges * 100) / 100,
          total: Math.round(final_product_total * 100) / 100,
        });

        products_basic_total += basic_amount;
        products_tax_total += tax_on_product;
        products_final_total += basic_amount + tax_on_product;

        extra_charges_basic_total += product.product_extra_charges;
        extra_charges_tax_total += tax_on_charges;
        extra_charges_final_total += product.product_extra_charges + tax_on_charges;

        final_total += final_product_total;
      });
      additionalCharges.forEach((charge) => {
        const tax = (charge.amount * charge.tax_percent) / 100;
        charges_calculations.push({
          tax: Math.round(tax * 100) / 100,
          total: Math.round((charge.amount + tax) * 100) / 100
        });

        extra_charges_basic_total += charge.amount;
        extra_charges_tax_total += tax;
        extra_charges_final_total += charge.amount + tax;

        final_total += charge.amount + tax;
      });

      let advance_payment = 0;
      let product_advance_payment = 0;
      if(details.advance_percentage && details.advance_percentage > 0) {
        product_advance_payment = (products_basic_total * details.advance_percentage) / 100;
        advance_payment = product_advance_payment + products_tax_total + extra_charges_final_total;
      }

      return {
        product_calculations: product_calculations,
        charges_calculations: charges_calculations,

        products_basic_total: Math.round(products_basic_total * 100) / 100,
        products_tax_total: Math.round(products_tax_total * 100) / 100,
        products_final_total: Math.round(products_final_total * 100) / 100,

        extra_charges_basic_total: Math.round(extra_charges_basic_total * 100) / 100,
        extra_charges_tax_total: Math.round(extra_charges_tax_total * 100) / 100,
        extra_charges_final_total: Math.round(extra_charges_final_total * 100) / 100,

        // Round off to 2 decimal places
        final_total: Math.round(final_total * 100) / 100,
        advance_payment: Math.round(advance_payment * 100) / 100,
        balance_payment: Math.round((final_total - advance_payment) * 100) / 100,

        product_basic_advance_payment: Math.round(product_advance_payment * 100) / 100,
        product_tax_advance_payment: details.advance_percentage ? Math.round(products_tax_total * 100) / 100 : 0,
        extra_charges_basic_advance_payment: details.advance_percentage ? Math.round(extra_charges_basic_total * 100) / 100 : 0,
        extra_charges_tax_advance_payment: details.advance_percentage ? Math.round(extra_charges_tax_total * 100) / 100 : 0,
      };
    }, [productData, additionalCharges, details.advance_percentage]);

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
        title: "Brand  Name",
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
      },
      {
        title: "P-Cast",
        key: "product_cast",
        dataIndex: "product_cast",
      },
      {
        title: "Packing",
        key: "p_pack_short",
        dataIndex: "p_pack_short",
      },
      {
        title: "Flag",
        key: "so_status",
        dataIndex: "so_status",
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
        width: "35px",
      },
      {
        title: "MRP",
        key: "p_mrp",
        dataIndex: "p_mrp",
        width: "75px",
      },
      {
        title: "Rate",
        key: "p_billing_rate",
        dataIndex: "p_billing_rate",
        width: "75px",
      },
      // {
      //   title: "Tax",
      //   key: "tax",
      //   // dataIndex: "tax",
      //   render: () => "18%"
      // },

      {
        title: "Total",
        key: "total",
        dataIndex: "total",
        render: (_: any, record: any, index: number) => ComputeTotals.product_calculations[index].basic_amount,
        width: "90px",
        // onCell: () => {
        //   return {
        //     style: { fontWeight: "bold" },
        //   };
        // },
        // align: "center"
      },
      {
        title: "Tax %",
        key: "tax_percent",
        dataIndex: "tax_percent",
        render: (_: any, record: any) => {
          return (
            <div className="my-form-flex row" style={{ alignItems: "center" }}>
              <InputNumber
                // bordered={false}
                value={_}
                onChange={(value) => setProductDataFromId(record.id, "tax_percent", value)}
                controls={false}
                style={{ width: "50px" }}
                disabled={!permissions?.edit}
              />
              %
            </div>
          );
        },
      },
      {
        title: "Tax",
        key: "tax",
        dataIndex: "tax",
        render: (_: any, record: any, index: number) => ComputeTotals.product_calculations[index].tax_on_basic,
        width: "90px",
        // onCell: () => {
        //   return {
        //     style: { fontWeight: "bold" },
        //   };
        // },
        // align: "center"
      },
      {
        title: "Cylinder Charges",
        key: "product_extra_charges",
        dataIndex: "product_extra_charges",
        // render: (_: any, record: any) => {
        //   return (
        //     <InputNumber
        //       // bordered={false}
        //       value={_}
        //       onChange={(value) => setProductDataFromId(record.id, "product_extra_charges", value)}
        //       controls={false}
        //       style={{ width: "70px" }}
        //       // disabled={!permissions?.edit}
        //       disabled={true}
        //     />
        //   );
        // },
      },
      {
        title: "Tax",
        key: "product_extra_charges_tax_percent",
        dataIndex: "product_extra_charges_tax_percent",
        render: (_: any, record: any, index: number) => {
          return (
            <div className="my-form-flex column" style={{ alignItems: "flex-start", gap: '0px', marginTop: "20px" }}>
              <div className="my-form-flex row" >
                <InputNumber
                  // bordered={false}
                  value={_}
                  onChange={(value) => setProductDataFromId(record.id, "product_extra_charges_tax_percent", value)}
                  controls={false}
                  style={{ width: "50px" }}
                  disabled={!permissions?.edit}
                />
                %
              </div>
              <span style={{marginLeft: '4px'}}>(Rs {ComputeTotals.product_calculations[index].tax_on_charges})</span>
            </div>
          );
        },
      },
      {
        title: "Final Total",
        key: "final_total",
        dataIndex: "final_total",
        render: (_: any, record: any, index: number) => ComputeTotals.product_calculations[index].total,
        onCell: () => {
          return {
            style: { fontWeight: "bold" },
          };
        },
        width: "80px",
      },
      {
        title: "Comment",
        key: "comments",
        dataIndex: "comments",
        // width: "500px",
      },
    ];

    const RandomId = () => {
      return Math.floor(Math.random() * 1000000000);
    };


    const createQuotationAndPrint = async () => {
      if(productData.length == 0) {
        toast.error("Cannot Create Quotation without products !");
        return;
      }
      setLoading(true);

      await axios
        .post("/create-sales-order-approval-quotation", {
          company_name: details.company_name,
          quotation_number: details.quotation_number,
          quotation_date: details.quotation_date,
          customer_name: details.customer_name,
          customer_contact_person: details.customer_contact_person,
          customer_mobile_number: details.customer_mobile_number,
          customer_email: details.customer_email,
          advance_percentage: details.advance_percentage,
          payment_term: details.payment_term,
          charges: additionalCharges,
          total_amount: ComputeTotals.final_total,
          advance_amount: ComputeTotals.advance_payment,
          prev_copy_quotation_id: parseInt(searchParams.get("copy_from_id") || "0"),
          products: productData.map((item) => ({
            sales_order_approval_id: item.id,     // sales_order_approval_id
            product_name: item.product_name,
            composition: item.composition || "",
            dosage_name: item.dosage_name,
            product_cast: item.product_cast,
            p_pack_short: item.p_pack_short,
            so_status: item.so_status,
            p_quantity: item.p_quantity,
            p_foc_qty: item.p_foc_qty,
            p_mrp: item.p_mrp,
            p_billing_rate: item.p_billing_rate,
            comments: item.comments || "",
            tax_percent: item.tax_percent || 0,
            product_extra_charges: item.product_extra_charges || 0,
            product_extra_charges_tax_percent: item.product_extra_charges_tax_percent || 0,
          })),
        })
        .then((res) => {
          toast.success("Quotation Created");
          toPDF();
          navigate(`/sales-order-approval/quotations/${res.data.quotation_id}`);
        })
        .catch((error) => {
          error.handleGlobally("Quotation");
        });
      setLoading(false);
    };

    return (
      <Spin spinning={loading}>
        <div>
          {permissions?.edit && (
            <MyPortal id="navbar-portal">
              <div className="my-form-flex row" style={{ alignItems: "center" }}>
                <InputWithLabel
                  label="Company Name"
                  isInline={true}
                  labelStyle={{ width: "110px", fontSize: "14px" }}
                  divStyle={{ marginRight: "80px" }}
                >
                  <Select
                    value={details.company_name}
                    onChange={(value) => {
                      setDetails((prev) => ({ ...prev, company_name: value }));
                    }}
                    style={{ width: "120px" }}
                    options={[
                      { value: "CIAN", label: "CIAN" },
                      { value: "DR SMITH", label: "DR SMITH" },
                      { value: "Bayberry", label: "Bayberry" },
                      { value: "SHEFIATRIC LIFE SCIENCES", label: "SHEFIATRIC LIFE SCIENCES" },
                      { value: "CELESTA HEALTHCARE PVT. LTD.", label: "CELESTA HEALTHCARE PVT. LTD." },
                      { value: "JM LIFESCIENCES PVT. LTD.", label: "JM LIFESCIENCES PVT. LTD." },
                    ]}
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
                    setAdditionalCharges([...additionalCharges, { name: "Name", amount: 10, id: RandomId(), tax_percent: 18 }]);
                  }}
                  style={{ marginLeft: "10px" }}
                  disabled={!permissions?.edit}
                >
                  Add Charges
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    createQuotationAndPrint();
                  }}
                  style={{ marginLeft: "10px" }}
                  disabled={!permissions?.edit}
                >
                  Create Quotation and Print
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
          <div ref={targetRef} style={{ border: "3px solid black", padding: "4px" }}>
            <div
              className="my-form-flex column"
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                gap: "2px",
                marginBottom: "10px",
                borderBottom: "2px solid black",
                paddingBottom: "8px",
              }}
            >
              <span style={{ fontSize: "16px", fontWeight: "bold", color: "blue" }}>Quotation</span>
              <span style={{ fontSize: "22px", fontWeight: "bold", color: "brown" }} contentEditable={false}>
                {companyDetails.name}
              </span>
              <span style={{}}>
                <b>Corporate Office : </b>
                <span contentEditable={false}>{companyDetails.address}</span>
              </span>
              <div
                className="my-form-flex row"
                style={{ width: "100%", justifyContent: "center", alignItems: "center", gap: "80px" }}
              >
                <span style={{}}>
                  <b>Phone : </b>
                  <span contentEditable={false}>{companyDetails.phone}</span>
                </span>
                <span style={{}}>
                  <b>Email : </b>
                  <span contentEditable={false}>{companyDetails.email}</span>
                </span>
                <span style={{}}>
                  <b>Website : </b>
                  <span contentEditable={false}>{companyDetails.website}</span>
                </span>
              </div>
              <div
                className="my-form-flex row"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "80px",
                  paddingTop: "10px",
                  margin: "20px 40px 0px 40px",
                  borderTop: "2px solid black",
                }}
              >
                <span style={{}}>
                  <b>IDBI  Bank Current Account   A/c  No. : </b>
                  <span contentEditable={false}>{companyDetails.account_details.account_number}</span>
                </span>
                <span style={{}}>
                  <b>IFSC  Code : </b>
                  <span contentEditable={false}>{companyDetails.account_details.ifsc_code}</span>
                </span>
                <span style={{}}>
                  <b>Branch : </b>
                  <span contentEditable={false}>{companyDetails.account_details.branch}</span>
                </span>

              </div>
              <div
                className="my-form-flex row"
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: "80px",
                  margin: "10px 40px 0px 40px",
                  borderTop: "2px solid black",
                }}
              >
                <div
                  className="my-form-flex column"
                  style={{ width: "50%", alignItems: "flex-start", justifyContent: "flex-start" }}
                >
                  <div className="my-form-flex row" style={{ width: "100%" }}>
                    <b style={{ width: "140px" }}>Quo.No</b>
                    <b>:</b>
                    <span contentEditable={false} style={{ width: "100%" }}>
                      {details.quotation_number}
                    </span>
                  </div>
                  <div className="my-form-flex row" style={{ width: "100%" }}>
                    <b style={{ width: "140px" }}>Customer Name</b>
                    <b>:</b>
                    {/* <span contentEditable={false}>Customer Name</span> */}
                    <Input
                      value={details.customer_name}
                      onChange={(e) => setDetailsFromKey("customer_name", e.target.value)}
                      style={{ width: "100%" }}
                      // bordered={false}
                      size="small"
                      disabled={!permissions?.edit}
                    />
                  </div>
                  <div className="my-form-flex row" style={{ width: "100%" }}>
                    <b style={{ width: "140px" }}>Contact Person</b>
                    <b>:</b>
                    {/* <span contentEditable={false}>Shlok Zanwar</span> */}
                    <Input
                      value={details.customer_contact_person}
                      onChange={(e) => setDetailsFromKey("customer_contact_person", e.target.value)}
                      style={{ width: "100%" }}
                      size="small"
                      disabled={!permissions?.edit}
                      // bordered={false}
                    />
                  </div>
                  <div className="my-form-flex row" style={{ width: "100%" }}>
                    <b style={{ width: "140px" }}>Payment Term</b>
                    <b>:</b>
                    {/* <span contentEditable={false}>Shlok Zanwar</span> */}
                    <Input
                      value={details.payment_term}
                      onChange={(e) => setDetailsFromKey("payment_term", e.target.value)}
                      style={{ width: "100%" }}
                      size="small"
                      disabled={!permissions?.edit}
                      // bordered={false}
                    />
                  </div>
                </div>
                <div
                  className="my-form-flex column"
                  style={{ width: "50%", alignItems: "flex-start", justifyContent: "flex-start" }}
                >
                  <div className="my-form-flex row" style={{ width: "100%" }}>
                    <b style={{ width: "100px" }}>Quo.date</b>
                    <b>:</b>
                    <span style={{ width: "100%" }}>{details.quotation_date}</span>
                  </div>
                  <div className="my-form-flex row" style={{ width: "100%" }}>
                    <b style={{ width: "100px" }}>Mobile No.</b>
                    <b>:</b>
                    {/* <span contentEditable={false}>9998889998</span> */}
                    <Input
                      value={details.customer_mobile_number}
                      onChange={(e) => setDetailsFromKey("customer_mobile_number", e.target.value)}
                      style={{ width: "100%" }}
                      size="small"
                      disabled={!permissions?.edit}
                      // bordered={false}
                    />
                  </div>
                  <div className="my-form-flex row" style={{ width: "100%" }}>
                    <b style={{ width: "100px" }}>Email Id</b>
                    <b>:</b>
                    {/* <span contentEditable={false}>purchase@somecompany.com</span> */}
                    <Input
                      value={details.customer_email}
                      onChange={(e) => setDetailsFromKey("customer_email", e.target.value)}
                      style={{ width: "100%" }}
                      size="small"
                      disabled={!permissions?.edit}
                      // bordered={false}
                    />
                  </div>
                  <div className="my-form-flex row" style={{ width: "100%" }}>
                    <b style={{ width: "100px" }}>Prepared By</b>
                    <b>:</b>
                    <span style={{ width: "100%" }}>{username}</span>
                  </div>
                </div>
              </div>
            </div>
            <Table size="small" columns={columns} dataSource={productData} pagination={false} bordered={true} />

            <div className="my-form-flex row" style={{ width: "100%", justifyContent: "flex-start", marginTop: "10px" }}>
              <div
                className="my-form-flex column"
                style={{ borderRight: "1px solid lightgrey", paddingRight: "10px", flexGrow: 1 }}
              >
                <div>
                  <b>Final Comment</b>
                </div>
                <div contentEditable={true}>
                  Validity of the Offer rate : 7 days
                  <br />
                  <br />
                  Transportation from the manufacturing site to the destination will be borne by the customer.
                  <br />
                  If goods are called to Pune Depot by us then the transportation from manufacturing site to Pune Depot will be
                  added to the invoice.
                  <br />
                  <br />
                  <b>Terms</b>
                  <br />
                  Terms about proceeding manufacturing plan for new product (first time delivery product) and old product.
                  <br />
                  We Will calculate our manufacturing plan day with the following facts.
                  <br />
                  <ol>
                    <li>Sending final quotation to customer.</li>
                    <li>Finalization of Artwork (For new Product)</li>
                    <li>Advance Payment clearance</li>
                    <li>After receiving approval from Drug Office (new product)</li>
                    <li>On hold product due to non-clearing</li>
                  </ol>
                </div>
              </div>
              <div className="my-form-flex column" style={{ width: "500px", justifyContent: "flex-start" }}>
                <AdditionalCharges
                  additionalCharges={additionalCharges}
                  setAdditionalCharges={setAdditionalCharges}
                  permissions={permissions}
                />
                <Table
                  columns={NameTableColumns}
                  dataSource={[
                    // { name: "Amount", value: ComputeTotals.amount },
                    // { name: "Tax (18%)", value: ComputeTotals.tax },
                    { name: "Total", value: ComputeTotals.final_total, valueStyle: { fontWeight: "bold" } },
                  ]}
                  size="small"
                  showHeader={false}
                  pagination={false}
                  bordered={false}
                />
                <Divider style={{ margin: "10px 0px", fontWeight: "bolder" }}>
                  <div className="my-form-flex row" style={{ justifyContent: "flex-end", alignItems: "center" }}>
                    <b>Advance Payment </b>
                    <InputNumber
                      value={details.advance_percentage}
                      onChange={(value) => setDetailsFromKey("advance_percentage", value)}
                      style={{ width: "100px" }}
                      disabled={!permissions?.edit}
                      // size="small"
                      // bordered={false}
                    />
                    %
                  </div>
                </Divider>
                <Table
                  columns={[
                    {
                      title: "Amount Type",
                      key: "amount_type",
                      dataIndex: "amount_type",
                      onCell: (record: any) => {
                        return {
                          // style: { fontWeight: "bold" },
                          rowSpan: record.rowSpan,
                        };
                      }
                    },
                    {
                      title: "Cost/Tax",
                      key: "cost_tax",
                      dataIndex: "cost_tax",
                      onCell: (record: any) => {
                        return {
                          // style: { fontWeight: "bold" },
                          // rowSpan: record.rowSpan,
                        };
                      }
                    },
                    {
                      title: "Value",
                      key: "value",
                      dataIndex: "value",
                      onCell: (record: any) => {
                        return {
                          // style: { fontWeight: "bold" },
                          // rowSpan: record.rowSpan,
                        };
                      }
                    },
                    {
                      title: "Advance",
                      key: "advance_payment",
                      dataIndex: "advance_payment",
                      onCell: (record: any) => {
                        return {
                          style: { fontWeight: "bold" },
                          // rowSpan: record.rowSpan,
                        };
                      }
                    }
                  ]}
                  dataSource={[
                    { rowSpan: 2, amount_type: "Product", cost_tax: "Amount", value: ComputeTotals.products_basic_total, advance_payment: ComputeTotals.product_basic_advance_payment },
                    { rowSpan: 0, amount_type: "Product", cost_tax: "Tax", value: ComputeTotals.products_tax_total, advance_payment: ComputeTotals.product_tax_advance_payment },
                    { rowSpan: 2, amount_type: "Extra Charges", cost_tax: "Amount", value: ComputeTotals.extra_charges_basic_total, advance_payment: ComputeTotals.extra_charges_basic_advance_payment },
                    { rowSpan: 0, amount_type: "Extra Charges", cost_tax: "Tax", value: ComputeTotals.extra_charges_tax_total, advance_payment: ComputeTotals.extra_charges_tax_advance_payment },
                  ]}
                  size="small"
                  showHeader={true}
                  pagination={false}
                  bordered={true}
                />
                <Table
                  columns={NameTableColumns}
                  dataSource={[
                    { name: "Advance Payment", value: ComputeTotals.advance_payment, valueStyle: { fontWeight: "bold", color: "red" } },
                    { name: "Balance", value: ComputeTotals.balance_payment, valueStyle: { fontWeight: "bold", color: "red" } },
                  ]}
                  size="small"
                  showHeader={false}
                  pagination={false}
                  bordered={false}
                />
              </div>
            </div>
          </div>
        </div>
      </Spin>
    );
  }

  export const CreateQuotationWrapper = ({ permissions = {}, username="" }: { permissions?: I_CreateQuotationPermissions, username?: string }) => {
    const quotation_id = useParams().quotation_id;
    return <CreateQuotation permissions={permissions} id={quotation_id ? parseInt(quotation_id) : undefined} username={username} />;
  };

  const AddAnotherProduct = ({
    productData,
    addToProductData,
    permissions = {},
  }: {
    productData: I_ProductData[];
    addToProductData: (data: any) => void;
    permissions?: I_CreateQuotationPermissions;
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
            tax_percent: 12,
            product_extra_charges: parseInt(data?.p_cylinder_charge || "0"),
            product_extra_charges_tax_percent: 18,
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

  const AdditionalCharges = ({
    additionalCharges,
    setAdditionalCharges,
    permissions = {},
  }: {
    additionalCharges: I_AdditionalCharges[];
    setAdditionalCharges: (data: I_AdditionalCharges[]) => void;
    permissions?: I_CreateQuotationPermissions;
  }) => {
    const columns = [
      {
        title: "Action",
        key: "action",
        render: (_: any, __: I_AdditionalCharges, idx: number) =>
          permissions?.edit && (
            <IoIosRemoveCircle
              style={{ color: "red" }}
              onClick={() => {
                const data = [...additionalCharges];
                data.splice(idx, 1);
                setAdditionalCharges(data);
              }}
            />
          ),
        width: "12px",
      },
      {
        title: "Name",
        key: "name",
        dataIndex: "name",
        render: (_: any, record: I_AdditionalCharges, idx: number) => {
          return (
            <Input
              value={record.name}
              onChange={(e) => {
                const data = [...additionalCharges];
                data[idx].name = e.target.value;
                setAdditionalCharges(data);
              }}
              style={{ width: "100%" }}
              disabled={!permissions?.edit}
            />
          );
        },
      },

      {
        title: "Amount",
        key: "amount",
        dataIndex: "amount",
        width: "100px",
        render: (_: any, record: I_AdditionalCharges, idx: number) => {
          return (
            <InputNumber
              value={record.amount}
              onChange={(value) => {
                const data = [...additionalCharges];
                data[idx].amount = value || 0;
                setAdditionalCharges(data);
              }}
              style={{ width: "100%" }}
              disabled={!permissions?.edit}
            />
          );
        },
      },
      {
        title: "Tax",
        key: "tax_percent",
        dataIndex: "tax_percent",
        render: (_: any, record: I_AdditionalCharges, idx: number) => {
          return (
            <div className="my-form-flex row" style={{ alignItems: "center" }}>
              <InputNumber
                // bordered={false}
                value={record.tax_percent}
                onChange={(value) => {
                  const data = [...additionalCharges];
                  data[idx].tax_percent = value || 0;
                  setAdditionalCharges(data);
                }}
                controls={false}
                style={{ width: "50px" }}
                disabled={!permissions?.edit}
              />
              %
            </div>
          );
        },
      },
      {
        title: "Total",
        key: "total",
        dataIndex: "total",
        render: (_: any, record: I_AdditionalCharges) => {
          return record.amount + (record.amount * (record.tax_percent || 0)) / 100;
        },
        onCell: () => {
          return {
            style: { fontWeight: "bold" },
          };
        },
        width: "80px",
      },
    ];

    return additionalCharges.length ? (
      <Table size="small" columns={columns} dataSource={additionalCharges} pagination={false} showHeader={false} />
    ) : null;
  };

  const NameTableColumns = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
      onCell: () => {
        return {
          style: { fontWeight: "bold" },
        };
      },
    },
    {
      title: "Value",
      key: "value",
      dataIndex: "value",
      // render it with rupee symbol
      render: (_: any) => <>Rs. {_}</>,
      onCell: (record: any) => {
        return {
          style: record?.valueStyle,
        };
      },
      width: "120px",
    },
  ];
