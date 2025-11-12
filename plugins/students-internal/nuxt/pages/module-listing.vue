<template>
  <a-config-provider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
    <a-layout :class="['student-wrap', isDark ? 'is-dark' : '']" data-test-id="student-wrap">
      <!-- GLOBAL STATUS BANNERS -->
      <div class="global-banners">
        <a-alert
          v-if="!isOnline"
          type="warning"
          banner
          show-icon
          message="You're offline. Working in mock/local mode; changes will sync when you reconnect."
          data-test-id="offline-banner"
        />
        <a-alert
          v-if="usingMocks"
          type="info"
          banner
          show-icon
          :message="`Mock data active${mockReason ? ` · ${mockReason}` : ''}`"
          data-test-id="mock-banner"
        />
      </div>

      <!-- HEADER -->
      <a-page-header
        class="page-header"
        :title="course.title || t('Course')"
        :sub-title="moduleT?.title || (hasModules ? t('Choose a module') : t('Overview'))"
        data-test-id="page-header"
      >
        <template #tags>
          <a-tag color="blue">{{ course.category || '—' }}</a-tag>
          <a-tag color="gold">{{ course.difficulty || '—' }}</a-tag>
          <a-tag v-if="totalMinutes" color="blue"><FieldTimeOutlined /> {{ totalMinutes }} {{ t('min') }}</a-tag>
          <a-badge :status="isOnline ? 'processing' : 'default'" :text="isOnline ? t('Online') : t('Offline')" />
          <a-badge :status="usingMocks ? 'warning' : 'success'" :text="usingMocks ? t('Mock') : t('Live')" class="ml-1" />
        </template>

        <template #extra>
          <a-space wrap>
            <a-tooltip :title="t('Course progress')">
              <a-progress type="circle" :percent="progressPercent" :size="32" />
            </a-tooltip>

            <a-select
              v-if="hasModules"
              :value="selectedModuleId"
              style="min-width: 220px"
              placeholder="Select module"
              :disabled="loadingModule"
              @change="switchModule"
              data-test-id="module-switcher"
            >
              <a-select-option
                v-for="m in modules"
                :key="m.id"
                :value="m.id"
              >
                {{ m.title }}
                <span class="muted">· {{ m.lessonCount ?? '—' }} {{ t('lessons') }}</span>
              </a-select-option>
            </a-select>

            <a-dropdown trigger="click">
              <a-button>
                <template #icon><SettingOutlined /></template>
                {{ t('View') }}
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="isDark = !isDark">
                    <BulbOutlined />
                    <span class="ml-1">{{ t('Toggle dark') }}</span>
                  </a-menu-item>
                  <a-menu-item @click="increaseFont">
                    <FontSizeOutlined />
                    <span class="ml-1">{{ t('Increase font size') }}</span>
                  </a-menu-item>
                  <a-menu-item @click="decreaseFont">
                    <FontSizeOutlined />
                    <span class="ml-1">{{ t('Decrease font size') }}</span>
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item @click="openShortcuts = true">
                    <KeyboardOutlined />
                    <span class="ml-1">{{ t('Keyboard shortcuts') }}</span>
                  </a-menu-item>
                  <a-menu-item @click="openDebug = true">
                    <BugOutlined />
                    <span class="ml-1">{{ t('Debug & mocks') }}</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>

            <a-button type="default" @click="openImportExport = true">
              <template #icon><CloudSyncOutlined /></template>
              {{ t('Import / Export') }}
            </a-button>

            <a-tooltip :title="t('Resume last lesson')">
              <a-button type="primary" @click="resumeLast" :disabled="!lessons.length" data-test-id="resume-button">
                <template #icon><PlayCircleOutlined /></template>
                {{ t('Resume') }}
              </a-button>
            </a-tooltip>
          </a-space>
        </template>
      </a-page-header>

      <a-layout>
        <!-- LEFT SIDER -->
        <a-layout-sider
          width="320"
          class="left-sider"
          collapsible
          v-model:collapsed="siderCollapsed"
          :collapsed-width="60"
          data-test-id="left-sider"
        >
          <div class="sider-inner">
            <div class="cover" :style="coverStyle" data-test-id="cover">
              <div class="cover-gradient"></div>
              <div class="cover-meta" v-if="!siderCollapsed">
                <div class="cover-title">{{ course.title || t('Course') }}</div>
                <div class="cover-tags">
                  <a-tag v-if="course.category" color="blue">{{ course.category }}</a-tag>
                  <a-tag v-if="course.difficulty" color="gold">{{ course.difficulty }}</a-tag>
                </div>
              </div>
            </div>

            <a-select
              v-if="hasModules"
              class="mt-2"
              size="small"
              :value="selectedModuleId"
              :disabled="loadingModule"
              style="width:100%"
              @change="switchModule"
              data-test-id="module-switcher-mini"
            >
              <a-select-option v-for="m in modules" :key="m.id" :value="m.id">
                {{ m.title }}
              </a-select-option>
            </a-select>

            <a-input-search
              v-model:value="filter"
              :placeholder="t('Search lessons')"
              allow-clear
              class="mt-2"
              data-test-id="lesson-search"
            />

            <div class="mt-2" v-if="!siderCollapsed">
              <a-space wrap>
                <a-segmented
                  v-model:value="filterType"
                  :options="[
                    { label: t('All'), value: 'all' },
                    { label: t('Video'), value: 'video' },
                    { label: t('Reading'), value: 'reading' },
                    { label: t('Quiz'), value: 'quiz' },
                    { label: t('Assign.'), value: 'assignment' },
                    { label: t('Lab'), value: 'lab' }
                  ]"
                  data-test-id="type-filter"
                />
                <a-checkbox v-model:checked="hideCompleted" data-test-id="hide-completed">
                  {{ t('Hide completed') }}
                </a-checkbox>
                <a-dropdown trigger="click">
                  <a-button size="small">
                    <SortAscendingOutlined />
                    <span class="ml-1">{{ t('Sort') }}</span>
                  </a-button>
                  <template #overlay>
                    <a-menu v-model:selectedKeys="sortKeyArr" @click="onSortChange">
                      <a-menu-item key="title">{{ t('Title') }}</a-menu-item>
                      <a-menu-item key="duration">{{ t('Duration') }}</a-menu-item>
                      <a-menu-item key="type">{{ t('Type') }}</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-space>
            </div>

            <a-empty v-if="!currentModuleReady" :description="t('Pick a module to see its lessons')" class="mt-2" />
            <a-list
              v-else
              class="mt-2"
              size="small"
              :data-source="filteredLessons"
              :row-key="(l) => l.id"
              data-test-id="lesson-list"
            >
              <template #renderItem="{ item: l, index: i }">
                <a-list-item
                  :class="['lesson-row', currentIndex === i && 'active']"
                  @click="select(i)"
                  :data-test-id="`lesson-row-${i}`"
                >
                  <a-list-item-meta
                    :title="l.title || t('Untitled lesson')"
                    :description="(l.type || '—') + (l.duration ? ` · ${l.duration} ${t('min')}` : '')"
                  />
                  <template #actions>
                    <a-tag v-if="isCompleted(l.id)" color="green">{{ t('Done') }}</a-tag>
                    <a-tag v-else-if="isLocked(l)" color="red"><LockOutlined /> {{ t('Locked') }}</a-tag>
                    <a-tag v-else-if="l.preview" color="cyan">{{ t('Preview') }}</a-tag>
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </div>
        </a-layout-sider>

        <!-- CENTER CONTENT -->
        <a-layout-content
          class="content"
          :style="{ fontSize: `${fontScale}px` }"
          data-test-id="content"
        >
          <!-- Overview -->
          <template v-if="!currentModuleReady">
            <a-breadcrumb class='mb-3'><a-breadcrumb-item to='/students'>Students</a-breadcrumb-item><a-breadcrumb-item>Modules</a-breadcrumb-item></a-breadcrumb>
  <a-card :loading="loadingCourse" :title="t('Course overview')" data-test-id="overview-card">
              <p class="muted">{{ t('Browse modules and jump in — everything runs in this page.') }}</p>
              <a-empty v-if="!hasModules && !loadingCourse" :description="t('No modules yet')" />
              <a-row :gutter="16" v-else>
                <a-col v-for="m in modules" :key="m.id" :xs="24" :sm="12" :md="8">
                  <a-breadcrumb class='mb-3'><a-breadcrumb-item to='/students'>Students</a-breadcrumb-item><a-breadcrumb-item>Modules</a-breadcrumb-item></a-breadcrumb>
  <a-card hoverable class="mt-2" @click="switchModule(m.id)" data-test-id="module-card">
                    <b>{{ m.title }}</b>
                    <div class="muted">
                      {{ m.lessonCount ?? 0 }} {{ t('lessons') }}
                      <template v-if="m.minutes"> · ~{{ m.minutes }} {{ t('min') }}</template>
                    </div>
                  </a-card>
                </a-col>
              </a-row>
              <a-divider />
              <div class="enroll-cta" v-if="!isEnrolledCourse">
                <a-result
                  status="info"
                  :title="t('Enroll to unlock full access')"
                  :sub-title="t('You can still watch previews and read public materials.')"
                >
                  <template #extra>
                    <a-space>
                      <a-button type="primary" @click="mockEnroll">{{ t('Enroll now') }}</a-button>
                      <a-button @click="openPricing = true">{{ t('See pricing') }}</a-button>
                    </a-space>
                  </template>
                </a-result>
              </div>
            </a-card>
          </template>

          <!-- Lesson viewer -->
          <template v-else>
            <a-spin :spinning="loadingModule">
              <a-breadcrumb class='mb-3'><a-breadcrumb-item to='/students'>Students</a-breadcrumb-item><a-breadcrumb-item>Modules</a-breadcrumb-item></a-breadcrumb>
  <a-card v-if="currentLesson" :title="currentLesson.title || t('Lesson')" data-test-id="lesson-card">
                <template #extra>
                  <a-space>
                    <a-tag>{{ (currentLesson.type || '').toUpperCase() }}</a-tag>
                    <a-tag v-if="currentLesson.preview" color="cyan">{{ t('Preview') }}</a-tag>
                    <span class="muted"><FieldTimeOutlined /> {{ currentLesson.duration || 0 }} {{ t('min') }}</span>
                    <a-tooltip :title="t('Bookmark current lesson')">
                      <a-button size="small" @click="bookmarkCurrent" data-test-id="bookmark-btn">
                        <template #icon><BookOutlined /></template>
                      </a-button>
                    </a-tooltip>
                    <a-tooltip :title="t('Print lesson')">
                      <a-button size="small" @click="printLesson">
                        <template #icon><PrinterOutlined /></template>
                      </a-button>
                    </a-tooltip>
                  </a-space>
                </template>

                <!-- Locked -->
                <a-result
                  v-if="isLocked(currentLesson) && !currentLesson.preview"
                  status="warning"
                  :title="t('This lesson is locked')"
                  data-test-id="locked-result"
                >
                  <template #subTitle>
                    <div class="muted">
                      <div v-if="currentLesson.prerequisites?.length">
                        {{ t('Complete prerequisite lesson(s):') }}
                        <ul class="mt-1">
                          <li v-for="pid in currentLesson.prerequisites" :key="pid">
                            <span :class="['preq', isCompleted(pid) && 'ok']">
                              {{ labelForLesson(pid) || pid }}
                              <template v-if="isCompleted(pid)"> ✓</template>
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div v-if="unlockAtDate(currentLesson)">
                        {{ t('Unlocks at:') }} {{ unlockAtDate(currentLesson) }}
                      </div>
                    </div>
                  </template>
                  <template #extra>
                    <a-space>
                      <a-button type="primary" v-if="!isEnrolledCourse" @click="mockEnroll">{{ t('Enroll') }}</a-button>
                      <a-button v-else @click="resumeLast">{{ t('Go to next available') }}</a-button>
                    </a-space>
                  </template>
                </a-result>

                <!-- Content -->
                <template v-else>
                  <!-- VIDEO -->
                  <div v-if="currentLesson.type === 'video'">
                    <div class="video-controls">
                      <a-space>
                        <a-segmented
                          v-model:value="videoSpeed"
                          :options="[0.75, 1, 1.25, 1.5, 1.75, 2].map(v => ({ label: `${v}x`, value: v }))"
                          data-test-id="video-speed"
                        />
                        <a-button size="small" @click="bookmarkTimestamp" data-test-id="bookmark-ts">
                          <ClockCircleOutlined /> {{ t('Bookmark timestamp') }}
                        </a-button>
                      </a-space>
                    </div>

                    <div v-if="ytEmbed(currentLesson.videoUrl)" class="video-wrap">
                      <iframe
                        :src="ytEmbed(currentLesson.videoUrl)"
                        frameborder="0"
                        allowfullscreen
                        data-test-id="yt-iframe"
                      />
                    </div>
                    <div v-else class="video-fallback">
                      <a-typography-paragraph>
                        {{ t('Video URL:') }}
                        <a :href="currentLesson.videoUrl" target="_blank">{{ currentLesson.videoUrl || '—' }}</a>
                      </a-typography-paragraph>
                      <video
                        v-if="currentLesson.videoUrl"
                        ref="html5Video"
                        controls
                        @ratechange="syncVideoSpeed"
                        :playbackRate="videoSpeed"
                        style="width:100%; border-radius:10px;"
                        data-test-id="html5-video"
                      >
                        <source :src="currentLesson.videoUrl" type="video/mp4" />
                      </video>
                    </div>

                    <a-divider>{{ t('Notes') }}</a-divider>
                    <a-typography-paragraph style="white-space: pre-wrap">
                      {{ currentLesson.content }}
                    </a-typography-paragraph>
                  </div>

                  <!-- READING -->
                  <div v-else-if="currentLesson.type === 'reading'">
                    <a-collapse :bordered="false" class="reading-collapse">
                      <a-collapse-panel key="content" :header="t('Lesson content')">
                        <a-typography-paragraph style="white-space: pre-wrap">
                          {{ currentLesson.content || t('No content') }}
                        </a-typography-paragraph>
                      </a-collapse-panel>
                      <a-collapse-panel key="highlights" :header="t('Highlights')">
                        <a-empty v-if="!notes[currentLesson.id]?.highlights?.length" :description="t('No highlights')" />
                        <a-list v-else :data-source="notes[currentLesson.id].highlights" size="small">
                          <template #renderItem="{ item }">
                            <a-list-item>{{ item }}</a-list-item>
                          </template>
                        </a-list>
                      </a-collapse-panel>
                    </a-collapse>
                  </div>

                  <!-- ASSIGNMENT -->
                  <div v-else-if="currentLesson.type === 'assignment'">
                    <a-alert type="info" show-icon :message="t('Assignment brief')" class="mb-1" />
                    <a-typography-paragraph style="white-space: pre-wrap">
                      {{ currentLesson.content || t('No brief') }}
                    </a-typography-paragraph>
                    <a-alert
                      v-if="currentLesson.rubric"
                      type="success"
                      show-icon
                      :message="t('Rubric')"
                      :description="currentLesson.rubric"
                    />
                    <a-divider />
                    <a-space>
                      <a-button type="primary" @click="openSubmitDrawer" data-test-id="open-submit-drawer">{{ t('Submit assignment') }}</a-button>
                      <a-button @click="markComplete(currentLesson, true)" :disabled="isCompleted(currentLesson.id)">
                        {{ t('Mark complete') }}
                      </a-button>
                    </a-space>
                  </div>

                  <!-- QUIZ -->
                  <div v-else-if="currentLesson.type === 'quiz'">
                    <a-alert type="info" show-icon :message="t('Answer the questions and submit.')" class="mb-2" />
                    <div v-for="(q, qi) in (currentLesson.quiz?.questions || [])" :key="q.id" class="quiz-q">
                      <b>Q{{ qi + 1 }}</b>: {{ q.text || t('(empty)') }}
                      <div v-if="q.type === 'mcq'" class="mt-1">
                        <a-checkbox-group
                          v-model:value="quizState[q.id]"
                          :options="(q.options || []).map((o, oi) => ({ label: o.text || `${t('Option')} ${oi+1}`, value: oi }))"
                          data-test-id="quiz-mcq"
                        />
                      </div>
                      <div v-else-if="q.type === 'tf'" class="mt-1">
                        <a-radio-group v-model:value="quizState[q.id]" data-test-id="quiz-tf">
                          <a-radio :value="true">{{ t('True') }}</a-radio>
                          <a-radio :value="false">{{ t('False') }}</a-radio>
                        </a-radio-group>
                      </div>
                      <div v-else class="mt-1">
                        <a-input v-model:value="quizState[q.id]" :placeholder="t('Your answer')" data-test-id="quiz-short" />
                      </div>
                      <a-divider class="my-1" />
                    </div>
                    <a-space>
                      <a-button type="primary" @click="submitQuiz" :loading="quizSubmitting" data-test-id="submit-quiz">
                        {{ t('Submit quiz') }}
                      </a-button>
                      <a-button @click="markComplete(currentLesson, true)" :disabled="isCompleted(currentLesson.id)">
                        {{ t('Mark complete') }}
                      </a-button>
                    </a-space>
                  </div>

                  <!-- LAB -->
                  <div v-else-if="currentLesson.type === 'lab'">
                    <a-alert
                      type="info"
                      show-icon
                      :message="t('Interactive lab')"
                      :description="t('Your lab environment opens in a new tab/window.')"
                      class="mb-1"
                    />
                    <a-space>
                      <a-button type="primary" @click="openLab(currentLesson)" data-test-id="open-lab">{{ t('Open lab') }}</a-button>
                      <a-button @click="markComplete(currentLesson, true)" :disabled="isCompleted(currentLesson.id)">
                        {{ t('Mark complete') }}
                      </a-button>
                    </a-space>
                  </div>

                  <!-- FALLBACK -->
                  <div v-else>
                    <a-typography-text type="secondary">{{ t('Unsupported lesson type.') }}</a-typography-text>
                  </div>
                </template>

                <a-divider />
                <!-- Lesson-level quick notes -->
                <a-form layout="vertical" class="mt-2" @finish.prevent>
                  <a-form-item :label="t('Your notes for this lesson')">
                    <a-textarea
                      v-model:value="notes[currentLesson.id].text"
                      :rows="4"
                      @change="persistNotes(currentLesson.id)"
                      data-test-id="lesson-notes"
                    />
                  </a-form-item>
                </a-form>

                <div class="nav-actions">
                  <a-space wrap>
                    <a-button
                      v-if="currentLesson"
                      :type="isCompleted(currentLesson.id) ? 'default' : 'primary'"
                      @click="toggleComplete(currentLesson)"
                      data-test-id="toggle-complete"
                    >
                      <template #icon><CheckOutlined /></template>
                      {{ isCompleted(currentLesson.id) ? t('Mark as incomplete') : t('Mark as complete') }}
                    </a-button>
                    <a-button @click="prevLesson" :disabled="currentIndex <= 0" data-test-id="prev-lesson">
                      {{ t('Previous') }}
                    </a-button>
                    <a-button type="primary" @click="nextLesson" :disabled="currentIndex >= lessons.length - 1" data-test-id="next-lesson">
                      {{ t('Next') }} <ArrowRightOutlined />
                    </a-button>

                    <a-checkbox v-model:checked="autoNext" class="ml-2" data-test-id="auto-next">
                      {{ t('Auto-next on complete') }}
                    </a-checkbox>
                  </a-space>

                  <a-rate v-model:value="ratings[currentLesson.id]" allow-half @change="persistRatings" />
                </div>
              </a-card>

              <a-empty v-else :description="t('No lessons found')" />
            </a-spin>
          </template>
        </a-layout-content>

        <!-- RIGHT SIDER -->
        <a-layout-sider
          width="320"
          class="right-sider"
          collapsible
          v-model:collapsed="rightCollapsed"
          :collapsed-width="60"
          data-test-id="right-sider"
        >
          <div class="right-inner">
            <a-tabs v-model:activeKey="rightTab" size="small" :animated="false">
              <a-tab-pane key="progress" :tab="t('Progress')" data-test-id="tab-progress">
                <a-breadcrumb class='mb-3'><a-breadcrumb-item to='/students'>Students</a-breadcrumb-item><a-breadcrumb-item>Modules</a-breadcrumb-item></a-breadcrumb>
  <a-card size="small" :title="t('Progress')" :bordered="false" body-style="padding:0;">
                  <a-steps size="small" direction="vertical" :current="currentIndex">
                    <a-step
                      v-for="(l, i) in lessons"
                      :key="l.id"
                      :title="l.title || `${t('Lesson')} ${i+1}`"
                      :description="l.duration ? `${l.duration} ${t('min')}` : ''"
                      :status="isCompleted(l.id) ? 'finish' : (i === currentIndex ? 'process' : 'wait')"
                    />
                  </a-steps>
                </a-card>
              </a-tab-pane>

              <a-tab-pane key="resources" :tab="t('Resources')">
                <a-breadcrumb class='mb-3'><a-breadcrumb-item to='/students'>Students</a-breadcrumb-item><a-breadcrumb-item>Modules</a-breadcrumb-item></a-breadcrumb>
  <a-card v-if="currentLesson" size="small" :title="t('Resources')" class="mt-2">
                  <a-empty v-if="!currentLesson.resources?.length" :description="t('No resources')" />
                  <a-list v-else size="small" :data-source="currentLesson.resources">
                    <template #renderItem="{ item }">
                      <a-list-item>
                        <a :href="item.url" target="_blank" @click="trackResource(item)">{{ item.title || item.name || t('Resource') }}</a>
                      </a-list-item>
                    </template>
                  </a-list>
                </a-card>

                <a-breadcrumb class='mb-3'><a-breadcrumb-item to='/students'>Students</a-breadcrumb-item><a-breadcrumb-item>Modules</a-breadcrumb-item></a-breadcrumb>
  <a-card v-if="currentLesson" size="small" class="mt-2" :title="t('Attachments')">
                  <a-empty v-if="!currentLesson.attachments?.length" :description="t('No attachments')" />
                  <a-list v-else size="small" :data-source="currentLesson.attachments">
                    <template #renderItem="{ item }">
                      <a-list-item>
                        <a :href="item.url" target="_blank">{{ item.name || t('Attachment') }}</a>
                      </a-list-item>
                    </template>
                  </a-list>
                </a-card>
              </a-tab-pane>

              <a-tab-pane key="notes" :tab="t('Notes')">
                <a-breadcrumb class='mb-3'><a-breadcrumb-item to='/students'>Students</a-breadcrumb-item><a-breadcrumb-item>Modules</a-breadcrumb-item></a-breadcrumb>
  <a-card size="small" :title="t('Your notes')" class="mt-2">
                  <a-form layout="vertical" @finish.prevent>
                    <a-form-item :label="t('Lesson notes')">
                      <a-textarea
                        v-model:value="notes[currentLesson?.id || 'global'].text"
                        :rows="6"
                        @change="currentLesson && persistNotes(currentLesson.id)"
                        data-test-id="notes-right"
                      />
                    </a-form-item>
                    <a-form-item :label="t('Highlights')">
                      <a-input-search
                        v-model:value="newHighlight"
                        :placeholder="t('Type highlight and press +')"
                        enter-button="+"
                        @search="addHighlight"
                      />
                      <a-empty v-if="!notes[currentLesson?.id || 'global'].highlights.length" :description="t('No highlights')" class="mt-1"/>
                      <a-list
                        v-else
                        :data-source="notes[currentLesson?.id || 'global'].highlights"
                        size="small"
                        class="mt-1"
                      >
                        <template #renderItem="{ item, index }">
                          <a-list-item>
                            <a-space>
                              <span>{{ item }}</span>
                              <a-button size="small" @click="removeHighlight(index)">{{ t('Remove') }}</a-button>
                            </a-space>
                          </a-list-item>
                        </template>
                      </a-list>
                    </a-form-item>
                  </a-form>
                </a-card>
              </a-tab-pane>

              <a-tab-pane key="qa" :tab="t('Q&A')">
                <a-breadcrumb class='mb-3'><a-breadcrumb-item to='/students'>Students</a-breadcrumb-item><a-breadcrumb-item>Modules</a-breadcrumb-item></a-breadcrumb>
  <a-card size="small" :title="t('Questions & Answers')" class="mt-2">
                  <a-comment v-for="c in qaForCurrent" :key="c.id" :author="c.author" :content="c.text" :datetime="c.when">
                    <template #avatar>
                      <a-avatar :src="c.avatar" />
                    </template>
                  </a-comment>
                  <a-divider />
                  <a-input-textarea
                    v-model:value="qaDraft"
                    :rows="3"
                    :placeholder="t('Ask a question')"
                    data-test-id="qa-input"
                  />
                  <a-space class="mt-1">
                    <a-button size="small" @click="submitQA" :disabled="!qaDraft.trim()">{{ t('Post') }}</a-button>
                    <a-button size="small" @click="qaDraft = ''">{{ t('Clear') }}</a-button>
                  </a-space>
                </a-card>
              </a-tab-pane>

              <a-tab-pane key="bookmarks" :tab="t('Bookmarks')">
                <a-breadcrumb class='mb-3'><a-breadcrumb-item to='/students'>Students</a-breadcrumb-item><a-breadcrumb-item>Modules</a-breadcrumb-item></a-breadcrumb>
  <a-card size="small" :title="t('Bookmarks')" class="mt-2">
                  <a-empty v-if="!bookmarks.length" :description="t('No bookmarks yet')" />
                  <a-list v-else :data-source="bookmarks" size="small">
                    <template #renderItem="{ item, index }">
                      <a-list-item :actions="[
                        h('a', { onClick: () => jumpToBookmark(item) }, t('Go')),
                        h('a', { onClick: () => removeBookmark(index) }, t('Remove'))
                      ]">
                        <a-list-item-meta
                          :title="item.title"
                          :description="item.description"
                        />
                      </a-list-item>
                    </template>
                  </a-list>
                </a-card>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-layout-sider>
      </a-layout>

      <!-- Assignment submit drawer -->
      <a-drawer v-model:open="submitOpen" :title="t('Submit assignment')" placement="right" width="420" data-test-id="submit-drawer">
        <a-form layout="vertical" @finish="submitAssignment">
          <a-form-item :label="t('Notes')">
            <a-textarea v-model:value="submitForm.notes" :rows="4" />
          </a-form-item>
          <a-form-item :label="t('Link to work (URL)')">
            <a-input v-model:value="submitForm.url" placeholder="https://…" />
          </a-form-item>
          <a-form-item :label="t('Attach files (mock)')">
            <a-upload :before-upload="() => false" multiple>
              <a-button><UploadOutlined /> {{ t('Click to attach') }}</a-button>
            </a-upload>
          </a-form-item>
          <a-space>
            <a-button @click="submitOpen = false">{{ t('Cancel') }}</a-button>
            <a-button type="primary" html-type="submit" :loading="submitting">{{ t('Submit') }}</a-button>
          </a-space>
        </a-form>
      </a-drawer>

      <!-- Import / Export Modal -->
      <a-modal v-model:open="openImportExport" :title="t('Import / Export progress')" :footer="null" width="720">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-breadcrumb class='mb-3'><a-breadcrumb-item to='/students'>Students</a-breadcrumb-item><a-breadcrumb-item>Modules</a-breadcrumb-item></a-breadcrumb>
  <a-card :title="t('Export')" size="small">
              <a-typography-paragraph>{{ t('Download your progress as JSON.') }}</a-typography-paragraph>
              <a-button type="primary" @click="exportProgress">{{ t('Export JSON') }}</a-button>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-breadcrumb class='mb-3'><a-breadcrumb-item to='/students'>Students</a-breadcrumb-item><a-breadcrumb-item>Modules</a-breadcrumb-item></a-breadcrumb>
  <a-card :title="t('Import')" size="small">
              <a-typography-paragraph>{{ t('Paste JSON below and import.') }}</a-typography-paragraph>
              <a-textarea v-model:value="importJson" :rows="8" />
              <a-space class="mt-1">
                <a-button @click="importJson = ''">{{ t('Clear') }}</a-button>
                <a-button type="primary" @click="importProgress">{{ t('Import') }}</a-button>
              </a-space>
            </a-card>
          </a-col>
        </a-row>
      </a-modal>

      <!-- Shortcuts Modal -->
      <a-modal v-model:open="openShortcuts" :title="t('Keyboard shortcuts')" :footer="null" width="520">
        <a-descriptions bordered size="small" :column="1">
          <a-descriptions-item :label="t('Next lesson')">N</a-descriptions-item>
          <a-descriptions-item :label="t('Previous lesson')">P</a-descriptions-item>
          <a-descriptions-item :label="t('Toggle complete')">C</a-descriptions-item>
          <a-descriptions-item :label="t('Resume last')">R</a-descriptions-item>
          <a-descriptions-item :label="t('Search lessons')">/</a-descriptions-item>
          <a-descriptions-item :label="t('Toggle dark')">D</a-descriptions-item>
        </a-descriptions>
      </a-modal>

      <!-- Pricing Modal (mock) -->
      <a-modal v-model:open="openPricing" :title="t('Pricing')" :ok-text="t('Enroll')" @ok="mockEnroll">
        <a-radio-group v-model:value="pricingTier">
          <a-radio value="basic">{{ t('Basic · Free preview') }}</a-radio>
          <a-radio value="pro">{{ t('Pro · Full course + certificate') }}</a-radio>
          <a-radio value="team">{{ t('Team · Up to 10 seats') }}</a-radio>
        </a-radio-group>
      </a-modal>

      <!-- Debug & Mocks Drawer -->
      <a-drawer v-model:open="openDebug" :title="t('Debug & mocks')" placement="left" width="420">
        <a-form layout="vertical">
          <a-form-item :label="t('Force mock mode')">
            <a-switch v-model:checked="forceMock" />
          </a-form-item>
          <a-form-item :label="t('Clear local data')">
            <a-button danger @click="clearLocal">{{ t('Clear') }}</a-button>
          </a-form-item>
          <a-form-item :label="t('Telemetry (session)')">
            <a-list :data-source="telemetry" size="small" item-layout="horizontal">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta :title="item.when" :description="item.what" />
                </a-list-item>
              </template>
            </a-list>
          </a-form-item>
        </a-form>
      </a-drawer>
    </a-layout>
  </a-config-provider>
