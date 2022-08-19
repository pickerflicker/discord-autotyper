const puppeteer = require("puppeteer");
const { types } = require("./utils/types");

// list all the words here, will pick them randomly, doesn't matter how many!
const words = ["!work", "!collect"];
let logCount = 0;

const BASE_URL = "https://discord.com/channels/878620883076399134";
// https://discord.com/channels/878620883076399134/948710889882783764
// change this & enter the channel url
const discord = {
  browser: null,
  page: null,

  initialize: async () => {
    discord.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized"],
    });

    discord.page = await discord.browser.newPage();
  },

  launchInBrowser: async () => {
    let loginBrowser = await discord.page.$x(
      '//a[contains(., "Continue in browser")]'
    );
    await discord.page.waitFor(5000);
    /* Click on login url button */
    await loginBrowser[1].click();
  },

  /**
   * username and password
   * @param {string} username
   * @param {string} password
   * @return {Promise<void>}
   */

  login: async (username, password) => {
    await discord.page.goto(BASE_URL, {
      waitUntil: "networkidle2",
    });

    let [loginBrowserButton] = await discord.page.$x(
      '//button[contains(., "Continue in browser")]'
    );

    // <button type="button" class="marginTop8-24uXGp marginCenterHorz-574Oxy linkButton-2ax8wP button-f2h6uQ lookLink-15mFoz lowSaturationUnderline-Z6CW6z colorLink-1Md3RZ sizeMin-DfpWCE grow-2sR_-F"><div class="contents-3ca1mk">Continue in browser</div></button>
    if (loginBrowserButton) {
      //loginBrowserButton.click();
      await loginBrowserButton.click();
    }
    // await discord.page.waitFor(60000);
    /* Click on login url button */

    // let loginButton = await discord.page.$x('//a[contains(., "Login")]');
    // await discord.page.waitFor(5000);
    // /* Click on login url button */
    // await loginButton[1].click();

    // await discord.page.waitForNavigation({
    //   waitUntil: "networkidle2",
    // });

    await discord.page.waitFor(100);

    /* username and password */

    await discord.page.type('input[name="email"]', username, {
      delay: 50,
    });

    await discord.page.type('input[name="password"]', password, {
      delay: 65,
    });

    //await discord.page.waitFor(60000);

    /* clicking on login button */

    [loginButton] = await discord.page.$x('//div[contains(text(), "Log In")]');
    await loginButton.click();

    await discord.page.waitFor(30000);
    //await discord.page.waitFor('//div[contains(text(), "Friends")]');
  },

  /**
   * Enter server id and channel urk
   * @param { string } serverID
   * @param { string } channelID
   * @param { number } delay
   * @return {Promise<void>}
   */

  likeChannelProcess: async (serverID, channelID, delay = 1) => {
    types("string", serverID);
    types("string", channelID);
    console.log("serverID: " + serverID);
    console.log("channelId: " + channelID);
    const CHANNELS_URL = `https://discord.com/channels/${serverID}/${channelID}`;

    await discord.page.goto(CHANNELS_URL, {});
    console.debug("CHANNELS_URL: " + CHANNELS_URL);
    await discord.page.waitFor(5000);

    async function initalStart() {
      await discord.page.type(
        'span[data-slate-object="text"]',
        "auto typer started.",
        {
          delay: 100,
        }
      );

      await discord.page.keyboard.press("Enter");

      console.debug("Auto typer started " + new Date());
    }

    //await initalStart();

    async function randomWord() {
      //<div role="textbox" spellcheck="true" aria-haspopup="listbox" aria-invalid="false" aria-autocomplete="list" class="markup-eYLPri editor-H2NA06 slateTextArea-27tjG0 fontSize16Padding-XoMpjI" autocorrect="off" data-can-focus="true" aria-label="Message #pickleflicker-dev" aria-multiline="true" data-slate-editor="true" data-slate-node="value" contenteditable="true" zindex="-1" style="position: relative; outline: none; white-space: pre-wrap; overflow-wrap: break-word;"><div data-slate-node="element"><span data-slate-node="text"><span data-slate-leaf="true" class="emptyText-1o0WH_"><span data-slate-zero-width="n" data-slate-length="0">﻿<br></span></span></span></div></div>

      //const random = words[Math.floor(Math.random() * words.length)];
      await discord.page.type('span[data-slate-node="text"]', words[0], {
        delay: 100,
      });
      await discord.page.keyboard.press("Enter");

      await discord.page.type('span[data-slate-node="text"]', words[1], {
        delay: 100,
      });
      await discord.page.keyboard.press("Enter");

      logCount++;

      // this logs the time the message was sent at and the total message count
      console.debug(
        "Message sent: " +
          random +
          " , at: " +
          new Date() +
          ", Message Count: " +
          logCount
      );
    }

    // change the first number for minutes
    // 3 * 60 * 1000 = 180000ms === 3 minutes
    setInterval(randomWord, delay * 60 * 1000);
  },
};

module.exports = discord;
