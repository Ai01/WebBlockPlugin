const KEY_FOR_BLOCK_SITES = 'BlockSites';

const initBlockSite = () => {
	// if block site can customize add, storage user's block site
	const BLOCK_SITE_LIST = [
		{
			url: "twitter.com",
			host: "twitter",
			message: "twitter 这种社交媒体不是在污染你的脑袋吗？关心这些无关的事情干什么？别做梦了，专心干活"
		},
		{
			url: "qidian.com",
			host: "qidian",
			message: "小说是别人的造物，别沉迷其中了。别做梦了，专心干活"
		},
		{
			url: "weibo.com",
			host: "weibo",
			message: "weibo 这种社交媒体不是在污染你的脑袋吗？关心这些无关的事情干什么？别做梦了，专心干活"
		},
		{
			url: "bilibili.com",
			host: "bilibili",
			message: "bilibili不是在浪费你的时间吗？世界的本质是娱乐吗？"
		},
		{
			url: "v2ex.com",
			host: "v2ex",
			message: "v2ex不是在浪费你的时间吗？和微博的区别在哪里？"
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
			const {url, host, message} = i;

			if ((host && site.indexOf(host) !== -1) || (url && !host && url === site)) {
				sendResponse({
					overwrite: true,
					redirect: 'https://github.com/Ai01?tab=stars',
					data: message
				});
			}
		});
	}

	if (method === 'addBlockSite') {
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
