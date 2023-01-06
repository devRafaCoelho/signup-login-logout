const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function verifyData(res, object) {
    for (let key in object) {
        if (!object[key]) {
            res.status(400).json({
                message: `The field '${key}' is required!`,
            });
            return false;
        }
    }
    return true;
}

async function verifyRegisteredEmail(email) {
    const findEmail = await prisma.users.findUnique({
        where: {
            email,
        },
    });
    return findEmail;
}

module.exports = {
    verifyData,
    verifyRegisteredEmail,
};
