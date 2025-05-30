import React, { useEffect, useState } from "react";
import axios from "axios";
import SelectField from "./Components/FormField/SelectField"; // Assuming these components exist
import InputField from "./Components/FormField/InputField"; // Assuming these components exist
import LoadingButton from "./Components/FormField/LoadingButton"; // Assuming these components exist
import AlertComponent from "./Components/Alert"; // Assuming these components exist
import WarningIcon from "./Components/Icons/warning"; // Assuming these components exist
import GreenCheck from "./Components/Icons/GreenCheck"; // Assuming these components exist

const DynamicBillingForm_1 = () => {
  // State to store the dynamic fields fetched from the API
  const [fields, setFields] = useState([]);
  // State to store the current form data (values of all fields)
  const [formData, setFormData] = useState({});
  // State to store validation errors for each field
  const [errors, setErrors] = useState({});
  // State to manage the loading state of the submit button
  const [isLoading, setIsLoading] = useState(false);
  // State to store the form description from the API
  const [formDescription, setFormDescription] = useState("");
  // State to manage the visibility and content of the alert component
  const [showAlert, setShowAlert] = useState({ show: false, type: "", message: "", icon: null });

  // Extract userToken and language from URL query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("userToken");
  const lang = queryParams.get("lang")?.toLowerCase() || "es"; // Default to 'es' if not provided

  // State for the current language, ensuring it's one of the supported ones
  const [language, setLanguage] = useState(lang);
  // State to indicate if the language has been initialized and is ready
  const [languageReady, setLanguageReady] = useState(false);

  // Hardcoded translations for different languages
  const translations = {
    en: {
      required: (field) => `"${field}" is required`,
      invalidFormat: "Invalid format", // Changed from invalidEmail to be more generic
      fixErrors: "Please fix form errors",
      submitSuccess: "Form submitted successfully",
      submitFail: "Something failed! Try again.",
      loadFail: "Failed to load form fields.",
      billingData: "Billing Data",
      saveChanges: "Save changes",
      billingInfoNote:
        "If you want your invoices to be issued in your name or your company's name, please fill out the following information.",
         submitButton: "Submit"
    },
    es: {
      required: (field) => `"${field}" es obligatorio`,
      invalidFormat: "Formato inválido", // Changed from invalidEmail to be more generic
      fixErrors: "Por favor corrige los errores del formulario",
      submitSuccess: "Formulario enviado con éxito",
      submitFail: "Algo falló! Vuelve a intentar de nuevo",
      loadFail: "No se pudo cargar el formulario.",
      billingData: "Datos de facturación",
      saveChanges: "Guardar cambios",
      billingInfoNote:
        "Si quieres que tus facturas se emitan a tu nombre o de una empresa, por favor diligencia la siguiente información.",
        submitButton: "Entregar"
    },
    pt: {
      required: (field) => `"${field}" é obrigatório`,
      invalidFormat: "Formato inválido", // Changed from invalidEmail to be more generic
      fixErrors: "Por favor, corrija os erros do formulário",
      submitSuccess: "Formulário enviado com sucesso",
      submitFail: "Algo falhou! Tente novamente.",
      loadFail: "Falha ao carregar os campos do formulário.",
      billingData: "Dados de faturamento",
      saveChanges: "Salvar alterações",
      billingInfoNote:
        "Se você deseja que suas faturas sejam emitidas em seu nome ou em nome de uma empresa, preencha as informações a seguir.",
          submitButton: "Enviar"
    },
  };

  // Effect to set the language and mark it as ready
  useEffect(() => {
    if (!["en", "es", "pt"].includes(language)) {
      setLanguage("es"); // Fallback to Spanish if an unsupported language is provided
    }
    setLanguageReady(true);
  }, [language]);

  // Effect to fetch form fields from the API once the language is ready
  useEffect(() => {
    if (!languageReady) return; // Wait until language is confirmed

    // Check if a token is present, otherwise show an error
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

        // Set the form description
        setFormDescription(response.data.form_description || "");
        const fieldsData = response.data.fields || [];

        // Process fields data:
        // For SELECT fields, map rule.values to options array for the SelectField component
        fieldsData.forEach((field) => {
          if (field.type === "SELECT" && field.rule?.values?.length) {
            field.options = field.rule.values.map((val) => ({
              value: val.id,
              label: val.description,
            }));
          }
        });

        setFields(fieldsData); // Set the processed fields

        // Initialize form data:
        // Load saved data from localStorage or use default_value from API
        const savedData = JSON.parse(localStorage.getItem("billingFormData")) || {};
        const initialValues = {};

        fieldsData.forEach((field) => {
          // Use saved data, then default_value, then an empty string
          initialValues[field.name] = savedData[field.name] ?? field.default_value ?? "";
        });

        setFormData(initialValues); // Set the initial form data
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
  }, [languageReady, language, token]); // Re-run when language or token changes

  // Handler for input changes, updates formData and triggers validation
  const handleInputChange = (name, value) => {
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);
    localStorage.setItem("billingFormData", JSON.stringify(updatedForm)); // Save to localStorage
    validateField(name, value, updatedForm); // Pass updatedForm to validateField for dependent values
  };

  // Function to validate a single field
  const validateField = (name, value, currentFormData) => {
    const field = fields.find((f) => f.name === name);
    if (!field) return; // If field not found, do nothing

    let errorMsg = "";

    // 1. Check for required fields
    if (field.required && (value === null || value.toString().trim() === "")) {
      errorMsg = translations[language]?.required(field.description);
    }
    // 2. Handle regex validation based on rule.regex_patterns and depends_on
    else if (field.rule?.regex_patterns?.length > 0) {
      let regexToApply = null;

      // Check if the field has dependencies
      if (field.rule.depends_on && field.rule.depends_on.length > 0) {
        // Assuming only one dependency as per the provided example structure
        const dependentFieldName = field.rule.depends_on[0];
        const dependentFieldValue = currentFormData[dependentFieldName]; // Get value from current form data

        // Find the regex pattern that matches the dependent field's value (e.g., "CC", "CE", "NIT")
        const matchingPattern = field.rule.regex_patterns.find(
          (pattern) => pattern.id === dependentFieldValue
        );
        if (matchingPattern) {
          regexToApply = new RegExp(matchingPattern.regex);
        }
      } else {
        // If no dependencies, look for a pattern with id: null (unconditional regex)
        const unconditionalPattern = field.rule.regex_patterns.find(
          (pattern) => pattern.id === null
        );
        if (unconditionalPattern) {
          regexToApply = new RegExp(unconditionalPattern.regex);
        } else if (field.rule.regex_patterns.length > 0) {
          // Fallback: if no 'null' id and patterns exist, use the first one
          regexToApply = new RegExp(field.rule.regex_patterns[0].regex);
        }
      }

      // Apply the determined regex if it exists and the value is not empty
      if (regexToApply && value && !regexToApply.test(value)) {
        errorMsg = translations[language]?.invalidFormat; // Use generic invalid format message
      }
    }

    // Update the errors state for this field
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // Function to validate the entire form
  const isFormValid = () => {
    let valid = true;
    const newErrors = {};

    fields.forEach((field) => {
      const value = formData[field.name] || "";
      let fieldError = ""; // Initialize error for the current field

      // 1. Check for required fields
      if (field.required && (value === null || value.toString().trim() === "")) {
        valid = false;
        fieldError = translations[language]?.required(field.description);
      }
      // 2. Handle regex validation for fields with patterns
      else if (field.rule?.regex_patterns?.length > 0 && value) {
        let regexToApply = null;

        // Determine the correct regex based on dependencies or unconditional patterns
        if (field.rule.depends_on && field.rule.depends_on.length > 0) {
          const dependentFieldName = field.rule.depends_on[0];
          const dependentFieldValue = formData[dependentFieldName];
          const matchingPattern = field.rule.regex_patterns.find(
            (pattern) => pattern.id === dependentFieldValue
          );
          if (matchingPattern) {
            regexToApply = new RegExp(matchingPattern.regex);
          }
        } else {
          const unconditionalPattern = field.rule.regex_patterns.find(
            (pattern) => pattern.id === null
          );
          if (unconditionalPattern) {
            regexToApply = new RegExp(unconditionalPattern.regex);
          } else if (field.rule.regex_patterns.length > 0) {
            regexToApply = new RegExp(field.rule.regex_patterns[0].regex);
          }
        }

        // Apply the regex
        if (regexToApply && !regexToApply.test(value)) {
          valid = false;
          fieldError = translations[language]?.invalidFormat;
        }
      }

      // If an error was found for this field, add it to newErrors
      if (fieldError) {
        newErrors[field.name] = fieldError;
      }
    });

    setErrors(newErrors); // Update the overall errors state
    return valid; // Return overall form validity
  };

  // Handler for form submission
  const handleSubmit = async () => {
    // First, validate the entire form
    if (!isFormValid()) {
      setShowAlert({
        show: true,
        type: "error",
        message: translations[language]?.fixErrors,
        icon: <WarningIcon />,
      });
      return; // Stop if form is not valid
    }

    setIsLoading(true); // Show loading indicator

    // Prepare the payload for the API request
    const payload = {
      fields: Object.keys(formData).map((key) => ({
        name: key,
        current_value: formData[key],
      })),
    };

    try {
      // Send the form data to the API
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

      // Show success alert on successful submission
      setShowAlert({
        show: true,
        type: "success",
        message: translations[language]?.submitSuccess,
        icon: <GreenCheck />,
      });

      setErrors({}); // Clear any existing errors
    } catch (err) {
      console.error("❌ Submit Error:", err);
      // Show error alert on submission failure
      setShowAlert({
        show: true,
        type: "error",
        message: translations[language]?.submitFail,
        icon: <WarningIcon />,
      });
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="px-4 pt-7 pb-20">
      {/* Page Title */}
      <h3 className="text-lg font-medium text-black">
        {translations[language]?.billingData}
      </h3>
      {/* Form Description */}
      <p className="text-sm py-4 text-[#919AAA] leading-5">
        {formDescription}
      </p>

      <form>
        {/* Dynamically render form fields based on API response */}
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
          return null; // Don't render if type is not supported
        })}

        {/* Alert component for messages */}
        {showAlert.show && (
          <AlertComponent
            type={showAlert.type}
            message={showAlert.message}
            icon={showAlert.icon}
            // Add a mechanism to close the alert if needed, e.g., onClose={() => setShowAlert({ ...showAlert, show: false })}
          />
        )}

        {/* Submit button */}
        <LoadingButton
          text={translations[language]?.saveChanges}
          isLoading={isLoading}
          onClick={handleSubmit}
          BtnTranslations={translations[language]?.submitButton}        />
      </form>
    </div>
  );
};

export default DynamicBillingForm_1;
