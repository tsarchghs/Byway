import { defineComponent, ref, reactive, watch, computed, resolveComponent, withCtx, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, createVNode, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';

const LS_KEY = "byway.uni.panel.v1";
const storageKeyCols = "byway:uni:columns";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ModuleUniversityPanel",
  __ssrInlineRender: true,
  setup(__props) {
    const tab = ref("overview");
    const q = ref("");
    const density = ref("Comfort");
    ref(false);
    reactive([
      { key: "lessons", label: "Lessons", value: 12, hint: "Videos & readings" },
      { key: "assign", label: "Assignments", value: 5, hint: "Due this term" },
      { key: "cohorts", label: "Cohorts", value: 3, hint: "Active" },
      { key: "progress", label: "Avg Progress", value: "42%", hint: "Across roster" }
    ]);
    reactive([
      { title: "Kickoff lecture", type: "Lecture", when: "Mon 09:00" },
      { title: "Lab 1 published", type: "Lab", when: "Wed 09:00" },
      { title: "Quiz 1 opens", type: "Quiz", when: "Fri 12:00" }
    ]);
    reactive([
      { id: "c1", name: "Fall 2025 A", start: "2025-09-15", end: "2025-12-15", students: 35 },
      { id: "c2", name: "Fall 2025 B", start: "2025-09-16", end: "2025-12-16", students: 28 }
    ]);
    ref(false);
    reactive({ name: "", start: null, end: null });
    ref("");
    const roster = reactive([
      { id: "s1", name: "A. Student", email: "a@student.edu", role: "Student" },
      { id: "s2", name: "B. Student", email: "b@student.edu", role: "Student" }
    ]);
    ref("All");
    reactive([
      { id: "a1", title: "Homework 1", due: "2025-11-18", status: "Pending" },
      { id: "a2", title: "Project Proposal", due: "2025-11-25", status: "Submitted" }
    ]);
    ref(false);
    reactive({ title: "", due: null, points: 100 });
    reactive([
      { id: "g1", student: "A. Student", item: "Quiz 1", score: 8 },
      { id: "g2", student: "B. Student", item: "Homework 1", score: 12 }
    ]);
    reactive([
      { id: "d1", title: "Clarification on Lab 1", author: "A. Student", body: "How do we set the seed?" }
    ]);
    reactive({ title: "", body: "" });
    reactive([
      { id: "r1", name: "Syllabus.pdf", type: "PDF" },
      { id: "r2", name: "Slides-Week1.pptx", type: "Slides" }
    ]);
    const dateRange = ref(null);
    ref(false);
    watch([tab, q, density, dateRange], () => {
      try {
        console.debug("setItem replaced");
        LS_KEY, JSON.stringify({
          tab: tab.value,
          q: q.value,
          density: density.value,
          dateRange: dateRange.value
        });
      } catch {
      }
    });
    const selectedRowKeys = ref([]);
    const rowKeyFn = (r) => r?.id || r?.userId || r?.email || r?.username || r?.name;
    const selectedRows = computed(() => {
      const set = new Set(selectedRowKeys.value);
      return Array.isArray(roster) ? roster.filter((r) => set.has(rowKeyFn(r))) : [];
    });
    computed(() => selectedRows.value.map((r) => r.email || r.contactEmail).filter(Boolean));
    ref(null);
    ref(false);
    ref("");
    ref("");
    const savedViews = ref([]);
    function loadSavedViews() {
      try {
        savedViews.value = JSON.parse("[]");
      } catch {
      }
    }
    loadSavedViews();
    const searchText = ref("");
    const activeFilters = ref(/* @__PURE__ */ new Set());
    computed(() => {
      let arr = Array.isArray(roster) ? roster.slice() : [];
      if (searchText.value) {
        const q2 = searchText.value.toLowerCase();
        arr = arr.filter((r) => [r.name, r.email, r.username, r.studentId].some((v) => String(v || "").toLowerCase().includes(q2)));
      }
      if (activeFilters.value.has("atRisk")) {
        arr = arr.filter((r) => (r.grade ?? r.score ?? 0) <= 60 || (r.missingSubmissions ?? 0) > 0);
      }
      if (activeFilters.value.has("inactive14")) {
        const now = Date.now();
        arr = arr.filter((r) => {
          const t = new Date(r.lastActive || r.lastSeen || r.updatedAt || 0).getTime();
          return !t || now - t > 14 * 24 * 3600 * 1e3;
        });
      }
      if (activeFilters.value.has("top")) {
        arr = arr.filter((r) => (r.grade ?? r.score ?? 0) >= 85);
      }
      return arr;
    });
    const dense = ref(false);
    const refreshing = ref(false);
    const drawerOpen = ref(false);
    const selectedStudent = ref(null);
    const searchValue = ref("");
    const allColumns = computed(() => {
      const item = roster && roster[0] || null;
      if (!item) return [];
      return Object.keys(item).filter((k) => !["id", "activities"].includes(k)).map((k) => ({
        key: k,
        title: k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())
      }));
    });
    const visibleColumnKeys = ref([]);
    watch(visibleColumnKeys, (v) => {
      try {
        console.debug("setItem replaced");
        storageKeyCols, JSON.stringify(v);
      } catch {
      }
    }, { deep: true });
    const selectAllCols = () => visibleColumnKeys.value = allColumns.value.map((c) => c.key);
    const selectDefaultCols = () => {
      const defaults = ["name", "email", "cohort", "progress", "lastActive"].filter((k) => allColumns.value.some((c) => c.key === k));
      visibleColumnKeys.value = defaults;
    };
    const searchOptions = computed(() => (roster || []).map((s) => ({ value: s.name || s.email, id: s.id })));
    const openStudentByName = (val, option) => {
      const id = option?.id;
      const s = (roster || []).find((r) => r.name === val || r.email === val || id && r.id === id);
      if (s) {
        selectedStudent.value = s;
        drawerOpen.value = true;
      }
    };
    const refreshRoster = async () => {
      if (typeof fetch !== "function") return;
      try {
        refreshing.value = true;
        const res = await fetch("/api/students-internal/university/roster", { method: "POST" }).catch(() => null);
        if (res && res.ok) {
          const data = await res.json().catch(() => null);
          if (data && Array.isArray(data.roster)) {
            roster.splice(0, roster.length, ...data.roster);
          }
        }
      } finally {
        refreshing.value = false;
      }
    };
    const avgProgress = computed(() => {
      const arr = (roster || []).map((r) => Number(r.progress ?? 0)).filter((n) => !Number.isNaN(n));
      if (!arr.length) return 0;
      return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    });
    const riskSummary = computed(() => {
      const arr = roster || [];
      const counters = { low: 0, medium: 0, high: 0 };
      for (const r of arr) {
        const tag = (r.risk || "low").toLowerCase();
        if (counters[tag] != null) counters[tag]++;
      }
      return [
        { label: "Low", color: "success", count: counters.low },
        { label: "Medium", color: "warning", count: counters.medium },
        { label: "High", color: "error", count: counters.high }
      ];
    });
    const riskSummaryTotal = computed(() => riskSummary.value.reduce((a, b) => a + b.count, 0));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_card = resolveComponent("a-card");
      const _component_a_statistic = resolveComponent("a-statistic");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_auto_complete = resolveComponent("a-auto-complete");
      const _component_a_popover = resolveComponent("a-popover");
      const _component_a_checkbox_group = resolveComponent("a-checkbox-group");
      const _component_a_checkbox = resolveComponent("a-checkbox");
      const _component_a_divider = resolveComponent("a-divider");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_switch = resolveComponent("a-switch");
      const _component_a_drawer = resolveComponent("a-drawer");
      const _component_a_descriptions = resolveComponent("a-descriptions");
      const _component_a_descriptions_item = resolveComponent("a-descriptions-item");
      const _component_a_empty = resolveComponent("a-empty");
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_timeline = resolveComponent("a-timeline");
      const _component_a_timeline_item = resolveComponent("a-timeline-item");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_a_card, {
        class: "uni-analytics-bar",
        bordered: false,
        style: { "margin": "12px 0" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-wrap items-center gap-3 justify-between"${_scopeId}><div class="flex flex-wrap items-center gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_a_statistic, {
              title: "Students",
              value: roster && roster.length || 0
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_statistic, {
              title: "Avg Progress",
              precision: 0,
              value: avgProgress.value,
              suffix: "%"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_statistic, {
              title: "At Risk",
              value: riskSummaryTotal.value
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_space, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(riskSummary.value, (chip) => {
                    _push3(ssrRenderComponent(_component_a_tag, {
                      key: chip.label,
                      color: chip.color
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(chip.label)}: ${ssrInterpolate(chip.count)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(chip.label) + ": " + toDisplayString(chip.count), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(riskSummary.value, (chip) => {
                      return openBlock(), createBlock(_component_a_tag, {
                        key: chip.label,
                        color: chip.color
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(chip.label) + ": " + toDisplayString(chip.count), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"]);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_a_auto_complete, {
              style: { "width": "220px" },
              options: searchOptions.value,
              value: searchValue.value,
              "onUpdate:value": ($event) => searchValue.value = $event,
              placeholder: "Find student...",
              onSelect: openStudentByName
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_popover, {
              placement: "bottomRight",
              title: "Show / hide columns"
            }, {
              content: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div style="${ssrRenderStyle({ "max-width": "260px" })}"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_a_checkbox_group, {
                    value: visibleColumnKeys.value,
                    "onUpdate:value": ($event) => visibleColumnKeys.value = $event
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(allColumns.value, (col) => {
                          _push4(`<div class="py-1"${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_a_checkbox, {
                            value: col.key
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(col.title)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(col.title), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(`</div>`);
                        });
                        _push4(`<!--]-->`);
                      } else {
                        return [
                          (openBlock(true), createBlock(Fragment, null, renderList(allColumns.value, (col) => {
                            return openBlock(), createBlock("div", {
                              key: col.key,
                              class: "py-1"
                            }, [
                              createVNode(_component_a_checkbox, {
                                value: col.key
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(col.title), 1)
                                ]),
                                _: 2
                              }, 1032, ["value"])
                            ]);
                          }), 128))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_divider, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_space, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_button, {
                          size: "small",
                          onClick: selectAllCols
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Select all`);
                            } else {
                              return [
                                createTextVNode("Select all")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_button, {
                          size: "small",
                          onClick: selectDefaultCols
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Defaults`);
                            } else {
                              return [
                                createTextVNode("Defaults")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_button, {
                            size: "small",
                            onClick: selectAllCols
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Select all")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, {
                            size: "small",
                            onClick: selectDefaultCols
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Defaults")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { style: { "max-width": "260px" } }, [
                      createVNode(_component_a_checkbox_group, {
                        value: visibleColumnKeys.value,
                        "onUpdate:value": ($event) => visibleColumnKeys.value = $event
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(allColumns.value, (col) => {
                            return openBlock(), createBlock("div", {
                              key: col.key,
                              class: "py-1"
                            }, [
                              createVNode(_component_a_checkbox, {
                                value: col.key
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(col.title), 1)
                                ]),
                                _: 2
                              }, 1032, ["value"])
                            ]);
                          }), 128))
                        ]),
                        _: 1
                      }, 8, ["value", "onUpdate:value"]),
                      createVNode(_component_a_divider),
                      createVNode(_component_a_space, null, {
                        default: withCtx(() => [
                          createVNode(_component_a_button, {
                            size: "small",
                            onClick: selectAllCols
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Select all")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, {
                            size: "small",
                            onClick: selectDefaultCols
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Defaults")
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
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_button, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Columns`);
                      } else {
                        return [
                          createTextVNode("Columns")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_button, null, {
                      default: withCtx(() => [
                        createTextVNode("Columns")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_switch, {
              checked: dense.value,
              "onUpdate:checked": ($event) => dense.value = $event,
              "checked-children": "Dense",
              "un-checked-children": "Comfort"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_button, {
              onClick: refreshRoster,
              loading: refreshing.value
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Refresh`);
                } else {
                  return [
                    createTextVNode("Refresh")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-wrap items-center gap-3 justify-between" }, [
                createVNode("div", { class: "flex flex-wrap items-center gap-4" }, [
                  createVNode(_component_a_statistic, {
                    title: "Students",
                    value: roster && roster.length || 0
                  }, null, 8, ["value"]),
                  createVNode(_component_a_statistic, {
                    title: "Avg Progress",
                    precision: 0,
                    value: avgProgress.value,
                    suffix: "%"
                  }, null, 8, ["value"]),
                  createVNode(_component_a_statistic, {
                    title: "At Risk",
                    value: riskSummaryTotal.value
                  }, null, 8, ["value"]),
                  createVNode(_component_a_space, null, {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(riskSummary.value, (chip) => {
                        return openBlock(), createBlock(_component_a_tag, {
                          key: chip.label,
                          color: chip.color
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(chip.label) + ": " + toDisplayString(chip.count), 1)
                          ]),
                          _: 2
                        }, 1032, ["color"]);
                      }), 128))
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "flex items-center gap-2" }, [
                  createVNode(_component_a_auto_complete, {
                    style: { "width": "220px" },
                    options: searchOptions.value,
                    value: searchValue.value,
                    "onUpdate:value": ($event) => searchValue.value = $event,
                    placeholder: "Find student...",
                    onSelect: openStudentByName
                  }, null, 8, ["options", "value", "onUpdate:value"]),
                  createVNode(_component_a_popover, {
                    placement: "bottomRight",
                    title: "Show / hide columns"
                  }, {
                    content: withCtx(() => [
                      createVNode("div", { style: { "max-width": "260px" } }, [
                        createVNode(_component_a_checkbox_group, {
                          value: visibleColumnKeys.value,
                          "onUpdate:value": ($event) => visibleColumnKeys.value = $event
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(allColumns.value, (col) => {
                              return openBlock(), createBlock("div", {
                                key: col.key,
                                class: "py-1"
                              }, [
                                createVNode(_component_a_checkbox, {
                                  value: col.key
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(col.title), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["value"])
                              ]);
                            }), 128))
                          ]),
                          _: 1
                        }, 8, ["value", "onUpdate:value"]),
                        createVNode(_component_a_divider),
                        createVNode(_component_a_space, null, {
                          default: withCtx(() => [
                            createVNode(_component_a_button, {
                              size: "small",
                              onClick: selectAllCols
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Select all")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_button, {
                              size: "small",
                              onClick: selectDefaultCols
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Defaults")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    default: withCtx(() => [
                      createVNode(_component_a_button, null, {
                        default: withCtx(() => [
                          createTextVNode("Columns")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_switch, {
                    checked: dense.value,
                    "onUpdate:checked": ($event) => dense.value = $event,
                    "checked-children": "Dense",
                    "un-checked-children": "Comfort"
                  }, null, 8, ["checked", "onUpdate:checked"]),
                  createVNode(_component_a_button, {
                    onClick: refreshRoster,
                    loading: refreshing.value
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Refresh")
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_drawer, {
        open: drawerOpen.value,
        "onUpdate:open": ($event) => drawerOpen.value = $event,
        width: "460",
        title: selectedStudent.value?.name || "Student"
      }, {
        extra: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (selectedStudent.value?.risk) {
              _push2(ssrRenderComponent(_component_a_tag, {
                color: selectedStudent.value.risk === "high" ? "error" : selectedStudent.value.risk === "medium" ? "warning" : "success"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate((selectedStudent.value?.risk || "ok").toUpperCase())}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString((selectedStudent.value?.risk || "ok").toUpperCase()), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              selectedStudent.value?.risk ? (openBlock(), createBlock(_component_a_tag, {
                key: 0,
                color: selectedStudent.value.risk === "high" ? "error" : selectedStudent.value.risk === "medium" ? "warning" : "success"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString((selectedStudent.value?.risk || "ok").toUpperCase()), 1)
                ]),
                _: 1
              }, 8, ["color"])) : createCommentVNode("", true)
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (selectedStudent.value) {
              _push2(ssrRenderComponent(_component_a_descriptions, {
                size: "small",
                layout: "vertical",
                column: 1
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_descriptions_item, { label: "Email" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(selectedStudent.value.email || "–")}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(selectedStudent.value.email || "–"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_a_descriptions_item, { label: "Cohort" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(selectedStudent.value.cohort || "–")}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(selectedStudent.value.cohort || "–"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_a_descriptions_item, { label: "Progress" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate((selectedStudent.value.progress ?? 0) + "%")}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString((selectedStudent.value.progress ?? 0) + "%"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_a_descriptions_item, { label: "Last Active" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(selectedStudent.value.lastActive || "–")}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(selectedStudent.value.lastActive || "–"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_a_descriptions_item, { label: "Email" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(selectedStudent.value.email || "–"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_descriptions_item, { label: "Cohort" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(selectedStudent.value.cohort || "–"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_descriptions_item, { label: "Progress" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString((selectedStudent.value.progress ?? 0) + "%"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_descriptions_item, { label: "Last Active" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(selectedStudent.value.lastActive || "–"), 1)
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_component_a_empty, { description: "Pick a student from search to preview." }, null, _parent2, _scopeId));
            }
            _push2(ssrRenderComponent(_component_a_divider, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_typography_title, { level: 5 }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Recent activity`);
                } else {
                  return [
                    createTextVNode("Recent activity")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_timeline, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(selectedStudent.value?.activities || [], (evt, i) => {
                    _push3(ssrRenderComponent(_component_a_timeline_item, { key: i }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<strong${_scopeId3}>${ssrInterpolate(evt.title || evt.kind || "Activity")}</strong><div style="${ssrRenderStyle({ "opacity": ".75" })}"${_scopeId3}>${ssrInterpolate(evt.date || evt.when || "")}</div>`);
                        } else {
                          return [
                            createVNode("strong", null, toDisplayString(evt.title || evt.kind || "Activity"), 1),
                            createVNode("div", { style: { "opacity": ".75" } }, toDisplayString(evt.date || evt.when || ""), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                  if (!selectedStudent.value?.activities?.length) {
                    _push3(ssrRenderComponent(_component_a_timeline_item, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`No recent activity`);
                        } else {
                          return [
                            createTextVNode("No recent activity")
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
                    (openBlock(true), createBlock(Fragment, null, renderList(selectedStudent.value?.activities || [], (evt, i) => {
                      return openBlock(), createBlock(_component_a_timeline_item, { key: i }, {
                        default: withCtx(() => [
                          createVNode("strong", null, toDisplayString(evt.title || evt.kind || "Activity"), 1),
                          createVNode("div", { style: { "opacity": ".75" } }, toDisplayString(evt.date || evt.when || ""), 1)
                        ]),
                        _: 2
                      }, 1024);
                    }), 128)),
                    !selectedStudent.value?.activities?.length ? (openBlock(), createBlock(_component_a_timeline_item, { key: 0 }, {
                      default: withCtx(() => [
                        createTextVNode("No recent activity")
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              selectedStudent.value ? (openBlock(), createBlock(_component_a_descriptions, {
                key: 0,
                size: "small",
                layout: "vertical",
                column: 1
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_descriptions_item, { label: "Email" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(selectedStudent.value.email || "–"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_descriptions_item, { label: "Cohort" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(selectedStudent.value.cohort || "–"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_descriptions_item, { label: "Progress" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString((selectedStudent.value.progress ?? 0) + "%"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_descriptions_item, { label: "Last Active" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(selectedStudent.value.lastActive || "–"), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })) : (openBlock(), createBlock(_component_a_empty, {
                key: 1,
                description: "Pick a student from search to preview."
              })),
              createVNode(_component_a_divider),
              createVNode(_component_a_typography_title, { level: 5 }, {
                default: withCtx(() => [
                  createTextVNode("Recent activity")
                ]),
                _: 1
              }),
              createVNode(_component_a_timeline, null, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(selectedStudent.value?.activities || [], (evt, i) => {
                    return openBlock(), createBlock(_component_a_timeline_item, { key: i }, {
                      default: withCtx(() => [
                        createVNode("strong", null, toDisplayString(evt.title || evt.kind || "Activity"), 1),
                        createVNode("div", { style: { "opacity": ".75" } }, toDisplayString(evt.date || evt.when || ""), 1)
                      ]),
                      _: 2
                    }, 1024);
                  }), 128)),
                  !selectedStudent.value?.activities?.length ? (openBlock(), createBlock(_component_a_timeline_item, { key: 0 }, {
                    default: withCtx(() => [
                      createTextVNode("No recent activity")
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
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/students-internal/nuxt/pages/components/ModuleUniversityPanel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=ModuleUniversityPanel-BXQkcTPZ.mjs.map
