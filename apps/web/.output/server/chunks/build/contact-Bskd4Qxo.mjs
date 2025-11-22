import { defineComponent, reactive, resolveComponent, withCtx, createTextVNode, createVNode, unref, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { H as Header } from './Header-DscPRdFw.mjs';
import { EnvironmentOutlined, PhoneOutlined, MailOutlined, FacebookFilled, TwitterOutlined, LinkedinFilled, InstagramFilled } from '@ant-design/icons-vue';
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
  __name: "contact",
  __ssrInlineRender: true,
  setup(__props) {
    const form = reactive({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    const rules = {
      name: [{ required: true, message: "Please enter your name", trigger: "blur" }],
      email: [{ required: true, message: "Please enter your email", trigger: "blur" }],
      message: [{ required: true, message: "Please enter a message", trigger: "blur" }]
    };
    const handleSubmit = () => {
      message.success("Thank you! Your message has been sent.");
      Object.assign(form, { name: "", email: "", subject: "", message: "" });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout_content = resolveComponent("a-layout-content");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_typography_text = resolveComponent("a-typography-text");
      const _component_a_form = resolveComponent("a-form");
      const _component_a_form_item = resolveComponent("a-form-item");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_textarea = resolveComponent("a-textarea");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_divider = resolveComponent("a-divider");
      const _component_a_tooltip = resolveComponent("a-tooltip");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(ssrRenderComponent(_component_a_layout_content, { class: "contact-page" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="contact-container" data-v-5122158d${_scopeId}>`);
            _push2(ssrRenderComponent(_component_a_row, {
              gutter: [48, 48],
              align: "top",
              justify: "center"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 24,
                    sm: 24,
                    md: 14,
                    lg: 12
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_card, {
                          bordered: "",
                          hoverable: "",
                          class: "contact-card"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_typography_title, {
                                level: 3,
                                class: "form-title"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Get in Touch`);
                                  } else {
                                    return [
                                      createTextVNode("Get in Touch")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_typography_text, { type: "secondary" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` Have questions or feedback? We&#39;d love to hear from you. Fill out the form below. `);
                                  } else {
                                    return [
                                      createTextVNode(" Have questions or feedback? We'd love to hear from you. Fill out the form below. ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_form, {
                                model: form,
                                rules,
                                layout: "vertical",
                                onFinish: handleSubmit,
                                class: "contact-form"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_form_item, {
                                      label: "Name",
                                      name: "name",
                                      required: ""
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_input, {
                                            value: form.name,
                                            "onUpdate:value": ($event) => form.name = $event,
                                            placeholder: "Your full name"
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_input, {
                                              value: form.name,
                                              "onUpdate:value": ($event) => form.name = $event,
                                              placeholder: "Your full name"
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_form_item, {
                                      label: "Email",
                                      name: "email",
                                      required: ""
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_input, {
                                            value: form.email,
                                            "onUpdate:value": ($event) => form.email = $event,
                                            type: "email",
                                            placeholder: "Your email address"
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_input, {
                                              value: form.email,
                                              "onUpdate:value": ($event) => form.email = $event,
                                              type: "email",
                                              placeholder: "Your email address"
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_form_item, {
                                      label: "Subject",
                                      name: "subject"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_input, {
                                            value: form.subject,
                                            "onUpdate:value": ($event) => form.subject = $event,
                                            placeholder: "Subject"
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_input, {
                                              value: form.subject,
                                              "onUpdate:value": ($event) => form.subject = $event,
                                              placeholder: "Subject"
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_form_item, {
                                      label: "Message",
                                      name: "message",
                                      required: ""
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_textarea, {
                                            value: form.message,
                                            "onUpdate:value": ($event) => form.message = $event,
                                            placeholder: "Type your message...",
                                            rows: 5
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_textarea, {
                                              value: form.message,
                                              "onUpdate:value": ($event) => form.message = $event,
                                              placeholder: "Type your message...",
                                              rows: 5
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_form_item, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_button, {
                                            type: "primary",
                                            "html-type": "submit",
                                            size: "large",
                                            block: ""
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(` Send Message `);
                                              } else {
                                                return [
                                                  createTextVNode(" Send Message ")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_button, {
                                              type: "primary",
                                              "html-type": "submit",
                                              size: "large",
                                              block: ""
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Send Message ")
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
                                      createVNode(_component_a_form_item, {
                                        label: "Name",
                                        name: "name",
                                        required: ""
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_input, {
                                            value: form.name,
                                            "onUpdate:value": ($event) => form.name = $event,
                                            placeholder: "Your full name"
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, {
                                        label: "Email",
                                        name: "email",
                                        required: ""
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_input, {
                                            value: form.email,
                                            "onUpdate:value": ($event) => form.email = $event,
                                            type: "email",
                                            placeholder: "Your email address"
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, {
                                        label: "Subject",
                                        name: "subject"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_input, {
                                            value: form.subject,
                                            "onUpdate:value": ($event) => form.subject = $event,
                                            placeholder: "Subject"
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, {
                                        label: "Message",
                                        name: "message",
                                        required: ""
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_textarea, {
                                            value: form.message,
                                            "onUpdate:value": ($event) => form.message = $event,
                                            placeholder: "Type your message...",
                                            rows: 5
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_button, {
                                            type: "primary",
                                            "html-type": "submit",
                                            size: "large",
                                            block: ""
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Send Message ")
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
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_typography_title, {
                                  level: 3,
                                  class: "form-title"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Get in Touch")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_typography_text, { type: "secondary" }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Have questions or feedback? We'd love to hear from you. Fill out the form below. ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form, {
                                  model: form,
                                  rules,
                                  layout: "vertical",
                                  onFinish: handleSubmit,
                                  class: "contact-form"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_form_item, {
                                      label: "Name",
                                      name: "name",
                                      required: ""
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_input, {
                                          value: form.name,
                                          "onUpdate:value": ($event) => form.name = $event,
                                          placeholder: "Your full name"
                                        }, null, 8, ["value", "onUpdate:value"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_form_item, {
                                      label: "Email",
                                      name: "email",
                                      required: ""
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_input, {
                                          value: form.email,
                                          "onUpdate:value": ($event) => form.email = $event,
                                          type: "email",
                                          placeholder: "Your email address"
                                        }, null, 8, ["value", "onUpdate:value"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_form_item, {
                                      label: "Subject",
                                      name: "subject"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_input, {
                                          value: form.subject,
                                          "onUpdate:value": ($event) => form.subject = $event,
                                          placeholder: "Subject"
                                        }, null, 8, ["value", "onUpdate:value"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_form_item, {
                                      label: "Message",
                                      name: "message",
                                      required: ""
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_textarea, {
                                          value: form.message,
                                          "onUpdate:value": ($event) => form.message = $event,
                                          placeholder: "Type your message...",
                                          rows: 5
                                        }, null, 8, ["value", "onUpdate:value"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_form_item, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_button, {
                                          type: "primary",
                                          "html-type": "submit",
                                          size: "large",
                                          block: ""
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Send Message ")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["model"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_card, {
                            bordered: "",
                            hoverable: "",
                            class: "contact-card"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_typography_title, {
                                level: 3,
                                class: "form-title"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Get in Touch")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_typography_text, { type: "secondary" }, {
                                default: withCtx(() => [
                                  createTextVNode(" Have questions or feedback? We'd love to hear from you. Fill out the form below. ")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_form, {
                                model: form,
                                rules,
                                layout: "vertical",
                                onFinish: handleSubmit,
                                class: "contact-form"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_form_item, {
                                    label: "Name",
                                    name: "name",
                                    required: ""
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_input, {
                                        value: form.name,
                                        "onUpdate:value": ($event) => form.name = $event,
                                        placeholder: "Your full name"
                                      }, null, 8, ["value", "onUpdate:value"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_form_item, {
                                    label: "Email",
                                    name: "email",
                                    required: ""
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_input, {
                                        value: form.email,
                                        "onUpdate:value": ($event) => form.email = $event,
                                        type: "email",
                                        placeholder: "Your email address"
                                      }, null, 8, ["value", "onUpdate:value"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_form_item, {
                                    label: "Subject",
                                    name: "subject"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_input, {
                                        value: form.subject,
                                        "onUpdate:value": ($event) => form.subject = $event,
                                        placeholder: "Subject"
                                      }, null, 8, ["value", "onUpdate:value"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_form_item, {
                                    label: "Message",
                                    name: "message",
                                    required: ""
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_textarea, {
                                        value: form.message,
                                        "onUpdate:value": ($event) => form.message = $event,
                                        placeholder: "Type your message...",
                                        rows: 5
                                      }, null, 8, ["value", "onUpdate:value"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_form_item, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        "html-type": "submit",
                                        size: "large",
                                        block: ""
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Send Message ")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["model"])
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
                    md: 10,
                    lg: 8
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_card, {
                          bordered: "",
                          class: "info-card"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_typography_title, { level: 4 }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Contact Information`);
                                  } else {
                                    return [
                                      createTextVNode("Contact Information")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_space, {
                                direction: "vertical",
                                size: "large",
                                class: "info-list"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_space, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(unref(EnvironmentOutlined), { class: "icon" }, null, _parent7, _scopeId6));
                                          _push7(`<span data-v-5122158d${_scopeId6}>123 Main Street, Anytown, CA 12345</span>`);
                                        } else {
                                          return [
                                            createVNode(unref(EnvironmentOutlined), { class: "icon" }),
                                            createVNode("span", null, "123 Main Street, Anytown, CA 12345")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_space, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(unref(PhoneOutlined), { class: "icon" }, null, _parent7, _scopeId6));
                                          _push7(`<span data-v-5122158d${_scopeId6}>+(123) 456-7890</span>`);
                                        } else {
                                          return [
                                            createVNode(unref(PhoneOutlined), { class: "icon" }),
                                            createVNode("span", null, "+(123) 456-7890")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_space, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(unref(MailOutlined), { class: "icon" }, null, _parent7, _scopeId6));
                                          _push7(`<span data-v-5122158d${_scopeId6}>bywayedu@webkul.in</span>`);
                                        } else {
                                          return [
                                            createVNode(unref(MailOutlined), { class: "icon" }),
                                            createVNode("span", null, "bywayedu@webkul.in")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_space, null, {
                                        default: withCtx(() => [
                                          createVNode(unref(EnvironmentOutlined), { class: "icon" }),
                                          createVNode("span", null, "123 Main Street, Anytown, CA 12345")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_space, null, {
                                        default: withCtx(() => [
                                          createVNode(unref(PhoneOutlined), { class: "icon" }),
                                          createVNode("span", null, "+(123) 456-7890")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_space, null, {
                                        default: withCtx(() => [
                                          createVNode(unref(MailOutlined), { class: "icon" }),
                                          createVNode("span", null, "bywayedu@webkul.in")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_divider, null, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_typography_text, { strong: "" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Follow Us`);
                                  } else {
                                    return [
                                      createTextVNode("Follow Us")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`<div class="social-icons" data-v-5122158d${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_tooltip, { title: "Facebook" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(FacebookFilled), null, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(FacebookFilled))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_tooltip, { title: "Twitter" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(TwitterOutlined), null, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(TwitterOutlined))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_tooltip, { title: "LinkedIn" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(LinkedinFilled), null, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(LinkedinFilled))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_tooltip, { title: "Instagram" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(InstagramFilled), null, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(InstagramFilled))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                            } else {
                              return [
                                createVNode(_component_a_typography_title, { level: 4 }, {
                                  default: withCtx(() => [
                                    createTextVNode("Contact Information")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_space, {
                                  direction: "vertical",
                                  size: "large",
                                  class: "info-list"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_space, null, {
                                      default: withCtx(() => [
                                        createVNode(unref(EnvironmentOutlined), { class: "icon" }),
                                        createVNode("span", null, "123 Main Street, Anytown, CA 12345")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_space, null, {
                                      default: withCtx(() => [
                                        createVNode(unref(PhoneOutlined), { class: "icon" }),
                                        createVNode("span", null, "+(123) 456-7890")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_space, null, {
                                      default: withCtx(() => [
                                        createVNode(unref(MailOutlined), { class: "icon" }),
                                        createVNode("span", null, "bywayedu@webkul.in")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_divider),
                                createVNode(_component_a_typography_text, { strong: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Follow Us")
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
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_card, {
                            bordered: "",
                            class: "info-card"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_typography_title, { level: 4 }, {
                                default: withCtx(() => [
                                  createTextVNode("Contact Information")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_space, {
                                direction: "vertical",
                                size: "large",
                                class: "info-list"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_space, null, {
                                    default: withCtx(() => [
                                      createVNode(unref(EnvironmentOutlined), { class: "icon" }),
                                      createVNode("span", null, "123 Main Street, Anytown, CA 12345")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_space, null, {
                                    default: withCtx(() => [
                                      createVNode(unref(PhoneOutlined), { class: "icon" }),
                                      createVNode("span", null, "+(123) 456-7890")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_space, null, {
                                    default: withCtx(() => [
                                      createVNode(unref(MailOutlined), { class: "icon" }),
                                      createVNode("span", null, "bywayedu@webkul.in")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_divider),
                              createVNode(_component_a_typography_text, { strong: "" }, {
                                default: withCtx(() => [
                                  createTextVNode("Follow Us")
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_col, {
                      xs: 24,
                      sm: 24,
                      md: 14,
                      lg: 12
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          bordered: "",
                          hoverable: "",
                          class: "contact-card"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_typography_title, {
                              level: 3,
                              class: "form-title"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Get in Touch")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_typography_text, { type: "secondary" }, {
                              default: withCtx(() => [
                                createTextVNode(" Have questions or feedback? We'd love to hear from you. Fill out the form below. ")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_form, {
                              model: form,
                              rules,
                              layout: "vertical",
                              onFinish: handleSubmit,
                              class: "contact-form"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_form_item, {
                                  label: "Name",
                                  name: "name",
                                  required: ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_input, {
                                      value: form.name,
                                      "onUpdate:value": ($event) => form.name = $event,
                                      placeholder: "Your full name"
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form_item, {
                                  label: "Email",
                                  name: "email",
                                  required: ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_input, {
                                      value: form.email,
                                      "onUpdate:value": ($event) => form.email = $event,
                                      type: "email",
                                      placeholder: "Your email address"
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form_item, {
                                  label: "Subject",
                                  name: "subject"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_input, {
                                      value: form.subject,
                                      "onUpdate:value": ($event) => form.subject = $event,
                                      placeholder: "Subject"
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form_item, {
                                  label: "Message",
                                  name: "message",
                                  required: ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_textarea, {
                                      value: form.message,
                                      "onUpdate:value": ($event) => form.message = $event,
                                      placeholder: "Type your message...",
                                      rows: 5
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form_item, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      type: "primary",
                                      "html-type": "submit",
                                      size: "large",
                                      block: ""
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Send Message ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["model"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, {
                      xs: 24,
                      sm: 24,
                      md: 10,
                      lg: 8
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          bordered: "",
                          class: "info-card"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_typography_title, { level: 4 }, {
                              default: withCtx(() => [
                                createTextVNode("Contact Information")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_space, {
                              direction: "vertical",
                              size: "large",
                              class: "info-list"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(unref(EnvironmentOutlined), { class: "icon" }),
                                    createVNode("span", null, "123 Main Street, Anytown, CA 12345")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(unref(PhoneOutlined), { class: "icon" }),
                                    createVNode("span", null, "+(123) 456-7890")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(unref(MailOutlined), { class: "icon" }),
                                    createVNode("span", null, "bywayedu@webkul.in")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_divider),
                            createVNode(_component_a_typography_text, { strong: "" }, {
                              default: withCtx(() => [
                                createTextVNode("Follow Us")
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
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "contact-container" }, [
                createVNode(_component_a_row, {
                  gutter: [48, 48],
                  align: "top",
                  justify: "center"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_a_col, {
                      xs: 24,
                      sm: 24,
                      md: 14,
                      lg: 12
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          bordered: "",
                          hoverable: "",
                          class: "contact-card"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_typography_title, {
                              level: 3,
                              class: "form-title"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Get in Touch")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_typography_text, { type: "secondary" }, {
                              default: withCtx(() => [
                                createTextVNode(" Have questions or feedback? We'd love to hear from you. Fill out the form below. ")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_form, {
                              model: form,
                              rules,
                              layout: "vertical",
                              onFinish: handleSubmit,
                              class: "contact-form"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_form_item, {
                                  label: "Name",
                                  name: "name",
                                  required: ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_input, {
                                      value: form.name,
                                      "onUpdate:value": ($event) => form.name = $event,
                                      placeholder: "Your full name"
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form_item, {
                                  label: "Email",
                                  name: "email",
                                  required: ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_input, {
                                      value: form.email,
                                      "onUpdate:value": ($event) => form.email = $event,
                                      type: "email",
                                      placeholder: "Your email address"
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form_item, {
                                  label: "Subject",
                                  name: "subject"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_input, {
                                      value: form.subject,
                                      "onUpdate:value": ($event) => form.subject = $event,
                                      placeholder: "Subject"
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form_item, {
                                  label: "Message",
                                  name: "message",
                                  required: ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_textarea, {
                                      value: form.message,
                                      "onUpdate:value": ($event) => form.message = $event,
                                      placeholder: "Type your message...",
                                      rows: 5
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form_item, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      type: "primary",
                                      "html-type": "submit",
                                      size: "large",
                                      block: ""
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Send Message ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["model"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, {
                      xs: 24,
                      sm: 24,
                      md: 10,
                      lg: 8
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          bordered: "",
                          class: "info-card"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_typography_title, { level: 4 }, {
                              default: withCtx(() => [
                                createTextVNode("Contact Information")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_space, {
                              direction: "vertical",
                              size: "large",
                              class: "info-list"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(unref(EnvironmentOutlined), { class: "icon" }),
                                    createVNode("span", null, "123 Main Street, Anytown, CA 12345")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(unref(PhoneOutlined), { class: "icon" }),
                                    createVNode("span", null, "+(123) 456-7890")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(unref(MailOutlined), { class: "icon" }),
                                    createVNode("span", null, "bywayedu@webkul.in")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_divider),
                            createVNode(_component_a_typography_text, { strong: "" }, {
                              default: withCtx(() => [
                                createTextVNode("Follow Us")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/contact-page/nuxt/pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const contact = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5122158d"]]);

export { contact as default };
//# sourceMappingURL=contact-Bskd4Qxo.mjs.map
