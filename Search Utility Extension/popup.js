document.addEventListener("DOMContentLoaded", () => {
  const shortcutInput = document.getElementById("shortcut");
  const urlInput = document.getElementById("url");
  const addShortcutButton = document.getElementById("add-shortcut");
  const shortcutList = document.getElementById("shortcut-list");

  const renderShortcuts = () => {
    chrome.storage.sync.get(["shortcuts"], (data) => {
      const shortcuts = data.shortcuts || {};
      shortcutList.innerHTML = "";

      for (const [shortcut, url] of Object.entries(shortcuts)) {
        const item = document.createElement("div");
        item.className = "shortcut-item";

        const text = document.createElement("span");
        text.textContent = `${shortcut}: ${url}`;
        item.appendChild(text);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
          delete shortcuts[shortcut];
          chrome.storage.sync.set({ shortcuts }, renderShortcuts);
        });
        item.appendChild(deleteButton);

        shortcutList.appendChild(item);
      }
    });
  };

  addShortcutButton.addEventListener("click", () => {
    const shortcut = shortcutInput.value.trim();
    const url = urlInput.value.trim();

    if (shortcut && url) {
      chrome.storage.sync.get(["shortcuts"], (data) => {
        const shortcuts = data.shortcuts || {};
        shortcuts[shortcut] = url;
        chrome.storage.sync.set({ shortcuts }, () => {
          shortcutInput.value = "";
          urlInput.value = "";
          renderShortcuts();
        });
      });
    }
  });

  renderShortcuts();
});
