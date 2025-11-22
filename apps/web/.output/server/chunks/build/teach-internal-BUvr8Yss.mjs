import { defineComponent, ref, reactive, resolveComponent, mergeProps, withCtx, h, unref, createTextVNode, createVNode, createBlock, openBlock, toDisplayString, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { DashboardOutlined, BookOutlined, TeamOutlined, DollarOutlined, StarOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "teach-internal",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const collapsed = ref(false);
    const activeKey = ref("overview");
    const selectedKeys = ref(["overview"]);
    const onMenuClick = (e) => {
      selectedKeys.value = [e.key];
      activeKey.value = e.key;
    };
    const route = useRoute();
    const teacher = reactive({
      id: route.params.teacher_id,
      name: "Theresa Webb",
      specialization: "Frontend Developer & Mentor",
      avatar: "/instructors/theresa.jpg",
      stats: { courses: 5, students: 2400, revenue: 4300 },
      courses: [
        { id: 1, title: "Advanced Vue 3 Workshop", students: 800, rating: 4.9, price: 49 },
        { id: 2, title: "Design Systems with Ant Design Vue", students: 400, rating: 4.8, price: 69 }
      ],
      students: [
        { name: "Ronald Richards", email: "ronald@byway.com", progress: 70 },
        { name: "Cody Fisher", email: "cody@byway.com", progress: 35 }
      ],
      reviews: [
        { author: "Savannah Nguyen", rating: 5, text: "Loved the pacing and examples." },
        { author: "Courtney Henry", rating: 4, text: "Great depth on composition API." }
      ]
    });
    const columns = [
      { title: "Course Title", dataIndex: "title", key: "title" },
      { title: "Students", dataIndex: "students", key: "students" },
      { title: "Rating", dataIndex: "rating", key: "rating" },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        customRender: ({ text }) => `$${text}`
      }
    ];
    const createCourse = () => router.push("/teach-internal/" + teacher.id + "/course/create");
    const openModules = () => router.push("/teach-internal/" + teacher.id + "/course/create/module/create");
    const openAssignments = () => router.push("/teach-internal/" + teacher.id + "/institutions/_/assignments/1/grading");
    const openRevenue = () => {
      selectedKeys.value = ["revenue"];
      activeKey.value = "revenue";
    };
    const saveSettings = () => message.success("Profile updated successfully!");
    const renderStudent = (student) => h("a-list-item", {}, [
      h("a-list-item-meta", {
        title: student.name,
        description: student.email,
        avatar: h("a-avatar", { icon: h(UserOutlined) })
      }),
      h("a-progress", { percent: student.progress, size: "small", status: "active" })
    ]);
    const renderReview = (review) => h("a-list-item", {}, [
      h("a-list-item-meta", {
        title: `${review?.author || "Anonymous"}`,
        description: review?.text || "",
        avatar: h("a-avatar", (review?.author || " ").slice(0, 1))
      }),
      h("a-rate", { value: review?.rating || 0, disabled: true, allowHalf: true })
    ]);
    const upcoming = [
      { title: "Publish “Vue 3 Workshop” updates", when: "Tomorrow" },
      { title: "Grade Assignment #2", when: "Friday, 3pm" },
      { title: "Schedule live Q&A", when: "Next Monday" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_layout_sider = resolveComponent("a-layout-sider");
      const _component_a_menu = resolveComponent("a-menu");
      const _component_a_menu_item = resolveComponent("a-menu-item");
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_avatar = resolveComponent("a-avatar");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_layout_content = resolveComponent("a-layout-content");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_card_meta = resolveComponent("a-card-meta");
      const _component_a_statistic = resolveComponent("a-statistic");
      const _component_a_progress = resolveComponent("a-progress");
      const _component_a_empty = resolveComponent("a-empty");
      const _component_a_list = resolveComponent("a-list");
      const _component_a_timeline = resolveComponent("a-timeline");
      const _component_a_timeline_item = resolveComponent("a-timeline-item");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_form = resolveComponent("a-form");
      const _component_a_form_item = resolveComponent("a-form-item");
      const _component_a_input = resolveComponent("a-input");
      _push(ssrRenderComponent(_component_a_layout, mergeProps({ class: "teach-dashboard" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_layout_sider, {
              width: "240",
              collapsible: "",
              collapsed: collapsed.value,
              "onUpdate:collapsed": ($event) => collapsed.value = $event,
              class: "dashboard-sider"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="logo" data-v-5fc39c22${_scopeId2}>Byway Teach</div>`);
                  _push3(ssrRenderComponent(_component_a_menu, {
                    theme: "dark",
                    mode: "inline",
                    selectedKeys: selectedKeys.value,
                    "onUpdate:selectedKeys": ($event) => selectedKeys.value = $event,
                    onClick: onMenuClick
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_menu_item, {
                          key: "overview",
                          icon: h(unref(DashboardOutlined))
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Overview`);
                            } else {
                              return [
                                createTextVNode("Overview")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, {
                          key: "courses",
                          icon: h(unref(BookOutlined))
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`My Courses`);
                            } else {
                              return [
                                createTextVNode("My Courses")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, {
                          key: "students",
                          icon: h(unref(TeamOutlined))
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Students`);
                            } else {
                              return [
                                createTextVNode("Students")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, {
                          key: "revenue",
                          icon: h(unref(DollarOutlined))
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Revenue`);
                            } else {
                              return [
                                createTextVNode("Revenue")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, {
                          key: "reviews",
                          icon: h(unref(StarOutlined))
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Reviews`);
                            } else {
                              return [
                                createTextVNode("Reviews")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, {
                          key: "settings",
                          icon: h(unref(SettingOutlined))
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Settings`);
                            } else {
                              return [
                                createTextVNode("Settings")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_menu_item, {
                            key: "overview",
                            icon: h(unref(DashboardOutlined))
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Overview")
                            ]),
                            _: 1
                          }, 8, ["icon"]),
                          createVNode(_component_a_menu_item, {
                            key: "courses",
                            icon: h(unref(BookOutlined))
                          }, {
                            default: withCtx(() => [
                              createTextVNode("My Courses")
                            ]),
                            _: 1
                          }, 8, ["icon"]),
                          createVNode(_component_a_menu_item, {
                            key: "students",
                            icon: h(unref(TeamOutlined))
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Students")
                            ]),
                            _: 1
                          }, 8, ["icon"]),
                          createVNode(_component_a_menu_item, {
                            key: "revenue",
                            icon: h(unref(DollarOutlined))
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Revenue")
                            ]),
                            _: 1
                          }, 8, ["icon"]),
                          createVNode(_component_a_menu_item, {
                            key: "reviews",
                            icon: h(unref(StarOutlined))
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Reviews")
                            ]),
                            _: 1
                          }, 8, ["icon"]),
                          createVNode(_component_a_menu_item, {
                            key: "settings",
                            icon: h(unref(SettingOutlined))
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Settings")
                            ]),
                            _: 1
                          }, 8, ["icon"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", { class: "logo" }, "Byway Teach"),
                    createVNode(_component_a_menu, {
                      theme: "dark",
                      mode: "inline",
                      selectedKeys: selectedKeys.value,
                      "onUpdate:selectedKeys": ($event) => selectedKeys.value = $event,
                      onClick: onMenuClick
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_menu_item, {
                          key: "overview",
                          icon: h(unref(DashboardOutlined))
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Overview")
                          ]),
                          _: 1
                        }, 8, ["icon"]),
                        createVNode(_component_a_menu_item, {
                          key: "courses",
                          icon: h(unref(BookOutlined))
                        }, {
                          default: withCtx(() => [
                            createTextVNode("My Courses")
                          ]),
                          _: 1
                        }, 8, ["icon"]),
                        createVNode(_component_a_menu_item, {
                          key: "students",
                          icon: h(unref(TeamOutlined))
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Students")
                          ]),
                          _: 1
                        }, 8, ["icon"]),
                        createVNode(_component_a_menu_item, {
                          key: "revenue",
                          icon: h(unref(DollarOutlined))
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Revenue")
                          ]),
                          _: 1
                        }, 8, ["icon"]),
                        createVNode(_component_a_menu_item, {
                          key: "reviews",
                          icon: h(unref(StarOutlined))
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Reviews")
                          ]),
                          _: 1
                        }, 8, ["icon"]),
                        createVNode(_component_a_menu_item, {
                          key: "settings",
                          icon: h(unref(SettingOutlined))
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Settings")
                          ]),
                          _: 1
                        }, 8, ["icon"])
                      ]),
                      _: 1
                    }, 8, ["selectedKeys", "onUpdate:selectedKeys"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_layout, { class: "content-layout" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_page_header, {
                    title: teacher.name,
                    "sub-title": teacher.specialization,
                    class: "dashboard-header"
                  }, {
                    avatar: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_avatar, {
                          src: teacher.avatar,
                          size: "large"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_avatar, {
                            src: teacher.avatar,
                            size: "large"
                          }, null, 8, ["src"])
                        ];
                      }
                    }),
                    extra: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_button, {
                          type: "primary",
                          onClick: createCourse
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`+ New Course`);
                            } else {
                              return [
                                createTextVNode("+ New Course")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_button, {
                            type: "primary",
                            onClick: createCourse
                          }, {
                            default: withCtx(() => [
                              createTextVNode("+ New Course")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_layout_content, { class: "dashboard-content" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_row, {
                          gutter: "12",
                          class: "mb-3 quick-actions"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_col, {
                                xs: 24,
                                sm: 12,
                                lg: 6
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_card, {
                                      hoverable: "",
                                      onClick: createCourse
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_card_meta, {
                                            title: "Create course",
                                            description: "Draft a new curriculum"
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_card_meta, {
                                              title: "Create course",
                                              description: "Draft a new curriculum"
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_card, {
                                        hoverable: "",
                                        onClick: createCourse
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_card_meta, {
                                            title: "Create course",
                                            description: "Draft a new curriculum"
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_col, {
                                xs: 24,
                                sm: 12,
                                lg: 6
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_card, {
                                      hoverable: "",
                                      onClick: openModules
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_card_meta, {
                                            title: "Manage modules",
                                            description: "Edit lessons & order"
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_card_meta, {
                                              title: "Manage modules",
                                              description: "Edit lessons & order"
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_card, {
                                        hoverable: "",
                                        onClick: openModules
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_card_meta, {
                                            title: "Manage modules",
                                            description: "Edit lessons & order"
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_col, {
                                xs: 24,
                                sm: 12,
                                lg: 6
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_card, {
                                      hoverable: "",
                                      onClick: openAssignments
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_card_meta, {
                                            title: "Grade assignments",
                                            description: "Review submissions"
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_card_meta, {
                                              title: "Grade assignments",
                                              description: "Review submissions"
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_card, {
                                        hoverable: "",
                                        onClick: openAssignments
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_card_meta, {
                                            title: "Grade assignments",
                                            description: "Review submissions"
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_col, {
                                xs: 24,
                                sm: 12,
                                lg: 6
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_card, {
                                      hoverable: "",
                                      onClick: openRevenue
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_card_meta, {
                                            title: "Payouts",
                                            description: "Check earnings & status"
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_card_meta, {
                                              title: "Payouts",
                                              description: "Check earnings & status"
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_card, {
                                        hoverable: "",
                                        onClick: openRevenue
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_card_meta, {
                                            title: "Payouts",
                                            description: "Check earnings & status"
                                          })
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
                                  xs: 24,
                                  sm: 12,
                                  lg: 6
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, {
                                      hoverable: "",
                                      onClick: createCourse
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_card_meta, {
                                          title: "Create course",
                                          description: "Draft a new curriculum"
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_col, {
                                  xs: 24,
                                  sm: 12,
                                  lg: 6
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, {
                                      hoverable: "",
                                      onClick: openModules
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_card_meta, {
                                          title: "Manage modules",
                                          description: "Edit lessons & order"
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_col, {
                                  xs: 24,
                                  sm: 12,
                                  lg: 6
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, {
                                      hoverable: "",
                                      onClick: openAssignments
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_card_meta, {
                                          title: "Grade assignments",
                                          description: "Review submissions"
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_col, {
                                  xs: 24,
                                  sm: 12,
                                  lg: 6
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, {
                                      hoverable: "",
                                      onClick: openRevenue
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_card_meta, {
                                          title: "Payouts",
                                          description: "Check earnings & status"
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
                        }, _parent4, _scopeId3));
                        if (activeKey.value === "overview") {
                          _push4(`<div class="overview-section" data-v-5fc39c22${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_a_row, { gutter: "24" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_col, {
                                  xs: 24,
                                  sm: 12,
                                  md: 8
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_card, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_statistic, {
                                              title: "Active Courses",
                                              value: teacher.stats.courses,
                                              suffix: "live"
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_statistic, {
                                                title: "Active Courses",
                                                value: teacher.stats.courses,
                                                suffix: "live"
                                              }, null, 8, ["value"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_a_card, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_statistic, {
                                              title: "Active Courses",
                                              value: teacher.stats.courses,
                                              suffix: "live"
                                            }, null, 8, ["value"])
                                          ]),
                                          _: 1
                                        })
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_col, {
                                  xs: 24,
                                  sm: 12,
                                  md: 8
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_card, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_statistic, {
                                              title: "Total Students",
                                              value: teacher.stats.students
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_statistic, {
                                                title: "Total Students",
                                                value: teacher.stats.students
                                              }, null, 8, ["value"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_a_card, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_statistic, {
                                              title: "Total Students",
                                              value: teacher.stats.students
                                            }, null, 8, ["value"])
                                          ]),
                                          _: 1
                                        })
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_col, {
                                  xs: 24,
                                  sm: 12,
                                  md: 8
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_card, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_statistic, {
                                              title: "Monthly Revenue",
                                              prefix: "$",
                                              value: teacher.stats.revenue
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_statistic, {
                                                title: "Monthly Revenue",
                                                prefix: "$",
                                                value: teacher.stats.revenue
                                              }, null, 8, ["value"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_a_card, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_statistic, {
                                              title: "Monthly Revenue",
                                              prefix: "$",
                                              value: teacher.stats.revenue
                                            }, null, 8, ["value"])
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
                                    xs: 24,
                                    sm: 12,
                                    md: 8
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_card, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_statistic, {
                                            title: "Active Courses",
                                            value: teacher.stats.courses,
                                            suffix: "live"
                                          }, null, 8, ["value"])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_col, {
                                    xs: 24,
                                    sm: 12,
                                    md: 8
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_card, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_statistic, {
                                            title: "Total Students",
                                            value: teacher.stats.students
                                          }, null, 8, ["value"])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_col, {
                                    xs: 24,
                                    sm: 12,
                                    md: 8
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_card, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_statistic, {
                                            title: "Monthly Revenue",
                                            prefix: "$",
                                            value: teacher.stats.revenue
                                          }, null, 8, ["value"])
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
                          _push4(ssrRenderComponent(_component_a_card, {
                            title: "Performance Progress",
                            class: "mt-4"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_progress, {
                                  percent: 78,
                                  status: "active",
                                  "stroke-color": "#1677ff"
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_progress, {
                                    percent: 78,
                                    status: "active",
                                    "stroke-color": "#1677ff"
                                  })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_row, {
                            gutter: "16",
                            class: "mt-4"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_col, {
                                  xs: 24,
                                  lg: 12
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_card, { title: "Recent reviews" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            if (!teacher.reviews.length) {
                                              _push7(ssrRenderComponent(_component_a_empty, { description: "No reviews yet" }, null, _parent7, _scopeId6));
                                            } else {
                                              _push7(ssrRenderComponent(_component_a_list, {
                                                "data-source": teacher.reviews,
                                                renderItem: renderReview
                                              }, null, _parent7, _scopeId6));
                                            }
                                          } else {
                                            return [
                                              !teacher.reviews.length ? (openBlock(), createBlock(_component_a_empty, {
                                                key: 0,
                                                description: "No reviews yet"
                                              })) : (openBlock(), createBlock(_component_a_list, {
                                                key: 1,
                                                "data-source": teacher.reviews,
                                                renderItem: renderReview
                                              }, null, 8, ["data-source"]))
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_a_card, { title: "Recent reviews" }, {
                                          default: withCtx(() => [
                                            !teacher.reviews.length ? (openBlock(), createBlock(_component_a_empty, {
                                              key: 0,
                                              description: "No reviews yet"
                                            })) : (openBlock(), createBlock(_component_a_list, {
                                              key: 1,
                                              "data-source": teacher.reviews,
                                              renderItem: renderReview
                                            }, null, 8, ["data-source"]))
                                          ]),
                                          _: 1
                                        })
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_col, {
                                  xs: 24,
                                  lg: 12
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_card, { title: "Upcoming tasks" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_timeline, null, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`<!--[-->`);
                                                  ssrRenderList(upcoming, (task) => {
                                                    _push8(ssrRenderComponent(_component_a_timeline_item, {
                                                      key: task.title
                                                    }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(`<strong data-v-5fc39c22${_scopeId8}>${ssrInterpolate(task.title)}</strong><div class="muted" data-v-5fc39c22${_scopeId8}>${ssrInterpolate(task.when)}</div>`);
                                                        } else {
                                                          return [
                                                            createVNode("strong", null, toDisplayString(task.title), 1),
                                                            createVNode("div", { class: "muted" }, toDisplayString(task.when), 1)
                                                          ];
                                                        }
                                                      }),
                                                      _: 2
                                                    }, _parent8, _scopeId7));
                                                  });
                                                  _push8(`<!--]-->`);
                                                } else {
                                                  return [
                                                    (openBlock(), createBlock(Fragment, null, renderList(upcoming, (task) => {
                                                      return createVNode(_component_a_timeline_item, {
                                                        key: task.title
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode("strong", null, toDisplayString(task.title), 1),
                                                          createVNode("div", { class: "muted" }, toDisplayString(task.when), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024);
                                                    }), 64))
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_timeline, null, {
                                                default: withCtx(() => [
                                                  (openBlock(), createBlock(Fragment, null, renderList(upcoming, (task) => {
                                                    return createVNode(_component_a_timeline_item, {
                                                      key: task.title
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode("strong", null, toDisplayString(task.title), 1),
                                                        createVNode("div", { class: "muted" }, toDisplayString(task.when), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024);
                                                  }), 64))
                                                ]),
                                                _: 1
                                              })
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_a_card, { title: "Upcoming tasks" }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_timeline, null, {
                                              default: withCtx(() => [
                                                (openBlock(), createBlock(Fragment, null, renderList(upcoming, (task) => {
                                                  return createVNode(_component_a_timeline_item, {
                                                    key: task.title
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode("strong", null, toDisplayString(task.title), 1),
                                                      createVNode("div", { class: "muted" }, toDisplayString(task.when), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024);
                                                }), 64))
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
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_col, {
                                    xs: 24,
                                    lg: 12
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_card, { title: "Recent reviews" }, {
                                        default: withCtx(() => [
                                          !teacher.reviews.length ? (openBlock(), createBlock(_component_a_empty, {
                                            key: 0,
                                            description: "No reviews yet"
                                          })) : (openBlock(), createBlock(_component_a_list, {
                                            key: 1,
                                            "data-source": teacher.reviews,
                                            renderItem: renderReview
                                          }, null, 8, ["data-source"]))
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_col, {
                                    xs: 24,
                                    lg: 12
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_card, { title: "Upcoming tasks" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_timeline, null, {
                                            default: withCtx(() => [
                                              (openBlock(), createBlock(Fragment, null, renderList(upcoming, (task) => {
                                                return createVNode(_component_a_timeline_item, {
                                                  key: task.title
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode("strong", null, toDisplayString(task.title), 1),
                                                    createVNode("div", { class: "muted" }, toDisplayString(task.when), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024);
                                              }), 64))
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
                          }, _parent4, _scopeId3));
                          _push4(`</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        if (activeKey.value === "courses") {
                          _push4(`<div class="courses-section" data-v-5fc39c22${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_a_card, { title: "Your Courses" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_table, {
                                  columns,
                                  "data-source": teacher.courses,
                                  "row-key": "id"
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_table, {
                                    columns,
                                    "data-source": teacher.courses,
                                    "row-key": "id"
                                  }, null, 8, ["data-source"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        if (activeKey.value === "students") {
                          _push4(`<div class="students-section" data-v-5fc39c22${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_a_card, { title: "Recent Enrollments" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_list, {
                                  "item-layout": "horizontal",
                                  "data-source": teacher.students,
                                  renderItem: renderStudent
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_list, {
                                    "item-layout": "horizontal",
                                    "data-source": teacher.students,
                                    renderItem: renderStudent
                                  }, null, 8, ["data-source"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        if (activeKey.value === "revenue") {
                          _push4(`<div class="revenue-section" data-v-5fc39c22${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_a_card, { title: "Earnings Overview" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_statistic, {
                                  title: "This Month",
                                  prefix: "$",
                                  value: 3200
                                }, null, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_progress, {
                                  percent: 65,
                                  class: "mt-2"
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_statistic, {
                                    title: "This Month",
                                    prefix: "$",
                                    value: 3200
                                  }),
                                  createVNode(_component_a_progress, {
                                    percent: 65,
                                    class: "mt-2"
                                  })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        if (activeKey.value === "settings") {
                          _push4(`<div class="settings-section" data-v-5fc39c22${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_a_card, { title: "Profile Settings" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_form, {
                                  layout: "vertical",
                                  onFinish: saveSettings,
                                  model: teacher
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_form_item, { label: "Name" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_input, {
                                              value: teacher.name,
                                              "onUpdate:value": ($event) => teacher.name = $event
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_input, {
                                                value: teacher.name,
                                                "onUpdate:value": ($event) => teacher.name = $event
                                              }, null, 8, ["value", "onUpdate:value"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_a_form_item, { label: "Specialization" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_input, {
                                              value: teacher.specialization,
                                              "onUpdate:value": ($event) => teacher.specialization = $event
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_input, {
                                                value: teacher.specialization,
                                                "onUpdate:value": ($event) => teacher.specialization = $event
                                              }, null, 8, ["value", "onUpdate:value"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_a_button, {
                                        type: "primary",
                                        "html-type": "submit"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`Save Changes`);
                                          } else {
                                            return [
                                              createTextVNode("Save Changes")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_a_form_item, { label: "Name" }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_input, {
                                              value: teacher.name,
                                              "onUpdate:value": ($event) => teacher.name = $event
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_form_item, { label: "Specialization" }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_input, {
                                              value: teacher.specialization,
                                              "onUpdate:value": ($event) => teacher.specialization = $event
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_button, {
                                          type: "primary",
                                          "html-type": "submit"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Save Changes")
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
                                    onFinish: saveSettings,
                                    model: teacher
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_form_item, { label: "Name" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_input, {
                                            value: teacher.name,
                                            "onUpdate:value": ($event) => teacher.name = $event
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, { label: "Specialization" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_input, {
                                            value: teacher.specialization,
                                            "onUpdate:value": ($event) => teacher.specialization = $event
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        "html-type": "submit"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Save Changes")
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
                          }, _parent4, _scopeId3));
                          _push4(`</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          createVNode(_component_a_row, {
                            gutter: "12",
                            class: "mb-3 quick-actions"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_col, {
                                xs: 24,
                                sm: 12,
                                lg: 6
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, {
                                    hoverable: "",
                                    onClick: createCourse
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_card_meta, {
                                        title: "Create course",
                                        description: "Draft a new curriculum"
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_col, {
                                xs: 24,
                                sm: 12,
                                lg: 6
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, {
                                    hoverable: "",
                                    onClick: openModules
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_card_meta, {
                                        title: "Manage modules",
                                        description: "Edit lessons & order"
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_col, {
                                xs: 24,
                                sm: 12,
                                lg: 6
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, {
                                    hoverable: "",
                                    onClick: openAssignments
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_card_meta, {
                                        title: "Grade assignments",
                                        description: "Review submissions"
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_col, {
                                xs: 24,
                                sm: 12,
                                lg: 6
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, {
                                    hoverable: "",
                                    onClick: openRevenue
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_card_meta, {
                                        title: "Payouts",
                                        description: "Check earnings & status"
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
                          activeKey.value === "overview" ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "overview-section"
                          }, [
                            createVNode(_component_a_row, { gutter: "24" }, {
                              default: withCtx(() => [
                                createVNode(_component_a_col, {
                                  xs: 24,
                                  sm: 12,
                                  md: 8
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_statistic, {
                                          title: "Active Courses",
                                          value: teacher.stats.courses,
                                          suffix: "live"
                                        }, null, 8, ["value"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_col, {
                                  xs: 24,
                                  sm: 12,
                                  md: 8
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_statistic, {
                                          title: "Total Students",
                                          value: teacher.stats.students
                                        }, null, 8, ["value"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_col, {
                                  xs: 24,
                                  sm: 12,
                                  md: 8
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_statistic, {
                                          title: "Monthly Revenue",
                                          prefix: "$",
                                          value: teacher.stats.revenue
                                        }, null, 8, ["value"])
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
                              title: "Performance Progress",
                              class: "mt-4"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_progress, {
                                  percent: 78,
                                  status: "active",
                                  "stroke-color": "#1677ff"
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_row, {
                              gutter: "16",
                              class: "mt-4"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_col, {
                                  xs: 24,
                                  lg: 12
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, { title: "Recent reviews" }, {
                                      default: withCtx(() => [
                                        !teacher.reviews.length ? (openBlock(), createBlock(_component_a_empty, {
                                          key: 0,
                                          description: "No reviews yet"
                                        })) : (openBlock(), createBlock(_component_a_list, {
                                          key: 1,
                                          "data-source": teacher.reviews,
                                          renderItem: renderReview
                                        }, null, 8, ["data-source"]))
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_col, {
                                  xs: 24,
                                  lg: 12
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, { title: "Upcoming tasks" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_timeline, null, {
                                          default: withCtx(() => [
                                            (openBlock(), createBlock(Fragment, null, renderList(upcoming, (task) => {
                                              return createVNode(_component_a_timeline_item, {
                                                key: task.title
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode("strong", null, toDisplayString(task.title), 1),
                                                  createVNode("div", { class: "muted" }, toDisplayString(task.when), 1)
                                                ]),
                                                _: 2
                                              }, 1024);
                                            }), 64))
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
                          ])) : createCommentVNode("", true),
                          activeKey.value === "courses" ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "courses-section"
                          }, [
                            createVNode(_component_a_card, { title: "Your Courses" }, {
                              default: withCtx(() => [
                                createVNode(_component_a_table, {
                                  columns,
                                  "data-source": teacher.courses,
                                  "row-key": "id"
                                }, null, 8, ["data-source"])
                              ]),
                              _: 1
                            })
                          ])) : createCommentVNode("", true),
                          activeKey.value === "students" ? (openBlock(), createBlock("div", {
                            key: 2,
                            class: "students-section"
                          }, [
                            createVNode(_component_a_card, { title: "Recent Enrollments" }, {
                              default: withCtx(() => [
                                createVNode(_component_a_list, {
                                  "item-layout": "horizontal",
                                  "data-source": teacher.students,
                                  renderItem: renderStudent
                                }, null, 8, ["data-source"])
                              ]),
                              _: 1
                            })
                          ])) : createCommentVNode("", true),
                          activeKey.value === "revenue" ? (openBlock(), createBlock("div", {
                            key: 3,
                            class: "revenue-section"
                          }, [
                            createVNode(_component_a_card, { title: "Earnings Overview" }, {
                              default: withCtx(() => [
                                createVNode(_component_a_statistic, {
                                  title: "This Month",
                                  prefix: "$",
                                  value: 3200
                                }),
                                createVNode(_component_a_progress, {
                                  percent: 65,
                                  class: "mt-2"
                                })
                              ]),
                              _: 1
                            })
                          ])) : createCommentVNode("", true),
                          activeKey.value === "settings" ? (openBlock(), createBlock("div", {
                            key: 4,
                            class: "settings-section"
                          }, [
                            createVNode(_component_a_card, { title: "Profile Settings" }, {
                              default: withCtx(() => [
                                createVNode(_component_a_form, {
                                  layout: "vertical",
                                  onFinish: saveSettings,
                                  model: teacher
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_form_item, { label: "Name" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_input, {
                                          value: teacher.name,
                                          "onUpdate:value": ($event) => teacher.name = $event
                                        }, null, 8, ["value", "onUpdate:value"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_form_item, { label: "Specialization" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_input, {
                                          value: teacher.specialization,
                                          "onUpdate:value": ($event) => teacher.specialization = $event
                                        }, null, 8, ["value", "onUpdate:value"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_button, {
                                      type: "primary",
                                      "html-type": "submit"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Save Changes")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["model"])
                              ]),
                              _: 1
                            })
                          ])) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_page_header, {
                      title: teacher.name,
                      "sub-title": teacher.specialization,
                      class: "dashboard-header"
                    }, {
                      avatar: withCtx(() => [
                        createVNode(_component_a_avatar, {
                          src: teacher.avatar,
                          size: "large"
                        }, null, 8, ["src"])
                      ]),
                      extra: withCtx(() => [
                        createVNode(_component_a_button, {
                          type: "primary",
                          onClick: createCourse
                        }, {
                          default: withCtx(() => [
                            createTextVNode("+ New Course")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["title", "sub-title"]),
                    createVNode(_component_a_layout_content, { class: "dashboard-content" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_row, {
                          gutter: "12",
                          class: "mb-3 quick-actions"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_col, {
                              xs: 24,
                              sm: 12,
                              lg: 6
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, {
                                  hoverable: "",
                                  onClick: createCourse
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card_meta, {
                                      title: "Create course",
                                      description: "Draft a new curriculum"
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_col, {
                              xs: 24,
                              sm: 12,
                              lg: 6
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, {
                                  hoverable: "",
                                  onClick: openModules
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card_meta, {
                                      title: "Manage modules",
                                      description: "Edit lessons & order"
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_col, {
                              xs: 24,
                              sm: 12,
                              lg: 6
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, {
                                  hoverable: "",
                                  onClick: openAssignments
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card_meta, {
                                      title: "Grade assignments",
                                      description: "Review submissions"
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_col, {
                              xs: 24,
                              sm: 12,
                              lg: 6
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, {
                                  hoverable: "",
                                  onClick: openRevenue
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card_meta, {
                                      title: "Payouts",
                                      description: "Check earnings & status"
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
                        activeKey.value === "overview" ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "overview-section"
                        }, [
                          createVNode(_component_a_row, { gutter: "24" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_col, {
                                xs: 24,
                                sm: 12,
                                md: 8
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_statistic, {
                                        title: "Active Courses",
                                        value: teacher.stats.courses,
                                        suffix: "live"
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_col, {
                                xs: 24,
                                sm: 12,
                                md: 8
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_statistic, {
                                        title: "Total Students",
                                        value: teacher.stats.students
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_col, {
                                xs: 24,
                                sm: 12,
                                md: 8
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_statistic, {
                                        title: "Monthly Revenue",
                                        prefix: "$",
                                        value: teacher.stats.revenue
                                      }, null, 8, ["value"])
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
                            title: "Performance Progress",
                            class: "mt-4"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_progress, {
                                percent: 78,
                                status: "active",
                                "stroke-color": "#1677ff"
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_row, {
                            gutter: "16",
                            class: "mt-4"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_col, {
                                xs: 24,
                                lg: 12
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, { title: "Recent reviews" }, {
                                    default: withCtx(() => [
                                      !teacher.reviews.length ? (openBlock(), createBlock(_component_a_empty, {
                                        key: 0,
                                        description: "No reviews yet"
                                      })) : (openBlock(), createBlock(_component_a_list, {
                                        key: 1,
                                        "data-source": teacher.reviews,
                                        renderItem: renderReview
                                      }, null, 8, ["data-source"]))
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_col, {
                                xs: 24,
                                lg: 12
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, { title: "Upcoming tasks" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_timeline, null, {
                                        default: withCtx(() => [
                                          (openBlock(), createBlock(Fragment, null, renderList(upcoming, (task) => {
                                            return createVNode(_component_a_timeline_item, {
                                              key: task.title
                                            }, {
                                              default: withCtx(() => [
                                                createVNode("strong", null, toDisplayString(task.title), 1),
                                                createVNode("div", { class: "muted" }, toDisplayString(task.when), 1)
                                              ]),
                                              _: 2
                                            }, 1024);
                                          }), 64))
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
                        ])) : createCommentVNode("", true),
                        activeKey.value === "courses" ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "courses-section"
                        }, [
                          createVNode(_component_a_card, { title: "Your Courses" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_table, {
                                columns,
                                "data-source": teacher.courses,
                                "row-key": "id"
                              }, null, 8, ["data-source"])
                            ]),
                            _: 1
                          })
                        ])) : createCommentVNode("", true),
                        activeKey.value === "students" ? (openBlock(), createBlock("div", {
                          key: 2,
                          class: "students-section"
                        }, [
                          createVNode(_component_a_card, { title: "Recent Enrollments" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_list, {
                                "item-layout": "horizontal",
                                "data-source": teacher.students,
                                renderItem: renderStudent
                              }, null, 8, ["data-source"])
                            ]),
                            _: 1
                          })
                        ])) : createCommentVNode("", true),
                        activeKey.value === "revenue" ? (openBlock(), createBlock("div", {
                          key: 3,
                          class: "revenue-section"
                        }, [
                          createVNode(_component_a_card, { title: "Earnings Overview" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_statistic, {
                                title: "This Month",
                                prefix: "$",
                                value: 3200
                              }),
                              createVNode(_component_a_progress, {
                                percent: 65,
                                class: "mt-2"
                              })
                            ]),
                            _: 1
                          })
                        ])) : createCommentVNode("", true),
                        activeKey.value === "settings" ? (openBlock(), createBlock("div", {
                          key: 4,
                          class: "settings-section"
                        }, [
                          createVNode(_component_a_card, { title: "Profile Settings" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_form, {
                                layout: "vertical",
                                onFinish: saveSettings,
                                model: teacher
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_form_item, { label: "Name" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_input, {
                                        value: teacher.name,
                                        "onUpdate:value": ($event) => teacher.name = $event
                                      }, null, 8, ["value", "onUpdate:value"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_form_item, { label: "Specialization" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_input, {
                                        value: teacher.specialization,
                                        "onUpdate:value": ($event) => teacher.specialization = $event
                                      }, null, 8, ["value", "onUpdate:value"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_button, {
                                    type: "primary",
                                    "html-type": "submit"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Save Changes")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["model"])
                            ]),
                            _: 1
                          })
                        ])) : createCommentVNode("", true)
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
              createVNode(_component_a_layout_sider, {
                width: "240",
                collapsible: "",
                collapsed: collapsed.value,
                "onUpdate:collapsed": ($event) => collapsed.value = $event,
                class: "dashboard-sider"
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "logo" }, "Byway Teach"),
                  createVNode(_component_a_menu, {
                    theme: "dark",
                    mode: "inline",
                    selectedKeys: selectedKeys.value,
                    "onUpdate:selectedKeys": ($event) => selectedKeys.value = $event,
                    onClick: onMenuClick
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_menu_item, {
                        key: "overview",
                        icon: h(unref(DashboardOutlined))
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Overview")
                        ]),
                        _: 1
                      }, 8, ["icon"]),
                      createVNode(_component_a_menu_item, {
                        key: "courses",
                        icon: h(unref(BookOutlined))
                      }, {
                        default: withCtx(() => [
                          createTextVNode("My Courses")
                        ]),
                        _: 1
                      }, 8, ["icon"]),
                      createVNode(_component_a_menu_item, {
                        key: "students",
                        icon: h(unref(TeamOutlined))
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Students")
                        ]),
                        _: 1
                      }, 8, ["icon"]),
                      createVNode(_component_a_menu_item, {
                        key: "revenue",
                        icon: h(unref(DollarOutlined))
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Revenue")
                        ]),
                        _: 1
                      }, 8, ["icon"]),
                      createVNode(_component_a_menu_item, {
                        key: "reviews",
                        icon: h(unref(StarOutlined))
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Reviews")
                        ]),
                        _: 1
                      }, 8, ["icon"]),
                      createVNode(_component_a_menu_item, {
                        key: "settings",
                        icon: h(unref(SettingOutlined))
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Settings")
                        ]),
                        _: 1
                      }, 8, ["icon"])
                    ]),
                    _: 1
                  }, 8, ["selectedKeys", "onUpdate:selectedKeys"])
                ]),
                _: 1
              }, 8, ["collapsed", "onUpdate:collapsed"]),
              createVNode(_component_a_layout, { class: "content-layout" }, {
                default: withCtx(() => [
                  createVNode(_component_a_page_header, {
                    title: teacher.name,
                    "sub-title": teacher.specialization,
                    class: "dashboard-header"
                  }, {
                    avatar: withCtx(() => [
                      createVNode(_component_a_avatar, {
                        src: teacher.avatar,
                        size: "large"
                      }, null, 8, ["src"])
                    ]),
                    extra: withCtx(() => [
                      createVNode(_component_a_button, {
                        type: "primary",
                        onClick: createCourse
                      }, {
                        default: withCtx(() => [
                          createTextVNode("+ New Course")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["title", "sub-title"]),
                  createVNode(_component_a_layout_content, { class: "dashboard-content" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_row, {
                        gutter: "12",
                        class: "mb-3 quick-actions"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_col, {
                            xs: 24,
                            sm: 12,
                            lg: 6
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                hoverable: "",
                                onClick: createCourse
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card_meta, {
                                    title: "Create course",
                                    description: "Draft a new curriculum"
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 24,
                            sm: 12,
                            lg: 6
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                hoverable: "",
                                onClick: openModules
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card_meta, {
                                    title: "Manage modules",
                                    description: "Edit lessons & order"
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 24,
                            sm: 12,
                            lg: 6
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                hoverable: "",
                                onClick: openAssignments
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card_meta, {
                                    title: "Grade assignments",
                                    description: "Review submissions"
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 24,
                            sm: 12,
                            lg: 6
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                hoverable: "",
                                onClick: openRevenue
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card_meta, {
                                    title: "Payouts",
                                    description: "Check earnings & status"
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
                      activeKey.value === "overview" ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "overview-section"
                      }, [
                        createVNode(_component_a_row, { gutter: "24" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_col, {
                              xs: 24,
                              sm: 12,
                              md: 8
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_statistic, {
                                      title: "Active Courses",
                                      value: teacher.stats.courses,
                                      suffix: "live"
                                    }, null, 8, ["value"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_col, {
                              xs: 24,
                              sm: 12,
                              md: 8
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_statistic, {
                                      title: "Total Students",
                                      value: teacher.stats.students
                                    }, null, 8, ["value"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_col, {
                              xs: 24,
                              sm: 12,
                              md: 8
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_statistic, {
                                      title: "Monthly Revenue",
                                      prefix: "$",
                                      value: teacher.stats.revenue
                                    }, null, 8, ["value"])
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
                          title: "Performance Progress",
                          class: "mt-4"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_progress, {
                              percent: 78,
                              status: "active",
                              "stroke-color": "#1677ff"
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_row, {
                          gutter: "16",
                          class: "mt-4"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_col, {
                              xs: 24,
                              lg: 12
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, { title: "Recent reviews" }, {
                                  default: withCtx(() => [
                                    !teacher.reviews.length ? (openBlock(), createBlock(_component_a_empty, {
                                      key: 0,
                                      description: "No reviews yet"
                                    })) : (openBlock(), createBlock(_component_a_list, {
                                      key: 1,
                                      "data-source": teacher.reviews,
                                      renderItem: renderReview
                                    }, null, 8, ["data-source"]))
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_col, {
                              xs: 24,
                              lg: 12
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, { title: "Upcoming tasks" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_timeline, null, {
                                      default: withCtx(() => [
                                        (openBlock(), createBlock(Fragment, null, renderList(upcoming, (task) => {
                                          return createVNode(_component_a_timeline_item, {
                                            key: task.title
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("strong", null, toDisplayString(task.title), 1),
                                              createVNode("div", { class: "muted" }, toDisplayString(task.when), 1)
                                            ]),
                                            _: 2
                                          }, 1024);
                                        }), 64))
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
                      ])) : createCommentVNode("", true),
                      activeKey.value === "courses" ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "courses-section"
                      }, [
                        createVNode(_component_a_card, { title: "Your Courses" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_table, {
                              columns,
                              "data-source": teacher.courses,
                              "row-key": "id"
                            }, null, 8, ["data-source"])
                          ]),
                          _: 1
                        })
                      ])) : createCommentVNode("", true),
                      activeKey.value === "students" ? (openBlock(), createBlock("div", {
                        key: 2,
                        class: "students-section"
                      }, [
                        createVNode(_component_a_card, { title: "Recent Enrollments" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_list, {
                              "item-layout": "horizontal",
                              "data-source": teacher.students,
                              renderItem: renderStudent
                            }, null, 8, ["data-source"])
                          ]),
                          _: 1
                        })
                      ])) : createCommentVNode("", true),
                      activeKey.value === "revenue" ? (openBlock(), createBlock("div", {
                        key: 3,
                        class: "revenue-section"
                      }, [
                        createVNode(_component_a_card, { title: "Earnings Overview" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_statistic, {
                              title: "This Month",
                              prefix: "$",
                              value: 3200
                            }),
                            createVNode(_component_a_progress, {
                              percent: 65,
                              class: "mt-2"
                            })
                          ]),
                          _: 1
                        })
                      ])) : createCommentVNode("", true),
                      activeKey.value === "settings" ? (openBlock(), createBlock("div", {
                        key: 4,
                        class: "settings-section"
                      }, [
                        createVNode(_component_a_card, { title: "Profile Settings" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_form, {
                              layout: "vertical",
                              onFinish: saveSettings,
                              model: teacher
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_form_item, { label: "Name" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_input, {
                                      value: teacher.name,
                                      "onUpdate:value": ($event) => teacher.name = $event
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form_item, { label: "Specialization" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_input, {
                                      value: teacher.specialization,
                                      "onUpdate:value": ($event) => teacher.specialization = $event
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_button, {
                                  type: "primary",
                                  "html-type": "submit"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Save Changes")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["model"])
                          ]),
                          _: 1
                        })
                      ])) : createCommentVNode("", true)
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
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/teach-internal/nuxt/pages/teach-internal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const teachInternal = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5fc39c22"]]);

export { teachInternal as default };
//# sourceMappingURL=teach-internal-BUvr8Yss.mjs.map
