<template>
<<<<<<< HEAD
  <a-layout class="course-internal">
    <!-- LEFT: SYLLABUS / PROGRESS -->
    <a-layout-sider
      width="300"
      collapsible
      v-model:collapsed="siderCollapsed"
      class="sider"
    >
      <div class="cover" :style="coverStyle">
        <div class="cover-gradient"></div>
        <div class="cover-meta" v-if="!siderCollapsed">
          <div class="cover-title">{{ course.title || 'Untitled course' }}</div>
          <div class="cover-tags">
            <a-tag v-if="course.category" color="blue">{{ course.category }}</a-tag>
            <a-tag v-if="course.difficulty" color="gold">{{ course.difficulty }}</a-tag>
          </div>
        </div>
      </div>

      <div class="sider-body">
        <a-progress :percent="progressPercent" status="active" :stroke-width="8" />
        <div class="sider-actions">
          <a-button type="primary" block @click="resumeLast" :disabled="totalLessons === 0">
            <template #icon><PlayCircleOutlined/></template>
            Resume ({{ resumeLabel }})
          </a-button>
        </div>

        <a-input-search
          v-model:value="filterText"
          placeholder="Search lessons"
          allow-clear
          class="mt-2"
        />

        <a-tree
          class="mt-2"
          block-node
          :tree-data="filteredTreeData"
          :selectedKeys="[selectedTreeKey]"
          :expandedKeys="expandedKeys"
          @select="onSelectNode"
          @expand="(keys)=>expandedKeys = keys as string[]"
        />
      </div>
    </a-layout-sider>

    <!-- RIGHT: MAIN CONTENT -->
    <a-layout>
      <a-page-header class="header"
        :title="course.title || 'Course'"
        :sub-title="subTitle"
      >
        <template #tags>
          <a-tag v-if="course.category" color="blue">{{ course.category }}</a-tag>
          <a-tag v-if="course.difficulty" color="gold">{{ course.difficulty }}</a-tag>
        </template>
        <template #extra>
          <a-rate :value="rating" disabled />
          <a-button @click="shortcutsOpen = true" shape="circle">
            <template #icon>KeyboardOutlined</template>
          </a-button>
        </template>
      </a-page-header>

      <a-layout-content class="content">
        <a-row :gutter="24">
          <!-- PLAYER & TABS -->
          <a-col :xs="24" :lg="16">
            <a-card :title="currentLesson?.title || 'Select a lesson'" :loading="!currentLesson && totalLessons>0">
              <div v-if="currentLesson">
                <div class="player">
                  <template v-if="currentLesson.videoUrl">
                    <iframe
                      class="player-iframe"
                      :src="embedUrl(currentLesson.videoUrl)"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    />
                  </template>
                  <template v-else>
                    <a-empty description="No video for this lesson">
                      <template #image>
                        <PlayCircleOutlined style="font-size:48px" />
                      </template>
                    </a-empty>
                  </template>
                </div>

                <div class="player-actions">
                  <a-space>
                    <a-button :disabled="!hasPrev" @click="goPrev">
                      <template #icon><ArrowLeftOutlined/></template>
                      Prev
                    </a-button>
                    <a-button :disabled="!hasNext" type="primary" @click="goNext">
                      Next
                      <template #icon><ArrowRightOutlined/></template>
                    </a-button>
                  </a-space>
                  <a-space>
                    <a-switch v-model:checked="currentLesson.completed" @change="onToggleComplete"
                              :checked-children="'Done'" :un-checked-children="'Mark done'"/>
                    <a-button v-if="currentLesson.completed" type="default" size="small" @click="undoComplete">
                      <template #icon><UndoOutlined/></template>
                      Undo
                    </a-button>
                  </a-space>
                </div>
              </div>
              <a-empty v-else description="No lessons yet."> </a-empty>
            </a-card>

            <a-tabs class="mt-3" :items="tabItems" v-model:activeKey="activeTab" />

          </a-col>

          <!-- RIGHT RAIL -->
          <a-col :xs="24" :lg="8">
            <a-card title="About this course" class="mb-3">
              <p class="muted" v-if="!course.description">No description yet.</p>
              <p v-else v-html="safeHtml(course.description)"></p>
              <a-divider />
              <div class="meta-row"><span class="muted">Difficulty</span><span>{{ course.difficulty || '—' }}</span></div>
              <div class="meta-row"><span class="muted">Category</span><span>{{ course.category || '—' }}</span></div>
              <div class="meta-row"><span class="muted">Lessons</span><span>{{ totalLessons }}</span></div>
              <div class="meta-row"><span class="muted">Est. time</span><span>{{ estimatedTime }}</span></div>
              <a-divider />
              <div class="price-row">
                <span class="price" v-if="course.price">$
                  {{ discountedPrice.toFixed(2) }}
                  <del v-if="course.discount"> ${{ course.price.toFixed(2) }}</del>
                </span>
                <a-tag v-if="course.discount" color="red">{{ course.discount }}% off</a-tag>
              </div>
            </a-card>

            <a-card title="Syllabus">
              <a-collapse accordion>
                <a-collapse-panel v-for="(m, mi) in course.modules" :key="'pm-'+mi" :header="m.title || ('Module '+(mi+1))">
                  <a-list
                    size="small"
                    :data-source="m.lessons"
                    :renderItem="(l, li)=>renderMiniLesson(l, mi, li)"
                  />
                </a-collapse-panel>
              </a-collapse>
            </a-card>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>

    <!-- Shortcuts / Outline Drawer -->
    <a-drawer v-model:open="shortcutsOpen" title="Shortcuts & quick nav" placement="right" width="420">
      <p><b>Space</b> — Toggle complete</p>
      <p><b>J / K</b> — Prev / Next lesson</p>
      <p><b>/</b> — Focus lesson search</p>
      <a-divider />
      <a-input-search v-model:value="filterText" placeholder="Search lessons" allow-clear class="mb-2" />
      <a-tree block-node :tree-data="filteredTreeData" :selectedKeys="[selectedTreeKey]" @select="onSelectNode" />
    </a-drawer>
  </a-layout>
</template>

