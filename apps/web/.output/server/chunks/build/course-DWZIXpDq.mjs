import { defineComponent, reactive, computed, ref, watch, resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, createBlock, createVNode, openBlock, h, unref, createCommentVNode, Fragment, renderList, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { H as Header } from './Header-DscPRdFw.mjs';
import { PlayCircleOutlined, EditOutlined, VideoCameraOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import { _ as _export_sfc } from './server.mjs';
import './nuxt-link-DQJ00LSY.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-router';
import './useAuth-B8D9e8en.mjs';
import './useCart-7pxN526Z.mjs';
import 'ant-design-vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import '@apollo/client/core/index.js';
import '@apollo/client/link/context/index.js';
import '@vue/apollo-composable';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "course",
  __ssrInlineRender: true,
  setup(__props) {
    const course2 = reactive({
      title: "Introduction to User Experience Design",
      description: "Embark on a transformative journey into UX Design with a hands-on, project-first path.",
      instructor: {
        name: "Ronald Richards",
        role: "UI/UX Designer",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=320&auto=format&fit=crop",
        reviews: "40,445",
        students: "500"
      },
      objectives: [
        "Understand the role and impact of UX Design",
        "Explore user-centered design principles",
        "Practice IA, interaction, and visual design basics"
      ]
    });
    const sectionsState = reactive({
      top: {
        title: "Introduction to UX Design",
        open: true,
        lessons: [
          {
            id: "t1",
            num: "1.",
            title: "What is UX Design?",
            duration: "4min",
            done: true,
            videoId: "ysz5S6PUM-U",
            content: "<p>An introduction to UX design: what it is and why it matters.</p>"
          },
          {
            id: "t2",
            num: "2.",
            title: "Historical Overview of UX",
            duration: "4min",
            done: true,
            videoId: "M7lc1UVf-VE",
            content: "<p>A short history of how UX evolved over time.</p>"
          },
          {
            id: "t3",
            num: "3.",
            title: "Understanding User-Centered Design",
            duration: "4min",
            active: true,
            videoId: "J---aiyznGQ",
            content: "<p>User-centered design places the user at the heart of the process.</p>"
          }
        ]
      },
      mid: {
        title: "Basics of User-Centered Design",
        open: false,
        lessons: [
          {
            id: "m1",
            num: "1.",
            title: "User Research",
            duration: "12min",
            videoId: "dQw4w9WgXcQ",
            content: "<p>Methods for conducting effective user research.</p>"
          },
          {
            id: "m2",
            num: "2.",
            title: "Personas & Journeys",
            duration: "18min",
            videoId: "oHg5SJYRHA0",
            content: "<p>How to craft personas and customer journeys.</p>"
          }
        ]
      },
      mid2: {
        title: "Elements of User Experience",
        open: false,
        lessons: [
          {
            id: "e1",
            num: "1.",
            title: "Information Architecture",
            duration: "9min",
            videoId: "ysz5S6PUM-U",
            content: "<p>Organizing content to help users find their way.</p>"
          },
          {
            id: "e2",
            num: "2.",
            title: "Interaction Design Basics",
            duration: "14min",
            videoId: "M7lc1UVf-VE",
            content: "<p>Core interaction patterns and principles.</p>"
          }
        ]
      }
    });
    const sectionsEntries = computed(() => Object.entries(sectionsState));
    const allLessons = computed(() => Object.values(sectionsState).flatMap((s) => s.lessons));
    const completedCount = computed(() => allLessons.value.filter((l) => l.done).length);
    const totalCount = computed(() => allLessons.value.length);
    const completionPct = computed(() => totalCount.value ? Math.round(completedCount.value / totalCount.value * 100) : 0);
    const currentLesson = computed(() => allLessons.value.find((l) => l.active) || null);
    const activeTab = ref("details");
    const openPanels = ref(
      sectionsEntries.value.filter(([_, s]) => s.open).map(([k]) => k)
    );
    watch(
      openPanels,
      (keys) => {
        for (const [k, sec] of sectionsEntries.value) sec.open = keys.includes(k);
      },
      { deep: true }
    );
    const openNotes = ref(false);
    const notes = reactive({});
    function setActive(sectionKey, idx) {
      allLessons.value.forEach((l2) => l2.active = false);
      const sec = sectionsState[sectionKey];
      if (!sec) return;
      sec.open = true;
      if (!openPanels.value.includes(sectionKey)) openPanels.value.push(sectionKey);
      const l = sec.lessons[idx];
      if (l) l.active = true;
    }
    function markAllDone() {
      for (const sec of Object.values(sectionsState)) {
        for (const l of sec.lessons) l.done = true;
      }
    }
    function playPreview() {
      const withVideo = allLessons.value.find((l) => l.videoId);
      if (withVideo) {
        for (const [sk, sec] of Object.entries(sectionsState)) {
          const idx = sec.lessons.findIndex((x) => x.id === withVideo.id);
          if (idx >= 0) return setActive(sk, idx);
        }
      }
      const firstSection = Object.entries(sectionsState)[0];
      if (firstSection && firstSection[1].lessons.length) setActive(firstSection[0], 0);
    }
    function goToNextIncomplete() {
      const next = allLessons.value.find((l) => !l.done);
      if (!next) return;
      for (const [sk, sec] of Object.entries(sectionsState)) {
        const idx = sec.lessons.findIndex((x) => x.id === next.id);
        if (idx >= 0) return setActive(sk, idx);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_empty = resolveComponent("a-empty");
      const _component_a_typography_paragraph = resolveComponent("a-typography-paragraph");
      const _component_a_tabs = resolveComponent("a-tabs");
      const _component_a_tab_pane = resolveComponent("a-tab-pane");
      const _component_a_list = resolveComponent("a-list");
      const _component_a_avatar = resolveComponent("a-avatar");
      const _component_a_typography_text = resolveComponent("a-typography-text");
      const _component_a_affix = resolveComponent("a-affix");
      const _component_a_progress = resolveComponent("a-progress");
      const _component_a_popconfirm = resolveComponent("a-popconfirm");
      const _component_a_divider = resolveComponent("a-divider");
      const _component_a_collapse = resolveComponent("a-collapse");
      const _component_a_collapse_panel = resolveComponent("a-collapse-panel");
      const _component_a_checkbox = resolveComponent("a-checkbox");
      const _component_a_float_button_group = resolveComponent("a-float-button-group");
      const _component_a_float_button = resolveComponent("a-float-button");
      const _component_a_drawer = resolveComponent("a-drawer");
      const _component_a_textarea = resolveComponent("a-textarea");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "course-page" }, _attrs))} data-v-05a6edc3>`);
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(`<main class="cp-main" data-v-05a6edc3><section class="left-col" data-v-05a6edc3>`);
      _push(ssrRenderComponent(_component_a_typography_title, {
        level: 2,
        style: { "margin-bottom": "12px" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(course2.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(course2.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_card, {
        class: "lesson-viewer",
        title: currentLesson.value ? `${currentLesson.value.num} ${currentLesson.value.title}` : "Select a lesson to begin"
      }, {
        extra: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_space, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (currentLesson.value?.videoId) {
                    _push3(ssrRenderComponent(_component_a_button, {
                      type: "text",
                      onClick: playPreview,
                      icon: h(unref(PlayCircleOutlined))
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` Preview `);
                        } else {
                          return [
                            createTextVNode(" Preview ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(_component_a_button, {
                    type: "text",
                    onClick: ($event) => openNotes.value = true,
                    icon: h(unref(EditOutlined))
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Notes`);
                      } else {
                        return [
                          createTextVNode("Notes")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    currentLesson.value?.videoId ? (openBlock(), createBlock(_component_a_button, {
                      key: 0,
                      type: "text",
                      onClick: playPreview,
                      icon: h(unref(PlayCircleOutlined))
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Preview ")
                      ]),
                      _: 1
                    }, 8, ["icon"])) : createCommentVNode("", true),
                    createVNode(_component_a_button, {
                      type: "text",
                      onClick: ($event) => openNotes.value = true,
                      icon: h(unref(EditOutlined))
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Notes")
                      ]),
                      _: 1
                    }, 8, ["onClick", "icon"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_space, null, {
                default: withCtx(() => [
                  currentLesson.value?.videoId ? (openBlock(), createBlock(_component_a_button, {
                    key: 0,
                    type: "text",
                    onClick: playPreview,
                    icon: h(unref(PlayCircleOutlined))
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Preview ")
                    ]),
                    _: 1
                  }, 8, ["icon"])) : createCommentVNode("", true),
                  createVNode(_component_a_button, {
                    type: "text",
                    onClick: ($event) => openNotes.value = true,
                    icon: h(unref(EditOutlined))
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Notes")
                    ]),
                    _: 1
                  }, 8, ["onClick", "icon"])
                ]),
                _: 1
              })
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (currentLesson.value?.videoId) {
              _push2(`<div class="video-wrapper" data-v-05a6edc3${_scopeId}><iframe${ssrRenderAttr("src", `https://www.youtube.com/embed/${currentLesson.value.videoId}?rel=0&showinfo=0`)} frameborder="0" allowfullscreen title="Lesson video" data-v-05a6edc3${_scopeId}></iframe></div>`);
            } else {
              _push2(ssrRenderComponent(_component_a_empty, { description: "Pick a lesson from the right to start" }, null, _parent2, _scopeId));
            }
            _push2(ssrRenderComponent(_component_a_typography_paragraph, null, null, _parent2, _scopeId));
          } else {
            return [
              currentLesson.value?.videoId ? (openBlock(), createBlock("div", {
                key: 0,
                class: "video-wrapper"
              }, [
                createVNode("iframe", {
                  src: `https://www.youtube.com/embed/${currentLesson.value.videoId}?rel=0&showinfo=0`,
                  frameborder: "0",
                  allowfullscreen: "",
                  title: "Lesson video"
                }, null, 8, ["src"])
              ])) : (openBlock(), createBlock(_component_a_empty, {
                key: 1,
                description: "Pick a lesson from the right to start"
              })),
              createVNode(_component_a_typography_paragraph, {
                innerHTML: currentLesson.value?.content || "<p>No content available for this lesson.</p>"
              }, null, 8, ["innerHTML"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_tabs, {
        activeKey: activeTab.value,
        "onUpdate:activeKey": ($event) => activeTab.value = $event,
        style: { "margin-top": "16px" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_tab_pane, {
              key: "details",
              tab: "Details"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_typography_title, { level: 4 }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Course Overview`);
                      } else {
                        return [
                          createTextVNode("Course Overview")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_typography_paragraph, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(course2.description)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(course2.description), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_typography_title, { level: 5 }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Key Learning Objectives`);
                      } else {
                        return [
                          createTextVNode("Key Learning Objectives")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_list, {
                    size: "small",
                    "data-source": course2.objectives,
                    renderItem: (o) => h("div", { class: "objective-item" }, [h("span", o)])
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_typography_title, { level: 4 }, {
                      default: withCtx(() => [
                        createTextVNode("Course Overview")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_typography_paragraph, null, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(course2.description), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_typography_title, { level: 5 }, {
                      default: withCtx(() => [
                        createTextVNode("Key Learning Objectives")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_list, {
                      size: "small",
                      "data-source": course2.objectives,
                      renderItem: (o) => h("div", { class: "objective-item" }, [h("span", o)])
                    }, null, 8, ["data-source", "renderItem"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_tab_pane, {
              key: "instructor",
              tab: "Instructor"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_card, { bordered: "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_space, { align: "start" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_avatar, {
                                size: 64,
                                src: course2.instructor.avatar
                              }, null, _parent5, _scopeId4));
                              _push5(`<div data-v-05a6edc3${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_typography_text, { strong: "" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(course2.instructor.name)}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(course2.instructor.name), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`<div class="muted" data-v-05a6edc3${_scopeId4}>${ssrInterpolate(course2.instructor.role)}</div>`);
                              _push5(ssrRenderComponent(_component_a_space, {
                                size: "small",
                                class: "muted",
                                style: { "margin-top": "6px" }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<span data-v-05a6edc3${_scopeId5}>${ssrInterpolate(course2.instructor.reviews)} Reviews</span><span data-v-05a6edc3${_scopeId5}>•</span><span data-v-05a6edc3${_scopeId5}>${ssrInterpolate(course2.instructor.students)} Students</span>`);
                                  } else {
                                    return [
                                      createVNode("span", null, toDisplayString(course2.instructor.reviews) + " Reviews", 1),
                                      createVNode("span", null, "•"),
                                      createVNode("span", null, toDisplayString(course2.instructor.students) + " Students", 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                            } else {
                              return [
                                createVNode(_component_a_avatar, {
                                  size: 64,
                                  src: course2.instructor.avatar
                                }, null, 8, ["src"]),
                                createVNode("div", null, [
                                  createVNode(_component_a_typography_text, { strong: "" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(course2.instructor.name), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("div", { class: "muted" }, toDisplayString(course2.instructor.role), 1),
                                  createVNode(_component_a_space, {
                                    size: "small",
                                    class: "muted",
                                    style: { "margin-top": "6px" }
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("span", null, toDisplayString(course2.instructor.reviews) + " Reviews", 1),
                                      createVNode("span", null, "•"),
                                      createVNode("span", null, toDisplayString(course2.instructor.students) + " Students", 1)
                                    ]),
                                    _: 1
                                  })
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_space, { align: "start" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_avatar, {
                                size: 64,
                                src: course2.instructor.avatar
                              }, null, 8, ["src"]),
                              createVNode("div", null, [
                                createVNode(_component_a_typography_text, { strong: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(course2.instructor.name), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode("div", { class: "muted" }, toDisplayString(course2.instructor.role), 1),
                                createVNode(_component_a_space, {
                                  size: "small",
                                  class: "muted",
                                  style: { "margin-top": "6px" }
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", null, toDisplayString(course2.instructor.reviews) + " Reviews", 1),
                                    createVNode("span", null, "•"),
                                    createVNode("span", null, toDisplayString(course2.instructor.students) + " Students", 1)
                                  ]),
                                  _: 1
                                })
                              ])
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
                    createVNode(_component_a_card, { bordered: "" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_space, { align: "start" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_avatar, {
                              size: 64,
                              src: course2.instructor.avatar
                            }, null, 8, ["src"]),
                            createVNode("div", null, [
                              createVNode(_component_a_typography_text, { strong: "" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(course2.instructor.name), 1)
                                ]),
                                _: 1
                              }),
                              createVNode("div", { class: "muted" }, toDisplayString(course2.instructor.role), 1),
                              createVNode(_component_a_space, {
                                size: "small",
                                class: "muted",
                                style: { "margin-top": "6px" }
                              }, {
                                default: withCtx(() => [
                                  createVNode("span", null, toDisplayString(course2.instructor.reviews) + " Reviews", 1),
                                  createVNode("span", null, "•"),
                                  createVNode("span", null, toDisplayString(course2.instructor.students) + " Students", 1)
                                ]),
                                _: 1
                              })
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
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_tab_pane, {
              key: "reviews",
              tab: "Reviews"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_empty, { description: "Reviews coming soon" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_empty, { description: "Reviews coming soon" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_tab_pane, {
                key: "details",
                tab: "Details"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_typography_title, { level: 4 }, {
                    default: withCtx(() => [
                      createTextVNode("Course Overview")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_typography_paragraph, null, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(course2.description), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_typography_title, { level: 5 }, {
                    default: withCtx(() => [
                      createTextVNode("Key Learning Objectives")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_list, {
                    size: "small",
                    "data-source": course2.objectives,
                    renderItem: (o) => h("div", { class: "objective-item" }, [h("span", o)])
                  }, null, 8, ["data-source", "renderItem"])
                ]),
                _: 1
              }),
              createVNode(_component_a_tab_pane, {
                key: "instructor",
                tab: "Instructor"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_card, { bordered: "" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_space, { align: "start" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_avatar, {
                            size: 64,
                            src: course2.instructor.avatar
                          }, null, 8, ["src"]),
                          createVNode("div", null, [
                            createVNode(_component_a_typography_text, { strong: "" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(course2.instructor.name), 1)
                              ]),
                              _: 1
                            }),
                            createVNode("div", { class: "muted" }, toDisplayString(course2.instructor.role), 1),
                            createVNode(_component_a_space, {
                              size: "small",
                              class: "muted",
                              style: { "margin-top": "6px" }
                            }, {
                              default: withCtx(() => [
                                createVNode("span", null, toDisplayString(course2.instructor.reviews) + " Reviews", 1),
                                createVNode("span", null, "•"),
                                createVNode("span", null, toDisplayString(course2.instructor.students) + " Students", 1)
                              ]),
                              _: 1
                            })
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_a_tab_pane, {
                key: "reviews",
                tab: "Reviews"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_empty, { description: "Reviews coming soon" })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section><aside class="right-col" aria-label="Course completion" data-v-05a6edc3>`);
      _push(ssrRenderComponent(_component_a_affix, { "offset-top": 24 }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_card, {
              title: "Course Completion",
              bordered: true
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_space, {
                    align: "center",
                    size: 16
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_progress, {
                          type: "circle",
                          percent: completionPct.value,
                          width: 82
                        }, null, _parent4, _scopeId3));
                        _push4(`<div data-v-05a6edc3${_scopeId3}><div class="count" data-v-05a6edc3${_scopeId3}>${ssrInterpolate(completedCount.value)} / ${ssrInterpolate(totalCount.value)} completed</div>`);
                        _push4(ssrRenderComponent(_component_a_popconfirm, {
                          title: "Mark all lessons as done?",
                          "ok-text": "Yes",
                          "cancel-text": "No",
                          onConfirm: markAllDone
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_button, { type: "link" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Mark all done`);
                                  } else {
                                    return [
                                      createTextVNode("Mark all done")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_button, { type: "link" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Mark all done")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode(_component_a_progress, {
                            type: "circle",
                            percent: completionPct.value,
                            width: 82
                          }, null, 8, ["percent"]),
                          createVNode("div", null, [
                            createVNode("div", { class: "count" }, toDisplayString(completedCount.value) + " / " + toDisplayString(totalCount.value) + " completed", 1),
                            createVNode(_component_a_popconfirm, {
                              title: "Mark all lessons as done?",
                              "ok-text": "Yes",
                              "cancel-text": "No",
                              onConfirm: markAllDone
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_button, { type: "link" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Mark all done")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_divider, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_collapse, {
                    activeKey: openPanels.value,
                    "onUpdate:activeKey": ($event) => openPanels.value = $event,
                    "expand-icon-position": "end",
                    accordion: false,
                    style: { "background": "transparent" }
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(sectionsEntries.value, ([sk, sec]) => {
                          _push4(ssrRenderComponent(_component_a_collapse_panel, {
                            key: sk,
                            header: `${sec.title} (${sec.lessons.length})`
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<div class="lessons" data-v-05a6edc3${_scopeId4}><!--[-->`);
                                ssrRenderList(sec.lessons, (l, idx) => {
                                  _push5(`<div class="${ssrRenderClass([{ active: l.active }, "lesson-row"])}" data-v-05a6edc3${_scopeId4}>`);
                                  _push5(ssrRenderComponent(_component_a_checkbox, {
                                    checked: l.done,
                                    "onUpdate:checked": ($event) => l.done = $event,
                                    onClick: () => {
                                    }
                                  }, null, _parent5, _scopeId4));
                                  _push5(`<span class="num" data-v-05a6edc3${_scopeId4}>${ssrInterpolate(l.num)}</span><span class="title" data-v-05a6edc3${_scopeId4}>${ssrInterpolate(l.title)}</span>`);
                                  _push5(ssrRenderComponent(_component_a_space, { style: { "margin-left": "auto" } }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(VideoCameraOutlined), null, null, _parent6, _scopeId5));
                                        _push6(`<span class="dur" data-v-05a6edc3${_scopeId5}>${ssrInterpolate(l.duration)}</span>`);
                                      } else {
                                        return [
                                          createVNode(unref(VideoCameraOutlined)),
                                          createVNode("span", { class: "dur" }, toDisplayString(l.duration), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                  _push5(`</div>`);
                                });
                                _push5(`<!--]--></div>`);
                              } else {
                                return [
                                  createVNode("div", { class: "lessons" }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(sec.lessons, (l, idx) => {
                                      return openBlock(), createBlock("div", {
                                        key: l.id,
                                        class: ["lesson-row", { active: l.active }],
                                        onClick: ($event) => setActive(sk, idx)
                                      }, [
                                        createVNode(_component_a_checkbox, {
                                          checked: l.done,
                                          "onUpdate:checked": ($event) => l.done = $event,
                                          onClick: withModifiers(() => {
                                          }, ["stop"])
                                        }, null, 8, ["checked", "onUpdate:checked", "onClick"]),
                                        createVNode("span", { class: "num" }, toDisplayString(l.num), 1),
                                        createVNode("span", { class: "title" }, toDisplayString(l.title), 1),
                                        createVNode(_component_a_space, { style: { "margin-left": "auto" } }, {
                                          default: withCtx(() => [
                                            createVNode(unref(VideoCameraOutlined)),
                                            createVNode("span", { class: "dur" }, toDisplayString(l.duration), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ], 10, ["onClick"]);
                                    }), 128))
                                  ])
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                      } else {
                        return [
                          (openBlock(true), createBlock(Fragment, null, renderList(sectionsEntries.value, ([sk, sec]) => {
                            return openBlock(), createBlock(_component_a_collapse_panel, {
                              key: sk,
                              header: `${sec.title} (${sec.lessons.length})`
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "lessons" }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(sec.lessons, (l, idx) => {
                                    return openBlock(), createBlock("div", {
                                      key: l.id,
                                      class: ["lesson-row", { active: l.active }],
                                      onClick: ($event) => setActive(sk, idx)
                                    }, [
                                      createVNode(_component_a_checkbox, {
                                        checked: l.done,
                                        "onUpdate:checked": ($event) => l.done = $event,
                                        onClick: withModifiers(() => {
                                        }, ["stop"])
                                      }, null, 8, ["checked", "onUpdate:checked", "onClick"]),
                                      createVNode("span", { class: "num" }, toDisplayString(l.num), 1),
                                      createVNode("span", { class: "title" }, toDisplayString(l.title), 1),
                                      createVNode(_component_a_space, { style: { "margin-left": "auto" } }, {
                                        default: withCtx(() => [
                                          createVNode(unref(VideoCameraOutlined)),
                                          createVNode("span", { class: "dur" }, toDisplayString(l.duration), 1)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ], 10, ["onClick"]);
                                  }), 128))
                                ])
                              ]),
                              _: 2
                            }, 1032, ["header"]);
                          }), 128))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_space, {
                      align: "center",
                      size: 16
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_progress, {
                          type: "circle",
                          percent: completionPct.value,
                          width: 82
                        }, null, 8, ["percent"]),
                        createVNode("div", null, [
                          createVNode("div", { class: "count" }, toDisplayString(completedCount.value) + " / " + toDisplayString(totalCount.value) + " completed", 1),
                          createVNode(_component_a_popconfirm, {
                            title: "Mark all lessons as done?",
                            "ok-text": "Yes",
                            "cancel-text": "No",
                            onConfirm: markAllDone
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, { type: "link" }, {
                                default: withCtx(() => [
                                  createTextVNode("Mark all done")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_divider),
                    createVNode(_component_a_collapse, {
                      activeKey: openPanels.value,
                      "onUpdate:activeKey": ($event) => openPanels.value = $event,
                      "expand-icon-position": "end",
                      accordion: false,
                      style: { "background": "transparent" }
                    }, {
                      default: withCtx(() => [
                        (openBlock(true), createBlock(Fragment, null, renderList(sectionsEntries.value, ([sk, sec]) => {
                          return openBlock(), createBlock(_component_a_collapse_panel, {
                            key: sk,
                            header: `${sec.title} (${sec.lessons.length})`
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "lessons" }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(sec.lessons, (l, idx) => {
                                  return openBlock(), createBlock("div", {
                                    key: l.id,
                                    class: ["lesson-row", { active: l.active }],
                                    onClick: ($event) => setActive(sk, idx)
                                  }, [
                                    createVNode(_component_a_checkbox, {
                                      checked: l.done,
                                      "onUpdate:checked": ($event) => l.done = $event,
                                      onClick: withModifiers(() => {
                                      }, ["stop"])
                                    }, null, 8, ["checked", "onUpdate:checked", "onClick"]),
                                    createVNode("span", { class: "num" }, toDisplayString(l.num), 1),
                                    createVNode("span", { class: "title" }, toDisplayString(l.title), 1),
                                    createVNode(_component_a_space, { style: { "margin-left": "auto" } }, {
                                      default: withCtx(() => [
                                        createVNode(unref(VideoCameraOutlined)),
                                        createVNode("span", { class: "dur" }, toDisplayString(l.duration), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ], 10, ["onClick"]);
                                }), 128))
                              ])
                            ]),
                            _: 2
                          }, 1032, ["header"]);
                        }), 128))
                      ]),
                      _: 1
                    }, 8, ["activeKey", "onUpdate:activeKey"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_card, {
                title: "Course Completion",
                bordered: true
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_space, {
                    align: "center",
                    size: 16
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_progress, {
                        type: "circle",
                        percent: completionPct.value,
                        width: 82
                      }, null, 8, ["percent"]),
                      createVNode("div", null, [
                        createVNode("div", { class: "count" }, toDisplayString(completedCount.value) + " / " + toDisplayString(totalCount.value) + " completed", 1),
                        createVNode(_component_a_popconfirm, {
                          title: "Mark all lessons as done?",
                          "ok-text": "Yes",
                          "cancel-text": "No",
                          onConfirm: markAllDone
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_button, { type: "link" }, {
                              default: withCtx(() => [
                                createTextVNode("Mark all done")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_divider),
                  createVNode(_component_a_collapse, {
                    activeKey: openPanels.value,
                    "onUpdate:activeKey": ($event) => openPanels.value = $event,
                    "expand-icon-position": "end",
                    accordion: false,
                    style: { "background": "transparent" }
                  }, {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(sectionsEntries.value, ([sk, sec]) => {
                        return openBlock(), createBlock(_component_a_collapse_panel, {
                          key: sk,
                          header: `${sec.title} (${sec.lessons.length})`
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "lessons" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(sec.lessons, (l, idx) => {
                                return openBlock(), createBlock("div", {
                                  key: l.id,
                                  class: ["lesson-row", { active: l.active }],
                                  onClick: ($event) => setActive(sk, idx)
                                }, [
                                  createVNode(_component_a_checkbox, {
                                    checked: l.done,
                                    "onUpdate:checked": ($event) => l.done = $event,
                                    onClick: withModifiers(() => {
                                    }, ["stop"])
                                  }, null, 8, ["checked", "onUpdate:checked", "onClick"]),
                                  createVNode("span", { class: "num" }, toDisplayString(l.num), 1),
                                  createVNode("span", { class: "title" }, toDisplayString(l.title), 1),
                                  createVNode(_component_a_space, { style: { "margin-left": "auto" } }, {
                                    default: withCtx(() => [
                                      createVNode(unref(VideoCameraOutlined)),
                                      createVNode("span", { class: "dur" }, toDisplayString(l.duration), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ], 10, ["onClick"]);
                              }), 128))
                            ])
                          ]),
                          _: 2
                        }, 1032, ["header"]);
                      }), 128))
                    ]),
                    _: 1
                  }, 8, ["activeKey", "onUpdate:activeKey"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</aside></main>`);
      _push(ssrRenderComponent(_component_a_float_button_group, {
        shape: "square",
        style: { right: "24px" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_float_button, {
              tooltip: "Continue next lesson",
              onClick: goToNextIncomplete,
              icon: h(unref(PlayCircleOutlined))
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_float_button, {
              tooltip: "Notes",
              onClick: ($event) => openNotes.value = true,
              icon: h(unref(EditOutlined))
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_float_button, {
              tooltip: "Share",
              icon: h(unref(ShareAltOutlined))
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_float_button, {
                tooltip: "Continue next lesson",
                onClick: goToNextIncomplete,
                icon: h(unref(PlayCircleOutlined))
              }, null, 8, ["icon"]),
              createVNode(_component_a_float_button, {
                tooltip: "Notes",
                onClick: ($event) => openNotes.value = true,
                icon: h(unref(EditOutlined))
              }, null, 8, ["onClick", "icon"]),
              createVNode(_component_a_float_button, {
                tooltip: "Share",
                icon: h(unref(ShareAltOutlined))
              }, null, 8, ["icon"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_drawer, {
        open: openNotes.value,
        "onUpdate:open": ($event) => openNotes.value = $event,
        title: "My notes for this lesson",
        width: "420"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!currentLesson.value) {
              _push2(ssrRenderComponent(_component_a_typography_text, { type: "secondary" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Open a lesson to attach notes.`);
                  } else {
                    return [
                      createTextVNode("Open a lesson to attach notes.")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_component_a_textarea, {
                value: notes[currentLesson.value.id],
                "onUpdate:value": ($event) => notes[currentLesson.value.id] = $event,
                rows: 10,
                placeholder: "Write your notes here…"
              }, null, _parent2, _scopeId));
            }
          } else {
            return [
              !currentLesson.value ? (openBlock(), createBlock(_component_a_typography_text, {
                key: 0,
                type: "secondary"
              }, {
                default: withCtx(() => [
                  createTextVNode("Open a lesson to attach notes.")
                ]),
                _: 1
              })) : (openBlock(), createBlock(_component_a_textarea, {
                key: 1,
                value: notes[currentLesson.value.id],
                "onUpdate:value": ($event) => notes[currentLesson.value.id] = $event,
                rows: 10,
                placeholder: "Write your notes here…"
              }, null, 8, ["value", "onUpdate:value"]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/course-platform/nuxt/pages/course.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const course = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-05a6edc3"]]);

export { course as default };
//# sourceMappingURL=course-DWZIXpDq.mjs.map
