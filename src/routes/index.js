const { Router } = require("express")

const userRouter = require("./user.routes")
const sessionsRouter = require("./sessions.routes")
const dishesRouter = require("./dishes.routes")
const favoritesRoutes = require("./favorites.routes")
const ingredientsRoutes = require("./ingredients.routes")
const ordersRoutes = require("./orders.routes")

const routes = Router()

routes.use("/users", userRouter)
routes.use("/sessions", sessionsRouter)

routes.use("/dishes", dishesRouter)
routes.use("/ingredients", ingredientsRoutes)
routes.use("/favorites", favoritesRoutes)
routes.use("/orders", ordersRoutes)

module.exports = routes
