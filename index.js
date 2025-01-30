"use strict";

// state
chrome.storage.local.set({ tabs: {} });

// functions
async function valid(tabId) {
  const { tabs } = await chrome.storage.local.get("tabs");
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => document.body.classList.add("UI_Build_Assistant"),
  });
  await chrome.storage.local.set({ tabs: { ...tabs, [tabId]: true } });
}

async function invalid(tabId) {
  const { tabs } = await chrome.storage.local.get("tabs");
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => document.body.classList.remove("UI_Build_Assistant"),
  });
  await chrome.storage.local.set({ tabs: { ...tabs, [tabId]: false } });
}

async function initialize(tabId) {
  await chrome.scripting.insertCSS({
    target: { tabId },
    files: ["style.css"],
  });
  const { tabs } = await chrome.storage.local.get("tabs");
  if (tabs[tabId]) {
    await valid(tabId);
  }
}

// events
chrome.action.onClicked.addListener(async (tab) => {
  const { tabs } = await chrome.storage.local.get("tabs");
  tabs[tab.id] ? await invalid(tab.id) : await valid(tab.id);
});

chrome.tabs.onUpdated.addListener((tabId, { status }) => {
  if (status !== "loading") {
    return;
  }
  initialize(tabId);
});
