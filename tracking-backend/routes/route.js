const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const authenticateAdmin = require('../middleware/authAdmin.middleware');

router.post('/createRoute', authenticateAdmin, routeController.createRoute);
router.get('/getRegionRoutes', authenticateAdmin, routeController.getRegionRoutes); 
router.delete('/deleteRoute/:routeId', authenticateAdmin, routeController.deleteRoute);
router.patch('/toggleRouteStatus/:id', authenticateAdmin, routeController.toggleRouteStatus);
router.patch("/assignBusRoute", authenticateAdmin, routeController.assignBusRoute);
router.patch("/unAssignBusRoute/:busId", authenticateAdmin, routeController.unAssignBusRoute);
module.exports = router;