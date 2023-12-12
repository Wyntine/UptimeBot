// @ts-check

const {
  ActionRowBuilder,
  ButtonBuilder,
  TextInputBuilder,
} = require("discord.js");
const settings = require("./config").getConfig();
const { client } = require("../client");
const { ownerIds } = settings;
const db = require("croxydb");

/**
 * @param {ButtonBuilder[]} components
 */
function buttonRow(components) {
  /** @type {ActionRowBuilder<ButtonBuilder>} */
  const builder = new ActionRowBuilder();
  return builder.addComponents(components);
}

/**
 * @param {TextInputBuilder[]} components
 */
function inputRow(components) {
  /** @type {ActionRowBuilder<TextInputBuilder>} */
  const builder = new ActionRowBuilder();
  return builder.addComponents(components);
}

/**
 * @param {string} id
 */
function checkAdmin(id) {
  return ownerIds.includes(id);
}

/**
 * @param {"uptimeLogChannel" | "premiumLogChannel" | "guildLogChannel" | "blacklistLogChannel"} logType
 * @param {import("discord.js").MessageCreateOptions} message
 */
async function sendLog(logType, message) {
  const channel = client.channels.cache.get(settings[logType]);

  if (!channel)
    return console.error(
      `[Hata] ayarlar.json'daki ${logType} kanalı bulunamadı.`
    );
  if (!channel.isTextBased())
    return console.error(
      `[Hata] ayarlar.json'daki ${logType} kanalı bir metin kanalı değil.`
    );

  return await channel.send(message);
}

/**
 * @param {string} text
 */
function replacePermText(text) {
  return text
    .replace("ManageEmojis", "Emojileri Yönet")
    .replace("KickMembers", "Kullanıcıyı Uzaklaştır")
    .replace("BanMembers", "Kullanıcıyı Yasakla")
    .replace("Administrator", "Yönetici")
    .replace("ManageChannels", "Kanalları Yönet")
    .replace("ManageMessages", "Mesajları Yönet")
    .replace("ManageRoles", "Rolleri Yönet");
}

function replaceTimeText(/** @type {string} */ text) {
  return text
    .replace("gün", "day")
    .replace("saat", "hours")
    .replace("hafta", "week");
}

function getAllLinks() {
  const data = db.all();
  const links = [];

  for (const key in data) {
    if (key.startsWith("UptimeLink_")) links.push(...data[key]);
  }

  return links;
}

function removeEmptyData() {
  const data = db.all();

  for (const key in data) {
    const item = data[key];
    const deleteCheck =
      (Array.isArray(item) && !item.length) ||
      (typeof item === "object" && item !== null && !Object.keys(item).length);

    if (deleteCheck) db.delete(key);
  }
}

module.exports = {
  buttonRow,
  inputRow,
  checkAdmin,
  sendLog,
  replacePermText,
  replaceTimeText,
  getAllLinks,
  removeEmptyData,
};
