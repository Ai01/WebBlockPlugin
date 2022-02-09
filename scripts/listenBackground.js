// todo: if block site can customize add, where to storage user's block site
let BLOCK_SITE_LIST = [
	// {
	// 	url: "twitter.com",
	// 	host: "twitter",
	// 	message: "twitter 这种社交媒体不是在污染你的脑袋吗？关心这些无关的事情干什么？别做梦了，专心干活"
	// },
	// {
	// 	url: "qidian.com",
	// 	host: "qidian",
	// 	message: "小说是别人的造物，别沉迷其中了。别做梦了，专心干活"
	// },
	// {
	// 	url: "weibo.com",
	// 	host: "weibo",
	// 	message: "weibo 这种社交媒体不是在污染你的脑袋吗？关心这些无关的事情干什么？别做梦了，专心干活"
	// }
]

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log('onMessage', message);

	const {method, site} = message || {};

	if (method === 'newTab') {
		// overwrite the html page if site is been blocked
		BLOCK_SITE_LIST.forEach(i => {
			const {url, host, message} = i;

			if ((host && site.indexOf(host) !== -1) || (url && !host && url === site)) {
				sendResponse({
					overwrite: true,
					data: message
				});
			}
		});
		return;
	}

	if (method === 'addBlockSite') {
		const {site} = message;
		BLOCK_SITE_LIST.push({
			url: site,
			...message
		});

		sendResponse({success: true});
		return;
	}

	if (method === 'removeBlockSite') {
		const {site: siteToRemove, host: hostToRemove} = message;

		let removeIndex = -1;
		BLOCK_SITE_LIST.forEach((i, index) => {
			const {site, host} = i || {};
			if (site === siteToRemove || host === hostToRemove) {
				removeIndex = index;
			}
		})

		BLOCK_SITE_LIST[removeIndex] = null;
		BLOCK_SITE_LIST = BLOCK_SITE_LIST.filter(i => !!i);

		sendResponse({success: true});
		return;
	}

	if (method === 'getAllBlockedSites') {
		sendResponse({
			allBlockedSites: BLOCK_SITE_LIST
		});
		return;
	}

});
