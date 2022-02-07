// content script that will be inject into page, and then send message to background,
// if background say this page should be replace,
// the html will be overwrite

const getTemplate = data => `<html>${data}</html>`;

function renderTemplate(html) {
	if (!html) {
		return;
	}

	document.open();
	document.write(html)
	document.close();
}

chrome.runtime.sendMessage({method: "newTab", site: window.location.host.toString()}, (response) => {
	console.log('newTab response', response);

	const {data, overwrite} = response || {};
	if (!overwrite) return;

	const nextHtml = getTemplate(data);
	document.body.innerHTML = renderTemplate(nextHtml);
});
