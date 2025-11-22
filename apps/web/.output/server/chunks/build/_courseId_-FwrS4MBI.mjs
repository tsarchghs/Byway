import { defineComponent, ref, computed, resolveComponent, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, createVNode, h, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttrs } from 'vue/server-renderer';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { useRoute, useRouter } from 'vue-router';
import { _ as _export_sfc } from './server.mjs';
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
import '@apollo/client/core/index.js';
import '@apollo/client/link/context/index.js';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AppNav",
  __ssrInlineRender: true,
  setup(__props) {
    const Q_ME = gql`query Me { me { id email displayName roles } }`;
    const { result: meRes } = useQuery(Q_ME);
    const me = computed(() => meRes.value?.me || null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_button = resolveComponent("a-button");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_avatar = resolveComponent("a-avatar");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mb-3 flex items-center justify-between" }, _attrs))}><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_a_button, {
        type: "link",
        onClick: ($event) => _ctx.$router.push("/explore")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Explore`);
          } else {
            return [
              createTextVNode("Explore")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_button, {
        type: "link",
        onClick: ($event) => _ctx.$router.push("/courses")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Courses`);
          } else {
            return [
              createTextVNode("Courses")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_button, {
        type: "link",
        onClick: ($event) => _ctx.$router.push("/assignments")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Assignments`);
          } else {
            return [
              createTextVNode("Assignments")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_button, {
        type: "link",
        onClick: ($event) => _ctx.$router.push("/institutions")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Institutions`);
          } else {
            return [
              createTextVNode("Institutions")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_button, {
        type: "link",
        onClick: ($event) => _ctx.$router.push("/analytics")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Analytics`);
          } else {
            return [
              createTextVNode("Analytics")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-center gap-2"><!--[-->`);
      ssrRenderList(me.value?.roles || [], (r) => {
        _push(ssrRenderComponent(_component_a_tag, {
          key: r,
          color: "gold"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(r)}`);
            } else {
              return [
                createTextVNode(toDisplayString(r), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(_component_a_avatar, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(me.value?.displayName?.[0] || "?")}`);
          } else {
            return [
              createTextVNode(toDisplayString(me.value?.displayName?.[0] || "?"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/students-internal/nuxt/components/AppNav.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[courseId]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const tab = ref("grades");
    function nav(p) {
      router.push(p);
    }
    function goBack() {
      router.back();
    }
    function goLogin() {
      router.push("/login");
    }
    const me = ref({
      id: "u123",
      email: "test@example.com",
      displayName: "Demo Teacher",
      roles: ["TEACHER"]
    });
    const loading = ref(true);
    const mockGradebook = ref([]);
    const rows = computed(
      () => mockGradebook.value.map((e) => ({ ...e, key: e.id }))
    );
    const courseTitle = ref("Demo Course Title");
    async function upsertGradeMock(input) {
      const row = mockGradebook.value.find(
        (x) => x.assignmentId === input.assignmentId && x.studentId === input.studentId && x.courseId === input.courseId
      );
      if (row) {
        if (input.grade != null) row.grade = input.grade;
        if (input.feedback != null) row.feedback = input.feedback;
        row.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      }
    }
    const metrics = computed(() => {
      const list = rows.value;
      if (!list.length) return { avg: null, submitted: 0, ungraded: 0 };
      const graded = list.filter((x) => typeof x.grade === "number");
      const avg = graded.length ? (graded.reduce((s, x) => s + (x.grade || 0), 0) / graded.length).toFixed(2) : null;
      return {
        avg,
        submitted: graded.length,
        ungraded: list.length - graded.length
      };
    });
    const cols = [
      { title: "Student", dataIndex: "studentId" },
      { title: "Assignment", dataIndex: "assignmentId" },
      {
        title: "Grade",
        dataIndex: "grade",
        customRender: ({ record }) => h("a-input-number", {
          modelValue: record.grade,
          min: 0,
          max: 100,
          step: 1,
          style: "width:80px",
          async onChange(val) {
            await upsertGradeMock({
              assignmentId: record.assignmentId,
              studentId: record.studentId,
              courseId: record.courseId,
              grade: Number(val)
            });
          }
        })
      },
      {
        title: "Feedback",
        dataIndex: "feedback",
        customRender: ({ record }) => h("a-input", {
          modelValue: record.feedback || "",
          placeholder: "Enter feedback…",
          style: "min-width:180px",
          async onChange(e) {
            await upsertGradeMock({
              assignmentId: record.assignmentId,
              studentId: record.studentId,
              courseId: record.courseId,
              feedback: String(e?.target?.value || "")
            });
          }
        })
      },
      { title: "Updated", dataIndex: "updatedAt" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_breadcrumb = resolveComponent("a-breadcrumb");
      const _component_a_breadcrumb_item = resolveComponent("a-breadcrumb-item");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_tabs = resolveComponent("a-tabs");
      const _component_a_tab_pane = resolveComponent("a-tab-pane");
      const _component_a_alert = resolveComponent("a-alert");
      const _component_a_table = resolveComponent("a-table");
      _push(ssrRenderComponent(_component_a_layout, mergeProps({ class: "gradebook-wrap p-6" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$1, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_page_header, {
              class: "gradebook-header",
              title: `Gradebook · ${courseTitle.value || unref(route).params.courseId}`,
              "sub-title": "Manage grades and analytics",
              onBack: goBack
            }, {
              extra: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_space, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(me.value?.roles || [], (r) => {
                          _push4(ssrRenderComponent(_component_a_tag, {
                            key: r,
                            color: "blue"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(r)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(r), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                        if (!me.value) {
                          _push4(ssrRenderComponent(_component_a_button, {
                            type: "primary",
                            onClick: goLogin
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` Login `);
                              } else {
                                return [
                                  createTextVNode(" Login ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          (openBlock(true), createBlock(Fragment, null, renderList(me.value?.roles || [], (r) => {
                            return openBlock(), createBlock(_component_a_tag, {
                              key: r,
                              color: "blue"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(r), 1)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128)),
                          !me.value ? (openBlock(), createBlock(_component_a_button, {
                            key: 0,
                            type: "primary",
                            onClick: goLogin
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Login ")
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_space, null, {
                      default: withCtx(() => [
                        (openBlock(true), createBlock(Fragment, null, renderList(me.value?.roles || [], (r) => {
                          return openBlock(), createBlock(_component_a_tag, {
                            key: r,
                            color: "blue"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(r), 1)
                            ]),
                            _: 2
                          }, 1024);
                        }), 128)),
                        !me.value ? (openBlock(), createBlock(_component_a_button, {
                          key: 0,
                          type: "primary",
                          onClick: goLogin
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Login ")
                          ]),
                          _: 1
                        })) : createCommentVNode("", true)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_breadcrumb, { class: "mb-3" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_breadcrumb_item, {
                    onClick: ($event) => nav("/explore")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Explore`);
                      } else {
                        return [
                          createTextVNode("Explore")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_breadcrumb_item, {
                    onClick: ($event) => nav("/courses")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Courses`);
                      } else {
                        return [
                          createTextVNode("Courses")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_breadcrumb_item, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Gradebook`);
                      } else {
                        return [
                          createTextVNode("Gradebook")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_breadcrumb_item, {
                      onClick: ($event) => nav("/explore")
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Explore")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_component_a_breadcrumb_item, {
                      onClick: ($event) => nav("/courses")
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Courses")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_component_a_breadcrumb_item, null, {
                      default: withCtx(() => [
                        createTextVNode("Gradebook")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_card, { class: "shadow-sm" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_tabs, {
                    activeKey: tab.value,
                    "onUpdate:activeKey": ($event) => tab.value = $event
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_tab_pane, {
                          key: "grades",
                          tab: "Grades"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_alert, {
                                type: "info",
                                message: "Click a grade or feedback cell to edit; changes save instantly via GraphQL.",
                                class: "mb-3",
                                "show-icon": ""
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_table, {
                                "data-source": rows.value,
                                columns: cols,
                                "row-key": "id",
                                loading: loading.value,
                                size: "middle",
                                bordered: ""
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_alert, {
                                  type: "info",
                                  message: "Click a grade or feedback cell to edit; changes save instantly via GraphQL.",
                                  class: "mb-3",
                                  "show-icon": ""
                                }),
                                createVNode(_component_a_table, {
                                  "data-source": rows.value,
                                  columns: cols,
                                  "row-key": "id",
                                  loading: loading.value,
                                  size: "middle",
                                  bordered: ""
                                }, null, 8, ["data-source", "loading"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_tab_pane, {
                          key: "analytics",
                          tab: "Analytics"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="grid md:grid-cols-3 gap-3 mb-4" data-v-7259bded${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_card, {
                                size: "small",
                                title: "Average Grade"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<h2 class="stat" data-v-7259bded${_scopeId5}>${ssrInterpolate(metrics.value.avg ?? "—")}</h2>`);
                                  } else {
                                    return [
                                      createVNode("h2", { class: "stat" }, toDisplayString(metrics.value.avg ?? "—"), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_card, {
                                size: "small",
                                title: "Submitted"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<h2 class="stat" data-v-7259bded${_scopeId5}>${ssrInterpolate(metrics.value.submitted)}</h2>`);
                                  } else {
                                    return [
                                      createVNode("h2", { class: "stat" }, toDisplayString(metrics.value.submitted), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_card, {
                                size: "small",
                                title: "Ungraded"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<h2 class="stat" data-v-7259bded${_scopeId5}>${ssrInterpolate(metrics.value.ungraded)}</h2>`);
                                  } else {
                                    return [
                                      createVNode("h2", { class: "stat" }, toDisplayString(metrics.value.ungraded), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                            } else {
                              return [
                                createVNode("div", { class: "grid md:grid-cols-3 gap-3 mb-4" }, [
                                  createVNode(_component_a_card, {
                                    size: "small",
                                    title: "Average Grade"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("h2", { class: "stat" }, toDisplayString(metrics.value.avg ?? "—"), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_card, {
                                    size: "small",
                                    title: "Submitted"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("h2", { class: "stat" }, toDisplayString(metrics.value.submitted), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_card, {
                                    size: "small",
                                    title: "Ungraded"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("h2", { class: "stat" }, toDisplayString(metrics.value.ungraded), 1)
                                    ]),
                                    _: 1
                                  })
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_tab_pane, {
                            key: "grades",
                            tab: "Grades"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_alert, {
                                type: "info",
                                message: "Click a grade or feedback cell to edit; changes save instantly via GraphQL.",
                                class: "mb-3",
                                "show-icon": ""
                              }),
                              createVNode(_component_a_table, {
                                "data-source": rows.value,
                                columns: cols,
                                "row-key": "id",
                                loading: loading.value,
                                size: "middle",
                                bordered: ""
                              }, null, 8, ["data-source", "loading"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_tab_pane, {
                            key: "analytics",
                            tab: "Analytics"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "grid md:grid-cols-3 gap-3 mb-4" }, [
                                createVNode(_component_a_card, {
                                  size: "small",
                                  title: "Average Grade"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("h2", { class: "stat" }, toDisplayString(metrics.value.avg ?? "—"), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_card, {
                                  size: "small",
                                  title: "Submitted"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("h2", { class: "stat" }, toDisplayString(metrics.value.submitted), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_card, {
                                  size: "small",
                                  title: "Ungraded"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("h2", { class: "stat" }, toDisplayString(metrics.value.ungraded), 1)
                                  ]),
                                  _: 1
                                })
                              ])
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
                    createVNode(_component_a_tabs, {
                      activeKey: tab.value,
                      "onUpdate:activeKey": ($event) => tab.value = $event
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_tab_pane, {
                          key: "grades",
                          tab: "Grades"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_alert, {
                              type: "info",
                              message: "Click a grade or feedback cell to edit; changes save instantly via GraphQL.",
                              class: "mb-3",
                              "show-icon": ""
                            }),
                            createVNode(_component_a_table, {
                              "data-source": rows.value,
                              columns: cols,
                              "row-key": "id",
                              loading: loading.value,
                              size: "middle",
                              bordered: ""
                            }, null, 8, ["data-source", "loading"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_tab_pane, {
                          key: "analytics",
                          tab: "Analytics"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "grid md:grid-cols-3 gap-3 mb-4" }, [
                              createVNode(_component_a_card, {
                                size: "small",
                                title: "Average Grade"
                              }, {
                                default: withCtx(() => [
                                  createVNode("h2", { class: "stat" }, toDisplayString(metrics.value.avg ?? "—"), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_card, {
                                size: "small",
                                title: "Submitted"
                              }, {
                                default: withCtx(() => [
                                  createVNode("h2", { class: "stat" }, toDisplayString(metrics.value.submitted), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_card, {
                                size: "small",
                                title: "Ungraded"
                              }, {
                                default: withCtx(() => [
                                  createVNode("h2", { class: "stat" }, toDisplayString(metrics.value.ungraded), 1)
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["activeKey", "onUpdate:activeKey"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$1),
              createVNode(_component_a_page_header, {
                class: "gradebook-header",
                title: `Gradebook · ${courseTitle.value || unref(route).params.courseId}`,
                "sub-title": "Manage grades and analytics",
                onBack: goBack
              }, {
                extra: withCtx(() => [
                  createVNode(_component_a_space, null, {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(me.value?.roles || [], (r) => {
                        return openBlock(), createBlock(_component_a_tag, {
                          key: r,
                          color: "blue"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(r), 1)
                          ]),
                          _: 2
                        }, 1024);
                      }), 128)),
                      !me.value ? (openBlock(), createBlock(_component_a_button, {
                        key: 0,
                        type: "primary",
                        onClick: goLogin
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Login ")
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["title"]),
              createVNode(_component_a_breadcrumb, { class: "mb-3" }, {
                default: withCtx(() => [
                  createVNode(_component_a_breadcrumb_item, {
                    onClick: ($event) => nav("/explore")
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Explore")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_a_breadcrumb_item, {
                    onClick: ($event) => nav("/courses")
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Courses")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_a_breadcrumb_item, null, {
                    default: withCtx(() => [
                      createTextVNode("Gradebook")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_a_card, { class: "shadow-sm" }, {
                default: withCtx(() => [
                  createVNode(_component_a_tabs, {
                    activeKey: tab.value,
                    "onUpdate:activeKey": ($event) => tab.value = $event
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_tab_pane, {
                        key: "grades",
                        tab: "Grades"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_alert, {
                            type: "info",
                            message: "Click a grade or feedback cell to edit; changes save instantly via GraphQL.",
                            class: "mb-3",
                            "show-icon": ""
                          }),
                          createVNode(_component_a_table, {
                            "data-source": rows.value,
                            columns: cols,
                            "row-key": "id",
                            loading: loading.value,
                            size: "middle",
                            bordered: ""
                          }, null, 8, ["data-source", "loading"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_tab_pane, {
                        key: "analytics",
                        tab: "Analytics"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "grid md:grid-cols-3 gap-3 mb-4" }, [
                            createVNode(_component_a_card, {
                              size: "small",
                              title: "Average Grade"
                            }, {
                              default: withCtx(() => [
                                createVNode("h2", { class: "stat" }, toDisplayString(metrics.value.avg ?? "—"), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_card, {
                              size: "small",
                              title: "Submitted"
                            }, {
                              default: withCtx(() => [
                                createVNode("h2", { class: "stat" }, toDisplayString(metrics.value.submitted), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_card, {
                              size: "small",
                              title: "Ungraded"
                            }, {
                              default: withCtx(() => [
                                createVNode("h2", { class: "stat" }, toDisplayString(metrics.value.ungraded), 1)
                              ]),
                              _: 1
                            })
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["activeKey", "onUpdate:activeKey"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/students-internal/nuxt/pages/gradebook/[courseId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _courseId_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7259bded"]]);

export { _courseId_ as default };
//# sourceMappingURL=_courseId_-FwrS4MBI.mjs.map
