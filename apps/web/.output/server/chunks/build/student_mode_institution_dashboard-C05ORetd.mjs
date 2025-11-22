import { defineComponent, computed, ref, watch, resolveComponent, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { message } from 'ant-design-vue';
import { TeamOutlined, ClusterOutlined, DashboardOutlined, CheckCircleOutlined, ShoppingCartOutlined, ExperimentOutlined, UserOutlined, ReloadOutlined, ExclamationCircleOutlined, BookOutlined, CalendarOutlined } from '@ant-design/icons-vue';
import { _ as _export_sfc, d as useRoute, b as useRuntimeConfig } from './server.mjs';
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
  __name: "student_mode_institution_dashboard",
  __ssrInlineRender: true,
  props: {
    institutionId: {},
    institutionSlug: {},
    mode: {}
  },
  setup(__props) {
    const props = __props;
    const route = useRoute();
    const runtime = useRuntimeConfig();
    const apiBase = runtime.public?.apiBase || runtime.public?.appBaseUrl || "";
    const resolvedInstitutionId = computed(() => {
      return props.institutionId || route.params.institution_id || "inst_byway";
    });
    const loading = ref(true);
    const error = ref(null);
    const viewModel = ref(null);
    const activeTab = ref(
      "overview"
    );
    const showOnlyMyClassrooms = ref(true);
    const showOnlyOpenAssignments = ref(true);
    const focusedClassroomId = ref(null);
    const focusedCourseId = ref(null);
    const courseModules = ref([]);
    const progressMap = ref({});
    const loadingModules = ref(false);
    const discoverCourses = ref([]);
    const discoverQuery = ref("");
    function formatDate(input) {
      if (!input) return "—";
      const d = typeof input === "string" ? new Date(input) : input;
      if (Number.isNaN(d.getTime())) return "—";
      return d.toLocaleDateString(void 0, {
        year: "numeric",
        month: "short",
        day: "2-digit"
      });
    }
    function resolveAuthHeader() {
      return null;
    }
    async function load() {
      loading.value = true;
      error.value = null;
      try {
        const authToken = resolveAuthHeader();
        if (!authToken) {
          throw new Error("Missing auth token");
        }
        const params = new URLSearchParams();
        if (resolvedInstitutionId.value) {
          params.set("institutionId", resolvedInstitutionId.value);
        }
        const baseUrl = apiBase ? apiBase.replace(/\/$/, "") : "";
        const endpoint = `${baseUrl}/api/institution-portal/student-dashboard`;
        const targetUrl = params.toString() ? `${endpoint}?${params.toString()}` : endpoint;
        const resp = await fetch(targetUrl, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: authToken
          }
        });
        if (!resp.ok) {
          const text = await resp.text().catch(() => "");
          throw new Error(text || `HTTP ${resp.status}`);
        }
        const json = await resp.json();
        viewModel.value = json;
        if (viewModel.value?.member?.role === "student") {
          const firstCourse = viewModel.value.courses?.[0]?.courseId || null;
          focusedCourseId.value = firstCourse;
          focusedClassroomId.value = viewModel.value.classrooms?.find((c) => c.isEnrolled)?.id || null;
          await Promise.all([loadProgress(), loadModulesForFocus(), loadDiscover()]);
        }
      } catch (err) {
        console.error(err);
        error.value = err?.message ?? "Failed to load institution portal view";
        message.error(error.value);
      } finally {
        loading.value = false;
      }
    }
    watch(resolvedInstitutionId, () => load());
    const activeDepartments = computed(
      () => viewModel.value?.departments.filter((d) => d.active) ?? []
    );
    const activeClassrooms = computed(
      () => viewModel.value?.classrooms.filter((c) => c.status === "ACTIVE") ?? []
    );
    const enrolledClassrooms = computed(
      () => viewModel.value?.classrooms.filter((c) => c.isEnrolled) ?? []
    );
    const filteredClassrooms = computed(() => {
      const base = showOnlyMyClassrooms.value ? enrolledClassrooms.value : viewModel.value?.classrooms ?? [];
      return base.slice().sort((a, b) => a.title.localeCompare(b.title));
    });
    function classroomsByDepartment(deptId) {
      return filteredClassrooms.value.filter((c) => c.departmentId === deptId);
    }
    const classroomsWithoutDepartment = computed(
      () => filteredClassrooms.value.filter((c) => !c.departmentId)
    );
    const courses = computed(() => viewModel.value?.courses ?? []);
    const completedCoursesCount = computed(
      () => courses.value.filter((c) => c.completed).length
    );
    const averageCourseProgress = computed(() => {
      if (!courses.value.length) return 0;
      const sum = courses.value.reduce((acc, c) => acc + c.progressPct, 0);
      return Math.round(sum / courses.value.length);
    });
    const gradeAveragePct = computed(() => {
      const entries = viewModel.value?.gradebookEntries ?? [];
      const valid = entries.filter(
        (e) => typeof e.score === "number" && typeof e.maxScore === "number" && e.maxScore > 0
      );
      if (!valid.length) return 0;
      const sumPct = valid.reduce(
        (acc, e) => acc + e.score / e.maxScore * 100,
        0
      );
      return Math.round(sumPct / valid.length);
    });
    const upcomingAssignments = computed(() => {
      const nowTs = Date.now();
      const all = viewModel.value?.assignments ?? [];
      return all.filter((a) => {
        const dueTs = new Date(a.dueDate).getTime();
        if (showOnlyOpenAssignments.value) {
          return dueTs >= nowTs && a.submissionStatus !== "graded";
        }
        return true;
      }).sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      ).slice(0, 5);
    });
    const recentLabs = computed(() => {
      const all = viewModel.value?.labs ?? [];
      return all.slice().sort((a, b) => {
        const ta = a.lastHeartbeat ? new Date(a.lastHeartbeat).getTime() : 0;
        const tb = b.lastHeartbeat ? new Date(b.lastHeartbeat).getTime() : 0;
        return tb - ta;
      }).slice(0, 5);
    });
    const runningLabsCount = computed(
      () => (viewModel.value?.labs ?? []).filter((l) => l.status === "running").length
    );
    const totalOrders = computed(() => viewModel.value?.orders.length ?? 0);
    const totalSpent = computed(
      () => (viewModel.value?.orders ?? []).reduce((sum, o) => sum + o.total, 0)
    );
    const primaryCurrency = computed(
      () => viewModel.value?.orders[0]?.currency ?? "EUR"
    );
    const studentDisplayName = computed(() => {
      if (!viewModel.value) return "Student";
      return viewModel.value.student.displayName || `${viewModel.value.user.firstName ?? ""} ${viewModel.value.user.lastName ?? ""}`.trim() || viewModel.value.user.email;
    });
    const studentInitials = computed(() => {
      const name = studentDisplayName.value;
      const parts = name.split(" ").filter(Boolean);
      if (!parts.length) return "?";
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
      return (parts[0][0] + parts[1][0]).toUpperCase();
    });
    const memberRoleLabel = computed(() => {
      const role = viewModel.value?.member?.role || "student";
      return role.charAt(0).toUpperCase() + role.slice(1);
    });
    const lastActivityDisplay = computed(() => {
      const entries = viewModel.value?.gradebookEntries ?? [];
      if (!entries.length) return "—";
      const tsList = entries.map(
        (e) => new Date(e.updatedAt || e.createdAt).getTime()
      );
      const maxTs = Math.max(...tsList);
      if (!Number.isFinite(maxTs)) return "—";
      return formatDate(new Date(maxTs));
    });
    const courseColumns = [
      { title: "Course", dataIndex: "title", key: "title" },
      { title: "Category", dataIndex: "category", key: "category" },
      { title: "Difficulty", dataIndex: "difficulty", key: "difficulty" },
      { title: "Progress", dataIndex: "progressPct", key: "progress" },
      { title: "Grade", dataIndex: "gradePct", key: "grade" },
      { title: "Classrooms", dataIndex: "classroomCount", key: "classrooms" }
    ];
    const assignmentColumns = [
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Course", dataIndex: "courseTitle", key: "courseTitle" },
      { title: "Classroom", dataIndex: "classroomName", key: "classroomName" },
      { title: "Due", dataIndex: "dueDate", key: "dueDate" },
      { title: "Status", dataIndex: "submissionStatus", key: "submissionStatus" }
    ];
    const assignmentColumnsDetailed = [
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Course", dataIndex: "courseTitle", key: "courseTitle" },
      { title: "Classroom", dataIndex: "classroomName", key: "classroomName" },
      { title: "Due", dataIndex: "dueDate", key: "dueDate" },
      { title: "Status", dataIndex: "submissionStatus", key: "status" },
      { title: "Grade", dataIndex: "grade", key: "grade" }
    ];
    const orderColumns = [
      { title: "Order ID", dataIndex: "orderId", key: "orderId" },
      { title: "Date", dataIndex: "createdAt", key: "createdAt" },
      { title: "Items", dataIndex: "items", key: "items" },
      { title: "Total", dataIndex: "total", key: "total" },
      { title: "Status", dataIndex: "status", key: "status" }
    ];
    function navHref(key) {
      const qs = `?institutionId=${encodeURIComponent(resolvedInstitutionId.value || "")}`;
      const firstDepartmentId = activeDepartments.value[0]?.id;
      const firstClassroomId = filteredClassrooms.value[0]?.id;
      const roleLower = String(viewModel.value?.member?.role || "").toLowerCase();
      if (roleLower !== "admin" && key === "departments") return `/institution/portal${qs}`;
      if (roleLower === "student" && key === "assignments") return `/institution/portal${qs}`;
      if (key === "overview") return `/institution/portal${qs}`;
      if (key === "departments") return firstDepartmentId ? `/institution/departments/${encodeURIComponent(firstDepartmentId)}${qs}` : `/institution/portal${qs}`;
      if (key === "classrooms") return firstClassroomId ? `/institution/classrooms/${encodeURIComponent(firstClassroomId)}${qs}` : `/institution/portal${qs}`;
      if (key === "people") return `/institution/people${qs}`;
      if (key === "catalog") return `/institution/catalog${qs}`;
      if (key === "calendar") return `/institution/calendar${qs}`;
      if (key === "assignments") return `/institution/assignments/teachers${qs}`;
      return `/institution/portal${qs}`;
    }
    async function leaveInstitution() {
      try {
        const authToken = resolveAuthHeader();
        if (!authToken) throw new Error("Missing auth token");
        const baseUrl = apiBase ? apiBase.replace(/\/$/, "") : "";
        const id = resolvedInstitutionId.value || viewModel.value?.institution?.id;
        if (!id) throw new Error("No institution id");
        const resp = await fetch(`${baseUrl}/api/institution-portal/institutions/${encodeURIComponent(id)}/leave`, { method: "POST", headers: { Authorization: authToken } });
        if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`));
        message.success("Left institution");
        (void 0).location.href = "/institution/join";
      } catch (e) {
        message.error(e?.message || "Leave failed");
      }
    }
    const institutionTeacherIds = computed(() => {
      const ids = (/* @__PURE__ */ new Set())(viewModel.value?.classrooms || []).forEach((c) => {
        if (c.teacherId) ids.add(String(c.teacherId));
      });
      return Array.from(ids);
    });
    function focusClassroom(room) {
      focusedClassroomId.value = room.id;
      const match = courses.value.find((c) => room.teacherId && institutionTeacherIds.value.includes(room.teacherId));
      focusedCourseId.value = match?.courseId || courses.value[0]?.courseId || null;
      loadModulesForFocus();
    }
    function focusCourse(course) {
      focusedCourseId.value = course.courseId;
      loadModulesForFocus();
    }
    async function loadProgress() {
      try {
        const authToken = resolveAuthHeader();
        if (!authToken || !viewModel.value?.student?.id) return;
        const baseUrl = apiBase ? apiBase.replace(/\/$/, "") : "";
        const resp = await fetch(`${baseUrl}/api/students-internal/graphql`, {
          method: "POST",
          headers: { "content-type": "application/json", Authorization: authToken },
          body: JSON.stringify({ query: `query($studentId:String!){ myProgress(studentId:$studentId){ lessonId completed } }`, variables: { studentId: viewModel.value.student.id } })
        });
        const json = await resp.json().catch(() => null);
        const arr = Array.isArray(json?.data?.myProgress) ? json.data.myProgress : [];
        const map = {};
        arr.forEach((p) => {
          if (p?.lessonId) map[p.lessonId] = p.completed ? "COMPLETED" : "IN_PROGRESS";
        });
        progressMap.value = map;
      } catch {
      }
    }
    async function loadModulesForFocus() {
      try {
        if (!focusedCourseId.value) {
          courseModules.value = [];
          return;
        }
        loadingModules.value = true;
        const baseUrl = apiBase ? apiBase.replace(/\/$/, "") : "";
        const resp = await fetch(`${baseUrl}/api/teach-internal/graphql`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ query: `query($id:String!){ course(id:$id){ id title modules{ id title lessons{ id duration } } } }`, variables: { id: focusedCourseId.value } })
        });
        const json = await resp.json().catch(() => null);
        const course = json?.data?.course || null;
        courseModules.value = Array.isArray(course?.modules) ? course.modules : [];
      } catch {
        courseModules.value = [];
      } finally {
        loadingModules.value = false;
      }
    }
    async function loadDiscover() {
      try {
        const authToken = resolveAuthHeader();
        if (!authToken) return;
        const baseUrl = apiBase ? apiBase.replace(/\/$/, "") : "";
        const url = `${baseUrl}/api/institution-portal/catalog?institutionId=${encodeURIComponent(resolvedInstitutionId.value || "")}`;
        const resp = await fetch(url, { headers: { Authorization: authToken } });
        const json = await resp.json().catch(() => null);
        const arr = Array.isArray(json?.courses) ? json.courses : [];
        discoverCourses.value = arr;
      } catch {
      }
    }
    const centerTitle = computed(() => {
      const course = courses.value.find((c) => c.courseId === focusedCourseId.value);
      const room = (viewModel.value?.classrooms || []).find((r) => r.id === focusedClassroomId.value);
      return [room?.title, course?.title].filter(Boolean).join(" • ") || "Active Modules & Next Steps";
    });
    const moduleColumns = [
      { title: "Module", dataIndex: "title", key: "title" },
      { title: "Status", dataIndex: "status", key: "status" },
      { title: "Next", dataIndex: "next", key: "next" }
    ];
    const moduleRows = computed(() => {
      return (courseModules.value || []).map((m) => {
        const lessons = Array.isArray(m.lessons) ? m.lessons : [];
        let completed = 0, inProgress = 0, notStarted = 0;
        let nextLabel = "—";
        for (const l of lessons) {
          const st = progressMap.value[l.id] || "NOT_STARTED";
          if (st === "COMPLETED") completed++;
          else if (st === "IN_PROGRESS") inProgress++;
          else notStarted++;
        }
        const next = lessons.find((l) => progressMap.value[l.id] !== "COMPLETED");
        if (next) nextLabel = `Next: ${next.title}`;
        return { id: m.id, title: m.title, completed, inProgress, notStarted, nextLabel };
      });
    });
    const continueLink = computed(() => {
      if (!focusedCourseId.value) return "";
      const mods = courseModules.value || [];
      const first = mods[0];
      const teacherId = institutionTeacherIds.value[0] || "teacher";
      if (first?.id) return `/teach-internal/${encodeURIComponent(teacherId)}/course/${encodeURIComponent(focusedCourseId.value)}/module/${encodeURIComponent(first.id)}/view`;
      return `/teach-internal/${encodeURIComponent(teacherId)}`;
    });
    function nextDueByClassroom(classroomId) {
      const arr = (viewModel.value?.assignments || []).filter((a) => a.classroomId === classroomId);
      if (!arr.length) return "—";
      const next = arr.slice().sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
      return formatDate(next?.dueDate);
    }
    const nextAssignmentsForFocus = computed(() => {
      const base = viewModel.value?.assignments || [];
      if (focusedClassroomId.value) return base.filter((a) => a.classroomId === focusedClassroomId.value).slice(0, 3);
      return base.slice(0, 3);
    });
    const discoverFiltered = computed(() => {
      const q = discoverQuery.value.trim().toLowerCase();
      const enrolledIds = new Set((viewModel.value?.courses || []).map((c) => c.courseId));
      return (discoverCourses.value || []).filter((c) => !enrolledIds.has(c.courseId)).filter((c) => q ? String(c.title).toLowerCase().includes(q) : true);
    });
    function isInstitutionCourse(c) {
      const tid = c.teacherId || c.teacher_id || null;
      return tid ? institutionTeacherIds.value.includes(String(tid)) : false;
    }
    function courseDeepLink(c) {
      const cid = c.courseId || c.id;
      const tid = c.teacherId || c.teacher_id || "teacher";
      return `/teach-internal/${encodeURIComponent(tid)}/course/${encodeURIComponent(cid)}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_skeleton = resolveComponent("a-skeleton");
      const _component_a_page_header = resolveComponent("a-page-header");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_menu = resolveComponent("a-menu");
      const _component_a_menu_item = resolveComponent("a-menu-item");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_statistic = resolveComponent("a-statistic");
      const _component_a_divider = resolveComponent("a-divider");
      const _component_a_descriptions = resolveComponent("a-descriptions");
      const _component_a_descriptions_item = resolveComponent("a-descriptions-item");
      const _component_a_switch = resolveComponent("a-switch");
      const _component_a_collapse = resolveComponent("a-collapse");
      const _component_a_collapse_panel = resolveComponent("a-collapse-panel");
      const _component_a_list = resolveComponent("a-list");
      const _component_a_list_item = resolveComponent("a-list-item");
      const _component_a_progress = resolveComponent("a-progress");
      const _component_a_empty = resolveComponent("a-empty");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_tabs = resolveComponent("a-tabs");
      const _component_a_tab_pane = resolveComponent("a-tab-pane");
      const _component_a_timeline = resolveComponent("a-timeline");
      const _component_a_timeline_item = resolveComponent("a-timeline-item");
      const _component_a_result = resolveComponent("a-result");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "institution-student-portal" }, _attrs))} data-v-789f08b6>`);
      _push(ssrRenderComponent(_component_a_skeleton, {
        loading: loading.value,
        active: "",
        paragraph: { rows: 10 }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!error.value && viewModel.value) {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(_component_a_page_header, {
                class: "portal-page-header",
                title: viewModel.value.institution.name,
                "sub-title": viewModel.value.institution.type || "Institution"
              }, {
                tags: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (viewModel.value.institution.active) {
                      _push3(ssrRenderComponent(_component_a_tag, { color: "green" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(CheckCircleOutlined), { class: "tag-icon" }, null, _parent4, _scopeId3));
                            _push4(`<span data-v-789f08b6${_scopeId3}>Active</span>`);
                          } else {
                            return [
                              createVNode(unref(CheckCircleOutlined), { class: "tag-icon" }),
                              createVNode("span", null, "Active")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(ssrRenderComponent(_component_a_tag, { color: "red" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(ExclamationCircleOutlined), { class: "tag-icon" }, null, _parent4, _scopeId3));
                            _push4(`<span data-v-789f08b6${_scopeId3}>Inactive</span>`);
                          } else {
                            return [
                              createVNode(unref(ExclamationCircleOutlined), { class: "tag-icon" }),
                              createVNode("span", null, "Inactive")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    }
                    _push3(ssrRenderComponent(_component_a_tag, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(viewModel.value.institution.slug)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(viewModel.value.institution.slug), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    if (viewModel.value.authInstitution?.domain) {
                      _push3(ssrRenderComponent(_component_a_tag, null, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(viewModel.value.authInstitution.domain)}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(viewModel.value.authInstitution.domain), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      viewModel.value.institution.active ? (openBlock(), createBlock(_component_a_tag, {
                        key: 0,
                        color: "green"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(CheckCircleOutlined), { class: "tag-icon" }),
                          createVNode("span", null, "Active")
                        ]),
                        _: 1
                      })) : (openBlock(), createBlock(_component_a_tag, {
                        key: 1,
                        color: "red"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(ExclamationCircleOutlined), { class: "tag-icon" }),
                          createVNode("span", null, "Inactive")
                        ]),
                        _: 1
                      })),
                      createVNode(_component_a_tag, null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(viewModel.value.institution.slug), 1)
                        ]),
                        _: 1
                      }),
                      viewModel.value.authInstitution?.domain ? (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(viewModel.value.authInstitution.domain), 1)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ];
                  }
                }),
                extra: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_space, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_menu, {
                            mode: "horizontal",
                            selectedKeys: ["overview"]
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_menu_item, { key: "overview" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<a${ssrRenderAttr("href", navHref("overview"))} data-v-789f08b6${_scopeId5}>Overview</a>`);
                                    } else {
                                      return [
                                        createVNode("a", {
                                          href: navHref("overview")
                                        }, "Overview", 8, ["href"])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                if (viewModel.value.member?.role === "admin") {
                                  _push5(ssrRenderComponent(_component_a_menu_item, { key: "departments" }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`<a${ssrRenderAttr("href", navHref("departments"))} data-v-789f08b6${_scopeId5}>Departments</a>`);
                                      } else {
                                        return [
                                          createVNode("a", {
                                            href: navHref("departments")
                                          }, "Departments", 8, ["href"])
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(ssrRenderComponent(_component_a_menu_item, { key: "classrooms" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<a${ssrRenderAttr("href", navHref("classrooms"))} data-v-789f08b6${_scopeId5}>Classrooms</a>`);
                                    } else {
                                      return [
                                        createVNode("a", {
                                          href: navHref("classrooms")
                                        }, "Classrooms", 8, ["href"])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_menu_item, { key: "people" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<a${ssrRenderAttr("href", navHref("people"))} data-v-789f08b6${_scopeId5}>People Directory</a>`);
                                    } else {
                                      return [
                                        createVNode("a", {
                                          href: navHref("people")
                                        }, "People Directory", 8, ["href"])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_menu_item, { key: "catalog" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<a${ssrRenderAttr("href", navHref("catalog"))} data-v-789f08b6${_scopeId5}>Catalog</a>`);
                                    } else {
                                      return [
                                        createVNode("a", {
                                          href: navHref("catalog")
                                        }, "Catalog", 8, ["href"])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_menu_item, { key: "calendar" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<a${ssrRenderAttr("href", navHref("calendar"))} data-v-789f08b6${_scopeId5}>Calendar</a>`);
                                    } else {
                                      return [
                                        createVNode("a", {
                                          href: navHref("calendar")
                                        }, "Calendar", 8, ["href"])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                if (viewModel.value.member?.role !== "student") {
                                  _push5(ssrRenderComponent(_component_a_menu_item, { key: "assignments" }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`<a${ssrRenderAttr("href", navHref("assignments"))} data-v-789f08b6${_scopeId5}>Assignments</a>`);
                                      } else {
                                        return [
                                          createVNode("a", {
                                            href: navHref("assignments")
                                          }, "Assignments", 8, ["href"])
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                              } else {
                                return [
                                  createVNode(_component_a_menu_item, { key: "overview" }, {
                                    default: withCtx(() => [
                                      createVNode("a", {
                                        href: navHref("overview")
                                      }, "Overview", 8, ["href"])
                                    ]),
                                    _: 1
                                  }),
                                  viewModel.value.member?.role === "admin" ? (openBlock(), createBlock(_component_a_menu_item, { key: "departments" }, {
                                    default: withCtx(() => [
                                      createVNode("a", {
                                        href: navHref("departments")
                                      }, "Departments", 8, ["href"])
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true),
                                  createVNode(_component_a_menu_item, { key: "classrooms" }, {
                                    default: withCtx(() => [
                                      createVNode("a", {
                                        href: navHref("classrooms")
                                      }, "Classrooms", 8, ["href"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_menu_item, { key: "people" }, {
                                    default: withCtx(() => [
                                      createVNode("a", {
                                        href: navHref("people")
                                      }, "People Directory", 8, ["href"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_menu_item, { key: "catalog" }, {
                                    default: withCtx(() => [
                                      createVNode("a", {
                                        href: navHref("catalog")
                                      }, "Catalog", 8, ["href"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_menu_item, { key: "calendar" }, {
                                    default: withCtx(() => [
                                      createVNode("a", {
                                        href: navHref("calendar")
                                      }, "Calendar", 8, ["href"])
                                    ]),
                                    _: 1
                                  }),
                                  viewModel.value.member?.role !== "student" ? (openBlock(), createBlock(_component_a_menu_item, { key: "assignments" }, {
                                    default: withCtx(() => [
                                      createVNode("a", {
                                        href: navHref("assignments")
                                      }, "Assignments", 8, ["href"])
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_button, {
                            size: "small",
                            onClick: load
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(ReloadOutlined), null, null, _parent5, _scopeId4));
                                _push5(` Refresh `);
                              } else {
                                return [
                                  createVNode(unref(ReloadOutlined)),
                                  createTextVNode(" Refresh ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          if (!viewModel.value.member) {
                            _push4(ssrRenderComponent(_component_a_button, {
                              size: "small",
                              type: "primary",
                              href: "/institution/join"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`Join Institution`);
                                } else {
                                  return [
                                    createTextVNode("Join Institution")
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(ssrRenderComponent(_component_a_button, {
                              size: "small",
                              danger: "",
                              onClick: leaveInstitution
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`Leave`);
                                } else {
                                  return [
                                    createTextVNode("Leave")
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          }
                        } else {
                          return [
                            createVNode(_component_a_menu, {
                              mode: "horizontal",
                              selectedKeys: ["overview"]
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_menu_item, { key: "overview" }, {
                                  default: withCtx(() => [
                                    createVNode("a", {
                                      href: navHref("overview")
                                    }, "Overview", 8, ["href"])
                                  ]),
                                  _: 1
                                }),
                                viewModel.value.member?.role === "admin" ? (openBlock(), createBlock(_component_a_menu_item, { key: "departments" }, {
                                  default: withCtx(() => [
                                    createVNode("a", {
                                      href: navHref("departments")
                                    }, "Departments", 8, ["href"])
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                createVNode(_component_a_menu_item, { key: "classrooms" }, {
                                  default: withCtx(() => [
                                    createVNode("a", {
                                      href: navHref("classrooms")
                                    }, "Classrooms", 8, ["href"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_menu_item, { key: "people" }, {
                                  default: withCtx(() => [
                                    createVNode("a", {
                                      href: navHref("people")
                                    }, "People Directory", 8, ["href"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_menu_item, { key: "catalog" }, {
                                  default: withCtx(() => [
                                    createVNode("a", {
                                      href: navHref("catalog")
                                    }, "Catalog", 8, ["href"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_menu_item, { key: "calendar" }, {
                                  default: withCtx(() => [
                                    createVNode("a", {
                                      href: navHref("calendar")
                                    }, "Calendar", 8, ["href"])
                                  ]),
                                  _: 1
                                }),
                                viewModel.value.member?.role !== "student" ? (openBlock(), createBlock(_component_a_menu_item, { key: "assignments" }, {
                                  default: withCtx(() => [
                                    createVNode("a", {
                                      href: navHref("assignments")
                                    }, "Assignments", 8, ["href"])
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_button, {
                              size: "small",
                              onClick: load
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(ReloadOutlined)),
                                createTextVNode(" Refresh ")
                              ]),
                              _: 1
                            }),
                            !viewModel.value.member ? (openBlock(), createBlock(_component_a_button, {
                              key: 0,
                              size: "small",
                              type: "primary",
                              href: "/institution/join"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Join Institution")
                              ]),
                              _: 1
                            })) : (openBlock(), createBlock(_component_a_button, {
                              key: 1,
                              size: "small",
                              danger: "",
                              onClick: leaveInstitution
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Leave")
                              ]),
                              _: 1
                            }))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_a_space, null, {
                        default: withCtx(() => [
                          createVNode(_component_a_menu, {
                            mode: "horizontal",
                            selectedKeys: ["overview"]
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_menu_item, { key: "overview" }, {
                                default: withCtx(() => [
                                  createVNode("a", {
                                    href: navHref("overview")
                                  }, "Overview", 8, ["href"])
                                ]),
                                _: 1
                              }),
                              viewModel.value.member?.role === "admin" ? (openBlock(), createBlock(_component_a_menu_item, { key: "departments" }, {
                                default: withCtx(() => [
                                  createVNode("a", {
                                    href: navHref("departments")
                                  }, "Departments", 8, ["href"])
                                ]),
                                _: 1
                              })) : createCommentVNode("", true),
                              createVNode(_component_a_menu_item, { key: "classrooms" }, {
                                default: withCtx(() => [
                                  createVNode("a", {
                                    href: navHref("classrooms")
                                  }, "Classrooms", 8, ["href"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_menu_item, { key: "people" }, {
                                default: withCtx(() => [
                                  createVNode("a", {
                                    href: navHref("people")
                                  }, "People Directory", 8, ["href"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_menu_item, { key: "catalog" }, {
                                default: withCtx(() => [
                                  createVNode("a", {
                                    href: navHref("catalog")
                                  }, "Catalog", 8, ["href"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_menu_item, { key: "calendar" }, {
                                default: withCtx(() => [
                                  createVNode("a", {
                                    href: navHref("calendar")
                                  }, "Calendar", 8, ["href"])
                                ]),
                                _: 1
                              }),
                              viewModel.value.member?.role !== "student" ? (openBlock(), createBlock(_component_a_menu_item, { key: "assignments" }, {
                                default: withCtx(() => [
                                  createVNode("a", {
                                    href: navHref("assignments")
                                  }, "Assignments", 8, ["href"])
                                ]),
                                _: 1
                              })) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_button, {
                            size: "small",
                            onClick: load
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(ReloadOutlined)),
                              createTextVNode(" Refresh ")
                            ]),
                            _: 1
                          }),
                          !viewModel.value.member ? (openBlock(), createBlock(_component_a_button, {
                            key: 0,
                            size: "small",
                            type: "primary",
                            href: "/institution/join"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Join Institution")
                            ]),
                            _: 1
                          })) : (openBlock(), createBlock(_component_a_button, {
                            key: 1,
                            size: "small",
                            danger: "",
                            onClick: leaveInstitution
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Leave")
                            ]),
                            _: 1
                          }))
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                footer: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_row, {
                      gutter: 16,
                      class: "portal-header-row"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_col, { span: 16 }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_card, {
                                  size: "small",
                                  bordered: "",
                                  class: "portal-header-card"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_row, { gutter: 16 }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_col, { span: 8 }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_a_statistic, {
                                                    value: enrolledClassrooms.value.length
                                                  }, {
                                                    title: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`<span data-v-789f08b6${_scopeId8}>`);
                                                        _push9(ssrRenderComponent(unref(TeamOutlined), { class: "stat-icon" }, null, _parent9, _scopeId8));
                                                        _push9(` Enrolled classrooms </span>`);
                                                      } else {
                                                        return [
                                                          createVNode("span", null, [
                                                            createVNode(unref(TeamOutlined), { class: "stat-icon" }),
                                                            createTextVNode(" Enrolled classrooms ")
                                                          ])
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_a_statistic, {
                                                      value: enrolledClassrooms.value.length
                                                    }, {
                                                      title: withCtx(() => [
                                                        createVNode("span", null, [
                                                          createVNode(unref(TeamOutlined), { class: "stat-icon" }),
                                                          createTextVNode(" Enrolled classrooms ")
                                                        ])
                                                      ]),
                                                      _: 1
                                                    }, 8, ["value"])
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_col, { span: 8 }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_a_statistic, {
                                                    value: activeDepartments.value.length
                                                  }, {
                                                    title: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`<span data-v-789f08b6${_scopeId8}>`);
                                                        _push9(ssrRenderComponent(unref(ClusterOutlined), { class: "stat-icon" }, null, _parent9, _scopeId8));
                                                        _push9(` Active departments </span>`);
                                                      } else {
                                                        return [
                                                          createVNode("span", null, [
                                                            createVNode(unref(ClusterOutlined), { class: "stat-icon" }),
                                                            createTextVNode(" Active departments ")
                                                          ])
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_a_statistic, {
                                                      value: activeDepartments.value.length
                                                    }, {
                                                      title: withCtx(() => [
                                                        createVNode("span", null, [
                                                          createVNode(unref(ClusterOutlined), { class: "stat-icon" }),
                                                          createTextVNode(" Active departments ")
                                                        ])
                                                      ]),
                                                      _: 1
                                                    }, 8, ["value"])
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_col, { span: 8 }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_a_statistic, {
                                                    value: averageCourseProgress.value,
                                                    suffix: "%"
                                                  }, {
                                                    title: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`<span data-v-789f08b6${_scopeId8}>`);
                                                        _push9(ssrRenderComponent(unref(DashboardOutlined), { class: "stat-icon" }, null, _parent9, _scopeId8));
                                                        _push9(` Avg. course progress </span>`);
                                                      } else {
                                                        return [
                                                          createVNode("span", null, [
                                                            createVNode(unref(DashboardOutlined), { class: "stat-icon" }),
                                                            createTextVNode(" Avg. course progress ")
                                                          ])
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_a_statistic, {
                                                      value: averageCourseProgress.value,
                                                      suffix: "%"
                                                    }, {
                                                      title: withCtx(() => [
                                                        createVNode("span", null, [
                                                          createVNode(unref(DashboardOutlined), { class: "stat-icon" }),
                                                          createTextVNode(" Avg. course progress ")
                                                        ])
                                                      ]),
                                                      _: 1
                                                    }, 8, ["value"])
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_col, { span: 8 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_statistic, {
                                                    value: enrolledClassrooms.value.length
                                                  }, {
                                                    title: withCtx(() => [
                                                      createVNode("span", null, [
                                                        createVNode(unref(TeamOutlined), { class: "stat-icon" }),
                                                        createTextVNode(" Enrolled classrooms ")
                                                      ])
                                                    ]),
                                                    _: 1
                                                  }, 8, ["value"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_col, { span: 8 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_statistic, {
                                                    value: activeDepartments.value.length
                                                  }, {
                                                    title: withCtx(() => [
                                                      createVNode("span", null, [
                                                        createVNode(unref(ClusterOutlined), { class: "stat-icon" }),
                                                        createTextVNode(" Active departments ")
                                                      ])
                                                    ]),
                                                    _: 1
                                                  }, 8, ["value"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_col, { span: 8 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_statistic, {
                                                    value: averageCourseProgress.value,
                                                    suffix: "%"
                                                  }, {
                                                    title: withCtx(() => [
                                                      createVNode("span", null, [
                                                        createVNode(unref(DashboardOutlined), { class: "stat-icon" }),
                                                        createTextVNode(" Avg. course progress ")
                                                      ])
                                                    ]),
                                                    _: 1
                                                  }, 8, ["value"])
                                                ]),
                                                _: 1
                                              })
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_a_row, {
                                        gutter: 16,
                                        style: { "margin-top": "12px" }
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_col, { span: 8 }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_a_statistic, {
                                                    value: gradeAveragePct.value,
                                                    suffix: "%"
                                                  }, {
                                                    title: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`<span data-v-789f08b6${_scopeId8}>`);
                                                        _push9(ssrRenderComponent(unref(CheckCircleOutlined), { class: "stat-icon" }, null, _parent9, _scopeId8));
                                                        _push9(` Avg. grade </span>`);
                                                      } else {
                                                        return [
                                                          createVNode("span", null, [
                                                            createVNode(unref(CheckCircleOutlined), { class: "stat-icon" }),
                                                            createTextVNode(" Avg. grade ")
                                                          ])
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_a_statistic, {
                                                      value: gradeAveragePct.value,
                                                      suffix: "%"
                                                    }, {
                                                      title: withCtx(() => [
                                                        createVNode("span", null, [
                                                          createVNode(unref(CheckCircleOutlined), { class: "stat-icon" }),
                                                          createTextVNode(" Avg. grade ")
                                                        ])
                                                      ]),
                                                      _: 1
                                                    }, 8, ["value"])
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_col, { span: 8 }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_a_statistic, { value: totalOrders.value }, {
                                                    title: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`<span data-v-789f08b6${_scopeId8}>`);
                                                        _push9(ssrRenderComponent(unref(ShoppingCartOutlined), { class: "stat-icon" }, null, _parent9, _scopeId8));
                                                        _push9(` Orders for this institution </span>`);
                                                      } else {
                                                        return [
                                                          createVNode("span", null, [
                                                            createVNode(unref(ShoppingCartOutlined), { class: "stat-icon" }),
                                                            createTextVNode(" Orders for this institution ")
                                                          ])
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_a_statistic, { value: totalOrders.value }, {
                                                      title: withCtx(() => [
                                                        createVNode("span", null, [
                                                          createVNode(unref(ShoppingCartOutlined), { class: "stat-icon" }),
                                                          createTextVNode(" Orders for this institution ")
                                                        ])
                                                      ]),
                                                      _: 1
                                                    }, 8, ["value"])
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_col, { span: 8 }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_a_statistic, { value: runningLabsCount.value }, {
                                                    title: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`<span data-v-789f08b6${_scopeId8}>`);
                                                        _push9(ssrRenderComponent(unref(ExperimentOutlined), { class: "stat-icon" }, null, _parent9, _scopeId8));
                                                        _push9(` Active lab sessions </span>`);
                                                      } else {
                                                        return [
                                                          createVNode("span", null, [
                                                            createVNode(unref(ExperimentOutlined), { class: "stat-icon" }),
                                                            createTextVNode(" Active lab sessions ")
                                                          ])
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_a_statistic, { value: runningLabsCount.value }, {
                                                      title: withCtx(() => [
                                                        createVNode("span", null, [
                                                          createVNode(unref(ExperimentOutlined), { class: "stat-icon" }),
                                                          createTextVNode(" Active lab sessions ")
                                                        ])
                                                      ]),
                                                      _: 1
                                                    }, 8, ["value"])
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_col, { span: 8 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_statistic, {
                                                    value: gradeAveragePct.value,
                                                    suffix: "%"
                                                  }, {
                                                    title: withCtx(() => [
                                                      createVNode("span", null, [
                                                        createVNode(unref(CheckCircleOutlined), { class: "stat-icon" }),
                                                        createTextVNode(" Avg. grade ")
                                                      ])
                                                    ]),
                                                    _: 1
                                                  }, 8, ["value"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_col, { span: 8 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_statistic, { value: totalOrders.value }, {
                                                    title: withCtx(() => [
                                                      createVNode("span", null, [
                                                        createVNode(unref(ShoppingCartOutlined), { class: "stat-icon" }),
                                                        createTextVNode(" Orders for this institution ")
                                                      ])
                                                    ]),
                                                    _: 1
                                                  }, 8, ["value"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_col, { span: 8 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_statistic, { value: runningLabsCount.value }, {
                                                    title: withCtx(() => [
                                                      createVNode("span", null, [
                                                        createVNode(unref(ExperimentOutlined), { class: "stat-icon" }),
                                                        createTextVNode(" Active lab sessions ")
                                                      ])
                                                    ]),
                                                    _: 1
                                                  }, 8, ["value"])
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
                                        createVNode(_component_a_row, { gutter: 16 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_col, { span: 8 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_statistic, {
                                                  value: enrolledClassrooms.value.length
                                                }, {
                                                  title: withCtx(() => [
                                                    createVNode("span", null, [
                                                      createVNode(unref(TeamOutlined), { class: "stat-icon" }),
                                                      createTextVNode(" Enrolled classrooms ")
                                                    ])
                                                  ]),
                                                  _: 1
                                                }, 8, ["value"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_col, { span: 8 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_statistic, {
                                                  value: activeDepartments.value.length
                                                }, {
                                                  title: withCtx(() => [
                                                    createVNode("span", null, [
                                                      createVNode(unref(ClusterOutlined), { class: "stat-icon" }),
                                                      createTextVNode(" Active departments ")
                                                    ])
                                                  ]),
                                                  _: 1
                                                }, 8, ["value"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_col, { span: 8 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_statistic, {
                                                  value: averageCourseProgress.value,
                                                  suffix: "%"
                                                }, {
                                                  title: withCtx(() => [
                                                    createVNode("span", null, [
                                                      createVNode(unref(DashboardOutlined), { class: "stat-icon" }),
                                                      createTextVNode(" Avg. course progress ")
                                                    ])
                                                  ]),
                                                  _: 1
                                                }, 8, ["value"])
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_row, {
                                          gutter: 16,
                                          style: { "margin-top": "12px" }
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_col, { span: 8 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_statistic, {
                                                  value: gradeAveragePct.value,
                                                  suffix: "%"
                                                }, {
                                                  title: withCtx(() => [
                                                    createVNode("span", null, [
                                                      createVNode(unref(CheckCircleOutlined), { class: "stat-icon" }),
                                                      createTextVNode(" Avg. grade ")
                                                    ])
                                                  ]),
                                                  _: 1
                                                }, 8, ["value"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_col, { span: 8 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_statistic, { value: totalOrders.value }, {
                                                  title: withCtx(() => [
                                                    createVNode("span", null, [
                                                      createVNode(unref(ShoppingCartOutlined), { class: "stat-icon" }),
                                                      createTextVNode(" Orders for this institution ")
                                                    ])
                                                  ]),
                                                  _: 1
                                                }, 8, ["value"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_col, { span: 8 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_statistic, { value: runningLabsCount.value }, {
                                                  title: withCtx(() => [
                                                    createVNode("span", null, [
                                                      createVNode(unref(ExperimentOutlined), { class: "stat-icon" }),
                                                      createTextVNode(" Active lab sessions ")
                                                    ])
                                                  ]),
                                                  _: 1
                                                }, 8, ["value"])
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
                                  createVNode(_component_a_card, {
                                    size: "small",
                                    bordered: "",
                                    class: "portal-header-card"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_row, { gutter: 16 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_col, { span: 8 }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_statistic, {
                                                value: enrolledClassrooms.value.length
                                              }, {
                                                title: withCtx(() => [
                                                  createVNode("span", null, [
                                                    createVNode(unref(TeamOutlined), { class: "stat-icon" }),
                                                    createTextVNode(" Enrolled classrooms ")
                                                  ])
                                                ]),
                                                _: 1
                                              }, 8, ["value"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_col, { span: 8 }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_statistic, {
                                                value: activeDepartments.value.length
                                              }, {
                                                title: withCtx(() => [
                                                  createVNode("span", null, [
                                                    createVNode(unref(ClusterOutlined), { class: "stat-icon" }),
                                                    createTextVNode(" Active departments ")
                                                  ])
                                                ]),
                                                _: 1
                                              }, 8, ["value"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_col, { span: 8 }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_statistic, {
                                                value: averageCourseProgress.value,
                                                suffix: "%"
                                              }, {
                                                title: withCtx(() => [
                                                  createVNode("span", null, [
                                                    createVNode(unref(DashboardOutlined), { class: "stat-icon" }),
                                                    createTextVNode(" Avg. course progress ")
                                                  ])
                                                ]),
                                                _: 1
                                              }, 8, ["value"])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_row, {
                                        gutter: 16,
                                        style: { "margin-top": "12px" }
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_col, { span: 8 }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_statistic, {
                                                value: gradeAveragePct.value,
                                                suffix: "%"
                                              }, {
                                                title: withCtx(() => [
                                                  createVNode("span", null, [
                                                    createVNode(unref(CheckCircleOutlined), { class: "stat-icon" }),
                                                    createTextVNode(" Avg. grade ")
                                                  ])
                                                ]),
                                                _: 1
                                              }, 8, ["value"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_col, { span: 8 }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_statistic, { value: totalOrders.value }, {
                                                title: withCtx(() => [
                                                  createVNode("span", null, [
                                                    createVNode(unref(ShoppingCartOutlined), { class: "stat-icon" }),
                                                    createTextVNode(" Orders for this institution ")
                                                  ])
                                                ]),
                                                _: 1
                                              }, 8, ["value"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_col, { span: 8 }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_statistic, { value: runningLabsCount.value }, {
                                                title: withCtx(() => [
                                                  createVNode("span", null, [
                                                    createVNode(unref(ExperimentOutlined), { class: "stat-icon" }),
                                                    createTextVNode(" Active lab sessions ")
                                                  ])
                                                ]),
                                                _: 1
                                              }, 8, ["value"])
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
                          _push4(ssrRenderComponent(_component_a_col, { span: 8 }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_card, {
                                  size: "small",
                                  class: "student-card"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div class="student-header" data-v-789f08b6${_scopeId5}><div class="avatar-circle" data-v-789f08b6${_scopeId5}><span data-v-789f08b6${_scopeId5}>${ssrInterpolate(studentInitials.value)}</span></div><div class="student-meta" data-v-789f08b6${_scopeId5}><div class="student-name" data-v-789f08b6${_scopeId5}>${ssrInterpolate(studentDisplayName.value)}</div><div class="student-email" data-v-789f08b6${_scopeId5}>${ssrInterpolate(viewModel.value.user.email)}</div><div class="student-role" data-v-789f08b6${_scopeId5}>`);
                                      _push6(ssrRenderComponent(_component_a_tag, { color: "blue" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(UserOutlined), { class: "tag-icon" }, null, _parent7, _scopeId6));
                                            _push7(` ${ssrInterpolate(memberRoleLabel.value)}`);
                                          } else {
                                            return [
                                              createVNode(unref(UserOutlined), { class: "tag-icon" }),
                                              createTextVNode(" " + toDisplayString(memberRoleLabel.value), 1)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      if (viewModel.value.member?.status === "ACTIVE") {
                                        _push6(ssrRenderComponent(_component_a_tag, { color: "green" }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(` Active member `);
                                            } else {
                                              return [
                                                createTextVNode(" Active member ")
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                      _push6(`</div></div></div>`);
                                      _push6(ssrRenderComponent(_component_a_divider, null, null, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_a_descriptions, {
                                        column: 1,
                                        size: "small"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_descriptions_item, { label: "Institution ID" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(viewModel.value.institution.id)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(viewModel.value.institution.id), 1)
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_descriptions_item, { label: "Member since" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(formatDate(viewModel.value.member?.createdAt))}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(formatDate(viewModel.value.member?.createdAt)), 1)
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_descriptions_item, { label: "Last activity" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(lastActivityDisplay.value)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(lastActivityDisplay.value), 1)
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_descriptions_item, { label: "Institution ID" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(viewModel.value.institution.id), 1)
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_descriptions_item, { label: "Member since" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(formatDate(viewModel.value.member?.createdAt)), 1)
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_descriptions_item, { label: "Last activity" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(lastActivityDisplay.value), 1)
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
                                        createVNode("div", { class: "student-header" }, [
                                          createVNode("div", { class: "avatar-circle" }, [
                                            createVNode("span", null, toDisplayString(studentInitials.value), 1)
                                          ]),
                                          createVNode("div", { class: "student-meta" }, [
                                            createVNode("div", { class: "student-name" }, toDisplayString(studentDisplayName.value), 1),
                                            createVNode("div", { class: "student-email" }, toDisplayString(viewModel.value.user.email), 1),
                                            createVNode("div", { class: "student-role" }, [
                                              createVNode(_component_a_tag, { color: "blue" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(UserOutlined), { class: "tag-icon" }),
                                                  createTextVNode(" " + toDisplayString(memberRoleLabel.value), 1)
                                                ]),
                                                _: 1
                                              }),
                                              viewModel.value.member?.status === "ACTIVE" ? (openBlock(), createBlock(_component_a_tag, {
                                                key: 0,
                                                color: "green"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Active member ")
                                                ]),
                                                _: 1
                                              })) : createCommentVNode("", true)
                                            ])
                                          ])
                                        ]),
                                        createVNode(_component_a_divider),
                                        createVNode(_component_a_descriptions, {
                                          column: 1,
                                          size: "small"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_descriptions_item, { label: "Institution ID" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(viewModel.value.institution.id), 1)
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_descriptions_item, { label: "Member since" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(formatDate(viewModel.value.member?.createdAt)), 1)
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_descriptions_item, { label: "Last activity" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(lastActivityDisplay.value), 1)
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
                                  createVNode(_component_a_card, {
                                    size: "small",
                                    class: "student-card"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "student-header" }, [
                                        createVNode("div", { class: "avatar-circle" }, [
                                          createVNode("span", null, toDisplayString(studentInitials.value), 1)
                                        ]),
                                        createVNode("div", { class: "student-meta" }, [
                                          createVNode("div", { class: "student-name" }, toDisplayString(studentDisplayName.value), 1),
                                          createVNode("div", { class: "student-email" }, toDisplayString(viewModel.value.user.email), 1),
                                          createVNode("div", { class: "student-role" }, [
                                            createVNode(_component_a_tag, { color: "blue" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(UserOutlined), { class: "tag-icon" }),
                                                createTextVNode(" " + toDisplayString(memberRoleLabel.value), 1)
                                              ]),
                                              _: 1
                                            }),
                                            viewModel.value.member?.status === "ACTIVE" ? (openBlock(), createBlock(_component_a_tag, {
                                              key: 0,
                                              color: "green"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Active member ")
                                              ]),
                                              _: 1
                                            })) : createCommentVNode("", true)
                                          ])
                                        ])
                                      ]),
                                      createVNode(_component_a_divider),
                                      createVNode(_component_a_descriptions, {
                                        column: 1,
                                        size: "small"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_descriptions_item, { label: "Institution ID" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(viewModel.value.institution.id), 1)
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_descriptions_item, { label: "Member since" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(formatDate(viewModel.value.member?.createdAt)), 1)
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_descriptions_item, { label: "Last activity" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(lastActivityDisplay.value), 1)
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
                        } else {
                          return [
                            createVNode(_component_a_col, { span: 16 }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, {
                                  size: "small",
                                  bordered: "",
                                  class: "portal-header-card"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_row, { gutter: 16 }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_col, { span: 8 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_statistic, {
                                              value: enrolledClassrooms.value.length
                                            }, {
                                              title: withCtx(() => [
                                                createVNode("span", null, [
                                                  createVNode(unref(TeamOutlined), { class: "stat-icon" }),
                                                  createTextVNode(" Enrolled classrooms ")
                                                ])
                                              ]),
                                              _: 1
                                            }, 8, ["value"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_col, { span: 8 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_statistic, {
                                              value: activeDepartments.value.length
                                            }, {
                                              title: withCtx(() => [
                                                createVNode("span", null, [
                                                  createVNode(unref(ClusterOutlined), { class: "stat-icon" }),
                                                  createTextVNode(" Active departments ")
                                                ])
                                              ]),
                                              _: 1
                                            }, 8, ["value"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_col, { span: 8 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_statistic, {
                                              value: averageCourseProgress.value,
                                              suffix: "%"
                                            }, {
                                              title: withCtx(() => [
                                                createVNode("span", null, [
                                                  createVNode(unref(DashboardOutlined), { class: "stat-icon" }),
                                                  createTextVNode(" Avg. course progress ")
                                                ])
                                              ]),
                                              _: 1
                                            }, 8, ["value"])
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_row, {
                                      gutter: 16,
                                      style: { "margin-top": "12px" }
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_col, { span: 8 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_statistic, {
                                              value: gradeAveragePct.value,
                                              suffix: "%"
                                            }, {
                                              title: withCtx(() => [
                                                createVNode("span", null, [
                                                  createVNode(unref(CheckCircleOutlined), { class: "stat-icon" }),
                                                  createTextVNode(" Avg. grade ")
                                                ])
                                              ]),
                                              _: 1
                                            }, 8, ["value"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_col, { span: 8 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_statistic, { value: totalOrders.value }, {
                                              title: withCtx(() => [
                                                createVNode("span", null, [
                                                  createVNode(unref(ShoppingCartOutlined), { class: "stat-icon" }),
                                                  createTextVNode(" Orders for this institution ")
                                                ])
                                              ]),
                                              _: 1
                                            }, 8, ["value"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_col, { span: 8 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_statistic, { value: runningLabsCount.value }, {
                                              title: withCtx(() => [
                                                createVNode("span", null, [
                                                  createVNode(unref(ExperimentOutlined), { class: "stat-icon" }),
                                                  createTextVNode(" Active lab sessions ")
                                                ])
                                              ]),
                                              _: 1
                                            }, 8, ["value"])
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
                            createVNode(_component_a_col, { span: 8 }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, {
                                  size: "small",
                                  class: "student-card"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "student-header" }, [
                                      createVNode("div", { class: "avatar-circle" }, [
                                        createVNode("span", null, toDisplayString(studentInitials.value), 1)
                                      ]),
                                      createVNode("div", { class: "student-meta" }, [
                                        createVNode("div", { class: "student-name" }, toDisplayString(studentDisplayName.value), 1),
                                        createVNode("div", { class: "student-email" }, toDisplayString(viewModel.value.user.email), 1),
                                        createVNode("div", { class: "student-role" }, [
                                          createVNode(_component_a_tag, { color: "blue" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(UserOutlined), { class: "tag-icon" }),
                                              createTextVNode(" " + toDisplayString(memberRoleLabel.value), 1)
                                            ]),
                                            _: 1
                                          }),
                                          viewModel.value.member?.status === "ACTIVE" ? (openBlock(), createBlock(_component_a_tag, {
                                            key: 0,
                                            color: "green"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Active member ")
                                            ]),
                                            _: 1
                                          })) : createCommentVNode("", true)
                                        ])
                                      ])
                                    ]),
                                    createVNode(_component_a_divider),
                                    createVNode(_component_a_descriptions, {
                                      column: 1,
                                      size: "small"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_descriptions_item, { label: "Institution ID" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(viewModel.value.institution.id), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_descriptions_item, { label: "Member since" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(formatDate(viewModel.value.member?.createdAt)), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_descriptions_item, { label: "Last activity" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(lastActivityDisplay.value), 1)
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
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_a_row, {
                        gutter: 16,
                        class: "portal-header-row"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_col, { span: 16 }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                size: "small",
                                bordered: "",
                                class: "portal-header-card"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_row, { gutter: 16 }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_col, { span: 8 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_statistic, {
                                            value: enrolledClassrooms.value.length
                                          }, {
                                            title: withCtx(() => [
                                              createVNode("span", null, [
                                                createVNode(unref(TeamOutlined), { class: "stat-icon" }),
                                                createTextVNode(" Enrolled classrooms ")
                                              ])
                                            ]),
                                            _: 1
                                          }, 8, ["value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_col, { span: 8 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_statistic, {
                                            value: activeDepartments.value.length
                                          }, {
                                            title: withCtx(() => [
                                              createVNode("span", null, [
                                                createVNode(unref(ClusterOutlined), { class: "stat-icon" }),
                                                createTextVNode(" Active departments ")
                                              ])
                                            ]),
                                            _: 1
                                          }, 8, ["value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_col, { span: 8 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_statistic, {
                                            value: averageCourseProgress.value,
                                            suffix: "%"
                                          }, {
                                            title: withCtx(() => [
                                              createVNode("span", null, [
                                                createVNode(unref(DashboardOutlined), { class: "stat-icon" }),
                                                createTextVNode(" Avg. course progress ")
                                              ])
                                            ]),
                                            _: 1
                                          }, 8, ["value"])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_row, {
                                    gutter: 16,
                                    style: { "margin-top": "12px" }
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_col, { span: 8 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_statistic, {
                                            value: gradeAveragePct.value,
                                            suffix: "%"
                                          }, {
                                            title: withCtx(() => [
                                              createVNode("span", null, [
                                                createVNode(unref(CheckCircleOutlined), { class: "stat-icon" }),
                                                createTextVNode(" Avg. grade ")
                                              ])
                                            ]),
                                            _: 1
                                          }, 8, ["value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_col, { span: 8 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_statistic, { value: totalOrders.value }, {
                                            title: withCtx(() => [
                                              createVNode("span", null, [
                                                createVNode(unref(ShoppingCartOutlined), { class: "stat-icon" }),
                                                createTextVNode(" Orders for this institution ")
                                              ])
                                            ]),
                                            _: 1
                                          }, 8, ["value"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_col, { span: 8 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_statistic, { value: runningLabsCount.value }, {
                                            title: withCtx(() => [
                                              createVNode("span", null, [
                                                createVNode(unref(ExperimentOutlined), { class: "stat-icon" }),
                                                createTextVNode(" Active lab sessions ")
                                              ])
                                            ]),
                                            _: 1
                                          }, 8, ["value"])
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
                          createVNode(_component_a_col, { span: 8 }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                size: "small",
                                class: "student-card"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "student-header" }, [
                                    createVNode("div", { class: "avatar-circle" }, [
                                      createVNode("span", null, toDisplayString(studentInitials.value), 1)
                                    ]),
                                    createVNode("div", { class: "student-meta" }, [
                                      createVNode("div", { class: "student-name" }, toDisplayString(studentDisplayName.value), 1),
                                      createVNode("div", { class: "student-email" }, toDisplayString(viewModel.value.user.email), 1),
                                      createVNode("div", { class: "student-role" }, [
                                        createVNode(_component_a_tag, { color: "blue" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(UserOutlined), { class: "tag-icon" }),
                                            createTextVNode(" " + toDisplayString(memberRoleLabel.value), 1)
                                          ]),
                                          _: 1
                                        }),
                                        viewModel.value.member?.status === "ACTIVE" ? (openBlock(), createBlock(_component_a_tag, {
                                          key: 0,
                                          color: "green"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Active member ")
                                          ]),
                                          _: 1
                                        })) : createCommentVNode("", true)
                                      ])
                                    ])
                                  ]),
                                  createVNode(_component_a_divider),
                                  createVNode(_component_a_descriptions, {
                                    column: 1,
                                    size: "small"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_descriptions_item, { label: "Institution ID" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(viewModel.value.institution.id), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_descriptions_item, { label: "Member since" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(formatDate(viewModel.value.member?.createdAt)), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_descriptions_item, { label: "Last activity" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(lastActivityDisplay.value), 1)
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
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (viewModel.value.member?.role === "student") {
                _push2(ssrRenderComponent(_component_a_row, {
                  gutter: 16,
                  class: "portal-layout"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_a_col, {
                        xs: 24,
                        md: 8
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_a_card, {
                              size: "small",
                              title: "Institution Programs & Classrooms"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="section-header" data-v-789f08b6${_scopeId4}><span class="section-title" data-v-789f08b6${_scopeId4}>`);
                                  _push5(ssrRenderComponent(unref(ClusterOutlined), { class: "section-icon" }, null, _parent5, _scopeId4));
                                  _push5(` Departments </span>`);
                                  _push5(ssrRenderComponent(_component_a_switch, {
                                    checked: showOnlyMyClassrooms.value,
                                    "onUpdate:checked": ($event) => showOnlyMyClassrooms.value = $event,
                                    size: "small",
                                    style: { "margin-left": "auto" }
                                  }, null, _parent5, _scopeId4));
                                  _push5(`<span class="filter-label" data-v-789f08b6${_scopeId4}>Show only my classrooms</span></div>`);
                                  _push5(ssrRenderComponent(_component_a_collapse, { accordion: "" }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`<!--[-->`);
                                        ssrRenderList(activeDepartments.value, (dept) => {
                                          _push6(ssrRenderComponent(_component_a_collapse_panel, {
                                            key: dept.id,
                                            header: dept.name
                                          }, {
                                            default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                              if (_push7) {
                                                _push7(ssrRenderComponent(_component_a_list, {
                                                  size: "small",
                                                  "data-source": classroomsByDepartment(dept.id),
                                                  locale: { emptyText: "No classrooms" }
                                                }, {
                                                  renderItem: withCtx(({ item }, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(ssrRenderComponent(_component_a_list_item, {
                                                        onClick: ($event) => focusClassroom(item),
                                                        style: { "cursor": "pointer" }
                                                      }, {
                                                        default: withCtx((_7, _push9, _parent9, _scopeId8) => {
                                                          if (_push9) {
                                                            _push9(`<div class="classroom-item" data-v-789f08b6${_scopeId8}><div class="classroom-title" data-v-789f08b6${_scopeId8}>`);
                                                            _push9(ssrRenderComponent(unref(BookOutlined), { class: "section-icon" }, null, _parent9, _scopeId8));
                                                            _push9(`<span data-v-789f08b6${_scopeId8}>${ssrInterpolate(item.title)}</span>`);
                                                            if (item.isEnrolled) {
                                                              _push9(ssrRenderComponent(_component_a_tag, {
                                                                color: "green",
                                                                style: { "margin-left": "8px" }
                                                              }, {
                                                                default: withCtx((_8, _push10, _parent10, _scopeId9) => {
                                                                  if (_push10) {
                                                                    _push10(`Enrolled`);
                                                                  } else {
                                                                    return [
                                                                      createTextVNode("Enrolled")
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent9, _scopeId8));
                                                            } else {
                                                              _push9(`<!---->`);
                                                            }
                                                            _push9(`</div><div class="classroom-meta" data-v-789f08b6${_scopeId8}><span data-v-789f08b6${_scopeId8}>Code: ${ssrInterpolate(item.code)}</span>`);
                                                            if (item.teacherId) {
                                                              _push9(`<span data-v-789f08b6${_scopeId8}>• Teacher: ${ssrInterpolate(item.teacherId)}</span>`);
                                                            } else {
                                                              _push9(`<!---->`);
                                                            }
                                                            _push9(`</div><div class="classroom-meta" data-v-789f08b6${_scopeId8}><span data-v-789f08b6${_scopeId8}>Status: ${ssrInterpolate(item.status || "—")}</span>`);
                                                            if (item.capacity !== null) {
                                                              _push9(`<span data-v-789f08b6${_scopeId8}>• Capacity: ${ssrInterpolate(item.capacity)}</span>`);
                                                            } else {
                                                              _push9(`<!---->`);
                                                            }
                                                            _push9(`</div><div class="classroom-meta" data-v-789f08b6${_scopeId8}><span data-v-789f08b6${_scopeId8}>Starts: ${ssrInterpolate(formatDate(item.startsAt))}</span><span data-v-789f08b6${_scopeId8}>• Ends: ${ssrInterpolate(formatDate(item.endsAt))}</span></div><div class="classroom-meta" data-v-789f08b6${_scopeId8}><span data-v-789f08b6${_scopeId8}>Next due: ${ssrInterpolate(nextDueByClassroom(item.id))}</span></div></div>`);
                                                          } else {
                                                            return [
                                                              createVNode("div", { class: "classroom-item" }, [
                                                                createVNode("div", { class: "classroom-title" }, [
                                                                  createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                  createVNode("span", null, toDisplayString(item.title), 1),
                                                                  item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                                    key: 0,
                                                                    color: "green",
                                                                    style: { "margin-left": "8px" }
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("Enrolled")
                                                                    ]),
                                                                    _: 1
                                                                  })) : createCommentVNode("", true)
                                                                ]),
                                                                createVNode("div", { class: "classroom-meta" }, [
                                                                  createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                  item.teacherId ? (openBlock(), createBlock("span", { key: 0 }, "• Teacher: " + toDisplayString(item.teacherId), 1)) : createCommentVNode("", true)
                                                                ]),
                                                                createVNode("div", { class: "classroom-meta" }, [
                                                                  createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                                  item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, "• Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                                ]),
                                                                createVNode("div", { class: "classroom-meta" }, [
                                                                  createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                                  createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                                ]),
                                                                createVNode("div", { class: "classroom-meta" }, [
                                                                  createVNode("span", null, "Next due: " + toDisplayString(nextDueByClassroom(item.id)), 1)
                                                                ])
                                                              ])
                                                            ];
                                                          }
                                                        }),
                                                        _: 2
                                                      }, _parent8, _scopeId7));
                                                    } else {
                                                      return [
                                                        createVNode(_component_a_list_item, {
                                                          onClick: ($event) => focusClassroom(item),
                                                          style: { "cursor": "pointer" }
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "classroom-item" }, [
                                                              createVNode("div", { class: "classroom-title" }, [
                                                                createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                createVNode("span", null, toDisplayString(item.title), 1),
                                                                item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                                  key: 0,
                                                                  color: "green",
                                                                  style: { "margin-left": "8px" }
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("Enrolled")
                                                                  ]),
                                                                  _: 1
                                                                })) : createCommentVNode("", true)
                                                              ]),
                                                              createVNode("div", { class: "classroom-meta" }, [
                                                                createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                item.teacherId ? (openBlock(), createBlock("span", { key: 0 }, "• Teacher: " + toDisplayString(item.teacherId), 1)) : createCommentVNode("", true)
                                                              ]),
                                                              createVNode("div", { class: "classroom-meta" }, [
                                                                createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                                item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, "• Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                              ]),
                                                              createVNode("div", { class: "classroom-meta" }, [
                                                                createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                                createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                              ]),
                                                              createVNode("div", { class: "classroom-meta" }, [
                                                                createVNode("span", null, "Next due: " + toDisplayString(nextDueByClassroom(item.id)), 1)
                                                              ])
                                                            ])
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["onClick"])
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                              } else {
                                                return [
                                                  createVNode(_component_a_list, {
                                                    size: "small",
                                                    "data-source": classroomsByDepartment(dept.id),
                                                    locale: { emptyText: "No classrooms" }
                                                  }, {
                                                    renderItem: withCtx(({ item }) => [
                                                      createVNode(_component_a_list_item, {
                                                        onClick: ($event) => focusClassroom(item),
                                                        style: { "cursor": "pointer" }
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode("div", { class: "classroom-item" }, [
                                                            createVNode("div", { class: "classroom-title" }, [
                                                              createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                              createVNode("span", null, toDisplayString(item.title), 1),
                                                              item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                                key: 0,
                                                                color: "green",
                                                                style: { "margin-left": "8px" }
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("Enrolled")
                                                                ]),
                                                                _: 1
                                                              })) : createCommentVNode("", true)
                                                            ]),
                                                            createVNode("div", { class: "classroom-meta" }, [
                                                              createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                              item.teacherId ? (openBlock(), createBlock("span", { key: 0 }, "• Teacher: " + toDisplayString(item.teacherId), 1)) : createCommentVNode("", true)
                                                            ]),
                                                            createVNode("div", { class: "classroom-meta" }, [
                                                              createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                              item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, "• Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                            ]),
                                                            createVNode("div", { class: "classroom-meta" }, [
                                                              createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                              createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                            ]),
                                                            createVNode("div", { class: "classroom-meta" }, [
                                                              createVNode("span", null, "Next due: " + toDisplayString(nextDueByClassroom(item.id)), 1)
                                                            ])
                                                          ])
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["onClick"])
                                                    ]),
                                                    _: 1
                                                  }, 8, ["data-source"])
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent6, _scopeId5));
                                        });
                                        _push6(`<!--]-->`);
                                        _push6(ssrRenderComponent(_component_a_collapse_panel, {
                                          key: "other",
                                          header: "Other classrooms"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(_component_a_list, {
                                                size: "small",
                                                "data-source": classroomsWithoutDepartment.value,
                                                locale: { emptyText: "No other classrooms" }
                                              }, {
                                                renderItem: withCtx(({ item }, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(_component_a_list_item, {
                                                      onClick: ($event) => focusClassroom(item),
                                                      style: { "cursor": "pointer" }
                                                    }, {
                                                      default: withCtx((_7, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(`<div class="classroom-item" data-v-789f08b6${_scopeId8}><div class="classroom-title" data-v-789f08b6${_scopeId8}>`);
                                                          _push9(ssrRenderComponent(unref(BookOutlined), { class: "section-icon" }, null, _parent9, _scopeId8));
                                                          _push9(`<span data-v-789f08b6${_scopeId8}>${ssrInterpolate(item.title)}</span></div><div class="classroom-meta" data-v-789f08b6${_scopeId8}><span data-v-789f08b6${_scopeId8}>Code: ${ssrInterpolate(item.code)}</span><span data-v-789f08b6${_scopeId8}>• Status: ${ssrInterpolate(item.status || "—")}</span></div></div>`);
                                                        } else {
                                                          return [
                                                            createVNode("div", { class: "classroom-item" }, [
                                                              createVNode("div", { class: "classroom-title" }, [
                                                                createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                createVNode("span", null, toDisplayString(item.title), 1)
                                                              ]),
                                                              createVNode("div", { class: "classroom-meta" }, [
                                                                createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                              ])
                                                            ])
                                                          ];
                                                        }
                                                      }),
                                                      _: 2
                                                    }, _parent8, _scopeId7));
                                                  } else {
                                                    return [
                                                      createVNode(_component_a_list_item, {
                                                        onClick: ($event) => focusClassroom(item),
                                                        style: { "cursor": "pointer" }
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode("div", { class: "classroom-item" }, [
                                                            createVNode("div", { class: "classroom-title" }, [
                                                              createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                              createVNode("span", null, toDisplayString(item.title), 1)
                                                            ]),
                                                            createVNode("div", { class: "classroom-meta" }, [
                                                              createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                              createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                            ])
                                                          ])
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["onClick"])
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(_component_a_list, {
                                                  size: "small",
                                                  "data-source": classroomsWithoutDepartment.value,
                                                  locale: { emptyText: "No other classrooms" }
                                                }, {
                                                  renderItem: withCtx(({ item }) => [
                                                    createVNode(_component_a_list_item, {
                                                      onClick: ($event) => focusClassroom(item),
                                                      style: { "cursor": "pointer" }
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode("div", { class: "classroom-item" }, [
                                                          createVNode("div", { class: "classroom-title" }, [
                                                            createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                            createVNode("span", null, toDisplayString(item.title), 1)
                                                          ]),
                                                          createVNode("div", { class: "classroom-meta" }, [
                                                            createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                            createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                          ])
                                                        ])
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["onClick"])
                                                  ]),
                                                  _: 1
                                                }, 8, ["data-source"])
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          (openBlock(true), createBlock(Fragment, null, renderList(activeDepartments.value, (dept) => {
                                            return openBlock(), createBlock(_component_a_collapse_panel, {
                                              key: dept.id,
                                              header: dept.name
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_list, {
                                                  size: "small",
                                                  "data-source": classroomsByDepartment(dept.id),
                                                  locale: { emptyText: "No classrooms" }
                                                }, {
                                                  renderItem: withCtx(({ item }) => [
                                                    createVNode(_component_a_list_item, {
                                                      onClick: ($event) => focusClassroom(item),
                                                      style: { "cursor": "pointer" }
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode("div", { class: "classroom-item" }, [
                                                          createVNode("div", { class: "classroom-title" }, [
                                                            createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                            createVNode("span", null, toDisplayString(item.title), 1),
                                                            item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                              key: 0,
                                                              color: "green",
                                                              style: { "margin-left": "8px" }
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("Enrolled")
                                                              ]),
                                                              _: 1
                                                            })) : createCommentVNode("", true)
                                                          ]),
                                                          createVNode("div", { class: "classroom-meta" }, [
                                                            createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                            item.teacherId ? (openBlock(), createBlock("span", { key: 0 }, "• Teacher: " + toDisplayString(item.teacherId), 1)) : createCommentVNode("", true)
                                                          ]),
                                                          createVNode("div", { class: "classroom-meta" }, [
                                                            createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                            item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, "• Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                          ]),
                                                          createVNode("div", { class: "classroom-meta" }, [
                                                            createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                            createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                          ]),
                                                          createVNode("div", { class: "classroom-meta" }, [
                                                            createVNode("span", null, "Next due: " + toDisplayString(nextDueByClassroom(item.id)), 1)
                                                          ])
                                                        ])
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["onClick"])
                                                  ]),
                                                  _: 1
                                                }, 8, ["data-source"])
                                              ]),
                                              _: 2
                                            }, 1032, ["header"]);
                                          }), 128)),
                                          createVNode(_component_a_collapse_panel, {
                                            key: "other",
                                            header: "Other classrooms"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_list, {
                                                size: "small",
                                                "data-source": classroomsWithoutDepartment.value,
                                                locale: { emptyText: "No other classrooms" }
                                              }, {
                                                renderItem: withCtx(({ item }) => [
                                                  createVNode(_component_a_list_item, {
                                                    onClick: ($event) => focusClassroom(item),
                                                    style: { "cursor": "pointer" }
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "classroom-item" }, [
                                                        createVNode("div", { class: "classroom-title" }, [
                                                          createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                          createVNode("span", null, toDisplayString(item.title), 1)
                                                        ]),
                                                        createVNode("div", { class: "classroom-meta" }, [
                                                          createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                          createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                        ])
                                                      ])
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["onClick"])
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
                                  }, _parent5, _scopeId4));
                                  _push5(ssrRenderComponent(_component_a_divider, null, null, _parent5, _scopeId4));
                                  _push5(ssrRenderComponent(_component_a_card, {
                                    size: "small",
                                    bordered: false,
                                    title: "My Institution Courses"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_component_a_list, {
                                          size: "small",
                                          "data-source": courses.value,
                                          locale: { emptyText: "No enrolled courses" }
                                        }, {
                                          renderItem: withCtx(({ item }, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(_component_a_list_item, {
                                                onClick: ($event) => focusCourse(item),
                                                style: { "cursor": "pointer" }
                                              }, {
                                                default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px" })}" data-v-789f08b6${_scopeId7}><span data-v-789f08b6${_scopeId7}>${ssrInterpolate(item.title)}</span>`);
                                                    _push8(ssrRenderComponent(_component_a_progress, {
                                                      percent: item.progressPct,
                                                      size: "small",
                                                      style: { "width": "120px" }
                                                    }, null, _parent8, _scopeId7));
                                                    _push8(`</div>`);
                                                  } else {
                                                    return [
                                                      createVNode("div", { style: { "display": "flex", "align-items": "center", "gap": "8px" } }, [
                                                        createVNode("span", null, toDisplayString(item.title), 1),
                                                        createVNode(_component_a_progress, {
                                                          percent: item.progressPct,
                                                          size: "small",
                                                          style: { "width": "120px" }
                                                        }, null, 8, ["percent"])
                                                      ])
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(_component_a_list_item, {
                                                  onClick: ($event) => focusCourse(item),
                                                  style: { "cursor": "pointer" }
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode("div", { style: { "display": "flex", "align-items": "center", "gap": "8px" } }, [
                                                      createVNode("span", null, toDisplayString(item.title), 1),
                                                      createVNode(_component_a_progress, {
                                                        percent: item.progressPct,
                                                        size: "small",
                                                        style: { "width": "120px" }
                                                      }, null, 8, ["percent"])
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["onClick"])
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(_component_a_list, {
                                            size: "small",
                                            "data-source": courses.value,
                                            locale: { emptyText: "No enrolled courses" }
                                          }, {
                                            renderItem: withCtx(({ item }) => [
                                              createVNode(_component_a_list_item, {
                                                onClick: ($event) => focusCourse(item),
                                                style: { "cursor": "pointer" }
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode("div", { style: { "display": "flex", "align-items": "center", "gap": "8px" } }, [
                                                    createVNode("span", null, toDisplayString(item.title), 1),
                                                    createVNode(_component_a_progress, {
                                                      percent: item.progressPct,
                                                      size: "small",
                                                      style: { "width": "120px" }
                                                    }, null, 8, ["percent"])
                                                  ])
                                                ]),
                                                _: 2
                                              }, 1032, ["onClick"])
                                            ]),
                                            _: 1
                                          }, 8, ["data-source"])
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode("div", { class: "section-header" }, [
                                      createVNode("span", { class: "section-title" }, [
                                        createVNode(unref(ClusterOutlined), { class: "section-icon" }),
                                        createTextVNode(" Departments ")
                                      ]),
                                      createVNode(_component_a_switch, {
                                        checked: showOnlyMyClassrooms.value,
                                        "onUpdate:checked": ($event) => showOnlyMyClassrooms.value = $event,
                                        size: "small",
                                        style: { "margin-left": "auto" }
                                      }, null, 8, ["checked", "onUpdate:checked"]),
                                      createVNode("span", { class: "filter-label" }, "Show only my classrooms")
                                    ]),
                                    createVNode(_component_a_collapse, { accordion: "" }, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(activeDepartments.value, (dept) => {
                                          return openBlock(), createBlock(_component_a_collapse_panel, {
                                            key: dept.id,
                                            header: dept.name
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_list, {
                                                size: "small",
                                                "data-source": classroomsByDepartment(dept.id),
                                                locale: { emptyText: "No classrooms" }
                                              }, {
                                                renderItem: withCtx(({ item }) => [
                                                  createVNode(_component_a_list_item, {
                                                    onClick: ($event) => focusClassroom(item),
                                                    style: { "cursor": "pointer" }
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "classroom-item" }, [
                                                        createVNode("div", { class: "classroom-title" }, [
                                                          createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                          createVNode("span", null, toDisplayString(item.title), 1),
                                                          item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                            key: 0,
                                                            color: "green",
                                                            style: { "margin-left": "8px" }
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Enrolled")
                                                            ]),
                                                            _: 1
                                                          })) : createCommentVNode("", true)
                                                        ]),
                                                        createVNode("div", { class: "classroom-meta" }, [
                                                          createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                          item.teacherId ? (openBlock(), createBlock("span", { key: 0 }, "• Teacher: " + toDisplayString(item.teacherId), 1)) : createCommentVNode("", true)
                                                        ]),
                                                        createVNode("div", { class: "classroom-meta" }, [
                                                          createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                          item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, "• Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                        ]),
                                                        createVNode("div", { class: "classroom-meta" }, [
                                                          createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                          createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                        ]),
                                                        createVNode("div", { class: "classroom-meta" }, [
                                                          createVNode("span", null, "Next due: " + toDisplayString(nextDueByClassroom(item.id)), 1)
                                                        ])
                                                      ])
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["onClick"])
                                                ]),
                                                _: 1
                                              }, 8, ["data-source"])
                                            ]),
                                            _: 2
                                          }, 1032, ["header"]);
                                        }), 128)),
                                        createVNode(_component_a_collapse_panel, {
                                          key: "other",
                                          header: "Other classrooms"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_list, {
                                              size: "small",
                                              "data-source": classroomsWithoutDepartment.value,
                                              locale: { emptyText: "No other classrooms" }
                                            }, {
                                              renderItem: withCtx(({ item }) => [
                                                createVNode(_component_a_list_item, {
                                                  onClick: ($event) => focusClassroom(item),
                                                  style: { "cursor": "pointer" }
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode("div", { class: "classroom-item" }, [
                                                      createVNode("div", { class: "classroom-title" }, [
                                                        createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                        createVNode("span", null, toDisplayString(item.title), 1)
                                                      ]),
                                                      createVNode("div", { class: "classroom-meta" }, [
                                                        createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                        createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                      ])
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["onClick"])
                                              ]),
                                              _: 1
                                            }, 8, ["data-source"])
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_divider),
                                    createVNode(_component_a_card, {
                                      size: "small",
                                      bordered: false,
                                      title: "My Institution Courses"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_list, {
                                          size: "small",
                                          "data-source": courses.value,
                                          locale: { emptyText: "No enrolled courses" }
                                        }, {
                                          renderItem: withCtx(({ item }) => [
                                            createVNode(_component_a_list_item, {
                                              onClick: ($event) => focusCourse(item),
                                              style: { "cursor": "pointer" }
                                            }, {
                                              default: withCtx(() => [
                                                createVNode("div", { style: { "display": "flex", "align-items": "center", "gap": "8px" } }, [
                                                  createVNode("span", null, toDisplayString(item.title), 1),
                                                  createVNode(_component_a_progress, {
                                                    percent: item.progressPct,
                                                    size: "small",
                                                    style: { "width": "120px" }
                                                  }, null, 8, ["percent"])
                                                ])
                                              ]),
                                              _: 2
                                            }, 1032, ["onClick"])
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
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_a_card, {
                                size: "small",
                                title: "Institution Programs & Classrooms"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "section-header" }, [
                                    createVNode("span", { class: "section-title" }, [
                                      createVNode(unref(ClusterOutlined), { class: "section-icon" }),
                                      createTextVNode(" Departments ")
                                    ]),
                                    createVNode(_component_a_switch, {
                                      checked: showOnlyMyClassrooms.value,
                                      "onUpdate:checked": ($event) => showOnlyMyClassrooms.value = $event,
                                      size: "small",
                                      style: { "margin-left": "auto" }
                                    }, null, 8, ["checked", "onUpdate:checked"]),
                                    createVNode("span", { class: "filter-label" }, "Show only my classrooms")
                                  ]),
                                  createVNode(_component_a_collapse, { accordion: "" }, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(activeDepartments.value, (dept) => {
                                        return openBlock(), createBlock(_component_a_collapse_panel, {
                                          key: dept.id,
                                          header: dept.name
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_list, {
                                              size: "small",
                                              "data-source": classroomsByDepartment(dept.id),
                                              locale: { emptyText: "No classrooms" }
                                            }, {
                                              renderItem: withCtx(({ item }) => [
                                                createVNode(_component_a_list_item, {
                                                  onClick: ($event) => focusClassroom(item),
                                                  style: { "cursor": "pointer" }
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode("div", { class: "classroom-item" }, [
                                                      createVNode("div", { class: "classroom-title" }, [
                                                        createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                        createVNode("span", null, toDisplayString(item.title), 1),
                                                        item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                          key: 0,
                                                          color: "green",
                                                          style: { "margin-left": "8px" }
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Enrolled")
                                                          ]),
                                                          _: 1
                                                        })) : createCommentVNode("", true)
                                                      ]),
                                                      createVNode("div", { class: "classroom-meta" }, [
                                                        createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                        item.teacherId ? (openBlock(), createBlock("span", { key: 0 }, "• Teacher: " + toDisplayString(item.teacherId), 1)) : createCommentVNode("", true)
                                                      ]),
                                                      createVNode("div", { class: "classroom-meta" }, [
                                                        createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                        item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, "• Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                      ]),
                                                      createVNode("div", { class: "classroom-meta" }, [
                                                        createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                        createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                      ]),
                                                      createVNode("div", { class: "classroom-meta" }, [
                                                        createVNode("span", null, "Next due: " + toDisplayString(nextDueByClassroom(item.id)), 1)
                                                      ])
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["onClick"])
                                              ]),
                                              _: 1
                                            }, 8, ["data-source"])
                                          ]),
                                          _: 2
                                        }, 1032, ["header"]);
                                      }), 128)),
                                      createVNode(_component_a_collapse_panel, {
                                        key: "other",
                                        header: "Other classrooms"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_list, {
                                            size: "small",
                                            "data-source": classroomsWithoutDepartment.value,
                                            locale: { emptyText: "No other classrooms" }
                                          }, {
                                            renderItem: withCtx(({ item }) => [
                                              createVNode(_component_a_list_item, {
                                                onClick: ($event) => focusClassroom(item),
                                                style: { "cursor": "pointer" }
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode("div", { class: "classroom-item" }, [
                                                    createVNode("div", { class: "classroom-title" }, [
                                                      createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                      createVNode("span", null, toDisplayString(item.title), 1)
                                                    ]),
                                                    createVNode("div", { class: "classroom-meta" }, [
                                                      createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                      createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                    ])
                                                  ])
                                                ]),
                                                _: 2
                                              }, 1032, ["onClick"])
                                            ]),
                                            _: 1
                                          }, 8, ["data-source"])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_divider),
                                  createVNode(_component_a_card, {
                                    size: "small",
                                    bordered: false,
                                    title: "My Institution Courses"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_list, {
                                        size: "small",
                                        "data-source": courses.value,
                                        locale: { emptyText: "No enrolled courses" }
                                      }, {
                                        renderItem: withCtx(({ item }) => [
                                          createVNode(_component_a_list_item, {
                                            onClick: ($event) => focusCourse(item),
                                            style: { "cursor": "pointer" }
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("div", { style: { "display": "flex", "align-items": "center", "gap": "8px" } }, [
                                                createVNode("span", null, toDisplayString(item.title), 1),
                                                createVNode(_component_a_progress, {
                                                  percent: item.progressPct,
                                                  size: "small",
                                                  style: { "width": "120px" }
                                                }, null, 8, ["percent"])
                                              ])
                                            ]),
                                            _: 2
                                          }, 1032, ["onClick"])
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
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(_component_a_col, {
                        xs: 24,
                        md: 8
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_a_card, {
                              size: "small",
                              title: centerTitle.value
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  if (!focusedCourseId.value) {
                                    _push5(ssrRenderComponent(_component_a_empty, { description: "Select a classroom or course" }, null, _parent5, _scopeId4));
                                  } else {
                                    _push5(`<!--[--><div class="section-header" data-v-789f08b6${_scopeId4}><span class="section-title" data-v-789f08b6${_scopeId4}>`);
                                    _push5(ssrRenderComponent(unref(DashboardOutlined), { class: "section-icon" }, null, _parent5, _scopeId4));
                                    _push5(` Active Modules </span>`);
                                    _push5(ssrRenderComponent(_component_a_button, {
                                      size: "small",
                                      type: "primary",
                                      href: continueLink.value,
                                      disabled: !continueLink.value
                                    }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(`Continue where you left off`);
                                        } else {
                                          return [
                                            createTextVNode("Continue where you left off")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent5, _scopeId4));
                                    _push5(`</div>`);
                                    _push5(ssrRenderComponent(_component_a_table, {
                                      size: "small",
                                      dataSource: moduleRows.value,
                                      columns: moduleColumns,
                                      pagination: { pageSize: 6 },
                                      "row-key": "id"
                                    }, {
                                      bodyCell: withCtx(({ column, record }, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          if (column.key === "status") {
                                            _push6(ssrRenderComponent(_component_a_space, null, {
                                              default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                                if (_push7) {
                                                  _push7(ssrRenderComponent(_component_a_tag, { color: "green" }, {
                                                    default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                      if (_push8) {
                                                        _push8(`${ssrInterpolate(record.completed)} done`);
                                                      } else {
                                                        return [
                                                          createTextVNode(toDisplayString(record.completed) + " done", 1)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent7, _scopeId6));
                                                  _push7(ssrRenderComponent(_component_a_tag, { color: "blue" }, {
                                                    default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                      if (_push8) {
                                                        _push8(`${ssrInterpolate(record.inProgress)} in-progress`);
                                                      } else {
                                                        return [
                                                          createTextVNode(toDisplayString(record.inProgress) + " in-progress", 1)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent7, _scopeId6));
                                                  _push7(ssrRenderComponent(_component_a_tag, null, {
                                                    default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                      if (_push8) {
                                                        _push8(`${ssrInterpolate(record.notStarted)} not-started`);
                                                      } else {
                                                        return [
                                                          createTextVNode(toDisplayString(record.notStarted) + " not-started", 1)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent7, _scopeId6));
                                                } else {
                                                  return [
                                                    createVNode(_component_a_tag, { color: "green" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(record.completed) + " done", 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode(_component_a_tag, { color: "blue" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(record.inProgress) + " in-progress", 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode(_component_a_tag, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(record.notStarted) + " not-started", 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent6, _scopeId5));
                                          } else if (column.key === "next") {
                                            _push6(`<span data-v-789f08b6${_scopeId5}>${ssrInterpolate(record.nextLabel)}</span>`);
                                          } else {
                                            _push6(`<!---->`);
                                          }
                                        } else {
                                          return [
                                            column.key === "status" ? (openBlock(), createBlock(_component_a_space, { key: 0 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_tag, { color: "green" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(record.completed) + " done", 1)
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(_component_a_tag, { color: "blue" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(record.inProgress) + " in-progress", 1)
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(_component_a_tag, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(record.notStarted) + " not-started", 1)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1024)) : column.key === "next" ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(record.nextLabel), 1)) : createCommentVNode("", true)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent5, _scopeId4));
                                    _push5(ssrRenderComponent(_component_a_divider, null, null, _parent5, _scopeId4));
                                    _push5(`<div class="section-header" data-v-789f08b6${_scopeId4}><span class="section-title" data-v-789f08b6${_scopeId4}>`);
                                    _push5(ssrRenderComponent(unref(CalendarOutlined), { class: "section-icon" }, null, _parent5, _scopeId4));
                                    _push5(` Next Assignment </span></div>`);
                                    _push5(ssrRenderComponent(_component_a_list, {
                                      size: "small",
                                      "data-source": nextAssignmentsForFocus.value,
                                      locale: { emptyText: "No upcoming assignments" }
                                    }, {
                                      renderItem: withCtx(({ item }, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(ssrRenderComponent(_component_a_list_item, null, {
                                            default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                              if (_push7) {
                                                _push7(`<div style="${ssrRenderStyle({ "display": "flex", "gap": "8px", "align-items": "center" })}" data-v-789f08b6${_scopeId6}><span data-v-789f08b6${_scopeId6}>${ssrInterpolate(item.title)}</span>`);
                                                _push7(ssrRenderComponent(_component_a_tag, null, {
                                                  default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(`${ssrInterpolate(formatDate(item.dueDate))}`);
                                                    } else {
                                                      return [
                                                        createTextVNode(toDisplayString(formatDate(item.dueDate)), 1)
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                                if (item.submissionStatus === "graded") {
                                                  _push7(ssrRenderComponent(_component_a_tag, { color: "green" }, {
                                                    default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                      if (_push8) {
                                                        _push8(`Graded`);
                                                      } else {
                                                        return [
                                                          createTextVNode("Graded")
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent7, _scopeId6));
                                                } else if (item.submissionStatus === "submitted") {
                                                  _push7(ssrRenderComponent(_component_a_tag, { color: "blue" }, {
                                                    default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                      if (_push8) {
                                                        _push8(`Submitted`);
                                                      } else {
                                                        return [
                                                          createTextVNode("Submitted")
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent7, _scopeId6));
                                                } else {
                                                  _push7(ssrRenderComponent(_component_a_tag, null, {
                                                    default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                      if (_push8) {
                                                        _push8(`Not submitted`);
                                                      } else {
                                                        return [
                                                          createTextVNode("Not submitted")
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent7, _scopeId6));
                                                }
                                                _push7(`</div>`);
                                              } else {
                                                return [
                                                  createVNode("div", { style: { "display": "flex", "gap": "8px", "align-items": "center" } }, [
                                                    createVNode("span", null, toDisplayString(item.title), 1),
                                                    createVNode(_component_a_tag, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(formatDate(item.dueDate)), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    item.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                      key: 0,
                                                      color: "green"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Graded")
                                                      ]),
                                                      _: 1
                                                    })) : item.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                      key: 1,
                                                      color: "blue"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Submitted")
                                                      ]),
                                                      _: 1
                                                    })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Not submitted")
                                                      ]),
                                                      _: 1
                                                    }))
                                                  ])
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent6, _scopeId5));
                                        } else {
                                          return [
                                            createVNode(_component_a_list_item, null, {
                                              default: withCtx(() => [
                                                createVNode("div", { style: { "display": "flex", "gap": "8px", "align-items": "center" } }, [
                                                  createVNode("span", null, toDisplayString(item.title), 1),
                                                  createVNode(_component_a_tag, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(formatDate(item.dueDate)), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  item.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                    key: 0,
                                                    color: "green"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Graded")
                                                    ]),
                                                    _: 1
                                                  })) : item.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                    key: 1,
                                                    color: "blue"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Submitted")
                                                    ]),
                                                    _: 1
                                                  })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Not submitted")
                                                    ]),
                                                    _: 1
                                                  }))
                                                ])
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent5, _scopeId4));
                                    _push5(`<!--]-->`);
                                  }
                                } else {
                                  return [
                                    !focusedCourseId.value ? (openBlock(), createBlock(_component_a_empty, {
                                      key: 0,
                                      description: "Select a classroom or course"
                                    })) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                      createVNode("div", { class: "section-header" }, [
                                        createVNode("span", { class: "section-title" }, [
                                          createVNode(unref(DashboardOutlined), { class: "section-icon" }),
                                          createTextVNode(" Active Modules ")
                                        ]),
                                        createVNode(_component_a_button, {
                                          size: "small",
                                          type: "primary",
                                          href: continueLink.value,
                                          disabled: !continueLink.value
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Continue where you left off")
                                          ]),
                                          _: 1
                                        }, 8, ["href", "disabled"])
                                      ]),
                                      createVNode(_component_a_table, {
                                        size: "small",
                                        dataSource: moduleRows.value,
                                        columns: moduleColumns,
                                        pagination: { pageSize: 6 },
                                        "row-key": "id"
                                      }, {
                                        bodyCell: withCtx(({ column, record }) => [
                                          column.key === "status" ? (openBlock(), createBlock(_component_a_space, { key: 0 }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_tag, { color: "green" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(record.completed) + " done", 1)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(_component_a_tag, { color: "blue" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(record.inProgress) + " in-progress", 1)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(_component_a_tag, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(record.notStarted) + " not-started", 1)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1024)) : column.key === "next" ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(record.nextLabel), 1)) : createCommentVNode("", true)
                                        ]),
                                        _: 1
                                      }, 8, ["dataSource"]),
                                      createVNode(_component_a_divider),
                                      createVNode("div", { class: "section-header" }, [
                                        createVNode("span", { class: "section-title" }, [
                                          createVNode(unref(CalendarOutlined), { class: "section-icon" }),
                                          createTextVNode(" Next Assignment ")
                                        ])
                                      ]),
                                      createVNode(_component_a_list, {
                                        size: "small",
                                        "data-source": nextAssignmentsForFocus.value,
                                        locale: { emptyText: "No upcoming assignments" }
                                      }, {
                                        renderItem: withCtx(({ item }) => [
                                          createVNode(_component_a_list_item, null, {
                                            default: withCtx(() => [
                                              createVNode("div", { style: { "display": "flex", "gap": "8px", "align-items": "center" } }, [
                                                createVNode("span", null, toDisplayString(item.title), 1),
                                                createVNode(_component_a_tag, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(formatDate(item.dueDate)), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                item.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                  key: 0,
                                                  color: "green"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Graded")
                                                  ]),
                                                  _: 1
                                                })) : item.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                  key: 1,
                                                  color: "blue"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Submitted")
                                                  ]),
                                                  _: 1
                                                })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Not submitted")
                                                  ]),
                                                  _: 1
                                                }))
                                              ])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 1
                                      }, 8, ["data-source"])
                                    ], 64))
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_a_card, {
                                size: "small",
                                title: centerTitle.value
                              }, {
                                default: withCtx(() => [
                                  !focusedCourseId.value ? (openBlock(), createBlock(_component_a_empty, {
                                    key: 0,
                                    description: "Select a classroom or course"
                                  })) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                    createVNode("div", { class: "section-header" }, [
                                      createVNode("span", { class: "section-title" }, [
                                        createVNode(unref(DashboardOutlined), { class: "section-icon" }),
                                        createTextVNode(" Active Modules ")
                                      ]),
                                      createVNode(_component_a_button, {
                                        size: "small",
                                        type: "primary",
                                        href: continueLink.value,
                                        disabled: !continueLink.value
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Continue where you left off")
                                        ]),
                                        _: 1
                                      }, 8, ["href", "disabled"])
                                    ]),
                                    createVNode(_component_a_table, {
                                      size: "small",
                                      dataSource: moduleRows.value,
                                      columns: moduleColumns,
                                      pagination: { pageSize: 6 },
                                      "row-key": "id"
                                    }, {
                                      bodyCell: withCtx(({ column, record }) => [
                                        column.key === "status" ? (openBlock(), createBlock(_component_a_space, { key: 0 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_tag, { color: "green" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(record.completed) + " done", 1)
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(_component_a_tag, { color: "blue" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(record.inProgress) + " in-progress", 1)
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(_component_a_tag, null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(record.notStarted) + " not-started", 1)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024)) : column.key === "next" ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(record.nextLabel), 1)) : createCommentVNode("", true)
                                      ]),
                                      _: 1
                                    }, 8, ["dataSource"]),
                                    createVNode(_component_a_divider),
                                    createVNode("div", { class: "section-header" }, [
                                      createVNode("span", { class: "section-title" }, [
                                        createVNode(unref(CalendarOutlined), { class: "section-icon" }),
                                        createTextVNode(" Next Assignment ")
                                      ])
                                    ]),
                                    createVNode(_component_a_list, {
                                      size: "small",
                                      "data-source": nextAssignmentsForFocus.value,
                                      locale: { emptyText: "No upcoming assignments" }
                                    }, {
                                      renderItem: withCtx(({ item }) => [
                                        createVNode(_component_a_list_item, null, {
                                          default: withCtx(() => [
                                            createVNode("div", { style: { "display": "flex", "gap": "8px", "align-items": "center" } }, [
                                              createVNode("span", null, toDisplayString(item.title), 1),
                                              createVNode(_component_a_tag, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(formatDate(item.dueDate)), 1)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              item.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                key: 0,
                                                color: "green"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Graded")
                                                ]),
                                                _: 1
                                              })) : item.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                key: 1,
                                                color: "blue"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Submitted")
                                                ]),
                                                _: 1
                                              })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Not submitted")
                                                ]),
                                                _: 1
                                              }))
                                            ])
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 1
                                    }, 8, ["data-source"])
                                  ], 64))
                                ]),
                                _: 1
                              }, 8, ["title"])
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(_component_a_col, {
                        xs: 24,
                        md: 8
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_a_card, {
                              size: "small",
                              title: "Discover & Normal Courses"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_a_input, {
                                    value: discoverQuery.value,
                                    "onUpdate:value": ($event) => discoverQuery.value = $event,
                                    placeholder: "Search courses",
                                    style: { "margin-bottom": "8px" }
                                  }, null, _parent5, _scopeId4));
                                  _push5(ssrRenderComponent(_component_a_list, {
                                    size: "small",
                                    "data-source": discoverFiltered.value,
                                    locale: { emptyText: "No recommendations" }
                                  }, {
                                    renderItem: withCtx(({ item }, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_component_a_list_item, null, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px", "flex-wrap": "wrap" })}" data-v-789f08b6${_scopeId6}><span data-v-789f08b6${_scopeId6}>${ssrInterpolate(item.title)}</span>`);
                                              if (isInstitutionCourse(item)) {
                                                _push7(ssrRenderComponent(_component_a_tag, { color: "geekblue" }, {
                                                  default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(`Institution course`);
                                                    } else {
                                                      return [
                                                        createTextVNode("Institution course")
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                              } else {
                                                _push7(ssrRenderComponent(_component_a_tag, { color: "purple" }, {
                                                  default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(`Global course`);
                                                    } else {
                                                      return [
                                                        createTextVNode("Global course")
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                              }
                                              _push7(ssrRenderComponent(_component_a_tag, null, {
                                                default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(item.difficulty || "—")}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(item.difficulty || "—"), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(_component_a_button, {
                                                size: "small",
                                                type: "link",
                                                href: courseDeepLink(item)
                                              }, {
                                                default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`View details`);
                                                  } else {
                                                    return [
                                                      createTextVNode("View details")
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                              _push7(`</div>`);
                                            } else {
                                              return [
                                                createVNode("div", { style: { "display": "flex", "align-items": "center", "gap": "8px", "flex-wrap": "wrap" } }, [
                                                  createVNode("span", null, toDisplayString(item.title), 1),
                                                  isInstitutionCourse(item) ? (openBlock(), createBlock(_component_a_tag, {
                                                    key: 0,
                                                    color: "geekblue"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Institution course")
                                                    ]),
                                                    _: 1
                                                  })) : (openBlock(), createBlock(_component_a_tag, {
                                                    key: 1,
                                                    color: "purple"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Global course")
                                                    ]),
                                                    _: 1
                                                  })),
                                                  createVNode(_component_a_tag, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(item.difficulty || "—"), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode(_component_a_button, {
                                                    size: "small",
                                                    type: "link",
                                                    href: courseDeepLink(item)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("View details")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["href"])
                                                ])
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(_component_a_list_item, null, {
                                            default: withCtx(() => [
                                              createVNode("div", { style: { "display": "flex", "align-items": "center", "gap": "8px", "flex-wrap": "wrap" } }, [
                                                createVNode("span", null, toDisplayString(item.title), 1),
                                                isInstitutionCourse(item) ? (openBlock(), createBlock(_component_a_tag, {
                                                  key: 0,
                                                  color: "geekblue"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Institution course")
                                                  ]),
                                                  _: 1
                                                })) : (openBlock(), createBlock(_component_a_tag, {
                                                  key: 1,
                                                  color: "purple"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Global course")
                                                  ]),
                                                  _: 1
                                                })),
                                                createVNode(_component_a_tag, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(item.difficulty || "—"), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(_component_a_button, {
                                                  size: "small",
                                                  type: "link",
                                                  href: courseDeepLink(item)
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("View details")
                                                  ]),
                                                  _: 1
                                                }, 8, ["href"])
                                              ])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(_component_a_input, {
                                      value: discoverQuery.value,
                                      "onUpdate:value": ($event) => discoverQuery.value = $event,
                                      placeholder: "Search courses",
                                      style: { "margin-bottom": "8px" }
                                    }, null, 8, ["value", "onUpdate:value"]),
                                    createVNode(_component_a_list, {
                                      size: "small",
                                      "data-source": discoverFiltered.value,
                                      locale: { emptyText: "No recommendations" }
                                    }, {
                                      renderItem: withCtx(({ item }) => [
                                        createVNode(_component_a_list_item, null, {
                                          default: withCtx(() => [
                                            createVNode("div", { style: { "display": "flex", "align-items": "center", "gap": "8px", "flex-wrap": "wrap" } }, [
                                              createVNode("span", null, toDisplayString(item.title), 1),
                                              isInstitutionCourse(item) ? (openBlock(), createBlock(_component_a_tag, {
                                                key: 0,
                                                color: "geekblue"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Institution course")
                                                ]),
                                                _: 1
                                              })) : (openBlock(), createBlock(_component_a_tag, {
                                                key: 1,
                                                color: "purple"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Global course")
                                                ]),
                                                _: 1
                                              })),
                                              createVNode(_component_a_tag, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(item.difficulty || "—"), 1)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(_component_a_button, {
                                                size: "small",
                                                type: "link",
                                                href: courseDeepLink(item)
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("View details")
                                                ]),
                                                _: 1
                                              }, 8, ["href"])
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
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_a_card, {
                                size: "small",
                                title: "Discover & Normal Courses"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_input, {
                                    value: discoverQuery.value,
                                    "onUpdate:value": ($event) => discoverQuery.value = $event,
                                    placeholder: "Search courses",
                                    style: { "margin-bottom": "8px" }
                                  }, null, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_list, {
                                    size: "small",
                                    "data-source": discoverFiltered.value,
                                    locale: { emptyText: "No recommendations" }
                                  }, {
                                    renderItem: withCtx(({ item }) => [
                                      createVNode(_component_a_list_item, null, {
                                        default: withCtx(() => [
                                          createVNode("div", { style: { "display": "flex", "align-items": "center", "gap": "8px", "flex-wrap": "wrap" } }, [
                                            createVNode("span", null, toDisplayString(item.title), 1),
                                            isInstitutionCourse(item) ? (openBlock(), createBlock(_component_a_tag, {
                                              key: 0,
                                              color: "geekblue"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Institution course")
                                              ]),
                                              _: 1
                                            })) : (openBlock(), createBlock(_component_a_tag, {
                                              key: 1,
                                              color: "purple"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Global course")
                                              ]),
                                              _: 1
                                            })),
                                            createVNode(_component_a_tag, null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(item.difficulty || "—"), 1)
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(_component_a_button, {
                                              size: "small",
                                              type: "link",
                                              href: courseDeepLink(item)
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("View details")
                                              ]),
                                              _: 1
                                            }, 8, ["href"])
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
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_a_col, {
                          xs: 24,
                          md: 8
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              size: "small",
                              title: "Institution Programs & Classrooms"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "section-header" }, [
                                  createVNode("span", { class: "section-title" }, [
                                    createVNode(unref(ClusterOutlined), { class: "section-icon" }),
                                    createTextVNode(" Departments ")
                                  ]),
                                  createVNode(_component_a_switch, {
                                    checked: showOnlyMyClassrooms.value,
                                    "onUpdate:checked": ($event) => showOnlyMyClassrooms.value = $event,
                                    size: "small",
                                    style: { "margin-left": "auto" }
                                  }, null, 8, ["checked", "onUpdate:checked"]),
                                  createVNode("span", { class: "filter-label" }, "Show only my classrooms")
                                ]),
                                createVNode(_component_a_collapse, { accordion: "" }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(activeDepartments.value, (dept) => {
                                      return openBlock(), createBlock(_component_a_collapse_panel, {
                                        key: dept.id,
                                        header: dept.name
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_list, {
                                            size: "small",
                                            "data-source": classroomsByDepartment(dept.id),
                                            locale: { emptyText: "No classrooms" }
                                          }, {
                                            renderItem: withCtx(({ item }) => [
                                              createVNode(_component_a_list_item, {
                                                onClick: ($event) => focusClassroom(item),
                                                style: { "cursor": "pointer" }
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode("div", { class: "classroom-item" }, [
                                                    createVNode("div", { class: "classroom-title" }, [
                                                      createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                      createVNode("span", null, toDisplayString(item.title), 1),
                                                      item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                        key: 0,
                                                        color: "green",
                                                        style: { "margin-left": "8px" }
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Enrolled")
                                                        ]),
                                                        _: 1
                                                      })) : createCommentVNode("", true)
                                                    ]),
                                                    createVNode("div", { class: "classroom-meta" }, [
                                                      createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                      item.teacherId ? (openBlock(), createBlock("span", { key: 0 }, "• Teacher: " + toDisplayString(item.teacherId), 1)) : createCommentVNode("", true)
                                                    ]),
                                                    createVNode("div", { class: "classroom-meta" }, [
                                                      createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                      item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, "• Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                    ]),
                                                    createVNode("div", { class: "classroom-meta" }, [
                                                      createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                      createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                    ]),
                                                    createVNode("div", { class: "classroom-meta" }, [
                                                      createVNode("span", null, "Next due: " + toDisplayString(nextDueByClassroom(item.id)), 1)
                                                    ])
                                                  ])
                                                ]),
                                                _: 2
                                              }, 1032, ["onClick"])
                                            ]),
                                            _: 1
                                          }, 8, ["data-source"])
                                        ]),
                                        _: 2
                                      }, 1032, ["header"]);
                                    }), 128)),
                                    createVNode(_component_a_collapse_panel, {
                                      key: "other",
                                      header: "Other classrooms"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_list, {
                                          size: "small",
                                          "data-source": classroomsWithoutDepartment.value,
                                          locale: { emptyText: "No other classrooms" }
                                        }, {
                                          renderItem: withCtx(({ item }) => [
                                            createVNode(_component_a_list_item, {
                                              onClick: ($event) => focusClassroom(item),
                                              style: { "cursor": "pointer" }
                                            }, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "classroom-item" }, [
                                                  createVNode("div", { class: "classroom-title" }, [
                                                    createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                    createVNode("span", null, toDisplayString(item.title), 1)
                                                  ]),
                                                  createVNode("div", { class: "classroom-meta" }, [
                                                    createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                    createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                  ])
                                                ])
                                              ]),
                                              _: 2
                                            }, 1032, ["onClick"])
                                          ]),
                                          _: 1
                                        }, 8, ["data-source"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_divider),
                                createVNode(_component_a_card, {
                                  size: "small",
                                  bordered: false,
                                  title: "My Institution Courses"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_list, {
                                      size: "small",
                                      "data-source": courses.value,
                                      locale: { emptyText: "No enrolled courses" }
                                    }, {
                                      renderItem: withCtx(({ item }) => [
                                        createVNode(_component_a_list_item, {
                                          onClick: ($event) => focusCourse(item),
                                          style: { "cursor": "pointer" }
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("div", { style: { "display": "flex", "align-items": "center", "gap": "8px" } }, [
                                              createVNode("span", null, toDisplayString(item.title), 1),
                                              createVNode(_component_a_progress, {
                                                percent: item.progressPct,
                                                size: "small",
                                                style: { "width": "120px" }
                                              }, null, 8, ["percent"])
                                            ])
                                          ]),
                                          _: 2
                                        }, 1032, ["onClick"])
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
                        }),
                        createVNode(_component_a_col, {
                          xs: 24,
                          md: 8
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              size: "small",
                              title: centerTitle.value
                            }, {
                              default: withCtx(() => [
                                !focusedCourseId.value ? (openBlock(), createBlock(_component_a_empty, {
                                  key: 0,
                                  description: "Select a classroom or course"
                                })) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                  createVNode("div", { class: "section-header" }, [
                                    createVNode("span", { class: "section-title" }, [
                                      createVNode(unref(DashboardOutlined), { class: "section-icon" }),
                                      createTextVNode(" Active Modules ")
                                    ]),
                                    createVNode(_component_a_button, {
                                      size: "small",
                                      type: "primary",
                                      href: continueLink.value,
                                      disabled: !continueLink.value
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Continue where you left off")
                                      ]),
                                      _: 1
                                    }, 8, ["href", "disabled"])
                                  ]),
                                  createVNode(_component_a_table, {
                                    size: "small",
                                    dataSource: moduleRows.value,
                                    columns: moduleColumns,
                                    pagination: { pageSize: 6 },
                                    "row-key": "id"
                                  }, {
                                    bodyCell: withCtx(({ column, record }) => [
                                      column.key === "status" ? (openBlock(), createBlock(_component_a_space, { key: 0 }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_tag, { color: "green" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(record.completed) + " done", 1)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_a_tag, { color: "blue" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(record.inProgress) + " in-progress", 1)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_a_tag, null, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(record.notStarted) + " not-started", 1)
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024)) : column.key === "next" ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(record.nextLabel), 1)) : createCommentVNode("", true)
                                    ]),
                                    _: 1
                                  }, 8, ["dataSource"]),
                                  createVNode(_component_a_divider),
                                  createVNode("div", { class: "section-header" }, [
                                    createVNode("span", { class: "section-title" }, [
                                      createVNode(unref(CalendarOutlined), { class: "section-icon" }),
                                      createTextVNode(" Next Assignment ")
                                    ])
                                  ]),
                                  createVNode(_component_a_list, {
                                    size: "small",
                                    "data-source": nextAssignmentsForFocus.value,
                                    locale: { emptyText: "No upcoming assignments" }
                                  }, {
                                    renderItem: withCtx(({ item }) => [
                                      createVNode(_component_a_list_item, null, {
                                        default: withCtx(() => [
                                          createVNode("div", { style: { "display": "flex", "gap": "8px", "align-items": "center" } }, [
                                            createVNode("span", null, toDisplayString(item.title), 1),
                                            createVNode(_component_a_tag, null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(formatDate(item.dueDate)), 1)
                                              ]),
                                              _: 2
                                            }, 1024),
                                            item.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                              key: 0,
                                              color: "green"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Graded")
                                              ]),
                                              _: 1
                                            })) : item.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                              key: 1,
                                              color: "blue"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Submitted")
                                              ]),
                                              _: 1
                                            })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                              default: withCtx(() => [
                                                createTextVNode("Not submitted")
                                              ]),
                                              _: 1
                                            }))
                                          ])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 1
                                  }, 8, ["data-source"])
                                ], 64))
                              ]),
                              _: 1
                            }, 8, ["title"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_col, {
                          xs: 24,
                          md: 8
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              size: "small",
                              title: "Discover & Normal Courses"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_input, {
                                  value: discoverQuery.value,
                                  "onUpdate:value": ($event) => discoverQuery.value = $event,
                                  placeholder: "Search courses",
                                  style: { "margin-bottom": "8px" }
                                }, null, 8, ["value", "onUpdate:value"]),
                                createVNode(_component_a_list, {
                                  size: "small",
                                  "data-source": discoverFiltered.value,
                                  locale: { emptyText: "No recommendations" }
                                }, {
                                  renderItem: withCtx(({ item }) => [
                                    createVNode(_component_a_list_item, null, {
                                      default: withCtx(() => [
                                        createVNode("div", { style: { "display": "flex", "align-items": "center", "gap": "8px", "flex-wrap": "wrap" } }, [
                                          createVNode("span", null, toDisplayString(item.title), 1),
                                          isInstitutionCourse(item) ? (openBlock(), createBlock(_component_a_tag, {
                                            key: 0,
                                            color: "geekblue"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Institution course")
                                            ]),
                                            _: 1
                                          })) : (openBlock(), createBlock(_component_a_tag, {
                                            key: 1,
                                            color: "purple"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Global course")
                                            ]),
                                            _: 1
                                          })),
                                          createVNode(_component_a_tag, null, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(item.difficulty || "—"), 1)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_a_button, {
                                            size: "small",
                                            type: "link",
                                            href: courseDeepLink(item)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("View details")
                                            ]),
                                            _: 1
                                          }, 8, ["href"])
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
                          ]),
                          _: 1
                        })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(_component_a_row, {
                  gutter: 16,
                  class: "portal-layout"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_a_col, { span: 16 }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_a_card, {
                              bordered: false,
                              class: "portal-main-card"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_a_tabs, {
                                    activeKey: activeTab.value,
                                    "onUpdate:activeKey": ($event) => activeTab.value = $event
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_component_a_tab_pane, {
                                          key: "overview",
                                          tab: "Overview"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(_component_a_row, { gutter: 16 }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(_component_a_col, { span: 16 }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(ssrRenderComponent(_component_a_card, {
                                                            size: "small",
                                                            title: "About this institution"
                                                          }, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(`<p class="institution-description" data-v-789f08b6${_scopeId9}>${ssrInterpolate(viewModel.value.institution.description || "No description provided.")}</p>`);
                                                                _push10(ssrRenderComponent(_component_a_descriptions, {
                                                                  column: 2,
                                                                  size: "small"
                                                                }, {
                                                                  default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                    if (_push11) {
                                                                      _push11(ssrRenderComponent(_component_a_descriptions_item, { label: "Location" }, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(`${ssrInterpolate(viewModel.value.institution.location || "—")}`);
                                                                          } else {
                                                                            return [
                                                                              createTextVNode(toDisplayString(viewModel.value.institution.location || "—"), 1)
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 1
                                                                      }, _parent11, _scopeId10));
                                                                      _push11(ssrRenderComponent(_component_a_descriptions_item, { label: "Email" }, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(`${ssrInterpolate(viewModel.value.institution.email || "—")}`);
                                                                          } else {
                                                                            return [
                                                                              createTextVNode(toDisplayString(viewModel.value.institution.email || "—"), 1)
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 1
                                                                      }, _parent11, _scopeId10));
                                                                      _push11(ssrRenderComponent(_component_a_descriptions_item, { label: "Phone" }, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(`${ssrInterpolate(viewModel.value.institution.phone || "—")}`);
                                                                          } else {
                                                                            return [
                                                                              createTextVNode(toDisplayString(viewModel.value.institution.phone || "—"), 1)
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 1
                                                                      }, _parent11, _scopeId10));
                                                                      _push11(ssrRenderComponent(_component_a_descriptions_item, { label: "Created" }, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(`${ssrInterpolate(formatDate(viewModel.value.institution.createdAt))}`);
                                                                          } else {
                                                                            return [
                                                                              createTextVNode(toDisplayString(formatDate(viewModel.value.institution.createdAt)), 1)
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 1
                                                                      }, _parent11, _scopeId10));
                                                                    } else {
                                                                      return [
                                                                        createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(viewModel.value.institution.location || "—"), 1)
                                                                          ]),
                                                                          _: 1
                                                                        }),
                                                                        createVNode(_component_a_descriptions_item, { label: "Email" }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(viewModel.value.institution.email || "—"), 1)
                                                                          ]),
                                                                          _: 1
                                                                        }),
                                                                        createVNode(_component_a_descriptions_item, { label: "Phone" }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(viewModel.value.institution.phone || "—"), 1)
                                                                          ]),
                                                                          _: 1
                                                                        }),
                                                                        createVNode(_component_a_descriptions_item, { label: "Created" }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(formatDate(viewModel.value.institution.createdAt)), 1)
                                                                          ]),
                                                                          _: 1
                                                                        })
                                                                      ];
                                                                    }
                                                                  }),
                                                                  _: 1
                                                                }, _parent10, _scopeId9));
                                                              } else {
                                                                return [
                                                                  createVNode("p", { class: "institution-description" }, toDisplayString(viewModel.value.institution.description || "No description provided."), 1),
                                                                  createVNode(_component_a_descriptions, {
                                                                    column: 2,
                                                                    size: "small"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(viewModel.value.institution.location || "—"), 1)
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(_component_a_descriptions_item, { label: "Email" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(viewModel.value.institution.email || "—"), 1)
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(_component_a_descriptions_item, { label: "Phone" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(viewModel.value.institution.phone || "—"), 1)
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(_component_a_descriptions_item, { label: "Created" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(formatDate(viewModel.value.institution.createdAt)), 1)
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
                                                          }, _parent9, _scopeId8));
                                                          _push9(ssrRenderComponent(_component_a_card, {
                                                            size: "small",
                                                            style: { "margin-top": "16px" },
                                                            title: "Upcoming work (assignments & labs)"
                                                          }, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(ssrRenderComponent(_component_a_row, { gutter: 16 }, {
                                                                  default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                    if (_push11) {
                                                                      _push11(ssrRenderComponent(_component_a_col, { span: 14 }, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(`<div class="section-header" data-v-789f08b6${_scopeId11}><span class="section-title" data-v-789f08b6${_scopeId11}>`);
                                                                            _push12(ssrRenderComponent(unref(CalendarOutlined), { class: "section-icon" }, null, _parent12, _scopeId11));
                                                                            _push12(` Assignments </span>`);
                                                                            _push12(ssrRenderComponent(_component_a_switch, {
                                                                              checked: showOnlyOpenAssignments.value,
                                                                              "onUpdate:checked": ($event) => showOnlyOpenAssignments.value = $event,
                                                                              size: "small",
                                                                              style: { "margin-left": "auto" }
                                                                            }, null, _parent12, _scopeId11));
                                                                            _push12(`<span class="filter-label" data-v-789f08b6${_scopeId11}>Show only open</span></div>`);
                                                                            _push12(ssrRenderComponent(_component_a_table, {
                                                                              size: "small",
                                                                              dataSource: upcomingAssignments.value,
                                                                              columns: assignmentColumns,
                                                                              pagination: false,
                                                                              "row-key": "id"
                                                                            }, {
                                                                              bodyCell: withCtx(({ column, record }, _push13, _parent13, _scopeId12) => {
                                                                                if (_push13) {
                                                                                  if (column.key === "dueDate") {
                                                                                    _push13(`<!--[-->${ssrInterpolate(formatDate(record.dueDate))}<!--]-->`);
                                                                                  } else if (column.key === "submissionStatus") {
                                                                                    _push13(`<!--[-->`);
                                                                                    if (record.submissionStatus === "graded") {
                                                                                      _push13(ssrRenderComponent(_component_a_tag, { color: "green" }, {
                                                                                        default: withCtx((_12, _push14, _parent14, _scopeId13) => {
                                                                                          if (_push14) {
                                                                                            _push14(` Graded `);
                                                                                          } else {
                                                                                            return [
                                                                                              createTextVNode(" Graded ")
                                                                                            ];
                                                                                          }
                                                                                        }),
                                                                                        _: 2
                                                                                      }, _parent13, _scopeId12));
                                                                                    } else if (record.submissionStatus === "submitted") {
                                                                                      _push13(ssrRenderComponent(_component_a_tag, { color: "blue" }, {
                                                                                        default: withCtx((_12, _push14, _parent14, _scopeId13) => {
                                                                                          if (_push14) {
                                                                                            _push14(` Submitted `);
                                                                                          } else {
                                                                                            return [
                                                                                              createTextVNode(" Submitted ")
                                                                                            ];
                                                                                          }
                                                                                        }),
                                                                                        _: 2
                                                                                      }, _parent13, _scopeId12));
                                                                                    } else {
                                                                                      _push13(ssrRenderComponent(_component_a_tag, null, {
                                                                                        default: withCtx((_12, _push14, _parent14, _scopeId13) => {
                                                                                          if (_push14) {
                                                                                            _push14(` Not submitted `);
                                                                                          } else {
                                                                                            return [
                                                                                              createTextVNode(" Not submitted ")
                                                                                            ];
                                                                                          }
                                                                                        }),
                                                                                        _: 2
                                                                                      }, _parent13, _scopeId12));
                                                                                    }
                                                                                    _push13(`<!--]-->`);
                                                                                  } else {
                                                                                    _push13(`<!--[-->${ssrInterpolate(record[column.dataIndex])}<!--]-->`);
                                                                                  }
                                                                                } else {
                                                                                  return [
                                                                                    column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                                                      createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                                                    ], 64)) : column.key === "submissionStatus" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                                                      record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                                        key: 0,
                                                                                        color: "green"
                                                                                      }, {
                                                                                        default: withCtx(() => [
                                                                                          createTextVNode(" Graded ")
                                                                                        ]),
                                                                                        _: 1
                                                                                      })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                                        key: 1,
                                                                                        color: "blue"
                                                                                      }, {
                                                                                        default: withCtx(() => [
                                                                                          createTextVNode(" Submitted ")
                                                                                        ]),
                                                                                        _: 1
                                                                                      })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                                        default: withCtx(() => [
                                                                                          createTextVNode(" Not submitted ")
                                                                                        ]),
                                                                                        _: 1
                                                                                      }))
                                                                                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                                                      createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                                                                    ], 64))
                                                                                  ];
                                                                                }
                                                                              }),
                                                                              _: 1
                                                                            }, _parent12, _scopeId11));
                                                                          } else {
                                                                            return [
                                                                              createVNode("div", { class: "section-header" }, [
                                                                                createVNode("span", { class: "section-title" }, [
                                                                                  createVNode(unref(CalendarOutlined), { class: "section-icon" }),
                                                                                  createTextVNode(" Assignments ")
                                                                                ]),
                                                                                createVNode(_component_a_switch, {
                                                                                  checked: showOnlyOpenAssignments.value,
                                                                                  "onUpdate:checked": ($event) => showOnlyOpenAssignments.value = $event,
                                                                                  size: "small",
                                                                                  style: { "margin-left": "auto" }
                                                                                }, null, 8, ["checked", "onUpdate:checked"]),
                                                                                createVNode("span", { class: "filter-label" }, "Show only open")
                                                                              ]),
                                                                              createVNode(_component_a_table, {
                                                                                size: "small",
                                                                                dataSource: upcomingAssignments.value,
                                                                                columns: assignmentColumns,
                                                                                pagination: false,
                                                                                "row-key": "id"
                                                                              }, {
                                                                                bodyCell: withCtx(({ column, record }) => [
                                                                                  column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                                                    createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                                                  ], 64)) : column.key === "submissionStatus" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                                                    record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                                      key: 0,
                                                                                      color: "green"
                                                                                    }, {
                                                                                      default: withCtx(() => [
                                                                                        createTextVNode(" Graded ")
                                                                                      ]),
                                                                                      _: 1
                                                                                    })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                                      key: 1,
                                                                                      color: "blue"
                                                                                    }, {
                                                                                      default: withCtx(() => [
                                                                                        createTextVNode(" Submitted ")
                                                                                      ]),
                                                                                      _: 1
                                                                                    })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                                      default: withCtx(() => [
                                                                                        createTextVNode(" Not submitted ")
                                                                                      ]),
                                                                                      _: 1
                                                                                    }))
                                                                                  ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                                                    createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                                                                  ], 64))
                                                                                ]),
                                                                                _: 1
                                                                              }, 8, ["dataSource"])
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 1
                                                                      }, _parent11, _scopeId10));
                                                                      _push11(ssrRenderComponent(_component_a_col, { span: 10 }, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(`<div class="section-header" data-v-789f08b6${_scopeId11}><span class="section-title" data-v-789f08b6${_scopeId11}>`);
                                                                            _push12(ssrRenderComponent(unref(ExperimentOutlined), { class: "section-icon" }, null, _parent12, _scopeId11));
                                                                            _push12(` Lab sessions </span></div>`);
                                                                            if (recentLabs.value.length) {
                                                                              _push12(ssrRenderComponent(_component_a_timeline, null, {
                                                                                default: withCtx((_12, _push13, _parent13, _scopeId12) => {
                                                                                  if (_push13) {
                                                                                    _push13(`<!--[-->`);
                                                                                    ssrRenderList(recentLabs.value, (lab) => {
                                                                                      _push13(ssrRenderComponent(_component_a_timeline_item, {
                                                                                        key: lab.sessionId,
                                                                                        color: lab.status === "running" ? "green" : "blue"
                                                                                      }, {
                                                                                        default: withCtx((_13, _push14, _parent14, _scopeId13) => {
                                                                                          if (_push14) {
                                                                                            _push14(`<div class="lab-item" data-v-789f08b6${_scopeId13}><div class="lab-title" data-v-789f08b6${_scopeId13}>${ssrInterpolate(lab.challengeTitle)}</div><div class="lab-meta" data-v-789f08b6${_scopeId13}><span data-v-789f08b6${_scopeId13}>${ssrInterpolate(lab.courseTitle || "No course")}</span><span data-v-789f08b6${_scopeId13}>•</span><span data-v-789f08b6${_scopeId13}>Status: ${ssrInterpolate(lab.status)}</span></div><div class="lab-meta" data-v-789f08b6${_scopeId13}><span data-v-789f08b6${_scopeId13}>Runtime: ${ssrInterpolate(lab.runtime || "—")}</span><span data-v-789f08b6${_scopeId13}>•</span><span data-v-789f08b6${_scopeId13}>Last heartbeat: ${ssrInterpolate(formatDate(lab.lastHeartbeat))}</span></div></div>`);
                                                                                          } else {
                                                                                            return [
                                                                                              createVNode("div", { class: "lab-item" }, [
                                                                                                createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                                                createVNode("div", { class: "lab-meta" }, [
                                                                                                  createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                                                  createVNode("span", null, "•"),
                                                                                                  createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                                                ]),
                                                                                                createVNode("div", { class: "lab-meta" }, [
                                                                                                  createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                                                  createVNode("span", null, "•"),
                                                                                                  createVNode("span", null, "Last heartbeat: " + toDisplayString(formatDate(lab.lastHeartbeat)), 1)
                                                                                                ])
                                                                                              ])
                                                                                            ];
                                                                                          }
                                                                                        }),
                                                                                        _: 2
                                                                                      }, _parent13, _scopeId12));
                                                                                    });
                                                                                    _push13(`<!--]-->`);
                                                                                  } else {
                                                                                    return [
                                                                                      (openBlock(true), createBlock(Fragment, null, renderList(recentLabs.value, (lab) => {
                                                                                        return openBlock(), createBlock(_component_a_timeline_item, {
                                                                                          key: lab.sessionId,
                                                                                          color: lab.status === "running" ? "green" : "blue"
                                                                                        }, {
                                                                                          default: withCtx(() => [
                                                                                            createVNode("div", { class: "lab-item" }, [
                                                                                              createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                                              createVNode("div", { class: "lab-meta" }, [
                                                                                                createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                                                createVNode("span", null, "•"),
                                                                                                createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                                              ]),
                                                                                              createVNode("div", { class: "lab-meta" }, [
                                                                                                createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                                                createVNode("span", null, "•"),
                                                                                                createVNode("span", null, "Last heartbeat: " + toDisplayString(formatDate(lab.lastHeartbeat)), 1)
                                                                                              ])
                                                                                            ])
                                                                                          ]),
                                                                                          _: 2
                                                                                        }, 1032, ["color"]);
                                                                                      }), 128))
                                                                                    ];
                                                                                  }
                                                                                }),
                                                                                _: 1
                                                                              }, _parent12, _scopeId11));
                                                                            } else {
                                                                              _push12(ssrRenderComponent(_component_a_empty, { description: "No lab activity yet" }, null, _parent12, _scopeId11));
                                                                            }
                                                                          } else {
                                                                            return [
                                                                              createVNode("div", { class: "section-header" }, [
                                                                                createVNode("span", { class: "section-title" }, [
                                                                                  createVNode(unref(ExperimentOutlined), { class: "section-icon" }),
                                                                                  createTextVNode(" Lab sessions ")
                                                                                ])
                                                                              ]),
                                                                              recentLabs.value.length ? (openBlock(), createBlock(_component_a_timeline, { key: 0 }, {
                                                                                default: withCtx(() => [
                                                                                  (openBlock(true), createBlock(Fragment, null, renderList(recentLabs.value, (lab) => {
                                                                                    return openBlock(), createBlock(_component_a_timeline_item, {
                                                                                      key: lab.sessionId,
                                                                                      color: lab.status === "running" ? "green" : "blue"
                                                                                    }, {
                                                                                      default: withCtx(() => [
                                                                                        createVNode("div", { class: "lab-item" }, [
                                                                                          createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                                          createVNode("div", { class: "lab-meta" }, [
                                                                                            createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                                            createVNode("span", null, "•"),
                                                                                            createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                                          ]),
                                                                                          createVNode("div", { class: "lab-meta" }, [
                                                                                            createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                                            createVNode("span", null, "•"),
                                                                                            createVNode("span", null, "Last heartbeat: " + toDisplayString(formatDate(lab.lastHeartbeat)), 1)
                                                                                          ])
                                                                                        ])
                                                                                      ]),
                                                                                      _: 2
                                                                                    }, 1032, ["color"]);
                                                                                  }), 128))
                                                                                ]),
                                                                                _: 1
                                                                              })) : (openBlock(), createBlock(_component_a_empty, {
                                                                                key: 1,
                                                                                description: "No lab activity yet"
                                                                              }))
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 1
                                                                      }, _parent11, _scopeId10));
                                                                    } else {
                                                                      return [
                                                                        createVNode(_component_a_col, { span: 14 }, {
                                                                          default: withCtx(() => [
                                                                            createVNode("div", { class: "section-header" }, [
                                                                              createVNode("span", { class: "section-title" }, [
                                                                                createVNode(unref(CalendarOutlined), { class: "section-icon" }),
                                                                                createTextVNode(" Assignments ")
                                                                              ]),
                                                                              createVNode(_component_a_switch, {
                                                                                checked: showOnlyOpenAssignments.value,
                                                                                "onUpdate:checked": ($event) => showOnlyOpenAssignments.value = $event,
                                                                                size: "small",
                                                                                style: { "margin-left": "auto" }
                                                                              }, null, 8, ["checked", "onUpdate:checked"]),
                                                                              createVNode("span", { class: "filter-label" }, "Show only open")
                                                                            ]),
                                                                            createVNode(_component_a_table, {
                                                                              size: "small",
                                                                              dataSource: upcomingAssignments.value,
                                                                              columns: assignmentColumns,
                                                                              pagination: false,
                                                                              "row-key": "id"
                                                                            }, {
                                                                              bodyCell: withCtx(({ column, record }) => [
                                                                                column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                                                  createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                                                ], 64)) : column.key === "submissionStatus" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                                                  record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                                    key: 0,
                                                                                    color: "green"
                                                                                  }, {
                                                                                    default: withCtx(() => [
                                                                                      createTextVNode(" Graded ")
                                                                                    ]),
                                                                                    _: 1
                                                                                  })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                                    key: 1,
                                                                                    color: "blue"
                                                                                  }, {
                                                                                    default: withCtx(() => [
                                                                                      createTextVNode(" Submitted ")
                                                                                    ]),
                                                                                    _: 1
                                                                                  })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                                    default: withCtx(() => [
                                                                                      createTextVNode(" Not submitted ")
                                                                                    ]),
                                                                                    _: 1
                                                                                  }))
                                                                                ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                                                  createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                                                                ], 64))
                                                                              ]),
                                                                              _: 1
                                                                            }, 8, ["dataSource"])
                                                                          ]),
                                                                          _: 1
                                                                        }),
                                                                        createVNode(_component_a_col, { span: 10 }, {
                                                                          default: withCtx(() => [
                                                                            createVNode("div", { class: "section-header" }, [
                                                                              createVNode("span", { class: "section-title" }, [
                                                                                createVNode(unref(ExperimentOutlined), { class: "section-icon" }),
                                                                                createTextVNode(" Lab sessions ")
                                                                              ])
                                                                            ]),
                                                                            recentLabs.value.length ? (openBlock(), createBlock(_component_a_timeline, { key: 0 }, {
                                                                              default: withCtx(() => [
                                                                                (openBlock(true), createBlock(Fragment, null, renderList(recentLabs.value, (lab) => {
                                                                                  return openBlock(), createBlock(_component_a_timeline_item, {
                                                                                    key: lab.sessionId,
                                                                                    color: lab.status === "running" ? "green" : "blue"
                                                                                  }, {
                                                                                    default: withCtx(() => [
                                                                                      createVNode("div", { class: "lab-item" }, [
                                                                                        createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                                        createVNode("div", { class: "lab-meta" }, [
                                                                                          createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                                          createVNode("span", null, "•"),
                                                                                          createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                                        ]),
                                                                                        createVNode("div", { class: "lab-meta" }, [
                                                                                          createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                                          createVNode("span", null, "•"),
                                                                                          createVNode("span", null, "Last heartbeat: " + toDisplayString(formatDate(lab.lastHeartbeat)), 1)
                                                                                        ])
                                                                                      ])
                                                                                    ]),
                                                                                    _: 2
                                                                                  }, 1032, ["color"]);
                                                                                }), 128))
                                                                              ]),
                                                                              _: 1
                                                                            })) : (openBlock(), createBlock(_component_a_empty, {
                                                                              key: 1,
                                                                              description: "No lab activity yet"
                                                                            }))
                                                                          ]),
                                                                          _: 1
                                                                        })
                                                                      ];
                                                                    }
                                                                  }),
                                                                  _: 1
                                                                }, _parent10, _scopeId9));
                                                              } else {
                                                                return [
                                                                  createVNode(_component_a_row, { gutter: 16 }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(_component_a_col, { span: 14 }, {
                                                                        default: withCtx(() => [
                                                                          createVNode("div", { class: "section-header" }, [
                                                                            createVNode("span", { class: "section-title" }, [
                                                                              createVNode(unref(CalendarOutlined), { class: "section-icon" }),
                                                                              createTextVNode(" Assignments ")
                                                                            ]),
                                                                            createVNode(_component_a_switch, {
                                                                              checked: showOnlyOpenAssignments.value,
                                                                              "onUpdate:checked": ($event) => showOnlyOpenAssignments.value = $event,
                                                                              size: "small",
                                                                              style: { "margin-left": "auto" }
                                                                            }, null, 8, ["checked", "onUpdate:checked"]),
                                                                            createVNode("span", { class: "filter-label" }, "Show only open")
                                                                          ]),
                                                                          createVNode(_component_a_table, {
                                                                            size: "small",
                                                                            dataSource: upcomingAssignments.value,
                                                                            columns: assignmentColumns,
                                                                            pagination: false,
                                                                            "row-key": "id"
                                                                          }, {
                                                                            bodyCell: withCtx(({ column, record }) => [
                                                                              column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                                                createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                                              ], 64)) : column.key === "submissionStatus" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                                                record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                                  key: 0,
                                                                                  color: "green"
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createTextVNode(" Graded ")
                                                                                  ]),
                                                                                  _: 1
                                                                                })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                                  key: 1,
                                                                                  color: "blue"
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createTextVNode(" Submitted ")
                                                                                  ]),
                                                                                  _: 1
                                                                                })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                                  default: withCtx(() => [
                                                                                    createTextVNode(" Not submitted ")
                                                                                  ]),
                                                                                  _: 1
                                                                                }))
                                                                              ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                                                createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                                                              ], 64))
                                                                            ]),
                                                                            _: 1
                                                                          }, 8, ["dataSource"])
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(_component_a_col, { span: 10 }, {
                                                                        default: withCtx(() => [
                                                                          createVNode("div", { class: "section-header" }, [
                                                                            createVNode("span", { class: "section-title" }, [
                                                                              createVNode(unref(ExperimentOutlined), { class: "section-icon" }),
                                                                              createTextVNode(" Lab sessions ")
                                                                            ])
                                                                          ]),
                                                                          recentLabs.value.length ? (openBlock(), createBlock(_component_a_timeline, { key: 0 }, {
                                                                            default: withCtx(() => [
                                                                              (openBlock(true), createBlock(Fragment, null, renderList(recentLabs.value, (lab) => {
                                                                                return openBlock(), createBlock(_component_a_timeline_item, {
                                                                                  key: lab.sessionId,
                                                                                  color: lab.status === "running" ? "green" : "blue"
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createVNode("div", { class: "lab-item" }, [
                                                                                      createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                                      createVNode("div", { class: "lab-meta" }, [
                                                                                        createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                                        createVNode("span", null, "•"),
                                                                                        createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                                      ]),
                                                                                      createVNode("div", { class: "lab-meta" }, [
                                                                                        createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                                        createVNode("span", null, "•"),
                                                                                        createVNode("span", null, "Last heartbeat: " + toDisplayString(formatDate(lab.lastHeartbeat)), 1)
                                                                                      ])
                                                                                    ])
                                                                                  ]),
                                                                                  _: 2
                                                                                }, 1032, ["color"]);
                                                                              }), 128))
                                                                            ]),
                                                                            _: 1
                                                                          })) : (openBlock(), createBlock(_component_a_empty, {
                                                                            key: 1,
                                                                            description: "No lab activity yet"
                                                                          }))
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
                                                          }, _parent9, _scopeId8));
                                                        } else {
                                                          return [
                                                            createVNode(_component_a_card, {
                                                              size: "small",
                                                              title: "About this institution"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode("p", { class: "institution-description" }, toDisplayString(viewModel.value.institution.description || "No description provided."), 1),
                                                                createVNode(_component_a_descriptions, {
                                                                  column: 2,
                                                                  size: "small"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(viewModel.value.institution.location || "—"), 1)
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(_component_a_descriptions_item, { label: "Email" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(viewModel.value.institution.email || "—"), 1)
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(_component_a_descriptions_item, { label: "Phone" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(viewModel.value.institution.phone || "—"), 1)
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(_component_a_descriptions_item, { label: "Created" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(formatDate(viewModel.value.institution.createdAt)), 1)
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
                                                              size: "small",
                                                              style: { "margin-top": "16px" },
                                                              title: "Upcoming work (assignments & labs)"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_row, { gutter: 16 }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(_component_a_col, { span: 14 }, {
                                                                      default: withCtx(() => [
                                                                        createVNode("div", { class: "section-header" }, [
                                                                          createVNode("span", { class: "section-title" }, [
                                                                            createVNode(unref(CalendarOutlined), { class: "section-icon" }),
                                                                            createTextVNode(" Assignments ")
                                                                          ]),
                                                                          createVNode(_component_a_switch, {
                                                                            checked: showOnlyOpenAssignments.value,
                                                                            "onUpdate:checked": ($event) => showOnlyOpenAssignments.value = $event,
                                                                            size: "small",
                                                                            style: { "margin-left": "auto" }
                                                                          }, null, 8, ["checked", "onUpdate:checked"]),
                                                                          createVNode("span", { class: "filter-label" }, "Show only open")
                                                                        ]),
                                                                        createVNode(_component_a_table, {
                                                                          size: "small",
                                                                          dataSource: upcomingAssignments.value,
                                                                          columns: assignmentColumns,
                                                                          pagination: false,
                                                                          "row-key": "id"
                                                                        }, {
                                                                          bodyCell: withCtx(({ column, record }) => [
                                                                            column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                                              createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                                            ], 64)) : column.key === "submissionStatus" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                                              record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                                key: 0,
                                                                                color: "green"
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createTextVNode(" Graded ")
                                                                                ]),
                                                                                _: 1
                                                                              })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                                key: 1,
                                                                                color: "blue"
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createTextVNode(" Submitted ")
                                                                                ]),
                                                                                _: 1
                                                                              })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                                default: withCtx(() => [
                                                                                  createTextVNode(" Not submitted ")
                                                                                ]),
                                                                                _: 1
                                                                              }))
                                                                            ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                                              createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                                                            ], 64))
                                                                          ]),
                                                                          _: 1
                                                                        }, 8, ["dataSource"])
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(_component_a_col, { span: 10 }, {
                                                                      default: withCtx(() => [
                                                                        createVNode("div", { class: "section-header" }, [
                                                                          createVNode("span", { class: "section-title" }, [
                                                                            createVNode(unref(ExperimentOutlined), { class: "section-icon" }),
                                                                            createTextVNode(" Lab sessions ")
                                                                          ])
                                                                        ]),
                                                                        recentLabs.value.length ? (openBlock(), createBlock(_component_a_timeline, { key: 0 }, {
                                                                          default: withCtx(() => [
                                                                            (openBlock(true), createBlock(Fragment, null, renderList(recentLabs.value, (lab) => {
                                                                              return openBlock(), createBlock(_component_a_timeline_item, {
                                                                                key: lab.sessionId,
                                                                                color: lab.status === "running" ? "green" : "blue"
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createVNode("div", { class: "lab-item" }, [
                                                                                    createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                                    createVNode("div", { class: "lab-meta" }, [
                                                                                      createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                                      createVNode("span", null, "•"),
                                                                                      createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                                    ]),
                                                                                    createVNode("div", { class: "lab-meta" }, [
                                                                                      createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                                      createVNode("span", null, "•"),
                                                                                      createVNode("span", null, "Last heartbeat: " + toDisplayString(formatDate(lab.lastHeartbeat)), 1)
                                                                                    ])
                                                                                  ])
                                                                                ]),
                                                                                _: 2
                                                                              }, 1032, ["color"]);
                                                                            }), 128))
                                                                          ]),
                                                                          _: 1
                                                                        })) : (openBlock(), createBlock(_component_a_empty, {
                                                                          key: 1,
                                                                          description: "No lab activity yet"
                                                                        }))
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
                                                    }, _parent8, _scopeId7));
                                                    _push8(ssrRenderComponent(_component_a_col, { span: 8 }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(ssrRenderComponent(_component_a_card, {
                                                            size: "small",
                                                            title: "My course snapshot"
                                                          }, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(ssrRenderComponent(_component_a_statistic, {
                                                                  title: "Enrolled courses",
                                                                  value: courses.value.length
                                                                }, null, _parent10, _scopeId9));
                                                                _push10(ssrRenderComponent(_component_a_statistic, {
                                                                  title: "Completed courses",
                                                                  value: completedCoursesCount.value,
                                                                  style: { "margin-top": "8px" }
                                                                }, null, _parent10, _scopeId9));
                                                                _push10(ssrRenderComponent(_component_a_statistic, {
                                                                  title: "Average progress",
                                                                  value: averageCourseProgress.value,
                                                                  suffix: "%",
                                                                  style: { "margin-top": "8px" }
                                                                }, null, _parent10, _scopeId9));
                                                              } else {
                                                                return [
                                                                  createVNode(_component_a_statistic, {
                                                                    title: "Enrolled courses",
                                                                    value: courses.value.length
                                                                  }, null, 8, ["value"]),
                                                                  createVNode(_component_a_statistic, {
                                                                    title: "Completed courses",
                                                                    value: completedCoursesCount.value,
                                                                    style: { "margin-top": "8px" }
                                                                  }, null, 8, ["value"]),
                                                                  createVNode(_component_a_statistic, {
                                                                    title: "Average progress",
                                                                    value: averageCourseProgress.value,
                                                                    suffix: "%",
                                                                    style: { "margin-top": "8px" }
                                                                  }, null, 8, ["value"])
                                                                ];
                                                              }
                                                            }),
                                                            _: 1
                                                          }, _parent9, _scopeId8));
                                                          _push9(ssrRenderComponent(_component_a_card, {
                                                            size: "small",
                                                            style: { "margin-top": "16px" },
                                                            title: "Recent notes"
                                                          }, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                if (!viewModel.value.notes.length) {
                                                                  _push10(ssrRenderComponent(_component_a_empty, { description: "No notes yet for this institution" }, null, _parent10, _scopeId9));
                                                                } else {
                                                                  _push10(ssrRenderComponent(_component_a_list, {
                                                                    size: "small",
                                                                    "data-source": viewModel.value.notes.slice(0, 3)
                                                                  }, {
                                                                    renderItem: withCtx(({ item: note }, _push11, _parent11, _scopeId10) => {
                                                                      if (_push11) {
                                                                        _push11(ssrRenderComponent(_component_a_list_item, null, {
                                                                          default: withCtx((_10, _push12, _parent12, _scopeId11) => {
                                                                            if (_push12) {
                                                                              _push12(`<div class="note-item" data-v-789f08b6${_scopeId11}><div class="note-course" data-v-789f08b6${_scopeId11}>`);
                                                                              _push12(ssrRenderComponent(unref(BookOutlined), { class: "section-icon" }, null, _parent12, _scopeId11));
                                                                              _push12(`<span data-v-789f08b6${_scopeId11}>${ssrInterpolate(note.courseTitle || "Course")}</span></div><div class="note-body" data-v-789f08b6${_scopeId11}>${ssrInterpolate(note.body)}</div><div class="note-date" data-v-789f08b6${_scopeId11}>${ssrInterpolate(formatDate(note.createdAt))}</div></div>`);
                                                                            } else {
                                                                              return [
                                                                                createVNode("div", { class: "note-item" }, [
                                                                                  createVNode("div", { class: "note-course" }, [
                                                                                    createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                                    createVNode("span", null, toDisplayString(note.courseTitle || "Course"), 1)
                                                                                  ]),
                                                                                  createVNode("div", { class: "note-body" }, toDisplayString(note.body), 1),
                                                                                  createVNode("div", { class: "note-date" }, toDisplayString(formatDate(note.createdAt)), 1)
                                                                                ])
                                                                              ];
                                                                            }
                                                                          }),
                                                                          _: 2
                                                                        }, _parent11, _scopeId10));
                                                                      } else {
                                                                        return [
                                                                          createVNode(_component_a_list_item, null, {
                                                                            default: withCtx(() => [
                                                                              createVNode("div", { class: "note-item" }, [
                                                                                createVNode("div", { class: "note-course" }, [
                                                                                  createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                                  createVNode("span", null, toDisplayString(note.courseTitle || "Course"), 1)
                                                                                ]),
                                                                                createVNode("div", { class: "note-body" }, toDisplayString(note.body), 1),
                                                                                createVNode("div", { class: "note-date" }, toDisplayString(formatDate(note.createdAt)), 1)
                                                                              ])
                                                                            ]),
                                                                            _: 2
                                                                          }, 1024)
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent10, _scopeId9));
                                                                }
                                                              } else {
                                                                return [
                                                                  !viewModel.value.notes.length ? (openBlock(), createBlock(_component_a_empty, {
                                                                    key: 0,
                                                                    description: "No notes yet for this institution"
                                                                  })) : (openBlock(), createBlock(_component_a_list, {
                                                                    key: 1,
                                                                    size: "small",
                                                                    "data-source": viewModel.value.notes.slice(0, 3)
                                                                  }, {
                                                                    renderItem: withCtx(({ item: note }) => [
                                                                      createVNode(_component_a_list_item, null, {
                                                                        default: withCtx(() => [
                                                                          createVNode("div", { class: "note-item" }, [
                                                                            createVNode("div", { class: "note-course" }, [
                                                                              createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                              createVNode("span", null, toDisplayString(note.courseTitle || "Course"), 1)
                                                                            ]),
                                                                            createVNode("div", { class: "note-body" }, toDisplayString(note.body), 1),
                                                                            createVNode("div", { class: "note-date" }, toDisplayString(formatDate(note.createdAt)), 1)
                                                                          ])
                                                                        ]),
                                                                        _: 2
                                                                      }, 1024)
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["data-source"]))
                                                                ];
                                                              }
                                                            }),
                                                            _: 1
                                                          }, _parent9, _scopeId8));
                                                        } else {
                                                          return [
                                                            createVNode(_component_a_card, {
                                                              size: "small",
                                                              title: "My course snapshot"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_statistic, {
                                                                  title: "Enrolled courses",
                                                                  value: courses.value.length
                                                                }, null, 8, ["value"]),
                                                                createVNode(_component_a_statistic, {
                                                                  title: "Completed courses",
                                                                  value: completedCoursesCount.value,
                                                                  style: { "margin-top": "8px" }
                                                                }, null, 8, ["value"]),
                                                                createVNode(_component_a_statistic, {
                                                                  title: "Average progress",
                                                                  value: averageCourseProgress.value,
                                                                  suffix: "%",
                                                                  style: { "margin-top": "8px" }
                                                                }, null, 8, ["value"])
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(_component_a_card, {
                                                              size: "small",
                                                              style: { "margin-top": "16px" },
                                                              title: "Recent notes"
                                                            }, {
                                                              default: withCtx(() => [
                                                                !viewModel.value.notes.length ? (openBlock(), createBlock(_component_a_empty, {
                                                                  key: 0,
                                                                  description: "No notes yet for this institution"
                                                                })) : (openBlock(), createBlock(_component_a_list, {
                                                                  key: 1,
                                                                  size: "small",
                                                                  "data-source": viewModel.value.notes.slice(0, 3)
                                                                }, {
                                                                  renderItem: withCtx(({ item: note }) => [
                                                                    createVNode(_component_a_list_item, null, {
                                                                      default: withCtx(() => [
                                                                        createVNode("div", { class: "note-item" }, [
                                                                          createVNode("div", { class: "note-course" }, [
                                                                            createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                            createVNode("span", null, toDisplayString(note.courseTitle || "Course"), 1)
                                                                          ]),
                                                                          createVNode("div", { class: "note-body" }, toDisplayString(note.body), 1),
                                                                          createVNode("div", { class: "note-date" }, toDisplayString(formatDate(note.createdAt)), 1)
                                                                        ])
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024)
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["data-source"]))
                                                              ]),
                                                              _: 1
                                                            })
                                                          ];
                                                        }
                                                      }),
                                                      _: 1
                                                    }, _parent8, _scopeId7));
                                                  } else {
                                                    return [
                                                      createVNode(_component_a_col, { span: 16 }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_card, {
                                                            size: "small",
                                                            title: "About this institution"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode("p", { class: "institution-description" }, toDisplayString(viewModel.value.institution.description || "No description provided."), 1),
                                                              createVNode(_component_a_descriptions, {
                                                                column: 2,
                                                                size: "small"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(viewModel.value.institution.location || "—"), 1)
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(_component_a_descriptions_item, { label: "Email" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(viewModel.value.institution.email || "—"), 1)
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(_component_a_descriptions_item, { label: "Phone" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(viewModel.value.institution.phone || "—"), 1)
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(_component_a_descriptions_item, { label: "Created" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(formatDate(viewModel.value.institution.createdAt)), 1)
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
                                                            size: "small",
                                                            style: { "margin-top": "16px" },
                                                            title: "Upcoming work (assignments & labs)"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_row, { gutter: 16 }, {
                                                                default: withCtx(() => [
                                                                  createVNode(_component_a_col, { span: 14 }, {
                                                                    default: withCtx(() => [
                                                                      createVNode("div", { class: "section-header" }, [
                                                                        createVNode("span", { class: "section-title" }, [
                                                                          createVNode(unref(CalendarOutlined), { class: "section-icon" }),
                                                                          createTextVNode(" Assignments ")
                                                                        ]),
                                                                        createVNode(_component_a_switch, {
                                                                          checked: showOnlyOpenAssignments.value,
                                                                          "onUpdate:checked": ($event) => showOnlyOpenAssignments.value = $event,
                                                                          size: "small",
                                                                          style: { "margin-left": "auto" }
                                                                        }, null, 8, ["checked", "onUpdate:checked"]),
                                                                        createVNode("span", { class: "filter-label" }, "Show only open")
                                                                      ]),
                                                                      createVNode(_component_a_table, {
                                                                        size: "small",
                                                                        dataSource: upcomingAssignments.value,
                                                                        columns: assignmentColumns,
                                                                        pagination: false,
                                                                        "row-key": "id"
                                                                      }, {
                                                                        bodyCell: withCtx(({ column, record }) => [
                                                                          column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                                            createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                                          ], 64)) : column.key === "submissionStatus" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                                            record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                              key: 0,
                                                                              color: "green"
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createTextVNode(" Graded ")
                                                                              ]),
                                                                              _: 1
                                                                            })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                              key: 1,
                                                                              color: "blue"
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createTextVNode(" Submitted ")
                                                                              ]),
                                                                              _: 1
                                                                            })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                              default: withCtx(() => [
                                                                                createTextVNode(" Not submitted ")
                                                                              ]),
                                                                              _: 1
                                                                            }))
                                                                          ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                                            createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                                                          ], 64))
                                                                        ]),
                                                                        _: 1
                                                                      }, 8, ["dataSource"])
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(_component_a_col, { span: 10 }, {
                                                                    default: withCtx(() => [
                                                                      createVNode("div", { class: "section-header" }, [
                                                                        createVNode("span", { class: "section-title" }, [
                                                                          createVNode(unref(ExperimentOutlined), { class: "section-icon" }),
                                                                          createTextVNode(" Lab sessions ")
                                                                        ])
                                                                      ]),
                                                                      recentLabs.value.length ? (openBlock(), createBlock(_component_a_timeline, { key: 0 }, {
                                                                        default: withCtx(() => [
                                                                          (openBlock(true), createBlock(Fragment, null, renderList(recentLabs.value, (lab) => {
                                                                            return openBlock(), createBlock(_component_a_timeline_item, {
                                                                              key: lab.sessionId,
                                                                              color: lab.status === "running" ? "green" : "blue"
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createVNode("div", { class: "lab-item" }, [
                                                                                  createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                                  createVNode("div", { class: "lab-meta" }, [
                                                                                    createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                                    createVNode("span", null, "•"),
                                                                                    createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                                  ]),
                                                                                  createVNode("div", { class: "lab-meta" }, [
                                                                                    createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                                    createVNode("span", null, "•"),
                                                                                    createVNode("span", null, "Last heartbeat: " + toDisplayString(formatDate(lab.lastHeartbeat)), 1)
                                                                                  ])
                                                                                ])
                                                                              ]),
                                                                              _: 2
                                                                            }, 1032, ["color"]);
                                                                          }), 128))
                                                                        ]),
                                                                        _: 1
                                                                      })) : (openBlock(), createBlock(_component_a_empty, {
                                                                        key: 1,
                                                                        description: "No lab activity yet"
                                                                      }))
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
                                                      createVNode(_component_a_col, { span: 8 }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_card, {
                                                            size: "small",
                                                            title: "My course snapshot"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_statistic, {
                                                                title: "Enrolled courses",
                                                                value: courses.value.length
                                                              }, null, 8, ["value"]),
                                                              createVNode(_component_a_statistic, {
                                                                title: "Completed courses",
                                                                value: completedCoursesCount.value,
                                                                style: { "margin-top": "8px" }
                                                              }, null, 8, ["value"]),
                                                              createVNode(_component_a_statistic, {
                                                                title: "Average progress",
                                                                value: averageCourseProgress.value,
                                                                suffix: "%",
                                                                style: { "margin-top": "8px" }
                                                              }, null, 8, ["value"])
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(_component_a_card, {
                                                            size: "small",
                                                            style: { "margin-top": "16px" },
                                                            title: "Recent notes"
                                                          }, {
                                                            default: withCtx(() => [
                                                              !viewModel.value.notes.length ? (openBlock(), createBlock(_component_a_empty, {
                                                                key: 0,
                                                                description: "No notes yet for this institution"
                                                              })) : (openBlock(), createBlock(_component_a_list, {
                                                                key: 1,
                                                                size: "small",
                                                                "data-source": viewModel.value.notes.slice(0, 3)
                                                              }, {
                                                                renderItem: withCtx(({ item: note }) => [
                                                                  createVNode(_component_a_list_item, null, {
                                                                    default: withCtx(() => [
                                                                      createVNode("div", { class: "note-item" }, [
                                                                        createVNode("div", { class: "note-course" }, [
                                                                          createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                          createVNode("span", null, toDisplayString(note.courseTitle || "Course"), 1)
                                                                        ]),
                                                                        createVNode("div", { class: "note-body" }, toDisplayString(note.body), 1),
                                                                        createVNode("div", { class: "note-date" }, toDisplayString(formatDate(note.createdAt)), 1)
                                                                      ])
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024)
                                                                ]),
                                                                _: 1
                                                              }, 8, ["data-source"]))
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
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(_component_a_row, { gutter: 16 }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_col, { span: 16 }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_card, {
                                                          size: "small",
                                                          title: "About this institution"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode("p", { class: "institution-description" }, toDisplayString(viewModel.value.institution.description || "No description provided."), 1),
                                                            createVNode(_component_a_descriptions, {
                                                              column: 2,
                                                              size: "small"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(viewModel.value.institution.location || "—"), 1)
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(_component_a_descriptions_item, { label: "Email" }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(viewModel.value.institution.email || "—"), 1)
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(_component_a_descriptions_item, { label: "Phone" }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(viewModel.value.institution.phone || "—"), 1)
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(_component_a_descriptions_item, { label: "Created" }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(formatDate(viewModel.value.institution.createdAt)), 1)
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
                                                          size: "small",
                                                          style: { "margin-top": "16px" },
                                                          title: "Upcoming work (assignments & labs)"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_row, { gutter: 16 }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_col, { span: 14 }, {
                                                                  default: withCtx(() => [
                                                                    createVNode("div", { class: "section-header" }, [
                                                                      createVNode("span", { class: "section-title" }, [
                                                                        createVNode(unref(CalendarOutlined), { class: "section-icon" }),
                                                                        createTextVNode(" Assignments ")
                                                                      ]),
                                                                      createVNode(_component_a_switch, {
                                                                        checked: showOnlyOpenAssignments.value,
                                                                        "onUpdate:checked": ($event) => showOnlyOpenAssignments.value = $event,
                                                                        size: "small",
                                                                        style: { "margin-left": "auto" }
                                                                      }, null, 8, ["checked", "onUpdate:checked"]),
                                                                      createVNode("span", { class: "filter-label" }, "Show only open")
                                                                    ]),
                                                                    createVNode(_component_a_table, {
                                                                      size: "small",
                                                                      dataSource: upcomingAssignments.value,
                                                                      columns: assignmentColumns,
                                                                      pagination: false,
                                                                      "row-key": "id"
                                                                    }, {
                                                                      bodyCell: withCtx(({ column, record }) => [
                                                                        column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                                          createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                                        ], 64)) : column.key === "submissionStatus" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                                          record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                            key: 0,
                                                                            color: "green"
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode(" Graded ")
                                                                            ]),
                                                                            _: 1
                                                                          })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                            key: 1,
                                                                            color: "blue"
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode(" Submitted ")
                                                                            ]),
                                                                            _: 1
                                                                          })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode(" Not submitted ")
                                                                            ]),
                                                                            _: 1
                                                                          }))
                                                                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                                          createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                                                        ], 64))
                                                                      ]),
                                                                      _: 1
                                                                    }, 8, ["dataSource"])
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(_component_a_col, { span: 10 }, {
                                                                  default: withCtx(() => [
                                                                    createVNode("div", { class: "section-header" }, [
                                                                      createVNode("span", { class: "section-title" }, [
                                                                        createVNode(unref(ExperimentOutlined), { class: "section-icon" }),
                                                                        createTextVNode(" Lab sessions ")
                                                                      ])
                                                                    ]),
                                                                    recentLabs.value.length ? (openBlock(), createBlock(_component_a_timeline, { key: 0 }, {
                                                                      default: withCtx(() => [
                                                                        (openBlock(true), createBlock(Fragment, null, renderList(recentLabs.value, (lab) => {
                                                                          return openBlock(), createBlock(_component_a_timeline_item, {
                                                                            key: lab.sessionId,
                                                                            color: lab.status === "running" ? "green" : "blue"
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createVNode("div", { class: "lab-item" }, [
                                                                                createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                                createVNode("div", { class: "lab-meta" }, [
                                                                                  createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                                  createVNode("span", null, "•"),
                                                                                  createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                                ]),
                                                                                createVNode("div", { class: "lab-meta" }, [
                                                                                  createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                                  createVNode("span", null, "•"),
                                                                                  createVNode("span", null, "Last heartbeat: " + toDisplayString(formatDate(lab.lastHeartbeat)), 1)
                                                                                ])
                                                                              ])
                                                                            ]),
                                                                            _: 2
                                                                          }, 1032, ["color"]);
                                                                        }), 128))
                                                                      ]),
                                                                      _: 1
                                                                    })) : (openBlock(), createBlock(_component_a_empty, {
                                                                      key: 1,
                                                                      description: "No lab activity yet"
                                                                    }))
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
                                                    createVNode(_component_a_col, { span: 8 }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_card, {
                                                          size: "small",
                                                          title: "My course snapshot"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_statistic, {
                                                              title: "Enrolled courses",
                                                              value: courses.value.length
                                                            }, null, 8, ["value"]),
                                                            createVNode(_component_a_statistic, {
                                                              title: "Completed courses",
                                                              value: completedCoursesCount.value,
                                                              style: { "margin-top": "8px" }
                                                            }, null, 8, ["value"]),
                                                            createVNode(_component_a_statistic, {
                                                              title: "Average progress",
                                                              value: averageCourseProgress.value,
                                                              suffix: "%",
                                                              style: { "margin-top": "8px" }
                                                            }, null, 8, ["value"])
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(_component_a_card, {
                                                          size: "small",
                                                          style: { "margin-top": "16px" },
                                                          title: "Recent notes"
                                                        }, {
                                                          default: withCtx(() => [
                                                            !viewModel.value.notes.length ? (openBlock(), createBlock(_component_a_empty, {
                                                              key: 0,
                                                              description: "No notes yet for this institution"
                                                            })) : (openBlock(), createBlock(_component_a_list, {
                                                              key: 1,
                                                              size: "small",
                                                              "data-source": viewModel.value.notes.slice(0, 3)
                                                            }, {
                                                              renderItem: withCtx(({ item: note }) => [
                                                                createVNode(_component_a_list_item, null, {
                                                                  default: withCtx(() => [
                                                                    createVNode("div", { class: "note-item" }, [
                                                                      createVNode("div", { class: "note-course" }, [
                                                                        createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                        createVNode("span", null, toDisplayString(note.courseTitle || "Course"), 1)
                                                                      ]),
                                                                      createVNode("div", { class: "note-body" }, toDisplayString(note.body), 1),
                                                                      createVNode("div", { class: "note-date" }, toDisplayString(formatDate(note.createdAt)), 1)
                                                                    ])
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)
                                                              ]),
                                                              _: 1
                                                            }, 8, ["data-source"]))
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
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(_component_a_tab_pane, {
                                          key: "departments",
                                          tab: "Departments & Classrooms"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`<div class="section-header" data-v-789f08b6${_scopeId6}><span class="section-title" data-v-789f08b6${_scopeId6}>`);
                                              _push7(ssrRenderComponent(unref(ClusterOutlined), { class: "section-icon" }, null, _parent7, _scopeId6));
                                              _push7(` Departments </span>`);
                                              _push7(ssrRenderComponent(_component_a_switch, {
                                                checked: showOnlyMyClassrooms.value,
                                                "onUpdate:checked": ($event) => showOnlyMyClassrooms.value = $event,
                                                size: "small",
                                                style: { "margin-left": "auto" }
                                              }, null, _parent7, _scopeId6));
                                              _push7(`<span class="filter-label" data-v-789f08b6${_scopeId6}>Show only my classrooms</span></div>`);
                                              _push7(ssrRenderComponent(_component_a_row, {
                                                gutter: 16,
                                                style: { "margin-top": "8px" }
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(_component_a_col, { span: 16 }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(ssrRenderComponent(_component_a_collapse, { accordion: "" }, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(`<!--[-->`);
                                                                ssrRenderList(activeDepartments.value, (dept) => {
                                                                  _push10(ssrRenderComponent(_component_a_collapse_panel, {
                                                                    key: dept.id,
                                                                    header: dept.name
                                                                  }, {
                                                                    default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                      if (_push11) {
                                                                        _push11(`<p class="dept-meta" data-v-789f08b6${_scopeId10}>${ssrInterpolate(dept.contact || "No contact details")}</p>`);
                                                                        _push11(ssrRenderComponent(_component_a_list, {
                                                                          size: "small",
                                                                          "data-source": classroomsByDepartment(dept.id),
                                                                          locale: { emptyText: "No classrooms in this department" }
                                                                        }, {
                                                                          renderItem: withCtx(({ item }, _push12, _parent12, _scopeId11) => {
                                                                            if (_push12) {
                                                                              _push12(ssrRenderComponent(_component_a_list_item, null, {
                                                                                default: withCtx((_11, _push13, _parent13, _scopeId12) => {
                                                                                  if (_push13) {
                                                                                    _push13(`<div class="classroom-item" data-v-789f08b6${_scopeId12}><div class="classroom-title" data-v-789f08b6${_scopeId12}>`);
                                                                                    _push13(ssrRenderComponent(unref(BookOutlined), { class: "section-icon" }, null, _parent13, _scopeId12));
                                                                                    _push13(`<span data-v-789f08b6${_scopeId12}>${ssrInterpolate(item.title)}</span>`);
                                                                                    if (item.isEnrolled) {
                                                                                      _push13(ssrRenderComponent(_component_a_tag, {
                                                                                        color: "green",
                                                                                        style: { "margin-left": "8px" }
                                                                                      }, {
                                                                                        default: withCtx((_12, _push14, _parent14, _scopeId13) => {
                                                                                          if (_push14) {
                                                                                            _push14(` Enrolled `);
                                                                                          } else {
                                                                                            return [
                                                                                              createTextVNode(" Enrolled ")
                                                                                            ];
                                                                                          }
                                                                                        }),
                                                                                        _: 2
                                                                                      }, _parent13, _scopeId12));
                                                                                    } else {
                                                                                      _push13(ssrRenderComponent(_component_a_tag, { style: { "margin-left": "8px" } }, {
                                                                                        default: withCtx((_12, _push14, _parent14, _scopeId13) => {
                                                                                          if (_push14) {
                                                                                            _push14(` Not enrolled `);
                                                                                          } else {
                                                                                            return [
                                                                                              createTextVNode(" Not enrolled ")
                                                                                            ];
                                                                                          }
                                                                                        }),
                                                                                        _: 2
                                                                                      }, _parent13, _scopeId12));
                                                                                    }
                                                                                    _push13(`</div><div class="classroom-meta" data-v-789f08b6${_scopeId12}><span data-v-789f08b6${_scopeId12}>Code: ${ssrInterpolate(item.code)}</span>`);
                                                                                    if (item.courseTitle) {
                                                                                      _push13(`<span data-v-789f08b6${_scopeId12}>• Course: ${ssrInterpolate(item.courseTitle)}</span>`);
                                                                                    } else {
                                                                                      _push13(`<!---->`);
                                                                                    }
                                                                                    _push13(`</div><div class="classroom-meta" data-v-789f08b6${_scopeId12}><span data-v-789f08b6${_scopeId12}>Status: ${ssrInterpolate(item.status || "—")}</span>`);
                                                                                    if (item.capacity !== null) {
                                                                                      _push13(`<span data-v-789f08b6${_scopeId12}> • Capacity: ${ssrInterpolate(item.capacity)}</span>`);
                                                                                    } else {
                                                                                      _push13(`<!---->`);
                                                                                    }
                                                                                    _push13(`</div><div class="classroom-meta" data-v-789f08b6${_scopeId12}><span data-v-789f08b6${_scopeId12}>Starts: ${ssrInterpolate(formatDate(item.startsAt))}</span><span data-v-789f08b6${_scopeId12}>• Ends: ${ssrInterpolate(formatDate(item.endsAt))}</span></div></div>`);
                                                                                  } else {
                                                                                    return [
                                                                                      createVNode("div", { class: "classroom-item" }, [
                                                                                        createVNode("div", { class: "classroom-title" }, [
                                                                                          createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                                          createVNode("span", null, toDisplayString(item.title), 1),
                                                                                          item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                                                            key: 0,
                                                                                            color: "green",
                                                                                            style: { "margin-left": "8px" }
                                                                                          }, {
                                                                                            default: withCtx(() => [
                                                                                              createTextVNode(" Enrolled ")
                                                                                            ]),
                                                                                            _: 1
                                                                                          })) : (openBlock(), createBlock(_component_a_tag, {
                                                                                            key: 1,
                                                                                            style: { "margin-left": "8px" }
                                                                                          }, {
                                                                                            default: withCtx(() => [
                                                                                              createTextVNode(" Not enrolled ")
                                                                                            ]),
                                                                                            _: 1
                                                                                          }))
                                                                                        ]),
                                                                                        createVNode("div", { class: "classroom-meta" }, [
                                                                                          createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                                          item.courseTitle ? (openBlock(), createBlock("span", { key: 0 }, "• Course: " + toDisplayString(item.courseTitle), 1)) : createCommentVNode("", true)
                                                                                        ]),
                                                                                        createVNode("div", { class: "classroom-meta" }, [
                                                                                          createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                                                          item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, " • Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                                                        ]),
                                                                                        createVNode("div", { class: "classroom-meta" }, [
                                                                                          createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                                                          createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                                                        ])
                                                                                      ])
                                                                                    ];
                                                                                  }
                                                                                }),
                                                                                _: 2
                                                                              }, _parent12, _scopeId11));
                                                                            } else {
                                                                              return [
                                                                                createVNode(_component_a_list_item, null, {
                                                                                  default: withCtx(() => [
                                                                                    createVNode("div", { class: "classroom-item" }, [
                                                                                      createVNode("div", { class: "classroom-title" }, [
                                                                                        createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                                        createVNode("span", null, toDisplayString(item.title), 1),
                                                                                        item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                                                          key: 0,
                                                                                          color: "green",
                                                                                          style: { "margin-left": "8px" }
                                                                                        }, {
                                                                                          default: withCtx(() => [
                                                                                            createTextVNode(" Enrolled ")
                                                                                          ]),
                                                                                          _: 1
                                                                                        })) : (openBlock(), createBlock(_component_a_tag, {
                                                                                          key: 1,
                                                                                          style: { "margin-left": "8px" }
                                                                                        }, {
                                                                                          default: withCtx(() => [
                                                                                            createTextVNode(" Not enrolled ")
                                                                                          ]),
                                                                                          _: 1
                                                                                        }))
                                                                                      ]),
                                                                                      createVNode("div", { class: "classroom-meta" }, [
                                                                                        createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                                        item.courseTitle ? (openBlock(), createBlock("span", { key: 0 }, "• Course: " + toDisplayString(item.courseTitle), 1)) : createCommentVNode("", true)
                                                                                      ]),
                                                                                      createVNode("div", { class: "classroom-meta" }, [
                                                                                        createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                                                        item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, " • Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                                                      ]),
                                                                                      createVNode("div", { class: "classroom-meta" }, [
                                                                                        createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                                                        createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                                                      ])
                                                                                    ])
                                                                                  ]),
                                                                                  _: 2
                                                                                }, 1024)
                                                                              ];
                                                                            }
                                                                          }),
                                                                          _: 2
                                                                        }, _parent11, _scopeId10));
                                                                      } else {
                                                                        return [
                                                                          createVNode("p", { class: "dept-meta" }, toDisplayString(dept.contact || "No contact details"), 1),
                                                                          createVNode(_component_a_list, {
                                                                            size: "small",
                                                                            "data-source": classroomsByDepartment(dept.id),
                                                                            locale: { emptyText: "No classrooms in this department" }
                                                                          }, {
                                                                            renderItem: withCtx(({ item }) => [
                                                                              createVNode(_component_a_list_item, null, {
                                                                                default: withCtx(() => [
                                                                                  createVNode("div", { class: "classroom-item" }, [
                                                                                    createVNode("div", { class: "classroom-title" }, [
                                                                                      createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                                      createVNode("span", null, toDisplayString(item.title), 1),
                                                                                      item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                                                        key: 0,
                                                                                        color: "green",
                                                                                        style: { "margin-left": "8px" }
                                                                                      }, {
                                                                                        default: withCtx(() => [
                                                                                          createTextVNode(" Enrolled ")
                                                                                        ]),
                                                                                        _: 1
                                                                                      })) : (openBlock(), createBlock(_component_a_tag, {
                                                                                        key: 1,
                                                                                        style: { "margin-left": "8px" }
                                                                                      }, {
                                                                                        default: withCtx(() => [
                                                                                          createTextVNode(" Not enrolled ")
                                                                                        ]),
                                                                                        _: 1
                                                                                      }))
                                                                                    ]),
                                                                                    createVNode("div", { class: "classroom-meta" }, [
                                                                                      createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                                      item.courseTitle ? (openBlock(), createBlock("span", { key: 0 }, "• Course: " + toDisplayString(item.courseTitle), 1)) : createCommentVNode("", true)
                                                                                    ]),
                                                                                    createVNode("div", { class: "classroom-meta" }, [
                                                                                      createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                                                      item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, " • Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                                                    ]),
                                                                                    createVNode("div", { class: "classroom-meta" }, [
                                                                                      createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                                                      createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                                                    ])
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
                                                                    _: 2
                                                                  }, _parent10, _scopeId9));
                                                                });
                                                                _push10(`<!--]-->`);
                                                                _push10(ssrRenderComponent(_component_a_collapse_panel, {
                                                                  key: "other",
                                                                  header: "Other classrooms"
                                                                }, {
                                                                  default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                    if (_push11) {
                                                                      _push11(ssrRenderComponent(_component_a_list, {
                                                                        size: "small",
                                                                        "data-source": classroomsWithoutDepartment.value,
                                                                        locale: { emptyText: "No other classrooms" }
                                                                      }, {
                                                                        renderItem: withCtx(({ item }, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(ssrRenderComponent(_component_a_list_item, null, {
                                                                              default: withCtx((_11, _push13, _parent13, _scopeId12) => {
                                                                                if (_push13) {
                                                                                  _push13(`<div class="classroom-item" data-v-789f08b6${_scopeId12}><div class="classroom-title" data-v-789f08b6${_scopeId12}>`);
                                                                                  _push13(ssrRenderComponent(unref(BookOutlined), { class: "section-icon" }, null, _parent13, _scopeId12));
                                                                                  _push13(`<span data-v-789f08b6${_scopeId12}>${ssrInterpolate(item.title)}</span></div><div class="classroom-meta" data-v-789f08b6${_scopeId12}><span data-v-789f08b6${_scopeId12}>Code: ${ssrInterpolate(item.code)}</span><span data-v-789f08b6${_scopeId12}>• Status: ${ssrInterpolate(item.status || "—")}</span></div></div>`);
                                                                                } else {
                                                                                  return [
                                                                                    createVNode("div", { class: "classroom-item" }, [
                                                                                      createVNode("div", { class: "classroom-title" }, [
                                                                                        createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                                        createVNode("span", null, toDisplayString(item.title), 1)
                                                                                      ]),
                                                                                      createVNode("div", { class: "classroom-meta" }, [
                                                                                        createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                                        createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                                                      ])
                                                                                    ])
                                                                                  ];
                                                                                }
                                                                              }),
                                                                              _: 2
                                                                            }, _parent12, _scopeId11));
                                                                          } else {
                                                                            return [
                                                                              createVNode(_component_a_list_item, null, {
                                                                                default: withCtx(() => [
                                                                                  createVNode("div", { class: "classroom-item" }, [
                                                                                    createVNode("div", { class: "classroom-title" }, [
                                                                                      createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                                      createVNode("span", null, toDisplayString(item.title), 1)
                                                                                    ]),
                                                                                    createVNode("div", { class: "classroom-meta" }, [
                                                                                      createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                                      createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                                                    ])
                                                                                  ])
                                                                                ]),
                                                                                _: 2
                                                                              }, 1024)
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 1
                                                                      }, _parent11, _scopeId10));
                                                                    } else {
                                                                      return [
                                                                        createVNode(_component_a_list, {
                                                                          size: "small",
                                                                          "data-source": classroomsWithoutDepartment.value,
                                                                          locale: { emptyText: "No other classrooms" }
                                                                        }, {
                                                                          renderItem: withCtx(({ item }) => [
                                                                            createVNode(_component_a_list_item, null, {
                                                                              default: withCtx(() => [
                                                                                createVNode("div", { class: "classroom-item" }, [
                                                                                  createVNode("div", { class: "classroom-title" }, [
                                                                                    createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                                    createVNode("span", null, toDisplayString(item.title), 1)
                                                                                  ]),
                                                                                  createVNode("div", { class: "classroom-meta" }, [
                                                                                    createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                                    createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                                                  ])
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
                                                                }, _parent10, _scopeId9));
                                                              } else {
                                                                return [
                                                                  (openBlock(true), createBlock(Fragment, null, renderList(activeDepartments.value, (dept) => {
                                                                    return openBlock(), createBlock(_component_a_collapse_panel, {
                                                                      key: dept.id,
                                                                      header: dept.name
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createVNode("p", { class: "dept-meta" }, toDisplayString(dept.contact || "No contact details"), 1),
                                                                        createVNode(_component_a_list, {
                                                                          size: "small",
                                                                          "data-source": classroomsByDepartment(dept.id),
                                                                          locale: { emptyText: "No classrooms in this department" }
                                                                        }, {
                                                                          renderItem: withCtx(({ item }) => [
                                                                            createVNode(_component_a_list_item, null, {
                                                                              default: withCtx(() => [
                                                                                createVNode("div", { class: "classroom-item" }, [
                                                                                  createVNode("div", { class: "classroom-title" }, [
                                                                                    createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                                    createVNode("span", null, toDisplayString(item.title), 1),
                                                                                    item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                                                      key: 0,
                                                                                      color: "green",
                                                                                      style: { "margin-left": "8px" }
                                                                                    }, {
                                                                                      default: withCtx(() => [
                                                                                        createTextVNode(" Enrolled ")
                                                                                      ]),
                                                                                      _: 1
                                                                                    })) : (openBlock(), createBlock(_component_a_tag, {
                                                                                      key: 1,
                                                                                      style: { "margin-left": "8px" }
                                                                                    }, {
                                                                                      default: withCtx(() => [
                                                                                        createTextVNode(" Not enrolled ")
                                                                                      ]),
                                                                                      _: 1
                                                                                    }))
                                                                                  ]),
                                                                                  createVNode("div", { class: "classroom-meta" }, [
                                                                                    createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                                    item.courseTitle ? (openBlock(), createBlock("span", { key: 0 }, "• Course: " + toDisplayString(item.courseTitle), 1)) : createCommentVNode("", true)
                                                                                  ]),
                                                                                  createVNode("div", { class: "classroom-meta" }, [
                                                                                    createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                                                    item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, " • Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                                                  ]),
                                                                                  createVNode("div", { class: "classroom-meta" }, [
                                                                                    createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                                                    createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                                                  ])
                                                                                ])
                                                                              ]),
                                                                              _: 2
                                                                            }, 1024)
                                                                          ]),
                                                                          _: 1
                                                                        }, 8, ["data-source"])
                                                                      ]),
                                                                      _: 2
                                                                    }, 1032, ["header"]);
                                                                  }), 128)),
                                                                  createVNode(_component_a_collapse_panel, {
                                                                    key: "other",
                                                                    header: "Other classrooms"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(_component_a_list, {
                                                                        size: "small",
                                                                        "data-source": classroomsWithoutDepartment.value,
                                                                        locale: { emptyText: "No other classrooms" }
                                                                      }, {
                                                                        renderItem: withCtx(({ item }) => [
                                                                          createVNode(_component_a_list_item, null, {
                                                                            default: withCtx(() => [
                                                                              createVNode("div", { class: "classroom-item" }, [
                                                                                createVNode("div", { class: "classroom-title" }, [
                                                                                  createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                                  createVNode("span", null, toDisplayString(item.title), 1)
                                                                                ]),
                                                                                createVNode("div", { class: "classroom-meta" }, [
                                                                                  createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                                  createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                                                ])
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
                                                                ];
                                                              }
                                                            }),
                                                            _: 1
                                                          }, _parent9, _scopeId8));
                                                        } else {
                                                          return [
                                                            createVNode(_component_a_collapse, { accordion: "" }, {
                                                              default: withCtx(() => [
                                                                (openBlock(true), createBlock(Fragment, null, renderList(activeDepartments.value, (dept) => {
                                                                  return openBlock(), createBlock(_component_a_collapse_panel, {
                                                                    key: dept.id,
                                                                    header: dept.name
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode("p", { class: "dept-meta" }, toDisplayString(dept.contact || "No contact details"), 1),
                                                                      createVNode(_component_a_list, {
                                                                        size: "small",
                                                                        "data-source": classroomsByDepartment(dept.id),
                                                                        locale: { emptyText: "No classrooms in this department" }
                                                                      }, {
                                                                        renderItem: withCtx(({ item }) => [
                                                                          createVNode(_component_a_list_item, null, {
                                                                            default: withCtx(() => [
                                                                              createVNode("div", { class: "classroom-item" }, [
                                                                                createVNode("div", { class: "classroom-title" }, [
                                                                                  createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                                  createVNode("span", null, toDisplayString(item.title), 1),
                                                                                  item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                                                    key: 0,
                                                                                    color: "green",
                                                                                    style: { "margin-left": "8px" }
                                                                                  }, {
                                                                                    default: withCtx(() => [
                                                                                      createTextVNode(" Enrolled ")
                                                                                    ]),
                                                                                    _: 1
                                                                                  })) : (openBlock(), createBlock(_component_a_tag, {
                                                                                    key: 1,
                                                                                    style: { "margin-left": "8px" }
                                                                                  }, {
                                                                                    default: withCtx(() => [
                                                                                      createTextVNode(" Not enrolled ")
                                                                                    ]),
                                                                                    _: 1
                                                                                  }))
                                                                                ]),
                                                                                createVNode("div", { class: "classroom-meta" }, [
                                                                                  createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                                  item.courseTitle ? (openBlock(), createBlock("span", { key: 0 }, "• Course: " + toDisplayString(item.courseTitle), 1)) : createCommentVNode("", true)
                                                                                ]),
                                                                                createVNode("div", { class: "classroom-meta" }, [
                                                                                  createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                                                  item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, " • Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                                                ]),
                                                                                createVNode("div", { class: "classroom-meta" }, [
                                                                                  createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                                                  createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                                                ])
                                                                              ])
                                                                            ]),
                                                                            _: 2
                                                                          }, 1024)
                                                                        ]),
                                                                        _: 1
                                                                      }, 8, ["data-source"])
                                                                    ]),
                                                                    _: 2
                                                                  }, 1032, ["header"]);
                                                                }), 128)),
                                                                createVNode(_component_a_collapse_panel, {
                                                                  key: "other",
                                                                  header: "Other classrooms"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(_component_a_list, {
                                                                      size: "small",
                                                                      "data-source": classroomsWithoutDepartment.value,
                                                                      locale: { emptyText: "No other classrooms" }
                                                                    }, {
                                                                      renderItem: withCtx(({ item }) => [
                                                                        createVNode(_component_a_list_item, null, {
                                                                          default: withCtx(() => [
                                                                            createVNode("div", { class: "classroom-item" }, [
                                                                              createVNode("div", { class: "classroom-title" }, [
                                                                                createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                                createVNode("span", null, toDisplayString(item.title), 1)
                                                                              ]),
                                                                              createVNode("div", { class: "classroom-meta" }, [
                                                                                createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                                createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                                              ])
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
                                                              ]),
                                                              _: 1
                                                            })
                                                          ];
                                                        }
                                                      }),
                                                      _: 1
                                                    }, _parent8, _scopeId7));
                                                    _push8(ssrRenderComponent(_component_a_col, { span: 8 }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(ssrRenderComponent(_component_a_card, {
                                                            size: "small",
                                                            title: "Classroom summary"
                                                          }, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(ssrRenderComponent(_component_a_descriptions, {
                                                                  column: 1,
                                                                  size: "small"
                                                                }, {
                                                                  default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                    if (_push11) {
                                                                      _push11(ssrRenderComponent(_component_a_descriptions_item, { label: "Total classrooms" }, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(`${ssrInterpolate(viewModel.value.classrooms.length)}`);
                                                                          } else {
                                                                            return [
                                                                              createTextVNode(toDisplayString(viewModel.value.classrooms.length), 1)
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 1
                                                                      }, _parent11, _scopeId10));
                                                                      _push11(ssrRenderComponent(_component_a_descriptions_item, { label: "Active classrooms" }, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(`${ssrInterpolate(activeClassrooms.value.length)}`);
                                                                          } else {
                                                                            return [
                                                                              createTextVNode(toDisplayString(activeClassrooms.value.length), 1)
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 1
                                                                      }, _parent11, _scopeId10));
                                                                      _push11(ssrRenderComponent(_component_a_descriptions_item, { label: "My classrooms" }, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(`${ssrInterpolate(enrolledClassrooms.value.length)}`);
                                                                          } else {
                                                                            return [
                                                                              createTextVNode(toDisplayString(enrolledClassrooms.value.length), 1)
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 1
                                                                      }, _parent11, _scopeId10));
                                                                      _push11(ssrRenderComponent(_component_a_descriptions_item, { label: "Enrollment records" }, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(`${ssrInterpolate(viewModel.value.classroomEnrollments.length)}`);
                                                                          } else {
                                                                            return [
                                                                              createTextVNode(toDisplayString(viewModel.value.classroomEnrollments.length), 1)
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 1
                                                                      }, _parent11, _scopeId10));
                                                                    } else {
                                                                      return [
                                                                        createVNode(_component_a_descriptions_item, { label: "Total classrooms" }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(viewModel.value.classrooms.length), 1)
                                                                          ]),
                                                                          _: 1
                                                                        }),
                                                                        createVNode(_component_a_descriptions_item, { label: "Active classrooms" }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(activeClassrooms.value.length), 1)
                                                                          ]),
                                                                          _: 1
                                                                        }),
                                                                        createVNode(_component_a_descriptions_item, { label: "My classrooms" }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(enrolledClassrooms.value.length), 1)
                                                                          ]),
                                                                          _: 1
                                                                        }),
                                                                        createVNode(_component_a_descriptions_item, { label: "Enrollment records" }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(viewModel.value.classroomEnrollments.length), 1)
                                                                          ]),
                                                                          _: 1
                                                                        })
                                                                      ];
                                                                    }
                                                                  }),
                                                                  _: 1
                                                                }, _parent10, _scopeId9));
                                                              } else {
                                                                return [
                                                                  createVNode(_component_a_descriptions, {
                                                                    column: 1,
                                                                    size: "small"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(_component_a_descriptions_item, { label: "Total classrooms" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(viewModel.value.classrooms.length), 1)
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(_component_a_descriptions_item, { label: "Active classrooms" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(activeClassrooms.value.length), 1)
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(_component_a_descriptions_item, { label: "My classrooms" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(enrolledClassrooms.value.length), 1)
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(_component_a_descriptions_item, { label: "Enrollment records" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(viewModel.value.classroomEnrollments.length), 1)
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
                                                          }, _parent9, _scopeId8));
                                                        } else {
                                                          return [
                                                            createVNode(_component_a_card, {
                                                              size: "small",
                                                              title: "Classroom summary"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_descriptions, {
                                                                  column: 1,
                                                                  size: "small"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(_component_a_descriptions_item, { label: "Total classrooms" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(viewModel.value.classrooms.length), 1)
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(_component_a_descriptions_item, { label: "Active classrooms" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(activeClassrooms.value.length), 1)
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(_component_a_descriptions_item, { label: "My classrooms" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(enrolledClassrooms.value.length), 1)
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(_component_a_descriptions_item, { label: "Enrollment records" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(viewModel.value.classroomEnrollments.length), 1)
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
                                                    }, _parent8, _scopeId7));
                                                  } else {
                                                    return [
                                                      createVNode(_component_a_col, { span: 16 }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_collapse, { accordion: "" }, {
                                                            default: withCtx(() => [
                                                              (openBlock(true), createBlock(Fragment, null, renderList(activeDepartments.value, (dept) => {
                                                                return openBlock(), createBlock(_component_a_collapse_panel, {
                                                                  key: dept.id,
                                                                  header: dept.name
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode("p", { class: "dept-meta" }, toDisplayString(dept.contact || "No contact details"), 1),
                                                                    createVNode(_component_a_list, {
                                                                      size: "small",
                                                                      "data-source": classroomsByDepartment(dept.id),
                                                                      locale: { emptyText: "No classrooms in this department" }
                                                                    }, {
                                                                      renderItem: withCtx(({ item }) => [
                                                                        createVNode(_component_a_list_item, null, {
                                                                          default: withCtx(() => [
                                                                            createVNode("div", { class: "classroom-item" }, [
                                                                              createVNode("div", { class: "classroom-title" }, [
                                                                                createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                                createVNode("span", null, toDisplayString(item.title), 1),
                                                                                item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                                                  key: 0,
                                                                                  color: "green",
                                                                                  style: { "margin-left": "8px" }
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createTextVNode(" Enrolled ")
                                                                                  ]),
                                                                                  _: 1
                                                                                })) : (openBlock(), createBlock(_component_a_tag, {
                                                                                  key: 1,
                                                                                  style: { "margin-left": "8px" }
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createTextVNode(" Not enrolled ")
                                                                                  ]),
                                                                                  _: 1
                                                                                }))
                                                                              ]),
                                                                              createVNode("div", { class: "classroom-meta" }, [
                                                                                createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                                item.courseTitle ? (openBlock(), createBlock("span", { key: 0 }, "• Course: " + toDisplayString(item.courseTitle), 1)) : createCommentVNode("", true)
                                                                              ]),
                                                                              createVNode("div", { class: "classroom-meta" }, [
                                                                                createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                                                item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, " • Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                                              ]),
                                                                              createVNode("div", { class: "classroom-meta" }, [
                                                                                createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                                                createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                                              ])
                                                                            ])
                                                                          ]),
                                                                          _: 2
                                                                        }, 1024)
                                                                      ]),
                                                                      _: 1
                                                                    }, 8, ["data-source"])
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["header"]);
                                                              }), 128)),
                                                              createVNode(_component_a_collapse_panel, {
                                                                key: "other",
                                                                header: "Other classrooms"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(_component_a_list, {
                                                                    size: "small",
                                                                    "data-source": classroomsWithoutDepartment.value,
                                                                    locale: { emptyText: "No other classrooms" }
                                                                  }, {
                                                                    renderItem: withCtx(({ item }) => [
                                                                      createVNode(_component_a_list_item, null, {
                                                                        default: withCtx(() => [
                                                                          createVNode("div", { class: "classroom-item" }, [
                                                                            createVNode("div", { class: "classroom-title" }, [
                                                                              createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                              createVNode("span", null, toDisplayString(item.title), 1)
                                                                            ]),
                                                                            createVNode("div", { class: "classroom-meta" }, [
                                                                              createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                              createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                                            ])
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
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(_component_a_col, { span: 8 }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_card, {
                                                            size: "small",
                                                            title: "Classroom summary"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_descriptions, {
                                                                column: 1,
                                                                size: "small"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(_component_a_descriptions_item, { label: "Total classrooms" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(viewModel.value.classrooms.length), 1)
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(_component_a_descriptions_item, { label: "Active classrooms" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(activeClassrooms.value.length), 1)
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(_component_a_descriptions_item, { label: "My classrooms" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(enrolledClassrooms.value.length), 1)
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(_component_a_descriptions_item, { label: "Enrollment records" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(viewModel.value.classroomEnrollments.length), 1)
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
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode("div", { class: "section-header" }, [
                                                  createVNode("span", { class: "section-title" }, [
                                                    createVNode(unref(ClusterOutlined), { class: "section-icon" }),
                                                    createTextVNode(" Departments ")
                                                  ]),
                                                  createVNode(_component_a_switch, {
                                                    checked: showOnlyMyClassrooms.value,
                                                    "onUpdate:checked": ($event) => showOnlyMyClassrooms.value = $event,
                                                    size: "small",
                                                    style: { "margin-left": "auto" }
                                                  }, null, 8, ["checked", "onUpdate:checked"]),
                                                  createVNode("span", { class: "filter-label" }, "Show only my classrooms")
                                                ]),
                                                createVNode(_component_a_row, {
                                                  gutter: 16,
                                                  style: { "margin-top": "8px" }
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_col, { span: 16 }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_collapse, { accordion: "" }, {
                                                          default: withCtx(() => [
                                                            (openBlock(true), createBlock(Fragment, null, renderList(activeDepartments.value, (dept) => {
                                                              return openBlock(), createBlock(_component_a_collapse_panel, {
                                                                key: dept.id,
                                                                header: dept.name
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode("p", { class: "dept-meta" }, toDisplayString(dept.contact || "No contact details"), 1),
                                                                  createVNode(_component_a_list, {
                                                                    size: "small",
                                                                    "data-source": classroomsByDepartment(dept.id),
                                                                    locale: { emptyText: "No classrooms in this department" }
                                                                  }, {
                                                                    renderItem: withCtx(({ item }) => [
                                                                      createVNode(_component_a_list_item, null, {
                                                                        default: withCtx(() => [
                                                                          createVNode("div", { class: "classroom-item" }, [
                                                                            createVNode("div", { class: "classroom-title" }, [
                                                                              createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                              createVNode("span", null, toDisplayString(item.title), 1),
                                                                              item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                                                key: 0,
                                                                                color: "green",
                                                                                style: { "margin-left": "8px" }
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createTextVNode(" Enrolled ")
                                                                                ]),
                                                                                _: 1
                                                                              })) : (openBlock(), createBlock(_component_a_tag, {
                                                                                key: 1,
                                                                                style: { "margin-left": "8px" }
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createTextVNode(" Not enrolled ")
                                                                                ]),
                                                                                _: 1
                                                                              }))
                                                                            ]),
                                                                            createVNode("div", { class: "classroom-meta" }, [
                                                                              createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                              item.courseTitle ? (openBlock(), createBlock("span", { key: 0 }, "• Course: " + toDisplayString(item.courseTitle), 1)) : createCommentVNode("", true)
                                                                            ]),
                                                                            createVNode("div", { class: "classroom-meta" }, [
                                                                              createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                                              item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, " • Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                                            ]),
                                                                            createVNode("div", { class: "classroom-meta" }, [
                                                                              createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                                              createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                                            ])
                                                                          ])
                                                                        ]),
                                                                        _: 2
                                                                      }, 1024)
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["data-source"])
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["header"]);
                                                            }), 128)),
                                                            createVNode(_component_a_collapse_panel, {
                                                              key: "other",
                                                              header: "Other classrooms"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_list, {
                                                                  size: "small",
                                                                  "data-source": classroomsWithoutDepartment.value,
                                                                  locale: { emptyText: "No other classrooms" }
                                                                }, {
                                                                  renderItem: withCtx(({ item }) => [
                                                                    createVNode(_component_a_list_item, null, {
                                                                      default: withCtx(() => [
                                                                        createVNode("div", { class: "classroom-item" }, [
                                                                          createVNode("div", { class: "classroom-title" }, [
                                                                            createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                            createVNode("span", null, toDisplayString(item.title), 1)
                                                                          ]),
                                                                          createVNode("div", { class: "classroom-meta" }, [
                                                                            createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                            createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                                          ])
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
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_col, { span: 8 }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_card, {
                                                          size: "small",
                                                          title: "Classroom summary"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_descriptions, {
                                                              column: 1,
                                                              size: "small"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_descriptions_item, { label: "Total classrooms" }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(viewModel.value.classrooms.length), 1)
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(_component_a_descriptions_item, { label: "Active classrooms" }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(activeClassrooms.value.length), 1)
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(_component_a_descriptions_item, { label: "My classrooms" }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(enrolledClassrooms.value.length), 1)
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(_component_a_descriptions_item, { label: "Enrollment records" }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(viewModel.value.classroomEnrollments.length), 1)
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
                                                })
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(_component_a_tab_pane, {
                                          key: "courses",
                                          tab: "Courses & Progress"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`<div class="section-header" data-v-789f08b6${_scopeId6}><span class="section-title" data-v-789f08b6${_scopeId6}>`);
                                              _push7(ssrRenderComponent(unref(BookOutlined), { class: "section-icon" }, null, _parent7, _scopeId6));
                                              _push7(` Courses at this institution </span></div>`);
                                              _push7(ssrRenderComponent(_component_a_table, {
                                                size: "small",
                                                columns: courseColumns,
                                                dataSource: courses.value,
                                                "row-key": "courseId",
                                                pagination: { pageSize: 5 },
                                                style: { "margin-top": "8px" }
                                              }, {
                                                bodyCell: withCtx(({ column, record }, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    if (column.key === "progress") {
                                                      _push8(ssrRenderComponent(_component_a_progress, {
                                                        percent: record.progressPct,
                                                        size: "small"
                                                      }, null, _parent8, _scopeId7));
                                                    } else if (column.key === "grade") {
                                                      _push8(`<!--[-->`);
                                                      if (record.gradePct !== null && record.gradePct !== void 0) {
                                                        _push8(`<span data-v-789f08b6${_scopeId7}>${ssrInterpolate(record.gradePct.toFixed(0))}% </span>`);
                                                      } else {
                                                        _push8(`<span data-v-789f08b6${_scopeId7}>—</span>`);
                                                      }
                                                      _push8(`<!--]-->`);
                                                    } else {
                                                      _push8(`<!--[-->${ssrInterpolate(record[column.dataIndex] || "—")}<!--]-->`);
                                                    }
                                                  } else {
                                                    return [
                                                      column.key === "progress" ? (openBlock(), createBlock(_component_a_progress, {
                                                        key: 0,
                                                        percent: record.progressPct,
                                                        size: "small"
                                                      }, null, 8, ["percent"])) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                        record.gradePct !== null && record.gradePct !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.gradePct.toFixed(0)) + "% ", 1)) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                                                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                        createTextVNode(toDisplayString(record[column.dataIndex] || "—"), 1)
                                                      ], 64))
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode("div", { class: "section-header" }, [
                                                  createVNode("span", { class: "section-title" }, [
                                                    createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                    createTextVNode(" Courses at this institution ")
                                                  ])
                                                ]),
                                                createVNode(_component_a_table, {
                                                  size: "small",
                                                  columns: courseColumns,
                                                  dataSource: courses.value,
                                                  "row-key": "courseId",
                                                  pagination: { pageSize: 5 },
                                                  style: { "margin-top": "8px" }
                                                }, {
                                                  bodyCell: withCtx(({ column, record }) => [
                                                    column.key === "progress" ? (openBlock(), createBlock(_component_a_progress, {
                                                      key: 0,
                                                      percent: record.progressPct,
                                                      size: "small"
                                                    }, null, 8, ["percent"])) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                      record.gradePct !== null && record.gradePct !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.gradePct.toFixed(0)) + "% ", 1)) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                                                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                      createTextVNode(toDisplayString(record[column.dataIndex] || "—"), 1)
                                                    ], 64))
                                                  ]),
                                                  _: 1
                                                }, 8, ["dataSource"])
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(_component_a_tab_pane, {
                                          key: "labs",
                                          tab: "Labs & Assignments"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(_component_a_row, { gutter: 16 }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(_component_a_col, { span: 14 }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(ssrRenderComponent(_component_a_card, {
                                                            size: "small",
                                                            title: "Assignments"
                                                          }, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(ssrRenderComponent(_component_a_table, {
                                                                  size: "small",
                                                                  columns: assignmentColumnsDetailed,
                                                                  dataSource: viewModel.value.assignments,
                                                                  "row-key": "id",
                                                                  pagination: { pageSize: 8 }
                                                                }, {
                                                                  bodyCell: withCtx(({ column, record }, _push11, _parent11, _scopeId10) => {
                                                                    if (_push11) {
                                                                      if (column.key === "dueDate") {
                                                                        _push11(`<!--[-->${ssrInterpolate(formatDate(record.dueDate))}<!--]-->`);
                                                                      } else if (column.key === "status") {
                                                                        _push11(`<!--[-->`);
                                                                        if (record.submissionStatus === "graded") {
                                                                          _push11(ssrRenderComponent(_component_a_tag, { color: "green" }, {
                                                                            default: withCtx((_10, _push12, _parent12, _scopeId11) => {
                                                                              if (_push12) {
                                                                                _push12(` Graded `);
                                                                              } else {
                                                                                return [
                                                                                  createTextVNode(" Graded ")
                                                                                ];
                                                                              }
                                                                            }),
                                                                            _: 2
                                                                          }, _parent11, _scopeId10));
                                                                        } else if (record.submissionStatus === "submitted") {
                                                                          _push11(ssrRenderComponent(_component_a_tag, { color: "blue" }, {
                                                                            default: withCtx((_10, _push12, _parent12, _scopeId11) => {
                                                                              if (_push12) {
                                                                                _push12(` Submitted `);
                                                                              } else {
                                                                                return [
                                                                                  createTextVNode(" Submitted ")
                                                                                ];
                                                                              }
                                                                            }),
                                                                            _: 2
                                                                          }, _parent11, _scopeId10));
                                                                        } else {
                                                                          _push11(ssrRenderComponent(_component_a_tag, null, {
                                                                            default: withCtx((_10, _push12, _parent12, _scopeId11) => {
                                                                              if (_push12) {
                                                                                _push12(` Not submitted `);
                                                                              } else {
                                                                                return [
                                                                                  createTextVNode(" Not submitted ")
                                                                                ];
                                                                              }
                                                                            }),
                                                                            _: 2
                                                                          }, _parent11, _scopeId10));
                                                                        }
                                                                        _push11(`<!--]-->`);
                                                                      } else if (column.key === "grade") {
                                                                        _push11(`<!--[-->`);
                                                                        if (record.grade !== null && record.grade !== void 0) {
                                                                          _push11(`<span data-v-789f08b6${_scopeId10}>${ssrInterpolate(record.grade.toFixed(1))}</span>`);
                                                                        } else {
                                                                          _push11(`<span data-v-789f08b6${_scopeId10}>—</span>`);
                                                                        }
                                                                        _push11(`<!--]-->`);
                                                                      } else {
                                                                        _push11(`<!--[-->${ssrInterpolate(record[column.dataIndex] || "—")}<!--]-->`);
                                                                      }
                                                                    } else {
                                                                      return [
                                                                        column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                                          createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                                        ], 64)) : column.key === "status" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                                          record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                            key: 0,
                                                                            color: "green"
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode(" Graded ")
                                                                            ]),
                                                                            _: 1
                                                                          })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                            key: 1,
                                                                            color: "blue"
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode(" Submitted ")
                                                                            ]),
                                                                            _: 1
                                                                          })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode(" Not submitted ")
                                                                            ]),
                                                                            _: 1
                                                                          }))
                                                                        ], 64)) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                                          record.grade !== null && record.grade !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.grade.toFixed(1)), 1)) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                                                                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                                          createTextVNode(toDisplayString(record[column.dataIndex] || "—"), 1)
                                                                        ], 64))
                                                                      ];
                                                                    }
                                                                  }),
                                                                  _: 1
                                                                }, _parent10, _scopeId9));
                                                              } else {
                                                                return [
                                                                  createVNode(_component_a_table, {
                                                                    size: "small",
                                                                    columns: assignmentColumnsDetailed,
                                                                    dataSource: viewModel.value.assignments,
                                                                    "row-key": "id",
                                                                    pagination: { pageSize: 8 }
                                                                  }, {
                                                                    bodyCell: withCtx(({ column, record }) => [
                                                                      column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                                        createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                                      ], 64)) : column.key === "status" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                                        record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                          key: 0,
                                                                          color: "green"
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(" Graded ")
                                                                          ]),
                                                                          _: 1
                                                                        })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                          key: 1,
                                                                          color: "blue"
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(" Submitted ")
                                                                          ]),
                                                                          _: 1
                                                                        })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(" Not submitted ")
                                                                          ]),
                                                                          _: 1
                                                                        }))
                                                                      ], 64)) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                                        record.grade !== null && record.grade !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.grade.toFixed(1)), 1)) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                                                                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                                        createTextVNode(toDisplayString(record[column.dataIndex] || "—"), 1)
                                                                      ], 64))
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["dataSource"])
                                                                ];
                                                              }
                                                            }),
                                                            _: 1
                                                          }, _parent9, _scopeId8));
                                                        } else {
                                                          return [
                                                            createVNode(_component_a_card, {
                                                              size: "small",
                                                              title: "Assignments"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_table, {
                                                                  size: "small",
                                                                  columns: assignmentColumnsDetailed,
                                                                  dataSource: viewModel.value.assignments,
                                                                  "row-key": "id",
                                                                  pagination: { pageSize: 8 }
                                                                }, {
                                                                  bodyCell: withCtx(({ column, record }) => [
                                                                    column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                                      createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                                    ], 64)) : column.key === "status" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                                      record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                        key: 0,
                                                                        color: "green"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(" Graded ")
                                                                        ]),
                                                                        _: 1
                                                                      })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                        key: 1,
                                                                        color: "blue"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(" Submitted ")
                                                                        ]),
                                                                        _: 1
                                                                      })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(" Not submitted ")
                                                                        ]),
                                                                        _: 1
                                                                      }))
                                                                    ], 64)) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                                      record.grade !== null && record.grade !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.grade.toFixed(1)), 1)) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                                                                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                                      createTextVNode(toDisplayString(record[column.dataIndex] || "—"), 1)
                                                                    ], 64))
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["dataSource"])
                                                              ]),
                                                              _: 1
                                                            })
                                                          ];
                                                        }
                                                      }),
                                                      _: 1
                                                    }, _parent8, _scopeId7));
                                                    _push8(ssrRenderComponent(_component_a_col, { span: 10 }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(ssrRenderComponent(_component_a_card, {
                                                            size: "small",
                                                            title: "Lab sessions"
                                                          }, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(ssrRenderComponent(_component_a_list, {
                                                                  size: "small",
                                                                  "data-source": viewModel.value.labs
                                                                }, {
                                                                  renderItem: withCtx(({ item: lab }, _push11, _parent11, _scopeId10) => {
                                                                    if (_push11) {
                                                                      _push11(ssrRenderComponent(_component_a_list_item, null, {
                                                                        default: withCtx((_10, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(`<div class="lab-item" data-v-789f08b6${_scopeId11}><div class="lab-title" data-v-789f08b6${_scopeId11}>${ssrInterpolate(lab.challengeTitle)}</div><div class="lab-meta" data-v-789f08b6${_scopeId11}><span data-v-789f08b6${_scopeId11}>${ssrInterpolate(lab.courseTitle || "No course")}</span><span data-v-789f08b6${_scopeId11}>•</span><span data-v-789f08b6${_scopeId11}>Status: ${ssrInterpolate(lab.status)}</span></div><div class="lab-meta" data-v-789f08b6${_scopeId11}><span data-v-789f08b6${_scopeId11}>Runtime: ${ssrInterpolate(lab.runtime || "—")}</span><span data-v-789f08b6${_scopeId11}>•</span><span data-v-789f08b6${_scopeId11}>Code server: ${ssrInterpolate(lab.codeServerUrl || "—")}</span></div></div>`);
                                                                          } else {
                                                                            return [
                                                                              createVNode("div", { class: "lab-item" }, [
                                                                                createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                                createVNode("div", { class: "lab-meta" }, [
                                                                                  createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                                  createVNode("span", null, "•"),
                                                                                  createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                                ]),
                                                                                createVNode("div", { class: "lab-meta" }, [
                                                                                  createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                                  createVNode("span", null, "•"),
                                                                                  createVNode("span", null, "Code server: " + toDisplayString(lab.codeServerUrl || "—"), 1)
                                                                                ])
                                                                              ])
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 2
                                                                      }, _parent11, _scopeId10));
                                                                    } else {
                                                                      return [
                                                                        createVNode(_component_a_list_item, null, {
                                                                          default: withCtx(() => [
                                                                            createVNode("div", { class: "lab-item" }, [
                                                                              createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                              createVNode("div", { class: "lab-meta" }, [
                                                                                createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                                createVNode("span", null, "•"),
                                                                                createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                              ]),
                                                                              createVNode("div", { class: "lab-meta" }, [
                                                                                createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                                createVNode("span", null, "•"),
                                                                                createVNode("span", null, "Code server: " + toDisplayString(lab.codeServerUrl || "—"), 1)
                                                                              ])
                                                                            ])
                                                                          ]),
                                                                          _: 2
                                                                        }, 1024)
                                                                      ];
                                                                    }
                                                                  }),
                                                                  _: 1
                                                                }, _parent10, _scopeId9));
                                                              } else {
                                                                return [
                                                                  createVNode(_component_a_list, {
                                                                    size: "small",
                                                                    "data-source": viewModel.value.labs
                                                                  }, {
                                                                    renderItem: withCtx(({ item: lab }) => [
                                                                      createVNode(_component_a_list_item, null, {
                                                                        default: withCtx(() => [
                                                                          createVNode("div", { class: "lab-item" }, [
                                                                            createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                            createVNode("div", { class: "lab-meta" }, [
                                                                              createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                              createVNode("span", null, "•"),
                                                                              createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                            ]),
                                                                            createVNode("div", { class: "lab-meta" }, [
                                                                              createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                              createVNode("span", null, "•"),
                                                                              createVNode("span", null, "Code server: " + toDisplayString(lab.codeServerUrl || "—"), 1)
                                                                            ])
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
                                                          }, _parent9, _scopeId8));
                                                        } else {
                                                          return [
                                                            createVNode(_component_a_card, {
                                                              size: "small",
                                                              title: "Lab sessions"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(_component_a_list, {
                                                                  size: "small",
                                                                  "data-source": viewModel.value.labs
                                                                }, {
                                                                  renderItem: withCtx(({ item: lab }) => [
                                                                    createVNode(_component_a_list_item, null, {
                                                                      default: withCtx(() => [
                                                                        createVNode("div", { class: "lab-item" }, [
                                                                          createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                          createVNode("div", { class: "lab-meta" }, [
                                                                            createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                            createVNode("span", null, "•"),
                                                                            createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                          ]),
                                                                          createVNode("div", { class: "lab-meta" }, [
                                                                            createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                            createVNode("span", null, "•"),
                                                                            createVNode("span", null, "Code server: " + toDisplayString(lab.codeServerUrl || "—"), 1)
                                                                          ])
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
                                                          ];
                                                        }
                                                      }),
                                                      _: 1
                                                    }, _parent8, _scopeId7));
                                                  } else {
                                                    return [
                                                      createVNode(_component_a_col, { span: 14 }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_card, {
                                                            size: "small",
                                                            title: "Assignments"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_table, {
                                                                size: "small",
                                                                columns: assignmentColumnsDetailed,
                                                                dataSource: viewModel.value.assignments,
                                                                "row-key": "id",
                                                                pagination: { pageSize: 8 }
                                                              }, {
                                                                bodyCell: withCtx(({ column, record }) => [
                                                                  column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                                    createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                                  ], 64)) : column.key === "status" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                                    record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                      key: 0,
                                                                      color: "green"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(" Graded ")
                                                                      ]),
                                                                      _: 1
                                                                    })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                      key: 1,
                                                                      color: "blue"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(" Submitted ")
                                                                      ]),
                                                                      _: 1
                                                                    })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(" Not submitted ")
                                                                      ]),
                                                                      _: 1
                                                                    }))
                                                                  ], 64)) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                                    record.grade !== null && record.grade !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.grade.toFixed(1)), 1)) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                                                                  ], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                                    createTextVNode(toDisplayString(record[column.dataIndex] || "—"), 1)
                                                                  ], 64))
                                                                ]),
                                                                _: 1
                                                              }, 8, ["dataSource"])
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(_component_a_col, { span: 10 }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_card, {
                                                            size: "small",
                                                            title: "Lab sessions"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_list, {
                                                                size: "small",
                                                                "data-source": viewModel.value.labs
                                                              }, {
                                                                renderItem: withCtx(({ item: lab }) => [
                                                                  createVNode(_component_a_list_item, null, {
                                                                    default: withCtx(() => [
                                                                      createVNode("div", { class: "lab-item" }, [
                                                                        createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                        createVNode("div", { class: "lab-meta" }, [
                                                                          createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                          createVNode("span", null, "•"),
                                                                          createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                        ]),
                                                                        createVNode("div", { class: "lab-meta" }, [
                                                                          createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                          createVNode("span", null, "•"),
                                                                          createVNode("span", null, "Code server: " + toDisplayString(lab.codeServerUrl || "—"), 1)
                                                                        ])
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
                                                createVNode(_component_a_row, { gutter: 16 }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_col, { span: 14 }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_card, {
                                                          size: "small",
                                                          title: "Assignments"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_table, {
                                                              size: "small",
                                                              columns: assignmentColumnsDetailed,
                                                              dataSource: viewModel.value.assignments,
                                                              "row-key": "id",
                                                              pagination: { pageSize: 8 }
                                                            }, {
                                                              bodyCell: withCtx(({ column, record }) => [
                                                                column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                                  createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                                ], 64)) : column.key === "status" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                                  record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                    key: 0,
                                                                    color: "green"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(" Graded ")
                                                                    ]),
                                                                    _: 1
                                                                  })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                    key: 1,
                                                                    color: "blue"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(" Submitted ")
                                                                    ]),
                                                                    _: 1
                                                                  })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(" Not submitted ")
                                                                    ]),
                                                                    _: 1
                                                                  }))
                                                                ], 64)) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                                  record.grade !== null && record.grade !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.grade.toFixed(1)), 1)) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                                                                ], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                                  createTextVNode(toDisplayString(record[column.dataIndex] || "—"), 1)
                                                                ], 64))
                                                              ]),
                                                              _: 1
                                                            }, 8, ["dataSource"])
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_col, { span: 10 }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_card, {
                                                          size: "small",
                                                          title: "Lab sessions"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_list, {
                                                              size: "small",
                                                              "data-source": viewModel.value.labs
                                                            }, {
                                                              renderItem: withCtx(({ item: lab }) => [
                                                                createVNode(_component_a_list_item, null, {
                                                                  default: withCtx(() => [
                                                                    createVNode("div", { class: "lab-item" }, [
                                                                      createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                      createVNode("div", { class: "lab-meta" }, [
                                                                        createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                        createVNode("span", null, "•"),
                                                                        createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                      ]),
                                                                      createVNode("div", { class: "lab-meta" }, [
                                                                        createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                        createVNode("span", null, "•"),
                                                                        createVNode("span", null, "Code server: " + toDisplayString(lab.codeServerUrl || "—"), 1)
                                                                      ])
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
                                        _push6(ssrRenderComponent(_component_a_tab_pane, {
                                          key: "orders",
                                          tab: "Orders & Billing"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`<div class="section-header" data-v-789f08b6${_scopeId6}><span class="section-title" data-v-789f08b6${_scopeId6}>`);
                                              _push7(ssrRenderComponent(unref(ShoppingCartOutlined), { class: "section-icon" }, null, _parent7, _scopeId6));
                                              _push7(` Orders related to this institution </span></div>`);
                                              _push7(ssrRenderComponent(_component_a_table, {
                                                size: "small",
                                                columns: orderColumns,
                                                dataSource: viewModel.value.orders,
                                                "row-key": "orderId",
                                                pagination: { pageSize: 5 },
                                                style: { "margin-top": "8px" }
                                              }, {
                                                bodyCell: withCtx(({ column, record }, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    if (column.key === "createdAt") {
                                                      _push8(`<!--[-->${ssrInterpolate(formatDate(record.createdAt))}<!--]-->`);
                                                    } else if (column.key === "items") {
                                                      _push8(`<span data-v-789f08b6${_scopeId7}>${ssrInterpolate(record.items.map((i) => i.courseTitle || i.titleSnapshot).join(", "))}</span>`);
                                                    } else if (column.key === "total") {
                                                      _push8(`<!--[-->${ssrInterpolate(record.total.toFixed(2))} ${ssrInterpolate(record.currency)}<!--]-->`);
                                                    } else {
                                                      _push8(`<!--[-->${ssrInterpolate(record[column.dataIndex])}<!--]-->`);
                                                    }
                                                  } else {
                                                    return [
                                                      column.key === "createdAt" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                        createTextVNode(toDisplayString(formatDate(record.createdAt)), 1)
                                                      ], 64)) : column.key === "items" ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(record.items.map((i) => i.courseTitle || i.titleSnapshot).join(", ")), 1)) : column.key === "total" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                        createTextVNode(toDisplayString(record.total.toFixed(2)) + " " + toDisplayString(record.currency), 1)
                                                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                        createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                                      ], 64))
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode("div", { class: "section-header" }, [
                                                  createVNode("span", { class: "section-title" }, [
                                                    createVNode(unref(ShoppingCartOutlined), { class: "section-icon" }),
                                                    createTextVNode(" Orders related to this institution ")
                                                  ])
                                                ]),
                                                createVNode(_component_a_table, {
                                                  size: "small",
                                                  columns: orderColumns,
                                                  dataSource: viewModel.value.orders,
                                                  "row-key": "orderId",
                                                  pagination: { pageSize: 5 },
                                                  style: { "margin-top": "8px" }
                                                }, {
                                                  bodyCell: withCtx(({ column, record }) => [
                                                    column.key === "createdAt" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                      createTextVNode(toDisplayString(formatDate(record.createdAt)), 1)
                                                    ], 64)) : column.key === "items" ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(record.items.map((i) => i.courseTitle || i.titleSnapshot).join(", ")), 1)) : column.key === "total" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                      createTextVNode(toDisplayString(record.total.toFixed(2)) + " " + toDisplayString(record.currency), 1)
                                                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                      createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                                    ], 64))
                                                  ]),
                                                  _: 1
                                                }, 8, ["dataSource"])
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(_component_a_tab_pane, {
                                            key: "overview",
                                            tab: "Overview"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_row, { gutter: 16 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_col, { span: 16 }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_card, {
                                                        size: "small",
                                                        title: "About this institution"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode("p", { class: "institution-description" }, toDisplayString(viewModel.value.institution.description || "No description provided."), 1),
                                                          createVNode(_component_a_descriptions, {
                                                            column: 2,
                                                            size: "small"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(viewModel.value.institution.location || "—"), 1)
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(_component_a_descriptions_item, { label: "Email" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(viewModel.value.institution.email || "—"), 1)
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(_component_a_descriptions_item, { label: "Phone" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(viewModel.value.institution.phone || "—"), 1)
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(_component_a_descriptions_item, { label: "Created" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(formatDate(viewModel.value.institution.createdAt)), 1)
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
                                                        size: "small",
                                                        style: { "margin-top": "16px" },
                                                        title: "Upcoming work (assignments & labs)"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_row, { gutter: 16 }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_col, { span: 14 }, {
                                                                default: withCtx(() => [
                                                                  createVNode("div", { class: "section-header" }, [
                                                                    createVNode("span", { class: "section-title" }, [
                                                                      createVNode(unref(CalendarOutlined), { class: "section-icon" }),
                                                                      createTextVNode(" Assignments ")
                                                                    ]),
                                                                    createVNode(_component_a_switch, {
                                                                      checked: showOnlyOpenAssignments.value,
                                                                      "onUpdate:checked": ($event) => showOnlyOpenAssignments.value = $event,
                                                                      size: "small",
                                                                      style: { "margin-left": "auto" }
                                                                    }, null, 8, ["checked", "onUpdate:checked"]),
                                                                    createVNode("span", { class: "filter-label" }, "Show only open")
                                                                  ]),
                                                                  createVNode(_component_a_table, {
                                                                    size: "small",
                                                                    dataSource: upcomingAssignments.value,
                                                                    columns: assignmentColumns,
                                                                    pagination: false,
                                                                    "row-key": "id"
                                                                  }, {
                                                                    bodyCell: withCtx(({ column, record }) => [
                                                                      column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                                        createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                                      ], 64)) : column.key === "submissionStatus" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                                        record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                          key: 0,
                                                                          color: "green"
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(" Graded ")
                                                                          ]),
                                                                          _: 1
                                                                        })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                          key: 1,
                                                                          color: "blue"
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(" Submitted ")
                                                                          ]),
                                                                          _: 1
                                                                        })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(" Not submitted ")
                                                                          ]),
                                                                          _: 1
                                                                        }))
                                                                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                                        createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                                                      ], 64))
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["dataSource"])
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(_component_a_col, { span: 10 }, {
                                                                default: withCtx(() => [
                                                                  createVNode("div", { class: "section-header" }, [
                                                                    createVNode("span", { class: "section-title" }, [
                                                                      createVNode(unref(ExperimentOutlined), { class: "section-icon" }),
                                                                      createTextVNode(" Lab sessions ")
                                                                    ])
                                                                  ]),
                                                                  recentLabs.value.length ? (openBlock(), createBlock(_component_a_timeline, { key: 0 }, {
                                                                    default: withCtx(() => [
                                                                      (openBlock(true), createBlock(Fragment, null, renderList(recentLabs.value, (lab) => {
                                                                        return openBlock(), createBlock(_component_a_timeline_item, {
                                                                          key: lab.sessionId,
                                                                          color: lab.status === "running" ? "green" : "blue"
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createVNode("div", { class: "lab-item" }, [
                                                                              createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                              createVNode("div", { class: "lab-meta" }, [
                                                                                createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                                createVNode("span", null, "•"),
                                                                                createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                              ]),
                                                                              createVNode("div", { class: "lab-meta" }, [
                                                                                createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                                createVNode("span", null, "•"),
                                                                                createVNode("span", null, "Last heartbeat: " + toDisplayString(formatDate(lab.lastHeartbeat)), 1)
                                                                              ])
                                                                            ])
                                                                          ]),
                                                                          _: 2
                                                                        }, 1032, ["color"]);
                                                                      }), 128))
                                                                    ]),
                                                                    _: 1
                                                                  })) : (openBlock(), createBlock(_component_a_empty, {
                                                                    key: 1,
                                                                    description: "No lab activity yet"
                                                                  }))
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
                                                  createVNode(_component_a_col, { span: 8 }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_card, {
                                                        size: "small",
                                                        title: "My course snapshot"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_statistic, {
                                                            title: "Enrolled courses",
                                                            value: courses.value.length
                                                          }, null, 8, ["value"]),
                                                          createVNode(_component_a_statistic, {
                                                            title: "Completed courses",
                                                            value: completedCoursesCount.value,
                                                            style: { "margin-top": "8px" }
                                                          }, null, 8, ["value"]),
                                                          createVNode(_component_a_statistic, {
                                                            title: "Average progress",
                                                            value: averageCourseProgress.value,
                                                            suffix: "%",
                                                            style: { "margin-top": "8px" }
                                                          }, null, 8, ["value"])
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(_component_a_card, {
                                                        size: "small",
                                                        style: { "margin-top": "16px" },
                                                        title: "Recent notes"
                                                      }, {
                                                        default: withCtx(() => [
                                                          !viewModel.value.notes.length ? (openBlock(), createBlock(_component_a_empty, {
                                                            key: 0,
                                                            description: "No notes yet for this institution"
                                                          })) : (openBlock(), createBlock(_component_a_list, {
                                                            key: 1,
                                                            size: "small",
                                                            "data-source": viewModel.value.notes.slice(0, 3)
                                                          }, {
                                                            renderItem: withCtx(({ item: note }) => [
                                                              createVNode(_component_a_list_item, null, {
                                                                default: withCtx(() => [
                                                                  createVNode("div", { class: "note-item" }, [
                                                                    createVNode("div", { class: "note-course" }, [
                                                                      createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                      createVNode("span", null, toDisplayString(note.courseTitle || "Course"), 1)
                                                                    ]),
                                                                    createVNode("div", { class: "note-body" }, toDisplayString(note.body), 1),
                                                                    createVNode("div", { class: "note-date" }, toDisplayString(formatDate(note.createdAt)), 1)
                                                                  ])
                                                                ]),
                                                                _: 2
                                                              }, 1024)
                                                            ]),
                                                            _: 1
                                                          }, 8, ["data-source"]))
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
                                          createVNode(_component_a_tab_pane, {
                                            key: "departments",
                                            tab: "Departments & Classrooms"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "section-header" }, [
                                                createVNode("span", { class: "section-title" }, [
                                                  createVNode(unref(ClusterOutlined), { class: "section-icon" }),
                                                  createTextVNode(" Departments ")
                                                ]),
                                                createVNode(_component_a_switch, {
                                                  checked: showOnlyMyClassrooms.value,
                                                  "onUpdate:checked": ($event) => showOnlyMyClassrooms.value = $event,
                                                  size: "small",
                                                  style: { "margin-left": "auto" }
                                                }, null, 8, ["checked", "onUpdate:checked"]),
                                                createVNode("span", { class: "filter-label" }, "Show only my classrooms")
                                              ]),
                                              createVNode(_component_a_row, {
                                                gutter: 16,
                                                style: { "margin-top": "8px" }
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_col, { span: 16 }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_collapse, { accordion: "" }, {
                                                        default: withCtx(() => [
                                                          (openBlock(true), createBlock(Fragment, null, renderList(activeDepartments.value, (dept) => {
                                                            return openBlock(), createBlock(_component_a_collapse_panel, {
                                                              key: dept.id,
                                                              header: dept.name
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode("p", { class: "dept-meta" }, toDisplayString(dept.contact || "No contact details"), 1),
                                                                createVNode(_component_a_list, {
                                                                  size: "small",
                                                                  "data-source": classroomsByDepartment(dept.id),
                                                                  locale: { emptyText: "No classrooms in this department" }
                                                                }, {
                                                                  renderItem: withCtx(({ item }) => [
                                                                    createVNode(_component_a_list_item, null, {
                                                                      default: withCtx(() => [
                                                                        createVNode("div", { class: "classroom-item" }, [
                                                                          createVNode("div", { class: "classroom-title" }, [
                                                                            createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                            createVNode("span", null, toDisplayString(item.title), 1),
                                                                            item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                                              key: 0,
                                                                              color: "green",
                                                                              style: { "margin-left": "8px" }
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createTextVNode(" Enrolled ")
                                                                              ]),
                                                                              _: 1
                                                                            })) : (openBlock(), createBlock(_component_a_tag, {
                                                                              key: 1,
                                                                              style: { "margin-left": "8px" }
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createTextVNode(" Not enrolled ")
                                                                              ]),
                                                                              _: 1
                                                                            }))
                                                                          ]),
                                                                          createVNode("div", { class: "classroom-meta" }, [
                                                                            createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                            item.courseTitle ? (openBlock(), createBlock("span", { key: 0 }, "• Course: " + toDisplayString(item.courseTitle), 1)) : createCommentVNode("", true)
                                                                          ]),
                                                                          createVNode("div", { class: "classroom-meta" }, [
                                                                            createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                                            item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, " • Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                                          ]),
                                                                          createVNode("div", { class: "classroom-meta" }, [
                                                                            createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                                            createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                                          ])
                                                                        ])
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024)
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["data-source"])
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["header"]);
                                                          }), 128)),
                                                          createVNode(_component_a_collapse_panel, {
                                                            key: "other",
                                                            header: "Other classrooms"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_list, {
                                                                size: "small",
                                                                "data-source": classroomsWithoutDepartment.value,
                                                                locale: { emptyText: "No other classrooms" }
                                                              }, {
                                                                renderItem: withCtx(({ item }) => [
                                                                  createVNode(_component_a_list_item, null, {
                                                                    default: withCtx(() => [
                                                                      createVNode("div", { class: "classroom-item" }, [
                                                                        createVNode("div", { class: "classroom-title" }, [
                                                                          createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                          createVNode("span", null, toDisplayString(item.title), 1)
                                                                        ]),
                                                                        createVNode("div", { class: "classroom-meta" }, [
                                                                          createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                          createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                                        ])
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
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(_component_a_col, { span: 8 }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_card, {
                                                        size: "small",
                                                        title: "Classroom summary"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_descriptions, {
                                                            column: 1,
                                                            size: "small"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(_component_a_descriptions_item, { label: "Total classrooms" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(viewModel.value.classrooms.length), 1)
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(_component_a_descriptions_item, { label: "Active classrooms" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(activeClassrooms.value.length), 1)
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(_component_a_descriptions_item, { label: "My classrooms" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(enrolledClassrooms.value.length), 1)
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(_component_a_descriptions_item, { label: "Enrollment records" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(viewModel.value.classroomEnrollments.length), 1)
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
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_tab_pane, {
                                            key: "courses",
                                            tab: "Courses & Progress"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "section-header" }, [
                                                createVNode("span", { class: "section-title" }, [
                                                  createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                  createTextVNode(" Courses at this institution ")
                                                ])
                                              ]),
                                              createVNode(_component_a_table, {
                                                size: "small",
                                                columns: courseColumns,
                                                dataSource: courses.value,
                                                "row-key": "courseId",
                                                pagination: { pageSize: 5 },
                                                style: { "margin-top": "8px" }
                                              }, {
                                                bodyCell: withCtx(({ column, record }) => [
                                                  column.key === "progress" ? (openBlock(), createBlock(_component_a_progress, {
                                                    key: 0,
                                                    percent: record.progressPct,
                                                    size: "small"
                                                  }, null, 8, ["percent"])) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                    record.gradePct !== null && record.gradePct !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.gradePct.toFixed(0)) + "% ", 1)) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                                                  ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                    createTextVNode(toDisplayString(record[column.dataIndex] || "—"), 1)
                                                  ], 64))
                                                ]),
                                                _: 1
                                              }, 8, ["dataSource"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_tab_pane, {
                                            key: "labs",
                                            tab: "Labs & Assignments"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_row, { gutter: 16 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_col, { span: 14 }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_card, {
                                                        size: "small",
                                                        title: "Assignments"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_table, {
                                                            size: "small",
                                                            columns: assignmentColumnsDetailed,
                                                            dataSource: viewModel.value.assignments,
                                                            "row-key": "id",
                                                            pagination: { pageSize: 8 }
                                                          }, {
                                                            bodyCell: withCtx(({ column, record }) => [
                                                              column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                                createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                              ], 64)) : column.key === "status" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                                record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                  key: 0,
                                                                  color: "green"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(" Graded ")
                                                                  ]),
                                                                  _: 1
                                                                })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                  key: 1,
                                                                  color: "blue"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(" Submitted ")
                                                                  ]),
                                                                  _: 1
                                                                })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(" Not submitted ")
                                                                  ]),
                                                                  _: 1
                                                                }))
                                                              ], 64)) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                                record.grade !== null && record.grade !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.grade.toFixed(1)), 1)) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                                                              ], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                                createTextVNode(toDisplayString(record[column.dataIndex] || "—"), 1)
                                                              ], 64))
                                                            ]),
                                                            _: 1
                                                          }, 8, ["dataSource"])
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(_component_a_col, { span: 10 }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_card, {
                                                        size: "small",
                                                        title: "Lab sessions"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_list, {
                                                            size: "small",
                                                            "data-source": viewModel.value.labs
                                                          }, {
                                                            renderItem: withCtx(({ item: lab }) => [
                                                              createVNode(_component_a_list_item, null, {
                                                                default: withCtx(() => [
                                                                  createVNode("div", { class: "lab-item" }, [
                                                                    createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                    createVNode("div", { class: "lab-meta" }, [
                                                                      createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                      createVNode("span", null, "•"),
                                                                      createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                    ]),
                                                                    createVNode("div", { class: "lab-meta" }, [
                                                                      createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                      createVNode("span", null, "•"),
                                                                      createVNode("span", null, "Code server: " + toDisplayString(lab.codeServerUrl || "—"), 1)
                                                                    ])
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
                                            key: "orders",
                                            tab: "Orders & Billing"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "section-header" }, [
                                                createVNode("span", { class: "section-title" }, [
                                                  createVNode(unref(ShoppingCartOutlined), { class: "section-icon" }),
                                                  createTextVNode(" Orders related to this institution ")
                                                ])
                                              ]),
                                              createVNode(_component_a_table, {
                                                size: "small",
                                                columns: orderColumns,
                                                dataSource: viewModel.value.orders,
                                                "row-key": "orderId",
                                                pagination: { pageSize: 5 },
                                                style: { "margin-top": "8px" }
                                              }, {
                                                bodyCell: withCtx(({ column, record }) => [
                                                  column.key === "createdAt" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                    createTextVNode(toDisplayString(formatDate(record.createdAt)), 1)
                                                  ], 64)) : column.key === "items" ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(record.items.map((i) => i.courseTitle || i.titleSnapshot).join(", ")), 1)) : column.key === "total" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                    createTextVNode(toDisplayString(record.total.toFixed(2)) + " " + toDisplayString(record.currency), 1)
                                                  ], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                    createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                                  ], 64))
                                                ]),
                                                _: 1
                                              }, 8, ["dataSource"])
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
                                    createVNode(_component_a_tabs, {
                                      activeKey: activeTab.value,
                                      "onUpdate:activeKey": ($event) => activeTab.value = $event
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_tab_pane, {
                                          key: "overview",
                                          tab: "Overview"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_row, { gutter: 16 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_col, { span: 16 }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_card, {
                                                      size: "small",
                                                      title: "About this institution"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode("p", { class: "institution-description" }, toDisplayString(viewModel.value.institution.description || "No description provided."), 1),
                                                        createVNode(_component_a_descriptions, {
                                                          column: 2,
                                                          size: "small"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(viewModel.value.institution.location || "—"), 1)
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(_component_a_descriptions_item, { label: "Email" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(viewModel.value.institution.email || "—"), 1)
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(_component_a_descriptions_item, { label: "Phone" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(viewModel.value.institution.phone || "—"), 1)
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(_component_a_descriptions_item, { label: "Created" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(formatDate(viewModel.value.institution.createdAt)), 1)
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
                                                      size: "small",
                                                      style: { "margin-top": "16px" },
                                                      title: "Upcoming work (assignments & labs)"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_row, { gutter: 16 }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_col, { span: 14 }, {
                                                              default: withCtx(() => [
                                                                createVNode("div", { class: "section-header" }, [
                                                                  createVNode("span", { class: "section-title" }, [
                                                                    createVNode(unref(CalendarOutlined), { class: "section-icon" }),
                                                                    createTextVNode(" Assignments ")
                                                                  ]),
                                                                  createVNode(_component_a_switch, {
                                                                    checked: showOnlyOpenAssignments.value,
                                                                    "onUpdate:checked": ($event) => showOnlyOpenAssignments.value = $event,
                                                                    size: "small",
                                                                    style: { "margin-left": "auto" }
                                                                  }, null, 8, ["checked", "onUpdate:checked"]),
                                                                  createVNode("span", { class: "filter-label" }, "Show only open")
                                                                ]),
                                                                createVNode(_component_a_table, {
                                                                  size: "small",
                                                                  dataSource: upcomingAssignments.value,
                                                                  columns: assignmentColumns,
                                                                  pagination: false,
                                                                  "row-key": "id"
                                                                }, {
                                                                  bodyCell: withCtx(({ column, record }) => [
                                                                    column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                                      createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                                    ], 64)) : column.key === "submissionStatus" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                                      record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                        key: 0,
                                                                        color: "green"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(" Graded ")
                                                                        ]),
                                                                        _: 1
                                                                      })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                        key: 1,
                                                                        color: "blue"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(" Submitted ")
                                                                        ]),
                                                                        _: 1
                                                                      })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(" Not submitted ")
                                                                        ]),
                                                                        _: 1
                                                                      }))
                                                                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                                      createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                                                    ], 64))
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["dataSource"])
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(_component_a_col, { span: 10 }, {
                                                              default: withCtx(() => [
                                                                createVNode("div", { class: "section-header" }, [
                                                                  createVNode("span", { class: "section-title" }, [
                                                                    createVNode(unref(ExperimentOutlined), { class: "section-icon" }),
                                                                    createTextVNode(" Lab sessions ")
                                                                  ])
                                                                ]),
                                                                recentLabs.value.length ? (openBlock(), createBlock(_component_a_timeline, { key: 0 }, {
                                                                  default: withCtx(() => [
                                                                    (openBlock(true), createBlock(Fragment, null, renderList(recentLabs.value, (lab) => {
                                                                      return openBlock(), createBlock(_component_a_timeline_item, {
                                                                        key: lab.sessionId,
                                                                        color: lab.status === "running" ? "green" : "blue"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createVNode("div", { class: "lab-item" }, [
                                                                            createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                            createVNode("div", { class: "lab-meta" }, [
                                                                              createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                              createVNode("span", null, "•"),
                                                                              createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                            ]),
                                                                            createVNode("div", { class: "lab-meta" }, [
                                                                              createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                              createVNode("span", null, "•"),
                                                                              createVNode("span", null, "Last heartbeat: " + toDisplayString(formatDate(lab.lastHeartbeat)), 1)
                                                                            ])
                                                                          ])
                                                                        ]),
                                                                        _: 2
                                                                      }, 1032, ["color"]);
                                                                    }), 128))
                                                                  ]),
                                                                  _: 1
                                                                })) : (openBlock(), createBlock(_component_a_empty, {
                                                                  key: 1,
                                                                  description: "No lab activity yet"
                                                                }))
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
                                                createVNode(_component_a_col, { span: 8 }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_card, {
                                                      size: "small",
                                                      title: "My course snapshot"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_statistic, {
                                                          title: "Enrolled courses",
                                                          value: courses.value.length
                                                        }, null, 8, ["value"]),
                                                        createVNode(_component_a_statistic, {
                                                          title: "Completed courses",
                                                          value: completedCoursesCount.value,
                                                          style: { "margin-top": "8px" }
                                                        }, null, 8, ["value"]),
                                                        createVNode(_component_a_statistic, {
                                                          title: "Average progress",
                                                          value: averageCourseProgress.value,
                                                          suffix: "%",
                                                          style: { "margin-top": "8px" }
                                                        }, null, 8, ["value"])
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_card, {
                                                      size: "small",
                                                      style: { "margin-top": "16px" },
                                                      title: "Recent notes"
                                                    }, {
                                                      default: withCtx(() => [
                                                        !viewModel.value.notes.length ? (openBlock(), createBlock(_component_a_empty, {
                                                          key: 0,
                                                          description: "No notes yet for this institution"
                                                        })) : (openBlock(), createBlock(_component_a_list, {
                                                          key: 1,
                                                          size: "small",
                                                          "data-source": viewModel.value.notes.slice(0, 3)
                                                        }, {
                                                          renderItem: withCtx(({ item: note }) => [
                                                            createVNode(_component_a_list_item, null, {
                                                              default: withCtx(() => [
                                                                createVNode("div", { class: "note-item" }, [
                                                                  createVNode("div", { class: "note-course" }, [
                                                                    createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                    createVNode("span", null, toDisplayString(note.courseTitle || "Course"), 1)
                                                                  ]),
                                                                  createVNode("div", { class: "note-body" }, toDisplayString(note.body), 1),
                                                                  createVNode("div", { class: "note-date" }, toDisplayString(formatDate(note.createdAt)), 1)
                                                                ])
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ]),
                                                          _: 1
                                                        }, 8, ["data-source"]))
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
                                        createVNode(_component_a_tab_pane, {
                                          key: "departments",
                                          tab: "Departments & Classrooms"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "section-header" }, [
                                              createVNode("span", { class: "section-title" }, [
                                                createVNode(unref(ClusterOutlined), { class: "section-icon" }),
                                                createTextVNode(" Departments ")
                                              ]),
                                              createVNode(_component_a_switch, {
                                                checked: showOnlyMyClassrooms.value,
                                                "onUpdate:checked": ($event) => showOnlyMyClassrooms.value = $event,
                                                size: "small",
                                                style: { "margin-left": "auto" }
                                              }, null, 8, ["checked", "onUpdate:checked"]),
                                              createVNode("span", { class: "filter-label" }, "Show only my classrooms")
                                            ]),
                                            createVNode(_component_a_row, {
                                              gutter: 16,
                                              style: { "margin-top": "8px" }
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_col, { span: 16 }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_collapse, { accordion: "" }, {
                                                      default: withCtx(() => [
                                                        (openBlock(true), createBlock(Fragment, null, renderList(activeDepartments.value, (dept) => {
                                                          return openBlock(), createBlock(_component_a_collapse_panel, {
                                                            key: dept.id,
                                                            header: dept.name
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode("p", { class: "dept-meta" }, toDisplayString(dept.contact || "No contact details"), 1),
                                                              createVNode(_component_a_list, {
                                                                size: "small",
                                                                "data-source": classroomsByDepartment(dept.id),
                                                                locale: { emptyText: "No classrooms in this department" }
                                                              }, {
                                                                renderItem: withCtx(({ item }) => [
                                                                  createVNode(_component_a_list_item, null, {
                                                                    default: withCtx(() => [
                                                                      createVNode("div", { class: "classroom-item" }, [
                                                                        createVNode("div", { class: "classroom-title" }, [
                                                                          createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                          createVNode("span", null, toDisplayString(item.title), 1),
                                                                          item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                                            key: 0,
                                                                            color: "green",
                                                                            style: { "margin-left": "8px" }
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode(" Enrolled ")
                                                                            ]),
                                                                            _: 1
                                                                          })) : (openBlock(), createBlock(_component_a_tag, {
                                                                            key: 1,
                                                                            style: { "margin-left": "8px" }
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode(" Not enrolled ")
                                                                            ]),
                                                                            _: 1
                                                                          }))
                                                                        ]),
                                                                        createVNode("div", { class: "classroom-meta" }, [
                                                                          createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                          item.courseTitle ? (openBlock(), createBlock("span", { key: 0 }, "• Course: " + toDisplayString(item.courseTitle), 1)) : createCommentVNode("", true)
                                                                        ]),
                                                                        createVNode("div", { class: "classroom-meta" }, [
                                                                          createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                                          item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, " • Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                                        ]),
                                                                        createVNode("div", { class: "classroom-meta" }, [
                                                                          createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                                          createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                                        ])
                                                                      ])
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024)
                                                                ]),
                                                                _: 1
                                                              }, 8, ["data-source"])
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["header"]);
                                                        }), 128)),
                                                        createVNode(_component_a_collapse_panel, {
                                                          key: "other",
                                                          header: "Other classrooms"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_list, {
                                                              size: "small",
                                                              "data-source": classroomsWithoutDepartment.value,
                                                              locale: { emptyText: "No other classrooms" }
                                                            }, {
                                                              renderItem: withCtx(({ item }) => [
                                                                createVNode(_component_a_list_item, null, {
                                                                  default: withCtx(() => [
                                                                    createVNode("div", { class: "classroom-item" }, [
                                                                      createVNode("div", { class: "classroom-title" }, [
                                                                        createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                        createVNode("span", null, toDisplayString(item.title), 1)
                                                                      ]),
                                                                      createVNode("div", { class: "classroom-meta" }, [
                                                                        createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                        createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                                      ])
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
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_col, { span: 8 }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_card, {
                                                      size: "small",
                                                      title: "Classroom summary"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_descriptions, {
                                                          column: 1,
                                                          size: "small"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(_component_a_descriptions_item, { label: "Total classrooms" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(viewModel.value.classrooms.length), 1)
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(_component_a_descriptions_item, { label: "Active classrooms" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(activeClassrooms.value.length), 1)
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(_component_a_descriptions_item, { label: "My classrooms" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(enrolledClassrooms.value.length), 1)
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(_component_a_descriptions_item, { label: "Enrollment records" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(viewModel.value.classroomEnrollments.length), 1)
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
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_tab_pane, {
                                          key: "courses",
                                          tab: "Courses & Progress"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "section-header" }, [
                                              createVNode("span", { class: "section-title" }, [
                                                createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                createTextVNode(" Courses at this institution ")
                                              ])
                                            ]),
                                            createVNode(_component_a_table, {
                                              size: "small",
                                              columns: courseColumns,
                                              dataSource: courses.value,
                                              "row-key": "courseId",
                                              pagination: { pageSize: 5 },
                                              style: { "margin-top": "8px" }
                                            }, {
                                              bodyCell: withCtx(({ column, record }) => [
                                                column.key === "progress" ? (openBlock(), createBlock(_component_a_progress, {
                                                  key: 0,
                                                  percent: record.progressPct,
                                                  size: "small"
                                                }, null, 8, ["percent"])) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                  record.gradePct !== null && record.gradePct !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.gradePct.toFixed(0)) + "% ", 1)) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                                                ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                  createTextVNode(toDisplayString(record[column.dataIndex] || "—"), 1)
                                                ], 64))
                                              ]),
                                              _: 1
                                            }, 8, ["dataSource"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_tab_pane, {
                                          key: "labs",
                                          tab: "Labs & Assignments"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_row, { gutter: 16 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_col, { span: 14 }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_card, {
                                                      size: "small",
                                                      title: "Assignments"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_table, {
                                                          size: "small",
                                                          columns: assignmentColumnsDetailed,
                                                          dataSource: viewModel.value.assignments,
                                                          "row-key": "id",
                                                          pagination: { pageSize: 8 }
                                                        }, {
                                                          bodyCell: withCtx(({ column, record }) => [
                                                            column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                              createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                            ], 64)) : column.key === "status" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                              record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                key: 0,
                                                                color: "green"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(" Graded ")
                                                                ]),
                                                                _: 1
                                                              })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                key: 1,
                                                                color: "blue"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(" Submitted ")
                                                                ]),
                                                                _: 1
                                                              })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(" Not submitted ")
                                                                ]),
                                                                _: 1
                                                              }))
                                                            ], 64)) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                              record.grade !== null && record.grade !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.grade.toFixed(1)), 1)) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                                                            ], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                              createTextVNode(toDisplayString(record[column.dataIndex] || "—"), 1)
                                                            ], 64))
                                                          ]),
                                                          _: 1
                                                        }, 8, ["dataSource"])
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_col, { span: 10 }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_card, {
                                                      size: "small",
                                                      title: "Lab sessions"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_list, {
                                                          size: "small",
                                                          "data-source": viewModel.value.labs
                                                        }, {
                                                          renderItem: withCtx(({ item: lab }) => [
                                                            createVNode(_component_a_list_item, null, {
                                                              default: withCtx(() => [
                                                                createVNode("div", { class: "lab-item" }, [
                                                                  createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                  createVNode("div", { class: "lab-meta" }, [
                                                                    createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                    createVNode("span", null, "•"),
                                                                    createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                  ]),
                                                                  createVNode("div", { class: "lab-meta" }, [
                                                                    createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                    createVNode("span", null, "•"),
                                                                    createVNode("span", null, "Code server: " + toDisplayString(lab.codeServerUrl || "—"), 1)
                                                                  ])
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
                                          key: "orders",
                                          tab: "Orders & Billing"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "section-header" }, [
                                              createVNode("span", { class: "section-title" }, [
                                                createVNode(unref(ShoppingCartOutlined), { class: "section-icon" }),
                                                createTextVNode(" Orders related to this institution ")
                                              ])
                                            ]),
                                            createVNode(_component_a_table, {
                                              size: "small",
                                              columns: orderColumns,
                                              dataSource: viewModel.value.orders,
                                              "row-key": "orderId",
                                              pagination: { pageSize: 5 },
                                              style: { "margin-top": "8px" }
                                            }, {
                                              bodyCell: withCtx(({ column, record }) => [
                                                column.key === "createdAt" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                  createTextVNode(toDisplayString(formatDate(record.createdAt)), 1)
                                                ], 64)) : column.key === "items" ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(record.items.map((i) => i.courseTitle || i.titleSnapshot).join(", ")), 1)) : column.key === "total" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                  createTextVNode(toDisplayString(record.total.toFixed(2)) + " " + toDisplayString(record.currency), 1)
                                                ], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                  createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                                ], 64))
                                              ]),
                                              _: 1
                                            }, 8, ["dataSource"])
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }, 8, ["activeKey", "onUpdate:activeKey"])
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_a_card, {
                                bordered: false,
                                class: "portal-main-card"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_tabs, {
                                    activeKey: activeTab.value,
                                    "onUpdate:activeKey": ($event) => activeTab.value = $event
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_tab_pane, {
                                        key: "overview",
                                        tab: "Overview"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_row, { gutter: 16 }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_col, { span: 16 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_card, {
                                                    size: "small",
                                                    title: "About this institution"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode("p", { class: "institution-description" }, toDisplayString(viewModel.value.institution.description || "No description provided."), 1),
                                                      createVNode(_component_a_descriptions, {
                                                        column: 2,
                                                        size: "small"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(viewModel.value.institution.location || "—"), 1)
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(_component_a_descriptions_item, { label: "Email" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(viewModel.value.institution.email || "—"), 1)
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(_component_a_descriptions_item, { label: "Phone" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(viewModel.value.institution.phone || "—"), 1)
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(_component_a_descriptions_item, { label: "Created" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(formatDate(viewModel.value.institution.createdAt)), 1)
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
                                                    size: "small",
                                                    style: { "margin-top": "16px" },
                                                    title: "Upcoming work (assignments & labs)"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_row, { gutter: 16 }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_col, { span: 14 }, {
                                                            default: withCtx(() => [
                                                              createVNode("div", { class: "section-header" }, [
                                                                createVNode("span", { class: "section-title" }, [
                                                                  createVNode(unref(CalendarOutlined), { class: "section-icon" }),
                                                                  createTextVNode(" Assignments ")
                                                                ]),
                                                                createVNode(_component_a_switch, {
                                                                  checked: showOnlyOpenAssignments.value,
                                                                  "onUpdate:checked": ($event) => showOnlyOpenAssignments.value = $event,
                                                                  size: "small",
                                                                  style: { "margin-left": "auto" }
                                                                }, null, 8, ["checked", "onUpdate:checked"]),
                                                                createVNode("span", { class: "filter-label" }, "Show only open")
                                                              ]),
                                                              createVNode(_component_a_table, {
                                                                size: "small",
                                                                dataSource: upcomingAssignments.value,
                                                                columns: assignmentColumns,
                                                                pagination: false,
                                                                "row-key": "id"
                                                              }, {
                                                                bodyCell: withCtx(({ column, record }) => [
                                                                  column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                                    createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                                  ], 64)) : column.key === "submissionStatus" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                                    record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                      key: 0,
                                                                      color: "green"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(" Graded ")
                                                                      ]),
                                                                      _: 1
                                                                    })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                      key: 1,
                                                                      color: "blue"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(" Submitted ")
                                                                      ]),
                                                                      _: 1
                                                                    })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(" Not submitted ")
                                                                      ]),
                                                                      _: 1
                                                                    }))
                                                                  ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                                    createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                                                  ], 64))
                                                                ]),
                                                                _: 1
                                                              }, 8, ["dataSource"])
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(_component_a_col, { span: 10 }, {
                                                            default: withCtx(() => [
                                                              createVNode("div", { class: "section-header" }, [
                                                                createVNode("span", { class: "section-title" }, [
                                                                  createVNode(unref(ExperimentOutlined), { class: "section-icon" }),
                                                                  createTextVNode(" Lab sessions ")
                                                                ])
                                                              ]),
                                                              recentLabs.value.length ? (openBlock(), createBlock(_component_a_timeline, { key: 0 }, {
                                                                default: withCtx(() => [
                                                                  (openBlock(true), createBlock(Fragment, null, renderList(recentLabs.value, (lab) => {
                                                                    return openBlock(), createBlock(_component_a_timeline_item, {
                                                                      key: lab.sessionId,
                                                                      color: lab.status === "running" ? "green" : "blue"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createVNode("div", { class: "lab-item" }, [
                                                                          createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                          createVNode("div", { class: "lab-meta" }, [
                                                                            createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                            createVNode("span", null, "•"),
                                                                            createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                          ]),
                                                                          createVNode("div", { class: "lab-meta" }, [
                                                                            createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                            createVNode("span", null, "•"),
                                                                            createVNode("span", null, "Last heartbeat: " + toDisplayString(formatDate(lab.lastHeartbeat)), 1)
                                                                          ])
                                                                        ])
                                                                      ]),
                                                                      _: 2
                                                                    }, 1032, ["color"]);
                                                                  }), 128))
                                                                ]),
                                                                _: 1
                                                              })) : (openBlock(), createBlock(_component_a_empty, {
                                                                key: 1,
                                                                description: "No lab activity yet"
                                                              }))
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
                                              createVNode(_component_a_col, { span: 8 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_card, {
                                                    size: "small",
                                                    title: "My course snapshot"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_statistic, {
                                                        title: "Enrolled courses",
                                                        value: courses.value.length
                                                      }, null, 8, ["value"]),
                                                      createVNode(_component_a_statistic, {
                                                        title: "Completed courses",
                                                        value: completedCoursesCount.value,
                                                        style: { "margin-top": "8px" }
                                                      }, null, 8, ["value"]),
                                                      createVNode(_component_a_statistic, {
                                                        title: "Average progress",
                                                        value: averageCourseProgress.value,
                                                        suffix: "%",
                                                        style: { "margin-top": "8px" }
                                                      }, null, 8, ["value"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(_component_a_card, {
                                                    size: "small",
                                                    style: { "margin-top": "16px" },
                                                    title: "Recent notes"
                                                  }, {
                                                    default: withCtx(() => [
                                                      !viewModel.value.notes.length ? (openBlock(), createBlock(_component_a_empty, {
                                                        key: 0,
                                                        description: "No notes yet for this institution"
                                                      })) : (openBlock(), createBlock(_component_a_list, {
                                                        key: 1,
                                                        size: "small",
                                                        "data-source": viewModel.value.notes.slice(0, 3)
                                                      }, {
                                                        renderItem: withCtx(({ item: note }) => [
                                                          createVNode(_component_a_list_item, null, {
                                                            default: withCtx(() => [
                                                              createVNode("div", { class: "note-item" }, [
                                                                createVNode("div", { class: "note-course" }, [
                                                                  createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                  createVNode("span", null, toDisplayString(note.courseTitle || "Course"), 1)
                                                                ]),
                                                                createVNode("div", { class: "note-body" }, toDisplayString(note.body), 1),
                                                                createVNode("div", { class: "note-date" }, toDisplayString(formatDate(note.createdAt)), 1)
                                                              ])
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ]),
                                                        _: 1
                                                      }, 8, ["data-source"]))
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
                                      createVNode(_component_a_tab_pane, {
                                        key: "departments",
                                        tab: "Departments & Classrooms"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("div", { class: "section-header" }, [
                                            createVNode("span", { class: "section-title" }, [
                                              createVNode(unref(ClusterOutlined), { class: "section-icon" }),
                                              createTextVNode(" Departments ")
                                            ]),
                                            createVNode(_component_a_switch, {
                                              checked: showOnlyMyClassrooms.value,
                                              "onUpdate:checked": ($event) => showOnlyMyClassrooms.value = $event,
                                              size: "small",
                                              style: { "margin-left": "auto" }
                                            }, null, 8, ["checked", "onUpdate:checked"]),
                                            createVNode("span", { class: "filter-label" }, "Show only my classrooms")
                                          ]),
                                          createVNode(_component_a_row, {
                                            gutter: 16,
                                            style: { "margin-top": "8px" }
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_col, { span: 16 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_collapse, { accordion: "" }, {
                                                    default: withCtx(() => [
                                                      (openBlock(true), createBlock(Fragment, null, renderList(activeDepartments.value, (dept) => {
                                                        return openBlock(), createBlock(_component_a_collapse_panel, {
                                                          key: dept.id,
                                                          header: dept.name
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode("p", { class: "dept-meta" }, toDisplayString(dept.contact || "No contact details"), 1),
                                                            createVNode(_component_a_list, {
                                                              size: "small",
                                                              "data-source": classroomsByDepartment(dept.id),
                                                              locale: { emptyText: "No classrooms in this department" }
                                                            }, {
                                                              renderItem: withCtx(({ item }) => [
                                                                createVNode(_component_a_list_item, null, {
                                                                  default: withCtx(() => [
                                                                    createVNode("div", { class: "classroom-item" }, [
                                                                      createVNode("div", { class: "classroom-title" }, [
                                                                        createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                        createVNode("span", null, toDisplayString(item.title), 1),
                                                                        item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                                          key: 0,
                                                                          color: "green",
                                                                          style: { "margin-left": "8px" }
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(" Enrolled ")
                                                                          ]),
                                                                          _: 1
                                                                        })) : (openBlock(), createBlock(_component_a_tag, {
                                                                          key: 1,
                                                                          style: { "margin-left": "8px" }
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(" Not enrolled ")
                                                                          ]),
                                                                          _: 1
                                                                        }))
                                                                      ]),
                                                                      createVNode("div", { class: "classroom-meta" }, [
                                                                        createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                        item.courseTitle ? (openBlock(), createBlock("span", { key: 0 }, "• Course: " + toDisplayString(item.courseTitle), 1)) : createCommentVNode("", true)
                                                                      ]),
                                                                      createVNode("div", { class: "classroom-meta" }, [
                                                                        createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                                        item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, " • Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                                      ]),
                                                                      createVNode("div", { class: "classroom-meta" }, [
                                                                        createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                                        createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                                      ])
                                                                    ])
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)
                                                              ]),
                                                              _: 1
                                                            }, 8, ["data-source"])
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["header"]);
                                                      }), 128)),
                                                      createVNode(_component_a_collapse_panel, {
                                                        key: "other",
                                                        header: "Other classrooms"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_list, {
                                                            size: "small",
                                                            "data-source": classroomsWithoutDepartment.value,
                                                            locale: { emptyText: "No other classrooms" }
                                                          }, {
                                                            renderItem: withCtx(({ item }) => [
                                                              createVNode(_component_a_list_item, null, {
                                                                default: withCtx(() => [
                                                                  createVNode("div", { class: "classroom-item" }, [
                                                                    createVNode("div", { class: "classroom-title" }, [
                                                                      createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                      createVNode("span", null, toDisplayString(item.title), 1)
                                                                    ]),
                                                                    createVNode("div", { class: "classroom-meta" }, [
                                                                      createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                      createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                                    ])
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
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_col, { span: 8 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_card, {
                                                    size: "small",
                                                    title: "Classroom summary"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_descriptions, {
                                                        column: 1,
                                                        size: "small"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(_component_a_descriptions_item, { label: "Total classrooms" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(viewModel.value.classrooms.length), 1)
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(_component_a_descriptions_item, { label: "Active classrooms" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(activeClassrooms.value.length), 1)
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(_component_a_descriptions_item, { label: "My classrooms" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(enrolledClassrooms.value.length), 1)
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(_component_a_descriptions_item, { label: "Enrollment records" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(viewModel.value.classroomEnrollments.length), 1)
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
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_tab_pane, {
                                        key: "courses",
                                        tab: "Courses & Progress"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("div", { class: "section-header" }, [
                                            createVNode("span", { class: "section-title" }, [
                                              createVNode(unref(BookOutlined), { class: "section-icon" }),
                                              createTextVNode(" Courses at this institution ")
                                            ])
                                          ]),
                                          createVNode(_component_a_table, {
                                            size: "small",
                                            columns: courseColumns,
                                            dataSource: courses.value,
                                            "row-key": "courseId",
                                            pagination: { pageSize: 5 },
                                            style: { "margin-top": "8px" }
                                          }, {
                                            bodyCell: withCtx(({ column, record }) => [
                                              column.key === "progress" ? (openBlock(), createBlock(_component_a_progress, {
                                                key: 0,
                                                percent: record.progressPct,
                                                size: "small"
                                              }, null, 8, ["percent"])) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                record.gradePct !== null && record.gradePct !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.gradePct.toFixed(0)) + "% ", 1)) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                                              ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                createTextVNode(toDisplayString(record[column.dataIndex] || "—"), 1)
                                              ], 64))
                                            ]),
                                            _: 1
                                          }, 8, ["dataSource"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_tab_pane, {
                                        key: "labs",
                                        tab: "Labs & Assignments"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_row, { gutter: 16 }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_col, { span: 14 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_card, {
                                                    size: "small",
                                                    title: "Assignments"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_table, {
                                                        size: "small",
                                                        columns: assignmentColumnsDetailed,
                                                        dataSource: viewModel.value.assignments,
                                                        "row-key": "id",
                                                        pagination: { pageSize: 8 }
                                                      }, {
                                                        bodyCell: withCtx(({ column, record }) => [
                                                          column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                            createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                          ], 64)) : column.key === "status" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                            record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                              key: 0,
                                                              color: "green"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(" Graded ")
                                                              ]),
                                                              _: 1
                                                            })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                              key: 1,
                                                              color: "blue"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(" Submitted ")
                                                              ]),
                                                              _: 1
                                                            })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(" Not submitted ")
                                                              ]),
                                                              _: 1
                                                            }))
                                                          ], 64)) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                            record.grade !== null && record.grade !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.grade.toFixed(1)), 1)) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                                                          ], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                            createTextVNode(toDisplayString(record[column.dataIndex] || "—"), 1)
                                                          ], 64))
                                                        ]),
                                                        _: 1
                                                      }, 8, ["dataSource"])
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_col, { span: 10 }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_a_card, {
                                                    size: "small",
                                                    title: "Lab sessions"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_a_list, {
                                                        size: "small",
                                                        "data-source": viewModel.value.labs
                                                      }, {
                                                        renderItem: withCtx(({ item: lab }) => [
                                                          createVNode(_component_a_list_item, null, {
                                                            default: withCtx(() => [
                                                              createVNode("div", { class: "lab-item" }, [
                                                                createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                createVNode("div", { class: "lab-meta" }, [
                                                                  createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                  createVNode("span", null, "•"),
                                                                  createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                ]),
                                                                createVNode("div", { class: "lab-meta" }, [
                                                                  createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                  createVNode("span", null, "•"),
                                                                  createVNode("span", null, "Code server: " + toDisplayString(lab.codeServerUrl || "—"), 1)
                                                                ])
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
                                        key: "orders",
                                        tab: "Orders & Billing"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("div", { class: "section-header" }, [
                                            createVNode("span", { class: "section-title" }, [
                                              createVNode(unref(ShoppingCartOutlined), { class: "section-icon" }),
                                              createTextVNode(" Orders related to this institution ")
                                            ])
                                          ]),
                                          createVNode(_component_a_table, {
                                            size: "small",
                                            columns: orderColumns,
                                            dataSource: viewModel.value.orders,
                                            "row-key": "orderId",
                                            pagination: { pageSize: 5 },
                                            style: { "margin-top": "8px" }
                                          }, {
                                            bodyCell: withCtx(({ column, record }) => [
                                              column.key === "createdAt" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                createTextVNode(toDisplayString(formatDate(record.createdAt)), 1)
                                              ], 64)) : column.key === "items" ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(record.items.map((i) => i.courseTitle || i.titleSnapshot).join(", ")), 1)) : column.key === "total" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                createTextVNode(toDisplayString(record.total.toFixed(2)) + " " + toDisplayString(record.currency), 1)
                                              ], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                              ], 64))
                                            ]),
                                            _: 1
                                          }, 8, ["dataSource"])
                                        ]),
                                        _: 1
                                      })
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
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(_component_a_col, { span: 8 }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_a_space, {
                              direction: "vertical",
                              size: 16,
                              class: "portal-sidebar",
                              style: { "width": "100%" }
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_a_card, {
                                    size: "small",
                                    title: "Quick stats"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_component_a_descriptions, {
                                          column: 1,
                                          size: "small"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(_component_a_descriptions_item, { label: "Departments" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(activeDepartments.value.length)} active `);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(activeDepartments.value.length) + " active ", 1)
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(_component_a_descriptions_item, { label: "Classrooms" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(viewModel.value.classrooms.length)} total, ${ssrInterpolate(enrolledClassrooms.value.length)} mine `);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(viewModel.value.classrooms.length) + " total, " + toDisplayString(enrolledClassrooms.value.length) + " mine ", 1)
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(_component_a_descriptions_item, { label: "Courses" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(courses.value.length)} at this institution `);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(courses.value.length) + " at this institution ", 1)
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(_component_a_descriptions_item, { label: "Orders total" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(totalSpent.value.toFixed(2))} ${ssrInterpolate(primaryCurrency.value)}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(totalSpent.value.toFixed(2)) + " " + toDisplayString(primaryCurrency.value), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(_component_a_descriptions_item, { label: "Departments" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(activeDepartments.value.length) + " active ", 1)
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_descriptions_item, { label: "Classrooms" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(viewModel.value.classrooms.length) + " total, " + toDisplayString(enrolledClassrooms.value.length) + " mine ", 1)
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_descriptions_item, { label: "Courses" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(courses.value.length) + " at this institution ", 1)
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_descriptions_item, { label: "Orders total" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(totalSpent.value.toFixed(2)) + " " + toDisplayString(primaryCurrency.value), 1)
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
                                          createVNode(_component_a_descriptions, {
                                            column: 1,
                                            size: "small"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_descriptions_item, { label: "Departments" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(activeDepartments.value.length) + " active ", 1)
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_descriptions_item, { label: "Classrooms" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(viewModel.value.classrooms.length) + " total, " + toDisplayString(enrolledClassrooms.value.length) + " mine ", 1)
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_descriptions_item, { label: "Courses" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(courses.value.length) + " at this institution ", 1)
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_descriptions_item, { label: "Orders total" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(totalSpent.value.toFixed(2)) + " " + toDisplayString(primaryCurrency.value), 1)
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
                                    size: "small",
                                    title: "Institution contact"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`<p class="institution-description" data-v-789f08b6${_scopeId5}>${ssrInterpolate(viewModel.value.institution.description || "No description provided.")}</p>`);
                                        _push6(ssrRenderComponent(_component_a_descriptions, {
                                          column: 1,
                                          size: "small"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(_component_a_descriptions_item, { label: "Email" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(viewModel.value.institution.email || "—")}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(viewModel.value.institution.email || "—"), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(_component_a_descriptions_item, { label: "Phone" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(viewModel.value.institution.phone || "—")}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(viewModel.value.institution.phone || "—"), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(_component_a_descriptions_item, { label: "Location" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(viewModel.value.institution.location || "—")}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(viewModel.value.institution.location || "—"), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(_component_a_descriptions_item, { label: "Email" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(viewModel.value.institution.email || "—"), 1)
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_descriptions_item, { label: "Phone" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(viewModel.value.institution.phone || "—"), 1)
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(viewModel.value.institution.location || "—"), 1)
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
                                          createVNode("p", { class: "institution-description" }, toDisplayString(viewModel.value.institution.description || "No description provided."), 1),
                                          createVNode(_component_a_descriptions, {
                                            column: 1,
                                            size: "small"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_descriptions_item, { label: "Email" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(viewModel.value.institution.email || "—"), 1)
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_descriptions_item, { label: "Phone" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(viewModel.value.institution.phone || "—"), 1)
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(viewModel.value.institution.location || "—"), 1)
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
                                    size: "small",
                                    title: "System & metadata"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_component_a_descriptions, {
                                          column: 1,
                                          size: "small"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(_component_a_descriptions_item, { label: "Auth institution ID" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(viewModel.value.authInstitution?.id || "—")}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(viewModel.value.authInstitution?.id || "—"), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(_component_a_descriptions_item, { label: "Student ID" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(viewModel.value.student.id)}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(viewModel.value.student.id), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(_component_a_descriptions_item, { label: "User ID" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(viewModel.value.user.id)}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(viewModel.value.user.id), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(_component_a_descriptions_item, { label: "Student mirror ID" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(viewModel.value.studentMirror?.id || "—")}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(viewModel.value.studentMirror?.id || "—"), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 1
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(_component_a_descriptions_item, { label: "Auth institution ID" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(viewModel.value.authInstitution?.id || "—"), 1)
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_descriptions_item, { label: "Student ID" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(viewModel.value.student.id), 1)
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_descriptions_item, { label: "User ID" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(viewModel.value.user.id), 1)
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_descriptions_item, { label: "Student mirror ID" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(viewModel.value.studentMirror?.id || "—"), 1)
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
                                          createVNode(_component_a_descriptions, {
                                            column: 1,
                                            size: "small"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_a_descriptions_item, { label: "Auth institution ID" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(viewModel.value.authInstitution?.id || "—"), 1)
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_descriptions_item, { label: "Student ID" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(viewModel.value.student.id), 1)
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_descriptions_item, { label: "User ID" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(viewModel.value.user.id), 1)
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_descriptions_item, { label: "Student mirror ID" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(viewModel.value.studentMirror?.id || "—"), 1)
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
                                    createVNode(_component_a_card, {
                                      size: "small",
                                      title: "Quick stats"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_descriptions, {
                                          column: 1,
                                          size: "small"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_descriptions_item, { label: "Departments" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(activeDepartments.value.length) + " active ", 1)
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_descriptions_item, { label: "Classrooms" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(viewModel.value.classrooms.length) + " total, " + toDisplayString(enrolledClassrooms.value.length) + " mine ", 1)
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_descriptions_item, { label: "Courses" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(courses.value.length) + " at this institution ", 1)
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_descriptions_item, { label: "Orders total" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(totalSpent.value.toFixed(2)) + " " + toDisplayString(primaryCurrency.value), 1)
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
                                      size: "small",
                                      title: "Institution contact"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("p", { class: "institution-description" }, toDisplayString(viewModel.value.institution.description || "No description provided."), 1),
                                        createVNode(_component_a_descriptions, {
                                          column: 1,
                                          size: "small"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_descriptions_item, { label: "Email" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(viewModel.value.institution.email || "—"), 1)
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_descriptions_item, { label: "Phone" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(viewModel.value.institution.phone || "—"), 1)
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(viewModel.value.institution.location || "—"), 1)
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
                                      size: "small",
                                      title: "System & metadata"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_descriptions, {
                                          column: 1,
                                          size: "small"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_descriptions_item, { label: "Auth institution ID" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(viewModel.value.authInstitution?.id || "—"), 1)
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_descriptions_item, { label: "Student ID" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(viewModel.value.student.id), 1)
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_descriptions_item, { label: "User ID" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(viewModel.value.user.id), 1)
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_descriptions_item, { label: "Student mirror ID" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(viewModel.value.studentMirror?.id || "—"), 1)
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
                          } else {
                            return [
                              createVNode(_component_a_space, {
                                direction: "vertical",
                                size: 16,
                                class: "portal-sidebar",
                                style: { "width": "100%" }
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_card, {
                                    size: "small",
                                    title: "Quick stats"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_descriptions, {
                                        column: 1,
                                        size: "small"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_descriptions_item, { label: "Departments" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(activeDepartments.value.length) + " active ", 1)
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_descriptions_item, { label: "Classrooms" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(viewModel.value.classrooms.length) + " total, " + toDisplayString(enrolledClassrooms.value.length) + " mine ", 1)
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_descriptions_item, { label: "Courses" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(courses.value.length) + " at this institution ", 1)
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_descriptions_item, { label: "Orders total" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(totalSpent.value.toFixed(2)) + " " + toDisplayString(primaryCurrency.value), 1)
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
                                    size: "small",
                                    title: "Institution contact"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("p", { class: "institution-description" }, toDisplayString(viewModel.value.institution.description || "No description provided."), 1),
                                      createVNode(_component_a_descriptions, {
                                        column: 1,
                                        size: "small"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_descriptions_item, { label: "Email" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(viewModel.value.institution.email || "—"), 1)
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_descriptions_item, { label: "Phone" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(viewModel.value.institution.phone || "—"), 1)
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(viewModel.value.institution.location || "—"), 1)
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
                                    size: "small",
                                    title: "System & metadata"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_descriptions, {
                                        column: 1,
                                        size: "small"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_descriptions_item, { label: "Auth institution ID" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(viewModel.value.authInstitution?.id || "—"), 1)
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_descriptions_item, { label: "Student ID" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(viewModel.value.student.id), 1)
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_descriptions_item, { label: "User ID" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(viewModel.value.user.id), 1)
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_descriptions_item, { label: "Student mirror ID" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(viewModel.value.studentMirror?.id || "—"), 1)
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
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_a_col, { span: 16 }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              bordered: false,
                              class: "portal-main-card"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_tabs, {
                                  activeKey: activeTab.value,
                                  "onUpdate:activeKey": ($event) => activeTab.value = $event
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_tab_pane, {
                                      key: "overview",
                                      tab: "Overview"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_row, { gutter: 16 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_col, { span: 16 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_card, {
                                                  size: "small",
                                                  title: "About this institution"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode("p", { class: "institution-description" }, toDisplayString(viewModel.value.institution.description || "No description provided."), 1),
                                                    createVNode(_component_a_descriptions, {
                                                      column: 2,
                                                      size: "small"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(viewModel.value.institution.location || "—"), 1)
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(_component_a_descriptions_item, { label: "Email" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(viewModel.value.institution.email || "—"), 1)
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(_component_a_descriptions_item, { label: "Phone" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(viewModel.value.institution.phone || "—"), 1)
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(_component_a_descriptions_item, { label: "Created" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(formatDate(viewModel.value.institution.createdAt)), 1)
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
                                                  size: "small",
                                                  style: { "margin-top": "16px" },
                                                  title: "Upcoming work (assignments & labs)"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_row, { gutter: 16 }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_col, { span: 14 }, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "section-header" }, [
                                                              createVNode("span", { class: "section-title" }, [
                                                                createVNode(unref(CalendarOutlined), { class: "section-icon" }),
                                                                createTextVNode(" Assignments ")
                                                              ]),
                                                              createVNode(_component_a_switch, {
                                                                checked: showOnlyOpenAssignments.value,
                                                                "onUpdate:checked": ($event) => showOnlyOpenAssignments.value = $event,
                                                                size: "small",
                                                                style: { "margin-left": "auto" }
                                                              }, null, 8, ["checked", "onUpdate:checked"]),
                                                              createVNode("span", { class: "filter-label" }, "Show only open")
                                                            ]),
                                                            createVNode(_component_a_table, {
                                                              size: "small",
                                                              dataSource: upcomingAssignments.value,
                                                              columns: assignmentColumns,
                                                              pagination: false,
                                                              "row-key": "id"
                                                            }, {
                                                              bodyCell: withCtx(({ column, record }) => [
                                                                column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                                  createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                                ], 64)) : column.key === "submissionStatus" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                                  record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                    key: 0,
                                                                    color: "green"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(" Graded ")
                                                                    ]),
                                                                    _: 1
                                                                  })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                    key: 1,
                                                                    color: "blue"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(" Submitted ")
                                                                    ]),
                                                                    _: 1
                                                                  })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(" Not submitted ")
                                                                    ]),
                                                                    _: 1
                                                                  }))
                                                                ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                                  createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                                                ], 64))
                                                              ]),
                                                              _: 1
                                                            }, 8, ["dataSource"])
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(_component_a_col, { span: 10 }, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "section-header" }, [
                                                              createVNode("span", { class: "section-title" }, [
                                                                createVNode(unref(ExperimentOutlined), { class: "section-icon" }),
                                                                createTextVNode(" Lab sessions ")
                                                              ])
                                                            ]),
                                                            recentLabs.value.length ? (openBlock(), createBlock(_component_a_timeline, { key: 0 }, {
                                                              default: withCtx(() => [
                                                                (openBlock(true), createBlock(Fragment, null, renderList(recentLabs.value, (lab) => {
                                                                  return openBlock(), createBlock(_component_a_timeline_item, {
                                                                    key: lab.sessionId,
                                                                    color: lab.status === "running" ? "green" : "blue"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode("div", { class: "lab-item" }, [
                                                                        createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                        createVNode("div", { class: "lab-meta" }, [
                                                                          createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                          createVNode("span", null, "•"),
                                                                          createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                        ]),
                                                                        createVNode("div", { class: "lab-meta" }, [
                                                                          createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                          createVNode("span", null, "•"),
                                                                          createVNode("span", null, "Last heartbeat: " + toDisplayString(formatDate(lab.lastHeartbeat)), 1)
                                                                        ])
                                                                      ])
                                                                    ]),
                                                                    _: 2
                                                                  }, 1032, ["color"]);
                                                                }), 128))
                                                              ]),
                                                              _: 1
                                                            })) : (openBlock(), createBlock(_component_a_empty, {
                                                              key: 1,
                                                              description: "No lab activity yet"
                                                            }))
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
                                            createVNode(_component_a_col, { span: 8 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_card, {
                                                  size: "small",
                                                  title: "My course snapshot"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_statistic, {
                                                      title: "Enrolled courses",
                                                      value: courses.value.length
                                                    }, null, 8, ["value"]),
                                                    createVNode(_component_a_statistic, {
                                                      title: "Completed courses",
                                                      value: completedCoursesCount.value,
                                                      style: { "margin-top": "8px" }
                                                    }, null, 8, ["value"]),
                                                    createVNode(_component_a_statistic, {
                                                      title: "Average progress",
                                                      value: averageCourseProgress.value,
                                                      suffix: "%",
                                                      style: { "margin-top": "8px" }
                                                    }, null, 8, ["value"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(_component_a_card, {
                                                  size: "small",
                                                  style: { "margin-top": "16px" },
                                                  title: "Recent notes"
                                                }, {
                                                  default: withCtx(() => [
                                                    !viewModel.value.notes.length ? (openBlock(), createBlock(_component_a_empty, {
                                                      key: 0,
                                                      description: "No notes yet for this institution"
                                                    })) : (openBlock(), createBlock(_component_a_list, {
                                                      key: 1,
                                                      size: "small",
                                                      "data-source": viewModel.value.notes.slice(0, 3)
                                                    }, {
                                                      renderItem: withCtx(({ item: note }) => [
                                                        createVNode(_component_a_list_item, null, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "note-item" }, [
                                                              createVNode("div", { class: "note-course" }, [
                                                                createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                createVNode("span", null, toDisplayString(note.courseTitle || "Course"), 1)
                                                              ]),
                                                              createVNode("div", { class: "note-body" }, toDisplayString(note.body), 1),
                                                              createVNode("div", { class: "note-date" }, toDisplayString(formatDate(note.createdAt)), 1)
                                                            ])
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 1
                                                    }, 8, ["data-source"]))
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
                                    createVNode(_component_a_tab_pane, {
                                      key: "departments",
                                      tab: "Departments & Classrooms"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "section-header" }, [
                                          createVNode("span", { class: "section-title" }, [
                                            createVNode(unref(ClusterOutlined), { class: "section-icon" }),
                                            createTextVNode(" Departments ")
                                          ]),
                                          createVNode(_component_a_switch, {
                                            checked: showOnlyMyClassrooms.value,
                                            "onUpdate:checked": ($event) => showOnlyMyClassrooms.value = $event,
                                            size: "small",
                                            style: { "margin-left": "auto" }
                                          }, null, 8, ["checked", "onUpdate:checked"]),
                                          createVNode("span", { class: "filter-label" }, "Show only my classrooms")
                                        ]),
                                        createVNode(_component_a_row, {
                                          gutter: 16,
                                          style: { "margin-top": "8px" }
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_col, { span: 16 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_collapse, { accordion: "" }, {
                                                  default: withCtx(() => [
                                                    (openBlock(true), createBlock(Fragment, null, renderList(activeDepartments.value, (dept) => {
                                                      return openBlock(), createBlock(_component_a_collapse_panel, {
                                                        key: dept.id,
                                                        header: dept.name
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode("p", { class: "dept-meta" }, toDisplayString(dept.contact || "No contact details"), 1),
                                                          createVNode(_component_a_list, {
                                                            size: "small",
                                                            "data-source": classroomsByDepartment(dept.id),
                                                            locale: { emptyText: "No classrooms in this department" }
                                                          }, {
                                                            renderItem: withCtx(({ item }) => [
                                                              createVNode(_component_a_list_item, null, {
                                                                default: withCtx(() => [
                                                                  createVNode("div", { class: "classroom-item" }, [
                                                                    createVNode("div", { class: "classroom-title" }, [
                                                                      createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                      createVNode("span", null, toDisplayString(item.title), 1),
                                                                      item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                                        key: 0,
                                                                        color: "green",
                                                                        style: { "margin-left": "8px" }
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(" Enrolled ")
                                                                        ]),
                                                                        _: 1
                                                                      })) : (openBlock(), createBlock(_component_a_tag, {
                                                                        key: 1,
                                                                        style: { "margin-left": "8px" }
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(" Not enrolled ")
                                                                        ]),
                                                                        _: 1
                                                                      }))
                                                                    ]),
                                                                    createVNode("div", { class: "classroom-meta" }, [
                                                                      createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                      item.courseTitle ? (openBlock(), createBlock("span", { key: 0 }, "• Course: " + toDisplayString(item.courseTitle), 1)) : createCommentVNode("", true)
                                                                    ]),
                                                                    createVNode("div", { class: "classroom-meta" }, [
                                                                      createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                                      item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, " • Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                                    ]),
                                                                    createVNode("div", { class: "classroom-meta" }, [
                                                                      createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                                      createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                                    ])
                                                                  ])
                                                                ]),
                                                                _: 2
                                                              }, 1024)
                                                            ]),
                                                            _: 1
                                                          }, 8, ["data-source"])
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["header"]);
                                                    }), 128)),
                                                    createVNode(_component_a_collapse_panel, {
                                                      key: "other",
                                                      header: "Other classrooms"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_list, {
                                                          size: "small",
                                                          "data-source": classroomsWithoutDepartment.value,
                                                          locale: { emptyText: "No other classrooms" }
                                                        }, {
                                                          renderItem: withCtx(({ item }) => [
                                                            createVNode(_component_a_list_item, null, {
                                                              default: withCtx(() => [
                                                                createVNode("div", { class: "classroom-item" }, [
                                                                  createVNode("div", { class: "classroom-title" }, [
                                                                    createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                    createVNode("span", null, toDisplayString(item.title), 1)
                                                                  ]),
                                                                  createVNode("div", { class: "classroom-meta" }, [
                                                                    createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                    createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                                  ])
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
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_col, { span: 8 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_card, {
                                                  size: "small",
                                                  title: "Classroom summary"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_descriptions, {
                                                      column: 1,
                                                      size: "small"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_a_descriptions_item, { label: "Total classrooms" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(viewModel.value.classrooms.length), 1)
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(_component_a_descriptions_item, { label: "Active classrooms" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(activeClassrooms.value.length), 1)
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(_component_a_descriptions_item, { label: "My classrooms" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(enrolledClassrooms.value.length), 1)
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(_component_a_descriptions_item, { label: "Enrollment records" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(viewModel.value.classroomEnrollments.length), 1)
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
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_tab_pane, {
                                      key: "courses",
                                      tab: "Courses & Progress"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "section-header" }, [
                                          createVNode("span", { class: "section-title" }, [
                                            createVNode(unref(BookOutlined), { class: "section-icon" }),
                                            createTextVNode(" Courses at this institution ")
                                          ])
                                        ]),
                                        createVNode(_component_a_table, {
                                          size: "small",
                                          columns: courseColumns,
                                          dataSource: courses.value,
                                          "row-key": "courseId",
                                          pagination: { pageSize: 5 },
                                          style: { "margin-top": "8px" }
                                        }, {
                                          bodyCell: withCtx(({ column, record }) => [
                                            column.key === "progress" ? (openBlock(), createBlock(_component_a_progress, {
                                              key: 0,
                                              percent: record.progressPct,
                                              size: "small"
                                            }, null, 8, ["percent"])) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                              record.gradePct !== null && record.gradePct !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.gradePct.toFixed(0)) + "% ", 1)) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                                            ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                              createTextVNode(toDisplayString(record[column.dataIndex] || "—"), 1)
                                            ], 64))
                                          ]),
                                          _: 1
                                        }, 8, ["dataSource"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_tab_pane, {
                                      key: "labs",
                                      tab: "Labs & Assignments"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_row, { gutter: 16 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_col, { span: 14 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_card, {
                                                  size: "small",
                                                  title: "Assignments"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_table, {
                                                      size: "small",
                                                      columns: assignmentColumnsDetailed,
                                                      dataSource: viewModel.value.assignments,
                                                      "row-key": "id",
                                                      pagination: { pageSize: 8 }
                                                    }, {
                                                      bodyCell: withCtx(({ column, record }) => [
                                                        column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                          createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                        ], 64)) : column.key === "status" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                          record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                            key: 0,
                                                            color: "green"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(" Graded ")
                                                            ]),
                                                            _: 1
                                                          })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                            key: 1,
                                                            color: "blue"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(" Submitted ")
                                                            ]),
                                                            _: 1
                                                          })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(" Not submitted ")
                                                            ]),
                                                            _: 1
                                                          }))
                                                        ], 64)) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                          record.grade !== null && record.grade !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.grade.toFixed(1)), 1)) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                                                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                          createTextVNode(toDisplayString(record[column.dataIndex] || "—"), 1)
                                                        ], 64))
                                                      ]),
                                                      _: 1
                                                    }, 8, ["dataSource"])
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_col, { span: 10 }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_card, {
                                                  size: "small",
                                                  title: "Lab sessions"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_list, {
                                                      size: "small",
                                                      "data-source": viewModel.value.labs
                                                    }, {
                                                      renderItem: withCtx(({ item: lab }) => [
                                                        createVNode(_component_a_list_item, null, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "lab-item" }, [
                                                              createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                              createVNode("div", { class: "lab-meta" }, [
                                                                createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                createVNode("span", null, "•"),
                                                                createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                              ]),
                                                              createVNode("div", { class: "lab-meta" }, [
                                                                createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                createVNode("span", null, "•"),
                                                                createVNode("span", null, "Code server: " + toDisplayString(lab.codeServerUrl || "—"), 1)
                                                              ])
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
                                      key: "orders",
                                      tab: "Orders & Billing"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "section-header" }, [
                                          createVNode("span", { class: "section-title" }, [
                                            createVNode(unref(ShoppingCartOutlined), { class: "section-icon" }),
                                            createTextVNode(" Orders related to this institution ")
                                          ])
                                        ]),
                                        createVNode(_component_a_table, {
                                          size: "small",
                                          columns: orderColumns,
                                          dataSource: viewModel.value.orders,
                                          "row-key": "orderId",
                                          pagination: { pageSize: 5 },
                                          style: { "margin-top": "8px" }
                                        }, {
                                          bodyCell: withCtx(({ column, record }) => [
                                            column.key === "createdAt" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                              createTextVNode(toDisplayString(formatDate(record.createdAt)), 1)
                                            ], 64)) : column.key === "items" ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(record.items.map((i) => i.courseTitle || i.titleSnapshot).join(", ")), 1)) : column.key === "total" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                              createTextVNode(toDisplayString(record.total.toFixed(2)) + " " + toDisplayString(record.currency), 1)
                                            ], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                              createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                            ], 64))
                                          ]),
                                          _: 1
                                        }, 8, ["dataSource"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["activeKey", "onUpdate:activeKey"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_col, { span: 8 }, {
                          default: withCtx(() => [
                            createVNode(_component_a_space, {
                              direction: "vertical",
                              size: 16,
                              class: "portal-sidebar",
                              style: { "width": "100%" }
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, {
                                  size: "small",
                                  title: "Quick stats"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_descriptions, {
                                      column: 1,
                                      size: "small"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_descriptions_item, { label: "Departments" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(activeDepartments.value.length) + " active ", 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_descriptions_item, { label: "Classrooms" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(viewModel.value.classrooms.length) + " total, " + toDisplayString(enrolledClassrooms.value.length) + " mine ", 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_descriptions_item, { label: "Courses" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(courses.value.length) + " at this institution ", 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_descriptions_item, { label: "Orders total" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(totalSpent.value.toFixed(2)) + " " + toDisplayString(primaryCurrency.value), 1)
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
                                  size: "small",
                                  title: "Institution contact"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("p", { class: "institution-description" }, toDisplayString(viewModel.value.institution.description || "No description provided."), 1),
                                    createVNode(_component_a_descriptions, {
                                      column: 1,
                                      size: "small"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_descriptions_item, { label: "Email" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(viewModel.value.institution.email || "—"), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_descriptions_item, { label: "Phone" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(viewModel.value.institution.phone || "—"), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(viewModel.value.institution.location || "—"), 1)
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
                                  size: "small",
                                  title: "System & metadata"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_descriptions, {
                                      column: 1,
                                      size: "small"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_descriptions_item, { label: "Auth institution ID" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(viewModel.value.authInstitution?.id || "—"), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_descriptions_item, { label: "Student ID" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(viewModel.value.student.id), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_descriptions_item, { label: "User ID" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(viewModel.value.user.id), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_descriptions_item, { label: "Student mirror ID" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(viewModel.value.studentMirror?.id || "—"), 1)
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
                        })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              }
              _push2(`<!--]-->`);
            } else if (error.value) {
              _push2(ssrRenderComponent(_component_a_result, {
                status: "error",
                title: "Failed to load institution view"
              }, {
                subTitle: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(error.value)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(error.value), 1)
                    ];
                  }
                }),
                extra: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_button, {
                      type: "primary",
                      onClick: load
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Retry`);
                        } else {
                          return [
                            createTextVNode("Retry")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_a_button, {
                        type: "primary",
                        onClick: load
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Retry")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              !error.value && viewModel.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                createVNode(_component_a_page_header, {
                  class: "portal-page-header",
                  title: viewModel.value.institution.name,
                  "sub-title": viewModel.value.institution.type || "Institution"
                }, {
                  tags: withCtx(() => [
                    viewModel.value.institution.active ? (openBlock(), createBlock(_component_a_tag, {
                      key: 0,
                      color: "green"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(CheckCircleOutlined), { class: "tag-icon" }),
                        createVNode("span", null, "Active")
                      ]),
                      _: 1
                    })) : (openBlock(), createBlock(_component_a_tag, {
                      key: 1,
                      color: "red"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(ExclamationCircleOutlined), { class: "tag-icon" }),
                        createVNode("span", null, "Inactive")
                      ]),
                      _: 1
                    })),
                    createVNode(_component_a_tag, null, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(viewModel.value.institution.slug), 1)
                      ]),
                      _: 1
                    }),
                    viewModel.value.authInstitution?.domain ? (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(viewModel.value.authInstitution.domain), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ]),
                  extra: withCtx(() => [
                    createVNode(_component_a_space, null, {
                      default: withCtx(() => [
                        createVNode(_component_a_menu, {
                          mode: "horizontal",
                          selectedKeys: ["overview"]
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_menu_item, { key: "overview" }, {
                              default: withCtx(() => [
                                createVNode("a", {
                                  href: navHref("overview")
                                }, "Overview", 8, ["href"])
                              ]),
                              _: 1
                            }),
                            viewModel.value.member?.role === "admin" ? (openBlock(), createBlock(_component_a_menu_item, { key: "departments" }, {
                              default: withCtx(() => [
                                createVNode("a", {
                                  href: navHref("departments")
                                }, "Departments", 8, ["href"])
                              ]),
                              _: 1
                            })) : createCommentVNode("", true),
                            createVNode(_component_a_menu_item, { key: "classrooms" }, {
                              default: withCtx(() => [
                                createVNode("a", {
                                  href: navHref("classrooms")
                                }, "Classrooms", 8, ["href"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, { key: "people" }, {
                              default: withCtx(() => [
                                createVNode("a", {
                                  href: navHref("people")
                                }, "People Directory", 8, ["href"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, { key: "catalog" }, {
                              default: withCtx(() => [
                                createVNode("a", {
                                  href: navHref("catalog")
                                }, "Catalog", 8, ["href"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_menu_item, { key: "calendar" }, {
                              default: withCtx(() => [
                                createVNode("a", {
                                  href: navHref("calendar")
                                }, "Calendar", 8, ["href"])
                              ]),
                              _: 1
                            }),
                            viewModel.value.member?.role !== "student" ? (openBlock(), createBlock(_component_a_menu_item, { key: "assignments" }, {
                              default: withCtx(() => [
                                createVNode("a", {
                                  href: navHref("assignments")
                                }, "Assignments", 8, ["href"])
                              ]),
                              _: 1
                            })) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_button, {
                          size: "small",
                          onClick: load
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(ReloadOutlined)),
                            createTextVNode(" Refresh ")
                          ]),
                          _: 1
                        }),
                        !viewModel.value.member ? (openBlock(), createBlock(_component_a_button, {
                          key: 0,
                          size: "small",
                          type: "primary",
                          href: "/institution/join"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Join Institution")
                          ]),
                          _: 1
                        })) : (openBlock(), createBlock(_component_a_button, {
                          key: 1,
                          size: "small",
                          danger: "",
                          onClick: leaveInstitution
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Leave")
                          ]),
                          _: 1
                        }))
                      ]),
                      _: 1
                    })
                  ]),
                  footer: withCtx(() => [
                    createVNode(_component_a_row, {
                      gutter: 16,
                      class: "portal-header-row"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_col, { span: 16 }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              size: "small",
                              bordered: "",
                              class: "portal-header-card"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_row, { gutter: 16 }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_col, { span: 8 }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_statistic, {
                                          value: enrolledClassrooms.value.length
                                        }, {
                                          title: withCtx(() => [
                                            createVNode("span", null, [
                                              createVNode(unref(TeamOutlined), { class: "stat-icon" }),
                                              createTextVNode(" Enrolled classrooms ")
                                            ])
                                          ]),
                                          _: 1
                                        }, 8, ["value"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_col, { span: 8 }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_statistic, {
                                          value: activeDepartments.value.length
                                        }, {
                                          title: withCtx(() => [
                                            createVNode("span", null, [
                                              createVNode(unref(ClusterOutlined), { class: "stat-icon" }),
                                              createTextVNode(" Active departments ")
                                            ])
                                          ]),
                                          _: 1
                                        }, 8, ["value"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_col, { span: 8 }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_statistic, {
                                          value: averageCourseProgress.value,
                                          suffix: "%"
                                        }, {
                                          title: withCtx(() => [
                                            createVNode("span", null, [
                                              createVNode(unref(DashboardOutlined), { class: "stat-icon" }),
                                              createTextVNode(" Avg. course progress ")
                                            ])
                                          ]),
                                          _: 1
                                        }, 8, ["value"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_row, {
                                  gutter: 16,
                                  style: { "margin-top": "12px" }
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_col, { span: 8 }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_statistic, {
                                          value: gradeAveragePct.value,
                                          suffix: "%"
                                        }, {
                                          title: withCtx(() => [
                                            createVNode("span", null, [
                                              createVNode(unref(CheckCircleOutlined), { class: "stat-icon" }),
                                              createTextVNode(" Avg. grade ")
                                            ])
                                          ]),
                                          _: 1
                                        }, 8, ["value"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_col, { span: 8 }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_statistic, { value: totalOrders.value }, {
                                          title: withCtx(() => [
                                            createVNode("span", null, [
                                              createVNode(unref(ShoppingCartOutlined), { class: "stat-icon" }),
                                              createTextVNode(" Orders for this institution ")
                                            ])
                                          ]),
                                          _: 1
                                        }, 8, ["value"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_col, { span: 8 }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_statistic, { value: runningLabsCount.value }, {
                                          title: withCtx(() => [
                                            createVNode("span", null, [
                                              createVNode(unref(ExperimentOutlined), { class: "stat-icon" }),
                                              createTextVNode(" Active lab sessions ")
                                            ])
                                          ]),
                                          _: 1
                                        }, 8, ["value"])
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
                        createVNode(_component_a_col, { span: 8 }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              size: "small",
                              class: "student-card"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "student-header" }, [
                                  createVNode("div", { class: "avatar-circle" }, [
                                    createVNode("span", null, toDisplayString(studentInitials.value), 1)
                                  ]),
                                  createVNode("div", { class: "student-meta" }, [
                                    createVNode("div", { class: "student-name" }, toDisplayString(studentDisplayName.value), 1),
                                    createVNode("div", { class: "student-email" }, toDisplayString(viewModel.value.user.email), 1),
                                    createVNode("div", { class: "student-role" }, [
                                      createVNode(_component_a_tag, { color: "blue" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(UserOutlined), { class: "tag-icon" }),
                                          createTextVNode(" " + toDisplayString(memberRoleLabel.value), 1)
                                        ]),
                                        _: 1
                                      }),
                                      viewModel.value.member?.status === "ACTIVE" ? (openBlock(), createBlock(_component_a_tag, {
                                        key: 0,
                                        color: "green"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Active member ")
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true)
                                    ])
                                  ])
                                ]),
                                createVNode(_component_a_divider),
                                createVNode(_component_a_descriptions, {
                                  column: 1,
                                  size: "small"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_descriptions_item, { label: "Institution ID" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(viewModel.value.institution.id), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "Member since" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(formatDate(viewModel.value.member?.createdAt)), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "Last activity" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(lastActivityDisplay.value), 1)
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
                    })
                  ]),
                  _: 1
                }, 8, ["title", "sub-title"]),
                viewModel.value.member?.role === "student" ? (openBlock(), createBlock(_component_a_row, {
                  key: 0,
                  gutter: 16,
                  class: "portal-layout"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_a_col, {
                      xs: 24,
                      md: 8
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          size: "small",
                          title: "Institution Programs & Classrooms"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "section-header" }, [
                              createVNode("span", { class: "section-title" }, [
                                createVNode(unref(ClusterOutlined), { class: "section-icon" }),
                                createTextVNode(" Departments ")
                              ]),
                              createVNode(_component_a_switch, {
                                checked: showOnlyMyClassrooms.value,
                                "onUpdate:checked": ($event) => showOnlyMyClassrooms.value = $event,
                                size: "small",
                                style: { "margin-left": "auto" }
                              }, null, 8, ["checked", "onUpdate:checked"]),
                              createVNode("span", { class: "filter-label" }, "Show only my classrooms")
                            ]),
                            createVNode(_component_a_collapse, { accordion: "" }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(activeDepartments.value, (dept) => {
                                  return openBlock(), createBlock(_component_a_collapse_panel, {
                                    key: dept.id,
                                    header: dept.name
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_list, {
                                        size: "small",
                                        "data-source": classroomsByDepartment(dept.id),
                                        locale: { emptyText: "No classrooms" }
                                      }, {
                                        renderItem: withCtx(({ item }) => [
                                          createVNode(_component_a_list_item, {
                                            onClick: ($event) => focusClassroom(item),
                                            style: { "cursor": "pointer" }
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "classroom-item" }, [
                                                createVNode("div", { class: "classroom-title" }, [
                                                  createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                  createVNode("span", null, toDisplayString(item.title), 1),
                                                  item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                    key: 0,
                                                    color: "green",
                                                    style: { "margin-left": "8px" }
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Enrolled")
                                                    ]),
                                                    _: 1
                                                  })) : createCommentVNode("", true)
                                                ]),
                                                createVNode("div", { class: "classroom-meta" }, [
                                                  createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                  item.teacherId ? (openBlock(), createBlock("span", { key: 0 }, "• Teacher: " + toDisplayString(item.teacherId), 1)) : createCommentVNode("", true)
                                                ]),
                                                createVNode("div", { class: "classroom-meta" }, [
                                                  createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                  item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, "• Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                ]),
                                                createVNode("div", { class: "classroom-meta" }, [
                                                  createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                  createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                ]),
                                                createVNode("div", { class: "classroom-meta" }, [
                                                  createVNode("span", null, "Next due: " + toDisplayString(nextDueByClassroom(item.id)), 1)
                                                ])
                                              ])
                                            ]),
                                            _: 2
                                          }, 1032, ["onClick"])
                                        ]),
                                        _: 1
                                      }, 8, ["data-source"])
                                    ]),
                                    _: 2
                                  }, 1032, ["header"]);
                                }), 128)),
                                createVNode(_component_a_collapse_panel, {
                                  key: "other",
                                  header: "Other classrooms"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_list, {
                                      size: "small",
                                      "data-source": classroomsWithoutDepartment.value,
                                      locale: { emptyText: "No other classrooms" }
                                    }, {
                                      renderItem: withCtx(({ item }) => [
                                        createVNode(_component_a_list_item, {
                                          onClick: ($event) => focusClassroom(item),
                                          style: { "cursor": "pointer" }
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "classroom-item" }, [
                                              createVNode("div", { class: "classroom-title" }, [
                                                createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                createVNode("span", null, toDisplayString(item.title), 1)
                                              ]),
                                              createVNode("div", { class: "classroom-meta" }, [
                                                createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                              ])
                                            ])
                                          ]),
                                          _: 2
                                        }, 1032, ["onClick"])
                                      ]),
                                      _: 1
                                    }, 8, ["data-source"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_divider),
                            createVNode(_component_a_card, {
                              size: "small",
                              bordered: false,
                              title: "My Institution Courses"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_list, {
                                  size: "small",
                                  "data-source": courses.value,
                                  locale: { emptyText: "No enrolled courses" }
                                }, {
                                  renderItem: withCtx(({ item }) => [
                                    createVNode(_component_a_list_item, {
                                      onClick: ($event) => focusCourse(item),
                                      style: { "cursor": "pointer" }
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("div", { style: { "display": "flex", "align-items": "center", "gap": "8px" } }, [
                                          createVNode("span", null, toDisplayString(item.title), 1),
                                          createVNode(_component_a_progress, {
                                            percent: item.progressPct,
                                            size: "small",
                                            style: { "width": "120px" }
                                          }, null, 8, ["percent"])
                                        ])
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick"])
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
                    }),
                    createVNode(_component_a_col, {
                      xs: 24,
                      md: 8
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          size: "small",
                          title: centerTitle.value
                        }, {
                          default: withCtx(() => [
                            !focusedCourseId.value ? (openBlock(), createBlock(_component_a_empty, {
                              key: 0,
                              description: "Select a classroom or course"
                            })) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                              createVNode("div", { class: "section-header" }, [
                                createVNode("span", { class: "section-title" }, [
                                  createVNode(unref(DashboardOutlined), { class: "section-icon" }),
                                  createTextVNode(" Active Modules ")
                                ]),
                                createVNode(_component_a_button, {
                                  size: "small",
                                  type: "primary",
                                  href: continueLink.value,
                                  disabled: !continueLink.value
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Continue where you left off")
                                  ]),
                                  _: 1
                                }, 8, ["href", "disabled"])
                              ]),
                              createVNode(_component_a_table, {
                                size: "small",
                                dataSource: moduleRows.value,
                                columns: moduleColumns,
                                pagination: { pageSize: 6 },
                                "row-key": "id"
                              }, {
                                bodyCell: withCtx(({ column, record }) => [
                                  column.key === "status" ? (openBlock(), createBlock(_component_a_space, { key: 0 }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_tag, { color: "green" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(record.completed) + " done", 1)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_a_tag, { color: "blue" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(record.inProgress) + " in-progress", 1)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_a_tag, null, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(record.notStarted) + " not-started", 1)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024)) : column.key === "next" ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(record.nextLabel), 1)) : createCommentVNode("", true)
                                ]),
                                _: 1
                              }, 8, ["dataSource"]),
                              createVNode(_component_a_divider),
                              createVNode("div", { class: "section-header" }, [
                                createVNode("span", { class: "section-title" }, [
                                  createVNode(unref(CalendarOutlined), { class: "section-icon" }),
                                  createTextVNode(" Next Assignment ")
                                ])
                              ]),
                              createVNode(_component_a_list, {
                                size: "small",
                                "data-source": nextAssignmentsForFocus.value,
                                locale: { emptyText: "No upcoming assignments" }
                              }, {
                                renderItem: withCtx(({ item }) => [
                                  createVNode(_component_a_list_item, null, {
                                    default: withCtx(() => [
                                      createVNode("div", { style: { "display": "flex", "gap": "8px", "align-items": "center" } }, [
                                        createVNode("span", null, toDisplayString(item.title), 1),
                                        createVNode(_component_a_tag, null, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(formatDate(item.dueDate)), 1)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        item.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                          key: 0,
                                          color: "green"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Graded")
                                          ]),
                                          _: 1
                                        })) : item.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                          key: 1,
                                          color: "blue"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Submitted")
                                          ]),
                                          _: 1
                                        })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                          default: withCtx(() => [
                                            createTextVNode("Not submitted")
                                          ]),
                                          _: 1
                                        }))
                                      ])
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 1
                              }, 8, ["data-source"])
                            ], 64))
                          ]),
                          _: 1
                        }, 8, ["title"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, {
                      xs: 24,
                      md: 8
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          size: "small",
                          title: "Discover & Normal Courses"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_input, {
                              value: discoverQuery.value,
                              "onUpdate:value": ($event) => discoverQuery.value = $event,
                              placeholder: "Search courses",
                              style: { "margin-bottom": "8px" }
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_list, {
                              size: "small",
                              "data-source": discoverFiltered.value,
                              locale: { emptyText: "No recommendations" }
                            }, {
                              renderItem: withCtx(({ item }) => [
                                createVNode(_component_a_list_item, null, {
                                  default: withCtx(() => [
                                    createVNode("div", { style: { "display": "flex", "align-items": "center", "gap": "8px", "flex-wrap": "wrap" } }, [
                                      createVNode("span", null, toDisplayString(item.title), 1),
                                      isInstitutionCourse(item) ? (openBlock(), createBlock(_component_a_tag, {
                                        key: 0,
                                        color: "geekblue"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Institution course")
                                        ]),
                                        _: 1
                                      })) : (openBlock(), createBlock(_component_a_tag, {
                                        key: 1,
                                        color: "purple"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Global course")
                                        ]),
                                        _: 1
                                      })),
                                      createVNode(_component_a_tag, null, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(item.difficulty || "—"), 1)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_a_button, {
                                        size: "small",
                                        type: "link",
                                        href: courseDeepLink(item)
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("View details")
                                        ]),
                                        _: 1
                                      }, 8, ["href"])
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
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })) : (openBlock(), createBlock(_component_a_row, {
                  key: 1,
                  gutter: 16,
                  class: "portal-layout"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_a_col, { span: 16 }, {
                      default: withCtx(() => [
                        createVNode(_component_a_card, {
                          bordered: false,
                          class: "portal-main-card"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_tabs, {
                              activeKey: activeTab.value,
                              "onUpdate:activeKey": ($event) => activeTab.value = $event
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_tab_pane, {
                                  key: "overview",
                                  tab: "Overview"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_row, { gutter: 16 }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_col, { span: 16 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_card, {
                                              size: "small",
                                              title: "About this institution"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode("p", { class: "institution-description" }, toDisplayString(viewModel.value.institution.description || "No description provided."), 1),
                                                createVNode(_component_a_descriptions, {
                                                  column: 2,
                                                  size: "small"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(viewModel.value.institution.location || "—"), 1)
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_descriptions_item, { label: "Email" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(viewModel.value.institution.email || "—"), 1)
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_descriptions_item, { label: "Phone" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(viewModel.value.institution.phone || "—"), 1)
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_descriptions_item, { label: "Created" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(formatDate(viewModel.value.institution.createdAt)), 1)
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
                                              size: "small",
                                              style: { "margin-top": "16px" },
                                              title: "Upcoming work (assignments & labs)"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_row, { gutter: 16 }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_col, { span: 14 }, {
                                                      default: withCtx(() => [
                                                        createVNode("div", { class: "section-header" }, [
                                                          createVNode("span", { class: "section-title" }, [
                                                            createVNode(unref(CalendarOutlined), { class: "section-icon" }),
                                                            createTextVNode(" Assignments ")
                                                          ]),
                                                          createVNode(_component_a_switch, {
                                                            checked: showOnlyOpenAssignments.value,
                                                            "onUpdate:checked": ($event) => showOnlyOpenAssignments.value = $event,
                                                            size: "small",
                                                            style: { "margin-left": "auto" }
                                                          }, null, 8, ["checked", "onUpdate:checked"]),
                                                          createVNode("span", { class: "filter-label" }, "Show only open")
                                                        ]),
                                                        createVNode(_component_a_table, {
                                                          size: "small",
                                                          dataSource: upcomingAssignments.value,
                                                          columns: assignmentColumns,
                                                          pagination: false,
                                                          "row-key": "id"
                                                        }, {
                                                          bodyCell: withCtx(({ column, record }) => [
                                                            column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                              createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                            ], 64)) : column.key === "submissionStatus" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                              record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                                key: 0,
                                                                color: "green"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(" Graded ")
                                                                ]),
                                                                _: 1
                                                              })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                                key: 1,
                                                                color: "blue"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(" Submitted ")
                                                                ]),
                                                                _: 1
                                                              })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(" Not submitted ")
                                                                ]),
                                                                _: 1
                                                              }))
                                                            ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                              createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                                            ], 64))
                                                          ]),
                                                          _: 1
                                                        }, 8, ["dataSource"])
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_col, { span: 10 }, {
                                                      default: withCtx(() => [
                                                        createVNode("div", { class: "section-header" }, [
                                                          createVNode("span", { class: "section-title" }, [
                                                            createVNode(unref(ExperimentOutlined), { class: "section-icon" }),
                                                            createTextVNode(" Lab sessions ")
                                                          ])
                                                        ]),
                                                        recentLabs.value.length ? (openBlock(), createBlock(_component_a_timeline, { key: 0 }, {
                                                          default: withCtx(() => [
                                                            (openBlock(true), createBlock(Fragment, null, renderList(recentLabs.value, (lab) => {
                                                              return openBlock(), createBlock(_component_a_timeline_item, {
                                                                key: lab.sessionId,
                                                                color: lab.status === "running" ? "green" : "blue"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode("div", { class: "lab-item" }, [
                                                                    createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                                    createVNode("div", { class: "lab-meta" }, [
                                                                      createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                                      createVNode("span", null, "•"),
                                                                      createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                                    ]),
                                                                    createVNode("div", { class: "lab-meta" }, [
                                                                      createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                                      createVNode("span", null, "•"),
                                                                      createVNode("span", null, "Last heartbeat: " + toDisplayString(formatDate(lab.lastHeartbeat)), 1)
                                                                    ])
                                                                  ])
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["color"]);
                                                            }), 128))
                                                          ]),
                                                          _: 1
                                                        })) : (openBlock(), createBlock(_component_a_empty, {
                                                          key: 1,
                                                          description: "No lab activity yet"
                                                        }))
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
                                        createVNode(_component_a_col, { span: 8 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_card, {
                                              size: "small",
                                              title: "My course snapshot"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_statistic, {
                                                  title: "Enrolled courses",
                                                  value: courses.value.length
                                                }, null, 8, ["value"]),
                                                createVNode(_component_a_statistic, {
                                                  title: "Completed courses",
                                                  value: completedCoursesCount.value,
                                                  style: { "margin-top": "8px" }
                                                }, null, 8, ["value"]),
                                                createVNode(_component_a_statistic, {
                                                  title: "Average progress",
                                                  value: averageCourseProgress.value,
                                                  suffix: "%",
                                                  style: { "margin-top": "8px" }
                                                }, null, 8, ["value"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_card, {
                                              size: "small",
                                              style: { "margin-top": "16px" },
                                              title: "Recent notes"
                                            }, {
                                              default: withCtx(() => [
                                                !viewModel.value.notes.length ? (openBlock(), createBlock(_component_a_empty, {
                                                  key: 0,
                                                  description: "No notes yet for this institution"
                                                })) : (openBlock(), createBlock(_component_a_list, {
                                                  key: 1,
                                                  size: "small",
                                                  "data-source": viewModel.value.notes.slice(0, 3)
                                                }, {
                                                  renderItem: withCtx(({ item: note }) => [
                                                    createVNode(_component_a_list_item, null, {
                                                      default: withCtx(() => [
                                                        createVNode("div", { class: "note-item" }, [
                                                          createVNode("div", { class: "note-course" }, [
                                                            createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                            createVNode("span", null, toDisplayString(note.courseTitle || "Course"), 1)
                                                          ]),
                                                          createVNode("div", { class: "note-body" }, toDisplayString(note.body), 1),
                                                          createVNode("div", { class: "note-date" }, toDisplayString(formatDate(note.createdAt)), 1)
                                                        ])
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 1
                                                }, 8, ["data-source"]))
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
                                createVNode(_component_a_tab_pane, {
                                  key: "departments",
                                  tab: "Departments & Classrooms"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "section-header" }, [
                                      createVNode("span", { class: "section-title" }, [
                                        createVNode(unref(ClusterOutlined), { class: "section-icon" }),
                                        createTextVNode(" Departments ")
                                      ]),
                                      createVNode(_component_a_switch, {
                                        checked: showOnlyMyClassrooms.value,
                                        "onUpdate:checked": ($event) => showOnlyMyClassrooms.value = $event,
                                        size: "small",
                                        style: { "margin-left": "auto" }
                                      }, null, 8, ["checked", "onUpdate:checked"]),
                                      createVNode("span", { class: "filter-label" }, "Show only my classrooms")
                                    ]),
                                    createVNode(_component_a_row, {
                                      gutter: 16,
                                      style: { "margin-top": "8px" }
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_col, { span: 16 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_collapse, { accordion: "" }, {
                                              default: withCtx(() => [
                                                (openBlock(true), createBlock(Fragment, null, renderList(activeDepartments.value, (dept) => {
                                                  return openBlock(), createBlock(_component_a_collapse_panel, {
                                                    key: dept.id,
                                                    header: dept.name
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode("p", { class: "dept-meta" }, toDisplayString(dept.contact || "No contact details"), 1),
                                                      createVNode(_component_a_list, {
                                                        size: "small",
                                                        "data-source": classroomsByDepartment(dept.id),
                                                        locale: { emptyText: "No classrooms in this department" }
                                                      }, {
                                                        renderItem: withCtx(({ item }) => [
                                                          createVNode(_component_a_list_item, null, {
                                                            default: withCtx(() => [
                                                              createVNode("div", { class: "classroom-item" }, [
                                                                createVNode("div", { class: "classroom-title" }, [
                                                                  createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                  createVNode("span", null, toDisplayString(item.title), 1),
                                                                  item.isEnrolled ? (openBlock(), createBlock(_component_a_tag, {
                                                                    key: 0,
                                                                    color: "green",
                                                                    style: { "margin-left": "8px" }
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(" Enrolled ")
                                                                    ]),
                                                                    _: 1
                                                                  })) : (openBlock(), createBlock(_component_a_tag, {
                                                                    key: 1,
                                                                    style: { "margin-left": "8px" }
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(" Not enrolled ")
                                                                    ]),
                                                                    _: 1
                                                                  }))
                                                                ]),
                                                                createVNode("div", { class: "classroom-meta" }, [
                                                                  createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                  item.courseTitle ? (openBlock(), createBlock("span", { key: 0 }, "• Course: " + toDisplayString(item.courseTitle), 1)) : createCommentVNode("", true)
                                                                ]),
                                                                createVNode("div", { class: "classroom-meta" }, [
                                                                  createVNode("span", null, "Status: " + toDisplayString(item.status || "—"), 1),
                                                                  item.capacity !== null ? (openBlock(), createBlock("span", { key: 0 }, " • Capacity: " + toDisplayString(item.capacity), 1)) : createCommentVNode("", true)
                                                                ]),
                                                                createVNode("div", { class: "classroom-meta" }, [
                                                                  createVNode("span", null, "Starts: " + toDisplayString(formatDate(item.startsAt)), 1),
                                                                  createVNode("span", null, "• Ends: " + toDisplayString(formatDate(item.endsAt)), 1)
                                                                ])
                                                              ])
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ]),
                                                        _: 1
                                                      }, 8, ["data-source"])
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["header"]);
                                                }), 128)),
                                                createVNode(_component_a_collapse_panel, {
                                                  key: "other",
                                                  header: "Other classrooms"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_list, {
                                                      size: "small",
                                                      "data-source": classroomsWithoutDepartment.value,
                                                      locale: { emptyText: "No other classrooms" }
                                                    }, {
                                                      renderItem: withCtx(({ item }) => [
                                                        createVNode(_component_a_list_item, null, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "classroom-item" }, [
                                                              createVNode("div", { class: "classroom-title" }, [
                                                                createVNode(unref(BookOutlined), { class: "section-icon" }),
                                                                createVNode("span", null, toDisplayString(item.title), 1)
                                                              ]),
                                                              createVNode("div", { class: "classroom-meta" }, [
                                                                createVNode("span", null, "Code: " + toDisplayString(item.code), 1),
                                                                createVNode("span", null, "• Status: " + toDisplayString(item.status || "—"), 1)
                                                              ])
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
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_col, { span: 8 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_card, {
                                              size: "small",
                                              title: "Classroom summary"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_descriptions, {
                                                  column: 1,
                                                  size: "small"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_a_descriptions_item, { label: "Total classrooms" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(viewModel.value.classrooms.length), 1)
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_descriptions_item, { label: "Active classrooms" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(activeClassrooms.value.length), 1)
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_descriptions_item, { label: "My classrooms" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(enrolledClassrooms.value.length), 1)
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(_component_a_descriptions_item, { label: "Enrollment records" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(viewModel.value.classroomEnrollments.length), 1)
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
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_tab_pane, {
                                  key: "courses",
                                  tab: "Courses & Progress"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "section-header" }, [
                                      createVNode("span", { class: "section-title" }, [
                                        createVNode(unref(BookOutlined), { class: "section-icon" }),
                                        createTextVNode(" Courses at this institution ")
                                      ])
                                    ]),
                                    createVNode(_component_a_table, {
                                      size: "small",
                                      columns: courseColumns,
                                      dataSource: courses.value,
                                      "row-key": "courseId",
                                      pagination: { pageSize: 5 },
                                      style: { "margin-top": "8px" }
                                    }, {
                                      bodyCell: withCtx(({ column, record }) => [
                                        column.key === "progress" ? (openBlock(), createBlock(_component_a_progress, {
                                          key: 0,
                                          percent: record.progressPct,
                                          size: "small"
                                        }, null, 8, ["percent"])) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                          record.gradePct !== null && record.gradePct !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.gradePct.toFixed(0)) + "% ", 1)) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                                          createTextVNode(toDisplayString(record[column.dataIndex] || "—"), 1)
                                        ], 64))
                                      ]),
                                      _: 1
                                    }, 8, ["dataSource"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_tab_pane, {
                                  key: "labs",
                                  tab: "Labs & Assignments"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_row, { gutter: 16 }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_col, { span: 14 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_card, {
                                              size: "small",
                                              title: "Assignments"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_table, {
                                                  size: "small",
                                                  columns: assignmentColumnsDetailed,
                                                  dataSource: viewModel.value.assignments,
                                                  "row-key": "id",
                                                  pagination: { pageSize: 8 }
                                                }, {
                                                  bodyCell: withCtx(({ column, record }) => [
                                                    column.key === "dueDate" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                      createTextVNode(toDisplayString(formatDate(record.dueDate)), 1)
                                                    ], 64)) : column.key === "status" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                      record.submissionStatus === "graded" ? (openBlock(), createBlock(_component_a_tag, {
                                                        key: 0,
                                                        color: "green"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(" Graded ")
                                                        ]),
                                                        _: 1
                                                      })) : record.submissionStatus === "submitted" ? (openBlock(), createBlock(_component_a_tag, {
                                                        key: 1,
                                                        color: "blue"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(" Submitted ")
                                                        ]),
                                                        _: 1
                                                      })) : (openBlock(), createBlock(_component_a_tag, { key: 2 }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(" Not submitted ")
                                                        ]),
                                                        _: 1
                                                      }))
                                                    ], 64)) : column.key === "grade" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                                      record.grade !== null && record.grade !== void 0 ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(record.grade.toFixed(1)), 1)) : (openBlock(), createBlock("span", { key: 1 }, "—"))
                                                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                                      createTextVNode(toDisplayString(record[column.dataIndex] || "—"), 1)
                                                    ], 64))
                                                  ]),
                                                  _: 1
                                                }, 8, ["dataSource"])
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_col, { span: 10 }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_card, {
                                              size: "small",
                                              title: "Lab sessions"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_a_list, {
                                                  size: "small",
                                                  "data-source": viewModel.value.labs
                                                }, {
                                                  renderItem: withCtx(({ item: lab }) => [
                                                    createVNode(_component_a_list_item, null, {
                                                      default: withCtx(() => [
                                                        createVNode("div", { class: "lab-item" }, [
                                                          createVNode("div", { class: "lab-title" }, toDisplayString(lab.challengeTitle), 1),
                                                          createVNode("div", { class: "lab-meta" }, [
                                                            createVNode("span", null, toDisplayString(lab.courseTitle || "No course"), 1),
                                                            createVNode("span", null, "•"),
                                                            createVNode("span", null, "Status: " + toDisplayString(lab.status), 1)
                                                          ]),
                                                          createVNode("div", { class: "lab-meta" }, [
                                                            createVNode("span", null, "Runtime: " + toDisplayString(lab.runtime || "—"), 1),
                                                            createVNode("span", null, "•"),
                                                            createVNode("span", null, "Code server: " + toDisplayString(lab.codeServerUrl || "—"), 1)
                                                          ])
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
                                  key: "orders",
                                  tab: "Orders & Billing"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "section-header" }, [
                                      createVNode("span", { class: "section-title" }, [
                                        createVNode(unref(ShoppingCartOutlined), { class: "section-icon" }),
                                        createTextVNode(" Orders related to this institution ")
                                      ])
                                    ]),
                                    createVNode(_component_a_table, {
                                      size: "small",
                                      columns: orderColumns,
                                      dataSource: viewModel.value.orders,
                                      "row-key": "orderId",
                                      pagination: { pageSize: 5 },
                                      style: { "margin-top": "8px" }
                                    }, {
                                      bodyCell: withCtx(({ column, record }) => [
                                        column.key === "createdAt" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                          createTextVNode(toDisplayString(formatDate(record.createdAt)), 1)
                                        ], 64)) : column.key === "items" ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(record.items.map((i) => i.courseTitle || i.titleSnapshot).join(", ")), 1)) : column.key === "total" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                                          createTextVNode(toDisplayString(record.total.toFixed(2)) + " " + toDisplayString(record.currency), 1)
                                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [
                                          createTextVNode(toDisplayString(record[column.dataIndex]), 1)
                                        ], 64))
                                      ]),
                                      _: 1
                                    }, 8, ["dataSource"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["activeKey", "onUpdate:activeKey"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_col, { span: 8 }, {
                      default: withCtx(() => [
                        createVNode(_component_a_space, {
                          direction: "vertical",
                          size: 16,
                          class: "portal-sidebar",
                          style: { "width": "100%" }
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              size: "small",
                              title: "Quick stats"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_descriptions, {
                                  column: 1,
                                  size: "small"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_descriptions_item, { label: "Departments" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(activeDepartments.value.length) + " active ", 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "Classrooms" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(viewModel.value.classrooms.length) + " total, " + toDisplayString(enrolledClassrooms.value.length) + " mine ", 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "Courses" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(courses.value.length) + " at this institution ", 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "Orders total" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(totalSpent.value.toFixed(2)) + " " + toDisplayString(primaryCurrency.value), 1)
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
                              size: "small",
                              title: "Institution contact"
                            }, {
                              default: withCtx(() => [
                                createVNode("p", { class: "institution-description" }, toDisplayString(viewModel.value.institution.description || "No description provided."), 1),
                                createVNode(_component_a_descriptions, {
                                  column: 1,
                                  size: "small"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_descriptions_item, { label: "Email" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(viewModel.value.institution.email || "—"), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "Phone" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(viewModel.value.institution.phone || "—"), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "Location" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(viewModel.value.institution.location || "—"), 1)
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
                              size: "small",
                              title: "System & metadata"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_descriptions, {
                                  column: 1,
                                  size: "small"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_descriptions_item, { label: "Auth institution ID" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(viewModel.value.authInstitution?.id || "—"), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "Student ID" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(viewModel.value.student.id), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "User ID" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(viewModel.value.user.id), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_descriptions_item, { label: "Student mirror ID" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(viewModel.value.studentMirror?.id || "—"), 1)
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
                    })
                  ]),
                  _: 1
                }))
              ], 64)) : error.value ? (openBlock(), createBlock(_component_a_result, {
                key: 1,
                status: "error",
                title: "Failed to load institution view"
              }, {
                subTitle: withCtx(() => [
                  createTextVNode(toDisplayString(error.value), 1)
                ]),
                extra: withCtx(() => [
                  createVNode(_component_a_button, {
                    type: "primary",
                    onClick: load
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Retry")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/institution-portal/nuxt/pages/student_mode_institution_dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const student_mode_institution_dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-789f08b6"]]);

export { student_mode_institution_dashboard as default };
//# sourceMappingURL=student_mode_institution_dashboard-C05ORetd.mjs.map
