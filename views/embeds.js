// @ts-check

const {
  EmbedBuilder,
  Colors,
  User,
  GuildMember,
  ChatInputCommandInteraction,
} = require("discord.js");
const db = require("croxydb");
const {
  Çarpı,
  Tik,
  Yasak,
  Bakım,
  Belge,
  Id,
  İsim,
  Kullanıcı,
  Link,
  Premium,
  Yazı,
  Bot,
  Duyuru,
  Saat,
  Ping,
  Limit,
  Karaliste,
  Yetkili,
  Sebep,
  Ram,
  Sunucu,
  Uptime,
  Node,
  Js,
  Tac,
  Giriş,
  Çıkış,
  Hata: HataEmoji,
  Davet,
  Destek,
  Oy,
} = require("./emojis");
const { ownerIds, premiumLimit, normalLimit, botName } =
  require("../functions/config").getConfig();
const { dependencies } = require("../package.json");
const moment = require("moment");
const { getAllLinks } = require("../functions/general");
require("moment-duration-format");

const Hata = (/** @type {string | null} */ description) =>
  new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle("Hata")
    .setDescription(description);
const Başarı = (/** @type {string | null} */ description) =>
  new EmbedBuilder()
    .setColor(Colors.Yellow)
    .setTitle("Başarılı")
    .setDescription(description);

const YetkiYok = Hata(
  `${Çarpı} Bu komutu kullanabilmek için **Bot sahibi** olmalısın.`
);
const PreYok = Hata(
  `${Çarpı} **Normal bir kullanıcı en fazla 3 proje ekleyebilir, Destek sunucusuna gelerek link limitinizi arttırabilir veya </pre-al:0> komutu ile premium alarak sınırsız link ekleyebilirsiniz.**`
);
const FazlaLink = Hata(
  `${Çarpı} **Bir kullanıcı tarafından en fazla 999 link eklenebilir.**`
);
const LinkVar = Hata(`${Çarpı} **Belirtilen proje sistemde bulunuyor.**`);
const BaşıHatalı = Hata(
  `${Çarpı} **Proje linkin hatalı, linkin başında \`https://\` olduğundan emin ol.**`
);
const SonuHatalı = Hata(
  `${Çarpı} **Yalnızca glitch projeleri aktif tutulmaktdır, linkin sonunda \`.glitch.me\` olduğundan emin ol.**`
);
const LinkEklendi = Başarı(
  `${Tik} **Projen başarıyla sisteme eklendi, linkiniz 2-5 dk içerisinde aktif olacaktır.**`
);
const KanalYok = Hata(`${Çarpı} **Verilen kanal bulunamadı.**`);
const ProjeYok = Hata(`${Çarpı} **Sistemde böyle bir proje bulunmuyor.**`);
const LinkSilindi = Başarı(`${Tik} **Projen başarıyla sistemden silindi.**`);
const Silindi = Başarı(`${Tik} **Proje başarıyla sistemden silindi.**`);
const ProjeEklenmemiş = Hata(`${Çarpı}  **Sisteme hiç proje eklememişsin.**`);
const Kullanamazsın = Hata(
  `${Yasak} **Karalistemde bulunduğun için komutlarımı kullanmazsın, karalisteye alınma sebebini öğrenmek için veya karalisteden çıkartılmak için destek sunucuma gelebilirsin.**`
).setTitle("Komutlarımı kullanamazsın");
const YenidenBaşlat = Başarı(`${Tik} **Bot yeniden başlatılıyor.**`);
const SistemKapalı = Hata(
  `${Çarpı} **Sistem zaten kapalı. Ayarlamak için: </uptime-sistemi-kur:0>**`
);
const SistemKapandı = Başarı(`${Tik} **Uptime sistemi başarıyla sıfırlandı.**`);
const SistemMesajı = new EmbedBuilder()
  .setColor(Colors.Blurple)
  .setTitle(`${botName} • Uptime sistemi`)
  .setDescription(
    [
      "> **Uptime sistemine hoş geldiniz.**",
      "> **Aşağıdaki `Ekle` - `Sil` - `Liste` butonları ile sistemi kullanabilirsiniz.**",
      "> **Diğer komutlarıma erişmek için </yardım:0> komutunu kullanabilirsiniz.**",
    ].join("\n")
  );

