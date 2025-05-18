import  Router  from "express";
import {
  getAllPolicies,
  updatePolicy,addRole
} from "../controllers/policyController.js";
import authorize from '../middlewares/authorize.js';
import authenticateJWT from "../middlewares/authMiddleware.js";
const router = Router();

router.use(authenticateJWT);
router.use(authorize);

router.get("/list", getAllPolicies);

router.post("/add", addRole);  

router.put(
  "/:roleId",
  updatePolicy
);

export default router;
