"use strict";

// state
chrome.storage.local.set({ tabs: {} });

// functions
function valid(tabId) {
  chrome.storage.local.get("tabs", function ({ tabs }) {
    chrome.tabs.executeScript(tabId, { code: "document.body.classList.add('UI_Build_Assistant')" });
    chrome.storage.local.set({ tabs: { ...tabs, [tabId]: true } });
  });
}

function invalid(tabId) {
  chrome.storage.local.get("tabs", function ({ tabs }) {
    chrome.tabs.executeScript(tabId, { code: "document.body.classList.remove('UI_Build_Assistant')" });
    chrome.storage.local.set({ tabs: { ...tabs, [tabId]: false } });
  });
}

function initialize(tabId) {
  chrome.tabs.insertCSS(tabId, { file: "style.css" });
  chrome.storage.local.get("tabs", function ({ tabs }) {
    if (tabs[tabId]) {
      valid(tabId);
    }
  });
}

// events
chrome.browserAction.onClicked.addListener(function ({ id: tabId }) {
  chrome.storage.local.get("tabs", function ({ tabs }) {
    tabs[tabId] ? invalid(tabId) : valid(tabId);
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, { status }) {
  if (status !== "loading") {
    return;
  }
  initialize(tabId);
});
