const formEle = document.getElementById('block-info-form');


formEle.addEventListener('submit', () => {
	const messageText = document.forms["block-info-form"]["messageText"].value;

	// get the url of tab, window.location is the id for chrome extension
	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		if (Array.isArray(tabs) && tabs.length > 0) {
			const currentTab = tabs[0];
			const currentTabUrl = currentTab?.url;
			const host = new URL(currentTabUrl).host.toString();

			chrome.runtime.sendMessage({
				method: 'addBlockSite',
				site: currentTabUrl,
				host,
				message: messageText
			}, (response) => {
				console.log('addBlockSite', response);
			});
		}
	});

	return false;
})
