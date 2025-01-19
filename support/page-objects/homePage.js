import { Selector } from "testcafe";

export class HomePage {
    constructor() {
        this.deviceNameLabel = Selector('.device-name');
        this.deviceTypeLabel = Selector('.device-type');
        this.deviceCapacityLabel = Selector('.device-capacity');
        this.deviceEditButton = Selector('.device-edit');
        this.deviceRemoveButton = Selector('.device-remove');
        this.addDeviceButton = Selector('a.submitButton');
    }

    async reloadPage(t){
        await t.eval(() => location.reload()); 
    }

    async clickAddDeviceButton(t) {
        await t.expect(this.addDeviceButton.visible).ok('Add Device button is not visible');
        await t.click(this.addDeviceButton);
    }
}

export default HomePage;