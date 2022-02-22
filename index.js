class EventStore {
	constructor() {
		this.events = {}
		this.commonData = {};
	}

	listen(eventName, callback) {
		if (typeof callback !== 'function') return;
		if (typeof eventName !== 'string') return;

		if (!this.events[eventName]) {
			this.events[eventName] = [callback];
		} else {
			this.events[eventName].push(callback);
		}
	}

	fire(eventName, ...params) {
		if (typeof eventName !== 'string') return;
		if (!Array.isArray(this.events[eventName])) return;

		this.events[eventName].forEach(cb => {
			cb(...params);
		})
	}

	setCommonData(dataName, dataValue) {
		this.commonData[dataName] = dataValue;
	}
}

const EventCenter = new EventStore();
const ALL_BLOCKED_SITES = 'allBlockedSites'; // 获取所有已经被block的页面
const CURRENT_PAGE_NOT_BEEN_BLOCKED = 'currentPageNotBeenBlocked'; // 当前页面没有被blocked
const CURRENT_PAGE_BEEN_BLOCKED = 'currentPageBeenBlocked'; // 当前页面被blocked
const GET_PAGE_URL = 'getCurrentPageUrl'; // 获取当前页面的url

const judgeIsCurrentPageBlockedOrNot = (currentPageUrl, allBlockedSites) => {
	if (typeof currentPageUrl !== 'string') return;
	if (!Array.isArray(allBlockedSites)) return;

	let currentPageBeenBlocked = false;
	allBlockedSites.forEach(i => {
		const {url, host} = i;
		if ((host && currentPageUrl.indexOf(host) !== -1) || (url && !host && url === currentPageUrl)) {
			currentPageBeenBlocked = true;
		}
	});

	if (currentPageBeenBlocked) {
		EventCenter.fire(CURRENT_PAGE_BEEN_BLOCKED);
	} else {
		EventCenter.fire(CURRENT_PAGE_NOT_BEEN_BLOCKED);
	}
}

const setActiveUrlDom = (currentPageUrl) => {
	if(!currentPageUrl) return;
	const url = new URL(currentPageUrl);

	const ele = document.getElementById('url');
	ele.innerHTML = `${url.host}`;
};

const setFaviconDom = currentPageUrl => {
	if(!currentPageUrl) return;

	const ele = document.getElementById('icon');
	const img = document.createElement('img');
	img.setAttribute('src', `chrome://favicon/${currentPageUrl}`);
	img.setAttribute('style','width:40px;height:40px;');

	ele.appendChild(img);
}

// get all been blocked sites url info
EventCenter.listen(ALL_BLOCKED_SITES, (allBlockedSites) => {
	EventCenter.setCommonData('allBlockedSites', allBlockedSites);

	const {currentPageUrl} = EventCenter.commonData;
	judgeIsCurrentPageBlockedOrNot(currentPageUrl, allBlockedSites);
});
chrome.runtime.sendMessage({method: 'getAllBlockedSites'}, (response) => {
	console.log('response for all', response);
	const {allBlockedSites} = response || {};
	if (Array.isArray(allBlockedSites)) {
		EventCenter.fire(ALL_BLOCKED_SITES, allBlockedSites);
	}
});


// get the url of tab, window.location is the id for chrome extension
EventCenter.listen(GET_PAGE_URL, (currentPageUrl) => {
	EventCenter.setCommonData('currentPageUrl', currentPageUrl);

	setActiveUrlDom(currentPageUrl);
	setFaviconDom(currentPageUrl);

	const {allBlockedSites} = EventCenter.commonData;
	judgeIsCurrentPageBlockedOrNot(currentPageUrl, allBlockedSites);
});
chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
	if (Array.isArray(tabs) && tabs.length > 0) {
		const currentTab = tabs[0];
		const currentTabUrl = currentTab?.url;
		EventCenter.fire(GET_PAGE_URL, currentTabUrl)
	}
});

// when page been blocked, show the button to delete blocked page
EventCenter.listen(CURRENT_PAGE_BEEN_BLOCKED, () => {
	const showPageButton = document.getElementById('show-page-button');
	showPageButton.setAttribute('style', 'display:block');

	const formEle = document.getElementById('block-info-form');
	formEle.setAttribute('style', 'display:none');

	const {currentPageUrl} = EventCenter.commonData;
	const host = new URL(currentPageUrl).host.toString();

	showPageButton.addEventListener('click', () => {
		chrome.runtime.sendMessage({
			method: 'removeBlockSite',
			site: currentPageUrl,
			host,
		}, (response) => {
			console.log('removeBlockSite', response);
			const {success} = response;
			if (success) {
				// refresh current tab
				chrome.tabs.reload();

				// refresh popup
				window.location.reload();
			}
		});
	})
});

// when page isn't been blocked, add form ele to html and listen submit event;
EventCenter.listen(CURRENT_PAGE_NOT_BEEN_BLOCKED, () => {
	const formEle = document.getElementById('block-info-form');
	formEle.setAttribute('style', 'display:block');

	const showPageButton = document.getElementById('show-page-button');
	showPageButton.setAttribute('style', 'display:none');


	formEle.addEventListener('submit', () => {
		const messageText = document.forms["block-info-form"]["messageText"].value;
		const {currentPageUrl} = EventCenter.commonData;
		const host = new URL(currentPageUrl).host.toString();

		chrome.runtime.sendMessage({
			method: 'addBlockSite',
			site: currentPageUrl,
			host,
			message: messageText
		}, (response) => {
			console.log('removeBlockSite', response);
			const {success} = response;
			if (success) {
				// refresh current tab
				chrome.tabs.reload();

				// refresh popup
				window.location.reload();
			}
		});
	});

})

