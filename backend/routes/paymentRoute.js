import express from "express";
import { createOrder, sendApikey, verification } from "../payment/payment.js";
const router=express.Router();
router.route("/order").post(createOrder)
router.route("/getkey").get(sendApikey)
router.route("/verification").post(verification)
export default router;