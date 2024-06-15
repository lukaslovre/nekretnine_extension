const TARGET_URLS = ["*://*.index.hr/oglasi/api/listings/indexitem*"];
const SINGLE_AD_URL = "https://www.index.hr/oglasi/api/listings/indexitem/single-ad?";
const UPDATE_VIEW_URL =
  "https://www.index.hr/oglasi/api/listings/indexitem/update-view-count";

// Function to handle individual fetch data
async function handleIndividualFetchData(link) {
  const response = await fetch(link);
  const data = await response.json();

  console.log({
    legalEntity: data.data[0].legalEntity,
    code: data.data[0].code,
    user: data.data[0].userInfo,
    title: data.data[0].title,
  });
}

// Function to handle fetch data
async function handleFetchData(data) {
  console.log(data);

  const apiLinks = data.data.map((item) => `${SINGLE_AD_URL}code=${item.code}&format=1`);
  console.log(apiLinks);

  // Use Promise.all to fetch all links concurrently
  await Promise.all(apiLinks.map(handleIndividualFetchData));
}

// Function to handle completed requests
async function onCompleted(details) {
  // Zato što moj fetch isto hvata ovaj request, pa da ne bi bilo beskonačne petlje
  if (details.initiator !== "https://www.index.hr") return;

  // If url starts with SINGLE_AD_URL or UPDATE_VIEW_URL, return
  if (details.url.startsWith(SINGLE_AD_URL) || details.url.startsWith(UPDATE_VIEW_URL))
    return;

  console.log(details);

  // Make the fetch myself
  const response = await fetch(details.url);
  const data = await response.json();
  await handleFetchData(data);
}

chrome.webRequest.onCompleted.addListener(onCompleted, { urls: TARGET_URLS });
