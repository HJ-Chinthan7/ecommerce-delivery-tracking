const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const authenticateAdmin = require('../middleware/authAdmin.middleware');

router.post('/createRoute', authenticateAdmin, routeController.createRoute);
router.get('/getRegionRoutes', authenticateAdmin, routeController.getRegionRoutes); 
router.put('/updateRoute/:routeId', authenticateAdmin, routeController.updateRoute);
router.delete('/deleteRoute/:routeId', authenticateAdmin, routeController.deleteRoute);
router.patch('/toggleRouteStatus/:routeId', authenticateAdmin, routeController.toggleRouteStatus);

module.exports = router;