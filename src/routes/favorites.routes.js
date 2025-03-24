const { Router } = require("express")

const FavoriteDishesController = require("../controllers/FavoriteDishesController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const favoritesRoutes = Router()
const favoriteDishesController = new FavoriteDishesController()

favoritesRoutes.use(ensureAuthenticated)

favoritesRoutes.post("/:dish_id", favoriteDishesController.create)
favoritesRoutes.get("/:id", favoriteDishesController.show)
favoritesRoutes.get("/", favoriteDishesController.index)
favoritesRoutes.delete("/:id", favoriteDishesController.delete)

module.exports = favoritesRoutes
