const Guild = require('./Guild')
const defaultSettings = require('./config')
const mongoose = require('mongoose');
let getGuild = async (guild) => {
    let data = Guild.findOne({ guildID: guild.id }).then(result => {
   if (result) defaultSettings.prefix = result.prefix
    else {
      const newGuild = {
        guildID: guild.id,
        guildName: guild.name,
        guildOwner: guild.owner.user.username,
        guildOwnerID: guild.ownerID,
        prefix: '!',
        JoinMsg: "",
        JoinBool: false,
        LeaveMsg: "",
        LeaveBool: false,
        WelcomeChannel: "",
        LeaveChannel: "",
        warns: []
      };
      try {
        createGuild(newGuild);
      } catch (error) {
        console.error(error);
      }
    }
    })
  }
  
  let updateGuild = async (guild, settings) => {
    let data = getGuild(guild);
    if (typeof data !== 'object') data = {};
    for (const key in settings) {
        if (data[key] !== settings[key]) data[key] = settings[key];
        else return;
    }
    return Guild.updateOne({ guildID: guild.id }, settings);
  };
  
  let createGuild = async (settings) => {
    let defaults = Object.assign({ _id: mongoose.Types.ObjectId() });
    let merged = Object.assign(defaults, settings);
  
    const newGuild = new Guild(merged);
    return newGuild.save()
  }
  function search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].warnUserID === nameKey) {
            return myArray[i];
        }
    }
}
function searchAndDelete(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
  if (myArray[i].warnUserID === nameKey) {
      return i
  }
}
}
module.exports = {
    getGuild,
    updateGuild,
    createGuild,
    search,
    searchAndDelete
}