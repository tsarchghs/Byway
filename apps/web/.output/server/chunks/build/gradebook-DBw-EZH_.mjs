import { defineComponent, ref, resolveComponent, mergeProps, withCtx, unref, isRef, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { n as navigateTo } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@apollo/client/core/index.js';
import '@apollo/client/link/context/index.js';
import '@vue/apollo-composable';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "gradebook",
  __ssrInlineRender: true,
  setup(__props) {
    const courseId = ref("");
    function go() {
      if (!courseId.value) return;
      navigateTo(`/students/gradebook?courseId=${encodeURIComponent(courseId.value)}`);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_alert = resolveComponent("a-alert");
      _push(ssrRenderComponent(_component_a_layout, mergeProps({ class: "p-6" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_page_header, {
              title: "Teacher · Gradebook",
              "sub-title": "Lookup",
              class: "mb-4",
              onBack: ($event) => _ctx.$router.push("/")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_card, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_row, {
                    gutter: [8, 8],
                    class: "mb-3"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_col, { span: 18 }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_input, {
                                value: unref(courseId),
                                "onUpdate:value": ($event) => isRef(courseId) ? courseId.value = $event : null,
                                placeholder: "Course ID..."
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_input, {
                                  value: unref(courseId),
                                  "onUpdate:value": ($event) => isRef(courseId) ? courseId.value = $event : null,
                                  placeholder: "Course ID..."
                                }, null, 8, ["value", "onUpdate:value"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_col, { span: 6 }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_button, {
                                type: "primary",
                                onClick: go
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Open in Student GB`);
                                  } else {
                                    return [
                                      createTextVNode("Open in Student GB")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_button, {
                                  type: "primary",
                                  onClick: go
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Open in Student GB")
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
                          createVNode(_component_a_col, { span: 18 }, {
                            default: withCtx(() => [
                              createVNode(_component_a_input, {
                                value: unref(courseId),
                                "onUpdate:value": ($event) => isRef(courseId) ? courseId.value = $event : null,
                                placeholder: "Course ID..."
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, { span: 6 }, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, {
                                type: "primary",
                                onClick: go
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Open in Student GB")
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
                  _push3(ssrRenderComponent(_component_a_alert, {
                    type: "info",
                    message: "This page helps you jump into the gradebook.",
                    "show-icon": ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_row, {
                      gutter: [8, 8],
                      class: "mb-3"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_col, { span: 18 }, {
                          default: withCtx(() => [
                            createVNode(_component_a_input, {
                              value: unref(courseId),
                              "onUpdate:value": ($event) => isRef(courseId) ? courseId.value = $event : null,
                              placeholder: "Course ID..."
                            }, null, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_col, { span: 6 }, {
                          default: withCtx(() => [
                            createVNode(_component_a_button, {
                              type: "primary",
                              onClick: go
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Open in Student GB")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_alert, {
                      type: "info",
                      message: "This page helps you jump into the gradebook.",
                      "show-icon": ""
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_page_header, {
                title: "Teacher · Gradebook",
                "sub-title": "Lookup",
                class: "mb-4",
                onBack: ($event) => _ctx.$router.push("/")
              }, null, 8, ["onBack"]),
              createVNode(_component_a_card, null, {
                default: withCtx(() => [
                  createVNode(_component_a_row, {
                    gutter: [8, 8],
                    class: "mb-3"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_col, { span: 18 }, {
                        default: withCtx(() => [
                          createVNode(_component_a_input, {
                            value: unref(courseId),
                            "onUpdate:value": ($event) => isRef(courseId) ? courseId.value = $event : null,
                            placeholder: "Course ID..."
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_col, { span: 6 }, {
                        default: withCtx(() => [
                          createVNode(_component_a_button, {
                            type: "primary",
                            onClick: go
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Open in Student GB")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_alert, {
                    type: "info",
                    message: "This page helps you jump into the gradebook.",
                    "show-icon": ""
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/teach/nuxt/pages/gradebook.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=gradebook-DBw-EZH_.mjs.map
