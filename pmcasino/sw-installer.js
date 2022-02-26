window.addEventListener("load", () => {
  (()=>{
    if ("serviceWorker" in navigator) {
      let pwaInstallButton = document.getElementById('sw-install-button')
      
      if(pwaInstallButton == null) console.error('pwa button is not defined!')
      
      pwaInstallButton.classList.toggle('--is-disabled', false);

      navigator.serviceWorker.register("service-worker.js").then(()=>{
        let deferredPrompt;
      
        window.addEventListener('beforeinstallprompt', (e) => {
          // Prevent the mini-infobar from appearing on mobile
          e.preventDefault();
          // Stash the event so it can be triggered later.
          deferredPrompt = e;
          // Update UI notify the user they can install the PWA
          // As button already enabled by default there is no need to show
          // anyway, if you need, you can show popup or notification 
          // from here
        });
        
        pwaInstallButton.addEventListener('click', (e) => {
          // Hide the app provided install promotion
          pwaInstallButton.classList.toggle('--is-installed', true);
          // Show the install prompt
          deferredPrompt.prompt();
          // Wait for the user to respond to the prompt
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              // TODO: send to analitics first point
              window.location.replace("https://pmaff.com/?serial=61281196&creative_id=510&anid=");
            } else {
              console.log('User dismissed the install prompt');
            };
          });
        });
    
      });
    } else {
      // disable button or show that pwa is not supported
      pwaInstallButton.classList.toggle('--is-disabled', true);
    };
  })();
});

self.addEventListener('DOMContentLoaded', () => {
  let displayMode = 'browser tab';
  if (navigator.standalone) {
    displayMode = 'standalone-ios';
  }
  if (window.matchMedia('(display-mode: standalone)').matches) {
    displayMode = 'standalone';
  }
  if(displayMode == 'standalone' || displayMode == 'standalone-ios'){
    // TODO: if app is installed then you can call any function
    // to use pixel and etc
    self.location.replace("https://pmaff.com/?serial=61281196&creative_id=510&anid=");
  }
});
