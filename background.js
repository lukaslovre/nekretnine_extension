const TARGET_URLS = ["*://*.index.hr/oglasi/api/listings/indexitem*"];
const SINGLE_AD_URL = "https://www.index.hr/oglasi/api/listings/indexitem/single-ad?";
const UPDATE_VIEW_URL =
  "https://www.index.hr/oglasi/api/listings/indexitem/update-view-count";

// Function to handle individual fetch data (fetch data for each ad to get user status)
async function handleIndividualFetchData(link) {
  const response = await fetch(link);
  return response.json();
}

// Function to handle fetch data
async function handleFetchData(data) {
  console.log("Data response from fetch: ");
  console.log(data);

  const apiLinks = data.data.map((item) => `${SINGLE_AD_URL}code=${item.code}&format=1`);
  console.log("API Links: ");
  console.log(apiLinks);

  // Use Promise.all to fetch all links concurrently
  const responses = await Promise.all(apiLinks.map(handleIndividualFetchData));

  const results = responses
    .map((result) => {
      if (!result.data[0]) return null;

      return {
        legalEntity: result.data[0].legalEntity,
        code: result.data[0].code,
        user: result.data[0].userInfo,
        title: result.data[0].title,
      };
    })
    .filter((result) => result !== null);

  console.log("Results: ");
  console.log(results);

  sendMessageToContentScript(results);
}

// Function to handle completed requests
async function onCompleted(details) {
  // Zato što moj fetch isto hvata ovaj request, pa da ne bi bilo beskonačne petlje
  if (details.initiator !== "https://www.index.hr") return;

  // If url starts with SINGLE_AD_URL or UPDATE_VIEW_URL, return
  if (details.url.startsWith(SINGLE_AD_URL) || details.url.startsWith(UPDATE_VIEW_URL))
    return;

  console.log("Request completed: ");
  console.log(details);

  // Make the fetch myself
  const response = await fetch(details.url);
  const data = await response.json();
  await handleFetchData(data);
}

chrome.webRequest.onCompleted.addListener(onCompleted, { urls: TARGET_URLS });

// Function to send a message to the content_script of the results array
function sendMessageToContentScript(results) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { results });
  });
}
