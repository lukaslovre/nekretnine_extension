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
        const newElement = document.createElement("div");
        newElement.textContent = `Legal entity: ${itemResult.legalEntity}. User: ${itemResult.user.username}. Title: ${itemResult.title}.`;
        farChild.appendChild(newElement);
      }
    } else {
      console.log(`No result found for ${ElementTitle}`);
    }
  });
});
