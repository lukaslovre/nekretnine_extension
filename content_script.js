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
  return sellerLinkElement;
};

const appendSellerLinkToItemTitle = (item, sellerLinkElement) => {
  const itemTitle = item.querySelector("h3.entity-title");
  itemTitle.appendChild(sellerLinkElement);
};

const fetchAndProcessUserPage = async (sellerLink) => {
  const response = await fetch(sellerLink);
  const html = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const numberOfItems = parseInt(doc.querySelector(".entities-count").textContent);
  return numberOfItems;
};

const fetchAndProcessItemPage = (item, itemLink) => {
  fetch(itemLink)
    .then((response) => response.text())
    .then(async (html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const sellerLink = doc.querySelector(".ClassifiedDetailOwnerDetails-title a").href;
      const sellerName = getSellerName(sellerLink);
      const sellerNumberOfItems = await fetchAndProcessUserPage(sellerLink);
      const sellerLinkElement = createSellerLinkElement(
        sellerLink,
        sellerName,
        sellerNumberOfItems
      );
      appendSellerLinkToItemTitle(item, sellerLinkElement);
    });
};

const processItems = (items) => {
  hideNonUserItems(items);
  items.forEach((item) => {
    if (item.style.display !== "none") {
      const itemTitle = item.querySelector("h3.entity-title");
      const itemLink = itemTitle.querySelector("a.link").href;
      fetchAndProcessItemPage(item, itemLink);
    }
  });
};

const items = document.querySelectorAll("li.EntityList-item");
console.log(items.length);
processItems(items);
