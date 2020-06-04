import validateSchema from "./validateSchema";

const message = "failed validation";
const fail = "Failed validation.";
const pass = "";

describe("validation absence", () => {
  const name = "absence";

  const make = (value, options) =>
    validateSchema(value, [{ name, options: [{ message, ...options }] }]);

  it("when value is not empty", () => {
    const value = "not empty";
    const options = {};
    expect(make(value, options)).toBe(fail);
  });

  it("when value is only spaces", () => {
    const value = "   ";
    const options = {};
    expect(make(value, options)).toBe(pass);
  });

  it("when value is empty", () => {
    const value = "";
    const options = {};
    expect(make(value, options)).toBe(pass);
  });

  it("when value is null from non-selected multi-select element", () => {
    const value = "";
    const options = {};
    expect(make(value, options)).toBe(pass);
  });

  it("when value is not null from multi-select element", () => {
    const value = "selected-option";
    const options = {};
    expect(make(value, options)).toBe(fail);
  });

  it("when value is null from select element", () => {
    const value = "";
    const options = {};
    expect(make(value, options)).toBe(pass);
  });

  it("when value is not null from select element", () => {
    const value = "selected-option";
    const options = {};
    expect(make(value, options)).toBe(fail);
  });
});

describe("validation acceptance", () => {
  const name = "acceptance";
  const make = (value, options) =>
    validateSchema(value, [{ name, options: [{ message, ...options }] }]);

  it("when checkbox and checked", () => {
    const value = true;
    const options = {};
    expect(make(value, options)).toBe(pass);
  });

  it("when checkbox and not checked", () => {
    const value = false;
    const options = {};
    expect(make(value, options)).toBe(fail);
  });

  it("when text and value default of 1", () => {
    const value = "1";
    const options = {};
    expect(make(value, options)).toBe(pass);
  });

  it("when text and value 1 and accept value is 1", () => {
    const value = "1";
    const options = { accept: 1 };
    expect(make(value, options)).toBe(pass);
  });

  it("when text and value empty", () => {
    const value = "";
    const options = {};
    expect(make(value, options)).toBe(fail);
  });

  it("when text and value 1 and accept value is 2", () => {
    const value = "1";
    const options = { accept: 2 };
    expect(make(value, options)).toBe(fail);
  });
});

describe("validation confirmation", () => {
  const name = "confirmation";

  const make = (value, options) =>
    validateSchema(value, [{ name, options: [{ message, ...options }] }]);

  it("when values match (case sensitive)", () => {
    const value = "test";
    const options = { confirmation: "test" };
    expect(make(value, options)).toBe(pass);
  });

  it("when values do not match", () => {
    const value = "test";
    const options = { confirmation: "bad test" };
    expect(make(value, options)).toBe(fail);
  });

  it("when values match (case insensitive)", () => {
    const value = "tEsT";
    const options = { confirmation: "test" };
    expect(make(value, options)).toBe(pass);
  });

  it("when values contain special characters", () => {
    const value = "te+st";
    const options = { confirmation: "te+st" };
    expect(make(value, options)).toBe(pass);
  });
});

describe("validation exclusion", () => {
  const name = "exclusion";

  const make = (value, options) =>
    validateSchema(value, [{ name, options: [{ message, ...options }] }]);

  it("when value is not in the list", () => {
    const value = "4";
    const options = { in: [1, 2, 3] };
    expect(make(value, options)).toBe(pass);
  });

  it("when value is not in the range", () => {
    const value = "4";
    const options = { range: [1, 3] };
    expect(make(value, options)).toBe(pass);
  });

  it("when value is in the list", () => {
    const value = "1";
    const options = { in: [1, 2, 3] };
    expect(make(value, options)).toBe(fail);
  });

  it("when value is in the range", () => {
    const value = "1";
    const options = { range: [1, 3] };
    expect(make(value, options)).toBe(fail);
  });

  it("when allowing blank", () => {
    const value = "";
    const options = { in: [1, 2, 3], allow_blank: true };
    expect(make(value, options)).toBe(pass);
  });

  it("when not allowing blank", () => {
    const value = "";
    const options = { in: [1, 2, 3] };
    expect(make(value, options)).toBe(fail);
  });
});

