const Catcher = require("./catcher/catcher");
const Spammer = require("./spammer/spammer");

const dotenv = require("dotenv");
dotenv.config();

let jumlah = process.env.N;
let channel = []

for (let i = 1; i <= jumlah; i++) {
    channel.push(process.env["CATCH_CHANNEL_ID" + i]);
}

const catcher = new Catcher(process.env.TOKEN, channel);
const spammer = new Spammer(process.env.TOKEN_SPAM1, process.env.SPAM_CHANNGEL_ID1);
const spammer1 = new Spammer(process.env.TOKEN_SPAM2, process.env.SPAM_CHANNGEL_ID2);
const spammer2 = new Spammer(process.env.TOKEN_SPAM3, process.env.SPAM_CHANNGEL_ID3);
const spammer3 = new Spammer(process.env.TOKEN_SPAM4, process.env.SPAM_CHANNGEL_ID4);
const spammer4 = new Spammer(process.env.TOKEN_SPAM5, process.env.SPAM_CHANNGEL_ID5);
// const spammer5 = new Spammer(process.env.TOKEN_SPAM6, process.env.SPAM_CHANNGEL_ID6);
// const spammer6 = new Spammer(process.env.TOKEN_SPAM7, process.env.SPAM_CHANNGEL_ID7);
// const spammer7 = new Spammer(process.env.TOKEN_SPAM8, process.env.SPAM_CHANNGEL_ID8);

catcher.login();
spammer.login();
spammer1.login();
spammer2.login();
spammer3.login();
spammer4.login();
// spammer5.login();
// spammer6.login();
// spammer7.login();
