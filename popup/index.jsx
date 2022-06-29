import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

const Popup = () => {
  const [allBlockedSites, setAllBlockSites] = useState([]);
  const [currentPageUrl, setCurrentPageUrl] = useState("");
  const [isCurrentPageBlocked, setIsCurrentPageBlocked] = useState("");

  // get all blocked sites
  useEffect(() => {
    chrome.runtime.sendMessage({ method: "getAllBlockedSites" }, (response) => {
      console.log("response for all", response);
      const { allBlockedSites } = response || {};
      if (Array.isArray(allBlockedSites)) {
        setAllBlockSites(allBlockedSites);
      }
    });
  }, []);

  // get current tab url
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (Array.isArray(tabs) && tabs.length > 0) {
        const currentTab = tabs[0];
        const currentTabUrl = currentTab?.url;
        setCurrentPageUrl(currentTabUrl);
      }
    });
  }, []);

  // judge is current page been blocked or not
  useEffect(() => {
    if (typeof currentPageUrl !== "string") return;
    if (!Array.isArray(allBlockedSites)) return;

    let currentPageBeenBlocked = false;

    allBlockedSites.forEach((i) => {
      const { url, host } = i;
      if (
        (host && currentPageUrl.indexOf(host) !== -1) ||
        (url && !host && url === currentPageUrl)
      ) {
        currentPageBeenBlocked = true;
      }
    });

    if (currentPageBeenBlocked) {
      setIsCurrentPageBlocked(true);
    } else {
      setIsCurrentPageBlocked(false);
    }
  }, [currentPageUrl, allBlockedSites]);

  const host = currentPageUrl ? new URL(currentPageUrl).host : null;

  return (
    <>
      <div id="header">
        <div id="icon-background"></div>
        <div id="icon">
          {currentPageUrl ? (
            <img
              style={{ width: "40px", height: "40px" }}
              src={`chrome://favicon/size/128@1x/${currentPageUrl}`}
            />
          ) : null}
        </div>
        <div id="url">{host}</div>
      </div>
      <div id="container-body">
        {isCurrentPageBlocked ? (
          <button
            id="show-page-button"
            onClick={() => {
              chrome.runtime.sendMessage(
                {
                  method: "removeBlockSite",
                  site: currentPageUrl,
                  host,
                },
                (response) => {
                  console.log("removeBlockSite", response);
                  const { success } = response;
                  if (success) {
                    // refresh current tab
                    chrome.tabs.reload();

                    setIsCurrentPageBlocked(false);
                  }
                }
              );
            }}
          >
            显示此页面
          </button>
        ) : (
          <div id="block-info-form" class="form-example">
            <div id="button-containers">
              <button
                id="add-block-page-button"
                onClick={() => {
                  chrome.runtime.sendMessage(
                    {
                      method: "addBlockSite",
                      site: currentPageUrl,
                      host,
                    },
                    (response) => {
                      const { success } = response;
                      if (success) {
                        // refresh current tab
                        chrome.tabs.reload();

                        setIsCurrentPageBlocked(true);
                      }
                    }
                  );
                }}
              >
                拦截此页面
              </button>
              <button
                id="redirect-block-page-button"
                onClick={() => {
                  chrome.runtime.sendMessage(
                    {
                      method: "addRedirectSite",
                      site: currentPageUrl,
                      host,
                    },
                    (response) => {
                      const { success } = response;
                      if (success) {
                        // refresh current tab
                        chrome.tabs.reload();
                      }
                    }
                  );
                }}
              >
                重定向此页面
              </button>
            </div>
          </div>
        )}
      </div>

      <div id="footer">
        <div class="footer-icon-container">
          <img
            class="image-icon"
            id="active-page-setting"
            src="/images/block.svg"
          />
          <div>当前页面</div>
        </div>
        <div
          class="footer-icon-container"
          id="setting-page"
          onClick={() => {
            window.open("/options.html");
          }}
        >
          <img class="image-icon" src="/images/setting.svg" />
          <div>插件设置</div>
        </div>
      </div>
    </>
  );
};

ReactDOM.render(<Popup />, document.getElementById("root"));
