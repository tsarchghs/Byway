import { defineComponent, ref, computed, resolveComponent, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import { useRouter, useRoute } from 'vue-router';
import { theme, message } from 'ant-design-vue';
import { BulbOutlined, SaveOutlined } from '@ant-design/icons-vue';
import { _ as _export_sfc } from './server.mjs';
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

const API_URL = "http://localhost:4000/api/teach-internal/graphql";
const API_BASE = "http://localhost:4000";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const isDark = ref(false);
    function toggleDark() {
      isDark.value = !isDark.value;
    }
    const router = useRouter();
    function goBack() {
      router.back();
    }
    function useTeacherId() {
      const route2 = useRoute();
      return computed(() => {
        if (route2.params.teacherId) return route2.params.teacherId;
        return null;
      });
    }
    const teacherId = useTeacherId();
    const fmt = (n) => n.toLocaleString(void 0, { style: "currency", currency: "EUR" });
    const form = ref({
      title: "",
      category: "",
      difficulty: "Beginner",
      description: "",
      price: 0,
      discount: 0,
      coverUrl: ""
    });
    const payable = computed(
      () => Number(form.value.price || 0) * (1 - Number(form.value.discount || 0) / 100)
    );
    const diffOptions = [
      { label: "Beginner", value: "Beginner" },
      { label: "Intermediate", value: "Intermediate" },
      { label: "Advanced", value: "Advanced" }
    ];
    const formRef = ref();
    const rules = {
      title: [{ required: true, message: "Title is required" }],
      price: [{ type: "number", min: 0, message: "Price must be ≥ 0" }],
      discount: [{ type: "number", min: 0, max: 100, message: "0–100" }]
    };
    function getAuthHeaders() {
      const headers = { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("token") };
      return headers;
    }
    async function fetchGraphQL(query, variables) {
      const resp = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify({ query, variables })
      });
      const json = await resp.json();
      if (json.errors?.length) throw new Error(json.errors[0]?.message || "GraphQL error");
      return json.data;
    }
    const GQL = {
      createCourse: `
    mutation CreateCourse(
      $title:String!,
      $category:String,
      $difficulty:String,
      $description:String,
      $price:Float,
      $discount:Float,
      $teacherId:String!
    ){
      createCourse(
        title:$title,
        category:$category,
        difficulty:$difficulty,
        description:$description,
        price:$price,
        discount:$discount,
        teacherId:$teacherId
      ){ id }
    }
  `,
      updateCourseCover: `
    mutation UpdateCourse($id:String!, $coverUrl:String){
      updateCourse(id:$id, coverUrl:$coverUrl){ id }
    }
  `
    };
    const loading = ref(false);
    const creating = ref(false);
    async function submit() {
      try {
        await formRef.value?.validate();
      } catch {
        return;
      }
      creating.value = true;
      try {
        const base = {
          title: form.value.title.trim(),
          category: form.value.category.trim() || null,
          difficulty: form.value.difficulty || null,
          description: form.value.description || "",
          price: Number(form.value.price || 0),
          discount: Number(form.value.discount || 0),
          teacherId: teacherId.value
        };
        const data = await fetchGraphQL(GQL.createCourse, base);
        const newId = data.createCourse.id;
        const cover = (form.value.coverUrl || "").trim();
        if (cover) await fetchGraphQL(GQL.updateCourseCover, { id: newId, coverUrl: cover });
        const classroomId = route.query?.classroomId || null;
        if (classroomId) {
          try {
            await fetch(`${API_BASE}/api/institutions/classrooms/${encodeURIComponent(classroomId)}/bind-course`, {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify({ courseId: newId })
            });
          } catch {
          }
        }
        message.success("Course created");
        router.push(`/teach-internal/${teacherId.value}/course/${newId}/module/new/view`);
      } catch (e) {
        message.error(e?.message || "Create course failed");
      } finally {
        creating.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_config_provider = resolveComponent("a-config-provider");
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_tooltip = resolveComponent("a-tooltip");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_layout_content = resolveComponent("a-layout-content");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_form = resolveComponent("a-form");
      const _component_a_form_item = resolveComponent("a-form-item");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_select = resolveComponent("a-select");
      const _component_a_textarea = resolveComponent("a-textarea");
      const _component_a_input_number = resolveComponent("a-input-number");
      const _component_a_alert = resolveComponent("a-alert");
      const _component_a_tag = resolveComponent("a-tag");
      _push(ssrRenderComponent(_component_a_config_provider, mergeProps({
        theme: { algorithm: isDark.value ? unref(theme).darkAlgorithm : unref(theme).defaultAlgorithm }
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_layout, {
              class: ["admin-wrap", isDark.value ? "is-dark" : ""]
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_page_header, {
                    class: "admin-header",
                    title: "Create Course",
                    "sub-title": "Step 1 • Basic details",
                    onBack: goBack
                  }, {
                    extra: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_space, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_tooltip, { title: "Toggle dark" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_button, {
                                      shape: "circle",
                                      onClick: toggleDark
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(unref(BulbOutlined), null, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(unref(BulbOutlined))
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_button, {
                                        shape: "circle",
                                        onClick: toggleDark
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(BulbOutlined))
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
                                createVNode(_component_a_tooltip, { title: "Toggle dark" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      shape: "circle",
                                      onClick: toggleDark
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(BulbOutlined))
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
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_space, null, {
                            default: withCtx(() => [
                              createVNode(_component_a_tooltip, { title: "Toggle dark" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_button, {
                                    shape: "circle",
                                    onClick: toggleDark
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(BulbOutlined))
                                    ]),
                                    _: 1
                                  })
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
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_layout_content, { class: "content" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_row, { gutter: 16 }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_col, {
                                md: 16,
                                xs: 24
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_card, {
                                      title: "Course details",
                                      loading: loading.value
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_form, {
                                            ref_key: "formRef",
                                            ref: formRef,
                                            layout: "vertical",
                                            model: form.value,
                                            rules
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_a_form_item, {
                                                  label: "Title",
                                                  name: "title"
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(_component_a_input, {
                                                        value: form.value.title,
                                                        "onUpdate:value": ($event) => form.value.title = $event,
                                                        placeholder: "e.g. Advanced Vue 3 Workshop"
                                                      }, null, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(_component_a_input, {
                                                          value: form.value.title,
                                                          "onUpdate:value": ($event) => form.value.title = $event,
                                                          placeholder: "e.g. Advanced Vue 3 Workshop"
                                                        }, null, 8, ["value", "onUpdate:value"])
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(_component_a_form_item, {
                                                  label: "Category",
                                                  name: "category"
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(_component_a_input, {
                                                        value: form.value.category,
                                                        "onUpdate:value": ($event) => form.value.category = $event,
                                                        placeholder: "e.g. Programming"
                                                      }, null, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(_component_a_input, {
                                                          value: form.value.category,
                                                          "onUpdate:value": ($event) => form.value.category = $event,
                                                          placeholder: "e.g. Programming"
                                                        }, null, 8, ["value", "onUpdate:value"])
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(_component_a_form_item, {
                                                  label: "Difficulty",
                                                  name: "difficulty"
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(_component_a_select, {
                                                        value: form.value.difficulty,
                                                        "onUpdate:value": ($event) => form.value.difficulty = $event,
                                                        options: diffOptions
                                                      }, null, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(_component_a_select, {
                                                          value: form.value.difficulty,
                                                          "onUpdate:value": ($event) => form.value.difficulty = $event,
                                                          options: diffOptions
                                                        }, null, 8, ["value", "onUpdate:value"])
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(_component_a_form_item, {
                                                  label: "Description",
                                                  name: "description"
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(_component_a_textarea, {
                                                        value: form.value.description,
                                                        "onUpdate:value": ($event) => form.value.description = $event,
                                                        rows: 5,
                                                        placeholder: "What will students learn?"
                                                      }, null, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(_component_a_textarea, {
                                                          value: form.value.description,
                                                          "onUpdate:value": ($event) => form.value.description = $event,
                                                          rows: 5,
                                                          placeholder: "What will students learn?"
                                                        }, null, 8, ["value", "onUpdate:value"])
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(_component_a_row, { gutter: 16 }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(_component_a_col, { span: 12 }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(_component_a_form_item, {
                                                              label: "Price (EUR)",
                                                              name: "price"
                                                            }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(ssrRenderComponent(_component_a_input_number, {
                                                                    value: form.value.price,
                                                                    "onUpdate:value": ($event) => form.value.price = $event,
                                                                    min: 0,
                                                                    style: { "width": "100%" }
                                                                  }, null, _parent11, _scopeId10));
                                                                } else {
                                                                  return [
                                                                    createVNode(_component_a_input_number, {
                                                                      value: form.value.price,
                                                                      "onUpdate:value": ($event) => form.value.price = $event,
                                                                      min: 0,
                                                                      style: { "width": "100%" }
                                                                    }, null, 8, ["value", "onUpdate:value"])
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(_component_a_form_item, {
                                                                label: "Price (EUR)",
                                                                name: "price"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(_component_a_input_number, {
                                                                    value: form.value.price,
                                                                    "onUpdate:value": ($event) => form.value.price = $event,
                                                                    min: 0,
                                                                    style: { "width": "100%" }
                                                                  }, null, 8, ["value", "onUpdate:value"])
                                                                ]),
                                                                _: 1
                                                              })
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(_component_a_col, { span: 12 }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(_component_a_form_item, {
                                                              label: "Discount (%)",
                                                              name: "discount"
                                                            }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(ssrRenderComponent(_component_a_input_number, {
                                                                    value: form.value.discount,
                                                                    "onUpdate:value": ($event) => form.value.discount = $event,
                                                                    min: 0,
                                                                    max: 100,
                                                                    style: { "width": "100%" }
                                                                  }, null, _parent11, _scopeId10));
                                                                } else {
                                                                  return [
                                                                    createVNode(_component_a_input_number, {
                                                                      value: form.value.discount,
                                                                      "onUpdate:value": ($event) => form.value.discount = $event,
                                                                      min: 0,
                                                                      max: 100,
                                                                      style: { "width": "100%" }
                                                                    }, null, 8, ["value", "onUpdate:value"])
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(_component_a_form_item, {
                                                                label: "Discount (%)",
                                                                name: "discount"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(_component_a_input_number, {
                                                                    value: form.value.discount,
                                                                    "onUpdate:value": ($event) => form.value.discount = $event,
                                                                    min: 0,
                                                                    max: 100,
                                                                    style: { "width": "100%" }
                                                                  }, null, 8, ["value", "onUpdate:value"])
                                                                ]),
                                                                _: 1
                                                              })
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(_component_a_col, { span: 12 }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_form_item, {
                                                              label: "Price (EUR)",
                                                              name: "price"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_input_number, {
                                                                  value: form.value.price,
                                                                  "onUpdate:value": ($event) => form.value.price = $event,
                                                                  min: 0,
                                                                  style: { "width": "100%" }
                                                                }, null, 8, ["value", "onUpdate:value"])
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(_component_a_col, { span: 12 }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_form_item, {
                                                              label: "Discount (%)",
                                                              name: "discount"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_input_number, {
                                                                  value: form.value.discount,
                                                                  "onUpdate:value": ($event) => form.value.discount = $event,
                                                                  min: 0,
                                                                  max: 100,
                                                                  style: { "width": "100%" }
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
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(_component_a_form_item, {
                                                  label: "Cover URL (optional)",
                                                  name: "coverUrl"
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(_component_a_input, {
                                                        value: form.value.coverUrl,
                                                        "onUpdate:value": ($event) => form.value.coverUrl = $event,
                                                        placeholder: "https://…"
                                                      }, null, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(_component_a_input, {
                                                          value: form.value.coverUrl,
                                                          "onUpdate:value": ($event) => form.value.coverUrl = $event,
                                                          placeholder: "https://…"
                                                        }, null, 8, ["value", "onUpdate:value"])
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(_component_a_alert, {
                                                  type: "info",
                                                  "show-icon": "",
                                                  message: `Preview price: ${fmt(payable.value)}`,
                                                  class: "mb-2"
                                                }, null, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(_component_a_space, null, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(_component_a_button, { onClick: goBack }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`Cancel`);
                                                          } else {
                                                            return [
                                                              createTextVNode("Cancel")
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(_component_a_button, {
                                                        type: "primary",
                                                        loading: creating.value,
                                                        onClick: submit
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(unref(SaveOutlined), null, null, _parent10, _scopeId9));
                                                            _push10(` Create &amp; Open Editor `);
                                                          } else {
                                                            return [
                                                              createVNode(unref(SaveOutlined)),
                                                              createTextVNode(" Create & Open Editor ")
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(_component_a_button, { onClick: goBack }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Cancel")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(_component_a_button, {
                                                          type: "primary",
                                                          loading: creating.value,
                                                          onClick: submit
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(SaveOutlined)),
                                                            createTextVNode(" Create & Open Editor ")
                                                          ]),
                                                          _: 1
                                                        }, 8, ["loading"])
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(_component_a_form_item, {
                                                    label: "Title",
                                                    name: "title"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_input, {
                                                        value: form.value.title,
                                                        "onUpdate:value": ($event) => form.value.title = $event,
                                                        placeholder: "e.g. Advanced Vue 3 Workshop"
                                                      }, null, 8, ["value", "onUpdate:value"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(_component_a_form_item, {
                                                    label: "Category",
                                                    name: "category"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_input, {
                                                        value: form.value.category,
                                                        "onUpdate:value": ($event) => form.value.category = $event,
                                                        placeholder: "e.g. Programming"
                                                      }, null, 8, ["value", "onUpdate:value"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(_component_a_form_item, {
                                                    label: "Difficulty",
                                                    name: "difficulty"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_select, {
                                                        value: form.value.difficulty,
                                                        "onUpdate:value": ($event) => form.value.difficulty = $event,
                                                        options: diffOptions
                                                      }, null, 8, ["value", "onUpdate:value"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(_component_a_form_item, {
                                                    label: "Description",
                                                    name: "description"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_textarea, {
                                                        value: form.value.description,
                                                        "onUpdate:value": ($event) => form.value.description = $event,
                                                        rows: 5,
                                                        placeholder: "What will students learn?"
                                                      }, null, 8, ["value", "onUpdate:value"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(_component_a_row, { gutter: 16 }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_col, { span: 12 }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_form_item, {
                                                            label: "Price (EUR)",
                                                            name: "price"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_input_number, {
                                                                value: form.value.price,
                                                                "onUpdate:value": ($event) => form.value.price = $event,
                                                                min: 0,
                                                                style: { "width": "100%" }
                                                              }, null, 8, ["value", "onUpdate:value"])
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(_component_a_col, { span: 12 }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_form_item, {
                                                            label: "Discount (%)",
                                                            name: "discount"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_input_number, {
                                                                value: form.value.discount,
                                                                "onUpdate:value": ($event) => form.value.discount = $event,
                                                                min: 0,
                                                                max: 100,
                                                                style: { "width": "100%" }
                                                              }, null, 8, ["value", "onUpdate:value"])
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(_component_a_form_item, {
                                                    label: "Cover URL (optional)",
                                                    name: "coverUrl"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_input, {
                                                        value: form.value.coverUrl,
                                                        "onUpdate:value": ($event) => form.value.coverUrl = $event,
                                                        placeholder: "https://…"
                                                      }, null, 8, ["value", "onUpdate:value"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(_component_a_alert, {
                                                    type: "info",
                                                    "show-icon": "",
                                                    message: `Preview price: ${fmt(payable.value)}`,
                                                    class: "mb-2"
                                                  }, null, 8, ["message"]),
                                                  createVNode(_component_a_space, null, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_button, { onClick: goBack }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Cancel")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(_component_a_button, {
                                                        type: "primary",
                                                        loading: creating.value,
                                                        onClick: submit
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(SaveOutlined)),
                                                          createTextVNode(" Create & Open Editor ")
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
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_form, {
                                              ref_key: "formRef",
                                              ref: formRef,
                                              layout: "vertical",
                                              model: form.value,
                                              rules
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_form_item, {
                                                  label: "Title",
                                                  name: "title"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_input, {
                                                      value: form.value.title,
                                                      "onUpdate:value": ($event) => form.value.title = $event,
                                                      placeholder: "e.g. Advanced Vue 3 Workshop"
                                                    }, null, 8, ["value", "onUpdate:value"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_form_item, {
                                                  label: "Category",
                                                  name: "category"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_input, {
                                                      value: form.value.category,
                                                      "onUpdate:value": ($event) => form.value.category = $event,
                                                      placeholder: "e.g. Programming"
                                                    }, null, 8, ["value", "onUpdate:value"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_form_item, {
                                                  label: "Difficulty",
                                                  name: "difficulty"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_select, {
                                                      value: form.value.difficulty,
                                                      "onUpdate:value": ($event) => form.value.difficulty = $event,
                                                      options: diffOptions
                                                    }, null, 8, ["value", "onUpdate:value"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_form_item, {
                                                  label: "Description",
                                                  name: "description"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_textarea, {
                                                      value: form.value.description,
                                                      "onUpdate:value": ($event) => form.value.description = $event,
                                                      rows: 5,
                                                      placeholder: "What will students learn?"
                                                    }, null, 8, ["value", "onUpdate:value"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_row, { gutter: 16 }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_col, { span: 12 }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_form_item, {
                                                          label: "Price (EUR)",
                                                          name: "price"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_input_number, {
                                                              value: form.value.price,
                                                              "onUpdate:value": ($event) => form.value.price = $event,
                                                              min: 0,
                                                              style: { "width": "100%" }
                                                            }, null, 8, ["value", "onUpdate:value"])
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_col, { span: 12 }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_form_item, {
                                                          label: "Discount (%)",
                                                          name: "discount"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_input_number, {
                                                              value: form.value.discount,
                                                              "onUpdate:value": ($event) => form.value.discount = $event,
                                                              min: 0,
                                                              max: 100,
                                                              style: { "width": "100%" }
                                                            }, null, 8, ["value", "onUpdate:value"])
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_form_item, {
                                                  label: "Cover URL (optional)",
                                                  name: "coverUrl"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_input, {
                                                      value: form.value.coverUrl,
                                                      "onUpdate:value": ($event) => form.value.coverUrl = $event,
                                                      placeholder: "https://…"
                                                    }, null, 8, ["value", "onUpdate:value"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_alert, {
                                                  type: "info",
                                                  "show-icon": "",
                                                  message: `Preview price: ${fmt(payable.value)}`,
                                                  class: "mb-2"
                                                }, null, 8, ["message"]),
                                                createVNode(_component_a_space, null, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_button, { onClick: goBack }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Cancel")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_button, {
                                                      type: "primary",
                                                      loading: creating.value,
                                                      onClick: submit
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(SaveOutlined)),
                                                        createTextVNode(" Create & Open Editor ")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["loading"])
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }, 8, ["model"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_card, {
                                        title: "Course details",
                                        loading: loading.value
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_form, {
                                            ref_key: "formRef",
                                            ref: formRef,
                                            layout: "vertical",
                                            model: form.value,
                                            rules
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_form_item, {
                                                label: "Title",
                                                name: "title"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_input, {
                                                    value: form.value.title,
                                                    "onUpdate:value": ($event) => form.value.title = $event,
                                                    placeholder: "e.g. Advanced Vue 3 Workshop"
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_form_item, {
                                                label: "Category",
                                                name: "category"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_input, {
                                                    value: form.value.category,
                                                    "onUpdate:value": ($event) => form.value.category = $event,
                                                    placeholder: "e.g. Programming"
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_form_item, {
                                                label: "Difficulty",
                                                name: "difficulty"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_select, {
                                                    value: form.value.difficulty,
                                                    "onUpdate:value": ($event) => form.value.difficulty = $event,
                                                    options: diffOptions
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_form_item, {
                                                label: "Description",
                                                name: "description"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_textarea, {
                                                    value: form.value.description,
                                                    "onUpdate:value": ($event) => form.value.description = $event,
                                                    rows: 5,
                                                    placeholder: "What will students learn?"
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_row, { gutter: 16 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_col, { span: 12 }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_form_item, {
                                                        label: "Price (EUR)",
                                                        name: "price"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_input_number, {
                                                            value: form.value.price,
                                                            "onUpdate:value": ($event) => form.value.price = $event,
                                                            min: 0,
                                                            style: { "width": "100%" }
                                                          }, null, 8, ["value", "onUpdate:value"])
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(_component_a_col, { span: 12 }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_form_item, {
                                                        label: "Discount (%)",
                                                        name: "discount"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_input_number, {
                                                            value: form.value.discount,
                                                            "onUpdate:value": ($event) => form.value.discount = $event,
                                                            min: 0,
                                                            max: 100,
                                                            style: { "width": "100%" }
                                                          }, null, 8, ["value", "onUpdate:value"])
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_form_item, {
                                                label: "Cover URL (optional)",
                                                name: "coverUrl"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_input, {
                                                    value: form.value.coverUrl,
                                                    "onUpdate:value": ($event) => form.value.coverUrl = $event,
                                                    placeholder: "https://…"
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_alert, {
                                                type: "info",
                                                "show-icon": "",
                                                message: `Preview price: ${fmt(payable.value)}`,
                                                class: "mb-2"
                                              }, null, 8, ["message"]),
                                              createVNode(_component_a_space, null, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_button, { onClick: goBack }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Cancel")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(_component_a_button, {
                                                    type: "primary",
                                                    loading: creating.value,
                                                    onClick: submit
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(SaveOutlined)),
                                                      createTextVNode(" Create & Open Editor ")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["loading"])
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }, 8, ["model"])
                                        ]),
                                        _: 1
                                      }, 8, ["loading"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_col, {
                                md: 8,
                                xs: 24
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_card, { title: "Live preview" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<div class="preview" data-v-811cf927${_scopeId6}><div class="cover" style="${ssrRenderStyle({
                                            backgroundImage: form.value.coverUrl ? `url('${form.value.coverUrl}')` : "linear-gradient(135deg,#111,#334155)"
                                          })}" data-v-811cf927${_scopeId6}></div><div class="meta" data-v-811cf927${_scopeId6}><div class="title" data-v-811cf927${_scopeId6}>${ssrInterpolate(form.value.title || "Untitled course")}</div><div class="tags" data-v-811cf927${_scopeId6}>`);
                                          if (form.value.category) {
                                            _push7(ssrRenderComponent(_component_a_tag, { color: "blue" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(form.value.category)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(form.value.category), 1)
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            _push7(`<!---->`);
                                          }
                                          if (form.value.difficulty) {
                                            _push7(ssrRenderComponent(_component_a_tag, { color: "gold" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(form.value.difficulty)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(form.value.difficulty), 1)
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            _push7(`<!---->`);
                                          }
                                          _push7(`</div><div class="price" data-v-811cf927${_scopeId6}>${ssrInterpolate(fmt(payable.value))}</div></div></div>`);
                                        } else {
                                          return [
                                            createVNode("div", { class: "preview" }, [
                                              createVNode("div", {
                                                class: "cover",
                                                style: {
                                                  backgroundImage: form.value.coverUrl ? `url('${form.value.coverUrl}')` : "linear-gradient(135deg,#111,#334155)"
                                                }
                                              }, null, 4),
                                              createVNode("div", { class: "meta" }, [
                                                createVNode("div", { class: "title" }, toDisplayString(form.value.title || "Untitled course"), 1),
                                                createVNode("div", { class: "tags" }, [
                                                  form.value.category ? (openBlock(), createBlock(_component_a_tag, {
                                                    key: 0,
                                                    color: "blue"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(form.value.category), 1)
                                                    ]),
                                                    _: 1
                                                  })) : createCommentVNode("", true),
                                                  form.value.difficulty ? (openBlock(), createBlock(_component_a_tag, {
                                                    key: 1,
                                                    color: "gold"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(form.value.difficulty), 1)
                                                    ]),
                                                    _: 1
                                                  })) : createCommentVNode("", true)
                                                ]),
                                                createVNode("div", { class: "price" }, toDisplayString(fmt(payable.value)), 1)
                                              ])
                                            ])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_card, { title: "Live preview" }, {
                                        default: withCtx(() => [
                                          createVNode("div", { class: "preview" }, [
                                            createVNode("div", {
                                              class: "cover",
                                              style: {
                                                backgroundImage: form.value.coverUrl ? `url('${form.value.coverUrl}')` : "linear-gradient(135deg,#111,#334155)"
                                              }
                                            }, null, 4),
                                            createVNode("div", { class: "meta" }, [
                                              createVNode("div", { class: "title" }, toDisplayString(form.value.title || "Untitled course"), 1),
                                              createVNode("div", { class: "tags" }, [
                                                form.value.category ? (openBlock(), createBlock(_component_a_tag, {
                                                  key: 0,
                                                  color: "blue"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(form.value.category), 1)
                                                  ]),
                                                  _: 1
                                                })) : createCommentVNode("", true),
                                                form.value.difficulty ? (openBlock(), createBlock(_component_a_tag, {
                                                  key: 1,
                                                  color: "gold"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(form.value.difficulty), 1)
                                                  ]),
                                                  _: 1
                                                })) : createCommentVNode("", true)
                                              ]),
                                              createVNode("div", { class: "price" }, toDisplayString(fmt(payable.value)), 1)
                                            ])
                                          ])
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
                                createVNode(_component_a_col, {
                                  md: 16,
                                  xs: 24
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, {
                                      title: "Course details",
                                      loading: loading.value
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_form, {
                                          ref_key: "formRef",
                                          ref: formRef,
                                          layout: "vertical",
                                          model: form.value,
                                          rules
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_form_item, {
                                              label: "Title",
                                              name: "title"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_input, {
                                                  value: form.value.title,
                                                  "onUpdate:value": ($event) => form.value.title = $event,
                                                  placeholder: "e.g. Advanced Vue 3 Workshop"
                                                }, null, 8, ["value", "onUpdate:value"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_form_item, {
                                              label: "Category",
                                              name: "category"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_input, {
                                                  value: form.value.category,
                                                  "onUpdate:value": ($event) => form.value.category = $event,
                                                  placeholder: "e.g. Programming"
                                                }, null, 8, ["value", "onUpdate:value"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_form_item, {
                                              label: "Difficulty",
                                              name: "difficulty"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_select, {
                                                  value: form.value.difficulty,
                                                  "onUpdate:value": ($event) => form.value.difficulty = $event,
                                                  options: diffOptions
                                                }, null, 8, ["value", "onUpdate:value"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_form_item, {
                                              label: "Description",
                                              name: "description"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_textarea, {
                                                  value: form.value.description,
                                                  "onUpdate:value": ($event) => form.value.description = $event,
                                                  rows: 5,
                                                  placeholder: "What will students learn?"
                                                }, null, 8, ["value", "onUpdate:value"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_row, { gutter: 16 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_col, { span: 12 }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_form_item, {
                                                      label: "Price (EUR)",
                                                      name: "price"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_input_number, {
                                                          value: form.value.price,
                                                          "onUpdate:value": ($event) => form.value.price = $event,
                                                          min: 0,
                                                          style: { "width": "100%" }
                                                        }, null, 8, ["value", "onUpdate:value"])
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_col, { span: 12 }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_form_item, {
                                                      label: "Discount (%)",
                                                      name: "discount"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_input_number, {
                                                          value: form.value.discount,
                                                          "onUpdate:value": ($event) => form.value.discount = $event,
                                                          min: 0,
                                                          max: 100,
                                                          style: { "width": "100%" }
                                                        }, null, 8, ["value", "onUpdate:value"])
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_form_item, {
                                              label: "Cover URL (optional)",
                                              name: "coverUrl"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_input, {
                                                  value: form.value.coverUrl,
                                                  "onUpdate:value": ($event) => form.value.coverUrl = $event,
                                                  placeholder: "https://…"
                                                }, null, 8, ["value", "onUpdate:value"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_alert, {
                                              type: "info",
                                              "show-icon": "",
                                              message: `Preview price: ${fmt(payable.value)}`,
                                              class: "mb-2"
                                            }, null, 8, ["message"]),
                                            createVNode(_component_a_space, null, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_button, { onClick: goBack }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Cancel")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_button, {
                                                  type: "primary",
                                                  loading: creating.value,
                                                  onClick: submit
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(SaveOutlined)),
                                                    createTextVNode(" Create & Open Editor ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["loading"])
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }, 8, ["model"])
                                      ]),
                                      _: 1
                                    }, 8, ["loading"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_col, {
                                  md: 8,
                                  xs: 24
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, { title: "Live preview" }, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "preview" }, [
                                          createVNode("div", {
                                            class: "cover",
                                            style: {
                                              backgroundImage: form.value.coverUrl ? `url('${form.value.coverUrl}')` : "linear-gradient(135deg,#111,#334155)"
                                            }
                                          }, null, 4),
                                          createVNode("div", { class: "meta" }, [
                                            createVNode("div", { class: "title" }, toDisplayString(form.value.title || "Untitled course"), 1),
                                            createVNode("div", { class: "tags" }, [
                                              form.value.category ? (openBlock(), createBlock(_component_a_tag, {
                                                key: 0,
                                                color: "blue"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(form.value.category), 1)
                                                ]),
                                                _: 1
                                              })) : createCommentVNode("", true),
                                              form.value.difficulty ? (openBlock(), createBlock(_component_a_tag, {
                                                key: 1,
                                                color: "gold"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(form.value.difficulty), 1)
                                                ]),
                                                _: 1
                                              })) : createCommentVNode("", true)
                                            ]),
                                            createVNode("div", { class: "price" }, toDisplayString(fmt(payable.value)), 1)
                                          ])
                                        ])
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
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_row, { gutter: 16 }, {
                            default: withCtx(() => [
                              createVNode(_component_a_col, {
                                md: 16,
                                xs: 24
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, {
                                    title: "Course details",
                                    loading: loading.value
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_form, {
                                        ref_key: "formRef",
                                        ref: formRef,
                                        layout: "vertical",
                                        model: form.value,
                                        rules
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_form_item, {
                                            label: "Title",
                                            name: "title"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_input, {
                                                value: form.value.title,
                                                "onUpdate:value": ($event) => form.value.title = $event,
                                                placeholder: "e.g. Advanced Vue 3 Workshop"
                                              }, null, 8, ["value", "onUpdate:value"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_form_item, {
                                            label: "Category",
                                            name: "category"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_input, {
                                                value: form.value.category,
                                                "onUpdate:value": ($event) => form.value.category = $event,
                                                placeholder: "e.g. Programming"
                                              }, null, 8, ["value", "onUpdate:value"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_form_item, {
                                            label: "Difficulty",
                                            name: "difficulty"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_select, {
                                                value: form.value.difficulty,
                                                "onUpdate:value": ($event) => form.value.difficulty = $event,
                                                options: diffOptions
                                              }, null, 8, ["value", "onUpdate:value"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_form_item, {
                                            label: "Description",
                                            name: "description"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_textarea, {
                                                value: form.value.description,
                                                "onUpdate:value": ($event) => form.value.description = $event,
                                                rows: 5,
                                                placeholder: "What will students learn?"
                                              }, null, 8, ["value", "onUpdate:value"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_row, { gutter: 16 }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_col, { span: 12 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_form_item, {
                                                    label: "Price (EUR)",
                                                    name: "price"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_input_number, {
                                                        value: form.value.price,
                                                        "onUpdate:value": ($event) => form.value.price = $event,
                                                        min: 0,
                                                        style: { "width": "100%" }
                                                      }, null, 8, ["value", "onUpdate:value"])
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_col, { span: 12 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_form_item, {
                                                    label: "Discount (%)",
                                                    name: "discount"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_input_number, {
                                                        value: form.value.discount,
                                                        "onUpdate:value": ($event) => form.value.discount = $event,
                                                        min: 0,
                                                        max: 100,
                                                        style: { "width": "100%" }
                                                      }, null, 8, ["value", "onUpdate:value"])
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_form_item, {
                                            label: "Cover URL (optional)",
                                            name: "coverUrl"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_input, {
                                                value: form.value.coverUrl,
                                                "onUpdate:value": ($event) => form.value.coverUrl = $event,
                                                placeholder: "https://…"
                                              }, null, 8, ["value", "onUpdate:value"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_alert, {
                                            type: "info",
                                            "show-icon": "",
                                            message: `Preview price: ${fmt(payable.value)}`,
                                            class: "mb-2"
                                          }, null, 8, ["message"]),
                                          createVNode(_component_a_space, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_button, { onClick: goBack }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Cancel")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_button, {
                                                type: "primary",
                                                loading: creating.value,
                                                onClick: submit
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(SaveOutlined)),
                                                  createTextVNode(" Create & Open Editor ")
                                                ]),
                                                _: 1
                                              }, 8, ["loading"])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["model"])
                                    ]),
                                    _: 1
                                  }, 8, ["loading"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_col, {
                                md: 8,
                                xs: 24
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, { title: "Live preview" }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "preview" }, [
                                        createVNode("div", {
                                          class: "cover",
                                          style: {
                                            backgroundImage: form.value.coverUrl ? `url('${form.value.coverUrl}')` : "linear-gradient(135deg,#111,#334155)"
                                          }
                                        }, null, 4),
                                        createVNode("div", { class: "meta" }, [
                                          createVNode("div", { class: "title" }, toDisplayString(form.value.title || "Untitled course"), 1),
                                          createVNode("div", { class: "tags" }, [
                                            form.value.category ? (openBlock(), createBlock(_component_a_tag, {
                                              key: 0,
                                              color: "blue"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(form.value.category), 1)
                                              ]),
                                              _: 1
                                            })) : createCommentVNode("", true),
                                            form.value.difficulty ? (openBlock(), createBlock(_component_a_tag, {
                                              key: 1,
                                              color: "gold"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(form.value.difficulty), 1)
                                              ]),
                                              _: 1
                                            })) : createCommentVNode("", true)
                                          ]),
                                          createVNode("div", { class: "price" }, toDisplayString(fmt(payable.value)), 1)
                                        ])
                                      ])
                                    ]),
                                    _: 1
                                  })
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_page_header, {
                      class: "admin-header",
                      title: "Create Course",
                      "sub-title": "Step 1 • Basic details",
                      onBack: goBack
                    }, {
                      extra: withCtx(() => [
                        createVNode(_component_a_space, null, {
                          default: withCtx(() => [
                            createVNode(_component_a_tooltip, { title: "Toggle dark" }, {
                              default: withCtx(() => [
                                createVNode(_component_a_button, {
                                  shape: "circle",
                                  onClick: toggleDark
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(BulbOutlined))
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_layout_content, { class: "content" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_row, { gutter: 16 }, {
                          default: withCtx(() => [
                            createVNode(_component_a_col, {
                              md: 16,
                              xs: 24
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, {
                                  title: "Course details",
                                  loading: loading.value
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_form, {
                                      ref_key: "formRef",
                                      ref: formRef,
                                      layout: "vertical",
                                      model: form.value,
                                      rules
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_form_item, {
                                          label: "Title",
                                          name: "title"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_input, {
                                              value: form.value.title,
                                              "onUpdate:value": ($event) => form.value.title = $event,
                                              placeholder: "e.g. Advanced Vue 3 Workshop"
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_form_item, {
                                          label: "Category",
                                          name: "category"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_input, {
                                              value: form.value.category,
                                              "onUpdate:value": ($event) => form.value.category = $event,
                                              placeholder: "e.g. Programming"
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_form_item, {
                                          label: "Difficulty",
                                          name: "difficulty"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_select, {
                                              value: form.value.difficulty,
                                              "onUpdate:value": ($event) => form.value.difficulty = $event,
                                              options: diffOptions
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_form_item, {
                                          label: "Description",
                                          name: "description"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_textarea, {
                                              value: form.value.description,
                                              "onUpdate:value": ($event) => form.value.description = $event,
                                              rows: 5,
                                              placeholder: "What will students learn?"
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_row, { gutter: 16 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_col, { span: 12 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_form_item, {
                                                  label: "Price (EUR)",
                                                  name: "price"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_input_number, {
                                                      value: form.value.price,
                                                      "onUpdate:value": ($event) => form.value.price = $event,
                                                      min: 0,
                                                      style: { "width": "100%" }
                                                    }, null, 8, ["value", "onUpdate:value"])
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_col, { span: 12 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_form_item, {
                                                  label: "Discount (%)",
                                                  name: "discount"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_input_number, {
                                                      value: form.value.discount,
                                                      "onUpdate:value": ($event) => form.value.discount = $event,
                                                      min: 0,
                                                      max: 100,
                                                      style: { "width": "100%" }
                                                    }, null, 8, ["value", "onUpdate:value"])
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_form_item, {
                                          label: "Cover URL (optional)",
                                          name: "coverUrl"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_input, {
                                              value: form.value.coverUrl,
                                              "onUpdate:value": ($event) => form.value.coverUrl = $event,
                                              placeholder: "https://…"
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_alert, {
                                          type: "info",
                                          "show-icon": "",
                                          message: `Preview price: ${fmt(payable.value)}`,
                                          class: "mb-2"
                                        }, null, 8, ["message"]),
                                        createVNode(_component_a_space, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_button, { onClick: goBack }, {
                                              default: withCtx(() => [
                                                createTextVNode("Cancel")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_button, {
                                              type: "primary",
                                              loading: creating.value,
                                              onClick: submit
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(SaveOutlined)),
                                                createTextVNode(" Create & Open Editor ")
                                              ]),
                                              _: 1
                                            }, 8, ["loading"])
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }, 8, ["model"])
                                  ]),
                                  _: 1
                                }, 8, ["loading"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_col, {
                              md: 8,
                              xs: 24
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, { title: "Live preview" }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "preview" }, [
                                      createVNode("div", {
                                        class: "cover",
                                        style: {
                                          backgroundImage: form.value.coverUrl ? `url('${form.value.coverUrl}')` : "linear-gradient(135deg,#111,#334155)"
                                        }
                                      }, null, 4),
                                      createVNode("div", { class: "meta" }, [
                                        createVNode("div", { class: "title" }, toDisplayString(form.value.title || "Untitled course"), 1),
                                        createVNode("div", { class: "tags" }, [
                                          form.value.category ? (openBlock(), createBlock(_component_a_tag, {
                                            key: 0,
                                            color: "blue"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(form.value.category), 1)
                                            ]),
                                            _: 1
                                          })) : createCommentVNode("", true),
                                          form.value.difficulty ? (openBlock(), createBlock(_component_a_tag, {
                                            key: 1,
                                            color: "gold"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(form.value.difficulty), 1)
                                            ]),
                                            _: 1
                                          })) : createCommentVNode("", true)
                                        ]),
                                        createVNode("div", { class: "price" }, toDisplayString(fmt(payable.value)), 1)
                                      ])
                                    ])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
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
          } else {
            return [
              createVNode(_component_a_layout, {
                class: ["admin-wrap", isDark.value ? "is-dark" : ""]
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_page_header, {
                    class: "admin-header",
                    title: "Create Course",
                    "sub-title": "Step 1 • Basic details",
                    onBack: goBack
                  }, {
                    extra: withCtx(() => [
                      createVNode(_component_a_space, null, {
                        default: withCtx(() => [
                          createVNode(_component_a_tooltip, { title: "Toggle dark" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, {
                                shape: "circle",
                                onClick: toggleDark
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(BulbOutlined))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_layout_content, { class: "content" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_row, { gutter: 16 }, {
                        default: withCtx(() => [
                          createVNode(_component_a_col, {
                            md: 16,
                            xs: 24
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                title: "Course details",
                                loading: loading.value
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_form, {
                                    ref_key: "formRef",
                                    ref: formRef,
                                    layout: "vertical",
                                    model: form.value,
                                    rules
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_form_item, {
                                        label: "Title",
                                        name: "title"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_input, {
                                            value: form.value.title,
                                            "onUpdate:value": ($event) => form.value.title = $event,
                                            placeholder: "e.g. Advanced Vue 3 Workshop"
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, {
                                        label: "Category",
                                        name: "category"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_input, {
                                            value: form.value.category,
                                            "onUpdate:value": ($event) => form.value.category = $event,
                                            placeholder: "e.g. Programming"
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, {
                                        label: "Difficulty",
                                        name: "difficulty"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_select, {
                                            value: form.value.difficulty,
                                            "onUpdate:value": ($event) => form.value.difficulty = $event,
                                            options: diffOptions
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, {
                                        label: "Description",
                                        name: "description"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_textarea, {
                                            value: form.value.description,
                                            "onUpdate:value": ($event) => form.value.description = $event,
                                            rows: 5,
                                            placeholder: "What will students learn?"
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_row, { gutter: 16 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_col, { span: 12 }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_form_item, {
                                                label: "Price (EUR)",
                                                name: "price"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_input_number, {
                                                    value: form.value.price,
                                                    "onUpdate:value": ($event) => form.value.price = $event,
                                                    min: 0,
                                                    style: { "width": "100%" }
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_col, { span: 12 }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_form_item, {
                                                label: "Discount (%)",
                                                name: "discount"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_input_number, {
                                                    value: form.value.discount,
                                                    "onUpdate:value": ($event) => form.value.discount = $event,
                                                    min: 0,
                                                    max: 100,
                                                    style: { "width": "100%" }
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, {
                                        label: "Cover URL (optional)",
                                        name: "coverUrl"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_input, {
                                            value: form.value.coverUrl,
                                            "onUpdate:value": ($event) => form.value.coverUrl = $event,
                                            placeholder: "https://…"
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_alert, {
                                        type: "info",
                                        "show-icon": "",
                                        message: `Preview price: ${fmt(payable.value)}`,
                                        class: "mb-2"
                                      }, null, 8, ["message"]),
                                      createVNode(_component_a_space, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_button, { onClick: goBack }, {
                                            default: withCtx(() => [
                                              createTextVNode("Cancel")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_button, {
                                            type: "primary",
                                            loading: creating.value,
                                            onClick: submit
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(SaveOutlined)),
                                              createTextVNode(" Create & Open Editor ")
                                            ]),
                                            _: 1
                                          }, 8, ["loading"])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["model"])
                                ]),
                                _: 1
                              }, 8, ["loading"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            md: 8,
                            xs: 24
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, { title: "Live preview" }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "preview" }, [
                                    createVNode("div", {
                                      class: "cover",
                                      style: {
                                        backgroundImage: form.value.coverUrl ? `url('${form.value.coverUrl}')` : "linear-gradient(135deg,#111,#334155)"
                                      }
                                    }, null, 4),
                                    createVNode("div", { class: "meta" }, [
                                      createVNode("div", { class: "title" }, toDisplayString(form.value.title || "Untitled course"), 1),
                                      createVNode("div", { class: "tags" }, [
                                        form.value.category ? (openBlock(), createBlock(_component_a_tag, {
                                          key: 0,
                                          color: "blue"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(form.value.category), 1)
                                          ]),
                                          _: 1
                                        })) : createCommentVNode("", true),
                                        form.value.difficulty ? (openBlock(), createBlock(_component_a_tag, {
                                          key: 1,
                                          color: "gold"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(form.value.difficulty), 1)
                                          ]),
                                          _: 1
                                        })) : createCommentVNode("", true)
                                      ]),
                                      createVNode("div", { class: "price" }, toDisplayString(fmt(payable.value)), 1)
                                    ])
                                  ])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["class"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/teach-internal/nuxt/pages/course/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const create = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-811cf927"]]);

export { create as default };
//# sourceMappingURL=create-DeycirvI.mjs.map
