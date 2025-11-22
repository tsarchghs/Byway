import { defineComponent, computed, ref, resolveComponent, mergeProps, withCtx, unref, createVNode, createTextVNode, h, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc, d as useRoute, u as useRouter, a as useNuxtApp } from './server.mjs';
import { SyncOutlined, ProfileOutlined, EditOutlined } from '@ant-design/icons-vue';
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

function useGradebook(endpoint = "http://localhost:4000/api/students-internal/graphql") {
  async function call(query, variables = {}) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query, variables }),
      credentials: "include"
    });
    const json = await res.json();
    if (json.errors) throw new Error(json.errors.map((e) => e.message).join("; "));
    return json.data;
  }
  return {
    async list(courseId) {
      const q = `query($courseId:ID!){ courseGradebook(courseId:$courseId){ id assignmentId studentId courseId grade feedback updatedAt } }`;
      const d = await call(q, { courseId });
      return d?.courseGradebook || [];
    },
    async upsert(entry) {
      const m = `mutation($input:GradebookInput!){ upsertGrade(input:$input){ id assignmentId studentId courseId grade feedback updatedAt } }`;
      const d = await call(m, { input: entry });
      return d?.upsertGrade;
    }
  };
}
function useUiPrefs() {
  const { $uiPrefs } = useNuxtApp();
  return $uiPrefs;
}
function useKV(ns = "ui") {
  const prefs = useUiPrefs();
  return {
    get: (k, fb) => prefs.getSync(`${ns}:${k}`, fb),
    set: (k, v) => prefs.set(`${ns}:${k}`, v),
    all: () => prefs.getSync(ns, {}),
    setAll: (obj) => prefs.setAll(obj)
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "gradebook",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const courseId = computed(() => String(route.query.courseId || route.params.courseId || "course-1"));
    const g = useGradebook();
    const kv = useKV();
    const loading = ref(false);
    const rows = ref([]);
    const tab = ref("grades");
    const editOpen = ref(false);
    const form = ref({ id: "", assignmentId: "", studentId: "", courseId: "", grade: 0, feedback: "" });
    const rubricJson = ref("");
    const cols = [
      { title: "Student", dataIndex: "studentId", key: "student" },
      { title: "Assignment", dataIndex: "assignmentId", key: "assignment" },
      { title: "Grade", dataIndex: "grade", key: "grade", customRender: ({ text, record }) => h("div", {}, text ?? "—") },
      { title: "Feedback", dataIndex: "feedback", key: "feedback", ellipsis: true },
      {
        title: "Actions",
        key: "actions",
        customRender: ({ record }) => h("div", {}, [
          h("a-button", { type: "link", onClick: () => openEdit(record) }, { default: () => [h(EditOutlined), " Edit"] })
        ])
      }
    ];
    function openEdit(rec) {
      form.value = { ...rec };
      editOpen.value = true;
    }
    async function refresh() {
      loading.value = true;
      try {
        rows.value = await g.list(courseId.value);
      } finally {
        loading.value = false;
      }
    }
    async function submit() {
      const saved = await g.upsert({ ...form.value, courseId: courseId.value });
      const idx = rows.value.findIndex((r) => r.id === saved.id);
      if (idx >= 0) rows.value[idx] = saved;
      else rows.value.unshift(saved);
      editOpen.value = false;
    }
    async function saveRubric() {
      await kv.set(`rubric:${courseId.value}`, rubricJson.value);
    }
    async function loadRubric() {
      rubricJson.value = await kv.get(`rubric:${courseId.value}`) || "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_StudentsNav = resolveComponent("StudentsNav");
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_divider = resolveComponent("a-divider");
      const _component_a_breadcrumb = resolveComponent("a-breadcrumb");
      const _component_a_breadcrumb_item = resolveComponent("a-breadcrumb-item");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_tabs = resolveComponent("a-tabs");
      const _component_a_tab_pane = resolveComponent("a-tab-pane");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_empty = resolveComponent("a-empty");
      const _component_a_alert = resolveComponent("a-alert");
      const _component_a_textarea = resolveComponent("a-textarea");
      const _component_a_drawer = resolveComponent("a-drawer");
      const _component_a_form = resolveComponent("a-form");
      const _component_a_form_item = resolveComponent("a-form-item");
      const _component_a_input_number = resolveComponent("a-input-number");
      _push(ssrRenderComponent(_component_a_layout, mergeProps({ class: "p-6" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_StudentsNav, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_page_header, {
              title: "Gradebook",
              "sub-title": courseId.value ? `Course · ${courseId.value}` : "Select course",
              onBack: ($event) => _ctx.$router.push("/"),
              class: "mb-4"
            }, {
              tags: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_tag, { color: "blue" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Students`);
                      } else {
                        return [
                          createTextVNode("Students")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_tag, { color: "purple" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Assessments`);
                      } else {
                        return [
                          createTextVNode("Assessments")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_tag, { color: "blue" }, {
                      default: withCtx(() => [
                        createTextVNode("Students")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_tag, { color: "purple" }, {
                      default: withCtx(() => [
                        createTextVNode("Assessments")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              extra: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_space, { wrap: "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_button, { onClick: refresh }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(SyncOutlined), null, null, _parent5, _scopeId4));
                              _push5(` Refresh`);
                            } else {
                              return [
                                createVNode(unref(SyncOutlined)),
                                createTextVNode(" Refresh")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_button, {
                          type: "primary",
                          onClick: _ctx.openRubric
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(ProfileOutlined), null, null, _parent5, _scopeId4));
                              _push5(` Rubric`);
                            } else {
                              return [
                                createVNode(unref(ProfileOutlined)),
                                createTextVNode(" Rubric")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_divider, { type: "vertical" }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_button, {
                          onClick: ($event) => _ctx.$router.push("/students/dashboard")
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Dashboard`);
                            } else {
                              return [
                                createTextVNode("Dashboard")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_button, {
                          onClick: ($event) => _ctx.$router.push("/courses")
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`My Courses`);
                            } else {
                              return [
                                createTextVNode("My Courses")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_button, { onClick: refresh }, {
                            default: withCtx(() => [
                              createVNode(unref(SyncOutlined)),
                              createTextVNode(" Refresh")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, {
                            type: "primary",
                            onClick: _ctx.openRubric
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(ProfileOutlined)),
                              createTextVNode(" Rubric")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(_component_a_divider, { type: "vertical" }),
                          createVNode(_component_a_button, {
                            onClick: ($event) => _ctx.$router.push("/students/dashboard")
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Dashboard")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(_component_a_button, {
                            onClick: ($event) => _ctx.$router.push("/courses")
                          }, {
                            default: withCtx(() => [
                              createTextVNode("My Courses")
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
                    createVNode(_component_a_space, { wrap: "" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_button, { onClick: refresh }, {
                          default: withCtx(() => [
                            createVNode(unref(SyncOutlined)),
                            createTextVNode(" Refresh")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_button, {
                          type: "primary",
                          onClick: _ctx.openRubric
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(ProfileOutlined)),
                            createTextVNode(" Rubric")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(_component_a_divider, { type: "vertical" }),
                        createVNode(_component_a_button, {
                          onClick: ($event) => _ctx.$router.push("/students/dashboard")
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Dashboard")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(_component_a_button, {
                          onClick: ($event) => _ctx.$router.push("/courses")
                        }, {
                          default: withCtx(() => [
                            createTextVNode("My Courses")
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
            _push2(ssrRenderComponent(_component_a_breadcrumb, { class: "mb-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_breadcrumb_item, {
                    onClick: ($event) => _ctx.$router.push("/"),
                    class: "cursor-pointer"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Home`);
                      } else {
                        return [
                          createTextVNode("Home")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_breadcrumb_item, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Students`);
                      } else {
                        return [
                          createTextVNode("Students")
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
                      onClick: ($event) => _ctx.$router.push("/"),
                      class: "cursor-pointer"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Home")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_component_a_breadcrumb_item, null, {
                      default: withCtx(() => [
                        createTextVNode("Students")
                      ]),
                      _: 1
                    }),
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
            _push2(ssrRenderComponent(_component_a_card, { bordered: false }, {
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
                              _push5(ssrRenderComponent(_component_a_table, {
                                "data-source": rows.value,
                                columns: cols,
                                "row-key": "id",
                                loading: loading.value
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_table, {
                                  "data-source": rows.value,
                                  columns: cols,
                                  "row-key": "id",
                                  loading: loading.value
                                }, null, 8, ["data-source", "loading"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_tab_pane, {
                          key: "comments",
                          tab: "Comments"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_empty, { description: "Select a row and add feedback in Grades tab." }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_empty, { description: "Select a row and add feedback in Grades tab." })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_tab_pane, {
                          key: "rubric",
                          tab: "Rubric"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_alert, {
                                type: "info",
                                message: "Store rubric JSON via server KV (no localStorage)",
                                "show-icon": "",
                                class: "mb-2"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_textarea, {
                                value: rubricJson.value,
                                "onUpdate:value": ($event) => rubricJson.value = $event,
                                rows: 10
                              }, null, _parent5, _scopeId4));
                              _push5(`<div class="mt-2" data-v-2e6fd3c8${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_space, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_button, {
                                      type: "primary",
                                      onClick: saveRubric
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Save rubric`);
                                        } else {
                                          return [
                                            createTextVNode("Save rubric")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_button, { onClick: loadRubric }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Load rubric`);
                                        } else {
                                          return [
                                            createTextVNode("Load rubric")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        onClick: saveRubric
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Save rubric")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_button, { onClick: loadRubric }, {
                                        default: withCtx(() => [
                                          createTextVNode("Load rubric")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                            } else {
                              return [
                                createVNode(_component_a_alert, {
                                  type: "info",
                                  message: "Store rubric JSON via server KV (no localStorage)",
                                  "show-icon": "",
                                  class: "mb-2"
                                }),
                                createVNode(_component_a_textarea, {
                                  value: rubricJson.value,
                                  "onUpdate:value": ($event) => rubricJson.value = $event,
                                  rows: 10
                                }, null, 8, ["value", "onUpdate:value"]),
                                createVNode("div", { class: "mt-2" }, [
                                  createVNode(_component_a_space, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        onClick: saveRubric
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Save rubric")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_button, { onClick: loadRubric }, {
                                        default: withCtx(() => [
                                          createTextVNode("Load rubric")
                                        ]),
                                        _: 1
                                      })
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
                              createVNode(_component_a_table, {
                                "data-source": rows.value,
                                columns: cols,
                                "row-key": "id",
                                loading: loading.value
                              }, null, 8, ["data-source", "loading"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_tab_pane, {
                            key: "comments",
                            tab: "Comments"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_empty, { description: "Select a row and add feedback in Grades tab." })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_tab_pane, {
                            key: "rubric",
                            tab: "Rubric"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_alert, {
                                type: "info",
                                message: "Store rubric JSON via server KV (no localStorage)",
                                "show-icon": "",
                                class: "mb-2"
                              }),
                              createVNode(_component_a_textarea, {
                                value: rubricJson.value,
                                "onUpdate:value": ($event) => rubricJson.value = $event,
                                rows: 10
                              }, null, 8, ["value", "onUpdate:value"]),
                              createVNode("div", { class: "mt-2" }, [
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      type: "primary",
                                      onClick: saveRubric
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Save rubric")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_button, { onClick: loadRubric }, {
                                      default: withCtx(() => [
                                        createTextVNode("Load rubric")
                                      ]),
                                      _: 1
                                    })
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
                            createVNode(_component_a_table, {
                              "data-source": rows.value,
                              columns: cols,
                              "row-key": "id",
                              loading: loading.value
                            }, null, 8, ["data-source", "loading"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_tab_pane, {
                          key: "comments",
                          tab: "Comments"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_empty, { description: "Select a row and add feedback in Grades tab." })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_tab_pane, {
                          key: "rubric",
                          tab: "Rubric"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_alert, {
                              type: "info",
                              message: "Store rubric JSON via server KV (no localStorage)",
                              "show-icon": "",
                              class: "mb-2"
                            }),
                            createVNode(_component_a_textarea, {
                              value: rubricJson.value,
                              "onUpdate:value": ($event) => rubricJson.value = $event,
                              rows: 10
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode("div", { class: "mt-2" }, [
                              createVNode(_component_a_space, null, {
                                default: withCtx(() => [
                                  createVNode(_component_a_button, {
                                    type: "primary",
                                    onClick: saveRubric
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Save rubric")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_button, { onClick: loadRubric }, {
                                    default: withCtx(() => [
                                      createTextVNode("Load rubric")
                                    ]),
                                    _: 1
                                  })
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
            _push2(ssrRenderComponent(_component_a_drawer, {
              open: editOpen.value,
              "onUpdate:open": ($event) => editOpen.value = $event,
              title: "Edit grade",
              placement: "right",
              width: "420"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_form, {
                    layout: "vertical",
                    onFinish: submit
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_form_item, { label: "Grade" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_input_number, {
                                value: form.value.grade,
                                "onUpdate:value": ($event) => form.value.grade = $event,
                                min: 0,
                                max: 100,
                                style: { "width": "100%" }
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_input_number, {
                                  value: form.value.grade,
                                  "onUpdate:value": ($event) => form.value.grade = $event,
                                  min: 0,
                                  max: 100,
                                  style: { "width": "100%" }
                                }, null, 8, ["value", "onUpdate:value"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_form_item, { label: "Feedback" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_textarea, {
                                value: form.value.feedback,
                                "onUpdate:value": ($event) => form.value.feedback = $event,
                                rows: 5
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_textarea, {
                                  value: form.value.feedback,
                                  "onUpdate:value": ($event) => form.value.feedback = $event,
                                  rows: 5
                                }, null, 8, ["value", "onUpdate:value"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_space, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_button, {
                                onClick: ($event) => editOpen.value = false
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Cancel`);
                                  } else {
                                    return [
                                      createTextVNode("Cancel")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_button, {
                                type: "primary",
                                "html-type": "submit"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Save`);
                                  } else {
                                    return [
                                      createTextVNode("Save")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_button, {
                                  onClick: ($event) => editOpen.value = false
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Cancel")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"]),
                                createVNode(_component_a_button, {
                                  type: "primary",
                                  "html-type": "submit"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Save")
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
                          createVNode(_component_a_form_item, { label: "Grade" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_input_number, {
                                value: form.value.grade,
                                "onUpdate:value": ($event) => form.value.grade = $event,
                                min: 0,
                                max: 100,
                                style: { "width": "100%" }
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_form_item, { label: "Feedback" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_textarea, {
                                value: form.value.feedback,
                                "onUpdate:value": ($event) => form.value.feedback = $event,
                                rows: 5
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_space, null, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, {
                                onClick: ($event) => editOpen.value = false
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Cancel")
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode(_component_a_button, {
                                type: "primary",
                                "html-type": "submit"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Save")
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
                    createVNode(_component_a_form, {
                      layout: "vertical",
                      onFinish: submit
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_form_item, { label: "Grade" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_input_number, {
                              value: form.value.grade,
                              "onUpdate:value": ($event) => form.value.grade = $event,
                              min: 0,
                              max: 100,
                              style: { "width": "100%" }
                            }, null, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_form_item, { label: "Feedback" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_textarea, {
                              value: form.value.feedback,
                              "onUpdate:value": ($event) => form.value.feedback = $event,
                              rows: 5
                            }, null, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_space, null, {
                          default: withCtx(() => [
                            createVNode(_component_a_button, {
                              onClick: ($event) => editOpen.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Cancel")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(_component_a_button, {
                              type: "primary",
                              "html-type": "submit"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Save")
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
              createVNode(_component_StudentsNav),
              createVNode(_component_a_page_header, {
                title: "Gradebook",
                "sub-title": courseId.value ? `Course · ${courseId.value}` : "Select course",
                onBack: ($event) => _ctx.$router.push("/"),
                class: "mb-4"
              }, {
                tags: withCtx(() => [
                  createVNode(_component_a_tag, { color: "blue" }, {
                    default: withCtx(() => [
                      createTextVNode("Students")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_tag, { color: "purple" }, {
                    default: withCtx(() => [
                      createTextVNode("Assessments")
                    ]),
                    _: 1
                  })
                ]),
                extra: withCtx(() => [
                  createVNode(_component_a_space, { wrap: "" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_button, { onClick: refresh }, {
                        default: withCtx(() => [
                          createVNode(unref(SyncOutlined)),
                          createTextVNode(" Refresh")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_button, {
                        type: "primary",
                        onClick: _ctx.openRubric
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(ProfileOutlined)),
                          createTextVNode(" Rubric")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(_component_a_divider, { type: "vertical" }),
                      createVNode(_component_a_button, {
                        onClick: ($event) => _ctx.$router.push("/students/dashboard")
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Dashboard")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(_component_a_button, {
                        onClick: ($event) => _ctx.$router.push("/courses")
                      }, {
                        default: withCtx(() => [
                          createTextVNode("My Courses")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["sub-title", "onBack"]),
              createVNode(_component_a_breadcrumb, { class: "mb-4" }, {
                default: withCtx(() => [
                  createVNode(_component_a_breadcrumb_item, {
                    onClick: ($event) => _ctx.$router.push("/"),
                    class: "cursor-pointer"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Home")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_a_breadcrumb_item, null, {
                    default: withCtx(() => [
                      createTextVNode("Students")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_breadcrumb_item, null, {
                    default: withCtx(() => [
                      createTextVNode("Gradebook")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_a_card, { bordered: false }, {
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
                          createVNode(_component_a_table, {
                            "data-source": rows.value,
                            columns: cols,
                            "row-key": "id",
                            loading: loading.value
                          }, null, 8, ["data-source", "loading"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_tab_pane, {
                        key: "comments",
                        tab: "Comments"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_empty, { description: "Select a row and add feedback in Grades tab." })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_tab_pane, {
                        key: "rubric",
                        tab: "Rubric"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_alert, {
                            type: "info",
                            message: "Store rubric JSON via server KV (no localStorage)",
                            "show-icon": "",
                            class: "mb-2"
                          }),
                          createVNode(_component_a_textarea, {
                            value: rubricJson.value,
                            "onUpdate:value": ($event) => rubricJson.value = $event,
                            rows: 10
                          }, null, 8, ["value", "onUpdate:value"]),
                          createVNode("div", { class: "mt-2" }, [
                            createVNode(_component_a_space, null, {
                              default: withCtx(() => [
                                createVNode(_component_a_button, {
                                  type: "primary",
                                  onClick: saveRubric
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Save rubric")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_button, { onClick: loadRubric }, {
                                  default: withCtx(() => [
                                    createTextVNode("Load rubric")
                                  ]),
                                  _: 1
                                })
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
              }),
              createVNode(_component_a_drawer, {
                open: editOpen.value,
                "onUpdate:open": ($event) => editOpen.value = $event,
                title: "Edit grade",
                placement: "right",
                width: "420"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_form, {
                    layout: "vertical",
                    onFinish: submit
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_form_item, { label: "Grade" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_input_number, {
                            value: form.value.grade,
                            "onUpdate:value": ($event) => form.value.grade = $event,
                            min: 0,
                            max: 100,
                            style: { "width": "100%" }
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_form_item, { label: "Feedback" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_textarea, {
                            value: form.value.feedback,
                            "onUpdate:value": ($event) => form.value.feedback = $event,
                            rows: 5
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_space, null, {
                        default: withCtx(() => [
                          createVNode(_component_a_button, {
                            onClick: ($event) => editOpen.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(_component_a_button, {
                            type: "primary",
                            "html-type": "submit"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Save")
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
              }, 8, ["open", "onUpdate:open"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/students-internal/nuxt/pages/gradebook.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const gradebook = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2e6fd3c8"]]);

export { gradebook as default };
//# sourceMappingURL=gradebook-D-CePvu1.mjs.map
