const { Router } = require("express")

const userRouter = require("./user.routes")
const sessionsRouter = require("./sessions.routes")
const dishesRouter = require("./dishes.routes")
const favoriteRoutes = require("./favorites.routes")
const ingredientsRoutes = require("./ingredients.routes")

const routes = Router()

routes.use("/users", userRouter)
routes.use("/sessions", sessionsRouter)

routes.use("/dishes", dishesRouter)
routes.use("/ingrdients", ingredientsRoutes)
routes.use("/favorites", favoriteRoutes)

module.exports = routes
