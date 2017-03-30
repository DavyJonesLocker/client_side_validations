# frozen_string_literal: true

$LOAD_PATH.unshift(File.expand_path('../../lib', __FILE__))

require 'client_side_validations/version'
require 'coffee_script'
require 'date'
require 'erb'

module ClientSideValidations
  class Processor
    def self.run
      write_file
    end

    def self.root_path
      File.expand_path('../..', __FILE__)
    end

    def self.file_name
      'rails.validations'
    end

    def self.template
      ERB.new(File.open(File.join(root_path, 'coffeescript', "#{file_name}.coffee")).read)
    end

    def self.compiled_coffeescript
      CoffeeScript.compile(template.result(binding))
    end

    def self.write_file
      file = File.new(File.join(root_path, "vendor/assets/javascripts/#{file_name}.js"), 'w')
      file << compiled_coffeescript
      file.close
    end
  end
end
