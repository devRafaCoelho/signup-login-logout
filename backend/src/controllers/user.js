const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { verifyRegisteredEmail } = require("../utils/verifyData");

const prisma = new PrismaClient();

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                name,
                email,
                password: encryptedPassword,
            },
        });

        const { password: _, ...userData } = user;

        res.status(201).json(userData);
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error, please try again!" });
    }
};

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await verifyRegisteredEmail(email);

        const checkedPassword = await bcrypt.compare(password, result.password);

        if (!checkedPassword)
            return res
                .status(400)
                .json({ message: "Invalid user data, check and try again!" });

        const token = jwt.sign({ id: result.id }, process.env.JWT_PASSWORD, {
            expiresIn: `${60 * 60}s`,
        });

        const { password: __, ...userData } = result;

        return res.json({ user: userData, token });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error, please try again!" });
    }
};

module.exports = {
    registerUser,
    userLogin,
};
