
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model LabChallenge
 * 
 */
export type LabChallenge = $Result.DefaultSelection<Prisma.$LabChallengePayload>
/**
 * Model LabSession
 * 
 */
export type LabSession = $Result.DefaultSelection<Prisma.$LabSessionPayload>
/**
 * Model LabWorkspace
 * 
 */
export type LabWorkspace = $Result.DefaultSelection<Prisma.$LabWorkspacePayload>
/**
 * Model Submission
 * 
 */
export type Submission = $Result.DefaultSelection<Prisma.$SubmissionPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more LabChallenges
 * const labChallenges = await prisma.labChallenge.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more LabChallenges
   * const labChallenges = await prisma.labChallenge.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.labChallenge`: Exposes CRUD operations for the **LabChallenge** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LabChallenges
    * const labChallenges = await prisma.labChallenge.findMany()
    * ```
    */
  get labChallenge(): Prisma.LabChallengeDelegate<ExtArgs>;

  /**
   * `prisma.labSession`: Exposes CRUD operations for the **LabSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LabSessions
    * const labSessions = await prisma.labSession.findMany()
    * ```
    */
  get labSession(): Prisma.LabSessionDelegate<ExtArgs>;

  /**
   * `prisma.labWorkspace`: Exposes CRUD operations for the **LabWorkspace** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LabWorkspaces
    * const labWorkspaces = await prisma.labWorkspace.findMany()
    * ```
    */
  get labWorkspace(): Prisma.LabWorkspaceDelegate<ExtArgs>;

  /**
   * `prisma.submission`: Exposes CRUD operations for the **Submission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Submissions
    * const submissions = await prisma.submission.findMany()
    * ```
    */
  get submission(): Prisma.SubmissionDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.15.0
   * Query Engine version: 12e25d8d06f6ea5a0252864dd9a03b1bb51f3022
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown }

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    LabChallenge: 'LabChallenge',
    LabSession: 'LabSession',
    LabWorkspace: 'LabWorkspace',
    Submission: 'Submission'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'labChallenge' | 'labSession' | 'labWorkspace' | 'submission'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      LabChallenge: {
        payload: Prisma.$LabChallengePayload<ExtArgs>
        fields: Prisma.LabChallengeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LabChallengeFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabChallengePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LabChallengeFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabChallengePayload>
          }
          findFirst: {
            args: Prisma.LabChallengeFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabChallengePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LabChallengeFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabChallengePayload>
          }
          findMany: {
            args: Prisma.LabChallengeFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabChallengePayload>[]
          }
          create: {
            args: Prisma.LabChallengeCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabChallengePayload>
          }
          createMany: {
            args: Prisma.LabChallengeCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LabChallengeCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabChallengePayload>[]
          }
          delete: {
            args: Prisma.LabChallengeDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabChallengePayload>
          }
          update: {
            args: Prisma.LabChallengeUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabChallengePayload>
          }
          deleteMany: {
            args: Prisma.LabChallengeDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.LabChallengeUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.LabChallengeUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabChallengePayload>
          }
          aggregate: {
            args: Prisma.LabChallengeAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateLabChallenge>
          }
          groupBy: {
            args: Prisma.LabChallengeGroupByArgs<ExtArgs>,
            result: $Utils.Optional<LabChallengeGroupByOutputType>[]
          }
          count: {
            args: Prisma.LabChallengeCountArgs<ExtArgs>,
            result: $Utils.Optional<LabChallengeCountAggregateOutputType> | number
          }
        }
      }
      LabSession: {
        payload: Prisma.$LabSessionPayload<ExtArgs>
        fields: Prisma.LabSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LabSessionFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LabSessionFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabSessionPayload>
          }
          findFirst: {
            args: Prisma.LabSessionFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LabSessionFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabSessionPayload>
          }
          findMany: {
            args: Prisma.LabSessionFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabSessionPayload>[]
          }
          create: {
            args: Prisma.LabSessionCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabSessionPayload>
          }
          createMany: {
            args: Prisma.LabSessionCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LabSessionCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabSessionPayload>[]
          }
          delete: {
            args: Prisma.LabSessionDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabSessionPayload>
          }
          update: {
            args: Prisma.LabSessionUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabSessionPayload>
          }
          deleteMany: {
            args: Prisma.LabSessionDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.LabSessionUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.LabSessionUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabSessionPayload>
          }
          aggregate: {
            args: Prisma.LabSessionAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateLabSession>
          }
          groupBy: {
            args: Prisma.LabSessionGroupByArgs<ExtArgs>,
            result: $Utils.Optional<LabSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.LabSessionCountArgs<ExtArgs>,
            result: $Utils.Optional<LabSessionCountAggregateOutputType> | number
          }
        }
      }
      LabWorkspace: {
        payload: Prisma.$LabWorkspacePayload<ExtArgs>
        fields: Prisma.LabWorkspaceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LabWorkspaceFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabWorkspacePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LabWorkspaceFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabWorkspacePayload>
          }
          findFirst: {
            args: Prisma.LabWorkspaceFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabWorkspacePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LabWorkspaceFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabWorkspacePayload>
          }
          findMany: {
            args: Prisma.LabWorkspaceFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabWorkspacePayload>[]
          }
          create: {
            args: Prisma.LabWorkspaceCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabWorkspacePayload>
          }
          createMany: {
            args: Prisma.LabWorkspaceCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LabWorkspaceCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabWorkspacePayload>[]
          }
          delete: {
            args: Prisma.LabWorkspaceDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabWorkspacePayload>
          }
          update: {
            args: Prisma.LabWorkspaceUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabWorkspacePayload>
          }
          deleteMany: {
            args: Prisma.LabWorkspaceDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.LabWorkspaceUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.LabWorkspaceUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$LabWorkspacePayload>
          }
          aggregate: {
            args: Prisma.LabWorkspaceAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateLabWorkspace>
          }
          groupBy: {
            args: Prisma.LabWorkspaceGroupByArgs<ExtArgs>,
            result: $Utils.Optional<LabWorkspaceGroupByOutputType>[]
          }
          count: {
            args: Prisma.LabWorkspaceCountArgs<ExtArgs>,
            result: $Utils.Optional<LabWorkspaceCountAggregateOutputType> | number
          }
        }
      }
      Submission: {
        payload: Prisma.$SubmissionPayload<ExtArgs>
        fields: Prisma.SubmissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubmissionFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubmissionFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload>
          }
          findFirst: {
            args: Prisma.SubmissionFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubmissionFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload>
          }
          findMany: {
            args: Prisma.SubmissionFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload>[]
          }
          create: {
            args: Prisma.SubmissionCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload>
          }
          createMany: {
            args: Prisma.SubmissionCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubmissionCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload>[]
          }
          delete: {
            args: Prisma.SubmissionDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload>
          }
          update: {
            args: Prisma.SubmissionUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload>
          }
          deleteMany: {
            args: Prisma.SubmissionDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.SubmissionUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.SubmissionUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SubmissionPayload>
          }
          aggregate: {
            args: Prisma.SubmissionAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateSubmission>
          }
          groupBy: {
            args: Prisma.SubmissionGroupByArgs<ExtArgs>,
            result: $Utils.Optional<SubmissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubmissionCountArgs<ExtArgs>,
            result: $Utils.Optional<SubmissionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type LabChallengeCountOutputType
   */

  export type LabChallengeCountOutputType = {
    sessions: number
  }

  export type LabChallengeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | LabChallengeCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * LabChallengeCountOutputType without action
   */
  export type LabChallengeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabChallengeCountOutputType
     */
    select?: LabChallengeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LabChallengeCountOutputType without action
   */
  export type LabChallengeCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LabSessionWhereInput
  }


  /**
   * Count Type LabSessionCountOutputType
   */

  export type LabSessionCountOutputType = {
    submissions: number
    workspaces: number
  }

  export type LabSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submissions?: boolean | LabSessionCountOutputTypeCountSubmissionsArgs
    workspaces?: boolean | LabSessionCountOutputTypeCountWorkspacesArgs
  }

  // Custom InputTypes
  /**
   * LabSessionCountOutputType without action
   */
  export type LabSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabSessionCountOutputType
     */
    select?: LabSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LabSessionCountOutputType without action
   */
  export type LabSessionCountOutputTypeCountSubmissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubmissionWhereInput
  }

  /**
   * LabSessionCountOutputType without action
   */
  export type LabSessionCountOutputTypeCountWorkspacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LabWorkspaceWhereInput
  }


  /**
   * Models
   */

  /**
   * Model LabChallenge
   */

  export type AggregateLabChallenge = {
    _count: LabChallengeCountAggregateOutputType | null
    _min: LabChallengeMinAggregateOutputType | null
    _max: LabChallengeMaxAggregateOutputType | null
  }

  export type LabChallengeMinAggregateOutputType = {
    courseId: string | null
    moduleId: string | null
    lessonId: string | null
    id: string | null
    title: string | null
    slug: string | null
    description: string | null
    difficulty: string | null
    starterRepoUrl: string | null
    testsRepoUrl: string | null
    runtime: string | null
    createdByUserId: string | null
    visibility: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LabChallengeMaxAggregateOutputType = {
    courseId: string | null
    moduleId: string | null
    lessonId: string | null
    id: string | null
    title: string | null
    slug: string | null
    description: string | null
    difficulty: string | null
    starterRepoUrl: string | null
    testsRepoUrl: string | null
    runtime: string | null
    createdByUserId: string | null
    visibility: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LabChallengeCountAggregateOutputType = {
    courseId: number
    moduleId: number
    lessonId: number
    id: number
    title: number
    slug: number
    description: number
    difficulty: number
    starterRepoUrl: number
    testsRepoUrl: number
    runtime: number
    createdByUserId: number
    visibility: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LabChallengeMinAggregateInputType = {
    courseId?: true
    moduleId?: true
    lessonId?: true
    id?: true
    title?: true
    slug?: true
    description?: true
    difficulty?: true
    starterRepoUrl?: true
    testsRepoUrl?: true
    runtime?: true
    createdByUserId?: true
    visibility?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LabChallengeMaxAggregateInputType = {
    courseId?: true
    moduleId?: true
    lessonId?: true
    id?: true
    title?: true
    slug?: true
    description?: true
    difficulty?: true
    starterRepoUrl?: true
    testsRepoUrl?: true
    runtime?: true
    createdByUserId?: true
    visibility?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LabChallengeCountAggregateInputType = {
    courseId?: true
    moduleId?: true
    lessonId?: true
    id?: true
    title?: true
    slug?: true
    description?: true
    difficulty?: true
    starterRepoUrl?: true
    testsRepoUrl?: true
    runtime?: true
    createdByUserId?: true
    visibility?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LabChallengeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LabChallenge to aggregate.
     */
    where?: LabChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabChallenges to fetch.
     */
    orderBy?: LabChallengeOrderByWithRelationInput | LabChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LabChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LabChallenges
    **/
    _count?: true | LabChallengeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LabChallengeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LabChallengeMaxAggregateInputType
  }

  export type GetLabChallengeAggregateType<T extends LabChallengeAggregateArgs> = {
        [P in keyof T & keyof AggregateLabChallenge]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLabChallenge[P]>
      : GetScalarType<T[P], AggregateLabChallenge[P]>
  }




  export type LabChallengeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LabChallengeWhereInput
    orderBy?: LabChallengeOrderByWithAggregationInput | LabChallengeOrderByWithAggregationInput[]
    by: LabChallengeScalarFieldEnum[] | LabChallengeScalarFieldEnum
    having?: LabChallengeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LabChallengeCountAggregateInputType | true
    _min?: LabChallengeMinAggregateInputType
    _max?: LabChallengeMaxAggregateInputType
  }

  export type LabChallengeGroupByOutputType = {
    courseId: string | null
    moduleId: string | null
    lessonId: string | null
    id: string
    title: string
    slug: string
    description: string
    difficulty: string
    starterRepoUrl: string | null
    testsRepoUrl: string | null
    runtime: string | null
    createdByUserId: string
    visibility: string
    createdAt: Date
    updatedAt: Date
    _count: LabChallengeCountAggregateOutputType | null
    _min: LabChallengeMinAggregateOutputType | null
    _max: LabChallengeMaxAggregateOutputType | null
  }

  type GetLabChallengeGroupByPayload<T extends LabChallengeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LabChallengeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LabChallengeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LabChallengeGroupByOutputType[P]>
            : GetScalarType<T[P], LabChallengeGroupByOutputType[P]>
        }
      >
    >


  export type LabChallengeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    courseId?: boolean
    moduleId?: boolean
    lessonId?: boolean
    id?: boolean
    title?: boolean
    slug?: boolean
    description?: boolean
    difficulty?: boolean
    starterRepoUrl?: boolean
    testsRepoUrl?: boolean
    runtime?: boolean
    createdByUserId?: boolean
    visibility?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessions?: boolean | LabChallenge$sessionsArgs<ExtArgs>
    _count?: boolean | LabChallengeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["labChallenge"]>

  export type LabChallengeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    courseId?: boolean
    moduleId?: boolean
    lessonId?: boolean
    id?: boolean
    title?: boolean
    slug?: boolean
    description?: boolean
    difficulty?: boolean
    starterRepoUrl?: boolean
    testsRepoUrl?: boolean
    runtime?: boolean
    createdByUserId?: boolean
    visibility?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["labChallenge"]>

  export type LabChallengeSelectScalar = {
    courseId?: boolean
    moduleId?: boolean
    lessonId?: boolean
    id?: boolean
    title?: boolean
    slug?: boolean
    description?: boolean
    difficulty?: boolean
    starterRepoUrl?: boolean
    testsRepoUrl?: boolean
    runtime?: boolean
    createdByUserId?: boolean
    visibility?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LabChallengeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | LabChallenge$sessionsArgs<ExtArgs>
    _count?: boolean | LabChallengeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LabChallengeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $LabChallengePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LabChallenge"
    objects: {
      sessions: Prisma.$LabSessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      courseId: string | null
      moduleId: string | null
      lessonId: string | null
      id: string
      title: string
      slug: string
      description: string
      difficulty: string
      starterRepoUrl: string | null
      testsRepoUrl: string | null
      runtime: string | null
      createdByUserId: string
      visibility: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["labChallenge"]>
    composites: {}
  }

  type LabChallengeGetPayload<S extends boolean | null | undefined | LabChallengeDefaultArgs> = $Result.GetResult<Prisma.$LabChallengePayload, S>

  type LabChallengeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LabChallengeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LabChallengeCountAggregateInputType | true
    }

  export interface LabChallengeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LabChallenge'], meta: { name: 'LabChallenge' } }
    /**
     * Find zero or one LabChallenge that matches the filter.
     * @param {LabChallengeFindUniqueArgs} args - Arguments to find a LabChallenge
     * @example
     * // Get one LabChallenge
     * const labChallenge = await prisma.labChallenge.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends LabChallengeFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, LabChallengeFindUniqueArgs<ExtArgs>>
    ): Prisma__LabChallengeClient<$Result.GetResult<Prisma.$LabChallengePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one LabChallenge that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LabChallengeFindUniqueOrThrowArgs} args - Arguments to find a LabChallenge
     * @example
     * // Get one LabChallenge
     * const labChallenge = await prisma.labChallenge.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends LabChallengeFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, LabChallengeFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__LabChallengeClient<$Result.GetResult<Prisma.$LabChallengePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first LabChallenge that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabChallengeFindFirstArgs} args - Arguments to find a LabChallenge
     * @example
     * // Get one LabChallenge
     * const labChallenge = await prisma.labChallenge.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends LabChallengeFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, LabChallengeFindFirstArgs<ExtArgs>>
    ): Prisma__LabChallengeClient<$Result.GetResult<Prisma.$LabChallengePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first LabChallenge that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabChallengeFindFirstOrThrowArgs} args - Arguments to find a LabChallenge
     * @example
     * // Get one LabChallenge
     * const labChallenge = await prisma.labChallenge.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends LabChallengeFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, LabChallengeFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__LabChallengeClient<$Result.GetResult<Prisma.$LabChallengePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more LabChallenges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabChallengeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LabChallenges
     * const labChallenges = await prisma.labChallenge.findMany()
     * 
     * // Get first 10 LabChallenges
     * const labChallenges = await prisma.labChallenge.findMany({ take: 10 })
     * 
     * // Only select the `courseId`
     * const labChallengeWithCourseIdOnly = await prisma.labChallenge.findMany({ select: { courseId: true } })
     * 
    **/
    findMany<T extends LabChallengeFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, LabChallengeFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabChallengePayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a LabChallenge.
     * @param {LabChallengeCreateArgs} args - Arguments to create a LabChallenge.
     * @example
     * // Create one LabChallenge
     * const LabChallenge = await prisma.labChallenge.create({
     *   data: {
     *     // ... data to create a LabChallenge
     *   }
     * })
     * 
    **/
    create<T extends LabChallengeCreateArgs<ExtArgs>>(
      args: SelectSubset<T, LabChallengeCreateArgs<ExtArgs>>
    ): Prisma__LabChallengeClient<$Result.GetResult<Prisma.$LabChallengePayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many LabChallenges.
     * @param {LabChallengeCreateManyArgs} args - Arguments to create many LabChallenges.
     * @example
     * // Create many LabChallenges
     * const labChallenge = await prisma.labChallenge.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends LabChallengeCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, LabChallengeCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LabChallenges and returns the data saved in the database.
     * @param {LabChallengeCreateManyAndReturnArgs} args - Arguments to create many LabChallenges.
     * @example
     * // Create many LabChallenges
     * const labChallenge = await prisma.labChallenge.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LabChallenges and only return the `courseId`
     * const labChallengeWithCourseIdOnly = await prisma.labChallenge.createManyAndReturn({ 
     *   select: { courseId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends LabChallengeCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, LabChallengeCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabChallengePayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a LabChallenge.
     * @param {LabChallengeDeleteArgs} args - Arguments to delete one LabChallenge.
     * @example
     * // Delete one LabChallenge
     * const LabChallenge = await prisma.labChallenge.delete({
     *   where: {
     *     // ... filter to delete one LabChallenge
     *   }
     * })
     * 
    **/
    delete<T extends LabChallengeDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, LabChallengeDeleteArgs<ExtArgs>>
    ): Prisma__LabChallengeClient<$Result.GetResult<Prisma.$LabChallengePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one LabChallenge.
     * @param {LabChallengeUpdateArgs} args - Arguments to update one LabChallenge.
     * @example
     * // Update one LabChallenge
     * const labChallenge = await prisma.labChallenge.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends LabChallengeUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, LabChallengeUpdateArgs<ExtArgs>>
    ): Prisma__LabChallengeClient<$Result.GetResult<Prisma.$LabChallengePayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more LabChallenges.
     * @param {LabChallengeDeleteManyArgs} args - Arguments to filter LabChallenges to delete.
     * @example
     * // Delete a few LabChallenges
     * const { count } = await prisma.labChallenge.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends LabChallengeDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, LabChallengeDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LabChallenges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabChallengeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LabChallenges
     * const labChallenge = await prisma.labChallenge.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends LabChallengeUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, LabChallengeUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LabChallenge.
     * @param {LabChallengeUpsertArgs} args - Arguments to update or create a LabChallenge.
     * @example
     * // Update or create a LabChallenge
     * const labChallenge = await prisma.labChallenge.upsert({
     *   create: {
     *     // ... data to create a LabChallenge
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LabChallenge we want to update
     *   }
     * })
    **/
    upsert<T extends LabChallengeUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, LabChallengeUpsertArgs<ExtArgs>>
    ): Prisma__LabChallengeClient<$Result.GetResult<Prisma.$LabChallengePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of LabChallenges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabChallengeCountArgs} args - Arguments to filter LabChallenges to count.
     * @example
     * // Count the number of LabChallenges
     * const count = await prisma.labChallenge.count({
     *   where: {
     *     // ... the filter for the LabChallenges we want to count
     *   }
     * })
    **/
    count<T extends LabChallengeCountArgs>(
      args?: Subset<T, LabChallengeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LabChallengeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LabChallenge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabChallengeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LabChallengeAggregateArgs>(args: Subset<T, LabChallengeAggregateArgs>): Prisma.PrismaPromise<GetLabChallengeAggregateType<T>>

    /**
     * Group by LabChallenge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabChallengeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LabChallengeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LabChallengeGroupByArgs['orderBy'] }
        : { orderBy?: LabChallengeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LabChallengeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLabChallengeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LabChallenge model
   */
  readonly fields: LabChallengeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LabChallenge.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LabChallengeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    sessions<T extends LabChallenge$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, LabChallenge$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabSessionPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the LabChallenge model
   */ 
  interface LabChallengeFieldRefs {
    readonly courseId: FieldRef<"LabChallenge", 'String'>
    readonly moduleId: FieldRef<"LabChallenge", 'String'>
    readonly lessonId: FieldRef<"LabChallenge", 'String'>
    readonly id: FieldRef<"LabChallenge", 'String'>
    readonly title: FieldRef<"LabChallenge", 'String'>
    readonly slug: FieldRef<"LabChallenge", 'String'>
    readonly description: FieldRef<"LabChallenge", 'String'>
    readonly difficulty: FieldRef<"LabChallenge", 'String'>
    readonly starterRepoUrl: FieldRef<"LabChallenge", 'String'>
    readonly testsRepoUrl: FieldRef<"LabChallenge", 'String'>
    readonly runtime: FieldRef<"LabChallenge", 'String'>
    readonly createdByUserId: FieldRef<"LabChallenge", 'String'>
    readonly visibility: FieldRef<"LabChallenge", 'String'>
    readonly createdAt: FieldRef<"LabChallenge", 'DateTime'>
    readonly updatedAt: FieldRef<"LabChallenge", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LabChallenge findUnique
   */
  export type LabChallengeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabChallenge
     */
    select?: LabChallengeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabChallengeInclude<ExtArgs> | null
    /**
     * Filter, which LabChallenge to fetch.
     */
    where: LabChallengeWhereUniqueInput
  }

  /**
   * LabChallenge findUniqueOrThrow
   */
  export type LabChallengeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabChallenge
     */
    select?: LabChallengeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabChallengeInclude<ExtArgs> | null
    /**
     * Filter, which LabChallenge to fetch.
     */
    where: LabChallengeWhereUniqueInput
  }

  /**
   * LabChallenge findFirst
   */
  export type LabChallengeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabChallenge
     */
    select?: LabChallengeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabChallengeInclude<ExtArgs> | null
    /**
     * Filter, which LabChallenge to fetch.
     */
    where?: LabChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabChallenges to fetch.
     */
    orderBy?: LabChallengeOrderByWithRelationInput | LabChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LabChallenges.
     */
    cursor?: LabChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LabChallenges.
     */
    distinct?: LabChallengeScalarFieldEnum | LabChallengeScalarFieldEnum[]
  }

  /**
   * LabChallenge findFirstOrThrow
   */
  export type LabChallengeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabChallenge
     */
    select?: LabChallengeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabChallengeInclude<ExtArgs> | null
    /**
     * Filter, which LabChallenge to fetch.
     */
    where?: LabChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabChallenges to fetch.
     */
    orderBy?: LabChallengeOrderByWithRelationInput | LabChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LabChallenges.
     */
    cursor?: LabChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LabChallenges.
     */
    distinct?: LabChallengeScalarFieldEnum | LabChallengeScalarFieldEnum[]
  }

  /**
   * LabChallenge findMany
   */
  export type LabChallengeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabChallenge
     */
    select?: LabChallengeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabChallengeInclude<ExtArgs> | null
    /**
     * Filter, which LabChallenges to fetch.
     */
    where?: LabChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabChallenges to fetch.
     */
    orderBy?: LabChallengeOrderByWithRelationInput | LabChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LabChallenges.
     */
    cursor?: LabChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabChallenges.
     */
    skip?: number
    distinct?: LabChallengeScalarFieldEnum | LabChallengeScalarFieldEnum[]
  }

  /**
   * LabChallenge create
   */
  export type LabChallengeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabChallenge
     */
    select?: LabChallengeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabChallengeInclude<ExtArgs> | null
    /**
     * The data needed to create a LabChallenge.
     */
    data: XOR<LabChallengeCreateInput, LabChallengeUncheckedCreateInput>
  }

  /**
   * LabChallenge createMany
   */
  export type LabChallengeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LabChallenges.
     */
    data: LabChallengeCreateManyInput | LabChallengeCreateManyInput[]
  }

  /**
   * LabChallenge createManyAndReturn
   */
  export type LabChallengeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabChallenge
     */
    select?: LabChallengeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many LabChallenges.
     */
    data: LabChallengeCreateManyInput | LabChallengeCreateManyInput[]
  }

  /**
   * LabChallenge update
   */
  export type LabChallengeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabChallenge
     */
    select?: LabChallengeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabChallengeInclude<ExtArgs> | null
    /**
     * The data needed to update a LabChallenge.
     */
    data: XOR<LabChallengeUpdateInput, LabChallengeUncheckedUpdateInput>
    /**
     * Choose, which LabChallenge to update.
     */
    where: LabChallengeWhereUniqueInput
  }

  /**
   * LabChallenge updateMany
   */
  export type LabChallengeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LabChallenges.
     */
    data: XOR<LabChallengeUpdateManyMutationInput, LabChallengeUncheckedUpdateManyInput>
    /**
     * Filter which LabChallenges to update
     */
    where?: LabChallengeWhereInput
  }

  /**
   * LabChallenge upsert
   */
  export type LabChallengeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabChallenge
     */
    select?: LabChallengeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabChallengeInclude<ExtArgs> | null
    /**
     * The filter to search for the LabChallenge to update in case it exists.
     */
    where: LabChallengeWhereUniqueInput
    /**
     * In case the LabChallenge found by the `where` argument doesn't exist, create a new LabChallenge with this data.
     */
    create: XOR<LabChallengeCreateInput, LabChallengeUncheckedCreateInput>
    /**
     * In case the LabChallenge was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LabChallengeUpdateInput, LabChallengeUncheckedUpdateInput>
  }

  /**
   * LabChallenge delete
   */
  export type LabChallengeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabChallenge
     */
    select?: LabChallengeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabChallengeInclude<ExtArgs> | null
    /**
     * Filter which LabChallenge to delete.
     */
    where: LabChallengeWhereUniqueInput
  }

  /**
   * LabChallenge deleteMany
   */
  export type LabChallengeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LabChallenges to delete
     */
    where?: LabChallengeWhereInput
  }

  /**
   * LabChallenge.sessions
   */
  export type LabChallenge$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabSession
     */
    select?: LabSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabSessionInclude<ExtArgs> | null
    where?: LabSessionWhereInput
    orderBy?: LabSessionOrderByWithRelationInput | LabSessionOrderByWithRelationInput[]
    cursor?: LabSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LabSessionScalarFieldEnum | LabSessionScalarFieldEnum[]
  }

  /**
   * LabChallenge without action
   */
  export type LabChallengeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabChallenge
     */
    select?: LabChallengeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabChallengeInclude<ExtArgs> | null
  }


  /**
   * Model LabSession
   */

  export type AggregateLabSession = {
    _count: LabSessionCountAggregateOutputType | null
    _min: LabSessionMinAggregateOutputType | null
    _max: LabSessionMaxAggregateOutputType | null
  }

  export type LabSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    challengeId: string | null
    status: string | null
    codeServerUrl: string | null
    codeServerToken: string | null
    appUrl: string | null
    containerId: string | null
    lastHeartbeat: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LabSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    challengeId: string | null
    status: string | null
    codeServerUrl: string | null
    codeServerToken: string | null
    appUrl: string | null
    containerId: string | null
    lastHeartbeat: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LabSessionCountAggregateOutputType = {
    id: number
    userId: number
    challengeId: number
    status: number
    codeServerUrl: number
    codeServerToken: number
    appUrl: number
    containerId: number
    lastHeartbeat: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LabSessionMinAggregateInputType = {
    id?: true
    userId?: true
    challengeId?: true
    status?: true
    codeServerUrl?: true
    codeServerToken?: true
    appUrl?: true
    containerId?: true
    lastHeartbeat?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LabSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    challengeId?: true
    status?: true
    codeServerUrl?: true
    codeServerToken?: true
    appUrl?: true
    containerId?: true
    lastHeartbeat?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LabSessionCountAggregateInputType = {
    id?: true
    userId?: true
    challengeId?: true
    status?: true
    codeServerUrl?: true
    codeServerToken?: true
    appUrl?: true
    containerId?: true
    lastHeartbeat?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LabSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LabSession to aggregate.
     */
    where?: LabSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabSessions to fetch.
     */
    orderBy?: LabSessionOrderByWithRelationInput | LabSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LabSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LabSessions
    **/
    _count?: true | LabSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LabSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LabSessionMaxAggregateInputType
  }

  export type GetLabSessionAggregateType<T extends LabSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateLabSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLabSession[P]>
      : GetScalarType<T[P], AggregateLabSession[P]>
  }




  export type LabSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LabSessionWhereInput
    orderBy?: LabSessionOrderByWithAggregationInput | LabSessionOrderByWithAggregationInput[]
    by: LabSessionScalarFieldEnum[] | LabSessionScalarFieldEnum
    having?: LabSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LabSessionCountAggregateInputType | true
    _min?: LabSessionMinAggregateInputType
    _max?: LabSessionMaxAggregateInputType
  }

  export type LabSessionGroupByOutputType = {
    id: string
    userId: string
    challengeId: string
    status: string
    codeServerUrl: string | null
    codeServerToken: string | null
    appUrl: string | null
    containerId: string | null
    lastHeartbeat: Date | null
    createdAt: Date
    updatedAt: Date
    _count: LabSessionCountAggregateOutputType | null
    _min: LabSessionMinAggregateOutputType | null
    _max: LabSessionMaxAggregateOutputType | null
  }

  type GetLabSessionGroupByPayload<T extends LabSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LabSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LabSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LabSessionGroupByOutputType[P]>
            : GetScalarType<T[P], LabSessionGroupByOutputType[P]>
        }
      >
    >


  export type LabSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    challengeId?: boolean
    status?: boolean
    codeServerUrl?: boolean
    codeServerToken?: boolean
    appUrl?: boolean
    containerId?: boolean
    lastHeartbeat?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    challenge?: boolean | LabChallengeDefaultArgs<ExtArgs>
    submissions?: boolean | LabSession$submissionsArgs<ExtArgs>
    workspaces?: boolean | LabSession$workspacesArgs<ExtArgs>
    _count?: boolean | LabSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["labSession"]>

  export type LabSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    challengeId?: boolean
    status?: boolean
    codeServerUrl?: boolean
    codeServerToken?: boolean
    appUrl?: boolean
    containerId?: boolean
    lastHeartbeat?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    challenge?: boolean | LabChallengeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["labSession"]>

  export type LabSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    challengeId?: boolean
    status?: boolean
    codeServerUrl?: boolean
    codeServerToken?: boolean
    appUrl?: boolean
    containerId?: boolean
    lastHeartbeat?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LabSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    challenge?: boolean | LabChallengeDefaultArgs<ExtArgs>
    submissions?: boolean | LabSession$submissionsArgs<ExtArgs>
    workspaces?: boolean | LabSession$workspacesArgs<ExtArgs>
    _count?: boolean | LabSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LabSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    challenge?: boolean | LabChallengeDefaultArgs<ExtArgs>
  }

  export type $LabSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LabSession"
    objects: {
      challenge: Prisma.$LabChallengePayload<ExtArgs>
      submissions: Prisma.$SubmissionPayload<ExtArgs>[]
      workspaces: Prisma.$LabWorkspacePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      challengeId: string
      status: string
      codeServerUrl: string | null
      codeServerToken: string | null
      appUrl: string | null
      containerId: string | null
      lastHeartbeat: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["labSession"]>
    composites: {}
  }

  type LabSessionGetPayload<S extends boolean | null | undefined | LabSessionDefaultArgs> = $Result.GetResult<Prisma.$LabSessionPayload, S>

  type LabSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LabSessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LabSessionCountAggregateInputType | true
    }

  export interface LabSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LabSession'], meta: { name: 'LabSession' } }
    /**
     * Find zero or one LabSession that matches the filter.
     * @param {LabSessionFindUniqueArgs} args - Arguments to find a LabSession
     * @example
     * // Get one LabSession
     * const labSession = await prisma.labSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends LabSessionFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, LabSessionFindUniqueArgs<ExtArgs>>
    ): Prisma__LabSessionClient<$Result.GetResult<Prisma.$LabSessionPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one LabSession that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LabSessionFindUniqueOrThrowArgs} args - Arguments to find a LabSession
     * @example
     * // Get one LabSession
     * const labSession = await prisma.labSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends LabSessionFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, LabSessionFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__LabSessionClient<$Result.GetResult<Prisma.$LabSessionPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first LabSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabSessionFindFirstArgs} args - Arguments to find a LabSession
     * @example
     * // Get one LabSession
     * const labSession = await prisma.labSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends LabSessionFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, LabSessionFindFirstArgs<ExtArgs>>
    ): Prisma__LabSessionClient<$Result.GetResult<Prisma.$LabSessionPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first LabSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabSessionFindFirstOrThrowArgs} args - Arguments to find a LabSession
     * @example
     * // Get one LabSession
     * const labSession = await prisma.labSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends LabSessionFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, LabSessionFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__LabSessionClient<$Result.GetResult<Prisma.$LabSessionPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more LabSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LabSessions
     * const labSessions = await prisma.labSession.findMany()
     * 
     * // Get first 10 LabSessions
     * const labSessions = await prisma.labSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const labSessionWithIdOnly = await prisma.labSession.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends LabSessionFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, LabSessionFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabSessionPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a LabSession.
     * @param {LabSessionCreateArgs} args - Arguments to create a LabSession.
     * @example
     * // Create one LabSession
     * const LabSession = await prisma.labSession.create({
     *   data: {
     *     // ... data to create a LabSession
     *   }
     * })
     * 
    **/
    create<T extends LabSessionCreateArgs<ExtArgs>>(
      args: SelectSubset<T, LabSessionCreateArgs<ExtArgs>>
    ): Prisma__LabSessionClient<$Result.GetResult<Prisma.$LabSessionPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many LabSessions.
     * @param {LabSessionCreateManyArgs} args - Arguments to create many LabSessions.
     * @example
     * // Create many LabSessions
     * const labSession = await prisma.labSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends LabSessionCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, LabSessionCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LabSessions and returns the data saved in the database.
     * @param {LabSessionCreateManyAndReturnArgs} args - Arguments to create many LabSessions.
     * @example
     * // Create many LabSessions
     * const labSession = await prisma.labSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LabSessions and only return the `id`
     * const labSessionWithIdOnly = await prisma.labSession.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends LabSessionCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, LabSessionCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabSessionPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a LabSession.
     * @param {LabSessionDeleteArgs} args - Arguments to delete one LabSession.
     * @example
     * // Delete one LabSession
     * const LabSession = await prisma.labSession.delete({
     *   where: {
     *     // ... filter to delete one LabSession
     *   }
     * })
     * 
    **/
    delete<T extends LabSessionDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, LabSessionDeleteArgs<ExtArgs>>
    ): Prisma__LabSessionClient<$Result.GetResult<Prisma.$LabSessionPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one LabSession.
     * @param {LabSessionUpdateArgs} args - Arguments to update one LabSession.
     * @example
     * // Update one LabSession
     * const labSession = await prisma.labSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends LabSessionUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, LabSessionUpdateArgs<ExtArgs>>
    ): Prisma__LabSessionClient<$Result.GetResult<Prisma.$LabSessionPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more LabSessions.
     * @param {LabSessionDeleteManyArgs} args - Arguments to filter LabSessions to delete.
     * @example
     * // Delete a few LabSessions
     * const { count } = await prisma.labSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends LabSessionDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, LabSessionDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LabSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LabSessions
     * const labSession = await prisma.labSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends LabSessionUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, LabSessionUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LabSession.
     * @param {LabSessionUpsertArgs} args - Arguments to update or create a LabSession.
     * @example
     * // Update or create a LabSession
     * const labSession = await prisma.labSession.upsert({
     *   create: {
     *     // ... data to create a LabSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LabSession we want to update
     *   }
     * })
    **/
    upsert<T extends LabSessionUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, LabSessionUpsertArgs<ExtArgs>>
    ): Prisma__LabSessionClient<$Result.GetResult<Prisma.$LabSessionPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of LabSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabSessionCountArgs} args - Arguments to filter LabSessions to count.
     * @example
     * // Count the number of LabSessions
     * const count = await prisma.labSession.count({
     *   where: {
     *     // ... the filter for the LabSessions we want to count
     *   }
     * })
    **/
    count<T extends LabSessionCountArgs>(
      args?: Subset<T, LabSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LabSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LabSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LabSessionAggregateArgs>(args: Subset<T, LabSessionAggregateArgs>): Prisma.PrismaPromise<GetLabSessionAggregateType<T>>

    /**
     * Group by LabSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LabSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LabSessionGroupByArgs['orderBy'] }
        : { orderBy?: LabSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LabSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLabSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LabSession model
   */
  readonly fields: LabSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LabSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LabSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    challenge<T extends LabChallengeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LabChallengeDefaultArgs<ExtArgs>>): Prisma__LabChallengeClient<$Result.GetResult<Prisma.$LabChallengePayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    submissions<T extends LabSession$submissionsArgs<ExtArgs> = {}>(args?: Subset<T, LabSession$submissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, 'findMany'> | Null>;

    workspaces<T extends LabSession$workspacesArgs<ExtArgs> = {}>(args?: Subset<T, LabSession$workspacesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabWorkspacePayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the LabSession model
   */ 
  interface LabSessionFieldRefs {
    readonly id: FieldRef<"LabSession", 'String'>
    readonly userId: FieldRef<"LabSession", 'String'>
    readonly challengeId: FieldRef<"LabSession", 'String'>
    readonly status: FieldRef<"LabSession", 'String'>
    readonly codeServerUrl: FieldRef<"LabSession", 'String'>
    readonly codeServerToken: FieldRef<"LabSession", 'String'>
    readonly appUrl: FieldRef<"LabSession", 'String'>
    readonly containerId: FieldRef<"LabSession", 'String'>
    readonly lastHeartbeat: FieldRef<"LabSession", 'DateTime'>
    readonly createdAt: FieldRef<"LabSession", 'DateTime'>
    readonly updatedAt: FieldRef<"LabSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LabSession findUnique
   */
  export type LabSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabSession
     */
    select?: LabSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabSessionInclude<ExtArgs> | null
    /**
     * Filter, which LabSession to fetch.
     */
    where: LabSessionWhereUniqueInput
  }

  /**
   * LabSession findUniqueOrThrow
   */
  export type LabSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabSession
     */
    select?: LabSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabSessionInclude<ExtArgs> | null
    /**
     * Filter, which LabSession to fetch.
     */
    where: LabSessionWhereUniqueInput
  }

  /**
   * LabSession findFirst
   */
  export type LabSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabSession
     */
    select?: LabSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabSessionInclude<ExtArgs> | null
    /**
     * Filter, which LabSession to fetch.
     */
    where?: LabSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabSessions to fetch.
     */
    orderBy?: LabSessionOrderByWithRelationInput | LabSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LabSessions.
     */
    cursor?: LabSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LabSessions.
     */
    distinct?: LabSessionScalarFieldEnum | LabSessionScalarFieldEnum[]
  }

  /**
   * LabSession findFirstOrThrow
   */
  export type LabSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabSession
     */
    select?: LabSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabSessionInclude<ExtArgs> | null
    /**
     * Filter, which LabSession to fetch.
     */
    where?: LabSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabSessions to fetch.
     */
    orderBy?: LabSessionOrderByWithRelationInput | LabSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LabSessions.
     */
    cursor?: LabSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LabSessions.
     */
    distinct?: LabSessionScalarFieldEnum | LabSessionScalarFieldEnum[]
  }

  /**
   * LabSession findMany
   */
  export type LabSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabSession
     */
    select?: LabSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabSessionInclude<ExtArgs> | null
    /**
     * Filter, which LabSessions to fetch.
     */
    where?: LabSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabSessions to fetch.
     */
    orderBy?: LabSessionOrderByWithRelationInput | LabSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LabSessions.
     */
    cursor?: LabSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabSessions.
     */
    skip?: number
    distinct?: LabSessionScalarFieldEnum | LabSessionScalarFieldEnum[]
  }

  /**
   * LabSession create
   */
  export type LabSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabSession
     */
    select?: LabSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a LabSession.
     */
    data: XOR<LabSessionCreateInput, LabSessionUncheckedCreateInput>
  }

  /**
   * LabSession createMany
   */
  export type LabSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LabSessions.
     */
    data: LabSessionCreateManyInput | LabSessionCreateManyInput[]
  }

  /**
   * LabSession createManyAndReturn
   */
  export type LabSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabSession
     */
    select?: LabSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many LabSessions.
     */
    data: LabSessionCreateManyInput | LabSessionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LabSession update
   */
  export type LabSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabSession
     */
    select?: LabSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a LabSession.
     */
    data: XOR<LabSessionUpdateInput, LabSessionUncheckedUpdateInput>
    /**
     * Choose, which LabSession to update.
     */
    where: LabSessionWhereUniqueInput
  }

  /**
   * LabSession updateMany
   */
  export type LabSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LabSessions.
     */
    data: XOR<LabSessionUpdateManyMutationInput, LabSessionUncheckedUpdateManyInput>
    /**
     * Filter which LabSessions to update
     */
    where?: LabSessionWhereInput
  }

  /**
   * LabSession upsert
   */
  export type LabSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabSession
     */
    select?: LabSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the LabSession to update in case it exists.
     */
    where: LabSessionWhereUniqueInput
    /**
     * In case the LabSession found by the `where` argument doesn't exist, create a new LabSession with this data.
     */
    create: XOR<LabSessionCreateInput, LabSessionUncheckedCreateInput>
    /**
     * In case the LabSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LabSessionUpdateInput, LabSessionUncheckedUpdateInput>
  }

  /**
   * LabSession delete
   */
  export type LabSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabSession
     */
    select?: LabSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabSessionInclude<ExtArgs> | null
    /**
     * Filter which LabSession to delete.
     */
    where: LabSessionWhereUniqueInput
  }

  /**
   * LabSession deleteMany
   */
  export type LabSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LabSessions to delete
     */
    where?: LabSessionWhereInput
  }

  /**
   * LabSession.submissions
   */
  export type LabSession$submissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    where?: SubmissionWhereInput
    orderBy?: SubmissionOrderByWithRelationInput | SubmissionOrderByWithRelationInput[]
    cursor?: SubmissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubmissionScalarFieldEnum | SubmissionScalarFieldEnum[]
  }

  /**
   * LabSession.workspaces
   */
  export type LabSession$workspacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabWorkspace
     */
    select?: LabWorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabWorkspaceInclude<ExtArgs> | null
    where?: LabWorkspaceWhereInput
    orderBy?: LabWorkspaceOrderByWithRelationInput | LabWorkspaceOrderByWithRelationInput[]
    cursor?: LabWorkspaceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LabWorkspaceScalarFieldEnum | LabWorkspaceScalarFieldEnum[]
  }

  /**
   * LabSession without action
   */
  export type LabSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabSession
     */
    select?: LabSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabSessionInclude<ExtArgs> | null
  }


  /**
   * Model LabWorkspace
   */

  export type AggregateLabWorkspace = {
    _count: LabWorkspaceCountAggregateOutputType | null
    _min: LabWorkspaceMinAggregateOutputType | null
    _max: LabWorkspaceMaxAggregateOutputType | null
  }

  export type LabWorkspaceMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    path: string | null
    repoUrl: string | null
    branch: string | null
  }

  export type LabWorkspaceMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    path: string | null
    repoUrl: string | null
    branch: string | null
  }

  export type LabWorkspaceCountAggregateOutputType = {
    id: number
    sessionId: number
    path: number
    repoUrl: number
    branch: number
    _all: number
  }


  export type LabWorkspaceMinAggregateInputType = {
    id?: true
    sessionId?: true
    path?: true
    repoUrl?: true
    branch?: true
  }

  export type LabWorkspaceMaxAggregateInputType = {
    id?: true
    sessionId?: true
    path?: true
    repoUrl?: true
    branch?: true
  }

  export type LabWorkspaceCountAggregateInputType = {
    id?: true
    sessionId?: true
    path?: true
    repoUrl?: true
    branch?: true
    _all?: true
  }

  export type LabWorkspaceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LabWorkspace to aggregate.
     */
    where?: LabWorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabWorkspaces to fetch.
     */
    orderBy?: LabWorkspaceOrderByWithRelationInput | LabWorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LabWorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabWorkspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabWorkspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LabWorkspaces
    **/
    _count?: true | LabWorkspaceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LabWorkspaceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LabWorkspaceMaxAggregateInputType
  }

  export type GetLabWorkspaceAggregateType<T extends LabWorkspaceAggregateArgs> = {
        [P in keyof T & keyof AggregateLabWorkspace]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLabWorkspace[P]>
      : GetScalarType<T[P], AggregateLabWorkspace[P]>
  }




  export type LabWorkspaceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LabWorkspaceWhereInput
    orderBy?: LabWorkspaceOrderByWithAggregationInput | LabWorkspaceOrderByWithAggregationInput[]
    by: LabWorkspaceScalarFieldEnum[] | LabWorkspaceScalarFieldEnum
    having?: LabWorkspaceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LabWorkspaceCountAggregateInputType | true
    _min?: LabWorkspaceMinAggregateInputType
    _max?: LabWorkspaceMaxAggregateInputType
  }

  export type LabWorkspaceGroupByOutputType = {
    id: string
    sessionId: string
    path: string
    repoUrl: string | null
    branch: string | null
    _count: LabWorkspaceCountAggregateOutputType | null
    _min: LabWorkspaceMinAggregateOutputType | null
    _max: LabWorkspaceMaxAggregateOutputType | null
  }

  type GetLabWorkspaceGroupByPayload<T extends LabWorkspaceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LabWorkspaceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LabWorkspaceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LabWorkspaceGroupByOutputType[P]>
            : GetScalarType<T[P], LabWorkspaceGroupByOutputType[P]>
        }
      >
    >


  export type LabWorkspaceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    path?: boolean
    repoUrl?: boolean
    branch?: boolean
    session?: boolean | LabSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["labWorkspace"]>

  export type LabWorkspaceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    path?: boolean
    repoUrl?: boolean
    branch?: boolean
    session?: boolean | LabSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["labWorkspace"]>

  export type LabWorkspaceSelectScalar = {
    id?: boolean
    sessionId?: boolean
    path?: boolean
    repoUrl?: boolean
    branch?: boolean
  }

  export type LabWorkspaceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | LabSessionDefaultArgs<ExtArgs>
  }
  export type LabWorkspaceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | LabSessionDefaultArgs<ExtArgs>
  }

  export type $LabWorkspacePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LabWorkspace"
    objects: {
      session: Prisma.$LabSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      path: string
      repoUrl: string | null
      branch: string | null
    }, ExtArgs["result"]["labWorkspace"]>
    composites: {}
  }

  type LabWorkspaceGetPayload<S extends boolean | null | undefined | LabWorkspaceDefaultArgs> = $Result.GetResult<Prisma.$LabWorkspacePayload, S>

  type LabWorkspaceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LabWorkspaceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LabWorkspaceCountAggregateInputType | true
    }

  export interface LabWorkspaceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LabWorkspace'], meta: { name: 'LabWorkspace' } }
    /**
     * Find zero or one LabWorkspace that matches the filter.
     * @param {LabWorkspaceFindUniqueArgs} args - Arguments to find a LabWorkspace
     * @example
     * // Get one LabWorkspace
     * const labWorkspace = await prisma.labWorkspace.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends LabWorkspaceFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, LabWorkspaceFindUniqueArgs<ExtArgs>>
    ): Prisma__LabWorkspaceClient<$Result.GetResult<Prisma.$LabWorkspacePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one LabWorkspace that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LabWorkspaceFindUniqueOrThrowArgs} args - Arguments to find a LabWorkspace
     * @example
     * // Get one LabWorkspace
     * const labWorkspace = await prisma.labWorkspace.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends LabWorkspaceFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, LabWorkspaceFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__LabWorkspaceClient<$Result.GetResult<Prisma.$LabWorkspacePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first LabWorkspace that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabWorkspaceFindFirstArgs} args - Arguments to find a LabWorkspace
     * @example
     * // Get one LabWorkspace
     * const labWorkspace = await prisma.labWorkspace.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends LabWorkspaceFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, LabWorkspaceFindFirstArgs<ExtArgs>>
    ): Prisma__LabWorkspaceClient<$Result.GetResult<Prisma.$LabWorkspacePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first LabWorkspace that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabWorkspaceFindFirstOrThrowArgs} args - Arguments to find a LabWorkspace
     * @example
     * // Get one LabWorkspace
     * const labWorkspace = await prisma.labWorkspace.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends LabWorkspaceFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, LabWorkspaceFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__LabWorkspaceClient<$Result.GetResult<Prisma.$LabWorkspacePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more LabWorkspaces that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabWorkspaceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LabWorkspaces
     * const labWorkspaces = await prisma.labWorkspace.findMany()
     * 
     * // Get first 10 LabWorkspaces
     * const labWorkspaces = await prisma.labWorkspace.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const labWorkspaceWithIdOnly = await prisma.labWorkspace.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends LabWorkspaceFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, LabWorkspaceFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabWorkspacePayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a LabWorkspace.
     * @param {LabWorkspaceCreateArgs} args - Arguments to create a LabWorkspace.
     * @example
     * // Create one LabWorkspace
     * const LabWorkspace = await prisma.labWorkspace.create({
     *   data: {
     *     // ... data to create a LabWorkspace
     *   }
     * })
     * 
    **/
    create<T extends LabWorkspaceCreateArgs<ExtArgs>>(
      args: SelectSubset<T, LabWorkspaceCreateArgs<ExtArgs>>
    ): Prisma__LabWorkspaceClient<$Result.GetResult<Prisma.$LabWorkspacePayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many LabWorkspaces.
     * @param {LabWorkspaceCreateManyArgs} args - Arguments to create many LabWorkspaces.
     * @example
     * // Create many LabWorkspaces
     * const labWorkspace = await prisma.labWorkspace.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends LabWorkspaceCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, LabWorkspaceCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LabWorkspaces and returns the data saved in the database.
     * @param {LabWorkspaceCreateManyAndReturnArgs} args - Arguments to create many LabWorkspaces.
     * @example
     * // Create many LabWorkspaces
     * const labWorkspace = await prisma.labWorkspace.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LabWorkspaces and only return the `id`
     * const labWorkspaceWithIdOnly = await prisma.labWorkspace.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends LabWorkspaceCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, LabWorkspaceCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabWorkspacePayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a LabWorkspace.
     * @param {LabWorkspaceDeleteArgs} args - Arguments to delete one LabWorkspace.
     * @example
     * // Delete one LabWorkspace
     * const LabWorkspace = await prisma.labWorkspace.delete({
     *   where: {
     *     // ... filter to delete one LabWorkspace
     *   }
     * })
     * 
    **/
    delete<T extends LabWorkspaceDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, LabWorkspaceDeleteArgs<ExtArgs>>
    ): Prisma__LabWorkspaceClient<$Result.GetResult<Prisma.$LabWorkspacePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one LabWorkspace.
     * @param {LabWorkspaceUpdateArgs} args - Arguments to update one LabWorkspace.
     * @example
     * // Update one LabWorkspace
     * const labWorkspace = await prisma.labWorkspace.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends LabWorkspaceUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, LabWorkspaceUpdateArgs<ExtArgs>>
    ): Prisma__LabWorkspaceClient<$Result.GetResult<Prisma.$LabWorkspacePayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more LabWorkspaces.
     * @param {LabWorkspaceDeleteManyArgs} args - Arguments to filter LabWorkspaces to delete.
     * @example
     * // Delete a few LabWorkspaces
     * const { count } = await prisma.labWorkspace.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends LabWorkspaceDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, LabWorkspaceDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LabWorkspaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabWorkspaceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LabWorkspaces
     * const labWorkspace = await prisma.labWorkspace.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends LabWorkspaceUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, LabWorkspaceUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LabWorkspace.
     * @param {LabWorkspaceUpsertArgs} args - Arguments to update or create a LabWorkspace.
     * @example
     * // Update or create a LabWorkspace
     * const labWorkspace = await prisma.labWorkspace.upsert({
     *   create: {
     *     // ... data to create a LabWorkspace
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LabWorkspace we want to update
     *   }
     * })
    **/
    upsert<T extends LabWorkspaceUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, LabWorkspaceUpsertArgs<ExtArgs>>
    ): Prisma__LabWorkspaceClient<$Result.GetResult<Prisma.$LabWorkspacePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of LabWorkspaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabWorkspaceCountArgs} args - Arguments to filter LabWorkspaces to count.
     * @example
     * // Count the number of LabWorkspaces
     * const count = await prisma.labWorkspace.count({
     *   where: {
     *     // ... the filter for the LabWorkspaces we want to count
     *   }
     * })
    **/
    count<T extends LabWorkspaceCountArgs>(
      args?: Subset<T, LabWorkspaceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LabWorkspaceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LabWorkspace.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabWorkspaceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LabWorkspaceAggregateArgs>(args: Subset<T, LabWorkspaceAggregateArgs>): Prisma.PrismaPromise<GetLabWorkspaceAggregateType<T>>

    /**
     * Group by LabWorkspace.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabWorkspaceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LabWorkspaceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LabWorkspaceGroupByArgs['orderBy'] }
        : { orderBy?: LabWorkspaceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LabWorkspaceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLabWorkspaceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LabWorkspace model
   */
  readonly fields: LabWorkspaceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LabWorkspace.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LabWorkspaceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    session<T extends LabSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LabSessionDefaultArgs<ExtArgs>>): Prisma__LabSessionClient<$Result.GetResult<Prisma.$LabSessionPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the LabWorkspace model
   */ 
  interface LabWorkspaceFieldRefs {
    readonly id: FieldRef<"LabWorkspace", 'String'>
    readonly sessionId: FieldRef<"LabWorkspace", 'String'>
    readonly path: FieldRef<"LabWorkspace", 'String'>
    readonly repoUrl: FieldRef<"LabWorkspace", 'String'>
    readonly branch: FieldRef<"LabWorkspace", 'String'>
  }
    

  // Custom InputTypes
  /**
   * LabWorkspace findUnique
   */
  export type LabWorkspaceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabWorkspace
     */
    select?: LabWorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabWorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which LabWorkspace to fetch.
     */
    where: LabWorkspaceWhereUniqueInput
  }

  /**
   * LabWorkspace findUniqueOrThrow
   */
  export type LabWorkspaceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabWorkspace
     */
    select?: LabWorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabWorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which LabWorkspace to fetch.
     */
    where: LabWorkspaceWhereUniqueInput
  }

  /**
   * LabWorkspace findFirst
   */
  export type LabWorkspaceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabWorkspace
     */
    select?: LabWorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabWorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which LabWorkspace to fetch.
     */
    where?: LabWorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabWorkspaces to fetch.
     */
    orderBy?: LabWorkspaceOrderByWithRelationInput | LabWorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LabWorkspaces.
     */
    cursor?: LabWorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabWorkspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabWorkspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LabWorkspaces.
     */
    distinct?: LabWorkspaceScalarFieldEnum | LabWorkspaceScalarFieldEnum[]
  }

  /**
   * LabWorkspace findFirstOrThrow
   */
  export type LabWorkspaceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabWorkspace
     */
    select?: LabWorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabWorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which LabWorkspace to fetch.
     */
    where?: LabWorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabWorkspaces to fetch.
     */
    orderBy?: LabWorkspaceOrderByWithRelationInput | LabWorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LabWorkspaces.
     */
    cursor?: LabWorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabWorkspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabWorkspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LabWorkspaces.
     */
    distinct?: LabWorkspaceScalarFieldEnum | LabWorkspaceScalarFieldEnum[]
  }

  /**
   * LabWorkspace findMany
   */
  export type LabWorkspaceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabWorkspace
     */
    select?: LabWorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabWorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which LabWorkspaces to fetch.
     */
    where?: LabWorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabWorkspaces to fetch.
     */
    orderBy?: LabWorkspaceOrderByWithRelationInput | LabWorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LabWorkspaces.
     */
    cursor?: LabWorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabWorkspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabWorkspaces.
     */
    skip?: number
    distinct?: LabWorkspaceScalarFieldEnum | LabWorkspaceScalarFieldEnum[]
  }

  /**
   * LabWorkspace create
   */
  export type LabWorkspaceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabWorkspace
     */
    select?: LabWorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabWorkspaceInclude<ExtArgs> | null
    /**
     * The data needed to create a LabWorkspace.
     */
    data: XOR<LabWorkspaceCreateInput, LabWorkspaceUncheckedCreateInput>
  }

  /**
   * LabWorkspace createMany
   */
  export type LabWorkspaceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LabWorkspaces.
     */
    data: LabWorkspaceCreateManyInput | LabWorkspaceCreateManyInput[]
  }

  /**
   * LabWorkspace createManyAndReturn
   */
  export type LabWorkspaceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabWorkspace
     */
    select?: LabWorkspaceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many LabWorkspaces.
     */
    data: LabWorkspaceCreateManyInput | LabWorkspaceCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabWorkspaceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LabWorkspace update
   */
  export type LabWorkspaceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabWorkspace
     */
    select?: LabWorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabWorkspaceInclude<ExtArgs> | null
    /**
     * The data needed to update a LabWorkspace.
     */
    data: XOR<LabWorkspaceUpdateInput, LabWorkspaceUncheckedUpdateInput>
    /**
     * Choose, which LabWorkspace to update.
     */
    where: LabWorkspaceWhereUniqueInput
  }

  /**
   * LabWorkspace updateMany
   */
  export type LabWorkspaceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LabWorkspaces.
     */
    data: XOR<LabWorkspaceUpdateManyMutationInput, LabWorkspaceUncheckedUpdateManyInput>
    /**
     * Filter which LabWorkspaces to update
     */
    where?: LabWorkspaceWhereInput
  }

  /**
   * LabWorkspace upsert
   */
  export type LabWorkspaceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabWorkspace
     */
    select?: LabWorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabWorkspaceInclude<ExtArgs> | null
    /**
     * The filter to search for the LabWorkspace to update in case it exists.
     */
    where: LabWorkspaceWhereUniqueInput
    /**
     * In case the LabWorkspace found by the `where` argument doesn't exist, create a new LabWorkspace with this data.
     */
    create: XOR<LabWorkspaceCreateInput, LabWorkspaceUncheckedCreateInput>
    /**
     * In case the LabWorkspace was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LabWorkspaceUpdateInput, LabWorkspaceUncheckedUpdateInput>
  }

  /**
   * LabWorkspace delete
   */
  export type LabWorkspaceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabWorkspace
     */
    select?: LabWorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabWorkspaceInclude<ExtArgs> | null
    /**
     * Filter which LabWorkspace to delete.
     */
    where: LabWorkspaceWhereUniqueInput
  }

  /**
   * LabWorkspace deleteMany
   */
  export type LabWorkspaceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LabWorkspaces to delete
     */
    where?: LabWorkspaceWhereInput
  }

  /**
   * LabWorkspace without action
   */
  export type LabWorkspaceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabWorkspace
     */
    select?: LabWorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabWorkspaceInclude<ExtArgs> | null
  }


  /**
   * Model Submission
   */

  export type AggregateSubmission = {
    _count: SubmissionCountAggregateOutputType | null
    _avg: SubmissionAvgAggregateOutputType | null
    _sum: SubmissionSumAggregateOutputType | null
    _min: SubmissionMinAggregateOutputType | null
    _max: SubmissionMaxAggregateOutputType | null
  }

  export type SubmissionAvgAggregateOutputType = {
    gradePct: number | null
  }

  export type SubmissionSumAggregateOutputType = {
    gradePct: number | null
  }

  export type SubmissionMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    status: string | null
    passed: boolean | null
    gradePct: number | null
    feedback: string | null
    artifactsUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubmissionMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    status: string | null
    passed: boolean | null
    gradePct: number | null
    feedback: string | null
    artifactsUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubmissionCountAggregateOutputType = {
    id: number
    sessionId: number
    status: number
    passed: number
    gradePct: number
    feedback: number
    artifactsUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SubmissionAvgAggregateInputType = {
    gradePct?: true
  }

  export type SubmissionSumAggregateInputType = {
    gradePct?: true
  }

  export type SubmissionMinAggregateInputType = {
    id?: true
    sessionId?: true
    status?: true
    passed?: true
    gradePct?: true
    feedback?: true
    artifactsUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubmissionMaxAggregateInputType = {
    id?: true
    sessionId?: true
    status?: true
    passed?: true
    gradePct?: true
    feedback?: true
    artifactsUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubmissionCountAggregateInputType = {
    id?: true
    sessionId?: true
    status?: true
    passed?: true
    gradePct?: true
    feedback?: true
    artifactsUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SubmissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Submission to aggregate.
     */
    where?: SubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Submissions to fetch.
     */
    orderBy?: SubmissionOrderByWithRelationInput | SubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Submissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Submissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Submissions
    **/
    _count?: true | SubmissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubmissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubmissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubmissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubmissionMaxAggregateInputType
  }

  export type GetSubmissionAggregateType<T extends SubmissionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubmission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubmission[P]>
      : GetScalarType<T[P], AggregateSubmission[P]>
  }




  export type SubmissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubmissionWhereInput
    orderBy?: SubmissionOrderByWithAggregationInput | SubmissionOrderByWithAggregationInput[]
    by: SubmissionScalarFieldEnum[] | SubmissionScalarFieldEnum
    having?: SubmissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubmissionCountAggregateInputType | true
    _avg?: SubmissionAvgAggregateInputType
    _sum?: SubmissionSumAggregateInputType
    _min?: SubmissionMinAggregateInputType
    _max?: SubmissionMaxAggregateInputType
  }

  export type SubmissionGroupByOutputType = {
    id: string
    sessionId: string
    status: string
    passed: boolean
    gradePct: number | null
    feedback: string | null
    artifactsUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: SubmissionCountAggregateOutputType | null
    _avg: SubmissionAvgAggregateOutputType | null
    _sum: SubmissionSumAggregateOutputType | null
    _min: SubmissionMinAggregateOutputType | null
    _max: SubmissionMaxAggregateOutputType | null
  }

  type GetSubmissionGroupByPayload<T extends SubmissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubmissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubmissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubmissionGroupByOutputType[P]>
            : GetScalarType<T[P], SubmissionGroupByOutputType[P]>
        }
      >
    >


  export type SubmissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    status?: boolean
    passed?: boolean
    gradePct?: boolean
    feedback?: boolean
    artifactsUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | LabSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["submission"]>

  export type SubmissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    status?: boolean
    passed?: boolean
    gradePct?: boolean
    feedback?: boolean
    artifactsUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | LabSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["submission"]>

  export type SubmissionSelectScalar = {
    id?: boolean
    sessionId?: boolean
    status?: boolean
    passed?: boolean
    gradePct?: boolean
    feedback?: boolean
    artifactsUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SubmissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | LabSessionDefaultArgs<ExtArgs>
  }
  export type SubmissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | LabSessionDefaultArgs<ExtArgs>
  }

  export type $SubmissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Submission"
    objects: {
      session: Prisma.$LabSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      status: string
      passed: boolean
      gradePct: number | null
      feedback: string | null
      artifactsUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["submission"]>
    composites: {}
  }

  type SubmissionGetPayload<S extends boolean | null | undefined | SubmissionDefaultArgs> = $Result.GetResult<Prisma.$SubmissionPayload, S>

  type SubmissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SubmissionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SubmissionCountAggregateInputType | true
    }

  export interface SubmissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Submission'], meta: { name: 'Submission' } }
    /**
     * Find zero or one Submission that matches the filter.
     * @param {SubmissionFindUniqueArgs} args - Arguments to find a Submission
     * @example
     * // Get one Submission
     * const submission = await prisma.submission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends SubmissionFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, SubmissionFindUniqueArgs<ExtArgs>>
    ): Prisma__SubmissionClient<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Submission that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SubmissionFindUniqueOrThrowArgs} args - Arguments to find a Submission
     * @example
     * // Get one Submission
     * const submission = await prisma.submission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends SubmissionFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SubmissionFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SubmissionClient<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Submission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionFindFirstArgs} args - Arguments to find a Submission
     * @example
     * // Get one Submission
     * const submission = await prisma.submission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends SubmissionFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, SubmissionFindFirstArgs<ExtArgs>>
    ): Prisma__SubmissionClient<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Submission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionFindFirstOrThrowArgs} args - Arguments to find a Submission
     * @example
     * // Get one Submission
     * const submission = await prisma.submission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends SubmissionFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SubmissionFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SubmissionClient<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Submissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Submissions
     * const submissions = await prisma.submission.findMany()
     * 
     * // Get first 10 Submissions
     * const submissions = await prisma.submission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const submissionWithIdOnly = await prisma.submission.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends SubmissionFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubmissionFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Submission.
     * @param {SubmissionCreateArgs} args - Arguments to create a Submission.
     * @example
     * // Create one Submission
     * const Submission = await prisma.submission.create({
     *   data: {
     *     // ... data to create a Submission
     *   }
     * })
     * 
    **/
    create<T extends SubmissionCreateArgs<ExtArgs>>(
      args: SelectSubset<T, SubmissionCreateArgs<ExtArgs>>
    ): Prisma__SubmissionClient<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Submissions.
     * @param {SubmissionCreateManyArgs} args - Arguments to create many Submissions.
     * @example
     * // Create many Submissions
     * const submission = await prisma.submission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends SubmissionCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubmissionCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Submissions and returns the data saved in the database.
     * @param {SubmissionCreateManyAndReturnArgs} args - Arguments to create many Submissions.
     * @example
     * // Create many Submissions
     * const submission = await prisma.submission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Submissions and only return the `id`
     * const submissionWithIdOnly = await prisma.submission.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends SubmissionCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, SubmissionCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a Submission.
     * @param {SubmissionDeleteArgs} args - Arguments to delete one Submission.
     * @example
     * // Delete one Submission
     * const Submission = await prisma.submission.delete({
     *   where: {
     *     // ... filter to delete one Submission
     *   }
     * })
     * 
    **/
    delete<T extends SubmissionDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, SubmissionDeleteArgs<ExtArgs>>
    ): Prisma__SubmissionClient<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Submission.
     * @param {SubmissionUpdateArgs} args - Arguments to update one Submission.
     * @example
     * // Update one Submission
     * const submission = await prisma.submission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends SubmissionUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, SubmissionUpdateArgs<ExtArgs>>
    ): Prisma__SubmissionClient<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Submissions.
     * @param {SubmissionDeleteManyArgs} args - Arguments to filter Submissions to delete.
     * @example
     * // Delete a few Submissions
     * const { count } = await prisma.submission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends SubmissionDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubmissionDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Submissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Submissions
     * const submission = await prisma.submission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends SubmissionUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, SubmissionUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Submission.
     * @param {SubmissionUpsertArgs} args - Arguments to update or create a Submission.
     * @example
     * // Update or create a Submission
     * const submission = await prisma.submission.upsert({
     *   create: {
     *     // ... data to create a Submission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Submission we want to update
     *   }
     * })
    **/
    upsert<T extends SubmissionUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, SubmissionUpsertArgs<ExtArgs>>
    ): Prisma__SubmissionClient<$Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Submissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionCountArgs} args - Arguments to filter Submissions to count.
     * @example
     * // Count the number of Submissions
     * const count = await prisma.submission.count({
     *   where: {
     *     // ... the filter for the Submissions we want to count
     *   }
     * })
    **/
    count<T extends SubmissionCountArgs>(
      args?: Subset<T, SubmissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubmissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Submission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubmissionAggregateArgs>(args: Subset<T, SubmissionAggregateArgs>): Prisma.PrismaPromise<GetSubmissionAggregateType<T>>

    /**
     * Group by Submission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubmissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubmissionGroupByArgs['orderBy'] }
        : { orderBy?: SubmissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubmissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubmissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Submission model
   */
  readonly fields: SubmissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Submission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubmissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    session<T extends LabSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LabSessionDefaultArgs<ExtArgs>>): Prisma__LabSessionClient<$Result.GetResult<Prisma.$LabSessionPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the Submission model
   */ 
  interface SubmissionFieldRefs {
    readonly id: FieldRef<"Submission", 'String'>
    readonly sessionId: FieldRef<"Submission", 'String'>
    readonly status: FieldRef<"Submission", 'String'>
    readonly passed: FieldRef<"Submission", 'Boolean'>
    readonly gradePct: FieldRef<"Submission", 'Float'>
    readonly feedback: FieldRef<"Submission", 'String'>
    readonly artifactsUrl: FieldRef<"Submission", 'String'>
    readonly createdAt: FieldRef<"Submission", 'DateTime'>
    readonly updatedAt: FieldRef<"Submission", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Submission findUnique
   */
  export type SubmissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    /**
     * Filter, which Submission to fetch.
     */
    where: SubmissionWhereUniqueInput
  }

  /**
   * Submission findUniqueOrThrow
   */
  export type SubmissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    /**
     * Filter, which Submission to fetch.
     */
    where: SubmissionWhereUniqueInput
  }

  /**
   * Submission findFirst
   */
  export type SubmissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    /**
     * Filter, which Submission to fetch.
     */
    where?: SubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Submissions to fetch.
     */
    orderBy?: SubmissionOrderByWithRelationInput | SubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Submissions.
     */
    cursor?: SubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Submissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Submissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Submissions.
     */
    distinct?: SubmissionScalarFieldEnum | SubmissionScalarFieldEnum[]
  }

  /**
   * Submission findFirstOrThrow
   */
  export type SubmissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    /**
     * Filter, which Submission to fetch.
     */
    where?: SubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Submissions to fetch.
     */
    orderBy?: SubmissionOrderByWithRelationInput | SubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Submissions.
     */
    cursor?: SubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Submissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Submissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Submissions.
     */
    distinct?: SubmissionScalarFieldEnum | SubmissionScalarFieldEnum[]
  }

  /**
   * Submission findMany
   */
  export type SubmissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    /**
     * Filter, which Submissions to fetch.
     */
    where?: SubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Submissions to fetch.
     */
    orderBy?: SubmissionOrderByWithRelationInput | SubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Submissions.
     */
    cursor?: SubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Submissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Submissions.
     */
    skip?: number
    distinct?: SubmissionScalarFieldEnum | SubmissionScalarFieldEnum[]
  }

  /**
   * Submission create
   */
  export type SubmissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    /**
     * The data needed to create a Submission.
     */
    data: XOR<SubmissionCreateInput, SubmissionUncheckedCreateInput>
  }

  /**
   * Submission createMany
   */
  export type SubmissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Submissions.
     */
    data: SubmissionCreateManyInput | SubmissionCreateManyInput[]
  }

  /**
   * Submission createManyAndReturn
   */
  export type SubmissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Submissions.
     */
    data: SubmissionCreateManyInput | SubmissionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Submission update
   */
  export type SubmissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    /**
     * The data needed to update a Submission.
     */
    data: XOR<SubmissionUpdateInput, SubmissionUncheckedUpdateInput>
    /**
     * Choose, which Submission to update.
     */
    where: SubmissionWhereUniqueInput
  }

  /**
   * Submission updateMany
   */
  export type SubmissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Submissions.
     */
    data: XOR<SubmissionUpdateManyMutationInput, SubmissionUncheckedUpdateManyInput>
    /**
     * Filter which Submissions to update
     */
    where?: SubmissionWhereInput
  }

  /**
   * Submission upsert
   */
  export type SubmissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    /**
     * The filter to search for the Submission to update in case it exists.
     */
    where: SubmissionWhereUniqueInput
    /**
     * In case the Submission found by the `where` argument doesn't exist, create a new Submission with this data.
     */
    create: XOR<SubmissionCreateInput, SubmissionUncheckedCreateInput>
    /**
     * In case the Submission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubmissionUpdateInput, SubmissionUncheckedUpdateInput>
  }

  /**
   * Submission delete
   */
  export type SubmissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
    /**
     * Filter which Submission to delete.
     */
    where: SubmissionWhereUniqueInput
  }

  /**
   * Submission deleteMany
   */
  export type SubmissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Submissions to delete
     */
    where?: SubmissionWhereInput
  }

  /**
   * Submission without action
   */
  export type SubmissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: SubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const LabChallengeScalarFieldEnum: {
    courseId: 'courseId',
    moduleId: 'moduleId',
    lessonId: 'lessonId',
    id: 'id',
    title: 'title',
    slug: 'slug',
    description: 'description',
    difficulty: 'difficulty',
    starterRepoUrl: 'starterRepoUrl',
    testsRepoUrl: 'testsRepoUrl',
    runtime: 'runtime',
    createdByUserId: 'createdByUserId',
    visibility: 'visibility',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LabChallengeScalarFieldEnum = (typeof LabChallengeScalarFieldEnum)[keyof typeof LabChallengeScalarFieldEnum]


  export const LabSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    challengeId: 'challengeId',
    status: 'status',
    codeServerUrl: 'codeServerUrl',
    codeServerToken: 'codeServerToken',
    appUrl: 'appUrl',
    containerId: 'containerId',
    lastHeartbeat: 'lastHeartbeat',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LabSessionScalarFieldEnum = (typeof LabSessionScalarFieldEnum)[keyof typeof LabSessionScalarFieldEnum]


  export const LabWorkspaceScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    path: 'path',
    repoUrl: 'repoUrl',
    branch: 'branch'
  };

  export type LabWorkspaceScalarFieldEnum = (typeof LabWorkspaceScalarFieldEnum)[keyof typeof LabWorkspaceScalarFieldEnum]


  export const SubmissionScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    status: 'status',
    passed: 'passed',
    gradePct: 'gradePct',
    feedback: 'feedback',
    artifactsUrl: 'artifactsUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SubmissionScalarFieldEnum = (typeof SubmissionScalarFieldEnum)[keyof typeof SubmissionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type LabChallengeWhereInput = {
    AND?: LabChallengeWhereInput | LabChallengeWhereInput[]
    OR?: LabChallengeWhereInput[]
    NOT?: LabChallengeWhereInput | LabChallengeWhereInput[]
    courseId?: StringNullableFilter<"LabChallenge"> | string | null
    moduleId?: StringNullableFilter<"LabChallenge"> | string | null
    lessonId?: StringNullableFilter<"LabChallenge"> | string | null
    id?: StringFilter<"LabChallenge"> | string
    title?: StringFilter<"LabChallenge"> | string
    slug?: StringFilter<"LabChallenge"> | string
    description?: StringFilter<"LabChallenge"> | string
    difficulty?: StringFilter<"LabChallenge"> | string
    starterRepoUrl?: StringNullableFilter<"LabChallenge"> | string | null
    testsRepoUrl?: StringNullableFilter<"LabChallenge"> | string | null
    runtime?: StringNullableFilter<"LabChallenge"> | string | null
    createdByUserId?: StringFilter<"LabChallenge"> | string
    visibility?: StringFilter<"LabChallenge"> | string
    createdAt?: DateTimeFilter<"LabChallenge"> | Date | string
    updatedAt?: DateTimeFilter<"LabChallenge"> | Date | string
    sessions?: LabSessionListRelationFilter
  }

  export type LabChallengeOrderByWithRelationInput = {
    courseId?: SortOrderInput | SortOrder
    moduleId?: SortOrderInput | SortOrder
    lessonId?: SortOrderInput | SortOrder
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    difficulty?: SortOrder
    starterRepoUrl?: SortOrderInput | SortOrder
    testsRepoUrl?: SortOrderInput | SortOrder
    runtime?: SortOrderInput | SortOrder
    createdByUserId?: SortOrder
    visibility?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessions?: LabSessionOrderByRelationAggregateInput
  }

  export type LabChallengeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: LabChallengeWhereInput | LabChallengeWhereInput[]
    OR?: LabChallengeWhereInput[]
    NOT?: LabChallengeWhereInput | LabChallengeWhereInput[]
    courseId?: StringNullableFilter<"LabChallenge"> | string | null
    moduleId?: StringNullableFilter<"LabChallenge"> | string | null
    lessonId?: StringNullableFilter<"LabChallenge"> | string | null
    title?: StringFilter<"LabChallenge"> | string
    description?: StringFilter<"LabChallenge"> | string
    difficulty?: StringFilter<"LabChallenge"> | string
    starterRepoUrl?: StringNullableFilter<"LabChallenge"> | string | null
    testsRepoUrl?: StringNullableFilter<"LabChallenge"> | string | null
    runtime?: StringNullableFilter<"LabChallenge"> | string | null
    createdByUserId?: StringFilter<"LabChallenge"> | string
    visibility?: StringFilter<"LabChallenge"> | string
    createdAt?: DateTimeFilter<"LabChallenge"> | Date | string
    updatedAt?: DateTimeFilter<"LabChallenge"> | Date | string
    sessions?: LabSessionListRelationFilter
  }, "id" | "slug">

  export type LabChallengeOrderByWithAggregationInput = {
    courseId?: SortOrderInput | SortOrder
    moduleId?: SortOrderInput | SortOrder
    lessonId?: SortOrderInput | SortOrder
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    difficulty?: SortOrder
    starterRepoUrl?: SortOrderInput | SortOrder
    testsRepoUrl?: SortOrderInput | SortOrder
    runtime?: SortOrderInput | SortOrder
    createdByUserId?: SortOrder
    visibility?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LabChallengeCountOrderByAggregateInput
    _max?: LabChallengeMaxOrderByAggregateInput
    _min?: LabChallengeMinOrderByAggregateInput
  }

  export type LabChallengeScalarWhereWithAggregatesInput = {
    AND?: LabChallengeScalarWhereWithAggregatesInput | LabChallengeScalarWhereWithAggregatesInput[]
    OR?: LabChallengeScalarWhereWithAggregatesInput[]
    NOT?: LabChallengeScalarWhereWithAggregatesInput | LabChallengeScalarWhereWithAggregatesInput[]
    courseId?: StringNullableWithAggregatesFilter<"LabChallenge"> | string | null
    moduleId?: StringNullableWithAggregatesFilter<"LabChallenge"> | string | null
    lessonId?: StringNullableWithAggregatesFilter<"LabChallenge"> | string | null
    id?: StringWithAggregatesFilter<"LabChallenge"> | string
    title?: StringWithAggregatesFilter<"LabChallenge"> | string
    slug?: StringWithAggregatesFilter<"LabChallenge"> | string
    description?: StringWithAggregatesFilter<"LabChallenge"> | string
    difficulty?: StringWithAggregatesFilter<"LabChallenge"> | string
    starterRepoUrl?: StringNullableWithAggregatesFilter<"LabChallenge"> | string | null
    testsRepoUrl?: StringNullableWithAggregatesFilter<"LabChallenge"> | string | null
    runtime?: StringNullableWithAggregatesFilter<"LabChallenge"> | string | null
    createdByUserId?: StringWithAggregatesFilter<"LabChallenge"> | string
    visibility?: StringWithAggregatesFilter<"LabChallenge"> | string
    createdAt?: DateTimeWithAggregatesFilter<"LabChallenge"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LabChallenge"> | Date | string
  }

  export type LabSessionWhereInput = {
    AND?: LabSessionWhereInput | LabSessionWhereInput[]
    OR?: LabSessionWhereInput[]
    NOT?: LabSessionWhereInput | LabSessionWhereInput[]
    id?: StringFilter<"LabSession"> | string
    userId?: StringFilter<"LabSession"> | string
    challengeId?: StringFilter<"LabSession"> | string
    status?: StringFilter<"LabSession"> | string
    codeServerUrl?: StringNullableFilter<"LabSession"> | string | null
    codeServerToken?: StringNullableFilter<"LabSession"> | string | null
    appUrl?: StringNullableFilter<"LabSession"> | string | null
    containerId?: StringNullableFilter<"LabSession"> | string | null
    lastHeartbeat?: DateTimeNullableFilter<"LabSession"> | Date | string | null
    createdAt?: DateTimeFilter<"LabSession"> | Date | string
    updatedAt?: DateTimeFilter<"LabSession"> | Date | string
    challenge?: XOR<LabChallengeRelationFilter, LabChallengeWhereInput>
    submissions?: SubmissionListRelationFilter
    workspaces?: LabWorkspaceListRelationFilter
  }

  export type LabSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    challengeId?: SortOrder
    status?: SortOrder
    codeServerUrl?: SortOrderInput | SortOrder
    codeServerToken?: SortOrderInput | SortOrder
    appUrl?: SortOrderInput | SortOrder
    containerId?: SortOrderInput | SortOrder
    lastHeartbeat?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    challenge?: LabChallengeOrderByWithRelationInput
    submissions?: SubmissionOrderByRelationAggregateInput
    workspaces?: LabWorkspaceOrderByRelationAggregateInput
  }

  export type LabSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LabSessionWhereInput | LabSessionWhereInput[]
    OR?: LabSessionWhereInput[]
    NOT?: LabSessionWhereInput | LabSessionWhereInput[]
    userId?: StringFilter<"LabSession"> | string
    challengeId?: StringFilter<"LabSession"> | string
    status?: StringFilter<"LabSession"> | string
    codeServerUrl?: StringNullableFilter<"LabSession"> | string | null
    codeServerToken?: StringNullableFilter<"LabSession"> | string | null
    appUrl?: StringNullableFilter<"LabSession"> | string | null
    containerId?: StringNullableFilter<"LabSession"> | string | null
    lastHeartbeat?: DateTimeNullableFilter<"LabSession"> | Date | string | null
    createdAt?: DateTimeFilter<"LabSession"> | Date | string
    updatedAt?: DateTimeFilter<"LabSession"> | Date | string
    challenge?: XOR<LabChallengeRelationFilter, LabChallengeWhereInput>
    submissions?: SubmissionListRelationFilter
    workspaces?: LabWorkspaceListRelationFilter
  }, "id">

  export type LabSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    challengeId?: SortOrder
    status?: SortOrder
    codeServerUrl?: SortOrderInput | SortOrder
    codeServerToken?: SortOrderInput | SortOrder
    appUrl?: SortOrderInput | SortOrder
    containerId?: SortOrderInput | SortOrder
    lastHeartbeat?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LabSessionCountOrderByAggregateInput
    _max?: LabSessionMaxOrderByAggregateInput
    _min?: LabSessionMinOrderByAggregateInput
  }

  export type LabSessionScalarWhereWithAggregatesInput = {
    AND?: LabSessionScalarWhereWithAggregatesInput | LabSessionScalarWhereWithAggregatesInput[]
    OR?: LabSessionScalarWhereWithAggregatesInput[]
    NOT?: LabSessionScalarWhereWithAggregatesInput | LabSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LabSession"> | string
    userId?: StringWithAggregatesFilter<"LabSession"> | string
    challengeId?: StringWithAggregatesFilter<"LabSession"> | string
    status?: StringWithAggregatesFilter<"LabSession"> | string
    codeServerUrl?: StringNullableWithAggregatesFilter<"LabSession"> | string | null
    codeServerToken?: StringNullableWithAggregatesFilter<"LabSession"> | string | null
    appUrl?: StringNullableWithAggregatesFilter<"LabSession"> | string | null
    containerId?: StringNullableWithAggregatesFilter<"LabSession"> | string | null
    lastHeartbeat?: DateTimeNullableWithAggregatesFilter<"LabSession"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LabSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LabSession"> | Date | string
  }

  export type LabWorkspaceWhereInput = {
    AND?: LabWorkspaceWhereInput | LabWorkspaceWhereInput[]
    OR?: LabWorkspaceWhereInput[]
    NOT?: LabWorkspaceWhereInput | LabWorkspaceWhereInput[]
    id?: StringFilter<"LabWorkspace"> | string
    sessionId?: StringFilter<"LabWorkspace"> | string
    path?: StringFilter<"LabWorkspace"> | string
    repoUrl?: StringNullableFilter<"LabWorkspace"> | string | null
    branch?: StringNullableFilter<"LabWorkspace"> | string | null
    session?: XOR<LabSessionRelationFilter, LabSessionWhereInput>
  }

  export type LabWorkspaceOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    path?: SortOrder
    repoUrl?: SortOrderInput | SortOrder
    branch?: SortOrderInput | SortOrder
    session?: LabSessionOrderByWithRelationInput
  }

  export type LabWorkspaceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LabWorkspaceWhereInput | LabWorkspaceWhereInput[]
    OR?: LabWorkspaceWhereInput[]
    NOT?: LabWorkspaceWhereInput | LabWorkspaceWhereInput[]
    sessionId?: StringFilter<"LabWorkspace"> | string
    path?: StringFilter<"LabWorkspace"> | string
    repoUrl?: StringNullableFilter<"LabWorkspace"> | string | null
    branch?: StringNullableFilter<"LabWorkspace"> | string | null
    session?: XOR<LabSessionRelationFilter, LabSessionWhereInput>
  }, "id">

  export type LabWorkspaceOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    path?: SortOrder
    repoUrl?: SortOrderInput | SortOrder
    branch?: SortOrderInput | SortOrder
    _count?: LabWorkspaceCountOrderByAggregateInput
    _max?: LabWorkspaceMaxOrderByAggregateInput
    _min?: LabWorkspaceMinOrderByAggregateInput
  }

  export type LabWorkspaceScalarWhereWithAggregatesInput = {
    AND?: LabWorkspaceScalarWhereWithAggregatesInput | LabWorkspaceScalarWhereWithAggregatesInput[]
    OR?: LabWorkspaceScalarWhereWithAggregatesInput[]
    NOT?: LabWorkspaceScalarWhereWithAggregatesInput | LabWorkspaceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LabWorkspace"> | string
    sessionId?: StringWithAggregatesFilter<"LabWorkspace"> | string
    path?: StringWithAggregatesFilter<"LabWorkspace"> | string
    repoUrl?: StringNullableWithAggregatesFilter<"LabWorkspace"> | string | null
    branch?: StringNullableWithAggregatesFilter<"LabWorkspace"> | string | null
  }

  export type SubmissionWhereInput = {
    AND?: SubmissionWhereInput | SubmissionWhereInput[]
    OR?: SubmissionWhereInput[]
    NOT?: SubmissionWhereInput | SubmissionWhereInput[]
    id?: StringFilter<"Submission"> | string
    sessionId?: StringFilter<"Submission"> | string
    status?: StringFilter<"Submission"> | string
    passed?: BoolFilter<"Submission"> | boolean
    gradePct?: FloatNullableFilter<"Submission"> | number | null
    feedback?: StringNullableFilter<"Submission"> | string | null
    artifactsUrl?: StringNullableFilter<"Submission"> | string | null
    createdAt?: DateTimeFilter<"Submission"> | Date | string
    updatedAt?: DateTimeFilter<"Submission"> | Date | string
    session?: XOR<LabSessionRelationFilter, LabSessionWhereInput>
  }

  export type SubmissionOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    status?: SortOrder
    passed?: SortOrder
    gradePct?: SortOrderInput | SortOrder
    feedback?: SortOrderInput | SortOrder
    artifactsUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    session?: LabSessionOrderByWithRelationInput
  }

  export type SubmissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SubmissionWhereInput | SubmissionWhereInput[]
    OR?: SubmissionWhereInput[]
    NOT?: SubmissionWhereInput | SubmissionWhereInput[]
    sessionId?: StringFilter<"Submission"> | string
    status?: StringFilter<"Submission"> | string
    passed?: BoolFilter<"Submission"> | boolean
    gradePct?: FloatNullableFilter<"Submission"> | number | null
    feedback?: StringNullableFilter<"Submission"> | string | null
    artifactsUrl?: StringNullableFilter<"Submission"> | string | null
    createdAt?: DateTimeFilter<"Submission"> | Date | string
    updatedAt?: DateTimeFilter<"Submission"> | Date | string
    session?: XOR<LabSessionRelationFilter, LabSessionWhereInput>
  }, "id">

  export type SubmissionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    status?: SortOrder
    passed?: SortOrder
    gradePct?: SortOrderInput | SortOrder
    feedback?: SortOrderInput | SortOrder
    artifactsUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SubmissionCountOrderByAggregateInput
    _avg?: SubmissionAvgOrderByAggregateInput
    _max?: SubmissionMaxOrderByAggregateInput
    _min?: SubmissionMinOrderByAggregateInput
    _sum?: SubmissionSumOrderByAggregateInput
  }

  export type SubmissionScalarWhereWithAggregatesInput = {
    AND?: SubmissionScalarWhereWithAggregatesInput | SubmissionScalarWhereWithAggregatesInput[]
    OR?: SubmissionScalarWhereWithAggregatesInput[]
    NOT?: SubmissionScalarWhereWithAggregatesInput | SubmissionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Submission"> | string
    sessionId?: StringWithAggregatesFilter<"Submission"> | string
    status?: StringWithAggregatesFilter<"Submission"> | string
    passed?: BoolWithAggregatesFilter<"Submission"> | boolean
    gradePct?: FloatNullableWithAggregatesFilter<"Submission"> | number | null
    feedback?: StringNullableWithAggregatesFilter<"Submission"> | string | null
    artifactsUrl?: StringNullableWithAggregatesFilter<"Submission"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Submission"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Submission"> | Date | string
  }

  export type LabChallengeCreateInput = {
    courseId?: string | null
    moduleId?: string | null
    lessonId?: string | null
    id?: string
    title: string
    slug: string
    description: string
    difficulty: string
    starterRepoUrl?: string | null
    testsRepoUrl?: string | null
    runtime?: string | null
    createdByUserId: string
    visibility?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: LabSessionCreateNestedManyWithoutChallengeInput
  }

  export type LabChallengeUncheckedCreateInput = {
    courseId?: string | null
    moduleId?: string | null
    lessonId?: string | null
    id?: string
    title: string
    slug: string
    description: string
    difficulty: string
    starterRepoUrl?: string | null
    testsRepoUrl?: string | null
    runtime?: string | null
    createdByUserId: string
    visibility?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: LabSessionUncheckedCreateNestedManyWithoutChallengeInput
  }

  export type LabChallengeUpdateInput = {
    courseId?: NullableStringFieldUpdateOperationsInput | string | null
    moduleId?: NullableStringFieldUpdateOperationsInput | string | null
    lessonId?: NullableStringFieldUpdateOperationsInput | string | null
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    starterRepoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    testsRepoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    runtime?: NullableStringFieldUpdateOperationsInput | string | null
    createdByUserId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: LabSessionUpdateManyWithoutChallengeNestedInput
  }

  export type LabChallengeUncheckedUpdateInput = {
    courseId?: NullableStringFieldUpdateOperationsInput | string | null
    moduleId?: NullableStringFieldUpdateOperationsInput | string | null
    lessonId?: NullableStringFieldUpdateOperationsInput | string | null
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    starterRepoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    testsRepoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    runtime?: NullableStringFieldUpdateOperationsInput | string | null
    createdByUserId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: LabSessionUncheckedUpdateManyWithoutChallengeNestedInput
  }

  export type LabChallengeCreateManyInput = {
    courseId?: string | null
    moduleId?: string | null
    lessonId?: string | null
    id?: string
    title: string
    slug: string
    description: string
    difficulty: string
    starterRepoUrl?: string | null
    testsRepoUrl?: string | null
    runtime?: string | null
    createdByUserId: string
    visibility?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LabChallengeUpdateManyMutationInput = {
    courseId?: NullableStringFieldUpdateOperationsInput | string | null
    moduleId?: NullableStringFieldUpdateOperationsInput | string | null
    lessonId?: NullableStringFieldUpdateOperationsInput | string | null
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    starterRepoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    testsRepoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    runtime?: NullableStringFieldUpdateOperationsInput | string | null
    createdByUserId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabChallengeUncheckedUpdateManyInput = {
    courseId?: NullableStringFieldUpdateOperationsInput | string | null
    moduleId?: NullableStringFieldUpdateOperationsInput | string | null
    lessonId?: NullableStringFieldUpdateOperationsInput | string | null
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    starterRepoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    testsRepoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    runtime?: NullableStringFieldUpdateOperationsInput | string | null
    createdByUserId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabSessionCreateInput = {
    id?: string
    userId: string
    status?: string
    codeServerUrl?: string | null
    codeServerToken?: string | null
    appUrl?: string | null
    containerId?: string | null
    lastHeartbeat?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    challenge: LabChallengeCreateNestedOneWithoutSessionsInput
    submissions?: SubmissionCreateNestedManyWithoutSessionInput
    workspaces?: LabWorkspaceCreateNestedManyWithoutSessionInput
  }

  export type LabSessionUncheckedCreateInput = {
    id?: string
    userId: string
    challengeId: string
    status?: string
    codeServerUrl?: string | null
    codeServerToken?: string | null
    appUrl?: string | null
    containerId?: string | null
    lastHeartbeat?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    submissions?: SubmissionUncheckedCreateNestedManyWithoutSessionInput
    workspaces?: LabWorkspaceUncheckedCreateNestedManyWithoutSessionInput
  }

  export type LabSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    codeServerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codeServerToken?: NullableStringFieldUpdateOperationsInput | string | null
    appUrl?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    lastHeartbeat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    challenge?: LabChallengeUpdateOneRequiredWithoutSessionsNestedInput
    submissions?: SubmissionUpdateManyWithoutSessionNestedInput
    workspaces?: LabWorkspaceUpdateManyWithoutSessionNestedInput
  }

  export type LabSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    challengeId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    codeServerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codeServerToken?: NullableStringFieldUpdateOperationsInput | string | null
    appUrl?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    lastHeartbeat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissions?: SubmissionUncheckedUpdateManyWithoutSessionNestedInput
    workspaces?: LabWorkspaceUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type LabSessionCreateManyInput = {
    id?: string
    userId: string
    challengeId: string
    status?: string
    codeServerUrl?: string | null
    codeServerToken?: string | null
    appUrl?: string | null
    containerId?: string | null
    lastHeartbeat?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LabSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    codeServerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codeServerToken?: NullableStringFieldUpdateOperationsInput | string | null
    appUrl?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    lastHeartbeat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    challengeId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    codeServerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codeServerToken?: NullableStringFieldUpdateOperationsInput | string | null
    appUrl?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    lastHeartbeat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabWorkspaceCreateInput = {
    id?: string
    path: string
    repoUrl?: string | null
    branch?: string | null
    session: LabSessionCreateNestedOneWithoutWorkspacesInput
  }

  export type LabWorkspaceUncheckedCreateInput = {
    id?: string
    sessionId: string
    path: string
    repoUrl?: string | null
    branch?: string | null
  }

  export type LabWorkspaceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    branch?: NullableStringFieldUpdateOperationsInput | string | null
    session?: LabSessionUpdateOneRequiredWithoutWorkspacesNestedInput
  }

  export type LabWorkspaceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    branch?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LabWorkspaceCreateManyInput = {
    id?: string
    sessionId: string
    path: string
    repoUrl?: string | null
    branch?: string | null
  }

  export type LabWorkspaceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    branch?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LabWorkspaceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    branch?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SubmissionCreateInput = {
    id?: string
    status?: string
    passed?: boolean
    gradePct?: number | null
    feedback?: string | null
    artifactsUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    session: LabSessionCreateNestedOneWithoutSubmissionsInput
  }

  export type SubmissionUncheckedCreateInput = {
    id?: string
    sessionId: string
    status?: string
    passed?: boolean
    gradePct?: number | null
    feedback?: string | null
    artifactsUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubmissionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    passed?: BoolFieldUpdateOperationsInput | boolean
    gradePct?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    artifactsUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: LabSessionUpdateOneRequiredWithoutSubmissionsNestedInput
  }

  export type SubmissionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    passed?: BoolFieldUpdateOperationsInput | boolean
    gradePct?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    artifactsUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionCreateManyInput = {
    id?: string
    sessionId: string
    status?: string
    passed?: boolean
    gradePct?: number | null
    feedback?: string | null
    artifactsUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubmissionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    passed?: BoolFieldUpdateOperationsInput | boolean
    gradePct?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    artifactsUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    passed?: BoolFieldUpdateOperationsInput | boolean
    gradePct?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    artifactsUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type LabSessionListRelationFilter = {
    every?: LabSessionWhereInput
    some?: LabSessionWhereInput
    none?: LabSessionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LabSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LabChallengeCountOrderByAggregateInput = {
    courseId?: SortOrder
    moduleId?: SortOrder
    lessonId?: SortOrder
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    difficulty?: SortOrder
    starterRepoUrl?: SortOrder
    testsRepoUrl?: SortOrder
    runtime?: SortOrder
    createdByUserId?: SortOrder
    visibility?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LabChallengeMaxOrderByAggregateInput = {
    courseId?: SortOrder
    moduleId?: SortOrder
    lessonId?: SortOrder
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    difficulty?: SortOrder
    starterRepoUrl?: SortOrder
    testsRepoUrl?: SortOrder
    runtime?: SortOrder
    createdByUserId?: SortOrder
    visibility?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LabChallengeMinOrderByAggregateInput = {
    courseId?: SortOrder
    moduleId?: SortOrder
    lessonId?: SortOrder
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    difficulty?: SortOrder
    starterRepoUrl?: SortOrder
    testsRepoUrl?: SortOrder
    runtime?: SortOrder
    createdByUserId?: SortOrder
    visibility?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type LabChallengeRelationFilter = {
    is?: LabChallengeWhereInput
    isNot?: LabChallengeWhereInput
  }

  export type SubmissionListRelationFilter = {
    every?: SubmissionWhereInput
    some?: SubmissionWhereInput
    none?: SubmissionWhereInput
  }

  export type LabWorkspaceListRelationFilter = {
    every?: LabWorkspaceWhereInput
    some?: LabWorkspaceWhereInput
    none?: LabWorkspaceWhereInput
  }

  export type SubmissionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LabWorkspaceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LabSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    challengeId?: SortOrder
    status?: SortOrder
    codeServerUrl?: SortOrder
    codeServerToken?: SortOrder
    appUrl?: SortOrder
    containerId?: SortOrder
    lastHeartbeat?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LabSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    challengeId?: SortOrder
    status?: SortOrder
    codeServerUrl?: SortOrder
    codeServerToken?: SortOrder
    appUrl?: SortOrder
    containerId?: SortOrder
    lastHeartbeat?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LabSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    challengeId?: SortOrder
    status?: SortOrder
    codeServerUrl?: SortOrder
    codeServerToken?: SortOrder
    appUrl?: SortOrder
    containerId?: SortOrder
    lastHeartbeat?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type LabSessionRelationFilter = {
    is?: LabSessionWhereInput
    isNot?: LabSessionWhereInput
  }

  export type LabWorkspaceCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    path?: SortOrder
    repoUrl?: SortOrder
    branch?: SortOrder
  }

  export type LabWorkspaceMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    path?: SortOrder
    repoUrl?: SortOrder
    branch?: SortOrder
  }

  export type LabWorkspaceMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    path?: SortOrder
    repoUrl?: SortOrder
    branch?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type SubmissionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    status?: SortOrder
    passed?: SortOrder
    gradePct?: SortOrder
    feedback?: SortOrder
    artifactsUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubmissionAvgOrderByAggregateInput = {
    gradePct?: SortOrder
  }

  export type SubmissionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    status?: SortOrder
    passed?: SortOrder
    gradePct?: SortOrder
    feedback?: SortOrder
    artifactsUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubmissionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    status?: SortOrder
    passed?: SortOrder
    gradePct?: SortOrder
    feedback?: SortOrder
    artifactsUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubmissionSumOrderByAggregateInput = {
    gradePct?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type LabSessionCreateNestedManyWithoutChallengeInput = {
    create?: XOR<LabSessionCreateWithoutChallengeInput, LabSessionUncheckedCreateWithoutChallengeInput> | LabSessionCreateWithoutChallengeInput[] | LabSessionUncheckedCreateWithoutChallengeInput[]
    connectOrCreate?: LabSessionCreateOrConnectWithoutChallengeInput | LabSessionCreateOrConnectWithoutChallengeInput[]
    createMany?: LabSessionCreateManyChallengeInputEnvelope
    connect?: LabSessionWhereUniqueInput | LabSessionWhereUniqueInput[]
  }

  export type LabSessionUncheckedCreateNestedManyWithoutChallengeInput = {
    create?: XOR<LabSessionCreateWithoutChallengeInput, LabSessionUncheckedCreateWithoutChallengeInput> | LabSessionCreateWithoutChallengeInput[] | LabSessionUncheckedCreateWithoutChallengeInput[]
    connectOrCreate?: LabSessionCreateOrConnectWithoutChallengeInput | LabSessionCreateOrConnectWithoutChallengeInput[]
    createMany?: LabSessionCreateManyChallengeInputEnvelope
    connect?: LabSessionWhereUniqueInput | LabSessionWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type LabSessionUpdateManyWithoutChallengeNestedInput = {
    create?: XOR<LabSessionCreateWithoutChallengeInput, LabSessionUncheckedCreateWithoutChallengeInput> | LabSessionCreateWithoutChallengeInput[] | LabSessionUncheckedCreateWithoutChallengeInput[]
    connectOrCreate?: LabSessionCreateOrConnectWithoutChallengeInput | LabSessionCreateOrConnectWithoutChallengeInput[]
    upsert?: LabSessionUpsertWithWhereUniqueWithoutChallengeInput | LabSessionUpsertWithWhereUniqueWithoutChallengeInput[]
    createMany?: LabSessionCreateManyChallengeInputEnvelope
    set?: LabSessionWhereUniqueInput | LabSessionWhereUniqueInput[]
    disconnect?: LabSessionWhereUniqueInput | LabSessionWhereUniqueInput[]
    delete?: LabSessionWhereUniqueInput | LabSessionWhereUniqueInput[]
    connect?: LabSessionWhereUniqueInput | LabSessionWhereUniqueInput[]
    update?: LabSessionUpdateWithWhereUniqueWithoutChallengeInput | LabSessionUpdateWithWhereUniqueWithoutChallengeInput[]
    updateMany?: LabSessionUpdateManyWithWhereWithoutChallengeInput | LabSessionUpdateManyWithWhereWithoutChallengeInput[]
    deleteMany?: LabSessionScalarWhereInput | LabSessionScalarWhereInput[]
  }

  export type LabSessionUncheckedUpdateManyWithoutChallengeNestedInput = {
    create?: XOR<LabSessionCreateWithoutChallengeInput, LabSessionUncheckedCreateWithoutChallengeInput> | LabSessionCreateWithoutChallengeInput[] | LabSessionUncheckedCreateWithoutChallengeInput[]
    connectOrCreate?: LabSessionCreateOrConnectWithoutChallengeInput | LabSessionCreateOrConnectWithoutChallengeInput[]
    upsert?: LabSessionUpsertWithWhereUniqueWithoutChallengeInput | LabSessionUpsertWithWhereUniqueWithoutChallengeInput[]
    createMany?: LabSessionCreateManyChallengeInputEnvelope
    set?: LabSessionWhereUniqueInput | LabSessionWhereUniqueInput[]
    disconnect?: LabSessionWhereUniqueInput | LabSessionWhereUniqueInput[]
    delete?: LabSessionWhereUniqueInput | LabSessionWhereUniqueInput[]
    connect?: LabSessionWhereUniqueInput | LabSessionWhereUniqueInput[]
    update?: LabSessionUpdateWithWhereUniqueWithoutChallengeInput | LabSessionUpdateWithWhereUniqueWithoutChallengeInput[]
    updateMany?: LabSessionUpdateManyWithWhereWithoutChallengeInput | LabSessionUpdateManyWithWhereWithoutChallengeInput[]
    deleteMany?: LabSessionScalarWhereInput | LabSessionScalarWhereInput[]
  }

  export type LabChallengeCreateNestedOneWithoutSessionsInput = {
    create?: XOR<LabChallengeCreateWithoutSessionsInput, LabChallengeUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: LabChallengeCreateOrConnectWithoutSessionsInput
    connect?: LabChallengeWhereUniqueInput
  }

  export type SubmissionCreateNestedManyWithoutSessionInput = {
    create?: XOR<SubmissionCreateWithoutSessionInput, SubmissionUncheckedCreateWithoutSessionInput> | SubmissionCreateWithoutSessionInput[] | SubmissionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: SubmissionCreateOrConnectWithoutSessionInput | SubmissionCreateOrConnectWithoutSessionInput[]
    createMany?: SubmissionCreateManySessionInputEnvelope
    connect?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
  }

  export type LabWorkspaceCreateNestedManyWithoutSessionInput = {
    create?: XOR<LabWorkspaceCreateWithoutSessionInput, LabWorkspaceUncheckedCreateWithoutSessionInput> | LabWorkspaceCreateWithoutSessionInput[] | LabWorkspaceUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: LabWorkspaceCreateOrConnectWithoutSessionInput | LabWorkspaceCreateOrConnectWithoutSessionInput[]
    createMany?: LabWorkspaceCreateManySessionInputEnvelope
    connect?: LabWorkspaceWhereUniqueInput | LabWorkspaceWhereUniqueInput[]
  }

  export type SubmissionUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<SubmissionCreateWithoutSessionInput, SubmissionUncheckedCreateWithoutSessionInput> | SubmissionCreateWithoutSessionInput[] | SubmissionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: SubmissionCreateOrConnectWithoutSessionInput | SubmissionCreateOrConnectWithoutSessionInput[]
    createMany?: SubmissionCreateManySessionInputEnvelope
    connect?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
  }

  export type LabWorkspaceUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<LabWorkspaceCreateWithoutSessionInput, LabWorkspaceUncheckedCreateWithoutSessionInput> | LabWorkspaceCreateWithoutSessionInput[] | LabWorkspaceUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: LabWorkspaceCreateOrConnectWithoutSessionInput | LabWorkspaceCreateOrConnectWithoutSessionInput[]
    createMany?: LabWorkspaceCreateManySessionInputEnvelope
    connect?: LabWorkspaceWhereUniqueInput | LabWorkspaceWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type LabChallengeUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<LabChallengeCreateWithoutSessionsInput, LabChallengeUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: LabChallengeCreateOrConnectWithoutSessionsInput
    upsert?: LabChallengeUpsertWithoutSessionsInput
    connect?: LabChallengeWhereUniqueInput
    update?: XOR<XOR<LabChallengeUpdateToOneWithWhereWithoutSessionsInput, LabChallengeUpdateWithoutSessionsInput>, LabChallengeUncheckedUpdateWithoutSessionsInput>
  }

  export type SubmissionUpdateManyWithoutSessionNestedInput = {
    create?: XOR<SubmissionCreateWithoutSessionInput, SubmissionUncheckedCreateWithoutSessionInput> | SubmissionCreateWithoutSessionInput[] | SubmissionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: SubmissionCreateOrConnectWithoutSessionInput | SubmissionCreateOrConnectWithoutSessionInput[]
    upsert?: SubmissionUpsertWithWhereUniqueWithoutSessionInput | SubmissionUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: SubmissionCreateManySessionInputEnvelope
    set?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
    disconnect?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
    delete?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
    connect?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
    update?: SubmissionUpdateWithWhereUniqueWithoutSessionInput | SubmissionUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: SubmissionUpdateManyWithWhereWithoutSessionInput | SubmissionUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: SubmissionScalarWhereInput | SubmissionScalarWhereInput[]
  }

  export type LabWorkspaceUpdateManyWithoutSessionNestedInput = {
    create?: XOR<LabWorkspaceCreateWithoutSessionInput, LabWorkspaceUncheckedCreateWithoutSessionInput> | LabWorkspaceCreateWithoutSessionInput[] | LabWorkspaceUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: LabWorkspaceCreateOrConnectWithoutSessionInput | LabWorkspaceCreateOrConnectWithoutSessionInput[]
    upsert?: LabWorkspaceUpsertWithWhereUniqueWithoutSessionInput | LabWorkspaceUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: LabWorkspaceCreateManySessionInputEnvelope
    set?: LabWorkspaceWhereUniqueInput | LabWorkspaceWhereUniqueInput[]
    disconnect?: LabWorkspaceWhereUniqueInput | LabWorkspaceWhereUniqueInput[]
    delete?: LabWorkspaceWhereUniqueInput | LabWorkspaceWhereUniqueInput[]
    connect?: LabWorkspaceWhereUniqueInput | LabWorkspaceWhereUniqueInput[]
    update?: LabWorkspaceUpdateWithWhereUniqueWithoutSessionInput | LabWorkspaceUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: LabWorkspaceUpdateManyWithWhereWithoutSessionInput | LabWorkspaceUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: LabWorkspaceScalarWhereInput | LabWorkspaceScalarWhereInput[]
  }

  export type SubmissionUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<SubmissionCreateWithoutSessionInput, SubmissionUncheckedCreateWithoutSessionInput> | SubmissionCreateWithoutSessionInput[] | SubmissionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: SubmissionCreateOrConnectWithoutSessionInput | SubmissionCreateOrConnectWithoutSessionInput[]
    upsert?: SubmissionUpsertWithWhereUniqueWithoutSessionInput | SubmissionUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: SubmissionCreateManySessionInputEnvelope
    set?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
    disconnect?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
    delete?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
    connect?: SubmissionWhereUniqueInput | SubmissionWhereUniqueInput[]
    update?: SubmissionUpdateWithWhereUniqueWithoutSessionInput | SubmissionUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: SubmissionUpdateManyWithWhereWithoutSessionInput | SubmissionUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: SubmissionScalarWhereInput | SubmissionScalarWhereInput[]
  }

  export type LabWorkspaceUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<LabWorkspaceCreateWithoutSessionInput, LabWorkspaceUncheckedCreateWithoutSessionInput> | LabWorkspaceCreateWithoutSessionInput[] | LabWorkspaceUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: LabWorkspaceCreateOrConnectWithoutSessionInput | LabWorkspaceCreateOrConnectWithoutSessionInput[]
    upsert?: LabWorkspaceUpsertWithWhereUniqueWithoutSessionInput | LabWorkspaceUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: LabWorkspaceCreateManySessionInputEnvelope
    set?: LabWorkspaceWhereUniqueInput | LabWorkspaceWhereUniqueInput[]
    disconnect?: LabWorkspaceWhereUniqueInput | LabWorkspaceWhereUniqueInput[]
    delete?: LabWorkspaceWhereUniqueInput | LabWorkspaceWhereUniqueInput[]
    connect?: LabWorkspaceWhereUniqueInput | LabWorkspaceWhereUniqueInput[]
    update?: LabWorkspaceUpdateWithWhereUniqueWithoutSessionInput | LabWorkspaceUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: LabWorkspaceUpdateManyWithWhereWithoutSessionInput | LabWorkspaceUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: LabWorkspaceScalarWhereInput | LabWorkspaceScalarWhereInput[]
  }

  export type LabSessionCreateNestedOneWithoutWorkspacesInput = {
    create?: XOR<LabSessionCreateWithoutWorkspacesInput, LabSessionUncheckedCreateWithoutWorkspacesInput>
    connectOrCreate?: LabSessionCreateOrConnectWithoutWorkspacesInput
    connect?: LabSessionWhereUniqueInput
  }

  export type LabSessionUpdateOneRequiredWithoutWorkspacesNestedInput = {
    create?: XOR<LabSessionCreateWithoutWorkspacesInput, LabSessionUncheckedCreateWithoutWorkspacesInput>
    connectOrCreate?: LabSessionCreateOrConnectWithoutWorkspacesInput
    upsert?: LabSessionUpsertWithoutWorkspacesInput
    connect?: LabSessionWhereUniqueInput
    update?: XOR<XOR<LabSessionUpdateToOneWithWhereWithoutWorkspacesInput, LabSessionUpdateWithoutWorkspacesInput>, LabSessionUncheckedUpdateWithoutWorkspacesInput>
  }

  export type LabSessionCreateNestedOneWithoutSubmissionsInput = {
    create?: XOR<LabSessionCreateWithoutSubmissionsInput, LabSessionUncheckedCreateWithoutSubmissionsInput>
    connectOrCreate?: LabSessionCreateOrConnectWithoutSubmissionsInput
    connect?: LabSessionWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type LabSessionUpdateOneRequiredWithoutSubmissionsNestedInput = {
    create?: XOR<LabSessionCreateWithoutSubmissionsInput, LabSessionUncheckedCreateWithoutSubmissionsInput>
    connectOrCreate?: LabSessionCreateOrConnectWithoutSubmissionsInput
    upsert?: LabSessionUpsertWithoutSubmissionsInput
    connect?: LabSessionWhereUniqueInput
    update?: XOR<XOR<LabSessionUpdateToOneWithWhereWithoutSubmissionsInput, LabSessionUpdateWithoutSubmissionsInput>, LabSessionUncheckedUpdateWithoutSubmissionsInput>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type LabSessionCreateWithoutChallengeInput = {
    id?: string
    userId: string
    status?: string
    codeServerUrl?: string | null
    codeServerToken?: string | null
    appUrl?: string | null
    containerId?: string | null
    lastHeartbeat?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    submissions?: SubmissionCreateNestedManyWithoutSessionInput
    workspaces?: LabWorkspaceCreateNestedManyWithoutSessionInput
  }

  export type LabSessionUncheckedCreateWithoutChallengeInput = {
    id?: string
    userId: string
    status?: string
    codeServerUrl?: string | null
    codeServerToken?: string | null
    appUrl?: string | null
    containerId?: string | null
    lastHeartbeat?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    submissions?: SubmissionUncheckedCreateNestedManyWithoutSessionInput
    workspaces?: LabWorkspaceUncheckedCreateNestedManyWithoutSessionInput
  }

  export type LabSessionCreateOrConnectWithoutChallengeInput = {
    where: LabSessionWhereUniqueInput
    create: XOR<LabSessionCreateWithoutChallengeInput, LabSessionUncheckedCreateWithoutChallengeInput>
  }

  export type LabSessionCreateManyChallengeInputEnvelope = {
    data: LabSessionCreateManyChallengeInput | LabSessionCreateManyChallengeInput[]
  }

  export type LabSessionUpsertWithWhereUniqueWithoutChallengeInput = {
    where: LabSessionWhereUniqueInput
    update: XOR<LabSessionUpdateWithoutChallengeInput, LabSessionUncheckedUpdateWithoutChallengeInput>
    create: XOR<LabSessionCreateWithoutChallengeInput, LabSessionUncheckedCreateWithoutChallengeInput>
  }

  export type LabSessionUpdateWithWhereUniqueWithoutChallengeInput = {
    where: LabSessionWhereUniqueInput
    data: XOR<LabSessionUpdateWithoutChallengeInput, LabSessionUncheckedUpdateWithoutChallengeInput>
  }

  export type LabSessionUpdateManyWithWhereWithoutChallengeInput = {
    where: LabSessionScalarWhereInput
    data: XOR<LabSessionUpdateManyMutationInput, LabSessionUncheckedUpdateManyWithoutChallengeInput>
  }

  export type LabSessionScalarWhereInput = {
    AND?: LabSessionScalarWhereInput | LabSessionScalarWhereInput[]
    OR?: LabSessionScalarWhereInput[]
    NOT?: LabSessionScalarWhereInput | LabSessionScalarWhereInput[]
    id?: StringFilter<"LabSession"> | string
    userId?: StringFilter<"LabSession"> | string
    challengeId?: StringFilter<"LabSession"> | string
    status?: StringFilter<"LabSession"> | string
    codeServerUrl?: StringNullableFilter<"LabSession"> | string | null
    codeServerToken?: StringNullableFilter<"LabSession"> | string | null
    appUrl?: StringNullableFilter<"LabSession"> | string | null
    containerId?: StringNullableFilter<"LabSession"> | string | null
    lastHeartbeat?: DateTimeNullableFilter<"LabSession"> | Date | string | null
    createdAt?: DateTimeFilter<"LabSession"> | Date | string
    updatedAt?: DateTimeFilter<"LabSession"> | Date | string
  }

  export type LabChallengeCreateWithoutSessionsInput = {
    courseId?: string | null
    moduleId?: string | null
    lessonId?: string | null
    id?: string
    title: string
    slug: string
    description: string
    difficulty: string
    starterRepoUrl?: string | null
    testsRepoUrl?: string | null
    runtime?: string | null
    createdByUserId: string
    visibility?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LabChallengeUncheckedCreateWithoutSessionsInput = {
    courseId?: string | null
    moduleId?: string | null
    lessonId?: string | null
    id?: string
    title: string
    slug: string
    description: string
    difficulty: string
    starterRepoUrl?: string | null
    testsRepoUrl?: string | null
    runtime?: string | null
    createdByUserId: string
    visibility?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LabChallengeCreateOrConnectWithoutSessionsInput = {
    where: LabChallengeWhereUniqueInput
    create: XOR<LabChallengeCreateWithoutSessionsInput, LabChallengeUncheckedCreateWithoutSessionsInput>
  }

  export type SubmissionCreateWithoutSessionInput = {
    id?: string
    status?: string
    passed?: boolean
    gradePct?: number | null
    feedback?: string | null
    artifactsUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubmissionUncheckedCreateWithoutSessionInput = {
    id?: string
    status?: string
    passed?: boolean
    gradePct?: number | null
    feedback?: string | null
    artifactsUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubmissionCreateOrConnectWithoutSessionInput = {
    where: SubmissionWhereUniqueInput
    create: XOR<SubmissionCreateWithoutSessionInput, SubmissionUncheckedCreateWithoutSessionInput>
  }

  export type SubmissionCreateManySessionInputEnvelope = {
    data: SubmissionCreateManySessionInput | SubmissionCreateManySessionInput[]
  }

  export type LabWorkspaceCreateWithoutSessionInput = {
    id?: string
    path: string
    repoUrl?: string | null
    branch?: string | null
  }

  export type LabWorkspaceUncheckedCreateWithoutSessionInput = {
    id?: string
    path: string
    repoUrl?: string | null
    branch?: string | null
  }

  export type LabWorkspaceCreateOrConnectWithoutSessionInput = {
    where: LabWorkspaceWhereUniqueInput
    create: XOR<LabWorkspaceCreateWithoutSessionInput, LabWorkspaceUncheckedCreateWithoutSessionInput>
  }

  export type LabWorkspaceCreateManySessionInputEnvelope = {
    data: LabWorkspaceCreateManySessionInput | LabWorkspaceCreateManySessionInput[]
  }

  export type LabChallengeUpsertWithoutSessionsInput = {
    update: XOR<LabChallengeUpdateWithoutSessionsInput, LabChallengeUncheckedUpdateWithoutSessionsInput>
    create: XOR<LabChallengeCreateWithoutSessionsInput, LabChallengeUncheckedCreateWithoutSessionsInput>
    where?: LabChallengeWhereInput
  }

  export type LabChallengeUpdateToOneWithWhereWithoutSessionsInput = {
    where?: LabChallengeWhereInput
    data: XOR<LabChallengeUpdateWithoutSessionsInput, LabChallengeUncheckedUpdateWithoutSessionsInput>
  }

  export type LabChallengeUpdateWithoutSessionsInput = {
    courseId?: NullableStringFieldUpdateOperationsInput | string | null
    moduleId?: NullableStringFieldUpdateOperationsInput | string | null
    lessonId?: NullableStringFieldUpdateOperationsInput | string | null
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    starterRepoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    testsRepoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    runtime?: NullableStringFieldUpdateOperationsInput | string | null
    createdByUserId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabChallengeUncheckedUpdateWithoutSessionsInput = {
    courseId?: NullableStringFieldUpdateOperationsInput | string | null
    moduleId?: NullableStringFieldUpdateOperationsInput | string | null
    lessonId?: NullableStringFieldUpdateOperationsInput | string | null
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    starterRepoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    testsRepoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    runtime?: NullableStringFieldUpdateOperationsInput | string | null
    createdByUserId?: StringFieldUpdateOperationsInput | string
    visibility?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionUpsertWithWhereUniqueWithoutSessionInput = {
    where: SubmissionWhereUniqueInput
    update: XOR<SubmissionUpdateWithoutSessionInput, SubmissionUncheckedUpdateWithoutSessionInput>
    create: XOR<SubmissionCreateWithoutSessionInput, SubmissionUncheckedCreateWithoutSessionInput>
  }

  export type SubmissionUpdateWithWhereUniqueWithoutSessionInput = {
    where: SubmissionWhereUniqueInput
    data: XOR<SubmissionUpdateWithoutSessionInput, SubmissionUncheckedUpdateWithoutSessionInput>
  }

  export type SubmissionUpdateManyWithWhereWithoutSessionInput = {
    where: SubmissionScalarWhereInput
    data: XOR<SubmissionUpdateManyMutationInput, SubmissionUncheckedUpdateManyWithoutSessionInput>
  }

  export type SubmissionScalarWhereInput = {
    AND?: SubmissionScalarWhereInput | SubmissionScalarWhereInput[]
    OR?: SubmissionScalarWhereInput[]
    NOT?: SubmissionScalarWhereInput | SubmissionScalarWhereInput[]
    id?: StringFilter<"Submission"> | string
    sessionId?: StringFilter<"Submission"> | string
    status?: StringFilter<"Submission"> | string
    passed?: BoolFilter<"Submission"> | boolean
    gradePct?: FloatNullableFilter<"Submission"> | number | null
    feedback?: StringNullableFilter<"Submission"> | string | null
    artifactsUrl?: StringNullableFilter<"Submission"> | string | null
    createdAt?: DateTimeFilter<"Submission"> | Date | string
    updatedAt?: DateTimeFilter<"Submission"> | Date | string
  }

  export type LabWorkspaceUpsertWithWhereUniqueWithoutSessionInput = {
    where: LabWorkspaceWhereUniqueInput
    update: XOR<LabWorkspaceUpdateWithoutSessionInput, LabWorkspaceUncheckedUpdateWithoutSessionInput>
    create: XOR<LabWorkspaceCreateWithoutSessionInput, LabWorkspaceUncheckedCreateWithoutSessionInput>
  }

  export type LabWorkspaceUpdateWithWhereUniqueWithoutSessionInput = {
    where: LabWorkspaceWhereUniqueInput
    data: XOR<LabWorkspaceUpdateWithoutSessionInput, LabWorkspaceUncheckedUpdateWithoutSessionInput>
  }

  export type LabWorkspaceUpdateManyWithWhereWithoutSessionInput = {
    where: LabWorkspaceScalarWhereInput
    data: XOR<LabWorkspaceUpdateManyMutationInput, LabWorkspaceUncheckedUpdateManyWithoutSessionInput>
  }

  export type LabWorkspaceScalarWhereInput = {
    AND?: LabWorkspaceScalarWhereInput | LabWorkspaceScalarWhereInput[]
    OR?: LabWorkspaceScalarWhereInput[]
    NOT?: LabWorkspaceScalarWhereInput | LabWorkspaceScalarWhereInput[]
    id?: StringFilter<"LabWorkspace"> | string
    sessionId?: StringFilter<"LabWorkspace"> | string
    path?: StringFilter<"LabWorkspace"> | string
    repoUrl?: StringNullableFilter<"LabWorkspace"> | string | null
    branch?: StringNullableFilter<"LabWorkspace"> | string | null
  }

  export type LabSessionCreateWithoutWorkspacesInput = {
    id?: string
    userId: string
    status?: string
    codeServerUrl?: string | null
    codeServerToken?: string | null
    appUrl?: string | null
    containerId?: string | null
    lastHeartbeat?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    challenge: LabChallengeCreateNestedOneWithoutSessionsInput
    submissions?: SubmissionCreateNestedManyWithoutSessionInput
  }

  export type LabSessionUncheckedCreateWithoutWorkspacesInput = {
    id?: string
    userId: string
    challengeId: string
    status?: string
    codeServerUrl?: string | null
    codeServerToken?: string | null
    appUrl?: string | null
    containerId?: string | null
    lastHeartbeat?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    submissions?: SubmissionUncheckedCreateNestedManyWithoutSessionInput
  }

  export type LabSessionCreateOrConnectWithoutWorkspacesInput = {
    where: LabSessionWhereUniqueInput
    create: XOR<LabSessionCreateWithoutWorkspacesInput, LabSessionUncheckedCreateWithoutWorkspacesInput>
  }

  export type LabSessionUpsertWithoutWorkspacesInput = {
    update: XOR<LabSessionUpdateWithoutWorkspacesInput, LabSessionUncheckedUpdateWithoutWorkspacesInput>
    create: XOR<LabSessionCreateWithoutWorkspacesInput, LabSessionUncheckedCreateWithoutWorkspacesInput>
    where?: LabSessionWhereInput
  }

  export type LabSessionUpdateToOneWithWhereWithoutWorkspacesInput = {
    where?: LabSessionWhereInput
    data: XOR<LabSessionUpdateWithoutWorkspacesInput, LabSessionUncheckedUpdateWithoutWorkspacesInput>
  }

  export type LabSessionUpdateWithoutWorkspacesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    codeServerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codeServerToken?: NullableStringFieldUpdateOperationsInput | string | null
    appUrl?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    lastHeartbeat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    challenge?: LabChallengeUpdateOneRequiredWithoutSessionsNestedInput
    submissions?: SubmissionUpdateManyWithoutSessionNestedInput
  }

  export type LabSessionUncheckedUpdateWithoutWorkspacesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    challengeId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    codeServerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codeServerToken?: NullableStringFieldUpdateOperationsInput | string | null
    appUrl?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    lastHeartbeat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissions?: SubmissionUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type LabSessionCreateWithoutSubmissionsInput = {
    id?: string
    userId: string
    status?: string
    codeServerUrl?: string | null
    codeServerToken?: string | null
    appUrl?: string | null
    containerId?: string | null
    lastHeartbeat?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    challenge: LabChallengeCreateNestedOneWithoutSessionsInput
    workspaces?: LabWorkspaceCreateNestedManyWithoutSessionInput
  }

  export type LabSessionUncheckedCreateWithoutSubmissionsInput = {
    id?: string
    userId: string
    challengeId: string
    status?: string
    codeServerUrl?: string | null
    codeServerToken?: string | null
    appUrl?: string | null
    containerId?: string | null
    lastHeartbeat?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    workspaces?: LabWorkspaceUncheckedCreateNestedManyWithoutSessionInput
  }

  export type LabSessionCreateOrConnectWithoutSubmissionsInput = {
    where: LabSessionWhereUniqueInput
    create: XOR<LabSessionCreateWithoutSubmissionsInput, LabSessionUncheckedCreateWithoutSubmissionsInput>
  }

  export type LabSessionUpsertWithoutSubmissionsInput = {
    update: XOR<LabSessionUpdateWithoutSubmissionsInput, LabSessionUncheckedUpdateWithoutSubmissionsInput>
    create: XOR<LabSessionCreateWithoutSubmissionsInput, LabSessionUncheckedCreateWithoutSubmissionsInput>
    where?: LabSessionWhereInput
  }

  export type LabSessionUpdateToOneWithWhereWithoutSubmissionsInput = {
    where?: LabSessionWhereInput
    data: XOR<LabSessionUpdateWithoutSubmissionsInput, LabSessionUncheckedUpdateWithoutSubmissionsInput>
  }

  export type LabSessionUpdateWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    codeServerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codeServerToken?: NullableStringFieldUpdateOperationsInput | string | null
    appUrl?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    lastHeartbeat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    challenge?: LabChallengeUpdateOneRequiredWithoutSessionsNestedInput
    workspaces?: LabWorkspaceUpdateManyWithoutSessionNestedInput
  }

  export type LabSessionUncheckedUpdateWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    challengeId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    codeServerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codeServerToken?: NullableStringFieldUpdateOperationsInput | string | null
    appUrl?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    lastHeartbeat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspaces?: LabWorkspaceUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type LabSessionCreateManyChallengeInput = {
    id?: string
    userId: string
    status?: string
    codeServerUrl?: string | null
    codeServerToken?: string | null
    appUrl?: string | null
    containerId?: string | null
    lastHeartbeat?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LabSessionUpdateWithoutChallengeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    codeServerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codeServerToken?: NullableStringFieldUpdateOperationsInput | string | null
    appUrl?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    lastHeartbeat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissions?: SubmissionUpdateManyWithoutSessionNestedInput
    workspaces?: LabWorkspaceUpdateManyWithoutSessionNestedInput
  }

  export type LabSessionUncheckedUpdateWithoutChallengeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    codeServerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codeServerToken?: NullableStringFieldUpdateOperationsInput | string | null
    appUrl?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    lastHeartbeat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissions?: SubmissionUncheckedUpdateManyWithoutSessionNestedInput
    workspaces?: LabWorkspaceUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type LabSessionUncheckedUpdateManyWithoutChallengeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    codeServerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    codeServerToken?: NullableStringFieldUpdateOperationsInput | string | null
    appUrl?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    lastHeartbeat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionCreateManySessionInput = {
    id?: string
    status?: string
    passed?: boolean
    gradePct?: number | null
    feedback?: string | null
    artifactsUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LabWorkspaceCreateManySessionInput = {
    id?: string
    path: string
    repoUrl?: string | null
    branch?: string | null
  }

  export type SubmissionUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    passed?: BoolFieldUpdateOperationsInput | boolean
    gradePct?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    artifactsUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    passed?: BoolFieldUpdateOperationsInput | boolean
    gradePct?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    artifactsUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    passed?: BoolFieldUpdateOperationsInput | boolean
    gradePct?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    artifactsUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabWorkspaceUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    branch?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LabWorkspaceUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    branch?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LabWorkspaceUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    branch?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use LabChallengeCountOutputTypeDefaultArgs instead
     */
    export type LabChallengeCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LabChallengeCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LabSessionCountOutputTypeDefaultArgs instead
     */
    export type LabSessionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LabSessionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LabChallengeDefaultArgs instead
     */
    export type LabChallengeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LabChallengeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LabSessionDefaultArgs instead
     */
    export type LabSessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LabSessionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LabWorkspaceDefaultArgs instead
     */
    export type LabWorkspaceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LabWorkspaceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SubmissionDefaultArgs instead
     */
    export type SubmissionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SubmissionDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}