function add() {
  if (Math.random() < 0.9) {
    return {
      errcode: 0,
      errmsg: "",
      data: {}
    };
  } else {
    return {
      errcode: "100003",
      errmsg: "提交内容有误，请检查",
      data: {}
    };
  }
}

module.exports = add;
