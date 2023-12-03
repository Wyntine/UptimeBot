// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const { SilmeFormu } = require("../views/forms.js");
const { checkAdmin } = require("../functions/general.js");
const { Command } = require("../functions/command.js");
const { YetkiYok } = require("../views/embeds.js");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("sil")
    .setDescription("Bot sahibi özel komutu.")
    .setDMPermission(false),
  async execute(client, interaction) {
    if (!checkAdmin(interaction.user.id))
      return interaction.reply({ embeds: [YetkiYok] });

    await interaction.showModal(SilmeFormu);
  },
});
