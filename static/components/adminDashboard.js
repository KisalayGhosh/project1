import Section from "./Section.js";
import Request from "./Request.js";
import Feedback from "./Feedback.js";
import IssuedEbook from "./IssuedEbook.js";

export default {
  template: `
    <div>
      <h1>Admin Dashboard</h1>

      <!-- Manage Sections Card -->
      <div class="card">
        <h2>Manage Sections</h2>
        <button @click="toggleSectionManagement">Manage Sections</button>
        <div v-if="showSectionManagement">
          <!-- Display current sections here -->
          <div v-for="section in sections" :key="section.section_id" class="section-card">
            <h3>{{ section.section_name }}</h3>
            <p>{{ section.description }}</p>
            <!-- Add button for editing section -->
            <button @click="editSection(section)">Edit</button>
            <!-- Add button for deleting section -->
            <button @click="deleteSection(section.section_id)">Delete</button>
          </div>
        </div>
      </div>

      <!-- Manage Requests Card -->
      <div class="card">
        <h2>Manage Requests</h2>
        <!-- Example: Display requests here -->
        <div v-for="request in requests" :key="request.request_id" class="request-card">
          <h3>User: {{ request.user.username }}</h3>
          <p>Ebook Title: {{ request.ebook.title }}</p>
          <p>Status: {{ request.status }}</p>
        </div>
      </div>

      <!-- Manage Feedback Card -->
      <div class="card">
        <h2>Manage Feedback</h2>
        <!-- Example: Display feedback here -->
        <div v-for="feedback in feedbacks" :key="feedback.feedback_id" class="feedback-card">
          <h3>User: {{ feedback.user.username }}</h3>
          <p>Ebook Title: {{ feedback.ebook.title }}</p>
          <p>Rating: {{ feedback.rating }}</p>
          <p>Comment: {{ feedback.comment }}</p>
        </div>
      </div>

      <!-- Manage Issued Ebooks Card -->
      <div class="card">
        <h2>Manage Issued Ebooks</h2>
        <!-- Example: Display issued ebooks here -->
        <div v-for="issuedEbook in issuedEbooks" :key="issuedEbook.issue_id" class="issued-ebook-card">
          <h3>User: {{ issuedEbook.user.username }}</h3>
          <p>Ebook Title: {{ issuedEbook.ebook.title }}</p>
          <p>Issue Date: {{ issuedEbook.issue_date }}</p>
          <p>Status: {{ issuedEbook.status }}</p>
        </div>
      </div>

      <!-- Modal for editing section -->
      <div v-if="editingSection" class="modal">
        <h2>Edit Section</h2>
        <form @submit.prevent="saveEditedSection">
          <label>Section Name</label>
          <input type="text" v-model="editingSection.section_name" required>
          <label>Description</label>
          <textarea v-model="editingSection.description"></textarea>
          <button type="submit">Save</button>
          <button @click="cancelEdit">Cancel</button>
        </form>
      </div>
    </div>
  `,
  data() {
    return {
      showSectionManagement: false,
      sections: [],
      requests: [],
      feedbacks: [],
      issuedEbooks: [],
      editingSection: null // Track the section being edited
    };
  },
  mounted() {
    // Fetch sections, requests, feedback, and issued ebooks when component is mounted
    this.fetchSections();
    this.fetchRequests();
    this.fetchFeedback();
    this.fetchIssuedEbooks();
  },
  methods: {
    // Section management methods
    fetchSections() {
      fetch('/sections-details')
        .then(response => response.json())
        .then(data => {
          this.sections = data;
        })
        .catch(error => {
          console.error('Error fetching sections:', error);
        });
    },
    toggleSectionManagement() {
      this.showSectionManagement = !this.showSectionManagement;
    },
    editSection(section) {
      // Assign the section to editingSection to enable editing mode
      this.editingSection = { ...section }; // Use spread operator to create a copy
    },
    saveEditedSection() {
      fetch(`/sections/${this.editingSection.section_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': localStorage.getItem('token')
        },
        body: JSON.stringify({
          section_name: this.editingSection.section_name,
          description: this.editingSection.description
        })
      })
      .then(response => {
        if (response.ok) {
          // Refresh sections after edit
          this.fetchSections();
          this.editingSection = null; // Clear the editing state
        } else {
          console.error('Failed to update section');
        }
      })
      .catch(error => {
        console.error('Error updating section:', error);
      });
    },
    cancelEdit() {
      // Clear editing state
      this.editingSection = null;
    },
    deleteSection(sectionId) {
      // Implement delete functionality
      fetch(`/sections/${sectionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': localStorage.getItem('token')
        }
      })
      .then(response => {
        if (response.ok) {
          // Refresh sections after delete
          this.fetchSections();
        } else {
          console.error('Failed to delete section');
        }
      })
      .catch(error => {
        console.error('Error deleting section:', error);
      });
    },

    // Request management methods
    fetchRequests() {
      fetch('/requests')
        .then(response => response.json())
        .then(data => {
          this.requests = data;
        })
        .catch(error => {
          console.error('Error fetching requests:', error);
        });
    },

    // Feedback management methods
    fetchFeedback() {
      fetch('/feedback')
        .then(response => response.json())
        .then(data => {
          this.feedbacks = data;
        })
        .catch(error => {
          console.error('Error fetching feedback:', error);
        });
    },

    // Issued ebooks management methods
    fetchIssuedEbooks() {
      fetch('/issued_ebooks')
        .then(response => response.json())
        .then(data => {
          this.issuedEbooks = data;
        })
        .catch(error => {
          console.error('Error fetching issued ebooks:', error);
        });
    }
    // Add methods for handling create, update, and delete operations for requests, feedback, and issued ebooks
  }
};



