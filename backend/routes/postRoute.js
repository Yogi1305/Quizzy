import express from "express";
import { addQuestion, createContest, getallcontest, getContestById} from "../controller/contestControllers.js";
import { isloggedin } from "../middleware/isLoggedin.js";
import {isAdmin} from "../middleware/isAdmin.js"
import { saveAnswer } from "../controller/quizController.js";
import { getQuizResult } from "../controller/winner.js";


const router=express.Router();


router.route("/createcontest").post(isloggedin,isAdmin,createContest);
router.route("/addQuestion").post(isloggedin,isAdmin,addQuestion)

router.route("/getcontest").get(isloggedin,getallcontest);
router.route("/getContestById/:id").get(getContestById);
router.route("/answer").post(isloggedin,saveAnswer)
router.route("/results").post(getQuizResult)
export default router