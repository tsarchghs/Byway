import { defineComponent, reactive, resolveComponent, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { message } from 'ant-design-vue';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "challenges",
  __ssrInlineRender: true,
  setup(__props) {
    const form = reactive({
      title: "",
      slug: "",
      description: "",
      difficulty: "Beginner",
      starterRepoUrl: "",
      testsRepoUrl: "",
      runtime: "node18",
      visibility: "private",
      courseId: "",
      moduleId: "",
      lessonId: ""
    });
    async function submit() {
      try {
        const res = await fetch("http://localhost:4000/api/teacher-course-lab/challenges", {
          method: "POST",
          headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWh5dmN4cjgwMDAwdHcwa3JyODR5eHk4IiwiaWF0IjoxNzYzMTI1NTc1LCJleHAiOjE3NjM3MzAzNzV9.Q7ZrBeM8oZlFUQLKp5YtJsObOQ9AeChhXV3ZXc6797U", "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
        if (!res.ok) throw new Error(await res.text());
        message.success("Challenge created");
      } catch (e) {
        message.error(e?.message || "Failed to create challenge");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_form = resolveComponent("a-form");
      const _component_a_form_item = resolveComponent("a-form-item");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_textarea = resolveComponent("a-textarea");
      const _component_a_select = resolveComponent("a-select");
      const _component_a_select_option = resolveComponent("a-select-option");
      const _component_a_divider = resolveComponent("a-divider");
      const _component_a_button = resolveComponent("a-button");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_a_page_header, {
        title: "New Challenge",
        "sub-title": "Create a lab challenge"
      }, null, _parent));
      _push(ssrRenderComponent(_component_a_card, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_form, {
              layout: "vertical",
              onFinish: submit
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Title" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: form.title,
                          "onUpdate:value": ($event) => form.title = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: form.title,
                            "onUpdate:value": ($event) => form.title = $event
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
                          value: form.slug,
                          "onUpdate:value": ($event) => form.slug = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: form.slug,
                            "onUpdate:value": ($event) => form.slug = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Description" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_textarea, {
                          value: form.description,
                          "onUpdate:value": ($event) => form.description = $event,
                          rows: 4
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_textarea, {
                            value: form.description,
                            "onUpdate:value": ($event) => form.description = $event,
                            rows: 4
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Difficulty" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_select, {
                          value: form.difficulty,
                          "onUpdate:value": ($event) => form.difficulty = $event
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_select_option, { value: "Beginner" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Beginner`);
                                  } else {
                                    return [
                                      createTextVNode("Beginner")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_select_option, { value: "Intermediate" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Intermediate`);
                                  } else {
                                    return [
                                      createTextVNode("Intermediate")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_select_option, { value: "Advanced" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Advanced`);
                                  } else {
                                    return [
                                      createTextVNode("Advanced")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_select_option, { value: "Beginner" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Beginner")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_select_option, { value: "Intermediate" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Intermediate")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_select_option, { value: "Advanced" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Advanced")
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
                            value: form.difficulty,
                            "onUpdate:value": ($event) => form.difficulty = $event
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_select_option, { value: "Beginner" }, {
                                default: withCtx(() => [
                                  createTextVNode("Beginner")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_select_option, { value: "Intermediate" }, {
                                default: withCtx(() => [
                                  createTextVNode("Intermediate")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_select_option, { value: "Advanced" }, {
                                default: withCtx(() => [
                                  createTextVNode("Advanced")
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
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Starter Repo URL" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: form.starterRepoUrl,
                          "onUpdate:value": ($event) => form.starterRepoUrl = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: form.starterRepoUrl,
                            "onUpdate:value": ($event) => form.starterRepoUrl = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Tests Repo URL" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: form.testsRepoUrl,
                          "onUpdate:value": ($event) => form.testsRepoUrl = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: form.testsRepoUrl,
                            "onUpdate:value": ($event) => form.testsRepoUrl = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Runtime" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: form.runtime,
                          "onUpdate:value": ($event) => form.runtime = $event,
                          placeholder: "e.g., node18, python3.11"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: form.runtime,
                            "onUpdate:value": ($event) => form.runtime = $event,
                            placeholder: "e.g., node18, python3.11"
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Visibility" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_select, {
                          value: form.visibility,
                          "onUpdate:value": ($event) => form.visibility = $event
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_select_option, { value: "private" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`private`);
                                  } else {
                                    return [
                                      createTextVNode("private")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_select_option, { value: "course" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`course`);
                                  } else {
                                    return [
                                      createTextVNode("course")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_select_option, { value: "public" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`public`);
                                  } else {
                                    return [
                                      createTextVNode("public")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_select_option, { value: "private" }, {
                                  default: withCtx(() => [
                                    createTextVNode("private")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_select_option, { value: "course" }, {
                                  default: withCtx(() => [
                                    createTextVNode("course")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_select_option, { value: "public" }, {
                                  default: withCtx(() => [
                                    createTextVNode("public")
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
                            value: form.visibility,
                            "onUpdate:value": ($event) => form.visibility = $event
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_select_option, { value: "private" }, {
                                default: withCtx(() => [
                                  createTextVNode("private")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_select_option, { value: "course" }, {
                                default: withCtx(() => [
                                  createTextVNode("course")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_select_option, { value: "public" }, {
                                default: withCtx(() => [
                                  createTextVNode("public")
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
                  _push3(ssrRenderComponent(_component_a_divider, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Course bindings (optional)`);
                      } else {
                        return [
                          createTextVNode("Course bindings (optional)")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Course ID" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: form.courseId,
                          "onUpdate:value": ($event) => form.courseId = $event,
                          placeholder: "Course ID from courses plugin"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: form.courseId,
                            "onUpdate:value": ($event) => form.courseId = $event,
                            placeholder: "Course ID from courses plugin"
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Module ID" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: form.moduleId,
                          "onUpdate:value": ($event) => form.moduleId = $event,
                          placeholder: "Module ID from modules plugin"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: form.moduleId,
                            "onUpdate:value": ($event) => form.moduleId = $event,
                            placeholder: "Module ID from modules plugin"
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, { label: "Lesson ID" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: form.lessonId,
                          "onUpdate:value": ($event) => form.lessonId = $event,
                          placeholder: "Lesson ID from lessons plugin"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: form.lessonId,
                            "onUpdate:value": ($event) => form.lessonId = $event,
                            placeholder: "Lesson ID from lessons plugin"
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_button, {
                          type: "primary",
                          "html-type": "submit"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Create`);
                            } else {
                              return [
                                createTextVNode("Create")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_button, {
                            type: "primary",
                            "html-type": "submit"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Create")
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
                    createVNode(_component_a_form_item, { label: "Title" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: form.title,
                          "onUpdate:value": ($event) => form.title = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Slug" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: form.slug,
                          "onUpdate:value": ($event) => form.slug = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Description" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_textarea, {
                          value: form.description,
                          "onUpdate:value": ($event) => form.description = $event,
                          rows: 4
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Difficulty" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_select, {
                          value: form.difficulty,
                          "onUpdate:value": ($event) => form.difficulty = $event
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_select_option, { value: "Beginner" }, {
                              default: withCtx(() => [
                                createTextVNode("Beginner")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_select_option, { value: "Intermediate" }, {
                              default: withCtx(() => [
                                createTextVNode("Intermediate")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_select_option, { value: "Advanced" }, {
                              default: withCtx(() => [
                                createTextVNode("Advanced")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Starter Repo URL" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: form.starterRepoUrl,
                          "onUpdate:value": ($event) => form.starterRepoUrl = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Tests Repo URL" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: form.testsRepoUrl,
                          "onUpdate:value": ($event) => form.testsRepoUrl = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Runtime" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: form.runtime,
                          "onUpdate:value": ($event) => form.runtime = $event,
                          placeholder: "e.g., node18, python3.11"
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Visibility" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_select, {
                          value: form.visibility,
                          "onUpdate:value": ($event) => form.visibility = $event
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_select_option, { value: "private" }, {
                              default: withCtx(() => [
                                createTextVNode("private")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_select_option, { value: "course" }, {
                              default: withCtx(() => [
                                createTextVNode("course")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_select_option, { value: "public" }, {
                              default: withCtx(() => [
                                createTextVNode("public")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_divider, null, {
                      default: withCtx(() => [
                        createTextVNode("Course bindings (optional)")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Course ID" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: form.courseId,
                          "onUpdate:value": ($event) => form.courseId = $event,
                          placeholder: "Course ID from courses plugin"
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Module ID" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: form.moduleId,
                          "onUpdate:value": ($event) => form.moduleId = $event,
                          placeholder: "Module ID from modules plugin"
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Lesson ID" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: form.lessonId,
                          "onUpdate:value": ($event) => form.lessonId = $event,
                          placeholder: "Lesson ID from lessons plugin"
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, null, {
                      default: withCtx(() => [
                        createVNode(_component_a_button, {
                          type: "primary",
                          "html-type": "submit"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Create")
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
              createVNode(_component_a_form, {
                layout: "vertical",
                onFinish: submit
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_form_item, { label: "Title" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: form.title,
                        "onUpdate:value": ($event) => form.title = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Slug" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: form.slug,
                        "onUpdate:value": ($event) => form.slug = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Description" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_textarea, {
                        value: form.description,
                        "onUpdate:value": ($event) => form.description = $event,
                        rows: 4
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Difficulty" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_select, {
                        value: form.difficulty,
                        "onUpdate:value": ($event) => form.difficulty = $event
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_select_option, { value: "Beginner" }, {
                            default: withCtx(() => [
                              createTextVNode("Beginner")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "Intermediate" }, {
                            default: withCtx(() => [
                              createTextVNode("Intermediate")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "Advanced" }, {
                            default: withCtx(() => [
                              createTextVNode("Advanced")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Starter Repo URL" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: form.starterRepoUrl,
                        "onUpdate:value": ($event) => form.starterRepoUrl = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Tests Repo URL" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: form.testsRepoUrl,
                        "onUpdate:value": ($event) => form.testsRepoUrl = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Runtime" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: form.runtime,
                        "onUpdate:value": ($event) => form.runtime = $event,
                        placeholder: "e.g., node18, python3.11"
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Visibility" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_select, {
                        value: form.visibility,
                        "onUpdate:value": ($event) => form.visibility = $event
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_select_option, { value: "private" }, {
                            default: withCtx(() => [
                              createTextVNode("private")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "course" }, {
                            default: withCtx(() => [
                              createTextVNode("course")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "public" }, {
                            default: withCtx(() => [
                              createTextVNode("public")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_divider, null, {
                    default: withCtx(() => [
                      createTextVNode("Course bindings (optional)")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Course ID" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: form.courseId,
                        "onUpdate:value": ($event) => form.courseId = $event,
                        placeholder: "Course ID from courses plugin"
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Module ID" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: form.moduleId,
                        "onUpdate:value": ($event) => form.moduleId = $event,
                        placeholder: "Module ID from modules plugin"
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, { label: "Lesson ID" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: form.lessonId,
                        "onUpdate:value": ($event) => form.lessonId = $event,
                        placeholder: "Lesson ID from lessons plugin"
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, null, {
                    default: withCtx(() => [
                      createVNode(_component_a_button, {
                        type: "primary",
                        "html-type": "submit"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Create")
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
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/teacher-course-lab/pages/teacher-course-lab/challenges.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=challenges-DMpLGVMg.mjs.map
