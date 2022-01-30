
# CAST Backend: User Roles and Permissions

This project provides authentication with Microsoft's Azure Active Directory service. 
This allows the university to add members of their organization to add users to the CAST backend, directly managing their roles and permission in Azure.



## Project Scope

The project scope was to create an authentication service with the Java framework "spring" by using the Microsoft Azure Active Directory 
services to let the user log in with his XU Microsoft account. 

At the beginning of our project, we started with Spring, created an authorization service, and logged in with Microsoft accounts, which is working.
However, Spring exceeded our knowledge with API endpoint protection; therefore, we chose to go with the more familiar framework  NodeJS.

With Node, we developed a login service with Microsofts Azure AD and the XU accounts, connecting the unique oid to an API-Key. The user could then access the endpoints without logging in to the service every time.
## MS OAuth2 Authentication with the Spring Framework
### Repository: [XU-SE22-WS21-22/MS-OAuth2-Test](https://github.com/XU-SE22-WS21-22/MS-OAuth2-Test)
### Project Setup
The XU hosts their organization over the Microsoft service called "Azure Active Directory,"
 in short Azure AD helps manage user roles, permissions, and creation. Unfortunately, we did not get access
 to the XU Azure AD, so we created our own instance for testing purposes. With a new Azure AD on our hands, we could connect our backend with the instance and test the authentication. This authentication is working with all XU-issued 
 accounts, making the code available for future projects.

 ### API Endpoints 
 The API endpoints raised a problem since their access should only be possible for registered users. However, while trying multiple ways, the spring Framework was too complex and new for us, and we did not find a way to access the API endpoints without logging in.


## Improved NodeJS Backend
### Repository: [XU-SE22-WS21-22/user-roles-and-permissions](https://github.com/XU-SE22-WS21-22/user-roles-and-permissions)
### Important: The .env file contains the login credentials for the MS Azure AD. Please add the file to the project by hand.
The .env is in the assignment tab in MS Teams.
### Switching the Tech-Stack
In a group decision, we concluded that we could develop a better and more secure backend with a Framework all of us were 
already familiar with. So while we liked to challenge ourselves with Spring, we had the urge to create a project that provides the 
correct results we set out to achieve initially. Therefore, we started a new project with the Framework NodeJS. Luckily for us,
our Azure AD instance was still up to the task, and we continued using it for the project.

### Authentication with Microsoft OAuth2
With the new NodeJS backend, members of the XU University can use their Microsoft accounts to login into our website if they were
added by the system administrators beforehand. This was a decision made at the beginning of the project, where all teams decided that
only safe-listed members of the university could log into CAST.

### API-Keys and Endpoint Protection
The main problem we wanted to solve was API security and accessibility. We solved that problem by generating a new API key for
users that logged into our website. Once a user appears in our Azure AD, an API key is generated on the website, which can be used 
to access the API endpoints we created.

### Run Locally

Clone the project

```bash
  git clone https://github.com/XU-SE22-WS21-22/user-roles-and-permissions.git
```

Go to the project directory

```bash
  cd user-roles-and-permissions
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```
Our Localhost: localhost:8080

To start testing the API endpoints and the login feature, visit the localhost:8080/login page and sign in with your Microsoft Account.

Endpoints require a quick set-up: We need our postman project open and a valid API-Key. You'll get a valid API key after going 
to localhost:8080/getKey. If you are not logged in, you'll be redirected to the login window.

The postman link is: [Public Postman Workspace](https://www.postman.com/universal-station-246440/workspace/backenddocumentation/overview)

Inside postman, some endpoints may have some additional documentation that helps you understand the process.



### Secruity Summary
With our backend, selected university members can log into CAST and use the system. 
They can also generate an API-Key to remotely access data and information from the backend. 
All API endpoints are protected and can only be used by those authorized. 
The front-end developers can use the existing endpoints to get basic information about the user. 
In the future, with CAST becoming more advanced, more endpoints will help provide the dashboards with data from the user.

## Conclusion
### User Roles and Permission System by Team Checkmate
### Pain Point 
With our backend and the API-Key protection, we achieved our goal to create an environment where only trusted and specifically added
university members can access sensitive data from the backend. In addition, with the creation of API-Keys, the backend security 
is scaleable if the university decides to expand in the future.
### Description 
System Administrators and members with extended permissions can organize and manage roles in the Azure AD of the university, 
making it easy for them to change permissions without touching the backend authentication process. In addition, new endpoints can be introduced, 
providing further information to the front-end developers designing and using the front-end dashboard.
## Authors

- [@Maximilian Bala](https://github.com/Himyu)
- [@Viktoria Hafner](https://github.com/Viktoria-dot)
- [@Til Schwarze](https://github.com/justTil)
- [@Dominik Schatilow](https://github.com/Schati)
- [@Fabian Mergner](https://github.com/ElmuUuU)
