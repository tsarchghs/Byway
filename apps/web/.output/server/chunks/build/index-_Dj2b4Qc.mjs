import { defineComponent, ref, computed, resolveComponent, mergeProps, unref, withCtx, createVNode, createTextVNode, createBlock, openBlock, toDisplayString, createCommentVNode, Fragment, h, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { theme } from 'ant-design-vue';
import { d as dayjs } from './index-9yJzlrSj.mjs';
import { BulbOutlined } from '@ant-design/icons-vue';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const isDark = ref(false);
    const loading = ref(true);
    const detailOpen = ref(false);
    const current = ref(null);
    const search = ref("");
    const statusFilter = ref("");
    const sortBy = ref("dueDate");
    const all = ref([]);
    const columns = [
      { title: "Title", key: "title", dataIndex: "title" },
      { title: "Course", key: "course", dataIndex: "course" },
      { title: "Status", key: "status" },
      { title: "Due", key: "due" },
      { title: "Grade", key: "grade" },
      { title: "Actions", key: "actions", fixed: "right" }
    ];
    const filtered = computed(() => {
      let list = all.value;
      if (search.value) {
        const q = search.value.toLowerCase();
        list = list.filter((a) => a.title.toLowerCase().includes(q) || a.course.toLowerCase().includes(q));
      }
      if (statusFilter.value) list = list.filter((a) => a.status === statusFilter.value);
      if (sortBy.value === "dueDate") list.sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate));
      if (sortBy.value === "course") list.sort((a, b) => a.course.localeCompare(b.course));
      if (sortBy.value === "status") list.sort((a, b) => a.status.localeCompare(b.status));
      return list;
    });
    const upcoming = computed(() => filtered.value.filter((a) => a.status === "assigned" || a.status === "due"));
    const graded = computed(() => filtered.value.filter((a) => a.status === "graded"));
    const dueSoonCount = computed(() => upcoming.value.length);
    const gradedCount = computed(() => graded.value.length);
    const completionRate = computed(
      () => all.value.length ? Math.round(gradedCount.value / all.value.length * 100) : 0
    );
    const statusColor = (s) => ({ assigned: "blue", due: "gold", graded: "green" })[s] || "default";
    const format = (d) => dayjs(d).format("MMM DD, YYYY");
    const openDetail = (a) => {
      current.value = a;
      detailOpen.value = true;
    };
    function renderUpcoming(item) {
      return h("a-list-item", {}, [
        h("div", { class: "assign-preview" }, [
          h("div", [h("b", item.title), h("div", { class: "muted" }, item.course)]),
          h(resolveComponent("a-tag"), { color: statusColor(item.status) }, { default: () => item.status })
        ])
      ]);
    }
    function renderGraded(item) {
      return h("a-list-item", {}, [
        h("div", { class: "assign-preview" }, [
          h("div", [h("b", item.title), h("div", { class: "muted" }, item.course)]),
          h(resolveComponent("a-tag"), { color: "green" }, { default: () => `${item.grade}%` })
        ])
      ]);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_config_provider = resolveComponent("a-config-provider");
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_tooltip = resolveComponent("a-tooltip");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_breadcrumb = resolveComponent("a-breadcrumb");
      const _component_a_breadcrumb_item = resolveComponent("a-breadcrumb-item");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_statistic = resolveComponent("a-statistic");
      const _component_a_input_search = resolveComponent("a-input-search");
      const _component_a_select = resolveComponent("a-select");
      const _component_a_select_option = resolveComponent("a-select-option");
      const _component_a_skeleton = resolveComponent("a-skeleton");
      const _component_a_empty = resolveComponent("a-empty");
      const _component_a_list = resolveComponent("a-list");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_modal = resolveComponent("a-modal");
      const _component_a_descriptions = resolveComponent("a-descriptions");
      const _component_a_descriptions_item = resolveComponent("a-descriptions-item");
      const _component_a_progress = resolveComponent("a-progress");
      _push(ssrRenderComponent(_component_a_config_provider, mergeProps({
        theme: { algorithm: isDark.value ? unref(theme).darkAlgorithm : unref(theme).defaultAlgorithm }
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_layout, {
              class: ["student-assignments-wrap", isDark.value ? "is-dark" : ""],
              "data-test-id": "assignments-wrap"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_page_header, {
                    class: "page-header",
                    title: "Assignments",
                    "sub-title": "Your coursework & deadlines",
                    "data-test-id": "assignments-header"
                  }, {
                    extra: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_space, { wrap: "" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_tooltip, { title: "Toggle dark mode" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_button, {
                                      onClick: ($event) => isDark.value = !isDark.value,
                                      "data-test-id": "toggle-dark"
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
                                        onClick: ($event) => isDark.value = !isDark.value,
                                        "data-test-id": "toggle-dark"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(BulbOutlined))
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
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
                                      onClick: ($event) => isDark.value = !isDark.value,
                                      "data-test-id": "toggle-dark"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(BulbOutlined))
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
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_space, { wrap: "" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_tooltip, { title: "Toggle dark mode" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_button, {
                                    onClick: ($event) => isDark.value = !isDark.value,
                                    "data-test-id": "toggle-dark"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(BulbOutlined))
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"])
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
                  _push3(`<div class="p-4" data-v-18cbcd38${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_a_breadcrumb, { class: "mb-3" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_breadcrumb_item, { to: "/students" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Students`);
                            } else {
                              return [
                                createTextVNode("Students")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_breadcrumb_item, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Assignments`);
                            } else {
                              return [
                                createTextVNode("Assignments")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_breadcrumb_item, { to: "/students" }, {
                            default: withCtx(() => [
                              createTextVNode("Students")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_breadcrumb_item, null, {
                            default: withCtx(() => [
                              createTextVNode("Assignments")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_row, {
                    gutter: [12, 12],
                    class: "mb-3"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_col, {
                          xs: 12,
                          md: 6
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_card, {
                                size: "small",
                                bordered: false
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_statistic, {
                                      title: "Total",
                                      value: all.value.length
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_statistic, {
                                        title: "Total",
                                        value: all.value.length
                                      }, null, 8, ["value"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_card, {
                                  size: "small",
                                  bordered: false
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_statistic, {
                                      title: "Total",
                                      value: all.value.length
                                    }, null, 8, ["value"])
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_col, {
                          xs: 12,
                          md: 6
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_card, {
                                size: "small",
                                bordered: false
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_statistic, {
                                      title: "Due Soon",
                                      value: dueSoonCount.value,
                                      "value-style": { color: "#faad14" }
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_statistic, {
                                        title: "Due Soon",
                                        value: dueSoonCount.value,
                                        "value-style": { color: "#faad14" }
                                      }, null, 8, ["value"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_card, {
                                  size: "small",
                                  bordered: false
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_statistic, {
                                      title: "Due Soon",
                                      value: dueSoonCount.value,
                                      "value-style": { color: "#faad14" }
                                    }, null, 8, ["value"])
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_col, {
                          xs: 12,
                          md: 6
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_card, {
                                size: "small",
                                bordered: false
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_statistic, {
                                      title: "Graded",
                                      value: gradedCount.value,
                                      "value-style": { color: "#52c41a" }
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_statistic, {
                                        title: "Graded",
                                        value: gradedCount.value,
                                        "value-style": { color: "#52c41a" }
                                      }, null, 8, ["value"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_card, {
                                  size: "small",
                                  bordered: false
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_statistic, {
                                      title: "Graded",
                                      value: gradedCount.value,
                                      "value-style": { color: "#52c41a" }
                                    }, null, 8, ["value"])
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_col, {
                          xs: 12,
                          md: 6
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_card, {
                                size: "small",
                                bordered: false
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_statistic, {
                                      title: "Completion Rate",
                                      value: `${completionRate.value}%`
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_statistic, {
                                        title: "Completion Rate",
                                        value: `${completionRate.value}%`
                                      }, null, 8, ["value"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_card, {
                                  size: "small",
                                  bordered: false
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_statistic, {
                                      title: "Completion Rate",
                                      value: `${completionRate.value}%`
                                    }, null, 8, ["value"])
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
                          createVNode(_component_a_col, {
                            xs: 12,
                            md: 6
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                size: "small",
                                bordered: false
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_statistic, {
                                    title: "Total",
                                    value: all.value.length
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 12,
                            md: 6
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                size: "small",
                                bordered: false
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_statistic, {
                                    title: "Due Soon",
                                    value: dueSoonCount.value,
                                    "value-style": { color: "#faad14" }
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 12,
                            md: 6
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                size: "small",
                                bordered: false
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_statistic, {
                                    title: "Graded",
                                    value: gradedCount.value,
                                    "value-style": { color: "#52c41a" }
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 12,
                            md: 6
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                size: "small",
                                bordered: false
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_statistic, {
                                    title: "Completion Rate",
                                    value: `${completionRate.value}%`
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
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_card, {
                    bordered: false,
                    class: "mb-4"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_space, { wrap: "" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_input_search, {
                                value: search.value,
                                "onUpdate:value": ($event) => search.value = $event,
                                style: { "width": "240px" },
                                placeholder: "Search assignments",
                                "data-test-id": "search"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_select, {
                                value: statusFilter.value,
                                "onUpdate:value": ($event) => statusFilter.value = $event,
                                placeholder: "Status",
                                style: { "width": "160px" }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_select_option, { value: "" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`All`);
                                        } else {
                                          return [
                                            createTextVNode("All")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_select_option, { value: "assigned" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Assigned`);
                                        } else {
                                          return [
                                            createTextVNode("Assigned")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_select_option, { value: "due" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Due`);
                                        } else {
                                          return [
                                            createTextVNode("Due")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_select_option, { value: "graded" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Graded`);
                                        } else {
                                          return [
                                            createTextVNode("Graded")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_select_option, { value: "" }, {
                                        default: withCtx(() => [
                                          createTextVNode("All")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_select_option, { value: "assigned" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Assigned")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_select_option, { value: "due" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Due")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_select_option, { value: "graded" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Graded")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_select, {
                                value: sortBy.value,
                                "onUpdate:value": ($event) => sortBy.value = $event,
                                style: { "width": "160px" }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_select_option, { value: "dueDate" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Due Date`);
                                        } else {
                                          return [
                                            createTextVNode("Due Date")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_select_option, { value: "course" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Course`);
                                        } else {
                                          return [
                                            createTextVNode("Course")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_select_option, { value: "status" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Status`);
                                        } else {
                                          return [
                                            createTextVNode("Status")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_select_option, { value: "dueDate" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Due Date")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_select_option, { value: "course" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Course")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_select_option, { value: "status" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Status")
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
                                createVNode(_component_a_input_search, {
                                  value: search.value,
                                  "onUpdate:value": ($event) => search.value = $event,
                                  style: { "width": "240px" },
                                  placeholder: "Search assignments",
                                  "data-test-id": "search"
                                }, null, 8, ["value", "onUpdate:value"]),
                                createVNode(_component_a_select, {
                                  value: statusFilter.value,
                                  "onUpdate:value": ($event) => statusFilter.value = $event,
                                  placeholder: "Status",
                                  style: { "width": "160px" }
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_select_option, { value: "" }, {
                                      default: withCtx(() => [
                                        createTextVNode("All")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_select_option, { value: "assigned" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Assigned")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_select_option, { value: "due" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Due")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_select_option, { value: "graded" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Graded")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["value", "onUpdate:value"]),
                                createVNode(_component_a_select, {
                                  value: sortBy.value,
                                  "onUpdate:value": ($event) => sortBy.value = $event,
                                  style: { "width": "160px" }
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_select_option, { value: "dueDate" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Due Date")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_select_option, { value: "course" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Course")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_select_option, { value: "status" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Status")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["value", "onUpdate:value"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_space, { wrap: "" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_input_search, {
                                value: search.value,
                                "onUpdate:value": ($event) => search.value = $event,
                                style: { "width": "240px" },
                                placeholder: "Search assignments",
                                "data-test-id": "search"
                              }, null, 8, ["value", "onUpdate:value"]),
                              createVNode(_component_a_select, {
                                value: statusFilter.value,
                                "onUpdate:value": ($event) => statusFilter.value = $event,
                                placeholder: "Status",
                                style: { "width": "160px" }
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_select_option, { value: "" }, {
                                    default: withCtx(() => [
                                      createTextVNode("All")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_select_option, { value: "assigned" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Assigned")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_select_option, { value: "due" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Due")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_select_option, { value: "graded" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Graded")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["value", "onUpdate:value"]),
                              createVNode(_component_a_select, {
                                value: sortBy.value,
                                "onUpdate:value": ($event) => sortBy.value = $event,
                                style: { "width": "160px" }
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_select_option, { value: "dueDate" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Due Date")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_select_option, { value: "course" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Course")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_select_option, { value: "status" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Status")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_row, { gutter: [12, 12] }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_col, {
                          xs: 24,
                          md: 12
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_card, {
                                title: "📅 Upcoming",
                                bordered: false
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    if (loading.value) {
                                      _push6(ssrRenderComponent(_component_a_skeleton, { active: "" }, null, _parent6, _scopeId5));
                                    } else if (upcoming.value.length === 0) {
                                      _push6(ssrRenderComponent(_component_a_empty, { description: "No upcoming assignments" }, null, _parent6, _scopeId5));
                                    } else {
                                      _push6(ssrRenderComponent(_component_a_list, {
                                        "data-source": upcoming.value,
                                        "render-item": renderUpcoming
                                      }, null, _parent6, _scopeId5));
                                    }
                                  } else {
                                    return [
                                      loading.value ? (openBlock(), createBlock(_component_a_skeleton, {
                                        key: 0,
                                        active: ""
                                      })) : upcoming.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                                        key: 1,
                                        description: "No upcoming assignments"
                                      })) : (openBlock(), createBlock(_component_a_list, {
                                        key: 2,
                                        "data-source": upcoming.value,
                                        "render-item": renderUpcoming
                                      }, null, 8, ["data-source"]))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_card, {
                                  title: "📅 Upcoming",
                                  bordered: false
                                }, {
                                  default: withCtx(() => [
                                    loading.value ? (openBlock(), createBlock(_component_a_skeleton, {
                                      key: 0,
                                      active: ""
                                    })) : upcoming.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                                      key: 1,
                                      description: "No upcoming assignments"
                                    })) : (openBlock(), createBlock(_component_a_list, {
                                      key: 2,
                                      "data-source": upcoming.value,
                                      "render-item": renderUpcoming
                                    }, null, 8, ["data-source"]))
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_col, {
                          xs: 24,
                          md: 12
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_card, {
                                title: "✅ Graded",
                                bordered: false
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    if (loading.value) {
                                      _push6(ssrRenderComponent(_component_a_skeleton, { active: "" }, null, _parent6, _scopeId5));
                                    } else if (graded.value.length === 0) {
                                      _push6(ssrRenderComponent(_component_a_empty, { description: "Nothing graded yet" }, null, _parent6, _scopeId5));
                                    } else {
                                      _push6(ssrRenderComponent(_component_a_list, {
                                        "data-source": graded.value,
                                        "render-item": renderGraded
                                      }, null, _parent6, _scopeId5));
                                    }
                                  } else {
                                    return [
                                      loading.value ? (openBlock(), createBlock(_component_a_skeleton, {
                                        key: 0,
                                        active: ""
                                      })) : graded.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                                        key: 1,
                                        description: "Nothing graded yet"
                                      })) : (openBlock(), createBlock(_component_a_list, {
                                        key: 2,
                                        "data-source": graded.value,
                                        "render-item": renderGraded
                                      }, null, 8, ["data-source"]))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_card, {
                                  title: "✅ Graded",
                                  bordered: false
                                }, {
                                  default: withCtx(() => [
                                    loading.value ? (openBlock(), createBlock(_component_a_skeleton, {
                                      key: 0,
                                      active: ""
                                    })) : graded.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                                      key: 1,
                                      description: "Nothing graded yet"
                                    })) : (openBlock(), createBlock(_component_a_list, {
                                      key: 2,
                                      "data-source": graded.value,
                                      "render-item": renderGraded
                                    }, null, 8, ["data-source"]))
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
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 12
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                title: "📅 Upcoming",
                                bordered: false
                              }, {
                                default: withCtx(() => [
                                  loading.value ? (openBlock(), createBlock(_component_a_skeleton, {
                                    key: 0,
                                    active: ""
                                  })) : upcoming.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                                    key: 1,
                                    description: "No upcoming assignments"
                                  })) : (openBlock(), createBlock(_component_a_list, {
                                    key: 2,
                                    "data-source": upcoming.value,
                                    "render-item": renderUpcoming
                                  }, null, 8, ["data-source"]))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 12
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                title: "✅ Graded",
                                bordered: false
                              }, {
                                default: withCtx(() => [
                                  loading.value ? (openBlock(), createBlock(_component_a_skeleton, {
                                    key: 0,
                                    active: ""
                                  })) : graded.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                                    key: 1,
                                    description: "Nothing graded yet"
                                  })) : (openBlock(), createBlock(_component_a_list, {
                                    key: 2,
                                    "data-source": graded.value,
                                    "render-item": renderGraded
                                  }, null, 8, ["data-source"]))
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
                  _push3(ssrRenderComponent(_component_a_card, {
                    title: "📊 All Assignments",
                    bordered: false,
                    class: "mt-4"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_table, {
                          columns,
                          "data-source": filtered.value,
                          loading: loading.value,
                          scroll: { x: 600 },
                          "row-key": "id",
                          "data-test-id": "assignments-table"
                        }, {
                          bodyCell: withCtx(({ column, record }, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              if (column.key === "status") {
                                _push5(ssrRenderComponent(_component_a_tag, {
                                  color: statusColor(record.status)
                                }, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(record.status)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(record.status), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else if (column.key === "due") {
                                _push5(`<!--[-->${ssrInterpolate(format(record.dueDate))}<!--]-->`);
                              } else if (column.key === "grade") {
                                _push5(`<!--[-->`);
                                if (record.grade !== void 0) {
                                  _push5(`<span data-v-18cbcd38${_scopeId4}>${ssrInterpolate(record.grade)}%</span>`);
                                } else {
                                  _push5(`<span class="muted" data-v-18cbcd38${_scopeId4}>—</span>`);
                                }
                                _push5(`<!--]-->`);
                              } else if (column.key === "actions") {
                                _push5(ssrRenderComponent(_component_a_button, {
                                  type: "link",
                                  onClick: ($event) => openDetail(record)
                                }, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`Open`);
                                    } else {
                                      return [
                                        createTextVNode("Open")
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                column.key === "status" ? (openBlock(), createBlock(_component_a_tag, {
                                  key: 0,
                                  color: statusColor(record.status)
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(record.status), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["color"])) : column.key === "due" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                  createTextVNode(toDisplayString(format(record.dueDate)), 1)
                                ], 64)) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                  record.grade !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.grade) + "%", 1)) : (openBlock(), createBlock("span", {
                                    key: 1,
                                    class: "muted"
                                  }, "—"))
                                ], 64)) : column.key === "actions" ? (openBlock(), createBlock(_component_a_button, {
                                  key: 3,
                                  type: "link",
                                  onClick: ($event) => openDetail(record)
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Open")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_table, {
                            columns,
                            "data-source": filtered.value,
                            loading: loading.value,
                            scroll: { x: 600 },
                            "row-key": "id",
                            "data-test-id": "assignments-table"
                          }, {
                            bodyCell: withCtx(({ column, record }) => [
                              column.key === "status" ? (openBlock(), createBlock(_component_a_tag, {
                                key: 0,
                                color: statusColor(record.status)
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(record.status), 1)
                                ]),
                                _: 2
                              }, 1032, ["color"])) : column.key === "due" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                createTextVNode(toDisplayString(format(record.dueDate)), 1)
                              ], 64)) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                record.grade !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.grade) + "%", 1)) : (openBlock(), createBlock("span", {
                                  key: 1,
                                  class: "muted"
                                }, "—"))
                              ], 64)) : column.key === "actions" ? (openBlock(), createBlock(_component_a_button, {
                                key: 3,
                                type: "link",
                                onClick: ($event) => openDetail(record)
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Open")
                                ]),
                                _: 1
                              }, 8, ["onClick"])) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }, 8, ["data-source", "loading"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_modal, {
                    open: detailOpen.value,
                    "onUpdate:open": ($event) => detailOpen.value = $event,
                    width: "600",
                    footer: null,
                    title: "Assignment"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (current.value) {
                          _push4(`<div data-v-18cbcd38${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_a_descriptions, {
                            column: 1,
                            bordered: "",
                            size: "small"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_descriptions_item, { label: "Title" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(current.value.title)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(current.value.title), 1)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_descriptions_item, { label: "Course" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(current.value.course)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(current.value.course), 1)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_descriptions_item, { label: "Status" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_tag, {
                                        color: statusColor(current.value.status)
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`${ssrInterpolate(current.value.status)}`);
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(current.value.status), 1)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_a_tag, {
                                          color: statusColor(current.value.status)
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(current.value.status), 1)
                                          ]),
                                          _: 1
                                        }, 8, ["color"])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_descriptions_item, { label: "Due" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(format(current.value.dueDate))}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(format(current.value.dueDate)), 1)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                if (current.value.grade !== void 0) {
                                  _push5(ssrRenderComponent(_component_a_descriptions_item, { label: "Grade" }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_component_a_progress, {
                                          percent: current.value.grade
                                        }, null, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(_component_a_progress, {
                                            percent: current.value.grade
                                          }, null, 8, ["percent"])
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(ssrRenderComponent(_component_a_descriptions_item, { label: "Description" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(current.value.description || "—")}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(current.value.description || "—"), 1)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_descriptions_item, { label: "Title" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(current.value.title), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_descriptions_item, { label: "Course" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(current.value.course), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_descriptions_item, { label: "Status" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_tag, {
                                        color: statusColor(current.value.status)
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(current.value.status), 1)
                                        ]),
                                        _: 1
                                      }, 8, ["color"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_descriptions_item, { label: "Due" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(format(current.value.dueDate)), 1)
                                    ]),
                                    _: 1
                                  }),
                                  current.value.grade !== void 0 ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                    key: 0,
                                    label: "Grade"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_progress, {
                                        percent: current.value.grade
                                      }, null, 8, ["percent"])
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true),
                                  createVNode(_component_a_descriptions_item, { label: "Description" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(current.value.description || "—"), 1)
                                    ]),
                                    _: 1
                                  })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_button, {
                            type: "primary",
                            block: "",
                            class: "mt-3",
                            onClick: ($event) => _ctx.$router.push(`/modules/${current.value.moduleId}/view`)
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` Open Lesson `);
                              } else {
                                return [
                                  createTextVNode(" Open Lesson ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          current.value ? (openBlock(), createBlock("div", { key: 0 }, [
                            createVNode(_component_a_descriptions, {
                              column: 1,
                              bordered: "",
                              size: "small"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_descriptions_item, { label: "Title" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(current.value.title), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions_item, { label: "Course" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(current.value.course), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions_item, { label: "Status" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_tag, {
                                      color: statusColor(current.value.status)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(current.value.status), 1)
                                      ]),
                                      _: 1
                                    }, 8, ["color"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions_item, { label: "Due" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(format(current.value.dueDate)), 1)
                                  ]),
                                  _: 1
                                }),
                                current.value.grade !== void 0 ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                  key: 0,
                                  label: "Grade"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_progress, {
                                      percent: current.value.grade
                                    }, null, 8, ["percent"])
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                createVNode(_component_a_descriptions_item, { label: "Description" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(current.value.description || "—"), 1)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_button, {
                              type: "primary",
                              block: "",
                              class: "mt-3",
                              onClick: ($event) => _ctx.$router.push(`/modules/${current.value.moduleId}/view`)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Open Lesson ")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ])) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode(_component_a_page_header, {
                      class: "page-header",
                      title: "Assignments",
                      "sub-title": "Your coursework & deadlines",
                      "data-test-id": "assignments-header"
                    }, {
                      extra: withCtx(() => [
                        createVNode(_component_a_space, { wrap: "" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_tooltip, { title: "Toggle dark mode" }, {
                              default: withCtx(() => [
                                createVNode(_component_a_button, {
                                  onClick: ($event) => isDark.value = !isDark.value,
                                  "data-test-id": "toggle-dark"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(BulbOutlined))
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "p-4" }, [
                      createVNode(_component_a_breadcrumb, { class: "mb-3" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_breadcrumb_item, { to: "/students" }, {
                            default: withCtx(() => [
                              createTextVNode("Students")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_breadcrumb_item, null, {
                            default: withCtx(() => [
                              createTextVNode("Assignments")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_row, {
                        gutter: [12, 12],
                        class: "mb-3"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_col, {
                            xs: 12,
                            md: 6
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                size: "small",
                                bordered: false
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_statistic, {
                                    title: "Total",
                                    value: all.value.length
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 12,
                            md: 6
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                size: "small",
                                bordered: false
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_statistic, {
                                    title: "Due Soon",
                                    value: dueSoonCount.value,
                                    "value-style": { color: "#faad14" }
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 12,
                            md: 6
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                size: "small",
                                bordered: false
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_statistic, {
                                    title: "Graded",
                                    value: gradedCount.value,
                                    "value-style": { color: "#52c41a" }
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 12,
                            md: 6
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                size: "small",
                                bordered: false
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_statistic, {
                                    title: "Completion Rate",
                                    value: `${completionRate.value}%`
                                  }, null, 8, ["value"])
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
                        bordered: false,
                        class: "mb-4"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_space, { wrap: "" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_input_search, {
                                value: search.value,
                                "onUpdate:value": ($event) => search.value = $event,
                                style: { "width": "240px" },
                                placeholder: "Search assignments",
                                "data-test-id": "search"
                              }, null, 8, ["value", "onUpdate:value"]),
                              createVNode(_component_a_select, {
                                value: statusFilter.value,
                                "onUpdate:value": ($event) => statusFilter.value = $event,
                                placeholder: "Status",
                                style: { "width": "160px" }
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_select_option, { value: "" }, {
                                    default: withCtx(() => [
                                      createTextVNode("All")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_select_option, { value: "assigned" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Assigned")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_select_option, { value: "due" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Due")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_select_option, { value: "graded" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Graded")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["value", "onUpdate:value"]),
                              createVNode(_component_a_select, {
                                value: sortBy.value,
                                "onUpdate:value": ($event) => sortBy.value = $event,
                                style: { "width": "160px" }
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_select_option, { value: "dueDate" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Due Date")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_select_option, { value: "course" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Course")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_select_option, { value: "status" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Status")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_row, { gutter: [12, 12] }, {
                        default: withCtx(() => [
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 12
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                title: "📅 Upcoming",
                                bordered: false
                              }, {
                                default: withCtx(() => [
                                  loading.value ? (openBlock(), createBlock(_component_a_skeleton, {
                                    key: 0,
                                    active: ""
                                  })) : upcoming.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                                    key: 1,
                                    description: "No upcoming assignments"
                                  })) : (openBlock(), createBlock(_component_a_list, {
                                    key: 2,
                                    "data-source": upcoming.value,
                                    "render-item": renderUpcoming
                                  }, null, 8, ["data-source"]))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 12
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                title: "✅ Graded",
                                bordered: false
                              }, {
                                default: withCtx(() => [
                                  loading.value ? (openBlock(), createBlock(_component_a_skeleton, {
                                    key: 0,
                                    active: ""
                                  })) : graded.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                                    key: 1,
                                    description: "Nothing graded yet"
                                  })) : (openBlock(), createBlock(_component_a_list, {
                                    key: 2,
                                    "data-source": graded.value,
                                    "render-item": renderGraded
                                  }, null, 8, ["data-source"]))
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
                        title: "📊 All Assignments",
                        bordered: false,
                        class: "mt-4"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_table, {
                            columns,
                            "data-source": filtered.value,
                            loading: loading.value,
                            scroll: { x: 600 },
                            "row-key": "id",
                            "data-test-id": "assignments-table"
                          }, {
                            bodyCell: withCtx(({ column, record }) => [
                              column.key === "status" ? (openBlock(), createBlock(_component_a_tag, {
                                key: 0,
                                color: statusColor(record.status)
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(record.status), 1)
                                ]),
                                _: 2
                              }, 1032, ["color"])) : column.key === "due" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                createTextVNode(toDisplayString(format(record.dueDate)), 1)
                              ], 64)) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                record.grade !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.grade) + "%", 1)) : (openBlock(), createBlock("span", {
                                  key: 1,
                                  class: "muted"
                                }, "—"))
                              ], 64)) : column.key === "actions" ? (openBlock(), createBlock(_component_a_button, {
                                key: 3,
                                type: "link",
                                onClick: ($event) => openDetail(record)
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Open")
                                ]),
                                _: 1
                              }, 8, ["onClick"])) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }, 8, ["data-source", "loading"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_modal, {
                        open: detailOpen.value,
                        "onUpdate:open": ($event) => detailOpen.value = $event,
                        width: "600",
                        footer: null,
                        title: "Assignment"
                      }, {
                        default: withCtx(() => [
                          current.value ? (openBlock(), createBlock("div", { key: 0 }, [
                            createVNode(_component_a_descriptions, {
                              column: 1,
                              bordered: "",
                              size: "small"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_descriptions_item, { label: "Title" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(current.value.title), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions_item, { label: "Course" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(current.value.course), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions_item, { label: "Status" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_tag, {
                                      color: statusColor(current.value.status)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(current.value.status), 1)
                                      ]),
                                      _: 1
                                    }, 8, ["color"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions_item, { label: "Due" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(format(current.value.dueDate)), 1)
                                  ]),
                                  _: 1
                                }),
                                current.value.grade !== void 0 ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                  key: 0,
                                  label: "Grade"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_progress, {
                                      percent: current.value.grade
                                    }, null, 8, ["percent"])
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                createVNode(_component_a_descriptions_item, { label: "Description" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(current.value.description || "—"), 1)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_button, {
                              type: "primary",
                              block: "",
                              class: "mt-3",
                              onClick: ($event) => _ctx.$router.push(`/modules/${current.value.moduleId}/view`)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Open Lesson ")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ])) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }, 8, ["open", "onUpdate:open"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_layout, {
                class: ["student-assignments-wrap", isDark.value ? "is-dark" : ""],
                "data-test-id": "assignments-wrap"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_page_header, {
                    class: "page-header",
                    title: "Assignments",
                    "sub-title": "Your coursework & deadlines",
                    "data-test-id": "assignments-header"
                  }, {
                    extra: withCtx(() => [
                      createVNode(_component_a_space, { wrap: "" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_tooltip, { title: "Toggle dark mode" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, {
                                onClick: ($event) => isDark.value = !isDark.value,
                                "data-test-id": "toggle-dark"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(BulbOutlined))
                                ]),
                                _: 1
                              }, 8, ["onClick"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "p-4" }, [
                    createVNode(_component_a_breadcrumb, { class: "mb-3" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_breadcrumb_item, { to: "/students" }, {
                          default: withCtx(() => [
                            createTextVNode("Students")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_breadcrumb_item, null, {
                          default: withCtx(() => [
                            createTextVNode("Assignments")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_row, {
                      gutter: [12, 12],
                      class: "mb-3"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_col, {
                          xs: 12,
                          md: 6
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              size: "small",
                              bordered: false
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_statistic, {
                                  title: "Total",
                                  value: all.value.length
                                }, null, 8, ["value"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_col, {
                          xs: 12,
                          md: 6
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              size: "small",
                              bordered: false
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_statistic, {
                                  title: "Due Soon",
                                  value: dueSoonCount.value,
                                  "value-style": { color: "#faad14" }
                                }, null, 8, ["value"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_col, {
                          xs: 12,
                          md: 6
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              size: "small",
                              bordered: false
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_statistic, {
                                  title: "Graded",
                                  value: gradedCount.value,
                                  "value-style": { color: "#52c41a" }
                                }, null, 8, ["value"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_col, {
                          xs: 12,
                          md: 6
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              size: "small",
                              bordered: false
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_statistic, {
                                  title: "Completion Rate",
                                  value: `${completionRate.value}%`
                                }, null, 8, ["value"])
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
                      bordered: false,
                      class: "mb-4"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_space, { wrap: "" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_input_search, {
                              value: search.value,
                              "onUpdate:value": ($event) => search.value = $event,
                              style: { "width": "240px" },
                              placeholder: "Search assignments",
                              "data-test-id": "search"
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_select, {
                              value: statusFilter.value,
                              "onUpdate:value": ($event) => statusFilter.value = $event,
                              placeholder: "Status",
                              style: { "width": "160px" }
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_select_option, { value: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("All")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_select_option, { value: "assigned" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Assigned")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_select_option, { value: "due" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Due")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_select_option, { value: "graded" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Graded")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_select, {
                              value: sortBy.value,
                              "onUpdate:value": ($event) => sortBy.value = $event,
                              style: { "width": "160px" }
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_select_option, { value: "dueDate" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Due Date")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_select_option, { value: "course" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Course")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_select_option, { value: "status" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Status")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_row, { gutter: [12, 12] }, {
                      default: withCtx(() => [
                        createVNode(_component_a_col, {
                          xs: 24,
                          md: 12
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              title: "📅 Upcoming",
                              bordered: false
                            }, {
                              default: withCtx(() => [
                                loading.value ? (openBlock(), createBlock(_component_a_skeleton, {
                                  key: 0,
                                  active: ""
                                })) : upcoming.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                                  key: 1,
                                  description: "No upcoming assignments"
                                })) : (openBlock(), createBlock(_component_a_list, {
                                  key: 2,
                                  "data-source": upcoming.value,
                                  "render-item": renderUpcoming
                                }, null, 8, ["data-source"]))
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_col, {
                          xs: 24,
                          md: 12
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              title: "✅ Graded",
                              bordered: false
                            }, {
                              default: withCtx(() => [
                                loading.value ? (openBlock(), createBlock(_component_a_skeleton, {
                                  key: 0,
                                  active: ""
                                })) : graded.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                                  key: 1,
                                  description: "Nothing graded yet"
                                })) : (openBlock(), createBlock(_component_a_list, {
                                  key: 2,
                                  "data-source": graded.value,
                                  "render-item": renderGraded
                                }, null, 8, ["data-source"]))
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
                      title: "📊 All Assignments",
                      bordered: false,
                      class: "mt-4"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_table, {
                          columns,
                          "data-source": filtered.value,
                          loading: loading.value,
                          scroll: { x: 600 },
                          "row-key": "id",
                          "data-test-id": "assignments-table"
                        }, {
                          bodyCell: withCtx(({ column, record }) => [
                            column.key === "status" ? (openBlock(), createBlock(_component_a_tag, {
                              key: 0,
                              color: statusColor(record.status)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(record.status), 1)
                              ]),
                              _: 2
                            }, 1032, ["color"])) : column.key === "due" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                              createTextVNode(toDisplayString(format(record.dueDate)), 1)
                            ], 64)) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                              record.grade !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.grade) + "%", 1)) : (openBlock(), createBlock("span", {
                                key: 1,
                                class: "muted"
                              }, "—"))
                            ], 64)) : column.key === "actions" ? (openBlock(), createBlock(_component_a_button, {
                              key: 3,
                              type: "link",
                              onClick: ($event) => openDetail(record)
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Open")
                              ]),
                              _: 1
                            }, 8, ["onClick"])) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }, 8, ["data-source", "loading"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_modal, {
                      open: detailOpen.value,
                      "onUpdate:open": ($event) => detailOpen.value = $event,
                      width: "600",
                      footer: null,
                      title: "Assignment"
                    }, {
                      default: withCtx(() => [
                        current.value ? (openBlock(), createBlock("div", { key: 0 }, [
                          createVNode(_component_a_descriptions, {
                            column: 1,
                            bordered: "",
                            size: "small"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_descriptions_item, { label: "Title" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(current.value.title), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_descriptions_item, { label: "Course" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(current.value.course), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_descriptions_item, { label: "Status" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_tag, {
                                    color: statusColor(current.value.status)
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(current.value.status), 1)
                                    ]),
                                    _: 1
                                  }, 8, ["color"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_descriptions_item, { label: "Due" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(format(current.value.dueDate)), 1)
                                ]),
                                _: 1
                              }),
                              current.value.grade !== void 0 ? (openBlock(), createBlock(_component_a_descriptions_item, {
                                key: 0,
                                label: "Grade"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_progress, {
                                    percent: current.value.grade
                                  }, null, 8, ["percent"])
                                ]),
                                _: 1
                              })) : createCommentVNode("", true),
                              createVNode(_component_a_descriptions_item, { label: "Description" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(current.value.description || "—"), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, {
                            type: "primary",
                            block: "",
                            class: "mt-3",
                            onClick: ($event) => _ctx.$router.push(`/modules/${current.value.moduleId}/view`)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Open Lesson ")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])) : createCommentVNode("", true)
                      ]),
                      _: 1
                    }, 8, ["open", "onUpdate:open"])
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/students-internal/nuxt/pages/assignments/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-18cbcd38"]]);

export { index as default };
//# sourceMappingURL=index-_Dj2b4Qc.mjs.map
