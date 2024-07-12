// export default {
//     template: `
//       <div>
//         <h2>Sections</h2>
//         <ul>
//           <li v-for="section in sections" :key="section.id">
//             {{ section.section_name }} - {{ section.description }}
//           </li>
//         </ul>
//       </div>
//     `,
//     data() {
//       return {
//         sections: []
//       }
//     },
//     created() {
//       fetch('http://127.0.0.1:5000/api/sections')
//         .then(response => response.json())
//         .then(data => {
//           this.sections = data;
//         })
//     }
//   }
  