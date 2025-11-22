import { defineComponent, ref, computed, resolveComponent, mergeProps, withCtx, createBlock, openBlock, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(false);
    const sessions = ref([]);
    const columns = [
      { title: "Challenge", dataIndex: ["challenge", "title"], key: "challenge" },
      { title: "Status", dataIndex: "status", key: "status" },
      { title: "Last Result", dataIndex: ["lastSubmission", "status"], key: "lastStatus" },
      { title: "Grade %", dataIndex: ["lastSubmission", "gradePct"], key: "gradePct" },
      { title: "Attempts", dataIndex: "attempts", key: "attempts" },
      { title: "Course Binding", dataIndex: "binding", key: "binding" },
      { title: "Started", dataIndex: "createdAtFormatted", key: "createdAt" }
    ];
    const hasSessions = computed(() => sessions.value.length > 0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_empty = resolveComponent("a-empty");
      const _component_a_table = resolveComponent("a-table");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_a_page_header, {
        title: "My Labs & Projects",
        "sub-title": "CS50-style labs connected to your courses and modules"
      }, null, _parent));
      _push(ssrRenderComponent(_component_a_row, { gutter: 16 }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_col, {
              xs: 24,
              md: 15
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_card, {
                    title: "Lab sessions",
                    loading: loading.value
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (!loading.value && !hasSessions.value) {
                          _push4(ssrRenderComponent(_component_a_empty, { description: "No lab sessions yet. Ask your teacher for a challenge ID." }, null, _parent4, _scopeId3));
                        } else {
                          _push4(ssrRenderComponent(_component_a_table, {
                            columns,
                            "data-source": sessions.value,
                            loading: loading.value,
                            size: "small",
                            "row-key": "id"
                          }, null, _parent4, _scopeId3));
                        }
                      } else {
                        return [
                          !loading.value && !hasSessions.value ? (openBlock(), createBlock(_component_a_empty, {
                            key: 0,
                            description: "No lab sessions yet. Ask your teacher for a challenge ID."
                          })) : (openBlock(), createBlock(_component_a_table, {
                            key: 1,
                            columns,
                            "data-source": sessions.value,
                            loading: loading.value,
                            size: "small",
                            "row-key": "id"
                          }, null, 8, ["data-source", "loading"]))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, {
                      title: "Lab sessions",
                      loading: loading.value
                    }, {
                      default: withCtx(() => [
                        !loading.value && !hasSessions.value ? (openBlock(), createBlock(_component_a_empty, {
                          key: 0,
                          description: "No lab sessions yet. Ask your teacher for a challenge ID."
                        })) : (openBlock(), createBlock(_component_a_table, {
                          key: 1,
                          columns,
                          "data-source": sessions.value,
                          loading: loading.value,
                          size: "small",
                          "row-key": "id"
                        }, null, 8, ["data-source", "loading"]))
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_col, {
              xs: 24,
              md: 9
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_card, { title: "How labs work" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<p class="text-sm text-gray-600 mb-2"${_scopeId3}> Labs run in a dedicated code-server instance, managed by the <strong${_scopeId3}>teacher-course-lab</strong> plugin. </p><ul class="text-sm text-gray-700 mb-2"${_scopeId3}><li${_scopeId3}>1. Your teacher gives you a challenge ID.</li><li${_scopeId3}>2. You start a session from the labs page in the platform.</li><li${_scopeId3}>3. Code, run tests, and submit your work.</li></ul><p class="text-xs text-gray-500"${_scopeId3}> This page reuses the teacher-course-lab plugin through its public REST API and keeps everything student-facing in the students-internal plugin. </p>`);
                      } else {
                        return [
                          createVNode("p", { class: "text-sm text-gray-600 mb-2" }, [
                            createTextVNode(" Labs run in a dedicated code-server instance, managed by the "),
                            createVNode("strong", null, "teacher-course-lab"),
                            createTextVNode(" plugin. ")
                          ]),
                          createVNode("ul", { class: "text-sm text-gray-700 mb-2" }, [
                            createVNode("li", null, "1. Your teacher gives you a challenge ID."),
                            createVNode("li", null, "2. You start a session from the labs page in the platform."),
                            createVNode("li", null, "3. Code, run tests, and submit your work.")
                          ]),
                          createVNode("p", { class: "text-xs text-gray-500" }, " This page reuses the teacher-course-lab plugin through its public REST API and keeps everything student-facing in the students-internal plugin. ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, { title: "How labs work" }, {
                      default: withCtx(() => [
                        createVNode("p", { class: "text-sm text-gray-600 mb-2" }, [
                          createTextVNode(" Labs run in a dedicated code-server instance, managed by the "),
                          createVNode("strong", null, "teacher-course-lab"),
                          createTextVNode(" plugin. ")
                        ]),
                        createVNode("ul", { class: "text-sm text-gray-700 mb-2" }, [
                          createVNode("li", null, "1. Your teacher gives you a challenge ID."),
                          createVNode("li", null, "2. You start a session from the labs page in the platform."),
                          createVNode("li", null, "3. Code, run tests, and submit your work.")
                        ]),
                        createVNode("p", { class: "text-xs text-gray-500" }, " This page reuses the teacher-course-lab plugin through its public REST API and keeps everything student-facing in the students-internal plugin. ")
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
              createVNode(_component_a_col, {
                xs: 24,
                md: 15
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_card, {
                    title: "Lab sessions",
                    loading: loading.value
                  }, {
                    default: withCtx(() => [
                      !loading.value && !hasSessions.value ? (openBlock(), createBlock(_component_a_empty, {
                        key: 0,
                        description: "No lab sessions yet. Ask your teacher for a challenge ID."
                      })) : (openBlock(), createBlock(_component_a_table, {
                        key: 1,
                        columns,
                        "data-source": sessions.value,
                        loading: loading.value,
                        size: "small",
                        "row-key": "id"
                      }, null, 8, ["data-source", "loading"]))
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              }),
              createVNode(_component_a_col, {
                xs: 24,
                md: 9
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_card, { title: "How labs work" }, {
                    default: withCtx(() => [
                      createVNode("p", { class: "text-sm text-gray-600 mb-2" }, [
                        createTextVNode(" Labs run in a dedicated code-server instance, managed by the "),
                        createVNode("strong", null, "teacher-course-lab"),
                        createTextVNode(" plugin. ")
                      ]),
                      createVNode("ul", { class: "text-sm text-gray-700 mb-2" }, [
                        createVNode("li", null, "1. Your teacher gives you a challenge ID."),
                        createVNode("li", null, "2. You start a session from the labs page in the platform."),
                        createVNode("li", null, "3. Code, run tests, and submit your work.")
                      ]),
                      createVNode("p", { class: "text-xs text-gray-500" }, " This page reuses the teacher-course-lab plugin through its public REST API and keeps everything student-facing in the students-internal plugin. ")
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
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/students-internal/nuxt/pages/labs/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BRzBSlXP.mjs.map
