const KEY_FOR_BLOCK_SITES = 'BlockSites';
const COMMON_MESSAGE = "不是在污染你的脑袋吗？关心这些无关的事情干什么？别做梦了，专心干活";
const REDIRECT_URL = 'https://github.com/Ai01';

const initBlockSite = () => {
	// if block site can customize add, storage user's block site
	const BLOCK_SITE_LIST = [
		{
			url: "twitter.com",
			host: "twitter",
			message: COMMON_MESSAGE,
		},
		{
			url: "qidian.com",
			host: "qidian",
			message: COMMON_MESSAGE,
		},
		{
			url: "weibo.com",
			host: "weibo",
			message: COMMON_MESSAGE,
		},
		{
			url: "bilibili.com",
			host: "bilibili",
			message: COMMON_MESSAGE,
		},
		{
			url: "v2ex.com",
			host: "v2ex",
			message: COMMON_MESSAGE,
		}
	]
	chrome.storage.sync.set({[KEY_FOR_BLOCK_SITES]: BLOCK_SITE_LIST}, function () {
		console.log('block site init success', BLOCK_SITE_LIST);
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
					redirect: REDIRECT_URL,
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
			message: COMMON_MESSAGE
		});

		chrome.storage.sync.set({[KEY_FOR_BLOCK_SITES]: activeBlockSites}, function () {
			console.log('block site update success', activeBlockSites);
		})

		sendResponse({success: true});
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
