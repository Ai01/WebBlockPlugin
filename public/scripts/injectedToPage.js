// content script that will be inject into page, and then send message to background,
// if background say this page should be replace,
// the html will be overwrite

const getTemplate = (data) => `
  <html>
    <div style="position:absolute;top:0;bottom:0;left:0;right:0;display:flex;justify-content:center;align-items:center">
      <div style="font-size:26px;font-weight:bold;text-align:center;width:100%;word-break: break-word;white-space: pre-line;padding:0px 200px;">${data}</div>
    </div>
  </html>
`;

function renderTemplate(html) {
  if (!html) {
    return;
  }

  document.open();
  document.write(html);
  document.close();
}

chrome.runtime.sendMessage(
  { method: "newTab", site: window.location.host.toString() },
  (response) => {
    console.log("newTab response", response);

    const { data, overwrite, redirect, belling, minutes } = response || {};

    if (overwrite && !belling) {
      const nextHtml = getTemplate(data);
      renderTemplate(nextHtml);
      return;
    }

    if (redirect && !belling) {
      window.location.replace(redirect);
      return;
    }

    if (belling && overwrite) {
      setTimeout(() => {
        const nextHtml = getTemplate(data);
        renderTemplate(nextHtml);
      }, (Number(minutes) || 5) * 60 * 1000);
    }

    if (belling && redirect) {
      setTimeout(() => {
        window.location.replace(redirect);
      }, (Number(minutes) || 5) * 60 * 1000);
    }
  }
);