</template>
<script setup lang="ts">
import { definePageMeta } from '#imports' // Declare definePageMeta before using it
definePageMeta({ layout: 'student', ssr: false })
import { provideApolloClient } from '@vue/apollo-composable'
import { createApolloClient } from '../../../../packages/shared-apollo/client'

import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { onMounted, reactive, ref, watch, onBeforeUnmount, h, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { theme, message, Modal } from 'ant-design-vue'
import {
  BulbOutlined, FieldTimeOutlined, PlayCircleOutlined, LockOutlined,
  CheckOutlined, ArrowRightOutlined, SettingOutlined, FontSizeOutlined,
  BugOutlined, CloudSyncOutlined, SortAscendingOutlined,
  UploadOutlined, BookOutlined, PrinterOutlined, ClockCircleOutlined
} from '@ant-design/icons-vue'

const Q_ME = gql`query Me { me { id email displayName roles } }`

let _meResult: any = null
let me: any = null
let studentClient: any = null
let clientInitialized = ref(false)

function initializeApolloClient() {
  if (typeof window === 'undefined') return
  if (clientInitialized.value) return

  const token = window.localStorage?.getItem('token')
  if (!token) {
    console.warn('[Auth] No token found in localStorage, delaying Apollo client initialization')
    return
  }

  try {
    studentClient = createApolloClient('students-internal', token)
    provideApolloClient(studentClient)
    clientInitialized.value = true
    
    try {
      _meResult = useQuery(Q_ME)
      me = computed(() => _meResult.result.value?.me || null)
    } catch (e) {
      console.warn('[Auth] Error initializing me query:', e)
    }
  } catch (e) {
    console.error('[Auth] Failed to initialize Apollo client:', e)
  }
}

/** ---------- Simple i18n (extendable) ---------- */
const dict = {
  en: {
    'Course': 'Course',
    'Choose a module': 'Choose a module',
    'Overview': 'Overview',
    'min': 'min',
    'Online': 'Online',
    'Offline': 'Offline',
    'Mock': 'Mock',
    'Live': 'Live',
    'View': 'View',
    'Toggle dark': 'Toggle dark',
    'Increase font size': 'Increase font size',
    'Decrease font size': 'Decrease font size',
    'Keyboard shortcuts': 'Keyboard shortcuts',
    'Debug & mocks': 'Debug & mocks',
    'Import / Export': 'Import / Export',
    'Resume': 'Resume',
    'lessons': 'lessons',
    'Search lessons': 'Search lessons',
    'All': 'All',
    'Video': 'Video',
    'Reading': 'Reading',
    'Quiz': 'Quiz',
    'Assign.': 'Assign.',
    'Lab': 'Lab',
    'Hide completed': 'Hide completed',
    'Sort': 'Sort',
    'Pick a module to see its lessons': 'Pick a module to see its lessons',
    'Untitled lesson': 'Untitled lesson',
    'Done': 'Done',
    'Locked': 'Locked',
    'Preview': 'Preview',
    'Course overview': 'Course overview',
    'Browse modules and jump in — everything runs in this page.': 'Browse modules and jump in — everything runs in this page.',
    'No modules yet': 'No modules yet',
    'Enroll to unlock full access': 'Enroll to unlock full access',
    'You can still watch previews and read public materials.': 'You can still watch previews and read public materials.',
    'Enroll now': 'Enroll now',
    'See pricing': 'See pricing',
    'Lesson': 'Lesson',
    'Course progress': 'Course progress',
    'Bookmark current lesson': 'Bookmark current lesson',
    'Print lesson': 'Print lesson',
    'This lesson is locked': 'This lesson is locked',
    'Complete prerequisite lesson(s):': 'Complete prerequisite lesson(s):',
    'Unlocks at:': 'Unlocks at:',
    'Enroll': 'Enroll',
    'Go to next available': 'Go to next available',
    'Bookmark timestamp': 'Bookmark timestamp',
    'Video URL:': 'Video URL:',
    'Notes': 'Notes',
    'Lesson content': 'Lesson content',
    'No content': 'No content',
    'Highlights': 'Highlights',
    'No highlights': 'No highlights',
    '(empty)': '(empty)',
    'Option': 'Option',
    'Your answer': 'Your answer',
    'True': 'True',
    'False': 'False',
    'Submit quiz': 'Submit quiz',
    'Mark complete': 'Mark complete',
    'Unsupported lesson type.': 'Unsupported lesson type.',
    'Your notes for this lesson': 'Your notes for this lesson',
    'Mark as incomplete': 'Mark as incomplete',
    'Previous': 'Previous',
    'Next': 'Next',
    'Auto-next on complete': 'Auto-next on complete',
    'Progress': 'Progress',
    'Resources': 'Resources',
    'Attachments': 'Attachments',
    'No resources': 'No resources',
    'Attachment': 'Attachment',
    'Your notes': 'Your notes',
    'Lesson notes': 'Lesson notes',
    'Type highlight and press +': 'Type highlight and press +',
    'Remove': 'Remove',
    'Q&A': 'Q&A',
    'Questions & Answers': 'Questions & Answers',
    'Ask a question': 'Ask a question',
    'Post': 'Post',
    'Clear': 'Clear',
    'Bookmarks': 'Bookmarks',
    'Go': 'Go',
    'Import / Export progress': 'Import / Export progress',
    'Export': 'Export',
    'Download your progress as JSON.': 'Download your progress as JSON.',
    'Export JSON': 'Export JSON',
    'Import': 'Import',
    'Paste JSON below and import.': 'Paste JSON below and import.',
    'Pricing': 'Pricing',
    'Enroll now (mock)': 'Enroll now (mock)',
    'Basic · Free preview': 'Basic · Free preview',
    'Pro · Full course + certificate': 'Pro · Full course + certificate',
    'Team · Up to 10 seats': 'Team · Up to 10 seats',
    'Submit assignment': 'Submit assignment',
    'Assignment brief': 'Assignment brief',
    'Rubric': 'Rubric',
    'Link to work (URL)': 'Link to work (URL)',
    'Attach files (mock)': 'Attach files (mock)',
    'Click to attach': 'Click to attach',
    'Cancel': 'Cancel',
    'Submit': 'Submit',
    'No lessons found': 'No lessons found',
  }
}
function t(k: keyof typeof dict['en'] | string) { return (dict.en as any)[k] || k }

type QuizOption = { text: string; correct: boolean }
type QuizQuestion = { id: string; text: string; type: 'mcq' | 'tf' | 'short'; options?: QuizOption[] }
type Resource = { id?: string; name?: string; title?: string; kind?: 'pdf' | 'file' | 'link'; url: string }
type Attachment = { name?: string; url?: string }
type Lesson = {
  id: string
  moduleId?: string
  title: string
  type: 'video' | 'reading' | 'quiz' | 'assignment' | 'lab' | string
  duration?: number
  content?: string
  videoUrl?: string
  rubric?: string
  resources?: Resource[]
  attachments?: Attachment[]
  tags?: string[]
  prerequisites?: string[]
  unlockAt?: string | number | Date
  preview?: boolean
  quiz?: { questions: QuizQuestion[] }
  metadata?: Record<string, any>
}
type ModuleT = { id: string; courseId?: string; title: string; lessons: Lesson[] }
type CourseT = {
  id: string
  title: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string
  coverUrl?: string
}
type ModuleLite = { id: string; title: string; lessonCount?: number; minutes?: number }
type ProgressRow = { lessonId: string; completed: boolean; updatedAt?: string; score?: number }

// ... existing state ...

const isDark = ref(false)
const siderCollapsed = ref(false)
const rightCollapsed = ref(false)
const rightTab = ref<'progress' | 'resources' | 'notes' | 'qa' | 'bookmarks'>('progress')
const filter = ref('')
const filterType = ref<'all'|'video'|'reading'|'quiz'|'assignment'|'lab'>('all')
const hideCompleted = ref(false)
const sortKeyArr = ref<string[]>(['title'])
const sortKey = computed(() => sortKeyArr.value[0] || 'title')
const fontScale = ref(15)
const autoNext = ref(true)

const route = useRoute()
const router = useRouter()

const STUDENTS_API = 'http://localhost:4000/api/students-internal/graphql'
const TEACH_API = 'http://localhost:4000/api/teach-internal/graphql'

const loadingCourse = ref(false)
const loadingModule = ref(false)

const course = reactive<CourseT>({ id: '', title: '', category: '', difficulty: 'Beginner', coverUrl: '' })
const modules = ref<ModuleLite[]>([])
const lessons = ref<Lesson[]>([])
const moduleT = ref<ModuleT | null>(null)
const currentIndex = ref(0)

const progress = reactive<{ completedLessonIds: string[]; lastLessonId?: string }>({
  completedLessonIds: [],
  lastLessonId: undefined
})

const isEnrolledCourse = ref(false)
const html5Video = ref<HTMLVideoElement | null>(null)
const videoSpeed = ref(1)
const notes = reactive<Record<string, { text: string; highlights: string[] }>>({ global: { text: '', highlights: [] } })
const newHighlight = ref('')

type QAItem = { id: string; author: string; avatar?: string; text: string; when: string; lessonId?: string }
const qa = reactive<QAItem[]>([])
const qaDraft = ref('')

type Bookmark = { title: string; description: string; lessonId: string; timestamp?: number }
const bookmarks = reactive<Bookmark[]>([])

const ratings = reactive<Record<string, number>>({})
const telemetry = reactive<{ when: string; what: string }[]>([])
function log(what: string) { telemetry.unshift({ when: new Date().toLocaleTimeString(), what }); if (telemetry.length > 100) telemetry.pop() }

const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)
const usingMocks = ref(false)
const mockReason = ref('')
const forceMock = ref(false)

