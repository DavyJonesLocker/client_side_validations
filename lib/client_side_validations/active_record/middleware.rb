module ClientSideValidations::ActiveRecord
  class Middleware

    def self.is_unique?(klass, attribute, value, params)
      column = klass.columns_hash[attribute.to_s]
      value = column.limit ? value.to_s.mb_chars[0, column.limit] : value.to_s if column.text?

      t = klass.arel_table

      if params[:case_sensitive] == 'true'
        if t.engine.connection.instance_variable_get("@config")[:adapter] == 'mysql'
          relation = Arel::Nodes::SqlLiteral.new("BINARY #{t[attribute].eq(value).to_sql}")
        else
          relation = t[attribute].eq(value)
        end
      else
        relation = t[attribute].matches(value)
      end

      relation = relation.and(t.primary_key.not_eq(params[:id])) if params[:id]

      (params[:scope] || {}).each do |key, value|
        relation = relation.and(t[key].eq(value))
      end

      !klass.where(relation).exists?
    end
  end
end
