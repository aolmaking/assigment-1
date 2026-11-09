const express = require("express");
const controller = require("../controllers/note.controller");
const { requireLoggedUser, validateNoteId } = require("../middlewares/loggedUser");

const router = express.Router();

router.use(requireLoggedUser);

router.post("/", controller.createNote);
router.delete("/", controller.deleteAllNotes);

router.patch("/all", controller.updateAllNotesTitle);
router.put("/replace/:noteId", validateNoteId, controller.replaceNote);
router.get("/paginate-sort", controller.getPaginatedNotes);
router.get("/note-by-content", controller.getNoteByContent);
router.get("/note-with-user", controller.getNotesWithUser);
router.get("/aggregate", controller.aggregateNotes);

router.patch("/:noteId", validateNoteId, controller.updateNote);
router.get("/:noteId", validateNoteId, controller.getNoteById);
router.delete("/:noteId", validateNoteId, controller.deleteNote);

module.exports = router;
