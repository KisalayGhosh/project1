export default {
  props: [],
  template: `
    <div class="container my-4">
      <h2 class="mb-4">Available Ebooks</h2>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>
      <table class="table table-striped" v-if="availableEbooks.length > 0">
        <thead>
          <tr>
            <th>Book Title</th>
            <th>Author</th>
            <th>Section</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ebook in availableEbooks" :key="ebook.id">
            <td>{{ ebook.title }}</td>
            <td>{{ ebook.author }}</td>
            <td>{{ ebook.section_name }}</td>
            <td>
              <button class="btn btn-primary" @click="requestEbook(ebook.id)">Request</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="alert alert-info">No ebooks available.</div>
    </div>
  `,
  data() {
    return {
      availableEbooks: [],
      error: null,
      success: null,
    };
  },
  created() {
    this.fetchAvailableEbooks();
  },
  methods: {
    async fetchAvailableEbooks() {
      try {
        const response = await fetch(`http://127.0.0.1:5000/ebooks`);
        if (!response.ok) {
          throw new Error('Failed to fetch available ebooks.');
        }
        const data = await response.json();
        this.availableEbooks = data;
      } catch (error) {
        console.error('Error fetching available ebooks:', error);
        this.error = 'Failed to load ebooks.';
      }
    },
    async requestEbook(ebookId) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch('/requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': token,
          },
          body: JSON.stringify({ ebook_id: ebookId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to request ebook.');
        }

        this.success = 'Ebook requested successfully!';
        setTimeout(() => { this.success = null; }, 3000); // Hide success message after 3 seconds

      } catch (error) {
        console.error('Error requesting ebook:', error);
        this.error = 'Failed to request ebook.';
      }
    }
  }
};