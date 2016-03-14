module ClientSideValidations
  module ActiveRecord
    class Middleware
      def self.class?(klass)
        klass.abstract_class.blank? && klass < ::ActiveRecord::Base
      end

      def self.unique?(klass, attribute, value, params)
        klass  = find_topmost_superclass(klass)
        column = klass.columns_hash[attribute.to_s]
        value  = type_cast_value(column, value)

        sql      = sql_statement(klass, attribute, value, params)
        relation = Arel::Nodes::SqlLiteral.new(sql)

        klass.where(relation).empty?
      end

      def self.sql_statement(klass, attribute, value, params)
        sql = []
        t   = klass.arel_table

        if params[:case_sensitive] == 'true'
          sql << 'BINARY' if t.engine.connection.adapter_name =~ /^mysql/i
          sql << t[attribute].eq(value).to_sql
        else
          escaped_value = value.gsub(/[%_]/, '\\\\\0')
          sql << "#{t[attribute].matches(escaped_value).to_sql} ESCAPE '\\'"
        end

        sql << "AND #{t[klass.primary_key].not_eq(params[:id]).to_sql}" if params[:id]

        (params[:scope] || {}).each do |scope_attribute, scope_value|
          scope_value = type_cast_value(klass.columns_hash[scope_attribute], scope_value)
          sql << "AND #{t[scope_attribute].eq(scope_value).to_sql}"
        end

        sql.join ' '
      end

      def self.type_cast_value(column, value)
        value =
          if column.respond_to?(:type_cast)
            column.type_cast(value)
          else
            column.type_cast_from_database(value)
          end

        if column.limit && value.is_a?(String)
          value.mb_chars[0, column.limit]
        else
          value
        end
      end

      def self.find_topmost_superclass(klass)
        if class?(klass.superclass)
          find_topmost_superclass(klass.superclass)
        else
          klass
        end
      end
    end
  end
end
