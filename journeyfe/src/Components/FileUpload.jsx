import { useState } from "react";
import {
  Button,
  Upload,
  Steps,
  Form,
  Checkbox,
  message,
  Select,
  Card,
  Typography,
  Space,
  Tooltip,
} from "antd";
import {
  UploadOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Step } = Steps;
const { Title, Text } = Typography;
const { Option } = Select;

// Enhanced Configuration JSON
const CONFIG_JSON = {
  Invoice: {
    fields: {
      invoice_number: {
        label: "Invoice Number",
        type: "text",
        description: "Unique invoice identifier",
        required: true,
      },
      invoice_value: {
        label: "Invoice Value",
        type: "number",
        description: "Total invoice amount",
        required: true,
      },
      seller_name: {
        label: "Seller Name",
        type: "text",
        description: "Name of the seller/company",
        required: true,
      },
    },
    fileTypes: [".pdf", ".jpg", ".png"],
  },
  PO: {
    fields: {
      po_number: {
        label: "Purchase Order Number",
        type: "text",
        description: "Unique purchase order identifier",
        required: true,
      },
      po_date: {
        label: "Purchase Order Date",
        type: "date",
        description: "Date of the purchase order",
        required: true,
      },
    },
    fileTypes: [".pdf", ".jpg", ".png"],
  },
  Aadhaar: {
    fields: {
      name: {
        label: "Full Name",
        type: "text",
        description: "Name as per Aadhaar",
        required: true,
      },
      uid: {
        label: "Aadhaar Number",
        type: "text",
        description: "12-digit Aadhaar number",
        required: true,
      },
    },
    fileTypes: [".pdf", ".jpg", ".png"],
  },
  PAN: {
    fields: {
      name: {
        label: "Full Name",
        type: "text",
        description: "Name as per PAN Card",
        required: true,
      },
      pan_number: {
        label: "PAN Number",
        type: "text",
        description: "Permanent Account Number",
        required: true,
      },
    },
    fileTypes: [".pdf", ".jpg", ".png"],
  },
};

const UnifiedFileUploader = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDocumentTypes, setSelectedDocumentTypes] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false); // To track if files are uploaded
  const [form] = Form.useForm();

  // Dynamic Form Generation with Checkboxes
  const generateDynamicForms = () => {
    return selectedDocumentTypes.map((docType) => {
      const documentConfig = CONFIG_JSON[docType];
      return (
        <Card key={docType} title={`${docType} Details`} style={{ marginBottom: 16 }}>
          {Object.entries(documentConfig.fields).map(([fieldKey, fieldConfig]) => (
            <Form.Item
              key={fieldKey}
              name={`${docType}_${fieldKey}`}
              label={
                <Space>
                  {fieldConfig.label}
                  <Tooltip title={fieldConfig.description}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </Space>
              }
              valuePropName="checked"
            >
              <Checkbox>
                {fieldConfig.label}
              </Checkbox>
            </Form.Item>
          ))}
        </Card>
      );
    });
  };

  // File Upload Handler
  const handleFileUpload = (info) => {
    const { status, originFileObj } = info.file;
    if (status === "done" || status === "success" || info.event) {
      const isDuplicate = uploadedFiles.some((file) => file.name === originFileObj.name);
      if (!isDuplicate) {
        const updatedFiles = [...uploadedFiles, originFileObj];
        setUploadedFiles(updatedFiles);
        message.success(`${originFileObj.name} uploaded successfully.`);
        setFileUploaded(true); // Mark files as uploaded
      }
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
      setFileUploaded(false); // Reset on error
    }
  };

  // Supported File Types
  const getAllSupportedFileTypes = () => {
    const fileTypes = new Set();
    selectedDocumentTypes.forEach((docType) => {
      CONFIG_JSON[docType].fileTypes.forEach((type) => fileTypes.add(type));
    });
    return Array.from(fileTypes).join(",");
  };

  // Form Submission Handler
  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append("files", file);
      });
      // Append the selected checkbox fields
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("documentTypes", JSON.stringify(selectedDocumentTypes));
      const response = await axios.post("https://ml-qa-cv.go-yubi.in/bank_statement/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Upload Successful");
      setCurrentStep(3); // Move to confirmation step
    } catch (error) {
      message.error("Upload failed");
      console.error(error);
    }
  };

  // Steps Configuration
  const steps = [
    {
      title: "Select Document Types",
      content: (
        <Card title="Choose Document Types">
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Select document types"
            value={selectedDocumentTypes}
            onChange={(values) => {
              setSelectedDocumentTypes(values);
              setUploadedFiles([]);
              setFileUploaded(false); // Reset upload status
            }}
          >
            {Object.keys(CONFIG_JSON).map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </Card>
      ),
    },
    {
      title: "File Upload",
      content: (
        <Card title="File Upload">
          <Upload.Dragger
            name="files"
            multiple
            accept={getAllSupportedFileTypes()}
            onChange={handleFileUpload}
            beforeUpload={() => false}
            disabled={selectedDocumentTypes.length === 0}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">
              {selectedDocumentTypes.length > 0
                ? `Click or drag files for ${selectedDocumentTypes.join(", ")} to upload`
                : "Please select document types first"}
            </p>
          </Upload.Dragger>
          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Title level={5}>Uploaded Files:</Title>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                    padding: 8,
                    backgroundColor: "#F5F5F5",
                    borderRadius: 4,
                  }}
                >
                  <Text>{file.name}</Text>
                  <Text type="secondary">
                    {(file.size / 1024).toFixed(2)} KB
                  </Text>
                </div>
              ))}
            </div>
          )}
        </Card>
      ),
    },
    {
      title: "Enter Details",
      content: (
        <Form form={form} onFinish={handleFormSubmit}>
          {generateDynamicForms()}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={uploadedFiles.length === 0}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Confirmation",
      content: (
        <Card>
          <div style={{ textAlign: "center", padding: 24 }}>
            <CheckCircleOutlined style={{ fontSize: 72, color: "green" }} />
            <Title level={3}>Upload Successful!</Title>
            <Text>Your documents have been processed successfully.</Text>
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      <Steps current={currentStep}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div style={{ marginTop: 24 }}>{steps[currentStep].content}</div>
      {/* Navigation Buttons */}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {currentStep > 0 && currentStep < 3 && (
          <Button onClick={() => setCurrentStep(currentStep - 1)}>Previous</Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => setCurrentStep(currentStep + 1)}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default UnifiedFileUploader;
