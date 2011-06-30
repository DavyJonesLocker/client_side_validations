module ClientSideValidations
  class Engine < ::Rails::Engine
    config.app_middleware.use ClientSideValidations::Middleware::Validators
  end
end

