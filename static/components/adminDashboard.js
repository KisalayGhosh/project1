export default {
  template: `
<div>
  <!-- Plus icon to toggle form -->
  <div class="card mb-4 text-center p-2">
    <div class="card-body" @click="toggleAddSectionForm">
      <i class="fas fa-plus"></i> Add New Section
    </div>
  </div>

  <!-- Form to add new section -->
  <div v-if="showAddSectionForm" class="card mb-4">
    <div class="card-body">
      <h5 class="card-title">Add New Section</h5>
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
    </div>
  </div>

  <!-- Cards for existing sections -->
  <div class="row mb-4 p-2">
    <div class="col-lg-4 col-md-6 col-sm-12" v-for="section in sections" :key="section.id">
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">{{ section.section_name }}</h5>
          <p class="card-text">{{ section.description }}</p>
          <p class="card-text">Created: {{ formatDate(section.created_at) }}</p>
          <p class="card-text">Updated: {{ formatDate(section.updated_at) }}</p>
          <button class="btn btn-primary" @click="navigateToAddEbook(section.id)">Add Ebook</button>
          <button class="btn btn-danger" @click="navigateToAddEbook(section.id)">Delete Section</button>
          <button class="btn btn-success" @click="navigateToAddEbook(section.id)">Update Section</button>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  data() {
    return {
      sections: [],
      newSection: {
        section_name: '',
        description: ''
      },
      showAddSectionForm: false // Initially hide the form
    };
  },
  mounted() {
    this.fetchSections();
  },
  methods: {
    fetchSections() {
      axios.get('/sections-details')
        .then(response => {
          this.sections = response.data;
        })
        .catch(error => {
          console.error('Error fetching sections:', error);
        });
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString(); // Adjust format as needed
    },
    toggleAddSectionForm() {
      this.showAddSectionForm = !this.showAddSectionForm;
    },
    navigateToAddEbook(sectionId) {
      console.log(`Navigate to add ebook for section ${sectionId}`);
    },
    addSection() {
      axios.post('/sections', this.newSection)
        .then(response => {
          this.sections.push(response.data.section);
          this.newSection.section_name = '';
          this.newSection.description = '';
          this.showAddSectionForm = false; 
        })
        .catch(error => {
          console.error('Error adding section:', error);
        });
    }
  }
};
