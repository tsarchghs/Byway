import { defineComponent, ref, computed, watch, resolveComponent, mergeProps, withCtx, unref, createVNode, createTextVNode, createBlock, createCommentVNode, openBlock, resolveDynamicComponent, toDisplayString, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderVNode, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc, d as useRoute, u as useRouter, b as useRuntimeConfig } from './server.mjs';
import { message } from 'ant-design-vue';
import { ApartmentOutlined, DashboardOutlined, TeamOutlined, ProfileOutlined, SafetyCertificateOutlined, ClusterOutlined, BookOutlined, CalendarOutlined, FieldTimeOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { u as useAuth } from './useAuth-B8D9e8en.mjs';
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
  __name: "inst-portal-role-based",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const runtime = useRuntimeConfig();
    const apiBase = runtime.public?.apiBase || runtime.public?.appBaseUrl || "";
    const { me } = useAuth();
    const clientReady = ref(false);
    const apiAuthToken = ref(null);
    const institutions = ref([]);
    const departments = ref([]);
    const classrooms = ref([]);
    const members = ref([]);
    const teacherCourses = ref([]);
    const initialLoading = ref(true);
    const loadError = ref(null);
    const lastSyncedLabel = ref("never");
    const roleControlValue = ref("auto");
    const focusTab = ref("overview");
    const isDarkMode = ref(false);
    const currentRole = ref("none");
    ref(null);
    const selectedClassroom = ref(null);
    const classroomDrawerOpen = ref(false);
    const adminModalOpen = ref(false);
    const adminModalMode = ref("department");
    const adminForm = ref({ name: "", owner: "", note: "" });
    function resolveAuthHeader() {
      const rawToken = apiAuthToken.value || "";
      if (!rawToken) return null;
      return rawToken.startsWith("Bearer") ? rawToken : `Bearer ${rawToken}`;
    }
    const roleSelectOptions = [
      { label: "Auto (based on role)", value: "auto" },
      { label: "Administrators", value: "admin" },
      { label: "Teachers", value: "teacher" },
      { label: "Students", value: "student" }
    ];
    const themeClass = computed(() => isDarkMode.value ? "theme-dark" : "theme-light");
    const institutionKey = ref("");
    const resolveInstitutionKey = () => {
      const param = route.params?.institution_id;
      if (Array.isArray(param)) return param[0];
      if (typeof param === "string") return param;
      const queryKey = route.query?.institution_id;
      if (Array.isArray(queryKey)) return queryKey[0];
      if (typeof queryKey === "string") return queryKey;
      return "";
    };
    const instId = computed(() => route.query.institutionId || institutionKey.value || "inst_byway");
    function navHref(key) {
      const qs = `?institutionId=${encodeURIComponent(instId.value)}`;
      if (key === "overview") return `/institution/portal${qs}`;
      if (key === "departments") return `/institution/departments/${qs}`;
      if (key === "classrooms") return `/institution/classrooms/${qs}`;
      if (key === "people") return `/institution/people${qs}`;
      if (key === "catalog") return `/institution/catalog${qs}`;
      if (key === "calendar") return `/institution/calendar${qs}`;
      if (key === "assignments") return `/institution/assignments/teachers${qs}`;
      return `/institution/portal${qs}`;
    }
    watch(
      () => [route.params?.institution_id, route.query?.institution_id],
      () => {
        institutionKey.value = resolveInstitutionKey();
      },
      { immediate: true }
    );
    const activeInstitution = computed(() => {
      if (institutions.value.length === 0) return null;
      if (!institutionKey.value) return institutions.value[0] || null;
      return institutions.value.find(
        (i) => i.id === institutionKey.value || i.slug === institutionKey.value
      ) || institutions.value[0] || null;
    });
    const institutionDepartments = computed(
      () => activeInstitution.value ? departments.value.filter((d) => d.institutionId === activeInstitution.value.id) : []
    );
    const institutionClassrooms = computed(
      () => activeInstitution.value ? classrooms.value.filter((c) => c.institutionId === activeInstitution.value.id) : []
    );
    const institutionMembers = computed(
      () => activeInstitution.value ? members.value.filter((m) => m.institutionId === activeInstitution.value.id) : []
    );
    const adminMembers = computed(
      () => institutionMembers.value.filter((m) => /admin/i.test(m.role))
    );
    const teacherMembers = computed(
      () => institutionMembers.value.filter((m) => /teach/i.test(m.role))
    );
    const studentMembers = computed(
      () => institutionMembers.value.filter((m) => /student/i.test(m.role))
    );
    const membership = computed(() => {
      if (!me.value) return null;
      return institutionMembers.value.find((m) => m.userId === me.value.id) || null;
    });
    const membershipRole = computed(() => {
      if (roleControlValue.value !== "auto") return roleControlValue.value;
      if (currentRole.value === "admin" || currentRole.value === "teacher" || currentRole.value === "student") {
        return currentRole.value;
      }
      const role = membership.value?.role?.toLowerCase();
      if (role?.includes("admin")) return "admin";
      if (role?.includes("teach")) return "teacher";
      if (role?.includes("student")) return "student";
      return "student";
    });
    const effectiveRole = computed(() => membershipRole.value);
    const isAdminView = computed(() => effectiveRole.value === "admin");
    const isTeacherView = computed(() => effectiveRole.value === "teacher");
    const isStudentView = computed(() => effectiveRole.value === "student");
    const heroSubtitle = computed(() => {
      if (!activeInstitution.value) return "";
      const deptCount = institutionDepartments.value.length;
      const classCount = institutionClassrooms.value.length;
      return `Live institution workspace with ${deptCount} departments and ${classCount} classrooms mapped to Teach.`;
    });
    const roleViewDescription = computed(() => {
      const map = {
        admin: "Viewing as Administrator",
        teacher: "Viewing as Teacher",
        student: "Viewing as Student"
      };
      return map[effectiveRole.value];
    });
    const heroStats = computed(() => {
      const deptCount = institutionDepartments.value.length;
      const classCount = institutionClassrooms.value.length;
      const activeClassrooms = institutionClassrooms.value.filter(
        (c) => c.status !== "archived"
      ).length;
      const memberCount = institutionMembers.value.length;
      const facultyCoverage = teacherMembers.value.length;
      const avgCapacity = institutionClassrooms.value.length ? Math.round(
        institutionClassrooms.value.reduce((sum, c) => sum + (c.capacity || 0), 0) / institutionClassrooms.value.length
      ) : 0;
      return [
        {
          id: "departments",
          label: "Departments",
          value: `${deptCount}`,
          hint: `${deptCount ? "Mapped" : "Pending mapping"} for ${activeInstitution.value?.name || ""}`,
          icon: ApartmentOutlined
        },
        {
          id: "classrooms",
          label: "Classrooms",
          value: `${classCount}`,
          hint: `${activeClassrooms} active, ${classCount - activeClassrooms} in draft`,
          icon: DashboardOutlined
        },
        {
          id: "members",
          label: "Memberships",
          value: `${memberCount}`,
          hint: `${facultyCoverage} teachers, ${studentMembers.value.length} learners`,
          icon: TeamOutlined
        },
        {
          id: "capacity",
          label: "Avg Capacity",
          value: `${avgCapacity}`,
          hint: "Seats per classroom",
          icon: ProfileOutlined
        }
      ];
    });
    const deptById = computed(() => {
      const map = {};
      departments.value.forEach((d) => {
        map[d.id] = d;
      });
      return map;
    });
    const departmentClassroomCount = computed(() => {
      const map = {};
      institutionClassrooms.value.forEach((c) => {
        if (!c.departmentId) return;
        map[c.departmentId] = (map[c.departmentId] || 0) + 1;
      });
      return map;
    });
    const adminSnapshots = computed(() => {
      const deptActive = institutionDepartments.value.filter((d) => d.active !== false).length;
      const totalDepartments = Math.max(1, institutionDepartments.value.length);
      const compliance = `${Math.round(deptActive / totalDepartments * 100)}%`;
      const rooms = `${institutionClassrooms.value.filter((c) => c.status === "active").length} active`;
      const membershipDepth = `${adminMembers.value.length} admins`;
      return [
        {
          id: "governance",
          label: "Governance coverage",
          metric: compliance,
          detail: "Departments with active governance owners",
          status: deptActive === totalDepartments ? "good" : "watch"
        },
        {
          id: "rooms",
          label: "Classroom readiness",
          metric: rooms,
          detail: "Rooms mapped to Teach-internal",
          status: institutionClassrooms.value.length > 0 ? "good" : "watch"
        },
        {
          id: "membership",
          label: "Administrator presence",
          metric: membershipDepth,
          detail: "People with admin role at this institution",
          status: adminMembers.value.length > 0 ? "good" : "watch"
        }
      ];
    });
    const teacherMissions = computed(() => {
      return institutionClassrooms.value.slice(0, 6).map((c, index) => ({
        id: c.id,
        title: c.title || c.code,
        description: `${deptById.value[c.departmentId || ""]?.name || "General studies"} · ${c.capacity || 0} seats`,
        timeline: `Week ${index + 1}`,
        classroom: c
      }));
    });
    const teacherTableData = computed(
      () => institutionClassrooms.value.map((c) => ({
        ...c,
        departmentName: deptById.value[c.departmentId || ""]?.name || "General studies"
      }))
    );
    const studentMoments = computed(() => {
      if (institutionClassrooms.value.length === 0) {
        return [
          {
            id: "no-classrooms",
            title: "No classrooms linked yet",
            description: "Connect Teach classrooms to surface student journeys.",
            helper: "Setup required",
            status: "warn"
          }
        ];
      }
      return institutionClassrooms.value.slice(0, 5).map((c, idx) => ({
        id: `student-${c.id}`,
        title: c.title || `Learning lane ${idx + 1}`,
        description: `Code ${c.code} · ${deptById.value[c.departmentId || ""]?.name || "General"}`,
        helper: `${c.enrollmentCount ?? 0} enrolled`,
        status: c.enrollmentCount && c.enrollmentCount > (c.capacity || 0) ? "warn" : "good"
      }));
    });
    const studentEngagement = computed(() => {
      const classroomsCount = institutionClassrooms.value.length;
      return [
        {
          id: "attendance",
          label: "Attendance",
          helper: "Based on classroom check-ins",
          percent: Math.min(100, 60 + classroomsCount * 5)
        },
        {
          id: "assignments",
          label: "Assignments on track",
          helper: "Teach-internal mirrored tasks",
          percent: Math.min(100, 55 + classroomsCount * 4)
        },
        {
          id: "labs",
          label: "Lab readiness",
          helper: "Hands-on modules",
          percent: Math.min(100, 40 + classroomsCount * 3)
        }
      ];
    });
    const nextImportantDates = computed(() => {
      return opsTimeline.value.slice(0, 4);
    });
    const opsTimeline = computed(() => {
      return institutionClassrooms.value.slice(0, 6).map((c, idx) => ({
        id: c.id,
        title: c.title || c.code,
        description: `${deptById.value[c.departmentId || ""]?.name || "General"} · Capacity ${c.capacity || 0}`,
        date: clientReady.value ? new Date(Date.now() + idx * 864e5).toLocaleDateString() : `Day ${idx + 1}`,
        color: c.status === "active" ? "green" : "blue"
      }));
    });
    const capacityUsage = computed(() => {
      const totalCapacity = institutionClassrooms.value.reduce(
        (sum, c) => sum + (c.capacity || 0),
        0
      );
      const totalEnrollments = institutionClassrooms.value.reduce(
        (sum, c) => sum + (c.enrollmentCount || 0),
        0
      );
      if (!totalCapacity) return 0;
      return Math.round(totalEnrollments / totalCapacity * 100);
    });
    const highlightCourses = computed(() => {
      if (teacherCourses.value.length > 0) {
        return teacherCourses.value.filter(
          (course) => !activeInstitution.value || !course.institutionId || course.institutionId === activeInstitution.value.id
        );
      }
      return teacherMissions.value.slice(0, 3).map((mission) => ({
        id: mission.id,
        title: mission.title,
        category: deptById.value[mission.classroom?.departmentId || ""]?.name || "Integrated program",
        difficulty: mission.timeline
      }));
    });
    const classroomRecommendations = computed(() => {
      if (!selectedClassroom.value) return [];
      return [
        {
          id: "sync",
          label: "Sync attendance from Teach-internal",
          detail: "Ensure live roster is mirrored for gradebook accuracy."
        },
        {
          id: "assign",
          label: "Assign secondary facilitator",
          detail: "Add a co-teacher for resilience across lab sessions."
        },
        {
          id: "students",
          label: "Audit student roster",
          detail: "Verify enrollments vs Byway membership records."
        }
      ];
    });
    const roleNarrative = computed(() => {
      switch (effectiveRole.value) {
        case "admin":
          return {
            badge: "Administrator view",
            title: "Keep governance resilient",
            description: "Track institution readiness, unlock department blueprints, and enforce compliance without leaving this workspace.",
            helper: "Auto-linked membership data keeps leadership heatmaps accurate."
          };
        case "teacher":
          return {
            badge: "Teacher view",
            title: "Orchestrate the learning runway",
            description: "Line up classrooms, review mission queues, and keep Teach-internal courses in sync with institutional targets.",
            helper: "Classrooms and courses mirror Teach IDs so transitions stay seamless."
          };
        default:
          return {
            badge: "Student view",
            title: "Mentor every learner journey",
            description: "Surface advisory nudges, track engagement, and highlight upcoming milestones across the institution.",
            helper: "Signals adapt based on classroom enrollment and real-time mock data."
          };
      }
    });
    const roleSpotlights = computed(() => {
      if (effectiveRole.value === "admin") {
        return [
          {
            id: "coverage",
            title: "Role coverage",
            detail: `${adminMembers.value.length} admins vs ${teacherMembers.value.length} faculty`,
            metric: `${capacityUsage.value}% util`,
            icon: SafetyCertificateOutlined
          },
          {
            id: "departments",
            title: "Departments mapped",
            detail: `${institutionDepartments.value.length} total units`,
            metric: `${Object.keys(departmentClassroomCount.value).length} active`,
            icon: ClusterOutlined
          },
          {
            id: "classrooms",
            title: "Rooms ready",
            detail: `${institutionClassrooms.value.filter((c) => c.status === "active").length} active`,
            metric: `${institutionClassrooms.value.length} total`,
            icon: ApartmentOutlined
          }
        ];
      }
      if (effectiveRole.value === "teacher") {
        return [
          {
            id: "missions",
            title: "Missions queued",
            detail: "Classrooms needing focus this sprint",
            metric: `${teacherMissions.value.length}`,
            icon: BookOutlined
          },
          {
            id: "courses",
            title: "Courses linked",
            detail: "Teach-internal courses synced",
            metric: `${highlightCourses.value.length}`,
            icon: DashboardOutlined
          },
          {
            id: "timeline",
            title: "Timeline readiness",
            detail: "Upcoming classroom checkpoints",
            metric: `${opsTimeline.value.length}`,
            icon: CalendarOutlined
          }
        ];
      }
      const engagementAverage = studentEngagement.value.length ? Math.round(
        studentEngagement.value.reduce((sum, item) => sum + item.percent, 0) / studentEngagement.value.length
      ) : 0;
      return [
        {
          id: "engagement",
          title: "Engagement index",
          detail: "Attendance and assignments on track",
          metric: `${engagementAverage}%`,
          icon: FieldTimeOutlined
        },
        {
          id: "advisory",
          title: "Advisory signals",
          detail: `${studentMoments.value.length} active nudges`,
          metric: `${studentMembers.value.length} learners`,
          icon: ProfileOutlined
        },
        {
          id: "calendar",
          title: "Upcoming checkpoints",
          detail: "Next cohort events",
          metric: `${nextImportantDates.value.length}`,
          icon: CalendarOutlined
        }
      ];
    });
    const adminWorkflowQueue = computed(() => {
      const inactiveDepartments = institutionDepartments.value.filter((d) => d.active === false).length;
      const pendingClassrooms = institutionClassrooms.value.filter((c) => c.status !== "active").length;
      return [
        {
          id: "dept-audit",
          label: "Activate departments",
          description: `${inactiveDepartments} departments awaiting activation`,
          owner: "Governance"
        },
        {
          id: "classroom-readiness",
          label: "Review classroom readiness",
          description: `${pendingClassrooms} rooms pending launch`,
          owner: "Academic ops"
        },
        {
          id: "membership-review",
          label: "Audit memberships",
          description: `${institutionMembers.value.length} total memberships`,
          owner: "HR coordination"
        }
      ];
    });
    const teacherDayTimeline = computed(
      () => (opsTimeline.value.length ? opsTimeline.value : studentMoments.value).slice(0, 4).map(
        (entry, idx) => ({
          ...entry,
          slot: `Block ${idx + 1}`
        })
      )
    );
    const studentActionItems = computed(() => {
      return studentMoments.value.map((moment, index) => ({
        id: moment.id,
        label: `Action ${index + 1}`,
        description: moment.description,
        helper: moment.helper,
        status: moment.status
      }));
    });
    const teacherTableCustomRow = (record) => ({
      onClick: () => openClassroomDrawer(record)
    });
    const defaultTabByRole = {
      admin: "administrators",
      teacher: "teachers",
      student: "students"
    };
    function handleRoleSelect(value) {
      roleControlValue.value = value;
      if (value === "auto") {
        focusTab.value = defaultTabByRole[effectiveRole.value] || "overview";
      } else {
        focusTab.value = defaultTabByRole[value] || "overview";
      }
    }
    function openClassroomDrawer(classroom) {
      selectedClassroom.value = classroom;
      classroomDrawerOpen.value = true;
    }
    function handleRefresh() {
      loadOverview();
    }
    function openAdminModal(mode) {
      adminModalMode.value = mode;
      adminForm.value = { name: "", owner: "", note: "" };
      adminModalOpen.value = true;
    }
    const adminModalTitle = computed(
      () => adminModalMode.value === "department" ? "New department blueprint" : "New classroom shell"
    );
    function handleAdminModalOk() {
      if (!adminForm.value.name?.trim()) {
        message.error("Name is required");
        return;
      }
      const label = adminModalMode.value === "department" ? "Department" : "Classroom";
      message.success(`${label} plan saved locally`);
      adminModalOpen.value = false;
    }
    function openTeachingDrawerFromHero() {
      focusTab.value = "teachers";
    }
    function handleMockAction(kind) {
      message.info(`Mock action triggered for ${kind}`);
    }
    function goFallbackInstitution() {
      if (institutions.value.length === 0) return;
      const fallback = institutions.value[0];
      router.replace({ path: `/institution/${fallback.id}` });
    }
    async function loadOverview() {
      const authToken = resolveAuthHeader();
      if (!authToken) {
        loadError.value = "Missing auth token";
        initialLoading.value = false;
        return;
      }
      const url = `${apiBase}/api/institution-portal/overview`;
      initialLoading.value = true;
      loadError.value = null;
      try {
        const resp = await fetch(url, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: authToken
          }
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const json = await resp.json();
        institutions.value = json.institutions || [];
        departments.value = json.departments || [];
        classrooms.value = (json.classrooms || []).map((c) => ({
          ...c,
          enrollmentCount: c.enrollments?.length ?? c.enrollment ?? c.enrollmentCount ?? null
        }));
        members.value = json.members || [];
        await loadTeacherCourses();
        lastSyncedLabel.value = (/* @__PURE__ */ new Date()).toLocaleString();
      } catch (err) {
        console.warn("[institutions-portal] overview failed", err);
        loadError.value = err?.message || "Failed to load overview";
      } finally {
        initialLoading.value = false;
      }
    }
    async function loadTeacherCourses() {
      teacherCourses.value = [];
      const authToken = resolveAuthHeader();
      if (!authToken) return;
      try {
        const resp = await fetch(`${apiBase}/api/teach-internal/graphql`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: authToken
          },
          body: JSON.stringify({
            query: `
          query MyCourses {
            myCourses {
              id
              title
              difficulty
              category
              institutionId
            }
          }
        `
          })
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const json = await resp.json();
        const courses = json?.data?.myCourses;
        teacherCourses.value = Array.isArray(courses) ? courses : [];
      } catch (err) {
        console.warn("[institutions-portal] teacher courses fallback", err);
        teacherCourses.value = [];
      }
    }
    watch(
      () => effectiveRole.value,
      (role) => {
        if (roleControlValue.value === "auto") {
          focusTab.value = defaultTabByRole[role] || "overview";
        }
      },
      { immediate: true }
    );
    watch(
      () => route.query.role,
      (role) => {
        if (role === "admin" || role === "teacher" || role === "student") {
          handleRoleSelect(role);
        }
      }
    );
    watch(
      () => isDarkMode.value,
      (val) => {
      }
    );
    watch(activeInstitution, () => {
      selectedClassroom.value = null;
      classroomDrawerOpen.value = false;
    });
    watch(currentRole, (r) => {
      if (r === "none") {
        router.replace({ path: "/institution/join" });
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_spin = resolveComponent("a-spin");
      const _component_a_result = resolveComponent("a-result");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_menu = resolveComponent("a-menu");
      const _component_a_menu_item = resolveComponent("a-menu-item");
      const _component_a_switch = resolveComponent("a-switch");
      const _component_a_select = resolveComponent("a-select");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_tabs = resolveComponent("a-tabs");
      const _component_a_tab_pane = resolveComponent("a-tab-pane");
      const _component_a_list = resolveComponent("a-list");
      const _component_a_list_item = resolveComponent("a-list-item");
      const _component_a_list_item_meta = resolveComponent("a-list-item-meta");
      const _component_a_row = resolveComponent("a-row");
      const _component_a_col = resolveComponent("a-col");
      const _component_a_timeline = resolveComponent("a-timeline");
      const _component_a_timeline_item = resolveComponent("a-timeline-item");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_table_column = resolveComponent("a-table-column");
      const _component_a_tag = resolveComponent("a-tag");
      const _component_a_space = resolveComponent("a-space");
      const _component_a_divider = resolveComponent("a-divider");
      const _component_a_progress = resolveComponent("a-progress");
      const _component_a_empty = resolveComponent("a-empty");
      const _component_a_drawer = resolveComponent("a-drawer");
      const _component_a_descriptions = resolveComponent("a-descriptions");
      const _component_a_descriptions_item = resolveComponent("a-descriptions-item");
      const _component_a_modal = resolveComponent("a-modal");
      const _component_a_form = resolveComponent("a-form");
      const _component_a_form_item = resolveComponent("a-form-item");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_textarea = resolveComponent("a-textarea");
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["institution-role-portal", themeClass.value]
      }, _attrs))} data-v-80e44fc0>`);
      if (initialLoading.value) {
        _push(`<div class="portal-state portal-state--loading" data-v-80e44fc0>`);
        _push(ssrRenderComponent(_component_a_spin, { tip: "Synchronizing institution insights..." }, null, _parent));
        _push(`</div>`);
      } else if (loadError.value) {
        _push(`<div class="portal-state" data-v-80e44fc0>`);
        _push(ssrRenderComponent(_component_a_result, {
          status: "warning",
          title: "Unable to load institution portal",
          "sub-title": loadError.value
        }, {
          extra: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_a_button, {
                type: "primary",
                onClick: handleRefresh
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(ReloadOutlined), null, null, _parent3, _scopeId2));
                    _push3(` Try again `);
                  } else {
                    return [
                      createVNode(unref(ReloadOutlined)),
                      createTextVNode(" Try again ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_a_button, {
                  type: "primary",
                  onClick: handleRefresh
                }, {
                  default: withCtx(() => [
                    createVNode(unref(ReloadOutlined)),
                    createTextVNode(" Try again ")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else if (!activeInstitution.value) {
        _push(`<div class="portal-state" data-v-80e44fc0>`);
        _push(ssrRenderComponent(_component_a_result, {
          status: "404",
          title: "Institution not found",
          "sub-title": "The ID in the URL does not match any institution you have access to."
        }, {
          extra: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_a_button, {
                type: "primary",
                onClick: goFallbackInstitution
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Jump to default institution `);
                  } else {
                    return [
                      createTextVNode(" Jump to default institution ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_a_button, {
                  type: "primary",
                  onClick: goFallbackInstitution
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Jump to default institution ")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="portal-shell" data-v-80e44fc0><header class="portal-hero" data-v-80e44fc0><div class="portal-hero__left" data-v-80e44fc0><p class="eyebrow" data-v-80e44fc0>Institution control room</p><h1 data-v-80e44fc0>${ssrInterpolate(activeInstitution.value.name)}</h1><p class="hero-subtitle" data-v-80e44fc0>${ssrInterpolate(heroSubtitle.value)}</p><ul class="hero-meta" data-v-80e44fc0><li data-v-80e44fc0>`);
        _push(ssrRenderComponent(unref(TeamOutlined), null, null, _parent));
        _push(` ${ssrInterpolate(activeInstitution.value.type || "Comprehensive campus")} · ${ssrInterpolate(activeInstitution.value.location || "Location TBC")}</li><li data-v-80e44fc0>`);
        _push(ssrRenderComponent(unref(ApartmentOutlined), null, null, _parent));
        _push(` ${ssrInterpolate(institutionDepartments.value.length)} departments · ${ssrInterpolate(institutionClassrooms.value.length)} classrooms </li><li data-v-80e44fc0>`);
        _push(ssrRenderComponent(unref(SafetyCertificateOutlined), null, null, _parent));
        _push(` ${ssrInterpolate(roleViewDescription.value)}</li></ul></div><div class="portal-hero__right" data-v-80e44fc0>`);
        _push(ssrRenderComponent(_component_a_menu, {
          mode: "horizontal",
          selectedKeys: ["overview"],
          style: { "margin-bottom": "12px" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_a_menu_item, { key: "overview" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<a${ssrRenderAttr("href", navHref("overview"))} data-v-80e44fc0${_scopeId2}>Overview</a>`);
                  } else {
                    return [
                      createVNode("a", {
                        href: navHref("overview")
                      }, "Overview", 8, ["href"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (isAdminView.value) {
                _push2(ssrRenderComponent(_component_a_menu_item, { key: "departments" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<a${ssrRenderAttr("href", navHref("departments"))} data-v-80e44fc0${_scopeId2}>Departments</a>`);
                    } else {
                      return [
                        createVNode("a", {
                          href: navHref("departments")
                        }, "Departments", 8, ["href"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(ssrRenderComponent(_component_a_menu_item, { key: "classrooms" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<a${ssrRenderAttr("href", navHref("classrooms"))} data-v-80e44fc0${_scopeId2}>Classrooms</a>`);
                  } else {
                    return [
                      createVNode("a", {
                        href: navHref("classrooms")
                      }, "Classrooms", 8, ["href"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_a_menu_item, { key: "people" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<a${ssrRenderAttr("href", navHref("people"))} data-v-80e44fc0${_scopeId2}>People Directory</a>`);
                  } else {
                    return [
                      createVNode("a", {
                        href: navHref("people")
                      }, "People Directory", 8, ["href"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_a_menu_item, { key: "catalog" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<a${ssrRenderAttr("href", navHref("catalog"))} data-v-80e44fc0${_scopeId2}>Catalog</a>`);
                  } else {
                    return [
                      createVNode("a", {
                        href: navHref("catalog")
                      }, "Catalog", 8, ["href"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_a_menu_item, { key: "calendar" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<a${ssrRenderAttr("href", navHref("calendar"))} data-v-80e44fc0${_scopeId2}>Calendar</a>`);
                  } else {
                    return [
                      createVNode("a", {
                        href: navHref("calendar")
                      }, "Calendar", 8, ["href"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_a_menu_item, { key: "assignments" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<a${ssrRenderAttr("href", navHref("assignments"))} data-v-80e44fc0${_scopeId2}>Assignments</a>`);
                  } else {
                    return [
                      createVNode("a", {
                        href: navHref("assignments")
                      }, "Assignments", 8, ["href"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
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
                isAdminView.value ? (openBlock(), createBlock(_component_a_menu_item, { key: "departments" }, {
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
                createVNode(_component_a_menu_item, { key: "assignments" }, {
                  default: withCtx(() => [
                    createVNode("a", {
                      href: navHref("assignments")
                    }, "Assignments", 8, ["href"])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="hero-controls" data-v-80e44fc0>`);
        _push(ssrRenderComponent(_component_a_switch, {
          checked: isDarkMode.value,
          "onUpdate:checked": ($event) => isDarkMode.value = $event,
          "checked-children": "Dark",
          "un-checked-children": "Light"
        }, null, _parent));
        _push(ssrRenderComponent(_component_a_select, {
          class: "role-select",
          value: roleControlValue.value,
          style: { "width": "200px" },
          options: roleSelectOptions,
          onChange: handleRoleSelect
        }, null, _parent));
        _push(`</div><div class="hero-actions" data-v-80e44fc0>`);
        if (isAdminView.value) {
          _push(ssrRenderComponent(_component_a_button, {
            type: "primary",
            onClick: ($event) => openAdminModal("department")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(ClusterOutlined), null, null, _parent2, _scopeId));
                _push2(` New department plan `);
              } else {
                return [
                  createVNode(unref(ClusterOutlined)),
                  createTextVNode(" New department plan ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (isAdminView.value) {
          _push(ssrRenderComponent(_component_a_button, {
            onClick: ($event) => openAdminModal("classroom")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(ApartmentOutlined), null, null, _parent2, _scopeId));
                _push2(` Add classroom shell `);
              } else {
                return [
                  createVNode(unref(ApartmentOutlined)),
                  createTextVNode(" Add classroom shell ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (isTeacherView.value) {
          _push(ssrRenderComponent(_component_a_button, { onClick: openTeachingDrawerFromHero }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(BookOutlined), null, null, _parent2, _scopeId));
                _push2(` Teaching playbook `);
              } else {
                return [
                  createVNode(unref(BookOutlined)),
                  createTextVNode(" Teaching playbook ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (isStudentView.value) {
          _push(ssrRenderComponent(_component_a_button, {
            onClick: ($event) => focusTab.value = "students"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(FieldTimeOutlined), null, null, _parent2, _scopeId));
                _push2(` Learner spotlight `);
              } else {
                return [
                  createVNode(unref(FieldTimeOutlined)),
                  createTextVNode(" Learner spotlight ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div><p class="hero-updated" data-v-80e44fc0>Last synced: ${ssrInterpolate(lastSyncedLabel.value)}</p></div></header><section class="role-narrative" data-v-80e44fc0><div class="role-narrative__copy" data-v-80e44fc0><p class="role-narrative__badge" data-v-80e44fc0>${ssrInterpolate(roleNarrative.value.badge)}</p><h2 data-v-80e44fc0>${ssrInterpolate(roleNarrative.value.title)}</h2><p data-v-80e44fc0>${ssrInterpolate(roleNarrative.value.description)}</p><p class="role-narrative__helper" data-v-80e44fc0>${ssrInterpolate(roleNarrative.value.helper)}</p></div><div class="role-narrative__spotlights" data-v-80e44fc0><!--[-->`);
        ssrRenderList(roleSpotlights.value, (spotlight) => {
          _push(ssrRenderComponent(_component_a_card, {
            key: spotlight.id,
            class: "spotlight-card",
            bordered: false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="spotlight-card__icon" data-v-80e44fc0${_scopeId}>`);
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(spotlight.icon), null, null), _parent2, _scopeId);
                _push2(`</div><div class="spotlight-card__content" data-v-80e44fc0${_scopeId}><p class="spotlight-card__title" data-v-80e44fc0${_scopeId}>${ssrInterpolate(spotlight.title)}</p><p class="spotlight-card__detail" data-v-80e44fc0${_scopeId}>${ssrInterpolate(spotlight.detail)}</p></div><p class="spotlight-card__metric" data-v-80e44fc0${_scopeId}>${ssrInterpolate(spotlight.metric)}</p>`);
              } else {
                return [
                  createVNode("div", { class: "spotlight-card__icon" }, [
                    (openBlock(), createBlock(resolveDynamicComponent(spotlight.icon)))
                  ]),
                  createVNode("div", { class: "spotlight-card__content" }, [
                    createVNode("p", { class: "spotlight-card__title" }, toDisplayString(spotlight.title), 1),
                    createVNode("p", { class: "spotlight-card__detail" }, toDisplayString(spotlight.detail), 1)
                  ]),
                  createVNode("p", { class: "spotlight-card__metric" }, toDisplayString(spotlight.metric), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></section><section class="stat-grid" aria-label="Key indicators" data-v-80e44fc0><!--[-->`);
        ssrRenderList(heroStats.value, (stat) => {
          _push(ssrRenderComponent(_component_a_card, {
            key: stat.id,
            class: "stat-card",
            bordered: false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="stat-icon" data-v-80e44fc0${_scopeId}>`);
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(stat.icon), null, null), _parent2, _scopeId);
                _push2(`</div><div data-v-80e44fc0${_scopeId}><p class="stat-label" data-v-80e44fc0${_scopeId}>${ssrInterpolate(stat?.label)}</p><p class="stat-value" data-v-80e44fc0${_scopeId}>${ssrInterpolate(stat?.value)}</p><p class="stat-hint" data-v-80e44fc0${_scopeId}>${ssrInterpolate(stat?.hint)}</p></div>`);
              } else {
                return [
                  createVNode("div", { class: "stat-icon" }, [
                    (openBlock(), createBlock(resolveDynamicComponent(stat.icon)))
                  ]),
                  createVNode("div", null, [
                    createVNode("p", { class: "stat-label" }, toDisplayString(stat?.label), 1),
                    createVNode("p", { class: "stat-value" }, toDisplayString(stat?.value), 1),
                    createVNode("p", { class: "stat-hint" }, toDisplayString(stat?.hint), 1)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></section><section class="role-tabs" aria-label="Role specific focus" data-v-80e44fc0>`);
        _push(ssrRenderComponent(_component_a_tabs, {
          activeKey: focusTab.value,
          "onUpdate:activeKey": ($event) => focusTab.value = $event
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_a_tab_pane, {
                key: "overview",
                tab: "Unified overview"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="lanes-grid" data-v-80e44fc0${_scopeId2}><article class="${ssrRenderClass([{ "role-lane--highlight": isAdminView.value }, "role-lane"])}" data-v-80e44fc0${_scopeId2}><header data-v-80e44fc0${_scopeId2}><div data-v-80e44fc0${_scopeId2}><p class="role-lane__eyebrow" data-v-80e44fc0${_scopeId2}>Administrators</p><h3 data-v-80e44fc0${_scopeId2}>Operational guardrails</h3></div><span class="role-lane__badge" data-v-80e44fc0${_scopeId2}>${ssrInterpolate(adminMembers.value.length)} leads</span></header>`);
                    _push3(ssrRenderComponent(_component_a_list, {
                      "data-source": adminSnapshots.value,
                      split: false
                    }, {
                      renderItem: withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_list_item, null, {
                            actions: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<span class="metric-pill"${ssrRenderAttr("data-status", item.status)} data-v-80e44fc0${_scopeId4}>${ssrInterpolate(item.metric)}</span>`);
                              } else {
                                return [
                                  createVNode("span", {
                                    class: "metric-pill",
                                    "data-status": item.status
                                  }, toDisplayString(item.metric), 9, ["data-status"])
                                ];
                              }
                            }),
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_list_item_meta, {
                                  title: item.label,
                                  description: item.detail
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_list_item_meta, {
                                    title: item.label,
                                    description: item.detail
                                  }, null, 8, ["title", "description"])
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_list_item, null, {
                              actions: withCtx(() => [
                                createVNode("span", {
                                  class: "metric-pill",
                                  "data-status": item.status
                                }, toDisplayString(item.metric), 9, ["data-status"])
                              ]),
                              default: withCtx(() => [
                                createVNode(_component_a_list_item_meta, {
                                  title: item.label,
                                  description: item.detail
                                }, null, 8, ["title", "description"])
                              ]),
                              _: 2
                            }, 1024)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<footer data-v-80e44fc0${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_a_button, {
                      type: "link",
                      onClick: ($event) => focusTab.value = "administrators"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` Open administrator workspace `);
                        } else {
                          return [
                            createTextVNode(" Open administrator workspace ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</footer></article><article class="${ssrRenderClass([{ "role-lane--highlight": isTeacherView.value }, "role-lane"])}" data-v-80e44fc0${_scopeId2}><header data-v-80e44fc0${_scopeId2}><div data-v-80e44fc0${_scopeId2}><p class="role-lane__eyebrow" data-v-80e44fc0${_scopeId2}>Teachers</p><h3 data-v-80e44fc0${_scopeId2}>Instruction playbooks</h3></div><span class="role-lane__badge" data-v-80e44fc0${_scopeId2}>${ssrInterpolate(teacherMembers.value.length)} faculty</span></header>`);
                    _push3(ssrRenderComponent(_component_a_list, {
                      "data-source": teacherMissions.value,
                      split: false
                    }, {
                      renderItem: withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_list_item, {
                            onClick: ($event) => item.classroom && openClassroomDrawer(item.classroom)
                          }, {
                            actions: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<span class="metric-pill metric-pill--accent" data-v-80e44fc0${_scopeId4}>${ssrInterpolate(item.timeline)}</span>`);
                              } else {
                                return [
                                  createVNode("span", { class: "metric-pill metric-pill--accent" }, toDisplayString(item.timeline), 1)
                                ];
                              }
                            }),
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_list_item_meta, {
                                  title: item.title,
                                  description: item.description
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_list_item_meta, {
                                    title: item.title,
                                    description: item.description
                                  }, null, 8, ["title", "description"])
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_list_item, {
                              onClick: ($event) => item.classroom && openClassroomDrawer(item.classroom)
                            }, {
                              actions: withCtx(() => [
                                createVNode("span", { class: "metric-pill metric-pill--accent" }, toDisplayString(item.timeline), 1)
                              ]),
                              default: withCtx(() => [
                                createVNode(_component_a_list_item_meta, {
                                  title: item.title,
                                  description: item.description
                                }, null, 8, ["title", "description"])
                              ]),
                              _: 2
                            }, 1032, ["onClick"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<footer data-v-80e44fc0${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_a_button, {
                      type: "link",
                      onClick: ($event) => focusTab.value = "teachers"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` Open teaching workspace `);
                        } else {
                          return [
                            createTextVNode(" Open teaching workspace ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</footer></article><article class="${ssrRenderClass([{ "role-lane--highlight": isStudentView.value }, "role-lane"])}" data-v-80e44fc0${_scopeId2}><header data-v-80e44fc0${_scopeId2}><div data-v-80e44fc0${_scopeId2}><p class="role-lane__eyebrow" data-v-80e44fc0${_scopeId2}>Students</p><h3 data-v-80e44fc0${_scopeId2}>Learning guidance</h3></div><span class="role-lane__badge" data-v-80e44fc0${_scopeId2}>${ssrInterpolate(studentMembers.value.length)} learners</span></header>`);
                    _push3(ssrRenderComponent(_component_a_list, {
                      "data-source": studentMoments.value,
                      split: false
                    }, {
                      renderItem: withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_list_item, null, {
                            actions: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<span class="metric-pill"${ssrRenderAttr("data-status", item.status)} data-v-80e44fc0${_scopeId4}>${ssrInterpolate(item.helper)}</span>`);
                              } else {
                                return [
                                  createVNode("span", {
                                    class: "metric-pill",
                                    "data-status": item.status
                                  }, toDisplayString(item.helper), 9, ["data-status"])
                                ];
                              }
                            }),
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_list_item_meta, {
                                  title: item.title,
                                  description: item.description
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_list_item_meta, {
                                    title: item.title,
                                    description: item.description
                                  }, null, 8, ["title", "description"])
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_list_item, null, {
                              actions: withCtx(() => [
                                createVNode("span", {
                                  class: "metric-pill",
                                  "data-status": item.status
                                }, toDisplayString(item.helper), 9, ["data-status"])
                              ]),
                              default: withCtx(() => [
                                createVNode(_component_a_list_item_meta, {
                                  title: item.title,
                                  description: item.description
                                }, null, 8, ["title", "description"])
                              ]),
                              _: 2
                            }, 1024)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<footer data-v-80e44fc0${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_a_button, {
                      type: "link",
                      onClick: ($event) => focusTab.value = "students"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` Open learner workspace `);
                        } else {
                          return [
                            createTextVNode(" Open learner workspace ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</footer></article></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "lanes-grid" }, [
                        createVNode("article", {
                          class: ["role-lane", { "role-lane--highlight": isAdminView.value }]
                        }, [
                          createVNode("header", null, [
                            createVNode("div", null, [
                              createVNode("p", { class: "role-lane__eyebrow" }, "Administrators"),
                              createVNode("h3", null, "Operational guardrails")
                            ]),
                            createVNode("span", { class: "role-lane__badge" }, toDisplayString(adminMembers.value.length) + " leads", 1)
                          ]),
                          createVNode(_component_a_list, {
                            "data-source": adminSnapshots.value,
                            split: false
                          }, {
                            renderItem: withCtx(({ item }) => [
                              createVNode(_component_a_list_item, null, {
                                actions: withCtx(() => [
                                  createVNode("span", {
                                    class: "metric-pill",
                                    "data-status": item.status
                                  }, toDisplayString(item.metric), 9, ["data-status"])
                                ]),
                                default: withCtx(() => [
                                  createVNode(_component_a_list_item_meta, {
                                    title: item.label,
                                    description: item.detail
                                  }, null, 8, ["title", "description"])
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 1
                          }, 8, ["data-source"]),
                          createVNode("footer", null, [
                            createVNode(_component_a_button, {
                              type: "link",
                              onClick: ($event) => focusTab.value = "administrators"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Open administrator workspace ")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ])
                        ], 2),
                        createVNode("article", {
                          class: ["role-lane", { "role-lane--highlight": isTeacherView.value }]
                        }, [
                          createVNode("header", null, [
                            createVNode("div", null, [
                              createVNode("p", { class: "role-lane__eyebrow" }, "Teachers"),
                              createVNode("h3", null, "Instruction playbooks")
                            ]),
                            createVNode("span", { class: "role-lane__badge" }, toDisplayString(teacherMembers.value.length) + " faculty", 1)
                          ]),
                          createVNode(_component_a_list, {
                            "data-source": teacherMissions.value,
                            split: false
                          }, {
                            renderItem: withCtx(({ item }) => [
                              createVNode(_component_a_list_item, {
                                onClick: ($event) => item.classroom && openClassroomDrawer(item.classroom)
                              }, {
                                actions: withCtx(() => [
                                  createVNode("span", { class: "metric-pill metric-pill--accent" }, toDisplayString(item.timeline), 1)
                                ]),
                                default: withCtx(() => [
                                  createVNode(_component_a_list_item_meta, {
                                    title: item.title,
                                    description: item.description
                                  }, null, 8, ["title", "description"])
                                ]),
                                _: 2
                              }, 1032, ["onClick"])
                            ]),
                            _: 1
                          }, 8, ["data-source"]),
                          createVNode("footer", null, [
                            createVNode(_component_a_button, {
                              type: "link",
                              onClick: ($event) => focusTab.value = "teachers"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Open teaching workspace ")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ])
                        ], 2),
                        createVNode("article", {
                          class: ["role-lane", { "role-lane--highlight": isStudentView.value }]
                        }, [
                          createVNode("header", null, [
                            createVNode("div", null, [
                              createVNode("p", { class: "role-lane__eyebrow" }, "Students"),
                              createVNode("h3", null, "Learning guidance")
                            ]),
                            createVNode("span", { class: "role-lane__badge" }, toDisplayString(studentMembers.value.length) + " learners", 1)
                          ]),
                          createVNode(_component_a_list, {
                            "data-source": studentMoments.value,
                            split: false
                          }, {
                            renderItem: withCtx(({ item }) => [
                              createVNode(_component_a_list_item, null, {
                                actions: withCtx(() => [
                                  createVNode("span", {
                                    class: "metric-pill",
                                    "data-status": item.status
                                  }, toDisplayString(item.helper), 9, ["data-status"])
                                ]),
                                default: withCtx(() => [
                                  createVNode(_component_a_list_item_meta, {
                                    title: item.title,
                                    description: item.description
                                  }, null, 8, ["title", "description"])
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 1
                          }, 8, ["data-source"]),
                          createVNode("footer", null, [
                            createVNode(_component_a_button, {
                              type: "link",
                              onClick: ($event) => focusTab.value = "students"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Open learner workspace ")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ])
                        ], 2)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_a_tab_pane, {
                key: "administrators",
                tab: "Administrator cockpit"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_row, { gutter: 16 }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_col, {
                            xs: 24,
                            md: 10
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_card, {
                                  title: "Governance metrics",
                                  class: "admin-card"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_timeline, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<!--[-->`);
                                            ssrRenderList(adminSnapshots.value, (item) => {
                                              _push7(ssrRenderComponent(_component_a_timeline_item, {
                                                key: item.id,
                                                color: item.status === "good" ? "green" : "orange"
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`<p class="timeline-title" data-v-80e44fc0${_scopeId7}>${ssrInterpolate(item.label)}</p><p class="timeline-description" data-v-80e44fc0${_scopeId7}>${ssrInterpolate(item.detail)}</p><p class="timeline-metric" data-v-80e44fc0${_scopeId7}>${ssrInterpolate(item.metric)}</p>`);
                                                  } else {
                                                    return [
                                                      createVNode("p", { class: "timeline-title" }, toDisplayString(item.label), 1),
                                                      createVNode("p", { class: "timeline-description" }, toDisplayString(item.detail), 1),
                                                      createVNode("p", { class: "timeline-metric" }, toDisplayString(item.metric), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                            });
                                            _push7(`<!--]-->`);
                                          } else {
                                            return [
                                              (openBlock(true), createBlock(Fragment, null, renderList(adminSnapshots.value, (item) => {
                                                return openBlock(), createBlock(_component_a_timeline_item, {
                                                  key: item.id,
                                                  color: item.status === "good" ? "green" : "orange"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode("p", { class: "timeline-title" }, toDisplayString(item.label), 1),
                                                    createVNode("p", { class: "timeline-description" }, toDisplayString(item.detail), 1),
                                                    createVNode("p", { class: "timeline-metric" }, toDisplayString(item.metric), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["color"]);
                                              }), 128))
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_a_button, {
                                        block: "",
                                        type: "dashed",
                                        onClick: ($event) => handleMockAction("compliance")
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(SafetyCertificateOutlined), null, null, _parent7, _scopeId6));
                                            _push7(` Run compliance pulse (mock) `);
                                          } else {
                                            return [
                                              createVNode(unref(SafetyCertificateOutlined)),
                                              createTextVNode(" Run compliance pulse (mock) ")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_a_timeline, null, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(adminSnapshots.value, (item) => {
                                              return openBlock(), createBlock(_component_a_timeline_item, {
                                                key: item.id,
                                                color: item.status === "good" ? "green" : "orange"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode("p", { class: "timeline-title" }, toDisplayString(item.label), 1),
                                                  createVNode("p", { class: "timeline-description" }, toDisplayString(item.detail), 1),
                                                  createVNode("p", { class: "timeline-metric" }, toDisplayString(item.metric), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"]);
                                            }), 128))
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_button, {
                                          block: "",
                                          type: "dashed",
                                          onClick: ($event) => handleMockAction("compliance")
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(SafetyCertificateOutlined)),
                                            createTextVNode(" Run compliance pulse (mock) ")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_card, {
                                  title: "Strategic queue",
                                  class: "admin-card"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_list, {
                                        "data-source": adminWorkflowQueue.value,
                                        size: "small",
                                        bordered: ""
                                      }, {
                                        renderItem: withCtx(({ item }, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_list_item, null, {
                                              actions: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`<span class="metric-pill metric-pill--accent" data-v-80e44fc0${_scopeId7}>${ssrInterpolate(item.owner)}</span>`);
                                                } else {
                                                  return [
                                                    createVNode("span", { class: "metric-pill metric-pill--accent" }, toDisplayString(item.owner), 1)
                                                  ];
                                                }
                                              }),
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_a_list_item_meta, {
                                                    title: item.label,
                                                    description: item.description
                                                  }, null, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_a_list_item_meta, {
                                                      title: item.label,
                                                      description: item.description
                                                    }, null, 8, ["title", "description"])
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_list_item, null, {
                                                actions: withCtx(() => [
                                                  createVNode("span", { class: "metric-pill metric-pill--accent" }, toDisplayString(item.owner), 1)
                                                ]),
                                                default: withCtx(() => [
                                                  createVNode(_component_a_list_item_meta, {
                                                    title: item.label,
                                                    description: item.description
                                                  }, null, 8, ["title", "description"])
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
                                        createVNode(_component_a_list, {
                                          "data-source": adminWorkflowQueue.value,
                                          size: "small",
                                          bordered: ""
                                        }, {
                                          renderItem: withCtx(({ item }) => [
                                            createVNode(_component_a_list_item, null, {
                                              actions: withCtx(() => [
                                                createVNode("span", { class: "metric-pill metric-pill--accent" }, toDisplayString(item.owner), 1)
                                              ]),
                                              default: withCtx(() => [
                                                createVNode(_component_a_list_item_meta, {
                                                  title: item.label,
                                                  description: item.description
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
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_card, {
                                    title: "Governance metrics",
                                    class: "admin-card"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_timeline, null, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(adminSnapshots.value, (item) => {
                                            return openBlock(), createBlock(_component_a_timeline_item, {
                                              key: item.id,
                                              color: item.status === "good" ? "green" : "orange"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode("p", { class: "timeline-title" }, toDisplayString(item.label), 1),
                                                createVNode("p", { class: "timeline-description" }, toDisplayString(item.detail), 1),
                                                createVNode("p", { class: "timeline-metric" }, toDisplayString(item.metric), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["color"]);
                                          }), 128))
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_button, {
                                        block: "",
                                        type: "dashed",
                                        onClick: ($event) => handleMockAction("compliance")
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(SafetyCertificateOutlined)),
                                          createTextVNode(" Run compliance pulse (mock) ")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_card, {
                                    title: "Strategic queue",
                                    class: "admin-card"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_list, {
                                        "data-source": adminWorkflowQueue.value,
                                        size: "small",
                                        bordered: ""
                                      }, {
                                        renderItem: withCtx(({ item }) => [
                                          createVNode(_component_a_list_item, null, {
                                            actions: withCtx(() => [
                                              createVNode("span", { class: "metric-pill metric-pill--accent" }, toDisplayString(item.owner), 1)
                                            ]),
                                            default: withCtx(() => [
                                              createVNode(_component_a_list_item_meta, {
                                                title: item.label,
                                                description: item.description
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
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_col, {
                            xs: 24,
                            md: 14
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_card, {
                                  title: "Department operating picture",
                                  class: "admin-card"
                                }, {
                                  extra: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_space, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_button, {
                                              type: "primary",
                                              onClick: ($event) => openAdminModal("department")
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(` Create department `);
                                                } else {
                                                  return [
                                                    createTextVNode(" Create department ")
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_button, {
                                              onClick: ($event) => openAdminModal("classroom")
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(` Create classroom `);
                                                } else {
                                                  return [
                                                    createTextVNode(" Create classroom ")
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_button, {
                                                type: "primary",
                                                onClick: ($event) => openAdminModal("department")
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Create department ")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"]),
                                              createVNode(_component_a_button, {
                                                onClick: ($event) => openAdminModal("classroom")
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Create classroom ")
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
                                        createVNode(_component_a_space, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_button, {
                                              type: "primary",
                                              onClick: ($event) => openAdminModal("department")
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Create department ")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"]),
                                            createVNode(_component_a_button, {
                                              onClick: ($event) => openAdminModal("classroom")
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Create classroom ")
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
                                      _push6(ssrRenderComponent(_component_a_table, {
                                        size: "small",
                                        dataSource: institutionDepartments.value,
                                        pagination: { pageSize: 6 },
                                        rowKey: "id"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_table_column, {
                                              key: "name",
                                              title: "Department",
                                              dataIndex: "name"
                                            }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_table_column, {
                                              key: "slug",
                                              title: "Slug",
                                              dataIndex: "slug"
                                            }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_table_column, {
                                              key: "classrooms",
                                              title: "Classrooms"
                                            }, {
                                              default: withCtx(({ record }, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(departmentClassroomCount.value[record.id] || 0)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(departmentClassroomCount.value[record.id] || 0), 1)
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_table_column, {
                                              key: "status",
                                              title: "Status"
                                            }, {
                                              default: withCtx(({ record }, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_a_tag, {
                                                    color: record.active !== false ? "green" : "default"
                                                  }, {
                                                    default: withCtx((_7, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`${ssrInterpolate(record.active !== false ? "Active" : "Inactive")}`);
                                                      } else {
                                                        return [
                                                          createTextVNode(toDisplayString(record.active !== false ? "Active" : "Inactive"), 1)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_a_tag, {
                                                      color: record.active !== false ? "green" : "default"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(record.active !== false ? "Active" : "Inactive"), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["color"])
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_table_column, {
                                                key: "name",
                                                title: "Department",
                                                dataIndex: "name"
                                              }),
                                              createVNode(_component_a_table_column, {
                                                key: "slug",
                                                title: "Slug",
                                                dataIndex: "slug"
                                              }),
                                              createVNode(_component_a_table_column, {
                                                key: "classrooms",
                                                title: "Classrooms"
                                              }, {
                                                default: withCtx(({ record }) => [
                                                  createTextVNode(toDisplayString(departmentClassroomCount.value[record.id] || 0), 1)
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_table_column, {
                                                key: "status",
                                                title: "Status"
                                              }, {
                                                default: withCtx(({ record }) => [
                                                  createVNode(_component_a_tag, {
                                                    color: record.active !== false ? "green" : "default"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(record.active !== false ? "Active" : "Inactive"), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["color"])
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
                                        createVNode(_component_a_table, {
                                          size: "small",
                                          dataSource: institutionDepartments.value,
                                          pagination: { pageSize: 6 },
                                          rowKey: "id"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_table_column, {
                                              key: "name",
                                              title: "Department",
                                              dataIndex: "name"
                                            }),
                                            createVNode(_component_a_table_column, {
                                              key: "slug",
                                              title: "Slug",
                                              dataIndex: "slug"
                                            }),
                                            createVNode(_component_a_table_column, {
                                              key: "classrooms",
                                              title: "Classrooms"
                                            }, {
                                              default: withCtx(({ record }) => [
                                                createTextVNode(toDisplayString(departmentClassroomCount.value[record.id] || 0), 1)
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_table_column, {
                                              key: "status",
                                              title: "Status"
                                            }, {
                                              default: withCtx(({ record }) => [
                                                createVNode(_component_a_tag, {
                                                  color: record.active !== false ? "green" : "default"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(record.active !== false ? "Active" : "Inactive"), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["color"])
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }, 8, ["dataSource"])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_card, {
                                    title: "Department operating picture",
                                    class: "admin-card"
                                  }, {
                                    extra: withCtx(() => [
                                      createVNode(_component_a_space, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_button, {
                                            type: "primary",
                                            onClick: ($event) => openAdminModal("department")
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Create department ")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"]),
                                          createVNode(_component_a_button, {
                                            onClick: ($event) => openAdminModal("classroom")
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Create classroom ")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    default: withCtx(() => [
                                      createVNode(_component_a_table, {
                                        size: "small",
                                        dataSource: institutionDepartments.value,
                                        pagination: { pageSize: 6 },
                                        rowKey: "id"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_table_column, {
                                            key: "name",
                                            title: "Department",
                                            dataIndex: "name"
                                          }),
                                          createVNode(_component_a_table_column, {
                                            key: "slug",
                                            title: "Slug",
                                            dataIndex: "slug"
                                          }),
                                          createVNode(_component_a_table_column, {
                                            key: "classrooms",
                                            title: "Classrooms"
                                          }, {
                                            default: withCtx(({ record }) => [
                                              createTextVNode(toDisplayString(departmentClassroomCount.value[record.id] || 0), 1)
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_table_column, {
                                            key: "status",
                                            title: "Status"
                                          }, {
                                            default: withCtx(({ record }) => [
                                              createVNode(_component_a_tag, {
                                                color: record.active !== false ? "green" : "default"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(record.active !== false ? "Active" : "Inactive"), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"])
                                            ]),
                                            _: 1
                                          })
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
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_col, {
                              xs: 24,
                              md: 10
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, {
                                  title: "Governance metrics",
                                  class: "admin-card"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_timeline, null, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(adminSnapshots.value, (item) => {
                                          return openBlock(), createBlock(_component_a_timeline_item, {
                                            key: item.id,
                                            color: item.status === "good" ? "green" : "orange"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("p", { class: "timeline-title" }, toDisplayString(item.label), 1),
                                              createVNode("p", { class: "timeline-description" }, toDisplayString(item.detail), 1),
                                              createVNode("p", { class: "timeline-metric" }, toDisplayString(item.metric), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["color"]);
                                        }), 128))
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_button, {
                                      block: "",
                                      type: "dashed",
                                      onClick: ($event) => handleMockAction("compliance")
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(SafetyCertificateOutlined)),
                                        createTextVNode(" Run compliance pulse (mock) ")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_card, {
                                  title: "Strategic queue",
                                  class: "admin-card"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_list, {
                                      "data-source": adminWorkflowQueue.value,
                                      size: "small",
                                      bordered: ""
                                    }, {
                                      renderItem: withCtx(({ item }) => [
                                        createVNode(_component_a_list_item, null, {
                                          actions: withCtx(() => [
                                            createVNode("span", { class: "metric-pill metric-pill--accent" }, toDisplayString(item.owner), 1)
                                          ]),
                                          default: withCtx(() => [
                                            createVNode(_component_a_list_item_meta, {
                                              title: item.label,
                                              description: item.description
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
                            }),
                            createVNode(_component_a_col, {
                              xs: 24,
                              md: 14
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, {
                                  title: "Department operating picture",
                                  class: "admin-card"
                                }, {
                                  extra: withCtx(() => [
                                    createVNode(_component_a_space, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_button, {
                                          type: "primary",
                                          onClick: ($event) => openAdminModal("department")
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Create department ")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"]),
                                        createVNode(_component_a_button, {
                                          onClick: ($event) => openAdminModal("classroom")
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Create classroom ")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  default: withCtx(() => [
                                    createVNode(_component_a_table, {
                                      size: "small",
                                      dataSource: institutionDepartments.value,
                                      pagination: { pageSize: 6 },
                                      rowKey: "id"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_table_column, {
                                          key: "name",
                                          title: "Department",
                                          dataIndex: "name"
                                        }),
                                        createVNode(_component_a_table_column, {
                                          key: "slug",
                                          title: "Slug",
                                          dataIndex: "slug"
                                        }),
                                        createVNode(_component_a_table_column, {
                                          key: "classrooms",
                                          title: "Classrooms"
                                        }, {
                                          default: withCtx(({ record }) => [
                                            createTextVNode(toDisplayString(departmentClassroomCount.value[record.id] || 0), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_table_column, {
                                          key: "status",
                                          title: "Status"
                                        }, {
                                          default: withCtx(({ record }) => [
                                            createVNode(_component_a_tag, {
                                              color: record.active !== false ? "green" : "default"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(record.active !== false ? "Active" : "Inactive"), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["color"])
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }, 8, ["dataSource"])
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
                      createVNode(_component_a_row, { gutter: 16 }, {
                        default: withCtx(() => [
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 10
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                title: "Governance metrics",
                                class: "admin-card"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_timeline, null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(adminSnapshots.value, (item) => {
                                        return openBlock(), createBlock(_component_a_timeline_item, {
                                          key: item.id,
                                          color: item.status === "good" ? "green" : "orange"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("p", { class: "timeline-title" }, toDisplayString(item.label), 1),
                                            createVNode("p", { class: "timeline-description" }, toDisplayString(item.detail), 1),
                                            createVNode("p", { class: "timeline-metric" }, toDisplayString(item.metric), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["color"]);
                                      }), 128))
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_button, {
                                    block: "",
                                    type: "dashed",
                                    onClick: ($event) => handleMockAction("compliance")
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(SafetyCertificateOutlined)),
                                      createTextVNode(" Run compliance pulse (mock) ")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_card, {
                                title: "Strategic queue",
                                class: "admin-card"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_list, {
                                    "data-source": adminWorkflowQueue.value,
                                    size: "small",
                                    bordered: ""
                                  }, {
                                    renderItem: withCtx(({ item }) => [
                                      createVNode(_component_a_list_item, null, {
                                        actions: withCtx(() => [
                                          createVNode("span", { class: "metric-pill metric-pill--accent" }, toDisplayString(item.owner), 1)
                                        ]),
                                        default: withCtx(() => [
                                          createVNode(_component_a_list_item_meta, {
                                            title: item.label,
                                            description: item.description
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
                          }),
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 14
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                title: "Department operating picture",
                                class: "admin-card"
                              }, {
                                extra: withCtx(() => [
                                  createVNode(_component_a_space, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_button, {
                                        type: "primary",
                                        onClick: ($event) => openAdminModal("department")
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Create department ")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"]),
                                      createVNode(_component_a_button, {
                                        onClick: ($event) => openAdminModal("classroom")
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Create classroom ")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                default: withCtx(() => [
                                  createVNode(_component_a_table, {
                                    size: "small",
                                    dataSource: institutionDepartments.value,
                                    pagination: { pageSize: 6 },
                                    rowKey: "id"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_table_column, {
                                        key: "name",
                                        title: "Department",
                                        dataIndex: "name"
                                      }),
                                      createVNode(_component_a_table_column, {
                                        key: "slug",
                                        title: "Slug",
                                        dataIndex: "slug"
                                      }),
                                      createVNode(_component_a_table_column, {
                                        key: "classrooms",
                                        title: "Classrooms"
                                      }, {
                                        default: withCtx(({ record }) => [
                                          createTextVNode(toDisplayString(departmentClassroomCount.value[record.id] || 0), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_table_column, {
                                        key: "status",
                                        title: "Status"
                                      }, {
                                        default: withCtx(({ record }) => [
                                          createVNode(_component_a_tag, {
                                            color: record.active !== false ? "green" : "default"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(record.active !== false ? "Active" : "Inactive"), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["color"])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["dataSource"])
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
              _push2(ssrRenderComponent(_component_a_tab_pane, {
                key: "teachers",
                tab: "Teacher workspace"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_row, { gutter: 16 }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_col, {
                            xs: 24,
                            md: 14
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_card, { title: "Classrooms connected to Teach" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_table, {
                                        size: "small",
                                        dataSource: teacherTableData.value,
                                        pagination: { pageSize: 6 },
                                        rowKey: (record) => record.id,
                                        customRow: teacherTableCustomRow
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_table_column, {
                                              key: "title",
                                              title: "Classroom"
                                            }, {
                                              default: withCtx(({ record }, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`<div data-v-80e44fc0${_scopeId7}><strong data-v-80e44fc0${_scopeId7}>${ssrInterpolate(record.title || record.code)}</strong><p class="table-sub" data-v-80e44fc0${_scopeId7}>Code: ${ssrInterpolate(record.code)}</p></div>`);
                                                } else {
                                                  return [
                                                    createVNode("div", null, [
                                                      createVNode("strong", null, toDisplayString(record.title || record.code), 1),
                                                      createVNode("p", { class: "table-sub" }, "Code: " + toDisplayString(record.code), 1)
                                                    ])
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_table_column, {
                                              key: "dept",
                                              title: "Department"
                                            }, {
                                              default: withCtx(({ record }, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(record.departmentName)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(record.departmentName), 1)
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_table_column, {
                                              key: "capacity",
                                              title: "Capacity",
                                              dataIndex: "capacity"
                                            }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_table_column, {
                                              key: "enrollment",
                                              title: "Enrollment"
                                            }, {
                                              default: withCtx(({ record }, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(record.enrollmentCount ?? "—")}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(record.enrollmentCount ?? "—"), 1)
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_a_table_column, {
                                              key: "status",
                                              title: "Status"
                                            }, {
                                              default: withCtx(({ record }, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_a_tag, {
                                                    color: record.status === "active" ? "green" : "default"
                                                  }, {
                                                    default: withCtx((_7, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`${ssrInterpolate(record.status || "pending")}`);
                                                      } else {
                                                        return [
                                                          createTextVNode(toDisplayString(record.status || "pending"), 1)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_a_tag, {
                                                      color: record.status === "active" ? "green" : "default"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(record.status || "pending"), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["color"])
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_table_column, {
                                                key: "title",
                                                title: "Classroom"
                                              }, {
                                                default: withCtx(({ record }) => [
                                                  createVNode("div", null, [
                                                    createVNode("strong", null, toDisplayString(record.title || record.code), 1),
                                                    createVNode("p", { class: "table-sub" }, "Code: " + toDisplayString(record.code), 1)
                                                  ])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_table_column, {
                                                key: "dept",
                                                title: "Department"
                                              }, {
                                                default: withCtx(({ record }) => [
                                                  createTextVNode(toDisplayString(record.departmentName), 1)
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_table_column, {
                                                key: "capacity",
                                                title: "Capacity",
                                                dataIndex: "capacity"
                                              }),
                                              createVNode(_component_a_table_column, {
                                                key: "enrollment",
                                                title: "Enrollment"
                                              }, {
                                                default: withCtx(({ record }) => [
                                                  createTextVNode(toDisplayString(record.enrollmentCount ?? "—"), 1)
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_a_table_column, {
                                                key: "status",
                                                title: "Status"
                                              }, {
                                                default: withCtx(({ record }) => [
                                                  createVNode(_component_a_tag, {
                                                    color: record.status === "active" ? "green" : "default"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(record.status || "pending"), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["color"])
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
                                        createVNode(_component_a_table, {
                                          size: "small",
                                          dataSource: teacherTableData.value,
                                          pagination: { pageSize: 6 },
                                          rowKey: (record) => record.id,
                                          customRow: teacherTableCustomRow
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_a_table_column, {
                                              key: "title",
                                              title: "Classroom"
                                            }, {
                                              default: withCtx(({ record }) => [
                                                createVNode("div", null, [
                                                  createVNode("strong", null, toDisplayString(record.title || record.code), 1),
                                                  createVNode("p", { class: "table-sub" }, "Code: " + toDisplayString(record.code), 1)
                                                ])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_table_column, {
                                              key: "dept",
                                              title: "Department"
                                            }, {
                                              default: withCtx(({ record }) => [
                                                createTextVNode(toDisplayString(record.departmentName), 1)
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_table_column, {
                                              key: "capacity",
                                              title: "Capacity",
                                              dataIndex: "capacity"
                                            }),
                                            createVNode(_component_a_table_column, {
                                              key: "enrollment",
                                              title: "Enrollment"
                                            }, {
                                              default: withCtx(({ record }) => [
                                                createTextVNode(toDisplayString(record.enrollmentCount ?? "—"), 1)
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_a_table_column, {
                                              key: "status",
                                              title: "Status"
                                            }, {
                                              default: withCtx(({ record }) => [
                                                createVNode(_component_a_tag, {
                                                  color: record.status === "active" ? "green" : "default"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(record.status || "pending"), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["color"])
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }, 8, ["dataSource", "rowKey"])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_card, { title: "Classrooms connected to Teach" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_table, {
                                        size: "small",
                                        dataSource: teacherTableData.value,
                                        pagination: { pageSize: 6 },
                                        rowKey: (record) => record.id,
                                        customRow: teacherTableCustomRow
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_a_table_column, {
                                            key: "title",
                                            title: "Classroom"
                                          }, {
                                            default: withCtx(({ record }) => [
                                              createVNode("div", null, [
                                                createVNode("strong", null, toDisplayString(record.title || record.code), 1),
                                                createVNode("p", { class: "table-sub" }, "Code: " + toDisplayString(record.code), 1)
                                              ])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_table_column, {
                                            key: "dept",
                                            title: "Department"
                                          }, {
                                            default: withCtx(({ record }) => [
                                              createTextVNode(toDisplayString(record.departmentName), 1)
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_table_column, {
                                            key: "capacity",
                                            title: "Capacity",
                                            dataIndex: "capacity"
                                          }),
                                          createVNode(_component_a_table_column, {
                                            key: "enrollment",
                                            title: "Enrollment"
                                          }, {
                                            default: withCtx(({ record }) => [
                                              createTextVNode(toDisplayString(record.enrollmentCount ?? "—"), 1)
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_a_table_column, {
                                            key: "status",
                                            title: "Status"
                                          }, {
                                            default: withCtx(({ record }) => [
                                              createVNode(_component_a_tag, {
                                                color: record.status === "active" ? "green" : "default"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(record.status || "pending"), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["dataSource", "rowKey"])
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
                            md: 10
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_card, { title: "Mission queue" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_list, {
                                        "data-source": teacherMissions.value,
                                        size: "small"
                                      }, {
                                        renderItem: withCtx(({ item }, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_list_item, {
                                              onClick: ($event) => item.classroom && openClassroomDrawer(item.classroom)
                                            }, {
                                              actions: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`<span class="metric-pill metric-pill--accent" data-v-80e44fc0${_scopeId7}>${ssrInterpolate(item.timeline)}</span>`);
                                                } else {
                                                  return [
                                                    createVNode("span", { class: "metric-pill metric-pill--accent" }, toDisplayString(item.timeline), 1)
                                                  ];
                                                }
                                              }),
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_a_list_item_meta, {
                                                    title: item.title,
                                                    description: item.description
                                                  }, null, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_a_list_item_meta, {
                                                      title: item.title,
                                                      description: item.description
                                                    }, null, 8, ["title", "description"])
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_list_item, {
                                                onClick: ($event) => item.classroom && openClassroomDrawer(item.classroom)
                                              }, {
                                                actions: withCtx(() => [
                                                  createVNode("span", { class: "metric-pill metric-pill--accent" }, toDisplayString(item.timeline), 1)
                                                ]),
                                                default: withCtx(() => [
                                                  createVNode(_component_a_list_item_meta, {
                                                    title: item.title,
                                                    description: item.description
                                                  }, null, 8, ["title", "description"])
                                                ]),
                                                _: 2
                                              }, 1032, ["onClick"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_a_divider, null, null, _parent6, _scopeId5));
                                      _push6(`<p class="card-subtitle" data-v-80e44fc0${_scopeId5}>Linked courses</p><ul class="course-list" data-v-80e44fc0${_scopeId5}><!--[-->`);
                                      ssrRenderList(highlightCourses.value, (course) => {
                                        _push6(`<li data-v-80e44fc0${_scopeId5}><p class="course-name" data-v-80e44fc0${_scopeId5}>${ssrInterpolate(course.title)}</p><p class="course-meta" data-v-80e44fc0${_scopeId5}>${ssrInterpolate(course.category || "Institution-linked")} · ${ssrInterpolate(course.difficulty || "Mixed level")}</p></li>`);
                                      });
                                      _push6(`<!--]--></ul>`);
                                    } else {
                                      return [
                                        createVNode(_component_a_list, {
                                          "data-source": teacherMissions.value,
                                          size: "small"
                                        }, {
                                          renderItem: withCtx(({ item }) => [
                                            createVNode(_component_a_list_item, {
                                              onClick: ($event) => item.classroom && openClassroomDrawer(item.classroom)
                                            }, {
                                              actions: withCtx(() => [
                                                createVNode("span", { class: "metric-pill metric-pill--accent" }, toDisplayString(item.timeline), 1)
                                              ]),
                                              default: withCtx(() => [
                                                createVNode(_component_a_list_item_meta, {
                                                  title: item.title,
                                                  description: item.description
                                                }, null, 8, ["title", "description"])
                                              ]),
                                              _: 2
                                            }, 1032, ["onClick"])
                                          ]),
                                          _: 1
                                        }, 8, ["data-source"]),
                                        createVNode(_component_a_divider),
                                        createVNode("p", { class: "card-subtitle" }, "Linked courses"),
                                        createVNode("ul", { class: "course-list" }, [
                                          (openBlock(true), createBlock(Fragment, null, renderList(highlightCourses.value, (course) => {
                                            return openBlock(), createBlock("li", {
                                              key: course.id
                                            }, [
                                              createVNode("p", { class: "course-name" }, toDisplayString(course.title), 1),
                                              createVNode("p", { class: "course-meta" }, toDisplayString(course.category || "Institution-linked") + " · " + toDisplayString(course.difficulty || "Mixed level"), 1)
                                            ]);
                                          }), 128))
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_card, { title: "Teaching day timeline" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_timeline, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<!--[-->`);
                                            ssrRenderList(teacherDayTimeline.value, (entry) => {
                                              _push7(ssrRenderComponent(_component_a_timeline_item, {
                                                key: entry.id,
                                                color: "blue"
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`<p class="timeline-title" data-v-80e44fc0${_scopeId7}>${ssrInterpolate(entry.title)}</p><p class="timeline-description" data-v-80e44fc0${_scopeId7}>${ssrInterpolate(entry.description)}</p><p class="timeline-metric" data-v-80e44fc0${_scopeId7}>${ssrInterpolate(entry.slot)}</p>`);
                                                  } else {
                                                    return [
                                                      createVNode("p", { class: "timeline-title" }, toDisplayString(entry.title), 1),
                                                      createVNode("p", { class: "timeline-description" }, toDisplayString(entry.description), 1),
                                                      createVNode("p", { class: "timeline-metric" }, toDisplayString(entry.slot), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                            });
                                            _push7(`<!--]-->`);
                                          } else {
                                            return [
                                              (openBlock(true), createBlock(Fragment, null, renderList(teacherDayTimeline.value, (entry) => {
                                                return openBlock(), createBlock(_component_a_timeline_item, {
                                                  key: entry.id,
                                                  color: "blue"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode("p", { class: "timeline-title" }, toDisplayString(entry.title), 1),
                                                    createVNode("p", { class: "timeline-description" }, toDisplayString(entry.description), 1),
                                                    createVNode("p", { class: "timeline-metric" }, toDisplayString(entry.slot), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024);
                                              }), 128))
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_a_timeline, null, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(teacherDayTimeline.value, (entry) => {
                                              return openBlock(), createBlock(_component_a_timeline_item, {
                                                key: entry.id,
                                                color: "blue"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode("p", { class: "timeline-title" }, toDisplayString(entry.title), 1),
                                                  createVNode("p", { class: "timeline-description" }, toDisplayString(entry.description), 1),
                                                  createVNode("p", { class: "timeline-metric" }, toDisplayString(entry.slot), 1)
                                                ]),
                                                _: 2
                                              }, 1024);
                                            }), 128))
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
                                  createVNode(_component_a_card, { title: "Mission queue" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_list, {
                                        "data-source": teacherMissions.value,
                                        size: "small"
                                      }, {
                                        renderItem: withCtx(({ item }) => [
                                          createVNode(_component_a_list_item, {
                                            onClick: ($event) => item.classroom && openClassroomDrawer(item.classroom)
                                          }, {
                                            actions: withCtx(() => [
                                              createVNode("span", { class: "metric-pill metric-pill--accent" }, toDisplayString(item.timeline), 1)
                                            ]),
                                            default: withCtx(() => [
                                              createVNode(_component_a_list_item_meta, {
                                                title: item.title,
                                                description: item.description
                                              }, null, 8, ["title", "description"])
                                            ]),
                                            _: 2
                                          }, 1032, ["onClick"])
                                        ]),
                                        _: 1
                                      }, 8, ["data-source"]),
                                      createVNode(_component_a_divider),
                                      createVNode("p", { class: "card-subtitle" }, "Linked courses"),
                                      createVNode("ul", { class: "course-list" }, [
                                        (openBlock(true), createBlock(Fragment, null, renderList(highlightCourses.value, (course) => {
                                          return openBlock(), createBlock("li", {
                                            key: course.id
                                          }, [
                                            createVNode("p", { class: "course-name" }, toDisplayString(course.title), 1),
                                            createVNode("p", { class: "course-meta" }, toDisplayString(course.category || "Institution-linked") + " · " + toDisplayString(course.difficulty || "Mixed level"), 1)
                                          ]);
                                        }), 128))
                                      ])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_card, { title: "Teaching day timeline" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_timeline, null, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(teacherDayTimeline.value, (entry) => {
                                            return openBlock(), createBlock(_component_a_timeline_item, {
                                              key: entry.id,
                                              color: "blue"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode("p", { class: "timeline-title" }, toDisplayString(entry.title), 1),
                                                createVNode("p", { class: "timeline-description" }, toDisplayString(entry.description), 1),
                                                createVNode("p", { class: "timeline-metric" }, toDisplayString(entry.slot), 1)
                                              ]),
                                              _: 2
                                            }, 1024);
                                          }), 128))
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
                            createVNode(_component_a_col, {
                              xs: 24,
                              md: 14
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, { title: "Classrooms connected to Teach" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_table, {
                                      size: "small",
                                      dataSource: teacherTableData.value,
                                      pagination: { pageSize: 6 },
                                      rowKey: (record) => record.id,
                                      customRow: teacherTableCustomRow
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_a_table_column, {
                                          key: "title",
                                          title: "Classroom"
                                        }, {
                                          default: withCtx(({ record }) => [
                                            createVNode("div", null, [
                                              createVNode("strong", null, toDisplayString(record.title || record.code), 1),
                                              createVNode("p", { class: "table-sub" }, "Code: " + toDisplayString(record.code), 1)
                                            ])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_table_column, {
                                          key: "dept",
                                          title: "Department"
                                        }, {
                                          default: withCtx(({ record }) => [
                                            createTextVNode(toDisplayString(record.departmentName), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_table_column, {
                                          key: "capacity",
                                          title: "Capacity",
                                          dataIndex: "capacity"
                                        }),
                                        createVNode(_component_a_table_column, {
                                          key: "enrollment",
                                          title: "Enrollment"
                                        }, {
                                          default: withCtx(({ record }) => [
                                            createTextVNode(toDisplayString(record.enrollmentCount ?? "—"), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_a_table_column, {
                                          key: "status",
                                          title: "Status"
                                        }, {
                                          default: withCtx(({ record }) => [
                                            createVNode(_component_a_tag, {
                                              color: record.status === "active" ? "green" : "default"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(record.status || "pending"), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["color"])
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }, 8, ["dataSource", "rowKey"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_col, {
                              xs: 24,
                              md: 10
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, { title: "Mission queue" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_list, {
                                      "data-source": teacherMissions.value,
                                      size: "small"
                                    }, {
                                      renderItem: withCtx(({ item }) => [
                                        createVNode(_component_a_list_item, {
                                          onClick: ($event) => item.classroom && openClassroomDrawer(item.classroom)
                                        }, {
                                          actions: withCtx(() => [
                                            createVNode("span", { class: "metric-pill metric-pill--accent" }, toDisplayString(item.timeline), 1)
                                          ]),
                                          default: withCtx(() => [
                                            createVNode(_component_a_list_item_meta, {
                                              title: item.title,
                                              description: item.description
                                            }, null, 8, ["title", "description"])
                                          ]),
                                          _: 2
                                        }, 1032, ["onClick"])
                                      ]),
                                      _: 1
                                    }, 8, ["data-source"]),
                                    createVNode(_component_a_divider),
                                    createVNode("p", { class: "card-subtitle" }, "Linked courses"),
                                    createVNode("ul", { class: "course-list" }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(highlightCourses.value, (course) => {
                                        return openBlock(), createBlock("li", {
                                          key: course.id
                                        }, [
                                          createVNode("p", { class: "course-name" }, toDisplayString(course.title), 1),
                                          createVNode("p", { class: "course-meta" }, toDisplayString(course.category || "Institution-linked") + " · " + toDisplayString(course.difficulty || "Mixed level"), 1)
                                        ]);
                                      }), 128))
                                    ])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_card, { title: "Teaching day timeline" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_timeline, null, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(teacherDayTimeline.value, (entry) => {
                                          return openBlock(), createBlock(_component_a_timeline_item, {
                                            key: entry.id,
                                            color: "blue"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("p", { class: "timeline-title" }, toDisplayString(entry.title), 1),
                                              createVNode("p", { class: "timeline-description" }, toDisplayString(entry.description), 1),
                                              createVNode("p", { class: "timeline-metric" }, toDisplayString(entry.slot), 1)
                                            ]),
                                            _: 2
                                          }, 1024);
                                        }), 128))
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
                      createVNode(_component_a_row, { gutter: 16 }, {
                        default: withCtx(() => [
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 14
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, { title: "Classrooms connected to Teach" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_table, {
                                    size: "small",
                                    dataSource: teacherTableData.value,
                                    pagination: { pageSize: 6 },
                                    rowKey: (record) => record.id,
                                    customRow: teacherTableCustomRow
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_table_column, {
                                        key: "title",
                                        title: "Classroom"
                                      }, {
                                        default: withCtx(({ record }) => [
                                          createVNode("div", null, [
                                            createVNode("strong", null, toDisplayString(record.title || record.code), 1),
                                            createVNode("p", { class: "table-sub" }, "Code: " + toDisplayString(record.code), 1)
                                          ])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_table_column, {
                                        key: "dept",
                                        title: "Department"
                                      }, {
                                        default: withCtx(({ record }) => [
                                          createTextVNode(toDisplayString(record.departmentName), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_table_column, {
                                        key: "capacity",
                                        title: "Capacity",
                                        dataIndex: "capacity"
                                      }),
                                      createVNode(_component_a_table_column, {
                                        key: "enrollment",
                                        title: "Enrollment"
                                      }, {
                                        default: withCtx(({ record }) => [
                                          createTextVNode(toDisplayString(record.enrollmentCount ?? "—"), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_a_table_column, {
                                        key: "status",
                                        title: "Status"
                                      }, {
                                        default: withCtx(({ record }) => [
                                          createVNode(_component_a_tag, {
                                            color: record.status === "active" ? "green" : "default"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(record.status || "pending"), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["color"])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["dataSource", "rowKey"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 10
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, { title: "Mission queue" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_list, {
                                    "data-source": teacherMissions.value,
                                    size: "small"
                                  }, {
                                    renderItem: withCtx(({ item }) => [
                                      createVNode(_component_a_list_item, {
                                        onClick: ($event) => item.classroom && openClassroomDrawer(item.classroom)
                                      }, {
                                        actions: withCtx(() => [
                                          createVNode("span", { class: "metric-pill metric-pill--accent" }, toDisplayString(item.timeline), 1)
                                        ]),
                                        default: withCtx(() => [
                                          createVNode(_component_a_list_item_meta, {
                                            title: item.title,
                                            description: item.description
                                          }, null, 8, ["title", "description"])
                                        ]),
                                        _: 2
                                      }, 1032, ["onClick"])
                                    ]),
                                    _: 1
                                  }, 8, ["data-source"]),
                                  createVNode(_component_a_divider),
                                  createVNode("p", { class: "card-subtitle" }, "Linked courses"),
                                  createVNode("ul", { class: "course-list" }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(highlightCourses.value, (course) => {
                                      return openBlock(), createBlock("li", {
                                        key: course.id
                                      }, [
                                        createVNode("p", { class: "course-name" }, toDisplayString(course.title), 1),
                                        createVNode("p", { class: "course-meta" }, toDisplayString(course.category || "Institution-linked") + " · " + toDisplayString(course.difficulty || "Mixed level"), 1)
                                      ]);
                                    }), 128))
                                  ])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_card, { title: "Teaching day timeline" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_timeline, null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(teacherDayTimeline.value, (entry) => {
                                        return openBlock(), createBlock(_component_a_timeline_item, {
                                          key: entry.id,
                                          color: "blue"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("p", { class: "timeline-title" }, toDisplayString(entry.title), 1),
                                            createVNode("p", { class: "timeline-description" }, toDisplayString(entry.description), 1),
                                            createVNode("p", { class: "timeline-metric" }, toDisplayString(entry.slot), 1)
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 128))
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
              _push2(ssrRenderComponent(_component_a_tab_pane, {
                key: "students",
                tab: "Student workspace"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_row, { gutter: 16 }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_col, {
                            xs: 24,
                            md: 10
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_card, {
                                  title: "Engagement snapshot",
                                  class: "student-card"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div class="progress-grid" data-v-80e44fc0${_scopeId5}><!--[-->`);
                                      ssrRenderList(studentEngagement.value, (progress) => {
                                        _push6(`<div class="progress-item" data-v-80e44fc0${_scopeId5}>`);
                                        _push6(ssrRenderComponent(_component_a_progress, {
                                          type: "circle",
                                          percent: progress.percent,
                                          width: 90
                                        }, null, _parent6, _scopeId5));
                                        _push6(`<p class="progress-label" data-v-80e44fc0${_scopeId5}>${ssrInterpolate(progress.label)}</p><p class="progress-helper" data-v-80e44fc0${_scopeId5}>${ssrInterpolate(progress.helper)}</p></div>`);
                                      });
                                      _push6(`<!--]--></div>`);
                                    } else {
                                      return [
                                        createVNode("div", { class: "progress-grid" }, [
                                          (openBlock(true), createBlock(Fragment, null, renderList(studentEngagement.value, (progress) => {
                                            return openBlock(), createBlock("div", {
                                              key: progress.id,
                                              class: "progress-item"
                                            }, [
                                              createVNode(_component_a_progress, {
                                                type: "circle",
                                                percent: progress.percent,
                                                width: 90
                                              }, null, 8, ["percent"]),
                                              createVNode("p", { class: "progress-label" }, toDisplayString(progress.label), 1),
                                              createVNode("p", { class: "progress-helper" }, toDisplayString(progress.helper), 1)
                                            ]);
                                          }), 128))
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_card, {
                                    title: "Engagement snapshot",
                                    class: "student-card"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "progress-grid" }, [
                                        (openBlock(true), createBlock(Fragment, null, renderList(studentEngagement.value, (progress) => {
                                          return openBlock(), createBlock("div", {
                                            key: progress.id,
                                            class: "progress-item"
                                          }, [
                                            createVNode(_component_a_progress, {
                                              type: "circle",
                                              percent: progress.percent,
                                              width: 90
                                            }, null, 8, ["percent"]),
                                            createVNode("p", { class: "progress-label" }, toDisplayString(progress.label), 1),
                                            createVNode("p", { class: "progress-helper" }, toDisplayString(progress.helper), 1)
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
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_a_col, {
                            xs: 24,
                            md: 14
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_a_card, { title: "Advisory feed" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_list, {
                                        "data-source": studentMoments.value,
                                        size: "small"
                                      }, {
                                        renderItem: withCtx(({ item }, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_list_item, null, {
                                              actions: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`<span class="metric-pill"${ssrRenderAttr("data-status", item.status)} data-v-80e44fc0${_scopeId7}>${ssrInterpolate(item.helper)}</span>`);
                                                } else {
                                                  return [
                                                    createVNode("span", {
                                                      class: "metric-pill",
                                                      "data-status": item.status
                                                    }, toDisplayString(item.helper), 9, ["data-status"])
                                                  ];
                                                }
                                              }),
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_a_list_item_meta, {
                                                    title: item.title,
                                                    description: item.description
                                                  }, null, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_a_list_item_meta, {
                                                      title: item.title,
                                                      description: item.description
                                                    }, null, 8, ["title", "description"])
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_list_item, null, {
                                                actions: withCtx(() => [
                                                  createVNode("span", {
                                                    class: "metric-pill",
                                                    "data-status": item.status
                                                  }, toDisplayString(item.helper), 9, ["data-status"])
                                                ]),
                                                default: withCtx(() => [
                                                  createVNode(_component_a_list_item_meta, {
                                                    title: item.title,
                                                    description: item.description
                                                  }, null, 8, ["title", "description"])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_a_divider, null, null, _parent6, _scopeId5));
                                      _push6(`<p class="card-subtitle" data-v-80e44fc0${_scopeId5}>Next important dates</p><ul class="important-dates" data-v-80e44fc0${_scopeId5}><!--[-->`);
                                      ssrRenderList(nextImportantDates.value, (event) => {
                                        _push6(`<li data-v-80e44fc0${_scopeId5}>`);
                                        _push6(ssrRenderComponent(unref(CalendarOutlined), null, null, _parent6, _scopeId5));
                                        _push6(`<div data-v-80e44fc0${_scopeId5}><p class="date-label" data-v-80e44fc0${_scopeId5}>${ssrInterpolate(event.title)}</p><p class="date-helper" data-v-80e44fc0${_scopeId5}>${ssrInterpolate(event.date)} · ${ssrInterpolate(event.description)}</p></div></li>`);
                                      });
                                      _push6(`<!--]--></ul>`);
                                    } else {
                                      return [
                                        createVNode(_component_a_list, {
                                          "data-source": studentMoments.value,
                                          size: "small"
                                        }, {
                                          renderItem: withCtx(({ item }) => [
                                            createVNode(_component_a_list_item, null, {
                                              actions: withCtx(() => [
                                                createVNode("span", {
                                                  class: "metric-pill",
                                                  "data-status": item.status
                                                }, toDisplayString(item.helper), 9, ["data-status"])
                                              ]),
                                              default: withCtx(() => [
                                                createVNode(_component_a_list_item_meta, {
                                                  title: item.title,
                                                  description: item.description
                                                }, null, 8, ["title", "description"])
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 1
                                        }, 8, ["data-source"]),
                                        createVNode(_component_a_divider),
                                        createVNode("p", { class: "card-subtitle" }, "Next important dates"),
                                        createVNode("ul", { class: "important-dates" }, [
                                          (openBlock(true), createBlock(Fragment, null, renderList(nextImportantDates.value, (event) => {
                                            return openBlock(), createBlock("li", {
                                              key: event.id
                                            }, [
                                              createVNode(unref(CalendarOutlined)),
                                              createVNode("div", null, [
                                                createVNode("p", { class: "date-label" }, toDisplayString(event.title), 1),
                                                createVNode("p", { class: "date-helper" }, toDisplayString(event.date) + " · " + toDisplayString(event.description), 1)
                                              ])
                                            ]);
                                          }), 128))
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_a_card, { title: "Action center" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_a_list, {
                                        "data-source": studentActionItems.value,
                                        size: "small",
                                        bordered: ""
                                      }, {
                                        renderItem: withCtx(({ item }, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_a_list_item, null, {
                                              actions: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`<span class="metric-pill"${ssrRenderAttr("data-status", item.status)} data-v-80e44fc0${_scopeId7}>${ssrInterpolate(item.helper)}</span>`);
                                                } else {
                                                  return [
                                                    createVNode("span", {
                                                      class: "metric-pill",
                                                      "data-status": item.status
                                                    }, toDisplayString(item.helper), 9, ["data-status"])
                                                  ];
                                                }
                                              }),
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_a_list_item_meta, {
                                                    title: item.label,
                                                    description: item.description
                                                  }, null, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_a_list_item_meta, {
                                                      title: item.label,
                                                      description: item.description
                                                    }, null, 8, ["title", "description"])
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_a_list_item, null, {
                                                actions: withCtx(() => [
                                                  createVNode("span", {
                                                    class: "metric-pill",
                                                    "data-status": item.status
                                                  }, toDisplayString(item.helper), 9, ["data-status"])
                                                ]),
                                                default: withCtx(() => [
                                                  createVNode(_component_a_list_item_meta, {
                                                    title: item.label,
                                                    description: item.description
                                                  }, null, 8, ["title", "description"])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_a_button, {
                                        block: "",
                                        type: "dashed",
                                        onClick: ($event) => handleMockAction("student-workflow")
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(` Record study reflection (mock) `);
                                          } else {
                                            return [
                                              createTextVNode(" Record study reflection (mock) ")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_a_list, {
                                          "data-source": studentActionItems.value,
                                          size: "small",
                                          bordered: ""
                                        }, {
                                          renderItem: withCtx(({ item }) => [
                                            createVNode(_component_a_list_item, null, {
                                              actions: withCtx(() => [
                                                createVNode("span", {
                                                  class: "metric-pill",
                                                  "data-status": item.status
                                                }, toDisplayString(item.helper), 9, ["data-status"])
                                              ]),
                                              default: withCtx(() => [
                                                createVNode(_component_a_list_item_meta, {
                                                  title: item.label,
                                                  description: item.description
                                                }, null, 8, ["title", "description"])
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 1
                                        }, 8, ["data-source"]),
                                        createVNode(_component_a_button, {
                                          block: "",
                                          type: "dashed",
                                          onClick: ($event) => handleMockAction("student-workflow")
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Record study reflection (mock) ")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_a_card, { title: "Advisory feed" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_list, {
                                        "data-source": studentMoments.value,
                                        size: "small"
                                      }, {
                                        renderItem: withCtx(({ item }) => [
                                          createVNode(_component_a_list_item, null, {
                                            actions: withCtx(() => [
                                              createVNode("span", {
                                                class: "metric-pill",
                                                "data-status": item.status
                                              }, toDisplayString(item.helper), 9, ["data-status"])
                                            ]),
                                            default: withCtx(() => [
                                              createVNode(_component_a_list_item_meta, {
                                                title: item.title,
                                                description: item.description
                                              }, null, 8, ["title", "description"])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 1
                                      }, 8, ["data-source"]),
                                      createVNode(_component_a_divider),
                                      createVNode("p", { class: "card-subtitle" }, "Next important dates"),
                                      createVNode("ul", { class: "important-dates" }, [
                                        (openBlock(true), createBlock(Fragment, null, renderList(nextImportantDates.value, (event) => {
                                          return openBlock(), createBlock("li", {
                                            key: event.id
                                          }, [
                                            createVNode(unref(CalendarOutlined)),
                                            createVNode("div", null, [
                                              createVNode("p", { class: "date-label" }, toDisplayString(event.title), 1),
                                              createVNode("p", { class: "date-helper" }, toDisplayString(event.date) + " · " + toDisplayString(event.description), 1)
                                            ])
                                          ]);
                                        }), 128))
                                      ])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_card, { title: "Action center" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_list, {
                                        "data-source": studentActionItems.value,
                                        size: "small",
                                        bordered: ""
                                      }, {
                                        renderItem: withCtx(({ item }) => [
                                          createVNode(_component_a_list_item, null, {
                                            actions: withCtx(() => [
                                              createVNode("span", {
                                                class: "metric-pill",
                                                "data-status": item.status
                                              }, toDisplayString(item.helper), 9, ["data-status"])
                                            ]),
                                            default: withCtx(() => [
                                              createVNode(_component_a_list_item_meta, {
                                                title: item.label,
                                                description: item.description
                                              }, null, 8, ["title", "description"])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 1
                                      }, 8, ["data-source"]),
                                      createVNode(_component_a_button, {
                                        block: "",
                                        type: "dashed",
                                        onClick: ($event) => handleMockAction("student-workflow")
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Record study reflection (mock) ")
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
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_col, {
                              xs: 24,
                              md: 10
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_card, {
                                  title: "Engagement snapshot",
                                  class: "student-card"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "progress-grid" }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(studentEngagement.value, (progress) => {
                                        return openBlock(), createBlock("div", {
                                          key: progress.id,
                                          class: "progress-item"
                                        }, [
                                          createVNode(_component_a_progress, {
                                            type: "circle",
                                            percent: progress.percent,
                                            width: 90
                                          }, null, 8, ["percent"]),
                                          createVNode("p", { class: "progress-label" }, toDisplayString(progress.label), 1),
                                          createVNode("p", { class: "progress-helper" }, toDisplayString(progress.helper), 1)
                                        ]);
                                      }), 128))
                                    ])
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
                                createVNode(_component_a_card, { title: "Advisory feed" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_list, {
                                      "data-source": studentMoments.value,
                                      size: "small"
                                    }, {
                                      renderItem: withCtx(({ item }) => [
                                        createVNode(_component_a_list_item, null, {
                                          actions: withCtx(() => [
                                            createVNode("span", {
                                              class: "metric-pill",
                                              "data-status": item.status
                                            }, toDisplayString(item.helper), 9, ["data-status"])
                                          ]),
                                          default: withCtx(() => [
                                            createVNode(_component_a_list_item_meta, {
                                              title: item.title,
                                              description: item.description
                                            }, null, 8, ["title", "description"])
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 1
                                    }, 8, ["data-source"]),
                                    createVNode(_component_a_divider),
                                    createVNode("p", { class: "card-subtitle" }, "Next important dates"),
                                    createVNode("ul", { class: "important-dates" }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(nextImportantDates.value, (event) => {
                                        return openBlock(), createBlock("li", {
                                          key: event.id
                                        }, [
                                          createVNode(unref(CalendarOutlined)),
                                          createVNode("div", null, [
                                            createVNode("p", { class: "date-label" }, toDisplayString(event.title), 1),
                                            createVNode("p", { class: "date-helper" }, toDisplayString(event.date) + " · " + toDisplayString(event.description), 1)
                                          ])
                                        ]);
                                      }), 128))
                                    ])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_card, { title: "Action center" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_list, {
                                      "data-source": studentActionItems.value,
                                      size: "small",
                                      bordered: ""
                                    }, {
                                      renderItem: withCtx(({ item }) => [
                                        createVNode(_component_a_list_item, null, {
                                          actions: withCtx(() => [
                                            createVNode("span", {
                                              class: "metric-pill",
                                              "data-status": item.status
                                            }, toDisplayString(item.helper), 9, ["data-status"])
                                          ]),
                                          default: withCtx(() => [
                                            createVNode(_component_a_list_item_meta, {
                                              title: item.label,
                                              description: item.description
                                            }, null, 8, ["title", "description"])
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 1
                                    }, 8, ["data-source"]),
                                    createVNode(_component_a_button, {
                                      block: "",
                                      type: "dashed",
                                      onClick: ($event) => handleMockAction("student-workflow")
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Record study reflection (mock) ")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])
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
                      createVNode(_component_a_row, { gutter: 16 }, {
                        default: withCtx(() => [
                          createVNode(_component_a_col, {
                            xs: 24,
                            md: 10
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_a_card, {
                                title: "Engagement snapshot",
                                class: "student-card"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "progress-grid" }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(studentEngagement.value, (progress) => {
                                      return openBlock(), createBlock("div", {
                                        key: progress.id,
                                        class: "progress-item"
                                      }, [
                                        createVNode(_component_a_progress, {
                                          type: "circle",
                                          percent: progress.percent,
                                          width: 90
                                        }, null, 8, ["percent"]),
                                        createVNode("p", { class: "progress-label" }, toDisplayString(progress.label), 1),
                                        createVNode("p", { class: "progress-helper" }, toDisplayString(progress.helper), 1)
                                      ]);
                                    }), 128))
                                  ])
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
                              createVNode(_component_a_card, { title: "Advisory feed" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_list, {
                                    "data-source": studentMoments.value,
                                    size: "small"
                                  }, {
                                    renderItem: withCtx(({ item }) => [
                                      createVNode(_component_a_list_item, null, {
                                        actions: withCtx(() => [
                                          createVNode("span", {
                                            class: "metric-pill",
                                            "data-status": item.status
                                          }, toDisplayString(item.helper), 9, ["data-status"])
                                        ]),
                                        default: withCtx(() => [
                                          createVNode(_component_a_list_item_meta, {
                                            title: item.title,
                                            description: item.description
                                          }, null, 8, ["title", "description"])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 1
                                  }, 8, ["data-source"]),
                                  createVNode(_component_a_divider),
                                  createVNode("p", { class: "card-subtitle" }, "Next important dates"),
                                  createVNode("ul", { class: "important-dates" }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(nextImportantDates.value, (event) => {
                                      return openBlock(), createBlock("li", {
                                        key: event.id
                                      }, [
                                        createVNode(unref(CalendarOutlined)),
                                        createVNode("div", null, [
                                          createVNode("p", { class: "date-label" }, toDisplayString(event.title), 1),
                                          createVNode("p", { class: "date-helper" }, toDisplayString(event.date) + " · " + toDisplayString(event.description), 1)
                                        ])
                                      ]);
                                    }), 128))
                                  ])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_card, { title: "Action center" }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_list, {
                                    "data-source": studentActionItems.value,
                                    size: "small",
                                    bordered: ""
                                  }, {
                                    renderItem: withCtx(({ item }) => [
                                      createVNode(_component_a_list_item, null, {
                                        actions: withCtx(() => [
                                          createVNode("span", {
                                            class: "metric-pill",
                                            "data-status": item.status
                                          }, toDisplayString(item.helper), 9, ["data-status"])
                                        ]),
                                        default: withCtx(() => [
                                          createVNode(_component_a_list_item_meta, {
                                            title: item.label,
                                            description: item.description
                                          }, null, 8, ["title", "description"])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 1
                                  }, 8, ["data-source"]),
                                  createVNode(_component_a_button, {
                                    block: "",
                                    type: "dashed",
                                    onClick: ($event) => handleMockAction("student-workflow")
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Record study reflection (mock) ")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"])
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
            } else {
              return [
                createVNode(_component_a_tab_pane, {
                  key: "overview",
                  tab: "Unified overview"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "lanes-grid" }, [
                      createVNode("article", {
                        class: ["role-lane", { "role-lane--highlight": isAdminView.value }]
                      }, [
                        createVNode("header", null, [
                          createVNode("div", null, [
                            createVNode("p", { class: "role-lane__eyebrow" }, "Administrators"),
                            createVNode("h3", null, "Operational guardrails")
                          ]),
                          createVNode("span", { class: "role-lane__badge" }, toDisplayString(adminMembers.value.length) + " leads", 1)
                        ]),
                        createVNode(_component_a_list, {
                          "data-source": adminSnapshots.value,
                          split: false
                        }, {
                          renderItem: withCtx(({ item }) => [
                            createVNode(_component_a_list_item, null, {
                              actions: withCtx(() => [
                                createVNode("span", {
                                  class: "metric-pill",
                                  "data-status": item.status
                                }, toDisplayString(item.metric), 9, ["data-status"])
                              ]),
                              default: withCtx(() => [
                                createVNode(_component_a_list_item_meta, {
                                  title: item.label,
                                  description: item.detail
                                }, null, 8, ["title", "description"])
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 1
                        }, 8, ["data-source"]),
                        createVNode("footer", null, [
                          createVNode(_component_a_button, {
                            type: "link",
                            onClick: ($event) => focusTab.value = "administrators"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Open administrator workspace ")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])
                      ], 2),
                      createVNode("article", {
                        class: ["role-lane", { "role-lane--highlight": isTeacherView.value }]
                      }, [
                        createVNode("header", null, [
                          createVNode("div", null, [
                            createVNode("p", { class: "role-lane__eyebrow" }, "Teachers"),
                            createVNode("h3", null, "Instruction playbooks")
                          ]),
                          createVNode("span", { class: "role-lane__badge" }, toDisplayString(teacherMembers.value.length) + " faculty", 1)
                        ]),
                        createVNode(_component_a_list, {
                          "data-source": teacherMissions.value,
                          split: false
                        }, {
                          renderItem: withCtx(({ item }) => [
                            createVNode(_component_a_list_item, {
                              onClick: ($event) => item.classroom && openClassroomDrawer(item.classroom)
                            }, {
                              actions: withCtx(() => [
                                createVNode("span", { class: "metric-pill metric-pill--accent" }, toDisplayString(item.timeline), 1)
                              ]),
                              default: withCtx(() => [
                                createVNode(_component_a_list_item_meta, {
                                  title: item.title,
                                  description: item.description
                                }, null, 8, ["title", "description"])
                              ]),
                              _: 2
                            }, 1032, ["onClick"])
                          ]),
                          _: 1
                        }, 8, ["data-source"]),
                        createVNode("footer", null, [
                          createVNode(_component_a_button, {
                            type: "link",
                            onClick: ($event) => focusTab.value = "teachers"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Open teaching workspace ")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])
                      ], 2),
                      createVNode("article", {
                        class: ["role-lane", { "role-lane--highlight": isStudentView.value }]
                      }, [
                        createVNode("header", null, [
                          createVNode("div", null, [
                            createVNode("p", { class: "role-lane__eyebrow" }, "Students"),
                            createVNode("h3", null, "Learning guidance")
                          ]),
                          createVNode("span", { class: "role-lane__badge" }, toDisplayString(studentMembers.value.length) + " learners", 1)
                        ]),
                        createVNode(_component_a_list, {
                          "data-source": studentMoments.value,
                          split: false
                        }, {
                          renderItem: withCtx(({ item }) => [
                            createVNode(_component_a_list_item, null, {
                              actions: withCtx(() => [
                                createVNode("span", {
                                  class: "metric-pill",
                                  "data-status": item.status
                                }, toDisplayString(item.helper), 9, ["data-status"])
                              ]),
                              default: withCtx(() => [
                                createVNode(_component_a_list_item_meta, {
                                  title: item.title,
                                  description: item.description
                                }, null, 8, ["title", "description"])
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 1
                        }, 8, ["data-source"]),
                        createVNode("footer", null, [
                          createVNode(_component_a_button, {
                            type: "link",
                            onClick: ($event) => focusTab.value = "students"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Open learner workspace ")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])
                      ], 2)
                    ])
                  ]),
                  _: 1
                }),
                createVNode(_component_a_tab_pane, {
                  key: "administrators",
                  tab: "Administrator cockpit"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_a_row, { gutter: 16 }, {
                      default: withCtx(() => [
                        createVNode(_component_a_col, {
                          xs: 24,
                          md: 10
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              title: "Governance metrics",
                              class: "admin-card"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_timeline, null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(adminSnapshots.value, (item) => {
                                      return openBlock(), createBlock(_component_a_timeline_item, {
                                        key: item.id,
                                        color: item.status === "good" ? "green" : "orange"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("p", { class: "timeline-title" }, toDisplayString(item.label), 1),
                                          createVNode("p", { class: "timeline-description" }, toDisplayString(item.detail), 1),
                                          createVNode("p", { class: "timeline-metric" }, toDisplayString(item.metric), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["color"]);
                                    }), 128))
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_button, {
                                  block: "",
                                  type: "dashed",
                                  onClick: ($event) => handleMockAction("compliance")
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(SafetyCertificateOutlined)),
                                    createTextVNode(" Run compliance pulse (mock) ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_card, {
                              title: "Strategic queue",
                              class: "admin-card"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_list, {
                                  "data-source": adminWorkflowQueue.value,
                                  size: "small",
                                  bordered: ""
                                }, {
                                  renderItem: withCtx(({ item }) => [
                                    createVNode(_component_a_list_item, null, {
                                      actions: withCtx(() => [
                                        createVNode("span", { class: "metric-pill metric-pill--accent" }, toDisplayString(item.owner), 1)
                                      ]),
                                      default: withCtx(() => [
                                        createVNode(_component_a_list_item_meta, {
                                          title: item.label,
                                          description: item.description
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
                        }),
                        createVNode(_component_a_col, {
                          xs: 24,
                          md: 14
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              title: "Department operating picture",
                              class: "admin-card"
                            }, {
                              extra: withCtx(() => [
                                createVNode(_component_a_space, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, {
                                      type: "primary",
                                      onClick: ($event) => openAdminModal("department")
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Create department ")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"]),
                                    createVNode(_component_a_button, {
                                      onClick: ($event) => openAdminModal("classroom")
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Create classroom ")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              default: withCtx(() => [
                                createVNode(_component_a_table, {
                                  size: "small",
                                  dataSource: institutionDepartments.value,
                                  pagination: { pageSize: 6 },
                                  rowKey: "id"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_table_column, {
                                      key: "name",
                                      title: "Department",
                                      dataIndex: "name"
                                    }),
                                    createVNode(_component_a_table_column, {
                                      key: "slug",
                                      title: "Slug",
                                      dataIndex: "slug"
                                    }),
                                    createVNode(_component_a_table_column, {
                                      key: "classrooms",
                                      title: "Classrooms"
                                    }, {
                                      default: withCtx(({ record }) => [
                                        createTextVNode(toDisplayString(departmentClassroomCount.value[record.id] || 0), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_table_column, {
                                      key: "status",
                                      title: "Status"
                                    }, {
                                      default: withCtx(({ record }) => [
                                        createVNode(_component_a_tag, {
                                          color: record.active !== false ? "green" : "default"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(record.active !== false ? "Active" : "Inactive"), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["color"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["dataSource"])
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
                  key: "teachers",
                  tab: "Teacher workspace"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_a_row, { gutter: 16 }, {
                      default: withCtx(() => [
                        createVNode(_component_a_col, {
                          xs: 24,
                          md: 14
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, { title: "Classrooms connected to Teach" }, {
                              default: withCtx(() => [
                                createVNode(_component_a_table, {
                                  size: "small",
                                  dataSource: teacherTableData.value,
                                  pagination: { pageSize: 6 },
                                  rowKey: (record) => record.id,
                                  customRow: teacherTableCustomRow
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_table_column, {
                                      key: "title",
                                      title: "Classroom"
                                    }, {
                                      default: withCtx(({ record }) => [
                                        createVNode("div", null, [
                                          createVNode("strong", null, toDisplayString(record.title || record.code), 1),
                                          createVNode("p", { class: "table-sub" }, "Code: " + toDisplayString(record.code), 1)
                                        ])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_table_column, {
                                      key: "dept",
                                      title: "Department"
                                    }, {
                                      default: withCtx(({ record }) => [
                                        createTextVNode(toDisplayString(record.departmentName), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_table_column, {
                                      key: "capacity",
                                      title: "Capacity",
                                      dataIndex: "capacity"
                                    }),
                                    createVNode(_component_a_table_column, {
                                      key: "enrollment",
                                      title: "Enrollment"
                                    }, {
                                      default: withCtx(({ record }) => [
                                        createTextVNode(toDisplayString(record.enrollmentCount ?? "—"), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_a_table_column, {
                                      key: "status",
                                      title: "Status"
                                    }, {
                                      default: withCtx(({ record }) => [
                                        createVNode(_component_a_tag, {
                                          color: record.status === "active" ? "green" : "default"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(record.status || "pending"), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["color"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["dataSource", "rowKey"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_col, {
                          xs: 24,
                          md: 10
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, { title: "Mission queue" }, {
                              default: withCtx(() => [
                                createVNode(_component_a_list, {
                                  "data-source": teacherMissions.value,
                                  size: "small"
                                }, {
                                  renderItem: withCtx(({ item }) => [
                                    createVNode(_component_a_list_item, {
                                      onClick: ($event) => item.classroom && openClassroomDrawer(item.classroom)
                                    }, {
                                      actions: withCtx(() => [
                                        createVNode("span", { class: "metric-pill metric-pill--accent" }, toDisplayString(item.timeline), 1)
                                      ]),
                                      default: withCtx(() => [
                                        createVNode(_component_a_list_item_meta, {
                                          title: item.title,
                                          description: item.description
                                        }, null, 8, ["title", "description"])
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick"])
                                  ]),
                                  _: 1
                                }, 8, ["data-source"]),
                                createVNode(_component_a_divider),
                                createVNode("p", { class: "card-subtitle" }, "Linked courses"),
                                createVNode("ul", { class: "course-list" }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(highlightCourses.value, (course) => {
                                    return openBlock(), createBlock("li", {
                                      key: course.id
                                    }, [
                                      createVNode("p", { class: "course-name" }, toDisplayString(course.title), 1),
                                      createVNode("p", { class: "course-meta" }, toDisplayString(course.category || "Institution-linked") + " · " + toDisplayString(course.difficulty || "Mixed level"), 1)
                                    ]);
                                  }), 128))
                                ])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_card, { title: "Teaching day timeline" }, {
                              default: withCtx(() => [
                                createVNode(_component_a_timeline, null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(teacherDayTimeline.value, (entry) => {
                                      return openBlock(), createBlock(_component_a_timeline_item, {
                                        key: entry.id,
                                        color: "blue"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("p", { class: "timeline-title" }, toDisplayString(entry.title), 1),
                                          createVNode("p", { class: "timeline-description" }, toDisplayString(entry.description), 1),
                                          createVNode("p", { class: "timeline-metric" }, toDisplayString(entry.slot), 1)
                                        ]),
                                        _: 2
                                      }, 1024);
                                    }), 128))
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
                  key: "students",
                  tab: "Student workspace"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_a_row, { gutter: 16 }, {
                      default: withCtx(() => [
                        createVNode(_component_a_col, {
                          xs: 24,
                          md: 10
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_a_card, {
                              title: "Engagement snapshot",
                              class: "student-card"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "progress-grid" }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(studentEngagement.value, (progress) => {
                                    return openBlock(), createBlock("div", {
                                      key: progress.id,
                                      class: "progress-item"
                                    }, [
                                      createVNode(_component_a_progress, {
                                        type: "circle",
                                        percent: progress.percent,
                                        width: 90
                                      }, null, 8, ["percent"]),
                                      createVNode("p", { class: "progress-label" }, toDisplayString(progress.label), 1),
                                      createVNode("p", { class: "progress-helper" }, toDisplayString(progress.helper), 1)
                                    ]);
                                  }), 128))
                                ])
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
                            createVNode(_component_a_card, { title: "Advisory feed" }, {
                              default: withCtx(() => [
                                createVNode(_component_a_list, {
                                  "data-source": studentMoments.value,
                                  size: "small"
                                }, {
                                  renderItem: withCtx(({ item }) => [
                                    createVNode(_component_a_list_item, null, {
                                      actions: withCtx(() => [
                                        createVNode("span", {
                                          class: "metric-pill",
                                          "data-status": item.status
                                        }, toDisplayString(item.helper), 9, ["data-status"])
                                      ]),
                                      default: withCtx(() => [
                                        createVNode(_component_a_list_item_meta, {
                                          title: item.title,
                                          description: item.description
                                        }, null, 8, ["title", "description"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 1
                                }, 8, ["data-source"]),
                                createVNode(_component_a_divider),
                                createVNode("p", { class: "card-subtitle" }, "Next important dates"),
                                createVNode("ul", { class: "important-dates" }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(nextImportantDates.value, (event) => {
                                    return openBlock(), createBlock("li", {
                                      key: event.id
                                    }, [
                                      createVNode(unref(CalendarOutlined)),
                                      createVNode("div", null, [
                                        createVNode("p", { class: "date-label" }, toDisplayString(event.title), 1),
                                        createVNode("p", { class: "date-helper" }, toDisplayString(event.date) + " · " + toDisplayString(event.description), 1)
                                      ])
                                    ]);
                                  }), 128))
                                ])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_card, { title: "Action center" }, {
                              default: withCtx(() => [
                                createVNode(_component_a_list, {
                                  "data-source": studentActionItems.value,
                                  size: "small",
                                  bordered: ""
                                }, {
                                  renderItem: withCtx(({ item }) => [
                                    createVNode(_component_a_list_item, null, {
                                      actions: withCtx(() => [
                                        createVNode("span", {
                                          class: "metric-pill",
                                          "data-status": item.status
                                        }, toDisplayString(item.helper), 9, ["data-status"])
                                      ]),
                                      default: withCtx(() => [
                                        createVNode(_component_a_list_item_meta, {
                                          title: item.label,
                                          description: item.description
                                        }, null, 8, ["title", "description"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 1
                                }, 8, ["data-source"]),
                                createVNode(_component_a_button, {
                                  block: "",
                                  type: "dashed",
                                  onClick: ($event) => handleMockAction("student-workflow")
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Record study reflection (mock) ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])
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
        }, _parent));
        _push(`</section><section class="ops-grid" aria-label="Operations" data-v-80e44fc0>`);
        _push(ssrRenderComponent(_component_a_card, { title: "Operational timeline" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_a_timeline, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<!--[-->`);
                    ssrRenderList(opsTimeline.value, (event) => {
                      _push3(ssrRenderComponent(_component_a_timeline_item, {
                        key: event.id,
                        color: event.color
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<p class="timeline-title" data-v-80e44fc0${_scopeId3}>${ssrInterpolate(event.title)}</p><p class="timeline-description" data-v-80e44fc0${_scopeId3}>${ssrInterpolate(event.description)}</p><p class="timeline-meta" data-v-80e44fc0${_scopeId3}>${ssrInterpolate(event.date)}</p>`);
                          } else {
                            return [
                              createVNode("p", { class: "timeline-title" }, toDisplayString(event.title), 1),
                              createVNode("p", { class: "timeline-description" }, toDisplayString(event.description), 1),
                              createVNode("p", { class: "timeline-meta" }, toDisplayString(event.date), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]-->`);
                  } else {
                    return [
                      (openBlock(true), createBlock(Fragment, null, renderList(opsTimeline.value, (event) => {
                        return openBlock(), createBlock(_component_a_timeline_item, {
                          key: event.id,
                          color: event.color
                        }, {
                          default: withCtx(() => [
                            createVNode("p", { class: "timeline-title" }, toDisplayString(event.title), 1),
                            createVNode("p", { class: "timeline-description" }, toDisplayString(event.description), 1),
                            createVNode("p", { class: "timeline-meta" }, toDisplayString(event.date), 1)
                          ]),
                          _: 2
                        }, 1032, ["color"]);
                      }), 128))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_a_timeline, null, {
                  default: withCtx(() => [
                    (openBlock(true), createBlock(Fragment, null, renderList(opsTimeline.value, (event) => {
                      return openBlock(), createBlock(_component_a_timeline_item, {
                        key: event.id,
                        color: event.color
                      }, {
                        default: withCtx(() => [
                          createVNode("p", { class: "timeline-title" }, toDisplayString(event.title), 1),
                          createVNode("p", { class: "timeline-description" }, toDisplayString(event.description), 1),
                          createVNode("p", { class: "timeline-meta" }, toDisplayString(event.date), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"]);
                    }), 128))
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_a_card, { title: "Membership mix" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="membership-grid" data-v-80e44fc0${_scopeId}><div data-v-80e44fc0${_scopeId}><p class="membership-label" data-v-80e44fc0${_scopeId}>Administrators</p><p class="membership-value" data-v-80e44fc0${_scopeId}>${ssrInterpolate(adminMembers.value.length)}</p><p class="membership-helper" data-v-80e44fc0${_scopeId}>Core governance</p></div><div data-v-80e44fc0${_scopeId}><p class="membership-label" data-v-80e44fc0${_scopeId}>Teachers</p><p class="membership-value" data-v-80e44fc0${_scopeId}>${ssrInterpolate(teacherMembers.value.length)}</p><p class="membership-helper" data-v-80e44fc0${_scopeId}>Linked to classrooms</p></div><div data-v-80e44fc0${_scopeId}><p class="membership-label" data-v-80e44fc0${_scopeId}>Students</p><p class="membership-value" data-v-80e44fc0${_scopeId}>${ssrInterpolate(studentMembers.value.length)}</p><p class="membership-helper" data-v-80e44fc0${_scopeId}>Active enrollments</p></div></div>`);
              _push2(ssrRenderComponent(_component_a_progress, {
                percent: capacityUsage.value,
                status: "active"
              }, null, _parent2, _scopeId));
              _push2(`<p class="membership-footnote" data-v-80e44fc0${_scopeId}>Capacity utilization across classrooms</p>`);
            } else {
              return [
                createVNode("div", { class: "membership-grid" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "membership-label" }, "Administrators"),
                    createVNode("p", { class: "membership-value" }, toDisplayString(adminMembers.value.length), 1),
                    createVNode("p", { class: "membership-helper" }, "Core governance")
                  ]),
                  createVNode("div", null, [
                    createVNode("p", { class: "membership-label" }, "Teachers"),
                    createVNode("p", { class: "membership-value" }, toDisplayString(teacherMembers.value.length), 1),
                    createVNode("p", { class: "membership-helper" }, "Linked to classrooms")
                  ]),
                  createVNode("div", null, [
                    createVNode("p", { class: "membership-label" }, "Students"),
                    createVNode("p", { class: "membership-value" }, toDisplayString(studentMembers.value.length), 1),
                    createVNode("p", { class: "membership-helper" }, "Active enrollments")
                  ])
                ]),
                createVNode(_component_a_progress, {
                  percent: capacityUsage.value,
                  status: "active"
                }, null, 8, ["percent"]),
                createVNode("p", { class: "membership-footnote" }, "Capacity utilization across classrooms")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_a_card, { title: "Course initiatives" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (highlightCourses.value.length === 0) {
                _push2(ssrRenderComponent(_component_a_empty, { description: "No linked courses yet" }, null, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(_component_a_list, {
                  "data-source": highlightCourses.value,
                  size: "small"
                }, {
                  renderItem: withCtx(({ item }, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_a_list_item, null, {
                        actions: withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<span data-v-80e44fc0${_scopeId3}>${ssrInterpolate(item.difficulty || "Balanced")}</span>`);
                          } else {
                            return [
                              createVNode("span", null, toDisplayString(item.difficulty || "Balanced"), 1)
                            ];
                          }
                        }),
                        default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_a_list_item_meta, {
                              title: item.title,
                              description: item.category
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_a_list_item_meta, {
                                title: item.title,
                                description: item.category
                              }, null, 8, ["title", "description"])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_a_list_item, null, {
                          actions: withCtx(() => [
                            createVNode("span", null, toDisplayString(item.difficulty || "Balanced"), 1)
                          ]),
                          default: withCtx(() => [
                            createVNode(_component_a_list_item_meta, {
                              title: item.title,
                              description: item.category
                            }, null, 8, ["title", "description"])
                          ]),
                          _: 2
                        }, 1024)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              }
              _push2(ssrRenderComponent(_component_a_button, {
                block: "",
                type: "dashed",
                onClick: ($event) => handleMockAction("courses")
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Sync with Teach-internal (mock) `);
                  } else {
                    return [
                      createTextVNode(" Sync with Teach-internal (mock) ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                highlightCourses.value.length === 0 ? (openBlock(), createBlock(_component_a_empty, {
                  key: 0,
                  description: "No linked courses yet"
                })) : (openBlock(), createBlock(_component_a_list, {
                  key: 1,
                  "data-source": highlightCourses.value,
                  size: "small"
                }, {
                  renderItem: withCtx(({ item }) => [
                    createVNode(_component_a_list_item, null, {
                      actions: withCtx(() => [
                        createVNode("span", null, toDisplayString(item.difficulty || "Balanced"), 1)
                      ]),
                      default: withCtx(() => [
                        createVNode(_component_a_list_item_meta, {
                          title: item.title,
                          description: item.category
                        }, null, 8, ["title", "description"])
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 1
                }, 8, ["data-source"])),
                createVNode(_component_a_button, {
                  block: "",
                  type: "dashed",
                  onClick: ($event) => handleMockAction("courses")
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Sync with Teach-internal (mock) ")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</section>`);
        _push(ssrRenderComponent(_component_a_drawer, {
          open: classroomDrawerOpen.value,
          "onUpdate:open": ($event) => classroomDrawerOpen.value = $event,
          title: selectedClassroom.value?.title || selectedClassroom.value?.code || "Classroom",
          placement: "right",
          width: "420"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (selectedClassroom.value) {
                _push2(`<!--[--><p class="drawer-meta" data-v-80e44fc0${_scopeId}>${ssrInterpolate(selectedClassroom.value.code)} · ${ssrInterpolate(selectedClassroom.value.status || "pending")}</p>`);
                _push2(ssrRenderComponent(_component_a_descriptions, {
                  bordered: "",
                  column: "1",
                  size: "small"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_a_descriptions_item, { label: "Department" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(deptById.value[selectedClassroom.value.departmentId || ""]?.name || "Unassigned")}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(deptById.value[selectedClassroom.value.departmentId || ""]?.name || "Unassigned"), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(_component_a_descriptions_item, { label: "Capacity" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(selectedClassroom.value.capacity ?? "—")}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(selectedClassroom.value.capacity ?? "—"), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(_component_a_descriptions_item, { label: "Enrollment" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(selectedClassroom.value.enrollmentCount ?? "—")}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(selectedClassroom.value.enrollmentCount ?? "—"), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_a_descriptions_item, { label: "Department" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(deptById.value[selectedClassroom.value.departmentId || ""]?.name || "Unassigned"), 1)
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_descriptions_item, { label: "Capacity" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(selectedClassroom.value.capacity ?? "—"), 1)
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_descriptions_item, { label: "Enrollment" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(selectedClassroom.value.enrollmentCount ?? "—"), 1)
                          ]),
                          _: 1
                        })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`<div class="drawer-section" data-v-80e44fc0${_scopeId}><p class="drawer-section__title" data-v-80e44fc0${_scopeId}>Recommended next steps</p><ul data-v-80e44fc0${_scopeId}><!--[-->`);
                ssrRenderList(classroomRecommendations.value, (action) => {
                  _push2(`<li data-v-80e44fc0${_scopeId}><p class="action-label" data-v-80e44fc0${_scopeId}>${ssrInterpolate(action.label)}</p><p class="action-helper" data-v-80e44fc0${_scopeId}>${ssrInterpolate(action.detail)}</p></li>`);
                });
                _push2(`<!--]--></ul></div><!--]-->`);
              } else {
                _push2(ssrRenderComponent(_component_a_empty, { description: "Select a classroom from the teaching table" }, null, _parent2, _scopeId));
              }
            } else {
              return [
                selectedClassroom.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                  createVNode("p", { class: "drawer-meta" }, toDisplayString(selectedClassroom.value.code) + " · " + toDisplayString(selectedClassroom.value.status || "pending"), 1),
                  createVNode(_component_a_descriptions, {
                    bordered: "",
                    column: "1",
                    size: "small"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_a_descriptions_item, { label: "Department" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(deptById.value[selectedClassroom.value.departmentId || ""]?.name || "Unassigned"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_descriptions_item, { label: "Capacity" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(selectedClassroom.value.capacity ?? "—"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_descriptions_item, { label: "Enrollment" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(selectedClassroom.value.enrollmentCount ?? "—"), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "drawer-section" }, [
                    createVNode("p", { class: "drawer-section__title" }, "Recommended next steps"),
                    createVNode("ul", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList(classroomRecommendations.value, (action) => {
                        return openBlock(), createBlock("li", {
                          key: action.id
                        }, [
                          createVNode("p", { class: "action-label" }, toDisplayString(action.label), 1),
                          createVNode("p", { class: "action-helper" }, toDisplayString(action.detail), 1)
                        ]);
                      }), 128))
                    ])
                  ])
                ], 64)) : (openBlock(), createBlock(_component_a_empty, {
                  key: 1,
                  description: "Select a classroom from the teaching table"
                }))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_a_modal, {
          open: adminModalOpen.value,
          "onUpdate:open": ($event) => adminModalOpen.value = $event,
          title: adminModalTitle.value,
          "ok-text": "Save",
          "cancel-text": "Cancel",
          onOk: handleAdminModalOk
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_a_form, { layout: "vertical" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_a_form_item, {
                      label: "Name",
                      required: ""
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_input, {
                            value: adminForm.value.name,
                            "onUpdate:value": ($event) => adminForm.value.name = $event
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_input, {
                              value: adminForm.value.name,
                              "onUpdate:value": ($event) => adminForm.value.name = $event
                            }, null, 8, ["value", "onUpdate:value"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_a_form_item, { label: "Owner" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_input, {
                            value: adminForm.value.owner,
                            "onUpdate:value": ($event) => adminForm.value.owner = $event
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_input, {
                              value: adminForm.value.owner,
                              "onUpdate:value": ($event) => adminForm.value.owner = $event
                            }, null, 8, ["value", "onUpdate:value"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_a_form_item, { label: "Notes" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_a_textarea, {
                            value: adminForm.value.note,
                            "onUpdate:value": ($event) => adminForm.value.note = $event,
                            rows: 3
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_a_textarea, {
                              value: adminForm.value.note,
                              "onUpdate:value": ($event) => adminForm.value.note = $event,
                              rows: 3
                            }, null, 8, ["value", "onUpdate:value"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_a_form_item, {
                        label: "Name",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_a_input, {
                            value: adminForm.value.name,
                            "onUpdate:value": ($event) => adminForm.value.name = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_form_item, { label: "Owner" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_input, {
                            value: adminForm.value.owner,
                            "onUpdate:value": ($event) => adminForm.value.owner = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_form_item, { label: "Notes" }, {
                        default: withCtx(() => [
                          createVNode(_component_a_textarea, {
                            value: adminForm.value.note,
                            "onUpdate:value": ($event) => adminForm.value.note = $event,
                            rows: 3
                          }, null, 8, ["value", "onUpdate:value"])
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
                createVNode(_component_a_form, { layout: "vertical" }, {
                  default: withCtx(() => [
                    createVNode(_component_a_form_item, {
                      label: "Name",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: adminForm.value.name,
                          "onUpdate:value": ($event) => adminForm.value.name = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Owner" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_input, {
                          value: adminForm.value.owner,
                          "onUpdate:value": ($event) => adminForm.value.owner = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_a_form_item, { label: "Notes" }, {
                      default: withCtx(() => [
                        createVNode(_component_a_textarea, {
                          value: adminForm.value.note,
                          "onUpdate:value": ($event) => adminForm.value.note = $event,
                          rows: 3
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
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/institution-portal/nuxt/pages/inst-portal-role-based.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const instPortalRoleBased = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-80e44fc0"]]);

export { instPortalRoleBased as default };
//# sourceMappingURL=inst-portal-role-based-iXh1_0vz.mjs.map
