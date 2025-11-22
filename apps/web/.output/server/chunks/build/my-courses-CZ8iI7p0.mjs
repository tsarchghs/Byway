import { defineComponent, ref, resolveComponent, mergeProps, withCtx, createTextVNode, createVNode, createBlock, createCommentVNode, openBlock, toDisplayString, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import { message } from 'ant-design-vue';
import { _ as _sfc_main$1 } from './StudentsNav-xlfyhLgm.mjs';
import { u as useAuth } from './useAuth-B8D9e8en.mjs';
import { _ as _export_sfc, u as useRouter, b as useRuntimeConfig } from './server.mjs';
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
  __name: "my-courses",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const { user, token } = useAuth();
    const config = useRuntimeConfig();
    const apiBase = config.public?.apiBase || "http://localhost:4000";
    const loading = ref(false);
    const courses = ref([]);
    const studentId = ref(null);
    const startingId = ref(null);
    function coverStyle(c) {
      const url = c.course?.coverUrl;
      if (url) return { backgroundImage: `url('${url}')` };
      return { backgroundImage: "linear-gradient(135deg,#1e3a8a,#2563eb)" };
    }
    async function gqlStudents(query, variables) {
      const res = await fetch(`${apiBase}/api/students-internal/graphql`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...token.value ? { Authorization: `Bearer ${token.value}` } : {}
        },
        body: JSON.stringify({ query, variables })
      });
      const json = await res.json();
      if (json.errors?.length) throw new Error(json.errors[0].message);
      return json.data;
    }
    async function resolveStudentId() {
      if (studentId.value) return studentId.value;
      if (!user.value?.id) throw new Error("Not authenticated");
      let sid;
      const authId = user.value.userId || user.value.id;
      try {
        const data = await gqlStudents(`query($uid:String!){ studentByUserId(userId:$uid){ id } }`, { uid: authId });
        sid = data?.studentByUserId?.id;
      } catch {
      }
      if (!sid) {
        const created = await gqlStudents(
          `mutation($uid:String!,$name:String){ createStudent(userId:$uid, displayName:$name){ id } }`,
          { uid: authId, name: user.value.email || user.value.displayName || "Student" }
        );
        sid = created?.createStudent?.id;
      }
      if (!sid) throw new Error("Student profile not found");
      studentId.value = sid;
      return sid;
    }
    function openCourse(c) {
      const sid = studentId.value || "student";
      const cid = c.courseId;
      const mid = "mod-1";
      router.push(`/student/${encodeURIComponent(sid)}/course/${encodeURIComponent(cid)}/module/${encodeURIComponent(mid)}`);
    }
    async function startCourse(c) {
      startingId.value = c.courseId;
      try {
        const sid = await resolveStudentId();
        const moduleId = c.course?.modules?.[0]?.id;
        if (moduleId) {
          router.push(`/student/${encodeURIComponent(sid)}/course/${encodeURIComponent(c.courseId)}/module/${encodeURIComponent(moduleId)}`);
        } else {
          router.push(`/course/${encodeURIComponent(c.courseId)}`);
        }
      } catch (e) {
        message.error(e?.message || "Unable to open modules");
      } finally {
        startingId.value = null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_empty = resolveComponent("a-empty");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_space = resolveComponent("a-space");
      _push(ssrRenderComponent(_component_a_layout, mergeProps({ class: "p-6" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$1, { subtitle: "My Courses" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_card, {
              loading: loading.value,
              bordered: false
            }, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex-between" data-v-16cff019${_scopeId2}><span data-v-16cff019${_scopeId2}>Enrolled courses</span>`);
                  _push3(ssrRenderComponent(_component_a_button, {
                    type: "primary",
                    onClick: ($event) => _ctx.$router.push("/categories")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Browse more`);
                      } else {
                        return [
                          createTextVNode("Browse more")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex-between" }, [
                      createVNode("span", null, "Enrolled courses"),
                      createVNode(_component_a_button, {
                        type: "primary",
                        onClick: ($event) => _ctx.$router.push("/categories")
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Browse more")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (!loading.value && courses.value.length === 0) {
                    _push3(ssrRenderComponent(_component_a_empty, { description: "No enrollments yet." }, null, _parent3, _scopeId2));
                  } else {
                    _push3(ssrRenderComponent(_component_a_row, { gutter: [16, 16] }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<!--[-->`);
                          ssrRenderList(courses.value, (c) => {
                            _push4(ssrRenderComponent(_component_a_col, {
                              key: c.courseId,
                              xs: 24,
                              sm: 12,
                              md: 8,
                              lg: 6
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_a_card, {
                                    hoverable: true,
                                    class: "course-card"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`<div class="cover" style="${ssrRenderStyle(coverStyle(c))}" data-v-16cff019${_scopeId5}>`);
                                        if (c.course?.category) {
                                          _push6(`<div class="badge" data-v-16cff019${_scopeId5}>${ssrInterpolate(c.course.category)}</div>`);
                                        } else {
                                          _push6(`<!---->`);
                                        }
                                        _push6(`</div><div class="meta" data-v-16cff019${_scopeId5}><div class="title" data-v-16cff019${_scopeId5}>${ssrInterpolate(c.course?.title || c.courseId)}</div><div class="muted" data-v-16cff019${_scopeId5}>${ssrInterpolate(c.course?.difficulty || "—")}</div></div>`);
                                        _push6(ssrRenderComponent(_component_a_space, { style: { "margin-top": "8px" } }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(_component_a_button, {
                                                block: "",
                                                onClick: ($event) => openCourse(c)
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`View`);
                                                  } else {
                                                    return [
                                                      createTextVNode("View")
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(_component_a_button, {
                                                type: "primary",
                                                block: "",
                                                onClick: ($event) => startCourse(c),
                                                loading: startingId.value === c.courseId
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(` Continue `);
                                                  } else {
                                                    return [
                                                      createTextVNode(" Continue ")
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(_component_a_button, {
                                                  block: "",
                                                  onClick: ($event) => openCourse(c)
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("View")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"]),
                                                createVNode(_component_a_button, {
                                                  type: "primary",
                                                  block: "",
                                                  onClick: ($event) => startCourse(c),
                                                  loading: startingId.value === c.courseId
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" Continue ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick", "loading"])
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode("div", {
                                            class: "cover",
                                            style: coverStyle(c)
                                          }, [
                                            c.course?.category ? (openBlock(), createBlock("div", {
                                              key: 0,
                                              class: "badge"
                                            }, toDisplayString(c.course.category), 1)) : createCommentVNode("", true)
                                          ], 4),
                                          createVNode("div", { class: "meta" }, [
                                            createVNode("div", { class: "title" }, toDisplayString(c.course?.title || c.courseId), 1),
                                            createVNode("div", { class: "muted" }, toDisplayString(c.course?.difficulty || "—"), 1)
                                          ]),
                                          createVNode(_component_a_space, { style: { "margin-top": "8px" } }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_button, {
                                                block: "",
                                                onClick: ($event) => openCourse(c)
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("View")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"]),
                                              createVNode(_component_a_button, {
                                                type: "primary",
                                                block: "",
                                                onClick: ($event) => startCourse(c),
                                                loading: startingId.value === c.courseId
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Continue ")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick", "loading"])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(_component_a_card, {
                                      hoverable: true,
                                      class: "course-card"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("div", {
                                          class: "cover",
                                          style: coverStyle(c)
                                        }, [
                                          c.course?.category ? (openBlock(), createBlock("div", {
                                            key: 0,
                                            class: "badge"
                                          }, toDisplayString(c.course.category), 1)) : createCommentVNode("", true)
                                        ], 4),
                                        createVNode("div", { class: "meta" }, [
                                          createVNode("div", { class: "title" }, toDisplayString(c.course?.title || c.courseId), 1),
                                          createVNode("div", { class: "muted" }, toDisplayString(c.course?.difficulty || "—"), 1)
                                        ]),
                                        createVNode(_component_a_space, { style: { "margin-top": "8px" } }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_button, {
                                              block: "",
                                              onClick: ($event) => openCourse(c)
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("View")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"]),
                                            createVNode(_component_a_button, {
                                              type: "primary",
                                              block: "",
                                              onClick: ($event) => startCourse(c),
                                              loading: startingId.value === c.courseId
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Continue ")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick", "loading"])
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            (openBlock(true), createBlock(Fragment, null, renderList(courses.value, (c) => {
                              return openBlock(), createBlock(_component_a_col, {
                                key: c.courseId,
                                xs: 24,
                                sm: 12,
                                md: 8,
                                lg: 6
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, {
                                    hoverable: true,
                                    class: "course-card"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("div", {
                                        class: "cover",
                                        style: coverStyle(c)
                                      }, [
                                        c.course?.category ? (openBlock(), createBlock("div", {
                                          key: 0,
                                          class: "badge"
                                        }, toDisplayString(c.course.category), 1)) : createCommentVNode("", true)
                                      ], 4),
                                      createVNode("div", { class: "meta" }, [
                                        createVNode("div", { class: "title" }, toDisplayString(c.course?.title || c.courseId), 1),
                                        createVNode("div", { class: "muted" }, toDisplayString(c.course?.difficulty || "—"), 1)
                                      ]),
                                      createVNode(_component_a_space, { style: { "margin-top": "8px" } }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_button, {
                                            block: "",
                                            onClick: ($event) => openCourse(c)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("View")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"]),
                                          createVNode(_component_a_button, {
                                            type: "primary",
                                            block: "",
                                            onClick: ($event) => startCourse(c),
                                            loading: startingId.value === c.courseId
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Continue ")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick", "loading"])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024);
                            }), 128))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  }
                } else {
                  return [
                    !loading.value && courses.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                      key: 0,
                      description: "No enrollments yet."
                    })) : (openBlock(), createBlock(_component_a_row, {
                      key: 1,
                      gutter: [16, 16]
                    }, {
                      default: withCtx(() => [
                        (openBlock(true), createBlock(Fragment, null, renderList(courses.value, (c) => {
                          return openBlock(), createBlock(_component_a_col, {
                            key: c.courseId,
                            xs: 24,
                            sm: 12,
                            md: 8,
                            lg: 6
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                hoverable: true,
                                class: "course-card"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", {
                                    class: "cover",
                                    style: coverStyle(c)
                                  }, [
                                    c.course?.category ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "badge"
                                    }, toDisplayString(c.course.category), 1)) : createCommentVNode("", true)
                                  ], 4),
                                  createVNode("div", { class: "meta" }, [
                                    createVNode("div", { class: "title" }, toDisplayString(c.course?.title || c.courseId), 1),
                                    createVNode("div", { class: "muted" }, toDisplayString(c.course?.difficulty || "—"), 1)
                                  ]),
                                  createVNode(_component_a_space, { style: { "margin-top": "8px" } }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_button, {
                                        block: "",
                                        onClick: ($event) => openCourse(c)
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("View")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"]),
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        block: "",
                                        onClick: ($event) => startCourse(c),
                                        loading: startingId.value === c.courseId
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Continue ")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick", "loading"])
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ]),
                      _: 1
                    }))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$1, { subtitle: "My Courses" }),
              createVNode(_component_a_card, {
                loading: loading.value,
                bordered: false
              }, {
                title: withCtx(() => [
                  createVNode("div", { class: "flex-between" }, [
                    createVNode("span", null, "Enrolled courses"),
                    createVNode(_component_a_button, {
                      type: "primary",
                      onClick: ($event) => _ctx.$router.push("/categories")
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Browse more")
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ])
                ]),
                default: withCtx(() => [
                  !loading.value && courses.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                    key: 0,
                    description: "No enrollments yet."
                  })) : (openBlock(), createBlock(_component_a_row, {
                    key: 1,
                    gutter: [16, 16]
                  }, {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(courses.value, (c) => {
                        return openBlock(), createBlock(_component_a_col, {
                          key: c.courseId,
                          xs: 24,
                          sm: 12,
                          md: 8,
                          lg: 6
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              hoverable: true,
                              class: "course-card"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", {
                                  class: "cover",
                                  style: coverStyle(c)
                                }, [
                                  c.course?.category ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "badge"
                                  }, toDisplayString(c.course.category), 1)) : createCommentVNode("", true)
                                ], 4),
                                createVNode("div", { class: "meta" }, [
                                  createVNode("div", { class: "title" }, toDisplayString(c.course?.title || c.courseId), 1),
                                  createVNode("div", { class: "muted" }, toDisplayString(c.course?.difficulty || "—"), 1)
                                ]),
                                createVNode(_component_a_space, { style: { "margin-top": "8px" } }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      block: "",
                                      onClick: ($event) => openCourse(c)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("View")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"]),
                                    createVNode(_component_a_button, {
                                      type: "primary",
                                      block: "",
                                      onClick: ($event) => startCourse(c),
                                      loading: startingId.value === c.courseId
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Continue ")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick", "loading"])
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ]),
                    _: 1
                  }))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/students-internal/nuxt/pages/my-courses.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const myCourses = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-16cff019"]]);

export { myCourses as default };
//# sourceMappingURL=my-courses-CZ8iI7p0.mjs.map
