import { NuxtModule, ModuleDependencyMeta } from '@nuxt/schema'
declare module '@nuxt/schema' {
  interface ModuleDependencies {
    ["@bloggrs/shared-ui/nuxt"]?: ModuleDependencyMeta<typeof import("@bloggrs/shared-ui/nuxt").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["/Users/gjergjkadriu/Documents/GitHub/Byway/apps/web/modules/plugin-loader"]?: ModuleDependencyMeta<typeof import("/Users/gjergjkadriu/Documents/GitHub/Byway/apps/web/modules/plugin-loader").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/devtools"]?: ModuleDependencyMeta<typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/telemetry"]?: ModuleDependencyMeta<typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
  }
  interface NuxtOptions {
    /**
     * Configuration for `@bloggrs/shared-ui/nuxt`
     */
    ["@bloggrs/shared-ui/nuxt"]: typeof import("@bloggrs/shared-ui/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `/Users/gjergjkadriu/Documents/GitHub/Byway/apps/web/modules/plugin-loader`
     */
    ["bloggrs-plugin-loader"]: typeof import("/Users/gjergjkadriu/Documents/GitHub/Byway/apps/web/modules/plugin-loader").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     */
    ["devtools"]: typeof import("@nuxt/devtools").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     */
    ["telemetry"]: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
  }
  interface NuxtConfig {
    /**
     * Configuration for `@bloggrs/shared-ui/nuxt`
     */
    ["@bloggrs/shared-ui/nuxt"]?: typeof import("@bloggrs/shared-ui/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `/Users/gjergjkadriu/Documents/GitHub/Byway/apps/web/modules/plugin-loader`
     */
    ["bloggrs-plugin-loader"]?: typeof import("/Users/gjergjkadriu/Documents/GitHub/Byway/apps/web/modules/plugin-loader").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     */
    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     */
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    modules?: (undefined | null | false | NuxtModule<any> | string | [NuxtModule | string, Record<string, any>] | ["@bloggrs/shared-ui/nuxt", Exclude<NuxtConfig["@bloggrs/shared-ui/nuxt"], boolean>] | ["/Users/gjergjkadriu/Documents/GitHub/Byway/apps/web/modules/plugin-loader", Exclude<NuxtConfig["bloggrs-plugin-loader"], boolean>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
}
declare module 'nuxt/schema' {
  interface ModuleDependencies {
    ["@bloggrs/shared-ui/nuxt"]?: ModuleDependencyMeta<typeof import("@bloggrs/shared-ui/nuxt").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["/Users/gjergjkadriu/Documents/GitHub/Byway/apps/web/modules/plugin-loader"]?: ModuleDependencyMeta<typeof import("/Users/gjergjkadriu/Documents/GitHub/Byway/apps/web/modules/plugin-loader").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/devtools"]?: ModuleDependencyMeta<typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/telemetry"]?: ModuleDependencyMeta<typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
  }
  interface NuxtOptions {
    /**
     * Configuration for `@bloggrs/shared-ui/nuxt`
     * @see https://www.npmjs.com/package/@bloggrs/shared-ui/nuxt
     */
    ["@bloggrs/shared-ui/nuxt"]: typeof import("@bloggrs/shared-ui/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `/Users/gjergjkadriu/Documents/GitHub/Byway/apps/web/modules/plugin-loader`
     * @see https://www.npmjs.com/package//Users/gjergjkadriu/Documents/GitHub/Byway/apps/web/modules/plugin-loader
     */
    ["bloggrs-plugin-loader"]: typeof import("/Users/gjergjkadriu/Documents/GitHub/Byway/apps/web/modules/plugin-loader").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     * @see https://www.npmjs.com/package/@nuxt/devtools
     */
    ["devtools"]: typeof import("@nuxt/devtools").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     * @see https://www.npmjs.com/package/@nuxt/telemetry
     */
    ["telemetry"]: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
  }
  interface NuxtConfig {
    /**
     * Configuration for `@bloggrs/shared-ui/nuxt`
     * @see https://www.npmjs.com/package/@bloggrs/shared-ui/nuxt
     */
    ["@bloggrs/shared-ui/nuxt"]?: typeof import("@bloggrs/shared-ui/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `/Users/gjergjkadriu/Documents/GitHub/Byway/apps/web/modules/plugin-loader`
     * @see https://www.npmjs.com/package//Users/gjergjkadriu/Documents/GitHub/Byway/apps/web/modules/plugin-loader
     */
    ["bloggrs-plugin-loader"]?: typeof import("/Users/gjergjkadriu/Documents/GitHub/Byway/apps/web/modules/plugin-loader").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     * @see https://www.npmjs.com/package/@nuxt/devtools
     */
    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     * @see https://www.npmjs.com/package/@nuxt/telemetry
     */
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    modules?: (undefined | null | false | NuxtModule<any> | string | [NuxtModule | string, Record<string, any>] | ["@bloggrs/shared-ui/nuxt", Exclude<NuxtConfig["@bloggrs/shared-ui/nuxt"], boolean>] | ["/Users/gjergjkadriu/Documents/GitHub/Byway/apps/web/modules/plugin-loader", Exclude<NuxtConfig["bloggrs-plugin-loader"], boolean>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
}