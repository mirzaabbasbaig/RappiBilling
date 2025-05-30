import React, { useEffect, useState } from "react";
import axios from "axios";
import SelectField from "./Components/FormField/SelectField";
import InputField from "./Components/FormField/InputField";
import LoadingButton from "./Components/FormField/LoadingButton";
import AlertComponent from "./Components/Alert";
import WarningIcon from "./Components/Icons/warning";
import GreenCheck from "./Components/Icons/GreenCheck";

const DynamicBillingForm_1 = () => {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formDescription, setFormDescription] = useState("");
  const [showAlert, setShowAlert] = useState({ show: false, type: "", message: "", icon: null });

  // Get query parameters from URL
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("userToken");
  const lang = queryParams.get("lang")?.toLowerCase() || "es";

  const [language, setLanguage] = useState(lang);
  const [languageReady, setLanguageReady] = useState(false);

  const translations = {
    en: {
      required: (field) => `"${field}" is required`,
      invalidEmail: "Invalid format",
      fixErrors: "Please fix form errors",
      submitSuccess: "Form submitted successfully",
      submitFail: "Something failed! Try again.",
      loadFail: "Failed to load form fields.",
      billingData: "Billing Data",
      saveChanges: "Save changes",
      billingInfoNote:
        "If you want your invoices to be issued in your name or your company's name, please fill out the following information.",
    },
    es: {
      required: (field) => `"${field}" es obligatorio`,
      invalidEmail: "Formato inválido",
      fixErrors: "Por favor corrige los errores del formulario",
      submitSuccess: "Formulario enviado con éxito",
      submitFail: "Algo falló! Vuelve a intentar de nuevo",
      loadFail: "No se pudo cargar el formulario.",
      billingData: "Datos de facturación",
      saveChanges: "Guardar cambios",
      billingInfoNote:
        "Si quieres que tus facturas se emitan a tu nombre o de una empresa, por favor diligencia la siguiente información.",
    },
    pt: {
      required: (field) => `"${field}" é obrigatório`,
      invalidEmail: "Formato inválido",
      fixErrors: "Por favor, corrija os erros do formulário",
      submitSuccess: "Formulário enviado com sucesso",
      submitFail: "Algo falhou! Tente novamente.",
      loadFail: "Falha ao carregar os campos do formulário.",
      billingData: "Dados de faturamento",
      saveChanges: "Salvar alterações",
      billingInfoNote:
        "Se você deseja que suas faturas sejam emitidas em seu nome ou em nome de uma empresa, preencha as informações a seguir.",
    },
  };

  useEffect(() => {
    if (!["en", "es", "pt"].includes(language)) {
      setLanguage("es");
    }
    setLanguageReady(true);
  }, [language]);

  useEffect(() => {
    if (!languageReady) return;

    if (!token) {
      setShowAlert({
        show: true,
        type: "error",
        message: translations[language]?.loadFail || "Failed to load form fields.",
        icon: <WarningIcon />,
      });
      return;
    }

   const fetchFields = async () => {
  try {
    const response = await axios.get(
      "https://microservices.dev.rappi.com/api/consumer-bill/users/metadata",
      {
        headers: {
          Authorization: decodeURIComponent(token),
          "Content-Type": "application/json",
          "Accept-Language": language,
        },
      }
    );

    setFormDescription(response.data.form_description || "");
    const fieldsData = response.data.fields || [];

    // 👇 Convert rule.values to options for SELECT fields
    fieldsData.forEach((field) => {
      if (field.type === "SELECT" && field.rule?.values?.length) {
        field.options = field.rule.values.map((val) => ({
          value: val.id,
          label: val.description,
        }));
      }
    });

    setFields(fieldsData);

    const savedData = JSON.parse(localStorage.getItem("billingFormData")) || {};
    const initialValues = {};

    fieldsData.forEach((field) => {
      initialValues[field.name] = savedData[field.name] ?? field.default_value ?? "";
    });

    setFormData(initialValues);
  } catch (error) {
    console.error("❌ Error fetching metadata:", error);
    setShowAlert({
      show: true,
      type: "error",
      message: translations[language]?.loadFail || "Failed to load form fields.",
      icon: <WarningIcon />,
    });
  }
};


    fetchFields();
  }, [languageReady, language, token]);

  const handleInputChange = (name, value) => {
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);
    localStorage.setItem("billingFormData", JSON.stringify(updatedForm));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const field = fields.find((f) => f.name === name);
    if (!field || !field.required) return;

    let errorMsg = "";

    if (value.trim() === "") {
      errorMsg = translations[language]?.required(field.description);
    }

    if (field.name === "billing_mail" && value) {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!isValid) errorMsg = translations[language]?.invalidEmail;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const isFormValid = () => {
    let valid = true;
    const newErrors = {};

    fields.forEach((field) => {
      const value = formData[field.name] || "";
      if (field.required && value.trim() === "") {
        valid = false;
        newErrors[field.name] = translations[language]?.required(field.description);
      }
      if (field.name === "billing_mail" && value) {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!isValid) {
          valid = false;
          newErrors[field.name] = translations[language]?.invalidEmail;
        }
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setShowAlert({
        show: true,
        type: "error",
        message: translations[language]?.fixErrors,
        icon: <WarningIcon />,
      });
      return;
    }

    setIsLoading(true);

    const payload = {
      fields: Object.keys(formData).map((key) => ({
        name: key,
        current_value: formData[key],
      })),
    };

    try {
      const res = await axios.post(
        "https://microservices.dev.rappi.com/api/consumer-bill/users/metadata",
        payload,
        {
          headers: {
            Authorization: decodeURIComponent(token),
            "Content-Type": "application/json",
            "Accept-Language": language,
          },
        }
      );

      console.log("✅ Submit Success:", res.data);
      setShowAlert({
        show: true,
        type: "success",
        message: translations[language]?.submitSuccess,
        icon: <GreenCheck />,
      });

      setErrors({});
    } catch (err) {
      console.error("❌ Submit Error:", err);
      setShowAlert({
        show: true,
        type: "error",
        message: translations[language]?.submitFail,
        icon: <WarningIcon />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 pt-7 pb-20">
      <h3 className="text-lg font-medium text-black">
        {translations[language]?.billingData}
      </h3>
      <p className="text-sm py-4 text-[#919AAA] leading-5">
        {formDescription}
      </p>

      <form>
        {fields.map((field) => {
          if (field.type === "STRING") {
            return (
              <div key={field.name} className="mb-5">
                <InputField
                  label={field.description}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                />
                {errors[field.name] && (
                  <p className="text-xs text-red-500">{errors[field.name]}</p>
                )}
              </div>
            );
          } else if (field.type === "SELECT") {
            return (
              <div key={field.name} className="mb-5">
                <SelectField
                  label={field.description}
                  options={field.options || []}
                  value={formData[field.name] || ""}
                  onChange={(value) => handleInputChange(field.name, value)}
                />
                {errors[field.name] && (
                  <p className="text-xs text-red-500">{errors[field.name]}</p>
                )}
              </div>
            );
          }
          return null;
        })}

        {showAlert.show && (
          <AlertComponent
            type={showAlert.type}
            message={showAlert.message}
            icon={showAlert.icon}
          />
        )}

        <LoadingButton
          text={translations[language]?.saveChanges}
          isLoading={isLoading}
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
};

export default DynamicBillingForm_1;
