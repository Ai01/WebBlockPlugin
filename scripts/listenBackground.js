// todo: if block site can customize add, where to storage user's block site
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
	}
]

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log('onMessage', message);

	const {method, site} = message || {};

	if (method === 'newTab') {

		// overwrite if site is been blocked
		BLOCK_SITE_LIST.forEach(i => {
			const {url, host, message} = i;

			if ((host && site.indexOf(host) !== -1) || (url && !host && url === site)) {
				sendResponse({
					overwrite: true,
					data: message
				});
			}
		});

	}

	if (method === 'addBlockSite') {
		const {site} = message;
		BLOCK_SITE_LIST.push({
			url: site,
			...message
		});

		// refresh current tab
		chrome.tabs.reload();
	}

});
