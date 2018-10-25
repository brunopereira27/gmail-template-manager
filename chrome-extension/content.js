/* This value would come from env variable set at build
 * time by webpack for example. But this is beyond the scope
 * of the test I guess.
 */
const TEMPLATE_MANAGER_URL = "https://localhost:3000/";
let modal;

InboxSDK.load("1", "AMPLEMARKET_TEMPLATE_MANAGER_ID").then(sdk => {
  sdk.Compose.registerComposeViewHandler(composeView => {
    /* Generate button that opens a modal with TEMPLATE_MANAGER_URL as source. */
    composeView.addButton({
      title: "Use template",
      iconUrl:
        "https://lh5.googleusercontent.com/itq66nh65lfCick8cJ-OPuqZ8OUDTIxjCc25dkc4WUT1JG8XG3z6-eboCu63_uDXSqMnLRdlvQ=s128-h128-e365",
      onClick: event => {
        const iframe = generateIframe(TEMPLATE_MANAGER_URL, composeView);
        modal = sdk.Widgets.showModalView({ el: iframe });
        modal.on("destroy", function() {
          window.removeEventListener("message", modalMessageHandler, false);
        });
      }
    });
  });
});

/**
 * Generates an iframe element which displays the website
 * specified by the iframeSrc argument.
 *
 * Note
 * ----
 * However, in the context of a chrome-extension that is run
 * in the gmail webapp, we cannot load external resources not
 * whitelisted by gmail CSP rules.
 * As a consequence, we generate our iframe with the following workarround:
 * 1 - Generates a first iframe which has iframe.html as a source.
 *     This file belongs to our chrome-extension, so it is allowed.
 * 2 - Uses postMessage on our iframe content (iframe.html) in order to
 *     give it the src we would like to load.
 * 3 - Then, once iframe.html received this message, it generates its own
       iframe with the received source, which CSP rules cannot stop.
 *
 * Generated iframe also listen to message event in order to communicate
 * with the inner iframe.
 * @params iframeSrc: The url we want to load into our iframe.
 * @params composeView: composeView from which you generate the iframe.
 * @returns: iframe Element which displays the given src.
 */
const generateIframe = (iframeSrc, composeView) => {
  const iframe = document.createElement("iframe");
  iframe.setAttribute(
    "style",
    "height: 660px; width: 440px; border: 0; margin: 0;"
  );
  iframe.addEventListener(
    "load",
    () => {
      /* Just asking the nested iframe to set iframeSrc as its source. */
      iframe.contentWindow.postMessage(
        {
          eventName: "init",
          iframeSrc
        },
        "*"
      );
    },
    false
  );
  iframe.src = chrome.runtime.getURL("iframe.html");

  window.addEventListener("message", event => {
    if (event.source !== iframe.contentWindow) {
      return;
    }

    console.log("got message from iframe", event.data);
    const data = event.data.innerFrameData;
    if (data.eventName === "InsertTemplate") {
      composeView.insertTextIntoBodyAtCursor(data.content);
      modal.close();
    }
  });

  return iframe;
};
