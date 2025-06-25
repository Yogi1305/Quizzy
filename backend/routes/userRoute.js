import express from "express"
import { Admin, checklogging, completecontest, login, logout, register, userdata } from "../controller/userController.js";
import { isloggedin } from "../middleware/isLoggedin.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { test } from "../openAi/openAiConfig.js";

const router=express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(isloggedin,logout);
router.route("/checklogged").get(isloggedin,checklogging);
router.route("/isadmin").get(isloggedin,isAdmin,Admin);
router.route("/complete").post(completecontest)
router.route("/generate").post(test)
router.route("/getuser/:userId").get(userdata)

export default router;