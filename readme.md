# README
This document provides an overview of a Proof of Concept (PoC) for a simple web application designed for task estimation in Scrum projects. The development prioritized functionality to ensure a working version was available as quickly as possible.

## General Information
The application consists of an API developed in Python using Flask and a web frontend built with React. Both components are configured to run in Docker containers, facilitating easy deployment and scalability.

## Running the Application
### API
To run the API locally, execute the following commands:
```
cd api
python main.py
```
This will start the API server, making it accessible for interaction.

### Web Application
To run the web application, use the command below:
```
cd front
npm run start
```
This command initiates the web server, allowing you to access the web application through your browser.

### Docker
For convenience, the entire setup can be run simultaneously using Docker. To do so, execute:

```
docker-compose up
```
After running this command, the application will be accessible at the URL: http://localhost:7010

This streamlined approach ensures that both the API and web frontend are deployed in a coordinated manner, simplifying the development and testing processes.