const openImportExport = ref(false)
const importJson = ref('')
const openShortcuts = ref(false)
const openPricing = ref(false)
const pricingTier = ref<'basic'|'pro'|'team'>('pro')
const openDebug = ref(false)

const submitOpen = ref(false)
const submitting = ref(false)
const submitForm = reactive<{ notes: string; url: string }>({ notes: '', url: '' })

const selectedModuleId = computed(() => String(route?.params?.module_id || ''))
const selectedCourseId = computed(() => String(route?.params?.course_id || route?.params?.courseId || ''))
const selectedStudentId = computed(() => String(route?.params?.student_id || route?.params?.studentId || ''))

const hasModules = computed(() => modules.value.length > 0)
const currentModuleReady = computed(() => !!moduleT.value && lessons.value.length > 0)
const ytEmbed = (url?: string) => {
  if (!url) return ''
  if (/youtube\.com|youtu\.be/.test(url)) {
    const id = url.match(/(?:v=|be\/)([A-Za-z0-9_-]{6,})/)?.[1]
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : ''
  }
  return ''
}
const unlockAtDate = (l: Lesson) => (l.unlockAt ? new Date(l.unlockAt).toLocaleString() : '')

const currentLesson = computed(() => lessons.value[currentIndex.value])
const totalMinutes = computed(() => lessons.value.reduce((s, l) => s + (l.duration || 0), 0))
const progressPercent = computed(() =>
  lessons.value.length ? Math.round((progress.completedLessonIds.length / lessons.value.length) * 100) : 0
)
const coverStyle = computed(() => ({
  backgroundImage: course.coverUrl ? `url('${course.coverUrl}')` : 'linear-gradient(135deg,#111,#334155)'
}))

