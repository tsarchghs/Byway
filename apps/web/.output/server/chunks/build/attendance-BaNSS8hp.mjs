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
  __name: "attendance",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const runtime = useRuntimeConfig();
    const apiBase = runtime.public?.apiBase || runtime.public?.appBaseUrl || "";
    const classroomId = computed(() => String(route.params.classroomId || route.params.id || ""));
    const institutionId = computed(() => route.query.institutionId || route.params?.institution_id || "inst_byway");
    const loading = ref(true);
    const room = ref(null);
    const rows = ref([]);
    const currentRole = ref("none");
    const meId = ref(null);
    function resolveAuthHeader() {
      return null;
    }
    async function load() {
      loading.value = true;
      try {
        const auth = resolveAuthHeader();
        if (!auth) throw new Error("Missing auth token");
        const baseUrl = apiBase ? apiBase.replace(/\/$/, "") : "";
        const url = `${baseUrl}/api/institution-portal/classrooms/${encodeURIComponent(classroomId.value)}/attendance?institutionId=${encodeURIComponent(institutionId.value)}`;
        const resp = await fetch(url, { headers: { Authorization: auth } });
        if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`));
        const json = await resp.json();
        room.value = json.classroom || null;
        rows.value = json.roster || [];
      } catch (e) {
        message.error(e?.message || "Failed to load attendance");
      } finally {
        loading.value = false;
      }
    }
    const columns = [
      { title: "Student", dataIndex: "studentId", key: "studentId" },
      { title: "Status", dataIndex: "status", key: "status" },
      { title: "Assignments Submitted", dataIndex: "submissions", key: "submissions" },
      { title: "Avg Grade", dataIndex: "avgGrade", key: "avgGrade" }
    ];
    const meRow = computed(
      () => rows.value.find((r) => r.studentId === meId.value) || null
    );
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
      const _component_a_button = resolveComponent("a-button");
      const _component_a_skeleton = resolveComponent("a-skeleton");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_descriptions = resolveComponent("a-descriptions");
      const _component_a_descriptions_item = resolveComponent("a-descriptions-item");
      const _component_a_empty = resolveComponent("a-empty");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "attendance-view" }, _attrs))} data-v-72414f94>`);
      _push(ssrRenderComponent(_component_a_page_header, {
        title: room.value?.title || room.value?.code || "Classroom Attendance",
        "sub-title": classroomId.value
      }, {
        extra: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_space, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_menu, {
                    mode: "horizontal",
                    selectedKeys: ["classrooms"]
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "overview" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<a${ssrRenderAttr("href", navHref("overview"))} data-v-72414f94${_scopeId4}>Overview</a>`);
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
                                _push5(`<a${ssrRenderAttr("href", navHref("departments"))} data-v-72414f94${_scopeId4}>Departments</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("classrooms"))} data-v-72414f94${_scopeId4}>Classrooms</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("people"))} data-v-72414f94${_scopeId4}>People Directory</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("catalog"))} data-v-72414f94${_scopeId4}>Catalog</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("calendar"))} data-v-72414f94${_scopeId4}>Calendar</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("assignments"))} data-v-72414f94${_scopeId4}>Assignments</a>`);
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
                      selectedKeys: ["classrooms"]
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
                    selectedKeys: ["classrooms"]
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
            if (currentRole.value !== "student") {
              _push2(ssrRenderComponent(_component_a_card, {
                size: "small",
                title: "Roster"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_table, {
                      size: "small",
                      columns,
                      dataSource: rows.value,
                      "row-key": "studentId"
                    }, {
                      bodyCell: withCtx(({ column, record }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          if (column.dataIndex === "studentId") {
                            _push4(`<a${ssrRenderAttr("href", `/institution/students/${record.studentId}?institutionId=${encodeURIComponent(institutionId.value)}`)} data-v-72414f94${_scopeId3}>${ssrInterpolate(record.studentId)}</a>`);
                          } else {
                            _push4(`<!---->`);
                          }
                        } else {
                          return [
                            column.dataIndex === "studentId" ? (openBlock(), createBlock("a", {
                              key: 0,
                              href: `/institution/students/${record.studentId}?institutionId=${encodeURIComponent(institutionId.value)}`
                            }, toDisplayString(record.studentId), 9, ["href"])) : createCommentVNode("", true)
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
                        dataSource: rows.value,
                        "row-key": "studentId"
                      }, {
                        bodyCell: withCtx(({ column, record }) => [
                          column.dataIndex === "studentId" ? (openBlock(), createBlock("a", {
                            key: 0,
                            href: `/institution/students/${record.studentId}?institutionId=${encodeURIComponent(institutionId.value)}`
                          }, toDisplayString(record.studentId), 9, ["href"])) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }, 8, ["dataSource"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_component_a_card, {
                size: "small",
                title: "My Attendance Summary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (meRow.value) {
                      _push3(ssrRenderComponent(_component_a_descriptions, {
                        column: 1,
                        size: "small"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_a_descriptions_item, { label: "Student" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(meRow.value.studentId)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(meRow.value.studentId), 1)
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_a_descriptions_item, { label: "Status" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(meRow.value.status)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(meRow.value.status), 1)
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_a_descriptions_item, { label: "Submissions" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(meRow.value.submissions)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(meRow.value.submissions), 1)
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_a_descriptions_item, { label: "Avg Grade" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(meRow.value.avgGrade)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(meRow.value.avgGrade), 1)
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_a_descriptions_item, { label: "Student" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(meRow.value.studentId), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_descriptions_item, { label: "Status" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(meRow.value.status), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_descriptions_item, { label: "Submissions" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(meRow.value.submissions), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_descriptions_item, { label: "Avg Grade" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(meRow.value.avgGrade), 1)
                                ]),
                                _: 1
                              })
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(ssrRenderComponent(_component_a_empty, { description: "No attendance records for you in this classroom" }, null, _parent3, _scopeId2));
                    }
                  } else {
                    return [
                      meRow.value ? (openBlock(), createBlock(_component_a_descriptions, {
                        key: 0,
                        column: 1,
                        size: "small"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_descriptions_item, { label: "Student" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(meRow.value.studentId), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_descriptions_item, { label: "Status" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(meRow.value.status), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_descriptions_item, { label: "Submissions" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(meRow.value.submissions), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_descriptions_item, { label: "Avg Grade" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(meRow.value.avgGrade), 1)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })) : (openBlock(), createBlock(_component_a_empty, {
                        key: 1,
                        description: "No attendance records for you in this classroom"
                      }))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
          } else {
            return [
              currentRole.value !== "student" ? (openBlock(), createBlock(_component_a_card, {
                key: 0,
                size: "small",
                title: "Roster"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_table, {
                    size: "small",
                    columns,
                    dataSource: rows.value,
                    "row-key": "studentId"
                  }, {
                    bodyCell: withCtx(({ column, record }) => [
                      column.dataIndex === "studentId" ? (openBlock(), createBlock("a", {
                        key: 0,
                        href: `/institution/students/${record.studentId}?institutionId=${encodeURIComponent(institutionId.value)}`
                      }, toDisplayString(record.studentId), 9, ["href"])) : createCommentVNode("", true)
                    ]),
                    _: 1
                  }, 8, ["dataSource"])
                ]),
                _: 1
              })) : (openBlock(), createBlock(_component_a_card, {
                key: 1,
                size: "small",
                title: "My Attendance Summary"
              }, {
                default: withCtx(() => [
                  meRow.value ? (openBlock(), createBlock(_component_a_descriptions, {
                    key: 0,
                    column: 1,
                    size: "small"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_descriptions_item, { label: "Student" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(meRow.value.studentId), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_descriptions_item, { label: "Status" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(meRow.value.status), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_descriptions_item, { label: "Submissions" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(meRow.value.submissions), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_descriptions_item, { label: "Avg Grade" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(meRow.value.avgGrade), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : (openBlock(), createBlock(_component_a_empty, {
                    key: 1,
                    description: "No attendance records for you in this classroom"
                  }))
                ]),
                _: 1
              }))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/institution-portal/nuxt/pages/classrooms/[classroomId]/attendance.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const attendance = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-72414f94"]]);

export { attendance as default };
//# sourceMappingURL=attendance-BaNSS8hp.mjs.map
