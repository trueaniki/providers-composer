import React, { createContext, useContext, ReactNode } from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import { composeProviders } from './index'

// Create test contexts
const ThemeContext = createContext<string>('light')
const UserContext = createContext<string>('guest')
const LanguageContext = createContext<string>('en')

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

// Test component that consumes the contexts
const Consumer = () => {
  const theme = useContext(ThemeContext)
  const user = useContext(UserContext)
  const language = useContext(LanguageContext)

  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="user">{user}</div>
      <div data-testid="language">{language}</div>
    </div>
  )
}

describe('composeProviders', () => {
  // Clean up after each test
  afterEach(() => {
    cleanup()
  })

  test('should compose multiple providers correctly', () => {
    // Arrange
    const ComposedProviders = composeProviders([
      ThemeProvider,
      UserProvider,
      LanguageProvider
    ])

    // Act
    render(
      <ComposedProviders>
        <Consumer />
      </ComposedProviders>
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
    const ComposedInOrder = composeProviders([FirstProvider, SecondProvider])
    
    render(
      <ComposedInOrder>
        <OverrideConsumer />
      </ComposedInOrder>
    )
    
    // The value should be from the SecondProvider
    expect(screen.getByTestId('override-value').textContent).toBe('second')
    
    // Clean up before the next render
    cleanup()
    
    // Now reverse the order
    const ComposedReversed = composeProviders([SecondProvider, FirstProvider])
    
    render(
      <ComposedReversed>
        <OverrideConsumer />
      </ComposedReversed>
    )
    
    // The value should now be from the FirstProvider
    expect(screen.getByTestId('override-value').textContent).toBe('first')
  })

  test('should handle empty providers array', () => {
    // Arrange
    const ComposedProviders = composeProviders([])
    
    // Act
    render(
      <ComposedProviders>
        <div data-testid="empty">content</div>
      </ComposedProviders>
    )
    
    // Assert
    expect(screen.getByTestId('empty').textContent).toBe('content')
  })
}) 