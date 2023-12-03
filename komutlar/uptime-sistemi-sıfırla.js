// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");
const { Command } = require("../functions/command");
const { SistemKapalı, SistemKapandı } = require("../views/embeds");

module.exports = new Command({
  slash: true,
  yetki: "Administrator",
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("uptime-sistemi-sıfırla")
    .setDescription("Sunucudaki uptime sistemini sıfırlarsınız.")
    .setDMPermission(false),
  async execute(client, interaction) {
    const sistemDurum = db.fetch(`UptimeSistemi_${interaction.guild.id}`);

    if (!sistemDurum) return interaction.reply({ embeds: [SistemKapalı] });

    await interaction.reply({ embeds: [SistemKapandı] });
    return db.delete(`UptimeSistemi_${interaction.guild.id}`);
  },
});
