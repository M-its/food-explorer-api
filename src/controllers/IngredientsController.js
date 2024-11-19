const knex = require("../database/knex")

class IngredientsController {
    async index(req, res) {
        const { name } = req.query

        let ingredients

        if (name) {
            ingredients = await knex("ingredients")
                .select("name")
                .distinct()
                .whereRaw("LOWER(name) LIKE LOWER(?)", [`%${name}%`])
                .orderBy("name")
        } else {
            ingredients = await knex("ingredients")
                .select("name")
                .distinct()
                .orderBy("name")
        }

        return res.json(ingredients)
    }
}

module.exports = IngredientsController
