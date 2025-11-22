import { defineComponent, computed, ref, watch, resolveComponent, mergeProps, withCtx, createVNode, createBlock, createCommentVNode, openBlock, createTextVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { message } from 'ant-design-vue';
import { _ as _export_sfc, d as useRoute, b as useRuntimeConfig } from './server.mjs';
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
  __name: "teachers",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const runtime = useRuntimeConfig();
    const apiBase = runtime.public?.apiBase || runtime.public?.appBaseUrl || "";
    const institutionId = computed(() => route.query.institutionId || route.params?.institution_id || "inst_byway");
    const loading = ref(true);
    const teachers2 = ref([]);
    const classrooms = ref([]);
    const courses = ref([]);
    const assignments = ref([]);
    const currentRole = ref("none");
    ref(null);
    const form = ref({});
    const form2 = ref({});
    function resolveAuthHeader() {
      return null;
    }
    async function load() {
      loading.value = true;
      try {
        const auth = resolveAuthHeader();
        if (!auth) throw new Error("Missing auth token");
        const baseUrl = apiBase ? apiBase.replace(/\/$/, "") : "";
        const url = `${baseUrl}/api/institution-portal/teacher-assignments?institutionId=${encodeURIComponent(institutionId.value)}`;
        const resp = await fetch(url, { headers: { Authorization: auth } });
        if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`));
        const json = await resp.json();
        teachers2.value = json.teachers || [];
        classrooms.value = json.classrooms || [];
        courses.value = json.courses || [];
        assignments.value = json.assignments || [];
      } catch (e) {
        message.error(e?.message || "Failed to load");
      } finally {
        loading.value = false;
      }
    }
    watch(currentRole, (r) => {
      if (r === "student") {
        (void 0).location.href = navHref("overview");
      }
    });
    const teacherOptions = computed(() => teachers2.value.map((t) => ({ label: t.displayName || t.userId, value: t.userId })));
    const classroomOptions = computed(() => classrooms.value.map((c) => ({ label: c.title, value: c.id })));
    const courseOptions = computed(() => courses.value.map((c) => ({ label: c.title, value: c.courseId })));
    async function assignToClassroom() {
      try {
        const auth = resolveAuthHeader();
        if (!auth) throw new Error("Missing auth token");
        const baseUrl = apiBase ? apiBase.replace(/\/$/, "") : "";
        const resp = await fetch(`${baseUrl}/api/institution-portal/assignments/teacher`, {
          method: "POST",
          headers: { "content-type": "application/json", Authorization: auth },
          body: JSON.stringify({ scope: "classroom", institutionId: institutionId.value, teacherId: form.value.teacherId, classroomId: form.value.classroomId })
        });
        if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`));
        message.success("Assigned to classroom");
        load();
      } catch (e) {
        message.error(e?.message || "Assign failed");
      }
    }
    async function assignToCourse() {
      try {
        const auth = resolveAuthHeader();
        if (!auth) throw new Error("Missing auth token");
        const baseUrl = apiBase ? apiBase.replace(/\/$/, "") : "";
        const resp = await fetch(`${baseUrl}/api/institution-portal/assignments/teacher`, {
          method: "POST",
          headers: { "content-type": "application/json", Authorization: auth },
          body: JSON.stringify({ scope: "course", institutionId: institutionId.value, teacherId: form2.value.teacherId, courseId: form2.value.courseId })
        });
        if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`));
        message.success("Assigned to course");
        load();
      } catch (e) {
        message.error(e?.message || "Assign failed");
      }
    }
    const columns = [
      { title: "Type", dataIndex: "type", key: "type" },
      { title: "Teacher", dataIndex: "teacher", key: "teacher" },
      { title: "Target", dataIndex: "target", key: "target" }
    ];
    function navHref(key) {
      const qs = `?institutionId=${encodeURIComponent(institutionId.value)}`;
      if (key === "overview") return `/institution/portal${qs}`;
      if (key === "departments") return `/institution/departments/${qs}`;
      if (key === "classrooms") return `/institution/classrooms/${qs}`;
      if (key === "people") return `/institution/people${qs}`;
      if (key === "catalog") return `/institution/catalog${qs}`;
      if (key === "calendar") return `/institution/calendar${qs}`;
      if (key === "assignments") return `/institution/assignments/teachers${qs}`;
      return `/institution/portal${qs}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_menu = resolveComponent("a-menu");
      const _component_a_menu_item = resolveComponent("a-menu-item");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_skeleton = resolveComponent("a-skeleton");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_form = resolveComponent("a-form");
      const _component_a_form_item = resolveComponent("a-form-item");
      const _component_a_select = resolveComponent("a-select");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_result = resolveComponent("a-result");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "teacher-assignments" }, _attrs))} data-v-0a1e945b>`);
      _push(ssrRenderComponent(_component_a_page_header, { title: "Teacher Assignment Manager" }, {
        extra: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_space, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_menu, {
                    mode: "horizontal",
                    selectedKeys: ["assignments"]
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "overview" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<a${ssrRenderAttr("href", navHref("overview"))} data-v-0a1e945b${_scopeId4}>Overview</a>`);
                            } else {
                              return [
                                createVNode("a", {
                                  href: navHref("overview")
                                }, "Overview", 8, ["href"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        if (currentRole.value === "admin") {
                          _push4(ssrRenderComponent(_component_a_menu_item, { key: "departments" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<a${ssrRenderAttr("href", navHref("departments"))} data-v-0a1e945b${_scopeId4}>Departments</a>`);
                              } else {
                                return [
                                  createVNode("a", {
                                    href: navHref("departments")
                                  }, "Departments", 8, ["href"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "classrooms" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<a${ssrRenderAttr("href", navHref("classrooms"))} data-v-0a1e945b${_scopeId4}>Classrooms</a>`);
                            } else {
                              return [
                                createVNode("a", {
                                  href: navHref("classrooms")
                                }, "Classrooms", 8, ["href"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "people" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<a${ssrRenderAttr("href", navHref("people"))} data-v-0a1e945b${_scopeId4}>People Directory</a>`);
                            } else {
                              return [
                                createVNode("a", {
                                  href: navHref("people")
                                }, "People Directory", 8, ["href"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "catalog" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<a${ssrRenderAttr("href", navHref("catalog"))} data-v-0a1e945b${_scopeId4}>Catalog</a>`);
                            } else {
                              return [
                                createVNode("a", {
                                  href: navHref("catalog")
                                }, "Catalog", 8, ["href"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "calendar" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<a${ssrRenderAttr("href", navHref("calendar"))} data-v-0a1e945b${_scopeId4}>Calendar</a>`);
                            } else {
                              return [
                                createVNode("a", {
                                  href: navHref("calendar")
                                }, "Calendar", 8, ["href"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        if (currentRole.value !== "student") {
                          _push4(ssrRenderComponent(_component_a_menu_item, { key: "assignments" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<a${ssrRenderAttr("href", navHref("assignments"))} data-v-0a1e945b${_scopeId4}>Assignments</a>`);
                              } else {
                                return [
                                  createVNode("a", {
                                    href: navHref("assignments")
                                  }, "Assignments", 8, ["href"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          createVNode(_component_a_menu_item, { key: "overview" }, {
                            default: withCtx(() => [
                              createVNode("a", {
                                href: navHref("overview")
                              }, "Overview", 8, ["href"])
                            ]),
                            _: 1
                          }),
                          currentRole.value === "admin" ? (openBlock(), createBlock(_component_a_menu_item, { key: "departments" }, {
                            default: withCtx(() => [
                              createVNode("a", {
                                href: navHref("departments")
                              }, "Departments", 8, ["href"])
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          createVNode(_component_a_menu_item, { key: "classrooms" }, {
                            default: withCtx(() => [
                              createVNode("a", {
                                href: navHref("classrooms")
                              }, "Classrooms", 8, ["href"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, { key: "people" }, {
                            default: withCtx(() => [
                              createVNode("a", {
                                href: navHref("people")
                              }, "People Directory", 8, ["href"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, { key: "catalog" }, {
                            default: withCtx(() => [
                              createVNode("a", {
                                href: navHref("catalog")
                              }, "Catalog", 8, ["href"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, { key: "calendar" }, {
                            default: withCtx(() => [
                              createVNode("a", {
                                href: navHref("calendar")
                              }, "Calendar", 8, ["href"])
                            ]),
                            _: 1
                          }),
                          currentRole.value !== "student" ? (openBlock(), createBlock(_component_a_menu_item, { key: "assignments" }, {
                            default: withCtx(() => [
                              createVNode("a", {
                                href: navHref("assignments")
                              }, "Assignments", 8, ["href"])
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
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
                    createVNode(_component_a_menu, {
                      mode: "horizontal",
                      selectedKeys: ["assignments"]
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_menu_item, { key: "overview" }, {
                          default: withCtx(() => [
                            createVNode("a", {
                              href: navHref("overview")
                            }, "Overview", 8, ["href"])
                          ]),
                          _: 1
                        }),
                        currentRole.value === "admin" ? (openBlock(), createBlock(_component_a_menu_item, { key: "departments" }, {
                          default: withCtx(() => [
                            createVNode("a", {
                              href: navHref("departments")
                            }, "Departments", 8, ["href"])
                          ]),
                          _: 1
                        })) : createCommentVNode("", true),
                        createVNode(_component_a_menu_item, { key: "classrooms" }, {
                          default: withCtx(() => [
                            createVNode("a", {
                              href: navHref("classrooms")
                            }, "Classrooms", 8, ["href"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu_item, { key: "people" }, {
                          default: withCtx(() => [
                            createVNode("a", {
                              href: navHref("people")
                            }, "People Directory", 8, ["href"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu_item, { key: "catalog" }, {
                          default: withCtx(() => [
                            createVNode("a", {
                              href: navHref("catalog")
                            }, "Catalog", 8, ["href"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu_item, { key: "calendar" }, {
                          default: withCtx(() => [
                            createVNode("a", {
                              href: navHref("calendar")
                            }, "Calendar", 8, ["href"])
                          ]),
                          _: 1
                        }),
                        currentRole.value !== "student" ? (openBlock(), createBlock(_component_a_menu_item, { key: "assignments" }, {
                          default: withCtx(() => [
                            createVNode("a", {
                              href: navHref("assignments")
                            }, "Assignments", 8, ["href"])
                          ]),
                          _: 1
                        })) : createCommentVNode("", true)
                      ]),
                      _: 1
                    }),
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
                  createVNode(_component_a_menu, {
                    mode: "horizontal",
                    selectedKeys: ["assignments"]
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_menu_item, { key: "overview" }, {
                        default: withCtx(() => [
                          createVNode("a", {
                            href: navHref("overview")
                          }, "Overview", 8, ["href"])
                        ]),
                        _: 1
                      }),
                      currentRole.value === "admin" ? (openBlock(), createBlock(_component_a_menu_item, { key: "departments" }, {
                        default: withCtx(() => [
                          createVNode("a", {
                            href: navHref("departments")
                          }, "Departments", 8, ["href"])
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      createVNode(_component_a_menu_item, { key: "classrooms" }, {
                        default: withCtx(() => [
                          createVNode("a", {
                            href: navHref("classrooms")
                          }, "Classrooms", 8, ["href"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_menu_item, { key: "people" }, {
                        default: withCtx(() => [
                          createVNode("a", {
                            href: navHref("people")
                          }, "People Directory", 8, ["href"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_menu_item, { key: "catalog" }, {
                        default: withCtx(() => [
                          createVNode("a", {
                            href: navHref("catalog")
                          }, "Catalog", 8, ["href"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_menu_item, { key: "calendar" }, {
                        default: withCtx(() => [
                          createVNode("a", {
                            href: navHref("calendar")
                          }, "Calendar", 8, ["href"])
                        ]),
                        _: 1
                      }),
                      currentRole.value !== "student" ? (openBlock(), createBlock(_component_a_menu_item, { key: "assignments" }, {
                        default: withCtx(() => [
                          createVNode("a", {
                            href: navHref("assignments")
                          }, "Assignments", 8, ["href"])
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ]),
                    _: 1
                  }),
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
      if (currentRole.value !== "student" && currentRole.value !== "none") {
        _push(ssrRenderComponent(_component_a_skeleton, {
          loading: loading.value,
          active: "",
          paragraph: { rows: 6 }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_a_row, { gutter: 16 }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_col, { span: 12 }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_card, {
                            size: "small",
                            title: "Assign to Classroom"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_form, {
                                  layout: "vertical",
                                  onSubmit: () => {
                                  }
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_form_item, { label: "Teacher" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_select, {
                                              value: form.value.teacherId,
                                              "onUpdate:value": ($event) => form.value.teacherId = $event,
                                              options: teacherOptions.value,
                                              placeholder: "Select teacher"
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_select, {
                                                value: form.value.teacherId,
                                                "onUpdate:value": ($event) => form.value.teacherId = $event,
                                                options: teacherOptions.value,
                                                placeholder: "Select teacher"
                                              }, null, 8, ["value", "onUpdate:value", "options"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_a_form_item, { label: "Classroom" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_select, {
                                              value: form.value.classroomId,
                                              "onUpdate:value": ($event) => form.value.classroomId = $event,
                                              options: classroomOptions.value,
                                              placeholder: "Select classroom"
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_select, {
                                                value: form.value.classroomId,
                                                "onUpdate:value": ($event) => form.value.classroomId = $event,
                                                options: classroomOptions.value,
                                                placeholder: "Select classroom"
                                              }, null, 8, ["value", "onUpdate:value", "options"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_a_form_item, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_button, {
                                              type: "primary",
                                              onClick: assignToClassroom,
                                              disabled: !form.value.teacherId || !form.value.classroomId
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`Assign`);
                                                } else {
                                                  return [
                                                    createTextVNode("Assign")
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_button, {
                                                type: "primary",
                                                onClick: assignToClassroom,
                                                disabled: !form.value.teacherId || !form.value.classroomId
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Assign")
                                                ]),
                                                _: 1
                                              }, 8, ["disabled"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_a_form_item, { label: "Teacher" }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_select, {
                                              value: form.value.teacherId,
                                              "onUpdate:value": ($event) => form.value.teacherId = $event,
                                              options: teacherOptions.value,
                                              placeholder: "Select teacher"
                                            }, null, 8, ["value", "onUpdate:value", "options"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_form_item, { label: "Classroom" }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_select, {
                                              value: form.value.classroomId,
                                              "onUpdate:value": ($event) => form.value.classroomId = $event,
                                              options: classroomOptions.value,
                                              placeholder: "Select classroom"
                                            }, null, 8, ["value", "onUpdate:value", "options"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_form_item, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_button, {
                                              type: "primary",
                                              onClick: assignToClassroom,
                                              disabled: !form.value.teacherId || !form.value.classroomId
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Assign")
                                              ]),
                                              _: 1
                                            }, 8, ["disabled"])
                                          ]),
                                          _: 1
                                        })
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_form, {
                                    layout: "vertical",
                                    onSubmit: withModifiers(() => {
                                    }, ["prevent"])
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_form_item, { label: "Teacher" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_select, {
                                            value: form.value.teacherId,
                                            "onUpdate:value": ($event) => form.value.teacherId = $event,
                                            options: teacherOptions.value,
                                            placeholder: "Select teacher"
                                          }, null, 8, ["value", "onUpdate:value", "options"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, { label: "Classroom" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_select, {
                                            value: form.value.classroomId,
                                            "onUpdate:value": ($event) => form.value.classroomId = $event,
                                            options: classroomOptions.value,
                                            placeholder: "Select classroom"
                                          }, null, 8, ["value", "onUpdate:value", "options"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_button, {
                                            type: "primary",
                                            onClick: assignToClassroom,
                                            disabled: !form.value.teacherId || !form.value.classroomId
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Assign")
                                            ]),
                                            _: 1
                                          }, 8, ["disabled"])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["onSubmit"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_card, {
                              size: "small",
                              title: "Assign to Classroom"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_form, {
                                  layout: "vertical",
                                  onSubmit: withModifiers(() => {
                                  }, ["prevent"])
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_form_item, { label: "Teacher" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_select, {
                                          value: form.value.teacherId,
                                          "onUpdate:value": ($event) => form.value.teacherId = $event,
                                          options: teacherOptions.value,
                                          placeholder: "Select teacher"
                                        }, null, 8, ["value", "onUpdate:value", "options"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_form_item, { label: "Classroom" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_select, {
                                          value: form.value.classroomId,
                                          "onUpdate:value": ($event) => form.value.classroomId = $event,
                                          options: classroomOptions.value,
                                          placeholder: "Select classroom"
                                        }, null, 8, ["value", "onUpdate:value", "options"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_form_item, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_button, {
                                          type: "primary",
                                          onClick: assignToClassroom,
                                          disabled: !form.value.teacherId || !form.value.classroomId
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Assign")
                                          ]),
                                          _: 1
                                        }, 8, ["disabled"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["onSubmit"])
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_a_col, { span: 12 }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_card, {
                            size: "small",
                            title: "Assign to Course"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_form, {
                                  layout: "vertical",
                                  onSubmit: () => {
                                  }
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_form_item, { label: "Teacher" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_select, {
                                              value: form2.value.teacherId,
                                              "onUpdate:value": ($event) => form2.value.teacherId = $event,
                                              options: teacherOptions.value,
                                              placeholder: "Select teacher"
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_select, {
                                                value: form2.value.teacherId,
                                                "onUpdate:value": ($event) => form2.value.teacherId = $event,
                                                options: teacherOptions.value,
                                                placeholder: "Select teacher"
                                              }, null, 8, ["value", "onUpdate:value", "options"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_a_form_item, { label: "Course" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_select, {
                                              value: form2.value.courseId,
                                              "onUpdate:value": ($event) => form2.value.courseId = $event,
                                              options: courseOptions.value,
                                              placeholder: "Select course"
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_select, {
                                                value: form2.value.courseId,
                                                "onUpdate:value": ($event) => form2.value.courseId = $event,
                                                options: courseOptions.value,
                                                placeholder: "Select course"
                                              }, null, 8, ["value", "onUpdate:value", "options"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_a_form_item, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_button, {
                                              type: "primary",
                                              onClick: assignToCourse,
                                              disabled: !form2.value.teacherId || !form2.value.courseId
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`Assign`);
                                                } else {
                                                  return [
                                                    createTextVNode("Assign")
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_button, {
                                                type: "primary",
                                                onClick: assignToCourse,
                                                disabled: !form2.value.teacherId || !form2.value.courseId
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Assign")
                                                ]),
                                                _: 1
                                              }, 8, ["disabled"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_a_form_item, { label: "Teacher" }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_select, {
                                              value: form2.value.teacherId,
                                              "onUpdate:value": ($event) => form2.value.teacherId = $event,
                                              options: teacherOptions.value,
                                              placeholder: "Select teacher"
                                            }, null, 8, ["value", "onUpdate:value", "options"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_form_item, { label: "Course" }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_select, {
                                              value: form2.value.courseId,
                                              "onUpdate:value": ($event) => form2.value.courseId = $event,
                                              options: courseOptions.value,
                                              placeholder: "Select course"
                                            }, null, 8, ["value", "onUpdate:value", "options"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_form_item, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_button, {
                                              type: "primary",
                                              onClick: assignToCourse,
                                              disabled: !form2.value.teacherId || !form2.value.courseId
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Assign")
                                              ]),
                                              _: 1
                                            }, 8, ["disabled"])
                                          ]),
                                          _: 1
                                        })
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_form, {
                                    layout: "vertical",
                                    onSubmit: withModifiers(() => {
                                    }, ["prevent"])
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_form_item, { label: "Teacher" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_select, {
                                            value: form2.value.teacherId,
                                            "onUpdate:value": ($event) => form2.value.teacherId = $event,
                                            options: teacherOptions.value,
                                            placeholder: "Select teacher"
                                          }, null, 8, ["value", "onUpdate:value", "options"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, { label: "Course" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_select, {
                                            value: form2.value.courseId,
                                            "onUpdate:value": ($event) => form2.value.courseId = $event,
                                            options: courseOptions.value,
                                            placeholder: "Select course"
                                          }, null, 8, ["value", "onUpdate:value", "options"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_button, {
                                            type: "primary",
                                            onClick: assignToCourse,
                                            disabled: !form2.value.teacherId || !form2.value.courseId
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Assign")
                                            ]),
                                            _: 1
                                          }, 8, ["disabled"])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["onSubmit"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_card, {
                              size: "small",
                              title: "Assign to Course"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_form, {
                                  layout: "vertical",
                                  onSubmit: withModifiers(() => {
                                  }, ["prevent"])
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_form_item, { label: "Teacher" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_select, {
                                          value: form2.value.teacherId,
                                          "onUpdate:value": ($event) => form2.value.teacherId = $event,
                                          options: teacherOptions.value,
                                          placeholder: "Select teacher"
                                        }, null, 8, ["value", "onUpdate:value", "options"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_form_item, { label: "Course" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_select, {
                                          value: form2.value.courseId,
                                          "onUpdate:value": ($event) => form2.value.courseId = $event,
                                          options: courseOptions.value,
                                          placeholder: "Select course"
                                        }, null, 8, ["value", "onUpdate:value", "options"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_form_item, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_button, {
                                          type: "primary",
                                          onClick: assignToCourse,
                                          disabled: !form2.value.teacherId || !form2.value.courseId
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Assign")
                                          ]),
                                          _: 1
                                        }, 8, ["disabled"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["onSubmit"])
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_a_col, { span: 12 }, {
                        default: withCtx(() => [
                          createVNode(_component_a_card, {
                            size: "small",
                            title: "Assign to Classroom"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_form, {
                                layout: "vertical",
                                onSubmit: withModifiers(() => {
                                }, ["prevent"])
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_form_item, { label: "Teacher" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_select, {
                                        value: form.value.teacherId,
                                        "onUpdate:value": ($event) => form.value.teacherId = $event,
                                        options: teacherOptions.value,
                                        placeholder: "Select teacher"
                                      }, null, 8, ["value", "onUpdate:value", "options"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_form_item, { label: "Classroom" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_select, {
                                        value: form.value.classroomId,
                                        "onUpdate:value": ($event) => form.value.classroomId = $event,
                                        options: classroomOptions.value,
                                        placeholder: "Select classroom"
                                      }, null, 8, ["value", "onUpdate:value", "options"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_form_item, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        onClick: assignToClassroom,
                                        disabled: !form.value.teacherId || !form.value.classroomId
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Assign")
                                        ]),
                                        _: 1
                                      }, 8, ["disabled"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["onSubmit"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_col, { span: 12 }, {
                        default: withCtx(() => [
                          createVNode(_component_a_card, {
                            size: "small",
                            title: "Assign to Course"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_form, {
                                layout: "vertical",
                                onSubmit: withModifiers(() => {
                                }, ["prevent"])
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_form_item, { label: "Teacher" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_select, {
                                        value: form2.value.teacherId,
                                        "onUpdate:value": ($event) => form2.value.teacherId = $event,
                                        options: teacherOptions.value,
                                        placeholder: "Select teacher"
                                      }, null, 8, ["value", "onUpdate:value", "options"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_form_item, { label: "Course" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_select, {
                                        value: form2.value.courseId,
                                        "onUpdate:value": ($event) => form2.value.courseId = $event,
                                        options: courseOptions.value,
                                        placeholder: "Select course"
                                      }, null, 8, ["value", "onUpdate:value", "options"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_form_item, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        onClick: assignToCourse,
                                        disabled: !form2.value.teacherId || !form2.value.courseId
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Assign")
                                        ]),
                                        _: 1
                                      }, 8, ["disabled"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["onSubmit"])
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
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_a_card, {
                size: "small",
                title: "Current Assignments",
                style: { "margin-top": "16px" }
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_table, {
                      size: "small",
                      columns,
                      dataSource: assignments.value,
                      "row-key": "id"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_a_table, {
                        size: "small",
                        columns,
                        dataSource: assignments.value,
                        "row-key": "id"
                      }, null, 8, ["dataSource"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_a_row, { gutter: 16 }, {
                  default: withCtx(() => [
                    createVNode(_component_a_col, { span: 12 }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          size: "small",
                          title: "Assign to Classroom"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_form, {
                              layout: "vertical",
                              onSubmit: withModifiers(() => {
                              }, ["prevent"])
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_form_item, { label: "Teacher" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_select, {
                                      value: form.value.teacherId,
                                      "onUpdate:value": ($event) => form.value.teacherId = $event,
                                      options: teacherOptions.value,
                                      placeholder: "Select teacher"
                                    }, null, 8, ["value", "onUpdate:value", "options"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form_item, { label: "Classroom" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_select, {
                                      value: form.value.classroomId,
                                      "onUpdate:value": ($event) => form.value.classroomId = $event,
                                      options: classroomOptions.value,
                                      placeholder: "Select classroom"
                                    }, null, 8, ["value", "onUpdate:value", "options"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form_item, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      type: "primary",
                                      onClick: assignToClassroom,
                                      disabled: !form.value.teacherId || !form.value.classroomId
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Assign")
                                      ]),
                                      _: 1
                                    }, 8, ["disabled"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["onSubmit"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, { span: 12 }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          size: "small",
                          title: "Assign to Course"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_form, {
                              layout: "vertical",
                              onSubmit: withModifiers(() => {
                              }, ["prevent"])
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_form_item, { label: "Teacher" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_select, {
                                      value: form2.value.teacherId,
                                      "onUpdate:value": ($event) => form2.value.teacherId = $event,
                                      options: teacherOptions.value,
                                      placeholder: "Select teacher"
                                    }, null, 8, ["value", "onUpdate:value", "options"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form_item, { label: "Course" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_select, {
                                      value: form2.value.courseId,
                                      "onUpdate:value": ($event) => form2.value.courseId = $event,
                                      options: courseOptions.value,
                                      placeholder: "Select course"
                                    }, null, 8, ["value", "onUpdate:value", "options"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form_item, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      type: "primary",
                                      onClick: assignToCourse,
                                      disabled: !form2.value.teacherId || !form2.value.courseId
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Assign")
                                      ]),
                                      _: 1
                                    }, 8, ["disabled"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["onSubmit"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(_component_a_card, {
                  size: "small",
                  title: "Current Assignments",
                  style: { "margin-top": "16px" }
                }, {
                  default: withCtx(() => [
                    createVNode(_component_a_table, {
                      size: "small",
                      columns,
                      dataSource: assignments.value,
                      "row-key": "id"
                    }, null, 8, ["dataSource"])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_component_a_result, {
          status: "403",
          title: "Not allowed",
          "sub-title": "This page is for teachers and administrators."
        }, {
          extra: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_a_button, {
                type: "primary",
                href: navHref("overview")
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Go to portal`);
                  } else {
                    return [
                      createTextVNode("Go to portal")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_a_button, {
                  type: "primary",
                  href: navHref("overview")
                }, {
                  default: withCtx(() => [
                    createTextVNode("Go to portal")
                  ]),
                  _: 1
                }, 8, ["href"])
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/institution-portal/nuxt/pages/assignments/teachers.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const teachers = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0a1e945b"]]);

export { teachers as default };
//# sourceMappingURL=teachers-Bb65d7Ql.mjs.map
