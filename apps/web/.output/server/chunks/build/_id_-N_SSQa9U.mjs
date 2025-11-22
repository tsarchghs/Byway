import { defineComponent, ref, computed, resolveComponent, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { u as useAuth } from './useAuth-B8D9e8en.mjs';
import { ReloadOutlined, SettingOutlined, UserAddOutlined, PlusOutlined } from '@ant-design/icons-vue';
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
import '@apollo/client/core/index.js';
import '@apollo/client/link/context/index.js';
import '@vue/apollo-composable';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const config = useRuntimeConfig();
    const apiBase = config.public?.apiBase || "http://localhost:4000";
    const { token } = useAuth();
    const inst = ref(null);
    const departments = ref([]);
    const classrooms = ref([]);
    const members = ref([]);
    const invites = ref([]);
    const loading = ref(false);
    const classFilter = ref("");
    const settingsOpen = ref(false);
    const deptOpen = ref(false);
    const classOpen = ref(false);
    const inviteOpen = ref(false);
    const selectedDept = ref(null);
    const instForm = ref({});
    const deptForm = ref({});
    const classForm = ref({});
    const inviteForm = ref({ role: "student", expiresAt: null });
    const selectedCourseId = ref(void 0);
    const selectedModuleIds = ref([]);
    const courseOptions = ref([]);
    const moduleOptions = ref([]);
    function tokenHeader() {
      const t = token?.value || "";
      return t ? { Authorization: `Bearer ${t}` } : {};
    }
    async function gql(query, variables = {}) {
      const resp = await fetch(`${apiBase}/api/institutions/graphql`, {
        method: "POST",
        headers: { "content-type": "application/json", ...tokenHeader() },
        body: JSON.stringify({ query, variables })
      });
      const json = await resp.json();
      if (json.errors?.length) throw new Error(json.errors[0].message);
      return json.data;
    }
    async function load() {
      loading.value = true;
      try {
        const id = String(route.params.id);
        const data = await gql(
          `
      query($id:String!){
        institution(id:$id){ id name slug type location email phone active }
        departments(institutionId:$id){ id name slug active }
        classrooms(institutionId:$id){ id title code departmentId capacity status courseIds enrollments { id } }
        members(institutionId:$id){ id userId role status }
        stats(institutionId:$id){ classrooms activeClassrooms departments members students }
      }
    `,
          { id }
        );
        inst.value = data?.institution || null;
        departments.value = data?.departments || [];
        classrooms.value = (data?.classrooms || []).map((c) => ({
          ...c,
          enrollment: c.enrollments?.length || 0
        }));
        members.value = data?.members || [];
      } catch (e) {
        message.error(e?.message || "Unable to load institution");
      } finally {
        loading.value = false;
      }
    }
    const filteredClassrooms = computed(() => {
      return classrooms.value.filter((c) => {
        const matchesDept = selectedDept.value ? c.departmentId === selectedDept.value.id : true;
        const matchesText = classFilter.value ? (c.title || "").toLowerCase().includes(classFilter.value.toLowerCase()) || (c.code || "").toLowerCase().includes(classFilter.value.toLowerCase()) : true;
        return matchesDept && matchesText;
      });
    });
    const classroomStats = computed(() => {
      const total = classrooms.value.length;
      const active = classrooms.value.filter((c) => c.status === "active").length;
      return { total, active };
    });
    const totalEnrollment = computed(() => classrooms.value.reduce((s, c) => s + (c.enrollment || 0), 0));
    function deptName(id) {
      if (!id) return "—";
      return departments.value.find((d) => d.id === id)?.name || "—";
    }
    function selectDept(d) {
      selectedDept.value = selectedDept.value?.id === d.id ? null : d;
    }
    function openSettings() {
      instForm.value = { ...inst.value };
      settingsOpen.value = true;
    }
    function openDept(d) {
      deptForm.value = d ? { ...d } : { name: "", slug: "", active: true };
      deptOpen.value = true;
    }
    function openClassroom(c) {
      classForm.value = c ? { ...c } : { title: "", code: "", departmentId: selectedDept.value?.id, capacity: 30, status: "active" };
      classOpen.value = true;
      loadCourseOptions();
      try {
        const raw = classForm.value?.courseIds;
        if (raw) {
          const parsed = JSON.parse(raw);
          selectedCourseId.value = parsed?.courseId || void 0;
          selectedModuleIds.value = Array.isArray(parsed?.preferredModuleIds) ? parsed.preferredModuleIds : [];
          if (selectedCourseId.value) loadModuleOptions(String(selectedCourseId.value));
        }
      } catch {
      }
    }
    function openInvite() {
      inviteForm.value = { role: "student", expiresAt: null };
      inviteOpen.value = true;
    }
    async function saveSettings() {
      try {
        await gql(
          `mutation($id:String!,$name:String,$slug:String,$type:String,$location:String,$email:String,$phone:String,$active:Boolean){
        updateInstitution(id:$id,name:$name,slug:$slug,type:$type,location:$location,email:$email,phone:$phone,active:$active){ id }
      }`,
          { ...instForm.value, id: inst.value.id }
        );
        settingsOpen.value = false;
        await load();
        message.success("Institution updated");
      } catch (e) {
        message.error(e?.message || "Update failed");
      }
    }
    async function saveDept() {
      try {
        const vars = { institutionId: inst.value.id, ...deptForm.value };
        const mutation = deptForm.value.id ? `mutation($id:String!,$name:String,$slug:String,$contact:String,$head:String,$active:Boolean){ updateDepartment(id:$id,name:$name,slug:$slug,contact:$contact,head:$head,active:$active){ id } }` : `mutation($institutionId:String!,$name:String!,$slug:String!,$contact:String,$head:String,$active:Boolean){ createDepartment(institutionId:$institutionId,name:$name,slug:$slug,contact:$contact,head:$head,active:$active){ id } }`;
        await gql(mutation, vars);
        deptOpen.value = false;
        await load();
        message.success("Department saved");
      } catch (e) {
        message.error(e?.message || "Save failed");
      }
    }
    async function saveClassroom() {
      try {
        const vars = { institutionId: inst.value.id, ...classForm.value };
        const mutation = classForm.value.id ? `mutation($id:String!,$departmentId:String,$name:String,$code:String,$teacherId:String,$capacity:Int,$status:String,$startsAt:String,$endsAt:String,$courseIds:String){
          updateClassroom(id:$id,departmentId:$departmentId,name:$name,code:$code,teacherId:$teacherId,capacity:$capacity,status:$status,startsAt:$startsAt,endsAt:$endsAt,courseIds:$courseIds){ id }
        }` : `mutation($institutionId:String!,$departmentId:String,$name:String!,$code:String!,$teacherId:String,$capacity:Int,$status:String,$startsAt:String,$endsAt:String,$courseIds:String){
          createClassroom(institutionId:$institutionId,departmentId:$departmentId,name:$name,code:$code,teacherId:$teacherId,capacity:$capacity,status:$status,startsAt:$startsAt,endsAt:$endsAt,courseIds:$courseIds){ id }
        }`;
        vars.name = vars.title || vars.name;
        if (selectedCourseId.value) {
          vars.courseIds = JSON.stringify({ courseId: selectedCourseId.value, preferredModuleIds: selectedModuleIds.value });
        }
        await gql(mutation, vars);
        classOpen.value = false;
        await load();
        message.success("Classroom saved");
      } catch (e) {
        message.error(e?.message || "Save failed");
      }
    }
    async function saveInvite() {
      try {
        const vars = { institutionId: inst.value.id, role: inviteForm.value.role };
        if (inviteForm.value.expiresAt) vars.expiresAt = inviteForm.value.expiresAt;
        await gql(`mutation($institutionId:String!,$role:String!,$expiresAt:String){ createInvite(institutionId:$institutionId, role:$role, expiresAt:$expiresAt){ id code } }`, vars);
        inviteOpen.value = false;
        message.success("Invite created");
        await loadInvites();
      } catch (e) {
        message.error(e?.message || "Invite failed");
      }
    }
    async function loadInvites() {
      try {
        const data = await gql(`query($id:String!){ stats(institutionId:$id){ members } }`, { id: inst.value.id });
      } catch {
      }
    }
    function editClassroom(c) {
      openClassroom({ ...c, name: c.title });
    }
    function refresh() {
      load();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_button = resolveComponent("a-button");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_list = resolveComponent("a-list");
      const _component_a_list_item = resolveComponent("a-list-item");
      const _component_a_list_item_meta = resolveComponent("a-list-item-meta");
      const _component_a_input_search = resolveComponent("a-input-search");
      const _component_a_empty = resolveComponent("a-empty");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_modal = resolveComponent("a-modal");
      const _component_a_form = resolveComponent("a-form");
      const _component_a_form_item = resolveComponent("a-form-item");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_switch = resolveComponent("a-switch");
      const _component_a_select = resolveComponent("a-select");
      const _component_a_select_option = resolveComponent("a-select-option");
      const _component_a_input_number = resolveComponent("a-input-number");
      const _component_a_date_picker = resolveComponent("a-date-picker");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "inst-page" }, _attrs))} data-v-7c9ec049><div class="page-header" data-v-7c9ec049><div data-v-7c9ec049><div class="title" data-v-7c9ec049>${ssrInterpolate(inst.value?.name || "Institution")}</div><div class="subtitle" data-v-7c9ec049>${ssrInterpolate(inst.value?.location || "No location set")}</div></div><div class="actions" data-v-7c9ec049>`);
      _push(ssrRenderComponent(_component_a_button, {
        onClick: refresh,
        loading: loading.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ReloadOutlined), null, null, _parent2, _scopeId));
            _push2(` Refresh`);
          } else {
            return [
              createVNode(unref(ReloadOutlined)),
              createTextVNode(" Refresh")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_button, {
        type: "default",
        onClick: openSettings
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(SettingOutlined), null, null, _parent2, _scopeId));
            _push2(` Settings`);
          } else {
            return [
              createVNode(unref(SettingOutlined)),
              createTextVNode(" Settings")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_button, {
        type: "primary",
        onClick: openInvite
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(UserAddOutlined), null, null, _parent2, _scopeId));
            _push2(` Invite`);
          } else {
            return [
              createVNode(unref(UserAddOutlined)),
              createTextVNode(" Invite")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_button, {
        type: "primary",
        onClick: openDept
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(PlusOutlined), null, null, _parent2, _scopeId));
            _push2(` Add Department`);
          } else {
            return [
              createVNode(unref(PlusOutlined)),
              createTextVNode(" Add Department")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_button, {
        type: "primary",
        onClick: openClassroom
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(PlusOutlined), null, null, _parent2, _scopeId));
            _push2(` New Classroom`);
          } else {
            return [
              createVNode(unref(PlusOutlined)),
              createTextVNode(" New Classroom")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_a_row, {
        gutter: 16,
        class: "section"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_col, {
              xs: 12,
              md: 6
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_card, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="stat-label" data-v-7c9ec049${_scopeId3}>Departments</div><div class="stat-value" data-v-7c9ec049${_scopeId3}>${ssrInterpolate(departments.value.length)}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "stat-label" }, "Departments"),
                          createVNode("div", { class: "stat-value" }, toDisplayString(departments.value.length), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "stat-label" }, "Departments"),
                        createVNode("div", { class: "stat-value" }, toDisplayString(departments.value.length), 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_col, {
              xs: 12,
              md: 6
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_card, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="stat-label" data-v-7c9ec049${_scopeId3}>Classrooms</div><div class="stat-value" data-v-7c9ec049${_scopeId3}>${ssrInterpolate(classroomStats.value.total)}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "stat-label" }, "Classrooms"),
                          createVNode("div", { class: "stat-value" }, toDisplayString(classroomStats.value.total), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "stat-label" }, "Classrooms"),
                        createVNode("div", { class: "stat-value" }, toDisplayString(classroomStats.value.total), 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_col, {
              xs: 12,
              md: 6
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_card, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="stat-label" data-v-7c9ec049${_scopeId3}>Active Classrooms</div><div class="stat-value" data-v-7c9ec049${_scopeId3}>${ssrInterpolate(classroomStats.value.active)}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "stat-label" }, "Active Classrooms"),
                          createVNode("div", { class: "stat-value" }, toDisplayString(classroomStats.value.active), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "stat-label" }, "Active Classrooms"),
                        createVNode("div", { class: "stat-value" }, toDisplayString(classroomStats.value.active), 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_col, {
              xs: 12,
              md: 6
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_card, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="stat-label" data-v-7c9ec049${_scopeId3}>Total Enrollment</div><div class="stat-value" data-v-7c9ec049${_scopeId3}>${ssrInterpolate(totalEnrollment.value)}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "stat-label" }, "Total Enrollment"),
                          createVNode("div", { class: "stat-value" }, toDisplayString(totalEnrollment.value), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "stat-label" }, "Total Enrollment"),
                        createVNode("div", { class: "stat-value" }, toDisplayString(totalEnrollment.value), 1)
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
                xs: 12,
                md: 6
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_card, null, {
                    default: withCtx(() => [
                      createVNode("div", { class: "stat-label" }, "Departments"),
                      createVNode("div", { class: "stat-value" }, toDisplayString(departments.value.length), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_a_col, {
                xs: 12,
                md: 6
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_card, null, {
                    default: withCtx(() => [
                      createVNode("div", { class: "stat-label" }, "Classrooms"),
                      createVNode("div", { class: "stat-value" }, toDisplayString(classroomStats.value.total), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_a_col, {
                xs: 12,
                md: 6
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_card, null, {
                    default: withCtx(() => [
                      createVNode("div", { class: "stat-label" }, "Active Classrooms"),
                      createVNode("div", { class: "stat-value" }, toDisplayString(classroomStats.value.active), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_a_col, {
                xs: 12,
                md: 6
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_card, null, {
                    default: withCtx(() => [
                      createVNode("div", { class: "stat-label" }, "Total Enrollment"),
                      createVNode("div", { class: "stat-value" }, toDisplayString(totalEnrollment.value), 1)
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
      _push(ssrRenderComponent(_component_a_row, {
        gutter: 16,
        class: "section"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_col, {
              xs: 24,
              md: 6
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_card, {
                    title: "Departments",
                    loading: loading.value
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_list, { "data-source": departments.value }, {
                          renderItem: withCtx(({ item: d }, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_list_item, {
                                class: ["dept-item", selectedDept.value?.id === d.id ? "active" : ""],
                                onClick: ($event) => selectDept(d)
                              }, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_list_item_meta, {
                                      title: d.name,
                                      description: d.active ? "Active" : "Inactive"
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_list_item_meta, {
                                        title: d.name,
                                        description: d.active ? "Active" : "Inactive"
                                      }, null, 8, ["title", "description"])
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_list_item, {
                                  class: ["dept-item", selectedDept.value?.id === d.id ? "active" : ""],
                                  onClick: ($event) => selectDept(d)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_list_item_meta, {
                                      title: d.name,
                                      description: d.active ? "Active" : "Inactive"
                                    }, null, 8, ["title", "description"])
                                  ]),
                                  _: 2
                                }, 1032, ["class", "onClick"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_list, { "data-source": departments.value }, {
                            renderItem: withCtx(({ item: d }) => [
                              createVNode(_component_a_list_item, {
                                class: ["dept-item", selectedDept.value?.id === d.id ? "active" : ""],
                                onClick: ($event) => selectDept(d)
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_list_item_meta, {
                                    title: d.name,
                                    description: d.active ? "Active" : "Inactive"
                                  }, null, 8, ["title", "description"])
                                ]),
                                _: 2
                              }, 1032, ["class", "onClick"])
                            ]),
                            _: 1
                          }, 8, ["data-source"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, {
                      title: "Departments",
                      loading: loading.value
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_list, { "data-source": departments.value }, {
                          renderItem: withCtx(({ item: d }) => [
                            createVNode(_component_a_list_item, {
                              class: ["dept-item", selectedDept.value?.id === d.id ? "active" : ""],
                              onClick: ($event) => selectDept(d)
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_list_item_meta, {
                                  title: d.name,
                                  description: d.active ? "Active" : "Inactive"
                                }, null, 8, ["title", "description"])
                              ]),
                              _: 2
                            }, 1032, ["class", "onClick"])
                          ]),
                          _: 1
                        }, 8, ["data-source"])
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_col, {
              xs: 24,
              md: 12
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_card, {
                    title: selectedDept.value ? `${selectedDept.value.name} Classrooms` : "All Classrooms",
                    loading: loading.value
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input_search, {
                          value: classFilter.value,
                          "onUpdate:value": ($event) => classFilter.value = $event,
                          placeholder: "Search classrooms...",
                          class: "mb-3"
                        }, null, _parent4, _scopeId3));
                        if (filteredClassrooms.value.length === 0) {
                          _push4(ssrRenderComponent(_component_a_empty, { description: "No classrooms" }, null, _parent4, _scopeId3));
                        } else {
                          _push4(ssrRenderComponent(_component_a_row, { gutter: 12 }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<!--[-->`);
                                ssrRenderList(filteredClassrooms.value, (c) => {
                                  _push5(ssrRenderComponent(_component_a_col, {
                                    key: c.id,
                                    xs: 24,
                                    sm: 12
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_component_a_card, { hoverable: "" }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`<div class="card-head" data-v-7c9ec049${_scopeId6}><div data-v-7c9ec049${_scopeId6}><div class="card-title" data-v-7c9ec049${_scopeId6}>${ssrInterpolate(c.title || c.code)}</div><div class="card-sub" data-v-7c9ec049${_scopeId6}>${ssrInterpolate(c.code)}</div></div>`);
                                              _push7(ssrRenderComponent(_component_a_tag, {
                                                color: c.status === "active" ? "green" : "default"
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(c.status || "pending")}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(c.status || "pending"), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                              _push7(`</div><div class="row" data-v-7c9ec049${_scopeId6}><span data-v-7c9ec049${_scopeId6}>Capacity</span><strong data-v-7c9ec049${_scopeId6}>${ssrInterpolate(c.capacity || 30)}</strong></div><div class="row" data-v-7c9ec049${_scopeId6}><span data-v-7c9ec049${_scopeId6}>Enrollment</span><strong data-v-7c9ec049${_scopeId6}>${ssrInterpolate(c.enrollment || 0)}</strong></div><div class="row" data-v-7c9ec049${_scopeId6}><span data-v-7c9ec049${_scopeId6}>Department</span><strong data-v-7c9ec049${_scopeId6}>${ssrInterpolate(deptName(c.departmentId))}</strong></div><div class="card-actions" data-v-7c9ec049${_scopeId6}>`);
                                              _push7(ssrRenderComponent(_component_a_button, {
                                                size: "small",
                                                onClick: ($event) => editClassroom(c)
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`Edit`);
                                                  } else {
                                                    return [
                                                      createTextVNode("Edit")
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                              _push7(`</div>`);
                                            } else {
                                              return [
                                                createVNode("div", { class: "card-head" }, [
                                                  createVNode("div", null, [
                                                    createVNode("div", { class: "card-title" }, toDisplayString(c.title || c.code), 1),
                                                    createVNode("div", { class: "card-sub" }, toDisplayString(c.code), 1)
                                                  ]),
                                                  createVNode(_component_a_tag, {
                                                    color: c.status === "active" ? "green" : "default"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(c.status || "pending"), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["color"])
                                                ]),
                                                createVNode("div", { class: "row" }, [
                                                  createVNode("span", null, "Capacity"),
                                                  createVNode("strong", null, toDisplayString(c.capacity || 30), 1)
                                                ]),
                                                createVNode("div", { class: "row" }, [
                                                  createVNode("span", null, "Enrollment"),
                                                  createVNode("strong", null, toDisplayString(c.enrollment || 0), 1)
                                                ]),
                                                createVNode("div", { class: "row" }, [
                                                  createVNode("span", null, "Department"),
                                                  createVNode("strong", null, toDisplayString(deptName(c.departmentId)), 1)
                                                ]),
                                                createVNode("div", { class: "card-actions" }, [
                                                  createVNode(_component_a_button, {
                                                    size: "small",
                                                    onClick: ($event) => editClassroom(c)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Edit")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"])
                                                ])
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(_component_a_card, { hoverable: "" }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "card-head" }, [
                                                createVNode("div", null, [
                                                  createVNode("div", { class: "card-title" }, toDisplayString(c.title || c.code), 1),
                                                  createVNode("div", { class: "card-sub" }, toDisplayString(c.code), 1)
                                                ]),
                                                createVNode(_component_a_tag, {
                                                  color: c.status === "active" ? "green" : "default"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(c.status || "pending"), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["color"])
                                              ]),
                                              createVNode("div", { class: "row" }, [
                                                createVNode("span", null, "Capacity"),
                                                createVNode("strong", null, toDisplayString(c.capacity || 30), 1)
                                              ]),
                                              createVNode("div", { class: "row" }, [
                                                createVNode("span", null, "Enrollment"),
                                                createVNode("strong", null, toDisplayString(c.enrollment || 0), 1)
                                              ]),
                                              createVNode("div", { class: "row" }, [
                                                createVNode("span", null, "Department"),
                                                createVNode("strong", null, toDisplayString(deptName(c.departmentId)), 1)
                                              ]),
                                              createVNode("div", { class: "card-actions" }, [
                                                createVNode(_component_a_button, {
                                                  size: "small",
                                                  onClick: ($event) => editClassroom(c)
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Edit")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"])
                                              ])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                });
                                _push5(`<!--]-->`);
                              } else {
                                return [
                                  (openBlock(true), createBlock(Fragment, null, renderList(filteredClassrooms.value, (c) => {
                                    return openBlock(), createBlock(_component_a_col, {
                                      key: c.id,
                                      xs: 24,
                                      sm: 12
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_card, { hoverable: "" }, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "card-head" }, [
                                              createVNode("div", null, [
                                                createVNode("div", { class: "card-title" }, toDisplayString(c.title || c.code), 1),
                                                createVNode("div", { class: "card-sub" }, toDisplayString(c.code), 1)
                                              ]),
                                              createVNode(_component_a_tag, {
                                                color: c.status === "active" ? "green" : "default"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(c.status || "pending"), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"])
                                            ]),
                                            createVNode("div", { class: "row" }, [
                                              createVNode("span", null, "Capacity"),
                                              createVNode("strong", null, toDisplayString(c.capacity || 30), 1)
                                            ]),
                                            createVNode("div", { class: "row" }, [
                                              createVNode("span", null, "Enrollment"),
                                              createVNode("strong", null, toDisplayString(c.enrollment || 0), 1)
                                            ]),
                                            createVNode("div", { class: "row" }, [
                                              createVNode("span", null, "Department"),
                                              createVNode("strong", null, toDisplayString(deptName(c.departmentId)), 1)
                                            ]),
                                            createVNode("div", { class: "card-actions" }, [
                                              createVNode(_component_a_button, {
                                                size: "small",
                                                onClick: ($event) => editClassroom(c)
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Edit")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"])
                                            ])
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
                          }, _parent4, _scopeId3));
                        }
                      } else {
                        return [
                          createVNode(_component_a_input_search, {
                            value: classFilter.value,
                            "onUpdate:value": ($event) => classFilter.value = $event,
                            placeholder: "Search classrooms...",
                            class: "mb-3"
                          }, null, 8, ["value", "onUpdate:value"]),
                          filteredClassrooms.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                            key: 0,
                            description: "No classrooms"
                          })) : (openBlock(), createBlock(_component_a_row, {
                            key: 1,
                            gutter: 12
                          }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(filteredClassrooms.value, (c) => {
                                return openBlock(), createBlock(_component_a_col, {
                                  key: c.id,
                                  xs: 24,
                                  sm: 12
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, { hoverable: "" }, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "card-head" }, [
                                          createVNode("div", null, [
                                            createVNode("div", { class: "card-title" }, toDisplayString(c.title || c.code), 1),
                                            createVNode("div", { class: "card-sub" }, toDisplayString(c.code), 1)
                                          ]),
                                          createVNode(_component_a_tag, {
                                            color: c.status === "active" ? "green" : "default"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(c.status || "pending"), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["color"])
                                        ]),
                                        createVNode("div", { class: "row" }, [
                                          createVNode("span", null, "Capacity"),
                                          createVNode("strong", null, toDisplayString(c.capacity || 30), 1)
                                        ]),
                                        createVNode("div", { class: "row" }, [
                                          createVNode("span", null, "Enrollment"),
                                          createVNode("strong", null, toDisplayString(c.enrollment || 0), 1)
                                        ]),
                                        createVNode("div", { class: "row" }, [
                                          createVNode("span", null, "Department"),
                                          createVNode("strong", null, toDisplayString(deptName(c.departmentId)), 1)
                                        ]),
                                        createVNode("div", { class: "card-actions" }, [
                                          createVNode(_component_a_button, {
                                            size: "small",
                                            onClick: ($event) => editClassroom(c)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Edit")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"])
                                        ])
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, {
                      title: selectedDept.value ? `${selectedDept.value.name} Classrooms` : "All Classrooms",
                      loading: loading.value
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input_search, {
                          value: classFilter.value,
                          "onUpdate:value": ($event) => classFilter.value = $event,
                          placeholder: "Search classrooms...",
                          class: "mb-3"
                        }, null, 8, ["value", "onUpdate:value"]),
                        filteredClassrooms.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                          key: 0,
                          description: "No classrooms"
                        })) : (openBlock(), createBlock(_component_a_row, {
                          key: 1,
                          gutter: 12
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(filteredClassrooms.value, (c) => {
                              return openBlock(), createBlock(_component_a_col, {
                                key: c.id,
                                xs: 24,
                                sm: 12
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, { hoverable: "" }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "card-head" }, [
                                        createVNode("div", null, [
                                          createVNode("div", { class: "card-title" }, toDisplayString(c.title || c.code), 1),
                                          createVNode("div", { class: "card-sub" }, toDisplayString(c.code), 1)
                                        ]),
                                        createVNode(_component_a_tag, {
                                          color: c.status === "active" ? "green" : "default"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(c.status || "pending"), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["color"])
                                      ]),
                                      createVNode("div", { class: "row" }, [
                                        createVNode("span", null, "Capacity"),
                                        createVNode("strong", null, toDisplayString(c.capacity || 30), 1)
                                      ]),
                                      createVNode("div", { class: "row" }, [
                                        createVNode("span", null, "Enrollment"),
                                        createVNode("strong", null, toDisplayString(c.enrollment || 0), 1)
                                      ]),
                                      createVNode("div", { class: "row" }, [
                                        createVNode("span", null, "Department"),
                                        createVNode("strong", null, toDisplayString(deptName(c.departmentId)), 1)
                                      ]),
                                      createVNode("div", { class: "card-actions" }, [
                                        createVNode(_component_a_button, {
                                          size: "small",
                                          onClick: ($event) => editClassroom(c)
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Edit")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"])
                                      ])
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
                    }, 8, ["title", "loading"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_col, {
              xs: 24,
              md: 6
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_card, {
                    title: "Members",
                    loading: loading.value
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_list, { "data-source": members.value }, {
                          renderItem: withCtx(({ item: m }, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_list_item, null, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_list_item_meta, {
                                      title: m.userId,
                                      description: m.role
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_list_item_meta, {
                                        title: m.userId,
                                        description: m.role
                                      }, null, 8, ["title", "description"])
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_list_item, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_list_item_meta, {
                                      title: m.userId,
                                      description: m.role
                                    }, null, 8, ["title", "description"])
                                  ]),
                                  _: 2
                                }, 1024)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_list, { "data-source": members.value }, {
                            renderItem: withCtx(({ item: m }) => [
                              createVNode(_component_a_list_item, null, {
                                default: withCtx(() => [
                                  createVNode(_component_a_list_item_meta, {
                                    title: m.userId,
                                    description: m.role
                                  }, null, 8, ["title", "description"])
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 1
                          }, 8, ["data-source"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_card, {
                    title: "Invites",
                    class: "mt-3",
                    loading: loading.value
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_list, { "data-source": invites.value }, {
                          renderItem: withCtx(({ item: i }, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_list_item, null, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_list_item_meta, {
                                      title: i.code,
                                      description: `Role: ${i.role}`
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_list_item_meta, {
                                        title: i.code,
                                        description: `Role: ${i.role}`
                                      }, null, 8, ["title", "description"])
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_list_item, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_list_item_meta, {
                                      title: i.code,
                                      description: `Role: ${i.role}`
                                    }, null, 8, ["title", "description"])
                                  ]),
                                  _: 2
                                }, 1024)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_list, { "data-source": invites.value }, {
                            renderItem: withCtx(({ item: i }) => [
                              createVNode(_component_a_list_item, null, {
                                default: withCtx(() => [
                                  createVNode(_component_a_list_item_meta, {
                                    title: i.code,
                                    description: `Role: ${i.role}`
                                  }, null, 8, ["title", "description"])
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 1
                          }, 8, ["data-source"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, {
                      title: "Members",
                      loading: loading.value
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_list, { "data-source": members.value }, {
                          renderItem: withCtx(({ item: m }) => [
                            createVNode(_component_a_list_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_a_list_item_meta, {
                                  title: m.userId,
                                  description: m.role
                                }, null, 8, ["title", "description"])
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 1
                        }, 8, ["data-source"])
                      ]),
                      _: 1
                    }, 8, ["loading"]),
                    createVNode(_component_a_card, {
                      title: "Invites",
                      class: "mt-3",
                      loading: loading.value
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_list, { "data-source": invites.value }, {
                          renderItem: withCtx(({ item: i }) => [
                            createVNode(_component_a_list_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_a_list_item_meta, {
                                  title: i.code,
                                  description: `Role: ${i.role}`
                                }, null, 8, ["title", "description"])
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 1
                        }, 8, ["data-source"])
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_col, {
                xs: 24,
                md: 6
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_card, {
                    title: "Departments",
                    loading: loading.value
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_list, { "data-source": departments.value }, {
                        renderItem: withCtx(({ item: d }) => [
                          createVNode(_component_a_list_item, {
                            class: ["dept-item", selectedDept.value?.id === d.id ? "active" : ""],
                            onClick: ($event) => selectDept(d)
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_list_item_meta, {
                                title: d.name,
                                description: d.active ? "Active" : "Inactive"
                              }, null, 8, ["title", "description"])
                            ]),
                            _: 2
                          }, 1032, ["class", "onClick"])
                        ]),
                        _: 1
                      }, 8, ["data-source"])
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              }),
              createVNode(_component_a_col, {
                xs: 24,
                md: 12
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_card, {
                    title: selectedDept.value ? `${selectedDept.value.name} Classrooms` : "All Classrooms",
                    loading: loading.value
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input_search, {
                        value: classFilter.value,
                        "onUpdate:value": ($event) => classFilter.value = $event,
                        placeholder: "Search classrooms...",
                        class: "mb-3"
                      }, null, 8, ["value", "onUpdate:value"]),
                      filteredClassrooms.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                        key: 0,
                        description: "No classrooms"
                      })) : (openBlock(), createBlock(_component_a_row, {
                        key: 1,
                        gutter: 12
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(filteredClassrooms.value, (c) => {
                            return openBlock(), createBlock(_component_a_col, {
                              key: c.id,
                              xs: 24,
                              sm: 12
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, { hoverable: "" }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "card-head" }, [
                                      createVNode("div", null, [
                                        createVNode("div", { class: "card-title" }, toDisplayString(c.title || c.code), 1),
                                        createVNode("div", { class: "card-sub" }, toDisplayString(c.code), 1)
                                      ]),
                                      createVNode(_component_a_tag, {
                                        color: c.status === "active" ? "green" : "default"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(c.status || "pending"), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["color"])
                                    ]),
                                    createVNode("div", { class: "row" }, [
                                      createVNode("span", null, "Capacity"),
                                      createVNode("strong", null, toDisplayString(c.capacity || 30), 1)
                                    ]),
                                    createVNode("div", { class: "row" }, [
                                      createVNode("span", null, "Enrollment"),
                                      createVNode("strong", null, toDisplayString(c.enrollment || 0), 1)
                                    ]),
                                    createVNode("div", { class: "row" }, [
                                      createVNode("span", null, "Department"),
                                      createVNode("strong", null, toDisplayString(deptName(c.departmentId)), 1)
                                    ]),
                                    createVNode("div", { class: "card-actions" }, [
                                      createVNode(_component_a_button, {
                                        size: "small",
                                        onClick: ($event) => editClassroom(c)
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Edit")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ])
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
                  }, 8, ["title", "loading"])
                ]),
                _: 1
              }),
              createVNode(_component_a_col, {
                xs: 24,
                md: 6
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_card, {
                    title: "Members",
                    loading: loading.value
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_list, { "data-source": members.value }, {
                        renderItem: withCtx(({ item: m }) => [
                          createVNode(_component_a_list_item, null, {
                            default: withCtx(() => [
                              createVNode(_component_a_list_item_meta, {
                                title: m.userId,
                                description: m.role
                              }, null, 8, ["title", "description"])
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 1
                      }, 8, ["data-source"])
                    ]),
                    _: 1
                  }, 8, ["loading"]),
                  createVNode(_component_a_card, {
                    title: "Invites",
                    class: "mt-3",
                    loading: loading.value
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_list, { "data-source": invites.value }, {
                        renderItem: withCtx(({ item: i }) => [
                          createVNode(_component_a_list_item, null, {
                            default: withCtx(() => [
                              createVNode(_component_a_list_item_meta, {
                                title: i.code,
                                description: `Role: ${i.role}`
                              }, null, 8, ["title", "description"])
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 1
                      }, 8, ["data-source"])
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_modal, {
        open: settingsOpen.value,
        "onUpdate:open": ($event) => settingsOpen.value = $event,
        title: "Institution Settings",
        "ok-text": "Save",
        onOk: saveSettings
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_form, { layout: "vertical" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Name" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: instForm.value.name,
                          "onUpdate:value": ($event) => instForm.value.name = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: instForm.value.name,
                            "onUpdate:value": ($event) => instForm.value.name = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Slug" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: instForm.value.slug,
                          "onUpdate:value": ($event) => instForm.value.slug = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: instForm.value.slug,
                            "onUpdate:value": ($event) => instForm.value.slug = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Type" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: instForm.value.type,
                          "onUpdate:value": ($event) => instForm.value.type = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: instForm.value.type,
                            "onUpdate:value": ($event) => instForm.value.type = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Location" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: instForm.value.location,
                          "onUpdate:value": ($event) => instForm.value.location = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: instForm.value.location,
                            "onUpdate:value": ($event) => instForm.value.location = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Email" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: instForm.value.email,
                          "onUpdate:value": ($event) => instForm.value.email = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: instForm.value.email,
                            "onUpdate:value": ($event) => instForm.value.email = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Phone" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: instForm.value.phone,
                          "onUpdate:value": ($event) => instForm.value.phone = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: instForm.value.phone,
                            "onUpdate:value": ($event) => instForm.value.phone = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Active" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_switch, {
                          checked: instForm.value.active,
                          "onUpdate:checked": ($event) => instForm.value.active = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_switch, {
                            checked: instForm.value.active,
                            "onUpdate:checked": ($event) => instForm.value.active = $event
                          }, null, 8, ["checked", "onUpdate:checked"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_form_item, { label: "Name" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: instForm.value.name,
                          "onUpdate:value": ($event) => instForm.value.name = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Slug" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: instForm.value.slug,
                          "onUpdate:value": ($event) => instForm.value.slug = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Type" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: instForm.value.type,
                          "onUpdate:value": ($event) => instForm.value.type = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Location" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: instForm.value.location,
                          "onUpdate:value": ($event) => instForm.value.location = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Email" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: instForm.value.email,
                          "onUpdate:value": ($event) => instForm.value.email = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Phone" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: instForm.value.phone,
                          "onUpdate:value": ($event) => instForm.value.phone = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Active" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_switch, {
                          checked: instForm.value.active,
                          "onUpdate:checked": ($event) => instForm.value.active = $event
                        }, null, 8, ["checked", "onUpdate:checked"])
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
              createVNode(_component_a_form, { layout: "vertical" }, {
                default: withCtx(() => [
                  createVNode(_component_a_form_item, { label: "Name" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: instForm.value.name,
                        "onUpdate:value": ($event) => instForm.value.name = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Slug" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: instForm.value.slug,
                        "onUpdate:value": ($event) => instForm.value.slug = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Type" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: instForm.value.type,
                        "onUpdate:value": ($event) => instForm.value.type = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Location" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: instForm.value.location,
                        "onUpdate:value": ($event) => instForm.value.location = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Email" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: instForm.value.email,
                        "onUpdate:value": ($event) => instForm.value.email = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Phone" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: instForm.value.phone,
                        "onUpdate:value": ($event) => instForm.value.phone = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Active" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_switch, {
                        checked: instForm.value.active,
                        "onUpdate:checked": ($event) => instForm.value.active = $event
                      }, null, 8, ["checked", "onUpdate:checked"])
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
      _push(ssrRenderComponent(_component_a_modal, {
        open: deptOpen.value,
        "onUpdate:open": ($event) => deptOpen.value = $event,
        title: "Department",
        "ok-text": "Save",
        onOk: saveDept
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_form, { layout: "vertical" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Name" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: deptForm.value.name,
                          "onUpdate:value": ($event) => deptForm.value.name = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: deptForm.value.name,
                            "onUpdate:value": ($event) => deptForm.value.name = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Slug" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: deptForm.value.slug,
                          "onUpdate:value": ($event) => deptForm.value.slug = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: deptForm.value.slug,
                            "onUpdate:value": ($event) => deptForm.value.slug = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Active" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_switch, {
                          checked: deptForm.value.active,
                          "onUpdate:checked": ($event) => deptForm.value.active = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_switch, {
                            checked: deptForm.value.active,
                            "onUpdate:checked": ($event) => deptForm.value.active = $event
                          }, null, 8, ["checked", "onUpdate:checked"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_form_item, { label: "Name" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: deptForm.value.name,
                          "onUpdate:value": ($event) => deptForm.value.name = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Slug" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: deptForm.value.slug,
                          "onUpdate:value": ($event) => deptForm.value.slug = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Active" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_switch, {
                          checked: deptForm.value.active,
                          "onUpdate:checked": ($event) => deptForm.value.active = $event
                        }, null, 8, ["checked", "onUpdate:checked"])
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
              createVNode(_component_a_form, { layout: "vertical" }, {
                default: withCtx(() => [
                  createVNode(_component_a_form_item, { label: "Name" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: deptForm.value.name,
                        "onUpdate:value": ($event) => deptForm.value.name = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Slug" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: deptForm.value.slug,
                        "onUpdate:value": ($event) => deptForm.value.slug = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Active" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_switch, {
                        checked: deptForm.value.active,
                        "onUpdate:checked": ($event) => deptForm.value.active = $event
                      }, null, 8, ["checked", "onUpdate:checked"])
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
      _push(ssrRenderComponent(_component_a_modal, {
        open: classOpen.value,
        "onUpdate:open": ($event) => classOpen.value = $event,
        title: "Classroom",
        "ok-text": "Save",
        onOk: saveClassroom
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_form, { layout: "vertical" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Title" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: classForm.value.title,
                          "onUpdate:value": ($event) => classForm.value.title = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: classForm.value.title,
                            "onUpdate:value": ($event) => classForm.value.title = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Code" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: classForm.value.code,
                          "onUpdate:value": ($event) => classForm.value.code = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: classForm.value.code,
                            "onUpdate:value": ($event) => classForm.value.code = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Department" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_select, {
                          value: classForm.value.departmentId,
                          "onUpdate:value": ($event) => classForm.value.departmentId = $event,
                          "allow-clear": ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_select_option, { value: void 0 }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`—`);
                                  } else {
                                    return [
                                      createTextVNode("—")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`<!--[-->`);
                              ssrRenderList(departments.value, (d) => {
                                _push5(ssrRenderComponent(_component_a_select_option, {
                                  key: d.id,
                                  value: d.id
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(d.name)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(d.name), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                createVNode(_component_a_select_option, { value: void 0 }, {
                                  default: withCtx(() => [
                                    createTextVNode("—")
                                  ]),
                                  _: 1
                                }),
                                (openBlock(true), createBlock(Fragment, null, renderList(departments.value, (d) => {
                                  return openBlock(), createBlock(_component_a_select_option, {
                                    key: d.id,
                                    value: d.id
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(d.name), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["value"]);
                                }), 128))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_select, {
                            value: classForm.value.departmentId,
                            "onUpdate:value": ($event) => classForm.value.departmentId = $event,
                            "allow-clear": ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_select_option, { value: void 0 }, {
                                default: withCtx(() => [
                                  createTextVNode("—")
                                ]),
                                _: 1
                              }),
                              (openBlock(true), createBlock(Fragment, null, renderList(departments.value, (d) => {
                                return openBlock(), createBlock(_component_a_select_option, {
                                  key: d.id,
                                  value: d.id
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(d.name), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["value"]);
                              }), 128))
                            ]),
                            _: 1
                          }, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Capacity" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input_number, {
                          value: classForm.value.capacity,
                          "onUpdate:value": ($event) => classForm.value.capacity = $event,
                          min: 1,
                          max: 500,
                          style: { "width": "100%" }
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input_number, {
                            value: classForm.value.capacity,
                            "onUpdate:value": ($event) => classForm.value.capacity = $event,
                            min: 1,
                            max: 500,
                            style: { "width": "100%" }
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Status" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: classForm.value.status,
                          "onUpdate:value": ($event) => classForm.value.status = $event,
                          placeholder: "active/inactive"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: classForm.value.status,
                            "onUpdate:value": ($event) => classForm.value.status = $event,
                            placeholder: "active/inactive"
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Teach course" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_select, {
                          value: selectedCourseId.value,
                          "onUpdate:value": ($event) => selectedCourseId.value = $event,
                          options: courseOptions.value,
                          "allow-clear": "",
                          placeholder: "Select course"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_select, {
                            value: selectedCourseId.value,
                            "onUpdate:value": ($event) => selectedCourseId.value = $event,
                            options: courseOptions.value,
                            "allow-clear": "",
                            placeholder: "Select course"
                          }, null, 8, ["value", "onUpdate:value", "options"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Preferred modules" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_select, {
                          value: selectedModuleIds.value,
                          "onUpdate:value": ($event) => selectedModuleIds.value = $event,
                          options: moduleOptions.value,
                          mode: "multiple",
                          "allow-clear": "",
                          placeholder: "Select modules"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_select, {
                            value: selectedModuleIds.value,
                            "onUpdate:value": ($event) => selectedModuleIds.value = $event,
                            options: moduleOptions.value,
                            mode: "multiple",
                            "allow-clear": "",
                            placeholder: "Select modules"
                          }, null, 8, ["value", "onUpdate:value", "options"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_form_item, { label: "Title" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: classForm.value.title,
                          "onUpdate:value": ($event) => classForm.value.title = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Code" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: classForm.value.code,
                          "onUpdate:value": ($event) => classForm.value.code = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Department" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_select, {
                          value: classForm.value.departmentId,
                          "onUpdate:value": ($event) => classForm.value.departmentId = $event,
                          "allow-clear": ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_select_option, { value: void 0 }, {
                              default: withCtx(() => [
                                createTextVNode("—")
                              ]),
                              _: 1
                            }),
                            (openBlock(true), createBlock(Fragment, null, renderList(departments.value, (d) => {
                              return openBlock(), createBlock(_component_a_select_option, {
                                key: d.id,
                                value: d.id
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(d.name), 1)
                                ]),
                                _: 2
                              }, 1032, ["value"]);
                            }), 128))
                          ]),
                          _: 1
                        }, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Capacity" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input_number, {
                          value: classForm.value.capacity,
                          "onUpdate:value": ($event) => classForm.value.capacity = $event,
                          min: 1,
                          max: 500,
                          style: { "width": "100%" }
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Status" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: classForm.value.status,
                          "onUpdate:value": ($event) => classForm.value.status = $event,
                          placeholder: "active/inactive"
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Teach course" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_select, {
                          value: selectedCourseId.value,
                          "onUpdate:value": ($event) => selectedCourseId.value = $event,
                          options: courseOptions.value,
                          "allow-clear": "",
                          placeholder: "Select course"
                        }, null, 8, ["value", "onUpdate:value", "options"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Preferred modules" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_select, {
                          value: selectedModuleIds.value,
                          "onUpdate:value": ($event) => selectedModuleIds.value = $event,
                          options: moduleOptions.value,
                          mode: "multiple",
                          "allow-clear": "",
                          placeholder: "Select modules"
                        }, null, 8, ["value", "onUpdate:value", "options"])
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
              createVNode(_component_a_form, { layout: "vertical" }, {
                default: withCtx(() => [
                  createVNode(_component_a_form_item, { label: "Title" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: classForm.value.title,
                        "onUpdate:value": ($event) => classForm.value.title = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Code" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: classForm.value.code,
                        "onUpdate:value": ($event) => classForm.value.code = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Department" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_select, {
                        value: classForm.value.departmentId,
                        "onUpdate:value": ($event) => classForm.value.departmentId = $event,
                        "allow-clear": ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_select_option, { value: void 0 }, {
                            default: withCtx(() => [
                              createTextVNode("—")
                            ]),
                            _: 1
                          }),
                          (openBlock(true), createBlock(Fragment, null, renderList(departments.value, (d) => {
                            return openBlock(), createBlock(_component_a_select_option, {
                              key: d.id,
                              value: d.id
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(d.name), 1)
                              ]),
                              _: 2
                            }, 1032, ["value"]);
                          }), 128))
                        ]),
                        _: 1
                      }, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Capacity" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input_number, {
                        value: classForm.value.capacity,
                        "onUpdate:value": ($event) => classForm.value.capacity = $event,
                        min: 1,
                        max: 500,
                        style: { "width": "100%" }
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Status" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: classForm.value.status,
                        "onUpdate:value": ($event) => classForm.value.status = $event,
                        placeholder: "active/inactive"
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Teach course" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_select, {
                        value: selectedCourseId.value,
                        "onUpdate:value": ($event) => selectedCourseId.value = $event,
                        options: courseOptions.value,
                        "allow-clear": "",
                        placeholder: "Select course"
                      }, null, 8, ["value", "onUpdate:value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Preferred modules" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_select, {
                        value: selectedModuleIds.value,
                        "onUpdate:value": ($event) => selectedModuleIds.value = $event,
                        options: moduleOptions.value,
                        mode: "multiple",
                        "allow-clear": "",
                        placeholder: "Select modules"
                      }, null, 8, ["value", "onUpdate:value", "options"])
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
      _push(ssrRenderComponent(_component_a_modal, {
        open: inviteOpen.value,
        "onUpdate:open": ($event) => inviteOpen.value = $event,
        title: "Create Invite",
        "ok-text": "Create",
        onOk: saveInvite
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_form, { layout: "vertical" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Role" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_select, {
                          value: inviteForm.value.role,
                          "onUpdate:value": ($event) => inviteForm.value.role = $event
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_select_option, { value: "student" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Student`);
                                  } else {
                                    return [
                                      createTextVNode("Student")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_select_option, { value: "teacher" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Teacher`);
                                  } else {
                                    return [
                                      createTextVNode("Teacher")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_select_option, { value: "admin" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Admin`);
                                  } else {
                                    return [
                                      createTextVNode("Admin")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_select_option, { value: "student" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Student")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_select_option, { value: "teacher" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Teacher")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_select_option, { value: "admin" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Admin")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_select, {
                            value: inviteForm.value.role,
                            "onUpdate:value": ($event) => inviteForm.value.role = $event
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_select_option, { value: "student" }, {
                                default: withCtx(() => [
                                  createTextVNode("Student")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_select_option, { value: "teacher" }, {
                                default: withCtx(() => [
                                  createTextVNode("Teacher")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_select_option, { value: "admin" }, {
                                default: withCtx(() => [
                                  createTextVNode("Admin")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Expires At (optional)" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_date_picker, {
                          value: inviteForm.value.expiresAt,
                          "onUpdate:value": ($event) => inviteForm.value.expiresAt = $event,
                          style: { "width": "100%" },
                          "show-time": ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_date_picker, {
                            value: inviteForm.value.expiresAt,
                            "onUpdate:value": ($event) => inviteForm.value.expiresAt = $event,
                            style: { "width": "100%" },
                            "show-time": ""
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_form_item, { label: "Role" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_select, {
                          value: inviteForm.value.role,
                          "onUpdate:value": ($event) => inviteForm.value.role = $event
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_select_option, { value: "student" }, {
                              default: withCtx(() => [
                                createTextVNode("Student")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_select_option, { value: "teacher" }, {
                              default: withCtx(() => [
                                createTextVNode("Teacher")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_select_option, { value: "admin" }, {
                              default: withCtx(() => [
                                createTextVNode("Admin")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Expires At (optional)" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_date_picker, {
                          value: inviteForm.value.expiresAt,
                          "onUpdate:value": ($event) => inviteForm.value.expiresAt = $event,
                          style: { "width": "100%" },
                          "show-time": ""
                        }, null, 8, ["value", "onUpdate:value"])
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
              createVNode(_component_a_form, { layout: "vertical" }, {
                default: withCtx(() => [
                  createVNode(_component_a_form_item, { label: "Role" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_select, {
                        value: inviteForm.value.role,
                        "onUpdate:value": ($event) => inviteForm.value.role = $event
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_select_option, { value: "student" }, {
                            default: withCtx(() => [
                              createTextVNode("Student")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "teacher" }, {
                            default: withCtx(() => [
                              createTextVNode("Teacher")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "admin" }, {
                            default: withCtx(() => [
                              createTextVNode("Admin")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Expires At (optional)" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_date_picker, {
                        value: inviteForm.value.expiresAt,
                        "onUpdate:value": ($event) => inviteForm.value.expiresAt = $event,
                        style: { "width": "100%" },
                        "show-time": ""
                      }, null, 8, ["value", "onUpdate:value"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/institutions/nuxt/pages/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7c9ec049"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-N_SSQa9U.mjs.map
