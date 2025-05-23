const { Router } = require("express")

const OrdersController = require("../controllers/OrdersController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const ordersRoutes = Router()
const ordersController = new OrdersController()

ordersRoutes.use(ensureAuthenticated)

ordersRoutes.post("/", ordersController.create)
ordersRoutes.put("/:id", ordersController.update)
ordersRoutes.get("/:id", ordersController.show)
ordersRoutes.get("/", ordersController.index)
ordersRoutes.delete("/:id", ordersController.delete)

module.exports = ordersRoutes
