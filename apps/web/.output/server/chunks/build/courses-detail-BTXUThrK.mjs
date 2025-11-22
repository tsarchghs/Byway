import { _ as __nuxt_component_0 } from './nuxt-link-DQJ00LSY.mjs';
import { defineComponent, computed, ref, reactive, watch, resolveComponent, withCtx, createTextVNode, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, renderSlot, unref, h, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderSlot, ssrRenderList } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { H as Header } from './Header-DscPRdFw.mjs';
import { message } from 'ant-design-vue';
import { ShoppingCartOutlined, ThunderboltOutlined, HeartOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import { u as useCart } from './useCart-7pxN526Z.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "courses-detail",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const { user } = useAuth();
    const { addToCart, isInCart, loading: cartLoading, fetchCart } = useCart();
    const ME_QUERY = gql`query Me { me { id email roles displayName } }`;
    const COURSE_QUERY = gql`
  query Course($id: String!) {
    course(id: $id) {
      id
      title
      description
      category
      difficulty
      price
      discount
      coverUrl
      teacherId
      modules {
        id
        title
        lessons {
          id
          title
          duration
        }
      }
    }
  }
`;
    const { data: meData, loading: meLoading } = useQuery(ME_QUERY);
    const { data: courseData, loading: courseLoading, refetch: refetchCourse } = useQuery(
      COURSE_QUERY,
      { variables: { id: route.params.id } }
    );
    computed(() => meData?.me || null);
    const course = computed(() => courseData?.course || null);
    const pending = computed(() => courseLoading.value || meLoading.value);
    const adding = ref(false);
    const isInCartCourse = computed(() => course.value ? isInCart(course.value.id) : false);
    const checkingOut = ref(false);
    const inWishlist = ref(false);
    const coupon = ref("");
    const couponApplied = ref(false);
    const validatingCoupon = ref(false);
    const discountPct = ref(0);
    const tabKey = ref("details");
    const thumb = ref("/course-placeholder.png");
    const currentPrice = computed(() => {
      if (!course.value) return 0;
      const basePrice = course.value.price || 0;
      const discount = discountPct.value > 0 ? basePrice * discountPct.value / 100 : 0;
      return basePrice - discount;
    });
    const oldPrice = computed(() => course.value?.price || 0);
    const showOldPrice = computed(() => discountPct.value > 0);
    const discountLabel = computed(() => `-${discountPct.value}%`);
    const instructor = reactive({
      name: "Instructor Name",
      title: "Course Instructor",
      avatar: "/instructor.png",
      bio: ""
    });
    const totalLectures = computed(() => {
      if (!course.value?.modules) return 0;
      return course.value.modules.reduce((sum, mod) => sum + (mod.lessons?.length || 0), 0);
    });
    const totalDuration = computed(() => {
      if (!course.value?.modules) return 0;
      return course.value.modules.reduce((sum, mod) => {
        const lessonSum = mod.lessons?.reduce((s, l) => s + (l.duration || 0), 0) || 0;
        return sum + lessonSum;
      }, 0);
    });
    const totalDurationLabel = computed(() => {
      const hours = Math.floor(totalDuration.value / 60);
      const mins = totalDuration.value % 60;
      if (hours > 0) return `${hours}h ${mins}m`;
      return `${mins}m`;
    });
    const syllabus = computed(() => {
      if (!course.value?.modules) return [];
      return course.value.modules.map((mod) => ({
        id: mod.id,
        title: mod.title,
        lessons: mod.lessons?.length || 0,
        items: mod.lessons || [],
        durationLabel: mod.lessons?.reduce((sum, l) => sum + (l.duration || 0), 0) || 0
      }));
    });
    function money(v) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);
    }
    async function handleAddToCart() {
      if (!course.value) {
        message.error("Course not loaded");
        return;
      }
      if (!user.value?.id) {
        message.warning("Please log in to add courses to your cart");
        router.push("/login");
        return;
      }
      adding.value = true;
      try {
        await addToCart(course.value.id, 1);
        message.success(`Added "${course.value.title}" to cart`);
        await fetchCart();
      } catch (e) {
        if (e?.message?.includes("authenticated")) {
          message.warning("Please log in to add courses to your cart");
          router.push("/login");
        } else if (e?.message?.includes("Already enrolled")) {
          message.info(`You're already enrolled in "${course.value.title}"`);
        } else {
          message.error(e?.message || "Failed to add course to cart");
        }
      } finally {
        adding.value = false;
      }
    }
    const addToCartFn = handleAddToCart;
    async function buyNow() {
      if (!course.value) {
        message.error("Course not loaded");
        return;
      }
      if (!user.value?.id) {
        message.warning("Please log in to purchase courses");
        router.push("/login");
        return;
      }
      checkingOut.value = true;
      try {
        if (!isInCartCourse.value) {
          await addToCart(course.value.id, 1);
        }
        router.push("/checkout");
      } catch (e) {
        message.error(e?.message || "Failed to proceed to checkout");
      } finally {
        checkingOut.value = false;
      }
    }
    function toggleWishlist() {
      inWishlist.value = !inWishlist.value;
      message.info(inWishlist.value ? "Added to wishlist" : "Removed from wishlist");
    }
    async function applyCoupon() {
      if (!course.value || !coupon.value.trim()) {
        message.warning("Please enter a coupon code");
        return;
      }
      validatingCoupon.value = true;
      try {
        message.success("Coupon applied!");
        couponApplied.value = true;
        discountPct.value = 10;
      } catch (e) {
        message.error(e?.message || "Invalid coupon code");
      } finally {
        validatingCoupon.value = false;
      }
    }
    function share(platform) {
      const url = "";
      const title = course.value?.title || "Course";
      if (platform === "link") {
        (void 0).clipboard?.writeText(url);
        message.success("Link copied to clipboard!");
        return;
      }
      const shareUrls = {
        x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
      };
      if (shareUrls[platform]) {
        (void 0).open(shareUrls[platform], "_blank", "width=600,height=400");
      }
    }
    watch(() => route.params.id, (newId) => {
      if (newId) {
        refetchCourse();
      }
    }, { immediate: true });
    watch(() => course.value?.id, async (courseId) => {
      if (courseId && user.value?.id) {
        await fetchCart();
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_card = resolveComponent("a-card");
      const _component_a_breadcrumb = resolveComponent("a-breadcrumb");
      const _component_a_breadcrumb_item = resolveComponent("a-breadcrumb-item");
      const _component_NuxtLink = __nuxt_component_0;
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_skeleton = resolveComponent("a-skeleton");
      const _component_a_typography_paragraph = resolveComponent("a-typography-paragraph");
      const _component_a_typography_text = resolveComponent("a-typography-text");
      const _component_a_divider = resolveComponent("a-divider");
      const _component_a_avatar = resolveComponent("a-avatar");
      const _component_a_affix = resolveComponent("a-affix");
      const _component_a_image = resolveComponent("a-image");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_alert = resolveComponent("a-alert");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_input_group = resolveComponent("a-input-group");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_popover = resolveComponent("a-popover");
      const _component_a_tabs = resolveComponent("a-tabs");
      const _component_a_tab_pane = resolveComponent("a-tab-pane");
      const _component_a_descriptions = resolveComponent("a-descriptions");
      const _component_a_descriptions_item = resolveComponent("a-descriptions-item");
      const _component_a_collapse = resolveComponent("a-collapse");
      const _component_a_collapse_panel = resolveComponent("a-collapse-panel");
      const _component_a_list = resolveComponent("a-list");
      const _component_a_empty = resolveComponent("a-empty");
      const _component_a_float_button_group = resolveComponent("a-float-button-group");
      const _component_a_float_button = resolveComponent("a-float-button");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(`<div class="course-page" data-v-75902442>`);
      _push(ssrRenderComponent(_component_a_card, {
        class: "course-hero",
        bordered: true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_breadcrumb, { style: { "margin-bottom": "16px" } }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_breadcrumb_item, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Home`);
                            } else {
                              return [
                                createTextVNode("Home")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_NuxtLink, { to: "/" }, {
                            default: withCtx(() => [
                              createTextVNode("Home")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_breadcrumb_item, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_NuxtLink, { to: "/categories" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Categories`);
                            } else {
                              return [
                                createTextVNode("Categories")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_NuxtLink, { to: "/categories" }, {
                            default: withCtx(() => [
                              createTextVNode("Categories")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_breadcrumb_item, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(course.value?.title || "Course")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(course.value?.title || "Course"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_breadcrumb_item, null, {
                      default: withCtx(() => [
                        createVNode(_component_NuxtLink, { to: "/" }, {
                          default: withCtx(() => [
                            createTextVNode("Home")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_breadcrumb_item, null, {
                      default: withCtx(() => [
                        createVNode(_component_NuxtLink, { to: "/categories" }, {
                          default: withCtx(() => [
                            createTextVNode("Categories")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_breadcrumb_item, null, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(course.value?.title || "Course"), 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_row, {
              gutter: [24, 24],
              align: "top"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 24,
                    lg: 16
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_space, {
                          direction: "vertical",
                          size: "small",
                          style: { "width": "100%" }
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_typography_title, {
                                level: 1,
                                style: { "margin": "0" }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_skeleton, {
                                      loading: pending.value,
                                      active: "",
                                      title: true,
                                      paragraph: false
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(course.value?.title || "—")}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(course.value?.title || "—"), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_skeleton, {
                                        loading: pending.value,
                                        active: "",
                                        title: true,
                                        paragraph: false
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(course.value?.title || "—"), 1)
                                        ]),
                                        _: 1
                                      }, 8, ["loading"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_skeleton, {
                                loading: pending.value,
                                active: "",
                                paragraph: { rows: 2 }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_typography_paragraph, { class: "subtitle" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(course.value?.description || "—")}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(course.value?.description || "—"), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_typography_paragraph, { class: "subtitle" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(course.value?.description || "—"), 1)
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_space, {
                                align: "center",
                                wrap: "",
                                class: "meta"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_typography_text, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(totalDurationLabel.value)} · ${ssrInterpolate(totalLectures.value)} Lectures · ${ssrInterpolate(course.value?.difficulty || "All levels")}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(totalDurationLabel.value) + " · " + toDisplayString(totalLectures.value) + " Lectures · " + toDisplayString(course.value?.difficulty || "All levels"), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_divider, { type: "vertical" }, null, _parent6, _scopeId5));
                                    if (course.value?.category) {
                                      _push6(ssrRenderComponent(_component_a_typography_text, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(` Category: ${ssrInterpolate(course.value.category)}`);
                                          } else {
                                            return [
                                              createTextVNode(" Category: " + toDisplayString(course.value.category), 1)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                  } else {
                                    return [
                                      createVNode(_component_a_typography_text, null, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(totalDurationLabel.value) + " · " + toDisplayString(totalLectures.value) + " Lectures · " + toDisplayString(course.value?.difficulty || "All levels"), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_divider, { type: "vertical" }),
                                      course.value?.category ? (openBlock(), createBlock(_component_a_typography_text, { key: 0 }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Category: " + toDisplayString(course.value.category), 1)
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_space, { align: "center" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_avatar, {
                                      size: 40,
                                      src: instructor.avatar || "/instructor.png"
                                    }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_typography_text, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(` Created by `);
                                          _push7(ssrRenderComponent(_component_a_typography_text, { strong: "" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`${ssrInterpolate(instructor.name)}`);
                                              } else {
                                                return [
                                                  createTextVNode(toDisplayString(instructor.name), 1)
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createTextVNode(" Created by "),
                                            createVNode(_component_a_typography_text, { strong: "" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(instructor.name), 1)
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
                                      createVNode(_component_a_avatar, {
                                        size: 40,
                                        src: instructor.avatar || "/instructor.png"
                                      }, null, 8, ["src"]),
                                      createVNode(_component_a_typography_text, null, {
                                        default: withCtx(() => [
                                          createTextVNode(" Created by "),
                                          createVNode(_component_a_typography_text, { strong: "" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(instructor.name), 1)
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
                              ssrRenderSlot(_ctx.$slots, "hero-extra", {}, null, _push5, _parent5, _scopeId4);
                            } else {
                              return [
                                createVNode(_component_a_typography_title, {
                                  level: 1,
                                  style: { "margin": "0" }
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_skeleton, {
                                      loading: pending.value,
                                      active: "",
                                      title: true,
                                      paragraph: false
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(course.value?.title || "—"), 1)
                                      ]),
                                      _: 1
                                    }, 8, ["loading"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_skeleton, {
                                  loading: pending.value,
                                  active: "",
                                  paragraph: { rows: 2 }
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_typography_paragraph, { class: "subtitle" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(course.value?.description || "—"), 1)
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["loading"]),
                                createVNode(_component_a_space, {
                                  align: "center",
                                  wrap: "",
                                  class: "meta"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_typography_text, null, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(totalDurationLabel.value) + " · " + toDisplayString(totalLectures.value) + " Lectures · " + toDisplayString(course.value?.difficulty || "All levels"), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_divider, { type: "vertical" }),
                                    course.value?.category ? (openBlock(), createBlock(_component_a_typography_text, { key: 0 }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Category: " + toDisplayString(course.value.category), 1)
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_space, { align: "center" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_avatar, {
                                      size: 40,
                                      src: instructor.avatar || "/instructor.png"
                                    }, null, 8, ["src"]),
                                    createVNode(_component_a_typography_text, null, {
                                      default: withCtx(() => [
                                        createTextVNode(" Created by "),
                                        createVNode(_component_a_typography_text, { strong: "" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(instructor.name), 1)
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                renderSlot(_ctx.$slots, "hero-extra", {}, void 0, true)
                              ];
                            }
                          }),
                          _: 3
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_space, {
                            direction: "vertical",
                            size: "small",
                            style: { "width": "100%" }
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_typography_title, {
                                level: 1,
                                style: { "margin": "0" }
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_skeleton, {
                                    loading: pending.value,
                                    active: "",
                                    title: true,
                                    paragraph: false
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(course.value?.title || "—"), 1)
                                    ]),
                                    _: 1
                                  }, 8, ["loading"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_skeleton, {
                                loading: pending.value,
                                active: "",
                                paragraph: { rows: 2 }
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_typography_paragraph, { class: "subtitle" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(course.value?.description || "—"), 1)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["loading"]),
                              createVNode(_component_a_space, {
                                align: "center",
                                wrap: "",
                                class: "meta"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_typography_text, null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(totalDurationLabel.value) + " · " + toDisplayString(totalLectures.value) + " Lectures · " + toDisplayString(course.value?.difficulty || "All levels"), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_divider, { type: "vertical" }),
                                  course.value?.category ? (openBlock(), createBlock(_component_a_typography_text, { key: 0 }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Category: " + toDisplayString(course.value.category), 1)
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_space, { align: "center" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_avatar, {
                                    size: 40,
                                    src: instructor.avatar || "/instructor.png"
                                  }, null, 8, ["src"]),
                                  createVNode(_component_a_typography_text, null, {
                                    default: withCtx(() => [
                                      createTextVNode(" Created by "),
                                      createVNode(_component_a_typography_text, { strong: "" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(instructor.name), 1)
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              renderSlot(_ctx.$slots, "hero-extra", {}, void 0, true)
                            ]),
                            _: 3
                          })
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 24,
                    lg: 8
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_affix, { "offset-top": 84 }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_card, {
                                hoverable: "",
                                class: "sidebar-card",
                                bodyStyle: { padding: "16px" }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_skeleton, {
                                      loading: pending.value,
                                      active: "",
                                      paragraph: { rows: 6 }
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_image, {
                                            src: course.value?.coverUrl || thumb.value,
                                            alt: "Course thumbnail",
                                            preview: true,
                                            class: "thumb"
                                          }, null, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_divider, { style: { "margin": "12px 0" } }, null, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_space, {
                                            align: "baseline",
                                            wrap: ""
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_a_typography_title, {
                                                  level: 3,
                                                  style: { "margin": "0" }
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(`${ssrInterpolate(money(currentPrice.value))}`);
                                                    } else {
                                                      return [
                                                        createTextVNode(toDisplayString(money(currentPrice.value)), 1)
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                if (showOldPrice.value) {
                                                  _push8(ssrRenderComponent(_component_a_typography_text, {
                                                    type: "secondary",
                                                    delete: ""
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`${ssrInterpolate(money(oldPrice.value))}`);
                                                      } else {
                                                        return [
                                                          createTextVNode(toDisplayString(money(oldPrice.value)), 1)
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  _push8(`<!---->`);
                                                }
                                                if (discountPct.value > 0) {
                                                  _push8(ssrRenderComponent(_component_a_tag, { color: "green" }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`${ssrInterpolate(discountLabel.value)}`);
                                                      } else {
                                                        return [
                                                          createTextVNode(toDisplayString(discountLabel.value), 1)
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  _push8(`<!---->`);
                                                }
                                              } else {
                                                return [
                                                  createVNode(_component_a_typography_title, {
                                                    level: 3,
                                                    style: { "margin": "0" }
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(money(currentPrice.value)), 1)
                                                    ]),
                                                    _: 1
                                                  }),
                                                  showOldPrice.value ? (openBlock(), createBlock(_component_a_typography_text, {
                                                    key: 0,
                                                    type: "secondary",
                                                    delete: ""
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(money(oldPrice.value)), 1)
                                                    ]),
                                                    _: 1
                                                  })) : createCommentVNode("", true),
                                                  discountPct.value > 0 ? (openBlock(), createBlock(_component_a_tag, {
                                                    key: 1,
                                                    color: "green"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(discountLabel.value), 1)
                                                    ]),
                                                    _: 1
                                                  })) : createCommentVNode("", true)
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_alert, {
                                            type: "success",
                                            "show-icon": "",
                                            message: "30-day money-back guarantee",
                                            style: { "margin": "12px 0" }
                                          }, null, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_space, {
                                            direction: "vertical",
                                            style: { "width": "100%" }
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_a_button, {
                                                  type: "primary",
                                                  block: "",
                                                  icon: h(unref(ShoppingCartOutlined)),
                                                  onClick: unref(addToCartFn),
                                                  loading: adding.value || unref(cartLoading),
                                                  disabled: isInCartCourse.value
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(`${ssrInterpolate(isInCartCourse.value ? "In Cart" : "Add To Cart")}`);
                                                    } else {
                                                      return [
                                                        createTextVNode(toDisplayString(isInCartCourse.value ? "In Cart" : "Add To Cart"), 1)
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(_component_a_button, {
                                                  block: "",
                                                  icon: h(unref(ThunderboltOutlined)),
                                                  onClick: buyNow,
                                                  loading: checkingOut.value
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(` Buy Now `);
                                                    } else {
                                                      return [
                                                        createTextVNode(" Buy Now ")
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(_component_a_button, {
                                                  block: "",
                                                  icon: h(unref(HeartOutlined)),
                                                  type: inWishlist.value ? "primary" : "default",
                                                  ghost: !inWishlist.value,
                                                  onClick: toggleWishlist
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(`${ssrInterpolate(inWishlist.value ? "Wishlisted" : "Add to Wishlist")}`);
                                                    } else {
                                                      return [
                                                        createTextVNode(toDisplayString(inWishlist.value ? "Wishlisted" : "Add to Wishlist"), 1)
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(_component_a_button, {
                                                    type: "primary",
                                                    block: "",
                                                    icon: h(unref(ShoppingCartOutlined)),
                                                    onClick: unref(addToCartFn),
                                                    loading: adding.value || unref(cartLoading),
                                                    disabled: isInCartCourse.value
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(isInCartCourse.value ? "In Cart" : "Add To Cart"), 1)
                                                    ]),
                                                    _: 1
                                                  }, 8, ["icon", "onClick", "loading", "disabled"]),
                                                  createVNode(_component_a_button, {
                                                    block: "",
                                                    icon: h(unref(ThunderboltOutlined)),
                                                    onClick: buyNow,
                                                    loading: checkingOut.value
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(" Buy Now ")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["icon", "loading"]),
                                                  createVNode(_component_a_button, {
                                                    block: "",
                                                    icon: h(unref(HeartOutlined)),
                                                    type: inWishlist.value ? "primary" : "default",
                                                    ghost: !inWishlist.value,
                                                    onClick: toggleWishlist
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(inWishlist.value ? "Wishlisted" : "Add to Wishlist"), 1)
                                                    ]),
                                                    _: 1
                                                  }, 8, ["icon", "type", "ghost"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_divider, { style: { "margin": "12px 0" } }, null, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_input_group, {
                                            compact: "",
                                            style: { "margin-bottom": "8px" }
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_a_input, {
                                                  value: coupon.value,
                                                  "onUpdate:value": ($event) => coupon.value = $event,
                                                  style: { "width": "65%" },
                                                  placeholder: "Coupon code"
                                                }, null, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(_component_a_button, {
                                                  style: { "width": "35%" },
                                                  onClick: applyCoupon,
                                                  loading: validatingCoupon.value
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(` Apply `);
                                                    } else {
                                                      return [
                                                        createTextVNode(" Apply ")
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(_component_a_input, {
                                                    value: coupon.value,
                                                    "onUpdate:value": ($event) => coupon.value = $event,
                                                    style: { "width": "65%" },
                                                    placeholder: "Coupon code"
                                                  }, null, 8, ["value", "onUpdate:value"]),
                                                  createVNode(_component_a_button, {
                                                    style: { "width": "35%" },
                                                    onClick: applyCoupon,
                                                    loading: validatingCoupon.value
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(" Apply ")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["loading"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          if (couponApplied.value) {
                                            _push7(ssrRenderComponent(_component_a_typography_text, { type: "success" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(` Coupon applied! `);
                                                } else {
                                                  return [
                                                    createTextVNode(" Coupon applied! ")
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            _push7(`<!---->`);
                                          }
                                          _push7(ssrRenderComponent(_component_a_space, { style: { "margin-top": "10px" } }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_a_popover, { trigger: "click" }, {
                                                  content: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(_component_a_space, null, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(_component_a_button, {
                                                              type: "text",
                                                              onClick: ($event) => share("link")
                                                            }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(`Copy link`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode("Copy link")
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                            _push10(ssrRenderComponent(_component_a_button, {
                                                              type: "text",
                                                              onClick: ($event) => share("x")
                                                            }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(`Share on X`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode("Share on X")
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                            _push10(ssrRenderComponent(_component_a_button, {
                                                              type: "text",
                                                              onClick: ($event) => share("linkedin")
                                                            }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(`LinkedIn`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode("LinkedIn")
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(_component_a_button, {
                                                                type: "text",
                                                                onClick: ($event) => share("link")
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("Copy link")
                                                                ]),
                                                                _: 1
                                                              }, 8, ["onClick"]),
                                                              createVNode(_component_a_button, {
                                                                type: "text",
                                                                onClick: ($event) => share("x")
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("Share on X")
                                                                ]),
                                                                _: 1
                                                              }, 8, ["onClick"]),
                                                              createVNode(_component_a_button, {
                                                                type: "text",
                                                                onClick: ($event) => share("linkedin")
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("LinkedIn")
                                                                ]),
                                                                _: 1
                                                              }, 8, ["onClick"])
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(_component_a_space, null, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_button, {
                                                              type: "text",
                                                              onClick: ($event) => share("link")
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("Copy link")
                                                              ]),
                                                              _: 1
                                                            }, 8, ["onClick"]),
                                                            createVNode(_component_a_button, {
                                                              type: "text",
                                                              onClick: ($event) => share("x")
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("Share on X")
                                                              ]),
                                                              _: 1
                                                            }, 8, ["onClick"]),
                                                            createVNode(_component_a_button, {
                                                              type: "text",
                                                              onClick: ($event) => share("linkedin")
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("LinkedIn")
                                                              ]),
                                                              _: 1
                                                            }, 8, ["onClick"])
                                                          ]),
                                                          _: 1
                                                        })
                                                      ];
                                                    }
                                                  }),
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(_component_a_button, {
                                                        type: "link",
                                                        icon: h(unref(ShareAltOutlined))
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`Share`);
                                                          } else {
                                                            return [
                                                              createTextVNode("Share")
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(_component_a_button, {
                                                          type: "link",
                                                          icon: h(unref(ShareAltOutlined))
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Share")
                                                          ]),
                                                          _: 1
                                                        }, 8, ["icon"])
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                ssrRenderSlot(_ctx.$slots, "cta-extra", {}, null, _push8, _parent8, _scopeId7);
                                              } else {
                                                return [
                                                  createVNode(_component_a_popover, { trigger: "click" }, {
                                                    content: withCtx(() => [
                                                      createVNode(_component_a_space, null, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_button, {
                                                            type: "text",
                                                            onClick: ($event) => share("link")
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Copy link")
                                                            ]),
                                                            _: 1
                                                          }, 8, ["onClick"]),
                                                          createVNode(_component_a_button, {
                                                            type: "text",
                                                            onClick: ($event) => share("x")
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Share on X")
                                                            ]),
                                                            _: 1
                                                          }, 8, ["onClick"]),
                                                          createVNode(_component_a_button, {
                                                            type: "text",
                                                            onClick: ($event) => share("linkedin")
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("LinkedIn")
                                                            ]),
                                                            _: 1
                                                          }, 8, ["onClick"])
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_button, {
                                                        type: "link",
                                                        icon: h(unref(ShareAltOutlined))
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Share")
                                                        ]),
                                                        _: 1
                                                      }, 8, ["icon"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  renderSlot(_ctx.$slots, "cta-extra", {}, void 0, true)
                                                ];
                                              }
                                            }),
                                            _: 3
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_image, {
                                              src: course.value?.coverUrl || thumb.value,
                                              alt: "Course thumbnail",
                                              preview: true,
                                              class: "thumb"
                                            }, null, 8, ["src"]),
                                            createVNode(_component_a_divider, { style: { "margin": "12px 0" } }),
                                            createVNode(_component_a_space, {
                                              align: "baseline",
                                              wrap: ""
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_typography_title, {
                                                  level: 3,
                                                  style: { "margin": "0" }
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(money(currentPrice.value)), 1)
                                                  ]),
                                                  _: 1
                                                }),
                                                showOldPrice.value ? (openBlock(), createBlock(_component_a_typography_text, {
                                                  key: 0,
                                                  type: "secondary",
                                                  delete: ""
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(money(oldPrice.value)), 1)
                                                  ]),
                                                  _: 1
                                                })) : createCommentVNode("", true),
                                                discountPct.value > 0 ? (openBlock(), createBlock(_component_a_tag, {
                                                  key: 1,
                                                  color: "green"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(discountLabel.value), 1)
                                                  ]),
                                                  _: 1
                                                })) : createCommentVNode("", true)
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_alert, {
                                              type: "success",
                                              "show-icon": "",
                                              message: "30-day money-back guarantee",
                                              style: { "margin": "12px 0" }
                                            }),
                                            createVNode(_component_a_space, {
                                              direction: "vertical",
                                              style: { "width": "100%" }
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_button, {
                                                  type: "primary",
                                                  block: "",
                                                  icon: h(unref(ShoppingCartOutlined)),
                                                  onClick: unref(addToCartFn),
                                                  loading: adding.value || unref(cartLoading),
                                                  disabled: isInCartCourse.value
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(isInCartCourse.value ? "In Cart" : "Add To Cart"), 1)
                                                  ]),
                                                  _: 1
                                                }, 8, ["icon", "onClick", "loading", "disabled"]),
                                                createVNode(_component_a_button, {
                                                  block: "",
                                                  icon: h(unref(ThunderboltOutlined)),
                                                  onClick: buyNow,
                                                  loading: checkingOut.value
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" Buy Now ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["icon", "loading"]),
                                                createVNode(_component_a_button, {
                                                  block: "",
                                                  icon: h(unref(HeartOutlined)),
                                                  type: inWishlist.value ? "primary" : "default",
                                                  ghost: !inWishlist.value,
                                                  onClick: toggleWishlist
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(inWishlist.value ? "Wishlisted" : "Add to Wishlist"), 1)
                                                  ]),
                                                  _: 1
                                                }, 8, ["icon", "type", "ghost"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_divider, { style: { "margin": "12px 0" } }),
                                            createVNode(_component_a_input_group, {
                                              compact: "",
                                              style: { "margin-bottom": "8px" }
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_input, {
                                                  value: coupon.value,
                                                  "onUpdate:value": ($event) => coupon.value = $event,
                                                  style: { "width": "65%" },
                                                  placeholder: "Coupon code"
                                                }, null, 8, ["value", "onUpdate:value"]),
                                                createVNode(_component_a_button, {
                                                  style: { "width": "35%" },
                                                  onClick: applyCoupon,
                                                  loading: validatingCoupon.value
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" Apply ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["loading"])
                                              ]),
                                              _: 1
                                            }),
                                            couponApplied.value ? (openBlock(), createBlock(_component_a_typography_text, {
                                              key: 0,
                                              type: "success"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Coupon applied! ")
                                              ]),
                                              _: 1
                                            })) : createCommentVNode("", true),
                                            createVNode(_component_a_space, { style: { "margin-top": "10px" } }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_popover, { trigger: "click" }, {
                                                  content: withCtx(() => [
                                                    createVNode(_component_a_space, null, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_button, {
                                                          type: "text",
                                                          onClick: ($event) => share("link")
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Copy link")
                                                          ]),
                                                          _: 1
                                                        }, 8, ["onClick"]),
                                                        createVNode(_component_a_button, {
                                                          type: "text",
                                                          onClick: ($event) => share("x")
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Share on X")
                                                          ]),
                                                          _: 1
                                                        }, 8, ["onClick"]),
                                                        createVNode(_component_a_button, {
                                                          type: "text",
                                                          onClick: ($event) => share("linkedin")
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("LinkedIn")
                                                          ]),
                                                          _: 1
                                                        }, 8, ["onClick"])
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_button, {
                                                      type: "link",
                                                      icon: h(unref(ShareAltOutlined))
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Share")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["icon"])
                                                  ]),
                                                  _: 1
                                                }),
                                                renderSlot(_ctx.$slots, "cta-extra", {}, void 0, true)
                                              ]),
                                              _: 3
                                            })
                                          ];
                                        }
                                      }),
                                      _: 3
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_skeleton, {
                                        loading: pending.value,
                                        active: "",
                                        paragraph: { rows: 6 }
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_image, {
                                            src: course.value?.coverUrl || thumb.value,
                                            alt: "Course thumbnail",
                                            preview: true,
                                            class: "thumb"
                                          }, null, 8, ["src"]),
                                          createVNode(_component_a_divider, { style: { "margin": "12px 0" } }),
                                          createVNode(_component_a_space, {
                                            align: "baseline",
                                            wrap: ""
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_typography_title, {
                                                level: 3,
                                                style: { "margin": "0" }
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(money(currentPrice.value)), 1)
                                                ]),
                                                _: 1
                                              }),
                                              showOldPrice.value ? (openBlock(), createBlock(_component_a_typography_text, {
                                                key: 0,
                                                type: "secondary",
                                                delete: ""
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(money(oldPrice.value)), 1)
                                                ]),
                                                _: 1
                                              })) : createCommentVNode("", true),
                                              discountPct.value > 0 ? (openBlock(), createBlock(_component_a_tag, {
                                                key: 1,
                                                color: "green"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(discountLabel.value), 1)
                                                ]),
                                                _: 1
                                              })) : createCommentVNode("", true)
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_alert, {
                                            type: "success",
                                            "show-icon": "",
                                            message: "30-day money-back guarantee",
                                            style: { "margin": "12px 0" }
                                          }),
                                          createVNode(_component_a_space, {
                                            direction: "vertical",
                                            style: { "width": "100%" }
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_button, {
                                                type: "primary",
                                                block: "",
                                                icon: h(unref(ShoppingCartOutlined)),
                                                onClick: unref(addToCartFn),
                                                loading: adding.value || unref(cartLoading),
                                                disabled: isInCartCourse.value
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(isInCartCourse.value ? "In Cart" : "Add To Cart"), 1)
                                                ]),
                                                _: 1
                                              }, 8, ["icon", "onClick", "loading", "disabled"]),
                                              createVNode(_component_a_button, {
                                                block: "",
                                                icon: h(unref(ThunderboltOutlined)),
                                                onClick: buyNow,
                                                loading: checkingOut.value
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Buy Now ")
                                                ]),
                                                _: 1
                                              }, 8, ["icon", "loading"]),
                                              createVNode(_component_a_button, {
                                                block: "",
                                                icon: h(unref(HeartOutlined)),
                                                type: inWishlist.value ? "primary" : "default",
                                                ghost: !inWishlist.value,
                                                onClick: toggleWishlist
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(inWishlist.value ? "Wishlisted" : "Add to Wishlist"), 1)
                                                ]),
                                                _: 1
                                              }, 8, ["icon", "type", "ghost"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_divider, { style: { "margin": "12px 0" } }),
                                          createVNode(_component_a_input_group, {
                                            compact: "",
                                            style: { "margin-bottom": "8px" }
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_input, {
                                                value: coupon.value,
                                                "onUpdate:value": ($event) => coupon.value = $event,
                                                style: { "width": "65%" },
                                                placeholder: "Coupon code"
                                              }, null, 8, ["value", "onUpdate:value"]),
                                              createVNode(_component_a_button, {
                                                style: { "width": "35%" },
                                                onClick: applyCoupon,
                                                loading: validatingCoupon.value
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Apply ")
                                                ]),
                                                _: 1
                                              }, 8, ["loading"])
                                            ]),
                                            _: 1
                                          }),
                                          couponApplied.value ? (openBlock(), createBlock(_component_a_typography_text, {
                                            key: 0,
                                            type: "success"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Coupon applied! ")
                                            ]),
                                            _: 1
                                          })) : createCommentVNode("", true),
                                          createVNode(_component_a_space, { style: { "margin-top": "10px" } }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_popover, { trigger: "click" }, {
                                                content: withCtx(() => [
                                                  createVNode(_component_a_space, null, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_button, {
                                                        type: "text",
                                                        onClick: ($event) => share("link")
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Copy link")
                                                        ]),
                                                        _: 1
                                                      }, 8, ["onClick"]),
                                                      createVNode(_component_a_button, {
                                                        type: "text",
                                                        onClick: ($event) => share("x")
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Share on X")
                                                        ]),
                                                        _: 1
                                                      }, 8, ["onClick"]),
                                                      createVNode(_component_a_button, {
                                                        type: "text",
                                                        onClick: ($event) => share("linkedin")
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("LinkedIn")
                                                        ]),
                                                        _: 1
                                                      }, 8, ["onClick"])
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                default: withCtx(() => [
                                                  createVNode(_component_a_button, {
                                                    type: "link",
                                                    icon: h(unref(ShareAltOutlined))
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Share")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["icon"])
                                                ]),
                                                _: 1
                                              }),
                                              renderSlot(_ctx.$slots, "cta-extra", {}, void 0, true)
                                            ]),
                                            _: 3
                                          })
                                        ]),
                                        _: 3
                                      }, 8, ["loading"])
                                    ];
                                  }
                                }),
                                _: 3
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_card, {
                                  hoverable: "",
                                  class: "sidebar-card",
                                  bodyStyle: { padding: "16px" }
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_skeleton, {
                                      loading: pending.value,
                                      active: "",
                                      paragraph: { rows: 6 }
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_image, {
                                          src: course.value?.coverUrl || thumb.value,
                                          alt: "Course thumbnail",
                                          preview: true,
                                          class: "thumb"
                                        }, null, 8, ["src"]),
                                        createVNode(_component_a_divider, { style: { "margin": "12px 0" } }),
                                        createVNode(_component_a_space, {
                                          align: "baseline",
                                          wrap: ""
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_typography_title, {
                                              level: 3,
                                              style: { "margin": "0" }
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(money(currentPrice.value)), 1)
                                              ]),
                                              _: 1
                                            }),
                                            showOldPrice.value ? (openBlock(), createBlock(_component_a_typography_text, {
                                              key: 0,
                                              type: "secondary",
                                              delete: ""
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(money(oldPrice.value)), 1)
                                              ]),
                                              _: 1
                                            })) : createCommentVNode("", true),
                                            discountPct.value > 0 ? (openBlock(), createBlock(_component_a_tag, {
                                              key: 1,
                                              color: "green"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(discountLabel.value), 1)
                                              ]),
                                              _: 1
                                            })) : createCommentVNode("", true)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_alert, {
                                          type: "success",
                                          "show-icon": "",
                                          message: "30-day money-back guarantee",
                                          style: { "margin": "12px 0" }
                                        }),
                                        createVNode(_component_a_space, {
                                          direction: "vertical",
                                          style: { "width": "100%" }
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_button, {
                                              type: "primary",
                                              block: "",
                                              icon: h(unref(ShoppingCartOutlined)),
                                              onClick: unref(addToCartFn),
                                              loading: adding.value || unref(cartLoading),
                                              disabled: isInCartCourse.value
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(isInCartCourse.value ? "In Cart" : "Add To Cart"), 1)
                                              ]),
                                              _: 1
                                            }, 8, ["icon", "onClick", "loading", "disabled"]),
                                            createVNode(_component_a_button, {
                                              block: "",
                                              icon: h(unref(ThunderboltOutlined)),
                                              onClick: buyNow,
                                              loading: checkingOut.value
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Buy Now ")
                                              ]),
                                              _: 1
                                            }, 8, ["icon", "loading"]),
                                            createVNode(_component_a_button, {
                                              block: "",
                                              icon: h(unref(HeartOutlined)),
                                              type: inWishlist.value ? "primary" : "default",
                                              ghost: !inWishlist.value,
                                              onClick: toggleWishlist
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(inWishlist.value ? "Wishlisted" : "Add to Wishlist"), 1)
                                              ]),
                                              _: 1
                                            }, 8, ["icon", "type", "ghost"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_divider, { style: { "margin": "12px 0" } }),
                                        createVNode(_component_a_input_group, {
                                          compact: "",
                                          style: { "margin-bottom": "8px" }
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_input, {
                                              value: coupon.value,
                                              "onUpdate:value": ($event) => coupon.value = $event,
                                              style: { "width": "65%" },
                                              placeholder: "Coupon code"
                                            }, null, 8, ["value", "onUpdate:value"]),
                                            createVNode(_component_a_button, {
                                              style: { "width": "35%" },
                                              onClick: applyCoupon,
                                              loading: validatingCoupon.value
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Apply ")
                                              ]),
                                              _: 1
                                            }, 8, ["loading"])
                                          ]),
                                          _: 1
                                        }),
                                        couponApplied.value ? (openBlock(), createBlock(_component_a_typography_text, {
                                          key: 0,
                                          type: "success"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Coupon applied! ")
                                          ]),
                                          _: 1
                                        })) : createCommentVNode("", true),
                                        createVNode(_component_a_space, { style: { "margin-top": "10px" } }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_popover, { trigger: "click" }, {
                                              content: withCtx(() => [
                                                createVNode(_component_a_space, null, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_button, {
                                                      type: "text",
                                                      onClick: ($event) => share("link")
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Copy link")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onClick"]),
                                                    createVNode(_component_a_button, {
                                                      type: "text",
                                                      onClick: ($event) => share("x")
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Share on X")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onClick"]),
                                                    createVNode(_component_a_button, {
                                                      type: "text",
                                                      onClick: ($event) => share("linkedin")
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("LinkedIn")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onClick"])
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              default: withCtx(() => [
                                                createVNode(_component_a_button, {
                                                  type: "link",
                                                  icon: h(unref(ShareAltOutlined))
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Share")
                                                  ]),
                                                  _: 1
                                                }, 8, ["icon"])
                                              ]),
                                              _: 1
                                            }),
                                            renderSlot(_ctx.$slots, "cta-extra", {}, void 0, true)
                                          ]),
                                          _: 3
                                        })
                                      ]),
                                      _: 3
                                    }, 8, ["loading"])
                                  ]),
                                  _: 3
                                })
                              ];
                            }
                          }),
                          _: 3
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_affix, { "offset-top": 84 }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                hoverable: "",
                                class: "sidebar-card",
                                bodyStyle: { padding: "16px" }
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_skeleton, {
                                    loading: pending.value,
                                    active: "",
                                    paragraph: { rows: 6 }
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_image, {
                                        src: course.value?.coverUrl || thumb.value,
                                        alt: "Course thumbnail",
                                        preview: true,
                                        class: "thumb"
                                      }, null, 8, ["src"]),
                                      createVNode(_component_a_divider, { style: { "margin": "12px 0" } }),
                                      createVNode(_component_a_space, {
                                        align: "baseline",
                                        wrap: ""
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_typography_title, {
                                            level: 3,
                                            style: { "margin": "0" }
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(money(currentPrice.value)), 1)
                                            ]),
                                            _: 1
                                          }),
                                          showOldPrice.value ? (openBlock(), createBlock(_component_a_typography_text, {
                                            key: 0,
                                            type: "secondary",
                                            delete: ""
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(money(oldPrice.value)), 1)
                                            ]),
                                            _: 1
                                          })) : createCommentVNode("", true),
                                          discountPct.value > 0 ? (openBlock(), createBlock(_component_a_tag, {
                                            key: 1,
                                            color: "green"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(discountLabel.value), 1)
                                            ]),
                                            _: 1
                                          })) : createCommentVNode("", true)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_alert, {
                                        type: "success",
                                        "show-icon": "",
                                        message: "30-day money-back guarantee",
                                        style: { "margin": "12px 0" }
                                      }),
                                      createVNode(_component_a_space, {
                                        direction: "vertical",
                                        style: { "width": "100%" }
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_button, {
                                            type: "primary",
                                            block: "",
                                            icon: h(unref(ShoppingCartOutlined)),
                                            onClick: unref(addToCartFn),
                                            loading: adding.value || unref(cartLoading),
                                            disabled: isInCartCourse.value
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(isInCartCourse.value ? "In Cart" : "Add To Cart"), 1)
                                            ]),
                                            _: 1
                                          }, 8, ["icon", "onClick", "loading", "disabled"]),
                                          createVNode(_component_a_button, {
                                            block: "",
                                            icon: h(unref(ThunderboltOutlined)),
                                            onClick: buyNow,
                                            loading: checkingOut.value
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Buy Now ")
                                            ]),
                                            _: 1
                                          }, 8, ["icon", "loading"]),
                                          createVNode(_component_a_button, {
                                            block: "",
                                            icon: h(unref(HeartOutlined)),
                                            type: inWishlist.value ? "primary" : "default",
                                            ghost: !inWishlist.value,
                                            onClick: toggleWishlist
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(inWishlist.value ? "Wishlisted" : "Add to Wishlist"), 1)
                                            ]),
                                            _: 1
                                          }, 8, ["icon", "type", "ghost"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_divider, { style: { "margin": "12px 0" } }),
                                      createVNode(_component_a_input_group, {
                                        compact: "",
                                        style: { "margin-bottom": "8px" }
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_input, {
                                            value: coupon.value,
                                            "onUpdate:value": ($event) => coupon.value = $event,
                                            style: { "width": "65%" },
                                            placeholder: "Coupon code"
                                          }, null, 8, ["value", "onUpdate:value"]),
                                          createVNode(_component_a_button, {
                                            style: { "width": "35%" },
                                            onClick: applyCoupon,
                                            loading: validatingCoupon.value
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Apply ")
                                            ]),
                                            _: 1
                                          }, 8, ["loading"])
                                        ]),
                                        _: 1
                                      }),
                                      couponApplied.value ? (openBlock(), createBlock(_component_a_typography_text, {
                                        key: 0,
                                        type: "success"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Coupon applied! ")
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true),
                                      createVNode(_component_a_space, { style: { "margin-top": "10px" } }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_popover, { trigger: "click" }, {
                                            content: withCtx(() => [
                                              createVNode(_component_a_space, null, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_button, {
                                                    type: "text",
                                                    onClick: ($event) => share("link")
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Copy link")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"]),
                                                  createVNode(_component_a_button, {
                                                    type: "text",
                                                    onClick: ($event) => share("x")
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Share on X")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"]),
                                                  createVNode(_component_a_button, {
                                                    type: "text",
                                                    onClick: ($event) => share("linkedin")
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("LinkedIn")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"])
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            default: withCtx(() => [
                                              createVNode(_component_a_button, {
                                                type: "link",
                                                icon: h(unref(ShareAltOutlined))
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Share")
                                                ]),
                                                _: 1
                                              }, 8, ["icon"])
                                            ]),
                                            _: 1
                                          }),
                                          renderSlot(_ctx.$slots, "cta-extra", {}, void 0, true)
                                        ]),
                                        _: 3
                                      })
                                    ]),
                                    _: 3
                                  }, 8, ["loading"])
                                ]),
                                _: 3
                              })
                            ]),
                            _: 3
                          })
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_col, {
                      xs: 24,
                      lg: 16
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_space, {
                          direction: "vertical",
                          size: "small",
                          style: { "width": "100%" }
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_typography_title, {
                              level: 1,
                              style: { "margin": "0" }
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_skeleton, {
                                  loading: pending.value,
                                  active: "",
                                  title: true,
                                  paragraph: false
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(course.value?.title || "—"), 1)
                                  ]),
                                  _: 1
                                }, 8, ["loading"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_skeleton, {
                              loading: pending.value,
                              active: "",
                              paragraph: { rows: 2 }
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_typography_paragraph, { class: "subtitle" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(course.value?.description || "—"), 1)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["loading"]),
                            createVNode(_component_a_space, {
                              align: "center",
                              wrap: "",
                              class: "meta"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_typography_text, null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(totalDurationLabel.value) + " · " + toDisplayString(totalLectures.value) + " Lectures · " + toDisplayString(course.value?.difficulty || "All levels"), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_divider, { type: "vertical" }),
                                course.value?.category ? (openBlock(), createBlock(_component_a_typography_text, { key: 0 }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Category: " + toDisplayString(course.value.category), 1)
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_space, { align: "center" }, {
                              default: withCtx(() => [
                                createVNode(_component_a_avatar, {
                                  size: 40,
                                  src: instructor.avatar || "/instructor.png"
                                }, null, 8, ["src"]),
                                createVNode(_component_a_typography_text, null, {
                                  default: withCtx(() => [
                                    createTextVNode(" Created by "),
                                    createVNode(_component_a_typography_text, { strong: "" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(instructor.name), 1)
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            renderSlot(_ctx.$slots, "hero-extra", {}, void 0, true)
                          ]),
                          _: 3
                        })
                      ]),
                      _: 3
                    }),
                    createVNode(_component_a_col, {
                      xs: 24,
                      lg: 8
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_affix, { "offset-top": 84 }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              hoverable: "",
                              class: "sidebar-card",
                              bodyStyle: { padding: "16px" }
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_skeleton, {
                                  loading: pending.value,
                                  active: "",
                                  paragraph: { rows: 6 }
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_image, {
                                      src: course.value?.coverUrl || thumb.value,
                                      alt: "Course thumbnail",
                                      preview: true,
                                      class: "thumb"
                                    }, null, 8, ["src"]),
                                    createVNode(_component_a_divider, { style: { "margin": "12px 0" } }),
                                    createVNode(_component_a_space, {
                                      align: "baseline",
                                      wrap: ""
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_typography_title, {
                                          level: 3,
                                          style: { "margin": "0" }
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(money(currentPrice.value)), 1)
                                          ]),
                                          _: 1
                                        }),
                                        showOldPrice.value ? (openBlock(), createBlock(_component_a_typography_text, {
                                          key: 0,
                                          type: "secondary",
                                          delete: ""
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(money(oldPrice.value)), 1)
                                          ]),
                                          _: 1
                                        })) : createCommentVNode("", true),
                                        discountPct.value > 0 ? (openBlock(), createBlock(_component_a_tag, {
                                          key: 1,
                                          color: "green"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(discountLabel.value), 1)
                                          ]),
                                          _: 1
                                        })) : createCommentVNode("", true)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_alert, {
                                      type: "success",
                                      "show-icon": "",
                                      message: "30-day money-back guarantee",
                                      style: { "margin": "12px 0" }
                                    }),
                                    createVNode(_component_a_space, {
                                      direction: "vertical",
                                      style: { "width": "100%" }
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_button, {
                                          type: "primary",
                                          block: "",
                                          icon: h(unref(ShoppingCartOutlined)),
                                          onClick: unref(addToCartFn),
                                          loading: adding.value || unref(cartLoading),
                                          disabled: isInCartCourse.value
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(isInCartCourse.value ? "In Cart" : "Add To Cart"), 1)
                                          ]),
                                          _: 1
                                        }, 8, ["icon", "onClick", "loading", "disabled"]),
                                        createVNode(_component_a_button, {
                                          block: "",
                                          icon: h(unref(ThunderboltOutlined)),
                                          onClick: buyNow,
                                          loading: checkingOut.value
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Buy Now ")
                                          ]),
                                          _: 1
                                        }, 8, ["icon", "loading"]),
                                        createVNode(_component_a_button, {
                                          block: "",
                                          icon: h(unref(HeartOutlined)),
                                          type: inWishlist.value ? "primary" : "default",
                                          ghost: !inWishlist.value,
                                          onClick: toggleWishlist
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(inWishlist.value ? "Wishlisted" : "Add to Wishlist"), 1)
                                          ]),
                                          _: 1
                                        }, 8, ["icon", "type", "ghost"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_divider, { style: { "margin": "12px 0" } }),
                                    createVNode(_component_a_input_group, {
                                      compact: "",
                                      style: { "margin-bottom": "8px" }
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_input, {
                                          value: coupon.value,
                                          "onUpdate:value": ($event) => coupon.value = $event,
                                          style: { "width": "65%" },
                                          placeholder: "Coupon code"
                                        }, null, 8, ["value", "onUpdate:value"]),
                                        createVNode(_component_a_button, {
                                          style: { "width": "35%" },
                                          onClick: applyCoupon,
                                          loading: validatingCoupon.value
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Apply ")
                                          ]),
                                          _: 1
                                        }, 8, ["loading"])
                                      ]),
                                      _: 1
                                    }),
                                    couponApplied.value ? (openBlock(), createBlock(_component_a_typography_text, {
                                      key: 0,
                                      type: "success"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Coupon applied! ")
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true),
                                    createVNode(_component_a_space, { style: { "margin-top": "10px" } }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_popover, { trigger: "click" }, {
                                          content: withCtx(() => [
                                            createVNode(_component_a_space, null, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_button, {
                                                  type: "text",
                                                  onClick: ($event) => share("link")
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Copy link")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"]),
                                                createVNode(_component_a_button, {
                                                  type: "text",
                                                  onClick: ($event) => share("x")
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Share on X")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"]),
                                                createVNode(_component_a_button, {
                                                  type: "text",
                                                  onClick: ($event) => share("linkedin")
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("LinkedIn")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"])
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          default: withCtx(() => [
                                            createVNode(_component_a_button, {
                                              type: "link",
                                              icon: h(unref(ShareAltOutlined))
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Share")
                                              ]),
                                              _: 1
                                            }, 8, ["icon"])
                                          ]),
                                          _: 1
                                        }),
                                        renderSlot(_ctx.$slots, "cta-extra", {}, void 0, true)
                                      ]),
                                      _: 3
                                    })
                                  ]),
                                  _: 3
                                }, 8, ["loading"])
                              ]),
                              _: 3
                            })
                          ]),
                          _: 3
                        })
                      ]),
                      _: 3
                    })
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_breadcrumb, { style: { "margin-bottom": "16px" } }, {
                default: withCtx(() => [
                  createVNode(_component_a_breadcrumb_item, null, {
                    default: withCtx(() => [
                      createVNode(_component_NuxtLink, { to: "/" }, {
                        default: withCtx(() => [
                          createTextVNode("Home")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_breadcrumb_item, null, {
                    default: withCtx(() => [
                      createVNode(_component_NuxtLink, { to: "/categories" }, {
                        default: withCtx(() => [
                          createTextVNode("Categories")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_breadcrumb_item, null, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(course.value?.title || "Course"), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_a_row, {
                gutter: [24, 24],
                align: "top"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_col, {
                    xs: 24,
                    lg: 16
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_space, {
                        direction: "vertical",
                        size: "small",
                        style: { "width": "100%" }
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_typography_title, {
                            level: 1,
                            style: { "margin": "0" }
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_skeleton, {
                                loading: pending.value,
                                active: "",
                                title: true,
                                paragraph: false
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(course.value?.title || "—"), 1)
                                ]),
                                _: 1
                              }, 8, ["loading"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_skeleton, {
                            loading: pending.value,
                            active: "",
                            paragraph: { rows: 2 }
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_typography_paragraph, { class: "subtitle" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(course.value?.description || "—"), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["loading"]),
                          createVNode(_component_a_space, {
                            align: "center",
                            wrap: "",
                            class: "meta"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_typography_text, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(totalDurationLabel.value) + " · " + toDisplayString(totalLectures.value) + " Lectures · " + toDisplayString(course.value?.difficulty || "All levels"), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_divider, { type: "vertical" }),
                              course.value?.category ? (openBlock(), createBlock(_component_a_typography_text, { key: 0 }, {
                                default: withCtx(() => [
                                  createTextVNode(" Category: " + toDisplayString(course.value.category), 1)
                                ]),
                                _: 1
                              })) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_space, { align: "center" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_avatar, {
                                size: 40,
                                src: instructor.avatar || "/instructor.png"
                              }, null, 8, ["src"]),
                              createVNode(_component_a_typography_text, null, {
                                default: withCtx(() => [
                                  createTextVNode(" Created by "),
                                  createVNode(_component_a_typography_text, { strong: "" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(instructor.name), 1)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          renderSlot(_ctx.$slots, "hero-extra", {}, void 0, true)
                        ]),
                        _: 3
                      })
                    ]),
                    _: 3
                  }),
                  createVNode(_component_a_col, {
                    xs: 24,
                    lg: 8
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_affix, { "offset-top": 84 }, {
                        default: withCtx(() => [
                          createVNode(_component_a_card, {
                            hoverable: "",
                            class: "sidebar-card",
                            bodyStyle: { padding: "16px" }
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_skeleton, {
                                loading: pending.value,
                                active: "",
                                paragraph: { rows: 6 }
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_image, {
                                    src: course.value?.coverUrl || thumb.value,
                                    alt: "Course thumbnail",
                                    preview: true,
                                    class: "thumb"
                                  }, null, 8, ["src"]),
                                  createVNode(_component_a_divider, { style: { "margin": "12px 0" } }),
                                  createVNode(_component_a_space, {
                                    align: "baseline",
                                    wrap: ""
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_typography_title, {
                                        level: 3,
                                        style: { "margin": "0" }
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(money(currentPrice.value)), 1)
                                        ]),
                                        _: 1
                                      }),
                                      showOldPrice.value ? (openBlock(), createBlock(_component_a_typography_text, {
                                        key: 0,
                                        type: "secondary",
                                        delete: ""
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(money(oldPrice.value)), 1)
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true),
                                      discountPct.value > 0 ? (openBlock(), createBlock(_component_a_tag, {
                                        key: 1,
                                        color: "green"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(discountLabel.value), 1)
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_alert, {
                                    type: "success",
                                    "show-icon": "",
                                    message: "30-day money-back guarantee",
                                    style: { "margin": "12px 0" }
                                  }),
                                  createVNode(_component_a_space, {
                                    direction: "vertical",
                                    style: { "width": "100%" }
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        block: "",
                                        icon: h(unref(ShoppingCartOutlined)),
                                        onClick: unref(addToCartFn),
                                        loading: adding.value || unref(cartLoading),
                                        disabled: isInCartCourse.value
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(isInCartCourse.value ? "In Cart" : "Add To Cart"), 1)
                                        ]),
                                        _: 1
                                      }, 8, ["icon", "onClick", "loading", "disabled"]),
                                      createVNode(_component_a_button, {
                                        block: "",
                                        icon: h(unref(ThunderboltOutlined)),
                                        onClick: buyNow,
                                        loading: checkingOut.value
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Buy Now ")
                                        ]),
                                        _: 1
                                      }, 8, ["icon", "loading"]),
                                      createVNode(_component_a_button, {
                                        block: "",
                                        icon: h(unref(HeartOutlined)),
                                        type: inWishlist.value ? "primary" : "default",
                                        ghost: !inWishlist.value,
                                        onClick: toggleWishlist
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(inWishlist.value ? "Wishlisted" : "Add to Wishlist"), 1)
                                        ]),
                                        _: 1
                                      }, 8, ["icon", "type", "ghost"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_divider, { style: { "margin": "12px 0" } }),
                                  createVNode(_component_a_input_group, {
                                    compact: "",
                                    style: { "margin-bottom": "8px" }
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_input, {
                                        value: coupon.value,
                                        "onUpdate:value": ($event) => coupon.value = $event,
                                        style: { "width": "65%" },
                                        placeholder: "Coupon code"
                                      }, null, 8, ["value", "onUpdate:value"]),
                                      createVNode(_component_a_button, {
                                        style: { "width": "35%" },
                                        onClick: applyCoupon,
                                        loading: validatingCoupon.value
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Apply ")
                                        ]),
                                        _: 1
                                      }, 8, ["loading"])
                                    ]),
                                    _: 1
                                  }),
                                  couponApplied.value ? (openBlock(), createBlock(_component_a_typography_text, {
                                    key: 0,
                                    type: "success"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Coupon applied! ")
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true),
                                  createVNode(_component_a_space, { style: { "margin-top": "10px" } }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_popover, { trigger: "click" }, {
                                        content: withCtx(() => [
                                          createVNode(_component_a_space, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_button, {
                                                type: "text",
                                                onClick: ($event) => share("link")
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Copy link")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"]),
                                              createVNode(_component_a_button, {
                                                type: "text",
                                                onClick: ($event) => share("x")
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Share on X")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"]),
                                              createVNode(_component_a_button, {
                                                type: "text",
                                                onClick: ($event) => share("linkedin")
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("LinkedIn")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        default: withCtx(() => [
                                          createVNode(_component_a_button, {
                                            type: "link",
                                            icon: h(unref(ShareAltOutlined))
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Share")
                                            ]),
                                            _: 1
                                          }, 8, ["icon"])
                                        ]),
                                        _: 1
                                      }),
                                      renderSlot(_ctx.$slots, "cta-extra", {}, void 0, true)
                                    ]),
                                    _: 3
                                  })
                                ]),
                                _: 3
                              }, 8, ["loading"])
                            ]),
                            _: 3
                          })
                        ]),
                        _: 3
                      })
                    ]),
                    _: 3
                  })
                ]),
                _: 3
              })
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(_component_a_card, {
        class: "course-details",
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
                    key: "details",
                    tab: "Details"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_typography_title, { level: 4 }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Course Description`);
                            } else {
                              return [
                                createTextVNode("Course Description")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_skeleton, {
                          loading: pending.value,
                          active: "",
                          paragraph: { rows: 4 }
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_typography_paragraph, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(course.value?.description || "—")}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(course.value?.description || "—"), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_typography_paragraph, null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(course.value?.description || "—"), 1)
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_typography_title, {
                          level: 4,
                          style: { "margin-top": "16px" }
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Course Info `);
                            } else {
                              return [
                                createTextVNode(" Course Info ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_descriptions, {
                          bordered: "",
                          size: "small"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_descriptions_item, { label: "Category" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(course.value?.category || "—")}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(course.value?.category || "—"), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_descriptions_item, { label: "Difficulty" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(course.value?.difficulty || "—")}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(course.value?.difficulty || "—"), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_descriptions_item, { label: "Lectures" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(totalLectures.value)}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(totalLectures.value), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_descriptions_item, { label: "Total duration" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(totalDurationLabel.value)}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(totalDurationLabel.value), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_descriptions_item, { label: "Category" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(course.value?.category || "—"), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions_item, { label: "Difficulty" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(course.value?.difficulty || "—"), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions_item, { label: "Lectures" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(totalLectures.value), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions_item, { label: "Total duration" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(totalDurationLabel.value), 1)
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
                          createVNode(_component_a_typography_title, { level: 4 }, {
                            default: withCtx(() => [
                              createTextVNode("Course Description")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_skeleton, {
                            loading: pending.value,
                            active: "",
                            paragraph: { rows: 4 }
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_typography_paragraph, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(course.value?.description || "—"), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["loading"]),
                          createVNode(_component_a_typography_title, {
                            level: 4,
                            style: { "margin-top": "16px" }
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Course Info ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_descriptions, {
                            bordered: "",
                            size: "small"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_descriptions_item, { label: "Category" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(course.value?.category || "—"), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_descriptions_item, { label: "Difficulty" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(course.value?.difficulty || "—"), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_descriptions_item, { label: "Lectures" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(totalLectures.value), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_descriptions_item, { label: "Total duration" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(totalDurationLabel.value), 1)
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
                    key: "instructor",
                    tab: "Instructor"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_card, {
                          bordered: "",
                          class: "instructor-card"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_space, { align: "start" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_avatar, {
                                      size: 90,
                                      src: instructor.avatar || "/instructor.png"
                                    }, null, _parent6, _scopeId5));
                                    _push6(`<div data-v-75902442${_scopeId5}>`);
                                    _push6(ssrRenderComponent(_component_a_typography_title, {
                                      level: 5,
                                      style: { "margin": "0", "color": "#1677ff" }
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(instructor.name)}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(instructor.name), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`<div class="muted" data-v-75902442${_scopeId5}>${ssrInterpolate(instructor.title)}</div></div>`);
                                  } else {
                                    return [
                                      createVNode(_component_a_avatar, {
                                        size: 90,
                                        src: instructor.avatar || "/instructor.png"
                                      }, null, 8, ["src"]),
                                      createVNode("div", null, [
                                        createVNode(_component_a_typography_title, {
                                          level: 5,
                                          style: { "margin": "0", "color": "#1677ff" }
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(instructor.name), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("div", { class: "muted" }, toDisplayString(instructor.title), 1)
                                      ])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              if (instructor.bio) {
                                _push5(ssrRenderComponent(_component_a_typography_paragraph, { style: { "margin-top": "12px" } }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(instructor.bio)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(instructor.bio), 1)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                _push5(ssrRenderComponent(_component_a_typography_paragraph, {
                                  class: "muted",
                                  style: { "margin-top": "12px" }
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(` Instructor profile will be available soon. `);
                                    } else {
                                      return [
                                        createTextVNode(" Instructor profile will be available soon. ")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              }
                            } else {
                              return [
                                createVNode(_component_a_space, { align: "start" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_avatar, {
                                      size: 90,
                                      src: instructor.avatar || "/instructor.png"
                                    }, null, 8, ["src"]),
                                    createVNode("div", null, [
                                      createVNode(_component_a_typography_title, {
                                        level: 5,
                                        style: { "margin": "0", "color": "#1677ff" }
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(instructor.name), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("div", { class: "muted" }, toDisplayString(instructor.title), 1)
                                    ])
                                  ]),
                                  _: 1
                                }),
                                instructor.bio ? (openBlock(), createBlock(_component_a_typography_paragraph, {
                                  key: 0,
                                  style: { "margin-top": "12px" }
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(instructor.bio), 1)
                                  ]),
                                  _: 1
                                })) : (openBlock(), createBlock(_component_a_typography_paragraph, {
                                  key: 1,
                                  class: "muted",
                                  style: { "margin-top": "12px" }
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Instructor profile will be available soon. ")
                                  ]),
                                  _: 1
                                }))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_card, {
                            bordered: "",
                            class: "instructor-card"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_space, { align: "start" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_avatar, {
                                    size: 90,
                                    src: instructor.avatar || "/instructor.png"
                                  }, null, 8, ["src"]),
                                  createVNode("div", null, [
                                    createVNode(_component_a_typography_title, {
                                      level: 5,
                                      style: { "margin": "0", "color": "#1677ff" }
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(instructor.name), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("div", { class: "muted" }, toDisplayString(instructor.title), 1)
                                  ])
                                ]),
                                _: 1
                              }),
                              instructor.bio ? (openBlock(), createBlock(_component_a_typography_paragraph, {
                                key: 0,
                                style: { "margin-top": "12px" }
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(instructor.bio), 1)
                                ]),
                                _: 1
                              })) : (openBlock(), createBlock(_component_a_typography_paragraph, {
                                key: 1,
                                class: "muted",
                                style: { "margin-top": "12px" }
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Instructor profile will be available soon. ")
                                ]),
                                _: 1
                              }))
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_tab_pane, {
                    key: "syllabus",
                    tab: "Syllabus"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (syllabus.value.length) {
                          _push4(ssrRenderComponent(_component_a_collapse, { accordion: "" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<!--[-->`);
                                ssrRenderList(syllabus.value, (sec) => {
                                  _push5(ssrRenderComponent(_component_a_collapse_panel, {
                                    key: sec.id,
                                    header: sec.title,
                                    extra: h("span", { class: "muted" }, `${sec.lessons} Lessons · ${sec.durationLabel}`)
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_component_a_list, {
                                          size: "small",
                                          "data-source": sec.items,
                                          renderItem: (lesson) => h(
                                            "div",
                                            { class: "lesson-row" },
                                            `${lesson.title || "Lesson"} · ${lesson.duration || "0"} min`
                                          )
                                        }, null, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(_component_a_list, {
                                            size: "small",
                                            "data-source": sec.items,
                                            renderItem: (lesson) => h(
                                              "div",
                                              { class: "lesson-row" },
                                              `${lesson.title || "Lesson"} · ${lesson.duration || "0"} min`
                                            )
                                          }, null, 8, ["data-source", "renderItem"])
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                });
                                _push5(`<!--]-->`);
                              } else {
                                return [
                                  (openBlock(true), createBlock(Fragment, null, renderList(syllabus.value, (sec) => {
                                    return openBlock(), createBlock(_component_a_collapse_panel, {
                                      key: sec.id,
                                      header: sec.title,
                                      extra: h("span", { class: "muted" }, `${sec.lessons} Lessons · ${sec.durationLabel}`)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_list, {
                                          size: "small",
                                          "data-source": sec.items,
                                          renderItem: (lesson) => h(
                                            "div",
                                            { class: "lesson-row" },
                                            `${lesson.title || "Lesson"} · ${lesson.duration || "0"} min`
                                          )
                                        }, null, 8, ["data-source", "renderItem"])
                                      ]),
                                      _: 2
                                    }, 1032, ["header", "extra"]);
                                  }), 128))
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(ssrRenderComponent(_component_a_empty, null, null, _parent4, _scopeId3));
                        }
                      } else {
                        return [
                          syllabus.value.length ? (openBlock(), createBlock(_component_a_collapse, {
                            key: 0,
                            accordion: ""
                          }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(syllabus.value, (sec) => {
                                return openBlock(), createBlock(_component_a_collapse_panel, {
                                  key: sec.id,
                                  header: sec.title,
                                  extra: h("span", { class: "muted" }, `${sec.lessons} Lessons · ${sec.durationLabel}`)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_list, {
                                      size: "small",
                                      "data-source": sec.items,
                                      renderItem: (lesson) => h(
                                        "div",
                                        { class: "lesson-row" },
                                        `${lesson.title || "Lesson"} · ${lesson.duration || "0"} min`
                                      )
                                    }, null, 8, ["data-source", "renderItem"])
                                  ]),
                                  _: 2
                                }, 1032, ["header", "extra"]);
                              }), 128))
                            ]),
                            _: 1
                          })) : (openBlock(), createBlock(_component_a_empty, { key: 1 }))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  ssrRenderSlot(_ctx.$slots, "tabs-extra", {}, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    createVNode(_component_a_tab_pane, {
                      key: "details",
                      tab: "Details"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_typography_title, { level: 4 }, {
                          default: withCtx(() => [
                            createTextVNode("Course Description")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_skeleton, {
                          loading: pending.value,
                          active: "",
                          paragraph: { rows: 4 }
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_typography_paragraph, null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(course.value?.description || "—"), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["loading"]),
                        createVNode(_component_a_typography_title, {
                          level: 4,
                          style: { "margin-top": "16px" }
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Course Info ")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_descriptions, {
                          bordered: "",
                          size: "small"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_descriptions_item, { label: "Category" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(course.value?.category || "—"), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_descriptions_item, { label: "Difficulty" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(course.value?.difficulty || "—"), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_descriptions_item, { label: "Lectures" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(totalLectures.value), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_descriptions_item, { label: "Total duration" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(totalDurationLabel.value), 1)
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
                      key: "instructor",
                      tab: "Instructor"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          bordered: "",
                          class: "instructor-card"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_space, { align: "start" }, {
                              default: withCtx(() => [
                                createVNode(_component_a_avatar, {
                                  size: 90,
                                  src: instructor.avatar || "/instructor.png"
                                }, null, 8, ["src"]),
                                createVNode("div", null, [
                                  createVNode(_component_a_typography_title, {
                                    level: 5,
                                    style: { "margin": "0", "color": "#1677ff" }
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(instructor.name), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("div", { class: "muted" }, toDisplayString(instructor.title), 1)
                                ])
                              ]),
                              _: 1
                            }),
                            instructor.bio ? (openBlock(), createBlock(_component_a_typography_paragraph, {
                              key: 0,
                              style: { "margin-top": "12px" }
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(instructor.bio), 1)
                              ]),
                              _: 1
                            })) : (openBlock(), createBlock(_component_a_typography_paragraph, {
                              key: 1,
                              class: "muted",
                              style: { "margin-top": "12px" }
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Instructor profile will be available soon. ")
                              ]),
                              _: 1
                            }))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_tab_pane, {
                      key: "syllabus",
                      tab: "Syllabus"
                    }, {
                      default: withCtx(() => [
                        syllabus.value.length ? (openBlock(), createBlock(_component_a_collapse, {
                          key: 0,
                          accordion: ""
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(syllabus.value, (sec) => {
                              return openBlock(), createBlock(_component_a_collapse_panel, {
                                key: sec.id,
                                header: sec.title,
                                extra: h("span", { class: "muted" }, `${sec.lessons} Lessons · ${sec.durationLabel}`)
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_list, {
                                    size: "small",
                                    "data-source": sec.items,
                                    renderItem: (lesson) => h(
                                      "div",
                                      { class: "lesson-row" },
                                      `${lesson.title || "Lesson"} · ${lesson.duration || "0"} min`
                                    )
                                  }, null, 8, ["data-source", "renderItem"])
                                ]),
                                _: 2
                              }, 1032, ["header", "extra"]);
                            }), 128))
                          ]),
                          _: 1
                        })) : (openBlock(), createBlock(_component_a_empty, { key: 1 }))
                      ]),
                      _: 1
                    }),
                    renderSlot(_ctx.$slots, "tabs-extra", {}, void 0, true)
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_tabs, {
                activeKey: tabKey.value,
                "onUpdate:activeKey": ($event) => tabKey.value = $event
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_tab_pane, {
                    key: "details",
                    tab: "Details"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_typography_title, { level: 4 }, {
                        default: withCtx(() => [
                          createTextVNode("Course Description")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_skeleton, {
                        loading: pending.value,
                        active: "",
                        paragraph: { rows: 4 }
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_typography_paragraph, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(course.value?.description || "—"), 1)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["loading"]),
                      createVNode(_component_a_typography_title, {
                        level: 4,
                        style: { "margin-top": "16px" }
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Course Info ")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_descriptions, {
                        bordered: "",
                        size: "small"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_descriptions_item, { label: "Category" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(course.value?.category || "—"), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_descriptions_item, { label: "Difficulty" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(course.value?.difficulty || "—"), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_descriptions_item, { label: "Lectures" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(totalLectures.value), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_descriptions_item, { label: "Total duration" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(totalDurationLabel.value), 1)
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
                    key: "instructor",
                    tab: "Instructor"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_card, {
                        bordered: "",
                        class: "instructor-card"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_space, { align: "start" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_avatar, {
                                size: 90,
                                src: instructor.avatar || "/instructor.png"
                              }, null, 8, ["src"]),
                              createVNode("div", null, [
                                createVNode(_component_a_typography_title, {
                                  level: 5,
                                  style: { "margin": "0", "color": "#1677ff" }
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(instructor.name), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode("div", { class: "muted" }, toDisplayString(instructor.title), 1)
                              ])
                            ]),
                            _: 1
                          }),
                          instructor.bio ? (openBlock(), createBlock(_component_a_typography_paragraph, {
                            key: 0,
                            style: { "margin-top": "12px" }
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(instructor.bio), 1)
                            ]),
                            _: 1
                          })) : (openBlock(), createBlock(_component_a_typography_paragraph, {
                            key: 1,
                            class: "muted",
                            style: { "margin-top": "12px" }
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Instructor profile will be available soon. ")
                            ]),
                            _: 1
                          }))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_tab_pane, {
                    key: "syllabus",
                    tab: "Syllabus"
                  }, {
                    default: withCtx(() => [
                      syllabus.value.length ? (openBlock(), createBlock(_component_a_collapse, {
                        key: 0,
                        accordion: ""
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(syllabus.value, (sec) => {
                            return openBlock(), createBlock(_component_a_collapse_panel, {
                              key: sec.id,
                              header: sec.title,
                              extra: h("span", { class: "muted" }, `${sec.lessons} Lessons · ${sec.durationLabel}`)
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_list, {
                                  size: "small",
                                  "data-source": sec.items,
                                  renderItem: (lesson) => h(
                                    "div",
                                    { class: "lesson-row" },
                                    `${lesson.title || "Lesson"} · ${lesson.duration || "0"} min`
                                  )
                                }, null, 8, ["data-source", "renderItem"])
                              ]),
                              _: 2
                            }, 1032, ["header", "extra"]);
                          }), 128))
                        ]),
                        _: 1
                      })) : (openBlock(), createBlock(_component_a_empty, { key: 1 }))
                    ]),
                    _: 1
                  }),
                  renderSlot(_ctx.$slots, "tabs-extra", {}, void 0, true)
                ]),
                _: 3
              }, 8, ["activeKey", "onUpdate:activeKey"])
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(_component_a_float_button_group, {
        shape: "square",
        style: { right: "24px" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_float_button, {
              icon: h(unref(ShoppingCartOutlined)),
              tooltip: "Add to cart",
              onClick: unref(addToCartFn),
              disabled: isInCartCourse.value
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_float_button, {
              icon: h(unref(ThunderboltOutlined)),
              tooltip: "Buy now",
              onClick: buyNow
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_float_button, {
                icon: h(unref(ShoppingCartOutlined)),
                tooltip: "Add to cart",
                onClick: unref(addToCartFn),
                disabled: isInCartCourse.value
              }, null, 8, ["icon", "onClick", "disabled"]),
              createVNode(_component_a_float_button, {
                icon: h(unref(ThunderboltOutlined)),
                tooltip: "Buy now",
                onClick: buyNow
              }, null, 8, ["icon"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/courses-details/nuxt/pages/courses-detail.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const coursesDetail = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-75902442"]]);

export { coursesDetail as default };
//# sourceMappingURL=courses-detail-BTXUThrK.mjs.map
