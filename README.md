# Providers Composer

A utility library for composing multiple React Context Providers into a single component.

## Installation

```bash
yarn add providers-composer
```

## Usage

```tsx
import { composeProviders } from 'providers-composer';
import { ThemeProvider } from './theme-provider';
import { AuthProvider } from './auth-provider';
import { StoreProvider } from './store-provider';

// Compose multiple providers into a single provider component
const AppProviders = composeProviders([
  ThemeProvider,
  AuthProvider,
  StoreProvider
]);

// Use the composed provider in your app
function App() {
  return (
    <AppProviders>
      <YourApp />
    </AppProviders>
  );
}
```

## License

MIT 