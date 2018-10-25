"use strict";

let parentOrigin;
let iframe;

window.addEventListener("message", function(event) {
  if (iframe && event.source === iframe.contentWindow) {
    relayMessageFromInnerToOuterIframe(event);
  } else if (event.origin.match(/^https:\/\/\w+\.google\.com$/)) {
    /* Needs to match url of the site your extension puts the iframe in. */
    if (event.data.eventName === "init") {
      parentOrigin = event.origin;
      setupIFrame(event.data.iframeSrc);
    }
  } else {
    /* Message from unknown source */
    return;
  }
});

/**
 * Create an iframe with the given source.
 *
 * On load, sends message to outer iframe that the requested
 * iframe has been set.
 * @params src: URL for the requested iframe.
 */
function setupIFrame(src) {
  iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.setAttribute(
    "style",
    "height: 100%; width: 100%; border: 0; margin: 0;"
  );
  iframe.addEventListener(
    "load",
    () => {
      window.parent.postMessage(
        { eventName: "innerFrameLoaded" },
        parentOrigin
      );
    },
    false
  );
  document.body.appendChild(iframe);
};

const relayMessageFromInnerToOuterIframe = event => {
  const message = { innerFrameData: event.data };
  const transferableList = event.data && event.data.transferableList;
  window.parent.postMessage(message, parentOrigin, transferableList);
};
