import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { hasInjectionContext, inject, getCurrentInstance, defineComponent, ref, h, Suspense, Fragment, createApp, provide, shallowReactive, toRef, onErrorCaptured, onServerPrefetch, unref, createVNode, resolveDynamicComponent, reactive, effectScope, shallowRef, isReadonly, isRef, isShallow, isReactive, toRaw, defineAsyncComponent, mergeProps, getCurrentScope, useSSRContext } from 'vue';
import { k as hasProtocol, l as isScriptProtocol, m as joinURL, w as withQuery, n as sanitizeStatusCode, o as getContext, $ as $fetch, p as createHooks, q as executeAsync, h as createError$1, r as toRouteMatcher, v as createRouter$1, x as defu, d as destr, y as klona, z as parse, A as getRequestHeader, B as isEqual, C as setCookie, D as getCookie, E as deleteCookie } from '../_/nitro.mjs';
import { b as baseURL } from '../routes/renderer.mjs';
import { RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { createHttpLink, ApolloClient, InMemoryCache } from '@apollo/client/core/index.js';
import { setContext } from '@apollo/client/link/context/index.js';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    versions: {
      get nuxt() {
        return "4.2.0";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
const unhead_Fmw0nYUk7WLHTeV3Gj1ij40cF9yVo1m5dqUUxIhNHt0 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
const __nuxt_page_meta$f = {
  layout: "student"
};
const __nuxt_page_meta$e = {
  layout: "teach-internal"
};
const __nuxt_page_meta$d = { layout: "student" };
const __nuxt_page_meta$c = { layout: "student", ssr: false };
const __nuxt_page_meta$b = { layout: "student", title: "Assignments" };
const __nuxt_page_meta$a = { layout: "student", title: "Classrooms", ssr: false };
const __nuxt_page_meta$9 = { ssr: false };
const __nuxt_page_meta$8 = { layout: "student" };
const __nuxt_page_meta$7 = { layout: "student" };
const __nuxt_page_meta$6 = { layout: "teacher" };
const __nuxt_page_meta$5 = { layout: "teacher" };
const __nuxt_page_meta$4 = { ssr: false, layout: "teacher" };
const __nuxt_page_meta$3 = { layout: "institution" };
const __nuxt_page_meta$2 = { layout: "institution" };
const __nuxt_page_meta$1 = { layout: "institution" };
const __nuxt_page_meta = { layout: "teacher", title: "Module Admin" };
const _routes = [
  {
    name: "labs-lab_id",
    path: "/labs/:lab_id()",
    component: () => import('./_lab_id_-CK9Kv_UP.mjs')
  },
  {
    name: "plugin-articles-_articles",
    path: "/articles",
    component: () => import('./articles-Ddo8bCd2.mjs')
  },
  {
    name: "plugin-authentication-_auth_login",
    path: "/auth/login",
    component: () => import('./all_auth-pTLf3CTS.mjs')
  },
  {
    name: "plugin-authentication-_auth_signup",
    path: "/auth/signup",
    component: () => import('./all_auth-pTLf3CTS.mjs')
  },
  {
    name: "plugin-contact-page-_contact",
    path: "/contact",
    component: () => import('./contact-Bskd4Qxo.mjs')
  },
  {
    name: "plugin-course-author-_course-author",
    path: "/course-author",
    component: () => import('./course-author-Bqq7RFQd.mjs')
  },
  {
    name: "plugin-course-platform-_course",
    path: "/course",
    component: () => import('./course-DWZIXpDq.mjs')
  },
  {
    name: "plugin-course-platform-_course-lab__course_id",
    path: "/course-lab/:course_id",
    component: () => import('./lab-pf2dC7pS.mjs')
  },
  {
    name: "plugin-courses-details-_course-detail__course_id",
    path: "/course-detail/:course_id",
    component: () => import('./courses-detail-BTXUThrK.mjs')
  },
  {
    name: "plugin-courses-details-_course__course_id",
    path: "/course/:course_id",
    component: () => import('./courses-detail-BTXUThrK.mjs')
  },
  {
    name: "plugin-courses-listing-_course-listing",
    path: "/course-listing",
    component: () => import('./courses-listing-1hgwgFCu.mjs')
  },
  {
    name: "plugin-ecommerce-_checkout_success",
    path: "/checkout/success",
    component: () => import('./success-XI4kE9lr.mjs')
  },
  {
    name: "plugin-ecommerce-_checkout_cancel",
    path: "/checkout/cancel",
    component: () => import('./cancel-DzgXkMxO.mjs')
  },
  {
    name: "plugin-ecommerce-_cart",
    path: "/cart",
    component: () => import('./cart-DxwMdBPe.mjs')
  },
  {
    name: "plugin-footer-links-pages-_faq",
    path: "/faq",
    component: () => import('./faq-B5ehE2LH.mjs')
  },
  {
    name: "plugin-gradebook-_gradebook",
    path: "/gradebook",
    meta: __nuxt_page_meta$f || {},
    component: () => import('./index-DT53mqww.mjs')
  },
  {
    name: "plugin-gradebook-_teach-internal__teacher_id_course__course_id_gradebook",
    path: "/teach-internal/:teacher_id/course/:course_id/gradebook",
    meta: __nuxt_page_meta$e || {},
    component: () => import('./teach-course-gradebook-BHxrDRLr.mjs')
  },
  {
    name: "plugin-homepage-_",
    path: "/",
    component: () => import('./homepage-CgMYxE5o.mjs')
  },
  {
    name: "plugin-institution-portal-_institution_student_mode__institution_id",
    path: "/institution/student_mode/:institution_id",
    component: () => import('./student_mode_institution_dashboard-C05ORetd.mjs')
  },
  {
    name: "plugin-institution-portal-_institution__institution_id_backup",
    path: "/institution/:institution_id/backup",
    component: () => import('./inst-portal-role-based-iXh1_0vz.mjs')
  },
  {
    name: "plugin-institution-portal-_institutions-portal",
    path: "/institutions-portal",
    component: () => import('./index-3aicAQdD.mjs')
  },
  {
    name: "plugin-institution-portal-_institution_portal",
    path: "/institution/portal",
    component: () => import('./index-DAfD_1Kc.mjs')
  },
  {
    name: "plugin-institution-portal-_institution_departments__departmentId",
    path: "/institution/departments/:departmentId",
    component: () => import('./_departmentId_-BS1dpLMI.mjs')
  },
  {
    name: "plugin-institution-portal-_institution_classrooms__classroomId",
    path: "/institution/classrooms/:classroomId",
    component: () => import('./_classroomId_-P-CgrjpE.mjs')
  },
  {
    name: "plugin-institution-portal-_institution_catalog",
    path: "/institution/catalog",
    component: () => import('./index-B9hEwdsE.mjs')
  },
  {
    name: "plugin-institution-portal-_institution_assignments_teachers",
    path: "/institution/assignments/teachers",
    component: () => import('./teachers-Bb65d7Ql.mjs')
  },
  {
    name: "plugin-institution-portal-_institution_students__studentId",
    path: "/institution/students/:studentId",
    component: () => import('./_studentId_-BiAmRvoH.mjs')
  },
  {
    name: "plugin-institution-portal-_institution_people",
    path: "/institution/people",
    component: () => import('./index-SlhWBha5.mjs')
  },
  {
    name: "plugin-institution-portal-_institution_calendar",
    path: "/institution/calendar",
    component: () => import('./index-BU96dpqQ.mjs')
  },
  {
    name: "plugin-institution-portal-_institution_classrooms__classroomId_attendance",
    path: "/institution/classrooms/:classroomId/attendance",
    component: () => import('./attendance-BaNSS8hp.mjs')
  },
  {
    name: "plugin-institution-portal-_institution_join",
    path: "/institution/join",
    component: () => import('./index-CYEf8Jx7.mjs')
  },
  {
    name: "plugin-institutions-_institutions",
    path: "/institutions",
    component: () => import('./index-DZsOVwKN.mjs')
  },
  {
    name: "plugin-institutions-_institutions__id",
    path: "/institutions/:id",
    component: () => import('./_id_-N_SSQa9U.mjs')
  },
  {
    name: "plugin-institutions-_institutions_slug__slug",
    path: "/institutions/slug/:slug",
    component: () => import('./_slug_-CRzYgNPB.mjs')
  },
  {
    name: "plugin-profile-page-_profile-page",
    path: "/profile-page",
    component: () => import('./profile-page-DU6jhcKu.mjs')
  },
  {
    name: "plugin-students-internal-_students_my-courses",
    path: "/students/my-courses",
    component: () => import('./my-courses-CZ8iI7p0.mjs')
  },
  {
    name: "plugin-students-internal-_categories",
    path: "/categories",
    meta: __nuxt_page_meta$d || {},
    component: () => import('./course-listing-CL3kVnVd.mjs')
  },
  {
    name: "plugin-students-internal-_student__student_id_course__course_id_module__module_id",
    path: "/student/:student_id/course/:course_id/module/:module_id",
    meta: __nuxt_page_meta$c || {},
    component: () => import('./module-listing-DNX5OgiS.mjs')
  },
  {
    name: "plugin-students-internal-_classrooms__id_assignments",
    path: "/classrooms/:id/assignments",
    meta: __nuxt_page_meta$b || {},
    component: () => import('./index-_Dj2b4Qc.mjs')
  },
  {
    name: "plugin-students-internal-_classrooms_",
    path: "/classrooms/",
    meta: __nuxt_page_meta$a || {},
    component: () => import('./index-BvsDFj-K.mjs')
  },
  {
    name: "plugin-students-internal-_gradebook__courseId",
    path: "/gradebook/:courseId",
    component: () => import('./_courseId_-FwrS4MBI.mjs')
  },
  {
    name: "plugin-students-internal-_gradebook",
    path: "/gradebook",
    meta: __nuxt_page_meta$9 || {},
    component: () => import('./_id_-W-B4Fjvs.mjs')
  },
  {
    name: "plugin-students-internal-_classrooms__id",
    path: "/classrooms/:id",
    component: () => import('./_id_-CGuZI5S4.mjs')
  },
  {
    name: "plugin-students-internal-_classrooms__id",
    path: "/classrooms/:id",
    component: () => import('./_id_-CGuZI5S4.mjs')
  },
  {
    name: "plugin-students-internal-_modules__id_view",
    path: "/modules/:id/view",
    meta: __nuxt_page_meta$8 || {},
    component: () => import('./view-C1rqB4az.mjs')
  },
  {
    name: "plugin-students-internal-_students",
    path: "/students",
    component: () => import('./index-CF2YXF45.mjs')
  },
  {
    name: "plugin-students-internal-_students_enrollments",
    path: "/students/enrollments",
    component: () => import('./enrollments-D4v10QnY.mjs')
  },
  {
    name: "plugin-students-internal-_students_gradebook",
    path: "/students/gradebook",
    meta: __nuxt_page_meta$7 || {},
    component: () => import('./gradebook-D-CePvu1.mjs')
  },
  {
    name: "plugin-students-internal-_students_gradebook__id",
    path: "/students/gradebook/:id",
    meta: __nuxt_page_meta$9 || {},
    component: () => import('./_id_-W-B4Fjvs.mjs')
  },
  {
    name: "plugin-students-internal-_students_labs",
    path: "/students/labs",
    component: () => import('./index-BRzBSlXP.mjs')
  },
  {
    name: "plugin-teach-_teach",
    path: "/teach",
    component: () => import('./teach-CynkrWjE.mjs')
  },
  {
    name: "plugin-teach-_teach_gradebook",
    path: "/teach/gradebook",
    component: () => import('./gradebook-DBw-EZH_.mjs')
  },
  {
    name: "plugin-teach-internal-_teach-internal__teacher_id",
    path: "/teach-internal/:teacher_id",
    component: () => import('./teach-internal-BUvr8Yss.mjs')
  },
  {
    name: "plugin-teach-internal-_teach-internal__teacher_id_course_create",
    path: "/teach-internal/:teacher_id/course/create",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./create-DeycirvI.mjs')
  },
  {
    name: "plugin-teach-internal-_teach-internal__teacher_id_course_create_module_create",
    path: "/teach-internal/:teacher_id/course/create/module/create",
    meta: __nuxt_page_meta$5 || {},
    component: () => import('./create-Ciyw9O9D.mjs')
  },
  {
    name: "plugin-teach-internal-_teach-internal__teacher_id_course__course_id_module__module_id_view",
    path: "/teach-internal/:teacher_id/course/:course_id/module/:module_id/view",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./view-DzE21Ocg.mjs')
  },
  {
    name: "plugin-teach-internal-_institutions",
    path: "/institutions",
    alias: ["/institutions"],
    component: () => import('./index-DIyZ_UbY.mjs')
  },
  {
    name: "plugin-teach-internal-_institutions__slug_admin",
    path: "/institutions/:slug/admin",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./admin-Dq0-rW_c.mjs')
  },
  {
    name: "plugin-teach-internal-_institutions__slug_assignments__id_grading",
    path: "/institutions/:slug/assignments/:id/grading",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./grading-BV6Bavo3.mjs')
  },
  {
    name: "plugin-teach-internal-_institutions__slug_dashboard",
    path: "/institutions/:slug/dashboard",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./dashboard-J6QGinBI.mjs')
  },
  {
    name: "plugin-teach-internal-_modules__id_admin",
    path: "/modules/:id/admin",
    meta: __nuxt_page_meta || {},
    component: () => import('./admin-Df11gRLg.mjs')
  },
  {
    name: "plugin-teach-internal-_teach_labs",
    path: "/teach/labs",
    component: () => import('./index-BcDuojy-.mjs')
  },
  {
    name: "plugin-teacher-course-lab-_teacher-course-lab",
    path: "/teacher-course-lab",
    component: () => import('./index-dy3ukTJA.mjs')
  },
  {
    name: "plugin-teacher-course-lab-_teacher-course-lab_challenges",
    path: "/teacher-course-lab/challenges",
    component: () => import('./challenges-DMpLGVMg.mjs')
  },
  {
    name: "plugin-teacher-course-lab-_student-course-lab",
    path: "/student-course-lab",
    component: () => import('./index-CfXiHh10.mjs')
  },
  {
    name: "plugin-teacher-course-lab-_teacher-course-lab_submissions",
    path: "/teacher-course-lab/submissions",
    component: () => import('./submissions-D2hvjnSE.mjs')
  }
];
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  const isPageNavigation = isChangingPage(to, from);
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isPageNavigation ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      if (to.matched[to.matched.length - 1]?.components?.default === from.matched[from.matched.length - 1]?.components?.default) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    if (!nuxtApp.ssrContext?.islandContext) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0) {
        return nuxtApp.runWithContext(() => showError(createError({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_7eQiekXgwpI8bh6VpCGcBYmO5_KyYrbYLc0JRCzsaeA = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
function createApolloClient(pluginName, token) {
  const uri = `http://localhost:4000/api/${pluginName}/graphql`;
  const httpLink = createHttpLink({ uri });
  const authLink = setContext((_, { headers }) => {
    let bearer = token ?? null;
    return {
      headers: {
        ...headers,
        ...bearer ? { authorization: `Bearer ${bearer}` } : {}
      }
    };
  });
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: false
  });
}
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
const apollo_mgb5iL8pimUkqqhu5n66JRv5YLad_Ana7KlAEOw6cu0 = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  let token = null;
  {
    const cookie = useCookie("byway_auth_token");
    token = cookie.value || null;
  }
  const apolloClient = createApolloClient("authentication", token || void 0);
  nuxtApp.vueApp.provide(DefaultApolloClient, apolloClient);
});
const plugins = [
  unhead_Fmw0nYUk7WLHTeV3Gj1ij40cF9yVo1m5dqUUxIhNHt0,
  plugin,
  revive_payload_server_7eQiekXgwpI8bh6VpCGcBYmO5_KyYrbYLc0JRCzsaeA,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8,
  apollo_mgb5iL8pimUkqqhu5n66JRv5YLad_Ana7KlAEOw6cu0
];
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_0 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtPage = __nuxt_component_0;
  _push(ssrRenderComponent(_component_NuxtPage, _attrs, null, _parent));
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-C_4z9SIb.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-CX3cqzI8.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/.pnpm/nuxt@4.2.0_@parcel+watcher@2.5.1_@types+node@22.18.13_@vue+compiler-sfc@3.5.22_db0@0.3.4_iore_f5v7hewsddy5avpu7qdacj2zgu/node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/.pnpm/nuxt@4.2.0_@parcel+watcher@2.5.1_@types+node@22.18.13_@vue+compiler-sfc@3.5.22_db0@0.3.4_iore_f5v7hewsddy5avpu7qdacj2zgu/node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { _export_sfc as _, useNuxtApp as a, useRuntimeConfig as b, nuxtLinkDefaults as c, useRoute as d, entry$1 as default, createApolloClient as e, navigateTo as n, resolveRouteObject as r, useRouter as u };
//# sourceMappingURL=server.mjs.map
