// Addley — service worker for push notifications only.
//
// This does not do offline caching or any other PWA-shell behavior —
// its one job is to receive a push while the app isn't open (or the
// phone is locked) and show it, then focus/open the app on tap. Kept
// deliberately minimal so it can't interfere with anything else the
// app does.

self.addEventListener("install", () => {
  // Activate immediately rather than waiting for every open tab to
  // close first — there's no old cache here to conflict with.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Same mark used for the browser tab/Home Screen icon (index.html's
// apple-touch-icon) — inlined here as a data URI rather than a new
// image file, so there's nothing extra to add to the repo and no risk
// of a broken-icon notification if a path is ever wrong.
const NOTIFICATION_ICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAIAAACyr5FlAAAEKUlEQVR4nO3dIa5kVRSFYSA9AwSaGTAJDIIpIFBoJBqJRiGYAgLDJJgBmgQUAos4ptKP1UnX3fucfV++bwDVS/zZt/ql+90P//3nrw/g/3x0egBziYNIHETiIBIHkTiIxEEkDiJxEImDSBxE4iASB5E4iMRBJA4icRCJg0gcROIgEgfRm/1/5N9//lH+mR9/8mn5Z170+28/l3/mZ59/Vf6Z7/Dhtv+a0NHES8cr6WjipT2V7IhjTxaPjiSyJ4tH3Yn0xrE/i0fbEtmfxaO+RBq/kJ4tY9uAs2W0DuiK43gZS/eM42UsTTNa4hhSxtI3ZkgZS8eY+jhGlbF0TBpVxlI+qTiOgWUstcMGlrHUDquMY2wZS9W8sWUshfP8+JyoLI7hZ2O5PnL42ViqRrocRDVx3OJsLFem3uJsLCVTXQ4icRAVxHGjZ8ry3OAbPVOW64NdDiJxEImDSBxE4iASB5E4iMRBJA4icRCJg0gcROIgEgeROIjEQSQOInEQiYNIHETiIBIHkTiIxEEkDiJxEImDqCCO479R+n09N3jz7x2/7vpgl4NIHEQ1cdzoyXJl6o2eLCVTXQ6isjhucTyuj7zF8aga6XIQVcYx/HhUzRt+PArnFV+OsX3UDhvbR+2w+sfKwD46Jg3so3xSy3eOUX30jRnVR8eYri+kQ/ronjGkj6YZjX9bOd7HngHH++gb4NWhZbw69HleOlzo9bx0+C1eV/60V/u6cm7Hj8+JxEEkDiJxEImDSBxE4iASB5E4iMRBJA4icRCJg0gcROIgEgfRm/1/5C8/fF3+mV9++1P5Z170/TdflH/mdz/+Wv6Z77DvX4J1NPHS8Uo6mnhpTyU74tiTxaMjiezJ4lF3Ir1x7M/i0bZE9mfxqC+Rxi+kZ8vYNuBsGa0DuuI4XsbSPeN4GUvTjJY4hpSx9I0ZUsbSMaY+jlFlLB2TRpWxlE8qjmNgGUvtsIFlLLXDKuMYW8ZSNW9sGUvhPD8+JyqLY/jZWK6PHH42lqqRLgdRTRy3OBvLlam3OBtLyVSXg0gcRAVx3OiZsjw3+EbPlOX6YJeDSBxE4iASB5E4iMRBJA4icRCJg0gcROIgEgeROIjEQSQOInEQiYNIHETiIBIHkTiIxEEkDiJxEImDSBxE4iAqiOP4b5R+X88N3vx7x6+7PtjlIBIHUU0cN3qyXJl6oydLyVSXg6gsjlscj+sjb3E8qka6HESVcQw/HlXzhh+PwnnFl2NsH7XDxvZRO6z+sTKwj45JA/son9TynWNUH31jRvXRMabrC+mQPrpnDOmjaUbj31aO97FnwPE++gZ4dWgZrw59npcOF3o9Lx1+i9eVP+3Vvq6c2/HjcyJxEImDSBxE4iASB5E4iMRBJA4icRCJg0gcROIgEgeROIjEQSQOInEQiYNIHET/Ae9aV/dGLbggAAAAAElFTkSuQmCC";

self.addEventListener("push", (event) => {
  let data = { title: "Addley", body: "" };
  try {
    if (event.data) data = event.data.json();
  } catch (err) {
    // A push with a plain-text body (not JSON) still shows something
    // rather than failing silently.
    if (event.data) data.body = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "Addley", {
      body: data.body || "",
      icon: NOTIFICATION_ICON,
      badge: NOTIFICATION_ICON,
      tag: data.tag || "addley-notification",
    })
  );
});

// Tapping the notification brings an already-open Addley tab to the
// front instead of opening a duplicate one, and only opens a fresh tab
// if none is open.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow("/");
    })
  );
});
