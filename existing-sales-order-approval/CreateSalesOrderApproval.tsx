import React, { useState } from "react";
import { Modal, Input, Button, Popconfirm, Select } from "antd";
import { SOApprovalOptionsMaster } from "./OptionMasters";
import InputWithLabel from "../../Components/InputWithLabel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { I_SOApprovalPermissions } from "../../RoleInterfaces";

interface I_CreateSalesOrderApprovalProps {
  permissions?: I_SOApprovalPermissions;
}
const CreateSalesOrderApproval: React.FC<I_CreateSalesOrderApprovalProps> = ({ permissions }) => {
  const [details, setDetails] = useState({
    dosage_name: "TABLET",
    so_status: "REPEAT",
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setDetailsKey = (key: string, value: string) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    await axios
      .post("/create-sales-order-approval", {
        dosage_name: details.dosage_name,
        so_status: details.so_status,
      })
      .then((res) => {
        toast.success("Approval Form Created Successfully");
        navigate("/sales-order-approval/edit/" + res.data.id);
      })
      .catch((err) => {
        err.handleGlobally && err.handleGlobally("Create SO Approval Form");
      });
    setLoading(false);
  };

  const handleCreateForm = () => {
    setOpen(true);
  };

  return (
    <>
      {permissions?.bd ? (
        <Button onClick={handleCreateForm} type="primary">
          Create Approval Form
        </Button>
      ) : null}
      <Modal
        open={open}
        title="Create Approval Form"
        footer={[
          <Button key="back" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>,
          <Popconfirm
            title="Are you sure to submit?"
            onConfirm={handleSubmit}
            // onCancel={handleModalCancel}
            okText="Yes"
            cancelText="No"
            disabled={loading}
          >
            <Button key="submit" type="primary" loading={loading} disabled={loading} style={{ marginLeft: 10 }}>
              Submit
            </Button>
            ,
          </Popconfirm>,
        ]}
      >
        <InputWithLabel divStyle={{ marginBottom: 10, width: "100%" }} label="Dosage Name">
          <Select
            // name="dosage_name"
            value={details.dosage_name}
            onChange={(value) => setDetailsKey("dosage_name", value)}
            options={SOApprovalOptionsMaster.dosage_name}
            placeholder="Dosage Name"
            style={{ width: "100%" }}
            loading={loading}
            disabled={loading}
          />
        </InputWithLabel>
        <InputWithLabel divStyle={{ marginBottom: 10, width: "100%" }} label="SO Status">
          <Select
            // name="so_status"
            value={details.so_status}
            onChange={(value) => setDetailsKey("so_status", value)}
            options={SOApprovalOptionsMaster.so_status}
            placeholder="SO Status"
            style={{ width: "100%" }}
            loading={loading}
            disabled={loading}
          />
        </InputWithLabel>
      </Modal>
    </>
  );
};

export default CreateSalesOrderApproval;
