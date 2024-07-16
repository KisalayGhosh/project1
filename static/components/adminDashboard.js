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
        <div class="col-lg-4 col-md-6 col-sm-12" v-for="section in sections" :key="section.section_id">
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">{{ section.section_name }}</h5>
              <p class="card-text">{{ section.description }}</p>
              <p class="card-text">Created: {{ formatDate(section.created_at) }}</p>
              <p class="card-text">Updated: {{ formatDate(section.updated_at) }}</p>
              <button class="btn btn-primary" @click="addEbookToSection(section.section_id)">Add Ebook</button>
              <button class="btn btn-danger" @click="deleteSection(section.section_id)">Delete Section</button>
              <button class="btn btn-success" @click="updateSection(section.section_id)">Update Section</button>
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
      showAddSectionForm: false, // Initially hide the form
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
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString(); // Adjust format as needed
    },
    toggleAddSectionForm() {
      this.showAddSectionForm = !this.showAddSectionForm;
    },
    async addSection() {
      try {
        const response = await fetch('/sections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.newSection)
        });
        if (!response.ok) {
          throw new Error('Failed to add section.');
        }
        const data = await response.json();
        this.sections.push(data.section);
        this.newSection.section_name = '';
        this.newSection.description = '';
        this.showAddSectionForm = false;
      } catch (error) {
        console.error('Error adding section:', error);
        this.error = 'Failed to add section.';
      }
    },
    async deleteSection(sectionId) {
      try {
        const response = await fetch(`/sections/${sectionId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Failed to delete section.');
        }
        this.sections = this.sections.filter(section => section.section_id !== sectionId);
      } catch (error) {
        console.error('Error deleting section:', error);
        this.error = 'Failed to delete section.';
      }
    },
    async updateSection(sectionId) {
      try {
        const updatedSection = this.sections.find(section => section.section_id === sectionId);
        const response = await fetch(`/sections/${sectionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedSection)
        });
        if (!response.ok) {
          throw new Error('Failed to update section.');
        }
        console.log('Section updated successfully:', updatedSection);
        // Optionally update state or notify user
      } catch (error) {
        console.error('Error updating section:', error);
        this.error = 'Failed to update section.';
      }
    },
    async addEbookToSection(sectionId) {
      try {
        const newEbook = {
          title: 'New Ebook Title',
          content: 'Ebook content here...',
          author: 'Author Name',
        };
        const response = await fetch(`/sections/${sectionId}/ebooks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newEbook)
        });
        if (!response.ok) {
          throw new Error('Failed to add ebook.');
        }
        console.log('Ebook added successfully:', newEbook);
        // Optionally, update state or notify user
      } catch (error) {
        console.error('Error adding ebook:', error);
        // Handle error response
      }
    },
  }
};
