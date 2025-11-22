import { mergeProps, defineComponent, resolveComponent, withCtx, createTextVNode, createVNode, ref, resolveDynamicComponent, toDisplayString, createBlock, openBlock, createCommentVNode, Fragment, renderList, unref, h, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderVNode, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import { BookOutlined, UserOutlined, TeamOutlined, StarOutlined, RightOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, FacebookFilled, TwitterOutlined, LinkedinFilled, InstagramFilled } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { _ as __nuxt_component_0 } from './nuxt-link-DQJ00LSY.mjs';
import { H as Header } from './Header-DscPRdFw.mjs';
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
import '@apollo/client/core/index.js';
import '@apollo/client/link/context/index.js';
import '@vue/apollo-composable';
import './useAuth-B8D9e8en.mjs';
import './useCart-7pxN526Z.mjs';
import 'ant-design-vue';

const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_typography_paragraph = resolveComponent("a-typography-paragraph");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_card = resolveComponent("a-card");
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "hero-section" }, _attrs))} data-v-6a93bc1b>`);
      _push(ssrRenderComponent(_component_a_row, {
        class: "hero-inner",
        align: "middle",
        justify: "space-between"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_col, {
              xs: 24,
              md: 12,
              class: "hero-content"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_typography_title, {
                    level: 1,
                    class: "hero-title"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Learn Without Limits `);
                      } else {
                        return [
                          createTextVNode(" Learn Without Limits ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_typography_paragraph, { class: "hero-subtitle" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Explore thousands of courses and grow your skills with Byway’s world-class educators. `);
                      } else {
                        return [
                          createTextVNode(" Explore thousands of courses and grow your skills with Byway’s world-class educators. ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_space, {
                    size: 16,
                    class: "hero-actions",
                    wrap: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_button, {
                          type: "primary",
                          size: "large",
                          shape: "round"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Browse Courses `);
                            } else {
                              return [
                                createTextVNode(" Browse Courses ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_button, {
                          size: "large",
                          shape: "round",
                          ghost: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Teach on Byway `);
                            } else {
                              return [
                                createTextVNode(" Teach on Byway ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_button, {
                            type: "primary",
                            size: "large",
                            shape: "round"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Browse Courses ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, {
                            size: "large",
                            shape: "round",
                            ghost: ""
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Teach on Byway ")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_tag, {
                    color: "blue",
                    class: "hero-badge"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`🎓 10,000+ new learners this week`);
                      } else {
                        return [
                          createTextVNode("🎓 10,000+ new learners this week")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_typography_title, {
                      level: 1,
                      class: "hero-title"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Learn Without Limits ")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_typography_paragraph, { class: "hero-subtitle" }, {
                      default: withCtx(() => [
                        createTextVNode(" Explore thousands of courses and grow your skills with Byway’s world-class educators. ")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_space, {
                      size: 16,
                      class: "hero-actions",
                      wrap: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_button, {
                          type: "primary",
                          size: "large",
                          shape: "round"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Browse Courses ")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_button, {
                          size: "large",
                          shape: "round",
                          ghost: ""
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Teach on Byway ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_tag, {
                      color: "blue",
                      class: "hero-badge"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("🎓 10,000+ new learners this week")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_col, {
              xs: 24,
              md: 12,
              class: "hero-illustrations-wrapper"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_card, {
                    hoverable: "",
                    bordered: "false",
                    class: "hero-card"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<img src="https://cdn.dribbble.com/userupload/6789410/file/original-bbde9b8ed35c91211e6e79f6bbfc508b.png" alt="Byway Learning Illustration" class="hero-image" data-v-6a93bc1b${_scopeId3}>`);
                      } else {
                        return [
                          createVNode("img", {
                            src: "https://cdn.dribbble.com/userupload/6789410/file/original-bbde9b8ed35c91211e6e79f6bbfc508b.png",
                            alt: "Byway Learning Illustration",
                            class: "hero-image"
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, {
                      hoverable: "",
                      bordered: "false",
                      class: "hero-card"
                    }, {
                      default: withCtx(() => [
                        createVNode("img", {
                          src: "https://cdn.dribbble.com/userupload/6789410/file/original-bbde9b8ed35c91211e6e79f6bbfc508b.png",
                          alt: "Byway Learning Illustration",
                          class: "hero-image"
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
              createVNode(_component_a_col, {
                xs: 24,
                md: 12,
                class: "hero-content"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_typography_title, {
                    level: 1,
                    class: "hero-title"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Learn Without Limits ")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_typography_paragraph, { class: "hero-subtitle" }, {
                    default: withCtx(() => [
                      createTextVNode(" Explore thousands of courses and grow your skills with Byway’s world-class educators. ")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_space, {
                    size: 16,
                    class: "hero-actions",
                    wrap: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_button, {
                        type: "primary",
                        size: "large",
                        shape: "round"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Browse Courses ")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_button, {
                        size: "large",
                        shape: "round",
                        ghost: ""
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Teach on Byway ")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_tag, {
                    color: "blue",
                    class: "hero-badge"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("🎓 10,000+ new learners this week")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_a_col, {
                xs: 24,
                md: 12,
                class: "hero-illustrations-wrapper"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_card, {
                    hoverable: "",
                    bordered: "false",
                    class: "hero-card"
                  }, {
                    default: withCtx(() => [
                      createVNode("img", {
                        src: "https://cdn.dribbble.com/userupload/6789410/file/original-bbde9b8ed35c91211e6e79f6bbfc508b.png",
                        alt: "Byway Learning Illustration",
                        class: "hero-image"
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
      _push(`</section>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/homepage/nuxt/components/HeroSection/index.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const HeroSection = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-6a93bc1b"]]);
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const stats = [
      { icon: BookOutlined, value: 250, suffix: "+", label: "Courses by our best mentors" },
      { icon: UserOutlined, value: 1e3, suffix: "+", label: "Students enrolled" },
      { icon: TeamOutlined, value: 15, suffix: "+", label: "Professional mentors" },
      { icon: StarOutlined, value: 2400, suffix: "+", label: "Positive reviews" }
    ];
    const windowWidth = ref(1200);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_statistic = resolveComponent("a-statistic");
      const _component_a_typography_text = resolveComponent("a-typography-text");
      const _component_a_divider = resolveComponent("a-divider");
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "stats-section" }, _attrs))} data-v-23f6f1ec>`);
      _push(ssrRenderComponent(_component_a_row, {
        justify: "center",
        align: "middle",
        gutter: [48, 48],
        class: "stats-row"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(stats, (item, index) => {
              _push2(ssrRenderComponent(_component_a_col, {
                key: index,
                xs: 24,
                sm: 12,
                md: 6,
                class: "stat-item"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_card, {
                      hoverable: true,
                      bordered: "false",
                      class: "stat-card"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_space, {
                            direction: "vertical",
                            align: "center",
                            size: "small"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                ssrRenderVNode(_push5, createVNode(resolveDynamicComponent(item.icon), { class: "stat-icon" }, null), _parent5, _scopeId4);
                                _push5(ssrRenderComponent(_component_a_statistic, {
                                  value: item.value,
                                  precision: 0,
                                  suffix: item.suffix,
                                  "value-style": { color: "#1677ff", fontWeight: 600 }
                                }, null, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_typography_text, {
                                  type: "secondary",
                                  class: "stat-label"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(item.label)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(item.label), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "stat-icon" })),
                                  createVNode(_component_a_statistic, {
                                    value: item.value,
                                    precision: 0,
                                    suffix: item.suffix,
                                    "value-style": { color: "#1677ff", fontWeight: 600 }
                                  }, null, 8, ["value", "suffix"]),
                                  createVNode(_component_a_typography_text, {
                                    type: "secondary",
                                    class: "stat-label"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(item.label), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_space, {
                              direction: "vertical",
                              align: "center",
                              size: "small"
                            }, {
                              default: withCtx(() => [
                                (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "stat-icon" })),
                                createVNode(_component_a_statistic, {
                                  value: item.value,
                                  precision: 0,
                                  suffix: item.suffix,
                                  "value-style": { color: "#1677ff", fontWeight: 600 }
                                }, null, 8, ["value", "suffix"]),
                                createVNode(_component_a_typography_text, {
                                  type: "secondary",
                                  class: "stat-label"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(item.label), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    if (index < stats.length - 1 && windowWidth.value > 768) {
                      _push3(ssrRenderComponent(_component_a_divider, {
                        type: "vertical",
                        class: "stat-divider"
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      createVNode(_component_a_card, {
                        hoverable: true,
                        bordered: "false",
                        class: "stat-card"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_space, {
                            direction: "vertical",
                            align: "center",
                            size: "small"
                          }, {
                            default: withCtx(() => [
                              (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "stat-icon" })),
                              createVNode(_component_a_statistic, {
                                value: item.value,
                                precision: 0,
                                suffix: item.suffix,
                                "value-style": { color: "#1677ff", fontWeight: 600 }
                              }, null, 8, ["value", "suffix"]),
                              createVNode(_component_a_typography_text, {
                                type: "secondary",
                                class: "stat-label"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(item.label), 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024),
                      index < stats.length - 1 && windowWidth.value > 768 ? (openBlock(), createBlock(_component_a_divider, {
                        key: 0,
                        type: "vertical",
                        class: "stat-divider"
                      })) : createCommentVNode("", true)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(), createBlock(Fragment, null, renderList(stats, (item, index) => {
                return createVNode(_component_a_col, {
                  key: index,
                  xs: 24,
                  sm: 12,
                  md: 6,
                  class: "stat-item"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_a_card, {
                      hoverable: true,
                      bordered: "false",
                      class: "stat-card"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_space, {
                          direction: "vertical",
                          align: "center",
                          size: "small"
                        }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "stat-icon" })),
                            createVNode(_component_a_statistic, {
                              value: item.value,
                              precision: 0,
                              suffix: item.suffix,
                              "value-style": { color: "#1677ff", fontWeight: 600 }
                            }, null, 8, ["value", "suffix"]),
                            createVNode(_component_a_typography_text, {
                              type: "secondary",
                              class: "stat-label"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(item.label), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1024),
                    index < stats.length - 1 && windowWidth.value > 768 ? (openBlock(), createBlock(_component_a_divider, {
                      key: 0,
                      type: "vertical",
                      class: "stat-divider"
                    })) : createCommentVNode("", true)
                  ]),
                  _: 2
                }, 1024);
              }), 64))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/homepage/nuxt/components/StatsSection/index.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const StatsSection = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-23f6f1ec"]]);
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const go = (path) => router.push(path);
    const categories = [
      { title: "Astrology", courses: "11 Courses", icon: "/icons/telescope.svg" },
      { title: "Programming", courses: "15 Courses", icon: "/icons/code-browser.svg" },
      { title: "Business", courses: "8 Courses", icon: "/icons/briefcase.svg" },
      { title: "Physics", courses: "6 Courses", icon: "/icons/atom.svg" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_typography_text = resolveComponent("a-typography-text");
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "top-categories" }, _attrs))} data-v-36176191><div class="top-categories-header" data-v-36176191>`);
      _push(ssrRenderComponent(_component_a_typography_title, {
        level: 3,
        class: "section-title"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Top Categories`);
          } else {
            return [
              createTextVNode("Top Categories")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_button, {
        type: "link",
        size: "large",
        class: "view-all-btn",
        onClick: ($event) => go("/categories")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View All `);
            _push2(ssrRenderComponent(unref(RightOutlined), null, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" View All "),
              createVNode(unref(RightOutlined))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_a_row, {
        gutter: [24, 24],
        class: "categories-grid"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(categories, (category, index) => {
              _push2(ssrRenderComponent(_component_a_col, {
                key: index,
                xs: 24,
                sm: 12,
                md: 6
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_card, {
                      hoverable: "",
                      bordered: "",
                      class: "category-card"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="icon-wrapper" data-v-36176191${_scopeId3}><div class="icon-circle" data-v-36176191${_scopeId3}><img${ssrRenderAttr("src", category.icon)}${ssrRenderAttr("alt", category.title)} class="icon-image" data-v-36176191${_scopeId3}></div></div>`);
                          _push4(ssrRenderComponent(_component_a_typography_title, {
                            level: 5,
                            class: "category-title"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(category.title)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(category.title), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_typography_text, {
                            type: "secondary",
                            class: "category-courses"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(category.courses)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(category.courses), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode("div", { class: "icon-wrapper" }, [
                              createVNode("div", { class: "icon-circle" }, [
                                createVNode("img", {
                                  src: category.icon,
                                  alt: category.title,
                                  class: "icon-image"
                                }, null, 8, ["src", "alt"])
                              ])
                            ]),
                            createVNode(_component_a_typography_title, {
                              level: 5,
                              class: "category-title"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(category.title), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_component_a_typography_text, {
                              type: "secondary",
                              class: "category-courses"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(category.courses), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_a_card, {
                        hoverable: "",
                        bordered: "",
                        class: "category-card"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "icon-wrapper" }, [
                            createVNode("div", { class: "icon-circle" }, [
                              createVNode("img", {
                                src: category.icon,
                                alt: category.title,
                                class: "icon-image"
                              }, null, 8, ["src", "alt"])
                            ])
                          ]),
                          createVNode(_component_a_typography_title, {
                            level: 5,
                            class: "category-title"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(category.title), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_component_a_typography_text, {
                            type: "secondary",
                            class: "category-courses"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(category.courses), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(), createBlock(Fragment, null, renderList(categories, (category, index) => {
                return createVNode(_component_a_col, {
                  key: index,
                  xs: 24,
                  sm: 12,
                  md: 6
                }, {
                  default: withCtx(() => [
                    createVNode(_component_a_card, {
                      hoverable: "",
                      bordered: "",
                      class: "category-card"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "icon-wrapper" }, [
                          createVNode("div", { class: "icon-circle" }, [
                            createVNode("img", {
                              src: category.icon,
                              alt: category.title,
                              class: "icon-image"
                            }, null, 8, ["src", "alt"])
                          ])
                        ]),
                        createVNode(_component_a_typography_title, {
                          level: 5,
                          class: "category-title"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(category.title), 1)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(_component_a_typography_text, {
                          type: "secondary",
                          class: "category-courses"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(category.courses), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1024);
              }), 64))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/homepage/nuxt/components/TopCategories/index.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const TopCategories = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-36176191"]]);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const go = (path) => router.push(path);
    const cover = (src) => h("img", {
      alt: "Course image",
      src,
      style: "object-fit: cover; height: 180px; width: 100%; border-radius: 12px 12px 0 0;"
    });
    const courses = [
      {
        title: "Beginner’s Guide to Design",
        author: "Ronald Richards",
        ratingCount: "1200",
        details: "22 Total Hours. 155 Lectures. Beginner",
        price: "$149.9",
        image: "/courses/design.jpg"
      },
      {
        title: "Advanced Web Development",
        author: "Wade Warren",
        ratingCount: "950",
        details: "30 Hours. 210 Lectures. Intermediate",
        price: "$199.9",
        image: "/courses/webdev.jpg"
      },
      {
        title: "Digital Marketing Essentials",
        author: "Theresa Webb",
        ratingCount: "700",
        details: "18 Hours. 120 Lectures. All Levels",
        price: "$99.9",
        image: "/courses/marketing.jpg"
      },
      {
        title: "Photography Masterclass",
        author: "Cody Fisher",
        ratingCount: "1500",
        details: "25 Hours. 140 Lectures. Beginner",
        price: "$129.9",
        image: "/courses/photo.jpg"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_typography_text = resolveComponent("a-typography-text");
      const _component_a_rate = resolveComponent("a-rate");
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "top-courses" }, _attrs))} data-v-685ff2b0><div class="top-courses-header" data-v-685ff2b0>`);
      _push(ssrRenderComponent(_component_a_typography_title, {
        level: 3,
        class: "section-title"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Top Courses`);
          } else {
            return [
              createTextVNode("Top Courses")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_button, {
        type: "link",
        size: "large",
        onClick: ($event) => go("/courses")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View All `);
            _push2(ssrRenderComponent(unref(RightOutlined), null, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" View All "),
              createVNode(unref(RightOutlined))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_a_row, {
        gutter: [24, 24],
        justify: "start",
        class: "courses-grid"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(courses, (course, i) => {
              _push2(ssrRenderComponent(_component_a_col, {
                key: i,
                xs: 24,
                sm: 12,
                md: 12,
                lg: 6
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_card, {
                      hoverable: "",
                      class: "course-card",
                      cover: cover(course.image)
                    }, {
                      actions: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_button, {
                            type: "primary",
                            block: "",
                            shape: "round"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` Enroll Now `);
                              } else {
                                return [
                                  createTextVNode(" Enroll Now ")
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_button, {
                              type: "primary",
                              block: "",
                              shape: "round"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Enroll Now ")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_space, {
                            direction: "vertical",
                            size: "small",
                            class: "course-content"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_typography_title, {
                                  level: 5,
                                  class: "course-title"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(course.title)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(course.title), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_typography_text, {
                                  type: "secondary",
                                  class: "course-author"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(` By ${ssrInterpolate(course.author)}`);
                                    } else {
                                      return [
                                        createTextVNode(" By " + toDisplayString(course.author), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(`<div class="rating" data-v-685ff2b0${_scopeId4}>`);
                                _push5(ssrRenderComponent(_component_a_rate, {
                                  disabled: "",
                                  value: 4.5,
                                  "allow-half": ""
                                }, null, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_typography_text, {
                                  type: "secondary",
                                  class: "rating-text"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(` (${ssrInterpolate(course.ratingCount)} ratings) `);
                                    } else {
                                      return [
                                        createTextVNode(" (" + toDisplayString(course.ratingCount) + " ratings) ", 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(`</div>`);
                                _push5(ssrRenderComponent(_component_a_typography_text, { class: "course-meta" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(course.details)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(course.details), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_typography_text, {
                                  strong: "",
                                  class: "course-price"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(course.price)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(course.price), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_typography_title, {
                                    level: 5,
                                    class: "course-title"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(course.title), 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(_component_a_typography_text, {
                                    type: "secondary",
                                    class: "course-author"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" By " + toDisplayString(course.author), 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode("div", { class: "rating" }, [
                                    createVNode(_component_a_rate, {
                                      disabled: "",
                                      value: 4.5,
                                      "allow-half": ""
                                    }),
                                    createVNode(_component_a_typography_text, {
                                      type: "secondary",
                                      class: "rating-text"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" (" + toDisplayString(course.ratingCount) + " ratings) ", 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  createVNode(_component_a_typography_text, { class: "course-meta" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(course.details), 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(_component_a_typography_text, {
                                    strong: "",
                                    class: "course-price"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(course.price), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_space, {
                              direction: "vertical",
                              size: "small",
                              class: "course-content"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_typography_title, {
                                  level: 5,
                                  class: "course-title"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(course.title), 1)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(_component_a_typography_text, {
                                  type: "secondary",
                                  class: "course-author"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" By " + toDisplayString(course.author), 1)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode("div", { class: "rating" }, [
                                  createVNode(_component_a_rate, {
                                    disabled: "",
                                    value: 4.5,
                                    "allow-half": ""
                                  }),
                                  createVNode(_component_a_typography_text, {
                                    type: "secondary",
                                    class: "rating-text"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" (" + toDisplayString(course.ratingCount) + " ratings) ", 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                createVNode(_component_a_typography_text, { class: "course-meta" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(course.details), 1)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(_component_a_typography_text, {
                                  strong: "",
                                  class: "course-price"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(course.price), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_a_card, {
                        hoverable: "",
                        class: "course-card",
                        cover: cover(course.image)
                      }, {
                        actions: withCtx(() => [
                          createVNode(_component_a_button, {
                            type: "primary",
                            block: "",
                            shape: "round"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Enroll Now ")
                            ]),
                            _: 1
                          })
                        ]),
                        default: withCtx(() => [
                          createVNode(_component_a_space, {
                            direction: "vertical",
                            size: "small",
                            class: "course-content"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_typography_title, {
                                level: 5,
                                class: "course-title"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(course.title), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(_component_a_typography_text, {
                                type: "secondary",
                                class: "course-author"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" By " + toDisplayString(course.author), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode("div", { class: "rating" }, [
                                createVNode(_component_a_rate, {
                                  disabled: "",
                                  value: 4.5,
                                  "allow-half": ""
                                }),
                                createVNode(_component_a_typography_text, {
                                  type: "secondary",
                                  class: "rating-text"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" (" + toDisplayString(course.ratingCount) + " ratings) ", 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              createVNode(_component_a_typography_text, { class: "course-meta" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(course.details), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(_component_a_typography_text, {
                                strong: "",
                                class: "course-price"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(course.price), 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["cover"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(), createBlock(Fragment, null, renderList(courses, (course, i) => {
                return createVNode(_component_a_col, {
                  key: i,
                  xs: 24,
                  sm: 12,
                  md: 12,
                  lg: 6
                }, {
                  default: withCtx(() => [
                    createVNode(_component_a_card, {
                      hoverable: "",
                      class: "course-card",
                      cover: cover(course.image)
                    }, {
                      actions: withCtx(() => [
                        createVNode(_component_a_button, {
                          type: "primary",
                          block: "",
                          shape: "round"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Enroll Now ")
                          ]),
                          _: 1
                        })
                      ]),
                      default: withCtx(() => [
                        createVNode(_component_a_space, {
                          direction: "vertical",
                          size: "small",
                          class: "course-content"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_typography_title, {
                              level: 5,
                              class: "course-title"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(course.title), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_component_a_typography_text, {
                              type: "secondary",
                              class: "course-author"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" By " + toDisplayString(course.author), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode("div", { class: "rating" }, [
                              createVNode(_component_a_rate, {
                                disabled: "",
                                value: 4.5,
                                "allow-half": ""
                              }),
                              createVNode(_component_a_typography_text, {
                                type: "secondary",
                                class: "rating-text"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" (" + toDisplayString(course.ratingCount) + " ratings) ", 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            createVNode(_component_a_typography_text, { class: "course-meta" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(course.details), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_component_a_typography_text, {
                              strong: "",
                              class: "course-price"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(course.price), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1032, ["cover"])
                  ]),
                  _: 2
                }, 1024);
              }), 64))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/homepage/nuxt/components/TopCourses/index.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const TopCourses = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-685ff2b0"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const go = (path) => router.push(path);
    const instructors = [
      {
        name: "Ronald Richards",
        role: "UI/UX Designer",
        rating: "4.9",
        students: "2400",
        image: "/instructors/ronald.jpg"
      },
      {
        name: "Theresa Webb",
        role: "Frontend Developer",
        rating: "4.8",
        students: "1800",
        image: "/instructors/theresa.jpg"
      },
      {
        name: "Cody Fisher",
        role: "Digital Marketer",
        rating: "4.7",
        students: "2100",
        image: "/instructors/cody.jpg"
      },
      {
        name: "Darrell Steward",
        role: "Motion Designer",
        rating: "4.9",
        students: "2600",
        image: "/instructors/darrell.jpg"
      },
      {
        name: "Jane Cooper",
        role: "Photographer",
        rating: "4.8",
        students: "1900",
        image: "/instructors/jane.jpg"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_avatar = resolveComponent("a-avatar");
      const _component_a_typography_text = resolveComponent("a-typography-text");
      const _component_a_divider = resolveComponent("a-divider");
      const _component_a_rate = resolveComponent("a-rate");
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "top-instructors" }, _attrs))} data-v-8e23f062><div class="header" data-v-8e23f062>`);
      _push(ssrRenderComponent(_component_a_typography_title, {
        level: 3,
        class: "title"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Top Instructors`);
          } else {
            return [
              createTextVNode("Top Instructors")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_button, {
        type: "link",
        size: "large",
        onClick: ($event) => go("/instructors")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View All `);
            _push2(ssrRenderComponent(unref(RightOutlined), null, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" View All "),
              createVNode(unref(RightOutlined))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_a_row, {
        gutter: [24, 24],
        justify: "start",
        class: "instructor-grid"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(instructors, (instructor, index) => {
              _push2(ssrRenderComponent(_component_a_col, {
                key: index,
                xs: 24,
                sm: 12,
                md: 8,
                lg: 6
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_card, {
                      hoverable: "",
                      bordered: "",
                      class: "instructor-card"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_space, {
                            direction: "vertical",
                            align: "center",
                            size: "middle",
                            class: "card-inner"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_avatar, {
                                  src: instructor.image,
                                  size: 96,
                                  shape: "circle",
                                  class: "avatar"
                                }, null, _parent5, _scopeId4));
                                _push5(`<div class="info" data-v-8e23f062${_scopeId4}>`);
                                _push5(ssrRenderComponent(_component_a_typography_title, {
                                  level: 5,
                                  class: "name"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(instructor.name)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(instructor.name), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_typography_text, {
                                  type: "secondary",
                                  class: "role"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(instructor.role)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(instructor.role), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(`</div>`);
                                _push5(ssrRenderComponent(_component_a_divider, { class: "divider" }, null, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_space, {
                                  direction: "horizontal",
                                  size: "large",
                                  align: "center",
                                  class: "stats"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_space, {
                                        align: "center",
                                        size: "small"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_rate, {
                                              disabled: "",
                                              value: Number(instructor.rating),
                                              "allow-half": ""
                                            }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_typography_text, { strong: "" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(instructor.rating)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(instructor.rating), 1)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_rate, {
                                                disabled: "",
                                                value: Number(instructor.rating),
                                                "allow-half": ""
                                              }, null, 8, ["value"]),
                                              createVNode(_component_a_typography_text, { strong: "" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(instructor.rating), 1)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_a_typography_text, { type: "secondary" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`${ssrInterpolate(instructor.students)} Students `);
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(instructor.students) + " Students ", 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_a_space, {
                                          align: "center",
                                          size: "small"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_rate, {
                                              disabled: "",
                                              value: Number(instructor.rating),
                                              "allow-half": ""
                                            }, null, 8, ["value"]),
                                            createVNode(_component_a_typography_text, { strong: "" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(instructor.rating), 1)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(_component_a_typography_text, { type: "secondary" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(instructor.students) + " Students ", 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_avatar, {
                                    src: instructor.image,
                                    size: 96,
                                    shape: "circle",
                                    class: "avatar"
                                  }, null, 8, ["src"]),
                                  createVNode("div", { class: "info" }, [
                                    createVNode(_component_a_typography_title, {
                                      level: 5,
                                      class: "name"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(instructor.name), 1)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(_component_a_typography_text, {
                                      type: "secondary",
                                      class: "role"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(instructor.role), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  createVNode(_component_a_divider, { class: "divider" }),
                                  createVNode(_component_a_space, {
                                    direction: "horizontal",
                                    size: "large",
                                    align: "center",
                                    class: "stats"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_space, {
                                        align: "center",
                                        size: "small"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_rate, {
                                            disabled: "",
                                            value: Number(instructor.rating),
                                            "allow-half": ""
                                          }, null, 8, ["value"]),
                                          createVNode(_component_a_typography_text, { strong: "" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(instructor.rating), 1)
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_a_typography_text, { type: "secondary" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(instructor.students) + " Students ", 1)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_space, {
                              direction: "vertical",
                              align: "center",
                              size: "middle",
                              class: "card-inner"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_avatar, {
                                  src: instructor.image,
                                  size: 96,
                                  shape: "circle",
                                  class: "avatar"
                                }, null, 8, ["src"]),
                                createVNode("div", { class: "info" }, [
                                  createVNode(_component_a_typography_title, {
                                    level: 5,
                                    class: "name"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(instructor.name), 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(_component_a_typography_text, {
                                    type: "secondary",
                                    class: "role"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(instructor.role), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                createVNode(_component_a_divider, { class: "divider" }),
                                createVNode(_component_a_space, {
                                  direction: "horizontal",
                                  size: "large",
                                  align: "center",
                                  class: "stats"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_space, {
                                      align: "center",
                                      size: "small"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_rate, {
                                          disabled: "",
                                          value: Number(instructor.rating),
                                          "allow-half": ""
                                        }, null, 8, ["value"]),
                                        createVNode(_component_a_typography_text, { strong: "" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(instructor.rating), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(_component_a_typography_text, { type: "secondary" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(instructor.students) + " Students ", 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_a_card, {
                        hoverable: "",
                        bordered: "",
                        class: "instructor-card"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_space, {
                            direction: "vertical",
                            align: "center",
                            size: "middle",
                            class: "card-inner"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_avatar, {
                                src: instructor.image,
                                size: 96,
                                shape: "circle",
                                class: "avatar"
                              }, null, 8, ["src"]),
                              createVNode("div", { class: "info" }, [
                                createVNode(_component_a_typography_title, {
                                  level: 5,
                                  class: "name"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(instructor.name), 1)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(_component_a_typography_text, {
                                  type: "secondary",
                                  class: "role"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(instructor.role), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              createVNode(_component_a_divider, { class: "divider" }),
                              createVNode(_component_a_space, {
                                direction: "horizontal",
                                size: "large",
                                align: "center",
                                class: "stats"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_space, {
                                    align: "center",
                                    size: "small"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_rate, {
                                        disabled: "",
                                        value: Number(instructor.rating),
                                        "allow-half": ""
                                      }, null, 8, ["value"]),
                                      createVNode(_component_a_typography_text, { strong: "" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(instructor.rating), 1)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(_component_a_typography_text, { type: "secondary" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(instructor.students) + " Students ", 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(), createBlock(Fragment, null, renderList(instructors, (instructor, index) => {
                return createVNode(_component_a_col, {
                  key: index,
                  xs: 24,
                  sm: 12,
                  md: 8,
                  lg: 6
                }, {
                  default: withCtx(() => [
                    createVNode(_component_a_card, {
                      hoverable: "",
                      bordered: "",
                      class: "instructor-card"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_space, {
                          direction: "vertical",
                          align: "center",
                          size: "middle",
                          class: "card-inner"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_avatar, {
                              src: instructor.image,
                              size: 96,
                              shape: "circle",
                              class: "avatar"
                            }, null, 8, ["src"]),
                            createVNode("div", { class: "info" }, [
                              createVNode(_component_a_typography_title, {
                                level: 5,
                                class: "name"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(instructor.name), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(_component_a_typography_text, {
                                type: "secondary",
                                class: "role"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(instructor.role), 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            createVNode(_component_a_divider, { class: "divider" }),
                            createVNode(_component_a_space, {
                              direction: "horizontal",
                              size: "large",
                              align: "center",
                              class: "stats"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_space, {
                                  align: "center",
                                  size: "small"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_rate, {
                                      disabled: "",
                                      value: Number(instructor.rating),
                                      "allow-half": ""
                                    }, null, 8, ["value"]),
                                    createVNode(_component_a_typography_text, { strong: "" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(instructor.rating), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(_component_a_typography_text, { type: "secondary" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(instructor.students) + " Students ", 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1024);
              }), 64))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/homepage/nuxt/components/TopInstructors/index.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const TopInstructors = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-8e23f062"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const go = (link) => router.push(link);
    const blocks = [
      {
        title: "Become an Instructor",
        text: "Instructors from around the world teach millions of students on Byway. We provide the tools and skills to teach what you love.",
        image: "image1.png",
        ctaLabel: "Start Teaching Today",
        ctaLink: "/teach"
      },
      {
        title: "Transform your life through education",
        text: "Learners around the world are launching new careers, advancing in their fields, and enriching their lives through Byway courses.",
        image: "image2.png",
        ctaLabel: "Start Learning",
        ctaLink: "/courses"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_typography_paragraph = resolveComponent("a-typography-paragraph");
      const _component_a_button = resolveComponent("a-button");
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "instructors-section" }, _attrs))} data-v-39fe67b7><!--[-->`);
      ssrRenderList(blocks, (block, index) => {
        _push(ssrRenderComponent(_component_a_row, {
          key: index,
          gutter: [48, 48],
          class: ["instructor-block", { reverse: index % 2 === 0 }],
          align: "middle",
          justify: "space-between"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_a_col, {
                xs: 24,
                md: 12,
                class: "instructor-image"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_card, {
                      hoverable: "",
                      bordered: false,
                      class: "image-card"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<img${ssrRenderAttr("src", block.image)}${ssrRenderAttr("alt", block.title)} class="instructor-img" data-v-39fe67b7${_scopeId3}>`);
                        } else {
                          return [
                            createVNode("img", {
                              src: block.image,
                              alt: block.title,
                              class: "instructor-img"
                            }, null, 8, ["src", "alt"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_a_card, {
                        hoverable: "",
                        bordered: false,
                        class: "image-card"
                      }, {
                        default: withCtx(() => [
                          createVNode("img", {
                            src: block.image,
                            alt: block.title,
                            class: "instructor-img"
                          }, null, 8, ["src", "alt"])
                        ]),
                        _: 2
                      }, 1024)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_a_col, {
                xs: 24,
                md: 12,
                class: "instructor-content"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_space, {
                      direction: "vertical",
                      size: "middle"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_typography_title, { level: 3 }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(block.title)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(block.title), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_typography_paragraph, { class: "instructor-text" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(block.text)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(block.text), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_button, {
                            type: "primary",
                            size: "large",
                            shape: "round",
                            onClick: ($event) => go(block.ctaLink)
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(block.ctaLabel)} `);
                                _push5(ssrRenderComponent(unref(RightOutlined), null, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createTextVNode(toDisplayString(block.ctaLabel) + " ", 1),
                                  createVNode(unref(RightOutlined))
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_typography_title, { level: 3 }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(block.title), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_component_a_typography_paragraph, { class: "instructor-text" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(block.text), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_component_a_button, {
                              type: "primary",
                              size: "large",
                              shape: "round",
                              onClick: ($event) => go(block.ctaLink)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(block.ctaLabel) + " ", 1),
                                createVNode(unref(RightOutlined))
                              ]),
                              _: 2
                            }, 1032, ["onClick"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_a_space, {
                        direction: "vertical",
                        size: "middle"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_typography_title, { level: 3 }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(block.title), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_component_a_typography_paragraph, { class: "instructor-text" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(block.text), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_component_a_button, {
                            type: "primary",
                            size: "large",
                            shape: "round",
                            onClick: ($event) => go(block.ctaLink)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(block.ctaLabel) + " ", 1),
                              createVNode(unref(RightOutlined))
                            ]),
                            _: 2
                          }, 1032, ["onClick"])
                        ]),
                        _: 2
                      }, 1024)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_a_col, {
                  xs: 24,
                  md: 12,
                  class: "instructor-image"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_a_card, {
                      hoverable: "",
                      bordered: false,
                      class: "image-card"
                    }, {
                      default: withCtx(() => [
                        createVNode("img", {
                          src: block.image,
                          alt: block.title,
                          class: "instructor-img"
                        }, null, 8, ["src", "alt"])
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1024),
                createVNode(_component_a_col, {
                  xs: 24,
                  md: 12,
                  class: "instructor-content"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_a_space, {
                      direction: "vertical",
                      size: "middle"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_typography_title, { level: 3 }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(block.title), 1)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(_component_a_typography_paragraph, { class: "instructor-text" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(block.text), 1)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(_component_a_button, {
                          type: "primary",
                          size: "large",
                          shape: "round",
                          onClick: ($event) => go(block.ctaLink)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(block.ctaLabel) + " ", 1),
                            createVNode(unref(RightOutlined))
                          ]),
                          _: 2
                        }, 1032, ["onClick"])
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1024)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/homepage/nuxt/components/InstructorsSection/index.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const InstructorsSection = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-39fe67b7"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FooterSection",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout_footer = resolveComponent("a-layout-footer");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_typography_text = resolveComponent("a-typography-text");
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_menu = resolveComponent("a-menu");
      const _component_a_menu_item = resolveComponent("a-menu-item");
      const _component_NuxtLink = __nuxt_component_0;
      const _component_a_tooltip = resolveComponent("a-tooltip");
      const _component_a_divider = resolveComponent("a-divider");
      const _component_a_back_top = resolveComponent("a-back-top");
      _push(ssrRenderComponent(_component_a_layout_footer, mergeProps({ class: "footer" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="footer-container" data-v-af22407c${_scopeId}>`);
            _push2(ssrRenderComponent(_component_a_row, {
              gutter: [48, 48],
              justify: "start"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 24,
                    sm: 24,
                    md: 12,
                    lg: 8
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_space, {
                          direction: "vertical",
                          size: "middle"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<img src="http://localhost:4000/plugins/homepage/image 4.png" alt="Byway Logo" class="footer-logo" data-v-af22407c${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_typography_text, { class: "footer-text" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` Empowering learners through accessible and engaging online education. Byway is a leading online learning platform dedicated to providing high-quality, flexible, and affordable educational experiences. `);
                                  } else {
                                    return [
                                      createTextVNode(" Empowering learners through accessible and engaging online education. Byway is a leading online learning platform dedicated to providing high-quality, flexible, and affordable educational experiences. ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode("img", {
                                  src: "http://localhost:4000/plugins/homepage/image 4.png",
                                  alt: "Byway Logo",
                                  class: "footer-logo"
                                }),
                                createVNode(_component_a_typography_text, { class: "footer-text" }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Empowering learners through accessible and engaging online education. Byway is a leading online learning platform dedicated to providing high-quality, flexible, and affordable educational experiences. ")
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
                          createVNode(_component_a_space, {
                            direction: "vertical",
                            size: "middle"
                          }, {
                            default: withCtx(() => [
                              createVNode("img", {
                                src: "http://localhost:4000/plugins/homepage/image 4.png",
                                alt: "Byway Logo",
                                class: "footer-logo"
                              }),
                              createVNode(_component_a_typography_text, { class: "footer-text" }, {
                                default: withCtx(() => [
                                  createTextVNode(" Empowering learners through accessible and engaging online education. Byway is a leading online learning platform dedicated to providing high-quality, flexible, and affordable educational experiences. ")
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
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 12,
                    sm: 12,
                    md: 6,
                    lg: 4
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_typography_title, {
                          level: 5,
                          class: "footer-title"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Get Help`);
                            } else {
                              return [
                                createTextVNode("Get Help")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu, {
                          theme: "dark",
                          mode: "vertical",
                          selectable: "false",
                          class: "footer-menu"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_menu_item, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_NuxtLink, { to: "/contact" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Contact Us`);
                                        } else {
                                          return [
                                            createTextVNode("Contact Us")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_NuxtLink, { to: "/contact" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Contact Us")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_menu_item, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_NuxtLink, { to: "/articles" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Latest Articles`);
                                        } else {
                                          return [
                                            createTextVNode("Latest Articles")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_NuxtLink, { to: "/articles" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Latest Articles")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_menu_item, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_NuxtLink, { to: "/faq" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`FAQ`);
                                        } else {
                                          return [
                                            createTextVNode("FAQ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_NuxtLink, { to: "/faq" }, {
                                        default: withCtx(() => [
                                          createTextVNode("FAQ")
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
                                createVNode(_component_a_menu_item, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_NuxtLink, { to: "/contact" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Contact Us")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_menu_item, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_NuxtLink, { to: "/articles" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Latest Articles")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_menu_item, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_NuxtLink, { to: "/faq" }, {
                                      default: withCtx(() => [
                                        createTextVNode("FAQ")
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
                          createVNode(_component_a_typography_title, {
                            level: 5,
                            class: "footer-title"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Get Help")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu, {
                            theme: "dark",
                            mode: "vertical",
                            selectable: "false",
                            class: "footer-menu"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_menu_item, null, {
                                default: withCtx(() => [
                                  createVNode(_component_NuxtLink, { to: "/contact" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Contact Us")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_menu_item, null, {
                                default: withCtx(() => [
                                  createVNode(_component_NuxtLink, { to: "/articles" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Latest Articles")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_menu_item, null, {
                                default: withCtx(() => [
                                  createVNode(_component_NuxtLink, { to: "/faq" }, {
                                    default: withCtx(() => [
                                      createTextVNode("FAQ")
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
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 12,
                    sm: 12,
                    md: 6,
                    lg: 4
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_typography_title, {
                          level: 5,
                          class: "footer-title"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Programs`);
                            } else {
                              return [
                                createTextVNode("Programs")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu, {
                          theme: "dark",
                          mode: "vertical",
                          selectable: "false",
                          class: "footer-menu"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_menu_item, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_NuxtLink, { to: "/programs/design" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Art &amp; Design`);
                                        } else {
                                          return [
                                            createTextVNode("Art & Design")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_NuxtLink, { to: "/programs/design" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Art & Design")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_menu_item, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_NuxtLink, { to: "/programs/business" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Business`);
                                        } else {
                                          return [
                                            createTextVNode("Business")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_NuxtLink, { to: "/programs/business" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Business")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_menu_item, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_NuxtLink, { to: "/programs/it" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`IT &amp; Software`);
                                        } else {
                                          return [
                                            createTextVNode("IT & Software")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_NuxtLink, { to: "/programs/it" }, {
                                        default: withCtx(() => [
                                          createTextVNode("IT & Software")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_menu_item, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_NuxtLink, { to: "/programs/languages" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Languages`);
                                        } else {
                                          return [
                                            createTextVNode("Languages")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_NuxtLink, { to: "/programs/languages" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Languages")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_menu_item, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_NuxtLink, { to: "/programs/programming" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Programming`);
                                        } else {
                                          return [
                                            createTextVNode("Programming")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_NuxtLink, { to: "/programs/programming" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Programming")
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
                                createVNode(_component_a_menu_item, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_NuxtLink, { to: "/programs/design" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Art & Design")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_menu_item, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_NuxtLink, { to: "/programs/business" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Business")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_menu_item, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_NuxtLink, { to: "/programs/it" }, {
                                      default: withCtx(() => [
                                        createTextVNode("IT & Software")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_menu_item, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_NuxtLink, { to: "/programs/languages" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Languages")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_menu_item, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_NuxtLink, { to: "/programs/programming" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Programming")
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
                          createVNode(_component_a_typography_title, {
                            level: 5,
                            class: "footer-title"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Programs")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu, {
                            theme: "dark",
                            mode: "vertical",
                            selectable: "false",
                            class: "footer-menu"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_menu_item, null, {
                                default: withCtx(() => [
                                  createVNode(_component_NuxtLink, { to: "/programs/design" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Art & Design")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_menu_item, null, {
                                default: withCtx(() => [
                                  createVNode(_component_NuxtLink, { to: "/programs/business" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Business")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_menu_item, null, {
                                default: withCtx(() => [
                                  createVNode(_component_NuxtLink, { to: "/programs/it" }, {
                                    default: withCtx(() => [
                                      createTextVNode("IT & Software")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_menu_item, null, {
                                default: withCtx(() => [
                                  createVNode(_component_NuxtLink, { to: "/programs/languages" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Languages")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_menu_item, null, {
                                default: withCtx(() => [
                                  createVNode(_component_NuxtLink, { to: "/programs/programming" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Programming")
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
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 24,
                    sm: 24,
                    md: 12,
                    lg: 8
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_typography_title, {
                          level: 5,
                          class: "footer-title"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Contact Us`);
                            } else {
                              return [
                                createTextVNode("Contact Us")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_space, {
                          direction: "vertical",
                          size: "small",
                          class: "footer-contact"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_space, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(EnvironmentOutlined), null, null, _parent6, _scopeId5));
                                    _push6(` `);
                                    _push6(ssrRenderComponent(_component_a_typography_text, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`123 Main Street, Anytown, CA 12345`);
                                        } else {
                                          return [
                                            createTextVNode("123 Main Street, Anytown, CA 12345")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(EnvironmentOutlined)),
                                      createTextVNode(),
                                      createVNode(_component_a_typography_text, null, {
                                        default: withCtx(() => [
                                          createTextVNode("123 Main Street, Anytown, CA 12345")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_space, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(PhoneOutlined), null, null, _parent6, _scopeId5));
                                    _push6(` `);
                                    _push6(ssrRenderComponent(_component_a_typography_text, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`+(123) 456-7890`);
                                        } else {
                                          return [
                                            createTextVNode("+(123) 456-7890")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(PhoneOutlined)),
                                      createTextVNode(),
                                      createVNode(_component_a_typography_text, null, {
                                        default: withCtx(() => [
                                          createTextVNode("+(123) 456-7890")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_space, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(MailOutlined), null, null, _parent6, _scopeId5));
                                    _push6(` `);
                                    _push6(ssrRenderComponent(_component_a_typography_text, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`bywayedu@webkul.in`);
                                        } else {
                                          return [
                                            createTextVNode("bywayedu@webkul.in")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(MailOutlined)),
                                      createTextVNode(),
                                      createVNode(_component_a_typography_text, null, {
                                        default: withCtx(() => [
                                          createTextVNode("bywayedu@webkul.in")
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
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(unref(EnvironmentOutlined)),
                                    createTextVNode(),
                                    createVNode(_component_a_typography_text, null, {
                                      default: withCtx(() => [
                                        createTextVNode("123 Main Street, Anytown, CA 12345")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(unref(PhoneOutlined)),
                                    createTextVNode(),
                                    createVNode(_component_a_typography_text, null, {
                                      default: withCtx(() => [
                                        createTextVNode("+(123) 456-7890")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(unref(MailOutlined)),
                                    createTextVNode(),
                                    createVNode(_component_a_typography_text, null, {
                                      default: withCtx(() => [
                                        createTextVNode("bywayedu@webkul.in")
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
                        _push4(`<div class="social-icons" data-v-af22407c${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_a_tooltip, { title: "Facebook" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(FacebookFilled), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(FacebookFilled))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_tooltip, { title: "Twitter" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(TwitterOutlined), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(TwitterOutlined))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_tooltip, { title: "LinkedIn" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(LinkedinFilled), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(LinkedinFilled))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_tooltip, { title: "Instagram" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(InstagramFilled), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(InstagramFilled))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode(_component_a_typography_title, {
                            level: 5,
                            class: "footer-title"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Contact Us")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_space, {
                            direction: "vertical",
                            size: "small",
                            class: "footer-contact"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_space, null, {
                                default: withCtx(() => [
                                  createVNode(unref(EnvironmentOutlined)),
                                  createTextVNode(),
                                  createVNode(_component_a_typography_text, null, {
                                    default: withCtx(() => [
                                      createTextVNode("123 Main Street, Anytown, CA 12345")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_space, null, {
                                default: withCtx(() => [
                                  createVNode(unref(PhoneOutlined)),
                                  createTextVNode(),
                                  createVNode(_component_a_typography_text, null, {
                                    default: withCtx(() => [
                                      createTextVNode("+(123) 456-7890")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_space, null, {
                                default: withCtx(() => [
                                  createVNode(unref(MailOutlined)),
                                  createTextVNode(),
                                  createVNode(_component_a_typography_text, null, {
                                    default: withCtx(() => [
                                      createTextVNode("bywayedu@webkul.in")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "social-icons" }, [
                            createVNode(_component_a_tooltip, { title: "Facebook" }, {
                              default: withCtx(() => [
                                createVNode(unref(FacebookFilled))
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_tooltip, { title: "Twitter" }, {
                              default: withCtx(() => [
                                createVNode(unref(TwitterOutlined))
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_tooltip, { title: "LinkedIn" }, {
                              default: withCtx(() => [
                                createVNode(unref(LinkedinFilled))
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_tooltip, { title: "Instagram" }, {
                              default: withCtx(() => [
                                createVNode(unref(InstagramFilled))
                              ]),
                              _: 1
                            })
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_col, {
                      xs: 24,
                      sm: 24,
                      md: 12,
                      lg: 8
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_space, {
                          direction: "vertical",
                          size: "middle"
                        }, {
                          default: withCtx(() => [
                            createVNode("img", {
                              src: "http://localhost:4000/plugins/homepage/image 4.png",
                              alt: "Byway Logo",
                              class: "footer-logo"
                            }),
                            createVNode(_component_a_typography_text, { class: "footer-text" }, {
                              default: withCtx(() => [
                                createTextVNode(" Empowering learners through accessible and engaging online education. Byway is a leading online learning platform dedicated to providing high-quality, flexible, and affordable educational experiences. ")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, {
                      xs: 12,
                      sm: 12,
                      md: 6,
                      lg: 4
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_typography_title, {
                          level: 5,
                          class: "footer-title"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Get Help")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu, {
                          theme: "dark",
                          mode: "vertical",
                          selectable: "false",
                          class: "footer-menu"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/contact" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Contact Us")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/articles" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Latest Articles")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/faq" }, {
                                  default: withCtx(() => [
                                    createTextVNode("FAQ")
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
                    createVNode(_component_a_col, {
                      xs: 12,
                      sm: 12,
                      md: 6,
                      lg: 4
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_typography_title, {
                          level: 5,
                          class: "footer-title"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Programs")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu, {
                          theme: "dark",
                          mode: "vertical",
                          selectable: "false",
                          class: "footer-menu"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/programs/design" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Art & Design")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/programs/business" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Business")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/programs/it" }, {
                                  default: withCtx(() => [
                                    createTextVNode("IT & Software")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/programs/languages" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Languages")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/programs/programming" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Programming")
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
                    createVNode(_component_a_col, {
                      xs: 24,
                      sm: 24,
                      md: 12,
                      lg: 8
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_typography_title, {
                          level: 5,
                          class: "footer-title"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Contact Us")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_space, {
                          direction: "vertical",
                          size: "small",
                          class: "footer-contact"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_space, null, {
                              default: withCtx(() => [
                                createVNode(unref(EnvironmentOutlined)),
                                createTextVNode(),
                                createVNode(_component_a_typography_text, null, {
                                  default: withCtx(() => [
                                    createTextVNode("123 Main Street, Anytown, CA 12345")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_space, null, {
                              default: withCtx(() => [
                                createVNode(unref(PhoneOutlined)),
                                createTextVNode(),
                                createVNode(_component_a_typography_text, null, {
                                  default: withCtx(() => [
                                    createTextVNode("+(123) 456-7890")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_space, null, {
                              default: withCtx(() => [
                                createVNode(unref(MailOutlined)),
                                createTextVNode(),
                                createVNode(_component_a_typography_text, null, {
                                  default: withCtx(() => [
                                    createTextVNode("bywayedu@webkul.in")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "social-icons" }, [
                          createVNode(_component_a_tooltip, { title: "Facebook" }, {
                            default: withCtx(() => [
                              createVNode(unref(FacebookFilled))
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_tooltip, { title: "Twitter" }, {
                            default: withCtx(() => [
                              createVNode(unref(TwitterOutlined))
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_tooltip, { title: "LinkedIn" }, {
                            default: withCtx(() => [
                              createVNode(unref(LinkedinFilled))
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_tooltip, { title: "Instagram" }, {
                            default: withCtx(() => [
                              createVNode(unref(InstagramFilled))
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_divider, { class: "footer-divider" }, null, _parent2, _scopeId));
            _push2(`<div class="footer-bottom" data-v-af22407c${_scopeId}>`);
            _push2(ssrRenderComponent(_component_a_typography_text, { type: "secondary" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Byway Education. All rights reserved. `);
                } else {
                  return [
                    createTextVNode(" © " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " Byway Education. All rights reserved. ", 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_a_back_top, null, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "footer-container" }, [
                createVNode(_component_a_row, {
                  gutter: [48, 48],
                  justify: "start"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_a_col, {
                      xs: 24,
                      sm: 24,
                      md: 12,
                      lg: 8
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_space, {
                          direction: "vertical",
                          size: "middle"
                        }, {
                          default: withCtx(() => [
                            createVNode("img", {
                              src: "http://localhost:4000/plugins/homepage/image 4.png",
                              alt: "Byway Logo",
                              class: "footer-logo"
                            }),
                            createVNode(_component_a_typography_text, { class: "footer-text" }, {
                              default: withCtx(() => [
                                createTextVNode(" Empowering learners through accessible and engaging online education. Byway is a leading online learning platform dedicated to providing high-quality, flexible, and affordable educational experiences. ")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, {
                      xs: 12,
                      sm: 12,
                      md: 6,
                      lg: 4
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_typography_title, {
                          level: 5,
                          class: "footer-title"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Get Help")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu, {
                          theme: "dark",
                          mode: "vertical",
                          selectable: "false",
                          class: "footer-menu"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/contact" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Contact Us")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/articles" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Latest Articles")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/faq" }, {
                                  default: withCtx(() => [
                                    createTextVNode("FAQ")
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
                    createVNode(_component_a_col, {
                      xs: 12,
                      sm: 12,
                      md: 6,
                      lg: 4
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_typography_title, {
                          level: 5,
                          class: "footer-title"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Programs")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu, {
                          theme: "dark",
                          mode: "vertical",
                          selectable: "false",
                          class: "footer-menu"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/programs/design" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Art & Design")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/programs/business" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Business")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/programs/it" }, {
                                  default: withCtx(() => [
                                    createTextVNode("IT & Software")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/programs/languages" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Languages")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/programs/programming" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Programming")
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
                    createVNode(_component_a_col, {
                      xs: 24,
                      sm: 24,
                      md: 12,
                      lg: 8
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_typography_title, {
                          level: 5,
                          class: "footer-title"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Contact Us")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_space, {
                          direction: "vertical",
                          size: "small",
                          class: "footer-contact"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_space, null, {
                              default: withCtx(() => [
                                createVNode(unref(EnvironmentOutlined)),
                                createTextVNode(),
                                createVNode(_component_a_typography_text, null, {
                                  default: withCtx(() => [
                                    createTextVNode("123 Main Street, Anytown, CA 12345")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_space, null, {
                              default: withCtx(() => [
                                createVNode(unref(PhoneOutlined)),
                                createTextVNode(),
                                createVNode(_component_a_typography_text, null, {
                                  default: withCtx(() => [
                                    createTextVNode("+(123) 456-7890")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_space, null, {
                              default: withCtx(() => [
                                createVNode(unref(MailOutlined)),
                                createTextVNode(),
                                createVNode(_component_a_typography_text, null, {
                                  default: withCtx(() => [
                                    createTextVNode("bywayedu@webkul.in")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "social-icons" }, [
                          createVNode(_component_a_tooltip, { title: "Facebook" }, {
                            default: withCtx(() => [
                              createVNode(unref(FacebookFilled))
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_tooltip, { title: "Twitter" }, {
                            default: withCtx(() => [
                              createVNode(unref(TwitterOutlined))
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_tooltip, { title: "LinkedIn" }, {
                            default: withCtx(() => [
                              createVNode(unref(LinkedinFilled))
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_tooltip, { title: "Instagram" }, {
                            default: withCtx(() => [
                              createVNode(unref(InstagramFilled))
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(_component_a_divider, { class: "footer-divider" }),
                createVNode("div", { class: "footer-bottom" }, [
                  createVNode(_component_a_typography_text, { type: "secondary" }, {
                    default: withCtx(() => [
                      createTextVNode(" © " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " Byway Education. All rights reserved. ", 1)
                    ]),
                    _: 1
                  })
                ]),
                createVNode(_component_a_back_top)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/homepage/nuxt/components/FooterSection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const FooterSection = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-af22407c"]]);
const _sfc_main = {
  __name: "homepage",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "homepage" }, _attrs))} data-v-b500a62d>`);
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(`<main class="page-container" data-v-b500a62d>`);
      _push(ssrRenderComponent(HeroSection, null, null, _parent));
      _push(ssrRenderComponent(StatsSection, null, null, _parent));
      _push(ssrRenderComponent(TopCategories, null, null, _parent));
      _push(ssrRenderComponent(TopCourses, null, null, _parent));
      _push(ssrRenderComponent(TopInstructors, null, null, _parent));
      _push(ssrRenderComponent(InstructorsSection, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(FooterSection, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/homepage/nuxt/pages/homepage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const homepage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b500a62d"]]);

export { homepage as default };
//# sourceMappingURL=homepage-CgMYxE5o.mjs.map
