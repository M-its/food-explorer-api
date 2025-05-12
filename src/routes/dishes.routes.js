const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const DishesController = require("../controllers/DishesController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorizarion")

const dishesRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const dishesController = new DishesController()
dishesRoutes.use(ensureAuthenticated)

dishesRoutes.post(
    "/",
    verifyUserAuthorization(["admin"]),
    upload.single("dish_image"),
    dishesController.create
)
dishesRoutes.get("/:id", dishesController.show)
dishesRoutes.patch(
    "/:id",
    verifyUserAuthorization(["admin"]),
    upload.single("dish_image"),
    dishesController.update
)
dishesRoutes.delete(
    "/:id",
    verifyUserAuthorization(["admin"]),
    dishesController.delete
)
dishesRoutes.get("/", dishesController.index)

module.exports = dishesRoutes
