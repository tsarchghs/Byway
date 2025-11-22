import { defineComponent, computed, resolveComponent, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useRouter } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StudentsNav",
  __ssrInlineRender: true,
  props: {
    subtitle: {},
    role: {}
  },
  setup(__props) {
    const props = __props;
    const subtitle = computed(() => props.subtitle || "Dashboard");
    const roleLabel = computed(() => props.role || "student");
    const router = useRouter();
    function onBack() {
      try {
        router.back();
      } catch {
        router.push("/students");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_button = resolveComponent("a-button");
      _push(ssrRenderComponent(_component_a_page_header, mergeProps({
        title: "Student",
        "sub-title": unref(subtitle),
        class: "mb-4",
        onBack
      }, _attrs), {
        tags: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_tag, { color: "blue" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(roleLabel))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(roleLabel)), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_tag, { color: "blue" }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(roleLabel)), 1)
                ]),
                _: 1
              })
            ];
          }
        }),
        extra: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_space, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_button, {
                    onClick: ($event) => _ctx.$router.push("/students")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Explore`);
                      } else {
                        return [
                          createTextVNode("Explore")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_button, {
                    onClick: ($event) => _ctx.$router.push("/students/enrollments")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Enrollments`);
                      } else {
                        return [
                          createTextVNode("Enrollments")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_button, {
                    onClick: ($event) => _ctx.$router.push("/students/gradebook")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Gradebook`);
                      } else {
                        return [
                          createTextVNode("Gradebook")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_button, {
                    onClick: ($event) => _ctx.$router.push("/institutions")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Institutions`);
                      } else {
                        return [
                          createTextVNode("Institutions")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_button, {
                    onClick: ($event) => _ctx.$router.push("/teach/gradebook")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Teacher GB`);
                      } else {
                        return [
                          createTextVNode("Teacher GB")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_button, {
                      onClick: ($event) => _ctx.$router.push("/students")
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Explore")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_component_a_button, {
                      onClick: ($event) => _ctx.$router.push("/students/enrollments")
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Enrollments")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_component_a_button, {
                      onClick: ($event) => _ctx.$router.push("/students/gradebook")
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Gradebook")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_component_a_button, {
                      onClick: ($event) => _ctx.$router.push("/institutions")
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Institutions")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_component_a_button, {
                      onClick: ($event) => _ctx.$router.push("/teach/gradebook")
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Teacher GB")
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_space, null, {
                default: withCtx(() => [
                  createVNode(_component_a_button, {
                    onClick: ($event) => _ctx.$router.push("/students")
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Explore")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_a_button, {
                    onClick: ($event) => _ctx.$router.push("/students/enrollments")
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Enrollments")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_a_button, {
                    onClick: ($event) => _ctx.$router.push("/students/gradebook")
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Gradebook")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_a_button, {
                    onClick: ($event) => _ctx.$router.push("/institutions")
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Institutions")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_a_button, {
                    onClick: ($event) => _ctx.$router.push("/teach/gradebook")
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Teacher GB")
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/students-internal/nuxt/components/StudentsNav.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=StudentsNav-xlfyhLgm.mjs.map
