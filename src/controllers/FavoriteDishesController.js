const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class FavoriteDishesController {
    async create(req, res) {
        const user_id = req.user.id
        const { dish_id } = req.params

        const dish = await knex("dishes").where({ id: dish_id }).first()
        const checkFavoriteExists = await knex("favorites").where({
            user_id,
            dish_id,
        })

        if (!dish) {
            throw new AppError("Dish not found")
        }

        if (checkFavoriteExists.length > 0) {
            throw new AppError("Dish Already Added to favorites")
        }

        await knex("favorites").insert({
            user_id,
            dish_id,
        })

        return res.status(201).json()
    }

    async delete(req, res) {
        const { id } = req.params

        await knex("favorites").where({ id }).delete()

        return res.json()
    }

    async show(req, res) {
        const user_id = req.user.id
        const { id } = req.params

        const favorite = await knex("favorites").where({ id, user_id }).first()

        if (!favorite) {
            throw new AppError("Favorite not found")
        }

        const dish = await knex("dishes")
            .where({ id: favorite.dish_id })
            .first()

        return res.json({
            ...favorite,
            dish,
        })
    }

    async index(req, res) {}
}

module.exports = FavoriteDishesController
