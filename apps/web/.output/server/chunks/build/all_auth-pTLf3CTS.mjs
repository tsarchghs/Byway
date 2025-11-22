import { ref, resolveComponent, withCtx, createVNode, reactive, mergeProps, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { message } from 'ant-design-vue';
import { H as Header } from './Header-DscPRdFw.mjs';
import { MailOutlined, LockOutlined } from '@ant-design/icons-vue';
import { _ as _export_sfc, n as navigateTo, d as useRoute, b as useRuntimeConfig } from './server.mjs';
import { u as useAuth } from './useAuth-B8D9e8en.mjs';
import { useMutation, provideApolloClient } from '@vue/apollo-composable';
import { gql, createHttpLink, ApolloClient, InMemoryCache } from '@apollo/client/core/index.js';
import { setContext } from '@apollo/client/link/context/index.js';
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
import './useCart-7pxN526Z.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main$2 = {
  __name: "SignInForm",
  __ssrInlineRender: true,
  emits: ["submit"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const form = reactive({
      email: "",
      password: "",
      remember: false
    });
    const loading = ref(false);
    const rules = {
      email: [
        { required: true, message: "Please enter your email", trigger: "blur" },
        { type: "email", message: "Invalid email format", trigger: "blur" }
      ],
      password: [
        { required: true, message: "Please enter your password", trigger: "blur" }
      ]
    };
    const onSubmit = () => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        emit("submit", { ...form });
      }, 800);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_form = resolveComponent("a-form");
      const _component_a_form_item = resolveComponent("a-form-item");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_input_password = resolveComponent("a-input-password");
      const _component_a_checkbox = resolveComponent("a-checkbox");
      const _component_a_typography_link = resolveComponent("a-typography-link");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_divider = resolveComponent("a-divider");
      const _component_a_space = resolveComponent("a-space");
      _push(ssrRenderComponent(_component_a_form, mergeProps({
        layout: "vertical",
        model: form,
        rules,
        onFinish: onSubmit,
        class: "signin-form"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_form_item, {
              name: "email",
              label: "Email"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_input, {
                    value: form.email,
                    "onUpdate:value": ($event) => form.email = $event,
                    placeholder: "Enter your email address"
                  }, {
                    prefix: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(MailOutlined), null, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(MailOutlined))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_input, {
                      value: form.email,
                      "onUpdate:value": ($event) => form.email = $event,
                      placeholder: "Enter your email address"
                    }, {
                      prefix: withCtx(() => [
                        createVNode(unref(MailOutlined))
                      ]),
                      _: 1
                    }, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_form_item, {
              name: "password",
              label: "Password"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_input_password, {
                    value: form.password,
                    "onUpdate:value": ($event) => form.password = $event,
                    placeholder: "Enter your password"
                  }, {
                    prefix: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(LockOutlined), null, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(LockOutlined))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_input_password, {
                      value: form.password,
                      "onUpdate:value": ($event) => form.password = $event,
                      placeholder: "Enter your password"
                    }, {
                      prefix: withCtx(() => [
                        createVNode(unref(LockOutlined))
                      ]),
                      _: 1
                    }, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="signin-actions" data-v-4be98055${_scopeId}>`);
            _push2(ssrRenderComponent(_component_a_checkbox, {
              checked: form.remember,
              "onUpdate:checked": ($event) => form.remember = $event
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Remember me`);
                } else {
                  return [
                    createTextVNode("Remember me")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_typography_link, {
              href: "/forgot-password",
              class: "forgot-link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Forgot password? `);
                } else {
                  return [
                    createTextVNode(" Forgot password? ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_a_form_item, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_button, {
                    type: "primary",
                    "html-type": "submit",
                    block: "",
                    loading: loading.value
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Sign In `);
                      } else {
                        return [
                          createTextVNode(" Sign In ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_button, {
                      type: "primary",
                      "html-type": "submit",
                      block: "",
                      loading: loading.value
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Sign In ")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_divider, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Or sign in with`);
                } else {
                  return [
                    createTextVNode("Or sign in with")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_space, {
              direction: "vertical",
              style: { "width": "100%" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_button, {
                    block: "",
                    icon: "<GoogleOutlined />"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Google`);
                      } else {
                        return [
                          createTextVNode("Google")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_button, {
                    block: "",
                    icon: "<FacebookFilled />"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Facebook`);
                      } else {
                        return [
                          createTextVNode("Facebook")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_button, {
                    block: "",
                    icon: "<WindowsFilled />"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Microsoft`);
                      } else {
                        return [
                          createTextVNode("Microsoft")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_button, {
                      block: "",
                      icon: "<GoogleOutlined />"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Google")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_button, {
                      block: "",
                      icon: "<FacebookFilled />"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Facebook")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_button, {
                      block: "",
                      icon: "<WindowsFilled />"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Microsoft")
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
              createVNode(_component_a_form_item, {
                name: "email",
                label: "Email"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_input, {
                    value: form.email,
                    "onUpdate:value": ($event) => form.email = $event,
                    placeholder: "Enter your email address"
                  }, {
                    prefix: withCtx(() => [
                      createVNode(unref(MailOutlined))
                    ]),
                    _: 1
                  }, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }),
              createVNode(_component_a_form_item, {
                name: "password",
                label: "Password"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_input_password, {
                    value: form.password,
                    "onUpdate:value": ($event) => form.password = $event,
                    placeholder: "Enter your password"
                  }, {
                    prefix: withCtx(() => [
                      createVNode(unref(LockOutlined))
                    ]),
                    _: 1
                  }, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }),
              createVNode("div", { class: "signin-actions" }, [
                createVNode(_component_a_checkbox, {
                  checked: form.remember,
                  "onUpdate:checked": ($event) => form.remember = $event
                }, {
                  default: withCtx(() => [
                    createTextVNode("Remember me")
                  ]),
                  _: 1
                }, 8, ["checked", "onUpdate:checked"]),
                createVNode(_component_a_typography_link, {
                  href: "/forgot-password",
                  class: "forgot-link"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Forgot password? ")
                  ]),
                  _: 1
                })
              ]),
              createVNode(_component_a_form_item, null, {
                default: withCtx(() => [
                  createVNode(_component_a_button, {
                    type: "primary",
                    "html-type": "submit",
                    block: "",
                    loading: loading.value
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Sign In ")
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              }),
              createVNode(_component_a_divider, null, {
                default: withCtx(() => [
                  createTextVNode("Or sign in with")
                ]),
                _: 1
              }),
              createVNode(_component_a_space, {
                direction: "vertical",
                style: { "width": "100%" }
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_button, {
                    block: "",
                    icon: "<GoogleOutlined />"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Google")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_button, {
                    block: "",
                    icon: "<FacebookFilled />"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Facebook")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_button, {
                    block: "",
                    icon: "<WindowsFilled />"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Microsoft")
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
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/authentication/nuxt/pages/SignInForm.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const SignInForm = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-4be98055"]]);
const _sfc_main$1 = {
  __name: "SignUpForm",
  __ssrInlineRender: true,
  emits: ["submit"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const form = reactive({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirm: ""
    });
    const loading = ref(false);
    const rules = {
      firstName: [{ required: true, message: "Please enter your first name" }],
      lastName: [{ required: true, message: "Please enter your last name" }],
      email: [
        { required: true, message: "Please enter your email" },
        { type: "email", message: "Invalid email format" }
      ],
      password: [{ required: true, message: "Please enter your password" }],
      confirm: [{ required: true, message: "Please confirm your password" }]
    };
    const validateConfirm = (_rule, value) => {
      if (value !== form.password) return Promise.reject("Passwords do not match");
      return Promise.resolve();
    };
    const onSubmit = () => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        emit("submit", { ...form });
      }, 800);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_form = resolveComponent("a-form");
      const _component_a_form_item = resolveComponent("a-form-item");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_input_password = resolveComponent("a-input-password");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_divider = resolveComponent("a-divider");
      const _component_a_space = resolveComponent("a-space");
      _push(ssrRenderComponent(_component_a_form, mergeProps({
        layout: "vertical",
        model: form,
        rules,
        onFinish: onSubmit
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_form_item, {
              name: "firstName",
              label: "First Name"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_input, {
                    value: form.firstName,
                    "onUpdate:value": ($event) => form.firstName = $event,
                    placeholder: "Enter your first name"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_input, {
                      value: form.firstName,
                      "onUpdate:value": ($event) => form.firstName = $event,
                      placeholder: "Enter your first name"
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_form_item, {
              name: "lastName",
              label: "Last Name"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_input, {
                    value: form.lastName,
                    "onUpdate:value": ($event) => form.lastName = $event,
                    placeholder: "Enter your last name"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_input, {
                      value: form.lastName,
                      "onUpdate:value": ($event) => form.lastName = $event,
                      placeholder: "Enter your last name"
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_form_item, {
              name: "email",
              label: "Email"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_input, {
                    value: form.email,
                    "onUpdate:value": ($event) => form.email = $event,
                    placeholder: "Enter your email"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_input, {
                      value: form.email,
                      "onUpdate:value": ($event) => form.email = $event,
                      placeholder: "Enter your email"
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_form_item, {
              name: "password",
              label: "Password"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_input_password, {
                    value: form.password,
                    "onUpdate:value": ($event) => form.password = $event,
                    placeholder: "Enter your password"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_input_password, {
                      value: form.password,
                      "onUpdate:value": ($event) => form.password = $event,
                      placeholder: "Enter your password"
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_form_item, {
              name: "confirm",
              label: "Confirm Password",
              rules: [{ validator: validateConfirm }]
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_input_password, {
                    value: form.confirm,
                    "onUpdate:value": ($event) => form.confirm = $event,
                    placeholder: "Repeat your password"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_input_password, {
                      value: form.confirm,
                      "onUpdate:value": ($event) => form.confirm = $event,
                      placeholder: "Repeat your password"
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_form_item, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_button, {
                    type: "primary",
                    "html-type": "submit",
                    block: "",
                    loading: loading.value
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Create Account `);
                      } else {
                        return [
                          createTextVNode(" Create Account ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_button, {
                      type: "primary",
                      "html-type": "submit",
                      block: "",
                      loading: loading.value
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Create Account ")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_divider, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Or sign up with`);
                } else {
                  return [
                    createTextVNode("Or sign up with")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_space, {
              direction: "vertical",
              style: { "width": "100%" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_button, {
                    block: "",
                    icon: "<GoogleOutlined />"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Google`);
                      } else {
                        return [
                          createTextVNode("Google")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_button, {
                    block: "",
                    icon: "<FacebookFilled />"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Facebook`);
                      } else {
                        return [
                          createTextVNode("Facebook")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_button, {
                    block: "",
                    icon: "<WindowsFilled />"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Microsoft`);
                      } else {
                        return [
                          createTextVNode("Microsoft")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_button, {
                      block: "",
                      icon: "<GoogleOutlined />"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Google")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_button, {
                      block: "",
                      icon: "<FacebookFilled />"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Facebook")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_button, {
                      block: "",
                      icon: "<WindowsFilled />"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Microsoft")
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
              createVNode(_component_a_form_item, {
                name: "firstName",
                label: "First Name"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_input, {
                    value: form.firstName,
                    "onUpdate:value": ($event) => form.firstName = $event,
                    placeholder: "Enter your first name"
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }),
              createVNode(_component_a_form_item, {
                name: "lastName",
                label: "Last Name"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_input, {
                    value: form.lastName,
                    "onUpdate:value": ($event) => form.lastName = $event,
                    placeholder: "Enter your last name"
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }),
              createVNode(_component_a_form_item, {
                name: "email",
                label: "Email"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_input, {
                    value: form.email,
                    "onUpdate:value": ($event) => form.email = $event,
                    placeholder: "Enter your email"
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }),
              createVNode(_component_a_form_item, {
                name: "password",
                label: "Password"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_input_password, {
                    value: form.password,
                    "onUpdate:value": ($event) => form.password = $event,
                    placeholder: "Enter your password"
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }),
              createVNode(_component_a_form_item, {
                name: "confirm",
                label: "Confirm Password",
                rules: [{ validator: validateConfirm }]
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_input_password, {
                    value: form.confirm,
                    "onUpdate:value": ($event) => form.confirm = $event,
                    placeholder: "Repeat your password"
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }, 8, ["rules"]),
              createVNode(_component_a_form_item, null, {
                default: withCtx(() => [
                  createVNode(_component_a_button, {
                    type: "primary",
                    "html-type": "submit",
                    block: "",
                    loading: loading.value
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Create Account ")
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              }),
              createVNode(_component_a_divider, null, {
                default: withCtx(() => [
                  createTextVNode("Or sign up with")
                ]),
                _: 1
              }),
              createVNode(_component_a_space, {
                direction: "vertical",
                style: { "width": "100%" }
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_button, {
                    block: "",
                    icon: "<GoogleOutlined />"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Google")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_button, {
                    block: "",
                    icon: "<FacebookFilled />"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Facebook")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_button, {
                    block: "",
                    icon: "<WindowsFilled />"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Microsoft")
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
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/authentication/nuxt/pages/SignUpForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
async function useApolloPluginClient(manualName) {
  const route = useRoute();
  const config = useRuntimeConfig();
  let pluginName = manualName;
  if (!pluginName && route.path.startsWith("/plugins/")) {
    const parts = route.path.split("/");
    pluginName = parts[2];
  }
  const apiBase = config.public.apiBase || "http://localhost:4000";
  const uri = pluginName ? `${apiBase}/api/${pluginName}/graphql` : `${apiBase}/api/graphql`;
  const httpLink = createHttpLink({ uri });
  const authLink = setContext((_, { headers }) => ({
    headers: { ...headers, authorization: "" }
  }));
  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: true
  });
  provideApolloClient(apolloClient);
  return apolloClient;
}
const _sfc_main = {
  __name: "all_auth",
  __ssrInlineRender: true,
  setup(__props) {
    useApolloPluginClient();
    const auth = useAuth();
    const activeTab = ref("signin");
    const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id email teacherProfileId }
    }
  }
`;
    const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $firstName: String, $lastName: String) {
    register(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
      id
      email
    }
  }
`;
    const { mutate: login, onDone: onLoginDone, onError: onLoginError } = useMutation(LOGIN_MUTATION);
    const { mutate: register, onDone: onRegisterDone, onError: onRegisterError } = useMutation(REGISTER_MUTATION);
    const handleSignIn = (data) => {
      login({
        email: data.email,
        password: data.password
      });
    };
    onLoginDone(({ data }) => {
      const { token, user } = data.login;
      auth.login({ token, user });
      message.success(`Welcome back, ${user.email}`);
      navigateTo("/");
    });
    onLoginError((err) => {
      message.error(err.message);
    });
    const handleSignUp = (data) => {
      if (data.password !== data.confirm) {
        return message.error("Passwords do not match");
      }
      register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName
      });
    };
    onRegisterDone(({ data }) => {
      message.success(`Account created for ${data.register.email}`);
    });
    onRegisterError((err) => {
      message.error(err.message);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_tabs = resolveComponent("a-tabs");
      const _component_a_tab_pane = resolveComponent("a-tab-pane");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(ssrRenderComponent(_component_a_row, { class: "signin-section" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_col, {
              xs: 24,
              md: 14,
              class: "signin-content"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_card, {
                    class: "signin-card",
                    bordered: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_tabs, {
                          activeKey: activeTab.value,
                          "onUpdate:activeKey": ($event) => activeTab.value = $event,
                          centered: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_tab_pane, {
                                key: "signin",
                                tab: "Sign In"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(SignInForm, { onSubmit: handleSignIn }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(SignInForm, { onSubmit: handleSignIn })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_tab_pane, {
                                key: "signup",
                                tab: "Create Account"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_sfc_main$1, { onSubmit: handleSignUp }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_sfc_main$1, { onSubmit: handleSignUp })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_tab_pane, {
                                  key: "signin",
                                  tab: "Sign In"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(SignInForm, { onSubmit: handleSignIn })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_tab_pane, {
                                  key: "signup",
                                  tab: "Create Account"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_sfc_main$1, { onSubmit: handleSignUp })
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
                          createVNode(_component_a_tabs, {
                            activeKey: activeTab.value,
                            "onUpdate:activeKey": ($event) => activeTab.value = $event,
                            centered: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_tab_pane, {
                                key: "signin",
                                tab: "Sign In"
                              }, {
                                default: withCtx(() => [
                                  createVNode(SignInForm, { onSubmit: handleSignIn })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_tab_pane, {
                                key: "signup",
                                tab: "Create Account"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_sfc_main$1, { onSubmit: handleSignUp })
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, {
                      class: "signin-card",
                      bordered: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_tabs, {
                          activeKey: activeTab.value,
                          "onUpdate:activeKey": ($event) => activeTab.value = $event,
                          centered: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_tab_pane, {
                              key: "signin",
                              tab: "Sign In"
                            }, {
                              default: withCtx(() => [
                                createVNode(SignInForm, { onSubmit: handleSignIn })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_tab_pane, {
                              key: "signup",
                              tab: "Create Account"
                            }, {
                              default: withCtx(() => [
                                createVNode(_sfc_main$1, { onSubmit: handleSignUp })
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
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_col, {
              xs: 0,
              md: 10,
              class: "signin-image"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_col, {
                xs: 24,
                md: 14,
                class: "signin-content"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_card, {
                    class: "signin-card",
                    bordered: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_tabs, {
                        activeKey: activeTab.value,
                        "onUpdate:activeKey": ($event) => activeTab.value = $event,
                        centered: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_tab_pane, {
                            key: "signin",
                            tab: "Sign In"
                          }, {
                            default: withCtx(() => [
                              createVNode(SignInForm, { onSubmit: handleSignIn })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_tab_pane, {
                            key: "signup",
                            tab: "Create Account"
                          }, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$1, { onSubmit: handleSignUp })
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
              createVNode(_component_a_col, {
                xs: 0,
                md: 10,
                class: "signin-image"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/authentication/nuxt/pages/all_auth.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const all_auth = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ec0ff5d3"]]);

export { all_auth as default };
//# sourceMappingURL=all_auth-pTLf3CTS.mjs.map
