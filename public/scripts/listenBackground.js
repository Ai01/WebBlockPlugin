const KEY_FOR_BLOCK_SITES = "BlockSites";
const KEY_FOR_BLOCK_MESSAGE = "key_for_block_messages_xxxxy";
const KEY_FOR_REDIRECT_URL = "key_for_redirect_url";

const initBlockSite = () => {
  const COMMON_MESSAGE = "千金难买寸光阴";

  // if block site can customize add, storage user's block site
  const BLOCK_SITE_LIST = [
    {
      url: "https://twitter.com",
      host: "twitter",
    },
    {
      url: "https://qidian.com",
      host: "qidian",
    },
    {
      url: "https://weibo.com",
      host: "weibo",
    },
    {
      url: "https://bilibili.com",
      host: "bilibili",
    },
    {
      url: "https://v2ex.com",
      host: "v2ex",
    },
    {
      url: "https://douyu.com",
      host: "douyu",
    },
    {
      url: "https://youtube.com",
      host: "youtube",
    },
  ];
  chrome.storage.sync.set(
    { [KEY_FOR_BLOCK_SITES]: BLOCK_SITE_LIST },
    function () {
      console.log("block site init success", BLOCK_SITE_LIST);
    }
  );

  chrome.storage.sync.set(
    { [KEY_FOR_BLOCK_MESSAGE]: COMMON_MESSAGE },
    function () {
      console.log("block message init success", COMMON_MESSAGE);
    }
  );

  const DEFAULT_REDIRECT_URL = "https://github.com";
  chrome.storage.sync.set(
    { [KEY_FOR_REDIRECT_URL]: DEFAULT_REDIRECT_URL },
    function () {
      console.log("block message init success", DEFAULT_REDIRECT_URL);
    }
  );
};

initBlockSite();

const getStorageSyncData = (name) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([name], (items) => {
      // if (chrome.runtime.lastError) {
      // 	return reject(chrome.runtime.lastError);
      // }
      resolve(items[name]);
    });
  });
};

let activeBlockSites;
getStorageSyncData(KEY_FOR_BLOCK_SITES).then((blockSites) => {
  activeBlockSites = blockSites;
});

let tipMessage;
getStorageSyncData(KEY_FOR_BLOCK_MESSAGE).then((message) => {
  tipMessage = message;
});

let redirectUrl;
getStorageSyncData(KEY_FOR_REDIRECT_URL).then((url) => {
  redirectUrl = url;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("onMessage", message);

  const { method, site } = message || {};

  if (method === "newTab") {
    // overwrite the html page if site is been blocked
    activeBlockSites.forEach((i) => {
      const { url, host, overwrite, shortBrowser, shortBrowserTime } = i;

      if (
        (host && site.indexOf(host) !== -1) ||
        (url && !host && url === site)
      ) {
        sendResponse({
          overwrite,
          redirect: redirectUrl,
          shortBrowser,
          data: tipMessage,
          shortBrowserTime
        });
      }
    });
  }

  if (method === "addBlockSite") {
    const { site } = message;
    activeBlockSites.push({
      url: site,
      ...message,
      overwrite: true,
      message: tipMessage,
    });

    chrome.storage.sync.set(
      { [KEY_FOR_BLOCK_SITES]: activeBlockSites },
      function () {
        console.log("block site update success", activeBlockSites);
      }
    );

    sendResponse({ success: true });
  }

  if (method === "setBlockMessage") {
    const { blockMessage } = message;
    if (!blockMessage) return;

    chrome.storage.sync.set(
      { [KEY_FOR_BLOCK_MESSAGE]: blockMessage },
      function () {
        console.log("block message update success", blockMessage);
        tipMessage = blockMessage;
      }
    );

    sendResponse({ success: true });
  }

  if (method === "getBlockMessage") {
    sendResponse({ blockMessage: tipMessage });
  }

  if (method === "setRedirectUrl") {
    const { redirectUrl: newRedirectUrl } = message;
    if (!newRedirectUrl) return;

    chrome.storage.sync.set(
      { [KEY_FOR_REDIRECT_URL]: newRedirectUrl },
      function () {
        console.log("redirect url update success", newRedirectUrl);
        redirectUrl = newRedirectUrl;
      }
    );

    sendResponse({ success: true });
  }

  if (method === "getRedirectUrl") {
    sendResponse({ redirectUrl: redirectUrl });
  }

  if (method === "addRedirectSite") {
    const { site } = message;
    activeBlockSites.push({
      url: site,
      ...message,
    });

    chrome.storage.sync.set(
      { [KEY_FOR_BLOCK_SITES]: activeBlockSites },
      function () {
        console.log("block site update success", activeBlockSites);
      }
    );

    sendResponse({ success: true });
  }

  if (method === "bellBlockSite") {
    const { site: siteToRemove, host: hostToRemove } = message;

    activeBlockSites = activeBlockSites.map((i) => {
      const { url, host } = i || {};
      if (url === siteToRemove || host === hostToRemove) {
        i.shortBrowser = true;
      }
      return i;
    });

    chrome.storage.sync.set(
      { [KEY_FOR_BLOCK_SITES]: activeBlockSites },
      function () {
        console.log("block site update success", activeBlockSites);
      }
    );

    sendResponse({ success: true, allBlockedSites: activeBlockSites });
  }

  if (method === "noBellBlockSite") {
    const { site: siteToRemove, host: hostToRemove } = message;

    activeBlockSites = activeBlockSites.map((i) => {
      const { url, host } = i || {};
      if (url === siteToRemove || host === hostToRemove) {
        i.shortBrowser = false;
      }
      return i;
    });

    chrome.storage.sync.set(
      { [KEY_FOR_BLOCK_SITES]: activeBlockSites },
      function () {
        console.log("block site update success", activeBlockSites);
      }
    );

    sendResponse({ success: true, allBlockedSites: activeBlockSites });
  }

  if (method === "getAllBlockedSites") {
    sendResponse({
      allBlockedSites: activeBlockSites,
    });
  }

  if (method === "changeSiteBlock") {
    const { site } = message;

    activeBlockSites = activeBlockSites.map(i => {
      const { url } = i || {};
      if(url === site) {
        i.overwrite = true;
        i.message = tipMessage;
        i.redirect = false;
      }

      return i;
    });

    chrome.storage.sync.set(
      { [KEY_FOR_BLOCK_SITES]: activeBlockSites },
      function () {
        console.log("block site update success", activeBlockSites);
      }
    );

    sendResponse({ success: true });
  }

  if (method === "changeSiteRedirect") {
    const { site } = message;
    activeBlockSites = activeBlockSites.map(i => {
      const { url } = i || {};
      if(url === site) {
        i.overwrite = false;
        i.redirect = redirectUrl;
      }

      return i;
    });

    chrome.storage.sync.set(
      { [KEY_FOR_BLOCK_SITES]: activeBlockSites },
      function () {
        console.log("block site update success", activeBlockSites);
      }
    );

    sendResponse({ success: true });
  }


  if(method === 'changeShortBrowserTime') {
    const { site, time } = message;
    activeBlockSites = activeBlockSites.map(i => {
      const { url } = i || {};
      if(url === site) {
        i.shortBrowserTime = time;
      }

      return i;
    });

    chrome.storage.sync.set(
      { [KEY_FOR_BLOCK_SITES]: activeBlockSites },
      function () {
        console.log("block site update success", activeBlockSites);
      }
    );

    sendResponse({ success: true, allBlockedSites: activeBlockSites });
  }

});