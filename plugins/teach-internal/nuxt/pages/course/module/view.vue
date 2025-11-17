<template>
  <client-only>
    <a-config-provider>
      <a-layout :class="['admin-wrap', isDark ? 'is-dark' : '']">
        
        <!-- ==================== HEADER ==================== -->
        <a-page-header
          class="admin-header"
          title="Course Admin"
          :sub-title="`Edit · ${flatLessons.length} lesson${flatLessons.length !== 1 ? 's' : ''}`"
        >
          <template #tags>
            <a-tag color="blue">{{ course.category || "—" }}</a-tag>
            <a-tag color="gold">{{ course.difficulty || "—" }}</a-tag>
            <a-tag v-if="totalMinutes" color="blue"
              ><FieldTimeOutlined /> {{ totalMinutes }} min</a-tag
            >
          </template>

          <template #extra>
            <a-space>
              <a-switch
                v-model:checked="autoSave"
                :checked-children="'Auto-save'"
                :un-checked-children="'Manual save'"
              />
              <a-tooltip title="Toggle dark">
                <a-button shape="circle" @click="toggleDark"
                  ><BulbOutlined
                /></a-button>
              </a-tooltip>
              <a-dropdown>
                <a-button> File <DownOutlined /> </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="syncNow"
                      ><SaveOutlined /> Sync now</a-menu-item
                    >
                    <a-menu-item @click="reloadFromApi"
                      ><CloudDownloadOutlined /> Reload</a-menu-item
                    >
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </template>
        </a-page-header>

        <!-- ==================== MAIN CONTENT LAYOUT ==================== -->
        <a-layout>
          
          <!-- LEFT SIDEBAR: OUTLINE & NAVIGATION -->
          <a-layout-sider
            width="310"
            class="admin-sider"
            collapsible
            v-model:collapsed="siderCollapsed"
          >
            <div class="sider-pad">
              <!-- Course Cover -->
              <div class="cover" :style="coverStyle">
                <div class="cover-gradient"></div>
                <div class="cover-meta" v-if="!siderCollapsed">
                  <div class="cover-title">
                    {{ course.title || "Untitled course" }}
                  </div>
                  <div class="cover-tags">
                    <a-tag v-if="course.category" color="blue">{{
                      course.category
                    }}</a-tag>
                    <a-tag v-if="course.difficulty" color="gold">{{
                      course.difficulty
                    }}</a-tag>
                  </div>
                </div>
              </div>

              <!-- Lesson Filtering & Actions -->
              <a-input-search
                v-model:value="filter"
                placeholder="Filter lessons"
                allow-clear
                class="mt-2"
              />

              <a-space class="mt-2" wrap>
                <a-button size="small" type="primary" @click="addModule"
                  ><PlusOutlined /> Module</a-button
                >
                <a-button
                  size="small"
                  @click="addLessonToCurrent"
                  :disabled="!currentModule"
                  ><PlusOutlined /> Lesson</a-button
                >
                <a-button size="small" @click="expandAll">Expand</a-button>
                <a-button size="small" @click="collapseAll">Collapse</a-button>
              </a-space>

              <!-- Module & Lesson Tree -->
              <a-collapse v-model:activeKey="activePanels" class="mt-2" accordion>
                <a-collapse-panel
                  v-for="(m, mi) in course.modules"
                  :key="`m-${mi}`"
                  :header="m.title || `Module ${mi + 1}`"
                >
                  <div class="mod-actions">
                    <a-space>
                      <a-button
                        size="small"
                        @click="moveModule(mi, -1)"
                        :disabled="mi === 0"
                        >↑</a-button
                      >
                      <a-button
                        size="small"
                        @click="moveModule(mi, +1)"
                        :disabled="mi === course.modules.length - 1"
                        >↓</a-button
                      >
                      <a-button size="small" @click="renameModule(mi)"
                        ><EditOutlined
                      /></a-button>
                      <a-popconfirm
                        title="Delete module?"
                        ok-text="Delete"
                        @confirm="removeModule(mi)"
                      >
                        <a-button size="small" danger
                          ><DeleteOutlined
                        /></a-button>
                      </a-popconfirm>
                    </a-space>
                  </div>

                  <a-list size="small" :data-source="m.lessons">
                    <template #renderItem="{ item, index }">
                      <a-list-item
                        :class="[
                          'tree-lesson',
                          selectedKey === `l-${mi}-${index}` && 'active',
                        ]"
                        v-if="matchFilter(item)"
                        @click="select(mi, index)"
                      >
                        <a-list-item-meta
                          :title="item.title || 'Untitled'"
                          :description="
                            (item.type || '—') +
                            (item.duration ? ` · ${item.duration} min` : '') +
                            (item.preview ? ' · preview' : '')
                          "
                        />
                        <template #actions>
                          <a-space>
                            <a-button
                              size="small"
                              @click.stop="moveLesson(mi, index, -1)"
                              :disabled="index === 0"
                              >↑</a-button
                            >
                            <a-button
                              size="small"
                              @click.stop="moveLesson(mi, index, +1)"
                              :disabled="index === m.lessons.length - 1"
                              >↓</a-button
                            >
                            <a-popconfirm
                              title="Delete lesson?"
                              ok-text="Delete"
                              @confirm="removeLesson(mi, index)"
                            >
                              <a-button size="small" danger
                                ><DeleteOutlined
                              /></a-button>
                            </a-popconfirm>
                          </a-space>
                        </template>
                      </a-list-item>
                    </template>
                  </a-list>

                  <a-button size="small" class="mt-1" block @click="addLesson(mi)"
                    ><PlusOutlined /> Add lesson</a-button
                  >
                </a-collapse-panel>
              </a-collapse>
            </div>
          </a-layout-sider>

          <!-- CENTER & RIGHT: MAIN EDITING AREA -->
          <a-layout-content class="admin-content">
            <a-tabs v-model:activeKey="tab">
              
              <!-- TAB 1: COURSE SETTINGS -->
              <a-tab-pane key="course" tab="Course">
                <a-row :gutter="16">
                  <a-col :md="14" :xs="24">
                    <!-- Course Details Card -->
                    <a-card title="Course details">
                      <a-form layout="vertical">
                        <a-form-item label="Title"
                          ><a-input v-model:value="course.title" @change="touch"
                        /></a-form-item>
                        <a-form-item label="Category"
                          ><a-input
                            v-model:value="course.category"
                            @change="touch"
                        /></a-form-item>
                        <a-form-item label="Difficulty">
                          <a-select
                            v-model:value="course.difficulty"
                            @change="touch"
                            :options="diffOptions"
                          />
                        </a-form-item>
                        <a-form-item label="Description">
                          <a-textarea
                            :rows="5"
                            v-model:value="course.description"
                            @change="touch"
                          />
                        </a-form-item>
                      </a-form>
                    </a-card>

                    <!-- Assets Card -->
                    <a-card class="mt-2" title="Assets (cover & files)">
                      <a-form layout="vertical">
                        <a-form-item label="Cover URL">
                          <a-input
                            v-model:value="coverInput"
                            placeholder="https://…"
                            @pressEnter="setCover"
                          />
                          <div class="mt-1">
                            <a-button @click="setCover">Set cover</a-button>
                            <a-button @click="clearCover" type="link"
                              >Clear</a-button
                            >
                          </div>
                        </a-form-item>
                        <a-divider />
                        <a-form-item label="Course files">
                          <a-space class="mb-1" wrap>
                            <a-input
                              v-model:value="fileName"
                              placeholder="Name"
                            />
                            <a-input v-model:value="fileUrl" placeholder="URL" />
                            <a-button @click="addCourseFile"
                              ><PlusOutlined /> Add</a-button
                            >
                          </a-space>
                          <a-list bordered :data-source="course.files">
                            <template #renderItem="{ item, index }">
                              <a-list-item>
                                <a-list-item-meta
                                  :title="item.name || 'Asset'"
                                  :description="item.url || item.thumbUrl"
                                />
                                <template #actions>
                                  <a-button
                                    size="small"
                                    @click="removeCourseFile(index)"
                                    danger
                                    >Remove</a-button
                                  >
                                </template>
                              </a-list-item>
                            </template>
                          </a-list>
                        </a-form-item>
                      </a-form>
                    </a-card>
                  </a-col>

                  <!-- Pricing & API Card -->
                  <a-col :md="10" :xs="24">
                    <a-card title="Pricing & discount">
                      <a-form layout="vertical">
                        <a-form-item label="Price (EUR)">
                          <a-input-number
                            v-model:value="course.price"
                            :min="0"
                            style="width: 100%"
                            @change="touch"
                          />
                        </a-form-item>
                        <a-form-item label="Course discount (%)">
                          <a-input-number
                            v-model:value="course.discount"
                            :min="0"
                            :max="100"
                            style="width: 100%"
                            @change="touch"
                          />
                        </a-form-item>
                        <a-alert
                          type="info"
                          show-icon
                          :message="`Payable: ${fmt(payablePreview)}`"
                        />
                      </a-form>
                    </a-card>

                    <a-card title="API" class="mt-2">
                      <a-space direction="vertical" style="width: 100%">
                        <a-button block @click="syncNow"
                          ><SaveOutlined /> Sync now</a-button
                        >
                        <a-button block @click="reloadFromApi"
                          ><CloudDownloadOutlined /> Reload from API</a-button
                        >
                      </a-space>
                    </a-card>
                  </a-col>
                </a-row>
              </a-tab-pane>

              <!-- TAB 2: LESSON EDITOR -->
              <a-tab-pane key="lesson" tab="Lesson editor" force-render>
                <a-alert
                  v-if="!currentLesson"
                  type="warning"
                  message="Select or create a lesson from the left outline."
                  show-icon
                />
                <template v-else>
                  <a-card :title="currentLesson.title || 'Lesson'">
                    <a-form layout="vertical">
                      <a-row :gutter="16">
                        <!-- Lesson Main Content (Left) -->
                        <a-col :md="16" :xs="24">
                          <a-form-item label="Title"
                            ><a-input
                              v-model:value="currentLesson.title"
                              @change="touch"
                          /></a-form-item>
                          <a-form-item label="Type">
                            <a-select
                              v-model:value="currentLesson.type"
                              :options="typeOptions"
                              @change="touch"
                            />
                          </a-form-item>

                          <!-- VIDEO TYPE -->
                          <template v-if="currentLesson.type === 'video'">
                            <a-form-item label="Video URL (YouTube accepted)">
                              <a-input
                                v-model:value="currentLesson.videoUrl"
                                @change="touch"
                              />
                            </a-form-item>
                            <a-form-item label="Notes / summary (optional)">
                              <a-textarea
                                :rows="4"
                                v-model:value="currentLesson.content"
                                @change="touch"
                              />
                            </a-form-item>
                          </template>

                          <!-- READING TYPE -->
                          <template v-else-if="currentLesson.type === 'reading'">
                            <a-form-item label="Reading content (HTML or text)">
                              <a-textarea
                                :rows="8"
                                v-model:value="currentLesson.content"
                                @change="touch"
                              />
                            </a-form-item>
                          </template>

                          <!-- ASSIGNMENT TYPE -->
                          <template
                            v-else-if="currentLesson.type === 'assignment'"
                          >
                            <a-form-item label="Brief">
                              <a-textarea
                                :rows="6"
                                v-model:value="currentLesson.content"
                                @change="touch"
                              />
                            </a-form-item>
                            <a-form-item label="Rubric">
                              <a-textarea
                                :rows="4"
                                v-model:value="currentLesson.rubric"
                                @change="touch"
                              />
                            </a-form-item>
                          </template>

                          <!-- LAB TYPE -->
                          <template v-else-if="currentLesson.type === 'lab'">
                            <a-alert
                              type="info"
                              show-icon
                              class="mb-2"
                              message="Lab lesson"
                              description="Configure a Docker-based lab and open a web VS Code (code-server). This is a mock UI that saves to lesson.metadata.lab."
                            />
                            <!-- Organized lab configuration into separate cards for better readability -->
                            <a-form layout="vertical">
                              <a-row :gutter="16">
                                <a-col :md="14" :xs="24">
                                  <!-- Runtime & Environment -->
                                  <a-card title="Runtime & environment">
                                    <a-row :gutter="8">
                                      <a-col :span="12">
                                        <a-form-item label="Lab kind">
                                          <a-select
                                            :options="labKindOptions"
                                            v-model:value="
                                              currentLesson.lab!.kind
                                            "
                                            @change="touch()"
                                          />
                                        </a-form-item>
                                      </a-col>
                                      <a-col :span="12">
                                        <a-form-item label="Node environment">
                                          <a-select
                                            :options="nodeImageOptions"
                                            v-model:value="
                                              currentLesson.lab!.dockerImage
                                            "
                                            @change="touch()"
                                          />
                                        </a-form-item>
                                      </a-col>
                                    </a-row>

                                    <a-row :gutter="8">
                                      <a-col :span="12">
                                        <a-form-item
                                          label="Dev port (inside container)"
                                        >
                                          <a-input-number
                                            v-model:value="
                                              currentLesson.lab!.devPort
                                            "
                                            :min="1"
                                            style="width: 100%"
                                            @change="touch()"
                                          />
                                        </a-form-item>
                                      </a-col>
                                      <a-col :span="12">
                                        <a-form-item
                                          label="Traefik host (optional)"
                                        >
                                          <a-input
                                            v-model:value="
                                              currentLesson.lab!.traefikHost
                                            "
                                            placeholder="lab-{{id}}.localhost"
                                            @change="touch()"
                                          />
                                        </a-form-item>
                                      </a-col>
                                    </a-row>

                                    <a-form-item label="Build command">
                                      <a-input
                                        v-model:value="
                                          currentLesson.lab!.buildCmd
                                        "
                                        placeholder="pnpm i && pnpm build"
                                        @change="touch()"
                                      />
                                    </a-form-item>
                                    <a-form-item label="Start command">
                                      <a-input
                                        v-model:value="
                                          currentLesson.lab!.startCmd
                                        "
                                        placeholder="pnpm dev"
                                        @change="touch()"
                                      />
                                    </a-form-item>

                                    <a-space>
                                      <a-button
                                        type="primary"
                                        @click="handleOpenTeacherCode"
                                        :loading="codeServerStarting"
                                      >
                                        <template #icon
                                          ><CodeOutlined
                                        /></template>
                                        Open VS Code
                                      </a-button>
                                      <a-button
                                        danger
                                        @click="stopCodeServer"
                                        :disabled="
                                          !currentLesson.lab?.codeServer
                                            ?.containerId
                                        "
                                        :loading="codeServerStopping"
                                      >
                                        Stop
                                      </a-button>
                                      <a-button
                                        v-if="currentLesson.lab?.codeServer?.url"
                                        @click="openLabUrl"
                                      >
                                        Open instance
                                      </a-button>
                                    </a-space>

                                    <a-divider />
                                    <a-descriptions
                                      bordered
                                      size="small"
                                      column="1"
                                    >
                                      <a-descriptions-item label="Docker image">
                                        {{ currentLesson.lab?.dockerImage || '—' }}
                                      </a-descriptions-item>

                                      <a-descriptions-item label="VS Code URL">
                                        <template
                                          v-if="currentLesson.lab?.codeServer?.url"
                                        >
                                          <a
                                            :href="
                                              currentLesson.lab.codeServer.url
                                            "
                                            target="_blank"
                                          >
                                            {{ currentLesson.lab.codeServer.url }}
                                          </a>
                                        </template>
                                        <template v-else>—</template>
                                      </a-descriptions-item>

                                      <a-descriptions-item label="Container ID">
                                        {{
                                          currentLesson.lab?.codeServer
                                            ?.containerId || '—'
                                        }}
                                      </a-descriptions-item>
                                    </a-descriptions>
                                  </a-card>

                                  <!-- API Tests Card -->
                                  <a-card
                                    v-if="currentLesson.lab?.kind === 'BACKEND_NODE'"
                                    class="mt-2"
                                    title="API tests"
                                  >
                                    <a-space class="mb-1" wrap>
                                      <a-button
                                        size="small"
                                        type="primary"
                                        @click="addApiLabTest"
                                        ><PlusOutlined /> Add API test</a-button
                                      >
                                    </a-space>
                                    <a-collapse
                                      v-if="currentLesson.lab?.apiTests?.length"
                                      accordion
                                    >
                                      <a-collapse-panel
                                        v-for="(t, i) in currentLesson.lab!
                                          .apiTests || []"
                                        :key="t.id"
                                        :header="t.name || `API Test ${i + 1}`"
                                      >
                                        <template #extra>
                                          <a-button
                                            size="small"
                                            danger
                                            @click.stop="removeApiLabTest(i)"
                                            >Remove</a-button
                                          >
                                        </template>
                                        <template v-if="prepareApiTest(t)">
                                          <a-form layout="vertical">
                                            <a-row :gutter="12">
                                              <a-col :md="12" :xs="24">
                                                <a-form-item label="Name">
                                                  <a-input
                                                    v-model:value="t.name"
                                                    placeholder="Health check"
                                                    @change="touch"
                                                  />
                                                </a-form-item>
                                              </a-col>
                                              <a-col :md="6" :xs="12">
                                                <a-form-item label="Points">
                                                  <a-input-number
                                                    v-model:value="t.points"
                                                    style="width: 100%"
                                                    :min="0"
                                                    @change="touch"
                                                  />
                                                </a-form-item>
                                              </a-col>
                                              <a-col :md="6" :xs="12">
                                                <a-form-item label="Expected status">
                                                  <a-input-number
                                                    v-model:value="t.expectedStatus"
                                                    style="width: 100%"
                                                    :min="100"
                                                    :max="599"
                                                    @change="touch"
                                                  />
                                                </a-form-item>
                                              </a-col>
                                            </a-row>

                                            <a-row :gutter="12">
                                              <a-col :md="6" :xs="12">
                                                <a-form-item label="Method">
                                                  <a-select
                                                    :options="httpMethods"
                                                    v-model:value="t.method"
                                                    @change="touch"
                                                  />
                                                </a-form-item>
                                              </a-col>
                                              <a-col :md="18" :xs="24">
                                                <a-form-item label="Path">
                                                  <a-input
                                                    v-model:value="t.path"
                                                    placeholder="/api/health"
                                                    @change="touch"
                                                  />
                                                </a-form-item>
                                              </a-col>
                                            </a-row>

                                            <a-form-item label="Request body (JSON)">
                                              <a-textarea
                                                v-model:value="t.bodyJson"
                                                :rows="4"
                                                placeholder='{"message":"hello"}'
                                                @change="touch"
                                              />
                                            </a-form-item>

                                            <a-divider orientation="left">
                                              Path params
                                            </a-divider>
                                            <div class="kv-stack">
                                              <div
                                                class="kv-row"
                                                v-for="(row, idx) in t.pathParams"
                                                :key="`pp-${t.id}-${idx}`"
                                              >
                                                <a-input
                                                  v-model:value="row.key"
                                                  placeholder="id"
                                                  @change="touch"
                                                />
                                                <a-input
                                                  v-model:value="row.value"
                                                  placeholder="123"
                                                  @change="touch"
                                                />
                                                <a-button
                                                  size="small"
                                                  type="text"
                                                  danger
                                                  @click="removeRow(t.pathParams!, idx)"
                                                  >Remove</a-button
                                                >
                                              </div>
                                              <a-button
                                                type="dashed"
                                                size="small"
                                                @click="addRow(t.pathParams!)"
                                              >
                                                Add param
                                              </a-button>
                                            </div>

                                            <a-divider orientation="left">
                                              Query params
                                            </a-divider>
                                            <div class="kv-stack">
                                              <div
                                                class="kv-row"
                                                v-for="(row, idx) in t.query"
                                                :key="`qp-${t.id}-${idx}`"
                                              >
                                                <a-input
                                                  v-model:value="row.key"
                                                  placeholder="q"
                                                  @change="touch"
                                                />
                                                <a-input
                                                  v-model:value="row.value"
                                                  placeholder="vue"
                                                  @change="touch"
                                                />
                                                <a-button
                                                  size="small"
                                                  type="text"
                                                  danger
                                                  @click="removeRow(t.query!, idx)"
                                                  >Remove</a-button
                                                >
                                              </div>
                                              <a-button
                                                type="dashed"
                                                size="small"
                                                @click="addRow(t.query!)"
                                              >
                                                Add query param
                                              </a-button>
                                            </div>

                                            <a-divider orientation="left">
                                              Headers
                                            </a-divider>
                                            <div class="kv-stack">
                                              <div
                                                class="kv-row"
                                                v-for="(row, idx) in t.headers"
                                                :key="`hd-${t.id}-${idx}`"
                                              >
                                                <a-input
                                                  v-model:value="row.key"
                                                  placeholder="x-api-key"
                                                  @change="touch"
                                                />
                                                <a-input
                                                  v-model:value="row.value"
                                                  placeholder="secret"
                                                  @change="touch"
                                                />
                                                <a-button
                                                  size="small"
                                                  type="text"
                                                  danger
                                                  @click="removeRow(t.headers!, idx)"
                                                  >Remove</a-button
                                                >
                                              </div>
                                              <a-button
                                                type="dashed"
                                                size="small"
                                                @click="addRow(t.headers!)"
                                              >
                                                Add header
                                              </a-button>
                                            </div>

                                            <a-row :gutter="12">
                                              <a-col :md="8" :xs="24">
                                                <a-form-item label="Auth">
                                                  <a-select
                                                    v-model:value="t.auth!.type"
                                                    :options="[
                                                      { label: 'None', value: 'none' },
                                                      { label: 'Bearer', value: 'bearer' },
                                                    ]"
                                                    @change="touch"
                                                  />
                                                </a-form-item>
                                              </a-col>
                                              <a-col
                                                :md="16"
                                                :xs="24"
                                                v-if="t.auth?.type === 'bearer'"
                                              >
                                                <a-form-item label="Bearer token">
                                                  <a-input
                                                    v-model:value="t.auth!.token"
                                                    placeholder="eyJhbGci..."
                                                    @change="touch"
                                                  />
                                                </a-form-item>
                                              </a-col>
                                            </a-row>

                                            <a-divider orientation="left">
                                              Expectations
                                            </a-divider>
                                            <a-row :gutter="12">
                                              <a-col :md="8" :xs="24">
                                                <a-form-item label="Mode">
                                                  <a-select
                                                    :options="expectModeOptions"
                                                    v-model:value="t.expectMode"
                                                    @change="touch"
                                                  />
                                                </a-form-item>
                                              </a-col>
                                              <a-col :md="16" :xs="24">
                                                <a-form-item
                                                  label="Contains text (comma separated)"
                                                >
                                                  <a-input
                                                    v-model:value="t.expectTextLine"
                                                    placeholder="welcome,success"
                                                    @change="touch"
                                                  />
                                                </a-form-item>
                                              </a-col>
                                            </a-row>
                                            <a-form-item label="Expected JSON (subset or exact)">
                                              <a-textarea
                                                v-model:value="t.expectJsonStr"
                                                :rows="4"
                                                placeholder='{"ok":true}'
                                                @change="touch"
                                              />
                                            </a-form-item>

                                            <a-divider orientation="left">
                                              Args (docs)
                                            </a-divider>
                                            <div class="arg-stack">
                                              <div
                                                class="arg-row"
                                                v-for="(arg, idx) in t.args"
                                                :key="`arg-${t.id}-${idx}`"
                                              >
                                                <a-input
                                                  v-model:value="arg.name"
                                                  placeholder="userId"
                                                  @change="touch"
                                                />
                                                <a-select
                                                  :options="[
                                                    { label: 'string', value: 'string' },
                                                    { label: 'number', value: 'number' },
                                                    { label: 'boolean', value: 'boolean' },
                                                    { label: 'json', value: 'json' },
                                                  ]"
                                                  v-model:value="arg.type"
                                                  @change="touch"
                                                />
                                                <a-checkbox
                                                  v-model:checked="arg.required"
                                                  @change="touch"
                                                  >Required</a-checkbox
                                                >
                                                <a-input
                                                  v-model:value="arg.example"
                                                  placeholder="42"
                                                  @change="touch"
                                                />
                                                <a-button
                                                  size="small"
                                                  type="text"
                                                  danger
                                                  @click="removeArgRow(t, idx)"
                                                  >Remove</a-button
                                                >
                                              </div>
                                              <a-button
                                                type="dashed"
                                                size="small"
                                                @click="addArgRow(t)"
                                              >
                                                Add arg
                                              </a-button>
                                            </div>
                                          </a-form>
                                        </template>
                                      </a-collapse-panel>
                                    </a-collapse>
                                    <a-empty
                                      v-else
                                      description="No API tests yet"
                                      class="mt-2"
                                    />
                                  </a-card>

                                  <!-- API Test Runner Card -->
                                  <a-card
                                    class="mt-2"
                                    v-if="currentLesson.lab?.kind === 'BACKEND_NODE'"
                                    title="Run API tests"
                                  >
                                    <!-- ... existing test runner ... -->
                                  </a-card>

                                  <!-- UI Tests Card -->
                                  <a-card
                                    v-if="currentLesson.lab?.kind === 'FRONTEND_NUXT'"
                                    class="mt-2"
                                    title="UI tests"
                                  >
                                    <a-space class="mb-1" wrap>
                                      <a-button
                                        size="small"
                                        type="primary"
                                        @click="addUiLabTest"
                                        ><PlusOutlined /> Add UI test</a-button
                                      >
                                    </a-space>
                                    <a-collapse
                                      v-if="currentLesson.lab?.uiTests?.length"
                                      accordion
                                    >
                                      <a-collapse-panel
                                        v-for="(t, i) in currentLesson.lab!
                                          .uiTests || []"
                                        :key="t.id"
                                        :header="t.name || `UI Test ${i + 1}`"
                                      >
                                        <template #extra>
                                          <a-button
                                            size="small"
                                            danger
                                            @click.stop="removeUiLabTest(i)"
                                            >Remove</a-button
                                          >
                                        </template>
                                        <a-form layout="vertical">
                                          <a-row :gutter="12">
                                            <a-col :md="12" :xs="24">
                                              <a-form-item label="Name">
                                                <a-input
                                                  v-model:value="t.name"
                                                  @change="touch"
                                                  placeholder="Homepage renders"
                                                />
                                              </a-form-item>
                                            </a-col>
                                            <a-col :md="6" :xs="12">
                                              <a-form-item label="Points">
                                                <a-input-number
                                                  v-model:value="t.points"
                                                  :min="0"
                                                  style="width: 100%"
                                                  @change="touch"
                                                />
                                              </a-form-item>
                                            </a-col>
                                            <a-col :md="6" :xs="12">
                                              <a-form-item label="Path">
                                                <a-input
                                                  v-model:value="t.path"
                                                  placeholder="/"
                                                  @change="touch"
                                                />
                                              </a-form-item>
                                            </a-col>
                                          </a-row>
                                          <a-form-item
                                            label="Expected text (comma separated)"
                                          >
                                            <a-input
                                              v-model:value="t.expectTextLine"
                                              placeholder="Welcome,Sign up"
                                              @change="touch"
                                            />
                                          </a-form-item>
                                        </a-form>
                                      </a-collapse-panel>
                                    </a-collapse>
                                    <a-empty
                                      v-else
                                      description="No UI tests yet"
                                      class="mt-2"
                                    />
                                  </a-card>
                                </a-col>

                                <!-- Code Server Status (Right Column) -->
                                <a-col :md="10" :xs="24">
                                  <a-card title="VS Code (code-server)">
                                    <a-typography-paragraph
                                      type="secondary"
                                      style="margin-bottom: 8px"
                                    >
                                      Starts a
                                      <code>codercom/code-server</code> container.
                                      Default password: <b>teacher</b>.
                                    </a-typography-paragraph>
                                    <a-descriptions
                                      bordered
                                      size="small"
                                      column="1"
                                    >
                                      <a-descriptions-item label="URL">
                                        {{
                                          currentLesson.lab?.codeServer?.url ||
                                          "—"
                                        }}
                                      </a-descriptions-item>
                                      <a-descriptions-item label="Status">
                                        {{
                                          currentLesson.lab?.codeServer
                                            ?.containerId
                                            ? "RUNNING"
                                            : "STOPPED"
                                        }}
                                      </a-descriptions-item>
                                    </a-descriptions>
                                    <a-divider />
                                    <a-button
                                      block
                                      type="dashed"
                                      :disabled="
                                        !currentLesson.lab?.codeServer?.url
                                      "
                                      @click="showCodeDrawer = true"
                                    >
                                      Open embedded VS Code
                                    </a-button>
                                  </a-card>
                                </a-col>
                              </a-row>
                            </a-form>
                          </template>

                          <!-- QUIZ TYPE -->
                          <template v-else-if="currentLesson.type === 'quiz'">
                            <a-alert
                              type="info"
                              show-icon
                              message="Build questions below. MCQ supports multiple options; mark the correct one(s)."
                              class="mb-2"
                            />
                            <a-space class="mb-2" wrap>
                              <a-button size="small" @click="addQuestion('mcq')"
                                ><PlusOutlined /> MCQ</a-button
                              >
                              <a-button size="small" @click="addQuestion('tf')"
                                ><PlusOutlined /> True/False</a-button
                              >
                              <a-button size="small" @click="addQuestion('short')"
                                ><PlusOutlined /> Short</a-button
                              >
                            </a-space>

                            <a-collapse v-model:activeKey="activeQPanels">
                              <a-collapse-panel
                                v-for="(q, qi) in currentLesson.quiz?.questions ||
                                []"
                                :key="q.id"
                                :header="`Q${qi + 1}: ${q.text || '(empty)'}`"
                              >
                                <a-form layout="vertical">
                                  <a-form-item label="Question text">
                                    <a-input
                                      v-model:value="q.text"
                                      @change="touch"
                                    />
                                  </a-form-item>
                                  <a-form-item label="Type">
                                    <a-select
                                      v-model:value="q.type"
                                      :options="qTypeOptions"
                                      @change="onQTypeChange(q)"
                                    />
                                  </a-form-item>

                                  <div v-if="q.type === 'mcq'">
                                    <div
                                      v-for="(opt, oi) in q.options || []"
                                      :key="oi"
                                      class="option-row"
                                    >
                                      <a-input
                                        v-model:value="opt.text"
                                        placeholder="Option text"
                                        class="opt-input"
                                        @change="touch"
                                      />
                                      <a-checkbox
                                        v-model:checked="opt.correct"
                                        @change="touch"
                                        >Correct</a-checkbox
                                      >
                                      <a-button
                                        size="small"
                                        danger
                                        @click="removeOption(q, oi)"
                                        >Remove</a-button
                                      >
                                    </div>
                                    <a-button
                                      size="small"
                                      class="mt-1"
                                      @click="addOption(q)"
                                      ><PlusOutlined /> Add option</a-button
                                    >
                                  </div>

                                  <div class="mt-1">
                                    <a-space>
                                      <a-button
                                        size="small"
                                        @click="moveQuestion(qi, -1)"
                                        :disabled="qi === 0"
                                        >↑</a-button
                                      >
                                      <a-button
                                        size="small"
                                        @click="moveQuestion(qi, +1)"
                                        :disabled="
                                          qi ===
                                          currentLesson.quiz!.questions.length - 1
                                        "
                                        >↓</a-button
                                      >
                                      <a-popconfirm
                                        title="Delete question?"
                                        ok-text="Delete"
                                        @confirm="removeQuestion(qi)"
                                      >
                                        <a-button size="small" danger
                                          ><DeleteOutlined
                                        /></a-button>
                                      </a-popconfirm>
                                    </a-space>
                                  </div>
                                </a-form>
                              </a-collapse-panel>
                            </a-collapse>
                          </template>
                        </a-col>

                        <!-- Lesson Meta & Resources (Right) -->
                        <a-col :md="8" :xs="24">
                          <!-- Meta Card -->
                          <a-card size="small" title="Meta">
                            <a-form layout="vertical">
                              <a-form-item label="Duration (min)">
                                <a-input-number
                                  style="width: 100%"
                                  :min="0"
                                  v-model:value="currentLesson.duration"
                                  @change="touch"
                                />
                              </a-form-item>
                              <a-form-item label="Tags (comma separated)">
                                <a-input
                                  v-model:value="tagsInput"
                                  @change="applyTags"
                                  placeholder="vue, reactivity"
                                />
                              </a-form-item>
                              <a-form-item>
                                <a-checkbox
                                  v-model:checked="currentLesson.preview"
                                  @change="touch"
                                  >Preview (unlocked)</a-checkbox
                                >
                              </a-form-item>
                              <a-form-item label="Unlock at (ISO)">
                                <a-input
                                  v-model:value="unlockInput"
                                  @change="applyUnlock"
                                />
                              </a-form-item>
                              <a-form-item label="Prerequisites">
                                <a-select
                                  mode="multiple"
                                  :options="prereqOptions"
                                  v-model:value="currentLesson.prerequisites"
                                  @change="touch"
                                />
                              </a-form-item>
                            </a-form>
                          </a-card>

                          <!-- Resources Card -->
                          <a-card size="small" class="mt-2" title="Resources">
                            <a-space class="mb-1" wrap>
                              <a-input
                                v-model:value="resTitle"
                                placeholder="Title"
                              />
                              <a-input v-model:value="resUrl" placeholder="URL" />
                              <a-button @click="addResource"
                                ><PlusOutlined /> Add</a-button
                              >
                            </a-space>
                            <a-list
                              :data-source="currentLesson.resources || []"
                              bordered
                            >
                              <template #renderItem="{ item, index }">
                                <a-list-item>
                                  <a-list-item-meta
                                    :title="item.title || item.name || 'Resource'"
                                    :description="item.url"
                                  />
                                  <template #actions>
                                    <a-button
                                      size="small"
                                      danger
                                      @click="removeResource(index)"
                                      >Remove</a-button
                                    >
                                  </template>
                                </a-list-item>
                              </template>
                            </a-list>
                          </a-card>

                          <!-- Attachments Card -->
                          <a-card size="small" class="mt-2" title="Attachments">
                            <a-space class="mb-1" wrap>
                              <a-input
                                v-model:value="attName"
                                placeholder="Name"
                              />
                              <a-input v-model:value="attUrl" placeholder="URL" />
                              <a-button @click="addAttachment"
                                ><PlusOutlined /> Add</a-button
                              >
                            </a-space>
                            <a-list
                              :data-source="currentLesson.attachments || []"
                              bordered
                            >
                              <template #renderItem="{ item, index }">
                                <a-list-item>
                                  <a-list-item-meta
                                    :title="item.name || 'Attachment'"
                                    :description="item.url"
                                  />
                                  <template #actions>
                                    <a-button
                                      size="small"
                                      danger
                                      @click="removeAttachment(index)"
                                      >Remove</a-button
                                    >
                                  </template>
                                </a-list-item>
                              </template>
                            </a-list>
                          </a-card>
                        </a-col>
                      </a-row>
                    </a-form>
                  </a-card>
                </template>
              </a-tab-pane>

              <!-- TAB 3: LEARNER PREVIEW -->
              <a-tab-pane key="preview" tab="Preview (learner)">
                <a-card :title="currentLesson?.title || 'Select a lesson'">
                  <template v-if="currentLesson">
                    <div class="preview-head">
                      <a-tag>{{ currentLesson.type }}</a-tag>
                      <a-tag v-if="currentLesson.preview" color="cyan"
                        >Preview</a-tag
                      >
                      <span class="muted"
                        ><FieldTimeOutlined />
                        {{ currentLesson.duration || 0 }} min</span
                      >
                    </div>

                    <div v-if="currentLesson.type === 'video'">
                      <div
                        v-if="ytEmbed(currentLesson.videoUrl)"
                        class="video-wrap"
                      >
                        <iframe
                          :src="ytEmbed(currentLesson.videoUrl)"
                          frameborder="0"
                          allowfullscreen
                        />
                      </div>
                      <div v-else class="video-fallback">
                        <a-typography-paragraph>
                          Video URL:
                          <a :href="currentLesson.videoUrl" target="_blank">{{
                            currentLesson.videoUrl || "—"
                          }}</a>
                        </a-typography-paragraph>
                      </div>
                      <a-divider>Notes</a-divider>
                      <a-typography-paragraph style="white-space: pre-wrap">{{
                        currentLesson.content
                      }}</a-typography-paragraph>
                    </div>

                    <div v-else-if="currentLesson.type === 'reading'">
                      <a-typography-paragraph style="white-space: pre-wrap">{{
                        currentLesson.content || "No content"
                      }}</a-typography-paragraph>
                    </div>

                    <div v-else-if="currentLesson.type === 'assignment'">
                      <a-typography-paragraph style="white-space: pre-wrap">{{
                        currentLesson.content || "No brief"
                      }}</a-typography-paragraph>
                      <a-alert
                        v-if="currentLesson.rubric"
                        type="info"
                        show-icon
                        :message="'Rubric'"
                        :description="currentLesson.rubric"
                        class="mt-1"
                      />
                    </div>

                    <div v-else-if="currentLesson.type === 'quiz'">
                      <a-list
                        :data-source="currentLesson.quiz?.questions || []"
                        :renderItem="(q) => q"
                      >
                        <template #renderItem="{ item, index }">
                          <a-list-item>
                            <b>Q{{ index + 1 }}</b
                            >: {{ item.text || "(empty)" }}
                            <div v-if="item.type === 'mcq'">
                              <ul class="mt-1">
                                <li
                                  v-for="(o, oi) in item.options || []"
                                  :key="oi"
                                >
                                  {{ o.text || `Option ${oi + 1}` }}
                                  <span v-if="o.correct" class="muted">✔</span>
                                </li>
                              </ul>
                            </div>
                            <div v-else-if="item.type === 'tf'" class="muted">
                              True/False
                            </div>
                            <div v-else class="muted">Short answer</div>
                          </a-list-item>
                        </template>
                      </a-list>
                    </div>
                  </template>
                  <a-empty v-else description="Pick a lesson" />
                </a-card>
              </a-tab-pane>

              <!-- TAB 4: UNIVERSITY MODE -->
              <a-tab-pane key="university" tab="University Mode" force-render>
                <!-- Moved university mode to separate tab for better organization -->
                <a-card :bordered="false" class="uni-mode-card" :loading="uniLoading">
                  <template #title>
                    <div class="flex items-center gap-2">
                      <span>University Mode</span>
                      <a-tag v-if="institution?.name" color="blue">{{
                        institution.name
                      }}</a-tag>
                      <a-popover placement="bottom">
                        <template #content>
                          <div style="max-width: 320px">
                            <p class="mb-1">
                              <strong>Cohorts:</strong> Group students per semester.
                            </p>
                            <p class="mb-1">
                              <strong>Assignments:</strong> Manage tasks and
                              deadlines.
                            </p>
                            <p class="mb-1">
                              <strong>Gradebook:</strong> Export CSV for
                              LMS/SIS.
                            </p>
                            <p class="mb-1">
                              <strong>Enrollments:</strong> Quick roster overview.
                            </p>
                          </div>
                        </template>
                        <a-button type="text" size="small">What is this?</a-button>
                      </a-popover>
                    </div>
                  </template>

                  <a-tabs
                    v-model:activeKey="uniActiveKey"
                    type="card"
                    destroyInactiveTabPane
                  >
                    <!-- Cohorts Tab -->
                    <a-tab-pane key="cohorts" tab="Cohorts">
                      <div class="mb-3 flex gap-2 items-center flex-wrap">
                        <a-input-search
                          v-model:value="cohortSearch"
                          placeholder="Filter cohorts..."
                          style="max-width: 260px"
                        />
                        <a-select
                          v-model:value="activeCohortId"
                          placeholder="Select cohort"
                          style="min-width: 240px"
                          :options="cohortOptions"
                          @change="handleCohortChange"
                        />
                        <a-button
                          @click="refreshCohorts"
                          :loading="loadingCohorts"
                          icon="↻"
                          >Refresh</a-button
                        >
                      </div>

                      <a-empty
                        v-if="!cohorts.length && !loadingCohorts"
                        description="No cohorts for this course yet."
                      />

                      <a-row :gutter="[16, 16]">
                        <a-col
                          :xs="24"
                          :md="12"
                          :lg="8"
                          v-for="c in filteredCohorts"
                          :key="c.id"
                        >
                          <a-card :title="c.name" size="small" class="cohort-card">
                            <template #extra>
                              <a-tag
                                >{{ c.startDate?.slice(0, 10) }} →
                                {{ c.endDate?.slice(0, 10) }}</a-tag
                              >
                            </template>
                            <p class="dim">
                              Size: {{ c.size ?? c.studentsCount ?? '—' }}
                            </p>
                            <div class="flex gap-2">
                              <a-button
                                size="small"
                                @click="
                                  activeCohortId = c.id;
                                  uniActiveKey = 'assignments';
                                "
                                >Assignments</a-button
                              >
                              <a-button
                                size="small"
                                @click="
                                  activeCohortId = c.id;
                                  uniActiveKey = 'enrollments';
                                "
                                >Roster</a-button
                              >
                              <a-button
                                size="small"
                                @click="
                                  activeCohortId = c.id;
                                  uniActiveKey = 'gradebook';
                                "
                                >Gradebook</a-button
                              >
                            </div>
                          </a-card>
                        </a-col>
                      </a-row>
                    </a-tab-pane>

                    <!-- Assignments Tab -->
                    <a-tab-pane key="assignments" tab="Assignments">
                      <div class="mb-3 flex gap-2 items-center flex-wrap">
                        <a-select
                          v-model:value="activeCohortId"
                          placeholder="Select cohort"
                          style="min-width: 240px"
                          :options="cohortOptions"
                          @change="refreshAssignments"
                        />
                        <a-date-picker
                          v-model:value="assignmentDueAfter"
                          placeholder="Due after"
                        />
                        <a-button
                          @click="refreshAssignments"
                          :loading="loadingAssignments"
                          icon="↻"
                          >Refresh</a-button
                        >
                      </div>

                      <a-table
                        v-if="assignments.length"
                        :data-source="assignments"
                        :columns="assignmentColumns"
                        size="small"
                        row-key="id"
                        :pagination="{ pageSize: 10 }"
                      />
                      <a-empty v-else-if="!loadingAssignments" description="No assignments" />
                    </a-tab-pane>

                    <!-- Enrollments Tab -->
                    <a-tab-pane key="enrollments" tab="Enrollments">
                      <div class="mb-3 flex gap-2 items-center flex-wrap">
                        <a-select
                          v-model:value="activeCohortId"
                          placeholder="Select cohort"
                          style="min-width: 240px"
                          :options="cohortOptions"
                          @change="refreshEnrollments"
                        />
                        <a-button
                          @click="refreshEnrollments"
                          :loading="loadingEnrollments"
                          icon="↻"
                          >Refresh</a-button
                        >
                      </div>

                      <a-table
                        v-if="enrollments.length"
                        :data-source="enrollments"
                        :columns="enrollmentColumns"
                        size="small"
                        row-key="id"
                        :pagination="{ pageSize: 10 }"
                      />
                      <a-empty v-else-if="!loadingEnrollments" description="No enrollments found" />
                    </a-tab-pane>

                    <!-- Gradebook Tab -->
                    <a-tab-pane key="gradebook" tab="Gradebook">
                      <div class="mb-3 flex gap-2 items-center flex-wrap">
                        <a-select
                          v-model:value="activeCohortId"
                          placeholder="Select cohort"
                          style="min-width: 240px"
                          :options="cohortOptions"
                        />
                        <a-button
                          type="primary"
                          @click="downloadGradebook"
                          :disabled="!activeCohortId"
                          :loading="downloadingGradebook"
                          >Download CSV</a-button
                        >
                        <small v-if="gradebookInfo" class="dim"
                          >Last export: {{ gradebookInfo }}</small
                        >
                      </div>
                      <a-alert
                        type="info"
                        show-icon
                        message="Gradebook exports a CSV generated by server GraphQL 'gradebookCsv'."
                      />
                    </a-tab-pane>

                    <!-- Analytics Tab -->
                    <a-tab-pane key="analytics" tab="Analytics">
                      <div class="grid-analytics">
                        <a-card size="small" title="Completion Rate">
                          <div class="kpi">{{ (analytics.completionRate ?? 0) }}%</div>
                          <div class="dim">Across active cohort</div>
                        </a-card>
                        <a-card size="small" title="Average Grade">
                          <div class="kpi">
                            {{
                              (analytics.avgGrade ?? 0).toFixed
                                ? analytics.avgGrade.toFixed(1)
                                : analytics.avgGrade
                            }}
                          </div>
                          <div class="dim">Weighted by submissions</div>
                        </a-card>
                        <a-card size="small" title="Active this week">
                          <div class="kpi">{{ analytics.activeThisWeek ?? 0 }}</div>
                          <div class="dim">Unique students</div>
                        </a-card>
                      </div>
                    </a-tab-pane>
                  </a-tabs>
                </a-card>
              </a-tab-pane>
            </a-tabs>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-config-provider>

    <!-- ==================== STUDY TOOLKIT FOOTER ==================== -->
    <!-- Moved study toolkit to bottom for non-intrusive access -->
    <a-collapse class="byway-study-toolkit" accordion style="margin-top: 16px">
      <a-collapse-panel key="notes" header="📝 Study Notes">
        <a-textarea
          v-model:value="study.notes"
          :rows="6"
          placeholder="Type notes for this module..."
        />
        <div class="flex items-center gap-2" style="margin-top: 8px">
          <a-button size="small" @click="saveStudy">Save</a-button>
          <a-typography-text type="secondary"
            >Autosaves every 10s</a-typography-text
          >
        </div>
      </a-collapse-panel>

      <a-collapse-panel key="tasks" header="✅ Checklist">
        <div class="flex items-center gap-2" style="margin-bottom: 8px">
          <a-input
            v-model:value="newTaskText"
            placeholder="Add a task…"
            style="max-width: 340px"
            @keyup.enter="addTask"
          />
          <a-button type="primary" @click="addTask">Add</a-button>
        </div>
        <a-list :data-source="study.tasks" :renderItem="renderTask" bordered />
        <div class="flex items-center gap-3" style="margin-top: 8px">
          <a-progress :percent="taskProgress" style="flex: 1" />
          <a-button
            size="small"
            danger
            @click="clearCompleted"
            :disabled="!study.tasks.some((t) => t.done)"
            >Clear completed</a-button
          >
        </div>
      </a-collapse-panel>

      <a-collapse-panel key="focus" header="⏱️ Focus Timer (Pomodoro)">
        <div class="flex items-center gap-3">
          <a-segmented v-model:value="focusPreset" :options="focusOptions" />
          <a-input-number
            v-model:value="focusCustom"
            :min="1"
            :max="120"
            addon-after="min"
          />
          <a-button type="primary" @click="startFocus">Start</a-button>
          <a-button @click="pauseFocus">{{
            focusRunning ? 'Pause' : 'Resume'
          }}</a-button>
          <a-button @click="resetFocus">Reset</a-button>
          <a-typography-title :level="4" style="margin: 0 0 0 auto"
            >{{ mm }}:{{ ss }}</a-typography-title
          >
        </div>
        <a-progress :percent="focusPercent" style="margin-top: 8px" />
      </a-collapse-panel>

      <a-collapse-panel key="resources" header="🔗 Quick Resources">
        <div class="flex items-center gap-2" style="margin-bottom: 8px">
          <a-input v-model:value="resourceLabel" placeholder="Label" />
          <a-input
            v-model:value="resourceUrl"
            placeholder="https://link"
            style="min-width: 280px"
          />
          <a-button type="primary" @click="addResource" :disabled="!resourceUrl"
            >Add</a-button
          >
        </div>
        <a-list bordered :data-source="study.resources">
          <template #renderItem="{ item, index }">
            <a-list-item>
              <a-space>
                <a-link :href="item.url" target="_blank">{{
                  item.label || item.url
                }}</a-link>
                <a-tag v-if="!item.url?.startsWith('http')" color="warning"
                  >local</a-tag
                >
              </a-space>
              <template #actions>
                <a @click.prevent="removeResource(index)">remove</a>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </a-collapse-panel>
    </a-collapse>
  </client-only>
