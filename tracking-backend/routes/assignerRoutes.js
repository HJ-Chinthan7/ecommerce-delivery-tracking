const express = require("express");

const router = express.Router();
const assignerContoller = require("../controllers/assignerContoller");
const authAssigner  = require("../middleware/authAssigner.middleware");


router.post("/assignerLogin", assignerContoller.loginAssigner);
router.post("/assignerLogout", assignerContoller.logoutAssigner);

router.get("/getParcels", authAssigner, assignerContoller.getExternalOrders);
router.get("/regions", authAssigner, assignerContoller.getRegions);

router.post("/assignParcel", authAssigner, assignerContoller.assignParcel);
router.post("/reassignParcel", authAssigner, assignerContoller.reassignParcel);
router.get("/parcels/reassign", authAssigner, assignerContoller.getReassignParcels);

module.exports = router;
