const express = require('express');
const router = express.Router();
const {AffirmationController} = require("../controllers/affirmation.controller");
const {ConfigController} = require("../controllers/config.controller");


/////////////////////
/// VIEW ROUTES
/////////////////////
const routeView = router.route('/');

routeView.get(async (req, res) => {
    let baseConfig = await ConfigController.getConfig();
    let config = {
        startDate: baseConfig.startDate,
        endDate: baseConfig.endDate,
        birthDay: baseConfig.birthDay,
        daysSince: Math.max(Math.floor((new Date() - baseConfig.startDate) / (1000 * 60 * 60 * 24)), 0),
        daysTil: Math.max(Math.floor((baseConfig.endDate - new Date()) / (1000 * 60 * 60 * 24)), 0)
    }

    let affirmations = await AffirmationController.getAllAffirmations(config);

    if (affirmations) {
        res.render('view', {affirmations: affirmations, config: config});
    } else {
        res.render('error');
    }
});

/////////////////////
/// MISC ROUTES
/////////////////////
router.route('/error').get((req, res) => {
    // Route for generic errors in case a static URL is needed
    res.render('error');
});

router.route('*').get((req, res) => {
    // Unknown routes are brought to the home page
    res.redirect('/');
});


// Expose the router to the application
module.exports = router;
