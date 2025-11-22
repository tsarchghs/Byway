import { defineComponent, ref, computed, resolveComponent, mergeProps, withCtx, createTextVNode, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useCart } from './useCart-7pxN526Z.mjs';
import { u as useAuth } from './useAuth-B8D9e8en.mjs';
import { _ as _export_sfc, d as useRoute, u as useRouter, b as useRuntimeConfig } from './server.mjs';
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
  __name: "success",
  __ssrInlineRender: true,
  setup(__props) {
    const state = ref("checking");
    useRoute();
    const router = useRouter();
    useCart();
    useAuth();
    const startLink = ref(null);
    const starting = ref(false);
    ref(null);
    const config = useRuntimeConfig();
    config.public?.apiBase || "http://localhost:4000";
    const title = computed(() => {
      if (state.value === "ok") return "Payment successful 🎉";
      if (state.value === "failed") return "We could not confirm your payment";
      return "Finalizing your enrollment…";
    });
    const subtitle = computed(() => {
      if (state.value === "ok") return "You have access to your course. Keep learning!";
      if (state.value === "failed") return "If you were charged, refresh in a moment or contact support.";
      return "We are verifying your payment and enrolling you now.";
    });
    function startCourse() {
      if (!startLink.value) return;
      starting.value = true;
      router.push(startLink.value);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_space = resolveComponent("a-space");
      const _component_a_button = resolveComponent("a-button");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "checkout-success" }, _attrs))} data-v-e78ec752><h2 data-v-e78ec752>${ssrInterpolate(title.value)}</h2><p class="subtitle" data-v-e78ec752>${ssrInterpolate(subtitle.value)}</p>`);
      _push(ssrRenderComponent(_component_a_space, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_button, {
              type: "primary",
              loading: starting.value,
              disabled: !startLink.value,
              onClick: startCourse
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Start learning `);
                } else {
                  return [
                    createTextVNode(" Start learning ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_button, {
              onClick: ($event) => unref(router).push("/students/my-courses")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Go to My Courses`);
                } else {
                  return [
                    createTextVNode("Go to My Courses")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_button, {
              onClick: ($event) => unref(router).push("/categories")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Browse courses`);
                } else {
                  return [
                    createTextVNode("Browse courses")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_button, {
                type: "primary",
                loading: starting.value,
                disabled: !startLink.value,
                onClick: startCourse
              }, {
                default: withCtx(() => [
                  createTextVNode(" Start learning ")
                ]),
                _: 1
              }, 8, ["loading", "disabled"]),
              createVNode(_component_a_button, {
                onClick: ($event) => unref(router).push("/students/my-courses")
              }, {
                default: withCtx(() => [
                  createTextVNode("Go to My Courses")
                ]),
                _: 1
              }, 8, ["onClick"]),
              createVNode(_component_a_button, {
                onClick: ($event) => unref(router).push("/categories")
              }, {
                default: withCtx(() => [
                  createTextVNode("Browse courses")
                ]),
                _: 1
              }, 8, ["onClick"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/ecommerce/nuxt/pages/checkout/success.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const success = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e78ec752"]]);

export { success as default };
//# sourceMappingURL=success-XI4kE9lr.mjs.map
