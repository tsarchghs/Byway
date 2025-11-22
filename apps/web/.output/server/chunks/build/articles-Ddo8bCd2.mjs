import { defineComponent, ref, computed, resolveComponent, withCtx, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, createVNode, h, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { H as Header } from './Header-DscPRdFw.mjs';
import { message } from 'ant-design-vue';
import { FileTextOutlined } from '@ant-design/icons-vue';
import { _ as _export_sfc } from './server.mjs';
import './nuxt-link-DQJ00LSY.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-router';
import './useAuth-B8D9e8en.mjs';
import './useCart-7pxN526Z.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import '@apollo/client/core/index.js';
import '@apollo/client/link/context/index.js';
import '@vue/apollo-composable';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "articles",
  __ssrInlineRender: true,
  setup(__props) {
    const search = ref("");
    const selectedCategory = ref(null);
    const page = ref(1);
    const categories = ["Business", "Design", "Programming", "Marketing", "AI", "Education"];
    const articles2 = ref([
      {
        title: "The Future of Online Learning",
        excerpt: "Discover how AI and adaptive systems are transforming digital education...",
        image: "/articles/ai-learning.jpg",
        author: { name: "Theresa Webb", avatar: "/instructors/theresa.jpg" },
        category: "Education",
        date: "2025-10-10"
      },
      {
        title: "Mastering Frontend in 2025",
        excerpt: "React, Vue, and the evolution of design systems across modern stacks...",
        image: "/articles/frontend.jpg",
        author: { name: "Wade Warren", avatar: "/instructors/ronald.jpg" },
        category: "Programming",
        date: "2025-09-12"
      },
      {
        title: "10 Ways to Boost Your Business with Design Thinking",
        excerpt: "Applying creative problem-solving in your business model...",
        image: "/articles/business-design.jpg",
        author: { name: "Ronald Richards", avatar: "/instructors/ronald.jpg" },
        category: "Business",
        date: "2025-09-22"
      }
    ]);
    const filteredArticles = computed(() => {
      let filtered = articles2.value;
      if (selectedCategory.value)
        filtered = filtered.filter((a) => a.category === selectedCategory.value);
      if (search.value)
        filtered = filtered.filter(
          (a) => a.title.toLowerCase().includes(search.value.toLowerCase())
        );
      if (!filtered.length) message.info("No articles found.");
      return filtered;
    });
    const coverTemplate = (article) => article.image ? h("img", { alt: article.title, src: article.image, class: "card-cover" }) : h(FileTextOutlined);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout_content = resolveComponent("a-layout-content");
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_input_search = resolveComponent("a-input-search");
      const _component_a_select = resolveComponent("a-select");
      const _component_a_select_option = resolveComponent("a-select-option");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_card_meta = resolveComponent("a-card-meta");
      const _component_a_avatar = resolveComponent("a-avatar");
      const _component_a_typography_text = resolveComponent("a-typography-text");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_pagination = resolveComponent("a-pagination");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(ssrRenderComponent(_component_a_layout_content, { class: "articles-page" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="articles-container" data-v-d727b1f7${_scopeId}><div class="header" data-v-d727b1f7${_scopeId}>`);
            _push2(ssrRenderComponent(_component_a_typography_title, { level: 2 }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Latest Articles`);
                } else {
                  return [
                    createTextVNode("Latest Articles")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_space, {
              size: "middle",
              wrap: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_input_search, {
                    value: search.value,
                    "onUpdate:value": ($event) => search.value = $event,
                    placeholder: "Search articles",
                    "allow-clear": "",
                    style: { "width": "280px" }
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_select, {
                    value: selectedCategory.value,
                    "onUpdate:value": ($event) => selectedCategory.value = $event,
                    placeholder: "Filter by category",
                    style: { "width": "180px" },
                    "allow-clear": ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(categories, (cat) => {
                          _push4(ssrRenderComponent(_component_a_select_option, {
                            key: cat,
                            value: cat
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(cat)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(cat), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                      } else {
                        return [
                          (openBlock(), createBlock(Fragment, null, renderList(categories, (cat) => {
                            return createVNode(_component_a_select_option, {
                              key: cat,
                              value: cat
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(cat), 1)
                              ]),
                              _: 2
                            }, 1032, ["value"]);
                          }), 64))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_input_search, {
                      value: search.value,
                      "onUpdate:value": ($event) => search.value = $event,
                      placeholder: "Search articles",
                      "allow-clear": "",
                      style: { "width": "280px" }
                    }, null, 8, ["value", "onUpdate:value"]),
                    createVNode(_component_a_select, {
                      value: selectedCategory.value,
                      "onUpdate:value": ($event) => selectedCategory.value = $event,
                      placeholder: "Filter by category",
                      style: { "width": "180px" },
                      "allow-clear": ""
                    }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock(Fragment, null, renderList(categories, (cat) => {
                          return createVNode(_component_a_select_option, {
                            key: cat,
                            value: cat
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(cat), 1)
                            ]),
                            _: 2
                          }, 1032, ["value"]);
                        }), 64))
                      ]),
                      _: 1
                    }, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_a_row, {
              gutter: [32, 32],
              justify: "start",
              class: "articles-grid"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(filteredArticles.value, (article, index) => {
                    _push3(ssrRenderComponent(_component_a_col, {
                      key: index,
                      xs: 24,
                      sm: 12,
                      md: 8,
                      lg: 6
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_card, {
                            hoverable: "",
                            cover: coverTemplate(article),
                            class: "article-card"
                          }, {
                            actions: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_space, { size: "small" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_avatar, {
                                        src: article.author.avatar,
                                        size: "small"
                                      }, null, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_a_typography_text, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`${ssrInterpolate(article.author.name)}`);
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(article.author.name), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_a_avatar, {
                                          src: article.author.avatar,
                                          size: "small"
                                        }, null, 8, ["src"]),
                                        createVNode(_component_a_typography_text, null, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(article.author.name), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_tag, { color: "blue" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(article.category)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(article.category), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_space, { size: "small" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_avatar, {
                                        src: article.author.avatar,
                                        size: "small"
                                      }, null, 8, ["src"]),
                                      createVNode(_component_a_typography_text, null, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(article.author.name), 1)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(_component_a_tag, { color: "blue" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(article.category), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }
                            }),
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_card_meta, {
                                  title: article.title,
                                  description: article.excerpt
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_card_meta, {
                                    title: article.title,
                                    description: article.excerpt
                                  }, null, 8, ["title", "description"])
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_card, {
                              hoverable: "",
                              cover: coverTemplate(article),
                              class: "article-card"
                            }, {
                              actions: withCtx(() => [
                                createVNode(_component_a_space, { size: "small" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_avatar, {
                                      src: article.author.avatar,
                                      size: "small"
                                    }, null, 8, ["src"]),
                                    createVNode(_component_a_typography_text, null, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(article.author.name), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(_component_a_tag, { color: "blue" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(article.category), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              default: withCtx(() => [
                                createVNode(_component_a_card_meta, {
                                  title: article.title,
                                  description: article.excerpt
                                }, null, 8, ["title", "description"])
                              ]),
                              _: 2
                            }, 1032, ["cover"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(filteredArticles.value, (article, index) => {
                      return openBlock(), createBlock(_component_a_col, {
                        key: index,
                        xs: 24,
                        sm: 12,
                        md: 8,
                        lg: 6
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_card, {
                            hoverable: "",
                            cover: coverTemplate(article),
                            class: "article-card"
                          }, {
                            actions: withCtx(() => [
                              createVNode(_component_a_space, { size: "small" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_avatar, {
                                    src: article.author.avatar,
                                    size: "small"
                                  }, null, 8, ["src"]),
                                  createVNode(_component_a_typography_text, null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(article.author.name), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(_component_a_tag, { color: "blue" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(article.category), 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            default: withCtx(() => [
                              createVNode(_component_a_card_meta, {
                                title: article.title,
                                description: article.excerpt
                              }, null, 8, ["title", "description"])
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
            }, _parent2, _scopeId));
            _push2(`<div class="pagination-container" data-v-d727b1f7${_scopeId}>`);
            _push2(ssrRenderComponent(_component_a_pagination, {
              current: page.value,
              "onUpdate:current": ($event) => page.value = $event,
              "page-size": 8,
              total: filteredArticles.value.length,
              "show-less-items": ""
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "articles-container" }, [
                createVNode("div", { class: "header" }, [
                  createVNode(_component_a_typography_title, { level: 2 }, {
                    default: withCtx(() => [
                      createTextVNode("Latest Articles")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_space, {
                    size: "middle",
                    wrap: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input_search, {
                        value: search.value,
                        "onUpdate:value": ($event) => search.value = $event,
                        placeholder: "Search articles",
                        "allow-clear": "",
                        style: { "width": "280px" }
                      }, null, 8, ["value", "onUpdate:value"]),
                      createVNode(_component_a_select, {
                        value: selectedCategory.value,
                        "onUpdate:value": ($event) => selectedCategory.value = $event,
                        placeholder: "Filter by category",
                        style: { "width": "180px" },
                        "allow-clear": ""
                      }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock(Fragment, null, renderList(categories, (cat) => {
                            return createVNode(_component_a_select_option, {
                              key: cat,
                              value: cat
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(cat), 1)
                              ]),
                              _: 2
                            }, 1032, ["value"]);
                          }), 64))
                        ]),
                        _: 1
                      }, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  })
                ]),
                createVNode(_component_a_row, {
                  gutter: [32, 32],
                  justify: "start",
                  class: "articles-grid"
                }, {
                  default: withCtx(() => [
                    (openBlock(true), createBlock(Fragment, null, renderList(filteredArticles.value, (article, index) => {
                      return openBlock(), createBlock(_component_a_col, {
                        key: index,
                        xs: 24,
                        sm: 12,
                        md: 8,
                        lg: 6
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_card, {
                            hoverable: "",
                            cover: coverTemplate(article),
                            class: "article-card"
                          }, {
                            actions: withCtx(() => [
                              createVNode(_component_a_space, { size: "small" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_avatar, {
                                    src: article.author.avatar,
                                    size: "small"
                                  }, null, 8, ["src"]),
                                  createVNode(_component_a_typography_text, null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(article.author.name), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(_component_a_tag, { color: "blue" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(article.category), 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            default: withCtx(() => [
                              createVNode(_component_a_card_meta, {
                                title: article.title,
                                description: article.excerpt
                              }, null, 8, ["title", "description"])
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
                createVNode("div", { class: "pagination-container" }, [
                  createVNode(_component_a_pagination, {
                    current: page.value,
                    "onUpdate:current": ($event) => page.value = $event,
                    "page-size": 8,
                    total: filteredArticles.value.length,
                    "show-less-items": ""
                  }, null, 8, ["current", "onUpdate:current", "total"])
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/articles/nuxt/pages/articles.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const articles = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d727b1f7"]]);

export { articles as default };
//# sourceMappingURL=articles-Ddo8bCd2.mjs.map
