// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const ms = require("ms");
const db = require("croxydb");
const {
  checkAdmin,
  sendLog,
  replaceTimeText,
} = require("../functions/general");
const {
  YetkiYok,
  PremiumVar,
  PremiumVerildi,
  PremiumEklendi,
  PremiumGitti,
} = require("../views/embeds");
const { Command } = require("../functions/command");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("süreli-premium")
    .setDescription("Bot sahibi özel komutu.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("kullanıcı")
        .setDescription("Premium verilecek kullanıcıyı belirtin.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("süre")
        .setDescription("Premium verilecek süreyi belirtin.")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    if (!checkAdmin(interaction.user.id))
      return interaction.reply({ embeds: [YetkiYok] });

    const kullanıcı = interaction.options.getUser("kullanıcı", true);
    const süre = interaction.options.getString("süre", true);
    const PremiumÜye = db.fetch(`PremiumÜye_${kullanıcı.id}`);

    if (PremiumÜye)
      return interaction.reply({ embeds: [PremiumVar(kullanıcı)] });

    const PremiumBitiş = Date.now() + ms(replaceTimeText(süre));
    db.set(`PremiumÜye_${kullanıcı.id}`, true);
    db.add(`PremiumSayı`, 1);
    db.set(`Premium_${kullanıcı.id}`, {
      Bitiş: PremiumBitiş,
      Başlangıç: Date.now(),
    });
    await interaction.reply({
      embeds: [PremiumEklendi(kullanıcı, PremiumBitiş)],
    });
    await sendLog("premiumLogChannel", {
      embeds: [PremiumVerildi(kullanıcı, PremiumBitiş)],
    });

    setTimeout(() => {
      db.delete(`PremiumÜye_${kullanıcı.id}`);
      db.delete(`Premium_${kullanıcı.id}`);
      db.subtract(`PremiumSayı`, 1);
      sendLog("premiumLogChannel", { embeds: [PremiumGitti(kullanıcı)] });
    }, ms(replaceTimeText(süre)));
  },
});