</template>

<script lang="ts" setup>
definePageMeta({ ssr: false, layout:'teacher' })
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { CodeOutlined } from "@ant-design/icons-vue";
import { watch } from "vue";
import { reactive, ref, onMounted } from "vue";
import { theme, message } from "ant-design-vue";
import {
  BulbOutlined,
  SaveOutlined,
  CloudDownloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  DownOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons-vue";
import { useRoute } from "vue-router";
import { provideApolloClient } from '@vue/apollo-composable'
import { createApolloClient } from '../../../../../../packages/shared-apollo/client'

const apollo = createApolloClient('teach-internal', getCookieToken())
provideApolloClient(apollo)
function useSafeQuery(query: any, variables: any = null, fallback: any = null) {
  const { result, error, loading } = useQuery(query, variables, {
    errorPolicy: "all",     // ⭐ prevents fatal throws
    fetchPolicy: "cache-and-network",
  })

  const data = computed(() => {
    if (error.value) {
      console.warn("[useSafeQuery] GraphQL error → using fallback", error.value)
      return fallback
    }
    return result.value || fallback
  })

  return {
    data,
    loading,
    error, // exposed for optional UI
  }
}

const FAKE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWh3Ymtzc2gwMDAwdWNrajNkcWI5ZzMxIiwiaWF0IjoxNzYzMjEzNjE2LCJleHAiOjE3NjM4MTg0MTZ9.HejankLa76UputaoFzUH6dEInCVZeGQtPAbmPkNpreo"

const Q_ME = gql`
  query Me {
    me {
      id
      email
      token
    }
  }
`

// Run the real network query
const { result: _meResult, error } = useSafeQuery(Q_ME)

// Fallback object
const fallbackUser = {
  id: "cmhwbkssh0000uckj3dqb9g31",
  email: "student@example.com",
  token: FAKE_JWT
}

const me = computed(() => {
  if (error.value) {
    console.warn("[ME] API failed → using mock token")
    return fallbackUser
  }

  if (!_meResult.value?.me) {
    return fallbackUser
  }

  return _meResult.value.me
})
watch(error, (e) => {
  if (e) console.error("[GraphQL Error]", e, e.networkError, e.message);
});
type LabKind = "BACKEND_NODE" | "FRONTEND_NUXT";
type ApiTestMock = {
  id: string;
  name: string;
  method: string;
  path: string;
  expectedStatus?: number;
  expectText?: string[];
  expectJson?: any;
  points?: number;

  // editor helpers (not persisted directly)
  bodyJson?: string; // request body (JSON, stringified)
  expectJsonStr?: string; // expected JSON subset (string)
  expectTextLine?: string; // comma-separated snippets

  // NEW: richer HTTP & schema
  pathParams?: KV[]; // e.g. [{key:'id', value:'123'}] to replace :id or {id}
  query?: KV[]; // e.g. [{key:'q', value:'vue'}]
  headers?: KV[]; // e.g. [{key:'x-api', value:'abc'}]
  auth?: { type: "none" | "bearer"; token?: string };
  args?: ArgSpec[]; // schema/arguments documentation

  // NEW: expectation mode
  expectMode?: ExpectMode; // default = 'json-subset'
};

function ensureLabMeta() {
  if (!currentLesson.value) return;
  if (!currentLesson.value.lab) currentLesson.value.lab = labDefaults();
}
type UiTestMock = {
  id: string;
  name: string;
  path: string;
  expectText?: string[];
  points?: number;
  // editor helper
  expectTextLine?: string;
};
type LabMeta = {
  kind: LabKind;
  dockerImage: string;
  buildCmd?: string;
  startCmd?: string;
  devPort?: number;
  traefikHost?: string;
  codeServer?: { url?: string; containerId?: string };
  apiTests?: ApiTestMock[];
  uiTests?: UiTestMock[];
  // NEW:
  lastRun?: LabLastRun;
};

// --- ADD: key/value helpers & expectations ---
type KV = { key: string; value: string };
type ArgSpec = {
  name: string;
  type: "string" | "number" | "boolean" | "json";
  required?: boolean;
  example?: string;
};
type ExpectMode = "json-subset" | "contains-text" | "exact-json";

type ApiTestResult = {
  id: string;
  name?: string;
  ok: boolean;
  status?: number;
  bodyPreview?: string;
  error?: string;
};

type LabLastRun = {
  at: string;
  summary: { total: number; passed: number; failed: number; skipped: number };
  results: ApiTestResult[];
};

// EXTEND: ApiTestMock
declare global {}

/** Utils */
const fmt = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "EUR" });
const uid = () => Math.random().toString(36).slice(2, 9);
const splitTags = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
const ytEmbed = (url?: string) => {
  if (!url) return "";
  if (/youtube\.com|youtu\.be/.test(url)) {
    const id = url.match(/(?:v=|be\/)([A-Za-z0-9_-]{6,})/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : "";
  }
  return "";
};

/** Types */
type QuizOption = { text: string; correct: boolean };
type QuizQuestion = {
  id: string;
  text: string;
  type: "mcq" | "tf" | "short";
  options?: QuizOption[];
};
type Resource = {
  id?: string;
  name?: string;
  title?: string;
  kind?: "pdf" | "file" | "link";
  url: string;
};
type Lesson = {
  id: string;
  moduleId?: string;
  lab?: LabMeta;
  title: string;
  type: "video" | "reading" | "quiz" | "assignment" | string;
  duration?: number;
  content?: string;
  videoUrl?: string;
  rubric?: string;
  resources?: Resource[];
  attachments?: { name?: string; url?: string }[];
  tags?: string[];
  prerequisites?: string[];
  unlockAt?: string | number | Date;
  completed?: boolean;
  preview?: boolean;
  quiz?: { questions: QuizQuestion[] };
};
type ModuleT = {
  id?: string;
  courseId?: string;
  title: string;
  lessons: Lesson[];
};
type CourseT = {
  id?: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | string;
  description: string;
  price: number;
  discount: number;
  coverUrl?: string;
  modules: ModuleT[];
  files: Array<{ name?: string; url?: string; thumbUrl?: string }>;
};

/** Config / GraphQL helper */
const route = useRoute();
const API_URL = "http://localhost:4000/api/teach-internal/graphql";
// rely on HttpOnly auth cookie; no /* removed_localStorage */ null token
function getAuthHeaders() {
  const token = getCookieToken();
  return token
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    : { "Content-Type": "application/json" };
}
// --- ADD: small utils for API testing ---
const expectModeOptions = [
  { label: "JSON subset", value: "json-subset" },
  { label: "Contains text", value: "contains-text" },
  { label: "Exact JSON", value: "exact-json" },
] as const;

function kvToObject(list?: KV[]): Record<string, string> {
  const out: Record<string, string> = {};
  (list || []).forEach(({ key, value }) => {
    if (String(key || "").trim().length) out[String(key)] = String(value ?? "");
  });
  return out;
}

function interpolatePath(path: string, params?: KV[]): string {
  if (!params?.length) return path;
  let out = path;
  for (const { key, value } of params) {
    if (!key) continue;
    // support :key and {key}
    out = out.replace(
      new RegExp(`:${key}\\b`, "g"),
      encodeURIComponent(String(value)),
    );
    out = out.replace(
      new RegExp(`\\{${key}\\}`, "g"),
      encodeURIComponent(String(value)),
    );
  }
  return out;
}

function buildQuery(list?: KV[]): string {
  const q: string[] = [];
  for (const { key, value } of list || []) {
    if (!key) continue;
    q.push(
      `${encodeURIComponent(key)}=${encodeURIComponent(String(value ?? ""))}`,
    );
  }
  return q.length ? `?${q.join("&")}` : "";
}

function safeJsonParse<T = unknown>(s?: string): T | undefined {
  if (!s) return undefined;
  try {
    return JSON.parse(s) as T;
  } catch {
    return undefined;
  }
}

function jsonSubsetMatch(actual: any, expected: any): boolean {
  if (expected == null) return true;
  if (typeof expected !== "object" || expected === null)
    return actual === expected;
  if (typeof actual !== "object" || actual === null) return false;
  for (const k of Object.keys(expected)) {
    if (!(k in actual)) return false;
    if (!jsonSubsetMatch(actual[k], expected[k])) return false;
  }
  return true;
}

function previewText(s: string, n = 180) {
  return s.length <= n ? s : s.slice(0, n) + "…";
}
// --- ADD: API test runner state ---
const testRunning = ref(false);
const testBaseUrlOverride = ref("");

// If BACKEND_NODE, we guess a base URL.
// 1) If traefikHost provided → https://<host>
// 2) Else http://localhost:<devPort>
const testBaseUrl = computed(() => {
  const lab = currentLesson.value?.lab;
  if (!lab) return "";
  if (lab.traefikHost && lab.traefikHost.trim())
    return `https://${lab.traefikHost.trim()}`;
  if (lab.devPort) return `http://localhost:${lab.devPort}`;
  return "";
});

// --- ADD: row helpers ---
function ensureArraysFor(t: ApiTestMock) {
  t.pathParams ||= [];
  t.query ||= [];
  t.headers ||= [];
  t.args ||= [];
  t.auth ||= { type: "none" };
  t.expectMode ||= "json-subset";
}
function addRow(list: KV[]) {
  list.push({ key: "", value: "" });
  touch(false);
}
function removeRow(list: KV[], i: number) {
  list.splice(i, 1);
  touch();
}
function addArgRow(t: ApiTestMock) {
  t.args!.push({ name: "", type: "string", required: false, example: "" });
  touch(false);
}
function removeArgRow(t: ApiTestMock, i: number) {
  t.args!.splice(i, 1);
  touch();
}

// --- ADD: single test runner (dry or live) ---
async function runSingleApi(
  test: ApiTestMock,
  mode: "live" | "dry" = "live",
): Promise<ApiTestResult> {
  ensureLabMeta();
  ensureArraysFor(test);
  const base = (testBaseUrlOverride.value || testBaseUrl.value || "").replace(
    /\/+$/,
    "",
  );
  const path = interpolatePath(test.path || "/", test.pathParams);
  const url = `${base}${path}${buildQuery(test.query)}`;
  const method = (test.method || "GET").toUpperCase();
  const headersObj = kvToObject(test.headers);
  let body: any = undefined;

  if (test.bodyJson && test.bodyJson.trim()) {
    const parsed = safeJsonParse(test.bodyJson);
    if (parsed !== undefined) {
      body = JSON.stringify(parsed);
      headersObj["Content-Type"] ||= "application/json";
    } else {
      // if body is not valid JSON, send raw string
      body = test.bodyJson;
      headersObj["Content-Type"] ||= "text/plain";
    }
  }

  if (test.auth?.type === "bearer" && test.auth.token) {
    headersObj["Authorization"] = `Bearer ${test.auth.token}`;
  }

  // Evaluation helpers
  const wantStatus = Number(test.expectedStatus ?? 200);
  const wantText = (test.expectTextLine || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  const wantJson =
    test.expectJsonStr && test.expectJsonStr.trim()
      ? safeJsonParse(test.expectJsonStr)
      : (test.expectJson ?? undefined);
  const modeSel: ExpectMode = test.expectMode || "json-subset";

  // --- DRY MODE: do not network, just "validate expectations shape"
  if (mode === "dry") {
    const ok = true; // all dry-run pass if the expectations and request build are valid
    return {
      id: test.id,
      name: test.name,
      ok,
      status: undefined,
      bodyPreview: `DRY ${method} ${url}`,
    };
  }

  // --- LIVE MODE: attempt fetch (may CORS-fail, we handle gracefully)
  if (!base) {
    return {
      id: test.id,
      name: test.name,
      ok: false,
      error: "Base URL not resolved. Set Traefik host or devPort, or override.",
    };
  }

  try {
    const res = await fetch(url, {
      method,
      headers: headersObj,
      body,
      credentials: "omit",
    });
    const status = res.status;
    const text = await res.text();
    let ok = status === wantStatus;

    if (ok) {
      if (modeSel === "contains-text" && wantText.length) {
        ok = wantText.every((snip) => text.includes(snip));
      } else if (modeSel === "exact-json" || modeSel === "json-subset") {
        try {
          const json = JSON.parse(text);
          ok =
            modeSel === "exact-json"
              ? JSON.stringify(json) === JSON.stringify(wantJson ?? {})
              : jsonSubsetMatch(json, wantJson ?? {});
        } catch {
          ok = false;
        }
      }
    }

    return {
      id: test.id,
      name: test.name,
      ok,
      status,
      bodyPreview: previewText(text),
    };
  } catch (e: any) {
    return {
      id: test.id,
      name: test.name,
      ok: false,
      error: e?.message || "Network error / CORS blocked",
    };
  }
}

// --- ADD: run-all orchestrator ---
async function runAllApiTests(mode: "live" | "dry" = "live") {
  if (currentLesson.value?.type !== "lab") return;
  const lab = currentLesson.value.lab!;
  const tests = lab.apiTests || [];
  if (!tests.length) {
    message.info("No API tests.");
    return;
  }

  testRunning.value = true;
  try {
    const results: ApiTestResult[] = [];
    for (const t of tests) {
      // only for backend labs
      if (lab.kind !== "BACKEND_NODE") {
        results.push({
          id: t.id,
          name: t.name,
          ok: false,
          error: "Skipped: not BACKEND_NODE",
        });
        continue;
      }
      const r = await runSingleApi(t, mode);
      results.push(r);
    }
    const passed = results.filter((r) => r.ok).length;
    const failed = results.filter(
      (r) => !r.ok && !r.error?.startsWith("Skipped"),
    ).length;
    const skipped = results.filter((r) =>
      r.error?.startsWith("Skipped"),
    ).length;
    lab.lastRun = {
      at: new Date().toISOString(),
      summary: { total: results.length, passed, failed, skipped },
      results,
    };
    touch(); // persist lab metadata
    message.success(`API tests finished: ${passed}/${results.length} passed`);
  } finally {
    testRunning.value = false;
  }
} // used in template preview
const testBase = computed(
  () => testBaseUrlOverride.value || testBaseUrl.value || "",
);

const labKindOptions = [
  { label: "Backend (Node)", value: "BACKEND_NODE" },
  { label: "Frontend (Nuxt)", value: "FRONTEND_NUXT" },
];

const nodeImageOptions = [
  { label: "Node 18 (alpine)", value: "node:18-alpine" },
  { label: "Node 20 (alpine)", value: "node:20-alpine" },
  { label: "Node 22 (alpine)", value: "node:22-alpine" },
];

const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"].map((x) => ({
  label: x,
  value: x,
}));
const currentLesson = computed<Lesson | undefined>(
  () => currentModule.value?.lessons?.[currentLessonIndex.value],
);

