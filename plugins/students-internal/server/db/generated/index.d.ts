
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
 * Model StudentNote
 * 
 */
export type StudentNote = $Result.DefaultSelection<Prisma.$StudentNotePayload>
/**
 * Model Course
 * 
 */
export type Course = $Result.DefaultSelection<Prisma.$CoursePayload>
/**
 * Model GradebookEntry
 * 
 */
export type GradebookEntry = $Result.DefaultSelection<Prisma.$GradebookEntryPayload>
/**
 * Model UserKV
 * 
 */
export type UserKV = $Result.DefaultSelection<Prisma.$UserKVPayload>
/**
 * Model KV
 * 
 */
export type KV = $Result.DefaultSelection<Prisma.$KVPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more StudentNotes
 * const studentNotes = await prisma.studentNote.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * // Fetch zero or more StudentNotes
   * const studentNotes = await prisma.studentNote.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

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


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.studentNote`: Exposes CRUD operations for the **StudentNote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StudentNotes
    * const studentNotes = await prisma.studentNote.findMany()
    * ```
    */
  get studentNote(): Prisma.StudentNoteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.course`: Exposes CRUD operations for the **Course** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Courses
    * const courses = await prisma.course.findMany()
    * ```
    */
  get course(): Prisma.CourseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gradebookEntry`: Exposes CRUD operations for the **GradebookEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GradebookEntries
    * const gradebookEntries = await prisma.gradebookEntry.findMany()
    * ```
    */
  get gradebookEntry(): Prisma.GradebookEntryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userKV`: Exposes CRUD operations for the **UserKV** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserKVS
    * const userKVS = await prisma.userKV.findMany()
    * ```
    */
  get userKV(): Prisma.UserKVDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.kV`: Exposes CRUD operations for the **KV** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KVS
    * const kVS = await prisma.kV.findMany()
    * ```
    */
  get kV(): Prisma.KVDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.18.0
   * Query Engine version: 34b5a692b7bd79939a9a2c3ef97d816e749cda2f
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

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
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
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
    StudentNote: 'StudentNote',
    Course: 'Course',
    GradebookEntry: 'GradebookEntry',
    UserKV: 'UserKV',
    KV: 'KV'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "studentNote" | "course" | "gradebookEntry" | "userKV" | "kV"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      StudentNote: {
        payload: Prisma.$StudentNotePayload<ExtArgs>
        fields: Prisma.StudentNoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudentNoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentNotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudentNoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentNotePayload>
          }
          findFirst: {
            args: Prisma.StudentNoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentNotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudentNoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentNotePayload>
          }
          findMany: {
            args: Prisma.StudentNoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentNotePayload>[]
          }
          create: {
            args: Prisma.StudentNoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentNotePayload>
          }
          createMany: {
            args: Prisma.StudentNoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudentNoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentNotePayload>[]
          }
          delete: {
            args: Prisma.StudentNoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentNotePayload>
          }
          update: {
            args: Prisma.StudentNoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentNotePayload>
          }
          deleteMany: {
            args: Prisma.StudentNoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudentNoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StudentNoteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentNotePayload>[]
          }
          upsert: {
            args: Prisma.StudentNoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentNotePayload>
          }
          aggregate: {
            args: Prisma.StudentNoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudentNote>
          }
          groupBy: {
            args: Prisma.StudentNoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudentNoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudentNoteCountArgs<ExtArgs>
            result: $Utils.Optional<StudentNoteCountAggregateOutputType> | number
          }
        }
      }
      Course: {
        payload: Prisma.$CoursePayload<ExtArgs>
        fields: Prisma.CourseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CourseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CourseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          findFirst: {
            args: Prisma.CourseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CourseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          findMany: {
            args: Prisma.CourseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>[]
          }
          create: {
            args: Prisma.CourseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          createMany: {
            args: Prisma.CourseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CourseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>[]
          }
          delete: {
            args: Prisma.CourseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          update: {
            args: Prisma.CourseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          deleteMany: {
            args: Prisma.CourseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CourseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CourseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>[]
          }
          upsert: {
            args: Prisma.CourseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          aggregate: {
            args: Prisma.CourseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCourse>
          }
          groupBy: {
            args: Prisma.CourseGroupByArgs<ExtArgs>
            result: $Utils.Optional<CourseGroupByOutputType>[]
          }
          count: {
            args: Prisma.CourseCountArgs<ExtArgs>
            result: $Utils.Optional<CourseCountAggregateOutputType> | number
          }
        }
      }
      GradebookEntry: {
        payload: Prisma.$GradebookEntryPayload<ExtArgs>
        fields: Prisma.GradebookEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GradebookEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradebookEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GradebookEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradebookEntryPayload>
          }
          findFirst: {
            args: Prisma.GradebookEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradebookEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GradebookEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradebookEntryPayload>
          }
          findMany: {
            args: Prisma.GradebookEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradebookEntryPayload>[]
          }
          create: {
            args: Prisma.GradebookEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradebookEntryPayload>
          }
          createMany: {
            args: Prisma.GradebookEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GradebookEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradebookEntryPayload>[]
          }
          delete: {
            args: Prisma.GradebookEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradebookEntryPayload>
          }
          update: {
            args: Prisma.GradebookEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradebookEntryPayload>
          }
          deleteMany: {
            args: Prisma.GradebookEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GradebookEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GradebookEntryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradebookEntryPayload>[]
          }
          upsert: {
            args: Prisma.GradebookEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GradebookEntryPayload>
          }
          aggregate: {
            args: Prisma.GradebookEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGradebookEntry>
          }
          groupBy: {
            args: Prisma.GradebookEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<GradebookEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.GradebookEntryCountArgs<ExtArgs>
            result: $Utils.Optional<GradebookEntryCountAggregateOutputType> | number
          }
        }
      }
      UserKV: {
        payload: Prisma.$UserKVPayload<ExtArgs>
        fields: Prisma.UserKVFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserKVFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserKVPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserKVFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserKVPayload>
          }
          findFirst: {
            args: Prisma.UserKVFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserKVPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserKVFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserKVPayload>
          }
          findMany: {
            args: Prisma.UserKVFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserKVPayload>[]
          }
          create: {
            args: Prisma.UserKVCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserKVPayload>
          }
          createMany: {
            args: Prisma.UserKVCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserKVCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserKVPayload>[]
          }
          delete: {
            args: Prisma.UserKVDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserKVPayload>
          }
          update: {
            args: Prisma.UserKVUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserKVPayload>
          }
          deleteMany: {
            args: Prisma.UserKVDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserKVUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserKVUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserKVPayload>[]
          }
          upsert: {
            args: Prisma.UserKVUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserKVPayload>
          }
          aggregate: {
            args: Prisma.UserKVAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserKV>
          }
          groupBy: {
            args: Prisma.UserKVGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserKVGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserKVCountArgs<ExtArgs>
            result: $Utils.Optional<UserKVCountAggregateOutputType> | number
          }
        }
      }
      KV: {
        payload: Prisma.$KVPayload<ExtArgs>
        fields: Prisma.KVFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KVFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KVPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KVFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KVPayload>
          }
          findFirst: {
            args: Prisma.KVFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KVPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KVFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KVPayload>
          }
          findMany: {
            args: Prisma.KVFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KVPayload>[]
          }
          create: {
            args: Prisma.KVCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KVPayload>
          }
          createMany: {
            args: Prisma.KVCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KVCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KVPayload>[]
          }
          delete: {
            args: Prisma.KVDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KVPayload>
          }
          update: {
            args: Prisma.KVUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KVPayload>
          }
          deleteMany: {
            args: Prisma.KVDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KVUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KVUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KVPayload>[]
          }
          upsert: {
            args: Prisma.KVUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KVPayload>
          }
          aggregate: {
            args: Prisma.KVAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKV>
          }
          groupBy: {
            args: Prisma.KVGroupByArgs<ExtArgs>
            result: $Utils.Optional<KVGroupByOutputType>[]
          }
          count: {
            args: Prisma.KVCountArgs<ExtArgs>
            result: $Utils.Optional<KVCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
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
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
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
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    studentNote?: StudentNoteOmit
    course?: CourseOmit
    gradebookEntry?: GradebookEntryOmit
    userKV?: UserKVOmit
    kV?: KVOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

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
    | 'updateManyAndReturn'
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
   * Models
   */

  /**
   * Model StudentNote
   */

  export type AggregateStudentNote = {
    _count: StudentNoteCountAggregateOutputType | null
    _min: StudentNoteMinAggregateOutputType | null
    _max: StudentNoteMaxAggregateOutputType | null
  }

  export type StudentNoteMinAggregateOutputType = {
    id: string | null
    studentId: string | null
    courseId: string | null
    body: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StudentNoteMaxAggregateOutputType = {
    id: string | null
    studentId: string | null
    courseId: string | null
    body: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StudentNoteCountAggregateOutputType = {
    id: number
    studentId: number
    courseId: number
    body: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StudentNoteMinAggregateInputType = {
    id?: true
    studentId?: true
    courseId?: true
    body?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StudentNoteMaxAggregateInputType = {
    id?: true
    studentId?: true
    courseId?: true
    body?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StudentNoteCountAggregateInputType = {
    id?: true
    studentId?: true
    courseId?: true
    body?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StudentNoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentNote to aggregate.
     */
    where?: StudentNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentNotes to fetch.
     */
    orderBy?: StudentNoteOrderByWithRelationInput | StudentNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudentNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StudentNotes
    **/
    _count?: true | StudentNoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudentNoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudentNoteMaxAggregateInputType
  }

  export type GetStudentNoteAggregateType<T extends StudentNoteAggregateArgs> = {
        [P in keyof T & keyof AggregateStudentNote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudentNote[P]>
      : GetScalarType<T[P], AggregateStudentNote[P]>
  }




  export type StudentNoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentNoteWhereInput
    orderBy?: StudentNoteOrderByWithAggregationInput | StudentNoteOrderByWithAggregationInput[]
    by: StudentNoteScalarFieldEnum[] | StudentNoteScalarFieldEnum
    having?: StudentNoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudentNoteCountAggregateInputType | true
    _min?: StudentNoteMinAggregateInputType
    _max?: StudentNoteMaxAggregateInputType
  }

  export type StudentNoteGroupByOutputType = {
    id: string
    studentId: string
    courseId: string
    body: string
    createdAt: Date
    updatedAt: Date
    _count: StudentNoteCountAggregateOutputType | null
    _min: StudentNoteMinAggregateOutputType | null
    _max: StudentNoteMaxAggregateOutputType | null
  }

  type GetStudentNoteGroupByPayload<T extends StudentNoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudentNoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudentNoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudentNoteGroupByOutputType[P]>
            : GetScalarType<T[P], StudentNoteGroupByOutputType[P]>
        }
      >
    >


  export type StudentNoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    courseId?: boolean
    body?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["studentNote"]>

  export type StudentNoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    courseId?: boolean
    body?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["studentNote"]>

  export type StudentNoteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    courseId?: boolean
    body?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["studentNote"]>

  export type StudentNoteSelectScalar = {
    id?: boolean
    studentId?: boolean
    courseId?: boolean
    body?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StudentNoteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "studentId" | "courseId" | "body" | "createdAt" | "updatedAt", ExtArgs["result"]["studentNote"]>

  export type $StudentNotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StudentNote"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studentId: string
      courseId: string
      body: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["studentNote"]>
    composites: {}
  }

  type StudentNoteGetPayload<S extends boolean | null | undefined | StudentNoteDefaultArgs> = $Result.GetResult<Prisma.$StudentNotePayload, S>

  type StudentNoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StudentNoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StudentNoteCountAggregateInputType | true
    }

  export interface StudentNoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StudentNote'], meta: { name: 'StudentNote' } }
    /**
     * Find zero or one StudentNote that matches the filter.
     * @param {StudentNoteFindUniqueArgs} args - Arguments to find a StudentNote
     * @example
     * // Get one StudentNote
     * const studentNote = await prisma.studentNote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudentNoteFindUniqueArgs>(args: SelectSubset<T, StudentNoteFindUniqueArgs<ExtArgs>>): Prisma__StudentNoteClient<$Result.GetResult<Prisma.$StudentNotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StudentNote that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StudentNoteFindUniqueOrThrowArgs} args - Arguments to find a StudentNote
     * @example
     * // Get one StudentNote
     * const studentNote = await prisma.studentNote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudentNoteFindUniqueOrThrowArgs>(args: SelectSubset<T, StudentNoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudentNoteClient<$Result.GetResult<Prisma.$StudentNotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StudentNote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentNoteFindFirstArgs} args - Arguments to find a StudentNote
     * @example
     * // Get one StudentNote
     * const studentNote = await prisma.studentNote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudentNoteFindFirstArgs>(args?: SelectSubset<T, StudentNoteFindFirstArgs<ExtArgs>>): Prisma__StudentNoteClient<$Result.GetResult<Prisma.$StudentNotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StudentNote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentNoteFindFirstOrThrowArgs} args - Arguments to find a StudentNote
     * @example
     * // Get one StudentNote
     * const studentNote = await prisma.studentNote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudentNoteFindFirstOrThrowArgs>(args?: SelectSubset<T, StudentNoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudentNoteClient<$Result.GetResult<Prisma.$StudentNotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StudentNotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentNoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StudentNotes
     * const studentNotes = await prisma.studentNote.findMany()
     * 
     * // Get first 10 StudentNotes
     * const studentNotes = await prisma.studentNote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studentNoteWithIdOnly = await prisma.studentNote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudentNoteFindManyArgs>(args?: SelectSubset<T, StudentNoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentNotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StudentNote.
     * @param {StudentNoteCreateArgs} args - Arguments to create a StudentNote.
     * @example
     * // Create one StudentNote
     * const StudentNote = await prisma.studentNote.create({
     *   data: {
     *     // ... data to create a StudentNote
     *   }
     * })
     * 
     */
    create<T extends StudentNoteCreateArgs>(args: SelectSubset<T, StudentNoteCreateArgs<ExtArgs>>): Prisma__StudentNoteClient<$Result.GetResult<Prisma.$StudentNotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StudentNotes.
     * @param {StudentNoteCreateManyArgs} args - Arguments to create many StudentNotes.
     * @example
     * // Create many StudentNotes
     * const studentNote = await prisma.studentNote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudentNoteCreateManyArgs>(args?: SelectSubset<T, StudentNoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StudentNotes and returns the data saved in the database.
     * @param {StudentNoteCreateManyAndReturnArgs} args - Arguments to create many StudentNotes.
     * @example
     * // Create many StudentNotes
     * const studentNote = await prisma.studentNote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StudentNotes and only return the `id`
     * const studentNoteWithIdOnly = await prisma.studentNote.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudentNoteCreateManyAndReturnArgs>(args?: SelectSubset<T, StudentNoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentNotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StudentNote.
     * @param {StudentNoteDeleteArgs} args - Arguments to delete one StudentNote.
     * @example
     * // Delete one StudentNote
     * const StudentNote = await prisma.studentNote.delete({
     *   where: {
     *     // ... filter to delete one StudentNote
     *   }
     * })
     * 
     */
    delete<T extends StudentNoteDeleteArgs>(args: SelectSubset<T, StudentNoteDeleteArgs<ExtArgs>>): Prisma__StudentNoteClient<$Result.GetResult<Prisma.$StudentNotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StudentNote.
     * @param {StudentNoteUpdateArgs} args - Arguments to update one StudentNote.
     * @example
     * // Update one StudentNote
     * const studentNote = await prisma.studentNote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudentNoteUpdateArgs>(args: SelectSubset<T, StudentNoteUpdateArgs<ExtArgs>>): Prisma__StudentNoteClient<$Result.GetResult<Prisma.$StudentNotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StudentNotes.
     * @param {StudentNoteDeleteManyArgs} args - Arguments to filter StudentNotes to delete.
     * @example
     * // Delete a few StudentNotes
     * const { count } = await prisma.studentNote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudentNoteDeleteManyArgs>(args?: SelectSubset<T, StudentNoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudentNotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentNoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StudentNotes
     * const studentNote = await prisma.studentNote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudentNoteUpdateManyArgs>(args: SelectSubset<T, StudentNoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudentNotes and returns the data updated in the database.
     * @param {StudentNoteUpdateManyAndReturnArgs} args - Arguments to update many StudentNotes.
     * @example
     * // Update many StudentNotes
     * const studentNote = await prisma.studentNote.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StudentNotes and only return the `id`
     * const studentNoteWithIdOnly = await prisma.studentNote.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StudentNoteUpdateManyAndReturnArgs>(args: SelectSubset<T, StudentNoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentNotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StudentNote.
     * @param {StudentNoteUpsertArgs} args - Arguments to update or create a StudentNote.
     * @example
     * // Update or create a StudentNote
     * const studentNote = await prisma.studentNote.upsert({
     *   create: {
     *     // ... data to create a StudentNote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StudentNote we want to update
     *   }
     * })
     */
    upsert<T extends StudentNoteUpsertArgs>(args: SelectSubset<T, StudentNoteUpsertArgs<ExtArgs>>): Prisma__StudentNoteClient<$Result.GetResult<Prisma.$StudentNotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StudentNotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentNoteCountArgs} args - Arguments to filter StudentNotes to count.
     * @example
     * // Count the number of StudentNotes
     * const count = await prisma.studentNote.count({
     *   where: {
     *     // ... the filter for the StudentNotes we want to count
     *   }
     * })
    **/
    count<T extends StudentNoteCountArgs>(
      args?: Subset<T, StudentNoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudentNoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StudentNote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentNoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StudentNoteAggregateArgs>(args: Subset<T, StudentNoteAggregateArgs>): Prisma.PrismaPromise<GetStudentNoteAggregateType<T>>

    /**
     * Group by StudentNote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentNoteGroupByArgs} args - Group by arguments.
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
      T extends StudentNoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudentNoteGroupByArgs['orderBy'] }
        : { orderBy?: StudentNoteGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, StudentNoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentNoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StudentNote model
   */
  readonly fields: StudentNoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StudentNote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudentNoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StudentNote model
   */
  interface StudentNoteFieldRefs {
    readonly id: FieldRef<"StudentNote", 'String'>
    readonly studentId: FieldRef<"StudentNote", 'String'>
    readonly courseId: FieldRef<"StudentNote", 'String'>
    readonly body: FieldRef<"StudentNote", 'String'>
    readonly createdAt: FieldRef<"StudentNote", 'DateTime'>
    readonly updatedAt: FieldRef<"StudentNote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StudentNote findUnique
   */
  export type StudentNoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentNote
     */
    select?: StudentNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentNote
     */
    omit?: StudentNoteOmit<ExtArgs> | null
    /**
     * Filter, which StudentNote to fetch.
     */
    where: StudentNoteWhereUniqueInput
  }

  /**
   * StudentNote findUniqueOrThrow
   */
  export type StudentNoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentNote
     */
    select?: StudentNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentNote
     */
    omit?: StudentNoteOmit<ExtArgs> | null
    /**
     * Filter, which StudentNote to fetch.
     */
    where: StudentNoteWhereUniqueInput
  }

  /**
   * StudentNote findFirst
   */
  export type StudentNoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentNote
     */
    select?: StudentNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentNote
     */
    omit?: StudentNoteOmit<ExtArgs> | null
    /**
     * Filter, which StudentNote to fetch.
     */
    where?: StudentNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentNotes to fetch.
     */
    orderBy?: StudentNoteOrderByWithRelationInput | StudentNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentNotes.
     */
    cursor?: StudentNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentNotes.
     */
    distinct?: StudentNoteScalarFieldEnum | StudentNoteScalarFieldEnum[]
  }

  /**
   * StudentNote findFirstOrThrow
   */
  export type StudentNoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentNote
     */
    select?: StudentNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentNote
     */
    omit?: StudentNoteOmit<ExtArgs> | null
    /**
     * Filter, which StudentNote to fetch.
     */
    where?: StudentNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentNotes to fetch.
     */
    orderBy?: StudentNoteOrderByWithRelationInput | StudentNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentNotes.
     */
    cursor?: StudentNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentNotes.
     */
    distinct?: StudentNoteScalarFieldEnum | StudentNoteScalarFieldEnum[]
  }

  /**
   * StudentNote findMany
   */
  export type StudentNoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentNote
     */
    select?: StudentNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentNote
     */
    omit?: StudentNoteOmit<ExtArgs> | null
    /**
     * Filter, which StudentNotes to fetch.
     */
    where?: StudentNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentNotes to fetch.
     */
    orderBy?: StudentNoteOrderByWithRelationInput | StudentNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StudentNotes.
     */
    cursor?: StudentNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentNotes.
     */
    skip?: number
    distinct?: StudentNoteScalarFieldEnum | StudentNoteScalarFieldEnum[]
  }

  /**
   * StudentNote create
   */
  export type StudentNoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentNote
     */
    select?: StudentNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentNote
     */
    omit?: StudentNoteOmit<ExtArgs> | null
    /**
     * The data needed to create a StudentNote.
     */
    data: XOR<StudentNoteCreateInput, StudentNoteUncheckedCreateInput>
  }

  /**
   * StudentNote createMany
   */
  export type StudentNoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StudentNotes.
     */
    data: StudentNoteCreateManyInput | StudentNoteCreateManyInput[]
  }

  /**
   * StudentNote createManyAndReturn
   */
  export type StudentNoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentNote
     */
    select?: StudentNoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StudentNote
     */
    omit?: StudentNoteOmit<ExtArgs> | null
    /**
     * The data used to create many StudentNotes.
     */
    data: StudentNoteCreateManyInput | StudentNoteCreateManyInput[]
  }

  /**
   * StudentNote update
   */
  export type StudentNoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentNote
     */
    select?: StudentNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentNote
     */
    omit?: StudentNoteOmit<ExtArgs> | null
    /**
     * The data needed to update a StudentNote.
     */
    data: XOR<StudentNoteUpdateInput, StudentNoteUncheckedUpdateInput>
    /**
     * Choose, which StudentNote to update.
     */
    where: StudentNoteWhereUniqueInput
  }

  /**
   * StudentNote updateMany
   */
  export type StudentNoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StudentNotes.
     */
    data: XOR<StudentNoteUpdateManyMutationInput, StudentNoteUncheckedUpdateManyInput>
    /**
     * Filter which StudentNotes to update
     */
    where?: StudentNoteWhereInput
    /**
     * Limit how many StudentNotes to update.
     */
    limit?: number
  }

  /**
   * StudentNote updateManyAndReturn
   */
  export type StudentNoteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentNote
     */
    select?: StudentNoteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StudentNote
     */
    omit?: StudentNoteOmit<ExtArgs> | null
    /**
     * The data used to update StudentNotes.
     */
    data: XOR<StudentNoteUpdateManyMutationInput, StudentNoteUncheckedUpdateManyInput>
    /**
     * Filter which StudentNotes to update
     */
    where?: StudentNoteWhereInput
    /**
     * Limit how many StudentNotes to update.
     */
    limit?: number
  }

  /**
   * StudentNote upsert
   */
  export type StudentNoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentNote
     */
    select?: StudentNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentNote
     */
    omit?: StudentNoteOmit<ExtArgs> | null
    /**
     * The filter to search for the StudentNote to update in case it exists.
     */
    where: StudentNoteWhereUniqueInput
    /**
     * In case the StudentNote found by the `where` argument doesn't exist, create a new StudentNote with this data.
     */
    create: XOR<StudentNoteCreateInput, StudentNoteUncheckedCreateInput>
    /**
     * In case the StudentNote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudentNoteUpdateInput, StudentNoteUncheckedUpdateInput>
  }

  /**
   * StudentNote delete
   */
  export type StudentNoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentNote
     */
    select?: StudentNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentNote
     */
    omit?: StudentNoteOmit<ExtArgs> | null
    /**
     * Filter which StudentNote to delete.
     */
    where: StudentNoteWhereUniqueInput
  }

  /**
   * StudentNote deleteMany
   */
  export type StudentNoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentNotes to delete
     */
    where?: StudentNoteWhereInput
    /**
     * Limit how many StudentNotes to delete.
     */
    limit?: number
  }

  /**
   * StudentNote without action
   */
  export type StudentNoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentNote
     */
    select?: StudentNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentNote
     */
    omit?: StudentNoteOmit<ExtArgs> | null
  }


  /**
   * Model Course
   */

  export type AggregateCourse = {
    _count: CourseCountAggregateOutputType | null
    _avg: CourseAvgAggregateOutputType | null
    _sum: CourseSumAggregateOutputType | null
    _min: CourseMinAggregateOutputType | null
    _max: CourseMaxAggregateOutputType | null
  }

  export type CourseAvgAggregateOutputType = {
    progressPct: number | null
  }

  export type CourseSumAggregateOutputType = {
    progressPct: number | null
  }

  export type CourseMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    progressPct: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CourseMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    progressPct: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CourseCountAggregateOutputType = {
    id: number
    title: number
    description: number
    progressPct: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CourseAvgAggregateInputType = {
    progressPct?: true
  }

  export type CourseSumAggregateInputType = {
    progressPct?: true
  }

  export type CourseMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    progressPct?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CourseMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    progressPct?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CourseCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    progressPct?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CourseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Course to aggregate.
     */
    where?: CourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courses to fetch.
     */
    orderBy?: CourseOrderByWithRelationInput | CourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Courses
    **/
    _count?: true | CourseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CourseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CourseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CourseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CourseMaxAggregateInputType
  }

  export type GetCourseAggregateType<T extends CourseAggregateArgs> = {
        [P in keyof T & keyof AggregateCourse]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCourse[P]>
      : GetScalarType<T[P], AggregateCourse[P]>
  }




  export type CourseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CourseWhereInput
    orderBy?: CourseOrderByWithAggregationInput | CourseOrderByWithAggregationInput[]
    by: CourseScalarFieldEnum[] | CourseScalarFieldEnum
    having?: CourseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CourseCountAggregateInputType | true
    _avg?: CourseAvgAggregateInputType
    _sum?: CourseSumAggregateInputType
    _min?: CourseMinAggregateInputType
    _max?: CourseMaxAggregateInputType
  }

  export type CourseGroupByOutputType = {
    id: string
    title: string
    description: string | null
    progressPct: number
    createdAt: Date
    updatedAt: Date
    _count: CourseCountAggregateOutputType | null
    _avg: CourseAvgAggregateOutputType | null
    _sum: CourseSumAggregateOutputType | null
    _min: CourseMinAggregateOutputType | null
    _max: CourseMaxAggregateOutputType | null
  }

  type GetCourseGroupByPayload<T extends CourseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CourseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CourseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CourseGroupByOutputType[P]>
            : GetScalarType<T[P], CourseGroupByOutputType[P]>
        }
      >
    >


  export type CourseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    progressPct?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["course"]>

  export type CourseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    progressPct?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["course"]>

  export type CourseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    progressPct?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["course"]>

  export type CourseSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    progressPct?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CourseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "progressPct" | "createdAt" | "updatedAt", ExtArgs["result"]["course"]>

  export type $CoursePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Course"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      progressPct: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["course"]>
    composites: {}
  }

  type CourseGetPayload<S extends boolean | null | undefined | CourseDefaultArgs> = $Result.GetResult<Prisma.$CoursePayload, S>

  type CourseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CourseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CourseCountAggregateInputType | true
    }

  export interface CourseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Course'], meta: { name: 'Course' } }
    /**
     * Find zero or one Course that matches the filter.
     * @param {CourseFindUniqueArgs} args - Arguments to find a Course
     * @example
     * // Get one Course
     * const course = await prisma.course.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CourseFindUniqueArgs>(args: SelectSubset<T, CourseFindUniqueArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Course that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CourseFindUniqueOrThrowArgs} args - Arguments to find a Course
     * @example
     * // Get one Course
     * const course = await prisma.course.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CourseFindUniqueOrThrowArgs>(args: SelectSubset<T, CourseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Course that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseFindFirstArgs} args - Arguments to find a Course
     * @example
     * // Get one Course
     * const course = await prisma.course.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CourseFindFirstArgs>(args?: SelectSubset<T, CourseFindFirstArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Course that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseFindFirstOrThrowArgs} args - Arguments to find a Course
     * @example
     * // Get one Course
     * const course = await prisma.course.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CourseFindFirstOrThrowArgs>(args?: SelectSubset<T, CourseFindFirstOrThrowArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Courses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Courses
     * const courses = await prisma.course.findMany()
     * 
     * // Get first 10 Courses
     * const courses = await prisma.course.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const courseWithIdOnly = await prisma.course.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CourseFindManyArgs>(args?: SelectSubset<T, CourseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Course.
     * @param {CourseCreateArgs} args - Arguments to create a Course.
     * @example
     * // Create one Course
     * const Course = await prisma.course.create({
     *   data: {
     *     // ... data to create a Course
     *   }
     * })
     * 
     */
    create<T extends CourseCreateArgs>(args: SelectSubset<T, CourseCreateArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Courses.
     * @param {CourseCreateManyArgs} args - Arguments to create many Courses.
     * @example
     * // Create many Courses
     * const course = await prisma.course.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CourseCreateManyArgs>(args?: SelectSubset<T, CourseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Courses and returns the data saved in the database.
     * @param {CourseCreateManyAndReturnArgs} args - Arguments to create many Courses.
     * @example
     * // Create many Courses
     * const course = await prisma.course.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Courses and only return the `id`
     * const courseWithIdOnly = await prisma.course.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CourseCreateManyAndReturnArgs>(args?: SelectSubset<T, CourseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Course.
     * @param {CourseDeleteArgs} args - Arguments to delete one Course.
     * @example
     * // Delete one Course
     * const Course = await prisma.course.delete({
     *   where: {
     *     // ... filter to delete one Course
     *   }
     * })
     * 
     */
    delete<T extends CourseDeleteArgs>(args: SelectSubset<T, CourseDeleteArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Course.
     * @param {CourseUpdateArgs} args - Arguments to update one Course.
     * @example
     * // Update one Course
     * const course = await prisma.course.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CourseUpdateArgs>(args: SelectSubset<T, CourseUpdateArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Courses.
     * @param {CourseDeleteManyArgs} args - Arguments to filter Courses to delete.
     * @example
     * // Delete a few Courses
     * const { count } = await prisma.course.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CourseDeleteManyArgs>(args?: SelectSubset<T, CourseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Courses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Courses
     * const course = await prisma.course.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CourseUpdateManyArgs>(args: SelectSubset<T, CourseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Courses and returns the data updated in the database.
     * @param {CourseUpdateManyAndReturnArgs} args - Arguments to update many Courses.
     * @example
     * // Update many Courses
     * const course = await prisma.course.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Courses and only return the `id`
     * const courseWithIdOnly = await prisma.course.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CourseUpdateManyAndReturnArgs>(args: SelectSubset<T, CourseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Course.
     * @param {CourseUpsertArgs} args - Arguments to update or create a Course.
     * @example
     * // Update or create a Course
     * const course = await prisma.course.upsert({
     *   create: {
     *     // ... data to create a Course
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Course we want to update
     *   }
     * })
     */
    upsert<T extends CourseUpsertArgs>(args: SelectSubset<T, CourseUpsertArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Courses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseCountArgs} args - Arguments to filter Courses to count.
     * @example
     * // Count the number of Courses
     * const count = await prisma.course.count({
     *   where: {
     *     // ... the filter for the Courses we want to count
     *   }
     * })
    **/
    count<T extends CourseCountArgs>(
      args?: Subset<T, CourseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CourseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Course.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CourseAggregateArgs>(args: Subset<T, CourseAggregateArgs>): Prisma.PrismaPromise<GetCourseAggregateType<T>>

    /**
     * Group by Course.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseGroupByArgs} args - Group by arguments.
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
      T extends CourseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CourseGroupByArgs['orderBy'] }
        : { orderBy?: CourseGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CourseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Course model
   */
  readonly fields: CourseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Course.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CourseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Course model
   */
  interface CourseFieldRefs {
    readonly id: FieldRef<"Course", 'String'>
    readonly title: FieldRef<"Course", 'String'>
    readonly description: FieldRef<"Course", 'String'>
    readonly progressPct: FieldRef<"Course", 'Int'>
    readonly createdAt: FieldRef<"Course", 'DateTime'>
    readonly updatedAt: FieldRef<"Course", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Course findUnique
   */
  export type CourseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Filter, which Course to fetch.
     */
    where: CourseWhereUniqueInput
  }

  /**
   * Course findUniqueOrThrow
   */
  export type CourseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Filter, which Course to fetch.
     */
    where: CourseWhereUniqueInput
  }

  /**
   * Course findFirst
   */
  export type CourseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Filter, which Course to fetch.
     */
    where?: CourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courses to fetch.
     */
    orderBy?: CourseOrderByWithRelationInput | CourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Courses.
     */
    cursor?: CourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Courses.
     */
    distinct?: CourseScalarFieldEnum | CourseScalarFieldEnum[]
  }

  /**
   * Course findFirstOrThrow
   */
  export type CourseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Filter, which Course to fetch.
     */
    where?: CourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courses to fetch.
     */
    orderBy?: CourseOrderByWithRelationInput | CourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Courses.
     */
    cursor?: CourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Courses.
     */
    distinct?: CourseScalarFieldEnum | CourseScalarFieldEnum[]
  }

  /**
   * Course findMany
   */
  export type CourseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Filter, which Courses to fetch.
     */
    where?: CourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courses to fetch.
     */
    orderBy?: CourseOrderByWithRelationInput | CourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Courses.
     */
    cursor?: CourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courses.
     */
    skip?: number
    distinct?: CourseScalarFieldEnum | CourseScalarFieldEnum[]
  }

  /**
   * Course create
   */
  export type CourseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * The data needed to create a Course.
     */
    data: XOR<CourseCreateInput, CourseUncheckedCreateInput>
  }

  /**
   * Course createMany
   */
  export type CourseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Courses.
     */
    data: CourseCreateManyInput | CourseCreateManyInput[]
  }

  /**
   * Course createManyAndReturn
   */
  export type CourseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * The data used to create many Courses.
     */
    data: CourseCreateManyInput | CourseCreateManyInput[]
  }

  /**
   * Course update
   */
  export type CourseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * The data needed to update a Course.
     */
    data: XOR<CourseUpdateInput, CourseUncheckedUpdateInput>
    /**
     * Choose, which Course to update.
     */
    where: CourseWhereUniqueInput
  }

  /**
   * Course updateMany
   */
  export type CourseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Courses.
     */
    data: XOR<CourseUpdateManyMutationInput, CourseUncheckedUpdateManyInput>
    /**
     * Filter which Courses to update
     */
    where?: CourseWhereInput
    /**
     * Limit how many Courses to update.
     */
    limit?: number
  }

  /**
   * Course updateManyAndReturn
   */
  export type CourseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * The data used to update Courses.
     */
    data: XOR<CourseUpdateManyMutationInput, CourseUncheckedUpdateManyInput>
    /**
     * Filter which Courses to update
     */
    where?: CourseWhereInput
    /**
     * Limit how many Courses to update.
     */
    limit?: number
  }

  /**
   * Course upsert
   */
  export type CourseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * The filter to search for the Course to update in case it exists.
     */
    where: CourseWhereUniqueInput
    /**
     * In case the Course found by the `where` argument doesn't exist, create a new Course with this data.
     */
    create: XOR<CourseCreateInput, CourseUncheckedCreateInput>
    /**
     * In case the Course was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CourseUpdateInput, CourseUncheckedUpdateInput>
  }

  /**
   * Course delete
   */
  export type CourseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Filter which Course to delete.
     */
    where: CourseWhereUniqueInput
  }

  /**
   * Course deleteMany
   */
  export type CourseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Courses to delete
     */
    where?: CourseWhereInput
    /**
     * Limit how many Courses to delete.
     */
    limit?: number
  }

  /**
   * Course without action
   */
  export type CourseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
  }


  /**
   * Model GradebookEntry
   */

  export type AggregateGradebookEntry = {
    _count: GradebookEntryCountAggregateOutputType | null
    _avg: GradebookEntryAvgAggregateOutputType | null
    _sum: GradebookEntrySumAggregateOutputType | null
    _min: GradebookEntryMinAggregateOutputType | null
    _max: GradebookEntryMaxAggregateOutputType | null
  }

  export type GradebookEntryAvgAggregateOutputType = {
    grade: number | null
    progressPct: number | null
  }

  export type GradebookEntrySumAggregateOutputType = {
    grade: number | null
    progressPct: number | null
  }

  export type GradebookEntryMinAggregateOutputType = {
    id: string | null
    assignmentId: string | null
    studentId: string | null
    courseId: string | null
    grade: number | null
    feedback: string | null
    progressPct: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GradebookEntryMaxAggregateOutputType = {
    id: string | null
    assignmentId: string | null
    studentId: string | null
    courseId: string | null
    grade: number | null
    feedback: string | null
    progressPct: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GradebookEntryCountAggregateOutputType = {
    id: number
    assignmentId: number
    studentId: number
    courseId: number
    grade: number
    feedback: number
    progressPct: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GradebookEntryAvgAggregateInputType = {
    grade?: true
    progressPct?: true
  }

  export type GradebookEntrySumAggregateInputType = {
    grade?: true
    progressPct?: true
  }

  export type GradebookEntryMinAggregateInputType = {
    id?: true
    assignmentId?: true
    studentId?: true
    courseId?: true
    grade?: true
    feedback?: true
    progressPct?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GradebookEntryMaxAggregateInputType = {
    id?: true
    assignmentId?: true
    studentId?: true
    courseId?: true
    grade?: true
    feedback?: true
    progressPct?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GradebookEntryCountAggregateInputType = {
    id?: true
    assignmentId?: true
    studentId?: true
    courseId?: true
    grade?: true
    feedback?: true
    progressPct?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GradebookEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GradebookEntry to aggregate.
     */
    where?: GradebookEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GradebookEntries to fetch.
     */
    orderBy?: GradebookEntryOrderByWithRelationInput | GradebookEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GradebookEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GradebookEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GradebookEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GradebookEntries
    **/
    _count?: true | GradebookEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GradebookEntryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GradebookEntrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GradebookEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GradebookEntryMaxAggregateInputType
  }

  export type GetGradebookEntryAggregateType<T extends GradebookEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateGradebookEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGradebookEntry[P]>
      : GetScalarType<T[P], AggregateGradebookEntry[P]>
  }




  export type GradebookEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GradebookEntryWhereInput
    orderBy?: GradebookEntryOrderByWithAggregationInput | GradebookEntryOrderByWithAggregationInput[]
    by: GradebookEntryScalarFieldEnum[] | GradebookEntryScalarFieldEnum
    having?: GradebookEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GradebookEntryCountAggregateInputType | true
    _avg?: GradebookEntryAvgAggregateInputType
    _sum?: GradebookEntrySumAggregateInputType
    _min?: GradebookEntryMinAggregateInputType
    _max?: GradebookEntryMaxAggregateInputType
  }

  export type GradebookEntryGroupByOutputType = {
    id: string
    assignmentId: string
    studentId: string
    courseId: string
    grade: number | null
    feedback: string | null
    progressPct: number
    createdAt: Date
    updatedAt: Date
    _count: GradebookEntryCountAggregateOutputType | null
    _avg: GradebookEntryAvgAggregateOutputType | null
    _sum: GradebookEntrySumAggregateOutputType | null
    _min: GradebookEntryMinAggregateOutputType | null
    _max: GradebookEntryMaxAggregateOutputType | null
  }

  type GetGradebookEntryGroupByPayload<T extends GradebookEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GradebookEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GradebookEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GradebookEntryGroupByOutputType[P]>
            : GetScalarType<T[P], GradebookEntryGroupByOutputType[P]>
        }
      >
    >


  export type GradebookEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assignmentId?: boolean
    studentId?: boolean
    courseId?: boolean
    grade?: boolean
    feedback?: boolean
    progressPct?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["gradebookEntry"]>

  export type GradebookEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assignmentId?: boolean
    studentId?: boolean
    courseId?: boolean
    grade?: boolean
    feedback?: boolean
    progressPct?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["gradebookEntry"]>

  export type GradebookEntrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assignmentId?: boolean
    studentId?: boolean
    courseId?: boolean
    grade?: boolean
    feedback?: boolean
    progressPct?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["gradebookEntry"]>

  export type GradebookEntrySelectScalar = {
    id?: boolean
    assignmentId?: boolean
    studentId?: boolean
    courseId?: boolean
    grade?: boolean
    feedback?: boolean
    progressPct?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GradebookEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "assignmentId" | "studentId" | "courseId" | "grade" | "feedback" | "progressPct" | "createdAt" | "updatedAt", ExtArgs["result"]["gradebookEntry"]>

  export type $GradebookEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GradebookEntry"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      assignmentId: string
      studentId: string
      courseId: string
      grade: number | null
      feedback: string | null
      progressPct: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["gradebookEntry"]>
    composites: {}
  }

  type GradebookEntryGetPayload<S extends boolean | null | undefined | GradebookEntryDefaultArgs> = $Result.GetResult<Prisma.$GradebookEntryPayload, S>

  type GradebookEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GradebookEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GradebookEntryCountAggregateInputType | true
    }

  export interface GradebookEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GradebookEntry'], meta: { name: 'GradebookEntry' } }
    /**
     * Find zero or one GradebookEntry that matches the filter.
     * @param {GradebookEntryFindUniqueArgs} args - Arguments to find a GradebookEntry
     * @example
     * // Get one GradebookEntry
     * const gradebookEntry = await prisma.gradebookEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GradebookEntryFindUniqueArgs>(args: SelectSubset<T, GradebookEntryFindUniqueArgs<ExtArgs>>): Prisma__GradebookEntryClient<$Result.GetResult<Prisma.$GradebookEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GradebookEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GradebookEntryFindUniqueOrThrowArgs} args - Arguments to find a GradebookEntry
     * @example
     * // Get one GradebookEntry
     * const gradebookEntry = await prisma.gradebookEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GradebookEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, GradebookEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GradebookEntryClient<$Result.GetResult<Prisma.$GradebookEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GradebookEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradebookEntryFindFirstArgs} args - Arguments to find a GradebookEntry
     * @example
     * // Get one GradebookEntry
     * const gradebookEntry = await prisma.gradebookEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GradebookEntryFindFirstArgs>(args?: SelectSubset<T, GradebookEntryFindFirstArgs<ExtArgs>>): Prisma__GradebookEntryClient<$Result.GetResult<Prisma.$GradebookEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GradebookEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradebookEntryFindFirstOrThrowArgs} args - Arguments to find a GradebookEntry
     * @example
     * // Get one GradebookEntry
     * const gradebookEntry = await prisma.gradebookEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GradebookEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, GradebookEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__GradebookEntryClient<$Result.GetResult<Prisma.$GradebookEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GradebookEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradebookEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GradebookEntries
     * const gradebookEntries = await prisma.gradebookEntry.findMany()
     * 
     * // Get first 10 GradebookEntries
     * const gradebookEntries = await prisma.gradebookEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gradebookEntryWithIdOnly = await prisma.gradebookEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GradebookEntryFindManyArgs>(args?: SelectSubset<T, GradebookEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GradebookEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GradebookEntry.
     * @param {GradebookEntryCreateArgs} args - Arguments to create a GradebookEntry.
     * @example
     * // Create one GradebookEntry
     * const GradebookEntry = await prisma.gradebookEntry.create({
     *   data: {
     *     // ... data to create a GradebookEntry
     *   }
     * })
     * 
     */
    create<T extends GradebookEntryCreateArgs>(args: SelectSubset<T, GradebookEntryCreateArgs<ExtArgs>>): Prisma__GradebookEntryClient<$Result.GetResult<Prisma.$GradebookEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GradebookEntries.
     * @param {GradebookEntryCreateManyArgs} args - Arguments to create many GradebookEntries.
     * @example
     * // Create many GradebookEntries
     * const gradebookEntry = await prisma.gradebookEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GradebookEntryCreateManyArgs>(args?: SelectSubset<T, GradebookEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GradebookEntries and returns the data saved in the database.
     * @param {GradebookEntryCreateManyAndReturnArgs} args - Arguments to create many GradebookEntries.
     * @example
     * // Create many GradebookEntries
     * const gradebookEntry = await prisma.gradebookEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GradebookEntries and only return the `id`
     * const gradebookEntryWithIdOnly = await prisma.gradebookEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GradebookEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, GradebookEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GradebookEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GradebookEntry.
     * @param {GradebookEntryDeleteArgs} args - Arguments to delete one GradebookEntry.
     * @example
     * // Delete one GradebookEntry
     * const GradebookEntry = await prisma.gradebookEntry.delete({
     *   where: {
     *     // ... filter to delete one GradebookEntry
     *   }
     * })
     * 
     */
    delete<T extends GradebookEntryDeleteArgs>(args: SelectSubset<T, GradebookEntryDeleteArgs<ExtArgs>>): Prisma__GradebookEntryClient<$Result.GetResult<Prisma.$GradebookEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GradebookEntry.
     * @param {GradebookEntryUpdateArgs} args - Arguments to update one GradebookEntry.
     * @example
     * // Update one GradebookEntry
     * const gradebookEntry = await prisma.gradebookEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GradebookEntryUpdateArgs>(args: SelectSubset<T, GradebookEntryUpdateArgs<ExtArgs>>): Prisma__GradebookEntryClient<$Result.GetResult<Prisma.$GradebookEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GradebookEntries.
     * @param {GradebookEntryDeleteManyArgs} args - Arguments to filter GradebookEntries to delete.
     * @example
     * // Delete a few GradebookEntries
     * const { count } = await prisma.gradebookEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GradebookEntryDeleteManyArgs>(args?: SelectSubset<T, GradebookEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GradebookEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradebookEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GradebookEntries
     * const gradebookEntry = await prisma.gradebookEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GradebookEntryUpdateManyArgs>(args: SelectSubset<T, GradebookEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GradebookEntries and returns the data updated in the database.
     * @param {GradebookEntryUpdateManyAndReturnArgs} args - Arguments to update many GradebookEntries.
     * @example
     * // Update many GradebookEntries
     * const gradebookEntry = await prisma.gradebookEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GradebookEntries and only return the `id`
     * const gradebookEntryWithIdOnly = await prisma.gradebookEntry.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GradebookEntryUpdateManyAndReturnArgs>(args: SelectSubset<T, GradebookEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GradebookEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GradebookEntry.
     * @param {GradebookEntryUpsertArgs} args - Arguments to update or create a GradebookEntry.
     * @example
     * // Update or create a GradebookEntry
     * const gradebookEntry = await prisma.gradebookEntry.upsert({
     *   create: {
     *     // ... data to create a GradebookEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GradebookEntry we want to update
     *   }
     * })
     */
    upsert<T extends GradebookEntryUpsertArgs>(args: SelectSubset<T, GradebookEntryUpsertArgs<ExtArgs>>): Prisma__GradebookEntryClient<$Result.GetResult<Prisma.$GradebookEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GradebookEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradebookEntryCountArgs} args - Arguments to filter GradebookEntries to count.
     * @example
     * // Count the number of GradebookEntries
     * const count = await prisma.gradebookEntry.count({
     *   where: {
     *     // ... the filter for the GradebookEntries we want to count
     *   }
     * })
    **/
    count<T extends GradebookEntryCountArgs>(
      args?: Subset<T, GradebookEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GradebookEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GradebookEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradebookEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GradebookEntryAggregateArgs>(args: Subset<T, GradebookEntryAggregateArgs>): Prisma.PrismaPromise<GetGradebookEntryAggregateType<T>>

    /**
     * Group by GradebookEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradebookEntryGroupByArgs} args - Group by arguments.
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
      T extends GradebookEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GradebookEntryGroupByArgs['orderBy'] }
        : { orderBy?: GradebookEntryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GradebookEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGradebookEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GradebookEntry model
   */
  readonly fields: GradebookEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GradebookEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GradebookEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GradebookEntry model
   */
  interface GradebookEntryFieldRefs {
    readonly id: FieldRef<"GradebookEntry", 'String'>
    readonly assignmentId: FieldRef<"GradebookEntry", 'String'>
    readonly studentId: FieldRef<"GradebookEntry", 'String'>
    readonly courseId: FieldRef<"GradebookEntry", 'String'>
    readonly grade: FieldRef<"GradebookEntry", 'Float'>
    readonly feedback: FieldRef<"GradebookEntry", 'String'>
    readonly progressPct: FieldRef<"GradebookEntry", 'Int'>
    readonly createdAt: FieldRef<"GradebookEntry", 'DateTime'>
    readonly updatedAt: FieldRef<"GradebookEntry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GradebookEntry findUnique
   */
  export type GradebookEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GradebookEntry
     */
    select?: GradebookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GradebookEntry
     */
    omit?: GradebookEntryOmit<ExtArgs> | null
    /**
     * Filter, which GradebookEntry to fetch.
     */
    where: GradebookEntryWhereUniqueInput
  }

  /**
   * GradebookEntry findUniqueOrThrow
   */
  export type GradebookEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GradebookEntry
     */
    select?: GradebookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GradebookEntry
     */
    omit?: GradebookEntryOmit<ExtArgs> | null
    /**
     * Filter, which GradebookEntry to fetch.
     */
    where: GradebookEntryWhereUniqueInput
  }

  /**
   * GradebookEntry findFirst
   */
  export type GradebookEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GradebookEntry
     */
    select?: GradebookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GradebookEntry
     */
    omit?: GradebookEntryOmit<ExtArgs> | null
    /**
     * Filter, which GradebookEntry to fetch.
     */
    where?: GradebookEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GradebookEntries to fetch.
     */
    orderBy?: GradebookEntryOrderByWithRelationInput | GradebookEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GradebookEntries.
     */
    cursor?: GradebookEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GradebookEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GradebookEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GradebookEntries.
     */
    distinct?: GradebookEntryScalarFieldEnum | GradebookEntryScalarFieldEnum[]
  }

  /**
   * GradebookEntry findFirstOrThrow
   */
  export type GradebookEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GradebookEntry
     */
    select?: GradebookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GradebookEntry
     */
    omit?: GradebookEntryOmit<ExtArgs> | null
    /**
     * Filter, which GradebookEntry to fetch.
     */
    where?: GradebookEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GradebookEntries to fetch.
     */
    orderBy?: GradebookEntryOrderByWithRelationInput | GradebookEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GradebookEntries.
     */
    cursor?: GradebookEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GradebookEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GradebookEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GradebookEntries.
     */
    distinct?: GradebookEntryScalarFieldEnum | GradebookEntryScalarFieldEnum[]
  }

  /**
   * GradebookEntry findMany
   */
  export type GradebookEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GradebookEntry
     */
    select?: GradebookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GradebookEntry
     */
    omit?: GradebookEntryOmit<ExtArgs> | null
    /**
     * Filter, which GradebookEntries to fetch.
     */
    where?: GradebookEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GradebookEntries to fetch.
     */
    orderBy?: GradebookEntryOrderByWithRelationInput | GradebookEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GradebookEntries.
     */
    cursor?: GradebookEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GradebookEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GradebookEntries.
     */
    skip?: number
    distinct?: GradebookEntryScalarFieldEnum | GradebookEntryScalarFieldEnum[]
  }

  /**
   * GradebookEntry create
   */
  export type GradebookEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GradebookEntry
     */
    select?: GradebookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GradebookEntry
     */
    omit?: GradebookEntryOmit<ExtArgs> | null
    /**
     * The data needed to create a GradebookEntry.
     */
    data: XOR<GradebookEntryCreateInput, GradebookEntryUncheckedCreateInput>
  }

  /**
   * GradebookEntry createMany
   */
  export type GradebookEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GradebookEntries.
     */
    data: GradebookEntryCreateManyInput | GradebookEntryCreateManyInput[]
  }

  /**
   * GradebookEntry createManyAndReturn
   */
  export type GradebookEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GradebookEntry
     */
    select?: GradebookEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GradebookEntry
     */
    omit?: GradebookEntryOmit<ExtArgs> | null
    /**
     * The data used to create many GradebookEntries.
     */
    data: GradebookEntryCreateManyInput | GradebookEntryCreateManyInput[]
  }

  /**
   * GradebookEntry update
   */
  export type GradebookEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GradebookEntry
     */
    select?: GradebookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GradebookEntry
     */
    omit?: GradebookEntryOmit<ExtArgs> | null
    /**
     * The data needed to update a GradebookEntry.
     */
    data: XOR<GradebookEntryUpdateInput, GradebookEntryUncheckedUpdateInput>
    /**
     * Choose, which GradebookEntry to update.
     */
    where: GradebookEntryWhereUniqueInput
  }

  /**
   * GradebookEntry updateMany
   */
  export type GradebookEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GradebookEntries.
     */
    data: XOR<GradebookEntryUpdateManyMutationInput, GradebookEntryUncheckedUpdateManyInput>
    /**
     * Filter which GradebookEntries to update
     */
    where?: GradebookEntryWhereInput
    /**
     * Limit how many GradebookEntries to update.
     */
    limit?: number
  }

  /**
   * GradebookEntry updateManyAndReturn
   */
  export type GradebookEntryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GradebookEntry
     */
    select?: GradebookEntrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GradebookEntry
     */
    omit?: GradebookEntryOmit<ExtArgs> | null
    /**
     * The data used to update GradebookEntries.
     */
    data: XOR<GradebookEntryUpdateManyMutationInput, GradebookEntryUncheckedUpdateManyInput>
    /**
     * Filter which GradebookEntries to update
     */
    where?: GradebookEntryWhereInput
    /**
     * Limit how many GradebookEntries to update.
     */
    limit?: number
  }

  /**
   * GradebookEntry upsert
   */
  export type GradebookEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GradebookEntry
     */
    select?: GradebookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GradebookEntry
     */
    omit?: GradebookEntryOmit<ExtArgs> | null
    /**
     * The filter to search for the GradebookEntry to update in case it exists.
     */
    where: GradebookEntryWhereUniqueInput
    /**
     * In case the GradebookEntry found by the `where` argument doesn't exist, create a new GradebookEntry with this data.
     */
    create: XOR<GradebookEntryCreateInput, GradebookEntryUncheckedCreateInput>
    /**
     * In case the GradebookEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GradebookEntryUpdateInput, GradebookEntryUncheckedUpdateInput>
  }

  /**
   * GradebookEntry delete
   */
  export type GradebookEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GradebookEntry
     */
    select?: GradebookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GradebookEntry
     */
    omit?: GradebookEntryOmit<ExtArgs> | null
    /**
     * Filter which GradebookEntry to delete.
     */
    where: GradebookEntryWhereUniqueInput
  }

  /**
   * GradebookEntry deleteMany
   */
  export type GradebookEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GradebookEntries to delete
     */
    where?: GradebookEntryWhereInput
    /**
     * Limit how many GradebookEntries to delete.
     */
    limit?: number
  }

  /**
   * GradebookEntry without action
   */
  export type GradebookEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GradebookEntry
     */
    select?: GradebookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GradebookEntry
     */
    omit?: GradebookEntryOmit<ExtArgs> | null
  }


  /**
   * Model UserKV
   */

  export type AggregateUserKV = {
    _count: UserKVCountAggregateOutputType | null
    _min: UserKVMinAggregateOutputType | null
    _max: UserKVMaxAggregateOutputType | null
  }

  export type UserKVMinAggregateOutputType = {
    id: string | null
    userId: string | null
    sessionId: string | null
    key: string | null
    value: string | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type UserKVMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    sessionId: string | null
    key: string | null
    value: string | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type UserKVCountAggregateOutputType = {
    id: number
    userId: number
    sessionId: number
    key: number
    value: number
    updatedAt: number
    createdAt: number
    _all: number
  }


  export type UserKVMinAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    key?: true
    value?: true
    updatedAt?: true
    createdAt?: true
  }

  export type UserKVMaxAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    key?: true
    value?: true
    updatedAt?: true
    createdAt?: true
  }

  export type UserKVCountAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    key?: true
    value?: true
    updatedAt?: true
    createdAt?: true
    _all?: true
  }

  export type UserKVAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserKV to aggregate.
     */
    where?: UserKVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserKVS to fetch.
     */
    orderBy?: UserKVOrderByWithRelationInput | UserKVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserKVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserKVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserKVS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserKVS
    **/
    _count?: true | UserKVCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserKVMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserKVMaxAggregateInputType
  }

  export type GetUserKVAggregateType<T extends UserKVAggregateArgs> = {
        [P in keyof T & keyof AggregateUserKV]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserKV[P]>
      : GetScalarType<T[P], AggregateUserKV[P]>
  }




  export type UserKVGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserKVWhereInput
    orderBy?: UserKVOrderByWithAggregationInput | UserKVOrderByWithAggregationInput[]
    by: UserKVScalarFieldEnum[] | UserKVScalarFieldEnum
    having?: UserKVScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserKVCountAggregateInputType | true
    _min?: UserKVMinAggregateInputType
    _max?: UserKVMaxAggregateInputType
  }

  export type UserKVGroupByOutputType = {
    id: string
    userId: string | null
    sessionId: string | null
    key: string
    value: string
    updatedAt: Date
    createdAt: Date
    _count: UserKVCountAggregateOutputType | null
    _min: UserKVMinAggregateOutputType | null
    _max: UserKVMaxAggregateOutputType | null
  }

  type GetUserKVGroupByPayload<T extends UserKVGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserKVGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserKVGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserKVGroupByOutputType[P]>
            : GetScalarType<T[P], UserKVGroupByOutputType[P]>
        }
      >
    >


  export type UserKVSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    key?: boolean
    value?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["userKV"]>

  export type UserKVSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    key?: boolean
    value?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["userKV"]>

  export type UserKVSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    key?: boolean
    value?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["userKV"]>

  export type UserKVSelectScalar = {
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    key?: boolean
    value?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }

  export type UserKVOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "sessionId" | "key" | "value" | "updatedAt" | "createdAt", ExtArgs["result"]["userKV"]>

  export type $UserKVPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserKV"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      sessionId: string | null
      key: string
      value: string
      updatedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["userKV"]>
    composites: {}
  }

  type UserKVGetPayload<S extends boolean | null | undefined | UserKVDefaultArgs> = $Result.GetResult<Prisma.$UserKVPayload, S>

  type UserKVCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserKVFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserKVCountAggregateInputType | true
    }

  export interface UserKVDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserKV'], meta: { name: 'UserKV' } }
    /**
     * Find zero or one UserKV that matches the filter.
     * @param {UserKVFindUniqueArgs} args - Arguments to find a UserKV
     * @example
     * // Get one UserKV
     * const userKV = await prisma.userKV.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserKVFindUniqueArgs>(args: SelectSubset<T, UserKVFindUniqueArgs<ExtArgs>>): Prisma__UserKVClient<$Result.GetResult<Prisma.$UserKVPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserKV that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserKVFindUniqueOrThrowArgs} args - Arguments to find a UserKV
     * @example
     * // Get one UserKV
     * const userKV = await prisma.userKV.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserKVFindUniqueOrThrowArgs>(args: SelectSubset<T, UserKVFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserKVClient<$Result.GetResult<Prisma.$UserKVPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserKV that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserKVFindFirstArgs} args - Arguments to find a UserKV
     * @example
     * // Get one UserKV
     * const userKV = await prisma.userKV.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserKVFindFirstArgs>(args?: SelectSubset<T, UserKVFindFirstArgs<ExtArgs>>): Prisma__UserKVClient<$Result.GetResult<Prisma.$UserKVPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserKV that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserKVFindFirstOrThrowArgs} args - Arguments to find a UserKV
     * @example
     * // Get one UserKV
     * const userKV = await prisma.userKV.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserKVFindFirstOrThrowArgs>(args?: SelectSubset<T, UserKVFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserKVClient<$Result.GetResult<Prisma.$UserKVPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserKVS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserKVFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserKVS
     * const userKVS = await prisma.userKV.findMany()
     * 
     * // Get first 10 UserKVS
     * const userKVS = await prisma.userKV.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userKVWithIdOnly = await prisma.userKV.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserKVFindManyArgs>(args?: SelectSubset<T, UserKVFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserKVPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserKV.
     * @param {UserKVCreateArgs} args - Arguments to create a UserKV.
     * @example
     * // Create one UserKV
     * const UserKV = await prisma.userKV.create({
     *   data: {
     *     // ... data to create a UserKV
     *   }
     * })
     * 
     */
    create<T extends UserKVCreateArgs>(args: SelectSubset<T, UserKVCreateArgs<ExtArgs>>): Prisma__UserKVClient<$Result.GetResult<Prisma.$UserKVPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserKVS.
     * @param {UserKVCreateManyArgs} args - Arguments to create many UserKVS.
     * @example
     * // Create many UserKVS
     * const userKV = await prisma.userKV.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserKVCreateManyArgs>(args?: SelectSubset<T, UserKVCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserKVS and returns the data saved in the database.
     * @param {UserKVCreateManyAndReturnArgs} args - Arguments to create many UserKVS.
     * @example
     * // Create many UserKVS
     * const userKV = await prisma.userKV.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserKVS and only return the `id`
     * const userKVWithIdOnly = await prisma.userKV.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserKVCreateManyAndReturnArgs>(args?: SelectSubset<T, UserKVCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserKVPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserKV.
     * @param {UserKVDeleteArgs} args - Arguments to delete one UserKV.
     * @example
     * // Delete one UserKV
     * const UserKV = await prisma.userKV.delete({
     *   where: {
     *     // ... filter to delete one UserKV
     *   }
     * })
     * 
     */
    delete<T extends UserKVDeleteArgs>(args: SelectSubset<T, UserKVDeleteArgs<ExtArgs>>): Prisma__UserKVClient<$Result.GetResult<Prisma.$UserKVPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserKV.
     * @param {UserKVUpdateArgs} args - Arguments to update one UserKV.
     * @example
     * // Update one UserKV
     * const userKV = await prisma.userKV.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserKVUpdateArgs>(args: SelectSubset<T, UserKVUpdateArgs<ExtArgs>>): Prisma__UserKVClient<$Result.GetResult<Prisma.$UserKVPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserKVS.
     * @param {UserKVDeleteManyArgs} args - Arguments to filter UserKVS to delete.
     * @example
     * // Delete a few UserKVS
     * const { count } = await prisma.userKV.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserKVDeleteManyArgs>(args?: SelectSubset<T, UserKVDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserKVS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserKVUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserKVS
     * const userKV = await prisma.userKV.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserKVUpdateManyArgs>(args: SelectSubset<T, UserKVUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserKVS and returns the data updated in the database.
     * @param {UserKVUpdateManyAndReturnArgs} args - Arguments to update many UserKVS.
     * @example
     * // Update many UserKVS
     * const userKV = await prisma.userKV.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserKVS and only return the `id`
     * const userKVWithIdOnly = await prisma.userKV.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserKVUpdateManyAndReturnArgs>(args: SelectSubset<T, UserKVUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserKVPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserKV.
     * @param {UserKVUpsertArgs} args - Arguments to update or create a UserKV.
     * @example
     * // Update or create a UserKV
     * const userKV = await prisma.userKV.upsert({
     *   create: {
     *     // ... data to create a UserKV
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserKV we want to update
     *   }
     * })
     */
    upsert<T extends UserKVUpsertArgs>(args: SelectSubset<T, UserKVUpsertArgs<ExtArgs>>): Prisma__UserKVClient<$Result.GetResult<Prisma.$UserKVPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserKVS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserKVCountArgs} args - Arguments to filter UserKVS to count.
     * @example
     * // Count the number of UserKVS
     * const count = await prisma.userKV.count({
     *   where: {
     *     // ... the filter for the UserKVS we want to count
     *   }
     * })
    **/
    count<T extends UserKVCountArgs>(
      args?: Subset<T, UserKVCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserKVCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserKV.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserKVAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserKVAggregateArgs>(args: Subset<T, UserKVAggregateArgs>): Prisma.PrismaPromise<GetUserKVAggregateType<T>>

    /**
     * Group by UserKV.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserKVGroupByArgs} args - Group by arguments.
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
      T extends UserKVGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserKVGroupByArgs['orderBy'] }
        : { orderBy?: UserKVGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserKVGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserKVGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserKV model
   */
  readonly fields: UserKVFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserKV.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserKVClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserKV model
   */
  interface UserKVFieldRefs {
    readonly id: FieldRef<"UserKV", 'String'>
    readonly userId: FieldRef<"UserKV", 'String'>
    readonly sessionId: FieldRef<"UserKV", 'String'>
    readonly key: FieldRef<"UserKV", 'String'>
    readonly value: FieldRef<"UserKV", 'String'>
    readonly updatedAt: FieldRef<"UserKV", 'DateTime'>
    readonly createdAt: FieldRef<"UserKV", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserKV findUnique
   */
  export type UserKVFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserKV
     */
    select?: UserKVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserKV
     */
    omit?: UserKVOmit<ExtArgs> | null
    /**
     * Filter, which UserKV to fetch.
     */
    where: UserKVWhereUniqueInput
  }

  /**
   * UserKV findUniqueOrThrow
   */
  export type UserKVFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserKV
     */
    select?: UserKVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserKV
     */
    omit?: UserKVOmit<ExtArgs> | null
    /**
     * Filter, which UserKV to fetch.
     */
    where: UserKVWhereUniqueInput
  }

  /**
   * UserKV findFirst
   */
  export type UserKVFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserKV
     */
    select?: UserKVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserKV
     */
    omit?: UserKVOmit<ExtArgs> | null
    /**
     * Filter, which UserKV to fetch.
     */
    where?: UserKVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserKVS to fetch.
     */
    orderBy?: UserKVOrderByWithRelationInput | UserKVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserKVS.
     */
    cursor?: UserKVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserKVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserKVS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserKVS.
     */
    distinct?: UserKVScalarFieldEnum | UserKVScalarFieldEnum[]
  }

  /**
   * UserKV findFirstOrThrow
   */
  export type UserKVFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserKV
     */
    select?: UserKVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserKV
     */
    omit?: UserKVOmit<ExtArgs> | null
    /**
     * Filter, which UserKV to fetch.
     */
    where?: UserKVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserKVS to fetch.
     */
    orderBy?: UserKVOrderByWithRelationInput | UserKVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserKVS.
     */
    cursor?: UserKVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserKVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserKVS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserKVS.
     */
    distinct?: UserKVScalarFieldEnum | UserKVScalarFieldEnum[]
  }

  /**
   * UserKV findMany
   */
  export type UserKVFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserKV
     */
    select?: UserKVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserKV
     */
    omit?: UserKVOmit<ExtArgs> | null
    /**
     * Filter, which UserKVS to fetch.
     */
    where?: UserKVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserKVS to fetch.
     */
    orderBy?: UserKVOrderByWithRelationInput | UserKVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserKVS.
     */
    cursor?: UserKVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserKVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserKVS.
     */
    skip?: number
    distinct?: UserKVScalarFieldEnum | UserKVScalarFieldEnum[]
  }

  /**
   * UserKV create
   */
  export type UserKVCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserKV
     */
    select?: UserKVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserKV
     */
    omit?: UserKVOmit<ExtArgs> | null
    /**
     * The data needed to create a UserKV.
     */
    data: XOR<UserKVCreateInput, UserKVUncheckedCreateInput>
  }

  /**
   * UserKV createMany
   */
  export type UserKVCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserKVS.
     */
    data: UserKVCreateManyInput | UserKVCreateManyInput[]
  }

  /**
   * UserKV createManyAndReturn
   */
  export type UserKVCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserKV
     */
    select?: UserKVSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserKV
     */
    omit?: UserKVOmit<ExtArgs> | null
    /**
     * The data used to create many UserKVS.
     */
    data: UserKVCreateManyInput | UserKVCreateManyInput[]
  }

  /**
   * UserKV update
   */
  export type UserKVUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserKV
     */
    select?: UserKVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserKV
     */
    omit?: UserKVOmit<ExtArgs> | null
    /**
     * The data needed to update a UserKV.
     */
    data: XOR<UserKVUpdateInput, UserKVUncheckedUpdateInput>
    /**
     * Choose, which UserKV to update.
     */
    where: UserKVWhereUniqueInput
  }

  /**
   * UserKV updateMany
   */
  export type UserKVUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserKVS.
     */
    data: XOR<UserKVUpdateManyMutationInput, UserKVUncheckedUpdateManyInput>
    /**
     * Filter which UserKVS to update
     */
    where?: UserKVWhereInput
    /**
     * Limit how many UserKVS to update.
     */
    limit?: number
  }

  /**
   * UserKV updateManyAndReturn
   */
  export type UserKVUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserKV
     */
    select?: UserKVSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserKV
     */
    omit?: UserKVOmit<ExtArgs> | null
    /**
     * The data used to update UserKVS.
     */
    data: XOR<UserKVUpdateManyMutationInput, UserKVUncheckedUpdateManyInput>
    /**
     * Filter which UserKVS to update
     */
    where?: UserKVWhereInput
    /**
     * Limit how many UserKVS to update.
     */
    limit?: number
  }

  /**
   * UserKV upsert
   */
  export type UserKVUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserKV
     */
    select?: UserKVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserKV
     */
    omit?: UserKVOmit<ExtArgs> | null
    /**
     * The filter to search for the UserKV to update in case it exists.
     */
    where: UserKVWhereUniqueInput
    /**
     * In case the UserKV found by the `where` argument doesn't exist, create a new UserKV with this data.
     */
    create: XOR<UserKVCreateInput, UserKVUncheckedCreateInput>
    /**
     * In case the UserKV was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserKVUpdateInput, UserKVUncheckedUpdateInput>
  }

  /**
   * UserKV delete
   */
  export type UserKVDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserKV
     */
    select?: UserKVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserKV
     */
    omit?: UserKVOmit<ExtArgs> | null
    /**
     * Filter which UserKV to delete.
     */
    where: UserKVWhereUniqueInput
  }

  /**
   * UserKV deleteMany
   */
  export type UserKVDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserKVS to delete
     */
    where?: UserKVWhereInput
    /**
     * Limit how many UserKVS to delete.
     */
    limit?: number
  }

  /**
   * UserKV without action
   */
  export type UserKVDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserKV
     */
    select?: UserKVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserKV
     */
    omit?: UserKVOmit<ExtArgs> | null
  }


  /**
   * Model KV
   */

  export type AggregateKV = {
    _count: KVCountAggregateOutputType | null
    _min: KVMinAggregateOutputType | null
    _max: KVMaxAggregateOutputType | null
  }

  export type KVMinAggregateOutputType = {
    key: string | null
    value: string | null
  }

  export type KVMaxAggregateOutputType = {
    key: string | null
    value: string | null
  }

  export type KVCountAggregateOutputType = {
    key: number
    value: number
    _all: number
  }


  export type KVMinAggregateInputType = {
    key?: true
    value?: true
  }

  export type KVMaxAggregateInputType = {
    key?: true
    value?: true
  }

  export type KVCountAggregateInputType = {
    key?: true
    value?: true
    _all?: true
  }

  export type KVAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KV to aggregate.
     */
    where?: KVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KVS to fetch.
     */
    orderBy?: KVOrderByWithRelationInput | KVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KVS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KVS
    **/
    _count?: true | KVCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KVMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KVMaxAggregateInputType
  }

  export type GetKVAggregateType<T extends KVAggregateArgs> = {
        [P in keyof T & keyof AggregateKV]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKV[P]>
      : GetScalarType<T[P], AggregateKV[P]>
  }




  export type KVGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KVWhereInput
    orderBy?: KVOrderByWithAggregationInput | KVOrderByWithAggregationInput[]
    by: KVScalarFieldEnum[] | KVScalarFieldEnum
    having?: KVScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KVCountAggregateInputType | true
    _min?: KVMinAggregateInputType
    _max?: KVMaxAggregateInputType
  }

  export type KVGroupByOutputType = {
    key: string
    value: string | null
    _count: KVCountAggregateOutputType | null
    _min: KVMinAggregateOutputType | null
    _max: KVMaxAggregateOutputType | null
  }

  type GetKVGroupByPayload<T extends KVGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KVGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KVGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KVGroupByOutputType[P]>
            : GetScalarType<T[P], KVGroupByOutputType[P]>
        }
      >
    >


  export type KVSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
  }, ExtArgs["result"]["kV"]>

  export type KVSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
  }, ExtArgs["result"]["kV"]>

  export type KVSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
  }, ExtArgs["result"]["kV"]>

  export type KVSelectScalar = {
    key?: boolean
    value?: boolean
  }

  export type KVOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"key" | "value", ExtArgs["result"]["kV"]>

  export type $KVPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KV"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      key: string
      value: string | null
    }, ExtArgs["result"]["kV"]>
    composites: {}
  }

  type KVGetPayload<S extends boolean | null | undefined | KVDefaultArgs> = $Result.GetResult<Prisma.$KVPayload, S>

  type KVCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KVFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KVCountAggregateInputType | true
    }

  export interface KVDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KV'], meta: { name: 'KV' } }
    /**
     * Find zero or one KV that matches the filter.
     * @param {KVFindUniqueArgs} args - Arguments to find a KV
     * @example
     * // Get one KV
     * const kV = await prisma.kV.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KVFindUniqueArgs>(args: SelectSubset<T, KVFindUniqueArgs<ExtArgs>>): Prisma__KVClient<$Result.GetResult<Prisma.$KVPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KV that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KVFindUniqueOrThrowArgs} args - Arguments to find a KV
     * @example
     * // Get one KV
     * const kV = await prisma.kV.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KVFindUniqueOrThrowArgs>(args: SelectSubset<T, KVFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KVClient<$Result.GetResult<Prisma.$KVPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KV that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KVFindFirstArgs} args - Arguments to find a KV
     * @example
     * // Get one KV
     * const kV = await prisma.kV.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KVFindFirstArgs>(args?: SelectSubset<T, KVFindFirstArgs<ExtArgs>>): Prisma__KVClient<$Result.GetResult<Prisma.$KVPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KV that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KVFindFirstOrThrowArgs} args - Arguments to find a KV
     * @example
     * // Get one KV
     * const kV = await prisma.kV.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KVFindFirstOrThrowArgs>(args?: SelectSubset<T, KVFindFirstOrThrowArgs<ExtArgs>>): Prisma__KVClient<$Result.GetResult<Prisma.$KVPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KVS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KVFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KVS
     * const kVS = await prisma.kV.findMany()
     * 
     * // Get first 10 KVS
     * const kVS = await prisma.kV.findMany({ take: 10 })
     * 
     * // Only select the `key`
     * const kVWithKeyOnly = await prisma.kV.findMany({ select: { key: true } })
     * 
     */
    findMany<T extends KVFindManyArgs>(args?: SelectSubset<T, KVFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KVPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KV.
     * @param {KVCreateArgs} args - Arguments to create a KV.
     * @example
     * // Create one KV
     * const KV = await prisma.kV.create({
     *   data: {
     *     // ... data to create a KV
     *   }
     * })
     * 
     */
    create<T extends KVCreateArgs>(args: SelectSubset<T, KVCreateArgs<ExtArgs>>): Prisma__KVClient<$Result.GetResult<Prisma.$KVPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KVS.
     * @param {KVCreateManyArgs} args - Arguments to create many KVS.
     * @example
     * // Create many KVS
     * const kV = await prisma.kV.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KVCreateManyArgs>(args?: SelectSubset<T, KVCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KVS and returns the data saved in the database.
     * @param {KVCreateManyAndReturnArgs} args - Arguments to create many KVS.
     * @example
     * // Create many KVS
     * const kV = await prisma.kV.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KVS and only return the `key`
     * const kVWithKeyOnly = await prisma.kV.createManyAndReturn({
     *   select: { key: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KVCreateManyAndReturnArgs>(args?: SelectSubset<T, KVCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KVPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KV.
     * @param {KVDeleteArgs} args - Arguments to delete one KV.
     * @example
     * // Delete one KV
     * const KV = await prisma.kV.delete({
     *   where: {
     *     // ... filter to delete one KV
     *   }
     * })
     * 
     */
    delete<T extends KVDeleteArgs>(args: SelectSubset<T, KVDeleteArgs<ExtArgs>>): Prisma__KVClient<$Result.GetResult<Prisma.$KVPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KV.
     * @param {KVUpdateArgs} args - Arguments to update one KV.
     * @example
     * // Update one KV
     * const kV = await prisma.kV.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KVUpdateArgs>(args: SelectSubset<T, KVUpdateArgs<ExtArgs>>): Prisma__KVClient<$Result.GetResult<Prisma.$KVPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KVS.
     * @param {KVDeleteManyArgs} args - Arguments to filter KVS to delete.
     * @example
     * // Delete a few KVS
     * const { count } = await prisma.kV.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KVDeleteManyArgs>(args?: SelectSubset<T, KVDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KVS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KVUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KVS
     * const kV = await prisma.kV.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KVUpdateManyArgs>(args: SelectSubset<T, KVUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KVS and returns the data updated in the database.
     * @param {KVUpdateManyAndReturnArgs} args - Arguments to update many KVS.
     * @example
     * // Update many KVS
     * const kV = await prisma.kV.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KVS and only return the `key`
     * const kVWithKeyOnly = await prisma.kV.updateManyAndReturn({
     *   select: { key: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KVUpdateManyAndReturnArgs>(args: SelectSubset<T, KVUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KVPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KV.
     * @param {KVUpsertArgs} args - Arguments to update or create a KV.
     * @example
     * // Update or create a KV
     * const kV = await prisma.kV.upsert({
     *   create: {
     *     // ... data to create a KV
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KV we want to update
     *   }
     * })
     */
    upsert<T extends KVUpsertArgs>(args: SelectSubset<T, KVUpsertArgs<ExtArgs>>): Prisma__KVClient<$Result.GetResult<Prisma.$KVPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KVS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KVCountArgs} args - Arguments to filter KVS to count.
     * @example
     * // Count the number of KVS
     * const count = await prisma.kV.count({
     *   where: {
     *     // ... the filter for the KVS we want to count
     *   }
     * })
    **/
    count<T extends KVCountArgs>(
      args?: Subset<T, KVCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KVCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KV.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KVAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends KVAggregateArgs>(args: Subset<T, KVAggregateArgs>): Prisma.PrismaPromise<GetKVAggregateType<T>>

    /**
     * Group by KV.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KVGroupByArgs} args - Group by arguments.
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
      T extends KVGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KVGroupByArgs['orderBy'] }
        : { orderBy?: KVGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, KVGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKVGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KV model
   */
  readonly fields: KVFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KV.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KVClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KV model
   */
  interface KVFieldRefs {
    readonly key: FieldRef<"KV", 'String'>
    readonly value: FieldRef<"KV", 'String'>
  }
    

  // Custom InputTypes
  /**
   * KV findUnique
   */
  export type KVFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KV
     */
    select?: KVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KV
     */
    omit?: KVOmit<ExtArgs> | null
    /**
     * Filter, which KV to fetch.
     */
    where: KVWhereUniqueInput
  }

  /**
   * KV findUniqueOrThrow
   */
  export type KVFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KV
     */
    select?: KVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KV
     */
    omit?: KVOmit<ExtArgs> | null
    /**
     * Filter, which KV to fetch.
     */
    where: KVWhereUniqueInput
  }

  /**
   * KV findFirst
   */
  export type KVFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KV
     */
    select?: KVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KV
     */
    omit?: KVOmit<ExtArgs> | null
    /**
     * Filter, which KV to fetch.
     */
    where?: KVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KVS to fetch.
     */
    orderBy?: KVOrderByWithRelationInput | KVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KVS.
     */
    cursor?: KVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KVS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KVS.
     */
    distinct?: KVScalarFieldEnum | KVScalarFieldEnum[]
  }

  /**
   * KV findFirstOrThrow
   */
  export type KVFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KV
     */
    select?: KVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KV
     */
    omit?: KVOmit<ExtArgs> | null
    /**
     * Filter, which KV to fetch.
     */
    where?: KVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KVS to fetch.
     */
    orderBy?: KVOrderByWithRelationInput | KVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KVS.
     */
    cursor?: KVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KVS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KVS.
     */
    distinct?: KVScalarFieldEnum | KVScalarFieldEnum[]
  }

  /**
   * KV findMany
   */
  export type KVFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KV
     */
    select?: KVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KV
     */
    omit?: KVOmit<ExtArgs> | null
    /**
     * Filter, which KVS to fetch.
     */
    where?: KVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KVS to fetch.
     */
    orderBy?: KVOrderByWithRelationInput | KVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KVS.
     */
    cursor?: KVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KVS.
     */
    skip?: number
    distinct?: KVScalarFieldEnum | KVScalarFieldEnum[]
  }

  /**
   * KV create
   */
  export type KVCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KV
     */
    select?: KVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KV
     */
    omit?: KVOmit<ExtArgs> | null
    /**
     * The data needed to create a KV.
     */
    data: XOR<KVCreateInput, KVUncheckedCreateInput>
  }

  /**
   * KV createMany
   */
  export type KVCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KVS.
     */
    data: KVCreateManyInput | KVCreateManyInput[]
  }

  /**
   * KV createManyAndReturn
   */
  export type KVCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KV
     */
    select?: KVSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KV
     */
    omit?: KVOmit<ExtArgs> | null
    /**
     * The data used to create many KVS.
     */
    data: KVCreateManyInput | KVCreateManyInput[]
  }

  /**
   * KV update
   */
  export type KVUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KV
     */
    select?: KVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KV
     */
    omit?: KVOmit<ExtArgs> | null
    /**
     * The data needed to update a KV.
     */
    data: XOR<KVUpdateInput, KVUncheckedUpdateInput>
    /**
     * Choose, which KV to update.
     */
    where: KVWhereUniqueInput
  }

  /**
   * KV updateMany
   */
  export type KVUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KVS.
     */
    data: XOR<KVUpdateManyMutationInput, KVUncheckedUpdateManyInput>
    /**
     * Filter which KVS to update
     */
    where?: KVWhereInput
    /**
     * Limit how many KVS to update.
     */
    limit?: number
  }

  /**
   * KV updateManyAndReturn
   */
  export type KVUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KV
     */
    select?: KVSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KV
     */
    omit?: KVOmit<ExtArgs> | null
    /**
     * The data used to update KVS.
     */
    data: XOR<KVUpdateManyMutationInput, KVUncheckedUpdateManyInput>
    /**
     * Filter which KVS to update
     */
    where?: KVWhereInput
    /**
     * Limit how many KVS to update.
     */
    limit?: number
  }

  /**
   * KV upsert
   */
  export type KVUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KV
     */
    select?: KVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KV
     */
    omit?: KVOmit<ExtArgs> | null
    /**
     * The filter to search for the KV to update in case it exists.
     */
    where: KVWhereUniqueInput
    /**
     * In case the KV found by the `where` argument doesn't exist, create a new KV with this data.
     */
    create: XOR<KVCreateInput, KVUncheckedCreateInput>
    /**
     * In case the KV was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KVUpdateInput, KVUncheckedUpdateInput>
  }

  /**
   * KV delete
   */
  export type KVDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KV
     */
    select?: KVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KV
     */
    omit?: KVOmit<ExtArgs> | null
    /**
     * Filter which KV to delete.
     */
    where: KVWhereUniqueInput
  }

  /**
   * KV deleteMany
   */
  export type KVDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KVS to delete
     */
    where?: KVWhereInput
    /**
     * Limit how many KVS to delete.
     */
    limit?: number
  }

  /**
   * KV without action
   */
  export type KVDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KV
     */
    select?: KVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KV
     */
    omit?: KVOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const StudentNoteScalarFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    courseId: 'courseId',
    body: 'body',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StudentNoteScalarFieldEnum = (typeof StudentNoteScalarFieldEnum)[keyof typeof StudentNoteScalarFieldEnum]


  export const CourseScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    progressPct: 'progressPct',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CourseScalarFieldEnum = (typeof CourseScalarFieldEnum)[keyof typeof CourseScalarFieldEnum]


  export const GradebookEntryScalarFieldEnum: {
    id: 'id',
    assignmentId: 'assignmentId',
    studentId: 'studentId',
    courseId: 'courseId',
    grade: 'grade',
    feedback: 'feedback',
    progressPct: 'progressPct',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GradebookEntryScalarFieldEnum = (typeof GradebookEntryScalarFieldEnum)[keyof typeof GradebookEntryScalarFieldEnum]


  export const UserKVScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    sessionId: 'sessionId',
    key: 'key',
    value: 'value',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt'
  };

  export type UserKVScalarFieldEnum = (typeof UserKVScalarFieldEnum)[keyof typeof UserKVScalarFieldEnum]


  export const KVScalarFieldEnum: {
    key: 'key',
    value: 'value'
  };

  export type KVScalarFieldEnum = (typeof KVScalarFieldEnum)[keyof typeof KVScalarFieldEnum]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type StudentNoteWhereInput = {
    AND?: StudentNoteWhereInput | StudentNoteWhereInput[]
    OR?: StudentNoteWhereInput[]
    NOT?: StudentNoteWhereInput | StudentNoteWhereInput[]
    id?: StringFilter<"StudentNote"> | string
    studentId?: StringFilter<"StudentNote"> | string
    courseId?: StringFilter<"StudentNote"> | string
    body?: StringFilter<"StudentNote"> | string
    createdAt?: DateTimeFilter<"StudentNote"> | Date | string
    updatedAt?: DateTimeFilter<"StudentNote"> | Date | string
  }

  export type StudentNoteOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    body?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentNoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StudentNoteWhereInput | StudentNoteWhereInput[]
    OR?: StudentNoteWhereInput[]
    NOT?: StudentNoteWhereInput | StudentNoteWhereInput[]
    studentId?: StringFilter<"StudentNote"> | string
    courseId?: StringFilter<"StudentNote"> | string
    body?: StringFilter<"StudentNote"> | string
    createdAt?: DateTimeFilter<"StudentNote"> | Date | string
    updatedAt?: DateTimeFilter<"StudentNote"> | Date | string
  }, "id">

  export type StudentNoteOrderByWithAggregationInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    body?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StudentNoteCountOrderByAggregateInput
    _max?: StudentNoteMaxOrderByAggregateInput
    _min?: StudentNoteMinOrderByAggregateInput
  }

  export type StudentNoteScalarWhereWithAggregatesInput = {
    AND?: StudentNoteScalarWhereWithAggregatesInput | StudentNoteScalarWhereWithAggregatesInput[]
    OR?: StudentNoteScalarWhereWithAggregatesInput[]
    NOT?: StudentNoteScalarWhereWithAggregatesInput | StudentNoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StudentNote"> | string
    studentId?: StringWithAggregatesFilter<"StudentNote"> | string
    courseId?: StringWithAggregatesFilter<"StudentNote"> | string
    body?: StringWithAggregatesFilter<"StudentNote"> | string
    createdAt?: DateTimeWithAggregatesFilter<"StudentNote"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"StudentNote"> | Date | string
  }

  export type CourseWhereInput = {
    AND?: CourseWhereInput | CourseWhereInput[]
    OR?: CourseWhereInput[]
    NOT?: CourseWhereInput | CourseWhereInput[]
    id?: StringFilter<"Course"> | string
    title?: StringFilter<"Course"> | string
    description?: StringNullableFilter<"Course"> | string | null
    progressPct?: IntFilter<"Course"> | number
    createdAt?: DateTimeFilter<"Course"> | Date | string
    updatedAt?: DateTimeFilter<"Course"> | Date | string
  }

  export type CourseOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    progressPct?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CourseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CourseWhereInput | CourseWhereInput[]
    OR?: CourseWhereInput[]
    NOT?: CourseWhereInput | CourseWhereInput[]
    title?: StringFilter<"Course"> | string
    description?: StringNullableFilter<"Course"> | string | null
    progressPct?: IntFilter<"Course"> | number
    createdAt?: DateTimeFilter<"Course"> | Date | string
    updatedAt?: DateTimeFilter<"Course"> | Date | string
  }, "id">

  export type CourseOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    progressPct?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CourseCountOrderByAggregateInput
    _avg?: CourseAvgOrderByAggregateInput
    _max?: CourseMaxOrderByAggregateInput
    _min?: CourseMinOrderByAggregateInput
    _sum?: CourseSumOrderByAggregateInput
  }

  export type CourseScalarWhereWithAggregatesInput = {
    AND?: CourseScalarWhereWithAggregatesInput | CourseScalarWhereWithAggregatesInput[]
    OR?: CourseScalarWhereWithAggregatesInput[]
    NOT?: CourseScalarWhereWithAggregatesInput | CourseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Course"> | string
    title?: StringWithAggregatesFilter<"Course"> | string
    description?: StringNullableWithAggregatesFilter<"Course"> | string | null
    progressPct?: IntWithAggregatesFilter<"Course"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Course"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Course"> | Date | string
  }

  export type GradebookEntryWhereInput = {
    AND?: GradebookEntryWhereInput | GradebookEntryWhereInput[]
    OR?: GradebookEntryWhereInput[]
    NOT?: GradebookEntryWhereInput | GradebookEntryWhereInput[]
    id?: StringFilter<"GradebookEntry"> | string
    assignmentId?: StringFilter<"GradebookEntry"> | string
    studentId?: StringFilter<"GradebookEntry"> | string
    courseId?: StringFilter<"GradebookEntry"> | string
    grade?: FloatNullableFilter<"GradebookEntry"> | number | null
    feedback?: StringNullableFilter<"GradebookEntry"> | string | null
    progressPct?: IntFilter<"GradebookEntry"> | number
    createdAt?: DateTimeFilter<"GradebookEntry"> | Date | string
    updatedAt?: DateTimeFilter<"GradebookEntry"> | Date | string
  }

  export type GradebookEntryOrderByWithRelationInput = {
    id?: SortOrder
    assignmentId?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    grade?: SortOrderInput | SortOrder
    feedback?: SortOrderInput | SortOrder
    progressPct?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GradebookEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GradebookEntryWhereInput | GradebookEntryWhereInput[]
    OR?: GradebookEntryWhereInput[]
    NOT?: GradebookEntryWhereInput | GradebookEntryWhereInput[]
    assignmentId?: StringFilter<"GradebookEntry"> | string
    studentId?: StringFilter<"GradebookEntry"> | string
    courseId?: StringFilter<"GradebookEntry"> | string
    grade?: FloatNullableFilter<"GradebookEntry"> | number | null
    feedback?: StringNullableFilter<"GradebookEntry"> | string | null
    progressPct?: IntFilter<"GradebookEntry"> | number
    createdAt?: DateTimeFilter<"GradebookEntry"> | Date | string
    updatedAt?: DateTimeFilter<"GradebookEntry"> | Date | string
  }, "id">

  export type GradebookEntryOrderByWithAggregationInput = {
    id?: SortOrder
    assignmentId?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    grade?: SortOrderInput | SortOrder
    feedback?: SortOrderInput | SortOrder
    progressPct?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GradebookEntryCountOrderByAggregateInput
    _avg?: GradebookEntryAvgOrderByAggregateInput
    _max?: GradebookEntryMaxOrderByAggregateInput
    _min?: GradebookEntryMinOrderByAggregateInput
    _sum?: GradebookEntrySumOrderByAggregateInput
  }

  export type GradebookEntryScalarWhereWithAggregatesInput = {
    AND?: GradebookEntryScalarWhereWithAggregatesInput | GradebookEntryScalarWhereWithAggregatesInput[]
    OR?: GradebookEntryScalarWhereWithAggregatesInput[]
    NOT?: GradebookEntryScalarWhereWithAggregatesInput | GradebookEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GradebookEntry"> | string
    assignmentId?: StringWithAggregatesFilter<"GradebookEntry"> | string
    studentId?: StringWithAggregatesFilter<"GradebookEntry"> | string
    courseId?: StringWithAggregatesFilter<"GradebookEntry"> | string
    grade?: FloatNullableWithAggregatesFilter<"GradebookEntry"> | number | null
    feedback?: StringNullableWithAggregatesFilter<"GradebookEntry"> | string | null
    progressPct?: IntWithAggregatesFilter<"GradebookEntry"> | number
    createdAt?: DateTimeWithAggregatesFilter<"GradebookEntry"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"GradebookEntry"> | Date | string
  }

  export type UserKVWhereInput = {
    AND?: UserKVWhereInput | UserKVWhereInput[]
    OR?: UserKVWhereInput[]
    NOT?: UserKVWhereInput | UserKVWhereInput[]
    id?: StringFilter<"UserKV"> | string
    userId?: StringNullableFilter<"UserKV"> | string | null
    sessionId?: StringNullableFilter<"UserKV"> | string | null
    key?: StringFilter<"UserKV"> | string
    value?: StringFilter<"UserKV"> | string
    updatedAt?: DateTimeFilter<"UserKV"> | Date | string
    createdAt?: DateTimeFilter<"UserKV"> | Date | string
  }

  export type UserKVOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    sessionId?: SortOrderInput | SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type UserKVWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UserKVWhereInput | UserKVWhereInput[]
    OR?: UserKVWhereInput[]
    NOT?: UserKVWhereInput | UserKVWhereInput[]
    userId?: StringNullableFilter<"UserKV"> | string | null
    sessionId?: StringNullableFilter<"UserKV"> | string | null
    key?: StringFilter<"UserKV"> | string
    value?: StringFilter<"UserKV"> | string
    updatedAt?: DateTimeFilter<"UserKV"> | Date | string
    createdAt?: DateTimeFilter<"UserKV"> | Date | string
  }, "id">

  export type UserKVOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    sessionId?: SortOrderInput | SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    _count?: UserKVCountOrderByAggregateInput
    _max?: UserKVMaxOrderByAggregateInput
    _min?: UserKVMinOrderByAggregateInput
  }

  export type UserKVScalarWhereWithAggregatesInput = {
    AND?: UserKVScalarWhereWithAggregatesInput | UserKVScalarWhereWithAggregatesInput[]
    OR?: UserKVScalarWhereWithAggregatesInput[]
    NOT?: UserKVScalarWhereWithAggregatesInput | UserKVScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserKV"> | string
    userId?: StringNullableWithAggregatesFilter<"UserKV"> | string | null
    sessionId?: StringNullableWithAggregatesFilter<"UserKV"> | string | null
    key?: StringWithAggregatesFilter<"UserKV"> | string
    value?: StringWithAggregatesFilter<"UserKV"> | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserKV"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"UserKV"> | Date | string
  }

  export type KVWhereInput = {
    AND?: KVWhereInput | KVWhereInput[]
    OR?: KVWhereInput[]
    NOT?: KVWhereInput | KVWhereInput[]
    key?: StringFilter<"KV"> | string
    value?: StringNullableFilter<"KV"> | string | null
  }

  export type KVOrderByWithRelationInput = {
    key?: SortOrder
    value?: SortOrderInput | SortOrder
  }

  export type KVWhereUniqueInput = Prisma.AtLeast<{
    key?: string
    AND?: KVWhereInput | KVWhereInput[]
    OR?: KVWhereInput[]
    NOT?: KVWhereInput | KVWhereInput[]
    value?: StringNullableFilter<"KV"> | string | null
  }, "key">

  export type KVOrderByWithAggregationInput = {
    key?: SortOrder
    value?: SortOrderInput | SortOrder
    _count?: KVCountOrderByAggregateInput
    _max?: KVMaxOrderByAggregateInput
    _min?: KVMinOrderByAggregateInput
  }

  export type KVScalarWhereWithAggregatesInput = {
    AND?: KVScalarWhereWithAggregatesInput | KVScalarWhereWithAggregatesInput[]
    OR?: KVScalarWhereWithAggregatesInput[]
    NOT?: KVScalarWhereWithAggregatesInput | KVScalarWhereWithAggregatesInput[]
    key?: StringWithAggregatesFilter<"KV"> | string
    value?: StringNullableWithAggregatesFilter<"KV"> | string | null
  }

  export type StudentNoteCreateInput = {
    id?: string
    studentId: string
    courseId: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentNoteUncheckedCreateInput = {
    id?: string
    studentId: string
    courseId: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentNoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentNoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentNoteCreateManyInput = {
    id?: string
    studentId: string
    courseId: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentNoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentNoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CourseCreateInput = {
    id?: string
    title: string
    description?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CourseUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CourseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CourseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CourseCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CourseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CourseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GradebookEntryCreateInput = {
    id?: string
    assignmentId: string
    studentId: string
    courseId: string
    grade?: number | null
    feedback?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GradebookEntryUncheckedCreateInput = {
    id?: string
    assignmentId: string
    studentId: string
    courseId: string
    grade?: number | null
    feedback?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GradebookEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assignmentId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    grade?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GradebookEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assignmentId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    grade?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GradebookEntryCreateManyInput = {
    id?: string
    assignmentId: string
    studentId: string
    courseId: string
    grade?: number | null
    feedback?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GradebookEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    assignmentId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    grade?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GradebookEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    assignmentId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    grade?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserKVCreateInput = {
    id?: string
    userId?: string | null
    sessionId?: string | null
    key: string
    value: string
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type UserKVUncheckedCreateInput = {
    id?: string
    userId?: string | null
    sessionId?: string | null
    key: string
    value: string
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type UserKVUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserKVUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserKVCreateManyInput = {
    id?: string
    userId?: string | null
    sessionId?: string | null
    key: string
    value: string
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type UserKVUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserKVUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KVCreateInput = {
    key: string
    value?: string | null
  }

  export type KVUncheckedCreateInput = {
    key: string
    value?: string | null
  }

  export type KVUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type KVUncheckedUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type KVCreateManyInput = {
    key: string
    value?: string | null
  }

  export type KVUpdateManyMutationInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type KVUncheckedUpdateManyInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type StudentNoteCountOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    body?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentNoteMaxOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    body?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentNoteMinOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    body?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CourseCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    progressPct?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CourseAvgOrderByAggregateInput = {
    progressPct?: SortOrder
  }

  export type CourseMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    progressPct?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CourseMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    progressPct?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CourseSumOrderByAggregateInput = {
    progressPct?: SortOrder
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

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
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

  export type GradebookEntryCountOrderByAggregateInput = {
    id?: SortOrder
    assignmentId?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    grade?: SortOrder
    feedback?: SortOrder
    progressPct?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GradebookEntryAvgOrderByAggregateInput = {
    grade?: SortOrder
    progressPct?: SortOrder
  }

  export type GradebookEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    assignmentId?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    grade?: SortOrder
    feedback?: SortOrder
    progressPct?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GradebookEntryMinOrderByAggregateInput = {
    id?: SortOrder
    assignmentId?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    grade?: SortOrder
    feedback?: SortOrder
    progressPct?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GradebookEntrySumOrderByAggregateInput = {
    grade?: SortOrder
    progressPct?: SortOrder
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

  export type UserKVCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type UserKVMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type UserKVMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type KVCountOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
  }

  export type KVMaxOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
  }

  export type KVMinOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
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

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
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