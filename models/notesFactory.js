// Objective: create a factory to create notes
const Notes = require("../models/notes");
    
module.exports = {
    // create note by Type
    createNoteFactory: async (title, description, userId, type) => {
        let note;
        if (type === "Work") {
            note = await Notes.createWorkNote(title, description, userId);
        } else if (type === "Personal") {
            note = await Notes.createPersonalNote(title, description, userId);
        }
        return note;
    },
}