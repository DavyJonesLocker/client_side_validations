import ClientSideValidations from "./ClientSideValidations";

const validation = (value = "", validations = []) => {
  const clientSideValidations = new ClientSideValidations();

  // Save responses
  const responses = [];

  // Convert value to string
  const strValue = typeof value === "number" ? `${value}` : value;

  // Validate each option
  validations.forEach(({ name, options }) => {
    const parsedOptions = options.map((option) =>
      typeof option === "string" ? JSON.parse(option) : option
    );
    parsedOptions.forEach((options) => {
      const result = clientSideValidations[name](strValue, options) || null;
      if (result) {
        responses.push(result);
      }
    });
  });

  if (responses.length) {
    // Format response string
    let formattedResponse = "";
    formattedResponse = "";
    responses.forEach((response, i) => {
      formattedResponse = i ? formattedResponse + ", " + response : response;
    });
    formattedResponse =
      formattedResponse.charAt(0).toUpperCase() +
      formattedResponse.slice(1) +
      ".";

    // Fail validation
    return formattedResponse;
  } else {
    // Pass validation
    return "";
  }
};

export default validation;
