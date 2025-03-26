[Moxie shop](https://moxieimpact.com/)

## What is this?

This app is a Control Panel created to change the link to your QR clothing.


## How Does This Work?

Each clothing item we create has a unique QR code that links to the unique website from which it is further redirected to the site you as a user choose.


## Development

### Development setup

- Clone the repository
- make a copy of `.env.example` and rename it to `.env.local`
- insert needed config in `.env.local`
- Run `npm install` to install dependencies
- Run `npm run dev` to start the development server


### Development workflow

- We work on the `develop` branch.
- Always pull the latest changes from `develop` before starting new work.
- Create a new **feature branch** from `develop` for each new feature or fix.
- Once your work is ready, open a **pull request** from your feature branch to `develop`.
- The `main` branch is connected to Continuous Deployment (CD) – pushing to `main` will automatically deploy the app to Netlify.


Moxie daily quotes [here](https://daily.moxieimpact.com/)