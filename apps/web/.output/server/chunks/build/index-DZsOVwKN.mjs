import { defineComponent, ref, computed, resolveComponent, withCtx, createTextVNode, unref, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-B8D9e8en.mjs';
import { message } from 'ant-design-vue';
import { ReloadOutlined, PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { _ as _export_sfc, b as useRuntimeConfig, u as useRouter } from './server.mjs';
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
    const institutions = ref([]);
    const searchQuery = ref("");
    const filterStatus = ref("");
    const showCreateModal = ref(false);
    const editingInst = ref(null);
    const currentPage = ref(1);
    const pageSize = ref(12);
    const isDarkMode = ref(false);
    const apiBase = useRuntimeConfig().public?.apiBase || "http://localhost:4000";
    const loading = ref(false);
    const router = useRouter();
    const { token } = useAuth();
    function tokenHeader() {
      const t = token?.value || "";
      return t ? { Authorization: `Bearer ${t}` } : {};
    }
    const formData = ref({
      name: "",
      type: "University",
      location: "",
      email: "",
      phone: "",
      active: true
    });
    async function loadInstitutions() {
      try {
        loading.value = true;
        const resp = await fetch(`${apiBase}/api/institutions/graphql`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...tokenHeader()
          },
          body: JSON.stringify({
            query: `query {
          institutions {
            id name type location email phone active
            departments { id name }
            classrooms { id }
            members { id role }
          }
        }`
          })
        });
        const json = await resp.json();
        const data = json?.data?.institutions || [];
        institutions.value = data;
      } catch (e) {
        console.warn("[institutions] load failed", e);
        message.error("Unable to load institutions");
      } finally {
        loading.value = false;
      }
    }
    const filteredInstitutions = computed(() => {
      return institutions.value.filter((inst) => {
        const matchesSearch = !searchQuery.value || inst.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || inst.location.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesStatus = !filterStatus.value || (filterStatus.value === "active" ? inst.active : !inst.active);
        return matchesSearch && matchesStatus;
      });
    });
    const paginatedInstitutions = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredInstitutions.value.slice(start, end);
    });
    const totalStudents = computed(() => {
      return institutions.value.reduce((sum, inst) => {
        return sum + (inst.departments?.reduce((dSum, dep) => dSum + (dep.studentCount || 0), 0) || 0);
      }, 0);
    });
    function openCreate() {
      editingInst.value = null;
      resetForm();
      showCreateModal.value = true;
    }
    function navigateTo(path) {
      router.push(path);
    }
    function refresh() {
      loadInstitutions();
    }
    function onSearch() {
      currentPage.value = 1;
    }
    function onFilterChange() {
      currentPage.value = 1;
    }
    function editInstitution(inst) {
      editingInst.value = inst;
      formData.value = { ...inst };
      showCreateModal.value = true;
    }
    function saveInstitution() {
      if (!formData.value.name.trim()) {
        message.error("Institution name is required");
        return;
      }
      const mutation = editingInst.value ? `mutation($id:String!,$name:String,$slug:String,$type:String,$location:String,$email:String,$phone:String,$active:Boolean){
        updateInstitution(id:$id,name:$name,slug:$slug,type:$type,location:$location,email:$email,phone:$phone,active:$active){ id }
      }` : `mutation($name:String!,$slug:String!,$type:String,$location:String,$email:String,$phone:String,$active:Boolean){
        createInstitution(name:$name,slug:$slug,type:$type,location:$location,email:$email,phone:$phone,active:$active){ id }
      }`;
      const vars = { ...formData.value };
      if (editingInst.value) vars.id = editingInst.value.id;
      if (!vars.slug) vars.slug = formData.value.name.toLowerCase().replace(/\s+/g, "-");
      fetch(`${apiBase}/api/institutions/graphql`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...tokenHeader()
        },
        body: JSON.stringify({ query: mutation, variables: vars })
      }).then((r) => r.json()).then((json) => {
        if (json.errors?.length) throw new Error(json.errors[0].message);
        message.success(editingInst.value ? "Institution updated" : "Institution created");
        showCreateModal.value = false;
        editingInst.value = null;
        resetForm();
        loadInstitutions();
      }).catch((e) => {
        message.error(e?.message || "Unable to save institution");
      });
    }
    function deleteInstitution(id) {
      const mutation = `mutation($id:String!){ updateInstitution(id:$id, active:false){ id active } }`;
      fetch(`${apiBase}/api/institutions/graphql`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...tokenHeader()
        },
        body: JSON.stringify({ query: mutation, variables: { id } })
      }).then((r) => r.json()).then((json) => {
        if (json.errors?.length) throw new Error(json.errors[0].message);
        message.success("Institution archived");
        loadInstitutions();
      }).catch((e) => message.error(e?.message || "Unable to archive"));
    }
    function resetForm() {
      formData.value = {
        name: "",
        type: "University",
        location: "",
        email: "",
        phone: "",
        active: true
      };
    }
    function toggleDarkMode() {
      isDarkMode.value = !isDarkMode.value;
      applyTheme();
      localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode.value));
    }
    function applyTheme() {
      const html = (void 0).documentElement;
      if (isDarkMode.value) {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_button = resolveComponent("a-button");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_input_search = resolveComponent("a-input-search");
      const _component_a_select = resolveComponent("a-select");
      const _component_a_select_option = resolveComponent("a-select-option");
      const _component_a_switch = resolveComponent("a-switch");
      const _component_a_empty = resolveComponent("a-empty");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_pagination = resolveComponent("a-pagination");
      const _component_a_modal = resolveComponent("a-modal");
      const _component_a_form = resolveComponent("a-form");
      const _component_a_form_item = resolveComponent("a-form-item");
      const _component_a_input = resolveComponent("a-input");
      _push(`<!--[--><div class="inst-shell" data-v-32edecf0><div class="top-bar" data-v-32edecf0><div class="top-left" data-v-32edecf0><div class="title" data-v-32edecf0>Institutions</div><div class="subtitle" data-v-32edecf0>Manage institutions, departments, and classrooms</div></div><div class="top-actions" data-v-32edecf0>`);
      _push(ssrRenderComponent(_component_a_button, {
        onClick: refresh,
        loading: loading.value,
        ghost: ""
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ReloadOutlined), null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(ReloadOutlined))
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Refresh `);
          } else {
            return [
              createTextVNode(" Refresh ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_button, {
        type: "primary",
        onClick: openCreate
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(PlusOutlined), null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(PlusOutlined))
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Add Institution `);
          } else {
            return [
              createTextVNode(" Add Institution ")
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
                  _push3(ssrRenderComponent(_component_a_card, {
                    class: "stat-card",
                    bordered: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="stat-label" data-v-32edecf0${_scopeId3}>Total Institutions</div><div class="stat-value" data-v-32edecf0${_scopeId3}>${ssrInterpolate(institutions.value.length)}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "stat-label" }, "Total Institutions"),
                          createVNode("div", { class: "stat-value" }, toDisplayString(institutions.value.length), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, {
                      class: "stat-card",
                      bordered: ""
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "stat-label" }, "Total Institutions"),
                        createVNode("div", { class: "stat-value" }, toDisplayString(institutions.value.length), 1)
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
                  _push3(ssrRenderComponent(_component_a_card, {
                    class: "stat-card",
                    bordered: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="stat-label" data-v-32edecf0${_scopeId3}>Active</div><div class="stat-value" data-v-32edecf0${_scopeId3}>${ssrInterpolate(institutions.value.filter((i) => i.active).length)}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "stat-label" }, "Active"),
                          createVNode("div", { class: "stat-value" }, toDisplayString(institutions.value.filter((i) => i.active).length), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, {
                      class: "stat-card",
                      bordered: ""
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "stat-label" }, "Active"),
                        createVNode("div", { class: "stat-value" }, toDisplayString(institutions.value.filter((i) => i.active).length), 1)
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
                  _push3(ssrRenderComponent(_component_a_card, {
                    class: "stat-card",
                    bordered: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="stat-label" data-v-32edecf0${_scopeId3}>Departments</div><div class="stat-value" data-v-32edecf0${_scopeId3}>${ssrInterpolate(institutions.value.reduce((s, i) => s + (i.departments?.length || 0), 0))}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "stat-label" }, "Departments"),
                          createVNode("div", { class: "stat-value" }, toDisplayString(institutions.value.reduce((s, i) => s + (i.departments?.length || 0), 0)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, {
                      class: "stat-card",
                      bordered: ""
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "stat-label" }, "Departments"),
                        createVNode("div", { class: "stat-value" }, toDisplayString(institutions.value.reduce((s, i) => s + (i.departments?.length || 0), 0)), 1)
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
                  _push3(ssrRenderComponent(_component_a_card, {
                    class: "stat-card",
                    bordered: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="stat-label" data-v-32edecf0${_scopeId3}>Students (est.)</div><div class="stat-value" data-v-32edecf0${_scopeId3}>${ssrInterpolate(totalStudents.value)}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "stat-label" }, "Students (est.)"),
                          createVNode("div", { class: "stat-value" }, toDisplayString(totalStudents.value), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_card, {
                      class: "stat-card",
                      bordered: ""
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "stat-label" }, "Students (est.)"),
                        createVNode("div", { class: "stat-value" }, toDisplayString(totalStudents.value), 1)
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
                  createVNode(_component_a_card, {
                    class: "stat-card",
                    bordered: ""
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "stat-label" }, "Total Institutions"),
                      createVNode("div", { class: "stat-value" }, toDisplayString(institutions.value.length), 1)
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
                  createVNode(_component_a_card, {
                    class: "stat-card",
                    bordered: ""
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "stat-label" }, "Active"),
                      createVNode("div", { class: "stat-value" }, toDisplayString(institutions.value.filter((i) => i.active).length), 1)
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
                  createVNode(_component_a_card, {
                    class: "stat-card",
                    bordered: ""
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "stat-label" }, "Departments"),
                      createVNode("div", { class: "stat-value" }, toDisplayString(institutions.value.reduce((s, i) => s + (i.departments?.length || 0), 0)), 1)
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
                  createVNode(_component_a_card, {
                    class: "stat-card",
                    bordered: ""
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "stat-label" }, "Students (est.)"),
                      createVNode("div", { class: "stat-value" }, toDisplayString(totalStudents.value), 1)
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
      _push(ssrRenderComponent(_component_a_card, {
        class: "section",
        bordered: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_row, { gutter: 12 }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 24,
                    md: 12
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input_search, {
                          value: searchQuery.value,
                          "onUpdate:value": ($event) => searchQuery.value = $event,
                          placeholder: "Search by name or location",
                          onSearch
                        }, {
                          prefix: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(SearchOutlined), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(SearchOutlined))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input_search, {
                            value: searchQuery.value,
                            "onUpdate:value": ($event) => searchQuery.value = $event,
                            placeholder: "Search by name or location",
                            onSearch
                          }, {
                            prefix: withCtx(() => [
                              createVNode(unref(SearchOutlined))
                            ]),
                            _: 1
                          }, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 12,
                    md: 6
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_select, {
                          value: filterStatus.value,
                          "onUpdate:value": ($event) => filterStatus.value = $event,
                          style: { "width": "100%" },
                          onChange: onFilterChange
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_select_option, { value: "" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`All Status`);
                                  } else {
                                    return [
                                      createTextVNode("All Status")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_select_option, { value: "active" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Active`);
                                  } else {
                                    return [
                                      createTextVNode("Active")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_select_option, { value: "inactive" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Inactive`);
                                  } else {
                                    return [
                                      createTextVNode("Inactive")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_select_option, { value: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("All Status")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_select_option, { value: "active" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Active")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_select_option, { value: "inactive" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Inactive")
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
                            value: filterStatus.value,
                            "onUpdate:value": ($event) => filterStatus.value = $event,
                            style: { "width": "100%" },
                            onChange: onFilterChange
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_select_option, { value: "" }, {
                                default: withCtx(() => [
                                  createTextVNode("All Status")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_select_option, { value: "active" }, {
                                default: withCtx(() => [
                                  createTextVNode("Active")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_select_option, { value: "inactive" }, {
                                default: withCtx(() => [
                                  createTextVNode("Inactive")
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
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 12,
                    md: 6,
                    class: "flex justify-end"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_switch, {
                          checked: isDarkMode.value,
                          "onUpdate:checked": ($event) => isDarkMode.value = $event,
                          onChange: toggleDarkMode
                        }, null, _parent4, _scopeId3));
                        _push4(`<span class="ml-2" data-v-32edecf0${_scopeId3}>Dark mode</span>`);
                      } else {
                        return [
                          createVNode(_component_a_switch, {
                            checked: isDarkMode.value,
                            "onUpdate:checked": ($event) => isDarkMode.value = $event,
                            onChange: toggleDarkMode
                          }, null, 8, ["checked", "onUpdate:checked"]),
                          createVNode("span", { class: "ml-2" }, "Dark mode")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_col, {
                      xs: 24,
                      md: 12
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input_search, {
                          value: searchQuery.value,
                          "onUpdate:value": ($event) => searchQuery.value = $event,
                          placeholder: "Search by name or location",
                          onSearch
                        }, {
                          prefix: withCtx(() => [
                            createVNode(unref(SearchOutlined))
                          ]),
                          _: 1
                        }, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, {
                      xs: 12,
                      md: 6
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_select, {
                          value: filterStatus.value,
                          "onUpdate:value": ($event) => filterStatus.value = $event,
                          style: { "width": "100%" },
                          onChange: onFilterChange
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_select_option, { value: "" }, {
                              default: withCtx(() => [
                                createTextVNode("All Status")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_select_option, { value: "active" }, {
                              default: withCtx(() => [
                                createTextVNode("Active")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_select_option, { value: "inactive" }, {
                              default: withCtx(() => [
                                createTextVNode("Inactive")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, {
                      xs: 12,
                      md: 6,
                      class: "flex justify-end"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_switch, {
                          checked: isDarkMode.value,
                          "onUpdate:checked": ($event) => isDarkMode.value = $event,
                          onChange: toggleDarkMode
                        }, null, 8, ["checked", "onUpdate:checked"]),
                        createVNode("span", { class: "ml-2" }, "Dark mode")
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
              createVNode(_component_a_row, { gutter: 12 }, {
                default: withCtx(() => [
                  createVNode(_component_a_col, {
                    xs: 24,
                    md: 12
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input_search, {
                        value: searchQuery.value,
                        "onUpdate:value": ($event) => searchQuery.value = $event,
                        placeholder: "Search by name or location",
                        onSearch
                      }, {
                        prefix: withCtx(() => [
                          createVNode(unref(SearchOutlined))
                        ]),
                        _: 1
                      }, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_col, {
                    xs: 12,
                    md: 6
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_select, {
                        value: filterStatus.value,
                        "onUpdate:value": ($event) => filterStatus.value = $event,
                        style: { "width": "100%" },
                        onChange: onFilterChange
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_select_option, { value: "" }, {
                            default: withCtx(() => [
                              createTextVNode("All Status")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "active" }, {
                            default: withCtx(() => [
                              createTextVNode("Active")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "inactive" }, {
                            default: withCtx(() => [
                              createTextVNode("Inactive")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_col, {
                    xs: 12,
                    md: 6,
                    class: "flex justify-end"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_switch, {
                        checked: isDarkMode.value,
                        "onUpdate:checked": ($event) => isDarkMode.value = $event,
                        onChange: toggleDarkMode
                      }, null, 8, ["checked", "onUpdate:checked"]),
                      createVNode("span", { class: "ml-2" }, "Dark mode")
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
      _push(`<div class="section" data-v-32edecf0>`);
      if (!loading.value && filteredInstitutions.value.length === 0) {
        _push(ssrRenderComponent(_component_a_empty, { description: "No institutions found" }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_a_row, { gutter: [16, 16] }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(paginatedInstitutions.value, (inst) => {
                _push2(ssrRenderComponent(_component_a_col, {
                  key: inst.id,
                  xs: 24,
                  sm: 12,
                  lg: 8
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_a_card, {
                        class: ["inst-card", { inactive: inst.active === false }],
                        bordered: "",
                        hoverable: ""
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<div class="card-head" data-v-32edecf0${_scopeId3}><div data-v-32edecf0${_scopeId3}><div class="card-title" data-v-32edecf0${_scopeId3}>${ssrInterpolate(inst.name)}</div><div class="card-sub" data-v-32edecf0${_scopeId3}>${ssrInterpolate(inst.location || "No location")}</div></div>`);
                            _push4(ssrRenderComponent(_component_a_tag, {
                              color: inst.active ? "green" : "red"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(inst.active ? "Active" : "Inactive")}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(inst.active ? "Active" : "Inactive"), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(`</div><div class="card-body" data-v-32edecf0${_scopeId3}><div class="row" data-v-32edecf0${_scopeId3}><span data-v-32edecf0${_scopeId3}>Type</span><strong data-v-32edecf0${_scopeId3}>${ssrInterpolate(inst.type || "—")}</strong></div>`);
                            if (inst.email || inst.phone) {
                              _push4(`<div class="row" data-v-32edecf0${_scopeId3}><span data-v-32edecf0${_scopeId3}>Contact</span><strong data-v-32edecf0${_scopeId3}>${ssrInterpolate(inst.email || inst.phone || "—")}</strong></div>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`<div class="row" data-v-32edecf0${_scopeId3}><span data-v-32edecf0${_scopeId3}>Departments</span><strong data-v-32edecf0${_scopeId3}>${ssrInterpolate(inst.departments?.length || 0)}</strong></div><div class="row" data-v-32edecf0${_scopeId3}><span data-v-32edecf0${_scopeId3}>Members</span><strong data-v-32edecf0${_scopeId3}>${ssrInterpolate(inst.members?.length || 0)}</strong></div></div><div class="card-actions" data-v-32edecf0${_scopeId3}>`);
                            _push4(ssrRenderComponent(_component_a_button, {
                              type: "text",
                              size: "small",
                              onClick: ($event) => editInstitution(inst)
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(EditOutlined), null, null, _parent5, _scopeId4));
                                  _push5(` Edit `);
                                } else {
                                  return [
                                    createVNode(unref(EditOutlined)),
                                    createTextVNode(" Edit ")
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_a_button, {
                              type: "text",
                              size: "small",
                              danger: "",
                              onClick: ($event) => deleteInstitution(inst.id)
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(DeleteOutlined), null, null, _parent5, _scopeId4));
                                  _push5(` Archive `);
                                } else {
                                  return [
                                    createVNode(unref(DeleteOutlined)),
                                    createTextVNode(" Archive ")
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_a_button, {
                              type: "primary",
                              size: "small",
                              onClick: ($event) => navigateTo(`/institutions/${inst.id}`)
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(` Open `);
                                } else {
                                  return [
                                    createTextVNode(" Open ")
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(`</div>`);
                          } else {
                            return [
                              createVNode("div", { class: "card-head" }, [
                                createVNode("div", null, [
                                  createVNode("div", { class: "card-title" }, toDisplayString(inst.name), 1),
                                  createVNode("div", { class: "card-sub" }, toDisplayString(inst.location || "No location"), 1)
                                ]),
                                createVNode(_component_a_tag, {
                                  color: inst.active ? "green" : "red"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(inst.active ? "Active" : "Inactive"), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["color"])
                              ]),
                              createVNode("div", { class: "card-body" }, [
                                createVNode("div", { class: "row" }, [
                                  createVNode("span", null, "Type"),
                                  createVNode("strong", null, toDisplayString(inst.type || "—"), 1)
                                ]),
                                inst.email || inst.phone ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "row"
                                }, [
                                  createVNode("span", null, "Contact"),
                                  createVNode("strong", null, toDisplayString(inst.email || inst.phone || "—"), 1)
                                ])) : createCommentVNode("", true),
                                createVNode("div", { class: "row" }, [
                                  createVNode("span", null, "Departments"),
                                  createVNode("strong", null, toDisplayString(inst.departments?.length || 0), 1)
                                ]),
                                createVNode("div", { class: "row" }, [
                                  createVNode("span", null, "Members"),
                                  createVNode("strong", null, toDisplayString(inst.members?.length || 0), 1)
                                ])
                              ]),
                              createVNode("div", { class: "card-actions" }, [
                                createVNode(_component_a_button, {
                                  type: "text",
                                  size: "small",
                                  onClick: ($event) => editInstitution(inst)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(EditOutlined)),
                                    createTextVNode(" Edit ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"]),
                                createVNode(_component_a_button, {
                                  type: "text",
                                  size: "small",
                                  danger: "",
                                  onClick: ($event) => deleteInstitution(inst.id)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(DeleteOutlined)),
                                    createTextVNode(" Archive ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"]),
                                createVNode(_component_a_button, {
                                  type: "primary",
                                  size: "small",
                                  onClick: ($event) => navigateTo(`/institutions/${inst.id}`)
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Open ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])
                              ])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_a_card, {
                          class: ["inst-card", { inactive: inst.active === false }],
                          bordered: "",
                          hoverable: ""
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "card-head" }, [
                              createVNode("div", null, [
                                createVNode("div", { class: "card-title" }, toDisplayString(inst.name), 1),
                                createVNode("div", { class: "card-sub" }, toDisplayString(inst.location || "No location"), 1)
                              ]),
                              createVNode(_component_a_tag, {
                                color: inst.active ? "green" : "red"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(inst.active ? "Active" : "Inactive"), 1)
                                ]),
                                _: 2
                              }, 1032, ["color"])
                            ]),
                            createVNode("div", { class: "card-body" }, [
                              createVNode("div", { class: "row" }, [
                                createVNode("span", null, "Type"),
                                createVNode("strong", null, toDisplayString(inst.type || "—"), 1)
                              ]),
                              inst.email || inst.phone ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "row"
                              }, [
                                createVNode("span", null, "Contact"),
                                createVNode("strong", null, toDisplayString(inst.email || inst.phone || "—"), 1)
                              ])) : createCommentVNode("", true),
                              createVNode("div", { class: "row" }, [
                                createVNode("span", null, "Departments"),
                                createVNode("strong", null, toDisplayString(inst.departments?.length || 0), 1)
                              ]),
                              createVNode("div", { class: "row" }, [
                                createVNode("span", null, "Members"),
                                createVNode("strong", null, toDisplayString(inst.members?.length || 0), 1)
                              ])
                            ]),
                            createVNode("div", { class: "card-actions" }, [
                              createVNode(_component_a_button, {
                                type: "text",
                                size: "small",
                                onClick: ($event) => editInstitution(inst)
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(EditOutlined)),
                                  createTextVNode(" Edit ")
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode(_component_a_button, {
                                type: "text",
                                size: "small",
                                danger: "",
                                onClick: ($event) => deleteInstitution(inst.id)
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(DeleteOutlined)),
                                  createTextVNode(" Archive ")
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode(_component_a_button, {
                                type: "primary",
                                size: "small",
                                onClick: ($event) => navigateTo(`/institutions/${inst.id}`)
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Open ")
                                ]),
                                _: 1
                              }, 8, ["onClick"])
                            ])
                          ]),
                          _: 2
                        }, 1032, ["class"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(paginatedInstitutions.value, (inst) => {
                  return openBlock(), createBlock(_component_a_col, {
                    key: inst.id,
                    xs: 24,
                    sm: 12,
                    lg: 8
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_card, {
                        class: ["inst-card", { inactive: inst.active === false }],
                        bordered: "",
                        hoverable: ""
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "card-head" }, [
                            createVNode("div", null, [
                              createVNode("div", { class: "card-title" }, toDisplayString(inst.name), 1),
                              createVNode("div", { class: "card-sub" }, toDisplayString(inst.location || "No location"), 1)
                            ]),
                            createVNode(_component_a_tag, {
                              color: inst.active ? "green" : "red"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(inst.active ? "Active" : "Inactive"), 1)
                              ]),
                              _: 2
                            }, 1032, ["color"])
                          ]),
                          createVNode("div", { class: "card-body" }, [
                            createVNode("div", { class: "row" }, [
                              createVNode("span", null, "Type"),
                              createVNode("strong", null, toDisplayString(inst.type || "—"), 1)
                            ]),
                            inst.email || inst.phone ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "row"
                            }, [
                              createVNode("span", null, "Contact"),
                              createVNode("strong", null, toDisplayString(inst.email || inst.phone || "—"), 1)
                            ])) : createCommentVNode("", true),
                            createVNode("div", { class: "row" }, [
                              createVNode("span", null, "Departments"),
                              createVNode("strong", null, toDisplayString(inst.departments?.length || 0), 1)
                            ]),
                            createVNode("div", { class: "row" }, [
                              createVNode("span", null, "Members"),
                              createVNode("strong", null, toDisplayString(inst.members?.length || 0), 1)
                            ])
                          ]),
                          createVNode("div", { class: "card-actions" }, [
                            createVNode(_component_a_button, {
                              type: "text",
                              size: "small",
                              onClick: ($event) => editInstitution(inst)
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(EditOutlined)),
                                createTextVNode(" Edit ")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(_component_a_button, {
                              type: "text",
                              size: "small",
                              danger: "",
                              onClick: ($event) => deleteInstitution(inst.id)
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(DeleteOutlined)),
                                createTextVNode(" Archive ")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(_component_a_button, {
                              type: "primary",
                              size: "small",
                              onClick: ($event) => navigateTo(`/institutions/${inst.id}`)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Open ")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ])
                        ]),
                        _: 2
                      }, 1032, ["class"])
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`<div class="mt-4 flex justify-center" data-v-32edecf0>`);
      _push(ssrRenderComponent(_component_a_pagination, {
        current: currentPage.value,
        "onUpdate:current": ($event) => currentPage.value = $event,
        total: filteredInstitutions.value.length,
        "page-size": pageSize.value,
        "show-size-changer": "",
        "show-total": (total) => `Total ${total} institutions`
      }, null, _parent));
      _push(`</div></div></div>`);
      _push(ssrRenderComponent(_component_a_modal, {
        open: showCreateModal.value,
        "onUpdate:open": ($event) => showCreateModal.value = $event,
        title: editingInst.value ? "Edit Institution" : "Add Institution",
        "ok-text": "Save",
        "cancel-text": "Cancel",
        onOk: saveInstitution
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_form, { layout: "vertical" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_form_item, {
                    label: "Institution Name",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: formData.value.name,
                          "onUpdate:value": ($event) => formData.value.name = $event,
                          placeholder: "Enter institution name"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: formData.value.name,
                            "onUpdate:value": ($event) => formData.value.name = $event,
                            placeholder: "Enter institution name"
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, {
                    label: "Type",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_select, {
                          value: formData.value.type,
                          "onUpdate:value": ($event) => formData.value.type = $event
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_select_option, { value: "University" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`University`);
                                  } else {
                                    return [
                                      createTextVNode("University")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_select_option, { value: "College" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`College`);
                                  } else {
                                    return [
                                      createTextVNode("College")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_select_option, { value: "Academy" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Academy`);
                                  } else {
                                    return [
                                      createTextVNode("Academy")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_select_option, { value: "Institute" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Institute`);
                                  } else {
                                    return [
                                      createTextVNode("Institute")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_select_option, { value: "University" }, {
                                  default: withCtx(() => [
                                    createTextVNode("University")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_select_option, { value: "College" }, {
                                  default: withCtx(() => [
                                    createTextVNode("College")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_select_option, { value: "Academy" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Academy")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_select_option, { value: "Institute" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Institute")
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
                            value: formData.value.type,
                            "onUpdate:value": ($event) => formData.value.type = $event
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_select_option, { value: "University" }, {
                                default: withCtx(() => [
                                  createTextVNode("University")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_select_option, { value: "College" }, {
                                default: withCtx(() => [
                                  createTextVNode("College")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_select_option, { value: "Academy" }, {
                                default: withCtx(() => [
                                  createTextVNode("Academy")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_select_option, { value: "Institute" }, {
                                default: withCtx(() => [
                                  createTextVNode("Institute")
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
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Location" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: formData.value.location,
                          "onUpdate:value": ($event) => formData.value.location = $event,
                          placeholder: "Enter location"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: formData.value.location,
                            "onUpdate:value": ($event) => formData.value.location = $event,
                            placeholder: "Enter location"
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
                          value: formData.value.email,
                          "onUpdate:value": ($event) => formData.value.email = $event,
                          type: "email",
                          placeholder: "Enter email"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: formData.value.email,
                            "onUpdate:value": ($event) => formData.value.email = $event,
                            type: "email",
                            placeholder: "Enter email"
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
                          value: formData.value.phone,
                          "onUpdate:value": ($event) => formData.value.phone = $event,
                          placeholder: "Enter phone number"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: formData.value.phone,
                            "onUpdate:value": ($event) => formData.value.phone = $event,
                            placeholder: "Enter phone number"
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Status" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_switch, {
                          checked: formData.value.active,
                          "onUpdate:checked": ($event) => formData.value.active = $event
                        }, null, _parent4, _scopeId3));
                        _push4(`<span class="ml-2" data-v-32edecf0${_scopeId3}>${ssrInterpolate(formData.value.active ? "Active" : "Inactive")}</span>`);
                      } else {
                        return [
                          createVNode(_component_a_switch, {
                            checked: formData.value.active,
                            "onUpdate:checked": ($event) => formData.value.active = $event
                          }, null, 8, ["checked", "onUpdate:checked"]),
                          createVNode("span", { class: "ml-2" }, toDisplayString(formData.value.active ? "Active" : "Inactive"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_form_item, {
                      label: "Institution Name",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: formData.value.name,
                          "onUpdate:value": ($event) => formData.value.name = $event,
                          placeholder: "Enter institution name"
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, {
                      label: "Type",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_select, {
                          value: formData.value.type,
                          "onUpdate:value": ($event) => formData.value.type = $event
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_select_option, { value: "University" }, {
                              default: withCtx(() => [
                                createTextVNode("University")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_select_option, { value: "College" }, {
                              default: withCtx(() => [
                                createTextVNode("College")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_select_option, { value: "Academy" }, {
                              default: withCtx(() => [
                                createTextVNode("Academy")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_select_option, { value: "Institute" }, {
                              default: withCtx(() => [
                                createTextVNode("Institute")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Location" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: formData.value.location,
                          "onUpdate:value": ($event) => formData.value.location = $event,
                          placeholder: "Enter location"
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Email" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: formData.value.email,
                          "onUpdate:value": ($event) => formData.value.email = $event,
                          type: "email",
                          placeholder: "Enter email"
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Phone" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: formData.value.phone,
                          "onUpdate:value": ($event) => formData.value.phone = $event,
                          placeholder: "Enter phone number"
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Status" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_switch, {
                          checked: formData.value.active,
                          "onUpdate:checked": ($event) => formData.value.active = $event
                        }, null, 8, ["checked", "onUpdate:checked"]),
                        createVNode("span", { class: "ml-2" }, toDisplayString(formData.value.active ? "Active" : "Inactive"), 1)
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
                  createVNode(_component_a_form_item, {
                    label: "Institution Name",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: formData.value.name,
                        "onUpdate:value": ($event) => formData.value.name = $event,
                        placeholder: "Enter institution name"
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, {
                    label: "Type",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_select, {
                        value: formData.value.type,
                        "onUpdate:value": ($event) => formData.value.type = $event
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_select_option, { value: "University" }, {
                            default: withCtx(() => [
                              createTextVNode("University")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "College" }, {
                            default: withCtx(() => [
                              createTextVNode("College")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "Academy" }, {
                            default: withCtx(() => [
                              createTextVNode("Academy")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "Institute" }, {
                            default: withCtx(() => [
                              createTextVNode("Institute")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Location" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: formData.value.location,
                        "onUpdate:value": ($event) => formData.value.location = $event,
                        placeholder: "Enter location"
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Email" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: formData.value.email,
                        "onUpdate:value": ($event) => formData.value.email = $event,
                        type: "email",
                        placeholder: "Enter email"
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Phone" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: formData.value.phone,
                        "onUpdate:value": ($event) => formData.value.phone = $event,
                        placeholder: "Enter phone number"
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Status" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_switch, {
                        checked: formData.value.active,
                        "onUpdate:checked": ($event) => formData.value.active = $event
                      }, null, 8, ["checked", "onUpdate:checked"]),
                      createVNode("span", { class: "ml-2" }, toDisplayString(formData.value.active ? "Active" : "Inactive"), 1)
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
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/institutions/nuxt/pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-32edecf0"]]);

export { index as default };
//# sourceMappingURL=index-DZsOVwKN.mjs.map
