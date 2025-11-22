import { defineComponent, ref, watch, resolveComponent, mergeProps, withCtx, unref, isRef, createTextVNode, createVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, h, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { d as useRoute, b as useRuntimeConfig } from './server.mjs';
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

function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var dayjs_min$1 = { exports: {} };
var dayjs_min = dayjs_min$1.exports;
var hasRequiredDayjs_min;
function requireDayjs_min() {
  if (hasRequiredDayjs_min) return dayjs_min$1.exports;
  hasRequiredDayjs_min = 1;
  (function(module, exports) {
    !(function(t, e) {
      module.exports = e();
    })(dayjs_min, (function() {
      var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h2 = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t2) {
        var e2 = ["th", "st", "nd", "rd"], n2 = t2 % 100;
        return "[" + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
      } }, m = function(t2, e2, n2) {
        var r2 = String(t2);
        return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
      }, v = { s: m, z: function(t2) {
        var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
        return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i2, 2, "0");
      }, m: function t2(e2, n2) {
        if (e2.date() < n2.date()) return -t2(n2, e2);
        var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, c), s2 = n2 - i2 < 0, u2 = e2.clone().add(r2 + (s2 ? -1 : 1), c);
        return +(-(r2 + (n2 - i2) / (s2 ? i2 - u2 : u2 - i2)) || 0);
      }, a: function(t2) {
        return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
      }, p: function(t2) {
        return { M: c, y: h2, w: o, d: a, D: d, h: u, m: s, s: i, ms: r, Q: f }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
      }, u: function(t2) {
        return void 0 === t2;
      } }, g = "en", D = {};
      D[g] = M;
      var p = "$isDayjsObject", S = function(t2) {
        return t2 instanceof _ || !(!t2 || !t2[p]);
      }, w = function t2(e2, n2, r2) {
        var i2;
        if (!e2) return g;
        if ("string" == typeof e2) {
          var s2 = e2.toLowerCase();
          D[s2] && (i2 = s2), n2 && (D[s2] = n2, i2 = s2);
          var u2 = e2.split("-");
          if (!i2 && u2.length > 1) return t2(u2[0]);
        } else {
          var a2 = e2.name;
          D[a2] = e2, i2 = a2;
        }
        return !r2 && i2 && (g = i2), i2 || !r2 && g;
      }, O = function(t2, e2) {
        if (S(t2)) return t2.clone();
        var n2 = "object" == typeof e2 ? e2 : {};
        return n2.date = t2, n2.args = arguments, new _(n2);
      }, b = v;
      b.l = w, b.i = S, b.w = function(t2, e2) {
        return O(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
      };
      var _ = (function() {
        function M2(t2) {
          this.$L = w(t2.locale, null, true), this.parse(t2), this.$x = this.$x || t2.x || {}, this[p] = true;
        }
        var m2 = M2.prototype;
        return m2.parse = function(t2) {
          this.$d = (function(t3) {
            var e2 = t3.date, n2 = t3.utc;
            if (null === e2) return /* @__PURE__ */ new Date(NaN);
            if (b.u(e2)) return /* @__PURE__ */ new Date();
            if (e2 instanceof Date) return new Date(e2);
            if ("string" == typeof e2 && !/Z$/i.test(e2)) {
              var r2 = e2.match($);
              if (r2) {
                var i2 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
                return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
              }
            }
            return new Date(e2);
          })(t2), this.init();
        }, m2.init = function() {
          var t2 = this.$d;
          this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
        }, m2.$utils = function() {
          return b;
        }, m2.isValid = function() {
          return !(this.$d.toString() === l);
        }, m2.isSame = function(t2, e2) {
          var n2 = O(t2);
          return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
        }, m2.isAfter = function(t2, e2) {
          return O(t2) < this.startOf(e2);
        }, m2.isBefore = function(t2, e2) {
          return this.endOf(e2) < O(t2);
        }, m2.$g = function(t2, e2, n2) {
          return b.u(t2) ? this[e2] : this.set(n2, t2);
        }, m2.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, m2.valueOf = function() {
          return this.$d.getTime();
        }, m2.startOf = function(t2, e2) {
          var n2 = this, r2 = !!b.u(e2) || e2, f2 = b.p(t2), l2 = function(t3, e3) {
            var i2 = b.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
            return r2 ? i2 : i2.endOf(a);
          }, $2 = function(t3, e3) {
            return b.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
          }, y2 = this.$W, M3 = this.$M, m3 = this.$D, v2 = "set" + (this.$u ? "UTC" : "");
          switch (f2) {
            case h2:
              return r2 ? l2(1, 0) : l2(31, 11);
            case c:
              return r2 ? l2(1, M3) : l2(0, M3 + 1);
            case o:
              var g2 = this.$locale().weekStart || 0, D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
              return l2(r2 ? m3 - D2 : m3 + (6 - D2), M3);
            case a:
            case d:
              return $2(v2 + "Hours", 0);
            case u:
              return $2(v2 + "Minutes", 1);
            case s:
              return $2(v2 + "Seconds", 2);
            case i:
              return $2(v2 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, m2.endOf = function(t2) {
          return this.startOf(t2, false);
        }, m2.$set = function(t2, e2) {
          var n2, o2 = b.p(t2), f2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = f2 + "Date", n2[d] = f2 + "Date", n2[c] = f2 + "Month", n2[h2] = f2 + "FullYear", n2[u] = f2 + "Hours", n2[s] = f2 + "Minutes", n2[i] = f2 + "Seconds", n2[r] = f2 + "Milliseconds", n2)[o2], $2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
          if (o2 === c || o2 === h2) {
            var y2 = this.clone().set(d, 1);
            y2.$d[l2]($2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
          } else l2 && this.$d[l2]($2);
          return this.init(), this;
        }, m2.set = function(t2, e2) {
          return this.clone().$set(t2, e2);
        }, m2.get = function(t2) {
          return this[b.p(t2)]();
        }, m2.add = function(r2, f2) {
          var d2, l2 = this;
          r2 = Number(r2);
          var $2 = b.p(f2), y2 = function(t2) {
            var e2 = O(l2);
            return b.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
          };
          if ($2 === c) return this.set(c, this.$M + r2);
          if ($2 === h2) return this.set(h2, this.$y + r2);
          if ($2 === a) return y2(1);
          if ($2 === o) return y2(7);
          var M3 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i] = t, d2)[$2] || 1, m3 = this.$d.getTime() + r2 * M3;
          return b.w(m3, this);
        }, m2.subtract = function(t2, e2) {
          return this.add(-1 * t2, e2);
        }, m2.format = function(t2) {
          var e2 = this, n2 = this.$locale();
          if (!this.isValid()) return n2.invalidDate || l;
          var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i2 = b.z(this), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, c2 = n2.months, f2 = n2.meridiem, h3 = function(t3, n3, i3, s3) {
            return t3 && (t3[n3] || t3(e2, r2)) || i3[n3].slice(0, s3);
          }, d2 = function(t3) {
            return b.s(s2 % 12 || 12, t3, "0");
          }, $2 = f2 || function(t3, e3, n3) {
            var r3 = t3 < 12 ? "AM" : "PM";
            return n3 ? r3.toLowerCase() : r3;
          };
          return r2.replace(y, (function(t3, r3) {
            return r3 || (function(t4) {
              switch (t4) {
                case "YY":
                  return String(e2.$y).slice(-2);
                case "YYYY":
                  return b.s(e2.$y, 4, "0");
                case "M":
                  return a2 + 1;
                case "MM":
                  return b.s(a2 + 1, 2, "0");
                case "MMM":
                  return h3(n2.monthsShort, a2, c2, 3);
                case "MMMM":
                  return h3(c2, a2);
                case "D":
                  return e2.$D;
                case "DD":
                  return b.s(e2.$D, 2, "0");
                case "d":
                  return String(e2.$W);
                case "dd":
                  return h3(n2.weekdaysMin, e2.$W, o2, 2);
                case "ddd":
                  return h3(n2.weekdaysShort, e2.$W, o2, 3);
                case "dddd":
                  return o2[e2.$W];
                case "H":
                  return String(s2);
                case "HH":
                  return b.s(s2, 2, "0");
                case "h":
                  return d2(1);
                case "hh":
                  return d2(2);
                case "a":
                  return $2(s2, u2, true);
                case "A":
                  return $2(s2, u2, false);
                case "m":
                  return String(u2);
                case "mm":
                  return b.s(u2, 2, "0");
                case "s":
                  return String(e2.$s);
                case "ss":
                  return b.s(e2.$s, 2, "0");
                case "SSS":
                  return b.s(e2.$ms, 3, "0");
                case "Z":
                  return i2;
              }
              return null;
            })(t3) || i2.replace(":", "");
          }));
        }, m2.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m2.diff = function(r2, d2, l2) {
          var $2, y2 = this, M3 = b.p(d2), m3 = O(r2), v2 = (m3.utcOffset() - this.utcOffset()) * e, g2 = this - m3, D2 = function() {
            return b.m(y2, m3);
          };
          switch (M3) {
            case h2:
              $2 = D2() / 12;
              break;
            case c:
              $2 = D2();
              break;
            case f:
              $2 = D2() / 3;
              break;
            case o:
              $2 = (g2 - v2) / 6048e5;
              break;
            case a:
              $2 = (g2 - v2) / 864e5;
              break;
            case u:
              $2 = g2 / n;
              break;
            case s:
              $2 = g2 / e;
              break;
            case i:
              $2 = g2 / t;
              break;
            default:
              $2 = g2;
          }
          return l2 ? $2 : b.a($2);
        }, m2.daysInMonth = function() {
          return this.endOf(c).$D;
        }, m2.$locale = function() {
          return D[this.$L];
        }, m2.locale = function(t2, e2) {
          if (!t2) return this.$L;
          var n2 = this.clone(), r2 = w(t2, e2, true);
          return r2 && (n2.$L = r2), n2;
        }, m2.clone = function() {
          return b.w(this.$d, this);
        }, m2.toDate = function() {
          return new Date(this.valueOf());
        }, m2.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, m2.toISOString = function() {
          return this.$d.toISOString();
        }, m2.toString = function() {
          return this.$d.toUTCString();
        }, M2;
      })(), k = _.prototype;
      return O.prototype = k, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", c], ["$y", h2], ["$D", d]].forEach((function(t2) {
        k[t2[1]] = function(e2) {
          return this.$g(e2, t2[0], t2[1]);
        };
      })), O.extend = function(t2, e2) {
        return t2.$i || (t2(e2, _, O), t2.$i = true), O;
      }, O.locale = w, O.isDayjs = S, O.unix = function(t2) {
        return O(1e3 * t2);
      }, O.en = D[g], O.Ls = D, O.p = {}, O;
    }));
  })(dayjs_min$1);
  return dayjs_min$1.exports;
}
var dayjs_minExports = requireDayjs_min();
const dayjs = /* @__PURE__ */ getDefaultExportFromCjs(dayjs_minExports);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const config = useRuntimeConfig();
    const baseUrl = config.public?.apiBase || "http://localhost:4000";
    const courseId = ref("");
    const name = ref("");
    const start = ref(null);
    const end = ref(null);
    const rows = ref([]);
    const cols = [
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Start", dataIndex: "startDate", key: "startDate" },
      { title: "End", dataIndex: "endDate", key: "endDate" }
    ];
    async function list() {
      if (!courseId.value) {
        rows.value = [];
        return;
      }
      const q = "query($courseId:String!){ classroomsByCourse(courseId:$courseId){ id name startDate endDate } }";
      const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: "POST", body: { query: q, variables: { courseId: courseId.value } } });
      rows.value = r.data?.classroomsByCourse ?? [];
    }
    async function create() {
      if (!courseId.value || !name.value || !start.value || !end.value) return;
      const q = "mutation($courseId:String!,$name:String!,$startDate:String!,$endDate:String!){ createClassroom(courseId:$courseId,name:$name,startDate:$startDate,endDate:$endDate){ id } }";
      await $fetch(`${baseUrl}/api/teach-internal/graphql`, {
        method: "POST",
        body: { query: q, variables: { courseId: courseId.value, name: name.value, startDate: dayjs(start.value).toISOString(), endDate: dayjs(end.value).toISOString() } }
      });
      await list();
    }
    watch(courseId, list);
    const selectedClassroomId = ref("");
    const assignments = ref([]);
    const aTitle = ref("");
    const aDesc = ref("");
    const aDue = ref(null);
    const aCols = [
      { title: "Actions", key: "a", customRender: ({ record }) => h("a", { href: `/institutions/${route.params.slug}/assignments/${record.id}/grading` }, "Grade") },
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Due", dataIndex: "dueDate", key: "dueDate" }
    ];
    async function loadAssignments() {
      if (!selectedClassroomId.value) {
        assignments.value = [];
        return;
      }
      const q = "query($classroomId:String!){ assignmentsByClassroom(classroomId:$classroomId){ id title description dueDate } }";
      const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: "POST", body: { query: q, variables: { classroomId: selectedClassroomId.value } } });
      assignments.value = r.data?.assignmentsByClassroom ?? [];
    }
    async function createAssignment() {
      if (!selectedClassroomId.value || !aTitle.value || !aDesc.value || !aDue.value) return;
      const q = "mutation($classroomId:String!,$title:String!,$description:String!,$dueDate:String!){ createAssignment(classroomId:$classroomId,title:$title,description:$description,dueDate:$dueDate){ id } }";
      await $fetch(`${baseUrl}/api/teach-internal/graphql`, {
        method: "POST",
        body: { query: q, variables: { classroomId: selectedClassroomId.value, title: aTitle.value, description: aDesc.value, dueDate: dayjs(aDue.value).toISOString() } }
      });
      aTitle.value = "";
      aDesc.value = "";
      aDue.value = null;
      await loadAssignments();
    }
    watch(selectedClassroomId, loadAssignments);
    function beforeUpload(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        csvText.value = String(e.target?.result || "");
      };
      reader.readAsText(file);
      return false;
    }
    const csvText = ref("");
    async function bulkEnroll() {
      if (!csvText.value) return;
      const q = "mutation($csv:String!){ bulkEnrollCsv(csv:$csv) }";
      await $fetch(`${baseUrl}/api/students-internal/graphql`, {
        method: "POST",
        body: { query: q, variables: { csv: csvText.value } }
      });
      csvText.value = "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_a_layout = resolveComponent("a-layout");
      const _component_a_card = resolveComponent("a-card");
      const _component_a_tabs = resolveComponent("a-tabs");
      const _component_a_tab_pane = resolveComponent("a-tab-pane");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_date_picker = resolveComponent("a-date-picker");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_table = resolveComponent("a-table");
      const _component_a_select = resolveComponent("a-select");
      const _component_a_select_option = resolveComponent("a-select-option");
      const _component_a_textarea = resolveComponent("a-textarea");
      const _component_a_upload = resolveComponent("a-upload");
      _push(ssrRenderComponent(_component_a_layout, mergeProps({ class: "p-6" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_a_card, {
              title: `Admin · ${unref(route).params.slug}`,
              bordered: false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_a_tabs, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_a_tab_pane, {
                          key: "classrooms",
                          tab: "Classrooms"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<p class="mb-4"${_scopeId4}>Create course classrooms bound to this institution.</p><div class="mb-4 flex gap-2"${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_input, {
                                value: unref(courseId),
                                "onUpdate:value": ($event) => isRef(courseId) ? courseId.value = $event : null,
                                placeholder: "Course ID",
                                style: { "max-width": "260px" }
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_input, {
                                value: unref(name),
                                "onUpdate:value": ($event) => isRef(name) ? name.value = $event : null,
                                placeholder: "Classroom name",
                                style: { "max-width": "220px" }
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_date_picker, {
                                value: unref(start),
                                "onUpdate:value": ($event) => isRef(start) ? start.value = $event : null,
                                placeholder: "Start date"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_date_picker, {
                                value: unref(end),
                                "onUpdate:value": ($event) => isRef(end) ? end.value = $event : null,
                                placeholder: "End date"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_button, {
                                type: "primary",
                                onClick: create
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Create classroom`);
                                  } else {
                                    return [
                                      createTextVNode("Create classroom")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                              _push5(ssrRenderComponent(_component_a_table, {
                                "data-source": unref(rows),
                                columns: cols,
                                "row-key": "id"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode("p", { class: "mb-4" }, "Create course classrooms bound to this institution."),
                                createVNode("div", { class: "mb-4 flex gap-2" }, [
                                  createVNode(_component_a_input, {
                                    value: unref(courseId),
                                    "onUpdate:value": ($event) => isRef(courseId) ? courseId.value = $event : null,
                                    placeholder: "Course ID",
                                    style: { "max-width": "260px" }
                                  }, null, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_input, {
                                    value: unref(name),
                                    "onUpdate:value": ($event) => isRef(name) ? name.value = $event : null,
                                    placeholder: "Classroom name",
                                    style: { "max-width": "220px" }
                                  }, null, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_date_picker, {
                                    value: unref(start),
                                    "onUpdate:value": ($event) => isRef(start) ? start.value = $event : null,
                                    placeholder: "Start date"
                                  }, null, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_date_picker, {
                                    value: unref(end),
                                    "onUpdate:value": ($event) => isRef(end) ? end.value = $event : null,
                                    placeholder: "End date"
                                  }, null, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_button, {
                                    type: "primary",
                                    onClick: create
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Create classroom")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                createVNode(_component_a_table, {
                                  "data-source": unref(rows),
                                  columns: cols,
                                  "row-key": "id"
                                }, null, 8, ["data-source"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_tab_pane, {
                          key: "assignments",
                          tab: "Assignments"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="mb-4"${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_select, {
                                value: unref(selectedClassroomId),
                                "onUpdate:value": ($event) => isRef(selectedClassroomId) ? selectedClassroomId.value = $event : null,
                                style: { "min-width": "260px" },
                                placeholder: "Select classroom"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<!--[-->`);
                                    ssrRenderList(unref(rows), (c) => {
                                      _push6(ssrRenderComponent(_component_a_select_option, {
                                        key: c.id,
                                        value: c.id
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`${ssrInterpolate(c.name)}`);
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(c.name), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    });
                                    _push6(`<!--]-->`);
                                  } else {
                                    return [
                                      (openBlock(true), createBlock(Fragment, null, renderList(unref(rows), (c) => {
                                        return openBlock(), createBlock(_component_a_select_option, {
                                          key: c.id,
                                          value: c.id
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(c.name), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["value"]);
                                      }), 128))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_input, {
                                value: unref(aTitle),
                                "onUpdate:value": ($event) => isRef(aTitle) ? aTitle.value = $event : null,
                                placeholder: "Assignment title",
                                style: { "max-width": "220px", "margin-left": "8px" }
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_input, {
                                value: unref(aDesc),
                                "onUpdate:value": ($event) => isRef(aDesc) ? aDesc.value = $event : null,
                                placeholder: "Description",
                                style: { "max-width": "260px", "margin-left": "8px" }
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_date_picker, {
                                value: unref(aDue),
                                "onUpdate:value": ($event) => isRef(aDue) ? aDue.value = $event : null,
                                placeholder: "Due date",
                                style: { "margin-left": "8px" }
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_button, {
                                type: "primary",
                                onClick: createAssignment,
                                style: { "margin-left": "8px" }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Create`);
                                  } else {
                                    return [
                                      createTextVNode("Create")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                              _push5(ssrRenderComponent(_component_a_table, {
                                "data-source": unref(assignments),
                                columns: aCols,
                                "row-key": "id"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode("div", { class: "mb-4" }, [
                                  createVNode(_component_a_select, {
                                    value: unref(selectedClassroomId),
                                    "onUpdate:value": ($event) => isRef(selectedClassroomId) ? selectedClassroomId.value = $event : null,
                                    style: { "min-width": "260px" },
                                    placeholder: "Select classroom"
                                  }, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(unref(rows), (c) => {
                                        return openBlock(), createBlock(_component_a_select_option, {
                                          key: c.id,
                                          value: c.id
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(c.name), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["value"]);
                                      }), 128))
                                    ]),
                                    _: 1
                                  }, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_input, {
                                    value: unref(aTitle),
                                    "onUpdate:value": ($event) => isRef(aTitle) ? aTitle.value = $event : null,
                                    placeholder: "Assignment title",
                                    style: { "max-width": "220px", "margin-left": "8px" }
                                  }, null, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_input, {
                                    value: unref(aDesc),
                                    "onUpdate:value": ($event) => isRef(aDesc) ? aDesc.value = $event : null,
                                    placeholder: "Description",
                                    style: { "max-width": "260px", "margin-left": "8px" }
                                  }, null, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_date_picker, {
                                    value: unref(aDue),
                                    "onUpdate:value": ($event) => isRef(aDue) ? aDue.value = $event : null,
                                    placeholder: "Due date",
                                    style: { "margin-left": "8px" }
                                  }, null, 8, ["value", "onUpdate:value"]),
                                  createVNode(_component_a_button, {
                                    type: "primary",
                                    onClick: createAssignment,
                                    style: { "margin-left": "8px" }
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Create")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                createVNode(_component_a_table, {
                                  "data-source": unref(assignments),
                                  columns: aCols,
                                  "row-key": "id"
                                }, null, 8, ["data-source"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_a_tab_pane, {
                          key: "enrollments",
                          tab: "Enrollments (CSV)"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<p class="mb-2"${_scopeId4}>Paste rows: <code${_scopeId4}>studentId,courseId[,classroomId]</code></p>`);
                              _push5(ssrRenderComponent(_component_a_textarea, {
                                value: unref(csvText),
                                "onUpdate:value": ($event) => isRef(csvText) ? csvText.value = $event : null,
                                rows: 6,
                                placeholder: "s123,c101,clA\\ns124,c101,clA"
                              }, null, _parent5, _scopeId4));
                              _push5(`<div class="mt-2 flex items-center gap-2"${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_a_upload, {
                                "before-upload": beforeUpload,
                                "show-upload-list": false
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_a_button, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Upload CSV`);
                                        } else {
                                          return [
                                            createTextVNode("Upload CSV")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_a_button, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Upload CSV")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_a_button, {
                                type: "primary",
                                onClick: bulkEnroll
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Import`);
                                  } else {
                                    return [
                                      createTextVNode("Import")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                            } else {
                              return [
                                createVNode("p", { class: "mb-2" }, [
                                  createTextVNode("Paste rows: "),
                                  createVNode("code", null, "studentId,courseId[,classroomId]")
                                ]),
                                createVNode(_component_a_textarea, {
                                  value: unref(csvText),
                                  "onUpdate:value": ($event) => isRef(csvText) ? csvText.value = $event : null,
                                  rows: 6,
                                  placeholder: "s123,c101,clA\\ns124,c101,clA"
                                }, null, 8, ["value", "onUpdate:value"]),
                                createVNode("div", { class: "mt-2 flex items-center gap-2" }, [
                                  createVNode(_component_a_upload, {
                                    "before-upload": beforeUpload,
                                    "show-upload-list": false
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_a_button, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Upload CSV")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_a_button, {
                                    type: "primary",
                                    onClick: bulkEnroll
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Import")
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
                          createVNode(_component_a_tab_pane, {
                            key: "classrooms",
                            tab: "Classrooms"
                          }, {
                            default: withCtx(() => [
                              createVNode("p", { class: "mb-4" }, "Create course classrooms bound to this institution."),
                              createVNode("div", { class: "mb-4 flex gap-2" }, [
                                createVNode(_component_a_input, {
                                  value: unref(courseId),
                                  "onUpdate:value": ($event) => isRef(courseId) ? courseId.value = $event : null,
                                  placeholder: "Course ID",
                                  style: { "max-width": "260px" }
                                }, null, 8, ["value", "onUpdate:value"]),
                                createVNode(_component_a_input, {
                                  value: unref(name),
                                  "onUpdate:value": ($event) => isRef(name) ? name.value = $event : null,
                                  placeholder: "Classroom name",
                                  style: { "max-width": "220px" }
                                }, null, 8, ["value", "onUpdate:value"]),
                                createVNode(_component_a_date_picker, {
                                  value: unref(start),
                                  "onUpdate:value": ($event) => isRef(start) ? start.value = $event : null,
                                  placeholder: "Start date"
                                }, null, 8, ["value", "onUpdate:value"]),
                                createVNode(_component_a_date_picker, {
                                  value: unref(end),
                                  "onUpdate:value": ($event) => isRef(end) ? end.value = $event : null,
                                  placeholder: "End date"
                                }, null, 8, ["value", "onUpdate:value"]),
                                createVNode(_component_a_button, {
                                  type: "primary",
                                  onClick: create
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Create classroom")
                                  ]),
                                  _: 1
                                })
                              ]),
                              createVNode(_component_a_table, {
                                "data-source": unref(rows),
                                columns: cols,
                                "row-key": "id"
                              }, null, 8, ["data-source"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_tab_pane, {
                            key: "assignments",
                            tab: "Assignments"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "mb-4" }, [
                                createVNode(_component_a_select, {
                                  value: unref(selectedClassroomId),
                                  "onUpdate:value": ($event) => isRef(selectedClassroomId) ? selectedClassroomId.value = $event : null,
                                  style: { "min-width": "260px" },
                                  placeholder: "Select classroom"
                                }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(unref(rows), (c) => {
                                      return openBlock(), createBlock(_component_a_select_option, {
                                        key: c.id,
                                        value: c.id
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(c.name), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["value"]);
                                    }), 128))
                                  ]),
                                  _: 1
                                }, 8, ["value", "onUpdate:value"]),
                                createVNode(_component_a_input, {
                                  value: unref(aTitle),
                                  "onUpdate:value": ($event) => isRef(aTitle) ? aTitle.value = $event : null,
                                  placeholder: "Assignment title",
                                  style: { "max-width": "220px", "margin-left": "8px" }
                                }, null, 8, ["value", "onUpdate:value"]),
                                createVNode(_component_a_input, {
                                  value: unref(aDesc),
                                  "onUpdate:value": ($event) => isRef(aDesc) ? aDesc.value = $event : null,
                                  placeholder: "Description",
                                  style: { "max-width": "260px", "margin-left": "8px" }
                                }, null, 8, ["value", "onUpdate:value"]),
                                createVNode(_component_a_date_picker, {
                                  value: unref(aDue),
                                  "onUpdate:value": ($event) => isRef(aDue) ? aDue.value = $event : null,
                                  placeholder: "Due date",
                                  style: { "margin-left": "8px" }
                                }, null, 8, ["value", "onUpdate:value"]),
                                createVNode(_component_a_button, {
                                  type: "primary",
                                  onClick: createAssignment,
                                  style: { "margin-left": "8px" }
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Create")
                                  ]),
                                  _: 1
                                })
                              ]),
                              createVNode(_component_a_table, {
                                "data-source": unref(assignments),
                                columns: aCols,
                                "row-key": "id"
                              }, null, 8, ["data-source"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_a_tab_pane, {
                            key: "enrollments",
                            tab: "Enrollments (CSV)"
                          }, {
                            default: withCtx(() => [
                              createVNode("p", { class: "mb-2" }, [
                                createTextVNode("Paste rows: "),
                                createVNode("code", null, "studentId,courseId[,classroomId]")
                              ]),
                              createVNode(_component_a_textarea, {
                                value: unref(csvText),
                                "onUpdate:value": ($event) => isRef(csvText) ? csvText.value = $event : null,
                                rows: 6,
                                placeholder: "s123,c101,clA\\ns124,c101,clA"
                              }, null, 8, ["value", "onUpdate:value"]),
                              createVNode("div", { class: "mt-2 flex items-center gap-2" }, [
                                createVNode(_component_a_upload, {
                                  "before-upload": beforeUpload,
                                  "show-upload-list": false
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_a_button, null, {
                                      default: withCtx(() => [
                                        createTextVNode("Upload CSV")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_a_button, {
                                  type: "primary",
                                  onClick: bulkEnroll
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Import")
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
                    createVNode(_component_a_tabs, null, {
                      default: withCtx(() => [
                        createVNode(_component_a_tab_pane, {
                          key: "classrooms",
                          tab: "Classrooms"
                        }, {
                          default: withCtx(() => [
                            createVNode("p", { class: "mb-4" }, "Create course classrooms bound to this institution."),
                            createVNode("div", { class: "mb-4 flex gap-2" }, [
                              createVNode(_component_a_input, {
                                value: unref(courseId),
                                "onUpdate:value": ($event) => isRef(courseId) ? courseId.value = $event : null,
                                placeholder: "Course ID",
                                style: { "max-width": "260px" }
                              }, null, 8, ["value", "onUpdate:value"]),
                              createVNode(_component_a_input, {
                                value: unref(name),
                                "onUpdate:value": ($event) => isRef(name) ? name.value = $event : null,
                                placeholder: "Classroom name",
                                style: { "max-width": "220px" }
                              }, null, 8, ["value", "onUpdate:value"]),
                              createVNode(_component_a_date_picker, {
                                value: unref(start),
                                "onUpdate:value": ($event) => isRef(start) ? start.value = $event : null,
                                placeholder: "Start date"
                              }, null, 8, ["value", "onUpdate:value"]),
                              createVNode(_component_a_date_picker, {
                                value: unref(end),
                                "onUpdate:value": ($event) => isRef(end) ? end.value = $event : null,
                                placeholder: "End date"
                              }, null, 8, ["value", "onUpdate:value"]),
                              createVNode(_component_a_button, {
                                type: "primary",
                                onClick: create
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Create classroom")
                                ]),
                                _: 1
                              })
                            ]),
                            createVNode(_component_a_table, {
                              "data-source": unref(rows),
                              columns: cols,
                              "row-key": "id"
                            }, null, 8, ["data-source"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_tab_pane, {
                          key: "assignments",
                          tab: "Assignments"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "mb-4" }, [
                              createVNode(_component_a_select, {
                                value: unref(selectedClassroomId),
                                "onUpdate:value": ($event) => isRef(selectedClassroomId) ? selectedClassroomId.value = $event : null,
                                style: { "min-width": "260px" },
                                placeholder: "Select classroom"
                              }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(unref(rows), (c) => {
                                    return openBlock(), createBlock(_component_a_select_option, {
                                      key: c.id,
                                      value: c.id
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(c.name), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["value"]);
                                  }), 128))
                                ]),
                                _: 1
                              }, 8, ["value", "onUpdate:value"]),
                              createVNode(_component_a_input, {
                                value: unref(aTitle),
                                "onUpdate:value": ($event) => isRef(aTitle) ? aTitle.value = $event : null,
                                placeholder: "Assignment title",
                                style: { "max-width": "220px", "margin-left": "8px" }
                              }, null, 8, ["value", "onUpdate:value"]),
                              createVNode(_component_a_input, {
                                value: unref(aDesc),
                                "onUpdate:value": ($event) => isRef(aDesc) ? aDesc.value = $event : null,
                                placeholder: "Description",
                                style: { "max-width": "260px", "margin-left": "8px" }
                              }, null, 8, ["value", "onUpdate:value"]),
                              createVNode(_component_a_date_picker, {
                                value: unref(aDue),
                                "onUpdate:value": ($event) => isRef(aDue) ? aDue.value = $event : null,
                                placeholder: "Due date",
                                style: { "margin-left": "8px" }
                              }, null, 8, ["value", "onUpdate:value"]),
                              createVNode(_component_a_button, {
                                type: "primary",
                                onClick: createAssignment,
                                style: { "margin-left": "8px" }
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Create")
                                ]),
                                _: 1
                              })
                            ]),
                            createVNode(_component_a_table, {
                              "data-source": unref(assignments),
                              columns: aCols,
                              "row-key": "id"
                            }, null, 8, ["data-source"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_a_tab_pane, {
                          key: "enrollments",
                          tab: "Enrollments (CSV)"
                        }, {
                          default: withCtx(() => [
                            createVNode("p", { class: "mb-2" }, [
                              createTextVNode("Paste rows: "),
                              createVNode("code", null, "studentId,courseId[,classroomId]")
                            ]),
                            createVNode(_component_a_textarea, {
                              value: unref(csvText),
                              "onUpdate:value": ($event) => isRef(csvText) ? csvText.value = $event : null,
                              rows: 6,
                              placeholder: "s123,c101,clA\\ns124,c101,clA"
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode("div", { class: "mt-2 flex items-center gap-2" }, [
                              createVNode(_component_a_upload, {
                                "before-upload": beforeUpload,
                                "show-upload-list": false
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_a_button, null, {
                                    default: withCtx(() => [
                                      createTextVNode("Upload CSV")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_a_button, {
                                type: "primary",
                                onClick: bulkEnroll
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Import")
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
          } else {
            return [
              createVNode(_component_a_card, {
                title: `Admin · ${unref(route).params.slug}`,
                bordered: false
              }, {
                default: withCtx(() => [
                  createVNode(_component_a_tabs, null, {
                    default: withCtx(() => [
                      createVNode(_component_a_tab_pane, {
                        key: "classrooms",
                        tab: "Classrooms"
                      }, {
                        default: withCtx(() => [
                          createVNode("p", { class: "mb-4" }, "Create course classrooms bound to this institution."),
                          createVNode("div", { class: "mb-4 flex gap-2" }, [
                            createVNode(_component_a_input, {
                              value: unref(courseId),
                              "onUpdate:value": ($event) => isRef(courseId) ? courseId.value = $event : null,
                              placeholder: "Course ID",
                              style: { "max-width": "260px" }
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_input, {
                              value: unref(name),
                              "onUpdate:value": ($event) => isRef(name) ? name.value = $event : null,
                              placeholder: "Classroom name",
                              style: { "max-width": "220px" }
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_date_picker, {
                              value: unref(start),
                              "onUpdate:value": ($event) => isRef(start) ? start.value = $event : null,
                              placeholder: "Start date"
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_date_picker, {
                              value: unref(end),
                              "onUpdate:value": ($event) => isRef(end) ? end.value = $event : null,
                              placeholder: "End date"
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_button, {
                              type: "primary",
                              onClick: create
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Create classroom")
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode(_component_a_table, {
                            "data-source": unref(rows),
                            columns: cols,
                            "row-key": "id"
                          }, null, 8, ["data-source"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_tab_pane, {
                        key: "assignments",
                        tab: "Assignments"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "mb-4" }, [
                            createVNode(_component_a_select, {
                              value: unref(selectedClassroomId),
                              "onUpdate:value": ($event) => isRef(selectedClassroomId) ? selectedClassroomId.value = $event : null,
                              style: { "min-width": "260px" },
                              placeholder: "Select classroom"
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(unref(rows), (c) => {
                                  return openBlock(), createBlock(_component_a_select_option, {
                                    key: c.id,
                                    value: c.id
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(c.name), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["value"]);
                                }), 128))
                              ]),
                              _: 1
                            }, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_input, {
                              value: unref(aTitle),
                              "onUpdate:value": ($event) => isRef(aTitle) ? aTitle.value = $event : null,
                              placeholder: "Assignment title",
                              style: { "max-width": "220px", "margin-left": "8px" }
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_input, {
                              value: unref(aDesc),
                              "onUpdate:value": ($event) => isRef(aDesc) ? aDesc.value = $event : null,
                              placeholder: "Description",
                              style: { "max-width": "260px", "margin-left": "8px" }
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_date_picker, {
                              value: unref(aDue),
                              "onUpdate:value": ($event) => isRef(aDue) ? aDue.value = $event : null,
                              placeholder: "Due date",
                              style: { "margin-left": "8px" }
                            }, null, 8, ["value", "onUpdate:value"]),
                            createVNode(_component_a_button, {
                              type: "primary",
                              onClick: createAssignment,
                              style: { "margin-left": "8px" }
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Create")
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode(_component_a_table, {
                            "data-source": unref(assignments),
                            columns: aCols,
                            "row-key": "id"
                          }, null, 8, ["data-source"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_a_tab_pane, {
                        key: "enrollments",
                        tab: "Enrollments (CSV)"
                      }, {
                        default: withCtx(() => [
                          createVNode("p", { class: "mb-2" }, [
                            createTextVNode("Paste rows: "),
                            createVNode("code", null, "studentId,courseId[,classroomId]")
                          ]),
                          createVNode(_component_a_textarea, {
                            value: unref(csvText),
                            "onUpdate:value": ($event) => isRef(csvText) ? csvText.value = $event : null,
                            rows: 6,
                            placeholder: "s123,c101,clA\\ns124,c101,clA"
                          }, null, 8, ["value", "onUpdate:value"]),
                          createVNode("div", { class: "mt-2 flex items-center gap-2" }, [
                            createVNode(_component_a_upload, {
                              "before-upload": beforeUpload,
                              "show-upload-list": false
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_a_button, null, {
                                  default: withCtx(() => [
                                    createTextVNode("Upload CSV")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_a_button, {
                              type: "primary",
                              onClick: bulkEnroll
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Import")
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
              }, 8, ["title"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/teach-internal/nuxt/pages/institutions/[slug]/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-Dq0-rW_c.mjs.map
