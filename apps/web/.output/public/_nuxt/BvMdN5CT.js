import{u as h}from"./DL41CzME.js";import{g as I,U as x,ar as v,r as d,l as i,k as C,q as B,w as r,p as a,o as T,b as n,d as $}from"./DQDUwbr-.js";const N=I({__name:"teach-course-gradebook",setup(w){const l=x(),c=v(),o=d(!1),u=d([]),p=i(()=>l.params.teacher_id),s=i(()=>l.params.course_id),m=[{title:"Student",dataIndex:"studentDisplayName",key:"studentDisplayName"},{title:"Course",dataIndex:"courseTitle",key:"courseTitle"},{title:"Assignment",dataIndex:"assignmentTitle",key:"assignmentTitle"},{title:"Score",key:"score",customRender:({record:e})=>e.score==null||e.maxScore==null?"–":`${e.score} / ${e.maxScore}`},{title:"Percentage",key:"percentage",customRender:({record:e})=>e.percentage==null?"–":e.percentage.toFixed(1)+"%"},{title:"Letter",dataIndex:"letter",key:"letter"},{title:"Updated at",dataIndex:"updatedAt",key:"updatedAt"}];function g(){const e=`/teach-internal/${p.value}/course/${s.value}`;c?c.push(e):history.length>1&&history.back()}async function k(){o.value=!0;try{const{call:e}=h("/api/gradebook/graphql"),t=await e(`query GradebookByCourse($courseId: String!) {
        gradebookByCourse(courseId: $courseId) {
          id
          courseId
          courseTitle
          studentId
          studentDisplayName
          assignmentId
          assignmentTitle
          score
          maxScore
          percentage
          letter
          feedback
          createdAt
          updatedAt
        }
      }`,{courseId:s.value});u.value=t?.gradebookByCourse||[]}catch(e){console.error("[gradebook] Failed to load gradebookByCourse",e)}finally{o.value=!1}}return C(k),(e,t)=>{const y=a("a-page-header"),_=a("a-table"),f=a("a-card"),b=a("a-layout");return T(),B(b,{class:"p-6"},{default:r(()=>[n(y,{title:`Gradebook · ${s.value}`,"sub-title":"Teacher view of all students in this course",onBack:g},null,8,["title"]),n(f,{class:"mt-4",bordered:!1},{title:r(()=>[...t[0]||(t[0]=[$(" Course gradebook ",-1)])]),default:r(()=>[n(_,{"data-source":u.value,columns:m,"row-key":"id",size:"small",loading:o.value},null,8,["data-source","loading"])]),_:1})]),_:1})}}});export{N as default};
