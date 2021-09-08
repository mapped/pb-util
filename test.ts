import test from "ava";
import { list, struct, value, JsonValue } from "./index";

const arr = [null, 10];

const obj = {
  foo: "bar",
  no: false,
  nil: null,
};

const objWithUndefined = {
  foo: "bar",
  no: false,
  nil: null,
  isUndefined: undefined,
};

const listValue = {
  values: [
    {
      $case: "nullValue",
      nullValue: null,
    },
    {
      $case: "numberValue",
      numberValue: 10,
    },
  ],
};

const structValue = {
  fields: {
    foo: {
      kind: {
        $case: "stringValue",
        stringValue: "bar",
      },
    },
    no: {
      kind: {
        $case: "boolValue",
        boolValue: false,
      },
    },
    nil: {
      kind: {
        $case: "nullValue",
        nullValue: null,
      },
    },
  },
};

test("value.encode - unknown", (t) => {
  t.throws(() => {
    value.encode(new Date() as unknown as JsonValue);
  });
});

test("value.decode - listValue", (t) => {
  const encodedValue = {
    $case: "listValue",
    listValue,
  };

  const actual = value.decode(encodedValue);
  t.deepEqual(actual, arr);
});

test("struct.encode - undefined value", (t) => {
  const actual = struct.encode(objWithUndefined);
  t.deepEqual(actual, structValue);
});

test("struct.decode", (t) => {
  const actual = struct.decode(structValue);
  t.deepEqual(actual, obj);
});
