const { Router } = require("express")

const IngredientsController = require("../controllers/IngredientsController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const ingredientsRoutes = Router()
const ingredientsController = new IngredientsController()

ingredientsRoutes.use(ensureAuthenticated)

ingredientsRoutes.get("/", ingredientsController.index)

module.exports = ingredientsRoutes