import { defineComponent, reactive, ref, computed, resolveComponent, withCtx, createTextVNode, toDisplayString, createVNode, renderSlot, h, unref, createBlock, openBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderSlot, ssrRenderList } from 'vue/server-renderer';
import { H as Header } from './Header-DscPRdFw.mjs';
import { CheckOutlined, UserAddOutlined, MailOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import '@apollo/client/core/index.js';
import '@apollo/client/link/context/index.js';
import '@vue/apollo-composable';

const pageSize = 8;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "course-author",
  __ssrInlineRender: true,
  setup(__props) {
    const author = reactive({
      name: "Ronald Richards",
      firstName: "Ronald",
      title: "Web developer, UX/UI Designer, and Teacher",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=320&auto=format&fit=crop",
      students: 1e3,
      reviews: 154,
      bio: `<p>Ronald Richards is a highly skilled UX/UI Designer with over a decade of experience in crafting user-centric digital solutions. With a background in graphic design and a keen eye for detail, Ronald specializes in creating intuitive interfaces that delight users and drive business results.</p>
        <p>He has worked with startups and enterprises alike, leading cross-functional teams and mentoring junior designers.</p>`,
      expertise: ["UX Design", "UI Design", "Information Architecture", "Interaction Design", "Usability Testing"],
      courses: [
        { id: "c1", title: `Beginner’s Guide to Design`, image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop", level: "Beginner", hours: 22 },
        { id: "c2", title: `Advanced Interaction Patterns`, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop", level: "Intermediate", hours: 18 },
        { id: "c3", title: `Design Systems in Practice`, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop", level: "Advanced", hours: 30 },
        { id: "c4", title: `Practical Usability Testing`, image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop", level: "Intermediate", hours: 14 },
        { id: "c5", title: `Wireframing to Prototyping`, image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=800&auto=format&fit=crop", level: "Beginner", hours: 10 }
      ]
    });
    const isFollowing = ref(false);
    const bioExpanded = ref(false);
    const activeTags = reactive(/* @__PURE__ */ new Set());
    const levelFilter = ref("All");
    const sortBy = ref("popular");
    const page = ref(1);
    const shortBio = computed(() => {
      const txt = author.bio.replace(/<[^>]+>/g, "");
      return txt.length > 200 ? txt.slice(0, 200) + "…" : txt;
    });
    const filteredCourses = computed(() => {
      let list = [...author.courses];
      if (levelFilter.value !== "All") list = list.filter((c) => c.level === levelFilter.value);
      if (activeTags.size) {
        const words = Array.from(activeTags).map((t) => t.toLowerCase());
        list = list.filter((c) => words.some((w) => c.title.toLowerCase().includes(w)));
      }
      switch (sortBy.value) {
        case "hoursAsc":
          list.sort((a, b) => a.hours - b.hours);
          break;
        case "hoursDesc":
          list.sort((a, b) => b.hours - a.hours);
          break;
        case "titleAsc":
          list.sort((a, b) => a.title.localeCompare(b.title));
          break;
      }
      return list;
    });
    const pagedCourses = computed(() => {
      const start = (page.value - 1) * pageSize;
      return filteredCourses.value.slice(start, start + pageSize);
    });
    const openMessage = ref(false);
    const messageForm = reactive({ subject: "", body: "" });
    function sendMessage() {
      openMessage.value = false;
      messageForm.subject = "";
      messageForm.body = "";
      message.success("Message sent!");
    }
    function toggleFollow() {
      isFollowing.value = !isFollowing.value;
      message.success(isFollowing.value ? "You are now following this instructor" : "Unfollowed");
    }
    function copyProfileLink() {
      (void 0).clipboard?.writeText((void 0).location.href);
      message.success("Profile link copied");
    }
    function onToggleTag(tag) {
      if (activeTags.has(tag)) activeTags.delete(tag);
      else activeTags.add(tag);
      page.value = 1;
    }
    function openCourse(c) {
      message.info(`Open course: ${c.title}`);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_card = resolveComponent("a-card");
      const _component_a_typography_text = resolveComponent("a-typography-text");
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_typography_paragraph = resolveComponent("a-typography-paragraph");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_statistic = resolveComponent("a-statistic");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_dropdown = resolveComponent("a-dropdown");
      const _component_a_menu = resolveComponent("a-menu");
      const _component_a_menu_item = resolveComponent("a-menu-item");
      const _component_a_avatar = resolveComponent("a-avatar");
      const _component_a_checkable_tag = resolveComponent("a-checkable-tag");
      const _component_a_segmented = resolveComponent("a-segmented");
      const _component_a_select = resolveComponent("a-select");
      const _component_a_select_option = resolveComponent("a-select-option");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card_meta = resolveComponent("a-card-meta");
      const _component_a_pagination = resolveComponent("a-pagination");
      const _component_a_drawer = resolveComponent("a-drawer");
      const _component_a_form = resolveComponent("a-form");
      const _component_a_form_item = resolveComponent("a-form-item");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_textarea = resolveComponent("a-textarea");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(`<div class="author-page" data-v-15d4ded5><main class="author-main" data-v-15d4ded5>`);
      _push(ssrRenderComponent(_component_a_card, {
        bordered: false,
        class: "author-header-card"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="author-header" data-v-15d4ded5${_scopeId}><div class="author-meta" data-v-15d4ded5${_scopeId}>`);
            _push2(ssrRenderComponent(_component_a_typography_text, {
              type: "secondary",
              class: "role"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Instructor`);
                } else {
                  return [
                    createTextVNode("Instructor")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_typography_title, {
              level: 2,
              class: "name"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(author.name)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(author.name), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_typography_paragraph, { class: "subtitle" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(author.title)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(author.title), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_space, {
              size: 24,
              wrap: "",
              class: "stats-row"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_statistic, {
                    title: "Total Students",
                    value: author.students
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_statistic, {
                    title: "Reviews",
                    value: author.reviews
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_statistic, {
                    title: "Courses",
                    value: author.courses.length
                  }, null, _parent3, _scopeId2));
                  ssrRenderSlot(_ctx.$slots, "stats-extra", { author }, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    createVNode(_component_a_statistic, {
                      title: "Total Students",
                      value: author.students
                    }, null, 8, ["value"]),
                    createVNode(_component_a_statistic, {
                      title: "Reviews",
                      value: author.reviews
                    }, null, 8, ["value"]),
                    createVNode(_component_a_statistic, {
                      title: "Courses",
                      value: author.courses.length
                    }, null, 8, ["value"]),
                    renderSlot(_ctx.$slots, "stats-extra", { author }, void 0, true)
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_space, {
              class: "actions",
              size: 12,
              wrap: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_button, {
                    type: isFollowing.value ? "primary" : "default",
                    ghost: !isFollowing.value,
                    onClick: toggleFollow,
                    icon: h(isFollowing.value ? unref(CheckOutlined) : unref(UserAddOutlined))
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(isFollowing.value ? "Following" : "Follow")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(isFollowing.value ? "Following" : "Follow"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_button, {
                    onClick: ($event) => openMessage.value = true,
                    icon: h(unref(MailOutlined))
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Message`);
                      } else {
                        return [
                          createTextVNode("Message")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_dropdown, null, {
                    overlay: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_menu, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_menu_item, {
                                key: "link",
                                onClick: copyProfileLink
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Copy profile link`);
                                  } else {
                                    return [
                                      createTextVNode("Copy profile link")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_menu_item, { key: "tweet" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Share on X (Twitter)`);
                                  } else {
                                    return [
                                      createTextVNode("Share on X (Twitter)")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_menu_item, { key: "linkedin" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Share on LinkedIn`);
                                  } else {
                                    return [
                                      createTextVNode("Share on LinkedIn")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_menu_item, {
                                  key: "link",
                                  onClick: copyProfileLink
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Copy profile link")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_menu_item, { key: "tweet" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Share on X (Twitter)")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_menu_item, { key: "linkedin" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Share on LinkedIn")
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
                          createVNode(_component_a_menu, null, {
                            default: withCtx(() => [
                              createVNode(_component_a_menu_item, {
                                key: "link",
                                onClick: copyProfileLink
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Copy profile link")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_menu_item, { key: "tweet" }, {
                                default: withCtx(() => [
                                  createTextVNode("Share on X (Twitter)")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_menu_item, { key: "linkedin" }, {
                                default: withCtx(() => [
                                  createTextVNode("Share on LinkedIn")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_button, {
                          icon: h(unref(ShareAltOutlined))
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Share`);
                            } else {
                              return [
                                createTextVNode("Share")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_button, {
                            icon: h(unref(ShareAltOutlined))
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Share")
                            ]),
                            _: 1
                          }, 8, ["icon"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  ssrRenderSlot(_ctx.$slots, "header-actions", { author }, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    createVNode(_component_a_button, {
                      type: isFollowing.value ? "primary" : "default",
                      ghost: !isFollowing.value,
                      onClick: toggleFollow,
                      icon: h(isFollowing.value ? unref(CheckOutlined) : unref(UserAddOutlined))
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(isFollowing.value ? "Following" : "Follow"), 1)
                      ]),
                      _: 1
                    }, 8, ["type", "ghost", "icon"]),
                    createVNode(_component_a_button, {
                      onClick: ($event) => openMessage.value = true,
                      icon: h(unref(MailOutlined))
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Message")
                      ]),
                      _: 1
                    }, 8, ["onClick", "icon"]),
                    createVNode(_component_a_dropdown, null, {
                      overlay: withCtx(() => [
                        createVNode(_component_a_menu, null, {
                          default: withCtx(() => [
                            createVNode(_component_a_menu_item, {
                              key: "link",
                              onClick: copyProfileLink
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Copy profile link")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, { key: "tweet" }, {
                              default: withCtx(() => [
                                createTextVNode("Share on X (Twitter)")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, { key: "linkedin" }, {
                              default: withCtx(() => [
                                createTextVNode("Share on LinkedIn")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      default: withCtx(() => [
                        createVNode(_component_a_button, {
                          icon: h(unref(ShareAltOutlined))
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Share")
                          ]),
                          _: 1
                        }, 8, ["icon"])
                      ]),
                      _: 1
                    }),
                    renderSlot(_ctx.$slots, "header-actions", { author }, void 0, true)
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            _push2(`</div><div class="author-avatar" data-v-15d4ded5${_scopeId}>`);
            _push2(ssrRenderComponent(_component_a_avatar, {
              size: 160,
              src: author.avatar
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "author-header" }, [
                createVNode("div", { class: "author-meta" }, [
                  createVNode(_component_a_typography_text, {
                    type: "secondary",
                    class: "role"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Instructor")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_typography_title, {
                    level: 2,
                    class: "name"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(author.name), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_typography_paragraph, { class: "subtitle" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(author.title), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_space, {
                    size: 24,
                    wrap: "",
                    class: "stats-row"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_statistic, {
                        title: "Total Students",
                        value: author.students
                      }, null, 8, ["value"]),
                      createVNode(_component_a_statistic, {
                        title: "Reviews",
                        value: author.reviews
                      }, null, 8, ["value"]),
                      createVNode(_component_a_statistic, {
                        title: "Courses",
                        value: author.courses.length
                      }, null, 8, ["value"]),
                      renderSlot(_ctx.$slots, "stats-extra", { author }, void 0, true)
                    ]),
                    _: 3
                  }),
                  createVNode(_component_a_space, {
                    class: "actions",
                    size: 12,
                    wrap: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_button, {
                        type: isFollowing.value ? "primary" : "default",
                        ghost: !isFollowing.value,
                        onClick: toggleFollow,
                        icon: h(isFollowing.value ? unref(CheckOutlined) : unref(UserAddOutlined))
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(isFollowing.value ? "Following" : "Follow"), 1)
                        ]),
                        _: 1
                      }, 8, ["type", "ghost", "icon"]),
                      createVNode(_component_a_button, {
                        onClick: ($event) => openMessage.value = true,
                        icon: h(unref(MailOutlined))
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Message")
                        ]),
                        _: 1
                      }, 8, ["onClick", "icon"]),
                      createVNode(_component_a_dropdown, null, {
                        overlay: withCtx(() => [
                          createVNode(_component_a_menu, null, {
                            default: withCtx(() => [
                              createVNode(_component_a_menu_item, {
                                key: "link",
                                onClick: copyProfileLink
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Copy profile link")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_menu_item, { key: "tweet" }, {
                                default: withCtx(() => [
                                  createTextVNode("Share on X (Twitter)")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_menu_item, { key: "linkedin" }, {
                                default: withCtx(() => [
                                  createTextVNode("Share on LinkedIn")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        default: withCtx(() => [
                          createVNode(_component_a_button, {
                            icon: h(unref(ShareAltOutlined))
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Share")
                            ]),
                            _: 1
                          }, 8, ["icon"])
                        ]),
                        _: 1
                      }),
                      renderSlot(_ctx.$slots, "header-actions", { author }, void 0, true)
                    ]),
                    _: 3
                  })
                ]),
                createVNode("div", { class: "author-avatar" }, [
                  createVNode(_component_a_avatar, {
                    size: 160,
                    src: author.avatar
                  }, null, 8, ["src"])
                ])
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(ssrRenderComponent(_component_a_card, { bordered: true }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_typography_title, { level: 4 }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`About ${ssrInterpolate(author.firstName)}`);
                } else {
                  return [
                    createTextVNode("About " + toDisplayString(author.firstName), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (!bioExpanded.value) {
              _push2(ssrRenderComponent(_component_a_typography_paragraph, { class: "bio" }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_component_a_typography_paragraph, { class: "bio-full" }, null, _parent2, _scopeId));
            }
            _push2(ssrRenderComponent(_component_a_button, {
              type: "link",
              onClick: ($event) => bioExpanded.value = !bioExpanded.value
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(bioExpanded.value ? "Show less" : "Read more")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(bioExpanded.value ? "Show less" : "Read more"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_typography_title, { level: 4 }, {
                default: withCtx(() => [
                  createTextVNode("About " + toDisplayString(author.firstName), 1)
                ]),
                _: 1
              }),
              !bioExpanded.value ? (openBlock(), createBlock(_component_a_typography_paragraph, {
                key: 0,
                innerHTML: shortBio.value,
                class: "bio"
              }, null, 8, ["innerHTML"])) : (openBlock(), createBlock(_component_a_typography_paragraph, {
                key: 1,
                innerHTML: author.bio,
                class: "bio-full"
              }, null, 8, ["innerHTML"])),
              createVNode(_component_a_button, {
                type: "link",
                onClick: ($event) => bioExpanded.value = !bioExpanded.value
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(bioExpanded.value ? "Show less" : "Read more"), 1)
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_card, { bordered: true }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_typography_title, { level: 4 }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Areas of Expertise`);
                } else {
                  return [
                    createTextVNode("Areas of Expertise")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_space, {
              size: [8, 8],
              wrap: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(author.expertise, (tag, i) => {
                    _push3(ssrRenderComponent(_component_a_checkable_tag, {
                      key: i,
                      checked: activeTags.has(tag),
                      onChange: ($event) => onToggleTag(tag)
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(tag)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(tag), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(author.expertise, (tag, i) => {
                      return openBlock(), createBlock(_component_a_checkable_tag, {
                        key: i,
                        checked: activeTags.has(tag),
                        onChange: ($event) => onToggleTag(tag)
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(tag), 1)
                        ]),
                        _: 2
                      }, 1032, ["checked", "onChange"]);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_typography_title, { level: 4 }, {
                default: withCtx(() => [
                  createTextVNode("Areas of Expertise")
                ]),
                _: 1
              }),
              createVNode(_component_a_space, {
                size: [8, 8],
                wrap: ""
              }, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(author.expertise, (tag, i) => {
                    return openBlock(), createBlock(_component_a_checkable_tag, {
                      key: i,
                      checked: activeTags.has(tag),
                      onChange: ($event) => onToggleTag(tag)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(tag), 1)
                      ]),
                      _: 2
                    }, 1032, ["checked", "onChange"]);
                  }), 128))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_a_card, { bordered: true }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="courses-header" data-v-15d4ded5${_scopeId}>`);
            _push2(ssrRenderComponent(_component_a_typography_title, {
              level: 4,
              style: { "margin": "0" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` More Courses by ${ssrInterpolate(author.firstName)}`);
                } else {
                  return [
                    createTextVNode(" More Courses by " + toDisplayString(author.firstName), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_space, {
              size: 12,
              wrap: "",
              class: "toolbar"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_segmented, {
                    value: levelFilter.value,
                    "onUpdate:value": ($event) => levelFilter.value = $event,
                    options: ["All", "Beginner", "Intermediate", "Advanced"]
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_select, {
                    value: sortBy.value,
                    "onUpdate:value": ($event) => sortBy.value = $event,
                    style: { "width": "180px" }
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_select_option, { value: "popular" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Most Popular`);
                            } else {
                              return [
                                createTextVNode("Most Popular")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_select_option, { value: "hoursAsc" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Shortest Duration`);
                            } else {
                              return [
                                createTextVNode("Shortest Duration")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_select_option, { value: "hoursDesc" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Longest Duration`);
                            } else {
                              return [
                                createTextVNode("Longest Duration")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_select_option, { value: "titleAsc" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Title A–Z`);
                            } else {
                              return [
                                createTextVNode("Title A–Z")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_select_option, { value: "popular" }, {
                            default: withCtx(() => [
                              createTextVNode("Most Popular")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "hoursAsc" }, {
                            default: withCtx(() => [
                              createTextVNode("Shortest Duration")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "hoursDesc" }, {
                            default: withCtx(() => [
                              createTextVNode("Longest Duration")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_select_option, { value: "titleAsc" }, {
                            default: withCtx(() => [
                              createTextVNode("Title A–Z")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  ssrRenderSlot(_ctx.$slots, "courses-toolbar-right", { author }, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    createVNode(_component_a_segmented, {
                      value: levelFilter.value,
                      "onUpdate:value": ($event) => levelFilter.value = $event,
                      options: ["All", "Beginner", "Intermediate", "Advanced"]
                    }, null, 8, ["value", "onUpdate:value"]),
                    createVNode(_component_a_select, {
                      value: sortBy.value,
                      "onUpdate:value": ($event) => sortBy.value = $event,
                      style: { "width": "180px" }
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_select_option, { value: "popular" }, {
                          default: withCtx(() => [
                            createTextVNode("Most Popular")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_select_option, { value: "hoursAsc" }, {
                          default: withCtx(() => [
                            createTextVNode("Shortest Duration")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_select_option, { value: "hoursDesc" }, {
                          default: withCtx(() => [
                            createTextVNode("Longest Duration")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_select_option, { value: "titleAsc" }, {
                          default: withCtx(() => [
                            createTextVNode("Title A–Z")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["value", "onUpdate:value"]),
                    renderSlot(_ctx.$slots, "courses-toolbar-right", { author }, void 0, true)
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_a_row, {
              gutter: [16, 16],
              style: { "margin-top": "12px" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(pagedCourses.value, (c) => {
                    _push3(ssrRenderComponent(_component_a_col, {
                      key: c.id,
                      xs: 24,
                      sm: 12,
                      md: 8,
                      lg: 8,
                      xl: 6
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_card, {
                            hoverable: "",
                            class: "course-card",
                            onClick: ($event) => openCourse(c),
                            cover: h("img", { alt: c.title, src: c.image })
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_card_meta, {
                                  title: c.title,
                                  description: `By ${author.name} • ${c.level} • ${c.hours}h`
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_card_meta, {
                                    title: c.title,
                                    description: `By ${author.name} • ${c.level} • ${c.hours}h`
                                  }, null, 8, ["title", "description"])
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_card, {
                              hoverable: "",
                              class: "course-card",
                              onClick: ($event) => openCourse(c),
                              cover: h("img", { alt: c.title, src: c.image })
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card_meta, {
                                  title: c.title,
                                  description: `By ${author.name} • ${c.level} • ${c.hours}h`
                                }, null, 8, ["title", "description"])
                              ]),
                              _: 2
                            }, 1032, ["onClick", "cover"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(pagedCourses.value, (c) => {
                      return openBlock(), createBlock(_component_a_col, {
                        key: c.id,
                        xs: 24,
                        sm: 12,
                        md: 8,
                        lg: 8,
                        xl: 6
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_card, {
                            hoverable: "",
                            class: "course-card",
                            onClick: ($event) => openCourse(c),
                            cover: h("img", { alt: c.title, src: c.image })
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card_meta, {
                                title: c.title,
                                description: `By ${author.name} • ${c.level} • ${c.hours}h`
                              }, null, 8, ["title", "description"])
                            ]),
                            _: 2
                          }, 1032, ["onClick", "cover"])
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="course-actions" data-v-15d4ded5${_scopeId}>`);
            if (filteredCourses.value.length > pageSize) {
              _push2(ssrRenderComponent(_component_a_pagination, {
                current: page.value,
                "onUpdate:current": ($event) => page.value = $event,
                total: filteredCourses.value.length,
                pageSize,
                "show-less-items": ""
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "courses-header" }, [
                createVNode(_component_a_typography_title, {
                  level: 4,
                  style: { "margin": "0" }
                }, {
                  default: withCtx(() => [
                    createTextVNode(" More Courses by " + toDisplayString(author.firstName), 1)
                  ]),
                  _: 1
                }),
                createVNode(_component_a_space, {
                  size: 12,
                  wrap: "",
                  class: "toolbar"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_a_segmented, {
                      value: levelFilter.value,
                      "onUpdate:value": ($event) => levelFilter.value = $event,
                      options: ["All", "Beginner", "Intermediate", "Advanced"]
                    }, null, 8, ["value", "onUpdate:value"]),
                    createVNode(_component_a_select, {
                      value: sortBy.value,
                      "onUpdate:value": ($event) => sortBy.value = $event,
                      style: { "width": "180px" }
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_select_option, { value: "popular" }, {
                          default: withCtx(() => [
                            createTextVNode("Most Popular")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_select_option, { value: "hoursAsc" }, {
                          default: withCtx(() => [
                            createTextVNode("Shortest Duration")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_select_option, { value: "hoursDesc" }, {
                          default: withCtx(() => [
                            createTextVNode("Longest Duration")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_select_option, { value: "titleAsc" }, {
                          default: withCtx(() => [
                            createTextVNode("Title A–Z")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["value", "onUpdate:value"]),
                    renderSlot(_ctx.$slots, "courses-toolbar-right", { author }, void 0, true)
                  ]),
                  _: 3
                })
              ]),
              createVNode(_component_a_row, {
                gutter: [16, 16],
                style: { "margin-top": "12px" }
              }, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(pagedCourses.value, (c) => {
                    return openBlock(), createBlock(_component_a_col, {
                      key: c.id,
                      xs: 24,
                      sm: 12,
                      md: 8,
                      lg: 8,
                      xl: 6
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          hoverable: "",
                          class: "course-card",
                          onClick: ($event) => openCourse(c),
                          cover: h("img", { alt: c.title, src: c.image })
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card_meta, {
                              title: c.title,
                              description: `By ${author.name} • ${c.level} • ${c.hours}h`
                            }, null, 8, ["title", "description"])
                          ]),
                          _: 2
                        }, 1032, ["onClick", "cover"])
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ]),
                _: 1
              }),
              createVNode("div", { class: "course-actions" }, [
                filteredCourses.value.length > pageSize ? (openBlock(), createBlock(_component_a_pagination, {
                  key: 0,
                  current: page.value,
                  "onUpdate:current": ($event) => page.value = $event,
                  total: filteredCourses.value.length,
                  pageSize,
                  "show-less-items": ""
                }, null, 8, ["current", "onUpdate:current", "total"])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_component_a_drawer, {
        open: openMessage.value,
        "onUpdate:open": ($event) => openMessage.value = $event,
        title: "Message the instructor",
        width: "420"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_form, {
              layout: "vertical",
              onFinish: sendMessage
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_form_item, {
                    name: "subject",
                    label: "Subject",
                    rules: [{ required: true, message: "Please enter a subject" }]
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_input, {
                          value: messageForm.subject,
                          "onUpdate:value": ($event) => messageForm.subject = $event,
                          placeholder: "Subject"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_input, {
                            value: messageForm.subject,
                            "onUpdate:value": ($event) => messageForm.subject = $event,
                            placeholder: "Subject"
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_form_item, {
                    name: "body",
                    label: "Message",
                    rules: [{ required: true, message: "Please write a message" }]
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_textarea, {
                          value: messageForm.body,
                          "onUpdate:value": ($event) => messageForm.body = $event,
                          rows: 6,
                          placeholder: "Write your message…"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_textarea, {
                            value: messageForm.body,
                            "onUpdate:value": ($event) => messageForm.body = $event,
                            rows: 6,
                            placeholder: "Write your message…"
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_space, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_button, {
                          onClick: ($event) => openMessage.value = false
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Cancel`);
                            } else {
                              return [
                                createTextVNode("Cancel")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_button, {
                          type: "primary",
                          "html-type": "submit"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Send`);
                            } else {
                              return [
                                createTextVNode("Send")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_button, {
                            onClick: ($event) => openMessage.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(_component_a_button, {
                            type: "primary",
                            "html-type": "submit"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Send")
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
                    createVNode(_component_a_form_item, {
                      name: "subject",
                      label: "Subject",
                      rules: [{ required: true, message: "Please enter a subject" }]
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: messageForm.subject,
                          "onUpdate:value": ($event) => messageForm.subject = $event,
                          placeholder: "Subject"
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, {
                      name: "body",
                      label: "Message",
                      rules: [{ required: true, message: "Please write a message" }]
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_textarea, {
                          value: messageForm.body,
                          "onUpdate:value": ($event) => messageForm.body = $event,
                          rows: 6,
                          placeholder: "Write your message…"
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_space, null, {
                      default: withCtx(() => [
                        createVNode(_component_a_button, {
                          onClick: ($event) => openMessage.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Cancel")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(_component_a_button, {
                          type: "primary",
                          "html-type": "submit"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Send")
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
                onFinish: sendMessage
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_form_item, {
                    name: "subject",
                    label: "Subject",
                    rules: [{ required: true, message: "Please enter a subject" }]
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_input, {
                        value: messageForm.subject,
                        "onUpdate:value": ($event) => messageForm.subject = $event,
                        placeholder: "Subject"
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_form_item, {
                    name: "body",
                    label: "Message",
                    rules: [{ required: true, message: "Please write a message" }]
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_textarea, {
                        value: messageForm.body,
                        "onUpdate:value": ($event) => messageForm.body = $event,
                        rows: 6,
                        placeholder: "Write your message…"
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_space, null, {
                    default: withCtx(() => [
                      createVNode(_component_a_button, {
                        onClick: ($event) => openMessage.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Cancel")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(_component_a_button, {
                        type: "primary",
                        "html-type": "submit"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Send")
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
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/course-author/nuxt/pages/course-author.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const courseAuthor = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-15d4ded5"]]);

export { courseAuthor as default };
//# sourceMappingURL=course-author-Bqq7RFQd.mjs.map
