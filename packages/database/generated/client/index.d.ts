
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
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Recipient
 * 
 */
export type Recipient = $Result.DefaultSelection<Prisma.$RecipientPayload>
/**
 * Model VaultPosition
 * 
 */
export type VaultPosition = $Result.DefaultSelection<Prisma.$VaultPositionPayload>
/**
 * Model Transaction
 * 
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>
/**
 * Model IndexerState
 * 
 */
export type IndexerState = $Result.DefaultSelection<Prisma.$IndexerStatePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const PaymentRail: {
  MPESA: 'MPESA',
  GCASH: 'GCASH',
  MTNMOMO: 'MTNMOMO'
};

export type PaymentRail = (typeof PaymentRail)[keyof typeof PaymentRail]


export const TxStatus: {
  PENDING: 'PENDING',
  CONFIRMED_ONCHAIN: 'CONFIRMED_ONCHAIN',
  OFFRAMP_PROCESSING: 'OFFRAMP_PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

export type TxStatus = (typeof TxStatus)[keyof typeof TxStatus]

}

export type PaymentRail = $Enums.PaymentRail

export const PaymentRail: typeof $Enums.PaymentRail

export type TxStatus = $Enums.TxStatus

export const TxStatus: typeof $Enums.TxStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
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
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
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
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.recipient`: Exposes CRUD operations for the **Recipient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Recipients
    * const recipients = await prisma.recipient.findMany()
    * ```
    */
  get recipient(): Prisma.RecipientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vaultPosition`: Exposes CRUD operations for the **VaultPosition** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VaultPositions
    * const vaultPositions = await prisma.vaultPosition.findMany()
    * ```
    */
  get vaultPosition(): Prisma.VaultPositionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transaction.findMany()
    * ```
    */
  get transaction(): Prisma.TransactionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.indexerState`: Exposes CRUD operations for the **IndexerState** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IndexerStates
    * const indexerStates = await prisma.indexerState.findMany()
    * ```
    */
  get indexerState(): Prisma.IndexerStateDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
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
    User: 'User',
    Recipient: 'Recipient',
    VaultPosition: 'VaultPosition',
    Transaction: 'Transaction',
    IndexerState: 'IndexerState'
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
      modelProps: "user" | "recipient" | "vaultPosition" | "transaction" | "indexerState"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Recipient: {
        payload: Prisma.$RecipientPayload<ExtArgs>
        fields: Prisma.RecipientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RecipientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RecipientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipientPayload>
          }
          findFirst: {
            args: Prisma.RecipientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RecipientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipientPayload>
          }
          findMany: {
            args: Prisma.RecipientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipientPayload>[]
          }
          create: {
            args: Prisma.RecipientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipientPayload>
          }
          createMany: {
            args: Prisma.RecipientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RecipientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipientPayload>[]
          }
          delete: {
            args: Prisma.RecipientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipientPayload>
          }
          update: {
            args: Prisma.RecipientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipientPayload>
          }
          deleteMany: {
            args: Prisma.RecipientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RecipientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RecipientUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipientPayload>[]
          }
          upsert: {
            args: Prisma.RecipientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipientPayload>
          }
          aggregate: {
            args: Prisma.RecipientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRecipient>
          }
          groupBy: {
            args: Prisma.RecipientGroupByArgs<ExtArgs>
            result: $Utils.Optional<RecipientGroupByOutputType>[]
          }
          count: {
            args: Prisma.RecipientCountArgs<ExtArgs>
            result: $Utils.Optional<RecipientCountAggregateOutputType> | number
          }
        }
      }
      VaultPosition: {
        payload: Prisma.$VaultPositionPayload<ExtArgs>
        fields: Prisma.VaultPositionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VaultPositionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultPositionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VaultPositionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultPositionPayload>
          }
          findFirst: {
            args: Prisma.VaultPositionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultPositionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VaultPositionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultPositionPayload>
          }
          findMany: {
            args: Prisma.VaultPositionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultPositionPayload>[]
          }
          create: {
            args: Prisma.VaultPositionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultPositionPayload>
          }
          createMany: {
            args: Prisma.VaultPositionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VaultPositionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultPositionPayload>[]
          }
          delete: {
            args: Prisma.VaultPositionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultPositionPayload>
          }
          update: {
            args: Prisma.VaultPositionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultPositionPayload>
          }
          deleteMany: {
            args: Prisma.VaultPositionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VaultPositionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VaultPositionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultPositionPayload>[]
          }
          upsert: {
            args: Prisma.VaultPositionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultPositionPayload>
          }
          aggregate: {
            args: Prisma.VaultPositionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVaultPosition>
          }
          groupBy: {
            args: Prisma.VaultPositionGroupByArgs<ExtArgs>
            result: $Utils.Optional<VaultPositionGroupByOutputType>[]
          }
          count: {
            args: Prisma.VaultPositionCountArgs<ExtArgs>
            result: $Utils.Optional<VaultPositionCountAggregateOutputType> | number
          }
        }
      }
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>
        fields: Prisma.TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TransactionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaction>
          }
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number
          }
        }
      }
      IndexerState: {
        payload: Prisma.$IndexerStatePayload<ExtArgs>
        fields: Prisma.IndexerStateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IndexerStateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerStatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IndexerStateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerStatePayload>
          }
          findFirst: {
            args: Prisma.IndexerStateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerStatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IndexerStateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerStatePayload>
          }
          findMany: {
            args: Prisma.IndexerStateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerStatePayload>[]
          }
          create: {
            args: Prisma.IndexerStateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerStatePayload>
          }
          createMany: {
            args: Prisma.IndexerStateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IndexerStateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerStatePayload>[]
          }
          delete: {
            args: Prisma.IndexerStateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerStatePayload>
          }
          update: {
            args: Prisma.IndexerStateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerStatePayload>
          }
          deleteMany: {
            args: Prisma.IndexerStateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IndexerStateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IndexerStateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerStatePayload>[]
          }
          upsert: {
            args: Prisma.IndexerStateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerStatePayload>
          }
          aggregate: {
            args: Prisma.IndexerStateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIndexerState>
          }
          groupBy: {
            args: Prisma.IndexerStateGroupByArgs<ExtArgs>
            result: $Utils.Optional<IndexerStateGroupByOutputType>[]
          }
          count: {
            args: Prisma.IndexerStateCountArgs<ExtArgs>
            result: $Utils.Optional<IndexerStateCountAggregateOutputType> | number
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
    user?: UserOmit
    recipient?: RecipientOmit
    vaultPosition?: VaultPositionOmit
    transaction?: TransactionOmit
    indexerState?: IndexerStateOmit
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sentTxs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sentTxs?: boolean | UserCountOutputTypeCountSentTxsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSentTxsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }


  /**
   * Count Type RecipientCountOutputType
   */

  export type RecipientCountOutputType = {
    receivedTxs: number
  }

  export type RecipientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    receivedTxs?: boolean | RecipientCountOutputTypeCountReceivedTxsArgs
  }

  // Custom InputTypes
  /**
   * RecipientCountOutputType without action
   */
  export type RecipientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecipientCountOutputType
     */
    select?: RecipientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RecipientCountOutputType without action
   */
  export type RecipientCountOutputTypeCountReceivedTxsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    address: string | null
    phoneNumber: string | null
    siweSession: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    address: string | null
    phoneNumber: string | null
    siweSession: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    address: number
    phoneNumber: number
    siweSession: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    address?: true
    phoneNumber?: true
    siweSession?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    address?: true
    phoneNumber?: true
    siweSession?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    address?: true
    phoneNumber?: true
    siweSession?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    address: string
    phoneNumber: string | null
    siweSession: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    phoneNumber?: boolean
    siweSession?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vaultPosition?: boolean | User$vaultPositionArgs<ExtArgs>
    sentTxs?: boolean | User$sentTxsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    phoneNumber?: boolean
    siweSession?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    phoneNumber?: boolean
    siweSession?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    address?: boolean
    phoneNumber?: boolean
    siweSession?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "address" | "phoneNumber" | "siweSession" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vaultPosition?: boolean | User$vaultPositionArgs<ExtArgs>
    sentTxs?: boolean | User$sentTxsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      vaultPosition: Prisma.$VaultPositionPayload<ExtArgs> | null
      sentTxs: Prisma.$TransactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      address: string
      phoneNumber: string | null
      siweSession: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vaultPosition<T extends User$vaultPositionArgs<ExtArgs> = {}>(args?: Subset<T, User$vaultPositionArgs<ExtArgs>>): Prisma__VaultPositionClient<$Result.GetResult<Prisma.$VaultPositionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    sentTxs<T extends User$sentTxsArgs<ExtArgs> = {}>(args?: Subset<T, User$sentTxsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly address: FieldRef<"User", 'String'>
    readonly phoneNumber: FieldRef<"User", 'String'>
    readonly siweSession: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.vaultPosition
   */
  export type User$vaultPositionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultPosition
     */
    select?: VaultPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaultPosition
     */
    omit?: VaultPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaultPositionInclude<ExtArgs> | null
    where?: VaultPositionWhereInput
  }

  /**
   * User.sentTxs
   */
  export type User$sentTxsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Recipient
   */

  export type AggregateRecipient = {
    _count: RecipientCountAggregateOutputType | null
    _min: RecipientMinAggregateOutputType | null
    _max: RecipientMaxAggregateOutputType | null
  }

  export type RecipientMinAggregateOutputType = {
    id: string | null
    name: string | null
    phoneNumber: string | null
    phoneHash: string | null
    custodialAddress: string | null
    paymentRail: $Enums.PaymentRail | null
    isUpgraded: boolean | null
    createdAt: Date | null
  }

  export type RecipientMaxAggregateOutputType = {
    id: string | null
    name: string | null
    phoneNumber: string | null
    phoneHash: string | null
    custodialAddress: string | null
    paymentRail: $Enums.PaymentRail | null
    isUpgraded: boolean | null
    createdAt: Date | null
  }

  export type RecipientCountAggregateOutputType = {
    id: number
    name: number
    phoneNumber: number
    phoneHash: number
    custodialAddress: number
    paymentRail: number
    isUpgraded: number
    createdAt: number
    _all: number
  }


  export type RecipientMinAggregateInputType = {
    id?: true
    name?: true
    phoneNumber?: true
    phoneHash?: true
    custodialAddress?: true
    paymentRail?: true
    isUpgraded?: true
    createdAt?: true
  }

  export type RecipientMaxAggregateInputType = {
    id?: true
    name?: true
    phoneNumber?: true
    phoneHash?: true
    custodialAddress?: true
    paymentRail?: true
    isUpgraded?: true
    createdAt?: true
  }

  export type RecipientCountAggregateInputType = {
    id?: true
    name?: true
    phoneNumber?: true
    phoneHash?: true
    custodialAddress?: true
    paymentRail?: true
    isUpgraded?: true
    createdAt?: true
    _all?: true
  }

  export type RecipientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Recipient to aggregate.
     */
    where?: RecipientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recipients to fetch.
     */
    orderBy?: RecipientOrderByWithRelationInput | RecipientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RecipientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recipients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recipients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Recipients
    **/
    _count?: true | RecipientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RecipientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RecipientMaxAggregateInputType
  }

  export type GetRecipientAggregateType<T extends RecipientAggregateArgs> = {
        [P in keyof T & keyof AggregateRecipient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRecipient[P]>
      : GetScalarType<T[P], AggregateRecipient[P]>
  }




  export type RecipientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecipientWhereInput
    orderBy?: RecipientOrderByWithAggregationInput | RecipientOrderByWithAggregationInput[]
    by: RecipientScalarFieldEnum[] | RecipientScalarFieldEnum
    having?: RecipientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RecipientCountAggregateInputType | true
    _min?: RecipientMinAggregateInputType
    _max?: RecipientMaxAggregateInputType
  }

  export type RecipientGroupByOutputType = {
    id: string
    name: string
    phoneNumber: string
    phoneHash: string
    custodialAddress: string
    paymentRail: $Enums.PaymentRail
    isUpgraded: boolean
    createdAt: Date
    _count: RecipientCountAggregateOutputType | null
    _min: RecipientMinAggregateOutputType | null
    _max: RecipientMaxAggregateOutputType | null
  }

  type GetRecipientGroupByPayload<T extends RecipientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RecipientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RecipientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RecipientGroupByOutputType[P]>
            : GetScalarType<T[P], RecipientGroupByOutputType[P]>
        }
      >
    >


  export type RecipientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phoneNumber?: boolean
    phoneHash?: boolean
    custodialAddress?: boolean
    paymentRail?: boolean
    isUpgraded?: boolean
    createdAt?: boolean
    receivedTxs?: boolean | Recipient$receivedTxsArgs<ExtArgs>
    _count?: boolean | RecipientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recipient"]>

  export type RecipientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phoneNumber?: boolean
    phoneHash?: boolean
    custodialAddress?: boolean
    paymentRail?: boolean
    isUpgraded?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["recipient"]>

  export type RecipientSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phoneNumber?: boolean
    phoneHash?: boolean
    custodialAddress?: boolean
    paymentRail?: boolean
    isUpgraded?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["recipient"]>

  export type RecipientSelectScalar = {
    id?: boolean
    name?: boolean
    phoneNumber?: boolean
    phoneHash?: boolean
    custodialAddress?: boolean
    paymentRail?: boolean
    isUpgraded?: boolean
    createdAt?: boolean
  }

  export type RecipientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "phoneNumber" | "phoneHash" | "custodialAddress" | "paymentRail" | "isUpgraded" | "createdAt", ExtArgs["result"]["recipient"]>
  export type RecipientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    receivedTxs?: boolean | Recipient$receivedTxsArgs<ExtArgs>
    _count?: boolean | RecipientCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RecipientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RecipientIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RecipientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Recipient"
    objects: {
      receivedTxs: Prisma.$TransactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      phoneNumber: string
      phoneHash: string
      custodialAddress: string
      paymentRail: $Enums.PaymentRail
      isUpgraded: boolean
      createdAt: Date
    }, ExtArgs["result"]["recipient"]>
    composites: {}
  }

  type RecipientGetPayload<S extends boolean | null | undefined | RecipientDefaultArgs> = $Result.GetResult<Prisma.$RecipientPayload, S>

  type RecipientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RecipientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RecipientCountAggregateInputType | true
    }

  export interface RecipientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Recipient'], meta: { name: 'Recipient' } }
    /**
     * Find zero or one Recipient that matches the filter.
     * @param {RecipientFindUniqueArgs} args - Arguments to find a Recipient
     * @example
     * // Get one Recipient
     * const recipient = await prisma.recipient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RecipientFindUniqueArgs>(args: SelectSubset<T, RecipientFindUniqueArgs<ExtArgs>>): Prisma__RecipientClient<$Result.GetResult<Prisma.$RecipientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Recipient that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RecipientFindUniqueOrThrowArgs} args - Arguments to find a Recipient
     * @example
     * // Get one Recipient
     * const recipient = await prisma.recipient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RecipientFindUniqueOrThrowArgs>(args: SelectSubset<T, RecipientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RecipientClient<$Result.GetResult<Prisma.$RecipientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Recipient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipientFindFirstArgs} args - Arguments to find a Recipient
     * @example
     * // Get one Recipient
     * const recipient = await prisma.recipient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RecipientFindFirstArgs>(args?: SelectSubset<T, RecipientFindFirstArgs<ExtArgs>>): Prisma__RecipientClient<$Result.GetResult<Prisma.$RecipientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Recipient that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipientFindFirstOrThrowArgs} args - Arguments to find a Recipient
     * @example
     * // Get one Recipient
     * const recipient = await prisma.recipient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RecipientFindFirstOrThrowArgs>(args?: SelectSubset<T, RecipientFindFirstOrThrowArgs<ExtArgs>>): Prisma__RecipientClient<$Result.GetResult<Prisma.$RecipientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Recipients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Recipients
     * const recipients = await prisma.recipient.findMany()
     * 
     * // Get first 10 Recipients
     * const recipients = await prisma.recipient.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const recipientWithIdOnly = await prisma.recipient.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RecipientFindManyArgs>(args?: SelectSubset<T, RecipientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecipientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Recipient.
     * @param {RecipientCreateArgs} args - Arguments to create a Recipient.
     * @example
     * // Create one Recipient
     * const Recipient = await prisma.recipient.create({
     *   data: {
     *     // ... data to create a Recipient
     *   }
     * })
     * 
     */
    create<T extends RecipientCreateArgs>(args: SelectSubset<T, RecipientCreateArgs<ExtArgs>>): Prisma__RecipientClient<$Result.GetResult<Prisma.$RecipientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Recipients.
     * @param {RecipientCreateManyArgs} args - Arguments to create many Recipients.
     * @example
     * // Create many Recipients
     * const recipient = await prisma.recipient.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RecipientCreateManyArgs>(args?: SelectSubset<T, RecipientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Recipients and returns the data saved in the database.
     * @param {RecipientCreateManyAndReturnArgs} args - Arguments to create many Recipients.
     * @example
     * // Create many Recipients
     * const recipient = await prisma.recipient.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Recipients and only return the `id`
     * const recipientWithIdOnly = await prisma.recipient.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RecipientCreateManyAndReturnArgs>(args?: SelectSubset<T, RecipientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecipientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Recipient.
     * @param {RecipientDeleteArgs} args - Arguments to delete one Recipient.
     * @example
     * // Delete one Recipient
     * const Recipient = await prisma.recipient.delete({
     *   where: {
     *     // ... filter to delete one Recipient
     *   }
     * })
     * 
     */
    delete<T extends RecipientDeleteArgs>(args: SelectSubset<T, RecipientDeleteArgs<ExtArgs>>): Prisma__RecipientClient<$Result.GetResult<Prisma.$RecipientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Recipient.
     * @param {RecipientUpdateArgs} args - Arguments to update one Recipient.
     * @example
     * // Update one Recipient
     * const recipient = await prisma.recipient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RecipientUpdateArgs>(args: SelectSubset<T, RecipientUpdateArgs<ExtArgs>>): Prisma__RecipientClient<$Result.GetResult<Prisma.$RecipientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Recipients.
     * @param {RecipientDeleteManyArgs} args - Arguments to filter Recipients to delete.
     * @example
     * // Delete a few Recipients
     * const { count } = await prisma.recipient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RecipientDeleteManyArgs>(args?: SelectSubset<T, RecipientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Recipients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Recipients
     * const recipient = await prisma.recipient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RecipientUpdateManyArgs>(args: SelectSubset<T, RecipientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Recipients and returns the data updated in the database.
     * @param {RecipientUpdateManyAndReturnArgs} args - Arguments to update many Recipients.
     * @example
     * // Update many Recipients
     * const recipient = await prisma.recipient.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Recipients and only return the `id`
     * const recipientWithIdOnly = await prisma.recipient.updateManyAndReturn({
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
    updateManyAndReturn<T extends RecipientUpdateManyAndReturnArgs>(args: SelectSubset<T, RecipientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecipientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Recipient.
     * @param {RecipientUpsertArgs} args - Arguments to update or create a Recipient.
     * @example
     * // Update or create a Recipient
     * const recipient = await prisma.recipient.upsert({
     *   create: {
     *     // ... data to create a Recipient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Recipient we want to update
     *   }
     * })
     */
    upsert<T extends RecipientUpsertArgs>(args: SelectSubset<T, RecipientUpsertArgs<ExtArgs>>): Prisma__RecipientClient<$Result.GetResult<Prisma.$RecipientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Recipients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipientCountArgs} args - Arguments to filter Recipients to count.
     * @example
     * // Count the number of Recipients
     * const count = await prisma.recipient.count({
     *   where: {
     *     // ... the filter for the Recipients we want to count
     *   }
     * })
    **/
    count<T extends RecipientCountArgs>(
      args?: Subset<T, RecipientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RecipientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Recipient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RecipientAggregateArgs>(args: Subset<T, RecipientAggregateArgs>): Prisma.PrismaPromise<GetRecipientAggregateType<T>>

    /**
     * Group by Recipient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipientGroupByArgs} args - Group by arguments.
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
      T extends RecipientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RecipientGroupByArgs['orderBy'] }
        : { orderBy?: RecipientGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RecipientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecipientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Recipient model
   */
  readonly fields: RecipientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Recipient.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RecipientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    receivedTxs<T extends Recipient$receivedTxsArgs<ExtArgs> = {}>(args?: Subset<T, Recipient$receivedTxsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Recipient model
   */
  interface RecipientFieldRefs {
    readonly id: FieldRef<"Recipient", 'String'>
    readonly name: FieldRef<"Recipient", 'String'>
    readonly phoneNumber: FieldRef<"Recipient", 'String'>
    readonly phoneHash: FieldRef<"Recipient", 'String'>
    readonly custodialAddress: FieldRef<"Recipient", 'String'>
    readonly paymentRail: FieldRef<"Recipient", 'PaymentRail'>
    readonly isUpgraded: FieldRef<"Recipient", 'Boolean'>
    readonly createdAt: FieldRef<"Recipient", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Recipient findUnique
   */
  export type RecipientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipient
     */
    select?: RecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recipient
     */
    omit?: RecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipientInclude<ExtArgs> | null
    /**
     * Filter, which Recipient to fetch.
     */
    where: RecipientWhereUniqueInput
  }

  /**
   * Recipient findUniqueOrThrow
   */
  export type RecipientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipient
     */
    select?: RecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recipient
     */
    omit?: RecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipientInclude<ExtArgs> | null
    /**
     * Filter, which Recipient to fetch.
     */
    where: RecipientWhereUniqueInput
  }

  /**
   * Recipient findFirst
   */
  export type RecipientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipient
     */
    select?: RecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recipient
     */
    omit?: RecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipientInclude<ExtArgs> | null
    /**
     * Filter, which Recipient to fetch.
     */
    where?: RecipientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recipients to fetch.
     */
    orderBy?: RecipientOrderByWithRelationInput | RecipientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Recipients.
     */
    cursor?: RecipientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recipients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recipients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Recipients.
     */
    distinct?: RecipientScalarFieldEnum | RecipientScalarFieldEnum[]
  }

  /**
   * Recipient findFirstOrThrow
   */
  export type RecipientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipient
     */
    select?: RecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recipient
     */
    omit?: RecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipientInclude<ExtArgs> | null
    /**
     * Filter, which Recipient to fetch.
     */
    where?: RecipientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recipients to fetch.
     */
    orderBy?: RecipientOrderByWithRelationInput | RecipientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Recipients.
     */
    cursor?: RecipientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recipients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recipients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Recipients.
     */
    distinct?: RecipientScalarFieldEnum | RecipientScalarFieldEnum[]
  }

  /**
   * Recipient findMany
   */
  export type RecipientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipient
     */
    select?: RecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recipient
     */
    omit?: RecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipientInclude<ExtArgs> | null
    /**
     * Filter, which Recipients to fetch.
     */
    where?: RecipientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recipients to fetch.
     */
    orderBy?: RecipientOrderByWithRelationInput | RecipientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Recipients.
     */
    cursor?: RecipientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recipients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recipients.
     */
    skip?: number
    distinct?: RecipientScalarFieldEnum | RecipientScalarFieldEnum[]
  }

  /**
   * Recipient create
   */
  export type RecipientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipient
     */
    select?: RecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recipient
     */
    omit?: RecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipientInclude<ExtArgs> | null
    /**
     * The data needed to create a Recipient.
     */
    data: XOR<RecipientCreateInput, RecipientUncheckedCreateInput>
  }

  /**
   * Recipient createMany
   */
  export type RecipientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Recipients.
     */
    data: RecipientCreateManyInput | RecipientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Recipient createManyAndReturn
   */
  export type RecipientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipient
     */
    select?: RecipientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Recipient
     */
    omit?: RecipientOmit<ExtArgs> | null
    /**
     * The data used to create many Recipients.
     */
    data: RecipientCreateManyInput | RecipientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Recipient update
   */
  export type RecipientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipient
     */
    select?: RecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recipient
     */
    omit?: RecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipientInclude<ExtArgs> | null
    /**
     * The data needed to update a Recipient.
     */
    data: XOR<RecipientUpdateInput, RecipientUncheckedUpdateInput>
    /**
     * Choose, which Recipient to update.
     */
    where: RecipientWhereUniqueInput
  }

  /**
   * Recipient updateMany
   */
  export type RecipientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Recipients.
     */
    data: XOR<RecipientUpdateManyMutationInput, RecipientUncheckedUpdateManyInput>
    /**
     * Filter which Recipients to update
     */
    where?: RecipientWhereInput
    /**
     * Limit how many Recipients to update.
     */
    limit?: number
  }

  /**
   * Recipient updateManyAndReturn
   */
  export type RecipientUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipient
     */
    select?: RecipientSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Recipient
     */
    omit?: RecipientOmit<ExtArgs> | null
    /**
     * The data used to update Recipients.
     */
    data: XOR<RecipientUpdateManyMutationInput, RecipientUncheckedUpdateManyInput>
    /**
     * Filter which Recipients to update
     */
    where?: RecipientWhereInput
    /**
     * Limit how many Recipients to update.
     */
    limit?: number
  }

  /**
   * Recipient upsert
   */
  export type RecipientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipient
     */
    select?: RecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recipient
     */
    omit?: RecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipientInclude<ExtArgs> | null
    /**
     * The filter to search for the Recipient to update in case it exists.
     */
    where: RecipientWhereUniqueInput
    /**
     * In case the Recipient found by the `where` argument doesn't exist, create a new Recipient with this data.
     */
    create: XOR<RecipientCreateInput, RecipientUncheckedCreateInput>
    /**
     * In case the Recipient was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RecipientUpdateInput, RecipientUncheckedUpdateInput>
  }

  /**
   * Recipient delete
   */
  export type RecipientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipient
     */
    select?: RecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recipient
     */
    omit?: RecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipientInclude<ExtArgs> | null
    /**
     * Filter which Recipient to delete.
     */
    where: RecipientWhereUniqueInput
  }

  /**
   * Recipient deleteMany
   */
  export type RecipientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Recipients to delete
     */
    where?: RecipientWhereInput
    /**
     * Limit how many Recipients to delete.
     */
    limit?: number
  }

  /**
   * Recipient.receivedTxs
   */
  export type Recipient$receivedTxsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Recipient without action
   */
  export type RecipientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipient
     */
    select?: RecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Recipient
     */
    omit?: RecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipientInclude<ExtArgs> | null
  }


  /**
   * Model VaultPosition
   */

  export type AggregateVaultPosition = {
    _count: VaultPositionCountAggregateOutputType | null
    _avg: VaultPositionAvgAggregateOutputType | null
    _sum: VaultPositionSumAggregateOutputType | null
    _min: VaultPositionMinAggregateOutputType | null
    _max: VaultPositionMaxAggregateOutputType | null
  }

  export type VaultPositionAvgAggregateOutputType = {
    collateralAmount: Decimal | null
    borrowedMUSD: Decimal | null
    collateralRatio: Decimal | null
    lastSyncedBlock: number | null
  }

  export type VaultPositionSumAggregateOutputType = {
    collateralAmount: Decimal | null
    borrowedMUSD: Decimal | null
    collateralRatio: Decimal | null
    lastSyncedBlock: number | null
  }

  export type VaultPositionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    collateralAmount: Decimal | null
    borrowedMUSD: Decimal | null
    collateralRatio: Decimal | null
    lastSyncedBlock: number | null
    updatedAt: Date | null
  }

  export type VaultPositionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    collateralAmount: Decimal | null
    borrowedMUSD: Decimal | null
    collateralRatio: Decimal | null
    lastSyncedBlock: number | null
    updatedAt: Date | null
  }

  export type VaultPositionCountAggregateOutputType = {
    id: number
    userId: number
    collateralAmount: number
    borrowedMUSD: number
    collateralRatio: number
    lastSyncedBlock: number
    updatedAt: number
    _all: number
  }


  export type VaultPositionAvgAggregateInputType = {
    collateralAmount?: true
    borrowedMUSD?: true
    collateralRatio?: true
    lastSyncedBlock?: true
  }

  export type VaultPositionSumAggregateInputType = {
    collateralAmount?: true
    borrowedMUSD?: true
    collateralRatio?: true
    lastSyncedBlock?: true
  }

  export type VaultPositionMinAggregateInputType = {
    id?: true
    userId?: true
    collateralAmount?: true
    borrowedMUSD?: true
    collateralRatio?: true
    lastSyncedBlock?: true
    updatedAt?: true
  }

  export type VaultPositionMaxAggregateInputType = {
    id?: true
    userId?: true
    collateralAmount?: true
    borrowedMUSD?: true
    collateralRatio?: true
    lastSyncedBlock?: true
    updatedAt?: true
  }

  export type VaultPositionCountAggregateInputType = {
    id?: true
    userId?: true
    collateralAmount?: true
    borrowedMUSD?: true
    collateralRatio?: true
    lastSyncedBlock?: true
    updatedAt?: true
    _all?: true
  }

  export type VaultPositionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VaultPosition to aggregate.
     */
    where?: VaultPositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VaultPositions to fetch.
     */
    orderBy?: VaultPositionOrderByWithRelationInput | VaultPositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VaultPositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VaultPositions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VaultPositions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VaultPositions
    **/
    _count?: true | VaultPositionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VaultPositionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VaultPositionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VaultPositionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VaultPositionMaxAggregateInputType
  }

  export type GetVaultPositionAggregateType<T extends VaultPositionAggregateArgs> = {
        [P in keyof T & keyof AggregateVaultPosition]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVaultPosition[P]>
      : GetScalarType<T[P], AggregateVaultPosition[P]>
  }




  export type VaultPositionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VaultPositionWhereInput
    orderBy?: VaultPositionOrderByWithAggregationInput | VaultPositionOrderByWithAggregationInput[]
    by: VaultPositionScalarFieldEnum[] | VaultPositionScalarFieldEnum
    having?: VaultPositionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VaultPositionCountAggregateInputType | true
    _avg?: VaultPositionAvgAggregateInputType
    _sum?: VaultPositionSumAggregateInputType
    _min?: VaultPositionMinAggregateInputType
    _max?: VaultPositionMaxAggregateInputType
  }

  export type VaultPositionGroupByOutputType = {
    id: string
    userId: string
    collateralAmount: Decimal
    borrowedMUSD: Decimal
    collateralRatio: Decimal
    lastSyncedBlock: number
    updatedAt: Date
    _count: VaultPositionCountAggregateOutputType | null
    _avg: VaultPositionAvgAggregateOutputType | null
    _sum: VaultPositionSumAggregateOutputType | null
    _min: VaultPositionMinAggregateOutputType | null
    _max: VaultPositionMaxAggregateOutputType | null
  }

  type GetVaultPositionGroupByPayload<T extends VaultPositionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VaultPositionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VaultPositionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VaultPositionGroupByOutputType[P]>
            : GetScalarType<T[P], VaultPositionGroupByOutputType[P]>
        }
      >
    >


  export type VaultPositionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    collateralAmount?: boolean
    borrowedMUSD?: boolean
    collateralRatio?: boolean
    lastSyncedBlock?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vaultPosition"]>

  export type VaultPositionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    collateralAmount?: boolean
    borrowedMUSD?: boolean
    collateralRatio?: boolean
    lastSyncedBlock?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vaultPosition"]>

  export type VaultPositionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    collateralAmount?: boolean
    borrowedMUSD?: boolean
    collateralRatio?: boolean
    lastSyncedBlock?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vaultPosition"]>

  export type VaultPositionSelectScalar = {
    id?: boolean
    userId?: boolean
    collateralAmount?: boolean
    borrowedMUSD?: boolean
    collateralRatio?: boolean
    lastSyncedBlock?: boolean
    updatedAt?: boolean
  }

  export type VaultPositionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "collateralAmount" | "borrowedMUSD" | "collateralRatio" | "lastSyncedBlock" | "updatedAt", ExtArgs["result"]["vaultPosition"]>
  export type VaultPositionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type VaultPositionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type VaultPositionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $VaultPositionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VaultPosition"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      collateralAmount: Prisma.Decimal
      borrowedMUSD: Prisma.Decimal
      collateralRatio: Prisma.Decimal
      lastSyncedBlock: number
      updatedAt: Date
    }, ExtArgs["result"]["vaultPosition"]>
    composites: {}
  }

  type VaultPositionGetPayload<S extends boolean | null | undefined | VaultPositionDefaultArgs> = $Result.GetResult<Prisma.$VaultPositionPayload, S>

  type VaultPositionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VaultPositionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VaultPositionCountAggregateInputType | true
    }

  export interface VaultPositionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VaultPosition'], meta: { name: 'VaultPosition' } }
    /**
     * Find zero or one VaultPosition that matches the filter.
     * @param {VaultPositionFindUniqueArgs} args - Arguments to find a VaultPosition
     * @example
     * // Get one VaultPosition
     * const vaultPosition = await prisma.vaultPosition.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VaultPositionFindUniqueArgs>(args: SelectSubset<T, VaultPositionFindUniqueArgs<ExtArgs>>): Prisma__VaultPositionClient<$Result.GetResult<Prisma.$VaultPositionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VaultPosition that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VaultPositionFindUniqueOrThrowArgs} args - Arguments to find a VaultPosition
     * @example
     * // Get one VaultPosition
     * const vaultPosition = await prisma.vaultPosition.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VaultPositionFindUniqueOrThrowArgs>(args: SelectSubset<T, VaultPositionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VaultPositionClient<$Result.GetResult<Prisma.$VaultPositionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VaultPosition that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultPositionFindFirstArgs} args - Arguments to find a VaultPosition
     * @example
     * // Get one VaultPosition
     * const vaultPosition = await prisma.vaultPosition.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VaultPositionFindFirstArgs>(args?: SelectSubset<T, VaultPositionFindFirstArgs<ExtArgs>>): Prisma__VaultPositionClient<$Result.GetResult<Prisma.$VaultPositionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VaultPosition that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultPositionFindFirstOrThrowArgs} args - Arguments to find a VaultPosition
     * @example
     * // Get one VaultPosition
     * const vaultPosition = await prisma.vaultPosition.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VaultPositionFindFirstOrThrowArgs>(args?: SelectSubset<T, VaultPositionFindFirstOrThrowArgs<ExtArgs>>): Prisma__VaultPositionClient<$Result.GetResult<Prisma.$VaultPositionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VaultPositions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultPositionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VaultPositions
     * const vaultPositions = await prisma.vaultPosition.findMany()
     * 
     * // Get first 10 VaultPositions
     * const vaultPositions = await prisma.vaultPosition.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vaultPositionWithIdOnly = await prisma.vaultPosition.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VaultPositionFindManyArgs>(args?: SelectSubset<T, VaultPositionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VaultPositionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VaultPosition.
     * @param {VaultPositionCreateArgs} args - Arguments to create a VaultPosition.
     * @example
     * // Create one VaultPosition
     * const VaultPosition = await prisma.vaultPosition.create({
     *   data: {
     *     // ... data to create a VaultPosition
     *   }
     * })
     * 
     */
    create<T extends VaultPositionCreateArgs>(args: SelectSubset<T, VaultPositionCreateArgs<ExtArgs>>): Prisma__VaultPositionClient<$Result.GetResult<Prisma.$VaultPositionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VaultPositions.
     * @param {VaultPositionCreateManyArgs} args - Arguments to create many VaultPositions.
     * @example
     * // Create many VaultPositions
     * const vaultPosition = await prisma.vaultPosition.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VaultPositionCreateManyArgs>(args?: SelectSubset<T, VaultPositionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VaultPositions and returns the data saved in the database.
     * @param {VaultPositionCreateManyAndReturnArgs} args - Arguments to create many VaultPositions.
     * @example
     * // Create many VaultPositions
     * const vaultPosition = await prisma.vaultPosition.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VaultPositions and only return the `id`
     * const vaultPositionWithIdOnly = await prisma.vaultPosition.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VaultPositionCreateManyAndReturnArgs>(args?: SelectSubset<T, VaultPositionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VaultPositionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VaultPosition.
     * @param {VaultPositionDeleteArgs} args - Arguments to delete one VaultPosition.
     * @example
     * // Delete one VaultPosition
     * const VaultPosition = await prisma.vaultPosition.delete({
     *   where: {
     *     // ... filter to delete one VaultPosition
     *   }
     * })
     * 
     */
    delete<T extends VaultPositionDeleteArgs>(args: SelectSubset<T, VaultPositionDeleteArgs<ExtArgs>>): Prisma__VaultPositionClient<$Result.GetResult<Prisma.$VaultPositionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VaultPosition.
     * @param {VaultPositionUpdateArgs} args - Arguments to update one VaultPosition.
     * @example
     * // Update one VaultPosition
     * const vaultPosition = await prisma.vaultPosition.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VaultPositionUpdateArgs>(args: SelectSubset<T, VaultPositionUpdateArgs<ExtArgs>>): Prisma__VaultPositionClient<$Result.GetResult<Prisma.$VaultPositionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VaultPositions.
     * @param {VaultPositionDeleteManyArgs} args - Arguments to filter VaultPositions to delete.
     * @example
     * // Delete a few VaultPositions
     * const { count } = await prisma.vaultPosition.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VaultPositionDeleteManyArgs>(args?: SelectSubset<T, VaultPositionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VaultPositions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultPositionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VaultPositions
     * const vaultPosition = await prisma.vaultPosition.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VaultPositionUpdateManyArgs>(args: SelectSubset<T, VaultPositionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VaultPositions and returns the data updated in the database.
     * @param {VaultPositionUpdateManyAndReturnArgs} args - Arguments to update many VaultPositions.
     * @example
     * // Update many VaultPositions
     * const vaultPosition = await prisma.vaultPosition.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VaultPositions and only return the `id`
     * const vaultPositionWithIdOnly = await prisma.vaultPosition.updateManyAndReturn({
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
    updateManyAndReturn<T extends VaultPositionUpdateManyAndReturnArgs>(args: SelectSubset<T, VaultPositionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VaultPositionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VaultPosition.
     * @param {VaultPositionUpsertArgs} args - Arguments to update or create a VaultPosition.
     * @example
     * // Update or create a VaultPosition
     * const vaultPosition = await prisma.vaultPosition.upsert({
     *   create: {
     *     // ... data to create a VaultPosition
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VaultPosition we want to update
     *   }
     * })
     */
    upsert<T extends VaultPositionUpsertArgs>(args: SelectSubset<T, VaultPositionUpsertArgs<ExtArgs>>): Prisma__VaultPositionClient<$Result.GetResult<Prisma.$VaultPositionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VaultPositions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultPositionCountArgs} args - Arguments to filter VaultPositions to count.
     * @example
     * // Count the number of VaultPositions
     * const count = await prisma.vaultPosition.count({
     *   where: {
     *     // ... the filter for the VaultPositions we want to count
     *   }
     * })
    **/
    count<T extends VaultPositionCountArgs>(
      args?: Subset<T, VaultPositionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VaultPositionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VaultPosition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultPositionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VaultPositionAggregateArgs>(args: Subset<T, VaultPositionAggregateArgs>): Prisma.PrismaPromise<GetVaultPositionAggregateType<T>>

    /**
     * Group by VaultPosition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultPositionGroupByArgs} args - Group by arguments.
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
      T extends VaultPositionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VaultPositionGroupByArgs['orderBy'] }
        : { orderBy?: VaultPositionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VaultPositionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVaultPositionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VaultPosition model
   */
  readonly fields: VaultPositionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VaultPosition.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VaultPositionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the VaultPosition model
   */
  interface VaultPositionFieldRefs {
    readonly id: FieldRef<"VaultPosition", 'String'>
    readonly userId: FieldRef<"VaultPosition", 'String'>
    readonly collateralAmount: FieldRef<"VaultPosition", 'Decimal'>
    readonly borrowedMUSD: FieldRef<"VaultPosition", 'Decimal'>
    readonly collateralRatio: FieldRef<"VaultPosition", 'Decimal'>
    readonly lastSyncedBlock: FieldRef<"VaultPosition", 'Int'>
    readonly updatedAt: FieldRef<"VaultPosition", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VaultPosition findUnique
   */
  export type VaultPositionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultPosition
     */
    select?: VaultPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaultPosition
     */
    omit?: VaultPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaultPositionInclude<ExtArgs> | null
    /**
     * Filter, which VaultPosition to fetch.
     */
    where: VaultPositionWhereUniqueInput
  }

  /**
   * VaultPosition findUniqueOrThrow
   */
  export type VaultPositionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultPosition
     */
    select?: VaultPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaultPosition
     */
    omit?: VaultPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaultPositionInclude<ExtArgs> | null
    /**
     * Filter, which VaultPosition to fetch.
     */
    where: VaultPositionWhereUniqueInput
  }

  /**
   * VaultPosition findFirst
   */
  export type VaultPositionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultPosition
     */
    select?: VaultPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaultPosition
     */
    omit?: VaultPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaultPositionInclude<ExtArgs> | null
    /**
     * Filter, which VaultPosition to fetch.
     */
    where?: VaultPositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VaultPositions to fetch.
     */
    orderBy?: VaultPositionOrderByWithRelationInput | VaultPositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VaultPositions.
     */
    cursor?: VaultPositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VaultPositions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VaultPositions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VaultPositions.
     */
    distinct?: VaultPositionScalarFieldEnum | VaultPositionScalarFieldEnum[]
  }

  /**
   * VaultPosition findFirstOrThrow
   */
  export type VaultPositionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultPosition
     */
    select?: VaultPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaultPosition
     */
    omit?: VaultPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaultPositionInclude<ExtArgs> | null
    /**
     * Filter, which VaultPosition to fetch.
     */
    where?: VaultPositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VaultPositions to fetch.
     */
    orderBy?: VaultPositionOrderByWithRelationInput | VaultPositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VaultPositions.
     */
    cursor?: VaultPositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VaultPositions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VaultPositions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VaultPositions.
     */
    distinct?: VaultPositionScalarFieldEnum | VaultPositionScalarFieldEnum[]
  }

  /**
   * VaultPosition findMany
   */
  export type VaultPositionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultPosition
     */
    select?: VaultPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaultPosition
     */
    omit?: VaultPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaultPositionInclude<ExtArgs> | null
    /**
     * Filter, which VaultPositions to fetch.
     */
    where?: VaultPositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VaultPositions to fetch.
     */
    orderBy?: VaultPositionOrderByWithRelationInput | VaultPositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VaultPositions.
     */
    cursor?: VaultPositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VaultPositions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VaultPositions.
     */
    skip?: number
    distinct?: VaultPositionScalarFieldEnum | VaultPositionScalarFieldEnum[]
  }

  /**
   * VaultPosition create
   */
  export type VaultPositionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultPosition
     */
    select?: VaultPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaultPosition
     */
    omit?: VaultPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaultPositionInclude<ExtArgs> | null
    /**
     * The data needed to create a VaultPosition.
     */
    data: XOR<VaultPositionCreateInput, VaultPositionUncheckedCreateInput>
  }

  /**
   * VaultPosition createMany
   */
  export type VaultPositionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VaultPositions.
     */
    data: VaultPositionCreateManyInput | VaultPositionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VaultPosition createManyAndReturn
   */
  export type VaultPositionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultPosition
     */
    select?: VaultPositionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VaultPosition
     */
    omit?: VaultPositionOmit<ExtArgs> | null
    /**
     * The data used to create many VaultPositions.
     */
    data: VaultPositionCreateManyInput | VaultPositionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaultPositionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VaultPosition update
   */
  export type VaultPositionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultPosition
     */
    select?: VaultPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaultPosition
     */
    omit?: VaultPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaultPositionInclude<ExtArgs> | null
    /**
     * The data needed to update a VaultPosition.
     */
    data: XOR<VaultPositionUpdateInput, VaultPositionUncheckedUpdateInput>
    /**
     * Choose, which VaultPosition to update.
     */
    where: VaultPositionWhereUniqueInput
  }

  /**
   * VaultPosition updateMany
   */
  export type VaultPositionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VaultPositions.
     */
    data: XOR<VaultPositionUpdateManyMutationInput, VaultPositionUncheckedUpdateManyInput>
    /**
     * Filter which VaultPositions to update
     */
    where?: VaultPositionWhereInput
    /**
     * Limit how many VaultPositions to update.
     */
    limit?: number
  }

  /**
   * VaultPosition updateManyAndReturn
   */
  export type VaultPositionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultPosition
     */
    select?: VaultPositionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VaultPosition
     */
    omit?: VaultPositionOmit<ExtArgs> | null
    /**
     * The data used to update VaultPositions.
     */
    data: XOR<VaultPositionUpdateManyMutationInput, VaultPositionUncheckedUpdateManyInput>
    /**
     * Filter which VaultPositions to update
     */
    where?: VaultPositionWhereInput
    /**
     * Limit how many VaultPositions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaultPositionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VaultPosition upsert
   */
  export type VaultPositionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultPosition
     */
    select?: VaultPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaultPosition
     */
    omit?: VaultPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaultPositionInclude<ExtArgs> | null
    /**
     * The filter to search for the VaultPosition to update in case it exists.
     */
    where: VaultPositionWhereUniqueInput
    /**
     * In case the VaultPosition found by the `where` argument doesn't exist, create a new VaultPosition with this data.
     */
    create: XOR<VaultPositionCreateInput, VaultPositionUncheckedCreateInput>
    /**
     * In case the VaultPosition was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VaultPositionUpdateInput, VaultPositionUncheckedUpdateInput>
  }

  /**
   * VaultPosition delete
   */
  export type VaultPositionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultPosition
     */
    select?: VaultPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaultPosition
     */
    omit?: VaultPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaultPositionInclude<ExtArgs> | null
    /**
     * Filter which VaultPosition to delete.
     */
    where: VaultPositionWhereUniqueInput
  }

  /**
   * VaultPosition deleteMany
   */
  export type VaultPositionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VaultPositions to delete
     */
    where?: VaultPositionWhereInput
    /**
     * Limit how many VaultPositions to delete.
     */
    limit?: number
  }

  /**
   * VaultPosition without action
   */
  export type VaultPositionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultPosition
     */
    select?: VaultPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaultPosition
     */
    omit?: VaultPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaultPositionInclude<ExtArgs> | null
  }


  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  export type TransactionAvgAggregateOutputType = {
    musdAmount: Decimal | null
    feeAmount: Decimal | null
    fiatAmount: Decimal | null
    blockNumber: number | null
  }

  export type TransactionSumAggregateOutputType = {
    musdAmount: Decimal | null
    feeAmount: Decimal | null
    fiatAmount: Decimal | null
    blockNumber: number | null
  }

  export type TransactionMinAggregateOutputType = {
    id: string | null
    txHash: string | null
    senderId: string | null
    recipientId: string | null
    musdAmount: Decimal | null
    feeAmount: Decimal | null
    railType: $Enums.PaymentRail | null
    railReference: string | null
    fiatAmount: Decimal | null
    fiatCurrency: string | null
    status: $Enums.TxStatus | null
    blockNumber: number | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type TransactionMaxAggregateOutputType = {
    id: string | null
    txHash: string | null
    senderId: string | null
    recipientId: string | null
    musdAmount: Decimal | null
    feeAmount: Decimal | null
    railType: $Enums.PaymentRail | null
    railReference: string | null
    fiatAmount: Decimal | null
    fiatCurrency: string | null
    status: $Enums.TxStatus | null
    blockNumber: number | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type TransactionCountAggregateOutputType = {
    id: number
    txHash: number
    senderId: number
    recipientId: number
    musdAmount: number
    feeAmount: number
    railType: number
    railReference: number
    fiatAmount: number
    fiatCurrency: number
    status: number
    blockNumber: number
    createdAt: number
    completedAt: number
    _all: number
  }


  export type TransactionAvgAggregateInputType = {
    musdAmount?: true
    feeAmount?: true
    fiatAmount?: true
    blockNumber?: true
  }

  export type TransactionSumAggregateInputType = {
    musdAmount?: true
    feeAmount?: true
    fiatAmount?: true
    blockNumber?: true
  }

  export type TransactionMinAggregateInputType = {
    id?: true
    txHash?: true
    senderId?: true
    recipientId?: true
    musdAmount?: true
    feeAmount?: true
    railType?: true
    railReference?: true
    fiatAmount?: true
    fiatCurrency?: true
    status?: true
    blockNumber?: true
    createdAt?: true
    completedAt?: true
  }

  export type TransactionMaxAggregateInputType = {
    id?: true
    txHash?: true
    senderId?: true
    recipientId?: true
    musdAmount?: true
    feeAmount?: true
    railType?: true
    railReference?: true
    fiatAmount?: true
    fiatCurrency?: true
    status?: true
    blockNumber?: true
    createdAt?: true
    completedAt?: true
  }

  export type TransactionCountAggregateInputType = {
    id?: true
    txHash?: true
    senderId?: true
    recipientId?: true
    musdAmount?: true
    feeAmount?: true
    railType?: true
    railReference?: true
    fiatAmount?: true
    fiatCurrency?: true
    status?: true
    blockNumber?: true
    createdAt?: true
    completedAt?: true
    _all?: true
  }

  export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionMaxAggregateInputType
  }

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>
  }




  export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[]
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum
    having?: TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionCountAggregateInputType | true
    _avg?: TransactionAvgAggregateInputType
    _sum?: TransactionSumAggregateInputType
    _min?: TransactionMinAggregateInputType
    _max?: TransactionMaxAggregateInputType
  }

  export type TransactionGroupByOutputType = {
    id: string
    txHash: string | null
    senderId: string
    recipientId: string
    musdAmount: Decimal
    feeAmount: Decimal
    railType: $Enums.PaymentRail
    railReference: string | null
    fiatAmount: Decimal
    fiatCurrency: string
    status: $Enums.TxStatus
    blockNumber: number | null
    createdAt: Date
    completedAt: Date | null
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
        }
      >
    >


  export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    txHash?: boolean
    senderId?: boolean
    recipientId?: boolean
    musdAmount?: boolean
    feeAmount?: boolean
    railType?: boolean
    railReference?: boolean
    fiatAmount?: boolean
    fiatCurrency?: boolean
    status?: boolean
    blockNumber?: boolean
    createdAt?: boolean
    completedAt?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    recipient?: boolean | RecipientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    txHash?: boolean
    senderId?: boolean
    recipientId?: boolean
    musdAmount?: boolean
    feeAmount?: boolean
    railType?: boolean
    railReference?: boolean
    fiatAmount?: boolean
    fiatCurrency?: boolean
    status?: boolean
    blockNumber?: boolean
    createdAt?: boolean
    completedAt?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    recipient?: boolean | RecipientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    txHash?: boolean
    senderId?: boolean
    recipientId?: boolean
    musdAmount?: boolean
    feeAmount?: boolean
    railType?: boolean
    railReference?: boolean
    fiatAmount?: boolean
    fiatCurrency?: boolean
    status?: boolean
    blockNumber?: boolean
    createdAt?: boolean
    completedAt?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    recipient?: boolean | RecipientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectScalar = {
    id?: boolean
    txHash?: boolean
    senderId?: boolean
    recipientId?: boolean
    musdAmount?: boolean
    feeAmount?: boolean
    railType?: boolean
    railReference?: boolean
    fiatAmount?: boolean
    fiatCurrency?: boolean
    status?: boolean
    blockNumber?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }

  export type TransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "txHash" | "senderId" | "recipientId" | "musdAmount" | "feeAmount" | "railType" | "railReference" | "fiatAmount" | "fiatCurrency" | "status" | "blockNumber" | "createdAt" | "completedAt", ExtArgs["result"]["transaction"]>
  export type TransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    recipient?: boolean | RecipientDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    recipient?: boolean | RecipientDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    recipient?: boolean | RecipientDefaultArgs<ExtArgs>
  }

  export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaction"
    objects: {
      sender: Prisma.$UserPayload<ExtArgs>
      recipient: Prisma.$RecipientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      txHash: string | null
      senderId: string
      recipientId: string
      musdAmount: Prisma.Decimal
      feeAmount: Prisma.Decimal
      railType: $Enums.PaymentRail
      railReference: string | null
      fiatAmount: Prisma.Decimal
      fiatCurrency: string
      status: $Enums.TxStatus
      blockNumber: number | null
      createdAt: Date
      completedAt: Date | null
    }, ExtArgs["result"]["transaction"]>
    composites: {}
  }

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionCountAggregateInputType | true
    }

  export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaction'], meta: { name: 'Transaction' } }
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionFindManyArgs>(args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     * 
     */
    create<T extends TransactionCreateArgs>(args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transactions and returns the data saved in the database.
     * @param {TransactionCreateManyAndReturnArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     * 
     */
    delete<T extends TransactionDeleteArgs>(args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionUpdateArgs>(args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions and returns the data updated in the database.
     * @param {TransactionUpdateManyAndReturnArgs} args - Arguments to update many Transactions.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.updateManyAndReturn({
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
    updateManyAndReturn<T extends TransactionUpdateManyAndReturnArgs>(args: SelectSubset<T, TransactionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
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
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaction model
   */
  readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sender<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    recipient<T extends RecipientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RecipientDefaultArgs<ExtArgs>>): Prisma__RecipientClient<$Result.GetResult<Prisma.$RecipientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Transaction model
   */
  interface TransactionFieldRefs {
    readonly id: FieldRef<"Transaction", 'String'>
    readonly txHash: FieldRef<"Transaction", 'String'>
    readonly senderId: FieldRef<"Transaction", 'String'>
    readonly recipientId: FieldRef<"Transaction", 'String'>
    readonly musdAmount: FieldRef<"Transaction", 'Decimal'>
    readonly feeAmount: FieldRef<"Transaction", 'Decimal'>
    readonly railType: FieldRef<"Transaction", 'PaymentRail'>
    readonly railReference: FieldRef<"Transaction", 'String'>
    readonly fiatAmount: FieldRef<"Transaction", 'Decimal'>
    readonly fiatCurrency: FieldRef<"Transaction", 'String'>
    readonly status: FieldRef<"Transaction", 'TxStatus'>
    readonly blockNumber: FieldRef<"Transaction", 'Int'>
    readonly createdAt: FieldRef<"Transaction", 'DateTime'>
    readonly completedAt: FieldRef<"Transaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
  }

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaction createManyAndReturn
   */
  export type TransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
  }

  /**
   * Transaction updateManyAndReturn
   */
  export type TransactionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
  }

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to delete.
     */
    limit?: number
  }

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
  }


  /**
   * Model IndexerState
   */

  export type AggregateIndexerState = {
    _count: IndexerStateCountAggregateOutputType | null
    _avg: IndexerStateAvgAggregateOutputType | null
    _sum: IndexerStateSumAggregateOutputType | null
    _min: IndexerStateMinAggregateOutputType | null
    _max: IndexerStateMaxAggregateOutputType | null
  }

  export type IndexerStateAvgAggregateOutputType = {
    lastBlock: number | null
  }

  export type IndexerStateSumAggregateOutputType = {
    lastBlock: number | null
  }

  export type IndexerStateMinAggregateOutputType = {
    id: string | null
    lastBlock: number | null
    updatedAt: Date | null
  }

  export type IndexerStateMaxAggregateOutputType = {
    id: string | null
    lastBlock: number | null
    updatedAt: Date | null
  }

  export type IndexerStateCountAggregateOutputType = {
    id: number
    lastBlock: number
    updatedAt: number
    _all: number
  }


  export type IndexerStateAvgAggregateInputType = {
    lastBlock?: true
  }

  export type IndexerStateSumAggregateInputType = {
    lastBlock?: true
  }

  export type IndexerStateMinAggregateInputType = {
    id?: true
    lastBlock?: true
    updatedAt?: true
  }

  export type IndexerStateMaxAggregateInputType = {
    id?: true
    lastBlock?: true
    updatedAt?: true
  }

  export type IndexerStateCountAggregateInputType = {
    id?: true
    lastBlock?: true
    updatedAt?: true
    _all?: true
  }

  export type IndexerStateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IndexerState to aggregate.
     */
    where?: IndexerStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IndexerStates to fetch.
     */
    orderBy?: IndexerStateOrderByWithRelationInput | IndexerStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IndexerStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IndexerStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IndexerStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IndexerStates
    **/
    _count?: true | IndexerStateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IndexerStateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IndexerStateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IndexerStateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IndexerStateMaxAggregateInputType
  }

  export type GetIndexerStateAggregateType<T extends IndexerStateAggregateArgs> = {
        [P in keyof T & keyof AggregateIndexerState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIndexerState[P]>
      : GetScalarType<T[P], AggregateIndexerState[P]>
  }




  export type IndexerStateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IndexerStateWhereInput
    orderBy?: IndexerStateOrderByWithAggregationInput | IndexerStateOrderByWithAggregationInput[]
    by: IndexerStateScalarFieldEnum[] | IndexerStateScalarFieldEnum
    having?: IndexerStateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IndexerStateCountAggregateInputType | true
    _avg?: IndexerStateAvgAggregateInputType
    _sum?: IndexerStateSumAggregateInputType
    _min?: IndexerStateMinAggregateInputType
    _max?: IndexerStateMaxAggregateInputType
  }

  export type IndexerStateGroupByOutputType = {
    id: string
    lastBlock: number
    updatedAt: Date
    _count: IndexerStateCountAggregateOutputType | null
    _avg: IndexerStateAvgAggregateOutputType | null
    _sum: IndexerStateSumAggregateOutputType | null
    _min: IndexerStateMinAggregateOutputType | null
    _max: IndexerStateMaxAggregateOutputType | null
  }

  type GetIndexerStateGroupByPayload<T extends IndexerStateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IndexerStateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IndexerStateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IndexerStateGroupByOutputType[P]>
            : GetScalarType<T[P], IndexerStateGroupByOutputType[P]>
        }
      >
    >


  export type IndexerStateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lastBlock?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["indexerState"]>

  export type IndexerStateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lastBlock?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["indexerState"]>

  export type IndexerStateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lastBlock?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["indexerState"]>

  export type IndexerStateSelectScalar = {
    id?: boolean
    lastBlock?: boolean
    updatedAt?: boolean
  }

  export type IndexerStateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "lastBlock" | "updatedAt", ExtArgs["result"]["indexerState"]>

  export type $IndexerStatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IndexerState"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      lastBlock: number
      updatedAt: Date
    }, ExtArgs["result"]["indexerState"]>
    composites: {}
  }

  type IndexerStateGetPayload<S extends boolean | null | undefined | IndexerStateDefaultArgs> = $Result.GetResult<Prisma.$IndexerStatePayload, S>

  type IndexerStateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IndexerStateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IndexerStateCountAggregateInputType | true
    }

  export interface IndexerStateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IndexerState'], meta: { name: 'IndexerState' } }
    /**
     * Find zero or one IndexerState that matches the filter.
     * @param {IndexerStateFindUniqueArgs} args - Arguments to find a IndexerState
     * @example
     * // Get one IndexerState
     * const indexerState = await prisma.indexerState.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IndexerStateFindUniqueArgs>(args: SelectSubset<T, IndexerStateFindUniqueArgs<ExtArgs>>): Prisma__IndexerStateClient<$Result.GetResult<Prisma.$IndexerStatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one IndexerState that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IndexerStateFindUniqueOrThrowArgs} args - Arguments to find a IndexerState
     * @example
     * // Get one IndexerState
     * const indexerState = await prisma.indexerState.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IndexerStateFindUniqueOrThrowArgs>(args: SelectSubset<T, IndexerStateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IndexerStateClient<$Result.GetResult<Prisma.$IndexerStatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IndexerState that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexerStateFindFirstArgs} args - Arguments to find a IndexerState
     * @example
     * // Get one IndexerState
     * const indexerState = await prisma.indexerState.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IndexerStateFindFirstArgs>(args?: SelectSubset<T, IndexerStateFindFirstArgs<ExtArgs>>): Prisma__IndexerStateClient<$Result.GetResult<Prisma.$IndexerStatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IndexerState that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexerStateFindFirstOrThrowArgs} args - Arguments to find a IndexerState
     * @example
     * // Get one IndexerState
     * const indexerState = await prisma.indexerState.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IndexerStateFindFirstOrThrowArgs>(args?: SelectSubset<T, IndexerStateFindFirstOrThrowArgs<ExtArgs>>): Prisma__IndexerStateClient<$Result.GetResult<Prisma.$IndexerStatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more IndexerStates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexerStateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IndexerStates
     * const indexerStates = await prisma.indexerState.findMany()
     * 
     * // Get first 10 IndexerStates
     * const indexerStates = await prisma.indexerState.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const indexerStateWithIdOnly = await prisma.indexerState.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IndexerStateFindManyArgs>(args?: SelectSubset<T, IndexerStateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IndexerStatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a IndexerState.
     * @param {IndexerStateCreateArgs} args - Arguments to create a IndexerState.
     * @example
     * // Create one IndexerState
     * const IndexerState = await prisma.indexerState.create({
     *   data: {
     *     // ... data to create a IndexerState
     *   }
     * })
     * 
     */
    create<T extends IndexerStateCreateArgs>(args: SelectSubset<T, IndexerStateCreateArgs<ExtArgs>>): Prisma__IndexerStateClient<$Result.GetResult<Prisma.$IndexerStatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many IndexerStates.
     * @param {IndexerStateCreateManyArgs} args - Arguments to create many IndexerStates.
     * @example
     * // Create many IndexerStates
     * const indexerState = await prisma.indexerState.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IndexerStateCreateManyArgs>(args?: SelectSubset<T, IndexerStateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IndexerStates and returns the data saved in the database.
     * @param {IndexerStateCreateManyAndReturnArgs} args - Arguments to create many IndexerStates.
     * @example
     * // Create many IndexerStates
     * const indexerState = await prisma.indexerState.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many IndexerStates and only return the `id`
     * const indexerStateWithIdOnly = await prisma.indexerState.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IndexerStateCreateManyAndReturnArgs>(args?: SelectSubset<T, IndexerStateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IndexerStatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a IndexerState.
     * @param {IndexerStateDeleteArgs} args - Arguments to delete one IndexerState.
     * @example
     * // Delete one IndexerState
     * const IndexerState = await prisma.indexerState.delete({
     *   where: {
     *     // ... filter to delete one IndexerState
     *   }
     * })
     * 
     */
    delete<T extends IndexerStateDeleteArgs>(args: SelectSubset<T, IndexerStateDeleteArgs<ExtArgs>>): Prisma__IndexerStateClient<$Result.GetResult<Prisma.$IndexerStatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one IndexerState.
     * @param {IndexerStateUpdateArgs} args - Arguments to update one IndexerState.
     * @example
     * // Update one IndexerState
     * const indexerState = await prisma.indexerState.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IndexerStateUpdateArgs>(args: SelectSubset<T, IndexerStateUpdateArgs<ExtArgs>>): Prisma__IndexerStateClient<$Result.GetResult<Prisma.$IndexerStatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more IndexerStates.
     * @param {IndexerStateDeleteManyArgs} args - Arguments to filter IndexerStates to delete.
     * @example
     * // Delete a few IndexerStates
     * const { count } = await prisma.indexerState.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IndexerStateDeleteManyArgs>(args?: SelectSubset<T, IndexerStateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IndexerStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexerStateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IndexerStates
     * const indexerState = await prisma.indexerState.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IndexerStateUpdateManyArgs>(args: SelectSubset<T, IndexerStateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IndexerStates and returns the data updated in the database.
     * @param {IndexerStateUpdateManyAndReturnArgs} args - Arguments to update many IndexerStates.
     * @example
     * // Update many IndexerStates
     * const indexerState = await prisma.indexerState.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more IndexerStates and only return the `id`
     * const indexerStateWithIdOnly = await prisma.indexerState.updateManyAndReturn({
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
    updateManyAndReturn<T extends IndexerStateUpdateManyAndReturnArgs>(args: SelectSubset<T, IndexerStateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IndexerStatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one IndexerState.
     * @param {IndexerStateUpsertArgs} args - Arguments to update or create a IndexerState.
     * @example
     * // Update or create a IndexerState
     * const indexerState = await prisma.indexerState.upsert({
     *   create: {
     *     // ... data to create a IndexerState
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IndexerState we want to update
     *   }
     * })
     */
    upsert<T extends IndexerStateUpsertArgs>(args: SelectSubset<T, IndexerStateUpsertArgs<ExtArgs>>): Prisma__IndexerStateClient<$Result.GetResult<Prisma.$IndexerStatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of IndexerStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexerStateCountArgs} args - Arguments to filter IndexerStates to count.
     * @example
     * // Count the number of IndexerStates
     * const count = await prisma.indexerState.count({
     *   where: {
     *     // ... the filter for the IndexerStates we want to count
     *   }
     * })
    **/
    count<T extends IndexerStateCountArgs>(
      args?: Subset<T, IndexerStateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IndexerStateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IndexerState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexerStateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends IndexerStateAggregateArgs>(args: Subset<T, IndexerStateAggregateArgs>): Prisma.PrismaPromise<GetIndexerStateAggregateType<T>>

    /**
     * Group by IndexerState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexerStateGroupByArgs} args - Group by arguments.
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
      T extends IndexerStateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IndexerStateGroupByArgs['orderBy'] }
        : { orderBy?: IndexerStateGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, IndexerStateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIndexerStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IndexerState model
   */
  readonly fields: IndexerStateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IndexerState.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IndexerStateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the IndexerState model
   */
  interface IndexerStateFieldRefs {
    readonly id: FieldRef<"IndexerState", 'String'>
    readonly lastBlock: FieldRef<"IndexerState", 'Int'>
    readonly updatedAt: FieldRef<"IndexerState", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * IndexerState findUnique
   */
  export type IndexerStateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerState
     */
    select?: IndexerStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerState
     */
    omit?: IndexerStateOmit<ExtArgs> | null
    /**
     * Filter, which IndexerState to fetch.
     */
    where: IndexerStateWhereUniqueInput
  }

  /**
   * IndexerState findUniqueOrThrow
   */
  export type IndexerStateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerState
     */
    select?: IndexerStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerState
     */
    omit?: IndexerStateOmit<ExtArgs> | null
    /**
     * Filter, which IndexerState to fetch.
     */
    where: IndexerStateWhereUniqueInput
  }

  /**
   * IndexerState findFirst
   */
  export type IndexerStateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerState
     */
    select?: IndexerStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerState
     */
    omit?: IndexerStateOmit<ExtArgs> | null
    /**
     * Filter, which IndexerState to fetch.
     */
    where?: IndexerStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IndexerStates to fetch.
     */
    orderBy?: IndexerStateOrderByWithRelationInput | IndexerStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IndexerStates.
     */
    cursor?: IndexerStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IndexerStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IndexerStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IndexerStates.
     */
    distinct?: IndexerStateScalarFieldEnum | IndexerStateScalarFieldEnum[]
  }

  /**
   * IndexerState findFirstOrThrow
   */
  export type IndexerStateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerState
     */
    select?: IndexerStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerState
     */
    omit?: IndexerStateOmit<ExtArgs> | null
    /**
     * Filter, which IndexerState to fetch.
     */
    where?: IndexerStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IndexerStates to fetch.
     */
    orderBy?: IndexerStateOrderByWithRelationInput | IndexerStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IndexerStates.
     */
    cursor?: IndexerStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IndexerStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IndexerStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IndexerStates.
     */
    distinct?: IndexerStateScalarFieldEnum | IndexerStateScalarFieldEnum[]
  }

  /**
   * IndexerState findMany
   */
  export type IndexerStateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerState
     */
    select?: IndexerStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerState
     */
    omit?: IndexerStateOmit<ExtArgs> | null
    /**
     * Filter, which IndexerStates to fetch.
     */
    where?: IndexerStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IndexerStates to fetch.
     */
    orderBy?: IndexerStateOrderByWithRelationInput | IndexerStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IndexerStates.
     */
    cursor?: IndexerStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IndexerStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IndexerStates.
     */
    skip?: number
    distinct?: IndexerStateScalarFieldEnum | IndexerStateScalarFieldEnum[]
  }

  /**
   * IndexerState create
   */
  export type IndexerStateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerState
     */
    select?: IndexerStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerState
     */
    omit?: IndexerStateOmit<ExtArgs> | null
    /**
     * The data needed to create a IndexerState.
     */
    data: XOR<IndexerStateCreateInput, IndexerStateUncheckedCreateInput>
  }

  /**
   * IndexerState createMany
   */
  export type IndexerStateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IndexerStates.
     */
    data: IndexerStateCreateManyInput | IndexerStateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IndexerState createManyAndReturn
   */
  export type IndexerStateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerState
     */
    select?: IndexerStateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerState
     */
    omit?: IndexerStateOmit<ExtArgs> | null
    /**
     * The data used to create many IndexerStates.
     */
    data: IndexerStateCreateManyInput | IndexerStateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IndexerState update
   */
  export type IndexerStateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerState
     */
    select?: IndexerStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerState
     */
    omit?: IndexerStateOmit<ExtArgs> | null
    /**
     * The data needed to update a IndexerState.
     */
    data: XOR<IndexerStateUpdateInput, IndexerStateUncheckedUpdateInput>
    /**
     * Choose, which IndexerState to update.
     */
    where: IndexerStateWhereUniqueInput
  }

  /**
   * IndexerState updateMany
   */
  export type IndexerStateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IndexerStates.
     */
    data: XOR<IndexerStateUpdateManyMutationInput, IndexerStateUncheckedUpdateManyInput>
    /**
     * Filter which IndexerStates to update
     */
    where?: IndexerStateWhereInput
    /**
     * Limit how many IndexerStates to update.
     */
    limit?: number
  }

  /**
   * IndexerState updateManyAndReturn
   */
  export type IndexerStateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerState
     */
    select?: IndexerStateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerState
     */
    omit?: IndexerStateOmit<ExtArgs> | null
    /**
     * The data used to update IndexerStates.
     */
    data: XOR<IndexerStateUpdateManyMutationInput, IndexerStateUncheckedUpdateManyInput>
    /**
     * Filter which IndexerStates to update
     */
    where?: IndexerStateWhereInput
    /**
     * Limit how many IndexerStates to update.
     */
    limit?: number
  }

  /**
   * IndexerState upsert
   */
  export type IndexerStateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerState
     */
    select?: IndexerStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerState
     */
    omit?: IndexerStateOmit<ExtArgs> | null
    /**
     * The filter to search for the IndexerState to update in case it exists.
     */
    where: IndexerStateWhereUniqueInput
    /**
     * In case the IndexerState found by the `where` argument doesn't exist, create a new IndexerState with this data.
     */
    create: XOR<IndexerStateCreateInput, IndexerStateUncheckedCreateInput>
    /**
     * In case the IndexerState was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IndexerStateUpdateInput, IndexerStateUncheckedUpdateInput>
  }

  /**
   * IndexerState delete
   */
  export type IndexerStateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerState
     */
    select?: IndexerStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerState
     */
    omit?: IndexerStateOmit<ExtArgs> | null
    /**
     * Filter which IndexerState to delete.
     */
    where: IndexerStateWhereUniqueInput
  }

  /**
   * IndexerState deleteMany
   */
  export type IndexerStateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IndexerStates to delete
     */
    where?: IndexerStateWhereInput
    /**
     * Limit how many IndexerStates to delete.
     */
    limit?: number
  }

  /**
   * IndexerState without action
   */
  export type IndexerStateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerState
     */
    select?: IndexerStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerState
     */
    omit?: IndexerStateOmit<ExtArgs> | null
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


  export const UserScalarFieldEnum: {
    id: 'id',
    address: 'address',
    phoneNumber: 'phoneNumber',
    siweSession: 'siweSession',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const RecipientScalarFieldEnum: {
    id: 'id',
    name: 'name',
    phoneNumber: 'phoneNumber',
    phoneHash: 'phoneHash',
    custodialAddress: 'custodialAddress',
    paymentRail: 'paymentRail',
    isUpgraded: 'isUpgraded',
    createdAt: 'createdAt'
  };

  export type RecipientScalarFieldEnum = (typeof RecipientScalarFieldEnum)[keyof typeof RecipientScalarFieldEnum]


  export const VaultPositionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    collateralAmount: 'collateralAmount',
    borrowedMUSD: 'borrowedMUSD',
    collateralRatio: 'collateralRatio',
    lastSyncedBlock: 'lastSyncedBlock',
    updatedAt: 'updatedAt'
  };

  export type VaultPositionScalarFieldEnum = (typeof VaultPositionScalarFieldEnum)[keyof typeof VaultPositionScalarFieldEnum]


  export const TransactionScalarFieldEnum: {
    id: 'id',
    txHash: 'txHash',
    senderId: 'senderId',
    recipientId: 'recipientId',
    musdAmount: 'musdAmount',
    feeAmount: 'feeAmount',
    railType: 'railType',
    railReference: 'railReference',
    fiatAmount: 'fiatAmount',
    fiatCurrency: 'fiatCurrency',
    status: 'status',
    blockNumber: 'blockNumber',
    createdAt: 'createdAt',
    completedAt: 'completedAt'
  };

  export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum]


  export const IndexerStateScalarFieldEnum: {
    id: 'id',
    lastBlock: 'lastBlock',
    updatedAt: 'updatedAt'
  };

  export type IndexerStateScalarFieldEnum = (typeof IndexerStateScalarFieldEnum)[keyof typeof IndexerStateScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


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
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'PaymentRail'
   */
  export type EnumPaymentRailFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentRail'>
    


  /**
   * Reference to a field of type 'PaymentRail[]'
   */
  export type ListEnumPaymentRailFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentRail[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'TxStatus'
   */
  export type EnumTxStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TxStatus'>
    


  /**
   * Reference to a field of type 'TxStatus[]'
   */
  export type ListEnumTxStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TxStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    address?: StringFilter<"User"> | string
    phoneNumber?: StringNullableFilter<"User"> | string | null
    siweSession?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    vaultPosition?: XOR<VaultPositionNullableScalarRelationFilter, VaultPositionWhereInput> | null
    sentTxs?: TransactionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    address?: SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    siweSession?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    vaultPosition?: VaultPositionOrderByWithRelationInput
    sentTxs?: TransactionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    address?: string
    phoneNumber?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    siweSession?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    vaultPosition?: XOR<VaultPositionNullableScalarRelationFilter, VaultPositionWhereInput> | null
    sentTxs?: TransactionListRelationFilter
  }, "id" | "address" | "phoneNumber">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    address?: SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    siweSession?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    address?: StringWithAggregatesFilter<"User"> | string
    phoneNumber?: StringNullableWithAggregatesFilter<"User"> | string | null
    siweSession?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type RecipientWhereInput = {
    AND?: RecipientWhereInput | RecipientWhereInput[]
    OR?: RecipientWhereInput[]
    NOT?: RecipientWhereInput | RecipientWhereInput[]
    id?: StringFilter<"Recipient"> | string
    name?: StringFilter<"Recipient"> | string
    phoneNumber?: StringFilter<"Recipient"> | string
    phoneHash?: StringFilter<"Recipient"> | string
    custodialAddress?: StringFilter<"Recipient"> | string
    paymentRail?: EnumPaymentRailFilter<"Recipient"> | $Enums.PaymentRail
    isUpgraded?: BoolFilter<"Recipient"> | boolean
    createdAt?: DateTimeFilter<"Recipient"> | Date | string
    receivedTxs?: TransactionListRelationFilter
  }

  export type RecipientOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    phoneNumber?: SortOrder
    phoneHash?: SortOrder
    custodialAddress?: SortOrder
    paymentRail?: SortOrder
    isUpgraded?: SortOrder
    createdAt?: SortOrder
    receivedTxs?: TransactionOrderByRelationAggregateInput
  }

  export type RecipientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    phoneNumber?: string
    phoneHash?: string
    custodialAddress?: string
    AND?: RecipientWhereInput | RecipientWhereInput[]
    OR?: RecipientWhereInput[]
    NOT?: RecipientWhereInput | RecipientWhereInput[]
    name?: StringFilter<"Recipient"> | string
    paymentRail?: EnumPaymentRailFilter<"Recipient"> | $Enums.PaymentRail
    isUpgraded?: BoolFilter<"Recipient"> | boolean
    createdAt?: DateTimeFilter<"Recipient"> | Date | string
    receivedTxs?: TransactionListRelationFilter
  }, "id" | "phoneNumber" | "phoneHash" | "custodialAddress">

  export type RecipientOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    phoneNumber?: SortOrder
    phoneHash?: SortOrder
    custodialAddress?: SortOrder
    paymentRail?: SortOrder
    isUpgraded?: SortOrder
    createdAt?: SortOrder
    _count?: RecipientCountOrderByAggregateInput
    _max?: RecipientMaxOrderByAggregateInput
    _min?: RecipientMinOrderByAggregateInput
  }

  export type RecipientScalarWhereWithAggregatesInput = {
    AND?: RecipientScalarWhereWithAggregatesInput | RecipientScalarWhereWithAggregatesInput[]
    OR?: RecipientScalarWhereWithAggregatesInput[]
    NOT?: RecipientScalarWhereWithAggregatesInput | RecipientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Recipient"> | string
    name?: StringWithAggregatesFilter<"Recipient"> | string
    phoneNumber?: StringWithAggregatesFilter<"Recipient"> | string
    phoneHash?: StringWithAggregatesFilter<"Recipient"> | string
    custodialAddress?: StringWithAggregatesFilter<"Recipient"> | string
    paymentRail?: EnumPaymentRailWithAggregatesFilter<"Recipient"> | $Enums.PaymentRail
    isUpgraded?: BoolWithAggregatesFilter<"Recipient"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Recipient"> | Date | string
  }

  export type VaultPositionWhereInput = {
    AND?: VaultPositionWhereInput | VaultPositionWhereInput[]
    OR?: VaultPositionWhereInput[]
    NOT?: VaultPositionWhereInput | VaultPositionWhereInput[]
    id?: StringFilter<"VaultPosition"> | string
    userId?: StringFilter<"VaultPosition"> | string
    collateralAmount?: DecimalFilter<"VaultPosition"> | Decimal | DecimalJsLike | number | string
    borrowedMUSD?: DecimalFilter<"VaultPosition"> | Decimal | DecimalJsLike | number | string
    collateralRatio?: DecimalFilter<"VaultPosition"> | Decimal | DecimalJsLike | number | string
    lastSyncedBlock?: IntFilter<"VaultPosition"> | number
    updatedAt?: DateTimeFilter<"VaultPosition"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type VaultPositionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    collateralAmount?: SortOrder
    borrowedMUSD?: SortOrder
    collateralRatio?: SortOrder
    lastSyncedBlock?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type VaultPositionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: VaultPositionWhereInput | VaultPositionWhereInput[]
    OR?: VaultPositionWhereInput[]
    NOT?: VaultPositionWhereInput | VaultPositionWhereInput[]
    collateralAmount?: DecimalFilter<"VaultPosition"> | Decimal | DecimalJsLike | number | string
    borrowedMUSD?: DecimalFilter<"VaultPosition"> | Decimal | DecimalJsLike | number | string
    collateralRatio?: DecimalFilter<"VaultPosition"> | Decimal | DecimalJsLike | number | string
    lastSyncedBlock?: IntFilter<"VaultPosition"> | number
    updatedAt?: DateTimeFilter<"VaultPosition"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type VaultPositionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    collateralAmount?: SortOrder
    borrowedMUSD?: SortOrder
    collateralRatio?: SortOrder
    lastSyncedBlock?: SortOrder
    updatedAt?: SortOrder
    _count?: VaultPositionCountOrderByAggregateInput
    _avg?: VaultPositionAvgOrderByAggregateInput
    _max?: VaultPositionMaxOrderByAggregateInput
    _min?: VaultPositionMinOrderByAggregateInput
    _sum?: VaultPositionSumOrderByAggregateInput
  }

  export type VaultPositionScalarWhereWithAggregatesInput = {
    AND?: VaultPositionScalarWhereWithAggregatesInput | VaultPositionScalarWhereWithAggregatesInput[]
    OR?: VaultPositionScalarWhereWithAggregatesInput[]
    NOT?: VaultPositionScalarWhereWithAggregatesInput | VaultPositionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VaultPosition"> | string
    userId?: StringWithAggregatesFilter<"VaultPosition"> | string
    collateralAmount?: DecimalWithAggregatesFilter<"VaultPosition"> | Decimal | DecimalJsLike | number | string
    borrowedMUSD?: DecimalWithAggregatesFilter<"VaultPosition"> | Decimal | DecimalJsLike | number | string
    collateralRatio?: DecimalWithAggregatesFilter<"VaultPosition"> | Decimal | DecimalJsLike | number | string
    lastSyncedBlock?: IntWithAggregatesFilter<"VaultPosition"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"VaultPosition"> | Date | string
  }

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    id?: StringFilter<"Transaction"> | string
    txHash?: StringNullableFilter<"Transaction"> | string | null
    senderId?: StringFilter<"Transaction"> | string
    recipientId?: StringFilter<"Transaction"> | string
    musdAmount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    feeAmount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    railType?: EnumPaymentRailFilter<"Transaction"> | $Enums.PaymentRail
    railReference?: StringNullableFilter<"Transaction"> | string | null
    fiatAmount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    fiatCurrency?: StringFilter<"Transaction"> | string
    status?: EnumTxStatusFilter<"Transaction"> | $Enums.TxStatus
    blockNumber?: IntNullableFilter<"Transaction"> | number | null
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    completedAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>
    recipient?: XOR<RecipientScalarRelationFilter, RecipientWhereInput>
  }

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder
    txHash?: SortOrderInput | SortOrder
    senderId?: SortOrder
    recipientId?: SortOrder
    musdAmount?: SortOrder
    feeAmount?: SortOrder
    railType?: SortOrder
    railReference?: SortOrderInput | SortOrder
    fiatAmount?: SortOrder
    fiatCurrency?: SortOrder
    status?: SortOrder
    blockNumber?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    sender?: UserOrderByWithRelationInput
    recipient?: RecipientOrderByWithRelationInput
  }

  export type TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    txHash?: string
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    senderId?: StringFilter<"Transaction"> | string
    recipientId?: StringFilter<"Transaction"> | string
    musdAmount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    feeAmount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    railType?: EnumPaymentRailFilter<"Transaction"> | $Enums.PaymentRail
    railReference?: StringNullableFilter<"Transaction"> | string | null
    fiatAmount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    fiatCurrency?: StringFilter<"Transaction"> | string
    status?: EnumTxStatusFilter<"Transaction"> | $Enums.TxStatus
    blockNumber?: IntNullableFilter<"Transaction"> | number | null
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    completedAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>
    recipient?: XOR<RecipientScalarRelationFilter, RecipientWhereInput>
  }, "id" | "txHash">

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    txHash?: SortOrderInput | SortOrder
    senderId?: SortOrder
    recipientId?: SortOrder
    musdAmount?: SortOrder
    feeAmount?: SortOrder
    railType?: SortOrder
    railReference?: SortOrderInput | SortOrder
    fiatAmount?: SortOrder
    fiatCurrency?: SortOrder
    status?: SortOrder
    blockNumber?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: TransactionCountOrderByAggregateInput
    _avg?: TransactionAvgOrderByAggregateInput
    _max?: TransactionMaxOrderByAggregateInput
    _min?: TransactionMinOrderByAggregateInput
    _sum?: TransactionSumOrderByAggregateInput
  }

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    OR?: TransactionScalarWhereWithAggregatesInput[]
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transaction"> | string
    txHash?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    senderId?: StringWithAggregatesFilter<"Transaction"> | string
    recipientId?: StringWithAggregatesFilter<"Transaction"> | string
    musdAmount?: DecimalWithAggregatesFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    feeAmount?: DecimalWithAggregatesFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    railType?: EnumPaymentRailWithAggregatesFilter<"Transaction"> | $Enums.PaymentRail
    railReference?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    fiatAmount?: DecimalWithAggregatesFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    fiatCurrency?: StringWithAggregatesFilter<"Transaction"> | string
    status?: EnumTxStatusWithAggregatesFilter<"Transaction"> | $Enums.TxStatus
    blockNumber?: IntNullableWithAggregatesFilter<"Transaction"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"Transaction"> | Date | string | null
  }

  export type IndexerStateWhereInput = {
    AND?: IndexerStateWhereInput | IndexerStateWhereInput[]
    OR?: IndexerStateWhereInput[]
    NOT?: IndexerStateWhereInput | IndexerStateWhereInput[]
    id?: StringFilter<"IndexerState"> | string
    lastBlock?: IntFilter<"IndexerState"> | number
    updatedAt?: DateTimeFilter<"IndexerState"> | Date | string
  }

  export type IndexerStateOrderByWithRelationInput = {
    id?: SortOrder
    lastBlock?: SortOrder
    updatedAt?: SortOrder
  }

  export type IndexerStateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: IndexerStateWhereInput | IndexerStateWhereInput[]
    OR?: IndexerStateWhereInput[]
    NOT?: IndexerStateWhereInput | IndexerStateWhereInput[]
    lastBlock?: IntFilter<"IndexerState"> | number
    updatedAt?: DateTimeFilter<"IndexerState"> | Date | string
  }, "id">

  export type IndexerStateOrderByWithAggregationInput = {
    id?: SortOrder
    lastBlock?: SortOrder
    updatedAt?: SortOrder
    _count?: IndexerStateCountOrderByAggregateInput
    _avg?: IndexerStateAvgOrderByAggregateInput
    _max?: IndexerStateMaxOrderByAggregateInput
    _min?: IndexerStateMinOrderByAggregateInput
    _sum?: IndexerStateSumOrderByAggregateInput
  }

  export type IndexerStateScalarWhereWithAggregatesInput = {
    AND?: IndexerStateScalarWhereWithAggregatesInput | IndexerStateScalarWhereWithAggregatesInput[]
    OR?: IndexerStateScalarWhereWithAggregatesInput[]
    NOT?: IndexerStateScalarWhereWithAggregatesInput | IndexerStateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"IndexerState"> | string
    lastBlock?: IntWithAggregatesFilter<"IndexerState"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"IndexerState"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    address: string
    phoneNumber?: string | null
    siweSession?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    vaultPosition?: VaultPositionCreateNestedOneWithoutUserInput
    sentTxs?: TransactionCreateNestedManyWithoutSenderInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    address: string
    phoneNumber?: string | null
    siweSession?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    vaultPosition?: VaultPositionUncheckedCreateNestedOneWithoutUserInput
    sentTxs?: TransactionUncheckedCreateNestedManyWithoutSenderInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    siweSession?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vaultPosition?: VaultPositionUpdateOneWithoutUserNestedInput
    sentTxs?: TransactionUpdateManyWithoutSenderNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    siweSession?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vaultPosition?: VaultPositionUncheckedUpdateOneWithoutUserNestedInput
    sentTxs?: TransactionUncheckedUpdateManyWithoutSenderNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    address: string
    phoneNumber?: string | null
    siweSession?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    siweSession?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    siweSession?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecipientCreateInput = {
    id?: string
    name: string
    phoneNumber: string
    phoneHash: string
    custodialAddress: string
    paymentRail: $Enums.PaymentRail
    isUpgraded?: boolean
    createdAt?: Date | string
    receivedTxs?: TransactionCreateNestedManyWithoutRecipientInput
  }

  export type RecipientUncheckedCreateInput = {
    id?: string
    name: string
    phoneNumber: string
    phoneHash: string
    custodialAddress: string
    paymentRail: $Enums.PaymentRail
    isUpgraded?: boolean
    createdAt?: Date | string
    receivedTxs?: TransactionUncheckedCreateNestedManyWithoutRecipientInput
  }

  export type RecipientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    phoneHash?: StringFieldUpdateOperationsInput | string
    custodialAddress?: StringFieldUpdateOperationsInput | string
    paymentRail?: EnumPaymentRailFieldUpdateOperationsInput | $Enums.PaymentRail
    isUpgraded?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedTxs?: TransactionUpdateManyWithoutRecipientNestedInput
  }

  export type RecipientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    phoneHash?: StringFieldUpdateOperationsInput | string
    custodialAddress?: StringFieldUpdateOperationsInput | string
    paymentRail?: EnumPaymentRailFieldUpdateOperationsInput | $Enums.PaymentRail
    isUpgraded?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedTxs?: TransactionUncheckedUpdateManyWithoutRecipientNestedInput
  }

  export type RecipientCreateManyInput = {
    id?: string
    name: string
    phoneNumber: string
    phoneHash: string
    custodialAddress: string
    paymentRail: $Enums.PaymentRail
    isUpgraded?: boolean
    createdAt?: Date | string
  }

  export type RecipientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    phoneHash?: StringFieldUpdateOperationsInput | string
    custodialAddress?: StringFieldUpdateOperationsInput | string
    paymentRail?: EnumPaymentRailFieldUpdateOperationsInput | $Enums.PaymentRail
    isUpgraded?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecipientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    phoneHash?: StringFieldUpdateOperationsInput | string
    custodialAddress?: StringFieldUpdateOperationsInput | string
    paymentRail?: EnumPaymentRailFieldUpdateOperationsInput | $Enums.PaymentRail
    isUpgraded?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VaultPositionCreateInput = {
    id?: string
    collateralAmount: Decimal | DecimalJsLike | number | string
    borrowedMUSD: Decimal | DecimalJsLike | number | string
    collateralRatio: Decimal | DecimalJsLike | number | string
    lastSyncedBlock: number
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutVaultPositionInput
  }

  export type VaultPositionUncheckedCreateInput = {
    id?: string
    userId: string
    collateralAmount: Decimal | DecimalJsLike | number | string
    borrowedMUSD: Decimal | DecimalJsLike | number | string
    collateralRatio: Decimal | DecimalJsLike | number | string
    lastSyncedBlock: number
    updatedAt?: Date | string
  }

  export type VaultPositionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    collateralAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    borrowedMUSD?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    collateralRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastSyncedBlock?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutVaultPositionNestedInput
  }

  export type VaultPositionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    collateralAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    borrowedMUSD?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    collateralRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastSyncedBlock?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VaultPositionCreateManyInput = {
    id?: string
    userId: string
    collateralAmount: Decimal | DecimalJsLike | number | string
    borrowedMUSD: Decimal | DecimalJsLike | number | string
    collateralRatio: Decimal | DecimalJsLike | number | string
    lastSyncedBlock: number
    updatedAt?: Date | string
  }

  export type VaultPositionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    collateralAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    borrowedMUSD?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    collateralRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastSyncedBlock?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VaultPositionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    collateralAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    borrowedMUSD?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    collateralRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastSyncedBlock?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateInput = {
    id?: string
    txHash?: string | null
    musdAmount: Decimal | DecimalJsLike | number | string
    feeAmount: Decimal | DecimalJsLike | number | string
    railType: $Enums.PaymentRail
    railReference?: string | null
    fiatAmount: Decimal | DecimalJsLike | number | string
    fiatCurrency: string
    status?: $Enums.TxStatus
    blockNumber?: number | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    sender: UserCreateNestedOneWithoutSentTxsInput
    recipient: RecipientCreateNestedOneWithoutReceivedTxsInput
  }

  export type TransactionUncheckedCreateInput = {
    id?: string
    txHash?: string | null
    senderId: string
    recipientId: string
    musdAmount: Decimal | DecimalJsLike | number | string
    feeAmount: Decimal | DecimalJsLike | number | string
    railType: $Enums.PaymentRail
    railReference?: string | null
    fiatAmount: Decimal | DecimalJsLike | number | string
    fiatCurrency: string
    status?: $Enums.TxStatus
    blockNumber?: number | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type TransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    musdAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    feeAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    railType?: EnumPaymentRailFieldUpdateOperationsInput | $Enums.PaymentRail
    railReference?: NullableStringFieldUpdateOperationsInput | string | null
    fiatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fiatCurrency?: StringFieldUpdateOperationsInput | string
    status?: EnumTxStatusFieldUpdateOperationsInput | $Enums.TxStatus
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sender?: UserUpdateOneRequiredWithoutSentTxsNestedInput
    recipient?: RecipientUpdateOneRequiredWithoutReceivedTxsNestedInput
  }

  export type TransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    senderId?: StringFieldUpdateOperationsInput | string
    recipientId?: StringFieldUpdateOperationsInput | string
    musdAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    feeAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    railType?: EnumPaymentRailFieldUpdateOperationsInput | $Enums.PaymentRail
    railReference?: NullableStringFieldUpdateOperationsInput | string | null
    fiatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fiatCurrency?: StringFieldUpdateOperationsInput | string
    status?: EnumTxStatusFieldUpdateOperationsInput | $Enums.TxStatus
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TransactionCreateManyInput = {
    id?: string
    txHash?: string | null
    senderId: string
    recipientId: string
    musdAmount: Decimal | DecimalJsLike | number | string
    feeAmount: Decimal | DecimalJsLike | number | string
    railType: $Enums.PaymentRail
    railReference?: string | null
    fiatAmount: Decimal | DecimalJsLike | number | string
    fiatCurrency: string
    status?: $Enums.TxStatus
    blockNumber?: number | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type TransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    musdAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    feeAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    railType?: EnumPaymentRailFieldUpdateOperationsInput | $Enums.PaymentRail
    railReference?: NullableStringFieldUpdateOperationsInput | string | null
    fiatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fiatCurrency?: StringFieldUpdateOperationsInput | string
    status?: EnumTxStatusFieldUpdateOperationsInput | $Enums.TxStatus
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    senderId?: StringFieldUpdateOperationsInput | string
    recipientId?: StringFieldUpdateOperationsInput | string
    musdAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    feeAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    railType?: EnumPaymentRailFieldUpdateOperationsInput | $Enums.PaymentRail
    railReference?: NullableStringFieldUpdateOperationsInput | string | null
    fiatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fiatCurrency?: StringFieldUpdateOperationsInput | string
    status?: EnumTxStatusFieldUpdateOperationsInput | $Enums.TxStatus
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type IndexerStateCreateInput = {
    id?: string
    lastBlock: number
    updatedAt?: Date | string
  }

  export type IndexerStateUncheckedCreateInput = {
    id?: string
    lastBlock: number
    updatedAt?: Date | string
  }

  export type IndexerStateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lastBlock?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IndexerStateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lastBlock?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IndexerStateCreateManyInput = {
    id?: string
    lastBlock: number
    updatedAt?: Date | string
  }

  export type IndexerStateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    lastBlock?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IndexerStateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    lastBlock?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type VaultPositionNullableScalarRelationFilter = {
    is?: VaultPositionWhereInput | null
    isNot?: VaultPositionWhereInput | null
  }

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput
    some?: TransactionWhereInput
    none?: TransactionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    phoneNumber?: SortOrder
    siweSession?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    phoneNumber?: SortOrder
    siweSession?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    phoneNumber?: SortOrder
    siweSession?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumPaymentRailFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentRail | EnumPaymentRailFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentRail[] | ListEnumPaymentRailFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentRail[] | ListEnumPaymentRailFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentRailFilter<$PrismaModel> | $Enums.PaymentRail
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type RecipientCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phoneNumber?: SortOrder
    phoneHash?: SortOrder
    custodialAddress?: SortOrder
    paymentRail?: SortOrder
    isUpgraded?: SortOrder
    createdAt?: SortOrder
  }

  export type RecipientMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phoneNumber?: SortOrder
    phoneHash?: SortOrder
    custodialAddress?: SortOrder
    paymentRail?: SortOrder
    isUpgraded?: SortOrder
    createdAt?: SortOrder
  }

  export type RecipientMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phoneNumber?: SortOrder
    phoneHash?: SortOrder
    custodialAddress?: SortOrder
    paymentRail?: SortOrder
    isUpgraded?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumPaymentRailWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentRail | EnumPaymentRailFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentRail[] | ListEnumPaymentRailFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentRail[] | ListEnumPaymentRailFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentRailWithAggregatesFilter<$PrismaModel> | $Enums.PaymentRail
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentRailFilter<$PrismaModel>
    _max?: NestedEnumPaymentRailFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type VaultPositionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    collateralAmount?: SortOrder
    borrowedMUSD?: SortOrder
    collateralRatio?: SortOrder
    lastSyncedBlock?: SortOrder
    updatedAt?: SortOrder
  }

  export type VaultPositionAvgOrderByAggregateInput = {
    collateralAmount?: SortOrder
    borrowedMUSD?: SortOrder
    collateralRatio?: SortOrder
    lastSyncedBlock?: SortOrder
  }

  export type VaultPositionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    collateralAmount?: SortOrder
    borrowedMUSD?: SortOrder
    collateralRatio?: SortOrder
    lastSyncedBlock?: SortOrder
    updatedAt?: SortOrder
  }

  export type VaultPositionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    collateralAmount?: SortOrder
    borrowedMUSD?: SortOrder
    collateralRatio?: SortOrder
    lastSyncedBlock?: SortOrder
    updatedAt?: SortOrder
  }

  export type VaultPositionSumOrderByAggregateInput = {
    collateralAmount?: SortOrder
    borrowedMUSD?: SortOrder
    collateralRatio?: SortOrder
    lastSyncedBlock?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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

  export type EnumTxStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TxStatus | EnumTxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TxStatus[] | ListEnumTxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TxStatus[] | ListEnumTxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTxStatusFilter<$PrismaModel> | $Enums.TxStatus
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type RecipientScalarRelationFilter = {
    is?: RecipientWhereInput
    isNot?: RecipientWhereInput
  }

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    txHash?: SortOrder
    senderId?: SortOrder
    recipientId?: SortOrder
    musdAmount?: SortOrder
    feeAmount?: SortOrder
    railType?: SortOrder
    railReference?: SortOrder
    fiatAmount?: SortOrder
    fiatCurrency?: SortOrder
    status?: SortOrder
    blockNumber?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type TransactionAvgOrderByAggregateInput = {
    musdAmount?: SortOrder
    feeAmount?: SortOrder
    fiatAmount?: SortOrder
    blockNumber?: SortOrder
  }

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    txHash?: SortOrder
    senderId?: SortOrder
    recipientId?: SortOrder
    musdAmount?: SortOrder
    feeAmount?: SortOrder
    railType?: SortOrder
    railReference?: SortOrder
    fiatAmount?: SortOrder
    fiatCurrency?: SortOrder
    status?: SortOrder
    blockNumber?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    txHash?: SortOrder
    senderId?: SortOrder
    recipientId?: SortOrder
    musdAmount?: SortOrder
    feeAmount?: SortOrder
    railType?: SortOrder
    railReference?: SortOrder
    fiatAmount?: SortOrder
    fiatCurrency?: SortOrder
    status?: SortOrder
    blockNumber?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type TransactionSumOrderByAggregateInput = {
    musdAmount?: SortOrder
    feeAmount?: SortOrder
    fiatAmount?: SortOrder
    blockNumber?: SortOrder
  }

  export type EnumTxStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TxStatus | EnumTxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TxStatus[] | ListEnumTxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TxStatus[] | ListEnumTxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTxStatusWithAggregatesFilter<$PrismaModel> | $Enums.TxStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTxStatusFilter<$PrismaModel>
    _max?: NestedEnumTxStatusFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
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
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IndexerStateCountOrderByAggregateInput = {
    id?: SortOrder
    lastBlock?: SortOrder
    updatedAt?: SortOrder
  }

  export type IndexerStateAvgOrderByAggregateInput = {
    lastBlock?: SortOrder
  }

  export type IndexerStateMaxOrderByAggregateInput = {
    id?: SortOrder
    lastBlock?: SortOrder
    updatedAt?: SortOrder
  }

  export type IndexerStateMinOrderByAggregateInput = {
    id?: SortOrder
    lastBlock?: SortOrder
    updatedAt?: SortOrder
  }

  export type IndexerStateSumOrderByAggregateInput = {
    lastBlock?: SortOrder
  }

  export type VaultPositionCreateNestedOneWithoutUserInput = {
    create?: XOR<VaultPositionCreateWithoutUserInput, VaultPositionUncheckedCreateWithoutUserInput>
    connectOrCreate?: VaultPositionCreateOrConnectWithoutUserInput
    connect?: VaultPositionWhereUniqueInput
  }

  export type TransactionCreateNestedManyWithoutSenderInput = {
    create?: XOR<TransactionCreateWithoutSenderInput, TransactionUncheckedCreateWithoutSenderInput> | TransactionCreateWithoutSenderInput[] | TransactionUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutSenderInput | TransactionCreateOrConnectWithoutSenderInput[]
    createMany?: TransactionCreateManySenderInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type VaultPositionUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<VaultPositionCreateWithoutUserInput, VaultPositionUncheckedCreateWithoutUserInput>
    connectOrCreate?: VaultPositionCreateOrConnectWithoutUserInput
    connect?: VaultPositionWhereUniqueInput
  }

  export type TransactionUncheckedCreateNestedManyWithoutSenderInput = {
    create?: XOR<TransactionCreateWithoutSenderInput, TransactionUncheckedCreateWithoutSenderInput> | TransactionCreateWithoutSenderInput[] | TransactionUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutSenderInput | TransactionCreateOrConnectWithoutSenderInput[]
    createMany?: TransactionCreateManySenderInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
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

  export type VaultPositionUpdateOneWithoutUserNestedInput = {
    create?: XOR<VaultPositionCreateWithoutUserInput, VaultPositionUncheckedCreateWithoutUserInput>
    connectOrCreate?: VaultPositionCreateOrConnectWithoutUserInput
    upsert?: VaultPositionUpsertWithoutUserInput
    disconnect?: VaultPositionWhereInput | boolean
    delete?: VaultPositionWhereInput | boolean
    connect?: VaultPositionWhereUniqueInput
    update?: XOR<XOR<VaultPositionUpdateToOneWithWhereWithoutUserInput, VaultPositionUpdateWithoutUserInput>, VaultPositionUncheckedUpdateWithoutUserInput>
  }

  export type TransactionUpdateManyWithoutSenderNestedInput = {
    create?: XOR<TransactionCreateWithoutSenderInput, TransactionUncheckedCreateWithoutSenderInput> | TransactionCreateWithoutSenderInput[] | TransactionUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutSenderInput | TransactionCreateOrConnectWithoutSenderInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutSenderInput | TransactionUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: TransactionCreateManySenderInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutSenderInput | TransactionUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutSenderInput | TransactionUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type VaultPositionUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<VaultPositionCreateWithoutUserInput, VaultPositionUncheckedCreateWithoutUserInput>
    connectOrCreate?: VaultPositionCreateOrConnectWithoutUserInput
    upsert?: VaultPositionUpsertWithoutUserInput
    disconnect?: VaultPositionWhereInput | boolean
    delete?: VaultPositionWhereInput | boolean
    connect?: VaultPositionWhereUniqueInput
    update?: XOR<XOR<VaultPositionUpdateToOneWithWhereWithoutUserInput, VaultPositionUpdateWithoutUserInput>, VaultPositionUncheckedUpdateWithoutUserInput>
  }

  export type TransactionUncheckedUpdateManyWithoutSenderNestedInput = {
    create?: XOR<TransactionCreateWithoutSenderInput, TransactionUncheckedCreateWithoutSenderInput> | TransactionCreateWithoutSenderInput[] | TransactionUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutSenderInput | TransactionCreateOrConnectWithoutSenderInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutSenderInput | TransactionUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: TransactionCreateManySenderInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutSenderInput | TransactionUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutSenderInput | TransactionUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionCreateNestedManyWithoutRecipientInput = {
    create?: XOR<TransactionCreateWithoutRecipientInput, TransactionUncheckedCreateWithoutRecipientInput> | TransactionCreateWithoutRecipientInput[] | TransactionUncheckedCreateWithoutRecipientInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutRecipientInput | TransactionCreateOrConnectWithoutRecipientInput[]
    createMany?: TransactionCreateManyRecipientInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutRecipientInput = {
    create?: XOR<TransactionCreateWithoutRecipientInput, TransactionUncheckedCreateWithoutRecipientInput> | TransactionCreateWithoutRecipientInput[] | TransactionUncheckedCreateWithoutRecipientInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutRecipientInput | TransactionCreateOrConnectWithoutRecipientInput[]
    createMany?: TransactionCreateManyRecipientInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type EnumPaymentRailFieldUpdateOperationsInput = {
    set?: $Enums.PaymentRail
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type TransactionUpdateManyWithoutRecipientNestedInput = {
    create?: XOR<TransactionCreateWithoutRecipientInput, TransactionUncheckedCreateWithoutRecipientInput> | TransactionCreateWithoutRecipientInput[] | TransactionUncheckedCreateWithoutRecipientInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutRecipientInput | TransactionCreateOrConnectWithoutRecipientInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutRecipientInput | TransactionUpsertWithWhereUniqueWithoutRecipientInput[]
    createMany?: TransactionCreateManyRecipientInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutRecipientInput | TransactionUpdateWithWhereUniqueWithoutRecipientInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutRecipientInput | TransactionUpdateManyWithWhereWithoutRecipientInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutRecipientNestedInput = {
    create?: XOR<TransactionCreateWithoutRecipientInput, TransactionUncheckedCreateWithoutRecipientInput> | TransactionCreateWithoutRecipientInput[] | TransactionUncheckedCreateWithoutRecipientInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutRecipientInput | TransactionCreateOrConnectWithoutRecipientInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutRecipientInput | TransactionUpsertWithWhereUniqueWithoutRecipientInput[]
    createMany?: TransactionCreateManyRecipientInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutRecipientInput | TransactionUpdateWithWhereUniqueWithoutRecipientInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutRecipientInput | TransactionUpdateManyWithWhereWithoutRecipientInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutVaultPositionInput = {
    create?: XOR<UserCreateWithoutVaultPositionInput, UserUncheckedCreateWithoutVaultPositionInput>
    connectOrCreate?: UserCreateOrConnectWithoutVaultPositionInput
    connect?: UserWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutVaultPositionNestedInput = {
    create?: XOR<UserCreateWithoutVaultPositionInput, UserUncheckedCreateWithoutVaultPositionInput>
    connectOrCreate?: UserCreateOrConnectWithoutVaultPositionInput
    upsert?: UserUpsertWithoutVaultPositionInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutVaultPositionInput, UserUpdateWithoutVaultPositionInput>, UserUncheckedUpdateWithoutVaultPositionInput>
  }

  export type UserCreateNestedOneWithoutSentTxsInput = {
    create?: XOR<UserCreateWithoutSentTxsInput, UserUncheckedCreateWithoutSentTxsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentTxsInput
    connect?: UserWhereUniqueInput
  }

  export type RecipientCreateNestedOneWithoutReceivedTxsInput = {
    create?: XOR<RecipientCreateWithoutReceivedTxsInput, RecipientUncheckedCreateWithoutReceivedTxsInput>
    connectOrCreate?: RecipientCreateOrConnectWithoutReceivedTxsInput
    connect?: RecipientWhereUniqueInput
  }

  export type EnumTxStatusFieldUpdateOperationsInput = {
    set?: $Enums.TxStatus
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

  export type UserUpdateOneRequiredWithoutSentTxsNestedInput = {
    create?: XOR<UserCreateWithoutSentTxsInput, UserUncheckedCreateWithoutSentTxsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentTxsInput
    upsert?: UserUpsertWithoutSentTxsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSentTxsInput, UserUpdateWithoutSentTxsInput>, UserUncheckedUpdateWithoutSentTxsInput>
  }

  export type RecipientUpdateOneRequiredWithoutReceivedTxsNestedInput = {
    create?: XOR<RecipientCreateWithoutReceivedTxsInput, RecipientUncheckedCreateWithoutReceivedTxsInput>
    connectOrCreate?: RecipientCreateOrConnectWithoutReceivedTxsInput
    upsert?: RecipientUpsertWithoutReceivedTxsInput
    connect?: RecipientWhereUniqueInput
    update?: XOR<XOR<RecipientUpdateToOneWithWhereWithoutReceivedTxsInput, RecipientUpdateWithoutReceivedTxsInput>, RecipientUncheckedUpdateWithoutReceivedTxsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
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
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
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
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
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
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
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
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumPaymentRailFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentRail | EnumPaymentRailFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentRail[] | ListEnumPaymentRailFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentRail[] | ListEnumPaymentRailFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentRailFilter<$PrismaModel> | $Enums.PaymentRail
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumPaymentRailWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentRail | EnumPaymentRailFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentRail[] | ListEnumPaymentRailFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentRail[] | ListEnumPaymentRailFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentRailWithAggregatesFilter<$PrismaModel> | $Enums.PaymentRail
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentRailFilter<$PrismaModel>
    _max?: NestedEnumPaymentRailFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumTxStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TxStatus | EnumTxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TxStatus[] | ListEnumTxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TxStatus[] | ListEnumTxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTxStatusFilter<$PrismaModel> | $Enums.TxStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumTxStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TxStatus | EnumTxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TxStatus[] | ListEnumTxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TxStatus[] | ListEnumTxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTxStatusWithAggregatesFilter<$PrismaModel> | $Enums.TxStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTxStatusFilter<$PrismaModel>
    _max?: NestedEnumTxStatusFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
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
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type VaultPositionCreateWithoutUserInput = {
    id?: string
    collateralAmount: Decimal | DecimalJsLike | number | string
    borrowedMUSD: Decimal | DecimalJsLike | number | string
    collateralRatio: Decimal | DecimalJsLike | number | string
    lastSyncedBlock: number
    updatedAt?: Date | string
  }

  export type VaultPositionUncheckedCreateWithoutUserInput = {
    id?: string
    collateralAmount: Decimal | DecimalJsLike | number | string
    borrowedMUSD: Decimal | DecimalJsLike | number | string
    collateralRatio: Decimal | DecimalJsLike | number | string
    lastSyncedBlock: number
    updatedAt?: Date | string
  }

  export type VaultPositionCreateOrConnectWithoutUserInput = {
    where: VaultPositionWhereUniqueInput
    create: XOR<VaultPositionCreateWithoutUserInput, VaultPositionUncheckedCreateWithoutUserInput>
  }

  export type TransactionCreateWithoutSenderInput = {
    id?: string
    txHash?: string | null
    musdAmount: Decimal | DecimalJsLike | number | string
    feeAmount: Decimal | DecimalJsLike | number | string
    railType: $Enums.PaymentRail
    railReference?: string | null
    fiatAmount: Decimal | DecimalJsLike | number | string
    fiatCurrency: string
    status?: $Enums.TxStatus
    blockNumber?: number | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    recipient: RecipientCreateNestedOneWithoutReceivedTxsInput
  }

  export type TransactionUncheckedCreateWithoutSenderInput = {
    id?: string
    txHash?: string | null
    recipientId: string
    musdAmount: Decimal | DecimalJsLike | number | string
    feeAmount: Decimal | DecimalJsLike | number | string
    railType: $Enums.PaymentRail
    railReference?: string | null
    fiatAmount: Decimal | DecimalJsLike | number | string
    fiatCurrency: string
    status?: $Enums.TxStatus
    blockNumber?: number | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type TransactionCreateOrConnectWithoutSenderInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutSenderInput, TransactionUncheckedCreateWithoutSenderInput>
  }

  export type TransactionCreateManySenderInputEnvelope = {
    data: TransactionCreateManySenderInput | TransactionCreateManySenderInput[]
    skipDuplicates?: boolean
  }

  export type VaultPositionUpsertWithoutUserInput = {
    update: XOR<VaultPositionUpdateWithoutUserInput, VaultPositionUncheckedUpdateWithoutUserInput>
    create: XOR<VaultPositionCreateWithoutUserInput, VaultPositionUncheckedCreateWithoutUserInput>
    where?: VaultPositionWhereInput
  }

  export type VaultPositionUpdateToOneWithWhereWithoutUserInput = {
    where?: VaultPositionWhereInput
    data: XOR<VaultPositionUpdateWithoutUserInput, VaultPositionUncheckedUpdateWithoutUserInput>
  }

  export type VaultPositionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    collateralAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    borrowedMUSD?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    collateralRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastSyncedBlock?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VaultPositionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    collateralAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    borrowedMUSD?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    collateralRatio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastSyncedBlock?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUpsertWithWhereUniqueWithoutSenderInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutSenderInput, TransactionUncheckedUpdateWithoutSenderInput>
    create: XOR<TransactionCreateWithoutSenderInput, TransactionUncheckedCreateWithoutSenderInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutSenderInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutSenderInput, TransactionUncheckedUpdateWithoutSenderInput>
  }

  export type TransactionUpdateManyWithWhereWithoutSenderInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutSenderInput>
  }

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    OR?: TransactionScalarWhereInput[]
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    id?: StringFilter<"Transaction"> | string
    txHash?: StringNullableFilter<"Transaction"> | string | null
    senderId?: StringFilter<"Transaction"> | string
    recipientId?: StringFilter<"Transaction"> | string
    musdAmount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    feeAmount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    railType?: EnumPaymentRailFilter<"Transaction"> | $Enums.PaymentRail
    railReference?: StringNullableFilter<"Transaction"> | string | null
    fiatAmount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    fiatCurrency?: StringFilter<"Transaction"> | string
    status?: EnumTxStatusFilter<"Transaction"> | $Enums.TxStatus
    blockNumber?: IntNullableFilter<"Transaction"> | number | null
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    completedAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null
  }

  export type TransactionCreateWithoutRecipientInput = {
    id?: string
    txHash?: string | null
    musdAmount: Decimal | DecimalJsLike | number | string
    feeAmount: Decimal | DecimalJsLike | number | string
    railType: $Enums.PaymentRail
    railReference?: string | null
    fiatAmount: Decimal | DecimalJsLike | number | string
    fiatCurrency: string
    status?: $Enums.TxStatus
    blockNumber?: number | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    sender: UserCreateNestedOneWithoutSentTxsInput
  }

  export type TransactionUncheckedCreateWithoutRecipientInput = {
    id?: string
    txHash?: string | null
    senderId: string
    musdAmount: Decimal | DecimalJsLike | number | string
    feeAmount: Decimal | DecimalJsLike | number | string
    railType: $Enums.PaymentRail
    railReference?: string | null
    fiatAmount: Decimal | DecimalJsLike | number | string
    fiatCurrency: string
    status?: $Enums.TxStatus
    blockNumber?: number | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type TransactionCreateOrConnectWithoutRecipientInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutRecipientInput, TransactionUncheckedCreateWithoutRecipientInput>
  }

  export type TransactionCreateManyRecipientInputEnvelope = {
    data: TransactionCreateManyRecipientInput | TransactionCreateManyRecipientInput[]
    skipDuplicates?: boolean
  }

  export type TransactionUpsertWithWhereUniqueWithoutRecipientInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutRecipientInput, TransactionUncheckedUpdateWithoutRecipientInput>
    create: XOR<TransactionCreateWithoutRecipientInput, TransactionUncheckedCreateWithoutRecipientInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutRecipientInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutRecipientInput, TransactionUncheckedUpdateWithoutRecipientInput>
  }

  export type TransactionUpdateManyWithWhereWithoutRecipientInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutRecipientInput>
  }

  export type UserCreateWithoutVaultPositionInput = {
    id?: string
    address: string
    phoneNumber?: string | null
    siweSession?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sentTxs?: TransactionCreateNestedManyWithoutSenderInput
  }

  export type UserUncheckedCreateWithoutVaultPositionInput = {
    id?: string
    address: string
    phoneNumber?: string | null
    siweSession?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sentTxs?: TransactionUncheckedCreateNestedManyWithoutSenderInput
  }

  export type UserCreateOrConnectWithoutVaultPositionInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutVaultPositionInput, UserUncheckedCreateWithoutVaultPositionInput>
  }

  export type UserUpsertWithoutVaultPositionInput = {
    update: XOR<UserUpdateWithoutVaultPositionInput, UserUncheckedUpdateWithoutVaultPositionInput>
    create: XOR<UserCreateWithoutVaultPositionInput, UserUncheckedCreateWithoutVaultPositionInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutVaultPositionInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutVaultPositionInput, UserUncheckedUpdateWithoutVaultPositionInput>
  }

  export type UserUpdateWithoutVaultPositionInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    siweSession?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentTxs?: TransactionUpdateManyWithoutSenderNestedInput
  }

  export type UserUncheckedUpdateWithoutVaultPositionInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    siweSession?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentTxs?: TransactionUncheckedUpdateManyWithoutSenderNestedInput
  }

  export type UserCreateWithoutSentTxsInput = {
    id?: string
    address: string
    phoneNumber?: string | null
    siweSession?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    vaultPosition?: VaultPositionCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSentTxsInput = {
    id?: string
    address: string
    phoneNumber?: string | null
    siweSession?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    vaultPosition?: VaultPositionUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSentTxsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSentTxsInput, UserUncheckedCreateWithoutSentTxsInput>
  }

  export type RecipientCreateWithoutReceivedTxsInput = {
    id?: string
    name: string
    phoneNumber: string
    phoneHash: string
    custodialAddress: string
    paymentRail: $Enums.PaymentRail
    isUpgraded?: boolean
    createdAt?: Date | string
  }

  export type RecipientUncheckedCreateWithoutReceivedTxsInput = {
    id?: string
    name: string
    phoneNumber: string
    phoneHash: string
    custodialAddress: string
    paymentRail: $Enums.PaymentRail
    isUpgraded?: boolean
    createdAt?: Date | string
  }

  export type RecipientCreateOrConnectWithoutReceivedTxsInput = {
    where: RecipientWhereUniqueInput
    create: XOR<RecipientCreateWithoutReceivedTxsInput, RecipientUncheckedCreateWithoutReceivedTxsInput>
  }

  export type UserUpsertWithoutSentTxsInput = {
    update: XOR<UserUpdateWithoutSentTxsInput, UserUncheckedUpdateWithoutSentTxsInput>
    create: XOR<UserCreateWithoutSentTxsInput, UserUncheckedCreateWithoutSentTxsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSentTxsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSentTxsInput, UserUncheckedUpdateWithoutSentTxsInput>
  }

  export type UserUpdateWithoutSentTxsInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    siweSession?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vaultPosition?: VaultPositionUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSentTxsInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    siweSession?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vaultPosition?: VaultPositionUncheckedUpdateOneWithoutUserNestedInput
  }

  export type RecipientUpsertWithoutReceivedTxsInput = {
    update: XOR<RecipientUpdateWithoutReceivedTxsInput, RecipientUncheckedUpdateWithoutReceivedTxsInput>
    create: XOR<RecipientCreateWithoutReceivedTxsInput, RecipientUncheckedCreateWithoutReceivedTxsInput>
    where?: RecipientWhereInput
  }

  export type RecipientUpdateToOneWithWhereWithoutReceivedTxsInput = {
    where?: RecipientWhereInput
    data: XOR<RecipientUpdateWithoutReceivedTxsInput, RecipientUncheckedUpdateWithoutReceivedTxsInput>
  }

  export type RecipientUpdateWithoutReceivedTxsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    phoneHash?: StringFieldUpdateOperationsInput | string
    custodialAddress?: StringFieldUpdateOperationsInput | string
    paymentRail?: EnumPaymentRailFieldUpdateOperationsInput | $Enums.PaymentRail
    isUpgraded?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecipientUncheckedUpdateWithoutReceivedTxsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    phoneHash?: StringFieldUpdateOperationsInput | string
    custodialAddress?: StringFieldUpdateOperationsInput | string
    paymentRail?: EnumPaymentRailFieldUpdateOperationsInput | $Enums.PaymentRail
    isUpgraded?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateManySenderInput = {
    id?: string
    txHash?: string | null
    recipientId: string
    musdAmount: Decimal | DecimalJsLike | number | string
    feeAmount: Decimal | DecimalJsLike | number | string
    railType: $Enums.PaymentRail
    railReference?: string | null
    fiatAmount: Decimal | DecimalJsLike | number | string
    fiatCurrency: string
    status?: $Enums.TxStatus
    blockNumber?: number | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type TransactionUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    musdAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    feeAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    railType?: EnumPaymentRailFieldUpdateOperationsInput | $Enums.PaymentRail
    railReference?: NullableStringFieldUpdateOperationsInput | string | null
    fiatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fiatCurrency?: StringFieldUpdateOperationsInput | string
    status?: EnumTxStatusFieldUpdateOperationsInput | $Enums.TxStatus
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recipient?: RecipientUpdateOneRequiredWithoutReceivedTxsNestedInput
  }

  export type TransactionUncheckedUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    recipientId?: StringFieldUpdateOperationsInput | string
    musdAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    feeAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    railType?: EnumPaymentRailFieldUpdateOperationsInput | $Enums.PaymentRail
    railReference?: NullableStringFieldUpdateOperationsInput | string | null
    fiatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fiatCurrency?: StringFieldUpdateOperationsInput | string
    status?: EnumTxStatusFieldUpdateOperationsInput | $Enums.TxStatus
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TransactionUncheckedUpdateManyWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    recipientId?: StringFieldUpdateOperationsInput | string
    musdAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    feeAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    railType?: EnumPaymentRailFieldUpdateOperationsInput | $Enums.PaymentRail
    railReference?: NullableStringFieldUpdateOperationsInput | string | null
    fiatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fiatCurrency?: StringFieldUpdateOperationsInput | string
    status?: EnumTxStatusFieldUpdateOperationsInput | $Enums.TxStatus
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TransactionCreateManyRecipientInput = {
    id?: string
    txHash?: string | null
    senderId: string
    musdAmount: Decimal | DecimalJsLike | number | string
    feeAmount: Decimal | DecimalJsLike | number | string
    railType: $Enums.PaymentRail
    railReference?: string | null
    fiatAmount: Decimal | DecimalJsLike | number | string
    fiatCurrency: string
    status?: $Enums.TxStatus
    blockNumber?: number | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type TransactionUpdateWithoutRecipientInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    musdAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    feeAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    railType?: EnumPaymentRailFieldUpdateOperationsInput | $Enums.PaymentRail
    railReference?: NullableStringFieldUpdateOperationsInput | string | null
    fiatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fiatCurrency?: StringFieldUpdateOperationsInput | string
    status?: EnumTxStatusFieldUpdateOperationsInput | $Enums.TxStatus
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sender?: UserUpdateOneRequiredWithoutSentTxsNestedInput
  }

  export type TransactionUncheckedUpdateWithoutRecipientInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    senderId?: StringFieldUpdateOperationsInput | string
    musdAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    feeAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    railType?: EnumPaymentRailFieldUpdateOperationsInput | $Enums.PaymentRail
    railReference?: NullableStringFieldUpdateOperationsInput | string | null
    fiatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fiatCurrency?: StringFieldUpdateOperationsInput | string
    status?: EnumTxStatusFieldUpdateOperationsInput | $Enums.TxStatus
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TransactionUncheckedUpdateManyWithoutRecipientInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    senderId?: StringFieldUpdateOperationsInput | string
    musdAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    feeAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    railType?: EnumPaymentRailFieldUpdateOperationsInput | $Enums.PaymentRail
    railReference?: NullableStringFieldUpdateOperationsInput | string | null
    fiatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fiatCurrency?: StringFieldUpdateOperationsInput | string
    status?: EnumTxStatusFieldUpdateOperationsInput | $Enums.TxStatus
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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