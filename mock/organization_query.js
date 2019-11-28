function query() {
  return {
    errcode: 0,
    errmsg: "",
    data: [
      {
        key: 1,
        label: "一级 1",
        children: [
          {
            key: 4,
            label: "二级 1-1",
            children: [
              {
                key: 9,
                label: "三级 1-1-1"
              },
              {
                key: 10,
                label: "三级 1-1-2"
              }
            ]
          }
        ]
      },
      {
        key: 2,
        label: "一级 2",
        children: [
          {
            key: 5,
            label: "二级 2-1"
          },
          {
            key: 6,
            label: "二级 2-2"
          }
        ]
      },
      {
        key: 3,
        label: "一级 3",
        children: [
          {
            key: 7,
            label: "二级 3-1"
          },
          {
            key: 8,
            label: "二级 3-2"
          }
        ]
      }
    ]
  };
}

module.exports = query;
