import ClientSideValidations from './core'
import ClientSideValidationsController from './controllers/client_side_validations_controller'

import { isValid, validateElement, validateForm, validatorsFor } from './validate'

import { absenceLocalValidator, presenceLocalValidator } from './validators/local/absence_presence'
import { acceptanceLocalValidator } from './validators/local/acceptance'
import { confirmationLocalValidator } from './validators/local/confirmation'
import { exclusionLocalValidator, inclusionLocalValidator } from './validators/local/exclusion_inclusion'
import { formatLocalValidator } from './validators/local/format'
import { lengthLocalValidator } from './validators/local/length'
import { numericalityLocalValidator } from './validators/local/numericality'
import { uniquenessLocalValidator } from './validators/local/uniqueness'

// Validators run in this order
ClientSideValidations.validators.local = {
  absence: absenceLocalValidator,
  presence: presenceLocalValidator,
  acceptance: acceptanceLocalValidator,
  format: formatLocalValidator,
  numericality: numericalityLocalValidator,
  length: lengthLocalValidator,
  inclusion: inclusionLocalValidator,
  exclusion: exclusionLocalValidator,
  confirmation: confirmationLocalValidator,
  uniqueness: uniquenessLocalValidator
}

ClientSideValidations.isValid = isValid

export const register = (application, identifier = 'client-side-validations') => {
  application.register(identifier, ClientSideValidationsController)
}

export {
  ClientSideValidations,
  ClientSideValidationsController,
  isValid,
  validateElement,
  validateForm,
  validatorsFor
}

export default ClientSideValidations
