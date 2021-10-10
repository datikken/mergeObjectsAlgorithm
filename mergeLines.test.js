const { mergeLines, recursion } = require('./mergeLines');

test('The same rows - should return array with 1 object', () => {
  let rowA = [
    {
      "ida_tag": [
        "A",
        "B"
      ],
      "ida_country": [
        "RU"
      ],
      "ida_region": [
        "A",
        "B"
      ],
      "ida_os": [
        "M",
        "W"
      ],
      "na_device_format": [
        "T",
        "P"
      ]
    }
  ];
  let rowB = [
    {
      "ida_tag": [
        "A",
        "B"
      ],
      "ida_country": [
        "RU"
      ],
      "ida_region": [
        "A",
        "B"
      ],
      "ida_os": [
        "M",
        "W"
      ],
      "na_device_format": [
        "T",
        "P"
      ]
    }
  ];
  const res = mergeLines(rowA, rowB[0])
  expect(res[0].ida_os).toStrictEqual(rowB[0].ida_os)
});
test('Row A contains row B - should return array with 1 object', () => {
  let rowA = [
    {
    "ida_tag": [
      "B",
      "A"
    ],
    "ida_country": [
      "RU",
      "ES"
    ],
    "ida_region": [
      "A",
      "B"
    ],
    "ida_os": [
      "M",
      "W"
    ],
    "na_device_format": [
      "T",
      "P"
    ]
  }
  ];
  let rowB = [
    {
    "ida_tag": [
      "B"
    ],
    "ida_country": [
      "RU",
      "ES"
    ],
    "ida_region": [
      "A",
      "B"
    ],
    "ida_os": [
      "M",
      "W"
    ],
    "na_device_format": [
      "T"
    ]
  }
  ];
  const res = mergeLines(rowA, rowB[0]);
  expect(res[0].ida_tag.length).toBe(2);
});
test('Row B contains row A', () => {
  let rowA = [
    {
    "ida_tag": [
      "A"
    ],
    "ida_country": [
      "RU"
    ],
    "ida_region": [
      "A",
      "B"
    ],
    "ida_os": [
      "W"
    ],
    "na_device_format": [
      "P"
    ]
  }];
  let rowB = [{
    "ida_tag": [
      "A",
      "B"
    ],
    "ida_country": [
      "RU",
      "ES"
    ],
    "ida_region": [
      "A",
      "B"
    ],
    "ida_os": [
      "M",
      "W"
    ],
    "na_device_format": [
      "T",
      "P"
    ]
  }];
  const res = mergeLines(rowA, rowB[0]);
  expect(res.length).toBe(1)
});
test('Rows can be merged by one param', () => {
  let rowA = [{
    "ida_tag": [
      "C",
      "D"
    ],
    "ida_country": [
      "RU",
      "ES"
    ],
    "ida_region": [
      "A",
      "B"
    ],
    "ida_os": [
      "M",
      "W"
    ],
    "na_device_format": [
      "T",
      "P"
    ]
  }];
  let rowB = [{
    "ida_tag": [
      "A",
      "B"
    ],
    "ida_country": [
      "RU",
      "ES"
    ],
    "ida_region": [
      "A",
      "B"
    ],
    "ida_os": [
      "M",
      "W"
    ],
    "na_device_format": [
      "T",
      "P"
    ]
  }];
  const res = mergeLines(rowA, rowB[0]);
  expect(res.length).toBe(1);
});
test('Both rows contains each other', () => {
  let rowA = [{
      "ida_tag": [
        "A",
        "B"
      ],
      "ida_country": [
        "RU"
      ],
      "ida_region": [
        "A",
        "B"
      ],
      "ida_os": [
        "M",
        "W"
      ],
      "na_device_format": [
        "T",
        "P"
      ]
    }];
  let rowB = [{
      "ida_tag": [
        "A",
        "B"
      ],
      "ida_country": [
        "RU",
        "ES"
      ],
      "ida_region": [
        "A",
        "B"
      ],
      "ida_os": [
        "M"
      ],
      "na_device_format": [
        "T",
        "P"
      ]
    }];
  const res = mergeLines(rowA[0], rowB[0]);
  expect(res.length).toBe(2);
});
test('Row A contains empty param, case 1', () => {
  let rowA = [{
    "ida_tag": [
      "A",
      "B"
    ],
    "ida_country": [],
    "ida_region": [
      "A",
      "B"
    ],
    "ida_os": [
      "M",
      "W"
    ],
    "na_device_format": [
      "T",
      "P"
    ]
  }]
  let rowB = [{
    "ida_tag": [
      "A",
      "B"
    ],
    "ida_country": [
      "RU"
    ],
    "ida_region": [
      "A",
      "B"
    ],
    "ida_os": [
      "M",
      "W"
    ],
    "na_device_format": [
      "T",
      "P"
    ]
  }];
  const res = mergeLines(rowA, rowB[0]);
  expect(res.length).toBe(1);
  expect(res[0].ida_country).toEqual(rowB[0].ida_country)
});
test('Row A contains empty param, case 2', () => {
  let rowA = [{
    "ida_tag": [
      "A"
    ],
    "ida_country": [],
    "ida_region": [
      "A",
      "B"
    ],
    "ida_os": [
      "M",
      "W"
    ],
    "na_device_format": [
      "T",
      "P"
    ]
  }]
  let rowB = [{
    "ida_tag": [
      "A",
      "B"
    ],
    "ida_country": [
      "RU"
    ],
    "ida_region": [
      "A",
      "B"
    ],
    "ida_os": [
      "M",
      "W"
    ],
    "na_device_format": [
      "T",
      "P"
    ]
  }];
  const res = mergeLines(rowA[0], rowB[0]);
  expect(res.length).toBe(2);
});
test('Row B contains empty param, case 1', () => {
  let rowA = [ {
    "ida_tag": [
      "A",
      "B"
    ],
    "ida_country": [
      "RU"
    ],
    "ida_region": [
      "A",
      "B"
    ],
    "ida_os": [
      "M",
      "W"
    ],
    "na_device_format": [
      "T",
      "P"
    ]
  }];
  let rowB = [{
    "ida_tag": [
      "A",
      "B"
    ],
    "ida_country": [
      "RU"
    ],
    "ida_region": [
      "A",
      "B"
    ],
    "ida_os": [],
    "na_device_format": [
      "T",
      "P"
    ]
  }];

  const res = mergeLines(rowA, rowB[0]);
  expect(res[0].ida_os).toBe(rowB[0].ida_os);
});
test('Row B contains empty param, case 2', () => {
  let rowA = [  {
    "ida_tag": [
      "A",
      "B"
    ],
    "ida_country": [
      "RU"
    ],
    "ida_region": [
      "A",
      "B"
    ],
    "ida_os": [
      "M",
      "W"
    ],
    "na_device_format": [
      "T"
    ]
  }]
  let rowB = [ {
    "ida_tag": [
      "A",
      "B"
    ],
    "ida_country": [
      "RU"
    ],
    "ida_region": [
      "A",
      "B"
    ],
    "ida_os": [],
    "na_device_format": [
      "T",
      "P"
    ]
  }];
  const res = mergeLines(rowA, rowB[0]);
  expect(res.length).toBe(1);
});
test('Test rucursion', () => {
  let rowA = [
    {
      "ida_tag": [
        "A"
      ],
      "ida_country": [],
      "ida_region": [
        "A",
        "B"
      ],
      "ida_os": [
        "M",
        "W"
      ],
      "na_device_format": [
        "T",
        "P"
      ]
    },
    {
      "ida_tag": [
        "A", "B"
      ],
      "ida_country": [],
      "ida_region": [
        "A",
        "B"
      ],
      "ida_os": [
        "M",
        "W"
      ],
      "na_device_format": [
        "T",
        "P"
      ]
    }
  ];
  let rowB = [
    {
      "ida_tag": [
        "D"
      ],
      "ida_country": [],
      "ida_region": [
        "A",
        "B"
      ],
      "ida_os": [
        "M",
        "W"
      ],
      "na_device_format": [
        "T",
        "P"
      ]
    }
  ];

  const res = mergeLines(rowA, rowB[0]);
  let recursed = recursion(res, mergeLines);

  expect(recursed.length).toBe(1)
});