<script setup lang="ts">
import { reactive, ref, computed, h, onMounted, watch } from 'vue'
import {
  PlayCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined, UndoOutlined,
  CheckCircleTwoTone, FileTextOutlined, MessageOutlined,
  PaperClipOutlined, FilePdfOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

/** ----- Types from your data model (extends your Step 2 `modules/lessons`) ----- */
type Lesson = {
  id: string
  title: string
  duration?: number            // minutes
  videoUrl?: string            // YouTube/Vimeo/etc
  content?: string             // HTML/markdown (rendered as HTML here)
  resources?: { id:string; name:string; kind:'pdf'|'file'|'link'; url:string }[]
  completed?: boolean
=======
  <a-config-provider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
    <a-layout :class="['course-learn', isDark ? 'is-dark' : '']">
      <!-- LEFT: COVER + PROGRESS + OUTLINE -->
      <a-layout-sider width="300" collapsible v-model:collapsed="siderCollapsed" class="sider">
        <div class="cover" :style="coverStyle">
          <div class="cover-gradient"></div>
          <div class="cover-meta" v-if="!siderCollapsed">
            <div class="cover-title">{{ course.title || 'Untitled course' }}</div>
            <div class="cover-tags">
              <a-tag v-if="course.category" color="blue">{{ course.category }}</a-tag>
              <a-tag v-if="course.difficulty" color="gold">{{ course.difficulty }}</a-tag>
            </div>
          </div>
        </div>

        <div class="sider-body">
          <a-progress :percent="progressPercent" status="active" :stroke-width="8" />
          <div class="sider-actions">
            <a-button type="primary" block @click="resumeLast" :disabled="totalLessons === 0">
              <template #icon><PlayCircleOutlined/></template>
              Resume ({{ resumeLabel }})
            </a-button>
          </div>

          <a-input-search
            ref="filterInputRef"
            v-model:value="filterText"
            placeholder="Search lessons"
            allow-clear
            class="mt-2"
          />

          <a-tree
            class="mt-2"
            block-node
            :tree-data="filteredTreeData"
            :selectedKeys="[selectedTreeKey]"
            :expandedKeys="expandedKeys"
            @select="onSelectNode"
            @expand="(keys)=>expandedKeys = keys as string[]"
          />
        </div>
      </a-layout-sider>

      <!-- RIGHT: MAIN -->
      <a-layout>
        <a-page-header
          class="header"
          :title="course.title || 'Course'"
          :sub-title="subTitle"
          @back="goBack"
        >
          <template #tags>
            <a-tag v-if="course.category" color="blue">{{ course.category }}</a-tag>
            <a-tag v-if="course.difficulty" color="gold">{{ course.difficulty }}</a-tag>
            <a-tag v-if="totalMinutes" color="blue"><FieldTimeOutlined /> {{ totalMinutes }} min</a-tag>
            <a-tag v-if="!purchased" color="red"><LockOutlined /> Locked content</a-tag>
            <a-tag v-else color="green"><CheckCircleTwoTone :twoTone-color="'#52c41a'"/> Purchased</a-tag>
          </template>
          <template #extra>
            <a-space>
              <a-tooltip :title="isDark ? 'Switch to light' : 'Switch to dark'">
                <a-button shape="circle" @click="toggleDark"><BulbOutlined /></a-button>
              </a-tooltip>

              <a-button @click="notesOpen = true"><FileTextOutlined /> Notes</a-button>
              <a-button @click="resourcesOpen = true"><PaperClipOutlined /> Resources</a-button>

              <a-button v-if="!purchased" @click="addToCart">
                <ShoppingCartOutlined /> Add to cart
              </a-button>
              <a-button v-if="!purchased" type="primary" @click="openCheckout">
                <CreditCardOutlined /> Buy now
              </a-button>

              <a-button v-if="purchased" type="primary" @click="goStartOrNext">
                <PlayCircleOutlined /> {{ nextCta }}
              </a-button>

              <a-button @click="shortcutsOpen = true" shape="circle" :title="'Shortcuts'">
                <KeyboardOutlined />
              </a-button>
            </a-space>
          </template>
        </a-page-header>

        <a-layout-content class="content">
          <a-row :gutter="24">
            <!-- VIEWER + TABS -->
            <a-col :xs="24" :lg="16">
              <a-card :title="currentLesson?.title || 'Select a lesson'" :loading="!currentLesson && totalLessons>0">
                <template v-if="currentLesson">
                  <!-- Locked gate -->
                  <a-result
                    v-if="isLocked(currentLesson)"
                    status="warning"
                    :title="!purchased && !currentLesson.preview ? 'This lesson is behind a paywall' : 'This lesson is locked'"
                    :sub-title="!purchased && !currentLesson.preview ? 'Purchase the course to unlock all lessons.' : lockedReason(currentLesson)"
                  >
                    <template #extra>
                      <a-space>
                        <a-button v-if="!purchased" type="primary" @click="openCheckout">
                          <CreditCardOutlined /> Go to checkout
                        </a-button>
                        <a-button v-if="hasNext" @click="goNext">Next available</a-button>
                      </a-space>
                    </template>
                  </a-result>

                  <template v-else>
                    <!-- Meta -->
                    <div class="lesson-head">
                      <div class="lh-left">
                        <a-tag>{{ currentLesson.type }}</a-tag>
                        <a-tag v-if="currentLesson.preview" color="cyan">Preview</a-tag>
                        <div class="muted"><FieldTimeOutlined /> {{ Number(currentLesson.duration) || 0 }} min</div>
                      </div>
                      <div class="lh-right">
                        <a-space>
                          <a-button @click="notesOpen = true"><FileTextOutlined /> Notes</a-button>
                          <a-button @click="resourcesOpen = true"><PaperClipOutlined /> Resources</a-button>
                          <a-button
                            :type="currentLesson.completed ? 'default' : 'primary'"
                            @click="toggleDone(currentLesson.id)"
                          >
                            <template v-if="currentLesson.completed">
                              <CheckCircleTwoTone :twoTone-color="'#52c41a'" /> Completed
                            </template>
                            <template v-else>
                              <CheckOutlined /> Mark complete
                            </template>
                          </a-button>
                        </a-space>
                      </div>
                    </div>

                    <!-- VIEWER -->
                    <a-card class="viewer" :bordered="false">
                      <!-- VIDEO -->
                      <template v-if="currentLesson.type === 'video'">
                        <div v-if="ytEmbed(currentLesson.videoUrl)" class="video-wrap">
                          <iframe
                            :src="ytEmbed(currentLesson.videoUrl)"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                            title="Lesson video"
                          />
                        </div>
                        <div v-else class="video-fallback">
                          <a-typography-paragraph>
                            Video URL: <a :href="currentLesson.videoUrl" target="_blank">{{ currentLesson.videoUrl || '—' }}</a>
                          </a-typography-paragraph>
                        </div>
                        <a-divider>Notes</a-divider>
                        <a-typography-paragraph style="white-space:pre-wrap">{{ currentLesson.content }}</a-typography-paragraph>
                      </template>

                      <!-- READING -->
                      <template v-else-if="currentLesson.type === 'reading'">
                        <a-typography-paragraph style="white-space:pre-wrap">
                          {{ currentLesson.content || 'No content provided.' }}
                        </a-typography-paragraph>
                      </template>

                      <!-- ASSIGNMENT -->
                      <template v-else-if="currentLesson.type === 'assignment'">
                        <a-typography-paragraph style="white-space:pre-wrap">
                          {{ currentLesson.content || 'No brief provided.' }}
                        </a-typography-paragraph>
                        <a-alert v-if="currentLesson.rubric" type="info" show-icon :message="'Rubric'" :description="currentLesson.rubric" style="margin:12px 0" />
                        <a-form layout="vertical" @finish="submitAssignment(currentLesson.id)">
                          <a-form-item label="Submit a link to your work">
                            <a-input v-model:value="assignmentLinks[currentLesson.id]" placeholder="https://…" />
                          </a-form-item>
                          <a-space>
                            <a-button type="primary" html-type="submit">Submit</a-button>
                            <a-typography-text type="secondary" v-if="assignmentSubmitted(currentLesson.id)">
                              Submitted ✔
                            </a-typography-text>
                          </a-space>
                        </a-form>
                      </template>

                      <!-- QUIZ -->
                      <template v-else-if="currentLesson.type === 'quiz'">
                        <a-alert
                          type="info"
                          show-icon
                          message="Checkpoint"
                          description="Answer MCQs for a score. True/False and Short are self-check (counted as answered)."
                          style="margin-bottom:12px"
                        />
                        <div v-for="(q, qIdx) in (currentLesson.quiz?.questions || [])" :key="q.id" class="quiz-item">
                          <a-card :title="`Q${qIdx+1}`" size="small" style="margin-bottom:8px">
                            <div class="q-text">{{ q.text || 'Question' }}</div>

                            <!-- MCQ -->
                            <div v-if="q.type === 'mcq'">
                              <a-radio-group
                                :value="getAnswer(currentLesson.id, q.id)"
                                @update:value="(v)=>setAnswer(currentLesson.id, q.id, v)"
                                style="width:100%"
                              >
                                <div v-for="(opt, oi) in q.options" :key="oi" class="mcq-row">
                                  <a-radio :value="oi">{{ opt.text || `Option ${oi + 1}` }}</a-radio>
                                </div>
                              </a-radio-group>
                            </div>

                            <!-- True/False -->
                            <div v-else-if="q.type === 'tf'">
                              <a-radio-group
                                :value="getAnswer(currentLesson.id, q.id)"
                                @update:value="(v)=>setAnswer(currentLesson.id, q.id, v)"
                              >
                                <a-radio value="T">True</a-radio>
                                <a-radio value="F">False</a-radio>
                              </a-radio-group>
                            </div>

                            <!-- Short -->
                            <div v-else>
                              <a-input
                                :value="getAnswer(currentLesson.id, q.id)"
                                @update:value="(v)=>setAnswer(currentLesson.id, q.id, v)"
                                placeholder="Your answer"
                              />
                            </div>
                          </a-card>
                        </div>

                        <a-space>
                          <a-button type="primary" @click="gradeCurrentQuiz">Submit quiz</a-button>
                          <a-typography-text v-if="quizScores[currentLesson.id]">
                            Score: {{ quizScores[currentLesson.id].score }}/{{ quizScores[currentLesson.id].total }}
                            <span v-if="quizScores[currentLesson.id].passed"> — Passed ✔</span>
                          </a-typography-text>
                        </a-space>
                      </template>
                    </a-card>

                    <!-- Inline resources -->
                    <div v-if="(currentLesson.resources && currentLesson.resources.length) || (currentLesson.attachments && currentLesson.attachments.length)" class="resources-inline">
                      <a-divider>Resources</a-divider>
                      <ul class="res-list" v-if="currentLesson.resources?.length">
                        <li v-for="(r, i) in currentLesson.resources" :key="i">
                          <a :href="r.url" target="_blank">{{ r.title || r.url }}</a>
                        </li>
                      </ul>
                      <div v-if="currentLesson.attachments?.length" class="muted">
                        {{ currentLesson.attachments.length }} attachment(s) available (see drawer)
                      </div>
                    </div>

                    <!-- Player actions -->
                    <div class="player-actions">
                      <a-space>
                        <a-button :disabled="!hasPrev" @click="goPrev">
                          <template #icon><ArrowLeftOutlined/></template>
                          Prev
                        </a-button>
                        <a-button :disabled="!hasNext" type="primary" @click="goNext">
                          Next
                          <template #icon><ArrowRightOutlined/></template>
                        </a-button>
                      </a-space>
                      <a-space>
                        <a-switch v-model:checked="currentLesson.completed" @change="onToggleComplete"
                                  :checked-children="'Done'" :un-checked-children="'Mark done'"/>
                        <a-button v-if="currentLesson.completed" type="default" size="small" @click="undoComplete">
                          <template #icon><UndoOutlined/></template>
                          Undo
                        </a-button>
                      </a-space>
                    </div>
                  </template>
                </template>

                <a-empty v-else description="No lessons yet." />
              </a-card>

              <!-- TABS -->
              <a-tabs class="mt-3" v-model:activeKey="activeTab">
                <a-tab-pane key="overview" tab="Overview">
                  <template v-if="currentLesson">
                    <div class="tab-pad">
                      <div class="lesson-meta">
                        <span class="muted">Duration: {{ currentLesson.duration ?? '—' }} min</span>
                      </div>
                      <div v-html="safeHtml(currentLesson.content || '<p>No content yet.</p>')"></div>
                    </div>
                  </template>
                  <a-empty v-else description="Select a lesson" />
                </a-tab-pane>

                <a-tab-pane key="notes" tab="Notes">
                  <template v-if="currentLesson">
                    <div class="tab-pad">
                      <a-textarea
                        rows="3"
                        v-model:value="noteText"
                        placeholder="Write a quick note for this lesson…"
                      />
                      <div class="mt-2">
                        <a-button type="primary" @click="addNote">Add note</a-button>
                      </div>
                      <a-list class="mt-2" :data-source="lessonNotes" bordered>
                        <template #renderItem="{ item }">
                          <a-list-item>
                            <a-list-item-meta :title="new Date(item.ts).toLocaleString()" :description="item.text" />
                            <template #actions>
                              <a @click="delNote(item.id)">Delete</a>
                            </template>
                          </a-list-item>
                        </template>
                      </a-list>
                    </div>
                  </template>
                  <a-empty v-else description="Select a lesson" />
                </a-tab-pane>

                <a-tab-pane key="qa" tab="Q&A">
                  <div class="tab-pad">
                    <a-textarea rows="3" v-model:value="qaText" placeholder="Ask a question…" />
                    <div class="mt-2"><a-button type="primary" @click="addQuestion">Post question</a-button></div>
                    <a-list class="mt-2" :data-source="qaFiltered" bordered>
                      <template #renderItem="{ item }">
                        <a-list-item>
                          <a-list-item-meta :title="item.q" :description="new Date(item.ts).toLocaleString()" />
                          <div v-if="item.a" class="answer"><b>Answer:</b> {{ item.a }}</div>
                        </a-list-item>
                      </template>
                    </a-list>
                  </div>
                </a-tab-pane>

                <a-tab-pane key="resources" tab="Resources">
                  <template v-if="currentLesson">
                    <a-list class="tab-pad" :data-source="mergedResources" bordered>
                      <template #renderItem="{ item }">
                        <a-list-item>
                          <a-list-item-meta
                            :title="item.name || item.title || item.url"
                            :description="item.url"
                          />
                          <template #actions>
                            <a-button size="small" @click="download(item)">Download</a-button>
                          </template>
                        </a-list-item>
                      </template>
                    </a-list>
                  </template>
                  <a-empty v-else description="Select a lesson" />
                </a-tab-pane>

                <a-tab-pane key="transcript" tab="Transcript">
                  <div class="tab-pad muted" v-if="currentLesson">Transcript not available for this lesson yet.</div>
                  <a-empty v-else description="Select a lesson" />
                </a-tab-pane>
              </a-tabs>
            </a-col>

            <!-- RIGHT RAIL -->
            <a-col :xs="24" :lg="8">
              <!-- Purchase (visible if NOT purchased) -->
              <a-card v-if="!purchased" title="Get full access" class="mb-3">
                <div class="price-row">
                  <span class="price" v-if="course.price > 0">
                    {{ fmt(payablePrice) }}
                    <template v-if="effectiveDiscountPct > 0">
                      <del class="muted small">{{ fmt(course.price) }}</del>
                      <a-tag color="red">{{ effectiveDiscountPct }}% off</a-tag>
                    </template>
                  </span>
                  <span v-else class="price">Free</span>
                </div>
                <a-input
                  v-model:value="couponInput"
                  placeholder="Coupon code (SAVE10, SAVE20)"
                  class="mt-2"
                  @pressEnter="applyCoupon"
                />
                <a-space class="mt-2">
                  <a-button @click="applyCoupon">Apply</a-button>
                  <a-button type="primary" @click="openCheckout">
                    <CreditCardOutlined /> Checkout
                  </a-button>
                </a-space>
                <div v-if="appliedCoupon" class="muted mt-2">
                  Applied: <b>{{ appliedCoupon }}</b> ({{ couponPct }}% off)
                  <a @click="clearCoupon">remove</a>
                </div>
              </a-card>

              <!-- About this course (HIDDEN when purchased) -->
              <a-card v-if="!purchased" title="About this course" class="mb-3">
                <p class="muted" v-if="!course.description">No description yet.</p>
                <p v-else v-html="safeHtml(course.description)"></p>
                <a-divider />
                <div class="meta-row"><span class="muted">Difficulty</span><span>{{ course.difficulty || '—' }}</span></div>
                <div class="meta-row"><span class="muted">Category</span><span>{{ course.category || '—' }}</span></div>
                <div class="meta-row"><span class="muted">Lessons</span><span>{{ totalLessons }}</span></div>
                <div class="meta-row"><span class="muted">Est. time</span><span>{{ estimatedTime }}</span></div>
              </a-card>

              <!-- Syllabus (always visible) -->
              <a-card title="Syllabus">
                <a-collapse accordion>
                  <a-collapse-panel
                    v-for="(m, mi) in course.modules"
                    :key="'pm-'+mi"
                    :header="m.title || ('Module '+(mi+1))"
                  >
                    <a-list size="small" :data-source="m.lessons">
                      <template #renderItem="{ item, index }">
                        <a-list-item
                          :class="['mini-lesson', item.completed && 'done', isActive(mi,index) && 'active']"
                          @click="setCurrent(mi,index)"
                        >
                          <a-list-item-meta
                            :title="item.title"
                            :description="(item.duration ? (item.duration + ' min') : '') + (item.preview ? ' • preview' : '')"
                          />
                          <template #actions>
                            <CheckCircleTwoTone v-if="item.completed" :twoTone-color="'#52c41a'" />
                            <LockOutlined v-else-if="isLocked(item)" />
                            <PlayCircleOutlined v-else />
                          </template>
                        </a-list-item>
                      </template>
                    </a-list>
                  </a-collapse-panel>
                </a-collapse>
              </a-card>
            </a-col>
          </a-row>
        </a-layout-content>
      </a-layout>

      <!-- RESOURCES DRAWER -->
      <a-drawer v-model:open="resourcesOpen" title="Resources & Attachments" placement="right" :width="420">
        <div v-if="currentLesson">
          <a-typography-title :level="5">For: {{ currentLesson.title || 'Lesson' }}</a-typography-title>
          <a-divider />
          <a-typography-title :level="5">Links</a-typography-title>
          <a-empty v-if="!currentLesson.resources?.length" description="No links" />
          <a-list v-else :data-source="currentLesson.resources" bordered>
            <template #renderItem="{ item }">
              <a-list-item>
                <a :href="item.url" target="_blank"><LinkOutlined /> {{ item.title || item.url }}</a>
              </a-list-item>
            </template>
          </a-list>

          <a-divider />
          <a-typography-title :level="5">Attachments</a-typography-title>
          <a-empty v-if="!currentLesson.attachments?.length" description="No attachments" />
          <a-list v-else :data-source="currentLesson.attachments" bordered>
            <template #renderItem="{ item }">
              <a-list-item>
                <PaperClipOutlined />
                <span style="margin-left:8px">{{ item.name || 'Attachment' }}</span>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </a-drawer>

      <!-- NOTES DRAWER (per-lesson note map) -->
      <a-drawer v-model:open="notesOpen" title="My notes" placement="right" :width="420">
        <a-typography-text type="secondary" v-if="!currentLesson">Open a lesson to take notes.</a-typography-text>
        <template v-else>
          <a-typography-title :level="5">{{ currentLesson.title }}</a-typography-title>
          <a-textarea
            v-model:value="notes[currentLesson.id]"
            :rows="12"
            placeholder="Write your personal notes here…"
            @change="saveNotesMap()"
          />
          <div style="margin-top:8px" class="muted">Saved locally.</div>
        </template>
      </a-drawer>

      <!-- SHORTCUTS DRAWER -->
      <a-drawer v-model:open="shortcutsOpen" title="Shortcuts & quick nav" placement="right" width="420">
        <p><b>Space</b> — Toggle complete</p>
        <p><b>J / K</b> — Prev / Next lesson</p>
        <p><b>/</b> — Focus lesson search</p>
        <a-divider />
        <a-input-search v-model:value="filterText" placeholder="Search lessons" allow-clear class="mb-2" />
        <a-tree block-node :tree-data="filteredTreeData" :selectedKeys="[selectedTreeKey]" @select="onSelectNode" />
      </a-drawer>

      <!-- CHECKOUT DRAWER -->
      <a-drawer
        v-model:open="checkoutOpen"
        :width="isMobile ? '100%' : 520"
        title="Checkout"
        placement="right"
        :destroyOnClose="true"
      >
        <a-steps :current="checkoutStep" size="small" class="mb-3" @change="onStepsChange">
          <a-step title="Summary" />
          <a-step title="Details" />
          <a-step title="Payment" />
          <a-step title="Review" />
        </a-steps>

        <!-- STEP 0: SUMMARY -->
        <div v-if="checkoutStep === 0">
          <a-card :bordered="false">
            <div class="meta-row"><span>Course</span><span>{{ course.title }}</span></div>
            <div class="meta-row"><span>Base price</span><span>{{ fmt(course.price) }}</span></div>
            <div class="meta-row" v-if="course.discount"><span>Course discount</span><span>-{{ course.discount }}%</span></div>
            <div class="meta-row" v-if="couponPct"><span>Coupon ({{ appliedCoupon }})</span><span>-{{ couponPct }}%</span></div>
            <a-divider />
            <div class="meta-row total"><span>Total</span><span>{{ fmt(payablePrice) }}</span></div>
          </a-card>
          <div class="mt-2">
            <a-input
              v-model:value="couponInput"
              placeholder="Have a coupon? (SAVE10 / SAVE20)"
              @pressEnter="applyCoupon"
            />
            <a-space class="mt-2">
              <a-button @click="applyCoupon">Apply</a-button>
              <a-button v-if="appliedCoupon" type="link" @click="clearCoupon">Remove coupon</a-button>
            </a-space>
          </div>
          <a-space class="mt-3">
            <a-button @click="toStep(1)">Continue</a-button>
          </a-space>
        </div>

        <!-- STEP 1: DETAILS -->
        <div v-else-if="checkoutStep === 1">
          <a-form layout="vertical" @finish="()=>toStep(2)" :model="billing">
            <a-form-item label="Full name" name="name" :rules="[{ required:true, message:'Name required' }]">
              <a-input v-model:value="billing.name" />
            </a-form-item>
            <a-form-item label="Email" name="email" :rules="[{ type:'email', required:true, message:'Valid email required' }]">
              <a-input v-model:value="billing.email" />
            </a-form-item>
            <a-form-item label="Country">
              <a-input v-model:value="billing.country" placeholder="e.g. Germany" />
            </a-form-item>
            <a-form-item label="VAT ID (optional)">
              <a-input v-model:value="billing.vat" placeholder="DE123…" />
            </a-form-item>
            <a-space>
              <a-button @click="toStep(0)">Back</a-button>
              <a-button type="primary" html-type="submit">Continue</a-button>
            </a-space>
          </a-form>
        </div>

        <!-- STEP 2: PAYMENT -->
        <div v-else-if="checkoutStep === 2">
          <a-alert type="info" show-icon message="Test payment" description="No real payment is processed." class="mb-2"/>
          <a-form layout="vertical" @finish="()=>toStep(3)" :model="card">
            <a-form-item label="Card number" name="card" :rules="[{ required:true, message:'Card required' }]">
              <a-input v-model:value="card.card" placeholder="4242 4242 4242 4242" />
            </a-form-item>
            <a-form-item label="Expiry (MM/YY)" name="exp" :rules="[{ required:true, message:'Expiry required' }]">
              <a-input v-model:value="card.exp" placeholder="12/29" />
            </a-form-item>
            <a-form-item label="CVC" name="cvc" :rules="[{ required:true, message:'CVC required' }]">
              <a-input v-model:value="card.cvc" placeholder="123" />
            </a-form-item>
            <a-checkbox v-model:checked="card.terms">
              I agree to the <a href="#" @click.prevent>Terms</a> and <a href="#" @click.prevent>Refund policy</a>.
            </a-checkbox>
            <div class="mt-2">
              <a-space>
                <a-button @click="toStep(1)">Back</a-button>
                <a-button type="primary" html-type="submit" :disabled="!card.terms">Continue</a-button>
              </a-space>
            </div>
          </a-form>
        </div>

        <!-- STEP 3: REVIEW / PAY -->
        <div v-else>
          <a-result
            v-if="orderPlaced"
            status="success"
            title="Payment successful"
            sub-title="Your course is now unlocked."
          >
            <template #extra>
              <a-button type="primary" @click="finishCheckout">Start learning</a-button>
            </template>
          </a-result>

          <template v-else>
            <a-card :bordered="false">
              <div class="meta-row"><span>Payer</span><span>{{ billing.name }} · {{ billing.email }}</span></div>
              <div class="meta-row"><span>Card</span><span>**** **** **** {{ last4(card.card) }}</span></div>
              <a-divider />
              <div class="meta-row total"><span>Charge</span><span>{{ fmt(payablePrice) }}</span></div>
            </a-card>
            <a-space class="mt-3">
              <a-button @click="toStep(2)">Back</a-button>
              <a-button type="primary" :loading="placing" @click="placeOrder">Pay {{ fmt(payablePrice) }}</a-button>
            </a-space>
          </template>
        </div>
      </a-drawer>

      <!-- MODULE COMPLETE -->
      <a-modal v-model:open="moduleDoneOpen" title="Module finished 🎉" :footer="null">
        <a-result status="success" title="Great job!" :sub-title="`You’ve completed ${totalLessons} lessons.`" />
      </a-modal>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { reactive, ref, computed, h, onMounted, onBeforeUnmount } from 'vue'
import { theme, message } from 'ant-design-vue'
import {
  PlayCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined, UndoOutlined,
  CheckCircleTwoTone, FileTextOutlined, MessageOutlined, PaperClipOutlined,
  FilePdfOutlined, FieldTimeOutlined, LockOutlined, CheckOutlined,
  BulbOutlined, CreditCardOutlined, ShoppingCartOutlined, LinkOutlined
} from '@ant-design/icons-vue'

/** ---------- Types ---------- */
type QuizOption = { text: string; correct: boolean }
type QuizQuestion = { id: string; text: string; type: 'mcq'|'tf'|'short'; options?: QuizOption[] }
type Resource = { id?: string; name?: string; title?: string; kind?: 'pdf'|'file'|'link'; url: string }
type Lesson = {
  id: string
  title: string
  type: 'video'|'reading'|'quiz'|'assignment'
  duration?: number
  content?: string
  videoUrl?: string
  rubric?: string
  resources?: Resource[]
  attachments?: any[]
  tags?: string[]
  prerequisites?: string[]
  unlockAt?: string|number|Date
  completed?: boolean
  preview?: boolean
  quiz?: { questions: QuizQuestion[] }
>>>>>>> parent of 7a6c157 (plugin)
}
type ModuleT = { title: string; lessons: Lesson[] }
type CourseT = {
  id?: string | number
  title: string
  category: string
  difficulty: 'Beginner'|'Intermediate'|'Advanced'|string
  description: string
  price: number
  discount: number
  modules: ModuleT[]
<<<<<<< HEAD
  files: any[]                 // from a-upload (uses thumbUrl/url)
}

/** ----- Source data (re-using your existing shape) ----- */
const course = reactive<CourseT>({
  title: '',
  category: '',
  difficulty: 'Beginner',
  description: '',
  price: 0,
  discount: 0,
  modules: [],
  files: []
})

/** If modules are empty (from your create form), seed a friendly demo so the UI renders */
function seedIfEmpty() {
  if (course.modules.length === 0) {
    course.title = course.title || 'Advanced Vue 3 Workshop'
    course.category = course.category || 'Programming'
    course.description = course.description || 'Learn Composition API, reactivity, and Ant Design Vue by building a production-grade dashboard.'
    course.price = course.price || 69
    course.discount = course.discount || 20
    course.modules = [
      {
        title: 'Getting Started',
        lessons: [
          { id:'m0l0', title:'Welcome & Setup', duration:8, videoUrl:'https://www.youtube.com/watch?v=dQw4w9WgXcQ', content:'<p>Install dependencies and overview.</p>', completed:false },
          { id:'m0l1', title:'Project Tour',    duration:12, videoUrl:'', content:'<p>Tour the project structure.</p>' }
        ]
      },
      {
        title: 'Composition API Deep Dive',
        lessons: [
          { id:'m1l0', title:'Refs vs Reactives', duration:18, content:'<p>Understanding reactivity.</p>' },
          { id:'m1l1', title:'Computed & Watch',  duration:15, videoUrl:'https://www.youtube.com/watch?v=9bZkp7q19f0' }
        ]
      }
    ]
  }
}
seedIfEmpty()

/** ----- Sider / Outline ----- */
const siderCollapsed = ref(false)
const filterText = ref('')
=======
  files: any[]
}

/** ---------- Demo data (seed) ---------- */
const course = reactive<CourseT>({
  title: 'Advanced Vue 3 Workshop',
  category: 'Programming',
  difficulty: 'Intermediate',
  description: 'Learn Composition API, reactivity, and Ant Design Vue by building a production-grade dashboard.',
  price: 69,
  discount: 20,
  modules: [
    {
      title: 'Getting Started',
      lessons: [
        { id:'m0l0', title:'Welcome & Setup', type:'video', duration:8, videoUrl:'https://www.youtube.com/watch?v=dQw4w9WgXcQ', content:'What you’ll learn and how to setup.', preview:true },
        { id:'m0l1', title:'Project Tour', type:'reading', duration:12, content:'Tour the project structure.', preview:true },
      ]
    },
    {
      title: 'Composition API Deep Dive',
      lessons: [
        { id:'m1l0', title:'Refs vs Reactives', type:'reading', duration:18, content:'Understanding reactivity.' },
        { id:'m1l1', title:'Computed & Watch', type:'video', duration:15, videoUrl:'https://www.youtube.com/watch?v=9bZkp7q19f0' },
        { id:'m1l2', title:'Checkpoint', type:'quiz', duration:7, quiz:{questions:[
          { id:'q1', text:'Pick the correct option', type:'mcq', options:[{text:'A',correct:true},{text:'B',correct:false}]},
          { id:'q2', text:'Vue uses Virtual DOM (T/F)', type:'tf' },
          { id:'q3', text:'One word: reactive primitive in Vue?', type:'short' }
        ]}},
        { id:'m1l3', title:'Mini Assignment', type:'assignment', duration:20, content:'Build a tiny feature.', rubric:'Completeness / Correctness / Clarity', prerequisites:['m1l2'] },
      ]
    }
  ],
  files: []
})

/** ---------- Theme / Dark mode ---------- */
const DARK_KEY = 'byway:theme:dark'
const isDark = ref(false)
function toggleDark(){ isDark.value = !isDark.value; localStorage.setItem(DARK_KEY, JSON.stringify(isDark.value)) }

/** ---------- Sider / Outline ---------- */
const siderCollapsed = ref(false)
const filterText = ref('')
const filterInputRef = ref<any>(null)
>>>>>>> parent of 7a6c157 (plugin)
const expandedKeys = ref<string[]>([])
const selectedTreeKey = ref<string>('')

const treeData = computed(() =>
  course.modules.map((m, mi) => ({
    key: `m-${mi}`,
    title: m.title || `Module ${mi+1}`,
    selectable: false,
    children: (m.lessons || []).map((l, li) => ({
      key: `l-${mi}-${li}`,
      title: h('span', { class:'lesson-node' }, [
        l.completed ? h(CheckCircleTwoTone, { twoToneColor:'#52c41a', style:'margin-right:6px' }) : null,
<<<<<<< HEAD
        h('span', l.title)
=======
        h('span', l.title),
        l.preview ? h('span', { class:'preview-pill' }, 'Preview') : null
>>>>>>> parent of 7a6c157 (plugin)
      ]),
      isLeaf: true
    }))
  }))
)

const filteredTreeData = computed(() => {
  const q = filterText.value.trim().toLowerCase()
  if (!q) return treeData.value
  return treeData.value
    .map((m:any) => {
<<<<<<< HEAD
      const kids = (m.children || []).filter((c:any) =>
        (c.title?.children?.[1] || '').toLowerCase().includes(q)
      )
=======
      const kids = (m.children || []).filter((c:any) => {
        const label = Array.isArray(c.title?.children) ? (c.title.children[1] || '').toLowerCase() : (c.title || '').toLowerCase()
        return label.includes(q)
      })
>>>>>>> parent of 7a6c157 (plugin)
      if (kids.length) return { ...m, children: kids, key: m.key }
      if ((m.title || '').toLowerCase().includes(q)) return { ...m }
      return null
    })
    .filter(Boolean) as any[]
})

function onSelectNode(keys: any) {
  const key = keys?.[0]
  if (!key) return
  selectedTreeKey.value = key
  const mi = Number(String(key).split('-')[1])
  const li = Number(String(key).split('-')[2])
  if (Number.isFinite(mi) && Number.isFinite(li)) {
    setCurrent(mi, li)
  }
}

<<<<<<< HEAD
/** ----- Current lesson / progress ----- */
const currentModuleIndex = ref(0)
const currentLessonIndex = ref(0)

const currentModule = computed<ModuleT|undefined>(() => course.modules[currentModuleIndex.value])
const currentLesson  = computed<Lesson|undefined>(() => currentModule.value?.lessons?.[currentLessonIndex.value])

const totalLessons = computed(() =>
  course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
)
const completedCount = computed(() =>
  course.modules.reduce((acc, m) => acc + (m.lessons?.filter(l => l.completed)?.length || 0), 0)
)
=======
/** ---------- Current lesson / progress ---------- */
const currentModuleIndex = ref(0)
const currentLessonIndex = ref(0)
const currentModule = computed<ModuleT|undefined>(() => course.modules[currentModuleIndex.value])
const currentLesson  = computed<Lesson|undefined>(() => currentModule.value?.lessons?.[currentLessonIndex.value])

const totalLessons = computed(() => course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0))
const completedCount = computed(() => course.modules.reduce((acc, m) => acc + (m.lessons?.filter(l => l.completed)?.length || 0), 0))
>>>>>>> parent of 7a6c157 (plugin)
const progressPercent = computed(() => totalLessons.value ? Math.round((completedCount.value / totalLessons.value)*100) : 0)