const filteredLessons = computed(() => {
  let arr = lessons.value.slice()
  const q = filter.value.trim().toLowerCase()
  if (q) {
    arr = arr.filter(l =>
      (l.title || '').toLowerCase().includes(q) ||
      (l.type || '').toLowerCase().includes(q)
    )
  }
  if (filterType.value !== 'all') {
    arr = arr.filter(l => l.type === filterType.value)
  }
  if (hideCompleted.value) {
    arr = arr.filter(l => !isCompleted(l.id))
  }
  if (sortKey.value === 'title') {
    arr.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
  } else if (sortKey.value === 'duration') {
    arr.sort((a, b) => (a.duration || 0) - (b.duration || 0))
  } else if (sortKey.value === 'type') {
    arr.sort((a, b) => (a.type || '').localeCompare(b.type || ''))
  }
  return arr
})

function onSortChange({ key }: any) {
  sortKeyArr.value = [key]
}

const isCompleted = (lessonId: string) => progress.completedLessonIds.includes(lessonId)
const labelForLesson = (id: string) => lessons.value.find(l => l.id === id)?.title || ''
function isLocked(l: Lesson): boolean {
  if (!isEnrolledCourse.value && !l.preview) return true
  if (l.preview) return false
  if (l.unlockAt && new Date(l.unlockAt).getTime() > Date.now()) return true
  if (l.prerequisites?.length) return !l.prerequisites.every(pid => isCompleted(pid))
  return false
}

