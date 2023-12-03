// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");
const { Command } = require("../functions/command");
const {
  SistemMesajı,
  SistemAçık,
  SistemAçıldı,
  KanalYok,
} = require("../views/embeds");
const { Sistem } = require("../views/rows");

module.exports = new Command({
  slash: true,
  yetki: "Administrator",
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("uptime-sistemi-kur")
    .setDescription("Sunucuya ait uptime sistemi kurarsınız.")
    .setDMPermission(false)
    .addChannelOption((option) =>
      option
        .setName("kanal")
        .setDescription("Uptime sisteminin kurulacağı kanalı belirtin.")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    const kanal = interaction.options.getChannel("kanal", true);
    const sistemDurum = db.fetch(`UptimeSistemi_${interaction.guild.id}`);

    if (sistemDurum) return interaction.reply({ embeds: [SistemAçık] });
    if (!kanal.isTextBased()) return interaction.reply({ embeds: [KanalYok] });

    await interaction.reply({ embeds: [SistemAçıldı(kanal.id)] });
    await kanal.send({ embeds: [SistemMesajı], components: [Sistem] });
    return db.set(`UptimeSistemi_${interaction.guild.id}`, kanal.id);
  },
});
