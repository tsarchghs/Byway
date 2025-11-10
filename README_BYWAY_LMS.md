

## v6 Production LMS (2025-11-10)
    - App shell + Header, search suggestions
    - Composables: user, enrollments, lessons, currency, SDK
    - Pages: Home (filters+grid), Course, Learn, Quiz, Certificate, 404
    - API stubs: auth/login|register|me, ecommerce/cart|order|enroll, students-internal/catalog|quiz
    - robots.txt & sitemap.xml


## v7 LMS Additions (2025-11-10)
    - **Cart & Checkout** pages wired to ecommerce REST stubs; enroll-on-success logic.
    - **Dashboard** shows local enrollments with continue CTA.
    - **Faculties**: index/[slug] pages + server APIs; **Categories** & **Search** pages.
    - **Course detail** served by `/plugins/students-internal/api/course/[id].get.ts`.
    - **useCart** and **useGraphQL** composables added; GraphQL endpoint remains pluggable.


## v8 LMS Modes & Coursera Flow (2025-11-10)
    - **Mode switch**: Coursera ↔ LMS via header segmented control, `?mode=coursera|lms`, and `/settings/mode` page.
    - **Coursera mode**: `/explore`, `/tracks`, rich course page (hero, curriculum, instructors, reviews).
    - **LMS mode**: keeps Faculties/Programs flows.
    - **Server APIs**: course reviews & instructors, tracks index/detail.
    - **Global middleware**: reads `mode` from query and persists.


## v9 Instructor & Accounts (2025-11-10)
    - Mode-aware **home redirect** to `/explore` (Coursera) or `/faculties` (LMS).
    - **Teach** flow: courses list, new course wizard, course builder with curriculum editor and publish toggle.
    - **Account**: certificates list, orders list; **/verify/[code]** page.
    - **REST stubs** (teach-internal CRUD, certificates, enrollments, orders, verify).
    - GraphQL endpoints untouched; Ant Design Vue throughout.


## v10 Auth, Programs, Wishlist, Progress (2025-11-10)
    - **Auth pages**: `/auth/login`, `/auth/register` (hooked to authentication REST).
    - **Account area**: `/account` layout with `/account/profile`, plus existing orders/certs.
    - **Programs** (LMS mode): `/programs`, `/programs/[slug]` with APIs.
    - **Wishlist**: composable + page + add-to-wishlist in grid.
    - **Checkout success** page.
    - **Auth middleware** for `/checkout`, `/dashboard`, `/teach`, `/account`.
    - **Progress APIs** and integration in learning player `markDone()`.
    - **Roles** support in `useUser`.


## v11 Admin, Faculty, Coupons (2025-11-10)
    - **Admin**: `/admin` system health/usage/queues (REST stubs).
    - **Faculty Admin**: `/faculty-admin` with metrics, cohorts CRUD, enrollments & instructors tables.
    - **Checkout coupons**: input + apply; `/plugins/ecommerce/api/coupon` supports BYWAY10 (-10%) and SAVE5 (-€5).
    - **Role guard middleware** for `/admin` and `/faculty-admin`.
    - **Progress** pulled on load in player; **Wishlist/Settings** links added to header.
    - Sitemaps extended.


## v12 Reviews, Q&A, Compare, Validation (2025-11-10)
    - **Reviews**: POST endpoint + `ReviewForm` component; `CourseReviews` pulls merged store.
    - **Learn**: `/learn/[courseId]/qa` Q&A board; `/learn/[courseId]/resources` file links.
    - **Compare**: `/compare?ids=...` + API to compare courses.
    - **Categories**: dynamic `/categories` reading from API.
    - **Enrollment guard**: `/ecommerce/api/cart/validate` + `/students-internal/api/enrolled/[courseId]` and enroll memory.
    - **Checkout**: validates cart before order.
    - **Admin**: `/admin/reports` stub & `/students-internal/api/reports`.
    - GraphQL untouched; Ant Design Vue used across new UIs.