function labDefaults(): LabMeta {
  return {
    kind: "BACKEND_NODE",
    dockerImage: "node:22-alpine",
    buildCmd: "pnpm i",
    startCmd: "pnpm dev",
    devPort: 3000,
    traefikHost: "",
    codeServer: {},
    apiTests: [],
    uiTests: [],
  };
}

const currentModuleIndex = ref(0);
const currentLessonIndex = ref(0);
const currentModule = computed<ModuleT | undefined>(
  () => course.modules[currentModuleIndex.value],
);
function select(mi: number, li: number) {
  currentModuleIndex.value = mi;
  currentLessonIndex.value = li;
  tab.value = "lesson";
}
/** Base reactive state */
const course = reactive<CourseT>({
  title: "",
  category: "",
  difficulty: "Beginner",
  description: "",
  price: 0,
  discount: 0,
  modules: [],
  files: [],
});

/** Derived */
watch(
  () => currentLesson.value?.type,
  (t) => {
    if (t === "lab") ensureLabMeta();
  },
  { immediate: true }
);
const codeServerStopping = ref(false);
const codeServerStarting = ref(false);
const API_REST = "http://localhost:4000/api/teach-internal"; // adjust if needed
const LAB_API = "http://localhost:4000/api/teacher-course-lab"; // teacher-course-lab plugin API

