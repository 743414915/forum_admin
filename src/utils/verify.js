const regs = {
  email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
  number: /^([0]|[1-9][0-9]*)$/,
  password: /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^.&*_]{8,50}$/
}

const verify = (rule, value, reg, callback) => {
  if (!callback) {
    return;
  }
  if (value) {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error(rule.message))
    }
  } else {
    callback();
  }
}


const verifyObj = {
  email: (rule, value, callback) => {
    return verify(rule, value, regs.email, callback);
  },
  number: (rule, value, callback) => {
    return verify(rule, value, regs.number, callback);
  },
  password: (rule, value, callback) => {
    return verify(rule, value, regs.password, callback);
  },
}

export default verifyObj;