const SistemAçık = Hata(
  `${Çarpı} **Sistem zaten açık. Sıfırlamak için: </uptime-sistemi-sıfırla:0>**`
);
const PremiumDeaktif = new EmbedBuilder()
  .setColor(Colors.Red)
  .setTitle("Premium bulunmuyor")
  .setDescription(
    `${Çarpı} **Premium üyeliğiniz bulunmamaktadır, Premium üyelik almak için destek sunucusuna gelebilirsiniz.**`
  );
const Token = Hata(`${Çarpı} **Bu şekilde tokenimi alamazsın.**`);
const DavetEmbed = new EmbedBuilder()
  .setTitle(`${botName} • Linkler`)
  .setColor(Colors.Blurple)
  .setDescription(
    [
      `> ${Davet} **Beni kullanmayı sevdiysen sunucuna ekleyebilirsin.**`,
      `> ${Destek} **Bir öneri, hata bildirmek için veya karalisteye alındıysan açtırmak için destek sunucuma katılabilirsin.**`,
      `> ${Oy} **Oy vererek bize destek olabilirsin ve bazı komutlara erişim sağlarsınız.**`,
    ].join("\n")
  );
const BakımKapalı = Hata(`${Çarpı} **Bot zaten bakımda bulunmuyor.**`);
const BakımKapatıldı = Başarı(`${Tik} **Bot bakımdan çıkartıldı.**`);

const KaralistedeBulunuyor = (/** @type {User} */ kullanıcı) =>
  Hata(`${Çarpı} ${kullanıcı} **adlı kullanıcı zaten karalistede bulunuyor.**`);
const KaralistedeVar = (/** @type {User} */ kullanıcı) =>
  new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle("Karalistede")
    .setDescription(
      `${Karaliste} ${kullanıcı} **adlı kullanıcı karalistede bulunuyor, komutları kullanamaz.**`
    );
const KaralisteEklendi = (/** @type {User} */ kullanıcı) =>
  Başarı(
    `${Tik} ${kullanıcı} **adlı kullanıcı karalisteye eklendi, artık botu kullanamayacak.**`
  );
const KaralistedeYok = (/** @type {User} */ kullanıcı) =>
  new EmbedBuilder()
    .setColor(Colors.Green)
    .setTitle("Karalistede değil")
    .setDescription(
      `${Tik} ${kullanıcı} **adlı kullanıcı karalistede bulunmuyor, komutları kullanabilir.**`
    );
const PremiumVar = (/** @type {User | GuildMember} */ user) =>
  Hata(
    `${Çarpı} ${user} **adlı kullanıcının zaten premium üyeliği bulunuyor.**`
  );
const Yardım = () => {
  const duyurular = (db.fetch(`Duyurular`) ?? [])
    .map((y) => `**${Duyuru} Duyuru: \`${y}\`**`)
    .join("\n");

  return new EmbedBuilder()
    .setColor(Colors.Blurple)
    .setTitle(`${botName} • Yardım menüsü`)
    .setDescription(
      [
        "</yardım:0> Yardım menüsünü gösterir.",
        "</istatistik:0> Bot istatistiklerini gösterir.",
        "</ping:0> Botun ping değerlerini gösterir.",
        "</link-say:0> Sistemdeki link sayılarını gösterir.",
        "</link-ekle:0> Sisteme link eklersiniz.",
        "</link-sil:0> Sistemden link silersiniz.",
        "</link-liste:0> Sistemdeki linklerinizi listeler.",
        "</premium-kontrol:0> Premium üyeliğinizin olup, olmadığını gösterir.",
        "</davet:0> Bot linklerini gösterir.",
        "</uptime-sistemi-kur:0> Sunucuya özel butonlu uptime sistemini kurarsınız.",
        "</uptime-sistemi-sıfırla:0> Sunucudaki uptime sistemini sıfırlar.",
        "",
        `**${Bot} Bot duyuruları**`,
        `${duyurular || "Aktif bir duyuru bulunmuyor."}`,
      ].join("\n")
    );
};
const Bakımda = () =>
  Hata(
    `${Bakım} **Sizlere en iyi hizmeti vermek için kısa süreliğine bakımdayız. Daha ayrıntılı bilgi için destek sunucusuna gelebilirsiniz. Bakım sebebi: \`${db.fetch(
      `BakımSebep`
    )}\`**`
  ).setTitle("Bot bakımda");
