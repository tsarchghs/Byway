import{u as x}from"./DL41CzME.js";import{g as S,r as v,l as I,k as w,q as A,w as r,p as u,o as T,b as o,a as l,d as g,t as m}from"./DQDUwbr-.js";const h=S({__name:"index",setup(B){const f=v(!1),d=v([]),k=[{title:"Course",dataIndex:"courseTitle",key:"courseTitle"},{title:"Assignment",dataIndex:"assignmentTitle",key:"assignmentTitle"},{title:"Score",key:"score",customRender:({record:e})=>e.score==null||e.maxScore==null?"–":`${e.score} / ${e.maxScore}`},{title:"Percentage",key:"percentage",customRender:({record:e})=>e.percentage==null?"–":e.percentage.toFixed(1)+"%"},{title:"Letter",dataIndex:"letter",key:"letter"},{title:"Updated at",dataIndex:"updatedAt",key:"updatedAt"}],_=I(()=>{if(!d.value.length)return{avgPct:null,bestCourse:null,lastUpdated:null};const e={};let a=null;for(const t of d.value){const n=typeof t.percentage=="number"?t.percentage:null;if(n!=null){const i=t.courseTitle||t.courseId;e[i]||(e[i]={pctSum:0,count:0}),e[i].pctSum+=n,e[i].count++}t.updatedAt&&(!a||t.updatedAt>a)&&(a=t.updatedAt)}const c=Object.entries(e),p=c.length>0?c.sort((t,n)=>n[1].pctSum/n[1].count-t[1].pctSum/t[1].count)[0][0]:null,s=[];for(const t of d.value)typeof t.percentage=="number"&&s.push(t.percentage);return{avgPct:s.length>0?s.reduce((t,n)=>t+n,0)/s.length:null,bestCourse:p,lastUpdated:a}});async function b(){f.value=!0;try{const e="demo-student",{call:a}=x("/api/gradebook/graphql"),c=await a(`query GradebookByStudent($studentId: String!) {
        gradebookByStudent(studentId: $studentId) {
          id
          courseId
          courseTitle
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
      }`,{studentId:e});d.value=c?.gradebookByStudent||[]}catch(e){console.error("[gradebook] Failed to load gradebookByStudent",e)}finally{f.value=!1}}return w(b),(e,a)=>{const c=u("a-page-header"),p=u("a-card"),s=u("a-col"),y=u("a-table"),t=u("a-row"),n=u("a-space"),i=u("a-layout");return T(),A(i,{class:"p-6"},{default:r(()=>[o(c,{title:"My Gradebook","sub-title":"Overview of your courses, assignments, and grades"}),o(n,{direction:"vertical",style:{width:"100%"}},{default:r(()=>[o(t,{gutter:16},{default:r(()=>[o(s,{xs:24,md:8},{default:r(()=>[o(p,{size:"small",title:"Summary"},{default:r(()=>[l("p",null,[a[0]||(a[0]=l("strong",null,"Total entries:",-1)),g(" "+m(d.value.length),1)]),l("p",null,[a[1]||(a[1]=l("strong",null,"Average %:",-1)),g(" "+m(_.value.avgPct?.toFixed(1)??"–")+"%",1)]),l("p",null,[a[2]||(a[2]=l("strong",null,"Best course:",-1)),g(" "+m(_.value.bestCourse||"–"),1)]),l("p",null,[a[3]||(a[3]=l("strong",null,"Last updated:",-1)),g(" "+m(_.value.lastUpdated||"–"),1)])]),_:1})]),_:1}),o(s,{xs:24,md:16},{default:r(()=>[o(p,{size:"small",title:"Gradebook entries"},{default:r(()=>[o(y,{"data-source":d.value,columns:k,"row-key":"id",size:"small",loading:f.value},null,8,["data-source","loading"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}}});export{h as default};
