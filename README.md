# TaskNote

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
![Build Status](https://github.com/ricardo-campos-org/react-typescript-todolist/actions/workflows/main.yml/badge.svg)

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 📝 About the Project

TaskNote was created to make our lives easier. In a nutshell, you can manage your TODOs and your
Notes. 

A key feature is that you can `#tag` a todo or note and search or filter later.

TODO: add GIF or screenshot of the app

## ✨ Features

- Create and manage TODO items
- Create and manage Notes
- Tag TODOs and Notes

## 🚀 Tech Stack

- **Frontend:** React, Typescript, Vite, Vitest, Code Coverage
- **Backend:** Java 17, Spring Web, GraalVM Cloud Native Image
- **Database:** PostgreSQL, Flyway
- **Other Technologies:** Docker, Docker Compose, Caddy

## 🛠 Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ricardo-campos-org/react-typescript-todolist
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the development server
   ```sh
   npm start
   ```

## 🏃‍♀️ Running locally

### Locally without Docker

  **Client:**

  ```sh
  cd client
  npm install
  npm start 
  ```

  **Server - Java API:**
  ```sh
  cd server
  ./mvnw spring-boot:run \
    -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
  ```  

  PS: You have the option to define four environment variables for the database connection. In case
    you decide not to do, they'll be set to default. They are:

  ```
  POSTGRES_HOST=localhost
  POSTGRES_DB=tasknote
  POSTGRES_USER=tasknoteuser
  POSTGRES_PASSWORD=default
  ```

  PS2: Java API needs a running database to work. You can leverage Docker Compose for this, running
    this command:

  ```sh
  docker-compose up --profile dev postgres -d
  ```

  **Checking if it's running:**
  
  - You can head to the Actuator Health page at: http://localhost:8585/actuator/health
  - And you want, you can open up the Swagger UI at: http://localhost:8585/swagger-ui/index.html

### Locally with Docker Compose
  **All at once:**
  ```sh
  docker compose --profile dev up -d
  ```

  **Cleaning up:**
  ```sh
  docker compose --profile dev down --remove-orphans
  ```

## 🦾 Automation

### Client

Unit tests: Client relies on these libraries:  
 - React-Testing-Library
 - Vitest

Here's how you can run locally:

```sh
cd client
npm run test
```

**Integration tests**

Not available.

**Code style enforcement**

Here, ESlint, Airbnb

### Java API

**Unit tests**

Here

**Integration tests**

Here

**Code style enforcement**

Google Checkstyle

## 🎮 Usage

Once you're in the home screen, you can click the button to create your first TODO item.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### Steps to Contribute:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/amazing-feature`)
3. Commit your Changes (`git commit -m 'Add some amazing feature'`)
4. Push to the Branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📄 License

Distributed under GPLv3 License. See `LICENSE` for more information.

## 📞 Contact

Ricardo Campos on X - [@RicardoMpcInc](https://twitter.com/RicardoMpcInc)
