import { defineComponent, ref, resolveComponent, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, Fragment, renderList, withModifiers, createCommentVNode, h, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { $ as $fetch } from '../_/nitro.mjs';
import { d as useRoute, b as useRuntimeConfig } from './server.mjs';
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
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const config = useRuntimeConfig();
    const baseUrl = config.public?.apiBase || "http://localhost:4000";
    const module = ref(null);
    const lessons = ref([]);
    const dirty = ref(false);
    const dragIndex = ref(null);
    function dragStart(idx) {
      dragIndex.value = idx;
    }
    function drop(idx) {
      const from = dragIndex.value;
      if (from === null || from === idx) return;
      const item = lessons.value.splice(from, 1)[0];
      lessons.value.splice(idx, 0, item);
      dirty.value = true;
    }
    async function loadLessons() {
      if (!module.value) return;
      const q = "query($moduleId:String!){ lessonsByModule(moduleId:$moduleId){ id title position } }";
      const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: "POST", body: { query: q, variables: { moduleId: module.value.id } } });
      lessons.value = r.data?.lessonsByModule ?? [];
    }
    async function saveOrder() {
      const ids = lessons.value.map((l) => l.id);
      const q = "mutation($moduleId:String!,$ids:[String!]!){ reorderLessons(moduleId:$moduleId, ids:$ids) }";
      await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: "POST", body: { query: q, variables: { moduleId: module.value.id, ids } } });
      dirty.value = false;
      await loadLessons();
    }
    const resources = ref([]);
    const rName = ref("");
    const rUrl = ref("");
    function addResource() {
      if (rName.value && rUrl.value) {
        resources.value.unshift({ name: rName.value, url: rUrl.value });
        rName.value = "";
        rUrl.value = "";
      }
    }
    function renderRes({ item }) {
      return h("a-list-item", {}, [h("a", { href: item.url, target: "_blank" }, item.name)]);
    }
    const userId = ref("");
    const allowed = ref(null);
    async function checkTeacher() {
      if (!userId.value) {
        allowed.value = null;
        return;
      }
      const q = "query($userId:String!,$institutionId:String!,$role:String!){ hasRole(userId:$userId,institutionId:$institutionId,role:$role) }";
      const r = await $fetch(`${baseUrl}/api/authentication/graphql`, { method: "POST", body: { query: q, variables: { userId: userId.value, institutionId: String(route.params.id), role: "Teacher" } } });
      allowed.value = !!r?.data?.hasRole;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_alert = resolveComponent("a-alert");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_list = resolveComponent("a-list");
      _push(ssrRenderComponent(_component_a_layout, mergeProps({ class: "p-6" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_card, {
              title: `Module Admin · ${module.value?.title || unref(route).params.id}`,
              bordered: false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="mb-4 flex flex-wrap gap-2 items-center"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_a_input, {
                    value: userId.value,
                    "onUpdate:value": ($event) => userId.value = $event,
                    placeholder: "Your userId (for roles)",
                    style: { "max-width": "260px" }
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_button, { onClick: checkTeacher }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Check Teacher Access`);
                      } else {
                        return [
                          createTextVNode("Check Teacher Access")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_button, {
                    type: "primary",
                    onClick: saveOrder,
                    disabled: !dirty.value
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Save Order`);
                      } else {
                        return [
                          createTextVNode("Save Order")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  if (allowed.value === false) {
                    _push3(ssrRenderComponent(_component_a_alert, {
                      type: "warning",
                      message: "Access denied: Teacher/Admin role required",
                      "show-icon": "",
                      class: "mb-3"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div class="grid md:grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_a_card, {
                    title: "Lessons (drag to reorder)",
                    size: "small"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<ul${_scopeId3}><!--[-->`);
                        ssrRenderList(lessons.value, (l, idx) => {
                          _push4(`<li draggable="true" class="p-2 border rounded mb-2 bg-white"${_scopeId3}><div class="flex items-center justify-between"${_scopeId3}><span${_scopeId3}>#${ssrInterpolate(idx + 1)} · ${ssrInterpolate(l.title)}</span>`);
                          _push4(ssrRenderComponent(_component_a_tag, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(l.position ?? idx)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(l.position ?? idx), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(`</div></li>`);
                        });
                        _push4(`<!--]--></ul>`);
                      } else {
                        return [
                          createVNode("ul", null, [
                            (openBlock(true), createBlock(Fragment, null, renderList(lessons.value, (l, idx) => {
                              return openBlock(), createBlock("li", {
                                key: l.id,
                                draggable: "true",
                                onDragstart: ($event) => dragStart(idx),
                                onDragover: withModifiers(() => {
                                }, ["prevent"]),
                                onDrop: ($event) => drop(idx),
                                class: "p-2 border rounded mb-2 bg-white"
                              }, [
                                createVNode("div", { class: "flex items-center justify-between" }, [
                                  createVNode("span", null, "#" + toDisplayString(idx + 1) + " · " + toDisplayString(l.title), 1),
                                  createVNode(_component_a_tag, null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(l.position ?? idx), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ])
                              ], 40, ["onDragstart", "onDragover", "onDrop"]);
                            }), 128))
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_card, {
                    title: "Resources",
                    size: "small"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex gap-2 mb-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: rName.value,
                          "onUpdate:value": ($event) => rName.value = $event,
                          placeholder: "Name",
                          style: { "max-width": "200px" }
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: rUrl.value,
                          "onUpdate:value": ($event) => rUrl.value = $event,
                          placeholder: "URL",
                          style: { "min-width": "260px" }
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_button, { onClick: addResource }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Add`);
                            } else {
                              return [
                                createTextVNode("Add")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                        _push4(ssrRenderComponent(_component_a_list, {
                          "data-source": resources.value,
                          renderItem: renderRes
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode("div", { class: "flex gap-2 mb-2" }, [
                            createVNode(_component_a_input, {
                              value: rName.value,
                              "onUpdate:value": ($event) => rName.value = $event,
                              placeholder: "Name",
                              style: { "max-width": "200px" }
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_input, {
                              value: rUrl.value,
                              "onUpdate:value": ($event) => rUrl.value = $event,
                              placeholder: "URL",
                              style: { "min-width": "260px" }
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_button, { onClick: addResource }, {
                              default: withCtx(() => [
                                createTextVNode("Add")
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode(_component_a_list, {
                            "data-source": resources.value,
                            renderItem: renderRes
                          }, null, 8, ["data-source"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "mb-4 flex flex-wrap gap-2 items-center" }, [
                      createVNode(_component_a_input, {
                        value: userId.value,
                        "onUpdate:value": ($event) => userId.value = $event,
                        placeholder: "Your userId (for roles)",
                        style: { "max-width": "260px" }
                      }, null, 8, ["value", "onUpdate:value"]),
                      createVNode(_component_a_button, { onClick: checkTeacher }, {
                        default: withCtx(() => [
                          createTextVNode("Check Teacher Access")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_button, {
                        type: "primary",
                        onClick: saveOrder,
                        disabled: !dirty.value
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Save Order")
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ]),
                    allowed.value === false ? (openBlock(), createBlock(_component_a_alert, {
                      key: 0,
                      type: "warning",
                      message: "Access denied: Teacher/Admin role required",
                      "show-icon": "",
                      class: "mb-3"
                    })) : createCommentVNode("", true),
                    createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                      createVNode(_component_a_card, {
                        title: "Lessons (drag to reorder)",
                        size: "small"
                      }, {
                        default: withCtx(() => [
                          createVNode("ul", null, [
                            (openBlock(true), createBlock(Fragment, null, renderList(lessons.value, (l, idx) => {
                              return openBlock(), createBlock("li", {
                                key: l.id,
                                draggable: "true",
                                onDragstart: ($event) => dragStart(idx),
                                onDragover: withModifiers(() => {
                                }, ["prevent"]),
                                onDrop: ($event) => drop(idx),
                                class: "p-2 border rounded mb-2 bg-white"
                              }, [
                                createVNode("div", { class: "flex items-center justify-between" }, [
                                  createVNode("span", null, "#" + toDisplayString(idx + 1) + " · " + toDisplayString(l.title), 1),
                                  createVNode(_component_a_tag, null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(l.position ?? idx), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ])
                              ], 40, ["onDragstart", "onDragover", "onDrop"]);
                            }), 128))
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_card, {
                        title: "Resources",
                        size: "small"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex gap-2 mb-2" }, [
                            createVNode(_component_a_input, {
                              value: rName.value,
                              "onUpdate:value": ($event) => rName.value = $event,
                              placeholder: "Name",
                              style: { "max-width": "200px" }
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_input, {
                              value: rUrl.value,
                              "onUpdate:value": ($event) => rUrl.value = $event,
                              placeholder: "URL",
                              style: { "min-width": "260px" }
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_button, { onClick: addResource }, {
                              default: withCtx(() => [
                                createTextVNode("Add")
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode(_component_a_list, {
                            "data-source": resources.value,
                            renderItem: renderRes
                          }, null, 8, ["data-source"])
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_card, {
                title: `Module Admin · ${module.value?.title || unref(route).params.id}`,
                bordered: false
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "mb-4 flex flex-wrap gap-2 items-center" }, [
                    createVNode(_component_a_input, {
                      value: userId.value,
                      "onUpdate:value": ($event) => userId.value = $event,
                      placeholder: "Your userId (for roles)",
                      style: { "max-width": "260px" }
                    }, null, 8, ["value", "onUpdate:value"]),
                    createVNode(_component_a_button, { onClick: checkTeacher }, {
                      default: withCtx(() => [
                        createTextVNode("Check Teacher Access")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_button, {
                      type: "primary",
                      onClick: saveOrder,
                      disabled: !dirty.value
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Save Order")
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ]),
                  allowed.value === false ? (openBlock(), createBlock(_component_a_alert, {
                    key: 0,
                    type: "warning",
                    message: "Access denied: Teacher/Admin role required",
                    "show-icon": "",
                    class: "mb-3"
                  })) : createCommentVNode("", true),
                  createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                    createVNode(_component_a_card, {
                      title: "Lessons (drag to reorder)",
                      size: "small"
                    }, {
                      default: withCtx(() => [
                        createVNode("ul", null, [
                          (openBlock(true), createBlock(Fragment, null, renderList(lessons.value, (l, idx) => {
                            return openBlock(), createBlock("li", {
                              key: l.id,
                              draggable: "true",
                              onDragstart: ($event) => dragStart(idx),
                              onDragover: withModifiers(() => {
                              }, ["prevent"]),
                              onDrop: ($event) => drop(idx),
                              class: "p-2 border rounded mb-2 bg-white"
                            }, [
                              createVNode("div", { class: "flex items-center justify-between" }, [
                                createVNode("span", null, "#" + toDisplayString(idx + 1) + " · " + toDisplayString(l.title), 1),
                                createVNode(_component_a_tag, null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(l.position ?? idx), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ])
                            ], 40, ["onDragstart", "onDragover", "onDrop"]);
                          }), 128))
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_card, {
                      title: "Resources",
                      size: "small"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "flex gap-2 mb-2" }, [
                          createVNode(_component_a_input, {
                            value: rName.value,
                            "onUpdate:value": ($event) => rName.value = $event,
                            placeholder: "Name",
                            style: { "max-width": "200px" }
                          }, null, 8, ["value", "onUpdate:value"]),
                          createVNode(_component_a_input, {
                            value: rUrl.value,
                            "onUpdate:value": ($event) => rUrl.value = $event,
                            placeholder: "URL",
                            style: { "min-width": "260px" }
                          }, null, 8, ["value", "onUpdate:value"]),
                          createVNode(_component_a_button, { onClick: addResource }, {
                            default: withCtx(() => [
                              createTextVNode("Add")
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode(_component_a_list, {
                          "data-source": resources.value,
                          renderItem: renderRes
                        }, null, 8, ["data-source"])
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 1
              }, 8, ["title"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/teach-internal/nuxt/pages/modules/[id]/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-Df11gRLg.mjs.map
