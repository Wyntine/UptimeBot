// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");
const { Command } = require("../functions/command");
const { Destek } = require("../views/rows");
const { PremiumDeaktif, PremiumDurum } = require("../views/embeds");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("premium-kontrol")
    .setDescription("Premium üyeliğinizin olup, olmadığı hakkında bilgi verir.")
    .setDMPermission(false),
  async execute(client, interaction) {
    const PremiumÜye = db.fetch(`PremiumÜye_${interaction.user.id}`);

    if (!PremiumÜye)
      return interaction.reply({
        embeds: [PremiumDeaktif],
        components: [Destek],
      });

    return interaction.reply({ embeds: [PremiumDurum(interaction.user.id)] });
  },
});
