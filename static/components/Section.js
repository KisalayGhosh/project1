export default {
  template: `
    <div class="container my-4">
      <h5 class="mb-4">Add New Section</h5>
      <form @submit.prevent="addSection">
        <div class="mb-3">
          <label for="sectionName" class="form-label">Section Name</label>
          <input type="text" class="form-control" id="sectionName" v-model="newSection.section_name" required>
        </div>
        <div class="mb-3">
          <label for="sectionDescription" class="form-label">Description</label>
          <textarea class="form-control" id="sectionDescription" v-model="newSection.description"></textarea>
        </div>
        <button type="submit" class="btn btn-success">Add Section</button>
      </form>
      
      <h5 class="mt-4">Section Details</h5>
      <table class="table table-striped mt-4">
        <thead class="thead-dark">
          <tr>
            <th>Section Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="section in sections" :key="section.section_id">
            <td>{{ section.section_name }}</td>
            <td>{{ section.description }}</td>
            <td>
              <button @click="deleteSection(section.section_id)" class="btn btn-danger btn-sm">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  data() {
    return {
      newSection: {
        section_name: '',
        description: ''
      },
      sections: [],
      error: null
    };
  },
  mounted() {
    this.fetchSections();
  },
  methods: {
    async fetchSections() {
      try {
        const response = await fetch('/sections-details'); 
        if (!response.ok) {
          throw new Error('Failed to fetch sections.');
        }
        const data = await response.json();
        this.sections = data;
      } catch (error) {
        console.error('Error fetching sections:', error);
        this.error = 'Failed to load sections.';
      }
    },
    async addSection() {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('/sections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.newSection)
        });
        if (!response.ok) {
          throw new Error('Failed to add section.');
        }
        this.fetchSections();
        this.newSection = { section_name: '', description: '' }; 
      } catch (error) {
        console.error('Error adding section:', error);
        this.error = 'Failed to add section.';
      }
    },
    async deleteSection(sectionId) {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/sections/${sectionId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to delete section.');
        }
        // Refresh section list after deleting a section
        this.fetchSections();
      } catch (error) {
        console.error('Error deleting section:', error);
        this.error = 'Failed to delete section.';
      }
    }
  }
};
