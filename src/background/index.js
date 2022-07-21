import {
  KEY_FOR_BLOCK_SITES,
  KEY_FOR_BLOCK_MESSAGE,
  KEY_FOR_REDIRECT_URL,
  KEY_FOR_LANGUAGE_TYPE,
  COMMON_MESSAGE,
  BLOCK_SITE_LIST,
  DEFAULT_REDIRECT_URL,
  MEHTOD_LIST,
} from "../common/constants.js";

const initBlockSite = () => {
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

let activeLanguageType;
getStorageSyncData(KEY_FOR_LANGUAGE_TYPE).then((languageType) => {
  activeLanguageType = languageType;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("onMessage", message);

  const { method, site } = message || {};

  if (method === MEHTOD_LIST.newTab.name) {
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
          shortBrowserTime,
        });
      }
    });
  }

  if (method === MEHTOD_LIST.addBlockSite.name) {
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

  if (method === MEHTOD_LIST.setBlockMessage.name) {
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

  if (method === MEHTOD_LIST.getBlockMessage.name) {
    sendResponse({ blockMessage: tipMessage });
  }

  if (method === MEHTOD_LIST.setRedirectUrl.name) {
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

  if (method === MEHTOD_LIST.getRedirectUrl.name) {
    sendResponse({ redirectUrl: redirectUrl });
  }

  if (method === MEHTOD_LIST.addRedirectSite.name) {
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

  if (method === MEHTOD_LIST.bellBlockSite.name) {
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

  if (method === MEHTOD_LIST.noBellBlockSite.name) {
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

  if (method === MEHTOD_LIST.getAllBlockedSites.name) {
    sendResponse({
      allBlockedSites: activeBlockSites,
    });
  }

  if (method === MEHTOD_LIST.changeSiteBlock.name) {
    const { site } = message;

    activeBlockSites = activeBlockSites.map((i) => {
      const { url } = i || {};
      if (url === site) {
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

  if (method === MEHTOD_LIST.changeSiteRedirect.name) {
    const { site } = message;
    activeBlockSites = activeBlockSites.map((i) => {
      const { url } = i || {};
      if (url === site) {
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

  if (method === MEHTOD_LIST.changeShortBrowserTime.name) {
    const { site, time } = message;
    activeBlockSites = activeBlockSites.map((i) => {
      const { url } = i || {};
      if (url === site) {
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

  if (method === MEHTOD_LIST.changeLanguageType.name) {
    const { languageValue } = message;
    chrome.storage.sync.set({ [KEY_FOR_LANGUAGE_TYPE]: languageValue }, () => {
      activeLanguageType = languageValue;
    });
  }

  if (method === MEHTOD_LIST.getLanguageType.name) {
    sendResponse({
      success: true,
      languageType: activeLanguageType,
    });
  }
});