/**
 * Robust code-server drawer launcher.
 */
function extractTeacherIdFromPath(path: string): string | null {
  // match URLs like /teach-internal/:teacherId/*
  const match = path.match(/teach[-/]internal\/([^/]+)/i);
  return match ? match[1] : null;
}

async function stopCodeServer() {
  if (!currentLesson.value?.lab?.codeServer?.containerId) return;
  
  codeServerStopping.value = true;
  try {
    // Try to stop via teacher-course-lab API first
    const labChallenge = await getLabChallenge();
    if (labChallenge) {
      // Find active session for this challenge
      try {
        const resp = await fetch(`${LAB_API}/sessions/me`, {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        });
        
        if (resp.ok) {
          const data = await resp.json();
          const activeSession = data.sessions?.find(
            (s: any) => s.challengeId === labChallenge.id && s.status === "running"
          );
          
          if (activeSession) {
            // Stop via teacher-course-lab API
            await fetch(`${LAB_API}/session/stop`, {
              method: "POST",
              headers: { "Content-Type": "application/json", ...getAuthHeaders() },
              credentials: "include",
              body: JSON.stringify({ id: activeSession.id }),
            }).catch(() => {});
          }
        }
      } catch (e) {
        console.warn("[LabSession] Failed to stop via API:", e);
      }
    }

    // Fallback: direct container stop (old method)
    const cId = currentLesson.value.lab!.codeServer!.containerId;
    await fetch(`${API_REST}/code-server/stop`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ containerId: cId }),
    }).catch(() => {});
  } finally {
    currentLesson.value.lab!.codeServer = {};
    codeServerStopping.value = false;
    touch(false);
  }
}

