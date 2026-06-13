# Movie Clone

A simple movie clone application built with React, TypeScript, and Vite. It connects to the TMDB API to pull live movie data.

## Tech Stack
* React & TypeScript (Vite)
* Tailwind CSS
* TanStack Query (React Query)
* Axios
* React Router DOM
* Lucide React

---

## Setup Instructions

### 1. Install Dependencies
Clone the repo, open your terminal in the project folder, and run:
```bash
git clone https://github.com/VictorAkubo/movieclone
cd movieclone
npm install
```

### 2. Add Your TMDB Token
Create a `.env` file in the main project folder. 

Grab an Access Token from your TMDB account settings, and drop it in like this:

```env
VITE_TMDB_ACCESS_TOKEN=put_your_token_you got from_tmdb_here
```

### 3. Run the App
To spin up the local server, run:
```bash
npm run dev
```
Head over to `http://localhost:5173/` in your browser to check it out.


# TMDB configuration
Create an account on *https://www.themoviedb.org/*
click on profile
click on settings
click on API to get your api key
you would be requested to enter some inputs like your website name,use *http://localhost:5173/* since i used vite
get your api key and access token
paste into your .env



# other stuffs added to the vite projects automatically below

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
