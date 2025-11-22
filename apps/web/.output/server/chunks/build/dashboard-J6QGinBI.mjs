import { defineComponent, ref, reactive, resolveComponent, mergeProps, withCtx, unref, isRef, createTextVNode, createVNode, toDisplayString, h, createBlock, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { d as useRoute, b as useRuntimeConfig } from './server.mjs';
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
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const config = useRuntimeConfig();
    const baseUrl = config.public?.apiBase || "http://localhost:4000";
    const courseId = ref("");
    const rows = ref([]);
    const recentSubs = ref([]);
    const stats = reactive({ classrooms: 0, assignments: 0, submissions: 0, enrollments: 0 });
    const cols = [
      { title: "Classroom", dataIndex: "name", key: "name" },
      { title: "Assignments", dataIndex: "assignmentsCount", key: "assignmentsCount" },
      { title: "Submissions", dataIndex: "submissionsCount", key: "submissionsCount" },
      { title: "Enrollments", dataIndex: "enrollments", key: "enrollments" },
      { title: "Actions", key: "act", customRender: ({ record }) => h("div", {}, [
        h("a", { href: `/institutions/${route.params.slug}/assignments/${record.latestAssignmentId}/grading` }, "Grade latest"),
        h("span", " · "),
        h("a", { onClick: () => exportGradebook(record.id) }, "Export gradebook")
      ]) }
    ];
    const sCols = [
      { title: "Assignment", dataIndex: "assignmentId", key: "assignmentId" },
      { title: "Student", dataIndex: "studentId", key: "studentId" },
      { title: "File", dataIndex: "fileUrl", key: "fileUrl" },
      { title: "Grade", dataIndex: "grade", key: "grade" }
    ];
    async function load() {
      rows.value = [];
      recentSubs.value = [];
      stats.classrooms = stats.assignments = stats.submissions = stats.enrollments = 0;
      const q1 = "query($courseId:String,$institutionId:String){ classroomsByCourse(courseId:$courseId, institutionId:$institutionId){ id name } }";
      const cls = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: "POST", body: { query: q1, variables: { courseId: courseId.value || "ANY", institutionId: String(route.params.slug) } } }).catch(() => null);
      const classrooms = cls?.data?.classroomsByCourse ?? [];
      for (const c of classrooms) {
        const qA = "query($classroomId:String!){ assignmentsByClassroom(classroomId:$classroomId){ id } }";
        const rA = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: "POST", body: { query: qA, variables: { classroomId: c.id } } });
        const assignments = rA?.data?.assignmentsByClassroom ?? [];
        const assignmentsCount = assignments.length;
        let submissionsCount = 0;
        let latestAssignmentId = assignments[0]?.id || "";
        for (const a of assignments) {
          const qS = "query($assignmentId:String!){ submissionsByAssignment(assignmentId:$assignmentId){ id studentId fileUrl grade } }";
          const rS = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: "POST", body: { query: qS, variables: { assignmentId: a.id } } });
          const subs = rS?.data?.submissionsByAssignment ?? [];
          submissionsCount += subs.length;
          if (subs.length > 0) {
            recentSubs.value.push(...subs.slice(0, 3).map((s) => ({ ...s, assignmentId: a.id })));
            latestAssignmentId = a.id;
          }
        }
        const qE = "query($classroomId:String!){ enrollmentCountByClassroom(classroomId:$classroomId) }";
        const rE = await $fetch(`${baseUrl}/api/students-internal/graphql`, { method: "POST", body: { query: qE, variables: { classroomId: c.id } } });
        const enrollments = rE?.data?.enrollmentCountByClassroom ?? 0;
        rows.value.push({ id: c.id, name: c.name, assignmentsCount, submissionsCount, enrollments, latestAssignmentId });
        stats.classrooms++;
        stats.assignments += assignmentsCount;
        stats.submissions += submissionsCount;
        stats.enrollments += enrollments;
      }
    }
    const theme = reactive({ primaryColor: "", bannerUrl: "" });
    const userId = ref("");
    const allowed = ref(null);
    async function checkRoles() {
      if (!userId.value) {
        allowed.value = null;
        return;
      }
      const q = "query($userId:String!,$institutionId:String!,$role:String!){ hasRole(userId:$userId,institutionId:$institutionId,role:$role) }";
      const r = await $fetch(`${baseUrl}/api/authentication/graphql`, { method: "POST", body: { query: q, variables: { userId: userId.value, institutionId: String(route.params.slug), role: "Admin" } } });
      allowed.value = !!r?.data?.hasRole;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_alert = resolveComponent("a-alert");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_divider = resolveComponent("a-divider");
      _push(ssrRenderComponent(_component_a_layout, mergeProps({ class: "p-6" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_card, {
              title: `Dashboard · ${unref(route).params.slug}`,
              headStyle: unref(theme).primaryColor ? { background: unref(theme).primaryColor, color: "#fff" } : {},
              bordered: false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="mb-4 flex flex-wrap gap-2 items-center"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_a_input, {
                    value: unref(userId),
                    "onUpdate:value": ($event) => isRef(userId) ? userId.value = $event : null,
                    placeholder: "Your userId (for roles)",
                    style: { "max-width": "260px" }
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_button, { onClick: checkRoles }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Check Access`);
                      } else {
                        return [
                          createTextVNode("Check Access")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_input, {
                    value: unref(courseId),
                    "onUpdate:value": ($event) => isRef(courseId) ? courseId.value = $event : null,
                    placeholder: "Course ID filter (optional)",
                    style: { "max-width": "260px" }
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_button, { onClick: load }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Load`);
                      } else {
                        return [
                          createTextVNode("Load")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="grid md:grid-cols-4 gap-3 mb-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_a_card, {
                    size: "small",
                    title: "Classrooms"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-2xl"${_scopeId3}>${ssrInterpolate(unref(stats).classrooms)}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-2xl" }, toDisplayString(unref(stats).classrooms), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_card, {
                    size: "small",
                    title: "Assignments"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-2xl"${_scopeId3}>${ssrInterpolate(unref(stats).assignments)}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-2xl" }, toDisplayString(unref(stats).assignments), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_card, {
                    size: "small",
                    title: "Submissions"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-2xl"${_scopeId3}>${ssrInterpolate(unref(stats).submissions)}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-2xl" }, toDisplayString(unref(stats).submissions), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_card, {
                    size: "small",
                    title: "Enrollments (total)"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-2xl"${_scopeId3}>${ssrInterpolate(unref(stats).enrollments)}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-2xl" }, toDisplayString(unref(stats).enrollments), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  if (unref(allowed) === false) {
                    _push3(ssrRenderComponent(_component_a_alert, {
                      type: "warning",
                      message: "Access denied: Admin role required",
                      "show-icon": "",
                      class: "mb-3"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(ssrRenderComponent(_component_a_table, {
                      "data-source": unref(rows),
                      columns: cols,
                      "row-key": "id"
                    }, null, _parent3, _scopeId2));
                  }
                  _push3(ssrRenderComponent(_component_a_divider, null, null, _parent3, _scopeId2));
                  _push3(`<h3${_scopeId2}>Recent Submissions</h3>`);
                  _push3(ssrRenderComponent(_component_a_table, {
                    "data-source": unref(recentSubs),
                    columns: sCols,
                    "row-key": "id"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", { class: "mb-4 flex flex-wrap gap-2 items-center" }, [
                      createVNode(_component_a_input, {
                        value: unref(userId),
                        "onUpdate:value": ($event) => isRef(userId) ? userId.value = $event : null,
                        placeholder: "Your userId (for roles)",
                        style: { "max-width": "260px" }
                      }, null, 8, ["value", "onUpdate:value"]),
                      createVNode(_component_a_button, { onClick: checkRoles }, {
                        default: withCtx(() => [
                          createTextVNode("Check Access")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_input, {
                        value: unref(courseId),
                        "onUpdate:value": ($event) => isRef(courseId) ? courseId.value = $event : null,
                        placeholder: "Course ID filter (optional)",
                        style: { "max-width": "260px" }
                      }, null, 8, ["value", "onUpdate:value"]),
                      createVNode(_component_a_button, { onClick: load }, {
                        default: withCtx(() => [
                          createTextVNode("Load")
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "grid md:grid-cols-4 gap-3 mb-4" }, [
                      createVNode(_component_a_card, {
                        size: "small",
                        title: "Classrooms"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-2xl" }, toDisplayString(unref(stats).classrooms), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_card, {
                        size: "small",
                        title: "Assignments"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-2xl" }, toDisplayString(unref(stats).assignments), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_card, {
                        size: "small",
                        title: "Submissions"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-2xl" }, toDisplayString(unref(stats).submissions), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_card, {
                        size: "small",
                        title: "Enrollments (total)"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-2xl" }, toDisplayString(unref(stats).enrollments), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    unref(allowed) === false ? (openBlock(), createBlock(_component_a_alert, {
                      key: 0,
                      type: "warning",
                      message: "Access denied: Admin role required",
                      "show-icon": "",
                      class: "mb-3"
                    })) : (openBlock(), createBlock(_component_a_table, {
                      key: 1,
                      "data-source": unref(rows),
                      columns: cols,
                      "row-key": "id"
                    }, null, 8, ["data-source"])),
                    createVNode(_component_a_divider),
                    createVNode("h3", null, "Recent Submissions"),
                    createVNode(_component_a_table, {
                      "data-source": unref(recentSubs),
                      columns: sCols,
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
                title: `Dashboard · ${unref(route).params.slug}`,
                headStyle: unref(theme).primaryColor ? { background: unref(theme).primaryColor, color: "#fff" } : {},
                bordered: false
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "mb-4 flex flex-wrap gap-2 items-center" }, [
                    createVNode(_component_a_input, {
                      value: unref(userId),
                      "onUpdate:value": ($event) => isRef(userId) ? userId.value = $event : null,
                      placeholder: "Your userId (for roles)",
                      style: { "max-width": "260px" }
                    }, null, 8, ["value", "onUpdate:value"]),
                    createVNode(_component_a_button, { onClick: checkRoles }, {
                      default: withCtx(() => [
                        createTextVNode("Check Access")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_input, {
                      value: unref(courseId),
                      "onUpdate:value": ($event) => isRef(courseId) ? courseId.value = $event : null,
                      placeholder: "Course ID filter (optional)",
                      style: { "max-width": "260px" }
                    }, null, 8, ["value", "onUpdate:value"]),
                    createVNode(_component_a_button, { onClick: load }, {
                      default: withCtx(() => [
                        createTextVNode("Load")
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode("div", { class: "grid md:grid-cols-4 gap-3 mb-4" }, [
                    createVNode(_component_a_card, {
                      size: "small",
                      title: "Classrooms"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "text-2xl" }, toDisplayString(unref(stats).classrooms), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_card, {
                      size: "small",
                      title: "Assignments"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "text-2xl" }, toDisplayString(unref(stats).assignments), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_card, {
                      size: "small",
                      title: "Submissions"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "text-2xl" }, toDisplayString(unref(stats).submissions), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_card, {
                      size: "small",
                      title: "Enrollments (total)"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "text-2xl" }, toDisplayString(unref(stats).enrollments), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  unref(allowed) === false ? (openBlock(), createBlock(_component_a_alert, {
                    key: 0,
                    type: "warning",
                    message: "Access denied: Admin role required",
                    "show-icon": "",
                    class: "mb-3"
                  })) : (openBlock(), createBlock(_component_a_table, {
                    key: 1,
                    "data-source": unref(rows),
                    columns: cols,
                    "row-key": "id"
                  }, null, 8, ["data-source"])),
                  createVNode(_component_a_divider),
                  createVNode("h3", null, "Recent Submissions"),
                  createVNode(_component_a_table, {
                    "data-source": unref(recentSubs),
                    columns: sCols,
                    "row-key": "id"
                  }, null, 8, ["data-source"])
                ]),
                _: 1
              }, 8, ["title", "headStyle"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/teach-internal/nuxt/pages/institutions/[slug]/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-J6QGinBI.mjs.map
