const { Router } = require("express")

const FavoriteDishesController = require("../controllers/FavoriteDishesController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const favoriteRoutes = Router()
const favoriteDishesController = new FavoriteDishesController()

favoriteRoutes.use(ensureAuthenticated)

favoriteRoutes.post("/:dish_id", favoriteDishesController.create)
favoriteRoutes.get("/:id", favoriteDishesController.show)
favoriteRoutes.post("/", favoriteDishesController.index)
favoriteRoutes.delete("/:id", favoriteDishesController.delete)

module.exports = favoriteRoutes
