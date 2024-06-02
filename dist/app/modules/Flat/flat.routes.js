"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatRoutes = void 0;
const express_1 = __importDefault(require("express"));
const flat_controller_1 = require("./flat.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const flat_validation_1 = require("./flat.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// create flat
router.post("/", (0, auth_1.default)(client_1.UserRole.USER), (0, validateRequest_1.default)(flat_validation_1.flatValidation.createFlatValidationSchema), flat_controller_1.flatController.createFlat);
// get flats
router.get("/", flat_controller_1.flatController.getFlats);
// get my flats
router.get("/my-flats", (0, auth_1.default)(client_1.UserRole.USER), flat_controller_1.flatController.getMyFlats);
// get single flat
router.get("/:flatId", flat_controller_1.flatController.getSingleFlat);
// update flat
router.put("/:flatId", (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(flat_validation_1.flatValidation.updateFlatValidationSchema), flat_controller_1.flatController.updateFlat);
// delete flat
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), flat_controller_1.flatController.deleteFlat);
exports.flatRoutes = router;
