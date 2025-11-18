
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
 * Model Institution
 * 
 */
export type Institution = $Result.DefaultSelection<Prisma.$InstitutionPayload>
/**
 * Model Classroom
 * 
 */
export type Classroom = $Result.DefaultSelection<Prisma.$ClassroomPayload>
/**
 * Model Department
 * 
 */
export type Department = $Result.DefaultSelection<Prisma.$DepartmentPayload>
/**
 * Model InstitutionMember
 * 
 */
export type InstitutionMember = $Result.DefaultSelection<Prisma.$InstitutionMemberPayload>
/**
 * Model ClassroomEnrollment
 * 
 */
export type ClassroomEnrollment = $Result.DefaultSelection<Prisma.$ClassroomEnrollmentPayload>
/**
 * Model InstitutionInvite
 * 
 */
export type InstitutionInvite = $Result.DefaultSelection<Prisma.$InstitutionInvitePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Institutions
 * const institutions = await prisma.institution.findMany()
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
   * // Fetch zero or more Institutions
   * const institutions = await prisma.institution.findMany()
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
   * `prisma.institution`: Exposes CRUD operations for the **Institution** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Institutions
    * const institutions = await prisma.institution.findMany()
    * ```
    */
  get institution(): Prisma.InstitutionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.classroom`: Exposes CRUD operations for the **Classroom** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Classrooms
    * const classrooms = await prisma.classroom.findMany()
    * ```
    */
  get classroom(): Prisma.ClassroomDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.department`: Exposes CRUD operations for the **Department** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Departments
    * const departments = await prisma.department.findMany()
    * ```
    */
  get department(): Prisma.DepartmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.institutionMember`: Exposes CRUD operations for the **InstitutionMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InstitutionMembers
    * const institutionMembers = await prisma.institutionMember.findMany()
    * ```
    */
  get institutionMember(): Prisma.InstitutionMemberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.classroomEnrollment`: Exposes CRUD operations for the **ClassroomEnrollment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClassroomEnrollments
    * const classroomEnrollments = await prisma.classroomEnrollment.findMany()
    * ```
    */
  get classroomEnrollment(): Prisma.ClassroomEnrollmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.institutionInvite`: Exposes CRUD operations for the **InstitutionInvite** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InstitutionInvites
    * const institutionInvites = await prisma.institutionInvite.findMany()
    * ```
    */
  get institutionInvite(): Prisma.InstitutionInviteDelegate<ExtArgs, ClientOptions>;
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
    Institution: 'Institution',
    Classroom: 'Classroom',
    Department: 'Department',
    InstitutionMember: 'InstitutionMember',
    ClassroomEnrollment: 'ClassroomEnrollment',
    InstitutionInvite: 'InstitutionInvite'
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
      modelProps: "institution" | "classroom" | "department" | "institutionMember" | "classroomEnrollment" | "institutionInvite"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Institution: {
        payload: Prisma.$InstitutionPayload<ExtArgs>
        fields: Prisma.InstitutionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InstitutionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InstitutionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload>
          }
          findFirst: {
            args: Prisma.InstitutionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InstitutionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload>
          }
          findMany: {
            args: Prisma.InstitutionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload>[]
          }
          create: {
            args: Prisma.InstitutionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload>
          }
          createMany: {
            args: Prisma.InstitutionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InstitutionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload>[]
          }
          delete: {
            args: Prisma.InstitutionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload>
          }
          update: {
            args: Prisma.InstitutionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload>
          }
          deleteMany: {
            args: Prisma.InstitutionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InstitutionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InstitutionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload>[]
          }
          upsert: {
            args: Prisma.InstitutionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionPayload>
          }
          aggregate: {
            args: Prisma.InstitutionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInstitution>
          }
          groupBy: {
            args: Prisma.InstitutionGroupByArgs<ExtArgs>
            result: $Utils.Optional<InstitutionGroupByOutputType>[]
          }
          count: {
            args: Prisma.InstitutionCountArgs<ExtArgs>
            result: $Utils.Optional<InstitutionCountAggregateOutputType> | number
          }
        }
      }
      Classroom: {
        payload: Prisma.$ClassroomPayload<ExtArgs>
        fields: Prisma.ClassroomFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClassroomFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClassroomFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomPayload>
          }
          findFirst: {
            args: Prisma.ClassroomFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClassroomFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomPayload>
          }
          findMany: {
            args: Prisma.ClassroomFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomPayload>[]
          }
          create: {
            args: Prisma.ClassroomCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomPayload>
          }
          createMany: {
            args: Prisma.ClassroomCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClassroomCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomPayload>[]
          }
          delete: {
            args: Prisma.ClassroomDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomPayload>
          }
          update: {
            args: Prisma.ClassroomUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomPayload>
          }
          deleteMany: {
            args: Prisma.ClassroomDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClassroomUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClassroomUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomPayload>[]
          }
          upsert: {
            args: Prisma.ClassroomUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomPayload>
          }
          aggregate: {
            args: Prisma.ClassroomAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClassroom>
          }
          groupBy: {
            args: Prisma.ClassroomGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClassroomGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClassroomCountArgs<ExtArgs>
            result: $Utils.Optional<ClassroomCountAggregateOutputType> | number
          }
        }
      }
      Department: {
        payload: Prisma.$DepartmentPayload<ExtArgs>
        fields: Prisma.DepartmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DepartmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DepartmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          findFirst: {
            args: Prisma.DepartmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DepartmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          findMany: {
            args: Prisma.DepartmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>[]
          }
          create: {
            args: Prisma.DepartmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          createMany: {
            args: Prisma.DepartmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DepartmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>[]
          }
          delete: {
            args: Prisma.DepartmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          update: {
            args: Prisma.DepartmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          deleteMany: {
            args: Prisma.DepartmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DepartmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DepartmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>[]
          }
          upsert: {
            args: Prisma.DepartmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          aggregate: {
            args: Prisma.DepartmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDepartment>
          }
          groupBy: {
            args: Prisma.DepartmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DepartmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DepartmentCountArgs<ExtArgs>
            result: $Utils.Optional<DepartmentCountAggregateOutputType> | number
          }
        }
      }
      InstitutionMember: {
        payload: Prisma.$InstitutionMemberPayload<ExtArgs>
        fields: Prisma.InstitutionMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InstitutionMemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InstitutionMemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionMemberPayload>
          }
          findFirst: {
            args: Prisma.InstitutionMemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InstitutionMemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionMemberPayload>
          }
          findMany: {
            args: Prisma.InstitutionMemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionMemberPayload>[]
          }
          create: {
            args: Prisma.InstitutionMemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionMemberPayload>
          }
          createMany: {
            args: Prisma.InstitutionMemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InstitutionMemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionMemberPayload>[]
          }
          delete: {
            args: Prisma.InstitutionMemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionMemberPayload>
          }
          update: {
            args: Prisma.InstitutionMemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionMemberPayload>
          }
          deleteMany: {
            args: Prisma.InstitutionMemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InstitutionMemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InstitutionMemberUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionMemberPayload>[]
          }
          upsert: {
            args: Prisma.InstitutionMemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionMemberPayload>
          }
          aggregate: {
            args: Prisma.InstitutionMemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInstitutionMember>
          }
          groupBy: {
            args: Prisma.InstitutionMemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<InstitutionMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.InstitutionMemberCountArgs<ExtArgs>
            result: $Utils.Optional<InstitutionMemberCountAggregateOutputType> | number
          }
        }
      }
      ClassroomEnrollment: {
        payload: Prisma.$ClassroomEnrollmentPayload<ExtArgs>
        fields: Prisma.ClassroomEnrollmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClassroomEnrollmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomEnrollmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClassroomEnrollmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomEnrollmentPayload>
          }
          findFirst: {
            args: Prisma.ClassroomEnrollmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomEnrollmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClassroomEnrollmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomEnrollmentPayload>
          }
          findMany: {
            args: Prisma.ClassroomEnrollmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomEnrollmentPayload>[]
          }
          create: {
            args: Prisma.ClassroomEnrollmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomEnrollmentPayload>
          }
          createMany: {
            args: Prisma.ClassroomEnrollmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClassroomEnrollmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomEnrollmentPayload>[]
          }
          delete: {
            args: Prisma.ClassroomEnrollmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomEnrollmentPayload>
          }
          update: {
            args: Prisma.ClassroomEnrollmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomEnrollmentPayload>
          }
          deleteMany: {
            args: Prisma.ClassroomEnrollmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClassroomEnrollmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClassroomEnrollmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomEnrollmentPayload>[]
          }
          upsert: {
            args: Prisma.ClassroomEnrollmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassroomEnrollmentPayload>
          }
          aggregate: {
            args: Prisma.ClassroomEnrollmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClassroomEnrollment>
          }
          groupBy: {
            args: Prisma.ClassroomEnrollmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClassroomEnrollmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClassroomEnrollmentCountArgs<ExtArgs>
            result: $Utils.Optional<ClassroomEnrollmentCountAggregateOutputType> | number
          }
        }
      }
      InstitutionInvite: {
        payload: Prisma.$InstitutionInvitePayload<ExtArgs>
        fields: Prisma.InstitutionInviteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InstitutionInviteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionInvitePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InstitutionInviteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionInvitePayload>
          }
          findFirst: {
            args: Prisma.InstitutionInviteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionInvitePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InstitutionInviteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionInvitePayload>
          }
          findMany: {
            args: Prisma.InstitutionInviteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionInvitePayload>[]
          }
          create: {
            args: Prisma.InstitutionInviteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionInvitePayload>
          }
          createMany: {
            args: Prisma.InstitutionInviteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InstitutionInviteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionInvitePayload>[]
          }
          delete: {
            args: Prisma.InstitutionInviteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionInvitePayload>
          }
          update: {
            args: Prisma.InstitutionInviteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionInvitePayload>
          }
          deleteMany: {
            args: Prisma.InstitutionInviteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InstitutionInviteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InstitutionInviteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionInvitePayload>[]
          }
          upsert: {
            args: Prisma.InstitutionInviteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitutionInvitePayload>
          }
          aggregate: {
            args: Prisma.InstitutionInviteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInstitutionInvite>
          }
          groupBy: {
            args: Prisma.InstitutionInviteGroupByArgs<ExtArgs>
            result: $Utils.Optional<InstitutionInviteGroupByOutputType>[]
          }
          count: {
            args: Prisma.InstitutionInviteCountArgs<ExtArgs>
            result: $Utils.Optional<InstitutionInviteCountAggregateOutputType> | number
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
    institution?: InstitutionOmit
    classroom?: ClassroomOmit
    department?: DepartmentOmit
    institutionMember?: InstitutionMemberOmit
    classroomEnrollment?: ClassroomEnrollmentOmit
    institutionInvite?: InstitutionInviteOmit
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
   * Count Type InstitutionCountOutputType
   */

  export type InstitutionCountOutputType = {
    classrooms: number
    departments: number
    members: number
    invites: number
  }

  export type InstitutionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classrooms?: boolean | InstitutionCountOutputTypeCountClassroomsArgs
    departments?: boolean | InstitutionCountOutputTypeCountDepartmentsArgs
    members?: boolean | InstitutionCountOutputTypeCountMembersArgs
    invites?: boolean | InstitutionCountOutputTypeCountInvitesArgs
  }

  // Custom InputTypes
  /**
   * InstitutionCountOutputType without action
   */
  export type InstitutionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionCountOutputType
     */
    select?: InstitutionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InstitutionCountOutputType without action
   */
  export type InstitutionCountOutputTypeCountClassroomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClassroomWhereInput
  }

  /**
   * InstitutionCountOutputType without action
   */
  export type InstitutionCountOutputTypeCountDepartmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentWhereInput
  }

  /**
   * InstitutionCountOutputType without action
   */
  export type InstitutionCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InstitutionMemberWhereInput
  }

  /**
   * InstitutionCountOutputType without action
   */
  export type InstitutionCountOutputTypeCountInvitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InstitutionInviteWhereInput
  }


  /**
   * Count Type ClassroomCountOutputType
   */

  export type ClassroomCountOutputType = {
    enrollments: number
  }

  export type ClassroomCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enrollments?: boolean | ClassroomCountOutputTypeCountEnrollmentsArgs
  }

  // Custom InputTypes
  /**
   * ClassroomCountOutputType without action
   */
  export type ClassroomCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomCountOutputType
     */
    select?: ClassroomCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClassroomCountOutputType without action
   */
  export type ClassroomCountOutputTypeCountEnrollmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClassroomEnrollmentWhereInput
  }


  /**
   * Count Type DepartmentCountOutputType
   */

  export type DepartmentCountOutputType = {
    classrooms: number
  }

  export type DepartmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classrooms?: boolean | DepartmentCountOutputTypeCountClassroomsArgs
  }

  // Custom InputTypes
  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentCountOutputType
     */
    select?: DepartmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeCountClassroomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClassroomWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Institution
   */

  export type AggregateInstitution = {
    _count: InstitutionCountAggregateOutputType | null
    _min: InstitutionMinAggregateOutputType | null
    _max: InstitutionMaxAggregateOutputType | null
  }

  export type InstitutionMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    description: string | null
    type: string | null
    location: string | null
    email: string | null
    phone: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InstitutionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    description: string | null
    type: string | null
    location: string | null
    email: string | null
    phone: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InstitutionCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    description: number
    type: number
    location: number
    email: number
    phone: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InstitutionMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    type?: true
    location?: true
    email?: true
    phone?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InstitutionMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    type?: true
    location?: true
    email?: true
    phone?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InstitutionCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    type?: true
    location?: true
    email?: true
    phone?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InstitutionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Institution to aggregate.
     */
    where?: InstitutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Institutions to fetch.
     */
    orderBy?: InstitutionOrderByWithRelationInput | InstitutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InstitutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Institutions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Institutions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Institutions
    **/
    _count?: true | InstitutionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InstitutionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InstitutionMaxAggregateInputType
  }

  export type GetInstitutionAggregateType<T extends InstitutionAggregateArgs> = {
        [P in keyof T & keyof AggregateInstitution]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInstitution[P]>
      : GetScalarType<T[P], AggregateInstitution[P]>
  }




  export type InstitutionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InstitutionWhereInput
    orderBy?: InstitutionOrderByWithAggregationInput | InstitutionOrderByWithAggregationInput[]
    by: InstitutionScalarFieldEnum[] | InstitutionScalarFieldEnum
    having?: InstitutionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InstitutionCountAggregateInputType | true
    _min?: InstitutionMinAggregateInputType
    _max?: InstitutionMaxAggregateInputType
  }

  export type InstitutionGroupByOutputType = {
    id: string
    name: string
    slug: string
    description: string | null
    type: string | null
    location: string | null
    email: string | null
    phone: string | null
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: InstitutionCountAggregateOutputType | null
    _min: InstitutionMinAggregateOutputType | null
    _max: InstitutionMaxAggregateOutputType | null
  }

  type GetInstitutionGroupByPayload<T extends InstitutionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InstitutionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InstitutionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InstitutionGroupByOutputType[P]>
            : GetScalarType<T[P], InstitutionGroupByOutputType[P]>
        }
      >
    >


  export type InstitutionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    type?: boolean
    location?: boolean
    email?: boolean
    phone?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    classrooms?: boolean | Institution$classroomsArgs<ExtArgs>
    departments?: boolean | Institution$departmentsArgs<ExtArgs>
    members?: boolean | Institution$membersArgs<ExtArgs>
    invites?: boolean | Institution$invitesArgs<ExtArgs>
    _count?: boolean | InstitutionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["institution"]>

  export type InstitutionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    type?: boolean
    location?: boolean
    email?: boolean
    phone?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["institution"]>

  export type InstitutionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    type?: boolean
    location?: boolean
    email?: boolean
    phone?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["institution"]>

  export type InstitutionSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    type?: boolean
    location?: boolean
    email?: boolean
    phone?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InstitutionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "description" | "type" | "location" | "email" | "phone" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["institution"]>
  export type InstitutionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classrooms?: boolean | Institution$classroomsArgs<ExtArgs>
    departments?: boolean | Institution$departmentsArgs<ExtArgs>
    members?: boolean | Institution$membersArgs<ExtArgs>
    invites?: boolean | Institution$invitesArgs<ExtArgs>
    _count?: boolean | InstitutionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InstitutionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type InstitutionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $InstitutionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Institution"
    objects: {
      classrooms: Prisma.$ClassroomPayload<ExtArgs>[]
      departments: Prisma.$DepartmentPayload<ExtArgs>[]
      members: Prisma.$InstitutionMemberPayload<ExtArgs>[]
      invites: Prisma.$InstitutionInvitePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      slug: string
      description: string | null
      type: string | null
      location: string | null
      email: string | null
      phone: string | null
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["institution"]>
    composites: {}
  }

  type InstitutionGetPayload<S extends boolean | null | undefined | InstitutionDefaultArgs> = $Result.GetResult<Prisma.$InstitutionPayload, S>

  type InstitutionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InstitutionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InstitutionCountAggregateInputType | true
    }

  export interface InstitutionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Institution'], meta: { name: 'Institution' } }
    /**
     * Find zero or one Institution that matches the filter.
     * @param {InstitutionFindUniqueArgs} args - Arguments to find a Institution
     * @example
     * // Get one Institution
     * const institution = await prisma.institution.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InstitutionFindUniqueArgs>(args: SelectSubset<T, InstitutionFindUniqueArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Institution that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InstitutionFindUniqueOrThrowArgs} args - Arguments to find a Institution
     * @example
     * // Get one Institution
     * const institution = await prisma.institution.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InstitutionFindUniqueOrThrowArgs>(args: SelectSubset<T, InstitutionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Institution that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionFindFirstArgs} args - Arguments to find a Institution
     * @example
     * // Get one Institution
     * const institution = await prisma.institution.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InstitutionFindFirstArgs>(args?: SelectSubset<T, InstitutionFindFirstArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Institution that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionFindFirstOrThrowArgs} args - Arguments to find a Institution
     * @example
     * // Get one Institution
     * const institution = await prisma.institution.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InstitutionFindFirstOrThrowArgs>(args?: SelectSubset<T, InstitutionFindFirstOrThrowArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Institutions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Institutions
     * const institutions = await prisma.institution.findMany()
     * 
     * // Get first 10 Institutions
     * const institutions = await prisma.institution.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const institutionWithIdOnly = await prisma.institution.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InstitutionFindManyArgs>(args?: SelectSubset<T, InstitutionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Institution.
     * @param {InstitutionCreateArgs} args - Arguments to create a Institution.
     * @example
     * // Create one Institution
     * const Institution = await prisma.institution.create({
     *   data: {
     *     // ... data to create a Institution
     *   }
     * })
     * 
     */
    create<T extends InstitutionCreateArgs>(args: SelectSubset<T, InstitutionCreateArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Institutions.
     * @param {InstitutionCreateManyArgs} args - Arguments to create many Institutions.
     * @example
     * // Create many Institutions
     * const institution = await prisma.institution.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InstitutionCreateManyArgs>(args?: SelectSubset<T, InstitutionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Institutions and returns the data saved in the database.
     * @param {InstitutionCreateManyAndReturnArgs} args - Arguments to create many Institutions.
     * @example
     * // Create many Institutions
     * const institution = await prisma.institution.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Institutions and only return the `id`
     * const institutionWithIdOnly = await prisma.institution.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InstitutionCreateManyAndReturnArgs>(args?: SelectSubset<T, InstitutionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Institution.
     * @param {InstitutionDeleteArgs} args - Arguments to delete one Institution.
     * @example
     * // Delete one Institution
     * const Institution = await prisma.institution.delete({
     *   where: {
     *     // ... filter to delete one Institution
     *   }
     * })
     * 
     */
    delete<T extends InstitutionDeleteArgs>(args: SelectSubset<T, InstitutionDeleteArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Institution.
     * @param {InstitutionUpdateArgs} args - Arguments to update one Institution.
     * @example
     * // Update one Institution
     * const institution = await prisma.institution.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InstitutionUpdateArgs>(args: SelectSubset<T, InstitutionUpdateArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Institutions.
     * @param {InstitutionDeleteManyArgs} args - Arguments to filter Institutions to delete.
     * @example
     * // Delete a few Institutions
     * const { count } = await prisma.institution.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InstitutionDeleteManyArgs>(args?: SelectSubset<T, InstitutionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Institutions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Institutions
     * const institution = await prisma.institution.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InstitutionUpdateManyArgs>(args: SelectSubset<T, InstitutionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Institutions and returns the data updated in the database.
     * @param {InstitutionUpdateManyAndReturnArgs} args - Arguments to update many Institutions.
     * @example
     * // Update many Institutions
     * const institution = await prisma.institution.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Institutions and only return the `id`
     * const institutionWithIdOnly = await prisma.institution.updateManyAndReturn({
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
    updateManyAndReturn<T extends InstitutionUpdateManyAndReturnArgs>(args: SelectSubset<T, InstitutionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Institution.
     * @param {InstitutionUpsertArgs} args - Arguments to update or create a Institution.
     * @example
     * // Update or create a Institution
     * const institution = await prisma.institution.upsert({
     *   create: {
     *     // ... data to create a Institution
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Institution we want to update
     *   }
     * })
     */
    upsert<T extends InstitutionUpsertArgs>(args: SelectSubset<T, InstitutionUpsertArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Institutions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionCountArgs} args - Arguments to filter Institutions to count.
     * @example
     * // Count the number of Institutions
     * const count = await prisma.institution.count({
     *   where: {
     *     // ... the filter for the Institutions we want to count
     *   }
     * })
    **/
    count<T extends InstitutionCountArgs>(
      args?: Subset<T, InstitutionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InstitutionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Institution.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InstitutionAggregateArgs>(args: Subset<T, InstitutionAggregateArgs>): Prisma.PrismaPromise<GetInstitutionAggregateType<T>>

    /**
     * Group by Institution.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionGroupByArgs} args - Group by arguments.
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
      T extends InstitutionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InstitutionGroupByArgs['orderBy'] }
        : { orderBy?: InstitutionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InstitutionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInstitutionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Institution model
   */
  readonly fields: InstitutionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Institution.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InstitutionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    classrooms<T extends Institution$classroomsArgs<ExtArgs> = {}>(args?: Subset<T, Institution$classroomsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassroomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    departments<T extends Institution$departmentsArgs<ExtArgs> = {}>(args?: Subset<T, Institution$departmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    members<T extends Institution$membersArgs<ExtArgs> = {}>(args?: Subset<T, Institution$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitutionMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    invites<T extends Institution$invitesArgs<ExtArgs> = {}>(args?: Subset<T, Institution$invitesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitutionInvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Institution model
   */
  interface InstitutionFieldRefs {
    readonly id: FieldRef<"Institution", 'String'>
    readonly name: FieldRef<"Institution", 'String'>
    readonly slug: FieldRef<"Institution", 'String'>
    readonly description: FieldRef<"Institution", 'String'>
    readonly type: FieldRef<"Institution", 'String'>
    readonly location: FieldRef<"Institution", 'String'>
    readonly email: FieldRef<"Institution", 'String'>
    readonly phone: FieldRef<"Institution", 'String'>
    readonly active: FieldRef<"Institution", 'Boolean'>
    readonly createdAt: FieldRef<"Institution", 'DateTime'>
    readonly updatedAt: FieldRef<"Institution", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Institution findUnique
   */
  export type InstitutionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
    /**
     * Filter, which Institution to fetch.
     */
    where: InstitutionWhereUniqueInput
  }

  /**
   * Institution findUniqueOrThrow
   */
  export type InstitutionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
    /**
     * Filter, which Institution to fetch.
     */
    where: InstitutionWhereUniqueInput
  }

  /**
   * Institution findFirst
   */
  export type InstitutionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
    /**
     * Filter, which Institution to fetch.
     */
    where?: InstitutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Institutions to fetch.
     */
    orderBy?: InstitutionOrderByWithRelationInput | InstitutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Institutions.
     */
    cursor?: InstitutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Institutions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Institutions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Institutions.
     */
    distinct?: InstitutionScalarFieldEnum | InstitutionScalarFieldEnum[]
  }

  /**
   * Institution findFirstOrThrow
   */
  export type InstitutionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
    /**
     * Filter, which Institution to fetch.
     */
    where?: InstitutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Institutions to fetch.
     */
    orderBy?: InstitutionOrderByWithRelationInput | InstitutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Institutions.
     */
    cursor?: InstitutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Institutions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Institutions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Institutions.
     */
    distinct?: InstitutionScalarFieldEnum | InstitutionScalarFieldEnum[]
  }

  /**
   * Institution findMany
   */
  export type InstitutionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
    /**
     * Filter, which Institutions to fetch.
     */
    where?: InstitutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Institutions to fetch.
     */
    orderBy?: InstitutionOrderByWithRelationInput | InstitutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Institutions.
     */
    cursor?: InstitutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Institutions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Institutions.
     */
    skip?: number
    distinct?: InstitutionScalarFieldEnum | InstitutionScalarFieldEnum[]
  }

  /**
   * Institution create
   */
  export type InstitutionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
    /**
     * The data needed to create a Institution.
     */
    data: XOR<InstitutionCreateInput, InstitutionUncheckedCreateInput>
  }

  /**
   * Institution createMany
   */
  export type InstitutionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Institutions.
     */
    data: InstitutionCreateManyInput | InstitutionCreateManyInput[]
  }

  /**
   * Institution createManyAndReturn
   */
  export type InstitutionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * The data used to create many Institutions.
     */
    data: InstitutionCreateManyInput | InstitutionCreateManyInput[]
  }

  /**
   * Institution update
   */
  export type InstitutionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
    /**
     * The data needed to update a Institution.
     */
    data: XOR<InstitutionUpdateInput, InstitutionUncheckedUpdateInput>
    /**
     * Choose, which Institution to update.
     */
    where: InstitutionWhereUniqueInput
  }

  /**
   * Institution updateMany
   */
  export type InstitutionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Institutions.
     */
    data: XOR<InstitutionUpdateManyMutationInput, InstitutionUncheckedUpdateManyInput>
    /**
     * Filter which Institutions to update
     */
    where?: InstitutionWhereInput
    /**
     * Limit how many Institutions to update.
     */
    limit?: number
  }

  /**
   * Institution updateManyAndReturn
   */
  export type InstitutionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * The data used to update Institutions.
     */
    data: XOR<InstitutionUpdateManyMutationInput, InstitutionUncheckedUpdateManyInput>
    /**
     * Filter which Institutions to update
     */
    where?: InstitutionWhereInput
    /**
     * Limit how many Institutions to update.
     */
    limit?: number
  }

  /**
   * Institution upsert
   */
  export type InstitutionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
    /**
     * The filter to search for the Institution to update in case it exists.
     */
    where: InstitutionWhereUniqueInput
    /**
     * In case the Institution found by the `where` argument doesn't exist, create a new Institution with this data.
     */
    create: XOR<InstitutionCreateInput, InstitutionUncheckedCreateInput>
    /**
     * In case the Institution was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InstitutionUpdateInput, InstitutionUncheckedUpdateInput>
  }

  /**
   * Institution delete
   */
  export type InstitutionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
    /**
     * Filter which Institution to delete.
     */
    where: InstitutionWhereUniqueInput
  }

  /**
   * Institution deleteMany
   */
  export type InstitutionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Institutions to delete
     */
    where?: InstitutionWhereInput
    /**
     * Limit how many Institutions to delete.
     */
    limit?: number
  }

  /**
   * Institution.classrooms
   */
  export type Institution$classroomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classroom
     */
    select?: ClassroomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classroom
     */
    omit?: ClassroomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomInclude<ExtArgs> | null
    where?: ClassroomWhereInput
    orderBy?: ClassroomOrderByWithRelationInput | ClassroomOrderByWithRelationInput[]
    cursor?: ClassroomWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClassroomScalarFieldEnum | ClassroomScalarFieldEnum[]
  }

  /**
   * Institution.departments
   */
  export type Institution$departmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    where?: DepartmentWhereInput
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    cursor?: DepartmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Institution.members
   */
  export type Institution$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionMember
     */
    select?: InstitutionMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionMember
     */
    omit?: InstitutionMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionMemberInclude<ExtArgs> | null
    where?: InstitutionMemberWhereInput
    orderBy?: InstitutionMemberOrderByWithRelationInput | InstitutionMemberOrderByWithRelationInput[]
    cursor?: InstitutionMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InstitutionMemberScalarFieldEnum | InstitutionMemberScalarFieldEnum[]
  }

  /**
   * Institution.invites
   */
  export type Institution$invitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionInvite
     */
    select?: InstitutionInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionInvite
     */
    omit?: InstitutionInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInviteInclude<ExtArgs> | null
    where?: InstitutionInviteWhereInput
    orderBy?: InstitutionInviteOrderByWithRelationInput | InstitutionInviteOrderByWithRelationInput[]
    cursor?: InstitutionInviteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InstitutionInviteScalarFieldEnum | InstitutionInviteScalarFieldEnum[]
  }

  /**
   * Institution without action
   */
  export type InstitutionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institution
     */
    select?: InstitutionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Institution
     */
    omit?: InstitutionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInclude<ExtArgs> | null
  }


  /**
   * Model Classroom
   */

  export type AggregateClassroom = {
    _count: ClassroomCountAggregateOutputType | null
    _avg: ClassroomAvgAggregateOutputType | null
    _sum: ClassroomSumAggregateOutputType | null
    _min: ClassroomMinAggregateOutputType | null
    _max: ClassroomMaxAggregateOutputType | null
  }

  export type ClassroomAvgAggregateOutputType = {
    capacity: number | null
  }

  export type ClassroomSumAggregateOutputType = {
    capacity: number | null
  }

  export type ClassroomMinAggregateOutputType = {
    id: string | null
    institutionId: string | null
    departmentId: string | null
    teacherId: string | null
    title: string | null
    code: string | null
    capacity: number | null
    status: string | null
    startsAt: Date | null
    endsAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClassroomMaxAggregateOutputType = {
    id: string | null
    institutionId: string | null
    departmentId: string | null
    teacherId: string | null
    title: string | null
    code: string | null
    capacity: number | null
    status: string | null
    startsAt: Date | null
    endsAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClassroomCountAggregateOutputType = {
    id: number
    institutionId: number
    departmentId: number
    teacherId: number
    title: number
    code: number
    capacity: number
    status: number
    startsAt: number
    endsAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClassroomAvgAggregateInputType = {
    capacity?: true
  }

  export type ClassroomSumAggregateInputType = {
    capacity?: true
  }

  export type ClassroomMinAggregateInputType = {
    id?: true
    institutionId?: true
    departmentId?: true
    teacherId?: true
    title?: true
    code?: true
    capacity?: true
    status?: true
    startsAt?: true
    endsAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClassroomMaxAggregateInputType = {
    id?: true
    institutionId?: true
    departmentId?: true
    teacherId?: true
    title?: true
    code?: true
    capacity?: true
    status?: true
    startsAt?: true
    endsAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClassroomCountAggregateInputType = {
    id?: true
    institutionId?: true
    departmentId?: true
    teacherId?: true
    title?: true
    code?: true
    capacity?: true
    status?: true
    startsAt?: true
    endsAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClassroomAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Classroom to aggregate.
     */
    where?: ClassroomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Classrooms to fetch.
     */
    orderBy?: ClassroomOrderByWithRelationInput | ClassroomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClassroomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Classrooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Classrooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Classrooms
    **/
    _count?: true | ClassroomCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClassroomAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClassroomSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClassroomMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClassroomMaxAggregateInputType
  }

  export type GetClassroomAggregateType<T extends ClassroomAggregateArgs> = {
        [P in keyof T & keyof AggregateClassroom]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClassroom[P]>
      : GetScalarType<T[P], AggregateClassroom[P]>
  }




  export type ClassroomGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClassroomWhereInput
    orderBy?: ClassroomOrderByWithAggregationInput | ClassroomOrderByWithAggregationInput[]
    by: ClassroomScalarFieldEnum[] | ClassroomScalarFieldEnum
    having?: ClassroomScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClassroomCountAggregateInputType | true
    _avg?: ClassroomAvgAggregateInputType
    _sum?: ClassroomSumAggregateInputType
    _min?: ClassroomMinAggregateInputType
    _max?: ClassroomMaxAggregateInputType
  }

  export type ClassroomGroupByOutputType = {
    id: string
    institutionId: string
    departmentId: string | null
    teacherId: string | null
    title: string
    code: string
    capacity: number | null
    status: string | null
    startsAt: Date | null
    endsAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ClassroomCountAggregateOutputType | null
    _avg: ClassroomAvgAggregateOutputType | null
    _sum: ClassroomSumAggregateOutputType | null
    _min: ClassroomMinAggregateOutputType | null
    _max: ClassroomMaxAggregateOutputType | null
  }

  type GetClassroomGroupByPayload<T extends ClassroomGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClassroomGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClassroomGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClassroomGroupByOutputType[P]>
            : GetScalarType<T[P], ClassroomGroupByOutputType[P]>
        }
      >
    >


  export type ClassroomSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    institutionId?: boolean
    departmentId?: boolean
    teacherId?: boolean
    title?: boolean
    code?: boolean
    capacity?: boolean
    status?: boolean
    startsAt?: boolean
    endsAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
    department?: boolean | Classroom$departmentArgs<ExtArgs>
    enrollments?: boolean | Classroom$enrollmentsArgs<ExtArgs>
    _count?: boolean | ClassroomCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["classroom"]>

  export type ClassroomSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    institutionId?: boolean
    departmentId?: boolean
    teacherId?: boolean
    title?: boolean
    code?: boolean
    capacity?: boolean
    status?: boolean
    startsAt?: boolean
    endsAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
    department?: boolean | Classroom$departmentArgs<ExtArgs>
  }, ExtArgs["result"]["classroom"]>

  export type ClassroomSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    institutionId?: boolean
    departmentId?: boolean
    teacherId?: boolean
    title?: boolean
    code?: boolean
    capacity?: boolean
    status?: boolean
    startsAt?: boolean
    endsAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
    department?: boolean | Classroom$departmentArgs<ExtArgs>
  }, ExtArgs["result"]["classroom"]>

  export type ClassroomSelectScalar = {
    id?: boolean
    institutionId?: boolean
    departmentId?: boolean
    teacherId?: boolean
    title?: boolean
    code?: boolean
    capacity?: boolean
    status?: boolean
    startsAt?: boolean
    endsAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClassroomOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "institutionId" | "departmentId" | "teacherId" | "title" | "code" | "capacity" | "status" | "startsAt" | "endsAt" | "createdAt" | "updatedAt", ExtArgs["result"]["classroom"]>
  export type ClassroomInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
    department?: boolean | Classroom$departmentArgs<ExtArgs>
    enrollments?: boolean | Classroom$enrollmentsArgs<ExtArgs>
    _count?: boolean | ClassroomCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClassroomIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
    department?: boolean | Classroom$departmentArgs<ExtArgs>
  }
  export type ClassroomIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
    department?: boolean | Classroom$departmentArgs<ExtArgs>
  }

  export type $ClassroomPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Classroom"
    objects: {
      institution: Prisma.$InstitutionPayload<ExtArgs>
      department: Prisma.$DepartmentPayload<ExtArgs> | null
      enrollments: Prisma.$ClassroomEnrollmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      institutionId: string
      departmentId: string | null
      teacherId: string | null
      title: string
      code: string
      capacity: number | null
      status: string | null
      startsAt: Date | null
      endsAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["classroom"]>
    composites: {}
  }

  type ClassroomGetPayload<S extends boolean | null | undefined | ClassroomDefaultArgs> = $Result.GetResult<Prisma.$ClassroomPayload, S>

  type ClassroomCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClassroomFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClassroomCountAggregateInputType | true
    }

  export interface ClassroomDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Classroom'], meta: { name: 'Classroom' } }
    /**
     * Find zero or one Classroom that matches the filter.
     * @param {ClassroomFindUniqueArgs} args - Arguments to find a Classroom
     * @example
     * // Get one Classroom
     * const classroom = await prisma.classroom.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClassroomFindUniqueArgs>(args: SelectSubset<T, ClassroomFindUniqueArgs<ExtArgs>>): Prisma__ClassroomClient<$Result.GetResult<Prisma.$ClassroomPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Classroom that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClassroomFindUniqueOrThrowArgs} args - Arguments to find a Classroom
     * @example
     * // Get one Classroom
     * const classroom = await prisma.classroom.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClassroomFindUniqueOrThrowArgs>(args: SelectSubset<T, ClassroomFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClassroomClient<$Result.GetResult<Prisma.$ClassroomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Classroom that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomFindFirstArgs} args - Arguments to find a Classroom
     * @example
     * // Get one Classroom
     * const classroom = await prisma.classroom.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClassroomFindFirstArgs>(args?: SelectSubset<T, ClassroomFindFirstArgs<ExtArgs>>): Prisma__ClassroomClient<$Result.GetResult<Prisma.$ClassroomPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Classroom that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomFindFirstOrThrowArgs} args - Arguments to find a Classroom
     * @example
     * // Get one Classroom
     * const classroom = await prisma.classroom.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClassroomFindFirstOrThrowArgs>(args?: SelectSubset<T, ClassroomFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClassroomClient<$Result.GetResult<Prisma.$ClassroomPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Classrooms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Classrooms
     * const classrooms = await prisma.classroom.findMany()
     * 
     * // Get first 10 Classrooms
     * const classrooms = await prisma.classroom.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const classroomWithIdOnly = await prisma.classroom.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClassroomFindManyArgs>(args?: SelectSubset<T, ClassroomFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassroomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Classroom.
     * @param {ClassroomCreateArgs} args - Arguments to create a Classroom.
     * @example
     * // Create one Classroom
     * const Classroom = await prisma.classroom.create({
     *   data: {
     *     // ... data to create a Classroom
     *   }
     * })
     * 
     */
    create<T extends ClassroomCreateArgs>(args: SelectSubset<T, ClassroomCreateArgs<ExtArgs>>): Prisma__ClassroomClient<$Result.GetResult<Prisma.$ClassroomPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Classrooms.
     * @param {ClassroomCreateManyArgs} args - Arguments to create many Classrooms.
     * @example
     * // Create many Classrooms
     * const classroom = await prisma.classroom.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClassroomCreateManyArgs>(args?: SelectSubset<T, ClassroomCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Classrooms and returns the data saved in the database.
     * @param {ClassroomCreateManyAndReturnArgs} args - Arguments to create many Classrooms.
     * @example
     * // Create many Classrooms
     * const classroom = await prisma.classroom.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Classrooms and only return the `id`
     * const classroomWithIdOnly = await prisma.classroom.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClassroomCreateManyAndReturnArgs>(args?: SelectSubset<T, ClassroomCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassroomPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Classroom.
     * @param {ClassroomDeleteArgs} args - Arguments to delete one Classroom.
     * @example
     * // Delete one Classroom
     * const Classroom = await prisma.classroom.delete({
     *   where: {
     *     // ... filter to delete one Classroom
     *   }
     * })
     * 
     */
    delete<T extends ClassroomDeleteArgs>(args: SelectSubset<T, ClassroomDeleteArgs<ExtArgs>>): Prisma__ClassroomClient<$Result.GetResult<Prisma.$ClassroomPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Classroom.
     * @param {ClassroomUpdateArgs} args - Arguments to update one Classroom.
     * @example
     * // Update one Classroom
     * const classroom = await prisma.classroom.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClassroomUpdateArgs>(args: SelectSubset<T, ClassroomUpdateArgs<ExtArgs>>): Prisma__ClassroomClient<$Result.GetResult<Prisma.$ClassroomPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Classrooms.
     * @param {ClassroomDeleteManyArgs} args - Arguments to filter Classrooms to delete.
     * @example
     * // Delete a few Classrooms
     * const { count } = await prisma.classroom.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClassroomDeleteManyArgs>(args?: SelectSubset<T, ClassroomDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Classrooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Classrooms
     * const classroom = await prisma.classroom.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClassroomUpdateManyArgs>(args: SelectSubset<T, ClassroomUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Classrooms and returns the data updated in the database.
     * @param {ClassroomUpdateManyAndReturnArgs} args - Arguments to update many Classrooms.
     * @example
     * // Update many Classrooms
     * const classroom = await prisma.classroom.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Classrooms and only return the `id`
     * const classroomWithIdOnly = await prisma.classroom.updateManyAndReturn({
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
    updateManyAndReturn<T extends ClassroomUpdateManyAndReturnArgs>(args: SelectSubset<T, ClassroomUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassroomPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Classroom.
     * @param {ClassroomUpsertArgs} args - Arguments to update or create a Classroom.
     * @example
     * // Update or create a Classroom
     * const classroom = await prisma.classroom.upsert({
     *   create: {
     *     // ... data to create a Classroom
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Classroom we want to update
     *   }
     * })
     */
    upsert<T extends ClassroomUpsertArgs>(args: SelectSubset<T, ClassroomUpsertArgs<ExtArgs>>): Prisma__ClassroomClient<$Result.GetResult<Prisma.$ClassroomPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Classrooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomCountArgs} args - Arguments to filter Classrooms to count.
     * @example
     * // Count the number of Classrooms
     * const count = await prisma.classroom.count({
     *   where: {
     *     // ... the filter for the Classrooms we want to count
     *   }
     * })
    **/
    count<T extends ClassroomCountArgs>(
      args?: Subset<T, ClassroomCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClassroomCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Classroom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ClassroomAggregateArgs>(args: Subset<T, ClassroomAggregateArgs>): Prisma.PrismaPromise<GetClassroomAggregateType<T>>

    /**
     * Group by Classroom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomGroupByArgs} args - Group by arguments.
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
      T extends ClassroomGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClassroomGroupByArgs['orderBy'] }
        : { orderBy?: ClassroomGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ClassroomGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClassroomGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Classroom model
   */
  readonly fields: ClassroomFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Classroom.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClassroomClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    institution<T extends InstitutionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InstitutionDefaultArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    department<T extends Classroom$departmentArgs<ExtArgs> = {}>(args?: Subset<T, Classroom$departmentArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    enrollments<T extends Classroom$enrollmentsArgs<ExtArgs> = {}>(args?: Subset<T, Classroom$enrollmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassroomEnrollmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Classroom model
   */
  interface ClassroomFieldRefs {
    readonly id: FieldRef<"Classroom", 'String'>
    readonly institutionId: FieldRef<"Classroom", 'String'>
    readonly departmentId: FieldRef<"Classroom", 'String'>
    readonly teacherId: FieldRef<"Classroom", 'String'>
    readonly title: FieldRef<"Classroom", 'String'>
    readonly code: FieldRef<"Classroom", 'String'>
    readonly capacity: FieldRef<"Classroom", 'Int'>
    readonly status: FieldRef<"Classroom", 'String'>
    readonly startsAt: FieldRef<"Classroom", 'DateTime'>
    readonly endsAt: FieldRef<"Classroom", 'DateTime'>
    readonly createdAt: FieldRef<"Classroom", 'DateTime'>
    readonly updatedAt: FieldRef<"Classroom", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Classroom findUnique
   */
  export type ClassroomFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classroom
     */
    select?: ClassroomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classroom
     */
    omit?: ClassroomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomInclude<ExtArgs> | null
    /**
     * Filter, which Classroom to fetch.
     */
    where: ClassroomWhereUniqueInput
  }

  /**
   * Classroom findUniqueOrThrow
   */
  export type ClassroomFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classroom
     */
    select?: ClassroomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classroom
     */
    omit?: ClassroomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomInclude<ExtArgs> | null
    /**
     * Filter, which Classroom to fetch.
     */
    where: ClassroomWhereUniqueInput
  }

  /**
   * Classroom findFirst
   */
  export type ClassroomFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classroom
     */
    select?: ClassroomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classroom
     */
    omit?: ClassroomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomInclude<ExtArgs> | null
    /**
     * Filter, which Classroom to fetch.
     */
    where?: ClassroomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Classrooms to fetch.
     */
    orderBy?: ClassroomOrderByWithRelationInput | ClassroomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Classrooms.
     */
    cursor?: ClassroomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Classrooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Classrooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Classrooms.
     */
    distinct?: ClassroomScalarFieldEnum | ClassroomScalarFieldEnum[]
  }

  /**
   * Classroom findFirstOrThrow
   */
  export type ClassroomFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classroom
     */
    select?: ClassroomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classroom
     */
    omit?: ClassroomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomInclude<ExtArgs> | null
    /**
     * Filter, which Classroom to fetch.
     */
    where?: ClassroomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Classrooms to fetch.
     */
    orderBy?: ClassroomOrderByWithRelationInput | ClassroomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Classrooms.
     */
    cursor?: ClassroomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Classrooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Classrooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Classrooms.
     */
    distinct?: ClassroomScalarFieldEnum | ClassroomScalarFieldEnum[]
  }

  /**
   * Classroom findMany
   */
  export type ClassroomFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classroom
     */
    select?: ClassroomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classroom
     */
    omit?: ClassroomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomInclude<ExtArgs> | null
    /**
     * Filter, which Classrooms to fetch.
     */
    where?: ClassroomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Classrooms to fetch.
     */
    orderBy?: ClassroomOrderByWithRelationInput | ClassroomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Classrooms.
     */
    cursor?: ClassroomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Classrooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Classrooms.
     */
    skip?: number
    distinct?: ClassroomScalarFieldEnum | ClassroomScalarFieldEnum[]
  }

  /**
   * Classroom create
   */
  export type ClassroomCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classroom
     */
    select?: ClassroomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classroom
     */
    omit?: ClassroomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomInclude<ExtArgs> | null
    /**
     * The data needed to create a Classroom.
     */
    data: XOR<ClassroomCreateInput, ClassroomUncheckedCreateInput>
  }

  /**
   * Classroom createMany
   */
  export type ClassroomCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Classrooms.
     */
    data: ClassroomCreateManyInput | ClassroomCreateManyInput[]
  }

  /**
   * Classroom createManyAndReturn
   */
  export type ClassroomCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classroom
     */
    select?: ClassroomSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Classroom
     */
    omit?: ClassroomOmit<ExtArgs> | null
    /**
     * The data used to create many Classrooms.
     */
    data: ClassroomCreateManyInput | ClassroomCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Classroom update
   */
  export type ClassroomUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classroom
     */
    select?: ClassroomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classroom
     */
    omit?: ClassroomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomInclude<ExtArgs> | null
    /**
     * The data needed to update a Classroom.
     */
    data: XOR<ClassroomUpdateInput, ClassroomUncheckedUpdateInput>
    /**
     * Choose, which Classroom to update.
     */
    where: ClassroomWhereUniqueInput
  }

  /**
   * Classroom updateMany
   */
  export type ClassroomUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Classrooms.
     */
    data: XOR<ClassroomUpdateManyMutationInput, ClassroomUncheckedUpdateManyInput>
    /**
     * Filter which Classrooms to update
     */
    where?: ClassroomWhereInput
    /**
     * Limit how many Classrooms to update.
     */
    limit?: number
  }

  /**
   * Classroom updateManyAndReturn
   */
  export type ClassroomUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classroom
     */
    select?: ClassroomSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Classroom
     */
    omit?: ClassroomOmit<ExtArgs> | null
    /**
     * The data used to update Classrooms.
     */
    data: XOR<ClassroomUpdateManyMutationInput, ClassroomUncheckedUpdateManyInput>
    /**
     * Filter which Classrooms to update
     */
    where?: ClassroomWhereInput
    /**
     * Limit how many Classrooms to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Classroom upsert
   */
  export type ClassroomUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classroom
     */
    select?: ClassroomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classroom
     */
    omit?: ClassroomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomInclude<ExtArgs> | null
    /**
     * The filter to search for the Classroom to update in case it exists.
     */
    where: ClassroomWhereUniqueInput
    /**
     * In case the Classroom found by the `where` argument doesn't exist, create a new Classroom with this data.
     */
    create: XOR<ClassroomCreateInput, ClassroomUncheckedCreateInput>
    /**
     * In case the Classroom was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClassroomUpdateInput, ClassroomUncheckedUpdateInput>
  }

  /**
   * Classroom delete
   */
  export type ClassroomDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classroom
     */
    select?: ClassroomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classroom
     */
    omit?: ClassroomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomInclude<ExtArgs> | null
    /**
     * Filter which Classroom to delete.
     */
    where: ClassroomWhereUniqueInput
  }

  /**
   * Classroom deleteMany
   */
  export type ClassroomDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Classrooms to delete
     */
    where?: ClassroomWhereInput
    /**
     * Limit how many Classrooms to delete.
     */
    limit?: number
  }

  /**
   * Classroom.department
   */
  export type Classroom$departmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    where?: DepartmentWhereInput
  }

  /**
   * Classroom.enrollments
   */
  export type Classroom$enrollmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomEnrollment
     */
    select?: ClassroomEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassroomEnrollment
     */
    omit?: ClassroomEnrollmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomEnrollmentInclude<ExtArgs> | null
    where?: ClassroomEnrollmentWhereInput
    orderBy?: ClassroomEnrollmentOrderByWithRelationInput | ClassroomEnrollmentOrderByWithRelationInput[]
    cursor?: ClassroomEnrollmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClassroomEnrollmentScalarFieldEnum | ClassroomEnrollmentScalarFieldEnum[]
  }

  /**
   * Classroom without action
   */
  export type ClassroomDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classroom
     */
    select?: ClassroomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classroom
     */
    omit?: ClassroomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomInclude<ExtArgs> | null
  }


  /**
   * Model Department
   */

  export type AggregateDepartment = {
    _count: DepartmentCountAggregateOutputType | null
    _min: DepartmentMinAggregateOutputType | null
    _max: DepartmentMaxAggregateOutputType | null
  }

  export type DepartmentMinAggregateOutputType = {
    id: string | null
    institutionId: string | null
    name: string | null
    slug: string | null
    contact: string | null
    head: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DepartmentMaxAggregateOutputType = {
    id: string | null
    institutionId: string | null
    name: string | null
    slug: string | null
    contact: string | null
    head: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DepartmentCountAggregateOutputType = {
    id: number
    institutionId: number
    name: number
    slug: number
    contact: number
    head: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DepartmentMinAggregateInputType = {
    id?: true
    institutionId?: true
    name?: true
    slug?: true
    contact?: true
    head?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DepartmentMaxAggregateInputType = {
    id?: true
    institutionId?: true
    name?: true
    slug?: true
    contact?: true
    head?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DepartmentCountAggregateInputType = {
    id?: true
    institutionId?: true
    name?: true
    slug?: true
    contact?: true
    head?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DepartmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Department to aggregate.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Departments
    **/
    _count?: true | DepartmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DepartmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DepartmentMaxAggregateInputType
  }

  export type GetDepartmentAggregateType<T extends DepartmentAggregateArgs> = {
        [P in keyof T & keyof AggregateDepartment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDepartment[P]>
      : GetScalarType<T[P], AggregateDepartment[P]>
  }




  export type DepartmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentWhereInput
    orderBy?: DepartmentOrderByWithAggregationInput | DepartmentOrderByWithAggregationInput[]
    by: DepartmentScalarFieldEnum[] | DepartmentScalarFieldEnum
    having?: DepartmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DepartmentCountAggregateInputType | true
    _min?: DepartmentMinAggregateInputType
    _max?: DepartmentMaxAggregateInputType
  }

  export type DepartmentGroupByOutputType = {
    id: string
    institutionId: string
    name: string
    slug: string
    contact: string | null
    head: string | null
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: DepartmentCountAggregateOutputType | null
    _min: DepartmentMinAggregateOutputType | null
    _max: DepartmentMaxAggregateOutputType | null
  }

  type GetDepartmentGroupByPayload<T extends DepartmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DepartmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DepartmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DepartmentGroupByOutputType[P]>
            : GetScalarType<T[P], DepartmentGroupByOutputType[P]>
        }
      >
    >


  export type DepartmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    institutionId?: boolean
    name?: boolean
    slug?: boolean
    contact?: boolean
    head?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
    classrooms?: boolean | Department$classroomsArgs<ExtArgs>
    _count?: boolean | DepartmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["department"]>

  export type DepartmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    institutionId?: boolean
    name?: boolean
    slug?: boolean
    contact?: boolean
    head?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["department"]>

  export type DepartmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    institutionId?: boolean
    name?: boolean
    slug?: boolean
    contact?: boolean
    head?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["department"]>

  export type DepartmentSelectScalar = {
    id?: boolean
    institutionId?: boolean
    name?: boolean
    slug?: boolean
    contact?: boolean
    head?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DepartmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "institutionId" | "name" | "slug" | "contact" | "head" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["department"]>
  export type DepartmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
    classrooms?: boolean | Department$classroomsArgs<ExtArgs>
    _count?: boolean | DepartmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DepartmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
  }
  export type DepartmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
  }

  export type $DepartmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Department"
    objects: {
      institution: Prisma.$InstitutionPayload<ExtArgs>
      classrooms: Prisma.$ClassroomPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      institutionId: string
      name: string
      slug: string
      contact: string | null
      head: string | null
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["department"]>
    composites: {}
  }

  type DepartmentGetPayload<S extends boolean | null | undefined | DepartmentDefaultArgs> = $Result.GetResult<Prisma.$DepartmentPayload, S>

  type DepartmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DepartmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DepartmentCountAggregateInputType | true
    }

  export interface DepartmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Department'], meta: { name: 'Department' } }
    /**
     * Find zero or one Department that matches the filter.
     * @param {DepartmentFindUniqueArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DepartmentFindUniqueArgs>(args: SelectSubset<T, DepartmentFindUniqueArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Department that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DepartmentFindUniqueOrThrowArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DepartmentFindUniqueOrThrowArgs>(args: SelectSubset<T, DepartmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Department that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindFirstArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DepartmentFindFirstArgs>(args?: SelectSubset<T, DepartmentFindFirstArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Department that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindFirstOrThrowArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DepartmentFindFirstOrThrowArgs>(args?: SelectSubset<T, DepartmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Departments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Departments
     * const departments = await prisma.department.findMany()
     * 
     * // Get first 10 Departments
     * const departments = await prisma.department.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const departmentWithIdOnly = await prisma.department.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DepartmentFindManyArgs>(args?: SelectSubset<T, DepartmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Department.
     * @param {DepartmentCreateArgs} args - Arguments to create a Department.
     * @example
     * // Create one Department
     * const Department = await prisma.department.create({
     *   data: {
     *     // ... data to create a Department
     *   }
     * })
     * 
     */
    create<T extends DepartmentCreateArgs>(args: SelectSubset<T, DepartmentCreateArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Departments.
     * @param {DepartmentCreateManyArgs} args - Arguments to create many Departments.
     * @example
     * // Create many Departments
     * const department = await prisma.department.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DepartmentCreateManyArgs>(args?: SelectSubset<T, DepartmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Departments and returns the data saved in the database.
     * @param {DepartmentCreateManyAndReturnArgs} args - Arguments to create many Departments.
     * @example
     * // Create many Departments
     * const department = await prisma.department.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Departments and only return the `id`
     * const departmentWithIdOnly = await prisma.department.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DepartmentCreateManyAndReturnArgs>(args?: SelectSubset<T, DepartmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Department.
     * @param {DepartmentDeleteArgs} args - Arguments to delete one Department.
     * @example
     * // Delete one Department
     * const Department = await prisma.department.delete({
     *   where: {
     *     // ... filter to delete one Department
     *   }
     * })
     * 
     */
    delete<T extends DepartmentDeleteArgs>(args: SelectSubset<T, DepartmentDeleteArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Department.
     * @param {DepartmentUpdateArgs} args - Arguments to update one Department.
     * @example
     * // Update one Department
     * const department = await prisma.department.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DepartmentUpdateArgs>(args: SelectSubset<T, DepartmentUpdateArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Departments.
     * @param {DepartmentDeleteManyArgs} args - Arguments to filter Departments to delete.
     * @example
     * // Delete a few Departments
     * const { count } = await prisma.department.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DepartmentDeleteManyArgs>(args?: SelectSubset<T, DepartmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Departments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Departments
     * const department = await prisma.department.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DepartmentUpdateManyArgs>(args: SelectSubset<T, DepartmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Departments and returns the data updated in the database.
     * @param {DepartmentUpdateManyAndReturnArgs} args - Arguments to update many Departments.
     * @example
     * // Update many Departments
     * const department = await prisma.department.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Departments and only return the `id`
     * const departmentWithIdOnly = await prisma.department.updateManyAndReturn({
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
    updateManyAndReturn<T extends DepartmentUpdateManyAndReturnArgs>(args: SelectSubset<T, DepartmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Department.
     * @param {DepartmentUpsertArgs} args - Arguments to update or create a Department.
     * @example
     * // Update or create a Department
     * const department = await prisma.department.upsert({
     *   create: {
     *     // ... data to create a Department
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Department we want to update
     *   }
     * })
     */
    upsert<T extends DepartmentUpsertArgs>(args: SelectSubset<T, DepartmentUpsertArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Departments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentCountArgs} args - Arguments to filter Departments to count.
     * @example
     * // Count the number of Departments
     * const count = await prisma.department.count({
     *   where: {
     *     // ... the filter for the Departments we want to count
     *   }
     * })
    **/
    count<T extends DepartmentCountArgs>(
      args?: Subset<T, DepartmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DepartmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Department.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DepartmentAggregateArgs>(args: Subset<T, DepartmentAggregateArgs>): Prisma.PrismaPromise<GetDepartmentAggregateType<T>>

    /**
     * Group by Department.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentGroupByArgs} args - Group by arguments.
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
      T extends DepartmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DepartmentGroupByArgs['orderBy'] }
        : { orderBy?: DepartmentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DepartmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDepartmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Department model
   */
  readonly fields: DepartmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Department.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DepartmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    institution<T extends InstitutionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InstitutionDefaultArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    classrooms<T extends Department$classroomsArgs<ExtArgs> = {}>(args?: Subset<T, Department$classroomsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassroomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Department model
   */
  interface DepartmentFieldRefs {
    readonly id: FieldRef<"Department", 'String'>
    readonly institutionId: FieldRef<"Department", 'String'>
    readonly name: FieldRef<"Department", 'String'>
    readonly slug: FieldRef<"Department", 'String'>
    readonly contact: FieldRef<"Department", 'String'>
    readonly head: FieldRef<"Department", 'String'>
    readonly active: FieldRef<"Department", 'Boolean'>
    readonly createdAt: FieldRef<"Department", 'DateTime'>
    readonly updatedAt: FieldRef<"Department", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Department findUnique
   */
  export type DepartmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department findUniqueOrThrow
   */
  export type DepartmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department findFirst
   */
  export type DepartmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department findFirstOrThrow
   */
  export type DepartmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department findMany
   */
  export type DepartmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Departments to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department create
   */
  export type DepartmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Department.
     */
    data: XOR<DepartmentCreateInput, DepartmentUncheckedCreateInput>
  }

  /**
   * Department createMany
   */
  export type DepartmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Departments.
     */
    data: DepartmentCreateManyInput | DepartmentCreateManyInput[]
  }

  /**
   * Department createManyAndReturn
   */
  export type DepartmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * The data used to create many Departments.
     */
    data: DepartmentCreateManyInput | DepartmentCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Department update
   */
  export type DepartmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Department.
     */
    data: XOR<DepartmentUpdateInput, DepartmentUncheckedUpdateInput>
    /**
     * Choose, which Department to update.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department updateMany
   */
  export type DepartmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Departments.
     */
    data: XOR<DepartmentUpdateManyMutationInput, DepartmentUncheckedUpdateManyInput>
    /**
     * Filter which Departments to update
     */
    where?: DepartmentWhereInput
    /**
     * Limit how many Departments to update.
     */
    limit?: number
  }

  /**
   * Department updateManyAndReturn
   */
  export type DepartmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * The data used to update Departments.
     */
    data: XOR<DepartmentUpdateManyMutationInput, DepartmentUncheckedUpdateManyInput>
    /**
     * Filter which Departments to update
     */
    where?: DepartmentWhereInput
    /**
     * Limit how many Departments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Department upsert
   */
  export type DepartmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Department to update in case it exists.
     */
    where: DepartmentWhereUniqueInput
    /**
     * In case the Department found by the `where` argument doesn't exist, create a new Department with this data.
     */
    create: XOR<DepartmentCreateInput, DepartmentUncheckedCreateInput>
    /**
     * In case the Department was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DepartmentUpdateInput, DepartmentUncheckedUpdateInput>
  }

  /**
   * Department delete
   */
  export type DepartmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter which Department to delete.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department deleteMany
   */
  export type DepartmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Departments to delete
     */
    where?: DepartmentWhereInput
    /**
     * Limit how many Departments to delete.
     */
    limit?: number
  }

  /**
   * Department.classrooms
   */
  export type Department$classroomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Classroom
     */
    select?: ClassroomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Classroom
     */
    omit?: ClassroomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomInclude<ExtArgs> | null
    where?: ClassroomWhereInput
    orderBy?: ClassroomOrderByWithRelationInput | ClassroomOrderByWithRelationInput[]
    cursor?: ClassroomWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClassroomScalarFieldEnum | ClassroomScalarFieldEnum[]
  }

  /**
   * Department without action
   */
  export type DepartmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
  }


  /**
   * Model InstitutionMember
   */

  export type AggregateInstitutionMember = {
    _count: InstitutionMemberCountAggregateOutputType | null
    _min: InstitutionMemberMinAggregateOutputType | null
    _max: InstitutionMemberMaxAggregateOutputType | null
  }

  export type InstitutionMemberMinAggregateOutputType = {
    id: string | null
    institutionId: string | null
    userId: string | null
    role: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InstitutionMemberMaxAggregateOutputType = {
    id: string | null
    institutionId: string | null
    userId: string | null
    role: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InstitutionMemberCountAggregateOutputType = {
    id: number
    institutionId: number
    userId: number
    role: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InstitutionMemberMinAggregateInputType = {
    id?: true
    institutionId?: true
    userId?: true
    role?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InstitutionMemberMaxAggregateInputType = {
    id?: true
    institutionId?: true
    userId?: true
    role?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InstitutionMemberCountAggregateInputType = {
    id?: true
    institutionId?: true
    userId?: true
    role?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InstitutionMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InstitutionMember to aggregate.
     */
    where?: InstitutionMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InstitutionMembers to fetch.
     */
    orderBy?: InstitutionMemberOrderByWithRelationInput | InstitutionMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InstitutionMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InstitutionMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InstitutionMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InstitutionMembers
    **/
    _count?: true | InstitutionMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InstitutionMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InstitutionMemberMaxAggregateInputType
  }

  export type GetInstitutionMemberAggregateType<T extends InstitutionMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateInstitutionMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInstitutionMember[P]>
      : GetScalarType<T[P], AggregateInstitutionMember[P]>
  }




  export type InstitutionMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InstitutionMemberWhereInput
    orderBy?: InstitutionMemberOrderByWithAggregationInput | InstitutionMemberOrderByWithAggregationInput[]
    by: InstitutionMemberScalarFieldEnum[] | InstitutionMemberScalarFieldEnum
    having?: InstitutionMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InstitutionMemberCountAggregateInputType | true
    _min?: InstitutionMemberMinAggregateInputType
    _max?: InstitutionMemberMaxAggregateInputType
  }

  export type InstitutionMemberGroupByOutputType = {
    id: string
    institutionId: string
    userId: string
    role: string
    status: string
    createdAt: Date
    updatedAt: Date
    _count: InstitutionMemberCountAggregateOutputType | null
    _min: InstitutionMemberMinAggregateOutputType | null
    _max: InstitutionMemberMaxAggregateOutputType | null
  }

  type GetInstitutionMemberGroupByPayload<T extends InstitutionMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InstitutionMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InstitutionMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InstitutionMemberGroupByOutputType[P]>
            : GetScalarType<T[P], InstitutionMemberGroupByOutputType[P]>
        }
      >
    >


  export type InstitutionMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    institutionId?: boolean
    userId?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["institutionMember"]>

  export type InstitutionMemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    institutionId?: boolean
    userId?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["institutionMember"]>

  export type InstitutionMemberSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    institutionId?: boolean
    userId?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["institutionMember"]>

  export type InstitutionMemberSelectScalar = {
    id?: boolean
    institutionId?: boolean
    userId?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InstitutionMemberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "institutionId" | "userId" | "role" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["institutionMember"]>
  export type InstitutionMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
  }
  export type InstitutionMemberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
  }
  export type InstitutionMemberIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
  }

  export type $InstitutionMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InstitutionMember"
    objects: {
      institution: Prisma.$InstitutionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      institutionId: string
      userId: string
      role: string
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["institutionMember"]>
    composites: {}
  }

  type InstitutionMemberGetPayload<S extends boolean | null | undefined | InstitutionMemberDefaultArgs> = $Result.GetResult<Prisma.$InstitutionMemberPayload, S>

  type InstitutionMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InstitutionMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InstitutionMemberCountAggregateInputType | true
    }

  export interface InstitutionMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InstitutionMember'], meta: { name: 'InstitutionMember' } }
    /**
     * Find zero or one InstitutionMember that matches the filter.
     * @param {InstitutionMemberFindUniqueArgs} args - Arguments to find a InstitutionMember
     * @example
     * // Get one InstitutionMember
     * const institutionMember = await prisma.institutionMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InstitutionMemberFindUniqueArgs>(args: SelectSubset<T, InstitutionMemberFindUniqueArgs<ExtArgs>>): Prisma__InstitutionMemberClient<$Result.GetResult<Prisma.$InstitutionMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InstitutionMember that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InstitutionMemberFindUniqueOrThrowArgs} args - Arguments to find a InstitutionMember
     * @example
     * // Get one InstitutionMember
     * const institutionMember = await prisma.institutionMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InstitutionMemberFindUniqueOrThrowArgs>(args: SelectSubset<T, InstitutionMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InstitutionMemberClient<$Result.GetResult<Prisma.$InstitutionMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InstitutionMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionMemberFindFirstArgs} args - Arguments to find a InstitutionMember
     * @example
     * // Get one InstitutionMember
     * const institutionMember = await prisma.institutionMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InstitutionMemberFindFirstArgs>(args?: SelectSubset<T, InstitutionMemberFindFirstArgs<ExtArgs>>): Prisma__InstitutionMemberClient<$Result.GetResult<Prisma.$InstitutionMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InstitutionMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionMemberFindFirstOrThrowArgs} args - Arguments to find a InstitutionMember
     * @example
     * // Get one InstitutionMember
     * const institutionMember = await prisma.institutionMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InstitutionMemberFindFirstOrThrowArgs>(args?: SelectSubset<T, InstitutionMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__InstitutionMemberClient<$Result.GetResult<Prisma.$InstitutionMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InstitutionMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InstitutionMembers
     * const institutionMembers = await prisma.institutionMember.findMany()
     * 
     * // Get first 10 InstitutionMembers
     * const institutionMembers = await prisma.institutionMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const institutionMemberWithIdOnly = await prisma.institutionMember.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InstitutionMemberFindManyArgs>(args?: SelectSubset<T, InstitutionMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitutionMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InstitutionMember.
     * @param {InstitutionMemberCreateArgs} args - Arguments to create a InstitutionMember.
     * @example
     * // Create one InstitutionMember
     * const InstitutionMember = await prisma.institutionMember.create({
     *   data: {
     *     // ... data to create a InstitutionMember
     *   }
     * })
     * 
     */
    create<T extends InstitutionMemberCreateArgs>(args: SelectSubset<T, InstitutionMemberCreateArgs<ExtArgs>>): Prisma__InstitutionMemberClient<$Result.GetResult<Prisma.$InstitutionMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InstitutionMembers.
     * @param {InstitutionMemberCreateManyArgs} args - Arguments to create many InstitutionMembers.
     * @example
     * // Create many InstitutionMembers
     * const institutionMember = await prisma.institutionMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InstitutionMemberCreateManyArgs>(args?: SelectSubset<T, InstitutionMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InstitutionMembers and returns the data saved in the database.
     * @param {InstitutionMemberCreateManyAndReturnArgs} args - Arguments to create many InstitutionMembers.
     * @example
     * // Create many InstitutionMembers
     * const institutionMember = await prisma.institutionMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InstitutionMembers and only return the `id`
     * const institutionMemberWithIdOnly = await prisma.institutionMember.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InstitutionMemberCreateManyAndReturnArgs>(args?: SelectSubset<T, InstitutionMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitutionMemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a InstitutionMember.
     * @param {InstitutionMemberDeleteArgs} args - Arguments to delete one InstitutionMember.
     * @example
     * // Delete one InstitutionMember
     * const InstitutionMember = await prisma.institutionMember.delete({
     *   where: {
     *     // ... filter to delete one InstitutionMember
     *   }
     * })
     * 
     */
    delete<T extends InstitutionMemberDeleteArgs>(args: SelectSubset<T, InstitutionMemberDeleteArgs<ExtArgs>>): Prisma__InstitutionMemberClient<$Result.GetResult<Prisma.$InstitutionMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InstitutionMember.
     * @param {InstitutionMemberUpdateArgs} args - Arguments to update one InstitutionMember.
     * @example
     * // Update one InstitutionMember
     * const institutionMember = await prisma.institutionMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InstitutionMemberUpdateArgs>(args: SelectSubset<T, InstitutionMemberUpdateArgs<ExtArgs>>): Prisma__InstitutionMemberClient<$Result.GetResult<Prisma.$InstitutionMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InstitutionMembers.
     * @param {InstitutionMemberDeleteManyArgs} args - Arguments to filter InstitutionMembers to delete.
     * @example
     * // Delete a few InstitutionMembers
     * const { count } = await prisma.institutionMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InstitutionMemberDeleteManyArgs>(args?: SelectSubset<T, InstitutionMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InstitutionMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InstitutionMembers
     * const institutionMember = await prisma.institutionMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InstitutionMemberUpdateManyArgs>(args: SelectSubset<T, InstitutionMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InstitutionMembers and returns the data updated in the database.
     * @param {InstitutionMemberUpdateManyAndReturnArgs} args - Arguments to update many InstitutionMembers.
     * @example
     * // Update many InstitutionMembers
     * const institutionMember = await prisma.institutionMember.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more InstitutionMembers and only return the `id`
     * const institutionMemberWithIdOnly = await prisma.institutionMember.updateManyAndReturn({
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
    updateManyAndReturn<T extends InstitutionMemberUpdateManyAndReturnArgs>(args: SelectSubset<T, InstitutionMemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitutionMemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one InstitutionMember.
     * @param {InstitutionMemberUpsertArgs} args - Arguments to update or create a InstitutionMember.
     * @example
     * // Update or create a InstitutionMember
     * const institutionMember = await prisma.institutionMember.upsert({
     *   create: {
     *     // ... data to create a InstitutionMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InstitutionMember we want to update
     *   }
     * })
     */
    upsert<T extends InstitutionMemberUpsertArgs>(args: SelectSubset<T, InstitutionMemberUpsertArgs<ExtArgs>>): Prisma__InstitutionMemberClient<$Result.GetResult<Prisma.$InstitutionMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InstitutionMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionMemberCountArgs} args - Arguments to filter InstitutionMembers to count.
     * @example
     * // Count the number of InstitutionMembers
     * const count = await prisma.institutionMember.count({
     *   where: {
     *     // ... the filter for the InstitutionMembers we want to count
     *   }
     * })
    **/
    count<T extends InstitutionMemberCountArgs>(
      args?: Subset<T, InstitutionMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InstitutionMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InstitutionMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InstitutionMemberAggregateArgs>(args: Subset<T, InstitutionMemberAggregateArgs>): Prisma.PrismaPromise<GetInstitutionMemberAggregateType<T>>

    /**
     * Group by InstitutionMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionMemberGroupByArgs} args - Group by arguments.
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
      T extends InstitutionMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InstitutionMemberGroupByArgs['orderBy'] }
        : { orderBy?: InstitutionMemberGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InstitutionMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInstitutionMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InstitutionMember model
   */
  readonly fields: InstitutionMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InstitutionMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InstitutionMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    institution<T extends InstitutionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InstitutionDefaultArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the InstitutionMember model
   */
  interface InstitutionMemberFieldRefs {
    readonly id: FieldRef<"InstitutionMember", 'String'>
    readonly institutionId: FieldRef<"InstitutionMember", 'String'>
    readonly userId: FieldRef<"InstitutionMember", 'String'>
    readonly role: FieldRef<"InstitutionMember", 'String'>
    readonly status: FieldRef<"InstitutionMember", 'String'>
    readonly createdAt: FieldRef<"InstitutionMember", 'DateTime'>
    readonly updatedAt: FieldRef<"InstitutionMember", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InstitutionMember findUnique
   */
  export type InstitutionMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionMember
     */
    select?: InstitutionMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionMember
     */
    omit?: InstitutionMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionMemberInclude<ExtArgs> | null
    /**
     * Filter, which InstitutionMember to fetch.
     */
    where: InstitutionMemberWhereUniqueInput
  }

  /**
   * InstitutionMember findUniqueOrThrow
   */
  export type InstitutionMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionMember
     */
    select?: InstitutionMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionMember
     */
    omit?: InstitutionMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionMemberInclude<ExtArgs> | null
    /**
     * Filter, which InstitutionMember to fetch.
     */
    where: InstitutionMemberWhereUniqueInput
  }

  /**
   * InstitutionMember findFirst
   */
  export type InstitutionMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionMember
     */
    select?: InstitutionMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionMember
     */
    omit?: InstitutionMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionMemberInclude<ExtArgs> | null
    /**
     * Filter, which InstitutionMember to fetch.
     */
    where?: InstitutionMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InstitutionMembers to fetch.
     */
    orderBy?: InstitutionMemberOrderByWithRelationInput | InstitutionMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InstitutionMembers.
     */
    cursor?: InstitutionMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InstitutionMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InstitutionMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InstitutionMembers.
     */
    distinct?: InstitutionMemberScalarFieldEnum | InstitutionMemberScalarFieldEnum[]
  }

  /**
   * InstitutionMember findFirstOrThrow
   */
  export type InstitutionMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionMember
     */
    select?: InstitutionMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionMember
     */
    omit?: InstitutionMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionMemberInclude<ExtArgs> | null
    /**
     * Filter, which InstitutionMember to fetch.
     */
    where?: InstitutionMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InstitutionMembers to fetch.
     */
    orderBy?: InstitutionMemberOrderByWithRelationInput | InstitutionMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InstitutionMembers.
     */
    cursor?: InstitutionMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InstitutionMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InstitutionMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InstitutionMembers.
     */
    distinct?: InstitutionMemberScalarFieldEnum | InstitutionMemberScalarFieldEnum[]
  }

  /**
   * InstitutionMember findMany
   */
  export type InstitutionMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionMember
     */
    select?: InstitutionMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionMember
     */
    omit?: InstitutionMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionMemberInclude<ExtArgs> | null
    /**
     * Filter, which InstitutionMembers to fetch.
     */
    where?: InstitutionMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InstitutionMembers to fetch.
     */
    orderBy?: InstitutionMemberOrderByWithRelationInput | InstitutionMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InstitutionMembers.
     */
    cursor?: InstitutionMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InstitutionMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InstitutionMembers.
     */
    skip?: number
    distinct?: InstitutionMemberScalarFieldEnum | InstitutionMemberScalarFieldEnum[]
  }

  /**
   * InstitutionMember create
   */
  export type InstitutionMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionMember
     */
    select?: InstitutionMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionMember
     */
    omit?: InstitutionMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a InstitutionMember.
     */
    data: XOR<InstitutionMemberCreateInput, InstitutionMemberUncheckedCreateInput>
  }

  /**
   * InstitutionMember createMany
   */
  export type InstitutionMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InstitutionMembers.
     */
    data: InstitutionMemberCreateManyInput | InstitutionMemberCreateManyInput[]
  }

  /**
   * InstitutionMember createManyAndReturn
   */
  export type InstitutionMemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionMember
     */
    select?: InstitutionMemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionMember
     */
    omit?: InstitutionMemberOmit<ExtArgs> | null
    /**
     * The data used to create many InstitutionMembers.
     */
    data: InstitutionMemberCreateManyInput | InstitutionMemberCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionMemberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InstitutionMember update
   */
  export type InstitutionMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionMember
     */
    select?: InstitutionMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionMember
     */
    omit?: InstitutionMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a InstitutionMember.
     */
    data: XOR<InstitutionMemberUpdateInput, InstitutionMemberUncheckedUpdateInput>
    /**
     * Choose, which InstitutionMember to update.
     */
    where: InstitutionMemberWhereUniqueInput
  }

  /**
   * InstitutionMember updateMany
   */
  export type InstitutionMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InstitutionMembers.
     */
    data: XOR<InstitutionMemberUpdateManyMutationInput, InstitutionMemberUncheckedUpdateManyInput>
    /**
     * Filter which InstitutionMembers to update
     */
    where?: InstitutionMemberWhereInput
    /**
     * Limit how many InstitutionMembers to update.
     */
    limit?: number
  }

  /**
   * InstitutionMember updateManyAndReturn
   */
  export type InstitutionMemberUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionMember
     */
    select?: InstitutionMemberSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionMember
     */
    omit?: InstitutionMemberOmit<ExtArgs> | null
    /**
     * The data used to update InstitutionMembers.
     */
    data: XOR<InstitutionMemberUpdateManyMutationInput, InstitutionMemberUncheckedUpdateManyInput>
    /**
     * Filter which InstitutionMembers to update
     */
    where?: InstitutionMemberWhereInput
    /**
     * Limit how many InstitutionMembers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionMemberIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * InstitutionMember upsert
   */
  export type InstitutionMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionMember
     */
    select?: InstitutionMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionMember
     */
    omit?: InstitutionMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the InstitutionMember to update in case it exists.
     */
    where: InstitutionMemberWhereUniqueInput
    /**
     * In case the InstitutionMember found by the `where` argument doesn't exist, create a new InstitutionMember with this data.
     */
    create: XOR<InstitutionMemberCreateInput, InstitutionMemberUncheckedCreateInput>
    /**
     * In case the InstitutionMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InstitutionMemberUpdateInput, InstitutionMemberUncheckedUpdateInput>
  }

  /**
   * InstitutionMember delete
   */
  export type InstitutionMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionMember
     */
    select?: InstitutionMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionMember
     */
    omit?: InstitutionMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionMemberInclude<ExtArgs> | null
    /**
     * Filter which InstitutionMember to delete.
     */
    where: InstitutionMemberWhereUniqueInput
  }

  /**
   * InstitutionMember deleteMany
   */
  export type InstitutionMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InstitutionMembers to delete
     */
    where?: InstitutionMemberWhereInput
    /**
     * Limit how many InstitutionMembers to delete.
     */
    limit?: number
  }

  /**
   * InstitutionMember without action
   */
  export type InstitutionMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionMember
     */
    select?: InstitutionMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionMember
     */
    omit?: InstitutionMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionMemberInclude<ExtArgs> | null
  }


  /**
   * Model ClassroomEnrollment
   */

  export type AggregateClassroomEnrollment = {
    _count: ClassroomEnrollmentCountAggregateOutputType | null
    _min: ClassroomEnrollmentMinAggregateOutputType | null
    _max: ClassroomEnrollmentMaxAggregateOutputType | null
  }

  export type ClassroomEnrollmentMinAggregateOutputType = {
    id: string | null
    classroomId: string | null
    studentId: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClassroomEnrollmentMaxAggregateOutputType = {
    id: string | null
    classroomId: string | null
    studentId: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClassroomEnrollmentCountAggregateOutputType = {
    id: number
    classroomId: number
    studentId: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClassroomEnrollmentMinAggregateInputType = {
    id?: true
    classroomId?: true
    studentId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClassroomEnrollmentMaxAggregateInputType = {
    id?: true
    classroomId?: true
    studentId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClassroomEnrollmentCountAggregateInputType = {
    id?: true
    classroomId?: true
    studentId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClassroomEnrollmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClassroomEnrollment to aggregate.
     */
    where?: ClassroomEnrollmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClassroomEnrollments to fetch.
     */
    orderBy?: ClassroomEnrollmentOrderByWithRelationInput | ClassroomEnrollmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClassroomEnrollmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClassroomEnrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClassroomEnrollments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClassroomEnrollments
    **/
    _count?: true | ClassroomEnrollmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClassroomEnrollmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClassroomEnrollmentMaxAggregateInputType
  }

  export type GetClassroomEnrollmentAggregateType<T extends ClassroomEnrollmentAggregateArgs> = {
        [P in keyof T & keyof AggregateClassroomEnrollment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClassroomEnrollment[P]>
      : GetScalarType<T[P], AggregateClassroomEnrollment[P]>
  }




  export type ClassroomEnrollmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClassroomEnrollmentWhereInput
    orderBy?: ClassroomEnrollmentOrderByWithAggregationInput | ClassroomEnrollmentOrderByWithAggregationInput[]
    by: ClassroomEnrollmentScalarFieldEnum[] | ClassroomEnrollmentScalarFieldEnum
    having?: ClassroomEnrollmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClassroomEnrollmentCountAggregateInputType | true
    _min?: ClassroomEnrollmentMinAggregateInputType
    _max?: ClassroomEnrollmentMaxAggregateInputType
  }

  export type ClassroomEnrollmentGroupByOutputType = {
    id: string
    classroomId: string
    studentId: string
    status: string
    createdAt: Date
    updatedAt: Date
    _count: ClassroomEnrollmentCountAggregateOutputType | null
    _min: ClassroomEnrollmentMinAggregateOutputType | null
    _max: ClassroomEnrollmentMaxAggregateOutputType | null
  }

  type GetClassroomEnrollmentGroupByPayload<T extends ClassroomEnrollmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClassroomEnrollmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClassroomEnrollmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClassroomEnrollmentGroupByOutputType[P]>
            : GetScalarType<T[P], ClassroomEnrollmentGroupByOutputType[P]>
        }
      >
    >


  export type ClassroomEnrollmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    classroomId?: boolean
    studentId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    classroom?: boolean | ClassroomDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["classroomEnrollment"]>

  export type ClassroomEnrollmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    classroomId?: boolean
    studentId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    classroom?: boolean | ClassroomDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["classroomEnrollment"]>

  export type ClassroomEnrollmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    classroomId?: boolean
    studentId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    classroom?: boolean | ClassroomDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["classroomEnrollment"]>

  export type ClassroomEnrollmentSelectScalar = {
    id?: boolean
    classroomId?: boolean
    studentId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClassroomEnrollmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "classroomId" | "studentId" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["classroomEnrollment"]>
  export type ClassroomEnrollmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classroom?: boolean | ClassroomDefaultArgs<ExtArgs>
  }
  export type ClassroomEnrollmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classroom?: boolean | ClassroomDefaultArgs<ExtArgs>
  }
  export type ClassroomEnrollmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    classroom?: boolean | ClassroomDefaultArgs<ExtArgs>
  }

  export type $ClassroomEnrollmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClassroomEnrollment"
    objects: {
      classroom: Prisma.$ClassroomPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      classroomId: string
      studentId: string
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["classroomEnrollment"]>
    composites: {}
  }

  type ClassroomEnrollmentGetPayload<S extends boolean | null | undefined | ClassroomEnrollmentDefaultArgs> = $Result.GetResult<Prisma.$ClassroomEnrollmentPayload, S>

  type ClassroomEnrollmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClassroomEnrollmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClassroomEnrollmentCountAggregateInputType | true
    }

  export interface ClassroomEnrollmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClassroomEnrollment'], meta: { name: 'ClassroomEnrollment' } }
    /**
     * Find zero or one ClassroomEnrollment that matches the filter.
     * @param {ClassroomEnrollmentFindUniqueArgs} args - Arguments to find a ClassroomEnrollment
     * @example
     * // Get one ClassroomEnrollment
     * const classroomEnrollment = await prisma.classroomEnrollment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClassroomEnrollmentFindUniqueArgs>(args: SelectSubset<T, ClassroomEnrollmentFindUniqueArgs<ExtArgs>>): Prisma__ClassroomEnrollmentClient<$Result.GetResult<Prisma.$ClassroomEnrollmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ClassroomEnrollment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClassroomEnrollmentFindUniqueOrThrowArgs} args - Arguments to find a ClassroomEnrollment
     * @example
     * // Get one ClassroomEnrollment
     * const classroomEnrollment = await prisma.classroomEnrollment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClassroomEnrollmentFindUniqueOrThrowArgs>(args: SelectSubset<T, ClassroomEnrollmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClassroomEnrollmentClient<$Result.GetResult<Prisma.$ClassroomEnrollmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClassroomEnrollment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomEnrollmentFindFirstArgs} args - Arguments to find a ClassroomEnrollment
     * @example
     * // Get one ClassroomEnrollment
     * const classroomEnrollment = await prisma.classroomEnrollment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClassroomEnrollmentFindFirstArgs>(args?: SelectSubset<T, ClassroomEnrollmentFindFirstArgs<ExtArgs>>): Prisma__ClassroomEnrollmentClient<$Result.GetResult<Prisma.$ClassroomEnrollmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClassroomEnrollment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomEnrollmentFindFirstOrThrowArgs} args - Arguments to find a ClassroomEnrollment
     * @example
     * // Get one ClassroomEnrollment
     * const classroomEnrollment = await prisma.classroomEnrollment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClassroomEnrollmentFindFirstOrThrowArgs>(args?: SelectSubset<T, ClassroomEnrollmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClassroomEnrollmentClient<$Result.GetResult<Prisma.$ClassroomEnrollmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ClassroomEnrollments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomEnrollmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClassroomEnrollments
     * const classroomEnrollments = await prisma.classroomEnrollment.findMany()
     * 
     * // Get first 10 ClassroomEnrollments
     * const classroomEnrollments = await prisma.classroomEnrollment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const classroomEnrollmentWithIdOnly = await prisma.classroomEnrollment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClassroomEnrollmentFindManyArgs>(args?: SelectSubset<T, ClassroomEnrollmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassroomEnrollmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ClassroomEnrollment.
     * @param {ClassroomEnrollmentCreateArgs} args - Arguments to create a ClassroomEnrollment.
     * @example
     * // Create one ClassroomEnrollment
     * const ClassroomEnrollment = await prisma.classroomEnrollment.create({
     *   data: {
     *     // ... data to create a ClassroomEnrollment
     *   }
     * })
     * 
     */
    create<T extends ClassroomEnrollmentCreateArgs>(args: SelectSubset<T, ClassroomEnrollmentCreateArgs<ExtArgs>>): Prisma__ClassroomEnrollmentClient<$Result.GetResult<Prisma.$ClassroomEnrollmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ClassroomEnrollments.
     * @param {ClassroomEnrollmentCreateManyArgs} args - Arguments to create many ClassroomEnrollments.
     * @example
     * // Create many ClassroomEnrollments
     * const classroomEnrollment = await prisma.classroomEnrollment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClassroomEnrollmentCreateManyArgs>(args?: SelectSubset<T, ClassroomEnrollmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClassroomEnrollments and returns the data saved in the database.
     * @param {ClassroomEnrollmentCreateManyAndReturnArgs} args - Arguments to create many ClassroomEnrollments.
     * @example
     * // Create many ClassroomEnrollments
     * const classroomEnrollment = await prisma.classroomEnrollment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClassroomEnrollments and only return the `id`
     * const classroomEnrollmentWithIdOnly = await prisma.classroomEnrollment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClassroomEnrollmentCreateManyAndReturnArgs>(args?: SelectSubset<T, ClassroomEnrollmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassroomEnrollmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ClassroomEnrollment.
     * @param {ClassroomEnrollmentDeleteArgs} args - Arguments to delete one ClassroomEnrollment.
     * @example
     * // Delete one ClassroomEnrollment
     * const ClassroomEnrollment = await prisma.classroomEnrollment.delete({
     *   where: {
     *     // ... filter to delete one ClassroomEnrollment
     *   }
     * })
     * 
     */
    delete<T extends ClassroomEnrollmentDeleteArgs>(args: SelectSubset<T, ClassroomEnrollmentDeleteArgs<ExtArgs>>): Prisma__ClassroomEnrollmentClient<$Result.GetResult<Prisma.$ClassroomEnrollmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ClassroomEnrollment.
     * @param {ClassroomEnrollmentUpdateArgs} args - Arguments to update one ClassroomEnrollment.
     * @example
     * // Update one ClassroomEnrollment
     * const classroomEnrollment = await prisma.classroomEnrollment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClassroomEnrollmentUpdateArgs>(args: SelectSubset<T, ClassroomEnrollmentUpdateArgs<ExtArgs>>): Prisma__ClassroomEnrollmentClient<$Result.GetResult<Prisma.$ClassroomEnrollmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ClassroomEnrollments.
     * @param {ClassroomEnrollmentDeleteManyArgs} args - Arguments to filter ClassroomEnrollments to delete.
     * @example
     * // Delete a few ClassroomEnrollments
     * const { count } = await prisma.classroomEnrollment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClassroomEnrollmentDeleteManyArgs>(args?: SelectSubset<T, ClassroomEnrollmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClassroomEnrollments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomEnrollmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClassroomEnrollments
     * const classroomEnrollment = await prisma.classroomEnrollment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClassroomEnrollmentUpdateManyArgs>(args: SelectSubset<T, ClassroomEnrollmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClassroomEnrollments and returns the data updated in the database.
     * @param {ClassroomEnrollmentUpdateManyAndReturnArgs} args - Arguments to update many ClassroomEnrollments.
     * @example
     * // Update many ClassroomEnrollments
     * const classroomEnrollment = await prisma.classroomEnrollment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ClassroomEnrollments and only return the `id`
     * const classroomEnrollmentWithIdOnly = await prisma.classroomEnrollment.updateManyAndReturn({
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
    updateManyAndReturn<T extends ClassroomEnrollmentUpdateManyAndReturnArgs>(args: SelectSubset<T, ClassroomEnrollmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassroomEnrollmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ClassroomEnrollment.
     * @param {ClassroomEnrollmentUpsertArgs} args - Arguments to update or create a ClassroomEnrollment.
     * @example
     * // Update or create a ClassroomEnrollment
     * const classroomEnrollment = await prisma.classroomEnrollment.upsert({
     *   create: {
     *     // ... data to create a ClassroomEnrollment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClassroomEnrollment we want to update
     *   }
     * })
     */
    upsert<T extends ClassroomEnrollmentUpsertArgs>(args: SelectSubset<T, ClassroomEnrollmentUpsertArgs<ExtArgs>>): Prisma__ClassroomEnrollmentClient<$Result.GetResult<Prisma.$ClassroomEnrollmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ClassroomEnrollments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomEnrollmentCountArgs} args - Arguments to filter ClassroomEnrollments to count.
     * @example
     * // Count the number of ClassroomEnrollments
     * const count = await prisma.classroomEnrollment.count({
     *   where: {
     *     // ... the filter for the ClassroomEnrollments we want to count
     *   }
     * })
    **/
    count<T extends ClassroomEnrollmentCountArgs>(
      args?: Subset<T, ClassroomEnrollmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClassroomEnrollmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClassroomEnrollment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomEnrollmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ClassroomEnrollmentAggregateArgs>(args: Subset<T, ClassroomEnrollmentAggregateArgs>): Prisma.PrismaPromise<GetClassroomEnrollmentAggregateType<T>>

    /**
     * Group by ClassroomEnrollment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassroomEnrollmentGroupByArgs} args - Group by arguments.
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
      T extends ClassroomEnrollmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClassroomEnrollmentGroupByArgs['orderBy'] }
        : { orderBy?: ClassroomEnrollmentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ClassroomEnrollmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClassroomEnrollmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClassroomEnrollment model
   */
  readonly fields: ClassroomEnrollmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClassroomEnrollment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClassroomEnrollmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    classroom<T extends ClassroomDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClassroomDefaultArgs<ExtArgs>>): Prisma__ClassroomClient<$Result.GetResult<Prisma.$ClassroomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ClassroomEnrollment model
   */
  interface ClassroomEnrollmentFieldRefs {
    readonly id: FieldRef<"ClassroomEnrollment", 'String'>
    readonly classroomId: FieldRef<"ClassroomEnrollment", 'String'>
    readonly studentId: FieldRef<"ClassroomEnrollment", 'String'>
    readonly status: FieldRef<"ClassroomEnrollment", 'String'>
    readonly createdAt: FieldRef<"ClassroomEnrollment", 'DateTime'>
    readonly updatedAt: FieldRef<"ClassroomEnrollment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ClassroomEnrollment findUnique
   */
  export type ClassroomEnrollmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomEnrollment
     */
    select?: ClassroomEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassroomEnrollment
     */
    omit?: ClassroomEnrollmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomEnrollmentInclude<ExtArgs> | null
    /**
     * Filter, which ClassroomEnrollment to fetch.
     */
    where: ClassroomEnrollmentWhereUniqueInput
  }

  /**
   * ClassroomEnrollment findUniqueOrThrow
   */
  export type ClassroomEnrollmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomEnrollment
     */
    select?: ClassroomEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassroomEnrollment
     */
    omit?: ClassroomEnrollmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomEnrollmentInclude<ExtArgs> | null
    /**
     * Filter, which ClassroomEnrollment to fetch.
     */
    where: ClassroomEnrollmentWhereUniqueInput
  }

  /**
   * ClassroomEnrollment findFirst
   */
  export type ClassroomEnrollmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomEnrollment
     */
    select?: ClassroomEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassroomEnrollment
     */
    omit?: ClassroomEnrollmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomEnrollmentInclude<ExtArgs> | null
    /**
     * Filter, which ClassroomEnrollment to fetch.
     */
    where?: ClassroomEnrollmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClassroomEnrollments to fetch.
     */
    orderBy?: ClassroomEnrollmentOrderByWithRelationInput | ClassroomEnrollmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClassroomEnrollments.
     */
    cursor?: ClassroomEnrollmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClassroomEnrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClassroomEnrollments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClassroomEnrollments.
     */
    distinct?: ClassroomEnrollmentScalarFieldEnum | ClassroomEnrollmentScalarFieldEnum[]
  }

  /**
   * ClassroomEnrollment findFirstOrThrow
   */
  export type ClassroomEnrollmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomEnrollment
     */
    select?: ClassroomEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassroomEnrollment
     */
    omit?: ClassroomEnrollmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomEnrollmentInclude<ExtArgs> | null
    /**
     * Filter, which ClassroomEnrollment to fetch.
     */
    where?: ClassroomEnrollmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClassroomEnrollments to fetch.
     */
    orderBy?: ClassroomEnrollmentOrderByWithRelationInput | ClassroomEnrollmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClassroomEnrollments.
     */
    cursor?: ClassroomEnrollmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClassroomEnrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClassroomEnrollments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClassroomEnrollments.
     */
    distinct?: ClassroomEnrollmentScalarFieldEnum | ClassroomEnrollmentScalarFieldEnum[]
  }

  /**
   * ClassroomEnrollment findMany
   */
  export type ClassroomEnrollmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomEnrollment
     */
    select?: ClassroomEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassroomEnrollment
     */
    omit?: ClassroomEnrollmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomEnrollmentInclude<ExtArgs> | null
    /**
     * Filter, which ClassroomEnrollments to fetch.
     */
    where?: ClassroomEnrollmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClassroomEnrollments to fetch.
     */
    orderBy?: ClassroomEnrollmentOrderByWithRelationInput | ClassroomEnrollmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClassroomEnrollments.
     */
    cursor?: ClassroomEnrollmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClassroomEnrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClassroomEnrollments.
     */
    skip?: number
    distinct?: ClassroomEnrollmentScalarFieldEnum | ClassroomEnrollmentScalarFieldEnum[]
  }

  /**
   * ClassroomEnrollment create
   */
  export type ClassroomEnrollmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomEnrollment
     */
    select?: ClassroomEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassroomEnrollment
     */
    omit?: ClassroomEnrollmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomEnrollmentInclude<ExtArgs> | null
    /**
     * The data needed to create a ClassroomEnrollment.
     */
    data: XOR<ClassroomEnrollmentCreateInput, ClassroomEnrollmentUncheckedCreateInput>
  }

  /**
   * ClassroomEnrollment createMany
   */
  export type ClassroomEnrollmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClassroomEnrollments.
     */
    data: ClassroomEnrollmentCreateManyInput | ClassroomEnrollmentCreateManyInput[]
  }

  /**
   * ClassroomEnrollment createManyAndReturn
   */
  export type ClassroomEnrollmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomEnrollment
     */
    select?: ClassroomEnrollmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClassroomEnrollment
     */
    omit?: ClassroomEnrollmentOmit<ExtArgs> | null
    /**
     * The data used to create many ClassroomEnrollments.
     */
    data: ClassroomEnrollmentCreateManyInput | ClassroomEnrollmentCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomEnrollmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClassroomEnrollment update
   */
  export type ClassroomEnrollmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomEnrollment
     */
    select?: ClassroomEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassroomEnrollment
     */
    omit?: ClassroomEnrollmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomEnrollmentInclude<ExtArgs> | null
    /**
     * The data needed to update a ClassroomEnrollment.
     */
    data: XOR<ClassroomEnrollmentUpdateInput, ClassroomEnrollmentUncheckedUpdateInput>
    /**
     * Choose, which ClassroomEnrollment to update.
     */
    where: ClassroomEnrollmentWhereUniqueInput
  }

  /**
   * ClassroomEnrollment updateMany
   */
  export type ClassroomEnrollmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClassroomEnrollments.
     */
    data: XOR<ClassroomEnrollmentUpdateManyMutationInput, ClassroomEnrollmentUncheckedUpdateManyInput>
    /**
     * Filter which ClassroomEnrollments to update
     */
    where?: ClassroomEnrollmentWhereInput
    /**
     * Limit how many ClassroomEnrollments to update.
     */
    limit?: number
  }

  /**
   * ClassroomEnrollment updateManyAndReturn
   */
  export type ClassroomEnrollmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomEnrollment
     */
    select?: ClassroomEnrollmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClassroomEnrollment
     */
    omit?: ClassroomEnrollmentOmit<ExtArgs> | null
    /**
     * The data used to update ClassroomEnrollments.
     */
    data: XOR<ClassroomEnrollmentUpdateManyMutationInput, ClassroomEnrollmentUncheckedUpdateManyInput>
    /**
     * Filter which ClassroomEnrollments to update
     */
    where?: ClassroomEnrollmentWhereInput
    /**
     * Limit how many ClassroomEnrollments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomEnrollmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClassroomEnrollment upsert
   */
  export type ClassroomEnrollmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomEnrollment
     */
    select?: ClassroomEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassroomEnrollment
     */
    omit?: ClassroomEnrollmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomEnrollmentInclude<ExtArgs> | null
    /**
     * The filter to search for the ClassroomEnrollment to update in case it exists.
     */
    where: ClassroomEnrollmentWhereUniqueInput
    /**
     * In case the ClassroomEnrollment found by the `where` argument doesn't exist, create a new ClassroomEnrollment with this data.
     */
    create: XOR<ClassroomEnrollmentCreateInput, ClassroomEnrollmentUncheckedCreateInput>
    /**
     * In case the ClassroomEnrollment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClassroomEnrollmentUpdateInput, ClassroomEnrollmentUncheckedUpdateInput>
  }

  /**
   * ClassroomEnrollment delete
   */
  export type ClassroomEnrollmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomEnrollment
     */
    select?: ClassroomEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassroomEnrollment
     */
    omit?: ClassroomEnrollmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomEnrollmentInclude<ExtArgs> | null
    /**
     * Filter which ClassroomEnrollment to delete.
     */
    where: ClassroomEnrollmentWhereUniqueInput
  }

  /**
   * ClassroomEnrollment deleteMany
   */
  export type ClassroomEnrollmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClassroomEnrollments to delete
     */
    where?: ClassroomEnrollmentWhereInput
    /**
     * Limit how many ClassroomEnrollments to delete.
     */
    limit?: number
  }

  /**
   * ClassroomEnrollment without action
   */
  export type ClassroomEnrollmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassroomEnrollment
     */
    select?: ClassroomEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassroomEnrollment
     */
    omit?: ClassroomEnrollmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClassroomEnrollmentInclude<ExtArgs> | null
  }


  /**
   * Model InstitutionInvite
   */

  export type AggregateInstitutionInvite = {
    _count: InstitutionInviteCountAggregateOutputType | null
    _min: InstitutionInviteMinAggregateOutputType | null
    _max: InstitutionInviteMaxAggregateOutputType | null
  }

  export type InstitutionInviteMinAggregateOutputType = {
    id: string | null
    institutionId: string | null
    code: string | null
    role: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type InstitutionInviteMaxAggregateOutputType = {
    id: string | null
    institutionId: string | null
    code: string | null
    role: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type InstitutionInviteCountAggregateOutputType = {
    id: number
    institutionId: number
    code: number
    role: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type InstitutionInviteMinAggregateInputType = {
    id?: true
    institutionId?: true
    code?: true
    role?: true
    expiresAt?: true
    createdAt?: true
  }

  export type InstitutionInviteMaxAggregateInputType = {
    id?: true
    institutionId?: true
    code?: true
    role?: true
    expiresAt?: true
    createdAt?: true
  }

  export type InstitutionInviteCountAggregateInputType = {
    id?: true
    institutionId?: true
    code?: true
    role?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type InstitutionInviteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InstitutionInvite to aggregate.
     */
    where?: InstitutionInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InstitutionInvites to fetch.
     */
    orderBy?: InstitutionInviteOrderByWithRelationInput | InstitutionInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InstitutionInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InstitutionInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InstitutionInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InstitutionInvites
    **/
    _count?: true | InstitutionInviteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InstitutionInviteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InstitutionInviteMaxAggregateInputType
  }

  export type GetInstitutionInviteAggregateType<T extends InstitutionInviteAggregateArgs> = {
        [P in keyof T & keyof AggregateInstitutionInvite]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInstitutionInvite[P]>
      : GetScalarType<T[P], AggregateInstitutionInvite[P]>
  }




  export type InstitutionInviteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InstitutionInviteWhereInput
    orderBy?: InstitutionInviteOrderByWithAggregationInput | InstitutionInviteOrderByWithAggregationInput[]
    by: InstitutionInviteScalarFieldEnum[] | InstitutionInviteScalarFieldEnum
    having?: InstitutionInviteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InstitutionInviteCountAggregateInputType | true
    _min?: InstitutionInviteMinAggregateInputType
    _max?: InstitutionInviteMaxAggregateInputType
  }

  export type InstitutionInviteGroupByOutputType = {
    id: string
    institutionId: string
    code: string
    role: string
    expiresAt: Date | null
    createdAt: Date
    _count: InstitutionInviteCountAggregateOutputType | null
    _min: InstitutionInviteMinAggregateOutputType | null
    _max: InstitutionInviteMaxAggregateOutputType | null
  }

  type GetInstitutionInviteGroupByPayload<T extends InstitutionInviteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InstitutionInviteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InstitutionInviteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InstitutionInviteGroupByOutputType[P]>
            : GetScalarType<T[P], InstitutionInviteGroupByOutputType[P]>
        }
      >
    >


  export type InstitutionInviteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    institutionId?: boolean
    code?: boolean
    role?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["institutionInvite"]>

  export type InstitutionInviteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    institutionId?: boolean
    code?: boolean
    role?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["institutionInvite"]>

  export type InstitutionInviteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    institutionId?: boolean
    code?: boolean
    role?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["institutionInvite"]>

  export type InstitutionInviteSelectScalar = {
    id?: boolean
    institutionId?: boolean
    code?: boolean
    role?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type InstitutionInviteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "institutionId" | "code" | "role" | "expiresAt" | "createdAt", ExtArgs["result"]["institutionInvite"]>
  export type InstitutionInviteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
  }
  export type InstitutionInviteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
  }
  export type InstitutionInviteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    institution?: boolean | InstitutionDefaultArgs<ExtArgs>
  }

  export type $InstitutionInvitePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InstitutionInvite"
    objects: {
      institution: Prisma.$InstitutionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      institutionId: string
      code: string
      role: string
      expiresAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["institutionInvite"]>
    composites: {}
  }

  type InstitutionInviteGetPayload<S extends boolean | null | undefined | InstitutionInviteDefaultArgs> = $Result.GetResult<Prisma.$InstitutionInvitePayload, S>

  type InstitutionInviteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InstitutionInviteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InstitutionInviteCountAggregateInputType | true
    }

  export interface InstitutionInviteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InstitutionInvite'], meta: { name: 'InstitutionInvite' } }
    /**
     * Find zero or one InstitutionInvite that matches the filter.
     * @param {InstitutionInviteFindUniqueArgs} args - Arguments to find a InstitutionInvite
     * @example
     * // Get one InstitutionInvite
     * const institutionInvite = await prisma.institutionInvite.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InstitutionInviteFindUniqueArgs>(args: SelectSubset<T, InstitutionInviteFindUniqueArgs<ExtArgs>>): Prisma__InstitutionInviteClient<$Result.GetResult<Prisma.$InstitutionInvitePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InstitutionInvite that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InstitutionInviteFindUniqueOrThrowArgs} args - Arguments to find a InstitutionInvite
     * @example
     * // Get one InstitutionInvite
     * const institutionInvite = await prisma.institutionInvite.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InstitutionInviteFindUniqueOrThrowArgs>(args: SelectSubset<T, InstitutionInviteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InstitutionInviteClient<$Result.GetResult<Prisma.$InstitutionInvitePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InstitutionInvite that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionInviteFindFirstArgs} args - Arguments to find a InstitutionInvite
     * @example
     * // Get one InstitutionInvite
     * const institutionInvite = await prisma.institutionInvite.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InstitutionInviteFindFirstArgs>(args?: SelectSubset<T, InstitutionInviteFindFirstArgs<ExtArgs>>): Prisma__InstitutionInviteClient<$Result.GetResult<Prisma.$InstitutionInvitePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InstitutionInvite that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionInviteFindFirstOrThrowArgs} args - Arguments to find a InstitutionInvite
     * @example
     * // Get one InstitutionInvite
     * const institutionInvite = await prisma.institutionInvite.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InstitutionInviteFindFirstOrThrowArgs>(args?: SelectSubset<T, InstitutionInviteFindFirstOrThrowArgs<ExtArgs>>): Prisma__InstitutionInviteClient<$Result.GetResult<Prisma.$InstitutionInvitePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InstitutionInvites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionInviteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InstitutionInvites
     * const institutionInvites = await prisma.institutionInvite.findMany()
     * 
     * // Get first 10 InstitutionInvites
     * const institutionInvites = await prisma.institutionInvite.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const institutionInviteWithIdOnly = await prisma.institutionInvite.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InstitutionInviteFindManyArgs>(args?: SelectSubset<T, InstitutionInviteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitutionInvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InstitutionInvite.
     * @param {InstitutionInviteCreateArgs} args - Arguments to create a InstitutionInvite.
     * @example
     * // Create one InstitutionInvite
     * const InstitutionInvite = await prisma.institutionInvite.create({
     *   data: {
     *     // ... data to create a InstitutionInvite
     *   }
     * })
     * 
     */
    create<T extends InstitutionInviteCreateArgs>(args: SelectSubset<T, InstitutionInviteCreateArgs<ExtArgs>>): Prisma__InstitutionInviteClient<$Result.GetResult<Prisma.$InstitutionInvitePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InstitutionInvites.
     * @param {InstitutionInviteCreateManyArgs} args - Arguments to create many InstitutionInvites.
     * @example
     * // Create many InstitutionInvites
     * const institutionInvite = await prisma.institutionInvite.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InstitutionInviteCreateManyArgs>(args?: SelectSubset<T, InstitutionInviteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InstitutionInvites and returns the data saved in the database.
     * @param {InstitutionInviteCreateManyAndReturnArgs} args - Arguments to create many InstitutionInvites.
     * @example
     * // Create many InstitutionInvites
     * const institutionInvite = await prisma.institutionInvite.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InstitutionInvites and only return the `id`
     * const institutionInviteWithIdOnly = await prisma.institutionInvite.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InstitutionInviteCreateManyAndReturnArgs>(args?: SelectSubset<T, InstitutionInviteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitutionInvitePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a InstitutionInvite.
     * @param {InstitutionInviteDeleteArgs} args - Arguments to delete one InstitutionInvite.
     * @example
     * // Delete one InstitutionInvite
     * const InstitutionInvite = await prisma.institutionInvite.delete({
     *   where: {
     *     // ... filter to delete one InstitutionInvite
     *   }
     * })
     * 
     */
    delete<T extends InstitutionInviteDeleteArgs>(args: SelectSubset<T, InstitutionInviteDeleteArgs<ExtArgs>>): Prisma__InstitutionInviteClient<$Result.GetResult<Prisma.$InstitutionInvitePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InstitutionInvite.
     * @param {InstitutionInviteUpdateArgs} args - Arguments to update one InstitutionInvite.
     * @example
     * // Update one InstitutionInvite
     * const institutionInvite = await prisma.institutionInvite.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InstitutionInviteUpdateArgs>(args: SelectSubset<T, InstitutionInviteUpdateArgs<ExtArgs>>): Prisma__InstitutionInviteClient<$Result.GetResult<Prisma.$InstitutionInvitePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InstitutionInvites.
     * @param {InstitutionInviteDeleteManyArgs} args - Arguments to filter InstitutionInvites to delete.
     * @example
     * // Delete a few InstitutionInvites
     * const { count } = await prisma.institutionInvite.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InstitutionInviteDeleteManyArgs>(args?: SelectSubset<T, InstitutionInviteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InstitutionInvites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionInviteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InstitutionInvites
     * const institutionInvite = await prisma.institutionInvite.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InstitutionInviteUpdateManyArgs>(args: SelectSubset<T, InstitutionInviteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InstitutionInvites and returns the data updated in the database.
     * @param {InstitutionInviteUpdateManyAndReturnArgs} args - Arguments to update many InstitutionInvites.
     * @example
     * // Update many InstitutionInvites
     * const institutionInvite = await prisma.institutionInvite.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more InstitutionInvites and only return the `id`
     * const institutionInviteWithIdOnly = await prisma.institutionInvite.updateManyAndReturn({
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
    updateManyAndReturn<T extends InstitutionInviteUpdateManyAndReturnArgs>(args: SelectSubset<T, InstitutionInviteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitutionInvitePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one InstitutionInvite.
     * @param {InstitutionInviteUpsertArgs} args - Arguments to update or create a InstitutionInvite.
     * @example
     * // Update or create a InstitutionInvite
     * const institutionInvite = await prisma.institutionInvite.upsert({
     *   create: {
     *     // ... data to create a InstitutionInvite
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InstitutionInvite we want to update
     *   }
     * })
     */
    upsert<T extends InstitutionInviteUpsertArgs>(args: SelectSubset<T, InstitutionInviteUpsertArgs<ExtArgs>>): Prisma__InstitutionInviteClient<$Result.GetResult<Prisma.$InstitutionInvitePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InstitutionInvites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionInviteCountArgs} args - Arguments to filter InstitutionInvites to count.
     * @example
     * // Count the number of InstitutionInvites
     * const count = await prisma.institutionInvite.count({
     *   where: {
     *     // ... the filter for the InstitutionInvites we want to count
     *   }
     * })
    **/
    count<T extends InstitutionInviteCountArgs>(
      args?: Subset<T, InstitutionInviteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InstitutionInviteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InstitutionInvite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionInviteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InstitutionInviteAggregateArgs>(args: Subset<T, InstitutionInviteAggregateArgs>): Prisma.PrismaPromise<GetInstitutionInviteAggregateType<T>>

    /**
     * Group by InstitutionInvite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitutionInviteGroupByArgs} args - Group by arguments.
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
      T extends InstitutionInviteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InstitutionInviteGroupByArgs['orderBy'] }
        : { orderBy?: InstitutionInviteGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InstitutionInviteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInstitutionInviteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InstitutionInvite model
   */
  readonly fields: InstitutionInviteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InstitutionInvite.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InstitutionInviteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    institution<T extends InstitutionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InstitutionDefaultArgs<ExtArgs>>): Prisma__InstitutionClient<$Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the InstitutionInvite model
   */
  interface InstitutionInviteFieldRefs {
    readonly id: FieldRef<"InstitutionInvite", 'String'>
    readonly institutionId: FieldRef<"InstitutionInvite", 'String'>
    readonly code: FieldRef<"InstitutionInvite", 'String'>
    readonly role: FieldRef<"InstitutionInvite", 'String'>
    readonly expiresAt: FieldRef<"InstitutionInvite", 'DateTime'>
    readonly createdAt: FieldRef<"InstitutionInvite", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InstitutionInvite findUnique
   */
  export type InstitutionInviteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionInvite
     */
    select?: InstitutionInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionInvite
     */
    omit?: InstitutionInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInviteInclude<ExtArgs> | null
    /**
     * Filter, which InstitutionInvite to fetch.
     */
    where: InstitutionInviteWhereUniqueInput
  }

  /**
   * InstitutionInvite findUniqueOrThrow
   */
  export type InstitutionInviteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionInvite
     */
    select?: InstitutionInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionInvite
     */
    omit?: InstitutionInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInviteInclude<ExtArgs> | null
    /**
     * Filter, which InstitutionInvite to fetch.
     */
    where: InstitutionInviteWhereUniqueInput
  }

  /**
   * InstitutionInvite findFirst
   */
  export type InstitutionInviteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionInvite
     */
    select?: InstitutionInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionInvite
     */
    omit?: InstitutionInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInviteInclude<ExtArgs> | null
    /**
     * Filter, which InstitutionInvite to fetch.
     */
    where?: InstitutionInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InstitutionInvites to fetch.
     */
    orderBy?: InstitutionInviteOrderByWithRelationInput | InstitutionInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InstitutionInvites.
     */
    cursor?: InstitutionInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InstitutionInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InstitutionInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InstitutionInvites.
     */
    distinct?: InstitutionInviteScalarFieldEnum | InstitutionInviteScalarFieldEnum[]
  }

  /**
   * InstitutionInvite findFirstOrThrow
   */
  export type InstitutionInviteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionInvite
     */
    select?: InstitutionInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionInvite
     */
    omit?: InstitutionInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInviteInclude<ExtArgs> | null
    /**
     * Filter, which InstitutionInvite to fetch.
     */
    where?: InstitutionInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InstitutionInvites to fetch.
     */
    orderBy?: InstitutionInviteOrderByWithRelationInput | InstitutionInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InstitutionInvites.
     */
    cursor?: InstitutionInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InstitutionInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InstitutionInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InstitutionInvites.
     */
    distinct?: InstitutionInviteScalarFieldEnum | InstitutionInviteScalarFieldEnum[]
  }

  /**
   * InstitutionInvite findMany
   */
  export type InstitutionInviteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionInvite
     */
    select?: InstitutionInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionInvite
     */
    omit?: InstitutionInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInviteInclude<ExtArgs> | null
    /**
     * Filter, which InstitutionInvites to fetch.
     */
    where?: InstitutionInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InstitutionInvites to fetch.
     */
    orderBy?: InstitutionInviteOrderByWithRelationInput | InstitutionInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InstitutionInvites.
     */
    cursor?: InstitutionInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InstitutionInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InstitutionInvites.
     */
    skip?: number
    distinct?: InstitutionInviteScalarFieldEnum | InstitutionInviteScalarFieldEnum[]
  }

  /**
   * InstitutionInvite create
   */
  export type InstitutionInviteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionInvite
     */
    select?: InstitutionInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionInvite
     */
    omit?: InstitutionInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInviteInclude<ExtArgs> | null
    /**
     * The data needed to create a InstitutionInvite.
     */
    data: XOR<InstitutionInviteCreateInput, InstitutionInviteUncheckedCreateInput>
  }

  /**
   * InstitutionInvite createMany
   */
  export type InstitutionInviteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InstitutionInvites.
     */
    data: InstitutionInviteCreateManyInput | InstitutionInviteCreateManyInput[]
  }

  /**
   * InstitutionInvite createManyAndReturn
   */
  export type InstitutionInviteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionInvite
     */
    select?: InstitutionInviteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionInvite
     */
    omit?: InstitutionInviteOmit<ExtArgs> | null
    /**
     * The data used to create many InstitutionInvites.
     */
    data: InstitutionInviteCreateManyInput | InstitutionInviteCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInviteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InstitutionInvite update
   */
  export type InstitutionInviteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionInvite
     */
    select?: InstitutionInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionInvite
     */
    omit?: InstitutionInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInviteInclude<ExtArgs> | null
    /**
     * The data needed to update a InstitutionInvite.
     */
    data: XOR<InstitutionInviteUpdateInput, InstitutionInviteUncheckedUpdateInput>
    /**
     * Choose, which InstitutionInvite to update.
     */
    where: InstitutionInviteWhereUniqueInput
  }

  /**
   * InstitutionInvite updateMany
   */
  export type InstitutionInviteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InstitutionInvites.
     */
    data: XOR<InstitutionInviteUpdateManyMutationInput, InstitutionInviteUncheckedUpdateManyInput>
    /**
     * Filter which InstitutionInvites to update
     */
    where?: InstitutionInviteWhereInput
    /**
     * Limit how many InstitutionInvites to update.
     */
    limit?: number
  }

  /**
   * InstitutionInvite updateManyAndReturn
   */
  export type InstitutionInviteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionInvite
     */
    select?: InstitutionInviteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionInvite
     */
    omit?: InstitutionInviteOmit<ExtArgs> | null
    /**
     * The data used to update InstitutionInvites.
     */
    data: XOR<InstitutionInviteUpdateManyMutationInput, InstitutionInviteUncheckedUpdateManyInput>
    /**
     * Filter which InstitutionInvites to update
     */
    where?: InstitutionInviteWhereInput
    /**
     * Limit how many InstitutionInvites to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInviteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * InstitutionInvite upsert
   */
  export type InstitutionInviteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionInvite
     */
    select?: InstitutionInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionInvite
     */
    omit?: InstitutionInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInviteInclude<ExtArgs> | null
    /**
     * The filter to search for the InstitutionInvite to update in case it exists.
     */
    where: InstitutionInviteWhereUniqueInput
    /**
     * In case the InstitutionInvite found by the `where` argument doesn't exist, create a new InstitutionInvite with this data.
     */
    create: XOR<InstitutionInviteCreateInput, InstitutionInviteUncheckedCreateInput>
    /**
     * In case the InstitutionInvite was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InstitutionInviteUpdateInput, InstitutionInviteUncheckedUpdateInput>
  }

  /**
   * InstitutionInvite delete
   */
  export type InstitutionInviteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionInvite
     */
    select?: InstitutionInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionInvite
     */
    omit?: InstitutionInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInviteInclude<ExtArgs> | null
    /**
     * Filter which InstitutionInvite to delete.
     */
    where: InstitutionInviteWhereUniqueInput
  }

  /**
   * InstitutionInvite deleteMany
   */
  export type InstitutionInviteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InstitutionInvites to delete
     */
    where?: InstitutionInviteWhereInput
    /**
     * Limit how many InstitutionInvites to delete.
     */
    limit?: number
  }

  /**
   * InstitutionInvite without action
   */
  export type InstitutionInviteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstitutionInvite
     */
    select?: InstitutionInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstitutionInvite
     */
    omit?: InstitutionInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstitutionInviteInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const InstitutionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    type: 'type',
    location: 'location',
    email: 'email',
    phone: 'phone',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InstitutionScalarFieldEnum = (typeof InstitutionScalarFieldEnum)[keyof typeof InstitutionScalarFieldEnum]


  export const ClassroomScalarFieldEnum: {
    id: 'id',
    institutionId: 'institutionId',
    departmentId: 'departmentId',
    teacherId: 'teacherId',
    title: 'title',
    code: 'code',
    capacity: 'capacity',
    status: 'status',
    startsAt: 'startsAt',
    endsAt: 'endsAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClassroomScalarFieldEnum = (typeof ClassroomScalarFieldEnum)[keyof typeof ClassroomScalarFieldEnum]


  export const DepartmentScalarFieldEnum: {
    id: 'id',
    institutionId: 'institutionId',
    name: 'name',
    slug: 'slug',
    contact: 'contact',
    head: 'head',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DepartmentScalarFieldEnum = (typeof DepartmentScalarFieldEnum)[keyof typeof DepartmentScalarFieldEnum]


  export const InstitutionMemberScalarFieldEnum: {
    id: 'id',
    institutionId: 'institutionId',
    userId: 'userId',
    role: 'role',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InstitutionMemberScalarFieldEnum = (typeof InstitutionMemberScalarFieldEnum)[keyof typeof InstitutionMemberScalarFieldEnum]


  export const ClassroomEnrollmentScalarFieldEnum: {
    id: 'id',
    classroomId: 'classroomId',
    studentId: 'studentId',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClassroomEnrollmentScalarFieldEnum = (typeof ClassroomEnrollmentScalarFieldEnum)[keyof typeof ClassroomEnrollmentScalarFieldEnum]


  export const InstitutionInviteScalarFieldEnum: {
    id: 'id',
    institutionId: 'institutionId',
    code: 'code',
    role: 'role',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type InstitutionInviteScalarFieldEnum = (typeof InstitutionInviteScalarFieldEnum)[keyof typeof InstitutionInviteScalarFieldEnum]


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


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


  export type InstitutionWhereInput = {
    AND?: InstitutionWhereInput | InstitutionWhereInput[]
    OR?: InstitutionWhereInput[]
    NOT?: InstitutionWhereInput | InstitutionWhereInput[]
    id?: StringFilter<"Institution"> | string
    name?: StringFilter<"Institution"> | string
    slug?: StringFilter<"Institution"> | string
    description?: StringNullableFilter<"Institution"> | string | null
    type?: StringNullableFilter<"Institution"> | string | null
    location?: StringNullableFilter<"Institution"> | string | null
    email?: StringNullableFilter<"Institution"> | string | null
    phone?: StringNullableFilter<"Institution"> | string | null
    active?: BoolFilter<"Institution"> | boolean
    createdAt?: DateTimeFilter<"Institution"> | Date | string
    updatedAt?: DateTimeFilter<"Institution"> | Date | string
    classrooms?: ClassroomListRelationFilter
    departments?: DepartmentListRelationFilter
    members?: InstitutionMemberListRelationFilter
    invites?: InstitutionInviteListRelationFilter
  }

  export type InstitutionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrderInput | SortOrder
    type?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    classrooms?: ClassroomOrderByRelationAggregateInput
    departments?: DepartmentOrderByRelationAggregateInput
    members?: InstitutionMemberOrderByRelationAggregateInput
    invites?: InstitutionInviteOrderByRelationAggregateInput
  }

  export type InstitutionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: InstitutionWhereInput | InstitutionWhereInput[]
    OR?: InstitutionWhereInput[]
    NOT?: InstitutionWhereInput | InstitutionWhereInput[]
    name?: StringFilter<"Institution"> | string
    description?: StringNullableFilter<"Institution"> | string | null
    type?: StringNullableFilter<"Institution"> | string | null
    location?: StringNullableFilter<"Institution"> | string | null
    email?: StringNullableFilter<"Institution"> | string | null
    phone?: StringNullableFilter<"Institution"> | string | null
    active?: BoolFilter<"Institution"> | boolean
    createdAt?: DateTimeFilter<"Institution"> | Date | string
    updatedAt?: DateTimeFilter<"Institution"> | Date | string
    classrooms?: ClassroomListRelationFilter
    departments?: DepartmentListRelationFilter
    members?: InstitutionMemberListRelationFilter
    invites?: InstitutionInviteListRelationFilter
  }, "id" | "slug">

  export type InstitutionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrderInput | SortOrder
    type?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InstitutionCountOrderByAggregateInput
    _max?: InstitutionMaxOrderByAggregateInput
    _min?: InstitutionMinOrderByAggregateInput
  }

  export type InstitutionScalarWhereWithAggregatesInput = {
    AND?: InstitutionScalarWhereWithAggregatesInput | InstitutionScalarWhereWithAggregatesInput[]
    OR?: InstitutionScalarWhereWithAggregatesInput[]
    NOT?: InstitutionScalarWhereWithAggregatesInput | InstitutionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Institution"> | string
    name?: StringWithAggregatesFilter<"Institution"> | string
    slug?: StringWithAggregatesFilter<"Institution"> | string
    description?: StringNullableWithAggregatesFilter<"Institution"> | string | null
    type?: StringNullableWithAggregatesFilter<"Institution"> | string | null
    location?: StringNullableWithAggregatesFilter<"Institution"> | string | null
    email?: StringNullableWithAggregatesFilter<"Institution"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Institution"> | string | null
    active?: BoolWithAggregatesFilter<"Institution"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Institution"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Institution"> | Date | string
  }

  export type ClassroomWhereInput = {
    AND?: ClassroomWhereInput | ClassroomWhereInput[]
    OR?: ClassroomWhereInput[]
    NOT?: ClassroomWhereInput | ClassroomWhereInput[]
    id?: StringFilter<"Classroom"> | string
    institutionId?: StringFilter<"Classroom"> | string
    departmentId?: StringNullableFilter<"Classroom"> | string | null
    teacherId?: StringNullableFilter<"Classroom"> | string | null
    title?: StringFilter<"Classroom"> | string
    code?: StringFilter<"Classroom"> | string
    capacity?: IntNullableFilter<"Classroom"> | number | null
    status?: StringNullableFilter<"Classroom"> | string | null
    startsAt?: DateTimeNullableFilter<"Classroom"> | Date | string | null
    endsAt?: DateTimeNullableFilter<"Classroom"> | Date | string | null
    createdAt?: DateTimeFilter<"Classroom"> | Date | string
    updatedAt?: DateTimeFilter<"Classroom"> | Date | string
    institution?: XOR<InstitutionScalarRelationFilter, InstitutionWhereInput>
    department?: XOR<DepartmentNullableScalarRelationFilter, DepartmentWhereInput> | null
    enrollments?: ClassroomEnrollmentListRelationFilter
  }

  export type ClassroomOrderByWithRelationInput = {
    id?: SortOrder
    institutionId?: SortOrder
    departmentId?: SortOrderInput | SortOrder
    teacherId?: SortOrderInput | SortOrder
    title?: SortOrder
    code?: SortOrder
    capacity?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    startsAt?: SortOrderInput | SortOrder
    endsAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    institution?: InstitutionOrderByWithRelationInput
    department?: DepartmentOrderByWithRelationInput
    enrollments?: ClassroomEnrollmentOrderByRelationAggregateInput
  }

  export type ClassroomWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: ClassroomWhereInput | ClassroomWhereInput[]
    OR?: ClassroomWhereInput[]
    NOT?: ClassroomWhereInput | ClassroomWhereInput[]
    institutionId?: StringFilter<"Classroom"> | string
    departmentId?: StringNullableFilter<"Classroom"> | string | null
    teacherId?: StringNullableFilter<"Classroom"> | string | null
    title?: StringFilter<"Classroom"> | string
    capacity?: IntNullableFilter<"Classroom"> | number | null
    status?: StringNullableFilter<"Classroom"> | string | null
    startsAt?: DateTimeNullableFilter<"Classroom"> | Date | string | null
    endsAt?: DateTimeNullableFilter<"Classroom"> | Date | string | null
    createdAt?: DateTimeFilter<"Classroom"> | Date | string
    updatedAt?: DateTimeFilter<"Classroom"> | Date | string
    institution?: XOR<InstitutionScalarRelationFilter, InstitutionWhereInput>
    department?: XOR<DepartmentNullableScalarRelationFilter, DepartmentWhereInput> | null
    enrollments?: ClassroomEnrollmentListRelationFilter
  }, "id" | "code">

  export type ClassroomOrderByWithAggregationInput = {
    id?: SortOrder
    institutionId?: SortOrder
    departmentId?: SortOrderInput | SortOrder
    teacherId?: SortOrderInput | SortOrder
    title?: SortOrder
    code?: SortOrder
    capacity?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    startsAt?: SortOrderInput | SortOrder
    endsAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClassroomCountOrderByAggregateInput
    _avg?: ClassroomAvgOrderByAggregateInput
    _max?: ClassroomMaxOrderByAggregateInput
    _min?: ClassroomMinOrderByAggregateInput
    _sum?: ClassroomSumOrderByAggregateInput
  }

  export type ClassroomScalarWhereWithAggregatesInput = {
    AND?: ClassroomScalarWhereWithAggregatesInput | ClassroomScalarWhereWithAggregatesInput[]
    OR?: ClassroomScalarWhereWithAggregatesInput[]
    NOT?: ClassroomScalarWhereWithAggregatesInput | ClassroomScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Classroom"> | string
    institutionId?: StringWithAggregatesFilter<"Classroom"> | string
    departmentId?: StringNullableWithAggregatesFilter<"Classroom"> | string | null
    teacherId?: StringNullableWithAggregatesFilter<"Classroom"> | string | null
    title?: StringWithAggregatesFilter<"Classroom"> | string
    code?: StringWithAggregatesFilter<"Classroom"> | string
    capacity?: IntNullableWithAggregatesFilter<"Classroom"> | number | null
    status?: StringNullableWithAggregatesFilter<"Classroom"> | string | null
    startsAt?: DateTimeNullableWithAggregatesFilter<"Classroom"> | Date | string | null
    endsAt?: DateTimeNullableWithAggregatesFilter<"Classroom"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Classroom"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Classroom"> | Date | string
  }

  export type DepartmentWhereInput = {
    AND?: DepartmentWhereInput | DepartmentWhereInput[]
    OR?: DepartmentWhereInput[]
    NOT?: DepartmentWhereInput | DepartmentWhereInput[]
    id?: StringFilter<"Department"> | string
    institutionId?: StringFilter<"Department"> | string
    name?: StringFilter<"Department"> | string
    slug?: StringFilter<"Department"> | string
    contact?: StringNullableFilter<"Department"> | string | null
    head?: StringNullableFilter<"Department"> | string | null
    active?: BoolFilter<"Department"> | boolean
    createdAt?: DateTimeFilter<"Department"> | Date | string
    updatedAt?: DateTimeFilter<"Department"> | Date | string
    institution?: XOR<InstitutionScalarRelationFilter, InstitutionWhereInput>
    classrooms?: ClassroomListRelationFilter
  }

  export type DepartmentOrderByWithRelationInput = {
    id?: SortOrder
    institutionId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    contact?: SortOrderInput | SortOrder
    head?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    institution?: InstitutionOrderByWithRelationInput
    classrooms?: ClassroomOrderByRelationAggregateInput
  }

  export type DepartmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    institutionId_slug?: DepartmentInstitutionIdSlugCompoundUniqueInput
    AND?: DepartmentWhereInput | DepartmentWhereInput[]
    OR?: DepartmentWhereInput[]
    NOT?: DepartmentWhereInput | DepartmentWhereInput[]
    institutionId?: StringFilter<"Department"> | string
    name?: StringFilter<"Department"> | string
    slug?: StringFilter<"Department"> | string
    contact?: StringNullableFilter<"Department"> | string | null
    head?: StringNullableFilter<"Department"> | string | null
    active?: BoolFilter<"Department"> | boolean
    createdAt?: DateTimeFilter<"Department"> | Date | string
    updatedAt?: DateTimeFilter<"Department"> | Date | string
    institution?: XOR<InstitutionScalarRelationFilter, InstitutionWhereInput>
    classrooms?: ClassroomListRelationFilter
  }, "id" | "institutionId_slug">

  export type DepartmentOrderByWithAggregationInput = {
    id?: SortOrder
    institutionId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    contact?: SortOrderInput | SortOrder
    head?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DepartmentCountOrderByAggregateInput
    _max?: DepartmentMaxOrderByAggregateInput
    _min?: DepartmentMinOrderByAggregateInput
  }

  export type DepartmentScalarWhereWithAggregatesInput = {
    AND?: DepartmentScalarWhereWithAggregatesInput | DepartmentScalarWhereWithAggregatesInput[]
    OR?: DepartmentScalarWhereWithAggregatesInput[]
    NOT?: DepartmentScalarWhereWithAggregatesInput | DepartmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Department"> | string
    institutionId?: StringWithAggregatesFilter<"Department"> | string
    name?: StringWithAggregatesFilter<"Department"> | string
    slug?: StringWithAggregatesFilter<"Department"> | string
    contact?: StringNullableWithAggregatesFilter<"Department"> | string | null
    head?: StringNullableWithAggregatesFilter<"Department"> | string | null
    active?: BoolWithAggregatesFilter<"Department"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Department"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Department"> | Date | string
  }

  export type InstitutionMemberWhereInput = {
    AND?: InstitutionMemberWhereInput | InstitutionMemberWhereInput[]
    OR?: InstitutionMemberWhereInput[]
    NOT?: InstitutionMemberWhereInput | InstitutionMemberWhereInput[]
    id?: StringFilter<"InstitutionMember"> | string
    institutionId?: StringFilter<"InstitutionMember"> | string
    userId?: StringFilter<"InstitutionMember"> | string
    role?: StringFilter<"InstitutionMember"> | string
    status?: StringFilter<"InstitutionMember"> | string
    createdAt?: DateTimeFilter<"InstitutionMember"> | Date | string
    updatedAt?: DateTimeFilter<"InstitutionMember"> | Date | string
    institution?: XOR<InstitutionScalarRelationFilter, InstitutionWhereInput>
  }

  export type InstitutionMemberOrderByWithRelationInput = {
    id?: SortOrder
    institutionId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    institution?: InstitutionOrderByWithRelationInput
  }

  export type InstitutionMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    institutionId_userId?: InstitutionMemberInstitutionIdUserIdCompoundUniqueInput
    AND?: InstitutionMemberWhereInput | InstitutionMemberWhereInput[]
    OR?: InstitutionMemberWhereInput[]
    NOT?: InstitutionMemberWhereInput | InstitutionMemberWhereInput[]
    institutionId?: StringFilter<"InstitutionMember"> | string
    userId?: StringFilter<"InstitutionMember"> | string
    role?: StringFilter<"InstitutionMember"> | string
    status?: StringFilter<"InstitutionMember"> | string
    createdAt?: DateTimeFilter<"InstitutionMember"> | Date | string
    updatedAt?: DateTimeFilter<"InstitutionMember"> | Date | string
    institution?: XOR<InstitutionScalarRelationFilter, InstitutionWhereInput>
  }, "id" | "institutionId_userId">

  export type InstitutionMemberOrderByWithAggregationInput = {
    id?: SortOrder
    institutionId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InstitutionMemberCountOrderByAggregateInput
    _max?: InstitutionMemberMaxOrderByAggregateInput
    _min?: InstitutionMemberMinOrderByAggregateInput
  }

  export type InstitutionMemberScalarWhereWithAggregatesInput = {
    AND?: InstitutionMemberScalarWhereWithAggregatesInput | InstitutionMemberScalarWhereWithAggregatesInput[]
    OR?: InstitutionMemberScalarWhereWithAggregatesInput[]
    NOT?: InstitutionMemberScalarWhereWithAggregatesInput | InstitutionMemberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InstitutionMember"> | string
    institutionId?: StringWithAggregatesFilter<"InstitutionMember"> | string
    userId?: StringWithAggregatesFilter<"InstitutionMember"> | string
    role?: StringWithAggregatesFilter<"InstitutionMember"> | string
    status?: StringWithAggregatesFilter<"InstitutionMember"> | string
    createdAt?: DateTimeWithAggregatesFilter<"InstitutionMember"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"InstitutionMember"> | Date | string
  }

  export type ClassroomEnrollmentWhereInput = {
    AND?: ClassroomEnrollmentWhereInput | ClassroomEnrollmentWhereInput[]
    OR?: ClassroomEnrollmentWhereInput[]
    NOT?: ClassroomEnrollmentWhereInput | ClassroomEnrollmentWhereInput[]
    id?: StringFilter<"ClassroomEnrollment"> | string
    classroomId?: StringFilter<"ClassroomEnrollment"> | string
    studentId?: StringFilter<"ClassroomEnrollment"> | string
    status?: StringFilter<"ClassroomEnrollment"> | string
    createdAt?: DateTimeFilter<"ClassroomEnrollment"> | Date | string
    updatedAt?: DateTimeFilter<"ClassroomEnrollment"> | Date | string
    classroom?: XOR<ClassroomScalarRelationFilter, ClassroomWhereInput>
  }

  export type ClassroomEnrollmentOrderByWithRelationInput = {
    id?: SortOrder
    classroomId?: SortOrder
    studentId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    classroom?: ClassroomOrderByWithRelationInput
  }

  export type ClassroomEnrollmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    classroomId_studentId?: ClassroomEnrollmentClassroomIdStudentIdCompoundUniqueInput
    AND?: ClassroomEnrollmentWhereInput | ClassroomEnrollmentWhereInput[]
    OR?: ClassroomEnrollmentWhereInput[]
    NOT?: ClassroomEnrollmentWhereInput | ClassroomEnrollmentWhereInput[]
    classroomId?: StringFilter<"ClassroomEnrollment"> | string
    studentId?: StringFilter<"ClassroomEnrollment"> | string
    status?: StringFilter<"ClassroomEnrollment"> | string
    createdAt?: DateTimeFilter<"ClassroomEnrollment"> | Date | string
    updatedAt?: DateTimeFilter<"ClassroomEnrollment"> | Date | string
    classroom?: XOR<ClassroomScalarRelationFilter, ClassroomWhereInput>
  }, "id" | "classroomId_studentId">

  export type ClassroomEnrollmentOrderByWithAggregationInput = {
    id?: SortOrder
    classroomId?: SortOrder
    studentId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClassroomEnrollmentCountOrderByAggregateInput
    _max?: ClassroomEnrollmentMaxOrderByAggregateInput
    _min?: ClassroomEnrollmentMinOrderByAggregateInput
  }

  export type ClassroomEnrollmentScalarWhereWithAggregatesInput = {
    AND?: ClassroomEnrollmentScalarWhereWithAggregatesInput | ClassroomEnrollmentScalarWhereWithAggregatesInput[]
    OR?: ClassroomEnrollmentScalarWhereWithAggregatesInput[]
    NOT?: ClassroomEnrollmentScalarWhereWithAggregatesInput | ClassroomEnrollmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ClassroomEnrollment"> | string
    classroomId?: StringWithAggregatesFilter<"ClassroomEnrollment"> | string
    studentId?: StringWithAggregatesFilter<"ClassroomEnrollment"> | string
    status?: StringWithAggregatesFilter<"ClassroomEnrollment"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ClassroomEnrollment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ClassroomEnrollment"> | Date | string
  }

  export type InstitutionInviteWhereInput = {
    AND?: InstitutionInviteWhereInput | InstitutionInviteWhereInput[]
    OR?: InstitutionInviteWhereInput[]
    NOT?: InstitutionInviteWhereInput | InstitutionInviteWhereInput[]
    id?: StringFilter<"InstitutionInvite"> | string
    institutionId?: StringFilter<"InstitutionInvite"> | string
    code?: StringFilter<"InstitutionInvite"> | string
    role?: StringFilter<"InstitutionInvite"> | string
    expiresAt?: DateTimeNullableFilter<"InstitutionInvite"> | Date | string | null
    createdAt?: DateTimeFilter<"InstitutionInvite"> | Date | string
    institution?: XOR<InstitutionScalarRelationFilter, InstitutionWhereInput>
  }

  export type InstitutionInviteOrderByWithRelationInput = {
    id?: SortOrder
    institutionId?: SortOrder
    code?: SortOrder
    role?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    institution?: InstitutionOrderByWithRelationInput
  }

  export type InstitutionInviteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: InstitutionInviteWhereInput | InstitutionInviteWhereInput[]
    OR?: InstitutionInviteWhereInput[]
    NOT?: InstitutionInviteWhereInput | InstitutionInviteWhereInput[]
    institutionId?: StringFilter<"InstitutionInvite"> | string
    role?: StringFilter<"InstitutionInvite"> | string
    expiresAt?: DateTimeNullableFilter<"InstitutionInvite"> | Date | string | null
    createdAt?: DateTimeFilter<"InstitutionInvite"> | Date | string
    institution?: XOR<InstitutionScalarRelationFilter, InstitutionWhereInput>
  }, "id" | "code">

  export type InstitutionInviteOrderByWithAggregationInput = {
    id?: SortOrder
    institutionId?: SortOrder
    code?: SortOrder
    role?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: InstitutionInviteCountOrderByAggregateInput
    _max?: InstitutionInviteMaxOrderByAggregateInput
    _min?: InstitutionInviteMinOrderByAggregateInput
  }

  export type InstitutionInviteScalarWhereWithAggregatesInput = {
    AND?: InstitutionInviteScalarWhereWithAggregatesInput | InstitutionInviteScalarWhereWithAggregatesInput[]
    OR?: InstitutionInviteScalarWhereWithAggregatesInput[]
    NOT?: InstitutionInviteScalarWhereWithAggregatesInput | InstitutionInviteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InstitutionInvite"> | string
    institutionId?: StringWithAggregatesFilter<"InstitutionInvite"> | string
    code?: StringWithAggregatesFilter<"InstitutionInvite"> | string
    role?: StringWithAggregatesFilter<"InstitutionInvite"> | string
    expiresAt?: DateTimeNullableWithAggregatesFilter<"InstitutionInvite"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"InstitutionInvite"> | Date | string
  }

  export type InstitutionCreateInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    type?: string | null
    location?: string | null
    email?: string | null
    phone?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    classrooms?: ClassroomCreateNestedManyWithoutInstitutionInput
    departments?: DepartmentCreateNestedManyWithoutInstitutionInput
    members?: InstitutionMemberCreateNestedManyWithoutInstitutionInput
    invites?: InstitutionInviteCreateNestedManyWithoutInstitutionInput
  }

  export type InstitutionUncheckedCreateInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    type?: string | null
    location?: string | null
    email?: string | null
    phone?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    classrooms?: ClassroomUncheckedCreateNestedManyWithoutInstitutionInput
    departments?: DepartmentUncheckedCreateNestedManyWithoutInstitutionInput
    members?: InstitutionMemberUncheckedCreateNestedManyWithoutInstitutionInput
    invites?: InstitutionInviteUncheckedCreateNestedManyWithoutInstitutionInput
  }

  export type InstitutionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    classrooms?: ClassroomUpdateManyWithoutInstitutionNestedInput
    departments?: DepartmentUpdateManyWithoutInstitutionNestedInput
    members?: InstitutionMemberUpdateManyWithoutInstitutionNestedInput
    invites?: InstitutionInviteUpdateManyWithoutInstitutionNestedInput
  }

  export type InstitutionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    classrooms?: ClassroomUncheckedUpdateManyWithoutInstitutionNestedInput
    departments?: DepartmentUncheckedUpdateManyWithoutInstitutionNestedInput
    members?: InstitutionMemberUncheckedUpdateManyWithoutInstitutionNestedInput
    invites?: InstitutionInviteUncheckedUpdateManyWithoutInstitutionNestedInput
  }

  export type InstitutionCreateManyInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    type?: string | null
    location?: string | null
    email?: string | null
    phone?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InstitutionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstitutionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClassroomCreateInput = {
    id?: string
    teacherId?: string | null
    title: string
    code: string
    capacity?: number | null
    status?: string | null
    startsAt?: Date | string | null
    endsAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    institution: InstitutionCreateNestedOneWithoutClassroomsInput
    department?: DepartmentCreateNestedOneWithoutClassroomsInput
    enrollments?: ClassroomEnrollmentCreateNestedManyWithoutClassroomInput
  }

  export type ClassroomUncheckedCreateInput = {
    id?: string
    institutionId: string
    departmentId?: string | null
    teacherId?: string | null
    title: string
    code: string
    capacity?: number | null
    status?: string | null
    startsAt?: Date | string | null
    endsAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enrollments?: ClassroomEnrollmentUncheckedCreateNestedManyWithoutClassroomInput
  }

  export type ClassroomUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    startsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    institution?: InstitutionUpdateOneRequiredWithoutClassroomsNestedInput
    department?: DepartmentUpdateOneWithoutClassroomsNestedInput
    enrollments?: ClassroomEnrollmentUpdateManyWithoutClassroomNestedInput
  }

  export type ClassroomUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    institutionId?: StringFieldUpdateOperationsInput | string
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    startsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: ClassroomEnrollmentUncheckedUpdateManyWithoutClassroomNestedInput
  }

  export type ClassroomCreateManyInput = {
    id?: string
    institutionId: string
    departmentId?: string | null
    teacherId?: string | null
    title: string
    code: string
    capacity?: number | null
    status?: string | null
    startsAt?: Date | string | null
    endsAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClassroomUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    startsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClassroomUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    institutionId?: StringFieldUpdateOperationsInput | string
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    startsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentCreateInput = {
    id?: string
    name: string
    slug: string
    contact?: string | null
    head?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    institution: InstitutionCreateNestedOneWithoutDepartmentsInput
    classrooms?: ClassroomCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUncheckedCreateInput = {
    id?: string
    institutionId: string
    name: string
    slug: string
    contact?: string | null
    head?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    classrooms?: ClassroomUncheckedCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    head?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    institution?: InstitutionUpdateOneRequiredWithoutDepartmentsNestedInput
    classrooms?: ClassroomUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    institutionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    head?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    classrooms?: ClassroomUncheckedUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentCreateManyInput = {
    id?: string
    institutionId: string
    name: string
    slug: string
    contact?: string | null
    head?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DepartmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    head?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    institutionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    head?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstitutionMemberCreateInput = {
    id?: string
    userId: string
    role: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    institution: InstitutionCreateNestedOneWithoutMembersInput
  }

  export type InstitutionMemberUncheckedCreateInput = {
    id?: string
    institutionId: string
    userId: string
    role: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InstitutionMemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    institution?: InstitutionUpdateOneRequiredWithoutMembersNestedInput
  }

  export type InstitutionMemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    institutionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstitutionMemberCreateManyInput = {
    id?: string
    institutionId: string
    userId: string
    role: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InstitutionMemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstitutionMemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    institutionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClassroomEnrollmentCreateInput = {
    id?: string
    studentId: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    classroom: ClassroomCreateNestedOneWithoutEnrollmentsInput
  }

  export type ClassroomEnrollmentUncheckedCreateInput = {
    id?: string
    classroomId: string
    studentId: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClassroomEnrollmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    classroom?: ClassroomUpdateOneRequiredWithoutEnrollmentsNestedInput
  }

  export type ClassroomEnrollmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    classroomId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClassroomEnrollmentCreateManyInput = {
    id?: string
    classroomId: string
    studentId: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClassroomEnrollmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClassroomEnrollmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    classroomId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstitutionInviteCreateInput = {
    id?: string
    code: string
    role?: string
    expiresAt?: Date | string | null
    createdAt?: Date | string
    institution: InstitutionCreateNestedOneWithoutInvitesInput
  }

  export type InstitutionInviteUncheckedCreateInput = {
    id?: string
    institutionId: string
    code: string
    role?: string
    expiresAt?: Date | string | null
    createdAt?: Date | string
  }

  export type InstitutionInviteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    institution?: InstitutionUpdateOneRequiredWithoutInvitesNestedInput
  }

  export type InstitutionInviteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    institutionId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstitutionInviteCreateManyInput = {
    id?: string
    institutionId: string
    code: string
    role?: string
    expiresAt?: Date | string | null
    createdAt?: Date | string
  }

  export type InstitutionInviteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstitutionInviteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    institutionId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type ClassroomListRelationFilter = {
    every?: ClassroomWhereInput
    some?: ClassroomWhereInput
    none?: ClassroomWhereInput
  }

  export type DepartmentListRelationFilter = {
    every?: DepartmentWhereInput
    some?: DepartmentWhereInput
    none?: DepartmentWhereInput
  }

  export type InstitutionMemberListRelationFilter = {
    every?: InstitutionMemberWhereInput
    some?: InstitutionMemberWhereInput
    none?: InstitutionMemberWhereInput
  }

  export type InstitutionInviteListRelationFilter = {
    every?: InstitutionInviteWhereInput
    some?: InstitutionInviteWhereInput
    none?: InstitutionInviteWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ClassroomOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DepartmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InstitutionMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InstitutionInviteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InstitutionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    type?: SortOrder
    location?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InstitutionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    type?: SortOrder
    location?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InstitutionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    type?: SortOrder
    location?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    active?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type InstitutionScalarRelationFilter = {
    is?: InstitutionWhereInput
    isNot?: InstitutionWhereInput
  }

  export type DepartmentNullableScalarRelationFilter = {
    is?: DepartmentWhereInput | null
    isNot?: DepartmentWhereInput | null
  }

  export type ClassroomEnrollmentListRelationFilter = {
    every?: ClassroomEnrollmentWhereInput
    some?: ClassroomEnrollmentWhereInput
    none?: ClassroomEnrollmentWhereInput
  }

  export type ClassroomEnrollmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClassroomCountOrderByAggregateInput = {
    id?: SortOrder
    institutionId?: SortOrder
    departmentId?: SortOrder
    teacherId?: SortOrder
    title?: SortOrder
    code?: SortOrder
    capacity?: SortOrder
    status?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClassroomAvgOrderByAggregateInput = {
    capacity?: SortOrder
  }

  export type ClassroomMaxOrderByAggregateInput = {
    id?: SortOrder
    institutionId?: SortOrder
    departmentId?: SortOrder
    teacherId?: SortOrder
    title?: SortOrder
    code?: SortOrder
    capacity?: SortOrder
    status?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClassroomMinOrderByAggregateInput = {
    id?: SortOrder
    institutionId?: SortOrder
    departmentId?: SortOrder
    teacherId?: SortOrder
    title?: SortOrder
    code?: SortOrder
    capacity?: SortOrder
    status?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClassroomSumOrderByAggregateInput = {
    capacity?: SortOrder
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

  export type DepartmentInstitutionIdSlugCompoundUniqueInput = {
    institutionId: string
    slug: string
  }

  export type DepartmentCountOrderByAggregateInput = {
    id?: SortOrder
    institutionId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    contact?: SortOrder
    head?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DepartmentMaxOrderByAggregateInput = {
    id?: SortOrder
    institutionId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    contact?: SortOrder
    head?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DepartmentMinOrderByAggregateInput = {
    id?: SortOrder
    institutionId?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    contact?: SortOrder
    head?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InstitutionMemberInstitutionIdUserIdCompoundUniqueInput = {
    institutionId: string
    userId: string
  }

  export type InstitutionMemberCountOrderByAggregateInput = {
    id?: SortOrder
    institutionId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InstitutionMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    institutionId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InstitutionMemberMinOrderByAggregateInput = {
    id?: SortOrder
    institutionId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClassroomScalarRelationFilter = {
    is?: ClassroomWhereInput
    isNot?: ClassroomWhereInput
  }

  export type ClassroomEnrollmentClassroomIdStudentIdCompoundUniqueInput = {
    classroomId: string
    studentId: string
  }

  export type ClassroomEnrollmentCountOrderByAggregateInput = {
    id?: SortOrder
    classroomId?: SortOrder
    studentId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClassroomEnrollmentMaxOrderByAggregateInput = {
    id?: SortOrder
    classroomId?: SortOrder
    studentId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClassroomEnrollmentMinOrderByAggregateInput = {
    id?: SortOrder
    classroomId?: SortOrder
    studentId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InstitutionInviteCountOrderByAggregateInput = {
    id?: SortOrder
    institutionId?: SortOrder
    code?: SortOrder
    role?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type InstitutionInviteMaxOrderByAggregateInput = {
    id?: SortOrder
    institutionId?: SortOrder
    code?: SortOrder
    role?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type InstitutionInviteMinOrderByAggregateInput = {
    id?: SortOrder
    institutionId?: SortOrder
    code?: SortOrder
    role?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ClassroomCreateNestedManyWithoutInstitutionInput = {
    create?: XOR<ClassroomCreateWithoutInstitutionInput, ClassroomUncheckedCreateWithoutInstitutionInput> | ClassroomCreateWithoutInstitutionInput[] | ClassroomUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: ClassroomCreateOrConnectWithoutInstitutionInput | ClassroomCreateOrConnectWithoutInstitutionInput[]
    createMany?: ClassroomCreateManyInstitutionInputEnvelope
    connect?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
  }

  export type DepartmentCreateNestedManyWithoutInstitutionInput = {
    create?: XOR<DepartmentCreateWithoutInstitutionInput, DepartmentUncheckedCreateWithoutInstitutionInput> | DepartmentCreateWithoutInstitutionInput[] | DepartmentUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: DepartmentCreateOrConnectWithoutInstitutionInput | DepartmentCreateOrConnectWithoutInstitutionInput[]
    createMany?: DepartmentCreateManyInstitutionInputEnvelope
    connect?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
  }

  export type InstitutionMemberCreateNestedManyWithoutInstitutionInput = {
    create?: XOR<InstitutionMemberCreateWithoutInstitutionInput, InstitutionMemberUncheckedCreateWithoutInstitutionInput> | InstitutionMemberCreateWithoutInstitutionInput[] | InstitutionMemberUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: InstitutionMemberCreateOrConnectWithoutInstitutionInput | InstitutionMemberCreateOrConnectWithoutInstitutionInput[]
    createMany?: InstitutionMemberCreateManyInstitutionInputEnvelope
    connect?: InstitutionMemberWhereUniqueInput | InstitutionMemberWhereUniqueInput[]
  }

  export type InstitutionInviteCreateNestedManyWithoutInstitutionInput = {
    create?: XOR<InstitutionInviteCreateWithoutInstitutionInput, InstitutionInviteUncheckedCreateWithoutInstitutionInput> | InstitutionInviteCreateWithoutInstitutionInput[] | InstitutionInviteUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: InstitutionInviteCreateOrConnectWithoutInstitutionInput | InstitutionInviteCreateOrConnectWithoutInstitutionInput[]
    createMany?: InstitutionInviteCreateManyInstitutionInputEnvelope
    connect?: InstitutionInviteWhereUniqueInput | InstitutionInviteWhereUniqueInput[]
  }

  export type ClassroomUncheckedCreateNestedManyWithoutInstitutionInput = {
    create?: XOR<ClassroomCreateWithoutInstitutionInput, ClassroomUncheckedCreateWithoutInstitutionInput> | ClassroomCreateWithoutInstitutionInput[] | ClassroomUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: ClassroomCreateOrConnectWithoutInstitutionInput | ClassroomCreateOrConnectWithoutInstitutionInput[]
    createMany?: ClassroomCreateManyInstitutionInputEnvelope
    connect?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
  }

  export type DepartmentUncheckedCreateNestedManyWithoutInstitutionInput = {
    create?: XOR<DepartmentCreateWithoutInstitutionInput, DepartmentUncheckedCreateWithoutInstitutionInput> | DepartmentCreateWithoutInstitutionInput[] | DepartmentUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: DepartmentCreateOrConnectWithoutInstitutionInput | DepartmentCreateOrConnectWithoutInstitutionInput[]
    createMany?: DepartmentCreateManyInstitutionInputEnvelope
    connect?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
  }

  export type InstitutionMemberUncheckedCreateNestedManyWithoutInstitutionInput = {
    create?: XOR<InstitutionMemberCreateWithoutInstitutionInput, InstitutionMemberUncheckedCreateWithoutInstitutionInput> | InstitutionMemberCreateWithoutInstitutionInput[] | InstitutionMemberUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: InstitutionMemberCreateOrConnectWithoutInstitutionInput | InstitutionMemberCreateOrConnectWithoutInstitutionInput[]
    createMany?: InstitutionMemberCreateManyInstitutionInputEnvelope
    connect?: InstitutionMemberWhereUniqueInput | InstitutionMemberWhereUniqueInput[]
  }

  export type InstitutionInviteUncheckedCreateNestedManyWithoutInstitutionInput = {
    create?: XOR<InstitutionInviteCreateWithoutInstitutionInput, InstitutionInviteUncheckedCreateWithoutInstitutionInput> | InstitutionInviteCreateWithoutInstitutionInput[] | InstitutionInviteUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: InstitutionInviteCreateOrConnectWithoutInstitutionInput | InstitutionInviteCreateOrConnectWithoutInstitutionInput[]
    createMany?: InstitutionInviteCreateManyInstitutionInputEnvelope
    connect?: InstitutionInviteWhereUniqueInput | InstitutionInviteWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ClassroomUpdateManyWithoutInstitutionNestedInput = {
    create?: XOR<ClassroomCreateWithoutInstitutionInput, ClassroomUncheckedCreateWithoutInstitutionInput> | ClassroomCreateWithoutInstitutionInput[] | ClassroomUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: ClassroomCreateOrConnectWithoutInstitutionInput | ClassroomCreateOrConnectWithoutInstitutionInput[]
    upsert?: ClassroomUpsertWithWhereUniqueWithoutInstitutionInput | ClassroomUpsertWithWhereUniqueWithoutInstitutionInput[]
    createMany?: ClassroomCreateManyInstitutionInputEnvelope
    set?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
    disconnect?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
    delete?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
    connect?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
    update?: ClassroomUpdateWithWhereUniqueWithoutInstitutionInput | ClassroomUpdateWithWhereUniqueWithoutInstitutionInput[]
    updateMany?: ClassroomUpdateManyWithWhereWithoutInstitutionInput | ClassroomUpdateManyWithWhereWithoutInstitutionInput[]
    deleteMany?: ClassroomScalarWhereInput | ClassroomScalarWhereInput[]
  }

  export type DepartmentUpdateManyWithoutInstitutionNestedInput = {
    create?: XOR<DepartmentCreateWithoutInstitutionInput, DepartmentUncheckedCreateWithoutInstitutionInput> | DepartmentCreateWithoutInstitutionInput[] | DepartmentUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: DepartmentCreateOrConnectWithoutInstitutionInput | DepartmentCreateOrConnectWithoutInstitutionInput[]
    upsert?: DepartmentUpsertWithWhereUniqueWithoutInstitutionInput | DepartmentUpsertWithWhereUniqueWithoutInstitutionInput[]
    createMany?: DepartmentCreateManyInstitutionInputEnvelope
    set?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    disconnect?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    delete?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    connect?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    update?: DepartmentUpdateWithWhereUniqueWithoutInstitutionInput | DepartmentUpdateWithWhereUniqueWithoutInstitutionInput[]
    updateMany?: DepartmentUpdateManyWithWhereWithoutInstitutionInput | DepartmentUpdateManyWithWhereWithoutInstitutionInput[]
    deleteMany?: DepartmentScalarWhereInput | DepartmentScalarWhereInput[]
  }

  export type InstitutionMemberUpdateManyWithoutInstitutionNestedInput = {
    create?: XOR<InstitutionMemberCreateWithoutInstitutionInput, InstitutionMemberUncheckedCreateWithoutInstitutionInput> | InstitutionMemberCreateWithoutInstitutionInput[] | InstitutionMemberUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: InstitutionMemberCreateOrConnectWithoutInstitutionInput | InstitutionMemberCreateOrConnectWithoutInstitutionInput[]
    upsert?: InstitutionMemberUpsertWithWhereUniqueWithoutInstitutionInput | InstitutionMemberUpsertWithWhereUniqueWithoutInstitutionInput[]
    createMany?: InstitutionMemberCreateManyInstitutionInputEnvelope
    set?: InstitutionMemberWhereUniqueInput | InstitutionMemberWhereUniqueInput[]
    disconnect?: InstitutionMemberWhereUniqueInput | InstitutionMemberWhereUniqueInput[]
    delete?: InstitutionMemberWhereUniqueInput | InstitutionMemberWhereUniqueInput[]
    connect?: InstitutionMemberWhereUniqueInput | InstitutionMemberWhereUniqueInput[]
    update?: InstitutionMemberUpdateWithWhereUniqueWithoutInstitutionInput | InstitutionMemberUpdateWithWhereUniqueWithoutInstitutionInput[]
    updateMany?: InstitutionMemberUpdateManyWithWhereWithoutInstitutionInput | InstitutionMemberUpdateManyWithWhereWithoutInstitutionInput[]
    deleteMany?: InstitutionMemberScalarWhereInput | InstitutionMemberScalarWhereInput[]
  }

  export type InstitutionInviteUpdateManyWithoutInstitutionNestedInput = {
    create?: XOR<InstitutionInviteCreateWithoutInstitutionInput, InstitutionInviteUncheckedCreateWithoutInstitutionInput> | InstitutionInviteCreateWithoutInstitutionInput[] | InstitutionInviteUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: InstitutionInviteCreateOrConnectWithoutInstitutionInput | InstitutionInviteCreateOrConnectWithoutInstitutionInput[]
    upsert?: InstitutionInviteUpsertWithWhereUniqueWithoutInstitutionInput | InstitutionInviteUpsertWithWhereUniqueWithoutInstitutionInput[]
    createMany?: InstitutionInviteCreateManyInstitutionInputEnvelope
    set?: InstitutionInviteWhereUniqueInput | InstitutionInviteWhereUniqueInput[]
    disconnect?: InstitutionInviteWhereUniqueInput | InstitutionInviteWhereUniqueInput[]
    delete?: InstitutionInviteWhereUniqueInput | InstitutionInviteWhereUniqueInput[]
    connect?: InstitutionInviteWhereUniqueInput | InstitutionInviteWhereUniqueInput[]
    update?: InstitutionInviteUpdateWithWhereUniqueWithoutInstitutionInput | InstitutionInviteUpdateWithWhereUniqueWithoutInstitutionInput[]
    updateMany?: InstitutionInviteUpdateManyWithWhereWithoutInstitutionInput | InstitutionInviteUpdateManyWithWhereWithoutInstitutionInput[]
    deleteMany?: InstitutionInviteScalarWhereInput | InstitutionInviteScalarWhereInput[]
  }

  export type ClassroomUncheckedUpdateManyWithoutInstitutionNestedInput = {
    create?: XOR<ClassroomCreateWithoutInstitutionInput, ClassroomUncheckedCreateWithoutInstitutionInput> | ClassroomCreateWithoutInstitutionInput[] | ClassroomUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: ClassroomCreateOrConnectWithoutInstitutionInput | ClassroomCreateOrConnectWithoutInstitutionInput[]
    upsert?: ClassroomUpsertWithWhereUniqueWithoutInstitutionInput | ClassroomUpsertWithWhereUniqueWithoutInstitutionInput[]
    createMany?: ClassroomCreateManyInstitutionInputEnvelope
    set?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
    disconnect?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
    delete?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
    connect?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
    update?: ClassroomUpdateWithWhereUniqueWithoutInstitutionInput | ClassroomUpdateWithWhereUniqueWithoutInstitutionInput[]
    updateMany?: ClassroomUpdateManyWithWhereWithoutInstitutionInput | ClassroomUpdateManyWithWhereWithoutInstitutionInput[]
    deleteMany?: ClassroomScalarWhereInput | ClassroomScalarWhereInput[]
  }

  export type DepartmentUncheckedUpdateManyWithoutInstitutionNestedInput = {
    create?: XOR<DepartmentCreateWithoutInstitutionInput, DepartmentUncheckedCreateWithoutInstitutionInput> | DepartmentCreateWithoutInstitutionInput[] | DepartmentUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: DepartmentCreateOrConnectWithoutInstitutionInput | DepartmentCreateOrConnectWithoutInstitutionInput[]
    upsert?: DepartmentUpsertWithWhereUniqueWithoutInstitutionInput | DepartmentUpsertWithWhereUniqueWithoutInstitutionInput[]
    createMany?: DepartmentCreateManyInstitutionInputEnvelope
    set?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    disconnect?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    delete?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    connect?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    update?: DepartmentUpdateWithWhereUniqueWithoutInstitutionInput | DepartmentUpdateWithWhereUniqueWithoutInstitutionInput[]
    updateMany?: DepartmentUpdateManyWithWhereWithoutInstitutionInput | DepartmentUpdateManyWithWhereWithoutInstitutionInput[]
    deleteMany?: DepartmentScalarWhereInput | DepartmentScalarWhereInput[]
  }

  export type InstitutionMemberUncheckedUpdateManyWithoutInstitutionNestedInput = {
    create?: XOR<InstitutionMemberCreateWithoutInstitutionInput, InstitutionMemberUncheckedCreateWithoutInstitutionInput> | InstitutionMemberCreateWithoutInstitutionInput[] | InstitutionMemberUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: InstitutionMemberCreateOrConnectWithoutInstitutionInput | InstitutionMemberCreateOrConnectWithoutInstitutionInput[]
    upsert?: InstitutionMemberUpsertWithWhereUniqueWithoutInstitutionInput | InstitutionMemberUpsertWithWhereUniqueWithoutInstitutionInput[]
    createMany?: InstitutionMemberCreateManyInstitutionInputEnvelope
    set?: InstitutionMemberWhereUniqueInput | InstitutionMemberWhereUniqueInput[]
    disconnect?: InstitutionMemberWhereUniqueInput | InstitutionMemberWhereUniqueInput[]
    delete?: InstitutionMemberWhereUniqueInput | InstitutionMemberWhereUniqueInput[]
    connect?: InstitutionMemberWhereUniqueInput | InstitutionMemberWhereUniqueInput[]
    update?: InstitutionMemberUpdateWithWhereUniqueWithoutInstitutionInput | InstitutionMemberUpdateWithWhereUniqueWithoutInstitutionInput[]
    updateMany?: InstitutionMemberUpdateManyWithWhereWithoutInstitutionInput | InstitutionMemberUpdateManyWithWhereWithoutInstitutionInput[]
    deleteMany?: InstitutionMemberScalarWhereInput | InstitutionMemberScalarWhereInput[]
  }

  export type InstitutionInviteUncheckedUpdateManyWithoutInstitutionNestedInput = {
    create?: XOR<InstitutionInviteCreateWithoutInstitutionInput, InstitutionInviteUncheckedCreateWithoutInstitutionInput> | InstitutionInviteCreateWithoutInstitutionInput[] | InstitutionInviteUncheckedCreateWithoutInstitutionInput[]
    connectOrCreate?: InstitutionInviteCreateOrConnectWithoutInstitutionInput | InstitutionInviteCreateOrConnectWithoutInstitutionInput[]
    upsert?: InstitutionInviteUpsertWithWhereUniqueWithoutInstitutionInput | InstitutionInviteUpsertWithWhereUniqueWithoutInstitutionInput[]
    createMany?: InstitutionInviteCreateManyInstitutionInputEnvelope
    set?: InstitutionInviteWhereUniqueInput | InstitutionInviteWhereUniqueInput[]
    disconnect?: InstitutionInviteWhereUniqueInput | InstitutionInviteWhereUniqueInput[]
    delete?: InstitutionInviteWhereUniqueInput | InstitutionInviteWhereUniqueInput[]
    connect?: InstitutionInviteWhereUniqueInput | InstitutionInviteWhereUniqueInput[]
    update?: InstitutionInviteUpdateWithWhereUniqueWithoutInstitutionInput | InstitutionInviteUpdateWithWhereUniqueWithoutInstitutionInput[]
    updateMany?: InstitutionInviteUpdateManyWithWhereWithoutInstitutionInput | InstitutionInviteUpdateManyWithWhereWithoutInstitutionInput[]
    deleteMany?: InstitutionInviteScalarWhereInput | InstitutionInviteScalarWhereInput[]
  }

  export type InstitutionCreateNestedOneWithoutClassroomsInput = {
    create?: XOR<InstitutionCreateWithoutClassroomsInput, InstitutionUncheckedCreateWithoutClassroomsInput>
    connectOrCreate?: InstitutionCreateOrConnectWithoutClassroomsInput
    connect?: InstitutionWhereUniqueInput
  }

  export type DepartmentCreateNestedOneWithoutClassroomsInput = {
    create?: XOR<DepartmentCreateWithoutClassroomsInput, DepartmentUncheckedCreateWithoutClassroomsInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutClassroomsInput
    connect?: DepartmentWhereUniqueInput
  }

  export type ClassroomEnrollmentCreateNestedManyWithoutClassroomInput = {
    create?: XOR<ClassroomEnrollmentCreateWithoutClassroomInput, ClassroomEnrollmentUncheckedCreateWithoutClassroomInput> | ClassroomEnrollmentCreateWithoutClassroomInput[] | ClassroomEnrollmentUncheckedCreateWithoutClassroomInput[]
    connectOrCreate?: ClassroomEnrollmentCreateOrConnectWithoutClassroomInput | ClassroomEnrollmentCreateOrConnectWithoutClassroomInput[]
    createMany?: ClassroomEnrollmentCreateManyClassroomInputEnvelope
    connect?: ClassroomEnrollmentWhereUniqueInput | ClassroomEnrollmentWhereUniqueInput[]
  }

  export type ClassroomEnrollmentUncheckedCreateNestedManyWithoutClassroomInput = {
    create?: XOR<ClassroomEnrollmentCreateWithoutClassroomInput, ClassroomEnrollmentUncheckedCreateWithoutClassroomInput> | ClassroomEnrollmentCreateWithoutClassroomInput[] | ClassroomEnrollmentUncheckedCreateWithoutClassroomInput[]
    connectOrCreate?: ClassroomEnrollmentCreateOrConnectWithoutClassroomInput | ClassroomEnrollmentCreateOrConnectWithoutClassroomInput[]
    createMany?: ClassroomEnrollmentCreateManyClassroomInputEnvelope
    connect?: ClassroomEnrollmentWhereUniqueInput | ClassroomEnrollmentWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type InstitutionUpdateOneRequiredWithoutClassroomsNestedInput = {
    create?: XOR<InstitutionCreateWithoutClassroomsInput, InstitutionUncheckedCreateWithoutClassroomsInput>
    connectOrCreate?: InstitutionCreateOrConnectWithoutClassroomsInput
    upsert?: InstitutionUpsertWithoutClassroomsInput
    connect?: InstitutionWhereUniqueInput
    update?: XOR<XOR<InstitutionUpdateToOneWithWhereWithoutClassroomsInput, InstitutionUpdateWithoutClassroomsInput>, InstitutionUncheckedUpdateWithoutClassroomsInput>
  }

  export type DepartmentUpdateOneWithoutClassroomsNestedInput = {
    create?: XOR<DepartmentCreateWithoutClassroomsInput, DepartmentUncheckedCreateWithoutClassroomsInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutClassroomsInput
    upsert?: DepartmentUpsertWithoutClassroomsInput
    disconnect?: DepartmentWhereInput | boolean
    delete?: DepartmentWhereInput | boolean
    connect?: DepartmentWhereUniqueInput
    update?: XOR<XOR<DepartmentUpdateToOneWithWhereWithoutClassroomsInput, DepartmentUpdateWithoutClassroomsInput>, DepartmentUncheckedUpdateWithoutClassroomsInput>
  }

  export type ClassroomEnrollmentUpdateManyWithoutClassroomNestedInput = {
    create?: XOR<ClassroomEnrollmentCreateWithoutClassroomInput, ClassroomEnrollmentUncheckedCreateWithoutClassroomInput> | ClassroomEnrollmentCreateWithoutClassroomInput[] | ClassroomEnrollmentUncheckedCreateWithoutClassroomInput[]
    connectOrCreate?: ClassroomEnrollmentCreateOrConnectWithoutClassroomInput | ClassroomEnrollmentCreateOrConnectWithoutClassroomInput[]
    upsert?: ClassroomEnrollmentUpsertWithWhereUniqueWithoutClassroomInput | ClassroomEnrollmentUpsertWithWhereUniqueWithoutClassroomInput[]
    createMany?: ClassroomEnrollmentCreateManyClassroomInputEnvelope
    set?: ClassroomEnrollmentWhereUniqueInput | ClassroomEnrollmentWhereUniqueInput[]
    disconnect?: ClassroomEnrollmentWhereUniqueInput | ClassroomEnrollmentWhereUniqueInput[]
    delete?: ClassroomEnrollmentWhereUniqueInput | ClassroomEnrollmentWhereUniqueInput[]
    connect?: ClassroomEnrollmentWhereUniqueInput | ClassroomEnrollmentWhereUniqueInput[]
    update?: ClassroomEnrollmentUpdateWithWhereUniqueWithoutClassroomInput | ClassroomEnrollmentUpdateWithWhereUniqueWithoutClassroomInput[]
    updateMany?: ClassroomEnrollmentUpdateManyWithWhereWithoutClassroomInput | ClassroomEnrollmentUpdateManyWithWhereWithoutClassroomInput[]
    deleteMany?: ClassroomEnrollmentScalarWhereInput | ClassroomEnrollmentScalarWhereInput[]
  }

  export type ClassroomEnrollmentUncheckedUpdateManyWithoutClassroomNestedInput = {
    create?: XOR<ClassroomEnrollmentCreateWithoutClassroomInput, ClassroomEnrollmentUncheckedCreateWithoutClassroomInput> | ClassroomEnrollmentCreateWithoutClassroomInput[] | ClassroomEnrollmentUncheckedCreateWithoutClassroomInput[]
    connectOrCreate?: ClassroomEnrollmentCreateOrConnectWithoutClassroomInput | ClassroomEnrollmentCreateOrConnectWithoutClassroomInput[]
    upsert?: ClassroomEnrollmentUpsertWithWhereUniqueWithoutClassroomInput | ClassroomEnrollmentUpsertWithWhereUniqueWithoutClassroomInput[]
    createMany?: ClassroomEnrollmentCreateManyClassroomInputEnvelope
    set?: ClassroomEnrollmentWhereUniqueInput | ClassroomEnrollmentWhereUniqueInput[]
    disconnect?: ClassroomEnrollmentWhereUniqueInput | ClassroomEnrollmentWhereUniqueInput[]
    delete?: ClassroomEnrollmentWhereUniqueInput | ClassroomEnrollmentWhereUniqueInput[]
    connect?: ClassroomEnrollmentWhereUniqueInput | ClassroomEnrollmentWhereUniqueInput[]
    update?: ClassroomEnrollmentUpdateWithWhereUniqueWithoutClassroomInput | ClassroomEnrollmentUpdateWithWhereUniqueWithoutClassroomInput[]
    updateMany?: ClassroomEnrollmentUpdateManyWithWhereWithoutClassroomInput | ClassroomEnrollmentUpdateManyWithWhereWithoutClassroomInput[]
    deleteMany?: ClassroomEnrollmentScalarWhereInput | ClassroomEnrollmentScalarWhereInput[]
  }

  export type InstitutionCreateNestedOneWithoutDepartmentsInput = {
    create?: XOR<InstitutionCreateWithoutDepartmentsInput, InstitutionUncheckedCreateWithoutDepartmentsInput>
    connectOrCreate?: InstitutionCreateOrConnectWithoutDepartmentsInput
    connect?: InstitutionWhereUniqueInput
  }

  export type ClassroomCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<ClassroomCreateWithoutDepartmentInput, ClassroomUncheckedCreateWithoutDepartmentInput> | ClassroomCreateWithoutDepartmentInput[] | ClassroomUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: ClassroomCreateOrConnectWithoutDepartmentInput | ClassroomCreateOrConnectWithoutDepartmentInput[]
    createMany?: ClassroomCreateManyDepartmentInputEnvelope
    connect?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
  }

  export type ClassroomUncheckedCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<ClassroomCreateWithoutDepartmentInput, ClassroomUncheckedCreateWithoutDepartmentInput> | ClassroomCreateWithoutDepartmentInput[] | ClassroomUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: ClassroomCreateOrConnectWithoutDepartmentInput | ClassroomCreateOrConnectWithoutDepartmentInput[]
    createMany?: ClassroomCreateManyDepartmentInputEnvelope
    connect?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
  }

  export type InstitutionUpdateOneRequiredWithoutDepartmentsNestedInput = {
    create?: XOR<InstitutionCreateWithoutDepartmentsInput, InstitutionUncheckedCreateWithoutDepartmentsInput>
    connectOrCreate?: InstitutionCreateOrConnectWithoutDepartmentsInput
    upsert?: InstitutionUpsertWithoutDepartmentsInput
    connect?: InstitutionWhereUniqueInput
    update?: XOR<XOR<InstitutionUpdateToOneWithWhereWithoutDepartmentsInput, InstitutionUpdateWithoutDepartmentsInput>, InstitutionUncheckedUpdateWithoutDepartmentsInput>
  }

  export type ClassroomUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<ClassroomCreateWithoutDepartmentInput, ClassroomUncheckedCreateWithoutDepartmentInput> | ClassroomCreateWithoutDepartmentInput[] | ClassroomUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: ClassroomCreateOrConnectWithoutDepartmentInput | ClassroomCreateOrConnectWithoutDepartmentInput[]
    upsert?: ClassroomUpsertWithWhereUniqueWithoutDepartmentInput | ClassroomUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: ClassroomCreateManyDepartmentInputEnvelope
    set?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
    disconnect?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
    delete?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
    connect?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
    update?: ClassroomUpdateWithWhereUniqueWithoutDepartmentInput | ClassroomUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: ClassroomUpdateManyWithWhereWithoutDepartmentInput | ClassroomUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: ClassroomScalarWhereInput | ClassroomScalarWhereInput[]
  }

  export type ClassroomUncheckedUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<ClassroomCreateWithoutDepartmentInput, ClassroomUncheckedCreateWithoutDepartmentInput> | ClassroomCreateWithoutDepartmentInput[] | ClassroomUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: ClassroomCreateOrConnectWithoutDepartmentInput | ClassroomCreateOrConnectWithoutDepartmentInput[]
    upsert?: ClassroomUpsertWithWhereUniqueWithoutDepartmentInput | ClassroomUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: ClassroomCreateManyDepartmentInputEnvelope
    set?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
    disconnect?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
    delete?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
    connect?: ClassroomWhereUniqueInput | ClassroomWhereUniqueInput[]
    update?: ClassroomUpdateWithWhereUniqueWithoutDepartmentInput | ClassroomUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: ClassroomUpdateManyWithWhereWithoutDepartmentInput | ClassroomUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: ClassroomScalarWhereInput | ClassroomScalarWhereInput[]
  }

  export type InstitutionCreateNestedOneWithoutMembersInput = {
    create?: XOR<InstitutionCreateWithoutMembersInput, InstitutionUncheckedCreateWithoutMembersInput>
    connectOrCreate?: InstitutionCreateOrConnectWithoutMembersInput
    connect?: InstitutionWhereUniqueInput
  }

  export type InstitutionUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<InstitutionCreateWithoutMembersInput, InstitutionUncheckedCreateWithoutMembersInput>
    connectOrCreate?: InstitutionCreateOrConnectWithoutMembersInput
    upsert?: InstitutionUpsertWithoutMembersInput
    connect?: InstitutionWhereUniqueInput
    update?: XOR<XOR<InstitutionUpdateToOneWithWhereWithoutMembersInput, InstitutionUpdateWithoutMembersInput>, InstitutionUncheckedUpdateWithoutMembersInput>
  }

  export type ClassroomCreateNestedOneWithoutEnrollmentsInput = {
    create?: XOR<ClassroomCreateWithoutEnrollmentsInput, ClassroomUncheckedCreateWithoutEnrollmentsInput>
    connectOrCreate?: ClassroomCreateOrConnectWithoutEnrollmentsInput
    connect?: ClassroomWhereUniqueInput
  }

  export type ClassroomUpdateOneRequiredWithoutEnrollmentsNestedInput = {
    create?: XOR<ClassroomCreateWithoutEnrollmentsInput, ClassroomUncheckedCreateWithoutEnrollmentsInput>
    connectOrCreate?: ClassroomCreateOrConnectWithoutEnrollmentsInput
    upsert?: ClassroomUpsertWithoutEnrollmentsInput
    connect?: ClassroomWhereUniqueInput
    update?: XOR<XOR<ClassroomUpdateToOneWithWhereWithoutEnrollmentsInput, ClassroomUpdateWithoutEnrollmentsInput>, ClassroomUncheckedUpdateWithoutEnrollmentsInput>
  }

  export type InstitutionCreateNestedOneWithoutInvitesInput = {
    create?: XOR<InstitutionCreateWithoutInvitesInput, InstitutionUncheckedCreateWithoutInvitesInput>
    connectOrCreate?: InstitutionCreateOrConnectWithoutInvitesInput
    connect?: InstitutionWhereUniqueInput
  }

  export type InstitutionUpdateOneRequiredWithoutInvitesNestedInput = {
    create?: XOR<InstitutionCreateWithoutInvitesInput, InstitutionUncheckedCreateWithoutInvitesInput>
    connectOrCreate?: InstitutionCreateOrConnectWithoutInvitesInput
    upsert?: InstitutionUpsertWithoutInvitesInput
    connect?: InstitutionWhereUniqueInput
    update?: XOR<XOR<InstitutionUpdateToOneWithWhereWithoutInvitesInput, InstitutionUpdateWithoutInvitesInput>, InstitutionUncheckedUpdateWithoutInvitesInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type ClassroomCreateWithoutInstitutionInput = {
    id?: string
    teacherId?: string | null
    title: string
    code: string
    capacity?: number | null
    status?: string | null
    startsAt?: Date | string | null
    endsAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    department?: DepartmentCreateNestedOneWithoutClassroomsInput
    enrollments?: ClassroomEnrollmentCreateNestedManyWithoutClassroomInput
  }

  export type ClassroomUncheckedCreateWithoutInstitutionInput = {
    id?: string
    departmentId?: string | null
    teacherId?: string | null
    title: string
    code: string
    capacity?: number | null
    status?: string | null
    startsAt?: Date | string | null
    endsAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enrollments?: ClassroomEnrollmentUncheckedCreateNestedManyWithoutClassroomInput
  }

  export type ClassroomCreateOrConnectWithoutInstitutionInput = {
    where: ClassroomWhereUniqueInput
    create: XOR<ClassroomCreateWithoutInstitutionInput, ClassroomUncheckedCreateWithoutInstitutionInput>
  }

  export type ClassroomCreateManyInstitutionInputEnvelope = {
    data: ClassroomCreateManyInstitutionInput | ClassroomCreateManyInstitutionInput[]
  }

  export type DepartmentCreateWithoutInstitutionInput = {
    id?: string
    name: string
    slug: string
    contact?: string | null
    head?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    classrooms?: ClassroomCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUncheckedCreateWithoutInstitutionInput = {
    id?: string
    name: string
    slug: string
    contact?: string | null
    head?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    classrooms?: ClassroomUncheckedCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentCreateOrConnectWithoutInstitutionInput = {
    where: DepartmentWhereUniqueInput
    create: XOR<DepartmentCreateWithoutInstitutionInput, DepartmentUncheckedCreateWithoutInstitutionInput>
  }

  export type DepartmentCreateManyInstitutionInputEnvelope = {
    data: DepartmentCreateManyInstitutionInput | DepartmentCreateManyInstitutionInput[]
  }

  export type InstitutionMemberCreateWithoutInstitutionInput = {
    id?: string
    userId: string
    role: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InstitutionMemberUncheckedCreateWithoutInstitutionInput = {
    id?: string
    userId: string
    role: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InstitutionMemberCreateOrConnectWithoutInstitutionInput = {
    where: InstitutionMemberWhereUniqueInput
    create: XOR<InstitutionMemberCreateWithoutInstitutionInput, InstitutionMemberUncheckedCreateWithoutInstitutionInput>
  }

  export type InstitutionMemberCreateManyInstitutionInputEnvelope = {
    data: InstitutionMemberCreateManyInstitutionInput | InstitutionMemberCreateManyInstitutionInput[]
  }

  export type InstitutionInviteCreateWithoutInstitutionInput = {
    id?: string
    code: string
    role?: string
    expiresAt?: Date | string | null
    createdAt?: Date | string
  }

  export type InstitutionInviteUncheckedCreateWithoutInstitutionInput = {
    id?: string
    code: string
    role?: string
    expiresAt?: Date | string | null
    createdAt?: Date | string
  }

  export type InstitutionInviteCreateOrConnectWithoutInstitutionInput = {
    where: InstitutionInviteWhereUniqueInput
    create: XOR<InstitutionInviteCreateWithoutInstitutionInput, InstitutionInviteUncheckedCreateWithoutInstitutionInput>
  }

  export type InstitutionInviteCreateManyInstitutionInputEnvelope = {
    data: InstitutionInviteCreateManyInstitutionInput | InstitutionInviteCreateManyInstitutionInput[]
  }

  export type ClassroomUpsertWithWhereUniqueWithoutInstitutionInput = {
    where: ClassroomWhereUniqueInput
    update: XOR<ClassroomUpdateWithoutInstitutionInput, ClassroomUncheckedUpdateWithoutInstitutionInput>
    create: XOR<ClassroomCreateWithoutInstitutionInput, ClassroomUncheckedCreateWithoutInstitutionInput>
  }

  export type ClassroomUpdateWithWhereUniqueWithoutInstitutionInput = {
    where: ClassroomWhereUniqueInput
    data: XOR<ClassroomUpdateWithoutInstitutionInput, ClassroomUncheckedUpdateWithoutInstitutionInput>
  }

  export type ClassroomUpdateManyWithWhereWithoutInstitutionInput = {
    where: ClassroomScalarWhereInput
    data: XOR<ClassroomUpdateManyMutationInput, ClassroomUncheckedUpdateManyWithoutInstitutionInput>
  }

  export type ClassroomScalarWhereInput = {
    AND?: ClassroomScalarWhereInput | ClassroomScalarWhereInput[]
    OR?: ClassroomScalarWhereInput[]
    NOT?: ClassroomScalarWhereInput | ClassroomScalarWhereInput[]
    id?: StringFilter<"Classroom"> | string
    institutionId?: StringFilter<"Classroom"> | string
    departmentId?: StringNullableFilter<"Classroom"> | string | null
    teacherId?: StringNullableFilter<"Classroom"> | string | null
    title?: StringFilter<"Classroom"> | string
    code?: StringFilter<"Classroom"> | string
    capacity?: IntNullableFilter<"Classroom"> | number | null
    status?: StringNullableFilter<"Classroom"> | string | null
    startsAt?: DateTimeNullableFilter<"Classroom"> | Date | string | null
    endsAt?: DateTimeNullableFilter<"Classroom"> | Date | string | null
    createdAt?: DateTimeFilter<"Classroom"> | Date | string
    updatedAt?: DateTimeFilter<"Classroom"> | Date | string
  }

  export type DepartmentUpsertWithWhereUniqueWithoutInstitutionInput = {
    where: DepartmentWhereUniqueInput
    update: XOR<DepartmentUpdateWithoutInstitutionInput, DepartmentUncheckedUpdateWithoutInstitutionInput>
    create: XOR<DepartmentCreateWithoutInstitutionInput, DepartmentUncheckedCreateWithoutInstitutionInput>
  }

  export type DepartmentUpdateWithWhereUniqueWithoutInstitutionInput = {
    where: DepartmentWhereUniqueInput
    data: XOR<DepartmentUpdateWithoutInstitutionInput, DepartmentUncheckedUpdateWithoutInstitutionInput>
  }

  export type DepartmentUpdateManyWithWhereWithoutInstitutionInput = {
    where: DepartmentScalarWhereInput
    data: XOR<DepartmentUpdateManyMutationInput, DepartmentUncheckedUpdateManyWithoutInstitutionInput>
  }

  export type DepartmentScalarWhereInput = {
    AND?: DepartmentScalarWhereInput | DepartmentScalarWhereInput[]
    OR?: DepartmentScalarWhereInput[]
    NOT?: DepartmentScalarWhereInput | DepartmentScalarWhereInput[]
    id?: StringFilter<"Department"> | string
    institutionId?: StringFilter<"Department"> | string
    name?: StringFilter<"Department"> | string
    slug?: StringFilter<"Department"> | string
    contact?: StringNullableFilter<"Department"> | string | null
    head?: StringNullableFilter<"Department"> | string | null
    active?: BoolFilter<"Department"> | boolean
    createdAt?: DateTimeFilter<"Department"> | Date | string
    updatedAt?: DateTimeFilter<"Department"> | Date | string
  }

  export type InstitutionMemberUpsertWithWhereUniqueWithoutInstitutionInput = {
    where: InstitutionMemberWhereUniqueInput
    update: XOR<InstitutionMemberUpdateWithoutInstitutionInput, InstitutionMemberUncheckedUpdateWithoutInstitutionInput>
    create: XOR<InstitutionMemberCreateWithoutInstitutionInput, InstitutionMemberUncheckedCreateWithoutInstitutionInput>
  }

  export type InstitutionMemberUpdateWithWhereUniqueWithoutInstitutionInput = {
    where: InstitutionMemberWhereUniqueInput
    data: XOR<InstitutionMemberUpdateWithoutInstitutionInput, InstitutionMemberUncheckedUpdateWithoutInstitutionInput>
  }

  export type InstitutionMemberUpdateManyWithWhereWithoutInstitutionInput = {
    where: InstitutionMemberScalarWhereInput
    data: XOR<InstitutionMemberUpdateManyMutationInput, InstitutionMemberUncheckedUpdateManyWithoutInstitutionInput>
  }

  export type InstitutionMemberScalarWhereInput = {
    AND?: InstitutionMemberScalarWhereInput | InstitutionMemberScalarWhereInput[]
    OR?: InstitutionMemberScalarWhereInput[]
    NOT?: InstitutionMemberScalarWhereInput | InstitutionMemberScalarWhereInput[]
    id?: StringFilter<"InstitutionMember"> | string
    institutionId?: StringFilter<"InstitutionMember"> | string
    userId?: StringFilter<"InstitutionMember"> | string
    role?: StringFilter<"InstitutionMember"> | string
    status?: StringFilter<"InstitutionMember"> | string
    createdAt?: DateTimeFilter<"InstitutionMember"> | Date | string
    updatedAt?: DateTimeFilter<"InstitutionMember"> | Date | string
  }

  export type InstitutionInviteUpsertWithWhereUniqueWithoutInstitutionInput = {
    where: InstitutionInviteWhereUniqueInput
    update: XOR<InstitutionInviteUpdateWithoutInstitutionInput, InstitutionInviteUncheckedUpdateWithoutInstitutionInput>
    create: XOR<InstitutionInviteCreateWithoutInstitutionInput, InstitutionInviteUncheckedCreateWithoutInstitutionInput>
  }

  export type InstitutionInviteUpdateWithWhereUniqueWithoutInstitutionInput = {
    where: InstitutionInviteWhereUniqueInput
    data: XOR<InstitutionInviteUpdateWithoutInstitutionInput, InstitutionInviteUncheckedUpdateWithoutInstitutionInput>
  }

  export type InstitutionInviteUpdateManyWithWhereWithoutInstitutionInput = {
    where: InstitutionInviteScalarWhereInput
    data: XOR<InstitutionInviteUpdateManyMutationInput, InstitutionInviteUncheckedUpdateManyWithoutInstitutionInput>
  }

  export type InstitutionInviteScalarWhereInput = {
    AND?: InstitutionInviteScalarWhereInput | InstitutionInviteScalarWhereInput[]
    OR?: InstitutionInviteScalarWhereInput[]
    NOT?: InstitutionInviteScalarWhereInput | InstitutionInviteScalarWhereInput[]
    id?: StringFilter<"InstitutionInvite"> | string
    institutionId?: StringFilter<"InstitutionInvite"> | string
    code?: StringFilter<"InstitutionInvite"> | string
    role?: StringFilter<"InstitutionInvite"> | string
    expiresAt?: DateTimeNullableFilter<"InstitutionInvite"> | Date | string | null
    createdAt?: DateTimeFilter<"InstitutionInvite"> | Date | string
  }

  export type InstitutionCreateWithoutClassroomsInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    type?: string | null
    location?: string | null
    email?: string | null
    phone?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    departments?: DepartmentCreateNestedManyWithoutInstitutionInput
    members?: InstitutionMemberCreateNestedManyWithoutInstitutionInput
    invites?: InstitutionInviteCreateNestedManyWithoutInstitutionInput
  }

  export type InstitutionUncheckedCreateWithoutClassroomsInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    type?: string | null
    location?: string | null
    email?: string | null
    phone?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    departments?: DepartmentUncheckedCreateNestedManyWithoutInstitutionInput
    members?: InstitutionMemberUncheckedCreateNestedManyWithoutInstitutionInput
    invites?: InstitutionInviteUncheckedCreateNestedManyWithoutInstitutionInput
  }

  export type InstitutionCreateOrConnectWithoutClassroomsInput = {
    where: InstitutionWhereUniqueInput
    create: XOR<InstitutionCreateWithoutClassroomsInput, InstitutionUncheckedCreateWithoutClassroomsInput>
  }

  export type DepartmentCreateWithoutClassroomsInput = {
    id?: string
    name: string
    slug: string
    contact?: string | null
    head?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    institution: InstitutionCreateNestedOneWithoutDepartmentsInput
  }

  export type DepartmentUncheckedCreateWithoutClassroomsInput = {
    id?: string
    institutionId: string
    name: string
    slug: string
    contact?: string | null
    head?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DepartmentCreateOrConnectWithoutClassroomsInput = {
    where: DepartmentWhereUniqueInput
    create: XOR<DepartmentCreateWithoutClassroomsInput, DepartmentUncheckedCreateWithoutClassroomsInput>
  }

  export type ClassroomEnrollmentCreateWithoutClassroomInput = {
    id?: string
    studentId: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClassroomEnrollmentUncheckedCreateWithoutClassroomInput = {
    id?: string
    studentId: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClassroomEnrollmentCreateOrConnectWithoutClassroomInput = {
    where: ClassroomEnrollmentWhereUniqueInput
    create: XOR<ClassroomEnrollmentCreateWithoutClassroomInput, ClassroomEnrollmentUncheckedCreateWithoutClassroomInput>
  }

  export type ClassroomEnrollmentCreateManyClassroomInputEnvelope = {
    data: ClassroomEnrollmentCreateManyClassroomInput | ClassroomEnrollmentCreateManyClassroomInput[]
  }

  export type InstitutionUpsertWithoutClassroomsInput = {
    update: XOR<InstitutionUpdateWithoutClassroomsInput, InstitutionUncheckedUpdateWithoutClassroomsInput>
    create: XOR<InstitutionCreateWithoutClassroomsInput, InstitutionUncheckedCreateWithoutClassroomsInput>
    where?: InstitutionWhereInput
  }

  export type InstitutionUpdateToOneWithWhereWithoutClassroomsInput = {
    where?: InstitutionWhereInput
    data: XOR<InstitutionUpdateWithoutClassroomsInput, InstitutionUncheckedUpdateWithoutClassroomsInput>
  }

  export type InstitutionUpdateWithoutClassroomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    departments?: DepartmentUpdateManyWithoutInstitutionNestedInput
    members?: InstitutionMemberUpdateManyWithoutInstitutionNestedInput
    invites?: InstitutionInviteUpdateManyWithoutInstitutionNestedInput
  }

  export type InstitutionUncheckedUpdateWithoutClassroomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    departments?: DepartmentUncheckedUpdateManyWithoutInstitutionNestedInput
    members?: InstitutionMemberUncheckedUpdateManyWithoutInstitutionNestedInput
    invites?: InstitutionInviteUncheckedUpdateManyWithoutInstitutionNestedInput
  }

  export type DepartmentUpsertWithoutClassroomsInput = {
    update: XOR<DepartmentUpdateWithoutClassroomsInput, DepartmentUncheckedUpdateWithoutClassroomsInput>
    create: XOR<DepartmentCreateWithoutClassroomsInput, DepartmentUncheckedCreateWithoutClassroomsInput>
    where?: DepartmentWhereInput
  }

  export type DepartmentUpdateToOneWithWhereWithoutClassroomsInput = {
    where?: DepartmentWhereInput
    data: XOR<DepartmentUpdateWithoutClassroomsInput, DepartmentUncheckedUpdateWithoutClassroomsInput>
  }

  export type DepartmentUpdateWithoutClassroomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    head?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    institution?: InstitutionUpdateOneRequiredWithoutDepartmentsNestedInput
  }

  export type DepartmentUncheckedUpdateWithoutClassroomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    institutionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    head?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClassroomEnrollmentUpsertWithWhereUniqueWithoutClassroomInput = {
    where: ClassroomEnrollmentWhereUniqueInput
    update: XOR<ClassroomEnrollmentUpdateWithoutClassroomInput, ClassroomEnrollmentUncheckedUpdateWithoutClassroomInput>
    create: XOR<ClassroomEnrollmentCreateWithoutClassroomInput, ClassroomEnrollmentUncheckedCreateWithoutClassroomInput>
  }

  export type ClassroomEnrollmentUpdateWithWhereUniqueWithoutClassroomInput = {
    where: ClassroomEnrollmentWhereUniqueInput
    data: XOR<ClassroomEnrollmentUpdateWithoutClassroomInput, ClassroomEnrollmentUncheckedUpdateWithoutClassroomInput>
  }

  export type ClassroomEnrollmentUpdateManyWithWhereWithoutClassroomInput = {
    where: ClassroomEnrollmentScalarWhereInput
    data: XOR<ClassroomEnrollmentUpdateManyMutationInput, ClassroomEnrollmentUncheckedUpdateManyWithoutClassroomInput>
  }

  export type ClassroomEnrollmentScalarWhereInput = {
    AND?: ClassroomEnrollmentScalarWhereInput | ClassroomEnrollmentScalarWhereInput[]
    OR?: ClassroomEnrollmentScalarWhereInput[]
    NOT?: ClassroomEnrollmentScalarWhereInput | ClassroomEnrollmentScalarWhereInput[]
    id?: StringFilter<"ClassroomEnrollment"> | string
    classroomId?: StringFilter<"ClassroomEnrollment"> | string
    studentId?: StringFilter<"ClassroomEnrollment"> | string
    status?: StringFilter<"ClassroomEnrollment"> | string
    createdAt?: DateTimeFilter<"ClassroomEnrollment"> | Date | string
    updatedAt?: DateTimeFilter<"ClassroomEnrollment"> | Date | string
  }

  export type InstitutionCreateWithoutDepartmentsInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    type?: string | null
    location?: string | null
    email?: string | null
    phone?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    classrooms?: ClassroomCreateNestedManyWithoutInstitutionInput
    members?: InstitutionMemberCreateNestedManyWithoutInstitutionInput
    invites?: InstitutionInviteCreateNestedManyWithoutInstitutionInput
  }

  export type InstitutionUncheckedCreateWithoutDepartmentsInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    type?: string | null
    location?: string | null
    email?: string | null
    phone?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    classrooms?: ClassroomUncheckedCreateNestedManyWithoutInstitutionInput
    members?: InstitutionMemberUncheckedCreateNestedManyWithoutInstitutionInput
    invites?: InstitutionInviteUncheckedCreateNestedManyWithoutInstitutionInput
  }

  export type InstitutionCreateOrConnectWithoutDepartmentsInput = {
    where: InstitutionWhereUniqueInput
    create: XOR<InstitutionCreateWithoutDepartmentsInput, InstitutionUncheckedCreateWithoutDepartmentsInput>
  }

  export type ClassroomCreateWithoutDepartmentInput = {
    id?: string
    teacherId?: string | null
    title: string
    code: string
    capacity?: number | null
    status?: string | null
    startsAt?: Date | string | null
    endsAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    institution: InstitutionCreateNestedOneWithoutClassroomsInput
    enrollments?: ClassroomEnrollmentCreateNestedManyWithoutClassroomInput
  }

  export type ClassroomUncheckedCreateWithoutDepartmentInput = {
    id?: string
    institutionId: string
    teacherId?: string | null
    title: string
    code: string
    capacity?: number | null
    status?: string | null
    startsAt?: Date | string | null
    endsAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enrollments?: ClassroomEnrollmentUncheckedCreateNestedManyWithoutClassroomInput
  }

  export type ClassroomCreateOrConnectWithoutDepartmentInput = {
    where: ClassroomWhereUniqueInput
    create: XOR<ClassroomCreateWithoutDepartmentInput, ClassroomUncheckedCreateWithoutDepartmentInput>
  }

  export type ClassroomCreateManyDepartmentInputEnvelope = {
    data: ClassroomCreateManyDepartmentInput | ClassroomCreateManyDepartmentInput[]
  }

  export type InstitutionUpsertWithoutDepartmentsInput = {
    update: XOR<InstitutionUpdateWithoutDepartmentsInput, InstitutionUncheckedUpdateWithoutDepartmentsInput>
    create: XOR<InstitutionCreateWithoutDepartmentsInput, InstitutionUncheckedCreateWithoutDepartmentsInput>
    where?: InstitutionWhereInput
  }

  export type InstitutionUpdateToOneWithWhereWithoutDepartmentsInput = {
    where?: InstitutionWhereInput
    data: XOR<InstitutionUpdateWithoutDepartmentsInput, InstitutionUncheckedUpdateWithoutDepartmentsInput>
  }

  export type InstitutionUpdateWithoutDepartmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    classrooms?: ClassroomUpdateManyWithoutInstitutionNestedInput
    members?: InstitutionMemberUpdateManyWithoutInstitutionNestedInput
    invites?: InstitutionInviteUpdateManyWithoutInstitutionNestedInput
  }

  export type InstitutionUncheckedUpdateWithoutDepartmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    classrooms?: ClassroomUncheckedUpdateManyWithoutInstitutionNestedInput
    members?: InstitutionMemberUncheckedUpdateManyWithoutInstitutionNestedInput
    invites?: InstitutionInviteUncheckedUpdateManyWithoutInstitutionNestedInput
  }

  export type ClassroomUpsertWithWhereUniqueWithoutDepartmentInput = {
    where: ClassroomWhereUniqueInput
    update: XOR<ClassroomUpdateWithoutDepartmentInput, ClassroomUncheckedUpdateWithoutDepartmentInput>
    create: XOR<ClassroomCreateWithoutDepartmentInput, ClassroomUncheckedCreateWithoutDepartmentInput>
  }

  export type ClassroomUpdateWithWhereUniqueWithoutDepartmentInput = {
    where: ClassroomWhereUniqueInput
    data: XOR<ClassroomUpdateWithoutDepartmentInput, ClassroomUncheckedUpdateWithoutDepartmentInput>
  }

  export type ClassroomUpdateManyWithWhereWithoutDepartmentInput = {
    where: ClassroomScalarWhereInput
    data: XOR<ClassroomUpdateManyMutationInput, ClassroomUncheckedUpdateManyWithoutDepartmentInput>
  }

  export type InstitutionCreateWithoutMembersInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    type?: string | null
    location?: string | null
    email?: string | null
    phone?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    classrooms?: ClassroomCreateNestedManyWithoutInstitutionInput
    departments?: DepartmentCreateNestedManyWithoutInstitutionInput
    invites?: InstitutionInviteCreateNestedManyWithoutInstitutionInput
  }

  export type InstitutionUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    type?: string | null
    location?: string | null
    email?: string | null
    phone?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    classrooms?: ClassroomUncheckedCreateNestedManyWithoutInstitutionInput
    departments?: DepartmentUncheckedCreateNestedManyWithoutInstitutionInput
    invites?: InstitutionInviteUncheckedCreateNestedManyWithoutInstitutionInput
  }

  export type InstitutionCreateOrConnectWithoutMembersInput = {
    where: InstitutionWhereUniqueInput
    create: XOR<InstitutionCreateWithoutMembersInput, InstitutionUncheckedCreateWithoutMembersInput>
  }

  export type InstitutionUpsertWithoutMembersInput = {
    update: XOR<InstitutionUpdateWithoutMembersInput, InstitutionUncheckedUpdateWithoutMembersInput>
    create: XOR<InstitutionCreateWithoutMembersInput, InstitutionUncheckedCreateWithoutMembersInput>
    where?: InstitutionWhereInput
  }

  export type InstitutionUpdateToOneWithWhereWithoutMembersInput = {
    where?: InstitutionWhereInput
    data: XOR<InstitutionUpdateWithoutMembersInput, InstitutionUncheckedUpdateWithoutMembersInput>
  }

  export type InstitutionUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    classrooms?: ClassroomUpdateManyWithoutInstitutionNestedInput
    departments?: DepartmentUpdateManyWithoutInstitutionNestedInput
    invites?: InstitutionInviteUpdateManyWithoutInstitutionNestedInput
  }

  export type InstitutionUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    classrooms?: ClassroomUncheckedUpdateManyWithoutInstitutionNestedInput
    departments?: DepartmentUncheckedUpdateManyWithoutInstitutionNestedInput
    invites?: InstitutionInviteUncheckedUpdateManyWithoutInstitutionNestedInput
  }

  export type ClassroomCreateWithoutEnrollmentsInput = {
    id?: string
    teacherId?: string | null
    title: string
    code: string
    capacity?: number | null
    status?: string | null
    startsAt?: Date | string | null
    endsAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    institution: InstitutionCreateNestedOneWithoutClassroomsInput
    department?: DepartmentCreateNestedOneWithoutClassroomsInput
  }

  export type ClassroomUncheckedCreateWithoutEnrollmentsInput = {
    id?: string
    institutionId: string
    departmentId?: string | null
    teacherId?: string | null
    title: string
    code: string
    capacity?: number | null
    status?: string | null
    startsAt?: Date | string | null
    endsAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClassroomCreateOrConnectWithoutEnrollmentsInput = {
    where: ClassroomWhereUniqueInput
    create: XOR<ClassroomCreateWithoutEnrollmentsInput, ClassroomUncheckedCreateWithoutEnrollmentsInput>
  }

  export type ClassroomUpsertWithoutEnrollmentsInput = {
    update: XOR<ClassroomUpdateWithoutEnrollmentsInput, ClassroomUncheckedUpdateWithoutEnrollmentsInput>
    create: XOR<ClassroomCreateWithoutEnrollmentsInput, ClassroomUncheckedCreateWithoutEnrollmentsInput>
    where?: ClassroomWhereInput
  }

  export type ClassroomUpdateToOneWithWhereWithoutEnrollmentsInput = {
    where?: ClassroomWhereInput
    data: XOR<ClassroomUpdateWithoutEnrollmentsInput, ClassroomUncheckedUpdateWithoutEnrollmentsInput>
  }

  export type ClassroomUpdateWithoutEnrollmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    startsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    institution?: InstitutionUpdateOneRequiredWithoutClassroomsNestedInput
    department?: DepartmentUpdateOneWithoutClassroomsNestedInput
  }

  export type ClassroomUncheckedUpdateWithoutEnrollmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    institutionId?: StringFieldUpdateOperationsInput | string
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    startsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstitutionCreateWithoutInvitesInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    type?: string | null
    location?: string | null
    email?: string | null
    phone?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    classrooms?: ClassroomCreateNestedManyWithoutInstitutionInput
    departments?: DepartmentCreateNestedManyWithoutInstitutionInput
    members?: InstitutionMemberCreateNestedManyWithoutInstitutionInput
  }

  export type InstitutionUncheckedCreateWithoutInvitesInput = {
    id?: string
    name: string
    slug: string
    description?: string | null
    type?: string | null
    location?: string | null
    email?: string | null
    phone?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    classrooms?: ClassroomUncheckedCreateNestedManyWithoutInstitutionInput
    departments?: DepartmentUncheckedCreateNestedManyWithoutInstitutionInput
    members?: InstitutionMemberUncheckedCreateNestedManyWithoutInstitutionInput
  }

  export type InstitutionCreateOrConnectWithoutInvitesInput = {
    where: InstitutionWhereUniqueInput
    create: XOR<InstitutionCreateWithoutInvitesInput, InstitutionUncheckedCreateWithoutInvitesInput>
  }

  export type InstitutionUpsertWithoutInvitesInput = {
    update: XOR<InstitutionUpdateWithoutInvitesInput, InstitutionUncheckedUpdateWithoutInvitesInput>
    create: XOR<InstitutionCreateWithoutInvitesInput, InstitutionUncheckedCreateWithoutInvitesInput>
    where?: InstitutionWhereInput
  }

  export type InstitutionUpdateToOneWithWhereWithoutInvitesInput = {
    where?: InstitutionWhereInput
    data: XOR<InstitutionUpdateWithoutInvitesInput, InstitutionUncheckedUpdateWithoutInvitesInput>
  }

  export type InstitutionUpdateWithoutInvitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    classrooms?: ClassroomUpdateManyWithoutInstitutionNestedInput
    departments?: DepartmentUpdateManyWithoutInstitutionNestedInput
    members?: InstitutionMemberUpdateManyWithoutInstitutionNestedInput
  }

  export type InstitutionUncheckedUpdateWithoutInvitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    classrooms?: ClassroomUncheckedUpdateManyWithoutInstitutionNestedInput
    departments?: DepartmentUncheckedUpdateManyWithoutInstitutionNestedInput
    members?: InstitutionMemberUncheckedUpdateManyWithoutInstitutionNestedInput
  }

  export type ClassroomCreateManyInstitutionInput = {
    id?: string
    departmentId?: string | null
    teacherId?: string | null
    title: string
    code: string
    capacity?: number | null
    status?: string | null
    startsAt?: Date | string | null
    endsAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DepartmentCreateManyInstitutionInput = {
    id?: string
    name: string
    slug: string
    contact?: string | null
    head?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InstitutionMemberCreateManyInstitutionInput = {
    id?: string
    userId: string
    role: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InstitutionInviteCreateManyInstitutionInput = {
    id?: string
    code: string
    role?: string
    expiresAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ClassroomUpdateWithoutInstitutionInput = {
    id?: StringFieldUpdateOperationsInput | string
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    startsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    department?: DepartmentUpdateOneWithoutClassroomsNestedInput
    enrollments?: ClassroomEnrollmentUpdateManyWithoutClassroomNestedInput
  }

  export type ClassroomUncheckedUpdateWithoutInstitutionInput = {
    id?: StringFieldUpdateOperationsInput | string
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    startsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: ClassroomEnrollmentUncheckedUpdateManyWithoutClassroomNestedInput
  }

  export type ClassroomUncheckedUpdateManyWithoutInstitutionInput = {
    id?: StringFieldUpdateOperationsInput | string
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    startsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentUpdateWithoutInstitutionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    head?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    classrooms?: ClassroomUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentUncheckedUpdateWithoutInstitutionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    head?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    classrooms?: ClassroomUncheckedUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentUncheckedUpdateManyWithoutInstitutionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    head?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstitutionMemberUpdateWithoutInstitutionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstitutionMemberUncheckedUpdateWithoutInstitutionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstitutionMemberUncheckedUpdateManyWithoutInstitutionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstitutionInviteUpdateWithoutInstitutionInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstitutionInviteUncheckedUpdateWithoutInstitutionInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InstitutionInviteUncheckedUpdateManyWithoutInstitutionInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClassroomEnrollmentCreateManyClassroomInput = {
    id?: string
    studentId: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClassroomEnrollmentUpdateWithoutClassroomInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClassroomEnrollmentUncheckedUpdateWithoutClassroomInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClassroomEnrollmentUncheckedUpdateManyWithoutClassroomInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClassroomCreateManyDepartmentInput = {
    id?: string
    institutionId: string
    teacherId?: string | null
    title: string
    code: string
    capacity?: number | null
    status?: string | null
    startsAt?: Date | string | null
    endsAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClassroomUpdateWithoutDepartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    startsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    institution?: InstitutionUpdateOneRequiredWithoutClassroomsNestedInput
    enrollments?: ClassroomEnrollmentUpdateManyWithoutClassroomNestedInput
  }

  export type ClassroomUncheckedUpdateWithoutDepartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    institutionId?: StringFieldUpdateOperationsInput | string
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    startsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: ClassroomEnrollmentUncheckedUpdateManyWithoutClassroomNestedInput
  }

  export type ClassroomUncheckedUpdateManyWithoutDepartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    institutionId?: StringFieldUpdateOperationsInput | string
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    startsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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