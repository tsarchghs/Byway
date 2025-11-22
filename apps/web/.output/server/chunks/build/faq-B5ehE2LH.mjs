import { defineComponent, ref, computed, resolveComponent, withCtx, createTextVNode, h, unref, toDisplayString, createVNode, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { H as Header } from './Header-DscPRdFw.mjs';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
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
  __name: "faq",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const goContact = () => router.push("/contact");
    const search = ref("");
    const faqs = ref([
      {
        question: "How do I enroll in a course?",
        answer: "Simply visit the course page, click on “Enroll Now,” and follow the checkout steps. You’ll have instant access to your lessons."
      },
      {
        question: "Are the courses self-paced?",
        answer: "Yes, all Byway courses are completely self-paced. You can start, pause, and continue anytime."
      },
      {
        question: "Can I get a refund if I’m not satisfied?",
        answer: "Absolutely! We offer a 7-day refund policy if you’re not happy with your course experience."
      },
      {
        question: "Do I receive a certificate after completion?",
        answer: "Yes, after completing a course, you’ll receive a verified certificate of completion available in your dashboard."
      },
      {
        question: "Can instructors upload their own content?",
        answer: "Yes, verified instructors can publish new courses through the “Teach on Byway” dashboard."
      }
    ]);
    const filteredFaqs = computed(() => {
      if (!search.value) return faqs.value;
      const results = faqs.value.filter(
        (f) => f.question.toLowerCase().includes(search.value.toLowerCase())
      );
      if (!results.length) message.info("No matching FAQs found.");
      return results;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout_content = resolveComponent("a-layout-content");
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_typography_text = resolveComponent("a-typography-text");
      const _component_a_input_search = resolveComponent("a-input-search");
      const _component_a_collapse = resolveComponent("a-collapse");
      const _component_a_collapse_panel = resolveComponent("a-collapse-panel");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_button = resolveComponent("a-button");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(ssrRenderComponent(_component_a_layout_content, { class: "faq-page" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="faq-container" data-v-eb3bd45c${_scopeId}><div class="faq-header" data-v-eb3bd45c${_scopeId}>`);
            _push2(ssrRenderComponent(_component_a_typography_title, { level: 2 }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Frequently Asked Questions`);
                } else {
                  return [
                    createTextVNode("Frequently Asked Questions")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_typography_text, { type: "secondary" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Find answers to the most common questions about Byway’s platform, courses, and instructors. `);
                } else {
                  return [
                    createTextVNode(" Find answers to the most common questions about Byway’s platform, courses, and instructors. ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="faq-search" data-v-eb3bd45c${_scopeId}>`);
            _push2(ssrRenderComponent(_component_a_input_search, {
              value: search.value,
              "onUpdate:value": ($event) => search.value = $event,
              placeholder: "Search questions...",
              "allow-clear": "",
              onSearch: _ctx.onSearch,
              style: { "max-width": "400px" }
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_a_collapse, {
              accordion: "",
              class: "faq-collapse"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(filteredFaqs.value, (faq2, i) => {
                    _push3(ssrRenderComponent(_component_a_collapse_panel, {
                      key: i,
                      header: faq2.question,
                      extra: h(unref(QuestionCircleOutlined))
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_typography_text, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(faq2.answer)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(faq2.answer), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_typography_text, null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(faq2.answer), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(filteredFaqs.value, (faq2, i) => {
                      return openBlock(), createBlock(_component_a_collapse_panel, {
                        key: i,
                        header: faq2.question,
                        extra: h(unref(QuestionCircleOutlined))
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_typography_text, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(faq2.answer), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["header", "extra"]);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_card, { class: "faq-contact" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_space, {
                    direction: "vertical",
                    size: "middle",
                    align: "center"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_typography_title, { level: 4 }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Still have questions?`);
                            } else {
                              return [
                                createTextVNode("Still have questions?")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_typography_text, { type: "secondary" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Our support team is here to help you with anything you need. `);
                            } else {
                              return [
                                createTextVNode(" Our support team is here to help you with anything you need. ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_button, {
                          type: "primary",
                          size: "large",
                          onClick: goContact
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Contact Support `);
                            } else {
                              return [
                                createTextVNode(" Contact Support ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_typography_title, { level: 4 }, {
                            default: withCtx(() => [
                              createTextVNode("Still have questions?")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_typography_text, { type: "secondary" }, {
                            default: withCtx(() => [
                              createTextVNode(" Our support team is here to help you with anything you need. ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, {
                            type: "primary",
                            size: "large",
                            onClick: goContact
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Contact Support ")
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
                    createVNode(_component_a_space, {
                      direction: "vertical",
                      size: "middle",
                      align: "center"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_typography_title, { level: 4 }, {
                          default: withCtx(() => [
                            createTextVNode("Still have questions?")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_typography_text, { type: "secondary" }, {
                          default: withCtx(() => [
                            createTextVNode(" Our support team is here to help you with anything you need. ")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_button, {
                          type: "primary",
                          size: "large",
                          onClick: goContact
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Contact Support ")
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
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "faq-container" }, [
                createVNode("div", { class: "faq-header" }, [
                  createVNode(_component_a_typography_title, { level: 2 }, {
                    default: withCtx(() => [
                      createTextVNode("Frequently Asked Questions")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_typography_text, { type: "secondary" }, {
                    default: withCtx(() => [
                      createTextVNode(" Find answers to the most common questions about Byway’s platform, courses, and instructors. ")
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "faq-search" }, [
                  createVNode(_component_a_input_search, {
                    value: search.value,
                    "onUpdate:value": ($event) => search.value = $event,
                    placeholder: "Search questions...",
                    "allow-clear": "",
                    onSearch: _ctx.onSearch,
                    style: { "max-width": "400px" }
                  }, null, 8, ["value", "onUpdate:value", "onSearch"])
                ]),
                createVNode(_component_a_collapse, {
                  accordion: "",
                  class: "faq-collapse"
                }, {
                  default: withCtx(() => [
                    (openBlock(true), createBlock(Fragment, null, renderList(filteredFaqs.value, (faq2, i) => {
                      return openBlock(), createBlock(_component_a_collapse_panel, {
                        key: i,
                        header: faq2.question,
                        extra: h(unref(QuestionCircleOutlined))
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_typography_text, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(faq2.answer), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["header", "extra"]);
                    }), 128))
                  ]),
                  _: 1
                }),
                createVNode(_component_a_card, { class: "faq-contact" }, {
                  default: withCtx(() => [
                    createVNode(_component_a_space, {
                      direction: "vertical",
                      size: "middle",
                      align: "center"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_typography_title, { level: 4 }, {
                          default: withCtx(() => [
                            createTextVNode("Still have questions?")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_typography_text, { type: "secondary" }, {
                          default: withCtx(() => [
                            createTextVNode(" Our support team is here to help you with anything you need. ")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_button, {
                          type: "primary",
                          size: "large",
                          onClick: goContact
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Contact Support ")
                          ]),
                          _: 1
                        })
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
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/footer-links-pages/nuxt/pages/faq.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const faq = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-eb3bd45c"]]);

export { faq as default };
//# sourceMappingURL=faq-B5ehE2LH.mjs.map
