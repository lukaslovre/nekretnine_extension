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

const USER_UUID = "2f90cb17-1879-4c35-ba10-98f703bb4d1f";

const hideNonUserItems = (items) => {
  items.forEach((item) => {
    if (!item.querySelector(".feature--User")) {
      item.style.display = "none";
    }
  });
};

const getSellerName = (sellerLink) => {
  const searchString = "korisnik/";
  const sellerNameStartIndex = sellerLink.indexOf(searchString) + searchString.length;
  return sellerLink.slice(sellerNameStartIndex);
};

const createSellerLinkElement = (sellerLink, sellerName, sellerNumberOfItems) => {
  const sellerLinkElement = document.createElement("a");
  sellerLinkElement.href = sellerLink;
  sellerLinkElement.classList.add("seller-link");
  sellerLinkElement.innerHTML = `${personIconSvg}<span>${sellerName} (${sellerNumberOfItems})</span>`;
  sellerLinkElement.title = `Pogledajte profil korisnika ${sellerName}`;
  return sellerLinkElement;
};

const sendSellerNameToBackend = (sellerName) => {
  fetch("http://localhost:3000/block-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      website: "njuskalo.hr",
      sellerName,
      requestComingFromUuid: USER_UUID,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      alert(
        "Došlo je do greške prilikom blokiranja korisnika. (Pogledajte konzolu za više informacija)"
      );
      console.error("Error blocking seller:", error);
    });
};

const createSellerBlockElement = (sellerName) => {
  const blockElement = document.createElement("button");
  blockElement.classList.add("block-seller-button");
  blockElement.innerHTML = `${blockIconSvg}`;
  blockElement.title = `Blokiraj korisnika ${sellerName}`;
  blockElement.addEventListener("click", (e) => {
    e.preventDefault();
    sendSellerNameToBackend(sellerName);
  });

  return blockElement;
};

const appendSellerActionsToTitle = (item, sellerLinkElement, sellerBlockElement) => {
  const itemTitle = item.querySelector("h3.entity-title");

  // Put the two elements in a container
  const sellerActionsContainer = document.createElement("div");
  sellerActionsContainer.classList.add("seller-actions-container");
  sellerActionsContainer.appendChild(sellerLinkElement);
  sellerActionsContainer.appendChild(sellerBlockElement);

  itemTitle.appendChild(sellerActionsContainer);
};

const fetchAndProcessUserPage = async (sellerLink) => {
  try {
    const response = await fetch(sellerLink);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const numberOfItems = parseInt(doc.querySelector(".entities-count").textContent);
    return numberOfItems;
  } catch (error) {
    console.error("Error fetching user page:", error);
    return 0;
  }
};

const fetchAndProcessItemPage = (item, itemLink, blockedSellers) => {
  fetch(itemLink)
    .then((response) => response.text())
    .then(async (html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const sellerLink = doc.querySelector(".ClassifiedDetailOwnerDetails-title a").href;
      const sellerName = getSellerName(sellerLink);

      const isSellerBlocked = blockedSellers.some((seller) => seller.name === sellerName);
      if (isSellerBlocked) {
        item.style.display = "none";
        return;
      }

      const sellerNumberOfItems = await fetchAndProcessUserPage(sellerLink);
      const sellerLinkElement = createSellerLinkElement(
        sellerLink,
        sellerName,
        sellerNumberOfItems
      );
      const sellerBlockElement = createSellerBlockElement(sellerName);
      appendSellerActionsToTitle(item, sellerLinkElement, sellerBlockElement);
    });
};

const getBlockedUsers = async (blockedByUuid) => {
  const url = new URL("http://localhost:3000/blocked-users");
  url.searchParams.append("blockedByUuid", blockedByUuid);
  url.searchParams.append("website", "njuskalo.hr");

  try {
    const response = await fetch(url);
    const { blockedSellers } = await response.json();

    return blockedSellers;
  } catch (error) {
    console.error("Error getting blocked users:", error);
    return [];
  }
};

const processItems = async (items) => {
  hideNonUserItems(items);

  const blockedSellers = await getBlockedUsers(USER_UUID);
  console.log(`Api returned ${blockedSellers.length} blocked sellers.`);

  items.forEach((item) => {
    if (item.style.display !== "none") {
      const itemTitle = item.querySelector("h3.entity-title");
      const itemLink = itemTitle.querySelector("a.link").href;
      fetchAndProcessItemPage(item, itemLink, blockedSellers);
    }
  });
};

const items = document.querySelectorAll("li.EntityList-item");
console.log(`Found ${items.length} items total.`);

processItems(items);