const ProjeDurum = (/** @type {User} */ user, /** @type {String} */ pre) =>
  new EmbedBuilder()
    .addFields({
      name: `${Kullanıcı} **Kullanıcı adı**`,
      value: `<@${user.id}>`,
    })
    .addFields({
      name: `${İsim} **Kullanıcı tagı**`,
      value: `${user.tag}`,
    })
    .addFields({
      name: `${Id} **Kullanıcı id**`,
      value: `${user.id}`,
    })
    .addFields({
      name: `${Belge} **Sistemdeki link sayısı**`,
      value: `${getAllLinks().length}`,
    })
    .addFields({
      name: `${Link} **Kullanıcının link sayısı**`,
      value: `${db.fetch(`UptimeLink_${user.id}`).length}`,
    })
    .addFields({
      name: `${Premium} **Kullanıcının premiumu bulunuyormu**`,
      value: `${pre}`,
    });
const ProjeSilindi = (/** @type {User} */ user, /** @type {string} */ pre) =>
  ProjeDurum(user, pre)
    .setTitle("Sistemden bir link silindi")
    .setColor(Colors.Red);
const ProjeEklendi = (/** @type {User} */ user, /** @type {string} */ pre) =>
  ProjeDurum(user, pre)
    .setTitle("Sisteme bir link eklendi")
    .setColor(Colors.Green);
const YönetimProjeSilindi = (
  /** @type {string} */ linkId,
  /** @type {string} */ pre,
  /** @type {string} */ sebep
) =>
  new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle("Bot sahibi tarafından sistemden bir link silindi")
    .addFields({
      name: `${Kullanıcı} **Kullanıcı adı**`,
      value: `<@${linkId}>`,
    })
    .addFields({
      name: `${Id} **Kullanıcı id**`,
      value: `${linkId}`,
    })
    .addFields({
      name: `${Belge} **Sistemdeki link sayısı**`,
      value: `${getAllLinks().length}`,
    })
    .addFields({
      name: `${Link} **Kullanıcının link sayısı**`,
      value: `${db.fetch(`UptimeLink_${linkId}`).length}`,
    })
    .addFields({
      name: `${Premium} **Kullanıcının premiumu bulunuyormu**`,
      value: `${pre}`,
    })
    .addFields({
      name: `${Yazı} **Linkin silinme sebebi**`,
      value: `${sebep}`,
    });
const LinkListe = (/** @type {string} */ links) =>
  new EmbedBuilder()
    .setTitle(`Sistemdeki projelerin`)
    .setDescription(`${links || "Sisteme eklenmiş bir proje yok."}`)
    .setFooter({ text: "Uptime linkler" })
    .setColor(Colors.Blurple);
const SistemAçıldı = (/** @type {string} */ kanalId) =>
  Başarı(`${Tik} **Uptime sistemi <#${kanalId}> adlı kanalda kuruldu.**`);
const PremiumVerildi = (
  /** @type {User} */ kullanıcı,
  /** @type {moment.MomentInput} */ bitiş
) =>
  new EmbedBuilder()
    .setColor(Colors.Green)
    .setTitle("Bir kullanıcıya süreli premium verildi")
    .addFields({
      name: `${Kullanıcı} **Kullanıcı adı**`,
      value: `${kullanıcı}`,
    })
    .addFields({
      name: `${İsim} **Kullanıcı tagı**`,
      value: `${kullanıcı.tag}`,
    })
    .addFields({
      name: `${Id} **Kullanıcı id**`,
      value: `${kullanıcı.id}`,
    })
    .addFields({
      name: `${Saat} **Bitiş tarihi**`,
      value: `${moment(bitiş).format("DD.MM.YYYY - HH:mm:ss")}`,
    });
const PremiumEklendi = (
  /** @type {User} */ kullanıcı,
  /** @type {moment.MomentInput} */ bitiş
) =>
  Başarı(
    `${Tik} ${kullanıcı} **adlı kullanıcıya premium verildi. Bitiş tarihi:** ${moment(
      bitiş
    ).format("DD.MM.YYYY - HH:mm:ss")}`
  );
