import { defineComponent, ref, computed, reactive, h, watch, resolveComponent, withCtx, unref, createTextVNode, createVNode, toDisplayString, createBlock, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { message } from 'ant-design-vue';
import { SettingOutlined, DownloadOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { _ as _export_sfc, d as useRoute } from './server.mjs';
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
  __name: "grading",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const rows = ref([]);
    const rubric = ref([
      { label: "Code", weight: 0.6 },
      { label: "Report", weight: 0.4 }
    ]);
    const rubricOpen = ref(false);
    const rubricJson = ref(JSON.stringify(rubric.value, null, 2));
    const rubricWeightSum = computed(() => rubric.value.reduce((s, r) => s + (r.weight || 0), 0));
    const commentsOpen = ref(false);
    const commentsMap = reactive({});
    const comments = computed(() => commentsMap[currentId.value] || []);
    const currentId = ref("");
    const newComment = ref("");
    const autoSave = ref(true);
    const userId = ref("teacher-01");
    const STORAGE_KEY = computed(() => `byway.mock.grade.${route.params.id}`);
    const baseCols = [
      { title: "Attempt", dataIndex: "attempt", key: "attempt", sorter: (a, b) => a.attempt - b.attempt },
      { title: "Student", dataIndex: "studentId", key: "studentId" },
      { title: "File", key: "file", customRender: ({ record }) => h("a", { href: record.fileUrl, target: "_blank" }, "Open") }
    ];
    const rubricCols = computed(() => rubric.value.map((r) => ({
      title: `${r.label} (${(r.weight * 100).toFixed(0)}%)`,
      key: `crit-${r.label}`,
      customRender: ({ record }) => h("a-input-number", {
        min: 0,
        max: 100,
        value: record.criteria[r.label] ?? 0,
        "onUpdate:value": (v) => {
          record.criteria[r.label] = v;
          if (autoSave.value) persist();
        }
      })
    })));
    const weightedCol = {
      title: "Weighted",
      key: "weighted",
      customRender: ({ record }) => {
        const val = computeWeighted(record).toFixed(1);
        return h("div", {}, [
          h("span", {}, val),
          h("a", { style: "margin-left:8px", onClick: () => applyWeighted(record) }, "Apply")
        ]);
      }
    };
    const gradeCol = {
      title: "Grade",
      key: "grade",
      customRender: ({ record }) => h("div", {}, [
        h("a-input-number", {
          min: 0,
          max: 100,
          value: record._grade ?? record.grade ?? 0,
          "onUpdate:value": (v) => record._grade = v
        }),
        h("a-button", { style: "margin-left:8px", onClick: () => grade(record) }, "Save")
      ])
    };
    const feedbackCol = {
      title: "Feedback",
      key: "feedback",
      customRender: ({ record }) => h("a-input", {
        style: "min-width:220px",
        value: record._feedback ?? record.feedback,
        "onUpdate:value": (v) => record._feedback = v,
        onBlur: () => {
          if (autoSave.value) grade(record, { silent: true });
        }
      })
    };
    const commentCol = {
      title: "Comments",
      key: "comments",
      customRender: ({ record }) => h("a", { onClick: () => openComments(record.id) }, "Open")
    };
    const cols = computed(() => [
      ...baseCols,
      ...rubricCols.value,
      weightedCol,
      gradeCol,
      feedbackCol,
      commentCol
    ]);
    function computeWeighted(r) {
      return rubric.value.reduce((s, it) => s + (r.criteria[it.label] || 0) * it.weight, 0);
    }
    function applyWeighted(r) {
      r._grade = Math.round(computeWeighted(r) * 10) / 10;
      if (autoSave.value) grade(r, { silent: true });
    }
    function grade(r, opts) {
      if (typeof r._grade === "number") r.grade = r._grade;
      if (typeof r._feedback !== "undefined") r.feedback = r._feedback;
      persist();
      if (!opts?.silent) message.success("Saved");
    }
    function openRubric() {
      rubricJson.value = JSON.stringify(rubric.value, null, 2);
      rubricOpen.value = true;
    }
    function saveRubric() {
      try {
        const parsed = JSON.parse(rubricJson.value);
        if (!Array.isArray(parsed)) throw new Error("Must be an array");
        parsed.forEach((it, i) => {
          if (typeof it.label !== "string" || typeof it.weight !== "number") throw new Error(`Invalid item #${i}`);
        });
        rubric.value = parsed;
        rows.value.forEach((r) => {
          for (const c of rubric.value) if (typeof r.criteria[c.label] !== "number") r.criteria[c.label] = 0;
        });
        persist();
        rubricOpen.value = false;
        message.success("Rubric saved");
      } catch (e) {
        message.error(e?.message || "Invalid JSON");
      }
    }
    function normalizeWeights() {
      const sum = rubric.value.reduce((s, r) => s + (r.weight || 0), 0) || 1;
      rubric.value = rubric.value.map((r) => ({ ...r, weight: +(r.weight / sum).toFixed(4) }));
      rubricJson.value = JSON.stringify(rubric.value, null, 2);
    }
    function openComments(id) {
      currentId.value = id;
      if (!commentsMap[id]) commentsMap[id] = [];
      commentsOpen.value = true;
    }
    function postComment() {
      const id = currentId.value;
      const text = newComment.value.trim();
      if (!id || !text) return;
      const c = { id: rand(), text, at: (/* @__PURE__ */ new Date()).toLocaleString(), authorId: userId.value };
      commentsMap[id].unshift(c);
      newComment.value = "";
      persist();
    }
    function persist() {
      const payload = { rows: rows.value, rubric: rubric.value, comments: commentsMap };
      console.debug("setItem replaced");
      STORAGE_KEY.value, JSON.stringify(payload);
    }
    async function onImportJSON(file) {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        rows.value = data.rows || [];
        rubric.value = data.rubric || [];
        Object.assign(commentsMap, data.comments || {});
        persist();
        message.success("Imported");
      } catch (e) {
        message.error(e?.message || "Import failed");
      }
      return false;
    }
    function exportJSON() {
      const blob = new Blob([JSON.stringify({ rows: rows.value, rubric: rubric.value, comments: commentsMap }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = (void 0).createElement("a");
      a.href = url;
      a.download = `grade-${route.params.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
    function mockRows(n = 10) {
      return Array.from({ length: n }, (_, i) => ({
        id: `sub-${i + 1}`,
        attempt: i % 2 + 1,
        studentId: `student-${String(i + 1).padStart(2, "0")}`,
        fileUrl: "https://example.com/file.pdf",
        criteria: rubric.value.reduce((acc, c) => {
          acc[c.label] = Math.round(60 + Math.random() * 40);
          return acc;
        }, {}),
        grade: void 0,
        feedback: ""
      }));
    }
    function resetMock() {
      rows.value = mockRows(10);
      Object.keys(commentsMap).forEach((k) => delete commentsMap[k]);
      persist();
      message.success("Mock reset");
    }
    function rand() {
      return Math.random().toString(36).slice(2, 9);
    }
    watch([rows, rubric], () => {
      if (autoSave.value) persist();
    }, { deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_switch = resolveComponent("a-switch");
      const _component_a_divider = resolveComponent("a-divider");
      const _component_a_upload = resolveComponent("a-upload");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_drawer = resolveComponent("a-drawer");
      const _component_a_alert = resolveComponent("a-alert");
      const _component_a_textarea = resolveComponent("a-textarea");
      const _component_a_list = resolveComponent("a-list");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_a_layout, { class: "p-6 grade-page" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_card, {
              title: `Grade · ${unref(route).params.id}`,
              bordered: false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="toolbar flex justify-between mb-3 flex-wrap items-center gap-2" data-v-f8f7005f${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_a_space, { wrap: "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_button, { onClick: openRubric }, {
                          icon: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(SettingOutlined), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(SettingOutlined))
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Rubric `);
                            } else {
                              return [
                                createTextVNode(" Rubric ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_switch, {
                          checked: autoSave.value,
                          "onUpdate:checked": ($event) => autoSave.value = $event
                        }, null, _parent4, _scopeId3));
                        _push4(` <span class="muted" data-v-f8f7005f${_scopeId3}>Auto-save</span>`);
                        _push4(ssrRenderComponent(_component_a_divider, { type: "vertical" }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_button, { onClick: exportJSON }, {
                          icon: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(DownloadOutlined), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(DownloadOutlined))
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Export JSON `);
                            } else {
                              return [
                                createTextVNode(" Export JSON ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_upload, {
                          "before-upload": onImportJSON,
                          accept: ".json"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_button, null, {
                                icon: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(UploadOutlined), null, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(UploadOutlined))
                                    ];
                                  }
                                }),
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` Import JSON `);
                                  } else {
                                    return [
                                      createTextVNode(" Import JSON ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_button, null, {
                                  icon: withCtx(() => [
                                    createVNode(unref(UploadOutlined))
                                  ]),
                                  default: withCtx(() => [
                                    createTextVNode(" Import JSON ")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_button, {
                          danger: "",
                          onClick: resetMock
                        }, {
                          icon: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(DeleteOutlined), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(DeleteOutlined))
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Reset `);
                            } else {
                              return [
                                createTextVNode(" Reset ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_button, { onClick: openRubric }, {
                            icon: withCtx(() => [
                              createVNode(unref(SettingOutlined))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" Rubric ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_switch, {
                            checked: autoSave.value,
                            "onUpdate:checked": ($event) => autoSave.value = $event
                          }, null, 8, ["checked", "onUpdate:checked"]),
                          createTextVNode(),
                          createVNode("span", { class: "muted" }, "Auto-save"),
                          createVNode(_component_a_divider, { type: "vertical" }),
                          createVNode(_component_a_button, { onClick: exportJSON }, {
                            icon: withCtx(() => [
                              createVNode(unref(DownloadOutlined))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" Export JSON ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_upload, {
                            "before-upload": onImportJSON,
                            accept: ".json"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, null, {
                                icon: withCtx(() => [
                                  createVNode(unref(UploadOutlined))
                                ]),
                                default: withCtx(() => [
                                  createTextVNode(" Import JSON ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, {
                            danger: "",
                            onClick: resetMock
                          }, {
                            icon: withCtx(() => [
                              createVNode(unref(DeleteOutlined))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" Reset ")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_tag, { color: "orange" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Mock mode`);
                      } else {
                        return [
                          createTextVNode("Mock mode")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_component_a_table, {
                    "data-source": rows.value,
                    columns: cols.value,
                    "row-key": "id",
                    bordered: "",
                    size: "middle",
                    pagination: { pageSize: 8 }
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", { class: "toolbar flex justify-between mb-3 flex-wrap items-center gap-2" }, [
                      createVNode(_component_a_space, { wrap: "" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_button, { onClick: openRubric }, {
                            icon: withCtx(() => [
                              createVNode(unref(SettingOutlined))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" Rubric ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_switch, {
                            checked: autoSave.value,
                            "onUpdate:checked": ($event) => autoSave.value = $event
                          }, null, 8, ["checked", "onUpdate:checked"]),
                          createTextVNode(),
                          createVNode("span", { class: "muted" }, "Auto-save"),
                          createVNode(_component_a_divider, { type: "vertical" }),
                          createVNode(_component_a_button, { onClick: exportJSON }, {
                            icon: withCtx(() => [
                              createVNode(unref(DownloadOutlined))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" Export JSON ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_upload, {
                            "before-upload": onImportJSON,
                            accept: ".json"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, null, {
                                icon: withCtx(() => [
                                  createVNode(unref(UploadOutlined))
                                ]),
                                default: withCtx(() => [
                                  createTextVNode(" Import JSON ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, {
                            danger: "",
                            onClick: resetMock
                          }, {
                            icon: withCtx(() => [
                              createVNode(unref(DeleteOutlined))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" Reset ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_tag, { color: "orange" }, {
                        default: withCtx(() => [
                          createTextVNode("Mock mode")
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(_component_a_table, {
                      "data-source": rows.value,
                      columns: cols.value,
                      "row-key": "id",
                      bordered: "",
                      size: "middle",
                      pagination: { pageSize: 8 }
                    }, null, 8, ["data-source", "columns"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_card, {
                title: `Grade · ${unref(route).params.id}`,
                bordered: false
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "toolbar flex justify-between mb-3 flex-wrap items-center gap-2" }, [
                    createVNode(_component_a_space, { wrap: "" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_button, { onClick: openRubric }, {
                          icon: withCtx(() => [
                            createVNode(unref(SettingOutlined))
                          ]),
                          default: withCtx(() => [
                            createTextVNode(" Rubric ")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_switch, {
                          checked: autoSave.value,
                          "onUpdate:checked": ($event) => autoSave.value = $event
                        }, null, 8, ["checked", "onUpdate:checked"]),
                        createTextVNode(),
                        createVNode("span", { class: "muted" }, "Auto-save"),
                        createVNode(_component_a_divider, { type: "vertical" }),
                        createVNode(_component_a_button, { onClick: exportJSON }, {
                          icon: withCtx(() => [
                            createVNode(unref(DownloadOutlined))
                          ]),
                          default: withCtx(() => [
                            createTextVNode(" Export JSON ")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_upload, {
                          "before-upload": onImportJSON,
                          accept: ".json"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_button, null, {
                              icon: withCtx(() => [
                                createVNode(unref(UploadOutlined))
                              ]),
                              default: withCtx(() => [
                                createTextVNode(" Import JSON ")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_button, {
                          danger: "",
                          onClick: resetMock
                        }, {
                          icon: withCtx(() => [
                            createVNode(unref(DeleteOutlined))
                          ]),
                          default: withCtx(() => [
                            createTextVNode(" Reset ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_tag, { color: "orange" }, {
                      default: withCtx(() => [
                        createTextVNode("Mock mode")
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode(_component_a_table, {
                    "data-source": rows.value,
                    columns: cols.value,
                    "row-key": "id",
                    bordered: "",
                    size: "middle",
                    pagination: { pageSize: 8 }
                  }, null, 8, ["data-source", "columns"])
                ]),
                _: 1
              }, 8, ["title"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_drawer, {
        open: rubricOpen.value,
        "onUpdate:open": ($event) => rubricOpen.value = $event,
        title: "Rubric editor",
        placement: "right",
        width: "440"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_alert, {
              type: "info",
              "show-icon": "",
              message: "Provide JSON rubric — e.g. [{label:'Code',weight:0.6},{label:'Report',weight:0.4}]",
              class: "mb-2"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_textarea, {
              value: rubricJson.value,
              "onUpdate:value": ($event) => rubricJson.value = $event,
              rows: 10
            }, null, _parent2, _scopeId));
            _push2(`<div class="mt-2 flex gap-2 items-center" data-v-f8f7005f${_scopeId}>`);
            _push2(ssrRenderComponent(_component_a_button, {
              type: "primary",
              onClick: saveRubric
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Save`);
                } else {
                  return [
                    createTextVNode("Save")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_button, { onClick: normalizeWeights }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Normalize weights`);
                } else {
                  return [
                    createTextVNode("Normalize weights")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (Math.abs(rubricWeightSum.value - 1) < 1e-6) {
              _push2(ssrRenderComponent(_component_a_tag, { color: "green" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Sum: 1.00`);
                  } else {
                    return [
                      createTextVNode("Sum: 1.00")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_component_a_tag, { color: "red" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Sum: ${ssrInterpolate(rubricWeightSum.value.toFixed(2))}`);
                  } else {
                    return [
                      createTextVNode("Sum: " + toDisplayString(rubricWeightSum.value.toFixed(2)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_a_divider, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_list, {
              size: "small",
              "data-source": rubric.value,
              renderItem: (r) => h("div", {}, `${r.label} · ${r.weight}`)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_alert, {
                type: "info",
                "show-icon": "",
                message: "Provide JSON rubric — e.g. [{label:'Code',weight:0.6},{label:'Report',weight:0.4}]",
                class: "mb-2"
              }),
              createVNode(_component_a_textarea, {
                value: rubricJson.value,
                "onUpdate:value": ($event) => rubricJson.value = $event,
                rows: 10
              }, null, 8, ["value", "onUpdate:value"]),
              createVNode("div", { class: "mt-2 flex gap-2 items-center" }, [
                createVNode(_component_a_button, {
                  type: "primary",
                  onClick: saveRubric
                }, {
                  default: withCtx(() => [
                    createTextVNode("Save")
                  ]),
                  _: 1
                }),
                createVNode(_component_a_button, { onClick: normalizeWeights }, {
                  default: withCtx(() => [
                    createTextVNode("Normalize weights")
                  ]),
                  _: 1
                }),
                Math.abs(rubricWeightSum.value - 1) < 1e-6 ? (openBlock(), createBlock(_component_a_tag, {
                  key: 0,
                  color: "green"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Sum: 1.00")
                  ]),
                  _: 1
                })) : (openBlock(), createBlock(_component_a_tag, {
                  key: 1,
                  color: "red"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Sum: " + toDisplayString(rubricWeightSum.value.toFixed(2)), 1)
                  ]),
                  _: 1
                }))
              ]),
              createVNode(_component_a_divider),
              createVNode(_component_a_list, {
                size: "small",
                "data-source": rubric.value,
                renderItem: (r) => h("div", {}, `${r.label} · ${r.weight}`)
              }, null, 8, ["data-source", "renderItem"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_drawer, {
        open: commentsOpen.value,
        "onUpdate:open": ($event) => commentsOpen.value = $event,
        title: "Comments",
        placement: "right",
        width: "420"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_list, {
              "data-source": comments.value,
              renderItem: (c) => h("div", { class: "comment-item" }, `${c.at} – ${c.authorId || "anon"}: ${c.text}`)
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_textarea, {
              value: newComment.value,
              "onUpdate:value": ($event) => newComment.value = $event,
              rows: 3,
              class: "mt-2",
              placeholder: "Add a comment..."
            }, null, _parent2, _scopeId));
            _push2(`<div class="mt-2" data-v-f8f7005f${_scopeId}>`);
            _push2(ssrRenderComponent(_component_a_button, {
              type: "primary",
              onClick: postComment
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Post`);
                } else {
                  return [
                    createTextVNode("Post")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_a_list, {
                "data-source": comments.value,
                renderItem: (c) => h("div", { class: "comment-item" }, `${c.at} – ${c.authorId || "anon"}: ${c.text}`)
              }, null, 8, ["data-source", "renderItem"]),
              createVNode(_component_a_textarea, {
                value: newComment.value,
                "onUpdate:value": ($event) => newComment.value = $event,
                rows: 3,
                class: "mt-2",
                placeholder: "Add a comment..."
              }, null, 8, ["value", "onUpdate:value"]),
              createVNode("div", { class: "mt-2" }, [
                createVNode(_component_a_button, {
                  type: "primary",
                  onClick: postComment
                }, {
                  default: withCtx(() => [
                    createTextVNode("Post")
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/teach-internal/nuxt/pages/institutions/[slug]/assignments/[id]/grading.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const grading = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f8f7005f"]]);

export { grading as default };
//# sourceMappingURL=grading-BV6Bavo3.mjs.map
