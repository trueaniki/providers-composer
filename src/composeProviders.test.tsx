import React, { createContext, useContext, ReactNode } from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import ProviderComposer from './index'
import { pt } from './ProviderComposer'

// Create test contexts
const ThemeContext = createContext<string>('light')
const UserContext = createContext<string>('guest')
const LanguageContext = createContext<string>('en')
const ConfigContext = createContext<{ debug: boolean }>({ debug: false })

// Create provider components
const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}

const UserProvider = ({ children }: { children: ReactNode }) => {
  return <UserContext.Provider value="admin">{children}</UserContext.Provider>
}

const LanguageProvider = ({ children }: { children: ReactNode }) => {
  return <LanguageContext.Provider value="fr">{children}</LanguageContext.Provider>
}

// Provider with props
interface ConfigProviderProps {
  children: ReactNode
  debug?: boolean
}

const ConfigProvider = ({ children, debug = false }: ConfigProviderProps) => {
  return <ConfigContext.Provider value={{ debug }}>{children}</ConfigContext.Provider>
}

// Test component that consumes the contexts
const Consumer = () => {
  const theme = useContext(ThemeContext)
  const user = useContext(UserContext)
  const language = useContext(LanguageContext)
  const config = useContext(ConfigContext)

  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="user">{user}</div>
      <div data-testid="language">{language}</div>
      <div data-testid="debug">{config.debug ? 'true' : 'false'}</div>
    </div>
  )
}

describe('ProviderComposer', () => {
  // Clean up after each test
  afterEach(() => {
    cleanup()
  })

  test('should compose multiple providers correctly', () => {
    // Arrange
    const providers = [
      pt(ThemeProvider),
      pt(UserProvider),
      pt(LanguageProvider)
    ]

    // Act
    render(
      <ProviderComposer providers={providers} children={<Consumer />} />
    )

    // Assert
    expect(screen.getByTestId('theme').textContent).toBe('dark')
    expect(screen.getByTestId('user').textContent).toBe('admin')
    expect(screen.getByTestId('language').textContent).toBe('fr')
  })

  test('should maintain the correct order of providers', () => {
    // This test verifies that the providers are composed in the correct order
    // Create a context that will be overridden
    const OverrideContext = createContext<string>('initial')
    
    // Create providers with different values for the same context
    const FirstProvider = ({ children }: { children: ReactNode }) => {
      return <OverrideContext.Provider value="first">{children}</OverrideContext.Provider>
    }
    
    const SecondProvider = ({ children }: { children: ReactNode }) => {
      return <OverrideContext.Provider value="second">{children}</OverrideContext.Provider>
    }
    
    // Component that consumes the overridden context
    const OverrideConsumer = () => {
      const value = useContext(OverrideContext)
      return <div data-testid="override-value">{value}</div>
    }
    
    // When providers are composed, the last one in the array should be the innermost
    // and its value should be the one that is consumed
    const providers = [
      pt(FirstProvider),
      pt(SecondProvider)
    ]
    
    render(
      <ProviderComposer providers={providers} children={<OverrideConsumer />} />
    )
    
    // The value should be from the SecondProvider
    expect(screen.getByTestId('override-value').textContent).toBe('second')
    
    // Clean up before the next render
    cleanup()
    
    // Now reverse the order
    const reversedProviders = [
      pt(SecondProvider),
      pt(FirstProvider)
    ]
    
    render(
      <ProviderComposer providers={reversedProviders} children={<OverrideConsumer />} />
    )
    
    // The value should now be from the FirstProvider
    expect(screen.getByTestId('override-value').textContent).toBe('first')
  })

  test('should handle empty providers array', () => {
    // Arrange
    const providers: any[] = []
    
    // Act
    render(
      <ProviderComposer providers={providers} children={<div data-testid="empty">content</div>} />
    )
    
    // Assert
    expect(screen.getByTestId('empty').textContent).toBe('content')
  })

  test('should support providers with props', () => {
    // Create a provider with props
    const providers = [
      pt(ThemeProvider),
      pt(ConfigProvider, { debug: true })
    ]
    
    // Render the composed providers
    render(
      <ProviderComposer providers={providers} children={<Consumer />} />
    )
    
    // The debug value should be true
    expect(screen.getByTestId('debug').textContent).toBe('true')
  })

  test('should support creating providers with props dynamically', () => {
    // Compose providers with debug=true
    const providersDebugEnabled = [
      pt(ThemeProvider),
      pt(ConfigProvider, { debug: true })
    ]
    
    // Render the composed providers
    render(
      <ProviderComposer providers={providersDebugEnabled} children={<Consumer />} />
    )
    
    // The debug value should be true
    expect(screen.getByTestId('debug').textContent).toBe('true')
    
    // Clean up
    cleanup()
    
    // Compose providers with debug=false
    const providersDebugDisabled = [
      pt(ThemeProvider),
      pt(ConfigProvider, { debug: false })
    ]
    
    // Render the composed providers
    render(
      <ProviderComposer providers={providersDebugDisabled} children={<Consumer />} />
    )
    
    // The debug value should be false
    expect(screen.getByTestId('debug').textContent).toBe('false')
  })
}) 