/**
 * Matches a JSON object.
 */
export type JsonObject = { [key: string]: JsonValue };

/**
 * Matches a JSON array.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JsonArray extends Array<JsonValue> {}

/**
 * Matches any valid JSON value.
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;

/**
 *  `Struct` represents a structured data value, consisting of fields
 *  which map to dynamically typed values. In some languages, `Struct`
 *  might be supported by a native representation. For example, in
 *  scripting languages like JS a struct is represented as an
 *  object. The details of that representation are described together
 *  with the proto support for the language.
 *
 *  The JSON representation for `Struct` is JSON object.
 */
export interface Struct {
  /**
   *  Unordered map of dynamically typed values.
   */
  fields: { [key: string]: Value };
}

/**
 *  `Value` represents a dynamically typed value which can be either
 *  null, a number, a string, a boolean, a recursive struct value, or a
 *  list of values. A producer of value is expected to set one of that
 *  variants, absence of any variant indicates an error.
 *
 *  The JSON representation for `Value` is JSON value.
 */

interface Value {
  kind: {
    $case: string;
    nullValue?: number;
    numberValue?: number;
    stringValue?: string;
    boolValue?: boolean;
    structValue?: Struct;
    listValue?: ListValue;
  };
}

/**
 *  `ListValue` is a wrapper around a repeated field of values.
 *
 *  The JSON representation for `ListValue` is JSON array.
 */
export interface ListValue {
  /**
   *  Repeated field of dynamically typed values.
   */
  values: Value[];
}

export enum NullValue {
  /** NULL_VALUE -  Null value.
   */
  NULL_VALUE = 0,
  UNRECOGNIZED = -1,
}

export function nullValueFromJSON(object: any): NullValue {
  switch (object) {
    case 0:
    case "NULL_VALUE":
      return NullValue.NULL_VALUE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return NullValue.UNRECOGNIZED;
  }
}

export function nullValueToJSON(object: NullValue): string {
  switch (object) {
    case NullValue.NULL_VALUE:
      return "NULL_VALUE";
    default:
      return "UNKNOWN";
  }
}

/**
 * Valid `kind` types
 */
enum Kind {
  Struct = "structValue",
  List = "listValue",
  Number = "numberValue",
  String = "stringValue",
  Bool = "boolValue",
  Null = "nullValue",
}

const toString = Object.prototype.toString;

const encoders = {
  [typeOf({})]: (v) => wrap(Kind.Struct, struct.encode(v)),
  [typeOf([])]: (v) => wrap(Kind.List, list.encode(v)),
  [typeOf(0)]: (v) => wrap(Kind.Number, v),
  [typeOf("")]: (v) => wrap(Kind.String, v),
  [typeOf(true)]: (v) => wrap(Kind.Bool, v),
  [typeOf(null)]: () => wrap(Kind.Null, null),
};

function typeOf(value: JsonValue): string {
  return toString.call(value);
}

function wrap(theKind: Kind, value: any): Value {
  return {
    kind: {
      $case: theKind,
      [theKind]: value,
    },
  };
}

function getKind(value: Value): string | null {
  if (value.kind.$case) {
    return value.kind.$case;
  }

  const validKinds = Object.values(Kind);

  for (const kind of validKinds) {
    if (value.hasOwnProperty(kind)) {
      return kind;
    }
  }

  return null;
}

/**
 * Used to encode/decode {@link Value} objects.
 */
export const value = {
  /**
   * Encodes a JSON value into a protobuf {@link Value}.
   *
   * @param {*} value The JSON value.
   * @returns {Value}
   */
  encode(value: JsonValue): Value {
    const type = typeOf(value);
    const encoder = encoders[type];
    if (typeof encoder !== "function") {
      throw new TypeError(`Unable to infer type for "${value}".`);
    }
    return encoder(value);
  },
  /**
   * Decodes a protobuf {@link Value} into a JSON value.
   *
   * @throws {TypeError} If unable to determine value `kind`.
   *
   * @param {Value} value the protobuf value.
   * @returns {*}
   */
  decode(value: Value): JsonValue {
    switch (value.kind.$case) {
      case "listValue":
        return list.decode(value.kind.listValue);
      case "structValue":
        return struct.decode(value.kind.structValue);
      case "nullValue":
        return null;
      case "numberValue":
        return value.kind.numberValue;
      case "stringValue":
        return value.kind.stringValue;
      case "boolValue":
        return value.kind.boolValue;
    }
  },
};

/**
 * Used to encode/decode {@link Struct} objects.
 */
export const struct = {
  /**
   * Encodes a JSON object into a protobuf {@link Struct}.
   *
   * @param {Object.<string, *>} value the JSON object.
   * @returns {Struct}
   */
  encode(json: JsonObject): Struct {
    const fields = {};
    Object.keys(json).forEach((key) => {
      // If value is undefined, do not encode it.
      if (typeof json[key] === "undefined") return;
      fields[key] = value.encode(json[key]);
    });
    return { fields };
  },
  /**
   * Decodes a protobuf {@link Struct} into a JSON object.
   *
   * @param {Struct} struct the protobuf struct.
   * @returns {Object.<string, *>}
   */
  decode({ fields }: Struct): JsonObject {
    const json = {};
    Object.keys(fields).forEach((key) => {
      json[key] = value.decode(fields[key]);
    });
    return json;
  },
};

/**
 * Used to encode/decode {@link ListValue} objects.
 */
export const list = {
  /**
   * Encodes an array of JSON values into a protobuf {@link ListValue}.
   *
   * @param {Array.<*>} values the JSON values.
   * @returns {ListValue}
   */
  encode(values: JsonArray): ListValue {
    return {
      values: values.map(value.encode),
    };
  },
  /**
   * Decodes a protobuf {@link ListValue} into an array of JSON values.
   *
   * @param {ListValue} list the protobuf list value.
   * @returns {Array.<*>}
   */
  decode({ values }: ListValue): JsonArray {
    return values.map(value.decode);
  },
};
