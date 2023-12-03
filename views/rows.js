// @ts-check

const { buttonRow } = require("../functions/general");
const {
  EkleButon,
  SilButon,
  ListeButon,
  DestekButon,
  DavetButon,
  OyButon,
} = require("./buttons");

const Destek = buttonRow([DestekButon]);
const Sistem = buttonRow([EkleButon, SilButon, ListeButon]);
const Davet = buttonRow([DavetButon, DestekButon, OyButon]);

module.exports = {
  Destek,
  Sistem,
  Davet,
};
