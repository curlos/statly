// TODO: DO NOT DELETE. This is merely a way to show how I'd grab imgur img links if adding more medal images in the future.
function getImgurImages() {
  const prefix = "https://i.imgur.com";
  const imgs = document.querySelectorAll(`img[src^="${prefix}"]`);
  return Array.from(imgs).map(img => img.src);
}

// Example:
const result = getImgurImages();
console.log(result);