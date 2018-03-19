# frozen_string_literal: true

$LOAD_PATH.unshift File.expand_path(__dir__)
require 'server'
run Sinatra::Application
