const Cart = require('../model/cart')
const express = require("express");
const route = express.Router();

const {verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("./verfiy-token")



/**
* @description CREATE cart by any user
* @method POST /
*/
route.post("/cart", verifyTokenAndAuthorization, async (req, res) => {
    const newcart = new Cart(req.body)

    try {
        const cart = await newcart.save(newcart)
        res.status(200).json(cart)

    } catch (err) {
        return res.json({ status: 'error', message: err.message });
    }
});


/**
* @description UPDATE cart by admin
* @method PUT /
*/
route.put("/cart/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            useFindAndModify: false
        }).then(user => {
            if (!user) {
                res.status(404).send({ message: 'Cannot find cart' })
            } else {
                res.status(200).json(cart)
            }
        }).catch(err => {
            res.status(500).send({ message: err.message || "Something went wrong" })
        })

    } catch (err) {
        res.status(500).json({ err })
    }
});

/**
* @description DELETE cart by admin
* @method DELETE /
*/
route.delete("/cart/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        await Cart.findByIdAndDelete(req.params.id)
            .then(cart => {
                if (!cart) {
                    res.status(404).send({ message: 'Cannot find cart' })
                } else {
                    res.status(200).send(cart)
                    res.status.json("cart deleted.")

                }
            }).catch(err => {
                res.status(500).send({ message: err.message || "Something went wrong" })
            })

    } catch (err) {
        res.status(500).json({ err })
    }
});

/**
* @description GET user cart 
* @method GET /
*/
route.get("/get/:userId", verifyTokenAndAuthorization, async (req, res) => {

    try {
        await Cart.findOne({ userId: req.params.userId })
            .then(cart => {
                if (!cart) {
                    res.status(404).send({ message: 'Cannot find user' })
                } else {
                    res.status(200).send(cart)

                }
            }).catch(err => {
                res.status(500).send({ message: err.message || "Something went wrong" })
            })
    } catch (err) {
        res.status(500).json({ err })
    }
});


/**
* @description GET cart by admin
* @method GET /
*/
route.get("/cart/", verifyTokenAndAdmin, async (req, res) => {

    try {
        const carts = await Cart.find()
        res.status(200).json(carts)
    } catch (err) {
        res.status(500).json({ err })
    }
});



module.exports = route;