describe("validation format", () => {
  const name = "format";

  const make = (value, options) =>
    validateSchema(value, [{ name, options: [{ message, ...options }] }]);

  it("when matching format", () => {
    const value = "123";
    const options = { with: /\d+/ };
    expect(make(value, options)).toBe(pass);
  });

  it("when not matching format", () => {
    const value = "abc";
    const options = { with: /\d+/ };
    expect(make(value, options)).toBe(fail);
  });

  it("when allowing blank", () => {
    const value = "";
    const options = { with: /\d+/, allow_blank: true };
    expect(make(value, options)).toBe(pass);
  });

  it("when not allowing blank", () => {
    const value = "";
    const options = { with: /\d+/ };
    expect(make(value, options)).toBe(fail);
  });

  it("when using the without option and the Regex is matched", () => {
    const value = "Rock";
    const options = { without: /R/ };
    expect(make(value, options)).toBe(fail);
  });

  it("when using the without option and the Regex is not matched", () => {
    const value = "Lock";
    const options = { without: /R/ };
    expect(make(value, options)).toBe(pass);
  });
});

describe("validation inclusion", () => {
  const name = "inclusion";

  const make = (value, options) =>
    validateSchema(value, [{ name, options: [{ message, ...options }] }]);

  it("when value is in the list", () => {
    const value = "1";
    const options = { in: [1, 2, 3] };
    expect(make(value, options)).toBe(pass);
  });

  it("when value is in the range", () => {
    const value = "1";
    const options = { range: [1, 3] };
    expect(make(value, options)).toBe(pass);
  });

  it("when value is not in the list", () => {
    const value = "4";
    const options = { in: [1, 2, 3] };
    expect(make(value, options)).toBe(fail);
  });

  it("when value is not in the range", () => {
    const value = "4";
    const options = { range: [1, 3] };
    expect(make(value, options)).toBe(fail);
  });

  it("when allowing blank", () => {
    const value = "";
    const options = { in: [1, 2, 3], allow_blank: true };
    expect(make(value, options)).toBe(pass);
  });

  it("when not allowing blank", () => {
    const value = "";
    const options = { in: [1, 2, 3] };
    expect(make(value, options)).toBe(fail);
  });
});

describe("validation length", () => {
  const name = "length";

  const make = (value, options) =>
    validateSchema(value, [{ name, options: [options] }]);

  it("when allowed length is 3 and value length is 3", () => {
    const value = "123";
    const options = { messages: { is: message }, is: 3 };
    expect(make(value, options)).toBe(pass);
  });

  it("when allowed length is 3 and value length is 4", () => {
    const value = "1234";
    const options = { messages: { is: message }, is: 3 };
    expect(make(value, options)).toBe(fail);
  });

  it("when allowed length is 3 and value length is 2", () => {
    const value = "12";
    const options = { messages: { is: message }, is: 3 };
    expect(make(value, options)).toBe(fail);
  });

  it("when allowing blank and allowed length is 3", () => {
    const value = "";
    const options = { messages: { is: message }, is: 3, allow_blank: true };
    expect(make(value, options)).toBe(pass);
  });

  it("when allowing blank and minimum length is 3 and maximum length is 100", () => {
    const value = "";
    const options = {
      messages: {
        minimum: "failed minimum validation",
        maximum: "failed maximum validation",
      },
      minimum: 3,
      maximum: 100,
      allow_blank: true,
    };
    expect(make(value, options)).toBe(pass);
  });

  it("when not allowing blank and allowed length is 3", () => {
    const value = "";
    const options = { messages: { is: message }, is: 3 };
    expect(make(value, options)).toBe(fail);
  });

  it("when allowed length minimum is 3 and value length is 3", () => {
    const value = "123";
    const options = { messages: { is: message }, is: 3 };
    expect(make(value, options)).toBe(pass);
  });

  it("when allowed length minimum is 3 and value length is 2", () => {
    const value = "12";
    const options = { messages: { minimum: message }, minimum: 3 };
    expect(make(value, options)).toBe(fail);
  });

  it("when allowed length maximum is 3 and value length is 3", () => {
    const value = "123";
    const options = { messages: { is: message }, is: 3 };
    expect(make(value, options)).toBe(pass);
  });

  it("when allowed length maximum is 3 and value length is 4", () => {
    const value = "1234";
    const options = { messages: { maximum: message }, maximum: 3 };
    expect(make(value, options)).toBe(fail);
  });
});

