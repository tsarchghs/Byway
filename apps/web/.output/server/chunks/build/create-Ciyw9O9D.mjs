import { defineComponent, computed, ref, reactive, watch, nextTick, resolveComponent, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { SaveOutlined, FileAddOutlined, CopyOutlined, MoreOutlined, UploadOutlined, DownloadOutlined, SettingOutlined, CheckOutlined, PlusOutlined, QuestionCircleOutlined, PaperClipOutlined, VideoCameraOutlined, ArrowLeftOutlined, ArrowRightOutlined, ReadOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, EyeOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
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

const teacherName = "Theresa Webb";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const ME_QUERY = gql`
  query Me {
    me { id email roles displayName }
  }
`;
    const { loading: meLoading, error: meError, data: meData, refetch: refetchMe } = useQuery(ME_QUERY);
    computed(() => meData?.me || null);
    const route = useRoute();
    const teacherId = route.params.teacher_id || "unknown";
    const courseId = route.query.course_id || "draft";
    const courseTitle = ref("Advanced Vue 3 Workshop");
    const teacher = { avatar: "/instructors/theresa.jpg" };
    const moduleData = reactive({
      title: "",
      description: "",
      objectives: [],
      isPublic: true,
      unlockAt: null,
      slug: "",
      lessons: []
    });
    const activePanels = ref([]);
    const previewOpen = ref(false);
    const previewData = ref(null);
    const templatesOpen = ref(false);
    const selectedTemplate = ref("video:intro");
    const bulkOpen = ref(false);
    const bulkText = ref("");
    const restored = ref(false);
    const importOpen = ref(false);
    const importText = ref("");
    const exportOpen = ref(false);
    const exportText = ref("");
    const settingsOpen = ref(false);
    const shortcutsOpen = ref(false);
    const settings = reactive({
      defaultDuration: 5,
      warnMissingTitle: true,
      warnZeroDuration: true
    });
    const objectiveSuggestions = [
      { label: "Understand reactivity", value: "Understand reactivity" },
      { label: "Use Composition API", value: "Use Composition API" },
      { label: "Build reusable components", value: "Build reusable components" }
    ];
    const uid = () => Math.random().toString(36).slice(2);
    const readingTime = (text) => {
      if (!text) return 0;
      const words = (text.trim().match(/\S+/g) || []).length;
      return Math.max(1, Math.ceil(words / 200));
    };
    const totalMinutes = computed(
      () => moduleData.lessons.reduce((t, l) => t + (Number(l.duration) || 0), 0)
    );
    const quizzesCount = computed(
      () => moduleData.lessons.filter((l) => l.type === "quiz").length
    );
    const assignmentsCount = computed(
      () => moduleData.lessons.filter((l) => l.type === "assignment").length
    );
    const completenessPct = computed(() => {
      let pct = 0;
      if (moduleData.title) pct += 30;
      if (moduleData.description) pct += 20;
      if (moduleData.lessons.length) {
        const good = moduleData.lessons.filter((l) => l.title && l.duration > 0).length;
        pct += Math.min(50, Math.round(good / Math.max(1, moduleData.lessons.length) * 50));
      }
      return Math.min(100, pct);
    });
    const completenessLabel = computed(() => {
      if (completenessPct.value >= 90) return "Ready to publish";
      if (completenessPct.value >= 60) return "Looking good — a few gaps remain";
      return "Work in progress";
    });
    const panelTitle = (lesson, idx) => `#${idx + 1} · ${lesson.type} · ${lesson.title || "Untitled"} · ${lesson.duration || 0} min`;
    const prereqOptions = (idx) => moduleData.lessons.map((l, i) => ({ label: `#${i + 1} ${l.title || "Untitled"}`, value: l.id })).filter((_, i) => i < idx);
    const safeUrl = (url) => (url || "").trim() || "#";
    const autosaveEnabled = ref(true);
    const lastSavedAt = ref("");
    const draftVersion = ref(1);
    const saveDraft = () => {
    };
    const forceSaveDraft = () => saveDraft();
    const toggleAutosave = () => {
      autosaveEnabled.value = !autosaveEnabled.value;
      message.info(`Autosave ${autosaveEnabled.value ? "enabled" : "disabled"}`);
    };
    let autosaveTimer = null;
    watch(
      moduleData,
      () => {
        if (!autosaveEnabled.value) return;
        clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(() => {
          pushHistory();
        }, 600);
      },
      { deep: true }
    );
    const history = ref([]);
    const historyIndex = ref(-1);
    const canUndo = computed(() => historyIndex.value > 0);
    const canRedo = computed(() => historyIndex.value < history.value.length - 1);
    const snapshot = () => JSON.stringify(moduleData);
    const restoreSnapshot = (s) => Object.assign(moduleData, JSON.parse(s));
    const pushHistory = () => {
      const s = snapshot();
      if (history.value[historyIndex.value] === s) return;
      history.value = history.value.slice(0, historyIndex.value + 1);
      history.value.push(s);
      historyIndex.value = history.value.length - 1;
    };
    const undoChange = () => {
      if (!canUndo.value) return;
      historyIndex.value -= 1;
      restoreSnapshot(history.value[historyIndex.value]);
    };
    const redoChange = () => {
      if (!canRedo.value) return;
      historyIndex.value += 1;
      restoreSnapshot(history.value[historyIndex.value]);
    };
    nextTick(() => pushHistory());
    const openImport = () => {
      importText.value = "";
      importOpen.value = true;
    };
    const confirmImport = () => {
      try {
        const parsed = JSON.parse(importText.value || "{}");
        Object.assign(moduleData, parsed);
        importOpen.value = false;
        expandAll();
        pushHistory();
        message.success("Imported module JSON");
      } catch (e) {
        message.error(`Invalid JSON: ${e?.message || e}`);
      }
    };
    const openExport = () => {
      exportText.value = snapshot();
      exportOpen.value = true;
    };
    const openSettings = () => settingsOpen.value = true;
    const openShortcuts = () => shortcutsOpen.value = true;
    const addLesson = (preset) => {
      const base = {
        id: uid(),
        title: "",
        type: "video",
        duration: settings.defaultDuration,
        content: "",
        videoUrl: "",
        rubric: "",
        resources: [],
        attachments: [],
        tags: [],
        prerequisites: [],
        unlockAt: null,
        quiz: { questions: [] }
      };
      const newLesson = Object.assign(base, preset || {});
      moduleData.lessons.push(newLesson);
      activePanels.value = [.../* @__PURE__ */ new Set([...activePanels.value, newLesson.id])];
      pushHistory();
    };
    const duplicateLesson = (idx) => {
      const copy = JSON.parse(JSON.stringify(moduleData.lessons[idx]));
      copy.id = uid();
      copy.title = copy.title ? `${copy.title} (copy)` : "Untitled (copy)";
      moduleData.lessons.splice(idx + 1, 0, copy);
      activePanels.value = [.../* @__PURE__ */ new Set([...activePanels.value, copy.id])];
      pushHistory();
    };
    const removeLesson = (idx) => {
      moduleData.lessons.splice(idx, 1);
      pushHistory();
    };
    const moveLesson = (idx, dir) => {
      const to = idx + dir;
      if (to < 0 || to >= moduleData.lessons.length) return;
      const [l] = moduleData.lessons.splice(idx, 1);
      moduleData.lessons.splice(to, 0, l);
      pushHistory();
    };
    const addQuizCheckpoint = () => addLesson({
      type: "quiz",
      title: "Checkpoint quiz",
      duration: 8,
      quiz: {
        questions: Array.from({ length: 5 }).map((_, i) => ({
          id: uid(),
          text: `Question ${i + 1}`,
          type: "mcq",
          options: [
            { text: "A", correct: true },
            { text: "B", correct: false }
          ]
        }))
      }
    });
    const addMiniAssignment = () => addLesson({
      type: "assignment",
      title: "Mini assignment",
      duration: 20,
      content: "Build a small feature using today’s concept.",
      rubric: "✅ Completeness, ✅ Correctness, ✅ Clarity"
    });
    const addVideoIntro = () => addLesson({
      type: "video",
      title: "Module intro & goals",
      duration: 6,
      content: "What we will build, key concepts, how to succeed."
    });
    const addReadingConcept = () => addLesson({
      type: "reading",
      title: "Core concepts",
      duration: 10,
      content: "Definitions, examples, pitfalls, and quick checks."
    });
    const addQuestion = (lIdx) => {
      moduleData.lessons[lIdx].quiz?.questions.push({
        id: uid(),
        text: "",
        type: "mcq",
        options: [{ text: "", correct: false }]
      });
      pushHistory();
    };
    const removeQuestion = (lIdx, qIdx) => {
      moduleData.lessons[lIdx].quiz?.questions.splice(qIdx, 1);
      pushHistory();
    };
    const moveQuestion = (lIdx, qIdx, dir) => {
      const qs = moduleData.lessons[lIdx].quiz?.questions || [];
      const to = qIdx + dir;
      if (to < 0 || to >= qs.length) return;
      const [q] = qs.splice(qIdx, 1);
      qs.splice(to, 0, q);
      pushHistory();
    };
    const addOption = (lIdx, qIdx) => {
      moduleData.lessons[lIdx].quiz?.questions[qIdx].options.push({ text: "", correct: false });
      pushHistory();
    };
    const removeOption = (lIdx, qIdx, oIdx) => {
      moduleData.lessons[lIdx].quiz?.questions[qIdx].options.splice(oIdx, 1);
      pushHistory();
    };
    const seedFiveMcq = (lIdx) => {
      const qs = moduleData.lessons[lIdx].quiz?.questions || [];
      for (let i = 0; i < 5; i++) {
        qs.push({
          id: uid(),
          text: `Auto-seeded MCQ ${qs.length + 1}`,
          type: "mcq",
          options: [
            { text: "Option A", correct: true },
            { text: "Option B", correct: false },
            { text: "Option C", correct: false }
          ]
        });
      }
      moduleData.lessons[lIdx].quiz.questions = qs;
      pushHistory();
    };
    const addResource = (lIdx) => {
      moduleData.lessons[lIdx].resources.push({ title: "", url: "" });
      pushHistory();
    };
    const removeResource = (lIdx, rIdx) => {
      moduleData.lessons[lIdx].resources.splice(rIdx, 1);
      pushHistory();
    };
    const expandAll = () => activePanels.value = moduleData.lessons.map((l) => l.id);
    const collapseAll = () => activePanels.value = [];
    const openTemplates = () => templatesOpen.value = true;
    const applyTemplate = () => {
      const [type, key] = selectedTemplate.value.split(":");
      if (type === "video" && key === "intro") {
        addVideoIntro();
      }
      if (type === "reading" && key === "notes") {
        addReadingConcept();
      }
      if (type === "quiz" && key === "checkpoint") {
        addQuizCheckpoint();
      }
      if (type === "assignment" && key === "mini") {
        addMiniAssignment();
      }
      templatesOpen.value = false;
    };
    const openBulkAdd = () => {
      bulkOpen.value = true;
      bulkText.value = "";
    };
    const confirmBulkAdd = () => {
      const lines = bulkText.value.split("\n").map((l) => l.trim()).filter(Boolean);
      for (const line of lines) {
        const [typeRaw, titleRaw, minRaw] = line.split("|").map((s) => (s || "").trim());
        const type = typeRaw?.toLowerCase() || "video";
        const duration = Number(minRaw) || settings.defaultDuration;
        addLesson({ type, title: titleRaw || "Untitled", duration });
      }
      bulkOpen.value = false;
      message.success(`Added ${lines.length} lessons`);
    };
    const saveModule = () => {
      if (!moduleData.title) return message.error("Please add a module title");
      console.log("Saving module payload", { teacherId, courseId, moduleData });
      message.success(`Module "${moduleData.title}" saved`);
      pushHistory();
    };
    const goBack = () => history.back();
    const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const maybeGenerateSlug = () => {
      if (!moduleData.slug && moduleData.title) {
        moduleData.slug = slugify(moduleData.title);
      }
    };
    const warnings = computed(() => {
      const list = [];
      if (!moduleData.title) list.push("Module is missing a title.");
      if (!moduleData.lessons.length) list.push("No lessons — add at least one.");
      if (moduleData.lessons.some((l) => !l.title) && settings.warnMissingTitle) {
        list.push("Some lessons are missing a title.");
      }
      if (moduleData.lessons.some((l) => !l.duration) && settings.warnZeroDuration) {
        list.push("Some lessons have zero duration.");
      }
      return list;
    });
    const hasWarnings = computed(() => warnings.value.length > 0);
    const lessonWarnings = (idx) => {
      const l = moduleData.lessons[idx];
      const result = [];
      if (!l.title && settings.warnMissingTitle) result.push("Missing lesson title");
      if (!l.duration && settings.warnZeroDuration) result.push("Duration is zero");
      if (l.type === "video" && !l.videoUrl) result.push("Video URL is empty");
      if (l.type === "quiz" && !l.quiz?.questions?.length) result.push("Quiz has no questions");
      return result;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_avatar = resolveComponent("a-avatar");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_popover = resolveComponent("a-popover");
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_descriptions = resolveComponent("a-descriptions");
      const _component_a_descriptions_item = resolveComponent("a-descriptions-item");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_badge = resolveComponent("a-badge");
      const _component_a_dropdown = resolveComponent("a-dropdown");
      const _component_a_menu = resolveComponent("a-menu");
      const _component_a_menu_item = resolveComponent("a-menu-item");
      const _component_a_menu_divider = resolveComponent("a-menu-divider");
      const _component_keyboard_outlined = resolveComponent("keyboard-outlined");
      const _component_a_alert = resolveComponent("a-alert");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_typography_text = resolveComponent("a-typography-text");
      const _component_a_progress = resolveComponent("a-progress");
      const _component_a_form = resolveComponent("a-form");
      const _component_a_form_item = resolveComponent("a-form-item");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_textarea = resolveComponent("a-textarea");
      const _component_a_select = resolveComponent("a-select");
      const _component_a_switch = resolveComponent("a-switch");
      const _component_a_date_picker = resolveComponent("a-date-picker");
      const _component_a_divider = resolveComponent("a-divider");
      const _component_a_tooltip = resolveComponent("a-tooltip");
      const _component_a_collapse = resolveComponent("a-collapse");
      const _component_a_collapse_panel = resolveComponent("a-collapse-panel");
      const _component_a_select_option = resolveComponent("a-select-option");
      const _component_a_empty = resolveComponent("a-empty");
      const _component_a_checkbox = resolveComponent("a-checkbox");
      const _component_a_input_number = resolveComponent("a-input-number");
      const _component_a_upload = resolveComponent("a-upload");
      const _component_a_popconfirm = resolveComponent("a-popconfirm");
      const _component_a_modal = resolveComponent("a-modal");
      const _component_a_typography_paragraph = resolveComponent("a-typography-paragraph");
      const _component_a_radio_group = resolveComponent("a-radio-group");
      const _component_a_radio = resolveComponent("a-radio");
      _push(ssrRenderComponent(_component_a_layout, mergeProps({ class: "module-create-layout" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_page_header, {
              title: "Create New Module",
              "sub-title": courseTitle.value,
              class: "page-header",
              onBack: goBack
            }, {
              avatar: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_avatar, {
                    src: teacher.avatar
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_avatar, {
                      src: teacher.avatar
                    }, null, 8, ["src"])
                  ];
                }
              }),
              tags: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_tag, { color: "blue" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Teacher: ${ssrInterpolate(teacherName)}`);
                      } else {
                        return [
                          createTextVNode("Teacher: " + toDisplayString(teacherName))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_tag, { color: "green" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Course: ${ssrInterpolate(unref(courseId))}`);
                      } else {
                        return [
                          createTextVNode("Course: " + toDisplayString(unref(courseId)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_tag, {
                    color: moduleData.isPublic ? "cyan" : "gold"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(moduleData.isPublic ? "Public" : "Private")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(moduleData.isPublic ? "Public" : "Private"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_tag, { color: "blue" }, {
                      default: withCtx(() => [
                        createTextVNode("Teacher: " + toDisplayString(teacherName))
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_tag, { color: "green" }, {
                      default: withCtx(() => [
                        createTextVNode("Course: " + toDisplayString(unref(courseId)), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_tag, {
                      color: moduleData.isPublic ? "cyan" : "gold"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(moduleData.isPublic ? "Public" : "Private"), 1)
                      ]),
                      _: 1
                    }, 8, ["color"])
                  ];
                }
              }),
              extra: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_space, {
                    size: 8,
                    wrap: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_popover, { placement: "bottomRight" }, {
                          content: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div style="${ssrRenderStyle({ "min-width": "260px" })}" data-v-a217beca${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_typography_title, {
                                level: 5,
                                style: { "margin-top": "0" }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Draft`);
                                  } else {
                                    return [
                                      createTextVNode("Draft")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_descriptions, {
                                size: "small",
                                column: 1,
                                bordered: ""
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_descriptions_item, { label: "Autosave" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(autosaveEnabled.value ? "On" : "Off")}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(autosaveEnabled.value ? "On" : "Off"), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_descriptions_item, { label: "Last saved" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(lastSavedAt.value || "—")}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(lastSavedAt.value || "—"), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_descriptions_item, { label: "Version" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(draftVersion.value)}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(draftVersion.value), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_descriptions_item, { label: "Autosave" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(autosaveEnabled.value ? "On" : "Off"), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_descriptions_item, { label: "Last saved" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(lastSavedAt.value || "—"), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_descriptions_item, { label: "Version" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(draftVersion.value), 1)
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_space, { style: { "margin-top": "8px" } }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_button, {
                                      size: "small",
                                      onClick: toggleAutosave
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(autosaveEnabled.value ? "Disable autosave" : "Enable autosave")}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(autosaveEnabled.value ? "Disable autosave" : "Enable autosave"), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_button, {
                                      size: "small",
                                      onClick: forceSaveDraft
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(` Save now `);
                                        } else {
                                          return [
                                            createTextVNode(" Save now ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_button, {
                                        size: "small",
                                        onClick: toggleAutosave
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(autosaveEnabled.value ? "Disable autosave" : "Enable autosave"), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_button, {
                                        size: "small",
                                        onClick: forceSaveDraft
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Save now ")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                            } else {
                              return [
                                createVNode("div", { style: { "min-width": "260px" } }, [
                                  createVNode(_component_a_typography_title, {
                                    level: 5,
                                    style: { "margin-top": "0" }
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Draft")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_descriptions, {
                                    size: "small",
                                    column: 1,
                                    bordered: ""
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_descriptions_item, { label: "Autosave" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(autosaveEnabled.value ? "On" : "Off"), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_descriptions_item, { label: "Last saved" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(lastSavedAt.value || "—"), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_descriptions_item, { label: "Version" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(draftVersion.value), 1)
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_space, { style: { "margin-top": "8px" } }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_button, {
                                        size: "small",
                                        onClick: toggleAutosave
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(autosaveEnabled.value ? "Disable autosave" : "Enable autosave"), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_button, {
                                        size: "small",
                                        onClick: forceSaveDraft
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Save now ")
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
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_badge, {
                                status: autosaveEnabled.value ? "processing" : "default"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_button, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(unref(SaveOutlined), null, null, _parent7, _scopeId6));
                                          _push7(` Draft`);
                                        } else {
                                          return [
                                            createVNode(unref(SaveOutlined)),
                                            createTextVNode(" Draft")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_button, null, {
                                        default: withCtx(() => [
                                          createVNode(unref(SaveOutlined)),
                                          createTextVNode(" Draft")
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
                                createVNode(_component_a_badge, {
                                  status: autosaveEnabled.value ? "processing" : "default"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, null, {
                                      default: withCtx(() => [
                                        createVNode(unref(SaveOutlined)),
                                        createTextVNode(" Draft")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["status"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_button, { onClick: openTemplates }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(FileAddOutlined), null, null, _parent5, _scopeId4));
                              _push5(` Templates`);
                            } else {
                              return [
                                createVNode(unref(FileAddOutlined)),
                                createTextVNode(" Templates")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_button, { onClick: openBulkAdd }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(CopyOutlined), null, null, _parent5, _scopeId4));
                              _push5(` Bulk add`);
                            } else {
                              return [
                                createVNode(unref(CopyOutlined)),
                                createTextVNode(" Bulk add")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_dropdown, null, {
                          overlay: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_menu, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_menu_item, { onClick: openImport }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(unref(UploadOutlined), null, null, _parent7, _scopeId6));
                                          _push7(` Import JSON `);
                                        } else {
                                          return [
                                            createVNode(unref(UploadOutlined)),
                                            createTextVNode(" Import JSON ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_menu_item, { onClick: openExport }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(unref(DownloadOutlined), null, null, _parent7, _scopeId6));
                                          _push7(` Export JSON `);
                                        } else {
                                          return [
                                            createVNode(unref(DownloadOutlined)),
                                            createTextVNode(" Export JSON ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_menu_divider, null, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_menu_item, { onClick: openSettings }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(unref(SettingOutlined), null, null, _parent7, _scopeId6));
                                          _push7(` Settings `);
                                        } else {
                                          return [
                                            createVNode(unref(SettingOutlined)),
                                            createTextVNode(" Settings ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_menu_item, { onClick: openShortcuts }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_keyboard_outlined, null, null, _parent7, _scopeId6));
                                          _push7(` Shortcuts `);
                                        } else {
                                          return [
                                            createVNode(_component_keyboard_outlined),
                                            createTextVNode(" Shortcuts ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_menu_item, { onClick: openImport }, {
                                        default: withCtx(() => [
                                          createVNode(unref(UploadOutlined)),
                                          createTextVNode(" Import JSON ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_menu_item, { onClick: openExport }, {
                                        default: withCtx(() => [
                                          createVNode(unref(DownloadOutlined)),
                                          createTextVNode(" Export JSON ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_menu_divider),
                                      createVNode(_component_a_menu_item, { onClick: openSettings }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SettingOutlined)),
                                          createTextVNode(" Settings ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_menu_item, { onClick: openShortcuts }, {
                                        default: withCtx(() => [
                                          createVNode(_component_keyboard_outlined),
                                          createTextVNode(" Shortcuts ")
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
                                createVNode(_component_a_menu, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_menu_item, { onClick: openImport }, {
                                      default: withCtx(() => [
                                        createVNode(unref(UploadOutlined)),
                                        createTextVNode(" Import JSON ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_menu_item, { onClick: openExport }, {
                                      default: withCtx(() => [
                                        createVNode(unref(DownloadOutlined)),
                                        createTextVNode(" Export JSON ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_menu_divider),
                                    createVNode(_component_a_menu_item, { onClick: openSettings }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SettingOutlined)),
                                        createTextVNode(" Settings ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_menu_item, { onClick: openShortcuts }, {
                                      default: withCtx(() => [
                                        createVNode(_component_keyboard_outlined),
                                        createTextVNode(" Shortcuts ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_button, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(MoreOutlined), null, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(MoreOutlined))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_button, null, {
                                  default: withCtx(() => [
                                    createVNode(unref(MoreOutlined))
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_button, { onClick: saveDraft }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(SaveOutlined), null, null, _parent5, _scopeId4));
                              _push5(` Save draft`);
                            } else {
                              return [
                                createVNode(unref(SaveOutlined)),
                                createTextVNode(" Save draft")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_button, {
                          type: "primary",
                          onClick: saveModule
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(CheckOutlined), null, null, _parent5, _scopeId4));
                              _push5(` Save module`);
                            } else {
                              return [
                                createVNode(unref(CheckOutlined)),
                                createTextVNode(" Save module")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_popover, { placement: "bottomRight" }, {
                            content: withCtx(() => [
                              createVNode("div", { style: { "min-width": "260px" } }, [
                                createVNode(_component_a_typography_title, {
                                  level: 5,
                                  style: { "margin-top": "0" }
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Draft")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions, {
                                  size: "small",
                                  column: 1,
                                  bordered: ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_descriptions_item, { label: "Autosave" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(autosaveEnabled.value ? "On" : "Off"), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "Last saved" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(lastSavedAt.value || "—"), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "Version" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(draftVersion.value), 1)
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_space, { style: { "margin-top": "8px" } }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      size: "small",
                                      onClick: toggleAutosave
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(autosaveEnabled.value ? "Disable autosave" : "Enable autosave"), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_button, {
                                      size: "small",
                                      onClick: forceSaveDraft
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Save now ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ])
                            ]),
                            default: withCtx(() => [
                              createVNode(_component_a_badge, {
                                status: autosaveEnabled.value ? "processing" : "default"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_button, null, {
                                    default: withCtx(() => [
                                      createVNode(unref(SaveOutlined)),
                                      createTextVNode(" Draft")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["status"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, { onClick: openTemplates }, {
                            default: withCtx(() => [
                              createVNode(unref(FileAddOutlined)),
                              createTextVNode(" Templates")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, { onClick: openBulkAdd }, {
                            default: withCtx(() => [
                              createVNode(unref(CopyOutlined)),
                              createTextVNode(" Bulk add")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_dropdown, null, {
                            overlay: withCtx(() => [
                              createVNode(_component_a_menu, null, {
                                default: withCtx(() => [
                                  createVNode(_component_a_menu_item, { onClick: openImport }, {
                                    default: withCtx(() => [
                                      createVNode(unref(UploadOutlined)),
                                      createTextVNode(" Import JSON ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_menu_item, { onClick: openExport }, {
                                    default: withCtx(() => [
                                      createVNode(unref(DownloadOutlined)),
                                      createTextVNode(" Export JSON ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_menu_divider),
                                  createVNode(_component_a_menu_item, { onClick: openSettings }, {
                                    default: withCtx(() => [
                                      createVNode(unref(SettingOutlined)),
                                      createTextVNode(" Settings ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_menu_item, { onClick: openShortcuts }, {
                                    default: withCtx(() => [
                                      createVNode(_component_keyboard_outlined),
                                      createTextVNode(" Shortcuts ")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            default: withCtx(() => [
                              createVNode(_component_a_button, null, {
                                default: withCtx(() => [
                                  createVNode(unref(MoreOutlined))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, { onClick: saveDraft }, {
                            default: withCtx(() => [
                              createVNode(unref(SaveOutlined)),
                              createTextVNode(" Save draft")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, {
                            type: "primary",
                            onClick: saveModule
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(CheckOutlined)),
                              createTextVNode(" Save module")
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
                    createVNode(_component_a_space, {
                      size: 8,
                      wrap: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_popover, { placement: "bottomRight" }, {
                          content: withCtx(() => [
                            createVNode("div", { style: { "min-width": "260px" } }, [
                              createVNode(_component_a_typography_title, {
                                level: 5,
                                style: { "margin-top": "0" }
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Draft")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_descriptions, {
                                size: "small",
                                column: 1,
                                bordered: ""
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_descriptions_item, { label: "Autosave" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(autosaveEnabled.value ? "On" : "Off"), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_descriptions_item, { label: "Last saved" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(lastSavedAt.value || "—"), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_descriptions_item, { label: "Version" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(draftVersion.value), 1)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_space, { style: { "margin-top": "8px" } }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_button, {
                                    size: "small",
                                    onClick: toggleAutosave
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(autosaveEnabled.value ? "Disable autosave" : "Enable autosave"), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_button, {
                                    size: "small",
                                    onClick: forceSaveDraft
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Save now ")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          default: withCtx(() => [
                            createVNode(_component_a_badge, {
                              status: autosaveEnabled.value ? "processing" : "default"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_button, null, {
                                  default: withCtx(() => [
                                    createVNode(unref(SaveOutlined)),
                                    createTextVNode(" Draft")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["status"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_button, { onClick: openTemplates }, {
                          default: withCtx(() => [
                            createVNode(unref(FileAddOutlined)),
                            createTextVNode(" Templates")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_button, { onClick: openBulkAdd }, {
                          default: withCtx(() => [
                            createVNode(unref(CopyOutlined)),
                            createTextVNode(" Bulk add")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_dropdown, null, {
                          overlay: withCtx(() => [
                            createVNode(_component_a_menu, null, {
                              default: withCtx(() => [
                                createVNode(_component_a_menu_item, { onClick: openImport }, {
                                  default: withCtx(() => [
                                    createVNode(unref(UploadOutlined)),
                                    createTextVNode(" Import JSON ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_menu_item, { onClick: openExport }, {
                                  default: withCtx(() => [
                                    createVNode(unref(DownloadOutlined)),
                                    createTextVNode(" Export JSON ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_menu_divider),
                                createVNode(_component_a_menu_item, { onClick: openSettings }, {
                                  default: withCtx(() => [
                                    createVNode(unref(SettingOutlined)),
                                    createTextVNode(" Settings ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_menu_item, { onClick: openShortcuts }, {
                                  default: withCtx(() => [
                                    createVNode(_component_keyboard_outlined),
                                    createTextVNode(" Shortcuts ")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          default: withCtx(() => [
                            createVNode(_component_a_button, null, {
                              default: withCtx(() => [
                                createVNode(unref(MoreOutlined))
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_button, { onClick: saveDraft }, {
                          default: withCtx(() => [
                            createVNode(unref(SaveOutlined)),
                            createTextVNode(" Save draft")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_button, {
                          type: "primary",
                          onClick: saveModule
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(CheckOutlined)),
                            createTextVNode(" Save module")
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
            if (restored.value) {
              _push2(`<div class="restore" data-v-a217beca${_scopeId}>`);
              _push2(ssrRenderComponent(_component_a_alert, {
                type: "info",
                "show-icon": "",
                message: "Draft restored",
                description: "We found a saved draft for this module and restored it.",
                closable: "",
                onClose: ($event) => restored.value = false
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_a_card, {
              class: "progress-card",
              bordered: false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_row, {
                    gutter: 16,
                    align: "middle"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_col, {
                          xs: 24,
                          md: 12
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_space, {
                                direction: "vertical",
                                style: { "width": "100%" }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_typography_text, { type: "secondary" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Completeness`);
                                        } else {
                                          return [
                                            createTextVNode("Completeness")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_progress, {
                                      percent: completenessPct.value,
                                      status: completenessPct.value >= 90 ? "success" : completenessPct.value >= 60 ? "normal" : "active"
                                    }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_typography_text, { type: "secondary" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(completenessLabel.value)}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(completenessLabel.value), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_typography_text, { type: "secondary" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Completeness")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_progress, {
                                        percent: completenessPct.value,
                                        status: completenessPct.value >= 90 ? "success" : completenessPct.value >= 60 ? "normal" : "active"
                                      }, null, 8, ["percent", "status"]),
                                      createVNode(_component_a_typography_text, { type: "secondary" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(completenessLabel.value), 1)
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
                                createVNode(_component_a_space, {
                                  direction: "vertical",
                                  style: { "width": "100%" }
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_typography_text, { type: "secondary" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Completeness")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_progress, {
                                      percent: completenessPct.value,
                                      status: completenessPct.value >= 90 ? "success" : completenessPct.value >= 60 ? "normal" : "active"
                                    }, null, 8, ["percent", "status"]),
                                    createVNode(_component_a_typography_text, { type: "secondary" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(completenessLabel.value), 1)
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
                        _push4(ssrRenderComponent(_component_a_col, {
                          xs: 24,
                          md: 12
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_space, {
                                direction: "vertical",
                                style: { "width": "100%" }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_typography_text, { type: "secondary" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Totals`);
                                        } else {
                                          return [
                                            createTextVNode("Totals")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`<div class="totals" data-v-a217beca${_scopeId5}>`);
                                    _push6(ssrRenderComponent(_component_a_tag, { color: "blue" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Lessons: ${ssrInterpolate(moduleData.lessons.length)}`);
                                        } else {
                                          return [
                                            createTextVNode("Lessons: " + toDisplayString(moduleData.lessons.length), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_tag, { color: "purple" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Minutes: ${ssrInterpolate(totalMinutes.value)}`);
                                        } else {
                                          return [
                                            createTextVNode("Minutes: " + toDisplayString(totalMinutes.value), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_tag, { color: "volcano" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Quizzes: ${ssrInterpolate(quizzesCount.value)}`);
                                        } else {
                                          return [
                                            createTextVNode("Quizzes: " + toDisplayString(quizzesCount.value), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_tag, { color: "geekblue" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Assignments: ${ssrInterpolate(assignmentsCount.value)}`);
                                        } else {
                                          return [
                                            createTextVNode("Assignments: " + toDisplayString(assignmentsCount.value), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    if (hasWarnings.value) {
                                      _push6(ssrRenderComponent(_component_a_tag, { color: "orange" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`Warnings: ${ssrInterpolate(warnings.value.length)}`);
                                          } else {
                                            return [
                                              createTextVNode("Warnings: " + toDisplayString(warnings.value.length), 1)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                    _push6(`</div>`);
                                  } else {
                                    return [
                                      createVNode(_component_a_typography_text, { type: "secondary" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Totals")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("div", { class: "totals" }, [
                                        createVNode(_component_a_tag, { color: "blue" }, {
                                          default: withCtx(() => [
                                            createTextVNode("Lessons: " + toDisplayString(moduleData.lessons.length), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_tag, { color: "purple" }, {
                                          default: withCtx(() => [
                                            createTextVNode("Minutes: " + toDisplayString(totalMinutes.value), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_tag, { color: "volcano" }, {
                                          default: withCtx(() => [
                                            createTextVNode("Quizzes: " + toDisplayString(quizzesCount.value), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_tag, { color: "geekblue" }, {
                                          default: withCtx(() => [
                                            createTextVNode("Assignments: " + toDisplayString(assignmentsCount.value), 1)
                                          ]),
                                          _: 1
                                        }),
                                        hasWarnings.value ? (openBlock(), createBlock(_component_a_tag, {
                                          key: 0,
                                          color: "orange"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Warnings: " + toDisplayString(warnings.value.length), 1)
                                          ]),
                                          _: 1
                                        })) : createCommentVNode("", true)
                                      ])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_space, {
                                  direction: "vertical",
                                  style: { "width": "100%" }
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_typography_text, { type: "secondary" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Totals")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("div", { class: "totals" }, [
                                      createVNode(_component_a_tag, { color: "blue" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Lessons: " + toDisplayString(moduleData.lessons.length), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_tag, { color: "purple" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Minutes: " + toDisplayString(totalMinutes.value), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_tag, { color: "volcano" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Quizzes: " + toDisplayString(quizzesCount.value), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_tag, { color: "geekblue" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Assignments: " + toDisplayString(assignmentsCount.value), 1)
                                        ]),
                                        _: 1
                                      }),
                                      hasWarnings.value ? (openBlock(), createBlock(_component_a_tag, {
                                        key: 0,
                                        color: "orange"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Warnings: " + toDisplayString(warnings.value.length), 1)
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true)
                                    ])
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
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 12
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_space, {
                                direction: "vertical",
                                style: { "width": "100%" }
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_typography_text, { type: "secondary" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Completeness")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_progress, {
                                    percent: completenessPct.value,
                                    status: completenessPct.value >= 90 ? "success" : completenessPct.value >= 60 ? "normal" : "active"
                                  }, null, 8, ["percent", "status"]),
                                  createVNode(_component_a_typography_text, { type: "secondary" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(completenessLabel.value), 1)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 12
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_space, {
                                direction: "vertical",
                                style: { "width": "100%" }
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_typography_text, { type: "secondary" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Totals")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("div", { class: "totals" }, [
                                    createVNode(_component_a_tag, { color: "blue" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Lessons: " + toDisplayString(moduleData.lessons.length), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_tag, { color: "purple" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Minutes: " + toDisplayString(totalMinutes.value), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_tag, { color: "volcano" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Quizzes: " + toDisplayString(quizzesCount.value), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_tag, { color: "geekblue" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Assignments: " + toDisplayString(assignmentsCount.value), 1)
                                      ]),
                                      _: 1
                                    }),
                                    hasWarnings.value ? (openBlock(), createBlock(_component_a_tag, {
                                      key: 0,
                                      color: "orange"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Warnings: " + toDisplayString(warnings.value.length), 1)
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true)
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_row, {
                      gutter: 16,
                      align: "middle"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_col, {
                          xs: 24,
                          md: 12
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_space, {
                              direction: "vertical",
                              style: { "width": "100%" }
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_typography_text, { type: "secondary" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Completeness")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_progress, {
                                  percent: completenessPct.value,
                                  status: completenessPct.value >= 90 ? "success" : completenessPct.value >= 60 ? "normal" : "active"
                                }, null, 8, ["percent", "status"]),
                                createVNode(_component_a_typography_text, { type: "secondary" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(completenessLabel.value), 1)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_col, {
                          xs: 24,
                          md: 12
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_space, {
                              direction: "vertical",
                              style: { "width": "100%" }
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_typography_text, { type: "secondary" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Totals")
                                  ]),
                                  _: 1
                                }),
                                createVNode("div", { class: "totals" }, [
                                  createVNode(_component_a_tag, { color: "blue" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Lessons: " + toDisplayString(moduleData.lessons.length), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_tag, { color: "purple" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Minutes: " + toDisplayString(totalMinutes.value), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_tag, { color: "volcano" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Quizzes: " + toDisplayString(quizzesCount.value), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_tag, { color: "geekblue" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Assignments: " + toDisplayString(assignmentsCount.value), 1)
                                    ]),
                                    _: 1
                                  }),
                                  hasWarnings.value ? (openBlock(), createBlock(_component_a_tag, {
                                    key: 0,
                                    color: "orange"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Warnings: " + toDisplayString(warnings.value.length), 1)
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true)
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
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_card, {
              class: "form-card",
              bordered: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_form, {
                    layout: "vertical",
                    model: moduleData
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_form_item, {
                          label: "Module Title",
                          name: "title",
                          rules: [{ required: true, message: "Title is required" }],
                          "validate-status": moduleData.title ? "" : "warning",
                          help: !moduleData.title ? "A strong, student-focused title helps discoverability." : ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_input, {
                                value: moduleData.title,
                                "onUpdate:value": ($event) => moduleData.title = $event,
                                placeholder: "e.g. Composition API Basics",
                                onBlur: maybeGenerateSlug
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_input, {
                                  value: moduleData.title,
                                  "onUpdate:value": ($event) => moduleData.title = $event,
                                  placeholder: "e.g. Composition API Basics",
                                  onBlur: maybeGenerateSlug
                                }, null, 8, ["value", "onUpdate:value"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_row, { gutter: 16 }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_col, {
                                xs: 24,
                                md: 16
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_form_item, { label: "Description" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_textarea, {
                                            value: moduleData.description,
                                            "onUpdate:value": ($event) => moduleData.description = $event,
                                            rows: "3",
                                            placeholder: "What will students learn in this module?"
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_textarea, {
                                              value: moduleData.description,
                                              "onUpdate:value": ($event) => moduleData.description = $event,
                                              rows: "3",
                                              placeholder: "What will students learn in this module?"
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_form_item, { label: "Learning Objectives (tags)" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_select, {
                                            value: moduleData.objectives,
                                            "onUpdate:value": ($event) => moduleData.objectives = $event,
                                            mode: "tags",
                                            placeholder: "Add objectives (press Enter)",
                                            "token-separators": [","],
                                            options: objectiveSuggestions
                                          }, null, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_typography_text, { type: "secondary" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(` Tip: Keep objectives measurable and concise. `);
                                              } else {
                                                return [
                                                  createTextVNode(" Tip: Keep objectives measurable and concise. ")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_select, {
                                              value: moduleData.objectives,
                                              "onUpdate:value": ($event) => moduleData.objectives = $event,
                                              mode: "tags",
                                              placeholder: "Add objectives (press Enter)",
                                              "token-separators": [","],
                                              options: objectiveSuggestions
                                            }, null, 8, ["value", "onUpdate:value"]),
                                            createVNode(_component_a_typography_text, { type: "secondary" }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Tip: Keep objectives measurable and concise. ")
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
                                      createVNode(_component_a_form_item, { label: "Description" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_textarea, {
                                            value: moduleData.description,
                                            "onUpdate:value": ($event) => moduleData.description = $event,
                                            rows: "3",
                                            placeholder: "What will students learn in this module?"
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, { label: "Learning Objectives (tags)" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_select, {
                                            value: moduleData.objectives,
                                            "onUpdate:value": ($event) => moduleData.objectives = $event,
                                            mode: "tags",
                                            placeholder: "Add objectives (press Enter)",
                                            "token-separators": [","],
                                            options: objectiveSuggestions
                                          }, null, 8, ["value", "onUpdate:value"]),
                                          createVNode(_component_a_typography_text, { type: "secondary" }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Tip: Keep objectives measurable and concise. ")
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
                              _push5(ssrRenderComponent(_component_a_col, {
                                xs: 24,
                                md: 8
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_form_item, { label: "Visibility" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_switch, {
                                            checked: moduleData.isPublic,
                                            "onUpdate:checked": ($event) => moduleData.isPublic = $event,
                                            "checked-children": "Public",
                                            "un-checked-children": "Private"
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_switch, {
                                              checked: moduleData.isPublic,
                                              "onUpdate:checked": ($event) => moduleData.isPublic = $event,
                                              "checked-children": "Public",
                                              "un-checked-children": "Private"
                                            }, null, 8, ["checked", "onUpdate:checked"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_form_item, { label: "Module Availability" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_date_picker, {
                                            value: moduleData.unlockAt,
                                            "onUpdate:value": ($event) => moduleData.unlockAt = $event,
                                            "show-time": "",
                                            style: { "width": "100%" },
                                            placeholder: "Optional unlock date/time"
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_date_picker, {
                                              value: moduleData.unlockAt,
                                              "onUpdate:value": ($event) => moduleData.unlockAt = $event,
                                              "show-time": "",
                                              style: { "width": "100%" },
                                              placeholder: "Optional unlock date/time"
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_form_item, { label: "Module Slug (URL)" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_input, {
                                            value: moduleData.slug,
                                            "onUpdate:value": ($event) => moduleData.slug = $event,
                                            placeholder: "auto-generated-from-title"
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_input, {
                                              value: moduleData.slug,
                                              "onUpdate:value": ($event) => moduleData.slug = $event,
                                              placeholder: "auto-generated-from-title"
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_form_item, { label: "Visibility" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_switch, {
                                            checked: moduleData.isPublic,
                                            "onUpdate:checked": ($event) => moduleData.isPublic = $event,
                                            "checked-children": "Public",
                                            "un-checked-children": "Private"
                                          }, null, 8, ["checked", "onUpdate:checked"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, { label: "Module Availability" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_date_picker, {
                                            value: moduleData.unlockAt,
                                            "onUpdate:value": ($event) => moduleData.unlockAt = $event,
                                            "show-time": "",
                                            style: { "width": "100%" },
                                            placeholder: "Optional unlock date/time"
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, { label: "Module Slug (URL)" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_input, {
                                            value: moduleData.slug,
                                            "onUpdate:value": ($event) => moduleData.slug = $event,
                                            placeholder: "auto-generated-from-title"
                                          }, null, 8, ["value", "onUpdate:value"])
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
                                  md: 16
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_form_item, { label: "Description" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_textarea, {
                                          value: moduleData.description,
                                          "onUpdate:value": ($event) => moduleData.description = $event,
                                          rows: "3",
                                          placeholder: "What will students learn in this module?"
                                        }, null, 8, ["value", "onUpdate:value"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_form_item, { label: "Learning Objectives (tags)" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_select, {
                                          value: moduleData.objectives,
                                          "onUpdate:value": ($event) => moduleData.objectives = $event,
                                          mode: "tags",
                                          placeholder: "Add objectives (press Enter)",
                                          "token-separators": [","],
                                          options: objectiveSuggestions
                                        }, null, 8, ["value", "onUpdate:value"]),
                                        createVNode(_component_a_typography_text, { type: "secondary" }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Tip: Keep objectives measurable and concise. ")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_col, {
                                  xs: 24,
                                  md: 8
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_form_item, { label: "Visibility" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_switch, {
                                          checked: moduleData.isPublic,
                                          "onUpdate:checked": ($event) => moduleData.isPublic = $event,
                                          "checked-children": "Public",
                                          "un-checked-children": "Private"
                                        }, null, 8, ["checked", "onUpdate:checked"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_form_item, { label: "Module Availability" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_date_picker, {
                                          value: moduleData.unlockAt,
                                          "onUpdate:value": ($event) => moduleData.unlockAt = $event,
                                          "show-time": "",
                                          style: { "width": "100%" },
                                          placeholder: "Optional unlock date/time"
                                        }, null, 8, ["value", "onUpdate:value"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_form_item, { label: "Module Slug (URL)" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_input, {
                                          value: moduleData.slug,
                                          "onUpdate:value": ($event) => moduleData.slug = $event,
                                          placeholder: "auto-generated-from-title"
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
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_divider, { orientation: "left" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Lessons <span class="muted" data-v-a217beca${_scopeId4}>(${ssrInterpolate(moduleData.lessons.length)})</span>`);
                            } else {
                              return [
                                createTextVNode(" Lessons "),
                                createVNode("span", { class: "muted" }, "(" + toDisplayString(moduleData.lessons.length) + ")", 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_space, {
                          style: { "margin-bottom": "12px" },
                          wrap: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_button, {
                                type: "dashed",
                                onClick: ($event) => addLesson()
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(PlusOutlined), null, null, _parent6, _scopeId5));
                                    _push6(` Add lesson `);
                                  } else {
                                    return [
                                      createVNode(unref(PlusOutlined)),
                                      createTextVNode(" Add lesson ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_button, { onClick: expandAll }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Expand all`);
                                  } else {
                                    return [
                                      createTextVNode("Expand all")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_button, { onClick: collapseAll }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Collapse all`);
                                  } else {
                                    return [
                                      createTextVNode("Collapse all")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_button, { onClick: addQuizCheckpoint }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(QuestionCircleOutlined), null, null, _parent6, _scopeId5));
                                    _push6(` Add checkpoint quiz `);
                                  } else {
                                    return [
                                      createVNode(unref(QuestionCircleOutlined)),
                                      createTextVNode(" Add checkpoint quiz ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_button, { onClick: addMiniAssignment }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(PaperClipOutlined), null, null, _parent6, _scopeId5));
                                    _push6(` Add mini assignment `);
                                  } else {
                                    return [
                                      createVNode(unref(PaperClipOutlined)),
                                      createTextVNode(" Add mini assignment ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_button, { onClick: addVideoIntro }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(VideoCameraOutlined), null, null, _parent6, _scopeId5));
                                    _push6(` Add intro video `);
                                  } else {
                                    return [
                                      createVNode(unref(VideoCameraOutlined)),
                                      createTextVNode(" Add intro video ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_tag, { color: "blue" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Total time: ${ssrInterpolate(totalMinutes.value)} min`);
                                  } else {
                                    return [
                                      createTextVNode("Total time: " + toDisplayString(totalMinutes.value) + " min", 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_button, {
                                  type: "dashed",
                                  onClick: ($event) => addLesson()
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(PlusOutlined)),
                                    createTextVNode(" Add lesson ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"]),
                                createVNode(_component_a_button, { onClick: expandAll }, {
                                  default: withCtx(() => [
                                    createTextVNode("Expand all")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_button, { onClick: collapseAll }, {
                                  default: withCtx(() => [
                                    createTextVNode("Collapse all")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_button, { onClick: addQuizCheckpoint }, {
                                  default: withCtx(() => [
                                    createVNode(unref(QuestionCircleOutlined)),
                                    createTextVNode(" Add checkpoint quiz ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_button, { onClick: addMiniAssignment }, {
                                  default: withCtx(() => [
                                    createVNode(unref(PaperClipOutlined)),
                                    createTextVNode(" Add mini assignment ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_button, { onClick: addVideoIntro }, {
                                  default: withCtx(() => [
                                    createVNode(unref(VideoCameraOutlined)),
                                    createTextVNode(" Add intro video ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_tag, { color: "blue" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Total time: " + toDisplayString(totalMinutes.value) + " min", 1)
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_space, { style: { "margin-bottom": "12px" } }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_tooltip, { title: "Undo (Ctrl/Cmd+Z)" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_button, {
                                      disabled: !canUndo.value,
                                      onClick: undoChange
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(unref(ArrowLeftOutlined), null, null, _parent7, _scopeId6));
                                          _push7(` Undo `);
                                        } else {
                                          return [
                                            createVNode(unref(ArrowLeftOutlined)),
                                            createTextVNode(" Undo ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_button, {
                                        disabled: !canUndo.value,
                                        onClick: undoChange
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(ArrowLeftOutlined)),
                                          createTextVNode(" Undo ")
                                        ]),
                                        _: 1
                                      }, 8, ["disabled"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_tooltip, { title: "Redo (Ctrl/Cmd+Shift+Z)" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_button, {
                                      disabled: !canRedo.value,
                                      onClick: redoChange
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(unref(ArrowRightOutlined), null, null, _parent7, _scopeId6));
                                          _push7(` Redo `);
                                        } else {
                                          return [
                                            createVNode(unref(ArrowRightOutlined)),
                                            createTextVNode(" Redo ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_button, {
                                        disabled: !canRedo.value,
                                        onClick: redoChange
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(ArrowRightOutlined)),
                                          createTextVNode(" Redo ")
                                        ]),
                                        _: 1
                                      }, 8, ["disabled"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_divider, { type: "vertical" }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_typography_text, { type: "secondary" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`History: ${ssrInterpolate(historyIndex.value + 1)} / ${ssrInterpolate(history.value.length)}`);
                                  } else {
                                    return [
                                      createTextVNode("History: " + toDisplayString(historyIndex.value + 1) + " / " + toDisplayString(history.value.length), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_tooltip, { title: "Undo (Ctrl/Cmd+Z)" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      disabled: !canUndo.value,
                                      onClick: undoChange
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(ArrowLeftOutlined)),
                                        createTextVNode(" Undo ")
                                      ]),
                                      _: 1
                                    }, 8, ["disabled"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_tooltip, { title: "Redo (Ctrl/Cmd+Shift+Z)" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      disabled: !canRedo.value,
                                      onClick: redoChange
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(ArrowRightOutlined)),
                                        createTextVNode(" Redo ")
                                      ]),
                                      _: 1
                                    }, 8, ["disabled"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_divider, { type: "vertical" }),
                                createVNode(_component_a_typography_text, { type: "secondary" }, {
                                  default: withCtx(() => [
                                    createTextVNode("History: " + toDisplayString(historyIndex.value + 1) + " / " + toDisplayString(history.value.length), 1)
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_collapse, {
                          activeKey: activePanels.value,
                          "onUpdate:activeKey": ($event) => activePanels.value = $event
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(moduleData.lessons, (lesson, idx) => {
                                _push5(ssrRenderComponent(_component_a_collapse_panel, {
                                  key: lesson.id,
                                  header: panelTitle(lesson, idx)
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_row, { gutter: 16 }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_col, {
                                              xs: 24,
                                              md: 16
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_a_form, { layout: "vertical" }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(_component_a_form_item, {
                                                          label: "Title",
                                                          rules: [{ required: true, message: "Lesson title is required" }]
                                                        }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(_component_a_input, {
                                                                value: lesson.title,
                                                                "onUpdate:value": ($event) => lesson.title = $event,
                                                                placeholder: "e.g. Reactive primitives"
                                                              }, null, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(_component_a_input, {
                                                                  value: lesson.title,
                                                                  "onUpdate:value": ($event) => lesson.title = $event,
                                                                  placeholder: "e.g. Reactive primitives"
                                                                }, null, 8, ["value", "onUpdate:value"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(_component_a_form_item, { label: "Type" }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(_component_a_select, {
                                                                value: lesson.type,
                                                                "onUpdate:value": ($event) => lesson.type = $event,
                                                                style: { "width": "100%" }
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(_component_a_select_option, { value: "video" }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(ssrRenderComponent(unref(VideoCameraOutlined), null, null, _parent12, _scopeId11));
                                                                          _push12(` Video `);
                                                                        } else {
                                                                          return [
                                                                            createVNode(unref(VideoCameraOutlined)),
                                                                            createTextVNode(" Video ")
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 2
                                                                    }, _parent11, _scopeId10));
                                                                    _push11(ssrRenderComponent(_component_a_select_option, { value: "reading" }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(ssrRenderComponent(unref(ReadOutlined), null, null, _parent12, _scopeId11));
                                                                          _push12(` Reading `);
                                                                        } else {
                                                                          return [
                                                                            createVNode(unref(ReadOutlined)),
                                                                            createTextVNode(" Reading ")
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 2
                                                                    }, _parent11, _scopeId10));
                                                                    _push11(ssrRenderComponent(_component_a_select_option, { value: "quiz" }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(ssrRenderComponent(unref(QuestionCircleOutlined), null, null, _parent12, _scopeId11));
                                                                          _push12(` Quiz `);
                                                                        } else {
                                                                          return [
                                                                            createVNode(unref(QuestionCircleOutlined)),
                                                                            createTextVNode(" Quiz ")
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 2
                                                                    }, _parent11, _scopeId10));
                                                                    _push11(ssrRenderComponent(_component_a_select_option, { value: "assignment" }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(ssrRenderComponent(unref(PaperClipOutlined), null, null, _parent12, _scopeId11));
                                                                          _push12(` Assignment `);
                                                                        } else {
                                                                          return [
                                                                            createVNode(unref(PaperClipOutlined)),
                                                                            createTextVNode(" Assignment ")
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 2
                                                                    }, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(_component_a_select_option, { value: "video" }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(VideoCameraOutlined)),
                                                                          createTextVNode(" Video ")
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(_component_a_select_option, { value: "reading" }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(ReadOutlined)),
                                                                          createTextVNode(" Reading ")
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(_component_a_select_option, { value: "quiz" }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(QuestionCircleOutlined)),
                                                                          createTextVNode(" Quiz ")
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(_component_a_select_option, { value: "assignment" }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(PaperClipOutlined)),
                                                                          createTextVNode(" Assignment ")
                                                                        ]),
                                                                        _: 1
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(_component_a_select, {
                                                                  value: lesson.type,
                                                                  "onUpdate:value": ($event) => lesson.type = $event,
                                                                  style: { "width": "100%" }
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(_component_a_select_option, { value: "video" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(VideoCameraOutlined)),
                                                                        createTextVNode(" Video ")
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(_component_a_select_option, { value: "reading" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(ReadOutlined)),
                                                                        createTextVNode(" Reading ")
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(_component_a_select_option, { value: "quiz" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(QuestionCircleOutlined)),
                                                                        createTextVNode(" Quiz ")
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(_component_a_select_option, { value: "assignment" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(PaperClipOutlined)),
                                                                        createTextVNode(" Assignment ")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["value", "onUpdate:value"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        if (lesson.type === "video") {
                                                          _push9(`<!--[-->`);
                                                          _push9(ssrRenderComponent(_component_a_form_item, { label: "Video URL" }, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(ssrRenderComponent(_component_a_input, {
                                                                  value: lesson.videoUrl,
                                                                  "onUpdate:value": ($event) => lesson.videoUrl = $event,
                                                                  placeholder: "https://..."
                                                                }, null, _parent10, _scopeId9));
                                                              } else {
                                                                return [
                                                                  createVNode(_component_a_input, {
                                                                    value: lesson.videoUrl,
                                                                    "onUpdate:value": ($event) => lesson.videoUrl = $event,
                                                                    placeholder: "https://..."
                                                                  }, null, 8, ["value", "onUpdate:value"])
                                                                ];
                                                              }
                                                            }),
                                                            _: 2
                                                          }, _parent9, _scopeId8));
                                                          _push9(ssrRenderComponent(_component_a_form_item, { label: "Transcript / Notes" }, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(ssrRenderComponent(_component_a_textarea, {
                                                                  value: lesson.content,
                                                                  "onUpdate:value": ($event) => lesson.content = $event,
                                                                  rows: "4"
                                                                }, null, _parent10, _scopeId9));
                                                              } else {
                                                                return [
                                                                  createVNode(_component_a_textarea, {
                                                                    value: lesson.content,
                                                                    "onUpdate:value": ($event) => lesson.content = $event,
                                                                    rows: "4"
                                                                  }, null, 8, ["value", "onUpdate:value"])
                                                                ];
                                                              }
                                                            }),
                                                            _: 2
                                                          }, _parent9, _scopeId8));
                                                          _push9(`<!--]-->`);
                                                        } else if (lesson.type === "reading") {
                                                          _push9(`<!--[-->`);
                                                          _push9(ssrRenderComponent(_component_a_form_item, { label: "Article / Notes" }, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(ssrRenderComponent(_component_a_textarea, {
                                                                  value: lesson.content,
                                                                  "onUpdate:value": ($event) => lesson.content = $event,
                                                                  rows: "6",
                                                                  placeholder: "Paste or write the reading content..."
                                                                }, null, _parent10, _scopeId9));
                                                              } else {
                                                                return [
                                                                  createVNode(_component_a_textarea, {
                                                                    value: lesson.content,
                                                                    "onUpdate:value": ($event) => lesson.content = $event,
                                                                    rows: "6",
                                                                    placeholder: "Paste or write the reading content..."
                                                                  }, null, 8, ["value", "onUpdate:value"])
                                                                ];
                                                              }
                                                            }),
                                                            _: 2
                                                          }, _parent9, _scopeId8));
                                                          if (readingTime(lesson.content) > 0) {
                                                            _push9(ssrRenderComponent(_component_a_alert, {
                                                              type: "info",
                                                              "show-icon": "",
                                                              message: `Estimated reading time: ${readingTime(lesson.content)} min`
                                                            }, null, _parent9, _scopeId8));
                                                          } else {
                                                            _push9(`<!---->`);
                                                          }
                                                          _push9(`<!--]-->`);
                                                        } else if (lesson.type === "assignment") {
                                                          _push9(`<!--[-->`);
                                                          _push9(ssrRenderComponent(_component_a_form_item, { label: "Brief" }, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(ssrRenderComponent(_component_a_textarea, {
                                                                  value: lesson.content,
                                                                  "onUpdate:value": ($event) => lesson.content = $event,
                                                                  rows: "4",
                                                                  placeholder: "Describe the task students must complete"
                                                                }, null, _parent10, _scopeId9));
                                                              } else {
                                                                return [
                                                                  createVNode(_component_a_textarea, {
                                                                    value: lesson.content,
                                                                    "onUpdate:value": ($event) => lesson.content = $event,
                                                                    rows: "4",
                                                                    placeholder: "Describe the task students must complete"
                                                                  }, null, 8, ["value", "onUpdate:value"])
                                                                ];
                                                              }
                                                            }),
                                                            _: 2
                                                          }, _parent9, _scopeId8));
                                                          _push9(ssrRenderComponent(_component_a_form_item, { label: "Rubric (optional)" }, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(ssrRenderComponent(_component_a_textarea, {
                                                                  value: lesson.rubric,
                                                                  "onUpdate:value": ($event) => lesson.rubric = $event,
                                                                  rows: "3",
                                                                  placeholder: "How will you grade it?"
                                                                }, null, _parent10, _scopeId9));
                                                              } else {
                                                                return [
                                                                  createVNode(_component_a_textarea, {
                                                                    value: lesson.rubric,
                                                                    "onUpdate:value": ($event) => lesson.rubric = $event,
                                                                    rows: "3",
                                                                    placeholder: "How will you grade it?"
                                                                  }, null, 8, ["value", "onUpdate:value"])
                                                                ];
                                                              }
                                                            }),
                                                            _: 2
                                                          }, _parent9, _scopeId8));
                                                          _push9(`<!--]-->`);
                                                        } else if (lesson.type === "quiz") {
                                                          _push9(`<!--[-->`);
                                                          _push9(ssrRenderComponent(_component_a_divider, { orientation: "left" }, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(`Questions`);
                                                              } else {
                                                                return [
                                                                  createTextVNode("Questions")
                                                                ];
                                                              }
                                                            }),
                                                            _: 2
                                                          }, _parent9, _scopeId8));
                                                          if (!lesson.quiz?.questions?.length) {
                                                            _push9(`<div data-v-a217beca${_scopeId8}>`);
                                                            _push9(ssrRenderComponent(_component_a_empty, { description: "No questions yet" }, null, _parent9, _scopeId8));
                                                            _push9(`</div>`);
                                                          } else {
                                                            _push9(`<!---->`);
                                                          }
                                                          _push9(`<!--[-->`);
                                                          ssrRenderList(lesson.quiz?.questions || [], (q, qIdx) => {
                                                            _push9(`<div class="quiz-q" data-v-a217beca${_scopeId8}>`);
                                                            _push9(ssrRenderComponent(_component_a_card, {
                                                              size: "small",
                                                              title: `Q${qIdx + 1}`,
                                                              style: { "margin-bottom": "8px" }
                                                            }, {
                                                              default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                                if (_push10) {
                                                                  _push10(ssrRenderComponent(_component_a_form, { layout: "vertical" }, {
                                                                    default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                      if (_push11) {
                                                                        _push11(ssrRenderComponent(_component_a_form_item, { label: "Question" }, {
                                                                          default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                            if (_push12) {
                                                                              _push12(ssrRenderComponent(_component_a_input, {
                                                                                value: q.text,
                                                                                "onUpdate:value": ($event) => q.text = $event
                                                                              }, null, _parent12, _scopeId11));
                                                                            } else {
                                                                              return [
                                                                                createVNode(_component_a_input, {
                                                                                  value: q.text,
                                                                                  "onUpdate:value": ($event) => q.text = $event
                                                                                }, null, 8, ["value", "onUpdate:value"])
                                                                              ];
                                                                            }
                                                                          }),
                                                                          _: 2
                                                                        }, _parent11, _scopeId10));
                                                                        _push11(ssrRenderComponent(_component_a_form_item, { label: "Type" }, {
                                                                          default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                            if (_push12) {
                                                                              _push12(ssrRenderComponent(_component_a_select, {
                                                                                value: q.type,
                                                                                "onUpdate:value": ($event) => q.type = $event,
                                                                                style: { "width": "100%" }
                                                                              }, {
                                                                                default: withCtx((_12, _push13, _parent13, _scopeId12) => {
                                                                                  if (_push13) {
                                                                                    _push13(ssrRenderComponent(_component_a_select_option, { value: "mcq" }, {
                                                                                      default: withCtx((_13, _push14, _parent14, _scopeId13) => {
                                                                                        if (_push14) {
                                                                                          _push14(`Multiple choice`);
                                                                                        } else {
                                                                                          return [
                                                                                            createTextVNode("Multiple choice")
                                                                                          ];
                                                                                        }
                                                                                      }),
                                                                                      _: 2
                                                                                    }, _parent13, _scopeId12));
                                                                                    _push13(ssrRenderComponent(_component_a_select_option, { value: "tf" }, {
                                                                                      default: withCtx((_13, _push14, _parent14, _scopeId13) => {
                                                                                        if (_push14) {
                                                                                          _push14(`True/False`);
                                                                                        } else {
                                                                                          return [
                                                                                            createTextVNode("True/False")
                                                                                          ];
                                                                                        }
                                                                                      }),
                                                                                      _: 2
                                                                                    }, _parent13, _scopeId12));
                                                                                    _push13(ssrRenderComponent(_component_a_select_option, { value: "short" }, {
                                                                                      default: withCtx((_13, _push14, _parent14, _scopeId13) => {
                                                                                        if (_push14) {
                                                                                          _push14(`Short answer`);
                                                                                        } else {
                                                                                          return [
                                                                                            createTextVNode("Short answer")
                                                                                          ];
                                                                                        }
                                                                                      }),
                                                                                      _: 2
                                                                                    }, _parent13, _scopeId12));
                                                                                  } else {
                                                                                    return [
                                                                                      createVNode(_component_a_select_option, { value: "mcq" }, {
                                                                                        default: withCtx(() => [
                                                                                          createTextVNode("Multiple choice")
                                                                                        ]),
                                                                                        _: 1
                                                                                      }),
                                                                                      createVNode(_component_a_select_option, { value: "tf" }, {
                                                                                        default: withCtx(() => [
                                                                                          createTextVNode("True/False")
                                                                                        ]),
                                                                                        _: 1
                                                                                      }),
                                                                                      createVNode(_component_a_select_option, { value: "short" }, {
                                                                                        default: withCtx(() => [
                                                                                          createTextVNode("Short answer")
                                                                                        ]),
                                                                                        _: 1
                                                                                      })
                                                                                    ];
                                                                                  }
                                                                                }),
                                                                                _: 2
                                                                              }, _parent12, _scopeId11));
                                                                            } else {
                                                                              return [
                                                                                createVNode(_component_a_select, {
                                                                                  value: q.type,
                                                                                  "onUpdate:value": ($event) => q.type = $event,
                                                                                  style: { "width": "100%" }
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createVNode(_component_a_select_option, { value: "mcq" }, {
                                                                                      default: withCtx(() => [
                                                                                        createTextVNode("Multiple choice")
                                                                                      ]),
                                                                                      _: 1
                                                                                    }),
                                                                                    createVNode(_component_a_select_option, { value: "tf" }, {
                                                                                      default: withCtx(() => [
                                                                                        createTextVNode("True/False")
                                                                                      ]),
                                                                                      _: 1
                                                                                    }),
                                                                                    createVNode(_component_a_select_option, { value: "short" }, {
                                                                                      default: withCtx(() => [
                                                                                        createTextVNode("Short answer")
                                                                                      ]),
                                                                                      _: 1
                                                                                    })
                                                                                  ]),
                                                                                  _: 1
                                                                                }, 8, ["value", "onUpdate:value"])
                                                                              ];
                                                                            }
                                                                          }),
                                                                          _: 2
                                                                        }, _parent11, _scopeId10));
                                                                        if (q.type === "mcq") {
                                                                          _push11(ssrRenderComponent(_component_a_form_item, { label: "Options" }, {
                                                                            default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                              if (_push12) {
                                                                                _push12(`<!--[-->`);
                                                                                ssrRenderList(q.options, (opt, oIdx) => {
                                                                                  _push12(`<div class="mcq-opt" data-v-a217beca${_scopeId11}>`);
                                                                                  _push12(ssrRenderComponent(_component_a_input, {
                                                                                    value: opt.text,
                                                                                    "onUpdate:value": ($event) => opt.text = $event,
                                                                                    style: { "width": "70%" },
                                                                                    placeholder: "Option text"
                                                                                  }, null, _parent12, _scopeId11));
                                                                                  _push12(ssrRenderComponent(_component_a_checkbox, {
                                                                                    checked: opt.correct,
                                                                                    "onUpdate:checked": ($event) => opt.correct = $event,
                                                                                    style: { "margin-left": "8px" }
                                                                                  }, {
                                                                                    default: withCtx((_12, _push13, _parent13, _scopeId12) => {
                                                                                      if (_push13) {
                                                                                        _push13(`Correct`);
                                                                                      } else {
                                                                                        return [
                                                                                          createTextVNode("Correct")
                                                                                        ];
                                                                                      }
                                                                                    }),
                                                                                    _: 2
                                                                                  }, _parent12, _scopeId11));
                                                                                  _push12(ssrRenderComponent(_component_a_button, {
                                                                                    danger: "",
                                                                                    type: "text",
                                                                                    onClick: ($event) => removeOption(idx, qIdx, oIdx)
                                                                                  }, {
                                                                                    default: withCtx((_12, _push13, _parent13, _scopeId12) => {
                                                                                      if (_push13) {
                                                                                        _push13(ssrRenderComponent(unref(DeleteOutlined), null, null, _parent13, _scopeId12));
                                                                                      } else {
                                                                                        return [
                                                                                          createVNode(unref(DeleteOutlined))
                                                                                        ];
                                                                                      }
                                                                                    }),
                                                                                    _: 2
                                                                                  }, _parent12, _scopeId11));
                                                                                  _push12(`</div>`);
                                                                                });
                                                                                _push12(`<!--]-->`);
                                                                                _push12(ssrRenderComponent(_component_a_button, {
                                                                                  size: "small",
                                                                                  type: "dashed",
                                                                                  onClick: ($event) => addOption(idx, qIdx),
                                                                                  style: { "margin-top": "6px" }
                                                                                }, {
                                                                                  default: withCtx((_12, _push13, _parent13, _scopeId12) => {
                                                                                    if (_push13) {
                                                                                      _push13(ssrRenderComponent(unref(PlusOutlined), null, null, _parent13, _scopeId12));
                                                                                      _push13(` Add option `);
                                                                                    } else {
                                                                                      return [
                                                                                        createVNode(unref(PlusOutlined)),
                                                                                        createTextVNode(" Add option ")
                                                                                      ];
                                                                                    }
                                                                                  }),
                                                                                  _: 2
                                                                                }, _parent12, _scopeId11));
                                                                              } else {
                                                                                return [
                                                                                  (openBlock(true), createBlock(Fragment, null, renderList(q.options, (opt, oIdx) => {
                                                                                    return openBlock(), createBlock("div", {
                                                                                      key: oIdx,
                                                                                      class: "mcq-opt"
                                                                                    }, [
                                                                                      createVNode(_component_a_input, {
                                                                                        value: opt.text,
                                                                                        "onUpdate:value": ($event) => opt.text = $event,
                                                                                        style: { "width": "70%" },
                                                                                        placeholder: "Option text"
                                                                                      }, null, 8, ["value", "onUpdate:value"]),
                                                                                      createVNode(_component_a_checkbox, {
                                                                                        checked: opt.correct,
                                                                                        "onUpdate:checked": ($event) => opt.correct = $event,
                                                                                        style: { "margin-left": "8px" }
                                                                                      }, {
                                                                                        default: withCtx(() => [
                                                                                          createTextVNode("Correct")
                                                                                        ]),
                                                                                        _: 1
                                                                                      }, 8, ["checked", "onUpdate:checked"]),
                                                                                      createVNode(_component_a_button, {
                                                                                        danger: "",
                                                                                        type: "text",
                                                                                        onClick: ($event) => removeOption(idx, qIdx, oIdx)
                                                                                      }, {
                                                                                        default: withCtx(() => [
                                                                                          createVNode(unref(DeleteOutlined))
                                                                                        ]),
                                                                                        _: 1
                                                                                      }, 8, ["onClick"])
                                                                                    ]);
                                                                                  }), 128)),
                                                                                  createVNode(_component_a_button, {
                                                                                    size: "small",
                                                                                    type: "dashed",
                                                                                    onClick: ($event) => addOption(idx, qIdx),
                                                                                    style: { "margin-top": "6px" }
                                                                                  }, {
                                                                                    default: withCtx(() => [
                                                                                      createVNode(unref(PlusOutlined)),
                                                                                      createTextVNode(" Add option ")
                                                                                    ]),
                                                                                    _: 1
                                                                                  }, 8, ["onClick"])
                                                                                ];
                                                                              }
                                                                            }),
                                                                            _: 2
                                                                          }, _parent11, _scopeId10));
                                                                        } else if (q.type === "tf") {
                                                                          _push11(ssrRenderComponent(_component_a_alert, {
                                                                            type: "info",
                                                                            "show-icon": "",
                                                                            message: "This will be a True/False question."
                                                                          }, null, _parent11, _scopeId10));
                                                                        } else if (q.type === "short") {
                                                                          _push11(ssrRenderComponent(_component_a_alert, {
                                                                            type: "info",
                                                                            "show-icon": "",
                                                                            message: "This will be a short, free-text answer."
                                                                          }, null, _parent11, _scopeId10));
                                                                        } else {
                                                                          _push11(`<!---->`);
                                                                        }
                                                                        _push11(`<div class="row-right" data-v-a217beca${_scopeId10}>`);
                                                                        _push11(ssrRenderComponent(_component_a_space, null, {
                                                                          default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                            if (_push12) {
                                                                              _push12(ssrRenderComponent(_component_a_button, {
                                                                                size: "small",
                                                                                onClick: ($event) => moveQuestion(idx, qIdx, -1)
                                                                              }, {
                                                                                default: withCtx((_12, _push13, _parent13, _scopeId12) => {
                                                                                  if (_push13) {
                                                                                    _push13(ssrRenderComponent(unref(ArrowUpOutlined), null, null, _parent13, _scopeId12));
                                                                                  } else {
                                                                                    return [
                                                                                      createVNode(unref(ArrowUpOutlined))
                                                                                    ];
                                                                                  }
                                                                                }),
                                                                                _: 2
                                                                              }, _parent12, _scopeId11));
                                                                              _push12(ssrRenderComponent(_component_a_button, {
                                                                                size: "small",
                                                                                onClick: ($event) => moveQuestion(idx, qIdx, 1)
                                                                              }, {
                                                                                default: withCtx((_12, _push13, _parent13, _scopeId12) => {
                                                                                  if (_push13) {
                                                                                    _push13(ssrRenderComponent(unref(ArrowDownOutlined), null, null, _parent13, _scopeId12));
                                                                                  } else {
                                                                                    return [
                                                                                      createVNode(unref(ArrowDownOutlined))
                                                                                    ];
                                                                                  }
                                                                                }),
                                                                                _: 2
                                                                              }, _parent12, _scopeId11));
                                                                              _push12(ssrRenderComponent(_component_a_button, {
                                                                                size: "small",
                                                                                danger: "",
                                                                                onClick: ($event) => removeQuestion(idx, qIdx)
                                                                              }, {
                                                                                default: withCtx((_12, _push13, _parent13, _scopeId12) => {
                                                                                  if (_push13) {
                                                                                    _push13(ssrRenderComponent(unref(DeleteOutlined), null, null, _parent13, _scopeId12));
                                                                                  } else {
                                                                                    return [
                                                                                      createVNode(unref(DeleteOutlined))
                                                                                    ];
                                                                                  }
                                                                                }),
                                                                                _: 2
                                                                              }, _parent12, _scopeId11));
                                                                            } else {
                                                                              return [
                                                                                createVNode(_component_a_button, {
                                                                                  size: "small",
                                                                                  onClick: ($event) => moveQuestion(idx, qIdx, -1)
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createVNode(unref(ArrowUpOutlined))
                                                                                  ]),
                                                                                  _: 1
                                                                                }, 8, ["onClick"]),
                                                                                createVNode(_component_a_button, {
                                                                                  size: "small",
                                                                                  onClick: ($event) => moveQuestion(idx, qIdx, 1)
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createVNode(unref(ArrowDownOutlined))
                                                                                  ]),
                                                                                  _: 1
                                                                                }, 8, ["onClick"]),
                                                                                createVNode(_component_a_button, {
                                                                                  size: "small",
                                                                                  danger: "",
                                                                                  onClick: ($event) => removeQuestion(idx, qIdx)
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createVNode(unref(DeleteOutlined))
                                                                                  ]),
                                                                                  _: 1
                                                                                }, 8, ["onClick"])
                                                                              ];
                                                                            }
                                                                          }),
                                                                          _: 2
                                                                        }, _parent11, _scopeId10));
                                                                        _push11(`</div>`);
                                                                      } else {
                                                                        return [
                                                                          createVNode(_component_a_form_item, { label: "Question" }, {
                                                                            default: withCtx(() => [
                                                                              createVNode(_component_a_input, {
                                                                                value: q.text,
                                                                                "onUpdate:value": ($event) => q.text = $event
                                                                              }, null, 8, ["value", "onUpdate:value"])
                                                                            ]),
                                                                            _: 2
                                                                          }, 1024),
                                                                          createVNode(_component_a_form_item, { label: "Type" }, {
                                                                            default: withCtx(() => [
                                                                              createVNode(_component_a_select, {
                                                                                value: q.type,
                                                                                "onUpdate:value": ($event) => q.type = $event,
                                                                                style: { "width": "100%" }
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createVNode(_component_a_select_option, { value: "mcq" }, {
                                                                                    default: withCtx(() => [
                                                                                      createTextVNode("Multiple choice")
                                                                                    ]),
                                                                                    _: 1
                                                                                  }),
                                                                                  createVNode(_component_a_select_option, { value: "tf" }, {
                                                                                    default: withCtx(() => [
                                                                                      createTextVNode("True/False")
                                                                                    ]),
                                                                                    _: 1
                                                                                  }),
                                                                                  createVNode(_component_a_select_option, { value: "short" }, {
                                                                                    default: withCtx(() => [
                                                                                      createTextVNode("Short answer")
                                                                                    ]),
                                                                                    _: 1
                                                                                  })
                                                                                ]),
                                                                                _: 1
                                                                              }, 8, ["value", "onUpdate:value"])
                                                                            ]),
                                                                            _: 2
                                                                          }, 1024),
                                                                          q.type === "mcq" ? (openBlock(), createBlock(_component_a_form_item, {
                                                                            key: 0,
                                                                            label: "Options"
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              (openBlock(true), createBlock(Fragment, null, renderList(q.options, (opt, oIdx) => {
                                                                                return openBlock(), createBlock("div", {
                                                                                  key: oIdx,
                                                                                  class: "mcq-opt"
                                                                                }, [
                                                                                  createVNode(_component_a_input, {
                                                                                    value: opt.text,
                                                                                    "onUpdate:value": ($event) => opt.text = $event,
                                                                                    style: { "width": "70%" },
                                                                                    placeholder: "Option text"
                                                                                  }, null, 8, ["value", "onUpdate:value"]),
                                                                                  createVNode(_component_a_checkbox, {
                                                                                    checked: opt.correct,
                                                                                    "onUpdate:checked": ($event) => opt.correct = $event,
                                                                                    style: { "margin-left": "8px" }
                                                                                  }, {
                                                                                    default: withCtx(() => [
                                                                                      createTextVNode("Correct")
                                                                                    ]),
                                                                                    _: 1
                                                                                  }, 8, ["checked", "onUpdate:checked"]),
                                                                                  createVNode(_component_a_button, {
                                                                                    danger: "",
                                                                                    type: "text",
                                                                                    onClick: ($event) => removeOption(idx, qIdx, oIdx)
                                                                                  }, {
                                                                                    default: withCtx(() => [
                                                                                      createVNode(unref(DeleteOutlined))
                                                                                    ]),
                                                                                    _: 1
                                                                                  }, 8, ["onClick"])
                                                                                ]);
                                                                              }), 128)),
                                                                              createVNode(_component_a_button, {
                                                                                size: "small",
                                                                                type: "dashed",
                                                                                onClick: ($event) => addOption(idx, qIdx),
                                                                                style: { "margin-top": "6px" }
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createVNode(unref(PlusOutlined)),
                                                                                  createTextVNode(" Add option ")
                                                                                ]),
                                                                                _: 1
                                                                              }, 8, ["onClick"])
                                                                            ]),
                                                                            _: 2
                                                                          }, 1024)) : q.type === "tf" ? (openBlock(), createBlock(_component_a_alert, {
                                                                            key: 1,
                                                                            type: "info",
                                                                            "show-icon": "",
                                                                            message: "This will be a True/False question."
                                                                          })) : q.type === "short" ? (openBlock(), createBlock(_component_a_alert, {
                                                                            key: 2,
                                                                            type: "info",
                                                                            "show-icon": "",
                                                                            message: "This will be a short, free-text answer."
                                                                          })) : createCommentVNode("", true),
                                                                          createVNode("div", { class: "row-right" }, [
                                                                            createVNode(_component_a_space, null, {
                                                                              default: withCtx(() => [
                                                                                createVNode(_component_a_button, {
                                                                                  size: "small",
                                                                                  onClick: ($event) => moveQuestion(idx, qIdx, -1)
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createVNode(unref(ArrowUpOutlined))
                                                                                  ]),
                                                                                  _: 1
                                                                                }, 8, ["onClick"]),
                                                                                createVNode(_component_a_button, {
                                                                                  size: "small",
                                                                                  onClick: ($event) => moveQuestion(idx, qIdx, 1)
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createVNode(unref(ArrowDownOutlined))
                                                                                  ]),
                                                                                  _: 1
                                                                                }, 8, ["onClick"]),
                                                                                createVNode(_component_a_button, {
                                                                                  size: "small",
                                                                                  danger: "",
                                                                                  onClick: ($event) => removeQuestion(idx, qIdx)
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createVNode(unref(DeleteOutlined))
                                                                                  ]),
                                                                                  _: 1
                                                                                }, 8, ["onClick"])
                                                                              ]),
                                                                              _: 2
                                                                            }, 1024)
                                                                          ])
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 2
                                                                  }, _parent10, _scopeId9));
                                                                } else {
                                                                  return [
                                                                    createVNode(_component_a_form, { layout: "vertical" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(_component_a_form_item, { label: "Question" }, {
                                                                          default: withCtx(() => [
                                                                            createVNode(_component_a_input, {
                                                                              value: q.text,
                                                                              "onUpdate:value": ($event) => q.text = $event
                                                                            }, null, 8, ["value", "onUpdate:value"])
                                                                          ]),
                                                                          _: 2
                                                                        }, 1024),
                                                                        createVNode(_component_a_form_item, { label: "Type" }, {
                                                                          default: withCtx(() => [
                                                                            createVNode(_component_a_select, {
                                                                              value: q.type,
                                                                              "onUpdate:value": ($event) => q.type = $event,
                                                                              style: { "width": "100%" }
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createVNode(_component_a_select_option, { value: "mcq" }, {
                                                                                  default: withCtx(() => [
                                                                                    createTextVNode("Multiple choice")
                                                                                  ]),
                                                                                  _: 1
                                                                                }),
                                                                                createVNode(_component_a_select_option, { value: "tf" }, {
                                                                                  default: withCtx(() => [
                                                                                    createTextVNode("True/False")
                                                                                  ]),
                                                                                  _: 1
                                                                                }),
                                                                                createVNode(_component_a_select_option, { value: "short" }, {
                                                                                  default: withCtx(() => [
                                                                                    createTextVNode("Short answer")
                                                                                  ]),
                                                                                  _: 1
                                                                                })
                                                                              ]),
                                                                              _: 1
                                                                            }, 8, ["value", "onUpdate:value"])
                                                                          ]),
                                                                          _: 2
                                                                        }, 1024),
                                                                        q.type === "mcq" ? (openBlock(), createBlock(_component_a_form_item, {
                                                                          key: 0,
                                                                          label: "Options"
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            (openBlock(true), createBlock(Fragment, null, renderList(q.options, (opt, oIdx) => {
                                                                              return openBlock(), createBlock("div", {
                                                                                key: oIdx,
                                                                                class: "mcq-opt"
                                                                              }, [
                                                                                createVNode(_component_a_input, {
                                                                                  value: opt.text,
                                                                                  "onUpdate:value": ($event) => opt.text = $event,
                                                                                  style: { "width": "70%" },
                                                                                  placeholder: "Option text"
                                                                                }, null, 8, ["value", "onUpdate:value"]),
                                                                                createVNode(_component_a_checkbox, {
                                                                                  checked: opt.correct,
                                                                                  "onUpdate:checked": ($event) => opt.correct = $event,
                                                                                  style: { "margin-left": "8px" }
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createTextVNode("Correct")
                                                                                  ]),
                                                                                  _: 1
                                                                                }, 8, ["checked", "onUpdate:checked"]),
                                                                                createVNode(_component_a_button, {
                                                                                  danger: "",
                                                                                  type: "text",
                                                                                  onClick: ($event) => removeOption(idx, qIdx, oIdx)
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createVNode(unref(DeleteOutlined))
                                                                                  ]),
                                                                                  _: 1
                                                                                }, 8, ["onClick"])
                                                                              ]);
                                                                            }), 128)),
                                                                            createVNode(_component_a_button, {
                                                                              size: "small",
                                                                              type: "dashed",
                                                                              onClick: ($event) => addOption(idx, qIdx),
                                                                              style: { "margin-top": "6px" }
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createVNode(unref(PlusOutlined)),
                                                                                createTextVNode(" Add option ")
                                                                              ]),
                                                                              _: 1
                                                                            }, 8, ["onClick"])
                                                                          ]),
                                                                          _: 2
                                                                        }, 1024)) : q.type === "tf" ? (openBlock(), createBlock(_component_a_alert, {
                                                                          key: 1,
                                                                          type: "info",
                                                                          "show-icon": "",
                                                                          message: "This will be a True/False question."
                                                                        })) : q.type === "short" ? (openBlock(), createBlock(_component_a_alert, {
                                                                          key: 2,
                                                                          type: "info",
                                                                          "show-icon": "",
                                                                          message: "This will be a short, free-text answer."
                                                                        })) : createCommentVNode("", true),
                                                                        createVNode("div", { class: "row-right" }, [
                                                                          createVNode(_component_a_space, null, {
                                                                            default: withCtx(() => [
                                                                              createVNode(_component_a_button, {
                                                                                size: "small",
                                                                                onClick: ($event) => moveQuestion(idx, qIdx, -1)
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createVNode(unref(ArrowUpOutlined))
                                                                                ]),
                                                                                _: 1
                                                                              }, 8, ["onClick"]),
                                                                              createVNode(_component_a_button, {
                                                                                size: "small",
                                                                                onClick: ($event) => moveQuestion(idx, qIdx, 1)
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createVNode(unref(ArrowDownOutlined))
                                                                                ]),
                                                                                _: 1
                                                                              }, 8, ["onClick"]),
                                                                              createVNode(_component_a_button, {
                                                                                size: "small",
                                                                                danger: "",
                                                                                onClick: ($event) => removeQuestion(idx, qIdx)
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createVNode(unref(DeleteOutlined))
                                                                                ]),
                                                                                _: 1
                                                                              }, 8, ["onClick"])
                                                                            ]),
                                                                            _: 2
                                                                          }, 1024)
                                                                        ])
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024)
                                                                  ];
                                                                }
                                                              }),
                                                              _: 2
                                                            }, _parent9, _scopeId8));
                                                            _push9(`</div>`);
                                                          });
                                                          _push9(`<!--]-->`);
                                                          _push9(ssrRenderComponent(_component_a_space, null, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(ssrRenderComponent(_component_a_button, {
                                                                  type: "dashed",
                                                                  size: "small",
                                                                  onClick: ($event) => addQuestion(idx)
                                                                }, {
                                                                  default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                    if (_push11) {
                                                                      _push11(ssrRenderComponent(unref(PlusOutlined), null, null, _parent11, _scopeId10));
                                                                      _push11(` Add question `);
                                                                    } else {
                                                                      return [
                                                                        createVNode(unref(PlusOutlined)),
                                                                        createTextVNode(" Add question ")
                                                                      ];
                                                                    }
                                                                  }),
                                                                  _: 2
                                                                }, _parent10, _scopeId9));
                                                                _push10(ssrRenderComponent(_component_a_button, {
                                                                  size: "small",
                                                                  onClick: ($event) => seedFiveMcq(idx)
                                                                }, {
                                                                  default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                    if (_push11) {
                                                                      _push11(ssrRenderComponent(unref(CopyOutlined), null, null, _parent11, _scopeId10));
                                                                      _push11(` Seed 5 MCQ `);
                                                                    } else {
                                                                      return [
                                                                        createVNode(unref(CopyOutlined)),
                                                                        createTextVNode(" Seed 5 MCQ ")
                                                                      ];
                                                                    }
                                                                  }),
                                                                  _: 2
                                                                }, _parent10, _scopeId9));
                                                              } else {
                                                                return [
                                                                  createVNode(_component_a_button, {
                                                                    type: "dashed",
                                                                    size: "small",
                                                                    onClick: ($event) => addQuestion(idx)
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(PlusOutlined)),
                                                                      createTextVNode(" Add question ")
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["onClick"]),
                                                                  createVNode(_component_a_button, {
                                                                    size: "small",
                                                                    onClick: ($event) => seedFiveMcq(idx)
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(CopyOutlined)),
                                                                      createTextVNode(" Seed 5 MCQ ")
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["onClick"])
                                                                ];
                                                              }
                                                            }),
                                                            _: 2
                                                          }, _parent9, _scopeId8));
                                                          _push9(`<!--]-->`);
                                                        } else {
                                                          _push9(`<!---->`);
                                                        }
                                                      } else {
                                                        return [
                                                          createVNode(_component_a_form_item, {
                                                            label: "Title",
                                                            rules: [{ required: true, message: "Lesson title is required" }]
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_input, {
                                                                value: lesson.title,
                                                                "onUpdate:value": ($event) => lesson.title = $event,
                                                                placeholder: "e.g. Reactive primitives"
                                                              }, null, 8, ["value", "onUpdate:value"])
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode(_component_a_form_item, { label: "Type" }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_select, {
                                                                value: lesson.type,
                                                                "onUpdate:value": ($event) => lesson.type = $event,
                                                                style: { "width": "100%" }
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(_component_a_select_option, { value: "video" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(VideoCameraOutlined)),
                                                                      createTextVNode(" Video ")
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(_component_a_select_option, { value: "reading" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(ReadOutlined)),
                                                                      createTextVNode(" Reading ")
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(_component_a_select_option, { value: "quiz" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(QuestionCircleOutlined)),
                                                                      createTextVNode(" Quiz ")
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(_component_a_select_option, { value: "assignment" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(PaperClipOutlined)),
                                                                      createTextVNode(" Assignment ")
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 1
                                                              }, 8, ["value", "onUpdate:value"])
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          lesson.type === "video" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                            createVNode(_component_a_form_item, { label: "Video URL" }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_input, {
                                                                  value: lesson.videoUrl,
                                                                  "onUpdate:value": ($event) => lesson.videoUrl = $event,
                                                                  placeholder: "https://..."
                                                                }, null, 8, ["value", "onUpdate:value"])
                                                              ]),
                                                              _: 2
                                                            }, 1024),
                                                            createVNode(_component_a_form_item, { label: "Transcript / Notes" }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_textarea, {
                                                                  value: lesson.content,
                                                                  "onUpdate:value": ($event) => lesson.content = $event,
                                                                  rows: "4"
                                                                }, null, 8, ["value", "onUpdate:value"])
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ], 64)) : lesson.type === "reading" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                            createVNode(_component_a_form_item, { label: "Article / Notes" }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_textarea, {
                                                                  value: lesson.content,
                                                                  "onUpdate:value": ($event) => lesson.content = $event,
                                                                  rows: "6",
                                                                  placeholder: "Paste or write the reading content..."
                                                                }, null, 8, ["value", "onUpdate:value"])
                                                              ]),
                                                              _: 2
                                                            }, 1024),
                                                            readingTime(lesson.content) > 0 ? (openBlock(), createBlock(_component_a_alert, {
                                                              key: 0,
                                                              type: "info",
                                                              "show-icon": "",
                                                              message: `Estimated reading time: ${readingTime(lesson.content)} min`
                                                            }, null, 8, ["message"])) : createCommentVNode("", true)
                                                          ], 64)) : lesson.type === "assignment" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                            createVNode(_component_a_form_item, { label: "Brief" }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_textarea, {
                                                                  value: lesson.content,
                                                                  "onUpdate:value": ($event) => lesson.content = $event,
                                                                  rows: "4",
                                                                  placeholder: "Describe the task students must complete"
                                                                }, null, 8, ["value", "onUpdate:value"])
                                                              ]),
                                                              _: 2
                                                            }, 1024),
                                                            createVNode(_component_a_form_item, { label: "Rubric (optional)" }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_textarea, {
                                                                  value: lesson.rubric,
                                                                  "onUpdate:value": ($event) => lesson.rubric = $event,
                                                                  rows: "3",
                                                                  placeholder: "How will you grade it?"
                                                                }, null, 8, ["value", "onUpdate:value"])
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ], 64)) : lesson.type === "quiz" ? (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                            createVNode(_component_a_divider, { orientation: "left" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("Questions")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            !lesson.quiz?.questions?.length ? (openBlock(), createBlock("div", { key: 0 }, [
                                                              createVNode(_component_a_empty, { description: "No questions yet" })
                                                            ])) : createCommentVNode("", true),
                                                            (openBlock(true), createBlock(Fragment, null, renderList(lesson.quiz?.questions || [], (q, qIdx) => {
                                                              return openBlock(), createBlock("div", {
                                                                key: q.id,
                                                                class: "quiz-q"
                                                              }, [
                                                                createVNode(_component_a_card, {
                                                                  size: "small",
                                                                  title: `Q${qIdx + 1}`,
                                                                  style: { "margin-bottom": "8px" }
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(_component_a_form, { layout: "vertical" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(_component_a_form_item, { label: "Question" }, {
                                                                          default: withCtx(() => [
                                                                            createVNode(_component_a_input, {
                                                                              value: q.text,
                                                                              "onUpdate:value": ($event) => q.text = $event
                                                                            }, null, 8, ["value", "onUpdate:value"])
                                                                          ]),
                                                                          _: 2
                                                                        }, 1024),
                                                                        createVNode(_component_a_form_item, { label: "Type" }, {
                                                                          default: withCtx(() => [
                                                                            createVNode(_component_a_select, {
                                                                              value: q.type,
                                                                              "onUpdate:value": ($event) => q.type = $event,
                                                                              style: { "width": "100%" }
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createVNode(_component_a_select_option, { value: "mcq" }, {
                                                                                  default: withCtx(() => [
                                                                                    createTextVNode("Multiple choice")
                                                                                  ]),
                                                                                  _: 1
                                                                                }),
                                                                                createVNode(_component_a_select_option, { value: "tf" }, {
                                                                                  default: withCtx(() => [
                                                                                    createTextVNode("True/False")
                                                                                  ]),
                                                                                  _: 1
                                                                                }),
                                                                                createVNode(_component_a_select_option, { value: "short" }, {
                                                                                  default: withCtx(() => [
                                                                                    createTextVNode("Short answer")
                                                                                  ]),
                                                                                  _: 1
                                                                                })
                                                                              ]),
                                                                              _: 1
                                                                            }, 8, ["value", "onUpdate:value"])
                                                                          ]),
                                                                          _: 2
                                                                        }, 1024),
                                                                        q.type === "mcq" ? (openBlock(), createBlock(_component_a_form_item, {
                                                                          key: 0,
                                                                          label: "Options"
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            (openBlock(true), createBlock(Fragment, null, renderList(q.options, (opt, oIdx) => {
                                                                              return openBlock(), createBlock("div", {
                                                                                key: oIdx,
                                                                                class: "mcq-opt"
                                                                              }, [
                                                                                createVNode(_component_a_input, {
                                                                                  value: opt.text,
                                                                                  "onUpdate:value": ($event) => opt.text = $event,
                                                                                  style: { "width": "70%" },
                                                                                  placeholder: "Option text"
                                                                                }, null, 8, ["value", "onUpdate:value"]),
                                                                                createVNode(_component_a_checkbox, {
                                                                                  checked: opt.correct,
                                                                                  "onUpdate:checked": ($event) => opt.correct = $event,
                                                                                  style: { "margin-left": "8px" }
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createTextVNode("Correct")
                                                                                  ]),
                                                                                  _: 1
                                                                                }, 8, ["checked", "onUpdate:checked"]),
                                                                                createVNode(_component_a_button, {
                                                                                  danger: "",
                                                                                  type: "text",
                                                                                  onClick: ($event) => removeOption(idx, qIdx, oIdx)
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createVNode(unref(DeleteOutlined))
                                                                                  ]),
                                                                                  _: 1
                                                                                }, 8, ["onClick"])
                                                                              ]);
                                                                            }), 128)),
                                                                            createVNode(_component_a_button, {
                                                                              size: "small",
                                                                              type: "dashed",
                                                                              onClick: ($event) => addOption(idx, qIdx),
                                                                              style: { "margin-top": "6px" }
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createVNode(unref(PlusOutlined)),
                                                                                createTextVNode(" Add option ")
                                                                              ]),
                                                                              _: 1
                                                                            }, 8, ["onClick"])
                                                                          ]),
                                                                          _: 2
                                                                        }, 1024)) : q.type === "tf" ? (openBlock(), createBlock(_component_a_alert, {
                                                                          key: 1,
                                                                          type: "info",
                                                                          "show-icon": "",
                                                                          message: "This will be a True/False question."
                                                                        })) : q.type === "short" ? (openBlock(), createBlock(_component_a_alert, {
                                                                          key: 2,
                                                                          type: "info",
                                                                          "show-icon": "",
                                                                          message: "This will be a short, free-text answer."
                                                                        })) : createCommentVNode("", true),
                                                                        createVNode("div", { class: "row-right" }, [
                                                                          createVNode(_component_a_space, null, {
                                                                            default: withCtx(() => [
                                                                              createVNode(_component_a_button, {
                                                                                size: "small",
                                                                                onClick: ($event) => moveQuestion(idx, qIdx, -1)
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createVNode(unref(ArrowUpOutlined))
                                                                                ]),
                                                                                _: 1
                                                                              }, 8, ["onClick"]),
                                                                              createVNode(_component_a_button, {
                                                                                size: "small",
                                                                                onClick: ($event) => moveQuestion(idx, qIdx, 1)
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createVNode(unref(ArrowDownOutlined))
                                                                                ]),
                                                                                _: 1
                                                                              }, 8, ["onClick"]),
                                                                              createVNode(_component_a_button, {
                                                                                size: "small",
                                                                                danger: "",
                                                                                onClick: ($event) => removeQuestion(idx, qIdx)
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createVNode(unref(DeleteOutlined))
                                                                                ]),
                                                                                _: 1
                                                                              }, 8, ["onClick"])
                                                                            ]),
                                                                            _: 2
                                                                          }, 1024)
                                                                        ])
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024)
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["title"])
                                                              ]);
                                                            }), 128)),
                                                            createVNode(_component_a_space, null, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_button, {
                                                                  type: "dashed",
                                                                  size: "small",
                                                                  onClick: ($event) => addQuestion(idx)
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(PlusOutlined)),
                                                                    createTextVNode(" Add question ")
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onClick"]),
                                                                createVNode(_component_a_button, {
                                                                  size: "small",
                                                                  onClick: ($event) => seedFiveMcq(idx)
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(CopyOutlined)),
                                                                    createTextVNode(" Seed 5 MCQ ")
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onClick"])
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ], 64)) : createCommentVNode("", true)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_a_form, { layout: "vertical" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_form_item, {
                                                          label: "Title",
                                                          rules: [{ required: true, message: "Lesson title is required" }]
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_input, {
                                                              value: lesson.title,
                                                              "onUpdate:value": ($event) => lesson.title = $event,
                                                              placeholder: "e.g. Reactive primitives"
                                                            }, null, 8, ["value", "onUpdate:value"])
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode(_component_a_form_item, { label: "Type" }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_select, {
                                                              value: lesson.type,
                                                              "onUpdate:value": ($event) => lesson.type = $event,
                                                              style: { "width": "100%" }
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_select_option, { value: "video" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(VideoCameraOutlined)),
                                                                    createTextVNode(" Video ")
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(_component_a_select_option, { value: "reading" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(ReadOutlined)),
                                                                    createTextVNode(" Reading ")
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(_component_a_select_option, { value: "quiz" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(QuestionCircleOutlined)),
                                                                    createTextVNode(" Quiz ")
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(_component_a_select_option, { value: "assignment" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(PaperClipOutlined)),
                                                                    createTextVNode(" Assignment ")
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 1
                                                            }, 8, ["value", "onUpdate:value"])
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        lesson.type === "video" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                          createVNode(_component_a_form_item, { label: "Video URL" }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_input, {
                                                                value: lesson.videoUrl,
                                                                "onUpdate:value": ($event) => lesson.videoUrl = $event,
                                                                placeholder: "https://..."
                                                              }, null, 8, ["value", "onUpdate:value"])
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode(_component_a_form_item, { label: "Transcript / Notes" }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_textarea, {
                                                                value: lesson.content,
                                                                "onUpdate:value": ($event) => lesson.content = $event,
                                                                rows: "4"
                                                              }, null, 8, ["value", "onUpdate:value"])
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ], 64)) : lesson.type === "reading" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                          createVNode(_component_a_form_item, { label: "Article / Notes" }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_textarea, {
                                                                value: lesson.content,
                                                                "onUpdate:value": ($event) => lesson.content = $event,
                                                                rows: "6",
                                                                placeholder: "Paste or write the reading content..."
                                                              }, null, 8, ["value", "onUpdate:value"])
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          readingTime(lesson.content) > 0 ? (openBlock(), createBlock(_component_a_alert, {
                                                            key: 0,
                                                            type: "info",
                                                            "show-icon": "",
                                                            message: `Estimated reading time: ${readingTime(lesson.content)} min`
                                                          }, null, 8, ["message"])) : createCommentVNode("", true)
                                                        ], 64)) : lesson.type === "assignment" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                          createVNode(_component_a_form_item, { label: "Brief" }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_textarea, {
                                                                value: lesson.content,
                                                                "onUpdate:value": ($event) => lesson.content = $event,
                                                                rows: "4",
                                                                placeholder: "Describe the task students must complete"
                                                              }, null, 8, ["value", "onUpdate:value"])
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode(_component_a_form_item, { label: "Rubric (optional)" }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_textarea, {
                                                                value: lesson.rubric,
                                                                "onUpdate:value": ($event) => lesson.rubric = $event,
                                                                rows: "3",
                                                                placeholder: "How will you grade it?"
                                                              }, null, 8, ["value", "onUpdate:value"])
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ], 64)) : lesson.type === "quiz" ? (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                          createVNode(_component_a_divider, { orientation: "left" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Questions")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          !lesson.quiz?.questions?.length ? (openBlock(), createBlock("div", { key: 0 }, [
                                                            createVNode(_component_a_empty, { description: "No questions yet" })
                                                          ])) : createCommentVNode("", true),
                                                          (openBlock(true), createBlock(Fragment, null, renderList(lesson.quiz?.questions || [], (q, qIdx) => {
                                                            return openBlock(), createBlock("div", {
                                                              key: q.id,
                                                              class: "quiz-q"
                                                            }, [
                                                              createVNode(_component_a_card, {
                                                                size: "small",
                                                                title: `Q${qIdx + 1}`,
                                                                style: { "margin-bottom": "8px" }
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(_component_a_form, { layout: "vertical" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(_component_a_form_item, { label: "Question" }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(_component_a_input, {
                                                                            value: q.text,
                                                                            "onUpdate:value": ($event) => q.text = $event
                                                                          }, null, 8, ["value", "onUpdate:value"])
                                                                        ]),
                                                                        _: 2
                                                                      }, 1024),
                                                                      createVNode(_component_a_form_item, { label: "Type" }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(_component_a_select, {
                                                                            value: q.type,
                                                                            "onUpdate:value": ($event) => q.type = $event,
                                                                            style: { "width": "100%" }
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createVNode(_component_a_select_option, { value: "mcq" }, {
                                                                                default: withCtx(() => [
                                                                                  createTextVNode("Multiple choice")
                                                                                ]),
                                                                                _: 1
                                                                              }),
                                                                              createVNode(_component_a_select_option, { value: "tf" }, {
                                                                                default: withCtx(() => [
                                                                                  createTextVNode("True/False")
                                                                                ]),
                                                                                _: 1
                                                                              }),
                                                                              createVNode(_component_a_select_option, { value: "short" }, {
                                                                                default: withCtx(() => [
                                                                                  createTextVNode("Short answer")
                                                                                ]),
                                                                                _: 1
                                                                              })
                                                                            ]),
                                                                            _: 1
                                                                          }, 8, ["value", "onUpdate:value"])
                                                                        ]),
                                                                        _: 2
                                                                      }, 1024),
                                                                      q.type === "mcq" ? (openBlock(), createBlock(_component_a_form_item, {
                                                                        key: 0,
                                                                        label: "Options"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          (openBlock(true), createBlock(Fragment, null, renderList(q.options, (opt, oIdx) => {
                                                                            return openBlock(), createBlock("div", {
                                                                              key: oIdx,
                                                                              class: "mcq-opt"
                                                                            }, [
                                                                              createVNode(_component_a_input, {
                                                                                value: opt.text,
                                                                                "onUpdate:value": ($event) => opt.text = $event,
                                                                                style: { "width": "70%" },
                                                                                placeholder: "Option text"
                                                                              }, null, 8, ["value", "onUpdate:value"]),
                                                                              createVNode(_component_a_checkbox, {
                                                                                checked: opt.correct,
                                                                                "onUpdate:checked": ($event) => opt.correct = $event,
                                                                                style: { "margin-left": "8px" }
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createTextVNode("Correct")
                                                                                ]),
                                                                                _: 1
                                                                              }, 8, ["checked", "onUpdate:checked"]),
                                                                              createVNode(_component_a_button, {
                                                                                danger: "",
                                                                                type: "text",
                                                                                onClick: ($event) => removeOption(idx, qIdx, oIdx)
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createVNode(unref(DeleteOutlined))
                                                                                ]),
                                                                                _: 1
                                                                              }, 8, ["onClick"])
                                                                            ]);
                                                                          }), 128)),
                                                                          createVNode(_component_a_button, {
                                                                            size: "small",
                                                                            type: "dashed",
                                                                            onClick: ($event) => addOption(idx, qIdx),
                                                                            style: { "margin-top": "6px" }
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createVNode(unref(PlusOutlined)),
                                                                              createTextVNode(" Add option ")
                                                                            ]),
                                                                            _: 1
                                                                          }, 8, ["onClick"])
                                                                        ]),
                                                                        _: 2
                                                                      }, 1024)) : q.type === "tf" ? (openBlock(), createBlock(_component_a_alert, {
                                                                        key: 1,
                                                                        type: "info",
                                                                        "show-icon": "",
                                                                        message: "This will be a True/False question."
                                                                      })) : q.type === "short" ? (openBlock(), createBlock(_component_a_alert, {
                                                                        key: 2,
                                                                        type: "info",
                                                                        "show-icon": "",
                                                                        message: "This will be a short, free-text answer."
                                                                      })) : createCommentVNode("", true),
                                                                      createVNode("div", { class: "row-right" }, [
                                                                        createVNode(_component_a_space, null, {
                                                                          default: withCtx(() => [
                                                                            createVNode(_component_a_button, {
                                                                              size: "small",
                                                                              onClick: ($event) => moveQuestion(idx, qIdx, -1)
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createVNode(unref(ArrowUpOutlined))
                                                                              ]),
                                                                              _: 1
                                                                            }, 8, ["onClick"]),
                                                                            createVNode(_component_a_button, {
                                                                              size: "small",
                                                                              onClick: ($event) => moveQuestion(idx, qIdx, 1)
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createVNode(unref(ArrowDownOutlined))
                                                                              ]),
                                                                              _: 1
                                                                            }, 8, ["onClick"]),
                                                                            createVNode(_component_a_button, {
                                                                              size: "small",
                                                                              danger: "",
                                                                              onClick: ($event) => removeQuestion(idx, qIdx)
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createVNode(unref(DeleteOutlined))
                                                                              ]),
                                                                              _: 1
                                                                            }, 8, ["onClick"])
                                                                          ]),
                                                                          _: 2
                                                                        }, 1024)
                                                                      ])
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024)
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["title"])
                                                            ]);
                                                          }), 128)),
                                                          createVNode(_component_a_space, null, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_button, {
                                                                type: "dashed",
                                                                size: "small",
                                                                onClick: ($event) => addQuestion(idx)
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(PlusOutlined)),
                                                                  createTextVNode(" Add question ")
                                                                ]),
                                                                _: 1
                                                              }, 8, ["onClick"]),
                                                              createVNode(_component_a_button, {
                                                                size: "small",
                                                                onClick: ($event) => seedFiveMcq(idx)
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(CopyOutlined)),
                                                                  createTextVNode(" Seed 5 MCQ ")
                                                                ]),
                                                                _: 1
                                                              }, 8, ["onClick"])
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ], 64)) : createCommentVNode("", true)
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_col, {
                                              xs: 24,
                                              md: 8
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_a_form, { layout: "vertical" }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(_component_a_form_item, { label: "Estimated Time (min)" }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(_component_a_input_number, {
                                                                value: lesson.duration,
                                                                "onUpdate:value": ($event) => lesson.duration = $event,
                                                                min: 1,
                                                                max: 600,
                                                                style: { "width": "100%" }
                                                              }, null, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(_component_a_input_number, {
                                                                  value: lesson.duration,
                                                                  "onUpdate:value": ($event) => lesson.duration = $event,
                                                                  min: 1,
                                                                  max: 600,
                                                                  style: { "width": "100%" }
                                                                }, null, 8, ["value", "onUpdate:value"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(_component_a_form_item, { label: "Prerequisite lessons (IDs)" }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(_component_a_select, {
                                                                value: lesson.prerequisites,
                                                                "onUpdate:value": ($event) => lesson.prerequisites = $event,
                                                                mode: "multiple",
                                                                options: prereqOptions(idx),
                                                                placeholder: "Optional"
                                                              }, null, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(_component_a_select, {
                                                                  value: lesson.prerequisites,
                                                                  "onUpdate:value": ($event) => lesson.prerequisites = $event,
                                                                  mode: "multiple",
                                                                  options: prereqOptions(idx),
                                                                  placeholder: "Optional"
                                                                }, null, 8, ["value", "onUpdate:value", "options"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(_component_a_form_item, { label: "Tags" }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(_component_a_select, {
                                                                value: lesson.tags,
                                                                "onUpdate:value": ($event) => lesson.tags = $event,
                                                                mode: "tags",
                                                                placeholder: "Add tags"
                                                              }, null, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(_component_a_select, {
                                                                  value: lesson.tags,
                                                                  "onUpdate:value": ($event) => lesson.tags = $event,
                                                                  mode: "tags",
                                                                  placeholder: "Add tags"
                                                                }, null, 8, ["value", "onUpdate:value"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(_component_a_form_item, { label: "Availability" }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(_component_a_date_picker, {
                                                                value: lesson.unlockAt,
                                                                "onUpdate:value": ($event) => lesson.unlockAt = $event,
                                                                "show-time": "",
                                                                style: { "width": "100%" },
                                                                placeholder: "Optional"
                                                              }, null, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(_component_a_date_picker, {
                                                                  value: lesson.unlockAt,
                                                                  "onUpdate:value": ($event) => lesson.unlockAt = $event,
                                                                  "show-time": "",
                                                                  style: { "width": "100%" },
                                                                  placeholder: "Optional"
                                                                }, null, 8, ["value", "onUpdate:value"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(_component_a_form_item, { label: "Resources (links)" }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`<!--[-->`);
                                                              ssrRenderList(lesson.resources, (r, rIdx) => {
                                                                _push10(`<div class="resource-row" data-v-a217beca${_scopeId9}>`);
                                                                _push10(ssrRenderComponent(_component_a_input, {
                                                                  value: r.title,
                                                                  "onUpdate:value": ($event) => r.title = $event,
                                                                  placeholder: "Title",
                                                                  style: { "width": "35%" }
                                                                }, null, _parent10, _scopeId9));
                                                                _push10(ssrRenderComponent(_component_a_input, {
                                                                  value: r.url,
                                                                  "onUpdate:value": ($event) => r.url = $event,
                                                                  placeholder: "https://…",
                                                                  style: { "width": "55%", "margin-left": "8px" }
                                                                }, null, _parent10, _scopeId9));
                                                                _push10(ssrRenderComponent(_component_a_button, {
                                                                  type: "text",
                                                                  danger: "",
                                                                  onClick: ($event) => removeResource(idx, rIdx)
                                                                }, {
                                                                  default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                    if (_push11) {
                                                                      _push11(ssrRenderComponent(unref(DeleteOutlined), null, null, _parent11, _scopeId10));
                                                                    } else {
                                                                      return [
                                                                        createVNode(unref(DeleteOutlined))
                                                                      ];
                                                                    }
                                                                  }),
                                                                  _: 2
                                                                }, _parent10, _scopeId9));
                                                                _push10(`</div>`);
                                                              });
                                                              _push10(`<!--]-->`);
                                                              _push10(ssrRenderComponent(_component_a_button, {
                                                                size: "small",
                                                                type: "dashed",
                                                                onClick: ($event) => addResource(idx),
                                                                style: { "margin-top": "6px" }
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(unref(PlusOutlined), null, null, _parent11, _scopeId10));
                                                                    _push11(` Add resource `);
                                                                  } else {
                                                                    return [
                                                                      createVNode(unref(PlusOutlined)),
                                                                      createTextVNode(" Add resource ")
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                (openBlock(true), createBlock(Fragment, null, renderList(lesson.resources, (r, rIdx) => {
                                                                  return openBlock(), createBlock("div", {
                                                                    key: rIdx,
                                                                    class: "resource-row"
                                                                  }, [
                                                                    createVNode(_component_a_input, {
                                                                      value: r.title,
                                                                      "onUpdate:value": ($event) => r.title = $event,
                                                                      placeholder: "Title",
                                                                      style: { "width": "35%" }
                                                                    }, null, 8, ["value", "onUpdate:value"]),
                                                                    createVNode(_component_a_input, {
                                                                      value: r.url,
                                                                      "onUpdate:value": ($event) => r.url = $event,
                                                                      placeholder: "https://…",
                                                                      style: { "width": "55%", "margin-left": "8px" }
                                                                    }, null, 8, ["value", "onUpdate:value"]),
                                                                    createVNode(_component_a_button, {
                                                                      type: "text",
                                                                      danger: "",
                                                                      onClick: ($event) => removeResource(idx, rIdx)
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(DeleteOutlined))
                                                                      ]),
                                                                      _: 1
                                                                    }, 8, ["onClick"])
                                                                  ]);
                                                                }), 128)),
                                                                createVNode(_component_a_button, {
                                                                  size: "small",
                                                                  type: "dashed",
                                                                  onClick: ($event) => addResource(idx),
                                                                  style: { "margin-top": "6px" }
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(PlusOutlined)),
                                                                    createTextVNode(" Add resource ")
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onClick"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(_component_a_form_item, { label: "Attachments" }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(_component_a_upload, {
                                                                "file-list": lesson.attachments,
                                                                "onUpdate:fileList": ($event) => lesson.attachments = $event,
                                                                "before-upload": () => false,
                                                                multiple: true
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(_component_a_button, { size: "small" }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(ssrRenderComponent(unref(PaperClipOutlined), null, null, _parent12, _scopeId11));
                                                                          _push12(` Add files`);
                                                                        } else {
                                                                          return [
                                                                            createVNode(unref(PaperClipOutlined)),
                                                                            createTextVNode(" Add files")
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 2
                                                                    }, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(_component_a_button, { size: "small" }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(PaperClipOutlined)),
                                                                          createTextVNode(" Add files")
                                                                        ]),
                                                                        _: 1
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(_component_a_upload, {
                                                                  "file-list": lesson.attachments,
                                                                  "onUpdate:fileList": ($event) => lesson.attachments = $event,
                                                                  "before-upload": () => false,
                                                                  multiple: true
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(_component_a_button, { size: "small" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(PaperClipOutlined)),
                                                                        createTextVNode(" Add files")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["file-list", "onUpdate:fileList"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(`<div class="row-right" data-v-a217beca${_scopeId8}>`);
                                                        _push9(ssrRenderComponent(_component_a_space, { wrap: "" }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(_component_a_button, {
                                                                onClick: ($event) => duplicateLesson(idx)
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(unref(CopyOutlined), null, null, _parent11, _scopeId10));
                                                                    _push11(` Duplicate`);
                                                                  } else {
                                                                    return [
                                                                      createVNode(unref(CopyOutlined)),
                                                                      createTextVNode(" Duplicate")
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              _push10(ssrRenderComponent(_component_a_button, {
                                                                onClick: ($event) => _ctx.previewLesson(lesson)
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(unref(EyeOutlined), null, null, _parent11, _scopeId10));
                                                                    _push11(` Preview`);
                                                                  } else {
                                                                    return [
                                                                      createVNode(unref(EyeOutlined)),
                                                                      createTextVNode(" Preview")
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              _push10(ssrRenderComponent(_component_a_button, {
                                                                onClick: ($event) => moveLesson(idx, -1)
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(unref(ArrowUpOutlined), null, null, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(unref(ArrowUpOutlined))
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              _push10(ssrRenderComponent(_component_a_button, {
                                                                onClick: ($event) => moveLesson(idx, 1)
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(unref(ArrowDownOutlined), null, null, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(unref(ArrowDownOutlined))
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              _push10(ssrRenderComponent(_component_a_popconfirm, {
                                                                title: "Delete this lesson?",
                                                                onConfirm: ($event) => removeLesson(idx)
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(_component_a_button, { danger: "" }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(ssrRenderComponent(unref(DeleteOutlined), null, null, _parent12, _scopeId11));
                                                                          _push12(` Delete`);
                                                                        } else {
                                                                          return [
                                                                            createVNode(unref(DeleteOutlined)),
                                                                            createTextVNode(" Delete")
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 2
                                                                    }, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(_component_a_button, { danger: "" }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(DeleteOutlined)),
                                                                          createTextVNode(" Delete")
                                                                        ]),
                                                                        _: 1
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(_component_a_button, {
                                                                  onClick: ($event) => duplicateLesson(idx)
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(CopyOutlined)),
                                                                    createTextVNode(" Duplicate")
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onClick"]),
                                                                createVNode(_component_a_button, {
                                                                  onClick: ($event) => _ctx.previewLesson(lesson)
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(EyeOutlined)),
                                                                    createTextVNode(" Preview")
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onClick"]),
                                                                createVNode(_component_a_button, {
                                                                  onClick: ($event) => moveLesson(idx, -1)
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(ArrowUpOutlined))
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onClick"]),
                                                                createVNode(_component_a_button, {
                                                                  onClick: ($event) => moveLesson(idx, 1)
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(ArrowDownOutlined))
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onClick"]),
                                                                createVNode(_component_a_popconfirm, {
                                                                  title: "Delete this lesson?",
                                                                  onConfirm: ($event) => removeLesson(idx)
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(_component_a_button, { danger: "" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(DeleteOutlined)),
                                                                        createTextVNode(" Delete")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onConfirm"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(`</div>`);
                                                      } else {
                                                        return [
                                                          createVNode(_component_a_form_item, { label: "Estimated Time (min)" }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_input_number, {
                                                                value: lesson.duration,
                                                                "onUpdate:value": ($event) => lesson.duration = $event,
                                                                min: 1,
                                                                max: 600,
                                                                style: { "width": "100%" }
                                                              }, null, 8, ["value", "onUpdate:value"])
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode(_component_a_form_item, { label: "Prerequisite lessons (IDs)" }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_select, {
                                                                value: lesson.prerequisites,
                                                                "onUpdate:value": ($event) => lesson.prerequisites = $event,
                                                                mode: "multiple",
                                                                options: prereqOptions(idx),
                                                                placeholder: "Optional"
                                                              }, null, 8, ["value", "onUpdate:value", "options"])
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode(_component_a_form_item, { label: "Tags" }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_select, {
                                                                value: lesson.tags,
                                                                "onUpdate:value": ($event) => lesson.tags = $event,
                                                                mode: "tags",
                                                                placeholder: "Add tags"
                                                              }, null, 8, ["value", "onUpdate:value"])
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode(_component_a_form_item, { label: "Availability" }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_date_picker, {
                                                                value: lesson.unlockAt,
                                                                "onUpdate:value": ($event) => lesson.unlockAt = $event,
                                                                "show-time": "",
                                                                style: { "width": "100%" },
                                                                placeholder: "Optional"
                                                              }, null, 8, ["value", "onUpdate:value"])
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode(_component_a_form_item, { label: "Resources (links)" }, {
                                                            default: withCtx(() => [
                                                              (openBlock(true), createBlock(Fragment, null, renderList(lesson.resources, (r, rIdx) => {
                                                                return openBlock(), createBlock("div", {
                                                                  key: rIdx,
                                                                  class: "resource-row"
                                                                }, [
                                                                  createVNode(_component_a_input, {
                                                                    value: r.title,
                                                                    "onUpdate:value": ($event) => r.title = $event,
                                                                    placeholder: "Title",
                                                                    style: { "width": "35%" }
                                                                  }, null, 8, ["value", "onUpdate:value"]),
                                                                  createVNode(_component_a_input, {
                                                                    value: r.url,
                                                                    "onUpdate:value": ($event) => r.url = $event,
                                                                    placeholder: "https://…",
                                                                    style: { "width": "55%", "margin-left": "8px" }
                                                                  }, null, 8, ["value", "onUpdate:value"]),
                                                                  createVNode(_component_a_button, {
                                                                    type: "text",
                                                                    danger: "",
                                                                    onClick: ($event) => removeResource(idx, rIdx)
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(DeleteOutlined))
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["onClick"])
                                                                ]);
                                                              }), 128)),
                                                              createVNode(_component_a_button, {
                                                                size: "small",
                                                                type: "dashed",
                                                                onClick: ($event) => addResource(idx),
                                                                style: { "margin-top": "6px" }
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(PlusOutlined)),
                                                                  createTextVNode(" Add resource ")
                                                                ]),
                                                                _: 1
                                                              }, 8, ["onClick"])
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode(_component_a_form_item, { label: "Attachments" }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_upload, {
                                                                "file-list": lesson.attachments,
                                                                "onUpdate:fileList": ($event) => lesson.attachments = $event,
                                                                "before-upload": () => false,
                                                                multiple: true
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(_component_a_button, { size: "small" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(PaperClipOutlined)),
                                                                      createTextVNode(" Add files")
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 1
                                                              }, 8, ["file-list", "onUpdate:fileList"])
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode("div", { class: "row-right" }, [
                                                            createVNode(_component_a_space, { wrap: "" }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_button, {
                                                                  onClick: ($event) => duplicateLesson(idx)
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(CopyOutlined)),
                                                                    createTextVNode(" Duplicate")
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onClick"]),
                                                                createVNode(_component_a_button, {
                                                                  onClick: ($event) => _ctx.previewLesson(lesson)
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(EyeOutlined)),
                                                                    createTextVNode(" Preview")
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onClick"]),
                                                                createVNode(_component_a_button, {
                                                                  onClick: ($event) => moveLesson(idx, -1)
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(ArrowUpOutlined))
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onClick"]),
                                                                createVNode(_component_a_button, {
                                                                  onClick: ($event) => moveLesson(idx, 1)
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(ArrowDownOutlined))
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onClick"]),
                                                                createVNode(_component_a_popconfirm, {
                                                                  title: "Delete this lesson?",
                                                                  onConfirm: ($event) => removeLesson(idx)
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(_component_a_button, { danger: "" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(DeleteOutlined)),
                                                                        createTextVNode(" Delete")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onConfirm"])
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ])
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_a_form, { layout: "vertical" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_form_item, { label: "Estimated Time (min)" }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_input_number, {
                                                              value: lesson.duration,
                                                              "onUpdate:value": ($event) => lesson.duration = $event,
                                                              min: 1,
                                                              max: 600,
                                                              style: { "width": "100%" }
                                                            }, null, 8, ["value", "onUpdate:value"])
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode(_component_a_form_item, { label: "Prerequisite lessons (IDs)" }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_select, {
                                                              value: lesson.prerequisites,
                                                              "onUpdate:value": ($event) => lesson.prerequisites = $event,
                                                              mode: "multiple",
                                                              options: prereqOptions(idx),
                                                              placeholder: "Optional"
                                                            }, null, 8, ["value", "onUpdate:value", "options"])
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode(_component_a_form_item, { label: "Tags" }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_select, {
                                                              value: lesson.tags,
                                                              "onUpdate:value": ($event) => lesson.tags = $event,
                                                              mode: "tags",
                                                              placeholder: "Add tags"
                                                            }, null, 8, ["value", "onUpdate:value"])
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode(_component_a_form_item, { label: "Availability" }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_date_picker, {
                                                              value: lesson.unlockAt,
                                                              "onUpdate:value": ($event) => lesson.unlockAt = $event,
                                                              "show-time": "",
                                                              style: { "width": "100%" },
                                                              placeholder: "Optional"
                                                            }, null, 8, ["value", "onUpdate:value"])
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode(_component_a_form_item, { label: "Resources (links)" }, {
                                                          default: withCtx(() => [
                                                            (openBlock(true), createBlock(Fragment, null, renderList(lesson.resources, (r, rIdx) => {
                                                              return openBlock(), createBlock("div", {
                                                                key: rIdx,
                                                                class: "resource-row"
                                                              }, [
                                                                createVNode(_component_a_input, {
                                                                  value: r.title,
                                                                  "onUpdate:value": ($event) => r.title = $event,
                                                                  placeholder: "Title",
                                                                  style: { "width": "35%" }
                                                                }, null, 8, ["value", "onUpdate:value"]),
                                                                createVNode(_component_a_input, {
                                                                  value: r.url,
                                                                  "onUpdate:value": ($event) => r.url = $event,
                                                                  placeholder: "https://…",
                                                                  style: { "width": "55%", "margin-left": "8px" }
                                                                }, null, 8, ["value", "onUpdate:value"]),
                                                                createVNode(_component_a_button, {
                                                                  type: "text",
                                                                  danger: "",
                                                                  onClick: ($event) => removeResource(idx, rIdx)
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(DeleteOutlined))
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onClick"])
                                                              ]);
                                                            }), 128)),
                                                            createVNode(_component_a_button, {
                                                              size: "small",
                                                              type: "dashed",
                                                              onClick: ($event) => addResource(idx),
                                                              style: { "margin-top": "6px" }
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(PlusOutlined)),
                                                                createTextVNode(" Add resource ")
                                                              ]),
                                                              _: 1
                                                            }, 8, ["onClick"])
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode(_component_a_form_item, { label: "Attachments" }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_upload, {
                                                              "file-list": lesson.attachments,
                                                              "onUpdate:fileList": ($event) => lesson.attachments = $event,
                                                              "before-upload": () => false,
                                                              multiple: true
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_button, { size: "small" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(PaperClipOutlined)),
                                                                    createTextVNode(" Add files")
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 1
                                                            }, 8, ["file-list", "onUpdate:fileList"])
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode("div", { class: "row-right" }, [
                                                          createVNode(_component_a_space, { wrap: "" }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_button, {
                                                                onClick: ($event) => duplicateLesson(idx)
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(CopyOutlined)),
                                                                  createTextVNode(" Duplicate")
                                                                ]),
                                                                _: 1
                                                              }, 8, ["onClick"]),
                                                              createVNode(_component_a_button, {
                                                                onClick: ($event) => _ctx.previewLesson(lesson)
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(EyeOutlined)),
                                                                  createTextVNode(" Preview")
                                                                ]),
                                                                _: 1
                                                              }, 8, ["onClick"]),
                                                              createVNode(_component_a_button, {
                                                                onClick: ($event) => moveLesson(idx, -1)
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(ArrowUpOutlined))
                                                                ]),
                                                                _: 1
                                                              }, 8, ["onClick"]),
                                                              createVNode(_component_a_button, {
                                                                onClick: ($event) => moveLesson(idx, 1)
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(ArrowDownOutlined))
                                                                ]),
                                                                _: 1
                                                              }, 8, ["onClick"]),
                                                              createVNode(_component_a_popconfirm, {
                                                                title: "Delete this lesson?",
                                                                onConfirm: ($event) => removeLesson(idx)
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(_component_a_button, { danger: "" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(DeleteOutlined)),
                                                                      createTextVNode(" Delete")
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 1
                                                              }, 8, ["onConfirm"])
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ])
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_col, {
                                                xs: 24,
                                                md: 16
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_form, { layout: "vertical" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_form_item, {
                                                        label: "Title",
                                                        rules: [{ required: true, message: "Lesson title is required" }]
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_input, {
                                                            value: lesson.title,
                                                            "onUpdate:value": ($event) => lesson.title = $event,
                                                            placeholder: "e.g. Reactive primitives"
                                                          }, null, 8, ["value", "onUpdate:value"])
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode(_component_a_form_item, { label: "Type" }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_select, {
                                                            value: lesson.type,
                                                            "onUpdate:value": ($event) => lesson.type = $event,
                                                            style: { "width": "100%" }
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_select_option, { value: "video" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(VideoCameraOutlined)),
                                                                  createTextVNode(" Video ")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(_component_a_select_option, { value: "reading" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(ReadOutlined)),
                                                                  createTextVNode(" Reading ")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(_component_a_select_option, { value: "quiz" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(QuestionCircleOutlined)),
                                                                  createTextVNode(" Quiz ")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(_component_a_select_option, { value: "assignment" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(PaperClipOutlined)),
                                                                  createTextVNode(" Assignment ")
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 1
                                                          }, 8, ["value", "onUpdate:value"])
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      lesson.type === "video" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                        createVNode(_component_a_form_item, { label: "Video URL" }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_input, {
                                                              value: lesson.videoUrl,
                                                              "onUpdate:value": ($event) => lesson.videoUrl = $event,
                                                              placeholder: "https://..."
                                                            }, null, 8, ["value", "onUpdate:value"])
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode(_component_a_form_item, { label: "Transcript / Notes" }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_textarea, {
                                                              value: lesson.content,
                                                              "onUpdate:value": ($event) => lesson.content = $event,
                                                              rows: "4"
                                                            }, null, 8, ["value", "onUpdate:value"])
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ], 64)) : lesson.type === "reading" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                        createVNode(_component_a_form_item, { label: "Article / Notes" }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_textarea, {
                                                              value: lesson.content,
                                                              "onUpdate:value": ($event) => lesson.content = $event,
                                                              rows: "6",
                                                              placeholder: "Paste or write the reading content..."
                                                            }, null, 8, ["value", "onUpdate:value"])
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        readingTime(lesson.content) > 0 ? (openBlock(), createBlock(_component_a_alert, {
                                                          key: 0,
                                                          type: "info",
                                                          "show-icon": "",
                                                          message: `Estimated reading time: ${readingTime(lesson.content)} min`
                                                        }, null, 8, ["message"])) : createCommentVNode("", true)
                                                      ], 64)) : lesson.type === "assignment" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                        createVNode(_component_a_form_item, { label: "Brief" }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_textarea, {
                                                              value: lesson.content,
                                                              "onUpdate:value": ($event) => lesson.content = $event,
                                                              rows: "4",
                                                              placeholder: "Describe the task students must complete"
                                                            }, null, 8, ["value", "onUpdate:value"])
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode(_component_a_form_item, { label: "Rubric (optional)" }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_textarea, {
                                                              value: lesson.rubric,
                                                              "onUpdate:value": ($event) => lesson.rubric = $event,
                                                              rows: "3",
                                                              placeholder: "How will you grade it?"
                                                            }, null, 8, ["value", "onUpdate:value"])
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ], 64)) : lesson.type === "quiz" ? (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                        createVNode(_component_a_divider, { orientation: "left" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Questions")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        !lesson.quiz?.questions?.length ? (openBlock(), createBlock("div", { key: 0 }, [
                                                          createVNode(_component_a_empty, { description: "No questions yet" })
                                                        ])) : createCommentVNode("", true),
                                                        (openBlock(true), createBlock(Fragment, null, renderList(lesson.quiz?.questions || [], (q, qIdx) => {
                                                          return openBlock(), createBlock("div", {
                                                            key: q.id,
                                                            class: "quiz-q"
                                                          }, [
                                                            createVNode(_component_a_card, {
                                                              size: "small",
                                                              title: `Q${qIdx + 1}`,
                                                              style: { "margin-bottom": "8px" }
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_form, { layout: "vertical" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(_component_a_form_item, { label: "Question" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(_component_a_input, {
                                                                          value: q.text,
                                                                          "onUpdate:value": ($event) => q.text = $event
                                                                        }, null, 8, ["value", "onUpdate:value"])
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024),
                                                                    createVNode(_component_a_form_item, { label: "Type" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(_component_a_select, {
                                                                          value: q.type,
                                                                          "onUpdate:value": ($event) => q.type = $event,
                                                                          style: { "width": "100%" }
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createVNode(_component_a_select_option, { value: "mcq" }, {
                                                                              default: withCtx(() => [
                                                                                createTextVNode("Multiple choice")
                                                                              ]),
                                                                              _: 1
                                                                            }),
                                                                            createVNode(_component_a_select_option, { value: "tf" }, {
                                                                              default: withCtx(() => [
                                                                                createTextVNode("True/False")
                                                                              ]),
                                                                              _: 1
                                                                            }),
                                                                            createVNode(_component_a_select_option, { value: "short" }, {
                                                                              default: withCtx(() => [
                                                                                createTextVNode("Short answer")
                                                                              ]),
                                                                              _: 1
                                                                            })
                                                                          ]),
                                                                          _: 1
                                                                        }, 8, ["value", "onUpdate:value"])
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024),
                                                                    q.type === "mcq" ? (openBlock(), createBlock(_component_a_form_item, {
                                                                      key: 0,
                                                                      label: "Options"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        (openBlock(true), createBlock(Fragment, null, renderList(q.options, (opt, oIdx) => {
                                                                          return openBlock(), createBlock("div", {
                                                                            key: oIdx,
                                                                            class: "mcq-opt"
                                                                          }, [
                                                                            createVNode(_component_a_input, {
                                                                              value: opt.text,
                                                                              "onUpdate:value": ($event) => opt.text = $event,
                                                                              style: { "width": "70%" },
                                                                              placeholder: "Option text"
                                                                            }, null, 8, ["value", "onUpdate:value"]),
                                                                            createVNode(_component_a_checkbox, {
                                                                              checked: opt.correct,
                                                                              "onUpdate:checked": ($event) => opt.correct = $event,
                                                                              style: { "margin-left": "8px" }
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createTextVNode("Correct")
                                                                              ]),
                                                                              _: 1
                                                                            }, 8, ["checked", "onUpdate:checked"]),
                                                                            createVNode(_component_a_button, {
                                                                              danger: "",
                                                                              type: "text",
                                                                              onClick: ($event) => removeOption(idx, qIdx, oIdx)
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createVNode(unref(DeleteOutlined))
                                                                              ]),
                                                                              _: 1
                                                                            }, 8, ["onClick"])
                                                                          ]);
                                                                        }), 128)),
                                                                        createVNode(_component_a_button, {
                                                                          size: "small",
                                                                          type: "dashed",
                                                                          onClick: ($event) => addOption(idx, qIdx),
                                                                          style: { "margin-top": "6px" }
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createVNode(unref(PlusOutlined)),
                                                                            createTextVNode(" Add option ")
                                                                          ]),
                                                                          _: 1
                                                                        }, 8, ["onClick"])
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024)) : q.type === "tf" ? (openBlock(), createBlock(_component_a_alert, {
                                                                      key: 1,
                                                                      type: "info",
                                                                      "show-icon": "",
                                                                      message: "This will be a True/False question."
                                                                    })) : q.type === "short" ? (openBlock(), createBlock(_component_a_alert, {
                                                                      key: 2,
                                                                      type: "info",
                                                                      "show-icon": "",
                                                                      message: "This will be a short, free-text answer."
                                                                    })) : createCommentVNode("", true),
                                                                    createVNode("div", { class: "row-right" }, [
                                                                      createVNode(_component_a_space, null, {
                                                                        default: withCtx(() => [
                                                                          createVNode(_component_a_button, {
                                                                            size: "small",
                                                                            onClick: ($event) => moveQuestion(idx, qIdx, -1)
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createVNode(unref(ArrowUpOutlined))
                                                                            ]),
                                                                            _: 1
                                                                          }, 8, ["onClick"]),
                                                                          createVNode(_component_a_button, {
                                                                            size: "small",
                                                                            onClick: ($event) => moveQuestion(idx, qIdx, 1)
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createVNode(unref(ArrowDownOutlined))
                                                                            ]),
                                                                            _: 1
                                                                          }, 8, ["onClick"]),
                                                                          createVNode(_component_a_button, {
                                                                            size: "small",
                                                                            danger: "",
                                                                            onClick: ($event) => removeQuestion(idx, qIdx)
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createVNode(unref(DeleteOutlined))
                                                                            ]),
                                                                            _: 1
                                                                          }, 8, ["onClick"])
                                                                        ]),
                                                                        _: 2
                                                                      }, 1024)
                                                                    ])
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["title"])
                                                          ]);
                                                        }), 128)),
                                                        createVNode(_component_a_space, null, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_button, {
                                                              type: "dashed",
                                                              size: "small",
                                                              onClick: ($event) => addQuestion(idx)
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(PlusOutlined)),
                                                                createTextVNode(" Add question ")
                                                              ]),
                                                              _: 1
                                                            }, 8, ["onClick"]),
                                                            createVNode(_component_a_button, {
                                                              size: "small",
                                                              onClick: ($event) => seedFiveMcq(idx)
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(CopyOutlined)),
                                                                createTextVNode(" Seed 5 MCQ ")
                                                              ]),
                                                              _: 1
                                                            }, 8, ["onClick"])
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ], 64)) : createCommentVNode("", true)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(_component_a_col, {
                                                xs: 24,
                                                md: 8
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_form, { layout: "vertical" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_form_item, { label: "Estimated Time (min)" }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_input_number, {
                                                            value: lesson.duration,
                                                            "onUpdate:value": ($event) => lesson.duration = $event,
                                                            min: 1,
                                                            max: 600,
                                                            style: { "width": "100%" }
                                                          }, null, 8, ["value", "onUpdate:value"])
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode(_component_a_form_item, { label: "Prerequisite lessons (IDs)" }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_select, {
                                                            value: lesson.prerequisites,
                                                            "onUpdate:value": ($event) => lesson.prerequisites = $event,
                                                            mode: "multiple",
                                                            options: prereqOptions(idx),
                                                            placeholder: "Optional"
                                                          }, null, 8, ["value", "onUpdate:value", "options"])
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode(_component_a_form_item, { label: "Tags" }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_select, {
                                                            value: lesson.tags,
                                                            "onUpdate:value": ($event) => lesson.tags = $event,
                                                            mode: "tags",
                                                            placeholder: "Add tags"
                                                          }, null, 8, ["value", "onUpdate:value"])
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode(_component_a_form_item, { label: "Availability" }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_date_picker, {
                                                            value: lesson.unlockAt,
                                                            "onUpdate:value": ($event) => lesson.unlockAt = $event,
                                                            "show-time": "",
                                                            style: { "width": "100%" },
                                                            placeholder: "Optional"
                                                          }, null, 8, ["value", "onUpdate:value"])
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode(_component_a_form_item, { label: "Resources (links)" }, {
                                                        default: withCtx(() => [
                                                          (openBlock(true), createBlock(Fragment, null, renderList(lesson.resources, (r, rIdx) => {
                                                            return openBlock(), createBlock("div", {
                                                              key: rIdx,
                                                              class: "resource-row"
                                                            }, [
                                                              createVNode(_component_a_input, {
                                                                value: r.title,
                                                                "onUpdate:value": ($event) => r.title = $event,
                                                                placeholder: "Title",
                                                                style: { "width": "35%" }
                                                              }, null, 8, ["value", "onUpdate:value"]),
                                                              createVNode(_component_a_input, {
                                                                value: r.url,
                                                                "onUpdate:value": ($event) => r.url = $event,
                                                                placeholder: "https://…",
                                                                style: { "width": "55%", "margin-left": "8px" }
                                                              }, null, 8, ["value", "onUpdate:value"]),
                                                              createVNode(_component_a_button, {
                                                                type: "text",
                                                                danger: "",
                                                                onClick: ($event) => removeResource(idx, rIdx)
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(DeleteOutlined))
                                                                ]),
                                                                _: 1
                                                              }, 8, ["onClick"])
                                                            ]);
                                                          }), 128)),
                                                          createVNode(_component_a_button, {
                                                            size: "small",
                                                            type: "dashed",
                                                            onClick: ($event) => addResource(idx),
                                                            style: { "margin-top": "6px" }
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(PlusOutlined)),
                                                              createTextVNode(" Add resource ")
                                                            ]),
                                                            _: 1
                                                          }, 8, ["onClick"])
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode(_component_a_form_item, { label: "Attachments" }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_upload, {
                                                            "file-list": lesson.attachments,
                                                            "onUpdate:fileList": ($event) => lesson.attachments = $event,
                                                            "before-upload": () => false,
                                                            multiple: true
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_button, { size: "small" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(PaperClipOutlined)),
                                                                  createTextVNode(" Add files")
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 1
                                                          }, 8, ["file-list", "onUpdate:fileList"])
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode("div", { class: "row-right" }, [
                                                        createVNode(_component_a_space, { wrap: "" }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_button, {
                                                              onClick: ($event) => duplicateLesson(idx)
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(CopyOutlined)),
                                                                createTextVNode(" Duplicate")
                                                              ]),
                                                              _: 1
                                                            }, 8, ["onClick"]),
                                                            createVNode(_component_a_button, {
                                                              onClick: ($event) => _ctx.previewLesson(lesson)
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(EyeOutlined)),
                                                                createTextVNode(" Preview")
                                                              ]),
                                                              _: 1
                                                            }, 8, ["onClick"]),
                                                            createVNode(_component_a_button, {
                                                              onClick: ($event) => moveLesson(idx, -1)
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(ArrowUpOutlined))
                                                              ]),
                                                              _: 1
                                                            }, 8, ["onClick"]),
                                                            createVNode(_component_a_button, {
                                                              onClick: ($event) => moveLesson(idx, 1)
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(ArrowDownOutlined))
                                                              ]),
                                                              _: 1
                                                            }, 8, ["onClick"]),
                                                            createVNode(_component_a_popconfirm, {
                                                              title: "Delete this lesson?",
                                                              onConfirm: ($event) => removeLesson(idx)
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_button, { danger: "" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(DeleteOutlined)),
                                                                    createTextVNode(" Delete")
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 1
                                                            }, 8, ["onConfirm"])
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                      if (lessonWarnings(idx).length) {
                                        _push6(`<div class="lesson-warn" data-v-a217beca${_scopeId5}><!--[-->`);
                                        ssrRenderList(lessonWarnings(idx), (w, wi) => {
                                          _push6(ssrRenderComponent(_component_a_alert, {
                                            key: wi,
                                            type: "warning",
                                            "show-icon": "",
                                            message: w,
                                            style: { "margin-top": "8px" }
                                          }, null, _parent6, _scopeId5));
                                        });
                                        _push6(`<!--]--></div>`);
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                    } else {
                                      return [
                                        createVNode(_component_a_row, { gutter: 16 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_col, {
                                              xs: 24,
                                              md: 16
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_form, { layout: "vertical" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_form_item, {
                                                      label: "Title",
                                                      rules: [{ required: true, message: "Lesson title is required" }]
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_input, {
                                                          value: lesson.title,
                                                          "onUpdate:value": ($event) => lesson.title = $event,
                                                          placeholder: "e.g. Reactive primitives"
                                                        }, null, 8, ["value", "onUpdate:value"])
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode(_component_a_form_item, { label: "Type" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_select, {
                                                          value: lesson.type,
                                                          "onUpdate:value": ($event) => lesson.type = $event,
                                                          style: { "width": "100%" }
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_select_option, { value: "video" }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(VideoCameraOutlined)),
                                                                createTextVNode(" Video ")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(_component_a_select_option, { value: "reading" }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(ReadOutlined)),
                                                                createTextVNode(" Reading ")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(_component_a_select_option, { value: "quiz" }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(QuestionCircleOutlined)),
                                                                createTextVNode(" Quiz ")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(_component_a_select_option, { value: "assignment" }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(PaperClipOutlined)),
                                                                createTextVNode(" Assignment ")
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        }, 8, ["value", "onUpdate:value"])
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    lesson.type === "video" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                      createVNode(_component_a_form_item, { label: "Video URL" }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_input, {
                                                            value: lesson.videoUrl,
                                                            "onUpdate:value": ($event) => lesson.videoUrl = $event,
                                                            placeholder: "https://..."
                                                          }, null, 8, ["value", "onUpdate:value"])
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode(_component_a_form_item, { label: "Transcript / Notes" }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_textarea, {
                                                            value: lesson.content,
                                                            "onUpdate:value": ($event) => lesson.content = $event,
                                                            rows: "4"
                                                          }, null, 8, ["value", "onUpdate:value"])
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ], 64)) : lesson.type === "reading" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                      createVNode(_component_a_form_item, { label: "Article / Notes" }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_textarea, {
                                                            value: lesson.content,
                                                            "onUpdate:value": ($event) => lesson.content = $event,
                                                            rows: "6",
                                                            placeholder: "Paste or write the reading content..."
                                                          }, null, 8, ["value", "onUpdate:value"])
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      readingTime(lesson.content) > 0 ? (openBlock(), createBlock(_component_a_alert, {
                                                        key: 0,
                                                        type: "info",
                                                        "show-icon": "",
                                                        message: `Estimated reading time: ${readingTime(lesson.content)} min`
                                                      }, null, 8, ["message"])) : createCommentVNode("", true)
                                                    ], 64)) : lesson.type === "assignment" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                      createVNode(_component_a_form_item, { label: "Brief" }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_textarea, {
                                                            value: lesson.content,
                                                            "onUpdate:value": ($event) => lesson.content = $event,
                                                            rows: "4",
                                                            placeholder: "Describe the task students must complete"
                                                          }, null, 8, ["value", "onUpdate:value"])
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode(_component_a_form_item, { label: "Rubric (optional)" }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_textarea, {
                                                            value: lesson.rubric,
                                                            "onUpdate:value": ($event) => lesson.rubric = $event,
                                                            rows: "3",
                                                            placeholder: "How will you grade it?"
                                                          }, null, 8, ["value", "onUpdate:value"])
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ], 64)) : lesson.type === "quiz" ? (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                      createVNode(_component_a_divider, { orientation: "left" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Questions")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      !lesson.quiz?.questions?.length ? (openBlock(), createBlock("div", { key: 0 }, [
                                                        createVNode(_component_a_empty, { description: "No questions yet" })
                                                      ])) : createCommentVNode("", true),
                                                      (openBlock(true), createBlock(Fragment, null, renderList(lesson.quiz?.questions || [], (q, qIdx) => {
                                                        return openBlock(), createBlock("div", {
                                                          key: q.id,
                                                          class: "quiz-q"
                                                        }, [
                                                          createVNode(_component_a_card, {
                                                            size: "small",
                                                            title: `Q${qIdx + 1}`,
                                                            style: { "margin-bottom": "8px" }
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_form, { layout: "vertical" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(_component_a_form_item, { label: "Question" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(_component_a_input, {
                                                                        value: q.text,
                                                                        "onUpdate:value": ($event) => q.text = $event
                                                                      }, null, 8, ["value", "onUpdate:value"])
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024),
                                                                  createVNode(_component_a_form_item, { label: "Type" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(_component_a_select, {
                                                                        value: q.type,
                                                                        "onUpdate:value": ($event) => q.type = $event,
                                                                        style: { "width": "100%" }
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(_component_a_select_option, { value: "mcq" }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode("Multiple choice")
                                                                            ]),
                                                                            _: 1
                                                                          }),
                                                                          createVNode(_component_a_select_option, { value: "tf" }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode("True/False")
                                                                            ]),
                                                                            _: 1
                                                                          }),
                                                                          createVNode(_component_a_select_option, { value: "short" }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode("Short answer")
                                                                            ]),
                                                                            _: 1
                                                                          })
                                                                        ]),
                                                                        _: 1
                                                                      }, 8, ["value", "onUpdate:value"])
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024),
                                                                  q.type === "mcq" ? (openBlock(), createBlock(_component_a_form_item, {
                                                                    key: 0,
                                                                    label: "Options"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      (openBlock(true), createBlock(Fragment, null, renderList(q.options, (opt, oIdx) => {
                                                                        return openBlock(), createBlock("div", {
                                                                          key: oIdx,
                                                                          class: "mcq-opt"
                                                                        }, [
                                                                          createVNode(_component_a_input, {
                                                                            value: opt.text,
                                                                            "onUpdate:value": ($event) => opt.text = $event,
                                                                            style: { "width": "70%" },
                                                                            placeholder: "Option text"
                                                                          }, null, 8, ["value", "onUpdate:value"]),
                                                                          createVNode(_component_a_checkbox, {
                                                                            checked: opt.correct,
                                                                            "onUpdate:checked": ($event) => opt.correct = $event,
                                                                            style: { "margin-left": "8px" }
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode("Correct")
                                                                            ]),
                                                                            _: 1
                                                                          }, 8, ["checked", "onUpdate:checked"]),
                                                                          createVNode(_component_a_button, {
                                                                            danger: "",
                                                                            type: "text",
                                                                            onClick: ($event) => removeOption(idx, qIdx, oIdx)
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createVNode(unref(DeleteOutlined))
                                                                            ]),
                                                                            _: 1
                                                                          }, 8, ["onClick"])
                                                                        ]);
                                                                      }), 128)),
                                                                      createVNode(_component_a_button, {
                                                                        size: "small",
                                                                        type: "dashed",
                                                                        onClick: ($event) => addOption(idx, qIdx),
                                                                        style: { "margin-top": "6px" }
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(PlusOutlined)),
                                                                          createTextVNode(" Add option ")
                                                                        ]),
                                                                        _: 1
                                                                      }, 8, ["onClick"])
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024)) : q.type === "tf" ? (openBlock(), createBlock(_component_a_alert, {
                                                                    key: 1,
                                                                    type: "info",
                                                                    "show-icon": "",
                                                                    message: "This will be a True/False question."
                                                                  })) : q.type === "short" ? (openBlock(), createBlock(_component_a_alert, {
                                                                    key: 2,
                                                                    type: "info",
                                                                    "show-icon": "",
                                                                    message: "This will be a short, free-text answer."
                                                                  })) : createCommentVNode("", true),
                                                                  createVNode("div", { class: "row-right" }, [
                                                                    createVNode(_component_a_space, null, {
                                                                      default: withCtx(() => [
                                                                        createVNode(_component_a_button, {
                                                                          size: "small",
                                                                          onClick: ($event) => moveQuestion(idx, qIdx, -1)
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createVNode(unref(ArrowUpOutlined))
                                                                          ]),
                                                                          _: 1
                                                                        }, 8, ["onClick"]),
                                                                        createVNode(_component_a_button, {
                                                                          size: "small",
                                                                          onClick: ($event) => moveQuestion(idx, qIdx, 1)
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createVNode(unref(ArrowDownOutlined))
                                                                          ]),
                                                                          _: 1
                                                                        }, 8, ["onClick"]),
                                                                        createVNode(_component_a_button, {
                                                                          size: "small",
                                                                          danger: "",
                                                                          onClick: ($event) => removeQuestion(idx, qIdx)
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createVNode(unref(DeleteOutlined))
                                                                          ]),
                                                                          _: 1
                                                                        }, 8, ["onClick"])
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024)
                                                                  ])
                                                                ]),
                                                                _: 2
                                                              }, 1024)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["title"])
                                                        ]);
                                                      }), 128)),
                                                      createVNode(_component_a_space, null, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_button, {
                                                            type: "dashed",
                                                            size: "small",
                                                            onClick: ($event) => addQuestion(idx)
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(PlusOutlined)),
                                                              createTextVNode(" Add question ")
                                                            ]),
                                                            _: 1
                                                          }, 8, ["onClick"]),
                                                          createVNode(_component_a_button, {
                                                            size: "small",
                                                            onClick: ($event) => seedFiveMcq(idx)
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(CopyOutlined)),
                                                              createTextVNode(" Seed 5 MCQ ")
                                                            ]),
                                                            _: 1
                                                          }, 8, ["onClick"])
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ], 64)) : createCommentVNode("", true)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(_component_a_col, {
                                              xs: 24,
                                              md: 8
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_form, { layout: "vertical" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_form_item, { label: "Estimated Time (min)" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_input_number, {
                                                          value: lesson.duration,
                                                          "onUpdate:value": ($event) => lesson.duration = $event,
                                                          min: 1,
                                                          max: 600,
                                                          style: { "width": "100%" }
                                                        }, null, 8, ["value", "onUpdate:value"])
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode(_component_a_form_item, { label: "Prerequisite lessons (IDs)" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_select, {
                                                          value: lesson.prerequisites,
                                                          "onUpdate:value": ($event) => lesson.prerequisites = $event,
                                                          mode: "multiple",
                                                          options: prereqOptions(idx),
                                                          placeholder: "Optional"
                                                        }, null, 8, ["value", "onUpdate:value", "options"])
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode(_component_a_form_item, { label: "Tags" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_select, {
                                                          value: lesson.tags,
                                                          "onUpdate:value": ($event) => lesson.tags = $event,
                                                          mode: "tags",
                                                          placeholder: "Add tags"
                                                        }, null, 8, ["value", "onUpdate:value"])
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode(_component_a_form_item, { label: "Availability" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_date_picker, {
                                                          value: lesson.unlockAt,
                                                          "onUpdate:value": ($event) => lesson.unlockAt = $event,
                                                          "show-time": "",
                                                          style: { "width": "100%" },
                                                          placeholder: "Optional"
                                                        }, null, 8, ["value", "onUpdate:value"])
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode(_component_a_form_item, { label: "Resources (links)" }, {
                                                      default: withCtx(() => [
                                                        (openBlock(true), createBlock(Fragment, null, renderList(lesson.resources, (r, rIdx) => {
                                                          return openBlock(), createBlock("div", {
                                                            key: rIdx,
                                                            class: "resource-row"
                                                          }, [
                                                            createVNode(_component_a_input, {
                                                              value: r.title,
                                                              "onUpdate:value": ($event) => r.title = $event,
                                                              placeholder: "Title",
                                                              style: { "width": "35%" }
                                                            }, null, 8, ["value", "onUpdate:value"]),
                                                            createVNode(_component_a_input, {
                                                              value: r.url,
                                                              "onUpdate:value": ($event) => r.url = $event,
                                                              placeholder: "https://…",
                                                              style: { "width": "55%", "margin-left": "8px" }
                                                            }, null, 8, ["value", "onUpdate:value"]),
                                                            createVNode(_component_a_button, {
                                                              type: "text",
                                                              danger: "",
                                                              onClick: ($event) => removeResource(idx, rIdx)
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(DeleteOutlined))
                                                              ]),
                                                              _: 1
                                                            }, 8, ["onClick"])
                                                          ]);
                                                        }), 128)),
                                                        createVNode(_component_a_button, {
                                                          size: "small",
                                                          type: "dashed",
                                                          onClick: ($event) => addResource(idx),
                                                          style: { "margin-top": "6px" }
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(PlusOutlined)),
                                                            createTextVNode(" Add resource ")
                                                          ]),
                                                          _: 1
                                                        }, 8, ["onClick"])
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode(_component_a_form_item, { label: "Attachments" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_upload, {
                                                          "file-list": lesson.attachments,
                                                          "onUpdate:fileList": ($event) => lesson.attachments = $event,
                                                          "before-upload": () => false,
                                                          multiple: true
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_button, { size: "small" }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(PaperClipOutlined)),
                                                                createTextVNode(" Add files")
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        }, 8, ["file-list", "onUpdate:fileList"])
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode("div", { class: "row-right" }, [
                                                      createVNode(_component_a_space, { wrap: "" }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_button, {
                                                            onClick: ($event) => duplicateLesson(idx)
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(CopyOutlined)),
                                                              createTextVNode(" Duplicate")
                                                            ]),
                                                            _: 1
                                                          }, 8, ["onClick"]),
                                                          createVNode(_component_a_button, {
                                                            onClick: ($event) => _ctx.previewLesson(lesson)
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(EyeOutlined)),
                                                              createTextVNode(" Preview")
                                                            ]),
                                                            _: 1
                                                          }, 8, ["onClick"]),
                                                          createVNode(_component_a_button, {
                                                            onClick: ($event) => moveLesson(idx, -1)
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(ArrowUpOutlined))
                                                            ]),
                                                            _: 1
                                                          }, 8, ["onClick"]),
                                                          createVNode(_component_a_button, {
                                                            onClick: ($event) => moveLesson(idx, 1)
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(ArrowDownOutlined))
                                                            ]),
                                                            _: 1
                                                          }, 8, ["onClick"]),
                                                          createVNode(_component_a_popconfirm, {
                                                            title: "Delete this lesson?",
                                                            onConfirm: ($event) => removeLesson(idx)
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_button, { danger: "" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(DeleteOutlined)),
                                                                  createTextVNode(" Delete")
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 1
                                                          }, 8, ["onConfirm"])
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        lessonWarnings(idx).length ? (openBlock(), createBlock("div", {
                                          key: 0,
                                          class: "lesson-warn"
                                        }, [
                                          (openBlock(true), createBlock(Fragment, null, renderList(lessonWarnings(idx), (w, wi) => {
                                            return openBlock(), createBlock(_component_a_alert, {
                                              key: wi,
                                              type: "warning",
                                              "show-icon": "",
                                              message: w,
                                              style: { "margin-top": "8px" }
                                            }, null, 8, ["message"]);
                                          }), 128))
                                        ])) : createCommentVNode("", true)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (openBlock(true), createBlock(Fragment, null, renderList(moduleData.lessons, (lesson, idx) => {
                                  return openBlock(), createBlock(_component_a_collapse_panel, {
                                    key: lesson.id,
                                    header: panelTitle(lesson, idx)
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_row, { gutter: 16 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_col, {
                                            xs: 24,
                                            md: 16
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_form, { layout: "vertical" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_form_item, {
                                                    label: "Title",
                                                    rules: [{ required: true, message: "Lesson title is required" }]
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_input, {
                                                        value: lesson.title,
                                                        "onUpdate:value": ($event) => lesson.title = $event,
                                                        placeholder: "e.g. Reactive primitives"
                                                      }, null, 8, ["value", "onUpdate:value"])
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode(_component_a_form_item, { label: "Type" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_select, {
                                                        value: lesson.type,
                                                        "onUpdate:value": ($event) => lesson.type = $event,
                                                        style: { "width": "100%" }
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_select_option, { value: "video" }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(VideoCameraOutlined)),
                                                              createTextVNode(" Video ")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(_component_a_select_option, { value: "reading" }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(ReadOutlined)),
                                                              createTextVNode(" Reading ")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(_component_a_select_option, { value: "quiz" }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(QuestionCircleOutlined)),
                                                              createTextVNode(" Quiz ")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(_component_a_select_option, { value: "assignment" }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(PaperClipOutlined)),
                                                              createTextVNode(" Assignment ")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }, 8, ["value", "onUpdate:value"])
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  lesson.type === "video" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                    createVNode(_component_a_form_item, { label: "Video URL" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_input, {
                                                          value: lesson.videoUrl,
                                                          "onUpdate:value": ($event) => lesson.videoUrl = $event,
                                                          placeholder: "https://..."
                                                        }, null, 8, ["value", "onUpdate:value"])
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode(_component_a_form_item, { label: "Transcript / Notes" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_textarea, {
                                                          value: lesson.content,
                                                          "onUpdate:value": ($event) => lesson.content = $event,
                                                          rows: "4"
                                                        }, null, 8, ["value", "onUpdate:value"])
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ], 64)) : lesson.type === "reading" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                    createVNode(_component_a_form_item, { label: "Article / Notes" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_textarea, {
                                                          value: lesson.content,
                                                          "onUpdate:value": ($event) => lesson.content = $event,
                                                          rows: "6",
                                                          placeholder: "Paste or write the reading content..."
                                                        }, null, 8, ["value", "onUpdate:value"])
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    readingTime(lesson.content) > 0 ? (openBlock(), createBlock(_component_a_alert, {
                                                      key: 0,
                                                      type: "info",
                                                      "show-icon": "",
                                                      message: `Estimated reading time: ${readingTime(lesson.content)} min`
                                                    }, null, 8, ["message"])) : createCommentVNode("", true)
                                                  ], 64)) : lesson.type === "assignment" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                    createVNode(_component_a_form_item, { label: "Brief" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_textarea, {
                                                          value: lesson.content,
                                                          "onUpdate:value": ($event) => lesson.content = $event,
                                                          rows: "4",
                                                          placeholder: "Describe the task students must complete"
                                                        }, null, 8, ["value", "onUpdate:value"])
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode(_component_a_form_item, { label: "Rubric (optional)" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_textarea, {
                                                          value: lesson.rubric,
                                                          "onUpdate:value": ($event) => lesson.rubric = $event,
                                                          rows: "3",
                                                          placeholder: "How will you grade it?"
                                                        }, null, 8, ["value", "onUpdate:value"])
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ], 64)) : lesson.type === "quiz" ? (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                    createVNode(_component_a_divider, { orientation: "left" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Questions")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    !lesson.quiz?.questions?.length ? (openBlock(), createBlock("div", { key: 0 }, [
                                                      createVNode(_component_a_empty, { description: "No questions yet" })
                                                    ])) : createCommentVNode("", true),
                                                    (openBlock(true), createBlock(Fragment, null, renderList(lesson.quiz?.questions || [], (q, qIdx) => {
                                                      return openBlock(), createBlock("div", {
                                                        key: q.id,
                                                        class: "quiz-q"
                                                      }, [
                                                        createVNode(_component_a_card, {
                                                          size: "small",
                                                          title: `Q${qIdx + 1}`,
                                                          style: { "margin-bottom": "8px" }
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_form, { layout: "vertical" }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_form_item, { label: "Question" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(_component_a_input, {
                                                                      value: q.text,
                                                                      "onUpdate:value": ($event) => q.text = $event
                                                                    }, null, 8, ["value", "onUpdate:value"])
                                                                  ]),
                                                                  _: 2
                                                                }, 1024),
                                                                createVNode(_component_a_form_item, { label: "Type" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(_component_a_select, {
                                                                      value: q.type,
                                                                      "onUpdate:value": ($event) => q.type = $event,
                                                                      style: { "width": "100%" }
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(_component_a_select_option, { value: "mcq" }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode("Multiple choice")
                                                                          ]),
                                                                          _: 1
                                                                        }),
                                                                        createVNode(_component_a_select_option, { value: "tf" }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode("True/False")
                                                                          ]),
                                                                          _: 1
                                                                        }),
                                                                        createVNode(_component_a_select_option, { value: "short" }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode("Short answer")
                                                                          ]),
                                                                          _: 1
                                                                        })
                                                                      ]),
                                                                      _: 1
                                                                    }, 8, ["value", "onUpdate:value"])
                                                                  ]),
                                                                  _: 2
                                                                }, 1024),
                                                                q.type === "mcq" ? (openBlock(), createBlock(_component_a_form_item, {
                                                                  key: 0,
                                                                  label: "Options"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    (openBlock(true), createBlock(Fragment, null, renderList(q.options, (opt, oIdx) => {
                                                                      return openBlock(), createBlock("div", {
                                                                        key: oIdx,
                                                                        class: "mcq-opt"
                                                                      }, [
                                                                        createVNode(_component_a_input, {
                                                                          value: opt.text,
                                                                          "onUpdate:value": ($event) => opt.text = $event,
                                                                          style: { "width": "70%" },
                                                                          placeholder: "Option text"
                                                                        }, null, 8, ["value", "onUpdate:value"]),
                                                                        createVNode(_component_a_checkbox, {
                                                                          checked: opt.correct,
                                                                          "onUpdate:checked": ($event) => opt.correct = $event,
                                                                          style: { "margin-left": "8px" }
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode("Correct")
                                                                          ]),
                                                                          _: 1
                                                                        }, 8, ["checked", "onUpdate:checked"]),
                                                                        createVNode(_component_a_button, {
                                                                          danger: "",
                                                                          type: "text",
                                                                          onClick: ($event) => removeOption(idx, qIdx, oIdx)
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createVNode(unref(DeleteOutlined))
                                                                          ]),
                                                                          _: 1
                                                                        }, 8, ["onClick"])
                                                                      ]);
                                                                    }), 128)),
                                                                    createVNode(_component_a_button, {
                                                                      size: "small",
                                                                      type: "dashed",
                                                                      onClick: ($event) => addOption(idx, qIdx),
                                                                      style: { "margin-top": "6px" }
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(PlusOutlined)),
                                                                        createTextVNode(" Add option ")
                                                                      ]),
                                                                      _: 1
                                                                    }, 8, ["onClick"])
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)) : q.type === "tf" ? (openBlock(), createBlock(_component_a_alert, {
                                                                  key: 1,
                                                                  type: "info",
                                                                  "show-icon": "",
                                                                  message: "This will be a True/False question."
                                                                })) : q.type === "short" ? (openBlock(), createBlock(_component_a_alert, {
                                                                  key: 2,
                                                                  type: "info",
                                                                  "show-icon": "",
                                                                  message: "This will be a short, free-text answer."
                                                                })) : createCommentVNode("", true),
                                                                createVNode("div", { class: "row-right" }, [
                                                                  createVNode(_component_a_space, null, {
                                                                    default: withCtx(() => [
                                                                      createVNode(_component_a_button, {
                                                                        size: "small",
                                                                        onClick: ($event) => moveQuestion(idx, qIdx, -1)
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(ArrowUpOutlined))
                                                                        ]),
                                                                        _: 1
                                                                      }, 8, ["onClick"]),
                                                                      createVNode(_component_a_button, {
                                                                        size: "small",
                                                                        onClick: ($event) => moveQuestion(idx, qIdx, 1)
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(ArrowDownOutlined))
                                                                        ]),
                                                                        _: 1
                                                                      }, 8, ["onClick"]),
                                                                      createVNode(_component_a_button, {
                                                                        size: "small",
                                                                        danger: "",
                                                                        onClick: ($event) => removeQuestion(idx, qIdx)
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(DeleteOutlined))
                                                                        ]),
                                                                        _: 1
                                                                      }, 8, ["onClick"])
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024)
                                                                ])
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["title"])
                                                      ]);
                                                    }), 128)),
                                                    createVNode(_component_a_space, null, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_button, {
                                                          type: "dashed",
                                                          size: "small",
                                                          onClick: ($event) => addQuestion(idx)
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(PlusOutlined)),
                                                            createTextVNode(" Add question ")
                                                          ]),
                                                          _: 1
                                                        }, 8, ["onClick"]),
                                                        createVNode(_component_a_button, {
                                                          size: "small",
                                                          onClick: ($event) => seedFiveMcq(idx)
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(CopyOutlined)),
                                                            createTextVNode(" Seed 5 MCQ ")
                                                          ]),
                                                          _: 1
                                                        }, 8, ["onClick"])
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ], 64)) : createCommentVNode("", true)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_a_col, {
                                            xs: 24,
                                            md: 8
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_form, { layout: "vertical" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_form_item, { label: "Estimated Time (min)" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_input_number, {
                                                        value: lesson.duration,
                                                        "onUpdate:value": ($event) => lesson.duration = $event,
                                                        min: 1,
                                                        max: 600,
                                                        style: { "width": "100%" }
                                                      }, null, 8, ["value", "onUpdate:value"])
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode(_component_a_form_item, { label: "Prerequisite lessons (IDs)" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_select, {
                                                        value: lesson.prerequisites,
                                                        "onUpdate:value": ($event) => lesson.prerequisites = $event,
                                                        mode: "multiple",
                                                        options: prereqOptions(idx),
                                                        placeholder: "Optional"
                                                      }, null, 8, ["value", "onUpdate:value", "options"])
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode(_component_a_form_item, { label: "Tags" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_select, {
                                                        value: lesson.tags,
                                                        "onUpdate:value": ($event) => lesson.tags = $event,
                                                        mode: "tags",
                                                        placeholder: "Add tags"
                                                      }, null, 8, ["value", "onUpdate:value"])
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode(_component_a_form_item, { label: "Availability" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_date_picker, {
                                                        value: lesson.unlockAt,
                                                        "onUpdate:value": ($event) => lesson.unlockAt = $event,
                                                        "show-time": "",
                                                        style: { "width": "100%" },
                                                        placeholder: "Optional"
                                                      }, null, 8, ["value", "onUpdate:value"])
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode(_component_a_form_item, { label: "Resources (links)" }, {
                                                    default: withCtx(() => [
                                                      (openBlock(true), createBlock(Fragment, null, renderList(lesson.resources, (r, rIdx) => {
                                                        return openBlock(), createBlock("div", {
                                                          key: rIdx,
                                                          class: "resource-row"
                                                        }, [
                                                          createVNode(_component_a_input, {
                                                            value: r.title,
                                                            "onUpdate:value": ($event) => r.title = $event,
                                                            placeholder: "Title",
                                                            style: { "width": "35%" }
                                                          }, null, 8, ["value", "onUpdate:value"]),
                                                          createVNode(_component_a_input, {
                                                            value: r.url,
                                                            "onUpdate:value": ($event) => r.url = $event,
                                                            placeholder: "https://…",
                                                            style: { "width": "55%", "margin-left": "8px" }
                                                          }, null, 8, ["value", "onUpdate:value"]),
                                                          createVNode(_component_a_button, {
                                                            type: "text",
                                                            danger: "",
                                                            onClick: ($event) => removeResource(idx, rIdx)
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(DeleteOutlined))
                                                            ]),
                                                            _: 1
                                                          }, 8, ["onClick"])
                                                        ]);
                                                      }), 128)),
                                                      createVNode(_component_a_button, {
                                                        size: "small",
                                                        type: "dashed",
                                                        onClick: ($event) => addResource(idx),
                                                        style: { "margin-top": "6px" }
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(PlusOutlined)),
                                                          createTextVNode(" Add resource ")
                                                        ]),
                                                        _: 1
                                                      }, 8, ["onClick"])
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode(_component_a_form_item, { label: "Attachments" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_upload, {
                                                        "file-list": lesson.attachments,
                                                        "onUpdate:fileList": ($event) => lesson.attachments = $event,
                                                        "before-upload": () => false,
                                                        multiple: true
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_button, { size: "small" }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(PaperClipOutlined)),
                                                              createTextVNode(" Add files")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }, 8, ["file-list", "onUpdate:fileList"])
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode("div", { class: "row-right" }, [
                                                    createVNode(_component_a_space, { wrap: "" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_button, {
                                                          onClick: ($event) => duplicateLesson(idx)
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(CopyOutlined)),
                                                            createTextVNode(" Duplicate")
                                                          ]),
                                                          _: 1
                                                        }, 8, ["onClick"]),
                                                        createVNode(_component_a_button, {
                                                          onClick: ($event) => _ctx.previewLesson(lesson)
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(EyeOutlined)),
                                                            createTextVNode(" Preview")
                                                          ]),
                                                          _: 1
                                                        }, 8, ["onClick"]),
                                                        createVNode(_component_a_button, {
                                                          onClick: ($event) => moveLesson(idx, -1)
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(ArrowUpOutlined))
                                                          ]),
                                                          _: 1
                                                        }, 8, ["onClick"]),
                                                        createVNode(_component_a_button, {
                                                          onClick: ($event) => moveLesson(idx, 1)
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(ArrowDownOutlined))
                                                          ]),
                                                          _: 1
                                                        }, 8, ["onClick"]),
                                                        createVNode(_component_a_popconfirm, {
                                                          title: "Delete this lesson?",
                                                          onConfirm: ($event) => removeLesson(idx)
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_button, { danger: "" }, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(DeleteOutlined)),
                                                                createTextVNode(" Delete")
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        }, 8, ["onConfirm"])
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      lessonWarnings(idx).length ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "lesson-warn"
                                      }, [
                                        (openBlock(true), createBlock(Fragment, null, renderList(lessonWarnings(idx), (w, wi) => {
                                          return openBlock(), createBlock(_component_a_alert, {
                                            key: wi,
                                            type: "warning",
                                            "show-icon": "",
                                            message: w,
                                            style: { "margin-top": "8px" }
                                          }, null, 8, ["message"]);
                                        }), 128))
                                      ])) : createCommentVNode("", true)
                                    ]),
                                    _: 2
                                  }, 1032, ["header"]);
                                }), 128))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_form_item, {
                            label: "Module Title",
                            name: "title",
                            rules: [{ required: true, message: "Title is required" }],
                            "validate-status": moduleData.title ? "" : "warning",
                            help: !moduleData.title ? "A strong, student-focused title helps discoverability." : ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_input, {
                                value: moduleData.title,
                                "onUpdate:value": ($event) => moduleData.title = $event,
                                placeholder: "e.g. Composition API Basics",
                                onBlur: maybeGenerateSlug
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }, 8, ["validate-status", "help"]),
                          createVNode(_component_a_row, { gutter: 16 }, {
                            default: withCtx(() => [
                              createVNode(_component_a_col, {
                                xs: 24,
                                md: 16
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_form_item, { label: "Description" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_textarea, {
                                        value: moduleData.description,
                                        "onUpdate:value": ($event) => moduleData.description = $event,
                                        rows: "3",
                                        placeholder: "What will students learn in this module?"
                                      }, null, 8, ["value", "onUpdate:value"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_form_item, { label: "Learning Objectives (tags)" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_select, {
                                        value: moduleData.objectives,
                                        "onUpdate:value": ($event) => moduleData.objectives = $event,
                                        mode: "tags",
                                        placeholder: "Add objectives (press Enter)",
                                        "token-separators": [","],
                                        options: objectiveSuggestions
                                      }, null, 8, ["value", "onUpdate:value"]),
                                      createVNode(_component_a_typography_text, { type: "secondary" }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Tip: Keep objectives measurable and concise. ")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_col, {
                                xs: 24,
                                md: 8
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_form_item, { label: "Visibility" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_switch, {
                                        checked: moduleData.isPublic,
                                        "onUpdate:checked": ($event) => moduleData.isPublic = $event,
                                        "checked-children": "Public",
                                        "un-checked-children": "Private"
                                      }, null, 8, ["checked", "onUpdate:checked"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_form_item, { label: "Module Availability" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_date_picker, {
                                        value: moduleData.unlockAt,
                                        "onUpdate:value": ($event) => moduleData.unlockAt = $event,
                                        "show-time": "",
                                        style: { "width": "100%" },
                                        placeholder: "Optional unlock date/time"
                                      }, null, 8, ["value", "onUpdate:value"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_form_item, { label: "Module Slug (URL)" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_input, {
                                        value: moduleData.slug,
                                        "onUpdate:value": ($event) => moduleData.slug = $event,
                                        placeholder: "auto-generated-from-title"
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
                          createVNode(_component_a_divider, { orientation: "left" }, {
                            default: withCtx(() => [
                              createTextVNode(" Lessons "),
                              createVNode("span", { class: "muted" }, "(" + toDisplayString(moduleData.lessons.length) + ")", 1)
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_space, {
                            style: { "margin-bottom": "12px" },
                            wrap: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, {
                                type: "dashed",
                                onClick: ($event) => addLesson()
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(PlusOutlined)),
                                  createTextVNode(" Add lesson ")
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode(_component_a_button, { onClick: expandAll }, {
                                default: withCtx(() => [
                                  createTextVNode("Expand all")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_button, { onClick: collapseAll }, {
                                default: withCtx(() => [
                                  createTextVNode("Collapse all")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_button, { onClick: addQuizCheckpoint }, {
                                default: withCtx(() => [
                                  createVNode(unref(QuestionCircleOutlined)),
                                  createTextVNode(" Add checkpoint quiz ")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_button, { onClick: addMiniAssignment }, {
                                default: withCtx(() => [
                                  createVNode(unref(PaperClipOutlined)),
                                  createTextVNode(" Add mini assignment ")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_button, { onClick: addVideoIntro }, {
                                default: withCtx(() => [
                                  createVNode(unref(VideoCameraOutlined)),
                                  createTextVNode(" Add intro video ")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_tag, { color: "blue" }, {
                                default: withCtx(() => [
                                  createTextVNode("Total time: " + toDisplayString(totalMinutes.value) + " min", 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_space, { style: { "margin-bottom": "12px" } }, {
                            default: withCtx(() => [
                              createVNode(_component_a_tooltip, { title: "Undo (Ctrl/Cmd+Z)" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_button, {
                                    disabled: !canUndo.value,
                                    onClick: undoChange
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(ArrowLeftOutlined)),
                                      createTextVNode(" Undo ")
                                    ]),
                                    _: 1
                                  }, 8, ["disabled"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_tooltip, { title: "Redo (Ctrl/Cmd+Shift+Z)" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_button, {
                                    disabled: !canRedo.value,
                                    onClick: redoChange
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(ArrowRightOutlined)),
                                      createTextVNode(" Redo ")
                                    ]),
                                    _: 1
                                  }, 8, ["disabled"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_divider, { type: "vertical" }),
                              createVNode(_component_a_typography_text, { type: "secondary" }, {
                                default: withCtx(() => [
                                  createTextVNode("History: " + toDisplayString(historyIndex.value + 1) + " / " + toDisplayString(history.value.length), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_collapse, {
                            activeKey: activePanels.value,
                            "onUpdate:activeKey": ($event) => activePanels.value = $event
                          }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(moduleData.lessons, (lesson, idx) => {
                                return openBlock(), createBlock(_component_a_collapse_panel, {
                                  key: lesson.id,
                                  header: panelTitle(lesson, idx)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_row, { gutter: 16 }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_col, {
                                          xs: 24,
                                          md: 16
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_form, { layout: "vertical" }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_form_item, {
                                                  label: "Title",
                                                  rules: [{ required: true, message: "Lesson title is required" }]
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_input, {
                                                      value: lesson.title,
                                                      "onUpdate:value": ($event) => lesson.title = $event,
                                                      placeholder: "e.g. Reactive primitives"
                                                    }, null, 8, ["value", "onUpdate:value"])
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(_component_a_form_item, { label: "Type" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_select, {
                                                      value: lesson.type,
                                                      "onUpdate:value": ($event) => lesson.type = $event,
                                                      style: { "width": "100%" }
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_select_option, { value: "video" }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(VideoCameraOutlined)),
                                                            createTextVNode(" Video ")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(_component_a_select_option, { value: "reading" }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(ReadOutlined)),
                                                            createTextVNode(" Reading ")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(_component_a_select_option, { value: "quiz" }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(QuestionCircleOutlined)),
                                                            createTextVNode(" Quiz ")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(_component_a_select_option, { value: "assignment" }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(PaperClipOutlined)),
                                                            createTextVNode(" Assignment ")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }, 8, ["value", "onUpdate:value"])
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                lesson.type === "video" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                  createVNode(_component_a_form_item, { label: "Video URL" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_input, {
                                                        value: lesson.videoUrl,
                                                        "onUpdate:value": ($event) => lesson.videoUrl = $event,
                                                        placeholder: "https://..."
                                                      }, null, 8, ["value", "onUpdate:value"])
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode(_component_a_form_item, { label: "Transcript / Notes" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_textarea, {
                                                        value: lesson.content,
                                                        "onUpdate:value": ($event) => lesson.content = $event,
                                                        rows: "4"
                                                      }, null, 8, ["value", "onUpdate:value"])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ], 64)) : lesson.type === "reading" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                  createVNode(_component_a_form_item, { label: "Article / Notes" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_textarea, {
                                                        value: lesson.content,
                                                        "onUpdate:value": ($event) => lesson.content = $event,
                                                        rows: "6",
                                                        placeholder: "Paste or write the reading content..."
                                                      }, null, 8, ["value", "onUpdate:value"])
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  readingTime(lesson.content) > 0 ? (openBlock(), createBlock(_component_a_alert, {
                                                    key: 0,
                                                    type: "info",
                                                    "show-icon": "",
                                                    message: `Estimated reading time: ${readingTime(lesson.content)} min`
                                                  }, null, 8, ["message"])) : createCommentVNode("", true)
                                                ], 64)) : lesson.type === "assignment" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                  createVNode(_component_a_form_item, { label: "Brief" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_textarea, {
                                                        value: lesson.content,
                                                        "onUpdate:value": ($event) => lesson.content = $event,
                                                        rows: "4",
                                                        placeholder: "Describe the task students must complete"
                                                      }, null, 8, ["value", "onUpdate:value"])
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode(_component_a_form_item, { label: "Rubric (optional)" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_textarea, {
                                                        value: lesson.rubric,
                                                        "onUpdate:value": ($event) => lesson.rubric = $event,
                                                        rows: "3",
                                                        placeholder: "How will you grade it?"
                                                      }, null, 8, ["value", "onUpdate:value"])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ], 64)) : lesson.type === "quiz" ? (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                  createVNode(_component_a_divider, { orientation: "left" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Questions")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  !lesson.quiz?.questions?.length ? (openBlock(), createBlock("div", { key: 0 }, [
                                                    createVNode(_component_a_empty, { description: "No questions yet" })
                                                  ])) : createCommentVNode("", true),
                                                  (openBlock(true), createBlock(Fragment, null, renderList(lesson.quiz?.questions || [], (q, qIdx) => {
                                                    return openBlock(), createBlock("div", {
                                                      key: q.id,
                                                      class: "quiz-q"
                                                    }, [
                                                      createVNode(_component_a_card, {
                                                        size: "small",
                                                        title: `Q${qIdx + 1}`,
                                                        style: { "margin-bottom": "8px" }
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_form, { layout: "vertical" }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_form_item, { label: "Question" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(_component_a_input, {
                                                                    value: q.text,
                                                                    "onUpdate:value": ($event) => q.text = $event
                                                                  }, null, 8, ["value", "onUpdate:value"])
                                                                ]),
                                                                _: 2
                                                              }, 1024),
                                                              createVNode(_component_a_form_item, { label: "Type" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(_component_a_select, {
                                                                    value: q.type,
                                                                    "onUpdate:value": ($event) => q.type = $event,
                                                                    style: { "width": "100%" }
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(_component_a_select_option, { value: "mcq" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode("Multiple choice")
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(_component_a_select_option, { value: "tf" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode("True/False")
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(_component_a_select_option, { value: "short" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode("Short answer")
                                                                        ]),
                                                                        _: 1
                                                                      })
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["value", "onUpdate:value"])
                                                                ]),
                                                                _: 2
                                                              }, 1024),
                                                              q.type === "mcq" ? (openBlock(), createBlock(_component_a_form_item, {
                                                                key: 0,
                                                                label: "Options"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  (openBlock(true), createBlock(Fragment, null, renderList(q.options, (opt, oIdx) => {
                                                                    return openBlock(), createBlock("div", {
                                                                      key: oIdx,
                                                                      class: "mcq-opt"
                                                                    }, [
                                                                      createVNode(_component_a_input, {
                                                                        value: opt.text,
                                                                        "onUpdate:value": ($event) => opt.text = $event,
                                                                        style: { "width": "70%" },
                                                                        placeholder: "Option text"
                                                                      }, null, 8, ["value", "onUpdate:value"]),
                                                                      createVNode(_component_a_checkbox, {
                                                                        checked: opt.correct,
                                                                        "onUpdate:checked": ($event) => opt.correct = $event,
                                                                        style: { "margin-left": "8px" }
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode("Correct")
                                                                        ]),
                                                                        _: 1
                                                                      }, 8, ["checked", "onUpdate:checked"]),
                                                                      createVNode(_component_a_button, {
                                                                        danger: "",
                                                                        type: "text",
                                                                        onClick: ($event) => removeOption(idx, qIdx, oIdx)
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(unref(DeleteOutlined))
                                                                        ]),
                                                                        _: 1
                                                                      }, 8, ["onClick"])
                                                                    ]);
                                                                  }), 128)),
                                                                  createVNode(_component_a_button, {
                                                                    size: "small",
                                                                    type: "dashed",
                                                                    onClick: ($event) => addOption(idx, qIdx),
                                                                    style: { "margin-top": "6px" }
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(PlusOutlined)),
                                                                      createTextVNode(" Add option ")
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["onClick"])
                                                                ]),
                                                                _: 2
                                                              }, 1024)) : q.type === "tf" ? (openBlock(), createBlock(_component_a_alert, {
                                                                key: 1,
                                                                type: "info",
                                                                "show-icon": "",
                                                                message: "This will be a True/False question."
                                                              })) : q.type === "short" ? (openBlock(), createBlock(_component_a_alert, {
                                                                key: 2,
                                                                type: "info",
                                                                "show-icon": "",
                                                                message: "This will be a short, free-text answer."
                                                              })) : createCommentVNode("", true),
                                                              createVNode("div", { class: "row-right" }, [
                                                                createVNode(_component_a_space, null, {
                                                                  default: withCtx(() => [
                                                                    createVNode(_component_a_button, {
                                                                      size: "small",
                                                                      onClick: ($event) => moveQuestion(idx, qIdx, -1)
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(ArrowUpOutlined))
                                                                      ]),
                                                                      _: 1
                                                                    }, 8, ["onClick"]),
                                                                    createVNode(_component_a_button, {
                                                                      size: "small",
                                                                      onClick: ($event) => moveQuestion(idx, qIdx, 1)
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(ArrowDownOutlined))
                                                                      ]),
                                                                      _: 1
                                                                    }, 8, ["onClick"]),
                                                                    createVNode(_component_a_button, {
                                                                      size: "small",
                                                                      danger: "",
                                                                      onClick: ($event) => removeQuestion(idx, qIdx)
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(DeleteOutlined))
                                                                      ]),
                                                                      _: 1
                                                                    }, 8, ["onClick"])
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)
                                                              ])
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["title"])
                                                    ]);
                                                  }), 128)),
                                                  createVNode(_component_a_space, null, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_button, {
                                                        type: "dashed",
                                                        size: "small",
                                                        onClick: ($event) => addQuestion(idx)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(PlusOutlined)),
                                                          createTextVNode(" Add question ")
                                                        ]),
                                                        _: 1
                                                      }, 8, ["onClick"]),
                                                      createVNode(_component_a_button, {
                                                        size: "small",
                                                        onClick: ($event) => seedFiveMcq(idx)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(CopyOutlined)),
                                                          createTextVNode(" Seed 5 MCQ ")
                                                        ]),
                                                        _: 1
                                                      }, 8, ["onClick"])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ], 64)) : createCommentVNode("", true)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(_component_a_col, {
                                          xs: 24,
                                          md: 8
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_form, { layout: "vertical" }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_form_item, { label: "Estimated Time (min)" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_input_number, {
                                                      value: lesson.duration,
                                                      "onUpdate:value": ($event) => lesson.duration = $event,
                                                      min: 1,
                                                      max: 600,
                                                      style: { "width": "100%" }
                                                    }, null, 8, ["value", "onUpdate:value"])
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(_component_a_form_item, { label: "Prerequisite lessons (IDs)" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_select, {
                                                      value: lesson.prerequisites,
                                                      "onUpdate:value": ($event) => lesson.prerequisites = $event,
                                                      mode: "multiple",
                                                      options: prereqOptions(idx),
                                                      placeholder: "Optional"
                                                    }, null, 8, ["value", "onUpdate:value", "options"])
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(_component_a_form_item, { label: "Tags" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_select, {
                                                      value: lesson.tags,
                                                      "onUpdate:value": ($event) => lesson.tags = $event,
                                                      mode: "tags",
                                                      placeholder: "Add tags"
                                                    }, null, 8, ["value", "onUpdate:value"])
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(_component_a_form_item, { label: "Availability" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_date_picker, {
                                                      value: lesson.unlockAt,
                                                      "onUpdate:value": ($event) => lesson.unlockAt = $event,
                                                      "show-time": "",
                                                      style: { "width": "100%" },
                                                      placeholder: "Optional"
                                                    }, null, 8, ["value", "onUpdate:value"])
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(_component_a_form_item, { label: "Resources (links)" }, {
                                                  default: withCtx(() => [
                                                    (openBlock(true), createBlock(Fragment, null, renderList(lesson.resources, (r, rIdx) => {
                                                      return openBlock(), createBlock("div", {
                                                        key: rIdx,
                                                        class: "resource-row"
                                                      }, [
                                                        createVNode(_component_a_input, {
                                                          value: r.title,
                                                          "onUpdate:value": ($event) => r.title = $event,
                                                          placeholder: "Title",
                                                          style: { "width": "35%" }
                                                        }, null, 8, ["value", "onUpdate:value"]),
                                                        createVNode(_component_a_input, {
                                                          value: r.url,
                                                          "onUpdate:value": ($event) => r.url = $event,
                                                          placeholder: "https://…",
                                                          style: { "width": "55%", "margin-left": "8px" }
                                                        }, null, 8, ["value", "onUpdate:value"]),
                                                        createVNode(_component_a_button, {
                                                          type: "text",
                                                          danger: "",
                                                          onClick: ($event) => removeResource(idx, rIdx)
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(DeleteOutlined))
                                                          ]),
                                                          _: 1
                                                        }, 8, ["onClick"])
                                                      ]);
                                                    }), 128)),
                                                    createVNode(_component_a_button, {
                                                      size: "small",
                                                      type: "dashed",
                                                      onClick: ($event) => addResource(idx),
                                                      style: { "margin-top": "6px" }
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(PlusOutlined)),
                                                        createTextVNode(" Add resource ")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onClick"])
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(_component_a_form_item, { label: "Attachments" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_upload, {
                                                      "file-list": lesson.attachments,
                                                      "onUpdate:fileList": ($event) => lesson.attachments = $event,
                                                      "before-upload": () => false,
                                                      multiple: true
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_button, { size: "small" }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(PaperClipOutlined)),
                                                            createTextVNode(" Add files")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }, 8, ["file-list", "onUpdate:fileList"])
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode("div", { class: "row-right" }, [
                                                  createVNode(_component_a_space, { wrap: "" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_button, {
                                                        onClick: ($event) => duplicateLesson(idx)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(CopyOutlined)),
                                                          createTextVNode(" Duplicate")
                                                        ]),
                                                        _: 1
                                                      }, 8, ["onClick"]),
                                                      createVNode(_component_a_button, {
                                                        onClick: ($event) => _ctx.previewLesson(lesson)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(EyeOutlined)),
                                                          createTextVNode(" Preview")
                                                        ]),
                                                        _: 1
                                                      }, 8, ["onClick"]),
                                                      createVNode(_component_a_button, {
                                                        onClick: ($event) => moveLesson(idx, -1)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(ArrowUpOutlined))
                                                        ]),
                                                        _: 1
                                                      }, 8, ["onClick"]),
                                                      createVNode(_component_a_button, {
                                                        onClick: ($event) => moveLesson(idx, 1)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(ArrowDownOutlined))
                                                        ]),
                                                        _: 1
                                                      }, 8, ["onClick"]),
                                                      createVNode(_component_a_popconfirm, {
                                                        title: "Delete this lesson?",
                                                        onConfirm: ($event) => removeLesson(idx)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_button, { danger: "" }, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(DeleteOutlined)),
                                                              createTextVNode(" Delete")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }, 8, ["onConfirm"])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ])
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    lessonWarnings(idx).length ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "lesson-warn"
                                    }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(lessonWarnings(idx), (w, wi) => {
                                        return openBlock(), createBlock(_component_a_alert, {
                                          key: wi,
                                          type: "warning",
                                          "show-icon": "",
                                          message: w,
                                          style: { "margin-top": "8px" }
                                        }, null, 8, ["message"]);
                                      }), 128))
                                    ])) : createCommentVNode("", true)
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_form, {
                      layout: "vertical",
                      model: moduleData
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_form_item, {
                          label: "Module Title",
                          name: "title",
                          rules: [{ required: true, message: "Title is required" }],
                          "validate-status": moduleData.title ? "" : "warning",
                          help: !moduleData.title ? "A strong, student-focused title helps discoverability." : ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_input, {
                              value: moduleData.title,
                              "onUpdate:value": ($event) => moduleData.title = $event,
                              placeholder: "e.g. Composition API Basics",
                              onBlur: maybeGenerateSlug
                            }, null, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        }, 8, ["validate-status", "help"]),
                        createVNode(_component_a_row, { gutter: 16 }, {
                          default: withCtx(() => [
                            createVNode(_component_a_col, {
                              xs: 24,
                              md: 16
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_form_item, { label: "Description" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_textarea, {
                                      value: moduleData.description,
                                      "onUpdate:value": ($event) => moduleData.description = $event,
                                      rows: "3",
                                      placeholder: "What will students learn in this module?"
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form_item, { label: "Learning Objectives (tags)" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_select, {
                                      value: moduleData.objectives,
                                      "onUpdate:value": ($event) => moduleData.objectives = $event,
                                      mode: "tags",
                                      placeholder: "Add objectives (press Enter)",
                                      "token-separators": [","],
                                      options: objectiveSuggestions
                                    }, null, 8, ["value", "onUpdate:value"]),
                                    createVNode(_component_a_typography_text, { type: "secondary" }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Tip: Keep objectives measurable and concise. ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_col, {
                              xs: 24,
                              md: 8
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_form_item, { label: "Visibility" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_switch, {
                                      checked: moduleData.isPublic,
                                      "onUpdate:checked": ($event) => moduleData.isPublic = $event,
                                      "checked-children": "Public",
                                      "un-checked-children": "Private"
                                    }, null, 8, ["checked", "onUpdate:checked"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form_item, { label: "Module Availability" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_date_picker, {
                                      value: moduleData.unlockAt,
                                      "onUpdate:value": ($event) => moduleData.unlockAt = $event,
                                      "show-time": "",
                                      style: { "width": "100%" },
                                      placeholder: "Optional unlock date/time"
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form_item, { label: "Module Slug (URL)" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_input, {
                                      value: moduleData.slug,
                                      "onUpdate:value": ($event) => moduleData.slug = $event,
                                      placeholder: "auto-generated-from-title"
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
                        createVNode(_component_a_divider, { orientation: "left" }, {
                          default: withCtx(() => [
                            createTextVNode(" Lessons "),
                            createVNode("span", { class: "muted" }, "(" + toDisplayString(moduleData.lessons.length) + ")", 1)
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_space, {
                          style: { "margin-bottom": "12px" },
                          wrap: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_button, {
                              type: "dashed",
                              onClick: ($event) => addLesson()
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(PlusOutlined)),
                                createTextVNode(" Add lesson ")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(_component_a_button, { onClick: expandAll }, {
                              default: withCtx(() => [
                                createTextVNode("Expand all")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_button, { onClick: collapseAll }, {
                              default: withCtx(() => [
                                createTextVNode("Collapse all")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_button, { onClick: addQuizCheckpoint }, {
                              default: withCtx(() => [
                                createVNode(unref(QuestionCircleOutlined)),
                                createTextVNode(" Add checkpoint quiz ")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_button, { onClick: addMiniAssignment }, {
                              default: withCtx(() => [
                                createVNode(unref(PaperClipOutlined)),
                                createTextVNode(" Add mini assignment ")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_button, { onClick: addVideoIntro }, {
                              default: withCtx(() => [
                                createVNode(unref(VideoCameraOutlined)),
                                createTextVNode(" Add intro video ")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_tag, { color: "blue" }, {
                              default: withCtx(() => [
                                createTextVNode("Total time: " + toDisplayString(totalMinutes.value) + " min", 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_space, { style: { "margin-bottom": "12px" } }, {
                          default: withCtx(() => [
                            createVNode(_component_a_tooltip, { title: "Undo (Ctrl/Cmd+Z)" }, {
                              default: withCtx(() => [
                                createVNode(_component_a_button, {
                                  disabled: !canUndo.value,
                                  onClick: undoChange
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(ArrowLeftOutlined)),
                                    createTextVNode(" Undo ")
                                  ]),
                                  _: 1
                                }, 8, ["disabled"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_tooltip, { title: "Redo (Ctrl/Cmd+Shift+Z)" }, {
                              default: withCtx(() => [
                                createVNode(_component_a_button, {
                                  disabled: !canRedo.value,
                                  onClick: redoChange
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(ArrowRightOutlined)),
                                    createTextVNode(" Redo ")
                                  ]),
                                  _: 1
                                }, 8, ["disabled"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_divider, { type: "vertical" }),
                            createVNode(_component_a_typography_text, { type: "secondary" }, {
                              default: withCtx(() => [
                                createTextVNode("History: " + toDisplayString(historyIndex.value + 1) + " / " + toDisplayString(history.value.length), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_collapse, {
                          activeKey: activePanels.value,
                          "onUpdate:activeKey": ($event) => activePanels.value = $event
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(moduleData.lessons, (lesson, idx) => {
                              return openBlock(), createBlock(_component_a_collapse_panel, {
                                key: lesson.id,
                                header: panelTitle(lesson, idx)
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_row, { gutter: 16 }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_col, {
                                        xs: 24,
                                        md: 16
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_form, { layout: "vertical" }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_form_item, {
                                                label: "Title",
                                                rules: [{ required: true, message: "Lesson title is required" }]
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_input, {
                                                    value: lesson.title,
                                                    "onUpdate:value": ($event) => lesson.title = $event,
                                                    placeholder: "e.g. Reactive primitives"
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(_component_a_form_item, { label: "Type" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_select, {
                                                    value: lesson.type,
                                                    "onUpdate:value": ($event) => lesson.type = $event,
                                                    style: { "width": "100%" }
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_select_option, { value: "video" }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(VideoCameraOutlined)),
                                                          createTextVNode(" Video ")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(_component_a_select_option, { value: "reading" }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(ReadOutlined)),
                                                          createTextVNode(" Reading ")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(_component_a_select_option, { value: "quiz" }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(QuestionCircleOutlined)),
                                                          createTextVNode(" Quiz ")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(_component_a_select_option, { value: "assignment" }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(PaperClipOutlined)),
                                                          createTextVNode(" Assignment ")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }, 8, ["value", "onUpdate:value"])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              lesson.type === "video" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                createVNode(_component_a_form_item, { label: "Video URL" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_input, {
                                                      value: lesson.videoUrl,
                                                      "onUpdate:value": ($event) => lesson.videoUrl = $event,
                                                      placeholder: "https://..."
                                                    }, null, 8, ["value", "onUpdate:value"])
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(_component_a_form_item, { label: "Transcript / Notes" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_textarea, {
                                                      value: lesson.content,
                                                      "onUpdate:value": ($event) => lesson.content = $event,
                                                      rows: "4"
                                                    }, null, 8, ["value", "onUpdate:value"])
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ], 64)) : lesson.type === "reading" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                createVNode(_component_a_form_item, { label: "Article / Notes" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_textarea, {
                                                      value: lesson.content,
                                                      "onUpdate:value": ($event) => lesson.content = $event,
                                                      rows: "6",
                                                      placeholder: "Paste or write the reading content..."
                                                    }, null, 8, ["value", "onUpdate:value"])
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                readingTime(lesson.content) > 0 ? (openBlock(), createBlock(_component_a_alert, {
                                                  key: 0,
                                                  type: "info",
                                                  "show-icon": "",
                                                  message: `Estimated reading time: ${readingTime(lesson.content)} min`
                                                }, null, 8, ["message"])) : createCommentVNode("", true)
                                              ], 64)) : lesson.type === "assignment" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                createVNode(_component_a_form_item, { label: "Brief" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_textarea, {
                                                      value: lesson.content,
                                                      "onUpdate:value": ($event) => lesson.content = $event,
                                                      rows: "4",
                                                      placeholder: "Describe the task students must complete"
                                                    }, null, 8, ["value", "onUpdate:value"])
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(_component_a_form_item, { label: "Rubric (optional)" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_textarea, {
                                                      value: lesson.rubric,
                                                      "onUpdate:value": ($event) => lesson.rubric = $event,
                                                      rows: "3",
                                                      placeholder: "How will you grade it?"
                                                    }, null, 8, ["value", "onUpdate:value"])
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ], 64)) : lesson.type === "quiz" ? (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                createVNode(_component_a_divider, { orientation: "left" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Questions")
                                                  ]),
                                                  _: 1
                                                }),
                                                !lesson.quiz?.questions?.length ? (openBlock(), createBlock("div", { key: 0 }, [
                                                  createVNode(_component_a_empty, { description: "No questions yet" })
                                                ])) : createCommentVNode("", true),
                                                (openBlock(true), createBlock(Fragment, null, renderList(lesson.quiz?.questions || [], (q, qIdx) => {
                                                  return openBlock(), createBlock("div", {
                                                    key: q.id,
                                                    class: "quiz-q"
                                                  }, [
                                                    createVNode(_component_a_card, {
                                                      size: "small",
                                                      title: `Q${qIdx + 1}`,
                                                      style: { "margin-bottom": "8px" }
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_form, { layout: "vertical" }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_form_item, { label: "Question" }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_input, {
                                                                  value: q.text,
                                                                  "onUpdate:value": ($event) => q.text = $event
                                                                }, null, 8, ["value", "onUpdate:value"])
                                                              ]),
                                                              _: 2
                                                            }, 1024),
                                                            createVNode(_component_a_form_item, { label: "Type" }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_select, {
                                                                  value: q.type,
                                                                  "onUpdate:value": ($event) => q.type = $event,
                                                                  style: { "width": "100%" }
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(_component_a_select_option, { value: "mcq" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("Multiple choice")
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(_component_a_select_option, { value: "tf" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("True/False")
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(_component_a_select_option, { value: "short" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("Short answer")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["value", "onUpdate:value"])
                                                              ]),
                                                              _: 2
                                                            }, 1024),
                                                            q.type === "mcq" ? (openBlock(), createBlock(_component_a_form_item, {
                                                              key: 0,
                                                              label: "Options"
                                                            }, {
                                                              default: withCtx(() => [
                                                                (openBlock(true), createBlock(Fragment, null, renderList(q.options, (opt, oIdx) => {
                                                                  return openBlock(), createBlock("div", {
                                                                    key: oIdx,
                                                                    class: "mcq-opt"
                                                                  }, [
                                                                    createVNode(_component_a_input, {
                                                                      value: opt.text,
                                                                      "onUpdate:value": ($event) => opt.text = $event,
                                                                      style: { "width": "70%" },
                                                                      placeholder: "Option text"
                                                                    }, null, 8, ["value", "onUpdate:value"]),
                                                                    createVNode(_component_a_checkbox, {
                                                                      checked: opt.correct,
                                                                      "onUpdate:checked": ($event) => opt.correct = $event,
                                                                      style: { "margin-left": "8px" }
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("Correct")
                                                                      ]),
                                                                      _: 1
                                                                    }, 8, ["checked", "onUpdate:checked"]),
                                                                    createVNode(_component_a_button, {
                                                                      danger: "",
                                                                      type: "text",
                                                                      onClick: ($event) => removeOption(idx, qIdx, oIdx)
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(DeleteOutlined))
                                                                      ]),
                                                                      _: 1
                                                                    }, 8, ["onClick"])
                                                                  ]);
                                                                }), 128)),
                                                                createVNode(_component_a_button, {
                                                                  size: "small",
                                                                  type: "dashed",
                                                                  onClick: ($event) => addOption(idx, qIdx),
                                                                  style: { "margin-top": "6px" }
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(PlusOutlined)),
                                                                    createTextVNode(" Add option ")
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onClick"])
                                                              ]),
                                                              _: 2
                                                            }, 1024)) : q.type === "tf" ? (openBlock(), createBlock(_component_a_alert, {
                                                              key: 1,
                                                              type: "info",
                                                              "show-icon": "",
                                                              message: "This will be a True/False question."
                                                            })) : q.type === "short" ? (openBlock(), createBlock(_component_a_alert, {
                                                              key: 2,
                                                              type: "info",
                                                              "show-icon": "",
                                                              message: "This will be a short, free-text answer."
                                                            })) : createCommentVNode("", true),
                                                            createVNode("div", { class: "row-right" }, [
                                                              createVNode(_component_a_space, null, {
                                                                default: withCtx(() => [
                                                                  createVNode(_component_a_button, {
                                                                    size: "small",
                                                                    onClick: ($event) => moveQuestion(idx, qIdx, -1)
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(ArrowUpOutlined))
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["onClick"]),
                                                                  createVNode(_component_a_button, {
                                                                    size: "small",
                                                                    onClick: ($event) => moveQuestion(idx, qIdx, 1)
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(ArrowDownOutlined))
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["onClick"]),
                                                                  createVNode(_component_a_button, {
                                                                    size: "small",
                                                                    danger: "",
                                                                    onClick: ($event) => removeQuestion(idx, qIdx)
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(DeleteOutlined))
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["onClick"])
                                                                ]),
                                                                _: 2
                                                              }, 1024)
                                                            ])
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["title"])
                                                  ]);
                                                }), 128)),
                                                createVNode(_component_a_space, null, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_button, {
                                                      type: "dashed",
                                                      size: "small",
                                                      onClick: ($event) => addQuestion(idx)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(PlusOutlined)),
                                                        createTextVNode(" Add question ")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onClick"]),
                                                    createVNode(_component_a_button, {
                                                      size: "small",
                                                      onClick: ($event) => seedFiveMcq(idx)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(CopyOutlined)),
                                                        createTextVNode(" Seed 5 MCQ ")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onClick"])
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ], 64)) : createCommentVNode("", true)
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_a_col, {
                                        xs: 24,
                                        md: 8
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_form, { layout: "vertical" }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_form_item, { label: "Estimated Time (min)" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_input_number, {
                                                    value: lesson.duration,
                                                    "onUpdate:value": ($event) => lesson.duration = $event,
                                                    min: 1,
                                                    max: 600,
                                                    style: { "width": "100%" }
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(_component_a_form_item, { label: "Prerequisite lessons (IDs)" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_select, {
                                                    value: lesson.prerequisites,
                                                    "onUpdate:value": ($event) => lesson.prerequisites = $event,
                                                    mode: "multiple",
                                                    options: prereqOptions(idx),
                                                    placeholder: "Optional"
                                                  }, null, 8, ["value", "onUpdate:value", "options"])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(_component_a_form_item, { label: "Tags" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_select, {
                                                    value: lesson.tags,
                                                    "onUpdate:value": ($event) => lesson.tags = $event,
                                                    mode: "tags",
                                                    placeholder: "Add tags"
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(_component_a_form_item, { label: "Availability" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_date_picker, {
                                                    value: lesson.unlockAt,
                                                    "onUpdate:value": ($event) => lesson.unlockAt = $event,
                                                    "show-time": "",
                                                    style: { "width": "100%" },
                                                    placeholder: "Optional"
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(_component_a_form_item, { label: "Resources (links)" }, {
                                                default: withCtx(() => [
                                                  (openBlock(true), createBlock(Fragment, null, renderList(lesson.resources, (r, rIdx) => {
                                                    return openBlock(), createBlock("div", {
                                                      key: rIdx,
                                                      class: "resource-row"
                                                    }, [
                                                      createVNode(_component_a_input, {
                                                        value: r.title,
                                                        "onUpdate:value": ($event) => r.title = $event,
                                                        placeholder: "Title",
                                                        style: { "width": "35%" }
                                                      }, null, 8, ["value", "onUpdate:value"]),
                                                      createVNode(_component_a_input, {
                                                        value: r.url,
                                                        "onUpdate:value": ($event) => r.url = $event,
                                                        placeholder: "https://…",
                                                        style: { "width": "55%", "margin-left": "8px" }
                                                      }, null, 8, ["value", "onUpdate:value"]),
                                                      createVNode(_component_a_button, {
                                                        type: "text",
                                                        danger: "",
                                                        onClick: ($event) => removeResource(idx, rIdx)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(DeleteOutlined))
                                                        ]),
                                                        _: 1
                                                      }, 8, ["onClick"])
                                                    ]);
                                                  }), 128)),
                                                  createVNode(_component_a_button, {
                                                    size: "small",
                                                    type: "dashed",
                                                    onClick: ($event) => addResource(idx),
                                                    style: { "margin-top": "6px" }
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(PlusOutlined)),
                                                      createTextVNode(" Add resource ")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(_component_a_form_item, { label: "Attachments" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_upload, {
                                                    "file-list": lesson.attachments,
                                                    "onUpdate:fileList": ($event) => lesson.attachments = $event,
                                                    "before-upload": () => false,
                                                    multiple: true
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_button, { size: "small" }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(PaperClipOutlined)),
                                                          createTextVNode(" Add files")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }, 8, ["file-list", "onUpdate:fileList"])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode("div", { class: "row-right" }, [
                                                createVNode(_component_a_space, { wrap: "" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_button, {
                                                      onClick: ($event) => duplicateLesson(idx)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(CopyOutlined)),
                                                        createTextVNode(" Duplicate")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onClick"]),
                                                    createVNode(_component_a_button, {
                                                      onClick: ($event) => _ctx.previewLesson(lesson)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(EyeOutlined)),
                                                        createTextVNode(" Preview")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onClick"]),
                                                    createVNode(_component_a_button, {
                                                      onClick: ($event) => moveLesson(idx, -1)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(ArrowUpOutlined))
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onClick"]),
                                                    createVNode(_component_a_button, {
                                                      onClick: ($event) => moveLesson(idx, 1)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(ArrowDownOutlined))
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onClick"]),
                                                    createVNode(_component_a_popconfirm, {
                                                      title: "Delete this lesson?",
                                                      onConfirm: ($event) => removeLesson(idx)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_button, { danger: "" }, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(DeleteOutlined)),
                                                            createTextVNode(" Delete")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onConfirm"])
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  lessonWarnings(idx).length ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "lesson-warn"
                                  }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(lessonWarnings(idx), (w, wi) => {
                                      return openBlock(), createBlock(_component_a_alert, {
                                        key: wi,
                                        type: "warning",
                                        "show-icon": "",
                                        message: w,
                                        style: { "margin-top": "8px" }
                                      }, null, 8, ["message"]);
                                    }), 128))
                                  ])) : createCommentVNode("", true)
                                ]),
                                _: 2
                              }, 1032, ["header"]);
                            }), 128))
                          ]),
                          _: 1
                        }, 8, ["activeKey", "onUpdate:activeKey"])
                      ]),
                      _: 1
                    }, 8, ["model"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_modal, {
              open: previewOpen.value,
              "onUpdate:open": ($event) => previewOpen.value = $event,
              title: "Student Preview",
              width: "720px",
              footer: null
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (previewData.value) {
                    _push3(`<div data-v-a217beca${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_a_typography_title, { level: 4 }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(previewData.value.title)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(previewData.value.title), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_a_space, {
                      direction: "vertical",
                      style: { "width": "100%" }
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_tag, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(previewData.value.type)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(previewData.value.type), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_typography_text, { type: "secondary" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Estimated: ${ssrInterpolate(previewData.value.duration || 0)} min`);
                              } else {
                                return [
                                  createTextVNode("Estimated: " + toDisplayString(previewData.value.duration || 0) + " min", 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          if (previewData.value.type === "video" && previewData.value.videoUrl) {
                            _push4(`<div data-v-a217beca${_scopeId3}>`);
                            _push4(ssrRenderComponent(_component_a_typography_text, { strong: "" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`Video:`);
                                } else {
                                  return [
                                    createTextVNode("Video:")
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(`<div class="video-box" data-v-a217beca${_scopeId3}>${ssrInterpolate(previewData.value.videoUrl)}</div></div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (previewData.value.content) {
                            _push4(`<div data-v-a217beca${_scopeId3}>`);
                            _push4(ssrRenderComponent(_component_a_typography_text, { strong: "" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`Content:`);
                                } else {
                                  return [
                                    createTextVNode("Content:")
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_a_typography_paragraph, null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(previewData.value.content)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(previewData.value.content), 1)
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(`</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (previewData.value.type === "quiz" && previewData.value.quiz?.questions?.length) {
                            _push4(`<div data-v-a217beca${_scopeId3}>`);
                            _push4(ssrRenderComponent(_component_a_divider, null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`Questions`);
                                } else {
                                  return [
                                    createTextVNode("Questions")
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(`<ol style="${ssrRenderStyle({ "padding-left": "20px", "margin": "0" })}" data-v-a217beca${_scopeId3}><!--[-->`);
                            ssrRenderList(previewData.value.quiz.questions, (q) => {
                              _push4(`<li data-v-a217beca${_scopeId3}>${ssrInterpolate(q.text)}</li>`);
                            });
                            _push4(`<!--]--></ol></div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (previewData.value.resources?.length) {
                            _push4(`<div data-v-a217beca${_scopeId3}>`);
                            _push4(ssrRenderComponent(_component_a_divider, null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`Resources`);
                                } else {
                                  return [
                                    createTextVNode("Resources")
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(`<ul data-v-a217beca${_scopeId3}><!--[-->`);
                            ssrRenderList(previewData.value.resources, (r, i) => {
                              _push4(`<li data-v-a217beca${_scopeId3}><a${ssrRenderAttr("href", safeUrl(r.url))} target="_blank" data-v-a217beca${_scopeId3}>${ssrInterpolate(r.title || r.url)}</a></li>`);
                            });
                            _push4(`<!--]--></ul></div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                        } else {
                          return [
                            createVNode(_component_a_tag, null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(previewData.value.type), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_typography_text, { type: "secondary" }, {
                              default: withCtx(() => [
                                createTextVNode("Estimated: " + toDisplayString(previewData.value.duration || 0) + " min", 1)
                              ]),
                              _: 1
                            }),
                            previewData.value.type === "video" && previewData.value.videoUrl ? (openBlock(), createBlock("div", { key: 0 }, [
                              createVNode(_component_a_typography_text, { strong: "" }, {
                                default: withCtx(() => [
                                  createTextVNode("Video:")
                                ]),
                                _: 1
                              }),
                              createVNode("div", { class: "video-box" }, toDisplayString(previewData.value.videoUrl), 1)
                            ])) : createCommentVNode("", true),
                            previewData.value.content ? (openBlock(), createBlock("div", { key: 1 }, [
                              createVNode(_component_a_typography_text, { strong: "" }, {
                                default: withCtx(() => [
                                  createTextVNode("Content:")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_typography_paragraph, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(previewData.value.content), 1)
                                ]),
                                _: 1
                              })
                            ])) : createCommentVNode("", true),
                            previewData.value.type === "quiz" && previewData.value.quiz?.questions?.length ? (openBlock(), createBlock("div", { key: 2 }, [
                              createVNode(_component_a_divider, null, {
                                default: withCtx(() => [
                                  createTextVNode("Questions")
                                ]),
                                _: 1
                              }),
                              createVNode("ol", { style: { "padding-left": "20px", "margin": "0" } }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(previewData.value.quiz.questions, (q) => {
                                  return openBlock(), createBlock("li", {
                                    key: q.id
                                  }, toDisplayString(q.text), 1);
                                }), 128))
                              ])
                            ])) : createCommentVNode("", true),
                            previewData.value.resources?.length ? (openBlock(), createBlock("div", { key: 3 }, [
                              createVNode(_component_a_divider, null, {
                                default: withCtx(() => [
                                  createTextVNode("Resources")
                                ]),
                                _: 1
                              }),
                              createVNode("ul", null, [
                                (openBlock(true), createBlock(Fragment, null, renderList(previewData.value.resources, (r, i) => {
                                  return openBlock(), createBlock("li", { key: i }, [
                                    createVNode("a", {
                                      href: safeUrl(r.url),
                                      target: "_blank"
                                    }, toDisplayString(r.title || r.url), 9, ["href"])
                                  ]);
                                }), 128))
                              ])
                            ])) : createCommentVNode("", true)
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
                    previewData.value ? (openBlock(), createBlock("div", { key: 0 }, [
                      createVNode(_component_a_typography_title, { level: 4 }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(previewData.value.title), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_space, {
                        direction: "vertical",
                        style: { "width": "100%" }
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_tag, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(previewData.value.type), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_typography_text, { type: "secondary" }, {
                            default: withCtx(() => [
                              createTextVNode("Estimated: " + toDisplayString(previewData.value.duration || 0) + " min", 1)
                            ]),
                            _: 1
                          }),
                          previewData.value.type === "video" && previewData.value.videoUrl ? (openBlock(), createBlock("div", { key: 0 }, [
                            createVNode(_component_a_typography_text, { strong: "" }, {
                              default: withCtx(() => [
                                createTextVNode("Video:")
                              ]),
                              _: 1
                            }),
                            createVNode("div", { class: "video-box" }, toDisplayString(previewData.value.videoUrl), 1)
                          ])) : createCommentVNode("", true),
                          previewData.value.content ? (openBlock(), createBlock("div", { key: 1 }, [
                            createVNode(_component_a_typography_text, { strong: "" }, {
                              default: withCtx(() => [
                                createTextVNode("Content:")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_typography_paragraph, null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(previewData.value.content), 1)
                              ]),
                              _: 1
                            })
                          ])) : createCommentVNode("", true),
                          previewData.value.type === "quiz" && previewData.value.quiz?.questions?.length ? (openBlock(), createBlock("div", { key: 2 }, [
                            createVNode(_component_a_divider, null, {
                              default: withCtx(() => [
                                createTextVNode("Questions")
                              ]),
                              _: 1
                            }),
                            createVNode("ol", { style: { "padding-left": "20px", "margin": "0" } }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(previewData.value.quiz.questions, (q) => {
                                return openBlock(), createBlock("li", {
                                  key: q.id
                                }, toDisplayString(q.text), 1);
                              }), 128))
                            ])
                          ])) : createCommentVNode("", true),
                          previewData.value.resources?.length ? (openBlock(), createBlock("div", { key: 3 }, [
                            createVNode(_component_a_divider, null, {
                              default: withCtx(() => [
                                createTextVNode("Resources")
                              ]),
                              _: 1
                            }),
                            createVNode("ul", null, [
                              (openBlock(true), createBlock(Fragment, null, renderList(previewData.value.resources, (r, i) => {
                                return openBlock(), createBlock("li", { key: i }, [
                                  createVNode("a", {
                                    href: safeUrl(r.url),
                                    target: "_blank"
                                  }, toDisplayString(r.title || r.url), 9, ["href"])
                                ]);
                              }), 128))
                            ])
                          ])) : createCommentVNode("", true)
                        ]),
                        _: 1
                      })
                    ])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_modal, {
              open: templatesOpen.value,
              "onUpdate:open": ($event) => templatesOpen.value = $event,
              title: "Lesson templates",
              onOk: applyTemplate,
              onCancel: ($event) => templatesOpen.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_radio_group, {
                    value: selectedTemplate.value,
                    "onUpdate:value": ($event) => selectedTemplate.value = $event,
                    style: { "width": "100%" }
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_radio, { value: "video:intro" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Intro video (goals + overview)`);
                            } else {
                              return [
                                createTextVNode("Intro video (goals + overview)")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_radio, { value: "reading:notes" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Concept reading (definitions + examples)`);
                            } else {
                              return [
                                createTextVNode("Concept reading (definitions + examples)")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_radio, { value: "quiz:checkpoint" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Checkpoint quiz (5 MCQs)`);
                            } else {
                              return [
                                createTextVNode("Checkpoint quiz (5 MCQs)")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_radio, { value: "assignment:mini" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Mini assignment (15-30 min)`);
                            } else {
                              return [
                                createTextVNode("Mini assignment (15-30 min)")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_radio, { value: "video:intro" }, {
                            default: withCtx(() => [
                              createTextVNode("Intro video (goals + overview)")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_radio, { value: "reading:notes" }, {
                            default: withCtx(() => [
                              createTextVNode("Concept reading (definitions + examples)")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_radio, { value: "quiz:checkpoint" }, {
                            default: withCtx(() => [
                              createTextVNode("Checkpoint quiz (5 MCQs)")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_radio, { value: "assignment:mini" }, {
                            default: withCtx(() => [
                              createTextVNode("Mini assignment (15-30 min)")
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
                    createVNode(_component_a_radio_group, {
                      value: selectedTemplate.value,
                      "onUpdate:value": ($event) => selectedTemplate.value = $event,
                      style: { "width": "100%" }
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_radio, { value: "video:intro" }, {
                          default: withCtx(() => [
                            createTextVNode("Intro video (goals + overview)")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_radio, { value: "reading:notes" }, {
                          default: withCtx(() => [
                            createTextVNode("Concept reading (definitions + examples)")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_radio, { value: "quiz:checkpoint" }, {
                          default: withCtx(() => [
                            createTextVNode("Checkpoint quiz (5 MCQs)")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_radio, { value: "assignment:mini" }, {
                          default: withCtx(() => [
                            createTextVNode("Mini assignment (15-30 min)")
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
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_modal, {
              open: bulkOpen.value,
              "onUpdate:open": ($event) => bulkOpen.value = $event,
              title: "Bulk add lessons",
              onOk: confirmBulkAdd,
              onCancel: ($event) => bulkOpen.value = false,
              "ok-text": "Create"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_typography_paragraph, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Paste lines like: <code data-v-a217beca${_scopeId3}>Video | Composition API intro | 8</code> (Type | Title | Minutes). One per line. `);
                      } else {
                        return [
                          createTextVNode(" Paste lines like: "),
                          createVNode("code", null, "Video | Composition API intro | 8"),
                          createTextVNode(" (Type | Title | Minutes). One per line. ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_textarea, {
                    value: bulkText.value,
                    "onUpdate:value": ($event) => bulkText.value = $event,
                    rows: "6",
                    placeholder: "Video | Setup dev env | 6\nReading | Reactivity notes | 10"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_typography_paragraph, null, {
                      default: withCtx(() => [
                        createTextVNode(" Paste lines like: "),
                        createVNode("code", null, "Video | Composition API intro | 8"),
                        createTextVNode(" (Type | Title | Minutes). One per line. ")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_textarea, {
                      value: bulkText.value,
                      "onUpdate:value": ($event) => bulkText.value = $event,
                      rows: "6",
                      placeholder: "Video | Setup dev env | 6\nReading | Reactivity notes | 10"
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_modal, {
              open: importOpen.value,
              "onUpdate:open": ($event) => importOpen.value = $event,
              title: "Import JSON",
              "ok-text": "Import",
              onOk: confirmImport,
              onCancel: ($event) => importOpen.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_typography_paragraph, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Paste a JSON export of a module. This overwrites the current form. `);
                      } else {
                        return [
                          createTextVNode(" Paste a JSON export of a module. This overwrites the current form. ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_textarea, {
                    value: importText.value,
                    "onUpdate:value": ($event) => importText.value = $event,
                    rows: 10,
                    placeholder: '{"title":"...","lessons":[...]}'
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_typography_paragraph, null, {
                      default: withCtx(() => [
                        createTextVNode(" Paste a JSON export of a module. This overwrites the current form. ")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_textarea, {
                      value: importText.value,
                      "onUpdate:value": ($event) => importText.value = $event,
                      rows: 10,
                      placeholder: '{"title":"...","lessons":[...]}'
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_modal, {
              open: exportOpen.value,
              "onUpdate:open": ($event) => exportOpen.value = $event,
              title: "Export JSON",
              footer: null,
              onCancel: ($event) => exportOpen.value = false,
              width: "720px"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_alert, {
                    type: "success",
                    message: "Copy the JSON below",
                    "show-icon": "",
                    style: { "margin-bottom": "12px" }
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_textarea, {
                    value: exportText.value,
                    rows: 14
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_alert, {
                      type: "success",
                      message: "Copy the JSON below",
                      "show-icon": "",
                      style: { "margin-bottom": "12px" }
                    }),
                    createVNode(_component_a_textarea, {
                      value: exportText.value,
                      rows: 14
                    }, null, 8, ["value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_modal, {
              open: settingsOpen.value,
              "onUpdate:open": ($event) => settingsOpen.value = $event,
              title: "Module settings",
              "ok-text": "Done",
              onOk: ($event) => settingsOpen.value = false,
              onCancel: ($event) => settingsOpen.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_form, { layout: "vertical" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_form_item, { label: "Default lesson duration (min)" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_input_number, {
                                value: settings.defaultDuration,
                                "onUpdate:value": ($event) => settings.defaultDuration = $event,
                                min: 1,
                                max: 600
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_input_number, {
                                  value: settings.defaultDuration,
                                  "onUpdate:value": ($event) => settings.defaultDuration = $event,
                                  min: 1,
                                  max: 600
                                }, null, 8, ["value", "onUpdate:value"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_form_item, { label: "Warn if lesson missing title" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_switch, {
                                checked: settings.warnMissingTitle,
                                "onUpdate:checked": ($event) => settings.warnMissingTitle = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_switch, {
                                  checked: settings.warnMissingTitle,
                                  "onUpdate:checked": ($event) => settings.warnMissingTitle = $event
                                }, null, 8, ["checked", "onUpdate:checked"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_form_item, { label: "Warn if duration is 0" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_switch, {
                                checked: settings.warnZeroDuration,
                                "onUpdate:checked": ($event) => settings.warnZeroDuration = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_switch, {
                                  checked: settings.warnZeroDuration,
                                  "onUpdate:checked": ($event) => settings.warnZeroDuration = $event
                                }, null, 8, ["checked", "onUpdate:checked"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_form_item, { label: "Default lesson duration (min)" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_input_number, {
                                value: settings.defaultDuration,
                                "onUpdate:value": ($event) => settings.defaultDuration = $event,
                                min: 1,
                                max: 600
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_form_item, { label: "Warn if lesson missing title" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_switch, {
                                checked: settings.warnMissingTitle,
                                "onUpdate:checked": ($event) => settings.warnMissingTitle = $event
                              }, null, 8, ["checked", "onUpdate:checked"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_form_item, { label: "Warn if duration is 0" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_switch, {
                                checked: settings.warnZeroDuration,
                                "onUpdate:checked": ($event) => settings.warnZeroDuration = $event
                              }, null, 8, ["checked", "onUpdate:checked"])
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
                    createVNode(_component_a_form, { layout: "vertical" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_form_item, { label: "Default lesson duration (min)" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_input_number, {
                              value: settings.defaultDuration,
                              "onUpdate:value": ($event) => settings.defaultDuration = $event,
                              min: 1,
                              max: 600
                            }, null, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_form_item, { label: "Warn if lesson missing title" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_switch, {
                              checked: settings.warnMissingTitle,
                              "onUpdate:checked": ($event) => settings.warnMissingTitle = $event
                            }, null, 8, ["checked", "onUpdate:checked"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_form_item, { label: "Warn if duration is 0" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_switch, {
                              checked: settings.warnZeroDuration,
                              "onUpdate:checked": ($event) => settings.warnZeroDuration = $event
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
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_modal, {
              open: shortcutsOpen.value,
              "onUpdate:open": ($event) => shortcutsOpen.value = $event,
              title: "Keyboard shortcuts",
              footer: null,
              onCancel: ($event) => shortcutsOpen.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_descriptions, {
                    bordered: "",
                    column: 1,
                    size: "small"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_descriptions_item, { label: "Save draft" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Ctrl/Cmd + S`);
                            } else {
                              return [
                                createTextVNode("Ctrl/Cmd + S")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_descriptions_item, { label: "Add lesson" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Ctrl/Cmd + Enter`);
                            } else {
                              return [
                                createTextVNode("Ctrl/Cmd + Enter")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_descriptions_item, { label: "Undo" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Ctrl/Cmd + Z`);
                            } else {
                              return [
                                createTextVNode("Ctrl/Cmd + Z")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_descriptions_item, { label: "Redo" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Ctrl/Cmd + Shift + Z`);
                            } else {
                              return [
                                createTextVNode("Ctrl/Cmd + Shift + Z")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_descriptions_item, { label: "Expand all" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Ctrl/Cmd + .`);
                            } else {
                              return [
                                createTextVNode("Ctrl/Cmd + .")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_descriptions_item, { label: "Collapse all" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Ctrl/Cmd + ,`);
                            } else {
                              return [
                                createTextVNode("Ctrl/Cmd + ,")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_descriptions_item, { label: "Save draft" }, {
                            default: withCtx(() => [
                              createTextVNode("Ctrl/Cmd + S")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_descriptions_item, { label: "Add lesson" }, {
                            default: withCtx(() => [
                              createTextVNode("Ctrl/Cmd + Enter")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_descriptions_item, { label: "Undo" }, {
                            default: withCtx(() => [
                              createTextVNode("Ctrl/Cmd + Z")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_descriptions_item, { label: "Redo" }, {
                            default: withCtx(() => [
                              createTextVNode("Ctrl/Cmd + Shift + Z")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_descriptions_item, { label: "Expand all" }, {
                            default: withCtx(() => [
                              createTextVNode("Ctrl/Cmd + .")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_descriptions_item, { label: "Collapse all" }, {
                            default: withCtx(() => [
                              createTextVNode("Ctrl/Cmd + ,")
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
                    createVNode(_component_a_descriptions, {
                      bordered: "",
                      column: 1,
                      size: "small"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_descriptions_item, { label: "Save draft" }, {
                          default: withCtx(() => [
                            createTextVNode("Ctrl/Cmd + S")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_descriptions_item, { label: "Add lesson" }, {
                          default: withCtx(() => [
                            createTextVNode("Ctrl/Cmd + Enter")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_descriptions_item, { label: "Undo" }, {
                          default: withCtx(() => [
                            createTextVNode("Ctrl/Cmd + Z")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_descriptions_item, { label: "Redo" }, {
                          default: withCtx(() => [
                            createTextVNode("Ctrl/Cmd + Shift + Z")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_descriptions_item, { label: "Expand all" }, {
                          default: withCtx(() => [
                            createTextVNode("Ctrl/Cmd + .")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_descriptions_item, { label: "Collapse all" }, {
                          default: withCtx(() => [
                            createTextVNode("Ctrl/Cmd + ,")
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
              createVNode(_component_a_page_header, {
                title: "Create New Module",
                "sub-title": courseTitle.value,
                class: "page-header",
                onBack: goBack
              }, {
                avatar: withCtx(() => [
                  createVNode(_component_a_avatar, {
                    src: teacher.avatar
                  }, null, 8, ["src"])
                ]),
                tags: withCtx(() => [
                  createVNode(_component_a_tag, { color: "blue" }, {
                    default: withCtx(() => [
                      createTextVNode("Teacher: " + toDisplayString(teacherName))
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_tag, { color: "green" }, {
                    default: withCtx(() => [
                      createTextVNode("Course: " + toDisplayString(unref(courseId)), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_tag, {
                    color: moduleData.isPublic ? "cyan" : "gold"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(moduleData.isPublic ? "Public" : "Private"), 1)
                    ]),
                    _: 1
                  }, 8, ["color"])
                ]),
                extra: withCtx(() => [
                  createVNode(_component_a_space, {
                    size: 8,
                    wrap: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_popover, { placement: "bottomRight" }, {
                        content: withCtx(() => [
                          createVNode("div", { style: { "min-width": "260px" } }, [
                            createVNode(_component_a_typography_title, {
                              level: 5,
                              style: { "margin-top": "0" }
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Draft")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_descriptions, {
                              size: "small",
                              column: 1,
                              bordered: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_descriptions_item, { label: "Autosave" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(autosaveEnabled.value ? "On" : "Off"), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions_item, { label: "Last saved" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(lastSavedAt.value || "—"), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_descriptions_item, { label: "Version" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(draftVersion.value), 1)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_space, { style: { "margin-top": "8px" } }, {
                              default: withCtx(() => [
                                createVNode(_component_a_button, {
                                  size: "small",
                                  onClick: toggleAutosave
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(autosaveEnabled.value ? "Disable autosave" : "Enable autosave"), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_button, {
                                  size: "small",
                                  onClick: forceSaveDraft
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Save now ")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ])
                        ]),
                        default: withCtx(() => [
                          createVNode(_component_a_badge, {
                            status: autosaveEnabled.value ? "processing" : "default"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, null, {
                                default: withCtx(() => [
                                  createVNode(unref(SaveOutlined)),
                                  createTextVNode(" Draft")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["status"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_button, { onClick: openTemplates }, {
                        default: withCtx(() => [
                          createVNode(unref(FileAddOutlined)),
                          createTextVNode(" Templates")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_button, { onClick: openBulkAdd }, {
                        default: withCtx(() => [
                          createVNode(unref(CopyOutlined)),
                          createTextVNode(" Bulk add")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_dropdown, null, {
                        overlay: withCtx(() => [
                          createVNode(_component_a_menu, null, {
                            default: withCtx(() => [
                              createVNode(_component_a_menu_item, { onClick: openImport }, {
                                default: withCtx(() => [
                                  createVNode(unref(UploadOutlined)),
                                  createTextVNode(" Import JSON ")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_menu_item, { onClick: openExport }, {
                                default: withCtx(() => [
                                  createVNode(unref(DownloadOutlined)),
                                  createTextVNode(" Export JSON ")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_menu_divider),
                              createVNode(_component_a_menu_item, { onClick: openSettings }, {
                                default: withCtx(() => [
                                  createVNode(unref(SettingOutlined)),
                                  createTextVNode(" Settings ")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_menu_item, { onClick: openShortcuts }, {
                                default: withCtx(() => [
                                  createVNode(_component_keyboard_outlined),
                                  createTextVNode(" Shortcuts ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        default: withCtx(() => [
                          createVNode(_component_a_button, null, {
                            default: withCtx(() => [
                              createVNode(unref(MoreOutlined))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_button, { onClick: saveDraft }, {
                        default: withCtx(() => [
                          createVNode(unref(SaveOutlined)),
                          createTextVNode(" Save draft")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_button, {
                        type: "primary",
                        onClick: saveModule
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(CheckOutlined)),
                          createTextVNode(" Save module")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["sub-title"]),
              restored.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "restore"
              }, [
                createVNode(_component_a_alert, {
                  type: "info",
                  "show-icon": "",
                  message: "Draft restored",
                  description: "We found a saved draft for this module and restored it.",
                  closable: "",
                  onClose: ($event) => restored.value = false
                }, null, 8, ["onClose"])
              ])) : createCommentVNode("", true),
              createVNode(_component_a_card, {
                class: "progress-card",
                bordered: false
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_row, {
                    gutter: 16,
                    align: "middle"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_col, {
                        xs: 24,
                        md: 12
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_space, {
                            direction: "vertical",
                            style: { "width": "100%" }
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_typography_text, { type: "secondary" }, {
                                default: withCtx(() => [
                                  createTextVNode("Completeness")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_progress, {
                                percent: completenessPct.value,
                                status: completenessPct.value >= 90 ? "success" : completenessPct.value >= 60 ? "normal" : "active"
                              }, null, 8, ["percent", "status"]),
                              createVNode(_component_a_typography_text, { type: "secondary" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(completenessLabel.value), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_col, {
                        xs: 24,
                        md: 12
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_space, {
                            direction: "vertical",
                            style: { "width": "100%" }
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_typography_text, { type: "secondary" }, {
                                default: withCtx(() => [
                                  createTextVNode("Totals")
                                ]),
                                _: 1
                              }),
                              createVNode("div", { class: "totals" }, [
                                createVNode(_component_a_tag, { color: "blue" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Lessons: " + toDisplayString(moduleData.lessons.length), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_tag, { color: "purple" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Minutes: " + toDisplayString(totalMinutes.value), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_tag, { color: "volcano" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Quizzes: " + toDisplayString(quizzesCount.value), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_tag, { color: "geekblue" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Assignments: " + toDisplayString(assignmentsCount.value), 1)
                                  ]),
                                  _: 1
                                }),
                                hasWarnings.value ? (openBlock(), createBlock(_component_a_tag, {
                                  key: 0,
                                  color: "orange"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Warnings: " + toDisplayString(warnings.value.length), 1)
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
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
              }),
              createVNode(_component_a_card, {
                class: "form-card",
                bordered: ""
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_form, {
                    layout: "vertical",
                    model: moduleData
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_form_item, {
                        label: "Module Title",
                        name: "title",
                        rules: [{ required: true, message: "Title is required" }],
                        "validate-status": moduleData.title ? "" : "warning",
                        help: !moduleData.title ? "A strong, student-focused title helps discoverability." : ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_input, {
                            value: moduleData.title,
                            "onUpdate:value": ($event) => moduleData.title = $event,
                            placeholder: "e.g. Composition API Basics",
                            onBlur: maybeGenerateSlug
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }, 8, ["validate-status", "help"]),
                      createVNode(_component_a_row, { gutter: 16 }, {
                        default: withCtx(() => [
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 16
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_form_item, { label: "Description" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_textarea, {
                                    value: moduleData.description,
                                    "onUpdate:value": ($event) => moduleData.description = $event,
                                    rows: "3",
                                    placeholder: "What will students learn in this module?"
                                  }, null, 8, ["value", "onUpdate:value"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_form_item, { label: "Learning Objectives (tags)" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_select, {
                                    value: moduleData.objectives,
                                    "onUpdate:value": ($event) => moduleData.objectives = $event,
                                    mode: "tags",
                                    placeholder: "Add objectives (press Enter)",
                                    "token-separators": [","],
                                    options: objectiveSuggestions
                                  }, null, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_typography_text, { type: "secondary" }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Tip: Keep objectives measurable and concise. ")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 8
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_form_item, { label: "Visibility" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_switch, {
                                    checked: moduleData.isPublic,
                                    "onUpdate:checked": ($event) => moduleData.isPublic = $event,
                                    "checked-children": "Public",
                                    "un-checked-children": "Private"
                                  }, null, 8, ["checked", "onUpdate:checked"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_form_item, { label: "Module Availability" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_date_picker, {
                                    value: moduleData.unlockAt,
                                    "onUpdate:value": ($event) => moduleData.unlockAt = $event,
                                    "show-time": "",
                                    style: { "width": "100%" },
                                    placeholder: "Optional unlock date/time"
                                  }, null, 8, ["value", "onUpdate:value"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_form_item, { label: "Module Slug (URL)" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_input, {
                                    value: moduleData.slug,
                                    "onUpdate:value": ($event) => moduleData.slug = $event,
                                    placeholder: "auto-generated-from-title"
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
                      createVNode(_component_a_divider, { orientation: "left" }, {
                        default: withCtx(() => [
                          createTextVNode(" Lessons "),
                          createVNode("span", { class: "muted" }, "(" + toDisplayString(moduleData.lessons.length) + ")", 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_space, {
                        style: { "margin-bottom": "12px" },
                        wrap: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_button, {
                            type: "dashed",
                            onClick: ($event) => addLesson()
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(PlusOutlined)),
                              createTextVNode(" Add lesson ")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(_component_a_button, { onClick: expandAll }, {
                            default: withCtx(() => [
                              createTextVNode("Expand all")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, { onClick: collapseAll }, {
                            default: withCtx(() => [
                              createTextVNode("Collapse all")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, { onClick: addQuizCheckpoint }, {
                            default: withCtx(() => [
                              createVNode(unref(QuestionCircleOutlined)),
                              createTextVNode(" Add checkpoint quiz ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, { onClick: addMiniAssignment }, {
                            default: withCtx(() => [
                              createVNode(unref(PaperClipOutlined)),
                              createTextVNode(" Add mini assignment ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, { onClick: addVideoIntro }, {
                            default: withCtx(() => [
                              createVNode(unref(VideoCameraOutlined)),
                              createTextVNode(" Add intro video ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_tag, { color: "blue" }, {
                            default: withCtx(() => [
                              createTextVNode("Total time: " + toDisplayString(totalMinutes.value) + " min", 1)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_space, { style: { "margin-bottom": "12px" } }, {
                        default: withCtx(() => [
                          createVNode(_component_a_tooltip, { title: "Undo (Ctrl/Cmd+Z)" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, {
                                disabled: !canUndo.value,
                                onClick: undoChange
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(ArrowLeftOutlined)),
                                  createTextVNode(" Undo ")
                                ]),
                                _: 1
                              }, 8, ["disabled"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_tooltip, { title: "Redo (Ctrl/Cmd+Shift+Z)" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, {
                                disabled: !canRedo.value,
                                onClick: redoChange
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(ArrowRightOutlined)),
                                  createTextVNode(" Redo ")
                                ]),
                                _: 1
                              }, 8, ["disabled"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_divider, { type: "vertical" }),
                          createVNode(_component_a_typography_text, { type: "secondary" }, {
                            default: withCtx(() => [
                              createTextVNode("History: " + toDisplayString(historyIndex.value + 1) + " / " + toDisplayString(history.value.length), 1)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_collapse, {
                        activeKey: activePanels.value,
                        "onUpdate:activeKey": ($event) => activePanels.value = $event
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(moduleData.lessons, (lesson, idx) => {
                            return openBlock(), createBlock(_component_a_collapse_panel, {
                              key: lesson.id,
                              header: panelTitle(lesson, idx)
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_row, { gutter: 16 }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_col, {
                                      xs: 24,
                                      md: 16
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_form, { layout: "vertical" }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_form_item, {
                                              label: "Title",
                                              rules: [{ required: true, message: "Lesson title is required" }]
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_input, {
                                                  value: lesson.title,
                                                  "onUpdate:value": ($event) => lesson.title = $event,
                                                  placeholder: "e.g. Reactive primitives"
                                                }, null, 8, ["value", "onUpdate:value"])
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(_component_a_form_item, { label: "Type" }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_select, {
                                                  value: lesson.type,
                                                  "onUpdate:value": ($event) => lesson.type = $event,
                                                  style: { "width": "100%" }
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_select_option, { value: "video" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(VideoCameraOutlined)),
                                                        createTextVNode(" Video ")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_select_option, { value: "reading" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(ReadOutlined)),
                                                        createTextVNode(" Reading ")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_select_option, { value: "quiz" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(QuestionCircleOutlined)),
                                                        createTextVNode(" Quiz ")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_select_option, { value: "assignment" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(PaperClipOutlined)),
                                                        createTextVNode(" Assignment ")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }, 8, ["value", "onUpdate:value"])
                                              ]),
                                              _: 2
                                            }, 1024),
                                            lesson.type === "video" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                              createVNode(_component_a_form_item, { label: "Video URL" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_input, {
                                                    value: lesson.videoUrl,
                                                    "onUpdate:value": ($event) => lesson.videoUrl = $event,
                                                    placeholder: "https://..."
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(_component_a_form_item, { label: "Transcript / Notes" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_textarea, {
                                                    value: lesson.content,
                                                    "onUpdate:value": ($event) => lesson.content = $event,
                                                    rows: "4"
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ], 64)) : lesson.type === "reading" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                              createVNode(_component_a_form_item, { label: "Article / Notes" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_textarea, {
                                                    value: lesson.content,
                                                    "onUpdate:value": ($event) => lesson.content = $event,
                                                    rows: "6",
                                                    placeholder: "Paste or write the reading content..."
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              readingTime(lesson.content) > 0 ? (openBlock(), createBlock(_component_a_alert, {
                                                key: 0,
                                                type: "info",
                                                "show-icon": "",
                                                message: `Estimated reading time: ${readingTime(lesson.content)} min`
                                              }, null, 8, ["message"])) : createCommentVNode("", true)
                                            ], 64)) : lesson.type === "assignment" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                              createVNode(_component_a_form_item, { label: "Brief" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_textarea, {
                                                    value: lesson.content,
                                                    "onUpdate:value": ($event) => lesson.content = $event,
                                                    rows: "4",
                                                    placeholder: "Describe the task students must complete"
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(_component_a_form_item, { label: "Rubric (optional)" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_textarea, {
                                                    value: lesson.rubric,
                                                    "onUpdate:value": ($event) => lesson.rubric = $event,
                                                    rows: "3",
                                                    placeholder: "How will you grade it?"
                                                  }, null, 8, ["value", "onUpdate:value"])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ], 64)) : lesson.type === "quiz" ? (openBlock(), createBlock(Fragment, { key: 3 }, [
                                              createVNode(_component_a_divider, { orientation: "left" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Questions")
                                                ]),
                                                _: 1
                                              }),
                                              !lesson.quiz?.questions?.length ? (openBlock(), createBlock("div", { key: 0 }, [
                                                createVNode(_component_a_empty, { description: "No questions yet" })
                                              ])) : createCommentVNode("", true),
                                              (openBlock(true), createBlock(Fragment, null, renderList(lesson.quiz?.questions || [], (q, qIdx) => {
                                                return openBlock(), createBlock("div", {
                                                  key: q.id,
                                                  class: "quiz-q"
                                                }, [
                                                  createVNode(_component_a_card, {
                                                    size: "small",
                                                    title: `Q${qIdx + 1}`,
                                                    style: { "margin-bottom": "8px" }
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_form, { layout: "vertical" }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_form_item, { label: "Question" }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_input, {
                                                                value: q.text,
                                                                "onUpdate:value": ($event) => q.text = $event
                                                              }, null, 8, ["value", "onUpdate:value"])
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode(_component_a_form_item, { label: "Type" }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_select, {
                                                                value: q.type,
                                                                "onUpdate:value": ($event) => q.type = $event,
                                                                style: { "width": "100%" }
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(_component_a_select_option, { value: "mcq" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("Multiple choice")
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(_component_a_select_option, { value: "tf" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("True/False")
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(_component_a_select_option, { value: "short" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("Short answer")
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 1
                                                              }, 8, ["value", "onUpdate:value"])
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          q.type === "mcq" ? (openBlock(), createBlock(_component_a_form_item, {
                                                            key: 0,
                                                            label: "Options"
                                                          }, {
                                                            default: withCtx(() => [
                                                              (openBlock(true), createBlock(Fragment, null, renderList(q.options, (opt, oIdx) => {
                                                                return openBlock(), createBlock("div", {
                                                                  key: oIdx,
                                                                  class: "mcq-opt"
                                                                }, [
                                                                  createVNode(_component_a_input, {
                                                                    value: opt.text,
                                                                    "onUpdate:value": ($event) => opt.text = $event,
                                                                    style: { "width": "70%" },
                                                                    placeholder: "Option text"
                                                                  }, null, 8, ["value", "onUpdate:value"]),
                                                                  createVNode(_component_a_checkbox, {
                                                                    checked: opt.correct,
                                                                    "onUpdate:checked": ($event) => opt.correct = $event,
                                                                    style: { "margin-left": "8px" }
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("Correct")
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["checked", "onUpdate:checked"]),
                                                                  createVNode(_component_a_button, {
                                                                    danger: "",
                                                                    type: "text",
                                                                    onClick: ($event) => removeOption(idx, qIdx, oIdx)
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(DeleteOutlined))
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["onClick"])
                                                                ]);
                                                              }), 128)),
                                                              createVNode(_component_a_button, {
                                                                size: "small",
                                                                type: "dashed",
                                                                onClick: ($event) => addOption(idx, qIdx),
                                                                style: { "margin-top": "6px" }
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(PlusOutlined)),
                                                                  createTextVNode(" Add option ")
                                                                ]),
                                                                _: 1
                                                              }, 8, ["onClick"])
                                                            ]),
                                                            _: 2
                                                          }, 1024)) : q.type === "tf" ? (openBlock(), createBlock(_component_a_alert, {
                                                            key: 1,
                                                            type: "info",
                                                            "show-icon": "",
                                                            message: "This will be a True/False question."
                                                          })) : q.type === "short" ? (openBlock(), createBlock(_component_a_alert, {
                                                            key: 2,
                                                            type: "info",
                                                            "show-icon": "",
                                                            message: "This will be a short, free-text answer."
                                                          })) : createCommentVNode("", true),
                                                          createVNode("div", { class: "row-right" }, [
                                                            createVNode(_component_a_space, null, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_button, {
                                                                  size: "small",
                                                                  onClick: ($event) => moveQuestion(idx, qIdx, -1)
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(ArrowUpOutlined))
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onClick"]),
                                                                createVNode(_component_a_button, {
                                                                  size: "small",
                                                                  onClick: ($event) => moveQuestion(idx, qIdx, 1)
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(ArrowDownOutlined))
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onClick"]),
                                                                createVNode(_component_a_button, {
                                                                  size: "small",
                                                                  danger: "",
                                                                  onClick: ($event) => removeQuestion(idx, qIdx)
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(DeleteOutlined))
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onClick"])
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ])
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["title"])
                                                ]);
                                              }), 128)),
                                              createVNode(_component_a_space, null, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_button, {
                                                    type: "dashed",
                                                    size: "small",
                                                    onClick: ($event) => addQuestion(idx)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(PlusOutlined)),
                                                      createTextVNode(" Add question ")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"]),
                                                  createVNode(_component_a_button, {
                                                    size: "small",
                                                    onClick: ($event) => seedFiveMcq(idx)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(CopyOutlined)),
                                                      createTextVNode(" Seed 5 MCQ ")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ], 64)) : createCommentVNode("", true)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(_component_a_col, {
                                      xs: 24,
                                      md: 8
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_form, { layout: "vertical" }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_form_item, { label: "Estimated Time (min)" }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_input_number, {
                                                  value: lesson.duration,
                                                  "onUpdate:value": ($event) => lesson.duration = $event,
                                                  min: 1,
                                                  max: 600,
                                                  style: { "width": "100%" }
                                                }, null, 8, ["value", "onUpdate:value"])
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(_component_a_form_item, { label: "Prerequisite lessons (IDs)" }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_select, {
                                                  value: lesson.prerequisites,
                                                  "onUpdate:value": ($event) => lesson.prerequisites = $event,
                                                  mode: "multiple",
                                                  options: prereqOptions(idx),
                                                  placeholder: "Optional"
                                                }, null, 8, ["value", "onUpdate:value", "options"])
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(_component_a_form_item, { label: "Tags" }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_select, {
                                                  value: lesson.tags,
                                                  "onUpdate:value": ($event) => lesson.tags = $event,
                                                  mode: "tags",
                                                  placeholder: "Add tags"
                                                }, null, 8, ["value", "onUpdate:value"])
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(_component_a_form_item, { label: "Availability" }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_date_picker, {
                                                  value: lesson.unlockAt,
                                                  "onUpdate:value": ($event) => lesson.unlockAt = $event,
                                                  "show-time": "",
                                                  style: { "width": "100%" },
                                                  placeholder: "Optional"
                                                }, null, 8, ["value", "onUpdate:value"])
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(_component_a_form_item, { label: "Resources (links)" }, {
                                              default: withCtx(() => [
                                                (openBlock(true), createBlock(Fragment, null, renderList(lesson.resources, (r, rIdx) => {
                                                  return openBlock(), createBlock("div", {
                                                    key: rIdx,
                                                    class: "resource-row"
                                                  }, [
                                                    createVNode(_component_a_input, {
                                                      value: r.title,
                                                      "onUpdate:value": ($event) => r.title = $event,
                                                      placeholder: "Title",
                                                      style: { "width": "35%" }
                                                    }, null, 8, ["value", "onUpdate:value"]),
                                                    createVNode(_component_a_input, {
                                                      value: r.url,
                                                      "onUpdate:value": ($event) => r.url = $event,
                                                      placeholder: "https://…",
                                                      style: { "width": "55%", "margin-left": "8px" }
                                                    }, null, 8, ["value", "onUpdate:value"]),
                                                    createVNode(_component_a_button, {
                                                      type: "text",
                                                      danger: "",
                                                      onClick: ($event) => removeResource(idx, rIdx)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(DeleteOutlined))
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onClick"])
                                                  ]);
                                                }), 128)),
                                                createVNode(_component_a_button, {
                                                  size: "small",
                                                  type: "dashed",
                                                  onClick: ($event) => addResource(idx),
                                                  style: { "margin-top": "6px" }
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(PlusOutlined)),
                                                    createTextVNode(" Add resource ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"])
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(_component_a_form_item, { label: "Attachments" }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_upload, {
                                                  "file-list": lesson.attachments,
                                                  "onUpdate:fileList": ($event) => lesson.attachments = $event,
                                                  "before-upload": () => false,
                                                  multiple: true
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_button, { size: "small" }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(PaperClipOutlined)),
                                                        createTextVNode(" Add files")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }, 8, ["file-list", "onUpdate:fileList"])
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode("div", { class: "row-right" }, [
                                              createVNode(_component_a_space, { wrap: "" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_button, {
                                                    onClick: ($event) => duplicateLesson(idx)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(CopyOutlined)),
                                                      createTextVNode(" Duplicate")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"]),
                                                  createVNode(_component_a_button, {
                                                    onClick: ($event) => _ctx.previewLesson(lesson)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(EyeOutlined)),
                                                      createTextVNode(" Preview")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"]),
                                                  createVNode(_component_a_button, {
                                                    onClick: ($event) => moveLesson(idx, -1)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(ArrowUpOutlined))
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"]),
                                                  createVNode(_component_a_button, {
                                                    onClick: ($event) => moveLesson(idx, 1)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(ArrowDownOutlined))
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"]),
                                                  createVNode(_component_a_popconfirm, {
                                                    title: "Delete this lesson?",
                                                    onConfirm: ($event) => removeLesson(idx)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_button, { danger: "" }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(DeleteOutlined)),
                                                          createTextVNode(" Delete")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onConfirm"])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ])
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                lessonWarnings(idx).length ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "lesson-warn"
                                }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(lessonWarnings(idx), (w, wi) => {
                                    return openBlock(), createBlock(_component_a_alert, {
                                      key: wi,
                                      type: "warning",
                                      "show-icon": "",
                                      message: w,
                                      style: { "margin-top": "8px" }
                                    }, null, 8, ["message"]);
                                  }), 128))
                                ])) : createCommentVNode("", true)
                              ]),
                              _: 2
                            }, 1032, ["header"]);
                          }), 128))
                        ]),
                        _: 1
                      }, 8, ["activeKey", "onUpdate:activeKey"])
                    ]),
                    _: 1
                  }, 8, ["model"])
                ]),
                _: 1
              }),
              createVNode(_component_a_modal, {
                open: previewOpen.value,
                "onUpdate:open": ($event) => previewOpen.value = $event,
                title: "Student Preview",
                width: "720px",
                footer: null
              }, {
                default: withCtx(() => [
                  previewData.value ? (openBlock(), createBlock("div", { key: 0 }, [
                    createVNode(_component_a_typography_title, { level: 4 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(previewData.value.title), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_space, {
                      direction: "vertical",
                      style: { "width": "100%" }
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_tag, null, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(previewData.value.type), 1)
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_typography_text, { type: "secondary" }, {
                          default: withCtx(() => [
                            createTextVNode("Estimated: " + toDisplayString(previewData.value.duration || 0) + " min", 1)
                          ]),
                          _: 1
                        }),
                        previewData.value.type === "video" && previewData.value.videoUrl ? (openBlock(), createBlock("div", { key: 0 }, [
                          createVNode(_component_a_typography_text, { strong: "" }, {
                            default: withCtx(() => [
                              createTextVNode("Video:")
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "video-box" }, toDisplayString(previewData.value.videoUrl), 1)
                        ])) : createCommentVNode("", true),
                        previewData.value.content ? (openBlock(), createBlock("div", { key: 1 }, [
                          createVNode(_component_a_typography_text, { strong: "" }, {
                            default: withCtx(() => [
                              createTextVNode("Content:")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_typography_paragraph, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(previewData.value.content), 1)
                            ]),
                            _: 1
                          })
                        ])) : createCommentVNode("", true),
                        previewData.value.type === "quiz" && previewData.value.quiz?.questions?.length ? (openBlock(), createBlock("div", { key: 2 }, [
                          createVNode(_component_a_divider, null, {
                            default: withCtx(() => [
                              createTextVNode("Questions")
                            ]),
                            _: 1
                          }),
                          createVNode("ol", { style: { "padding-left": "20px", "margin": "0" } }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(previewData.value.quiz.questions, (q) => {
                              return openBlock(), createBlock("li", {
                                key: q.id
                              }, toDisplayString(q.text), 1);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true),
                        previewData.value.resources?.length ? (openBlock(), createBlock("div", { key: 3 }, [
                          createVNode(_component_a_divider, null, {
                            default: withCtx(() => [
                              createTextVNode("Resources")
                            ]),
                            _: 1
                          }),
                          createVNode("ul", null, [
                            (openBlock(true), createBlock(Fragment, null, renderList(previewData.value.resources, (r, i) => {
                              return openBlock(), createBlock("li", { key: i }, [
                                createVNode("a", {
                                  href: safeUrl(r.url),
                                  target: "_blank"
                                }, toDisplayString(r.title || r.url), 9, ["href"])
                              ]);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true)
                      ]),
                      _: 1
                    })
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              }, 8, ["open", "onUpdate:open"]),
              createVNode(_component_a_modal, {
                open: templatesOpen.value,
                "onUpdate:open": ($event) => templatesOpen.value = $event,
                title: "Lesson templates",
                onOk: applyTemplate,
                onCancel: ($event) => templatesOpen.value = false
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_radio_group, {
                    value: selectedTemplate.value,
                    "onUpdate:value": ($event) => selectedTemplate.value = $event,
                    style: { "width": "100%" }
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_radio, { value: "video:intro" }, {
                        default: withCtx(() => [
                          createTextVNode("Intro video (goals + overview)")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_radio, { value: "reading:notes" }, {
                        default: withCtx(() => [
                          createTextVNode("Concept reading (definitions + examples)")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_radio, { value: "quiz:checkpoint" }, {
                        default: withCtx(() => [
                          createTextVNode("Checkpoint quiz (5 MCQs)")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_radio, { value: "assignment:mini" }, {
                        default: withCtx(() => [
                          createTextVNode("Mini assignment (15-30 min)")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }, 8, ["open", "onUpdate:open", "onCancel"]),
              createVNode(_component_a_modal, {
                open: bulkOpen.value,
                "onUpdate:open": ($event) => bulkOpen.value = $event,
                title: "Bulk add lessons",
                onOk: confirmBulkAdd,
                onCancel: ($event) => bulkOpen.value = false,
                "ok-text": "Create"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_typography_paragraph, null, {
                    default: withCtx(() => [
                      createTextVNode(" Paste lines like: "),
                      createVNode("code", null, "Video | Composition API intro | 8"),
                      createTextVNode(" (Type | Title | Minutes). One per line. ")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_textarea, {
                    value: bulkText.value,
                    "onUpdate:value": ($event) => bulkText.value = $event,
                    rows: "6",
                    placeholder: "Video | Setup dev env | 6\nReading | Reactivity notes | 10"
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }, 8, ["open", "onUpdate:open", "onCancel"]),
              createVNode(_component_a_modal, {
                open: importOpen.value,
                "onUpdate:open": ($event) => importOpen.value = $event,
                title: "Import JSON",
                "ok-text": "Import",
                onOk: confirmImport,
                onCancel: ($event) => importOpen.value = false
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_typography_paragraph, null, {
                    default: withCtx(() => [
                      createTextVNode(" Paste a JSON export of a module. This overwrites the current form. ")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_textarea, {
                    value: importText.value,
                    "onUpdate:value": ($event) => importText.value = $event,
                    rows: 10,
                    placeholder: '{"title":"...","lessons":[...]}'
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }, 8, ["open", "onUpdate:open", "onCancel"]),
              createVNode(_component_a_modal, {
                open: exportOpen.value,
                "onUpdate:open": ($event) => exportOpen.value = $event,
                title: "Export JSON",
                footer: null,
                onCancel: ($event) => exportOpen.value = false,
                width: "720px"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_alert, {
                    type: "success",
                    message: "Copy the JSON below",
                    "show-icon": "",
                    style: { "margin-bottom": "12px" }
                  }),
                  createVNode(_component_a_textarea, {
                    value: exportText.value,
                    rows: 14
                  }, null, 8, ["value"])
                ]),
                _: 1
              }, 8, ["open", "onUpdate:open", "onCancel"]),
              createVNode(_component_a_modal, {
                open: settingsOpen.value,
                "onUpdate:open": ($event) => settingsOpen.value = $event,
                title: "Module settings",
                "ok-text": "Done",
                onOk: ($event) => settingsOpen.value = false,
                onCancel: ($event) => settingsOpen.value = false
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_form, { layout: "vertical" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_form_item, { label: "Default lesson duration (min)" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_input_number, {
                            value: settings.defaultDuration,
                            "onUpdate:value": ($event) => settings.defaultDuration = $event,
                            min: 1,
                            max: 600
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_form_item, { label: "Warn if lesson missing title" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_switch, {
                            checked: settings.warnMissingTitle,
                            "onUpdate:checked": ($event) => settings.warnMissingTitle = $event
                          }, null, 8, ["checked", "onUpdate:checked"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_form_item, { label: "Warn if duration is 0" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_switch, {
                            checked: settings.warnZeroDuration,
                            "onUpdate:checked": ($event) => settings.warnZeroDuration = $event
                          }, null, 8, ["checked", "onUpdate:checked"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["open", "onUpdate:open", "onOk", "onCancel"]),
              createVNode(_component_a_modal, {
                open: shortcutsOpen.value,
                "onUpdate:open": ($event) => shortcutsOpen.value = $event,
                title: "Keyboard shortcuts",
                footer: null,
                onCancel: ($event) => shortcutsOpen.value = false
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_descriptions, {
                    bordered: "",
                    column: 1,
                    size: "small"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_descriptions_item, { label: "Save draft" }, {
                        default: withCtx(() => [
                          createTextVNode("Ctrl/Cmd + S")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_descriptions_item, { label: "Add lesson" }, {
                        default: withCtx(() => [
                          createTextVNode("Ctrl/Cmd + Enter")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_descriptions_item, { label: "Undo" }, {
                        default: withCtx(() => [
                          createTextVNode("Ctrl/Cmd + Z")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_descriptions_item, { label: "Redo" }, {
                        default: withCtx(() => [
                          createTextVNode("Ctrl/Cmd + Shift + Z")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_descriptions_item, { label: "Expand all" }, {
                        default: withCtx(() => [
                          createTextVNode("Ctrl/Cmd + .")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_descriptions_item, { label: "Collapse all" }, {
                        default: withCtx(() => [
                          createTextVNode("Ctrl/Cmd + ,")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["open", "onUpdate:open", "onCancel"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/teach-internal/nuxt/pages/course/module/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const create = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a217beca"]]);

export { create as default };
//# sourceMappingURL=create-Ciyw9O9D.mjs.map
