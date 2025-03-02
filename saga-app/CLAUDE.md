# SAGA APP DEVELOPMENT GUIDE

## Commands
- `npm start`: Run development server
- `npm build`: Build for production
- `npm test`: Run tests (Jest)
- `npm test -- --testPathPattern=ComponentName`: Run single test
- `npm run lint`: Run ESLint
- `npm run format`: Run Prettier

## Code Style
- **Components**: Functional components with named exports, PascalCase naming
- **Variables/Functions**: camelCase naming
- **State Management**: React Context API (see `/src/context`)
- **Styling**: Tailwind CSS
- **Imports Order**: React/hooks → third-party libs → contexts → components → utils
- **Internationalization**: i18next (locale files in `/src/locales`)
- **Error Handling**: Try/catch with user-friendly error messages
- **File Structure**: 
  - `/components`: Reusable UI components
  - `/screens`: Page components
  - `/context`: State providers
  - `/utils`: Helper functions