function query() {
  return {
    errcode: 0,
    errmsg: "",
    data: {
      department: [
        { label: "a", value: "a" },
        { label: "b", value: "b" },
        { label: "c", value: "c" },
        { label: "d", value: "d" }
      ],
      equipment: [
        { label: "a", value: "a" },
        { label: "b", value: "b" },
        { label: "c", value: "c" },
        { label: "d", value: "d" }
      ]
    }
  };
}
module.exports = query;