const hasPrev = computed(() => flatIndex(currentModuleIndex.value, currentLessonIndex.value) > 0)
const hasNext = computed(() => flatIndex(currentModuleIndex.value, currentLessonIndex.value) < totalLessons.value - 1)

function flatIndex(mi:number, li:number) {
  let idx = 0
  for (let i=0; i<course.modules.length; i++) {
    if (i < mi) idx += course.modules[i].lessons?.length || 0
  }
  return idx + li
}
function setFromFlatIndex(idx:number) {
  let acc = 0
  for (let mi=0; mi<course.modules.length; mi++) {
    const len = course.modules[mi].lessons?.length || 0
    if (idx < acc + len) {
      setCurrent(mi, idx - acc); return
    }
    acc += len
  }
}
function setCurrent(mi:number, li:number) {
  currentModuleIndex.value = mi
  currentLessonIndex.value = li
  selectedTreeKey.value = `l-${mi}-${li}`
<<<<<<< HEAD
  // persist resume pointer
=======
>>>>>>> parent of 7a6c157 (plugin)
  localStorage.setItem(resumeKey.value, JSON.stringify({ mi, li }))
}
const resumeKey = computed(()=>`byway-course:${course.id || course.title || 'draft'}:resume`)
function resumeLast() {
  const raw = localStorage.getItem(resumeKey.value)
<<<<<<< HEAD
  if (raw) {
    try { const { mi, li } = JSON.parse(raw); setCurrent(mi, li); return } catch{}
  }
  // fallback: first lesson
=======
  if (raw) { try { const { mi, li } = JSON.parse(raw); setCurrent(mi, li); return } catch{} }
>>>>>>> parent of 7a6c157 (plugin)
  if (totalLessons.value>0) setCurrent(0,0)
}
const resumeLabel = computed(() => {
  const raw = localStorage.getItem(resumeKey.value)
  if (!raw) return totalLessons.value ? 'start' : '—'
  try {
    const { mi, li } = JSON.parse(raw)
    const l = course.modules[mi]?.lessons?.[li]
    return l ? l.title : 'start'
  } catch { return 'start' }
})

