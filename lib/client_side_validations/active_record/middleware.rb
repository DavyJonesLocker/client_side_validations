module ClientSideValidations::ActiveRecord
  class Middleware

    def self.is_class?(klass)
      klass.abstract_class.blank? && klass < ::ActiveRecord::Base
    end

    def self.is_unique?(klass, attribute, value, params)
      klass = find_topmost_superclass(klass)
      value = type_cast_value(klass, attribute, value)
      column = klass.columns_hash[attribute.to_s]
      value = column.limit ? value.to_s.mb_chars[0, column.limit] : value.to_s if column.text?

      t = klass.arel_table

      sql = []
      if params[:case_sensitive] == 'true'
        sql << 'BINARY' if t.engine.connection.adapter_name =~ /^mysql/i
        sql << t[attribute].eq(value).to_sql
      else
        escaped_value = value.gsub(/[%_]/, '\\\\\0')
        sql << "#{t[attribute].matches(escaped_value).to_sql} ESCAPE '\\'"
      end

      sql << "AND #{t[klass.primary_key].not_eq(params[:id]).to_sql}" if params[:id]

      (params[:scope] || {}).each do |attribute, value|
        value = type_cast_value(klass, attribute, value)
        sql << "AND #{t[attribute].eq(value).to_sql}"
      end

      relation = Arel::Nodes::SqlLiteral.new(sql.join(' '))
      !klass.where(relation).exists?
    end

    private

    def self.type_cast_value(klass, attribute, value)
      klass.columns_hash[attribute].type_cast(value)
    end

    def self.find_topmost_superclass(klass)
      if is_class?(klass.superclass)
        find_topmost_superclass(klass.superclass)
      else
        klass
      end
    end

  end
end
