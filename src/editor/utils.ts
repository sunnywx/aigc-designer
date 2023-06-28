export const downloadFile=(url: string, filename: string)=> {
  const anchorEl = document.createElement('a');
  anchorEl.href=url
  anchorEl.download = filename;
  document.body.appendChild(anchorEl); // required for firefox
  anchorEl.click();
  anchorEl.remove();
}