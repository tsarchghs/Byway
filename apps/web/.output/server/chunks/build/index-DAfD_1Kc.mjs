import { defineComponent, computed, ref, watch, resolveComponent, mergeProps, withCtx, createVNode, createBlock, createCommentVNode, openBlock, createTextVNode, toDisplayString, useSSRContext } from 'vue';
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
    function navHref(key) {
      const qs = `?institutionId=${encodeURIComponent(institutionId.value)}`;
      const firstClassroomId = classrooms.value[0]?.id;
      const firstDepartmentId = classrooms.value.find((c) => c.departmentId)?.departmentId;
      if (key === "overview") return `/institution/portal${qs}`;
      if (key === "departments") return firstDepartmentId ? `/institution/departments/${encodeURIComponent(firstDepartmentId)}${qs}` : `/institution/portal${qs}`;
      if (key === "classrooms") return firstClassroomId ? `/institution/classrooms/${encodeURIComponent(firstClassroomId)}${qs}` : `/institution/portal${qs}`;
      if (key === "people") return `/institution/people${qs}`;
      if (key === "catalog") return `/institution/catalog${qs}`;
      if (key === "calendar") return `/institution/calendar${qs}`;
      if (key === "assignments") return `/institution/assignments/teachers${qs}`;
      return `/institution/portal${qs}`;
    }
    const roles = ["student", "teacher", "admin"];
    const route = useRoute();
    const runtime = useRuntimeConfig();
    const apiBase = runtime.public?.apiBase || runtime.public?.appBaseUrl || "";
    const institutionId = computed(() => route.query.institutionId || route.params?.institution_id || "inst_byway");
    const activeRole = ref("student");
    const currentRole = ref("none");
    ref(null);
    const activeTab = ref("overview");
    const loading = ref(true);
    const institution = ref(null);
    const stats = ref({ departments: 0, classrooms: 0, members: 0 });
    const classrooms = ref([]);
    const courses = ref([]);
    const assignments = ref([]);
    const overviewItems = ref([]);
    function resolveAuthHeader() {
      return null;
    }
    const title = computed(() => "Institution Portal");
    const subtitle = computed(() => activeRole.value.charAt(0).toUpperCase() + activeRole.value.slice(1));
    const mainTitle = computed(() => activeRole.value === "student" ? "Student Dashboard" : activeRole.value === "teacher" ? "Teacher Dashboard" : "Admin Dashboard");
    async function load() {
      loading.value = true;
      try {
        const auth = resolveAuthHeader();
        if (!auth) throw new Error("Missing auth token");
        const baseUrl = apiBase ? apiBase.replace(/\/$/, "") : "";
        const path = activeRole.value === "student" ? "/api/institution-portal/student-dashboard" : activeRole.value === "teacher" ? "/api/institution-portal/teacher-dashboard" : "/api/institution-portal/admin-dashboard";
        const params = new URLSearchParams();
        params.set("institutionId", institutionId.value);
        const url = `${baseUrl}${path}?${params.toString()}`;
        const resp = await fetch(url, { headers: { Authorization: auth } });
        if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`));
        const json = await resp.json();
        institution.value = json.institution || null;
        stats.value = json.stats || stats.value;
        classrooms.value = json.classrooms || [];
        courses.value = json.courses || [];
        assignments.value = json.assignments || [];
        overviewItems.value = json.overview || [];
      } catch (e) {
        message.error(e?.message || "Failed to load portal");
      } finally {
        loading.value = false;
      }
    }
    watch(activeRole, () => load());
    watch(institutionId, () => load());
    const classroomColumns = [
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Code", dataIndex: "code", key: "code" },
      { title: "Department", dataIndex: "departmentName", key: "departmentName" },
      { title: "Status", dataIndex: "status", key: "status" }
    ];
    const courseColumns = [
      { title: "Course", dataIndex: "title", key: "title" },
      { title: "Category", dataIndex: "category", key: "category" },
      { title: "Difficulty", dataIndex: "difficulty", key: "difficulty" },
      { title: "Progress", dataIndex: "progressPct", key: "progressPct" }
    ];
    const assignmentColumns = [
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Classroom", dataIndex: "classroomName", key: "classroomName" },
      { title: "Due", dataIndex: "dueDate", key: "dueDate" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_menu = resolveComponent("a-menu");
      const _component_a_menu_item = resolveComponent("a-menu-item");
      const _component_a_segmented = resolveComponent("a-segmented");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_skeleton = resolveComponent("a-skeleton");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_tabs = resolveComponent("a-tabs");
      const _component_a_tab_pane = resolveComponent("a-tab-pane");
      const _component_a_statistic = resolveComponent("a-statistic");
      const _component_a_divider = resolveComponent("a-divider");
      const _component_a_list = resolveComponent("a-list");
      const _component_a_list_item = resolveComponent("a-list-item");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_descriptions = resolveComponent("a-descriptions");
      const _component_a_descriptions_item = resolveComponent("a-descriptions-item");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "institution-cockpit" }, _attrs))} data-v-11a37c14>`);
      _push(ssrRenderComponent(_component_a_page_header, {
        title: title.value,
        "sub-title": subtitle.value
      }, {
        extra: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_space, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_menu, {
                    mode: "horizontal",
                    selectedKeys: ["overview"]
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "overview" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<a${ssrRenderAttr("href", navHref("overview"))} data-v-11a37c14${_scopeId4}>Overview</a>`);
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
                                _push5(`<a${ssrRenderAttr("href", navHref("departments"))} data-v-11a37c14${_scopeId4}>Departments</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("classrooms"))} data-v-11a37c14${_scopeId4}>Classrooms</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("people"))} data-v-11a37c14${_scopeId4}>People Directory</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("catalog"))} data-v-11a37c14${_scopeId4}>Catalog</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("calendar"))} data-v-11a37c14${_scopeId4}>Calendar</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("assignments"))} data-v-11a37c14${_scopeId4}>Assignments</a>`);
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
                  _push3(ssrRenderComponent(_component_a_segmented, {
                    value: activeRole.value,
                    "onUpdate:value": ($event) => activeRole.value = $event,
                    options: roles
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
                  _push3(ssrRenderComponent(_component_a_button, {
                    size: "small",
                    href: "/institution/join"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Join Institution`);
                      } else {
                        return [
                          createTextVNode("Join Institution")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_menu, {
                      mode: "horizontal",
                      selectedKeys: ["overview"]
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
                    createVNode(_component_a_segmented, {
                      value: activeRole.value,
                      "onUpdate:value": ($event) => activeRole.value = $event,
                      options: roles
                    }, null, 8, ["value", "onUpdate:value"]),
                    createVNode(_component_a_button, {
                      size: "small",
                      onClick: load
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Reload")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_button, {
                      size: "small",
                      href: "/institution/join"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Join Institution")
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
                    selectedKeys: ["overview"]
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
                  createVNode(_component_a_segmented, {
                    value: activeRole.value,
                    "onUpdate:value": ($event) => activeRole.value = $event,
                    options: roles
                  }, null, 8, ["value", "onUpdate:value"]),
                  createVNode(_component_a_button, {
                    size: "small",
                    onClick: load
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Reload")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_button, {
                    size: "small",
                    href: "/institution/join"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Join Institution")
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
            _push2(ssrRenderComponent(_component_a_row, { gutter: 16 }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_col, { span: 16 }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_card, {
                          title: mainTitle.value,
                          size: "small"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_tabs, {
                                activeKey: activeTab.value,
                                "onUpdate:activeKey": ($event) => activeTab.value = $event
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_tab_pane, {
                                      key: "overview",
                                      tab: "Overview"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_row, { gutter: 16 }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_a_col, { span: 8 }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(_component_a_statistic, {
                                                        title: "Departments",
                                                        value: stats.value.departments
                                                      }, null, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(_component_a_statistic, {
                                                          title: "Departments",
                                                          value: stats.value.departments
                                                        }, null, 8, ["value"])
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(_component_a_col, { span: 8 }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(_component_a_statistic, {
                                                        title: "Classrooms",
                                                        value: stats.value.classrooms
                                                      }, null, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(_component_a_statistic, {
                                                          title: "Classrooms",
                                                          value: stats.value.classrooms
                                                        }, null, 8, ["value"])
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(_component_a_col, { span: 8 }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(_component_a_statistic, {
                                                        title: "Members",
                                                        value: stats.value.members
                                                      }, null, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(_component_a_statistic, {
                                                          title: "Members",
                                                          value: stats.value.members
                                                        }, null, 8, ["value"])
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(_component_a_col, { span: 8 }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_statistic, {
                                                        title: "Departments",
                                                        value: stats.value.departments
                                                      }, null, 8, ["value"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(_component_a_col, { span: 8 }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_statistic, {
                                                        title: "Classrooms",
                                                        value: stats.value.classrooms
                                                      }, null, 8, ["value"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(_component_a_col, { span: 8 }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_statistic, {
                                                        title: "Members",
                                                        value: stats.value.members
                                                      }, null, 8, ["value"])
                                                    ]),
                                                    _: 1
                                                  })
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_divider, null, null, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_list, {
                                            size: "small",
                                            "data-source": overviewItems.value
                                          }, {
                                            renderItem: withCtx(({ item }, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_a_list_item, null, {
                                                  default: withCtx((_7, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(`<div class="row-item" data-v-11a37c14${_scopeId8}><span class="row-title" data-v-11a37c14${_scopeId8}>${ssrInterpolate(item.title)}</span><span class="row-meta" data-v-11a37c14${_scopeId8}>${ssrInterpolate(item.meta)}</span></div>`);
                                                    } else {
                                                      return [
                                                        createVNode("div", { class: "row-item" }, [
                                                          createVNode("span", { class: "row-title" }, toDisplayString(item.title), 1),
                                                          createVNode("span", { class: "row-meta" }, toDisplayString(item.meta), 1)
                                                        ])
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(_component_a_list_item, null, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "row-item" }, [
                                                        createVNode("span", { class: "row-title" }, toDisplayString(item.title), 1),
                                                        createVNode("span", { class: "row-meta" }, toDisplayString(item.meta), 1)
                                                      ])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_row, { gutter: 16 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_col, { span: 8 }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_statistic, {
                                                      title: "Departments",
                                                      value: stats.value.departments
                                                    }, null, 8, ["value"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_col, { span: 8 }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_statistic, {
                                                      title: "Classrooms",
                                                      value: stats.value.classrooms
                                                    }, null, 8, ["value"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_col, { span: 8 }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_statistic, {
                                                      title: "Members",
                                                      value: stats.value.members
                                                    }, null, 8, ["value"])
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_divider),
                                            createVNode(_component_a_list, {
                                              size: "small",
                                              "data-source": overviewItems.value
                                            }, {
                                              renderItem: withCtx(({ item }) => [
                                                createVNode(_component_a_list_item, null, {
                                                  default: withCtx(() => [
                                                    createVNode("div", { class: "row-item" }, [
                                                      createVNode("span", { class: "row-title" }, toDisplayString(item.title), 1),
                                                      createVNode("span", { class: "row-meta" }, toDisplayString(item.meta), 1)
                                                    ])
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
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_tab_pane, {
                                      key: "classrooms",
                                      tab: "Classrooms"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_table, {
                                            size: "small",
                                            columns: classroomColumns,
                                            dataSource: classrooms.value,
                                            "row-key": "id"
                                          }, {
                                            bodyCell: withCtx(({ column, record }, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                if (column.dataIndex === "title") {
                                                  _push8(`<a${ssrRenderAttr("href", `/institution/classrooms/${record.id}?institutionId=${encodeURIComponent(institutionId.value)}`)} data-v-11a37c14${_scopeId7}>${ssrInterpolate(record.title || record.code)}</a>`);
                                                } else {
                                                  _push8(`<!---->`);
                                                }
                                              } else {
                                                return [
                                                  column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                                    key: 0,
                                                    href: `/institution/classrooms/${record.id}?institutionId=${encodeURIComponent(institutionId.value)}`
                                                  }, toDisplayString(record.title || record.code), 9, ["href"])) : createCommentVNode("", true)
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_table, {
                                              size: "small",
                                              columns: classroomColumns,
                                              dataSource: classrooms.value,
                                              "row-key": "id"
                                            }, {
                                              bodyCell: withCtx(({ column, record }) => [
                                                column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                                  key: 0,
                                                  href: `/institution/classrooms/${record.id}?institutionId=${encodeURIComponent(institutionId.value)}`
                                                }, toDisplayString(record.title || record.code), 9, ["href"])) : createCommentVNode("", true)
                                              ]),
                                              _: 1
                                            }, 8, ["dataSource"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    if (activeRole.value === "student") {
                                      _push6(ssrRenderComponent(_component_a_tab_pane, {
                                        key: "courses",
                                        tab: "Courses"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_table, {
                                              size: "small",
                                              columns: courseColumns,
                                              dataSource: courses.value,
                                              "row-key": "courseId"
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_table, {
                                                size: "small",
                                                columns: courseColumns,
                                                dataSource: courses.value,
                                                "row-key": "courseId"
                                              }, null, 8, ["dataSource"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                    if (activeRole.value === "teacher") {
                                      _push6(ssrRenderComponent(_component_a_tab_pane, {
                                        key: "assignments",
                                        tab: "Assignments"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_table, {
                                              size: "small",
                                              columns: assignmentColumns,
                                              dataSource: assignments.value,
                                              "row-key": "id"
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_table, {
                                                size: "small",
                                                columns: assignmentColumns,
                                                dataSource: assignments.value,
                                                "row-key": "id"
                                              }, null, 8, ["dataSource"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                  } else {
                                    return [
                                      createVNode(_component_a_tab_pane, {
                                        key: "overview",
                                        tab: "Overview"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_row, { gutter: 16 }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_col, { span: 8 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_statistic, {
                                                    title: "Departments",
                                                    value: stats.value.departments
                                                  }, null, 8, ["value"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_col, { span: 8 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_statistic, {
                                                    title: "Classrooms",
                                                    value: stats.value.classrooms
                                                  }, null, 8, ["value"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_col, { span: 8 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_statistic, {
                                                    title: "Members",
                                                    value: stats.value.members
                                                  }, null, 8, ["value"])
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_divider),
                                          createVNode(_component_a_list, {
                                            size: "small",
                                            "data-source": overviewItems.value
                                          }, {
                                            renderItem: withCtx(({ item }) => [
                                              createVNode(_component_a_list_item, null, {
                                                default: withCtx(() => [
                                                  createVNode("div", { class: "row-item" }, [
                                                    createVNode("span", { class: "row-title" }, toDisplayString(item.title), 1),
                                                    createVNode("span", { class: "row-meta" }, toDisplayString(item.meta), 1)
                                                  ])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 1
                                          }, 8, ["data-source"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_tab_pane, {
                                        key: "classrooms",
                                        tab: "Classrooms"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_table, {
                                            size: "small",
                                            columns: classroomColumns,
                                            dataSource: classrooms.value,
                                            "row-key": "id"
                                          }, {
                                            bodyCell: withCtx(({ column, record }) => [
                                              column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                                key: 0,
                                                href: `/institution/classrooms/${record.id}?institutionId=${encodeURIComponent(institutionId.value)}`
                                              }, toDisplayString(record.title || record.code), 9, ["href"])) : createCommentVNode("", true)
                                            ]),
                                            _: 1
                                          }, 8, ["dataSource"])
                                        ]),
                                        _: 1
                                      }),
                                      activeRole.value === "student" ? (openBlock(), createBlock(_component_a_tab_pane, {
                                        key: "courses",
                                        tab: "Courses"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_table, {
                                            size: "small",
                                            columns: courseColumns,
                                            dataSource: courses.value,
                                            "row-key": "courseId"
                                          }, null, 8, ["dataSource"])
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true),
                                      activeRole.value === "teacher" ? (openBlock(), createBlock(_component_a_tab_pane, {
                                        key: "assignments",
                                        tab: "Assignments"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_table, {
                                            size: "small",
                                            columns: assignmentColumns,
                                            dataSource: assignments.value,
                                            "row-key": "id"
                                          }, null, 8, ["dataSource"])
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_tabs, {
                                  activeKey: activeTab.value,
                                  "onUpdate:activeKey": ($event) => activeTab.value = $event
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_tab_pane, {
                                      key: "overview",
                                      tab: "Overview"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_row, { gutter: 16 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_col, { span: 8 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_statistic, {
                                                  title: "Departments",
                                                  value: stats.value.departments
                                                }, null, 8, ["value"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_col, { span: 8 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_statistic, {
                                                  title: "Classrooms",
                                                  value: stats.value.classrooms
                                                }, null, 8, ["value"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_col, { span: 8 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_statistic, {
                                                  title: "Members",
                                                  value: stats.value.members
                                                }, null, 8, ["value"])
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_divider),
                                        createVNode(_component_a_list, {
                                          size: "small",
                                          "data-source": overviewItems.value
                                        }, {
                                          renderItem: withCtx(({ item }) => [
                                            createVNode(_component_a_list_item, null, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "row-item" }, [
                                                  createVNode("span", { class: "row-title" }, toDisplayString(item.title), 1),
                                                  createVNode("span", { class: "row-meta" }, toDisplayString(item.meta), 1)
                                                ])
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 1
                                        }, 8, ["data-source"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_tab_pane, {
                                      key: "classrooms",
                                      tab: "Classrooms"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_table, {
                                          size: "small",
                                          columns: classroomColumns,
                                          dataSource: classrooms.value,
                                          "row-key": "id"
                                        }, {
                                          bodyCell: withCtx(({ column, record }) => [
                                            column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                              key: 0,
                                              href: `/institution/classrooms/${record.id}?institutionId=${encodeURIComponent(institutionId.value)}`
                                            }, toDisplayString(record.title || record.code), 9, ["href"])) : createCommentVNode("", true)
                                          ]),
                                          _: 1
                                        }, 8, ["dataSource"])
                                      ]),
                                      _: 1
                                    }),
                                    activeRole.value === "student" ? (openBlock(), createBlock(_component_a_tab_pane, {
                                      key: "courses",
                                      tab: "Courses"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_table, {
                                          size: "small",
                                          columns: courseColumns,
                                          dataSource: courses.value,
                                          "row-key": "courseId"
                                        }, null, 8, ["dataSource"])
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true),
                                    activeRole.value === "teacher" ? (openBlock(), createBlock(_component_a_tab_pane, {
                                      key: "assignments",
                                      tab: "Assignments"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_table, {
                                          size: "small",
                                          columns: assignmentColumns,
                                          dataSource: assignments.value,
                                          "row-key": "id"
                                        }, null, 8, ["dataSource"])
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true)
                                  ]),
                                  _: 1
                                }, 8, ["activeKey", "onUpdate:activeKey"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_card, {
                            title: mainTitle.value,
                            size: "small"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_tabs, {
                                activeKey: activeTab.value,
                                "onUpdate:activeKey": ($event) => activeTab.value = $event
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_tab_pane, {
                                    key: "overview",
                                    tab: "Overview"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_row, { gutter: 16 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_col, { span: 8 }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_statistic, {
                                                title: "Departments",
                                                value: stats.value.departments
                                              }, null, 8, ["value"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_col, { span: 8 }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_statistic, {
                                                title: "Classrooms",
                                                value: stats.value.classrooms
                                              }, null, 8, ["value"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_col, { span: 8 }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_statistic, {
                                                title: "Members",
                                                value: stats.value.members
                                              }, null, 8, ["value"])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_divider),
                                      createVNode(_component_a_list, {
                                        size: "small",
                                        "data-source": overviewItems.value
                                      }, {
                                        renderItem: withCtx(({ item }) => [
                                          createVNode(_component_a_list_item, null, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "row-item" }, [
                                                createVNode("span", { class: "row-title" }, toDisplayString(item.title), 1),
                                                createVNode("span", { class: "row-meta" }, toDisplayString(item.meta), 1)
                                              ])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 1
                                      }, 8, ["data-source"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_tab_pane, {
                                    key: "classrooms",
                                    tab: "Classrooms"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_table, {
                                        size: "small",
                                        columns: classroomColumns,
                                        dataSource: classrooms.value,
                                        "row-key": "id"
                                      }, {
                                        bodyCell: withCtx(({ column, record }) => [
                                          column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                            key: 0,
                                            href: `/institution/classrooms/${record.id}?institutionId=${encodeURIComponent(institutionId.value)}`
                                          }, toDisplayString(record.title || record.code), 9, ["href"])) : createCommentVNode("", true)
                                        ]),
                                        _: 1
                                      }, 8, ["dataSource"])
                                    ]),
                                    _: 1
                                  }),
                                  activeRole.value === "student" ? (openBlock(), createBlock(_component_a_tab_pane, {
                                    key: "courses",
                                    tab: "Courses"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_table, {
                                        size: "small",
                                        columns: courseColumns,
                                        dataSource: courses.value,
                                        "row-key": "courseId"
                                      }, null, 8, ["dataSource"])
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true),
                                  activeRole.value === "teacher" ? (openBlock(), createBlock(_component_a_tab_pane, {
                                    key: "assignments",
                                    tab: "Assignments"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_table, {
                                        size: "small",
                                        columns: assignmentColumns,
                                        dataSource: assignments.value,
                                        "row-key": "id"
                                      }, null, 8, ["dataSource"])
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true)
                                ]),
                                _: 1
                              }, 8, ["activeKey", "onUpdate:activeKey"])
                            ]),
                            _: 1
                          }, 8, ["title"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_col, { span: 8 }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_card, {
                          size: "small",
                          title: "Quick Links"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_space, {
                                direction: "vertical",
                                style: { "width": "100%" }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_button, {
                                      type: "link",
                                      href: `/institution/catalog`
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Course Catalog`);
                                        } else {
                                          return [
                                            createTextVNode("Course Catalog")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_button, {
                                      type: "link",
                                      href: `/institution/people`
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`People Directory`);
                                        } else {
                                          return [
                                            createTextVNode("People Directory")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    if (currentRole.value !== "student") {
                                      _push6(ssrRenderComponent(_component_a_button, {
                                        type: "link",
                                        href: `/institution/assignments/teachers`
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`Teacher Assignments`);
                                          } else {
                                            return [
                                              createTextVNode("Teacher Assignments")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                  } else {
                                    return [
                                      createVNode(_component_a_button, {
                                        type: "link",
                                        href: `/institution/catalog`
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Course Catalog")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_button, {
                                        type: "link",
                                        href: `/institution/people`
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("People Directory")
                                        ]),
                                        _: 1
                                      }),
                                      currentRole.value !== "student" ? (openBlock(), createBlock(_component_a_button, {
                                        key: 0,
                                        type: "link",
                                        href: `/institution/assignments/teachers`
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Teacher Assignments")
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_space, {
                                  direction: "vertical",
                                  style: { "width": "100%" }
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      type: "link",
                                      href: `/institution/catalog`
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Course Catalog")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_button, {
                                      type: "link",
                                      href: `/institution/people`
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("People Directory")
                                      ]),
                                      _: 1
                                    }),
                                    currentRole.value !== "student" ? (openBlock(), createBlock(_component_a_button, {
                                      key: 0,
                                      type: "link",
                                      href: `/institution/assignments/teachers`
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Teacher Assignments")
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
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_card, {
                          size: "small",
                          title: "Institution",
                          style: { "margin-top": "16px" }
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_descriptions, {
                                column: 1,
                                size: "small"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_descriptions_item, { label: "Name" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(institution.value?.name)}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(institution.value?.name), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_descriptions_item, { label: "Slug" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(institution.value?.slug)}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(institution.value?.slug), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_descriptions_item, { label: "Type" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(institution.value?.type || "—")}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(institution.value?.type || "—"), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_descriptions_item, { label: "Location" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(institution.value?.location || "—")}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(institution.value?.location || "—"), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_descriptions_item, { label: "Name" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(institution.value?.name), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_descriptions_item, { label: "Slug" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(institution.value?.slug), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_descriptions_item, { label: "Type" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(institution.value?.type || "—"), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(institution.value?.location || "—"), 1)
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_descriptions, {
                                  column: 1,
                                  size: "small"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_descriptions_item, { label: "Name" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(institution.value?.name), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "Slug" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(institution.value?.slug), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "Type" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(institution.value?.type || "—"), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(institution.value?.location || "—"), 1)
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
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_card, {
                            size: "small",
                            title: "Quick Links"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_space, {
                                direction: "vertical",
                                style: { "width": "100%" }
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_button, {
                                    type: "link",
                                    href: `/institution/catalog`
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Course Catalog")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_button, {
                                    type: "link",
                                    href: `/institution/people`
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("People Directory")
                                    ]),
                                    _: 1
                                  }),
                                  currentRole.value !== "student" ? (openBlock(), createBlock(_component_a_button, {
                                    key: 0,
                                    type: "link",
                                    href: `/institution/assignments/teachers`
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Teacher Assignments")
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_card, {
                            size: "small",
                            title: "Institution",
                            style: { "margin-top": "16px" }
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_descriptions, {
                                column: 1,
                                size: "small"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_descriptions_item, { label: "Name" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(institution.value?.name), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_descriptions_item, { label: "Slug" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(institution.value?.slug), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_descriptions_item, { label: "Type" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(institution.value?.type || "—"), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(institution.value?.location || "—"), 1)
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_col, { span: 16 }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          title: mainTitle.value,
                          size: "small"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_tabs, {
                              activeKey: activeTab.value,
                              "onUpdate:activeKey": ($event) => activeTab.value = $event
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_tab_pane, {
                                  key: "overview",
                                  tab: "Overview"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_row, { gutter: 16 }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_col, { span: 8 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_statistic, {
                                              title: "Departments",
                                              value: stats.value.departments
                                            }, null, 8, ["value"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_col, { span: 8 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_statistic, {
                                              title: "Classrooms",
                                              value: stats.value.classrooms
                                            }, null, 8, ["value"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_col, { span: 8 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_statistic, {
                                              title: "Members",
                                              value: stats.value.members
                                            }, null, 8, ["value"])
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_divider),
                                    createVNode(_component_a_list, {
                                      size: "small",
                                      "data-source": overviewItems.value
                                    }, {
                                      renderItem: withCtx(({ item }) => [
                                        createVNode(_component_a_list_item, null, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "row-item" }, [
                                              createVNode("span", { class: "row-title" }, toDisplayString(item.title), 1),
                                              createVNode("span", { class: "row-meta" }, toDisplayString(item.meta), 1)
                                            ])
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 1
                                    }, 8, ["data-source"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_tab_pane, {
                                  key: "classrooms",
                                  tab: "Classrooms"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_table, {
                                      size: "small",
                                      columns: classroomColumns,
                                      dataSource: classrooms.value,
                                      "row-key": "id"
                                    }, {
                                      bodyCell: withCtx(({ column, record }) => [
                                        column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                          key: 0,
                                          href: `/institution/classrooms/${record.id}?institutionId=${encodeURIComponent(institutionId.value)}`
                                        }, toDisplayString(record.title || record.code), 9, ["href"])) : createCommentVNode("", true)
                                      ]),
                                      _: 1
                                    }, 8, ["dataSource"])
                                  ]),
                                  _: 1
                                }),
                                activeRole.value === "student" ? (openBlock(), createBlock(_component_a_tab_pane, {
                                  key: "courses",
                                  tab: "Courses"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_table, {
                                      size: "small",
                                      columns: courseColumns,
                                      dataSource: courses.value,
                                      "row-key": "courseId"
                                    }, null, 8, ["dataSource"])
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                activeRole.value === "teacher" ? (openBlock(), createBlock(_component_a_tab_pane, {
                                  key: "assignments",
                                  tab: "Assignments"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_table, {
                                      size: "small",
                                      columns: assignmentColumns,
                                      dataSource: assignments.value,
                                      "row-key": "id"
                                    }, null, 8, ["dataSource"])
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ]),
                              _: 1
                            }, 8, ["activeKey", "onUpdate:activeKey"])
                          ]),
                          _: 1
                        }, 8, ["title"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, { span: 8 }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          size: "small",
                          title: "Quick Links"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_space, {
                              direction: "vertical",
                              style: { "width": "100%" }
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_button, {
                                  type: "link",
                                  href: `/institution/catalog`
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Course Catalog")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_button, {
                                  type: "link",
                                  href: `/institution/people`
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("People Directory")
                                  ]),
                                  _: 1
                                }),
                                currentRole.value !== "student" ? (openBlock(), createBlock(_component_a_button, {
                                  key: 0,
                                  type: "link",
                                  href: `/institution/assignments/teachers`
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Teacher Assignments")
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_card, {
                          size: "small",
                          title: "Institution",
                          style: { "margin-top": "16px" }
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_descriptions, {
                              column: 1,
                              size: "small"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_descriptions_item, { label: "Name" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(institution.value?.name), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions_item, { label: "Slug" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(institution.value?.slug), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions_item, { label: "Type" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(institution.value?.type || "—"), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(institution.value?.location || "—"), 1)
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
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_row, { gutter: 16 }, {
                default: withCtx(() => [
                  createVNode(_component_a_col, { span: 16 }, {
                    default: withCtx(() => [
                      createVNode(_component_a_card, {
                        title: mainTitle.value,
                        size: "small"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_tabs, {
                            activeKey: activeTab.value,
                            "onUpdate:activeKey": ($event) => activeTab.value = $event
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_tab_pane, {
                                key: "overview",
                                tab: "Overview"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_row, { gutter: 16 }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_col, { span: 8 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_statistic, {
                                            title: "Departments",
                                            value: stats.value.departments
                                          }, null, 8, ["value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_col, { span: 8 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_statistic, {
                                            title: "Classrooms",
                                            value: stats.value.classrooms
                                          }, null, 8, ["value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_col, { span: 8 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_statistic, {
                                            title: "Members",
                                            value: stats.value.members
                                          }, null, 8, ["value"])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_divider),
                                  createVNode(_component_a_list, {
                                    size: "small",
                                    "data-source": overviewItems.value
                                  }, {
                                    renderItem: withCtx(({ item }) => [
                                      createVNode(_component_a_list_item, null, {
                                        default: withCtx(() => [
                                          createVNode("div", { class: "row-item" }, [
                                            createVNode("span", { class: "row-title" }, toDisplayString(item.title), 1),
                                            createVNode("span", { class: "row-meta" }, toDisplayString(item.meta), 1)
                                          ])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 1
                                  }, 8, ["data-source"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_tab_pane, {
                                key: "classrooms",
                                tab: "Classrooms"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_table, {
                                    size: "small",
                                    columns: classroomColumns,
                                    dataSource: classrooms.value,
                                    "row-key": "id"
                                  }, {
                                    bodyCell: withCtx(({ column, record }) => [
                                      column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                        key: 0,
                                        href: `/institution/classrooms/${record.id}?institutionId=${encodeURIComponent(institutionId.value)}`
                                      }, toDisplayString(record.title || record.code), 9, ["href"])) : createCommentVNode("", true)
                                    ]),
                                    _: 1
                                  }, 8, ["dataSource"])
                                ]),
                                _: 1
                              }),
                              activeRole.value === "student" ? (openBlock(), createBlock(_component_a_tab_pane, {
                                key: "courses",
                                tab: "Courses"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_table, {
                                    size: "small",
                                    columns: courseColumns,
                                    dataSource: courses.value,
                                    "row-key": "courseId"
                                  }, null, 8, ["dataSource"])
                                ]),
                                _: 1
                              })) : createCommentVNode("", true),
                              activeRole.value === "teacher" ? (openBlock(), createBlock(_component_a_tab_pane, {
                                key: "assignments",
                                tab: "Assignments"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_table, {
                                    size: "small",
                                    columns: assignmentColumns,
                                    dataSource: assignments.value,
                                    "row-key": "id"
                                  }, null, 8, ["dataSource"])
                                ]),
                                _: 1
                              })) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }, 8, ["activeKey", "onUpdate:activeKey"])
                        ]),
                        _: 1
                      }, 8, ["title"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_col, { span: 8 }, {
                    default: withCtx(() => [
                      createVNode(_component_a_card, {
                        size: "small",
                        title: "Quick Links"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_space, {
                            direction: "vertical",
                            style: { "width": "100%" }
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, {
                                type: "link",
                                href: `/institution/catalog`
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Course Catalog")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_button, {
                                type: "link",
                                href: `/institution/people`
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("People Directory")
                                ]),
                                _: 1
                              }),
                              currentRole.value !== "student" ? (openBlock(), createBlock(_component_a_button, {
                                key: 0,
                                type: "link",
                                href: `/institution/assignments/teachers`
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Teacher Assignments")
                                ]),
                                _: 1
                              })) : createCommentVNode("", true)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_card, {
                        size: "small",
                        title: "Institution",
                        style: { "margin-top": "16px" }
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_descriptions, {
                            column: 1,
                            size: "small"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_descriptions_item, { label: "Name" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(institution.value?.name), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_descriptions_item, { label: "Slug" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(institution.value?.slug), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_descriptions_item, { label: "Type" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(institution.value?.type || "—"), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(institution.value?.location || "—"), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/institution-portal/nuxt/pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-11a37c14"]]);

export { index as default };
//# sourceMappingURL=index-DAfD_1Kc.mjs.map
