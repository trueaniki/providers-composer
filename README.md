# Providers Composer

A utility library for composing multiple React Context Providers into a single component with full TypeScript support.

## Features

- **Type Safe**: Fully typed with TypeScript, providing autocomplete and type checking for provider props
- **Composable**: Combine multiple providers without excessive nesting
- **Flexible**: Pass props to providers in a clean, intuitive way
- **Simple API**: Easy to understand and implement

## Installation

```bash
yarn add providers-composer
```

## Usage

### Basic Usage

```tsx
import ProviderComposer, { pt } from 'providers-composer';
import { ThemeProvider } from './theme-provider';
import { AuthProvider } from './auth-provider';
import { StoreProvider } from './store-provider';

function App() {
  // Configure your providers
  const providers = [
    pt(ThemeProvider),
    pt(AuthProvider),
    pt(StoreProvider)
  ];

  // Use the composed providers with JSX children syntax
  return (
    <ProviderComposer providers={providers}>
      <YourApp />
    </ProviderComposer>
  );
}
```

### Using Providers with Props

You can easily pass props to your providers with full type safety:

```tsx
import ProviderComposer, { pt } from 'providers-composer';
import { ThemeProvider } from './theme-provider';
import { ConfigProvider } from './config-provider';

function App() {
  // Pass props to providers using the pt helper
  // TypeScript will validate that you're passing the correct props
  const providers = [
    pt(ThemeProvider, { theme: 'dark' }),
    pt(ConfigProvider, { debug: true })
  ];

  return (
    <ProviderComposer providers={providers}>
      <YourApp />
    </ProviderComposer>
  );
}
```

### Dynamic Provider Configuration

You can dynamically choose which providers to use:

```tsx
import ProviderComposer, { pt } from 'providers-composer';
import { ThemeProvider } from './theme-provider';

function App() {
  // Determine the theme based on user preference
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const providers = [
    pt(ThemeProvider, { theme: isDarkMode ? 'dark' : 'light' })
  ];

  return (
    <ProviderComposer providers={providers}>
      <YourApp />
    </ProviderComposer>
  );
}
```

## License

MIT 