function login() {
  if (Math.random() < 0.9) {
    return {
      errcode: 0,
      errmsg: "",
      data: {
        token: "111",
        user: {
          name: "abc", // 真名
          role: 7, // 角色
          department: "where", // 所属部门
          isGlobal: false, //部门是否属于global
          phone: "12345678911" // 电话
        }
      }
    };
  } else {
    return {
      errcode: "100003",
      errmsg: "提交内容有误，请检查",
      data: {}
    };
  }
}

module.exports = login;
