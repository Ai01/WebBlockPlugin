const BLOCK_SITE_LIST = [
	{
		url: "twitter.com",
		matches: "twitter",
		message: "twitter 这种社交媒体不是在污染你的脑袋吗？关心这些无关的事情干什么？别做梦了，专心干活"
	},
	{
		url: "qidian.com",
		matches: "qidian",
		message: "小说是别人的造物，别沉迷其中了？别做梦了，专心干活"
	},
	{
		url: "weibo.com",
		matches: "weibo",
		message: "weibo 这种社交媒体不是在污染你的脑袋吗？关心这些无关的事情干什么？别做梦了，专心干活"
	}
]

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log('onMessage', message);

	const {method, site} = message || {};

	if (method === 'newTab') {

		let alreadySend = false;

		// overwrite if site is been blocked
		BLOCK_SITE_LIST.forEach(i => {
			const {url, matches, message} = i;

			if ((matches && site.indexOf(matches) !== -1) || (url && !matches && url === site)) {
				alreadySend = true;
				sendResponse({
					overwrite: true,
					data: message
				});
			}
		});

		if(!alreadySend) {
			sendResponse({
				overwrite: false,
				data: message
			});
		}

	}
});
