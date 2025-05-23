# Providers Composer

A utility library for composing multiple React Context Providers into a single component.

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

  // Use the composed provider in your app
  return (
    <ProviderComposer 
      providers={providers} 
      children={<YourApp />} 
    />
  );
}
```

### Using Providers with Props

You can easily pass props to your providers:

```tsx
import ProviderComposer, { pt } from 'providers-composer';
import { ThemeProvider } from './theme-provider';
import { ConfigProvider } from './config-provider';

function App() {
  // Pass props to providers using the pt helper
  const providers = [
    pt(ThemeProvider, { theme: 'dark' }),
    pt(ConfigProvider, { debug: true })
  ];

  return (
    <ProviderComposer 
      providers={providers} 
      children={<YourApp />}
    />
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
    <ProviderComposer 
      providers={providers} 
      children={<YourApp />}
    />
  );
}
```

### JSX Children Syntax

You can also use JSX children syntax instead of the children prop:

```tsx
import ProviderComposer, { pt } from 'providers-composer';
import { ThemeProvider } from './theme-provider';
import { AuthProvider } from './auth-provider';

function App() {
  const providers = [
    pt(ThemeProvider),
    pt(AuthProvider)
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