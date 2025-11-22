import { _ as __nuxt_component_0 } from './nuxt-link-DQJ00LSY.mjs';
import { defineComponent, ref, watch, resolveComponent, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, createBlock, openBlock, Fragment, h, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { ShoppingCartOutlined, DownOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { u as useAuth } from './useAuth-B8D9e8en.mjs';
import { u as useCart } from './useCart-7pxN526Z.mjs';
import { Modal, message } from 'ant-design-vue';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const { user, isLoggedIn, logout } = useAuth();
    const { items, itemCount, totalPrice, loading, isEmpty, fetchCart, removeFromCart, clearCart } = useCart();
    const cartOpen = ref(false);
    watch(isLoggedIn, (loggedIn) => {
      if (loggedIn) {
        fetchCart();
      }
    }, { immediate: true });
    function doLogout() {
      logout();
      cartOpen.value = false;
    }
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
    function renderCartItem(item) {
      const title = item.titleSnapshot || `Course ${item.courseId}`;
      const price = typeof item.priceSnapshot === "number" ? item.priceSnapshot : null;
      return h("div", { class: "cart-item" }, [
        h("div", { class: "cart-item-main" }, [
          h("div", { class: "cart-item-title" }, title),
          h("div", { class: "cart-item-meta" }, [
            h("span", `Qty: ${item.quantity}`),
            price !== null ? h("span", { class: "cart-price" }, ` · €${price.toFixed(2)}`) : null
          ].filter(Boolean))
        ]),
        h("div", { class: "cart-item-actions" }, [
          h("a", {
            class: "cart-action-btn",
            onClick: () => handleRemoveItem(item),
            title: "Remove from cart"
          }, [h(DeleteOutlined)]),
          h("a", {
            class: "cart-action-btn",
            onClick: () => {
              cartOpen.value = false;
              router.push(`/course/${encodeURIComponent(item.courseId)}`);
            },
            title: "View course"
          }, "View")
        ])
      ]);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout_header = resolveComponent("a-layout-header");
      const _component_NuxtLink = __nuxt_component_0;
      const _component_a_badge = resolveComponent("a-badge");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_dropdown = resolveComponent("a-dropdown");
      const _component_a_menu = resolveComponent("a-menu");
      const _component_a_menu_item = resolveComponent("a-menu-item");
      const _component_a_drawer = resolveComponent("a-drawer");
      const _component_a_spin = resolveComponent("a-spin");
      const _component_a_list = resolveComponent("a-list");
      const _component_a_divider = resolveComponent("a-divider");
      const _component_a_space = resolveComponent("a-space");
      _push(ssrRenderComponent(_component_a_layout_header, mergeProps({ class: "byway-header" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="header-inner" data-v-6fb9db81${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/",
              class: "logo"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<img alt="Byway" class="logo-image" data-v-6fb9db81${_scopeId2}><span class="logo-text" data-v-6fb9db81${_scopeId2}>Byway</span>`);
                } else {
                  return [
                    createVNode("img", {
                      alt: "Byway",
                      class: "logo-image"
                    }),
                    createVNode("span", { class: "logo-text" }, "Byway")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<nav class="nav" data-v-6fb9db81${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/categories",
              class: "nav-link",
              "exact-active-class": "nav-active"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Browse`);
                } else {
                  return [
                    createTextVNode("Browse")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/course-author",
              class: "nav-link",
              "exact-active-class": "nav-active"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Teach`);
                } else {
                  return [
                    createTextVNode("Teach")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/institutions",
              class: "nav-link",
              "exact-active-class": "nav-active"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Institutions`);
                } else {
                  return [
                    createTextVNode("Institutions")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/students",
              class: "nav-link",
              "exact-active-class": "nav-active"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`My Learning`);
                } else {
                  return [
                    createTextVNode("My Learning")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</nav><div class="actions" data-v-6fb9db81${_scopeId}>`);
            if (unref(isLoggedIn)) {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(_component_a_badge, {
                count: unref(itemCount),
                "number-style": { backgroundColor: "#52c41a" },
                offset: [8, 0]
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_button, {
                      type: "text",
                      class: "cart-btn",
                      onClick: ($event) => cartOpen.value = true
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(ShoppingCartOutlined), null, null, _parent4, _scopeId3));
                          _push4(`<span class="ml-1" data-v-6fb9db81${_scopeId3}>Cart</span>`);
                        } else {
                          return [
                            createVNode(unref(ShoppingCartOutlined)),
                            createVNode("span", { class: "ml-1" }, "Cart")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_a_button, {
                        type: "text",
                        class: "cart-btn",
                        onClick: ($event) => cartOpen.value = true
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(ShoppingCartOutlined)),
                          createVNode("span", { class: "ml-1" }, "Cart")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_a_dropdown, { trigger: "click" }, {
                overlay: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_menu, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_menu_item, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_NuxtLink, { to: "/students" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`My Learning`);
                                    } else {
                                      return [
                                        createTextVNode("My Learning")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_NuxtLink, { to: "/students" }, {
                                    default: withCtx(() => [
                                      createTextVNode("My Learning")
                                    ]),
                                    _: 1
                                  })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_menu_item, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_NuxtLink, { to: "/cart" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`Cart`);
                                    } else {
                                      return [
                                        createTextVNode("Cart")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_NuxtLink, { to: "/cart" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Cart")
                                    ]),
                                    _: 1
                                  })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_menu_item, { onClick: doLogout }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Logout`);
                              } else {
                                return [
                                  createTextVNode("Logout")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/students" }, {
                                  default: withCtx(() => [
                                    createTextVNode("My Learning")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/cart" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Cart")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, { onClick: doLogout }, {
                              default: withCtx(() => [
                                createTextVNode("Logout")
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
                      createVNode(_component_a_menu, null, {
                        default: withCtx(() => [
                          createVNode(_component_a_menu_item, null, {
                            default: withCtx(() => [
                              createVNode(_component_NuxtLink, { to: "/students" }, {
                                default: withCtx(() => [
                                  createTextVNode("My Learning")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, null, {
                            default: withCtx(() => [
                              createVNode(_component_NuxtLink, { to: "/cart" }, {
                                default: withCtx(() => [
                                  createTextVNode("Cart")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, { onClick: doLogout }, {
                            default: withCtx(() => [
                              createTextVNode("Logout")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_button, {
                      type: "text",
                      class: "account-btn"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(unref(user)?.email || "Account")} `);
                          _push4(ssrRenderComponent(unref(DownOutlined), null, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createTextVNode(toDisplayString(unref(user)?.email || "Account") + " ", 1),
                            createVNode(unref(DownOutlined))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_a_button, {
                        type: "text",
                        class: "account-btn"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(user)?.email || "Account") + " ", 1),
                          createVNode(unref(DownOutlined))
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else {
              _push2(ssrRenderComponent(_component_NuxtLink, { to: "/login" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_button, {
                      type: "primary",
                      ghost: ""
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Sign in`);
                        } else {
                          return [
                            createTextVNode("Sign in")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_a_button, {
                        type: "primary",
                        ghost: ""
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Sign in")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(_component_a_drawer, {
              open: cartOpen.value,
              "onUpdate:open": ($event) => cartOpen.value = $event,
              title: "Your Cart",
              placement: "right",
              width: "420",
              closable: true
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(loading)) {
                    _push3(ssrRenderComponent(_component_a_spin, { style: { "width": "100%", "text-align": "center", "padding": "24px" } }, null, _parent3, _scopeId2));
                  } else if (!unref(isEmpty)) {
                    _push3(`<!--[-->`);
                    _push3(ssrRenderComponent(_component_a_list, {
                      "data-source": unref(items),
                      renderItem: renderCartItem,
                      loading: unref(loading)
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_a_divider, null, null, _parent3, _scopeId2));
                    _push3(`<div class="cart-footer" data-v-6fb9db81${_scopeId2}><div class="cart-total" data-v-6fb9db81${_scopeId2}><div data-v-6fb9db81${_scopeId2}><span class="total-label" data-v-6fb9db81${_scopeId2}>Items:</span> <span class="total-value" data-v-6fb9db81${_scopeId2}>${ssrInterpolate(unref(itemCount))}</span></div><div data-v-6fb9db81${_scopeId2}><span class="total-label" data-v-6fb9db81${_scopeId2}>Subtotal:</span> <span class="total-value" data-v-6fb9db81${_scopeId2}>€${ssrInterpolate(unref(totalPrice).toFixed(2))}</span></div></div>`);
                    _push3(ssrRenderComponent(_component_a_space, { style: { "width": "100%", "margin-top": "12px" } }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_button, {
                            block: "",
                            onClick: handleClearCart,
                            loading: unref(loading)
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` Clear Cart `);
                              } else {
                                return [
                                  createTextVNode(" Clear Cart ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_NuxtLink, {
                            to: "/cart",
                            style: { "flex": "1" }
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_button, {
                                  type: "primary",
                                  block: "",
                                  onClick: ($event) => cartOpen.value = false
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(` Go to Cart `);
                                    } else {
                                      return [
                                        createTextVNode(" Go to Cart ")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_button, {
                                    type: "primary",
                                    block: "",
                                    onClick: ($event) => cartOpen.value = false
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Go to Cart ")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_button, {
                              block: "",
                              onClick: handleClearCart,
                              loading: unref(loading)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Clear Cart ")
                              ]),
                              _: 1
                            }, 8, ["loading"]),
                            createVNode(_component_NuxtLink, {
                              to: "/cart",
                              style: { "flex": "1" }
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_button, {
                                  type: "primary",
                                  block: "",
                                  onClick: ($event) => cartOpen.value = false
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Go to Cart ")
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
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_NuxtLink, {
                      to: "/cart",
                      style: { "width": "100%", "display": "block", "margin-top": "8px" }
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_button, {
                            type: "primary",
                            block: "",
                            danger: "",
                            onClick: ($event) => cartOpen.value = false
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` Proceed to checkout `);
                              } else {
                                return [
                                  createTextVNode(" Proceed to checkout ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_button, {
                              type: "primary",
                              block: "",
                              danger: "",
                              onClick: ($event) => cartOpen.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Proceed to checkout ")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div><!--]-->`);
                  } else {
                    _push3(`<div class="empty-cart" data-v-6fb9db81${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(ShoppingCartOutlined), { style: { "font-size": "48px", "color": "#d9d9d9", "margin-bottom": "16px" } }, null, _parent3, _scopeId2));
                    _push3(`<div class="empty-text" data-v-6fb9db81${_scopeId2}>Your cart is empty</div><div class="empty-hint" data-v-6fb9db81${_scopeId2}>Add courses to get started</div>`);
                    _push3(ssrRenderComponent(_component_NuxtLink, { to: "/categories" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_button, {
                            type: "primary",
                            style: { "margin-top": "16px" },
                            onClick: ($event) => cartOpen.value = false
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
                        } else {
                          return [
                            createVNode(_component_a_button, {
                              type: "primary",
                              style: { "margin-top": "16px" },
                              onClick: ($event) => cartOpen.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Browse Courses ")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  }
                } else {
                  return [
                    unref(loading) ? (openBlock(), createBlock(_component_a_spin, {
                      key: 0,
                      style: { "width": "100%", "text-align": "center", "padding": "24px" }
                    })) : !unref(isEmpty) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                      createVNode(_component_a_list, {
                        "data-source": unref(items),
                        renderItem: renderCartItem,
                        loading: unref(loading)
                      }, null, 8, ["data-source", "loading"]),
                      createVNode(_component_a_divider),
                      createVNode("div", { class: "cart-footer" }, [
                        createVNode("div", { class: "cart-total" }, [
                          createVNode("div", null, [
                            createVNode("span", { class: "total-label" }, "Items:"),
                            createTextVNode(),
                            createVNode("span", { class: "total-value" }, toDisplayString(unref(itemCount)), 1)
                          ]),
                          createVNode("div", null, [
                            createVNode("span", { class: "total-label" }, "Subtotal:"),
                            createTextVNode(),
                            createVNode("span", { class: "total-value" }, "€" + toDisplayString(unref(totalPrice).toFixed(2)), 1)
                          ])
                        ]),
                        createVNode(_component_a_space, { style: { "width": "100%", "margin-top": "12px" } }, {
                          default: withCtx(() => [
                            createVNode(_component_a_button, {
                              block: "",
                              onClick: handleClearCart,
                              loading: unref(loading)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Clear Cart ")
                              ]),
                              _: 1
                            }, 8, ["loading"]),
                            createVNode(_component_NuxtLink, {
                              to: "/cart",
                              style: { "flex": "1" }
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_button, {
                                  type: "primary",
                                  block: "",
                                  onClick: ($event) => cartOpen.value = false
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Go to Cart ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_NuxtLink, {
                          to: "/cart",
                          style: { "width": "100%", "display": "block", "margin-top": "8px" }
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_button, {
                              type: "primary",
                              block: "",
                              danger: "",
                              onClick: ($event) => cartOpen.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Proceed to checkout ")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ]),
                          _: 1
                        })
                      ])
                    ], 64)) : (openBlock(), createBlock("div", {
                      key: 2,
                      class: "empty-cart"
                    }, [
                      createVNode(unref(ShoppingCartOutlined), { style: { "font-size": "48px", "color": "#d9d9d9", "margin-bottom": "16px" } }),
                      createVNode("div", { class: "empty-text" }, "Your cart is empty"),
                      createVNode("div", { class: "empty-hint" }, "Add courses to get started"),
                      createVNode(_component_NuxtLink, { to: "/categories" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_button, {
                            type: "primary",
                            style: { "margin-top": "16px" },
                            onClick: ($event) => cartOpen.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Browse Courses ")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ]),
                        _: 1
                      })
                    ]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "header-inner" }, [
                createVNode(_component_NuxtLink, {
                  to: "/",
                  class: "logo"
                }, {
                  default: withCtx(() => [
                    createVNode("img", {
                      alt: "Byway",
                      class: "logo-image"
                    }),
                    createVNode("span", { class: "logo-text" }, "Byway")
                  ]),
                  _: 1
                }),
                createVNode("nav", { class: "nav" }, [
                  createVNode(_component_NuxtLink, {
                    to: "/categories",
                    class: "nav-link",
                    "exact-active-class": "nav-active"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Browse")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_NuxtLink, {
                    to: "/course-author",
                    class: "nav-link",
                    "exact-active-class": "nav-active"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Teach")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_NuxtLink, {
                    to: "/institutions",
                    class: "nav-link",
                    "exact-active-class": "nav-active"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Institutions")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_NuxtLink, {
                    to: "/students",
                    class: "nav-link",
                    "exact-active-class": "nav-active"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("My Learning")
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "actions" }, [
                  unref(isLoggedIn) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    createVNode(_component_a_badge, {
                      count: unref(itemCount),
                      "number-style": { backgroundColor: "#52c41a" },
                      offset: [8, 0]
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_button, {
                          type: "text",
                          class: "cart-btn",
                          onClick: ($event) => cartOpen.value = true
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(ShoppingCartOutlined)),
                            createVNode("span", { class: "ml-1" }, "Cart")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ]),
                      _: 1
                    }, 8, ["count"]),
                    createVNode(_component_a_dropdown, { trigger: "click" }, {
                      overlay: withCtx(() => [
                        createVNode(_component_a_menu, null, {
                          default: withCtx(() => [
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/students" }, {
                                  default: withCtx(() => [
                                    createTextVNode("My Learning")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_NuxtLink, { to: "/cart" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Cart")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, { onClick: doLogout }, {
                              default: withCtx(() => [
                                createTextVNode("Logout")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      default: withCtx(() => [
                        createVNode(_component_a_button, {
                          type: "text",
                          class: "account-btn"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(user)?.email || "Account") + " ", 1),
                            createVNode(unref(DownOutlined))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ], 64)) : (openBlock(), createBlock(_component_NuxtLink, {
                    key: 1,
                    to: "/login"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_button, {
                        type: "primary",
                        ghost: ""
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Sign in")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }))
                ])
              ]),
              createVNode(_component_a_drawer, {
                open: cartOpen.value,
                "onUpdate:open": ($event) => cartOpen.value = $event,
                title: "Your Cart",
                placement: "right",
                width: "420",
                closable: true
              }, {
                default: withCtx(() => [
                  unref(loading) ? (openBlock(), createBlock(_component_a_spin, {
                    key: 0,
                    style: { "width": "100%", "text-align": "center", "padding": "24px" }
                  })) : !unref(isEmpty) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                    createVNode(_component_a_list, {
                      "data-source": unref(items),
                      renderItem: renderCartItem,
                      loading: unref(loading)
                    }, null, 8, ["data-source", "loading"]),
                    createVNode(_component_a_divider),
                    createVNode("div", { class: "cart-footer" }, [
                      createVNode("div", { class: "cart-total" }, [
                        createVNode("div", null, [
                          createVNode("span", { class: "total-label" }, "Items:"),
                          createTextVNode(),
                          createVNode("span", { class: "total-value" }, toDisplayString(unref(itemCount)), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("span", { class: "total-label" }, "Subtotal:"),
                          createTextVNode(),
                          createVNode("span", { class: "total-value" }, "€" + toDisplayString(unref(totalPrice).toFixed(2)), 1)
                        ])
                      ]),
                      createVNode(_component_a_space, { style: { "width": "100%", "margin-top": "12px" } }, {
                        default: withCtx(() => [
                          createVNode(_component_a_button, {
                            block: "",
                            onClick: handleClearCart,
                            loading: unref(loading)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Clear Cart ")
                            ]),
                            _: 1
                          }, 8, ["loading"]),
                          createVNode(_component_NuxtLink, {
                            to: "/cart",
                            style: { "flex": "1" }
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, {
                                type: "primary",
                                block: "",
                                onClick: ($event) => cartOpen.value = false
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Go to Cart ")
                                ]),
                                _: 1
                              }, 8, ["onClick"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_NuxtLink, {
                        to: "/cart",
                        style: { "width": "100%", "display": "block", "margin-top": "8px" }
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_button, {
                            type: "primary",
                            block: "",
                            danger: "",
                            onClick: ($event) => cartOpen.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Proceed to checkout ")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ]),
                        _: 1
                      })
                    ])
                  ], 64)) : (openBlock(), createBlock("div", {
                    key: 2,
                    class: "empty-cart"
                  }, [
                    createVNode(unref(ShoppingCartOutlined), { style: { "font-size": "48px", "color": "#d9d9d9", "margin-bottom": "16px" } }),
                    createVNode("div", { class: "empty-text" }, "Your cart is empty"),
                    createVNode("div", { class: "empty-hint" }, "Add courses to get started"),
                    createVNode(_component_NuxtLink, { to: "/categories" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_button, {
                          type: "primary",
                          style: { "margin-top": "16px" },
                          onClick: ($event) => cartOpen.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Browse Courses ")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ]),
                      _: 1
                    })
                  ]))
                ]),
                _: 1
              }, 8, ["open", "onUpdate:open"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../packages/shared-ui/src/components/Header.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Header = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6fb9db81"]]);

export { Header as H };
//# sourceMappingURL=Header-DscPRdFw.mjs.map
