# ModaMedic Backend

## Overview
The **ModaMedic Backend** serves as the core API and data processing unit for the ModaMedic system. Built with **Node.js** and **MongoDB**, it provides secure data handling, authentication, and communication between the mobile app, and the web interface.
## Features
- **User Authentication**: Secure login and session management.
- **Patient Data Management**: Stores and processes patient data.
- **Medical Questionnaire Handling**: Receives and processes user-submitted forms.
- **Middleman service**: Provides services and handles requests from both the mobile app and the website.

## Tech Stack
- **Server**: Node.js (Express.js)
- **Database**: MongoDB
- **Health Data**: Mi Band, Google Fit API
- **Deployment**: Hosted on a university server during the project runtime.

## Installation
### Prerequisites
- Node.js & npm installed
- MongoDB instance running (local or cloud)

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/arie478/ModaMedic-Backend
   cd ModaMedic-Backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up the data base connection - your mongoDB instance, for example locally hosted:
   ```sh
   54 var mongoDB = "mongodb://localhost:27017/modamedicDB";
   ```
5. Start the server:
   ```sh
   npm start
   ```
   
## Deployment
The backend was hosted on a university server during the project run time. Future deployment will require locally hosted server or cloud service.

---
For related components of ModaMedic, see:
- **[Mobile App](https://github.com/arie478/ModaMedic-App)**
- **[Web Interface](https://github.com/arie478/ModaMedic-Web)**
<!--
- **[Machine Learning Module](https://github.com/arie478/ModaMedic-ML)**
-->


