import { defineComponent, ref, resolveComponent, mergeProps, withCtx, unref, h, createVNode, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './StudentsNav-xlfyhLgm.mjs';
import { u as useAuth } from './useAuth-B8D9e8en.mjs';
import { _ as _export_sfc, d as useRoute, u as useRouter } from './server.mjs';
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
  __name: "enrollments",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    const router = useRouter();
    useAuth();
    const loading = ref(true);
    const rows = ref([]);
    const cols = [
      { title: "Course", dataIndex: "courseTitle", key: "courseTitle" },
      { title: "Progress", key: "progress", customRender: ({ record }) => (record.progressPct || 0) + "%" },
      { title: "Updated", dataIndex: "updatedAt" },
      {
        title: "Actions",
        key: "actions",
        customRender: ({ record }) => h("a", { onClick: () => goToCourse(record) }, "Open")
      }
    ];
    function goToCourse(row) {
      if (row.firstModuleId) {
        router.push(`/student/_/course/${encodeURIComponent(row.courseId)}/module/${encodeURIComponent(row.firstModuleId)}`);
      } else {
        router.push(`/course/${encodeURIComponent(row.courseId)}`);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_table = resolveComponent("a-table");
      _push(ssrRenderComponent(_component_a_layout, mergeProps({ class: "p-6" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$1, { subtitle: "My Enrollments" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_card, {
              loading: unref(loading),
              bordered: false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_table, {
                    "data-source": unref(rows),
                    columns: cols,
                    "row-key": "id"
                  }, null, _parent3, _scopeId2));
                  if (!unref(loading) && !unref(rows).length) {
                    _push3(`<div class="muted mt-2" data-v-1e74c2a4${_scopeId2}>No enrollments yet.</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode(_component_a_table, {
                      "data-source": unref(rows),
                      columns: cols,
                      "row-key": "id"
                    }, null, 8, ["data-source"]),
                    !unref(loading) && !unref(rows).length ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "muted mt-2"
                    }, "No enrollments yet.")) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$1, { subtitle: "My Enrollments" }),
              createVNode(_component_a_card, {
                loading: unref(loading),
                bordered: false
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_table, {
                    "data-source": unref(rows),
                    columns: cols,
                    "row-key": "id"
                  }, null, 8, ["data-source"]),
                  !unref(loading) && !unref(rows).length ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "muted mt-2"
                  }, "No enrollments yet.")) : createCommentVNode("", true)
                ]),
                _: 1
              }, 8, ["loading"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/students-internal/nuxt/pages/enrollments.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const enrollments = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1e74c2a4"]]);

export { enrollments as default };
//# sourceMappingURL=enrollments-D4v10QnY.mjs.map
