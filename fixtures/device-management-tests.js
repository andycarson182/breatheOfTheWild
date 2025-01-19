import { HomePage } from '../support/page-objects/homePage';
import { DeviceCreatePage } from '../support/page-objects/deviceCreatePage';
import { HttpRequest } from '../support/api/requests';
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
    await t.expect(response).ok('No devices found'); // Ensure that the response has data

    // Create arrays for storing the text of each element
    let uiDeviceNames = [];
    let uiDeviceTypes = [];
    let uiDeviceCapacities = [];

    // Get all device name elements
    const deviceNameElements = homePage.deviceNameLabel;
    const deviceTypeElements = homePage.deviceTypeLabel;
    const deviceCapacityElements = homePage.deviceCapacityLabel;

    // Get the number of device elements
    const deviceCount = await deviceNameElements.count;

    // Loop through each element and retrieve its text
    for (let i = 0; i < deviceCount; i++) {
        const deviceNameText = await deviceNameElements.nth(i).innerText;
        const deviceTypeText = await deviceTypeElements.nth(i).innerText;
        const deviceCapacityText = await deviceCapacityElements.nth(i).innerText;

        // Normalize text by trimming and converting to lowercase
        uiDeviceNames.push(deviceNameText.trim().toLowerCase());
        uiDeviceTypes.push(deviceTypeText.trim().toLowerCase());
        uiDeviceCapacities.push(deviceCapacityText.replace(/\D/g, '').trim().toLowerCase());  // Removes any non-digit characters
    }

    // Now you have all the device data from the UI in arrays (uiDeviceNames, uiDeviceTypes, uiDeviceCapacities) 
    // Loop through each device in the API response and check if they exist in the UI
    for (const device of response) {
        // Normalize API response text
        const apiDeviceName = device.system_name.trim().toLowerCase();
        const apiDeviceType = device.type.trim().toLowerCase();
        const apiDeviceCapacity = device.hdd_capacity.trim().toLowerCase();

        await t
            // Ensure that the device name exists in the UI device names
            .expect(uiDeviceNames.includes(apiDeviceName)).ok(`Device name for ${device.system_name} is not found in UI`)
            // Ensure that the device type exists in the UI device types
            .expect(uiDeviceTypes.includes(apiDeviceType)).ok(`Device type for ${device.type} is not found in UI`)
            // Ensure that the device capacity exists in the UI device capacities
            .expect(uiDeviceCapacities.includes(apiDeviceCapacity)).ok(`Device capacity for ${device.had_capacity} is not found in UI`);
    }
});

test('TEST_001.0002 - Verify each device has Edit and Delete buttons', async t => {
    // Step 1: Get the list of devices through an API call
    const response = await httpRequest.getDevicesRequest();
    await t.expect(response).ok('No devices found'); // Ensure that the response has data

    // Get all device name elements
    const deviceNameElements = homePage.deviceNameLabel;
    const deviceEditButtons = homePage.deviceEditButton;
    const deviceRemoveButtons = homePage.deviceRemoveButton;

    // Get the number of device elements
    const deviceCount = await deviceNameElements.count;
    await t.expect(deviceCount).eql(response.length, 'The number of devices in the UI does not match the API response');

    // Loop through each element and check for the presence of the edit and delete buttons
    for (let i = 0; i < deviceCount; i++) {
        // Check for the Edit button for each device
        const editButtonExists = await deviceEditButtons.nth(i).exists;
        await t.expect(editButtonExists).ok(`Edit button for device ${i + 1} is not found in UI`);
        // Check for the Remove button for each device
        const removeButtonExists = await deviceRemoveButtons.nth(i).exists;
        await t.expect(removeButtonExists).ok(`Remove button for device ${i + 1} is not found in UI`);
    }
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
    await homePage.reloadPage(t);
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
    await homePage.reloadPage(t);
    // Step 5: Verify that the device name is no longer visible in the UI
    const deletedDeviceSelector = homePage.deviceNameLabel.withText(lastDeviceName);
    await t.expect(deletedDeviceSelector.exists).notOk('Deleted device is still visible in the UI');    // Assertion to check if the device is not visible in the UI
});