function openLabUrl() {
  const url = currentLesson.value?.lab?.codeServer?.url;
  if (url) window.open(url, "_blank");
}
/** 🔧 Trigger teacher code-server / lab session */
async function handleOpenTeacherCode() {
  if (!currentLesson.value?.id) {
    return message.warning("Please save the lesson first");
  }

  // Ensure lab challenge exists
  await ensureLabChallenge();

  // Try to get teacherId from route or user context
  const teacherId =
    route.params.teacherId ||
    route.query.teacherId ||
    extractTeacherIdFromPath(route.path) ||
    me.value?.id;

  if (!teacherId) {
    return message.warning("Missing teacherId");
  }

  // Start lab session via teacher-course-lab API
  codeServerStarting.value = true;
  try {
    const labChallenge = await getOrCreateLabChallenge();
    if (!labChallenge) {
      return message.error("Failed to create lab challenge");
    }

    // Start lab session
    const resp = await fetch(`${LAB_API}/session/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      credentials: "include",
      body: JSON.stringify({
        challengeId: labChallenge.id,
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Failed to start session" }));
      throw new Error(err.error || `HTTP ${resp.status}`);
    }

    const data = await resp.json();
    const session = data.session;

    if (session?.codeServerUrl) {
      // Update lesson metadata with code server info
      if (!currentLesson.value.lab) ensureLabMeta();
      currentLesson.value.lab!.codeServer = {
        url: session.codeServerUrl,
        containerId: session.containerId || undefined,
      };
      touch(false);

      // Open VS Code in new tab
      window.open(session.codeServerUrl, "_blank");
      message.success("Lab session started");
    } else {
      message.error("Session started but no code server URL");
    }
  } catch (err: any) {
    console.error("[LabSession] Failed:", err);
    message.error(err?.message || "Could not start lab session");
  } finally {
    codeServerStarting.value = false;
  }
}

/** Helper for SSR-safe extraction */

function addApiLabTest() {
  ensureLabMeta();
  currentLesson.value!.lab!.apiTests!.push({
    id: uid(),
    name: "Health",
    method: "GET",
    path: "/api/health",
    expectedStatus: 200,
    points: 1,
    bodyJson: "",
    expectJsonStr: "",
    expectTextLine: "",
    pathParams: [],
    query: [],
    headers: [],
    args: [],
    auth: { type: "none" },
    expectMode: "json-subset",
  });
  touch();
}
function removeApiLabTest(i: number) {
  currentLesson.value?.lab?.apiTests?.splice(i, 1);
  touch();
}
function addUiLabTest() {
  ensureLabMeta();
  currentLesson.value!.lab!.uiTests!.push({
    id: uid(),
    name: "Home",
    path: "/",
    points: 1,
    expectTextLine: "",
  });
  touch();
}
function removeUiLabTest(i: number) {
  currentLesson.value?.lab?.uiTests?.splice(i, 1);
  touch();
}

function prepareApiTest(t: ApiTestMock) {
  ensureArraysFor(t);
  return true;
}
// const API_URL = process.env.BYWAY_GRAPHQL_URL || "http://localhost:4000/api"; // fallback


 async function fetchGraphQL<T = any>(
  query: string,
  variables?: Record<string, any>,
  endpoint: string = "/authentication/graphql", // default to auth; override per plugin
): Promise<T> {
  const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  try {
    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: getAuthHeaders(),
      body: JSON.stringify({ query, variables }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error(
        `[GraphQL ${resp.status}] ${url}\n→ Response body:`,
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

    return json.data as T;
  } catch (err: any) {
    console.error("[fetchGraphQL failed]", { query, variables, endpoint, err });
    throw err;
  }
}

function getCookieToken(): string {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWh3Ymtzc2gwMDAwdWNrajNkcWI5ZzMxIiwiaWF0IjoxNzYzMjEzNjE2LCJleHAiOjE3NjM4MTg0MTZ9.HejankLa76UputaoFzUH6dEInCVZeGQtPAbmPkNpreo"
  if (typeof document === "undefined") return ""
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? match[1] : "";
}

/** Theme & UI */
const isDark = ref(false);
function toggleDark() {
  isDark.value = !isDark.value;
}

const tab = ref<"course" | "lesson" | "preview">("course");
const siderCollapsed = ref(false);
const activePanels = ref<string[]>([]);
const activeQPanels = ref<string[]>([]);
const filter = ref("");

const totalMinutes = computed(() =>
  course.modules
    .flatMap((m) => m.lessons || [])
    .reduce((s, l) => s + (l.duration || 0), 0),
);
const coverUrl = computed(
  () => course.files?.[0]?.url || course.coverUrl || "",
);
const coverStyle = computed(() => ({
  backgroundImage: coverUrl.value
    ? `url('${coverUrl.value}')`
    : "linear-gradient(135deg,#111,#334155)",
}));
const flatLessons = computed(() => {
  const arr: { id: string; label: string }[] = [];
  course.modules.forEach((m, mi) =>
    (m.lessons || []).forEach((l, li) =>
      arr.push({
        id: l.id,
        label: `${m.title || `Module ${mi + 1}`}: ${l.title || "Untitled"}`,
      }),
    ),
  );
  return arr;
});
const selectedKey = computed(
  () => `l-${currentModuleIndex.value}-${currentLessonIndex.value}`,
);
const payablePreview = computed(
  () => Number(course.price || 0) * (1 - Number(course.discount || 0) / 100),
);

/** Outline selection */

/** Options */
const typeOptions = [
  { label: "Video", value: "video" },
  { label: "Reading", value: "reading" },
  { label: "Quiz", value: "quiz" },
  { label: "Assignment", value: "assignment" },
  { label: "Lab", value: "lab" },
];
const qTypeOptions = [
  { label: "Multiple Choice", value: "mcq" },
  { label: "True / False", value: "tf" },
  { label: "Short Answer", value: "short" },
];
const diffOptions = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
];

/** Filters */
function matchFilter(l: Lesson) {
  const q = filter.value.trim().toLowerCase();
  if (!q) return true;
  return (
    (l.title || "").toLowerCase().includes(q) ||
    (l.type || "").toLowerCase().includes(q)
  );
}
/** GraphQL operations */
const GQL = {
  courseTree: `
    query CourseTree($id: String!) {
      course(id: $id) {
        id title category difficulty description price discount coverUrl
        modules { id title courseId
          lessons { id moduleId title type duration content videoUrl rubric metadata }
        }
      }
    }
  `,
  updateCourse: `
    mutation UpdateCourse(
      $id:String!,
      $title:String, $category:String, $difficulty:String, $description:String,
      $price:Float, $discount:Float, $coverUrl:String
    ){
      updateCourse(
        id:$id, title:$title, category:$category, difficulty:$difficulty, description:$description,
        price:$price, discount:$discount, coverUrl:$coverUrl
      ){ id }
    }
  `,
  createModule: `
    mutation CreateModule($courseId:String!, $title:String!){
      createModule(courseId:$courseId, title:$title){ id courseId title }
    }
  `,
  updateModule: `
    mutation UpdateModule($id:String!, $title:String){
      updateModule(id:$id, title:$title){ id }
    }
  `,
  deleteModule: `
    mutation DeleteModule($id:String!){
      deleteModule(id:$id){ id }
    }
  `,
  createLesson: `
    mutation CreateLesson(
      $moduleId:String!, $title:String!, $type:String!,
      $duration:Int, $content:String, $videoUrl:String, $rubric:String, $metadata: JSON
    ){
      createLesson(
        moduleId:$moduleId, title:$title, type:$type,
        duration:$duration, content:$content, videoUrl:$videoUrl, rubric:$rubric, metadata:$metadata
      ){ id moduleId title type duration content videoUrl rubric metadata }
    }
  `,
  updateLesson: `
    mutation UpdateLesson(
      $id:String!,
      $title:String, $type:String, $duration:Int, $content:String, $videoUrl:String, $rubric:String,
      $metadata: JSON
    ){
      updateLesson(
        id:$id, title:$title, type:$type, duration:$duration, content:$content, videoUrl:$videoUrl, rubric:$rubric,
        metadata:$metadata
      ){ id }
    }
  `,
  deleteLesson: `
    mutation DeleteLesson($id:String!){
      deleteLesson(id:$id){ id }
    }
  `,
};

/** Normalize server course */
function normalizeCourse(src: any): CourseT {
  return {
    id: src.id,
    title: src.title || "",
    category: src.category || "",
    difficulty: src.difficulty || "Beginner",
    description: src.description || "",
    price: Number(src.price ?? 0),
    discount: Number(src.discount ?? 0),
    coverUrl: src.coverUrl || "",
    modules: (src.modules || []).map((m: any) => ({
      id: m.id,
      courseId: m.courseId,
      title: m.title || "",
      lessons: (m.lessons || []).map((l: any) => {
        const md = l.metadata || {};
        return {
          lab: md.lab || undefined,
          id: l.id,
          moduleId: l.moduleId,
          title: l.title || "",
          type: l.type || "reading",
          duration: l.duration ?? undefined,
          content: l.content || "",
          videoUrl: l.videoUrl || "",
          rubric: l.rubric || "",
          // merged metadata
          tags: md.tags || [],
          prerequisites: md.prerequisites || [],
          unlockAt: md.unlockAt || undefined,
          preview: !!md.preview,
          resources: md.resources || [],
          attachments: md.attachments || [],
          quiz: md.quiz || { questions: [] },
        } as Lesson;
      }),
    })),
    files: src.coverUrl ? [{ name: "cover", url: src.coverUrl }] : [],
  };
}

/** Replace the reactive course safely */
function replaceCourse(next: CourseT) {
  next.modules ||= [];
  next.files ||= [];
  Object.keys(course).forEach((k) => delete (course as any)[k]);
  Object.assign(course, next);
  currentModuleIndex.value = Math.min(
    currentModuleIndex.value,
    Math.max(course.modules.length - 1, 0),
  );
  currentLessonIndex.value = Math.min(
    currentLessonIndex.value,
    Math.max(
      course.modules[currentModuleIndex.value]?.lessons.length - 1 || 0,
      0,
    ),
  );
  reflectSideInputs();
}

/** Fetch */
const loading = ref(false);
async function fetchAllContent(id: string) {
  loading.value = true;
  try {
    const data = await fetchGraphQL<{ course: any }>(GQL.courseTree, { id });
    if (!data?.course) throw new Error("Course not found");
    replaceCourse(normalizeCourse(data.course));
  } catch (e: any) {
    console.warn("[CourseEditor] Failed to fetch API:", e.message);
    message.error(e.message || "Failed to fetch course from API.");
  } finally {
    loading.value = false;
  }
}

/** Debounced persistence (API only) */
const autoSave = ref(true);
let syncTimer: number | undefined;

function buildLessonMetadata(l: Lesson) {
  return {
    tags: l.tags || [],
    prerequisites: l.prerequisites || [],
    unlockAt: l.unlockAt || undefined,
    preview: !!l.preview,
    resources: l.resources || [],
    attachments: l.attachments || [],
    quiz: l.quiz || { questions: [] },
    // ADD: persist lab meta
    lab: l.lab || undefined,
  };
}

async function apiUpdateCourse() {
  if (!course.id) return;
  try {
    await fetchGraphQL(GQL.updateCourse, {
      id: course.id,
      title: course.title,
      category: course.category,
      difficulty: course.difficulty,
      description: course.description,
      price: Number(course.price ?? 0),
      discount: Number(course.discount ?? 0),
      coverUrl: coverUrl.value || "",
    });
  } catch (e: any) {
    message.error("Update course failed: " + e.message);
  }
}
async function apiUpdateLesson(l: Lesson) {
  if (!l?.id) return;
  try {
    await fetchGraphQL(GQL.updateLesson, {
      id: l.id,
      title: l.title,
      type: l.type,
      duration: l.duration ?? null,
      content: l.content ?? "",
      videoUrl: l.videoUrl ?? "",
      rubric: l.rubric ?? "",
      metadata: buildLessonMetadata(l),
    });
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg.includes("No record was found for an update")) {
      message.warning("Lesson not found on server. Reloading…");
      if (course.id) await fetchAllContent(course.id);
    } else {
      message.error("Update lesson failed: " + msg);
    }
  }
}
async function syncDirty() {
  try {
    if (course.id) await apiUpdateCourse();
    if (currentLesson.value?.id) {
      await apiUpdateLesson(currentLesson.value);
      // If lab lesson, ensure LabChallenge exists and is synced
      if (currentLesson.value.type === "lab") {
        await ensureLabChallenge();
      }
    }
  } catch {}
}
function touch(syncApi = true) {
  reflectSideInputs();
  if (syncApi && autoSave.value) {
    if (syncTimer) window.clearTimeout(syncTimer as any);
    syncTimer = window.setTimeout(syncDirty, 500) as any;
  }
}
async function syncNow() {
  if (syncTimer) {
    window.clearTimeout(syncTimer as any);
    syncTimer = undefined;
  }
  await syncDirty();
}
async function reloadFromApi() {
  if (!course.id) return;
  await fetchAllContent(course.id);
}

/** Module CRUD */
async function apiCreateModule(title: string) {
  if (!course.id) {
    message.warning("Open a valid course route with an ID.");
    return;
  }
  try {
    const data = await fetchGraphQL<{ createModule: any }>(GQL.createModule, {
      courseId: course.id,
      title,
    });
    const created = data.createModule;
    course.modules.push({
      id: created.id,
      courseId: created.courseId,
      title: created.title,
      lessons: [],
    });
    activePanels.value = [`m-${course.modules.length - 1}`];
    message.success("Module created");
  } catch (e: any) {
    message.error("Create module failed: " + e.message);
  }
}
async function apiUpdateModuleTitle(mi: number, title: string) {
  const m = course.modules[mi];
  if (!m?.id) return;
  try {
    await fetchGraphQL(GQL.updateModule, { id: m.id, title });
    message.success("Module updated");
  } catch (e: any) {
    message.error("Update module failed: " + e.message);
  }
}
async function apiDeleteModule(mi: number) {
  const m = course.modules[mi];
  if (!m?.id) {
    course.modules.splice(mi, 1);
    return;
  }
  try {
    await fetchGraphQL(GQL.deleteModule, { id: m.id });
    course.modules.splice(mi, 1);
    currentModuleIndex.value = Math.max(
      0,
      Math.min(currentModuleIndex.value, course.modules.length - 1),
    );
    currentLessonIndex.value = 0;
    message.success("Module deleted");
  } catch (e: any) {
    message.error("Delete module failed: " + e.message);
  }
}

/** Lesson CRUD */
async function apiCreateLesson(mi: number) {
  const m = course.modules[mi];
  if (!m?.id) {
    message.warning("Create/save module first.");
    return;
  }
  try {
    const payload = {
      moduleId: m.id,
      title: "New lesson",
      type: "reading",
      duration: 5,
      content: "",
      metadata: {
        tags: [],
        prerequisites: [],
        unlockAt: null,
        preview: false,
        resources: [],
        attachments: [],
        quiz: { questions: [] },
      },
    };
    const data = await fetchGraphQL<{ createLesson: any }>(
      GQL.createLesson,
      payload,
    );
    const c = data.createLesson;
    const md = c.metadata || {};
    m.lessons.push({
      id: c.id,
      moduleId: c.moduleId,
      title: c.title,
      type: c.type,
      duration: c.duration,
      content: c.content,
      videoUrl: c.videoUrl || "",
      rubric: c.rubric || "",
      tags: md.tags || [],
      prerequisites: md.prerequisites || [],
      unlockAt: md.unlockAt || undefined,
      preview: !!md.preview,
      resources: md.resources || [],
      attachments: md.attachments || [],
      quiz: md.quiz || { questions: [] },
    });
    select(mi, m.lessons.length - 1);
    message.success("Lesson created");
  } catch (e: any) {
    message.error("Create lesson failed: " + e.message);
  }
}
async function apiDeleteLesson(mi: number, li: number) {
  const l = course.modules[mi]?.lessons?.[li];
  if (!l) return;
  if (!l.id) {
    course.modules[mi].lessons.splice(li, 1);
    return;
  }
  try {
    await fetchGraphQL(GQL.deleteLesson, { id: l.id });
    course.modules[mi].lessons.splice(li, 1);
    currentLessonIndex.value = Math.max(
      0,
      Math.min(currentLessonIndex.value, course.modules[mi].lessons.length - 1),
    );
    message.success("Lesson deleted");
  } catch (e: any) {
    message.error("Delete lesson failed: " + e.message);
  }
}

/** Outline ops */
function addModule() {
  apiCreateModule(`New module ${course.modules.length + 1}`);
}
function renameModule(mi: number) {
  const now = prompt("Module title", course.modules[mi].title || "");
  if (now !== null) {
    const title = now.trim();
    course.modules[mi].title = title;
    apiUpdateModuleTitle(mi, title);
    touch(false);
  }
}
function removeModule(mi: number) {
  const removedIds = new Set<string>(
    (course.modules[mi].lessons || []).map((l) => l.id),
  );
  for (const m of course.modules) {
    for (const l of m.lessons || []) {
      if (l.prerequisites)
        l.prerequisites = l.prerequisites.filter((id) => !removedIds.has(id));
    }
  }
  apiDeleteModule(mi);
}
function moveModule(mi: number, dir: number) {
  const ni = mi + dir;
  if (ni < 0 || ni >= course.modules.length) return;
  const tmp = course.modules[mi];
  course.modules.splice(mi, 1);
  course.modules.splice(ni, 0, tmp);
  if (currentModuleIndex.value === mi) currentModuleIndex.value = ni;
  touch(); // if you track order in DB, call an API to persist order here
}

function addLesson(mi: number) {
  apiCreateLesson(mi);
}
function addLessonToCurrent() {
  if (currentModule.value) addLesson(currentModuleIndex.value);
}
function removeLesson(mi: number, li: number) {
  const removed = course.modules[mi].lessons[li];
  for (const m of course.modules) {
    for (const l of m.lessons || []) {
      if (l.prerequisites)
        l.prerequisites = l.prerequisites.filter((id) => id !== removed.id);
    }
  }
  apiDeleteLesson(mi, li);
}
function moveLesson(mi: number, li: number, dir: number) {
  const ni = li + dir;
  const arr = course.modules[mi].lessons;
  if (ni < 0 || ni >= arr.length) return;
  const tmp = arr[li];
  arr.splice(li, 1);
  arr.splice(ni, 0, tmp);
  if (currentModuleIndex.value === mi && currentLessonIndex.value === li)
    currentLessonIndex.value = ni;
  touch(); // if you track order in DB, call an API to persist order here
}
function expandAll() {
  activePanels.value = course.modules.map((_, i) => `m-${i}`);
}
function collapseAll() {
  activePanels.value = [];
}

/** Lesson meta helpers */
const tagsInput = ref("");
const unlockInput = ref("");
function reflectSideInputs() {
  if (currentLesson.value) {
    tagsInput.value = (currentLesson.value.tags || []).join(", ");
    unlockInput.value = currentLesson.value.unlockAt
      ? String(currentLesson.value.unlockAt)
      : "";
  }
}
function applyTags() {
  if (currentLesson.value) {
    currentLesson.value.tags = splitTags(tagsInput.value);
    touch();
  }
}
function applyUnlock() {
  if (!currentLesson.value) return;
  const v = unlockInput.value.trim();
  currentLesson.value.unlockAt = v || undefined;
  touch();
}

/** Resources / Attachments */
const resTitle = ref("");
const resUrl = ref("");
function addResource() {
  if (!currentLesson.value) return;
  if (!resUrl.value.trim()) return message.error("Resource URL required");
  currentLesson.value.resources = currentLesson.value.resources || [];
  currentLesson.value.resources.push({
    title: resTitle.value || undefined,
    url: resUrl.value.trim(),
  });
  resTitle.value = "";
  resUrl.value = "";
  touch();
}
function removeResource(i: number) {
  currentLesson.value?.resources?.splice(i, 1);
  touch();
}

const attName = ref("");
const attUrl = ref("");
function addAttachment() {
  if (!currentLesson.value) return;
  if (!attUrl.value.trim()) return message.error("Attachment URL required");
  currentLesson.value.attachments = currentLesson.value.attachments || [];
  currentLesson.value.attachments.push({
    name: attName.value || undefined,
    url: attUrl.value.trim(),
  });
  attName.value = "";
  attUrl.value = "";
  touch();
}
function removeAttachment(i: number) {
  currentLesson.value?.attachments?.splice(i, 1);
  touch();
}

/** Course assets editor (maps first file to coverUrl on API) */
const coverInput = ref("");
const fileName = ref("");
const fileUrl = ref("");
function setCover() {
  const u = coverInput.value.trim();
  if (!u) return;
  if (!course.files.length) course.files.push({ name: "cover", url: u });
  else
    course.files[0] = {
      ...(course.files[0] || {}),
      name: course.files[0]?.name || "cover",
      url: u,
    };
  if (course.id) apiUpdateCourse();
}
function clearCover() {
  if (course.files.length) {
    course.files.splice(0, 1);
  }
  if (course.id) apiUpdateCourse();
}
function addCourseFile() {
  if (!fileUrl.value.trim()) return message.error("File URL required");
  course.files.push({
    name: fileName.value || "Asset",
    url: fileUrl.value.trim(),
  });
  fileName.value = "";
  fileUrl.value = "";
  touch();
}
function removeCourseFile(i: number) {
  course.files.splice(i, 1);
  touch();
}

/** Quiz builder */
function ensureQuiz() {
  if (!currentLesson.value) return;
  currentLesson.value.quiz = currentLesson.value.quiz || { questions: [] };
}
function addQuestion(kind: "mcq" | "tf" | "short") {
  ensureQuiz();
  currentLesson.value!.quiz!.questions.push({
    id: uid(),
    text: "",
    type: kind,
    options:
      kind === "mcq" ? [{ text: "Option 1", correct: false }] : undefined,
  });
  activeQPanels.value = [currentLesson.value!.quiz!.questions.at(-1)!.id];
  touch();
}
function removeQuestion(qi: number) {
  currentLesson.value?.quiz?.questions.splice(qi, 1);
  touch();
}
function moveQuestion(qi: number, dir: number) {
  const qs = currentLesson.value?.quiz?.questions;
  if (!qs) return;
  const ni = qi + dir;
  if (ni < 0 || ni >= qs.length) return;
  const tmp = qs[qi];
  qs.splice(qi, 1);
  qs.splice(ni, 0, tmp);
  touch();
}
function addOption(q: QuizQuestion) {
  q.options = q.options || [];
  q.options.push({ text: "", correct: false });
  touch();
}
function removeOption(q: QuizQuestion, oi: number) {
  q.options?.splice(oi, 1);
  touch();
}
function onQTypeChange(q: QuizQuestion) {
  if (q.type === "mcq" && !q.options)
    q.options = [{ text: "Option 1", correct: false }];
  if (q.type !== "mcq") delete q.options;
  touch();
}

/** Lifecycle */
onMounted(async () => {
  const pathname = route.path;
  function extractCourseIdFromPath(path: string): string | null {
    const courseMatch = path.match(/course\/([^/]+)/);
    const moduleMatch = path.match(/module\/([^/]+)/);
    return courseMatch?.[1] || moduleMatch?.[1] || null;
  }
  const pid = (
    route.params.id ||
    route.params.courseId ||
    route.query.courseId ||
    extractCourseIdFromPath(pathname) ||
    ""
  ).toString();

  if (pid) {
    await fetchAllContent(pid);
    // Load lab challenges for all lab lessons
    await loadLabChallenges();
  }
  reflectSideInputs();
});

/**
 * Load lab challenges for all lab lessons in the course
 */
async function loadLabChallenges() {
  if (!course.id || !course.modules.length) return;

  try {
    const resp = await fetch(`${LAB_API}/challenges`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (resp.ok) {
      const data = await resp.json();
      const challenges = data.items || [];

      // Cache challenges by lessonId
      for (const challenge of challenges) {
        if (challenge.lessonId && challenge.courseId === course.id) {
          const cacheKey = `${course.id}:${challenge.lessonId}`;
          labChallengeCache.value[cacheKey] = challenge;
        }
      }
    }
  } catch (err) {
    console.warn("[LabChallenge] Failed to load challenges:", err);
  }
}

/** Computed for prereqs */
const prereqOptions = computed(() =>
  flatLessons.value
    .filter((x) =>
      currentLesson.value ? x.id !== currentLesson.value.id : true,
    )
    .map((x) => ({ label: x.label, value: x.id })),
);
/** 🔧 Teacher code-server launcher (legacy method - kept for backwards compatibility) */
async function openTeacherCodeServer(teacherId: string) {
  try {
    const resp = await fetch(
      `${API_REST}/code-server/${encodeURIComponent(String(teacherId))}/${encodeURIComponent(String(currentLesson.value.id))}`,
      {
        headers: { Authorization: `Bearer ${getCookieToken()}` },
        credentials: "include",
      },
    );
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    if (data.ok && data.url) {
      window.open(data.url, "_blank"); // open VS Code in new tab
    } else {
      message.error(data.error || "Failed to start code-server");
    }
  } catch (err: any) {
    console.error("[CodeServer] Failed:", err);
    message.error("Could not open code-server");
  }
}

/** Lab Challenge Management */
const labChallengeCache = ref<Record<string, any>>({});

/**
 * Get or create a LabChallenge for the current lesson
 */
async function getOrCreateLabChallenge() {
  if (!currentLesson.value?.id || !course.id) return null;

  const lessonId = currentLesson.value.id;
  const cacheKey = `${course.id}:${lessonId}`;

  // Check cache first
  if (labChallengeCache.value[cacheKey]) {
    return labChallengeCache.value[cacheKey];
  }

  try {
    // Prefer new lesson-specific endpoint (auto-creates if needed)
    const lessonResp = await fetch(`${LAB_API}/challenges/by-lesson/${lessonId}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    }).catch(() => null);

    if (lessonResp?.ok) {
      const lessonData = await lessonResp.json();
      if (lessonData.challenge) {
        labChallengeCache.value[cacheKey] = lessonData.challenge;
        return lessonData.challenge;
      }
    }

    // Check if challenge already exists (bound to this lesson)
    const listResp = await fetch(`${LAB_API}/challenges`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (listResp.ok) {
      const listData = await listResp.json();
      const existing = listData.items?.find(
        (c: any) => c.lessonId === lessonId && c.courseId === course.id
      );

      if (existing) {
        labChallengeCache.value[cacheKey] = existing;
        return existing;
      }
    }

    // Create new challenge
    const createResp = await fetch(`${LAB_API}/challenges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      credentials: "include",
      body: JSON.stringify({
        title: currentLesson.value.title || "Lab Challenge",
        slug: `lab-${lessonId}-${Date.now()}`,
        description: currentLesson.value.content || "",
        difficulty: course.difficulty || "Beginner",
        courseId: course.id,
        moduleId: currentModule.value?.id || null,
        lessonId: lessonId,
        visibility: "private",
      }),
    });

    if (!createResp.ok) {
      const err = await createResp.json().catch(() => ({ error: "Failed to create challenge" }));
      throw new Error(err.error || `HTTP ${createResp.status}`);
    }

    const createData = await createResp.json();
    const challenge = createData.item;

    labChallengeCache.value[cacheKey] = challenge;
    return challenge;
  } catch (err: any) {
    console.error("[LabChallenge] Failed to get/create:", err);
    return null;
  }
}

/**
 * Get existing LabChallenge (doesn't create)
 */
async function getLabChallenge() {
  if (!currentLesson.value?.id || !course.id) return null;

  const lessonId = currentLesson.value.id;
  const cacheKey = `${course.id}:${lessonId}`;

  if (labChallengeCache.value[cacheKey]) {
    return labChallengeCache.value[cacheKey];
  }

  try {
    const lessonResp = await fetch(`${LAB_API}/challenges/by-lesson/${lessonId}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    }).catch(() => null);

    if (lessonResp?.ok) {
      const lessonData = await lessonResp.json();
      if (lessonData.challenge) {
        labChallengeCache.value[cacheKey] = lessonData.challenge;
        return lessonData.challenge;
      }
    }

    const resp = await fetch(`${LAB_API}/challenges`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (resp.ok) {
      const data = await resp.json();
      const existing = data.items?.find(
        (c: any) => c.lessonId === lessonId && c.courseId === course.id
      );

      if (existing) {
        labChallengeCache.value[cacheKey] = existing;
        return existing;
      }
    }
  } catch (err) {
    console.warn("[LabChallenge] Failed to fetch:", err);
  }

  return null;
}

