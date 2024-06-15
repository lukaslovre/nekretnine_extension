// On document laod
const items = document.querySelectorAll(".ant-row-flex .ant-col-xs-24 a[target='_self']");
console.log("Found items:", items.length);

const itemLinks = Array.from(items).map((item) => item.href);
console.log("Item links:", itemLinks);

// // Fetch first link
// fetch(itemLinks[0])
//   .then((response) => response.text())
//   .then((html) => {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, "text/html");

//     console.log(doc);

//     // const contactSection = doc.getElementById("contact");

//     // // Get all the text from the section
//     // const contactText = contactSection.innerText;
//     // console.log("Contact text:", contactText);
//   });