<<<<<<< HEAD
function onToggleComplete() {
  if (!currentLesson.value) return
  const done = !!currentLesson.value.completed
  message.success(done ? 'Marked as done' : 'Marked as not done')
  persistProgress()
}
function undoComplete() {
  if (!currentLesson.value) return
  currentLesson.value.completed = false
  message.info('Reverted completion'); persistProgress()
}
function goPrev() { if (!hasPrev.value) return; setFromFlatIndex(flatIndex(currentModuleIndex.value, currentLessonIndex.value)-1) }
function goNext() { if (!hasNext.value) return; setFromFlatIndex(flatIndex(currentModuleIndex.value, currentLessonIndex.value)+1) }

const progressKey = computed(()=>`byway-course:${course.id || course.title || 'draft'}:progress`)
function persistProgress() {
  const snapshot = course.modules.map(m => (m.lessons||[]).map(l => !!l.completed))
  localStorage.setItem(progressKey.value, JSON.stringify(snapshot))
}
function restoreProgress() {
  const raw = localStorage.getItem(progressKey.value)
  if (!raw) return
  try {
    const arr:boolean[][] = JSON.parse(raw)
    arr.forEach((row, mi)=> row.forEach((val, li)=>{
      const l = course.modules[mi]?.lessons?.[li]; if (l) l.completed = val
    }))
  } catch {}
}

