import { defineComponent, shallowRef, getCurrentInstance, provide, cloneVNode, h, createElementBlock, computed, watch, ref, reactive, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { useRoute } from 'vue-router';
import { _ as _export_sfc, e as createApolloClient } from './server.mjs';
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

defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = Symbol.for("nuxt:client-only");
const __nuxt_component_0 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});

const FAKE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWh3Ymtzc2gwMDAwdWNrajNkcWI5ZzMxIiwiaWF0IjoxNzYzMjEzNjE2LCJleHAiOjE3NjM4MTg0MTZ9.HejankLa76UputaoFzUH6dEInCVZeGQtPAbmPkNpreo";
const API_URL = "http://localhost:4000/api/teach-internal/graphql";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "view",
  __ssrInlineRender: true,
  setup(__props) {
    const apollo = createApolloClient("teach-internal", getCookieToken());
    provideApolloClient(apollo);
    function useSafeQuery(query, variables = null, fallback = null) {
      const { result, error: error2, loading: loading2 } = useQuery(query, variables, {
        errorPolicy: "all",
        // ⭐ prevents fatal throws
        fetchPolicy: "cache-and-network"
      });
      const data = computed(() => {
        if (error2.value) {
          console.warn("[useSafeQuery] GraphQL error → using fallback", error2.value);
          return fallback;
        }
        return result.value || fallback;
      });
      return {
        data,
        loading: loading2,
        error: error2
        // exposed for optional UI
      };
    }
    const Q_ME = gql`
  query Me {
    me {
      id
      email
      token
    }
  }
`;
    const { result: _meResult, error } = useSafeQuery(Q_ME);
    const fallbackUser = {
      id: "cmhwbkssh0000uckj3dqb9g31",
      email: "student@example.com",
      token: FAKE_JWT
    };
    computed(() => {
      if (error.value) {
        console.warn("[ME] API failed → using mock token");
        return fallbackUser;
      }
      if (!_meResult.value?.me) {
        return fallbackUser;
      }
      return _meResult.value.me;
    });
    watch(error, (e) => {
      if (e) console.error("[GraphQL Error]", e, e.networkError, e.message);
    });
    function ensureLabMeta() {
      if (!currentLesson.value) return;
      currentLesson.value.lab = normalizeLabMeta(
        currentLesson.value.lab,
        currentLesson.value.lab?.kind || "BACKEND_NODE",
        true
      ) || labDefaults();
    }
    const uid = () => Math.random().toString(36).slice(2, 9);
    const route = useRoute();
    function getAuthHeaders(options = {}) {
      const token = getCookieToken();
      const headers = {};
      const wantsJson = options.json !== false;
      if (wantsJson) headers["Content-Type"] = "application/json";
      headers["Authorization"] = `Bearer ${token}`;
      return headers;
    }
    ref(false);
    const testBaseUrlOverride = ref("");
    const testBaseUrl = computed(() => {
      const lab = currentLesson.value?.lab;
      if (!lab) return "";
      if (lab.traefikHost && lab.traefikHost.trim())
        return `https://${lab.traefikHost.trim()}`;
      if (lab.devPort) return `http://localhost:${lab.devPort}`;
      return "";
    });
    computed(
      () => testBaseUrlOverride.value || testBaseUrl.value || ""
    );
    const currentLesson = computed(
      () => currentModule.value?.lessons?.[currentLessonIndex.value]
    );
    function normalizeLabMeta(lab, fallbackKind = "BACKEND_NODE", keepEmpty = false) {
      if (!lab && !keepEmpty) return void 0;
      const kind = lab?.kind || fallbackKind || "BACKEND_NODE";
      const normKv = (rows) => (rows || []).map((r) => ({
        key: r?.key || "",
        value: r?.value || ""
      }));
      const apiTests = (lab?.apiTests || []).map((t, idx) => ({
        id: t.id || uid(),
        name: t.name || `Test ${idx + 1}`,
        method: t.method || "GET",
        path: t.path || "/api/health",
        expectedStatus: Number(t.expectedStatus || 0) || 200,
        points: Number(t.points || 0) || 0,
        bodyJson: t.bodyJson ?? "",
        expectJsonStr: t.expectJsonStr ?? "",
        expectTextLine: t.expectTextLine ?? "",
        pathParams: normKv(t.pathParams),
        query: normKv(t.query),
        headers: normKv(t.headers),
        args: t.args || [],
        auth: t.auth || { type: "none" },
        expectMode: t.expectMode || "json-subset"
      }));
      const uiTests = (lab?.uiTests || []).map((t, idx) => ({
        id: t.id || uid(),
        name: t.name || `UI ${idx + 1}`,
        path: t.path || "/",
        points: Number(t.points || 0) || 0,
        expectTextLine: t.expectTextLine ?? "",
        expectText: t.expectText || []
      }));
      return {
        kind,
        dockerImage: lab?.dockerImage || "node:22-alpine",
        buildCmd: lab?.buildCmd || "npm install",
        startCmd: lab?.startCmd || (kind === "FRONTEND_NUXT" ? "npm run dev" : "npm start"),
        devPort: Number(lab?.devPort || 0) || 3e3,
        traefikHost: lab?.traefikHost || "",
        codeServer: lab?.codeServer ? { ...lab.codeServer } : {},
        apiTests,
        uiTests,
        lastRun: lab?.lastRun
      };
    }
    function labDefaults() {
      return normalizeLabMeta(
        {
          kind: "BACKEND_NODE",
          dockerImage: "node:22-alpine",
          buildCmd: "npm install",
          startCmd: "npm start",
          devPort: 3e3,
          traefikHost: "",
          codeServer: {},
          apiTests: [],
          uiTests: []
        },
        "BACKEND_NODE",
        true
      ) || {
        kind: "BACKEND_NODE",
        dockerImage: "node:22-alpine"
      };
    }
    const currentModuleIndex = ref(0);
    const currentLessonIndex = ref(0);
    const currentModule = computed(
      () => course.modules[currentModuleIndex.value]
    );
    const course = reactive({
      title: "",
      category: "",
      difficulty: "Beginner",
      description: "",
      price: 0,
      discount: 0,
      modules: [],
      files: []
    });
    watch(
      () => currentLesson.value?.type,
      (t) => {
        if (t === "lab") ensureLabMeta();
      },
      { immediate: true }
    );
    ref(false);
    ref(false);
    async function fetchGraphQL(query, variables, endpoint = "/authentication/graphql") {
      const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
      try {
        const resp = await fetch(url, {
          method: "POST",
          credentials: "include",
          headers: getAuthHeaders(),
          body: JSON.stringify({ query, variables })
        });
        if (!resp.ok) {
          const text = await resp.text();
          console.error(
            `[GraphQL ${resp.status}] ${url}
→ Response body:`,
            text.slice(0, 500)
          );
          throw new Error(`HTTP ${resp.status}: ${text}`);
        }
        const json = await resp.json().catch(() => {
          throw new Error("Invalid JSON response from server");
        });
        if (json.errors?.length) {
          console.error("[GraphQL errors]", json.errors);
          throw new Error(json.errors[0]?.message || "GraphQL error");
        }
        return json.data;
      } catch (err) {
        console.error("[fetchGraphQL failed]", { query, variables, endpoint, err });
        throw err;
      }
    }
    function getCookieToken() {
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWh3Ymtzc2gwMDAwdWNrajNkcWI5ZzMxIiwiaWF0IjoxNzYzMjEzNjE2LCJleHAiOjE3NjM4MTg0MTZ9.HejankLa76UputaoFzUH6dEInCVZeGQtPAbmPkNpreo";
    }
    ref(false);
    ref("course");
    ref(false);
    ref([]);
    ref([]);
    ref("");
    computed(
      () => course.modules.flatMap((m) => m.lessons || []).reduce((s, l) => s + (l.duration || 0), 0)
    );
    const coverUrl = computed(
      () => course.files?.[0]?.url || course.coverUrl || ""
    );
    computed(() => ({
      backgroundImage: coverUrl.value ? `url('${coverUrl.value}')` : "linear-gradient(135deg,#111,#334155)"
    }));
    const flatLessons = computed(() => {
      const arr = [];
      course.modules.forEach(
        (m, mi) => (m.lessons || []).forEach(
          (l, li) => arr.push({
            id: l.id,
            label: `${m.title || `Module ${mi + 1}`}: ${l.title || "Untitled"}`
          })
        )
      );
      return arr;
    });
    computed(
      () => `l-${currentModuleIndex.value}-${currentLessonIndex.value}`
    );
    computed(
      () => Number(course.price || 0) * (1 - Number(course.discount || 0) / 100)
    );
    ref(false);
    ref(true);
    ref("");
    ref("");
    ref("");
    ref("");
    ref("");
    ref("");
    ref("");
    ref("");
    ref("");
    computed(
      () => flatLessons.value.filter(
        (x) => currentLesson.value ? x.id !== currentLesson.value.id : true
      ).map((x) => ({ label: x.label, value: x.id }))
    );
    ref({});
    const moduleIdForStudy = computed(() => route.params.moduleId || route.params.id || "unknown");
    const study = reactive({
      notes: "",
      tasks: [],
      resources: []
    });
    computed(() => `byway:module:${moduleIdForStudy.value}:study`);
    async function saveStudy() {
      try {
        await fetchGraphQL(
          `mutation SaveStudy($json: String!){ setMyUiPrefs(json:$json){ ok } }`,
          { json: JSON.stringify(study) }
        );
      } catch (e) {
        console.warn("Save study failed:", e);
      }
    }
    watch(study, saveStudy, { deep: true });
    ref("");
    computed(() => {
      const total = study.tasks.length || 1;
      const done = study.tasks.filter((t) => t.done).length;
      return Math.round(done / total * 100);
    });
    const focusPreset = ref("25");
    const focusCustom = ref(30);
    ref(false);
    const focusSeconds = ref(0);
    watch(focusPreset, (v) => {
      if (v !== "Custom") focusSeconds.value = Number(v) * 60;
    });
    computed(() => String(Math.floor(focusSeconds.value / 60)).padStart(2, "0"));
    computed(() => String(focusSeconds.value % 60).padStart(2, "0"));
    computed(() => {
      const total = (focusPreset.value === "Custom" ? Number(focusCustom.value || 30) : Number(focusPreset.value)) * 60;
      if (!total) return 0;
      return Math.round(100 - focusSeconds.value / total * 100);
    });
    ref("");
    ref("");
    ref("cohorts");
    ref(false);
    const courseId = computed(() => route?.params?.courseId || route?.query?.courseId || typeof currentCourse !== "undefined" && currentCourse?.id || typeof props !== "undefined" && props?.courseId || null);
    ref(null);
    const instCtx = ref({});
    computed(() => {
      const cid = instCtx.value?.classroomId;
      const instId = instCtx.value?.institution?.id;
      if (!cid) return "#";
      const qs = instId ? `?institutionId=${encodeURIComponent(instId)}` : "";
      return `/institution/classrooms/${encodeURIComponent(cid)}${qs}`;
    });
    async function loadInstitutionContext() {
      try {
        const cid = course?.id || courseId.value;
        if (!cid) return;
        const res = await $fetch(`/api/teach-internal/course/${encodeURIComponent(String(cid))}/institution-context`);
        instCtx.value = res || {};
      } catch {
      }
    }
    watch(() => course?.id, () => loadInstitutionContext());
    watch(courseId, () => loadInstitutionContext());
    const cohorts = ref([]);
    const cohortSearch = ref("");
    ref(null);
    ref(false);
    computed(() => cohorts.value.map((c) => ({ label: c.name, value: c.id })));
    computed(() => !cohortSearch.value ? cohorts.value : cohorts.value.filter((c) => (c.name || "").toLowerCase().includes(cohortSearch.value.toLowerCase())));
    const assignments = ref([]);
    ref(false);
    ref(null);
    const enrollments = ref([]);
    ref(false);
    ref("");
    ref(false);
    const analytics = reactive({ completionRate: 0, avgGrade: 0, activeThisWeek: 0 });
    watch([assignments, enrollments], () => {
      const subs = assignments.value.map((a) => a?.submissionsCount || 0).reduce((a, b) => a + b, 0);
      const total = enrollments.value.length || 1;
      analytics.completionRate = Math.min(100, Math.round(subs / total * 100));
      const grades = assignments.value.map((a) => a?.averageGrade).filter((v) => v != null);
      analytics.avgGrade = grades.length ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_client_only = __nuxt_component_0;
      _push(ssrRenderComponent(_component_client_only, _attrs, {}, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/teach-internal/nuxt/pages/course/module/view.vue");
  return _sfc_setup ? _sfc_setup(props2, ctx) : void 0;
};
const view = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bf560cf6"]]);

export { view as default };
//# sourceMappingURL=view-DzE21Ocg.mjs.map
