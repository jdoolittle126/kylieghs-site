const express = require('express');
const router = express.Router();
const { ConfigController } = require('../../controllers/config.controller');

router.route('/config')
    .get(async (req, res) => {
        let config = await ConfigController.getConfig();
        if (!config) {
            res.status(500).send('Config not found!');
        }
        res.json(config);
    });

// Expose the router to the application
module.exports = router;
