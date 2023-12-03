// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");
const { Command } = require("../functions/command");
const { checkAdmin, sendLog } = require("../functions/general");
const {
  YetkiYok,
  PremiumVar,
  KalıcıPremiumVerildi,
  KalıcıPremiumEklendi,
} = require("../views/embeds");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("premium-ver")
    .setDescription("Bot sahibi özel komutu.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("kullanıcı")
        .setDescription("Premium verilecek kullanıcıyı belirtin.")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    if (!checkAdmin(interaction.user.id))
      return interaction.reply({ embeds: [YetkiYok] });

    const kullanıcı = interaction.options.getUser("kullanıcı", true);
    const PremiumÜye = db.fetch(`PremiumÜye_${kullanıcı.id}`);

    if (PremiumÜye)
      return interaction.reply({ embeds: [PremiumVar(kullanıcı)] });

    db.set(`PremiumÜye_${kullanıcı.id}`, true);
    db.add(`PremiumSayı`, 1);
    await interaction.reply({ embeds: [KalıcıPremiumEklendi(kullanıcı)] });
    await sendLog("premiumLogChannel", {
      embeds: [KalıcıPremiumVerildi(kullanıcı)],
    });
  },
});
