import { defineComponent, ref, reactive, computed, h, resolveComponent, mergeProps, withCtx, createTextVNode, unref, createVNode, withDirectives, toDisplayString, vShow, resolveDynamicComponent, createBlock, openBlock, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderVNode, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { DashboardOutlined, BookOutlined, FileTextOutlined, ExperimentOutlined, MessageOutlined, PaperClipOutlined, TeamOutlined, OrderedListOutlined, CalendarOutlined, BarChartOutlined, SettingOutlined, CheckCircleOutlined, PlusOutlined, DownOutlined, InboxOutlined } from '@ant-design/icons-vue';
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
import 'vue-router';
import '@apollo/client/core/index.js';
import '@apollo/client/link/context/index.js';
import '@vue/apollo-composable';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "lab",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const active = ref("overview");
    const siderCollapsed = ref(false);
    const enrolled = ref(true);
    const viewMode = ref("Instructor view");
    const course = reactive({
      id: "demo-course",
      title: "Human-Centered Design",
      instructor: { name: "Dr. Alex Example", email: "alex@example.edu" },
      term: "Fall 2025",
      description: "Studio-based exploration of HCD methods.",
      avatar: "https://images.unsplash.com/photo-1587614382346-4ec71c171234?q=80&w=300&auto=format&fit=crop"
    });
    const modules = ref([]);
    const assignments = ref([]);
    const announcements = ref([]);
    const discussions = ref([]);
    const files = ref([]);
    const participants = ref([]);
    const quizzes = ref([]);
    const grades = ref([]);
    function seed() {
      modules.value = [
        {
          id: "m1",
          title: "Orientation",
          lessons: [
            { id: "l1", title: "Course intro", type: "page", done: true },
            { id: "l2", title: "Syllabus walkthrough (video)", type: "video" }
          ]
        },
        {
          id: "m2",
          title: "Research",
          lessons: [
            { id: "l3", title: "Interviews 101", type: "page" },
            { id: "l4", title: "Survey design", type: "page" },
            { id: "l5", title: "Quiz: Research basics", type: "quiz" }
          ]
        }
      ];
      assignments.value = [
        { id: "a1", title: "Research Plan", due: "2025-12-01", points: 10, status: "open", body: "Outline your plan." },
        { id: "a2", title: "Prototype v1", due: "2025-12-10", points: 25, status: "open", body: "Upload low-fi prototype." },
        { id: "a3", title: "Reflection", due: "2025-11-28", points: 5, status: "closed", body: "Short reflection." }
      ];
      announcements.value = [
        { id: "ann1", title: "Welcome!", date: (/* @__PURE__ */ new Date()).toISOString(), body: "Say hi on the forum." },
        { id: "ann2", title: "Room change", date: (/* @__PURE__ */ new Date()).toISOString(), body: "Next week in Studio B." }
      ];
      discussions.value = [
        { id: "d1", title: "Introductions", posts: [{ id: "p1", author: "Sam", body: "Hi everyone!" }], updatedAt: "2025-10-01" },
        { id: "d2", title: "Tools & tips", posts: [{ id: "p2", author: "Lee", body: "Use Miro…" }], updatedAt: "2025-10-05" }
      ];
      files.value = [
        { id: "f1", name: "Syllabus.pdf", type: "pdf", date: "2025-09-01" },
        { id: "f2", name: "Lecture1.mp4", type: "video", date: "2025-09-03" },
        { id: "f3", name: "Template.docx", type: "doc", date: "2025-09-04" }
      ];
      participants.value = [
        { id: "u1", name: "Sam Taylor", email: "sam@ex.edu", role: "student" },
        { id: "u2", name: "Lee Park", email: "lee@ex.edu", role: "student" },
        { id: "u3", name: "Pat Doe", email: "pat@ex.edu", role: "ta" }
      ];
      quizzes.value = [
        { id: "q1", title: "Research basics", due: "2025-12-02", attempts: 1, avg: 78 },
        { id: "q2", title: "Ethnography", due: "2025-12-14", attempts: 0, avg: 0 }
      ];
      grades.value = [
        { id: "g1", student: "Sam Taylor", item: "Research Plan", max: 10, score: 9 },
        { id: "g2", student: "Sam Taylor", item: "Quiz: Research basics", max: 10, score: 7 },
        { id: "g3", student: "Lee Park", item: "Research Plan", max: 10, score: 10 }
      ];
    }
    function onMenu(e) {
      active.value = e.key;
    }
    function formatDate(d) {
      const dt = typeof d === "string" ? new Date(d) : d;
      if (Number.isNaN(dt.getTime())) return "—";
      return dt.toLocaleDateString();
    }
    const totalLessons = computed(() => modules.value.reduce((n, m) => n + m.lessons.length, 0));
    const completedLessons = computed(() => modules.value.reduce((n, m) => n + m.lessons.filter((l) => l.done).length, 0));
    const progressPercent = computed(() => totalLessons.value ? Math.round(completedLessons.value / totalLessons.value * 100) : 0);
    const upcoming = computed(
      () => assignments.value.filter((a) => a.status === "open").slice().sort((a, b) => a.due > b.due ? 1 : -1).slice(0, 5)
    );
    const avgGrade = computed(() => {
      const items = grades.value;
      if (!items.length) return 0;
      const pct = items.reduce((n, g) => n + g.score / g.max, 0) / items.length;
      return Math.round(pct * 100);
    });
    const submissionRate = computed(() => Math.min(100, Math.round(assignments.value.filter((a) => a.status === "closed").length / Math.max(1, assignments.value.length) * 100)));
    const overviewExtra = h("a-space", null, [
      h("a-button", { size: "small", onClick: openAnnouncementEditor }, "New")
    ]);
    const moduleSearch = ref("");
    const filteredModules = computed(() => {
      const q = moduleSearch.value.toLowerCase().trim();
      if (!q) return modules.value;
      return modules.value.map((m) => ({
        ...m,
        lessons: m.lessons.filter((l) => l.title.toLowerCase().includes(q))
      })).filter((m) => m.lessons.length);
    });
    function toggleLesson(m, l) {
      l.done = !l.done;
    }
    function openLesson(m, l) {
      detail.type = "lesson";
      detail.title = `${m.title} — ${l.title}`;
      detail.item = l;
      detail.open = true;
    }
    function quickAdd(kind, m, l) {
      openAssignmentEditor({ title: `Follow-up: ${l.title}`, due: (/* @__PURE__ */ new Date()).toISOString(), points: 10, status: "open", id: "tmp" });
    }
    function openModuleCreator() {
      message.info("Module creator (mock)");
    }
    const assignmentFilter = ref("All");
    const assignmentSearch = ref("");
    const assignmentCols = [
      { title: "Title", key: "title", dataIndex: "title" },
      { title: "Due", key: "due", dataIndex: "due" },
      { title: "Points", key: "points", dataIndex: "points", width: 100 },
      { title: "Status", key: "status", dataIndex: "status", width: 120 },
      { title: "", key: "actions", width: 220 }
    ];
    const filteredAssignments = computed(() => {
      const q = assignmentSearch.value.toLowerCase().trim();
      return assignments.value.filter((a) => {
        const f = assignmentFilter.value;
        const okStatus = f === "All" || (f === "Open" ? a.status === "open" : a.status === "closed");
        const okSearch = !q || a.title.toLowerCase().includes(q);
        return okStatus && okSearch;
      });
    });
    function openAssignment(a) {
      detail.type = "assignment";
      detail.title = a.title;
      detail.item = a;
      detail.open = true;
    }
    function openAssignmentEditor(a) {
      assignmentEditor.open = true;
      assignmentEditor.mode = a?.id ? "edit" : "create";
      assignmentEditor.data = {
        id: a?.id || `a${Date.now()}`,
        title: a?.title || "",
        due: a?.due || (/* @__PURE__ */ new Date()).toISOString(),
        points: a?.points ?? 10,
        status: a?.status || "open",
        body: a?.body || ""
      };
    }
    function saveAssignment() {
      const data = assignmentEditor.data;
      const idx = assignments.value.findIndex((x) => x.id === data.id);
      if (idx === -1) assignments.value.unshift(data);
      else assignments.value[idx] = { ...data };
      assignmentEditor.open = false;
      message.success("Assignment saved");
    }
    function removeAssignment(a) {
      assignments.value = assignments.value.filter((x) => x.id !== a.id);
      message.success("Assignment deleted");
    }
    const assignmentEditor = reactive({ open: false, mode: "create", data: {} });
    const quizCols = [
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Due", dataIndex: "due", key: "due" },
      { title: "Attempts", dataIndex: "attempts", key: "attempts", width: 120 },
      { title: "Average", dataIndex: "avg", key: "avg", width: 120 }
    ];
    function createQuiz() {
      message.info("Quiz builder (mock)");
    }
    const discussionSearch = ref("");
    const filteredDiscussions = computed(() => {
      const q = discussionSearch.value.toLowerCase().trim();
      return discussions.value.filter((d) => !q || d.title.toLowerCase().includes(q));
    });
    function openDiscussion(d) {
      detail.type = "discussion";
      detail.title = d.title;
      detail.item = d;
      detail.open = true;
    }
    function openDiscussionEditor() {
      message.info("Discussion editor (mock)");
    }
    const fileType = ref("all");
    const fileSearch = ref("");
    const filteredFiles = computed(() => {
      const q = fileSearch.value.toLowerCase().trim();
      return files.value.filter((f) => {
        const okType = fileType.value === "all" || f.type === fileType.value;
        const okSearch = !q || f.name.toLowerCase().includes(q);
        return okType && okSearch;
      });
    });
    function handleBeforeUpload(file) {
      const type = file.name.endsWith(".pdf") ? "pdf" : file.name.match(/\.(mp4|mov)$/) ? "video" : file.name.match(/\.(doc|docx)$/) ? "doc" : "file";
      files.value.unshift({ id: `f${Date.now()}`, name: file.name, type, date: (/* @__PURE__ */ new Date()).toISOString() });
      message.success(`Added ${file.name}`);
      return false;
    }
    function removeFile(f) {
      files.value = files.value.filter((x) => x.id !== f.id);
    }
    const participantSearch = ref("");
    const roleFilter = ref("all");
    const participantCols = [
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Role", dataIndex: "role", key: "role", width: 120 }
    ];
    const filteredParticipants = computed(() => {
      const q = participantSearch.value.toLowerCase().trim();
      return participants.value.filter((p) => {
        const okRole = roleFilter.value === "all" || p.role === roleFilter.value;
        const okSearch = !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
        return okRole && okSearch;
      });
    });
    const selectedStudent = ref();
    const gradeCols = [
      { title: "Student", dataIndex: "student", key: "student" },
      { title: "Item", dataIndex: "item", key: "item" },
      { title: "Max", dataIndex: "max", key: "max", width: 100 },
      { title: "Score", dataIndex: "score", key: "score", width: 100 }
    ];
    const filteredGrades = computed(() => {
      return grades.value.filter((g) => !selectedStudent.value || g.student === selectedStudent.value);
    });
    function exportGrades() {
      const header = "student,item,max,score\n";
      const lines = filteredGrades.value.map((g) => [g.student, g.item, g.max, g.score].join(",")).join("\n");
      const blob = new Blob([header + lines], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = (void 0).createElement("a");
      a.href = url;
      a.download = "grades.csv";
      a.click();
      URL.revokeObjectURL(url);
      message.success("Exported grades.csv");
    }
    function eventsOn(date) {
      const dstr = date.toDateString();
      return assignments.value.filter((a) => new Date(a.due).toDateString() === dstr).map((a) => ({ id: a.id, title: a.title, type: "assignment" }));
    }
    const detail = reactive({ open: false, type: "", item: null, title: "" });
    function openAnnouncement(a) {
      detail.type = "announcement";
      detail.title = a.title;
      detail.item = a;
      detail.open = true;
    }
    function openAnnouncementEditor() {
      message.info("Announcement editor (mock)");
    }
    function saveCourse() {
      message.success("Course saved (mock)");
    }
    function resetCourse() {
      seed();
      message.success("Reset to mock data");
    }
    function toggleEnroll() {
      enrolled.value = !enrolled.value;
      message.success(enrolled.value ? "Joined" : "Left");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_layout_sider = resolveComponent("a-layout-sider");
      const _component_a_avatar = resolveComponent("a-avatar");
      const _component_a_menu = resolveComponent("a-menu");
      const _component_a_menu_item = resolveComponent("a-menu-item");
      const _component_a_layout_header = resolveComponent("a-layout-header");
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_segmented = resolveComponent("a-segmented");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_dropdown = resolveComponent("a-dropdown");
      const _component_a_layout_content = resolveComponent("a-layout-content");
      const _component_a_spin = resolveComponent("a-spin");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_progress = resolveComponent("a-progress");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_list = resolveComponent("a-list");
      const _component_a_empty = resolveComponent("a-empty");
      const _component_a_list_item = resolveComponent("a-list-item");
      const _component_a_list_item_meta = resolveComponent("a-list-item-meta");
      const _component_a_typography_title = resolveComponent("a-typography-title");
      const _component_a_input_search = resolveComponent("a-input-search");
      const _component_a_collapse = resolveComponent("a-collapse");
      const _component_a_collapse_panel = resolveComponent("a-collapse-panel");
      const _component_a_checkbox = resolveComponent("a-checkbox");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_badge = resolveComponent("a-badge");
      const _component_a_typography_link = resolveComponent("a-typography-link");
      const _component_a_popconfirm = resolveComponent("a-popconfirm");
      const _component_a_select = resolveComponent("a-select");
      const _component_a_select_option = resolveComponent("a-select-option");
      const _component_a_upload_dragger = resolveComponent("a-upload-dragger");
      const _component_a_calendar = resolveComponent("a-calendar");
      const _component_a_statistic = resolveComponent("a-statistic");
      const _component_a_form = resolveComponent("a-form");
      const _component_a_form_item = resolveComponent("a-form-item");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_textarea = resolveComponent("a-textarea");
      const _component_a_drawer = resolveComponent("a-drawer");
      const _component_a_date_picker = resolveComponent("a-date-picker");
      const _component_a_input_number = resolveComponent("a-input-number");
      const _component_a_modal = resolveComponent("a-modal");
      const _component_a_descriptions = resolveComponent("a-descriptions");
      const _component_a_descriptions_item = resolveComponent("a-descriptions-item");
      const _component_a_typography_paragraph = resolveComponent("a-typography-paragraph");
      const _component_a_comment = resolveComponent("a-comment");
      _push(ssrRenderComponent(_component_a_layout, mergeProps({
        id: "course-area",
        class: "course-area"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_layout_sider, {
              collapsible: "",
              collapsed: siderCollapsed.value,
              "onUpdate:collapsed": ($event) => siderCollapsed.value = $event,
              width: 260,
              class: "sider"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="sider-head" data-v-1f1dc1e1${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_a_avatar, {
                    src: course.avatar,
                    shape: "square",
                    size: 46
                  }, null, _parent3, _scopeId2));
                  _push3(`<div class="sider-title" style="${ssrRenderStyle(!siderCollapsed.value ? null : { display: "none" })}" data-v-1f1dc1e1${_scopeId2}><div class="name" data-v-1f1dc1e1${_scopeId2}>${ssrInterpolate(course.title)}</div><div class="muted" data-v-1f1dc1e1${_scopeId2}>${ssrInterpolate(course.instructor.name)}</div></div></div>`);
                  _push3(ssrRenderComponent(_component_a_menu, {
                    mode: "inline",
                    selectedKeys: [active.value],
                    onClick: onMenu,
                    "inline-collapsed": siderCollapsed.value
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "overview" }, {
                          icon: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(DashboardOutlined), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(DashboardOutlined))
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Overview `);
                            } else {
                              return [
                                createTextVNode(" Overview ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "modules" }, {
                          icon: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(BookOutlined), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(BookOutlined))
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Modules `);
                            } else {
                              return [
                                createTextVNode(" Modules ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "assignments" }, {
                          icon: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(FileTextOutlined), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(FileTextOutlined))
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Assignments `);
                            } else {
                              return [
                                createTextVNode(" Assignments ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "quizzes" }, {
                          icon: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(ExperimentOutlined), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(ExperimentOutlined))
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Quizzes `);
                            } else {
                              return [
                                createTextVNode(" Quizzes ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "discussions" }, {
                          icon: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(MessageOutlined), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(MessageOutlined))
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Discussions `);
                            } else {
                              return [
                                createTextVNode(" Discussions ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "files" }, {
                          icon: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(PaperClipOutlined), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(PaperClipOutlined))
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Files `);
                            } else {
                              return [
                                createTextVNode(" Files ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "participants" }, {
                          icon: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(TeamOutlined), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(TeamOutlined))
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Participants `);
                            } else {
                              return [
                                createTextVNode(" Participants ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "grades" }, {
                          icon: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(OrderedListOutlined), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(OrderedListOutlined))
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Gradebook `);
                            } else {
                              return [
                                createTextVNode(" Gradebook ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "calendar" }, {
                          icon: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(CalendarOutlined), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(CalendarOutlined))
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Calendar `);
                            } else {
                              return [
                                createTextVNode(" Calendar ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "analytics" }, {
                          icon: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(BarChartOutlined), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(BarChartOutlined))
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Analytics `);
                            } else {
                              return [
                                createTextVNode(" Analytics ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_menu_item, { key: "settings" }, {
                          icon: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(SettingOutlined), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(SettingOutlined))
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Settings `);
                            } else {
                              return [
                                createTextVNode(" Settings ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_menu_item, { key: "overview" }, {
                            icon: withCtx(() => [
                              createVNode(unref(DashboardOutlined))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" Overview ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, { key: "modules" }, {
                            icon: withCtx(() => [
                              createVNode(unref(BookOutlined))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" Modules ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, { key: "assignments" }, {
                            icon: withCtx(() => [
                              createVNode(unref(FileTextOutlined))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" Assignments ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, { key: "quizzes" }, {
                            icon: withCtx(() => [
                              createVNode(unref(ExperimentOutlined))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" Quizzes ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, { key: "discussions" }, {
                            icon: withCtx(() => [
                              createVNode(unref(MessageOutlined))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" Discussions ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, { key: "files" }, {
                            icon: withCtx(() => [
                              createVNode(unref(PaperClipOutlined))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" Files ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, { key: "participants" }, {
                            icon: withCtx(() => [
                              createVNode(unref(TeamOutlined))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" Participants ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, { key: "grades" }, {
                            icon: withCtx(() => [
                              createVNode(unref(OrderedListOutlined))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" Gradebook ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, { key: "calendar" }, {
                            icon: withCtx(() => [
                              createVNode(unref(CalendarOutlined))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" Calendar ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, { key: "analytics" }, {
                            icon: withCtx(() => [
                              createVNode(unref(BarChartOutlined))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" Analytics ")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_menu_item, { key: "settings" }, {
                            icon: withCtx(() => [
                              createVNode(unref(SettingOutlined))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" Settings ")
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
                    createVNode("div", { class: "sider-head" }, [
                      createVNode(_component_a_avatar, {
                        src: course.avatar,
                        shape: "square",
                        size: 46
                      }, null, 8, ["src"]),
                      withDirectives(createVNode("div", { class: "sider-title" }, [
                        createVNode("div", { class: "name" }, toDisplayString(course.title), 1),
                        createVNode("div", { class: "muted" }, toDisplayString(course.instructor.name), 1)
                      ], 512), [
                        [vShow, !siderCollapsed.value]
                      ])
                    ]),
                    createVNode(_component_a_menu, {
                      mode: "inline",
                      selectedKeys: [active.value],
                      onClick: onMenu,
                      "inline-collapsed": siderCollapsed.value
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_menu_item, { key: "overview" }, {
                          icon: withCtx(() => [
                            createVNode(unref(DashboardOutlined))
                          ]),
                          default: withCtx(() => [
                            createTextVNode(" Overview ")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu_item, { key: "modules" }, {
                          icon: withCtx(() => [
                            createVNode(unref(BookOutlined))
                          ]),
                          default: withCtx(() => [
                            createTextVNode(" Modules ")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu_item, { key: "assignments" }, {
                          icon: withCtx(() => [
                            createVNode(unref(FileTextOutlined))
                          ]),
                          default: withCtx(() => [
                            createTextVNode(" Assignments ")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu_item, { key: "quizzes" }, {
                          icon: withCtx(() => [
                            createVNode(unref(ExperimentOutlined))
                          ]),
                          default: withCtx(() => [
                            createTextVNode(" Quizzes ")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu_item, { key: "discussions" }, {
                          icon: withCtx(() => [
                            createVNode(unref(MessageOutlined))
                          ]),
                          default: withCtx(() => [
                            createTextVNode(" Discussions ")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu_item, { key: "files" }, {
                          icon: withCtx(() => [
                            createVNode(unref(PaperClipOutlined))
                          ]),
                          default: withCtx(() => [
                            createTextVNode(" Files ")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu_item, { key: "participants" }, {
                          icon: withCtx(() => [
                            createVNode(unref(TeamOutlined))
                          ]),
                          default: withCtx(() => [
                            createTextVNode(" Participants ")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu_item, { key: "grades" }, {
                          icon: withCtx(() => [
                            createVNode(unref(OrderedListOutlined))
                          ]),
                          default: withCtx(() => [
                            createTextVNode(" Gradebook ")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu_item, { key: "calendar" }, {
                          icon: withCtx(() => [
                            createVNode(unref(CalendarOutlined))
                          ]),
                          default: withCtx(() => [
                            createTextVNode(" Calendar ")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu_item, { key: "analytics" }, {
                          icon: withCtx(() => [
                            createVNode(unref(BarChartOutlined))
                          ]),
                          default: withCtx(() => [
                            createTextVNode(" Analytics ")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_menu_item, { key: "settings" }, {
                          icon: withCtx(() => [
                            createVNode(unref(SettingOutlined))
                          ]),
                          default: withCtx(() => [
                            createTextVNode(" Settings ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["selectedKeys", "inline-collapsed"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_layout, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_layout_header, { class: "topbar" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_page_header, {
                          title: course.title,
                          "sub-title": `${course.term} • ${course.instructor.name}`,
                          ghost: ""
                        }, {
                          extra: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_segmented, {
                                options: ["Student view", "Instructor view"],
                                value: viewMode.value,
                                "onUpdate:value": ($event) => viewMode.value = $event,
                                size: "small"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_button, {
                                type: "default",
                                onClick: toggleEnroll
                              }, {
                                icon: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    ssrRenderVNode(_push6, createVNode(resolveDynamicComponent(enrolled.value ? unref(CheckCircleOutlined) : unref(PlusOutlined)), null, null), _parent6, _scopeId5);
                                  } else {
                                    return [
                                      (openBlock(), createBlock(resolveDynamicComponent(enrolled.value ? unref(CheckCircleOutlined) : unref(PlusOutlined))))
                                    ];
                                  }
                                }),
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` ${ssrInterpolate(enrolled.value ? "Enrolled" : "Join Course")}`);
                                  } else {
                                    return [
                                      createTextVNode(" " + toDisplayString(enrolled.value ? "Enrolled" : "Join Course"), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_dropdown, null, {
                                overlay: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_menu, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_menu_item, {
                                            onClick: ($event) => openAnnouncementEditor()
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`New announcement`);
                                              } else {
                                                return [
                                                  createTextVNode("New announcement")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_menu_item, {
                                            onClick: ($event) => openAssignmentEditor()
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`New assignment`);
                                              } else {
                                                return [
                                                  createTextVNode("New assignment")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_menu_item, {
                                            onClick: ($event) => openModuleCreator()
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`New module`);
                                              } else {
                                                return [
                                                  createTextVNode("New module")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_menu_item, {
                                              onClick: ($event) => openAnnouncementEditor()
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("New announcement")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"]),
                                            createVNode(_component_a_menu_item, {
                                              onClick: ($event) => openAssignmentEditor()
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("New assignment")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"]),
                                            createVNode(_component_a_menu_item, {
                                              onClick: ($event) => openModuleCreator()
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("New module")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_menu, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_menu_item, {
                                            onClick: ($event) => openAnnouncementEditor()
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("New announcement")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"]),
                                          createVNode(_component_a_menu_item, {
                                            onClick: ($event) => openAssignmentEditor()
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("New assignment")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"]),
                                          createVNode(_component_a_menu_item, {
                                            onClick: ($event) => openModuleCreator()
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("New module")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"])
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_button, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(` Actions `);
                                          _push7(ssrRenderComponent(unref(DownOutlined), null, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createTextVNode(" Actions "),
                                            createVNode(unref(DownOutlined))
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_button, null, {
                                        default: withCtx(() => [
                                          createTextVNode(" Actions "),
                                          createVNode(unref(DownOutlined))
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
                                createVNode(_component_a_segmented, {
                                  options: ["Student view", "Instructor view"],
                                  value: viewMode.value,
                                  "onUpdate:value": ($event) => viewMode.value = $event,
                                  size: "small"
                                }, null, 8, ["value", "onUpdate:value"]),
                                createVNode(_component_a_button, {
                                  type: "default",
                                  onClick: toggleEnroll
                                }, {
                                  icon: withCtx(() => [
                                    (openBlock(), createBlock(resolveDynamicComponent(enrolled.value ? unref(CheckCircleOutlined) : unref(PlusOutlined))))
                                  ]),
                                  default: withCtx(() => [
                                    createTextVNode(" " + toDisplayString(enrolled.value ? "Enrolled" : "Join Course"), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_dropdown, null, {
                                  overlay: withCtx(() => [
                                    createVNode(_component_a_menu, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_menu_item, {
                                          onClick: ($event) => openAnnouncementEditor()
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("New announcement")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"]),
                                        createVNode(_component_a_menu_item, {
                                          onClick: ($event) => openAssignmentEditor()
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("New assignment")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"]),
                                        createVNode(_component_a_menu_item, {
                                          onClick: ($event) => openModuleCreator()
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("New module")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, null, {
                                      default: withCtx(() => [
                                        createTextVNode(" Actions "),
                                        createVNode(unref(DownOutlined))
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
                          createVNode(_component_a_page_header, {
                            title: course.title,
                            "sub-title": `${course.term} • ${course.instructor.name}`,
                            ghost: ""
                          }, {
                            extra: withCtx(() => [
                              createVNode(_component_a_segmented, {
                                options: ["Student view", "Instructor view"],
                                value: viewMode.value,
                                "onUpdate:value": ($event) => viewMode.value = $event,
                                size: "small"
                              }, null, 8, ["value", "onUpdate:value"]),
                              createVNode(_component_a_button, {
                                type: "default",
                                onClick: toggleEnroll
                              }, {
                                icon: withCtx(() => [
                                  (openBlock(), createBlock(resolveDynamicComponent(enrolled.value ? unref(CheckCircleOutlined) : unref(PlusOutlined))))
                                ]),
                                default: withCtx(() => [
                                  createTextVNode(" " + toDisplayString(enrolled.value ? "Enrolled" : "Join Course"), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_dropdown, null, {
                                overlay: withCtx(() => [
                                  createVNode(_component_a_menu, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_menu_item, {
                                        onClick: ($event) => openAnnouncementEditor()
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("New announcement")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"]),
                                      createVNode(_component_a_menu_item, {
                                        onClick: ($event) => openAssignmentEditor()
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("New assignment")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"]),
                                      createVNode(_component_a_menu_item, {
                                        onClick: ($event) => openModuleCreator()
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("New module")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                default: withCtx(() => [
                                  createVNode(_component_a_button, null, {
                                    default: withCtx(() => [
                                      createTextVNode(" Actions "),
                                      createVNode(unref(DownOutlined))
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["title", "sub-title"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_a_layout_content, { class: "content" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_spin, { spinning: loading.value }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="panel" style="${ssrRenderStyle(active.value === "overview" ? null : { display: "none" })}" data-v-1f1dc1e1${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_row, { gutter: [16, 16] }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_col, {
                                      xs: 24,
                                      md: 10
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_card, { title: "Progress" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`<div class="stack-8" data-v-1f1dc1e1${_scopeId7}>`);
                                                _push8(ssrRenderComponent(_component_a_progress, {
                                                  percent: progressPercent.value,
                                                  status: "active"
                                                }, null, _parent8, _scopeId7));
                                                _push8(`<div class="muted" data-v-1f1dc1e1${_scopeId7}>${ssrInterpolate(completedLessons.value)} / ${ssrInterpolate(totalLessons.value)} lessons complete </div>`);
                                                _push8(ssrRenderComponent(_component_a_space, { wrap: "" }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(_component_a_tag, { color: "blue" }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`Activities: ${ssrInterpolate(assignments.value.length)}`);
                                                          } else {
                                                            return [
                                                              createTextVNode("Activities: " + toDisplayString(assignments.value.length), 1)
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(_component_a_tag, { color: "cyan" }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`Quizzes: ${ssrInterpolate(quizzes.value.length)}`);
                                                          } else {
                                                            return [
                                                              createTextVNode("Quizzes: " + toDisplayString(quizzes.value.length), 1)
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(_component_a_tag, null, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`Files: ${ssrInterpolate(files.value.length)}`);
                                                          } else {
                                                            return [
                                                              createTextVNode("Files: " + toDisplayString(files.value.length), 1)
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(_component_a_tag, { color: "blue" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Activities: " + toDisplayString(assignments.value.length), 1)
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(_component_a_tag, { color: "cyan" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Quizzes: " + toDisplayString(quizzes.value.length), 1)
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(_component_a_tag, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Files: " + toDisplayString(files.value.length), 1)
                                                          ]),
                                                          _: 1
                                                        })
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(`</div>`);
                                              } else {
                                                return [
                                                  createVNode("div", { class: "stack-8" }, [
                                                    createVNode(_component_a_progress, {
                                                      percent: progressPercent.value,
                                                      status: "active"
                                                    }, null, 8, ["percent"]),
                                                    createVNode("div", { class: "muted" }, toDisplayString(completedLessons.value) + " / " + toDisplayString(totalLessons.value) + " lessons complete ", 1),
                                                    createVNode(_component_a_space, { wrap: "" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_tag, { color: "blue" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Activities: " + toDisplayString(assignments.value.length), 1)
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(_component_a_tag, { color: "cyan" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Quizzes: " + toDisplayString(quizzes.value.length), 1)
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(_component_a_tag, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Files: " + toDisplayString(files.value.length), 1)
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
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_card, {
                                            title: "Upcoming deadlines",
                                            class: "mt16"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                if (upcoming.value.length) {
                                                  _push8(ssrRenderComponent(_component_a_list, {
                                                    "data-source": upcoming.value,
                                                    renderItem: _ctx.renderUpcoming
                                                  }, null, _parent8, _scopeId7));
                                                } else {
                                                  _push8(ssrRenderComponent(_component_a_empty, { description: "No upcoming items" }, null, _parent8, _scopeId7));
                                                }
                                              } else {
                                                return [
                                                  upcoming.value.length ? (openBlock(), createBlock(_component_a_list, {
                                                    key: 0,
                                                    "data-source": upcoming.value,
                                                    renderItem: _ctx.renderUpcoming
                                                  }, null, 8, ["data-source", "renderItem"])) : (openBlock(), createBlock(_component_a_empty, {
                                                    key: 1,
                                                    description: "No upcoming items"
                                                  }))
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_card, { title: "Progress" }, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "stack-8" }, [
                                                  createVNode(_component_a_progress, {
                                                    percent: progressPercent.value,
                                                    status: "active"
                                                  }, null, 8, ["percent"]),
                                                  createVNode("div", { class: "muted" }, toDisplayString(completedLessons.value) + " / " + toDisplayString(totalLessons.value) + " lessons complete ", 1),
                                                  createVNode(_component_a_space, { wrap: "" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_tag, { color: "blue" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Activities: " + toDisplayString(assignments.value.length), 1)
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(_component_a_tag, { color: "cyan" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Quizzes: " + toDisplayString(quizzes.value.length), 1)
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(_component_a_tag, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Files: " + toDisplayString(files.value.length), 1)
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
                                            createVNode(_component_a_card, {
                                              title: "Upcoming deadlines",
                                              class: "mt16"
                                            }, {
                                              default: withCtx(() => [
                                                upcoming.value.length ? (openBlock(), createBlock(_component_a_list, {
                                                  key: 0,
                                                  "data-source": upcoming.value,
                                                  renderItem: _ctx.renderUpcoming
                                                }, null, 8, ["data-source", "renderItem"])) : (openBlock(), createBlock(_component_a_empty, {
                                                  key: 1,
                                                  description: "No upcoming items"
                                                }))
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_col, {
                                      xs: 24,
                                      md: 14
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_card, {
                                            title: "Recent announcements",
                                            extra: unref(overviewExtra)
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                if (announcements.value.length) {
                                                  _push8(ssrRenderComponent(_component_a_list, {
                                                    "data-source": announcements.value.slice(0, 5)
                                                  }, {
                                                    renderItem: withCtx(({ item }, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(_component_a_list_item, null, {
                                                          actions: withCtx((_8, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(_component_a_button, {
                                                                size: "small",
                                                                onClick: ($event) => openAnnouncement(item)
                                                              }, {
                                                                default: withCtx((_9, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(`Open`);
                                                                  } else {
                                                                    return [
                                                                      createTextVNode("Open")
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(_component_a_button, {
                                                                  size: "small",
                                                                  onClick: ($event) => openAnnouncement(item)
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("Open")
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["onClick"])
                                                              ];
                                                            }
                                                          }),
                                                          default: withCtx((_8, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(_component_a_list_item_meta, {
                                                                title: item.title,
                                                                description: formatDate(item.date)
                                                              }, null, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(_component_a_list_item_meta, {
                                                                  title: item.title,
                                                                  description: formatDate(item.date)
                                                                }, null, 8, ["title", "description"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(_component_a_list_item, null, {
                                                            actions: withCtx(() => [
                                                              createVNode(_component_a_button, {
                                                                size: "small",
                                                                onClick: ($event) => openAnnouncement(item)
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("Open")
                                                                ]),
                                                                _: 1
                                                              }, 8, ["onClick"])
                                                            ]),
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_list_item_meta, {
                                                                title: item.title,
                                                                description: formatDate(item.date)
                                                              }, null, 8, ["title", "description"])
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  _push8(ssrRenderComponent(_component_a_empty, { description: "Nothing yet" }, null, _parent8, _scopeId7));
                                                }
                                              } else {
                                                return [
                                                  announcements.value.length ? (openBlock(), createBlock(_component_a_list, {
                                                    key: 0,
                                                    "data-source": announcements.value.slice(0, 5)
                                                  }, {
                                                    renderItem: withCtx(({ item }) => [
                                                      createVNode(_component_a_list_item, null, {
                                                        actions: withCtx(() => [
                                                          createVNode(_component_a_button, {
                                                            size: "small",
                                                            onClick: ($event) => openAnnouncement(item)
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Open")
                                                            ]),
                                                            _: 1
                                                          }, 8, ["onClick"])
                                                        ]),
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_list_item_meta, {
                                                            title: item.title,
                                                            description: formatDate(item.date)
                                                          }, null, 8, ["title", "description"])
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 1
                                                  }, 8, ["data-source"])) : (openBlock(), createBlock(_component_a_empty, {
                                                    key: 1,
                                                    description: "Nothing yet"
                                                  }))
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_card, {
                                              title: "Recent announcements",
                                              extra: unref(overviewExtra)
                                            }, {
                                              default: withCtx(() => [
                                                announcements.value.length ? (openBlock(), createBlock(_component_a_list, {
                                                  key: 0,
                                                  "data-source": announcements.value.slice(0, 5)
                                                }, {
                                                  renderItem: withCtx(({ item }) => [
                                                    createVNode(_component_a_list_item, null, {
                                                      actions: withCtx(() => [
                                                        createVNode(_component_a_button, {
                                                          size: "small",
                                                          onClick: ($event) => openAnnouncement(item)
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Open")
                                                          ]),
                                                          _: 1
                                                        }, 8, ["onClick"])
                                                      ]),
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_list_item_meta, {
                                                          title: item.title,
                                                          description: formatDate(item.date)
                                                        }, null, 8, ["title", "description"])
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 1
                                                }, 8, ["data-source"])) : (openBlock(), createBlock(_component_a_empty, {
                                                  key: 1,
                                                  description: "Nothing yet"
                                                }))
                                              ]),
                                              _: 1
                                            }, 8, ["extra"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_col, {
                                        xs: 24,
                                        md: 10
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_card, { title: "Progress" }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "stack-8" }, [
                                                createVNode(_component_a_progress, {
                                                  percent: progressPercent.value,
                                                  status: "active"
                                                }, null, 8, ["percent"]),
                                                createVNode("div", { class: "muted" }, toDisplayString(completedLessons.value) + " / " + toDisplayString(totalLessons.value) + " lessons complete ", 1),
                                                createVNode(_component_a_space, { wrap: "" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_tag, { color: "blue" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Activities: " + toDisplayString(assignments.value.length), 1)
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_tag, { color: "cyan" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Quizzes: " + toDisplayString(quizzes.value.length), 1)
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_tag, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Files: " + toDisplayString(files.value.length), 1)
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
                                          createVNode(_component_a_card, {
                                            title: "Upcoming deadlines",
                                            class: "mt16"
                                          }, {
                                            default: withCtx(() => [
                                              upcoming.value.length ? (openBlock(), createBlock(_component_a_list, {
                                                key: 0,
                                                "data-source": upcoming.value,
                                                renderItem: _ctx.renderUpcoming
                                              }, null, 8, ["data-source", "renderItem"])) : (openBlock(), createBlock(_component_a_empty, {
                                                key: 1,
                                                description: "No upcoming items"
                                              }))
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_col, {
                                        xs: 24,
                                        md: 14
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_card, {
                                            title: "Recent announcements",
                                            extra: unref(overviewExtra)
                                          }, {
                                            default: withCtx(() => [
                                              announcements.value.length ? (openBlock(), createBlock(_component_a_list, {
                                                key: 0,
                                                "data-source": announcements.value.slice(0, 5)
                                              }, {
                                                renderItem: withCtx(({ item }) => [
                                                  createVNode(_component_a_list_item, null, {
                                                    actions: withCtx(() => [
                                                      createVNode(_component_a_button, {
                                                        size: "small",
                                                        onClick: ($event) => openAnnouncement(item)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Open")
                                                        ]),
                                                        _: 1
                                                      }, 8, ["onClick"])
                                                    ]),
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_list_item_meta, {
                                                        title: item.title,
                                                        description: formatDate(item.date)
                                                      }, null, 8, ["title", "description"])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 1
                                              }, 8, ["data-source"])) : (openBlock(), createBlock(_component_a_empty, {
                                                key: 1,
                                                description: "Nothing yet"
                                              }))
                                            ]),
                                            _: 1
                                          }, 8, ["extra"])
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div><div class="panel" style="${ssrRenderStyle(active.value === "modules" ? null : { display: "none" })}" data-v-1f1dc1e1${_scopeId4}><div class="panel-head" data-v-1f1dc1e1${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_typography_title, { level: 3 }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Modules`);
                                  } else {
                                    return [
                                      createTextVNode("Modules")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_space, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_input_search, {
                                      value: moduleSearch.value,
                                      "onUpdate:value": ($event) => moduleSearch.value = $event,
                                      placeholder: "Search modules/lessons"
                                    }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_button, {
                                      type: "primary",
                                      onClick: openModuleCreator
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`New Module`);
                                        } else {
                                          return [
                                            createTextVNode("New Module")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_input_search, {
                                        value: moduleSearch.value,
                                        "onUpdate:value": ($event) => moduleSearch.value = $event,
                                        placeholder: "Search modules/lessons"
                                      }, null, 8, ["value", "onUpdate:value"]),
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        onClick: openModuleCreator
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("New Module")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                              _push5(ssrRenderComponent(_component_a_collapse, { accordion: "" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<!--[-->`);
                                    ssrRenderList(filteredModules.value, (m) => {
                                      _push6(ssrRenderComponent(_component_a_collapse_panel, {
                                        key: m.id,
                                        header: `${m.title} • ${m.lessons.length} lessons`
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_list, {
                                              "data-source": m.lessons
                                            }, {
                                              renderItem: withCtx(({ item }, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_a_list_item, null, {
                                                    actions: withCtx((_7, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(_component_a_button, {
                                                          size: "small",
                                                          onClick: ($event) => openLesson(m, item)
                                                        }, {
                                                          default: withCtx((_8, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`Open`);
                                                            } else {
                                                              return [
                                                                createTextVNode("Open")
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(_component_a_button, {
                                                          size: "small",
                                                          type: "text",
                                                          onClick: ($event) => quickAdd("assignment", m, item)
                                                        }, {
                                                          default: withCtx((_8, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`+ Assignment`);
                                                            } else {
                                                              return [
                                                                createTextVNode("+ Assignment")
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(_component_a_button, {
                                                            size: "small",
                                                            onClick: ($event) => openLesson(m, item)
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Open")
                                                            ]),
                                                            _: 1
                                                          }, 8, ["onClick"]),
                                                          createVNode(_component_a_button, {
                                                            size: "small",
                                                            type: "text",
                                                            onClick: ($event) => quickAdd("assignment", m, item)
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("+ Assignment")
                                                            ]),
                                                            _: 1
                                                          }, 8, ["onClick"])
                                                        ];
                                                      }
                                                    }),
                                                    default: withCtx((_7, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(_component_a_space, { align: "center" }, {
                                                          default: withCtx((_8, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(_component_a_checkbox, {
                                                                checked: item.done,
                                                                onChange: ($event) => toggleLesson(m, item)
                                                              }, {
                                                                default: withCtx((_9, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(`<span class="${ssrRenderClass({ done: item.done })}" data-v-1f1dc1e1${_scopeId10}>${ssrInterpolate(item.title)}</span>`);
                                                                  } else {
                                                                    return [
                                                                      createVNode("span", {
                                                                        class: { done: item.done }
                                                                      }, toDisplayString(item.title), 3)
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              if (item.type) {
                                                                _push10(ssrRenderComponent(_component_a_tag, { color: "geekblue" }, {
                                                                  default: withCtx((_9, _push11, _parent11, _scopeId10) => {
                                                                    if (_push11) {
                                                                      _push11(`${ssrInterpolate(item.type)}`);
                                                                    } else {
                                                                      return [
                                                                        createTextVNode(toDisplayString(item.type), 1)
                                                                      ];
                                                                    }
                                                                  }),
                                                                  _: 2
                                                                }, _parent10, _scopeId9));
                                                              } else {
                                                                _push10(`<!---->`);
                                                              }
                                                            } else {
                                                              return [
                                                                createVNode(_component_a_checkbox, {
                                                                  checked: item.done,
                                                                  onChange: ($event) => toggleLesson(m, item)
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode("span", {
                                                                      class: { done: item.done }
                                                                    }, toDisplayString(item.title), 3)
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["checked", "onChange"]),
                                                                item.type ? (openBlock(), createBlock(_component_a_tag, {
                                                                  key: 0,
                                                                  color: "geekblue"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(item.type), 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)) : createCommentVNode("", true)
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(_component_a_space, { align: "center" }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_checkbox, {
                                                                checked: item.done,
                                                                onChange: ($event) => toggleLesson(m, item)
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode("span", {
                                                                    class: { done: item.done }
                                                                  }, toDisplayString(item.title), 3)
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["checked", "onChange"]),
                                                              item.type ? (openBlock(), createBlock(_component_a_tag, {
                                                                key: 0,
                                                                color: "geekblue"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(item.type), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1024)) : createCommentVNode("", true)
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_a_list_item, null, {
                                                      actions: withCtx(() => [
                                                        createVNode(_component_a_button, {
                                                          size: "small",
                                                          onClick: ($event) => openLesson(m, item)
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Open")
                                                          ]),
                                                          _: 1
                                                        }, 8, ["onClick"]),
                                                        createVNode(_component_a_button, {
                                                          size: "small",
                                                          type: "text",
                                                          onClick: ($event) => quickAdd("assignment", m, item)
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("+ Assignment")
                                                          ]),
                                                          _: 1
                                                        }, 8, ["onClick"])
                                                      ]),
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_space, { align: "center" }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_checkbox, {
                                                              checked: item.done,
                                                              onChange: ($event) => toggleLesson(m, item)
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode("span", {
                                                                  class: { done: item.done }
                                                                }, toDisplayString(item.title), 3)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["checked", "onChange"]),
                                                            item.type ? (openBlock(), createBlock(_component_a_tag, {
                                                              key: 0,
                                                              color: "geekblue"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(item.type), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1024)) : createCommentVNode("", true)
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
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_list, {
                                                "data-source": m.lessons
                                              }, {
                                                renderItem: withCtx(({ item }) => [
                                                  createVNode(_component_a_list_item, null, {
                                                    actions: withCtx(() => [
                                                      createVNode(_component_a_button, {
                                                        size: "small",
                                                        onClick: ($event) => openLesson(m, item)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Open")
                                                        ]),
                                                        _: 1
                                                      }, 8, ["onClick"]),
                                                      createVNode(_component_a_button, {
                                                        size: "small",
                                                        type: "text",
                                                        onClick: ($event) => quickAdd("assignment", m, item)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("+ Assignment")
                                                        ]),
                                                        _: 1
                                                      }, 8, ["onClick"])
                                                    ]),
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_space, { align: "center" }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_checkbox, {
                                                            checked: item.done,
                                                            onChange: ($event) => toggleLesson(m, item)
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode("span", {
                                                                class: { done: item.done }
                                                              }, toDisplayString(item.title), 3)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["checked", "onChange"]),
                                                          item.type ? (openBlock(), createBlock(_component_a_tag, {
                                                            key: 0,
                                                            color: "geekblue"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(item.type), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024)) : createCommentVNode("", true)
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1032, ["data-source"])
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    });
                                    _push6(`<!--]-->`);
                                  } else {
                                    return [
                                      (openBlock(true), createBlock(Fragment, null, renderList(filteredModules.value, (m) => {
                                        return openBlock(), createBlock(_component_a_collapse_panel, {
                                          key: m.id,
                                          header: `${m.title} • ${m.lessons.length} lessons`
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_list, {
                                              "data-source": m.lessons
                                            }, {
                                              renderItem: withCtx(({ item }) => [
                                                createVNode(_component_a_list_item, null, {
                                                  actions: withCtx(() => [
                                                    createVNode(_component_a_button, {
                                                      size: "small",
                                                      onClick: ($event) => openLesson(m, item)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Open")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onClick"]),
                                                    createVNode(_component_a_button, {
                                                      size: "small",
                                                      type: "text",
                                                      onClick: ($event) => quickAdd("assignment", m, item)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("+ Assignment")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onClick"])
                                                  ]),
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_space, { align: "center" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_checkbox, {
                                                          checked: item.done,
                                                          onChange: ($event) => toggleLesson(m, item)
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode("span", {
                                                              class: { done: item.done }
                                                            }, toDisplayString(item.title), 3)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["checked", "onChange"]),
                                                        item.type ? (openBlock(), createBlock(_component_a_tag, {
                                                          key: 0,
                                                          color: "geekblue"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(item.type), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024)) : createCommentVNode("", true)
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1032, ["data-source"])
                                          ]),
                                          _: 2
                                        }, 1032, ["header"]);
                                      }), 128))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div><div class="panel" style="${ssrRenderStyle(active.value === "assignments" ? null : { display: "none" })}" data-v-1f1dc1e1${_scopeId4}><div class="panel-head" data-v-1f1dc1e1${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_typography_title, { level: 3 }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Assignments`);
                                  } else {
                                    return [
                                      createTextVNode("Assignments")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_space, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_segmented, {
                                      value: assignmentFilter.value,
                                      "onUpdate:value": ($event) => assignmentFilter.value = $event,
                                      options: ["All", "Open", "Closed"]
                                    }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_input_search, {
                                      value: assignmentSearch.value,
                                      "onUpdate:value": ($event) => assignmentSearch.value = $event,
                                      placeholder: "Search assignments",
                                      "allow-clear": ""
                                    }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_button, {
                                      type: "primary",
                                      onClick: ($event) => openAssignmentEditor()
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`New`);
                                        } else {
                                          return [
                                            createTextVNode("New")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_segmented, {
                                        value: assignmentFilter.value,
                                        "onUpdate:value": ($event) => assignmentFilter.value = $event,
                                        options: ["All", "Open", "Closed"]
                                      }, null, 8, ["value", "onUpdate:value"]),
                                      createVNode(_component_a_input_search, {
                                        value: assignmentSearch.value,
                                        "onUpdate:value": ($event) => assignmentSearch.value = $event,
                                        placeholder: "Search assignments",
                                        "allow-clear": ""
                                      }, null, 8, ["value", "onUpdate:value"]),
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        onClick: ($event) => openAssignmentEditor()
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("New")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                              _push5(ssrRenderComponent(_component_a_table, {
                                columns: assignmentCols,
                                "data-source": filteredAssignments.value,
                                "row-key": "id",
                                pagination: { pageSize: 8 },
                                size: "middle"
                              }, {
                                bodyCell: withCtx(({ column, record }, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    if (column.key === "title") {
                                      _push6(ssrRenderComponent(_component_a_space, null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_badge, {
                                              status: record.status === "open" ? "processing" : "default"
                                            }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_typography_link, {
                                              onClick: ($event) => openAssignment(record)
                                            }, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(record.title)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(record.title), 1)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_badge, {
                                                status: record.status === "open" ? "processing" : "default"
                                              }, null, 8, ["status"]),
                                              createVNode(_component_a_typography_link, {
                                                onClick: ($event) => openAssignment(record)
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(record.title), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["onClick"])
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else if (column.key === "due") {
                                      _push6(`<!--[-->${ssrInterpolate(formatDate(record.due))}<!--]-->`);
                                    } else if (column.key === "points") {
                                      _push6(`<!--[-->${ssrInterpolate(record.points)}<!--]-->`);
                                    } else if (column.key === "actions") {
                                      _push6(ssrRenderComponent(_component_a_space, null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_button, {
                                              size: "small",
                                              onClick: ($event) => openAssignment(record)
                                            }, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`View`);
                                                } else {
                                                  return [
                                                    createTextVNode("View")
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_button, {
                                              size: "small",
                                              onClick: ($event) => openAssignmentEditor(record)
                                            }, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`Edit`);
                                                } else {
                                                  return [
                                                    createTextVNode("Edit")
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_popconfirm, {
                                              title: "Delete assignment?",
                                              onConfirm: ($event) => removeAssignment(record)
                                            }, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_a_button, {
                                                    size: "small",
                                                    danger: ""
                                                  }, {
                                                    default: withCtx((_7, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`Delete`);
                                                      } else {
                                                        return [
                                                          createTextVNode("Delete")
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_a_button, {
                                                      size: "small",
                                                      danger: ""
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Delete")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_button, {
                                                size: "small",
                                                onClick: ($event) => openAssignment(record)
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("View")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"]),
                                              createVNode(_component_a_button, {
                                                size: "small",
                                                onClick: ($event) => openAssignmentEditor(record)
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Edit")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"]),
                                              createVNode(_component_a_popconfirm, {
                                                title: "Delete assignment?",
                                                onConfirm: ($event) => removeAssignment(record)
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_button, {
                                                    size: "small",
                                                    danger: ""
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Delete")
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
                                      }, _parent6, _scopeId5));
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                  } else {
                                    return [
                                      column.key === "title" ? (openBlock(), createBlock(_component_a_space, { key: 0 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_badge, {
                                            status: record.status === "open" ? "processing" : "default"
                                          }, null, 8, ["status"]),
                                          createVNode(_component_a_typography_link, {
                                            onClick: ($event) => openAssignment(record)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(record.title), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["onClick"])
                                        ]),
                                        _: 2
                                      }, 1024)) : column.key === "due" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                        createTextVNode(toDisplayString(formatDate(record.due)), 1)
                                      ], 64)) : column.key === "points" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                        createTextVNode(toDisplayString(record.points), 1)
                                      ], 64)) : column.key === "actions" ? (openBlock(), createBlock(_component_a_space, { key: 3 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_button, {
                                            size: "small",
                                            onClick: ($event) => openAssignment(record)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("View")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"]),
                                          createVNode(_component_a_button, {
                                            size: "small",
                                            onClick: ($event) => openAssignmentEditor(record)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Edit")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"]),
                                          createVNode(_component_a_popconfirm, {
                                            title: "Delete assignment?",
                                            onConfirm: ($event) => removeAssignment(record)
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_button, {
                                                size: "small",
                                                danger: ""
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Delete")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }, 8, ["onConfirm"])
                                        ]),
                                        _: 2
                                      }, 1024)) : createCommentVNode("", true)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div><div class="panel" style="${ssrRenderStyle(active.value === "quizzes" ? null : { display: "none" })}" data-v-1f1dc1e1${_scopeId4}><div class="panel-head" data-v-1f1dc1e1${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_typography_title, { level: 3 }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Quizzes`);
                                  } else {
                                    return [
                                      createTextVNode("Quizzes")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_button, {
                                type: "primary",
                                onClick: createQuiz
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`New Quiz`);
                                  } else {
                                    return [
                                      createTextVNode("New Quiz")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                              _push5(ssrRenderComponent(_component_a_table, {
                                columns: quizCols,
                                "data-source": quizzes.value,
                                "row-key": "id",
                                pagination: { pageSize: 8 },
                                size: "middle"
                              }, null, _parent5, _scopeId4));
                              _push5(`</div><div class="panel" style="${ssrRenderStyle(active.value === "discussions" ? null : { display: "none" })}" data-v-1f1dc1e1${_scopeId4}><div class="panel-head" data-v-1f1dc1e1${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_typography_title, { level: 3 }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Discussions`);
                                  } else {
                                    return [
                                      createTextVNode("Discussions")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_space, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_input_search, {
                                      value: discussionSearch.value,
                                      "onUpdate:value": ($event) => discussionSearch.value = $event,
                                      placeholder: "Search topics"
                                    }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_button, {
                                      onClick: ($event) => openDiscussionEditor()
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`New Topic`);
                                        } else {
                                          return [
                                            createTextVNode("New Topic")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_input_search, {
                                        value: discussionSearch.value,
                                        "onUpdate:value": ($event) => discussionSearch.value = $event,
                                        placeholder: "Search topics"
                                      }, null, 8, ["value", "onUpdate:value"]),
                                      createVNode(_component_a_button, {
                                        onClick: ($event) => openDiscussionEditor()
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("New Topic")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                              _push5(ssrRenderComponent(_component_a_list, {
                                "data-source": filteredDiscussions.value,
                                "item-layout": "horizontal"
                              }, {
                                renderItem: withCtx(({ item }, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_list_item, null, {
                                      actions: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_button, {
                                            size: "small",
                                            onClick: ($event) => openDiscussion(item)
                                          }, {
                                            default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`Open`);
                                              } else {
                                                return [
                                                  createTextVNode("Open")
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_button, {
                                              size: "small",
                                              onClick: ($event) => openDiscussion(item)
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Open")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"])
                                          ];
                                        }
                                      }),
                                      default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_list_item_meta, {
                                            title: item.title,
                                            description: `${item.posts.length} posts • last active ${formatDate(item.updatedAt)}`
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_list_item_meta, {
                                              title: item.title,
                                              description: `${item.posts.length} posts • last active ${formatDate(item.updatedAt)}`
                                            }, null, 8, ["title", "description"])
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_list_item, null, {
                                        actions: withCtx(() => [
                                          createVNode(_component_a_button, {
                                            size: "small",
                                            onClick: ($event) => openDiscussion(item)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Open")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"])
                                        ]),
                                        default: withCtx(() => [
                                          createVNode(_component_a_list_item_meta, {
                                            title: item.title,
                                            description: `${item.posts.length} posts • last active ${formatDate(item.updatedAt)}`
                                          }, null, 8, ["title", "description"])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div><div class="panel" style="${ssrRenderStyle(active.value === "files" ? null : { display: "none" })}" data-v-1f1dc1e1${_scopeId4}><div class="panel-head" data-v-1f1dc1e1${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_typography_title, { level: 3 }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Files`);
                                  } else {
                                    return [
                                      createTextVNode("Files")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_space, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_select, {
                                      value: fileType.value,
                                      "onUpdate:value": ($event) => fileType.value = $event,
                                      style: { "min-width": "140px" }
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_select_option, { value: "all" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`All types`);
                                              } else {
                                                return [
                                                  createTextVNode("All types")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_select_option, { value: "pdf" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`PDF`);
                                              } else {
                                                return [
                                                  createTextVNode("PDF")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_select_option, { value: "video" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`Video`);
                                              } else {
                                                return [
                                                  createTextVNode("Video")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_select_option, { value: "doc" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`Documents`);
                                              } else {
                                                return [
                                                  createTextVNode("Documents")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_select_option, { value: "all" }, {
                                              default: withCtx(() => [
                                                createTextVNode("All types")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_select_option, { value: "pdf" }, {
                                              default: withCtx(() => [
                                                createTextVNode("PDF")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_select_option, { value: "video" }, {
                                              default: withCtx(() => [
                                                createTextVNode("Video")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_select_option, { value: "doc" }, {
                                              default: withCtx(() => [
                                                createTextVNode("Documents")
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_input_search, {
                                      value: fileSearch.value,
                                      "onUpdate:value": ($event) => fileSearch.value = $event,
                                      placeholder: "Search files"
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_select, {
                                        value: fileType.value,
                                        "onUpdate:value": ($event) => fileType.value = $event,
                                        style: { "min-width": "140px" }
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_select_option, { value: "all" }, {
                                            default: withCtx(() => [
                                              createTextVNode("All types")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_select_option, { value: "pdf" }, {
                                            default: withCtx(() => [
                                              createTextVNode("PDF")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_select_option, { value: "video" }, {
                                            default: withCtx(() => [
                                              createTextVNode("Video")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_select_option, { value: "doc" }, {
                                            default: withCtx(() => [
                                              createTextVNode("Documents")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["value", "onUpdate:value"]),
                                      createVNode(_component_a_input_search, {
                                        value: fileSearch.value,
                                        "onUpdate:value": ($event) => fileSearch.value = $event,
                                        placeholder: "Search files"
                                      }, null, 8, ["value", "onUpdate:value"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                              _push5(ssrRenderComponent(_component_a_upload_dragger, {
                                "before-upload": handleBeforeUpload,
                                "show-upload-list": false,
                                multiple: ""
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<p class="ant-upload-drag-icon" data-v-1f1dc1e1${_scopeId5}>`);
                                    _push6(ssrRenderComponent(unref(InboxOutlined), null, null, _parent6, _scopeId5));
                                    _push6(`</p><p class="ant-upload-text" data-v-1f1dc1e1${_scopeId5}>Click or drag files to upload</p><p class="ant-upload-hint" data-v-1f1dc1e1${_scopeId5}>Mock upload adds entries locally.</p>`);
                                  } else {
                                    return [
                                      createVNode("p", { class: "ant-upload-drag-icon" }, [
                                        createVNode(unref(InboxOutlined))
                                      ]),
                                      createVNode("p", { class: "ant-upload-text" }, "Click or drag files to upload"),
                                      createVNode("p", { class: "ant-upload-hint" }, "Mock upload adds entries locally.")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_list, {
                                class: "mt16",
                                "data-source": filteredFiles.value,
                                grid: "{ gutter: 16, column: 3 }"
                              }, {
                                renderItem: withCtx(({ item }, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_list_item, null, {
                                      default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_card, {
                                            title: item.name,
                                            extra: item.type.toUpperCase()
                                          }, {
                                            default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_a_space, {
                                                  direction: "vertical",
                                                  style: { "width": "100%" }
                                                }, {
                                                  default: withCtx((_7, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(`<div class="muted" data-v-1f1dc1e1${_scopeId8}>Added ${ssrInterpolate(formatDate(item.date))}</div>`);
                                                      _push9(ssrRenderComponent(_component_a_space, null, {
                                                        default: withCtx((_8, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(_component_a_button, {
                                                              size: "small",
                                                              type: "link"
                                                            }, {
                                                              default: withCtx((_9, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(`Open`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode("Open")
                                                                  ];
                                                                }
                                                              }),
                                                              _: 2
                                                            }, _parent10, _scopeId9));
                                                            _push10(ssrRenderComponent(_component_a_popconfirm, {
                                                              title: "Remove file?",
                                                              onConfirm: ($event) => removeFile(item)
                                                            }, {
                                                              default: withCtx((_9, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(ssrRenderComponent(_component_a_button, {
                                                                    size: "small",
                                                                    danger: ""
                                                                  }, {
                                                                    default: withCtx((_10, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(`Delete`);
                                                                      } else {
                                                                        return [
                                                                          createTextVNode("Delete")
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 2
                                                                  }, _parent11, _scopeId10));
                                                                } else {
                                                                  return [
                                                                    createVNode(_component_a_button, {
                                                                      size: "small",
                                                                      danger: ""
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("Delete")
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
                                                                size: "small",
                                                                type: "link"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("Open")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(_component_a_popconfirm, {
                                                                title: "Remove file?",
                                                                onConfirm: ($event) => removeFile(item)
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(_component_a_button, {
                                                                    size: "small",
                                                                    danger: ""
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("Delete")
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
                                                    } else {
                                                      return [
                                                        createVNode("div", { class: "muted" }, "Added " + toDisplayString(formatDate(item.date)), 1),
                                                        createVNode(_component_a_space, null, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_button, {
                                                              size: "small",
                                                              type: "link"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("Open")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(_component_a_popconfirm, {
                                                              title: "Remove file?",
                                                              onConfirm: ($event) => removeFile(item)
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_button, {
                                                                  size: "small",
                                                                  danger: ""
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("Delete")
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 1
                                                            }, 8, ["onConfirm"])
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(_component_a_space, {
                                                    direction: "vertical",
                                                    style: { "width": "100%" }
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "muted" }, "Added " + toDisplayString(formatDate(item.date)), 1),
                                                      createVNode(_component_a_space, null, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_button, {
                                                            size: "small",
                                                            type: "link"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Open")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(_component_a_popconfirm, {
                                                            title: "Remove file?",
                                                            onConfirm: ($event) => removeFile(item)
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_button, {
                                                                size: "small",
                                                                danger: ""
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("Delete")
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 1
                                                          }, 8, ["onConfirm"])
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
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_card, {
                                              title: item.name,
                                              extra: item.type.toUpperCase()
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_space, {
                                                  direction: "vertical",
                                                  style: { "width": "100%" }
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode("div", { class: "muted" }, "Added " + toDisplayString(formatDate(item.date)), 1),
                                                    createVNode(_component_a_space, null, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_button, {
                                                          size: "small",
                                                          type: "link"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Open")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(_component_a_popconfirm, {
                                                          title: "Remove file?",
                                                          onConfirm: ($event) => removeFile(item)
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_button, {
                                                              size: "small",
                                                              danger: ""
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("Delete")
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        }, 8, ["onConfirm"])
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1032, ["title", "extra"])
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_list_item, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_card, {
                                            title: item.name,
                                            extra: item.type.toUpperCase()
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_space, {
                                                direction: "vertical",
                                                style: { "width": "100%" }
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode("div", { class: "muted" }, "Added " + toDisplayString(formatDate(item.date)), 1),
                                                  createVNode(_component_a_space, null, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_button, {
                                                        size: "small",
                                                        type: "link"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Open")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(_component_a_popconfirm, {
                                                        title: "Remove file?",
                                                        onConfirm: ($event) => removeFile(item)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_button, {
                                                            size: "small",
                                                            danger: ""
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Delete")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }, 8, ["onConfirm"])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1032, ["title", "extra"])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div><div class="panel" style="${ssrRenderStyle(active.value === "participants" ? null : { display: "none" })}" data-v-1f1dc1e1${_scopeId4}><div class="panel-head" data-v-1f1dc1e1${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_typography_title, { level: 3 }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Participants`);
                                  } else {
                                    return [
                                      createTextVNode("Participants")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_space, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_input_search, {
                                      value: participantSearch.value,
                                      "onUpdate:value": ($event) => participantSearch.value = $event,
                                      placeholder: "Search participants"
                                    }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_select, {
                                      value: roleFilter.value,
                                      "onUpdate:value": ($event) => roleFilter.value = $event,
                                      style: { "min-width": "140px" }
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_select_option, { value: "all" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`All roles`);
                                              } else {
                                                return [
                                                  createTextVNode("All roles")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_select_option, { value: "student" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`Students`);
                                              } else {
                                                return [
                                                  createTextVNode("Students")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_select_option, { value: "ta" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`TAs`);
                                              } else {
                                                return [
                                                  createTextVNode("TAs")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_select_option, { value: "all" }, {
                                              default: withCtx(() => [
                                                createTextVNode("All roles")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_select_option, { value: "student" }, {
                                              default: withCtx(() => [
                                                createTextVNode("Students")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_select_option, { value: "ta" }, {
                                              default: withCtx(() => [
                                                createTextVNode("TAs")
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
                                      createVNode(_component_a_input_search, {
                                        value: participantSearch.value,
                                        "onUpdate:value": ($event) => participantSearch.value = $event,
                                        placeholder: "Search participants"
                                      }, null, 8, ["value", "onUpdate:value"]),
                                      createVNode(_component_a_select, {
                                        value: roleFilter.value,
                                        "onUpdate:value": ($event) => roleFilter.value = $event,
                                        style: { "min-width": "140px" }
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_select_option, { value: "all" }, {
                                            default: withCtx(() => [
                                              createTextVNode("All roles")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_select_option, { value: "student" }, {
                                            default: withCtx(() => [
                                              createTextVNode("Students")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_select_option, { value: "ta" }, {
                                            default: withCtx(() => [
                                              createTextVNode("TAs")
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
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                              _push5(ssrRenderComponent(_component_a_table, {
                                columns: participantCols,
                                "data-source": filteredParticipants.value,
                                "row-key": "id",
                                pagination: { pageSize: 10 },
                                size: "middle"
                              }, null, _parent5, _scopeId4));
                              _push5(`</div><div class="panel" style="${ssrRenderStyle(active.value === "grades" ? null : { display: "none" })}" data-v-1f1dc1e1${_scopeId4}><div class="panel-head" data-v-1f1dc1e1${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_typography_title, { level: 3 }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Gradebook`);
                                  } else {
                                    return [
                                      createTextVNode("Gradebook")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_space, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_select, {
                                      value: selectedStudent.value,
                                      "onUpdate:value": ($event) => selectedStudent.value = $event,
                                      style: { "min-width": "220px" },
                                      "allow-clear": "",
                                      placeholder: "Filter by student"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<!--[-->`);
                                          ssrRenderList(participants.value, (p) => {
                                            _push7(ssrRenderComponent(_component_a_select_option, {
                                              key: p.id,
                                              value: p.name
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(p.name)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(p.name), 1)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          });
                                          _push7(`<!--]-->`);
                                        } else {
                                          return [
                                            (openBlock(true), createBlock(Fragment, null, renderList(participants.value, (p) => {
                                              return openBlock(), createBlock(_component_a_select_option, {
                                                key: p.id,
                                                value: p.name
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(p.name), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["value"]);
                                            }), 128))
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_button, { onClick: exportGrades }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Export CSV`);
                                        } else {
                                          return [
                                            createTextVNode("Export CSV")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_select, {
                                        value: selectedStudent.value,
                                        "onUpdate:value": ($event) => selectedStudent.value = $event,
                                        style: { "min-width": "220px" },
                                        "allow-clear": "",
                                        placeholder: "Filter by student"
                                      }, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(participants.value, (p) => {
                                            return openBlock(), createBlock(_component_a_select_option, {
                                              key: p.id,
                                              value: p.name
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(p.name), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["value"]);
                                          }), 128))
                                        ]),
                                        _: 1
                                      }, 8, ["value", "onUpdate:value"]),
                                      createVNode(_component_a_button, { onClick: exportGrades }, {
                                        default: withCtx(() => [
                                          createTextVNode("Export CSV")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                              _push5(ssrRenderComponent(_component_a_table, {
                                columns: gradeCols,
                                "data-source": filteredGrades.value,
                                "row-key": "id",
                                pagination: { pageSize: 10 },
                                size: "middle"
                              }, null, _parent5, _scopeId4));
                              _push5(`</div><div class="panel" style="${ssrRenderStyle(active.value === "calendar" ? null : { display: "none" })}" data-v-1f1dc1e1${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_row, { gutter: [16, 16] }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_col, {
                                      xs: 24,
                                      md: 16
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_card, { title: "Course calendar" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_a_calendar, null, {
                                                  dateCellRender: withCtx(({ current }, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(`<ul class="events" data-v-1f1dc1e1${_scopeId8}><!--[-->`);
                                                      ssrRenderList(eventsOn(current.toDate()), (e) => {
                                                        _push9(`<li data-v-1f1dc1e1${_scopeId8}>`);
                                                        _push9(ssrRenderComponent(_component_a_badge, {
                                                          status: e.type === "assignment" ? "processing" : "default",
                                                          text: e.title
                                                        }, null, _parent9, _scopeId8));
                                                        _push9(`</li>`);
                                                      });
                                                      _push9(`<!--]--></ul>`);
                                                    } else {
                                                      return [
                                                        createVNode("ul", { class: "events" }, [
                                                          (openBlock(true), createBlock(Fragment, null, renderList(eventsOn(current.toDate()), (e) => {
                                                            return openBlock(), createBlock("li", {
                                                              key: e.id
                                                            }, [
                                                              createVNode(_component_a_badge, {
                                                                status: e.type === "assignment" ? "processing" : "default",
                                                                text: e.title
                                                              }, null, 8, ["status", "text"])
                                                            ]);
                                                          }), 128))
                                                        ])
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(_component_a_calendar, null, {
                                                    dateCellRender: withCtx(({ current }) => [
                                                      createVNode("ul", { class: "events" }, [
                                                        (openBlock(true), createBlock(Fragment, null, renderList(eventsOn(current.toDate()), (e) => {
                                                          return openBlock(), createBlock("li", {
                                                            key: e.id
                                                          }, [
                                                            createVNode(_component_a_badge, {
                                                              status: e.type === "assignment" ? "processing" : "default",
                                                              text: e.title
                                                            }, null, 8, ["status", "text"])
                                                          ]);
                                                        }), 128))
                                                      ])
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
                                            createVNode(_component_a_card, { title: "Course calendar" }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_calendar, null, {
                                                  dateCellRender: withCtx(({ current }) => [
                                                    createVNode("ul", { class: "events" }, [
                                                      (openBlock(true), createBlock(Fragment, null, renderList(eventsOn(current.toDate()), (e) => {
                                                        return openBlock(), createBlock("li", {
                                                          key: e.id
                                                        }, [
                                                          createVNode(_component_a_badge, {
                                                            status: e.type === "assignment" ? "processing" : "default",
                                                            text: e.title
                                                          }, null, 8, ["status", "text"])
                                                        ]);
                                                      }), 128))
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
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_col, {
                                      xs: 24,
                                      md: 8
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_card, { title: "Upcoming" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_a_list, { "data-source": upcoming.value }, {
                                                  renderItem: withCtx(({ item }, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(_component_a_list_item, null, {
                                                        default: withCtx((_8, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(_component_a_list_item_meta, {
                                                              title: item.title,
                                                              description: formatDate(item.due)
                                                            }, null, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(_component_a_list_item_meta, {
                                                                title: item.title,
                                                                description: formatDate(item.due)
                                                              }, null, 8, ["title", "description"])
                                                            ];
                                                          }
                                                        }),
                                                        _: 2
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(_component_a_list_item, null, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_list_item_meta, {
                                                              title: item.title,
                                                              description: formatDate(item.due)
                                                            }, null, 8, ["title", "description"])
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(_component_a_list, { "data-source": upcoming.value }, {
                                                    renderItem: withCtx(({ item }) => [
                                                      createVNode(_component_a_list_item, null, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_list_item_meta, {
                                                            title: item.title,
                                                            description: formatDate(item.due)
                                                          }, null, 8, ["title", "description"])
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 1
                                                  }, 8, ["data-source"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_card, { title: "Upcoming" }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_list, { "data-source": upcoming.value }, {
                                                  renderItem: withCtx(({ item }) => [
                                                    createVNode(_component_a_list_item, null, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_list_item_meta, {
                                                          title: item.title,
                                                          description: formatDate(item.due)
                                                        }, null, 8, ["title", "description"])
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 1
                                                }, 8, ["data-source"])
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
                                      createVNode(_component_a_col, {
                                        xs: 24,
                                        md: 16
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_card, { title: "Course calendar" }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_calendar, null, {
                                                dateCellRender: withCtx(({ current }) => [
                                                  createVNode("ul", { class: "events" }, [
                                                    (openBlock(true), createBlock(Fragment, null, renderList(eventsOn(current.toDate()), (e) => {
                                                      return openBlock(), createBlock("li", {
                                                        key: e.id
                                                      }, [
                                                        createVNode(_component_a_badge, {
                                                          status: e.type === "assignment" ? "processing" : "default",
                                                          text: e.title
                                                        }, null, 8, ["status", "text"])
                                                      ]);
                                                    }), 128))
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
                                      createVNode(_component_a_col, {
                                        xs: 24,
                                        md: 8
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_card, { title: "Upcoming" }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_list, { "data-source": upcoming.value }, {
                                                renderItem: withCtx(({ item }) => [
                                                  createVNode(_component_a_list_item, null, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_list_item_meta, {
                                                        title: item.title,
                                                        description: formatDate(item.due)
                                                      }, null, 8, ["title", "description"])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 1
                                              }, 8, ["data-source"])
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
                              _push5(`</div><div class="panel" style="${ssrRenderStyle(active.value === "analytics" ? null : { display: "none" })}" data-v-1f1dc1e1${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_row, { gutter: [16, 16] }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_col, {
                                      xs: 24,
                                      md: 8
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_card, null, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_a_statistic, {
                                                  title: "Average grade",
                                                  value: avgGrade.value,
                                                  suffix: "%"
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(_component_a_statistic, {
                                                    title: "Average grade",
                                                    value: avgGrade.value,
                                                    suffix: "%"
                                                  }, null, 8, ["value"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_card, null, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_statistic, {
                                                  title: "Average grade",
                                                  value: avgGrade.value,
                                                  suffix: "%"
                                                }, null, 8, ["value"])
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_col, {
                                      xs: 24,
                                      md: 8
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_card, null, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_a_statistic, {
                                                  title: "Submission rate",
                                                  value: submissionRate.value,
                                                  suffix: "%"
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(_component_a_statistic, {
                                                    title: "Submission rate",
                                                    value: submissionRate.value,
                                                    suffix: "%"
                                                  }, null, 8, ["value"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_card, null, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_statistic, {
                                                  title: "Submission rate",
                                                  value: submissionRate.value,
                                                  suffix: "%"
                                                }, null, 8, ["value"])
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_col, {
                                      xs: 24,
                                      md: 8
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_card, null, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(_component_a_statistic, {
                                                  title: "Active discussions",
                                                  value: discussions.value.length
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(_component_a_statistic, {
                                                    title: "Active discussions",
                                                    value: discussions.value.length
                                                  }, null, 8, ["value"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_card, null, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_statistic, {
                                                  title: "Active discussions",
                                                  value: discussions.value.length
                                                }, null, 8, ["value"])
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
                                      createVNode(_component_a_col, {
                                        xs: 24,
                                        md: 8
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_card, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_statistic, {
                                                title: "Average grade",
                                                value: avgGrade.value,
                                                suffix: "%"
                                              }, null, 8, ["value"])
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
                                          createVNode(_component_a_card, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_statistic, {
                                                title: "Submission rate",
                                                value: submissionRate.value,
                                                suffix: "%"
                                              }, null, 8, ["value"])
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
                                          createVNode(_component_a_card, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_statistic, {
                                                title: "Active discussions",
                                                value: discussions.value.length
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
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_card, {
                                class: "mt16",
                                title: "Completion by module"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_list, { "data-source": modules.value }, {
                                      renderItem: withCtx(({ item }, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_list_item, null, {
                                            default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`<div class="grow" data-v-1f1dc1e1${_scopeId7}><div class="bold" data-v-1f1dc1e1${_scopeId7}>${ssrInterpolate(item.title)}</div>`);
                                                _push8(ssrRenderComponent(_component_a_progress, {
                                                  percent: Math.round(item.lessons.filter((l) => l.done).length / item.lessons.length * 100)
                                                }, null, _parent8, _scopeId7));
                                                _push8(`</div>`);
                                              } else {
                                                return [
                                                  createVNode("div", { class: "grow" }, [
                                                    createVNode("div", { class: "bold" }, toDisplayString(item.title), 1),
                                                    createVNode(_component_a_progress, {
                                                      percent: Math.round(item.lessons.filter((l) => l.done).length / item.lessons.length * 100)
                                                    }, null, 8, ["percent"])
                                                  ])
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_list_item, null, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "grow" }, [
                                                  createVNode("div", { class: "bold" }, toDisplayString(item.title), 1),
                                                  createVNode(_component_a_progress, {
                                                    percent: Math.round(item.lessons.filter((l) => l.done).length / item.lessons.length * 100)
                                                  }, null, 8, ["percent"])
                                                ])
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_list, { "data-source": modules.value }, {
                                        renderItem: withCtx(({ item }) => [
                                          createVNode(_component_a_list_item, null, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "grow" }, [
                                                createVNode("div", { class: "bold" }, toDisplayString(item.title), 1),
                                                createVNode(_component_a_progress, {
                                                  percent: Math.round(item.lessons.filter((l) => l.done).length / item.lessons.length * 100)
                                                }, null, 8, ["percent"])
                                              ])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 1
                                      }, 8, ["data-source"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div><div class="panel" style="${ssrRenderStyle(active.value === "settings" ? null : { display: "none" })}" data-v-1f1dc1e1${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_form, {
                                layout: "vertical",
                                model: course
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_form_item, { label: "Course title" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_input, {
                                            value: course.title,
                                            "onUpdate:value": ($event) => course.title = $event
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_input, {
                                              value: course.title,
                                              "onUpdate:value": ($event) => course.title = $event
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_form_item, { label: "Term" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_input, {
                                            value: course.term,
                                            "onUpdate:value": ($event) => course.term = $event
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_input, {
                                              value: course.term,
                                              "onUpdate:value": ($event) => course.term = $event
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_form_item, { label: "Description" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_textarea, {
                                            value: course.description,
                                            "onUpdate:value": ($event) => course.description = $event,
                                            rows: 5
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_textarea, {
                                              value: course.description,
                                              "onUpdate:value": ($event) => course.description = $event,
                                              rows: 5
                                            }, null, 8, ["value", "onUpdate:value"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_space, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_a_button, {
                                            type: "primary",
                                            onClick: saveCourse
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`Save changes`);
                                              } else {
                                                return [
                                                  createTextVNode("Save changes")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(_component_a_button, { onClick: resetCourse }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`Reset`);
                                              } else {
                                                return [
                                                  createTextVNode("Reset")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_a_button, {
                                              type: "primary",
                                              onClick: saveCourse
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Save changes")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_button, { onClick: resetCourse }, {
                                              default: withCtx(() => [
                                                createTextVNode("Reset")
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
                                      createVNode(_component_a_form_item, { label: "Course title" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_input, {
                                            value: course.title,
                                            "onUpdate:value": ($event) => course.title = $event
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, { label: "Term" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_input, {
                                            value: course.term,
                                            "onUpdate:value": ($event) => course.term = $event
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, { label: "Description" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_textarea, {
                                            value: course.description,
                                            "onUpdate:value": ($event) => course.description = $event,
                                            rows: 5
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_space, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_button, {
                                            type: "primary",
                                            onClick: saveCourse
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Save changes")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_button, { onClick: resetCourse }, {
                                            default: withCtx(() => [
                                              createTextVNode("Reset")
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
                              _push5(`</div>`);
                            } else {
                              return [
                                withDirectives(createVNode("div", { class: "panel" }, [
                                  createVNode(_component_a_row, { gutter: [16, 16] }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_col, {
                                        xs: 24,
                                        md: 10
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_card, { title: "Progress" }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "stack-8" }, [
                                                createVNode(_component_a_progress, {
                                                  percent: progressPercent.value,
                                                  status: "active"
                                                }, null, 8, ["percent"]),
                                                createVNode("div", { class: "muted" }, toDisplayString(completedLessons.value) + " / " + toDisplayString(totalLessons.value) + " lessons complete ", 1),
                                                createVNode(_component_a_space, { wrap: "" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_tag, { color: "blue" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Activities: " + toDisplayString(assignments.value.length), 1)
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_tag, { color: "cyan" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Quizzes: " + toDisplayString(quizzes.value.length), 1)
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_tag, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Files: " + toDisplayString(files.value.length), 1)
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
                                          createVNode(_component_a_card, {
                                            title: "Upcoming deadlines",
                                            class: "mt16"
                                          }, {
                                            default: withCtx(() => [
                                              upcoming.value.length ? (openBlock(), createBlock(_component_a_list, {
                                                key: 0,
                                                "data-source": upcoming.value,
                                                renderItem: _ctx.renderUpcoming
                                              }, null, 8, ["data-source", "renderItem"])) : (openBlock(), createBlock(_component_a_empty, {
                                                key: 1,
                                                description: "No upcoming items"
                                              }))
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_col, {
                                        xs: 24,
                                        md: 14
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_card, {
                                            title: "Recent announcements",
                                            extra: unref(overviewExtra)
                                          }, {
                                            default: withCtx(() => [
                                              announcements.value.length ? (openBlock(), createBlock(_component_a_list, {
                                                key: 0,
                                                "data-source": announcements.value.slice(0, 5)
                                              }, {
                                                renderItem: withCtx(({ item }) => [
                                                  createVNode(_component_a_list_item, null, {
                                                    actions: withCtx(() => [
                                                      createVNode(_component_a_button, {
                                                        size: "small",
                                                        onClick: ($event) => openAnnouncement(item)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Open")
                                                        ]),
                                                        _: 1
                                                      }, 8, ["onClick"])
                                                    ]),
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_list_item_meta, {
                                                        title: item.title,
                                                        description: formatDate(item.date)
                                                      }, null, 8, ["title", "description"])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 1
                                              }, 8, ["data-source"])) : (openBlock(), createBlock(_component_a_empty, {
                                                key: 1,
                                                description: "Nothing yet"
                                              }))
                                            ]),
                                            _: 1
                                          }, 8, ["extra"])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ], 512), [
                                  [vShow, active.value === "overview"]
                                ]),
                                withDirectives(createVNode("div", { class: "panel" }, [
                                  createVNode("div", { class: "panel-head" }, [
                                    createVNode(_component_a_typography_title, { level: 3 }, {
                                      default: withCtx(() => [
                                        createTextVNode("Modules")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_space, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_input_search, {
                                          value: moduleSearch.value,
                                          "onUpdate:value": ($event) => moduleSearch.value = $event,
                                          placeholder: "Search modules/lessons"
                                        }, null, 8, ["value", "onUpdate:value"]),
                                        createVNode(_component_a_button, {
                                          type: "primary",
                                          onClick: openModuleCreator
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("New Module")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  createVNode(_component_a_collapse, { accordion: "" }, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(filteredModules.value, (m) => {
                                        return openBlock(), createBlock(_component_a_collapse_panel, {
                                          key: m.id,
                                          header: `${m.title} • ${m.lessons.length} lessons`
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_list, {
                                              "data-source": m.lessons
                                            }, {
                                              renderItem: withCtx(({ item }) => [
                                                createVNode(_component_a_list_item, null, {
                                                  actions: withCtx(() => [
                                                    createVNode(_component_a_button, {
                                                      size: "small",
                                                      onClick: ($event) => openLesson(m, item)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Open")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onClick"]),
                                                    createVNode(_component_a_button, {
                                                      size: "small",
                                                      type: "text",
                                                      onClick: ($event) => quickAdd("assignment", m, item)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("+ Assignment")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onClick"])
                                                  ]),
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_space, { align: "center" }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_checkbox, {
                                                          checked: item.done,
                                                          onChange: ($event) => toggleLesson(m, item)
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode("span", {
                                                              class: { done: item.done }
                                                            }, toDisplayString(item.title), 3)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["checked", "onChange"]),
                                                        item.type ? (openBlock(), createBlock(_component_a_tag, {
                                                          key: 0,
                                                          color: "geekblue"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(item.type), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024)) : createCommentVNode("", true)
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1032, ["data-source"])
                                          ]),
                                          _: 2
                                        }, 1032, ["header"]);
                                      }), 128))
                                    ]),
                                    _: 1
                                  })
                                ], 512), [
                                  [vShow, active.value === "modules"]
                                ]),
                                withDirectives(createVNode("div", { class: "panel" }, [
                                  createVNode("div", { class: "panel-head" }, [
                                    createVNode(_component_a_typography_title, { level: 3 }, {
                                      default: withCtx(() => [
                                        createTextVNode("Assignments")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_space, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_segmented, {
                                          value: assignmentFilter.value,
                                          "onUpdate:value": ($event) => assignmentFilter.value = $event,
                                          options: ["All", "Open", "Closed"]
                                        }, null, 8, ["value", "onUpdate:value"]),
                                        createVNode(_component_a_input_search, {
                                          value: assignmentSearch.value,
                                          "onUpdate:value": ($event) => assignmentSearch.value = $event,
                                          placeholder: "Search assignments",
                                          "allow-clear": ""
                                        }, null, 8, ["value", "onUpdate:value"]),
                                        createVNode(_component_a_button, {
                                          type: "primary",
                                          onClick: ($event) => openAssignmentEditor()
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("New")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  createVNode(_component_a_table, {
                                    columns: assignmentCols,
                                    "data-source": filteredAssignments.value,
                                    "row-key": "id",
                                    pagination: { pageSize: 8 },
                                    size: "middle"
                                  }, {
                                    bodyCell: withCtx(({ column, record }) => [
                                      column.key === "title" ? (openBlock(), createBlock(_component_a_space, { key: 0 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_badge, {
                                            status: record.status === "open" ? "processing" : "default"
                                          }, null, 8, ["status"]),
                                          createVNode(_component_a_typography_link, {
                                            onClick: ($event) => openAssignment(record)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(record.title), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["onClick"])
                                        ]),
                                        _: 2
                                      }, 1024)) : column.key === "due" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                        createTextVNode(toDisplayString(formatDate(record.due)), 1)
                                      ], 64)) : column.key === "points" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                        createTextVNode(toDisplayString(record.points), 1)
                                      ], 64)) : column.key === "actions" ? (openBlock(), createBlock(_component_a_space, { key: 3 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_button, {
                                            size: "small",
                                            onClick: ($event) => openAssignment(record)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("View")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"]),
                                          createVNode(_component_a_button, {
                                            size: "small",
                                            onClick: ($event) => openAssignmentEditor(record)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Edit")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"]),
                                          createVNode(_component_a_popconfirm, {
                                            title: "Delete assignment?",
                                            onConfirm: ($event) => removeAssignment(record)
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_button, {
                                                size: "small",
                                                danger: ""
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Delete")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }, 8, ["onConfirm"])
                                        ]),
                                        _: 2
                                      }, 1024)) : createCommentVNode("", true)
                                    ]),
                                    _: 1
                                  }, 8, ["data-source"])
                                ], 512), [
                                  [vShow, active.value === "assignments"]
                                ]),
                                withDirectives(createVNode("div", { class: "panel" }, [
                                  createVNode("div", { class: "panel-head" }, [
                                    createVNode(_component_a_typography_title, { level: 3 }, {
                                      default: withCtx(() => [
                                        createTextVNode("Quizzes")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_button, {
                                      type: "primary",
                                      onClick: createQuiz
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("New Quiz")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  createVNode(_component_a_table, {
                                    columns: quizCols,
                                    "data-source": quizzes.value,
                                    "row-key": "id",
                                    pagination: { pageSize: 8 },
                                    size: "middle"
                                  }, null, 8, ["data-source"])
                                ], 512), [
                                  [vShow, active.value === "quizzes"]
                                ]),
                                withDirectives(createVNode("div", { class: "panel" }, [
                                  createVNode("div", { class: "panel-head" }, [
                                    createVNode(_component_a_typography_title, { level: 3 }, {
                                      default: withCtx(() => [
                                        createTextVNode("Discussions")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_space, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_input_search, {
                                          value: discussionSearch.value,
                                          "onUpdate:value": ($event) => discussionSearch.value = $event,
                                          placeholder: "Search topics"
                                        }, null, 8, ["value", "onUpdate:value"]),
                                        createVNode(_component_a_button, {
                                          onClick: ($event) => openDiscussionEditor()
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("New Topic")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  createVNode(_component_a_list, {
                                    "data-source": filteredDiscussions.value,
                                    "item-layout": "horizontal"
                                  }, {
                                    renderItem: withCtx(({ item }) => [
                                      createVNode(_component_a_list_item, null, {
                                        actions: withCtx(() => [
                                          createVNode(_component_a_button, {
                                            size: "small",
                                            onClick: ($event) => openDiscussion(item)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Open")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"])
                                        ]),
                                        default: withCtx(() => [
                                          createVNode(_component_a_list_item_meta, {
                                            title: item.title,
                                            description: `${item.posts.length} posts • last active ${formatDate(item.updatedAt)}`
                                          }, null, 8, ["title", "description"])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 1
                                  }, 8, ["data-source"])
                                ], 512), [
                                  [vShow, active.value === "discussions"]
                                ]),
                                withDirectives(createVNode("div", { class: "panel" }, [
                                  createVNode("div", { class: "panel-head" }, [
                                    createVNode(_component_a_typography_title, { level: 3 }, {
                                      default: withCtx(() => [
                                        createTextVNode("Files")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_space, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_select, {
                                          value: fileType.value,
                                          "onUpdate:value": ($event) => fileType.value = $event,
                                          style: { "min-width": "140px" }
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_select_option, { value: "all" }, {
                                              default: withCtx(() => [
                                                createTextVNode("All types")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_select_option, { value: "pdf" }, {
                                              default: withCtx(() => [
                                                createTextVNode("PDF")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_select_option, { value: "video" }, {
                                              default: withCtx(() => [
                                                createTextVNode("Video")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_select_option, { value: "doc" }, {
                                              default: withCtx(() => [
                                                createTextVNode("Documents")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }, 8, ["value", "onUpdate:value"]),
                                        createVNode(_component_a_input_search, {
                                          value: fileSearch.value,
                                          "onUpdate:value": ($event) => fileSearch.value = $event,
                                          placeholder: "Search files"
                                        }, null, 8, ["value", "onUpdate:value"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  createVNode(_component_a_upload_dragger, {
                                    "before-upload": handleBeforeUpload,
                                    "show-upload-list": false,
                                    multiple: ""
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("p", { class: "ant-upload-drag-icon" }, [
                                        createVNode(unref(InboxOutlined))
                                      ]),
                                      createVNode("p", { class: "ant-upload-text" }, "Click or drag files to upload"),
                                      createVNode("p", { class: "ant-upload-hint" }, "Mock upload adds entries locally.")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_list, {
                                    class: "mt16",
                                    "data-source": filteredFiles.value,
                                    grid: "{ gutter: 16, column: 3 }"
                                  }, {
                                    renderItem: withCtx(({ item }) => [
                                      createVNode(_component_a_list_item, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_card, {
                                            title: item.name,
                                            extra: item.type.toUpperCase()
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_space, {
                                                direction: "vertical",
                                                style: { "width": "100%" }
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode("div", { class: "muted" }, "Added " + toDisplayString(formatDate(item.date)), 1),
                                                  createVNode(_component_a_space, null, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_button, {
                                                        size: "small",
                                                        type: "link"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Open")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(_component_a_popconfirm, {
                                                        title: "Remove file?",
                                                        onConfirm: ($event) => removeFile(item)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_button, {
                                                            size: "small",
                                                            danger: ""
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Delete")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }, 8, ["onConfirm"])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1032, ["title", "extra"])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 1
                                  }, 8, ["data-source"])
                                ], 512), [
                                  [vShow, active.value === "files"]
                                ]),
                                withDirectives(createVNode("div", { class: "panel" }, [
                                  createVNode("div", { class: "panel-head" }, [
                                    createVNode(_component_a_typography_title, { level: 3 }, {
                                      default: withCtx(() => [
                                        createTextVNode("Participants")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_space, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_input_search, {
                                          value: participantSearch.value,
                                          "onUpdate:value": ($event) => participantSearch.value = $event,
                                          placeholder: "Search participants"
                                        }, null, 8, ["value", "onUpdate:value"]),
                                        createVNode(_component_a_select, {
                                          value: roleFilter.value,
                                          "onUpdate:value": ($event) => roleFilter.value = $event,
                                          style: { "min-width": "140px" }
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_select_option, { value: "all" }, {
                                              default: withCtx(() => [
                                                createTextVNode("All roles")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_select_option, { value: "student" }, {
                                              default: withCtx(() => [
                                                createTextVNode("Students")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_select_option, { value: "ta" }, {
                                              default: withCtx(() => [
                                                createTextVNode("TAs")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }, 8, ["value", "onUpdate:value"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  createVNode(_component_a_table, {
                                    columns: participantCols,
                                    "data-source": filteredParticipants.value,
                                    "row-key": "id",
                                    pagination: { pageSize: 10 },
                                    size: "middle"
                                  }, null, 8, ["data-source"])
                                ], 512), [
                                  [vShow, active.value === "participants"]
                                ]),
                                withDirectives(createVNode("div", { class: "panel" }, [
                                  createVNode("div", { class: "panel-head" }, [
                                    createVNode(_component_a_typography_title, { level: 3 }, {
                                      default: withCtx(() => [
                                        createTextVNode("Gradebook")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_space, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_select, {
                                          value: selectedStudent.value,
                                          "onUpdate:value": ($event) => selectedStudent.value = $event,
                                          style: { "min-width": "220px" },
                                          "allow-clear": "",
                                          placeholder: "Filter by student"
                                        }, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(participants.value, (p) => {
                                              return openBlock(), createBlock(_component_a_select_option, {
                                                key: p.id,
                                                value: p.name
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(p.name), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["value"]);
                                            }), 128))
                                          ]),
                                          _: 1
                                        }, 8, ["value", "onUpdate:value"]),
                                        createVNode(_component_a_button, { onClick: exportGrades }, {
                                          default: withCtx(() => [
                                            createTextVNode("Export CSV")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  createVNode(_component_a_table, {
                                    columns: gradeCols,
                                    "data-source": filteredGrades.value,
                                    "row-key": "id",
                                    pagination: { pageSize: 10 },
                                    size: "middle"
                                  }, null, 8, ["data-source"])
                                ], 512), [
                                  [vShow, active.value === "grades"]
                                ]),
                                withDirectives(createVNode("div", { class: "panel" }, [
                                  createVNode(_component_a_row, { gutter: [16, 16] }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_col, {
                                        xs: 24,
                                        md: 16
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_card, { title: "Course calendar" }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_calendar, null, {
                                                dateCellRender: withCtx(({ current }) => [
                                                  createVNode("ul", { class: "events" }, [
                                                    (openBlock(true), createBlock(Fragment, null, renderList(eventsOn(current.toDate()), (e) => {
                                                      return openBlock(), createBlock("li", {
                                                        key: e.id
                                                      }, [
                                                        createVNode(_component_a_badge, {
                                                          status: e.type === "assignment" ? "processing" : "default",
                                                          text: e.title
                                                        }, null, 8, ["status", "text"])
                                                      ]);
                                                    }), 128))
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
                                      createVNode(_component_a_col, {
                                        xs: 24,
                                        md: 8
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_card, { title: "Upcoming" }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_list, { "data-source": upcoming.value }, {
                                                renderItem: withCtx(({ item }) => [
                                                  createVNode(_component_a_list_item, null, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_list_item_meta, {
                                                        title: item.title,
                                                        description: formatDate(item.due)
                                                      }, null, 8, ["title", "description"])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 1
                                              }, 8, ["data-source"])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ], 512), [
                                  [vShow, active.value === "calendar"]
                                ]),
                                withDirectives(createVNode("div", { class: "panel" }, [
                                  createVNode(_component_a_row, { gutter: [16, 16] }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_col, {
                                        xs: 24,
                                        md: 8
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_card, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_statistic, {
                                                title: "Average grade",
                                                value: avgGrade.value,
                                                suffix: "%"
                                              }, null, 8, ["value"])
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
                                          createVNode(_component_a_card, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_statistic, {
                                                title: "Submission rate",
                                                value: submissionRate.value,
                                                suffix: "%"
                                              }, null, 8, ["value"])
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
                                          createVNode(_component_a_card, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_statistic, {
                                                title: "Active discussions",
                                                value: discussions.value.length
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
                                    class: "mt16",
                                    title: "Completion by module"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_list, { "data-source": modules.value }, {
                                        renderItem: withCtx(({ item }) => [
                                          createVNode(_component_a_list_item, null, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "grow" }, [
                                                createVNode("div", { class: "bold" }, toDisplayString(item.title), 1),
                                                createVNode(_component_a_progress, {
                                                  percent: Math.round(item.lessons.filter((l) => l.done).length / item.lessons.length * 100)
                                                }, null, 8, ["percent"])
                                              ])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 1
                                      }, 8, ["data-source"])
                                    ]),
                                    _: 1
                                  })
                                ], 512), [
                                  [vShow, active.value === "analytics"]
                                ]),
                                withDirectives(createVNode("div", { class: "panel" }, [
                                  createVNode(_component_a_form, {
                                    layout: "vertical",
                                    model: course
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_form_item, { label: "Course title" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_input, {
                                            value: course.title,
                                            "onUpdate:value": ($event) => course.title = $event
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, { label: "Term" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_input, {
                                            value: course.term,
                                            "onUpdate:value": ($event) => course.term = $event
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_form_item, { label: "Description" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_textarea, {
                                            value: course.description,
                                            "onUpdate:value": ($event) => course.description = $event,
                                            rows: 5
                                          }, null, 8, ["value", "onUpdate:value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_space, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_button, {
                                            type: "primary",
                                            onClick: saveCourse
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Save changes")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_button, { onClick: resetCourse }, {
                                            default: withCtx(() => [
                                              createTextVNode("Reset")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["model"])
                                ], 512), [
                                  [vShow, active.value === "settings"]
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_spin, { spinning: loading.value }, {
                            default: withCtx(() => [
                              withDirectives(createVNode("div", { class: "panel" }, [
                                createVNode(_component_a_row, { gutter: [16, 16] }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_col, {
                                      xs: 24,
                                      md: 10
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_card, { title: "Progress" }, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "stack-8" }, [
                                              createVNode(_component_a_progress, {
                                                percent: progressPercent.value,
                                                status: "active"
                                              }, null, 8, ["percent"]),
                                              createVNode("div", { class: "muted" }, toDisplayString(completedLessons.value) + " / " + toDisplayString(totalLessons.value) + " lessons complete ", 1),
                                              createVNode(_component_a_space, { wrap: "" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_tag, { color: "blue" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Activities: " + toDisplayString(assignments.value.length), 1)
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(_component_a_tag, { color: "cyan" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Quizzes: " + toDisplayString(quizzes.value.length), 1)
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(_component_a_tag, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Files: " + toDisplayString(files.value.length), 1)
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
                                        createVNode(_component_a_card, {
                                          title: "Upcoming deadlines",
                                          class: "mt16"
                                        }, {
                                          default: withCtx(() => [
                                            upcoming.value.length ? (openBlock(), createBlock(_component_a_list, {
                                              key: 0,
                                              "data-source": upcoming.value,
                                              renderItem: _ctx.renderUpcoming
                                            }, null, 8, ["data-source", "renderItem"])) : (openBlock(), createBlock(_component_a_empty, {
                                              key: 1,
                                              description: "No upcoming items"
                                            }))
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_col, {
                                      xs: 24,
                                      md: 14
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_card, {
                                          title: "Recent announcements",
                                          extra: unref(overviewExtra)
                                        }, {
                                          default: withCtx(() => [
                                            announcements.value.length ? (openBlock(), createBlock(_component_a_list, {
                                              key: 0,
                                              "data-source": announcements.value.slice(0, 5)
                                            }, {
                                              renderItem: withCtx(({ item }) => [
                                                createVNode(_component_a_list_item, null, {
                                                  actions: withCtx(() => [
                                                    createVNode(_component_a_button, {
                                                      size: "small",
                                                      onClick: ($event) => openAnnouncement(item)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Open")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onClick"])
                                                  ]),
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_list_item_meta, {
                                                      title: item.title,
                                                      description: formatDate(item.date)
                                                    }, null, 8, ["title", "description"])
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 1
                                            }, 8, ["data-source"])) : (openBlock(), createBlock(_component_a_empty, {
                                              key: 1,
                                              description: "Nothing yet"
                                            }))
                                          ]),
                                          _: 1
                                        }, 8, ["extra"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ], 512), [
                                [vShow, active.value === "overview"]
                              ]),
                              withDirectives(createVNode("div", { class: "panel" }, [
                                createVNode("div", { class: "panel-head" }, [
                                  createVNode(_component_a_typography_title, { level: 3 }, {
                                    default: withCtx(() => [
                                      createTextVNode("Modules")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_space, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_input_search, {
                                        value: moduleSearch.value,
                                        "onUpdate:value": ($event) => moduleSearch.value = $event,
                                        placeholder: "Search modules/lessons"
                                      }, null, 8, ["value", "onUpdate:value"]),
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        onClick: openModuleCreator
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("New Module")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                createVNode(_component_a_collapse, { accordion: "" }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(filteredModules.value, (m) => {
                                      return openBlock(), createBlock(_component_a_collapse_panel, {
                                        key: m.id,
                                        header: `${m.title} • ${m.lessons.length} lessons`
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_list, {
                                            "data-source": m.lessons
                                          }, {
                                            renderItem: withCtx(({ item }) => [
                                              createVNode(_component_a_list_item, null, {
                                                actions: withCtx(() => [
                                                  createVNode(_component_a_button, {
                                                    size: "small",
                                                    onClick: ($event) => openLesson(m, item)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Open")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"]),
                                                  createVNode(_component_a_button, {
                                                    size: "small",
                                                    type: "text",
                                                    onClick: ($event) => quickAdd("assignment", m, item)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("+ Assignment")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"])
                                                ]),
                                                default: withCtx(() => [
                                                  createVNode(_component_a_space, { align: "center" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_checkbox, {
                                                        checked: item.done,
                                                        onChange: ($event) => toggleLesson(m, item)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode("span", {
                                                            class: { done: item.done }
                                                          }, toDisplayString(item.title), 3)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["checked", "onChange"]),
                                                      item.type ? (openBlock(), createBlock(_component_a_tag, {
                                                        key: 0,
                                                        color: "geekblue"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(item.type), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024)) : createCommentVNode("", true)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1032, ["data-source"])
                                        ]),
                                        _: 2
                                      }, 1032, ["header"]);
                                    }), 128))
                                  ]),
                                  _: 1
                                })
                              ], 512), [
                                [vShow, active.value === "modules"]
                              ]),
                              withDirectives(createVNode("div", { class: "panel" }, [
                                createVNode("div", { class: "panel-head" }, [
                                  createVNode(_component_a_typography_title, { level: 3 }, {
                                    default: withCtx(() => [
                                      createTextVNode("Assignments")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_space, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_segmented, {
                                        value: assignmentFilter.value,
                                        "onUpdate:value": ($event) => assignmentFilter.value = $event,
                                        options: ["All", "Open", "Closed"]
                                      }, null, 8, ["value", "onUpdate:value"]),
                                      createVNode(_component_a_input_search, {
                                        value: assignmentSearch.value,
                                        "onUpdate:value": ($event) => assignmentSearch.value = $event,
                                        placeholder: "Search assignments",
                                        "allow-clear": ""
                                      }, null, 8, ["value", "onUpdate:value"]),
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        onClick: ($event) => openAssignmentEditor()
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("New")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                createVNode(_component_a_table, {
                                  columns: assignmentCols,
                                  "data-source": filteredAssignments.value,
                                  "row-key": "id",
                                  pagination: { pageSize: 8 },
                                  size: "middle"
                                }, {
                                  bodyCell: withCtx(({ column, record }) => [
                                    column.key === "title" ? (openBlock(), createBlock(_component_a_space, { key: 0 }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_badge, {
                                          status: record.status === "open" ? "processing" : "default"
                                        }, null, 8, ["status"]),
                                        createVNode(_component_a_typography_link, {
                                          onClick: ($event) => openAssignment(record)
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(record.title), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["onClick"])
                                      ]),
                                      _: 2
                                    }, 1024)) : column.key === "due" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                      createTextVNode(toDisplayString(formatDate(record.due)), 1)
                                    ], 64)) : column.key === "points" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                      createTextVNode(toDisplayString(record.points), 1)
                                    ], 64)) : column.key === "actions" ? (openBlock(), createBlock(_component_a_space, { key: 3 }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_button, {
                                          size: "small",
                                          onClick: ($event) => openAssignment(record)
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("View")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"]),
                                        createVNode(_component_a_button, {
                                          size: "small",
                                          onClick: ($event) => openAssignmentEditor(record)
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Edit")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"]),
                                        createVNode(_component_a_popconfirm, {
                                          title: "Delete assignment?",
                                          onConfirm: ($event) => removeAssignment(record)
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_button, {
                                              size: "small",
                                              danger: ""
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Delete")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }, 8, ["onConfirm"])
                                      ]),
                                      _: 2
                                    }, 1024)) : createCommentVNode("", true)
                                  ]),
                                  _: 1
                                }, 8, ["data-source"])
                              ], 512), [
                                [vShow, active.value === "assignments"]
                              ]),
                              withDirectives(createVNode("div", { class: "panel" }, [
                                createVNode("div", { class: "panel-head" }, [
                                  createVNode(_component_a_typography_title, { level: 3 }, {
                                    default: withCtx(() => [
                                      createTextVNode("Quizzes")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_button, {
                                    type: "primary",
                                    onClick: createQuiz
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("New Quiz")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                createVNode(_component_a_table, {
                                  columns: quizCols,
                                  "data-source": quizzes.value,
                                  "row-key": "id",
                                  pagination: { pageSize: 8 },
                                  size: "middle"
                                }, null, 8, ["data-source"])
                              ], 512), [
                                [vShow, active.value === "quizzes"]
                              ]),
                              withDirectives(createVNode("div", { class: "panel" }, [
                                createVNode("div", { class: "panel-head" }, [
                                  createVNode(_component_a_typography_title, { level: 3 }, {
                                    default: withCtx(() => [
                                      createTextVNode("Discussions")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_space, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_input_search, {
                                        value: discussionSearch.value,
                                        "onUpdate:value": ($event) => discussionSearch.value = $event,
                                        placeholder: "Search topics"
                                      }, null, 8, ["value", "onUpdate:value"]),
                                      createVNode(_component_a_button, {
                                        onClick: ($event) => openDiscussionEditor()
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("New Topic")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                createVNode(_component_a_list, {
                                  "data-source": filteredDiscussions.value,
                                  "item-layout": "horizontal"
                                }, {
                                  renderItem: withCtx(({ item }) => [
                                    createVNode(_component_a_list_item, null, {
                                      actions: withCtx(() => [
                                        createVNode(_component_a_button, {
                                          size: "small",
                                          onClick: ($event) => openDiscussion(item)
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Open")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"])
                                      ]),
                                      default: withCtx(() => [
                                        createVNode(_component_a_list_item_meta, {
                                          title: item.title,
                                          description: `${item.posts.length} posts • last active ${formatDate(item.updatedAt)}`
                                        }, null, 8, ["title", "description"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 1
                                }, 8, ["data-source"])
                              ], 512), [
                                [vShow, active.value === "discussions"]
                              ]),
                              withDirectives(createVNode("div", { class: "panel" }, [
                                createVNode("div", { class: "panel-head" }, [
                                  createVNode(_component_a_typography_title, { level: 3 }, {
                                    default: withCtx(() => [
                                      createTextVNode("Files")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_space, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_select, {
                                        value: fileType.value,
                                        "onUpdate:value": ($event) => fileType.value = $event,
                                        style: { "min-width": "140px" }
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_select_option, { value: "all" }, {
                                            default: withCtx(() => [
                                              createTextVNode("All types")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_select_option, { value: "pdf" }, {
                                            default: withCtx(() => [
                                              createTextVNode("PDF")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_select_option, { value: "video" }, {
                                            default: withCtx(() => [
                                              createTextVNode("Video")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_select_option, { value: "doc" }, {
                                            default: withCtx(() => [
                                              createTextVNode("Documents")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["value", "onUpdate:value"]),
                                      createVNode(_component_a_input_search, {
                                        value: fileSearch.value,
                                        "onUpdate:value": ($event) => fileSearch.value = $event,
                                        placeholder: "Search files"
                                      }, null, 8, ["value", "onUpdate:value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                createVNode(_component_a_upload_dragger, {
                                  "before-upload": handleBeforeUpload,
                                  "show-upload-list": false,
                                  multiple: ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode("p", { class: "ant-upload-drag-icon" }, [
                                      createVNode(unref(InboxOutlined))
                                    ]),
                                    createVNode("p", { class: "ant-upload-text" }, "Click or drag files to upload"),
                                    createVNode("p", { class: "ant-upload-hint" }, "Mock upload adds entries locally.")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_list, {
                                  class: "mt16",
                                  "data-source": filteredFiles.value,
                                  grid: "{ gutter: 16, column: 3 }"
                                }, {
                                  renderItem: withCtx(({ item }) => [
                                    createVNode(_component_a_list_item, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_card, {
                                          title: item.name,
                                          extra: item.type.toUpperCase()
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_space, {
                                              direction: "vertical",
                                              style: { "width": "100%" }
                                            }, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "muted" }, "Added " + toDisplayString(formatDate(item.date)), 1),
                                                createVNode(_component_a_space, null, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_button, {
                                                      size: "small",
                                                      type: "link"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Open")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_popconfirm, {
                                                      title: "Remove file?",
                                                      onConfirm: ($event) => removeFile(item)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_button, {
                                                          size: "small",
                                                          danger: ""
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Delete")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onConfirm"])
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1032, ["title", "extra"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 1
                                }, 8, ["data-source"])
                              ], 512), [
                                [vShow, active.value === "files"]
                              ]),
                              withDirectives(createVNode("div", { class: "panel" }, [
                                createVNode("div", { class: "panel-head" }, [
                                  createVNode(_component_a_typography_title, { level: 3 }, {
                                    default: withCtx(() => [
                                      createTextVNode("Participants")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_space, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_input_search, {
                                        value: participantSearch.value,
                                        "onUpdate:value": ($event) => participantSearch.value = $event,
                                        placeholder: "Search participants"
                                      }, null, 8, ["value", "onUpdate:value"]),
                                      createVNode(_component_a_select, {
                                        value: roleFilter.value,
                                        "onUpdate:value": ($event) => roleFilter.value = $event,
                                        style: { "min-width": "140px" }
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_select_option, { value: "all" }, {
                                            default: withCtx(() => [
                                              createTextVNode("All roles")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_select_option, { value: "student" }, {
                                            default: withCtx(() => [
                                              createTextVNode("Students")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_select_option, { value: "ta" }, {
                                            default: withCtx(() => [
                                              createTextVNode("TAs")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["value", "onUpdate:value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                createVNode(_component_a_table, {
                                  columns: participantCols,
                                  "data-source": filteredParticipants.value,
                                  "row-key": "id",
                                  pagination: { pageSize: 10 },
                                  size: "middle"
                                }, null, 8, ["data-source"])
                              ], 512), [
                                [vShow, active.value === "participants"]
                              ]),
                              withDirectives(createVNode("div", { class: "panel" }, [
                                createVNode("div", { class: "panel-head" }, [
                                  createVNode(_component_a_typography_title, { level: 3 }, {
                                    default: withCtx(() => [
                                      createTextVNode("Gradebook")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_space, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_select, {
                                        value: selectedStudent.value,
                                        "onUpdate:value": ($event) => selectedStudent.value = $event,
                                        style: { "min-width": "220px" },
                                        "allow-clear": "",
                                        placeholder: "Filter by student"
                                      }, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(participants.value, (p) => {
                                            return openBlock(), createBlock(_component_a_select_option, {
                                              key: p.id,
                                              value: p.name
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(p.name), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["value"]);
                                          }), 128))
                                        ]),
                                        _: 1
                                      }, 8, ["value", "onUpdate:value"]),
                                      createVNode(_component_a_button, { onClick: exportGrades }, {
                                        default: withCtx(() => [
                                          createTextVNode("Export CSV")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                createVNode(_component_a_table, {
                                  columns: gradeCols,
                                  "data-source": filteredGrades.value,
                                  "row-key": "id",
                                  pagination: { pageSize: 10 },
                                  size: "middle"
                                }, null, 8, ["data-source"])
                              ], 512), [
                                [vShow, active.value === "grades"]
                              ]),
                              withDirectives(createVNode("div", { class: "panel" }, [
                                createVNode(_component_a_row, { gutter: [16, 16] }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_col, {
                                      xs: 24,
                                      md: 16
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_card, { title: "Course calendar" }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_calendar, null, {
                                              dateCellRender: withCtx(({ current }) => [
                                                createVNode("ul", { class: "events" }, [
                                                  (openBlock(true), createBlock(Fragment, null, renderList(eventsOn(current.toDate()), (e) => {
                                                    return openBlock(), createBlock("li", {
                                                      key: e.id
                                                    }, [
                                                      createVNode(_component_a_badge, {
                                                        status: e.type === "assignment" ? "processing" : "default",
                                                        text: e.title
                                                      }, null, 8, ["status", "text"])
                                                    ]);
                                                  }), 128))
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
                                    createVNode(_component_a_col, {
                                      xs: 24,
                                      md: 8
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_card, { title: "Upcoming" }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_list, { "data-source": upcoming.value }, {
                                              renderItem: withCtx(({ item }) => [
                                                createVNode(_component_a_list_item, null, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_list_item_meta, {
                                                      title: item.title,
                                                      description: formatDate(item.due)
                                                    }, null, 8, ["title", "description"])
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 1
                                            }, 8, ["data-source"])
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ], 512), [
                                [vShow, active.value === "calendar"]
                              ]),
                              withDirectives(createVNode("div", { class: "panel" }, [
                                createVNode(_component_a_row, { gutter: [16, 16] }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_col, {
                                      xs: 24,
                                      md: 8
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_card, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_statistic, {
                                              title: "Average grade",
                                              value: avgGrade.value,
                                              suffix: "%"
                                            }, null, 8, ["value"])
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
                                        createVNode(_component_a_card, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_statistic, {
                                              title: "Submission rate",
                                              value: submissionRate.value,
                                              suffix: "%"
                                            }, null, 8, ["value"])
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
                                        createVNode(_component_a_card, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_statistic, {
                                              title: "Active discussions",
                                              value: discussions.value.length
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
                                  class: "mt16",
                                  title: "Completion by module"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_list, { "data-source": modules.value }, {
                                      renderItem: withCtx(({ item }) => [
                                        createVNode(_component_a_list_item, null, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "grow" }, [
                                              createVNode("div", { class: "bold" }, toDisplayString(item.title), 1),
                                              createVNode(_component_a_progress, {
                                                percent: Math.round(item.lessons.filter((l) => l.done).length / item.lessons.length * 100)
                                              }, null, 8, ["percent"])
                                            ])
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 1
                                    }, 8, ["data-source"])
                                  ]),
                                  _: 1
                                })
                              ], 512), [
                                [vShow, active.value === "analytics"]
                              ]),
                              withDirectives(createVNode("div", { class: "panel" }, [
                                createVNode(_component_a_form, {
                                  layout: "vertical",
                                  model: course
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_form_item, { label: "Course title" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_input, {
                                          value: course.title,
                                          "onUpdate:value": ($event) => course.title = $event
                                        }, null, 8, ["value", "onUpdate:value"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_form_item, { label: "Term" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_input, {
                                          value: course.term,
                                          "onUpdate:value": ($event) => course.term = $event
                                        }, null, 8, ["value", "onUpdate:value"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_form_item, { label: "Description" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_textarea, {
                                          value: course.description,
                                          "onUpdate:value": ($event) => course.description = $event,
                                          rows: 5
                                        }, null, 8, ["value", "onUpdate:value"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_space, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_button, {
                                          type: "primary",
                                          onClick: saveCourse
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Save changes")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_button, { onClick: resetCourse }, {
                                          default: withCtx(() => [
                                            createTextVNode("Reset")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["model"])
                              ], 512), [
                                [vShow, active.value === "settings"]
                              ])
                            ]),
                            _: 1
                          }, 8, ["spinning"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_layout_header, { class: "topbar" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_page_header, {
                          title: course.title,
                          "sub-title": `${course.term} • ${course.instructor.name}`,
                          ghost: ""
                        }, {
                          extra: withCtx(() => [
                            createVNode(_component_a_segmented, {
                              options: ["Student view", "Instructor view"],
                              value: viewMode.value,
                              "onUpdate:value": ($event) => viewMode.value = $event,
                              size: "small"
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_button, {
                              type: "default",
                              onClick: toggleEnroll
                            }, {
                              icon: withCtx(() => [
                                (openBlock(), createBlock(resolveDynamicComponent(enrolled.value ? unref(CheckCircleOutlined) : unref(PlusOutlined))))
                              ]),
                              default: withCtx(() => [
                                createTextVNode(" " + toDisplayString(enrolled.value ? "Enrolled" : "Join Course"), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_dropdown, null, {
                              overlay: withCtx(() => [
                                createVNode(_component_a_menu, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_menu_item, {
                                      onClick: ($event) => openAnnouncementEditor()
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("New announcement")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"]),
                                    createVNode(_component_a_menu_item, {
                                      onClick: ($event) => openAssignmentEditor()
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("New assignment")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"]),
                                    createVNode(_component_a_menu_item, {
                                      onClick: ($event) => openModuleCreator()
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("New module")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              default: withCtx(() => [
                                createVNode(_component_a_button, null, {
                                  default: withCtx(() => [
                                    createTextVNode(" Actions "),
                                    createVNode(unref(DownOutlined))
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["title", "sub-title"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_layout_content, { class: "content" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_spin, { spinning: loading.value }, {
                          default: withCtx(() => [
                            withDirectives(createVNode("div", { class: "panel" }, [
                              createVNode(_component_a_row, { gutter: [16, 16] }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_col, {
                                    xs: 24,
                                    md: 10
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_card, { title: "Progress" }, {
                                        default: withCtx(() => [
                                          createVNode("div", { class: "stack-8" }, [
                                            createVNode(_component_a_progress, {
                                              percent: progressPercent.value,
                                              status: "active"
                                            }, null, 8, ["percent"]),
                                            createVNode("div", { class: "muted" }, toDisplayString(completedLessons.value) + " / " + toDisplayString(totalLessons.value) + " lessons complete ", 1),
                                            createVNode(_component_a_space, { wrap: "" }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_tag, { color: "blue" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Activities: " + toDisplayString(assignments.value.length), 1)
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_tag, { color: "cyan" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Quizzes: " + toDisplayString(quizzes.value.length), 1)
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_tag, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Files: " + toDisplayString(files.value.length), 1)
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
                                      createVNode(_component_a_card, {
                                        title: "Upcoming deadlines",
                                        class: "mt16"
                                      }, {
                                        default: withCtx(() => [
                                          upcoming.value.length ? (openBlock(), createBlock(_component_a_list, {
                                            key: 0,
                                            "data-source": upcoming.value,
                                            renderItem: _ctx.renderUpcoming
                                          }, null, 8, ["data-source", "renderItem"])) : (openBlock(), createBlock(_component_a_empty, {
                                            key: 1,
                                            description: "No upcoming items"
                                          }))
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_col, {
                                    xs: 24,
                                    md: 14
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_card, {
                                        title: "Recent announcements",
                                        extra: unref(overviewExtra)
                                      }, {
                                        default: withCtx(() => [
                                          announcements.value.length ? (openBlock(), createBlock(_component_a_list, {
                                            key: 0,
                                            "data-source": announcements.value.slice(0, 5)
                                          }, {
                                            renderItem: withCtx(({ item }) => [
                                              createVNode(_component_a_list_item, null, {
                                                actions: withCtx(() => [
                                                  createVNode(_component_a_button, {
                                                    size: "small",
                                                    onClick: ($event) => openAnnouncement(item)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Open")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"])
                                                ]),
                                                default: withCtx(() => [
                                                  createVNode(_component_a_list_item_meta, {
                                                    title: item.title,
                                                    description: formatDate(item.date)
                                                  }, null, 8, ["title", "description"])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 1
                                          }, 8, ["data-source"])) : (openBlock(), createBlock(_component_a_empty, {
                                            key: 1,
                                            description: "Nothing yet"
                                          }))
                                        ]),
                                        _: 1
                                      }, 8, ["extra"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ], 512), [
                              [vShow, active.value === "overview"]
                            ]),
                            withDirectives(createVNode("div", { class: "panel" }, [
                              createVNode("div", { class: "panel-head" }, [
                                createVNode(_component_a_typography_title, { level: 3 }, {
                                  default: withCtx(() => [
                                    createTextVNode("Modules")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_input_search, {
                                      value: moduleSearch.value,
                                      "onUpdate:value": ($event) => moduleSearch.value = $event,
                                      placeholder: "Search modules/lessons"
                                    }, null, 8, ["value", "onUpdate:value"]),
                                    createVNode(_component_a_button, {
                                      type: "primary",
                                      onClick: openModuleCreator
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("New Module")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              createVNode(_component_a_collapse, { accordion: "" }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(filteredModules.value, (m) => {
                                    return openBlock(), createBlock(_component_a_collapse_panel, {
                                      key: m.id,
                                      header: `${m.title} • ${m.lessons.length} lessons`
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_list, {
                                          "data-source": m.lessons
                                        }, {
                                          renderItem: withCtx(({ item }) => [
                                            createVNode(_component_a_list_item, null, {
                                              actions: withCtx(() => [
                                                createVNode(_component_a_button, {
                                                  size: "small",
                                                  onClick: ($event) => openLesson(m, item)
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Open")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"]),
                                                createVNode(_component_a_button, {
                                                  size: "small",
                                                  type: "text",
                                                  onClick: ($event) => quickAdd("assignment", m, item)
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("+ Assignment")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"])
                                              ]),
                                              default: withCtx(() => [
                                                createVNode(_component_a_space, { align: "center" }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_checkbox, {
                                                      checked: item.done,
                                                      onChange: ($event) => toggleLesson(m, item)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode("span", {
                                                          class: { done: item.done }
                                                        }, toDisplayString(item.title), 3)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["checked", "onChange"]),
                                                    item.type ? (openBlock(), createBlock(_component_a_tag, {
                                                      key: 0,
                                                      color: "geekblue"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(item.type), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024)) : createCommentVNode("", true)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1032, ["data-source"])
                                      ]),
                                      _: 2
                                    }, 1032, ["header"]);
                                  }), 128))
                                ]),
                                _: 1
                              })
                            ], 512), [
                              [vShow, active.value === "modules"]
                            ]),
                            withDirectives(createVNode("div", { class: "panel" }, [
                              createVNode("div", { class: "panel-head" }, [
                                createVNode(_component_a_typography_title, { level: 3 }, {
                                  default: withCtx(() => [
                                    createTextVNode("Assignments")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_segmented, {
                                      value: assignmentFilter.value,
                                      "onUpdate:value": ($event) => assignmentFilter.value = $event,
                                      options: ["All", "Open", "Closed"]
                                    }, null, 8, ["value", "onUpdate:value"]),
                                    createVNode(_component_a_input_search, {
                                      value: assignmentSearch.value,
                                      "onUpdate:value": ($event) => assignmentSearch.value = $event,
                                      placeholder: "Search assignments",
                                      "allow-clear": ""
                                    }, null, 8, ["value", "onUpdate:value"]),
                                    createVNode(_component_a_button, {
                                      type: "primary",
                                      onClick: ($event) => openAssignmentEditor()
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("New")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              createVNode(_component_a_table, {
                                columns: assignmentCols,
                                "data-source": filteredAssignments.value,
                                "row-key": "id",
                                pagination: { pageSize: 8 },
                                size: "middle"
                              }, {
                                bodyCell: withCtx(({ column, record }) => [
                                  column.key === "title" ? (openBlock(), createBlock(_component_a_space, { key: 0 }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_badge, {
                                        status: record.status === "open" ? "processing" : "default"
                                      }, null, 8, ["status"]),
                                      createVNode(_component_a_typography_link, {
                                        onClick: ($event) => openAssignment(record)
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(record.title), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["onClick"])
                                    ]),
                                    _: 2
                                  }, 1024)) : column.key === "due" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                    createTextVNode(toDisplayString(formatDate(record.due)), 1)
                                  ], 64)) : column.key === "points" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                    createTextVNode(toDisplayString(record.points), 1)
                                  ], 64)) : column.key === "actions" ? (openBlock(), createBlock(_component_a_space, { key: 3 }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_button, {
                                        size: "small",
                                        onClick: ($event) => openAssignment(record)
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("View")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"]),
                                      createVNode(_component_a_button, {
                                        size: "small",
                                        onClick: ($event) => openAssignmentEditor(record)
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Edit")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"]),
                                      createVNode(_component_a_popconfirm, {
                                        title: "Delete assignment?",
                                        onConfirm: ($event) => removeAssignment(record)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_button, {
                                            size: "small",
                                            danger: ""
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Delete")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["onConfirm"])
                                    ]),
                                    _: 2
                                  }, 1024)) : createCommentVNode("", true)
                                ]),
                                _: 1
                              }, 8, ["data-source"])
                            ], 512), [
                              [vShow, active.value === "assignments"]
                            ]),
                            withDirectives(createVNode("div", { class: "panel" }, [
                              createVNode("div", { class: "panel-head" }, [
                                createVNode(_component_a_typography_title, { level: 3 }, {
                                  default: withCtx(() => [
                                    createTextVNode("Quizzes")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_button, {
                                  type: "primary",
                                  onClick: createQuiz
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("New Quiz")
                                  ]),
                                  _: 1
                                })
                              ]),
                              createVNode(_component_a_table, {
                                columns: quizCols,
                                "data-source": quizzes.value,
                                "row-key": "id",
                                pagination: { pageSize: 8 },
                                size: "middle"
                              }, null, 8, ["data-source"])
                            ], 512), [
                              [vShow, active.value === "quizzes"]
                            ]),
                            withDirectives(createVNode("div", { class: "panel" }, [
                              createVNode("div", { class: "panel-head" }, [
                                createVNode(_component_a_typography_title, { level: 3 }, {
                                  default: withCtx(() => [
                                    createTextVNode("Discussions")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_input_search, {
                                      value: discussionSearch.value,
                                      "onUpdate:value": ($event) => discussionSearch.value = $event,
                                      placeholder: "Search topics"
                                    }, null, 8, ["value", "onUpdate:value"]),
                                    createVNode(_component_a_button, {
                                      onClick: ($event) => openDiscussionEditor()
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("New Topic")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              createVNode(_component_a_list, {
                                "data-source": filteredDiscussions.value,
                                "item-layout": "horizontal"
                              }, {
                                renderItem: withCtx(({ item }) => [
                                  createVNode(_component_a_list_item, null, {
                                    actions: withCtx(() => [
                                      createVNode(_component_a_button, {
                                        size: "small",
                                        onClick: ($event) => openDiscussion(item)
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Open")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ]),
                                    default: withCtx(() => [
                                      createVNode(_component_a_list_item_meta, {
                                        title: item.title,
                                        description: `${item.posts.length} posts • last active ${formatDate(item.updatedAt)}`
                                      }, null, 8, ["title", "description"])
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 1
                              }, 8, ["data-source"])
                            ], 512), [
                              [vShow, active.value === "discussions"]
                            ]),
                            withDirectives(createVNode("div", { class: "panel" }, [
                              createVNode("div", { class: "panel-head" }, [
                                createVNode(_component_a_typography_title, { level: 3 }, {
                                  default: withCtx(() => [
                                    createTextVNode("Files")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_select, {
                                      value: fileType.value,
                                      "onUpdate:value": ($event) => fileType.value = $event,
                                      style: { "min-width": "140px" }
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_select_option, { value: "all" }, {
                                          default: withCtx(() => [
                                            createTextVNode("All types")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_select_option, { value: "pdf" }, {
                                          default: withCtx(() => [
                                            createTextVNode("PDF")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_select_option, { value: "video" }, {
                                          default: withCtx(() => [
                                            createTextVNode("Video")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_select_option, { value: "doc" }, {
                                          default: withCtx(() => [
                                            createTextVNode("Documents")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }, 8, ["value", "onUpdate:value"]),
                                    createVNode(_component_a_input_search, {
                                      value: fileSearch.value,
                                      "onUpdate:value": ($event) => fileSearch.value = $event,
                                      placeholder: "Search files"
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              createVNode(_component_a_upload_dragger, {
                                "before-upload": handleBeforeUpload,
                                "show-upload-list": false,
                                multiple: ""
                              }, {
                                default: withCtx(() => [
                                  createVNode("p", { class: "ant-upload-drag-icon" }, [
                                    createVNode(unref(InboxOutlined))
                                  ]),
                                  createVNode("p", { class: "ant-upload-text" }, "Click or drag files to upload"),
                                  createVNode("p", { class: "ant-upload-hint" }, "Mock upload adds entries locally.")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_list, {
                                class: "mt16",
                                "data-source": filteredFiles.value,
                                grid: "{ gutter: 16, column: 3 }"
                              }, {
                                renderItem: withCtx(({ item }) => [
                                  createVNode(_component_a_list_item, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_card, {
                                        title: item.name,
                                        extra: item.type.toUpperCase()
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_space, {
                                            direction: "vertical",
                                            style: { "width": "100%" }
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "muted" }, "Added " + toDisplayString(formatDate(item.date)), 1),
                                              createVNode(_component_a_space, null, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_button, {
                                                    size: "small",
                                                    type: "link"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Open")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(_component_a_popconfirm, {
                                                    title: "Remove file?",
                                                    onConfirm: ($event) => removeFile(item)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_button, {
                                                        size: "small",
                                                        danger: ""
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Delete")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onConfirm"])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1032, ["title", "extra"])
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 1
                              }, 8, ["data-source"])
                            ], 512), [
                              [vShow, active.value === "files"]
                            ]),
                            withDirectives(createVNode("div", { class: "panel" }, [
                              createVNode("div", { class: "panel-head" }, [
                                createVNode(_component_a_typography_title, { level: 3 }, {
                                  default: withCtx(() => [
                                    createTextVNode("Participants")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_input_search, {
                                      value: participantSearch.value,
                                      "onUpdate:value": ($event) => participantSearch.value = $event,
                                      placeholder: "Search participants"
                                    }, null, 8, ["value", "onUpdate:value"]),
                                    createVNode(_component_a_select, {
                                      value: roleFilter.value,
                                      "onUpdate:value": ($event) => roleFilter.value = $event,
                                      style: { "min-width": "140px" }
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_select_option, { value: "all" }, {
                                          default: withCtx(() => [
                                            createTextVNode("All roles")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_select_option, { value: "student" }, {
                                          default: withCtx(() => [
                                            createTextVNode("Students")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_select_option, { value: "ta" }, {
                                          default: withCtx(() => [
                                            createTextVNode("TAs")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              createVNode(_component_a_table, {
                                columns: participantCols,
                                "data-source": filteredParticipants.value,
                                "row-key": "id",
                                pagination: { pageSize: 10 },
                                size: "middle"
                              }, null, 8, ["data-source"])
                            ], 512), [
                              [vShow, active.value === "participants"]
                            ]),
                            withDirectives(createVNode("div", { class: "panel" }, [
                              createVNode("div", { class: "panel-head" }, [
                                createVNode(_component_a_typography_title, { level: 3 }, {
                                  default: withCtx(() => [
                                    createTextVNode("Gradebook")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_select, {
                                      value: selectedStudent.value,
                                      "onUpdate:value": ($event) => selectedStudent.value = $event,
                                      style: { "min-width": "220px" },
                                      "allow-clear": "",
                                      placeholder: "Filter by student"
                                    }, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(participants.value, (p) => {
                                          return openBlock(), createBlock(_component_a_select_option, {
                                            key: p.id,
                                            value: p.name
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(p.name), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["value"]);
                                        }), 128))
                                      ]),
                                      _: 1
                                    }, 8, ["value", "onUpdate:value"]),
                                    createVNode(_component_a_button, { onClick: exportGrades }, {
                                      default: withCtx(() => [
                                        createTextVNode("Export CSV")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              createVNode(_component_a_table, {
                                columns: gradeCols,
                                "data-source": filteredGrades.value,
                                "row-key": "id",
                                pagination: { pageSize: 10 },
                                size: "middle"
                              }, null, 8, ["data-source"])
                            ], 512), [
                              [vShow, active.value === "grades"]
                            ]),
                            withDirectives(createVNode("div", { class: "panel" }, [
                              createVNode(_component_a_row, { gutter: [16, 16] }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_col, {
                                    xs: 24,
                                    md: 16
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_card, { title: "Course calendar" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_calendar, null, {
                                            dateCellRender: withCtx(({ current }) => [
                                              createVNode("ul", { class: "events" }, [
                                                (openBlock(true), createBlock(Fragment, null, renderList(eventsOn(current.toDate()), (e) => {
                                                  return openBlock(), createBlock("li", {
                                                    key: e.id
                                                  }, [
                                                    createVNode(_component_a_badge, {
                                                      status: e.type === "assignment" ? "processing" : "default",
                                                      text: e.title
                                                    }, null, 8, ["status", "text"])
                                                  ]);
                                                }), 128))
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
                                  createVNode(_component_a_col, {
                                    xs: 24,
                                    md: 8
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_card, { title: "Upcoming" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_list, { "data-source": upcoming.value }, {
                                            renderItem: withCtx(({ item }) => [
                                              createVNode(_component_a_list_item, null, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_list_item_meta, {
                                                    title: item.title,
                                                    description: formatDate(item.due)
                                                  }, null, 8, ["title", "description"])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 1
                                          }, 8, ["data-source"])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ], 512), [
                              [vShow, active.value === "calendar"]
                            ]),
                            withDirectives(createVNode("div", { class: "panel" }, [
                              createVNode(_component_a_row, { gutter: [16, 16] }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_col, {
                                    xs: 24,
                                    md: 8
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_card, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_statistic, {
                                            title: "Average grade",
                                            value: avgGrade.value,
                                            suffix: "%"
                                          }, null, 8, ["value"])
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
                                      createVNode(_component_a_card, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_statistic, {
                                            title: "Submission rate",
                                            value: submissionRate.value,
                                            suffix: "%"
                                          }, null, 8, ["value"])
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
                                      createVNode(_component_a_card, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_statistic, {
                                            title: "Active discussions",
                                            value: discussions.value.length
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
                                class: "mt16",
                                title: "Completion by module"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_list, { "data-source": modules.value }, {
                                    renderItem: withCtx(({ item }) => [
                                      createVNode(_component_a_list_item, null, {
                                        default: withCtx(() => [
                                          createVNode("div", { class: "grow" }, [
                                            createVNode("div", { class: "bold" }, toDisplayString(item.title), 1),
                                            createVNode(_component_a_progress, {
                                              percent: Math.round(item.lessons.filter((l) => l.done).length / item.lessons.length * 100)
                                            }, null, 8, ["percent"])
                                          ])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 1
                                  }, 8, ["data-source"])
                                ]),
                                _: 1
                              })
                            ], 512), [
                              [vShow, active.value === "analytics"]
                            ]),
                            withDirectives(createVNode("div", { class: "panel" }, [
                              createVNode(_component_a_form, {
                                layout: "vertical",
                                model: course
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_form_item, { label: "Course title" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_input, {
                                        value: course.title,
                                        "onUpdate:value": ($event) => course.title = $event
                                      }, null, 8, ["value", "onUpdate:value"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_form_item, { label: "Term" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_input, {
                                        value: course.term,
                                        "onUpdate:value": ($event) => course.term = $event
                                      }, null, 8, ["value", "onUpdate:value"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_form_item, { label: "Description" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_textarea, {
                                        value: course.description,
                                        "onUpdate:value": ($event) => course.description = $event,
                                        rows: 5
                                      }, null, 8, ["value", "onUpdate:value"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_space, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        onClick: saveCourse
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Save changes")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_button, { onClick: resetCourse }, {
                                        default: withCtx(() => [
                                          createTextVNode("Reset")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["model"])
                            ], 512), [
                              [vShow, active.value === "settings"]
                            ])
                          ]),
                          _: 1
                        }, 8, ["spinning"])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_drawer, {
              open: assignmentEditor.open,
              "onUpdate:open": ($event) => assignmentEditor.open = $event,
              width: "520",
              title: assignmentEditor.mode === "create" ? "New assignment" : "Edit assignment"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_form, {
                    layout: "vertical",
                    onFinish: saveAssignment,
                    model: assignmentEditor.data
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_form_item, {
                          label: "Title",
                          required: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_input, {
                                value: assignmentEditor.data.title,
                                "onUpdate:value": ($event) => assignmentEditor.data.title = $event
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_input, {
                                  value: assignmentEditor.data.title,
                                  "onUpdate:value": ($event) => assignmentEditor.data.title = $event
                                }, null, 8, ["value", "onUpdate:value"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_form_item, { label: "Due date" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_date_picker, {
                                value: assignmentEditor.data.due,
                                "onUpdate:value": ($event) => assignmentEditor.data.due = $event,
                                style: { "width": "100%" }
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_date_picker, {
                                  value: assignmentEditor.data.due,
                                  "onUpdate:value": ($event) => assignmentEditor.data.due = $event,
                                  style: { "width": "100%" }
                                }, null, 8, ["value", "onUpdate:value"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_form_item, { label: "Points" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_input_number, {
                                value: assignmentEditor.data.points,
                                "onUpdate:value": ($event) => assignmentEditor.data.points = $event,
                                min: 0,
                                style: { "width": "100%" }
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_input_number, {
                                  value: assignmentEditor.data.points,
                                  "onUpdate:value": ($event) => assignmentEditor.data.points = $event,
                                  min: 0,
                                  style: { "width": "100%" }
                                }, null, 8, ["value", "onUpdate:value"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_form_item, { label: "Status" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_select, {
                                value: assignmentEditor.data.status,
                                "onUpdate:value": ($event) => assignmentEditor.data.status = $event
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_select_option, { value: "open" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Open`);
                                        } else {
                                          return [
                                            createTextVNode("Open")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(_component_a_select_option, { value: "closed" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Closed`);
                                        } else {
                                          return [
                                            createTextVNode("Closed")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_select_option, { value: "open" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Open")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_select_option, { value: "closed" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Closed")
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
                                createVNode(_component_a_select, {
                                  value: assignmentEditor.data.status,
                                  "onUpdate:value": ($event) => assignmentEditor.data.status = $event
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_select_option, { value: "open" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Open")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_select_option, { value: "closed" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Closed")
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
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_form_item, { label: "Instructions" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_textarea, {
                                value: assignmentEditor.data.body,
                                "onUpdate:value": ($event) => assignmentEditor.data.body = $event,
                                rows: 6
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_textarea, {
                                  value: assignmentEditor.data.body,
                                  "onUpdate:value": ($event) => assignmentEditor.data.body = $event,
                                  rows: 6
                                }, null, 8, ["value", "onUpdate:value"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_space, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_a_button, {
                                type: "primary",
                                "html-type": "submit"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Save`);
                                  } else {
                                    return [
                                      createTextVNode("Save")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_button, {
                                onClick: ($event) => assignmentEditor.open = false
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Cancel`);
                                  } else {
                                    return [
                                      createTextVNode("Cancel")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_a_button, {
                                  type: "primary",
                                  "html-type": "submit"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Save")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_button, {
                                  onClick: ($event) => assignmentEditor.open = false
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Cancel")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_a_form_item, {
                            label: "Title",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_input, {
                                value: assignmentEditor.data.title,
                                "onUpdate:value": ($event) => assignmentEditor.data.title = $event
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_form_item, { label: "Due date" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_date_picker, {
                                value: assignmentEditor.data.due,
                                "onUpdate:value": ($event) => assignmentEditor.data.due = $event,
                                style: { "width": "100%" }
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_form_item, { label: "Points" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_input_number, {
                                value: assignmentEditor.data.points,
                                "onUpdate:value": ($event) => assignmentEditor.data.points = $event,
                                min: 0,
                                style: { "width": "100%" }
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_form_item, { label: "Status" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_select, {
                                value: assignmentEditor.data.status,
                                "onUpdate:value": ($event) => assignmentEditor.data.status = $event
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_select_option, { value: "open" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Open")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_select_option, { value: "closed" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Closed")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_form_item, { label: "Instructions" }, {
                            default: withCtx(() => [
                              createVNode(_component_a_textarea, {
                                value: assignmentEditor.data.body,
                                "onUpdate:value": ($event) => assignmentEditor.data.body = $event,
                                rows: 6
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_space, null, {
                            default: withCtx(() => [
                              createVNode(_component_a_button, {
                                type: "primary",
                                "html-type": "submit"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Save")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_button, {
                                onClick: ($event) => assignmentEditor.open = false
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Cancel")
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_a_form, {
                      layout: "vertical",
                      onFinish: saveAssignment,
                      model: assignmentEditor.data
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_form_item, {
                          label: "Title",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_input, {
                              value: assignmentEditor.data.title,
                              "onUpdate:value": ($event) => assignmentEditor.data.title = $event
                            }, null, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_form_item, { label: "Due date" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_date_picker, {
                              value: assignmentEditor.data.due,
                              "onUpdate:value": ($event) => assignmentEditor.data.due = $event,
                              style: { "width": "100%" }
                            }, null, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_form_item, { label: "Points" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_input_number, {
                              value: assignmentEditor.data.points,
                              "onUpdate:value": ($event) => assignmentEditor.data.points = $event,
                              min: 0,
                              style: { "width": "100%" }
                            }, null, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_form_item, { label: "Status" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_select, {
                              value: assignmentEditor.data.status,
                              "onUpdate:value": ($event) => assignmentEditor.data.status = $event
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_select_option, { value: "open" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Open")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_select_option, { value: "closed" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Closed")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_form_item, { label: "Instructions" }, {
                          default: withCtx(() => [
                            createVNode(_component_a_textarea, {
                              value: assignmentEditor.data.body,
                              "onUpdate:value": ($event) => assignmentEditor.data.body = $event,
                              rows: 6
                            }, null, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_space, null, {
                          default: withCtx(() => [
                            createVNode(_component_a_button, {
                              type: "primary",
                              "html-type": "submit"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Save")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_button, {
                              onClick: ($event) => assignmentEditor.open = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Cancel")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
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
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_a_modal, {
              open: detail.open,
              "onUpdate:open": ($event) => detail.open = $event,
              title: detail.title,
              width: "720",
              onCancel: ($event) => detail.open = false,
              footer: null
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (detail.type === "assignment") {
                    _push3(`<div data-v-1f1dc1e1${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_a_descriptions, {
                      bordered: "",
                      size: "small",
                      column: 1
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_descriptions_item, { label: "Title" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(detail.item.title)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(detail.item.title), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_descriptions_item, { label: "Due" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(formatDate(detail.item.due))}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(formatDate(detail.item.due)), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_descriptions_item, { label: "Points" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(detail.item.points)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(detail.item.points), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_descriptions_item, { label: "Status" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(detail.item.status)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(detail.item.status), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_descriptions_item, { label: "Instructions" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<div class="pre" data-v-1f1dc1e1${_scopeId4}>${ssrInterpolate(detail.item.body || "—")}</div>`);
                              } else {
                                return [
                                  createVNode("div", { class: "pre" }, toDisplayString(detail.item.body || "—"), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_descriptions_item, { label: "Title" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(detail.item.title), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_descriptions_item, { label: "Due" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(formatDate(detail.item.due)), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_descriptions_item, { label: "Points" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(detail.item.points), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_descriptions_item, { label: "Status" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(detail.item.status), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_descriptions_item, { label: "Instructions" }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "pre" }, toDisplayString(detail.item.body || "—"), 1)
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else if (detail.type === "announcement") {
                    _push3(`<div data-v-1f1dc1e1${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_a_typography_title, { level: 4 }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(detail.item.title)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(detail.item.title), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="muted" data-v-1f1dc1e1${_scopeId2}>${ssrInterpolate(formatDate(detail.item.date))}</div>`);
                    _push3(ssrRenderComponent(_component_a_typography_paragraph, { class: "mt8" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(detail.item.body)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(detail.item.body), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else if (detail.type === "discussion") {
                    _push3(`<div data-v-1f1dc1e1${_scopeId2}><!--[-->`);
                    ssrRenderList(detail.item.posts, (p) => {
                      _push3(ssrRenderComponent(_component_a_comment, {
                        key: p.id,
                        author: p.author,
                        content: p.body
                      }, null, _parent3, _scopeId2));
                    });
                    _push3(`<!--]--></div>`);
                  } else {
                    _push3(`<div data-v-1f1dc1e1${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_a_empty, null, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  }
                } else {
                  return [
                    detail.type === "assignment" ? (openBlock(), createBlock("div", { key: 0 }, [
                      createVNode(_component_a_descriptions, {
                        bordered: "",
                        size: "small",
                        column: 1
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_descriptions_item, { label: "Title" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(detail.item.title), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_descriptions_item, { label: "Due" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(formatDate(detail.item.due)), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_descriptions_item, { label: "Points" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(detail.item.points), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_descriptions_item, { label: "Status" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(detail.item.status), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_descriptions_item, { label: "Instructions" }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "pre" }, toDisplayString(detail.item.body || "—"), 1)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ])) : detail.type === "announcement" ? (openBlock(), createBlock("div", { key: 1 }, [
                      createVNode(_component_a_typography_title, { level: 4 }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(detail.item.title), 1)
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "muted" }, toDisplayString(formatDate(detail.item.date)), 1),
                      createVNode(_component_a_typography_paragraph, { class: "mt8" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(detail.item.body), 1)
                        ]),
                        _: 1
                      })
                    ])) : detail.type === "discussion" ? (openBlock(), createBlock("div", { key: 2 }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(detail.item.posts, (p) => {
                        return openBlock(), createBlock(_component_a_comment, {
                          key: p.id,
                          author: p.author,
                          content: p.body
                        }, null, 8, ["author", "content"]);
                      }), 128))
                    ])) : (openBlock(), createBlock("div", { key: 3 }, [
                      createVNode(_component_a_empty)
                    ]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_a_layout_sider, {
                collapsible: "",
                collapsed: siderCollapsed.value,
                "onUpdate:collapsed": ($event) => siderCollapsed.value = $event,
                width: 260,
                class: "sider"
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "sider-head" }, [
                    createVNode(_component_a_avatar, {
                      src: course.avatar,
                      shape: "square",
                      size: 46
                    }, null, 8, ["src"]),
                    withDirectives(createVNode("div", { class: "sider-title" }, [
                      createVNode("div", { class: "name" }, toDisplayString(course.title), 1),
                      createVNode("div", { class: "muted" }, toDisplayString(course.instructor.name), 1)
                    ], 512), [
                      [vShow, !siderCollapsed.value]
                    ])
                  ]),
                  createVNode(_component_a_menu, {
                    mode: "inline",
                    selectedKeys: [active.value],
                    onClick: onMenu,
                    "inline-collapsed": siderCollapsed.value
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_menu_item, { key: "overview" }, {
                        icon: withCtx(() => [
                          createVNode(unref(DashboardOutlined))
                        ]),
                        default: withCtx(() => [
                          createTextVNode(" Overview ")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_menu_item, { key: "modules" }, {
                        icon: withCtx(() => [
                          createVNode(unref(BookOutlined))
                        ]),
                        default: withCtx(() => [
                          createTextVNode(" Modules ")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_menu_item, { key: "assignments" }, {
                        icon: withCtx(() => [
                          createVNode(unref(FileTextOutlined))
                        ]),
                        default: withCtx(() => [
                          createTextVNode(" Assignments ")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_menu_item, { key: "quizzes" }, {
                        icon: withCtx(() => [
                          createVNode(unref(ExperimentOutlined))
                        ]),
                        default: withCtx(() => [
                          createTextVNode(" Quizzes ")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_menu_item, { key: "discussions" }, {
                        icon: withCtx(() => [
                          createVNode(unref(MessageOutlined))
                        ]),
                        default: withCtx(() => [
                          createTextVNode(" Discussions ")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_menu_item, { key: "files" }, {
                        icon: withCtx(() => [
                          createVNode(unref(PaperClipOutlined))
                        ]),
                        default: withCtx(() => [
                          createTextVNode(" Files ")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_menu_item, { key: "participants" }, {
                        icon: withCtx(() => [
                          createVNode(unref(TeamOutlined))
                        ]),
                        default: withCtx(() => [
                          createTextVNode(" Participants ")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_menu_item, { key: "grades" }, {
                        icon: withCtx(() => [
                          createVNode(unref(OrderedListOutlined))
                        ]),
                        default: withCtx(() => [
                          createTextVNode(" Gradebook ")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_menu_item, { key: "calendar" }, {
                        icon: withCtx(() => [
                          createVNode(unref(CalendarOutlined))
                        ]),
                        default: withCtx(() => [
                          createTextVNode(" Calendar ")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_menu_item, { key: "analytics" }, {
                        icon: withCtx(() => [
                          createVNode(unref(BarChartOutlined))
                        ]),
                        default: withCtx(() => [
                          createTextVNode(" Analytics ")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_menu_item, { key: "settings" }, {
                        icon: withCtx(() => [
                          createVNode(unref(SettingOutlined))
                        ]),
                        default: withCtx(() => [
                          createTextVNode(" Settings ")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["selectedKeys", "inline-collapsed"])
                ]),
                _: 1
              }, 8, ["collapsed", "onUpdate:collapsed"]),
              createVNode(_component_a_layout, null, {
                default: withCtx(() => [
                  createVNode(_component_a_layout_header, { class: "topbar" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_page_header, {
                        title: course.title,
                        "sub-title": `${course.term} • ${course.instructor.name}`,
                        ghost: ""
                      }, {
                        extra: withCtx(() => [
                          createVNode(_component_a_segmented, {
                            options: ["Student view", "Instructor view"],
                            value: viewMode.value,
                            "onUpdate:value": ($event) => viewMode.value = $event,
                            size: "small"
                          }, null, 8, ["value", "onUpdate:value"]),
                          createVNode(_component_a_button, {
                            type: "default",
                            onClick: toggleEnroll
                          }, {
                            icon: withCtx(() => [
                              (openBlock(), createBlock(resolveDynamicComponent(enrolled.value ? unref(CheckCircleOutlined) : unref(PlusOutlined))))
                            ]),
                            default: withCtx(() => [
                              createTextVNode(" " + toDisplayString(enrolled.value ? "Enrolled" : "Join Course"), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_dropdown, null, {
                            overlay: withCtx(() => [
                              createVNode(_component_a_menu, null, {
                                default: withCtx(() => [
                                  createVNode(_component_a_menu_item, {
                                    onClick: ($event) => openAnnouncementEditor()
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("New announcement")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"]),
                                  createVNode(_component_a_menu_item, {
                                    onClick: ($event) => openAssignmentEditor()
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("New assignment")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"]),
                                  createVNode(_component_a_menu_item, {
                                    onClick: ($event) => openModuleCreator()
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("New module")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"])
                                ]),
                                _: 1
                              })
                            ]),
                            default: withCtx(() => [
                              createVNode(_component_a_button, null, {
                                default: withCtx(() => [
                                  createTextVNode(" Actions "),
                                  createVNode(unref(DownOutlined))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["title", "sub-title"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_a_layout_content, { class: "content" }, {
                    default: withCtx(() => [
                      createVNode(_component_a_spin, { spinning: loading.value }, {
                        default: withCtx(() => [
                          withDirectives(createVNode("div", { class: "panel" }, [
                            createVNode(_component_a_row, { gutter: [16, 16] }, {
                              default: withCtx(() => [
                                createVNode(_component_a_col, {
                                  xs: 24,
                                  md: 10
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, { title: "Progress" }, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "stack-8" }, [
                                          createVNode(_component_a_progress, {
                                            percent: progressPercent.value,
                                            status: "active"
                                          }, null, 8, ["percent"]),
                                          createVNode("div", { class: "muted" }, toDisplayString(completedLessons.value) + " / " + toDisplayString(totalLessons.value) + " lessons complete ", 1),
                                          createVNode(_component_a_space, { wrap: "" }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_tag, { color: "blue" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Activities: " + toDisplayString(assignments.value.length), 1)
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_tag, { color: "cyan" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Quizzes: " + toDisplayString(quizzes.value.length), 1)
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_tag, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Files: " + toDisplayString(files.value.length), 1)
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
                                    createVNode(_component_a_card, {
                                      title: "Upcoming deadlines",
                                      class: "mt16"
                                    }, {
                                      default: withCtx(() => [
                                        upcoming.value.length ? (openBlock(), createBlock(_component_a_list, {
                                          key: 0,
                                          "data-source": upcoming.value,
                                          renderItem: _ctx.renderUpcoming
                                        }, null, 8, ["data-source", "renderItem"])) : (openBlock(), createBlock(_component_a_empty, {
                                          key: 1,
                                          description: "No upcoming items"
                                        }))
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_col, {
                                  xs: 24,
                                  md: 14
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, {
                                      title: "Recent announcements",
                                      extra: unref(overviewExtra)
                                    }, {
                                      default: withCtx(() => [
                                        announcements.value.length ? (openBlock(), createBlock(_component_a_list, {
                                          key: 0,
                                          "data-source": announcements.value.slice(0, 5)
                                        }, {
                                          renderItem: withCtx(({ item }) => [
                                            createVNode(_component_a_list_item, null, {
                                              actions: withCtx(() => [
                                                createVNode(_component_a_button, {
                                                  size: "small",
                                                  onClick: ($event) => openAnnouncement(item)
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Open")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"])
                                              ]),
                                              default: withCtx(() => [
                                                createVNode(_component_a_list_item_meta, {
                                                  title: item.title,
                                                  description: formatDate(item.date)
                                                }, null, 8, ["title", "description"])
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 1
                                        }, 8, ["data-source"])) : (openBlock(), createBlock(_component_a_empty, {
                                          key: 1,
                                          description: "Nothing yet"
                                        }))
                                      ]),
                                      _: 1
                                    }, 8, ["extra"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ], 512), [
                            [vShow, active.value === "overview"]
                          ]),
                          withDirectives(createVNode("div", { class: "panel" }, [
                            createVNode("div", { class: "panel-head" }, [
                              createVNode(_component_a_typography_title, { level: 3 }, {
                                default: withCtx(() => [
                                  createTextVNode("Modules")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_space, null, {
                                default: withCtx(() => [
                                  createVNode(_component_a_input_search, {
                                    value: moduleSearch.value,
                                    "onUpdate:value": ($event) => moduleSearch.value = $event,
                                    placeholder: "Search modules/lessons"
                                  }, null, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_button, {
                                    type: "primary",
                                    onClick: openModuleCreator
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("New Module")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            createVNode(_component_a_collapse, { accordion: "" }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(filteredModules.value, (m) => {
                                  return openBlock(), createBlock(_component_a_collapse_panel, {
                                    key: m.id,
                                    header: `${m.title} • ${m.lessons.length} lessons`
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_list, {
                                        "data-source": m.lessons
                                      }, {
                                        renderItem: withCtx(({ item }) => [
                                          createVNode(_component_a_list_item, null, {
                                            actions: withCtx(() => [
                                              createVNode(_component_a_button, {
                                                size: "small",
                                                onClick: ($event) => openLesson(m, item)
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Open")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"]),
                                              createVNode(_component_a_button, {
                                                size: "small",
                                                type: "text",
                                                onClick: ($event) => quickAdd("assignment", m, item)
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("+ Assignment")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"])
                                            ]),
                                            default: withCtx(() => [
                                              createVNode(_component_a_space, { align: "center" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_checkbox, {
                                                    checked: item.done,
                                                    onChange: ($event) => toggleLesson(m, item)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode("span", {
                                                        class: { done: item.done }
                                                      }, toDisplayString(item.title), 3)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["checked", "onChange"]),
                                                  item.type ? (openBlock(), createBlock(_component_a_tag, {
                                                    key: 0,
                                                    color: "geekblue"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(item.type), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024)) : createCommentVNode("", true)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1032, ["data-source"])
                                    ]),
                                    _: 2
                                  }, 1032, ["header"]);
                                }), 128))
                              ]),
                              _: 1
                            })
                          ], 512), [
                            [vShow, active.value === "modules"]
                          ]),
                          withDirectives(createVNode("div", { class: "panel" }, [
                            createVNode("div", { class: "panel-head" }, [
                              createVNode(_component_a_typography_title, { level: 3 }, {
                                default: withCtx(() => [
                                  createTextVNode("Assignments")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_space, null, {
                                default: withCtx(() => [
                                  createVNode(_component_a_segmented, {
                                    value: assignmentFilter.value,
                                    "onUpdate:value": ($event) => assignmentFilter.value = $event,
                                    options: ["All", "Open", "Closed"]
                                  }, null, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_input_search, {
                                    value: assignmentSearch.value,
                                    "onUpdate:value": ($event) => assignmentSearch.value = $event,
                                    placeholder: "Search assignments",
                                    "allow-clear": ""
                                  }, null, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_button, {
                                    type: "primary",
                                    onClick: ($event) => openAssignmentEditor()
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("New")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"])
                                ]),
                                _: 1
                              })
                            ]),
                            createVNode(_component_a_table, {
                              columns: assignmentCols,
                              "data-source": filteredAssignments.value,
                              "row-key": "id",
                              pagination: { pageSize: 8 },
                              size: "middle"
                            }, {
                              bodyCell: withCtx(({ column, record }) => [
                                column.key === "title" ? (openBlock(), createBlock(_component_a_space, { key: 0 }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_badge, {
                                      status: record.status === "open" ? "processing" : "default"
                                    }, null, 8, ["status"]),
                                    createVNode(_component_a_typography_link, {
                                      onClick: ($event) => openAssignment(record)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(record.title), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick"])
                                  ]),
                                  _: 2
                                }, 1024)) : column.key === "due" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                  createTextVNode(toDisplayString(formatDate(record.due)), 1)
                                ], 64)) : column.key === "points" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                  createTextVNode(toDisplayString(record.points), 1)
                                ], 64)) : column.key === "actions" ? (openBlock(), createBlock(_component_a_space, { key: 3 }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      size: "small",
                                      onClick: ($event) => openAssignment(record)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("View")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"]),
                                    createVNode(_component_a_button, {
                                      size: "small",
                                      onClick: ($event) => openAssignmentEditor(record)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Edit")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"]),
                                    createVNode(_component_a_popconfirm, {
                                      title: "Delete assignment?",
                                      onConfirm: ($event) => removeAssignment(record)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_button, {
                                          size: "small",
                                          danger: ""
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Delete")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }, 8, ["onConfirm"])
                                  ]),
                                  _: 2
                                }, 1024)) : createCommentVNode("", true)
                              ]),
                              _: 1
                            }, 8, ["data-source"])
                          ], 512), [
                            [vShow, active.value === "assignments"]
                          ]),
                          withDirectives(createVNode("div", { class: "panel" }, [
                            createVNode("div", { class: "panel-head" }, [
                              createVNode(_component_a_typography_title, { level: 3 }, {
                                default: withCtx(() => [
                                  createTextVNode("Quizzes")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_button, {
                                type: "primary",
                                onClick: createQuiz
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("New Quiz")
                                ]),
                                _: 1
                              })
                            ]),
                            createVNode(_component_a_table, {
                              columns: quizCols,
                              "data-source": quizzes.value,
                              "row-key": "id",
                              pagination: { pageSize: 8 },
                              size: "middle"
                            }, null, 8, ["data-source"])
                          ], 512), [
                            [vShow, active.value === "quizzes"]
                          ]),
                          withDirectives(createVNode("div", { class: "panel" }, [
                            createVNode("div", { class: "panel-head" }, [
                              createVNode(_component_a_typography_title, { level: 3 }, {
                                default: withCtx(() => [
                                  createTextVNode("Discussions")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_space, null, {
                                default: withCtx(() => [
                                  createVNode(_component_a_input_search, {
                                    value: discussionSearch.value,
                                    "onUpdate:value": ($event) => discussionSearch.value = $event,
                                    placeholder: "Search topics"
                                  }, null, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_button, {
                                    onClick: ($event) => openDiscussionEditor()
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("New Topic")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"])
                                ]),
                                _: 1
                              })
                            ]),
                            createVNode(_component_a_list, {
                              "data-source": filteredDiscussions.value,
                              "item-layout": "horizontal"
                            }, {
                              renderItem: withCtx(({ item }) => [
                                createVNode(_component_a_list_item, null, {
                                  actions: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      size: "small",
                                      onClick: ($event) => openDiscussion(item)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Open")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])
                                  ]),
                                  default: withCtx(() => [
                                    createVNode(_component_a_list_item_meta, {
                                      title: item.title,
                                      description: `${item.posts.length} posts • last active ${formatDate(item.updatedAt)}`
                                    }, null, 8, ["title", "description"])
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 1
                            }, 8, ["data-source"])
                          ], 512), [
                            [vShow, active.value === "discussions"]
                          ]),
                          withDirectives(createVNode("div", { class: "panel" }, [
                            createVNode("div", { class: "panel-head" }, [
                              createVNode(_component_a_typography_title, { level: 3 }, {
                                default: withCtx(() => [
                                  createTextVNode("Files")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_space, null, {
                                default: withCtx(() => [
                                  createVNode(_component_a_select, {
                                    value: fileType.value,
                                    "onUpdate:value": ($event) => fileType.value = $event,
                                    style: { "min-width": "140px" }
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_select_option, { value: "all" }, {
                                        default: withCtx(() => [
                                          createTextVNode("All types")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_select_option, { value: "pdf" }, {
                                        default: withCtx(() => [
                                          createTextVNode("PDF")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_select_option, { value: "video" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Video")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_select_option, { value: "doc" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Documents")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_input_search, {
                                    value: fileSearch.value,
                                    "onUpdate:value": ($event) => fileSearch.value = $event,
                                    placeholder: "Search files"
                                  }, null, 8, ["value", "onUpdate:value"])
                                ]),
                                _: 1
                              })
                            ]),
                            createVNode(_component_a_upload_dragger, {
                              "before-upload": handleBeforeUpload,
                              "show-upload-list": false,
                              multiple: ""
                            }, {
                              default: withCtx(() => [
                                createVNode("p", { class: "ant-upload-drag-icon" }, [
                                  createVNode(unref(InboxOutlined))
                                ]),
                                createVNode("p", { class: "ant-upload-text" }, "Click or drag files to upload"),
                                createVNode("p", { class: "ant-upload-hint" }, "Mock upload adds entries locally.")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_list, {
                              class: "mt16",
                              "data-source": filteredFiles.value,
                              grid: "{ gutter: 16, column: 3 }"
                            }, {
                              renderItem: withCtx(({ item }) => [
                                createVNode(_component_a_list_item, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, {
                                      title: item.name,
                                      extra: item.type.toUpperCase()
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_space, {
                                          direction: "vertical",
                                          style: { "width": "100%" }
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "muted" }, "Added " + toDisplayString(formatDate(item.date)), 1),
                                            createVNode(_component_a_space, null, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_button, {
                                                  size: "small",
                                                  type: "link"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Open")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_popconfirm, {
                                                  title: "Remove file?",
                                                  onConfirm: ($event) => removeFile(item)
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_button, {
                                                      size: "small",
                                                      danger: ""
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Delete")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }, 8, ["onConfirm"])
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1032, ["title", "extra"])
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 1
                            }, 8, ["data-source"])
                          ], 512), [
                            [vShow, active.value === "files"]
                          ]),
                          withDirectives(createVNode("div", { class: "panel" }, [
                            createVNode("div", { class: "panel-head" }, [
                              createVNode(_component_a_typography_title, { level: 3 }, {
                                default: withCtx(() => [
                                  createTextVNode("Participants")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_space, null, {
                                default: withCtx(() => [
                                  createVNode(_component_a_input_search, {
                                    value: participantSearch.value,
                                    "onUpdate:value": ($event) => participantSearch.value = $event,
                                    placeholder: "Search participants"
                                  }, null, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_select, {
                                    value: roleFilter.value,
                                    "onUpdate:value": ($event) => roleFilter.value = $event,
                                    style: { "min-width": "140px" }
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_select_option, { value: "all" }, {
                                        default: withCtx(() => [
                                          createTextVNode("All roles")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_select_option, { value: "student" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Students")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_select_option, { value: "ta" }, {
                                        default: withCtx(() => [
                                          createTextVNode("TAs")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["value", "onUpdate:value"])
                                ]),
                                _: 1
                              })
                            ]),
                            createVNode(_component_a_table, {
                              columns: participantCols,
                              "data-source": filteredParticipants.value,
                              "row-key": "id",
                              pagination: { pageSize: 10 },
                              size: "middle"
                            }, null, 8, ["data-source"])
                          ], 512), [
                            [vShow, active.value === "participants"]
                          ]),
                          withDirectives(createVNode("div", { class: "panel" }, [
                            createVNode("div", { class: "panel-head" }, [
                              createVNode(_component_a_typography_title, { level: 3 }, {
                                default: withCtx(() => [
                                  createTextVNode("Gradebook")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_space, null, {
                                default: withCtx(() => [
                                  createVNode(_component_a_select, {
                                    value: selectedStudent.value,
                                    "onUpdate:value": ($event) => selectedStudent.value = $event,
                                    style: { "min-width": "220px" },
                                    "allow-clear": "",
                                    placeholder: "Filter by student"
                                  }, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(participants.value, (p) => {
                                        return openBlock(), createBlock(_component_a_select_option, {
                                          key: p.id,
                                          value: p.name
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(p.name), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["value"]);
                                      }), 128))
                                    ]),
                                    _: 1
                                  }, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_button, { onClick: exportGrades }, {
                                    default: withCtx(() => [
                                      createTextVNode("Export CSV")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            createVNode(_component_a_table, {
                              columns: gradeCols,
                              "data-source": filteredGrades.value,
                              "row-key": "id",
                              pagination: { pageSize: 10 },
                              size: "middle"
                            }, null, 8, ["data-source"])
                          ], 512), [
                            [vShow, active.value === "grades"]
                          ]),
                          withDirectives(createVNode("div", { class: "panel" }, [
                            createVNode(_component_a_row, { gutter: [16, 16] }, {
                              default: withCtx(() => [
                                createVNode(_component_a_col, {
                                  xs: 24,
                                  md: 16
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, { title: "Course calendar" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_calendar, null, {
                                          dateCellRender: withCtx(({ current }) => [
                                            createVNode("ul", { class: "events" }, [
                                              (openBlock(true), createBlock(Fragment, null, renderList(eventsOn(current.toDate()), (e) => {
                                                return openBlock(), createBlock("li", {
                                                  key: e.id
                                                }, [
                                                  createVNode(_component_a_badge, {
                                                    status: e.type === "assignment" ? "processing" : "default",
                                                    text: e.title
                                                  }, null, 8, ["status", "text"])
                                                ]);
                                              }), 128))
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
                                createVNode(_component_a_col, {
                                  xs: 24,
                                  md: 8
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, { title: "Upcoming" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_list, { "data-source": upcoming.value }, {
                                          renderItem: withCtx(({ item }) => [
                                            createVNode(_component_a_list_item, null, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_list_item_meta, {
                                                  title: item.title,
                                                  description: formatDate(item.due)
                                                }, null, 8, ["title", "description"])
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 1
                                        }, 8, ["data-source"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ], 512), [
                            [vShow, active.value === "calendar"]
                          ]),
                          withDirectives(createVNode("div", { class: "panel" }, [
                            createVNode(_component_a_row, { gutter: [16, 16] }, {
                              default: withCtx(() => [
                                createVNode(_component_a_col, {
                                  xs: 24,
                                  md: 8
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_card, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_statistic, {
                                          title: "Average grade",
                                          value: avgGrade.value,
                                          suffix: "%"
                                        }, null, 8, ["value"])
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
                                    createVNode(_component_a_card, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_statistic, {
                                          title: "Submission rate",
                                          value: submissionRate.value,
                                          suffix: "%"
                                        }, null, 8, ["value"])
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
                                    createVNode(_component_a_card, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_statistic, {
                                          title: "Active discussions",
                                          value: discussions.value.length
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
                              class: "mt16",
                              title: "Completion by module"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_list, { "data-source": modules.value }, {
                                  renderItem: withCtx(({ item }) => [
                                    createVNode(_component_a_list_item, null, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "grow" }, [
                                          createVNode("div", { class: "bold" }, toDisplayString(item.title), 1),
                                          createVNode(_component_a_progress, {
                                            percent: Math.round(item.lessons.filter((l) => l.done).length / item.lessons.length * 100)
                                          }, null, 8, ["percent"])
                                        ])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 1
                                }, 8, ["data-source"])
                              ]),
                              _: 1
                            })
                          ], 512), [
                            [vShow, active.value === "analytics"]
                          ]),
                          withDirectives(createVNode("div", { class: "panel" }, [
                            createVNode(_component_a_form, {
                              layout: "vertical",
                              model: course
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_form_item, { label: "Course title" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_input, {
                                      value: course.title,
                                      "onUpdate:value": ($event) => course.title = $event
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form_item, { label: "Term" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_input, {
                                      value: course.term,
                                      "onUpdate:value": ($event) => course.term = $event
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_form_item, { label: "Description" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_textarea, {
                                      value: course.description,
                                      "onUpdate:value": ($event) => course.description = $event,
                                      rows: 5
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      type: "primary",
                                      onClick: saveCourse
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Save changes")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_button, { onClick: resetCourse }, {
                                      default: withCtx(() => [
                                        createTextVNode("Reset")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["model"])
                          ], 512), [
                            [vShow, active.value === "settings"]
                          ])
                        ]),
                        _: 1
                      }, 8, ["spinning"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_a_drawer, {
                open: assignmentEditor.open,
                "onUpdate:open": ($event) => assignmentEditor.open = $event,
                width: "520",
                title: assignmentEditor.mode === "create" ? "New assignment" : "Edit assignment"
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_form, {
                    layout: "vertical",
                    onFinish: saveAssignment,
                    model: assignmentEditor.data
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_form_item, {
                        label: "Title",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_input, {
                            value: assignmentEditor.data.title,
                            "onUpdate:value": ($event) => assignmentEditor.data.title = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_form_item, { label: "Due date" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_date_picker, {
                            value: assignmentEditor.data.due,
                            "onUpdate:value": ($event) => assignmentEditor.data.due = $event,
                            style: { "width": "100%" }
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_form_item, { label: "Points" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_input_number, {
                            value: assignmentEditor.data.points,
                            "onUpdate:value": ($event) => assignmentEditor.data.points = $event,
                            min: 0,
                            style: { "width": "100%" }
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_form_item, { label: "Status" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_select, {
                            value: assignmentEditor.data.status,
                            "onUpdate:value": ($event) => assignmentEditor.data.status = $event
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_select_option, { value: "open" }, {
                                default: withCtx(() => [
                                  createTextVNode("Open")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_select_option, { value: "closed" }, {
                                default: withCtx(() => [
                                  createTextVNode("Closed")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_form_item, { label: "Instructions" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_textarea, {
                            value: assignmentEditor.data.body,
                            "onUpdate:value": ($event) => assignmentEditor.data.body = $event,
                            rows: 6
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_space, null, {
                        default: withCtx(() => [
                          createVNode(_component_a_button, {
                            type: "primary",
                            "html-type": "submit"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Save")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, {
                            onClick: ($event) => assignmentEditor.open = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["model"])
                ]),
                _: 1
              }, 8, ["open", "onUpdate:open", "title"]),
              createVNode(_component_a_modal, {
                open: detail.open,
                "onUpdate:open": ($event) => detail.open = $event,
                title: detail.title,
                width: "720",
                onCancel: ($event) => detail.open = false,
                footer: null
              }, {
                default: withCtx(() => [
                  detail.type === "assignment" ? (openBlock(), createBlock("div", { key: 0 }, [
                    createVNode(_component_a_descriptions, {
                      bordered: "",
                      size: "small",
                      column: 1
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_descriptions_item, { label: "Title" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(detail.item.title), 1)
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_descriptions_item, { label: "Due" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(formatDate(detail.item.due)), 1)
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_descriptions_item, { label: "Points" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(detail.item.points), 1)
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_descriptions_item, { label: "Status" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(detail.item.status), 1)
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_descriptions_item, { label: "Instructions" }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "pre" }, toDisplayString(detail.item.body || "—"), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ])) : detail.type === "announcement" ? (openBlock(), createBlock("div", { key: 1 }, [
                    createVNode(_component_a_typography_title, { level: 4 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(detail.item.title), 1)
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "muted" }, toDisplayString(formatDate(detail.item.date)), 1),
                    createVNode(_component_a_typography_paragraph, { class: "mt8" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(detail.item.body), 1)
                      ]),
                      _: 1
                    })
                  ])) : detail.type === "discussion" ? (openBlock(), createBlock("div", { key: 2 }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(detail.item.posts, (p) => {
                      return openBlock(), createBlock(_component_a_comment, {
                        key: p.id,
                        author: p.author,
                        content: p.body
                      }, null, 8, ["author", "content"]);
                    }), 128))
                  ])) : (openBlock(), createBlock("div", { key: 3 }, [
                    createVNode(_component_a_empty)
                  ]))
                ]),
                _: 1
              }, 8, ["open", "onUpdate:open", "title", "onCancel"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/course-platform/nuxt/pages/lab.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const lab = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1f1dc1e1"]]);

export { lab as default };
//# sourceMappingURL=lab-pf2dC7pS.mjs.map
