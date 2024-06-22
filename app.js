const Catcher = require("./catcher/catcher");
const Spammer = require("./spammer/spammer");

const dotenv = require("dotenv");
dotenv.config();

let jumlah = process.env.N;
let channel = []

for (let i = 0; i < jumlah; i++) {
    channel.push(process.env["CATCH_CHANNEL_ID" + i]);
}

const catcher = new Catcher(process.env.TOKEN, channel);
const spammer = new Spammer(process.env.TOKEN_SPAM0, process.env.SPAM_CHANNGEL_ID0);
const spammer1 = new Spammer(process.env.TOKEN_SPAM1, process.env.SPAM_CHANNGEL_ID1);

catcher.login();
spammer.login();
spammer1.login();
