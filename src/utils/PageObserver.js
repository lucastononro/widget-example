export function initializeObserver() {
    // Example: Track clicks on the page
    document.addEventListener('click', event => {
      const description = event.target.tagName.toLowerCase();
      // console.log(`User clicked on: ${description}`);
      // Here, you can emit events or send data to your chat iframe
    });
  
    // Example: Track input focus on the page
    document.addEventListener('focusin', event => {
      const description = event.target.tagName.toLowerCase();
      // console.log(`User focused on: ${description}`);
      // Here, you can emit events or send data to your chat iframe
    });
  }