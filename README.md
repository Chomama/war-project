# War Card Game
This a project that plays the card game War in the browser. 

## Tech 
The game is written in React, node, and connects to a MySql database running on AWS.

## Usage
**Installation**

```bash
git clone https://github.com/Chomama/war-project.git
cd war-project
cd server
npm install
npm run build
```
For the scoreboard to work, you must navigate to /server/config/db.config.js and fill in the password.

**Start the application running on  localhost:8081**

```
cd server
npm start
```

**Run tests**
```
cd server
npm test
```

**Build for production**
```
cd server
npm run build
```
