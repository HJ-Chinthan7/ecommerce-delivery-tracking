const jwt = require("jsonwebtoken");
const Assigner = require("../models/Assigner");
const axios = require("axios");
const Region = require("../models/Region");
const Parcel = require("../models/parcel");
const generateAssignerToken = require("../utils/generateAsToken");


module.exports.loginAssigner = async (req, res) => {
    const { email, password } = req.body;
    try {
        const assigner = await Assigner.findOne({ email });

        if (!assigner) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await assigner.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        const token = generateAssignerToken(assigner);

        res.cookie('token', token, {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            token,
            assigner: { _id: assigner._id, name: assigner.name, email: assigner.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports.logoutAssigner = async (req, res) => {
    res.json({ success: true, message: "Logged out successfully", token: null });
};


module.exports.getExternalOrders = async (req, res) => {

    try {
        const response = await axios.get("http://localhost:5000/api/orders/trackingcall-for-order");
        res.json(response?.data || []);
        console.log(response.data)
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch external orders" });
    }
};

module.exports.getRegions = async (req, res) => {
    try {
        const regions = await Region.find({});
        res.json(regions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch regions" });
    }
};

module.exports.assignParcel = async (req, res) => {
    const { orderIds, regionId } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
        return res.status(400).json({ message: "orderIds missing or invalid" });
    }
    if (!regionId) {
        return res.status(400).json({ message: "regionId missing" });
    }

    try {
        const region = await Region.findById(regionId);
        if (!region) {
            return res.status(404).json({ message: "Region not found" });
        }

        const parcels = [];

        for (const orderId of orderIds) {

            const response = await axios.get(
                `http://localhost:5000/api/orders/orderbyid/${orderId}`
            );
            console.log(response.data);
            const order = response.data;
            if (!order) {
                continue;
            }
            const parcel = await Parcel.create({
                orderId: order._id || null,

                user: order.user?._id || order.user || null,

                items: (order.orderItems || []).map(item => ({
                    name: item?.name || "NO_NAME",
                    qty: item?.qty || 0,
                    price: item?.price || 0,
                    image: item?.image || "NO_IMAGE",
                    product: item?.product || null,
                })),

                shippingAddress: {
                    address: order.shippingAddress?.address || "NO_ADDRESS",
                    city: order.shippingAddress?.city || "NO_CITY",
                    district: order.shippingAddress?.district || "NO_DISTRICT",
                    state: order.shippingAddress?.state || "NO_STATE",
                    postalCode: order.shippingAddress?.postalCode || "000000",
                    country: order.shippingAddress?.country || "NO_COUNTRY",
                },

                region: region._id,

                busId: order.busId || null,

                createdBy: order.createdBy || null,

                assignedBy: order.assignedBy || null,

                assignedAt: order.assignedAt || null,

                status: order.status || "pending",

                isDispatched: order.isDispatched || false,

                isAddressChanged: order.isAddressChanged || false,

                deliveredAt: order.deliveredAt || null,

                expectedDelivery: order.expectedDelivery || null,

                history: order.history || [],
            });


            parcels.push(parcel);
            console.log(parcels);
            const updateResponse = axios.patch(`http://localhost:5000/api/orders/order-parcelid-update/${order._id}`, {
                parcelId: parcel._id
            });



            if (updateResponse.data?.parcelId !== parcel._id.toString()) {
                console.log("Parcel ID mismatch while updating external server");
            }
        }

        return res.json({
            success: true,
            parcels,
            message: "Parcels assigned successfully using axios → external backend",
        });

    } catch (err) {
        console.error("Assign Parcel Error:", err);
        return res.status(500).json({ message: "Failed to assign parcels" });
    }
};


module.exports.reassignParcel = async (req, res) => {
    const { parcelIds, regionId } = req.body;
    if (!parcelIds || !regionId) return res.status(400).json({ message: "Missing data" });

    try {
        const region = await Region.findById(regionId);
        if (!region) return res.status(404).json({ message: "Region not found" });

        const updatedParcels = [];
        for (const parcelId of parcelIds) {
            const parcel = await Parcel.findById(parcelId);
            if (!parcel) continue;
            parcel.region = region._id;
            parcel.isDispatched = false;
            await parcel.save();
            updatedParcels.push(parcel);
        }

        res.json({ success: true, updatedParcels });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to reassign parcels" });
    }
};


module.exports.getReassignParcels = async (req, res) => {
    try {
        const parcels = await Parcel.find({ $or: [{ isAddressChanged: true }, { isDispatched: false }] })
            .populate("user", "name email");
        res.json(parcels);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch reassign parcels" });
    }
};

