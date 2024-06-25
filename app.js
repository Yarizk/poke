const Catcher = require("./catcher/catcher");
const Spammer = require("./spammer/spammer");

const dotenv = require("dotenv");
dotenv.config();

let jumlah = parseInt(process.env.N);
let channel = [];

for (let i = 1; i <= jumlah; i++) {
    channel.push(process.env["CATCH_CHANNEL_ID" + i]);
}


let spammers = [];
for (let i = 1; i <= jumlah; i++) {
    const token = process.env[`TOKEN_SPAM${i}`];
    const channelId = process.env[`SPAM_CHANNEL_ID${i}`];
    const catchId = process.env[`CATCH_CHANNEL_ID${i}`];
    if (token && channelId) {
        spammers.push(new Spammer(token, channelId, catchId));
    }
}

Promise.all(spammers.map(spammer => spammer.login()))
    .then(() => console.log("All spammers logged in"))
    .catch(error => console.error("Error logging in spammers:", error));

const catcher = new Catcher(process.env.TOKEN, channel, spammers);
catcher.login()