/** ----- Notes (per-lesson, local) ----- */
type Note = { id:string; lessonId:string; text:string; ts:number }
const notes = ref<Note[]>([])
const noteText = ref('')
const notesKey = computed(()=>`byway-course:${course.id || course.title || 'draft'}:notes`)
function loadNotes() {
  const raw = localStorage.getItem(notesKey.value); if (!raw) return
  try { notes.value = JSON.parse(raw) } catch {}
}
function saveNotes() { localStorage.setItem(notesKey.value, JSON.stringify(notes.value)) }
function addNote() {
  if (!currentLesson.value || !noteText.value.trim()) return
  notes.value.unshift({ id: cryptoId(), lessonId: currentLesson.value.id, text: noteText.value.trim(), ts: Date.now() })
  noteText.value = ''; saveNotes()
}
function delNote(id:string){ notes.value = notes.value.filter(n=>n.id!==id); saveNotes() }
const lessonNotes = computed(()=> notes.value.filter(n => n.lessonId === currentLesson.value?.id))

/** ----- Q&A (local mock) ----- */
type Qa = { id:string; lessonId?:string; q:string; a?:string; ts:number }
const qas = ref<Qa[]>([
  { id:'q1', q:'How do I share a component library across modules?', a:'Use a local package + import via alias in Vite.', ts: Date.now()-86400000 }
])
const qaText = ref('')
function addQuestion() {
  if (!qaText.value.trim()) return
  qas.value.unshift({ id: cryptoId(), lessonId: currentLesson.value?.id, q: qaText.value.trim(), ts: Date.now() })
  qaText.value = ''
}

