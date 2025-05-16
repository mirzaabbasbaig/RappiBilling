import React, { useState, useEffect } from "react";
import BackToScreen from "../../Components/Icons/backToScreen";
import SelectField from "../../Components/FormField/SelectField";
import Spacer from "../../Components/Spacer";
import InputField from "../../Components/FormField/InputField";
import LoadingButton from "../../Components/FormField/LoadingButton";
import AlertComponent from "../../Components/Alert";
import WarningIcon from "../../Components/Icons/warning";
import axios from "axios";
import GreenCheck from "../../Components/Icons/GreenCheck";

const BillingInformation = () => {
  const [showAlert, setShowAlert] = useState({ show: false, type: "error", message: "", icon: false });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    invoiceType: "default",
    identificationType: "",
    businessName: "",
    nitNumber: "",
    email: "",
  });

  useEffect(() => {
    const savedData = localStorage.getItem("billingFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updatedForm = { ...prev, [field]: value };
      console.log("Updating FormData:", updatedForm);
      localStorage.setItem("billingFormData", JSON.stringify(updatedForm));
      return updatedForm;
    });
    validateField(field, value);
  };

  const validateField = (field, value) => {
    let errorMsg = "";
    switch (field) {
      case "email":
        errorMsg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Invalid email format.";
        break;
      case "businessName":
        errorMsg = value.trim() === "" ? "Business name is required." : "";
        break;
      case "nitNumber":
        errorMsg = /^[0-9.-]+$/.test(value) ? "" : "Only numbers, dots, and hyphens are allowed.";
        break;
      case "identificationType":
        errorMsg = value ? "" : "Please select an identification type.";
        break;
      default:
        errorMsg = "";
    }
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const isFormValid =
    formData.businessName &&
    formData.identificationType &&
    formData.nitNumber &&
    formData.email &&
    Object.values(errors).every((error) => error === "");

  const handleSubmit = async () => {
    // Validate all fields before submission
    Object.keys(formData).forEach((field) => validateField(field, formData[field]));

    if (!isFormValid) {
      setShowAlert({ show: true, type: "error", message: "Please fill all fields!", icon: <WarningIcon /> });
      return;
    }

    setIsLoading(true);
    const token = "100.gAAAAABn-Cmn2wZu1KjC06baO1A2heX-epYEMCd37LdH06CNNPIqIckDUNfRGPqt_lTrn3aF1G-NgFoeG7GVKgOCkvLs5FwEF-a3B7JEKhOjB6qFTeTpO4uUmIDfh6F_gyIhMLfqwX0yGQjN76bVH10psJTnl4258nWVurJe6Jp1TmRHim3jZu2ekTk6TUHBbFY2kLH0t1dhypgg898VT1Iz4zUiG5P__dQvwiwYpWHOAKlhxgzHcGqDwln4k6_okY_sQwhMSYfoERGtZhH1_nenwTNGAYfRSvffWq7IzkVMfewFG7lXuHAAw__IskoXkF8G6vDeO-6GWcnWpENUVZjnTjCufvFPKwM0gfYCMDS-Feej9qUr6fDbqxtq3Ku2rQc1wB7KXFr4ZHQ5WziJWqjBDn2mVGL0KA==";

    try {
      const response = await axios.post(
        "https://microservices.dev.rappi.com/api/consumer-bill/users/metadata",
        { fields: Object.keys(formData).map((key) => ({ name: key, current_value: formData[key] })) },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      console.log("✅ Response:", response.data);
      setShowAlert({ show: true, type: "success", message: "Billing info saved successfully!", icon: <GreenCheck /> });
      localStorage.removeItem("billingFormData");

      setFormData({
        invoiceType: "default",
        identificationType: "",
        businessName: "",
        nitNumber: "",
        email: "",
      });
    } catch (error) {
      console.error("❌ Error:", error);
      setShowAlert({ show: true, type: "error", message: "Oops, something went wrong. Please try again.", icon: <WarningIcon /> });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showAlert.show) {
      const timer = setTimeout(() => {
        setShowAlert({ show: false, type: "", message: "", icon: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <div className="px-4 pt-7 pb-20">
      <div className="flex gap-3.5 items-center">
        <BackToScreen />
        <h3 className="text-lg text-black font-medium">Billing information</h3>
      </div>

      <p className="text-sm py-4 text-[#919AAA] leading-5">
        Please fill in the following information to receive your invoice.
      </p>

      <form>
        <SelectField
          label="Invoice type"
          disabled={true}
          value={formData.invoiceType}
          onChange={(val) => handleInputChange("invoiceType", val)}
        />
        <Spacer height="20px" />

        <SelectField
          label="Type of identification"
          value={formData.identificationType}
          onChange={(val) => {
            console.log("Updated identificationType:", val);
            handleInputChange("identificationType", val);
          }}
          options={[
           
            { value: "nit", label: "NIT" },
            { value: "national_id", label: "National ID Card" },
            { value: "foreign_id", label: "Foreign ID Card" },
          ]}
        />
        {errors.identificationType && <p className="text-red-500 text-xs">{errors.identificationType}</p>}
        <Spacer height="20px" />

        <InputField
          label={formData.identificationType !== "nit" ? "Full name" : "Business name"}
          placeholder={formData.identificationType !== "nit" ? "E.g. John Doe" : "E.g. ABC Ltd."}
          value={formData.businessName}
          onChange={(e) => handleInputChange("businessName", e.target.value)}
        />
        {errors.businessName && <p className="text-red-500 text-xs">{errors.businessName}</p>}
        <Spacer height="20px" />

        <InputField
          label="NIT number"
          placeholder="E.g. 000.123.456-7"
          value={formData.nitNumber}
          onChange={(e) => handleInputChange("nitNumber", e.target.value)}
        />
        {errors.nitNumber && <p className="text-red-500 text-xs">{errors.nitNumber}</p>}
        <Spacer height="20px" />

        <InputField
          label="Email address"
          placeholder="E.g. email@company.com"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        <Spacer height="30px" />

        <LoadingButton
          BtnText="Save changes"
          onClick={handleSubmit}
          disabled={isLoading}
          isLoading={isLoading}
        />
      </form>

      <AlertComponent
        show={showAlert.show}
        message={showAlert.message}
        type={showAlert.type}
        icon={showAlert.icon}
        onClose={() => setShowAlert({ show: false, type: "", message: "", icon: false })}
      />
    </div>
  );
};

export default BillingInformation;
