const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { verifyRegisteredEmail } = require("../utils/verifyData");

const prisma = new PrismaClient();

const editUser = async (req, res) => {
    const { name, email, password } = req.body;
    const { id, email: userEmail } = req.user;

    try {
        const encryptedPwd = await bcrypt.hash(password, 10);

        if ((await verifyRegisteredEmail(email)) && email !== userEmail)
            return res
                .status(400)
                .json({ message: "Invalid data, try again!" });

        await prisma.users.update({
            where: {
                id,
            },
            data: {
                name,
                email,
                password: encryptedPwd,
            },
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error!" });
    }
};

module.exports = {
    editUser,
};