/** ----- Tabs under player ----- */
const activeTab = ref('overview')
const tabItems = computed(() => {
  const l = currentLesson.value
  return [
    {
      key:'overview',
      label:'Overview',
      children: l
        ? h('div', { class:'tab-pad' }, [
            h('div', { class:'lesson-meta' }, [
              h('span', { class:'muted' }, `Duration: ${l?.duration ?? '—'} min`)
            ]),
            h('div', { innerHTML: safeHtml(l?.content || '<p>No content yet.</p>') })
          ])
        : h('a-empty', { description:'Select a lesson' })
    },
    {
      key:'notes',
      label: h('span', [h(FileTextOutlined), ' Notes']),
      children: l
        ? h('div', { class:'tab-pad' }, [
            h('a-textarea', {
              rows:3, value: noteText.value,
              'onUpdate:value': (v:string)=> noteText.value = v,
              placeholder:'Write a quick note for this lesson…'
            }),
            h('div', { class:'mt-2' }, [
              h('a-button', { type:'primary', onClick: addNote }, { default:()=> 'Add note' })
            ]),
            h('a-list', {
              class:'mt-2', dataSource: lessonNotes.value,
              renderItem: (n:Note) => h('a-list-item', { key:n.id }, {
                actions: [ h('a', { onClick: ()=>delNote(n.id) }, 'Delete') ],
                default: () => [
                  h('a-list-item-meta', { title: new Date(n.ts).toLocaleString(), description: n.text })
                ]
              })
            })
          ])
        : h('a-empty', { description:'Select a lesson' })
    },
    {
      key:'qa',
      label: h('span', [h(MessageOutlined), ' Q&A']),
      children: h('div', { class:'tab-pad' }, [
        h('a-textarea', {
          rows:3, value: qaText.value,
          'onUpdate:value': (v:string)=> qaText.value = v,
          placeholder:'Ask a question…'
        }),
        h('div', { class:'mt-2' }, [
          h('a-button', { type:'primary', onClick: addQuestion }, { default:()=> 'Post question' })
        ]),
        h('a-list', {
          class:'mt-2',
          dataSource: qas.value.filter(q => !currentLesson.value || q.lessonId === currentLesson.value.id || !q.lessonId),
          renderItem: (q:Qa)=> h('a-list-item', { key:q.id }, {
            default: ()=> [
              h('a-list-item-meta', { title: q.q, description: new Date(q.ts).toLocaleString() }),
              q.a ? h('div', { class:'answer' }, [h('b', 'Answer: '), q.a]) : null
            ]
          })
        })
      ])
    },
    {
      key:'resources',
      label: h('span', [h(PaperClipOutlined), ' Resources']),
      children: l
        ? h('a-list', {
            class:'tab-pad',
            dataSource: (l.resources || []).concat(normalizedCourseFiles.value),
            renderItem: (r:any)=> h('a-list-item', { key:r.id }, {
              actions: [ h('a-button', { size:'small', onClick:()=>download(r) }, { default:()=>'Download' }) ],
              default: ()=> [
                h('a-list-item-meta', {
                  avatar: r.kind==='pdf' ? h(FilePdfOutlined) : h(PaperClipOutlined),
                  title: r.name,
                  description: r.url
                })
              ]
            })
          })
        : h('a-empty', { description:'Select a lesson' })
    },
    {
      key:'transcript',
      label:'Transcript',
      children: l
        ? h('div', { class:'tab-pad muted' }, 'Transcript not available for this lesson yet.')
        : h('a-empty', { description:'Select a lesson' })
    }
  ]
})

/** ----- Helpers / UI ----- */
const rating = 4.7
const subTitle = computed(()=> `${completedCount.value}/${totalLessons.value} lessons completed • ${progressPercent.value}%`)
const discountedPrice = computed(()=> course.price * (1 - (course.discount||0)/100))
const estimatedTime = computed(()=>{
  const minutes = course.modules.flatMap(m=>m.lessons||[]).reduce((s,l)=> s + (l.duration||12), 0)
  const h = Math.floor(minutes/60), m = minutes%60
  return h ? `${h}h ${m}m` : `${m}m`
})

const coverUrl = computed(()=>{
  const f = course.files?.[0]
  return f?.url || f?.thumbUrl || ''
})
const coverStyle = computed(()=> ({
  backgroundImage: coverUrl.value ? `url('${coverUrl.value}')` : 'linear-gradient(135deg,#111,#334155)'
}))
=======
/** ---------- Tabs / notes / Q&A ---------- */
const activeTab = ref('overview')
type Note = { id:string; lessonId:string; text:string; ts:number }
const notesArr = ref<Note[]>([])
const noteText = ref('')
const qaText = ref('')
type Qa = { id:string; lessonId?:string; q:string; a?:string; ts:number }
const qas = ref<Qa[]>([{ id:'q1', q:'How do I share a component library?', a:'Use a local package + alias import in Vite.', ts: Date.now()-86400000 }])
const lessonNotes = computed(()=> notesArr.value.filter(n => n.lessonId === currentLesson.value?.id))
const qaFiltered  = computed(()=> qas.value.filter(q => !currentLesson.value || q.lessonId === currentLesson.value.id || !q.lessonId))
function addNote(){ if (!currentLesson.value || !noteText.value.trim()) return; notesArr.value.unshift({ id:uid(), lessonId: currentLesson.value.id, text: noteText.value.trim(), ts: Date.now() }); noteText.value=''; saveNotesArr() }
function delNote(id:string){ notesArr.value = notesArr.value.filter(n=>n.id!==id); saveNotesArr() }
function addQuestion(){ if (!qaText.value.trim()) return; qas.value.unshift({ id: uid(), lessonId: currentLesson.value?.id, q: qaText.value.trim(), ts: Date.now() }); qaText.value='' }

/** ---------- Per-lesson notes map for drawer ---------- */
const notes = reactive<Record<string, string>>({})
const notesArrKey = computed(()=>`byway-course:${course.id || course.title || 'draft'}:notes-list`)
const notesMapKey = computed(()=>`byway-course:${course.id || course.title || 'draft'}:notes-map`)
function saveNotesArr(){ localStorage.setItem(notesArrKey.value, JSON.stringify(notesArr.value)) }
function saveNotesMap(){ localStorage.setItem(notesMapKey.value, JSON.stringify(notes)) }

/** ---------- Pricing / coupons / checkout ---------- */
const PURCHASE_KEY = computed(()=>`byway-course:${course.id || course.title || 'draft'}:purchased`)
const COUPON_KEY   = computed(()=>`byway-course:${course.id || course.title || 'draft'}:coupon`)
const coupons: Record<string, number> = { SAVE10: 10, SAVE20: 20 }
const appliedCoupon = ref<string | null>(null)
const couponInput = ref('')
const couponPct = computed(()=> appliedCoupon.value ? (coupons[appliedCoupon.value.toUpperCase()]||0) : 0)

const baseDiscounted = computed(()=> course.price * (1 - (course.discount||0)/100))
const payablePrice = computed(()=> round2(baseDiscounted.value * (1 - couponPct.value/100)))
const effectiveDiscountPct = computed(()=>{
  if (!course.price) return 0
  return Math.max(0, Math.round(100 - (payablePrice.value / course.price) * 100))
})
function applyCoupon(){
  const c = (couponInput.value||'').toUpperCase().trim()
  if (!c) return
  if (!coupons[c]) { message.error('Invalid coupon'); return }
  appliedCoupon.value = c
  localStorage.setItem(COUPON_KEY.value, c)
  message.success(`Applied ${c}`)
}
function clearCoupon(){ appliedCoupon.value = null; localStorage.removeItem(COUPON_KEY.value) }

const purchased = ref(false)
function markPurchased(){
  purchased.value = true
  localStorage.setItem(PURCHASE_KEY.value, '1')
  message.success('Course unlocked!')
}

/** ---------- Checkout drawer logic with guarded navigation ---------- */
const checkoutOpen = ref(false)
const checkoutStep = ref(0)
const placing = ref(false)
const orderPlaced = ref(false)
const viewportWidth = ref(1024)
const isMobile = computed(()=> viewportWidth.value <= 768)

const billing = reactive({ name:'', email:'', country:'', vat:'' })
const card = reactive({ card:'', exp:'', cvc:'', terms:false })

function openCheckout(){ checkoutOpen.value = true; checkoutStep.value = 0 }
function toStep(i:number){
  if (i < checkoutStep.value) { checkoutStep.value = i; return }
  if (canAdvanceTo(i)) checkoutStep.value = i
  else message.warning('Please complete the previous step first.')
}
function onStepsChange(next:number){ toStep(next) }

