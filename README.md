# CH5 Vite+Vanilla JS project demo

This project is a minimal demonstration of turning a basic Vite project with with plain JavaScript into a CH5 project.

## Usage
Run `npm i` to install all dependencies.

Run the `dev` script to interact with the control system via the project during development.

Run the `build:dev` script to build the project in development mode (for access to Eruda on panel/app).

Run the `build:prod` script to build the project in production mode (without Eruda).

Run the `archive` script to package the contents of the /dist/ directory into a .ch5z that can be loaded onto a control system or panel.

Run the `deploy:mobile` script to upload the .ch5z to the control system as a mobile project. Adjust the IP address to match your control system.

Run the `deploy:xpanel` script to upload the .ch5z to the control system as a WebXPanel. Adjust the IP address to match your control system.

Run the `deploy:panel` script to upload the .ch5z to a touch panel as local project. Adjust the IP address to match your panel.

## Requirements
 - You must have Node.js 20.04.0 or higher and NPM 9.7.2 or higher. For more information see [System Requirements](https://sdkcon78221.crestron.com/sdk/Crestron_HTML5UI/Content/Topics/QS-System-Requirements.htm)
 - The control system must have SSL and authentication enabled. For more information see [Control System Configuration](https://sdkcon78221.crestron.com/sdk/Crestron_HTML5UI/Content/Topics/Platforms/X-CS-Settings.htm)
 - At the time of writing CH5 projects are only supported on 3 and 4-series processors (including VC-4), TST-1080, X60, and X70 panels, and the Crestron One app. For more information see [System Requirements](https://sdkcon78221.crestron.com/sdk/Crestron_HTML5UI/Content/Topics/QS-System-Requirements.htm)

## Authentication
Historically authenticating a CH5 session is handled by a redirect initiated by the WebXPanel library to the processor/server authentication service. However since CH5 2.8.0 an authentication token can be created on the processor/server instead of requiring manual user input for authentication. For processors this is handled via the ```websockettoken generate``` command. On VirtualControl servers the token is generated in the [web interface](https://docs.crestron.com/en-us/8912/content/topics/configuration/Web-Configuration.htm?#Tokens)

## The entry point
The entry point is where the Crestron libraries (UMD) will be loaded into the application. In this demo index.html is treated as the entry point for the Crestron libraries.

### Initialize the WebXPanel library if running in a browser:
```js
const { WebXPanel, WebXPanelConfigParams, isActive } = window.WebXPanel.getWebXPanel(!window.WebXPanel.runsInContainerApp());

WebXPanelConfigParams.ipId = '0x03';
WebXPanelConfigParams.host = '0.0.0.0';
WebXPanelConfigParams.authToken = '';

if (isActive) {
    WebXPanel.initialize(WebXPanelConfigParams);
}
```

### Receive data via joins from the control system:
```js
const d1Id = window.CrComLib.subscribeState('b', '1', (value) => {
    // Handle changes to digital output 1
});
const aiId = window.CrComLib.subscribeState('n', '1', (value) => {
    // Handle changes to analog output 1
});
const s1Id = window.CrComLib.subscribeState('s', '1', (value) => {
    // Handle changes to serial output 1
});

// Unsubscribe a later time when the join data is no longer needed
window.CrComLib.unsubscribeState('b', '1', d1Id);
window.CrComLib.unsubscribeState('n', '1', aiId);
window.CrComLib.unsubscribeState('s', '1', s1Id);
```

### Send data via joins to the control system:
```js
window.CrComLib.publishEvent('b', '1', bool value); // Sends a boolean value to digital input 1
window.CrComLib.publishEvent('n', '1', number value); // Sends a numeric value (0-65535) to analog input 1
window.CrComLib.publishEvent('s', '1', string value); // Sends a string value to serial input 1
```