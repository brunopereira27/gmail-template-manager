"use strict";

let parentOrigin;
const iframe = document.createElement("iframe");

window.addEventListener("message", event => {
  if (event.source === iframe.contentWindow) {
    relayMessageFromInnerToOuterIframe(event);
  } else if (iframe && event.origin.match(/^https:\/\/\w+\.google\.com$/)) {
    /* Needs to match url of the site your extension puts the iframe in. */
    if (event.data.eventName === "init") {
      parentOrigin = event.origin;
      setupIFrame(event.data.iframeSrc);
    }
  } else {
    throw new Error("Message from unknown source");
  }
});

/**
 * Create an iframe with the given source.
 *
 * On load, sends message to outer iframe that the requested
 * iframe has been set.
 * @params src: URL for the requested iframe.
 */
const setupIFrame = src => {
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
