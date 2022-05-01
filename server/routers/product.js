const Product = require('../model/product')
const express = require("express");
const route = express.Router();

const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("./verfiy-token")



/**
* @description CREATE product by admin
* @method POST /
*/
route.post("/products", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body)

    try {
        const product = await newProduct.save(newProduct)
        res.status(200).json(product)

    } catch (err) {
        return res.json({ status: 'error', message: err.message });
    }
});


/**
* @description UPDATE product by admin
* @method PUT /
*/
route.put("/products/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const Product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            useFindAndModify: false
        }).then(user => {
            if (!user) {
                res.status(404).send({ message: 'Cannot find Product' })
            } else {
                res.status(200).json(updatedProduct)
            }
        }).catch(err => {
            res.status(500).send({ message: err.message || "Something went wrong" })
        })

    } catch (err) {
        res.status(500).json({ err })
    }
});

/**
* @description DELETE product by admin
* @method DELETE /
*/
route.delete("/products/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        await Product.findByIdAndDelete(req.params.id)
            .then(product => {
                if (!product) {
                    res.status(404).send({ message: 'Cannot find product' })
                } else {
                    res.status(200).send(product)
                    res.status.json("product deleted.")

                }
            }).catch(err => {
                res.status(500).send({ message: err.message || "Something went wrong" })
            })

    } catch (err) {
        res.status(500).json({ err })
    }
});

/**
* @description GET product by admin
* @method GET /
*/
route.get("/get/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        await Product.findById(req.params.id)
            .then(product => {
                if (!product) {
                    res.status(404).send({ message: 'Cannot find user' })
                } else {
                    res.status(200).send(product)

                }
            }).catch(err => {
                res.status(500).send({ message: err.message || "Something went wrong" })
            })
    } catch (err) {
        res.status(500).json({ err })
    }
});

/**
* @description GET products by admin
* @method GET /
*/
route.get("/products/", verifyTokenAndAdmin, async (req, res) => {

    try {
        const queryNew = req.query.new
        const queryCatagory = req.query.category

        if (queryNew) {
            const newProduct = await Product.find().sort({ createdAt: -1 }).limit(5)
                .then(product => {
                    if (!product) {
                        res.status(404).send({ message: 'Cannot find product' })
                    } else {
                        res.status(200).send(product)

                    }
                }).catch(err => {
                    res.status(500).send({ message: err.message || "Something went wrong" })
                })
        } else if (queryCatagory) {
     
            const newProduct = await Product.find({
                category: {
                    $in: [queryCatagory],
                }
            })
                .then(product => {
                    if (!product) {
                        res.status(404).send({ message: 'Cannot find product' })
                    } else {
                        res.status(200).send(product)

                    }
                }).catch(err => {
                    res.status(500).send({ message: err.message || "Something went wrong" })
                })
        } else {
            const newProduct = await Product.find()
                .then(product => {
                    if (!product) {
                        res.status(404).send({ message: 'Cannot find user' })
                    } else {
                        res.status(200).send(product)

                    }
                }).catch(err => {
                    res.status(500).send({ message: err.message || "Something went wrong" })
                })
        }

    } catch (err) {
        res.status(500).json({ err })
    }
});

module.exports = route;