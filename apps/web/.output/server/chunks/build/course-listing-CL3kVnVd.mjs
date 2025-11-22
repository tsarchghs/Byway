import { defineComponent, ref, watchEffect, computed, resolveComponent, unref, withCtx, createVNode, createTextVNode, toDisplayString, createBlock, openBlock, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderStyle, ssrRenderAttr } from 'vue/server-renderer';
import { theme, message } from 'ant-design-vue';
import { BulbOutlined, FieldTimeOutlined } from '@ant-design/icons-vue';
import { H as Header } from './Header-DscPRdFw.mjs';
import { u as useAuth } from './useAuth-B8D9e8en.mjs';
import { u as useCart } from './useCart-7pxN526Z.mjs';
import { _ as _export_sfc, u as useRouter, b as useRuntimeConfig } from './server.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import '@apollo/client/core/index.js';
import '@apollo/client/link/context/index.js';
import '@vue/apollo-composable';

const __vite_import_meta_env__ = {};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "course-listing",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const config = useRuntimeConfig();
    const apiBase = config.public?.apiBase || "http://localhost:4000";
    const { user, token, isLoggedIn } = useAuth();
    const { addToCart, isInCart, fetchCart, loading: cartLoading, itemCount } = useCart();
    const studentId = ref(null);
    const isDark = ref(false);
    function toggleDark() {
      isDark.value = !isDark.value;
      console.debug("setItem replaced");
      JSON.stringify(isDark.value);
    }
    const API_URL = __vite_import_meta_env__?.VITE_API_URL || "http://localhost:4000/api/teach-internal/graphql";
    const loading = ref(false);
    const courses = ref([]);
    async function loadCourses() {
      loading.value = true;
      try {
        const query = `
      query Courses {
        courses {
          id title category difficulty description price discount coverUrl isEnrolled
          modules { lessons { id duration preview } }
        }
      }`;
        const headers = { "content-type": "application/json" };
        if (token.value) headers.Authorization = `Bearer ${token.value}`;
        const res = await fetch(API_URL, {
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify({ query })
        });
        const { data, errors } = await res.json();
        if (errors) throw new Error(errors[0]?.message || "GraphQL error");
        courses.value = data?.courses || [];
      } catch (e) {
        console.warn("Falling back to demo seed:", e?.message || e);
        courses.value = demoSeed;
      } finally {
        loading.value = false;
      }
    }
    function reload() {
      loadCourses();
    }
    const demoSeed = [
      {
        id: "c1",
        title: "Advanced Vue 3 Workshop",
        category: "Programming",
        difficulty: "Intermediate",
        description: "Build a production-grade dashboard with Vue 3.",
        price: 69,
        discount: 20,
        coverUrl: "",
        modules: [{ lessons: [{ id: "l1", duration: 8 }, { id: "l2", duration: 12 }] }]
      },
      {
        id: "c2",
        title: "Shopware for Developers",
        category: "E-commerce",
        difficulty: "Advanced",
        description: "Extend Shopware with plugins and headless storefronts.",
        price: 99,
        discount: 0,
        coverUrl: "",
        modules: [{ lessons: [{ id: "l1", duration: 20 }, { id: "l2", duration: 15 }, { id: "l3", duration: 30 }] }]
      },
      {
        id: "c3",
        title: "GraphQL + Prisma Basics",
        category: "Programming",
        difficulty: "Beginner",
        description: "CRUD, resolvers, paging, and auth with Prisma.",
        price: 0,
        discount: 0,
        coverUrl: "",
        modules: [{ lessons: [{ id: "l1", duration: 10 }, { id: "l2", duration: 10 }] }]
      }
    ];
    const q = ref("");
    const category = ref();
    const difficulty = ref();
    const onlyFree = ref(false);
    const onlyDiscounted = ref(false);
    const onlyPurchased = ref(false);
    const sort = ref("popular");
    const viewMode = ref(loadViewMode());
    function loadViewMode() {
      try {
        return "grid";
      } catch {
        return "grid";
      }
    }
    function saveViewMode() {
      try {
        console.debug("setItem replaced");
        "byway:viewmode", viewMode.value;
      } catch {
      }
    }
    watchEffect(saveViewMode);
    function noop() {
    }
    const categories = computed(() => Array.from(new Set(courses.value.map((c) => c.category).filter(Boolean))));
    const difficulties = computed(() => Array.from(new Set(courses.value.map((c) => c.difficulty).filter(Boolean))));
    function isPurchased(c) {
      return !!c.isEnrolled;
    }
    function isFree(c) {
      return (c.price || 0) <= 0;
    }
    function baseDiscounted(c) {
      return c.price * (1 - (c.discount || 0) / 100);
    }
    function payablePrice(c) {
      return round2(baseDiscounted(c));
    }
    function totalLessons(c) {
      return (c.modules || []).reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
    }
    function totalMinutes(c) {
      return (c.modules || []).flatMap((m) => m.lessons || []).reduce((s, l) => s + (l.duration || 0), 0);
    }
    const filtered = computed(() => {
      const term = q.value.trim().toLowerCase();
      return courses.value.filter((c) => {
        if (category.value && c.category !== category.value) return false;
        if (difficulty.value && c.difficulty !== difficulty.value) return false;
        if (onlyFree.value && !isFree(c)) return false;
        if (onlyDiscounted.value && !(c.discount && c.discount > 0)) return false;
        if (onlyPurchased.value && !isPurchased(c)) return false;
        if (term) {
          const hay = `${c.title} ${c.category || ""} ${c.difficulty || ""} ${c.description || ""}`.toLowerCase();
          if (!hay.includes(term)) return false;
        }
        return true;
      });
    });
    const sorted = computed(() => {
      const list = [...filtered.value];
      switch (sort.value) {
        case "price-asc":
          list.sort((a, b) => payablePrice(a) - payablePrice(b));
          break;
        case "price-desc":
          list.sort((a, b) => payablePrice(b) - payablePrice(a));
          break;
        case "length-desc":
          list.sort((a, b) => totalMinutes(b) - totalMinutes(a));
          break;
        case "newest":
          list.sort((a, b) => (b.id || "").localeCompare(a.id || ""));
          break;
        // replace with createdAt if available
        default:
          list.sort((a, b) => totalLessons(b) - totalLessons(a));
          break;
      }
      return list;
    });
    const page = ref(1);
    const pageSize = ref(12);
    const paged = computed(() => {
      const start = (page.value - 1) * pageSize.value;
      return sorted.value.slice(start, start + pageSize.value);
    });
    function onPaginate(p) {
      page.value = p;
      scrollTop();
    }
    function onSizeChange(p, size) {
      page.value = 1;
      pageSize.value = size;
      scrollTop();
    }
    function scrollTop() {
      try {
        (void 0).scrollTo({ top: 0, behavior: "smooth" });
      } catch {
      }
    }
    function cover(c) {
      if (c.coverUrl) return { backgroundImage: `url('${c.coverUrl}')` };
      return { backgroundImage: "linear-gradient(135deg,#1e293b,#0ea5e9)" };
    }
    async function addCourseToCart(c) {
      if (!isLoggedIn.value || !user.value?.id) {
        message.warning("Please log in to add courses to your cart");
        router.push("/login");
        return;
      }
      try {
        await addToCart(c.id, 1);
        message.success(`Added "${c.title}" to cart`);
        await fetchCart();
      } catch (e) {
        message.error(e?.message || "Failed to add to cart");
      }
    }
    const purchasingId = ref(null);
    async function checkoutCourse(c) {
      if (isPurchased(c)) {
        openCourse(c);
        return;
      }
      if (!isLoggedIn.value || !user.value?.id) {
        message.warning("Please log in to purchase courses");
        router.push("/login");
        return;
      }
      const sid = await ensureStudentProfile();
      purchasingId.value = c.id;
      try {
        const successUrl = `${(void 0).location.origin}/checkout/success`;
        const cancelUrl = `${(void 0).location.origin}/categories`;
        const res = await fetch(`${apiBase}/api/ecommerce/graphql`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...token.value ? { Authorization: `Bearer ${token.value}` } : {}
          },
          body: JSON.stringify({
            query: `
          mutation($items:[EcCartItemInput!]!, $successUrl:String!, $cancelUrl:String!) {
            createCheckout(items:$items, successUrl:$successUrl, cancelUrl:$cancelUrl, studentId:$studentId, email:$email) { url orderId }
          }`,
            variables: {
              items: [{ courseId: c.id, quantity: 1 }],
              successUrl,
              cancelUrl,
              studentId: sid,
              email: user.value?.email || null
            }
          })
        });
        const json = await res.json();
        if (json.errors?.length) throw new Error(json.errors[0].message);
        const url = json?.data?.createCheckout?.url;
        if (url) {
          (void 0).location.href = url;
        } else {
          try {
            await addToCart(c.id, 1);
            await fetchCart();
          } catch (err) {
            console.warn("[checkout fallback] addToCart failed", err?.message || err);
          }
          message.warning("Checkout link not available, opening cart instead.");
          router.push("/cart");
        }
      } catch (e) {
        const msg = e?.message || "Unable to start checkout";
        if (msg.includes("Already enrolled")) {
          message.info("You already own this course — opening it instead.");
          openCourse(c);
        } else {
          message.error(msg);
        }
      } finally {
        purchasingId.value = null;
      }
    }
    async function ensureStudentProfile() {
      if (studentId.value) return studentId.value;
      const authId = user.value?.userId || user.value?.id;
      if (!authId) throw new Error("Not authenticated");
      const headers = { "content-type": "application/json" };
      if (token.value) headers.Authorization = `Bearer ${token.value}`;
      try {
        const res = await fetch(`${apiBase}/api/students-internal/graphql`, {
          method: "POST",
          headers,
          body: JSON.stringify({ query: `query($uid:String!){ studentByUserId(userId:$uid){ id } }`, variables: { uid: authId } })
        });
        const json = await res.json();
        const sid2 = json?.data?.studentByUserId?.id;
        if (sid2) {
          studentId.value = sid2;
          return sid2;
        }
      } catch {
      }
      const create = await fetch(`${apiBase}/api/students-internal/graphql`, {
        method: "POST",
        headers,
        body: JSON.stringify({ query: `mutation($uid:String!,$name:String){ createStudent(userId:$uid, displayName:$name){ id } }`, variables: { uid: authId, name: user.value?.email || "Student" } })
      });
      const created = await create.json();
      const sid = created?.data?.createStudent?.id;
      if (!sid) throw new Error("Student profile not found");
      studentId.value = sid;
      return sid;
    }
    function openCourse(c) {
      router.push(`/course/${encodeURIComponent(c.id)}`);
    }
    function goCart() {
      router.push("/cart");
    }
    function round2(n) {
      return Math.round(n * 100) / 100;
    }
    function fmt(n) {
      return n.toLocaleString(void 0, { style: "currency", currency: "EUR" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_config_provider = resolveComponent("a-config-provider");
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_tooltip = resolveComponent("a-tooltip");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_input_search = resolveComponent("a-input-search");
      const _component_a_select = resolveComponent("a-select");
      const _component_a_select_option = resolveComponent("a-select-option");
      const _component_a_segmented = resolveComponent("a-segmented");
      const _component_a_checkbox = resolveComponent("a-checkbox");
      const _component_a_empty = resolveComponent("a-empty");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_list = resolveComponent("a-list");
      const _component_a_list_item = resolveComponent("a-list-item");
      const _component_a_list_item_meta = resolveComponent("a-list-item-meta");
      const _component_a_pagination = resolveComponent("a-pagination");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(ssrRenderComponent(_component_a_config_provider, {
        theme: { algorithm: isDark.value ? unref(theme).darkAlgorithm : unref(theme).defaultAlgorithm }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_layout, {
              class: ["course-listing", isDark.value ? "is-dark" : ""]
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_page_header, {
                    class: "header",
                    title: "Browse Courses",
                    "sub-title": `${filtered.value.length} result${filtered.value.length === 1 ? "" : "s"}`
                  }, {
                    extra: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_space, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_tooltip, {
                                title: isDark.value ? "Switch to light" : "Switch to dark"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_button, {
                                      shape: "circle",
                                      onClick: toggleDark
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
                                        shape: "circle",
                                        onClick: toggleDark
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
                              if (unref(itemCount) > 0) {
                                _push5(ssrRenderComponent(_component_a_button, {
                                  type: "primary",
                                  ghost: "",
                                  onClick: goCart
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(` Cart (${ssrInterpolate(unref(itemCount))}) `);
                                    } else {
                                      return [
                                        createTextVNode(" Cart (" + toDisplayString(unref(itemCount)) + ") ", 1)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                              _push5(ssrRenderComponent(_component_a_button, {
                                shape: "circle",
                                onClick: reload,
                                loading: loading.value,
                                title: "Refresh"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<svg viewBox="0 0 24 24" width="1em" height="1em" data-v-631ee27d${_scopeId5}><path fill="currentColor" d="M12 6V3L8 7l4 4V8a4 4 0 1 1-4 4H6a6 6 0 1 0 6-6z" data-v-631ee27d${_scopeId5}></path></svg>`);
                                  } else {
                                    return [
                                      (openBlock(), createBlock("svg", {
                                        viewBox: "0 0 24 24",
                                        width: "1em",
                                        height: "1em"
                                      }, [
                                        createVNode("path", {
                                          fill: "currentColor",
                                          d: "M12 6V3L8 7l4 4V8a4 4 0 1 1-4 4H6a6 6 0 1 0 6-6z"
                                        })
                                      ]))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_tooltip, {
                                  title: isDark.value ? "Switch to light" : "Switch to dark"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      shape: "circle",
                                      onClick: toggleDark
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(BulbOutlined))
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["title"]),
                                unref(itemCount) > 0 ? (openBlock(), createBlock(_component_a_button, {
                                  key: 0,
                                  type: "primary",
                                  ghost: "",
                                  onClick: goCart
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Cart (" + toDisplayString(unref(itemCount)) + ") ", 1)
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                createVNode(_component_a_button, {
                                  shape: "circle",
                                  onClick: reload,
                                  loading: loading.value,
                                  title: "Refresh"
                                }, {
                                  default: withCtx(() => [
                                    (openBlock(), createBlock("svg", {
                                      viewBox: "0 0 24 24",
                                      width: "1em",
                                      height: "1em"
                                    }, [
                                      createVNode("path", {
                                        fill: "currentColor",
                                        d: "M12 6V3L8 7l4 4V8a4 4 0 1 1-4 4H6a6 6 0 1 0 6-6z"
                                      })
                                    ]))
                                  ]),
                                  _: 1
                                }, 8, ["loading"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_space, null, {
                            default: withCtx(() => [
                              createVNode(_component_a_tooltip, {
                                title: isDark.value ? "Switch to light" : "Switch to dark"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_button, {
                                    shape: "circle",
                                    onClick: toggleDark
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(BulbOutlined))
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["title"]),
                              unref(itemCount) > 0 ? (openBlock(), createBlock(_component_a_button, {
                                key: 0,
                                type: "primary",
                                ghost: "",
                                onClick: goCart
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Cart (" + toDisplayString(unref(itemCount)) + ") ", 1)
                                ]),
                                _: 1
                              })) : createCommentVNode("", true),
                              createVNode(_component_a_button, {
                                shape: "circle",
                                onClick: reload,
                                loading: loading.value,
                                title: "Refresh"
                              }, {
                                default: withCtx(() => [
                                  (openBlock(), createBlock("svg", {
                                    viewBox: "0 0 24 24",
                                    width: "1em",
                                    height: "1em"
                                  }, [
                                    createVNode("path", {
                                      fill: "currentColor",
                                      d: "M12 6V3L8 7l4 4V8a4 4 0 1 1-4 4H6a6 6 0 1 0 6-6z"
                                    })
                                  ]))
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
                  }, _parent3, _scopeId2));
                  _push3(`<div class="filters" data-v-631ee27d${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_a_row, {
                    gutter: [12, 12],
                    align: "middle"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_col, {
                          xs: 24,
                          md: 10,
                          lg: 12
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_input_search, {
                                value: q.value,
                                "onUpdate:value": ($event) => q.value = $event,
                                placeholder: "Search by title, category…",
                                "allow-clear": "",
                                onSearch: noop
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_input_search, {
                                  value: q.value,
                                  "onUpdate:value": ($event) => q.value = $event,
                                  placeholder: "Search by title, category…",
                                  "allow-clear": "",
                                  onSearch: noop
                                }, null, 8, ["value", "onUpdate:value"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_col, {
                          xs: 12,
                          md: 6,
                          lg: 4
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_select, {
                                value: category.value,
                                "onUpdate:value": ($event) => category.value = $event,
                                "allow-clear": "",
                                placeholder: "Category",
                                style: { "width": "100%" }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<!--[-->`);
                                    ssrRenderList(categories.value, (c) => {
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
                                      (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (c) => {
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
                                createVNode(_component_a_select, {
                                  value: category.value,
                                  "onUpdate:value": ($event) => category.value = $event,
                                  "allow-clear": "",
                                  placeholder: "Category",
                                  style: { "width": "100%" }
                                }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (c) => {
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
                        _push4(ssrRenderComponent(_component_a_col, {
                          xs: 12,
                          md: 4,
                          lg: 4
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_select, {
                                value: difficulty.value,
                                "onUpdate:value": ($event) => difficulty.value = $event,
                                "allow-clear": "",
                                placeholder: "Difficulty",
                                style: { "width": "100%" }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<!--[-->`);
                                    ssrRenderList(difficulties.value, (d) => {
                                      _push6(ssrRenderComponent(_component_a_select_option, {
                                        key: d,
                                        value: d
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`${ssrInterpolate(d)}`);
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(d), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    });
                                    _push6(`<!--]-->`);
                                  } else {
                                    return [
                                      (openBlock(true), createBlock(Fragment, null, renderList(difficulties.value, (d) => {
                                        return openBlock(), createBlock(_component_a_select_option, {
                                          key: d,
                                          value: d
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(d), 1)
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
                                createVNode(_component_a_select, {
                                  value: difficulty.value,
                                  "onUpdate:value": ($event) => difficulty.value = $event,
                                  "allow-clear": "",
                                  placeholder: "Difficulty",
                                  style: { "width": "100%" }
                                }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(difficulties.value, (d) => {
                                      return openBlock(), createBlock(_component_a_select_option, {
                                        key: d,
                                        value: d
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(d), 1)
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
                        _push4(ssrRenderComponent(_component_a_col, {
                          xs: 24,
                          md: 4,
                          lg: 4,
                          class: "right-controls"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_segmented, {
                                value: viewMode.value,
                                "onUpdate:value": ($event) => viewMode.value = $event,
                                options: [{ label: "Grid", value: "grid" }, { label: "List", value: "list" }],
                                size: "small"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_segmented, {
                                  value: viewMode.value,
                                  "onUpdate:value": ($event) => viewMode.value = $event,
                                  options: [{ label: "Grid", value: "grid" }, { label: "List", value: "list" }],
                                  size: "small"
                                }, null, 8, ["value", "onUpdate:value"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 10,
                            lg: 12
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_input_search, {
                                value: q.value,
                                "onUpdate:value": ($event) => q.value = $event,
                                placeholder: "Search by title, category…",
                                "allow-clear": "",
                                onSearch: noop
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 12,
                            md: 6,
                            lg: 4
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_select, {
                                value: category.value,
                                "onUpdate:value": ($event) => category.value = $event,
                                "allow-clear": "",
                                placeholder: "Category",
                                style: { "width": "100%" }
                              }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (c) => {
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
                          }),
                          createVNode(_component_a_col, {
                            xs: 12,
                            md: 4,
                            lg: 4
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_select, {
                                value: difficulty.value,
                                "onUpdate:value": ($event) => difficulty.value = $event,
                                "allow-clear": "",
                                placeholder: "Difficulty",
                                style: { "width": "100%" }
                              }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(difficulties.value, (d) => {
                                    return openBlock(), createBlock(_component_a_select_option, {
                                      key: d,
                                      value: d
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(d), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["value"]);
                                  }), 128))
                                ]),
                                _: 1
                              }, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 4,
                            lg: 4,
                            class: "right-controls"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_segmented, {
                                value: viewMode.value,
                                "onUpdate:value": ($event) => viewMode.value = $event,
                                options: [{ label: "Grid", value: "grid" }, { label: "List", value: "list" }],
                                size: "small"
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="chips" data-v-631ee27d${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_a_checkbox, {
                    checked: onlyFree.value,
                    "onUpdate:checked": ($event) => onlyFree.value = $event
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Free`);
                      } else {
                        return [
                          createTextVNode("Free")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_checkbox, {
                    checked: onlyDiscounted.value,
                    "onUpdate:checked": ($event) => onlyDiscounted.value = $event
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Discounted`);
                      } else {
                        return [
                          createTextVNode("Discounted")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_checkbox, {
                    checked: onlyPurchased.value,
                    "onUpdate:checked": ($event) => onlyPurchased.value = $event
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Purchased`);
                      } else {
                        return [
                          createTextVNode("Purchased")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_select, {
                    value: sort.value,
                    "onUpdate:value": ($event) => sort.value = $event,
                    size: "small",
                    style: { "min-width": "180px", "margin-left": "auto" }
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_select_option, { value: "popular" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Most popular`);
                            } else {
                              return [
                                createTextVNode("Most popular")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_select_option, { value: "newest" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Newest`);
                            } else {
                              return [
                                createTextVNode("Newest")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_select_option, { value: "price-asc" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Price ↑`);
                            } else {
                              return [
                                createTextVNode("Price ↑")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_select_option, { value: "price-desc" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Price ↓`);
                            } else {
                              return [
                                createTextVNode("Price ↓")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_select_option, { value: "length-desc" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Longest`);
                            } else {
                              return [
                                createTextVNode("Longest")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_select_option, { value: "popular" }, {
                            default: withCtx(() => [
                              createTextVNode("Most popular")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "newest" }, {
                            default: withCtx(() => [
                              createTextVNode("Newest")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "price-asc" }, {
                            default: withCtx(() => [
                              createTextVNode("Price ↑")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "price-desc" }, {
                            default: withCtx(() => [
                              createTextVNode("Price ↓")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "length-desc" }, {
                            default: withCtx(() => [
                              createTextVNode("Longest")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                  if (!loading.value) {
                    _push3(`<div class="results" data-v-631ee27d${_scopeId2}>`);
                    if (paged.value.length === 0) {
                      _push3(ssrRenderComponent(_component_a_empty, { description: "No matching courses." }, null, _parent3, _scopeId2));
                    } else if (viewMode.value === "grid") {
                      _push3(ssrRenderComponent(_component_a_row, { gutter: [16, 16] }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<!--[-->`);
                            ssrRenderList(paged.value, (c) => {
                              _push4(ssrRenderComponent(_component_a_col, {
                                key: c.id,
                                xs: 24,
                                sm: 12,
                                md: 12,
                                lg: 8,
                                xl: 6
                              }, {
                                default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                  if (_push5) {
                                    _push5(ssrRenderComponent(_component_a_card, {
                                      class: "course-card",
                                      hoverable: true,
                                      "body-style": { padding: "12px" }
                                    }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(`<div class="cover" style="${ssrRenderStyle(cover(c))}" data-v-631ee27d${_scopeId5}>`);
                                          if (c.discount || isFree(c)) {
                                            _push6(`<div class="badge" data-v-631ee27d${_scopeId5}>`);
                                            if (isFree(c)) {
                                              _push6(ssrRenderComponent(_component_a_tag, { color: "green" }, {
                                                default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                                  if (_push7) {
                                                    _push7(`Free`);
                                                  } else {
                                                    return [
                                                      createTextVNode("Free")
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent6, _scopeId5));
                                            } else {
                                              _push6(ssrRenderComponent(_component_a_tag, { color: "red" }, {
                                                default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                                  if (_push7) {
                                                    _push7(`${ssrInterpolate(c.discount)}% off`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(c.discount) + "% off", 1)
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent6, _scopeId5));
                                            }
                                            _push6(`</div>`);
                                          } else {
                                            _push6(`<!---->`);
                                          }
                                          if (isPurchased(c)) {
                                            _push6(ssrRenderComponent(_component_a_tag, {
                                              color: "green",
                                              class: "purchased-tag"
                                            }, {
                                              default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                                if (_push7) {
                                                  _push7(`Purchased`);
                                                } else {
                                                  return [
                                                    createTextVNode("Purchased")
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent6, _scopeId5));
                                          } else {
                                            _push6(`<!---->`);
                                          }
                                          _push6(`</div><div class="meta" data-v-631ee27d${_scopeId5}><div class="title"${ssrRenderAttr("title", c.title)} data-v-631ee27d${_scopeId5}>${ssrInterpolate(c.title)}</div><div class="tags" data-v-631ee27d${_scopeId5}>`);
                                          if (c.category) {
                                            _push6(ssrRenderComponent(_component_a_tag, { color: "blue" }, {
                                              default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                                if (_push7) {
                                                  _push7(`${ssrInterpolate(c.category)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(c.category), 1)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent6, _scopeId5));
                                          } else {
                                            _push6(`<!---->`);
                                          }
                                          if (c.difficulty) {
                                            _push6(ssrRenderComponent(_component_a_tag, { color: "gold" }, {
                                              default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                                if (_push7) {
                                                  _push7(`${ssrInterpolate(c.difficulty)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(c.difficulty), 1)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent6, _scopeId5));
                                          } else {
                                            _push6(`<!---->`);
                                          }
                                          _push6(`</div><div class="stats" data-v-631ee27d${_scopeId5}><span data-v-631ee27d${_scopeId5}>`);
                                          _push6(ssrRenderComponent(unref(FieldTimeOutlined), null, null, _parent6, _scopeId5));
                                          _push6(` ${ssrInterpolate(totalMinutes(c))} min</span><span data-v-631ee27d${_scopeId5}>• ${ssrInterpolate(totalLessons(c))} lessons</span></div><div class="price-row" data-v-631ee27d${_scopeId5}>`);
                                          if (!isFree(c)) {
                                            _push6(`<span class="price" data-v-631ee27d${_scopeId5}>${ssrInterpolate(fmt(payablePrice(c)))} `);
                                            if (c.discount) {
                                              _push6(`<del class="muted small" data-v-631ee27d${_scopeId5}>${ssrInterpolate(fmt(c.price))}</del>`);
                                            } else {
                                              _push6(`<!---->`);
                                            }
                                            _push6(`</span>`);
                                          } else {
                                            _push6(`<span class="price" data-v-631ee27d${_scopeId5}>Free</span>`);
                                          }
                                          _push6(`</div><div class="actions" data-v-631ee27d${_scopeId5}>`);
                                          _push6(ssrRenderComponent(_component_a_space, null, {
                                            default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                              if (_push7) {
                                                _push7(ssrRenderComponent(_component_a_button, {
                                                  onClick: ($event) => openCourse(c)
                                                }, {
                                                  default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(`View`);
                                                    } else {
                                                      return [
                                                        createTextVNode("View")
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                                _push7(ssrRenderComponent(_component_a_button, {
                                                  onClick: ($event) => addCourseToCart(c),
                                                  disabled: isPurchased(c) || unref(isInCart)(c.id),
                                                  loading: unref(cartLoading)
                                                }, {
                                                  default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      if (isPurchased(c)) {
                                                        _push8(`<!--[-->Purchased<!--]-->`);
                                                      } else if (unref(isInCart)(c.id)) {
                                                        _push8(`<!--[-->In Cart<!--]-->`);
                                                      } else {
                                                        _push8(`<!--[-->Add to cart<!--]-->`);
                                                      }
                                                    } else {
                                                      return [
                                                        isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                          createTextVNode("Purchased")
                                                        ], 64)) : unref(isInCart)(c.id) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                          createTextVNode("In Cart")
                                                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                          createTextVNode("Add to cart")
                                                        ], 64))
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                                _push7(ssrRenderComponent(_component_a_button, {
                                                  type: "primary",
                                                  onClick: ($event) => isPurchased(c) ? openCourse(c) : checkoutCourse(c),
                                                  loading: purchasingId.value === c.id
                                                }, {
                                                  default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      if (isPurchased(c)) {
                                                        _push8(`<!--[-->Continue<!--]-->`);
                                                      } else {
                                                        _push8(`<!--[-->Buy<!--]-->`);
                                                      }
                                                    } else {
                                                      return [
                                                        isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                          createTextVNode("Continue")
                                                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                          createTextVNode("Buy")
                                                        ], 64))
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                              } else {
                                                return [
                                                  createVNode(_component_a_button, {
                                                    onClick: ($event) => openCourse(c)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("View")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"]),
                                                  createVNode(_component_a_button, {
                                                    onClick: ($event) => addCourseToCart(c),
                                                    disabled: isPurchased(c) || unref(isInCart)(c.id),
                                                    loading: unref(cartLoading)
                                                  }, {
                                                    default: withCtx(() => [
                                                      isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                        createTextVNode("Purchased")
                                                      ], 64)) : unref(isInCart)(c.id) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                        createTextVNode("In Cart")
                                                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                        createTextVNode("Add to cart")
                                                      ], 64))
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["onClick", "disabled", "loading"]),
                                                  createVNode(_component_a_button, {
                                                    type: "primary",
                                                    onClick: ($event) => isPurchased(c) ? openCourse(c) : checkoutCourse(c),
                                                    loading: purchasingId.value === c.id
                                                  }, {
                                                    default: withCtx(() => [
                                                      isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                        createTextVNode("Continue")
                                                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                        createTextVNode("Buy")
                                                      ], 64))
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["onClick", "loading"])
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent6, _scopeId5));
                                          _push6(`</div></div>`);
                                        } else {
                                          return [
                                            createVNode("div", {
                                              class: "cover",
                                              style: cover(c)
                                            }, [
                                              c.discount || isFree(c) ? (openBlock(), createBlock("div", {
                                                key: 0,
                                                class: "badge"
                                              }, [
                                                isFree(c) ? (openBlock(), createBlock(_component_a_tag, {
                                                  key: 0,
                                                  color: "green"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Free")
                                                  ]),
                                                  _: 1
                                                })) : (openBlock(), createBlock(_component_a_tag, {
                                                  key: 1,
                                                  color: "red"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(c.discount) + "% off", 1)
                                                  ]),
                                                  _: 2
                                                }, 1024))
                                              ])) : createCommentVNode("", true),
                                              isPurchased(c) ? (openBlock(), createBlock(_component_a_tag, {
                                                key: 1,
                                                color: "green",
                                                class: "purchased-tag"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Purchased")
                                                ]),
                                                _: 1
                                              })) : createCommentVNode("", true)
                                            ], 4),
                                            createVNode("div", { class: "meta" }, [
                                              createVNode("div", {
                                                class: "title",
                                                title: c.title
                                              }, toDisplayString(c.title), 9, ["title"]),
                                              createVNode("div", { class: "tags" }, [
                                                c.category ? (openBlock(), createBlock(_component_a_tag, {
                                                  key: 0,
                                                  color: "blue"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(c.category), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024)) : createCommentVNode("", true),
                                                c.difficulty ? (openBlock(), createBlock(_component_a_tag, {
                                                  key: 1,
                                                  color: "gold"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(c.difficulty), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024)) : createCommentVNode("", true)
                                              ]),
                                              createVNode("div", { class: "stats" }, [
                                                createVNode("span", null, [
                                                  createVNode(unref(FieldTimeOutlined)),
                                                  createTextVNode(" " + toDisplayString(totalMinutes(c)) + " min", 1)
                                                ]),
                                                createVNode("span", null, "• " + toDisplayString(totalLessons(c)) + " lessons", 1)
                                              ]),
                                              createVNode("div", { class: "price-row" }, [
                                                !isFree(c) ? (openBlock(), createBlock("span", {
                                                  key: 0,
                                                  class: "price"
                                                }, [
                                                  createTextVNode(toDisplayString(fmt(payablePrice(c))) + " ", 1),
                                                  c.discount ? (openBlock(), createBlock("del", {
                                                    key: 0,
                                                    class: "muted small"
                                                  }, toDisplayString(fmt(c.price)), 1)) : createCommentVNode("", true)
                                                ])) : (openBlock(), createBlock("span", {
                                                  key: 1,
                                                  class: "price"
                                                }, "Free"))
                                              ]),
                                              createVNode("div", { class: "actions" }, [
                                                createVNode(_component_a_space, null, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_button, {
                                                      onClick: ($event) => openCourse(c)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("View")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onClick"]),
                                                    createVNode(_component_a_button, {
                                                      onClick: ($event) => addCourseToCart(c),
                                                      disabled: isPurchased(c) || unref(isInCart)(c.id),
                                                      loading: unref(cartLoading)
                                                    }, {
                                                      default: withCtx(() => [
                                                        isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                          createTextVNode("Purchased")
                                                        ], 64)) : unref(isInCart)(c.id) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                          createTextVNode("In Cart")
                                                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                          createTextVNode("Add to cart")
                                                        ], 64))
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["onClick", "disabled", "loading"]),
                                                    createVNode(_component_a_button, {
                                                      type: "primary",
                                                      onClick: ($event) => isPurchased(c) ? openCourse(c) : checkoutCourse(c),
                                                      loading: purchasingId.value === c.id
                                                    }, {
                                                      default: withCtx(() => [
                                                        isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                          createTextVNode("Continue")
                                                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                          createTextVNode("Buy")
                                                        ], 64))
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["onClick", "loading"])
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ])
                                            ])
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  } else {
                                    return [
                                      createVNode(_component_a_card, {
                                        class: "course-card",
                                        hoverable: true,
                                        "body-style": { padding: "12px" }
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("div", {
                                            class: "cover",
                                            style: cover(c)
                                          }, [
                                            c.discount || isFree(c) ? (openBlock(), createBlock("div", {
                                              key: 0,
                                              class: "badge"
                                            }, [
                                              isFree(c) ? (openBlock(), createBlock(_component_a_tag, {
                                                key: 0,
                                                color: "green"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Free")
                                                ]),
                                                _: 1
                                              })) : (openBlock(), createBlock(_component_a_tag, {
                                                key: 1,
                                                color: "red"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(c.discount) + "% off", 1)
                                                ]),
                                                _: 2
                                              }, 1024))
                                            ])) : createCommentVNode("", true),
                                            isPurchased(c) ? (openBlock(), createBlock(_component_a_tag, {
                                              key: 1,
                                              color: "green",
                                              class: "purchased-tag"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Purchased")
                                              ]),
                                              _: 1
                                            })) : createCommentVNode("", true)
                                          ], 4),
                                          createVNode("div", { class: "meta" }, [
                                            createVNode("div", {
                                              class: "title",
                                              title: c.title
                                            }, toDisplayString(c.title), 9, ["title"]),
                                            createVNode("div", { class: "tags" }, [
                                              c.category ? (openBlock(), createBlock(_component_a_tag, {
                                                key: 0,
                                                color: "blue"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(c.category), 1)
                                                ]),
                                                _: 2
                                              }, 1024)) : createCommentVNode("", true),
                                              c.difficulty ? (openBlock(), createBlock(_component_a_tag, {
                                                key: 1,
                                                color: "gold"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(c.difficulty), 1)
                                                ]),
                                                _: 2
                                              }, 1024)) : createCommentVNode("", true)
                                            ]),
                                            createVNode("div", { class: "stats" }, [
                                              createVNode("span", null, [
                                                createVNode(unref(FieldTimeOutlined)),
                                                createTextVNode(" " + toDisplayString(totalMinutes(c)) + " min", 1)
                                              ]),
                                              createVNode("span", null, "• " + toDisplayString(totalLessons(c)) + " lessons", 1)
                                            ]),
                                            createVNode("div", { class: "price-row" }, [
                                              !isFree(c) ? (openBlock(), createBlock("span", {
                                                key: 0,
                                                class: "price"
                                              }, [
                                                createTextVNode(toDisplayString(fmt(payablePrice(c))) + " ", 1),
                                                c.discount ? (openBlock(), createBlock("del", {
                                                  key: 0,
                                                  class: "muted small"
                                                }, toDisplayString(fmt(c.price)), 1)) : createCommentVNode("", true)
                                              ])) : (openBlock(), createBlock("span", {
                                                key: 1,
                                                class: "price"
                                              }, "Free"))
                                            ]),
                                            createVNode("div", { class: "actions" }, [
                                              createVNode(_component_a_space, null, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_button, {
                                                    onClick: ($event) => openCourse(c)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("View")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"]),
                                                  createVNode(_component_a_button, {
                                                    onClick: ($event) => addCourseToCart(c),
                                                    disabled: isPurchased(c) || unref(isInCart)(c.id),
                                                    loading: unref(cartLoading)
                                                  }, {
                                                    default: withCtx(() => [
                                                      isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                        createTextVNode("Purchased")
                                                      ], 64)) : unref(isInCart)(c.id) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                        createTextVNode("In Cart")
                                                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                        createTextVNode("Add to cart")
                                                      ], 64))
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["onClick", "disabled", "loading"]),
                                                  createVNode(_component_a_button, {
                                                    type: "primary",
                                                    onClick: ($event) => isPurchased(c) ? openCourse(c) : checkoutCourse(c),
                                                    loading: purchasingId.value === c.id
                                                  }, {
                                                    default: withCtx(() => [
                                                      isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                        createTextVNode("Continue")
                                                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                        createTextVNode("Buy")
                                                      ], 64))
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["onClick", "loading"])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ])
                                          ])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent4, _scopeId3));
                            });
                            _push4(`<!--]-->`);
                          } else {
                            return [
                              (openBlock(true), createBlock(Fragment, null, renderList(paged.value, (c) => {
                                return openBlock(), createBlock(_component_a_col, {
                                  key: c.id,
                                  xs: 24,
                                  sm: 12,
                                  md: 12,
                                  lg: 8,
                                  xl: 6
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, {
                                      class: "course-card",
                                      hoverable: true,
                                      "body-style": { padding: "12px" }
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("div", {
                                          class: "cover",
                                          style: cover(c)
                                        }, [
                                          c.discount || isFree(c) ? (openBlock(), createBlock("div", {
                                            key: 0,
                                            class: "badge"
                                          }, [
                                            isFree(c) ? (openBlock(), createBlock(_component_a_tag, {
                                              key: 0,
                                              color: "green"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Free")
                                              ]),
                                              _: 1
                                            })) : (openBlock(), createBlock(_component_a_tag, {
                                              key: 1,
                                              color: "red"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(c.discount) + "% off", 1)
                                              ]),
                                              _: 2
                                            }, 1024))
                                          ])) : createCommentVNode("", true),
                                          isPurchased(c) ? (openBlock(), createBlock(_component_a_tag, {
                                            key: 1,
                                            color: "green",
                                            class: "purchased-tag"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Purchased")
                                            ]),
                                            _: 1
                                          })) : createCommentVNode("", true)
                                        ], 4),
                                        createVNode("div", { class: "meta" }, [
                                          createVNode("div", {
                                            class: "title",
                                            title: c.title
                                          }, toDisplayString(c.title), 9, ["title"]),
                                          createVNode("div", { class: "tags" }, [
                                            c.category ? (openBlock(), createBlock(_component_a_tag, {
                                              key: 0,
                                              color: "blue"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(c.category), 1)
                                              ]),
                                              _: 2
                                            }, 1024)) : createCommentVNode("", true),
                                            c.difficulty ? (openBlock(), createBlock(_component_a_tag, {
                                              key: 1,
                                              color: "gold"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(c.difficulty), 1)
                                              ]),
                                              _: 2
                                            }, 1024)) : createCommentVNode("", true)
                                          ]),
                                          createVNode("div", { class: "stats" }, [
                                            createVNode("span", null, [
                                              createVNode(unref(FieldTimeOutlined)),
                                              createTextVNode(" " + toDisplayString(totalMinutes(c)) + " min", 1)
                                            ]),
                                            createVNode("span", null, "• " + toDisplayString(totalLessons(c)) + " lessons", 1)
                                          ]),
                                          createVNode("div", { class: "price-row" }, [
                                            !isFree(c) ? (openBlock(), createBlock("span", {
                                              key: 0,
                                              class: "price"
                                            }, [
                                              createTextVNode(toDisplayString(fmt(payablePrice(c))) + " ", 1),
                                              c.discount ? (openBlock(), createBlock("del", {
                                                key: 0,
                                                class: "muted small"
                                              }, toDisplayString(fmt(c.price)), 1)) : createCommentVNode("", true)
                                            ])) : (openBlock(), createBlock("span", {
                                              key: 1,
                                              class: "price"
                                            }, "Free"))
                                          ]),
                                          createVNode("div", { class: "actions" }, [
                                            createVNode(_component_a_space, null, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_button, {
                                                  onClick: ($event) => openCourse(c)
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("View")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"]),
                                                createVNode(_component_a_button, {
                                                  onClick: ($event) => addCourseToCart(c),
                                                  disabled: isPurchased(c) || unref(isInCart)(c.id),
                                                  loading: unref(cartLoading)
                                                }, {
                                                  default: withCtx(() => [
                                                    isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                      createTextVNode("Purchased")
                                                    ], 64)) : unref(isInCart)(c.id) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                      createTextVNode("In Cart")
                                                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                      createTextVNode("Add to cart")
                                                    ], 64))
                                                  ]),
                                                  _: 2
                                                }, 1032, ["onClick", "disabled", "loading"]),
                                                createVNode(_component_a_button, {
                                                  type: "primary",
                                                  onClick: ($event) => isPurchased(c) ? openCourse(c) : checkoutCourse(c),
                                                  loading: purchasingId.value === c.id
                                                }, {
                                                  default: withCtx(() => [
                                                    isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                      createTextVNode("Continue")
                                                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                      createTextVNode("Buy")
                                                    ], 64))
                                                  ]),
                                                  _: 2
                                                }, 1032, ["onClick", "loading"])
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ])
                                        ])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<div class="list-wrap" data-v-631ee27d${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_a_list, {
                        "data-source": paged.value,
                        "item-layout": "horizontal",
                        bordered: ""
                      }, {
                        renderItem: withCtx(({ item: c }, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_a_list_item, {
                              key: c.id
                            }, {
                              actions: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="list-actions" data-v-631ee27d${_scopeId4}><span class="list-price" data-v-631ee27d${_scopeId4}>`);
                                  if (isFree(c)) {
                                    _push5(`<!--[-->Free<!--]-->`);
                                  } else {
                                    _push5(`<!--[-->${ssrInterpolate(fmt(payablePrice(c)))} `);
                                    if (c.discount) {
                                      _push5(`<del class="muted small" style="${ssrRenderStyle({ "margin-left": "6px" })}" data-v-631ee27d${_scopeId4}>${ssrInterpolate(fmt(c.price))}</del>`);
                                    } else {
                                      _push5(`<!---->`);
                                    }
                                    _push5(`<!--]-->`);
                                  }
                                  _push5(`</span>`);
                                  _push5(ssrRenderComponent(_component_a_space, null, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_component_a_button, {
                                          onClick: ($event) => openCourse(c)
                                        }, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`View`);
                                            } else {
                                              return [
                                                createTextVNode("View")
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(_component_a_button, {
                                          onClick: ($event) => addCourseToCart(c),
                                          disabled: isPurchased(c) || unref(isInCart)(c.id),
                                          loading: unref(cartLoading)
                                        }, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              if (isPurchased(c)) {
                                                _push7(`<!--[-->Purchased<!--]-->`);
                                              } else if (unref(isInCart)(c.id)) {
                                                _push7(`<!--[-->In Cart<!--]-->`);
                                              } else {
                                                _push7(`<!--[-->Add to cart<!--]-->`);
                                              }
                                            } else {
                                              return [
                                                isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                  createTextVNode("Purchased")
                                                ], 64)) : unref(isInCart)(c.id) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                  createTextVNode("In Cart")
                                                ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                  createTextVNode("Add to cart")
                                                ], 64))
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(_component_a_button, {
                                          type: "primary",
                                          onClick: ($event) => isPurchased(c) ? openCourse(c) : checkoutCourse(c),
                                          loading: purchasingId.value === c.id
                                        }, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              if (isPurchased(c)) {
                                                _push7(`<!--[-->Continue<!--]-->`);
                                              } else {
                                                _push7(`<!--[-->Buy<!--]-->`);
                                              }
                                            } else {
                                              return [
                                                isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                  createTextVNode("Continue")
                                                ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                  createTextVNode("Buy")
                                                ], 64))
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(_component_a_button, {
                                            onClick: ($event) => openCourse(c)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("View")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"]),
                                          createVNode(_component_a_button, {
                                            onClick: ($event) => addCourseToCart(c),
                                            disabled: isPurchased(c) || unref(isInCart)(c.id),
                                            loading: unref(cartLoading)
                                          }, {
                                            default: withCtx(() => [
                                              isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                createTextVNode("Purchased")
                                              ], 64)) : unref(isInCart)(c.id) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                createTextVNode("In Cart")
                                              ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                createTextVNode("Add to cart")
                                              ], 64))
                                            ]),
                                            _: 2
                                          }, 1032, ["onClick", "disabled", "loading"]),
                                          createVNode(_component_a_button, {
                                            type: "primary",
                                            onClick: ($event) => isPurchased(c) ? openCourse(c) : checkoutCourse(c),
                                            loading: purchasingId.value === c.id
                                          }, {
                                            default: withCtx(() => [
                                              isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                createTextVNode("Continue")
                                              ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                createTextVNode("Buy")
                                              ], 64))
                                            ]),
                                            _: 2
                                          }, 1032, ["onClick", "loading"])
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                  _push5(`</div>`);
                                } else {
                                  return [
                                    createVNode("div", { class: "list-actions" }, [
                                      createVNode("span", { class: "list-price" }, [
                                        isFree(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                          createTextVNode("Free")
                                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                          createTextVNode(toDisplayString(fmt(payablePrice(c))) + " ", 1),
                                          c.discount ? (openBlock(), createBlock("del", {
                                            key: 0,
                                            class: "muted small",
                                            style: { "margin-left": "6px" }
                                          }, toDisplayString(fmt(c.price)), 1)) : createCommentVNode("", true)
                                        ], 64))
                                      ]),
                                      createVNode(_component_a_space, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_button, {
                                            onClick: ($event) => openCourse(c)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("View")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"]),
                                          createVNode(_component_a_button, {
                                            onClick: ($event) => addCourseToCart(c),
                                            disabled: isPurchased(c) || unref(isInCart)(c.id),
                                            loading: unref(cartLoading)
                                          }, {
                                            default: withCtx(() => [
                                              isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                createTextVNode("Purchased")
                                              ], 64)) : unref(isInCart)(c.id) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                createTextVNode("In Cart")
                                              ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                createTextVNode("Add to cart")
                                              ], 64))
                                            ]),
                                            _: 2
                                          }, 1032, ["onClick", "disabled", "loading"]),
                                          createVNode(_component_a_button, {
                                            type: "primary",
                                            onClick: ($event) => isPurchased(c) ? openCourse(c) : checkoutCourse(c),
                                            loading: purchasingId.value === c.id
                                          }, {
                                            default: withCtx(() => [
                                              isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                createTextVNode("Continue")
                                              ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                createTextVNode("Buy")
                                              ], 64))
                                            ]),
                                            _: 2
                                          }, 1032, ["onClick", "loading"])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ])
                                  ];
                                }
                              }),
                              default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_a_list_item_meta, null, {
                                    avatar: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`<div class="list-cover" style="${ssrRenderStyle(cover(c))}" data-v-631ee27d${_scopeId5}></div>`);
                                      } else {
                                        return [
                                          createVNode("div", {
                                            class: "list-cover",
                                            style: cover(c)
                                          }, null, 4)
                                        ];
                                      }
                                    }),
                                    title: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`<div class="list-title" data-v-631ee27d${_scopeId5}><span data-v-631ee27d${_scopeId5}>${ssrInterpolate(c.title)}</span>`);
                                        if (c.category) {
                                          _push6(ssrRenderComponent(_component_a_tag, {
                                            color: "blue",
                                            style: { "margin-left": "8px" }
                                          }, {
                                            default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                              if (_push7) {
                                                _push7(`${ssrInterpolate(c.category)}`);
                                              } else {
                                                return [
                                                  createTextVNode(toDisplayString(c.category), 1)
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent6, _scopeId5));
                                        } else {
                                          _push6(`<!---->`);
                                        }
                                        if (c.difficulty) {
                                          _push6(ssrRenderComponent(_component_a_tag, { color: "gold" }, {
                                            default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                              if (_push7) {
                                                _push7(`${ssrInterpolate(c.difficulty)}`);
                                              } else {
                                                return [
                                                  createTextVNode(toDisplayString(c.difficulty), 1)
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent6, _scopeId5));
                                        } else {
                                          _push6(`<!---->`);
                                        }
                                        if (isPurchased(c)) {
                                          _push6(ssrRenderComponent(_component_a_tag, { color: "green" }, {
                                            default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                              if (_push7) {
                                                _push7(`Purchased`);
                                              } else {
                                                return [
                                                  createTextVNode("Purchased")
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent6, _scopeId5));
                                        } else if (isFree(c)) {
                                          _push6(ssrRenderComponent(_component_a_tag, { color: "green" }, {
                                            default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                              if (_push7) {
                                                _push7(`Free`);
                                              } else {
                                                return [
                                                  createTextVNode("Free")
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent6, _scopeId5));
                                        } else if (c.discount) {
                                          _push6(ssrRenderComponent(_component_a_tag, { color: "red" }, {
                                            default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                              if (_push7) {
                                                _push7(`${ssrInterpolate(c.discount)}% off`);
                                              } else {
                                                return [
                                                  createTextVNode(toDisplayString(c.discount) + "% off", 1)
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent6, _scopeId5));
                                        } else {
                                          _push6(`<!---->`);
                                        }
                                        _push6(`</div>`);
                                      } else {
                                        return [
                                          createVNode("div", { class: "list-title" }, [
                                            createVNode("span", null, toDisplayString(c.title), 1),
                                            c.category ? (openBlock(), createBlock(_component_a_tag, {
                                              key: 0,
                                              color: "blue",
                                              style: { "margin-left": "8px" }
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(c.category), 1)
                                              ]),
                                              _: 2
                                            }, 1024)) : createCommentVNode("", true),
                                            c.difficulty ? (openBlock(), createBlock(_component_a_tag, {
                                              key: 1,
                                              color: "gold"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(c.difficulty), 1)
                                              ]),
                                              _: 2
                                            }, 1024)) : createCommentVNode("", true),
                                            isPurchased(c) ? (openBlock(), createBlock(_component_a_tag, {
                                              key: 2,
                                              color: "green"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Purchased")
                                              ]),
                                              _: 1
                                            })) : isFree(c) ? (openBlock(), createBlock(_component_a_tag, {
                                              key: 3,
                                              color: "green"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Free")
                                              ]),
                                              _: 1
                                            })) : c.discount ? (openBlock(), createBlock(_component_a_tag, {
                                              key: 4,
                                              color: "red"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(c.discount) + "% off", 1)
                                              ]),
                                              _: 2
                                            }, 1024)) : createCommentVNode("", true)
                                          ])
                                        ];
                                      }
                                    }),
                                    description: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`<div class="list-desc" data-v-631ee27d${_scopeId5}><span data-v-631ee27d${_scopeId5}>`);
                                        _push6(ssrRenderComponent(unref(FieldTimeOutlined), null, null, _parent6, _scopeId5));
                                        _push6(` ${ssrInterpolate(totalMinutes(c))} min</span><span data-v-631ee27d${_scopeId5}>• ${ssrInterpolate(totalLessons(c))} lessons</span></div>`);
                                      } else {
                                        return [
                                          createVNode("div", { class: "list-desc" }, [
                                            createVNode("span", null, [
                                              createVNode(unref(FieldTimeOutlined)),
                                              createTextVNode(" " + toDisplayString(totalMinutes(c)) + " min", 1)
                                            ]),
                                            createVNode("span", null, "• " + toDisplayString(totalLessons(c)) + " lessons", 1)
                                          ])
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(_component_a_list_item_meta, null, {
                                      avatar: withCtx(() => [
                                        createVNode("div", {
                                          class: "list-cover",
                                          style: cover(c)
                                        }, null, 4)
                                      ]),
                                      title: withCtx(() => [
                                        createVNode("div", { class: "list-title" }, [
                                          createVNode("span", null, toDisplayString(c.title), 1),
                                          c.category ? (openBlock(), createBlock(_component_a_tag, {
                                            key: 0,
                                            color: "blue",
                                            style: { "margin-left": "8px" }
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(c.category), 1)
                                            ]),
                                            _: 2
                                          }, 1024)) : createCommentVNode("", true),
                                          c.difficulty ? (openBlock(), createBlock(_component_a_tag, {
                                            key: 1,
                                            color: "gold"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(c.difficulty), 1)
                                            ]),
                                            _: 2
                                          }, 1024)) : createCommentVNode("", true),
                                          isPurchased(c) ? (openBlock(), createBlock(_component_a_tag, {
                                            key: 2,
                                            color: "green"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Purchased")
                                            ]),
                                            _: 1
                                          })) : isFree(c) ? (openBlock(), createBlock(_component_a_tag, {
                                            key: 3,
                                            color: "green"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Free")
                                            ]),
                                            _: 1
                                          })) : c.discount ? (openBlock(), createBlock(_component_a_tag, {
                                            key: 4,
                                            color: "red"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(c.discount) + "% off", 1)
                                            ]),
                                            _: 2
                                          }, 1024)) : createCommentVNode("", true)
                                        ])
                                      ]),
                                      description: withCtx(() => [
                                        createVNode("div", { class: "list-desc" }, [
                                          createVNode("span", null, [
                                            createVNode(unref(FieldTimeOutlined)),
                                            createTextVNode(" " + toDisplayString(totalMinutes(c)) + " min", 1)
                                          ]),
                                          createVNode("span", null, "• " + toDisplayString(totalLessons(c)) + " lessons", 1)
                                        ])
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
                              (openBlock(), createBlock(_component_a_list_item, {
                                key: c.id
                              }, {
                                actions: withCtx(() => [
                                  createVNode("div", { class: "list-actions" }, [
                                    createVNode("span", { class: "list-price" }, [
                                      isFree(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                        createTextVNode("Free")
                                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                        createTextVNode(toDisplayString(fmt(payablePrice(c))) + " ", 1),
                                        c.discount ? (openBlock(), createBlock("del", {
                                          key: 0,
                                          class: "muted small",
                                          style: { "margin-left": "6px" }
                                        }, toDisplayString(fmt(c.price)), 1)) : createCommentVNode("", true)
                                      ], 64))
                                    ]),
                                    createVNode(_component_a_space, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_button, {
                                          onClick: ($event) => openCourse(c)
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("View")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"]),
                                        createVNode(_component_a_button, {
                                          onClick: ($event) => addCourseToCart(c),
                                          disabled: isPurchased(c) || unref(isInCart)(c.id),
                                          loading: unref(cartLoading)
                                        }, {
                                          default: withCtx(() => [
                                            isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                              createTextVNode("Purchased")
                                            ], 64)) : unref(isInCart)(c.id) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                              createTextVNode("In Cart")
                                            ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                              createTextVNode("Add to cart")
                                            ], 64))
                                          ]),
                                          _: 2
                                        }, 1032, ["onClick", "disabled", "loading"]),
                                        createVNode(_component_a_button, {
                                          type: "primary",
                                          onClick: ($event) => isPurchased(c) ? openCourse(c) : checkoutCourse(c),
                                          loading: purchasingId.value === c.id
                                        }, {
                                          default: withCtx(() => [
                                            isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                              createTextVNode("Continue")
                                            ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                              createTextVNode("Buy")
                                            ], 64))
                                          ]),
                                          _: 2
                                        }, 1032, ["onClick", "loading"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ])
                                ]),
                                default: withCtx(() => [
                                  createVNode(_component_a_list_item_meta, null, {
                                    avatar: withCtx(() => [
                                      createVNode("div", {
                                        class: "list-cover",
                                        style: cover(c)
                                      }, null, 4)
                                    ]),
                                    title: withCtx(() => [
                                      createVNode("div", { class: "list-title" }, [
                                        createVNode("span", null, toDisplayString(c.title), 1),
                                        c.category ? (openBlock(), createBlock(_component_a_tag, {
                                          key: 0,
                                          color: "blue",
                                          style: { "margin-left": "8px" }
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(c.category), 1)
                                          ]),
                                          _: 2
                                        }, 1024)) : createCommentVNode("", true),
                                        c.difficulty ? (openBlock(), createBlock(_component_a_tag, {
                                          key: 1,
                                          color: "gold"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(c.difficulty), 1)
                                          ]),
                                          _: 2
                                        }, 1024)) : createCommentVNode("", true),
                                        isPurchased(c) ? (openBlock(), createBlock(_component_a_tag, {
                                          key: 2,
                                          color: "green"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Purchased")
                                          ]),
                                          _: 1
                                        })) : isFree(c) ? (openBlock(), createBlock(_component_a_tag, {
                                          key: 3,
                                          color: "green"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Free")
                                          ]),
                                          _: 1
                                        })) : c.discount ? (openBlock(), createBlock(_component_a_tag, {
                                          key: 4,
                                          color: "red"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(c.discount) + "% off", 1)
                                          ]),
                                          _: 2
                                        }, 1024)) : createCommentVNode("", true)
                                      ])
                                    ]),
                                    description: withCtx(() => [
                                      createVNode("div", { class: "list-desc" }, [
                                        createVNode("span", null, [
                                          createVNode(unref(FieldTimeOutlined)),
                                          createTextVNode(" " + toDisplayString(totalMinutes(c)) + " min", 1)
                                        ]),
                                        createVNode("span", null, "• " + toDisplayString(totalLessons(c)) + " lessons", 1)
                                      ])
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024))
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(`</div>`);
                    }
                    if (filtered.value.length > pageSize.value) {
                      _push3(`<div class="pagi" data-v-631ee27d${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_a_pagination, {
                        current: page.value,
                        "onUpdate:current": ($event) => page.value = $event,
                        total: filtered.value.length,
                        pageSize: pageSize.value,
                        "show-size-changer": "",
                        pageSizeOptions: ["8", "12", "16", "24", "32"],
                        onChange: onPaginate,
                        onShowSizeChange: onSizeChange
                      }, null, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    _push3(`<div class="results" data-v-631ee27d${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_a_row, { gutter: [16, 16] }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<!--[-->`);
                          ssrRenderList(8, (i) => {
                            _push4(ssrRenderComponent(_component_a_col, {
                              key: i,
                              xs: 24,
                              sm: 12,
                              md: 12,
                              lg: 8,
                              xl: 6
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_a_card, {
                                    loading: true,
                                    "body-style": { padding: "12px" }
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`<div style="${ssrRenderStyle({ "height": "150px", "background": "#f0f2f5", "border-radius": "8px" })}" data-v-631ee27d${_scopeId5}></div>`);
                                      } else {
                                        return [
                                          createVNode("div", { style: { "height": "150px", "background": "#f0f2f5", "border-radius": "8px" } })
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(_component_a_card, {
                                      loading: true,
                                      "body-style": { padding: "12px" }
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("div", { style: { "height": "150px", "background": "#f0f2f5", "border-radius": "8px" } })
                                      ]),
                                      _: 1
                                    })
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            (openBlock(), createBlock(Fragment, null, renderList(8, (i) => {
                              return createVNode(_component_a_col, {
                                key: i,
                                xs: 24,
                                sm: 12,
                                md: 12,
                                lg: 8,
                                xl: 6
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, {
                                    loading: true,
                                    "body-style": { padding: "12px" }
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("div", { style: { "height": "150px", "background": "#f0f2f5", "border-radius": "8px" } })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              });
                            }), 64))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  }
                } else {
                  return [
                    createVNode(_component_a_page_header, {
                      class: "header",
                      title: "Browse Courses",
                      "sub-title": `${filtered.value.length} result${filtered.value.length === 1 ? "" : "s"}`
                    }, {
                      extra: withCtx(() => [
                        createVNode(_component_a_space, null, {
                          default: withCtx(() => [
                            createVNode(_component_a_tooltip, {
                              title: isDark.value ? "Switch to light" : "Switch to dark"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_button, {
                                  shape: "circle",
                                  onClick: toggleDark
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(BulbOutlined))
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["title"]),
                            unref(itemCount) > 0 ? (openBlock(), createBlock(_component_a_button, {
                              key: 0,
                              type: "primary",
                              ghost: "",
                              onClick: goCart
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Cart (" + toDisplayString(unref(itemCount)) + ") ", 1)
                              ]),
                              _: 1
                            })) : createCommentVNode("", true),
                            createVNode(_component_a_button, {
                              shape: "circle",
                              onClick: reload,
                              loading: loading.value,
                              title: "Refresh"
                            }, {
                              default: withCtx(() => [
                                (openBlock(), createBlock("svg", {
                                  viewBox: "0 0 24 24",
                                  width: "1em",
                                  height: "1em"
                                }, [
                                  createVNode("path", {
                                    fill: "currentColor",
                                    d: "M12 6V3L8 7l4 4V8a4 4 0 1 1-4 4H6a6 6 0 1 0 6-6z"
                                  })
                                ]))
                              ]),
                              _: 1
                            }, 8, ["loading"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["sub-title"]),
                    createVNode("div", { class: "filters" }, [
                      createVNode(_component_a_row, {
                        gutter: [12, 12],
                        align: "middle"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 10,
                            lg: 12
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_input_search, {
                                value: q.value,
                                "onUpdate:value": ($event) => q.value = $event,
                                placeholder: "Search by title, category…",
                                "allow-clear": "",
                                onSearch: noop
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 12,
                            md: 6,
                            lg: 4
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_select, {
                                value: category.value,
                                "onUpdate:value": ($event) => category.value = $event,
                                "allow-clear": "",
                                placeholder: "Category",
                                style: { "width": "100%" }
                              }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (c) => {
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
                          }),
                          createVNode(_component_a_col, {
                            xs: 12,
                            md: 4,
                            lg: 4
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_select, {
                                value: difficulty.value,
                                "onUpdate:value": ($event) => difficulty.value = $event,
                                "allow-clear": "",
                                placeholder: "Difficulty",
                                style: { "width": "100%" }
                              }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(difficulties.value, (d) => {
                                    return openBlock(), createBlock(_component_a_select_option, {
                                      key: d,
                                      value: d
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(d), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["value"]);
                                  }), 128))
                                ]),
                                _: 1
                              }, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 4,
                            lg: 4,
                            class: "right-controls"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_segmented, {
                                value: viewMode.value,
                                "onUpdate:value": ($event) => viewMode.value = $event,
                                options: [{ label: "Grid", value: "grid" }, { label: "List", value: "list" }],
                                size: "small"
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "chips" }, [
                        createVNode(_component_a_checkbox, {
                          checked: onlyFree.value,
                          "onUpdate:checked": ($event) => onlyFree.value = $event
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Free")
                          ]),
                          _: 1
                        }, 8, ["checked", "onUpdate:checked"]),
                        createVNode(_component_a_checkbox, {
                          checked: onlyDiscounted.value,
                          "onUpdate:checked": ($event) => onlyDiscounted.value = $event
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Discounted")
                          ]),
                          _: 1
                        }, 8, ["checked", "onUpdate:checked"]),
                        createVNode(_component_a_checkbox, {
                          checked: onlyPurchased.value,
                          "onUpdate:checked": ($event) => onlyPurchased.value = $event
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Purchased")
                          ]),
                          _: 1
                        }, 8, ["checked", "onUpdate:checked"]),
                        createVNode(_component_a_select, {
                          value: sort.value,
                          "onUpdate:value": ($event) => sort.value = $event,
                          size: "small",
                          style: { "min-width": "180px", "margin-left": "auto" }
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_select_option, { value: "popular" }, {
                              default: withCtx(() => [
                                createTextVNode("Most popular")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_select_option, { value: "newest" }, {
                              default: withCtx(() => [
                                createTextVNode("Newest")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_select_option, { value: "price-asc" }, {
                              default: withCtx(() => [
                                createTextVNode("Price ↑")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_select_option, { value: "price-desc" }, {
                              default: withCtx(() => [
                                createTextVNode("Price ↓")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_select_option, { value: "length-desc" }, {
                              default: withCtx(() => [
                                createTextVNode("Longest")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["value", "onUpdate:value"])
                      ])
                    ]),
                    !loading.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "results"
                    }, [
                      paged.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                        key: 0,
                        description: "No matching courses."
                      })) : viewMode.value === "grid" ? (openBlock(), createBlock(_component_a_row, {
                        key: 1,
                        gutter: [16, 16]
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(paged.value, (c) => {
                            return openBlock(), createBlock(_component_a_col, {
                              key: c.id,
                              xs: 24,
                              sm: 12,
                              md: 12,
                              lg: 8,
                              xl: 6
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, {
                                  class: "course-card",
                                  hoverable: true,
                                  "body-style": { padding: "12px" }
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", {
                                      class: "cover",
                                      style: cover(c)
                                    }, [
                                      c.discount || isFree(c) ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "badge"
                                      }, [
                                        isFree(c) ? (openBlock(), createBlock(_component_a_tag, {
                                          key: 0,
                                          color: "green"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Free")
                                          ]),
                                          _: 1
                                        })) : (openBlock(), createBlock(_component_a_tag, {
                                          key: 1,
                                          color: "red"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(c.discount) + "% off", 1)
                                          ]),
                                          _: 2
                                        }, 1024))
                                      ])) : createCommentVNode("", true),
                                      isPurchased(c) ? (openBlock(), createBlock(_component_a_tag, {
                                        key: 1,
                                        color: "green",
                                        class: "purchased-tag"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Purchased")
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true)
                                    ], 4),
                                    createVNode("div", { class: "meta" }, [
                                      createVNode("div", {
                                        class: "title",
                                        title: c.title
                                      }, toDisplayString(c.title), 9, ["title"]),
                                      createVNode("div", { class: "tags" }, [
                                        c.category ? (openBlock(), createBlock(_component_a_tag, {
                                          key: 0,
                                          color: "blue"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(c.category), 1)
                                          ]),
                                          _: 2
                                        }, 1024)) : createCommentVNode("", true),
                                        c.difficulty ? (openBlock(), createBlock(_component_a_tag, {
                                          key: 1,
                                          color: "gold"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(c.difficulty), 1)
                                          ]),
                                          _: 2
                                        }, 1024)) : createCommentVNode("", true)
                                      ]),
                                      createVNode("div", { class: "stats" }, [
                                        createVNode("span", null, [
                                          createVNode(unref(FieldTimeOutlined)),
                                          createTextVNode(" " + toDisplayString(totalMinutes(c)) + " min", 1)
                                        ]),
                                        createVNode("span", null, "• " + toDisplayString(totalLessons(c)) + " lessons", 1)
                                      ]),
                                      createVNode("div", { class: "price-row" }, [
                                        !isFree(c) ? (openBlock(), createBlock("span", {
                                          key: 0,
                                          class: "price"
                                        }, [
                                          createTextVNode(toDisplayString(fmt(payablePrice(c))) + " ", 1),
                                          c.discount ? (openBlock(), createBlock("del", {
                                            key: 0,
                                            class: "muted small"
                                          }, toDisplayString(fmt(c.price)), 1)) : createCommentVNode("", true)
                                        ])) : (openBlock(), createBlock("span", {
                                          key: 1,
                                          class: "price"
                                        }, "Free"))
                                      ]),
                                      createVNode("div", { class: "actions" }, [
                                        createVNode(_component_a_space, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_button, {
                                              onClick: ($event) => openCourse(c)
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("View")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"]),
                                            createVNode(_component_a_button, {
                                              onClick: ($event) => addCourseToCart(c),
                                              disabled: isPurchased(c) || unref(isInCart)(c.id),
                                              loading: unref(cartLoading)
                                            }, {
                                              default: withCtx(() => [
                                                isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                  createTextVNode("Purchased")
                                                ], 64)) : unref(isInCart)(c.id) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                  createTextVNode("In Cart")
                                                ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                  createTextVNode("Add to cart")
                                                ], 64))
                                              ]),
                                              _: 2
                                            }, 1032, ["onClick", "disabled", "loading"]),
                                            createVNode(_component_a_button, {
                                              type: "primary",
                                              onClick: ($event) => isPurchased(c) ? openCourse(c) : checkoutCourse(c),
                                              loading: purchasingId.value === c.id
                                            }, {
                                              default: withCtx(() => [
                                                isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                  createTextVNode("Continue")
                                                ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                  createTextVNode("Buy")
                                                ], 64))
                                              ]),
                                              _: 2
                                            }, 1032, ["onClick", "loading"])
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ])
                                    ])
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ]),
                        _: 1
                      })) : (openBlock(), createBlock("div", {
                        key: 2,
                        class: "list-wrap"
                      }, [
                        createVNode(_component_a_list, {
                          "data-source": paged.value,
                          "item-layout": "horizontal",
                          bordered: ""
                        }, {
                          renderItem: withCtx(({ item: c }) => [
                            (openBlock(), createBlock(_component_a_list_item, {
                              key: c.id
                            }, {
                              actions: withCtx(() => [
                                createVNode("div", { class: "list-actions" }, [
                                  createVNode("span", { class: "list-price" }, [
                                    isFree(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                      createTextVNode("Free")
                                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                      createTextVNode(toDisplayString(fmt(payablePrice(c))) + " ", 1),
                                      c.discount ? (openBlock(), createBlock("del", {
                                        key: 0,
                                        class: "muted small",
                                        style: { "margin-left": "6px" }
                                      }, toDisplayString(fmt(c.price)), 1)) : createCommentVNode("", true)
                                    ], 64))
                                  ]),
                                  createVNode(_component_a_space, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_button, {
                                        onClick: ($event) => openCourse(c)
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("View")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"]),
                                      createVNode(_component_a_button, {
                                        onClick: ($event) => addCourseToCart(c),
                                        disabled: isPurchased(c) || unref(isInCart)(c.id),
                                        loading: unref(cartLoading)
                                      }, {
                                        default: withCtx(() => [
                                          isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                            createTextVNode("Purchased")
                                          ], 64)) : unref(isInCart)(c.id) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                            createTextVNode("In Cart")
                                          ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                            createTextVNode("Add to cart")
                                          ], 64))
                                        ]),
                                        _: 2
                                      }, 1032, ["onClick", "disabled", "loading"]),
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        onClick: ($event) => isPurchased(c) ? openCourse(c) : checkoutCourse(c),
                                        loading: purchasingId.value === c.id
                                      }, {
                                        default: withCtx(() => [
                                          isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                            createTextVNode("Continue")
                                          ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                            createTextVNode("Buy")
                                          ], 64))
                                        ]),
                                        _: 2
                                      }, 1032, ["onClick", "loading"])
                                    ]),
                                    _: 2
                                  }, 1024)
                                ])
                              ]),
                              default: withCtx(() => [
                                createVNode(_component_a_list_item_meta, null, {
                                  avatar: withCtx(() => [
                                    createVNode("div", {
                                      class: "list-cover",
                                      style: cover(c)
                                    }, null, 4)
                                  ]),
                                  title: withCtx(() => [
                                    createVNode("div", { class: "list-title" }, [
                                      createVNode("span", null, toDisplayString(c.title), 1),
                                      c.category ? (openBlock(), createBlock(_component_a_tag, {
                                        key: 0,
                                        color: "blue",
                                        style: { "margin-left": "8px" }
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(c.category), 1)
                                        ]),
                                        _: 2
                                      }, 1024)) : createCommentVNode("", true),
                                      c.difficulty ? (openBlock(), createBlock(_component_a_tag, {
                                        key: 1,
                                        color: "gold"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(c.difficulty), 1)
                                        ]),
                                        _: 2
                                      }, 1024)) : createCommentVNode("", true),
                                      isPurchased(c) ? (openBlock(), createBlock(_component_a_tag, {
                                        key: 2,
                                        color: "green"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Purchased")
                                        ]),
                                        _: 1
                                      })) : isFree(c) ? (openBlock(), createBlock(_component_a_tag, {
                                        key: 3,
                                        color: "green"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Free")
                                        ]),
                                        _: 1
                                      })) : c.discount ? (openBlock(), createBlock(_component_a_tag, {
                                        key: 4,
                                        color: "red"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(c.discount) + "% off", 1)
                                        ]),
                                        _: 2
                                      }, 1024)) : createCommentVNode("", true)
                                    ])
                                  ]),
                                  description: withCtx(() => [
                                    createVNode("div", { class: "list-desc" }, [
                                      createVNode("span", null, [
                                        createVNode(unref(FieldTimeOutlined)),
                                        createTextVNode(" " + toDisplayString(totalMinutes(c)) + " min", 1)
                                      ]),
                                      createVNode("span", null, "• " + toDisplayString(totalLessons(c)) + " lessons", 1)
                                    ])
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024))
                          ]),
                          _: 1
                        }, 8, ["data-source"])
                      ])),
                      filtered.value.length > pageSize.value ? (openBlock(), createBlock("div", {
                        key: 3,
                        class: "pagi"
                      }, [
                        createVNode(_component_a_pagination, {
                          current: page.value,
                          "onUpdate:current": ($event) => page.value = $event,
                          total: filtered.value.length,
                          pageSize: pageSize.value,
                          "show-size-changer": "",
                          pageSizeOptions: ["8", "12", "16", "24", "32"],
                          onChange: onPaginate,
                          onShowSizeChange: onSizeChange
                        }, null, 8, ["current", "onUpdate:current", "total", "pageSize"])
                      ])) : createCommentVNode("", true)
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "results"
                    }, [
                      createVNode(_component_a_row, { gutter: [16, 16] }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock(Fragment, null, renderList(8, (i) => {
                            return createVNode(_component_a_col, {
                              key: i,
                              xs: 24,
                              sm: 12,
                              md: 12,
                              lg: 8,
                              xl: 6
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, {
                                  loading: true,
                                  "body-style": { padding: "12px" }
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { style: { "height": "150px", "background": "#f0f2f5", "border-radius": "8px" } })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            });
                          }), 64))
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
              createVNode(_component_a_layout, {
                class: ["course-listing", isDark.value ? "is-dark" : ""]
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_page_header, {
                    class: "header",
                    title: "Browse Courses",
                    "sub-title": `${filtered.value.length} result${filtered.value.length === 1 ? "" : "s"}`
                  }, {
                    extra: withCtx(() => [
                      createVNode(_component_a_space, null, {
                        default: withCtx(() => [
                          createVNode(_component_a_tooltip, {
                            title: isDark.value ? "Switch to light" : "Switch to dark"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, {
                                shape: "circle",
                                onClick: toggleDark
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(BulbOutlined))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["title"]),
                          unref(itemCount) > 0 ? (openBlock(), createBlock(_component_a_button, {
                            key: 0,
                            type: "primary",
                            ghost: "",
                            onClick: goCart
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Cart (" + toDisplayString(unref(itemCount)) + ") ", 1)
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          createVNode(_component_a_button, {
                            shape: "circle",
                            onClick: reload,
                            loading: loading.value,
                            title: "Refresh"
                          }, {
                            default: withCtx(() => [
                              (openBlock(), createBlock("svg", {
                                viewBox: "0 0 24 24",
                                width: "1em",
                                height: "1em"
                              }, [
                                createVNode("path", {
                                  fill: "currentColor",
                                  d: "M12 6V3L8 7l4 4V8a4 4 0 1 1-4 4H6a6 6 0 1 0 6-6z"
                                })
                              ]))
                            ]),
                            _: 1
                          }, 8, ["loading"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["sub-title"]),
                  createVNode("div", { class: "filters" }, [
                    createVNode(_component_a_row, {
                      gutter: [12, 12],
                      align: "middle"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_col, {
                          xs: 24,
                          md: 10,
                          lg: 12
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_input_search, {
                              value: q.value,
                              "onUpdate:value": ($event) => q.value = $event,
                              placeholder: "Search by title, category…",
                              "allow-clear": "",
                              onSearch: noop
                            }, null, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_col, {
                          xs: 12,
                          md: 6,
                          lg: 4
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_select, {
                              value: category.value,
                              "onUpdate:value": ($event) => category.value = $event,
                              "allow-clear": "",
                              placeholder: "Category",
                              style: { "width": "100%" }
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (c) => {
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
                        }),
                        createVNode(_component_a_col, {
                          xs: 12,
                          md: 4,
                          lg: 4
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_select, {
                              value: difficulty.value,
                              "onUpdate:value": ($event) => difficulty.value = $event,
                              "allow-clear": "",
                              placeholder: "Difficulty",
                              style: { "width": "100%" }
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(difficulties.value, (d) => {
                                  return openBlock(), createBlock(_component_a_select_option, {
                                    key: d,
                                    value: d
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(d), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["value"]);
                                }), 128))
                              ]),
                              _: 1
                            }, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_col, {
                          xs: 24,
                          md: 4,
                          lg: 4,
                          class: "right-controls"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_segmented, {
                              value: viewMode.value,
                              "onUpdate:value": ($event) => viewMode.value = $event,
                              options: [{ label: "Grid", value: "grid" }, { label: "List", value: "list" }],
                              size: "small"
                            }, null, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "chips" }, [
                      createVNode(_component_a_checkbox, {
                        checked: onlyFree.value,
                        "onUpdate:checked": ($event) => onlyFree.value = $event
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Free")
                        ]),
                        _: 1
                      }, 8, ["checked", "onUpdate:checked"]),
                      createVNode(_component_a_checkbox, {
                        checked: onlyDiscounted.value,
                        "onUpdate:checked": ($event) => onlyDiscounted.value = $event
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Discounted")
                        ]),
                        _: 1
                      }, 8, ["checked", "onUpdate:checked"]),
                      createVNode(_component_a_checkbox, {
                        checked: onlyPurchased.value,
                        "onUpdate:checked": ($event) => onlyPurchased.value = $event
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Purchased")
                        ]),
                        _: 1
                      }, 8, ["checked", "onUpdate:checked"]),
                      createVNode(_component_a_select, {
                        value: sort.value,
                        "onUpdate:value": ($event) => sort.value = $event,
                        size: "small",
                        style: { "min-width": "180px", "margin-left": "auto" }
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_select_option, { value: "popular" }, {
                            default: withCtx(() => [
                              createTextVNode("Most popular")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "newest" }, {
                            default: withCtx(() => [
                              createTextVNode("Newest")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "price-asc" }, {
                            default: withCtx(() => [
                              createTextVNode("Price ↑")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "price-desc" }, {
                            default: withCtx(() => [
                              createTextVNode("Price ↓")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "length-desc" }, {
                            default: withCtx(() => [
                              createTextVNode("Longest")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["value", "onUpdate:value"])
                    ])
                  ]),
                  !loading.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "results"
                  }, [
                    paged.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                      key: 0,
                      description: "No matching courses."
                    })) : viewMode.value === "grid" ? (openBlock(), createBlock(_component_a_row, {
                      key: 1,
                      gutter: [16, 16]
                    }, {
                      default: withCtx(() => [
                        (openBlock(true), createBlock(Fragment, null, renderList(paged.value, (c) => {
                          return openBlock(), createBlock(_component_a_col, {
                            key: c.id,
                            xs: 24,
                            sm: 12,
                            md: 12,
                            lg: 8,
                            xl: 6
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                class: "course-card",
                                hoverable: true,
                                "body-style": { padding: "12px" }
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", {
                                    class: "cover",
                                    style: cover(c)
                                  }, [
                                    c.discount || isFree(c) ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "badge"
                                    }, [
                                      isFree(c) ? (openBlock(), createBlock(_component_a_tag, {
                                        key: 0,
                                        color: "green"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Free")
                                        ]),
                                        _: 1
                                      })) : (openBlock(), createBlock(_component_a_tag, {
                                        key: 1,
                                        color: "red"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(c.discount) + "% off", 1)
                                        ]),
                                        _: 2
                                      }, 1024))
                                    ])) : createCommentVNode("", true),
                                    isPurchased(c) ? (openBlock(), createBlock(_component_a_tag, {
                                      key: 1,
                                      color: "green",
                                      class: "purchased-tag"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Purchased")
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true)
                                  ], 4),
                                  createVNode("div", { class: "meta" }, [
                                    createVNode("div", {
                                      class: "title",
                                      title: c.title
                                    }, toDisplayString(c.title), 9, ["title"]),
                                    createVNode("div", { class: "tags" }, [
                                      c.category ? (openBlock(), createBlock(_component_a_tag, {
                                        key: 0,
                                        color: "blue"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(c.category), 1)
                                        ]),
                                        _: 2
                                      }, 1024)) : createCommentVNode("", true),
                                      c.difficulty ? (openBlock(), createBlock(_component_a_tag, {
                                        key: 1,
                                        color: "gold"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(c.difficulty), 1)
                                        ]),
                                        _: 2
                                      }, 1024)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", { class: "stats" }, [
                                      createVNode("span", null, [
                                        createVNode(unref(FieldTimeOutlined)),
                                        createTextVNode(" " + toDisplayString(totalMinutes(c)) + " min", 1)
                                      ]),
                                      createVNode("span", null, "• " + toDisplayString(totalLessons(c)) + " lessons", 1)
                                    ]),
                                    createVNode("div", { class: "price-row" }, [
                                      !isFree(c) ? (openBlock(), createBlock("span", {
                                        key: 0,
                                        class: "price"
                                      }, [
                                        createTextVNode(toDisplayString(fmt(payablePrice(c))) + " ", 1),
                                        c.discount ? (openBlock(), createBlock("del", {
                                          key: 0,
                                          class: "muted small"
                                        }, toDisplayString(fmt(c.price)), 1)) : createCommentVNode("", true)
                                      ])) : (openBlock(), createBlock("span", {
                                        key: 1,
                                        class: "price"
                                      }, "Free"))
                                    ]),
                                    createVNode("div", { class: "actions" }, [
                                      createVNode(_component_a_space, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_button, {
                                            onClick: ($event) => openCourse(c)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("View")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"]),
                                          createVNode(_component_a_button, {
                                            onClick: ($event) => addCourseToCart(c),
                                            disabled: isPurchased(c) || unref(isInCart)(c.id),
                                            loading: unref(cartLoading)
                                          }, {
                                            default: withCtx(() => [
                                              isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                createTextVNode("Purchased")
                                              ], 64)) : unref(isInCart)(c.id) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                createTextVNode("In Cart")
                                              ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                createTextVNode("Add to cart")
                                              ], 64))
                                            ]),
                                            _: 2
                                          }, 1032, ["onClick", "disabled", "loading"]),
                                          createVNode(_component_a_button, {
                                            type: "primary",
                                            onClick: ($event) => isPurchased(c) ? openCourse(c) : checkoutCourse(c),
                                            loading: purchasingId.value === c.id
                                          }, {
                                            default: withCtx(() => [
                                              isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                createTextVNode("Continue")
                                              ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                createTextVNode("Buy")
                                              ], 64))
                                            ]),
                                            _: 2
                                          }, 1032, ["onClick", "loading"])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ])
                                  ])
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ]),
                      _: 1
                    })) : (openBlock(), createBlock("div", {
                      key: 2,
                      class: "list-wrap"
                    }, [
                      createVNode(_component_a_list, {
                        "data-source": paged.value,
                        "item-layout": "horizontal",
                        bordered: ""
                      }, {
                        renderItem: withCtx(({ item: c }) => [
                          (openBlock(), createBlock(_component_a_list_item, {
                            key: c.id
                          }, {
                            actions: withCtx(() => [
                              createVNode("div", { class: "list-actions" }, [
                                createVNode("span", { class: "list-price" }, [
                                  isFree(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                    createTextVNode("Free")
                                  ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                    createTextVNode(toDisplayString(fmt(payablePrice(c))) + " ", 1),
                                    c.discount ? (openBlock(), createBlock("del", {
                                      key: 0,
                                      class: "muted small",
                                      style: { "margin-left": "6px" }
                                    }, toDisplayString(fmt(c.price)), 1)) : createCommentVNode("", true)
                                  ], 64))
                                ]),
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      onClick: ($event) => openCourse(c)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("View")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"]),
                                    createVNode(_component_a_button, {
                                      onClick: ($event) => addCourseToCart(c),
                                      disabled: isPurchased(c) || unref(isInCart)(c.id),
                                      loading: unref(cartLoading)
                                    }, {
                                      default: withCtx(() => [
                                        isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                          createTextVNode("Purchased")
                                        ], 64)) : unref(isInCart)(c.id) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                          createTextVNode("In Cart")
                                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                          createTextVNode("Add to cart")
                                        ], 64))
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick", "disabled", "loading"]),
                                    createVNode(_component_a_button, {
                                      type: "primary",
                                      onClick: ($event) => isPurchased(c) ? openCourse(c) : checkoutCourse(c),
                                      loading: purchasingId.value === c.id
                                    }, {
                                      default: withCtx(() => [
                                        isPurchased(c) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                          createTextVNode("Continue")
                                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                          createTextVNode("Buy")
                                        ], 64))
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick", "loading"])
                                  ]),
                                  _: 2
                                }, 1024)
                              ])
                            ]),
                            default: withCtx(() => [
                              createVNode(_component_a_list_item_meta, null, {
                                avatar: withCtx(() => [
                                  createVNode("div", {
                                    class: "list-cover",
                                    style: cover(c)
                                  }, null, 4)
                                ]),
                                title: withCtx(() => [
                                  createVNode("div", { class: "list-title" }, [
                                    createVNode("span", null, toDisplayString(c.title), 1),
                                    c.category ? (openBlock(), createBlock(_component_a_tag, {
                                      key: 0,
                                      color: "blue",
                                      style: { "margin-left": "8px" }
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(c.category), 1)
                                      ]),
                                      _: 2
                                    }, 1024)) : createCommentVNode("", true),
                                    c.difficulty ? (openBlock(), createBlock(_component_a_tag, {
                                      key: 1,
                                      color: "gold"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(c.difficulty), 1)
                                      ]),
                                      _: 2
                                    }, 1024)) : createCommentVNode("", true),
                                    isPurchased(c) ? (openBlock(), createBlock(_component_a_tag, {
                                      key: 2,
                                      color: "green"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Purchased")
                                      ]),
                                      _: 1
                                    })) : isFree(c) ? (openBlock(), createBlock(_component_a_tag, {
                                      key: 3,
                                      color: "green"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Free")
                                      ]),
                                      _: 1
                                    })) : c.discount ? (openBlock(), createBlock(_component_a_tag, {
                                      key: 4,
                                      color: "red"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(c.discount) + "% off", 1)
                                      ]),
                                      _: 2
                                    }, 1024)) : createCommentVNode("", true)
                                  ])
                                ]),
                                description: withCtx(() => [
                                  createVNode("div", { class: "list-desc" }, [
                                    createVNode("span", null, [
                                      createVNode(unref(FieldTimeOutlined)),
                                      createTextVNode(" " + toDisplayString(totalMinutes(c)) + " min", 1)
                                    ]),
                                    createVNode("span", null, "• " + toDisplayString(totalLessons(c)) + " lessons", 1)
                                  ])
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024))
                        ]),
                        _: 1
                      }, 8, ["data-source"])
                    ])),
                    filtered.value.length > pageSize.value ? (openBlock(), createBlock("div", {
                      key: 3,
                      class: "pagi"
                    }, [
                      createVNode(_component_a_pagination, {
                        current: page.value,
                        "onUpdate:current": ($event) => page.value = $event,
                        total: filtered.value.length,
                        pageSize: pageSize.value,
                        "show-size-changer": "",
                        pageSizeOptions: ["8", "12", "16", "24", "32"],
                        onChange: onPaginate,
                        onShowSizeChange: onSizeChange
                      }, null, 8, ["current", "onUpdate:current", "total", "pageSize"])
                    ])) : createCommentVNode("", true)
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "results"
                  }, [
                    createVNode(_component_a_row, { gutter: [16, 16] }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock(Fragment, null, renderList(8, (i) => {
                          return createVNode(_component_a_col, {
                            key: i,
                            xs: 24,
                            sm: 12,
                            md: 12,
                            lg: 8,
                            xl: 6
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                loading: true,
                                "body-style": { padding: "12px" }
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", { style: { "height": "150px", "background": "#f0f2f5", "border-radius": "8px" } })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          });
                        }), 64))
                      ]),
                      _: 1
                    })
                  ]))
                ]),
                _: 1
              }, 8, ["class"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/students-internal/nuxt/pages/course-listing.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const courseListing = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-631ee27d"]]);

export { courseListing as default };
//# sourceMappingURL=course-listing-CL3kVnVd.mjs.map
