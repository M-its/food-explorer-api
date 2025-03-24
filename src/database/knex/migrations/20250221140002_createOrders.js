exports.up = (knex) =>
    knex.schema.createTable("orders", (table) => {
        table.increments("id")
        table
            .integer("user_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE")
        table.text("status").notNullable().default("pending")
        table.decimal("total_price", 10, 2).notNullable()
        table.text("payment_method").notNullable()

        table.timestamp("created_at").default(knex.fn.now())
        table.timestamp("updated_at").default(knex.fn.now())
    })

exports.down = (knex) => knex.schema.dropTable("orders")