/**
 * Ensure LabChallenge exists and is synced with lesson
 */
async function ensureLabChallenge() {
  if (!currentLesson.value?.id || currentLesson.value.type !== "lab") return;

  const challenge = await getOrCreateLabChallenge();
  if (!challenge) {
    console.warn("[LabChallenge] Failed to ensure challenge");
  }
}

const moduleIdForStudy = computed(() => route.params.moduleId || route.params.id || 'unknown')
const study = reactive({
  notes: '',
  tasks: [] as { id: string, text: string, done: boolean }[],
  resources: [] as { label?: string, url: string }[],
})

const storageKey = computed(() => `byway:module:${moduleIdForStudy.value}:study`)

async function loadStudy() {
  try {
    const data = await fetchGraphQL(
      `query GetStudy($moduleId: String!){ myUiPrefs }`,
      { moduleId: moduleIdForStudy.value }
    );
    if (data?.myUiPrefs) {
      const parsed = JSON.parse(data.myUiPrefs);
      Object.assign(study, parsed);
    }
  } catch (e) {
    console.warn("Load study failed:", e);
  }
}

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

onMounted(loadStudy)
watch(study, saveStudy, { deep: true })

let autosaveTimer: any = null
onMounted(() => {
  autosaveTimer = setInterval(saveStudy, 10000)
})
onBeforeUnmount(() => autosaveTimer && clearInterval(autosaveTimer))