describe("validation numericality", () => {
  const name = "numericality";

  const make = (value, options) =>
    validateSchema(value, [{ name, options: [options] }]);

  it("when value is a number", () => {
    const value = "123";
    const options = { messages: { numericality: message } };
    expect(make(value, options)).toBe(pass);
  });

  it("when value is a decimal number", () => {
    const value = "123.456";
    const options = { messages: { numericality: message } };
    expect(make(value, options)).toBe(pass);
  });

  it("when value is not a number", () => {
    const value = "abc123";
    const options = { messages: { numericality: message } };
    expect(make(value, options)).toBe(fail);
  });

  it("when no value", () => {
    const value = "";
    const options = { messages: { numericality: message } };
    expect(make(value, options)).toBe(fail);
  });

  it("when no value and allowing blank", () => {
    const value = "";
    const options = { messages: { numericality: message }, allow_blank: true };
    expect(make(value, options)).toBe(pass);
  });

  it("when bad value and allowing blank", () => {
    const value = "abc123";
    const options = { messages: { numericality: message }, allow_blank: true };
    expect(make(value, options)).toBe(fail);
  });

  it("when only allowing integers and allowing blank", () => {
    const value = "";
    const options = {
      messages: { only_integer: message, numericality: message },
      only_integer: true,
      allow_blank: true,
    };
    expect(make(value, options)).toBe(pass);
  });

  it("when only allowing integers and value is integer", () => {
    const value = "123";
    const options = {
      messages: { only_integer: message, numericality: message },
      only_integer: true,
    };
    expect(make(value, options)).toBe(pass);
  });

  it("when only allowing integers and value is integer with whitespace", () => {
    const value = " 123 ";
    const options = {
      messages: { only_integer: message, numericality: message },
      only_integer: true,
    };
    expect(make(value, options)).toBe(pass);
  });

  it("when only allowing integers and value has a positive sign", () => {
    const value = "+23";
    const options = {
      messages: { only_integer: message, numericality: message },
      only_integer: true,
    };
    expect(make(value, options)).toBe(pass);
  });

  it("when only allowing integers and value has a negative sign", () => {
    const value = "-23";
    const options = {
      messages: { only_integer: message, numericality: message },
      only_integer: true,
    };
    expect(make(value, options)).toBe(pass);
  });
  it("when only allowing integers and value is not integer", () => {
    const value = "123.456";
    const options = {
      messages: { only_integer: message, numericality: message },
      only_integer: true,
    };
    expect(make(value, options)).toBe(fail);
  });

  it("when only allowing integers and value has a delimiter", () => {
    const value = "10,000";
    const options = {
      messages: { only_integer: message, numericality: message },
      only_integer: true,
    };
    expect(make(value, options)).toBe(fail);
  });

  it("when only allowing values greater than 10 and value is greater than 10", () => {
    const value = "11";
    const options = {
      messages: { greater_than: message, numericality: message },
      greater_than: 10,
    };
    expect(make(value, options)).toBe(pass);
  });

  it("when only allowing values greater than 10 and value is 10", () => {
    const value = "10";
    const options = {
      messages: { greater_than: message, numericality: message },
      greater_than: 10,
    };
    expect(make(value, options)).toBe(fail);
  });

  it("when only allowing values greater than or equal to 10 and value is 10", () => {
    const value = "10";
    const options = {
      messages: { greater_than_or_equal_to: message, numericality: message },
      greater_than_or_equal_to: 10,
    };
    expect(make(value, options)).toBe(pass);
  });

  it("when only allowing values greater than or equal to 10 and value is 9", () => {
    const value = "9";
    const options = {
      messages: { greater_than_or_equal_to: message, numericality: message },
      greater_than_or_equal_to: 10,
    };
    expect(make(value, options)).toBe(fail);
  });

  it("when only allowing values less than 10 and value is less than 10", () => {
    const value = "9";
    const options = {
      messages: { less_than: message, numericality: message },
      less_than: 10,
    };
    expect(make(value, options)).toBe(pass);
  });

  it("when only allowing values less than 10 and value is 10", () => {
    const value = "10";
    const options = {
      messages: { less_than: message, numericality: message },
      less_than: 10,
    };
    expect(make(value, options)).toBe(fail);
  });

  it("when only allowing values less than or equal to 10 and value is 10", () => {
    const value = "10";
    const options = {
      messages: { less_than_or_equal_to: message, numericality: message },
      less_than_or_equal_to: 10,
    };
    expect(make(value, options)).toBe(pass);
  });

  it("when only allowing values less than or equal to 10 and value is 11", () => {
    const value = "11";
    const options = {
      messages: { less_than_or_equal_to: message, numericality: message },
      less_than_or_equal_to: 10,
    };
    expect(make(value, options)).toBe(fail);
  });

  it("when only allowing values equal to 10 and value is 10", () => {
    const value = "10";
    const options = {
      messages: { equal_to: message, numericality: message },
      equal_to: 10,
    };
    expect(make(value, options)).toBe(pass);
  });

  it("when only allowing values equal to 10 and value is 11", () => {
    const value = "11";
    const options = {
      messages: { equal_to: message, numericality: message },
      equal_to: 10,
    };
    expect(make(value, options)).toBe(fail);
  });

  it("when only allowing value equal to 0 and value is 1", () => {
    const value = "1";
    const options = {
      messages: { equal_to: message, numericality: message },
      equal_to: 0,
    };
    expect(make(value, options)).toBe(fail);
  });

  it("when only allowing odd values and the value is odd", () => {
    const value = "11";
    const options = {
      messages: { odd: message, numericality: message },
      odd: true,
    };
    expect(make(value, options)).toBe(pass);
  });

  it("when only allowing odd values and the value is even", () => {
    const value = "10";
    const options = {
      messages: { odd: message, numericality: message },
      odd: true,
    };
    expect(make(value, options)).toBe(fail);
  });

  it("when only allowing even values and the value is even", () => {
    const value = "10";
    const options = {
      messages: { even: message, numericality: message },
      even: true,
    };
    expect(make(value, options)).toBe(pass);
  });

  it("when only allowing even values and the value is odd", () => {
    const value = "11";
    const options = {
      messages: { even: message, numericality: message },
      even: true,
    };
    expect(make(value, options)).toBe(fail);
  });
});

describe("validation presence", () => {
  const name = "presence";

  const make = (value, options) =>
    validateSchema(value, [{ name, options: [{ message, ...options }] }]);

  it("when value is not empty", () => {
    const value = "not empty";
    const options = {};
    expect(make(value, options)).toBe(pass);
  });

  it("when value is empty", () => {
    const value = "";
    const options = {};
    expect(make(value, options)).toBe(fail);
  });

  it("when value is null from non-selected multi-select element", () => {
    const value = "";
    const options = {};
    expect(make(value, options)).toBe(fail);
  });
});

describe("validation uniqueness", () => {
  const name = "uniqueness";

  const make = (value, options) =>
    validateSchema(value, [{ name, options: [{ message, ...options }] }]);

  it("uniqueness cannot be tested", () => {
    const value = true;
    const options = {};
    expect(make(value, options)).toBe(pass);
  });
});
