module ClientSideValidations
  module ActiveRecord
    class Middleware
      def self.class?(klass)
        klass.abstract_class.blank? && klass < ::ActiveRecord::Base
      end

      def self.unique?(klass, attribute, value, params)
        klass      = find_topmost_superclass(klass)
        connection = klass.connection
        column     = klass.columns_hash[attribute.to_s]
        value      = type_cast_value(connection, column, value)

        sql      = sql_statement(klass, connection, attribute, value, params)
        relation = Arel::Nodes::SqlLiteral.new(sql)

        klass.where(relation).empty?
      end

      def self.sql_statement(klass, connection, attribute, value, params)
        sql = []
        t   = klass.arel_table

        if params[:case_sensitive] == 'true'
          sql << 'BINARY' if connection.adapter_name =~ /^mysql/i
          sql << t[attribute].eq(value).to_sql
        else
          escaped_value = value.gsub(/[%_]/, '\\\\\0')
          sql << "#{t[attribute].matches(escaped_value).to_sql} ESCAPE '\\'"
        end

        sql << "AND #{t[klass.primary_key].not_eq(params[:id]).to_sql}" if params[:id]

        (params[:scope] || {}).each do |scope_attribute, scope_value|
          scope_value = type_cast_value(connection, klass.columns_hash[scope_attribute], scope_value)
          sql << "AND #{t[scope_attribute].eq(scope_value).to_sql}"
        end

        sql.join ' '
      end

      def self.type_cast_value(connection, column, value)
        type  = connection.lookup_cast_type_from_column(column)
        value = type.deserialize(value)

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
