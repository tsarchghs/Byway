import { defineComponent, ref, computed, resolveComponent, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
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
  __name: "teach-course-gradebook",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const loading = ref(false);
    const rows = ref([]);
    const teacherId = computed(() => route.params.teacher_id);
    const courseId = computed(() => route.params.course_id);
    const cols = [
      { title: "Student", dataIndex: "studentDisplayName", key: "studentDisplayName" },
      { title: "Course", dataIndex: "courseTitle", key: "courseTitle" },
      { title: "Assignment", dataIndex: "assignmentTitle", key: "assignmentTitle" },
      {
        title: "Score",
        key: "score",
        customRender: ({ record }) => {
          if (record.score == null || record.maxScore == null) return "–";
          return `${record.score} / ${record.maxScore}`;
        }
      },
      {
        title: "Percentage",
        key: "percentage",
        customRender: ({ record }) => {
          if (record.percentage == null) return "–";
          return record.percentage.toFixed(1) + "%";
        }
      },
      { title: "Letter", dataIndex: "letter", key: "letter" },
      { title: "Updated at", dataIndex: "updatedAt", key: "updatedAt" }
    ];
    function goBack() {
      const fallback = `/teach-internal/${teacherId.value}/course/${courseId.value}`;
      if (router) {
        router.push(fallback);
      } else if (history.length > 1) {
        history.back();
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_table = resolveComponent("a-table");
      _push(ssrRenderComponent(_component_a_layout, mergeProps({ class: "p-6" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_page_header, {
              title: `Gradebook · ${courseId.value}`,
              "sub-title": "Teacher view of all students in this course",
              onBack: goBack
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_card, {
              class: "mt-4",
              bordered: false
            }, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Course gradebook `);
                } else {
                  return [
                    createTextVNode(" Course gradebook ")
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_table, {
                    "data-source": rows.value,
                    columns: cols,
                    "row-key": "id",
                    size: "small",
                    loading: loading.value
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_table, {
                      "data-source": rows.value,
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
                title: `Gradebook · ${courseId.value}`,
                "sub-title": "Teacher view of all students in this course",
                onBack: goBack
              }, null, 8, ["title"]),
              createVNode(_component_a_card, {
                class: "mt-4",
                bordered: false
              }, {
                title: withCtx(() => [
                  createTextVNode(" Course gradebook ")
                ]),
                default: withCtx(() => [
                  createVNode(_component_a_table, {
                    "data-source": rows.value,
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/gradebook/nuxt/pages/teach-course-gradebook.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=teach-course-gradebook-BHxrDRLr.mjs.map
