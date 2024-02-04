// ** Express
import express from "express";

// ** Controllers
import UserController from "../../controllers/user.controller";

// ** Middleware
import { userValidation } from "../../middlewares/validate-data/user";

const router = express.Router();

router.get("/profile/:userId", UserController.profile);
router.put("/editProfile", userValidation.editProfile(), UserController.editProfile);
router.post("/follow/:friendId", UserController.follow);
router.delete("/unFollow/:friendId", UserController.unFollow);
router.put("/changePassword", userValidation.changePassword(), UserController.changePassword);
router.get("/getFollowers/:userId", UserController.getFollowers);
router.get("/getFollowing/:userId", UserController.getFollowing);
export default router;