import { defineComponent, computed, ref, resolveComponent, mergeProps, withCtx, createVNode, createBlock, createCommentVNode, openBlock, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { message } from 'ant-design-vue';
import { _ as _export_sfc, d as useRoute, b as useRuntimeConfig } from './server.mjs';
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
    const route = useRoute();
    const runtime = useRuntimeConfig();
    const apiBase = runtime.public?.apiBase || runtime.public?.appBaseUrl || "";
    const institutionId = computed(() => route.query.institutionId || route.params?.institution_id || "inst_byway");
    const loading = ref(true);
    const members = ref([]);
    const roleFilter = ref(void 0);
    const currentRole = ref("none");
    ref(null);
    const teacherStudentIds = ref(/* @__PURE__ */ new Set());
    function resolveAuthHeader() {
      return null;
    }
    async function load() {
      loading.value = true;
      try {
        const auth = resolveAuthHeader();
        if (!auth) throw new Error("Missing auth token");
        const baseUrl = apiBase ? apiBase.replace(/\/$/, "") : "";
        const url = `${baseUrl}/api/institution-portal/people?institutionId=${encodeURIComponent(institutionId.value)}`;
        const resp = await fetch(url, { headers: { Authorization: auth } });
        if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`));
        const json = await resp.json();
        members.value = json.members || [];
      } catch (e) {
        message.error(e?.message || "Failed to load directory");
      } finally {
        loading.value = false;
      }
    }
    const filtered = computed(() => {
      let base = members.value;
      if (currentRole.value === "student") {
        base = base.filter((m) => m.role === "student");
      } else if (currentRole.value === "teacher") {
        base = base.filter((m) => m.role === "student" && teacherStudentIds.value.has(String(m.userId)));
      }
      return base.filter((m) => roleFilter.value ? m.role === roleFilter.value : true);
    });
    const roleOptions = [
      { label: "Student", value: "student" },
      { label: "Teacher", value: "teacher" },
      { label: "Admin", value: "admin" }
    ];
    const columns = [
      { title: "User ID", dataIndex: "userId", key: "userId" },
      { title: "Role", dataIndex: "role", key: "role" },
      { title: "Status", dataIndex: "status", key: "status" },
      { title: "Classrooms", dataIndex: "classroomCount", key: "classroomCount" }
    ];
    function navHref(key) {
      const qs = `?institutionId=${encodeURIComponent(institutionId.value)}`;
      if (key === "overview") return `/institution/portal${qs}`;
      if (key === "departments") return `/institution/departments/${qs}`;
      if (key === "classrooms") return `/institution/classrooms/${qs}`;
      if (key === "people") return `/institution/people${qs}`;
      if (key === "catalog") return `/institution/catalog${qs}`;
      if (key === "calendar") return `/institution/calendar${qs}`;
      if (key === "assignments") return `/institution/assignments/teachers${qs}`;
      return `/institution/portal${qs}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_menu = resolveComponent("a-menu");
      const _component_a_menu_item = resolveComponent("a-menu-item");
      const _component_a_select = resolveComponent("a-select");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_skeleton = resolveComponent("a-skeleton");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_table = resolveComponent("a-table");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "people-directory" }, _attrs))} data-v-fe4342e2>`);
      _push(ssrRenderComponent(_component_a_page_header, { title: "Institution People Directory" }, {
        extra: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_space, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_menu, {
                    mode: "horizontal",
                    selectedKeys: ["people"]
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "overview" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<a${ssrRenderAttr("href", navHref("overview"))} data-v-fe4342e2${_scopeId4}>Overview</a>`);
                            } else {
                              return [
                                createVNode("a", {
                                  href: navHref("overview")
                                }, "Overview", 8, ["href"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        if (currentRole.value === "admin") {
                          _push4(ssrRenderComponent(_component_a_menu_item, { key: "departments" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<a${ssrRenderAttr("href", navHref("departments"))} data-v-fe4342e2${_scopeId4}>Departments</a>`);
                              } else {
                                return [
                                  createVNode("a", {
                                    href: navHref("departments")
                                  }, "Departments", 8, ["href"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "classrooms" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<a${ssrRenderAttr("href", navHref("classrooms"))} data-v-fe4342e2${_scopeId4}>Classrooms</a>`);
                            } else {
                              return [
                                createVNode("a", {
                                  href: navHref("classrooms")
                                }, "Classrooms", 8, ["href"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "people" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<a${ssrRenderAttr("href", navHref("people"))} data-v-fe4342e2${_scopeId4}>People Directory</a>`);
                            } else {
                              return [
                                createVNode("a", {
                                  href: navHref("people")
                                }, "People Directory", 8, ["href"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "catalog" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<a${ssrRenderAttr("href", navHref("catalog"))} data-v-fe4342e2${_scopeId4}>Catalog</a>`);
                            } else {
                              return [
                                createVNode("a", {
                                  href: navHref("catalog")
                                }, "Catalog", 8, ["href"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "calendar" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<a${ssrRenderAttr("href", navHref("calendar"))} data-v-fe4342e2${_scopeId4}>Calendar</a>`);
                            } else {
                              return [
                                createVNode("a", {
                                  href: navHref("calendar")
                                }, "Calendar", 8, ["href"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "assignments" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<a${ssrRenderAttr("href", navHref("assignments"))} data-v-fe4342e2${_scopeId4}>Assignments</a>`);
                            } else {
                              return [
                                createVNode("a", {
                                  href: navHref("assignments")
                                }, "Assignments", 8, ["href"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_menu_item, { key: "overview" }, {
                            default: withCtx(() => [
                              createVNode("a", {
                                href: navHref("overview")
                              }, "Overview", 8, ["href"])
                            ]),
                            _: 1
                          }),
                          currentRole.value === "admin" ? (openBlock(), createBlock(_component_a_menu_item, { key: "departments" }, {
                            default: withCtx(() => [
                              createVNode("a", {
                                href: navHref("departments")
                              }, "Departments", 8, ["href"])
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          createVNode(_component_a_menu_item, { key: "classrooms" }, {
                            default: withCtx(() => [
                              createVNode("a", {
                                href: navHref("classrooms")
                              }, "Classrooms", 8, ["href"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, { key: "people" }, {
                            default: withCtx(() => [
                              createVNode("a", {
                                href: navHref("people")
                              }, "People Directory", 8, ["href"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, { key: "catalog" }, {
                            default: withCtx(() => [
                              createVNode("a", {
                                href: navHref("catalog")
                              }, "Catalog", 8, ["href"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, { key: "calendar" }, {
                            default: withCtx(() => [
                              createVNode("a", {
                                href: navHref("calendar")
                              }, "Calendar", 8, ["href"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, { key: "assignments" }, {
                            default: withCtx(() => [
                              createVNode("a", {
                                href: navHref("assignments")
                              }, "Assignments", 8, ["href"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_select, {
                    value: roleFilter.value,
                    "onUpdate:value": ($event) => roleFilter.value = $event,
                    options: roleOptions,
                    "allow-clear": "",
                    placeholder: "Filter by role",
                    style: { "width": "180px" }
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_button, {
                    size: "small",
                    onClick: load
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Reload`);
                      } else {
                        return [
                          createTextVNode("Reload")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_menu, {
                      mode: "horizontal",
                      selectedKeys: ["people"]
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_menu_item, { key: "overview" }, {
                          default: withCtx(() => [
                            createVNode("a", {
                              href: navHref("overview")
                            }, "Overview", 8, ["href"])
                          ]),
                          _: 1
                        }),
                        currentRole.value === "admin" ? (openBlock(), createBlock(_component_a_menu_item, { key: "departments" }, {
                          default: withCtx(() => [
                            createVNode("a", {
                              href: navHref("departments")
                            }, "Departments", 8, ["href"])
                          ]),
                          _: 1
                        })) : createCommentVNode("", true),
                        createVNode(_component_a_menu_item, { key: "classrooms" }, {
                          default: withCtx(() => [
                            createVNode("a", {
                              href: navHref("classrooms")
                            }, "Classrooms", 8, ["href"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu_item, { key: "people" }, {
                          default: withCtx(() => [
                            createVNode("a", {
                              href: navHref("people")
                            }, "People Directory", 8, ["href"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu_item, { key: "catalog" }, {
                          default: withCtx(() => [
                            createVNode("a", {
                              href: navHref("catalog")
                            }, "Catalog", 8, ["href"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu_item, { key: "calendar" }, {
                          default: withCtx(() => [
                            createVNode("a", {
                              href: navHref("calendar")
                            }, "Calendar", 8, ["href"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu_item, { key: "assignments" }, {
                          default: withCtx(() => [
                            createVNode("a", {
                              href: navHref("assignments")
                            }, "Assignments", 8, ["href"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_select, {
                      value: roleFilter.value,
                      "onUpdate:value": ($event) => roleFilter.value = $event,
                      options: roleOptions,
                      "allow-clear": "",
                      placeholder: "Filter by role",
                      style: { "width": "180px" }
                    }, null, 8, ["value", "onUpdate:value"]),
                    createVNode(_component_a_button, {
                      size: "small",
                      onClick: load
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Reload")
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
              createVNode(_component_a_space, null, {
                default: withCtx(() => [
                  createVNode(_component_a_menu, {
                    mode: "horizontal",
                    selectedKeys: ["people"]
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_menu_item, { key: "overview" }, {
                        default: withCtx(() => [
                          createVNode("a", {
                            href: navHref("overview")
                          }, "Overview", 8, ["href"])
                        ]),
                        _: 1
                      }),
                      currentRole.value === "admin" ? (openBlock(), createBlock(_component_a_menu_item, { key: "departments" }, {
                        default: withCtx(() => [
                          createVNode("a", {
                            href: navHref("departments")
                          }, "Departments", 8, ["href"])
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      createVNode(_component_a_menu_item, { key: "classrooms" }, {
                        default: withCtx(() => [
                          createVNode("a", {
                            href: navHref("classrooms")
                          }, "Classrooms", 8, ["href"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_menu_item, { key: "people" }, {
                        default: withCtx(() => [
                          createVNode("a", {
                            href: navHref("people")
                          }, "People Directory", 8, ["href"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_menu_item, { key: "catalog" }, {
                        default: withCtx(() => [
                          createVNode("a", {
                            href: navHref("catalog")
                          }, "Catalog", 8, ["href"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_menu_item, { key: "calendar" }, {
                        default: withCtx(() => [
                          createVNode("a", {
                            href: navHref("calendar")
                          }, "Calendar", 8, ["href"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_menu_item, { key: "assignments" }, {
                        default: withCtx(() => [
                          createVNode("a", {
                            href: navHref("assignments")
                          }, "Assignments", 8, ["href"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_select, {
                    value: roleFilter.value,
                    "onUpdate:value": ($event) => roleFilter.value = $event,
                    options: roleOptions,
                    "allow-clear": "",
                    placeholder: "Filter by role",
                    style: { "width": "180px" }
                  }, null, 8, ["value", "onUpdate:value"]),
                  createVNode(_component_a_button, {
                    size: "small",
                    onClick: load
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Reload")
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
      _push(ssrRenderComponent(_component_a_skeleton, {
        loading: loading.value,
        active: "",
        paragraph: { rows: 8 }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_card, { size: "small" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_table, {
                    size: "small",
                    columns,
                    dataSource: filtered.value,
                    "row-key": "id"
                  }, {
                    bodyCell: withCtx(({ column, record }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (column.dataIndex === "userId") {
                          _push4(`<a${ssrRenderAttr("href", `/institution/students/${record.userId}?institutionId=${encodeURIComponent(institutionId.value)}`)} data-v-fe4342e2${_scopeId3}>${ssrInterpolate(record.userId)}</a>`);
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          column.dataIndex === "userId" ? (openBlock(), createBlock("a", {
                            key: 0,
                            href: `/institution/students/${record.userId}?institutionId=${encodeURIComponent(institutionId.value)}`
                          }, toDisplayString(record.userId), 9, ["href"])) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_table, {
                      size: "small",
                      columns,
                      dataSource: filtered.value,
                      "row-key": "id"
                    }, {
                      bodyCell: withCtx(({ column, record }) => [
                        column.dataIndex === "userId" ? (openBlock(), createBlock("a", {
                          key: 0,
                          href: `/institution/students/${record.userId}?institutionId=${encodeURIComponent(institutionId.value)}`
                        }, toDisplayString(record.userId), 9, ["href"])) : createCommentVNode("", true)
                      ]),
                      _: 1
                    }, 8, ["dataSource"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_card, { size: "small" }, {
                default: withCtx(() => [
                  createVNode(_component_a_table, {
                    size: "small",
                    columns,
                    dataSource: filtered.value,
                    "row-key": "id"
                  }, {
                    bodyCell: withCtx(({ column, record }) => [
                      column.dataIndex === "userId" ? (openBlock(), createBlock("a", {
                        key: 0,
                        href: `/institution/students/${record.userId}?institutionId=${encodeURIComponent(institutionId.value)}`
                      }, toDisplayString(record.userId), 9, ["href"])) : createCommentVNode("", true)
                    ]),
                    _: 1
                  }, 8, ["dataSource"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/institution-portal/nuxt/pages/directory/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fe4342e2"]]);

export { index as default };
//# sourceMappingURL=index-SlhWBha5.mjs.map
