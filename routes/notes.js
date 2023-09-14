const controller = require("../controllers/notes");
const router = require("express").Router();
const { noteValidator } = require("../middlewares/notes");
const { verifyToken } = require("../middlewares/auth");

router.get("/", verifyToken, controller.getNotes);
router.get("/:noteId", verifyToken, controller.getNote);
router.post("/", verifyToken, noteValidator, controller.createNote);
router.put("/:noteId", verifyToken, noteValidator, controller.updateNote);
router.delete("/:noteId", verifyToken, controller.deleteNote);

module.exports = router;
