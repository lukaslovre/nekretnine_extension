chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const results = request.results;
  console.log(results);

  let items;
  let attempts = 0;

  while (attempts < 10) {
    items = document.querySelectorAll(".ant-row-flex .ant-col-xs-24 a[target='_self']");

    if (items.length > 0) {
      // Check if the first items exists in the results
      const firstItem = items[0].attributes["title"]?.value.trim().toLowerCase();
      console.log("First item:", firstItem);

      const firstResult = results.find(
        (result) => result.title.toLowerCase() === firstItem
      );

      if (firstResult) break;
    }

    attempts++;

    // wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Iterate over all items
  items.forEach((item) => {
    // get the title of the item
    const ElementTitle = item.attributes["title"]?.value.trim().toLowerCase();

    // Find the result that matches the title
    const itemResult = results.find(
      (result) => result.title.toLowerCase() === ElementTitle
    );

    if (itemResult) {
      console.log(itemResult);

      // Const some deeper element of the item
      const farChild = item.childNodes[0]?.childNodes[0]?.childNodes[1]?.childNodes[0];

      if (farChild) {
        farChild.appendChild(generateSellerElement(itemResult));
      }
    } else {
      console.log(`No result found for ${ElementTitle}`);
    }
  });
});

function generateSellerElement(data) {
  const personIconSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_23_212)">
    <path d="M10.0002 10C11.8418 10 13.3335 8.50833 13.3335 6.66666C13.3335 4.82499 11.8418 3.33333 10.0002 3.33333C8.1585 3.33333 6.66683 4.82499 6.66683 6.66666C6.66683 8.50833 8.1585 10 10.0002 10ZM10.0002 11.6667C7.77516 11.6667 3.3335 12.7833 3.3335 15V16.6667H16.6668V15C16.6668 12.7833 12.2252 11.6667 10.0002 11.6667Z" fill="#0B5EDA"/>
    </g>
    <defs>
    <clipPath id="clip0_23_212">
    <rect width="20" height="20" fill="white"/>
    </clipPath>
    </defs>
    </svg>`;

  const blockIconSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_35_4)">
    <path d="M9.99984 1.66667C5.39984 1.66667 1.6665 5.40001 1.6665 10C1.6665 14.6 5.39984 18.3333 9.99984 18.3333C14.5998 18.3333 18.3332 14.6 18.3332 10C18.3332 5.40001 14.5998 1.66667 9.99984 1.66667ZM3.33317 10C3.33317 6.31667 6.3165 3.33334 9.99984 3.33334C11.5415 3.33334 12.9582 3.85834 14.0832 4.74167L4.7415 14.0833C3.85817 12.9583 3.33317 11.5417 3.33317 10ZM9.99984 16.6667C8.45817 16.6667 7.0415 16.1417 5.9165 15.2583L15.2582 5.91667C16.1415 7.04167 16.6665 8.45834 16.6665 10C16.6665 13.6833 13.6832 16.6667 9.99984 16.6667Z" fill="#F63E02"/>
    </g>
    <defs>
    <clipPath id="clip0_35_4">
    <rect width="20" height="20" fill="white"/>
    </clipPath>
    </defs>
    </svg>`;

  // For testing
  const sellerNumberOfItems = 0;

  // Create seller link element
  const sellerLinkElement = document.createElement("a");
  //   sellerLinkElement.href = sellerLink;
  sellerLinkElement.classList.add("seller-link");
  sellerLinkElement.innerHTML = `${personIconSvg}<span>${data.user.username} (${sellerNumberOfItems}) - ${data.legalEntity}</span>`;
  sellerLinkElement.title = `Pogledajte profil korisnika ${data.user.username}`;

  // Create block user element
  const sellerBlockElement = document.createElement("button");
  sellerBlockElement.classList.add("block-seller-button");
  sellerBlockElement.innerHTML = `${blockIconSvg}`;
  sellerBlockElement.title = `Blokiraj korisnika ${data.user.username}`;
  sellerBlockElement.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(`Block user ${data.user.username}`);
    // sendSellerNameToBackend(sellerName);
  });

  // Put the two elements in a container
  const sellerActionsContainer = document.createElement("div");
  sellerActionsContainer.classList.add("seller-actions-container");
  sellerActionsContainer.appendChild(sellerLinkElement);
  sellerActionsContainer.appendChild(sellerBlockElement);

  return sellerActionsContainer;

  //   newElement.textContent = `Legal entity: ${data.legalEntity}. User: ${data.user.username}. Title: ${data.title}.`;
}
