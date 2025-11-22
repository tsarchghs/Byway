import { defineComponent, computed, ref, watchEffect, resolveComponent, withCtx, createTextVNode, createVNode, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { H as Header } from './Header-DscPRdFw.mjs';
import { message } from 'ant-design-vue';
import { u as useAuth } from './useAuth-B8D9e8en.mjs';
import { useRouter } from 'vue-router';
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
import '@ant-design/icons-vue';
import './useCart-7pxN526Z.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import '@apollo/client/core/index.js';
import '@apollo/client/link/context/index.js';
import '@vue/apollo-composable';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "teach",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuth();
    const user = computed(() => auth.user.value);
    const token = computed(() => auth.token.value);
    const isLoggedIn = computed(() => auth.isLoggedIn.value);
    const currentStep = ref(isLoggedIn.value ? 1 : 0);
    const stepIndex = (type) => isLoggedIn.value ? type === "teacher" ? 1 : type === "complete" ? 2 : 0 : type === "user" ? 0 : type === "teacher" ? 1 : 2;
    const userForm = ref({ name: "", email: "", password: "" });
    async function handleUserSubmit() {
      try {
        const res = await fetch("http://localhost:4000/api/authentication/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
          mutation($email:String!,$password:String!,$name:String){
            register(email:$email, password:$password, firstName:$name) {
              id
              email
              firstName
              token
            }
          }
        `,
            variables: userForm.value
          })
        });
        const json = await res.json();
        const created = json.data?.register;
        if (!created?.id) throw new Error("User registration failed");
        const fakeToken = created.token;
        auth.login({
          token: fakeToken,
          user: { id: created.id, email: created.email, name: created.firstName }
        });
        message.success("Account created! Continue to fill your teacher profile.");
        currentStep.value = 1;
      } catch (err) {
        message.error(err.message || "Account creation failed.");
      }
    }
    const teacherForm = ref({
      bio: "",
      subjects: [],
      avatarUrl: "",
      payoutEmail: ""
    });
    const router = useRouter();
    watchEffect(() => {
      if (isLoggedIn.value && user.value?.teacherProfileId) {
        router.push(`/teach-internal/${user.value.teacherProfileId}`);
      }
    });
    async function handleTeacherSubmit() {
      try {
        if (!token.value) throw new Error("Not authenticated.");
        const formattedSubjects = Array.isArray(teacherForm.value.subjects) ? teacherForm.value.subjects.join(", ") : teacherForm.value.subjects;
        const createRes = await fetch("http://localhost:4000/api/teach/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.value}`
          },
          body: JSON.stringify({
            query: `
          mutation($bio:String!,$subjects:String,$avatarUrl:String,$payoutEmail:String){
            createTeacherProfile(bio:$bio,subjects:$subjects,avatarUrl:$avatarUrl,payoutEmail:$payoutEmail){
              id
            }
          }
        `,
            variables: {
              bio: teacherForm.value.bio,
              subjects: formattedSubjects,
              avatarUrl: teacherForm.value.avatarUrl,
              payoutEmail: teacherForm.value.payoutEmail
            }
          })
        });
        const createdJson = await createRes.json();
        if (createdJson.errors) throw new Error(createdJson.errors[0]?.message);
        const teacherProfileId = createdJson.data?.createTeacherProfile?.id;
        if (!teacherProfileId) throw new Error("Teacher profile ID missing.");
        const linkRes = await fetch("http://localhost:4000/api/authentication/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.value}`
          },
          body: JSON.stringify({
            query: `
          mutation($teacherProfileId:String!){
            updateUserTeacherProfile(teacherProfileId:$teacherProfileId){
              id
              teacherProfileId
            }
          }
        `,
            variables: { teacherProfileId }
          })
        });
        const linkJson = await linkRes.json();
        if (linkJson.errors) throw new Error(linkJson.errors[0]?.message);
        auth.login({
          token: token.value,
          user: {
            ...user.value,
            teacherProfileId
          }
        });
        message.success("Teacher profile created and linked successfully!");
        currentStep.value = 2;
      } catch (err) {
        message.error(err.message || "Failed to save teacher profile.");
      }
    }
    function goToDashboard() {
      const userId = user.value?.id;
      if (!userId) return message.error("Missing user.");
      (void 0).location.href = `http://localhost:3000/teach-internal/${userId}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout_content = resolveComponent("a-layout-content");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_typography_paragraph = resolveComponent("a-typography-paragraph");
      const _component_a_steps = resolveComponent("a-steps");
      const _component_a_step = resolveComponent("a-step");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_form = resolveComponent("a-form");
      const _component_a_form_item = resolveComponent("a-form-item");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_input_password = resolveComponent("a-input-password");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_textarea = resolveComponent("a-textarea");
      const _component_a_select = resolveComponent("a-select");
      const _component_a_result = resolveComponent("a-result");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(ssrRenderComponent(_component_a_layout_content, { class: "teach-page" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="teach-container" data-v-2b22929f${_scopeId}><section class="hero" data-v-2b22929f${_scopeId}>`);
            _push2(ssrRenderComponent(_component_a_row, {
              align: "middle",
              justify: "space-between",
              gutter: "48"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 24,
                    md: 12
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_typography_title, { level: 1 }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Become a Teacher on Byway `);
                            } else {
                              return [
                                createTextVNode(" Become a Teacher on Byway ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_typography_paragraph, { type: "secondary" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Share your knowledge, inspire learners, and grow your teaching career. `);
                            } else {
                              return [
                                createTextVNode(" Share your knowledge, inspire learners, and grow your teaching career. ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_typography_title, { level: 1 }, {
                            default: withCtx(() => [
                              createTextVNode(" Become a Teacher on Byway ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_typography_paragraph, { type: "secondary" }, {
                            default: withCtx(() => [
                              createTextVNode(" Share your knowledge, inspire learners, and grow your teaching career. ")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_col, {
                    xs: 0,
                    md: 12
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<img alt="Teach" class="hero-image" data-v-2b22929f${_scopeId3}>`);
                      } else {
                        return [
                          createVNode("img", {
                            alt: "Teach",
                            class: "hero-image"
                          })
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
                        createVNode(_component_a_typography_title, { level: 1 }, {
                          default: withCtx(() => [
                            createTextVNode(" Become a Teacher on Byway ")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_typography_paragraph, { type: "secondary" }, {
                          default: withCtx(() => [
                            createTextVNode(" Share your knowledge, inspire learners, and grow your teaching career. ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, {
                      xs: 0,
                      md: 12
                    }, {
                      default: withCtx(() => [
                        createVNode("img", {
                          alt: "Teach",
                          class: "hero-image"
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</section><section class="onboard" data-v-2b22929f${_scopeId}>`);
            _push2(ssrRenderComponent(_component_a_steps, {
              current: currentStep.value,
              class: "steps",
              size: "small"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (!isLoggedIn.value) {
                    _push3(ssrRenderComponent(_component_a_step, { title: "User Account" }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(_component_a_step, { title: "Teacher Profile" }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_step, { title: "Complete" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    !isLoggedIn.value ? (openBlock(), createBlock(_component_a_step, {
                      key: 0,
                      title: "User Account"
                    })) : createCommentVNode("", true),
                    createVNode(_component_a_step, { title: "Teacher Profile" }),
                    createVNode(_component_a_step, { title: "Complete" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_card, { class: "form-card" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (currentStep.value === 0 && !isLoggedIn.value) {
                    _push3(`<div data-v-2b22929f${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_a_typography_title, { level: 3 }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Create Your Account`);
                        } else {
                          return [
                            createTextVNode("Create Your Account")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_a_form, {
                      layout: "vertical",
                      model: userForm.value,
                      onFinish: handleUserSubmit
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_form_item, {
                            label: "Full Name",
                            name: "name",
                            required: ""
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_input, {
                                  value: userForm.value.name,
                                  "onUpdate:value": ($event) => userForm.value.name = $event
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_input, {
                                    value: userForm.value.name,
                                    "onUpdate:value": ($event) => userForm.value.name = $event
                                  }, null, 8, ["value", "onUpdate:value"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_form_item, {
                            label: "Email",
                            name: "email",
                            required: ""
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_input, {
                                  type: "email",
                                  value: userForm.value.email,
                                  "onUpdate:value": ($event) => userForm.value.email = $event
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_input, {
                                    type: "email",
                                    value: userForm.value.email,
                                    "onUpdate:value": ($event) => userForm.value.email = $event
                                  }, null, 8, ["value", "onUpdate:value"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_form_item, {
                            label: "Password",
                            name: "password",
                            required: ""
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_input_password, {
                                  value: userForm.value.password,
                                  "onUpdate:value": ($event) => userForm.value.password = $event
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_input_password, {
                                    value: userForm.value.password,
                                    "onUpdate:value": ($event) => userForm.value.password = $event
                                  }, null, 8, ["value", "onUpdate:value"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_button, {
                            type: "primary",
                            "html-type": "submit",
                            block: ""
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Continue`);
                              } else {
                                return [
                                  createTextVNode("Continue")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_form_item, {
                              label: "Full Name",
                              name: "name",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_input, {
                                  value: userForm.value.name,
                                  "onUpdate:value": ($event) => userForm.value.name = $event
                                }, null, 8, ["value", "onUpdate:value"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_form_item, {
                              label: "Email",
                              name: "email",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_input, {
                                  type: "email",
                                  value: userForm.value.email,
                                  "onUpdate:value": ($event) => userForm.value.email = $event
                                }, null, 8, ["value", "onUpdate:value"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_form_item, {
                              label: "Password",
                              name: "password",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_input_password, {
                                  value: userForm.value.password,
                                  "onUpdate:value": ($event) => userForm.value.password = $event
                                }, null, 8, ["value", "onUpdate:value"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_button, {
                              type: "primary",
                              "html-type": "submit",
                              block: ""
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Continue")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (currentStep.value === stepIndex("teacher")) {
                    _push3(`<div data-v-2b22929f${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_a_typography_title, { level: 3 }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Your Teacher Profile`);
                        } else {
                          return [
                            createTextVNode("Your Teacher Profile")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_a_form, {
                      layout: "vertical",
                      model: teacherForm.value,
                      onFinish: handleTeacherSubmit
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_form_item, {
                            label: "Bio",
                            name: "bio",
                            required: ""
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_textarea, {
                                  value: teacherForm.value.bio,
                                  "onUpdate:value": ($event) => teacherForm.value.bio = $event,
                                  rows: "3",
                                  placeholder: "Tell learners about yourself..."
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_textarea, {
                                    value: teacherForm.value.bio,
                                    "onUpdate:value": ($event) => teacherForm.value.bio = $event,
                                    rows: "3",
                                    placeholder: "Tell learners about yourself..."
                                  }, null, 8, ["value", "onUpdate:value"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_form_item, {
                            label: "Subjects",
                            name: "subjects",
                            required: ""
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_select, {
                                  mode: "tags",
                                  placeholder: "e.g. Design, Programming, Marketing",
                                  value: teacherForm.value.subjects,
                                  "onUpdate:value": ($event) => teacherForm.value.subjects = $event
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_select, {
                                    mode: "tags",
                                    placeholder: "e.g. Design, Programming, Marketing",
                                    value: teacherForm.value.subjects,
                                    "onUpdate:value": ($event) => teacherForm.value.subjects = $event
                                  }, null, 8, ["value", "onUpdate:value"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_form_item, {
                            label: "Avatar URL",
                            name: "avatarUrl"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_input, {
                                  value: teacherForm.value.avatarUrl,
                                  "onUpdate:value": ($event) => teacherForm.value.avatarUrl = $event,
                                  placeholder: "https://..."
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_input, {
                                    value: teacherForm.value.avatarUrl,
                                    "onUpdate:value": ($event) => teacherForm.value.avatarUrl = $event,
                                    placeholder: "https://..."
                                  }, null, 8, ["value", "onUpdate:value"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_form_item, {
                            label: "Payout Email",
                            name: "payoutEmail"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_input, {
                                  type: "email",
                                  value: teacherForm.value.payoutEmail,
                                  "onUpdate:value": ($event) => teacherForm.value.payoutEmail = $event,
                                  placeholder: "for receiving earnings"
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_input, {
                                    type: "email",
                                    value: teacherForm.value.payoutEmail,
                                    "onUpdate:value": ($event) => teacherForm.value.payoutEmail = $event,
                                    placeholder: "for receiving earnings"
                                  }, null, 8, ["value", "onUpdate:value"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_button, {
                            type: "primary",
                            "html-type": "submit",
                            block: ""
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` Save &amp; Continue `);
                              } else {
                                return [
                                  createTextVNode(" Save & Continue ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_form_item, {
                              label: "Bio",
                              name: "bio",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_textarea, {
                                  value: teacherForm.value.bio,
                                  "onUpdate:value": ($event) => teacherForm.value.bio = $event,
                                  rows: "3",
                                  placeholder: "Tell learners about yourself..."
                                }, null, 8, ["value", "onUpdate:value"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_form_item, {
                              label: "Subjects",
                              name: "subjects",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_select, {
                                  mode: "tags",
                                  placeholder: "e.g. Design, Programming, Marketing",
                                  value: teacherForm.value.subjects,
                                  "onUpdate:value": ($event) => teacherForm.value.subjects = $event
                                }, null, 8, ["value", "onUpdate:value"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_form_item, {
                              label: "Avatar URL",
                              name: "avatarUrl"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_input, {
                                  value: teacherForm.value.avatarUrl,
                                  "onUpdate:value": ($event) => teacherForm.value.avatarUrl = $event,
                                  placeholder: "https://..."
                                }, null, 8, ["value", "onUpdate:value"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_form_item, {
                              label: "Payout Email",
                              name: "payoutEmail"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_input, {
                                  type: "email",
                                  value: teacherForm.value.payoutEmail,
                                  "onUpdate:value": ($event) => teacherForm.value.payoutEmail = $event,
                                  placeholder: "for receiving earnings"
                                }, null, 8, ["value", "onUpdate:value"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_button, {
                              type: "primary",
                              "html-type": "submit",
                              block: ""
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Save & Continue ")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (currentStep.value === stepIndex("complete")) {
                    _push3(`<div class="done" data-v-2b22929f${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_a_result, {
                      status: "success",
                      title: "You're officially a Byway Instructor!",
                      "sub-title": "Start creating your first course now."
                    }, {
                      extra: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_button, {
                            type: "primary",
                            onClick: goToDashboard
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` Go to Dashboard `);
                              } else {
                                return [
                                  createTextVNode(" Go to Dashboard ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_button, {
                              type: "primary",
                              onClick: goToDashboard
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Go to Dashboard ")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    currentStep.value === 0 && !isLoggedIn.value ? (openBlock(), createBlock("div", { key: 0 }, [
                      createVNode(_component_a_typography_title, { level: 3 }, {
                        default: withCtx(() => [
                          createTextVNode("Create Your Account")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_form, {
                        layout: "vertical",
                        model: userForm.value,
                        onFinish: handleUserSubmit
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_form_item, {
                            label: "Full Name",
                            name: "name",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_input, {
                                value: userForm.value.name,
                                "onUpdate:value": ($event) => userForm.value.name = $event
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_form_item, {
                            label: "Email",
                            name: "email",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_input, {
                                type: "email",
                                value: userForm.value.email,
                                "onUpdate:value": ($event) => userForm.value.email = $event
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_form_item, {
                            label: "Password",
                            name: "password",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_input_password, {
                                value: userForm.value.password,
                                "onUpdate:value": ($event) => userForm.value.password = $event
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, {
                            type: "primary",
                            "html-type": "submit",
                            block: ""
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Continue")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["model"])
                    ])) : createCommentVNode("", true),
                    currentStep.value === stepIndex("teacher") ? (openBlock(), createBlock("div", { key: 1 }, [
                      createVNode(_component_a_typography_title, { level: 3 }, {
                        default: withCtx(() => [
                          createTextVNode("Your Teacher Profile")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_form, {
                        layout: "vertical",
                        model: teacherForm.value,
                        onFinish: handleTeacherSubmit
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_form_item, {
                            label: "Bio",
                            name: "bio",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_textarea, {
                                value: teacherForm.value.bio,
                                "onUpdate:value": ($event) => teacherForm.value.bio = $event,
                                rows: "3",
                                placeholder: "Tell learners about yourself..."
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_form_item, {
                            label: "Subjects",
                            name: "subjects",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_select, {
                                mode: "tags",
                                placeholder: "e.g. Design, Programming, Marketing",
                                value: teacherForm.value.subjects,
                                "onUpdate:value": ($event) => teacherForm.value.subjects = $event
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_form_item, {
                            label: "Avatar URL",
                            name: "avatarUrl"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_input, {
                                value: teacherForm.value.avatarUrl,
                                "onUpdate:value": ($event) => teacherForm.value.avatarUrl = $event,
                                placeholder: "https://..."
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_form_item, {
                            label: "Payout Email",
                            name: "payoutEmail"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_input, {
                                type: "email",
                                value: teacherForm.value.payoutEmail,
                                "onUpdate:value": ($event) => teacherForm.value.payoutEmail = $event,
                                placeholder: "for receiving earnings"
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, {
                            type: "primary",
                            "html-type": "submit",
                            block: ""
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Save & Continue ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["model"])
                    ])) : createCommentVNode("", true),
                    currentStep.value === stepIndex("complete") ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "done"
                    }, [
                      createVNode(_component_a_result, {
                        status: "success",
                        title: "You're officially a Byway Instructor!",
                        "sub-title": "Start creating your first course now."
                      }, {
                        extra: withCtx(() => [
                          createVNode(_component_a_button, {
                            type: "primary",
                            onClick: goToDashboard
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Go to Dashboard ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</section></div>`);
          } else {
            return [
              createVNode("div", { class: "teach-container" }, [
                createVNode("section", { class: "hero" }, [
                  createVNode(_component_a_row, {
                    align: "middle",
                    justify: "space-between",
                    gutter: "48"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_col, {
                        xs: 24,
                        md: 12
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_typography_title, { level: 1 }, {
                            default: withCtx(() => [
                              createTextVNode(" Become a Teacher on Byway ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_typography_paragraph, { type: "secondary" }, {
                            default: withCtx(() => [
                              createTextVNode(" Share your knowledge, inspire learners, and grow your teaching career. ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_col, {
                        xs: 0,
                        md: 12
                      }, {
                        default: withCtx(() => [
                          createVNode("img", {
                            alt: "Teach",
                            class: "hero-image"
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                createVNode("section", { class: "onboard" }, [
                  createVNode(_component_a_steps, {
                    current: currentStep.value,
                    class: "steps",
                    size: "small"
                  }, {
                    default: withCtx(() => [
                      !isLoggedIn.value ? (openBlock(), createBlock(_component_a_step, {
                        key: 0,
                        title: "User Account"
                      })) : createCommentVNode("", true),
                      createVNode(_component_a_step, { title: "Teacher Profile" }),
                      createVNode(_component_a_step, { title: "Complete" })
                    ]),
                    _: 1
                  }, 8, ["current"]),
                  createVNode(_component_a_card, { class: "form-card" }, {
                    default: withCtx(() => [
                      currentStep.value === 0 && !isLoggedIn.value ? (openBlock(), createBlock("div", { key: 0 }, [
                        createVNode(_component_a_typography_title, { level: 3 }, {
                          default: withCtx(() => [
                            createTextVNode("Create Your Account")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_form, {
                          layout: "vertical",
                          model: userForm.value,
                          onFinish: handleUserSubmit
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_form_item, {
                              label: "Full Name",
                              name: "name",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_input, {
                                  value: userForm.value.name,
                                  "onUpdate:value": ($event) => userForm.value.name = $event
                                }, null, 8, ["value", "onUpdate:value"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_form_item, {
                              label: "Email",
                              name: "email",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_input, {
                                  type: "email",
                                  value: userForm.value.email,
                                  "onUpdate:value": ($event) => userForm.value.email = $event
                                }, null, 8, ["value", "onUpdate:value"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_form_item, {
                              label: "Password",
                              name: "password",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_input_password, {
                                  value: userForm.value.password,
                                  "onUpdate:value": ($event) => userForm.value.password = $event
                                }, null, 8, ["value", "onUpdate:value"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_button, {
                              type: "primary",
                              "html-type": "submit",
                              block: ""
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Continue")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["model"])
                      ])) : createCommentVNode("", true),
                      currentStep.value === stepIndex("teacher") ? (openBlock(), createBlock("div", { key: 1 }, [
                        createVNode(_component_a_typography_title, { level: 3 }, {
                          default: withCtx(() => [
                            createTextVNode("Your Teacher Profile")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_form, {
                          layout: "vertical",
                          model: teacherForm.value,
                          onFinish: handleTeacherSubmit
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_form_item, {
                              label: "Bio",
                              name: "bio",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_textarea, {
                                  value: teacherForm.value.bio,
                                  "onUpdate:value": ($event) => teacherForm.value.bio = $event,
                                  rows: "3",
                                  placeholder: "Tell learners about yourself..."
                                }, null, 8, ["value", "onUpdate:value"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_form_item, {
                              label: "Subjects",
                              name: "subjects",
                              required: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_select, {
                                  mode: "tags",
                                  placeholder: "e.g. Design, Programming, Marketing",
                                  value: teacherForm.value.subjects,
                                  "onUpdate:value": ($event) => teacherForm.value.subjects = $event
                                }, null, 8, ["value", "onUpdate:value"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_form_item, {
                              label: "Avatar URL",
                              name: "avatarUrl"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_input, {
                                  value: teacherForm.value.avatarUrl,
                                  "onUpdate:value": ($event) => teacherForm.value.avatarUrl = $event,
                                  placeholder: "https://..."
                                }, null, 8, ["value", "onUpdate:value"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_form_item, {
                              label: "Payout Email",
                              name: "payoutEmail"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_input, {
                                  type: "email",
                                  value: teacherForm.value.payoutEmail,
                                  "onUpdate:value": ($event) => teacherForm.value.payoutEmail = $event,
                                  placeholder: "for receiving earnings"
                                }, null, 8, ["value", "onUpdate:value"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_button, {
                              type: "primary",
                              "html-type": "submit",
                              block: ""
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Save & Continue ")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["model"])
                      ])) : createCommentVNode("", true),
                      currentStep.value === stepIndex("complete") ? (openBlock(), createBlock("div", {
                        key: 2,
                        class: "done"
                      }, [
                        createVNode(_component_a_result, {
                          status: "success",
                          title: "You're officially a Byway Instructor!",
                          "sub-title": "Start creating your first course now."
                        }, {
                          extra: withCtx(() => [
                            createVNode(_component_a_button, {
                              type: "primary",
                              onClick: goToDashboard
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Go to Dashboard ")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ])) : createCommentVNode("", true)
                    ]),
                    _: 1
                  })
                ])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/teach/nuxt/pages/teach.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const teach = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2b22929f"]]);

export { teach as default };
//# sourceMappingURL=teach-CynkrWjE.mjs.map
