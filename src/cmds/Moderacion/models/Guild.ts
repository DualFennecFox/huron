import mongoose, { Document } from 'mongoose'

export interface ILog {
  Premium: boolean,
  channelCreate: boolean,
  channelDelete: boolean,
  channelUpdate: boolean,
  emojiCreate: boolean,
  emojiDelete: boolean,
  emojiUpdate: boolean,
  banAdd: boolean,
  banRemove: boolean,
  MemberAdd: boolean,
  MemberRemove: boolean,
  MemberUpdate: boolean,
  guildUpdate: boolean,
  inviteCreate: boolean,
  inviteDelete: boolean,
  messageDelete: boolean,
  messageDeleteBulk: boolean,
  messageUpdate: boolean,
  roleCreate: boolean,
  roleDelete: boolean,
  roleUpdate: boolean,
  userUpdate: boolean,
  voiceState: boolean
}

export interface IWarns {
  warnUser: string,
  warnUserID: string,
  warnedByID: string[],
  warnReason: string[],
  warnLevel: number
}

export interface IRole {
  autoRole: boolean,
  autoRoleChannel: boolean,
  Roles: string[]
}

export interface IGuild extends Document {
  guildID: string,
  guildName: string,
  guildOwner: string,
  guildOwnerID: string,
  prefix: string,
  JoinMsg: string,
  JoinBool: boolean,
  LeaveMsg: string,
  LeaveBool: boolean,
  WelcomeChannel: string,
  LeaveChannel: string,
  LogChannel: string,
  log: ILog | null,
  warns: Array<IWarns>,
  role: IRole | null,
  muterole: string,
  muteUsers: string[],
  suggestionChannel: string,
  suggestionLevel: number,
  confessionChannel: string,
  confessionLevel: number,
}

const guildSchema = new mongoose.Schema<IGuild>({})
const GuildModel = mongoose.model("Guild", guildSchema)
export default GuildModel