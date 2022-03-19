const KEY_FOR_BLOCK_SITES = 'BlockSites';
const KEY_FOR_BLOCK_MESSAGE = 'key_for_block_messages_xxxxy';
const KEY_FOR_REDIRECT_URL = 'key_for_redirect_url';

const initBlockSite = () => {
	// if block site can customize add, storage user's block site
	const BLOCK_SITE_LIST = [
		{
			url: "twitter.com",
			host: "twitter",
		},
		{
			url: "qidian.com",
			host: "qidian",
		},
		{
			url: "weibo.com",
			host: "weibo",
		},
		{
			url: "bilibili.com",
			host: "bilibili",
		},
		{
			url: "v2ex.com",
			host: "v2ex",
		}
	]
	chrome.storage.sync.set({[KEY_FOR_BLOCK_SITES]: BLOCK_SITE_LIST}, function () {
		console.log('block site init success', BLOCK_SITE_LIST);
	})

	const COMMON_MESSAGE = "千金难买寸光阴";
	chrome.storage.sync.set({[KEY_FOR_BLOCK_MESSAGE]: COMMON_MESSAGE}, function () {
		console.log('block message init success', COMMON_MESSAGE);
	})

	const DEFAULT_REDIRECT_URL= 'https://github.com';
	chrome.storage.sync.set({[KEY_FOR_REDIRECT_URL]: DEFAULT_REDIRECT_URL}, function () {
		console.log('block message init success', DEFAULT_REDIRECT_URL);
	})
}

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
}


let activeBlockSites;
getStorageSyncData(KEY_FOR_BLOCK_SITES).then((blockSites) => {
	activeBlockSites = blockSites;
});

let tipMessage;
getStorageSyncData(KEY_FOR_BLOCK_MESSAGE).then(message => {
	tipMessage = message;
});

let redirectUrl;
getStorageSyncData(KEY_FOR_REDIRECT_URL).then(url => {
	redirectUrl = url;
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log('onMessage', message);

	const {method, site} = message || {};

	if (method === 'newTab') {
		// overwrite the html page if site is been blocked
		activeBlockSites.forEach(i => {
			const {url, host, message, overwrite } = i;

			if ((host && site.indexOf(host) !== -1) || (url && !host && url === site)) {
				sendResponse({
					overwrite,
					redirect: redirectUrl,
					data: message
				});
			}
		});
	}

	if (method === 'addBlockSite') {
		const {site} = message;
		activeBlockSites.push({
			url: site,
			...message,
			overwrite: true,
			message: tipMessage
		});

		chrome.storage.sync.set({[KEY_FOR_BLOCK_SITES]: activeBlockSites}, function () {
			console.log('block site update success', activeBlockSites);
		})

		sendResponse({success: true});
	}

	if(method === 'setBlockMessage') {
		const {blockMessage} = message;
		if(!blockMessage) return;

		chrome.storage.sync.set({[KEY_FOR_BLOCK_MESSAGE]: blockMessage}, function () {
			console.log('block message update success', blockMessage);
			tipMessage = blockMessage;
		})

		sendResponse({success: true});
	}

	if(method === 'getBlockMessage') {
		sendResponse({blockMessage: tipMessage});
	}

	if(method === 'setRedirectUrl') {
		const {redirectUrl: newRedirectUrl} = message;
		if(!newRedirectUrl) return;

		chrome.storage.sync.set({[KEY_FOR_REDIRECT_URL]: newRedirectUrl}, function () {
			console.log('redirect url update success', newRedirectUrl);
			redirectUrl = newRedirectUrl;
		})

		sendResponse({success: true});
	}

	if(method === 'getRedirectUrl') {
		sendResponse({redirectUrl: redirectUrl});
	}

	if (method === 'addRedirectSite') {
		const {site} = message;
		activeBlockSites.push({
			url: site,
			...message
		});

		chrome.storage.sync.set({[KEY_FOR_BLOCK_SITES]: activeBlockSites}, function () {
			console.log('block site update success', activeBlockSites);
		})

		sendResponse({success: true});
	}

	if (method === 'removeBlockSite') {
		const {site: siteToRemove, host: hostToRemove} = message;


		let removeIndex = -1;
		activeBlockSites.forEach((i, index) => {
			const {site, host} = i || {};
			if (site === siteToRemove || host === hostToRemove) {
				removeIndex = index;
			}
		})

		activeBlockSites[removeIndex] = null;
		activeBlockSites = activeBlockSites.filter(i => !!i);

		chrome.storage.sync.set({[KEY_FOR_BLOCK_SITES]: activeBlockSites}, function () {
			console.log('block site update success', activeBlockSites);
		})

		sendResponse({success: true});
	}

	if (method === 'getAllBlockedSites') {
		sendResponse({
			allBlockedSites: activeBlockSites
		});
	}
});
