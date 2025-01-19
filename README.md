# Breathe Of the Wild Suite
### Ninja Front-End & API Test Suite

This repository contains the front-end and API automation test suite for Ninja RMM, implemented using TestCafe & Axios.

## Setup & Installation

### Prerequisites

- [NPM and NodeJS](https://nodejs.org/en/download/) On your machine to install and run this project.

## Running the project

1. Clone this repository to your local machine.
2. Navigate to the root directory of the project in your terminal.
3. Run npm install or npm i to install the project dependencies.
5. Execute the test cases by running npm run tests:chrome.


# Running TestCafe Scripts

#### 1. Running Tests:
- To local run tests , execute the following command:
  ```bash
  npm run tests:chrome
  ```
#### 2. Generating TestCafe Test Summary:
- The TestCafe Test Summary based on test results, its automatically generated when user runs `npm run tests:chrome` the results are generated in the following directory path:
`reports/html reports`

#### 3. For Running the Ninja App you will need to execute the followign projects on your local machine:

- UI: https://github.com/Yastrenky/devices-clientapp 
- Server: https://github.com/NinjaRMM/devicesTask_serverApp

![image](https://github.com/user-attachments/assets/3d9414c1-f7a3-4caf-98d7-1a7ee6c49012)
