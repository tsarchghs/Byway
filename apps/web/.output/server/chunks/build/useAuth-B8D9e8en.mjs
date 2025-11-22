import { computed, ref } from 'vue';

const user = ref(null);
const token = ref(null);
function useAuth() {
  const isLoggedIn = computed(() => !!token.value);
  const roleList = computed(() => {
    const roles = user.value?.roles;
    if (Array.isArray(roles))
      return roles.map((r) => String(r));
    return [];
  });
  const isStudent = computed(() => roleList.value.some((role) => role.toLowerCase().includes("student")));
  const isTeacher = computed(() => roleList.value.some((role) => role.toLowerCase().includes("teacher")));
  const isInstitutionAdmin = computed(
    () => roleList.value.some(
      (role) => role.toLowerCase().includes("admin") || role.toLowerCase().includes("institution_admin") || role.toLowerCase().includes("institution-admin")
    )
  );
  function login(payload) {
    user.value = payload.user;
    token.value = payload.token;
    localStorage.setItem("token", token.value);
    localStorage.setItem("user", JSON.stringify(user.value));
  }
  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  return {
    user,
    me: user,
    token,
    isLoggedIn,
    login,
    logout,
    isStudent,
    isTeacher,
    isInstitutionAdmin
  };
}

export { useAuth as u };
//# sourceMappingURL=useAuth-B8D9e8en.mjs.map
