import validateSchema from "./validateSchema";
import { set } from "lodash-es";

export default function validationSchema(formObject = {}, tests = []) {
  let errors = {};

  Object.keys(formObject).forEach((formObjectKey) => {
    const formObjectValue = formObject[formObjectKey];

    // If the value is an array
    if (Array.isArray(formObjectValue)) {
      // Loop over array
      formObjectValue.forEach((childObject, i) => {
        // Loop over each key in the childObject
        Object.keys(childObject).forEach((childObjectKey) => {
          const childObjectValue = childObject[childObjectKey];
          // Loop through tests array
          tests.forEach((test) => {
            try {
              // If the test attribute matches the childObjectKey...
              if (test.attribute === childObjectKey) {
                // Perform validation on childObjectValue
                const result = validateSchema(
                  childObjectValue,
                  test.validators
                );
                if (result !== "") {
                  set(errors, [formObjectKey, i, childObjectKey], result);
                }
              }
            } catch (err) {
              console.log(
                `Validation error in ${formObjectKey}[${i}].${childObjectKey}: ${childObjectValue}`,
                err
              );
            }
          });
        });
      });
    } else {
      tests.forEach((test) => {
        try {
          if (test.attribute === formObjectKey) {
            const result = validateSchema(formObjectValue, test.validators);
            if (result !== "") {
              errors[formObjectKey] = result;
            }
          }
        } catch (err) {
          console.log(
            `Validation error in ${formObjectKey}: ${formObjectValue}`,
            err
          );
        }
      });
    }
  });

  return errors;
}
