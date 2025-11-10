<template>
  <a-card class="university-module-panel" :bordered="false">
    <template #title>
      <div class="head">
        <div>
          <a-typography-title :level="3" style="margin:0">University Module Hub</a-typography-title>
          <a-typography-text type="secondary">Cohorts, roster, grading, analytics, integrations</a-typography-text>
        </div>
        <div class="head-actions">
          <a-input-search v-model:value="q" placeholder="Search activities…" style="width:260px" />
          <a-segmented v-model:value="density" :options="['Comfort','Compact']" style="margin-left:8px" />
          <a-button @click="refresh" :loading="loading" style="margin-left:8px">Refresh</a-button>
        </div>
      </div>
    </template>

    <a-tabs v-model:activeKey="tab">
      <a-tab-pane key="overview" tab="Overview">
        <div class="grid-4">
          <a-card size="small" v-for="k in kpis" :key="k.key" :title="k.label">
            <a-statistic :value="k.value" />
            <a-typography-text type="secondary">{{ k.hint }}</a-typography-text>
          </a-card>
        </div>
        <a-divider />
        <a-list :data-source="timeline" item-layout="vertical">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta :title="item.title">
                <template #description>
                  <a-space> <a-tag>{{ item.type }}</a-tag> <span>{{ item.when }}</span> </a-space>
                </template>
              </a-list-item-meta>
              <template #actions>
                <a-button type="link">Open</a-button>
                <a-button type="link">Preview</a-button>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>

      <a-tab-pane key="cohorts" tab="Cohorts">
        <a-space direction="vertical" style="width:100%">
          <a-space>
            <a-button type="primary" @click="showCreateCohort=true">New Cohort</a-button>
            <a-upload :show-upload-list="false"><a-button>Import CSV</a-button></a-upload>
            <a-button @click="exportCohorts">Export</a-button>
          </a-space>
          <a-table :columns="cohortCols" :data-source="cohorts" row-key="id" size="small" />
        </a-space>

        <a-modal v-model:open="showCreateCohort" title="Create Cohort" @ok="createCohort">
          <a-form layout="vertical">
            <a-form-item label="Name"><a-input v-model:value="cohortDraft.name" /></a-form-item>
            <a-form-item label="Start"><a-date-picker v-model:value="cohortDraft.start" /></a-form-item>
            <a-form-item label="End"><a-date-picker v-model:value="cohortDraft.end" /></a-form-item>
          </a-form>
        </a-modal>
      </a-tab-pane>

      <a-tab-pane key="roster" tab="Roster">
        <a-space direction="vertical" style="width:100%">
          <a-space>
            <a-input v-model:value="inviteEmail" placeholder="Invite by email" style="width:280px" />
            <a-button type="primary" @click="invite">Invite</a-button>
            <a-upload :show-upload-list="false"><a-button>Bulk Import</a-button></a-upload>
          </a-space>
          <a-table :columns="rosterCols" :data-source="roster" row-key="id" size="small" />
        </a-space>
      </a-tab-pane>

      <a-tab-pane key="assignments" tab="Assignments">
        <a-space direction="vertical" style="width:100%">
          <a-space>
            <a-button type="primary" @click="showCreateAssignment=true">New Assignment</a-button>
            <a-segmented v-model:value="assignmentFilter" :options="['All','Pending','Submitted','Graded']" />
          </a-space>
          <a-table :columns="assignmentCols" :data-source="assignments" row-key="id" size="small" />
        </a-space>

        <a-modal v-model:open="showCreateAssignment" title="Create Assignment" @ok="createAssignment">
          <a-form layout="vertical">
            <a-form-item label="Title"><a-input v-model:value="assignmentDraft.title" /></a-form-item>
            <a-form-item label="Due"><a-date-picker show-time v-model:value="assignmentDraft.due" /></a-form-item>
            <a-form-item label="Points"><a-input-number v-model:value="assignmentDraft.points" :min="0" /></a-form-item>
          </a-form>
        </a-modal>
      </a-tab-pane>

      <a-tab-pane key="grading" tab="Grading">
        <a-table :columns="gradeCols" :data-source="grades" row-key="id" size="small" />
        <a-divider />
        <a-space>
          <a-button @click="exportGrades">Export CSV</a-button>
          <a-button>Rubrics</a-button>
        </a-space>
      </a-tab-pane>

      <a-tab-pane key="discuss" tab="Discussions">
        <a-list :data-source="discussions" item-layout="vertical">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta :title="item.title" :description="item.author" />
              <a-typography-paragraph :content="item.body" />
              <template #actions>
                <a-button type="link">Reply</a-button>
              </template>
            </a-list-item>
          </template>
        </a-list>
        <a-divider />
        <a-form layout="inline" @submit.prevent="postDiscussion">
          <a-input v-model:value="draft.title" placeholder="Topic" style="width:280px" />
          <a-input v-model:value="draft.body" placeholder="Message" style="width:420px" />
          <a-button type="primary" @click="postDiscussion">Post</a-button>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="resources" tab="Resources">
        <a-space direction="vertical" style="width:100%">
          <a-space>
            <a-upload :show-upload-list="false"><a-button>Upload</a-button></a-upload>
            <a-button>Link External</a-button>
          </a-space>
          <a-table :columns="resourceCols" :data-source="resources" row-key="id" size="small" />
        </a-space>
      </a-tab-pane>

      <a-tab-pane key="integrations" tab="Integrations">
        <a-descriptions bordered column="1" title="LMS Integrations">
          <a-descriptions-item label="SCORM">Planned · Placeholder</a-descriptions-item>
          <a-descriptions-item label="LTI">Planned · Placeholder</a-descriptions-item>
          <a-descriptions-item label="SAML/SSO">Planned · Placeholder</a-descriptions-item>
        </a-descriptions>
      </a-tab-pane>

      <a-tab-pane key="analytics" tab="Analytics">
        <a-row :gutter="12">
          <a-col :span="8"><a-card size="small" title="Active Students (wk)">~42</a-card></a-col>
          <a-col :span="8"><a-card size="small" title="Avg. Completion">64%</a-card></a-col>
          <a-col :span="8"><a-card size="small" title="Avg. Grade">81%</a-card></a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const tab = ref('overview')
