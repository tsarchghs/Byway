
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
 * Model StudentCourse
 * ---- Course enrollment ----
 */
export type StudentCourse = $Result.DefaultSelection<Prisma.$StudentCoursePayload>
/**
 * Model LessonProgress
 * ---- Lesson progress ----
 */
export type LessonProgress = $Result.DefaultSelection<Prisma.$LessonProgressPayload>
/**
 * Model StudentSubmission
 * ---- Lesson submissions ----
 */
export type StudentSubmission = $Result.DefaultSelection<Prisma.$StudentSubmissionPayload>
/**
 * Model LabInstance
 * ---- Labs (future) ----
 */
export type LabInstance = $Result.DefaultSelection<Prisma.$LabInstancePayload>
/**
 * Model QuizAttempt
 * ---- Quizzes (future) ----
 */
export type QuizAttempt = $Result.DefaultSelection<Prisma.$QuizAttemptPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const LessonStatus: {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
};

export type LessonStatus = (typeof LessonStatus)[keyof typeof LessonStatus]


export const SubmissionType: {
  ASSIGNMENT: 'ASSIGNMENT',
  LAB: 'LAB',
  FILE: 'FILE'
};

export type SubmissionType = (typeof SubmissionType)[keyof typeof SubmissionType]


export const LabState: {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  STOPPED: 'STOPPED'
};

export type LabState = (typeof LabState)[keyof typeof LabState]

}

export type LessonStatus = $Enums.LessonStatus

export const LessonStatus: typeof $Enums.LessonStatus

export type SubmissionType = $Enums.SubmissionType

export const SubmissionType: typeof $Enums.SubmissionType

export type LabState = $Enums.LabState

