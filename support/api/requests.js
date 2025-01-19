import axios from 'axios';
import data from '../data/originalDevices.json'; 

export class HttpRequest {
    // General method to handle GET, POST, PUT, DELETE requests
    async request(method, url, data = null) {
        try {
            const response = await axios({ method, url, data });
            return response.data;  // Return the data from the response
        } catch (error) {
            console.error(`HTTP Request failed: ${error}`);
            throw error;  // Rethrow error for handling by the caller if needed
        }
    }

    // Get a list of devices
    async getDevicesRequest() {
        return await this.request('get', 'http://localhost:3000/devices');
    }

    // Get a specific device by its ID
    async getDeviceRequest(deviceId) {
        return await this.request('get', `http://localhost:3000/devices/${deviceId}`);
    }

    // Create a new device or update an existing one using POST
    async postDeviceRequest(systemName, type, hddCapacity) {
        return await this.request('post', 'http://localhost:3000/devices', {
            system_name: systemName,
            type: type,
            hdd_capacity: hddCapacity
        });
    }

    // Update an existing device using PUT
    async putDeviceRequest(deviceId, systemName, type, hddCapacity) {
        return await this.request('put', `http://localhost:3000/devices/${deviceId}`, {
            system_name: systemName,
            type: type,
            hdd_capacity: hddCapacity
        });
    }

    // Delete a device by ID
    async deleteRequest(deviceId) {
        return await this.request('delete', `http://localhost:3000/devices/${deviceId}`);
    }

    // Reset original devices from the imported JSON data
    async resetDevicesFromJson() {
        try {
            // Delete all existing devices
            const existingDevices = await this.getDevicesRequest();
            for (let device of existingDevices) {
                await this.deleteRequest(device.id);
                // console.log(`Device ${device.system_name} deleted.`);
            }
            // Restore the original devices from the JSON data
            const devices = data;  // 'data' is already an array of device objects
            for (let device of devices) {
                await this.postDeviceRequest(device.system_name, device.type, device.hdd_capacity);
                // console.log(`Device ${device.system_name} created.`);
            }
        } catch (error) {
            console.error('Error resetting devices from JSON:', error);
            throw error;
        }
    }
}

export default HttpRequest;
