const express = require("express");
const route = express.Router();


const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("./verfiy-token")
const pass = require('../services/loginpass');
const User = require('../model/user')


// user routes
route.post("/users", pass.login);
route.get('/users/get/', verifyTokenAndAdmin, async (req, res, next) => {

    // GET ALL USERS

    try {
        const query = req.query.new
        if (query) {
            const user = await User.find().sort({ _id: -1 }).limit(5)
                .then(user => {
                    if (!user) {
                        res.status(404).send({ message: 'Cannot find user' })
                    } else {
                        res.status(200).send(user)

                    }
                }).catch(err => {
                    res.status(500).send({ message: err.message || "Something went wrong" })
                })
        } else {
            const user = await User.find()
                .then(user => {
                    if (!user) {
                        res.status(404).send({ message: 'Cannot find user' })
                    } else {
                        res.status(200).send(user)

                    }
                }).catch(err => {
                    res.status(500).send({ message: err.message || "Something went wrong" })
                })
        }

    } catch (err) {
        res.status(500).json({ err })
    }


}
);
route.get('/users/get/:id', verifyTokenAndAdmin, async (req, res, next) => {

    // GET USER
    try {
        await User.findById(req.params.id)
            .then(user => {
                if (!user) {
                    res.status(404).send({ message: 'Cannot find user' })
                } else {
                    const { password, ...others } = user._doc
                    res.status(200).send(others)

                }
            }).catch(err => {
                res.status(500).send({ message: err.message || "Something went wrong" })
            })
    } catch (err) {
        res.status(500).json({ err })
    }

});
route.put('/users/:id', verifyTokenAndAuthorization, async (req, res, next) => {

    // UPDATE USER
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            useFindAndModify: false
        }).then(user => {
            if (!user) {
                res.status(404).send({ message: 'Cannot find user' })
            } else {
                res.status(200).json(updatedUser)
            }
        }).catch(err => {
            res.status(500).send({ message: err.message || "Something went wrong" })
        })

    } catch (err) {
        res.status(500).json({ err })
    }


});
route.delete('/users/:id', verifyTokenAndAuthorization, async (req, res, next) => {

    // DELETE USER
    try {
        await User.findByIdAndDelete(req.params.id)
            .then(user => {
                if (!user) {
                    res.status(404).send({ message: 'Cannot find user' })
                } else {
                    res.status(200).send(user)
                    res.status.json("User deleted.")

                }
            }).catch(err => {
                res.status(500).send({ message: err.message || "Something went wrong" })
            })

    } catch (err) {
        res.status(500).json({ err })
    }

});
route.get('/users/stats', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))
    try {

        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                }
            },
            {
                $group: {
                    _id: {
                        year: "$year",
                        month: "$month",
                    }, totalAccounts: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.status(200).json(data)

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
});


module.exports = route;