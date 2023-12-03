// @ts-check

const {
  ChatInputCommandInteraction,
  Client,
  Message,
  SlashCommandBuilder,
} = require("discord.js");

/**
 * @template {boolean} Slash
 */
class Command {
  /**
   * @typedef {"ManageEmojis" | "ManageChannels" | "ManageMessages" | "ManageRoles" | "KickMembers" | "BanMembers" | "Administrator"} Yetki
   * @typedef {SlashCommandBuilder | import("discord.js").SlashCommandOptionsOnlyBuilder | import("discord.js").SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">} Builder
   * @typedef {(client: Client<true>, interaction: Slash extends true ? ChatInputCommandInteraction<"cached"> : Message<true>) => any} Execute
   * @typedef {{ slash: Slash, yetki?: Yetki, cooldown?: number, execute: Execute }} BaseData
   * @typedef {BaseData & { data: Builder }} SlashData
   * @typedef {BaseData} MessageData
   * @typedef {Slash extends true ? SlashData : MessageData} CommandData
   * @param {CommandData} options
   */
  constructor(options) {
    const { slash, yetki, cooldown = 0, execute } = options;
    this.slash = slash;
    this.yetki = yetki;
    this.cooldown = cooldown;
    this.execute = execute;

    if (slash) this.data = options.data;
  }
}

module.exports = { Command };
