const Sequelize = require("sequelize");
const db = require("../config/database");
const enums = require("../utils/enums");
const User = require("./users");

const Notes = db.define("notes", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  type: { type: Sequelize.DataTypes.ENUM(enums.NOTES_TYPES), allowNull: false },
});
Notes.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Notes.createWorkNote = async (title, description, userId) => {
  this.type = "Work";
  this.title = title;
  this.description = description;
  this.user_id = userId;
  return await Notes.create(this);
}
Notes.createPersonalNote = async (title, description, userId) => {
  this.type = "Personal";
  this.title = title;
  this.description = description;
  this.user_id = userId;
 return await Notes.create(this);
}
module.exports = Notes;
