const { compare } = require("bcryptjs")
const { sign } = require("jsonwebtoken")
const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const authConfig = require("../configs/auth")

class SessionsController {
    async create(req, res) {
        const { email, password } = req.body

        const user = await knex("users").where({ email }).first()

        const passwordMatched = await compare(password, user.password)

        if (!email || !passwordMatched) {
            throw new AppError("Email e/ou senha incorretos.", 401)
        }

        const { secret, expiresIn } = authConfig.jwt

        const token = sign({ role: user.role }, secret, {
            subject: String(user.id),
            expiresIn,
        })

        delete user.password

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.status(201).json({ user })
    }

    async delete(req, res) {
        // Clear the token cookie
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        })

        return res.status(200).json({ message: "Logout realizado com sucesso" })
    }
}

module.exports = SessionsController