const PremiumGitti = (/** @type {User} */ kullanıcı) =>
  new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle("Bir kullancının premium süresi doldu")
    .addFields({
      name: `${Kullanıcı} **Kullanıcı adı**`,
      value: `${kullanıcı}`,
    })
    .addFields({
      name: `${İsim} **Kullanıcı tagı**`,
      value: `${kullanıcı.tag}`,
    })
    .addFields({
      name: `${Id} **Kullanıcı id**`,
      value: `${kullanıcı.id}`,
    });
const KalıcıPremiumEklendi = (/** @type {User} */ kullanıcı) =>
  Başarı(`${Tik} ${kullanıcı} **adlı kullanıcıya kalıcı premium verildi.**`);
const KalıcıPremiumVerildi = (/** @type {User} */ kullanıcı) =>
  new EmbedBuilder()
    .setColor(Colors.Green)
    .setTitle("Bir kullanıcıya kalıcı premium verildi")
    .addFields({
      name: `${Kullanıcı} **Kullanıcı adı**`,
      value: `${kullanıcı}`,
    })
    .addFields({
      name: `${İsim} **Kullanıcı tagı**`,
      value: `${kullanıcı.tag}`,
    })
    .addFields({
      name: `${Id} **Kullanıcı id**`,
      value: `${kullanıcı.id}`,
    });
const PremiumDurum = (/** @type {string} */ userId) => {
  const premiumData = db.fetch(`Premium_${userId}`);
  const when = premiumData
    ? moment
        .duration(premiumData.Bitiş - Date.now())
        .format("w [hafta] d [gün] h [saat] m [dakika] s [saniye]")
    : "Süresiz";
  return new EmbedBuilder()
    .setColor(Colors.Green)
    .setTitle("Premium bulunuyor")
    .setDescription(
      `${Tik} **Premium üyeliğiniz bulunmaktadır. Premiumun bitişine kalan zaman:** ${when}`
    );
};
const PremiumAlındı = (/** @type {User} */ kullanıcı) =>
  Başarı(`${Tik} ${kullanıcı} **adlı kullanıcının premiumu alındı.**`);
const PremiumYok = (/** @type {User} */ kullanıcı) =>
  Hata(
    `${Çarpı} ${kullanıcı} **adlı kullanıcının zaten premium üyeliği bulunmuyor.**`
  );
const PremiumBitirildi = (/** @type {User} */ kullanıcı) =>
  new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle("Bir kullancının premiumu alındı")
    .addFields({
      name: `${Kullanıcı} **Kullanıcı adı**`,
      value: `${kullanıcı}`,
    })
    .addFields({
      name: `${İsim} **Kullanıcı tagı**`,
      value: `${kullanıcı.tag}`,
    })
    .addFields({
      name: `${Id} **Kullanıcı id**`,
      value: `${kullanıcı.id}`,
    });
const PingÖlçüm = (/** @type {number} */ ping) => {
  const color =
    ping < 50
      ? Colors.Green
      : ping < 100
      ? Colors.Yellow
      : ping < 500
      ? Colors.Red
      : Colors.DarkButNotBlack;
  return new EmbedBuilder()
    .addFields({ name: `${Bot} **Bot gecikmesi:**`, value: `\`${ping}ms\`` })
    .setColor(color);
};
const Say = (/** @type {string} */ userId) => {
  const limit = db.fetch(`PremiumÜye_${userId}`) ? premiumLimit : normalLimit;
  const userLinks = db.fetch(`UptimeLink_${userId}`) ?? [];

  return new EmbedBuilder()
    .setColor(Colors.Blurple)
    .setTitle(`${botName} • Proje sayıları`)
    .addFields(
      {
        name: `${Belge} **Sistemdeki toplam projeler**`,
        value: `${getAllLinks().length}`,
      },
      {
        name: `${Link} **Senin toplam projelerin**`,
        value: `${userLinks.length || `Hiç link eklememişsin.`}`,
      },
      {
        name: `${Premium} **Toplam premium üyeler**`,
        value: `${db.fetch(`PremiumSayı`) ?? 0}`,
      },
      {
        name: `${Limit} **Link ekleme hakkın**`,
        value: `${limit}`,
      },
      {
        name: `${Limit} **Kalan link ekleme hakkın**`,
        value: `${limit - userLinks.length}`,
      }
    );
};
const KaralisteyeAlındı = (
  /** @type {User} */ user,
  /** @type {User} */ executor,
  /** @type {string} */ reason
) =>
  new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle("Bir kullanıcı karalisteye eklendi")
    .addFields({
      name: `${Karaliste} **Kullanıcı adı**`,
      value: `${user}`,
    })
    .addFields({
      name: `${İsim} **Kullanıcı tagı**`,
      value: `${user.tag}`,
    })
    .addFields({
      name: `${Id} **Kullanıcı id**`,
      value: `${user.id}`,
    })
    .addFields({
      name: `${Kullanıcı} **Yetkili adı**`,
      value: `${executor}`,
    })
    .addFields({
      name: `${Yetkili} **Yetkili tagı**`,
      value: `${executor.tag}`,
    })
    .addFields({
      name: `${Id} **Yetkili id**`,
      value: `${executor.id}`,
    })
    .addFields({
      name: `${Sebep} **Karaliste eklenme sebebi**`,
      value: `${reason}`,
    });
