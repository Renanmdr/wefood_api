import jwt from 'jsonwebtoken'

export const createUsertoken = async (user, req, res) => {
    // create a token 

    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, 'nossosecret')

    // return token

    res.status(200).json({
        message: 'Você esta autenticado',
        token: token,
        userId: user._id
    })

}