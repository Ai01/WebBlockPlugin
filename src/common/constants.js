export const KEY_FOR_BLOCK_SITES = "BlockSites";
export const KEY_FOR_BLOCK_MESSAGE = "key_for_block_messages_xxxxy";
export const KEY_FOR_REDIRECT_URL = "key_for_redirect_url";
export const KEY_FOR_LANGUAGE_TYPE = "key_for_language_type";

export const COMMON_MESSAGE = "千金难买寸光阴";

// if block site can customize add, storage user's block site
export const BLOCK_SITE_LIST = [
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

export const DEFAULT_REDIRECT_URL = "https://github.com";

export const MEHTOD_LIST = {
  newTab: {
    name: 'newTab'
  },
  addBlockSite: {
    name: "addBlockSite",
  },
  setBlockMessage: {
    name: "setBlockMessage",
  },
  getBlockMessage: {
    name: "getBlockMessage",
  },
  setRedirectUrl: {
    name: "setRedirectUrl",
  },
  getRedirectUrl: {
    name: "getRedirectUrl",
  },
  addRedirectSite: {
    name: "addRedirectSite",
  },
  bellBlockSite: {
    name: "bellBlockSite",
  },
  noBellBlockSite: {
    name: "noBellBlockSite",
  },
  getAllBlockedSites: {
    name: "getAllBlockedSites",
  },
  changeSiteBlock: {
    name: "changeSiteBlock",
  },
  changeSiteRedirect: {
    name: "changeSiteRedirect",
  },
  changeShortBrowserTime: {
    name: "changeShortBrowserTime",
  },
  changeLanguageType: {
    name: "changeLanguageType",
  },
  getLanguageType: {
    name: "getLanguageType",
  },
};
