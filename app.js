const Catcher = require("./catcher/catcher");
const Spammer = require("./spammer/spammer");

const dotenv = require("dotenv");
dotenv.config();

let jumlah = parseInt(process.env.N);
let channel = [];

for (let i = 1; i <= jumlah; i++) {
    channel.push(process.env["CATCH_CHANNEL_ID" + i]);
}

const catcher = new Catcher(process.env.TOKEN, channel);

// Dynamic creation of Spammer instances
let spammers = [];
for (let i = 1; i <= jumlah; i++) {
    const token = process.env[`TOKEN_SPAM${i}`];
    const channelId = process.env[`SPAM_CHANNEL_ID${i}`];
    if (token && channelId) {
        spammers.push(new Spammer(token, channelId));
    }
}

catcher.login();
spammers.forEach(spammer => spammer.login());
