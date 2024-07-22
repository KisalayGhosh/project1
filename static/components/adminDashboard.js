export default {
  template: `
    <div>
      <!-- Search and filter controls -->
      <div class="m-5 d-flex">
        <input type="text" class="form-control me-2" placeholder="Search Section" v-model="searchQuery" @input="filterSections">
        <select class="form-control me-2" v-model="selectedSection" @change="filterSections">
          <option value="">All Sections</option>
          <option v-for="section in allSections" :key="section.section_id" :value="section.section_id">{{ section.section_name }}</option>
        </select>
        <button class="btn btn-primary me-2" @click="filterSections">Filter</button>
        <button class="btn btn-secondary" @click="clearFilter">Clear</button>
      </div>

      <!-- Display sections -->
      <div class="row m-5">
        <div class="col-lg-4 col-md-6 col-sm-12" v-for="section in filteredSections" :key="section.section_id">
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">{{ section.section_name }}</h5>
              <p class="card-text">{{ section.description }}</p>
              <p class="card-text">Created: {{ formatDate(section.created_at) }}</p>
              <p class="card-text">Updated: {{ formatDate(section.updated_at) }}</p>
              <button class="btn btn-primary" @click="showAddEbookModal(section.section_id)">Add Ebook</button>
              <button class="btn btn-danger" @click="deleteSection(section.section_id)">Delete Section</button>
              <button class="btn btn-success" @click="showUpdateSectionModal(section)">Update Section</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add ebook modal -->
      <div class="modal fade" id="addEbookModal" tabindex="-1" aria-labelledby="addEbookModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addEbookModalLabel">Add New Ebook</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addEbook">
                <div class="mb-3">
                  <label for="ebookTitle" class="form-label">Ebook Title</label>
                  <input type="text" class="form-control" id="ebookTitle" v-model="newEbook.title" required>
                </div>
                <div class="mb-3">
                  <label for="ebookContent" class="form-label">Content</label>
                  <textarea class="form-control" id="ebookContent" v-model="newEbook.content"></textarea>
                </div>
                <div class="mb-3">
                  <label for="ebookAuthor" class="form-label">Author</label>
                  <input type="text" class="form-control" id="ebookAuthor" v-model="newEbook.author" required>
                </div>
                <button type="submit" class="btn btn-success">Add Ebook</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Update section modal -->
      <div class="modal fade" id="updateSectionModal" tabindex="-1" aria-labelledby="updateSectionModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="updateSectionModalLabel">Update Section</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updateSection">
                <div class="mb-3">
                  <label for="sectionName" class="form-label">Section Name</label>
                  <input type="text" class="form-control" id="sectionName" v-model="currentSection.name" required>
                </div>
                <div class="mb-3">
                  <label for="sectionDescription" class="form-label">Description</label>
                  <textarea class="form-control" id="sectionDescription" v-model="currentSection.description"></textarea>
                </div>
                <button type="submit" class="btn btn-success">Update Section</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      sections: [],
      allSections: [],
      filteredSections: [],
      newEbook: {
        title: '',
        content: '',
        author: ''
      },
      showAddEbookFormFlag: false,
      currentSection: {
        id: null,
        name: '',
        description: ''
      },
      searchQuery: '',
      selectedSection: '',
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
        this.allSections = data;
        this.filteredSections = data;
      } catch (error) {
        console.error('Error fetching sections:', error);
        this.error = 'Failed to load sections.';
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    },
    showAddEbookModal(sectionId) {
      this.currentSection.id = sectionId;
      this.newEbook = {
        title: '',
        content: '',
        author: ''
      };
      new bootstrap.Modal(document.getElementById('addEbookModal')).show();
    },
    async addEbook() {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/sections/${this.currentSection.id}/ebooks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.newEbook)
        });
        if (!response.ok) {
          throw new Error('Failed to add ebook.');
        }
        this.fetchSections();
        this.newEbook = {
          title: '',
          content: '',
          author: ''
        };
        bootstrap.Modal.getInstance(document.getElementById('addEbookModal')).hide();
      } catch (error) {
        console.error('Error adding ebook:', error);
        this.error = 'Failed to add ebook.';
      }
    },
    showUpdateSectionModal(section) {
      this.currentSection = { ...section };
      new bootstrap.Modal(document.getElementById('updateSectionModal')).show();
    },
    async updateSection() {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/sections/${this.currentSection.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.currentSection)
        });
        if (!response.ok) {
          throw new Error('Failed to update section.');
        }
        this.fetchSections();
        bootstrap.Modal.getInstance(document.getElementById('updateSectionModal')).hide();
      } catch (error) {
        console.error('Error updating section:', error);
        this.error = 'Failed to update section.';
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
        this.fetchSections();
      } catch (error) {
        console.error('Error deleting section:', error);
        this.error = 'Failed to delete section.';
      }
    },
    filterSections() {
      this.filteredSections = this.allSections.filter(section => {
        const matchesSearch = section.section_name.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesFilter = this.selectedSection ? section.section_id === this.selectedSection : true;
        return matchesSearch && matchesFilter;
      });
    },
    clearFilter() {
      this.searchQuery = '';
      this.selectedSection = '';
      this.filteredSections = this.allSections;
    }
  }
};
