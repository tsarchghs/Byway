import { defineComponent, ref, resolveComponent, mergeProps, withCtx, createTextVNode, createVNode, createBlock, createCommentVNode, openBlock, h, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { message } from 'ant-design-vue';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const challengeId = ref("");
    const session = ref(null);
    const starting = ref(false);
    const loadingSessions = ref(false);
    const sessions = ref([]);
    const sessionColumns = [
      { title: "Challenge", dataIndex: ["challenge", "title"], key: "challenge" },
      { title: "Status", dataIndex: "status", key: "status" },
      {
        title: "Code-Server",
        key: "codeServer",
        customRender: ({ record }) => {
          if (record.codeServerUrl) {
            return h("a", { href: record.codeServerUrl, target: "_blank" }, "Open");
          }
          return h("span", { style: "color: #999" }, "Not started");
        }
      },
      { title: "Last Result", dataIndex: ["lastSubmission", "status"], key: "lastStatus" },
      { title: "Grade %", dataIndex: ["lastSubmission", "gradePct"], key: "gradePct" },
      { title: "Attempts", dataIndex: "attempts", key: "attempts" },
      { title: "Started", dataIndex: "createdAt", key: "createdAt" }
    ];
    async function loadSessions() {
      loadingSessions.value = true;
      try {
        const res = await fetch(
          "http://localhost:4000/api/teacher-course-lab/sessions/me",
          {
            headers: {
              Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWh5dmN4cjgwMDAwdHcwa3JyODR5eHk4IiwiaWF0IjoxNzYzMTI1NTc1LCJleHAiOjE3NjM3MzAzNzV9.Q7ZrBeM8oZlFUQLKp5YtJsObOQ9AeChhXV3ZXc6797U"
            }
          }
        );
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        sessions.value = (data.sessions || []).map((s) => {
          const last = s.submissions && s.submissions[0] || null;
          return {
            ...s,
            lastSubmission: last,
            attempts: s.submissions ? s.submissions.length : 0
          };
        });
      } catch (e) {
        console.error(e);
        message.error(e?.message || "Failed to load sessions");
      } finally {
        loadingSessions.value = false;
      }
    }
    async function startSession() {
      if (!challengeId.value) return message.warn("Enter a challenge ID to start");
      starting.value = true;
      try {
        const res = await fetch("http://localhost:4000/api/teacher-course-lab/session/start", {
          method: "POST",
          headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWh5dmN4cjgwMDAwdHcwa3JyODR5eHk4IiwiaWF0IjoxNzYzMTI1NTc1LCJleHAiOjE3NjM3MzAzNzV9.Q7ZrBeM8oZlFUQLKp5YtJsObOQ9AeChhXV3ZXc6797U", "Content-Type": "application/json" },
          body: JSON.stringify({ challengeId: challengeId.value })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Failed to start lab session");
        }
        session.value = data.session;
        message.success("Lab session started");
        await loadSessions();
      } catch (e) {
        console.error(e);
        message.error(e?.message || "Failed to start lab session");
      } finally {
        starting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_result = resolveComponent("a-result");
      const _component_a_typography_paragraph = resolveComponent("a-typography-paragraph");
      const _component_a_table = resolveComponent("a-table");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_a_page_header, {
        title: "Student • Course Labs",
        "sub-title": "Start a lab session, open code-server, and review your progress"
      }, null, _parent));
      _push(ssrRenderComponent(_component_a_row, { gutter: 16 }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_col, {
              xs: 24,
              md: 10
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_card, { title: "Start new lab session" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<p class="mb-2 text-sm text-gray-600"${_scopeId3}> Paste a challenge ID assigned by your teacher to start a new lab session. </p>`);
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: challengeId.value,
                          "onUpdate:value": ($event) => challengeId.value = $event,
                          placeholder: "Enter Challenge ID",
                          style: { "max-width": "320px" }
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_button, {
                          loading: starting.value,
                          class: "ml-2 mt-2",
                          type: "primary",
                          onClick: startSession
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Start Session `);
                            } else {
                              return [
                                createTextVNode(" Start Session ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        if (session.value) {
                          _push4(`<div class="mt-4"${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_a_result, {
                            status: "success",
                            title: "Session started"
                          }, {
                            extra: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<div class="mb-2"${_scopeId4}><strong${_scopeId4}>Session ID:</strong>`);
                                _push5(ssrRenderComponent(_component_a_typography_paragraph, {
                                  style: { "display": "inline-block", "margin-left": "4px" },
                                  copyable: "",
                                  content: session.value.id
                                }, null, _parent5, _scopeId4));
                                _push5(`</div>`);
                                if (session.value.codeServerUrl) {
                                  _push5(`<div class="mb-2"${_scopeId4}><strong${_scopeId4}>Code-Server URL:</strong>`);
                                  _push5(ssrRenderComponent(_component_a_typography_paragraph, {
                                    style: { "display": "inline-block", "margin-left": "4px" },
                                    copyable: "",
                                    content: session.value.codeServerUrl
                                  }, null, _parent5, _scopeId4));
                                  _push5(`</div>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                if (session.value.codeServerUrl) {
                                  _push5(ssrRenderComponent(_component_a_button, {
                                    type: "primary",
                                    href: session.value.codeServerUrl,
                                    target: "_blank"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(` Open code-server in new tab `);
                                      } else {
                                        return [
                                          createTextVNode(" Open code-server in new tab ")
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                              } else {
                                return [
                                  createVNode("div", { class: "mb-2" }, [
                                    createVNode("strong", null, "Session ID:"),
                                    createVNode(_component_a_typography_paragraph, {
                                      style: { "display": "inline-block", "margin-left": "4px" },
                                      copyable: "",
                                      content: session.value.id
                                    }, null, 8, ["content"])
                                  ]),
                                  session.value.codeServerUrl ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "mb-2"
                                  }, [
                                    createVNode("strong", null, "Code-Server URL:"),
                                    createVNode(_component_a_typography_paragraph, {
                                      style: { "display": "inline-block", "margin-left": "4px" },
                                      copyable: "",
                                      content: session.value.codeServerUrl
                                    }, null, 8, ["content"])
                                  ])) : createCommentVNode("", true),
                                  session.value.codeServerUrl ? (openBlock(), createBlock(_component_a_button, {
                                    key: 1,
                                    type: "primary",
                                    href: session.value.codeServerUrl,
                                    target: "_blank"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Open code-server in new tab ")
                                    ]),
                                    _: 1
                                  }, 8, ["href"])) : createCommentVNode("", true)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          createVNode("p", { class: "mb-2 text-sm text-gray-600" }, " Paste a challenge ID assigned by your teacher to start a new lab session. "),
                          createVNode(_component_a_input, {
                            value: challengeId.value,
                            "onUpdate:value": ($event) => challengeId.value = $event,
                            placeholder: "Enter Challenge ID",
                            style: { "max-width": "320px" }
                          }, null, 8, ["value", "onUpdate:value"]),
                          createVNode(_component_a_button, {
                            loading: starting.value,
                            class: "ml-2 mt-2",
                            type: "primary",
                            onClick: startSession
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Start Session ")
                            ]),
                            _: 1
                          }, 8, ["loading"]),
                          session.value ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "mt-4"
                          }, [
                            createVNode(_component_a_result, {
                              status: "success",
                              title: "Session started"
                            }, {
                              extra: withCtx(() => [
                                createVNode("div", { class: "mb-2" }, [
                                  createVNode("strong", null, "Session ID:"),
                                  createVNode(_component_a_typography_paragraph, {
                                    style: { "display": "inline-block", "margin-left": "4px" },
                                    copyable: "",
                                    content: session.value.id
                                  }, null, 8, ["content"])
                                ]),
                                session.value.codeServerUrl ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "mb-2"
                                }, [
                                  createVNode("strong", null, "Code-Server URL:"),
                                  createVNode(_component_a_typography_paragraph, {
                                    style: { "display": "inline-block", "margin-left": "4px" },
                                    copyable: "",
                                    content: session.value.codeServerUrl
                                  }, null, 8, ["content"])
                                ])) : createCommentVNode("", true),
                                session.value.codeServerUrl ? (openBlock(), createBlock(_component_a_button, {
                                  key: 1,
                                  type: "primary",
                                  href: session.value.codeServerUrl,
                                  target: "_blank"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Open code-server in new tab ")
                                  ]),
                                  _: 1
                                }, 8, ["href"])) : createCommentVNode("", true)
                              ]),
                              _: 1
                            })
                          ])) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, { title: "Start new lab session" }, {
                      default: withCtx(() => [
                        createVNode("p", { class: "mb-2 text-sm text-gray-600" }, " Paste a challenge ID assigned by your teacher to start a new lab session. "),
                        createVNode(_component_a_input, {
                          value: challengeId.value,
                          "onUpdate:value": ($event) => challengeId.value = $event,
                          placeholder: "Enter Challenge ID",
                          style: { "max-width": "320px" }
                        }, null, 8, ["value", "onUpdate:value"]),
                        createVNode(_component_a_button, {
                          loading: starting.value,
                          class: "ml-2 mt-2",
                          type: "primary",
                          onClick: startSession
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Start Session ")
                          ]),
                          _: 1
                        }, 8, ["loading"]),
                        session.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-4"
                        }, [
                          createVNode(_component_a_result, {
                            status: "success",
                            title: "Session started"
                          }, {
                            extra: withCtx(() => [
                              createVNode("div", { class: "mb-2" }, [
                                createVNode("strong", null, "Session ID:"),
                                createVNode(_component_a_typography_paragraph, {
                                  style: { "display": "inline-block", "margin-left": "4px" },
                                  copyable: "",
                                  content: session.value.id
                                }, null, 8, ["content"])
                              ]),
                              session.value.codeServerUrl ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "mb-2"
                              }, [
                                createVNode("strong", null, "Code-Server URL:"),
                                createVNode(_component_a_typography_paragraph, {
                                  style: { "display": "inline-block", "margin-left": "4px" },
                                  copyable: "",
                                  content: session.value.codeServerUrl
                                }, null, 8, ["content"])
                              ])) : createCommentVNode("", true),
                              session.value.codeServerUrl ? (openBlock(), createBlock(_component_a_button, {
                                key: 1,
                                type: "primary",
                                href: session.value.codeServerUrl,
                                target: "_blank"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Open code-server in new tab ")
                                ]),
                                _: 1
                              }, 8, ["href"])) : createCommentVNode("", true)
                            ]),
                            _: 1
                          })
                        ])) : createCommentVNode("", true)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_col, {
              xs: 24,
              md: 14
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_card, { title: "My lab sessions" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_table, {
                          columns: sessionColumns,
                          "data-source": sessions.value,
                          loading: loadingSessions.value,
                          size: "small",
                          "row-key": "id"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_table, {
                            columns: sessionColumns,
                            "data-source": sessions.value,
                            loading: loadingSessions.value,
                            size: "small",
                            "row-key": "id"
                          }, null, 8, ["data-source", "loading"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, { title: "My lab sessions" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_table, {
                          columns: sessionColumns,
                          "data-source": sessions.value,
                          loading: loadingSessions.value,
                          size: "small",
                          "row-key": "id"
                        }, null, 8, ["data-source", "loading"])
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
              createVNode(_component_a_col, {
                xs: 24,
                md: 10
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_card, { title: "Start new lab session" }, {
                    default: withCtx(() => [
                      createVNode("p", { class: "mb-2 text-sm text-gray-600" }, " Paste a challenge ID assigned by your teacher to start a new lab session. "),
                      createVNode(_component_a_input, {
                        value: challengeId.value,
                        "onUpdate:value": ($event) => challengeId.value = $event,
                        placeholder: "Enter Challenge ID",
                        style: { "max-width": "320px" }
                      }, null, 8, ["value", "onUpdate:value"]),
                      createVNode(_component_a_button, {
                        loading: starting.value,
                        class: "ml-2 mt-2",
                        type: "primary",
                        onClick: startSession
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Start Session ")
                        ]),
                        _: 1
                      }, 8, ["loading"]),
                      session.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "mt-4"
                      }, [
                        createVNode(_component_a_result, {
                          status: "success",
                          title: "Session started"
                        }, {
                          extra: withCtx(() => [
                            createVNode("div", { class: "mb-2" }, [
                              createVNode("strong", null, "Session ID:"),
                              createVNode(_component_a_typography_paragraph, {
                                style: { "display": "inline-block", "margin-left": "4px" },
                                copyable: "",
                                content: session.value.id
                              }, null, 8, ["content"])
                            ]),
                            session.value.codeServerUrl ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "mb-2"
                            }, [
                              createVNode("strong", null, "Code-Server URL:"),
                              createVNode(_component_a_typography_paragraph, {
                                style: { "display": "inline-block", "margin-left": "4px" },
                                copyable: "",
                                content: session.value.codeServerUrl
                              }, null, 8, ["content"])
                            ])) : createCommentVNode("", true),
                            session.value.codeServerUrl ? (openBlock(), createBlock(_component_a_button, {
                              key: 1,
                              type: "primary",
                              href: session.value.codeServerUrl,
                              target: "_blank"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Open code-server in new tab ")
                              ]),
                              _: 1
                            }, 8, ["href"])) : createCommentVNode("", true)
                          ]),
                          _: 1
                        })
                      ])) : createCommentVNode("", true)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_a_col, {
                xs: 24,
                md: 14
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_card, { title: "My lab sessions" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_table, {
                        columns: sessionColumns,
                        "data-source": sessions.value,
                        loading: loadingSessions.value,
                        size: "small",
                        "row-key": "id"
                      }, null, 8, ["data-source", "loading"])
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
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/teacher-course-lab/pages/student-course-lab/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CfXiHh10.mjs.map
