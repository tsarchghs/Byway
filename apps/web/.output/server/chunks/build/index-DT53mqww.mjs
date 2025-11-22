import { defineComponent, ref, computed, resolveComponent, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(false);
    const rows = ref([]);
    const cols = [
      { title: "Course", dataIndex: "courseTitle", key: "courseTitle" },
      { title: "Assignment", dataIndex: "assignmentTitle", key: "assignmentTitle" },
      {
        title: "Score",
        key: "score",
        customRender: ({ record }) => {
          if (record.score == null || record.maxScore == null) return "–";
          return `${record.score} / ${record.maxScore}`;
        }
      },
      {
        title: "Percentage",
        key: "percentage",
        customRender: ({ record }) => {
          if (record.percentage == null) return "–";
          return record.percentage.toFixed(1) + "%";
        }
      },
      { title: "Letter", dataIndex: "letter", key: "letter" },
      { title: "Updated at", dataIndex: "updatedAt", key: "updatedAt" }
    ];
    const summary = computed(() => {
      if (!rows.value.length) {
        return {
          avgPct: null,
          bestCourse: null,
          lastUpdated: null
        };
      }
      const byCourse = {};
      let lastUpdated = null;
      for (const r of rows.value) {
        const pct = typeof r.percentage === "number" ? r.percentage : null;
        if (pct != null) {
          const key = r.courseTitle || r.courseId;
          if (!byCourse[key]) byCourse[key] = { pctSum: 0, count: 0 };
          byCourse[key].pctSum += pct;
          byCourse[key].count++;
        }
        if (r.updatedAt && (!lastUpdated || r.updatedAt > lastUpdated)) {
          lastUpdated = r.updatedAt;
        }
      }
      const courseEntries = Object.entries(byCourse);
      const bestCourse = courseEntries.length > 0 ? courseEntries.sort(
        (a, b) => b[1].pctSum / b[1].count - a[1].pctSum / a[1].count
      )[0][0] : null;
      const allPcts = [];
      for (const r of rows.value) {
        if (typeof r.percentage === "number") allPcts.push(r.percentage);
      }
      const avgPct = allPcts.length > 0 ? allPcts.reduce((a, b) => a + b, 0) / allPcts.length : null;
      return {
        avgPct,
        bestCourse,
        lastUpdated
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_table = resolveComponent("a-table");
      _push(ssrRenderComponent(_component_a_layout, mergeProps({ class: "p-6" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_page_header, {
              title: "My Gradebook",
              "sub-title": "Overview of your courses, assignments, and grades"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_space, {
              direction: "vertical",
              style: { "width": "100%" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_row, { gutter: 16 }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_col, {
                          xs: 24,
                          md: 8
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_card, {
                                size: "small",
                                title: "Summary"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<p${_scopeId5}><strong${_scopeId5}>Total entries:</strong> ${ssrInterpolate(rows.value.length)}</p><p${_scopeId5}><strong${_scopeId5}>Average %:</strong> ${ssrInterpolate(summary.value.avgPct?.toFixed(1) ?? "–")}%</p><p${_scopeId5}><strong${_scopeId5}>Best course:</strong> ${ssrInterpolate(summary.value.bestCourse || "–")}</p><p${_scopeId5}><strong${_scopeId5}>Last updated:</strong> ${ssrInterpolate(summary.value.lastUpdated || "–")}</p>`);
                                  } else {
                                    return [
                                      createVNode("p", null, [
                                        createVNode("strong", null, "Total entries:"),
                                        createTextVNode(" " + toDisplayString(rows.value.length), 1)
                                      ]),
                                      createVNode("p", null, [
                                        createVNode("strong", null, "Average %:"),
                                        createTextVNode(" " + toDisplayString(summary.value.avgPct?.toFixed(1) ?? "–") + "%", 1)
                                      ]),
                                      createVNode("p", null, [
                                        createVNode("strong", null, "Best course:"),
                                        createTextVNode(" " + toDisplayString(summary.value.bestCourse || "–"), 1)
                                      ]),
                                      createVNode("p", null, [
                                        createVNode("strong", null, "Last updated:"),
                                        createTextVNode(" " + toDisplayString(summary.value.lastUpdated || "–"), 1)
                                      ])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_card, {
                                  size: "small",
                                  title: "Summary"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("p", null, [
                                      createVNode("strong", null, "Total entries:"),
                                      createTextVNode(" " + toDisplayString(rows.value.length), 1)
                                    ]),
                                    createVNode("p", null, [
                                      createVNode("strong", null, "Average %:"),
                                      createTextVNode(" " + toDisplayString(summary.value.avgPct?.toFixed(1) ?? "–") + "%", 1)
                                    ]),
                                    createVNode("p", null, [
                                      createVNode("strong", null, "Best course:"),
                                      createTextVNode(" " + toDisplayString(summary.value.bestCourse || "–"), 1)
                                    ]),
                                    createVNode("p", null, [
                                      createVNode("strong", null, "Last updated:"),
                                      createTextVNode(" " + toDisplayString(summary.value.lastUpdated || "–"), 1)
                                    ])
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_col, {
                          xs: 24,
                          md: 16
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_card, {
                                size: "small",
                                title: "Gradebook entries"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_table, {
                                      "data-source": rows.value,
                                      columns: cols,
                                      "row-key": "id",
                                      size: "small",
                                      loading: loading.value
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_table, {
                                        "data-source": rows.value,
                                        columns: cols,
                                        "row-key": "id",
                                        size: "small",
                                        loading: loading.value
                                      }, null, 8, ["data-source", "loading"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_card, {
                                  size: "small",
                                  title: "Gradebook entries"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_table, {
                                      "data-source": rows.value,
                                      columns: cols,
                                      "row-key": "id",
                                      size: "small",
                                      loading: loading.value
                                    }, null, 8, ["data-source", "loading"])
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 8
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                size: "small",
                                title: "Summary"
                              }, {
                                default: withCtx(() => [
                                  createVNode("p", null, [
                                    createVNode("strong", null, "Total entries:"),
                                    createTextVNode(" " + toDisplayString(rows.value.length), 1)
                                  ]),
                                  createVNode("p", null, [
                                    createVNode("strong", null, "Average %:"),
                                    createTextVNode(" " + toDisplayString(summary.value.avgPct?.toFixed(1) ?? "–") + "%", 1)
                                  ]),
                                  createVNode("p", null, [
                                    createVNode("strong", null, "Best course:"),
                                    createTextVNode(" " + toDisplayString(summary.value.bestCourse || "–"), 1)
                                  ]),
                                  createVNode("p", null, [
                                    createVNode("strong", null, "Last updated:"),
                                    createTextVNode(" " + toDisplayString(summary.value.lastUpdated || "–"), 1)
                                  ])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 16
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                size: "small",
                                title: "Gradebook entries"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_table, {
                                    "data-source": rows.value,
                                    columns: cols,
                                    "row-key": "id",
                                    size: "small",
                                    loading: loading.value
                                  }, null, 8, ["data-source", "loading"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_row, { gutter: 16 }, {
                      default: withCtx(() => [
                        createVNode(_component_a_col, {
                          xs: 24,
                          md: 8
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              size: "small",
                              title: "Summary"
                            }, {
                              default: withCtx(() => [
                                createVNode("p", null, [
                                  createVNode("strong", null, "Total entries:"),
                                  createTextVNode(" " + toDisplayString(rows.value.length), 1)
                                ]),
                                createVNode("p", null, [
                                  createVNode("strong", null, "Average %:"),
                                  createTextVNode(" " + toDisplayString(summary.value.avgPct?.toFixed(1) ?? "–") + "%", 1)
                                ]),
                                createVNode("p", null, [
                                  createVNode("strong", null, "Best course:"),
                                  createTextVNode(" " + toDisplayString(summary.value.bestCourse || "–"), 1)
                                ]),
                                createVNode("p", null, [
                                  createVNode("strong", null, "Last updated:"),
                                  createTextVNode(" " + toDisplayString(summary.value.lastUpdated || "–"), 1)
                                ])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_col, {
                          xs: 24,
                          md: 16
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              size: "small",
                              title: "Gradebook entries"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_table, {
                                  "data-source": rows.value,
                                  columns: cols,
                                  "row-key": "id",
                                  size: "small",
                                  loading: loading.value
                                }, null, 8, ["data-source", "loading"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_page_header, {
                title: "My Gradebook",
                "sub-title": "Overview of your courses, assignments, and grades"
              }),
              createVNode(_component_a_space, {
                direction: "vertical",
                style: { "width": "100%" }
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_row, { gutter: 16 }, {
                    default: withCtx(() => [
                      createVNode(_component_a_col, {
                        xs: 24,
                        md: 8
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_card, {
                            size: "small",
                            title: "Summary"
                          }, {
                            default: withCtx(() => [
                              createVNode("p", null, [
                                createVNode("strong", null, "Total entries:"),
                                createTextVNode(" " + toDisplayString(rows.value.length), 1)
                              ]),
                              createVNode("p", null, [
                                createVNode("strong", null, "Average %:"),
                                createTextVNode(" " + toDisplayString(summary.value.avgPct?.toFixed(1) ?? "–") + "%", 1)
                              ]),
                              createVNode("p", null, [
                                createVNode("strong", null, "Best course:"),
                                createTextVNode(" " + toDisplayString(summary.value.bestCourse || "–"), 1)
                              ]),
                              createVNode("p", null, [
                                createVNode("strong", null, "Last updated:"),
                                createTextVNode(" " + toDisplayString(summary.value.lastUpdated || "–"), 1)
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_col, {
                        xs: 24,
                        md: 16
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_card, {
                            size: "small",
                            title: "Gradebook entries"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_table, {
                                "data-source": rows.value,
                                columns: cols,
                                "row-key": "id",
                                size: "small",
                                loading: loading.value
                              }, null, 8, ["data-source", "loading"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/gradebook/nuxt/pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DT53mqww.mjs.map
