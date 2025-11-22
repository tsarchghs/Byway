import { defineComponent, computed, ref, resolveComponent, mergeProps, withCtx, createVNode, createBlock, createCommentVNode, openBlock, createTextVNode, Fragment, useSSRContext } from 'vue';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const runtime = useRuntimeConfig();
    const apiBase = runtime.public?.apiBase || runtime.public?.appBaseUrl || "";
    const institutionId = computed(() => route.query.institutionId || route.params?.institution_id || "inst_byway");
    const loading = ref(true);
    const q = ref("");
    const difficulty = ref(void 0);
    const courses = ref([]);
    const modulesByCourse = ref({});
    const currentRole = ref("none");
    ref(null);
    const teacherIds = ref([]);
    const firstDepartmentId = ref(null);
    const firstClassroomId = ref(null);
    function resolveAuthHeader() {
      return null;
    }
    async function load() {
      loading.value = true;
      try {
        const auth = resolveAuthHeader();
        if (!auth) throw new Error("Missing auth token");
        const baseUrl = apiBase ? apiBase.replace(/\/$/, "") : "";
        const url = `${baseUrl}/api/institution-portal/catalog?institutionId=${encodeURIComponent(institutionId.value)}`;
        const resp = await fetch(url, { headers: { Authorization: auth } });
        let json = null;
        if (resp.ok) {
          json = await resp.json();
        } else {
          const fallback = await fetch(`${baseUrl}/api/teach-internal/courses`, { headers: { Authorization: auth } });
          if (!fallback.ok) throw new Error(await fallback.text().catch(() => `HTTP ${fallback.status}`));
          const payload = await fallback.json().catch(() => ({}));
          const items = Array.isArray(payload?.data) ? payload.data : [];
          json = { courses: items.map((c) => ({ courseId: c.id, title: c.title, teacherId: c.teacherId || null, category: c.category || null, difficulty: c.difficulty || null, availability: "available" })) };
        }
        courses.value = json.courses || [];
        await loadModulesForCourses(auth);
        await loadInstitutionTeachers(auth);
      } catch (e) {
        message.error(e?.message || "Failed to load catalog");
      } finally {
        loading.value = false;
      }
    }
    const filtered = computed(() => {
      return courses.value.filter((c) => difficulty.value ? c.difficulty === difficulty.value : true).filter((c) => q.value ? String(c.title).toLowerCase().includes(q.value.toLowerCase()) : true);
    });
    const difficultyOptions = [
      { label: "Beginner", value: "beginner" },
      { label: "Intermediate", value: "intermediate" },
      { label: "Advanced", value: "advanced" }
    ];
    const columns = [
      { title: "Course", dataIndex: "title", key: "title" },
      { title: "Teacher", dataIndex: "teacherId", key: "teacherId" },
      { title: "Category", dataIndex: "category", key: "category" },
      { title: "Difficulty", dataIndex: "difficulty", key: "difficulty" },
      { title: "Availability", dataIndex: "availability", key: "availability" },
      { title: "Actions", key: "actions" }
    ];
    async function loadModulesForCourses(auth) {
      try {
        const baseUrl = apiBase ? apiBase.replace(/\/$/, "") : "";
        const resp = await fetch(`${baseUrl}/api/teach-internal/modules`, { headers: { Authorization: auth } });
        if (!resp.ok) return;
        const data = await resp.json().catch(() => null);
        const arr = Array.isArray(data) ? data : Array.isArray(data?.modules) ? data.modules : [];
        const grouped = {};
        arr.forEach((m) => {
          const cid = m.courseId || m.course_id || "";
          if (!cid) return;
          grouped[cid] = grouped[cid] || [];
          grouped[cid].push(m);
        });
        modulesByCourse.value = grouped;
      } catch {
      }
    }
    async function loadInstitutionTeachers(auth) {
      try {
        const baseUrl = apiBase ? apiBase.replace(/\/$/, "") : "";
        const resp = await fetch(`${baseUrl}/api/institutions/graphql`, {
          method: "POST",
          headers: { "content-type": "application/json", Authorization: auth },
          body: JSON.stringify({
            query: `query($institutionId:String!){ classrooms(institutionId:$institutionId){ id departmentId teacherId } }`,
            variables: { institutionId: institutionId.value }
          })
        });
        const json = await resp.json().catch(() => null);
        const arr = Array.isArray(json?.data?.classrooms) ? json.data.classrooms : [];
        teacherIds.value = Array.from(new Set(arr.map((c) => String(c.teacherId || "")).filter(Boolean)));
        firstClassroomId.value = arr[0]?.id || null;
        firstDepartmentId.value = arr.find((c) => c.departmentId)?.departmentId || null;
      } catch {
      }
    }
    function courseLink(record) {
      const cid = record.courseId || record.id;
      const teacherId = record.teacherId || record.teacher_id || "teacher";
      const mods = modulesByCourse.value[cid] || [];
      const mod = mods[0];
      if (mod?.id) return `/teach-internal/${encodeURIComponent(teacherId)}/course/${encodeURIComponent(cid)}/module/${encodeURIComponent(mod.id)}/view`;
      return `/teach-internal/${encodeURIComponent(teacherId)}`;
    }
    function navHref(key) {
      const qs = `?institutionId=${encodeURIComponent(institutionId.value)}`;
      if (key === "overview") return `/institution/portal${qs}`;
      if (key === "departments") return firstDepartmentId.value ? `/institution/departments/${encodeURIComponent(firstDepartmentId.value)}${qs}` : `/institution/portal${qs}`;
      if (key === "classrooms") return firstClassroomId.value ? `/institution/classrooms/${encodeURIComponent(firstClassroomId.value)}${qs}` : `/institution/portal${qs}`;
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
      const _component_a_input = resolveComponent("a-input");
      const _component_a_select = resolveComponent("a-select");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_skeleton = resolveComponent("a-skeleton");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_tag = resolveComponent("a-tag");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "catalog-page" }, _attrs))} data-v-5d0376b8>`);
      _push(ssrRenderComponent(_component_a_page_header, { title: "Institution Course Catalog" }, {
        extra: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_space, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_menu, {
                    mode: "horizontal",
                    selectedKeys: ["catalog"]
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "overview" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<a${ssrRenderAttr("href", navHref("overview"))} data-v-5d0376b8${_scopeId4}>Overview</a>`);
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
                                _push5(`<a${ssrRenderAttr("href", navHref("departments"))} data-v-5d0376b8${_scopeId4}>Departments</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("classrooms"))} data-v-5d0376b8${_scopeId4}>Classrooms</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("people"))} data-v-5d0376b8${_scopeId4}>People Directory</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("catalog"))} data-v-5d0376b8${_scopeId4}>Catalog</a>`);
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
                              _push5(`<a${ssrRenderAttr("href", navHref("calendar"))} data-v-5d0376b8${_scopeId4}>Calendar</a>`);
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
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "assignments" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<a${ssrRenderAttr("href", navHref("assignments"))} data-v-5d0376b8${_scopeId4}>Assignments</a>`);
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
                          createVNode(_component_a_menu_item, { key: "assignments" }, {
                            default: withCtx(() => [
                              createVNode("a", {
                                href: navHref("assignments")
                              }, "Assignments", 8, ["href"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_input, {
                    value: q.value,
                    "onUpdate:value": ($event) => q.value = $event,
                    placeholder: "Search",
                    style: { "width": "220px" }
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_select, {
                    value: difficulty.value,
                    "onUpdate:value": ($event) => difficulty.value = $event,
                    placeholder: "Difficulty",
                    style: { "width": "160px" },
                    "allow-clear": "",
                    options: difficultyOptions
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
                    createVNode(_component_a_menu, {
                      mode: "horizontal",
                      selectedKeys: ["catalog"]
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
                        createVNode(_component_a_menu_item, { key: "assignments" }, {
                          default: withCtx(() => [
                            createVNode("a", {
                              href: navHref("assignments")
                            }, "Assignments", 8, ["href"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_input, {
                      value: q.value,
                      "onUpdate:value": ($event) => q.value = $event,
                      placeholder: "Search",
                      style: { "width": "220px" }
                    }, null, 8, ["value", "onUpdate:value"]),
                    createVNode(_component_a_select, {
                      value: difficulty.value,
                      "onUpdate:value": ($event) => difficulty.value = $event,
                      placeholder: "Difficulty",
                      style: { "width": "160px" },
                      "allow-clear": "",
                      options: difficultyOptions
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
                  createVNode(_component_a_menu, {
                    mode: "horizontal",
                    selectedKeys: ["catalog"]
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
                      createVNode(_component_a_menu_item, { key: "assignments" }, {
                        default: withCtx(() => [
                          createVNode("a", {
                            href: navHref("assignments")
                          }, "Assignments", 8, ["href"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_input, {
                    value: q.value,
                    "onUpdate:value": ($event) => q.value = $event,
                    placeholder: "Search",
                    style: { "width": "220px" }
                  }, null, 8, ["value", "onUpdate:value"]),
                  createVNode(_component_a_select, {
                    value: difficulty.value,
                    "onUpdate:value": ($event) => difficulty.value = $event,
                    placeholder: "Difficulty",
                    style: { "width": "160px" },
                    "allow-clear": "",
                    options: difficultyOptions
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
        paragraph: { rows: 8 }
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
                    "row-key": "courseId",
                    pagination: { pageSize: 8 }
                  }, {
                    bodyCell: withCtx(({ column, record }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (column.key === "actions") {
                          _push4(`<a${ssrRenderAttr("href", courseLink(record))} data-v-5d0376b8${_scopeId3}>Open</a>`);
                        } else if (column.key === "availability") {
                          _push4(`<!--[-->`);
                          if (teacherIds.value.includes(String(record.teacherId || record.teacher_id || ""))) {
                            _push4(ssrRenderComponent(_component_a_tag, { color: "geekblue" }, {
                              default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`Institution course`);
                                } else {
                                  return [
                                    createTextVNode("Institution course")
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(ssrRenderComponent(_component_a_tag, { color: "purple" }, {
                              default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`Global course`);
                                } else {
                                  return [
                                    createTextVNode("Global course")
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          }
                          _push4(`<!--]-->`);
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          column.key === "actions" ? (openBlock(), createBlock("a", {
                            key: 0,
                            href: courseLink(record)
                          }, "Open", 8, ["href"])) : column.key === "availability" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                            teacherIds.value.includes(String(record.teacherId || record.teacher_id || "")) ? (openBlock(), createBlock(_component_a_tag, {
                              key: 0,
                              color: "geekblue"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Institution course")
                              ]),
                              _: 1
                            })) : (openBlock(), createBlock(_component_a_tag, {
                              key: 1,
                              color: "purple"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Global course")
                              ]),
                              _: 1
                            }))
                          ], 64)) : createCommentVNode("", true)
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
                      "row-key": "courseId",
                      pagination: { pageSize: 8 }
                    }, {
                      bodyCell: withCtx(({ column, record }) => [
                        column.key === "actions" ? (openBlock(), createBlock("a", {
                          key: 0,
                          href: courseLink(record)
                        }, "Open", 8, ["href"])) : column.key === "availability" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                          teacherIds.value.includes(String(record.teacherId || record.teacher_id || "")) ? (openBlock(), createBlock(_component_a_tag, {
                            key: 0,
                            color: "geekblue"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Institution course")
                            ]),
                            _: 1
                          })) : (openBlock(), createBlock(_component_a_tag, {
                            key: 1,
                            color: "purple"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Global course")
                            ]),
                            _: 1
                          }))
                        ], 64)) : createCommentVNode("", true)
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
                    "row-key": "courseId",
                    pagination: { pageSize: 8 }
                  }, {
                    bodyCell: withCtx(({ column, record }) => [
                      column.key === "actions" ? (openBlock(), createBlock("a", {
                        key: 0,
                        href: courseLink(record)
                      }, "Open", 8, ["href"])) : column.key === "availability" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                        teacherIds.value.includes(String(record.teacherId || record.teacher_id || "")) ? (openBlock(), createBlock(_component_a_tag, {
                          key: 0,
                          color: "geekblue"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Institution course")
                          ]),
                          _: 1
                        })) : (openBlock(), createBlock(_component_a_tag, {
                          key: 1,
                          color: "purple"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Global course")
                          ]),
                          _: 1
                        }))
                      ], 64)) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/institution-portal/nuxt/pages/catalog/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5d0376b8"]]);

export { index as default };
//# sourceMappingURL=index-B9hEwdsE.mjs.map
