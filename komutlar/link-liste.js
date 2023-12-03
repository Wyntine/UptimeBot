// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");
const { Command } = require("../functions/command");
const { ProjeEklenmemiş, LinkListe } = require("../views/embeds");
const { Link } = require("../views/emojis");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("link-liste")
    .setDescription("Sistemdeki linklerinizi listeler.")
    .setDMPermission(false),
  async execute(client, interaction) {
    const links = db.get(`UptimeLink_${interaction.user.id}`);

    if (!links) return interaction.reply({ embeds: [ProjeEklenmemiş] });

    const linkString = (db.get(`UptimeLink_${interaction.user.id}`) ?? [])
      .map((map) => `${Link} **Link:** ${map}`)
      .join("\n");

    return interaction.reply({
      embeds: [LinkListe(linkString)],
      ephemeral: true,
    });
  },
});
