export default {
  template: `
    <div>
      <h5 class="card-title m-3">Add New Section</h5>
      <form @submit.prevent="addSection">
        <div class="m-3">
          <label for="sectionName" class="form-label">Section Name</label>
          <input type="text" class="form-control" id="sectionName" v-model="newSection.section_name" required>
        </div>
        <div class="m-3">
          <label for="sectionDescription" class="form-label">Description</label>
          <textarea class="form-control" id="sectionDescription" v-model="newSection.description"></textarea>
        </div>
        <button type="submit" class="btn btn-success m-3">Add Section</button>
      </form>
    </div>
  `,
  data() {
    return {
      newSection: {
        section_name: '',
        description: ''
      },
      error: null
    };
  },
  methods: {
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
        this.$router.push('/admin-dashboard');
      } catch (error) {
        console.error('Error adding section:', error);
        this.error = 'Failed to add section.';
      }
    }
  }
};
