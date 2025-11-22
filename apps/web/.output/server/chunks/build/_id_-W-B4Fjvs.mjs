import { defineComponent, ref, computed, watch, resolveComponent, withCtx, unref, createVNode, createTextVNode, createBlock, createCommentVNode, openBlock, toDisplayString, h, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { d as dayjs } from './index-9yJzlrSj.mjs';
import { BulbOutlined, CloudSyncOutlined } from '@ant-design/icons-vue';
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
import 'vue-router';
import '@apollo/client/core/index.js';
import '@apollo/client/link/context/index.js';
import '@vue/apollo-composable';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const relativeTime = require("dayjs/plugin/relativeTime");
    dayjs.extend(relativeTime);
    const isDark = ref(false);
    const isOnline = ref(true);
    const usingMocks = ref(true);
    const mockReason = ref("Gradebook prototype");
    const filter = ref("");
    const statusFilter = ref("all");
    const leftCollapsed = ref(false);
    const rightCollapsed = ref(false);
    const rightTab = ref("notes");
    const openExport = ref(false);
    const mockGrades = ref([
      { id: "1", assignmentId: "a1", assignmentName: "Midterm", courseId: "c1", courseName: "CS 101", grade: 88, feedback: "Strong understanding", status: "graded", updatedAt: /* @__PURE__ */ new Date() },
      { id: "2", assignmentId: "a2", assignmentName: "Project 1", courseId: "c1", courseName: "CS 101", grade: 92, feedback: "Excellent code", status: "graded", updatedAt: new Date(Date.now() - 864e5) },
      { id: "3", assignmentId: "a3", assignmentName: "Assignment 3", courseId: "c1", courseName: "CS 101", grade: null, feedback: null, status: "pending", updatedAt: /* @__PURE__ */ new Date() },
      { id: "4", assignmentId: "a4", assignmentName: "Final Project", courseId: "c2", courseName: "Math 201", grade: 95, feedback: "Outstanding", status: "graded", updatedAt: new Date(Date.now() - 2e8) }
    ]);
    const tab = ref("grades");
    const loading = ref(false);
    const courses = computed(() => {
      const map = {};
      mockGrades.value.forEach((g) => {
        if (!map[g.courseId]) {
          map[g.courseId] = {
            courseId: g.courseId,
            courseName: g.courseName,
            grades: []
          };
        }
        map[g.courseId].grades.push(g.grade);
      });
      return Object.values(map).map((c) => {
        const graded = c.grades.filter((x) => x != null);
        const avg = graded.length ? Math.round(graded.reduce((s, x) => s + x, 0) / graded.length) : 0;
        return {
          ...c,
          gradedCount: graded.length,
          totalCount: c.grades.length,
          avg
        };
      });
    });
    const currentCourseId = ref(null);
    const currentCourse = computed(
      () => courses.value.find((c) => c.courseId === currentCourseId.value)
    );
    watch(currentCourseId, (id) => {
      if (!notes.value[id]) {
        notes.value[id] = { text: "" };
      }
    });
    const grades = computed(() => {
      let list = mockGrades.value;
      if (currentCourseId.value)
        list = list.filter((g) => g.courseId === currentCourseId.value);
      if (filter.value)
        list = list.filter((g) => g.assignmentName.toLowerCase().includes(filter.value.toLowerCase()));
      if (statusFilter.value !== "all")
        list = list.filter((g) => g.status === statusFilter.value);
      return list.map((g) => ({ ...g, key: g.id }));
    });
    const metrics = computed(() => {
      const list = grades.value;
      if (!list.length) return { average: null, completed: 0, total: 0, pending: 0 };
      const graded = list.filter((x) => x.grade != null);
      const avg = graded.length ? Math.round(graded.reduce((s, x) => s + x.grade, 0) / graded.length) : null;
      return {
        average: avg,
        completed: graded.length,
        total: list.length,
        pending: list.filter((x) => x.status !== "graded").length
      };
    });
    const gradeDistribution = computed(() => {
      const dist = { "A (90+)": 0, "B (80-89)": 0, "C (70-79)": 0, "D (60-69)": 0, "F (<60)": 0 };
      grades.value.forEach((g) => {
        if (g.grade == null) return;
        if (g.grade >= 90) dist["A (90+)"]++;
        else if (g.grade >= 80) dist["B (80-89)"]++;
        else if (g.grade >= 70) dist["C (70-79)"]++;
        else if (g.grade >= 60) dist["D (60-69)"]++;
        else dist["F (<60)"]++;
      });
      return dist;
    });
    const feedbackList = computed(
      () => grades.value.filter((g) => g.feedback || g.status === "graded")
    );
    const recentFeed = computed(
      () => feedbackList.value.map((f) => ({
        assignment: f.assignmentName,
        text: f.feedback || "Updated"
      }))
    );
    const notes = ref({
      c1: { text: "" },
      c2: { text: "" }
    });
    function persistNotes() {
      localStorage.setItem("gb-notes", JSON.stringify(notes.value));
    }
    const bookmarks = ref([]);
    function removeBookmark(i) {
      bookmarks.value.splice(i, 1);
    }
    function selectCourse(id) {
      currentCourseId.value = id;
    }
    function format(d) {
      return dayjs(d).fromNow();
    }
    function statusColor(s) {
      return { graded: "green", pending: "orange", submitted: "blue" }[s] || "default";
    }
    function toggleDark() {
      isDark.value = !isDark.value;
    }
    function exportGrades() {
      const json = JSON.stringify(mockGrades.value, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = (void 0).createElement("a");
      a.href = url;
      a.download = "gradebook.json";
      a.click();
    }
    const gradeColumns = [
      { title: "Assignment", dataIndex: "assignmentName" },
      { title: "Course", dataIndex: "courseName" },
      {
        title: "Grade",
        dataIndex: "grade",
        customRender: ({ record }) => record.grade == null ? h("span", { class: "text-muted" }, "—") : h("b", `${record.grade}%`)
      },
      {
        title: "Status",
        dataIndex: "status",
        customRender: ({ record }) => h("a-tag", { color: statusColor(record.status) }, record.status)
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_config_provider = resolveComponent("a-config-provider");
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_alert = resolveComponent("a-alert");
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_badge = resolveComponent("a-badge");
      const _component_a_tooltip = resolveComponent("a-tooltip");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_layout_sider = resolveComponent("a-layout-sider");
      const _component_a_input_search = resolveComponent("a-input-search");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_segmented = resolveComponent("a-segmented");
      const _component_a_divider = resolveComponent("a-divider");
      const _component_a_list = resolveComponent("a-list");
      const _component_a_list_item = resolveComponent("a-list-item");
      const _component_a_list_item_meta = resolveComponent("a-list-item-meta");
      const _component_a_layout_content = resolveComponent("a-layout-content");
      const _component_a_breadcrumb = resolveComponent("a-breadcrumb");
      const _component_a_breadcrumb_item = resolveComponent("a-breadcrumb-item");
      const _component_a_tabs = resolveComponent("a-tabs");
      const _component_a_tab_pane = resolveComponent("a-tab-pane");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_progress = resolveComponent("a-progress");
      const _component_a_empty = resolveComponent("a-empty");
      const _component_a_form = resolveComponent("a-form");
      const _component_a_form_item = resolveComponent("a-form-item");
      const _component_a_textarea = resolveComponent("a-textarea");
      const _component_a_modal = resolveComponent("a-modal");
      _push(ssrRenderComponent(_component_a_config_provider, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_layout, {
              class: ["gradebook-root", isDark.value ? "is-dark" : ""]
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="global-banners px-4 pt-3" data-v-67dbdf1b${_scopeId2}>`);
                  if (!isOnline.value) {
                    _push3(ssrRenderComponent(_component_a_alert, {
                      type: "warning",
                      banner: "",
                      "show-icon": "",
                      message: "You're offline. Mock/local mode active.",
                      class: "mb-2"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (usingMocks.value) {
                    _push3(ssrRenderComponent(_component_a_alert, {
                      type: "info",
                      banner: "",
                      "show-icon": "",
                      message: `Mock data active${mockReason.value ? ` · ${mockReason.value}` : ""}`
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_component_a_page_header, {
                    class: "page-header shadow-sm px-6 py-4 bg-white",
                    title: "My Gradebook",
                    "sub-title": "Grades · Analytics · Feedback"
                  }, {
                    tags: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_space, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_tag, { color: "blue" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Student`);
                                  } else {
                                    return [
                                      createTextVNode("Student")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_tag, { color: "gold" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Performance`);
                                  } else {
                                    return [
                                      createTextVNode("Performance")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_badge, {
                                status: isOnline.value ? "processing" : "default",
                                text: isOnline.value ? "Online" : "Offline"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_badge, {
                                status: usingMocks.value ? "warning" : "success",
                                text: usingMocks.value ? "Mock" : "Live"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_tag, { color: "blue" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Student")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_tag, { color: "gold" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Performance")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_badge, {
                                  status: isOnline.value ? "processing" : "default",
                                  text: isOnline.value ? "Online" : "Offline"
                                }, null, 8, ["status", "text"]),
                                createVNode(_component_a_badge, {
                                  status: usingMocks.value ? "warning" : "success",
                                  text: usingMocks.value ? "Mock" : "Live"
                                }, null, 8, ["status", "text"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_space, null, {
                            default: withCtx(() => [
                              createVNode(_component_a_tag, { color: "blue" }, {
                                default: withCtx(() => [
                                  createTextVNode("Student")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_tag, { color: "gold" }, {
                                default: withCtx(() => [
                                  createTextVNode("Performance")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_badge, {
                                status: isOnline.value ? "processing" : "default",
                                text: isOnline.value ? "Online" : "Offline"
                              }, null, 8, ["status", "text"]),
                              createVNode(_component_a_badge, {
                                status: usingMocks.value ? "warning" : "success",
                                text: usingMocks.value ? "Mock" : "Live"
                              }, null, 8, ["status", "text"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    extra: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_space, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_tooltip, { title: "Toggle dark mode" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_button, {
                                      shape: "circle",
                                      onClick: toggleDark
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(unref(BulbOutlined), null, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(unref(BulbOutlined))
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_button, {
                                        shape: "circle",
                                        onClick: toggleDark
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(BulbOutlined))
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_button, {
                                type: "primary",
                                onClick: ($event) => openExport.value = true
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(CloudSyncOutlined), null, null, _parent6, _scopeId5));
                                    _push6(` Export `);
                                  } else {
                                    return [
                                      createVNode(unref(CloudSyncOutlined)),
                                      createTextVNode(" Export ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_tooltip, { title: "Toggle dark mode" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      shape: "circle",
                                      onClick: toggleDark
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(BulbOutlined))
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_button, {
                                  type: "primary",
                                  onClick: ($event) => openExport.value = true
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(CloudSyncOutlined)),
                                    createTextVNode(" Export ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_space, null, {
                            default: withCtx(() => [
                              createVNode(_component_a_tooltip, { title: "Toggle dark mode" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_button, {
                                    shape: "circle",
                                    onClick: toggleDark
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(BulbOutlined))
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_button, {
                                type: "primary",
                                onClick: ($event) => openExport.value = true
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(CloudSyncOutlined)),
                                  createTextVNode(" Export ")
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
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_layout, { class: "main-layout" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_layout_sider, {
                          width: "300",
                          collapsible: "",
                          collapsed: leftCollapsed.value,
                          "onUpdate:collapsed": ($event) => leftCollapsed.value = $event,
                          "collapsed-width": 64,
                          breakpoint: "lg",
                          class: "left-sider border-r"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="sider-inner p-3" data-v-67dbdf1b${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_input_search, {
                                value: filter.value,
                                "onUpdate:value": ($event) => filter.value = $event,
                                "allow-clear": "",
                                placeholder: "Search courses...",
                                class: "mb-3"
                              }, null, _parent5, _scopeId4));
                              if (!leftCollapsed.value) {
                                _push5(ssrRenderComponent(_component_a_card, {
                                  size: "small",
                                  bordered: false,
                                  title: "Filters",
                                  class: "mb-3"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_segmented, {
                                        value: statusFilter.value,
                                        "onUpdate:value": ($event) => statusFilter.value = $event,
                                        options: [
                                          { label: "All", value: "all" },
                                          { label: "Graded", value: "graded" },
                                          { label: "Pending", value: "pending" },
                                          { label: "Submitted", value: "submitted" }
                                        ]
                                      }, null, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_a_segmented, {
                                          value: statusFilter.value,
                                          "onUpdate:value": ($event) => statusFilter.value = $event,
                                          options: [
                                            { label: "All", value: "all" },
                                            { label: "Graded", value: "graded" },
                                            { label: "Pending", value: "pending" },
                                            { label: "Submitted", value: "submitted" }
                                          ]
                                        }, null, 8, ["value", "onUpdate:value"])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                              _push5(ssrRenderComponent(_component_a_divider, null, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_list, {
                                size: "small",
                                "data-source": courses.value,
                                "row-key": (c) => c.courseId,
                                class: "course-list"
                              }, {
                                renderItem: withCtx(({ item }, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_list_item, {
                                      class: ["course-item", currentCourseId.value === item.courseId ? "active" : ""],
                                      onClick: ($event) => selectCourse(item.courseId)
                                    }, {
                                      default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_list_item_meta, {
                                            title: item.courseName,
                                            description: `${item.gradedCount} graded • avg ${item.avg}%`
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_list_item_meta, {
                                              title: item.courseName,
                                              description: `${item.gradedCount} graded • avg ${item.avg}%`
                                            }, null, 8, ["title", "description"])
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_list_item, {
                                        class: ["course-item", currentCourseId.value === item.courseId ? "active" : ""],
                                        onClick: ($event) => selectCourse(item.courseId)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_list_item_meta, {
                                            title: item.courseName,
                                            description: `${item.gradedCount} graded • avg ${item.avg}%`
                                          }, null, 8, ["title", "description"])
                                        ]),
                                        _: 2
                                      }, 1032, ["class", "onClick"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                            } else {
                              return [
                                createVNode("div", { class: "sider-inner p-3" }, [
                                  createVNode(_component_a_input_search, {
                                    value: filter.value,
                                    "onUpdate:value": ($event) => filter.value = $event,
                                    "allow-clear": "",
                                    placeholder: "Search courses...",
                                    class: "mb-3"
                                  }, null, 8, ["value", "onUpdate:value"]),
                                  !leftCollapsed.value ? (openBlock(), createBlock(_component_a_card, {
                                    key: 0,
                                    size: "small",
                                    bordered: false,
                                    title: "Filters",
                                    class: "mb-3"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_segmented, {
                                        value: statusFilter.value,
                                        "onUpdate:value": ($event) => statusFilter.value = $event,
                                        options: [
                                          { label: "All", value: "all" },
                                          { label: "Graded", value: "graded" },
                                          { label: "Pending", value: "pending" },
                                          { label: "Submitted", value: "submitted" }
                                        ]
                                      }, null, 8, ["value", "onUpdate:value"])
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true),
                                  createVNode(_component_a_divider),
                                  createVNode(_component_a_list, {
                                    size: "small",
                                    "data-source": courses.value,
                                    "row-key": (c) => c.courseId,
                                    class: "course-list"
                                  }, {
                                    renderItem: withCtx(({ item }) => [
                                      createVNode(_component_a_list_item, {
                                        class: ["course-item", currentCourseId.value === item.courseId ? "active" : ""],
                                        onClick: ($event) => selectCourse(item.courseId)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_list_item_meta, {
                                            title: item.courseName,
                                            description: `${item.gradedCount} graded • avg ${item.avg}%`
                                          }, null, 8, ["title", "description"])
                                        ]),
                                        _: 2
                                      }, 1032, ["class", "onClick"])
                                    ]),
                                    _: 1
                                  }, 8, ["data-source", "row-key"])
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_layout_content, { class: "center-content px-6 py-6" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_breadcrumb, { class: "mb-4" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_breadcrumb_item, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Students`);
                                        } else {
                                          return [
                                            createTextVNode("Students")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_breadcrumb_item, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Gradebook`);
                                        } else {
                                          return [
                                            createTextVNode("Gradebook")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
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
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_card, {
                                loading: loading.value,
                                class: "mb-5",
                                bordered: ""
                              }, {
                                title: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="flex justify-between items-center" data-v-67dbdf1b${_scopeId5}><span class="font-semibold" data-v-67dbdf1b${_scopeId5}>${ssrInterpolate(currentCourse.value?.courseName || "Your Grades")}</span>`);
                                    _push6(ssrRenderComponent(_component_a_tag, { color: "blue" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(grades.value.length)} records`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(grades.value.length) + " records", 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`</div>`);
                                  } else {
                                    return [
                                      createVNode("div", { class: "flex justify-between items-center" }, [
                                        createVNode("span", { class: "font-semibold" }, toDisplayString(currentCourse.value?.courseName || "Your Grades"), 1),
                                        createVNode(_component_a_tag, { color: "blue" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(grades.value.length) + " records", 1)
                                          ]),
                                          _: 1
                                        })
                                      ])
                                    ];
                                  }
                                }),
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="grid md:grid-cols-3 gap-4" data-v-67dbdf1b${_scopeId5}>`);
                                    _push6(ssrRenderComponent(_component_a_card, {
                                      size: "small",
                                      class: "kpi-card"
                                    }, {
                                      title: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Average Grade`);
                                        } else {
                                          return [
                                            createTextVNode("Average Grade")
                                          ];
                                        }
                                      }),
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<div class="kpi-value text-green-600" data-v-67dbdf1b${_scopeId6}>${ssrInterpolate(metrics.value.average ?? "—")}% </div>`);
                                        } else {
                                          return [
                                            createVNode("div", { class: "kpi-value text-green-600" }, toDisplayString(metrics.value.average ?? "—") + "% ", 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_card, {
                                      size: "small",
                                      class: "kpi-card"
                                    }, {
                                      title: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Completed`);
                                        } else {
                                          return [
                                            createTextVNode("Completed")
                                          ];
                                        }
                                      }),
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<div class="kpi-value text-blue-600" data-v-67dbdf1b${_scopeId6}>${ssrInterpolate(metrics.value.completed)}/${ssrInterpolate(metrics.value.total)}</div>`);
                                        } else {
                                          return [
                                            createVNode("div", { class: "kpi-value text-blue-600" }, toDisplayString(metrics.value.completed) + "/" + toDisplayString(metrics.value.total), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_card, {
                                      size: "small",
                                      class: "kpi-card"
                                    }, {
                                      title: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Pending`);
                                        } else {
                                          return [
                                            createTextVNode("Pending")
                                          ];
                                        }
                                      }),
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<div class="kpi-value text-orange-500" data-v-67dbdf1b${_scopeId6}>${ssrInterpolate(metrics.value.pending)}</div>`);
                                        } else {
                                          return [
                                            createVNode("div", { class: "kpi-value text-orange-500" }, toDisplayString(metrics.value.pending), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`</div>`);
                                  } else {
                                    return [
                                      createVNode("div", { class: "grid md:grid-cols-3 gap-4" }, [
                                        createVNode(_component_a_card, {
                                          size: "small",
                                          class: "kpi-card"
                                        }, {
                                          title: withCtx(() => [
                                            createTextVNode("Average Grade")
                                          ]),
                                          default: withCtx(() => [
                                            createVNode("div", { class: "kpi-value text-green-600" }, toDisplayString(metrics.value.average ?? "—") + "% ", 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_card, {
                                          size: "small",
                                          class: "kpi-card"
                                        }, {
                                          title: withCtx(() => [
                                            createTextVNode("Completed")
                                          ]),
                                          default: withCtx(() => [
                                            createVNode("div", { class: "kpi-value text-blue-600" }, toDisplayString(metrics.value.completed) + "/" + toDisplayString(metrics.value.total), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_card, {
                                          size: "small",
                                          class: "kpi-card"
                                        }, {
                                          title: withCtx(() => [
                                            createTextVNode("Pending")
                                          ]),
                                          default: withCtx(() => [
                                            createVNode("div", { class: "kpi-value text-orange-500" }, toDisplayString(metrics.value.pending), 1)
                                          ]),
                                          _: 1
                                        })
                                      ])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_card, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_tabs, {
                                      activeKey: tab.value,
                                      "onUpdate:activeKey": ($event) => tab.value = $event,
                                      animated: ""
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_tab_pane, {
                                            key: "grades",
                                            tab: "Grades"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                if (grades.value.length === 0) {
                                                  _push8(ssrRenderComponent(_component_a_alert, {
                                                    type: "info",
                                                    message: "No grades available.",
                                                    class: "mb-4"
                                                  }, null, _parent8, _scopeId7));
                                                } else {
                                                  _push8(ssrRenderComponent(_component_a_table, {
                                                    columns: gradeColumns,
                                                    "data-source": grades.value,
                                                    "row-key": "id",
                                                    bordered: "",
                                                    pagination: { pageSize: 8 }
                                                  }, null, _parent8, _scopeId7));
                                                }
                                              } else {
                                                return [
                                                  grades.value.length === 0 ? (openBlock(), createBlock(_component_a_alert, {
                                                    key: 0,
                                                    type: "info",
                                                    message: "No grades available.",
                                                    class: "mb-4"
                                                  })) : (openBlock(), createBlock(_component_a_table, {
                                                    key: 1,
                                                    columns: gradeColumns,
                                                    "data-source": grades.value,
                                                    "row-key": "id",
                                                    bordered: "",
                                                    pagination: { pageSize: 8 }
                                                  }, null, 8, ["data-source"]))
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_tab_pane, {
                                            key: "analytics",
                                            tab: "Analytics"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`<div class="grid md:grid-cols-2 gap-6" data-v-67dbdf1b${_scopeId7}>`);
                                                _push8(ssrRenderComponent(_component_a_card, {
                                                  size: "small",
                                                  title: "Distribution"
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(`<!--[-->`);
                                                      ssrRenderList(gradeDistribution.value, (count, label) => {
                                                        _push9(`<div class="py-2" data-v-67dbdf1b${_scopeId8}><div class="flex justify-between items-center" data-v-67dbdf1b${_scopeId8}><span data-v-67dbdf1b${_scopeId8}>${ssrInterpolate(label)}</span>`);
                                                        _push9(ssrRenderComponent(_component_a_progress, {
                                                          percent: count / grades.value.length * 100,
                                                          format: () => count
                                                        }, null, _parent9, _scopeId8));
                                                        _push9(`</div></div>`);
                                                      });
                                                      _push9(`<!--]-->`);
                                                    } else {
                                                      return [
                                                        (openBlock(true), createBlock(Fragment, null, renderList(gradeDistribution.value, (count, label) => {
                                                          return openBlock(), createBlock("div", {
                                                            key: label,
                                                            class: "py-2"
                                                          }, [
                                                            createVNode("div", { class: "flex justify-between items-center" }, [
                                                              createVNode("span", null, toDisplayString(label), 1),
                                                              createVNode(_component_a_progress, {
                                                                percent: count / grades.value.length * 100,
                                                                format: () => count
                                                              }, null, 8, ["percent", "format"])
                                                            ])
                                                          ]);
                                                        }), 128))
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(_component_a_card, {
                                                  size: "small",
                                                  title: "Performance Trend"
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(`<p data-v-67dbdf1b${_scopeId8}>Current average: <b data-v-67dbdf1b${_scopeId8}>${ssrInterpolate(metrics.value.average)}%</b></p><p data-v-67dbdf1b${_scopeId8}>Last semester: <b data-v-67dbdf1b${_scopeId8}>82%</b></p>`);
                                                      _push9(ssrRenderComponent(_component_a_progress, {
                                                        percent: metrics.value.average
                                                      }, null, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode("p", null, [
                                                          createTextVNode("Current average: "),
                                                          createVNode("b", null, toDisplayString(metrics.value.average) + "%", 1)
                                                        ]),
                                                        createVNode("p", null, [
                                                          createTextVNode("Last semester: "),
                                                          createVNode("b", null, "82%")
                                                        ]),
                                                        createVNode(_component_a_progress, {
                                                          percent: metrics.value.average
                                                        }, null, 8, ["percent"])
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(`</div>`);
                                              } else {
                                                return [
                                                  createVNode("div", { class: "grid md:grid-cols-2 gap-6" }, [
                                                    createVNode(_component_a_card, {
                                                      size: "small",
                                                      title: "Distribution"
                                                    }, {
                                                      default: withCtx(() => [
                                                        (openBlock(true), createBlock(Fragment, null, renderList(gradeDistribution.value, (count, label) => {
                                                          return openBlock(), createBlock("div", {
                                                            key: label,
                                                            class: "py-2"
                                                          }, [
                                                            createVNode("div", { class: "flex justify-between items-center" }, [
                                                              createVNode("span", null, toDisplayString(label), 1),
                                                              createVNode(_component_a_progress, {
                                                                percent: count / grades.value.length * 100,
                                                                format: () => count
                                                              }, null, 8, ["percent", "format"])
                                                            ])
                                                          ]);
                                                        }), 128))
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_card, {
                                                      size: "small",
                                                      title: "Performance Trend"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode("p", null, [
                                                          createTextVNode("Current average: "),
                                                          createVNode("b", null, toDisplayString(metrics.value.average) + "%", 1)
                                                        ]),
                                                        createVNode("p", null, [
                                                          createTextVNode("Last semester: "),
                                                          createVNode("b", null, "82%")
                                                        ]),
                                                        createVNode(_component_a_progress, {
                                                          percent: metrics.value.average
                                                        }, null, 8, ["percent"])
                                                      ]),
                                                      _: 1
                                                    })
                                                  ])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_tab_pane, {
                                            key: "feedback",
                                            tab: "Feedback"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                if (feedbackList.value.length === 0) {
                                                  _push8(ssrRenderComponent(_component_a_empty, null, null, _parent8, _scopeId7));
                                                } else {
                                                  _push8(`<!---->`);
                                                }
                                                _push8(`<!--[-->`);
                                                ssrRenderList(feedbackList.value, (f) => {
                                                  _push8(ssrRenderComponent(_component_a_card, {
                                                    key: f.id,
                                                    class: "mb-3"
                                                  }, {
                                                    title: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`<div class="flex justify-between items-center" data-v-67dbdf1b${_scopeId8}><span data-v-67dbdf1b${_scopeId8}>${ssrInterpolate(f.assignmentName)}</span>`);
                                                        _push9(ssrRenderComponent(_component_a_tag, {
                                                          color: statusColor(f.status)
                                                        }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`${ssrInterpolate(f.status)}`);
                                                            } else {
                                                              return [
                                                                createTextVNode(toDisplayString(f.status), 1)
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(`</div>`);
                                                      } else {
                                                        return [
                                                          createVNode("div", { class: "flex justify-between items-center" }, [
                                                            createVNode("span", null, toDisplayString(f.assignmentName), 1),
                                                            createVNode(_component_a_tag, {
                                                              color: statusColor(f.status)
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(f.status), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["color"])
                                                          ])
                                                        ];
                                                      }
                                                    }),
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`<p data-v-67dbdf1b${_scopeId8}><b data-v-67dbdf1b${_scopeId8}>Grade:</b> ${ssrInterpolate(f.grade ?? "—")}</p><p data-v-67dbdf1b${_scopeId8}><b data-v-67dbdf1b${_scopeId8}>Feedback:</b> ${ssrInterpolate(f.feedback || "—")}</p><div class="text-muted text-xs" data-v-67dbdf1b${_scopeId8}> Updated: ${ssrInterpolate(format(f.updatedAt))}</div>`);
                                                      } else {
                                                        return [
                                                          createVNode("p", null, [
                                                            createVNode("b", null, "Grade:"),
                                                            createTextVNode(" " + toDisplayString(f.grade ?? "—"), 1)
                                                          ]),
                                                          createVNode("p", null, [
                                                            createVNode("b", null, "Feedback:"),
                                                            createTextVNode(" " + toDisplayString(f.feedback || "—"), 1)
                                                          ]),
                                                          createVNode("div", { class: "text-muted text-xs" }, " Updated: " + toDisplayString(format(f.updatedAt)), 1)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                });
                                                _push8(`<!--]-->`);
                                              } else {
                                                return [
                                                  feedbackList.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, { key: 0 })) : createCommentVNode("", true),
                                                  (openBlock(true), createBlock(Fragment, null, renderList(feedbackList.value, (f) => {
                                                    return openBlock(), createBlock(_component_a_card, {
                                                      key: f.id,
                                                      class: "mb-3"
                                                    }, {
                                                      title: withCtx(() => [
                                                        createVNode("div", { class: "flex justify-between items-center" }, [
                                                          createVNode("span", null, toDisplayString(f.assignmentName), 1),
                                                          createVNode(_component_a_tag, {
                                                            color: statusColor(f.status)
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(f.status), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["color"])
                                                        ])
                                                      ]),
                                                      default: withCtx(() => [
                                                        createVNode("p", null, [
                                                          createVNode("b", null, "Grade:"),
                                                          createTextVNode(" " + toDisplayString(f.grade ?? "—"), 1)
                                                        ]),
                                                        createVNode("p", null, [
                                                          createVNode("b", null, "Feedback:"),
                                                          createTextVNode(" " + toDisplayString(f.feedback || "—"), 1)
                                                        ]),
                                                        createVNode("div", { class: "text-muted text-xs" }, " Updated: " + toDisplayString(format(f.updatedAt)), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024);
                                                  }), 128))
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_tab_pane, {
                                              key: "grades",
                                              tab: "Grades"
                                            }, {
                                              default: withCtx(() => [
                                                grades.value.length === 0 ? (openBlock(), createBlock(_component_a_alert, {
                                                  key: 0,
                                                  type: "info",
                                                  message: "No grades available.",
                                                  class: "mb-4"
                                                })) : (openBlock(), createBlock(_component_a_table, {
                                                  key: 1,
                                                  columns: gradeColumns,
                                                  "data-source": grades.value,
                                                  "row-key": "id",
                                                  bordered: "",
                                                  pagination: { pageSize: 8 }
                                                }, null, 8, ["data-source"]))
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_tab_pane, {
                                              key: "analytics",
                                              tab: "Analytics"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "grid md:grid-cols-2 gap-6" }, [
                                                  createVNode(_component_a_card, {
                                                    size: "small",
                                                    title: "Distribution"
                                                  }, {
                                                    default: withCtx(() => [
                                                      (openBlock(true), createBlock(Fragment, null, renderList(gradeDistribution.value, (count, label) => {
                                                        return openBlock(), createBlock("div", {
                                                          key: label,
                                                          class: "py-2"
                                                        }, [
                                                          createVNode("div", { class: "flex justify-between items-center" }, [
                                                            createVNode("span", null, toDisplayString(label), 1),
                                                            createVNode(_component_a_progress, {
                                                              percent: count / grades.value.length * 100,
                                                              format: () => count
                                                            }, null, 8, ["percent", "format"])
                                                          ])
                                                        ]);
                                                      }), 128))
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(_component_a_card, {
                                                    size: "small",
                                                    title: "Performance Trend"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode("p", null, [
                                                        createTextVNode("Current average: "),
                                                        createVNode("b", null, toDisplayString(metrics.value.average) + "%", 1)
                                                      ]),
                                                      createVNode("p", null, [
                                                        createTextVNode("Last semester: "),
                                                        createVNode("b", null, "82%")
                                                      ]),
                                                      createVNode(_component_a_progress, {
                                                        percent: metrics.value.average
                                                      }, null, 8, ["percent"])
                                                    ]),
                                                    _: 1
                                                  })
                                                ])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_tab_pane, {
                                              key: "feedback",
                                              tab: "Feedback"
                                            }, {
                                              default: withCtx(() => [
                                                feedbackList.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, { key: 0 })) : createCommentVNode("", true),
                                                (openBlock(true), createBlock(Fragment, null, renderList(feedbackList.value, (f) => {
                                                  return openBlock(), createBlock(_component_a_card, {
                                                    key: f.id,
                                                    class: "mb-3"
                                                  }, {
                                                    title: withCtx(() => [
                                                      createVNode("div", { class: "flex justify-between items-center" }, [
                                                        createVNode("span", null, toDisplayString(f.assignmentName), 1),
                                                        createVNode(_component_a_tag, {
                                                          color: statusColor(f.status)
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(f.status), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["color"])
                                                      ])
                                                    ]),
                                                    default: withCtx(() => [
                                                      createVNode("p", null, [
                                                        createVNode("b", null, "Grade:"),
                                                        createTextVNode(" " + toDisplayString(f.grade ?? "—"), 1)
                                                      ]),
                                                      createVNode("p", null, [
                                                        createVNode("b", null, "Feedback:"),
                                                        createTextVNode(" " + toDisplayString(f.feedback || "—"), 1)
                                                      ]),
                                                      createVNode("div", { class: "text-muted text-xs" }, " Updated: " + toDisplayString(format(f.updatedAt)), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024);
                                                }), 128))
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_tabs, {
                                        activeKey: tab.value,
                                        "onUpdate:activeKey": ($event) => tab.value = $event,
                                        animated: ""
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_tab_pane, {
                                            key: "grades",
                                            tab: "Grades"
                                          }, {
                                            default: withCtx(() => [
                                              grades.value.length === 0 ? (openBlock(), createBlock(_component_a_alert, {
                                                key: 0,
                                                type: "info",
                                                message: "No grades available.",
                                                class: "mb-4"
                                              })) : (openBlock(), createBlock(_component_a_table, {
                                                key: 1,
                                                columns: gradeColumns,
                                                "data-source": grades.value,
                                                "row-key": "id",
                                                bordered: "",
                                                pagination: { pageSize: 8 }
                                              }, null, 8, ["data-source"]))
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_tab_pane, {
                                            key: "analytics",
                                            tab: "Analytics"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "grid md:grid-cols-2 gap-6" }, [
                                                createVNode(_component_a_card, {
                                                  size: "small",
                                                  title: "Distribution"
                                                }, {
                                                  default: withCtx(() => [
                                                    (openBlock(true), createBlock(Fragment, null, renderList(gradeDistribution.value, (count, label) => {
                                                      return openBlock(), createBlock("div", {
                                                        key: label,
                                                        class: "py-2"
                                                      }, [
                                                        createVNode("div", { class: "flex justify-between items-center" }, [
                                                          createVNode("span", null, toDisplayString(label), 1),
                                                          createVNode(_component_a_progress, {
                                                            percent: count / grades.value.length * 100,
                                                            format: () => count
                                                          }, null, 8, ["percent", "format"])
                                                        ])
                                                      ]);
                                                    }), 128))
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_card, {
                                                  size: "small",
                                                  title: "Performance Trend"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode("p", null, [
                                                      createTextVNode("Current average: "),
                                                      createVNode("b", null, toDisplayString(metrics.value.average) + "%", 1)
                                                    ]),
                                                    createVNode("p", null, [
                                                      createTextVNode("Last semester: "),
                                                      createVNode("b", null, "82%")
                                                    ]),
                                                    createVNode(_component_a_progress, {
                                                      percent: metrics.value.average
                                                    }, null, 8, ["percent"])
                                                  ]),
                                                  _: 1
                                                })
                                              ])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_tab_pane, {
                                            key: "feedback",
                                            tab: "Feedback"
                                          }, {
                                            default: withCtx(() => [
                                              feedbackList.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, { key: 0 })) : createCommentVNode("", true),
                                              (openBlock(true), createBlock(Fragment, null, renderList(feedbackList.value, (f) => {
                                                return openBlock(), createBlock(_component_a_card, {
                                                  key: f.id,
                                                  class: "mb-3"
                                                }, {
                                                  title: withCtx(() => [
                                                    createVNode("div", { class: "flex justify-between items-center" }, [
                                                      createVNode("span", null, toDisplayString(f.assignmentName), 1),
                                                      createVNode(_component_a_tag, {
                                                        color: statusColor(f.status)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(f.status), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["color"])
                                                    ])
                                                  ]),
                                                  default: withCtx(() => [
                                                    createVNode("p", null, [
                                                      createVNode("b", null, "Grade:"),
                                                      createTextVNode(" " + toDisplayString(f.grade ?? "—"), 1)
                                                    ]),
                                                    createVNode("p", null, [
                                                      createVNode("b", null, "Feedback:"),
                                                      createTextVNode(" " + toDisplayString(f.feedback || "—"), 1)
                                                    ]),
                                                    createVNode("div", { class: "text-muted text-xs" }, " Updated: " + toDisplayString(format(f.updatedAt)), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024);
                                              }), 128))
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
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_breadcrumb, { class: "mb-4" }, {
                                  default: withCtx(() => [
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
                                createVNode(_component_a_card, {
                                  loading: loading.value,
                                  class: "mb-5",
                                  bordered: ""
                                }, {
                                  title: withCtx(() => [
                                    createVNode("div", { class: "flex justify-between items-center" }, [
                                      createVNode("span", { class: "font-semibold" }, toDisplayString(currentCourse.value?.courseName || "Your Grades"), 1),
                                      createVNode(_component_a_tag, { color: "blue" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(grades.value.length) + " records", 1)
                                        ]),
                                        _: 1
                                      })
                                    ])
                                  ]),
                                  default: withCtx(() => [
                                    createVNode("div", { class: "grid md:grid-cols-3 gap-4" }, [
                                      createVNode(_component_a_card, {
                                        size: "small",
                                        class: "kpi-card"
                                      }, {
                                        title: withCtx(() => [
                                          createTextVNode("Average Grade")
                                        ]),
                                        default: withCtx(() => [
                                          createVNode("div", { class: "kpi-value text-green-600" }, toDisplayString(metrics.value.average ?? "—") + "% ", 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_card, {
                                        size: "small",
                                        class: "kpi-card"
                                      }, {
                                        title: withCtx(() => [
                                          createTextVNode("Completed")
                                        ]),
                                        default: withCtx(() => [
                                          createVNode("div", { class: "kpi-value text-blue-600" }, toDisplayString(metrics.value.completed) + "/" + toDisplayString(metrics.value.total), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_card, {
                                        size: "small",
                                        class: "kpi-card"
                                      }, {
                                        title: withCtx(() => [
                                          createTextVNode("Pending")
                                        ]),
                                        default: withCtx(() => [
                                          createVNode("div", { class: "kpi-value text-orange-500" }, toDisplayString(metrics.value.pending), 1)
                                        ]),
                                        _: 1
                                      })
                                    ])
                                  ]),
                                  _: 1
                                }, 8, ["loading"]),
                                createVNode(_component_a_card, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_tabs, {
                                      activeKey: tab.value,
                                      "onUpdate:activeKey": ($event) => tab.value = $event,
                                      animated: ""
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_tab_pane, {
                                          key: "grades",
                                          tab: "Grades"
                                        }, {
                                          default: withCtx(() => [
                                            grades.value.length === 0 ? (openBlock(), createBlock(_component_a_alert, {
                                              key: 0,
                                              type: "info",
                                              message: "No grades available.",
                                              class: "mb-4"
                                            })) : (openBlock(), createBlock(_component_a_table, {
                                              key: 1,
                                              columns: gradeColumns,
                                              "data-source": grades.value,
                                              "row-key": "id",
                                              bordered: "",
                                              pagination: { pageSize: 8 }
                                            }, null, 8, ["data-source"]))
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_tab_pane, {
                                          key: "analytics",
                                          tab: "Analytics"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "grid md:grid-cols-2 gap-6" }, [
                                              createVNode(_component_a_card, {
                                                size: "small",
                                                title: "Distribution"
                                              }, {
                                                default: withCtx(() => [
                                                  (openBlock(true), createBlock(Fragment, null, renderList(gradeDistribution.value, (count, label) => {
                                                    return openBlock(), createBlock("div", {
                                                      key: label,
                                                      class: "py-2"
                                                    }, [
                                                      createVNode("div", { class: "flex justify-between items-center" }, [
                                                        createVNode("span", null, toDisplayString(label), 1),
                                                        createVNode(_component_a_progress, {
                                                          percent: count / grades.value.length * 100,
                                                          format: () => count
                                                        }, null, 8, ["percent", "format"])
                                                      ])
                                                    ]);
                                                  }), 128))
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_card, {
                                                size: "small",
                                                title: "Performance Trend"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode("p", null, [
                                                    createTextVNode("Current average: "),
                                                    createVNode("b", null, toDisplayString(metrics.value.average) + "%", 1)
                                                  ]),
                                                  createVNode("p", null, [
                                                    createTextVNode("Last semester: "),
                                                    createVNode("b", null, "82%")
                                                  ]),
                                                  createVNode(_component_a_progress, {
                                                    percent: metrics.value.average
                                                  }, null, 8, ["percent"])
                                                ]),
                                                _: 1
                                              })
                                            ])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_tab_pane, {
                                          key: "feedback",
                                          tab: "Feedback"
                                        }, {
                                          default: withCtx(() => [
                                            feedbackList.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, { key: 0 })) : createCommentVNode("", true),
                                            (openBlock(true), createBlock(Fragment, null, renderList(feedbackList.value, (f) => {
                                              return openBlock(), createBlock(_component_a_card, {
                                                key: f.id,
                                                class: "mb-3"
                                              }, {
                                                title: withCtx(() => [
                                                  createVNode("div", { class: "flex justify-between items-center" }, [
                                                    createVNode("span", null, toDisplayString(f.assignmentName), 1),
                                                    createVNode(_component_a_tag, {
                                                      color: statusColor(f.status)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(f.status), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["color"])
                                                  ])
                                                ]),
                                                default: withCtx(() => [
                                                  createVNode("p", null, [
                                                    createVNode("b", null, "Grade:"),
                                                    createTextVNode(" " + toDisplayString(f.grade ?? "—"), 1)
                                                  ]),
                                                  createVNode("p", null, [
                                                    createVNode("b", null, "Feedback:"),
                                                    createTextVNode(" " + toDisplayString(f.feedback || "—"), 1)
                                                  ]),
                                                  createVNode("div", { class: "text-muted text-xs" }, " Updated: " + toDisplayString(format(f.updatedAt)), 1)
                                                ]),
                                                _: 2
                                              }, 1024);
                                            }), 128))
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
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_layout_sider, {
                          width: "340",
                          collapsible: "",
                          collapsed: rightCollapsed.value,
                          "onUpdate:collapsed": ($event) => rightCollapsed.value = $event,
                          "collapsed-width": 64,
                          class: "right-sider border-l"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="right-inner p-3" data-v-67dbdf1b${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_tabs, {
                                activeKey: rightTab.value,
                                "onUpdate:activeKey": ($event) => rightTab.value = $event,
                                size: "small"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_tab_pane, {
                                      key: "notes",
                                      tab: "Notes"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_card, { size: "small" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_a_form, { layout: "vertical" }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(_component_a_form_item, { label: "Course notes" }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(_component_a_textarea, {
                                                              value: notes.value[currentCourseId.value].text,
                                                              "onUpdate:value": ($event) => notes.value[currentCourseId.value].text = $event,
                                                              rows: 6,
                                                              onChange: persistNotes
                                                            }, null, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(_component_a_textarea, {
                                                                value: notes.value[currentCourseId.value].text,
                                                                "onUpdate:value": ($event) => notes.value[currentCourseId.value].text = $event,
                                                                rows: 6,
                                                                onChange: persistNotes
                                                              }, null, 8, ["value", "onUpdate:value"])
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(_component_a_form_item, { label: "Course notes" }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_textarea, {
                                                              value: notes.value[currentCourseId.value].text,
                                                              "onUpdate:value": ($event) => notes.value[currentCourseId.value].text = $event,
                                                              rows: 6,
                                                              onChange: persistNotes
                                                            }, null, 8, ["value", "onUpdate:value"])
                                                          ]),
                                                          _: 1
                                                        })
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(_component_a_form, { layout: "vertical" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_form_item, { label: "Course notes" }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_textarea, {
                                                            value: notes.value[currentCourseId.value].text,
                                                            "onUpdate:value": ($event) => notes.value[currentCourseId.value].text = $event,
                                                            rows: 6,
                                                            onChange: persistNotes
                                                          }, null, 8, ["value", "onUpdate:value"])
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
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_card, { size: "small" }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_form, { layout: "vertical" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_form_item, { label: "Course notes" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_textarea, {
                                                          value: notes.value[currentCourseId.value].text,
                                                          "onUpdate:value": ($event) => notes.value[currentCourseId.value].text = $event,
                                                          rows: 6,
                                                          onChange: persistNotes
                                                        }, null, 8, ["value", "onUpdate:value"])
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
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_tab_pane, {
                                      key: "feed",
                                      tab: "Recent"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_list, {
                                            "data-source": recentFeed.value,
                                            size: "small"
                                          }, {
                                            renderItem: withCtx(({ item }, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_a_list_item, null, {
                                                  default: withCtx((_7, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(_component_a_list_item_meta, {
                                                        title: item.assignment,
                                                        description: item.text
                                                      }, null, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(_component_a_list_item_meta, {
                                                          title: item.assignment,
                                                          description: item.text
                                                        }, null, 8, ["title", "description"])
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(_component_a_list_item, null, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_list_item_meta, {
                                                        title: item.assignment,
                                                        description: item.text
                                                      }, null, 8, ["title", "description"])
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
                                            createVNode(_component_a_list, {
                                              "data-source": recentFeed.value,
                                              size: "small"
                                            }, {
                                              renderItem: withCtx(({ item }) => [
                                                createVNode(_component_a_list_item, null, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_list_item_meta, {
                                                      title: item.assignment,
                                                      description: item.text
                                                    }, null, 8, ["title", "description"])
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
                                      key: "bookmarks",
                                      tab: "Bookmarks"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          if (!bookmarks.value.length) {
                                            _push7(ssrRenderComponent(_component_a_empty, null, null, _parent7, _scopeId6));
                                          } else {
                                            _push7(ssrRenderComponent(_component_a_list, { "data-source": bookmarks.value }, {
                                              renderItem: withCtx(({ item, index }, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_a_list_item, {
                                                    actions: [
                                                      h("a", { onClick: () => removeBookmark(index) }, "Remove")
                                                    ]
                                                  }, {
                                                    default: withCtx((_7, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(_component_a_list_item_meta, {
                                                          title: item.label
                                                        }, null, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(_component_a_list_item_meta, {
                                                            title: item.label
                                                          }, null, 8, ["title"])
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_a_list_item, {
                                                      actions: [
                                                        h("a", { onClick: () => removeBookmark(index) }, "Remove")
                                                      ]
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_list_item_meta, {
                                                          title: item.label
                                                        }, null, 8, ["title"])
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["actions"])
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          }
                                        } else {
                                          return [
                                            !bookmarks.value.length ? (openBlock(), createBlock(_component_a_empty, { key: 0 })) : (openBlock(), createBlock(_component_a_list, {
                                              key: 1,
                                              "data-source": bookmarks.value
                                            }, {
                                              renderItem: withCtx(({ item, index }) => [
                                                createVNode(_component_a_list_item, {
                                                  actions: [
                                                    h("a", { onClick: () => removeBookmark(index) }, "Remove")
                                                  ]
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_list_item_meta, {
                                                      title: item.label
                                                    }, null, 8, ["title"])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["actions"])
                                              ]),
                                              _: 1
                                            }, 8, ["data-source"]))
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_tab_pane, {
                                        key: "notes",
                                        tab: "Notes"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_card, { size: "small" }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_form, { layout: "vertical" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_form_item, { label: "Course notes" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_textarea, {
                                                        value: notes.value[currentCourseId.value].text,
                                                        "onUpdate:value": ($event) => notes.value[currentCourseId.value].text = $event,
                                                        rows: 6,
                                                        onChange: persistNotes
                                                      }, null, 8, ["value", "onUpdate:value"])
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
                                      }),
                                      createVNode(_component_a_tab_pane, {
                                        key: "feed",
                                        tab: "Recent"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_list, {
                                            "data-source": recentFeed.value,
                                            size: "small"
                                          }, {
                                            renderItem: withCtx(({ item }) => [
                                              createVNode(_component_a_list_item, null, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_list_item_meta, {
                                                    title: item.assignment,
                                                    description: item.text
                                                  }, null, 8, ["title", "description"])
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
                                        key: "bookmarks",
                                        tab: "Bookmarks"
                                      }, {
                                        default: withCtx(() => [
                                          !bookmarks.value.length ? (openBlock(), createBlock(_component_a_empty, { key: 0 })) : (openBlock(), createBlock(_component_a_list, {
                                            key: 1,
                                            "data-source": bookmarks.value
                                          }, {
                                            renderItem: withCtx(({ item, index }) => [
                                              createVNode(_component_a_list_item, {
                                                actions: [
                                                  h("a", { onClick: () => removeBookmark(index) }, "Remove")
                                                ]
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_list_item_meta, {
                                                    title: item.label
                                                  }, null, 8, ["title"])
                                                ]),
                                                _: 2
                                              }, 1032, ["actions"])
                                            ]),
                                            _: 1
                                          }, 8, ["data-source"]))
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
                                createVNode("div", { class: "right-inner p-3" }, [
                                  createVNode(_component_a_tabs, {
                                    activeKey: rightTab.value,
                                    "onUpdate:activeKey": ($event) => rightTab.value = $event,
                                    size: "small"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_tab_pane, {
                                        key: "notes",
                                        tab: "Notes"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_card, { size: "small" }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_form, { layout: "vertical" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_form_item, { label: "Course notes" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_textarea, {
                                                        value: notes.value[currentCourseId.value].text,
                                                        "onUpdate:value": ($event) => notes.value[currentCourseId.value].text = $event,
                                                        rows: 6,
                                                        onChange: persistNotes
                                                      }, null, 8, ["value", "onUpdate:value"])
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
                                      }),
                                      createVNode(_component_a_tab_pane, {
                                        key: "feed",
                                        tab: "Recent"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_list, {
                                            "data-source": recentFeed.value,
                                            size: "small"
                                          }, {
                                            renderItem: withCtx(({ item }) => [
                                              createVNode(_component_a_list_item, null, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_list_item_meta, {
                                                    title: item.assignment,
                                                    description: item.text
                                                  }, null, 8, ["title", "description"])
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
                                        key: "bookmarks",
                                        tab: "Bookmarks"
                                      }, {
                                        default: withCtx(() => [
                                          !bookmarks.value.length ? (openBlock(), createBlock(_component_a_empty, { key: 0 })) : (openBlock(), createBlock(_component_a_list, {
                                            key: 1,
                                            "data-source": bookmarks.value
                                          }, {
                                            renderItem: withCtx(({ item, index }) => [
                                              createVNode(_component_a_list_item, {
                                                actions: [
                                                  h("a", { onClick: () => removeBookmark(index) }, "Remove")
                                                ]
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_list_item_meta, {
                                                    title: item.label
                                                  }, null, 8, ["title"])
                                                ]),
                                                _: 2
                                              }, 1032, ["actions"])
                                            ]),
                                            _: 1
                                          }, 8, ["data-source"]))
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["activeKey", "onUpdate:activeKey"])
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_layout_sider, {
                            width: "300",
                            collapsible: "",
                            collapsed: leftCollapsed.value,
                            "onUpdate:collapsed": ($event) => leftCollapsed.value = $event,
                            "collapsed-width": 64,
                            breakpoint: "lg",
                            class: "left-sider border-r"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "sider-inner p-3" }, [
                                createVNode(_component_a_input_search, {
                                  value: filter.value,
                                  "onUpdate:value": ($event) => filter.value = $event,
                                  "allow-clear": "",
                                  placeholder: "Search courses...",
                                  class: "mb-3"
                                }, null, 8, ["value", "onUpdate:value"]),
                                !leftCollapsed.value ? (openBlock(), createBlock(_component_a_card, {
                                  key: 0,
                                  size: "small",
                                  bordered: false,
                                  title: "Filters",
                                  class: "mb-3"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_segmented, {
                                      value: statusFilter.value,
                                      "onUpdate:value": ($event) => statusFilter.value = $event,
                                      options: [
                                        { label: "All", value: "all" },
                                        { label: "Graded", value: "graded" },
                                        { label: "Pending", value: "pending" },
                                        { label: "Submitted", value: "submitted" }
                                      ]
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                createVNode(_component_a_divider),
                                createVNode(_component_a_list, {
                                  size: "small",
                                  "data-source": courses.value,
                                  "row-key": (c) => c.courseId,
                                  class: "course-list"
                                }, {
                                  renderItem: withCtx(({ item }) => [
                                    createVNode(_component_a_list_item, {
                                      class: ["course-item", currentCourseId.value === item.courseId ? "active" : ""],
                                      onClick: ($event) => selectCourse(item.courseId)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_list_item_meta, {
                                          title: item.courseName,
                                          description: `${item.gradedCount} graded • avg ${item.avg}%`
                                        }, null, 8, ["title", "description"])
                                      ]),
                                      _: 2
                                    }, 1032, ["class", "onClick"])
                                  ]),
                                  _: 1
                                }, 8, ["data-source", "row-key"])
                              ])
                            ]),
                            _: 1
                          }, 8, ["collapsed", "onUpdate:collapsed"]),
                          createVNode(_component_a_layout_content, { class: "center-content px-6 py-6" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_breadcrumb, { class: "mb-4" }, {
                                default: withCtx(() => [
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
                              createVNode(_component_a_card, {
                                loading: loading.value,
                                class: "mb-5",
                                bordered: ""
                              }, {
                                title: withCtx(() => [
                                  createVNode("div", { class: "flex justify-between items-center" }, [
                                    createVNode("span", { class: "font-semibold" }, toDisplayString(currentCourse.value?.courseName || "Your Grades"), 1),
                                    createVNode(_component_a_tag, { color: "blue" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(grades.value.length) + " records", 1)
                                      ]),
                                      _: 1
                                    })
                                  ])
                                ]),
                                default: withCtx(() => [
                                  createVNode("div", { class: "grid md:grid-cols-3 gap-4" }, [
                                    createVNode(_component_a_card, {
                                      size: "small",
                                      class: "kpi-card"
                                    }, {
                                      title: withCtx(() => [
                                        createTextVNode("Average Grade")
                                      ]),
                                      default: withCtx(() => [
                                        createVNode("div", { class: "kpi-value text-green-600" }, toDisplayString(metrics.value.average ?? "—") + "% ", 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_card, {
                                      size: "small",
                                      class: "kpi-card"
                                    }, {
                                      title: withCtx(() => [
                                        createTextVNode("Completed")
                                      ]),
                                      default: withCtx(() => [
                                        createVNode("div", { class: "kpi-value text-blue-600" }, toDisplayString(metrics.value.completed) + "/" + toDisplayString(metrics.value.total), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_card, {
                                      size: "small",
                                      class: "kpi-card"
                                    }, {
                                      title: withCtx(() => [
                                        createTextVNode("Pending")
                                      ]),
                                      default: withCtx(() => [
                                        createVNode("div", { class: "kpi-value text-orange-500" }, toDisplayString(metrics.value.pending), 1)
                                      ]),
                                      _: 1
                                    })
                                  ])
                                ]),
                                _: 1
                              }, 8, ["loading"]),
                              createVNode(_component_a_card, null, {
                                default: withCtx(() => [
                                  createVNode(_component_a_tabs, {
                                    activeKey: tab.value,
                                    "onUpdate:activeKey": ($event) => tab.value = $event,
                                    animated: ""
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_tab_pane, {
                                        key: "grades",
                                        tab: "Grades"
                                      }, {
                                        default: withCtx(() => [
                                          grades.value.length === 0 ? (openBlock(), createBlock(_component_a_alert, {
                                            key: 0,
                                            type: "info",
                                            message: "No grades available.",
                                            class: "mb-4"
                                          })) : (openBlock(), createBlock(_component_a_table, {
                                            key: 1,
                                            columns: gradeColumns,
                                            "data-source": grades.value,
                                            "row-key": "id",
                                            bordered: "",
                                            pagination: { pageSize: 8 }
                                          }, null, 8, ["data-source"]))
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_tab_pane, {
                                        key: "analytics",
                                        tab: "Analytics"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("div", { class: "grid md:grid-cols-2 gap-6" }, [
                                            createVNode(_component_a_card, {
                                              size: "small",
                                              title: "Distribution"
                                            }, {
                                              default: withCtx(() => [
                                                (openBlock(true), createBlock(Fragment, null, renderList(gradeDistribution.value, (count, label) => {
                                                  return openBlock(), createBlock("div", {
                                                    key: label,
                                                    class: "py-2"
                                                  }, [
                                                    createVNode("div", { class: "flex justify-between items-center" }, [
                                                      createVNode("span", null, toDisplayString(label), 1),
                                                      createVNode(_component_a_progress, {
                                                        percent: count / grades.value.length * 100,
                                                        format: () => count
                                                      }, null, 8, ["percent", "format"])
                                                    ])
                                                  ]);
                                                }), 128))
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_card, {
                                              size: "small",
                                              title: "Performance Trend"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode("p", null, [
                                                  createTextVNode("Current average: "),
                                                  createVNode("b", null, toDisplayString(metrics.value.average) + "%", 1)
                                                ]),
                                                createVNode("p", null, [
                                                  createTextVNode("Last semester: "),
                                                  createVNode("b", null, "82%")
                                                ]),
                                                createVNode(_component_a_progress, {
                                                  percent: metrics.value.average
                                                }, null, 8, ["percent"])
                                              ]),
                                              _: 1
                                            })
                                          ])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_tab_pane, {
                                        key: "feedback",
                                        tab: "Feedback"
                                      }, {
                                        default: withCtx(() => [
                                          feedbackList.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, { key: 0 })) : createCommentVNode("", true),
                                          (openBlock(true), createBlock(Fragment, null, renderList(feedbackList.value, (f) => {
                                            return openBlock(), createBlock(_component_a_card, {
                                              key: f.id,
                                              class: "mb-3"
                                            }, {
                                              title: withCtx(() => [
                                                createVNode("div", { class: "flex justify-between items-center" }, [
                                                  createVNode("span", null, toDisplayString(f.assignmentName), 1),
                                                  createVNode(_component_a_tag, {
                                                    color: statusColor(f.status)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(f.status), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["color"])
                                                ])
                                              ]),
                                              default: withCtx(() => [
                                                createVNode("p", null, [
                                                  createVNode("b", null, "Grade:"),
                                                  createTextVNode(" " + toDisplayString(f.grade ?? "—"), 1)
                                                ]),
                                                createVNode("p", null, [
                                                  createVNode("b", null, "Feedback:"),
                                                  createTextVNode(" " + toDisplayString(f.feedback || "—"), 1)
                                                ]),
                                                createVNode("div", { class: "text-muted text-xs" }, " Updated: " + toDisplayString(format(f.updatedAt)), 1)
                                              ]),
                                              _: 2
                                            }, 1024);
                                          }), 128))
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["activeKey", "onUpdate:activeKey"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_layout_sider, {
                            width: "340",
                            collapsible: "",
                            collapsed: rightCollapsed.value,
                            "onUpdate:collapsed": ($event) => rightCollapsed.value = $event,
                            "collapsed-width": 64,
                            class: "right-sider border-l"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "right-inner p-3" }, [
                                createVNode(_component_a_tabs, {
                                  activeKey: rightTab.value,
                                  "onUpdate:activeKey": ($event) => rightTab.value = $event,
                                  size: "small"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_tab_pane, {
                                      key: "notes",
                                      tab: "Notes"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_card, { size: "small" }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_form, { layout: "vertical" }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_form_item, { label: "Course notes" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_textarea, {
                                                      value: notes.value[currentCourseId.value].text,
                                                      "onUpdate:value": ($event) => notes.value[currentCourseId.value].text = $event,
                                                      rows: 6,
                                                      onChange: persistNotes
                                                    }, null, 8, ["value", "onUpdate:value"])
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
                                    }),
                                    createVNode(_component_a_tab_pane, {
                                      key: "feed",
                                      tab: "Recent"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_list, {
                                          "data-source": recentFeed.value,
                                          size: "small"
                                        }, {
                                          renderItem: withCtx(({ item }) => [
                                            createVNode(_component_a_list_item, null, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_list_item_meta, {
                                                  title: item.assignment,
                                                  description: item.text
                                                }, null, 8, ["title", "description"])
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
                                      key: "bookmarks",
                                      tab: "Bookmarks"
                                    }, {
                                      default: withCtx(() => [
                                        !bookmarks.value.length ? (openBlock(), createBlock(_component_a_empty, { key: 0 })) : (openBlock(), createBlock(_component_a_list, {
                                          key: 1,
                                          "data-source": bookmarks.value
                                        }, {
                                          renderItem: withCtx(({ item, index }) => [
                                            createVNode(_component_a_list_item, {
                                              actions: [
                                                h("a", { onClick: () => removeBookmark(index) }, "Remove")
                                              ]
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_list_item_meta, {
                                                  title: item.label
                                                }, null, 8, ["title"])
                                              ]),
                                              _: 2
                                            }, 1032, ["actions"])
                                          ]),
                                          _: 1
                                        }, 8, ["data-source"]))
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["activeKey", "onUpdate:activeKey"])
                              ])
                            ]),
                            _: 1
                          }, 8, ["collapsed", "onUpdate:collapsed"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_modal, {
                    open: openExport.value,
                    "onUpdate:open": ($event) => openExport.value = $event,
                    title: "Export Grades",
                    footer: null
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<p data-v-67dbdf1b${_scopeId3}>Download your gradebook as JSON.</p>`);
                        _push4(ssrRenderComponent(_component_a_button, {
                          type: "primary",
                          block: "",
                          onClick: exportGrades
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Download JSON`);
                            } else {
                              return [
                                createTextVNode("Download JSON")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode("p", null, "Download your gradebook as JSON."),
                          createVNode(_component_a_button, {
                            type: "primary",
                            block: "",
                            onClick: exportGrades
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Download JSON")
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
                    createVNode("div", { class: "global-banners px-4 pt-3" }, [
                      !isOnline.value ? (openBlock(), createBlock(_component_a_alert, {
                        key: 0,
                        type: "warning",
                        banner: "",
                        "show-icon": "",
                        message: "You're offline. Mock/local mode active.",
                        class: "mb-2"
                      })) : createCommentVNode("", true),
                      usingMocks.value ? (openBlock(), createBlock(_component_a_alert, {
                        key: 1,
                        type: "info",
                        banner: "",
                        "show-icon": "",
                        message: `Mock data active${mockReason.value ? ` · ${mockReason.value}` : ""}`
                      }, null, 8, ["message"])) : createCommentVNode("", true)
                    ]),
                    createVNode(_component_a_page_header, {
                      class: "page-header shadow-sm px-6 py-4 bg-white",
                      title: "My Gradebook",
                      "sub-title": "Grades · Analytics · Feedback"
                    }, {
                      tags: withCtx(() => [
                        createVNode(_component_a_space, null, {
                          default: withCtx(() => [
                            createVNode(_component_a_tag, { color: "blue" }, {
                              default: withCtx(() => [
                                createTextVNode("Student")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_tag, { color: "gold" }, {
                              default: withCtx(() => [
                                createTextVNode("Performance")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_badge, {
                              status: isOnline.value ? "processing" : "default",
                              text: isOnline.value ? "Online" : "Offline"
                            }, null, 8, ["status", "text"]),
                            createVNode(_component_a_badge, {
                              status: usingMocks.value ? "warning" : "success",
                              text: usingMocks.value ? "Mock" : "Live"
                            }, null, 8, ["status", "text"])
                          ]),
                          _: 1
                        })
                      ]),
                      extra: withCtx(() => [
                        createVNode(_component_a_space, null, {
                          default: withCtx(() => [
                            createVNode(_component_a_tooltip, { title: "Toggle dark mode" }, {
                              default: withCtx(() => [
                                createVNode(_component_a_button, {
                                  shape: "circle",
                                  onClick: toggleDark
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(BulbOutlined))
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_button, {
                              type: "primary",
                              onClick: ($event) => openExport.value = true
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(CloudSyncOutlined)),
                                createTextVNode(" Export ")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_layout, { class: "main-layout" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_layout_sider, {
                          width: "300",
                          collapsible: "",
                          collapsed: leftCollapsed.value,
                          "onUpdate:collapsed": ($event) => leftCollapsed.value = $event,
                          "collapsed-width": 64,
                          breakpoint: "lg",
                          class: "left-sider border-r"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "sider-inner p-3" }, [
                              createVNode(_component_a_input_search, {
                                value: filter.value,
                                "onUpdate:value": ($event) => filter.value = $event,
                                "allow-clear": "",
                                placeholder: "Search courses...",
                                class: "mb-3"
                              }, null, 8, ["value", "onUpdate:value"]),
                              !leftCollapsed.value ? (openBlock(), createBlock(_component_a_card, {
                                key: 0,
                                size: "small",
                                bordered: false,
                                title: "Filters",
                                class: "mb-3"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_segmented, {
                                    value: statusFilter.value,
                                    "onUpdate:value": ($event) => statusFilter.value = $event,
                                    options: [
                                      { label: "All", value: "all" },
                                      { label: "Graded", value: "graded" },
                                      { label: "Pending", value: "pending" },
                                      { label: "Submitted", value: "submitted" }
                                    ]
                                  }, null, 8, ["value", "onUpdate:value"])
                                ]),
                                _: 1
                              })) : createCommentVNode("", true),
                              createVNode(_component_a_divider),
                              createVNode(_component_a_list, {
                                size: "small",
                                "data-source": courses.value,
                                "row-key": (c) => c.courseId,
                                class: "course-list"
                              }, {
                                renderItem: withCtx(({ item }) => [
                                  createVNode(_component_a_list_item, {
                                    class: ["course-item", currentCourseId.value === item.courseId ? "active" : ""],
                                    onClick: ($event) => selectCourse(item.courseId)
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_list_item_meta, {
                                        title: item.courseName,
                                        description: `${item.gradedCount} graded • avg ${item.avg}%`
                                      }, null, 8, ["title", "description"])
                                    ]),
                                    _: 2
                                  }, 1032, ["class", "onClick"])
                                ]),
                                _: 1
                              }, 8, ["data-source", "row-key"])
                            ])
                          ]),
                          _: 1
                        }, 8, ["collapsed", "onUpdate:collapsed"]),
                        createVNode(_component_a_layout_content, { class: "center-content px-6 py-6" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_breadcrumb, { class: "mb-4" }, {
                              default: withCtx(() => [
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
                            createVNode(_component_a_card, {
                              loading: loading.value,
                              class: "mb-5",
                              bordered: ""
                            }, {
                              title: withCtx(() => [
                                createVNode("div", { class: "flex justify-between items-center" }, [
                                  createVNode("span", { class: "font-semibold" }, toDisplayString(currentCourse.value?.courseName || "Your Grades"), 1),
                                  createVNode(_component_a_tag, { color: "blue" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(grades.value.length) + " records", 1)
                                    ]),
                                    _: 1
                                  })
                                ])
                              ]),
                              default: withCtx(() => [
                                createVNode("div", { class: "grid md:grid-cols-3 gap-4" }, [
                                  createVNode(_component_a_card, {
                                    size: "small",
                                    class: "kpi-card"
                                  }, {
                                    title: withCtx(() => [
                                      createTextVNode("Average Grade")
                                    ]),
                                    default: withCtx(() => [
                                      createVNode("div", { class: "kpi-value text-green-600" }, toDisplayString(metrics.value.average ?? "—") + "% ", 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_card, {
                                    size: "small",
                                    class: "kpi-card"
                                  }, {
                                    title: withCtx(() => [
                                      createTextVNode("Completed")
                                    ]),
                                    default: withCtx(() => [
                                      createVNode("div", { class: "kpi-value text-blue-600" }, toDisplayString(metrics.value.completed) + "/" + toDisplayString(metrics.value.total), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_card, {
                                    size: "small",
                                    class: "kpi-card"
                                  }, {
                                    title: withCtx(() => [
                                      createTextVNode("Pending")
                                    ]),
                                    default: withCtx(() => [
                                      createVNode("div", { class: "kpi-value text-orange-500" }, toDisplayString(metrics.value.pending), 1)
                                    ]),
                                    _: 1
                                  })
                                ])
                              ]),
                              _: 1
                            }, 8, ["loading"]),
                            createVNode(_component_a_card, null, {
                              default: withCtx(() => [
                                createVNode(_component_a_tabs, {
                                  activeKey: tab.value,
                                  "onUpdate:activeKey": ($event) => tab.value = $event,
                                  animated: ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_tab_pane, {
                                      key: "grades",
                                      tab: "Grades"
                                    }, {
                                      default: withCtx(() => [
                                        grades.value.length === 0 ? (openBlock(), createBlock(_component_a_alert, {
                                          key: 0,
                                          type: "info",
                                          message: "No grades available.",
                                          class: "mb-4"
                                        })) : (openBlock(), createBlock(_component_a_table, {
                                          key: 1,
                                          columns: gradeColumns,
                                          "data-source": grades.value,
                                          "row-key": "id",
                                          bordered: "",
                                          pagination: { pageSize: 8 }
                                        }, null, 8, ["data-source"]))
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_tab_pane, {
                                      key: "analytics",
                                      tab: "Analytics"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "grid md:grid-cols-2 gap-6" }, [
                                          createVNode(_component_a_card, {
                                            size: "small",
                                            title: "Distribution"
                                          }, {
                                            default: withCtx(() => [
                                              (openBlock(true), createBlock(Fragment, null, renderList(gradeDistribution.value, (count, label) => {
                                                return openBlock(), createBlock("div", {
                                                  key: label,
                                                  class: "py-2"
                                                }, [
                                                  createVNode("div", { class: "flex justify-between items-center" }, [
                                                    createVNode("span", null, toDisplayString(label), 1),
                                                    createVNode(_component_a_progress, {
                                                      percent: count / grades.value.length * 100,
                                                      format: () => count
                                                    }, null, 8, ["percent", "format"])
                                                  ])
                                                ]);
                                              }), 128))
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_card, {
                                            size: "small",
                                            title: "Performance Trend"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("p", null, [
                                                createTextVNode("Current average: "),
                                                createVNode("b", null, toDisplayString(metrics.value.average) + "%", 1)
                                              ]),
                                              createVNode("p", null, [
                                                createTextVNode("Last semester: "),
                                                createVNode("b", null, "82%")
                                              ]),
                                              createVNode(_component_a_progress, {
                                                percent: metrics.value.average
                                              }, null, 8, ["percent"])
                                            ]),
                                            _: 1
                                          })
                                        ])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_tab_pane, {
                                      key: "feedback",
                                      tab: "Feedback"
                                    }, {
                                      default: withCtx(() => [
                                        feedbackList.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, { key: 0 })) : createCommentVNode("", true),
                                        (openBlock(true), createBlock(Fragment, null, renderList(feedbackList.value, (f) => {
                                          return openBlock(), createBlock(_component_a_card, {
                                            key: f.id,
                                            class: "mb-3"
                                          }, {
                                            title: withCtx(() => [
                                              createVNode("div", { class: "flex justify-between items-center" }, [
                                                createVNode("span", null, toDisplayString(f.assignmentName), 1),
                                                createVNode(_component_a_tag, {
                                                  color: statusColor(f.status)
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(f.status), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["color"])
                                              ])
                                            ]),
                                            default: withCtx(() => [
                                              createVNode("p", null, [
                                                createVNode("b", null, "Grade:"),
                                                createTextVNode(" " + toDisplayString(f.grade ?? "—"), 1)
                                              ]),
                                              createVNode("p", null, [
                                                createVNode("b", null, "Feedback:"),
                                                createTextVNode(" " + toDisplayString(f.feedback || "—"), 1)
                                              ]),
                                              createVNode("div", { class: "text-muted text-xs" }, " Updated: " + toDisplayString(format(f.updatedAt)), 1)
                                            ]),
                                            _: 2
                                          }, 1024);
                                        }), 128))
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["activeKey", "onUpdate:activeKey"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_layout_sider, {
                          width: "340",
                          collapsible: "",
                          collapsed: rightCollapsed.value,
                          "onUpdate:collapsed": ($event) => rightCollapsed.value = $event,
                          "collapsed-width": 64,
                          class: "right-sider border-l"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "right-inner p-3" }, [
                              createVNode(_component_a_tabs, {
                                activeKey: rightTab.value,
                                "onUpdate:activeKey": ($event) => rightTab.value = $event,
                                size: "small"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_tab_pane, {
                                    key: "notes",
                                    tab: "Notes"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_card, { size: "small" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_form, { layout: "vertical" }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_form_item, { label: "Course notes" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_textarea, {
                                                    value: notes.value[currentCourseId.value].text,
                                                    "onUpdate:value": ($event) => notes.value[currentCourseId.value].text = $event,
                                                    rows: 6,
                                                    onChange: persistNotes
                                                  }, null, 8, ["value", "onUpdate:value"])
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
                                  }),
                                  createVNode(_component_a_tab_pane, {
                                    key: "feed",
                                    tab: "Recent"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_list, {
                                        "data-source": recentFeed.value,
                                        size: "small"
                                      }, {
                                        renderItem: withCtx(({ item }) => [
                                          createVNode(_component_a_list_item, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_list_item_meta, {
                                                title: item.assignment,
                                                description: item.text
                                              }, null, 8, ["title", "description"])
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
                                    key: "bookmarks",
                                    tab: "Bookmarks"
                                  }, {
                                    default: withCtx(() => [
                                      !bookmarks.value.length ? (openBlock(), createBlock(_component_a_empty, { key: 0 })) : (openBlock(), createBlock(_component_a_list, {
                                        key: 1,
                                        "data-source": bookmarks.value
                                      }, {
                                        renderItem: withCtx(({ item, index }) => [
                                          createVNode(_component_a_list_item, {
                                            actions: [
                                              h("a", { onClick: () => removeBookmark(index) }, "Remove")
                                            ]
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_list_item_meta, {
                                                title: item.label
                                              }, null, 8, ["title"])
                                            ]),
                                            _: 2
                                          }, 1032, ["actions"])
                                        ]),
                                        _: 1
                                      }, 8, ["data-source"]))
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["activeKey", "onUpdate:activeKey"])
                            ])
                          ]),
                          _: 1
                        }, 8, ["collapsed", "onUpdate:collapsed"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_modal, {
                      open: openExport.value,
                      "onUpdate:open": ($event) => openExport.value = $event,
                      title: "Export Grades",
                      footer: null
                    }, {
                      default: withCtx(() => [
                        createVNode("p", null, "Download your gradebook as JSON."),
                        createVNode(_component_a_button, {
                          type: "primary",
                          block: "",
                          onClick: exportGrades
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Download JSON")
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
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_layout, {
                class: ["gradebook-root", isDark.value ? "is-dark" : ""]
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "global-banners px-4 pt-3" }, [
                    !isOnline.value ? (openBlock(), createBlock(_component_a_alert, {
                      key: 0,
                      type: "warning",
                      banner: "",
                      "show-icon": "",
                      message: "You're offline. Mock/local mode active.",
                      class: "mb-2"
                    })) : createCommentVNode("", true),
                    usingMocks.value ? (openBlock(), createBlock(_component_a_alert, {
                      key: 1,
                      type: "info",
                      banner: "",
                      "show-icon": "",
                      message: `Mock data active${mockReason.value ? ` · ${mockReason.value}` : ""}`
                    }, null, 8, ["message"])) : createCommentVNode("", true)
                  ]),
                  createVNode(_component_a_page_header, {
                    class: "page-header shadow-sm px-6 py-4 bg-white",
                    title: "My Gradebook",
                    "sub-title": "Grades · Analytics · Feedback"
                  }, {
                    tags: withCtx(() => [
                      createVNode(_component_a_space, null, {
                        default: withCtx(() => [
                          createVNode(_component_a_tag, { color: "blue" }, {
                            default: withCtx(() => [
                              createTextVNode("Student")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_tag, { color: "gold" }, {
                            default: withCtx(() => [
                              createTextVNode("Performance")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_badge, {
                            status: isOnline.value ? "processing" : "default",
                            text: isOnline.value ? "Online" : "Offline"
                          }, null, 8, ["status", "text"]),
                          createVNode(_component_a_badge, {
                            status: usingMocks.value ? "warning" : "success",
                            text: usingMocks.value ? "Mock" : "Live"
                          }, null, 8, ["status", "text"])
                        ]),
                        _: 1
                      })
                    ]),
                    extra: withCtx(() => [
                      createVNode(_component_a_space, null, {
                        default: withCtx(() => [
                          createVNode(_component_a_tooltip, { title: "Toggle dark mode" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, {
                                shape: "circle",
                                onClick: toggleDark
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(BulbOutlined))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, {
                            type: "primary",
                            onClick: ($event) => openExport.value = true
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(CloudSyncOutlined)),
                              createTextVNode(" Export ")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_layout, { class: "main-layout" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_layout_sider, {
                        width: "300",
                        collapsible: "",
                        collapsed: leftCollapsed.value,
                        "onUpdate:collapsed": ($event) => leftCollapsed.value = $event,
                        "collapsed-width": 64,
                        breakpoint: "lg",
                        class: "left-sider border-r"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "sider-inner p-3" }, [
                            createVNode(_component_a_input_search, {
                              value: filter.value,
                              "onUpdate:value": ($event) => filter.value = $event,
                              "allow-clear": "",
                              placeholder: "Search courses...",
                              class: "mb-3"
                            }, null, 8, ["value", "onUpdate:value"]),
                            !leftCollapsed.value ? (openBlock(), createBlock(_component_a_card, {
                              key: 0,
                              size: "small",
                              bordered: false,
                              title: "Filters",
                              class: "mb-3"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_segmented, {
                                  value: statusFilter.value,
                                  "onUpdate:value": ($event) => statusFilter.value = $event,
                                  options: [
                                    { label: "All", value: "all" },
                                    { label: "Graded", value: "graded" },
                                    { label: "Pending", value: "pending" },
                                    { label: "Submitted", value: "submitted" }
                                  ]
                                }, null, 8, ["value", "onUpdate:value"])
                              ]),
                              _: 1
                            })) : createCommentVNode("", true),
                            createVNode(_component_a_divider),
                            createVNode(_component_a_list, {
                              size: "small",
                              "data-source": courses.value,
                              "row-key": (c) => c.courseId,
                              class: "course-list"
                            }, {
                              renderItem: withCtx(({ item }) => [
                                createVNode(_component_a_list_item, {
                                  class: ["course-item", currentCourseId.value === item.courseId ? "active" : ""],
                                  onClick: ($event) => selectCourse(item.courseId)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_list_item_meta, {
                                      title: item.courseName,
                                      description: `${item.gradedCount} graded • avg ${item.avg}%`
                                    }, null, 8, ["title", "description"])
                                  ]),
                                  _: 2
                                }, 1032, ["class", "onClick"])
                              ]),
                              _: 1
                            }, 8, ["data-source", "row-key"])
                          ])
                        ]),
                        _: 1
                      }, 8, ["collapsed", "onUpdate:collapsed"]),
                      createVNode(_component_a_layout_content, { class: "center-content px-6 py-6" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_breadcrumb, { class: "mb-4" }, {
                            default: withCtx(() => [
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
                          createVNode(_component_a_card, {
                            loading: loading.value,
                            class: "mb-5",
                            bordered: ""
                          }, {
                            title: withCtx(() => [
                              createVNode("div", { class: "flex justify-between items-center" }, [
                                createVNode("span", { class: "font-semibold" }, toDisplayString(currentCourse.value?.courseName || "Your Grades"), 1),
                                createVNode(_component_a_tag, { color: "blue" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(grades.value.length) + " records", 1)
                                  ]),
                                  _: 1
                                })
                              ])
                            ]),
                            default: withCtx(() => [
                              createVNode("div", { class: "grid md:grid-cols-3 gap-4" }, [
                                createVNode(_component_a_card, {
                                  size: "small",
                                  class: "kpi-card"
                                }, {
                                  title: withCtx(() => [
                                    createTextVNode("Average Grade")
                                  ]),
                                  default: withCtx(() => [
                                    createVNode("div", { class: "kpi-value text-green-600" }, toDisplayString(metrics.value.average ?? "—") + "% ", 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_card, {
                                  size: "small",
                                  class: "kpi-card"
                                }, {
                                  title: withCtx(() => [
                                    createTextVNode("Completed")
                                  ]),
                                  default: withCtx(() => [
                                    createVNode("div", { class: "kpi-value text-blue-600" }, toDisplayString(metrics.value.completed) + "/" + toDisplayString(metrics.value.total), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_card, {
                                  size: "small",
                                  class: "kpi-card"
                                }, {
                                  title: withCtx(() => [
                                    createTextVNode("Pending")
                                  ]),
                                  default: withCtx(() => [
                                    createVNode("div", { class: "kpi-value text-orange-500" }, toDisplayString(metrics.value.pending), 1)
                                  ]),
                                  _: 1
                                })
                              ])
                            ]),
                            _: 1
                          }, 8, ["loading"]),
                          createVNode(_component_a_card, null, {
                            default: withCtx(() => [
                              createVNode(_component_a_tabs, {
                                activeKey: tab.value,
                                "onUpdate:activeKey": ($event) => tab.value = $event,
                                animated: ""
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_tab_pane, {
                                    key: "grades",
                                    tab: "Grades"
                                  }, {
                                    default: withCtx(() => [
                                      grades.value.length === 0 ? (openBlock(), createBlock(_component_a_alert, {
                                        key: 0,
                                        type: "info",
                                        message: "No grades available.",
                                        class: "mb-4"
                                      })) : (openBlock(), createBlock(_component_a_table, {
                                        key: 1,
                                        columns: gradeColumns,
                                        "data-source": grades.value,
                                        "row-key": "id",
                                        bordered: "",
                                        pagination: { pageSize: 8 }
                                      }, null, 8, ["data-source"]))
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_tab_pane, {
                                    key: "analytics",
                                    tab: "Analytics"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "grid md:grid-cols-2 gap-6" }, [
                                        createVNode(_component_a_card, {
                                          size: "small",
                                          title: "Distribution"
                                        }, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(gradeDistribution.value, (count, label) => {
                                              return openBlock(), createBlock("div", {
                                                key: label,
                                                class: "py-2"
                                              }, [
                                                createVNode("div", { class: "flex justify-between items-center" }, [
                                                  createVNode("span", null, toDisplayString(label), 1),
                                                  createVNode(_component_a_progress, {
                                                    percent: count / grades.value.length * 100,
                                                    format: () => count
                                                  }, null, 8, ["percent", "format"])
                                                ])
                                              ]);
                                            }), 128))
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_card, {
                                          size: "small",
                                          title: "Performance Trend"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("p", null, [
                                              createTextVNode("Current average: "),
                                              createVNode("b", null, toDisplayString(metrics.value.average) + "%", 1)
                                            ]),
                                            createVNode("p", null, [
                                              createTextVNode("Last semester: "),
                                              createVNode("b", null, "82%")
                                            ]),
                                            createVNode(_component_a_progress, {
                                              percent: metrics.value.average
                                            }, null, 8, ["percent"])
                                          ]),
                                          _: 1
                                        })
                                      ])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_tab_pane, {
                                    key: "feedback",
                                    tab: "Feedback"
                                  }, {
                                    default: withCtx(() => [
                                      feedbackList.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, { key: 0 })) : createCommentVNode("", true),
                                      (openBlock(true), createBlock(Fragment, null, renderList(feedbackList.value, (f) => {
                                        return openBlock(), createBlock(_component_a_card, {
                                          key: f.id,
                                          class: "mb-3"
                                        }, {
                                          title: withCtx(() => [
                                            createVNode("div", { class: "flex justify-between items-center" }, [
                                              createVNode("span", null, toDisplayString(f.assignmentName), 1),
                                              createVNode(_component_a_tag, {
                                                color: statusColor(f.status)
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(f.status), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"])
                                            ])
                                          ]),
                                          default: withCtx(() => [
                                            createVNode("p", null, [
                                              createVNode("b", null, "Grade:"),
                                              createTextVNode(" " + toDisplayString(f.grade ?? "—"), 1)
                                            ]),
                                            createVNode("p", null, [
                                              createVNode("b", null, "Feedback:"),
                                              createTextVNode(" " + toDisplayString(f.feedback || "—"), 1)
                                            ]),
                                            createVNode("div", { class: "text-muted text-xs" }, " Updated: " + toDisplayString(format(f.updatedAt)), 1)
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 128))
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["activeKey", "onUpdate:activeKey"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_layout_sider, {
                        width: "340",
                        collapsible: "",
                        collapsed: rightCollapsed.value,
                        "onUpdate:collapsed": ($event) => rightCollapsed.value = $event,
                        "collapsed-width": 64,
                        class: "right-sider border-l"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "right-inner p-3" }, [
                            createVNode(_component_a_tabs, {
                              activeKey: rightTab.value,
                              "onUpdate:activeKey": ($event) => rightTab.value = $event,
                              size: "small"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_tab_pane, {
                                  key: "notes",
                                  tab: "Notes"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, { size: "small" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_form, { layout: "vertical" }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_form_item, { label: "Course notes" }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_textarea, {
                                                  value: notes.value[currentCourseId.value].text,
                                                  "onUpdate:value": ($event) => notes.value[currentCourseId.value].text = $event,
                                                  rows: 6,
                                                  onChange: persistNotes
                                                }, null, 8, ["value", "onUpdate:value"])
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
                                }),
                                createVNode(_component_a_tab_pane, {
                                  key: "feed",
                                  tab: "Recent"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_list, {
                                      "data-source": recentFeed.value,
                                      size: "small"
                                    }, {
                                      renderItem: withCtx(({ item }) => [
                                        createVNode(_component_a_list_item, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_list_item_meta, {
                                              title: item.assignment,
                                              description: item.text
                                            }, null, 8, ["title", "description"])
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
                                  key: "bookmarks",
                                  tab: "Bookmarks"
                                }, {
                                  default: withCtx(() => [
                                    !bookmarks.value.length ? (openBlock(), createBlock(_component_a_empty, { key: 0 })) : (openBlock(), createBlock(_component_a_list, {
                                      key: 1,
                                      "data-source": bookmarks.value
                                    }, {
                                      renderItem: withCtx(({ item, index }) => [
                                        createVNode(_component_a_list_item, {
                                          actions: [
                                            h("a", { onClick: () => removeBookmark(index) }, "Remove")
                                          ]
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_list_item_meta, {
                                              title: item.label
                                            }, null, 8, ["title"])
                                          ]),
                                          _: 2
                                        }, 1032, ["actions"])
                                      ]),
                                      _: 1
                                    }, 8, ["data-source"]))
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["activeKey", "onUpdate:activeKey"])
                          ])
                        ]),
                        _: 1
                      }, 8, ["collapsed", "onUpdate:collapsed"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_modal, {
                    open: openExport.value,
                    "onUpdate:open": ($event) => openExport.value = $event,
                    title: "Export Grades",
                    footer: null
                  }, {
                    default: withCtx(() => [
                      createVNode("p", null, "Download your gradebook as JSON."),
                      createVNode(_component_a_button, {
                        type: "primary",
                        block: "",
                        onClick: exportGrades
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Download JSON")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["open", "onUpdate:open"])
                ]),
                _: 1
              }, 8, ["class"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/students-internal/nuxt/pages/gradebook/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-67dbdf1b"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-W-B4Fjvs.mjs.map
