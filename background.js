chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    console.log(`Loading: ${details.url}`);
  },
  { urls: ["<all_urls>"] }
);
