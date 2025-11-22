import { defineComponent, ref, resolveComponent, mergeProps, withCtx, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(false);
    const items = ref([]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_list = resolveComponent("a-list");
      const _component_a_list_item = resolveComponent("a-list-item");
      const _component_a_list_item_meta = resolveComponent("a-list-item-meta");
      const _component_a_tag = resolveComponent("a-tag");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_a_page_header, {
        title: "Teacher • Course Labs",
        "sub-title": "Manage CS50-style challenges, course bindings, and lab sessions"
      }, null, _parent));
      _push(ssrRenderComponent(_component_a_card, {
        loading: loading.value,
        title: "Challenges"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_list, { "data-source": items.value }, {
              renderItem: withCtx(({ item }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_list_item, null, {
                    actions: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_tag, null, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(item.difficulty)}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(item.difficulty), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_tag, null, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(item.visibility)}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(item.visibility), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_tag, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(item.difficulty), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_component_a_tag, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(item.visibility), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ];
                      }
                    }),
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_list_item_meta, {
                          title: item.title
                        }, {
                          description: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="text-sm text-gray-600"${_scopeId4}><div${_scopeId4}>${ssrInterpolate(item.description)}</div><div class="mt-1"${_scopeId4}>`);
                              if (item.courseId) {
                                _push5(`<span${_scopeId4}>Course: ${ssrInterpolate(item.courseId)}</span>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              if (item.moduleId) {
                                _push5(`<span${_scopeId4}> · Module: ${ssrInterpolate(item.moduleId)}</span>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              if (item.lessonId) {
                                _push5(`<span${_scopeId4}> · Lesson: ${ssrInterpolate(item.lessonId)}</span>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              _push5(`</div></div>`);
                            } else {
                              return [
                                createVNode("div", { class: "text-sm text-gray-600" }, [
                                  createVNode("div", null, toDisplayString(item.description), 1),
                                  createVNode("div", { class: "mt-1" }, [
                                    item.courseId ? (openBlock(), createBlock("span", { key: 0 }, "Course: " + toDisplayString(item.courseId), 1)) : createCommentVNode("", true),
                                    item.moduleId ? (openBlock(), createBlock("span", { key: 1 }, " · Module: " + toDisplayString(item.moduleId), 1)) : createCommentVNode("", true),
                                    item.lessonId ? (openBlock(), createBlock("span", { key: 2 }, " · Lesson: " + toDisplayString(item.lessonId), 1)) : createCommentVNode("", true)
                                  ])
                                ])
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_list_item_meta, {
                            title: item.title
                          }, {
                            description: withCtx(() => [
                              createVNode("div", { class: "text-sm text-gray-600" }, [
                                createVNode("div", null, toDisplayString(item.description), 1),
                                createVNode("div", { class: "mt-1" }, [
                                  item.courseId ? (openBlock(), createBlock("span", { key: 0 }, "Course: " + toDisplayString(item.courseId), 1)) : createCommentVNode("", true),
                                  item.moduleId ? (openBlock(), createBlock("span", { key: 1 }, " · Module: " + toDisplayString(item.moduleId), 1)) : createCommentVNode("", true),
                                  item.lessonId ? (openBlock(), createBlock("span", { key: 2 }, " · Lesson: " + toDisplayString(item.lessonId), 1)) : createCommentVNode("", true)
                                ])
                              ])
                            ]),
                            _: 2
                          }, 1032, ["title"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_list_item, null, {
                      actions: withCtx(() => [
                        createVNode(_component_a_tag, null, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(item.difficulty), 1)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(_component_a_tag, null, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(item.visibility), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      default: withCtx(() => [
                        createVNode(_component_a_list_item_meta, {
                          title: item.title
                        }, {
                          description: withCtx(() => [
                            createVNode("div", { class: "text-sm text-gray-600" }, [
                              createVNode("div", null, toDisplayString(item.description), 1),
                              createVNode("div", { class: "mt-1" }, [
                                item.courseId ? (openBlock(), createBlock("span", { key: 0 }, "Course: " + toDisplayString(item.courseId), 1)) : createCommentVNode("", true),
                                item.moduleId ? (openBlock(), createBlock("span", { key: 1 }, " · Module: " + toDisplayString(item.moduleId), 1)) : createCommentVNode("", true),
                                item.lessonId ? (openBlock(), createBlock("span", { key: 2 }, " · Lesson: " + toDisplayString(item.lessonId), 1)) : createCommentVNode("", true)
                              ])
                            ])
                          ]),
                          _: 2
                        }, 1032, ["title"])
                      ]),
                      _: 2
                    }, 1024)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_list, { "data-source": items.value }, {
                renderItem: withCtx(({ item }) => [
                  createVNode(_component_a_list_item, null, {
                    actions: withCtx(() => [
                      createVNode(_component_a_tag, null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.difficulty), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_component_a_tag, null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.visibility), 1)
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    default: withCtx(() => [
                      createVNode(_component_a_list_item_meta, {
                        title: item.title
                      }, {
                        description: withCtx(() => [
                          createVNode("div", { class: "text-sm text-gray-600" }, [
                            createVNode("div", null, toDisplayString(item.description), 1),
                            createVNode("div", { class: "mt-1" }, [
                              item.courseId ? (openBlock(), createBlock("span", { key: 0 }, "Course: " + toDisplayString(item.courseId), 1)) : createCommentVNode("", true),
                              item.moduleId ? (openBlock(), createBlock("span", { key: 1 }, " · Module: " + toDisplayString(item.moduleId), 1)) : createCommentVNode("", true),
                              item.lessonId ? (openBlock(), createBlock("span", { key: 2 }, " · Lesson: " + toDisplayString(item.lessonId), 1)) : createCommentVNode("", true)
                            ])
                          ])
                        ]),
                        _: 2
                      }, 1032, ["title"])
                    ]),
                    _: 2
                  }, 1024)
                ]),
                _: 1
              }, 8, ["data-source"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/teacher-course-lab/pages/teacher-course-lab/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-dy3ukTJA.mjs.map
