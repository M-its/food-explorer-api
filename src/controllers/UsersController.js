const knex = require("../database/knex")
const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")

class UsersController {
    static emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+$/i

    async create(req, res) {
        const { name, email, password } = req.body

        const checkUserExists = await knex("users").where({ email })

        if (checkUserExists.length > 0) {
            throw new AppError("Este e-mail já está em uso.")
        }

        if (!UsersController.emailRegex.test(email)) {
            throw new AppError("Precisa ser um endereço de email válido")
        }

        const hashedPassword = await hash(password, 8)

        await knex("users").insert({ name, email, password: hashedPassword })

        return res.status(201).json()
    }

    async update(req, res) {
        const { name, email, password, old_password } = req.body
        const user_id = req.user.id

        const user = await knex("users").where({ id: user_id }).first()

        if (!user) {
            throw new AppError(`Usuário ${user} não foi encontrado`)
        }

        const userWithUpdatedEmail = await knex("users")
            .where({ email: email })
            .first()

        if (
            userWithUpdatedEmail &&
            userWithUpdatedEmail.id !== Number(user_id)
        ) {
            throw new AppError("Este e-mail já está em uso.")
        }

        if (email && !UsersController.emailRegex.test(email)) {
            throw new AppError("Precisa ser um endereço de e-mail válido")
        }

        user.name = name ?? user.name
        user.email = email ?? user.email

        if (password && !old_password) {
            throw new AppError(
                "Você precisa informar a senha antiga para definir a nova senha."
            )
        }

        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user.password)

            if (!checkOldPassword) {
                throw new AppError("A senha antiga não confere")
            }

            user.password = await hash(password, 8)
        }

        await knex("users").where({ id: user.id }).update({
            name: user.name,
            email: user.email,
            password: user.password,
            updated_at: knex.fn.now(),
        })

        return res.json({ user: { name: user.name, email: user.email } })
    }
}

module.exports = UsersController
