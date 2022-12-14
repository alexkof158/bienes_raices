import jwt from 'jsonwebtoken';

const generarJTW = id=>jwt.sign({id},process.env.JTW_SECRET,{expiresIn: '2h'})
    
    


const generarId=  () => Date.now().toString(32) + Math.random().toString(36).substr(2);


export {
    generarId, 
    generarJTW
}