const q = ref('')
const density = ref('Comfort')
const loading = ref(false)

const kpis = reactive([
  { key:'lessons', label:'Lessons', value: 12, hint:'Videos & readings' },
  { key:'assign', label:'Assignments', value: 5, hint:'Due this term' },
  { key:'cohorts', label:'Cohorts', value: 3, hint:'Active' },
  { key:'progress', label:'Avg Progress', value: '42%', hint:'Across roster' },
])

const timeline = reactive([
  { title:'Kickoff lecture', type:'Lecture', when:'Mon 09:00' },
  { title:'Lab 1 published', type:'Lab', when:'Wed 09:00' },
  { title:'Quiz 1 opens', type:'Quiz', when:'Fri 12:00' },
])

const cohorts = reactive([
  { id:'c1', name:'Fall 2025 A', start:'2025-09-15', end:'2025-12-15', students: 35 },
  { id:'c2', name:'Fall 2025 B', start:'2025-09-16', end:'2025-12-16', students: 28 },
])
const cohortCols = [
  { title:'Name', dataIndex:'name', key:'name' },
  { title:'Start', dataIndex:'start', key:'start' },
  { title:'End', dataIndex:'end', key:'end' },
  { title:'Students', dataIndex:'students', key:'students', align:'right' },
]
const showCreateCohort = ref(false)
const cohortDraft = reactive({ name:'', start:null as any, end:null as any })
function createCohort(){ showCreateCohort.value=false }

function exportCohorts(){ /* placeholder */ }

const inviteEmail = ref('')
const roster = reactive([
  { id:'s1', name:'A. Student', email:'a@student.edu', role:'Student' },
  { id:'s2', name:'B. Student', email:'b@student.edu', role:'Student' },
])
const rosterCols = [
  { title:'Name', dataIndex:'name', key:'name' },
  { title:'Email', dataIndex:'email', key:'email' },
  { title:'Role', dataIndex:'role', key:'role' },
]
function invite(){ /* placeholder */ }

const assignmentFilter = ref('All')
const assignments = reactive([
  { id:'a1', title:'Homework 1', due:'2025-11-18', status:'Pending' },
  { id:'a2', title:'Project Proposal', due:'2025-11-25', status:'Submitted' },
])
const assignmentCols = [
  { title:'Title', dataIndex:'title', key:'title' },
  { title:'Due', dataIndex:'due', key:'due' },
  { title:'Status', dataIndex:'status', key:'status' },
]
const showCreateAssignment = ref(false)
const assignmentDraft = reactive({ title:'', due:null as any, points:100 })
function createAssignment(){ showCreateAssignment.value=false }

const gradeCols = [
  { title:'Student', dataIndex:'student', key:'student' },
  { title:'Item', dataIndex:'item', key:'item' },
  { title:'Score', dataIndex:'score', key:'score', align:'right' },
]
const grades = reactive([
  { id:'g1', student:'A. Student', item:'Quiz 1', score:8 },
  { id:'g2', student:'B. Student', item:'Homework 1', score:12 },
])

const discussions = reactive([
  { id:'d1', title:'Clarification on Lab 1', author:'A. Student', body:'How do we set the seed?' },
])

const draft = reactive({ title:'', body:'' })
function postDiscussion(){ /* placeholder */ }

const resources = reactive([
  { id:'r1', name:'Syllabus.pdf', type:'PDF' },
  { id:'r2', name:'Slides-Week1.pptx', type:'Slides' },
])
const resourceCols = [
  { title:'Name', dataIndex:'name', key:'name' },
  { title:'Type', dataIndex:'type', key:'type' },
]

function refresh(){ loading.value = true; setTimeout(()=> loading.value=false, 500) }
</script>

<style scoped>
.university-module-panel { }
.head{ display:flex; align-items:center; justify-content:space-between; gap:12px; }
.grid-4{ display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
</style>
