const express = require('express');
const router = express.Router();
const { AffirmationController } = require('../../controllers/affirmation.controller');

router.route('/affirmations')
    .get(async (req, res) => {
        let query = Object.assign({}, req.query);
        let affirmations = await AffirmationController.getAllAffirmations(query);
        if (!affirmations) {
            res.status(500).send('Affirmations not found!');
        }
        res.json(affirmations);
    });

// Expose the router to the application
module.exports = router;
