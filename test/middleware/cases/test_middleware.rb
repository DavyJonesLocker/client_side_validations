require 'middleware/cases/helper'

class ClientSideValidationsMiddleWareTest < Test::Unit::TestCase
  def test_if_middleware_is_auto_included
    assert Rails.configuration.middleware.include?(ClientSideValidations::Middleware::Validators)
  end
end

