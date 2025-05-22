import type { ComponentType, ReactElement, ReactNode } from 'react';

/**
 * Composes multiple React provider components into a single provider component.
 * @param providers - Array of provider components to compose
 * @returns A single component that nests all providers
 */
export function composeProviders(
  providers: ComponentType<{ children: ReactNode }>[]
): ComponentType<{ children: ReactNode }> {
  return function ComposedProviders({ children }: { children: ReactNode }) {
    return providers.reduceRight((acc, Provider) => {
      return createElement(Provider, { children: acc });
    }, children);
  };
}

// Simple createElement implementation to avoid direct React dependency
function createElement(
  Component: ComponentType<any>,
  props: { children: ReactNode }
): ReactElement {
  return {
    $$typeof: Symbol.for('react.element'),
    type: Component,
    key: null,
    ref: null,
    props,
    _owner: null
  } as unknown as ReactElement;
}

// Export the composeProviders function as default as well
export default composeProviders;
