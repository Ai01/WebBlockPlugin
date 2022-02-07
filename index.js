const blockSiteButton = document.getElementById('add-block-page-button');

// todo: get the url of tab, now the site is the id for chrome extension
blockSiteButton.addEventListener('click', () => {
	const host = window.location.host.toString();
	console.log('test', window.location);
	chrome.runtime.sendMessage({method:'addBlockSite', site: host}, (response) => {
		console.log('addBlockSite', response);
	});
})
