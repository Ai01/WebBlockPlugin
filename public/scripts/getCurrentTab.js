chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
	if(Array.isArray(tabs) && tabs.length > 0) {
		const currentTab = tabs[0];
		console.log('current tab', currentTab);
	}
});
