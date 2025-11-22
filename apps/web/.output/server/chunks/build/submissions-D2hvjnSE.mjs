import { defineComponent, ref, computed, resolveComponent, mergeProps, withCtx, createVNode, createBlock, createCommentVNode, createTextVNode, toDisplayString, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { message } from 'ant-design-vue';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "submissions",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(false);
    const items = ref([]);
    ref({});
    const drawerOpen = ref(false);
    const drawerLoading = ref(false);
    const activeSessionId = ref(null);
    const activeSession = ref(null);
    const columns = computed(() => {
      const challengeSet = /* @__PURE__ */ new Set();
      const statusSet = /* @__PURE__ */ new Set();
      items.value.forEach((row) => {
        if (row.challengeTitle) challengeSet.add(row.challengeTitle);
        if (row.status) statusSet.add(row.status);
      });
      const challengeFilters = Array.from(challengeSet).map((label) => ({
        text: label,
        value: label
      }));
      const statusFilters = Array.from(statusSet).map((label) => ({
        text: label,
        value: label
      }));
      return [
        {
          title: "Challenge",
          dataIndex: "challengeTitle",
          key: "challengeTitle",
          filters: challengeFilters,
          onFilter: (value, record) => record.challengeTitle === value
        },
        {
          title: "Student",
          dataIndex: "sessionUserId",
          key: "student"
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          filters: statusFilters,
          onFilter: (value, record) => record.status === value
        },
        {
          title: "Grade %",
          dataIndex: "gradePct",
          key: "gradePct"
        },
        {
          title: "Difficulty",
          dataIndex: "difficulty",
          key: "difficulty"
        },
        {
          title: "Bindings",
          dataIndex: "bindings",
          key: "bindings"
        },
        {
          title: "Submitted",
          dataIndex: "createdAtFormatted",
          key: "createdAt"
        }
      ];
    });
    async function handleRowClick(record) {
      if (!record?.sessionId) return;
      activeSessionId.value = record.sessionId;
      drawerOpen.value = true;
      drawerLoading.value = true;
      activeSession.value = null;
      try {
        const res = await fetch(`/api/teacher-course-lab/teacher/submissions/session/${record.sessionId}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Failed to load session history");
        }
        const session = data.session;
        if (session) {
          session.submissions = (session.submissions || []).map((sub) => ({
            ...sub,
            createdAtFormatted: sub.createdAt ? new Date(sub.createdAt).toLocaleString() : "",
            updatedAtFormatted: sub.updatedAt ? new Date(sub.updatedAt).toLocaleString() : ""
          }));
        }
        activeSession.value = session;
      } catch (e) {
        console.error(e);
        message.error(e?.message || "Failed to load session history");
      } finally {
        drawerLoading.value = false;
      }
    }
    const drawerTitle = computed(() => {
      if (!activeSession.value) return "Submission history";
      return `Submission history · ${activeSession.value.challenge?.title || "Challenge"} · Student ${activeSession.value.userId}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_alert = resolveComponent("a-alert");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_drawer = resolveComponent("a-drawer");
      const _component_a_spin = resolveComponent("a-spin");
      const _component_a_timeline = resolveComponent("a-timeline");
      const _component_a_timeline_item = resolveComponent("a-timeline-item");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_a_page_header, {
        title: "Teacher • Lab Submissions",
        "sub-title": "Review student attempts, grades, and course bindings for your challenges"
      }, null, _parent));
      _push(ssrRenderComponent(_component_a_card, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_alert, {
              type: "info",
              "show-icon": "",
              class: "mb-3",
              message: "Tip",
              description: "Click any row to see the full submission history for that lab session, including all attempts and feedback."
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_table, {
              columns: columns.value,
              "data-source": items.value,
              loading: loading.value,
              "row-key": "id",
              size: "small",
              customRow: (record) => ({ onClick: () => handleRowClick(record) })
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_alert, {
                type: "info",
                "show-icon": "",
                class: "mb-3",
                message: "Tip",
                description: "Click any row to see the full submission history for that lab session, including all attempts and feedback."
              }),
              createVNode(_component_a_table, {
                columns: columns.value,
                "data-source": items.value,
                loading: loading.value,
                "row-key": "id",
                size: "small",
                customRow: (record) => ({ onClick: () => handleRowClick(record) })
              }, null, 8, ["columns", "data-source", "loading", "customRow"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_drawer, {
        open: drawerOpen.value,
        "onUpdate:open": ($event) => drawerOpen.value = $event,
        width: 480,
        title: drawerTitle.value,
        destroyOnClose: true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_spin, { spinning: drawerLoading.value }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (activeSession.value) {
                    _push3(`<div${_scopeId2}><div class="mb-3 text-sm text-gray-700"${_scopeId2}><div${_scopeId2}><strong${_scopeId2}>Challenge:</strong> ${ssrInterpolate(activeSession.value.challenge?.title)}</div><div${_scopeId2}><strong${_scopeId2}>Student:</strong> ${ssrInterpolate(activeSession.value.userId)}</div><div${_scopeId2}><strong${_scopeId2}>Bindings:</strong>`);
                    if (activeSession.value.challenge?.courseId) {
                      _push3(`<span${_scopeId2}>Course ${ssrInterpolate(activeSession.value.challenge.courseId)}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (activeSession.value.challenge?.moduleId) {
                      _push3(`<span${_scopeId2}> · Module ${ssrInterpolate(activeSession.value.challenge.moduleId)}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (activeSession.value.challenge?.lessonId) {
                      _push3(`<span${_scopeId2}> · Lesson ${ssrInterpolate(activeSession.value.challenge.lessonId)}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div></div>`);
                    _push3(ssrRenderComponent(_component_a_timeline, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<!--[-->`);
                          ssrRenderList(activeSession.value.submissions, (sub) => {
                            _push4(ssrRenderComponent(_component_a_timeline_item, {
                              key: sub.id
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div${_scopeId4}><strong${_scopeId4}>Status:</strong> ${ssrInterpolate(sub.status)} `);
                                  if (sub.gradePct !== null && sub.gradePct !== void 0) {
                                    _push5(`<span${_scopeId4}> · <strong${_scopeId4}>Grade:</strong> ${ssrInterpolate(sub.gradePct)}% </span>`);
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                  _push5(`</div><div class="text-xs text-gray-600"${_scopeId4}><span${_scopeId4}>Created: ${ssrInterpolate(sub.createdAtFormatted)}</span>`);
                                  if (sub.updatedAtFormatted) {
                                    _push5(`<span${_scopeId4}> · Updated: ${ssrInterpolate(sub.updatedAtFormatted)}</span>`);
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                  _push5(`</div>`);
                                  if (sub.feedback) {
                                    _push5(`<div class="mt-1 text-sm"${_scopeId4}><strong${_scopeId4}>Feedback:</strong> ${ssrInterpolate(sub.feedback)}</div>`);
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                } else {
                                  return [
                                    createVNode("div", null, [
                                      createVNode("strong", null, "Status:"),
                                      createTextVNode(" " + toDisplayString(sub.status) + " ", 1),
                                      sub.gradePct !== null && sub.gradePct !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, [
                                        createTextVNode(" · "),
                                        createVNode("strong", null, "Grade:"),
                                        createTextVNode(" " + toDisplayString(sub.gradePct) + "% ", 1)
                                      ])) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", { class: "text-xs text-gray-600" }, [
                                      createVNode("span", null, "Created: " + toDisplayString(sub.createdAtFormatted), 1),
                                      sub.updatedAtFormatted ? (openBlock(), createBlock("span", { key: 0 }, " · Updated: " + toDisplayString(sub.updatedAtFormatted), 1)) : createCommentVNode("", true)
                                    ]),
                                    sub.feedback ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "mt-1 text-sm"
                                    }, [
                                      createVNode("strong", null, "Feedback:"),
                                      createTextVNode(" " + toDisplayString(sub.feedback), 1)
                                    ])) : createCommentVNode("", true)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            (openBlock(true), createBlock(Fragment, null, renderList(activeSession.value.submissions, (sub) => {
                              return openBlock(), createBlock(_component_a_timeline_item, {
                                key: sub.id
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", null, [
                                    createVNode("strong", null, "Status:"),
                                    createTextVNode(" " + toDisplayString(sub.status) + " ", 1),
                                    sub.gradePct !== null && sub.gradePct !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, [
                                      createTextVNode(" · "),
                                      createVNode("strong", null, "Grade:"),
                                      createTextVNode(" " + toDisplayString(sub.gradePct) + "% ", 1)
                                    ])) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", { class: "text-xs text-gray-600" }, [
                                    createVNode("span", null, "Created: " + toDisplayString(sub.createdAtFormatted), 1),
                                    sub.updatedAtFormatted ? (openBlock(), createBlock("span", { key: 0 }, " · Updated: " + toDisplayString(sub.updatedAtFormatted), 1)) : createCommentVNode("", true)
                                  ]),
                                  sub.feedback ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "mt-1 text-sm"
                                  }, [
                                    createVNode("strong", null, "Feedback:"),
                                    createTextVNode(" " + toDisplayString(sub.feedback), 1)
                                  ])) : createCommentVNode("", true)
                                ]),
                                _: 2
                              }, 1024);
                            }), 128))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    if (!activeSession.value.submissions || !activeSession.value.submissions.length) {
                      _push3(`<div class="text-sm text-gray-500"${_scopeId2}> No submissions for this session yet. </div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    _push3(`<div class="text-sm text-gray-500"${_scopeId2}> No session selected. </div>`);
                  }
                } else {
                  return [
                    activeSession.value ? (openBlock(), createBlock("div", { key: 0 }, [
                      createVNode("div", { class: "mb-3 text-sm text-gray-700" }, [
                        createVNode("div", null, [
                          createVNode("strong", null, "Challenge:"),
                          createTextVNode(" " + toDisplayString(activeSession.value.challenge?.title), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("strong", null, "Student:"),
                          createTextVNode(" " + toDisplayString(activeSession.value.userId), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("strong", null, "Bindings:"),
                          activeSession.value.challenge?.courseId ? (openBlock(), createBlock("span", { key: 0 }, "Course " + toDisplayString(activeSession.value.challenge.courseId), 1)) : createCommentVNode("", true),
                          activeSession.value.challenge?.moduleId ? (openBlock(), createBlock("span", { key: 1 }, " · Module " + toDisplayString(activeSession.value.challenge.moduleId), 1)) : createCommentVNode("", true),
                          activeSession.value.challenge?.lessonId ? (openBlock(), createBlock("span", { key: 2 }, " · Lesson " + toDisplayString(activeSession.value.challenge.lessonId), 1)) : createCommentVNode("", true)
                        ])
                      ]),
                      createVNode(_component_a_timeline, null, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(activeSession.value.submissions, (sub) => {
                            return openBlock(), createBlock(_component_a_timeline_item, {
                              key: sub.id
                            }, {
                              default: withCtx(() => [
                                createVNode("div", null, [
                                  createVNode("strong", null, "Status:"),
                                  createTextVNode(" " + toDisplayString(sub.status) + " ", 1),
                                  sub.gradePct !== null && sub.gradePct !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, [
                                    createTextVNode(" · "),
                                    createVNode("strong", null, "Grade:"),
                                    createTextVNode(" " + toDisplayString(sub.gradePct) + "% ", 1)
                                  ])) : createCommentVNode("", true)
                                ]),
                                createVNode("div", { class: "text-xs text-gray-600" }, [
                                  createVNode("span", null, "Created: " + toDisplayString(sub.createdAtFormatted), 1),
                                  sub.updatedAtFormatted ? (openBlock(), createBlock("span", { key: 0 }, " · Updated: " + toDisplayString(sub.updatedAtFormatted), 1)) : createCommentVNode("", true)
                                ]),
                                sub.feedback ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "mt-1 text-sm"
                                }, [
                                  createVNode("strong", null, "Feedback:"),
                                  createTextVNode(" " + toDisplayString(sub.feedback), 1)
                                ])) : createCommentVNode("", true)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ]),
                        _: 1
                      }),
                      !activeSession.value.submissions || !activeSession.value.submissions.length ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-sm text-gray-500"
                      }, " No submissions for this session yet. ")) : createCommentVNode("", true)
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "text-sm text-gray-500"
                    }, " No session selected. "))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_spin, { spinning: drawerLoading.value }, {
                default: withCtx(() => [
                  activeSession.value ? (openBlock(), createBlock("div", { key: 0 }, [
                    createVNode("div", { class: "mb-3 text-sm text-gray-700" }, [
                      createVNode("div", null, [
                        createVNode("strong", null, "Challenge:"),
                        createTextVNode(" " + toDisplayString(activeSession.value.challenge?.title), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("strong", null, "Student:"),
                        createTextVNode(" " + toDisplayString(activeSession.value.userId), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("strong", null, "Bindings:"),
                        activeSession.value.challenge?.courseId ? (openBlock(), createBlock("span", { key: 0 }, "Course " + toDisplayString(activeSession.value.challenge.courseId), 1)) : createCommentVNode("", true),
                        activeSession.value.challenge?.moduleId ? (openBlock(), createBlock("span", { key: 1 }, " · Module " + toDisplayString(activeSession.value.challenge.moduleId), 1)) : createCommentVNode("", true),
                        activeSession.value.challenge?.lessonId ? (openBlock(), createBlock("span", { key: 2 }, " · Lesson " + toDisplayString(activeSession.value.challenge.lessonId), 1)) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode(_component_a_timeline, null, {
                      default: withCtx(() => [
                        (openBlock(true), createBlock(Fragment, null, renderList(activeSession.value.submissions, (sub) => {
                          return openBlock(), createBlock(_component_a_timeline_item, {
                            key: sub.id
                          }, {
                            default: withCtx(() => [
                              createVNode("div", null, [
                                createVNode("strong", null, "Status:"),
                                createTextVNode(" " + toDisplayString(sub.status) + " ", 1),
                                sub.gradePct !== null && sub.gradePct !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, [
                                  createTextVNode(" · "),
                                  createVNode("strong", null, "Grade:"),
                                  createTextVNode(" " + toDisplayString(sub.gradePct) + "% ", 1)
                                ])) : createCommentVNode("", true)
                              ]),
                              createVNode("div", { class: "text-xs text-gray-600" }, [
                                createVNode("span", null, "Created: " + toDisplayString(sub.createdAtFormatted), 1),
                                sub.updatedAtFormatted ? (openBlock(), createBlock("span", { key: 0 }, " · Updated: " + toDisplayString(sub.updatedAtFormatted), 1)) : createCommentVNode("", true)
                              ]),
                              sub.feedback ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "mt-1 text-sm"
                              }, [
                                createVNode("strong", null, "Feedback:"),
                                createTextVNode(" " + toDisplayString(sub.feedback), 1)
                              ])) : createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ]),
                      _: 1
                    }),
                    !activeSession.value.submissions || !activeSession.value.submissions.length ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-sm text-gray-500"
                    }, " No submissions for this session yet. ")) : createCommentVNode("", true)
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-sm text-gray-500"
                  }, " No session selected. "))
                ]),
                _: 1
              }, 8, ["spinning"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/teacher-course-lab/pages/teacher-course-lab/submissions.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=submissions-D2hvjnSE.mjs.map
