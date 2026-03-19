// Default shortcuts
const defaultShortcuts = {
  yt: "https://www.youtube.com/results?search_query=",
  amz: "https://www.amazon.com/s?k=",
  ggl: "https://www.google.com/search?q="
};

// Load shortcuts from storage or set defaults
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["shortcuts"], (data) => {
    if (!data.shortcuts) {
      chrome.storage.sync.set({ shortcuts: defaultShortcuts });
    }
  });
});

// Handle omnibox input
chrome.omnibox.onInputEntered.addListener((text) => {
  const [shortcut, ...queryWords] = text.split(" ");
  const query = queryWords.join(" ");

  chrome.storage.sync.get(["shortcuts"], (data) => {
    const shortcuts = data.shortcuts || defaultShortcuts;
    const url = shortcuts[shortcut];

    if (url) {
      chrome.tabs.create({ url: `${url}${encodeURIComponent(query)}` });
    } else {
      chrome.tabs.create({
        url: `https://www.google.com/search?q=${encodeURIComponent(text)}`
      });
    }
  });
});