const KaralistedeBulunmuyor = (/** @type {User} */ kullanıcı) =>
  Hata(
    `${Çarpı} ${kullanıcı} **adlı kullanıcı zaten karalistede bulunmuyor.**`
  );
const KaralisteGitti = (/** @type {User} */ kullanıcı) =>
  Başarı(
    `${Tik} ${kullanıcı} **adlı kullanıcı karalisteden çıkartıldı, artık botu kullanabilir.**`
  );
const KaralistedenÇıkartıldı = (
  /** @type {User} */ user,
  /** @type {User} */ executor
) =>
  new EmbedBuilder()
    .setColor(Colors.Green)
    .setTitle("Bir kullanıcı karalisteden çıkartıldı")
    .addFields({
      name: `${Karaliste} **Kullanıcı adı**`,
      value: `${user}`,
    })
    .addFields({
      name: `${İsim} **Kullanıcı tagı**`,
      value: `${user.tag}`,
    })
    .addFields({
      name: `${Id} **Kullanıcı id**`,
      value: `${user.id}`,
    })
    .addFields({
      name: `${Kullanıcı} **Yetkili adı**`,
      value: `${executor}`,
    })
    .addFields({
      name: `${Yetkili} **Yetkili tagı**`,
      value: `${executor.tag}`,
    })
    .addFields({
      name: `${Id} **Yetkili id**`,
      value: `${executor.id}`,
    });
const İstatistik = (/** @type {ChatInputCommandInteraction} */ interaction) => {
  const client = interaction.client;

  let days = Math.floor(client.uptime / 86400000);
  let hours = Math.floor(client.uptime / 3600000) % 24;
  let minutes = Math.floor(client.uptime / 60000) % 60;
  let seconds = Math.floor(client.uptime / 1000) % 60;

  const owners = ownerIds
    // 3.12.2023 tarihinde çalışmıyordu -> [**<@${user}>**](https://discord.com/users/${user})
    .map((user) => {
      const userData = client.users.cache.get(user);
      return userData
        ? `[${userData.username}](https://discord.com/users/${user})`
        : `<@${user}>`;
    })
    .join("\n");

  return new EmbedBuilder()
    .setTitle(`${botName} • İstatistikler`)
    .setColor(Colors.Blurple)
    .addFields(
      {
        name: `${Tac} Bot sahipleri`,
        value: owners,
      },
      {
        name: `${Js} Kütüphane`,
        value: `\`Discord.js ${dependencies["discord.js"]}\``,
      },
      {
        name: `${Node} Node sürümü`,
        value: `\`Node.js ${process.version}\``,
      },
      {
        name: `${Uptime} Bot uptime`,
        value: `\`${days} Gün ${hours} Saat ${minutes} Dakika ${seconds} Saniye\``,
      },
      {
        name: `${Sunucu} Toplam sunucular`,
        value: `\`${client.guilds.cache.size} Sunucu\``,
      },
      {
        name: `${Kullanıcı} Toplam kullanıcılar`,
        value: `\`${client.users.cache.size} Kullanıcı\``,
      },
      {
        name: `${Ping} Bot gecikmesi`,
        value: `\`${client.ws.ping}ms\``,
      },
      {
        name: `${Ram} Ram kullanımı`,
        value: `\`${(process.memoryUsage().heapUsed / 2024 / 2024).toFixed(
          2
        )}mb\``,
      },
      {
        name: `${Belge} Toplam projeler`,
        value: `\`${getAllLinks().length}\``,
      },
      {
        name: `${Premium} Toplam premium üyeler`,
        value: `\`${db.fetch(`PremiumSayı`) ?? 0}\``,
      }
    );
};
const Eval = (/** @type {string} */ code, /** @type {string} */ result) =>
  Başarı()
    .addFields({
      name: `${Giriş} **Kod girişi**`,
      value: `\`${code}\``,
    })
    .addFields({
      name: `${Çıkış} **Kod çıkışı**`,
      value: `\`${result}\``,
    });
