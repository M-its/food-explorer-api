const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const DiskStorage = require("../providers/diskstorage")

class DishesController {
    async create(req, res) {
        const { title, category, description, price } = req.body
        const ingredients = JSON.parse(req.body.ingredients)
        const dishImageFilename = req.file.filename

        const diskStorage = new DiskStorage()

        if (!title || !description || !category || !price || !ingredients) {
            throw new AppError("All fields are required")
        }

        const filename = await diskStorage.saveFile(dishImageFilename)

        const [dish_id] = await knex("dishes").insert({
            title,
            category,
            description,
            price,
            image: filename,
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

    async show(req, res) {
        const { id } = req.params

        const dish = await knex("dishes").where({ id }).first()

        if (!dish) {
            throw new AppError("Dish not found")
        }

        const ingredients = await knex("ingredients")
            .where({ dish_id: id })
            .orderBy("name")

        return res.json({
            ...dish,
            ingredients,
        })
    }

    async update(req, res) {
        const { title, category, description, price } = req.body
        const { id } = req.params
        const ingredients = JSON.parse(req.body.ingredients)
        const dishImageFilename = req.file ? req.file.filename : null

        const diskStorage = new DiskStorage()

        const dish = await knex("dishes").where({ id }).first()

        if (!dish) {
            throw new AppError("Dish not found")
        }

        if (dishImageFilename) {
            if (dish.image) {
                await diskStorage.deleteFile(dish.image)
            }
            const filename = await diskStorage.saveFile(dishImageFilename)
            dish.image = filename
        }

        dish.title = title ?? dish.title
        dish.category = category ?? dish.category
        dish.description = description ?? dish.description
        dish.price = price ?? dish.price

        await knex("ingredients").where({ dish_id: id }).delete()

        const ingredientsInsert = ingredients.map((ingredient) => {
            return {
                dish_id: id,
                name: ingredient,
            }
        })

        await knex("ingredients").insert(ingredientsInsert)
        await knex("dishes").update(dish).where({ id })

        return res.json()
    }

    async delete(req, res) {
        const { id } = req.params

        await knex("dishes").where({ id }).delete()

        return res.json()
    }

    async index(req, res) {
        const { title, image, category, ingredients } = req.query

        let dishes

        if (ingredients) {
            const filterIngredients = ingredients
                .split(",")
                .map((ingredient) => ingredient.trim().toLowerCase())

            dishes = await knex("dishes")
                .select(
                    "dishes.id",
                    "dishes.image",
                    "dishes.title",
                    "dishes.description",
                    "dishes.price",
                    "dishes.category"
                )
                .distinct()
                .join("ingredients", "dishes.id", "ingredients.dish_id")
                .whereRaw("LOWER(ingredients.name) IN (?)", filterIngredients)
                .orderBy("dishes.category")
                .orderBy("dishes.title")
        } else if (title) {
            dishes = await knex("dishes")
                .select(
                    "id",
                    "image",
                    "title",
                    "description",
                    "price",
                    "category"
                )
                .whereRaw("LOWER(title) LIKE LOWER(?)", [`%${title}%`])
                .orderBy("category")
                .orderBy("title")
        } else if (category) {
            dishes = await knex("dishes")
                .select(
                    "id",
                    "image",
                    "title",
                    "description",
                    "price",
                    "category"
                )
                .whereRaw("LOWER(category) LIKE LOWER(?)", [`%${category}%`])
                .orderBy("category")
                .orderBy("title")
        } else {
            dishes = await knex("dishes")
                .select("title", "image", "description", "price", "category")
                .orderBy("category")
                .orderBy("title")
        }

        return res.json(dishes)
    }
}

module.exports = DishesController
