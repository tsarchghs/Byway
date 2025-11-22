import{u as l}from"./CI-SnmTa.js";import{ad as g,l as f,r as m}from"./DQDUwbr-.js";var p={};const a=m(null),s=m(!1),i=m(null),c=m(null);function w(){if(typeof window<"u"){const t=window?.__NUXT__?.config?.public;if(t?.apiBase)return t.apiBase}return p.API_BASE||"http://localhost:4000"}function y(){const t=typeof window<"u"?window.localStorage?.getItem("token"):null,e={"Content-Type":"application/json"};return t&&(e.Authorization=`Bearer ${t}`),e}async function v(t){if(!t?.id)return null;if(c.value)return c.value;const e=y(),n=t.userId||t.id;try{const o=(await(await fetch(`${w()}/api/students-internal/graphql`,{method:"POST",headers:e,body:JSON.stringify({query:"query($uid:String!){ studentByUserId(userId:$uid){ id } }",variables:{uid:n}})})).json())?.data?.studentByUserId?.id||null;if(o)return c.value=o,o}catch{}try{const o=(await(await fetch(`${w()}/api/students-internal/api/ensure-student`,{method:"POST",headers:e,body:JSON.stringify({userId:n,displayName:t.email||t.displayName||"Student"})})).json())?.data?.id||null;if(o)return c.value=o,o}catch{}return null}function I(){return`${w()}/api/ecommerce/graphql`}async function h(t,e,n){const u=await(await fetch(t,{method:"POST",headers:y(),credentials:"include",body:JSON.stringify({query:e,variables:n})})).json();if(u.errors?.length)throw new Error(u.errors[0].message||"GraphQL error");return u.data}async function d(){const{user:t}=l();if(!t.value?.id){a.value=null;return}const e=await v(t.value);if(!e){a.value=null;return}s.value=!0,i.value=null;try{const n=await h(I(),`
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
    `,{studentId:e});a.value=n?.cartByStudent||null}catch(n){i.value=n?.message||String(n),console.warn("[useCart] Failed to fetch cart:",n)}finally{s.value=!1}}async function S(t,e=1){const{user:n}=l();if(!n.value?.id)throw new Error("Not authenticated. Please log in to add items to cart.");const r=await v(n.value);if(!r)throw new Error("Student profile missing");s.value=!0,i.value=null;try{const u=await h(I(),`
      mutation ($studentId: String!, $courseId: String!, $quantity: Int) {
        addCartItem(studentId: $studentId, courseId: $courseId, quantity: $quantity) {
          id
          orderId
          courseId
          quantity
        }
      }
    `,{studentId:r,courseId:t,quantity:e});return await d(),u?.addCartItem?.id}catch(u){throw i.value=u?.message||String(u),u}finally{s.value=!1}}async function $(t){const{user:e}=l();if(!e.value?.id)throw new Error("Not authenticated");const n=await v(e.value);if(!n)throw new Error("Student profile missing");s.value=!0,i.value=null;try{await h(I(),`
      mutation ($studentId: String!, $orderItemId: String!) {
        removeCartItem(studentId: $studentId, orderItemId: $orderItemId) {
          ok
        }
      }
    `,{studentId:n,orderItemId:t}),await d()}catch(r){throw i.value=r?.message||String(r),r}finally{s.value=!1}}async function q(){const{user:t}=l();if(!t.value?.id)throw new Error("Not authenticated");const e=await v(t.value);if(!e)throw new Error("Student profile missing");s.value=!0,i.value=null;try{await h(I(),`
      mutation ($studentId: String!) {
        clearCart(studentId: $studentId) {
          ok
        }
      }
    `,{studentId:e}),await d()}catch(n){throw i.value=n?.message||String(n),n}finally{s.value=!1}}function C(t){return a.value?.items?a.value.items.some(e=>e.courseId===t):!1}const N=f(()=>a.value?.items?a.value.items.reduce((t,e)=>t+(e.quantity||1),0):0),E=f(()=>a.value?.items?a.value.items.reduce((t,e)=>{const n=Number(e.priceSnapshot||0),r=Number(e.quantity||1);return t+n*r},0):0);function _(){const{user:t,isLoggedIn:e}=l();return g(e,n=>{n&&t.value?.id?d():a.value=null},{immediate:!0}),{cart:a,loading:s,error:i,items:f(()=>a.value?.items||[]),itemCount:N,totalPrice:E,isEmpty:f(()=>!a.value?.items||a.value.items.length===0),fetchCart:d,addToCart:S,removeFromCart:$,clearCart:q,isInCart:C}}export{_ as u};
