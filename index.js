const dc = require("./discord");
const { sig } = require("./utils/sig");

(async () => {
  sig();

  await dc.initialize();

  //await dc.launchInBrowser();
  // here is where you enter your email and password
  await dc.login("asdf", "asdf");

  await dc.likeChannelProcess("878620883076399134", "948710889882783764", 100); // 1 = 1 minute
  // add multiple dc.likeChannelProcess() calls to bot multiple channels, write separate methods for each

  debugger;
})();
