import { Selector } from 'testcafe';

export class DeviceCreatePage {
    constructor() {
        this.deviceNameInput = Selector('#system_name');
        this.deviceTypeDropdown = Selector('#type');
        this.deviceCapacityInput = Selector('#hdd_capacity');
        this.submitButton = Selector('.submitButton');
    }

    async fillForm(t, systemName, type, hddCapacity) {
        const deviceSelect = Selector('#type');
        const deviceOption = deviceSelect.find('option');
        await t
            .typeText(this.deviceNameInput, systemName)
            .click(deviceSelect)
            .click(deviceOption.withText(type))
            .typeText(this.deviceCapacityInput, hddCapacity)
    }

    async submitForm(t) {
        await t
            .click(this.submitButton)
    }
}

export default DeviceCreatePage; 