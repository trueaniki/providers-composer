import { ComponentType, ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Provider = ((props: any) => ReactNode) | ComponentType<any>
type ProviderProps<T extends Provider> = Omit<T extends (props: infer P) => ReactNode ? P : never, 'children'>

type RequiredKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

type PropsArg<T extends Provider> =
  [RequiredKeys<ProviderProps<T>>] extends [never]
    ? [props?: ProviderProps<T>]
    : [props:  ProviderProps<T>]

type ProviderTuple<T extends Provider> = {
  provider: T
  props?: ProviderProps<T>
}

/**
 * `pt` is short for provider tuple, which is a tuple of a provider and its props
 * @param provider - The provider to wrap
 * @param props - The props to pass to the provider,
 * although it's a rest arg, only one argument is supposed to be passed
 * @returns A tuple containing the provider and its props
 */
export function pt<T extends Provider>(provider: T, ...props: PropsArg<T>): ProviderTuple<T> {
  const providerProps = (props[0] ?? {}) as ProviderProps<T>
  return { provider, props: providerProps }
}

/**
 * A component that composes multiple providers in order, reducing nesting
 * @param providers - Array of provider entries in format [Component] or [Component, props]
 * @param children - Child components to be wrapped by the providers
 */
export function ProviderComposer<const T extends readonly ProviderTuple<Provider>[]>({
  providers,
  children,
}: {
  providers: T
  children: ReactNode
}): ReactNode {
  return providers.reduceRight((acc, entry) => {
    const { provider: Provider, props = {} } = entry
    return <Provider {...props}>{acc}</Provider>
  }, children)
}
