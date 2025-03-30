import jwt from 'jsonwebtoken'

export const tokenGen = (payLoad)=> {
    const token = jwt.sign(payLoad,'mykey')
    return token;
}

export const decodToken =(token)=>{
    const payload = jwt.decode(token);
    return payload;

}

export const verifyToken =(token)=> {
    try{
        const payload = jwt.verify(token,'mykey');
        return payload;
    }catch (error){
        console.log(error);
        return null;
    }
    
}

