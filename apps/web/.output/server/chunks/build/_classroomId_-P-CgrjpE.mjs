import { defineComponent, computed, ref, resolveComponent, mergeProps, withCtx, createVNode, createBlock, createCommentVNode, openBlock, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "[classroomId]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const runtime = useRuntimeConfig();
    runtime.public?.apiBase || runtime.public?.appBaseUrl || "";
    const classroomId = computed(() => String(route.params.classroomId || route.params.id || ""));
    const institutionId = computed(() => route.query.institutionId || route.params?.institution_id || "inst_byway");
    const loading = ref(true);
    const activeTab = ref("overview");
    const institution = ref(null);
    const department = ref(null);
    const room = ref(null);
    const assignments = ref([]);
    const lessons = ref([]);
    const students = ref([]);
    const currentRole = ref("none");
    ref(null);
    const classCourse = ref(null);
    const teacherLabel = computed(() => room.value?.teacherDisplayName || room.value?.teacherId || "—");
    const assignmentColumns = [
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Due", dataIndex: "dueDate", key: "dueDate" }
    ];
    const lessonColumns = [
      { title: "Module", dataIndex: "moduleTitle", key: "moduleTitle" },
      { title: "Lesson", dataIndex: "title", key: "title" },
      { title: "Type", dataIndex: "type", key: "type" }
    ];
    const studentColumns = [
      { title: "Student", dataIndex: "displayName", key: "displayName" },
      { title: "Student ID", dataIndex: "studentId", key: "studentId" },
      { title: "Status", dataIndex: "status", key: "status" }
    ];
    function navHref(key) {
      const qs = `?institutionId=${encodeURIComponent(institutionId.value)}`;
      if (currentRole.value !== "admin" && key === "departments") return `/institution/portal${qs}`;
      if (currentRole.value === "student" && key === "assignments") return `/institution/portal${qs}`;
      if (key === "overview") return `/institution/portal${qs}`;
      if (key === "departments") return `/institution/departments/${encodeURIComponent(department.value?.id || "")}${qs}`;
      if (key === "classrooms") return `/institution/classrooms/${encodeURIComponent(classroomId.value)}${qs}`;
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
      const _component_a_tabs = resolveComponent("a-tabs");
      const _component_a_tab_pane = resolveComponent("a-tab-pane");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_descriptions = resolveComponent("a-descriptions");
      const _component_a_descriptions_item = resolveComponent("a-descriptions-item");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "classroom-overview" }, _attrs))} data-v-6ea6fde8>`);
      _push(ssrRenderComponent(_component_a_page_header, {
        title: room.value?.title || room.value?.code || "Classroom",
        "sub-title": room.value?.id || classroomId.value
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
                              _push5(`<a${ssrRenderAttr("href", navHref("overview"))} data-v-6ea6fde8${_scopeId4}>Overview</a>`);
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
                                _push5(`<a${ssrRenderAttr("href", navHref("departments"))} data-v-6ea6fde8${_scopeId4}>Departments</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("classrooms"))} data-v-6ea6fde8${_scopeId4}>Classrooms</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("people"))} data-v-6ea6fde8${_scopeId4}>People Directory</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("catalog"))} data-v-6ea6fde8${_scopeId4}>Catalog</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("calendar"))} data-v-6ea6fde8${_scopeId4}>Calendar</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("assignments"))} data-v-6ea6fde8${_scopeId4}>Assignments</a>`);
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
                    type: "link",
                    href: `/institution/classrooms/${classroomId.value}?institutionId=${encodeURIComponent(institutionId.value)}`
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Refresh`);
                      } else {
                        return [
                          createTextVNode("Refresh")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (currentRole.value !== "student") {
                    _push3(ssrRenderComponent(_component_a_button, {
                      size: "small",
                      type: "primary",
                      href: `/institution/classrooms/${classroomId.value}/attendance?institutionId=${encodeURIComponent(institutionId.value)}`
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Attendance`);
                        } else {
                          return [
                            createTextVNode("Attendance")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
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
                      type: "link",
                      href: `/institution/classrooms/${classroomId.value}?institutionId=${encodeURIComponent(institutionId.value)}`
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Refresh")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    currentRole.value !== "student" ? (openBlock(), createBlock(_component_a_button, {
                      key: 0,
                      size: "small",
                      type: "primary",
                      href: `/institution/classrooms/${classroomId.value}/attendance?institutionId=${encodeURIComponent(institutionId.value)}`
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Attendance")
                      ]),
                      _: 1
                    }, 8, ["href"])) : createCommentVNode("", true)
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
                    type: "link",
                    href: `/institution/classrooms/${classroomId.value}?institutionId=${encodeURIComponent(institutionId.value)}`
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Refresh")
                    ]),
                    _: 1
                  }, 8, ["href"]),
                  currentRole.value !== "student" ? (openBlock(), createBlock(_component_a_button, {
                    key: 0,
                    size: "small",
                    type: "primary",
                    href: `/institution/classrooms/${classroomId.value}/attendance?institutionId=${encodeURIComponent(institutionId.value)}`
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Attendance")
                    ]),
                    _: 1
                  }, 8, ["href"])) : createCommentVNode("", true)
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
                        _push4(ssrRenderComponent(_component_a_tabs, {
                          activeKey: activeTab.value,
                          "onUpdate:activeKey": ($event) => activeTab.value = $event
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_tab_pane, {
                                key: "overview",
                                tab: "Overview"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_card, {
                                      size: "small",
                                      title: "Assignments"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_table, {
                                            size: "small",
                                            columns: assignmentColumns,
                                            dataSource: assignments.value,
                                            "row-key": "id"
                                          }, {
                                            bodyCell: withCtx(({ column, record }, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                if (column.dataIndex === "title") {
                                                  _push8(`<a${ssrRenderAttr("href", institution.value?.slug ? `/institutions/${institution.value.slug}/assignments/${record.id}/grading` : "#")} data-v-6ea6fde8${_scopeId7}>${ssrInterpolate(record.title)}</a>`);
                                                } else {
                                                  _push8(`<!---->`);
                                                }
                                              } else {
                                                return [
                                                  column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                                    key: 0,
                                                    href: institution.value?.slug ? `/institutions/${institution.value.slug}/assignments/${record.id}/grading` : "#"
                                                  }, toDisplayString(record.title), 9, ["href"])) : createCommentVNode("", true)
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_table, {
                                              size: "small",
                                              columns: assignmentColumns,
                                              dataSource: assignments.value,
                                              "row-key": "id"
                                            }, {
                                              bodyCell: withCtx(({ column, record }) => [
                                                column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                                  key: 0,
                                                  href: institution.value?.slug ? `/institutions/${institution.value.slug}/assignments/${record.id}/grading` : "#"
                                                }, toDisplayString(record.title), 9, ["href"])) : createCommentVNode("", true)
                                              ]),
                                              _: 1
                                            }, 8, ["dataSource"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_card, {
                                      size: "small",
                                      title: "Modules & Lessons",
                                      style: { "margin-top": "16px" }
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_table, {
                                            size: "small",
                                            columns: lessonColumns,
                                            dataSource: lessons.value,
                                            "row-key": "id"
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_table, {
                                              size: "small",
                                              columns: lessonColumns,
                                              dataSource: lessons.value,
                                              "row-key": "id"
                                            }, null, 8, ["dataSource"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_card, {
                                        size: "small",
                                        title: "Assignments"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_table, {
                                            size: "small",
                                            columns: assignmentColumns,
                                            dataSource: assignments.value,
                                            "row-key": "id"
                                          }, {
                                            bodyCell: withCtx(({ column, record }) => [
                                              column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                                key: 0,
                                                href: institution.value?.slug ? `/institutions/${institution.value.slug}/assignments/${record.id}/grading` : "#"
                                              }, toDisplayString(record.title), 9, ["href"])) : createCommentVNode("", true)
                                            ]),
                                            _: 1
                                          }, 8, ["dataSource"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_card, {
                                        size: "small",
                                        title: "Modules & Lessons",
                                        style: { "margin-top": "16px" }
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_table, {
                                            size: "small",
                                            columns: lessonColumns,
                                            dataSource: lessons.value,
                                            "row-key": "id"
                                          }, null, 8, ["dataSource"])
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              if (currentRole.value !== "student") {
                                _push5(ssrRenderComponent(_component_a_tab_pane, {
                                  key: "people",
                                  tab: "People"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_card, {
                                        size: "small",
                                        title: "Enrolled Students"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_table, {
                                              size: "small",
                                              columns: studentColumns,
                                              dataSource: students.value,
                                              "row-key": "studentId"
                                            }, {
                                              bodyCell: withCtx(({ column, record }, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  if (column.dataIndex === "displayName") {
                                                    _push8(`<a${ssrRenderAttr("href", `/institution/students/${record.studentId}?institutionId=${encodeURIComponent(institutionId.value)}`)} data-v-6ea6fde8${_scopeId7}>${ssrInterpolate(record.displayName || record.studentId)}</a>`);
                                                  } else {
                                                    _push8(`<!---->`);
                                                  }
                                                } else {
                                                  return [
                                                    column.dataIndex === "displayName" ? (openBlock(), createBlock("a", {
                                                      key: 0,
                                                      href: `/institution/students/${record.studentId}?institutionId=${encodeURIComponent(institutionId.value)}`
                                                    }, toDisplayString(record.displayName || record.studentId), 9, ["href"])) : createCommentVNode("", true)
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_table, {
                                                size: "small",
                                                columns: studentColumns,
                                                dataSource: students.value,
                                                "row-key": "studentId"
                                              }, {
                                                bodyCell: withCtx(({ column, record }) => [
                                                  column.dataIndex === "displayName" ? (openBlock(), createBlock("a", {
                                                    key: 0,
                                                    href: `/institution/students/${record.studentId}?institutionId=${encodeURIComponent(institutionId.value)}`
                                                  }, toDisplayString(record.displayName || record.studentId), 9, ["href"])) : createCommentVNode("", true)
                                                ]),
                                                _: 1
                                              }, 8, ["dataSource"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_a_card, {
                                          size: "small",
                                          title: "Enrolled Students"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_table, {
                                              size: "small",
                                              columns: studentColumns,
                                              dataSource: students.value,
                                              "row-key": "studentId"
                                            }, {
                                              bodyCell: withCtx(({ column, record }) => [
                                                column.dataIndex === "displayName" ? (openBlock(), createBlock("a", {
                                                  key: 0,
                                                  href: `/institution/students/${record.studentId}?institutionId=${encodeURIComponent(institutionId.value)}`
                                                }, toDisplayString(record.displayName || record.studentId), 9, ["href"])) : createCommentVNode("", true)
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
                                }, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createVNode(_component_a_tab_pane, {
                                  key: "overview",
                                  tab: "Overview"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, {
                                      size: "small",
                                      title: "Assignments"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_table, {
                                          size: "small",
                                          columns: assignmentColumns,
                                          dataSource: assignments.value,
                                          "row-key": "id"
                                        }, {
                                          bodyCell: withCtx(({ column, record }) => [
                                            column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                              key: 0,
                                              href: institution.value?.slug ? `/institutions/${institution.value.slug}/assignments/${record.id}/grading` : "#"
                                            }, toDisplayString(record.title), 9, ["href"])) : createCommentVNode("", true)
                                          ]),
                                          _: 1
                                        }, 8, ["dataSource"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_card, {
                                      size: "small",
                                      title: "Modules & Lessons",
                                      style: { "margin-top": "16px" }
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_table, {
                                          size: "small",
                                          columns: lessonColumns,
                                          dataSource: lessons.value,
                                          "row-key": "id"
                                        }, null, 8, ["dataSource"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                currentRole.value !== "student" ? (openBlock(), createBlock(_component_a_tab_pane, {
                                  key: "people",
                                  tab: "People"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, {
                                      size: "small",
                                      title: "Enrolled Students"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_table, {
                                          size: "small",
                                          columns: studentColumns,
                                          dataSource: students.value,
                                          "row-key": "studentId"
                                        }, {
                                          bodyCell: withCtx(({ column, record }) => [
                                            column.dataIndex === "displayName" ? (openBlock(), createBlock("a", {
                                              key: 0,
                                              href: `/institution/students/${record.studentId}?institutionId=${encodeURIComponent(institutionId.value)}`
                                            }, toDisplayString(record.displayName || record.studentId), 9, ["href"])) : createCommentVNode("", true)
                                          ]),
                                          _: 1
                                        }, 8, ["dataSource"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
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
                                  createVNode(_component_a_card, {
                                    size: "small",
                                    title: "Assignments"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_table, {
                                        size: "small",
                                        columns: assignmentColumns,
                                        dataSource: assignments.value,
                                        "row-key": "id"
                                      }, {
                                        bodyCell: withCtx(({ column, record }) => [
                                          column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                            key: 0,
                                            href: institution.value?.slug ? `/institutions/${institution.value.slug}/assignments/${record.id}/grading` : "#"
                                          }, toDisplayString(record.title), 9, ["href"])) : createCommentVNode("", true)
                                        ]),
                                        _: 1
                                      }, 8, ["dataSource"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_card, {
                                    size: "small",
                                    title: "Modules & Lessons",
                                    style: { "margin-top": "16px" }
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_table, {
                                        size: "small",
                                        columns: lessonColumns,
                                        dataSource: lessons.value,
                                        "row-key": "id"
                                      }, null, 8, ["dataSource"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              currentRole.value !== "student" ? (openBlock(), createBlock(_component_a_tab_pane, {
                                key: "people",
                                tab: "People"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, {
                                    size: "small",
                                    title: "Enrolled Students"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_table, {
                                        size: "small",
                                        columns: studentColumns,
                                        dataSource: students.value,
                                        "row-key": "studentId"
                                      }, {
                                        bodyCell: withCtx(({ column, record }) => [
                                          column.dataIndex === "displayName" ? (openBlock(), createBlock("a", {
                                            key: 0,
                                            href: `/institution/students/${record.studentId}?institutionId=${encodeURIComponent(institutionId.value)}`
                                          }, toDisplayString(record.displayName || record.studentId), 9, ["href"])) : createCommentVNode("", true)
                                        ]),
                                        _: 1
                                      }, 8, ["dataSource"])
                                    ]),
                                    _: 1
                                  })
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
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_col, { span: 8 }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_card, {
                          size: "small",
                          title: "Classroom"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_descriptions, {
                                column: 1,
                                size: "small"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_descriptions_item, { label: "Institution" }, {
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
                                    _push6(ssrRenderComponent(_component_a_descriptions_item, { label: "Department" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(department.value?.name || "—")}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(department.value?.name || "—"), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_descriptions_item, { label: "Teacher" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(teacherLabel.value)}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(teacherLabel.value), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_descriptions_item, { label: "Capacity" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(room.value?.capacity ?? "—")}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(room.value?.capacity ?? "—"), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_descriptions_item, { label: "Status" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(room.value?.status || "—")}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(room.value?.status || "—"), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_descriptions_item, { label: "Institution" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(institution.value?.name), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_descriptions_item, { label: "Department" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(department.value?.name || "—"), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_descriptions_item, { label: "Teacher" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(teacherLabel.value), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_descriptions_item, { label: "Capacity" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(room.value?.capacity ?? "—"), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_descriptions_item, { label: "Status" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(room.value?.status || "—"), 1)
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
                                    createVNode(_component_a_descriptions_item, { label: "Institution" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(institution.value?.name), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "Department" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(department.value?.name || "—"), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "Teacher" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(teacherLabel.value), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "Capacity" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(room.value?.capacity ?? "—"), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "Status" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(room.value?.status || "—"), 1)
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
                        _push4(ssrRenderComponent(_component_a_card, {
                          size: "small",
                          title: "Teach Course",
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
                                    _push6(ssrRenderComponent(_component_a_descriptions_item, { label: "Bound" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(classCourse.value?.bound ? "Yes" : "No")}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(classCourse.value?.bound ? "Yes" : "No"), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    if (classCourse.value?.bound) {
                                      _push6(ssrRenderComponent(_component_a_descriptions_item, { label: "Title" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`${ssrInterpolate(classCourse.value?.course?.title)}`);
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(classCourse.value?.course?.title), 1)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                    if (classCourse.value?.bound) {
                                      _push6(ssrRenderComponent(_component_a_descriptions_item, { label: "Modules" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`${ssrInterpolate(classCourse.value?.moduleCount)}`);
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(classCourse.value?.moduleCount), 1)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                    if (classCourse.value?.bound) {
                                      _push6(ssrRenderComponent(_component_a_descriptions_item, { label: "Lessons" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`${ssrInterpolate(classCourse.value?.lessonCount)}`);
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(classCourse.value?.lessonCount), 1)
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
                                      createVNode(_component_a_descriptions_item, { label: "Bound" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(classCourse.value?.bound ? "Yes" : "No"), 1)
                                        ]),
                                        _: 1
                                      }),
                                      classCourse.value?.bound ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                        key: 0,
                                        label: "Title"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(classCourse.value?.course?.title), 1)
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true),
                                      classCourse.value?.bound ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                        key: 1,
                                        label: "Modules"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(classCourse.value?.moduleCount), 1)
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true),
                                      classCourse.value?.bound ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                        key: 2,
                                        label: "Lessons"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(classCourse.value?.lessonCount), 1)
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
                                createVNode(_component_a_descriptions, {
                                  column: 1,
                                  size: "small"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_descriptions_item, { label: "Bound" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(classCourse.value?.bound ? "Yes" : "No"), 1)
                                      ]),
                                      _: 1
                                    }),
                                    classCourse.value?.bound ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                      key: 0,
                                      label: "Title"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(classCourse.value?.course?.title), 1)
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true),
                                    classCourse.value?.bound ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                      key: 1,
                                      label: "Modules"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(classCourse.value?.moduleCount), 1)
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true),
                                    classCourse.value?.bound ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                      key: 2,
                                      label: "Lessons"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(classCourse.value?.lessonCount), 1)
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
                      } else {
                        return [
                          createVNode(_component_a_card, {
                            size: "small",
                            title: "Classroom"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_descriptions, {
                                column: 1,
                                size: "small"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_descriptions_item, { label: "Institution" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(institution.value?.name), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_descriptions_item, { label: "Department" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(department.value?.name || "—"), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_descriptions_item, { label: "Teacher" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(teacherLabel.value), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_descriptions_item, { label: "Capacity" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(room.value?.capacity ?? "—"), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_descriptions_item, { label: "Status" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(room.value?.status || "—"), 1)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_card, {
                            size: "small",
                            title: "Teach Course",
                            style: { "margin-top": "16px" }
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_descriptions, {
                                column: 1,
                                size: "small"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_descriptions_item, { label: "Bound" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(classCourse.value?.bound ? "Yes" : "No"), 1)
                                    ]),
                                    _: 1
                                  }),
                                  classCourse.value?.bound ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                    key: 0,
                                    label: "Title"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(classCourse.value?.course?.title), 1)
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true),
                                  classCourse.value?.bound ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                    key: 1,
                                    label: "Modules"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(classCourse.value?.moduleCount), 1)
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true),
                                  classCourse.value?.bound ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                    key: 2,
                                    label: "Lessons"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(classCourse.value?.lessonCount), 1)
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true)
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
                                createVNode(_component_a_card, {
                                  size: "small",
                                  title: "Assignments"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_table, {
                                      size: "small",
                                      columns: assignmentColumns,
                                      dataSource: assignments.value,
                                      "row-key": "id"
                                    }, {
                                      bodyCell: withCtx(({ column, record }) => [
                                        column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                          key: 0,
                                          href: institution.value?.slug ? `/institutions/${institution.value.slug}/assignments/${record.id}/grading` : "#"
                                        }, toDisplayString(record.title), 9, ["href"])) : createCommentVNode("", true)
                                      ]),
                                      _: 1
                                    }, 8, ["dataSource"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_card, {
                                  size: "small",
                                  title: "Modules & Lessons",
                                  style: { "margin-top": "16px" }
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_table, {
                                      size: "small",
                                      columns: lessonColumns,
                                      dataSource: lessons.value,
                                      "row-key": "id"
                                    }, null, 8, ["dataSource"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            currentRole.value !== "student" ? (openBlock(), createBlock(_component_a_tab_pane, {
                              key: "people",
                              tab: "People"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, {
                                  size: "small",
                                  title: "Enrolled Students"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_table, {
                                      size: "small",
                                      columns: studentColumns,
                                      dataSource: students.value,
                                      "row-key": "studentId"
                                    }, {
                                      bodyCell: withCtx(({ column, record }) => [
                                        column.dataIndex === "displayName" ? (openBlock(), createBlock("a", {
                                          key: 0,
                                          href: `/institution/students/${record.studentId}?institutionId=${encodeURIComponent(institutionId.value)}`
                                        }, toDisplayString(record.displayName || record.studentId), 9, ["href"])) : createCommentVNode("", true)
                                      ]),
                                      _: 1
                                    }, 8, ["dataSource"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }, 8, ["activeKey", "onUpdate:activeKey"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, { span: 8 }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          size: "small",
                          title: "Classroom"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_descriptions, {
                              column: 1,
                              size: "small"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_descriptions_item, { label: "Institution" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(institution.value?.name), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions_item, { label: "Department" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(department.value?.name || "—"), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions_item, { label: "Teacher" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(teacherLabel.value), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions_item, { label: "Capacity" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(room.value?.capacity ?? "—"), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions_item, { label: "Status" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(room.value?.status || "—"), 1)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_card, {
                          size: "small",
                          title: "Teach Course",
                          style: { "margin-top": "16px" }
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_descriptions, {
                              column: 1,
                              size: "small"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_descriptions_item, { label: "Bound" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(classCourse.value?.bound ? "Yes" : "No"), 1)
                                  ]),
                                  _: 1
                                }),
                                classCourse.value?.bound ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                  key: 0,
                                  label: "Title"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(classCourse.value?.course?.title), 1)
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                classCourse.value?.bound ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                  key: 1,
                                  label: "Modules"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(classCourse.value?.moduleCount), 1)
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                classCourse.value?.bound ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                  key: 2,
                                  label: "Lessons"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(classCourse.value?.lessonCount), 1)
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
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
                              createVNode(_component_a_card, {
                                size: "small",
                                title: "Assignments"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_table, {
                                    size: "small",
                                    columns: assignmentColumns,
                                    dataSource: assignments.value,
                                    "row-key": "id"
                                  }, {
                                    bodyCell: withCtx(({ column, record }) => [
                                      column.dataIndex === "title" ? (openBlock(), createBlock("a", {
                                        key: 0,
                                        href: institution.value?.slug ? `/institutions/${institution.value.slug}/assignments/${record.id}/grading` : "#"
                                      }, toDisplayString(record.title), 9, ["href"])) : createCommentVNode("", true)
                                    ]),
                                    _: 1
                                  }, 8, ["dataSource"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_card, {
                                size: "small",
                                title: "Modules & Lessons",
                                style: { "margin-top": "16px" }
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_table, {
                                    size: "small",
                                    columns: lessonColumns,
                                    dataSource: lessons.value,
                                    "row-key": "id"
                                  }, null, 8, ["dataSource"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          currentRole.value !== "student" ? (openBlock(), createBlock(_component_a_tab_pane, {
                            key: "people",
                            tab: "People"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                size: "small",
                                title: "Enrolled Students"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_table, {
                                    size: "small",
                                    columns: studentColumns,
                                    dataSource: students.value,
                                    "row-key": "studentId"
                                  }, {
                                    bodyCell: withCtx(({ column, record }) => [
                                      column.dataIndex === "displayName" ? (openBlock(), createBlock("a", {
                                        key: 0,
                                        href: `/institution/students/${record.studentId}?institutionId=${encodeURIComponent(institutionId.value)}`
                                      }, toDisplayString(record.displayName || record.studentId), 9, ["href"])) : createCommentVNode("", true)
                                    ]),
                                    _: 1
                                  }, 8, ["dataSource"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }, 8, ["activeKey", "onUpdate:activeKey"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_col, { span: 8 }, {
                    default: withCtx(() => [
                      createVNode(_component_a_card, {
                        size: "small",
                        title: "Classroom"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_descriptions, {
                            column: 1,
                            size: "small"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_descriptions_item, { label: "Institution" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(institution.value?.name), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_descriptions_item, { label: "Department" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(department.value?.name || "—"), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_descriptions_item, { label: "Teacher" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(teacherLabel.value), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_descriptions_item, { label: "Capacity" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(room.value?.capacity ?? "—"), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_descriptions_item, { label: "Status" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(room.value?.status || "—"), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_card, {
                        size: "small",
                        title: "Teach Course",
                        style: { "margin-top": "16px" }
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_descriptions, {
                            column: 1,
                            size: "small"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_descriptions_item, { label: "Bound" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(classCourse.value?.bound ? "Yes" : "No"), 1)
                                ]),
                                _: 1
                              }),
                              classCourse.value?.bound ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                key: 0,
                                label: "Title"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(classCourse.value?.course?.title), 1)
                                ]),
                                _: 1
                              })) : createCommentVNode("", true),
                              classCourse.value?.bound ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                key: 1,
                                label: "Modules"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(classCourse.value?.moduleCount), 1)
                                ]),
                                _: 1
                              })) : createCommentVNode("", true),
                              classCourse.value?.bound ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                key: 2,
                                label: "Lessons"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(classCourse.value?.lessonCount), 1)
                                ]),
                                _: 1
                              })) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/institution-portal/nuxt/pages/classrooms/[classroomId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _classroomId_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6ea6fde8"]]);

export { _classroomId_ as default };
//# sourceMappingURL=_classroomId_-P-CgrjpE.mjs.map
