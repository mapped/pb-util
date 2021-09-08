const geojsonStruct = {
  fields: {
    type: {
      kind: {
        $case: "stringValue",
        stringValue: "Polygon",
      },
    },
    coordinates: {
      kind: {
        $case: "listValue",
        listValue: {
          values: [
            {
              kind: {
                $case: "listValue",
                listValue: {
                  values: [
                    {
                      kind: {
                        $case: "listValue",
                        listValue: {
                          values: [
                            {
                              kind: {
                                $case: "numberValue",
                                numberValue: -117.291815,
                              },
                            },
                            {
                              kind: {
                                $case: "numberValue",
                                numberValue: 32.868376,
                              },
                            },
                          ],
                        },
                      },
                    },
                    {
                      kind: {
                        $case: "listValue",
                        listValue: {
                          values: [
                            {
                              kind: {
                                $case: "numberValue",
                                numberValue: -117.291815,
                              },
                            },
                            {
                              kind: {
                                $case: "numberValue",
                                numberValue: 32.868457,
                              },
                            },
                          ],
                        },
                      },
                    },
                    {
                      kind: {
                        $case: "listValue",
                        listValue: {
                          values: [
                            {
                              kind: {
                                $case: "numberValue",
                                numberValue: -117.291215,
                              },
                            },
                            {
                              kind: {
                                $case: "numberValue",
                                numberValue: 32.868457,
                              },
                            },
                          ],
                        },
                      },
                    },
                    {
                      kind: {
                        $case: "listValue",
                        listValue: {
                          values: [
                            {
                              kind: {
                                $case: "numberValue",
                                numberValue: -117.291215,
                              },
                            },
                            {
                              kind: {
                                $case: "numberValue",
                                numberValue: 32.868376,
                              },
                            },
                          ],
                        },
                      },
                    },
                    {
                      kind: {
                        $case: "listValue",
                        listValue: {
                          values: [
                            {
                              kind: {
                                $case: "numberValue",
                                numberValue: -117.291815,
                              },
                            },
                            {
                              kind: {
                                $case: "numberValue",
                                numberValue: 32.868376,
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  },
} as any;

const geojson = {
  type: "Polygon",
  coordinates: [
    [
      [-117.291815, 32.868376],
      [-117.291815, 32.868457],
      [-117.291215, 32.868457],
      [-117.291215, 32.868376],
      [-117.291815, 32.868376],
    ],
  ],
};

export { geojson, geojsonStruct };
