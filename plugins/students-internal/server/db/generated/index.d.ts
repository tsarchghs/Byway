
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
 * Model Student
 * 
 */
export type Student = $Result.DefaultSelection<Prisma.$StudentPayload>
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
 * Model StudentProgress
 * 
 */
export type StudentProgress = $Result.DefaultSelection<Prisma.$StudentProgressPayload>
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
 * Model StudentCourse
 * 
 */
export type StudentCourse = $Result.DefaultSelection<Prisma.$StudentCoursePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Students
 * const students = await prisma.student.findMany()
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
   * // Fetch zero or more Students
   * const students = await prisma.student.findMany()
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
   * `prisma.student`: Exposes CRUD operations for the **Student** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Students
    * const students = await prisma.student.findMany()
    * ```
    */
  get student(): Prisma.StudentDelegate<ExtArgs, ClientOptions>;

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
   * `prisma.studentProgress`: Exposes CRUD operations for the **StudentProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StudentProgresses
    * const studentProgresses = await prisma.studentProgress.findMany()
    * ```
    */
  get studentProgress(): Prisma.StudentProgressDelegate<ExtArgs, ClientOptions>;

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

  /**
   * `prisma.studentCourse`: Exposes CRUD operations for the **StudentCourse** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StudentCourses
    * const studentCourses = await prisma.studentCourse.findMany()
    * ```
    */
  get studentCourse(): Prisma.StudentCourseDelegate<ExtArgs, ClientOptions>;
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
    Student: 'Student',
    StudentNote: 'StudentNote',
    Course: 'Course',
    GradebookEntry: 'GradebookEntry',
    StudentProgress: 'StudentProgress',
    UserKV: 'UserKV',
    KV: 'KV',
    StudentCourse: 'StudentCourse'
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
      modelProps: "student" | "studentNote" | "course" | "gradebookEntry" | "studentProgress" | "userKV" | "kV" | "studentCourse"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Student: {
        payload: Prisma.$StudentPayload<ExtArgs>
        fields: Prisma.StudentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          findFirst: {
            args: Prisma.StudentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          findMany: {
            args: Prisma.StudentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>[]
          }
          create: {
            args: Prisma.StudentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          createMany: {
            args: Prisma.StudentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>[]
          }
          delete: {
            args: Prisma.StudentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          update: {
            args: Prisma.StudentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          deleteMany: {
            args: Prisma.StudentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StudentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>[]
          }
          upsert: {
            args: Prisma.StudentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          aggregate: {
            args: Prisma.StudentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudent>
          }
          groupBy: {
            args: Prisma.StudentGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudentGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudentCountArgs<ExtArgs>
            result: $Utils.Optional<StudentCountAggregateOutputType> | number
          }
        }
      }
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
      StudentProgress: {
        payload: Prisma.$StudentProgressPayload<ExtArgs>
        fields: Prisma.StudentProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudentProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudentProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProgressPayload>
          }
          findFirst: {
            args: Prisma.StudentProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudentProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProgressPayload>
          }
          findMany: {
            args: Prisma.StudentProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProgressPayload>[]
          }
          create: {
            args: Prisma.StudentProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProgressPayload>
          }
          createMany: {
            args: Prisma.StudentProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudentProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProgressPayload>[]
          }
          delete: {
            args: Prisma.StudentProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProgressPayload>
          }
          update: {
            args: Prisma.StudentProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProgressPayload>
          }
          deleteMany: {
            args: Prisma.StudentProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudentProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StudentProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProgressPayload>[]
          }
          upsert: {
            args: Prisma.StudentProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProgressPayload>
          }
          aggregate: {
            args: Prisma.StudentProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudentProgress>
          }
          groupBy: {
            args: Prisma.StudentProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudentProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudentProgressCountArgs<ExtArgs>
            result: $Utils.Optional<StudentProgressCountAggregateOutputType> | number
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
      StudentCourse: {
        payload: Prisma.$StudentCoursePayload<ExtArgs>
        fields: Prisma.StudentCourseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudentCourseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentCoursePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudentCourseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentCoursePayload>
          }
          findFirst: {
            args: Prisma.StudentCourseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentCoursePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudentCourseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentCoursePayload>
          }
          findMany: {
            args: Prisma.StudentCourseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentCoursePayload>[]
          }
          create: {
            args: Prisma.StudentCourseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentCoursePayload>
          }
          createMany: {
            args: Prisma.StudentCourseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudentCourseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentCoursePayload>[]
          }
          delete: {
            args: Prisma.StudentCourseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentCoursePayload>
          }
          update: {
            args: Prisma.StudentCourseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentCoursePayload>
          }
          deleteMany: {
            args: Prisma.StudentCourseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudentCourseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StudentCourseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentCoursePayload>[]
          }
          upsert: {
            args: Prisma.StudentCourseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentCoursePayload>
          }
          aggregate: {
            args: Prisma.StudentCourseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudentCourse>
          }
          groupBy: {
            args: Prisma.StudentCourseGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudentCourseGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudentCourseCountArgs<ExtArgs>
            result: $Utils.Optional<StudentCourseCountAggregateOutputType> | number
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
    student?: StudentOmit
    studentNote?: StudentNoteOmit
    course?: CourseOmit
    gradebookEntry?: GradebookEntryOmit
    studentProgress?: StudentProgressOmit
    userKV?: UserKVOmit
    kV?: KVOmit
    studentCourse?: StudentCourseOmit
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
   * Count Type CourseCountOutputType
   */

  export type CourseCountOutputType = {
    studentProgress: number
    gradebookEntries: number
    studentNotes: number
    StudentCourse: number
  }

  export type CourseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    studentProgress?: boolean | CourseCountOutputTypeCountStudentProgressArgs
    gradebookEntries?: boolean | CourseCountOutputTypeCountGradebookEntriesArgs
    studentNotes?: boolean | CourseCountOutputTypeCountStudentNotesArgs
    StudentCourse?: boolean | CourseCountOutputTypeCountStudentCourseArgs
  }

  // Custom InputTypes
  /**
   * CourseCountOutputType without action
   */
  export type CourseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseCountOutputType
     */
    select?: CourseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CourseCountOutputType without action
   */
  export type CourseCountOutputTypeCountStudentProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentProgressWhereInput
  }

  /**
   * CourseCountOutputType without action
   */
  export type CourseCountOutputTypeCountGradebookEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GradebookEntryWhereInput
  }

  /**
   * CourseCountOutputType without action
   */
  export type CourseCountOutputTypeCountStudentNotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentNoteWhereInput
  }

  /**
   * CourseCountOutputType without action
   */
  export type CourseCountOutputTypeCountStudentCourseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentCourseWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Student
   */

  export type AggregateStudent = {
    _count: StudentCountAggregateOutputType | null
    _min: StudentMinAggregateOutputType | null
    _max: StudentMaxAggregateOutputType | null
  }

  export type StudentMinAggregateOutputType = {
    id: string | null
    userId: string | null
    displayName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StudentMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    displayName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StudentCountAggregateOutputType = {
    id: number
    userId: number
    displayName: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StudentMinAggregateInputType = {
    id?: true
    userId?: true
    displayName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StudentMaxAggregateInputType = {
    id?: true
    userId?: true
    displayName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StudentCountAggregateInputType = {
    id?: true
    userId?: true
    displayName?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StudentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Student to aggregate.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Students
    **/
    _count?: true | StudentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudentMaxAggregateInputType
  }

  export type GetStudentAggregateType<T extends StudentAggregateArgs> = {
        [P in keyof T & keyof AggregateStudent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudent[P]>
      : GetScalarType<T[P], AggregateStudent[P]>
  }




  export type StudentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentWhereInput
    orderBy?: StudentOrderByWithAggregationInput | StudentOrderByWithAggregationInput[]
    by: StudentScalarFieldEnum[] | StudentScalarFieldEnum
    having?: StudentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudentCountAggregateInputType | true
    _min?: StudentMinAggregateInputType
    _max?: StudentMaxAggregateInputType
  }

  export type StudentGroupByOutputType = {
    id: string
    userId: string
    displayName: string | null
    createdAt: Date
    updatedAt: Date
    _count: StudentCountAggregateOutputType | null
    _min: StudentMinAggregateOutputType | null
    _max: StudentMaxAggregateOutputType | null
  }

  type GetStudentGroupByPayload<T extends StudentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudentGroupByOutputType[P]>
            : GetScalarType<T[P], StudentGroupByOutputType[P]>
        }
      >
    >


  export type StudentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    displayName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["student"]>

  export type StudentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    displayName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["student"]>

  export type StudentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    displayName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["student"]>

  export type StudentSelectScalar = {
    id?: boolean
    userId?: boolean
    displayName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StudentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "displayName" | "createdAt" | "updatedAt", ExtArgs["result"]["student"]>

  export type $StudentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Student"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      displayName: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["student"]>
    composites: {}
  }

  type StudentGetPayload<S extends boolean | null | undefined | StudentDefaultArgs> = $Result.GetResult<Prisma.$StudentPayload, S>

  type StudentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StudentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StudentCountAggregateInputType | true
    }

  export interface StudentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Student'], meta: { name: 'Student' } }
    /**
     * Find zero or one Student that matches the filter.
     * @param {StudentFindUniqueArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudentFindUniqueArgs>(args: SelectSubset<T, StudentFindUniqueArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Student that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StudentFindUniqueOrThrowArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudentFindUniqueOrThrowArgs>(args: SelectSubset<T, StudentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Student that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentFindFirstArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudentFindFirstArgs>(args?: SelectSubset<T, StudentFindFirstArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Student that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentFindFirstOrThrowArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudentFindFirstOrThrowArgs>(args?: SelectSubset<T, StudentFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Students that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Students
     * const students = await prisma.student.findMany()
     * 
     * // Get first 10 Students
     * const students = await prisma.student.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studentWithIdOnly = await prisma.student.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudentFindManyArgs>(args?: SelectSubset<T, StudentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Student.
     * @param {StudentCreateArgs} args - Arguments to create a Student.
     * @example
     * // Create one Student
     * const Student = await prisma.student.create({
     *   data: {
     *     // ... data to create a Student
     *   }
     * })
     * 
     */
    create<T extends StudentCreateArgs>(args: SelectSubset<T, StudentCreateArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Students.
     * @param {StudentCreateManyArgs} args - Arguments to create many Students.
     * @example
     * // Create many Students
     * const student = await prisma.student.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudentCreateManyArgs>(args?: SelectSubset<T, StudentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Students and returns the data saved in the database.
     * @param {StudentCreateManyAndReturnArgs} args - Arguments to create many Students.
     * @example
     * // Create many Students
     * const student = await prisma.student.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Students and only return the `id`
     * const studentWithIdOnly = await prisma.student.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudentCreateManyAndReturnArgs>(args?: SelectSubset<T, StudentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Student.
     * @param {StudentDeleteArgs} args - Arguments to delete one Student.
     * @example
     * // Delete one Student
     * const Student = await prisma.student.delete({
     *   where: {
     *     // ... filter to delete one Student
     *   }
     * })
     * 
     */
    delete<T extends StudentDeleteArgs>(args: SelectSubset<T, StudentDeleteArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Student.
     * @param {StudentUpdateArgs} args - Arguments to update one Student.
     * @example
     * // Update one Student
     * const student = await prisma.student.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudentUpdateArgs>(args: SelectSubset<T, StudentUpdateArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Students.
     * @param {StudentDeleteManyArgs} args - Arguments to filter Students to delete.
     * @example
     * // Delete a few Students
     * const { count } = await prisma.student.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudentDeleteManyArgs>(args?: SelectSubset<T, StudentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Students.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Students
     * const student = await prisma.student.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudentUpdateManyArgs>(args: SelectSubset<T, StudentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Students and returns the data updated in the database.
     * @param {StudentUpdateManyAndReturnArgs} args - Arguments to update many Students.
     * @example
     * // Update many Students
     * const student = await prisma.student.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Students and only return the `id`
     * const studentWithIdOnly = await prisma.student.updateManyAndReturn({
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
    updateManyAndReturn<T extends StudentUpdateManyAndReturnArgs>(args: SelectSubset<T, StudentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Student.
     * @param {StudentUpsertArgs} args - Arguments to update or create a Student.
     * @example
     * // Update or create a Student
     * const student = await prisma.student.upsert({
     *   create: {
     *     // ... data to create a Student
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Student we want to update
     *   }
     * })
     */
    upsert<T extends StudentUpsertArgs>(args: SelectSubset<T, StudentUpsertArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Students.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentCountArgs} args - Arguments to filter Students to count.
     * @example
     * // Count the number of Students
     * const count = await prisma.student.count({
     *   where: {
     *     // ... the filter for the Students we want to count
     *   }
     * })
    **/
    count<T extends StudentCountArgs>(
      args?: Subset<T, StudentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Student.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StudentAggregateArgs>(args: Subset<T, StudentAggregateArgs>): Prisma.PrismaPromise<GetStudentAggregateType<T>>

    /**
     * Group by Student.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentGroupByArgs} args - Group by arguments.
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
      T extends StudentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudentGroupByArgs['orderBy'] }
        : { orderBy?: StudentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, StudentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Student model
   */
  readonly fields: StudentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Student.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Student model
   */
  interface StudentFieldRefs {
    readonly id: FieldRef<"Student", 'String'>
    readonly userId: FieldRef<"Student", 'String'>
    readonly displayName: FieldRef<"Student", 'String'>
    readonly createdAt: FieldRef<"Student", 'DateTime'>
    readonly updatedAt: FieldRef<"Student", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Student findUnique
   */
  export type StudentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student findUniqueOrThrow
   */
  export type StudentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student findFirst
   */
  export type StudentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Students.
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Students.
     */
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Student findFirstOrThrow
   */
  export type StudentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Students.
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Students.
     */
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Student findMany
   */
  export type StudentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Filter, which Students to fetch.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Students.
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Student create
   */
  export type StudentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * The data needed to create a Student.
     */
    data: XOR<StudentCreateInput, StudentUncheckedCreateInput>
  }

  /**
   * Student createMany
   */
  export type StudentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Students.
     */
    data: StudentCreateManyInput | StudentCreateManyInput[]
  }

  /**
   * Student createManyAndReturn
   */
  export type StudentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * The data used to create many Students.
     */
    data: StudentCreateManyInput | StudentCreateManyInput[]
  }

  /**
   * Student update
   */
  export type StudentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * The data needed to update a Student.
     */
    data: XOR<StudentUpdateInput, StudentUncheckedUpdateInput>
    /**
     * Choose, which Student to update.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student updateMany
   */
  export type StudentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Students.
     */
    data: XOR<StudentUpdateManyMutationInput, StudentUncheckedUpdateManyInput>
    /**
     * Filter which Students to update
     */
    where?: StudentWhereInput
    /**
     * Limit how many Students to update.
     */
    limit?: number
  }

  /**
   * Student updateManyAndReturn
   */
  export type StudentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * The data used to update Students.
     */
    data: XOR<StudentUpdateManyMutationInput, StudentUncheckedUpdateManyInput>
    /**
     * Filter which Students to update
     */
    where?: StudentWhereInput
    /**
     * Limit how many Students to update.
     */
    limit?: number
  }

  /**
   * Student upsert
   */
  export type StudentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * The filter to search for the Student to update in case it exists.
     */
    where: StudentWhereUniqueInput
    /**
     * In case the Student found by the `where` argument doesn't exist, create a new Student with this data.
     */
    create: XOR<StudentCreateInput, StudentUncheckedCreateInput>
    /**
     * In case the Student was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudentUpdateInput, StudentUncheckedUpdateInput>
  }

  /**
   * Student delete
   */
  export type StudentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Filter which Student to delete.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student deleteMany
   */
  export type StudentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Students to delete
     */
    where?: StudentWhereInput
    /**
     * Limit how many Students to delete.
     */
    limit?: number
  }

  /**
   * Student without action
   */
  export type StudentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
  }


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
    Course?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentNote"]>

  export type StudentNoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    courseId?: boolean
    body?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    Course?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentNote"]>

  export type StudentNoteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    courseId?: boolean
    body?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    Course?: boolean | CourseDefaultArgs<ExtArgs>
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
  export type StudentNoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Course?: boolean | CourseDefaultArgs<ExtArgs>
  }
  export type StudentNoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Course?: boolean | CourseDefaultArgs<ExtArgs>
  }
  export type StudentNoteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Course?: boolean | CourseDefaultArgs<ExtArgs>
  }

  export type $StudentNotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StudentNote"
    objects: {
      Course: Prisma.$CoursePayload<ExtArgs>
    }
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
    Course<T extends CourseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CourseDefaultArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
     * Choose, which related nodes to fetch as well
     */
    include?: StudentNoteInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: StudentNoteInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: StudentNoteInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: StudentNoteInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: StudentNoteInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: StudentNoteInclude<ExtArgs> | null
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentNoteIncludeCreateManyAndReturn<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: StudentNoteInclude<ExtArgs> | null
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentNoteIncludeUpdateManyAndReturn<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: StudentNoteInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: StudentNoteInclude<ExtArgs> | null
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentNoteInclude<ExtArgs> | null
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
    studentProgress?: boolean | Course$studentProgressArgs<ExtArgs>
    gradebookEntries?: boolean | Course$gradebookEntriesArgs<ExtArgs>
    studentNotes?: boolean | Course$studentNotesArgs<ExtArgs>
    StudentCourse?: boolean | Course$StudentCourseArgs<ExtArgs>
    _count?: boolean | CourseCountOutputTypeDefaultArgs<ExtArgs>
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
  export type CourseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    studentProgress?: boolean | Course$studentProgressArgs<ExtArgs>
    gradebookEntries?: boolean | Course$gradebookEntriesArgs<ExtArgs>
    studentNotes?: boolean | Course$studentNotesArgs<ExtArgs>
    StudentCourse?: boolean | Course$StudentCourseArgs<ExtArgs>
    _count?: boolean | CourseCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CourseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CourseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CoursePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Course"
    objects: {
      studentProgress: Prisma.$StudentProgressPayload<ExtArgs>[]
      gradebookEntries: Prisma.$GradebookEntryPayload<ExtArgs>[]
      studentNotes: Prisma.$StudentNotePayload<ExtArgs>[]
      StudentCourse: Prisma.$StudentCoursePayload<ExtArgs>[]
    }
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
    studentProgress<T extends Course$studentProgressArgs<ExtArgs> = {}>(args?: Subset<T, Course$studentProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    gradebookEntries<T extends Course$gradebookEntriesArgs<ExtArgs> = {}>(args?: Subset<T, Course$gradebookEntriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GradebookEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    studentNotes<T extends Course$studentNotesArgs<ExtArgs> = {}>(args?: Subset<T, Course$studentNotesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentNotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    StudentCourse<T extends Course$StudentCourseArgs<ExtArgs> = {}>(args?: Subset<T, Course$StudentCourseArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentCoursePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
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
   * Course.studentProgress
   */
  export type Course$studentProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProgress
     */
    select?: StudentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProgress
     */
    omit?: StudentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProgressInclude<ExtArgs> | null
    where?: StudentProgressWhereInput
    orderBy?: StudentProgressOrderByWithRelationInput | StudentProgressOrderByWithRelationInput[]
    cursor?: StudentProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentProgressScalarFieldEnum | StudentProgressScalarFieldEnum[]
  }

  /**
   * Course.gradebookEntries
   */
  export type Course$gradebookEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GradebookEntry
     */
    select?: GradebookEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GradebookEntry
     */
    omit?: GradebookEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradebookEntryInclude<ExtArgs> | null
    where?: GradebookEntryWhereInput
    orderBy?: GradebookEntryOrderByWithRelationInput | GradebookEntryOrderByWithRelationInput[]
    cursor?: GradebookEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GradebookEntryScalarFieldEnum | GradebookEntryScalarFieldEnum[]
  }

  /**
   * Course.studentNotes
   */
  export type Course$studentNotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentNote
     */
    select?: StudentNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentNote
     */
    omit?: StudentNoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentNoteInclude<ExtArgs> | null
    where?: StudentNoteWhereInput
    orderBy?: StudentNoteOrderByWithRelationInput | StudentNoteOrderByWithRelationInput[]
    cursor?: StudentNoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentNoteScalarFieldEnum | StudentNoteScalarFieldEnum[]
  }

  /**
   * Course.StudentCourse
   */
  export type Course$StudentCourseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentCourse
     */
    select?: StudentCourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentCourse
     */
    omit?: StudentCourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentCourseInclude<ExtArgs> | null
    where?: StudentCourseWhereInput
    orderBy?: StudentCourseOrderByWithRelationInput | StudentCourseOrderByWithRelationInput[]
    cursor?: StudentCourseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentCourseScalarFieldEnum | StudentCourseScalarFieldEnum[]
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
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
    course?: boolean | GradebookEntry$courseArgs<ExtArgs>
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
    course?: boolean | GradebookEntry$courseArgs<ExtArgs>
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
    course?: boolean | GradebookEntry$courseArgs<ExtArgs>
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
  export type GradebookEntryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    course?: boolean | GradebookEntry$courseArgs<ExtArgs>
  }
  export type GradebookEntryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    course?: boolean | GradebookEntry$courseArgs<ExtArgs>
  }
  export type GradebookEntryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    course?: boolean | GradebookEntry$courseArgs<ExtArgs>
  }

  export type $GradebookEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GradebookEntry"
    objects: {
      course: Prisma.$CoursePayload<ExtArgs> | null
    }
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
    course<T extends GradebookEntry$courseArgs<ExtArgs> = {}>(args?: Subset<T, GradebookEntry$courseArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
     * Choose, which related nodes to fetch as well
     */
    include?: GradebookEntryInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: GradebookEntryInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: GradebookEntryInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: GradebookEntryInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: GradebookEntryInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: GradebookEntryInclude<ExtArgs> | null
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradebookEntryIncludeCreateManyAndReturn<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: GradebookEntryInclude<ExtArgs> | null
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradebookEntryIncludeUpdateManyAndReturn<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: GradebookEntryInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: GradebookEntryInclude<ExtArgs> | null
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
   * GradebookEntry.course
   */
  export type GradebookEntry$courseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    where?: CourseWhereInput
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GradebookEntryInclude<ExtArgs> | null
  }


  /**
   * Model StudentProgress
   */

  export type AggregateStudentProgress = {
    _count: StudentProgressCountAggregateOutputType | null
    _avg: StudentProgressAvgAggregateOutputType | null
    _sum: StudentProgressSumAggregateOutputType | null
    _min: StudentProgressMinAggregateOutputType | null
    _max: StudentProgressMaxAggregateOutputType | null
  }

  export type StudentProgressAvgAggregateOutputType = {
    score: number | null
    progressPct: number | null
  }

  export type StudentProgressSumAggregateOutputType = {
    score: number | null
    progressPct: number | null
  }

  export type StudentProgressMinAggregateOutputType = {
    id: string | null
    studentId: string | null
    courseId: string | null
    moduleId: string | null
    lessonId: string | null
    completed: boolean | null
    score: number | null
    progressPct: number | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type StudentProgressMaxAggregateOutputType = {
    id: string | null
    studentId: string | null
    courseId: string | null
    moduleId: string | null
    lessonId: string | null
    completed: boolean | null
    score: number | null
    progressPct: number | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type StudentProgressCountAggregateOutputType = {
    id: number
    studentId: number
    courseId: number
    moduleId: number
    lessonId: number
    completed: number
    score: number
    progressPct: number
    updatedAt: number
    createdAt: number
    _all: number
  }


  export type StudentProgressAvgAggregateInputType = {
    score?: true
    progressPct?: true
  }

  export type StudentProgressSumAggregateInputType = {
    score?: true
    progressPct?: true
  }

  export type StudentProgressMinAggregateInputType = {
    id?: true
    studentId?: true
    courseId?: true
    moduleId?: true
    lessonId?: true
    completed?: true
    score?: true
    progressPct?: true
    updatedAt?: true
    createdAt?: true
  }

  export type StudentProgressMaxAggregateInputType = {
    id?: true
    studentId?: true
    courseId?: true
    moduleId?: true
    lessonId?: true
    completed?: true
    score?: true
    progressPct?: true
    updatedAt?: true
    createdAt?: true
  }

  export type StudentProgressCountAggregateInputType = {
    id?: true
    studentId?: true
    courseId?: true
    moduleId?: true
    lessonId?: true
    completed?: true
    score?: true
    progressPct?: true
    updatedAt?: true
    createdAt?: true
    _all?: true
  }

  export type StudentProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentProgress to aggregate.
     */
    where?: StudentProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentProgresses to fetch.
     */
    orderBy?: StudentProgressOrderByWithRelationInput | StudentProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudentProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StudentProgresses
    **/
    _count?: true | StudentProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StudentProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StudentProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudentProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudentProgressMaxAggregateInputType
  }

  export type GetStudentProgressAggregateType<T extends StudentProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateStudentProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudentProgress[P]>
      : GetScalarType<T[P], AggregateStudentProgress[P]>
  }




  export type StudentProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentProgressWhereInput
    orderBy?: StudentProgressOrderByWithAggregationInput | StudentProgressOrderByWithAggregationInput[]
    by: StudentProgressScalarFieldEnum[] | StudentProgressScalarFieldEnum
    having?: StudentProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudentProgressCountAggregateInputType | true
    _avg?: StudentProgressAvgAggregateInputType
    _sum?: StudentProgressSumAggregateInputType
    _min?: StudentProgressMinAggregateInputType
    _max?: StudentProgressMaxAggregateInputType
  }

  export type StudentProgressGroupByOutputType = {
    id: string
    studentId: string
    courseId: string
    moduleId: string | null
    lessonId: string | null
    completed: boolean
    score: number | null
    progressPct: number
    updatedAt: Date
    createdAt: Date
    _count: StudentProgressCountAggregateOutputType | null
    _avg: StudentProgressAvgAggregateOutputType | null
    _sum: StudentProgressSumAggregateOutputType | null
    _min: StudentProgressMinAggregateOutputType | null
    _max: StudentProgressMaxAggregateOutputType | null
  }

  type GetStudentProgressGroupByPayload<T extends StudentProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudentProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudentProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudentProgressGroupByOutputType[P]>
            : GetScalarType<T[P], StudentProgressGroupByOutputType[P]>
        }
      >
    >


  export type StudentProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    courseId?: boolean
    moduleId?: boolean
    lessonId?: boolean
    completed?: boolean
    score?: boolean
    progressPct?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    course?: boolean | StudentProgress$courseArgs<ExtArgs>
  }, ExtArgs["result"]["studentProgress"]>

  export type StudentProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    courseId?: boolean
    moduleId?: boolean
    lessonId?: boolean
    completed?: boolean
    score?: boolean
    progressPct?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    course?: boolean | StudentProgress$courseArgs<ExtArgs>
  }, ExtArgs["result"]["studentProgress"]>

  export type StudentProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    courseId?: boolean
    moduleId?: boolean
    lessonId?: boolean
    completed?: boolean
    score?: boolean
    progressPct?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    course?: boolean | StudentProgress$courseArgs<ExtArgs>
  }, ExtArgs["result"]["studentProgress"]>

  export type StudentProgressSelectScalar = {
    id?: boolean
    studentId?: boolean
    courseId?: boolean
    moduleId?: boolean
    lessonId?: boolean
    completed?: boolean
    score?: boolean
    progressPct?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }

  export type StudentProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "studentId" | "courseId" | "moduleId" | "lessonId" | "completed" | "score" | "progressPct" | "updatedAt" | "createdAt", ExtArgs["result"]["studentProgress"]>
  export type StudentProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    course?: boolean | StudentProgress$courseArgs<ExtArgs>
  }
  export type StudentProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    course?: boolean | StudentProgress$courseArgs<ExtArgs>
  }
  export type StudentProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    course?: boolean | StudentProgress$courseArgs<ExtArgs>
  }

  export type $StudentProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StudentProgress"
    objects: {
      course: Prisma.$CoursePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studentId: string
      courseId: string
      moduleId: string | null
      lessonId: string | null
      completed: boolean
      score: number | null
      progressPct: number
      updatedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["studentProgress"]>
    composites: {}
  }

  type StudentProgressGetPayload<S extends boolean | null | undefined | StudentProgressDefaultArgs> = $Result.GetResult<Prisma.$StudentProgressPayload, S>

  type StudentProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StudentProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StudentProgressCountAggregateInputType | true
    }

  export interface StudentProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StudentProgress'], meta: { name: 'StudentProgress' } }
    /**
     * Find zero or one StudentProgress that matches the filter.
     * @param {StudentProgressFindUniqueArgs} args - Arguments to find a StudentProgress
     * @example
     * // Get one StudentProgress
     * const studentProgress = await prisma.studentProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudentProgressFindUniqueArgs>(args: SelectSubset<T, StudentProgressFindUniqueArgs<ExtArgs>>): Prisma__StudentProgressClient<$Result.GetResult<Prisma.$StudentProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StudentProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StudentProgressFindUniqueOrThrowArgs} args - Arguments to find a StudentProgress
     * @example
     * // Get one StudentProgress
     * const studentProgress = await prisma.studentProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudentProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, StudentProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudentProgressClient<$Result.GetResult<Prisma.$StudentProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StudentProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProgressFindFirstArgs} args - Arguments to find a StudentProgress
     * @example
     * // Get one StudentProgress
     * const studentProgress = await prisma.studentProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudentProgressFindFirstArgs>(args?: SelectSubset<T, StudentProgressFindFirstArgs<ExtArgs>>): Prisma__StudentProgressClient<$Result.GetResult<Prisma.$StudentProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StudentProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProgressFindFirstOrThrowArgs} args - Arguments to find a StudentProgress
     * @example
     * // Get one StudentProgress
     * const studentProgress = await prisma.studentProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudentProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, StudentProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudentProgressClient<$Result.GetResult<Prisma.$StudentProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StudentProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StudentProgresses
     * const studentProgresses = await prisma.studentProgress.findMany()
     * 
     * // Get first 10 StudentProgresses
     * const studentProgresses = await prisma.studentProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studentProgressWithIdOnly = await prisma.studentProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudentProgressFindManyArgs>(args?: SelectSubset<T, StudentProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StudentProgress.
     * @param {StudentProgressCreateArgs} args - Arguments to create a StudentProgress.
     * @example
     * // Create one StudentProgress
     * const StudentProgress = await prisma.studentProgress.create({
     *   data: {
     *     // ... data to create a StudentProgress
     *   }
     * })
     * 
     */
    create<T extends StudentProgressCreateArgs>(args: SelectSubset<T, StudentProgressCreateArgs<ExtArgs>>): Prisma__StudentProgressClient<$Result.GetResult<Prisma.$StudentProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StudentProgresses.
     * @param {StudentProgressCreateManyArgs} args - Arguments to create many StudentProgresses.
     * @example
     * // Create many StudentProgresses
     * const studentProgress = await prisma.studentProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudentProgressCreateManyArgs>(args?: SelectSubset<T, StudentProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StudentProgresses and returns the data saved in the database.
     * @param {StudentProgressCreateManyAndReturnArgs} args - Arguments to create many StudentProgresses.
     * @example
     * // Create many StudentProgresses
     * const studentProgress = await prisma.studentProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StudentProgresses and only return the `id`
     * const studentProgressWithIdOnly = await prisma.studentProgress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudentProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, StudentProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StudentProgress.
     * @param {StudentProgressDeleteArgs} args - Arguments to delete one StudentProgress.
     * @example
     * // Delete one StudentProgress
     * const StudentProgress = await prisma.studentProgress.delete({
     *   where: {
     *     // ... filter to delete one StudentProgress
     *   }
     * })
     * 
     */
    delete<T extends StudentProgressDeleteArgs>(args: SelectSubset<T, StudentProgressDeleteArgs<ExtArgs>>): Prisma__StudentProgressClient<$Result.GetResult<Prisma.$StudentProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StudentProgress.
     * @param {StudentProgressUpdateArgs} args - Arguments to update one StudentProgress.
     * @example
     * // Update one StudentProgress
     * const studentProgress = await prisma.studentProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudentProgressUpdateArgs>(args: SelectSubset<T, StudentProgressUpdateArgs<ExtArgs>>): Prisma__StudentProgressClient<$Result.GetResult<Prisma.$StudentProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StudentProgresses.
     * @param {StudentProgressDeleteManyArgs} args - Arguments to filter StudentProgresses to delete.
     * @example
     * // Delete a few StudentProgresses
     * const { count } = await prisma.studentProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudentProgressDeleteManyArgs>(args?: SelectSubset<T, StudentProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudentProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StudentProgresses
     * const studentProgress = await prisma.studentProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudentProgressUpdateManyArgs>(args: SelectSubset<T, StudentProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudentProgresses and returns the data updated in the database.
     * @param {StudentProgressUpdateManyAndReturnArgs} args - Arguments to update many StudentProgresses.
     * @example
     * // Update many StudentProgresses
     * const studentProgress = await prisma.studentProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StudentProgresses and only return the `id`
     * const studentProgressWithIdOnly = await prisma.studentProgress.updateManyAndReturn({
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
    updateManyAndReturn<T extends StudentProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, StudentProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StudentProgress.
     * @param {StudentProgressUpsertArgs} args - Arguments to update or create a StudentProgress.
     * @example
     * // Update or create a StudentProgress
     * const studentProgress = await prisma.studentProgress.upsert({
     *   create: {
     *     // ... data to create a StudentProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StudentProgress we want to update
     *   }
     * })
     */
    upsert<T extends StudentProgressUpsertArgs>(args: SelectSubset<T, StudentProgressUpsertArgs<ExtArgs>>): Prisma__StudentProgressClient<$Result.GetResult<Prisma.$StudentProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StudentProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProgressCountArgs} args - Arguments to filter StudentProgresses to count.
     * @example
     * // Count the number of StudentProgresses
     * const count = await prisma.studentProgress.count({
     *   where: {
     *     // ... the filter for the StudentProgresses we want to count
     *   }
     * })
    **/
    count<T extends StudentProgressCountArgs>(
      args?: Subset<T, StudentProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudentProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StudentProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StudentProgressAggregateArgs>(args: Subset<T, StudentProgressAggregateArgs>): Prisma.PrismaPromise<GetStudentProgressAggregateType<T>>

    /**
     * Group by StudentProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProgressGroupByArgs} args - Group by arguments.
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
      T extends StudentProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudentProgressGroupByArgs['orderBy'] }
        : { orderBy?: StudentProgressGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, StudentProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StudentProgress model
   */
  readonly fields: StudentProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StudentProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudentProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    course<T extends StudentProgress$courseArgs<ExtArgs> = {}>(args?: Subset<T, StudentProgress$courseArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the StudentProgress model
   */
  interface StudentProgressFieldRefs {
    readonly id: FieldRef<"StudentProgress", 'String'>
    readonly studentId: FieldRef<"StudentProgress", 'String'>
    readonly courseId: FieldRef<"StudentProgress", 'String'>
    readonly moduleId: FieldRef<"StudentProgress", 'String'>
    readonly lessonId: FieldRef<"StudentProgress", 'String'>
    readonly completed: FieldRef<"StudentProgress", 'Boolean'>
    readonly score: FieldRef<"StudentProgress", 'Float'>
    readonly progressPct: FieldRef<"StudentProgress", 'Int'>
    readonly updatedAt: FieldRef<"StudentProgress", 'DateTime'>
    readonly createdAt: FieldRef<"StudentProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StudentProgress findUnique
   */
  export type StudentProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProgress
     */
    select?: StudentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProgress
     */
    omit?: StudentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProgressInclude<ExtArgs> | null
    /**
     * Filter, which StudentProgress to fetch.
     */
    where: StudentProgressWhereUniqueInput
  }

  /**
   * StudentProgress findUniqueOrThrow
   */
  export type StudentProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProgress
     */
    select?: StudentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProgress
     */
    omit?: StudentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProgressInclude<ExtArgs> | null
    /**
     * Filter, which StudentProgress to fetch.
     */
    where: StudentProgressWhereUniqueInput
  }

  /**
   * StudentProgress findFirst
   */
  export type StudentProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProgress
     */
    select?: StudentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProgress
     */
    omit?: StudentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProgressInclude<ExtArgs> | null
    /**
     * Filter, which StudentProgress to fetch.
     */
    where?: StudentProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentProgresses to fetch.
     */
    orderBy?: StudentProgressOrderByWithRelationInput | StudentProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentProgresses.
     */
    cursor?: StudentProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentProgresses.
     */
    distinct?: StudentProgressScalarFieldEnum | StudentProgressScalarFieldEnum[]
  }

  /**
   * StudentProgress findFirstOrThrow
   */
  export type StudentProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProgress
     */
    select?: StudentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProgress
     */
    omit?: StudentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProgressInclude<ExtArgs> | null
    /**
     * Filter, which StudentProgress to fetch.
     */
    where?: StudentProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentProgresses to fetch.
     */
    orderBy?: StudentProgressOrderByWithRelationInput | StudentProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentProgresses.
     */
    cursor?: StudentProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentProgresses.
     */
    distinct?: StudentProgressScalarFieldEnum | StudentProgressScalarFieldEnum[]
  }

  /**
   * StudentProgress findMany
   */
  export type StudentProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProgress
     */
    select?: StudentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProgress
     */
    omit?: StudentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProgressInclude<ExtArgs> | null
    /**
     * Filter, which StudentProgresses to fetch.
     */
    where?: StudentProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentProgresses to fetch.
     */
    orderBy?: StudentProgressOrderByWithRelationInput | StudentProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StudentProgresses.
     */
    cursor?: StudentProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentProgresses.
     */
    skip?: number
    distinct?: StudentProgressScalarFieldEnum | StudentProgressScalarFieldEnum[]
  }

  /**
   * StudentProgress create
   */
  export type StudentProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProgress
     */
    select?: StudentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProgress
     */
    omit?: StudentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a StudentProgress.
     */
    data: XOR<StudentProgressCreateInput, StudentProgressUncheckedCreateInput>
  }

  /**
   * StudentProgress createMany
   */
  export type StudentProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StudentProgresses.
     */
    data: StudentProgressCreateManyInput | StudentProgressCreateManyInput[]
  }

  /**
   * StudentProgress createManyAndReturn
   */
  export type StudentProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProgress
     */
    select?: StudentProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProgress
     */
    omit?: StudentProgressOmit<ExtArgs> | null
    /**
     * The data used to create many StudentProgresses.
     */
    data: StudentProgressCreateManyInput | StudentProgressCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StudentProgress update
   */
  export type StudentProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProgress
     */
    select?: StudentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProgress
     */
    omit?: StudentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a StudentProgress.
     */
    data: XOR<StudentProgressUpdateInput, StudentProgressUncheckedUpdateInput>
    /**
     * Choose, which StudentProgress to update.
     */
    where: StudentProgressWhereUniqueInput
  }

  /**
   * StudentProgress updateMany
   */
  export type StudentProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StudentProgresses.
     */
    data: XOR<StudentProgressUpdateManyMutationInput, StudentProgressUncheckedUpdateManyInput>
    /**
     * Filter which StudentProgresses to update
     */
    where?: StudentProgressWhereInput
    /**
     * Limit how many StudentProgresses to update.
     */
    limit?: number
  }

  /**
   * StudentProgress updateManyAndReturn
   */
  export type StudentProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProgress
     */
    select?: StudentProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProgress
     */
    omit?: StudentProgressOmit<ExtArgs> | null
    /**
     * The data used to update StudentProgresses.
     */
    data: XOR<StudentProgressUpdateManyMutationInput, StudentProgressUncheckedUpdateManyInput>
    /**
     * Filter which StudentProgresses to update
     */
    where?: StudentProgressWhereInput
    /**
     * Limit how many StudentProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StudentProgress upsert
   */
  export type StudentProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProgress
     */
    select?: StudentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProgress
     */
    omit?: StudentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the StudentProgress to update in case it exists.
     */
    where: StudentProgressWhereUniqueInput
    /**
     * In case the StudentProgress found by the `where` argument doesn't exist, create a new StudentProgress with this data.
     */
    create: XOR<StudentProgressCreateInput, StudentProgressUncheckedCreateInput>
    /**
     * In case the StudentProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudentProgressUpdateInput, StudentProgressUncheckedUpdateInput>
  }

  /**
   * StudentProgress delete
   */
  export type StudentProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProgress
     */
    select?: StudentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProgress
     */
    omit?: StudentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProgressInclude<ExtArgs> | null
    /**
     * Filter which StudentProgress to delete.
     */
    where: StudentProgressWhereUniqueInput
  }

  /**
   * StudentProgress deleteMany
   */
  export type StudentProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentProgresses to delete
     */
    where?: StudentProgressWhereInput
    /**
     * Limit how many StudentProgresses to delete.
     */
    limit?: number
  }

  /**
   * StudentProgress.course
   */
  export type StudentProgress$courseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    where?: CourseWhereInput
  }

  /**
   * StudentProgress without action
   */
  export type StudentProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProgress
     */
    select?: StudentProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentProgress
     */
    omit?: StudentProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProgressInclude<ExtArgs> | null
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
   * Model StudentCourse
   */

  export type AggregateStudentCourse = {
    _count: StudentCourseCountAggregateOutputType | null
    _avg: StudentCourseAvgAggregateOutputType | null
    _sum: StudentCourseSumAggregateOutputType | null
    _min: StudentCourseMinAggregateOutputType | null
    _max: StudentCourseMaxAggregateOutputType | null
  }

  export type StudentCourseAvgAggregateOutputType = {
    progress: number | null
  }

  export type StudentCourseSumAggregateOutputType = {
    progress: number | null
  }

  export type StudentCourseMinAggregateOutputType = {
    id: string | null
    studentId: string | null
    courseId: string | null
    completed: boolean | null
    progress: number | null
    enrolledAt: Date | null
    updatedAt: Date | null
  }

  export type StudentCourseMaxAggregateOutputType = {
    id: string | null
    studentId: string | null
    courseId: string | null
    completed: boolean | null
    progress: number | null
    enrolledAt: Date | null
    updatedAt: Date | null
  }

  export type StudentCourseCountAggregateOutputType = {
    id: number
    studentId: number
    courseId: number
    completed: number
    progress: number
    enrolledAt: number
    updatedAt: number
    _all: number
  }


  export type StudentCourseAvgAggregateInputType = {
    progress?: true
  }

  export type StudentCourseSumAggregateInputType = {
    progress?: true
  }

  export type StudentCourseMinAggregateInputType = {
    id?: true
    studentId?: true
    courseId?: true
    completed?: true
    progress?: true
    enrolledAt?: true
    updatedAt?: true
  }

  export type StudentCourseMaxAggregateInputType = {
    id?: true
    studentId?: true
    courseId?: true
    completed?: true
    progress?: true
    enrolledAt?: true
    updatedAt?: true
  }

  export type StudentCourseCountAggregateInputType = {
    id?: true
    studentId?: true
    courseId?: true
    completed?: true
    progress?: true
    enrolledAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StudentCourseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentCourse to aggregate.
     */
    where?: StudentCourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentCourses to fetch.
     */
    orderBy?: StudentCourseOrderByWithRelationInput | StudentCourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudentCourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentCourses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentCourses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StudentCourses
    **/
    _count?: true | StudentCourseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StudentCourseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StudentCourseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudentCourseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudentCourseMaxAggregateInputType
  }

  export type GetStudentCourseAggregateType<T extends StudentCourseAggregateArgs> = {
        [P in keyof T & keyof AggregateStudentCourse]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudentCourse[P]>
      : GetScalarType<T[P], AggregateStudentCourse[P]>
  }




  export type StudentCourseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentCourseWhereInput
    orderBy?: StudentCourseOrderByWithAggregationInput | StudentCourseOrderByWithAggregationInput[]
    by: StudentCourseScalarFieldEnum[] | StudentCourseScalarFieldEnum
    having?: StudentCourseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudentCourseCountAggregateInputType | true
    _avg?: StudentCourseAvgAggregateInputType
    _sum?: StudentCourseSumAggregateInputType
    _min?: StudentCourseMinAggregateInputType
    _max?: StudentCourseMaxAggregateInputType
  }

  export type StudentCourseGroupByOutputType = {
    id: string
    studentId: string
    courseId: string
    completed: boolean
    progress: number
    enrolledAt: Date
    updatedAt: Date
    _count: StudentCourseCountAggregateOutputType | null
    _avg: StudentCourseAvgAggregateOutputType | null
    _sum: StudentCourseSumAggregateOutputType | null
    _min: StudentCourseMinAggregateOutputType | null
    _max: StudentCourseMaxAggregateOutputType | null
  }

  type GetStudentCourseGroupByPayload<T extends StudentCourseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudentCourseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudentCourseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudentCourseGroupByOutputType[P]>
            : GetScalarType<T[P], StudentCourseGroupByOutputType[P]>
        }
      >
    >


  export type StudentCourseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    courseId?: boolean
    completed?: boolean
    progress?: boolean
    enrolledAt?: boolean
    updatedAt?: boolean
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentCourse"]>

  export type StudentCourseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    courseId?: boolean
    completed?: boolean
    progress?: boolean
    enrolledAt?: boolean
    updatedAt?: boolean
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentCourse"]>

  export type StudentCourseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    courseId?: boolean
    completed?: boolean
    progress?: boolean
    enrolledAt?: boolean
    updatedAt?: boolean
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentCourse"]>

  export type StudentCourseSelectScalar = {
    id?: boolean
    studentId?: boolean
    courseId?: boolean
    completed?: boolean
    progress?: boolean
    enrolledAt?: boolean
    updatedAt?: boolean
  }

  export type StudentCourseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "studentId" | "courseId" | "completed" | "progress" | "enrolledAt" | "updatedAt", ExtArgs["result"]["studentCourse"]>
  export type StudentCourseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }
  export type StudentCourseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }
  export type StudentCourseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }

  export type $StudentCoursePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StudentCourse"
    objects: {
      course: Prisma.$CoursePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studentId: string
      courseId: string
      completed: boolean
      progress: number
      enrolledAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["studentCourse"]>
    composites: {}
  }

  type StudentCourseGetPayload<S extends boolean | null | undefined | StudentCourseDefaultArgs> = $Result.GetResult<Prisma.$StudentCoursePayload, S>

  type StudentCourseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StudentCourseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StudentCourseCountAggregateInputType | true
    }

  export interface StudentCourseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StudentCourse'], meta: { name: 'StudentCourse' } }
    /**
     * Find zero or one StudentCourse that matches the filter.
     * @param {StudentCourseFindUniqueArgs} args - Arguments to find a StudentCourse
     * @example
     * // Get one StudentCourse
     * const studentCourse = await prisma.studentCourse.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudentCourseFindUniqueArgs>(args: SelectSubset<T, StudentCourseFindUniqueArgs<ExtArgs>>): Prisma__StudentCourseClient<$Result.GetResult<Prisma.$StudentCoursePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StudentCourse that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StudentCourseFindUniqueOrThrowArgs} args - Arguments to find a StudentCourse
     * @example
     * // Get one StudentCourse
     * const studentCourse = await prisma.studentCourse.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudentCourseFindUniqueOrThrowArgs>(args: SelectSubset<T, StudentCourseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudentCourseClient<$Result.GetResult<Prisma.$StudentCoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StudentCourse that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentCourseFindFirstArgs} args - Arguments to find a StudentCourse
     * @example
     * // Get one StudentCourse
     * const studentCourse = await prisma.studentCourse.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudentCourseFindFirstArgs>(args?: SelectSubset<T, StudentCourseFindFirstArgs<ExtArgs>>): Prisma__StudentCourseClient<$Result.GetResult<Prisma.$StudentCoursePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StudentCourse that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentCourseFindFirstOrThrowArgs} args - Arguments to find a StudentCourse
     * @example
     * // Get one StudentCourse
     * const studentCourse = await prisma.studentCourse.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudentCourseFindFirstOrThrowArgs>(args?: SelectSubset<T, StudentCourseFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudentCourseClient<$Result.GetResult<Prisma.$StudentCoursePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StudentCourses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentCourseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StudentCourses
     * const studentCourses = await prisma.studentCourse.findMany()
     * 
     * // Get first 10 StudentCourses
     * const studentCourses = await prisma.studentCourse.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studentCourseWithIdOnly = await prisma.studentCourse.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudentCourseFindManyArgs>(args?: SelectSubset<T, StudentCourseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentCoursePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StudentCourse.
     * @param {StudentCourseCreateArgs} args - Arguments to create a StudentCourse.
     * @example
     * // Create one StudentCourse
     * const StudentCourse = await prisma.studentCourse.create({
     *   data: {
     *     // ... data to create a StudentCourse
     *   }
     * })
     * 
     */
    create<T extends StudentCourseCreateArgs>(args: SelectSubset<T, StudentCourseCreateArgs<ExtArgs>>): Prisma__StudentCourseClient<$Result.GetResult<Prisma.$StudentCoursePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StudentCourses.
     * @param {StudentCourseCreateManyArgs} args - Arguments to create many StudentCourses.
     * @example
     * // Create many StudentCourses
     * const studentCourse = await prisma.studentCourse.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudentCourseCreateManyArgs>(args?: SelectSubset<T, StudentCourseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StudentCourses and returns the data saved in the database.
     * @param {StudentCourseCreateManyAndReturnArgs} args - Arguments to create many StudentCourses.
     * @example
     * // Create many StudentCourses
     * const studentCourse = await prisma.studentCourse.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StudentCourses and only return the `id`
     * const studentCourseWithIdOnly = await prisma.studentCourse.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudentCourseCreateManyAndReturnArgs>(args?: SelectSubset<T, StudentCourseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentCoursePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StudentCourse.
     * @param {StudentCourseDeleteArgs} args - Arguments to delete one StudentCourse.
     * @example
     * // Delete one StudentCourse
     * const StudentCourse = await prisma.studentCourse.delete({
     *   where: {
     *     // ... filter to delete one StudentCourse
     *   }
     * })
     * 
     */
    delete<T extends StudentCourseDeleteArgs>(args: SelectSubset<T, StudentCourseDeleteArgs<ExtArgs>>): Prisma__StudentCourseClient<$Result.GetResult<Prisma.$StudentCoursePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StudentCourse.
     * @param {StudentCourseUpdateArgs} args - Arguments to update one StudentCourse.
     * @example
     * // Update one StudentCourse
     * const studentCourse = await prisma.studentCourse.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudentCourseUpdateArgs>(args: SelectSubset<T, StudentCourseUpdateArgs<ExtArgs>>): Prisma__StudentCourseClient<$Result.GetResult<Prisma.$StudentCoursePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StudentCourses.
     * @param {StudentCourseDeleteManyArgs} args - Arguments to filter StudentCourses to delete.
     * @example
     * // Delete a few StudentCourses
     * const { count } = await prisma.studentCourse.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudentCourseDeleteManyArgs>(args?: SelectSubset<T, StudentCourseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudentCourses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentCourseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StudentCourses
     * const studentCourse = await prisma.studentCourse.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudentCourseUpdateManyArgs>(args: SelectSubset<T, StudentCourseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudentCourses and returns the data updated in the database.
     * @param {StudentCourseUpdateManyAndReturnArgs} args - Arguments to update many StudentCourses.
     * @example
     * // Update many StudentCourses
     * const studentCourse = await prisma.studentCourse.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StudentCourses and only return the `id`
     * const studentCourseWithIdOnly = await prisma.studentCourse.updateManyAndReturn({
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
    updateManyAndReturn<T extends StudentCourseUpdateManyAndReturnArgs>(args: SelectSubset<T, StudentCourseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentCoursePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StudentCourse.
     * @param {StudentCourseUpsertArgs} args - Arguments to update or create a StudentCourse.
     * @example
     * // Update or create a StudentCourse
     * const studentCourse = await prisma.studentCourse.upsert({
     *   create: {
     *     // ... data to create a StudentCourse
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StudentCourse we want to update
     *   }
     * })
     */
    upsert<T extends StudentCourseUpsertArgs>(args: SelectSubset<T, StudentCourseUpsertArgs<ExtArgs>>): Prisma__StudentCourseClient<$Result.GetResult<Prisma.$StudentCoursePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StudentCourses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentCourseCountArgs} args - Arguments to filter StudentCourses to count.
     * @example
     * // Count the number of StudentCourses
     * const count = await prisma.studentCourse.count({
     *   where: {
     *     // ... the filter for the StudentCourses we want to count
     *   }
     * })
    **/
    count<T extends StudentCourseCountArgs>(
      args?: Subset<T, StudentCourseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudentCourseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StudentCourse.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentCourseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StudentCourseAggregateArgs>(args: Subset<T, StudentCourseAggregateArgs>): Prisma.PrismaPromise<GetStudentCourseAggregateType<T>>

    /**
     * Group by StudentCourse.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentCourseGroupByArgs} args - Group by arguments.
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
      T extends StudentCourseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudentCourseGroupByArgs['orderBy'] }
        : { orderBy?: StudentCourseGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, StudentCourseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentCourseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StudentCourse model
   */
  readonly fields: StudentCourseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StudentCourse.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudentCourseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    course<T extends CourseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CourseDefaultArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the StudentCourse model
   */
  interface StudentCourseFieldRefs {
    readonly id: FieldRef<"StudentCourse", 'String'>
    readonly studentId: FieldRef<"StudentCourse", 'String'>
    readonly courseId: FieldRef<"StudentCourse", 'String'>
    readonly completed: FieldRef<"StudentCourse", 'Boolean'>
    readonly progress: FieldRef<"StudentCourse", 'Int'>
    readonly enrolledAt: FieldRef<"StudentCourse", 'DateTime'>
    readonly updatedAt: FieldRef<"StudentCourse", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StudentCourse findUnique
   */
  export type StudentCourseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentCourse
     */
    select?: StudentCourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentCourse
     */
    omit?: StudentCourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentCourseInclude<ExtArgs> | null
    /**
     * Filter, which StudentCourse to fetch.
     */
    where: StudentCourseWhereUniqueInput
  }

  /**
   * StudentCourse findUniqueOrThrow
   */
  export type StudentCourseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentCourse
     */
    select?: StudentCourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentCourse
     */
    omit?: StudentCourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentCourseInclude<ExtArgs> | null
    /**
     * Filter, which StudentCourse to fetch.
     */
    where: StudentCourseWhereUniqueInput
  }

  /**
   * StudentCourse findFirst
   */
  export type StudentCourseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentCourse
     */
    select?: StudentCourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentCourse
     */
    omit?: StudentCourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentCourseInclude<ExtArgs> | null
    /**
     * Filter, which StudentCourse to fetch.
     */
    where?: StudentCourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentCourses to fetch.
     */
    orderBy?: StudentCourseOrderByWithRelationInput | StudentCourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentCourses.
     */
    cursor?: StudentCourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentCourses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentCourses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentCourses.
     */
    distinct?: StudentCourseScalarFieldEnum | StudentCourseScalarFieldEnum[]
  }

  /**
   * StudentCourse findFirstOrThrow
   */
  export type StudentCourseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentCourse
     */
    select?: StudentCourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentCourse
     */
    omit?: StudentCourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentCourseInclude<ExtArgs> | null
    /**
     * Filter, which StudentCourse to fetch.
     */
    where?: StudentCourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentCourses to fetch.
     */
    orderBy?: StudentCourseOrderByWithRelationInput | StudentCourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentCourses.
     */
    cursor?: StudentCourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentCourses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentCourses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentCourses.
     */
    distinct?: StudentCourseScalarFieldEnum | StudentCourseScalarFieldEnum[]
  }

  /**
   * StudentCourse findMany
   */
  export type StudentCourseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentCourse
     */
    select?: StudentCourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentCourse
     */
    omit?: StudentCourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentCourseInclude<ExtArgs> | null
    /**
     * Filter, which StudentCourses to fetch.
     */
    where?: StudentCourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentCourses to fetch.
     */
    orderBy?: StudentCourseOrderByWithRelationInput | StudentCourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StudentCourses.
     */
    cursor?: StudentCourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentCourses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentCourses.
     */
    skip?: number
    distinct?: StudentCourseScalarFieldEnum | StudentCourseScalarFieldEnum[]
  }

  /**
   * StudentCourse create
   */
  export type StudentCourseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentCourse
     */
    select?: StudentCourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentCourse
     */
    omit?: StudentCourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentCourseInclude<ExtArgs> | null
    /**
     * The data needed to create a StudentCourse.
     */
    data: XOR<StudentCourseCreateInput, StudentCourseUncheckedCreateInput>
  }

  /**
   * StudentCourse createMany
   */
  export type StudentCourseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StudentCourses.
     */
    data: StudentCourseCreateManyInput | StudentCourseCreateManyInput[]
  }

  /**
   * StudentCourse createManyAndReturn
   */
  export type StudentCourseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentCourse
     */
    select?: StudentCourseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StudentCourse
     */
    omit?: StudentCourseOmit<ExtArgs> | null
    /**
     * The data used to create many StudentCourses.
     */
    data: StudentCourseCreateManyInput | StudentCourseCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentCourseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StudentCourse update
   */
  export type StudentCourseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentCourse
     */
    select?: StudentCourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentCourse
     */
    omit?: StudentCourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentCourseInclude<ExtArgs> | null
    /**
     * The data needed to update a StudentCourse.
     */
    data: XOR<StudentCourseUpdateInput, StudentCourseUncheckedUpdateInput>
    /**
     * Choose, which StudentCourse to update.
     */
    where: StudentCourseWhereUniqueInput
  }

  /**
   * StudentCourse updateMany
   */
  export type StudentCourseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StudentCourses.
     */
    data: XOR<StudentCourseUpdateManyMutationInput, StudentCourseUncheckedUpdateManyInput>
    /**
     * Filter which StudentCourses to update
     */
    where?: StudentCourseWhereInput
    /**
     * Limit how many StudentCourses to update.
     */
    limit?: number
  }

  /**
   * StudentCourse updateManyAndReturn
   */
  export type StudentCourseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentCourse
     */
    select?: StudentCourseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StudentCourse
     */
    omit?: StudentCourseOmit<ExtArgs> | null
    /**
     * The data used to update StudentCourses.
     */
    data: XOR<StudentCourseUpdateManyMutationInput, StudentCourseUncheckedUpdateManyInput>
    /**
     * Filter which StudentCourses to update
     */
    where?: StudentCourseWhereInput
    /**
     * Limit how many StudentCourses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentCourseIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StudentCourse upsert
   */
  export type StudentCourseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentCourse
     */
    select?: StudentCourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentCourse
     */
    omit?: StudentCourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentCourseInclude<ExtArgs> | null
    /**
     * The filter to search for the StudentCourse to update in case it exists.
     */
    where: StudentCourseWhereUniqueInput
    /**
     * In case the StudentCourse found by the `where` argument doesn't exist, create a new StudentCourse with this data.
     */
    create: XOR<StudentCourseCreateInput, StudentCourseUncheckedCreateInput>
    /**
     * In case the StudentCourse was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudentCourseUpdateInput, StudentCourseUncheckedUpdateInput>
  }

  /**
   * StudentCourse delete
   */
  export type StudentCourseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentCourse
     */
    select?: StudentCourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentCourse
     */
    omit?: StudentCourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentCourseInclude<ExtArgs> | null
    /**
     * Filter which StudentCourse to delete.
     */
    where: StudentCourseWhereUniqueInput
  }

  /**
   * StudentCourse deleteMany
   */
  export type StudentCourseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentCourses to delete
     */
    where?: StudentCourseWhereInput
    /**
     * Limit how many StudentCourses to delete.
     */
    limit?: number
  }

  /**
   * StudentCourse without action
   */
  export type StudentCourseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentCourse
     */
    select?: StudentCourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentCourse
     */
    omit?: StudentCourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentCourseInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const StudentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    displayName: 'displayName',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StudentScalarFieldEnum = (typeof StudentScalarFieldEnum)[keyof typeof StudentScalarFieldEnum]


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


  export const StudentProgressScalarFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    courseId: 'courseId',
    moduleId: 'moduleId',
    lessonId: 'lessonId',
    completed: 'completed',
    score: 'score',
    progressPct: 'progressPct',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt'
  };

  export type StudentProgressScalarFieldEnum = (typeof StudentProgressScalarFieldEnum)[keyof typeof StudentProgressScalarFieldEnum]


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


  export const StudentCourseScalarFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    courseId: 'courseId',
    completed: 'completed',
    progress: 'progress',
    enrolledAt: 'enrolledAt',
    updatedAt: 'updatedAt'
  };

  export type StudentCourseScalarFieldEnum = (typeof StudentCourseScalarFieldEnum)[keyof typeof StudentCourseScalarFieldEnum]


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type StudentWhereInput = {
    AND?: StudentWhereInput | StudentWhereInput[]
    OR?: StudentWhereInput[]
    NOT?: StudentWhereInput | StudentWhereInput[]
    id?: StringFilter<"Student"> | string
    userId?: StringFilter<"Student"> | string
    displayName?: StringNullableFilter<"Student"> | string | null
    createdAt?: DateTimeFilter<"Student"> | Date | string
    updatedAt?: DateTimeFilter<"Student"> | Date | string
  }

  export type StudentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    displayName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: StudentWhereInput | StudentWhereInput[]
    OR?: StudentWhereInput[]
    NOT?: StudentWhereInput | StudentWhereInput[]
    displayName?: StringNullableFilter<"Student"> | string | null
    createdAt?: DateTimeFilter<"Student"> | Date | string
    updatedAt?: DateTimeFilter<"Student"> | Date | string
  }, "id" | "userId">

  export type StudentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    displayName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StudentCountOrderByAggregateInput
    _max?: StudentMaxOrderByAggregateInput
    _min?: StudentMinOrderByAggregateInput
  }

  export type StudentScalarWhereWithAggregatesInput = {
    AND?: StudentScalarWhereWithAggregatesInput | StudentScalarWhereWithAggregatesInput[]
    OR?: StudentScalarWhereWithAggregatesInput[]
    NOT?: StudentScalarWhereWithAggregatesInput | StudentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Student"> | string
    userId?: StringWithAggregatesFilter<"Student"> | string
    displayName?: StringNullableWithAggregatesFilter<"Student"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Student"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Student"> | Date | string
  }

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
    Course?: XOR<CourseScalarRelationFilter, CourseWhereInput>
  }

  export type StudentNoteOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    body?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    Course?: CourseOrderByWithRelationInput
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
    Course?: XOR<CourseScalarRelationFilter, CourseWhereInput>
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
    studentProgress?: StudentProgressListRelationFilter
    gradebookEntries?: GradebookEntryListRelationFilter
    studentNotes?: StudentNoteListRelationFilter
    StudentCourse?: StudentCourseListRelationFilter
  }

  export type CourseOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    progressPct?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    studentProgress?: StudentProgressOrderByRelationAggregateInput
    gradebookEntries?: GradebookEntryOrderByRelationAggregateInput
    studentNotes?: StudentNoteOrderByRelationAggregateInput
    StudentCourse?: StudentCourseOrderByRelationAggregateInput
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
    studentProgress?: StudentProgressListRelationFilter
    gradebookEntries?: GradebookEntryListRelationFilter
    studentNotes?: StudentNoteListRelationFilter
    StudentCourse?: StudentCourseListRelationFilter
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
    course?: XOR<CourseNullableScalarRelationFilter, CourseWhereInput> | null
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
    course?: CourseOrderByWithRelationInput
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
    course?: XOR<CourseNullableScalarRelationFilter, CourseWhereInput> | null
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

  export type StudentProgressWhereInput = {
    AND?: StudentProgressWhereInput | StudentProgressWhereInput[]
    OR?: StudentProgressWhereInput[]
    NOT?: StudentProgressWhereInput | StudentProgressWhereInput[]
    id?: StringFilter<"StudentProgress"> | string
    studentId?: StringFilter<"StudentProgress"> | string
    courseId?: StringFilter<"StudentProgress"> | string
    moduleId?: StringNullableFilter<"StudentProgress"> | string | null
    lessonId?: StringNullableFilter<"StudentProgress"> | string | null
    completed?: BoolFilter<"StudentProgress"> | boolean
    score?: FloatNullableFilter<"StudentProgress"> | number | null
    progressPct?: IntFilter<"StudentProgress"> | number
    updatedAt?: DateTimeFilter<"StudentProgress"> | Date | string
    createdAt?: DateTimeFilter<"StudentProgress"> | Date | string
    course?: XOR<CourseNullableScalarRelationFilter, CourseWhereInput> | null
  }

  export type StudentProgressOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    moduleId?: SortOrderInput | SortOrder
    lessonId?: SortOrderInput | SortOrder
    completed?: SortOrder
    score?: SortOrderInput | SortOrder
    progressPct?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    course?: CourseOrderByWithRelationInput
  }

  export type StudentProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StudentProgressWhereInput | StudentProgressWhereInput[]
    OR?: StudentProgressWhereInput[]
    NOT?: StudentProgressWhereInput | StudentProgressWhereInput[]
    studentId?: StringFilter<"StudentProgress"> | string
    courseId?: StringFilter<"StudentProgress"> | string
    moduleId?: StringNullableFilter<"StudentProgress"> | string | null
    lessonId?: StringNullableFilter<"StudentProgress"> | string | null
    completed?: BoolFilter<"StudentProgress"> | boolean
    score?: FloatNullableFilter<"StudentProgress"> | number | null
    progressPct?: IntFilter<"StudentProgress"> | number
    updatedAt?: DateTimeFilter<"StudentProgress"> | Date | string
    createdAt?: DateTimeFilter<"StudentProgress"> | Date | string
    course?: XOR<CourseNullableScalarRelationFilter, CourseWhereInput> | null
  }, "id">

  export type StudentProgressOrderByWithAggregationInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    moduleId?: SortOrderInput | SortOrder
    lessonId?: SortOrderInput | SortOrder
    completed?: SortOrder
    score?: SortOrderInput | SortOrder
    progressPct?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    _count?: StudentProgressCountOrderByAggregateInput
    _avg?: StudentProgressAvgOrderByAggregateInput
    _max?: StudentProgressMaxOrderByAggregateInput
    _min?: StudentProgressMinOrderByAggregateInput
    _sum?: StudentProgressSumOrderByAggregateInput
  }

  export type StudentProgressScalarWhereWithAggregatesInput = {
    AND?: StudentProgressScalarWhereWithAggregatesInput | StudentProgressScalarWhereWithAggregatesInput[]
    OR?: StudentProgressScalarWhereWithAggregatesInput[]
    NOT?: StudentProgressScalarWhereWithAggregatesInput | StudentProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StudentProgress"> | string
    studentId?: StringWithAggregatesFilter<"StudentProgress"> | string
    courseId?: StringWithAggregatesFilter<"StudentProgress"> | string
    moduleId?: StringNullableWithAggregatesFilter<"StudentProgress"> | string | null
    lessonId?: StringNullableWithAggregatesFilter<"StudentProgress"> | string | null
    completed?: BoolWithAggregatesFilter<"StudentProgress"> | boolean
    score?: FloatNullableWithAggregatesFilter<"StudentProgress"> | number | null
    progressPct?: IntWithAggregatesFilter<"StudentProgress"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"StudentProgress"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"StudentProgress"> | Date | string
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

  export type StudentCourseWhereInput = {
    AND?: StudentCourseWhereInput | StudentCourseWhereInput[]
    OR?: StudentCourseWhereInput[]
    NOT?: StudentCourseWhereInput | StudentCourseWhereInput[]
    id?: StringFilter<"StudentCourse"> | string
    studentId?: StringFilter<"StudentCourse"> | string
    courseId?: StringFilter<"StudentCourse"> | string
    completed?: BoolFilter<"StudentCourse"> | boolean
    progress?: IntFilter<"StudentCourse"> | number
    enrolledAt?: DateTimeFilter<"StudentCourse"> | Date | string
    updatedAt?: DateTimeFilter<"StudentCourse"> | Date | string
    course?: XOR<CourseScalarRelationFilter, CourseWhereInput>
  }

  export type StudentCourseOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    completed?: SortOrder
    progress?: SortOrder
    enrolledAt?: SortOrder
    updatedAt?: SortOrder
    course?: CourseOrderByWithRelationInput
  }

  export type StudentCourseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StudentCourseWhereInput | StudentCourseWhereInput[]
    OR?: StudentCourseWhereInput[]
    NOT?: StudentCourseWhereInput | StudentCourseWhereInput[]
    studentId?: StringFilter<"StudentCourse"> | string
    courseId?: StringFilter<"StudentCourse"> | string
    completed?: BoolFilter<"StudentCourse"> | boolean
    progress?: IntFilter<"StudentCourse"> | number
    enrolledAt?: DateTimeFilter<"StudentCourse"> | Date | string
    updatedAt?: DateTimeFilter<"StudentCourse"> | Date | string
    course?: XOR<CourseScalarRelationFilter, CourseWhereInput>
  }, "id">

  export type StudentCourseOrderByWithAggregationInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    completed?: SortOrder
    progress?: SortOrder
    enrolledAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StudentCourseCountOrderByAggregateInput
    _avg?: StudentCourseAvgOrderByAggregateInput
    _max?: StudentCourseMaxOrderByAggregateInput
    _min?: StudentCourseMinOrderByAggregateInput
    _sum?: StudentCourseSumOrderByAggregateInput
  }

  export type StudentCourseScalarWhereWithAggregatesInput = {
    AND?: StudentCourseScalarWhereWithAggregatesInput | StudentCourseScalarWhereWithAggregatesInput[]
    OR?: StudentCourseScalarWhereWithAggregatesInput[]
    NOT?: StudentCourseScalarWhereWithAggregatesInput | StudentCourseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StudentCourse"> | string
    studentId?: StringWithAggregatesFilter<"StudentCourse"> | string
    courseId?: StringWithAggregatesFilter<"StudentCourse"> | string
    completed?: BoolWithAggregatesFilter<"StudentCourse"> | boolean
    progress?: IntWithAggregatesFilter<"StudentCourse"> | number
    enrolledAt?: DateTimeWithAggregatesFilter<"StudentCourse"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"StudentCourse"> | Date | string
  }

  export type StudentCreateInput = {
    id?: string
    userId: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentUncheckedCreateInput = {
    id?: string
    userId: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentCreateManyInput = {
    id?: string
    userId: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentNoteCreateInput = {
    id?: string
    studentId: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
    Course: CourseCreateNestedOneWithoutStudentNotesInput
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
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Course?: CourseUpdateOneRequiredWithoutStudentNotesNestedInput
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
    studentProgress?: StudentProgressCreateNestedManyWithoutCourseInput
    gradebookEntries?: GradebookEntryCreateNestedManyWithoutCourseInput
    studentNotes?: StudentNoteCreateNestedManyWithoutCourseInput
    StudentCourse?: StudentCourseCreateNestedManyWithoutCourseInput
  }

  export type CourseUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProgress?: StudentProgressUncheckedCreateNestedManyWithoutCourseInput
    gradebookEntries?: GradebookEntryUncheckedCreateNestedManyWithoutCourseInput
    studentNotes?: StudentNoteUncheckedCreateNestedManyWithoutCourseInput
    StudentCourse?: StudentCourseUncheckedCreateNestedManyWithoutCourseInput
  }

  export type CourseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProgress?: StudentProgressUpdateManyWithoutCourseNestedInput
    gradebookEntries?: GradebookEntryUpdateManyWithoutCourseNestedInput
    studentNotes?: StudentNoteUpdateManyWithoutCourseNestedInput
    StudentCourse?: StudentCourseUpdateManyWithoutCourseNestedInput
  }

  export type CourseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProgress?: StudentProgressUncheckedUpdateManyWithoutCourseNestedInput
    gradebookEntries?: GradebookEntryUncheckedUpdateManyWithoutCourseNestedInput
    studentNotes?: StudentNoteUncheckedUpdateManyWithoutCourseNestedInput
    StudentCourse?: StudentCourseUncheckedUpdateManyWithoutCourseNestedInput
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
    grade?: number | null
    feedback?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    course?: CourseCreateNestedOneWithoutGradebookEntriesInput
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
    grade?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    course?: CourseUpdateOneWithoutGradebookEntriesNestedInput
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

  export type StudentProgressCreateInput = {
    id?: string
    studentId: string
    moduleId?: string | null
    lessonId?: string | null
    completed?: boolean
    score?: number | null
    progressPct?: number
    updatedAt?: Date | string
    createdAt?: Date | string
    course?: CourseCreateNestedOneWithoutStudentProgressInput
  }

  export type StudentProgressUncheckedCreateInput = {
    id?: string
    studentId: string
    courseId: string
    moduleId?: string | null
    lessonId?: string | null
    completed?: boolean
    score?: number | null
    progressPct?: number
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type StudentProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    moduleId?: NullableStringFieldUpdateOperationsInput | string | null
    lessonId?: NullableStringFieldUpdateOperationsInput | string | null
    completed?: BoolFieldUpdateOperationsInput | boolean
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    progressPct?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    course?: CourseUpdateOneWithoutStudentProgressNestedInput
  }

  export type StudentProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    moduleId?: NullableStringFieldUpdateOperationsInput | string | null
    lessonId?: NullableStringFieldUpdateOperationsInput | string | null
    completed?: BoolFieldUpdateOperationsInput | boolean
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    progressPct?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentProgressCreateManyInput = {
    id?: string
    studentId: string
    courseId: string
    moduleId?: string | null
    lessonId?: string | null
    completed?: boolean
    score?: number | null
    progressPct?: number
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type StudentProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    moduleId?: NullableStringFieldUpdateOperationsInput | string | null
    lessonId?: NullableStringFieldUpdateOperationsInput | string | null
    completed?: BoolFieldUpdateOperationsInput | boolean
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    progressPct?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    moduleId?: NullableStringFieldUpdateOperationsInput | string | null
    lessonId?: NullableStringFieldUpdateOperationsInput | string | null
    completed?: BoolFieldUpdateOperationsInput | boolean
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    progressPct?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type StudentCourseCreateInput = {
    id?: string
    studentId: string
    completed?: boolean
    progress?: number
    enrolledAt?: Date | string
    updatedAt?: Date | string
    course: CourseCreateNestedOneWithoutStudentCourseInput
  }

  export type StudentCourseUncheckedCreateInput = {
    id?: string
    studentId: string
    courseId: string
    completed?: boolean
    progress?: number
    enrolledAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentCourseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: IntFieldUpdateOperationsInput | number
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    course?: CourseUpdateOneRequiredWithoutStudentCourseNestedInput
  }

  export type StudentCourseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: IntFieldUpdateOperationsInput | number
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentCourseCreateManyInput = {
    id?: string
    studentId: string
    courseId: string
    completed?: boolean
    progress?: number
    enrolledAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentCourseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: IntFieldUpdateOperationsInput | number
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentCourseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: IntFieldUpdateOperationsInput | number
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type StudentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    displayName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    displayName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    displayName?: SortOrder
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

  export type CourseScalarRelationFilter = {
    is?: CourseWhereInput
    isNot?: CourseWhereInput
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

  export type StudentProgressListRelationFilter = {
    every?: StudentProgressWhereInput
    some?: StudentProgressWhereInput
    none?: StudentProgressWhereInput
  }

  export type GradebookEntryListRelationFilter = {
    every?: GradebookEntryWhereInput
    some?: GradebookEntryWhereInput
    none?: GradebookEntryWhereInput
  }

  export type StudentNoteListRelationFilter = {
    every?: StudentNoteWhereInput
    some?: StudentNoteWhereInput
    none?: StudentNoteWhereInput
  }

  export type StudentCourseListRelationFilter = {
    every?: StudentCourseWhereInput
    some?: StudentCourseWhereInput
    none?: StudentCourseWhereInput
  }

  export type StudentProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GradebookEntryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StudentNoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StudentCourseOrderByRelationAggregateInput = {
    _count?: SortOrder
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

  export type CourseNullableScalarRelationFilter = {
    is?: CourseWhereInput | null
    isNot?: CourseWhereInput | null
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StudentProgressCountOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    moduleId?: SortOrder
    lessonId?: SortOrder
    completed?: SortOrder
    score?: SortOrder
    progressPct?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type StudentProgressAvgOrderByAggregateInput = {
    score?: SortOrder
    progressPct?: SortOrder
  }

  export type StudentProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    moduleId?: SortOrder
    lessonId?: SortOrder
    completed?: SortOrder
    score?: SortOrder
    progressPct?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type StudentProgressMinOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    moduleId?: SortOrder
    lessonId?: SortOrder
    completed?: SortOrder
    score?: SortOrder
    progressPct?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type StudentProgressSumOrderByAggregateInput = {
    score?: SortOrder
    progressPct?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type StudentCourseCountOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    completed?: SortOrder
    progress?: SortOrder
    enrolledAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentCourseAvgOrderByAggregateInput = {
    progress?: SortOrder
  }

  export type StudentCourseMaxOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    completed?: SortOrder
    progress?: SortOrder
    enrolledAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentCourseMinOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    completed?: SortOrder
    progress?: SortOrder
    enrolledAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentCourseSumOrderByAggregateInput = {
    progress?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CourseCreateNestedOneWithoutStudentNotesInput = {
    create?: XOR<CourseCreateWithoutStudentNotesInput, CourseUncheckedCreateWithoutStudentNotesInput>
    connectOrCreate?: CourseCreateOrConnectWithoutStudentNotesInput
    connect?: CourseWhereUniqueInput
  }

  export type CourseUpdateOneRequiredWithoutStudentNotesNestedInput = {
    create?: XOR<CourseCreateWithoutStudentNotesInput, CourseUncheckedCreateWithoutStudentNotesInput>
    connectOrCreate?: CourseCreateOrConnectWithoutStudentNotesInput
    upsert?: CourseUpsertWithoutStudentNotesInput
    connect?: CourseWhereUniqueInput
    update?: XOR<XOR<CourseUpdateToOneWithWhereWithoutStudentNotesInput, CourseUpdateWithoutStudentNotesInput>, CourseUncheckedUpdateWithoutStudentNotesInput>
  }

  export type StudentProgressCreateNestedManyWithoutCourseInput = {
    create?: XOR<StudentProgressCreateWithoutCourseInput, StudentProgressUncheckedCreateWithoutCourseInput> | StudentProgressCreateWithoutCourseInput[] | StudentProgressUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: StudentProgressCreateOrConnectWithoutCourseInput | StudentProgressCreateOrConnectWithoutCourseInput[]
    createMany?: StudentProgressCreateManyCourseInputEnvelope
    connect?: StudentProgressWhereUniqueInput | StudentProgressWhereUniqueInput[]
  }

  export type GradebookEntryCreateNestedManyWithoutCourseInput = {
    create?: XOR<GradebookEntryCreateWithoutCourseInput, GradebookEntryUncheckedCreateWithoutCourseInput> | GradebookEntryCreateWithoutCourseInput[] | GradebookEntryUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: GradebookEntryCreateOrConnectWithoutCourseInput | GradebookEntryCreateOrConnectWithoutCourseInput[]
    createMany?: GradebookEntryCreateManyCourseInputEnvelope
    connect?: GradebookEntryWhereUniqueInput | GradebookEntryWhereUniqueInput[]
  }

  export type StudentNoteCreateNestedManyWithoutCourseInput = {
    create?: XOR<StudentNoteCreateWithoutCourseInput, StudentNoteUncheckedCreateWithoutCourseInput> | StudentNoteCreateWithoutCourseInput[] | StudentNoteUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: StudentNoteCreateOrConnectWithoutCourseInput | StudentNoteCreateOrConnectWithoutCourseInput[]
    createMany?: StudentNoteCreateManyCourseInputEnvelope
    connect?: StudentNoteWhereUniqueInput | StudentNoteWhereUniqueInput[]
  }

  export type StudentCourseCreateNestedManyWithoutCourseInput = {
    create?: XOR<StudentCourseCreateWithoutCourseInput, StudentCourseUncheckedCreateWithoutCourseInput> | StudentCourseCreateWithoutCourseInput[] | StudentCourseUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: StudentCourseCreateOrConnectWithoutCourseInput | StudentCourseCreateOrConnectWithoutCourseInput[]
    createMany?: StudentCourseCreateManyCourseInputEnvelope
    connect?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
  }

  export type StudentProgressUncheckedCreateNestedManyWithoutCourseInput = {
    create?: XOR<StudentProgressCreateWithoutCourseInput, StudentProgressUncheckedCreateWithoutCourseInput> | StudentProgressCreateWithoutCourseInput[] | StudentProgressUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: StudentProgressCreateOrConnectWithoutCourseInput | StudentProgressCreateOrConnectWithoutCourseInput[]
    createMany?: StudentProgressCreateManyCourseInputEnvelope
    connect?: StudentProgressWhereUniqueInput | StudentProgressWhereUniqueInput[]
  }

  export type GradebookEntryUncheckedCreateNestedManyWithoutCourseInput = {
    create?: XOR<GradebookEntryCreateWithoutCourseInput, GradebookEntryUncheckedCreateWithoutCourseInput> | GradebookEntryCreateWithoutCourseInput[] | GradebookEntryUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: GradebookEntryCreateOrConnectWithoutCourseInput | GradebookEntryCreateOrConnectWithoutCourseInput[]
    createMany?: GradebookEntryCreateManyCourseInputEnvelope
    connect?: GradebookEntryWhereUniqueInput | GradebookEntryWhereUniqueInput[]
  }

  export type StudentNoteUncheckedCreateNestedManyWithoutCourseInput = {
    create?: XOR<StudentNoteCreateWithoutCourseInput, StudentNoteUncheckedCreateWithoutCourseInput> | StudentNoteCreateWithoutCourseInput[] | StudentNoteUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: StudentNoteCreateOrConnectWithoutCourseInput | StudentNoteCreateOrConnectWithoutCourseInput[]
    createMany?: StudentNoteCreateManyCourseInputEnvelope
    connect?: StudentNoteWhereUniqueInput | StudentNoteWhereUniqueInput[]
  }

  export type StudentCourseUncheckedCreateNestedManyWithoutCourseInput = {
    create?: XOR<StudentCourseCreateWithoutCourseInput, StudentCourseUncheckedCreateWithoutCourseInput> | StudentCourseCreateWithoutCourseInput[] | StudentCourseUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: StudentCourseCreateOrConnectWithoutCourseInput | StudentCourseCreateOrConnectWithoutCourseInput[]
    createMany?: StudentCourseCreateManyCourseInputEnvelope
    connect?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StudentProgressUpdateManyWithoutCourseNestedInput = {
    create?: XOR<StudentProgressCreateWithoutCourseInput, StudentProgressUncheckedCreateWithoutCourseInput> | StudentProgressCreateWithoutCourseInput[] | StudentProgressUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: StudentProgressCreateOrConnectWithoutCourseInput | StudentProgressCreateOrConnectWithoutCourseInput[]
    upsert?: StudentProgressUpsertWithWhereUniqueWithoutCourseInput | StudentProgressUpsertWithWhereUniqueWithoutCourseInput[]
    createMany?: StudentProgressCreateManyCourseInputEnvelope
    set?: StudentProgressWhereUniqueInput | StudentProgressWhereUniqueInput[]
    disconnect?: StudentProgressWhereUniqueInput | StudentProgressWhereUniqueInput[]
    delete?: StudentProgressWhereUniqueInput | StudentProgressWhereUniqueInput[]
    connect?: StudentProgressWhereUniqueInput | StudentProgressWhereUniqueInput[]
    update?: StudentProgressUpdateWithWhereUniqueWithoutCourseInput | StudentProgressUpdateWithWhereUniqueWithoutCourseInput[]
    updateMany?: StudentProgressUpdateManyWithWhereWithoutCourseInput | StudentProgressUpdateManyWithWhereWithoutCourseInput[]
    deleteMany?: StudentProgressScalarWhereInput | StudentProgressScalarWhereInput[]
  }

  export type GradebookEntryUpdateManyWithoutCourseNestedInput = {
    create?: XOR<GradebookEntryCreateWithoutCourseInput, GradebookEntryUncheckedCreateWithoutCourseInput> | GradebookEntryCreateWithoutCourseInput[] | GradebookEntryUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: GradebookEntryCreateOrConnectWithoutCourseInput | GradebookEntryCreateOrConnectWithoutCourseInput[]
    upsert?: GradebookEntryUpsertWithWhereUniqueWithoutCourseInput | GradebookEntryUpsertWithWhereUniqueWithoutCourseInput[]
    createMany?: GradebookEntryCreateManyCourseInputEnvelope
    set?: GradebookEntryWhereUniqueInput | GradebookEntryWhereUniqueInput[]
    disconnect?: GradebookEntryWhereUniqueInput | GradebookEntryWhereUniqueInput[]
    delete?: GradebookEntryWhereUniqueInput | GradebookEntryWhereUniqueInput[]
    connect?: GradebookEntryWhereUniqueInput | GradebookEntryWhereUniqueInput[]
    update?: GradebookEntryUpdateWithWhereUniqueWithoutCourseInput | GradebookEntryUpdateWithWhereUniqueWithoutCourseInput[]
    updateMany?: GradebookEntryUpdateManyWithWhereWithoutCourseInput | GradebookEntryUpdateManyWithWhereWithoutCourseInput[]
    deleteMany?: GradebookEntryScalarWhereInput | GradebookEntryScalarWhereInput[]
  }

  export type StudentNoteUpdateManyWithoutCourseNestedInput = {
    create?: XOR<StudentNoteCreateWithoutCourseInput, StudentNoteUncheckedCreateWithoutCourseInput> | StudentNoteCreateWithoutCourseInput[] | StudentNoteUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: StudentNoteCreateOrConnectWithoutCourseInput | StudentNoteCreateOrConnectWithoutCourseInput[]
    upsert?: StudentNoteUpsertWithWhereUniqueWithoutCourseInput | StudentNoteUpsertWithWhereUniqueWithoutCourseInput[]
    createMany?: StudentNoteCreateManyCourseInputEnvelope
    set?: StudentNoteWhereUniqueInput | StudentNoteWhereUniqueInput[]
    disconnect?: StudentNoteWhereUniqueInput | StudentNoteWhereUniqueInput[]
    delete?: StudentNoteWhereUniqueInput | StudentNoteWhereUniqueInput[]
    connect?: StudentNoteWhereUniqueInput | StudentNoteWhereUniqueInput[]
    update?: StudentNoteUpdateWithWhereUniqueWithoutCourseInput | StudentNoteUpdateWithWhereUniqueWithoutCourseInput[]
    updateMany?: StudentNoteUpdateManyWithWhereWithoutCourseInput | StudentNoteUpdateManyWithWhereWithoutCourseInput[]
    deleteMany?: StudentNoteScalarWhereInput | StudentNoteScalarWhereInput[]
  }

  export type StudentCourseUpdateManyWithoutCourseNestedInput = {
    create?: XOR<StudentCourseCreateWithoutCourseInput, StudentCourseUncheckedCreateWithoutCourseInput> | StudentCourseCreateWithoutCourseInput[] | StudentCourseUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: StudentCourseCreateOrConnectWithoutCourseInput | StudentCourseCreateOrConnectWithoutCourseInput[]
    upsert?: StudentCourseUpsertWithWhereUniqueWithoutCourseInput | StudentCourseUpsertWithWhereUniqueWithoutCourseInput[]
    createMany?: StudentCourseCreateManyCourseInputEnvelope
    set?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
    disconnect?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
    delete?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
    connect?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
    update?: StudentCourseUpdateWithWhereUniqueWithoutCourseInput | StudentCourseUpdateWithWhereUniqueWithoutCourseInput[]
    updateMany?: StudentCourseUpdateManyWithWhereWithoutCourseInput | StudentCourseUpdateManyWithWhereWithoutCourseInput[]
    deleteMany?: StudentCourseScalarWhereInput | StudentCourseScalarWhereInput[]
  }

  export type StudentProgressUncheckedUpdateManyWithoutCourseNestedInput = {
    create?: XOR<StudentProgressCreateWithoutCourseInput, StudentProgressUncheckedCreateWithoutCourseInput> | StudentProgressCreateWithoutCourseInput[] | StudentProgressUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: StudentProgressCreateOrConnectWithoutCourseInput | StudentProgressCreateOrConnectWithoutCourseInput[]
    upsert?: StudentProgressUpsertWithWhereUniqueWithoutCourseInput | StudentProgressUpsertWithWhereUniqueWithoutCourseInput[]
    createMany?: StudentProgressCreateManyCourseInputEnvelope
    set?: StudentProgressWhereUniqueInput | StudentProgressWhereUniqueInput[]
    disconnect?: StudentProgressWhereUniqueInput | StudentProgressWhereUniqueInput[]
    delete?: StudentProgressWhereUniqueInput | StudentProgressWhereUniqueInput[]
    connect?: StudentProgressWhereUniqueInput | StudentProgressWhereUniqueInput[]
    update?: StudentProgressUpdateWithWhereUniqueWithoutCourseInput | StudentProgressUpdateWithWhereUniqueWithoutCourseInput[]
    updateMany?: StudentProgressUpdateManyWithWhereWithoutCourseInput | StudentProgressUpdateManyWithWhereWithoutCourseInput[]
    deleteMany?: StudentProgressScalarWhereInput | StudentProgressScalarWhereInput[]
  }

  export type GradebookEntryUncheckedUpdateManyWithoutCourseNestedInput = {
    create?: XOR<GradebookEntryCreateWithoutCourseInput, GradebookEntryUncheckedCreateWithoutCourseInput> | GradebookEntryCreateWithoutCourseInput[] | GradebookEntryUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: GradebookEntryCreateOrConnectWithoutCourseInput | GradebookEntryCreateOrConnectWithoutCourseInput[]
    upsert?: GradebookEntryUpsertWithWhereUniqueWithoutCourseInput | GradebookEntryUpsertWithWhereUniqueWithoutCourseInput[]
    createMany?: GradebookEntryCreateManyCourseInputEnvelope
    set?: GradebookEntryWhereUniqueInput | GradebookEntryWhereUniqueInput[]
    disconnect?: GradebookEntryWhereUniqueInput | GradebookEntryWhereUniqueInput[]
    delete?: GradebookEntryWhereUniqueInput | GradebookEntryWhereUniqueInput[]
    connect?: GradebookEntryWhereUniqueInput | GradebookEntryWhereUniqueInput[]
    update?: GradebookEntryUpdateWithWhereUniqueWithoutCourseInput | GradebookEntryUpdateWithWhereUniqueWithoutCourseInput[]
    updateMany?: GradebookEntryUpdateManyWithWhereWithoutCourseInput | GradebookEntryUpdateManyWithWhereWithoutCourseInput[]
    deleteMany?: GradebookEntryScalarWhereInput | GradebookEntryScalarWhereInput[]
  }

  export type StudentNoteUncheckedUpdateManyWithoutCourseNestedInput = {
    create?: XOR<StudentNoteCreateWithoutCourseInput, StudentNoteUncheckedCreateWithoutCourseInput> | StudentNoteCreateWithoutCourseInput[] | StudentNoteUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: StudentNoteCreateOrConnectWithoutCourseInput | StudentNoteCreateOrConnectWithoutCourseInput[]
    upsert?: StudentNoteUpsertWithWhereUniqueWithoutCourseInput | StudentNoteUpsertWithWhereUniqueWithoutCourseInput[]
    createMany?: StudentNoteCreateManyCourseInputEnvelope
    set?: StudentNoteWhereUniqueInput | StudentNoteWhereUniqueInput[]
    disconnect?: StudentNoteWhereUniqueInput | StudentNoteWhereUniqueInput[]
    delete?: StudentNoteWhereUniqueInput | StudentNoteWhereUniqueInput[]
    connect?: StudentNoteWhereUniqueInput | StudentNoteWhereUniqueInput[]
    update?: StudentNoteUpdateWithWhereUniqueWithoutCourseInput | StudentNoteUpdateWithWhereUniqueWithoutCourseInput[]
    updateMany?: StudentNoteUpdateManyWithWhereWithoutCourseInput | StudentNoteUpdateManyWithWhereWithoutCourseInput[]
    deleteMany?: StudentNoteScalarWhereInput | StudentNoteScalarWhereInput[]
  }

  export type StudentCourseUncheckedUpdateManyWithoutCourseNestedInput = {
    create?: XOR<StudentCourseCreateWithoutCourseInput, StudentCourseUncheckedCreateWithoutCourseInput> | StudentCourseCreateWithoutCourseInput[] | StudentCourseUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: StudentCourseCreateOrConnectWithoutCourseInput | StudentCourseCreateOrConnectWithoutCourseInput[]
    upsert?: StudentCourseUpsertWithWhereUniqueWithoutCourseInput | StudentCourseUpsertWithWhereUniqueWithoutCourseInput[]
    createMany?: StudentCourseCreateManyCourseInputEnvelope
    set?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
    disconnect?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
    delete?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
    connect?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
    update?: StudentCourseUpdateWithWhereUniqueWithoutCourseInput | StudentCourseUpdateWithWhereUniqueWithoutCourseInput[]
    updateMany?: StudentCourseUpdateManyWithWhereWithoutCourseInput | StudentCourseUpdateManyWithWhereWithoutCourseInput[]
    deleteMany?: StudentCourseScalarWhereInput | StudentCourseScalarWhereInput[]
  }

  export type CourseCreateNestedOneWithoutGradebookEntriesInput = {
    create?: XOR<CourseCreateWithoutGradebookEntriesInput, CourseUncheckedCreateWithoutGradebookEntriesInput>
    connectOrCreate?: CourseCreateOrConnectWithoutGradebookEntriesInput
    connect?: CourseWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CourseUpdateOneWithoutGradebookEntriesNestedInput = {
    create?: XOR<CourseCreateWithoutGradebookEntriesInput, CourseUncheckedCreateWithoutGradebookEntriesInput>
    connectOrCreate?: CourseCreateOrConnectWithoutGradebookEntriesInput
    upsert?: CourseUpsertWithoutGradebookEntriesInput
    disconnect?: CourseWhereInput | boolean
    delete?: CourseWhereInput | boolean
    connect?: CourseWhereUniqueInput
    update?: XOR<XOR<CourseUpdateToOneWithWhereWithoutGradebookEntriesInput, CourseUpdateWithoutGradebookEntriesInput>, CourseUncheckedUpdateWithoutGradebookEntriesInput>
  }

  export type CourseCreateNestedOneWithoutStudentProgressInput = {
    create?: XOR<CourseCreateWithoutStudentProgressInput, CourseUncheckedCreateWithoutStudentProgressInput>
    connectOrCreate?: CourseCreateOrConnectWithoutStudentProgressInput
    connect?: CourseWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type CourseUpdateOneWithoutStudentProgressNestedInput = {
    create?: XOR<CourseCreateWithoutStudentProgressInput, CourseUncheckedCreateWithoutStudentProgressInput>
    connectOrCreate?: CourseCreateOrConnectWithoutStudentProgressInput
    upsert?: CourseUpsertWithoutStudentProgressInput
    disconnect?: CourseWhereInput | boolean
    delete?: CourseWhereInput | boolean
    connect?: CourseWhereUniqueInput
    update?: XOR<XOR<CourseUpdateToOneWithWhereWithoutStudentProgressInput, CourseUpdateWithoutStudentProgressInput>, CourseUncheckedUpdateWithoutStudentProgressInput>
  }

  export type CourseCreateNestedOneWithoutStudentCourseInput = {
    create?: XOR<CourseCreateWithoutStudentCourseInput, CourseUncheckedCreateWithoutStudentCourseInput>
    connectOrCreate?: CourseCreateOrConnectWithoutStudentCourseInput
    connect?: CourseWhereUniqueInput
  }

  export type CourseUpdateOneRequiredWithoutStudentCourseNestedInput = {
    create?: XOR<CourseCreateWithoutStudentCourseInput, CourseUncheckedCreateWithoutStudentCourseInput>
    connectOrCreate?: CourseCreateOrConnectWithoutStudentCourseInput
    upsert?: CourseUpsertWithoutStudentCourseInput
    connect?: CourseWhereUniqueInput
    update?: XOR<XOR<CourseUpdateToOneWithWhereWithoutStudentCourseInput, CourseUpdateWithoutStudentCourseInput>, CourseUncheckedUpdateWithoutStudentCourseInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type CourseCreateWithoutStudentNotesInput = {
    id?: string
    title: string
    description?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProgress?: StudentProgressCreateNestedManyWithoutCourseInput
    gradebookEntries?: GradebookEntryCreateNestedManyWithoutCourseInput
    StudentCourse?: StudentCourseCreateNestedManyWithoutCourseInput
  }

  export type CourseUncheckedCreateWithoutStudentNotesInput = {
    id?: string
    title: string
    description?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProgress?: StudentProgressUncheckedCreateNestedManyWithoutCourseInput
    gradebookEntries?: GradebookEntryUncheckedCreateNestedManyWithoutCourseInput
    StudentCourse?: StudentCourseUncheckedCreateNestedManyWithoutCourseInput
  }

  export type CourseCreateOrConnectWithoutStudentNotesInput = {
    where: CourseWhereUniqueInput
    create: XOR<CourseCreateWithoutStudentNotesInput, CourseUncheckedCreateWithoutStudentNotesInput>
  }

  export type CourseUpsertWithoutStudentNotesInput = {
    update: XOR<CourseUpdateWithoutStudentNotesInput, CourseUncheckedUpdateWithoutStudentNotesInput>
    create: XOR<CourseCreateWithoutStudentNotesInput, CourseUncheckedCreateWithoutStudentNotesInput>
    where?: CourseWhereInput
  }

  export type CourseUpdateToOneWithWhereWithoutStudentNotesInput = {
    where?: CourseWhereInput
    data: XOR<CourseUpdateWithoutStudentNotesInput, CourseUncheckedUpdateWithoutStudentNotesInput>
  }

  export type CourseUpdateWithoutStudentNotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProgress?: StudentProgressUpdateManyWithoutCourseNestedInput
    gradebookEntries?: GradebookEntryUpdateManyWithoutCourseNestedInput
    StudentCourse?: StudentCourseUpdateManyWithoutCourseNestedInput
  }

  export type CourseUncheckedUpdateWithoutStudentNotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProgress?: StudentProgressUncheckedUpdateManyWithoutCourseNestedInput
    gradebookEntries?: GradebookEntryUncheckedUpdateManyWithoutCourseNestedInput
    StudentCourse?: StudentCourseUncheckedUpdateManyWithoutCourseNestedInput
  }

  export type StudentProgressCreateWithoutCourseInput = {
    id?: string
    studentId: string
    moduleId?: string | null
    lessonId?: string | null
    completed?: boolean
    score?: number | null
    progressPct?: number
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type StudentProgressUncheckedCreateWithoutCourseInput = {
    id?: string
    studentId: string
    moduleId?: string | null
    lessonId?: string | null
    completed?: boolean
    score?: number | null
    progressPct?: number
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type StudentProgressCreateOrConnectWithoutCourseInput = {
    where: StudentProgressWhereUniqueInput
    create: XOR<StudentProgressCreateWithoutCourseInput, StudentProgressUncheckedCreateWithoutCourseInput>
  }

  export type StudentProgressCreateManyCourseInputEnvelope = {
    data: StudentProgressCreateManyCourseInput | StudentProgressCreateManyCourseInput[]
  }

  export type GradebookEntryCreateWithoutCourseInput = {
    id?: string
    assignmentId: string
    studentId: string
    grade?: number | null
    feedback?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GradebookEntryUncheckedCreateWithoutCourseInput = {
    id?: string
    assignmentId: string
    studentId: string
    grade?: number | null
    feedback?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GradebookEntryCreateOrConnectWithoutCourseInput = {
    where: GradebookEntryWhereUniqueInput
    create: XOR<GradebookEntryCreateWithoutCourseInput, GradebookEntryUncheckedCreateWithoutCourseInput>
  }

  export type GradebookEntryCreateManyCourseInputEnvelope = {
    data: GradebookEntryCreateManyCourseInput | GradebookEntryCreateManyCourseInput[]
  }

  export type StudentNoteCreateWithoutCourseInput = {
    id?: string
    studentId: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentNoteUncheckedCreateWithoutCourseInput = {
    id?: string
    studentId: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentNoteCreateOrConnectWithoutCourseInput = {
    where: StudentNoteWhereUniqueInput
    create: XOR<StudentNoteCreateWithoutCourseInput, StudentNoteUncheckedCreateWithoutCourseInput>
  }

  export type StudentNoteCreateManyCourseInputEnvelope = {
    data: StudentNoteCreateManyCourseInput | StudentNoteCreateManyCourseInput[]
  }

  export type StudentCourseCreateWithoutCourseInput = {
    id?: string
    studentId: string
    completed?: boolean
    progress?: number
    enrolledAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentCourseUncheckedCreateWithoutCourseInput = {
    id?: string
    studentId: string
    completed?: boolean
    progress?: number
    enrolledAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentCourseCreateOrConnectWithoutCourseInput = {
    where: StudentCourseWhereUniqueInput
    create: XOR<StudentCourseCreateWithoutCourseInput, StudentCourseUncheckedCreateWithoutCourseInput>
  }

  export type StudentCourseCreateManyCourseInputEnvelope = {
    data: StudentCourseCreateManyCourseInput | StudentCourseCreateManyCourseInput[]
  }

  export type StudentProgressUpsertWithWhereUniqueWithoutCourseInput = {
    where: StudentProgressWhereUniqueInput
    update: XOR<StudentProgressUpdateWithoutCourseInput, StudentProgressUncheckedUpdateWithoutCourseInput>
    create: XOR<StudentProgressCreateWithoutCourseInput, StudentProgressUncheckedCreateWithoutCourseInput>
  }

  export type StudentProgressUpdateWithWhereUniqueWithoutCourseInput = {
    where: StudentProgressWhereUniqueInput
    data: XOR<StudentProgressUpdateWithoutCourseInput, StudentProgressUncheckedUpdateWithoutCourseInput>
  }

  export type StudentProgressUpdateManyWithWhereWithoutCourseInput = {
    where: StudentProgressScalarWhereInput
    data: XOR<StudentProgressUpdateManyMutationInput, StudentProgressUncheckedUpdateManyWithoutCourseInput>
  }

  export type StudentProgressScalarWhereInput = {
    AND?: StudentProgressScalarWhereInput | StudentProgressScalarWhereInput[]
    OR?: StudentProgressScalarWhereInput[]
    NOT?: StudentProgressScalarWhereInput | StudentProgressScalarWhereInput[]
    id?: StringFilter<"StudentProgress"> | string
    studentId?: StringFilter<"StudentProgress"> | string
    courseId?: StringFilter<"StudentProgress"> | string
    moduleId?: StringNullableFilter<"StudentProgress"> | string | null
    lessonId?: StringNullableFilter<"StudentProgress"> | string | null
    completed?: BoolFilter<"StudentProgress"> | boolean
    score?: FloatNullableFilter<"StudentProgress"> | number | null
    progressPct?: IntFilter<"StudentProgress"> | number
    updatedAt?: DateTimeFilter<"StudentProgress"> | Date | string
    createdAt?: DateTimeFilter<"StudentProgress"> | Date | string
  }

  export type GradebookEntryUpsertWithWhereUniqueWithoutCourseInput = {
    where: GradebookEntryWhereUniqueInput
    update: XOR<GradebookEntryUpdateWithoutCourseInput, GradebookEntryUncheckedUpdateWithoutCourseInput>
    create: XOR<GradebookEntryCreateWithoutCourseInput, GradebookEntryUncheckedCreateWithoutCourseInput>
  }

  export type GradebookEntryUpdateWithWhereUniqueWithoutCourseInput = {
    where: GradebookEntryWhereUniqueInput
    data: XOR<GradebookEntryUpdateWithoutCourseInput, GradebookEntryUncheckedUpdateWithoutCourseInput>
  }

  export type GradebookEntryUpdateManyWithWhereWithoutCourseInput = {
    where: GradebookEntryScalarWhereInput
    data: XOR<GradebookEntryUpdateManyMutationInput, GradebookEntryUncheckedUpdateManyWithoutCourseInput>
  }

  export type GradebookEntryScalarWhereInput = {
    AND?: GradebookEntryScalarWhereInput | GradebookEntryScalarWhereInput[]
    OR?: GradebookEntryScalarWhereInput[]
    NOT?: GradebookEntryScalarWhereInput | GradebookEntryScalarWhereInput[]
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

  export type StudentNoteUpsertWithWhereUniqueWithoutCourseInput = {
    where: StudentNoteWhereUniqueInput
    update: XOR<StudentNoteUpdateWithoutCourseInput, StudentNoteUncheckedUpdateWithoutCourseInput>
    create: XOR<StudentNoteCreateWithoutCourseInput, StudentNoteUncheckedCreateWithoutCourseInput>
  }

  export type StudentNoteUpdateWithWhereUniqueWithoutCourseInput = {
    where: StudentNoteWhereUniqueInput
    data: XOR<StudentNoteUpdateWithoutCourseInput, StudentNoteUncheckedUpdateWithoutCourseInput>
  }

  export type StudentNoteUpdateManyWithWhereWithoutCourseInput = {
    where: StudentNoteScalarWhereInput
    data: XOR<StudentNoteUpdateManyMutationInput, StudentNoteUncheckedUpdateManyWithoutCourseInput>
  }

  export type StudentNoteScalarWhereInput = {
    AND?: StudentNoteScalarWhereInput | StudentNoteScalarWhereInput[]
    OR?: StudentNoteScalarWhereInput[]
    NOT?: StudentNoteScalarWhereInput | StudentNoteScalarWhereInput[]
    id?: StringFilter<"StudentNote"> | string
    studentId?: StringFilter<"StudentNote"> | string
    courseId?: StringFilter<"StudentNote"> | string
    body?: StringFilter<"StudentNote"> | string
    createdAt?: DateTimeFilter<"StudentNote"> | Date | string
    updatedAt?: DateTimeFilter<"StudentNote"> | Date | string
  }

  export type StudentCourseUpsertWithWhereUniqueWithoutCourseInput = {
    where: StudentCourseWhereUniqueInput
    update: XOR<StudentCourseUpdateWithoutCourseInput, StudentCourseUncheckedUpdateWithoutCourseInput>
    create: XOR<StudentCourseCreateWithoutCourseInput, StudentCourseUncheckedCreateWithoutCourseInput>
  }

  export type StudentCourseUpdateWithWhereUniqueWithoutCourseInput = {
    where: StudentCourseWhereUniqueInput
    data: XOR<StudentCourseUpdateWithoutCourseInput, StudentCourseUncheckedUpdateWithoutCourseInput>
  }

  export type StudentCourseUpdateManyWithWhereWithoutCourseInput = {
    where: StudentCourseScalarWhereInput
    data: XOR<StudentCourseUpdateManyMutationInput, StudentCourseUncheckedUpdateManyWithoutCourseInput>
  }

  export type StudentCourseScalarWhereInput = {
    AND?: StudentCourseScalarWhereInput | StudentCourseScalarWhereInput[]
    OR?: StudentCourseScalarWhereInput[]
    NOT?: StudentCourseScalarWhereInput | StudentCourseScalarWhereInput[]
    id?: StringFilter<"StudentCourse"> | string
    studentId?: StringFilter<"StudentCourse"> | string
    courseId?: StringFilter<"StudentCourse"> | string
    completed?: BoolFilter<"StudentCourse"> | boolean
    progress?: IntFilter<"StudentCourse"> | number
    enrolledAt?: DateTimeFilter<"StudentCourse"> | Date | string
    updatedAt?: DateTimeFilter<"StudentCourse"> | Date | string
  }

  export type CourseCreateWithoutGradebookEntriesInput = {
    id?: string
    title: string
    description?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProgress?: StudentProgressCreateNestedManyWithoutCourseInput
    studentNotes?: StudentNoteCreateNestedManyWithoutCourseInput
    StudentCourse?: StudentCourseCreateNestedManyWithoutCourseInput
  }

  export type CourseUncheckedCreateWithoutGradebookEntriesInput = {
    id?: string
    title: string
    description?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProgress?: StudentProgressUncheckedCreateNestedManyWithoutCourseInput
    studentNotes?: StudentNoteUncheckedCreateNestedManyWithoutCourseInput
    StudentCourse?: StudentCourseUncheckedCreateNestedManyWithoutCourseInput
  }

  export type CourseCreateOrConnectWithoutGradebookEntriesInput = {
    where: CourseWhereUniqueInput
    create: XOR<CourseCreateWithoutGradebookEntriesInput, CourseUncheckedCreateWithoutGradebookEntriesInput>
  }

  export type CourseUpsertWithoutGradebookEntriesInput = {
    update: XOR<CourseUpdateWithoutGradebookEntriesInput, CourseUncheckedUpdateWithoutGradebookEntriesInput>
    create: XOR<CourseCreateWithoutGradebookEntriesInput, CourseUncheckedCreateWithoutGradebookEntriesInput>
    where?: CourseWhereInput
  }

  export type CourseUpdateToOneWithWhereWithoutGradebookEntriesInput = {
    where?: CourseWhereInput
    data: XOR<CourseUpdateWithoutGradebookEntriesInput, CourseUncheckedUpdateWithoutGradebookEntriesInput>
  }

  export type CourseUpdateWithoutGradebookEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProgress?: StudentProgressUpdateManyWithoutCourseNestedInput
    studentNotes?: StudentNoteUpdateManyWithoutCourseNestedInput
    StudentCourse?: StudentCourseUpdateManyWithoutCourseNestedInput
  }

  export type CourseUncheckedUpdateWithoutGradebookEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProgress?: StudentProgressUncheckedUpdateManyWithoutCourseNestedInput
    studentNotes?: StudentNoteUncheckedUpdateManyWithoutCourseNestedInput
    StudentCourse?: StudentCourseUncheckedUpdateManyWithoutCourseNestedInput
  }

  export type CourseCreateWithoutStudentProgressInput = {
    id?: string
    title: string
    description?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    gradebookEntries?: GradebookEntryCreateNestedManyWithoutCourseInput
    studentNotes?: StudentNoteCreateNestedManyWithoutCourseInput
    StudentCourse?: StudentCourseCreateNestedManyWithoutCourseInput
  }

  export type CourseUncheckedCreateWithoutStudentProgressInput = {
    id?: string
    title: string
    description?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    gradebookEntries?: GradebookEntryUncheckedCreateNestedManyWithoutCourseInput
    studentNotes?: StudentNoteUncheckedCreateNestedManyWithoutCourseInput
    StudentCourse?: StudentCourseUncheckedCreateNestedManyWithoutCourseInput
  }

  export type CourseCreateOrConnectWithoutStudentProgressInput = {
    where: CourseWhereUniqueInput
    create: XOR<CourseCreateWithoutStudentProgressInput, CourseUncheckedCreateWithoutStudentProgressInput>
  }

  export type CourseUpsertWithoutStudentProgressInput = {
    update: XOR<CourseUpdateWithoutStudentProgressInput, CourseUncheckedUpdateWithoutStudentProgressInput>
    create: XOR<CourseCreateWithoutStudentProgressInput, CourseUncheckedCreateWithoutStudentProgressInput>
    where?: CourseWhereInput
  }

  export type CourseUpdateToOneWithWhereWithoutStudentProgressInput = {
    where?: CourseWhereInput
    data: XOR<CourseUpdateWithoutStudentProgressInput, CourseUncheckedUpdateWithoutStudentProgressInput>
  }

  export type CourseUpdateWithoutStudentProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gradebookEntries?: GradebookEntryUpdateManyWithoutCourseNestedInput
    studentNotes?: StudentNoteUpdateManyWithoutCourseNestedInput
    StudentCourse?: StudentCourseUpdateManyWithoutCourseNestedInput
  }

  export type CourseUncheckedUpdateWithoutStudentProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gradebookEntries?: GradebookEntryUncheckedUpdateManyWithoutCourseNestedInput
    studentNotes?: StudentNoteUncheckedUpdateManyWithoutCourseNestedInput
    StudentCourse?: StudentCourseUncheckedUpdateManyWithoutCourseNestedInput
  }

  export type CourseCreateWithoutStudentCourseInput = {
    id?: string
    title: string
    description?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProgress?: StudentProgressCreateNestedManyWithoutCourseInput
    gradebookEntries?: GradebookEntryCreateNestedManyWithoutCourseInput
    studentNotes?: StudentNoteCreateNestedManyWithoutCourseInput
  }

  export type CourseUncheckedCreateWithoutStudentCourseInput = {
    id?: string
    title: string
    description?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProgress?: StudentProgressUncheckedCreateNestedManyWithoutCourseInput
    gradebookEntries?: GradebookEntryUncheckedCreateNestedManyWithoutCourseInput
    studentNotes?: StudentNoteUncheckedCreateNestedManyWithoutCourseInput
  }

  export type CourseCreateOrConnectWithoutStudentCourseInput = {
    where: CourseWhereUniqueInput
    create: XOR<CourseCreateWithoutStudentCourseInput, CourseUncheckedCreateWithoutStudentCourseInput>
  }

  export type CourseUpsertWithoutStudentCourseInput = {
    update: XOR<CourseUpdateWithoutStudentCourseInput, CourseUncheckedUpdateWithoutStudentCourseInput>
    create: XOR<CourseCreateWithoutStudentCourseInput, CourseUncheckedCreateWithoutStudentCourseInput>
    where?: CourseWhereInput
  }

  export type CourseUpdateToOneWithWhereWithoutStudentCourseInput = {
    where?: CourseWhereInput
    data: XOR<CourseUpdateWithoutStudentCourseInput, CourseUncheckedUpdateWithoutStudentCourseInput>
  }

  export type CourseUpdateWithoutStudentCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProgress?: StudentProgressUpdateManyWithoutCourseNestedInput
    gradebookEntries?: GradebookEntryUpdateManyWithoutCourseNestedInput
    studentNotes?: StudentNoteUpdateManyWithoutCourseNestedInput
  }

  export type CourseUncheckedUpdateWithoutStudentCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProgress?: StudentProgressUncheckedUpdateManyWithoutCourseNestedInput
    gradebookEntries?: GradebookEntryUncheckedUpdateManyWithoutCourseNestedInput
    studentNotes?: StudentNoteUncheckedUpdateManyWithoutCourseNestedInput
  }

  export type StudentProgressCreateManyCourseInput = {
    id?: string
    studentId: string
    moduleId?: string | null
    lessonId?: string | null
    completed?: boolean
    score?: number | null
    progressPct?: number
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type GradebookEntryCreateManyCourseInput = {
    id?: string
    assignmentId: string
    studentId: string
    grade?: number | null
    feedback?: string | null
    progressPct?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentNoteCreateManyCourseInput = {
    id?: string
    studentId: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentCourseCreateManyCourseInput = {
    id?: string
    studentId: string
    completed?: boolean
    progress?: number
    enrolledAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentProgressUpdateWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    moduleId?: NullableStringFieldUpdateOperationsInput | string | null
    lessonId?: NullableStringFieldUpdateOperationsInput | string | null
    completed?: BoolFieldUpdateOperationsInput | boolean
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    progressPct?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentProgressUncheckedUpdateWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    moduleId?: NullableStringFieldUpdateOperationsInput | string | null
    lessonId?: NullableStringFieldUpdateOperationsInput | string | null
    completed?: BoolFieldUpdateOperationsInput | boolean
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    progressPct?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentProgressUncheckedUpdateManyWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    moduleId?: NullableStringFieldUpdateOperationsInput | string | null
    lessonId?: NullableStringFieldUpdateOperationsInput | string | null
    completed?: BoolFieldUpdateOperationsInput | boolean
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    progressPct?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GradebookEntryUpdateWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    assignmentId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    grade?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GradebookEntryUncheckedUpdateWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    assignmentId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    grade?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GradebookEntryUncheckedUpdateManyWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    assignmentId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    grade?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    progressPct?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentNoteUpdateWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentNoteUncheckedUpdateWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentNoteUncheckedUpdateManyWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentCourseUpdateWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: IntFieldUpdateOperationsInput | number
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentCourseUncheckedUpdateWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: IntFieldUpdateOperationsInput | number
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentCourseUncheckedUpdateManyWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: IntFieldUpdateOperationsInput | number
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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