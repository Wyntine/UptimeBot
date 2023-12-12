// @ts-check

const { existsSync, readFileSync } = require("fs");
const example = require("../views/settings.example.json");

const configPath = "./ayarlar.json";
const toChecked = Object.keys(example);
const types = Object.entries(example);

/**
 * @typedef {{
 *  prefix: string;
 *  botId: string;
 *  botName: string;
 *  ownerIds: string[];
 *  token: string;
 *  normalLimit: number;
 *  premiumLimit: number;
 *  uptimeLogChannel: string;
 *  premiumLogChannel: string;
 *  blacklistLogChannel: string;
 *  noWarn: boolean
 * }} ConfigData
 * @returns {ConfigData}
 */
function getConfig() {
  const fileData = existsSync(configPath)
    ? JSON.parse(readFileSync(configPath, "utf-8"))
    : {};

  /** @type {Partial<ConfigData>} */
  let finalData = {};

  for (const key of toChecked) {
    if (key in fileData) {
      finalData[key] = fileData[key];
    } else if (key in process.env) {
      finalData[key] = process.env[key];
    }
  }

  const keys = Object.keys(finalData);
  const notGiven = toChecked.filter((key) => !keys.includes(key));

  if (notGiven.length) {
    console.error(
      [
        "+> Ayar dosyalarınızda hiç bulunmayan bazı girdiler var:",
        `-> ${notGiven.join(", ")}`,
        "+> Eksikleri doldurup botu yeniden başlatınız.",
      ].join("\n")
    );
    process.exit(0);
  }

  const typeFails = types.filter(
    ([key, value]) => typeof finalData[key] !== typeof value
  );

  if (typeFails.length) {
    console.error(
      [
        "+> Ayarlarınızdaki bazı ayarlar olması gereken ayarlarla aynı türde değil:",
        `-> ${typeFails.map(([key]) => key).join(", ")}`,
        "+> .env'e metin (string) değeri almayan bir ayar girdiyseniz onu ayarlar.json'a taşıyın.",
      ].join("\n")
    );
    process.exit(0);
  }

  // @ts-ignore
  return finalData;
}

function checkConfig() {
  const { noWarn } = getConfig();

  if (noWarn) return;

  if (!existsSync(configPath))
    return console.warn(
      [
        "+> ayarlar.json bulunamadı. Ayarlar .env'den alınacak.",
        "+> ayarlar.json'un bir kopyasını views/ klasöründen alabilirsiniz.",
        "+> ayarlar.json'a yazacağınız ayarlar .env'e yazacaklarınızın üzerine yazacaktır.",
        "-> Bu uyarıyı kapatmak için 'noWarn' ayarını true değerine getirebilirsiniz.",
      ].join("\n")
    );

  return console.warn(
    [
      "+> ayarlar.json'u .env ile birlikte kullanıyorsunuz.",
      "+> ayarlar.json'a yazacağınız ayarlar .env'dekilerin üzerine yazacaktır.",
      "+> .env dosyasında kullanmak istediğiniz ayarları ayarlar.json'dan silin.",
      "+> Projeyi Glitch veya Replit gibi bir platformda kullanıyorsanız ayarlarınızı .env dosyasına taşımanız güvenliğiniz için daha iyidir.",
      "-> Bu uyarıyı kapatmak için 'noWarn' ayarını true değerine getirebilirsiniz.",
    ].join("\n")
  );
}

module.exports = { getConfig, checkConfig };