/** Step validation rules */
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
function validateSummary(){ return true }
function validateDetails(){
  if (!billing.name || billing.name.trim().length < 2) return false
  if (!emailRe.test(billing.email||'')) return false
  return true
}
function luhnOk(num:string){
  const d = (num||'').replace(/\D/g,'')
  if (!d) return false
  let sum=0, alt=false
  for (let i=d.length-1;i>=0;i--){
    let n = parseInt(d[i],10)
    if (alt){ n*=2; if (n>9) n-=9 }
    sum+=n; alt=!alt
  }
  return sum%10===0
}
function expOk(exp:string){
  const m = (exp||'').match(/^\s*(\d{2})\s*\/\s*(\d{2})\s*$/)
  if (!m) return false
  const mm = +m[1], yy = +m[2]
  if (mm<1 || mm>12) return false
  const year = 2000 + yy
  const lastDay = new Date(year, mm, 0) // end of month
  const now = new Date()
  return lastDay >= new Date(now.getFullYear(), now.getMonth(), 1)
}
function cvcOk(cvc:string){ const d=(cvc||'').replace(/\D/g,''); return d.length===3 || d.length===4 }
function validatePayment(){
  if (!card.card || !luhnOk(card.card)) return false
  if (!expOk(card.exp)) return false
  if (!cvcOk(card.cvc)) return false
  if (!card.terms) return false
  return true
}
function canAdvanceTo(target:number){
  if (target <= 0) return true
  if (target === 1) return validateSummary()
  if (target === 2) return validateSummary() && validateDetails()
  if (target >= 3) return validateSummary() && validateDetails() && validatePayment()
  return false
}

function placeOrder(){
  if (!canAdvanceTo(3)) { message.error('Payment details invalid'); return }
  placing.value = true
  setTimeout(()=>{ placing.value=false; orderPlaced.value = true; markPurchased() }, 700)
}
function finishCheckout(){
  orderPlaced.value = false
  checkoutOpen.value = false
  goStartOrNext()
}

/** ---------- Locking & grading ---------- */
const PASS_RATIO = 0.6
function isLocked(l: Lesson){
  if (!purchased.value && !l.preview) return true
  if (l.unlockAt) {
    const t = new Date(l.unlockAt as any).getTime()
    if (!isNaN(t) && Date.now() < t) return true
  }
  if (l.prerequisites?.length) {
    const doneIds = new Set<string>()
    course.modules.forEach(m => m.lessons.forEach(x => x.completed && doneIds.add(x.id)))
    const unmet = l.prerequisites.some(pid => !doneIds.has(String(pid)))
    if (unmet) return true
  }
  return false
}
function lockedReason(l: Lesson){
  if (!purchased.value && !l.preview) return 'Purchase required.'
  if (l.unlockAt) {
    const t = new Date(l.unlockAt as any)
    if (!isNaN(t.getTime()) && Date.now() < t.getTime()) return `Unlocks at ${t.toLocaleString()}`
  }
  if (l.prerequisites?.length) return 'Complete the prerequisite lessons first.'
  return 'Locked'
}

const quizAnswers = ref<Record<string, Record<string, any>>>({})
const quizScores = ref<Record<string, { score:number; total:number; passed:boolean }>>({})
function getAnswer(lessonId:string, qid:string){ return quizAnswers.value?.[lessonId]?.[qid] ?? '' }
function setAnswer(lessonId:string, qid:string, val:any){ if (!quizAnswers.value[lessonId]) quizAnswers.value[lessonId]={}; quizAnswers.value[lessonId][qid]=val }
function gradeQuiz(l: Lesson){
  const qs = l.quiz?.questions || []
  let score = 0, total = 0
  const answers = quizAnswers.value[l.id] || {}
  for (const q of qs) {
    total++
    if (q.type === 'mcq') {
      const chosen = answers[q.id]
      if (typeof chosen === 'number' && q.options?.[chosen]?.correct) score++
    } else {
      if (answers[q.id] !== undefined && answers[q.id] !== '') score++
    }
  }
  const passed = total ? score/total >= PASS_RATIO : true
  quizScores.value[l.id] = { score, total, passed }
  if (passed) {
    const target = findLessonById(l.id); if (target) target.completed = true
    message.success(`Quiz passed: ${score}/${total}`)
  } else {
    message.warning(`Quiz score: ${score}/${total} (need ${(PASS_RATIO*100)|0}% )`)
  }
  persist()
}
function gradeCurrentQuiz(){ if (currentLesson.value) gradeQuiz(currentLesson.value) }

/** ---------- Misc helpers ---------- */
const totalMinutes = computed(()=>{
  return course.modules.flatMap(m=>m.lessons||[]).reduce((s,l)=> s + (l.duration||0), 0)
})
const subTitle = computed(()=> `${completedCount.value}/${totalLessons.value} lessons completed • ${progressPercent.value}%`)
const estimatedTime = computed(()=>{
  const minutes = totalMinutes.value
  const h = Math.floor(minutes/60), m = minutes%60
  return h ? `${h}h ${m}m` : `${m}m`
})
const coverUrl = computed(()=>{
  const f = course.files?.[0]; return f?.url || f?.thumbUrl || ''
})
const coverStyle = computed(()=> ({ backgroundImage: coverUrl.value ? `url('${coverUrl.value}')` : 'linear-gradient(135deg,#111,#334155)' }))
>>>>>>> parent of 7a6c157 (plugin)
const normalizedCourseFiles = computed(()=> (course.files || []).map((f:any,i:number)=>({
  id:`f-${i}`,
  name: f.name || 'Course asset',
  kind: (String(f.name||'').toLowerCase().endsWith('.pdf') ? 'pdf' : 'file') as 'pdf'|'file',
  url: f.url || f.thumbUrl || '#'
})))
<<<<<<< HEAD

