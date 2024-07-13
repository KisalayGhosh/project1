export default {
    template: `
      <div>
        <h2>Manage Sections</h2>
        <div v-if="error">{{ error }}</div>
        <div v-if="sections.length">
          <ul>
            <li v-for="section in sections" :key="section.section_id">
              <h3>{{ section.section_name }}</h3>
              <p>{{ section.description }}</p>
            </li>
          </ul>
        </div>
        <div v-else>No sections available.</div>
      </div>
    `,
    data() {
      return {
        sections: [],
        error: null,
      };
    },
    created() {
      fetch('/sections-details', {
        headers: {
          'Authentication-Token': localStorage.getItem('token'),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.sections = data;
        })
        .catch((error) => {
          this.error = 'Failed to load sections.';
        });
    },
  };
  