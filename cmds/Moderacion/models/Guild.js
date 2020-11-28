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
    LogChannel: String,
    log: {
    Premium: Boolean,
    channelCreate: Boolean,
    channelDelete: Boolean,
    channelUpdate: Boolean,
    emojiCreate: Boolean,
    emojiDelete: Boolean,
    emojiUpdate: Boolean,
    banAdd: Boolean,
    banRemove: Boolean,
    MemberAdd: Boolean,
    MemberRemove: Boolean,
    MemberUpdate: Boolean,
    guildUpdate: Boolean,
    inviteCreate: Boolean,
    inviteDelete: Boolean,
    messageDelete: Boolean,
    messageDeleteBulk: Boolean,
    messageUpdate: Boolean,
    roleCreate: Boolean,
    roleDelete: Boolean,
    roleUpdate: Boolean,
    userUpdate: Boolean,
    voiceState: Boolean
    },
    warns: [{
      warnUser: String,
      warnUserID: String,
      warnedByID: [],
      warnReason: [],
      warnLevel: Number
    }],
    role: [{
      autoRole: Boolean,
      autoRoleChannel: Boolean,
      Roles: []
    }],
    muterole: String,
    muteUsers: [],
    suggestionChannel: String,
    suggestionLevel: Number,
    confessionChannel: String,
    confessionLevel: Number,
    allyRole: String,
    allyModRole: String
  })
  module.exports = mongoose.model("Guild", guildSchema)