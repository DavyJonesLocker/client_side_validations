const NUMBER_FORMAT = { separator: ".", delimiter: "," };
const NUMERICALITY_DEFAULT = new RegExp(
  "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?$"
);
const NUMERICALITY_ONLY_INTEGER = new RegExp("^[+-]?\\d+$");

class ClientSideValidations {
  absence(value = "", options = {}) {
    if (!/^\s*$/.test(value)) {
      return options.message;
    }
    return null;
  }

  presence(value = "", options = {}) {
    if (/^\s*$/.test(value)) {
      return options.message;
    }
    return null;
  }

  acceptance(value = true, options = {}) {
    if (typeof value === "boolean") {
      if (value !== true) {
        return options.message;
      }
    }

    let ref;

    if (typeof value === "string") {
      if (
        value !==
        (((ref = options.accept) != null ? ref.toString() : void 0) || "1")
      ) {
        return options.message;
      }
    }

    return null;
  }

  format(value = "", options = {}) {
    const message = this.presence(value, options);
    if (message) {
      if (options.allow_blank === true) {
        return null;
      }
      return message;
    }

    if (
      options.with &&
      !new RegExp(options.with.source, options.with.options).test(value)
    ) {
      return options.message;
    }

    if (
      options.without &&
      new RegExp(options.without.source, options.without.options).test(value)
    ) {
      return options.message;
    }

    return null;
  }

  numericality(value = "", options = {}) {
    if (
      options.allow_blank === true &&
      this.presence(value, { message: options.messages.numericality })
    ) {
      return null;
    }

    value = value
      .trim()
      .replace(new RegExp("\\" + NUMBER_FORMAT.separator, "g"), ".");

    if (options.only_integer && !NUMERICALITY_ONLY_INTEGER.test(value)) {
      return options.messages.only_integer;
    }

    if (!NUMERICALITY_DEFAULT.test(value)) {
      return options.messages.numericality;
    }

    const NUMERICALITY_CHECKS = {
      greater_than(a, b) {
        return a > b;
      },
      greater_than_or_equal_to(a, b) {
        return a >= b;
      },
      equal_to(a, b) {
        return a === b;
      },
      less_than(a, b) {
        return a < b;
      },
      less_than_or_equal_to(a, b) {
        return a <= b;
      },
    };

    for (var check in NUMERICALITY_CHECKS) {
      const check_function = NUMERICALITY_CHECKS[check];
      if (options[check] != null) {
        const checkValue = (() => {
          if (!isNaN(parseFloat(options[check])) && isFinite(options[check])) {
            return options[check];
          }
        })();

        if (checkValue == null || checkValue === "") {
          return null;
        }

        if (!check_function(parseFloat(value), parseFloat(checkValue))) {
          return options.messages[check];
        }
      }
    }

    if (options.odd && !(parseInt(value, 10) % 2)) {
      return options.messages.odd;
    }

    if (options.even && parseInt(value, 10) % 2) {
      return options.messages.even;
    }

    return null;
  }

  length(value = "", options = {}) {
    const { length } = value;
    const LENGTH_CHECKS = {
      is(a, b) {
        return a === b;
      },
      minimum(a, b) {
        return a >= b;
      },
      maximum(a, b) {
        return a <= b;
      },
    };
    const blankOptions = {};
    blankOptions.message = (() => {
      if (options.is) {
        return options.messages.is;
      } else if (options.minimum) {
        return options.messages.minimum;
      }
    })();

    const message = this.presence(value, blankOptions);
    if (message) {
      if (options.allow_blank === true) {
        return null;
      }
      return message;
    }

    for (let check in LENGTH_CHECKS) {
      const check_function = LENGTH_CHECKS[check];
      if (options[check]) {
        if (!check_function(length, parseInt(options[check]))) {
          return options.messages[check];
        }
      }
    }

    return null;
  }

  exclusion(value = "", options = {}) {
    const message = this.presence(value, options);
    if (message) {
      if (options.allow_blank === true) {
        return null;
      }
      return message;
    }

    if (options.in) {
      let needle;
      if (
        ((needle = value),
        Array.from(
          Array.from(options.in).map((option) => option.toString())
        ).includes(needle))
      ) {
        return options.message;
      }
    }

    if (options.range) {
      const lower = options.range[0];
      const upper = options.range[1];
      if (value >= lower && value <= upper) {
        return options.message;
      }
    }

    return null;
  }

  inclusion(value = "", options = {}) {
    const message = this.presence(value, options);
    if (message) {
      if (options.allow_blank === true) {
        return null;
      }
      return message;
    }

    if (options.in) {
      let needle;
      if (
        ((needle = value),
        Array.from(
          Array.from(options.in).map((option) => option.toString())
        ).includes(needle))
      ) {
        return null;
      }
      return options.message;
    }

    if (options.range) {
      const lower = options.range[0];
      const upper = options.range[1];
      if (value >= lower && value <= upper) {
        return null;
      }
      return options.message;
    }
  }

  confirmation(value = "", options = { confirmation: "" }) {
    if (value.toLowerCase() !== options.confirmation.toLowerCase()) {
      return options.message;
    }
    return null;
  }

  // eslint-disable-next-line no-unused-vars
  uniqueness(value = "", options = {}) {
    // Impossible to test locally, always return null
    return null;
  }
}

export default ClientSideValidations;
