const mongoose = require('mongoose')

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    guildName: String,
    guildOwner: String,
    guildOwnerID: String,
    prefix: String,
    JoinMsg: String,
    JoinBool: Boolean,
    LeaveMsg: String,
    LeaveBool: Boolean,
    WelcomeChannel: String,
    LeaveChannel: String,
  })
  module.exports = mongoose.model("Guild", guildSchema)