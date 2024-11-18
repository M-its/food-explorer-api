const { Router } = require("express")

const userRouter = require("./user.routes")
const sessionsRouter = require("./sessions.routes")
const dishesRouter = require("./dishes.routes")
const favoriteRoutes = require("./favorites.routes")

const routes = Router()

routes.use("/users", userRouter)
routes.use("/sessions", sessionsRouter)

routes.use("/dishes", dishesRouter)
routes.use("/favorites", favoriteRoutes)

module.exports = routes
