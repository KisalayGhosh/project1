export default {
  template: `
    <div>
      <div class="mb-4">
        <button class="btn btn-primary me-2" @click="$router.push('/admin-requests')">Manage Requests</button>
      </div>
      <!-- Existing dashboard content goes here -->
      <div class="mb-4 d-flex">
        <input type="text" class="form-control me-2" placeholder="Search Section" v-model="searchQuery" @input="filterSections">
        <select class="form-control me-2" v-model="selectedSection" @change="filterSections">
          <option value="">All Sections</option>
          <option v-for="section in allSections" :key="section.section_id" :value="section.section_id">{{ section.section_name }}</option>
        </select>
        <button class="btn btn-primary me-2" @click="filterSections">Filter</button>
        <button class="btn btn-secondary" @click="clearFilter">Clear</button>
      </div>

      <div class="card mb-4 text-center p-2">
        <div class="card-body" @click="toggleAddSectionForm">
          <i class="fas fa-plus"></i> Add New Section
        </div>
      </div>

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

      <div class="row mb-4 p-2">
        <div class="col-lg-4 col-md-6 col-sm-12" v-for="section in filteredSections" :key="section.section_id">
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">{{ section.section_name }}</h5>
              <p class="card-text">{{ section.description }}</p>
              <p class="card-text">Created: {{ formatDate(section.created_at) }}</p>
              <p class="card-text">Updated: {{ formatDate(section.updated_at) }}</p>
              <button class="btn btn-primary" @click="showAddEbookForm(section.section_id)">Add Ebook</button>
              <button class="btn btn-danger" @click="deleteSection(section.section_id)">Delete Section</button>
              <button class="btn btn-success" @click="updateSection(section.section_id)">Update Section</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showAddEbookFormFlag" class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Add New Ebook</h5>
          <form @submit.prevent="addEbook(currentSectionId)">
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
  `,
  data() {
    return {
      sections: [],
      allSections: [],
      filteredSections: [],
      newSection: {
        section_name: '',
        description: ''
      },
      newEbook: {
        title: '',
        content: '',
        author: ''
      },
      showAddSectionForm: false,
      showAddEbookFormFlag: false,
      currentSectionId: null,
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
    toggleAddSectionForm() {
      this.showAddSectionForm = !this.showAddSectionForm;
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
        this.newSection = {
          section_name: '',
          description: ''
        };
        this.showAddSectionForm = false;
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
        this.fetchSections();
      } catch (error) {
        console.error('Error deleting section:', error);
        this.error = 'Failed to delete section.';
      }
    },
    async updateSection(sectionId) {
      // Your update logic here
    },
    showAddEbookForm(sectionId) {
      this.showAddEbookFormFlag = true;
      this.currentSectionId = sectionId;
    },
    async addEbook(sectionId) {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/sections/${sectionId}/ebooks`, {
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
        this.showAddEbookFormFlag = false;
      } catch (error) {
        console.error('Error adding ebook:', error);
        this.error = 'Failed to add ebook.';
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
