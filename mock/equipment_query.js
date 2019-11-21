function query() {
  return {
    errcode: 0,
    errmsg: "",
    data: [
      {
        key: "1",
        category: "笔记本电脑",
        brand: "苹果",
        modelNumber: "123456",
        serialNumber: "56712398",
        status: 1,
        guarantee: "12",
        purchasingTime: "2019-08-01",
        price: 12345,
        admin: "aa",
        user: "bb",
        department: "调度热线中心",
        delFlag: false
      },
      {
        key: "2",
        category: "台式电脑",
        brand: "联想",
        modelNumber: "123456",
        serialNumber: "56712398",
        status: 0,
        guarantee: "12",
        purchasingTime: "2019-08-05",
        price: 12345,
        admin: "aa",
        user: "bb",
        department: "调度热线中心",
        delFlag: false
      },
      {
        key: "3",
        category: "笔记本电脑",
        brand: "苹果",
        modelNumber: "123456",
        serialNumber: "56712398",
        status: 0,
        guarantee: "24",
        purchasingTime: "2019-08-01",
        price: 12345,
        admin: "aa",
        user: "bb",
        department: "拱北供水所",
        delFlag: false
      }
    ]
  };
}

module.exports = query;
