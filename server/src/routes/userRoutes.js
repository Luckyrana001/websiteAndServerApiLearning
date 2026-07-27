const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        success: true,
        users: [
            {
                id: 1,
                name: "Lucky"
            },
            {
                id: 2,
                name: "John"
            }
        ]
    });
});

module.exports = router;