import { watch, ref, computed } from 'vue';
import { u as useAuth } from './useAuth-B8D9e8en.mjs';

const cart = ref(null);
const loading = ref(false);
const error = ref(null);
const studentIdCache = ref(null);
function apiBase() {
  return process.env.API_BASE || "http://localhost:4000";
}
function getAuthHeaders() {
  const headers = {
    "Content-Type": "application/json"
  };
  return headers;
}
async function resolveStudentId(user) {
  if (!user?.id) return null;
  if (studentIdCache.value) return studentIdCache.value;
  const headers = getAuthHeaders();
  const authId = user.userId || user.id;
  try {
    const res = await fetch(`${apiBase()}/api/students-internal/graphql`, {
      method: "POST",
      headers,
      body: JSON.stringify({ query: `query($uid:String!){ studentByUserId(userId:$uid){ id } }`, variables: { uid: authId } })
    });
    const json = await res.json();
    const sid = json?.data?.studentByUserId?.id || null;
    if (sid) {
      studentIdCache.value = sid;
      return sid;
    }
  } catch {
  }
  try {
    const res = await fetch(`${apiBase()}/api/students-internal/api/ensure-student`, {
      method: "POST",
      headers,
      body: JSON.stringify({ userId: authId, displayName: user.email || user.displayName || "Student" })
    });
    const json = await res.json();
    const sid = json?.data?.id || null;
    if (sid) {
      studentIdCache.value = sid;
      return sid;
    }
  } catch {
  }
  return null;
}
function ecommerceEndpoint() {
  return `${apiBase()}/api/ecommerce/graphql`;
}
async function gql(endpoint, query, variables) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message || "GraphQL error");
  return json.data;
}
async function fetchCart() {
  const { user } = useAuth();
  if (!user.value?.id) {
    cart.value = null;
    return;
  }
  const sid = await resolveStudentId(user.value);
  if (!sid) {
    cart.value = null;
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const data = await gql(ecommerceEndpoint(), `
      query ($studentId: String!) {
        cartByStudent(studentId: $studentId) {
          id
          status
          studentId
          items {
            id
            orderId
            courseId
            quantity
            titleSnapshot
            priceSnapshot
          }
          updatedAt
          createdAt
        }
      }
    `, { studentId: sid });
    cart.value = data?.cartByStudent || null;
  } catch (e) {
    error.value = e?.message || String(e);
    console.warn("[useCart] Failed to fetch cart:", e);
  } finally {
    loading.value = false;
  }
}
async function addToCart(courseId, quantity = 1) {
  const { user } = useAuth();
  if (!user.value?.id) throw new Error("Not authenticated. Please log in to add items to cart.");
  const sid = await resolveStudentId(user.value);
  if (!sid) throw new Error("Student profile missing");
  loading.value = true;
  error.value = null;
  try {
    const data = await gql(ecommerceEndpoint(), `
      mutation ($studentId: String!, $courseId: String!, $quantity: Int) {
        addCartItem(studentId: $studentId, courseId: $courseId, quantity: $quantity) {
          id
          orderId
          courseId
          quantity
        }
      }
    `, { studentId: sid, courseId, quantity });
    await fetchCart();
    return data?.addCartItem?.id;
  } catch (e) {
    error.value = e?.message || String(e);
    throw e;
  } finally {
    loading.value = false;
  }
}
async function removeFromCart(orderItemId) {
  const { user } = useAuth();
  if (!user.value?.id) throw new Error("Not authenticated");
  const sid = await resolveStudentId(user.value);
  if (!sid) throw new Error("Student profile missing");
  loading.value = true;
  error.value = null;
  try {
    await gql(ecommerceEndpoint(), `
      mutation ($studentId: String!, $orderItemId: String!) {
        removeCartItem(studentId: $studentId, orderItemId: $orderItemId) {
          ok
        }
      }
    `, { studentId: sid, orderItemId });
    await fetchCart();
  } catch (e) {
    error.value = e?.message || String(e);
    throw e;
  } finally {
    loading.value = false;
  }
}
async function clearCart() {
  const { user } = useAuth();
  if (!user.value?.id) throw new Error("Not authenticated");
  const sid = await resolveStudentId(user.value);
  if (!sid) throw new Error("Student profile missing");
  loading.value = true;
  error.value = null;
  try {
    await gql(ecommerceEndpoint(), `
      mutation ($studentId: String!) {
        clearCart(studentId: $studentId) {
          ok
        }
      }
    `, { studentId: sid });
    await fetchCart();
  } catch (e) {
    error.value = e?.message || String(e);
    throw e;
  } finally {
    loading.value = false;
  }
}
function isInCart(courseId) {
  if (!cart.value?.items) return false;
  return cart.value.items.some((item) => item.courseId === courseId);
}
const itemCount = computed(() => {
  if (!cart.value?.items) return 0;
  return cart.value.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
});
const totalPrice = computed(() => {
  if (!cart.value?.items) return 0;
  return cart.value.items.reduce((sum, item) => {
    const price = Number(item.priceSnapshot || 0);
    const qty = Number(item.quantity || 1);
    return sum + price * qty;
  }, 0);
});
function useCart() {
  const { user, isLoggedIn } = useAuth();
  watch(isLoggedIn, (loggedIn) => {
    if (loggedIn && user.value?.id) {
      fetchCart();
    } else {
      cart.value = null;
    }
  }, { immediate: true });
  return {
    cart,
    loading,
    error,
    items: computed(() => cart.value?.items || []),
    itemCount,
    totalPrice,
    isEmpty: computed(() => !cart.value?.items || cart.value.items.length === 0),
    fetchCart,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart
  };
}

export { useCart as u };
//# sourceMappingURL=useCart-7pxN526Z.mjs.map
