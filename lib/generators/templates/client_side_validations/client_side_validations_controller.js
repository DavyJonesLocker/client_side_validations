// Thin Stimulus controller registration for client_side_validations.
//
// If your project uses `eagerLoadControllersFrom('controllers', application)`
// (the default scaffolded by stimulus-rails), importing the controller from
// this file is enough to register it with the identifier inferred from the
// filename (`client-side-validations`). Otherwise register it manually:
//
//   import { Application } from '@hotwired/stimulus'
//   import { ClientSideValidationsController } from '@client-side-validations/client-side-validations'
//   const application = Application.start()
//   application.register('client-side-validations', ClientSideValidationsController)

import { ClientSideValidationsController } from '@client-side-validations/client-side-validations'

export default ClientSideValidationsController