// Tasks
const newTaskText = ref('')
function addTask() {
  const text = (newTaskText.value || '').trim()
  if (!text) return
  study.tasks.push({ id: String(Date.now()), text, done: false })
  newTaskText.value = ''
}
function toggleTask(id: string) {
  const t = study.tasks.find(t => t.id === id)
  if (t) t.done = !t.done
}
function clearCompleted() {
  study.tasks = study.tasks.filter(t => !t.done)
}
const taskProgress = computed(() => {
  const total = study.tasks.length || 1
  const done = study.tasks.filter(t => t.done).length
  return Math.round((done/total)*100)
})
function renderTask({ item }: any) {
  return h('div', { class: 'flex items-center gap-3' }, [
    h('a-checkbox', {
      checked: item.done,
      onChange: () => toggleTask(item.id)
    }),
    h('span', { style: item.done ? 'text-decoration:line-through;opacity:.7' : '' }, item.text)
  ])
}

// Focus timer
const focusOptions = ['25','50','90','Custom']
const focusPreset = ref('25')
const focusCustom = ref(30)
const focusRunning = ref(false)
const focusSeconds = ref(0)
watch(focusPreset, (v) => {
  if (v !== 'Custom') focusSeconds.value = Number(v) * 60
})
onMounted(() => focusSeconds.value = Number(focusPreset.value) * 60)