function renderMiniLesson(l:Lesson, mi:number, li:number){
  return h('a-list-item', {
    class: ['mini-lesson', l.completed && 'done'].filter(Boolean).join(' '),
    onClick: ()=> setCurrent(mi, li)
  }, {
    default:()=> [
      h('a-list-item-meta', {
        avatar: l.completed ? h(CheckCircleTwoTone, { twoToneColor:'#52c41a' }) : h(PlayCircleOutlined),
        title: l.title,
        description: (l.duration ? `${l.duration} min` : '')
      })
    ]
  })
}
function embedUrl(url:string){
  // naive transform for YouTube links; otherwise return as-is
=======
const mergedResources = computed(()=> (currentLesson.value?.resources || []).concat(normalizedCourseFiles.value))

function isActive(mi:number, li:number){ return mi===currentModuleIndex.value && li===currentLessonIndex.value }
function embedUrl(url:string){
>>>>>>> parent of 7a6c157 (plugin)
  if (/youtube\.com|youtu\.be/.test(url)) {
    const id = url.match(/(?:v=|be\/)([A-Za-z0-9_-]{6,})/)?.[1]
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : url
  }
  return url
}
<<<<<<< HEAD
function safeHtml(html:string){ return html } // assume sanitized upstream
function download(r:{name:string;url:string}){ message.success(`Downloading ${r.name}…`) }

/** ----- Lifecycle / persistence ----- */
onMounted(()=>{
  restoreProgress()
  // try select resume or first lesson
  resumeLast()
  // expand all modules initially
  expandedKeys.value = course.modules.map((_,i)=>`m-${i}`)
  loadNotes()
})

// keep notes/progress when lesson completion toggles
watch(()=>course.modules, ()=>{ /* deep watch not set; explicit persist via onToggleComplete */ }, { deep:true })
/** ----- Misc ----- */
function cryptoId(){ return Math.random().toString(36).slice(2,9) }
</script>

<style scoped>
.course-internal { min-height: 100vh; }
=======
const ytEmbed = embedUrl
function safeHtml(html:string){ return html }
function download(r:{name?:string;title?:string;url:string}){ message.success(`Downloading ${(r.name||r.title||'file')}…`) }

function toggleDone(lessonId: string){
  const l = findLessonById(lessonId)
  if (!l) return
  l.completed = !l.completed
  message.success(l.completed ? 'Marked as done' : 'Marked as not done')
  persist()
}
function onToggleComplete(){ if (!currentLesson.value) return; message.success(currentLesson.value.completed ? 'Marked as done' : 'Marked as not done'); persist() }
function undoComplete(){ if (!currentLesson.value) return; currentLesson.value.completed = false; message.info('Reverted completion'); persist() }
function goPrev(){ if (!hasPrev.value) return; setFromFlatIndex(flatIndex(currentModuleIndex.value, currentLessonIndex.value)-1) }
function goNext(){ if (!hasNext.value) return; setFromFlatIndex(flatIndex(currentModuleIndex.value, currentLessonIndex.value)+1) }
function goStartOrNext(){ const next = firstAvailableIncomplete() || course.modules[0]?.lessons?.[0]; if (next) goToById(next.id) }
const nextCta = computed(()=> firstAvailableIncomplete() ? 'Continue' : 'Review')
function firstAvailableIncomplete(){
  for (const m of course.modules) {
    for (const l of m.lessons) {
      if (!isLocked(l) && !l.completed) return l
    }
  }
  for (const m of course.modules) for (const l of m.lessons) if (!isLocked(l)) return l
  return null
}
function goToById(id:string){
  for (let mi=0; mi<course.modules.length; mi++){
    const li = course.modules[mi].lessons.findIndex(l=>l.id===id)
    if (li>=0){ setCurrent(mi, li); return }
  }
}
function findLessonById(id:string){ for (const m of course.modules){ const l=m.lessons.find(x=>x.id===id); if(l) return l } return null }

function assignmentSubmitted(lessonId: string){ return !!assignmentLinks.value[lessonId] }
const assignmentLinks = ref<Record<string, string>>({})
function submitAssignment(lessonId: string){
  if (!assignmentLinks.value[lessonId]) return message.error('Please add a link.')
  const l = findLessonById(lessonId); if (l) l.completed = true
  message.success('Assignment submitted'); persist()
}

/** ---------- Persistence ---------- */
const progressKey = computed(()=>`byway-course:${course.id || course.title || 'draft'}:progress`)
const qnaKey = computed(()=>`byway-course:${course.id || course.title || 'draft'}:qa`)
function persist(){
  const snapshot = course.modules.map(m => (m.lessons||[]).map(l => !!l.completed))
  localStorage.setItem(progressKey.value, JSON.stringify(snapshot))
  saveNotesArr(); saveNotesMap()
}
function restoreProgress(){
  const raw = localStorage.getItem(progressKey.value); if (raw) {
    try {
      const arr:boolean[][] = JSON.parse(raw)
      arr.forEach((row, mi)=> row.forEach((val, li)=>{
        const l = course.modules[mi]?.lessons?.[li]; if (l) l.completed = val
      }))
    } catch {}
  }
  const listRaw = localStorage.getItem(notesArrKey.value); if (listRaw){ try{ notesArr.value = JSON.parse(listRaw) } catch {} }
  const mapRaw = localStorage.getItem(notesMapKey.value); if (mapRaw){ try{ Object.assign(notes, JSON.parse(mapRaw)) } catch {} }
}

/** ---------- Lifecycle ---------- */
const shortcutsOpen = ref(false)
const resourcesOpen = ref(false)
const notesOpen = ref(false)
const moduleDoneOpen = ref(false)

function onKey(e: KeyboardEvent){
  if (e.key === '/' && !e.metaKey && !e.ctrlKey){ e.preventDefault(); filterInputRef.value?.focus?.() }
  if (e.key.toLowerCase() === 'j'){ goNext() }
  if (e.key.toLowerCase() === 'k'){ goPrev() }
  if (e.key === ' ' && !['INPUT','TEXTAREA'].includes((e.target as HTMLElement)?.tagName)){ e.preventDefault(); if (currentLesson.value) toggleDone(currentLesson.value.id) }
}
function onResize(){ if (typeof window !== 'undefined') viewportWidth.value = window.innerWidth }

onMounted(()=>{
  try{ isDark.value = JSON.parse(localStorage.getItem(DARK_KEY) || 'false') } catch {}
  purchased.value = localStorage.getItem(PURCHASE_KEY.value) === '1'
  const savedCoupon = localStorage.getItem(COUPON_KEY.value); if (savedCoupon) appliedCoupon.value = savedCoupon
  restoreProgress()
  resumeLast()
  expandedKeys.value = course.modules.map((_,i)=>`m-${i}`)
  if (typeof window !== 'undefined'){
    onResize()
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKey)
  }
})
onBeforeUnmount(()=>{
  if (typeof window !== 'undefined'){
    window.removeEventListener('resize', onResize)
    window.removeEventListener('keydown', onKey)
  }
})

/** ---------- Small utils ---------- */
function uid(){ return Math.random().toString(36).slice(2,9) }
function round2(n:number){ return Math.round(n*100)/100 }
function fmt(n:number){ return n.toLocaleString(undefined, { style:'currency', currency:'EUR' }) }
function last4(cardNum:string){ const d = (cardNum||'').replace(/\s+/g,''); return d.slice(-4) || '0000' }
function addToCart(){ message.success('Added to cart (demo).') }
function goBack(){ history.back() }
</script>

<style scoped>
.course-learn { min-height: 100vh; background:#f6f8fb; }
.is-dark { background:#0b1220; }
.is-dark .header, .is-dark .content, .is-dark .lesson-sider, .is-dark .ant-card { background:#0f172a !important; color:#cbd5e1; }
.is-dark .sider { background:#0a1423; }
.is-dark .muted { color:#94a3b8; }
.is-dark .ant-typography, .is-dark .ant-statistic { color:#cbd5e1; }
.is-dark .ant-list-item-meta-title a, .is-dark .ant-list-item-meta-title { color:#e2e8f0; }

>>>>>>> parent of 7a6c157 (plugin)
.sider { background:#0b1b2b; color:#cbd5e1; }
.cover { height: 160px; background-size: cover; background-position:center; position:relative; }
.cover-gradient { position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,.0),rgba(0,0,0,.55)); }
.cover-meta { position:absolute; left:16px; right:16px; bottom:12px; color:#fff; }
.cover-title { font-weight:700; font-size:16px; line-height:1.2; }
.cover-tags { margin-top:8px; display:flex; gap:6px; flex-wrap:wrap; }

.sider-body { padding: 12px 12px 16px; }
.sider-actions { margin-top: 8px; }
.mt-2 { margin-top: 12px; }
.mt-3 { margin-top: 16px; }
.mb-2 { margin-bottom: 12px; }
.mb-3 { margin-bottom: 16px; }

.header { background:#fff; padding: 12px 20px; border-bottom:1px solid #eef2f7; }
.content { padding: 20px; background:#f6f8fb; }

<<<<<<< HEAD
.player { width:100%; aspect-ratio:16/9; background:#000; display:flex; align-items:center; justify-content:center; border-radius:8px; overflow:hidden; }
.player-iframe { width:100%; height:100%; border:0; }
.player-actions { margin-top:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; }

.muted { color:#94a3b8; }
.meta-row { display:flex; justify-content:space-between; margin:4px 0; }
.price-row { display:flex; align-items:center; gap:10px; }
.price { font-weight:700; font-size:18px; }

.lesson-node { display:flex; align-items:center; gap:6px; }
.mini-lesson.done :deep(.ant-list-item-meta-title){ text-decoration: line-through; color:#94a3b8; }

.tab-pad { padding: 8px 0; }
.answer { background:#f6f8fb; padding:8px 10px; border-radius:6px; }

.sider :deep(.ant-tree){ background:transparent; color:#cbd5e1; }
.sider :deep(.ant-tree-treenode-selected) { background: rgba(255,255,255,0.08) !important; }
=======
.player-actions { margin-top:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; }
.muted { color:#64748b; }
.meta-row { display:flex; justify-content:space-between; margin:6px 0; }
.meta-row.total { font-weight:700; }
.price-row { display:flex; align-items:center; gap:10px; }
.price { font-weight:800; font-size:20px; }
.small { font-size:12px; }

.lesson-node { display:flex; align-items:center; gap:6px; }
.preview-pill { margin-left:8px; font-size:11px; padding:2px 6px; border-radius:10px; background:#e6fffb; color:#08979c; }
.is-dark .preview-pill { background:#073042; color:#86e7f0; }

.tab-pad { padding: 8px 0; }
.answer { background:#f6f8fb; padding:8px 10px; border-radius:6px; }
.is-dark .answer { background:#162235; }

.player { width:100%; aspect-ratio:16/9; background:#000; display:flex; align-items:center; justify-content:center; border-radius:8px; overflow:hidden; }
.video-wrap { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; }
.video-wrap iframe { position:absolute; top:0; left:0; width:100%; height:100%; }
.video-fallback { background:#f5f5f5; border-radius:8px; padding:8px 12px; word-break:break-all; }
.is-dark .video-fallback { background:#0f172a; }

.mini-lesson.done :deep(.ant-list-item-meta-title){ text-decoration: line-through; color:#94a3b8; }
.mini-lesson.active { background:#f0f9ff; border-radius:6px; }
.is-dark .mini-lesson.active { background:#0b1f37; }

.lesson-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:8px; }
.lesson-title { margin: 0; }

.lesson-sider { background: #fff; border-radius: 8px; padding: 12px; margin-right: 12px; }
.is-dark .lesson-sider { background:#0f172a; }

.quiz-item .q-text { margin-bottom: 8px; font-weight: 600; }
.mcq-row { padding: 6px 0; }

.sider :deep(.ant-tree){ background:transparent; color:#cbd5e1; }
.sider :deep(.ant-tree-treenode-selected) { background: rgba(255,255,255,0.08) !important; }

.is-dark :deep(.ant-input), .is-dark :deep(.ant-select-selector), .is-dark :deep(.ant-textarea){ background:#0b1426; color:#cbd5e1; }
>>>>>>> parent of 7a6c157 (plugin)
</style>