/** ---------- Networking with graceful fallback ---------- */
let aborters = new Set<AbortController>()
onBeforeUnmount(() => {
  aborters.forEach(a => a.abort())
  aborters.clear()
})

async function fetchGraphQL<T = any>(
  query: string,
  variables?: Record<string, any>,
  endpoint = STUDENTS_API,
  timeoutMs = 8000,
): Promise<T> {
  const token = typeof window !== 'undefined' ? window.localStorage?.getItem('token') : null
  
  if (!token) {
    throw new Error('Authentication required: No token found in localStorage. Please log in.')
  }

  if (forceMock.value) throw new Error('Forced mock mode')
  
  const controller = new AbortController()
  aborters.add(controller)
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  
  try {
    const resp = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    })
    const json = await resp.json().catch(() => ({}))
    if (!resp.ok) throw new Error(json?.errors?.[0]?.message || resp.statusText || 'Request failed')
    if (json.errors?.length) throw new Error(json.errors[0]?.message || 'GraphQL error')
    return json.data as T
  } finally {
    clearTimeout(timer)
    aborters.delete(controller)
  }
}

const GQL = {
  myCourses: `
    query MyCourses($studentId:String!) {
      myCourses(studentId:$studentId) {
        id
        studentId
        courseId
        completed
        progress
        course { id title category difficulty coverUrl }
      }
    }
  `,
  myProgress: `
    query MyProgress {
      myProgress {
        id
        lessonId
        updatedAt
      }
    }
  `,
  updateProgress: `
    mutation UpdateProgress($studentId:String!, $lessonId:String!, $completed:Boolean!, $score:Int) {
      updateProgress(studentId:$studentId, lessonId:$lessonId, completed:$completed, score:$score) {
        id
        lessonId
        completed
        updatedAt
      }
    }
  `,
  modulesByCourse: `
    query ModulesByCourse($courseId:String!) {
      modulesByCourse(courseId:$courseId) {
        id
        title
        lessons { id duration title type content videoUrl rubric metadata moduleId }
      }
    }
  `,
}


