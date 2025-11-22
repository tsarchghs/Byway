import { defineComponent, computed, ref, reactive, resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, withModifiers, h, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { FileTextOutlined } from '@ant-design/icons-vue';
import { u as useAuth } from './useAuth-B8D9e8en.mjs';
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
import '@apollo/client/core/index.js';
import '@apollo/client/link/context/index.js';
import '@vue/apollo-composable';

const AUTH_API = "http://localhost:4000/api/authentication/graphql";
const EC_API = "http://localhost:4000/api/ecommerce/graphql";
const GQL_BILLING_PORTAL = `
  mutation Portal($returnUrl:String!) {
    createBillingPortal(returnUrl:$returnUrl){
      url
    }
  }
`;
const GQL_UPDATE_PROFILE = `
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      email
      name
      avatar
      role
    }
  }
`;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "profile-page",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuth();
    const router = useRouter();
    const isLoggedIn = computed(() => auth.isLoggedIn.value);
    const token = computed(() => auth.token.value || "");
    const userEmail = computed(() => auth.user.value?.email || "");
    const tabKey = ref("overview");
    const loading = reactive({
      profile: false,
      courses: false,
      orders: false,
      portal: false,
      save: false
    });
    const portalError = ref(null);
    const saveError = ref(null);
    const profile = reactive({});
    const memberSince = ref(null);
    const myCourses = ref([]);
    const orders = ref([]);
    const recentCourses = computed(() => myCourses.value.slice(0, 5));
    const recentOrders = computed(() => orders.value.slice(0, 5));
    const stats = reactive({
      enrolled: 0,
      orders: 0,
      wishlist: 0,
      completedLessons: 0
    });
    const edit = reactive({
      name: "",
      title: "",
      bio: ""
    });
    function money(v, ccy = "EUR") {
      return new Intl.NumberFormat("de-DE", { style: "currency", currency: ccy }).format(v || 0);
    }
    function fmtDate(s) {
      try {
        return new Date(s).toLocaleString();
      } catch {
        return s;
      }
    }
    function orderStatusColor(status) {
      const s = (status || "").toLowerCase();
      if (s.includes("paid") || s.includes("succeeded")) return "green";
      if (s.includes("pending") || s.includes("requires")) return "gold";
      if (s.includes("failed") || s.includes("canceled")) return "red";
      return "blue";
    }
    function logout() {
      auth.logout();
    }
    function goCourse(id) {
      router.push(`/course/${encodeURIComponent(id)}`);
    }
    async function gfetch(endpoint, query, variables) {
      const headers = { "Content-Type": "application/json" };
      if (token.value) headers.Authorization = `Bearer ${token.value}`;
      const res = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify({ query, variables }) });
      const json = await res.json();
      if (json.errors?.length) throw new Error(json.errors[0].message || "GraphQL error");
      return json.data;
    }
    function renderCourseRow(item) {
      return h(
        "div",
        { class: "row-wrap", onClick: () => goCourse(item.id) },
        [
          h("img", { class: "row-thumb", src: item.thumb || "/course-thumb.jpg", alt: item.title }),
          h("div", { class: "row-main" }, [
            h("div", { class: "row-title" }, item.title),
            h("div", { class: "muted" }, `${item.category || "—"} · ${item.level || "All levels"}`),
            h("div", { class: "row-inline" }, [
              h("span", { class: "muted small" }, `Progress: ${item.progress?.percent ?? 0}%`)
            ])
          ])
        ]
      );
    }
    function renderOrderRow(item) {
      return h("div", { class: "row-wrap" }, [
        h("div", { class: "row-icon" }, [h(FileTextOutlined)]),
        h("div", { class: "row-main" }, [
          h("div", { class: "row-title" }, `Order ${item.id.slice(0, 8)}…`),
          h("div", { class: "muted small" }, fmtDate(item.createdAt)),
          h("div", { class: "row-inline" }, [
            h("span", { class: "muted small" }, (item.items || []).map((i) => i.title || i.courseId).join(", ") || "—")
          ])
        ]),
        h("div", { class: "row-right" }, [
          h("div", { class: "row-amount" }, money(item.total || 0, item.currency || "EUR")),
          h("div", null, [h("span", null, [h("span", {
            class: `status-dot ${orderStatusColor(item.status)}`
          })])])
        ])
      ]);
    }
    const orderColumns = [
      { title: "Order ID", dataIndex: "id", key: "id" },
      { title: "Created", dataIndex: "createdAt", key: "createdAt" },
      { title: "Items", dataIndex: "items", key: "items" },
      { title: "Status", dataIndex: "status", key: "status" },
      { title: "Total", dataIndex: "total", key: "total", align: "right" }
    ];
    async function openBillingPortal() {
      portalError.value = null;
      loading.portal = true;
      try {
        const data = await gfetch(
          EC_API,
          GQL_BILLING_PORTAL,
          { returnUrl: (void 0).location.origin + "/profile-page" }
        );
        const url = data?.createBillingPortal?.url;
        if (!url) throw new Error("No portal URL returned");
        (void 0).location.href = url;
      } catch (e) {
        portalError.value = e?.message || "Failed to open billing portal";
        message.error(portalError.value);
      } finally {
        loading.portal = false;
      }
    }
    function createTestInvoice() {
      message.info("This button is a placeholder for a dev/test invoice action.");
    }
    async function saveSettings() {
      saveError.value = null;
      loading.save = true;
      try {
        const input = {
          name: edit.name || profile.name || "",
          title: edit.title || "",
          bio: edit.bio || ""
        };
        const res = await gfetch(AUTH_API, GQL_UPDATE_PROFILE, { input });
        if (res?.updateProfile) {
          profile.name = res.updateProfile.name || profile.name;
          message.success("Profile updated");
        } else {
          message.success("Settings saved (local only)");
        }
      } catch (e) {
        saveError.value = e?.message || "Failed to save settings";
        message.error(saveError.value);
      } finally {
        loading.save = false;
      }
    }
    function resetSettings() {
      edit.name = profile.name || "";
      edit.title = "";
      edit.bio = "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_avatar = resolveComponent("a-avatar");
      const _component_a_descriptions = resolveComponent("a-descriptions");
      const _component_a_descriptions_item = resolveComponent("a-descriptions-item");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_statistic = resolveComponent("a-statistic");
      const _component_a_tabs = resolveComponent("a-tabs");
      const _component_a_tab_pane = resolveComponent("a-tab-pane");
      const _component_a_empty = resolveComponent("a-empty");
      const _component_a_list = resolveComponent("a-list");
      const _component_a_alert = resolveComponent("a-alert");
      const _component_a_skeleton = resolveComponent("a-skeleton");
      const _component_a_image = resolveComponent("a-image");
      const _component_a_progress = resolveComponent("a-progress");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_typography_paragraph = resolveComponent("a-typography-paragraph");
      const _component_a_form = resolveComponent("a-form");
      const _component_a_form_item = resolveComponent("a-form-item");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_textarea = resolveComponent("a-textarea");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "profile-page" }, _attrs))} data-v-1fb6b729>`);
      _push(ssrRenderComponent(_component_a_page_header, {
        class: "profile-header",
        title: "Your Profile",
        "sub-title": userEmail.value || "Welcome to Byway"
      }, {
        tags: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (isLoggedIn.value) {
              _push2(ssrRenderComponent(_component_a_tag, { color: "blue" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Logged In`);
                  } else {
                    return [
                      createTextVNode("Logged In")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_component_a_tag, { color: "red" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Guest`);
                  } else {
                    return [
                      createTextVNode("Guest")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
          } else {
            return [
              isLoggedIn.value ? (openBlock(), createBlock(_component_a_tag, {
                key: 0,
                color: "blue"
              }, {
                default: withCtx(() => [
                  createTextVNode("Logged In")
                ]),
                _: 1
              })) : (openBlock(), createBlock(_component_a_tag, {
                key: 1,
                color: "red"
              }, {
                default: withCtx(() => [
                  createTextVNode("Guest")
                ]),
                _: 1
              }))
            ];
          }
        }),
        extra: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_space, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (!isLoggedIn.value) {
                    _push3(ssrRenderComponent(_component_a_button, {
                      type: "primary",
                      href: "/auth/login"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Log in`);
                        } else {
                          return [
                            createTextVNode("Log in")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (isLoggedIn.value) {
                    _push3(ssrRenderComponent(_component_a_button, {
                      onClick: logout,
                      danger: ""
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Logout`);
                        } else {
                          return [
                            createTextVNode("Logout")
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
                    !isLoggedIn.value ? (openBlock(), createBlock(_component_a_button, {
                      key: 0,
                      type: "primary",
                      href: "/auth/login"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Log in")
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    isLoggedIn.value ? (openBlock(), createBlock(_component_a_button, {
                      key: 1,
                      onClick: logout,
                      danger: ""
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Logout")
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
              createVNode(_component_a_space, null, {
                default: withCtx(() => [
                  !isLoggedIn.value ? (openBlock(), createBlock(_component_a_button, {
                    key: 0,
                    type: "primary",
                    href: "/auth/login"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Log in")
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  isLoggedIn.value ? (openBlock(), createBlock(_component_a_button, {
                    key: 1,
                    onClick: logout,
                    danger: ""
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Logout")
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 1
              })
            ];
          }
        }),
        avatar: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_avatar, {
              size: 64,
              src: profile.avatar || "/user.png"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_avatar, {
                size: 64,
                src: profile.avatar || "/user.png"
              }, null, 8, ["src"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_descriptions, {
              column: 2,
              size: "small",
              class: "profile-desc"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_descriptions_item, { label: "Name" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(profile.name || "—")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(profile.name || "—"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_descriptions_item, { label: "Email" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(userEmail.value || "—")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(userEmail.value || "—"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_descriptions_item, { label: "Member Since" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(memberSince.value || "—")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(memberSince.value || "—"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_descriptions_item, { label: "Role" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(profile.role || "Student")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(profile.role || "Student"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_descriptions_item, { label: "Name" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(profile.name || "—"), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_descriptions_item, { label: "Email" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(userEmail.value || "—"), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_descriptions_item, { label: "Member Since" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(memberSince.value || "—"), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_descriptions_item, { label: "Role" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(profile.role || "Student"), 1)
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
              createVNode(_component_a_descriptions, {
                column: 2,
                size: "small",
                class: "profile-desc"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_descriptions_item, { label: "Name" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(profile.name || "—"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_descriptions_item, { label: "Email" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(userEmail.value || "—"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_descriptions_item, { label: "Member Since" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(memberSince.value || "—"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_descriptions_item, { label: "Role" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(profile.role || "Student"), 1)
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
      _push(ssrRenderComponent(_component_a_card, {
        class: "stats-card",
        bordered: true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_row, { gutter: [16, 16] }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 12,
                    md: 6
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_statistic, {
                          title: "Enrolled Courses",
                          value: stats.enrolled
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_statistic, {
                            title: "Enrolled Courses",
                            value: stats.enrolled
                          }, null, 8, ["value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 12,
                    md: 6
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_statistic, {
                          title: "Orders",
                          value: stats.orders
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_statistic, {
                            title: "Orders",
                            value: stats.orders
                          }, null, 8, ["value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 12,
                    md: 6
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_statistic, {
                          title: "Wishlist",
                          value: stats.wishlist
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_statistic, {
                            title: "Wishlist",
                            value: stats.wishlist
                          }, null, 8, ["value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 12,
                    md: 6
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_statistic, {
                          title: "Completed Lessons",
                          value: stats.completedLessons
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_statistic, {
                            title: "Completed Lessons",
                            value: stats.completedLessons
                          }, null, 8, ["value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_col, {
                      xs: 12,
                      md: 6
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_statistic, {
                          title: "Enrolled Courses",
                          value: stats.enrolled
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, {
                      xs: 12,
                      md: 6
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_statistic, {
                          title: "Orders",
                          value: stats.orders
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, {
                      xs: 12,
                      md: 6
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_statistic, {
                          title: "Wishlist",
                          value: stats.wishlist
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, {
                      xs: 12,
                      md: 6
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_statistic, {
                          title: "Completed Lessons",
                          value: stats.completedLessons
                        }, null, 8, ["value"])
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
              createVNode(_component_a_row, { gutter: [16, 16] }, {
                default: withCtx(() => [
                  createVNode(_component_a_col, {
                    xs: 12,
                    md: 6
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_statistic, {
                        title: "Enrolled Courses",
                        value: stats.enrolled
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_col, {
                    xs: 12,
                    md: 6
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_statistic, {
                        title: "Orders",
                        value: stats.orders
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_col, {
                    xs: 12,
                    md: 6
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_statistic, {
                        title: "Wishlist",
                        value: stats.wishlist
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_col, {
                    xs: 12,
                    md: 6
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_statistic, {
                        title: "Completed Lessons",
                        value: stats.completedLessons
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
      }, _parent));
      _push(ssrRenderComponent(_component_a_card, {
        class: "body-card",
        bordered: true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_tabs, {
              activeKey: tabKey.value,
              "onUpdate:activeKey": ($event) => tabKey.value = $event
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_tab_pane, {
                    key: "overview",
                    tab: "Overview"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_row, { gutter: [16, 16] }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_col, {
                                xs: 24,
                                lg: 12
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_card, {
                                      title: "Recent Courses",
                                      loading: loading.courses
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          if (!recentCourses.value.length) {
                                            _push7(ssrRenderComponent(_component_a_empty, { description: "No recent courses yet" }, null, _parent7, _scopeId6));
                                          } else {
                                            _push7(ssrRenderComponent(_component_a_list, {
                                              "item-layout": "horizontal",
                                              "data-source": recentCourses.value,
                                              renderItem: renderCourseRow
                                            }, null, _parent7, _scopeId6));
                                          }
                                        } else {
                                          return [
                                            !recentCourses.value.length ? (openBlock(), createBlock(_component_a_empty, {
                                              key: 0,
                                              description: "No recent courses yet"
                                            })) : (openBlock(), createBlock(_component_a_list, {
                                              key: 1,
                                              "item-layout": "horizontal",
                                              "data-source": recentCourses.value,
                                              renderItem: renderCourseRow
                                            }, null, 8, ["data-source"]))
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_card, {
                                        title: "Recent Courses",
                                        loading: loading.courses
                                      }, {
                                        default: withCtx(() => [
                                          !recentCourses.value.length ? (openBlock(), createBlock(_component_a_empty, {
                                            key: 0,
                                            description: "No recent courses yet"
                                          })) : (openBlock(), createBlock(_component_a_list, {
                                            key: 1,
                                            "item-layout": "horizontal",
                                            "data-source": recentCourses.value,
                                            renderItem: renderCourseRow
                                          }, null, 8, ["data-source"]))
                                        ]),
                                        _: 1
                                      }, 8, ["loading"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_col, {
                                xs: 24,
                                lg: 12
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_card, {
                                      title: "Recent Orders",
                                      loading: loading.orders
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          if (!recentOrders.value.length) {
                                            _push7(ssrRenderComponent(_component_a_empty, { description: "No orders yet" }, null, _parent7, _scopeId6));
                                          } else {
                                            _push7(ssrRenderComponent(_component_a_list, {
                                              "item-layout": "horizontal",
                                              "data-source": recentOrders.value,
                                              renderItem: renderOrderRow
                                            }, null, _parent7, _scopeId6));
                                          }
                                        } else {
                                          return [
                                            !recentOrders.value.length ? (openBlock(), createBlock(_component_a_empty, {
                                              key: 0,
                                              description: "No orders yet"
                                            })) : (openBlock(), createBlock(_component_a_list, {
                                              key: 1,
                                              "item-layout": "horizontal",
                                              "data-source": recentOrders.value,
                                              renderItem: renderOrderRow
                                            }, null, 8, ["data-source"]))
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_card, {
                                        title: "Recent Orders",
                                        loading: loading.orders
                                      }, {
                                        default: withCtx(() => [
                                          !recentOrders.value.length ? (openBlock(), createBlock(_component_a_empty, {
                                            key: 0,
                                            description: "No orders yet"
                                          })) : (openBlock(), createBlock(_component_a_list, {
                                            key: 1,
                                            "item-layout": "horizontal",
                                            "data-source": recentOrders.value,
                                            renderItem: renderOrderRow
                                          }, null, 8, ["data-source"]))
                                        ]),
                                        _: 1
                                      }, 8, ["loading"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_col, {
                                  xs: 24,
                                  lg: 12
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, {
                                      title: "Recent Courses",
                                      loading: loading.courses
                                    }, {
                                      default: withCtx(() => [
                                        !recentCourses.value.length ? (openBlock(), createBlock(_component_a_empty, {
                                          key: 0,
                                          description: "No recent courses yet"
                                        })) : (openBlock(), createBlock(_component_a_list, {
                                          key: 1,
                                          "item-layout": "horizontal",
                                          "data-source": recentCourses.value,
                                          renderItem: renderCourseRow
                                        }, null, 8, ["data-source"]))
                                      ]),
                                      _: 1
                                    }, 8, ["loading"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_col, {
                                  xs: 24,
                                  lg: 12
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, {
                                      title: "Recent Orders",
                                      loading: loading.orders
                                    }, {
                                      default: withCtx(() => [
                                        !recentOrders.value.length ? (openBlock(), createBlock(_component_a_empty, {
                                          key: 0,
                                          description: "No orders yet"
                                        })) : (openBlock(), createBlock(_component_a_list, {
                                          key: 1,
                                          "item-layout": "horizontal",
                                          "data-source": recentOrders.value,
                                          renderItem: renderOrderRow
                                        }, null, 8, ["data-source"]))
                                      ]),
                                      _: 1
                                    }, 8, ["loading"])
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
                          createVNode(_component_a_row, { gutter: [16, 16] }, {
                            default: withCtx(() => [
                              createVNode(_component_a_col, {
                                xs: 24,
                                lg: 12
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, {
                                    title: "Recent Courses",
                                    loading: loading.courses
                                  }, {
                                    default: withCtx(() => [
                                      !recentCourses.value.length ? (openBlock(), createBlock(_component_a_empty, {
                                        key: 0,
                                        description: "No recent courses yet"
                                      })) : (openBlock(), createBlock(_component_a_list, {
                                        key: 1,
                                        "item-layout": "horizontal",
                                        "data-source": recentCourses.value,
                                        renderItem: renderCourseRow
                                      }, null, 8, ["data-source"]))
                                    ]),
                                    _: 1
                                  }, 8, ["loading"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_col, {
                                xs: 24,
                                lg: 12
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, {
                                    title: "Recent Orders",
                                    loading: loading.orders
                                  }, {
                                    default: withCtx(() => [
                                      !recentOrders.value.length ? (openBlock(), createBlock(_component_a_empty, {
                                        key: 0,
                                        description: "No orders yet"
                                      })) : (openBlock(), createBlock(_component_a_list, {
                                        key: 1,
                                        "item-layout": "horizontal",
                                        "data-source": recentOrders.value,
                                        renderItem: renderOrderRow
                                      }, null, 8, ["data-source"]))
                                    ]),
                                    _: 1
                                  }, 8, ["loading"])
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
                  _push3(ssrRenderComponent(_component_a_tab_pane, {
                    key: "courses",
                    tab: "My Courses"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (!isLoggedIn.value) {
                          _push4(ssrRenderComponent(_component_a_alert, {
                            type: "info",
                            "show-icon": "",
                            message: "Log in to see your enrolled courses.",
                            style: { "margin-bottom": "12px" }
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        if (loading.courses) {
                          _push4(ssrRenderComponent(_component_a_skeleton, {
                            active: "",
                            paragraph: { rows: 5 }
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!--[-->`);
                          if (!myCourses.value.length) {
                            _push4(ssrRenderComponent(_component_a_empty, { description: "You have no enrollments yet" }, null, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(ssrRenderComponent(_component_a_row, { gutter: [16, 16] }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<!--[-->`);
                                ssrRenderList(myCourses.value, (c) => {
                                  _push5(ssrRenderComponent(_component_a_col, {
                                    key: c.id,
                                    xs: 24,
                                    md: 12,
                                    lg: 8
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_component_a_card, {
                                          class: "course-card",
                                          hoverable: true,
                                          onClick: ($event) => goCourse(c.id)
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(_component_a_image, {
                                                src: c.thumb || "/course-thumb.jpg",
                                                class: "course-thumb",
                                                preview: false
                                              }, null, _parent7, _scopeId6));
                                              _push7(`<div class="course-meta" data-v-1fb6b729${_scopeId6}><div class="title" data-v-1fb6b729${_scopeId6}>${ssrInterpolate(c.title)}</div><div class="muted" data-v-1fb6b729${_scopeId6}>${ssrInterpolate(c.category || "—")} · ${ssrInterpolate(c.level || "All levels")}</div>`);
                                              _push7(ssrRenderComponent(_component_a_progress, {
                                                percent: c.progress?.percent || 0,
                                                size: "small",
                                                status: "active"
                                              }, null, _parent7, _scopeId6));
                                              _push7(`<div class="muted small" data-v-1fb6b729${_scopeId6}>${ssrInterpolate(c.progress?.completedLessons || 0)}/${ssrInterpolate(c.progress?.totalLessons || 0)} lessons </div></div>`);
                                            } else {
                                              return [
                                                createVNode(_component_a_image, {
                                                  src: c.thumb || "/course-thumb.jpg",
                                                  class: "course-thumb",
                                                  preview: false
                                                }, null, 8, ["src"]),
                                                createVNode("div", { class: "course-meta" }, [
                                                  createVNode("div", { class: "title" }, toDisplayString(c.title), 1),
                                                  createVNode("div", { class: "muted" }, toDisplayString(c.category || "—") + " · " + toDisplayString(c.level || "All levels"), 1),
                                                  createVNode(_component_a_progress, {
                                                    percent: c.progress?.percent || 0,
                                                    size: "small",
                                                    status: "active"
                                                  }, null, 8, ["percent"]),
                                                  createVNode("div", { class: "muted small" }, toDisplayString(c.progress?.completedLessons || 0) + "/" + toDisplayString(c.progress?.totalLessons || 0) + " lessons ", 1)
                                                ])
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(_component_a_card, {
                                            class: "course-card",
                                            hoverable: true,
                                            onClick: ($event) => goCourse(c.id)
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_image, {
                                                src: c.thumb || "/course-thumb.jpg",
                                                class: "course-thumb",
                                                preview: false
                                              }, null, 8, ["src"]),
                                              createVNode("div", { class: "course-meta" }, [
                                                createVNode("div", { class: "title" }, toDisplayString(c.title), 1),
                                                createVNode("div", { class: "muted" }, toDisplayString(c.category || "—") + " · " + toDisplayString(c.level || "All levels"), 1),
                                                createVNode(_component_a_progress, {
                                                  percent: c.progress?.percent || 0,
                                                  size: "small",
                                                  status: "active"
                                                }, null, 8, ["percent"]),
                                                createVNode("div", { class: "muted small" }, toDisplayString(c.progress?.completedLessons || 0) + "/" + toDisplayString(c.progress?.totalLessons || 0) + " lessons ", 1)
                                              ])
                                            ]),
                                            _: 2
                                          }, 1032, ["onClick"])
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                });
                                _push5(`<!--]-->`);
                              } else {
                                return [
                                  (openBlock(true), createBlock(Fragment, null, renderList(myCourses.value, (c) => {
                                    return openBlock(), createBlock(_component_a_col, {
                                      key: c.id,
                                      xs: 24,
                                      md: 12,
                                      lg: 8
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_card, {
                                          class: "course-card",
                                          hoverable: true,
                                          onClick: ($event) => goCourse(c.id)
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_image, {
                                              src: c.thumb || "/course-thumb.jpg",
                                              class: "course-thumb",
                                              preview: false
                                            }, null, 8, ["src"]),
                                            createVNode("div", { class: "course-meta" }, [
                                              createVNode("div", { class: "title" }, toDisplayString(c.title), 1),
                                              createVNode("div", { class: "muted" }, toDisplayString(c.category || "—") + " · " + toDisplayString(c.level || "All levels"), 1),
                                              createVNode(_component_a_progress, {
                                                percent: c.progress?.percent || 0,
                                                size: "small",
                                                status: "active"
                                              }, null, 8, ["percent"]),
                                              createVNode("div", { class: "muted small" }, toDisplayString(c.progress?.completedLessons || 0) + "/" + toDisplayString(c.progress?.totalLessons || 0) + " lessons ", 1)
                                            ])
                                          ]),
                                          _: 2
                                        }, 1032, ["onClick"])
                                      ]),
                                      _: 2
                                    }, 1024);
                                  }), 128))
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`<!--]-->`);
                        }
                      } else {
                        return [
                          !isLoggedIn.value ? (openBlock(), createBlock(_component_a_alert, {
                            key: 0,
                            type: "info",
                            "show-icon": "",
                            message: "Log in to see your enrolled courses.",
                            style: { "margin-bottom": "12px" }
                          })) : createCommentVNode("", true),
                          loading.courses ? (openBlock(), createBlock(_component_a_skeleton, {
                            key: 1,
                            active: "",
                            paragraph: { rows: 5 }
                          })) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                            !myCourses.value.length ? (openBlock(), createBlock(_component_a_empty, {
                              key: 0,
                              description: "You have no enrollments yet"
                            })) : createCommentVNode("", true),
                            createVNode(_component_a_row, { gutter: [16, 16] }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(myCourses.value, (c) => {
                                  return openBlock(), createBlock(_component_a_col, {
                                    key: c.id,
                                    xs: 24,
                                    md: 12,
                                    lg: 8
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_card, {
                                        class: "course-card",
                                        hoverable: true,
                                        onClick: ($event) => goCourse(c.id)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_image, {
                                            src: c.thumb || "/course-thumb.jpg",
                                            class: "course-thumb",
                                            preview: false
                                          }, null, 8, ["src"]),
                                          createVNode("div", { class: "course-meta" }, [
                                            createVNode("div", { class: "title" }, toDisplayString(c.title), 1),
                                            createVNode("div", { class: "muted" }, toDisplayString(c.category || "—") + " · " + toDisplayString(c.level || "All levels"), 1),
                                            createVNode(_component_a_progress, {
                                              percent: c.progress?.percent || 0,
                                              size: "small",
                                              status: "active"
                                            }, null, 8, ["percent"]),
                                            createVNode("div", { class: "muted small" }, toDisplayString(c.progress?.completedLessons || 0) + "/" + toDisplayString(c.progress?.totalLessons || 0) + " lessons ", 1)
                                          ])
                                        ]),
                                        _: 2
                                      }, 1032, ["onClick"])
                                    ]),
                                    _: 2
                                  }, 1024);
                                }), 128))
                              ]),
                              _: 1
                            })
                          ], 64))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_tab_pane, {
                    key: "orders",
                    tab: "Orders & Invoices"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (!isLoggedIn.value) {
                          _push4(ssrRenderComponent(_component_a_alert, {
                            type: "info",
                            "show-icon": "",
                            message: "Log in to see your orders.",
                            style: { "margin-bottom": "12px" }
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        if (loading.orders) {
                          _push4(ssrRenderComponent(_component_a_skeleton, {
                            active: "",
                            paragraph: { rows: 5 }
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!--[-->`);
                          if (!orders.value.length) {
                            _push4(ssrRenderComponent(_component_a_empty, { description: "You don't have any orders yet" }, null, _parent4, _scopeId3));
                          } else {
                            _push4(ssrRenderComponent(_component_a_table, {
                              "data-source": orders.value,
                              columns: orderColumns,
                              "row-key": "id",
                              size: "middle",
                              pagination: { pageSize: 5 }
                            }, {
                              bodyCell: withCtx(({ column, record }, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  if (column.key === "items") {
                                    _push5(ssrRenderComponent(_component_a_space, {
                                      direction: "vertical",
                                      size: "small"
                                    }, {
                                      default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(`<!--[-->`);
                                          ssrRenderList(record.items || [], (it, idx) => {
                                            _push6(`<div class="muted" data-v-1fb6b729${_scopeId5}>${ssrInterpolate(it.title || it.courseId)} × ${ssrInterpolate(it.quantity || 1)}</div>`);
                                          });
                                          _push6(`<!--]-->`);
                                        } else {
                                          return [
                                            (openBlock(true), createBlock(Fragment, null, renderList(record.items || [], (it, idx) => {
                                              return openBlock(), createBlock("div", {
                                                key: idx,
                                                class: "muted"
                                              }, toDisplayString(it.title || it.courseId) + " × " + toDisplayString(it.quantity || 1), 1);
                                            }), 128))
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  } else if (column.key === "total") {
                                    _push5(`<span data-v-1fb6b729${_scopeId4}>${ssrInterpolate(money(record.total || 0, record.currency || "EUR"))}</span>`);
                                  } else if (column.key === "createdAt") {
                                    _push5(`<span data-v-1fb6b729${_scopeId4}>${ssrInterpolate(fmtDate(record.createdAt))}</span>`);
                                  } else if (column.key === "status") {
                                    _push5(ssrRenderComponent(_component_a_tag, {
                                      color: orderStatusColor(record.status)
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
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                } else {
                                  return [
                                    column.key === "items" ? (openBlock(), createBlock(_component_a_space, {
                                      key: 0,
                                      direction: "vertical",
                                      size: "small"
                                    }, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(record.items || [], (it, idx) => {
                                          return openBlock(), createBlock("div", {
                                            key: idx,
                                            class: "muted"
                                          }, toDisplayString(it.title || it.courseId) + " × " + toDisplayString(it.quantity || 1), 1);
                                        }), 128))
                                      ]),
                                      _: 2
                                    }, 1024)) : column.key === "total" ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(money(record.total || 0, record.currency || "EUR")), 1)) : column.key === "createdAt" ? (openBlock(), createBlock("span", { key: 2 }, toDisplayString(fmtDate(record.createdAt)), 1)) : column.key === "status" ? (openBlock(), createBlock(_component_a_tag, {
                                      key: 3,
                                      color: orderStatusColor(record.status)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(record.status), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["color"])) : createCommentVNode("", true)
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          }
                          _push4(`<!--]-->`);
                        }
                      } else {
                        return [
                          !isLoggedIn.value ? (openBlock(), createBlock(_component_a_alert, {
                            key: 0,
                            type: "info",
                            "show-icon": "",
                            message: "Log in to see your orders.",
                            style: { "margin-bottom": "12px" }
                          })) : createCommentVNode("", true),
                          loading.orders ? (openBlock(), createBlock(_component_a_skeleton, {
                            key: 1,
                            active: "",
                            paragraph: { rows: 5 }
                          })) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                            !orders.value.length ? (openBlock(), createBlock(_component_a_empty, {
                              key: 0,
                              description: "You don't have any orders yet"
                            })) : (openBlock(), createBlock(_component_a_table, {
                              key: 1,
                              "data-source": orders.value,
                              columns: orderColumns,
                              "row-key": "id",
                              size: "middle",
                              pagination: { pageSize: 5 }
                            }, {
                              bodyCell: withCtx(({ column, record }) => [
                                column.key === "items" ? (openBlock(), createBlock(_component_a_space, {
                                  key: 0,
                                  direction: "vertical",
                                  size: "small"
                                }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(record.items || [], (it, idx) => {
                                      return openBlock(), createBlock("div", {
                                        key: idx,
                                        class: "muted"
                                      }, toDisplayString(it.title || it.courseId) + " × " + toDisplayString(it.quantity || 1), 1);
                                    }), 128))
                                  ]),
                                  _: 2
                                }, 1024)) : column.key === "total" ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(money(record.total || 0, record.currency || "EUR")), 1)) : column.key === "createdAt" ? (openBlock(), createBlock("span", { key: 2 }, toDisplayString(fmtDate(record.createdAt)), 1)) : column.key === "status" ? (openBlock(), createBlock(_component_a_tag, {
                                  key: 3,
                                  color: orderStatusColor(record.status)
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(record.status), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["color"])) : createCommentVNode("", true)
                              ]),
                              _: 1
                            }, 8, ["data-source"]))
                          ], 64))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_tab_pane, {
                    key: "billing",
                    tab: "Billing"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_card, { title: "Payment Methods & Invoices" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_space, {
                                direction: "vertical",
                                style: { "width": "100%" }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_typography_paragraph, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(` Manage your payment methods, invoices and subscriptions through the Stripe customer portal. `);
                                        } else {
                                          return [
                                            createTextVNode(" Manage your payment methods, invoices and subscriptions through the Stripe customer portal. ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_space, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_button, {
                                            type: "primary",
                                            loading: loading.portal,
                                            onClick: openBillingPortal
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(` Open Stripe Portal `);
                                              } else {
                                                return [
                                                  createTextVNode(" Open Stripe Portal ")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_button, {
                                            loading: loading.portal,
                                            onClick: createTestInvoice
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(` Create Test Invoice (dev) `);
                                              } else {
                                                return [
                                                  createTextVNode(" Create Test Invoice (dev) ")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_button, {
                                              type: "primary",
                                              loading: loading.portal,
                                              onClick: openBillingPortal
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Open Stripe Portal ")
                                              ]),
                                              _: 1
                                            }, 8, ["loading"]),
                                            createVNode(_component_a_button, {
                                              loading: loading.portal,
                                              onClick: createTestInvoice
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Create Test Invoice (dev) ")
                                              ]),
                                              _: 1
                                            }, 8, ["loading"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    if (portalError.value) {
                                      _push6(ssrRenderComponent(_component_a_alert, {
                                        type: "error",
                                        message: portalError.value,
                                        "show-icon": "",
                                        style: { "margin-top": "8px" }
                                      }, null, _parent6, _scopeId5));
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                  } else {
                                    return [
                                      createVNode(_component_a_typography_paragraph, null, {
                                        default: withCtx(() => [
                                          createTextVNode(" Manage your payment methods, invoices and subscriptions through the Stripe customer portal. ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_space, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_button, {
                                            type: "primary",
                                            loading: loading.portal,
                                            onClick: openBillingPortal
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Open Stripe Portal ")
                                            ]),
                                            _: 1
                                          }, 8, ["loading"]),
                                          createVNode(_component_a_button, {
                                            loading: loading.portal,
                                            onClick: createTestInvoice
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Create Test Invoice (dev) ")
                                            ]),
                                            _: 1
                                          }, 8, ["loading"])
                                        ]),
                                        _: 1
                                      }),
                                      portalError.value ? (openBlock(), createBlock(_component_a_alert, {
                                        key: 0,
                                        type: "error",
                                        message: portalError.value,
                                        "show-icon": "",
                                        style: { "margin-top": "8px" }
                                      }, null, 8, ["message"])) : createCommentVNode("", true)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_space, {
                                  direction: "vertical",
                                  style: { "width": "100%" }
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_typography_paragraph, null, {
                                      default: withCtx(() => [
                                        createTextVNode(" Manage your payment methods, invoices and subscriptions through the Stripe customer portal. ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_space, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_button, {
                                          type: "primary",
                                          loading: loading.portal,
                                          onClick: openBillingPortal
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Open Stripe Portal ")
                                          ]),
                                          _: 1
                                        }, 8, ["loading"]),
                                        createVNode(_component_a_button, {
                                          loading: loading.portal,
                                          onClick: createTestInvoice
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Create Test Invoice (dev) ")
                                          ]),
                                          _: 1
                                        }, 8, ["loading"])
                                      ]),
                                      _: 1
                                    }),
                                    portalError.value ? (openBlock(), createBlock(_component_a_alert, {
                                      key: 0,
                                      type: "error",
                                      message: portalError.value,
                                      "show-icon": "",
                                      style: { "margin-top": "8px" }
                                    }, null, 8, ["message"])) : createCommentVNode("", true)
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
                          createVNode(_component_a_card, { title: "Payment Methods & Invoices" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_space, {
                                direction: "vertical",
                                style: { "width": "100%" }
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_typography_paragraph, null, {
                                    default: withCtx(() => [
                                      createTextVNode(" Manage your payment methods, invoices and subscriptions through the Stripe customer portal. ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_space, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        loading: loading.portal,
                                        onClick: openBillingPortal
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Open Stripe Portal ")
                                        ]),
                                        _: 1
                                      }, 8, ["loading"]),
                                      createVNode(_component_a_button, {
                                        loading: loading.portal,
                                        onClick: createTestInvoice
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Create Test Invoice (dev) ")
                                        ]),
                                        _: 1
                                      }, 8, ["loading"])
                                    ]),
                                    _: 1
                                  }),
                                  portalError.value ? (openBlock(), createBlock(_component_a_alert, {
                                    key: 0,
                                    type: "error",
                                    message: portalError.value,
                                    "show-icon": "",
                                    style: { "margin-top": "8px" }
                                  }, null, 8, ["message"])) : createCommentVNode("", true)
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
                  _push3(ssrRenderComponent(_component_a_tab_pane, {
                    key: "settings",
                    tab: "Settings"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_form, {
                          layout: "vertical",
                          class: "settings-form",
                          onSubmit: saveSettings
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_row, { gutter: [16, 16] }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_col, {
                                      xs: 24,
                                      md: 12
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_form_item, { label: "Full Name" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_a_input, {
                                                  value: edit.name,
                                                  "onUpdate:value": ($event) => edit.name = $event,
                                                  placeholder: "Your full name"
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(_component_a_input, {
                                                    value: edit.name,
                                                    "onUpdate:value": ($event) => edit.name = $event,
                                                    placeholder: "Your full name"
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_form_item, { label: "Full Name" }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_input, {
                                                  value: edit.name,
                                                  "onUpdate:value": ($event) => edit.name = $event,
                                                  placeholder: "Your full name"
                                                }, null, 8, ["value", "onUpdate:value"])
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_col, {
                                      xs: 24,
                                      md: 12
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_form_item, { label: "Public Title" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_a_input, {
                                                  value: edit.title,
                                                  "onUpdate:value": ($event) => edit.title = $event,
                                                  placeholder: "e.g. Frontend Developer"
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(_component_a_input, {
                                                    value: edit.title,
                                                    "onUpdate:value": ($event) => edit.title = $event,
                                                    placeholder: "e.g. Frontend Developer"
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_form_item, { label: "Public Title" }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_input, {
                                                  value: edit.title,
                                                  "onUpdate:value": ($event) => edit.title = $event,
                                                  placeholder: "e.g. Frontend Developer"
                                                }, null, 8, ["value", "onUpdate:value"])
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_col, { xs: 24 }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_form_item, { label: "Bio" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_a_textarea, {
                                                  value: edit.bio,
                                                  "onUpdate:value": ($event) => edit.bio = $event,
                                                  rows: 4,
                                                  placeholder: "Tell others about you…"
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(_component_a_textarea, {
                                                    value: edit.bio,
                                                    "onUpdate:value": ($event) => edit.bio = $event,
                                                    rows: 4,
                                                    placeholder: "Tell others about you…"
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_form_item, { label: "Bio" }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_textarea, {
                                                  value: edit.bio,
                                                  "onUpdate:value": ($event) => edit.bio = $event,
                                                  rows: 4,
                                                  placeholder: "Tell others about you…"
                                                }, null, 8, ["value", "onUpdate:value"])
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
                                      createVNode(_component_a_col, {
                                        xs: 24,
                                        md: 12
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_form_item, { label: "Full Name" }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_input, {
                                                value: edit.name,
                                                "onUpdate:value": ($event) => edit.name = $event,
                                                placeholder: "Your full name"
                                              }, null, 8, ["value", "onUpdate:value"])
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
                                          createVNode(_component_a_form_item, { label: "Public Title" }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_input, {
                                                value: edit.title,
                                                "onUpdate:value": ($event) => edit.title = $event,
                                                placeholder: "e.g. Frontend Developer"
                                              }, null, 8, ["value", "onUpdate:value"])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_col, { xs: 24 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_form_item, { label: "Bio" }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_textarea, {
                                                value: edit.bio,
                                                "onUpdate:value": ($event) => edit.bio = $event,
                                                rows: 4,
                                                placeholder: "Tell others about you…"
                                              }, null, 8, ["value", "onUpdate:value"])
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
                              _push5(ssrRenderComponent(_component_a_space, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_button, {
                                      type: "primary",
                                      loading: loading.save,
                                      onClick: saveSettings
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Save`);
                                        } else {
                                          return [
                                            createTextVNode("Save")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_button, { onClick: resetSettings }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Reset`);
                                        } else {
                                          return [
                                            createTextVNode("Reset")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        loading: loading.save,
                                        onClick: saveSettings
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Save")
                                        ]),
                                        _: 1
                                      }, 8, ["loading"]),
                                      createVNode(_component_a_button, { onClick: resetSettings }, {
                                        default: withCtx(() => [
                                          createTextVNode("Reset")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              if (saveError.value) {
                                _push5(ssrRenderComponent(_component_a_alert, {
                                  message: saveError.value,
                                  type: "error",
                                  "show-icon": "",
                                  style: { "margin-top": "8px" }
                                }, null, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createVNode(_component_a_row, { gutter: [16, 16] }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_col, {
                                      xs: 24,
                                      md: 12
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_form_item, { label: "Full Name" }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_input, {
                                              value: edit.name,
                                              "onUpdate:value": ($event) => edit.name = $event,
                                              placeholder: "Your full name"
                                            }, null, 8, ["value", "onUpdate:value"])
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
                                        createVNode(_component_a_form_item, { label: "Public Title" }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_input, {
                                              value: edit.title,
                                              "onUpdate:value": ($event) => edit.title = $event,
                                              placeholder: "e.g. Frontend Developer"
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_col, { xs: 24 }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_form_item, { label: "Bio" }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_textarea, {
                                              value: edit.bio,
                                              "onUpdate:value": ($event) => edit.bio = $event,
                                              rows: 4,
                                              placeholder: "Tell others about you…"
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      type: "primary",
                                      loading: loading.save,
                                      onClick: saveSettings
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Save")
                                      ]),
                                      _: 1
                                    }, 8, ["loading"]),
                                    createVNode(_component_a_button, { onClick: resetSettings }, {
                                      default: withCtx(() => [
                                        createTextVNode("Reset")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                saveError.value ? (openBlock(), createBlock(_component_a_alert, {
                                  key: 0,
                                  message: saveError.value,
                                  type: "error",
                                  "show-icon": "",
                                  style: { "margin-top": "8px" }
                                }, null, 8, ["message"])) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_form, {
                            layout: "vertical",
                            class: "settings-form",
                            onSubmit: withModifiers(saveSettings, ["prevent"])
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_row, { gutter: [16, 16] }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_col, {
                                    xs: 24,
                                    md: 12
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_form_item, { label: "Full Name" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_input, {
                                            value: edit.name,
                                            "onUpdate:value": ($event) => edit.name = $event,
                                            placeholder: "Your full name"
                                          }, null, 8, ["value", "onUpdate:value"])
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
                                      createVNode(_component_a_form_item, { label: "Public Title" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_input, {
                                            value: edit.title,
                                            "onUpdate:value": ($event) => edit.title = $event,
                                            placeholder: "e.g. Frontend Developer"
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_col, { xs: 24 }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_form_item, { label: "Bio" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_textarea, {
                                            value: edit.bio,
                                            "onUpdate:value": ($event) => edit.bio = $event,
                                            rows: 4,
                                            placeholder: "Tell others about you…"
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_space, null, {
                                default: withCtx(() => [
                                  createVNode(_component_a_button, {
                                    type: "primary",
                                    loading: loading.save,
                                    onClick: saveSettings
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Save")
                                    ]),
                                    _: 1
                                  }, 8, ["loading"]),
                                  createVNode(_component_a_button, { onClick: resetSettings }, {
                                    default: withCtx(() => [
                                      createTextVNode("Reset")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              saveError.value ? (openBlock(), createBlock(_component_a_alert, {
                                key: 0,
                                message: saveError.value,
                                type: "error",
                                "show-icon": "",
                                style: { "margin-top": "8px" }
                              }, null, 8, ["message"])) : createCommentVNode("", true)
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
                    createVNode(_component_a_tab_pane, {
                      key: "overview",
                      tab: "Overview"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_row, { gutter: [16, 16] }, {
                          default: withCtx(() => [
                            createVNode(_component_a_col, {
                              xs: 24,
                              lg: 12
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, {
                                  title: "Recent Courses",
                                  loading: loading.courses
                                }, {
                                  default: withCtx(() => [
                                    !recentCourses.value.length ? (openBlock(), createBlock(_component_a_empty, {
                                      key: 0,
                                      description: "No recent courses yet"
                                    })) : (openBlock(), createBlock(_component_a_list, {
                                      key: 1,
                                      "item-layout": "horizontal",
                                      "data-source": recentCourses.value,
                                      renderItem: renderCourseRow
                                    }, null, 8, ["data-source"]))
                                  ]),
                                  _: 1
                                }, 8, ["loading"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_col, {
                              xs: 24,
                              lg: 12
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, {
                                  title: "Recent Orders",
                                  loading: loading.orders
                                }, {
                                  default: withCtx(() => [
                                    !recentOrders.value.length ? (openBlock(), createBlock(_component_a_empty, {
                                      key: 0,
                                      description: "No orders yet"
                                    })) : (openBlock(), createBlock(_component_a_list, {
                                      key: 1,
                                      "item-layout": "horizontal",
                                      "data-source": recentOrders.value,
                                      renderItem: renderOrderRow
                                    }, null, 8, ["data-source"]))
                                  ]),
                                  _: 1
                                }, 8, ["loading"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_tab_pane, {
                      key: "courses",
                      tab: "My Courses"
                    }, {
                      default: withCtx(() => [
                        !isLoggedIn.value ? (openBlock(), createBlock(_component_a_alert, {
                          key: 0,
                          type: "info",
                          "show-icon": "",
                          message: "Log in to see your enrolled courses.",
                          style: { "margin-bottom": "12px" }
                        })) : createCommentVNode("", true),
                        loading.courses ? (openBlock(), createBlock(_component_a_skeleton, {
                          key: 1,
                          active: "",
                          paragraph: { rows: 5 }
                        })) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                          !myCourses.value.length ? (openBlock(), createBlock(_component_a_empty, {
                            key: 0,
                            description: "You have no enrollments yet"
                          })) : createCommentVNode("", true),
                          createVNode(_component_a_row, { gutter: [16, 16] }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(myCourses.value, (c) => {
                                return openBlock(), createBlock(_component_a_col, {
                                  key: c.id,
                                  xs: 24,
                                  md: 12,
                                  lg: 8
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, {
                                      class: "course-card",
                                      hoverable: true,
                                      onClick: ($event) => goCourse(c.id)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_image, {
                                          src: c.thumb || "/course-thumb.jpg",
                                          class: "course-thumb",
                                          preview: false
                                        }, null, 8, ["src"]),
                                        createVNode("div", { class: "course-meta" }, [
                                          createVNode("div", { class: "title" }, toDisplayString(c.title), 1),
                                          createVNode("div", { class: "muted" }, toDisplayString(c.category || "—") + " · " + toDisplayString(c.level || "All levels"), 1),
                                          createVNode(_component_a_progress, {
                                            percent: c.progress?.percent || 0,
                                            size: "small",
                                            status: "active"
                                          }, null, 8, ["percent"]),
                                          createVNode("div", { class: "muted small" }, toDisplayString(c.progress?.completedLessons || 0) + "/" + toDisplayString(c.progress?.totalLessons || 0) + " lessons ", 1)
                                        ])
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick"])
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ]),
                            _: 1
                          })
                        ], 64))
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_tab_pane, {
                      key: "orders",
                      tab: "Orders & Invoices"
                    }, {
                      default: withCtx(() => [
                        !isLoggedIn.value ? (openBlock(), createBlock(_component_a_alert, {
                          key: 0,
                          type: "info",
                          "show-icon": "",
                          message: "Log in to see your orders.",
                          style: { "margin-bottom": "12px" }
                        })) : createCommentVNode("", true),
                        loading.orders ? (openBlock(), createBlock(_component_a_skeleton, {
                          key: 1,
                          active: "",
                          paragraph: { rows: 5 }
                        })) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                          !orders.value.length ? (openBlock(), createBlock(_component_a_empty, {
                            key: 0,
                            description: "You don't have any orders yet"
                          })) : (openBlock(), createBlock(_component_a_table, {
                            key: 1,
                            "data-source": orders.value,
                            columns: orderColumns,
                            "row-key": "id",
                            size: "middle",
                            pagination: { pageSize: 5 }
                          }, {
                            bodyCell: withCtx(({ column, record }) => [
                              column.key === "items" ? (openBlock(), createBlock(_component_a_space, {
                                key: 0,
                                direction: "vertical",
                                size: "small"
                              }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(record.items || [], (it, idx) => {
                                    return openBlock(), createBlock("div", {
                                      key: idx,
                                      class: "muted"
                                    }, toDisplayString(it.title || it.courseId) + " × " + toDisplayString(it.quantity || 1), 1);
                                  }), 128))
                                ]),
                                _: 2
                              }, 1024)) : column.key === "total" ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(money(record.total || 0, record.currency || "EUR")), 1)) : column.key === "createdAt" ? (openBlock(), createBlock("span", { key: 2 }, toDisplayString(fmtDate(record.createdAt)), 1)) : column.key === "status" ? (openBlock(), createBlock(_component_a_tag, {
                                key: 3,
                                color: orderStatusColor(record.status)
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(record.status), 1)
                                ]),
                                _: 2
                              }, 1032, ["color"])) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }, 8, ["data-source"]))
                        ], 64))
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_tab_pane, {
                      key: "billing",
                      tab: "Billing"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, { title: "Payment Methods & Invoices" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_space, {
                              direction: "vertical",
                              style: { "width": "100%" }
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_typography_paragraph, null, {
                                  default: withCtx(() => [
                                    createTextVNode(" Manage your payment methods, invoices and subscriptions through the Stripe customer portal. ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      type: "primary",
                                      loading: loading.portal,
                                      onClick: openBillingPortal
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Open Stripe Portal ")
                                      ]),
                                      _: 1
                                    }, 8, ["loading"]),
                                    createVNode(_component_a_button, {
                                      loading: loading.portal,
                                      onClick: createTestInvoice
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Create Test Invoice (dev) ")
                                      ]),
                                      _: 1
                                    }, 8, ["loading"])
                                  ]),
                                  _: 1
                                }),
                                portalError.value ? (openBlock(), createBlock(_component_a_alert, {
                                  key: 0,
                                  type: "error",
                                  message: portalError.value,
                                  "show-icon": "",
                                  style: { "margin-top": "8px" }
                                }, null, 8, ["message"])) : createCommentVNode("", true)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_tab_pane, {
                      key: "settings",
                      tab: "Settings"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_form, {
                          layout: "vertical",
                          class: "settings-form",
                          onSubmit: withModifiers(saveSettings, ["prevent"])
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_row, { gutter: [16, 16] }, {
                              default: withCtx(() => [
                                createVNode(_component_a_col, {
                                  xs: 24,
                                  md: 12
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_form_item, { label: "Full Name" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_input, {
                                          value: edit.name,
                                          "onUpdate:value": ($event) => edit.name = $event,
                                          placeholder: "Your full name"
                                        }, null, 8, ["value", "onUpdate:value"])
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
                                    createVNode(_component_a_form_item, { label: "Public Title" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_input, {
                                          value: edit.title,
                                          "onUpdate:value": ($event) => edit.title = $event,
                                          placeholder: "e.g. Frontend Developer"
                                        }, null, 8, ["value", "onUpdate:value"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_col, { xs: 24 }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_form_item, { label: "Bio" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_textarea, {
                                          value: edit.bio,
                                          "onUpdate:value": ($event) => edit.bio = $event,
                                          rows: 4,
                                          placeholder: "Tell others about you…"
                                        }, null, 8, ["value", "onUpdate:value"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_space, null, {
                              default: withCtx(() => [
                                createVNode(_component_a_button, {
                                  type: "primary",
                                  loading: loading.save,
                                  onClick: saveSettings
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Save")
                                  ]),
                                  _: 1
                                }, 8, ["loading"]),
                                createVNode(_component_a_button, { onClick: resetSettings }, {
                                  default: withCtx(() => [
                                    createTextVNode("Reset")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            saveError.value ? (openBlock(), createBlock(_component_a_alert, {
                              key: 0,
                              message: saveError.value,
                              type: "error",
                              "show-icon": "",
                              style: { "margin-top": "8px" }
                            }, null, 8, ["message"])) : createCommentVNode("", true)
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
          } else {
            return [
              createVNode(_component_a_tabs, {
                activeKey: tabKey.value,
                "onUpdate:activeKey": ($event) => tabKey.value = $event
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_tab_pane, {
                    key: "overview",
                    tab: "Overview"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_row, { gutter: [16, 16] }, {
                        default: withCtx(() => [
                          createVNode(_component_a_col, {
                            xs: 24,
                            lg: 12
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                title: "Recent Courses",
                                loading: loading.courses
                              }, {
                                default: withCtx(() => [
                                  !recentCourses.value.length ? (openBlock(), createBlock(_component_a_empty, {
                                    key: 0,
                                    description: "No recent courses yet"
                                  })) : (openBlock(), createBlock(_component_a_list, {
                                    key: 1,
                                    "item-layout": "horizontal",
                                    "data-source": recentCourses.value,
                                    renderItem: renderCourseRow
                                  }, null, 8, ["data-source"]))
                                ]),
                                _: 1
                              }, 8, ["loading"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 24,
                            lg: 12
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                title: "Recent Orders",
                                loading: loading.orders
                              }, {
                                default: withCtx(() => [
                                  !recentOrders.value.length ? (openBlock(), createBlock(_component_a_empty, {
                                    key: 0,
                                    description: "No orders yet"
                                  })) : (openBlock(), createBlock(_component_a_list, {
                                    key: 1,
                                    "item-layout": "horizontal",
                                    "data-source": recentOrders.value,
                                    renderItem: renderOrderRow
                                  }, null, 8, ["data-source"]))
                                ]),
                                _: 1
                              }, 8, ["loading"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_tab_pane, {
                    key: "courses",
                    tab: "My Courses"
                  }, {
                    default: withCtx(() => [
                      !isLoggedIn.value ? (openBlock(), createBlock(_component_a_alert, {
                        key: 0,
                        type: "info",
                        "show-icon": "",
                        message: "Log in to see your enrolled courses.",
                        style: { "margin-bottom": "12px" }
                      })) : createCommentVNode("", true),
                      loading.courses ? (openBlock(), createBlock(_component_a_skeleton, {
                        key: 1,
                        active: "",
                        paragraph: { rows: 5 }
                      })) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                        !myCourses.value.length ? (openBlock(), createBlock(_component_a_empty, {
                          key: 0,
                          description: "You have no enrollments yet"
                        })) : createCommentVNode("", true),
                        createVNode(_component_a_row, { gutter: [16, 16] }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(myCourses.value, (c) => {
                              return openBlock(), createBlock(_component_a_col, {
                                key: c.id,
                                xs: 24,
                                md: 12,
                                lg: 8
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, {
                                    class: "course-card",
                                    hoverable: true,
                                    onClick: ($event) => goCourse(c.id)
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_image, {
                                        src: c.thumb || "/course-thumb.jpg",
                                        class: "course-thumb",
                                        preview: false
                                      }, null, 8, ["src"]),
                                      createVNode("div", { class: "course-meta" }, [
                                        createVNode("div", { class: "title" }, toDisplayString(c.title), 1),
                                        createVNode("div", { class: "muted" }, toDisplayString(c.category || "—") + " · " + toDisplayString(c.level || "All levels"), 1),
                                        createVNode(_component_a_progress, {
                                          percent: c.progress?.percent || 0,
                                          size: "small",
                                          status: "active"
                                        }, null, 8, ["percent"]),
                                        createVNode("div", { class: "muted small" }, toDisplayString(c.progress?.completedLessons || 0) + "/" + toDisplayString(c.progress?.totalLessons || 0) + " lessons ", 1)
                                      ])
                                    ]),
                                    _: 2
                                  }, 1032, ["onClick"])
                                ]),
                                _: 2
                              }, 1024);
                            }), 128))
                          ]),
                          _: 1
                        })
                      ], 64))
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_tab_pane, {
                    key: "orders",
                    tab: "Orders & Invoices"
                  }, {
                    default: withCtx(() => [
                      !isLoggedIn.value ? (openBlock(), createBlock(_component_a_alert, {
                        key: 0,
                        type: "info",
                        "show-icon": "",
                        message: "Log in to see your orders.",
                        style: { "margin-bottom": "12px" }
                      })) : createCommentVNode("", true),
                      loading.orders ? (openBlock(), createBlock(_component_a_skeleton, {
                        key: 1,
                        active: "",
                        paragraph: { rows: 5 }
                      })) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                        !orders.value.length ? (openBlock(), createBlock(_component_a_empty, {
                          key: 0,
                          description: "You don't have any orders yet"
                        })) : (openBlock(), createBlock(_component_a_table, {
                          key: 1,
                          "data-source": orders.value,
                          columns: orderColumns,
                          "row-key": "id",
                          size: "middle",
                          pagination: { pageSize: 5 }
                        }, {
                          bodyCell: withCtx(({ column, record }) => [
                            column.key === "items" ? (openBlock(), createBlock(_component_a_space, {
                              key: 0,
                              direction: "vertical",
                              size: "small"
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(record.items || [], (it, idx) => {
                                  return openBlock(), createBlock("div", {
                                    key: idx,
                                    class: "muted"
                                  }, toDisplayString(it.title || it.courseId) + " × " + toDisplayString(it.quantity || 1), 1);
                                }), 128))
                              ]),
                              _: 2
                            }, 1024)) : column.key === "total" ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(money(record.total || 0, record.currency || "EUR")), 1)) : column.key === "createdAt" ? (openBlock(), createBlock("span", { key: 2 }, toDisplayString(fmtDate(record.createdAt)), 1)) : column.key === "status" ? (openBlock(), createBlock(_component_a_tag, {
                              key: 3,
                              color: orderStatusColor(record.status)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(record.status), 1)
                              ]),
                              _: 2
                            }, 1032, ["color"])) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }, 8, ["data-source"]))
                      ], 64))
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_tab_pane, {
                    key: "billing",
                    tab: "Billing"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_card, { title: "Payment Methods & Invoices" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_space, {
                            direction: "vertical",
                            style: { "width": "100%" }
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_typography_paragraph, null, {
                                default: withCtx(() => [
                                  createTextVNode(" Manage your payment methods, invoices and subscriptions through the Stripe customer portal. ")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_space, null, {
                                default: withCtx(() => [
                                  createVNode(_component_a_button, {
                                    type: "primary",
                                    loading: loading.portal,
                                    onClick: openBillingPortal
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Open Stripe Portal ")
                                    ]),
                                    _: 1
                                  }, 8, ["loading"]),
                                  createVNode(_component_a_button, {
                                    loading: loading.portal,
                                    onClick: createTestInvoice
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Create Test Invoice (dev) ")
                                    ]),
                                    _: 1
                                  }, 8, ["loading"])
                                ]),
                                _: 1
                              }),
                              portalError.value ? (openBlock(), createBlock(_component_a_alert, {
                                key: 0,
                                type: "error",
                                message: portalError.value,
                                "show-icon": "",
                                style: { "margin-top": "8px" }
                              }, null, 8, ["message"])) : createCommentVNode("", true)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_tab_pane, {
                    key: "settings",
                    tab: "Settings"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_form, {
                        layout: "vertical",
                        class: "settings-form",
                        onSubmit: withModifiers(saveSettings, ["prevent"])
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_row, { gutter: [16, 16] }, {
                            default: withCtx(() => [
                              createVNode(_component_a_col, {
                                xs: 24,
                                md: 12
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_form_item, { label: "Full Name" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_input, {
                                        value: edit.name,
                                        "onUpdate:value": ($event) => edit.name = $event,
                                        placeholder: "Your full name"
                                      }, null, 8, ["value", "onUpdate:value"])
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
                                  createVNode(_component_a_form_item, { label: "Public Title" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_input, {
                                        value: edit.title,
                                        "onUpdate:value": ($event) => edit.title = $event,
                                        placeholder: "e.g. Frontend Developer"
                                      }, null, 8, ["value", "onUpdate:value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_col, { xs: 24 }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_form_item, { label: "Bio" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_textarea, {
                                        value: edit.bio,
                                        "onUpdate:value": ($event) => edit.bio = $event,
                                        rows: 4,
                                        placeholder: "Tell others about you…"
                                      }, null, 8, ["value", "onUpdate:value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_space, null, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, {
                                type: "primary",
                                loading: loading.save,
                                onClick: saveSettings
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Save")
                                ]),
                                _: 1
                              }, 8, ["loading"]),
                              createVNode(_component_a_button, { onClick: resetSettings }, {
                                default: withCtx(() => [
                                  createTextVNode("Reset")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          saveError.value ? (openBlock(), createBlock(_component_a_alert, {
                            key: 0,
                            message: saveError.value,
                            type: "error",
                            "show-icon": "",
                            style: { "margin-top": "8px" }
                          }, null, 8, ["message"])) : createCommentVNode("", true)
                        ]),
                        _: 1
                      })
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
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/profile-page/nuxt/pages/profile-page.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const profilePage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1fb6b729"]]);

export { profilePage as default };
//# sourceMappingURL=profile-page-DU6jhcKu.mjs.map
