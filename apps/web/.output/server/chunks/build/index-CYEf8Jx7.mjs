import { defineComponent, ref, computed, resolveComponent, mergeProps, withCtx, createTextVNode, createVNode, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { message } from 'ant-design-vue';
import { _ as _export_sfc, b as useRuntimeConfig } from './server.mjs';
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
    const runtime = useRuntimeConfig();
    const apiBase = runtime.public?.apiBase || runtime.public?.appBaseUrl || "";
    const loading = ref(true);
    const meId = ref(null);
    const q = ref("");
    const rows = ref([]);
    function resolveAuthHeader() {
      return null;
    }
    async function load() {
      loading.value = true;
      try {
        const auth = resolveAuthHeader();
        if (!auth) throw new Error("Missing auth token");
        const baseUrl = apiBase ? apiBase.replace(/\/$/, "") : "";
        const meResp = await fetch(`${baseUrl}/api/authentication/graphql`, { method: "POST", headers: { "content-type": "application/json", Authorization: auth }, body: JSON.stringify({ query: `query Me { me { id } }` }) });
        const meJson = await meResp.json().catch(() => null);
        meId.value = meJson?.data?.me?.id || null;
        const query = `query { institutions { id name slug type location active createdAt updatedAt } }`;
        const resp = await fetch(`${baseUrl}/api/institutions/graphql`, { method: "POST", headers: { "content-type": "application/json", Authorization: auth }, body: JSON.stringify({ query }) });
        if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`));
        const json = await resp.json();
        rows.value = Array.isArray(json?.data?.institutions) ? json.data.institutions : [];
        if (meId.value) await checkMembershipAndRedirect(auth, baseUrl);
      } catch (e) {
        message.error(e?.message || "Failed to load institutions");
      } finally {
        loading.value = false;
      }
    }
    const filtered = computed(() => rows.value.filter((r) => q.value ? String(r.name).toLowerCase().includes(q.value.toLowerCase()) || String(r.slug).toLowerCase().includes(q.value.toLowerCase()) : true));
    async function join(id) {
      try {
        const auth = resolveAuthHeader();
        if (!auth) throw new Error("Missing auth token");
        const baseUrl = apiBase ? apiBase.replace(/\/$/, "") : "";
        const resp = await fetch(`${baseUrl}/api/institution-portal/institutions/${encodeURIComponent(id)}/join`, { method: "POST", headers: { Authorization: auth } });
        if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`));
        message.success("Joined institution");
        (void 0).location.href = `/institution/portal?institutionId=${encodeURIComponent(id)}`;
      } catch (e) {
        message.error(e?.message || "Join failed");
      }
    }
    const columns = [
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Slug", dataIndex: "slug", key: "slug" },
      { title: "Type", dataIndex: "type", key: "type" },
      { title: "Location", dataIndex: "location", key: "location" },
      { title: "Actions", key: "actions" }
    ];
    async function checkMembershipAndRedirect(auth, baseUrl) {
      try {
        for (const inst of rows.value) {
          const resp = await fetch(`${baseUrl}/api/institutions/graphql`, { method: "POST", headers: { "content-type": "application/json", Authorization: auth }, body: JSON.stringify({ query: `query($institutionId:String!){ members(institutionId:$institutionId){ userId } }`, variables: { institutionId: inst.id } }) });
          const json = await resp.json().catch(() => null);
          const members = Array.isArray(json?.data?.members) ? json.data.members : [];
          if (members.find((m) => m.userId === meId.value)) {
            (void 0).location.href = `/institution/portal?institutionId=${encodeURIComponent(inst.id)}`;
            return;
          }
        }
      } catch {
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_skeleton = resolveComponent("a-skeleton");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_table = resolveComponent("a-table");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "join-institution" }, _attrs))} data-v-a0474eb0>`);
      _push(ssrRenderComponent(_component_a_page_header, { title: "Join Institution" }, {
        extra: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_space, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_input, {
                    value: q.value,
                    "onUpdate:value": ($event) => q.value = $event,
                    placeholder: "Search institutions",
                    style: { "width": "240px" }
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_button, {
                    size: "small",
                    onClick: load
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Reload`);
                      } else {
                        return [
                          createTextVNode("Reload")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_input, {
                      value: q.value,
                      "onUpdate:value": ($event) => q.value = $event,
                      placeholder: "Search institutions",
                      style: { "width": "240px" }
                    }, null, 8, ["value", "onUpdate:value"]),
                    createVNode(_component_a_button, {
                      size: "small",
                      onClick: load
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Reload")
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
              createVNode(_component_a_space, null, {
                default: withCtx(() => [
                  createVNode(_component_a_input, {
                    value: q.value,
                    "onUpdate:value": ($event) => q.value = $event,
                    placeholder: "Search institutions",
                    style: { "width": "240px" }
                  }, null, 8, ["value", "onUpdate:value"]),
                  createVNode(_component_a_button, {
                    size: "small",
                    onClick: load
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Reload")
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
      _push(ssrRenderComponent(_component_a_skeleton, {
        loading: loading.value,
        active: "",
        paragraph: { rows: 6 }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_card, { size: "small" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_table, {
                    size: "small",
                    columns,
                    dataSource: filtered.value,
                    "row-key": "id"
                  }, {
                    bodyCell: withCtx(({ column, record }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (column.key === "actions") {
                          _push4(ssrRenderComponent(_component_a_button, {
                            type: "link",
                            onClick: ($event) => join(record.id)
                          }, {
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Join`);
                              } else {
                                return [
                                  createTextVNode("Join")
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          column.key === "actions" ? (openBlock(), createBlock(_component_a_button, {
                            key: 0,
                            type: "link",
                            onClick: ($event) => join(record.id)
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Join")
                            ]),
                            _: 1
                          }, 8, ["onClick"])) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_table, {
                      size: "small",
                      columns,
                      dataSource: filtered.value,
                      "row-key": "id"
                    }, {
                      bodyCell: withCtx(({ column, record }) => [
                        column.key === "actions" ? (openBlock(), createBlock(_component_a_button, {
                          key: 0,
                          type: "link",
                          onClick: ($event) => join(record.id)
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Join")
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : createCommentVNode("", true)
                      ]),
                      _: 1
                    }, 8, ["dataSource"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_card, { size: "small" }, {
                default: withCtx(() => [
                  createVNode(_component_a_table, {
                    size: "small",
                    columns,
                    dataSource: filtered.value,
                    "row-key": "id"
                  }, {
                    bodyCell: withCtx(({ column, record }) => [
                      column.key === "actions" ? (openBlock(), createBlock(_component_a_button, {
                        key: 0,
                        type: "link",
                        onClick: ($event) => join(record.id)
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Join")
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : createCommentVNode("", true)
                    ]),
                    _: 1
                  }, 8, ["dataSource"])
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/institution-portal/nuxt/pages/join/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a0474eb0"]]);

export { index as default };
//# sourceMappingURL=index-CYEf8Jx7.mjs.map
