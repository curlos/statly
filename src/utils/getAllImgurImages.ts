function getImgurImages() {
  const prefix = "https://i.imgur.com";
  const imgs = document.querySelectorAll(`img[src^="${prefix}"]`);
  return Array.from(imgs).map(img => img.src);
}

// Example:
const result = getImgurImages();
console.log(result);