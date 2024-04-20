import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="push"
export default class extends Controller {
  connect() {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          this.registerServiceWorker();
        } else if (permission === "denied") {
          console.warn("User had denied notificaiton.");
        } else {
          console.warn("User has still not allowed notifications.");
        }
      });
    } else {
      console.warn("Notification not supported by user");
    }
  }

  registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service_worker.js")
        .then((serviceWorkerRegisgration) => {
          serviceWorkerRegisgration.pushManager
            .getSubscription()
            .then((existingSubs) => {
              if (!existingSubs) {
                serviceWorkerRegisgration.pushManager
                  .subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: this.element.getAttribute(
                      "data-application-server-key"
                    ),
                  })
                  .then((subscription) => this.saveSubscription(subscription));
              }
            });
        });
    }
  }

  saveSubscription(subs) {
    const endpoint = subs.endpoint;
    const auth = btoa(
      String.fromCharCode.apply(null, new Uint8Array(subs.getKey("auth")))
    );
    const p256dh = btoa(
      String.fromCharCode.apply(null, new Uint8Array(subs.getKey("p256dh")))
    );

    fetch("/notifications/subscribe", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": document
          .querySelector('meta[name="csrf-token"]')
          .getAttribute("content"),
      },
      body: JSON.stringify({ auth, endpoint, p256dh, subscribed: true }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Subscription successfully created on server");
        } else {
          console.warn("Error saving subscription on server");
        }
      })
      .catch((error) => console.warn("Error sending subscription to server"));
  }
}
