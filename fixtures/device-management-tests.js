import { HomePage } from '../support/page-objects/homePage';
import { DeviceCreatePage } from '../support/page-objects/deviceCreatePage';
import { HttpRequest } from '../support/api/requests';
import { waitForElementsToLoad, extractTextFromElements, verifyUIElements, reloadPage } from '../support/utils/helpers';
import data from '../support/data/newDevicesData.json'; // Import your JSON data file

const homePage = new HomePage();
const deviceCreatePage = new DeviceCreatePage();
const httpRequest = new HttpRequest();

fixture('Device Management Tests')
    .page('http://localhost:3001/') // Make sure your app is running on this port
    .afterEach(async () => {
        await httpRequest.resetDevicesFromJson();
    });

test('TEST_001.0001 - Verify each device is displayed correctly', async t => {
    // Step 1: Get the list of devices through an API call
    const response = await httpRequest.getDevicesRequest();
    await t.expect(response).ok('No devices found');
    // Get UI elements
    const deviceNameElements = homePage.deviceNameLabel;
    const deviceTypeElements = homePage.deviceTypeLabel;
    const deviceCapacityElements = homePage.deviceCapacityLabel;
    // Wait for elements to load and validate count
    const deviceCount = await waitForElementsToLoad(t, deviceNameElements);
    await t.expect(deviceCount).eql(response.length, 'The number of devices in the UI does not match the API response');
    // Extract text from UI elements and givit format
    const uiDeviceNames = await extractTextFromElements(deviceNameElements);
    const uiDeviceTypes = await extractTextFromElements(deviceTypeElements);
    const uiDeviceCapacities = await extractTextFromElements(deviceCapacityElements, true, true);
    // Verify each API device in the UI
    for (const device of response) {
        const apiDeviceName = device.system_name.trim().toLowerCase();
        const apiDeviceType = device.type.trim().toLowerCase();
        const apiDeviceCapacity = device.hdd_capacity.trim();
        await t
            .expect(uiDeviceNames.includes(apiDeviceName)).ok(`Device name ${device.system_name} is not in UI`)
            .expect(uiDeviceTypes.includes(apiDeviceType)).ok(`Device type ${device.type} is not in UI`)
            .expect(uiDeviceCapacities.includes(apiDeviceCapacity)).ok(`Device capacity ${device.hdd_capacity} is not in UI`);
    }
});

test('TEST_001.0002 - Verify each device has Edit and Delete buttons', async t => {
    // Step 1: Get the list of devices through an API call
    const response = await httpRequest.getDevicesRequest();
    await t.expect(response).ok('No devices found');
    // Get UI elements
    const deviceNameElements = homePage.deviceNameLabel;
    const deviceEditButtons = homePage.deviceEditButton;
    const deviceRemoveButtons = homePage.deviceRemoveButton;
    // Wait for elements to load and validate count
    const deviceCount = await waitForElementsToLoad(t, deviceNameElements);
    await t.expect(deviceCount).eql(response.length, 'The number of devices in the UI does not match the API response');
    // Verify presence of Edit and Remove buttons
    await verifyUIElements(t, deviceEditButtons, 'Edit button');
    await verifyUIElements(t, deviceRemoveButtons, 'Remove button');
});

// BUG_002: https://docs.google.com/document/d/1UpHymVV144m3DWI4AMnCDuitUe5qYjp4RcbGYqMvBcQ/edit?tab=t.0
data.forEach((device) => {
    test(`[BUG:002] TEST_002 - Verify device creation for ${device.system_name} and correct display in the UI.`, async t => {
        // Step 1: Click the "Add Device" button
        await homePage.clickAddDeviceButton(t);
        // Step 2: Fill in the device creation form and submit
        await deviceCreatePage.fillForm(t, device.system_name, device.type, device.hdd_capacity);
        await deviceCreatePage.submitForm(t);
        // Step 3: Verify the new device is visible with the correct details
        const deviceName = homePage.deviceNameLabel.withExactText(device.system_name);
        const deviceType = homePage.deviceTypeLabel.withExactText(device.type);
        const deviceCapacity = homePage.deviceCapacityLabel.withText(device.hdd_capacity);
        // Assertions to ensure the device is visible with correct details
        await t
            .expect(deviceName.exists).ok(`Device name "${device.system_name}" is not visible`)
            .expect(deviceType.exists).ok(`Device type "${device.type}" is not visible`)
            .expect(deviceCapacity.exists).ok(`Device capacity "${device.hdd_capacity}" is not visible`);
    });
});

test('TEST_003 - Rename the first device and verify the change', async t => {
    // Step 1: Get the list of devices through an API call
    const response = await httpRequest.getDevicesRequest();
    await t.expect(response.length).gt(0, 'No devices found'); // Ensure that the response has data
    // Step 2: Get the ID of the first device
    const firstDeviceId = response[0].id;
    const renamedDeviceName = 'Renamed Device';
    // Step 3: Update the device name using PUT API call
    await httpRequest.putDeviceRequest(firstDeviceId, renamedDeviceName, response[0].type, response[0].hdd_capacity);
    // Step 4: Reload the page to reflect the changes
    await reloadPage(t);
    // Step 5: Verify that the device name in the UI has been updated to "Renamed Device"
    const renamedDeviceSelector = homePage.deviceNameLabel.withText(renamedDeviceName);
    await t.expect(renamedDeviceSelector.exists).ok('Renamed device is not visible in the UI'); // Assertion to check if the new device name is visible in the UI
});

test('TEST_004 - Delete the last device and verify it is removed from the UI', async t => {
    // Step 1: Get the list of devices through an API call
    const response = await httpRequest.getDevicesRequest();
    await t.expect(response.length).gt(0, 'No devices found'); // Ensure that the response has data
    // Step 2: Get the ID of the last device
    const lastDeviceId = response[response.length - 1].id;
    const lastDeviceName = response[response.length - 1].system_name;
    // Step 3: Delete the last device using DELETE API call
    await httpRequest.deleteRequest(lastDeviceId)
    // Step 4: Reload the page to reflect the changes
    await reloadPage(t);
    // Step 5: Verify that the device name is no longer visible in the UI
    const deletedDeviceSelector = homePage.deviceNameLabel.withText(lastDeviceName);
    await t.expect(deletedDeviceSelector.exists).notOk('Deleted device is still visible in the UI');    // Assertion to check if the device is not visible in the UI
});

