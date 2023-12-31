import { Router } from "express";

const router = Router();

/** import all controllers */
import * as controller from "../controllers/appController.js";
import * as villagerController from "../controllers/villagersController.js";
import * as announcementController from "../controllers/announcementController.js";
import * as campaignController from "../controllers/campaignController.js";
import * as guestController from "../controllers/guestVillagerController.js"
import { registerMail } from "../controllers/mailerController.js";
import Auth, { localVariables } from "../middleware/Auth.js";

// ========= POST Methods =============
router.route('/register').post(controller.register); // register user
router.route("/registermail").post(registerMail); // send the email
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); // authenticate user
router.route('/login').post(controller.verifyUser, controller.login); // login in to the app
router.route('/addfammily').post(villagerController.addVillager); // add fammily details
router.route("/addAnnouncement").post(announcementController.addAnnouncement); // add announcement

// ========= GET Methods ==============
router.route('/user/:id').get(controller.getUser); // user with userID
router.route('/getUser/:username').get(controller.getUser); // user with username
router.route('/getUsers/:role').get(controller.getUsers); // users with role
router.route('/getFammily/:gnd').get(villagerController.getFammly); // users with role
router.route("/generateOTP").get(controller.verifyUser, localVariables, controller.generateOTP); // generate random OTP
router.route("/verifyOTP").get(controller.verifyUser, controller.verifyOTP); // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession); // reset all the variables
router.route("/getAnnouncements").get(announcementController.getAnnouncement); // get announcement
router.route("/getAllCampaigns").get(campaignController.getAllCampaigns); // get all campaigns
router.route("/getCampaignsGND/:gnd").get(campaignController.getCampaignsGND); // get campaigns for relevent gnd
router.route("/getGuestVillagers/:gnd").get(guestController.getGuestVillagers); // get guest villagers for relevent gnd

// ========= PUT Methods ==============
router.route('/updateuser').put(Auth, controller.updateUser); //is use to update the user profile
router.route('/acceptCampaign/:id').put(campaignController.acceptCampaign); //is use to update the campaign
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); //is use to reset the password

// ========= Delete Meyhods ===========
router.route('/deletedata/:id').delete(controller.verifyUser, controller.deleteData); // data with dataID

export default router;