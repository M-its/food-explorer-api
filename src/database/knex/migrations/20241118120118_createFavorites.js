exports.up = (knex) =>
    knex.schema.createTable("favorites", (table) => {
        table.increments("id")
        table
            .integer("dish_id")
            .references("id")
            .inTable("dishes")
            .onDelete("CASCADE")
        table.integer("user_id").references("id").inTable("users")
    })

exports.down = (knex) => knex.schema.dropTable("dishes")