onMounted(() => {
  initializeApolloClient()
})
</script>

<style scoped>
/* Layout baseline */
.student-wrap { min-height: 100vh; background: #f6f8fb; }
.is-dark { background: #0b1220; }
.page-header { background: #fff; border-bottom: 1px solid #eef2f7; position: sticky; top: 0; z-index: 9; }
.is-dark .page-header { background: #0f172a; border-color: #0b1f37; }
.global-banners :deep(.ant-alert) { border-radius: 0; }

/* Siders */
.left-sider, .right-sider { background: transparent; }
.sider-inner, .right-inner { padding: 12px; }

/* Cover */
.cover { height: 140px; background-size: cover; background-position: center; position: relative; border-radius: 10px; overflow: hidden; }
.cover-gradient { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.55)); }
.cover-meta { position: absolute; left: 12px; right: 12px; bottom: 10px; color: #fff; }
.cover-title { font-weight: 700; font-size: 15px; text-shadow: 0 1px 2px rgba(0,0,0,.3); }
.cover-tags { margin-top: 6px; display: flex; gap: 6px; flex-wrap: wrap; }

/* Content */
.content { padding: 16px; }
.lesson-row { border-radius: 8px; cursor: pointer; transition: background .15s ease; }
.lesson-row:hover { background: #f3f7ff; }
.lesson-row.active { background: #eef7ff; }
.is-dark .lesson-row:hover { background: #0b1f37; }
.is-dark .lesson-row.active { background: #0b2a4b; }

.mt-1 { margin-top: 8px; }
.mt-2 { margin-top: 12px; }
.mb-1 { margin-bottom: 8px; }
.my-1 { margin: 8px 0; }
.ml-1 { margin-left: 6px; }
.ml-2 { margin-left: 12px; }

.video-controls { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.video-wrap { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 10px; }
.video-wrap iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.video-fallback { background: #f5f5f5; border-radius: 8px; padding: 8px 12px; word-break: break-all; }
.is-dark .video-fallback { background: #0f172a; }

.muted { color: #64748b; }
.preq.ok { text-decoration: line-through; }

.nav-actions { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }

.quiz-q { padding: 8px 0; }
.reading-collapse :deep(.ant-collapse-header) { font-weight: 600; }

/* Print */
@media print {
  .left-sider, .right-sider, .page-header, .global-banners, .nav-actions, .ant-tabs-nav, .ant-drawer, .ant-modal { display: none !important; }
  .content { padding: 0; }
  .student-wrap { background: #fff; }
}
</style>
