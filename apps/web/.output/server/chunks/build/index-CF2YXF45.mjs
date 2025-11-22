import { defineComponent, resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './StudentsNav-xlfyhLgm.mjs';
import './server.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      _push(ssrRenderComponent(_component_a_layout, mergeProps({ class: "p-6" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$1, { subtitle: "Explore" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_row, { gutter: [16, 16] }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 24,
                    md: 8
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_card, {
                          title: "Enrollments",
                          hoverable: "",
                          onClick: ($event) => _ctx.$router.push("/students/enrollments")
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<p${_scopeId4}>See your courses and progress.</p>`);
                            } else {
                              return [
                                createVNode("p", null, "See your courses and progress.")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_card, {
                            title: "Enrollments",
                            hoverable: "",
                            onClick: ($event) => _ctx.$router.push("/students/enrollments")
                          }, {
                            default: withCtx(() => [
                              createVNode("p", null, "See your courses and progress.")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 24,
                    md: 8
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_card, {
                          title: "My Courses",
                          hoverable: "",
                          onClick: ($event) => _ctx.$router.push("/students/my-courses")
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<p${_scopeId4}>Jump back into any course.</p>`);
                            } else {
                              return [
                                createVNode("p", null, "Jump back into any course.")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_card, {
                            title: "My Courses",
                            hoverable: "",
                            onClick: ($event) => _ctx.$router.push("/students/my-courses")
                          }, {
                            default: withCtx(() => [
                              createVNode("p", null, "Jump back into any course.")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 24,
                    md: 8
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_card, {
                          title: "Gradebook",
                          hoverable: "",
                          onClick: ($event) => _ctx.$router.push("/students/gradebook")
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<p${_scopeId4}>View grades by course and assignment.</p>`);
                            } else {
                              return [
                                createVNode("p", null, "View grades by course and assignment.")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_card, {
                            title: "Gradebook",
                            hoverable: "",
                            onClick: ($event) => _ctx.$router.push("/students/gradebook")
                          }, {
                            default: withCtx(() => [
                              createVNode("p", null, "View grades by course and assignment.")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 24,
                    md: 8
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_card, {
                          title: "Institutions",
                          hoverable: "",
                          onClick: ($event) => _ctx.$router.push("/institutions")
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<p${_scopeId4}>Browse institutions you belong to.</p>`);
                            } else {
                              return [
                                createVNode("p", null, "Browse institutions you belong to.")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_card, {
                            title: "Institutions",
                            hoverable: "",
                            onClick: ($event) => _ctx.$router.push("/institutions")
                          }, {
                            default: withCtx(() => [
                              createVNode("p", null, "Browse institutions you belong to.")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_col, {
                      xs: 24,
                      md: 8
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          title: "Enrollments",
                          hoverable: "",
                          onClick: ($event) => _ctx.$router.push("/students/enrollments")
                        }, {
                          default: withCtx(() => [
                            createVNode("p", null, "See your courses and progress.")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, {
                      xs: 24,
                      md: 8
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          title: "My Courses",
                          hoverable: "",
                          onClick: ($event) => _ctx.$router.push("/students/my-courses")
                        }, {
                          default: withCtx(() => [
                            createVNode("p", null, "Jump back into any course.")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, {
                      xs: 24,
                      md: 8
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          title: "Gradebook",
                          hoverable: "",
                          onClick: ($event) => _ctx.$router.push("/students/gradebook")
                        }, {
                          default: withCtx(() => [
                            createVNode("p", null, "View grades by course and assignment.")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, {
                      xs: 24,
                      md: 8
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          title: "Institutions",
                          hoverable: "",
                          onClick: ($event) => _ctx.$router.push("/institutions")
                        }, {
                          default: withCtx(() => [
                            createVNode("p", null, "Browse institutions you belong to.")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
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
              createVNode(_sfc_main$1, { subtitle: "Explore" }),
              createVNode(_component_a_row, { gutter: [16, 16] }, {
                default: withCtx(() => [
                  createVNode(_component_a_col, {
                    xs: 24,
                    md: 8
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_card, {
                        title: "Enrollments",
                        hoverable: "",
                        onClick: ($event) => _ctx.$router.push("/students/enrollments")
                      }, {
                        default: withCtx(() => [
                          createVNode("p", null, "See your courses and progress.")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_col, {
                    xs: 24,
                    md: 8
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_card, {
                        title: "My Courses",
                        hoverable: "",
                        onClick: ($event) => _ctx.$router.push("/students/my-courses")
                      }, {
                        default: withCtx(() => [
                          createVNode("p", null, "Jump back into any course.")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_col, {
                    xs: 24,
                    md: 8
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_card, {
                        title: "Gradebook",
                        hoverable: "",
                        onClick: ($event) => _ctx.$router.push("/students/gradebook")
                      }, {
                        default: withCtx(() => [
                          createVNode("p", null, "View grades by course and assignment.")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_col, {
                    xs: 24,
                    md: 8
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_card, {
                        title: "Institutions",
                        hoverable: "",
                        onClick: ($event) => _ctx.$router.push("/institutions")
                      }, {
                        default: withCtx(() => [
                          createVNode("p", null, "Browse institutions you belong to.")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/students-internal/nuxt/pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CF2YXF45.mjs.map
