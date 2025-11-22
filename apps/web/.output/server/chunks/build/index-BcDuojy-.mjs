import { defineComponent, ref, computed, resolveComponent, mergeProps, withCtx, createVNode, createBlock, createTextVNode, toDisplayString, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(false);
    const submissions = ref([]);
    const columns = [
      { title: "Challenge", dataIndex: "challengeTitle", key: "challengeTitle" },
      { title: "Student", dataIndex: "sessionUserId", key: "student" },
      { title: "Status", dataIndex: "status", key: "status" },
      { title: "Grade %", dataIndex: "gradePct", key: "gradePct" },
      { title: "Bindings", dataIndex: "bindings", key: "bindings" },
      { title: "Submitted", dataIndex: "createdAtFormatted", key: "createdAt" }
    ];
    const totalStudents = computed(() => {
      const ids = new Set(submissions.value.map((s) => s.sessionUserId));
      return ids.size;
    });
    const averageGrade = computed(() => {
      const graded = submissions.value.filter((s) => typeof s.gradePct === "number");
      if (!graded.length) return null;
      const sum = graded.reduce((acc, s) => acc + (s.gradePct || 0), 0);
      return Math.round(sum / graded.length * 10) / 10;
    });
    const hasSubmissions = computed(() => submissions.value.length > 0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_empty = resolveComponent("a-empty");
      const _component_a_table = resolveComponent("a-table");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_a_page_header, {
        title: "Labs Overview",
        "sub-title": "Monitor CS50-style labs across your courses"
      }, null, _parent));
      _push(ssrRenderComponent(_component_a_row, { gutter: 16 }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_col, {
              xs: 24,
              md: 8
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_card, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-sm text-gray-700"${_scopeId3}><div${_scopeId3}><strong${_scopeId3}>Total submissions:</strong> ${ssrInterpolate(submissions.value.length)}</div><div${_scopeId3}><strong${_scopeId3}>Unique students:</strong> ${ssrInterpolate(totalStudents.value)}</div>`);
                        if (averageGrade.value !== null) {
                          _push4(`<div${_scopeId3}><strong${_scopeId3}>Average grade:</strong> ${ssrInterpolate(averageGrade.value)}% </div>`);
                        } else {
                          _push4(`<div class="text-xs text-gray-500"${_scopeId3}> No graded submissions yet. </div>`);
                        }
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-sm text-gray-700" }, [
                            createVNode("div", null, [
                              createVNode("strong", null, "Total submissions:"),
                              createTextVNode(" " + toDisplayString(submissions.value.length), 1)
                            ]),
                            createVNode("div", null, [
                              createVNode("strong", null, "Unique students:"),
                              createTextVNode(" " + toDisplayString(totalStudents.value), 1)
                            ]),
                            averageGrade.value !== null ? (openBlock(), createBlock("div", { key: 0 }, [
                              createVNode("strong", null, "Average grade:"),
                              createTextVNode(" " + toDisplayString(averageGrade.value) + "% ", 1)
                            ])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "text-xs text-gray-500"
                            }, " No graded submissions yet. "))
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "text-sm text-gray-700" }, [
                          createVNode("div", null, [
                            createVNode("strong", null, "Total submissions:"),
                            createTextVNode(" " + toDisplayString(submissions.value.length), 1)
                          ]),
                          createVNode("div", null, [
                            createVNode("strong", null, "Unique students:"),
                            createTextVNode(" " + toDisplayString(totalStudents.value), 1)
                          ]),
                          averageGrade.value !== null ? (openBlock(), createBlock("div", { key: 0 }, [
                            createVNode("strong", null, "Average grade:"),
                            createTextVNode(" " + toDisplayString(averageGrade.value) + "% ", 1)
                          ])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "text-xs text-gray-500"
                          }, " No graded submissions yet. "))
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_col, {
              xs: 24,
              md: 16
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_card, {
                    title: "Latest lab submissions",
                    loading: loading.value
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (!loading.value && !hasSubmissions.value) {
                          _push4(ssrRenderComponent(_component_a_empty, { description: "No lab submissions yet." }, null, _parent4, _scopeId3));
                        } else {
                          _push4(ssrRenderComponent(_component_a_table, {
                            columns,
                            "data-source": submissions.value,
                            loading: loading.value,
                            "row-key": "id",
                            size: "small"
                          }, null, _parent4, _scopeId3));
                        }
                      } else {
                        return [
                          !loading.value && !hasSubmissions.value ? (openBlock(), createBlock(_component_a_empty, {
                            key: 0,
                            description: "No lab submissions yet."
                          })) : (openBlock(), createBlock(_component_a_table, {
                            key: 1,
                            columns,
                            "data-source": submissions.value,
                            loading: loading.value,
                            "row-key": "id",
                            size: "small"
                          }, null, 8, ["data-source", "loading"]))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, {
                      title: "Latest lab submissions",
                      loading: loading.value
                    }, {
                      default: withCtx(() => [
                        !loading.value && !hasSubmissions.value ? (openBlock(), createBlock(_component_a_empty, {
                          key: 0,
                          description: "No lab submissions yet."
                        })) : (openBlock(), createBlock(_component_a_table, {
                          key: 1,
                          columns,
                          "data-source": submissions.value,
                          loading: loading.value,
                          "row-key": "id",
                          size: "small"
                        }, null, 8, ["data-source", "loading"]))
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_col, {
                xs: 24,
                md: 8
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_card, null, {
                    default: withCtx(() => [
                      createVNode("div", { class: "text-sm text-gray-700" }, [
                        createVNode("div", null, [
                          createVNode("strong", null, "Total submissions:"),
                          createTextVNode(" " + toDisplayString(submissions.value.length), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("strong", null, "Unique students:"),
                          createTextVNode(" " + toDisplayString(totalStudents.value), 1)
                        ]),
                        averageGrade.value !== null ? (openBlock(), createBlock("div", { key: 0 }, [
                          createVNode("strong", null, "Average grade:"),
                          createTextVNode(" " + toDisplayString(averageGrade.value) + "% ", 1)
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "text-xs text-gray-500"
                        }, " No graded submissions yet. "))
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
                    title: "Latest lab submissions",
                    loading: loading.value
                  }, {
                    default: withCtx(() => [
                      !loading.value && !hasSubmissions.value ? (openBlock(), createBlock(_component_a_empty, {
                        key: 0,
                        description: "No lab submissions yet."
                      })) : (openBlock(), createBlock(_component_a_table, {
                        key: 1,
                        columns,
                        "data-source": submissions.value,
                        loading: loading.value,
                        "row-key": "id",
                        size: "small"
                      }, null, 8, ["data-source", "loading"]))
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/teach-internal/nuxt/pages/labs/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BcDuojy-.mjs.map
