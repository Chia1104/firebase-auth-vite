# Run-Pix (AI driven race management)

run-pix.web.app

This project was created with [Vite](https://vitejs.dev/).

* [Features and roadmap](TODO.md)
* [DESIGN](README_DESIGN.md)
* [WIKI](https://github.com/avinashmane/runpix/wiki)
* [Feature requests](https://github.com/avinashmane/runpix/discussions)

# Development details
## Languages and Tools

<div align="center">
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> 
  </a>
  <a href="https://vuejs.org/" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original-wordmark.svg" alt="vuejs" width="40" height="40"/> 
  </a>
  <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"> 
    <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="tailwind" width="40" height="40"/> 
  </a>
  <a href="https://firebase.google.com/" target="_blank" rel="noreferrer"> 
    <img src="https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" alt="firebase" width="40" height="40"/> 
  </a>
</div>

## Development 
* runpix\> npm run dev
* \m\git
* git push
## Deployment


* runpix\> npm run build
* firebase deploy
* cd functions
* C:\m\runpix>set CLOUDSDK_PYTHON=c:\sw\py310nb_env\python.exe
* C:\m\runpix>gcloud functions deploy ScanImages --memory 1024mb
### Vercel
You can go here, [deployment](https://firebase-auth-vite.vercel.app/).

## Features
- [X] Authentication
- [ ] CI/CD
- [ ] E2E Testing(with [Cypress](https://www.cypress.io/))

## Get Started

In the project directory, you can run:

Generate .env file, and add your Firebase project's credentials
```
$ cp .env.example .env
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
```
$ yarn
$ yarn dev
```
Builds the app for production to the `build` folder.
```
$ yarn build
```

## Debug


Array.from(document.querySelectorAll('*')).find(e => e.__vue_app__).__vue_app__.config.globalProperties.$store.state

### References

* firebase function
https://firebase.google.com/docs/functions/callable

* templates for dynamic HTML: https://github.com/firebase/functions-samples/tree/main/template-handlebars
* also https://github.com/sonakshs/cra-ssr-firebase

* You can see the full application at [vue-ts-firebase-example](https://github.com/Chia1104/vue-ts-firebase-example)
