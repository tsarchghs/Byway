import { defineComponent, ref, computed, resolveComponent, withCtx, createTextVNode, h, unref, createVNode, renderSlot, toDisplayString, withModifiers, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderList, ssrInterpolate, ssrRenderAttrs, ssrRenderStyle } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { H as Header } from './Header-DscPRdFw.mjs';
import { message } from 'ant-design-vue';
import { FilterOutlined, AppstoreOutlined, UnorderedListOutlined, ShoppingCartOutlined } from '@ant-design/icons-vue';
import { u as useCart } from './useCart-7pxN526Z.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import '@apollo/client/core/index.js';
import '@apollo/client/link/context/index.js';
import '@vue/apollo-composable';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FiltersPanel",
  __ssrInlineRender: true,
  props: {
    minRating: {},
    durationRange: {},
    levels: {},
    languages: {}
  },
  emits: [
    "update:minRating",
    "update:durationRange",
    "update:levels",
    "update:languages",
    "reset"
  ],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_radio_group = resolveComponent("a-radio-group");
      const _component_a_radio = resolveComponent("a-radio");
      const _component_a_rate = resolveComponent("a-rate");
      const _component_a_slider = resolveComponent("a-slider");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_checkbox_group = resolveComponent("a-checkbox-group");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_button = resolveComponent("a-button");
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_a_typography_title, { level: 5 }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Ratings`);
          } else {
            return [
              createTextVNode("Ratings")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_radio_group, {
        value: __props.minRating,
        onChange: (e) => emit("update:minRating", e.target.value),
        style: { "display": "flex", "gap": "8px", "flex-direction": "column", "margin-bottom": "12px" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_radio, { value: 0 }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Any`);
                } else {
                  return [
                    createTextVNode("Any")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_radio, { value: 4 }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_rate, {
                    disabled: "",
                    "allow-half": "",
                    value: 4,
                    style: { "font-size": "14px" }
                  }, null, _parent3, _scopeId2));
                  _push3(` 4.0+ `);
                } else {
                  return [
                    createVNode(_component_a_rate, {
                      disabled: "",
                      "allow-half": "",
                      value: 4,
                      style: { "font-size": "14px" }
                    }),
                    createTextVNode(" 4.0+ ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_radio, { value: 3 }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_rate, {
                    disabled: "",
                    "allow-half": "",
                    value: 3,
                    style: { "font-size": "14px" }
                  }, null, _parent3, _scopeId2));
                  _push3(` 3.0+ `);
                } else {
                  return [
                    createVNode(_component_a_rate, {
                      disabled: "",
                      "allow-half": "",
                      value: 3,
                      style: { "font-size": "14px" }
                    }),
                    createTextVNode(" 3.0+ ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_radio, { value: 2 }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_rate, {
                    disabled: "",
                    "allow-half": "",
                    value: 2,
                    style: { "font-size": "14px" }
                  }, null, _parent3, _scopeId2));
                  _push3(` 2.0+ `);
                } else {
                  return [
                    createVNode(_component_a_rate, {
                      disabled: "",
                      "allow-half": "",
                      value: 2,
                      style: { "font-size": "14px" }
                    }),
                    createTextVNode(" 2.0+ ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_radio, { value: 0 }, {
                default: withCtx(() => [
                  createTextVNode("Any")
                ]),
                _: 1
              }),
              createVNode(_component_a_radio, { value: 4 }, {
                default: withCtx(() => [
                  createVNode(_component_a_rate, {
                    disabled: "",
                    "allow-half": "",
                    value: 4,
                    style: { "font-size": "14px" }
                  }),
                  createTextVNode(" 4.0+ ")
                ]),
                _: 1
              }),
              createVNode(_component_a_radio, { value: 3 }, {
                default: withCtx(() => [
                  createVNode(_component_a_rate, {
                    disabled: "",
                    "allow-half": "",
                    value: 3,
                    style: { "font-size": "14px" }
                  }),
                  createTextVNode(" 3.0+ ")
                ]),
                _: 1
              }),
              createVNode(_component_a_radio, { value: 2 }, {
                default: withCtx(() => [
                  createVNode(_component_a_rate, {
                    disabled: "",
                    "allow-half": "",
                    value: 2,
                    style: { "font-size": "14px" }
                  }),
                  createTextVNode(" 2.0+ ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_typography_title, { level: 5 }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Duration (hours)`);
          } else {
            return [
              createTextVNode("Duration (hours)")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_slider, {
        range: "",
        min: 0,
        max: 30,
        step: 1,
        value: __props.durationRange,
        onChange: (v) => emit("update:durationRange", v)
      }, null, _parent));
      _push(`<div style="${ssrRenderStyle({ "margin-bottom": "12px", "display": "flex", "gap": "8px" })}">`);
      _push(ssrRenderComponent(_component_a_tag, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.durationRange[0])}h`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.durationRange[0]) + "h", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_tag, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.durationRange[1])}h`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.durationRange[1]) + "h", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_a_typography_title, { level: 5 }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Level`);
          } else {
            return [
              createTextVNode("Level")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_checkbox_group, {
        value: __props.levels,
        options: ["Beginner", "Intermediate", "Advanced"],
        onChange: (v) => emit("update:levels", v),
        style: { "display": "flex", "flex-direction": "column", "gap": "6px", "margin-bottom": "12px" }
      }, null, _parent));
      _push(ssrRenderComponent(_component_a_typography_title, { level: 5 }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Language`);
          } else {
            return [
              createTextVNode("Language")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_checkbox_group, {
        value: __props.languages,
        options: ["English", "Spanish", "Italian", "German"],
        onChange: (v) => emit("update:languages", v),
        style: { "display": "flex", "flex-direction": "column", "gap": "6px", "margin-bottom": "12px" }
      }, null, _parent));
      _push(ssrRenderComponent(_component_a_space, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_button, {
              onClick: ($event) => emit("reset")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Reset`);
                } else {
                  return [
                    createTextVNode("Reset")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_button, {
                onClick: ($event) => emit("reset")
              }, {
                default: withCtx(() => [
                  createTextVNode("Reset")
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      ssrRenderSlot(_ctx.$slots, "filters-extra", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/courses-listing/nuxt/components/FiltersPanel.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const pageSize = 12;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "courses-listing",
  __ssrInlineRender: true,
  setup(__props) {
    const all = ref([{
      id: "1",
      title: "Beginner’s Guide to Design",
      author: "Ronald Richards",
      rating: 4.7,
      ratingsCount: 1200,
      hours: 22,
      lectures: 155,
      level: "Beginner",
      price: 149.9,
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=800&auto=format&fit=crop",
      language: "English"
    }, {
      id: "2",
      title: "Advanced Interaction Patterns",
      author: "Ronald Richards",
      rating: 4.8,
      ratingsCount: 980,
      hours: 18,
      lectures: 120,
      level: "Intermediate",
      price: 179,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
      language: "German"
    }, {
      id: "3",
      title: "Design Systems in Practice",
      author: "Ronald Richards",
      rating: 4.6,
      ratingsCount: 1400,
      hours: 30,
      lectures: 180,
      level: "Advanced",
      price: 199,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
      language: "Italian"
    }, {
      id: "4",
      title: "Practical Usability Testing",
      author: "Ronald Richards",
      rating: 4.5,
      ratingsCount: 700,
      hours: 14,
      lectures: 88,
      level: "Intermediate",
      price: 139,
      image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop",
      language: "Spanish"
    }, {
      id: "5",
      title: "Wireframing to Prototyping",
      author: "Ronald Richards",
      rating: 4.4,
      ratingsCount: 560,
      hours: 10,
      lectures: 75,
      level: "Beginner",
      price: 119,
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
      language: "English"
    }, {
      id: "6",
      title: "Information Architecture Basics",
      author: "Ronald Richards",
      rating: 4.2,
      ratingsCount: 350,
      hours: 12,
      lectures: 80,
      level: "Beginner",
      price: 109,
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
      language: "German"
    }, {
      id: "7",
      title: "Interaction Design Fundamentals",
      author: "Ronald Richards",
      rating: 4.9,
      ratingsCount: 2200,
      hours: 26,
      lectures: 160,
      level: "Intermediate",
      price: 189,
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
      language: "English"
    }, {
      id: "8",
      title: "UX Research Field Guide",
      author: "Ronald Richards",
      rating: 4.1,
      ratingsCount: 260,
      hours: 8,
      lectures: 60,
      level: "Beginner",
      price: 89,
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
      language: "Italian"
    }, {
      id: "9",
      title: "Mobile UX Patterns",
      author: "Ronald Richards",
      rating: 4.3,
      ratingsCount: 410,
      hours: 16,
      lectures: 90,
      level: "Intermediate",
      price: 149,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
      language: "Spanish"
    }, {
      id: "10",
      title: "Accessibility for Designers",
      author: "Ronald Richards",
      rating: 4.6,
      ratingsCount: 860,
      hours: 12,
      lectures: 70,
      level: "Beginner",
      price: 129,
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=800&auto=format&fit=crop",
      language: "English"
    }]);
    const q = ref("");
    const sortBy = ref("popular");
    const viewMode = ref("grid");
    const openFilters = ref(false);
    const minRating = ref(0);
    const durationRange = ref([0, 30]);
    const levels = ref([]);
    const languages = ref([]);
    function resetFilters() {
      minRating.value = 0;
      durationRange.value = [0, 30];
      levels.value = [];
      languages.value = [];
    }
    const filtered = computed(() => {
      const term = q.value.trim().toLowerCase();
      let list = all.value.filter((c) => {
        const matchesQ = !term || c.title.toLowerCase().includes(term) || c.author.toLowerCase().includes(term);
        const matchesRating = c.rating >= (minRating.value || 0);
        const matchesDuration = c.hours >= durationRange.value[0] && c.hours <= durationRange.value[1];
        const matchesLevel = !levels.value.length || levels.value.includes(c.level);
        const matchesLang = !languages.value.length || languages.value.includes(c.language);
        return matchesQ && matchesRating && matchesDuration && matchesLevel && matchesLang;
      });
      switch (sortBy.value) {
        case "rating":
          list.sort((a, b) => b.rating - a.rating || b.ratingsCount - a.ratingsCount);
          break;
        case "priceAsc":
          list.sort((a, b) => a.price - b.price);
          break;
        case "priceDesc":
          list.sort((a, b) => b.price - a.price);
          break;
        case "hoursAsc":
          list.sort((a, b) => a.hours - b.hours);
          break;
        case "hoursDesc":
          list.sort((a, b) => b.hours - a.hours);
          break;
        default:
          list.sort((a, b) => b.ratingsCount - a.ratingsCount || b.rating - a.rating);
      }
      return list;
    });
    const page = ref(1);
    const paged = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize));
    const router = useRouter();
    const {
      addToCart: addToCartComposable,
      isInCart: isInCartComposable,
      loading: cartLoading
    } = useCart();
    function euro(v) {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR"
      }).format(v);
    }
    async function addToCart(c) {
      try {
        await addToCartComposable(c.id, 1);
        message.success(`Added "${c.title}" to cart`);
      } catch (e) {
        if (e?.message?.includes("authenticated")) {
          message.warning("Please log in to add courses to your cart");
          router.push("/login");
        } else if (e?.message?.includes("Already enrolled")) {
          message.info(`You're already enrolled in "${c.title}"`);
        } else {
          message.error(e?.message || "Failed to add course to cart");
        }
      }
    }
    function isInCart(courseId) {
      return isInCartComposable(courseId);
    }
    function goCourse(id) {
      router.push(`/courses/${id}`);
    }
    function renderListItem(item) {
      return h("div", {
        class: "list-item"
      }, [h("div", {
        class: "list-thumb-wrap",
        onClick: () => goCourse(item.id)
      }, [h("img", {
        class: "list-thumb",
        src: item.image,
        alt: item.title
      })]), h("div", {
        class: "list-main"
      }, [h("div", {
        class: "list-title"
      }, item.title), h("div", {
        class: "list-author"
      }, `By ${item.author}`), h("div", {
        class: "list-row"
      }, [h("span", {
        class: "list-rating"
      }, [h("span", {
        class: "rating-number"
      }, item.rating.toFixed(1)), h("span", {
        class: "rating-stars"
      }, [h("span", null, " ")])]), h("span", null, `• ${item.ratingsCount.toLocaleString()} ratings`), h("span", null, `• ${item.hours}h • ${item.lectures} lectures • ${item.level}`)]), h("div", {
        class: "list-price"
      }, euro(item.price)), h("div", {
        class: "list-actions"
      }, [h("button", {
        class: ["add-link", isInCart(item.id) && "in-cart"],
        onClick: () => addToCart(item),
        disabled: cartLoading.value || isInCart(item.id)
      }, [h(ShoppingCartOutlined), " ", isInCart(item.id) ? "In Cart" : "Add to cart"])])])]);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_input_search = resolveComponent("a-input-search");
      const _component_a_select = resolveComponent("a-select");
      const _component_a_select_option = resolveComponent("a-select-option");
      const _component_a_segmented = resolveComponent("a-segmented");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_affix = resolveComponent("a-affix");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_image = resolveComponent("a-image");
      const _component_a_card_meta = resolveComponent("a-card-meta");
      const _component_a_rate = resolveComponent("a-rate");
      const _component_a_typography_text = resolveComponent("a-typography-text");
      const _component_a_list = resolveComponent("a-list");
      const _component_a_pagination = resolveComponent("a-pagination");
      const _component_a_drawer = resolveComponent("a-drawer");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(`<div class="catalogue" data-v-fb5d7a59><div class="catalogue-header" data-v-fb5d7a59>`);
      _push(ssrRenderComponent(_component_a_typography_title, {
        level: 2,
        class: "catalogue-title"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`All Courses`);
          } else {
            return [createTextVNode("All Courses")];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_space, {
        size: [12, 8],
        wrap: "",
        class: "catalogue-controls"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_button, {
              icon: h(unref(FilterOutlined)),
              onClick: ($event) => openFilters.value = true
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Filter`);
                } else {
                  return [createTextVNode("Filter")];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_input_search, {
              value: q.value,
              "onUpdate:value": ($event) => q.value = $event,
              placeholder: "Search courses…",
              "allow-clear": "",
              style: {
                "width": "260px"
              },
              onSearch: ($event) => page.value = 1
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_select, {
              value: sortBy.value,
              "onUpdate:value": ($event) => sortBy.value = $event,
              style: {
                "width": "180px"
              }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_select_option, {
                    value: "popular"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Popularity`);
                      } else {
                        return [createTextVNode("Popularity")];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_select_option, {
                    value: "rating"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Rating`);
                      } else {
                        return [createTextVNode("Rating")];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_select_option, {
                    value: "priceAsc"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Price: Low → High`);
                      } else {
                        return [createTextVNode("Price: Low → High")];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_select_option, {
                    value: "priceDesc"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Price: High → Low`);
                      } else {
                        return [createTextVNode("Price: High → Low")];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_select_option, {
                    value: "hoursAsc"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Duration: Short → Long`);
                      } else {
                        return [createTextVNode("Duration: Short → Long")];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_select_option, {
                    value: "hoursDesc"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Duration: Long → Short`);
                      } else {
                        return [createTextVNode("Duration: Long → Short")];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [createVNode(_component_a_select_option, {
                    value: "popular"
                  }, {
                    default: withCtx(() => [createTextVNode("Popularity")]),
                    _: 1
                  }), createVNode(_component_a_select_option, {
                    value: "rating"
                  }, {
                    default: withCtx(() => [createTextVNode("Rating")]),
                    _: 1
                  }), createVNode(_component_a_select_option, {
                    value: "priceAsc"
                  }, {
                    default: withCtx(() => [createTextVNode("Price: Low → High")]),
                    _: 1
                  }), createVNode(_component_a_select_option, {
                    value: "priceDesc"
                  }, {
                    default: withCtx(() => [createTextVNode("Price: High → Low")]),
                    _: 1
                  }), createVNode(_component_a_select_option, {
                    value: "hoursAsc"
                  }, {
                    default: withCtx(() => [createTextVNode("Duration: Short → Long")]),
                    _: 1
                  }), createVNode(_component_a_select_option, {
                    value: "hoursDesc"
                  }, {
                    default: withCtx(() => [createTextVNode("Duration: Long → Short")]),
                    _: 1
                  })];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_segmented, {
              value: viewMode.value,
              "onUpdate:value": ($event) => viewMode.value = $event,
              options: [{
                label: "Grid",
                value: "grid",
                icon: h(unref(AppstoreOutlined))
              }, {
                label: "List",
                value: "list",
                icon: h(unref(UnorderedListOutlined))
              }]
            }, null, _parent2, _scopeId));
            ssrRenderSlot(_ctx.$slots, "toolbar-right", {
              filters: {
                q: q.value,
                sortBy: sortBy.value,
                viewMode: viewMode.value
              }
            }, null, _push2, _parent2, _scopeId);
          } else {
            return [createVNode(_component_a_button, {
              icon: h(unref(FilterOutlined)),
              onClick: ($event) => openFilters.value = true
            }, {
              default: withCtx(() => [createTextVNode("Filter")]),
              _: 1
            }, 8, ["icon", "onClick"]), createVNode(_component_a_input_search, {
              value: q.value,
              "onUpdate:value": ($event) => q.value = $event,
              placeholder: "Search courses…",
              "allow-clear": "",
              style: {
                "width": "260px"
              },
              onSearch: ($event) => page.value = 1
            }, null, 8, ["value", "onUpdate:value", "onSearch"]), createVNode(_component_a_select, {
              value: sortBy.value,
              "onUpdate:value": ($event) => sortBy.value = $event,
              style: {
                "width": "180px"
              }
            }, {
              default: withCtx(() => [createVNode(_component_a_select_option, {
                value: "popular"
              }, {
                default: withCtx(() => [createTextVNode("Popularity")]),
                _: 1
              }), createVNode(_component_a_select_option, {
                value: "rating"
              }, {
                default: withCtx(() => [createTextVNode("Rating")]),
                _: 1
              }), createVNode(_component_a_select_option, {
                value: "priceAsc"
              }, {
                default: withCtx(() => [createTextVNode("Price: Low → High")]),
                _: 1
              }), createVNode(_component_a_select_option, {
                value: "priceDesc"
              }, {
                default: withCtx(() => [createTextVNode("Price: High → Low")]),
                _: 1
              }), createVNode(_component_a_select_option, {
                value: "hoursAsc"
              }, {
                default: withCtx(() => [createTextVNode("Duration: Short → Long")]),
                _: 1
              }), createVNode(_component_a_select_option, {
                value: "hoursDesc"
              }, {
                default: withCtx(() => [createTextVNode("Duration: Long → Short")]),
                _: 1
              })]),
              _: 1
            }, 8, ["value", "onUpdate:value"]), createVNode(_component_a_segmented, {
              value: viewMode.value,
              "onUpdate:value": ($event) => viewMode.value = $event,
              options: [{
                label: "Grid",
                value: "grid",
                icon: h(unref(AppstoreOutlined))
              }, {
                label: "List",
                value: "list",
                icon: h(unref(UnorderedListOutlined))
              }]
            }, null, 8, ["value", "onUpdate:value", "options"]), renderSlot(_ctx.$slots, "toolbar-right", {
              filters: {
                q: q.value,
                sortBy: sortBy.value,
                viewMode: viewMode.value
              }
            }, void 0, true)];
          }
        }),
        _: 3
      }, _parent));
      _push(`</div><div class="catalogue-body" data-v-fb5d7a59>`);
      _push(ssrRenderComponent(_component_a_col, {
        xs: 0,
        lg: 6
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_affix, {
              "offset-top": 80
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_card, {
                    title: "Filters",
                    class: "filters"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_sfc_main$1, {
                          minRating: minRating.value,
                          "onUpdate:minRating": ($event) => minRating.value = $event,
                          durationRange: durationRange.value,
                          "onUpdate:durationRange": ($event) => durationRange.value = $event,
                          levels: levels.value,
                          "onUpdate:levels": ($event) => levels.value = $event,
                          languages: languages.value,
                          "onUpdate:languages": ($event) => languages.value = $event,
                          onReset: resetFilters
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [createVNode(_sfc_main$1, {
                          minRating: minRating.value,
                          "onUpdate:minRating": ($event) => minRating.value = $event,
                          durationRange: durationRange.value,
                          "onUpdate:durationRange": ($event) => durationRange.value = $event,
                          levels: levels.value,
                          "onUpdate:levels": ($event) => levels.value = $event,
                          languages: languages.value,
                          "onUpdate:languages": ($event) => languages.value = $event,
                          onReset: resetFilters
                        }, null, 8, ["minRating", "onUpdate:minRating", "durationRange", "onUpdate:durationRange", "levels", "onUpdate:levels", "languages", "onUpdate:languages"])];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [createVNode(_component_a_card, {
                    title: "Filters",
                    class: "filters"
                  }, {
                    default: withCtx(() => [createVNode(_sfc_main$1, {
                      minRating: minRating.value,
                      "onUpdate:minRating": ($event) => minRating.value = $event,
                      durationRange: durationRange.value,
                      "onUpdate:durationRange": ($event) => durationRange.value = $event,
                      levels: levels.value,
                      "onUpdate:levels": ($event) => levels.value = $event,
                      languages: languages.value,
                      "onUpdate:languages": ($event) => languages.value = $event,
                      onReset: resetFilters
                    }, null, 8, ["minRating", "onUpdate:minRating", "durationRange", "onUpdate:durationRange", "levels", "onUpdate:levels", "languages", "onUpdate:languages"])]),
                    _: 1
                  })];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [createVNode(_component_a_affix, {
              "offset-top": 80
            }, {
              default: withCtx(() => [createVNode(_component_a_card, {
                title: "Filters",
                class: "filters"
              }, {
                default: withCtx(() => [createVNode(_sfc_main$1, {
                  minRating: minRating.value,
                  "onUpdate:minRating": ($event) => minRating.value = $event,
                  durationRange: durationRange.value,
                  "onUpdate:durationRange": ($event) => durationRange.value = $event,
                  levels: levels.value,
                  "onUpdate:levels": ($event) => levels.value = $event,
                  languages: languages.value,
                  "onUpdate:languages": ($event) => languages.value = $event,
                  onReset: resetFilters
                }, null, 8, ["minRating", "onUpdate:minRating", "durationRange", "onUpdate:durationRange", "levels", "onUpdate:levels", "languages", "onUpdate:languages"])]),
                _: 1
              })]),
              _: 1
            })];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_col, {
        xs: 24,
        lg: 18
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (viewMode.value === "grid") {
              _push2(ssrRenderComponent(_component_a_row, {
                gutter: [16, 16],
                class: "product-grid"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<!--[-->`);
                    ssrRenderList(paged.value, (c) => {
                      _push3(ssrRenderComponent(_component_a_col, {
                        key: c.id,
                        xs: 24,
                        sm: 12,
                        md: 8,
                        lg: 8,
                        xl: 6
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_a_card, {
                              hoverable: "",
                              class: "product-card",
                              onClick: ($event) => goCourse(c.id)
                            }, {
                              cover: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_a_image, {
                                    src: c.image,
                                    alt: c.title,
                                    class: "product-image",
                                    preview: false
                                  }, null, _parent5, _scopeId4));
                                } else {
                                  return [createVNode(_component_a_image, {
                                    src: c.image,
                                    alt: c.title,
                                    class: "product-image",
                                    preview: false
                                  }, null, 8, ["src", "alt"])];
                                }
                              }),
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_a_card_meta, {
                                    title: c.title,
                                    description: `By ${c.author}`
                                  }, null, _parent5, _scopeId4));
                                  _push5(`<div class="product-content" data-v-fb5d7a59${_scopeId4}><div class="rating" data-v-fb5d7a59${_scopeId4}>`);
                                  _push5(ssrRenderComponent(_component_a_rate, {
                                    value: c.rating,
                                    "allow-half": "",
                                    disabled: "",
                                    style: {
                                      "font-size": "14px"
                                    }
                                  }, null, _parent5, _scopeId4));
                                  _push5(`<span class="rating-count" data-v-fb5d7a59${_scopeId4}>(${ssrInterpolate(c.ratingsCount.toLocaleString())})</span></div><div class="product-meta" data-v-fb5d7a59${_scopeId4}>${ssrInterpolate(c.hours)}h · ${ssrInterpolate(c.lectures)} lectures · ${ssrInterpolate(c.level)}</div><div class="card-footer" data-v-fb5d7a59${_scopeId4}>`);
                                  _push5(ssrRenderComponent(_component_a_typography_text, {
                                    strong: "",
                                    class: "product-price"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(euro(c.price))}`);
                                      } else {
                                        return [createTextVNode(toDisplayString(euro(c.price)), 1)];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                  _push5(ssrRenderComponent(_component_a_button, {
                                    type: "link",
                                    size: "small",
                                    onClick: ($event) => addToCart(c),
                                    loading: unref(cartLoading),
                                    disabled: isInCart(c.id)
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(isInCart(c.id) ? "In Cart" : "Add to cart")}`);
                                      } else {
                                        return [createTextVNode(toDisplayString(isInCart(c.id) ? "In Cart" : "Add to cart"), 1)];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                  _push5(`</div></div>`);
                                  ssrRenderSlot(_ctx.$slots, "card-extra", {
                                    course: c
                                  }, null, _push5, _parent5, _scopeId4);
                                } else {
                                  return [createVNode(_component_a_card_meta, {
                                    title: c.title,
                                    description: `By ${c.author}`
                                  }, null, 8, ["title", "description"]), createVNode("div", {
                                    class: "product-content"
                                  }, [createVNode("div", {
                                    class: "rating"
                                  }, [createVNode(_component_a_rate, {
                                    value: c.rating,
                                    "allow-half": "",
                                    disabled: "",
                                    style: {
                                      "font-size": "14px"
                                    }
                                  }, null, 8, ["value"]), createVNode("span", {
                                    class: "rating-count"
                                  }, "(" + toDisplayString(c.ratingsCount.toLocaleString()) + ")", 1)]), createVNode("div", {
                                    class: "product-meta"
                                  }, toDisplayString(c.hours) + "h · " + toDisplayString(c.lectures) + " lectures · " + toDisplayString(c.level), 1), createVNode("div", {
                                    class: "card-footer"
                                  }, [createVNode(_component_a_typography_text, {
                                    strong: "",
                                    class: "product-price"
                                  }, {
                                    default: withCtx(() => [createTextVNode(toDisplayString(euro(c.price)), 1)]),
                                    _: 2
                                  }, 1024), createVNode(_component_a_button, {
                                    type: "link",
                                    size: "small",
                                    onClick: withModifiers(($event) => addToCart(c), ["stop"]),
                                    loading: unref(cartLoading),
                                    disabled: isInCart(c.id)
                                  }, {
                                    default: withCtx(() => [createTextVNode(toDisplayString(isInCart(c.id) ? "In Cart" : "Add to cart"), 1)]),
                                    _: 2
                                  }, 1032, ["onClick", "loading", "disabled"])])]), renderSlot(_ctx.$slots, "card-extra", {
                                    course: c
                                  }, void 0, true)];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            return [createVNode(_component_a_card, {
                              hoverable: "",
                              class: "product-card",
                              onClick: ($event) => goCourse(c.id)
                            }, {
                              cover: withCtx(() => [createVNode(_component_a_image, {
                                src: c.image,
                                alt: c.title,
                                class: "product-image",
                                preview: false
                              }, null, 8, ["src", "alt"])]),
                              default: withCtx(() => [createVNode(_component_a_card_meta, {
                                title: c.title,
                                description: `By ${c.author}`
                              }, null, 8, ["title", "description"]), createVNode("div", {
                                class: "product-content"
                              }, [createVNode("div", {
                                class: "rating"
                              }, [createVNode(_component_a_rate, {
                                value: c.rating,
                                "allow-half": "",
                                disabled: "",
                                style: {
                                  "font-size": "14px"
                                }
                              }, null, 8, ["value"]), createVNode("span", {
                                class: "rating-count"
                              }, "(" + toDisplayString(c.ratingsCount.toLocaleString()) + ")", 1)]), createVNode("div", {
                                class: "product-meta"
                              }, toDisplayString(c.hours) + "h · " + toDisplayString(c.lectures) + " lectures · " + toDisplayString(c.level), 1), createVNode("div", {
                                class: "card-footer"
                              }, [createVNode(_component_a_typography_text, {
                                strong: "",
                                class: "product-price"
                              }, {
                                default: withCtx(() => [createTextVNode(toDisplayString(euro(c.price)), 1)]),
                                _: 2
                              }, 1024), createVNode(_component_a_button, {
                                type: "link",
                                size: "small",
                                onClick: withModifiers(($event) => addToCart(c), ["stop"]),
                                loading: unref(cartLoading),
                                disabled: isInCart(c.id)
                              }, {
                                default: withCtx(() => [createTextVNode(toDisplayString(isInCart(c.id) ? "In Cart" : "Add to cart"), 1)]),
                                _: 2
                              }, 1032, ["onClick", "loading", "disabled"])])]), renderSlot(_ctx.$slots, "card-extra", {
                                course: c
                              }, void 0, true)]),
                              _: 2
                            }, 1032, ["onClick"])];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]-->`);
                  } else {
                    return [(openBlock(true), createBlock(Fragment, null, renderList(paged.value, (c) => {
                      return openBlock(), createBlock(_component_a_col, {
                        key: c.id,
                        xs: 24,
                        sm: 12,
                        md: 8,
                        lg: 8,
                        xl: 6
                      }, {
                        default: withCtx(() => [createVNode(_component_a_card, {
                          hoverable: "",
                          class: "product-card",
                          onClick: ($event) => goCourse(c.id)
                        }, {
                          cover: withCtx(() => [createVNode(_component_a_image, {
                            src: c.image,
                            alt: c.title,
                            class: "product-image",
                            preview: false
                          }, null, 8, ["src", "alt"])]),
                          default: withCtx(() => [createVNode(_component_a_card_meta, {
                            title: c.title,
                            description: `By ${c.author}`
                          }, null, 8, ["title", "description"]), createVNode("div", {
                            class: "product-content"
                          }, [createVNode("div", {
                            class: "rating"
                          }, [createVNode(_component_a_rate, {
                            value: c.rating,
                            "allow-half": "",
                            disabled: "",
                            style: {
                              "font-size": "14px"
                            }
                          }, null, 8, ["value"]), createVNode("span", {
                            class: "rating-count"
                          }, "(" + toDisplayString(c.ratingsCount.toLocaleString()) + ")", 1)]), createVNode("div", {
                            class: "product-meta"
                          }, toDisplayString(c.hours) + "h · " + toDisplayString(c.lectures) + " lectures · " + toDisplayString(c.level), 1), createVNode("div", {
                            class: "card-footer"
                          }, [createVNode(_component_a_typography_text, {
                            strong: "",
                            class: "product-price"
                          }, {
                            default: withCtx(() => [createTextVNode(toDisplayString(euro(c.price)), 1)]),
                            _: 2
                          }, 1024), createVNode(_component_a_button, {
                            type: "link",
                            size: "small",
                            onClick: withModifiers(($event) => addToCart(c), ["stop"]),
                            loading: unref(cartLoading),
                            disabled: isInCart(c.id)
                          }, {
                            default: withCtx(() => [createTextVNode(toDisplayString(isInCart(c.id) ? "In Cart" : "Add to cart"), 1)]),
                            _: 2
                          }, 1032, ["onClick", "loading", "disabled"])])]), renderSlot(_ctx.$slots, "card-extra", {
                            course: c
                          }, void 0, true)]),
                          _: 2
                        }, 1032, ["onClick"])]),
                        _: 2
                      }, 1024);
                    }), 128))];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_component_a_list, {
                "item-layout": "vertical",
                "data-source": paged.value,
                renderItem: renderListItem,
                split: true
              }, null, _parent2, _scopeId));
            }
            _push2(`<div class="pagination" data-v-fb5d7a59${_scopeId}>`);
            _push2(ssrRenderComponent(_component_a_pagination, {
              current: page.value,
              "onUpdate:current": ($event) => page.value = $event,
              pageSize,
              total: filtered.value.length,
              "show-less-items": ""
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [viewMode.value === "grid" ? (openBlock(), createBlock(_component_a_row, {
              key: 0,
              gutter: [16, 16],
              class: "product-grid"
            }, {
              default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(paged.value, (c) => {
                return openBlock(), createBlock(_component_a_col, {
                  key: c.id,
                  xs: 24,
                  sm: 12,
                  md: 8,
                  lg: 8,
                  xl: 6
                }, {
                  default: withCtx(() => [createVNode(_component_a_card, {
                    hoverable: "",
                    class: "product-card",
                    onClick: ($event) => goCourse(c.id)
                  }, {
                    cover: withCtx(() => [createVNode(_component_a_image, {
                      src: c.image,
                      alt: c.title,
                      class: "product-image",
                      preview: false
                    }, null, 8, ["src", "alt"])]),
                    default: withCtx(() => [createVNode(_component_a_card_meta, {
                      title: c.title,
                      description: `By ${c.author}`
                    }, null, 8, ["title", "description"]), createVNode("div", {
                      class: "product-content"
                    }, [createVNode("div", {
                      class: "rating"
                    }, [createVNode(_component_a_rate, {
                      value: c.rating,
                      "allow-half": "",
                      disabled: "",
                      style: {
                        "font-size": "14px"
                      }
                    }, null, 8, ["value"]), createVNode("span", {
                      class: "rating-count"
                    }, "(" + toDisplayString(c.ratingsCount.toLocaleString()) + ")", 1)]), createVNode("div", {
                      class: "product-meta"
                    }, toDisplayString(c.hours) + "h · " + toDisplayString(c.lectures) + " lectures · " + toDisplayString(c.level), 1), createVNode("div", {
                      class: "card-footer"
                    }, [createVNode(_component_a_typography_text, {
                      strong: "",
                      class: "product-price"
                    }, {
                      default: withCtx(() => [createTextVNode(toDisplayString(euro(c.price)), 1)]),
                      _: 2
                    }, 1024), createVNode(_component_a_button, {
                      type: "link",
                      size: "small",
                      onClick: withModifiers(($event) => addToCart(c), ["stop"]),
                      loading: unref(cartLoading),
                      disabled: isInCart(c.id)
                    }, {
                      default: withCtx(() => [createTextVNode(toDisplayString(isInCart(c.id) ? "In Cart" : "Add to cart"), 1)]),
                      _: 2
                    }, 1032, ["onClick", "loading", "disabled"])])]), renderSlot(_ctx.$slots, "card-extra", {
                      course: c
                    }, void 0, true)]),
                    _: 2
                  }, 1032, ["onClick"])]),
                  _: 2
                }, 1024);
              }), 128))]),
              _: 2
            }, 1024)) : (openBlock(), createBlock(_component_a_list, {
              key: 1,
              "item-layout": "vertical",
              "data-source": paged.value,
              renderItem: renderListItem,
              split: true
            }, null, 8, ["data-source"])), createVNode("div", {
              class: "pagination"
            }, [createVNode(_component_a_pagination, {
              current: page.value,
              "onUpdate:current": ($event) => page.value = $event,
              pageSize,
              total: filtered.value.length,
              "show-less-items": ""
            }, null, 8, ["current", "onUpdate:current", "total"])])];
          }
        }),
        _: 3
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_a_drawer, {
        open: openFilters.value,
        "onUpdate:open": ($event) => openFilters.value = $event,
        title: "Filter Courses",
        placement: "left",
        width: 320
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$1, {
              minRating: minRating.value,
              "onUpdate:minRating": ($event) => minRating.value = $event,
              durationRange: durationRange.value,
              "onUpdate:durationRange": ($event) => durationRange.value = $event,
              levels: levels.value,
              "onUpdate:levels": ($event) => levels.value = $event,
              languages: languages.value,
              "onUpdate:languages": ($event) => languages.value = $event,
              onReset: resetFilters
            }, null, _parent2, _scopeId));
          } else {
            return [createVNode(_sfc_main$1, {
              minRating: minRating.value,
              "onUpdate:minRating": ($event) => minRating.value = $event,
              durationRange: durationRange.value,
              "onUpdate:durationRange": ($event) => durationRange.value = $event,
              levels: levels.value,
              "onUpdate:levels": ($event) => levels.value = $event,
              languages: languages.value,
              "onUpdate:languages": ($event) => languages.value = $event,
              onReset: resetFilters
            }, null, 8, ["minRating", "onUpdate:minRating", "durationRange", "onUpdate:durationRange", "levels", "onUpdate:levels", "languages", "onUpdate:languages"])];
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/courses-listing/nuxt/pages/courses-listing.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const coursesListing = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fb5d7a59"]]);

export { coursesListing as default };
//# sourceMappingURL=courses-listing-1hgwgFCu.mjs.map
