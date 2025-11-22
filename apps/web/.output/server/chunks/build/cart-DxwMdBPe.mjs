import { _ as __nuxt_component_0 } from './nuxt-link-DQJ00LSY.mjs';
import { defineComponent, ref, computed, resolveComponent, mergeProps, withCtx, createTextVNode, createVNode, unref, h, toDisplayString, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useCart } from './useCart-7pxN526Z.mjs';
import { u as useAuth } from './useAuth-B8D9e8en.mjs';
import { Modal, message } from 'ant-design-vue';
import { DeleteOutlined } from '@ant-design/icons-vue';
import { _ as _export_sfc, u as useRouter, d as useRoute, b as useRuntimeConfig } from './server.mjs';
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
  __name: "cart",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    useRoute();
    const config = useRuntimeConfig();
    const apiBase = config.public?.apiBase || "http://localhost:4000";
    const { user, isLoggedIn, token } = useAuth();
    const { loading, items, totalPrice, removeFromCart, clearCart } = useCart();
    const checkingOut = ref(false);
    const rows = computed(() => items.value || []);
    const cols = [
      { title: "Course", dataIndex: "titleSnapshot", key: "title" },
      { title: "Quantity", dataIndex: "quantity", key: "quantity" },
      { title: "Price", key: "price", customRender: ({ record }) => `€${(record.priceSnapshot || 0).toFixed(2)}` },
      {
        title: "Action",
        key: "action",
        customRender: ({ record }) => h("a", {
          onClick: () => handleRemoveItem(record),
          style: "color: #f5222d; cursor: pointer;"
        }, [h(DeleteOutlined), " Remove"])
      }
    ];
    const total = computed(() => totalPrice.value || 0);
    async function handleRemoveItem(item) {
      try {
        await removeFromCart(item.id);
        message.success("Item removed from cart");
      } catch (e) {
        message.error(e?.message || "Failed to remove item");
      }
    }
    async function handleClearCart() {
      Modal.confirm({
        title: "Clear Cart?",
        content: "Are you sure you want to remove all items from your cart?",
        okText: "Clear",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            await clearCart();
            message.success("Cart cleared");
          } catch (e) {
            message.error(e?.message || "Failed to clear cart");
          }
        }
      });
    }
    async function goCheckout() {
      if (items.value.length === 0) {
        message.warning("Your cart is empty");
        return;
      }
      if (!isLoggedIn.value || !user.value?.id) {
        message.warning("Please log in to checkout");
        router.push("/login");
        return;
      }
      checkingOut.value = true;
      try {
        const successUrl = `${(void 0).location.origin}/checkout/success`;
        const cancelUrl = `${(void 0).location.origin}/cart`;
        const payload = {
          query: `mutation($items:[EcCartItemInput!]!,$successUrl:String!,$cancelUrl:String!){
        createCheckout(items:$items, successUrl:$successUrl, cancelUrl:$cancelUrl){ url orderId }
      }`,
          variables: {
            items: items.value.map((it) => ({ courseId: it.courseId, quantity: it.quantity || 1 })),
            successUrl,
            cancelUrl
          }
        };
        const res = await fetch(`${apiBase}/api/ecommerce/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...token.value ? { Authorization: `Bearer ${token.value}` } : {}
          },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.errors?.length) throw new Error(json.errors[0].message);
        const url = json?.data?.createCheckout?.url;
        if (url) {
          (void 0).location.href = url;
        } else {
          message.error("Checkout link unavailable. Try again.");
        }
      } catch (e) {
        const msg = e?.message || "Failed to start checkout";
        if (msg.includes("Already enrolled")) {
          message.info("You already own one of these courses.");
        } else {
          message.error(msg);
        }
      } finally {
        checkingOut.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_space = resolveComponent("a-space");
      const _component_NuxtLink = __nuxt_component_0;
      const _component_a_button = resolveComponent("a-button");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_divider = resolveComponent("a-divider");
      _push(ssrRenderComponent(_component_a_layout, mergeProps({ class: "p-6" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_page_header, {
              title: "Your Cart",
              "sub-title": "Review and checkout",
              class: "mb-4"
            }, {
              extra: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_space, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_button, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Explore`);
                                  } else {
                                    return [
                                      createTextVNode("Explore")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_button, null, {
                                  default: withCtx(() => [
                                    createTextVNode("Explore")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_NuxtLink, { to: "/students/dashboard" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_button, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Dashboard`);
                                  } else {
                                    return [
                                      createTextVNode("Dashboard")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_button, null, {
                                  default: withCtx(() => [
                                    createTextVNode("Dashboard")
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
                          createVNode(_component_NuxtLink, { to: "/" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, null, {
                                default: withCtx(() => [
                                  createTextVNode("Explore")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_NuxtLink, { to: "/students/dashboard" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, null, {
                                default: withCtx(() => [
                                  createTextVNode("Dashboard")
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
                } else {
                  return [
                    createVNode(_component_a_space, null, {
                      default: withCtx(() => [
                        createVNode(_component_NuxtLink, { to: "/" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_button, null, {
                              default: withCtx(() => [
                                createTextVNode("Explore")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_NuxtLink, { to: "/students/dashboard" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_button, null, {
                              default: withCtx(() => [
                                createTextVNode("Dashboard")
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
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_card, { bordered: false }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="grid md:grid-cols-3 gap-4" data-v-76804127${_scopeId2}><div class="md:col-span-2" data-v-76804127${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_a_table, {
                    "data-source": rows.value,
                    columns: cols,
                    "row-key": "id",
                    loading: unref(loading)
                  }, null, _parent3, _scopeId2));
                  if (!rows.value.length && !unref(loading)) {
                    _push3(`<div class="empty-cart" data-v-76804127${_scopeId2}><div data-v-76804127${_scopeId2}>Your cart is empty.</div>`);
                    _push3(ssrRenderComponent(_component_NuxtLink, { to: "/categories" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_button, {
                            type: "primary",
                            style: { "margin-top": "12px" }
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Browse courses`);
                              } else {
                                return [
                                  createTextVNode("Browse courses")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_button, {
                              type: "primary",
                              style: { "margin-top": "12px" }
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Browse courses")
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
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div data-v-76804127${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_a_card, {
                    size: "small",
                    title: "Summary"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-2xl font-semibold" data-v-76804127${_scopeId3}>€${ssrInterpolate(total.value.toFixed(2))}</div>`);
                        _push4(ssrRenderComponent(_component_a_divider, null, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_space, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_button, {
                                onClick: handleClearCart,
                                loading: unref(loading)
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Clear`);
                                  } else {
                                    return [
                                      createTextVNode("Clear")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_button, {
                                type: "primary",
                                onClick: goCheckout,
                                disabled: !rows.value.length || checkingOut.value,
                                loading: checkingOut.value
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Checkout`);
                                  } else {
                                    return [
                                      createTextVNode("Checkout")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_button, {
                                  onClick: handleClearCart,
                                  loading: unref(loading)
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Clear")
                                  ]),
                                  _: 1
                                }, 8, ["loading"]),
                                createVNode(_component_a_button, {
                                  type: "primary",
                                  onClick: goCheckout,
                                  disabled: !rows.value.length || checkingOut.value,
                                  loading: checkingOut.value
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Checkout")
                                  ]),
                                  _: 1
                                }, 8, ["disabled", "loading"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode("div", { class: "text-2xl font-semibold" }, "€" + toDisplayString(total.value.toFixed(2)), 1),
                          createVNode(_component_a_divider),
                          createVNode(_component_a_space, null, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, {
                                onClick: handleClearCart,
                                loading: unref(loading)
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Clear")
                                ]),
                                _: 1
                              }, 8, ["loading"]),
                              createVNode(_component_a_button, {
                                type: "primary",
                                onClick: goCheckout,
                                disabled: !rows.value.length || checkingOut.value,
                                loading: checkingOut.value
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Checkout")
                                ]),
                                _: 1
                              }, 8, ["disabled", "loading"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "grid md:grid-cols-3 gap-4" }, [
                      createVNode("div", { class: "md:col-span-2" }, [
                        createVNode(_component_a_table, {
                          "data-source": rows.value,
                          columns: cols,
                          "row-key": "id",
                          loading: unref(loading)
                        }, null, 8, ["data-source", "loading"]),
                        !rows.value.length && !unref(loading) ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "empty-cart"
                        }, [
                          createVNode("div", null, "Your cart is empty."),
                          createVNode(_component_NuxtLink, { to: "/categories" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, {
                                type: "primary",
                                style: { "margin-top": "12px" }
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Browse courses")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ])) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode(_component_a_card, {
                          size: "small",
                          title: "Summary"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "text-2xl font-semibold" }, "€" + toDisplayString(total.value.toFixed(2)), 1),
                            createVNode(_component_a_divider),
                            createVNode(_component_a_space, null, {
                              default: withCtx(() => [
                                createVNode(_component_a_button, {
                                  onClick: handleClearCart,
                                  loading: unref(loading)
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Clear")
                                  ]),
                                  _: 1
                                }, 8, ["loading"]),
                                createVNode(_component_a_button, {
                                  type: "primary",
                                  onClick: goCheckout,
                                  disabled: !rows.value.length || checkingOut.value,
                                  loading: checkingOut.value
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Checkout")
                                  ]),
                                  _: 1
                                }, 8, ["disabled", "loading"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_page_header, {
                title: "Your Cart",
                "sub-title": "Review and checkout",
                class: "mb-4"
              }, {
                extra: withCtx(() => [
                  createVNode(_component_a_space, null, {
                    default: withCtx(() => [
                      createVNode(_component_NuxtLink, { to: "/" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_button, null, {
                            default: withCtx(() => [
                              createTextVNode("Explore")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_NuxtLink, { to: "/students/dashboard" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_button, null, {
                            default: withCtx(() => [
                              createTextVNode("Dashboard")
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
              createVNode(_component_a_card, { bordered: false }, {
                default: withCtx(() => [
                  createVNode("div", { class: "grid md:grid-cols-3 gap-4" }, [
                    createVNode("div", { class: "md:col-span-2" }, [
                      createVNode(_component_a_table, {
                        "data-source": rows.value,
                        columns: cols,
                        "row-key": "id",
                        loading: unref(loading)
                      }, null, 8, ["data-source", "loading"]),
                      !rows.value.length && !unref(loading) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "empty-cart"
                      }, [
                        createVNode("div", null, "Your cart is empty."),
                        createVNode(_component_NuxtLink, { to: "/categories" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_button, {
                              type: "primary",
                              style: { "margin-top": "12px" }
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Browse courses")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode(_component_a_card, {
                        size: "small",
                        title: "Summary"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-2xl font-semibold" }, "€" + toDisplayString(total.value.toFixed(2)), 1),
                          createVNode(_component_a_divider),
                          createVNode(_component_a_space, null, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, {
                                onClick: handleClearCart,
                                loading: unref(loading)
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Clear")
                                ]),
                                _: 1
                              }, 8, ["loading"]),
                              createVNode(_component_a_button, {
                                type: "primary",
                                onClick: goCheckout,
                                disabled: !rows.value.length || checkingOut.value,
                                loading: checkingOut.value
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Checkout")
                                ]),
                                _: 1
                              }, 8, ["disabled", "loading"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ])
                  ])
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
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/ecommerce/nuxt/pages/cart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cart = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-76804127"]]);

export { cart as default };
//# sourceMappingURL=cart-DxwMdBPe.mjs.map
