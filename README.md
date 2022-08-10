# Duster Brews Dashboard

I make beer with my friends. This is an app to keep tabs on our beer through a locally hosted website.

## Getting Started
Follow these steps to get a dashboard going!

### Requirements
You will need to have the following software installed:
- [Node JS](https://nodejs.org/en/)
- [Ruby (Use this download for windows)](https://rubyinstaller.org/)

### Before running
Every app instance requires configuration and this is no different.

- **Set up your Environment file**
  - To get started, copy the `.env-example` file and rename it to `.env`.
  - Open your new copy of the `.env` (read environment) file and fill in the required fields.
- **Install the THOUSANDS of Node modules**
  - Open your terminal of choice and navigate to this directory.
  - Run the following command
  
```bash
cd duster-brews-dashboard
npm install
```
- **Run the server and navigate to website**
  - With that same terminal (you didn't close it, did you?), run the following command

```bash
npm run serve
```