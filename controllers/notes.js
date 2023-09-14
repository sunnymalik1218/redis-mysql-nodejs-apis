const Notes = require("../models/notes");
const redisClient = require("../config/redis.js");
const createNoteFactory = require("../models/notesFactory");
const User = require("../models/users");
const { RESPONSE_MESSAGES } = require("../utils/responsemessages");
const { RESPONSE_STATUSES } = require("../utils/responsestatuses");
const logger = require("../utils/logger");
module.exports = {
// get all notes
getNotes : async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const notes = await Notes.findAll({ where: { user_id: user.id } });
    res.status(RESPONSE_STATUSES.STATUS_OK).json( notes );
  } catch (error) {
    logger.error(error);
    res
      .status(RESPONSE_STATUSES.STATUS_SERVER_ERROR)
      .json({ message: RESPONSE_MESSAGES.SERVER_TEMPORY_DOWN });
  }
},
// get note by id
getNote : async (req, res, next) => {
  try {
    // check data in redis
    const noteId = req.params.noteId;
    const noteRedis = await redisClient.get(noteId);
    if (noteRedis) {
      return res
        .status(RESPONSE_STATUSES.STATUS_OK)
        .json(  JSON.parse(noteRedis) );
    }
    const user = await User.findOne({ where: { email: req.user.email } });
    const note = await Notes.findByPk(noteId);
    if (!note) {
      return res
        .status(RESPONSE_STATUSES.STATUS_NOT_FOUND)
        .json({ message: RESPONSE_MESSAGES.NOTE_NOT_FOUND });
    }
    if (note.user_id !== user.id) {
      return res
        .status(RESPONSE_STATUSES.STATUS_UNAUTHORIZED)
        .json({ message: RESPONSE_MESSAGES.UNAUTHORIZED });
    }
    // set data in redis
    await redisClient.set(noteId, JSON.stringify(note));
    res.status(RESPONSE_STATUSES.STATUS_OK).json(note);
  } catch (error) {
    logger.error(error);
    res
      .status(RESPONSE_STATUSES.STATUS_SERVER_ERROR)
      .json({ message: RESPONSE_MESSAGES.SERVER_TEMPORY_DOWN });
  }
},
// create note
createNote :async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const title = req.body.title;
    const description = req.body.description;
    const type = req.body.type;
    const userId = user.id;
    const note = await createNoteFactory.createNoteFactory(title, description, userId, type);
    return res.status(RESPONSE_STATUSES.STATUS_CREATED).json({
      message: RESPONSE_MESSAGES.NOTE_ADDED,
      note,
    });
  } catch (error) {
    logger.error(error);
    res
      .status(RESPONSE_STATUSES.STATUS_SERVER_ERROR)
      .json({ message: RESPONSE_MESSAGES.SERVER_TEMPORY_DOWN });
  }
},

// update note
updateNote : async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const noteId = req.params.noteId;
    const title = req.body.title;
    const description = req.body.description;
    const type = req.body.type;
    const note = await Notes.findByPk(noteId);
    if (!note) {
      return res
        .status(RESPONSE_STATUSES.STATUS_NOT_FOUND)
        .json({ message: RESPONSE_MESSAGES.NOTE_NOT_FOUND });
    }
    if (note.user_id !== user.id) {
      return res
        .status(RESPONSE_STATUSES.STATUS_UNAUTHORIZED)
        .json({ message: RESPONSE_MESSAGES.UNAUTHORIZED });
    }
    note.title = title;
    note.description = description;
    note.type = type;
    await note.save();
    res
      .status(RESPONSE_STATUSES.STATUS_OK)
      .json({ message: RESPONSE_MESSAGES.NOTE_UPDATED, note: note });
  } catch (error) {
    logger.error(error);
    res
      .status(RESPONSE_STATUSES.STATUS_SERVER_ERROR)
      .json({ message: RESPONSE_MESSAGES.SERVER_TEMPORY_DOWN });
  }
},

// delete note
deleteNote : async (req, res, next) => {
  try {
    const noteId = req.params.noteId;
    const user = await User.findOne({ where: { email: req.user.email } });
    const note = await Notes.findByPk(noteId);
    if (!note) {
      return res
        .status(RESPONSE_STATUSES.STATUS_NOT_FOUND)
        .json({ message: RESPONSE_MESSAGES.NOTE_NOT_FOUND });
    }
    if (note.user_id !== user.id) {
      return res
        .status(RESPONSE_STATUSES.STATUS_UNAUTHORIZED)
        .json({ message: RESPONSE_MESSAGES.UNAUTHORIZED });
    }
    await note.destroy();
    res
      .status(RESPONSE_STATUSES.STATUS_OK)
      .json({ message: RESPONSE_MESSAGES.NOTE_DELETED });
  } catch (error) {
    logger.error(error);
    res
      .status(RESPONSE_STATUSES.STATUS_SERVER_ERROR)
      .json({ message: RESPONSE_MESSAGES.SERVER_TEMPORY_DOWN });
  }
}
};
