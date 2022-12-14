import bcrypt from 'bcrypt';


const usuarios = [
    {
        nombre: 'alex',
        email: 'alex@alex.com',
        confirmado: 1,
        password: bcrypt.hashSync('password', 10),
    }
]

export default usuarios;