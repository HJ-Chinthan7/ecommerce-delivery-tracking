const Driver = require("../models/Driver");

module.exports.driverLogin=async()=>{
    try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await driver.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

   
    const bus = await Bus.findOne({ driverId: driver.driverId });

    const token = jwt.sign(
      { 
        driverId: driver.driverId, 
        email: driver.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      driver: {
        driverId: driver.driverId,
        name: driver.name,
        email: driver.email,
        busId: bus ? bus.busId : null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.driverRegister=async()=>{
try{ 
const { driverId, name, email, password, busId, routeId } = req.body;
    if (!driverId || !name || !email || !password || !busId ) {
      return res.status(400).json({ error: 'All fields are required' });
    }
const existingDriver = await Driver.findOne({ 
      $or: [{ email }, { driverId }] 
    });
  if (existingDriver) {
      return res.status(400).json({ error: 'Driver already exists' });
    }
const hashpassword=await Driver.hashPassword(password);
    const driver = new Driver({
      driverId,
      name,
      email,
      password: hashpassword
    });
 await driver.save();
    const bus = new Bus({
      busId,
      driverId,
      routeId,
      parcels: [],
      currentLocation: { lat: 0, lon: 0 },
      isActive: false
    });
    await bus.save();

     res.status(201).json({
      success: true,
      message: 'Driver and bus registered successfully',
      driver: {
        driverId: driver.driverId,
        name: driver.name,
        email: driver.email
      },
      bus: {
        busId: bus.busId,
        routeId: bus.routeId
      }
    });

}catch(err){
 console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error'+err });
}

};

  