import { defineComponent, withAsyncContext, ref, computed, resolveComponent, withCtx, unref, createVNode, toDisplayString, createTextVNode, h, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "view",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    let ModuleUniversityPanel = defineComponent({
      name: "ModuleUniversityPanelStub",
      template: `<div class="mt-6"><a-alert type="info" show-icon message="ModuleUniversityPanel (stub)" /></div>`
    });
    try {
      ModuleUniversityPanel = ([__temp, __restore] = withAsyncContext(() => import('./ModuleUniversityPanel-BXQkcTPZ.mjs')), __temp = await __temp, __restore(), __temp).default;
    } catch (e) {
      console.warn("[students-internal] Using stub ModuleUniversityPanel:", e?.message || e);
    }
    const route = useRoute();
    const config = useRuntimeConfig();
    config.public?.apiBase || "http://localhost:4000";
    const mod = ref(null);
    const lessons = ref([]);
    const completedIds = ref([]);
    const classroomId = ref("");
    const assignments = ref([]);
    const timeline = ref([]);
    const checklist = ref([
      { title: "Watch intro video", done: false },
      { title: "Read slides", done: false },
      { title: "Submit Assignment 1", done: false }
    ]);
    const aCols = [
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Due", dataIndex: "dueDate", key: "dueDate" },
      {
        title: "Actions",
        key: "act",
        customRender: ({ record }) => h("a", { href: `/institutions/_/assignments/${record.id}/grading` }, "View")
      }
    ];
    const resources = ref([
      { name: "Syllabus PDF", url: "#" },
      { name: "Lab template", url: "#" },
      { name: "Office hours link", url: "#" }
    ]);
    const message = ref("");
    const messages = ref([]);
    const reading = ref("");
    ref("");
    const progressPct = computed(
      () => lessons.value.length ? Math.round(completedIds.value.length / lessons.value.length * 100) : 0
    );
    const completedCount = computed(() => completedIds.value.length);
    function post() {
      if (message.value) {
        messages.value.unshift({ ts: (/* @__PURE__ */ new Date()).toISOString(), text: message.value });
        message.value = "";
      }
    }
    function renderTimelineItem(i) {
      return h("div", {}, `${i.title} · ${i.when}`);
    }
    function renderLesson({ item }) {
      const checked = completedIds.value.includes(item.id);
      return h("a-list-item", {}, [
        h("div", { class: "font-medium" }, item.title),
        h("div", { class: "ml-auto" }, [
          h("a-switch", {
            checked,
            onChange: async (val) => {
              {
                if (val)
                  completedIds.value = Array.from(/* @__PURE__ */ new Set([...completedIds.value, item.id]));
                else completedIds.value = completedIds.value.filter((x) => x !== item.id);
                return;
              }
            }
          })
        ])
      ]);
    }
    async function loadAssignments() {
      assignments.value = [];
      if (!classroomId.value) {
        timeline.value = [
          { title: "Orientation", when: "2025-09-15" },
          { title: "Assignment 1", when: "2025-09-22" }
        ];
        return;
      }
      {
        assignments.value = [
          { id: "A1", title: "Assignment 1", dueDate: "2025-10-01" },
          { id: "A2", title: "Assignment 2", dueDate: "2025-10-15" }
        ];
        timeline.value = assignments.value.map((a) => ({
          title: a.title,
          when: a.dueDate || "-"
        }));
        return;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_progress = resolveComponent("a-progress");
      const _component_a_collapse = resolveComponent("a-collapse");
      const _component_a_collapse_panel = resolveComponent("a-collapse-panel");
      const _component_a_list = resolveComponent("a-list");
      const _component_a_textarea = resolveComponent("a-textarea");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_table = resolveComponent("a-table");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_a_layout, { class: "p-6" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_card, {
              title: `Module · ${mod.value?.title || unref(route).params.id}`,
              bordered: false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="mb-4 grid md:grid-cols-3 gap-3" data-v-629792b0${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_a_card, {
                    size: "small",
                    title: "Course ID"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-lg" data-v-629792b0${_scopeId3}>${ssrInterpolate(mod.value?.courseId || "-")}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-lg" }, toDisplayString(mod.value?.courseId || "-"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_card, {
                    size: "small",
                    title: "Lessons"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-lg" data-v-629792b0${_scopeId3}>${ssrInterpolate(lessons.value.length)}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-lg" }, toDisplayString(lessons.value.length), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_card, {
                    size: "small",
                    title: "Progress"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-lg" data-v-629792b0${_scopeId3}>${ssrInterpolate(progressPct.value)}%</div>`);
                        _push4(ssrRenderComponent(_component_a_progress, { percent: progressPct.value }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode("div", { class: "text-lg" }, toDisplayString(progressPct.value) + "%", 1),
                          createVNode(_component_a_progress, { percent: progressPct.value }, null, 8, ["percent"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_component_a_collapse, { accordion: "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_collapse_panel, {
                          key: "stats",
                          header: "Module Stats"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="grid grid-cols-2 gap-3" data-v-629792b0${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_card, {
                                size: "small",
                                title: "Lessons"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(lessons.value.length)}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(lessons.value.length), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_card, {
                                size: "small",
                                title: "Assignments"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(assignments.value.length)}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(assignments.value.length), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_card, {
                                size: "small",
                                title: "Completed"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(completedCount.value)}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(completedCount.value), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_card, {
                                size: "small",
                                title: "Progress Avg"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(progressPct.value)}%`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(progressPct.value) + "%", 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                            } else {
                              return [
                                createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                                  createVNode(_component_a_card, {
                                    size: "small",
                                    title: "Lessons"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(lessons.value.length), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_card, {
                                    size: "small",
                                    title: "Assignments"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(assignments.value.length), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_card, {
                                    size: "small",
                                    title: "Completed"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(completedCount.value), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_card, {
                                    size: "small",
                                    title: "Progress Avg"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(progressPct.value) + "%", 1)
                                    ]),
                                    _: 1
                                  })
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_collapse_panel, {
                          key: "timeline",
                          header: "Deadlines Timeline"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_list, {
                                "data-source": timeline.value,
                                renderItem: renderTimelineItem
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_list, {
                                  "data-source": timeline.value,
                                  renderItem: renderTimelineItem
                                }, null, 8, ["data-source"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_collapse_panel, {
                          key: "reading",
                          header: "Reading Pane"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_textarea, {
                                value: reading.value,
                                "onUpdate:value": ($event) => reading.value = $event,
                                rows: 6,
                                placeholder: "Notes / rendered content (demo)"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_textarea, {
                                  value: reading.value,
                                  "onUpdate:value": ($event) => reading.value = $event,
                                  rows: 6,
                                  placeholder: "Notes / rendered content (demo)"
                                }, null, 8, ["value", "onUpdate:value"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_collapse_panel, {
                          key: "lessons",
                          header: "Lessons"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_list, {
                                "data-source": lessons.value,
                                renderItem: renderLesson
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_list, {
                                  "data-source": lessons.value,
                                  renderItem: renderLesson
                                }, null, 8, ["data-source"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_collapse_panel, {
                          key: "assignments",
                          header: "Assignments (by classroom)"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="mb-2 flex gap-2 items-center" data-v-629792b0${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_input, {
                                value: classroomId.value,
                                "onUpdate:value": ($event) => classroomId.value = $event,
                                placeholder: "Classroom ID (optional)",
                                style: { "max-width": "280px" }
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_button, { onClick: loadAssignments }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Load`);
                                  } else {
                                    return [
                                      createTextVNode("Load")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                              _push5(ssrRenderComponent(_component_a_table, {
                                "data-source": assignments.value,
                                columns: aCols,
                                "row-key": "id"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode("div", { class: "mb-2 flex gap-2 items-center" }, [
                                  createVNode(_component_a_input, {
                                    value: classroomId.value,
                                    "onUpdate:value": ($event) => classroomId.value = $event,
                                    placeholder: "Classroom ID (optional)",
                                    style: { "max-width": "280px" }
                                  }, null, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_button, { onClick: loadAssignments }, {
                                    default: withCtx(() => [
                                      createTextVNode("Load")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                createVNode(_component_a_table, {
                                  "data-source": assignments.value,
                                  columns: aCols,
                                  "row-key": "id"
                                }, null, 8, ["data-source"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_collapse_panel, {
                          key: "resources",
                          header: "Resources"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_list, {
                                "data-source": resources.value,
                                renderItem: (item) => h("a", { href: item.url, target: "_blank" }, item.name)
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_list, {
                                  "data-source": resources.value,
                                  renderItem: (item) => h("a", { href: item.url, target: "_blank" }, item.name)
                                }, null, 8, ["data-source", "renderItem"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_collapse_panel, {
                          key: "discussion",
                          header: "Discussion (local)"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="mb-2" data-v-629792b0${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_textarea, {
                                value: message.value,
                                "onUpdate:value": ($event) => message.value = $event,
                                rows: 3,
                                placeholder: "Message (local demo)"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_button, {
                                class: "mt-2",
                                onClick: post
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Post`);
                                  } else {
                                    return [
                                      createTextVNode("Post")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                              _push5(ssrRenderComponent(_component_a_list, {
                                "data-source": messages.value,
                                renderItem: (m) => h("div", {}, `${m.ts}: ${m.text}`)
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode("div", { class: "mb-2" }, [
                                  createVNode(_component_a_textarea, {
                                    value: message.value,
                                    "onUpdate:value": ($event) => message.value = $event,
                                    rows: 3,
                                    placeholder: "Message (local demo)"
                                  }, null, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_button, {
                                    class: "mt-2",
                                    onClick: post
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Post")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                createVNode(_component_a_list, {
                                  "data-source": messages.value,
                                  renderItem: (m) => h("div", {}, `${m.ts}: ${m.text}`)
                                }, null, 8, ["data-source", "renderItem"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_collapse_panel, {
                          key: "check",
                          header: "Module Checklist"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_list, {
                                "data-source": checklist.value,
                                renderItem: (i) => h("div", {}, [
                                  h("input", { type: "checkbox", checked: i.done, onChange: () => i.done = !i.done }),
                                  h("span", " " + i.title)
                                ])
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_list, {
                                  "data-source": checklist.value,
                                  renderItem: (i) => h("div", {}, [
                                    h("input", { type: "checkbox", checked: i.done, onChange: () => i.done = !i.done }),
                                    h("span", " " + i.title)
                                  ])
                                }, null, 8, ["data-source", "renderItem"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_collapse_panel, {
                            key: "stats",
                            header: "Module Stats"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                                createVNode(_component_a_card, {
                                  size: "small",
                                  title: "Lessons"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(lessons.value.length), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_card, {
                                  size: "small",
                                  title: "Assignments"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(assignments.value.length), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_card, {
                                  size: "small",
                                  title: "Completed"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(completedCount.value), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_card, {
                                  size: "small",
                                  title: "Progress Avg"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(progressPct.value) + "%", 1)
                                  ]),
                                  _: 1
                                })
                              ])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_collapse_panel, {
                            key: "timeline",
                            header: "Deadlines Timeline"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_list, {
                                "data-source": timeline.value,
                                renderItem: renderTimelineItem
                              }, null, 8, ["data-source"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_collapse_panel, {
                            key: "reading",
                            header: "Reading Pane"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_textarea, {
                                value: reading.value,
                                "onUpdate:value": ($event) => reading.value = $event,
                                rows: 6,
                                placeholder: "Notes / rendered content (demo)"
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_collapse_panel, {
                            key: "lessons",
                            header: "Lessons"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_list, {
                                "data-source": lessons.value,
                                renderItem: renderLesson
                              }, null, 8, ["data-source"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_collapse_panel, {
                            key: "assignments",
                            header: "Assignments (by classroom)"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "mb-2 flex gap-2 items-center" }, [
                                createVNode(_component_a_input, {
                                  value: classroomId.value,
                                  "onUpdate:value": ($event) => classroomId.value = $event,
                                  placeholder: "Classroom ID (optional)",
                                  style: { "max-width": "280px" }
                                }, null, 8, ["value", "onUpdate:value"]),
                                createVNode(_component_a_button, { onClick: loadAssignments }, {
                                  default: withCtx(() => [
                                    createTextVNode("Load")
                                  ]),
                                  _: 1
                                })
                              ]),
                              createVNode(_component_a_table, {
                                "data-source": assignments.value,
                                columns: aCols,
                                "row-key": "id"
                              }, null, 8, ["data-source"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_collapse_panel, {
                            key: "resources",
                            header: "Resources"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_list, {
                                "data-source": resources.value,
                                renderItem: (item) => h("a", { href: item.url, target: "_blank" }, item.name)
                              }, null, 8, ["data-source", "renderItem"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_collapse_panel, {
                            key: "discussion",
                            header: "Discussion (local)"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "mb-2" }, [
                                createVNode(_component_a_textarea, {
                                  value: message.value,
                                  "onUpdate:value": ($event) => message.value = $event,
                                  rows: 3,
                                  placeholder: "Message (local demo)"
                                }, null, 8, ["value", "onUpdate:value"]),
                                createVNode(_component_a_button, {
                                  class: "mt-2",
                                  onClick: post
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Post")
                                  ]),
                                  _: 1
                                })
                              ]),
                              createVNode(_component_a_list, {
                                "data-source": messages.value,
                                renderItem: (m) => h("div", {}, `${m.ts}: ${m.text}`)
                              }, null, 8, ["data-source", "renderItem"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_collapse_panel, {
                            key: "check",
                            header: "Module Checklist"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_list, {
                                "data-source": checklist.value,
                                renderItem: (i) => h("div", {}, [
                                  h("input", { type: "checkbox", checked: i.done, onChange: () => i.done = !i.done }),
                                  h("span", " " + i.title)
                                ])
                              }, null, 8, ["data-source", "renderItem"])
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
                    createVNode("div", { class: "mb-4 grid md:grid-cols-3 gap-3" }, [
                      createVNode(_component_a_card, {
                        size: "small",
                        title: "Course ID"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-lg" }, toDisplayString(mod.value?.courseId || "-"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_card, {
                        size: "small",
                        title: "Lessons"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-lg" }, toDisplayString(lessons.value.length), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_card, {
                        size: "small",
                        title: "Progress"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-lg" }, toDisplayString(progressPct.value) + "%", 1),
                          createVNode(_component_a_progress, { percent: progressPct.value }, null, 8, ["percent"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(_component_a_collapse, { accordion: "" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_collapse_panel, {
                          key: "stats",
                          header: "Module Stats"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                              createVNode(_component_a_card, {
                                size: "small",
                                title: "Lessons"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(lessons.value.length), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_card, {
                                size: "small",
                                title: "Assignments"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(assignments.value.length), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_card, {
                                size: "small",
                                title: "Completed"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(completedCount.value), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_card, {
                                size: "small",
                                title: "Progress Avg"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(progressPct.value) + "%", 1)
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_collapse_panel, {
                          key: "timeline",
                          header: "Deadlines Timeline"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_list, {
                              "data-source": timeline.value,
                              renderItem: renderTimelineItem
                            }, null, 8, ["data-source"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_collapse_panel, {
                          key: "reading",
                          header: "Reading Pane"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_textarea, {
                              value: reading.value,
                              "onUpdate:value": ($event) => reading.value = $event,
                              rows: 6,
                              placeholder: "Notes / rendered content (demo)"
                            }, null, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_collapse_panel, {
                          key: "lessons",
                          header: "Lessons"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_list, {
                              "data-source": lessons.value,
                              renderItem: renderLesson
                            }, null, 8, ["data-source"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_collapse_panel, {
                          key: "assignments",
                          header: "Assignments (by classroom)"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "mb-2 flex gap-2 items-center" }, [
                              createVNode(_component_a_input, {
                                value: classroomId.value,
                                "onUpdate:value": ($event) => classroomId.value = $event,
                                placeholder: "Classroom ID (optional)",
                                style: { "max-width": "280px" }
                              }, null, 8, ["value", "onUpdate:value"]),
                              createVNode(_component_a_button, { onClick: loadAssignments }, {
                                default: withCtx(() => [
                                  createTextVNode("Load")
                                ]),
                                _: 1
                              })
                            ]),
                            createVNode(_component_a_table, {
                              "data-source": assignments.value,
                              columns: aCols,
                              "row-key": "id"
                            }, null, 8, ["data-source"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_collapse_panel, {
                          key: "resources",
                          header: "Resources"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_list, {
                              "data-source": resources.value,
                              renderItem: (item) => h("a", { href: item.url, target: "_blank" }, item.name)
                            }, null, 8, ["data-source", "renderItem"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_collapse_panel, {
                          key: "discussion",
                          header: "Discussion (local)"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "mb-2" }, [
                              createVNode(_component_a_textarea, {
                                value: message.value,
                                "onUpdate:value": ($event) => message.value = $event,
                                rows: 3,
                                placeholder: "Message (local demo)"
                              }, null, 8, ["value", "onUpdate:value"]),
                              createVNode(_component_a_button, {
                                class: "mt-2",
                                onClick: post
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Post")
                                ]),
                                _: 1
                              })
                            ]),
                            createVNode(_component_a_list, {
                              "data-source": messages.value,
                              renderItem: (m) => h("div", {}, `${m.ts}: ${m.text}`)
                            }, null, 8, ["data-source", "renderItem"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_collapse_panel, {
                          key: "check",
                          header: "Module Checklist"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_list, {
                              "data-source": checklist.value,
                              renderItem: (i) => h("div", {}, [
                                h("input", { type: "checkbox", checked: i.done, onChange: () => i.done = !i.done }),
                                h("span", " " + i.title)
                              ])
                            }, null, 8, ["data-source", "renderItem"])
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
              createVNode(_component_a_card, {
                title: `Module · ${mod.value?.title || unref(route).params.id}`,
                bordered: false
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "mb-4 grid md:grid-cols-3 gap-3" }, [
                    createVNode(_component_a_card, {
                      size: "small",
                      title: "Course ID"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "text-lg" }, toDisplayString(mod.value?.courseId || "-"), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_card, {
                      size: "small",
                      title: "Lessons"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "text-lg" }, toDisplayString(lessons.value.length), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_card, {
                      size: "small",
                      title: "Progress"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "text-lg" }, toDisplayString(progressPct.value) + "%", 1),
                        createVNode(_component_a_progress, { percent: progressPct.value }, null, 8, ["percent"])
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode(_component_a_collapse, { accordion: "" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_collapse_panel, {
                        key: "stats",
                        header: "Module Stats"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                            createVNode(_component_a_card, {
                              size: "small",
                              title: "Lessons"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(lessons.value.length), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_card, {
                              size: "small",
                              title: "Assignments"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(assignments.value.length), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_card, {
                              size: "small",
                              title: "Completed"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(completedCount.value), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_card, {
                              size: "small",
                              title: "Progress Avg"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(progressPct.value) + "%", 1)
                              ]),
                              _: 1
                            })
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_collapse_panel, {
                        key: "timeline",
                        header: "Deadlines Timeline"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_list, {
                            "data-source": timeline.value,
                            renderItem: renderTimelineItem
                          }, null, 8, ["data-source"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_collapse_panel, {
                        key: "reading",
                        header: "Reading Pane"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_textarea, {
                            value: reading.value,
                            "onUpdate:value": ($event) => reading.value = $event,
                            rows: 6,
                            placeholder: "Notes / rendered content (demo)"
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_collapse_panel, {
                        key: "lessons",
                        header: "Lessons"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_list, {
                            "data-source": lessons.value,
                            renderItem: renderLesson
                          }, null, 8, ["data-source"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_collapse_panel, {
                        key: "assignments",
                        header: "Assignments (by classroom)"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "mb-2 flex gap-2 items-center" }, [
                            createVNode(_component_a_input, {
                              value: classroomId.value,
                              "onUpdate:value": ($event) => classroomId.value = $event,
                              placeholder: "Classroom ID (optional)",
                              style: { "max-width": "280px" }
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_button, { onClick: loadAssignments }, {
                              default: withCtx(() => [
                                createTextVNode("Load")
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode(_component_a_table, {
                            "data-source": assignments.value,
                            columns: aCols,
                            "row-key": "id"
                          }, null, 8, ["data-source"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_collapse_panel, {
                        key: "resources",
                        header: "Resources"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_list, {
                            "data-source": resources.value,
                            renderItem: (item) => h("a", { href: item.url, target: "_blank" }, item.name)
                          }, null, 8, ["data-source", "renderItem"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_collapse_panel, {
                        key: "discussion",
                        header: "Discussion (local)"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "mb-2" }, [
                            createVNode(_component_a_textarea, {
                              value: message.value,
                              "onUpdate:value": ($event) => message.value = $event,
                              rows: 3,
                              placeholder: "Message (local demo)"
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_button, {
                              class: "mt-2",
                              onClick: post
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Post")
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode(_component_a_list, {
                            "data-source": messages.value,
                            renderItem: (m) => h("div", {}, `${m.ts}: ${m.text}`)
                          }, null, 8, ["data-source", "renderItem"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_collapse_panel, {
                        key: "check",
                        header: "Module Checklist"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_list, {
                            "data-source": checklist.value,
                            renderItem: (i) => h("div", {}, [
                              h("input", { type: "checkbox", checked: i.done, onChange: () => i.done = !i.done }),
                              h("span", " " + i.title)
                            ])
                          }, null, 8, ["data-source", "renderItem"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["title"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(ModuleUniversityPanel), null, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/students-internal/nuxt/pages/modules/[id]/view.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const view = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-629792b0"]]);

export { view as default };
//# sourceMappingURL=view-C1rqB4az.mjs.map
