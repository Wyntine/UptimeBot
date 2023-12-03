// @ts-check

const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const { inputRow } = require("../functions/general.js");

//=====// LinkEklemeFormu \\=====\\
const LinkEklemeFormu = new ModalBuilder()
  .setCustomId("linkeklemeform2")
  .setTitle("Link ekle");

const LinkEkleFormu = new TextInputBuilder()
  .setCustomId("linkekle")
  .setLabel("Proje adresinizi giriniz.")
  .setStyle(TextInputStyle.Paragraph)
  .setMinLength(20)
  .setMaxLength(100)
  .setPlaceholder("https://proje-linki.glitch.me")
  .setRequired(true);
const LinkEklemeSistemi = inputRow([LinkEkleFormu]);
LinkEklemeFormu.addComponents(LinkEklemeSistemi);
//=====// LinkEklemeFormu \\=====\\

//=====// LinkSilmeFormu \\=====\\
const LinkSilmeFormu = new ModalBuilder()
  .setCustomId("linksilmeform2")
  .setTitle("Link sil");

const LinkSilFormu = new TextInputBuilder()
  .setCustomId("linksil")
  .setLabel("Proje adresinizi giriniz.")
  .setStyle(TextInputStyle.Paragraph)
  .setMinLength(20)
  .setMaxLength(100)
  .setPlaceholder("https://proje-linki.glitch.me")
  .setRequired(true);
const LinkSilmeSistemi = inputRow([LinkSilFormu]);
LinkSilmeFormu.addComponents(LinkSilmeSistemi);
//=====// LinkSilmeFormu \\=====\\

//=====// SilmeFormu \\=====\\
const SilmeFormu = new ModalBuilder()
  .setCustomId("silmeform")
  .setTitle("Link sil");

const SilFormu = new TextInputBuilder()
  .setCustomId("sil")
  .setLabel("Proje adresinizi giriniz.")
  .setStyle(TextInputStyle.Paragraph)
  .setMinLength(20)
  .setMaxLength(100)
  .setPlaceholder("https://proje-linki.glitch.me")
  .setRequired(true);
const SilmeSistemi = inputRow([SilFormu]);
SilmeFormu.addComponents(SilmeSistemi);

const SilID = new TextInputBuilder()
  .setCustomId("silid")
  .setLabel("Projesi silinecek kullanıcı idsini giriniz.")
  .setStyle(TextInputStyle.Paragraph)
  .setMinLength(18)
  .setMaxLength(20)
  .setPlaceholder("873182701061021696")
  .setRequired(true);
const SilmeID = inputRow([SilID]);
SilmeFormu.addComponents(SilmeID);

const Sebep = new TextInputBuilder()
  .setCustomId("sebep")
  .setLabel("Projeyi silme sebebini belirtin.")
  .setStyle(TextInputStyle.Paragraph)
  .setPlaceholder("Geçersiz link.")
  .setRequired(true);
const SilmeSebep = inputRow([Sebep]);
SilmeFormu.addComponents(SilmeSebep);
//=====// SilmeFormu \\=====\\

module.exports = { SilmeFormu, LinkEklemeFormu, LinkSilmeFormu };
