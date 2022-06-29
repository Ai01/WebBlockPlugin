import React, { useState, useEffect } from "react";

export const SitesList = (props) => {
  const { redirect, overwrite } = props;
  const [list, setList] = useState([]);

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        method: "getAllBlockedSites",
      },
      (response) => {
        const { allBlockedSites } = response;

        // todo: 区分overwrite和redirect
        setList(allBlockedSites || []);
      }
    );
  }, []);

  return (
    <div
      style={{
        border: "1px solid rgb(224,224,224)",
        borderRadius: "12px",
        padding: "8px",
        marginTop: 30,
        maxWidth: 800,
        overflow: "hidden",
      }}
    >
      {Array.isArray(list) && list.length > 0 ? (
        list
          .filter((i) => {
            if (redirect) {
              return i && !i.overwrite;
            }
            if (overwrite) {
              return i && i.overwrite;
            }
          })
          .map((i) => {
            const { url, belling } = i || {};

            return (
              <div
                style={{
                  padding: "12px 18px 12px 12px",
                  background: "white",
                  fontSize: "14px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex" }}>
                  <img
                    src={`chrome://favicon/size/128@1x/${url}`}
                    style={{
                      width: "24px",
                      height: "24px",
                      border: "1px solid rgb(224,224,224)",
                      borderRadius: "4px",
                      padding: "2px",
                    }}
                  />
                  <div style={{ marginLeft: 10 }}>{url}</div>
                </div>
                {belling ? (
                  <img
                    src={"./images/block.svg"}
                    style={{ cursor: "pointer", width: 24, height: 24 }}
                    onClick={() => {
                      chrome.runtime.sendMessage(
                        {
                          method: "noBellBlockSite",
                          site: url,
                        },
                        (response) => {
                          const { allBlockedSites } = response;
                          console.log("test", response);

                          setList(allBlockedSites || []);
                        }
                      );
                    }}
                  />
                ) : (
                  <img
                    src={"./images/bell.svg"}
                    style={{ cursor: "pointer", width: 24, height: 24 }}
                    onClick={() => {
                      chrome.runtime.sendMessage(
                        {
                          method: "bellBlockSite",
                          site: url,
                        },
                        (response) => {
                          const { allBlockedSites } = response;
                          console.log("test", response);

                          setList(allBlockedSites || []);
                        }
                      );
                    }}
                  />
                )}
              </div>
            );
          })
      ) : (
        <div
          style={{
            color: "black",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          请添加网页
        </div>
      )}
    </div>
  );
};
