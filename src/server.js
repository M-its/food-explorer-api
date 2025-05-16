require("express-async-errors")
require("dotenv/config")

const cors = require("cors")
const express = require("express")
const routes = require("./routes")
const cookieParser = require("cookie-parser")
const database = require("./database/sqlite")
const AppError = require("./utils/AppError")
const uploadConfig = require("./configs/upload")

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173/",
            "https://mits-food-explorer-web.netlify.app",
        ],
        credentials: true,
    })
)
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))
app.use(routes)

database()

app.use((error, req, res, next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: "error",
            message: error.message,
        })
    }

    console.error(error)

    return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
    })
})

const PORT = process.env.PORT || 3333
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))
