// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const { Command } = require("../functions/command");
const { LinkEklemeFormu } = require("../views/forms");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("link-ekle")
    .setDescription("Sisteme link eklersiniz.")
    .setDMPermission(false),
  async execute(client, interaction) {
    return interaction.showModal(LinkEklemeFormu);
  },
});
