# Angular Starter Project

This project is a starter project for using remult & angular that already has a menu, basic user management and other utilities.

To use in a new project:
```sh
md kip-app
cd kip-app
git init
git pull https://github.com/noam-honig/kip-app.git
npm i
```

To run:
```sh
npm run dev
```

# Tutorial:
See [Creating a Fullstack Angular Remult app for non web developer](https://github.com/noam-honig/kip-app/wiki/Creating-a-Fullstack-Angular-Remult-app-for-non-web-developer)


# Create an Heroku site and deploy to it
```sh
heroku apps:create 
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set TOKEN_SIGN_KEY=some-very-secret-key
git push heroku master 
heroku apps:open
```