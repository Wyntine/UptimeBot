// @ts-check

const { InteractionType } = require("discord.js");
const db = require("croxydb");
const {
  ProjeYok,
  Silindi,
  FazlaLink,
  PreYok,
  LinkVar,
  BaşıHatalı,
  SonuHatalı,
  LinkEklendi,
  LinkSilindi,
  ProjeEklenmemiş,
  Kullanamazsın,
  Bakımda,
  ProjeSilindi,
  ProjeEklendi,
  YönetimProjeSilindi,
  LinkListe,
} = require("../views/embeds");
const { LinkEklemeFormu, LinkSilmeFormu } = require("../views/forms");
const { premiumLimit, normalLimit } =
  require("../functions/config").getConfig();
const { Destek } = require("../views/rows");
const { Tik, Çarpı, Link } = require("../views/emojis");
const { sendLog, checkAdmin } = require("../functions/general");
const { Event } = require("../functions/event");

module.exports = new Event({
  name: "interactionCreate",
  async execute(interaction) {
    const user = interaction.user;

    if (interaction.type === InteractionType.ModalSubmit) {
      if (interaction.customId === "silmeform") {
        const linkInput = interaction.fields.getTextInputValue("sil");
        const linkId = interaction.fields.getTextInputValue("silid");
        const reason = interaction.fields.getTextInputValue("sebep");
        const links = db.get(`UptimeLink_${linkId}`) ?? [];

        if (!links.includes(linkInput))
          return interaction.reply({ embeds: [ProjeYok] });

        db.unpush(`UptimeLink_${linkId}`, linkInput);

        await interaction.reply({ embeds: [Silindi] });
        const PreVarmı = db.fetch(`PremiumÜye_${linkId}`) ? Tik : Çarpı;
        return sendLog("uptimeLogChannel", {
          embeds: [YönetimProjeSilindi(linkId, PreVarmı, reason)],
        });
      }

      if (interaction.customId === "linkeklemeform2") {
        if (!db.fetch(`UptimeLink_${user.id}`))
          db.set(`UptimeLink_${user.id}`, []);

        const linkInput = interaction.fields.getTextInputValue("linkekle");
        const link = db.fetch(`UptimeLink_${user.id}`) ?? [];
        const PremiumÜye = db.fetch(`PremiumÜye_${user.id}`);

        if (!linkInput) return;

        const uptimeCount = db.fetch(`UptimeLink_${user.id}`).length;

        if (uptimeCount >= (PremiumÜye ? premiumLimit : normalLimit))
          return interaction.reply({
            embeds: [PremiumÜye ? FazlaLink : PreYok],
            ephemeral: true,
          });
        if (link.includes(linkInput))
          return interaction.reply({ embeds: [LinkVar], ephemeral: true });
        if (!linkInput.startsWith("https://"))
          return interaction.reply({ embeds: [BaşıHatalı], ephemeral: true });
        if (!linkInput.endsWith(".glitch.me"))
          return interaction.reply({ embeds: [SonuHatalı], ephemeral: true });

        db.push(`UptimeLink_${user.id}`, linkInput);

        await interaction.reply({ embeds: [LinkEklendi], ephemeral: true });
        const PreVarmı = db.fetch(`PremiumÜye_${user.id}`) ? Tik : Çarpı;
        return sendLog("uptimeLogChannel", {
          embeds: [ProjeEklendi(interaction.user, PreVarmı)],
        });
      }

      if (interaction.customId === "linksilmeform2") {
        const links = db.get(`UptimeLink_${user.id}`) ?? [];
        const linkInput = interaction.fields.getTextInputValue("linksil");

        if (!links.includes(linkInput))
          return interaction.reply({ embeds: [ProjeYok], ephemeral: true });

        db.unpush(`UptimeLink_${user.id}`, linkInput);
        await interaction.reply({ embeds: [LinkSilindi], ephemeral: true });
        const PreVarmı = db.fetch(`PremiumÜye_${user.id}`) ? Tik : Çarpı;
        return sendLog("uptimeLogChannel", {
          embeds: [ProjeSilindi(interaction.user, PreVarmı)],
        });
      }
    } else if (interaction.type === InteractionType.MessageComponent) {
      if (interaction.customId === "eklebuton") {
        if (db.fetch(`Karaliste_${user.id}`))
          return interaction.reply({
            embeds: [Kullanamazsın],
            components: [Destek],
            ephemeral: true,
          });
        if (db.fetch(`Bakım`) && !checkAdmin(user.id))
          return interaction.reply({
            embeds: [Bakımda()],
            components: [Destek],
          });

        return await interaction.showModal(LinkEklemeFormu);
      }

      if (interaction.customId === "silbuton") {
        if (db.fetch(`Karaliste_${user.id}`))
          return interaction.reply({
            embeds: [Kullanamazsın],
            components: [Destek],
            ephemeral: true,
          });
        if (db.fetch(`Bakım`) && !checkAdmin(user.id))
          return interaction.reply({
            embeds: [Bakımda()],
            components: [Destek],
          });

        return await interaction.showModal(LinkSilmeFormu);
      }

      if (interaction.customId === "listebuton") {
        if (db.fetch(`Karaliste_${user.id}`))
          return interaction.reply({
            embeds: [Kullanamazsın],
            components: [Destek],
            ephemeral: true,
          });
        if (db.fetch(`Bakım`) && !checkAdmin(user.id))
          return interaction.reply({
            embeds: [Bakımda()],
            components: [Destek],
          });

        const links = db.get(`UptimeLink_${user.id}`);

        if (!links)
          return interaction.reply({
            embeds: [ProjeEklenmemiş],
            ephemeral: true,
          });

        const linkString = links
          .map((map) => `${Link} **Link:** ${map}`)
          .join("\n");

        return interaction.reply({
          embeds: [LinkListe(linkString)],
          ephemeral: true,
        });
      }
    }
  },
});
