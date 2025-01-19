# Breathe Of The Wild Suite
### Ninja Front-End & API Test Suite

This repository contains the front-end and API automation test suite for Ninja RMM, implemented using **TestCafe** and **Axios**.

## Setup & Installation

### Prerequisites

- [NPM and Node.js](https://nodejs.org/en/download/) must be installed on your machine.
- The Ninja App must be running locally.

## Running the Project

1. Clone this repository to your local machine.
2. Navigate to the root directory of the project in your terminal.
3. Run `npm install` (or `npm i`) to install the project dependencies.
4. Execute the test cases by running `npm run tests:chrome`.

## Running TestCafe Scripts

### 1. Running the Ninja App Locally

To run the Ninja App on your local machine, you need to set up and execute the following projects:

- **UI**: [devices-clientapp](https://github.com/Yastrenky/devices-clientapp)  
- **Server**: [devicesTask_serverApp](https://github.com/NinjaRMM/devicesTask_serverApp)

### 2. Running Tests

To run the tests locally, execute the following command:  
```bash
npm run tests:chrome
  ```
#### 3. Generating TestCafe Test Summary:
- The TestCafe Test Summary based on test results, its automatically generated when user runs npm run `tests:chrome` the results are generated in the following directory path:
`reports/html reports`

![image](https://github.com/user-attachments/assets/3d9414c1-f7a3-4caf-98d7-1a7ee6c49012)
