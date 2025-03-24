const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const DiskStorage = require("../providers/diskstorage")

class OrdersController {
    async create(req, res) {
        const user_id = req.user.id
        const { items, total_price, payment_method, status } = req.body

        console.log(total_price)

        let calculateTotal = 0

        for (const item of items) {
            const dish = await knex("dishes")
                .where({ id: item.dish_id })
                .first()

            if (!dish) {
                throw new AppError(`Prato não encontrado`)
            }

            if (item.quantity <= 0) {
                throw new AppError("A quantidade precisa ser meior do que 1")
            }

            const expectedPrice = Number(
                (dish.price * item.quantity).toFixed(2)
            )
            calculateTotal += expectedPrice
        }

        if (Number(total_price) !== calculateTotal) {
            throw new AppError(
                `Preço total inválido. Esperado ${calculateTotal}. Recebido ${total_price}`
            )
        }

        const [order_id] = await knex("orders").insert({
            user_id,
            total_price: calculateTotal,
            payment_method,
            status,
        })

        const orderItems = items.map((item) => ({
            order_id,
            dish_id: item.dish_id,
            quantity: item.quantity,
            price: item.price,
        }))

        await knex("order_items").insert(orderItems)
        return res.json({ order_id })
    }

    async index(req, res) {
        const user_id = req.user.id
        const user_role = req.user.role
        const page = req.query.page || 1
        const limit = 5
        const offset = (page - 1) * limit

        let ordersQuery = knex("orders").orderBy("created_at", "desc")

        if (user_role !== "admin") {
            ordersQuery = ordersQuery.where({ user_id })
        }

        const [count] = await ordersQuery.clone().count("* as total")
        const totalPages = Math.ceil(count.total / limit)

        const orders = await ordersQuery.limit(limit).offset(offset)

        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const items = await knex("order_items")
                    .where({ order_id: order.id })
                    .join("dishes", "dishes.id", "order_items.dish_id")
                    .select(
                        "dishes.*",
                        "order_items.quantity",
                        "order_items.price"
                    )

                return {
                    ...order,
                    items,
                }
            })
        )

        return res.json({
            data: ordersWithItems,
            meta: {
                total: count.total,
                page: parseInt(page),
                totalPages,
            },
        })
    }

    async show(req, res) {
        const { id } = req.params
        const user_id = req.user.id

        const order = await knex("orders").where({ id, user_id }).first()

        if (!order) {
            throw new AppError("Order not found", 404)
        }

        const items = await knex("order_items")
            .where({ order_id: id })
            .join("dishes", "dishes.id", "order_items.dish_id")
            .select("dishes.*", "order_items.quantity", "order_items.price")

        return res.json({ ...order, items })
    }

    async update(req, res) {
        const { id } = req.params
        const user_id = req.user.id
        const { items, total_price, payment_method, status } = req.body

        console.log(total_price)

        const order = await knex("orders").where({ id, user_id }).first()

        if (!order) {
            throw new AppError("Order not found", 404)
        }

        let calculateTotal = 0

        if (items) {
            for (const item of items) {
                const dish = await knex("dishes")
                    .where({ id: item.dish_id })
                    .first()

                if (!dish) {
                    throw new AppError(`Dish not found`)
                }

                if (item.quantity <= 0) {
                    throw new AppError("Quantity must be greater than 0")
                }

                const expectedPrice = Number(
                    (dish.price * item.quantity).toFixed(2)
                )
                calculateTotal += expectedPrice
            }

            if (Number(total_price) !== calculateTotal) {
                throw new AppError(
                    `Invalid total price. Expected ${calculateTotal}`
                )
            }

            await knex("order_items").where({ order_id: id }).delete()

            const orderItems = items.map((item) => ({
                order_id: id,
                dish_id: item.dish_id,
                quantity: item.quantity,
                price: item.price,
            }))

            await knex("order_items").insert(orderItems)
        }

        await knex("orders")
            .where({ id })
            .update({
                total_price: calculateTotal || order.total_price,
                payment_method,
                status,
                updated_at: knex.fn.now(),
            })

        return res.json()
    }

    async delete(req, res) {
        const { id } = req.params
        const user_id = req.user.id

        const order = await knex("orders").where({ id, user_id }).first()

        if (!order) {
            throw new AppError("Order not found", 404)
        }

        await knex("orders").where({ id, user_id }).delete()

        return res.json()
    }
}

module.exports = OrdersController
