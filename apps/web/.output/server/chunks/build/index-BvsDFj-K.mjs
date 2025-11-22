import { defineComponent, ref, computed, resolveComponent, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, h, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { theme } from 'ant-design-vue';
import { BookOutlined, BulbOutlined } from '@ant-design/icons-vue';
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
    const search = ref("");
    const courseFilter = ref("");
    const rows = ref([]);
    const institution = ref(null);
    const filteredRows = computed(() => {
      let list = rows.value;
      if (search.value) {
        const s = search.value.toLowerCase();
        list = list.filter(
          (r) => r.name.toLowerCase().includes(s) || r.course.toLowerCase().includes(s)
        );
      }
      if (courseFilter.value) {
        list = list.filter((r) => r.course === courseFilter.value);
      }
      return list;
    });
    function toggleDark() {
      isDark.value = !isDark.value;
    }
    const courseList = computed(
      () => [...new Set(rows.value.map((r) => r.course))].sort()
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_config_provider = resolveComponent("a-config-provider");
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_tooltip = resolveComponent("a-tooltip");
      const _component_a_breadcrumb = resolveComponent("a-breadcrumb");
      const _component_a_breadcrumb_item = resolveComponent("a-breadcrumb-item");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_input_search = resolveComponent("a-input-search");
      const _component_a_select = resolveComponent("a-select");
      const _component_a_select_option = resolveComponent("a-select-option");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card_meta = resolveComponent("a-card-meta");
      const _component_a_avatar = resolveComponent("a-avatar");
      const _component_a_badge = resolveComponent("a-badge");
      const _component_a_empty = resolveComponent("a-empty");
      _push(ssrRenderComponent(_component_a_config_provider, mergeProps({
        theme: { algorithm: isDark.value ? unref(theme).darkAlgorithm : unref(theme).defaultAlgorithm }
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_layout, {
              class: ["classrooms-wrap", isDark.value ? "is-dark" : ""],
              "data-test-id": "classrooms-wrap"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_page_header, {
                    class: "page-header",
                    title: "Classrooms",
                    "sub-title": "Your cohorts & active groups"
                  }, {
                    extra: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_space, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_button, {
                                href: "/students/courses",
                                type: "default"
                              }, {
                                icon: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(BookOutlined), null, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(BookOutlined))
                                    ];
                                  }
                                }),
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` My Courses `);
                                  } else {
                                    return [
                                      createTextVNode(" My Courses ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_tooltip, { title: "Toggle dark mode" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_button, {
                                      onClick: toggleDark,
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
                                        onClick: toggleDark,
                                        "data-test-id": "toggle-dark"
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
                            } else {
                              return [
                                createVNode(_component_a_button, {
                                  href: "/students/courses",
                                  type: "default"
                                }, {
                                  icon: withCtx(() => [
                                    createVNode(unref(BookOutlined))
                                  ]),
                                  default: withCtx(() => [
                                    createTextVNode(" My Courses ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_tooltip, { title: "Toggle dark mode" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      onClick: toggleDark,
                                      "data-test-id": "toggle-dark"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(BulbOutlined))
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
                          createVNode(_component_a_space, null, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, {
                                href: "/students/courses",
                                type: "default"
                              }, {
                                icon: withCtx(() => [
                                  createVNode(unref(BookOutlined))
                                ]),
                                default: withCtx(() => [
                                  createTextVNode(" My Courses ")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_tooltip, { title: "Toggle dark mode" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_button, {
                                    onClick: toggleDark,
                                    "data-test-id": "toggle-dark"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(BulbOutlined))
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
                  _push3(`<div class="p-4" data-v-2634b604${_scopeId2}>`);
                  if (institution.value) {
                    _push3(`<div class="institution-banner" data-v-2634b604${_scopeId2}>`);
                    if (institution.value.bannerUrl) {
                      _push3(`<img${ssrRenderAttr("src", institution.value.bannerUrl)} alt="Institution Banner" class="banner-img" data-v-2634b604${_scopeId2}>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<div class="banner-overlay" data-v-2634b604${_scopeId2}><h2 class="inst-name" data-v-2634b604${_scopeId2}>${ssrInterpolate(institution.value.name)}</h2><p class="inst-sub" data-v-2634b604${_scopeId2}>${ssrInterpolate(institution.value.tagline)}</p></div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(_component_a_breadcrumb, { class: "mb-3 mt-3" }, {
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
                              _push5(`Classrooms`);
                            } else {
                              return [
                                createTextVNode("Classrooms")
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
                              createTextVNode("Classrooms")
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
                                placeholder: "Search classrooms...",
                                style: { "width": "240px" },
                                "data-test-id": "search"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_select, {
                                value: courseFilter.value,
                                "onUpdate:value": ($event) => courseFilter.value = $event,
                                placeholder: "Filter by course",
                                "allow-clear": "",
                                style: { "width": "200px" }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<!--[-->`);
                                    ssrRenderList(courseList.value, (c) => {
                                      _push6(ssrRenderComponent(_component_a_select_option, {
                                        key: c,
                                        value: c
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`${ssrInterpolate(c)}`);
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(c), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    });
                                    _push6(`<!--]-->`);
                                  } else {
                                    return [
                                      (openBlock(true), createBlock(Fragment, null, renderList(courseList.value, (c) => {
                                        return openBlock(), createBlock(_component_a_select_option, {
                                          key: c,
                                          value: c
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(c), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["value"]);
                                      }), 128))
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
                                  placeholder: "Search classrooms...",
                                  style: { "width": "240px" },
                                  "data-test-id": "search"
                                }, null, 8, ["value", "onUpdate:value"]),
                                createVNode(_component_a_select, {
                                  value: courseFilter.value,
                                  "onUpdate:value": ($event) => courseFilter.value = $event,
                                  placeholder: "Filter by course",
                                  "allow-clear": "",
                                  style: { "width": "200px" }
                                }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(courseList.value, (c) => {
                                      return openBlock(), createBlock(_component_a_select_option, {
                                        key: c,
                                        value: c
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(c), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["value"]);
                                    }), 128))
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
                                placeholder: "Search classrooms...",
                                style: { "width": "240px" },
                                "data-test-id": "search"
                              }, null, 8, ["value", "onUpdate:value"]),
                              createVNode(_component_a_select, {
                                value: courseFilter.value,
                                "onUpdate:value": ($event) => courseFilter.value = $event,
                                placeholder: "Filter by course",
                                "allow-clear": "",
                                style: { "width": "200px" }
                              }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(courseList.value, (c) => {
                                    return openBlock(), createBlock(_component_a_select_option, {
                                      key: c,
                                      value: c
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(c), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["value"]);
                                  }), 128))
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
                  _push3(ssrRenderComponent(_component_a_row, { gutter: [16, 16] }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(filteredRows.value, (item) => {
                          _push4(ssrRenderComponent(_component_a_col, {
                            key: item.id,
                            xs: 24,
                            sm: 12,
                            md: 8,
                            lg: 6
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_card, {
                                  hoverable: "",
                                  class: "classroom-card",
                                  cover: item.thumbnail ? h("img", { src: item.thumbnail, class: "thumb-img" }) : h("div", { class: "thumb-placeholder" }, "No Image")
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_card_meta, {
                                        title: item.name,
                                        description: item.course
                                      }, {
                                        avatar: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_avatar, { size: "large" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  if (item.avatar) {
                                                    _push8(`<img${ssrRenderAttr("src", item.avatar)} data-v-2634b604${_scopeId7}>`);
                                                  } else {
                                                    _push8(ssrRenderComponent(unref(BookOutlined), null, null, _parent8, _scopeId7));
                                                  }
                                                } else {
                                                  return [
                                                    item.avatar ? (openBlock(), createBlock("img", {
                                                      key: 0,
                                                      src: item.avatar
                                                    }, null, 8, ["src"])) : (openBlock(), createBlock(unref(BookOutlined), { key: 1 }))
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_avatar, { size: "large" }, {
                                                default: withCtx(() => [
                                                  item.avatar ? (openBlock(), createBlock("img", {
                                                    key: 0,
                                                    src: item.avatar
                                                  }, null, 8, ["src"])) : (openBlock(), createBlock(unref(BookOutlined), { key: 1 }))
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                      _push6(`<div class="card-bottom" data-v-2634b604${_scopeId5}>`);
                                      _push6(ssrRenderComponent(_component_a_badge, {
                                        count: item.members,
                                        "show-zero": ""
                                      }, null, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_a_button, {
                                        type: "primary",
                                        size: "small",
                                        class: "ml-2",
                                        href: `/students/classrooms/${item.id}`,
                                        "data-test-id": "open-classroom"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(` Open `);
                                          } else {
                                            return [
                                              createTextVNode(" Open ")
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                      _push6(`</div>`);
                                    } else {
                                      return [
                                        createVNode(_component_a_card_meta, {
                                          title: item.name,
                                          description: item.course
                                        }, {
                                          avatar: withCtx(() => [
                                            createVNode(_component_a_avatar, { size: "large" }, {
                                              default: withCtx(() => [
                                                item.avatar ? (openBlock(), createBlock("img", {
                                                  key: 0,
                                                  src: item.avatar
                                                }, null, 8, ["src"])) : (openBlock(), createBlock(unref(BookOutlined), { key: 1 }))
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1032, ["title", "description"]),
                                        createVNode("div", { class: "card-bottom" }, [
                                          createVNode(_component_a_badge, {
                                            count: item.members,
                                            "show-zero": ""
                                          }, null, 8, ["count"]),
                                          createVNode(_component_a_button, {
                                            type: "primary",
                                            size: "small",
                                            class: "ml-2",
                                            href: `/students/classrooms/${item.id}`,
                                            "data-test-id": "open-classroom"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Open ")
                                            ]),
                                            _: 1
                                          }, 8, ["href"])
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_card, {
                                    hoverable: "",
                                    class: "classroom-card",
                                    cover: item.thumbnail ? h("img", { src: item.thumbnail, class: "thumb-img" }) : h("div", { class: "thumb-placeholder" }, "No Image")
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_card_meta, {
                                        title: item.name,
                                        description: item.course
                                      }, {
                                        avatar: withCtx(() => [
                                          createVNode(_component_a_avatar, { size: "large" }, {
                                            default: withCtx(() => [
                                              item.avatar ? (openBlock(), createBlock("img", {
                                                key: 0,
                                                src: item.avatar
                                              }, null, 8, ["src"])) : (openBlock(), createBlock(unref(BookOutlined), { key: 1 }))
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1032, ["title", "description"]),
                                      createVNode("div", { class: "card-bottom" }, [
                                        createVNode(_component_a_badge, {
                                          count: item.members,
                                          "show-zero": ""
                                        }, null, 8, ["count"]),
                                        createVNode(_component_a_button, {
                                          type: "primary",
                                          size: "small",
                                          class: "ml-2",
                                          href: `/students/classrooms/${item.id}`,
                                          "data-test-id": "open-classroom"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Open ")
                                          ]),
                                          _: 1
                                        }, 8, ["href"])
                                      ])
                                    ]),
                                    _: 2
                                  }, 1032, ["cover"])
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                      } else {
                        return [
                          (openBlock(true), createBlock(Fragment, null, renderList(filteredRows.value, (item) => {
                            return openBlock(), createBlock(_component_a_col, {
                              key: item.id,
                              xs: 24,
                              sm: 12,
                              md: 8,
                              lg: 6
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, {
                                  hoverable: "",
                                  class: "classroom-card",
                                  cover: item.thumbnail ? h("img", { src: item.thumbnail, class: "thumb-img" }) : h("div", { class: "thumb-placeholder" }, "No Image")
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card_meta, {
                                      title: item.name,
                                      description: item.course
                                    }, {
                                      avatar: withCtx(() => [
                                        createVNode(_component_a_avatar, { size: "large" }, {
                                          default: withCtx(() => [
                                            item.avatar ? (openBlock(), createBlock("img", {
                                              key: 0,
                                              src: item.avatar
                                            }, null, 8, ["src"])) : (openBlock(), createBlock(unref(BookOutlined), { key: 1 }))
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1032, ["title", "description"]),
                                    createVNode("div", { class: "card-bottom" }, [
                                      createVNode(_component_a_badge, {
                                        count: item.members,
                                        "show-zero": ""
                                      }, null, 8, ["count"]),
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        size: "small",
                                        class: "ml-2",
                                        href: `/students/classrooms/${item.id}`,
                                        "data-test-id": "open-classroom"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Open ")
                                        ]),
                                        _: 1
                                      }, 8, ["href"])
                                    ])
                                  ]),
                                  _: 2
                                }, 1032, ["cover"])
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (!filteredRows.value.length && !loading.value) {
                    _push3(ssrRenderComponent(_component_a_empty, {
                      description: "No classrooms found",
                      class: "mt-4"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode(_component_a_page_header, {
                      class: "page-header",
                      title: "Classrooms",
                      "sub-title": "Your cohorts & active groups"
                    }, {
                      extra: withCtx(() => [
                        createVNode(_component_a_space, null, {
                          default: withCtx(() => [
                            createVNode(_component_a_button, {
                              href: "/students/courses",
                              type: "default"
                            }, {
                              icon: withCtx(() => [
                                createVNode(unref(BookOutlined))
                              ]),
                              default: withCtx(() => [
                                createTextVNode(" My Courses ")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_tooltip, { title: "Toggle dark mode" }, {
                              default: withCtx(() => [
                                createVNode(_component_a_button, {
                                  onClick: toggleDark,
                                  "data-test-id": "toggle-dark"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(BulbOutlined))
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
                    createVNode("div", { class: "p-4" }, [
                      institution.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "institution-banner"
                      }, [
                        institution.value.bannerUrl ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: institution.value.bannerUrl,
                          alt: "Institution Banner",
                          class: "banner-img"
                        }, null, 8, ["src"])) : createCommentVNode("", true),
                        createVNode("div", { class: "banner-overlay" }, [
                          createVNode("h2", { class: "inst-name" }, toDisplayString(institution.value.name), 1),
                          createVNode("p", { class: "inst-sub" }, toDisplayString(institution.value.tagline), 1)
                        ])
                      ])) : createCommentVNode("", true),
                      createVNode(_component_a_breadcrumb, { class: "mb-3 mt-3" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_breadcrumb_item, { to: "/students" }, {
                            default: withCtx(() => [
                              createTextVNode("Students")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_breadcrumb_item, null, {
                            default: withCtx(() => [
                              createTextVNode("Classrooms")
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
                                placeholder: "Search classrooms...",
                                style: { "width": "240px" },
                                "data-test-id": "search"
                              }, null, 8, ["value", "onUpdate:value"]),
                              createVNode(_component_a_select, {
                                value: courseFilter.value,
                                "onUpdate:value": ($event) => courseFilter.value = $event,
                                placeholder: "Filter by course",
                                "allow-clear": "",
                                style: { "width": "200px" }
                              }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(courseList.value, (c) => {
                                    return openBlock(), createBlock(_component_a_select_option, {
                                      key: c,
                                      value: c
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(c), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["value"]);
                                  }), 128))
                                ]),
                                _: 1
                              }, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_row, { gutter: [16, 16] }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(filteredRows.value, (item) => {
                            return openBlock(), createBlock(_component_a_col, {
                              key: item.id,
                              xs: 24,
                              sm: 12,
                              md: 8,
                              lg: 6
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, {
                                  hoverable: "",
                                  class: "classroom-card",
                                  cover: item.thumbnail ? h("img", { src: item.thumbnail, class: "thumb-img" }) : h("div", { class: "thumb-placeholder" }, "No Image")
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card_meta, {
                                      title: item.name,
                                      description: item.course
                                    }, {
                                      avatar: withCtx(() => [
                                        createVNode(_component_a_avatar, { size: "large" }, {
                                          default: withCtx(() => [
                                            item.avatar ? (openBlock(), createBlock("img", {
                                              key: 0,
                                              src: item.avatar
                                            }, null, 8, ["src"])) : (openBlock(), createBlock(unref(BookOutlined), { key: 1 }))
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1032, ["title", "description"]),
                                    createVNode("div", { class: "card-bottom" }, [
                                      createVNode(_component_a_badge, {
                                        count: item.members,
                                        "show-zero": ""
                                      }, null, 8, ["count"]),
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        size: "small",
                                        class: "ml-2",
                                        href: `/students/classrooms/${item.id}`,
                                        "data-test-id": "open-classroom"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Open ")
                                        ]),
                                        _: 1
                                      }, 8, ["href"])
                                    ])
                                  ]),
                                  _: 2
                                }, 1032, ["cover"])
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ]),
                        _: 1
                      }),
                      !filteredRows.value.length && !loading.value ? (openBlock(), createBlock(_component_a_empty, {
                        key: 1,
                        description: "No classrooms found",
                        class: "mt-4"
                      })) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_layout, {
                class: ["classrooms-wrap", isDark.value ? "is-dark" : ""],
                "data-test-id": "classrooms-wrap"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_page_header, {
                    class: "page-header",
                    title: "Classrooms",
                    "sub-title": "Your cohorts & active groups"
                  }, {
                    extra: withCtx(() => [
                      createVNode(_component_a_space, null, {
                        default: withCtx(() => [
                          createVNode(_component_a_button, {
                            href: "/students/courses",
                            type: "default"
                          }, {
                            icon: withCtx(() => [
                              createVNode(unref(BookOutlined))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" My Courses ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_tooltip, { title: "Toggle dark mode" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, {
                                onClick: toggleDark,
                                "data-test-id": "toggle-dark"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(BulbOutlined))
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
                  createVNode("div", { class: "p-4" }, [
                    institution.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "institution-banner"
                    }, [
                      institution.value.bannerUrl ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: institution.value.bannerUrl,
                        alt: "Institution Banner",
                        class: "banner-img"
                      }, null, 8, ["src"])) : createCommentVNode("", true),
                      createVNode("div", { class: "banner-overlay" }, [
                        createVNode("h2", { class: "inst-name" }, toDisplayString(institution.value.name), 1),
                        createVNode("p", { class: "inst-sub" }, toDisplayString(institution.value.tagline), 1)
                      ])
                    ])) : createCommentVNode("", true),
                    createVNode(_component_a_breadcrumb, { class: "mb-3 mt-3" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_breadcrumb_item, { to: "/students" }, {
                          default: withCtx(() => [
                            createTextVNode("Students")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_breadcrumb_item, null, {
                          default: withCtx(() => [
                            createTextVNode("Classrooms")
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
                              placeholder: "Search classrooms...",
                              style: { "width": "240px" },
                              "data-test-id": "search"
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_select, {
                              value: courseFilter.value,
                              "onUpdate:value": ($event) => courseFilter.value = $event,
                              placeholder: "Filter by course",
                              "allow-clear": "",
                              style: { "width": "200px" }
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(courseList.value, (c) => {
                                  return openBlock(), createBlock(_component_a_select_option, {
                                    key: c,
                                    value: c
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(c), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["value"]);
                                }), 128))
                              ]),
                              _: 1
                            }, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_row, { gutter: [16, 16] }, {
                      default: withCtx(() => [
                        (openBlock(true), createBlock(Fragment, null, renderList(filteredRows.value, (item) => {
                          return openBlock(), createBlock(_component_a_col, {
                            key: item.id,
                            xs: 24,
                            sm: 12,
                            md: 8,
                            lg: 6
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                hoverable: "",
                                class: "classroom-card",
                                cover: item.thumbnail ? h("img", { src: item.thumbnail, class: "thumb-img" }) : h("div", { class: "thumb-placeholder" }, "No Image")
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card_meta, {
                                    title: item.name,
                                    description: item.course
                                  }, {
                                    avatar: withCtx(() => [
                                      createVNode(_component_a_avatar, { size: "large" }, {
                                        default: withCtx(() => [
                                          item.avatar ? (openBlock(), createBlock("img", {
                                            key: 0,
                                            src: item.avatar
                                          }, null, 8, ["src"])) : (openBlock(), createBlock(unref(BookOutlined), { key: 1 }))
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1032, ["title", "description"]),
                                  createVNode("div", { class: "card-bottom" }, [
                                    createVNode(_component_a_badge, {
                                      count: item.members,
                                      "show-zero": ""
                                    }, null, 8, ["count"]),
                                    createVNode(_component_a_button, {
                                      type: "primary",
                                      size: "small",
                                      class: "ml-2",
                                      href: `/students/classrooms/${item.id}`,
                                      "data-test-id": "open-classroom"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Open ")
                                      ]),
                                      _: 1
                                    }, 8, ["href"])
                                  ])
                                ]),
                                _: 2
                              }, 1032, ["cover"])
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ]),
                      _: 1
                    }),
                    !filteredRows.value.length && !loading.value ? (openBlock(), createBlock(_component_a_empty, {
                      key: 1,
                      description: "No classrooms found",
                      class: "mt-4"
                    })) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/students-internal/nuxt/pages/classrooms/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2634b604"]]);

export { index as default };
//# sourceMappingURL=index-BvsDFj-K.mjs.map
