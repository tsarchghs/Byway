import { defineComponent, ref, resolveComponent, mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { d as useRoute, u as useRouter } from './server.mjs';
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
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    route.params.slug;
    const inst = ref(null);
    const classrooms = ref([]);
    const loading = ref(true);
    const cols = [
      { title: "Name", dataIndex: "name" },
      { title: "Code", dataIndex: "code" }
    ];
    const goBack = () => router.push("/institutions");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_table = resolveComponent("a-table");
      _push(ssrRenderComponent(_component_a_layout, mergeProps({ class: "p-6" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_page_header, {
              title: inst.value?.name || "Institution",
              onBack: goBack
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_card, {
              class: "mt-4",
              bordered: false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_typography_title, { level: 5 }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Classrooms`);
                      } else {
                        return [
                          createTextVNode("Classrooms")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_table, {
                    "data-source": classrooms.value,
                    columns: cols,
                    "row-key": "id",
                    size: "small",
                    loading: loading.value
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_typography_title, { level: 5 }, {
                      default: withCtx(() => [
                        createTextVNode("Classrooms")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_table, {
                      "data-source": classrooms.value,
                      columns: cols,
                      "row-key": "id",
                      size: "small",
                      loading: loading.value
                    }, null, 8, ["data-source", "loading"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_page_header, {
                title: inst.value?.name || "Institution",
                onBack: goBack
              }, null, 8, ["title"]),
              createVNode(_component_a_card, {
                class: "mt-4",
                bordered: false
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_typography_title, { level: 5 }, {
                    default: withCtx(() => [
                      createTextVNode("Classrooms")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_table, {
                    "data-source": classrooms.value,
                    columns: cols,
                    "row-key": "id",
                    size: "small",
                    loading: loading.value
                  }, null, 8, ["data-source", "loading"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/institutions/nuxt/pages/institutions/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-CRzYgNPB.mjs.map
