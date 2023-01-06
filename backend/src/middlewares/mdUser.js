const jwt = require("jsonwebtoken");
require("dotenv").config();
const { verifyData, verifyRegisteredEmail } = require("../utils/verifyData");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const verifyRegisterData = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (
        !verifyData(res, {
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
        })
    )
        return;

    const isEmail = await verifyRegisteredEmail(email);

    if (isEmail !== null) {
        return res
            .status(400)
            .json({ message: "Invalid user data, check and try again!" });
    }

    next();
};

const verifyLoginData = async (req, res, next) => {
    const { email, password } = req.body;

    if (!verifyData(res, { email, password })) return;

    const isEmail = await verifyRegisteredEmail(email);
    if (isEmail === null) {
        return res
            .status(400)
            .json({ message: "Invalid user data, check and try again!" });
    }

    next();
};

const verifyLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization)
        return res.status(401).json({ message: "User unauthorized!" });

    const token = authorization.substring(7);

    try {
        const { id } = jwt.verify(token, process.env.JWT_PASSWORD);

        const findUser = await prisma.users.findUnique({
            where: {
                id,
            },
        });

        const result = await verifyRegisteredEmail(findUser.email);

        if (result === null) {
            return res.status(403).json({ message: "User unauthorized!" });
        }

        const { password: _, ...userData } = result;

        req.user = userData;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Oops, your session has expired!",
        });
    }
};

module.exports = {
    verifyRegisterData,
    verifyLoginData,
    verifyLogin,
};
