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
  __name: "[studentId]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const runtime = useRuntimeConfig();
    const apiBase = runtime.public?.apiBase || runtime.public?.appBaseUrl || "";
    const studentId = computed(() => String(route.params.studentId || route.params.id || ""));
    const institutionId = computed(() => route.query.institutionId || route.params?.institution_id || "inst_byway");
    const loading = ref(true);
    const courses = ref([]);
    const grades = ref([]);
    const student = ref(null);
    const currentRole = ref("none");
    const meId = ref(null);
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
        const url = `${baseUrl}/api/institution-portal/students/${encodeURIComponent(studentId.value)}/record?institutionId=${encodeURIComponent(institutionId.value)}`;
        const resp = await fetch(url, { headers: { Authorization: auth } });
        if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`));
        const json = await resp.json();
        courses.value = json.courses || [];
        grades.value = json.gradebook || [];
        student.value = json.student || null;
      } catch (e) {
        message.error(e?.message || "Failed to load record");
      } finally {
        loading.value = false;
      }
    }
    const displayName = computed(() => student.value?.displayName || "Student");
    const avgProgress = computed(() => {
      if (!courses.value.length) return 0;
      const sum = courses.value.reduce((acc, c) => acc + (c.progressPct || 0), 0);
      return Math.round(sum / courses.value.length);
    });
    const canView = computed(() => {
      if (currentRole.value === "admin") return true;
      if (currentRole.value === "teacher") return teacherStudentIds.value.has(String(studentId.value));
      if (currentRole.value === "student") return !!meId.value && studentId.value === meId.value;
      return false;
    });
    const courseColumns = [
      { title: "Course", dataIndex: "title", key: "title" },
      { title: "Progress", dataIndex: "progressPct", key: "progressPct" },
      { title: "Completed", dataIndex: "completed", key: "completed" }
    ];
    const gradeColumns = [
      { title: "Course", dataIndex: "courseTitle", key: "courseTitle" },
      { title: "Score", dataIndex: "grade", key: "grade" },
      { title: "Feedback", dataIndex: "feedback", key: "feedback" }
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
      const _component_a_button = resolveComponent("a-button");
      const _component_a_skeleton = resolveComponent("a-skeleton");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_statistic = resolveComponent("a-statistic");
      const _component_a_result = resolveComponent("a-result");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "student-record" }, _attrs))} data-v-a284c2ca>`);
      _push(ssrRenderComponent(_component_a_page_header, {
        title: displayName.value,
        "sub-title": studentId.value
      }, {
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
                              _push5(`<a${ssrRenderAttr("href", navHref("overview"))} data-v-a284c2ca${_scopeId4}>Overview</a>`);
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
                                _push5(`<a${ssrRenderAttr("href", navHref("departments"))} data-v-a284c2ca${_scopeId4}>Departments</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("classrooms"))} data-v-a284c2ca${_scopeId4}>Classrooms</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("people"))} data-v-a284c2ca${_scopeId4}>People Directory</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("catalog"))} data-v-a284c2ca${_scopeId4}>Catalog</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("calendar"))} data-v-a284c2ca${_scopeId4}>Calendar</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("assignments"))} data-v-a284c2ca${_scopeId4}>Assignments</a>`);
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
      if (canView.value) {
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
                            size: "small",
                            title: "Courses"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_table, {
                                  size: "small",
                                  columns: courseColumns,
                                  dataSource: courses.value,
                                  "row-key": "courseId"
                                }, {
                                  bodyCell: withCtx(({ column, record }, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      if (column.dataIndex === "title") {
                                        _push6(`<a${ssrRenderAttr("href", `/teach-internal/${encodeURIComponent(record.teacherId || "teacher")}`)} data-v-a284c2ca${_scopeId5}>${ssrInterpolate(record.title)}</a>`);
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                    } else {
                                      return [
                                        column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                          key: 0,
                                          href: `/teach-internal/${encodeURIComponent(record.teacherId || "teacher")}`
                                        }, toDisplayString(record.title), 9, ["href"])) : createCommentVNode("", true)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_table, {
                                    size: "small",
                                    columns: courseColumns,
                                    dataSource: courses.value,
                                    "row-key": "courseId"
                                  }, {
                                    bodyCell: withCtx(({ column, record }) => [
                                      column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                        key: 0,
                                        href: `/teach-internal/${encodeURIComponent(record.teacherId || "teacher")}`
                                      }, toDisplayString(record.title), 9, ["href"])) : createCommentVNode("", true)
                                    ]),
                                    _: 1
                                  }, 8, ["dataSource"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_card, {
                            size: "small",
                            title: "Gradebook",
                            style: { "margin-top": "16px" }
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_table, {
                                  size: "small",
                                  columns: gradeColumns,
                                  dataSource: grades.value,
                                  "row-key": "id"
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_table, {
                                    size: "small",
                                    columns: gradeColumns,
                                    dataSource: grades.value,
                                    "row-key": "id"
                                  }, null, 8, ["dataSource"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_card, {
                              size: "small",
                              title: "Courses"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_table, {
                                  size: "small",
                                  columns: courseColumns,
                                  dataSource: courses.value,
                                  "row-key": "courseId"
                                }, {
                                  bodyCell: withCtx(({ column, record }) => [
                                    column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                      key: 0,
                                      href: `/teach-internal/${encodeURIComponent(record.teacherId || "teacher")}`
                                    }, toDisplayString(record.title), 9, ["href"])) : createCommentVNode("", true)
                                  ]),
                                  _: 1
                                }, 8, ["dataSource"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_card, {
                              size: "small",
                              title: "Gradebook",
                              style: { "margin-top": "16px" }
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_table, {
                                  size: "small",
                                  columns: gradeColumns,
                                  dataSource: grades.value,
                                  "row-key": "id"
                                }, null, 8, ["dataSource"])
                              ]),
                              _: 1
                            })
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
                            title: "Summary"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_statistic, {
                                  title: "Courses",
                                  value: courses.value.length
                                }, null, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_statistic, {
                                  title: "Average Progress",
                                  value: avgProgress.value,
                                  suffix: "%",
                                  style: { "margin-top": "8px" }
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_statistic, {
                                    title: "Courses",
                                    value: courses.value.length
                                  }, null, 8, ["value"]),
                                  createVNode(_component_a_statistic, {
                                    title: "Average Progress",
                                    value: avgProgress.value,
                                    suffix: "%",
                                    style: { "margin-top": "8px" }
                                  }, null, 8, ["value"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_card, {
                              size: "small",
                              title: "Summary"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_statistic, {
                                  title: "Courses",
                                  value: courses.value.length
                                }, null, 8, ["value"]),
                                createVNode(_component_a_statistic, {
                                  title: "Average Progress",
                                  value: avgProgress.value,
                                  suffix: "%",
                                  style: { "margin-top": "8px" }
                                }, null, 8, ["value"])
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
                            size: "small",
                            title: "Courses"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_table, {
                                size: "small",
                                columns: courseColumns,
                                dataSource: courses.value,
                                "row-key": "courseId"
                              }, {
                                bodyCell: withCtx(({ column, record }) => [
                                  column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                    key: 0,
                                    href: `/teach-internal/${encodeURIComponent(record.teacherId || "teacher")}`
                                  }, toDisplayString(record.title), 9, ["href"])) : createCommentVNode("", true)
                                ]),
                                _: 1
                              }, 8, ["dataSource"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_card, {
                            size: "small",
                            title: "Gradebook",
                            style: { "margin-top": "16px" }
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_table, {
                                size: "small",
                                columns: gradeColumns,
                                dataSource: grades.value,
                                "row-key": "id"
                              }, null, 8, ["dataSource"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_col, { span: 8 }, {
                        default: withCtx(() => [
                          createVNode(_component_a_card, {
                            size: "small",
                            title: "Summary"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_statistic, {
                                title: "Courses",
                                value: courses.value.length
                              }, null, 8, ["value"]),
                              createVNode(_component_a_statistic, {
                                title: "Average Progress",
                                value: avgProgress.value,
                                suffix: "%",
                                style: { "margin-top": "8px" }
                              }, null, 8, ["value"])
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
                          size: "small",
                          title: "Courses"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_table, {
                              size: "small",
                              columns: courseColumns,
                              dataSource: courses.value,
                              "row-key": "courseId"
                            }, {
                              bodyCell: withCtx(({ column, record }) => [
                                column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                  key: 0,
                                  href: `/teach-internal/${encodeURIComponent(record.teacherId || "teacher")}`
                                }, toDisplayString(record.title), 9, ["href"])) : createCommentVNode("", true)
                              ]),
                              _: 1
                            }, 8, ["dataSource"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_card, {
                          size: "small",
                          title: "Gradebook",
                          style: { "margin-top": "16px" }
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_table, {
                              size: "small",
                              columns: gradeColumns,
                              dataSource: grades.value,
                              "row-key": "id"
                            }, null, 8, ["dataSource"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, { span: 8 }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          size: "small",
                          title: "Summary"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_statistic, {
                              title: "Courses",
                              value: courses.value.length
                            }, null, 8, ["value"]),
                            createVNode(_component_a_statistic, {
                              title: "Average Progress",
                              value: avgProgress.value,
                              suffix: "%",
                              style: { "margin-top": "8px" }
                            }, null, 8, ["value"])
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
      } else {
        _push(ssrRenderComponent(_component_a_result, {
          status: "403",
          title: "Not allowed",
          "sub-title": "Access restricted to admin and assigned teachers; students may view only their own record."
        }, {
          extra: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_a_button, {
                type: "primary",
                href: navHref("overview")
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Go to portal`);
                  } else {
                    return [
                      createTextVNode("Go to portal")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_a_button, {
                  type: "primary",
                  href: navHref("overview")
                }, {
                  default: withCtx(() => [
                    createTextVNode("Go to portal")
                  ]),
                  _: 1
                }, 8, ["href"])
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/institution-portal/nuxt/pages/students/[studentId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _studentId_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a284c2ca"]]);

export { _studentId_ as default };
//# sourceMappingURL=_studentId_-BiAmRvoH.mjs.map
