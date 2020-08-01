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
    warns: [{
      _id: mongoose.Schema.Types.ObjectId(),
      warnUser: String,
      warnUserID: String,
      warnedByID: [],
      warnReason: [],
      warnLevel: Number
    }]
  })
  module.exports = mongoose.model("Guild", guildSchema)