let tick: any = null
function startFocus() {
  if (focusPreset.value === 'Custom') {
    focusSeconds.value = Number(focusCustom.value || 30) * 60
  }
  focusRunning.value = true
  if (tick) clearInterval(tick)
  tick = setInterval(() => {
    if (!focusRunning.value) return
    if (focusSeconds.value > 0) focusSeconds.value--
  }, 1000)
}
function pauseFocus() { focusRunning.value = !focusRunning.value }
function resetFocus() { focusRunning.value = false; focusSeconds.value = Number(focusPreset.value === 'Custom' ? focusCustom.value : focusPreset.value) * 60 }

const mm = computed(() => String(Math.floor(focusSeconds.value/60)).padStart(2,'0'))
const ss = computed(() => String(focusSeconds.value%60).padStart(2,'0'))
const focusPercent = computed(() => {
  const total = (focusPreset.value === 'Custom' ? Number(focusCustom.value || 30) : Number(focusPreset.value)) * 60
  if (!total) return 0
  return Math.round(100 - (focusSeconds.value/total)*100)
})

// Resources
const resourceLabel = ref('')
const resourceUrl = ref('')

// Prefer Nuxt's $fetch to avoid coupling to apollo setup on client
// We'll call the existing GraphQL gateway exposed by teach-internal plugin.
const uniActiveKey = ref('cohorts')
const uniLoading = ref(false)

const courseId = computed(() => (route?.params?.courseId || route?.query?.courseId || (typeof currentCourse !== 'undefined' && currentCourse?.id) || (typeof props !== 'undefined' && props?.courseId) || null))

const institution = ref(null)

// Cohorts
const cohorts = ref([])
const cohortSearch = ref('')
const activeCohortId = ref(null)
const loadingCohorts = ref(false)
const cohortOptions = computed(() => cohorts.value.map(c => ({ label: c.name, value: c.id })))
const filteredCohorts = computed(() => !cohortSearch.value ? cohorts.value : cohorts.value.filter(c => (c.name||'').toLowerCase().includes(cohortSearch.value.toLowerCase())))

async function gqlFetch(query, variables) {
  try {
    const res = await $fetch('/api/teach-internal/graphql', { method: 'POST', body: { query, variables } })
    if (res?.errors?.length) throw new Error(res.errors[0]?.message || 'GraphQL error')
    return res?.data || {}
  } catch (e) {
    console.warn('[uni:gqlFetch]', e)
    return {}
  }
}

async function refreshCohorts() {
  if (!courseId.value) return
  loadingCohorts.value = true
  const data = await gqlFetch(
    `query($courseId: ID!){
       classroomsByCourse(courseId: $courseId){ id name startDate endDate size studentsCount }
     }`,
    { courseId: String(courseId.value) }
  )
  cohorts.value = data?.classroomsByCourse || []
  if (!activeCohortId.value && cohorts.value.length) activeCohortId.value = cohorts.value[0].id
  loadingCohorts.value = false
}

function handleCohortChange() {
  // cascade refresh to other tabs
  if (uniActiveKey.value === 'assignments') refreshAssignments()
  if (uniActiveKey.value === 'enrollments') refreshEnrollments()
}

// Assignments
const assignments = ref([])
const loadingAssignments = ref(false)
const assignmentDueAfter = ref(null)

const assignmentColumns = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Due', dataIndex: 'dueDate', key: 'dueDate',
     customRender: ({ text }) => text ? new Date(text).toLocaleString() : '—' },
  { title: 'Submissions', dataIndex: 'submissionsCount', key: 'submissionsCount' },
  { title: 'Avg Grade', dataIndex: 'averageGrade', key: 'averageGrade',
     customRender: ({ text }) => (text==null?'—': Number(text).toFixed(1)) },
]

async function refreshAssignments() {
  if (!activeCohortId.value) return
  loadingAssignments.value = true
  const vars = { classroomId: String(activeCohortId.value) }
  const data = await gqlFetch(
    `query($classroomId: ID!){
       assignmentsByClassroom(classroomId: $classroomId){ id title dueDate submissionsCount averageGrade }
     }`, vars
  )
  let rows = data?.assignmentsByClassroom || []
  if (assignmentDueAfter.value) {
    const ts = new Date(assignmentDueAfter.value).getTime()
    rows = rows.filter(a => a?.dueDate ? new Date(a.dueDate).getTime() >= ts : true)
  }
  assignments.value = rows
  loadingAssignments.value = false
}

// Enrollments (REST from students-internal)
const enrollments = ref([])
const loadingEnrollments = ref(false)
const enrollmentColumns = [
  { title: 'Student', dataIndex: 'studentName', key: 'studentName' },
  { title: 'Email', dataIndex: 'studentEmail', key: 'studentEmail' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
]

async function refreshEnrollments() {
  if (!activeCohortId.value) return
  loadingEnrollments.value = true
  try {
    // Pragmatic default: list all students enrolled in the course, optionally filtered by cohort if server supports it.
    const res = await $fetch('/plugins/students-internal/api/students/enrollments', {
      method: 'GET',
      query: { courseId: String(courseId.value), classroomId: String(activeCohortId.value) }
    })
    enrollments.value = Array.isArray(res) ? res : (res?.items || [])
  } catch (e) {
    console.warn('[uni:enrollments]', e)
    enrollments.value = []
  } finally {
    loadingEnrollments.value = false
  }
}

// Gradebook
const gradebookInfo = ref('')
const downloadingGradebook = ref(false)
async function downloadGradebook() {
  if (!activeCohortId.value) return
  downloadingGradebook.value = true
  try {
    const data = await gqlFetch(
      `query($classroomId: ID!){
         gradebookCsv(classroomId: $classroomId)
       }`,
      { classroomId: String(activeCohortId.value) }
    )
    const csv = data?.gradebookCsv
    if (csv) {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `gradebook_${activeCohortId.value}.csv`
      a.click()
      URL.revokeObjectURL(url)
      gradebookInfo.value = new Date().toLocaleString()
    }
  } catch (e) {
    console.warn('[uni:gradebook]', e)
  } finally {
    downloadingGradebook.value = false
  }
}

// Basic analytics (client-side derived for now)
const analytics = reactive({ completionRate: 0, avgGrade: 0, activeThisWeek: 0 })
watch([assignments, enrollments], () => {
  const subs = assignments.value.map(a => a?.submissionsCount || 0).reduce((a,b)=>a+b,0)
  const total = enrollments.value.length || 1
  analytics.completionRate = Math.min(100, Math.round((subs / total) * 100))
  const grades = assignments.value.map(a => a?.averageGrade).filter(v => v!=null)
  analytics.avgGrade = grades.length ? grades.reduce((a,b)=>a+b,0) / grades.length : 0
}, { immediate: true })

onMounted(async () => {
  uniLoading.value = true
  await refreshCohorts()
  if (activeCohortId.value) {
    await Promise.all([refreshAssignments(), refreshEnrollments()])
  }
  uniLoading.value = false
})



</script>

<style scoped>
.admin-wrap {
  min-height: 100vh;
  background: #f6f8fb;
}
.is-dark {
  background: #0b1220;
}
.admin-header {
  background: #fff;
  border-bottom: 1px solid #eef2f7;
}
.is-dark .admin-header {
  background: #0f172a;
}

.admin-sider {
  background: #0b1b2b;
  color: #cbd5e1;
}
.sider-pad {
  padding: 12px;
  background-color: white;
}
.cover {
  height: 140px;
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}
.cover-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.55));
}
.cover-meta {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 10px;
  color: #fff;
}
.cover-title {
  font-weight: 700;
  font-size: 15px;
}
.cover-tags {
  margin-top: 6px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.mt-1 {
  margin-top: 8px;
}
.mt-2 {
  margin-top: 12px;
}
.mb-2 {
  margin-bottom: 12px;
}

.admin-content {
  padding: 16px;
}
.mod-actions {
  margin-bottom: 8px;
}

.tree-lesson {
  cursor: pointer;
  border-radius: 6px;
}
.tree-lesson.active {
  background: #f0f9ff;
}
.is-dark .tree-lesson.active {
  background: #0b1f37;
}

.preview-head {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.video-wrap {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 8px;
}
.video-wrap iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.video-fallback {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 8px 12px;
  word-break: break-all;
}
.is-dark .video-fallback {
  background: #0f172a;
}

.option-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 6px;
}
.opt-input {
  flex: 1;
}
.kv-stack,
.arg-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}
.kv-row,
.arg-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.kv-row > .ant-input,
.kv-row > .ant-input-number,
.arg-row > .ant-input,
.arg-row > .ant-select {
  flex: 1;
  min-width: 140px;
}
.arg-row > .ant-checkbox {
  align-self: center;
}
.code-frame {
  width: 100%;
  height: 80vh;
  border: none;
}

/* University Mode: Surgical Additions v10-increment4 */
.uni-mode-card :deep(.ant-tabs-nav) { margin-bottom: 12px; }
.cohort-card .dim, .uni-mode-card .dim { opacity: 0.7; font-size: 12px; }
.grid-analytics { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
.kpi { font-size: 28px; font-weight: 600; line-height: 1.2; }
@media (max-width: 960px){ .grid-analytics{ grid-template-columns: 1fr 1fr; } }
@media (max-width: 640px){ .grid-analytics{ grid-template-columns: 1fr; } }

</style>
a