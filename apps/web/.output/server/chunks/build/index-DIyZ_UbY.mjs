import { defineComponent, ref, reactive, resolveComponent, mergeProps, withCtx, createTextVNode, createVNode, h, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { b as useRuntimeConfig } from './server.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const rows = ref([]);
    const cols = [
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Domain", dataIndex: "domain", key: "domain" },
      { title: "Actions", key: "act", customRender: ({ record }) => {
        return h("a", { href: `/institutions/${record.name.toLowerCase().replace(/\s+/g, "-")}/admin` }, "Open");
      } }
    ];
    const form = reactive({ name: "", domain: "", logoUrl: "" });
    const config = useRuntimeConfig();
    const baseUrl = config.public?.apiBase || "http://localhost:4000";
    async function list() {
      const r = await $fetch(`${baseUrl}/api/authentication/graphql`, {
        method: "POST",
        body: { query: "query{ institutions{ id name domain logoUrl } }" }
      });
      rows.value = r.data?.institutions ?? [];
    }
    async function create() {
      if (!form.name) return;
      await $fetch(`${baseUrl}/api/authentication/graphql`, {
        method: "POST",
        body: { query: "mutation($name:String!,$domain:String,$logoUrl:String){ createInstitution(name:$name,domain:$domain,logoUrl:$logoUrl){ id } }", variables: form }
      });
      await list();
      form.name = "";
      form.domain = "";
      form.logoUrl = "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_table = resolveComponent("a-table");
      _push(ssrRenderComponent(_component_a_layout, mergeProps({ class: "p-6" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_card, {
              title: "Institutions",
              bordered: false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="mb-4 flex gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_a_input, {
                    value: form.name,
                    "onUpdate:value": ($event) => form.name = $event,
                    placeholder: "Name",
                    style: { "max-width": "240px" }
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_input, {
                    value: form.domain,
                    "onUpdate:value": ($event) => form.domain = $event,
                    placeholder: "Domain (optional)",
                    style: { "max-width": "240px" }
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_input, {
                    value: form.logoUrl,
                    "onUpdate:value": ($event) => form.logoUrl = $event,
                    placeholder: "Logo URL (optional)",
                    style: { "max-width": "240px" }
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_button, {
                    type: "primary",
                    onClick: create
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Create`);
                      } else {
                        return [
                          createTextVNode("Create")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_component_a_table, {
                    "data-source": rows.value,
                    columns: cols,
                    "row-key": "id"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", { class: "mb-4 flex gap-2" }, [
                      createVNode(_component_a_input, {
                        value: form.name,
                        "onUpdate:value": ($event) => form.name = $event,
                        placeholder: "Name",
                        style: { "max-width": "240px" }
                      }, null, 8, ["value", "onUpdate:value"]),
                      createVNode(_component_a_input, {
                        value: form.domain,
                        "onUpdate:value": ($event) => form.domain = $event,
                        placeholder: "Domain (optional)",
                        style: { "max-width": "240px" }
                      }, null, 8, ["value", "onUpdate:value"]),
                      createVNode(_component_a_input, {
                        value: form.logoUrl,
                        "onUpdate:value": ($event) => form.logoUrl = $event,
                        placeholder: "Logo URL (optional)",
                        style: { "max-width": "240px" }
                      }, null, 8, ["value", "onUpdate:value"]),
                      createVNode(_component_a_button, {
                        type: "primary",
                        onClick: create
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Create")
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(_component_a_table, {
                      "data-source": rows.value,
                      columns: cols,
                      "row-key": "id"
                    }, null, 8, ["data-source"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_card, {
                title: "Institutions",
                bordered: false
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "mb-4 flex gap-2" }, [
                    createVNode(_component_a_input, {
                      value: form.name,
                      "onUpdate:value": ($event) => form.name = $event,
                      placeholder: "Name",
                      style: { "max-width": "240px" }
                    }, null, 8, ["value", "onUpdate:value"]),
                    createVNode(_component_a_input, {
                      value: form.domain,
                      "onUpdate:value": ($event) => form.domain = $event,
                      placeholder: "Domain (optional)",
                      style: { "max-width": "240px" }
                    }, null, 8, ["value", "onUpdate:value"]),
                    createVNode(_component_a_input, {
                      value: form.logoUrl,
                      "onUpdate:value": ($event) => form.logoUrl = $event,
                      placeholder: "Logo URL (optional)",
                      style: { "max-width": "240px" }
                    }, null, 8, ["value", "onUpdate:value"]),
                    createVNode(_component_a_button, {
                      type: "primary",
                      onClick: create
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Create")
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode(_component_a_table, {
                    "data-source": rows.value,
                    columns: cols,
                    "row-key": "id"
                  }, null, 8, ["data-source"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/teach-internal/nuxt/pages/institutions/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DIyZ_UbY.mjs.map
