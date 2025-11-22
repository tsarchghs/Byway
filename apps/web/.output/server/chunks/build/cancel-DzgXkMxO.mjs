import { resolveComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
import 'vue-router';
import '@apollo/client/core/index.js';
import '@apollo/client/link/context/index.js';
import '@vue/apollo-composable';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_a_button = resolveComponent("a-button");
  _push(`<div${ssrRenderAttrs(mergeProps({ style: { "max-width": "600px", "margin": "40px auto", "text-align": "center" } }, _attrs))}><h2>Payment cancelled</h2><p>Your cart is still saved if you want to try again.</p>`);
  _push(ssrRenderComponent(_component_a_button, {
    onClick: ($event) => _ctx.$router.push("/")
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Back to Home`);
      } else {
        return [
          createTextVNode("Back to Home")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/ecommerce/nuxt/pages/checkout/cancel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cancel = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { cancel as default };
//# sourceMappingURL=cancel-DzgXkMxO.mjs.map
