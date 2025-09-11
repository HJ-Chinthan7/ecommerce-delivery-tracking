const jwt=require('jsonwebtoken');
const generateToken=(driverData)=>{
    const token=jwt.sign(
        {
         driverId: driverData.driverId, 
        email: driverData.email
        },
        process.env.JWT_SECRET,
        {expiresIn:'24h'}
    );
    return token;
};

module.exports=generateToken;