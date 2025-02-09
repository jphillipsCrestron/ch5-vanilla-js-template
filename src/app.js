// We can access window.CrComLib because the `vite-plugin-static-copy` package configured 
// in the `vite.config.js` file copied over the Crestron lib files to the build output directory.
// Specifically it copied over the UMD files, which bind to the window automatically, hence why
// we can access window.CrComLib here just fine without importing or manually binding.

// Initialize eruda for panel/app debugging capabilities (in dev mode only)
if (import.meta.env.VITE_APP_ENV === 'development') {
    import('eruda').then(({ default: eruda }) => {
        eruda.init();
    });
}

//#region JOINS

// Handle digital
const sendDigitalButton = document.getElementById('sendDigitalButton');
const currentDigitalValue = document.getElementById('currentDigitalValue');

sendDigitalButton.addEventListener('click', () => {
    if (currentDigitalValue.textContent.toLowerCase() === 'true') {
        window.CrComLib.publishEvent('b', '1', false); // Set digital input 1 to false
    } else {
        window.CrComLib.publishEvent('b', '1', true); // Set digital input 1 to true
    }
});

window.CrComLib.subscribeState('b', '1', (value) => { // Listen for changes to digital output 1
    currentDigitalValue.textContent = value.toString();
});

// Handle analog
const currentAnalogValue = document.getElementById('currentAnalogValue');
const analogSlider = document.getElementById('analogSlider');

analogSlider.addEventListener('input', (event) => {
    window.CrComLib.publishEvent('n', '1', parseInt(event.target.value)); // Set analog input 1 to the slider value
});

window.CrComLib.subscribeState('n', '1', (value) => {
    currentAnalogValue.textContent = value; // Listen for changes to analog output 1
});

// Handle serial
const currentSerialValue = document.getElementById('currentSerialValue');

window.CrComLib.subscribeState('s', '1', (value) => {
    currentSerialValue.value = value; // Listen for changes to serial output 1
});

currentSerialValue.addEventListener('input', (event) => {
    window.CrComLib.publishEvent('s', '1', event.target.value); // Set serial input 1 to the slider value
});

//#endregion

//#region CONTRACTS
// Handle digital
const sendDigitalContractButton = document.getElementById('sendDigitalContractButton');
const currentDigitalContractValue = document.getElementById('currentDigitalContractValue');

sendDigitalContractButton.addEventListener('click', () => {
    if (currentDigitalContractValue.textContent.toLowerCase() === 'true') {
        window.CrComLib.publishEvent('b', 'HomePage.DigitalEvent', false); // Set HomePage.DigitalEvent to false
    } else {
        window.CrComLib.publishEvent('b', 'HomePage.DigitalEvent', true); // Set HomePage.DigitalEvent to true
    }
});

window.CrComLib.subscribeState('b', 'HomePage.DigitalState', (value) => { // Listen for HomePage.DigitalState
    currentDigitalContractValue.textContent = value.toString();
});

// Handle analog
const currentAnalogContractValue = document.getElementById('currentAnalogContractValue');
const analogContractSlider = document.getElementById('analogContractSlider');

analogContractSlider.addEventListener('input', (event) => {
    window.CrComLib.publishEvent('n', 'HomePage.AnalogEvent', parseInt(event.target.value)); // Set HomePage.AnalogEvent to the slider value
});

window.CrComLib.subscribeState('n', 'HomePage.AnalogState', (value) => {
    currentAnalogContractValue.textContent = value; // Listen for changes to HomePage.AnalogState
});

// Handle serial
const currentSerialContractValue = document.getElementById('currentSerialContractValue');

window.CrComLib.subscribeState('s', 'HomePage.StringState', (value) => {
    currentSerialContractValue.value = value; // Listen for changes to HomePage.StringState
});

currentSerialContractValue.addEventListener('input', (event) => {
    window.CrComLib.publishEvent('s', 'HomePage.StringEvent', event.target.value); // Set HomePage.StringEvent to the slider value
});
//#endregion