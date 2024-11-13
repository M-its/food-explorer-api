const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class DishesController {
    async create(req, res) {
        const { title, category, description, ingredients, price } = req.body
        const imageFilename = null

        if (!title || !description || !category || !price || !ingredients) {
            throw new AppError("All fields are required")
        }

        const [dish_id] = await knex("dishes").insert({
            title,
            category,
            description,
            price,
            image: imageFilename,
        })

        const ingredientsInsert = ingredients.map((ingredient) => {
            return {
                dish_id,
                name: ingredient,
            }
        })

        await knex("ingredients").insert(ingredientsInsert)

        return res.status(201).json()
    }

    async show() {}
    async update() {}
    async delete() {}
    async index() {}
}

module.exports = DishesController
