const Order = require('../model/order')
const express = require("express");
const route = express.Router();

const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("./verfiy-token")



/**
* @description CREATE Order by any user
* @method POST /
*/
route.post("/order", verifyTokenAndAuthorization, async (req, res) => {
    const newOrder = new Order(req.body)

    try {
        const Order = await newOrder.save(newOrder)
        res.status(200).json(Order)

    } catch (err) {
        return res.json({ status: 'error', message: err.message });
    }
});


/**
* @description UPDATE Order by admin
* @method PUT /
*/
route.put("/order/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            useFindAndModify: false
        }).then(order => {
            if (!order) {
                res.status(404).send({ message: 'Cannot find Product' })
            } else {
                res.status(200).json(order)
            }
        }).catch(err => {
            res.status(500).send({ message: err.message || "Something went wrong" })
        })

    } catch (err) {
        res.status(500).json({ err })
    }
});

/**
* @description DELETE order by admin
* @method DELETE /
*/
route.delete("/order/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        await Order.findByIdAndDelete(req.params.id)
            .then(order => {
                if (!order) {
                    res.status(404).send({ message: 'Cannot find order' })
                } else {
                    res.status(200).send(order)
                    res.status.json("order deleted.")

                }
            }).catch(err => {
                res.status(500).send({ message: err.message || "Something went wrong" })
            })

    } catch (err) {
        res.status(500).json({ err })
    }
});

/**
* @description GET user order 
* @method GET /
*/
route.get("/get/:userId", verifyTokenAndAuthorization, async (req, res) => {

    try {
        await Order.find({ userId: req.params.userId })
            .then(order => {
                if (!order) {
                    res.status(404).send({ message: 'Cannot find user' })
                } else {
                    res.status(200).send(order)
                }
            }).catch(err => {
                res.status(500).send({ message: err.message || "Something went wrong" })
            })
    } catch (err) {
        res.status(500).json({ err })
    }
});


/**
* @description GET order by admin
* @method GET /
*/
route.get("/order/", verifyTokenAndAdmin, async (req, res) => {

    try {
        const orders = await Order.find()
        res.status(200).json(orders)
    } catch (err) {
        res.status(500).json({ err })
    }
});


/**
* @description GET monthly income 
* @method GET /
*/
route.get("/income/", verifyTokenAndAdmin, async (req, res) => {

    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                    sales: "$amount"
                },
            },
            {
                $group: {
                    _id: {
                        year: "$year",
                        month: "$month",
                    },
                    total: { $sum: "$sales" }
                }
            }
        ]);
        res.status(200).json(income)
    } catch (err) {
        res.status(500).json({ err })
    }
});

module.exports = route;