function login() {
  if (Math.random() < 0.9) {
    return {
      errcode: 0,
      errmsg: "",
      data: {
        name: "abc", // 真名
        role: 7, // 角色
        department: "where", // 所属部门
        isGlobal: false, //部门是否属于global
        phone: "12345678911" // 电话
      }
    };
  } else {
    return {
      errcode: "100003",
      errmsg: "登录过期",
      data: {}
    };
  }
}

module.exports = login;
