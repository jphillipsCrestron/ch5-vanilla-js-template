// We can access window.WebXPanel because the `vite-plugin-static-copy` package configured 
// in the `vite.config.js` file copied over the Crestron lib files to the build output directory.
// Specifically it copied over the UMD files, which bind to the window automatically, hence why
// we can access window.WebXPanel here just fine without importing or manually binding.
const { WebXPanel, isActive, WebXPanelEvents, WebXPanelConfigParams } = window.WebXPanel.getWebXPanel(!window.WebXPanel.runsInContainerApp());

WebXPanelConfigParams.ipId = '0x03';
WebXPanelConfigParams.host = '0.0.0.0';
WebXPanelConfigParams.authToken = '';

if (isActive) {
  console.log("Initializing XPanel with config: " + JSON.stringify(WebXPanelConfigParams));
  WebXPanel.initialize(WebXPanelConfigParams);

  const connectWsListener = () => {
    console.log("WebXPanel websocket connection success");
  };

  const errorWsListener = ({ detail }) => {
    console.log(`WebXPanel websocket connection error: ${JSON.stringify(detail)}`);
  };

  const connectCipListener = () => {
    console.log("WebXPanel CIP connection success");
  };

  const authenticationFailedListener = ({ detail }) => {
    console.log(`WebXPanel authentication failed: ${JSON.stringify(detail)}`);
  };

  const notAuthorizedListener = ({ detail }) => {
    console.log(`WebXPanel not authorized: ${JSON.stringify(detail)}`);
    window.location = detail.redirectTo;
  };

  const disconnectWsListener = ({ detail }) => {
    console.log(`WebXPanel websocket connection lost: ${JSON.stringify(detail)}`);
  };

  const disconnectCipListener = ({ detail }) => {
    console.log(`WebXPanel CIP connection lost: ${JSON.stringify(detail)}`);
  };

  // Adding event listeners
  window.addEventListener(WebXPanelEvents.CONNECT_WS, connectWsListener);
  window.addEventListener(WebXPanelEvents.ERROR_WS, errorWsListener);
  window.addEventListener(WebXPanelEvents.CONNECT_CIP, connectCipListener);
  window.addEventListener(WebXPanelEvents.AUTHENTICATION_FAILED, authenticationFailedListener);
  window.addEventListener(WebXPanelEvents.NOT_AUTHORIZED, notAuthorizedListener);
  window.addEventListener(WebXPanelEvents.DISCONNECT_WS, disconnectWsListener);
  window.addEventListener(WebXPanelEvents.DISCONNECT_CIP, disconnectCipListener);
}