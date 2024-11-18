const knex = require("../database/knex")

class FavoriteDishesController {
    async create(req, res) {
        const user_id = req.user.id
        const { dish_id } = req.params

        await knex("favorites").insert({
            user_id,
            dish_id,
        })

        return res.status(201).json()
    }

    async delete(req, res) {}

    async show(req, res) {}

    async index(req, res) {}
}

module.exports = FavoriteDishesController
