export async function downloadImage(url: string, filename: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not download the image.");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