export const LabState: typeof $Enums.LabState

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
   * `prisma.studentCourse`: Exposes CRUD operations for the **StudentCourse** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StudentCourses
    * const studentCourses = await prisma.studentCourse.findMany()
    * ```
    */
  get studentCourse(): Prisma.StudentCourseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lessonProgress`: Exposes CRUD operations for the **LessonProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LessonProgresses
    * const lessonProgresses = await prisma.lessonProgress.findMany()
    * ```
    */
  get lessonProgress(): Prisma.LessonProgressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.studentSubmission`: Exposes CRUD operations for the **StudentSubmission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StudentSubmissions
    * const studentSubmissions = await prisma.studentSubmission.findMany()
    * ```
    */
  get studentSubmission(): Prisma.StudentSubmissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.labInstance`: Exposes CRUD operations for the **LabInstance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LabInstances
    * const labInstances = await prisma.labInstance.findMany()
    * ```
    */
  get labInstance(): Prisma.LabInstanceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.quizAttempt`: Exposes CRUD operations for the **QuizAttempt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QuizAttempts
    * const quizAttempts = await prisma.quizAttempt.findMany()
    * ```
    */
  get quizAttempt(): Prisma.QuizAttemptDelegate<ExtArgs, ClientOptions>;
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
    StudentCourse: 'StudentCourse',
    LessonProgress: 'LessonProgress',
    StudentSubmission: 'StudentSubmission',
    LabInstance: 'LabInstance',
    QuizAttempt: 'QuizAttempt'
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
      modelProps: "student" | "studentCourse" | "lessonProgress" | "studentSubmission" | "labInstance" | "quizAttempt"
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
      LessonProgress: {
        payload: Prisma.$LessonProgressPayload<ExtArgs>
        fields: Prisma.LessonProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LessonProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LessonProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload>
          }
          findFirst: {
            args: Prisma.LessonProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LessonProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload>
          }
          findMany: {
            args: Prisma.LessonProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload>[]
          }
          create: {
            args: Prisma.LessonProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload>
          }
          createMany: {
            args: Prisma.LessonProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LessonProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload>
          }
          update: {
            args: Prisma.LessonProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload>
          }
          deleteMany: {
            args: Prisma.LessonProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LessonProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LessonProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonProgressPayload>
          }
          aggregate: {
            args: Prisma.LessonProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLessonProgress>
          }
          groupBy: {
            args: Prisma.LessonProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<LessonProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.LessonProgressCountArgs<ExtArgs>
            result: $Utils.Optional<LessonProgressCountAggregateOutputType> | number
          }
        }
      }
      StudentSubmission: {
        payload: Prisma.$StudentSubmissionPayload<ExtArgs>
        fields: Prisma.StudentSubmissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudentSubmissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubmissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudentSubmissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubmissionPayload>
          }
          findFirst: {
            args: Prisma.StudentSubmissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubmissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudentSubmissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubmissionPayload>
          }
          findMany: {
            args: Prisma.StudentSubmissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubmissionPayload>[]
          }
          create: {
            args: Prisma.StudentSubmissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubmissionPayload>
          }
          createMany: {
            args: Prisma.StudentSubmissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.StudentSubmissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubmissionPayload>
          }
          update: {
            args: Prisma.StudentSubmissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubmissionPayload>
          }
          deleteMany: {
            args: Prisma.StudentSubmissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudentSubmissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StudentSubmissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubmissionPayload>
          }
          aggregate: {
            args: Prisma.StudentSubmissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudentSubmission>
          }
          groupBy: {
            args: Prisma.StudentSubmissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudentSubmissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudentSubmissionCountArgs<ExtArgs>
            result: $Utils.Optional<StudentSubmissionCountAggregateOutputType> | number
          }
        }
      }
      LabInstance: {
        payload: Prisma.$LabInstancePayload<ExtArgs>
        fields: Prisma.LabInstanceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LabInstanceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabInstancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LabInstanceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabInstancePayload>
          }
          findFirst: {
            args: Prisma.LabInstanceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabInstancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LabInstanceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabInstancePayload>
          }
          findMany: {
            args: Prisma.LabInstanceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabInstancePayload>[]
          }
          create: {
            args: Prisma.LabInstanceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabInstancePayload>
          }
          createMany: {
            args: Prisma.LabInstanceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LabInstanceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabInstancePayload>
          }
          update: {
            args: Prisma.LabInstanceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabInstancePayload>
          }
          deleteMany: {
            args: Prisma.LabInstanceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LabInstanceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LabInstanceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LabInstancePayload>
          }
          aggregate: {
            args: Prisma.LabInstanceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLabInstance>
          }
          groupBy: {
            args: Prisma.LabInstanceGroupByArgs<ExtArgs>
            result: $Utils.Optional<LabInstanceGroupByOutputType>[]
          }
          count: {
            args: Prisma.LabInstanceCountArgs<ExtArgs>
            result: $Utils.Optional<LabInstanceCountAggregateOutputType> | number
          }
        }
      }
      QuizAttempt: {
        payload: Prisma.$QuizAttemptPayload<ExtArgs>
        fields: Prisma.QuizAttemptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuizAttemptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuizAttemptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload>
          }
          findFirst: {
            args: Prisma.QuizAttemptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuizAttemptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload>
          }
          findMany: {
            args: Prisma.QuizAttemptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload>[]
          }
          create: {
            args: Prisma.QuizAttemptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload>
          }
          createMany: {
            args: Prisma.QuizAttemptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.QuizAttemptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload>
          }
          update: {
            args: Prisma.QuizAttemptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload>
          }
          deleteMany: {
            args: Prisma.QuizAttemptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuizAttemptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.QuizAttemptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizAttemptPayload>
          }
          aggregate: {
            args: Prisma.QuizAttemptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuizAttempt>
          }
          groupBy: {
            args: Prisma.QuizAttemptGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuizAttemptGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuizAttemptCountArgs<ExtArgs>
            result: $Utils.Optional<QuizAttemptCountAggregateOutputType> | number
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
    studentCourse?: StudentCourseOmit
    lessonProgress?: LessonProgressOmit
    studentSubmission?: StudentSubmissionOmit
    labInstance?: LabInstanceOmit
    quizAttempt?: QuizAttemptOmit
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
   * Count Type StudentCountOutputType
   */

  export type StudentCountOutputType = {
    courses: number
    lessonProgress: number
    submissions: number
    labs: number
    quizzes: number
  }

  export type StudentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courses?: boolean | StudentCountOutputTypeCountCoursesArgs
    lessonProgress?: boolean | StudentCountOutputTypeCountLessonProgressArgs
    submissions?: boolean | StudentCountOutputTypeCountSubmissionsArgs
    labs?: boolean | StudentCountOutputTypeCountLabsArgs
    quizzes?: boolean | StudentCountOutputTypeCountQuizzesArgs
  }

  // Custom InputTypes
  /**
   * StudentCountOutputType without action
   */
  export type StudentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentCountOutputType
     */
    select?: StudentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StudentCountOutputType without action
   */
  export type StudentCountOutputTypeCountCoursesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentCourseWhereInput
  }

  /**
   * StudentCountOutputType without action
   */
  export type StudentCountOutputTypeCountLessonProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LessonProgressWhereInput
  }

  /**
   * StudentCountOutputType without action
   */
  export type StudentCountOutputTypeCountSubmissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentSubmissionWhereInput
  }

  /**
   * StudentCountOutputType without action
   */
  export type StudentCountOutputTypeCountLabsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LabInstanceWhereInput
  }

  /**
   * StudentCountOutputType without action
   */
  export type StudentCountOutputTypeCountQuizzesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizAttemptWhereInput
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
    userId: string | null
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
    courses?: boolean | Student$coursesArgs<ExtArgs>
    lessonProgress?: boolean | Student$lessonProgressArgs<ExtArgs>
    submissions?: boolean | Student$submissionsArgs<ExtArgs>
    labs?: boolean | Student$labsArgs<ExtArgs>
    quizzes?: boolean | Student$quizzesArgs<ExtArgs>
    _count?: boolean | StudentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["student"]>



  export type StudentSelectScalar = {
    id?: boolean
    userId?: boolean
    displayName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StudentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "displayName" | "createdAt" | "updatedAt", ExtArgs["result"]["student"]>
  export type StudentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courses?: boolean | Student$coursesArgs<ExtArgs>
    lessonProgress?: boolean | Student$lessonProgressArgs<ExtArgs>
    submissions?: boolean | Student$submissionsArgs<ExtArgs>
    labs?: boolean | Student$labsArgs<ExtArgs>
    quizzes?: boolean | Student$quizzesArgs<ExtArgs>
    _count?: boolean | StudentCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $StudentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Student"
    objects: {
      courses: Prisma.$StudentCoursePayload<ExtArgs>[]
      lessonProgress: Prisma.$LessonProgressPayload<ExtArgs>[]
      submissions: Prisma.$StudentSubmissionPayload<ExtArgs>[]
      labs: Prisma.$LabInstancePayload<ExtArgs>[]
      quizzes: Prisma.$QuizAttemptPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
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
    courses<T extends Student$coursesArgs<ExtArgs> = {}>(args?: Subset<T, Student$coursesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentCoursePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    lessonProgress<T extends Student$lessonProgressArgs<ExtArgs> = {}>(args?: Subset<T, Student$lessonProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    submissions<T extends Student$submissionsArgs<ExtArgs> = {}>(args?: Subset<T, Student$submissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    labs<T extends Student$labsArgs<ExtArgs> = {}>(args?: Subset<T, Student$labsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabInstancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    quizzes<T extends Student$quizzesArgs<ExtArgs> = {}>(args?: Subset<T, Student$quizzesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
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
    skipDuplicates?: boolean
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
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
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
   * Student.courses
   */
  export type Student$coursesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Student.lessonProgress
   */
  export type Student$lessonProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    where?: LessonProgressWhereInput
    orderBy?: LessonProgressOrderByWithRelationInput | LessonProgressOrderByWithRelationInput[]
    cursor?: LessonProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LessonProgressScalarFieldEnum | LessonProgressScalarFieldEnum[]
  }

  /**
   * Student.submissions
   */
  export type Student$submissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubmission
     */
    select?: StudentSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentSubmission
     */
    omit?: StudentSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubmissionInclude<ExtArgs> | null
    where?: StudentSubmissionWhereInput
    orderBy?: StudentSubmissionOrderByWithRelationInput | StudentSubmissionOrderByWithRelationInput[]
    cursor?: StudentSubmissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentSubmissionScalarFieldEnum | StudentSubmissionScalarFieldEnum[]
  }

  /**
   * Student.labs
   */
  export type Student$labsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabInstance
     */
    select?: LabInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabInstance
     */
    omit?: LabInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabInstanceInclude<ExtArgs> | null
    where?: LabInstanceWhereInput
    orderBy?: LabInstanceOrderByWithRelationInput | LabInstanceOrderByWithRelationInput[]
    cursor?: LabInstanceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LabInstanceScalarFieldEnum | LabInstanceScalarFieldEnum[]
  }

  /**
   * Student.quizzes
   */
  export type Student$quizzesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    where?: QuizAttemptWhereInput
    orderBy?: QuizAttemptOrderByWithRelationInput | QuizAttemptOrderByWithRelationInput[]
    cursor?: QuizAttemptWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuizAttemptScalarFieldEnum | QuizAttemptScalarFieldEnum[]
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
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
  }

  export type StudentCourseMaxAggregateOutputType = {
    id: string | null
    studentId: string | null
    courseId: string | null
    completed: boolean | null
    progress: number | null
    enrolledAt: Date | null
  }

  export type StudentCourseCountAggregateOutputType = {
    id: number
    studentId: number
    courseId: number
    completed: number
    progress: number
    enrolledAt: number
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
  }

  export type StudentCourseMaxAggregateInputType = {
    id?: true
    studentId?: true
    courseId?: true
    completed?: true
    progress?: true
    enrolledAt?: true
  }

  export type StudentCourseCountAggregateInputType = {
    id?: true
    studentId?: true
    courseId?: true
    completed?: true
    progress?: true
    enrolledAt?: true
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
    progress: number | null
    enrolledAt: Date
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
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentCourse"]>



  export type StudentCourseSelectScalar = {
    id?: boolean
    studentId?: boolean
    courseId?: boolean
    completed?: boolean
    progress?: boolean
    enrolledAt?: boolean
  }

  export type StudentCourseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "studentId" | "courseId" | "completed" | "progress" | "enrolledAt", ExtArgs["result"]["studentCourse"]>
  export type StudentCourseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }

  export type $StudentCoursePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StudentCourse"
    objects: {
      student: Prisma.$StudentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studentId: string
      courseId: string
      completed: boolean
      progress: number | null
      enrolledAt: Date
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
    student<T extends StudentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentDefaultArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
    skipDuplicates?: boolean
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
   * Model LessonProgress
   */

  export type AggregateLessonProgress = {
    _count: LessonProgressCountAggregateOutputType | null
    _avg: LessonProgressAvgAggregateOutputType | null
    _sum: LessonProgressSumAggregateOutputType | null
    _min: LessonProgressMinAggregateOutputType | null
    _max: LessonProgressMaxAggregateOutputType | null
  }

  export type LessonProgressAvgAggregateOutputType = {
    score: number | null
  }

  export type LessonProgressSumAggregateOutputType = {
    score: number | null
  }

  export type LessonProgressMinAggregateOutputType = {
    id: string | null
    studentId: string | null
    lessonId: string | null
    status: $Enums.LessonStatus | null
    score: number | null
    startedAt: Date | null
    updatedAt: Date | null
    completedAt: Date | null
  }

  export type LessonProgressMaxAggregateOutputType = {
    id: string | null
    studentId: string | null
    lessonId: string | null
    status: $Enums.LessonStatus | null
    score: number | null
    startedAt: Date | null
    updatedAt: Date | null
    completedAt: Date | null
  }

  export type LessonProgressCountAggregateOutputType = {
    id: number
    studentId: number
    lessonId: number
    status: number
    score: number
    startedAt: number
    updatedAt: number
    completedAt: number
    _all: number
  }


  export type LessonProgressAvgAggregateInputType = {
    score?: true
  }

  export type LessonProgressSumAggregateInputType = {
    score?: true
  }

  export type LessonProgressMinAggregateInputType = {
    id?: true
    studentId?: true
    lessonId?: true
    status?: true
    score?: true
    startedAt?: true
    updatedAt?: true
    completedAt?: true
  }

  export type LessonProgressMaxAggregateInputType = {
    id?: true
    studentId?: true
    lessonId?: true
    status?: true
    score?: true
    startedAt?: true
    updatedAt?: true
    completedAt?: true
  }

  export type LessonProgressCountAggregateInputType = {
    id?: true
    studentId?: true
    lessonId?: true
    status?: true
    score?: true
    startedAt?: true
    updatedAt?: true
    completedAt?: true
    _all?: true
  }

  export type LessonProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LessonProgress to aggregate.
     */
    where?: LessonProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LessonProgresses to fetch.
     */
    orderBy?: LessonProgressOrderByWithRelationInput | LessonProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LessonProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LessonProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LessonProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LessonProgresses
    **/
    _count?: true | LessonProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LessonProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LessonProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LessonProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LessonProgressMaxAggregateInputType
  }

  export type GetLessonProgressAggregateType<T extends LessonProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateLessonProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLessonProgress[P]>
      : GetScalarType<T[P], AggregateLessonProgress[P]>
  }




  export type LessonProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LessonProgressWhereInput
    orderBy?: LessonProgressOrderByWithAggregationInput | LessonProgressOrderByWithAggregationInput[]
    by: LessonProgressScalarFieldEnum[] | LessonProgressScalarFieldEnum
    having?: LessonProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LessonProgressCountAggregateInputType | true
    _avg?: LessonProgressAvgAggregateInputType
    _sum?: LessonProgressSumAggregateInputType
    _min?: LessonProgressMinAggregateInputType
    _max?: LessonProgressMaxAggregateInputType
  }

  export type LessonProgressGroupByOutputType = {
    id: string
    studentId: string
    lessonId: string
    status: $Enums.LessonStatus
    score: number | null
    startedAt: Date | null
    updatedAt: Date | null
    completedAt: Date | null
    _count: LessonProgressCountAggregateOutputType | null
    _avg: LessonProgressAvgAggregateOutputType | null
    _sum: LessonProgressSumAggregateOutputType | null
    _min: LessonProgressMinAggregateOutputType | null
    _max: LessonProgressMaxAggregateOutputType | null
  }

  type GetLessonProgressGroupByPayload<T extends LessonProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LessonProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LessonProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LessonProgressGroupByOutputType[P]>
            : GetScalarType<T[P], LessonProgressGroupByOutputType[P]>
        }
      >
    >


  export type LessonProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    lessonId?: boolean
    status?: boolean
    score?: boolean
    startedAt?: boolean
    updatedAt?: boolean
    completedAt?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lessonProgress"]>



  export type LessonProgressSelectScalar = {
    id?: boolean
    studentId?: boolean
    lessonId?: boolean
    status?: boolean
    score?: boolean
    startedAt?: boolean
    updatedAt?: boolean
    completedAt?: boolean
  }

  export type LessonProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "studentId" | "lessonId" | "status" | "score" | "startedAt" | "updatedAt" | "completedAt", ExtArgs["result"]["lessonProgress"]>
  export type LessonProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }

  export type $LessonProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LessonProgress"
    objects: {
      student: Prisma.$StudentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studentId: string
      lessonId: string
      status: $Enums.LessonStatus
      score: number | null
      startedAt: Date | null
      updatedAt: Date | null
      completedAt: Date | null
    }, ExtArgs["result"]["lessonProgress"]>
    composites: {}
  }

  type LessonProgressGetPayload<S extends boolean | null | undefined | LessonProgressDefaultArgs> = $Result.GetResult<Prisma.$LessonProgressPayload, S>

  type LessonProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LessonProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LessonProgressCountAggregateInputType | true
    }

  export interface LessonProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LessonProgress'], meta: { name: 'LessonProgress' } }
    /**
     * Find zero or one LessonProgress that matches the filter.
     * @param {LessonProgressFindUniqueArgs} args - Arguments to find a LessonProgress
     * @example
     * // Get one LessonProgress
     * const lessonProgress = await prisma.lessonProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LessonProgressFindUniqueArgs>(args: SelectSubset<T, LessonProgressFindUniqueArgs<ExtArgs>>): Prisma__LessonProgressClient<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LessonProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LessonProgressFindUniqueOrThrowArgs} args - Arguments to find a LessonProgress
     * @example
     * // Get one LessonProgress
     * const lessonProgress = await prisma.lessonProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LessonProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, LessonProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LessonProgressClient<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LessonProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonProgressFindFirstArgs} args - Arguments to find a LessonProgress
     * @example
     * // Get one LessonProgress
     * const lessonProgress = await prisma.lessonProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LessonProgressFindFirstArgs>(args?: SelectSubset<T, LessonProgressFindFirstArgs<ExtArgs>>): Prisma__LessonProgressClient<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LessonProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonProgressFindFirstOrThrowArgs} args - Arguments to find a LessonProgress
     * @example
     * // Get one LessonProgress
     * const lessonProgress = await prisma.lessonProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LessonProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, LessonProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__LessonProgressClient<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LessonProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LessonProgresses
     * const lessonProgresses = await prisma.lessonProgress.findMany()
     * 
     * // Get first 10 LessonProgresses
     * const lessonProgresses = await prisma.lessonProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lessonProgressWithIdOnly = await prisma.lessonProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LessonProgressFindManyArgs>(args?: SelectSubset<T, LessonProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LessonProgress.
     * @param {LessonProgressCreateArgs} args - Arguments to create a LessonProgress.
     * @example
     * // Create one LessonProgress
     * const LessonProgress = await prisma.lessonProgress.create({
     *   data: {
     *     // ... data to create a LessonProgress
     *   }
     * })
     * 
     */
    create<T extends LessonProgressCreateArgs>(args: SelectSubset<T, LessonProgressCreateArgs<ExtArgs>>): Prisma__LessonProgressClient<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LessonProgresses.
     * @param {LessonProgressCreateManyArgs} args - Arguments to create many LessonProgresses.
     * @example
     * // Create many LessonProgresses
     * const lessonProgress = await prisma.lessonProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LessonProgressCreateManyArgs>(args?: SelectSubset<T, LessonProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a LessonProgress.
     * @param {LessonProgressDeleteArgs} args - Arguments to delete one LessonProgress.
     * @example
     * // Delete one LessonProgress
     * const LessonProgress = await prisma.lessonProgress.delete({
     *   where: {
     *     // ... filter to delete one LessonProgress
     *   }
     * })
     * 
     */
    delete<T extends LessonProgressDeleteArgs>(args: SelectSubset<T, LessonProgressDeleteArgs<ExtArgs>>): Prisma__LessonProgressClient<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LessonProgress.
     * @param {LessonProgressUpdateArgs} args - Arguments to update one LessonProgress.
     * @example
     * // Update one LessonProgress
     * const lessonProgress = await prisma.lessonProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LessonProgressUpdateArgs>(args: SelectSubset<T, LessonProgressUpdateArgs<ExtArgs>>): Prisma__LessonProgressClient<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LessonProgresses.
     * @param {LessonProgressDeleteManyArgs} args - Arguments to filter LessonProgresses to delete.
     * @example
     * // Delete a few LessonProgresses
     * const { count } = await prisma.lessonProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LessonProgressDeleteManyArgs>(args?: SelectSubset<T, LessonProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LessonProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LessonProgresses
     * const lessonProgress = await prisma.lessonProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LessonProgressUpdateManyArgs>(args: SelectSubset<T, LessonProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LessonProgress.
     * @param {LessonProgressUpsertArgs} args - Arguments to update or create a LessonProgress.
     * @example
     * // Update or create a LessonProgress
     * const lessonProgress = await prisma.lessonProgress.upsert({
     *   create: {
     *     // ... data to create a LessonProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LessonProgress we want to update
     *   }
     * })
     */
    upsert<T extends LessonProgressUpsertArgs>(args: SelectSubset<T, LessonProgressUpsertArgs<ExtArgs>>): Prisma__LessonProgressClient<$Result.GetResult<Prisma.$LessonProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LessonProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonProgressCountArgs} args - Arguments to filter LessonProgresses to count.
     * @example
     * // Count the number of LessonProgresses
     * const count = await prisma.lessonProgress.count({
     *   where: {
     *     // ... the filter for the LessonProgresses we want to count
     *   }
     * })
    **/
    count<T extends LessonProgressCountArgs>(
      args?: Subset<T, LessonProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LessonProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LessonProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LessonProgressAggregateArgs>(args: Subset<T, LessonProgressAggregateArgs>): Prisma.PrismaPromise<GetLessonProgressAggregateType<T>>

    /**
     * Group by LessonProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonProgressGroupByArgs} args - Group by arguments.
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
      T extends LessonProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LessonProgressGroupByArgs['orderBy'] }
        : { orderBy?: LessonProgressGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LessonProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLessonProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LessonProgress model
   */
  readonly fields: LessonProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LessonProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LessonProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends StudentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentDefaultArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the LessonProgress model
   */
  interface LessonProgressFieldRefs {
    readonly id: FieldRef<"LessonProgress", 'String'>
    readonly studentId: FieldRef<"LessonProgress", 'String'>
    readonly lessonId: FieldRef<"LessonProgress", 'String'>
    readonly status: FieldRef<"LessonProgress", 'LessonStatus'>
    readonly score: FieldRef<"LessonProgress", 'Float'>
    readonly startedAt: FieldRef<"LessonProgress", 'DateTime'>
    readonly updatedAt: FieldRef<"LessonProgress", 'DateTime'>
    readonly completedAt: FieldRef<"LessonProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LessonProgress findUnique
   */
  export type LessonProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    /**
     * Filter, which LessonProgress to fetch.
     */
    where: LessonProgressWhereUniqueInput
  }

  /**
   * LessonProgress findUniqueOrThrow
   */
  export type LessonProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    /**
     * Filter, which LessonProgress to fetch.
     */
    where: LessonProgressWhereUniqueInput
  }

  /**
   * LessonProgress findFirst
   */
  export type LessonProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    /**
     * Filter, which LessonProgress to fetch.
     */
    where?: LessonProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LessonProgresses to fetch.
     */
    orderBy?: LessonProgressOrderByWithRelationInput | LessonProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LessonProgresses.
     */
    cursor?: LessonProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LessonProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LessonProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LessonProgresses.
     */
    distinct?: LessonProgressScalarFieldEnum | LessonProgressScalarFieldEnum[]
  }

  /**
   * LessonProgress findFirstOrThrow
   */
  export type LessonProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    /**
     * Filter, which LessonProgress to fetch.
     */
    where?: LessonProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LessonProgresses to fetch.
     */
    orderBy?: LessonProgressOrderByWithRelationInput | LessonProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LessonProgresses.
     */
    cursor?: LessonProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LessonProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LessonProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LessonProgresses.
     */
    distinct?: LessonProgressScalarFieldEnum | LessonProgressScalarFieldEnum[]
  }

  /**
   * LessonProgress findMany
   */
  export type LessonProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    /**
     * Filter, which LessonProgresses to fetch.
     */
    where?: LessonProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LessonProgresses to fetch.
     */
    orderBy?: LessonProgressOrderByWithRelationInput | LessonProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LessonProgresses.
     */
    cursor?: LessonProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LessonProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LessonProgresses.
     */
    skip?: number
    distinct?: LessonProgressScalarFieldEnum | LessonProgressScalarFieldEnum[]
  }

  /**
   * LessonProgress create
   */
  export type LessonProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a LessonProgress.
     */
    data: XOR<LessonProgressCreateInput, LessonProgressUncheckedCreateInput>
  }

  /**
   * LessonProgress createMany
   */
  export type LessonProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LessonProgresses.
     */
    data: LessonProgressCreateManyInput | LessonProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LessonProgress update
   */
  export type LessonProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a LessonProgress.
     */
    data: XOR<LessonProgressUpdateInput, LessonProgressUncheckedUpdateInput>
    /**
     * Choose, which LessonProgress to update.
     */
    where: LessonProgressWhereUniqueInput
  }

  /**
   * LessonProgress updateMany
   */
  export type LessonProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LessonProgresses.
     */
    data: XOR<LessonProgressUpdateManyMutationInput, LessonProgressUncheckedUpdateManyInput>
    /**
     * Filter which LessonProgresses to update
     */
    where?: LessonProgressWhereInput
    /**
     * Limit how many LessonProgresses to update.
     */
    limit?: number
  }

  /**
   * LessonProgress upsert
   */
  export type LessonProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the LessonProgress to update in case it exists.
     */
    where: LessonProgressWhereUniqueInput
    /**
     * In case the LessonProgress found by the `where` argument doesn't exist, create a new LessonProgress with this data.
     */
    create: XOR<LessonProgressCreateInput, LessonProgressUncheckedCreateInput>
    /**
     * In case the LessonProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LessonProgressUpdateInput, LessonProgressUncheckedUpdateInput>
  }

  /**
   * LessonProgress delete
   */
  export type LessonProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
    /**
     * Filter which LessonProgress to delete.
     */
    where: LessonProgressWhereUniqueInput
  }

  /**
   * LessonProgress deleteMany
   */
  export type LessonProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LessonProgresses to delete
     */
    where?: LessonProgressWhereInput
    /**
     * Limit how many LessonProgresses to delete.
     */
    limit?: number
  }

  /**
   * LessonProgress without action
   */
  export type LessonProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonProgress
     */
    select?: LessonProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LessonProgress
     */
    omit?: LessonProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonProgressInclude<ExtArgs> | null
  }


  /**
   * Model StudentSubmission
   */

  export type AggregateStudentSubmission = {
    _count: StudentSubmissionCountAggregateOutputType | null
    _avg: StudentSubmissionAvgAggregateOutputType | null
    _sum: StudentSubmissionSumAggregateOutputType | null
    _min: StudentSubmissionMinAggregateOutputType | null
    _max: StudentSubmissionMaxAggregateOutputType | null
  }

  export type StudentSubmissionAvgAggregateOutputType = {
    grade: number | null
  }

  export type StudentSubmissionSumAggregateOutputType = {
    grade: number | null
  }

  export type StudentSubmissionMinAggregateOutputType = {
    id: string | null
    studentId: string | null
    lessonId: string | null
    type: $Enums.SubmissionType | null
    content: string | null
    grade: number | null
    submittedAt: Date | null
  }

  export type StudentSubmissionMaxAggregateOutputType = {
    id: string | null
    studentId: string | null
    lessonId: string | null
    type: $Enums.SubmissionType | null
    content: string | null
    grade: number | null
    submittedAt: Date | null
  }

  export type StudentSubmissionCountAggregateOutputType = {
    id: number
    studentId: number
    lessonId: number
    type: number
    content: number
    grade: number
    submittedAt: number
    _all: number
  }


  export type StudentSubmissionAvgAggregateInputType = {
    grade?: true
  }

  export type StudentSubmissionSumAggregateInputType = {
    grade?: true
  }

  export type StudentSubmissionMinAggregateInputType = {
    id?: true
    studentId?: true
    lessonId?: true
    type?: true
    content?: true
    grade?: true
    submittedAt?: true
  }

  export type StudentSubmissionMaxAggregateInputType = {
    id?: true
    studentId?: true
    lessonId?: true
    type?: true
    content?: true
    grade?: true
    submittedAt?: true
  }

  export type StudentSubmissionCountAggregateInputType = {
    id?: true
    studentId?: true
    lessonId?: true
    type?: true
    content?: true
    grade?: true
    submittedAt?: true
    _all?: true
  }

  export type StudentSubmissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentSubmission to aggregate.
     */
    where?: StudentSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentSubmissions to fetch.
     */
    orderBy?: StudentSubmissionOrderByWithRelationInput | StudentSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudentSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StudentSubmissions
    **/
    _count?: true | StudentSubmissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StudentSubmissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StudentSubmissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudentSubmissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudentSubmissionMaxAggregateInputType
  }

  export type GetStudentSubmissionAggregateType<T extends StudentSubmissionAggregateArgs> = {
        [P in keyof T & keyof AggregateStudentSubmission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudentSubmission[P]>
      : GetScalarType<T[P], AggregateStudentSubmission[P]>
  }




  export type StudentSubmissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentSubmissionWhereInput
    orderBy?: StudentSubmissionOrderByWithAggregationInput | StudentSubmissionOrderByWithAggregationInput[]
    by: StudentSubmissionScalarFieldEnum[] | StudentSubmissionScalarFieldEnum
    having?: StudentSubmissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudentSubmissionCountAggregateInputType | true
    _avg?: StudentSubmissionAvgAggregateInputType
    _sum?: StudentSubmissionSumAggregateInputType
    _min?: StudentSubmissionMinAggregateInputType
    _max?: StudentSubmissionMaxAggregateInputType
  }

  export type StudentSubmissionGroupByOutputType = {
    id: string
    studentId: string
    lessonId: string
    type: $Enums.SubmissionType
    content: string | null
    grade: number | null
    submittedAt: Date
    _count: StudentSubmissionCountAggregateOutputType | null
    _avg: StudentSubmissionAvgAggregateOutputType | null
    _sum: StudentSubmissionSumAggregateOutputType | null
    _min: StudentSubmissionMinAggregateOutputType | null
    _max: StudentSubmissionMaxAggregateOutputType | null
  }

  type GetStudentSubmissionGroupByPayload<T extends StudentSubmissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudentSubmissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudentSubmissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudentSubmissionGroupByOutputType[P]>
            : GetScalarType<T[P], StudentSubmissionGroupByOutputType[P]>
        }
      >
    >


  export type StudentSubmissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    lessonId?: boolean
    type?: boolean
    content?: boolean
    grade?: boolean
    submittedAt?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentSubmission"]>



  export type StudentSubmissionSelectScalar = {
    id?: boolean
    studentId?: boolean
    lessonId?: boolean
    type?: boolean
    content?: boolean
    grade?: boolean
    submittedAt?: boolean
  }

  export type StudentSubmissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "studentId" | "lessonId" | "type" | "content" | "grade" | "submittedAt", ExtArgs["result"]["studentSubmission"]>
  export type StudentSubmissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }

  export type $StudentSubmissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StudentSubmission"
    objects: {
      student: Prisma.$StudentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studentId: string
      lessonId: string
      type: $Enums.SubmissionType
      content: string | null
      grade: number | null
      submittedAt: Date
    }, ExtArgs["result"]["studentSubmission"]>
    composites: {}
  }

  type StudentSubmissionGetPayload<S extends boolean | null | undefined | StudentSubmissionDefaultArgs> = $Result.GetResult<Prisma.$StudentSubmissionPayload, S>

  type StudentSubmissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StudentSubmissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StudentSubmissionCountAggregateInputType | true
    }

  export interface StudentSubmissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StudentSubmission'], meta: { name: 'StudentSubmission' } }
    /**
     * Find zero or one StudentSubmission that matches the filter.
     * @param {StudentSubmissionFindUniqueArgs} args - Arguments to find a StudentSubmission
     * @example
     * // Get one StudentSubmission
     * const studentSubmission = await prisma.studentSubmission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudentSubmissionFindUniqueArgs>(args: SelectSubset<T, StudentSubmissionFindUniqueArgs<ExtArgs>>): Prisma__StudentSubmissionClient<$Result.GetResult<Prisma.$StudentSubmissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StudentSubmission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StudentSubmissionFindUniqueOrThrowArgs} args - Arguments to find a StudentSubmission
     * @example
     * // Get one StudentSubmission
     * const studentSubmission = await prisma.studentSubmission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudentSubmissionFindUniqueOrThrowArgs>(args: SelectSubset<T, StudentSubmissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudentSubmissionClient<$Result.GetResult<Prisma.$StudentSubmissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StudentSubmission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentSubmissionFindFirstArgs} args - Arguments to find a StudentSubmission
     * @example
     * // Get one StudentSubmission
     * const studentSubmission = await prisma.studentSubmission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudentSubmissionFindFirstArgs>(args?: SelectSubset<T, StudentSubmissionFindFirstArgs<ExtArgs>>): Prisma__StudentSubmissionClient<$Result.GetResult<Prisma.$StudentSubmissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StudentSubmission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentSubmissionFindFirstOrThrowArgs} args - Arguments to find a StudentSubmission
     * @example
     * // Get one StudentSubmission
     * const studentSubmission = await prisma.studentSubmission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudentSubmissionFindFirstOrThrowArgs>(args?: SelectSubset<T, StudentSubmissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudentSubmissionClient<$Result.GetResult<Prisma.$StudentSubmissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StudentSubmissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentSubmissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StudentSubmissions
     * const studentSubmissions = await prisma.studentSubmission.findMany()
     * 
     * // Get first 10 StudentSubmissions
     * const studentSubmissions = await prisma.studentSubmission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studentSubmissionWithIdOnly = await prisma.studentSubmission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudentSubmissionFindManyArgs>(args?: SelectSubset<T, StudentSubmissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StudentSubmission.
     * @param {StudentSubmissionCreateArgs} args - Arguments to create a StudentSubmission.
     * @example
     * // Create one StudentSubmission
     * const StudentSubmission = await prisma.studentSubmission.create({
     *   data: {
     *     // ... data to create a StudentSubmission
     *   }
     * })
     * 
     */
    create<T extends StudentSubmissionCreateArgs>(args: SelectSubset<T, StudentSubmissionCreateArgs<ExtArgs>>): Prisma__StudentSubmissionClient<$Result.GetResult<Prisma.$StudentSubmissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StudentSubmissions.
     * @param {StudentSubmissionCreateManyArgs} args - Arguments to create many StudentSubmissions.
     * @example
     * // Create many StudentSubmissions
     * const studentSubmission = await prisma.studentSubmission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudentSubmissionCreateManyArgs>(args?: SelectSubset<T, StudentSubmissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a StudentSubmission.
     * @param {StudentSubmissionDeleteArgs} args - Arguments to delete one StudentSubmission.
     * @example
     * // Delete one StudentSubmission
     * const StudentSubmission = await prisma.studentSubmission.delete({
     *   where: {
     *     // ... filter to delete one StudentSubmission
     *   }
     * })
     * 
     */
    delete<T extends StudentSubmissionDeleteArgs>(args: SelectSubset<T, StudentSubmissionDeleteArgs<ExtArgs>>): Prisma__StudentSubmissionClient<$Result.GetResult<Prisma.$StudentSubmissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StudentSubmission.
     * @param {StudentSubmissionUpdateArgs} args - Arguments to update one StudentSubmission.
     * @example
     * // Update one StudentSubmission
     * const studentSubmission = await prisma.studentSubmission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudentSubmissionUpdateArgs>(args: SelectSubset<T, StudentSubmissionUpdateArgs<ExtArgs>>): Prisma__StudentSubmissionClient<$Result.GetResult<Prisma.$StudentSubmissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StudentSubmissions.
     * @param {StudentSubmissionDeleteManyArgs} args - Arguments to filter StudentSubmissions to delete.
     * @example
     * // Delete a few StudentSubmissions
     * const { count } = await prisma.studentSubmission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudentSubmissionDeleteManyArgs>(args?: SelectSubset<T, StudentSubmissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudentSubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentSubmissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StudentSubmissions
     * const studentSubmission = await prisma.studentSubmission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudentSubmissionUpdateManyArgs>(args: SelectSubset<T, StudentSubmissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one StudentSubmission.
     * @param {StudentSubmissionUpsertArgs} args - Arguments to update or create a StudentSubmission.
     * @example
     * // Update or create a StudentSubmission
     * const studentSubmission = await prisma.studentSubmission.upsert({
     *   create: {
     *     // ... data to create a StudentSubmission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StudentSubmission we want to update
     *   }
     * })
     */
    upsert<T extends StudentSubmissionUpsertArgs>(args: SelectSubset<T, StudentSubmissionUpsertArgs<ExtArgs>>): Prisma__StudentSubmissionClient<$Result.GetResult<Prisma.$StudentSubmissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StudentSubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentSubmissionCountArgs} args - Arguments to filter StudentSubmissions to count.
     * @example
     * // Count the number of StudentSubmissions
     * const count = await prisma.studentSubmission.count({
     *   where: {
     *     // ... the filter for the StudentSubmissions we want to count
     *   }
     * })
    **/
    count<T extends StudentSubmissionCountArgs>(
      args?: Subset<T, StudentSubmissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudentSubmissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StudentSubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentSubmissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StudentSubmissionAggregateArgs>(args: Subset<T, StudentSubmissionAggregateArgs>): Prisma.PrismaPromise<GetStudentSubmissionAggregateType<T>>

    /**
     * Group by StudentSubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentSubmissionGroupByArgs} args - Group by arguments.
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
      T extends StudentSubmissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudentSubmissionGroupByArgs['orderBy'] }
        : { orderBy?: StudentSubmissionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, StudentSubmissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentSubmissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StudentSubmission model
   */
  readonly fields: StudentSubmissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StudentSubmission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudentSubmissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends StudentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentDefaultArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the StudentSubmission model
   */
  interface StudentSubmissionFieldRefs {
    readonly id: FieldRef<"StudentSubmission", 'String'>
    readonly studentId: FieldRef<"StudentSubmission", 'String'>
    readonly lessonId: FieldRef<"StudentSubmission", 'String'>
    readonly type: FieldRef<"StudentSubmission", 'SubmissionType'>
    readonly content: FieldRef<"StudentSubmission", 'String'>
    readonly grade: FieldRef<"StudentSubmission", 'Float'>
    readonly submittedAt: FieldRef<"StudentSubmission", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StudentSubmission findUnique
   */
  export type StudentSubmissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubmission
     */
    select?: StudentSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentSubmission
     */
    omit?: StudentSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which StudentSubmission to fetch.
     */
    where: StudentSubmissionWhereUniqueInput
  }

  /**
   * StudentSubmission findUniqueOrThrow
   */
  export type StudentSubmissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubmission
     */
    select?: StudentSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentSubmission
     */
    omit?: StudentSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which StudentSubmission to fetch.
     */
    where: StudentSubmissionWhereUniqueInput
  }

  /**
   * StudentSubmission findFirst
   */
  export type StudentSubmissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubmission
     */
    select?: StudentSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentSubmission
     */
    omit?: StudentSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which StudentSubmission to fetch.
     */
    where?: StudentSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentSubmissions to fetch.
     */
    orderBy?: StudentSubmissionOrderByWithRelationInput | StudentSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentSubmissions.
     */
    cursor?: StudentSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentSubmissions.
     */
    distinct?: StudentSubmissionScalarFieldEnum | StudentSubmissionScalarFieldEnum[]
  }

  /**
   * StudentSubmission findFirstOrThrow
   */
  export type StudentSubmissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubmission
     */
    select?: StudentSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentSubmission
     */
    omit?: StudentSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which StudentSubmission to fetch.
     */
    where?: StudentSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentSubmissions to fetch.
     */
    orderBy?: StudentSubmissionOrderByWithRelationInput | StudentSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentSubmissions.
     */
    cursor?: StudentSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentSubmissions.
     */
    distinct?: StudentSubmissionScalarFieldEnum | StudentSubmissionScalarFieldEnum[]
  }

  /**
   * StudentSubmission findMany
   */
  export type StudentSubmissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubmission
     */
    select?: StudentSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentSubmission
     */
    omit?: StudentSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which StudentSubmissions to fetch.
     */
    where?: StudentSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentSubmissions to fetch.
     */
    orderBy?: StudentSubmissionOrderByWithRelationInput | StudentSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StudentSubmissions.
     */
    cursor?: StudentSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentSubmissions.
     */
    skip?: number
    distinct?: StudentSubmissionScalarFieldEnum | StudentSubmissionScalarFieldEnum[]
  }

  /**
   * StudentSubmission create
   */
  export type StudentSubmissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubmission
     */
    select?: StudentSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentSubmission
     */
    omit?: StudentSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubmissionInclude<ExtArgs> | null
    /**
     * The data needed to create a StudentSubmission.
     */
    data: XOR<StudentSubmissionCreateInput, StudentSubmissionUncheckedCreateInput>
  }

  /**
   * StudentSubmission createMany
   */
  export type StudentSubmissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StudentSubmissions.
     */
    data: StudentSubmissionCreateManyInput | StudentSubmissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StudentSubmission update
   */
  export type StudentSubmissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubmission
     */
    select?: StudentSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentSubmission
     */
    omit?: StudentSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubmissionInclude<ExtArgs> | null
    /**
     * The data needed to update a StudentSubmission.
     */
    data: XOR<StudentSubmissionUpdateInput, StudentSubmissionUncheckedUpdateInput>
    /**
     * Choose, which StudentSubmission to update.
     */
    where: StudentSubmissionWhereUniqueInput
  }

  /**
   * StudentSubmission updateMany
   */
  export type StudentSubmissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StudentSubmissions.
     */
    data: XOR<StudentSubmissionUpdateManyMutationInput, StudentSubmissionUncheckedUpdateManyInput>
    /**
     * Filter which StudentSubmissions to update
     */
    where?: StudentSubmissionWhereInput
    /**
     * Limit how many StudentSubmissions to update.
     */
    limit?: number
  }

  /**
   * StudentSubmission upsert
   */
  export type StudentSubmissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubmission
     */
    select?: StudentSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentSubmission
     */
    omit?: StudentSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubmissionInclude<ExtArgs> | null
    /**
     * The filter to search for the StudentSubmission to update in case it exists.
     */
    where: StudentSubmissionWhereUniqueInput
    /**
     * In case the StudentSubmission found by the `where` argument doesn't exist, create a new StudentSubmission with this data.
     */
    create: XOR<StudentSubmissionCreateInput, StudentSubmissionUncheckedCreateInput>
    /**
     * In case the StudentSubmission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudentSubmissionUpdateInput, StudentSubmissionUncheckedUpdateInput>
  }

  /**
   * StudentSubmission delete
   */
  export type StudentSubmissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubmission
     */
    select?: StudentSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentSubmission
     */
    omit?: StudentSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubmissionInclude<ExtArgs> | null
    /**
     * Filter which StudentSubmission to delete.
     */
    where: StudentSubmissionWhereUniqueInput
  }

  /**
   * StudentSubmission deleteMany
   */
  export type StudentSubmissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentSubmissions to delete
     */
    where?: StudentSubmissionWhereInput
    /**
     * Limit how many StudentSubmissions to delete.
     */
    limit?: number
  }

  /**
   * StudentSubmission without action
   */
  export type StudentSubmissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubmission
     */
    select?: StudentSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentSubmission
     */
    omit?: StudentSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubmissionInclude<ExtArgs> | null
  }


  /**
   * Model LabInstance
   */

  export type AggregateLabInstance = {
    _count: LabInstanceCountAggregateOutputType | null
    _min: LabInstanceMinAggregateOutputType | null
    _max: LabInstanceMaxAggregateOutputType | null
  }

  export type LabInstanceMinAggregateOutputType = {
    id: string | null
    studentId: string | null
    lessonId: string | null
    url: string | null
    containerId: string | null
    state: $Enums.LabState | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LabInstanceMaxAggregateOutputType = {
    id: string | null
    studentId: string | null
    lessonId: string | null
    url: string | null
    containerId: string | null
    state: $Enums.LabState | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LabInstanceCountAggregateOutputType = {
    id: number
    studentId: number
    lessonId: number
    url: number
    containerId: number
    state: number
    config: number
    apiLastRun: number
    uiLastRun: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LabInstanceMinAggregateInputType = {
    id?: true
    studentId?: true
    lessonId?: true
    url?: true
    containerId?: true
    state?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LabInstanceMaxAggregateInputType = {
    id?: true
    studentId?: true
    lessonId?: true
    url?: true
    containerId?: true
    state?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LabInstanceCountAggregateInputType = {
    id?: true
    studentId?: true
    lessonId?: true
    url?: true
    containerId?: true
    state?: true
    config?: true
    apiLastRun?: true
    uiLastRun?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LabInstanceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LabInstance to aggregate.
     */
    where?: LabInstanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabInstances to fetch.
     */
    orderBy?: LabInstanceOrderByWithRelationInput | LabInstanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LabInstanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabInstances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabInstances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LabInstances
    **/
    _count?: true | LabInstanceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LabInstanceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LabInstanceMaxAggregateInputType
  }

  export type GetLabInstanceAggregateType<T extends LabInstanceAggregateArgs> = {
        [P in keyof T & keyof AggregateLabInstance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLabInstance[P]>
      : GetScalarType<T[P], AggregateLabInstance[P]>
  }




  export type LabInstanceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LabInstanceWhereInput
    orderBy?: LabInstanceOrderByWithAggregationInput | LabInstanceOrderByWithAggregationInput[]
    by: LabInstanceScalarFieldEnum[] | LabInstanceScalarFieldEnum
    having?: LabInstanceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LabInstanceCountAggregateInputType | true
    _min?: LabInstanceMinAggregateInputType
    _max?: LabInstanceMaxAggregateInputType
  }

  export type LabInstanceGroupByOutputType = {
    id: string
    studentId: string
    lessonId: string
    url: string | null
    containerId: string | null
    state: $Enums.LabState
    config: JsonValue | null
    apiLastRun: JsonValue | null
    uiLastRun: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: LabInstanceCountAggregateOutputType | null
    _min: LabInstanceMinAggregateOutputType | null
    _max: LabInstanceMaxAggregateOutputType | null
  }

  type GetLabInstanceGroupByPayload<T extends LabInstanceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LabInstanceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LabInstanceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LabInstanceGroupByOutputType[P]>
            : GetScalarType<T[P], LabInstanceGroupByOutputType[P]>
        }
      >
    >


  export type LabInstanceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    lessonId?: boolean
    url?: boolean
    containerId?: boolean
    state?: boolean
    config?: boolean
    apiLastRun?: boolean
    uiLastRun?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["labInstance"]>



  export type LabInstanceSelectScalar = {
    id?: boolean
    studentId?: boolean
    lessonId?: boolean
    url?: boolean
    containerId?: boolean
    state?: boolean
    config?: boolean
    apiLastRun?: boolean
    uiLastRun?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LabInstanceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "studentId" | "lessonId" | "url" | "containerId" | "state" | "config" | "apiLastRun" | "uiLastRun" | "createdAt" | "updatedAt", ExtArgs["result"]["labInstance"]>
  export type LabInstanceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }

  export type $LabInstancePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LabInstance"
    objects: {
      student: Prisma.$StudentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studentId: string
      lessonId: string
      url: string | null
      containerId: string | null
      state: $Enums.LabState
      config: Prisma.JsonValue | null
      apiLastRun: Prisma.JsonValue | null
      uiLastRun: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["labInstance"]>
    composites: {}
  }

  type LabInstanceGetPayload<S extends boolean | null | undefined | LabInstanceDefaultArgs> = $Result.GetResult<Prisma.$LabInstancePayload, S>

  type LabInstanceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LabInstanceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LabInstanceCountAggregateInputType | true
    }

  export interface LabInstanceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LabInstance'], meta: { name: 'LabInstance' } }
    /**
     * Find zero or one LabInstance that matches the filter.
     * @param {LabInstanceFindUniqueArgs} args - Arguments to find a LabInstance
     * @example
     * // Get one LabInstance
     * const labInstance = await prisma.labInstance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LabInstanceFindUniqueArgs>(args: SelectSubset<T, LabInstanceFindUniqueArgs<ExtArgs>>): Prisma__LabInstanceClient<$Result.GetResult<Prisma.$LabInstancePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LabInstance that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LabInstanceFindUniqueOrThrowArgs} args - Arguments to find a LabInstance
     * @example
     * // Get one LabInstance
     * const labInstance = await prisma.labInstance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LabInstanceFindUniqueOrThrowArgs>(args: SelectSubset<T, LabInstanceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LabInstanceClient<$Result.GetResult<Prisma.$LabInstancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LabInstance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabInstanceFindFirstArgs} args - Arguments to find a LabInstance
     * @example
     * // Get one LabInstance
     * const labInstance = await prisma.labInstance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LabInstanceFindFirstArgs>(args?: SelectSubset<T, LabInstanceFindFirstArgs<ExtArgs>>): Prisma__LabInstanceClient<$Result.GetResult<Prisma.$LabInstancePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LabInstance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabInstanceFindFirstOrThrowArgs} args - Arguments to find a LabInstance
     * @example
     * // Get one LabInstance
     * const labInstance = await prisma.labInstance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LabInstanceFindFirstOrThrowArgs>(args?: SelectSubset<T, LabInstanceFindFirstOrThrowArgs<ExtArgs>>): Prisma__LabInstanceClient<$Result.GetResult<Prisma.$LabInstancePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LabInstances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabInstanceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LabInstances
     * const labInstances = await prisma.labInstance.findMany()
     * 
     * // Get first 10 LabInstances
     * const labInstances = await prisma.labInstance.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const labInstanceWithIdOnly = await prisma.labInstance.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LabInstanceFindManyArgs>(args?: SelectSubset<T, LabInstanceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LabInstancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LabInstance.
     * @param {LabInstanceCreateArgs} args - Arguments to create a LabInstance.
     * @example
     * // Create one LabInstance
     * const LabInstance = await prisma.labInstance.create({
     *   data: {
     *     // ... data to create a LabInstance
     *   }
     * })
     * 
     */
    create<T extends LabInstanceCreateArgs>(args: SelectSubset<T, LabInstanceCreateArgs<ExtArgs>>): Prisma__LabInstanceClient<$Result.GetResult<Prisma.$LabInstancePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LabInstances.
     * @param {LabInstanceCreateManyArgs} args - Arguments to create many LabInstances.
     * @example
     * // Create many LabInstances
     * const labInstance = await prisma.labInstance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LabInstanceCreateManyArgs>(args?: SelectSubset<T, LabInstanceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a LabInstance.
     * @param {LabInstanceDeleteArgs} args - Arguments to delete one LabInstance.
     * @example
     * // Delete one LabInstance
     * const LabInstance = await prisma.labInstance.delete({
     *   where: {
     *     // ... filter to delete one LabInstance
     *   }
     * })
     * 
     */
    delete<T extends LabInstanceDeleteArgs>(args: SelectSubset<T, LabInstanceDeleteArgs<ExtArgs>>): Prisma__LabInstanceClient<$Result.GetResult<Prisma.$LabInstancePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LabInstance.
     * @param {LabInstanceUpdateArgs} args - Arguments to update one LabInstance.
     * @example
     * // Update one LabInstance
     * const labInstance = await prisma.labInstance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LabInstanceUpdateArgs>(args: SelectSubset<T, LabInstanceUpdateArgs<ExtArgs>>): Prisma__LabInstanceClient<$Result.GetResult<Prisma.$LabInstancePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LabInstances.
     * @param {LabInstanceDeleteManyArgs} args - Arguments to filter LabInstances to delete.
     * @example
     * // Delete a few LabInstances
     * const { count } = await prisma.labInstance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LabInstanceDeleteManyArgs>(args?: SelectSubset<T, LabInstanceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LabInstances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabInstanceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LabInstances
     * const labInstance = await prisma.labInstance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LabInstanceUpdateManyArgs>(args: SelectSubset<T, LabInstanceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LabInstance.
     * @param {LabInstanceUpsertArgs} args - Arguments to update or create a LabInstance.
     * @example
     * // Update or create a LabInstance
     * const labInstance = await prisma.labInstance.upsert({
     *   create: {
     *     // ... data to create a LabInstance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LabInstance we want to update
     *   }
     * })
     */
    upsert<T extends LabInstanceUpsertArgs>(args: SelectSubset<T, LabInstanceUpsertArgs<ExtArgs>>): Prisma__LabInstanceClient<$Result.GetResult<Prisma.$LabInstancePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LabInstances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabInstanceCountArgs} args - Arguments to filter LabInstances to count.
     * @example
     * // Count the number of LabInstances
     * const count = await prisma.labInstance.count({
     *   where: {
     *     // ... the filter for the LabInstances we want to count
     *   }
     * })
    **/
    count<T extends LabInstanceCountArgs>(
      args?: Subset<T, LabInstanceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LabInstanceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LabInstance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabInstanceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LabInstanceAggregateArgs>(args: Subset<T, LabInstanceAggregateArgs>): Prisma.PrismaPromise<GetLabInstanceAggregateType<T>>

    /**
     * Group by LabInstance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LabInstanceGroupByArgs} args - Group by arguments.
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
      T extends LabInstanceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LabInstanceGroupByArgs['orderBy'] }
        : { orderBy?: LabInstanceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LabInstanceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLabInstanceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LabInstance model
   */
  readonly fields: LabInstanceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LabInstance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LabInstanceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends StudentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentDefaultArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the LabInstance model
   */
  interface LabInstanceFieldRefs {
    readonly id: FieldRef<"LabInstance", 'String'>
    readonly studentId: FieldRef<"LabInstance", 'String'>
    readonly lessonId: FieldRef<"LabInstance", 'String'>
    readonly url: FieldRef<"LabInstance", 'String'>
    readonly containerId: FieldRef<"LabInstance", 'String'>
    readonly state: FieldRef<"LabInstance", 'LabState'>
    readonly config: FieldRef<"LabInstance", 'Json'>
    readonly apiLastRun: FieldRef<"LabInstance", 'Json'>
    readonly uiLastRun: FieldRef<"LabInstance", 'Json'>
    readonly createdAt: FieldRef<"LabInstance", 'DateTime'>
    readonly updatedAt: FieldRef<"LabInstance", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LabInstance findUnique
   */
  export type LabInstanceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabInstance
     */
    select?: LabInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabInstance
     */
    omit?: LabInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabInstanceInclude<ExtArgs> | null
    /**
     * Filter, which LabInstance to fetch.
     */
    where: LabInstanceWhereUniqueInput
  }

  /**
   * LabInstance findUniqueOrThrow
   */
  export type LabInstanceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabInstance
     */
    select?: LabInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabInstance
     */
    omit?: LabInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabInstanceInclude<ExtArgs> | null
    /**
     * Filter, which LabInstance to fetch.
     */
    where: LabInstanceWhereUniqueInput
  }

  /**
   * LabInstance findFirst
   */
  export type LabInstanceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabInstance
     */
    select?: LabInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabInstance
     */
    omit?: LabInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabInstanceInclude<ExtArgs> | null
    /**
     * Filter, which LabInstance to fetch.
     */
    where?: LabInstanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabInstances to fetch.
     */
    orderBy?: LabInstanceOrderByWithRelationInput | LabInstanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LabInstances.
     */
    cursor?: LabInstanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabInstances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabInstances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LabInstances.
     */
    distinct?: LabInstanceScalarFieldEnum | LabInstanceScalarFieldEnum[]
  }

  /**
   * LabInstance findFirstOrThrow
   */
  export type LabInstanceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabInstance
     */
    select?: LabInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabInstance
     */
    omit?: LabInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabInstanceInclude<ExtArgs> | null
    /**
     * Filter, which LabInstance to fetch.
     */
    where?: LabInstanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabInstances to fetch.
     */
    orderBy?: LabInstanceOrderByWithRelationInput | LabInstanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LabInstances.
     */
    cursor?: LabInstanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabInstances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabInstances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LabInstances.
     */
    distinct?: LabInstanceScalarFieldEnum | LabInstanceScalarFieldEnum[]
  }

  /**
   * LabInstance findMany
   */
  export type LabInstanceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabInstance
     */
    select?: LabInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabInstance
     */
    omit?: LabInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabInstanceInclude<ExtArgs> | null
    /**
     * Filter, which LabInstances to fetch.
     */
    where?: LabInstanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LabInstances to fetch.
     */
    orderBy?: LabInstanceOrderByWithRelationInput | LabInstanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LabInstances.
     */
    cursor?: LabInstanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LabInstances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LabInstances.
     */
    skip?: number
    distinct?: LabInstanceScalarFieldEnum | LabInstanceScalarFieldEnum[]
  }

  /**
   * LabInstance create
   */
  export type LabInstanceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabInstance
     */
    select?: LabInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabInstance
     */
    omit?: LabInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabInstanceInclude<ExtArgs> | null
    /**
     * The data needed to create a LabInstance.
     */
    data: XOR<LabInstanceCreateInput, LabInstanceUncheckedCreateInput>
  }

  /**
   * LabInstance createMany
   */
  export type LabInstanceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LabInstances.
     */
    data: LabInstanceCreateManyInput | LabInstanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LabInstance update
   */
  export type LabInstanceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabInstance
     */
    select?: LabInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabInstance
     */
    omit?: LabInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabInstanceInclude<ExtArgs> | null
    /**
     * The data needed to update a LabInstance.
     */
    data: XOR<LabInstanceUpdateInput, LabInstanceUncheckedUpdateInput>
    /**
     * Choose, which LabInstance to update.
     */
    where: LabInstanceWhereUniqueInput
  }

  /**
   * LabInstance updateMany
   */
  export type LabInstanceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LabInstances.
     */
    data: XOR<LabInstanceUpdateManyMutationInput, LabInstanceUncheckedUpdateManyInput>
    /**
     * Filter which LabInstances to update
     */
    where?: LabInstanceWhereInput
    /**
     * Limit how many LabInstances to update.
     */
    limit?: number
  }

  /**
   * LabInstance upsert
   */
  export type LabInstanceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabInstance
     */
    select?: LabInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabInstance
     */
    omit?: LabInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabInstanceInclude<ExtArgs> | null
    /**
     * The filter to search for the LabInstance to update in case it exists.
     */
    where: LabInstanceWhereUniqueInput
    /**
     * In case the LabInstance found by the `where` argument doesn't exist, create a new LabInstance with this data.
     */
    create: XOR<LabInstanceCreateInput, LabInstanceUncheckedCreateInput>
    /**
     * In case the LabInstance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LabInstanceUpdateInput, LabInstanceUncheckedUpdateInput>
  }

  /**
   * LabInstance delete
   */
  export type LabInstanceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabInstance
     */
    select?: LabInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabInstance
     */
    omit?: LabInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabInstanceInclude<ExtArgs> | null
    /**
     * Filter which LabInstance to delete.
     */
    where: LabInstanceWhereUniqueInput
  }

  /**
   * LabInstance deleteMany
   */
  export type LabInstanceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LabInstances to delete
     */
    where?: LabInstanceWhereInput
    /**
     * Limit how many LabInstances to delete.
     */
    limit?: number
  }

  /**
   * LabInstance without action
   */
  export type LabInstanceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LabInstance
     */
    select?: LabInstanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LabInstance
     */
    omit?: LabInstanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LabInstanceInclude<ExtArgs> | null
  }


  /**
   * Model QuizAttempt
   */

  export type AggregateQuizAttempt = {
    _count: QuizAttemptCountAggregateOutputType | null
    _avg: QuizAttemptAvgAggregateOutputType | null
    _sum: QuizAttemptSumAggregateOutputType | null
    _min: QuizAttemptMinAggregateOutputType | null
    _max: QuizAttemptMaxAggregateOutputType | null
  }

  export type QuizAttemptAvgAggregateOutputType = {
    score: number | null
  }

  export type QuizAttemptSumAggregateOutputType = {
    score: number | null
  }

  export type QuizAttemptMinAggregateOutputType = {
    id: string | null
    studentId: string | null
    lessonId: string | null
    score: number | null
    startedAt: Date | null
    submittedAt: Date | null
  }

  export type QuizAttemptMaxAggregateOutputType = {
    id: string | null
    studentId: string | null
    lessonId: string | null
    score: number | null
    startedAt: Date | null
    submittedAt: Date | null
  }

  export type QuizAttemptCountAggregateOutputType = {
    id: number
    studentId: number
    lessonId: number
    answers: number
    score: number
    startedAt: number
    submittedAt: number
    _all: number
  }


  export type QuizAttemptAvgAggregateInputType = {
    score?: true
  }

  export type QuizAttemptSumAggregateInputType = {
    score?: true
  }

  export type QuizAttemptMinAggregateInputType = {
    id?: true
    studentId?: true
    lessonId?: true
    score?: true
    startedAt?: true
    submittedAt?: true
  }

  export type QuizAttemptMaxAggregateInputType = {
    id?: true
    studentId?: true
    lessonId?: true
    score?: true
    startedAt?: true
    submittedAt?: true
  }

  export type QuizAttemptCountAggregateInputType = {
    id?: true
    studentId?: true
    lessonId?: true
    answers?: true
    score?: true
    startedAt?: true
    submittedAt?: true
    _all?: true
  }

  export type QuizAttemptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuizAttempt to aggregate.
     */
    where?: QuizAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizAttempts to fetch.
     */
    orderBy?: QuizAttemptOrderByWithRelationInput | QuizAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuizAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QuizAttempts
    **/
    _count?: true | QuizAttemptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuizAttemptAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuizAttemptSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuizAttemptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuizAttemptMaxAggregateInputType
  }

  export type GetQuizAttemptAggregateType<T extends QuizAttemptAggregateArgs> = {
        [P in keyof T & keyof AggregateQuizAttempt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuizAttempt[P]>
      : GetScalarType<T[P], AggregateQuizAttempt[P]>
  }




  export type QuizAttemptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizAttemptWhereInput
    orderBy?: QuizAttemptOrderByWithAggregationInput | QuizAttemptOrderByWithAggregationInput[]
    by: QuizAttemptScalarFieldEnum[] | QuizAttemptScalarFieldEnum
    having?: QuizAttemptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuizAttemptCountAggregateInputType | true
    _avg?: QuizAttemptAvgAggregateInputType
    _sum?: QuizAttemptSumAggregateInputType
    _min?: QuizAttemptMinAggregateInputType
    _max?: QuizAttemptMaxAggregateInputType
  }

  export type QuizAttemptGroupByOutputType = {
    id: string
    studentId: string
    lessonId: string
    answers: JsonValue
    score: number | null
    startedAt: Date
    submittedAt: Date | null
    _count: QuizAttemptCountAggregateOutputType | null
    _avg: QuizAttemptAvgAggregateOutputType | null
    _sum: QuizAttemptSumAggregateOutputType | null
    _min: QuizAttemptMinAggregateOutputType | null
    _max: QuizAttemptMaxAggregateOutputType | null
  }

  type GetQuizAttemptGroupByPayload<T extends QuizAttemptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuizAttemptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuizAttemptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuizAttemptGroupByOutputType[P]>
            : GetScalarType<T[P], QuizAttemptGroupByOutputType[P]>
        }
      >
    >


  export type QuizAttemptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    lessonId?: boolean
    answers?: boolean
    score?: boolean
    startedAt?: boolean
    submittedAt?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quizAttempt"]>



  export type QuizAttemptSelectScalar = {
    id?: boolean
    studentId?: boolean
    lessonId?: boolean
    answers?: boolean
    score?: boolean
    startedAt?: boolean
    submittedAt?: boolean
  }

  export type QuizAttemptOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "studentId" | "lessonId" | "answers" | "score" | "startedAt" | "submittedAt", ExtArgs["result"]["quizAttempt"]>
  export type QuizAttemptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }

  export type $QuizAttemptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QuizAttempt"
    objects: {
      student: Prisma.$StudentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studentId: string
      lessonId: string
      answers: Prisma.JsonValue
      score: number | null
      startedAt: Date
      submittedAt: Date | null
    }, ExtArgs["result"]["quizAttempt"]>
    composites: {}
  }

  type QuizAttemptGetPayload<S extends boolean | null | undefined | QuizAttemptDefaultArgs> = $Result.GetResult<Prisma.$QuizAttemptPayload, S>

  type QuizAttemptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuizAttemptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuizAttemptCountAggregateInputType | true
    }

  export interface QuizAttemptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QuizAttempt'], meta: { name: 'QuizAttempt' } }
    /**
     * Find zero or one QuizAttempt that matches the filter.
     * @param {QuizAttemptFindUniqueArgs} args - Arguments to find a QuizAttempt
     * @example
     * // Get one QuizAttempt
     * const quizAttempt = await prisma.quizAttempt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuizAttemptFindUniqueArgs>(args: SelectSubset<T, QuizAttemptFindUniqueArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one QuizAttempt that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuizAttemptFindUniqueOrThrowArgs} args - Arguments to find a QuizAttempt
     * @example
     * // Get one QuizAttempt
     * const quizAttempt = await prisma.quizAttempt.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuizAttemptFindUniqueOrThrowArgs>(args: SelectSubset<T, QuizAttemptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuizAttempt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAttemptFindFirstArgs} args - Arguments to find a QuizAttempt
     * @example
     * // Get one QuizAttempt
     * const quizAttempt = await prisma.quizAttempt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuizAttemptFindFirstArgs>(args?: SelectSubset<T, QuizAttemptFindFirstArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuizAttempt that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAttemptFindFirstOrThrowArgs} args - Arguments to find a QuizAttempt
     * @example
     * // Get one QuizAttempt
     * const quizAttempt = await prisma.quizAttempt.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuizAttemptFindFirstOrThrowArgs>(args?: SelectSubset<T, QuizAttemptFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more QuizAttempts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAttemptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuizAttempts
     * const quizAttempts = await prisma.quizAttempt.findMany()
     * 
     * // Get first 10 QuizAttempts
     * const quizAttempts = await prisma.quizAttempt.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quizAttemptWithIdOnly = await prisma.quizAttempt.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuizAttemptFindManyArgs>(args?: SelectSubset<T, QuizAttemptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a QuizAttempt.
     * @param {QuizAttemptCreateArgs} args - Arguments to create a QuizAttempt.
     * @example
     * // Create one QuizAttempt
     * const QuizAttempt = await prisma.quizAttempt.create({
     *   data: {
     *     // ... data to create a QuizAttempt
     *   }
     * })
     * 
     */
    create<T extends QuizAttemptCreateArgs>(args: SelectSubset<T, QuizAttemptCreateArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many QuizAttempts.
     * @param {QuizAttemptCreateManyArgs} args - Arguments to create many QuizAttempts.
     * @example
     * // Create many QuizAttempts
     * const quizAttempt = await prisma.quizAttempt.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuizAttemptCreateManyArgs>(args?: SelectSubset<T, QuizAttemptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a QuizAttempt.
     * @param {QuizAttemptDeleteArgs} args - Arguments to delete one QuizAttempt.
     * @example
     * // Delete one QuizAttempt
     * const QuizAttempt = await prisma.quizAttempt.delete({
     *   where: {
     *     // ... filter to delete one QuizAttempt
     *   }
     * })
     * 
     */
    delete<T extends QuizAttemptDeleteArgs>(args: SelectSubset<T, QuizAttemptDeleteArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one QuizAttempt.
     * @param {QuizAttemptUpdateArgs} args - Arguments to update one QuizAttempt.
     * @example
     * // Update one QuizAttempt
     * const quizAttempt = await prisma.quizAttempt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuizAttemptUpdateArgs>(args: SelectSubset<T, QuizAttemptUpdateArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more QuizAttempts.
     * @param {QuizAttemptDeleteManyArgs} args - Arguments to filter QuizAttempts to delete.
     * @example
     * // Delete a few QuizAttempts
     * const { count } = await prisma.quizAttempt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuizAttemptDeleteManyArgs>(args?: SelectSubset<T, QuizAttemptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuizAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAttemptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuizAttempts
     * const quizAttempt = await prisma.quizAttempt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuizAttemptUpdateManyArgs>(args: SelectSubset<T, QuizAttemptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one QuizAttempt.
     * @param {QuizAttemptUpsertArgs} args - Arguments to update or create a QuizAttempt.
     * @example
     * // Update or create a QuizAttempt
     * const quizAttempt = await prisma.quizAttempt.upsert({
     *   create: {
     *     // ... data to create a QuizAttempt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuizAttempt we want to update
     *   }
     * })
     */
    upsert<T extends QuizAttemptUpsertArgs>(args: SelectSubset<T, QuizAttemptUpsertArgs<ExtArgs>>): Prisma__QuizAttemptClient<$Result.GetResult<Prisma.$QuizAttemptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of QuizAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAttemptCountArgs} args - Arguments to filter QuizAttempts to count.
     * @example
     * // Count the number of QuizAttempts
     * const count = await prisma.quizAttempt.count({
     *   where: {
     *     // ... the filter for the QuizAttempts we want to count
     *   }
     * })
    **/
    count<T extends QuizAttemptCountArgs>(
      args?: Subset<T, QuizAttemptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuizAttemptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QuizAttempt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAttemptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends QuizAttemptAggregateArgs>(args: Subset<T, QuizAttemptAggregateArgs>): Prisma.PrismaPromise<GetQuizAttemptAggregateType<T>>

    /**
     * Group by QuizAttempt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAttemptGroupByArgs} args - Group by arguments.
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
      T extends QuizAttemptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuizAttemptGroupByArgs['orderBy'] }
        : { orderBy?: QuizAttemptGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, QuizAttemptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuizAttemptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QuizAttempt model
   */
  readonly fields: QuizAttemptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QuizAttempt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuizAttemptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends StudentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentDefaultArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the QuizAttempt model
   */
  interface QuizAttemptFieldRefs {
    readonly id: FieldRef<"QuizAttempt", 'String'>
    readonly studentId: FieldRef<"QuizAttempt", 'String'>
    readonly lessonId: FieldRef<"QuizAttempt", 'String'>
    readonly answers: FieldRef<"QuizAttempt", 'Json'>
    readonly score: FieldRef<"QuizAttempt", 'Float'>
    readonly startedAt: FieldRef<"QuizAttempt", 'DateTime'>
    readonly submittedAt: FieldRef<"QuizAttempt", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * QuizAttempt findUnique
   */
  export type QuizAttemptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    /**
     * Filter, which QuizAttempt to fetch.
     */
    where: QuizAttemptWhereUniqueInput
  }

  /**
   * QuizAttempt findUniqueOrThrow
   */
  export type QuizAttemptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    /**
     * Filter, which QuizAttempt to fetch.
     */
    where: QuizAttemptWhereUniqueInput
  }

  /**
   * QuizAttempt findFirst
   */
  export type QuizAttemptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    /**
     * Filter, which QuizAttempt to fetch.
     */
    where?: QuizAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizAttempts to fetch.
     */
    orderBy?: QuizAttemptOrderByWithRelationInput | QuizAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuizAttempts.
     */
    cursor?: QuizAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuizAttempts.
     */
    distinct?: QuizAttemptScalarFieldEnum | QuizAttemptScalarFieldEnum[]
  }

  /**
   * QuizAttempt findFirstOrThrow
   */
  export type QuizAttemptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    /**
     * Filter, which QuizAttempt to fetch.
     */
    where?: QuizAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizAttempts to fetch.
     */
    orderBy?: QuizAttemptOrderByWithRelationInput | QuizAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuizAttempts.
     */
    cursor?: QuizAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuizAttempts.
     */
    distinct?: QuizAttemptScalarFieldEnum | QuizAttemptScalarFieldEnum[]
  }

  /**
   * QuizAttempt findMany
   */
  export type QuizAttemptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    /**
     * Filter, which QuizAttempts to fetch.
     */
    where?: QuizAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizAttempts to fetch.
     */
    orderBy?: QuizAttemptOrderByWithRelationInput | QuizAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QuizAttempts.
     */
    cursor?: QuizAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizAttempts.
     */
    skip?: number
    distinct?: QuizAttemptScalarFieldEnum | QuizAttemptScalarFieldEnum[]
  }

  /**
   * QuizAttempt create
   */
  export type QuizAttemptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    /**
     * The data needed to create a QuizAttempt.
     */
    data: XOR<QuizAttemptCreateInput, QuizAttemptUncheckedCreateInput>
  }

  /**
   * QuizAttempt createMany
   */
  export type QuizAttemptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuizAttempts.
     */
    data: QuizAttemptCreateManyInput | QuizAttemptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuizAttempt update
   */
  export type QuizAttemptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    /**
     * The data needed to update a QuizAttempt.
     */
    data: XOR<QuizAttemptUpdateInput, QuizAttemptUncheckedUpdateInput>
    /**
     * Choose, which QuizAttempt to update.
     */
    where: QuizAttemptWhereUniqueInput
  }

  /**
   * QuizAttempt updateMany
   */
  export type QuizAttemptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QuizAttempts.
     */
    data: XOR<QuizAttemptUpdateManyMutationInput, QuizAttemptUncheckedUpdateManyInput>
    /**
     * Filter which QuizAttempts to update
     */
    where?: QuizAttemptWhereInput
    /**
     * Limit how many QuizAttempts to update.
     */
    limit?: number
  }

  /**
   * QuizAttempt upsert
   */
  export type QuizAttemptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    /**
     * The filter to search for the QuizAttempt to update in case it exists.
     */
    where: QuizAttemptWhereUniqueInput
    /**
     * In case the QuizAttempt found by the `where` argument doesn't exist, create a new QuizAttempt with this data.
     */
    create: XOR<QuizAttemptCreateInput, QuizAttemptUncheckedCreateInput>
    /**
     * In case the QuizAttempt was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuizAttemptUpdateInput, QuizAttemptUncheckedUpdateInput>
  }

  /**
   * QuizAttempt delete
   */
  export type QuizAttemptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
    /**
     * Filter which QuizAttempt to delete.
     */
    where: QuizAttemptWhereUniqueInput
  }

  /**
   * QuizAttempt deleteMany
   */
  export type QuizAttemptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuizAttempts to delete
     */
    where?: QuizAttemptWhereInput
    /**
     * Limit how many QuizAttempts to delete.
     */
    limit?: number
  }

  /**
   * QuizAttempt without action
   */
  export type QuizAttemptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizAttempt
     */
    select?: QuizAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizAttempt
     */
    omit?: QuizAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizAttemptInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
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


  export const StudentCourseScalarFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    courseId: 'courseId',
    completed: 'completed',
    progress: 'progress',
    enrolledAt: 'enrolledAt'
  };

  export type StudentCourseScalarFieldEnum = (typeof StudentCourseScalarFieldEnum)[keyof typeof StudentCourseScalarFieldEnum]


  export const LessonProgressScalarFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    lessonId: 'lessonId',
    status: 'status',
    score: 'score',
    startedAt: 'startedAt',
    updatedAt: 'updatedAt',
    completedAt: 'completedAt'
  };

  export type LessonProgressScalarFieldEnum = (typeof LessonProgressScalarFieldEnum)[keyof typeof LessonProgressScalarFieldEnum]


  export const StudentSubmissionScalarFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    lessonId: 'lessonId',
    type: 'type',
    content: 'content',
    grade: 'grade',
    submittedAt: 'submittedAt'
  };

  export type StudentSubmissionScalarFieldEnum = (typeof StudentSubmissionScalarFieldEnum)[keyof typeof StudentSubmissionScalarFieldEnum]


  export const LabInstanceScalarFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    lessonId: 'lessonId',
    url: 'url',
    containerId: 'containerId',
    state: 'state',
    config: 'config',
    apiLastRun: 'apiLastRun',
    uiLastRun: 'uiLastRun',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LabInstanceScalarFieldEnum = (typeof LabInstanceScalarFieldEnum)[keyof typeof LabInstanceScalarFieldEnum]


  export const QuizAttemptScalarFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    lessonId: 'lessonId',
    answers: 'answers',
    score: 'score',
    startedAt: 'startedAt',
    submittedAt: 'submittedAt'
  };

  export type QuizAttemptScalarFieldEnum = (typeof QuizAttemptScalarFieldEnum)[keyof typeof QuizAttemptScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const StudentOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId',
    displayName: 'displayName'
  };

  export type StudentOrderByRelevanceFieldEnum = (typeof StudentOrderByRelevanceFieldEnum)[keyof typeof StudentOrderByRelevanceFieldEnum]


  export const StudentCourseOrderByRelevanceFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    courseId: 'courseId'
  };

  export type StudentCourseOrderByRelevanceFieldEnum = (typeof StudentCourseOrderByRelevanceFieldEnum)[keyof typeof StudentCourseOrderByRelevanceFieldEnum]


  export const LessonProgressOrderByRelevanceFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    lessonId: 'lessonId'
  };

  export type LessonProgressOrderByRelevanceFieldEnum = (typeof LessonProgressOrderByRelevanceFieldEnum)[keyof typeof LessonProgressOrderByRelevanceFieldEnum]


  export const StudentSubmissionOrderByRelevanceFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    lessonId: 'lessonId',
    content: 'content'
  };

  export type StudentSubmissionOrderByRelevanceFieldEnum = (typeof StudentSubmissionOrderByRelevanceFieldEnum)[keyof typeof StudentSubmissionOrderByRelevanceFieldEnum]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const LabInstanceOrderByRelevanceFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    lessonId: 'lessonId',
    url: 'url',
    containerId: 'containerId'
  };

  export type LabInstanceOrderByRelevanceFieldEnum = (typeof LabInstanceOrderByRelevanceFieldEnum)[keyof typeof LabInstanceOrderByRelevanceFieldEnum]


  export const QuizAttemptOrderByRelevanceFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    lessonId: 'lessonId'
  };

  export type QuizAttemptOrderByRelevanceFieldEnum = (typeof QuizAttemptOrderByRelevanceFieldEnum)[keyof typeof QuizAttemptOrderByRelevanceFieldEnum]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'LessonStatus'
   */
  export type EnumLessonStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LessonStatus'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'SubmissionType'
   */
  export type EnumSubmissionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubmissionType'>
    


  /**
   * Reference to a field of type 'LabState'
   */
  export type EnumLabStateFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LabState'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    
  /**
   * Deep Input Types
   */


  export type StudentWhereInput = {
    AND?: StudentWhereInput | StudentWhereInput[]
    OR?: StudentWhereInput[]
    NOT?: StudentWhereInput | StudentWhereInput[]
    id?: StringFilter<"Student"> | string
    userId?: StringNullableFilter<"Student"> | string | null
    displayName?: StringNullableFilter<"Student"> | string | null
    createdAt?: DateTimeFilter<"Student"> | Date | string
    updatedAt?: DateTimeFilter<"Student"> | Date | string
    courses?: StudentCourseListRelationFilter
    lessonProgress?: LessonProgressListRelationFilter
    submissions?: StudentSubmissionListRelationFilter
    labs?: LabInstanceListRelationFilter
    quizzes?: QuizAttemptListRelationFilter
  }

  export type StudentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    displayName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    courses?: StudentCourseOrderByRelationAggregateInput
    lessonProgress?: LessonProgressOrderByRelationAggregateInput
    submissions?: StudentSubmissionOrderByRelationAggregateInput
    labs?: LabInstanceOrderByRelationAggregateInput
    quizzes?: QuizAttemptOrderByRelationAggregateInput
    _relevance?: StudentOrderByRelevanceInput
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
    courses?: StudentCourseListRelationFilter
    lessonProgress?: LessonProgressListRelationFilter
    submissions?: StudentSubmissionListRelationFilter
    labs?: LabInstanceListRelationFilter
    quizzes?: QuizAttemptListRelationFilter
  }, "id" | "userId">

  export type StudentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
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
    userId?: StringNullableWithAggregatesFilter<"Student"> | string | null
    displayName?: StringNullableWithAggregatesFilter<"Student"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Student"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Student"> | Date | string
  }

  export type StudentCourseWhereInput = {
    AND?: StudentCourseWhereInput | StudentCourseWhereInput[]
    OR?: StudentCourseWhereInput[]
    NOT?: StudentCourseWhereInput | StudentCourseWhereInput[]
    id?: StringFilter<"StudentCourse"> | string
    studentId?: StringFilter<"StudentCourse"> | string
    courseId?: StringFilter<"StudentCourse"> | string
    completed?: BoolFilter<"StudentCourse"> | boolean
    progress?: IntNullableFilter<"StudentCourse"> | number | null
    enrolledAt?: DateTimeFilter<"StudentCourse"> | Date | string
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }

  export type StudentCourseOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    completed?: SortOrder
    progress?: SortOrderInput | SortOrder
    enrolledAt?: SortOrder
    student?: StudentOrderByWithRelationInput
    _relevance?: StudentCourseOrderByRelevanceInput
  }

  export type StudentCourseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    studentId_courseId?: StudentCourseStudentIdCourseIdCompoundUniqueInput
    AND?: StudentCourseWhereInput | StudentCourseWhereInput[]
    OR?: StudentCourseWhereInput[]
    NOT?: StudentCourseWhereInput | StudentCourseWhereInput[]
    studentId?: StringFilter<"StudentCourse"> | string
    courseId?: StringFilter<"StudentCourse"> | string
    completed?: BoolFilter<"StudentCourse"> | boolean
    progress?: IntNullableFilter<"StudentCourse"> | number | null
    enrolledAt?: DateTimeFilter<"StudentCourse"> | Date | string
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }, "id" | "studentId_courseId">

  export type StudentCourseOrderByWithAggregationInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    completed?: SortOrder
    progress?: SortOrderInput | SortOrder
    enrolledAt?: SortOrder
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
    progress?: IntNullableWithAggregatesFilter<"StudentCourse"> | number | null
    enrolledAt?: DateTimeWithAggregatesFilter<"StudentCourse"> | Date | string
  }

  export type LessonProgressWhereInput = {
    AND?: LessonProgressWhereInput | LessonProgressWhereInput[]
    OR?: LessonProgressWhereInput[]
    NOT?: LessonProgressWhereInput | LessonProgressWhereInput[]
    id?: StringFilter<"LessonProgress"> | string
    studentId?: StringFilter<"LessonProgress"> | string
    lessonId?: StringFilter<"LessonProgress"> | string
    status?: EnumLessonStatusFilter<"LessonProgress"> | $Enums.LessonStatus
    score?: FloatNullableFilter<"LessonProgress"> | number | null
    startedAt?: DateTimeNullableFilter<"LessonProgress"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"LessonProgress"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"LessonProgress"> | Date | string | null
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }

  export type LessonProgressOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    status?: SortOrder
    score?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    student?: StudentOrderByWithRelationInput
    _relevance?: LessonProgressOrderByRelevanceInput
  }

  export type LessonProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    studentId_lessonId?: LessonProgressStudentIdLessonIdCompoundUniqueInput
    AND?: LessonProgressWhereInput | LessonProgressWhereInput[]
    OR?: LessonProgressWhereInput[]
    NOT?: LessonProgressWhereInput | LessonProgressWhereInput[]
    studentId?: StringFilter<"LessonProgress"> | string
    lessonId?: StringFilter<"LessonProgress"> | string
    status?: EnumLessonStatusFilter<"LessonProgress"> | $Enums.LessonStatus
    score?: FloatNullableFilter<"LessonProgress"> | number | null
    startedAt?: DateTimeNullableFilter<"LessonProgress"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"LessonProgress"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"LessonProgress"> | Date | string | null
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }, "id" | "studentId_lessonId">

  export type LessonProgressOrderByWithAggregationInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    status?: SortOrder
    score?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: LessonProgressCountOrderByAggregateInput
    _avg?: LessonProgressAvgOrderByAggregateInput
    _max?: LessonProgressMaxOrderByAggregateInput
    _min?: LessonProgressMinOrderByAggregateInput
    _sum?: LessonProgressSumOrderByAggregateInput
  }

  export type LessonProgressScalarWhereWithAggregatesInput = {
    AND?: LessonProgressScalarWhereWithAggregatesInput | LessonProgressScalarWhereWithAggregatesInput[]
    OR?: LessonProgressScalarWhereWithAggregatesInput[]
    NOT?: LessonProgressScalarWhereWithAggregatesInput | LessonProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LessonProgress"> | string
    studentId?: StringWithAggregatesFilter<"LessonProgress"> | string
    lessonId?: StringWithAggregatesFilter<"LessonProgress"> | string
    status?: EnumLessonStatusWithAggregatesFilter<"LessonProgress"> | $Enums.LessonStatus
    score?: FloatNullableWithAggregatesFilter<"LessonProgress"> | number | null
    startedAt?: DateTimeNullableWithAggregatesFilter<"LessonProgress"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"LessonProgress"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"LessonProgress"> | Date | string | null
  }

  export type StudentSubmissionWhereInput = {
    AND?: StudentSubmissionWhereInput | StudentSubmissionWhereInput[]
    OR?: StudentSubmissionWhereInput[]
    NOT?: StudentSubmissionWhereInput | StudentSubmissionWhereInput[]
    id?: StringFilter<"StudentSubmission"> | string
    studentId?: StringFilter<"StudentSubmission"> | string
    lessonId?: StringFilter<"StudentSubmission"> | string
    type?: EnumSubmissionTypeFilter<"StudentSubmission"> | $Enums.SubmissionType
    content?: StringNullableFilter<"StudentSubmission"> | string | null
    grade?: FloatNullableFilter<"StudentSubmission"> | number | null
    submittedAt?: DateTimeFilter<"StudentSubmission"> | Date | string
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }

  export type StudentSubmissionOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    type?: SortOrder
    content?: SortOrderInput | SortOrder
    grade?: SortOrderInput | SortOrder
    submittedAt?: SortOrder
    student?: StudentOrderByWithRelationInput
    _relevance?: StudentSubmissionOrderByRelevanceInput
  }

  export type StudentSubmissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StudentSubmissionWhereInput | StudentSubmissionWhereInput[]
    OR?: StudentSubmissionWhereInput[]
    NOT?: StudentSubmissionWhereInput | StudentSubmissionWhereInput[]
    studentId?: StringFilter<"StudentSubmission"> | string
    lessonId?: StringFilter<"StudentSubmission"> | string
    type?: EnumSubmissionTypeFilter<"StudentSubmission"> | $Enums.SubmissionType
    content?: StringNullableFilter<"StudentSubmission"> | string | null
    grade?: FloatNullableFilter<"StudentSubmission"> | number | null
    submittedAt?: DateTimeFilter<"StudentSubmission"> | Date | string
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }, "id">

  export type StudentSubmissionOrderByWithAggregationInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    type?: SortOrder
    content?: SortOrderInput | SortOrder
    grade?: SortOrderInput | SortOrder
    submittedAt?: SortOrder
    _count?: StudentSubmissionCountOrderByAggregateInput
    _avg?: StudentSubmissionAvgOrderByAggregateInput
    _max?: StudentSubmissionMaxOrderByAggregateInput
    _min?: StudentSubmissionMinOrderByAggregateInput
    _sum?: StudentSubmissionSumOrderByAggregateInput
  }

  export type StudentSubmissionScalarWhereWithAggregatesInput = {
    AND?: StudentSubmissionScalarWhereWithAggregatesInput | StudentSubmissionScalarWhereWithAggregatesInput[]
    OR?: StudentSubmissionScalarWhereWithAggregatesInput[]
    NOT?: StudentSubmissionScalarWhereWithAggregatesInput | StudentSubmissionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StudentSubmission"> | string
    studentId?: StringWithAggregatesFilter<"StudentSubmission"> | string
    lessonId?: StringWithAggregatesFilter<"StudentSubmission"> | string
    type?: EnumSubmissionTypeWithAggregatesFilter<"StudentSubmission"> | $Enums.SubmissionType
    content?: StringNullableWithAggregatesFilter<"StudentSubmission"> | string | null
    grade?: FloatNullableWithAggregatesFilter<"StudentSubmission"> | number | null
    submittedAt?: DateTimeWithAggregatesFilter<"StudentSubmission"> | Date | string
  }

  export type LabInstanceWhereInput = {
    AND?: LabInstanceWhereInput | LabInstanceWhereInput[]
    OR?: LabInstanceWhereInput[]
    NOT?: LabInstanceWhereInput | LabInstanceWhereInput[]
    id?: StringFilter<"LabInstance"> | string
    studentId?: StringFilter<"LabInstance"> | string
    lessonId?: StringFilter<"LabInstance"> | string
    url?: StringNullableFilter<"LabInstance"> | string | null
    containerId?: StringNullableFilter<"LabInstance"> | string | null
    state?: EnumLabStateFilter<"LabInstance"> | $Enums.LabState
    config?: JsonNullableFilter<"LabInstance">
    apiLastRun?: JsonNullableFilter<"LabInstance">
    uiLastRun?: JsonNullableFilter<"LabInstance">
    createdAt?: DateTimeFilter<"LabInstance"> | Date | string
    updatedAt?: DateTimeFilter<"LabInstance"> | Date | string
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }

  export type LabInstanceOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    url?: SortOrderInput | SortOrder
    containerId?: SortOrderInput | SortOrder
    state?: SortOrder
    config?: SortOrderInput | SortOrder
    apiLastRun?: SortOrderInput | SortOrder
    uiLastRun?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    student?: StudentOrderByWithRelationInput
    _relevance?: LabInstanceOrderByRelevanceInput
  }

  export type LabInstanceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    studentId_lessonId?: LabInstanceStudentIdLessonIdCompoundUniqueInput
    AND?: LabInstanceWhereInput | LabInstanceWhereInput[]
    OR?: LabInstanceWhereInput[]
    NOT?: LabInstanceWhereInput | LabInstanceWhereInput[]
    studentId?: StringFilter<"LabInstance"> | string
    lessonId?: StringFilter<"LabInstance"> | string
    url?: StringNullableFilter<"LabInstance"> | string | null
    containerId?: StringNullableFilter<"LabInstance"> | string | null
    state?: EnumLabStateFilter<"LabInstance"> | $Enums.LabState
    config?: JsonNullableFilter<"LabInstance">
    apiLastRun?: JsonNullableFilter<"LabInstance">
    uiLastRun?: JsonNullableFilter<"LabInstance">
    createdAt?: DateTimeFilter<"LabInstance"> | Date | string
    updatedAt?: DateTimeFilter<"LabInstance"> | Date | string
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }, "id" | "studentId_lessonId">

  export type LabInstanceOrderByWithAggregationInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    url?: SortOrderInput | SortOrder
    containerId?: SortOrderInput | SortOrder
    state?: SortOrder
    config?: SortOrderInput | SortOrder
    apiLastRun?: SortOrderInput | SortOrder
    uiLastRun?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LabInstanceCountOrderByAggregateInput
    _max?: LabInstanceMaxOrderByAggregateInput
    _min?: LabInstanceMinOrderByAggregateInput
  }

  export type LabInstanceScalarWhereWithAggregatesInput = {
    AND?: LabInstanceScalarWhereWithAggregatesInput | LabInstanceScalarWhereWithAggregatesInput[]
    OR?: LabInstanceScalarWhereWithAggregatesInput[]
    NOT?: LabInstanceScalarWhereWithAggregatesInput | LabInstanceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LabInstance"> | string
    studentId?: StringWithAggregatesFilter<"LabInstance"> | string
    lessonId?: StringWithAggregatesFilter<"LabInstance"> | string
    url?: StringNullableWithAggregatesFilter<"LabInstance"> | string | null
    containerId?: StringNullableWithAggregatesFilter<"LabInstance"> | string | null
    state?: EnumLabStateWithAggregatesFilter<"LabInstance"> | $Enums.LabState
    config?: JsonNullableWithAggregatesFilter<"LabInstance">
    apiLastRun?: JsonNullableWithAggregatesFilter<"LabInstance">
    uiLastRun?: JsonNullableWithAggregatesFilter<"LabInstance">
    createdAt?: DateTimeWithAggregatesFilter<"LabInstance"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LabInstance"> | Date | string
  }

  export type QuizAttemptWhereInput = {
    AND?: QuizAttemptWhereInput | QuizAttemptWhereInput[]
    OR?: QuizAttemptWhereInput[]
    NOT?: QuizAttemptWhereInput | QuizAttemptWhereInput[]
    id?: StringFilter<"QuizAttempt"> | string
    studentId?: StringFilter<"QuizAttempt"> | string
    lessonId?: StringFilter<"QuizAttempt"> | string
    answers?: JsonFilter<"QuizAttempt">
    score?: FloatNullableFilter<"QuizAttempt"> | number | null
    startedAt?: DateTimeFilter<"QuizAttempt"> | Date | string
    submittedAt?: DateTimeNullableFilter<"QuizAttempt"> | Date | string | null
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }

  export type QuizAttemptOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    answers?: SortOrder
    score?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    submittedAt?: SortOrderInput | SortOrder
    student?: StudentOrderByWithRelationInput
    _relevance?: QuizAttemptOrderByRelevanceInput
  }

  export type QuizAttemptWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuizAttemptWhereInput | QuizAttemptWhereInput[]
    OR?: QuizAttemptWhereInput[]
    NOT?: QuizAttemptWhereInput | QuizAttemptWhereInput[]
    studentId?: StringFilter<"QuizAttempt"> | string
    lessonId?: StringFilter<"QuizAttempt"> | string
    answers?: JsonFilter<"QuizAttempt">
    score?: FloatNullableFilter<"QuizAttempt"> | number | null
    startedAt?: DateTimeFilter<"QuizAttempt"> | Date | string
    submittedAt?: DateTimeNullableFilter<"QuizAttempt"> | Date | string | null
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }, "id">

  export type QuizAttemptOrderByWithAggregationInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    answers?: SortOrder
    score?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    submittedAt?: SortOrderInput | SortOrder
    _count?: QuizAttemptCountOrderByAggregateInput
    _avg?: QuizAttemptAvgOrderByAggregateInput
    _max?: QuizAttemptMaxOrderByAggregateInput
    _min?: QuizAttemptMinOrderByAggregateInput
    _sum?: QuizAttemptSumOrderByAggregateInput
  }

  export type QuizAttemptScalarWhereWithAggregatesInput = {
    AND?: QuizAttemptScalarWhereWithAggregatesInput | QuizAttemptScalarWhereWithAggregatesInput[]
    OR?: QuizAttemptScalarWhereWithAggregatesInput[]
    NOT?: QuizAttemptScalarWhereWithAggregatesInput | QuizAttemptScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"QuizAttempt"> | string
    studentId?: StringWithAggregatesFilter<"QuizAttempt"> | string
    lessonId?: StringWithAggregatesFilter<"QuizAttempt"> | string
    answers?: JsonWithAggregatesFilter<"QuizAttempt">
    score?: FloatNullableWithAggregatesFilter<"QuizAttempt"> | number | null
    startedAt?: DateTimeWithAggregatesFilter<"QuizAttempt"> | Date | string
    submittedAt?: DateTimeNullableWithAggregatesFilter<"QuizAttempt"> | Date | string | null
  }

  export type StudentCreateInput = {
    id?: string
    userId?: string | null
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    courses?: StudentCourseCreateNestedManyWithoutStudentInput
    lessonProgress?: LessonProgressCreateNestedManyWithoutStudentInput
    submissions?: StudentSubmissionCreateNestedManyWithoutStudentInput
    labs?: LabInstanceCreateNestedManyWithoutStudentInput
    quizzes?: QuizAttemptCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateInput = {
    id?: string
    userId?: string | null
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    courses?: StudentCourseUncheckedCreateNestedManyWithoutStudentInput
    lessonProgress?: LessonProgressUncheckedCreateNestedManyWithoutStudentInput
    submissions?: StudentSubmissionUncheckedCreateNestedManyWithoutStudentInput
    labs?: LabInstanceUncheckedCreateNestedManyWithoutStudentInput
    quizzes?: QuizAttemptUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courses?: StudentCourseUpdateManyWithoutStudentNestedInput
    lessonProgress?: LessonProgressUpdateManyWithoutStudentNestedInput
    submissions?: StudentSubmissionUpdateManyWithoutStudentNestedInput
    labs?: LabInstanceUpdateManyWithoutStudentNestedInput
    quizzes?: QuizAttemptUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courses?: StudentCourseUncheckedUpdateManyWithoutStudentNestedInput
    lessonProgress?: LessonProgressUncheckedUpdateManyWithoutStudentNestedInput
    submissions?: StudentSubmissionUncheckedUpdateManyWithoutStudentNestedInput
    labs?: LabInstanceUncheckedUpdateManyWithoutStudentNestedInput
    quizzes?: QuizAttemptUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentCreateManyInput = {
    id?: string
    userId?: string | null
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentCourseCreateInput = {
    id?: string
    courseId: string
    completed?: boolean
    progress?: number | null
    enrolledAt?: Date | string
    student: StudentCreateNestedOneWithoutCoursesInput
  }

  export type StudentCourseUncheckedCreateInput = {
    id?: string
    studentId: string
    courseId: string
    completed?: boolean
    progress?: number | null
    enrolledAt?: Date | string
  }

  export type StudentCourseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: NullableIntFieldUpdateOperationsInput | number | null
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUpdateOneRequiredWithoutCoursesNestedInput
  }

  export type StudentCourseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: NullableIntFieldUpdateOperationsInput | number | null
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentCourseCreateManyInput = {
    id?: string
    studentId: string
    courseId: string
    completed?: boolean
    progress?: number | null
    enrolledAt?: Date | string
  }

  export type StudentCourseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: NullableIntFieldUpdateOperationsInput | number | null
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentCourseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: NullableIntFieldUpdateOperationsInput | number | null
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LessonProgressCreateInput = {
    id?: string
    lessonId: string
    status?: $Enums.LessonStatus
    score?: number | null
    startedAt?: Date | string | null
    updatedAt?: Date | string | null
    completedAt?: Date | string | null
    student: StudentCreateNestedOneWithoutLessonProgressInput
  }

  export type LessonProgressUncheckedCreateInput = {
    id?: string
    studentId: string
    lessonId: string
    status?: $Enums.LessonStatus
    score?: number | null
    startedAt?: Date | string | null
    updatedAt?: Date | string | null
    completedAt?: Date | string | null
  }

  export type LessonProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    status?: EnumLessonStatusFieldUpdateOperationsInput | $Enums.LessonStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    student?: StudentUpdateOneRequiredWithoutLessonProgressNestedInput
  }

  export type LessonProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    status?: EnumLessonStatusFieldUpdateOperationsInput | $Enums.LessonStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LessonProgressCreateManyInput = {
    id?: string
    studentId: string
    lessonId: string
    status?: $Enums.LessonStatus
    score?: number | null
    startedAt?: Date | string | null
    updatedAt?: Date | string | null
    completedAt?: Date | string | null
  }

  export type LessonProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    status?: EnumLessonStatusFieldUpdateOperationsInput | $Enums.LessonStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LessonProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    status?: EnumLessonStatusFieldUpdateOperationsInput | $Enums.LessonStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StudentSubmissionCreateInput = {
    id?: string
    lessonId: string
    type: $Enums.SubmissionType
    content?: string | null
    grade?: number | null
    submittedAt?: Date | string
    student: StudentCreateNestedOneWithoutSubmissionsInput
  }

  export type StudentSubmissionUncheckedCreateInput = {
    id?: string
    studentId: string
    lessonId: string
    type: $Enums.SubmissionType
    content?: string | null
    grade?: number | null
    submittedAt?: Date | string
  }

  export type StudentSubmissionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    type?: EnumSubmissionTypeFieldUpdateOperationsInput | $Enums.SubmissionType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    grade?: NullableFloatFieldUpdateOperationsInput | number | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUpdateOneRequiredWithoutSubmissionsNestedInput
  }

  export type StudentSubmissionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    type?: EnumSubmissionTypeFieldUpdateOperationsInput | $Enums.SubmissionType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    grade?: NullableFloatFieldUpdateOperationsInput | number | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentSubmissionCreateManyInput = {
    id?: string
    studentId: string
    lessonId: string
    type: $Enums.SubmissionType
    content?: string | null
    grade?: number | null
    submittedAt?: Date | string
  }

  export type StudentSubmissionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    type?: EnumSubmissionTypeFieldUpdateOperationsInput | $Enums.SubmissionType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    grade?: NullableFloatFieldUpdateOperationsInput | number | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentSubmissionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    type?: EnumSubmissionTypeFieldUpdateOperationsInput | $Enums.SubmissionType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    grade?: NullableFloatFieldUpdateOperationsInput | number | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabInstanceCreateInput = {
    id?: string
    lessonId: string
    url?: string | null
    containerId?: string | null
    state?: $Enums.LabState
    config?: NullableJsonNullValueInput | InputJsonValue
    apiLastRun?: NullableJsonNullValueInput | InputJsonValue
    uiLastRun?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    student: StudentCreateNestedOneWithoutLabsInput
  }

  export type LabInstanceUncheckedCreateInput = {
    id?: string
    studentId: string
    lessonId: string
    url?: string | null
    containerId?: string | null
    state?: $Enums.LabState
    config?: NullableJsonNullValueInput | InputJsonValue
    apiLastRun?: NullableJsonNullValueInput | InputJsonValue
    uiLastRun?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LabInstanceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    state?: EnumLabStateFieldUpdateOperationsInput | $Enums.LabState
    config?: NullableJsonNullValueInput | InputJsonValue
    apiLastRun?: NullableJsonNullValueInput | InputJsonValue
    uiLastRun?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUpdateOneRequiredWithoutLabsNestedInput
  }

  export type LabInstanceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    state?: EnumLabStateFieldUpdateOperationsInput | $Enums.LabState
    config?: NullableJsonNullValueInput | InputJsonValue
    apiLastRun?: NullableJsonNullValueInput | InputJsonValue
    uiLastRun?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabInstanceCreateManyInput = {
    id?: string
    studentId: string
    lessonId: string
    url?: string | null
    containerId?: string | null
    state?: $Enums.LabState
    config?: NullableJsonNullValueInput | InputJsonValue
    apiLastRun?: NullableJsonNullValueInput | InputJsonValue
    uiLastRun?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LabInstanceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    state?: EnumLabStateFieldUpdateOperationsInput | $Enums.LabState
    config?: NullableJsonNullValueInput | InputJsonValue
    apiLastRun?: NullableJsonNullValueInput | InputJsonValue
    uiLastRun?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabInstanceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    state?: EnumLabStateFieldUpdateOperationsInput | $Enums.LabState
    config?: NullableJsonNullValueInput | InputJsonValue
    apiLastRun?: NullableJsonNullValueInput | InputJsonValue
    uiLastRun?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizAttemptCreateInput = {
    id?: string
    lessonId: string
    answers: JsonNullValueInput | InputJsonValue
    score?: number | null
    startedAt?: Date | string
    submittedAt?: Date | string | null
    student: StudentCreateNestedOneWithoutQuizzesInput
  }

  export type QuizAttemptUncheckedCreateInput = {
    id?: string
    studentId: string
    lessonId: string
    answers: JsonNullValueInput | InputJsonValue
    score?: number | null
    startedAt?: Date | string
    submittedAt?: Date | string | null
  }

  export type QuizAttemptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    student?: StudentUpdateOneRequiredWithoutQuizzesNestedInput
  }

  export type QuizAttemptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type QuizAttemptCreateManyInput = {
    id?: string
    studentId: string
    lessonId: string
    answers: JsonNullValueInput | InputJsonValue
    score?: number | null
    startedAt?: Date | string
    submittedAt?: Date | string | null
  }

  export type QuizAttemptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type QuizAttemptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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
    search?: string
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
    search?: string
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

  export type StudentCourseListRelationFilter = {
    every?: StudentCourseWhereInput
    some?: StudentCourseWhereInput
    none?: StudentCourseWhereInput
  }

  export type LessonProgressListRelationFilter = {
    every?: LessonProgressWhereInput
    some?: LessonProgressWhereInput
    none?: LessonProgressWhereInput
  }

  export type StudentSubmissionListRelationFilter = {
    every?: StudentSubmissionWhereInput
    some?: StudentSubmissionWhereInput
    none?: StudentSubmissionWhereInput
  }

  export type LabInstanceListRelationFilter = {
    every?: LabInstanceWhereInput
    some?: LabInstanceWhereInput
    none?: LabInstanceWhereInput
  }

  export type QuizAttemptListRelationFilter = {
    every?: QuizAttemptWhereInput
    some?: QuizAttemptWhereInput
    none?: QuizAttemptWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type StudentCourseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LessonProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StudentSubmissionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LabInstanceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuizAttemptOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StudentOrderByRelevanceInput = {
    fields: StudentOrderByRelevanceFieldEnum | StudentOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
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
    search?: string
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
    search?: string
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StudentScalarRelationFilter = {
    is?: StudentWhereInput
    isNot?: StudentWhereInput
  }

  export type StudentCourseOrderByRelevanceInput = {
    fields: StudentCourseOrderByRelevanceFieldEnum | StudentCourseOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type StudentCourseStudentIdCourseIdCompoundUniqueInput = {
    studentId: string
    courseId: string
  }

  export type StudentCourseCountOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    completed?: SortOrder
    progress?: SortOrder
    enrolledAt?: SortOrder
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
  }

  export type StudentCourseMinOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    courseId?: SortOrder
    completed?: SortOrder
    progress?: SortOrder
    enrolledAt?: SortOrder
  }

  export type StudentCourseSumOrderByAggregateInput = {
    progress?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumLessonStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LessonStatus | EnumLessonStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LessonStatus[]
    notIn?: $Enums.LessonStatus[]
    not?: NestedEnumLessonStatusFilter<$PrismaModel> | $Enums.LessonStatus
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

  export type LessonProgressOrderByRelevanceInput = {
    fields: LessonProgressOrderByRelevanceFieldEnum | LessonProgressOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type LessonProgressStudentIdLessonIdCompoundUniqueInput = {
    studentId: string
    lessonId: string
  }

  export type LessonProgressCountOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    status?: SortOrder
    score?: SortOrder
    startedAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type LessonProgressAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type LessonProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    status?: SortOrder
    score?: SortOrder
    startedAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type LessonProgressMinOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    status?: SortOrder
    score?: SortOrder
    startedAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type LessonProgressSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type EnumLessonStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LessonStatus | EnumLessonStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LessonStatus[]
    notIn?: $Enums.LessonStatus[]
    not?: NestedEnumLessonStatusWithAggregatesFilter<$PrismaModel> | $Enums.LessonStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLessonStatusFilter<$PrismaModel>
    _max?: NestedEnumLessonStatusFilter<$PrismaModel>
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

  export type EnumSubmissionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SubmissionType | EnumSubmissionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SubmissionType[]
    notIn?: $Enums.SubmissionType[]
    not?: NestedEnumSubmissionTypeFilter<$PrismaModel> | $Enums.SubmissionType
  }

  export type StudentSubmissionOrderByRelevanceInput = {
    fields: StudentSubmissionOrderByRelevanceFieldEnum | StudentSubmissionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type StudentSubmissionCountOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    type?: SortOrder
    content?: SortOrder
    grade?: SortOrder
    submittedAt?: SortOrder
  }

  export type StudentSubmissionAvgOrderByAggregateInput = {
    grade?: SortOrder
  }

  export type StudentSubmissionMaxOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    type?: SortOrder
    content?: SortOrder
    grade?: SortOrder
    submittedAt?: SortOrder
  }

  export type StudentSubmissionMinOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    type?: SortOrder
    content?: SortOrder
    grade?: SortOrder
    submittedAt?: SortOrder
  }

  export type StudentSubmissionSumOrderByAggregateInput = {
    grade?: SortOrder
  }

  export type EnumSubmissionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubmissionType | EnumSubmissionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SubmissionType[]
    notIn?: $Enums.SubmissionType[]
    not?: NestedEnumSubmissionTypeWithAggregatesFilter<$PrismaModel> | $Enums.SubmissionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubmissionTypeFilter<$PrismaModel>
    _max?: NestedEnumSubmissionTypeFilter<$PrismaModel>
  }

  export type EnumLabStateFilter<$PrismaModel = never> = {
    equals?: $Enums.LabState | EnumLabStateFieldRefInput<$PrismaModel>
    in?: $Enums.LabState[]
    notIn?: $Enums.LabState[]
    not?: NestedEnumLabStateFilter<$PrismaModel> | $Enums.LabState
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type LabInstanceOrderByRelevanceInput = {
    fields: LabInstanceOrderByRelevanceFieldEnum | LabInstanceOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type LabInstanceStudentIdLessonIdCompoundUniqueInput = {
    studentId: string
    lessonId: string
  }

  export type LabInstanceCountOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    url?: SortOrder
    containerId?: SortOrder
    state?: SortOrder
    config?: SortOrder
    apiLastRun?: SortOrder
    uiLastRun?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LabInstanceMaxOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    url?: SortOrder
    containerId?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LabInstanceMinOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    url?: SortOrder
    containerId?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumLabStateWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LabState | EnumLabStateFieldRefInput<$PrismaModel>
    in?: $Enums.LabState[]
    notIn?: $Enums.LabState[]
    not?: NestedEnumLabStateWithAggregatesFilter<$PrismaModel> | $Enums.LabState
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLabStateFilter<$PrismaModel>
    _max?: NestedEnumLabStateFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type QuizAttemptOrderByRelevanceInput = {
    fields: QuizAttemptOrderByRelevanceFieldEnum | QuizAttemptOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type QuizAttemptCountOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    answers?: SortOrder
    score?: SortOrder
    startedAt?: SortOrder
    submittedAt?: SortOrder
  }

  export type QuizAttemptAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type QuizAttemptMaxOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    score?: SortOrder
    startedAt?: SortOrder
    submittedAt?: SortOrder
  }

  export type QuizAttemptMinOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    lessonId?: SortOrder
    score?: SortOrder
    startedAt?: SortOrder
    submittedAt?: SortOrder
  }

  export type QuizAttemptSumOrderByAggregateInput = {
    score?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type StudentCourseCreateNestedManyWithoutStudentInput = {
    create?: XOR<StudentCourseCreateWithoutStudentInput, StudentCourseUncheckedCreateWithoutStudentInput> | StudentCourseCreateWithoutStudentInput[] | StudentCourseUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentCourseCreateOrConnectWithoutStudentInput | StudentCourseCreateOrConnectWithoutStudentInput[]
    createMany?: StudentCourseCreateManyStudentInputEnvelope
    connect?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
  }

  export type LessonProgressCreateNestedManyWithoutStudentInput = {
    create?: XOR<LessonProgressCreateWithoutStudentInput, LessonProgressUncheckedCreateWithoutStudentInput> | LessonProgressCreateWithoutStudentInput[] | LessonProgressUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: LessonProgressCreateOrConnectWithoutStudentInput | LessonProgressCreateOrConnectWithoutStudentInput[]
    createMany?: LessonProgressCreateManyStudentInputEnvelope
    connect?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
  }

  export type StudentSubmissionCreateNestedManyWithoutStudentInput = {
    create?: XOR<StudentSubmissionCreateWithoutStudentInput, StudentSubmissionUncheckedCreateWithoutStudentInput> | StudentSubmissionCreateWithoutStudentInput[] | StudentSubmissionUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentSubmissionCreateOrConnectWithoutStudentInput | StudentSubmissionCreateOrConnectWithoutStudentInput[]
    createMany?: StudentSubmissionCreateManyStudentInputEnvelope
    connect?: StudentSubmissionWhereUniqueInput | StudentSubmissionWhereUniqueInput[]
  }

  export type LabInstanceCreateNestedManyWithoutStudentInput = {
    create?: XOR<LabInstanceCreateWithoutStudentInput, LabInstanceUncheckedCreateWithoutStudentInput> | LabInstanceCreateWithoutStudentInput[] | LabInstanceUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: LabInstanceCreateOrConnectWithoutStudentInput | LabInstanceCreateOrConnectWithoutStudentInput[]
    createMany?: LabInstanceCreateManyStudentInputEnvelope
    connect?: LabInstanceWhereUniqueInput | LabInstanceWhereUniqueInput[]
  }

  export type QuizAttemptCreateNestedManyWithoutStudentInput = {
    create?: XOR<QuizAttemptCreateWithoutStudentInput, QuizAttemptUncheckedCreateWithoutStudentInput> | QuizAttemptCreateWithoutStudentInput[] | QuizAttemptUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: QuizAttemptCreateOrConnectWithoutStudentInput | QuizAttemptCreateOrConnectWithoutStudentInput[]
    createMany?: QuizAttemptCreateManyStudentInputEnvelope
    connect?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
  }

  export type StudentCourseUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<StudentCourseCreateWithoutStudentInput, StudentCourseUncheckedCreateWithoutStudentInput> | StudentCourseCreateWithoutStudentInput[] | StudentCourseUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentCourseCreateOrConnectWithoutStudentInput | StudentCourseCreateOrConnectWithoutStudentInput[]
    createMany?: StudentCourseCreateManyStudentInputEnvelope
    connect?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
  }

  export type LessonProgressUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<LessonProgressCreateWithoutStudentInput, LessonProgressUncheckedCreateWithoutStudentInput> | LessonProgressCreateWithoutStudentInput[] | LessonProgressUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: LessonProgressCreateOrConnectWithoutStudentInput | LessonProgressCreateOrConnectWithoutStudentInput[]
    createMany?: LessonProgressCreateManyStudentInputEnvelope
    connect?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
  }

  export type StudentSubmissionUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<StudentSubmissionCreateWithoutStudentInput, StudentSubmissionUncheckedCreateWithoutStudentInput> | StudentSubmissionCreateWithoutStudentInput[] | StudentSubmissionUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentSubmissionCreateOrConnectWithoutStudentInput | StudentSubmissionCreateOrConnectWithoutStudentInput[]
    createMany?: StudentSubmissionCreateManyStudentInputEnvelope
    connect?: StudentSubmissionWhereUniqueInput | StudentSubmissionWhereUniqueInput[]
  }

  export type LabInstanceUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<LabInstanceCreateWithoutStudentInput, LabInstanceUncheckedCreateWithoutStudentInput> | LabInstanceCreateWithoutStudentInput[] | LabInstanceUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: LabInstanceCreateOrConnectWithoutStudentInput | LabInstanceCreateOrConnectWithoutStudentInput[]
    createMany?: LabInstanceCreateManyStudentInputEnvelope
    connect?: LabInstanceWhereUniqueInput | LabInstanceWhereUniqueInput[]
  }

  export type QuizAttemptUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<QuizAttemptCreateWithoutStudentInput, QuizAttemptUncheckedCreateWithoutStudentInput> | QuizAttemptCreateWithoutStudentInput[] | QuizAttemptUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: QuizAttemptCreateOrConnectWithoutStudentInput | QuizAttemptCreateOrConnectWithoutStudentInput[]
    createMany?: QuizAttemptCreateManyStudentInputEnvelope
    connect?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
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

  export type StudentCourseUpdateManyWithoutStudentNestedInput = {
    create?: XOR<StudentCourseCreateWithoutStudentInput, StudentCourseUncheckedCreateWithoutStudentInput> | StudentCourseCreateWithoutStudentInput[] | StudentCourseUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentCourseCreateOrConnectWithoutStudentInput | StudentCourseCreateOrConnectWithoutStudentInput[]
    upsert?: StudentCourseUpsertWithWhereUniqueWithoutStudentInput | StudentCourseUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: StudentCourseCreateManyStudentInputEnvelope
    set?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
    disconnect?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
    delete?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
    connect?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
    update?: StudentCourseUpdateWithWhereUniqueWithoutStudentInput | StudentCourseUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: StudentCourseUpdateManyWithWhereWithoutStudentInput | StudentCourseUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: StudentCourseScalarWhereInput | StudentCourseScalarWhereInput[]
  }

  export type LessonProgressUpdateManyWithoutStudentNestedInput = {
    create?: XOR<LessonProgressCreateWithoutStudentInput, LessonProgressUncheckedCreateWithoutStudentInput> | LessonProgressCreateWithoutStudentInput[] | LessonProgressUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: LessonProgressCreateOrConnectWithoutStudentInput | LessonProgressCreateOrConnectWithoutStudentInput[]
    upsert?: LessonProgressUpsertWithWhereUniqueWithoutStudentInput | LessonProgressUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: LessonProgressCreateManyStudentInputEnvelope
    set?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    disconnect?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    delete?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    connect?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    update?: LessonProgressUpdateWithWhereUniqueWithoutStudentInput | LessonProgressUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: LessonProgressUpdateManyWithWhereWithoutStudentInput | LessonProgressUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: LessonProgressScalarWhereInput | LessonProgressScalarWhereInput[]
  }

  export type StudentSubmissionUpdateManyWithoutStudentNestedInput = {
    create?: XOR<StudentSubmissionCreateWithoutStudentInput, StudentSubmissionUncheckedCreateWithoutStudentInput> | StudentSubmissionCreateWithoutStudentInput[] | StudentSubmissionUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentSubmissionCreateOrConnectWithoutStudentInput | StudentSubmissionCreateOrConnectWithoutStudentInput[]
    upsert?: StudentSubmissionUpsertWithWhereUniqueWithoutStudentInput | StudentSubmissionUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: StudentSubmissionCreateManyStudentInputEnvelope
    set?: StudentSubmissionWhereUniqueInput | StudentSubmissionWhereUniqueInput[]
    disconnect?: StudentSubmissionWhereUniqueInput | StudentSubmissionWhereUniqueInput[]
    delete?: StudentSubmissionWhereUniqueInput | StudentSubmissionWhereUniqueInput[]
    connect?: StudentSubmissionWhereUniqueInput | StudentSubmissionWhereUniqueInput[]
    update?: StudentSubmissionUpdateWithWhereUniqueWithoutStudentInput | StudentSubmissionUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: StudentSubmissionUpdateManyWithWhereWithoutStudentInput | StudentSubmissionUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: StudentSubmissionScalarWhereInput | StudentSubmissionScalarWhereInput[]
  }

  export type LabInstanceUpdateManyWithoutStudentNestedInput = {
    create?: XOR<LabInstanceCreateWithoutStudentInput, LabInstanceUncheckedCreateWithoutStudentInput> | LabInstanceCreateWithoutStudentInput[] | LabInstanceUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: LabInstanceCreateOrConnectWithoutStudentInput | LabInstanceCreateOrConnectWithoutStudentInput[]
    upsert?: LabInstanceUpsertWithWhereUniqueWithoutStudentInput | LabInstanceUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: LabInstanceCreateManyStudentInputEnvelope
    set?: LabInstanceWhereUniqueInput | LabInstanceWhereUniqueInput[]
    disconnect?: LabInstanceWhereUniqueInput | LabInstanceWhereUniqueInput[]
    delete?: LabInstanceWhereUniqueInput | LabInstanceWhereUniqueInput[]
    connect?: LabInstanceWhereUniqueInput | LabInstanceWhereUniqueInput[]
    update?: LabInstanceUpdateWithWhereUniqueWithoutStudentInput | LabInstanceUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: LabInstanceUpdateManyWithWhereWithoutStudentInput | LabInstanceUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: LabInstanceScalarWhereInput | LabInstanceScalarWhereInput[]
  }

  export type QuizAttemptUpdateManyWithoutStudentNestedInput = {
    create?: XOR<QuizAttemptCreateWithoutStudentInput, QuizAttemptUncheckedCreateWithoutStudentInput> | QuizAttemptCreateWithoutStudentInput[] | QuizAttemptUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: QuizAttemptCreateOrConnectWithoutStudentInput | QuizAttemptCreateOrConnectWithoutStudentInput[]
    upsert?: QuizAttemptUpsertWithWhereUniqueWithoutStudentInput | QuizAttemptUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: QuizAttemptCreateManyStudentInputEnvelope
    set?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
    disconnect?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
    delete?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
    connect?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
    update?: QuizAttemptUpdateWithWhereUniqueWithoutStudentInput | QuizAttemptUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: QuizAttemptUpdateManyWithWhereWithoutStudentInput | QuizAttemptUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: QuizAttemptScalarWhereInput | QuizAttemptScalarWhereInput[]
  }

  export type StudentCourseUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<StudentCourseCreateWithoutStudentInput, StudentCourseUncheckedCreateWithoutStudentInput> | StudentCourseCreateWithoutStudentInput[] | StudentCourseUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentCourseCreateOrConnectWithoutStudentInput | StudentCourseCreateOrConnectWithoutStudentInput[]
    upsert?: StudentCourseUpsertWithWhereUniqueWithoutStudentInput | StudentCourseUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: StudentCourseCreateManyStudentInputEnvelope
    set?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
    disconnect?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
    delete?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
    connect?: StudentCourseWhereUniqueInput | StudentCourseWhereUniqueInput[]
    update?: StudentCourseUpdateWithWhereUniqueWithoutStudentInput | StudentCourseUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: StudentCourseUpdateManyWithWhereWithoutStudentInput | StudentCourseUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: StudentCourseScalarWhereInput | StudentCourseScalarWhereInput[]
  }

  export type LessonProgressUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<LessonProgressCreateWithoutStudentInput, LessonProgressUncheckedCreateWithoutStudentInput> | LessonProgressCreateWithoutStudentInput[] | LessonProgressUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: LessonProgressCreateOrConnectWithoutStudentInput | LessonProgressCreateOrConnectWithoutStudentInput[]
    upsert?: LessonProgressUpsertWithWhereUniqueWithoutStudentInput | LessonProgressUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: LessonProgressCreateManyStudentInputEnvelope
    set?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    disconnect?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    delete?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    connect?: LessonProgressWhereUniqueInput | LessonProgressWhereUniqueInput[]
    update?: LessonProgressUpdateWithWhereUniqueWithoutStudentInput | LessonProgressUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: LessonProgressUpdateManyWithWhereWithoutStudentInput | LessonProgressUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: LessonProgressScalarWhereInput | LessonProgressScalarWhereInput[]
  }

  export type StudentSubmissionUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<StudentSubmissionCreateWithoutStudentInput, StudentSubmissionUncheckedCreateWithoutStudentInput> | StudentSubmissionCreateWithoutStudentInput[] | StudentSubmissionUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentSubmissionCreateOrConnectWithoutStudentInput | StudentSubmissionCreateOrConnectWithoutStudentInput[]
    upsert?: StudentSubmissionUpsertWithWhereUniqueWithoutStudentInput | StudentSubmissionUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: StudentSubmissionCreateManyStudentInputEnvelope
    set?: StudentSubmissionWhereUniqueInput | StudentSubmissionWhereUniqueInput[]
    disconnect?: StudentSubmissionWhereUniqueInput | StudentSubmissionWhereUniqueInput[]
    delete?: StudentSubmissionWhereUniqueInput | StudentSubmissionWhereUniqueInput[]
    connect?: StudentSubmissionWhereUniqueInput | StudentSubmissionWhereUniqueInput[]
    update?: StudentSubmissionUpdateWithWhereUniqueWithoutStudentInput | StudentSubmissionUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: StudentSubmissionUpdateManyWithWhereWithoutStudentInput | StudentSubmissionUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: StudentSubmissionScalarWhereInput | StudentSubmissionScalarWhereInput[]
  }

  export type LabInstanceUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<LabInstanceCreateWithoutStudentInput, LabInstanceUncheckedCreateWithoutStudentInput> | LabInstanceCreateWithoutStudentInput[] | LabInstanceUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: LabInstanceCreateOrConnectWithoutStudentInput | LabInstanceCreateOrConnectWithoutStudentInput[]
    upsert?: LabInstanceUpsertWithWhereUniqueWithoutStudentInput | LabInstanceUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: LabInstanceCreateManyStudentInputEnvelope
    set?: LabInstanceWhereUniqueInput | LabInstanceWhereUniqueInput[]
    disconnect?: LabInstanceWhereUniqueInput | LabInstanceWhereUniqueInput[]
    delete?: LabInstanceWhereUniqueInput | LabInstanceWhereUniqueInput[]
    connect?: LabInstanceWhereUniqueInput | LabInstanceWhereUniqueInput[]
    update?: LabInstanceUpdateWithWhereUniqueWithoutStudentInput | LabInstanceUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: LabInstanceUpdateManyWithWhereWithoutStudentInput | LabInstanceUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: LabInstanceScalarWhereInput | LabInstanceScalarWhereInput[]
  }

  export type QuizAttemptUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<QuizAttemptCreateWithoutStudentInput, QuizAttemptUncheckedCreateWithoutStudentInput> | QuizAttemptCreateWithoutStudentInput[] | QuizAttemptUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: QuizAttemptCreateOrConnectWithoutStudentInput | QuizAttemptCreateOrConnectWithoutStudentInput[]
    upsert?: QuizAttemptUpsertWithWhereUniqueWithoutStudentInput | QuizAttemptUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: QuizAttemptCreateManyStudentInputEnvelope
    set?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
    disconnect?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
    delete?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
    connect?: QuizAttemptWhereUniqueInput | QuizAttemptWhereUniqueInput[]
    update?: QuizAttemptUpdateWithWhereUniqueWithoutStudentInput | QuizAttemptUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: QuizAttemptUpdateManyWithWhereWithoutStudentInput | QuizAttemptUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: QuizAttemptScalarWhereInput | QuizAttemptScalarWhereInput[]
  }

  export type StudentCreateNestedOneWithoutCoursesInput = {
    create?: XOR<StudentCreateWithoutCoursesInput, StudentUncheckedCreateWithoutCoursesInput>
    connectOrCreate?: StudentCreateOrConnectWithoutCoursesInput
    connect?: StudentWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StudentUpdateOneRequiredWithoutCoursesNestedInput = {
    create?: XOR<StudentCreateWithoutCoursesInput, StudentUncheckedCreateWithoutCoursesInput>
    connectOrCreate?: StudentCreateOrConnectWithoutCoursesInput
    upsert?: StudentUpsertWithoutCoursesInput
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutCoursesInput, StudentUpdateWithoutCoursesInput>, StudentUncheckedUpdateWithoutCoursesInput>
  }

  export type StudentCreateNestedOneWithoutLessonProgressInput = {
    create?: XOR<StudentCreateWithoutLessonProgressInput, StudentUncheckedCreateWithoutLessonProgressInput>
    connectOrCreate?: StudentCreateOrConnectWithoutLessonProgressInput
    connect?: StudentWhereUniqueInput
  }

  export type EnumLessonStatusFieldUpdateOperationsInput = {
    set?: $Enums.LessonStatus
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type StudentUpdateOneRequiredWithoutLessonProgressNestedInput = {
    create?: XOR<StudentCreateWithoutLessonProgressInput, StudentUncheckedCreateWithoutLessonProgressInput>
    connectOrCreate?: StudentCreateOrConnectWithoutLessonProgressInput
    upsert?: StudentUpsertWithoutLessonProgressInput
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutLessonProgressInput, StudentUpdateWithoutLessonProgressInput>, StudentUncheckedUpdateWithoutLessonProgressInput>
  }

  export type StudentCreateNestedOneWithoutSubmissionsInput = {
    create?: XOR<StudentCreateWithoutSubmissionsInput, StudentUncheckedCreateWithoutSubmissionsInput>
    connectOrCreate?: StudentCreateOrConnectWithoutSubmissionsInput
    connect?: StudentWhereUniqueInput
  }

  export type EnumSubmissionTypeFieldUpdateOperationsInput = {
    set?: $Enums.SubmissionType
  }

  export type StudentUpdateOneRequiredWithoutSubmissionsNestedInput = {
    create?: XOR<StudentCreateWithoutSubmissionsInput, StudentUncheckedCreateWithoutSubmissionsInput>
    connectOrCreate?: StudentCreateOrConnectWithoutSubmissionsInput
    upsert?: StudentUpsertWithoutSubmissionsInput
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutSubmissionsInput, StudentUpdateWithoutSubmissionsInput>, StudentUncheckedUpdateWithoutSubmissionsInput>
  }

  export type StudentCreateNestedOneWithoutLabsInput = {
    create?: XOR<StudentCreateWithoutLabsInput, StudentUncheckedCreateWithoutLabsInput>
    connectOrCreate?: StudentCreateOrConnectWithoutLabsInput
    connect?: StudentWhereUniqueInput
  }

  export type EnumLabStateFieldUpdateOperationsInput = {
    set?: $Enums.LabState
  }

  export type StudentUpdateOneRequiredWithoutLabsNestedInput = {
    create?: XOR<StudentCreateWithoutLabsInput, StudentUncheckedCreateWithoutLabsInput>
    connectOrCreate?: StudentCreateOrConnectWithoutLabsInput
    upsert?: StudentUpsertWithoutLabsInput
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutLabsInput, StudentUpdateWithoutLabsInput>, StudentUncheckedUpdateWithoutLabsInput>
  }

  export type StudentCreateNestedOneWithoutQuizzesInput = {
    create?: XOR<StudentCreateWithoutQuizzesInput, StudentUncheckedCreateWithoutQuizzesInput>
    connectOrCreate?: StudentCreateOrConnectWithoutQuizzesInput
    connect?: StudentWhereUniqueInput
  }

  export type StudentUpdateOneRequiredWithoutQuizzesNestedInput = {
    create?: XOR<StudentCreateWithoutQuizzesInput, StudentUncheckedCreateWithoutQuizzesInput>
    connectOrCreate?: StudentCreateOrConnectWithoutQuizzesInput
    upsert?: StudentUpsertWithoutQuizzesInput
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutQuizzesInput, StudentUpdateWithoutQuizzesInput>, StudentUncheckedUpdateWithoutQuizzesInput>
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
    search?: string
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
    search?: string
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
    search?: string
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
    search?: string
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

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
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

  export type NestedEnumLessonStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LessonStatus | EnumLessonStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LessonStatus[]
    notIn?: $Enums.LessonStatus[]
    not?: NestedEnumLessonStatusFilter<$PrismaModel> | $Enums.LessonStatus
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

  export type NestedEnumLessonStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LessonStatus | EnumLessonStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LessonStatus[]
    notIn?: $Enums.LessonStatus[]
    not?: NestedEnumLessonStatusWithAggregatesFilter<$PrismaModel> | $Enums.LessonStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLessonStatusFilter<$PrismaModel>
    _max?: NestedEnumLessonStatusFilter<$PrismaModel>
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

  export type NestedEnumSubmissionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SubmissionType | EnumSubmissionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SubmissionType[]
    notIn?: $Enums.SubmissionType[]
    not?: NestedEnumSubmissionTypeFilter<$PrismaModel> | $Enums.SubmissionType
  }

  export type NestedEnumSubmissionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubmissionType | EnumSubmissionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SubmissionType[]
    notIn?: $Enums.SubmissionType[]
    not?: NestedEnumSubmissionTypeWithAggregatesFilter<$PrismaModel> | $Enums.SubmissionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubmissionTypeFilter<$PrismaModel>
    _max?: NestedEnumSubmissionTypeFilter<$PrismaModel>
  }

  export type NestedEnumLabStateFilter<$PrismaModel = never> = {
    equals?: $Enums.LabState | EnumLabStateFieldRefInput<$PrismaModel>
    in?: $Enums.LabState[]
    notIn?: $Enums.LabState[]
    not?: NestedEnumLabStateFilter<$PrismaModel> | $Enums.LabState
  }

  export type NestedEnumLabStateWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LabState | EnumLabStateFieldRefInput<$PrismaModel>
    in?: $Enums.LabState[]
    notIn?: $Enums.LabState[]
    not?: NestedEnumLabStateWithAggregatesFilter<$PrismaModel> | $Enums.LabState
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLabStateFilter<$PrismaModel>
    _max?: NestedEnumLabStateFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type StudentCourseCreateWithoutStudentInput = {
    id?: string
    courseId: string
    completed?: boolean
    progress?: number | null
    enrolledAt?: Date | string
  }

  export type StudentCourseUncheckedCreateWithoutStudentInput = {
    id?: string
    courseId: string
    completed?: boolean
    progress?: number | null
    enrolledAt?: Date | string
  }

  export type StudentCourseCreateOrConnectWithoutStudentInput = {
    where: StudentCourseWhereUniqueInput
    create: XOR<StudentCourseCreateWithoutStudentInput, StudentCourseUncheckedCreateWithoutStudentInput>
  }

  export type StudentCourseCreateManyStudentInputEnvelope = {
    data: StudentCourseCreateManyStudentInput | StudentCourseCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type LessonProgressCreateWithoutStudentInput = {
    id?: string
    lessonId: string
    status?: $Enums.LessonStatus
    score?: number | null
    startedAt?: Date | string | null
    updatedAt?: Date | string | null
    completedAt?: Date | string | null
  }

  export type LessonProgressUncheckedCreateWithoutStudentInput = {
    id?: string
    lessonId: string
    status?: $Enums.LessonStatus
    score?: number | null
    startedAt?: Date | string | null
    updatedAt?: Date | string | null
    completedAt?: Date | string | null
  }

  export type LessonProgressCreateOrConnectWithoutStudentInput = {
    where: LessonProgressWhereUniqueInput
    create: XOR<LessonProgressCreateWithoutStudentInput, LessonProgressUncheckedCreateWithoutStudentInput>
  }

  export type LessonProgressCreateManyStudentInputEnvelope = {
    data: LessonProgressCreateManyStudentInput | LessonProgressCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type StudentSubmissionCreateWithoutStudentInput = {
    id?: string
    lessonId: string
    type: $Enums.SubmissionType
    content?: string | null
    grade?: number | null
    submittedAt?: Date | string
  }

  export type StudentSubmissionUncheckedCreateWithoutStudentInput = {
    id?: string
    lessonId: string
    type: $Enums.SubmissionType
    content?: string | null
    grade?: number | null
    submittedAt?: Date | string
  }

  export type StudentSubmissionCreateOrConnectWithoutStudentInput = {
    where: StudentSubmissionWhereUniqueInput
    create: XOR<StudentSubmissionCreateWithoutStudentInput, StudentSubmissionUncheckedCreateWithoutStudentInput>
  }

  export type StudentSubmissionCreateManyStudentInputEnvelope = {
    data: StudentSubmissionCreateManyStudentInput | StudentSubmissionCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type LabInstanceCreateWithoutStudentInput = {
    id?: string
    lessonId: string
    url?: string | null
    containerId?: string | null
    state?: $Enums.LabState
    config?: NullableJsonNullValueInput | InputJsonValue
    apiLastRun?: NullableJsonNullValueInput | InputJsonValue
    uiLastRun?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LabInstanceUncheckedCreateWithoutStudentInput = {
    id?: string
    lessonId: string
    url?: string | null
    containerId?: string | null
    state?: $Enums.LabState
    config?: NullableJsonNullValueInput | InputJsonValue
    apiLastRun?: NullableJsonNullValueInput | InputJsonValue
    uiLastRun?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LabInstanceCreateOrConnectWithoutStudentInput = {
    where: LabInstanceWhereUniqueInput
    create: XOR<LabInstanceCreateWithoutStudentInput, LabInstanceUncheckedCreateWithoutStudentInput>
  }

  export type LabInstanceCreateManyStudentInputEnvelope = {
    data: LabInstanceCreateManyStudentInput | LabInstanceCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type QuizAttemptCreateWithoutStudentInput = {
    id?: string
    lessonId: string
    answers: JsonNullValueInput | InputJsonValue
    score?: number | null
    startedAt?: Date | string
    submittedAt?: Date | string | null
  }

  export type QuizAttemptUncheckedCreateWithoutStudentInput = {
    id?: string
    lessonId: string
    answers: JsonNullValueInput | InputJsonValue
    score?: number | null
    startedAt?: Date | string
    submittedAt?: Date | string | null
  }

  export type QuizAttemptCreateOrConnectWithoutStudentInput = {
    where: QuizAttemptWhereUniqueInput
    create: XOR<QuizAttemptCreateWithoutStudentInput, QuizAttemptUncheckedCreateWithoutStudentInput>
  }

  export type QuizAttemptCreateManyStudentInputEnvelope = {
    data: QuizAttemptCreateManyStudentInput | QuizAttemptCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type StudentCourseUpsertWithWhereUniqueWithoutStudentInput = {
    where: StudentCourseWhereUniqueInput
    update: XOR<StudentCourseUpdateWithoutStudentInput, StudentCourseUncheckedUpdateWithoutStudentInput>
    create: XOR<StudentCourseCreateWithoutStudentInput, StudentCourseUncheckedCreateWithoutStudentInput>
  }

  export type StudentCourseUpdateWithWhereUniqueWithoutStudentInput = {
    where: StudentCourseWhereUniqueInput
    data: XOR<StudentCourseUpdateWithoutStudentInput, StudentCourseUncheckedUpdateWithoutStudentInput>
  }

  export type StudentCourseUpdateManyWithWhereWithoutStudentInput = {
    where: StudentCourseScalarWhereInput
    data: XOR<StudentCourseUpdateManyMutationInput, StudentCourseUncheckedUpdateManyWithoutStudentInput>
  }

  export type StudentCourseScalarWhereInput = {
    AND?: StudentCourseScalarWhereInput | StudentCourseScalarWhereInput[]
    OR?: StudentCourseScalarWhereInput[]
    NOT?: StudentCourseScalarWhereInput | StudentCourseScalarWhereInput[]
    id?: StringFilter<"StudentCourse"> | string
    studentId?: StringFilter<"StudentCourse"> | string
    courseId?: StringFilter<"StudentCourse"> | string
    completed?: BoolFilter<"StudentCourse"> | boolean
    progress?: IntNullableFilter<"StudentCourse"> | number | null
    enrolledAt?: DateTimeFilter<"StudentCourse"> | Date | string
  }

  export type LessonProgressUpsertWithWhereUniqueWithoutStudentInput = {
    where: LessonProgressWhereUniqueInput
    update: XOR<LessonProgressUpdateWithoutStudentInput, LessonProgressUncheckedUpdateWithoutStudentInput>
    create: XOR<LessonProgressCreateWithoutStudentInput, LessonProgressUncheckedCreateWithoutStudentInput>
  }

  export type LessonProgressUpdateWithWhereUniqueWithoutStudentInput = {
    where: LessonProgressWhereUniqueInput
    data: XOR<LessonProgressUpdateWithoutStudentInput, LessonProgressUncheckedUpdateWithoutStudentInput>
  }

  export type LessonProgressUpdateManyWithWhereWithoutStudentInput = {
    where: LessonProgressScalarWhereInput
    data: XOR<LessonProgressUpdateManyMutationInput, LessonProgressUncheckedUpdateManyWithoutStudentInput>
  }

  export type LessonProgressScalarWhereInput = {
    AND?: LessonProgressScalarWhereInput | LessonProgressScalarWhereInput[]
    OR?: LessonProgressScalarWhereInput[]
    NOT?: LessonProgressScalarWhereInput | LessonProgressScalarWhereInput[]
    id?: StringFilter<"LessonProgress"> | string
    studentId?: StringFilter<"LessonProgress"> | string
    lessonId?: StringFilter<"LessonProgress"> | string
    status?: EnumLessonStatusFilter<"LessonProgress"> | $Enums.LessonStatus
    score?: FloatNullableFilter<"LessonProgress"> | number | null
    startedAt?: DateTimeNullableFilter<"LessonProgress"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"LessonProgress"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"LessonProgress"> | Date | string | null
  }

  export type StudentSubmissionUpsertWithWhereUniqueWithoutStudentInput = {
    where: StudentSubmissionWhereUniqueInput
    update: XOR<StudentSubmissionUpdateWithoutStudentInput, StudentSubmissionUncheckedUpdateWithoutStudentInput>
    create: XOR<StudentSubmissionCreateWithoutStudentInput, StudentSubmissionUncheckedCreateWithoutStudentInput>
  }

  export type StudentSubmissionUpdateWithWhereUniqueWithoutStudentInput = {
    where: StudentSubmissionWhereUniqueInput
    data: XOR<StudentSubmissionUpdateWithoutStudentInput, StudentSubmissionUncheckedUpdateWithoutStudentInput>
  }

  export type StudentSubmissionUpdateManyWithWhereWithoutStudentInput = {
    where: StudentSubmissionScalarWhereInput
    data: XOR<StudentSubmissionUpdateManyMutationInput, StudentSubmissionUncheckedUpdateManyWithoutStudentInput>
  }

  export type StudentSubmissionScalarWhereInput = {
    AND?: StudentSubmissionScalarWhereInput | StudentSubmissionScalarWhereInput[]
    OR?: StudentSubmissionScalarWhereInput[]
    NOT?: StudentSubmissionScalarWhereInput | StudentSubmissionScalarWhereInput[]
    id?: StringFilter<"StudentSubmission"> | string
    studentId?: StringFilter<"StudentSubmission"> | string
    lessonId?: StringFilter<"StudentSubmission"> | string
    type?: EnumSubmissionTypeFilter<"StudentSubmission"> | $Enums.SubmissionType
    content?: StringNullableFilter<"StudentSubmission"> | string | null
    grade?: FloatNullableFilter<"StudentSubmission"> | number | null
    submittedAt?: DateTimeFilter<"StudentSubmission"> | Date | string
  }

  export type LabInstanceUpsertWithWhereUniqueWithoutStudentInput = {
    where: LabInstanceWhereUniqueInput
    update: XOR<LabInstanceUpdateWithoutStudentInput, LabInstanceUncheckedUpdateWithoutStudentInput>
    create: XOR<LabInstanceCreateWithoutStudentInput, LabInstanceUncheckedCreateWithoutStudentInput>
  }

  export type LabInstanceUpdateWithWhereUniqueWithoutStudentInput = {
    where: LabInstanceWhereUniqueInput
    data: XOR<LabInstanceUpdateWithoutStudentInput, LabInstanceUncheckedUpdateWithoutStudentInput>
  }

  export type LabInstanceUpdateManyWithWhereWithoutStudentInput = {
    where: LabInstanceScalarWhereInput
    data: XOR<LabInstanceUpdateManyMutationInput, LabInstanceUncheckedUpdateManyWithoutStudentInput>
  }

  export type LabInstanceScalarWhereInput = {
    AND?: LabInstanceScalarWhereInput | LabInstanceScalarWhereInput[]
    OR?: LabInstanceScalarWhereInput[]
    NOT?: LabInstanceScalarWhereInput | LabInstanceScalarWhereInput[]
    id?: StringFilter<"LabInstance"> | string
    studentId?: StringFilter<"LabInstance"> | string
    lessonId?: StringFilter<"LabInstance"> | string
    url?: StringNullableFilter<"LabInstance"> | string | null
    containerId?: StringNullableFilter<"LabInstance"> | string | null
    state?: EnumLabStateFilter<"LabInstance"> | $Enums.LabState
    config?: JsonNullableFilter<"LabInstance">
    apiLastRun?: JsonNullableFilter<"LabInstance">
    uiLastRun?: JsonNullableFilter<"LabInstance">
    createdAt?: DateTimeFilter<"LabInstance"> | Date | string
    updatedAt?: DateTimeFilter<"LabInstance"> | Date | string
  }

  export type QuizAttemptUpsertWithWhereUniqueWithoutStudentInput = {
    where: QuizAttemptWhereUniqueInput
    update: XOR<QuizAttemptUpdateWithoutStudentInput, QuizAttemptUncheckedUpdateWithoutStudentInput>
    create: XOR<QuizAttemptCreateWithoutStudentInput, QuizAttemptUncheckedCreateWithoutStudentInput>
  }

  export type QuizAttemptUpdateWithWhereUniqueWithoutStudentInput = {
    where: QuizAttemptWhereUniqueInput
    data: XOR<QuizAttemptUpdateWithoutStudentInput, QuizAttemptUncheckedUpdateWithoutStudentInput>
  }

  export type QuizAttemptUpdateManyWithWhereWithoutStudentInput = {
    where: QuizAttemptScalarWhereInput
    data: XOR<QuizAttemptUpdateManyMutationInput, QuizAttemptUncheckedUpdateManyWithoutStudentInput>
  }

  export type QuizAttemptScalarWhereInput = {
    AND?: QuizAttemptScalarWhereInput | QuizAttemptScalarWhereInput[]
    OR?: QuizAttemptScalarWhereInput[]
    NOT?: QuizAttemptScalarWhereInput | QuizAttemptScalarWhereInput[]
    id?: StringFilter<"QuizAttempt"> | string
    studentId?: StringFilter<"QuizAttempt"> | string
    lessonId?: StringFilter<"QuizAttempt"> | string
    answers?: JsonFilter<"QuizAttempt">
    score?: FloatNullableFilter<"QuizAttempt"> | number | null
    startedAt?: DateTimeFilter<"QuizAttempt"> | Date | string
    submittedAt?: DateTimeNullableFilter<"QuizAttempt"> | Date | string | null
  }

  export type StudentCreateWithoutCoursesInput = {
    id?: string
    userId?: string | null
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lessonProgress?: LessonProgressCreateNestedManyWithoutStudentInput
    submissions?: StudentSubmissionCreateNestedManyWithoutStudentInput
    labs?: LabInstanceCreateNestedManyWithoutStudentInput
    quizzes?: QuizAttemptCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutCoursesInput = {
    id?: string
    userId?: string | null
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lessonProgress?: LessonProgressUncheckedCreateNestedManyWithoutStudentInput
    submissions?: StudentSubmissionUncheckedCreateNestedManyWithoutStudentInput
    labs?: LabInstanceUncheckedCreateNestedManyWithoutStudentInput
    quizzes?: QuizAttemptUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentCreateOrConnectWithoutCoursesInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutCoursesInput, StudentUncheckedCreateWithoutCoursesInput>
  }

  export type StudentUpsertWithoutCoursesInput = {
    update: XOR<StudentUpdateWithoutCoursesInput, StudentUncheckedUpdateWithoutCoursesInput>
    create: XOR<StudentCreateWithoutCoursesInput, StudentUncheckedCreateWithoutCoursesInput>
    where?: StudentWhereInput
  }

  export type StudentUpdateToOneWithWhereWithoutCoursesInput = {
    where?: StudentWhereInput
    data: XOR<StudentUpdateWithoutCoursesInput, StudentUncheckedUpdateWithoutCoursesInput>
  }

  export type StudentUpdateWithoutCoursesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lessonProgress?: LessonProgressUpdateManyWithoutStudentNestedInput
    submissions?: StudentSubmissionUpdateManyWithoutStudentNestedInput
    labs?: LabInstanceUpdateManyWithoutStudentNestedInput
    quizzes?: QuizAttemptUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutCoursesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lessonProgress?: LessonProgressUncheckedUpdateManyWithoutStudentNestedInput
    submissions?: StudentSubmissionUncheckedUpdateManyWithoutStudentNestedInput
    labs?: LabInstanceUncheckedUpdateManyWithoutStudentNestedInput
    quizzes?: QuizAttemptUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentCreateWithoutLessonProgressInput = {
    id?: string
    userId?: string | null
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    courses?: StudentCourseCreateNestedManyWithoutStudentInput
    submissions?: StudentSubmissionCreateNestedManyWithoutStudentInput
    labs?: LabInstanceCreateNestedManyWithoutStudentInput
    quizzes?: QuizAttemptCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutLessonProgressInput = {
    id?: string
    userId?: string | null
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    courses?: StudentCourseUncheckedCreateNestedManyWithoutStudentInput
    submissions?: StudentSubmissionUncheckedCreateNestedManyWithoutStudentInput
    labs?: LabInstanceUncheckedCreateNestedManyWithoutStudentInput
    quizzes?: QuizAttemptUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentCreateOrConnectWithoutLessonProgressInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutLessonProgressInput, StudentUncheckedCreateWithoutLessonProgressInput>
  }

  export type StudentUpsertWithoutLessonProgressInput = {
    update: XOR<StudentUpdateWithoutLessonProgressInput, StudentUncheckedUpdateWithoutLessonProgressInput>
    create: XOR<StudentCreateWithoutLessonProgressInput, StudentUncheckedCreateWithoutLessonProgressInput>
    where?: StudentWhereInput
  }

  export type StudentUpdateToOneWithWhereWithoutLessonProgressInput = {
    where?: StudentWhereInput
    data: XOR<StudentUpdateWithoutLessonProgressInput, StudentUncheckedUpdateWithoutLessonProgressInput>
  }

  export type StudentUpdateWithoutLessonProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courses?: StudentCourseUpdateManyWithoutStudentNestedInput
    submissions?: StudentSubmissionUpdateManyWithoutStudentNestedInput
    labs?: LabInstanceUpdateManyWithoutStudentNestedInput
    quizzes?: QuizAttemptUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutLessonProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courses?: StudentCourseUncheckedUpdateManyWithoutStudentNestedInput
    submissions?: StudentSubmissionUncheckedUpdateManyWithoutStudentNestedInput
    labs?: LabInstanceUncheckedUpdateManyWithoutStudentNestedInput
    quizzes?: QuizAttemptUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentCreateWithoutSubmissionsInput = {
    id?: string
    userId?: string | null
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    courses?: StudentCourseCreateNestedManyWithoutStudentInput
    lessonProgress?: LessonProgressCreateNestedManyWithoutStudentInput
    labs?: LabInstanceCreateNestedManyWithoutStudentInput
    quizzes?: QuizAttemptCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutSubmissionsInput = {
    id?: string
    userId?: string | null
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    courses?: StudentCourseUncheckedCreateNestedManyWithoutStudentInput
    lessonProgress?: LessonProgressUncheckedCreateNestedManyWithoutStudentInput
    labs?: LabInstanceUncheckedCreateNestedManyWithoutStudentInput
    quizzes?: QuizAttemptUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentCreateOrConnectWithoutSubmissionsInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutSubmissionsInput, StudentUncheckedCreateWithoutSubmissionsInput>
  }

  export type StudentUpsertWithoutSubmissionsInput = {
    update: XOR<StudentUpdateWithoutSubmissionsInput, StudentUncheckedUpdateWithoutSubmissionsInput>
    create: XOR<StudentCreateWithoutSubmissionsInput, StudentUncheckedCreateWithoutSubmissionsInput>
    where?: StudentWhereInput
  }

  export type StudentUpdateToOneWithWhereWithoutSubmissionsInput = {
    where?: StudentWhereInput
    data: XOR<StudentUpdateWithoutSubmissionsInput, StudentUncheckedUpdateWithoutSubmissionsInput>
  }

  export type StudentUpdateWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courses?: StudentCourseUpdateManyWithoutStudentNestedInput
    lessonProgress?: LessonProgressUpdateManyWithoutStudentNestedInput
    labs?: LabInstanceUpdateManyWithoutStudentNestedInput
    quizzes?: QuizAttemptUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courses?: StudentCourseUncheckedUpdateManyWithoutStudentNestedInput
    lessonProgress?: LessonProgressUncheckedUpdateManyWithoutStudentNestedInput
    labs?: LabInstanceUncheckedUpdateManyWithoutStudentNestedInput
    quizzes?: QuizAttemptUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentCreateWithoutLabsInput = {
    id?: string
    userId?: string | null
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    courses?: StudentCourseCreateNestedManyWithoutStudentInput
    lessonProgress?: LessonProgressCreateNestedManyWithoutStudentInput
    submissions?: StudentSubmissionCreateNestedManyWithoutStudentInput
    quizzes?: QuizAttemptCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutLabsInput = {
    id?: string
    userId?: string | null
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    courses?: StudentCourseUncheckedCreateNestedManyWithoutStudentInput
    lessonProgress?: LessonProgressUncheckedCreateNestedManyWithoutStudentInput
    submissions?: StudentSubmissionUncheckedCreateNestedManyWithoutStudentInput
    quizzes?: QuizAttemptUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentCreateOrConnectWithoutLabsInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutLabsInput, StudentUncheckedCreateWithoutLabsInput>
  }

  export type StudentUpsertWithoutLabsInput = {
    update: XOR<StudentUpdateWithoutLabsInput, StudentUncheckedUpdateWithoutLabsInput>
    create: XOR<StudentCreateWithoutLabsInput, StudentUncheckedCreateWithoutLabsInput>
    where?: StudentWhereInput
  }

  export type StudentUpdateToOneWithWhereWithoutLabsInput = {
    where?: StudentWhereInput
    data: XOR<StudentUpdateWithoutLabsInput, StudentUncheckedUpdateWithoutLabsInput>
  }

  export type StudentUpdateWithoutLabsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courses?: StudentCourseUpdateManyWithoutStudentNestedInput
    lessonProgress?: LessonProgressUpdateManyWithoutStudentNestedInput
    submissions?: StudentSubmissionUpdateManyWithoutStudentNestedInput
    quizzes?: QuizAttemptUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutLabsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courses?: StudentCourseUncheckedUpdateManyWithoutStudentNestedInput
    lessonProgress?: LessonProgressUncheckedUpdateManyWithoutStudentNestedInput
    submissions?: StudentSubmissionUncheckedUpdateManyWithoutStudentNestedInput
    quizzes?: QuizAttemptUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentCreateWithoutQuizzesInput = {
    id?: string
    userId?: string | null
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    courses?: StudentCourseCreateNestedManyWithoutStudentInput
    lessonProgress?: LessonProgressCreateNestedManyWithoutStudentInput
    submissions?: StudentSubmissionCreateNestedManyWithoutStudentInput
    labs?: LabInstanceCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutQuizzesInput = {
    id?: string
    userId?: string | null
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    courses?: StudentCourseUncheckedCreateNestedManyWithoutStudentInput
    lessonProgress?: LessonProgressUncheckedCreateNestedManyWithoutStudentInput
    submissions?: StudentSubmissionUncheckedCreateNestedManyWithoutStudentInput
    labs?: LabInstanceUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentCreateOrConnectWithoutQuizzesInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutQuizzesInput, StudentUncheckedCreateWithoutQuizzesInput>
  }

  export type StudentUpsertWithoutQuizzesInput = {
    update: XOR<StudentUpdateWithoutQuizzesInput, StudentUncheckedUpdateWithoutQuizzesInput>
    create: XOR<StudentCreateWithoutQuizzesInput, StudentUncheckedCreateWithoutQuizzesInput>
    where?: StudentWhereInput
  }

  export type StudentUpdateToOneWithWhereWithoutQuizzesInput = {
    where?: StudentWhereInput
    data: XOR<StudentUpdateWithoutQuizzesInput, StudentUncheckedUpdateWithoutQuizzesInput>
  }

  export type StudentUpdateWithoutQuizzesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courses?: StudentCourseUpdateManyWithoutStudentNestedInput
    lessonProgress?: LessonProgressUpdateManyWithoutStudentNestedInput
    submissions?: StudentSubmissionUpdateManyWithoutStudentNestedInput
    labs?: LabInstanceUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutQuizzesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courses?: StudentCourseUncheckedUpdateManyWithoutStudentNestedInput
    lessonProgress?: LessonProgressUncheckedUpdateManyWithoutStudentNestedInput
    submissions?: StudentSubmissionUncheckedUpdateManyWithoutStudentNestedInput
    labs?: LabInstanceUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentCourseCreateManyStudentInput = {
    id?: string
    courseId: string
    completed?: boolean
    progress?: number | null
    enrolledAt?: Date | string
  }

  export type LessonProgressCreateManyStudentInput = {
    id?: string
    lessonId: string
    status?: $Enums.LessonStatus
    score?: number | null
    startedAt?: Date | string | null
    updatedAt?: Date | string | null
    completedAt?: Date | string | null
  }

  export type StudentSubmissionCreateManyStudentInput = {
    id?: string
    lessonId: string
    type: $Enums.SubmissionType
    content?: string | null
    grade?: number | null
    submittedAt?: Date | string
  }

  export type LabInstanceCreateManyStudentInput = {
    id?: string
    lessonId: string
    url?: string | null
    containerId?: string | null
    state?: $Enums.LabState
    config?: NullableJsonNullValueInput | InputJsonValue
    apiLastRun?: NullableJsonNullValueInput | InputJsonValue
    uiLastRun?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuizAttemptCreateManyStudentInput = {
    id?: string
    lessonId: string
    answers: JsonNullValueInput | InputJsonValue
    score?: number | null
    startedAt?: Date | string
    submittedAt?: Date | string | null
  }

  export type StudentCourseUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: NullableIntFieldUpdateOperationsInput | number | null
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentCourseUncheckedUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: NullableIntFieldUpdateOperationsInput | number | null
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentCourseUncheckedUpdateManyWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    progress?: NullableIntFieldUpdateOperationsInput | number | null
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LessonProgressUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    status?: EnumLessonStatusFieldUpdateOperationsInput | $Enums.LessonStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LessonProgressUncheckedUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    status?: EnumLessonStatusFieldUpdateOperationsInput | $Enums.LessonStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LessonProgressUncheckedUpdateManyWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    status?: EnumLessonStatusFieldUpdateOperationsInput | $Enums.LessonStatus
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StudentSubmissionUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    type?: EnumSubmissionTypeFieldUpdateOperationsInput | $Enums.SubmissionType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    grade?: NullableFloatFieldUpdateOperationsInput | number | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentSubmissionUncheckedUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    type?: EnumSubmissionTypeFieldUpdateOperationsInput | $Enums.SubmissionType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    grade?: NullableFloatFieldUpdateOperationsInput | number | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentSubmissionUncheckedUpdateManyWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    type?: EnumSubmissionTypeFieldUpdateOperationsInput | $Enums.SubmissionType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    grade?: NullableFloatFieldUpdateOperationsInput | number | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabInstanceUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    state?: EnumLabStateFieldUpdateOperationsInput | $Enums.LabState
    config?: NullableJsonNullValueInput | InputJsonValue
    apiLastRun?: NullableJsonNullValueInput | InputJsonValue
    uiLastRun?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabInstanceUncheckedUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    state?: EnumLabStateFieldUpdateOperationsInput | $Enums.LabState
    config?: NullableJsonNullValueInput | InputJsonValue
    apiLastRun?: NullableJsonNullValueInput | InputJsonValue
    uiLastRun?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LabInstanceUncheckedUpdateManyWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    containerId?: NullableStringFieldUpdateOperationsInput | string | null
    state?: EnumLabStateFieldUpdateOperationsInput | $Enums.LabState
    config?: NullableJsonNullValueInput | InputJsonValue
    apiLastRun?: NullableJsonNullValueInput | InputJsonValue
    uiLastRun?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizAttemptUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type QuizAttemptUncheckedUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type QuizAttemptUncheckedUpdateManyWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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