const EvalHata = (/** @type {string} */ code, /** @type {string} */ err) =>
  Hata()
    .addFields({
      name: `${Giriş} **Kod girişi**`,
      value: `\`${code}\``,
    })
    .addFields({
      name: `${HataEmoji} **Hata**`,
      value: `\`${err}\``,
    });
const DuyuruYok = (/** @type {string} */ duyuru) =>
  new EmbedBuilder()
    .setDescription(
      `**${Çarpı} Sistemde \`${duyuru}\` adında bir duyuru bulunmuyor.**`
    )
    .setColor(Colors.Red)
    .setTitle("Duyuru yok");
const DuyuruKaldırıldı = (/** @type {string} */ duyuru) =>
  new EmbedBuilder()
    .setTitle(`Duyuru kaldırıldı`)
    .setDescription(
      `**${Tik} \`${duyuru}\` adlı duyuru sistemden kaldırıldı.**`
    )
    .setColor(Colors.Green);
const DuyuruEklendi = (/** @type {string} */ duyuru) =>
  new EmbedBuilder()
    .setTitle(`Duyuru eklendi`)
    .setDescription(`**${Tik} \`${duyuru}\` adlı duyuru sisteme eklendi.**`)
    .setColor(Colors.Green);
const BakımAçık = (/** @type {string} sebep */ sebep) =>
  Hata(`${Çarpı} **Bot zaten \`${sebep}\` sebebi ile bakımda.**`);
const BakımAçıldı = (/** @type {string} sebep */ sebep) =>
  Başarı(`${Tik} **Bot \`${sebep}\` sebebi ile bakıma alındı.**`);
const YetkiHata = (/** @type {string} */ yetki) =>
  Hata(
    `${Çarpı} Bu komutu kullanabilmek için **${yetki}** yetkisine sahip olmalısın.`
  );
const BotYetkiHata = (/** @type {string} */ yetki) =>
  Hata(
    `${Çarpı} Bu komutu kullanabilmek için **${yetki}** yetkisine sahip olmalıyım.`
  );
const ZamanHata = (/** @type {string | number} */ time) =>
  Hata(
    `${Çarpı} Bu komutu tekrar kullanabilmek için **${time} saniye** beklemelisin.`
  );

module.exports = {
  PreYok,
  FazlaLink,
  LinkVar,
  BaşıHatalı,
  SonuHatalı,
  LinkEklendi,
  ProjeYok,
  LinkSilindi,
  Silindi,
  ProjeEklenmemiş,
  Kullanamazsın,
  YetkiYok,
  YenidenBaşlat,
  SistemKapalı,
  SistemKapandı,
  SistemMesajı,
  SistemAçık,
  KanalYok,
  PremiumDeaktif,
  Token,
  DavetEmbed,
  BakımKapalı,
  BakımKapatıldı,
  Bakımda,
  ProjeSilindi,
  ProjeEklendi,
  YönetimProjeSilindi,
  LinkListe,
  Yardım,
  SistemAçıldı,
  PremiumVar,
  PremiumVerildi,
  PremiumEklendi,
  PremiumGitti,
  KalıcıPremiumVerildi,
  KalıcıPremiumEklendi,
  PremiumDurum,
  PremiumAlındı,
  PremiumYok,
  PremiumBitirildi,
  PingÖlçüm,
  Say,
  KaralistedeVar,
  KaralistedeYok,
  KaralistedeBulunuyor,
  KaralisteEklendi,
  KaralisteyeAlındı,
  KaralistedeBulunmuyor,
  KaralisteGitti,
  KaralistedenÇıkartıldı,
  İstatistik,
  Eval,
  EvalHata,
  DuyuruYok,
  DuyuruKaldırıldı,
  DuyuruEklendi,
  BakımAçık,
  BakımAçıldı,
  YetkiHata,
  BotYetkiHata,
  ZamanHata,
};
